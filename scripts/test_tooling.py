#!/usr/bin/env python3
"""Self-test for the question-bank tooling: builds a throwaway bank of MC and MR fixtures (good and
bad) and asserts that each checker accepts or rejects them. Never touches questions.js.

Usage: python3 scripts/test_tooling.py
"""
import collections, copy, json, sys, tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import bankio, check_bank, check_batch, check_cues, add_questions, build_tests

TS, SCEN = {'1.1', '2.1'}, {1: {'D1'}, 2: {'D2'}}
VOCAB = ('amber basalt cobalt dune ember fjord garnet harbor indigo jasper kelp lagoon meadow nectar onyx '
         'prairie quartz ridge sierra tundra umber valley willow xenon yarrow zephyr').split()
_n = [0]


def stem(extra=''):
    """a 120+ char stem whose words barely overlap any other fixture stem"""
    _n[0] += 1
    k = _n[0]
    tag = ' '.join(f'{VOCAB[(k * 7 + j * 3) % len(VOCAB)]}{k}x{j}' for j in range(10))
    return f'A deployment team reports trouble in case {tag}. Which change addresses the root cause? {extra}'.strip()


def opts(n, k):
    """n distinct options of equal length, with no absolute words (cue-neutral)"""
    return [f'Adopt approach {chr(65 + i)}{k:04d} for routing the request' for i in range(n)]


def mc(correct=0, **kw):
    _n[0] += 1
    q = {'q': stem(), 'options': opts(4, _n[0]), 'correct': correct, 'explanation': 'Because it fixes the cause.',
         'hint': 'Think about routing.', 'difficulty': 'core', 'tags': ['t'], 'ts': '1.1', 'scenario': 1, 'src': 'docs'}
    q.update(kw)
    return q


def mr(correct=(0, 1), **kw):
    q = mc(**kw)
    q.update({'type': 'mr', 'options': opts(5, _n[0]), 'correct': list(correct)})
    q.update(kw)
    return q


def with_ids(items, prefix='t'):
    return [{**q, 'id': f'{prefix}-{i:03d}'} for i, q in enumerate(items)]


def fails(errs, needle):
    return any(needle in e for e in errs)


def test_shape():
    se = check_bank.shape_errors
    assert se(mc()) == [] and se(mr()) == [] and se(mr(correct=(3, 4))) == []
    assert se(mr(options=opts(4, 1)))                       # MR needs 5 options
    assert se(mc(options=opts(5, 1)))                       # MC needs 4
    assert se(mr(correct=(3, 1))) and se(mr(correct=(2, 2))) and se(mr(correct=(1, 5))) and se(mr(correct=(1,)))
    assert se(mr(correct=(0, 1, 2)))
    assert se({**mr(), 'correct': 1})                       # MR with an int key
    assert se(mc(correct=[1])) and se(mc(correct=4)) and se(mc(correct=True))
    assert fails(se(mr(q=stem('(Choose two.)'))), 'choose/select two')
    assert fails(se(mr(q=stem('Select 2 answers.'))), 'choose/select two')
    assert se(mc(q=stem('Choose two things to check first.'))) == []   # MC stems are not policed for this
    o = opts(5, 9); o[4] = o[1].upper()
    assert fails(se(mr(options=o)), 'duplicate options')
    o = opts(4, 9); o[3] = o[0] + ' '
    assert fails(se(mc(options=o)), 'duplicate options')
    assert fails(se(mc(type='mx')), 'unknown type')


def good_bank():
    mcs = [mc(correct=k % 4) for k in range(8)]
    for q in mcs[:2]:                                       # key is longest in 2/8 = 25%
        q['options'][q['correct']] += ' and logging'
    pairs = [(0, 1), (2, 3), (0, 4), (1, 2), (3, 4)] * 2      # every index is a key in 4/10 = 40%
    mrs = [mr(correct=p, ts='2.1', scenario=2) for p in pairs]
    q = mrs[0]                                              # two longest in 1/10
    for i in q['correct']: q['options'][i] += ' and logging'
    return {'bank-d1': with_ids(mcs, 'd1'), 'bank-d2': with_ids(mrs, 'd2')}


def bank_errors(bank):
    check_bank.MIN_PER_TS, check_bank.QUOTA = 0, {}
    return check_bank.check(bank, TS, SCEN)[0]


