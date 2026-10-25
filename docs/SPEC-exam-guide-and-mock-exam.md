# Spec: Exam Guide mode + Mock Exam mode

Status: **v2, revised after Consensus Board review** (seats: claude, codex, reasonix, opencode) · Oct 2026
Source of truth: *Claude Certified Architect – Foundations Exam Guide*, v1.0, effective July 2026, exam code CCAR-F.

## 0. What the guide says (facts we design around)

- 60 items, 120 minutes, proctored. Pass = scaled 720 on a 100–1,000 scale. Score report = pass/fail + scaled score + percent-correct per domain.
- Item format: multiple-choice and multiple-response.
- Structure: 4 scenarios drawn at random from a bank of 6; each scenario frames a set of questions.
- Blueprint: D1 27%, D2 18%, D3 20%, D4 20%, D5 15% (→ 16/11/12/12/9 of 60).
- 30 task statements: D1 1.1–1.7, D2 2.1–2.5, D3 3.1–3.6, D4 4.1–4.6, D5 5.1–5.6.
- 6 scenarios: 1 Customer Support Resolution Agent (D1 D2 D5), 2 Code Generation with Claude Code (D3 D5), 3 Multi-Agent Research System (D1 D2 D5), 4 Developer Productivity with Claude (D2 D3 D1), 5 Claude Code for CI (D3 D4), 6 Structured Data Extraction (D4 D5).
- Explicit out-of-scope list (fine-tuning, auth/billing, streaming, prompt caching details, vision, computer use…).

## 1. What the board changed (v1 → v2)

| Topic | v1 draft | v2 decision | Why |
|---|---|---|---|
| Proctor | replace | **replace** (unanimous) | Two near-identical 60Q modes split the bank and confuse "which one is real". Old best kept as `legacyExamBest`. |
| Assembly | 4 scenarios × 15 Qs, then rebalance | **Domain quotas first (16/11/12/12/9), scenarios as a soft bias + grouping** | 4×15 plus quotas is infeasible on this bank; some 4-scenario draws have no D4 or no D1 scenario. |
| Repeat avoidance | exclude last 2 attempts | **Prefer least-recently-seen**, report "N of 60 seen before" | Excluding 120 of ~170 questions can't fill 60 slots; repeats inflate scores, so say so. |
| Scaled score | `100 + 900·pct` | **Piecewise: 0%→100, 72%→720, 100%→1000**, raw score always shown, labelled "estimate" | v1 put the pass line at 68.9% (42/60), easier than the old 44/60. |
| Pass banner | PASS / FAIL | **Band**: below target / near target (±1 SE) / at or above target | One 60-item attempt has a ±~100-point 95% interval. |
| Multiple-response | ~10 items now | **Deferred to a follow-up PR** | Touches every renderer, scoring, persistence, clinic; 10 items is token coverage. |
| Persistence | resume via localStorage | **Separate versioned key, absolute deadline, idempotent submit, expired-on-load auto-submit, stale bank voids, other-tab warning** | Lifecycle, not just a timer. |
| "Mastery" | share of Qs last answered correctly | **"seen x/y · right on last try z"**; weakest list only from task statements with ≥2 seen | Honest about sparse data. |
| Weakest TS on results | from this exam | **from cumulative stats across all modes** | 1–3 items per TS in one exam is noise. |
| Out-of-scope Qs | unspecified | **flag `oos: true`**, keep in floors, exclude from mock + Blueprint drills | Guide says prompt caching beyond "knowing it exists" is not tested. |
| Deferred | — | heatmap, Blueprint achievement, per-question dwell stats, scenario intro cards beyond a header | Precision the data can't support yet. |

Kept against one seat's advice: the **Practice Exam** variant, because Pankaj explicitly asked for "mock and practice exam". It's light: same assembly, feedback after each item, a soft 2-minute per-question timer that turns red (it never locks), not persisted, doesn't count toward best.

## 2. Foundation

### 2.1 Stable question IDs
- Every question in `questions.js` stores a frozen `id` from its pre-change position: `f01-00`…`f10-14`, `mx1-00`…`mx2-14`, `hunt-00`…`hunt-11`. New questions: `gx-NN`. IDs are never recomputed or reused.
- Save gets `schemaVersion: 3`. On first load of an older save: back it up to `architects-ascent-v2.bak`, convert clinic cards `{src, idx}` → `{id}` (unmappable cards are kept, not dropped), keep streaks.
- `Bank.byId(id)` replaces `Bank.byRef`.

### 2.2 Guide tagging
- Each non-hunt question gets `ts` (primary task statement, e.g. `"1.4"`) and `scenario` (1–6, or 0 = general). Domain = `D` + first digit of `ts` — the single source of truth for domain in Blueprint and Mock.
- Mapping lives in `scripts/guide_tags.py` (hand-reviewed table). `scripts/check_bank.py` asserts unique ids, valid `ts`/`scenario`, `correct` in range, and that each domain pool can fill its quota.

### 2.3 Guide outline (`guide.js`)
`window.GUIDE = { version, exam, domains, taskStatements, scenarios, outOfScope }`. Titles are the guide's short task-statement names; the key ideas are our own short paraphrase, not the guide's text.

### 2.4 Gap fill (separate commit, flagged for review)
Task statements below 4 questions get new original items (`guide-extra` bank key): 1.6 has none today; 1.7, 2.1, 2.5, 3.3, 3.5, 4.1, 4.2 have 1–2; 3.4, 5.3 have 3.

### 2.5 Per-question stats
`save.qstats[id] = { seen, right, last (0/1), at (epoch ms) }`, written by every mode via `Game.recordAnswer(ok, id)`.

