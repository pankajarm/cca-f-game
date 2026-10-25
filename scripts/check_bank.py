#!/usr/bin/env python3
"""Sanity checks for questions.js against guide.js. Exit code 1 on any failure.

Usage: python3 scripts/check_bank.py
"""
import collections, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QUOTA = {'D1': 16, 'D2': 11, 'D3': 12, 'D4': 12, 'D5': 9}
MIN_PER_TS = 4
MIN_POOL_RATIO = 1.5


def load_bank():
    src = (ROOT / 'questions.js').read_text()
    return json.loads(src[src.index('{', src.index('window.BANK')):src.rindex('}') + 1])


def guide_ts_ids():
    return set(re.findall(r"\{ id: '(\d\.\d)'", (ROOT / 'guide.js').read_text()))


def main():
    bank, valid_ts, errors = load_bank(), guide_ts_ids(), []
    ids = collections.Counter()
    per_ts, per_dom = collections.Counter(), collections.Counter()
    for key, qs in bank.items():
        for i, q in enumerate(qs):
            where = f'{key}[{i}]'
            if 'id' not in q: errors.append(f'{where}: missing id'); continue
            ids[q['id']] += 1
            if len(q.get('options', [])) != 4: errors.append(f'{where}: needs 4 options')
            if not (isinstance(q.get('correct'), int) and 0 <= q['correct'] < 4): errors.append(f'{where}: bad correct')
            if key == 'hunt': continue
            if q.get('ts') not in valid_ts: errors.append(f'{where}: bad ts {q.get("ts")}')
            if q.get('scenario') not in range(0, 7): errors.append(f'{where}: bad scenario {q.get("scenario")}')
            if not q.get('oos'):
                per_ts[q.get('ts')] += 1
                per_dom['D' + str(q.get('ts', '0'))[0]] += 1
    errors += [f'duplicate id {i}' for i, n in ids.items() if n > 1]
    errors += [f'task statement {t} has {per_ts[t]} in-scope questions (< {MIN_PER_TS})' for t in sorted(valid_ts) if per_ts[t] < MIN_PER_TS]
    errors += [f'{d} pool {per_dom[d]} < {MIN_POOL_RATIO}x quota {n}' for d, n in QUOTA.items() if per_dom[d] < n * MIN_POOL_RATIO]
    print(f'{sum(ids.values())} questions · in-scope by domain {dict(sorted(per_dom.items()))}')
    if errors:
        print('\n'.join('FAIL ' + e for e in errors)); sys.exit(1)
    print('OK')


if __name__ == '__main__':
    main()
