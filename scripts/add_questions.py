#!/usr/bin/env python3
"""Merge a reviewed batch of new questions (JSON array) into questions.js.

Usage: python3 scripts/add_questions.py batch.json [batch2.json ...]

Each question gets a frozen id `dN-NNN` (N = domain from its task statement, NNN continues the
highest id used so far, retired ids included) and lands in the storage bucket `bank-dN`.
Only the new items are reshuffled so key positions stay balanced:
  MC: the key moves to the least-used answer position among MC items.
  MR (type 'mr'): the options are permuted so the key pair lands on the two least-used key indices
      among MR items (ties: the least-used pair, then the lowest pair); distractors keep their order.
"""
import collections, itertools, json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import bankio
from check_batch import check
from check_bank import is_mr

FIELDS = ['type', 'q', 'options', 'correct', 'explanation', 'hint', 'difficulty', 'tags', 'id', 'ts', 'scenario', 'src', 'rev']


def place_mc(q, pos):
    want = min(range(4), key=lambda k: (pos[k], k))
    opts = q['options'][:]
    opts[want], opts[q['correct']] = opts[q['correct']], opts[want]
    pos[want] += 1
    return {**q, 'options': opts, 'correct': want}


def place_mr(q, pos, pairs):
    a, b = min(itertools.combinations(range(5), 2), key=lambda p: (pos[p[0]] + pos[p[1]], pairs[p], p))
    keys = [q['options'][i] for i in q['correct']]
    rest = iter(o for i, o in enumerate(q['options']) if i not in q['correct'])
    opts = [keys[0] if i == a else keys[1] if i == b else next(rest) for i in range(5)]
    pos[a] += 1; pos[b] += 1; pairs[(a, b)] += 1
    return {**q, 'options': opts, 'correct': [a, b]}


def merge(bank, items_list):
    """merge already-checked batches into bank in place; returns the number added"""
    existing = [q for v in bank.values() for q in v]
    mc_pos = collections.Counter(q['correct'] for q in existing if not is_mr(q))
    mr_pos = collections.Counter(k for q in existing if is_mr(q) for k in q['correct'])
    mr_pairs = collections.Counter(tuple(q['correct']) for q in existing if is_mr(q))
    top = collections.Counter()
    for q in existing:
        m = re.fullmatch(r'd(\d)-(\d{3})', q['id'])
        if m: top[m[1]] = max(top[m[1]], int(m[2]))
    added = 0
    for items in items_list:
        for q in items:
            d = q['ts'][0]
            top[d] += 1
            q = place_mr(q, mr_pos, mr_pairs) if is_mr(q) else place_mc(q, mc_pos)
            q['id'] = f'd{d}-{top[d]:03d}'
            bank.setdefault(f'bank-d{d}', []).append({k: q[k] for k in FIELDS if k in q})
            added += 1
    return added


def main(paths):
    bank = bankio.load()
    existing = [q for v in bank.values() for q in v]
    batches = []
    for p in paths:
        items = json.loads(Path(p).read_text())
        errs, _ = check(items, existing)
        if errs: sys.exit(f'{p} fails check_batch:\n' + '\n'.join(errs))
        existing += items
        batches.append(items)
    added = merge(bank, batches)
    bankio.save(bank)
    print(f'added {added} questions · bank now {sum(len(v) for v in bank.values())}')


if __name__ == '__main__':
    main(sys.argv[1:])
