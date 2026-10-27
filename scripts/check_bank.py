#!/usr/bin/env python3
"""Sanity checks for questions.js against guide.js. Exit code 1 on any failure.

Usage: python3 scripts/check_bank.py

Two item types live in the bank:
  MC (no `type`):  4 options, `correct` is an int 0-3
  MR (type 'mr'):  5 options, `correct` is a sorted list of 2 distinct ints 0-4; the UI adds
                   "(Choose two.)", so the stem must not say "choose two" / "select two"
Answer-cue gates (hint, absolute words, option-length strategies) live in check_cues.py,
which is a separate command; this script does not run it.
"""
import collections, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import bankio

ROOT = bankio.ROOT
QUOTA = {'D1': 16, 'D2': 11, 'D3': 12, 'D4': 12, 'D5': 9}
MIN_PER_TS = 18
MIN_POOL_RATIO = 8          # each domain pool must cover 8 disjoint mocks
LONGEST_CORRECT = (0.15, 0.30)  # MC only: share of items whose key is the longest option; chance is 0.25,
                                # too high teaches 'pick the longest', too low teaches 'never pick it'
MC_POSITION = (0.20, 0.30)  # MC: each key position 0-3 holds 20-30% of MC keys (chance 25%)
MR_POSITION = (0.25, 0.55)  # MR: each index 0-4 is a key in 25-55% of MR items. Chance is 2/5 = 40%;
                            # the band is +-15 points because the MR pool is small and each item fills two slots
MR_TWO_LONGEST_MAX = 0.20   # MR: share of items whose two keys are strictly the two longest options (chance 10%)
MR_GATE_MIN = 10            # the MR position and two-longest gates apply once there are this many MR items
                            # (below that one item swings the shares by 10+ points); they are always reported
DUPE_SIMILARITY = 0.6
# ids removed from the bank; never reuse them (old saves may still hold them)
RETIRED = {f'hunt-{i:02d}' for i in range(12)} | {'f07-11', 'f07-13', 'mx2-12', 'mx2-13'}
POSITION_RX = re.compile(r'\b(first|second|third|fourth|fifth|last|other two|remaining|above) (option|answer|choice)s?\b'
                         r'|\b(option|answer|choice) [A-E1-5]\b', re.I)
CHOOSE_TWO_RX = re.compile(r'\b(choose|select|pick|mark)\s+(two|2)\b', re.I)
WORD_RX = re.compile(r'[a-z0-9_]+')


def load_bank():
    return bankio.load()


def is_mr(q):
    return q.get('type') == 'mr'


def keys(q):
    """the key indices of an item as a list (MC: one, MR: two)"""
    return list(q['correct']) if is_mr(q) else [q['correct']]


def shape_errors(q):
    """structural problems with one item (type, options, key, stem); [] when it is well formed"""
    t, opts, c = q.get('type'), q.get('options'), q.get('correct')
    if t not in (None, 'mr'): return [f'unknown type {t!r}']
    n = 5 if t == 'mr' else 4
    if not (isinstance(opts, list) and len(opts) == n and all(isinstance(o, str) and o.strip() for o in opts)):
        return [f'needs exactly {n} non-empty options']
    errs = []
    if t == 'mr':
        if not (isinstance(c, list) and len(c) == 2 and all(type(k) is int and 0 <= k < 5 for k in c) and c[0] < c[1]):
            errs.append('bad correct (MR needs 2 sorted, distinct indices 0-4)')
        if CHOOSE_TWO_RX.search(q.get('q', '')):
            errs.append('MR stem says "choose/select two" (the UI adds it)')
    elif not (type(c) is int and 0 <= c < 4):
        errs.append('bad correct (MC needs an int 0-3)')
    if len({o.strip().lower() for o in opts}) < n: errs.append('duplicate options')
    return errs


def longest_is_correct(q):
    """MC: the key is strictly the longest option"""
    lens = [len(o) for o in q['options']]
    return lens[q['correct']] == max(lens) and lens.count(max(lens)) == 1


def two_longest_are_keys(q):
    """MR: both keys are strictly longer than every distractor"""
    lens, k = [len(o) for o in q['options']], set(q['correct'])
    return min(lens[i] for i in k) > max(l for i, l in enumerate(lens) if i not in k)


