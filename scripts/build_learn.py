#!/usr/bin/env python3
"""Assemble learn/lessons.js from learn/content/*.json and check the lessons.

    python3 scripts/build_learn.py           # build + check
    python3 scripts/build_learn.py --check   # check only, exit 1 on problems

Lesson sources:
  learn/content/domain-N.json   primer object for DN, then one lesson per task statement
  learn/content/advanced.json   start-here, scenario walkthroughs, exam-day (already have ids)
  learn/content/resources.json  curated official videos + courses, and which lesson shows which video
Videos made by scripts/build_videos.py are picked up from learn/video/<id>.mp4 (+ .vtt, .jpg, .json).
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = os.path.join(ROOT, 'learn', 'content')
VID = os.path.join(ROOT, 'learn', 'video')


def load(name):
    with open(os.path.join(C, name), encoding='utf-8') as f:
        return json.load(f)


def guide_ts():
    src = open(os.path.join(ROOT, 'guide.js'), encoding='utf-8').read()
    return re.findall(r"\{ id: '(\d\.\d)', title: '([^']+)'", src)


def guide_deltas():
    src = open(os.path.join(ROOT, 'guide.js'), encoding='utf-8').read()
    i = src.index('window.GUIDE.deltas = ') + len('window.GUIDE.deltas = ')
    return json.JSONDecoder().raw_decode(src[i:])[0]


def build():
    titles = dict(guide_ts())
    deltas = guide_deltas()
    res = load('resources.json')
    adv = {l['id']: l for l in load('advanced.json')}
    out = [dict(adv['start-here'])]
    for n in range(1, 6):
        items = load(f'domain-{n}.json')
        primer = next(o for o in items if 'primer' in o)
        p = dict(primer)
        d = p.pop('primer')
        p.update(id=f'primer-{d}', kind='primer', stage='beginner', domain=d, ts=[],
                 title=f'Domain {n} primer: {DOMAIN_LABELS[d]}', short=DOMAIN_LABELS[d],
                 drill={'domain': d})
        out.append(p)
    for n in range(1, 6):
        for o in load(f'domain-{n}.json'):
            if 'primer' in o:
                continue
            l = dict(o)
            ts = l['ts']
            l.update(id=f'ts-{ts}', kind='ts', stage='intermediate', domain=f'D{ts[0]}', ts=[ts],
                     title=titles[ts], short=SHORT.get(ts, titles[ts]), drill={'ts': ts})
            # the guide-vs-docs note comes verbatim from GUIDE.deltas so the two can't drift;
            # a lesson may carry its own docsToday only where guide.js has no entry
            if ts in deltas:
                l['docsToday'] = deltas[ts]
            out.append(l)
    for k in ['scn-1', 'scn-2', 'scn-3', 'scn-4', 'scn-5', 'scn-6', 'exam-day']:
        l = dict(adv[k])
        l.setdefault('domain', None)
        l.setdefault('ts', [])
        out.append(l)
    out[0].setdefault('domain', None)
    out[0].setdefault('ts', [])
    # primers come right after start-here, so the stage-1 order reads start, D1..D5
    for l in out:
        l['videos'] = res['lessonVideos'].get(l['id'], [])
        l['courses'] = [res['courseIndex'][c] for c in res['lessonCourses'].get(l['id'], [])]
        meta = os.path.join(VID, l['id'] + '.json')
        if os.path.exists(os.path.join(VID, l['id'] + '.mp4')) and os.path.exists(meta):
            m = json.load(open(meta))
            l['video'] = {'src': f"learn/video/{l['id']}.mp4", 'vtt': f"learn/video/{l['id']}.vtt",
                          'poster': f"learn/video/{l['id']}.jpg", 'seconds': m['seconds']}
            l['minutes'] = max(l.get('minutes', 0), round(m['seconds'] / 60 + 2))
        else:
            l['video'] = None
    return out, res


DOMAIN_LABELS = {
    'D1': 'Agentic Architecture & Orchestration', 'D2': 'Tool Design & MCP Integration',
    'D3': 'Claude Code Configuration & Workflows', 'D4': 'Prompt Engineering & Structured Output',
    'D5': 'Context Management & Reliability',
}
SHORT = {
    '1.1': 'Agentic loops', '1.2': 'Coordinators and subagents', '1.3': 'Spawning subagents and passing context',
    '1.4': 'Enforced steps and handoffs', '1.5': 'Agent SDK hooks', '1.6': 'Task decomposition',
    '1.7': 'Sessions: resume and fork', '2.1': 'Tool interfaces and descriptions', '2.2': 'Structured MCP errors',
    '2.3': 'Tools per agent and tool_choice', '2.4': 'MCP servers in Claude Code', '2.5': 'Built-in tools',
    '3.1': 'CLAUDE.md hierarchy', '3.2': 'Slash commands and skills', '3.3': 'Path-specific rules',
    '3.4': 'Plan mode vs direct execution', '3.5': 'Iterative refinement', '3.6': 'Claude Code in CI/CD',
    '4.1': 'Explicit criteria', '4.2': 'Few-shot prompting', '4.3': 'Structured output with tools and schemas',
    '4.4': 'Validation and retry loops', '4.5': 'Batch processing', '4.6': 'Multi-pass review',
    '5.1': 'Preserving context in long conversations', '5.2': 'Escalation and ambiguity',
    '5.3': 'Error propagation across agents', '5.4': 'Context in large codebases',
    '5.5': 'Human review and confidence', '5.6': 'Provenance and uncertainty',
}

DASH = re.compile('[–—]')


def check(lessons, res):
    errs = []
    ids = [l['id'] for l in lessons]
    if len(ids) != len(set(ids)):
        errs.append('duplicate lesson ids')
    want_ts = {t for t, _ in guide_ts()}
    have_ts = {t for l in lessons if l['kind'] == 'ts' for t in l['ts']}
    if want_ts != have_ts:
        errs.append(f'task statements missing: {sorted(want_ts - have_ts)}')
    vids = {v['id'] for v in res['videos']}
    for l in lessons:
        where = l['id']
        for k in ('title', 'hook', 'stage', 'kind', 'minutes'):
            if not l.get(k):
                errs.append(f'{where}: missing {k}')
        if l['stage'] not in ('beginner', 'intermediate', 'advanced'):
            errs.append(f'{where}: bad stage')
        if not 3 <= len(l.get('slides', [])) <= 8:
            errs.append(f'{where}: {len(l.get("slides", []))} slides')
        for i, s in enumerate(l.get('slides', [])):
            if s['kind'] not in ('idea', 'how', 'practice', 'traps', 'recap'):
                errs.append(f'{where} slide {i}: kind {s["kind"]}')
            if not s.get('note'):
                errs.append(f'{where} slide {i}: no narration note')
            if s['kind'] == 'traps' and not s.get('pairs'):
                errs.append(f'{where} slide {i}: traps without pairs')
            if s.get('code') and len(s['code']['text'].splitlines()) > 16:
                errs.append(f'{where} slide {i}: code too long')
        for i, c in enumerate(l.get('check', [])):
            if len(c['options']) != 4 or not 0 <= c['answer'] < 4 or not c.get('why'):
                errs.append(f'{where} check {i}: malformed')
            if re.search(r'\b(first|second|third|fourth|last) option\b', c['why'], re.I):
                errs.append(f'{where} check {i}: refers to option position')
        if l['kind'] == 'ts' and not l.get('lab'):
            errs.append(f'{where}: no lab')
        for u in l.get('sources', []):
            if not u['url'].startswith('https://'):
                errs.append(f'{where}: bad source url')
        for v in l['videos']:
            if v not in vids:
                errs.append(f'{where}: unknown video {v}')
        blob = json.dumps(l, ensure_ascii=False)
        if DASH.search(blob):
            errs.append(f'{where}: contains an em or en dash')
    return errs


def main():
    lessons, res = build()
    errs = check(lessons, res)
    for e in errs:
        print('  ✗', e)
    if '--check' in sys.argv:
        sys.exit(1 if errs else 0)
    if errs:
        print(f'{len(errs)} problem(s); lessons.js not written')
        sys.exit(1)
    videos = [{k: v[k] for k in ('id', 'title', 'channel', 'minutes', 'why')} for v in res['videos']]
    with open(os.path.join(ROOT, 'learn', 'lessons.js'), 'w', encoding='utf-8') as f:
        f.write('/* ARCHITECT\'S ASCENT · Learn track lessons. GENERATED by scripts/build_learn.py from\n'
                ' * learn/content/*.json; edit those files and rebuild. Unofficial study material written from\n'
                ' * the CCAR-F exam guide v1.0 and Anthropic documentation, in our own words. */\n')
        f.write('window.LESSONS = ')
        json.dump(lessons, f, ensure_ascii=False, indent=1)
        f.write(';\nwindow.LEARN_RES = ')
        json.dump({'videos': videos, 'courses': res['courses']}, f, ensure_ascii=False, indent=1)
        f.write(';\n')
    nv = sum(1 for l in lessons if l['video'])
    if nv < len(lessons):
        missing = [l['id'] for l in lessons if not l['video']]
        print(f'  ! {len(missing)} lesson(s) have no narrated video yet: {" ".join(missing[:8])}{" ..." if len(missing) > 8 else ""}'
              ' (run scripts/build_videos.py)')
    print(f'lessons.js: {len(lessons)} lessons, {nv} with narrated video, {len(videos)} official videos')


if __name__ == '__main__':
    main()
