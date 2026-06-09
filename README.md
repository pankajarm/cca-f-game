# 🗼 Architect's Ascent — the CCA-F training game

> Climb the tower. Defeat the anti-pattern bosses. Out-architect **The Proctor**.
> Walk out a **Claude Certified Architect**.

A study game for the **Claude Certified Architect — Foundations (CCA-F)** exam,
rebuilt from the ground up and current as of **June 2026**. 192 scenario questions,
every one generated against the real exam blueprint and adversarially fact-checked.

No build step. No dependencies. Open one file, start studying.

## Play it

```bash
python3 scripts/serve.py        # → http://localhost:4173
```

…or just open `index.html` in a browser, or host the repo on GitHub Pages
(Settings → Pages → deploy from `main`, done — the game is the root `index.html`).

Progress (XP, floors, bestiary, exam history, mistake deck) saves automatically
to your browser's localStorage.

## The exam this trains you for

| Fact | Value |
|---|---|
| Exam | Claude Certified Architect — Foundations (CCA-F) |
| Launched | March 12, 2026 |
| Format | 60 multiple-choice scenario questions |
| Time | 120 minutes |
| Scoring | Scaled out of 1000, **pass at 720** |
| Level | 301 — expects 6+ months of production Claude experience |
| Cost | $99 (free for early partner-org employees) |
| Scenario pools | 6 total, 4 randomly selected per sitting |

**Domain blueprint** (the game's exam simulator draws with exactly these weights):

| Domain | Weight | Tower floors |
|---|---|---|
| D1 · Agentic Architecture & Orchestration | 27% | F1 Loop Chamber · F2 Coordination Hall · F3 Hook Forge |
| D2 · Tool Design & MCP Integration | 18% | F4 Tool Armory |
| D3 · Claude Code Configuration & Workflows | 20% | F5 Config Maze · F6 Pipeline Forge |
| D4 · Prompt Engineering & Structured Output | 20% | F7 Prompt Workshop · F8 Validation Gauntlet |
| D5 · Context Management & Reliability | 15% | F9 Memory Halls · F10 Synthesis Chamber |

## Game modes

- **🗼 The Tower** — the campaign. Ten floors, ten anti-pattern bosses with
  speech-bubble banter and grudges. 10 questions per battle, 3 hearts, clear at
  7/10. Combo streaks land critical hits and earn power-ups:
  **🗜️ /compact** (trims two wrong options), **💭 Extended Thinking** (reveals a
  hint), **🛡️ Checkpoint** (forgives your next miss).
- **📋 The Proctor** — a faithful exam simulator: 60 questions drawn to the real
  domain weights, a 120-minute countdown, flag-for-review, a question navigator,
  scaled scoring out of 1000 with the 720 pass bar, and a per-domain score report
  with full answer review.
- **⚡ Lightning Round** — 90 seconds, unlimited questions, combos multiply your
  score.
- **🔦 Anti-Pattern Hunt** — twelve production war stories, each hiding exactly
  one monster of bad architecture. Name it to capture it for the **📖 Bestiary**
  (every monster card lists its cry and its weakness — they are all on the exam).
- **🩹 Mistake Clinic** — every question you miss, in any mode, checks in here.
  Answer it correctly twice in a row to discharge it. Lightweight spaced
  repetition aimed straight at your weak spots.
- **🏆 Trophy Hall** — 14 achievements, 7 titles from *Apprentice* to *Certified
  Architect*, daily streaks.

## The question bank

`questions.js` holds **192 questions**: 150 across the ten floors, 30
cross-domain exam-pool questions, and 12 hunt vignettes. They were authored
against a June-2026 brief of the real exam (stop_reason loop mechanics, hooks
vs prompts, MCP config scopes, CLAUDE.md hierarchy, skills frontmatter,
`claude -p` CI patterns, batch API economics, schema design, context
management, escalation policy…), then **every question was audited by an
adversarial reviewer agent** that argued for each distractor like a grumpy
test-taker filing an appeal — anything defensible got rewritten.

Exam philosophy baked into every answer: **the correct option fixes the root
cause; the distractors are patches on a flawed design.**

`questions.js` is the single source of truth. The printable practice tests are
generated from it:

```bash
python3 scripts/build_tests.py
```

## Printable study materials

- `practice-tests/test-01…10-*.md` — 15 questions per floor, answers in
  collapsible spoilers
- `practice-tests/full-exam-01.md` — a fixed 60-question paper exam with answer key
- `practice-tests/anti-pattern-hunt.md` — the twelve war stories, printable
- `GAME.md` — quest log, XP rules, and how to run boss battles with Claude Code
  as your dungeon master
- `STUDY_GUIDE.md` — a 12-week, 1-hour-a-day syllabus mapped to the tower

## Why the redesign?

This project descends from
[SGridworks/claude-certified-architect-training](https://github.com/SGridworks/claude-certified-architect-training),
which rendered everything — questions included — in an 8px pixel monospace font.
Charming; also an optometry bill. The new design uses **Inter** for prose,
**Bricolage Grotesque** for display, and reserves monospace (JetBrains Mono) for
actual code tokens like `stop_reason` and `.mcp.json` — which the game detects
and typesets automatically. Warm ivory-and-terracotta theme by day, a proper
dark mode by night, answers via keyboard `1`–`4`.

## Disclaimers

Not affiliated with or endorsed by Anthropic. Question content is original,
written to the public shape of the exam — not dumps. If you can clear the tower
and beat The Proctor at 720+, you're studying the right things; go book the
real one.
