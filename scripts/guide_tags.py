#!/usr/bin/env python3
"""One-time, hand-reviewed mapping of existing questions to the official
CCAR-F exam guide (v1.0): primary task statement + scenario (1-6, 0 = general).

Run:  python3 scripts/guide_tags.py          # report coverage only
      python3 scripts/guide_tags.py --write  # stamp id/ts/scenario into questions.js
"""
import json, sys, collections, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
QFILE = ROOT / 'questions.js'

PREFIX = {f'floor-{i:02d}': f'f{i:02d}' for i in range(1, 11)}
PREFIX.update({'exam-mix-1': 'mx1', 'exam-mix-2': 'mx2', 'hunt': 'hunt', 'guide-extra': 'gx'})

# key -> list of (task statement, scenario[, 'oos']) by original position
TAGS = {
 'floor-01': [('1.1',1),('1.1',6),('1.1',4),('1.1',6),('1.1',1),('1.1',3),('1.4',1),('1.1',1),
              ('1.1',1),('1.1',4),('1.1',5),('1.1',1),('2.2',1),('1.1',4),('1.1',4)],
 'floor-02': [('1.3',1),('1.3',3),('1.3',5),('1.7',2),('1.2',3),('1.2',3),('1.3',4),('1.3',3),
              ('5.6',3),('1.2',3),('1.2',1),('1.3',6),('1.2',1),('1.2',3),('5.3',3)],
 'floor-03': [('1.5',1),('1.5',2),('1.5',1),('1.5',1),('1.5',5),('3.2',4),('1.5',4),('1.5',2),
              ('1.5',2),('1.7',2),('1.4',1),('1.5',6),('1.4',1),('1.5',1),('1.5',4)],
 'floor-04': [('2.1',1),('2.3',1),('2.3',1),('2.2',6),('2.2',1),('2.3',6),('2.3',1),('2.4',4),
              ('2.5',5),('2.4',4),('2.4',4),('2.5',4),('2.2',3),('2.3',1),('2.3',0)],
 'floor-05': [('3.1',2),('3.1',2),('3.2',2),('3.1',2),('3.1',2),('3.2',2),('3.2',2),('3.1',2),
              ('3.2',2),('3.2',4),('3.3',2),('3.6',5),('3.2',2),('3.2',2),('3.2',4)],
 'floor-06': [('3.4',2),('3.6',5),('3.6',5),('3.6',5),('3.6',5),('3.6',5),('4.6',2),('3.6',5),
              ('3.6',5),('3.6',5),('4.6',5),('4.5',5),('4.5',5),('3.5',5),('3.4',2)],
 'floor-07': [('4.1',5),('4.3',6),('4.2',1),('4.1',5),('4.3',6),('4.2',0),('4.3',6),('4.3',6),
              ('4.3',6),('4.3',6),('5.1',4),('4.2',0,'oos'),('4.3',6),('4.2',0,'oos'),('4.3',6)],
 'floor-08': [('4.4',6),('4.4',6),('4.4',6),('4.6',5),('4.5',6),('4.6',5),('4.5',6),('4.4',6),
              ('4.5',6),('4.4',6),('4.6',5),('4.4',6),('4.5',0),('4.4',6),('4.5',6)],
 'floor-09': [('5.1',1),('5.1',1),('5.1',1),('5.1',3),('5.2',1),('2.2',1),('5.2',1),('5.2',1),
              ('5.3',3),('5.3',6),('5.2',1),('5.1',1),('1.4',1),('5.4',4),('5.2',1)],
 'floor-10': [('5.4',2),('5.5',6),('5.4',4),('5.6',3),('5.5',6),('5.4',3),('5.5',6),('5.6',3),
              ('5.4',6),('5.6',3),('5.1',1),('5.1',3),('5.5',6),('5.6',3),('5.6',3)],
 'exam-mix-1': [('1.1',1),('4.3',6),('1.2',3),('1.5',1),('2.2',6),('2.4',3),('2.1',1),('3.2',2),
                ('1.3',3),('5.1',1),('5.5',6),('4.3',3),('4.3',1),('3.3',2),('1.3',3)],
 'exam-mix-2': [('1.3',3),('4.6',5),('1.1',5),('1.3',4),('2.4',4),('2.4',4),('3.2',4),('3.1',5),
                ('3.4',2),('3.6',5),('4.3',6),('4.4',6),('4.5',5,'oos'),('5.1',1,'oos'),('5.1',4)],
}


def load():
    t = QFILE.read_text()
    start = t.index('{', t.index('window.BANK'))
    end = t.rindex('}') + 1
    return t[:start], json.loads(t[start:end]), t[end:]


def main():
    head, bank, tail = load()
    write = '--write' in sys.argv
    for key, qs in bank.items():
        pre = PREFIX[key]
        tags = TAGS.get(key)
        if tags is not None and len(tags) != len(qs):
            sys.exit(f'{key}: {len(tags)} tags for {len(qs)} questions')
        for i, q in enumerate(qs):
            q.setdefault('id', f'{pre}-{i:02d}')
            if tags is not None:
                tg = tags[i]
                q['ts'], q['scenario'] = tg[0], tg[1]
                if len(tg) > 2 and tg[2] == 'oos': q['oos'] = True
    ids = [q['id'] for qs in bank.values() for q in qs]
    assert len(ids) == len(set(ids)), 'duplicate ids'

    ts = collections.Counter(); sc = collections.Counter(); dom = collections.Counter()
    for k, qs in bank.items():
        for q in qs:
            if 'ts' not in q or q.get('oos'): continue
            ts[q['ts']] += 1; sc[q['scenario']] += 1; dom[q['ts'][0]] += 1
    print('domains', dict(sorted(dom.items())))
    print('scenarios', dict(sorted(sc.items())))
    print('task statements', dict(sorted(ts.items())))
    if write:
        body = json.dumps(bank, indent=1, ensure_ascii=False)
        QFILE.write_text(head + body + tail)
        print('wrote', QFILE)

if __name__ == '__main__':
    main()
