<div align="center">

# 🗼 Architect's Ascent

### Pass the **Claude Certified Architect** exam by playing a game.

*Climb the tower. Defeat the anti-pattern bosses. Out-architect The Proctor.*

[![Play it live](https://img.shields.io/badge/▶︎_PLAY_IT_LIVE-D97757?style=for-the-badge&logoColor=white)](https://pankajarm.github.io/cca-f-game/)
&nbsp;
![No install](https://img.shields.io/badge/no_install-runs_in_browser-4E8F83?style=for-the-badge)
&nbsp;
![Questions](https://img.shields.io/badge/213_questions-fact_checked-5B7FA6?style=for-the-badge)

<br>

[**▶︎ pankajarm.github.io/cca-f-game**](https://pankajarm.github.io/cca-f-game/) — no install, no signup, progress saved in your browser.

<br>

![Architect's Ascent title screen](docs/screenshots/hero.png)

</div>

---

A study game for the **Claude Certified Architect — Foundations (CCA-F)** exam,
built from the ground up and current as of **June 2026**. Instead of grinding a
PDF of flashcards, you climb a ten-floor tower, fight a boss made of each way
real agent systems break, and finish against **The Proctor** — a mock exam in the
real format: 60 questions, 120 minutes, 4 of the 6 official scenarios. **The
Blueprint** maps the question bank to the official exam guide's 30 task statements
so you can study the guide line by line. All **213 questions** were written to the
exam blueprint and checked by an adversarial reviewer.

It's one folder of static files. Nothing to build, nothing to install.

<div align="center">

|  |  |
|:--:|:--:|
| ![Home hub](docs/screenshots/hub.png) | ![The Tower](docs/screenshots/tower.png) |
| **Pick your mode** — campaign, exam sim, lightning, hunt | **The Tower** — ten floors, ten bosses, five domains |

</div>

## ⚔️ Fight the anti-patterns, don't memorize them

Each floor boss *is* a production failure mode — and it talks back. The Loop
Terminator stopped reading your agent's output three turns ago. The Tool Hoarder
gave one agent eighteen tools and wonders why it picks wrong. You beat them by
choosing the answer that fixes the **root cause**, not the one that bolts a patch
onto a broken design.

<div align="center">

![Boss battle](docs/screenshots/battle.png)

*10 questions, 3 hearts, combo streaks that land critical hits and drop power-ups:*
*🗜️ `/compact` trims two wrong options · 💭 Extended Thinking reveals a hint · 🛡️ Checkpoint forgives a miss.*

</div>

## 📋 Then survive The Proctor

The mock exam follows the official exam guide (v1.0, July 2026): **60 questions in
the exact domain weights** (16/11/12/12/9), grouped under **4 of the 6 exam
scenarios** drawn at random, a **120-minute** clock with a pace readout,
flag-for-review and a question navigator. Close the tab and it resumes, with the
clock still running, as it would on exam day. The result gives an **estimated scaled
score** (72% raw maps to the 720 line) plus breakdowns by domain and by scenario,
and points you at the task statements to drill next. Prefer to learn as you go? The
**Practice Exam** uses the same build with a 2-minute timer per question and the
answer after each one.

<div align="center">

|  |  |
|:--:|:--:|
| ![Exam simulator](docs/screenshots/exam.png) | ![Score report](docs/screenshots/score.png) |
| **Real exam conditions** — scenarios, timer, pace, flags, navigator | **Estimated score + domain and scenario breakdown** |

</div>

## 🎮 Seven ways to study

| Mode | What it is |
|---|---|
| 🗼 **The Tower** | The campaign. Ten floors, ten bosses with banter and grudges. Clear at 7/10 to ascend; ★ for a perfect 10. |
| 📘 **The Blueprint** | The official exam guide as a map: 5 domains → 30 task statements → key ideas, your coverage, links to the official docs, and a drill of up to 10 questions for each. Also by scenario. |
| 📋 **The Proctor** | Mock exam (60 Qs, 120 min, 4 of 6 scenarios, resumable, estimated scaled score) or Practice exam (2 min per question, instant feedback). |
| ⚡ **Lightning Round** | 90 seconds, unlimited questions, combos multiply your score. For people who read the question before the options load. |
| 🔦 **Anti-Pattern Hunt** | Twelve production war stories, each hiding one monster. Name it to capture it. |
| 🩹 **Mistake Clinic** | Every question you miss checks in here. Get it right twice in a row to discharge it — spaced repetition aimed at your weak spots. |
| 🏆 **Trophy Hall** | 14 achievements, 7 titles from *Apprentice* to *Certified Architect*, daily streaks. |

<div align="center">

|  |  |
|:--:|:--:|
| ![Bestiary](docs/screenshots/bestiary.png) | ![Dark mode battle](docs/screenshots/battle-dark.png) |
| **The Bestiary** — collect all 12 anti-pattern monsters | **Proper dark mode** for late-night cramming |

</div>

## 🧠 The question bank is the point

`questions.js` holds **213 scenario questions**: 150 across the ten floors, 30
cross-domain exam-pool questions, 21 written to fill gaps in the exam guide's task
statements, and 12 hunt vignettes. Every question has a stable `id`; non-hunt
questions also carry the guide task statement (`ts`) and scenario they test
(`scripts/guide_tags.py`, checked by `scripts/check_bank.py`). They were authored
against a June-2026 brief of the real exam — `stop_reason` loop mechanics, hooks
vs prompts, MCP config scopes, the `CLAUDE.md` hierarchy, skills frontmatter,
`claude -p` CI patterns, batch API economics, schema design, context management,
escalation policy — then **every question was audited by an adversarial reviewer
agent** that argued for each distractor like a grumpy test-taker filing an appeal.
Anything defensible got rewritten.

> **The principle baked into every answer:** the correct option fixes the **root
> cause**; the distractors are patches on a flawed design. (Better tool
> descriptions before a routing classifier. A deterministic hook before a
> sterner prompt. A nullable schema field before a "don't fabricate" warning.)

## 📐 The exam this trains you for

| Fact | Value |
|---|---|
| Exam | Claude Certified Architect — Foundations, exam code CCAR-F |
| Source | Official Exam Guide v1.0, effective July 2026 |
| Format | 60 scenario-based items, multiple-choice and multiple-response |
| Time | 120 minutes, proctored (online or Pearson VUE test center) |
| Scoring | Scaled 100–1000, **pass at 720**; report shows % correct by domain |
| Audience | Solution architects with 6+ months building with Claude |
| Cost | $125 USD per attempt |
| Scenarios | 6 in the bank, 4 drawn at random per sitting |
| Validity | 12 months; free online renewal assessment |
| Eligibility | Employees of Claude Partner Network organisations; the free courses on academy.claude.com are open to everyone |
| Practice | The old official practice exam was retired in June 2026; the guide's sample questions are the only official items |

**Domain blueprint** — the simulator draws with exactly these weights, and the
tower is laid out to match:

| Domain | Weight | Tower floors |
|---|---|---|
| D1 · Agentic Architecture & Orchestration | 27% | F1 Loop Chamber · F2 Coordination Hall · F3 Hook Forge |
| D2 · Tool Design & MCP Integration | 18% | F4 Tool Armory |
| D3 · Claude Code Configuration & Workflows | 20% | F5 Config Maze · F6 Pipeline Forge |
| D4 · Prompt Engineering & Structured Output | 20% | F7 Prompt Workshop · F8 Validation Gauntlet |
| D5 · Context Management & Reliability | 15% | F9 Memory Halls · F10 Synthesis Chamber |

## ▶︎ Play it

**Online — nothing to install:** **[pankajarm.github.io/cca-f-game](https://pankajarm.github.io/cca-f-game/)**

**Locally:**

```bash
python3 scripts/serve.py        # → http://localhost:4173
```

…or just open `index.html` in any browser. Progress (XP, floors, bestiary, exam
history, mistake deck) saves automatically to your browser's localStorage.

## 🖨️ Prefer paper?

`questions.js` is the single source of truth; the printable study materials are
generated from it with `python3 scripts/build_tests.py`:

- `practice-tests/test-01…10-*.md` — 15 questions per floor, answers in collapsible spoilers
- `practice-tests/full-exam-01.md` — a fixed 60-question paper exam with answer key
- `practice-tests/anti-pattern-hunt.md` — the twelve war stories, printable
- `GAME.md` — quest log, XP rules, and how to run boss battles with Claude Code as your dungeon master
- `STUDY_GUIDE.md` — a 12-week, 1-hour-a-day syllabus mapped to the tower

## ✨ Design

Built for long study sessions, not eye strain. **Inter** for prose, **Bricolage
Grotesque** for display, and monospace (JetBrains Mono) reserved for actual code
tokens like `stop_reason` and `.mcp.json` — which the game detects and typesets
automatically. Warm ivory-and-terracotta by day, a proper dark mode by night,
answers by keyboard `1`–`4`, audio you can mute.

---

<sub>Not affiliated with or endorsed by Anthropic. Question content is original,
written to the public shape of the exam — not dumps. If you can clear the tower
and beat The Proctor at 720+, you're studying the right things. Go book the real one. 🎓</sub>
