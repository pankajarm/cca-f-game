#!/usr/bin/env python3
"""Check a batch of new questions (a JSON array) before it is merged into questions.js.

Usage: python3 scripts/check_batch.py path/to/batch.json
MC item: {q, options[4], correct 0-3, explanation, hint, difficulty core|hard, tags[], ts, scenario 1-6|0, src}
MR item: the same plus type 'mr', with options[5] and correct [i, j] (sorted, distinct, 0-4);
         the stem must not say "choose two" / "select two" (the UI adds "(Choose two.)").
Key positions are not checked here: add_questions.py places keys when it merges.
The bank-wide length gates (MC key-is-longest, MR two-longest) apply to the batch too.
"""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import bankio
from check_bank import (guide_ts_ids, guide_scenario_domains, POSITION_RX, near_dupes, shape_errors, is_mr,
                        longest_is_correct, two_longest_are_keys, LONGEST_CORRECT, MR_TWO_LONGEST_MAX, MR_GATE_MIN)

KEYS = {'q', 'options', 'correct', 'explanation', 'hint', 'difficulty', 'tags', 'ts', 'scenario', 'src'}


def check(items, existing, valid_ts=None, scen=None):
    valid_ts = guide_ts_ids() if valid_ts is None else valid_ts
    scen = guide_scenario_domains() if scen is None else scen
    errs, ok = [], []
    for i, q in enumerate(items):
        w = f'item {i} ({q.get("ts")})'
        miss = KEYS - set(q)
        if miss: errs.append(f'{w}: missing {sorted(miss)}')
        shape = shape_errors(q)
        errs += [f'{w}: {e}' for e in shape]
        if q.get('ts') not in valid_ts: errs.append(f'{w}: bad ts')
        if q.get('scenario') not in range(0, 7): errs.append(f'{w}: bad scenario')
        if q.get('scenario') and 'D' + str(q.get('ts', '0'))[0] not in scen.get(q['scenario'], ()):
            errs.append(f'{w}: scenario {q["scenario"]} does not cover this domain')
        if q.get('difficulty') not in ('core', 'hard'): errs.append(f'{w}: difficulty must be core or hard')
        if POSITION_RX.search(q.get('explanation', '') + ' ' + q.get('hint', '')):
            errs.append(f'{w}: explanation/hint refers to an option by position or letter (options are shuffled)')
        if len(q.get('q', '')) < 120: errs.append(f'{w}: stem too short to be scenario-framed')
        if not shape and not miss: ok.append(q)
    mc = [q for q in ok if not is_mr(q)]
    mr = [q for q in ok if is_mr(q)]
    lc, n = sum(longest_is_correct(q) for q in mc), len(mc)
    lo, hi = LONGEST_CORRECT
    if n and lc / n > hi: errs.append(f'MC key is the longest option in {lc}/{n} items (max {hi:.0%}) — lengthen distractors or tighten keys')
    if n >= 20 and lc / n < lo: errs.append(f'MC key is the longest option in only {lc}/{n} items (min {lo:.0%}) — "never the longest" is a cue too')
    tl = sum(two_longest_are_keys(q) for q in mr)
    if len(mr) >= MR_GATE_MIN and tl / len(mr) > MR_TWO_LONGEST_MAX:
        errs.append(f'MR keys are the two longest options in {tl}/{len(mr)} items (max {MR_TWO_LONGEST_MAX:.0%})')
    stems = [q for q in items if isinstance(q.get('q'), str)]
    for a, b, s in near_dupes(stems, existing):
        errs.append(f'near-duplicate stem (similarity {s:.2f}): "{a[:70]}…" vs "{b[:70]}…"')
    return errs, f'MC {n} · key is longest {lc}/{n} · MR {len(mr)} · both keys are the two longest {tl}/{len(mr)}'


def main():
    items = json.loads(Path(sys.argv[1]).read_text())
    existing = [q for v in bankio.load().values() for q in v]
    errs, info = check(items, existing)
    print(f'{len(items)} items · {info}')
    if errs:
        print('\n'.join('FAIL ' + e for e in errs)); sys.exit(1)
    print('OK')


if __name__ == '__main__':
    main()
