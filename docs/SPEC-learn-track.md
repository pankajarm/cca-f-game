# Spec: Learn track (staged lessons with slides, narrated video, labs)

Status: built on branch `claude/project-thread-nkymvw` (Oct 26 2026). Owner of the request: Pankaj Mathur.

## Why

Pankaj's ask: "content exactly from study guide and Anthropic documentation on teaching / up-leveling
people with various stages, beginner, medium, etc. Easy to learn content like slides, video are must."
Until now the game only tested knowledge (Tower, Blueprint drills, mock exam). Nothing taught it.

## What ships

A **Learn** mode (`UI.go('learn')`) with 43 lessons in three non-gating stages:

| Stage | Lessons | What it is |
|---|---|---|
| 1 · Beginner, *Foundations* | Start here + 5 domain primers | Exam format and study loop; per domain: vocabulary, mental model, glossary, how its task statements fit |
| 2 · Intermediate, *Task statements* | 30, one per guide task statement | The idea → how it works (original code/config) → apply it in a scenario → exam traps (tempting vs right + why) → recap |
| 3 · Advanced, *Exam-ready* | 6 scenario walkthroughs + Exam day | Which task statements each scenario pulls in, a worked decision and a contrasting case, typical distractors; pacing and elimination |

Every lesson has:

- **Slides**: an HTML deck rendered in the game (arrows, swipe, speaker notes) and full screen in
  `learn/deck.html#<id>`, with Print / PDF. One renderer (`Learn.slideHTML`) serves both and the video.
- **Narrated video**: `learn/video/<id>.mp4` + WebVTT captions, made from the same slides and notes.
  Labelled "AI-narrated" in the player.
- **Hands-on lab** (task-statement lessons): 4-5 steps, 5-15 minutes, laptop + API key.
- **Quick check**: 2 original scenario questions with explanations (options shuffled). Answering both
  marks the lesson done (+15 XP). Not added to the question bank, which another thread owns.
- **Drill**: the real bank, via `Blueprint.drillTs/drillDomain/drillScenario`, showing the actual count.
- **Docs today** note where current docs moved on since guide v1.0 (from `GUIDE.deltas`).
- **Official videos** (click-to-load youtube-nocookie embeds) and **go deeper** links: official docs,
  Anthropic Academy, anthropics/courses, the cookbook, DeepLearning.AI courses made with Anthropic,
  Anthropic Engineering posts.

The path page also has a **placement check** (15 bank questions weighted 4/3/3/3/2 by domain, one per task
statement where possible) and **"Lessons for your weak spots"**: task statements with 2+ questions seen and
under 75% right on the last try, across every mode, each linked to its lesson and drill.

## Content rules

- Scope and wording follow the official exam guide (v1.0, July 2026). Facts were checked against
  platform.claude.com/docs, code.claude.com/docs, modelcontextprotocol.io and anthropic.com/engineering on
  2026-10-26 (every source URL fetched). Where the guide and docs differ the lesson teaches the guide's
  terms and adds a "Docs today" line.
- Original wording throughout; code snippets are our own and at most ~14 lines; no copied doc text, no
  official course or video files re-hosted (embed/link only). No exam dumps (NDA).
- No em or en dashes; narration notes are written to be spoken (35-70 words, no symbols).
- Known guide-vs-docs notes from the writers: the guide's "2 to 4" few-shot examples vs the docs' 3-5
  (kept the guide's number); "allowedTools must include Task" is the guide's framing (current docs say
  allowedTools only pre-approves); 2.3's "18 tools vs 4-5" numbers come from the guide, not the docs.

## Files

| Path | Role |
|---|---|
| `learn/content/domain-N.json` | Source: DN primer + its task-statement lessons |
| `learn/content/advanced.json` | Source: start-here, 6 scenario walkthroughs, exam-day |
| `learn/content/resources.json` | Curated official videos (ids verified), courses, lesson→video/course maps |
| `learn/lessons.js` | GENERATED `window.LESSONS` + `window.LEARN_RES` (`scripts/build_learn.py`) |
| `learn.js` | `Learn` module: path, lesson page, slide renderer, progress (`aa-learn-v1`) |
| `learn/learn.css`, `learn/deck.html` | Styles; standalone full-screen / print / render deck |
| `learn/video/*` | Narrated MP4, VTT captions, poster, metadata (`scripts/build_videos.py`) |
| `scripts/render_slides.js` | Playwright: screenshot each slide + dump its narration |

Edit a lesson: change its JSON, run `python3 scripts/build_learn.py` (validates: every task statement
covered, slide kinds, notes, labs, 4-option checks, no option-position wording, no dashes, known video ids),
then `python3 scripts/build_videos.py <id>` to re-record that lesson, then `build_learn.py` again.

## Video pipeline

`build_videos.py` → `render_slides.js` screenshots `deck.html?render=1&id=<id>` at 1920x1080 and dumps
each slide's note → **Kokoro-82M** (open-weights TTS, Apache-2.0, run locally with the `kokoro-onnx`
package, int8 model, voice `af_heart`) reads each note with a small pronunciation table (MCP, SDK, JSON,
CLAUDE.md...) → ffmpeg: still-image H.264 at 2 fps + 32 kbps AAC mono per slide, concatenated, faststart
→ captions are the notes split by sentence and timed by length. About 1 MB per 2-3 minute lesson.

## Integration with the menu redesign (sibling thread)

Contract agreed with the thread redesigning the home screen:
`window.LESSONS = [{ id, title, short, stage, kind, domain, ts[], scenarios[], minutes, video, ... }]`,
ids `start-here`, `primer-D1..5`, `ts-1.1..5.6`, `scn-1..6`, `exam-day`;
`Learn.open(id)`, `Learn.forTs('1.4')`, `Learn.progress()`; `UI.go('learn')`.
game.js gets one line in `UI.go` (`Learn.onGo(name)`); index.html gets the stylesheet link, two screen
sections, a home card and two script tags. Lesson progress lives in its own localStorage key, so the game
save schema is unchanged.

## Consensus Board review (Oct 26 2026) and what changed

Seats claude, codex and reasonix reviewed the first plan. Adopted: stages are suggestions, not locks; a
placement check plus weak-spot routing from every mode's answers; a hands-on lab in every task-statement
lesson; one source of truth for slides/notes/video (no hand-made deck copies); drill buttons show the real
question count; videos labelled as unofficial and AI-narrated; official videos embedded on click only.
Not adopted, with reasons: per-slide audio instead of MP4 (Pankaj asked for video, and MP4 is shareable and
offline-friendly; the whole set is a few tens of MB); moving videos to GitHub Releases (adds a publish step
for a small saving); folding quick checks into `questions.js` (that bank belongs to the sibling thread).
Open ideas for later: spaced "due today" review in the Mistake Clinic, mixed 4-of-6-scenario timed sets,
mock-result rows linking straight to lessons (the sibling can call `Learn.forTs`).