def test_bank():
    bank = good_bank()
    assert bank_errors(bank) == [], bank_errors(bank)
    s = check_bank.summary([q for v in bank.values() for q in v])
    assert 'MR 10 (55.6% of items' in s, s
    b = copy.deepcopy(bank)                                 # MR keys all on 0/1: position gate
    for q in b['bank-d2']:
        q['options'] = opts(5, hash(q['id']) % 9999); q['correct'] = [0, 1]
    assert fails(bank_errors(b), 'MR index 0 is a key in 10/10')
    b = copy.deepcopy(bank)                                 # keys are the two longest everywhere
    for q in b['bank-d2']:
        for i in q['correct']: q['options'][i] += ' plus more'
    assert fails(bank_errors(b), 'MR keys are the two longest options in 10/10')
    b = copy.deepcopy(bank)
    b['bank-d2'] = b['bank-d2'][:9]
    for q in b['bank-d2']: q['correct'] = [0, 1]
    assert not fails(bank_errors(b), 'MR index'), 'MR gates wait for MR_GATE_MIN items'
    b = copy.deepcopy(bank)                                 # MC: keys all at 0
    for q in b['bank-d1']: q['correct'] = 0
    assert fails(bank_errors(b), 'MC key position 0 holds 8/8')
    b = copy.deepcopy(bank)                                 # MC key longest everywhere
    for q in b['bank-d1']: q['options'][q['correct']] += ' and much more besides'
    assert fails(bank_errors(b), 'MC key is the longest option in 8/8')
    b = copy.deepcopy(bank)                                 # malformed MR, scenario/domain mismatch, near-dupe
    b['bank-d2'][3]['correct'] = [4, 2]
    b['bank-d2'][4]['scenario'] = 1
    b['bank-d2'][5]['q'] = b['bank-d1'][0]['q'] + ' Now'
    errs = bank_errors(b)
    assert fails(errs, 'd2-003: bad correct'), errs
    assert fails(errs, 'd2-004: scenario 1 does not cover'), errs
    assert fails(errs, 'near-duplicate stems'), errs


def test_batch():
    existing = [q for v in good_bank().values() for q in v]
    good = [mc(correct=1), mr(correct=(1, 3), ts='2.1', scenario=2)]
    errs, _ = check_batch.check(good, existing, TS, SCEN)
    assert errs == [], errs
    bad = [mr(correct=(3, 1)), mr(q=stem('Choose two.')), mr(options=opts(4, 1)), mc(correct=[0, 1]),
           {k: v for k, v in mr().items() if k != 'hint'}, {**mr(), 'q': existing[3]['q']}]
    errs, _ = check_batch.check(bad, existing, TS, SCEN)
    for i, needle in enumerate(['bad correct', 'choose/select two', 'needs exactly 5', 'bad correct', 'missing']):
        assert fails(errs, f'item {i} '), (i, errs)
        assert any(e.startswith(f'item {i} ') and needle in e for e in errs), (i, needle, errs)
    assert fails(errs, 'near-duplicate stem'), errs