## 3. Mode A — The Blueprint (exam guide study)

Home card: **📘 The Blueprint**.
- Exam facts strip (60 items · 120 min · 4 of 6 scenarios · pass 720 scaled).
- **By domain** (default): 5 domain panels (weight, exam item count, seen/right-last-try). Each lists its task statements with title, key ideas (knowledge + skills), question count, seen x/y · right z, and a **Drill** button (`min(10, available)` questions, immediate feedback, misses → clinic). Plus **Drill domain** (10 Qs, biased toward least-seen / last-missed).
- **By scenario**: 6 cards (name, our blurb, domain chips, question count, stats) with **Drill scenario**.
- "Focus next" call-out: up to 3 weakest task statements (≥2 seen), or least-covered if nothing is seen yet.
- Out-of-scope list at the bottom.
- XP: 15 per correct answer in drills.

## 4. Mode B — Mock Exam (replaces The Proctor)

Intro screen offers **Mock Exam** (strict) and **Practice Exam**.

### 4.1 Assembly (both variants)
1. Draw 4 of 6 scenarios at random, rejecting draws that leave a domain with no primary scenario.
2. For each domain, fill its quota from in-scope questions of that domain, ordered by: tagged to a drawn scenario first, then least-recently-seen (unseen first), random tie-break.
3. Group items into scenario blocks in draw order; questions whose scenario wasn't drawn go into a final "General" block. Each question shows its scenario chip; the first question of each block shows the scenario's one-line setup.

### 4.2 Strict Mock Exam
- One 120-minute countdown from an absolute deadline; no feedback until submit. Free navigation, flags, navigator (answered / flagged / current).
- **Pace** readout: target position = elapsed ÷ 2 min → "on pace", "N min ahead", "N min behind".
- **Persistence** in `aa-exam-attempt`: `{v, attemptId, bankHash, ids, orders (option permutation per item), sel, flags, idx, startedAt, deadline, scenarios, status}`. Saved on every answer / flag / navigation.
  - Load with live deadline → home shows "Resume mock exam (mm:ss left)"; starting a new one asks to abandon it.
  - Load after deadline → auto-submit with saved answers.
  - Missing ids or changed bankHash → attempt voided with a toast.
  - `storage` event from another tab → warning toast.
  - Deadline passes while the user is elsewhere in the app → scored at the deadline if the tab is visible and on a calm screen (home, intro, Blueprint, Tower, trophies, bestiary), otherwise when it is next shown on one or navigates to one; starting a new exam scores it first instead of offering to abandon it.
  - Submit and reset leave a marker `{attemptId, status}`, and a new attempt replaces the record, so another tab can't write an ended attempt back as live; a tab whose attempt was ended or replaced elsewhere stops without scoring.
- Submit is idempotent (status guard), so history, XP and clinic updates happen once. Unanswered items score as wrong but aren't recorded as seen in `qstats`.

### 4.3 Practice Exam
- Same assembly and blocks. Answer → immediate verdict + explanation, then next. Per-question 2:00 countdown that turns red past budget (never locks). Not persisted, not counted toward best or the Certified achievement.

### 4.4 Results
- Raw `N/60 (pct%)` and **estimated scaled score** (piecewise, anchored 72% → 720). Band: below target / near target / at or above target, with a note that one attempt is ±~100 points.
- Per-domain counts and %, per-scenario counts.
- "Seen before: N of 60" note.
- **Focus next**: weakest task statements from cumulative stats, each with a Drill link into The Blueprint.
- Time used and average per question.
- Review list (filter: all / wrong / flagged) with explanations and task-statement labels. Misses → Mistake Clinic.
- History entry: `{mode, score, correct, total, pct, perDomain, scenarios, date}`. `examBest` = best strict-mock scaled score; the old Proctor best moves to `legacyExamBest`.

## 5. Non-goals
No backend, build step or libraries; stays a static GitHub Pages site. No verbatim guide text or guide sample questions. Tower, Lightning and Hunt gameplay unchanged except stable ids + stats.

## 6. Acceptance checks
1. `python3 scripts/check_bank.py` passes: unique ids, every non-hunt Q has valid `ts`/`scenario`, every task statement ≥ 4 in-scope Qs, each domain pool ≥ 1.5× quota.
2. A pre-change save with `{src, idx}` clinic cards loads and shows the same questions.
3. Mock exam always yields 60 unique in-scope items with exactly 16/11/12/12/9 by domain.
4. Reloading mid-mock resumes with the same questions, option order, answers and the correct remaining time; reloading after the deadline auto-submits once.
5. `scripts/build_tests.py` still runs.
6. Works in light/dark themes and at phone width.

## 7. Official resources (added after research, Oct 24 2026)
- `GUIDE.docs`: 2–3 official documentation links per task statement (84 total), each fetched and checked.
- `GUIDE.deltas`: short notes where current docs have moved on since the July guide (e.g. Task tool renamed to Agent; forced `tool_choice` rejected on the newest models). The exam follows the guide, so items keep the guide's terms.
- `GUIDE.prep`: exam-day facts from official program pages, free official courses, and candidate-reported tips (themes only).
- Not collected, by design: leaked or "brain dump" exam items. The guide's NDA and the exam policy forbid disclosing exam content, and using it risks result invalidation and credential revocation.

## 8. Follow-ups
Multiple-response items (+ renderer), more scenario-framed questions so blocks can be scenario-pure, heatmap view, Blueprint achievement. Re-check after Nov 17 2026, when Pearson publishes updated guides (CCAR-F is not on the Dec 7 update list).
