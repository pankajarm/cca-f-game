#!/usr/bin/env python3
"""Answer-cue gates for questions.js: can a test-wise player find the key without knowing the topic?

Usage: python3 scripts/check_cues.py [--list]
  --list prints the items behind each flag; for a failing strategy, the items where it finds the key
  more often than chance, ranked by how much it beats chance (the cleanup targets).

Heuristic-gain gates. Each strategy is scored separately for MC and MR items as the expected accuracy
over ALL items of that type when a test-taker applies it, minus the chance baseline (MC 1/4; MR 1/10,
a pick being right only when it is exactly the key pair):
  follow-hint / avoid-hint     hint match = content-word overlap between hint and option. MC: the
                               unique best match (no unique best = no guidance). MR: the top-2 matches,
                               ties broken at random (no overlap at all = no guidance).
  pick-absolute / avoid-absolute   prefer options that do / do not contain an ABSOLUTE_RX word; the
                               player picks uniformly among the preferred options (MR: pairs inside the
                               preferred set, or pairs containing it when it has one option). All or no
                               options matching = no guidance.
  pick-/avoid-longest, pick-/avoid-shortest   by character length, ties broken at random.
'pick' takes the top option (MR: top two); 'avoid' picks uniformly among the rest (MR: pairs from the
other three). No guidance = uniform random guess, which scores exactly the baseline.
Gate: every gain <= MC_GAIN_MAX (MC) and <= MR_GAIN_MAX (MR, a smaller and noisier pool).
Also gated: a hint that shares a 12+ char run only with a key, and the same key text twice in one
task statement.
"""
import collections, itertools, math, re, sys
from difflib import SequenceMatcher
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import bankio

HINT_FRAGMENT = 12        # a hint may not share a 12+ character run with a key that no distractor shares
MC_GAIN_MAX = 2.0         # points above chance any single strategy may earn on MC items
MR_GAIN_MAX = 3.0         # same for MR items
ABSOLUTE_RX = re.compile(r'\b(always|never|only|all|every|guarantee[sd]?|completely|entirely)\b', re.I)
STOP = set('about above after again against their there these those which while would could should with without '
           'from into that this than then them they what when where your yours have has been being does doing '
           'tool tools model claude agent agents option options other using based'.split())
STRATEGIES = ['follow-hint', 'avoid-hint', 'pick-absolute', 'avoid-absolute',
              'pick-longest', 'avoid-longest', 'pick-shortest', 'avoid-shortest']


def is_mr(q):
    return q.get('type') == 'mr'


def keyset(q):
    return frozenset(q['correct']) if is_mr(q) else frozenset([q['correct']])


def words(s):
    return {w for w in re.findall(r'[a-z_]{5,}', s.lower()) if w not in STOP}


def run(s, t):
    m = SequenceMatcher(None, s.lower(), t.lower(), autojunk=False).find_longest_match(0, len(s), 0, len(t))
    return m.size


def hint_fragment(q):
    """the hint shares a 12+ char run with a key and only shorter ones with every distractor"""
    h, ks = q.get('hint', ''), keyset(q)
    runs = [run(h, o) for o in q['options']]
    k = max(runs[i] for i in ks)
    return k >= HINT_FRAGMENT and k > max(r for i, r in enumerate(runs) if i not in ks)


def hint_overlap(q):
    h = words(q.get('hint', ''))
    return [len(h & words(o)) for o in q['options']]


def top_sets(scores, k):
    """{top-k index set: probability} when ties are broken uniformly at random"""
    n, out = len(scores), collections.Counter()
    perms = list(itertools.permutations(range(n)))
    for prio in perms:
        out[frozenset(sorted(range(n), key=lambda i: (-scores[i], prio[i]))[:k])] += 1
    return {s: c / len(perms) for s, c in out.items()}


def accuracy(q, strategy):
    """probability that a player using `strategy` on q picks exactly the key (set)"""
    n, k, ks = len(q['options']), (2 if is_mr(q) else 1), keyset(q)
    chance = 1 / math.comb(n, k)
    family, what = strategy.split('-')
    if what == 'hint':
        ov = hint_overlap(q)
        if max(ov) == 0 or (k == 1 and ov.count(max(ov)) > 1): return chance
        scores = ov
    elif what == 'absolute':
        m = [1 if ABSOLUTE_RX.search(o) else 0 for o in q['options']]
        if sum(m) in (0, n): return chance
        scores, family = (m if family == 'pick' else [1 - x for x in m]), 'pick'
    elif what == 'longest':
        scores = [len(o) for o in q['options']]
    else:
        scores = [-len(o) for o in q['options']]
    acc = 0.0
    for top, p in top_sets(scores, k).items():
        if family in ('pick', 'follow'):
            acc += p * (top == ks)
        else:   # avoid: a uniform pick of k options among the n - k left
            acc += p * (ks.isdisjoint(top)) / math.comb(n - k, k)
    return acc


def gains(qs):
    """strategy -> (gain in points, [(item id, accuracy)]) over a list of items of one type"""
    if not qs: return {}
    chance = 1 / math.comb(len(qs[0]['options']), 2 if is_mr(qs[0]) else 1)
    out = {}
    for s in STRATEGIES:
        accs = [(q['id'], accuracy(q, s)) for q in qs]
        out[s] = (100 * (sum(a for _, a in accs) / len(accs) - chance), accs, chance)
    return out


def same_key_in_ts(qs):
    seen, out = {}, []
    for q in qs:
        k = (q['ts'], tuple(sorted(re.sub(r'\W+', ' ', q['options'][i].lower()).strip() for i in keyset(q))))
        if k in seen: out.append((seen[k], q['id']))
        else: seen[k] = q['id']
    return out


def check(qs, listing=False, out=print):
    """run every cue gate over the items; return the list of failures"""
    errors = []
    frag = [q['id'] for q in qs if hint_fragment(q)]
    dupes = same_key_in_ts(qs)
    out(f'hint shares a {HINT_FRAGMENT}+ char run only with a key: {len(frag)}')
    out(f'same key text twice in a task statement: {len(dupes)}')
    if frag: errors.append(f'{len(frag)} hints give away a fragment of the key')
    errors += [f'{a} and {b} have the same key text in one task statement' for a, b in dupes]
    if listing and frag: out('fragment: ' + ' '.join(frag))
    for label, pool, cap in (('MC', [q for q in qs if not is_mr(q)], MC_GAIN_MAX),
                             ('MR', [q for q in qs if is_mr(q)], MR_GAIN_MAX)):
        if not pool:
            out(f'{label}: no items'); continue
        g = gains(pool)
        chance = next(iter(g.values()))[2]
        out(f'{label} strategy gain over chance ({len(pool)} items, chance {chance:.0%}, max +{cap:.1f} points):')
        for s, (gain, accs, _) in g.items():
            bad = gain > cap
            out(f'  {s:15} {gain:+5.1f}{"  FAIL" if bad else ""}')
            if bad:
                errors.append(f'{label} {s} beats chance by {gain:+.1f} points (max +{cap:.1f})')
                if listing:
                    top = sorted((a for a in accs if a[1] > chance + 1e-9), key=lambda a: (-a[1], a[0]))
                    out(f'  {label} {s}: {len(top)} items where it beats chance (id:accuracy, highest first)')
                    out('    ' + ' '.join(f'{i}:{a:.2f}' for i, a in top))
    return errors


def main():
    qs = [q for v in bankio.load().values() for q in v]
    errors = check(qs, '--list' in sys.argv)
    if errors:
        print('\n'.join('FAIL ' + e for e in errors)); sys.exit(1)
    print('OK')


if __name__ == '__main__':
    main()
