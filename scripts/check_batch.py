#!/usr/bin/env python3
"""Check a batch of new questions (a JSON array) before it is merged into questions.js.

Usage: python3 scripts/check_batch.py path/to/batch.json
Each item: {q, options[4], correct 0-3, explanation, hint, difficulty core|hard, tags[], ts, scenario 1-6|0, src}
"""
import json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import bankio
from check_bank import guide_ts_ids, POSITION_RX, near_dupes, longest_is_correct

KEYS = {'q', 'options', 'correct', 'explanation', 'hint', 'difficulty', 'tags', 'ts', 'scenario', 'src'}


def check(items, existing):
    errs, valid_ts = [], guide_ts_ids()
    for i, q in enumerate(items):
        w = f'item {i} ({q.get("ts")})'
        miss = KEYS - set(q)
        if miss: errs.append(f'{w}: missing {sorted(miss)}')
        if len(q.get('options', [])) != 4: errs.append(f'{w}: needs 4 options')
        if not (isinstance(q.get('correct'), int) and 0 <= q['correct'] < 4): errs.append(f'{w}: bad correct')
        if q.get('ts') not in valid_ts: errs.append(f'{w}: bad ts')
        if q.get('scenario') not in range(0, 7): errs.append(f'{w}: bad scenario')
        if q.get('difficulty') not in ('core', 'hard'): errs.append(f'{w}: difficulty must be core or hard')
        if POSITION_RX.search(q.get('explanation', '') + ' ' + q.get('hint', '')):
            errs.append(f'{w}: explanation/hint refers to an option by position or letter (options are shuffled)')
        if len(set(o.strip().lower() for o in q.get('options', []))) < 4: errs.append(f'{w}: duplicate options')
        if len(q.get('q', '')) < 120: errs.append(f'{w}: stem too short to be scenario-framed')
    n = len(items)
    lc = sum(longest_is_correct(q) for q in items if len(q.get('options', [])) == 4)
    if n and lc / n > 0.30: errs.append(f'correct option is the longest in {lc}/{n} items (max 30%) — lengthen distractors or tighten keys')
    if n >= 20 and lc / n < 0.15: errs.append(f'correct option is the longest in only {lc}/{n} items (min 15%) — "never the longest" is a cue too')
    for a, b, s in near_dupes(items, existing):
        errs.append(f'near-duplicate stem (similarity {s:.2f}): "{a[:70]}…" vs "{b[:70]}…"')
    return errs, lc, n


def main():
    items = json.loads(Path(sys.argv[1]).read_text())
    existing = [q for v in bankio.load().values() for q in v]
    errs, lc, n = check(items, existing)
    print(f'{n} items · correct-is-longest {lc}/{n}')
    if errs:
        print('\n'.join('FAIL ' + e for e in errs)); sys.exit(1)
    print('OK')


if __name__ == '__main__':
    main()
