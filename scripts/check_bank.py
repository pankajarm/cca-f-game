#!/usr/bin/env python3
"""Sanity checks for questions.js against guide.js. Exit code 1 on any failure.

Usage: python3 scripts/check_bank.py
"""
import collections, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import bankio

ROOT = bankio.ROOT
QUOTA = {'D1': 16, 'D2': 11, 'D3': 12, 'D4': 12, 'D5': 9}
MIN_PER_TS = 18
MIN_POOL_RATIO = 8          # each domain pool must cover 8 disjoint mocks
LONGEST_CORRECT = (0.15, 0.30)  # share of questions whose key is the longest option; chance is 0.25,
                                # too high teaches 'pick the longest', too low teaches 'never pick it'
DUPE_SIMILARITY = 0.6
# ids removed from the bank; never reuse them (old saves may still hold them)
RETIRED = {f'hunt-{i:02d}' for i in range(12)} | {'f07-11', 'f07-13', 'mx2-12', 'mx2-13'}
POSITION_RX = re.compile(r'\b(first|second|third|fourth|last|other two|remaining|above) (option|answer|choice)s?\b'
                         r'|\b(option|answer|choice) [A-D1-4]\b', re.I)
WORD_RX = re.compile(r'[a-z0-9_]+')


def load_bank():
    return bankio.load()


def guide_scenario_domains():
    """scenario id -> the domains it covers, from guide.js"""
    src = (ROOT / 'guide.js').read_text()
    return {int(i): set(d.replace("'", '').replace(' ', '').split(','))
            for i, d in re.findall(r"\{ id: (\d), name: '[^']*', domains: \[([^\]]*)\]", src)}


def guide_ts_ids():
    return set(re.findall(r"\{ id: '(\d\.\d)'", (ROOT / 'guide.js').read_text()))


def longest_is_correct(q):
    lens = [len(o) for o in q['options']]
    return lens[q['correct']] == max(lens) and lens.count(max(lens)) == 1


def _words(s):
    return set(WORD_RX.findall(s.lower()))


def near_dupes(items, others=()):
    """pairs of stems whose word sets overlap above DUPE_SIMILARITY (items vs items and vs others)"""
    out, ws = [], [(q['q'], _words(q['q'])) for q in items]
    wo = [(q['q'], _words(q['q'])) for q in others]
    for i, (a, wa) in enumerate(ws):
        for b, wb in ws[i + 1:] + wo:
            if a == b and wb is wa: continue
            s = len(wa & wb) / max(1, len(wa | wb))
            if s > DUPE_SIMILARITY: out.append((a, b, s))
    return out


def main():
    bank, valid_ts, errors = load_bank(), guide_ts_ids(), []
    scen = guide_scenario_domains()
    ids = collections.Counter()
    per_ts, per_dom = collections.Counter(), collections.Counter()
    pos, longest, allq = collections.Counter(), 0, []
    for key, qs in bank.items():
        for i, q in enumerate(qs):
            where = f'{key}[{i}]'
            if 'id' not in q: errors.append(f'{where}: missing id'); continue
            ids[q['id']] += 1
            if q['id'] in RETIRED: errors.append(f'{where}: reuses retired id {q["id"]}')
            if len(q.get('options', [])) != 4: errors.append(f'{where}: needs 4 options'); continue
            if not (isinstance(q.get('correct'), int) and 0 <= q['correct'] < 4): errors.append(f'{where}: bad correct'); continue
            if q.get('ts') not in valid_ts: errors.append(f'{where}: bad ts {q.get("ts")}')
            if q.get('scenario') not in range(0, 7): errors.append(f'{where}: bad scenario {q.get("scenario")}')
            if q.get('scenario') and 'D' + str(q.get('ts', '0'))[0] not in scen.get(q['scenario'], ()):
                errors.append(f'{where} {q["id"]}: scenario {q["scenario"]} does not cover its domain (use a covering scenario or 0)')
            if q.get('oos'): errors.append(f'{where}: out-of-scope questions are not kept in the bank')
            if POSITION_RX.search(q.get('explanation', '') + ' ' + q.get('hint', '')):
                errors.append(f'{where} {q["id"]}: explanation refers to an option by position (options are shuffled)')
            per_ts[q.get('ts')] += 1
            per_dom['D' + str(q.get('ts', '0'))[0]] += 1
            pos[q['correct']] += 1
            longest += longest_is_correct(q)
            allq.append(q)
    n = len(allq)
    errors += [f'duplicate id {i}' for i, c in ids.items() if c > 1]
    errors += [f'task statement {t} has {per_ts[t]} questions (< {MIN_PER_TS})' for t in sorted(valid_ts) if per_ts[t] < MIN_PER_TS]
    errors += [f'{d} pool {per_dom[d]} < {MIN_POOL_RATIO}x quota {c}' for d, c in QUOTA.items() if per_dom[d] < c * MIN_POOL_RATIO]
    lo, hi = LONGEST_CORRECT
    if n and not lo <= longest / n <= hi:
        errors.append(f'correct option is the longest in {longest}/{n} ({longest / n:.0%}, keep it between {lo:.0%} and {hi:.0%})')
    errors += [f'key position {k} holds {c}/{n} answers (keep each between 20% and 30%)' for k, c in pos.items() if not .2 <= c / n <= .3]
    errors += [f'near-duplicate stems ({s:.2f}): "{a[:60]}…" / "{b[:60]}…"' for a, b, s in near_dupes(allq)]
    print(f'{n} questions · by domain {dict(sorted(per_dom.items()))} · key is longest {longest}/{n} · key positions {dict(sorted(pos.items()))}')
    if errors:
        print('\n'.join('FAIL ' + e for e in errors)); sys.exit(1)
    print('OK')


if __name__ == '__main__':
    main()
