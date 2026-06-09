# 🗼 ARCHITECT'S ASCENT — Quest Log

*The companion rulebook to the game in `index.html`, and the protocol for
playing with Claude Code as your dungeon master.*

---

## The premise

You are an apprentice architect at the foot of a tower with ten floors.
Each floor is ruled by a **boss** — a monster made of one specific way that
production agent systems go wrong. At the summit waits **THE PROCTOR**:
60 questions, 120 minutes, a scaled score out of 1000, and exactly zero banter.

Pass at 720. The real exam works the same way. That is the point.

## The floors and their bosses

| Floor | Hall | Boss | Its sin |
|---|---|---|---|
| F1 | The Loop Chamber | 🌀 Loop Terminator | Parses prose instead of `stop_reason` |
| F2 | Coordination Hall | 🐝 The Rogue Swarm | Assumes subagents inherit context |
| F3 | The Hook Forge | 🗣️ Prompt Whisperer | Prompts where hooks are needed |
| F4 | The Tool Armory | 🧰 The Tool Hoarder | Eighteen tools, zero discipline |
| F5 | The Config Maze | 👻 Config Phantom | Team standards in a personal config |
| F6 | The Pipeline Forge | 🧌 CI Gremlin | Interactive Claude in a headless pipeline |
| F7 | Prompt Workshop | 🎭 Vague Instructor | "Be careful" as acceptance criteria |
| F8 | Validation Gauntlet | 🪞 Self-Review Shadow | Grades its own homework |
| F9 | The Memory Halls | 🐡 Context Glutton | Forty fields per lookup, forever |
| F10 | Synthesis Chamber | 🏜️ The Accuracy Mirage | One average hiding every failure |
| ☝️ | The Summit | 📋 THE PROCTOR | Administers the CCA-F, faithfully |

## Combat rules (in the game)

- **10 questions** per battle, drawn from the floor's bank of 15. **3 hearts.**
  A fourth miss ends the run. Clear at **7/10**; a perfect 10 earns a ★.
- **Combos:** consecutive correct answers. At ×3 your hits become critical.
  Every third combo step forges a random power-up.
- **Power-ups:** 🗜️ `/compact` removes two wrong options · 💭 Extended Thinking
  reveals the hint · 🛡️ Checkpoint forgives your next miss.
- Every miss is admitted to the **🩹 Mistake Clinic**. Two consecutive correct
  answers there discharge it. The clinic is the highest-XP-per-minute study in
  the game, because it is built from your own blind spots.

## XP and titles

| Action | XP |
|---|---|
| Correct answer | 15 (+8 critical, +5 under 15s) |
| Floor cleared | +150 (perfect: +400 more) |
| Hunt vignette named | +25 |
| Clinic discharge progress | +10 per correct |
| Lightning Round | 8 × final score |
| The Proctor | 5/correct, +600 pass, +600 at 900+ |

**Titles:** Apprentice → 1,500 Loop Warden → 4,000 Hook Smith → 8,000 Config
Architect → 13,000 Schema Sage → 19,000 Context Keeper → **26,000 Certified
Architect.**

## The Bestiary (memorize their weaknesses — all twelve sit the exam with you)

| Monster | Cry | Weakness |
|---|---|---|
| 🌀 Loop Terminator | "The reply says it's done — halt!" | `stop_reason`, never prose |
| 🗿 Iteration Cap Golem | "max_iterations = 5. Solved." | Caps are safety nets, not control |
| 🗣️ Prompt Whisperer | "Add it to the system prompt! Bold!" | Deterministic hooks for critical rules |
| 🧰 The Tool Hoarder | "Every agent, every tool!" | 4–5 scoped tools per role |
| 🧜 Sentiment Siren | "They sound angry — escalate!" | Sentiment ≠ complexity; explicit triggers |
| 🔮 Confidence Phantom | "Model says 95% sure. Ship it." | Self-reported confidence is uncalibrated |
| 🐡 Context Glutton | "Dump everything into context." | Trim outputs; isolate verbosity in subagents |
| 🪞 Self-Review Shadow | "I checked my own work!" | Independent session, fresh context |
| 👤 Generic Error Ghost | "Operation failed. That's all." | `errorCategory`, `isRetryable`, partials |
| 🏜️ The Accuracy Mirage | "97% overall!" | Per-type, per-field validation |
| 🦑 The Scope Creep | "I decomposed it! …wrongly." | Partition scope to match full coverage |
| 🦇 Cache Vampire | "Timestamp first in the prompt!" | Stable prefix first — protect the cache |

## Playing with Claude Code as dungeon master

Open this repo in Claude Code and say any of:

- **"Run boss battle 4"** — Claude reads `questions.js`, plays the Tool Hoarder,
  asks the floor's questions one at a time, keeps score, and stays in character.
- **"Quiz me on D3"** / **"flash round"** — five quick questions, any domain.
- **"Run the full exam"** — 60 questions at real weights; Claude times you and
  produces a domain-by-domain score report at the end.
- **"Anti-pattern hunt"** — Claude improvises *new* war-story vignettes in the
  style of `practice-tests/anti-pattern-hunt.md` and you name the monster.
- **"Explain like I missed it"** — paste any question you got wrong; Claude
  explains the governing rule, then generates two fresh variations to confirm
  you actually got it.
- **"Drill my weak domain"** — tell Claude your Proctor domain bars; it builds
  a session from your worst two.

House rule for the DM: questions come from `questions.js`, but the DM may
re-skin scenarios freely — same governing rule, new surface — so memorizing
answer letters earns you nothing. The exam will do the same.

## Begin

Open `index.html`. Press **Begin the Ascent**. The Loop Terminator is waiting,
and it has already stopped listening.