def test_cues():
    acc = check_cues.accuracy
    q = mr(correct=(1, 3))
    for s in check_cues.STRATEGIES:                         # neutral MR item: every strategy is chance (1/10)
        assert abs(acc(q, s) - 0.1) < 1e-9, (s, acc(q, s))
    q = mc(correct=2)
    for s in check_cues.STRATEGIES:
        assert abs(acc(q, s) - 0.25) < 1e-9, (s, acc(q, s))
    q = mr(correct=(1, 3))
    for i in (0, 2, 4): q['options'][i] = 'Always ' + q['options'][i]
    assert acc(q, 'avoid-absolute') == 1.0 and acc(q, 'pick-absolute') == 0.0
    q = mr(correct=(1, 3))
    for i in (1, 3): q['options'][i] += ' with retries'
    assert acc(q, 'pick-longest') == 1.0 and acc(q, 'avoid-longest') == 0.0
    assert abs(acc(q, 'pick-shortest') - 0.0) < 1e-9 and abs(acc(q, 'avoid-shortest') - 1 / 3) < 1e-9
    q = mc(correct=0)
    for i in (1, 2, 3): q['options'][i] = 'Never ' + q['options'][i]
    assert acc(q, 'avoid-absolute') == 1.0
    q = mc(correct=2, hint='Consider idempotency guards.')
    q['options'][2] += ' with idempotency guards'
    assert acc(q, 'follow-hint') == 1.0 and acc(q, 'avoid-hint') == 0.0
    q = mr(correct=(0, 4), hint='Consider idempotency and backpressure.')
    q['options'][0] += ' idempotency'; q['options'][4] += ' backpressure'
    assert acc(q, 'follow-hint') == 1.0

    # hint fragment: MR flags a long run shared only with a key, not one a distractor also shares
    q = mr(correct=(1, 3), hint='Look for the dead-letter queue setting.')
    q['options'][3] = 'Send failures to a dead-letter queue setting for review'
    assert check_cues.hint_fragment(q)
    q['options'][0] = 'Use the dead-letter queue setting from the console only'
    assert not check_cues.hint_fragment(q)
    # same key text twice in a task statement (MR keys compared as a pair)
    a, b = mr(correct=(0, 1)), mr(correct=(2, 4))
    b['options'][2], b['options'][4] = a['options'][1], a['options'][0]
    assert len(check_cues.same_key_in_ts(with_ids([a, b]))) == 1

    # gates: a neutral pool passes; an avoid-absolute pool fails and is listed
    quiet = lambda *a, **k: None
    pool = with_ids([mc(correct=k % 4) for k in range(8)] + [mr(correct=(k % 4, 4)) for k in range(8)])
    assert check_cues.check(pool, out=quiet) == []
    leaky = copy.deepcopy(pool)
    for q in leaky[:4]:
        for i in range(4):
            if i != q['correct']: q['options'][i] = 'Only ' + q['options'][i]
    for q in leaky[8:10]:
        for i in range(5):
            if i not in q['correct']: q['options'][i] = 'All ' + q['options'][i]
    lines = []
    errs = check_cues.check(leaky, listing=True, out=lines.append)
    assert fails(errs, 'MC avoid-absolute') and fails(errs, 'MR avoid-absolute'), errs
    assert not fails(errs, 'pick-longest'), errs
    assert any('t-000:1.00' in l for l in lines), lines


def test_merge_and_render():
    tmp = Path(tempfile.mkdtemp())
    qfile = tmp / 'questions.js'
    bank = good_bank()
    qfile.write_text('/* fixture\n * 18 scenario questions for the Claude Certified Architect — Foundations exam (2026). */\n'
                     'window.BANK = ' + json.dumps(bank, indent=1) + ';\n')
    old, bankio.QFILE = bankio.QFILE, qfile
    try:
        b = bankio.load()
        new_mr = mr(correct=(0, 1), ts='2.1', scenario=2)
        keytext = sorted(new_mr['options'][i] for i in new_mr['correct'])
        new_mc = mc(correct=3)
        added = add_questions.merge(b, [[new_mc, new_mr]])
        bankio.save(b)
        b2 = bankio.load()
    finally:
        bankio.QFILE = old
    assert added == 2
    assert '20 scenario questions' in qfile.read_text()
    q_mc, q_mr = b2['bank-d1'][-1], b2['bank-d2'][-1]
    assert q_mc['id'] == 'd1-008' and q_mr['id'] == 'd2-010', (q_mc['id'], q_mr['id'])
    assert q_mc['correct'] == 0 and q_mc['options'][0] == new_mc['options'][3]   # MC 0-3 tie: least-used, lowest
    assert q_mr['type'] == 'mr' and q_mr['correct'] == sorted(q_mr['correct'])
    assert sorted(q_mr['options'][i] for i in q_mr['correct']) == keytext
    assert sorted(q_mr['options']) == sorted(new_mr['options'])
    assert check_bank.shape_errors(q_mr) == []
    assert tuple(q_mr['correct']) == (0, 2)                 # indices all tied at 4: first pair not used yet
    # balance: keep adding MR items; key indices stay within one of each other
    b3 = copy.deepcopy(b2)
    add_questions.merge(b3, [[mr(correct=(3, 4), ts='2.1', scenario=2) for _ in range(9)]])
    mrs = [q for q in b3['bank-d2'] if q.get('type') == 'mr']
    c = collections.Counter(k for q in mrs for k in q['correct'])
    assert max(c.values()) - min(c.values()) <= 1, c

    md = build_tests.render_question(1, q_mr)
    assert '(Choose two.)' in md and f'**{build_tests.key_letters(q_mr)}**' in md and 'E) ' in md
    assert build_tests.key_letters({**q_mr, 'correct': [1, 3]}) == 'B, D'
    assert build_tests.key_letters(q_mc) == 'A' and '**A)**' in build_tests.render_question(2, q_mc)
    assert '(Choose two.)' not in build_tests.render_question(2, q_mc)


if __name__ == '__main__':
    for name, fn in list(globals().items()):
        if name.startswith('test_'):
            fn()
            print(f'ok  {name}')
    print('all tooling tests passed')