def balance_errors(items):
    """key-position and option-length gates over well-formed items of both types"""
    errs = []
    mc = [q for q in items if not is_mr(q)]
    mr = [q for q in items if is_mr(q)]
    if mc:
        pos = collections.Counter(q['correct'] for q in mc)
        lo, hi = MC_POSITION
        errs += [f'MC key position {k} holds {pos[k]}/{len(mc)} answers (keep each between {lo:.0%} and {hi:.0%})'
                 for k in range(4) if not lo <= pos[k] / len(mc) <= hi]
        lc = sum(longest_is_correct(q) for q in mc)
        lo, hi = LONGEST_CORRECT
        if not lo <= lc / len(mc) <= hi:
            errs.append(f'MC key is the longest option in {lc}/{len(mc)} ({lc / len(mc):.0%}, keep it between {lo:.0%} and {hi:.0%})')
    if len(mr) >= MR_GATE_MIN:
        pos = collections.Counter(k for q in mr for k in q['correct'])
        lo, hi = MR_POSITION
        errs += [f'MR index {k} is a key in {pos[k]}/{len(mr)} MR items (keep each between {lo:.0%} and {hi:.0%})'
                 for k in range(5) if not lo <= pos[k] / len(mr) <= hi]
        tl = sum(two_longest_are_keys(q) for q in mr)
        if tl / len(mr) > MR_TWO_LONGEST_MAX:
            errs.append(f'MR keys are the two longest options in {tl}/{len(mr)} ({tl / len(mr):.0%}, max {MR_TWO_LONGEST_MAX:.0%})')
    return errs


def summary(items):
    mc = [q for q in items if not is_mr(q)]
    mr = [q for q in items if is_mr(q)]
    s = (f'MC {len(mc)} · key is longest {sum(longest_is_correct(q) for q in mc)}/{len(mc)} · '
         f'key positions {dict(sorted(collections.Counter(q["correct"] for q in mc).items()))}\n'
         f'MR {len(mr)} ({len(mr) / max(1, len(items)):.1%} of items, share not gated)')
    if mr:
        s += (f' · both keys are the two longest {sum(two_longest_are_keys(q) for q in mr)}/{len(mr)} · '
              f'key index counts {dict(sorted(collections.Counter(k for q in mr for k in q["correct"]).items()))}'
              + ('' if len(mr) >= MR_GATE_MIN else f' (MR balance gates start at {MR_GATE_MIN} items)'))
    return s


def guide_scenario_domains():
    """scenario id -> the domains it covers, from guide.js"""
    src = (ROOT / 'guide.js').read_text()
    return {int(i): set(d.replace("'", '').replace(' ', '').split(','))
            for i, d in re.findall(r"\{ id: (\d), name: '[^']*', domains: \[([^\]]*)\]", src)}


def guide_ts_ids():
    return set(re.findall(r"\{ id: '(\d\.\d)'", (ROOT / 'guide.js').read_text()))


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


def check(bank, valid_ts, scen):
    """(errors, well-formed items, per-domain counts) for a whole bank"""
    errors, ids = [], collections.Counter()
    per_ts, per_dom, allq = collections.Counter(), collections.Counter(), []
    for key, qs in bank.items():
        for i, q in enumerate(qs):
            where = f'{key}[{i}]'
            if 'id' not in q: errors.append(f'{where}: missing id'); continue
            where += f' {q["id"]}'
            ids[q['id']] += 1
            if q['id'] in RETIRED: errors.append(f'{where}: reuses retired id')
            shape = shape_errors(q)
            errors += [f'{where}: {e}' for e in shape]
            if shape: continue
            if q.get('ts') not in valid_ts: errors.append(f'{where}: bad ts {q.get("ts")}')
            if q.get('scenario') not in range(0, 7): errors.append(f'{where}: bad scenario {q.get("scenario")}')
            if q.get('scenario') and 'D' + str(q.get('ts', '0'))[0] not in scen.get(q['scenario'], ()):
                errors.append(f'{where}: scenario {q["scenario"]} does not cover its domain (use a covering scenario or 0)')
            if q.get('oos'): errors.append(f'{where}: out-of-scope questions are not kept in the bank')
            if POSITION_RX.search(q.get('explanation', '') + ' ' + q.get('hint', '')):
                errors.append(f'{where}: explanation refers to an option by position (options are shuffled)')
            per_ts[q.get('ts')] += 1
            per_dom['D' + str(q.get('ts', '0'))[0]] += 1
            allq.append(q)
    errors += [f'duplicate id {i}' for i, c in ids.items() if c > 1]
    errors += [f'task statement {t} has {per_ts[t]} questions (< {MIN_PER_TS})' for t in sorted(valid_ts) if per_ts[t] < MIN_PER_TS]
    errors += [f'{d} pool {per_dom[d]} < {MIN_POOL_RATIO}x quota {c}' for d, c in QUOTA.items() if per_dom[d] < c * MIN_POOL_RATIO]
    errors += balance_errors(allq)
    errors += [f'near-duplicate stems ({s:.2f}): "{a[:60]}…" / "{b[:60]}…"' for a, b, s in near_dupes(allq)]
    return errors, allq, per_dom


def main():
    errors, allq, per_dom = check(load_bank(), guide_ts_ids(), guide_scenario_domains())
    print(f'{len(allq)} questions · by domain {dict(sorted(per_dom.items()))}')
    print(summary(allq))
    if errors:
        print('\n'.join('FAIL ' + e for e in errors)); sys.exit(1)
    print('OK')


if __name__ == '__main__':
    main()
