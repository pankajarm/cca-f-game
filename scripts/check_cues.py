#!/usr/bin/env python3
"""Answer-cue gates for questions.js: can a test-wise player find the key without knowing the topic?

Usage: python3 scripts/check_cues.py [--list]   (--list prints every flagged item)
Each cue is measured as how often following it picks the key, so chance (25%) is the baseline.
"""
import collections, re, sys
from difflib import SequenceMatcher
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import bankio

HINT_FRAGMENT = 12        # a hint may not share a 12+ character run with the key that no distractor shares
HINT_GUESS_MAX = 0.30     # picking the option that best matches the hint may be right at most this often
ABSOLUTE_RX = re.compile(r'\b(always|never|only|all|every|guarantee[sd]?|completely|entirely)\b', re.I)
STOP = set('about above after again against their there these those which while would could should with without '
           'from into that this than then them they what when where your yours have has been being does doing '
           'tool tools model claude agent agents option options other using based'.split())


def words(s):
    return {w for w in re.findall(r'[a-z_]{5,}', s.lower()) if w not in STOP}


def run(s, t):
    m = SequenceMatcher(None, s.lower(), t.lower(), autojunk=False).find_longest_match(0, len(s), 0, len(t))
    return m.size


def hint_fragment(q):
    """the hint shares a long run with the key and a shorter one with every distractor"""
    h = q.get('hint', '')
    runs = [run(h, o) for o in q['options']]
    k = runs[q['correct']]
    return k >= HINT_FRAGMENT and k > max(r for i, r in enumerate(runs) if i != q['correct'])


def hint_guess(q):
    """index a player would pick by matching hint words to options, or None if no unique best"""
    h = words(q.get('hint', ''))
    ov = [len(h & words(o)) for o in q['options']]
    best = max(ov)
    return ov.index(best) if best and ov.count(best) == 1 else None


def same_key_in_ts(qs):
    seen, out = {}, []
    for q in qs:
        k = (q['ts'], re.sub(r'\W+', ' ', q['options'][q['correct']].lower()).strip())
        if k in seen: out.append((seen[k], q['id']))
        else: seen[k] = q['id']
    return out


def main():
    qs = [q for v in bankio.load().values() for q in v]
    errors, listing = [], '--list' in sys.argv
    frag = [q['id'] for q in qs if hint_fragment(q)]
    guesses = [(q, hint_guess(q)) for q in qs]
    committed = [(q, g) for q, g in guesses if g is not None]
    right = [q['id'] for q, g in committed if g == q['correct']]
    acc = len(right) / max(1, len(committed))
    dupes = same_key_in_ts(qs)
    key_abs = sum(bool(ABSOLUTE_RX.search(q['options'][q['correct']])) for q in qs) / len(qs)
    dis_abs = sum(bool(ABSOLUTE_RX.search(o)) for q in qs for i, o in enumerate(q['options']) if i != q['correct']) / (3 * len(qs))
    print(f'hint shares a {HINT_FRAGMENT}+ char run only with the key: {len(frag)}')
    print(f'hint-matching guess: right {len(right)}/{len(committed)} ({acc:.0%}, max {HINT_GUESS_MAX:.0%}; chance 25%)')
    print(f'same key text twice in a task statement: {len(dupes)}')
    print(f'absolute words (tracked, not gated): key {key_abs:.0%} · distractor {dis_abs:.0%}')
    if frag: errors.append(f'{len(frag)} hints give away a fragment of the key')
    if acc > HINT_GUESS_MAX: errors.append(f'following the hint picks the key {acc:.0%} of the time')
    errors += [f'{a} and {b} have the same key text in one task statement' for a, b in dupes]
    if listing:
        print('fragment:', ' '.join(frag))
        print('hint-guess right:', ' '.join(right))
    if errors:
        print('\n'.join('FAIL ' + e for e in errors)); sys.exit(1)
    print('OK')


if __name__ == '__main__':
    main()
