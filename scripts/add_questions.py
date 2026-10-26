#!/usr/bin/env python3
"""Merge a reviewed batch of new questions (JSON array) into questions.js.

Usage: python3 scripts/add_questions.py batch.json [batch2.json ...]

Each question gets a frozen id `dN-NNN` (N = domain from its task statement, NNN continues the
highest id used so far, retired ids included) and lands in the storage bucket `bank-dN`.
The key is moved to the least-used answer position so positions stay balanced.
"""
import collections, json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import bankio
from check_batch import check

FIELDS = ['q', 'options', 'correct', 'explanation', 'hint', 'difficulty', 'tags', 'id', 'ts', 'scenario', 'src']


def main(paths):
    bank = bankio.load()
    existing = [q for v in bank.values() for q in v]
    pos = collections.Counter(q['correct'] for q in existing)
    top = collections.Counter()
    for q in existing:
        m = re.fullmatch(r'd(\d)-(\d{3})', q['id'])
        if m: top[m[1]] = max(top[m[1]], int(m[2]))
    added = 0
    for p in paths:
        items = json.loads(Path(p).read_text())
        errs, _, _ = check(items, existing)
        if errs: sys.exit(f'{p} fails check_batch:\n' + '\n'.join(errs))
        for q in items:
            d = q['ts'][0]
            top[d] += 1
            want = min(range(4), key=lambda k: (pos[k], k))
            opts = q['options'][:]
            opts[want], opts[q['correct']] = opts[q['correct']], opts[want]
            q = {**q, 'options': opts, 'correct': want, 'id': f'd{d}-{top[d]:03d}'}
            pos[want] += 1
            bank.setdefault(f'bank-d{d}', []).append({k: q[k] for k in FIELDS if k in q})
            existing.append(q)
            added += 1
    bankio.save(bank)
    print(f'added {added} questions · bank now {sum(len(v) for v in bank.values())}')


if __name__ == '__main__':
    main(sys.argv[1:])
