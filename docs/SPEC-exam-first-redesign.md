# Spec: exam-first redesign and a 3.5x question bank

Status: **v2, revised after Consensus Board review** (seats: claude, codex, reasonix, opencode) · Oct 26 2026
Builds on [SPEC-exam-guide-and-mock-exam.md](SPEC-exam-guide-and-mock-exam.md). Its decisions still hold unless changed here.

## 0. Goals (from Pankaj)
1. Remove the 12 Anti-Pattern Hunt vignettes and the 4 out-of-scope items, so every game uses only questions mapped to an exam domain and task statement.
2. Redesign the games from the perspective of preparing for the real exam.
3. Grow the bank 3x–5x so someone taking several mocks keeps getting new questions instead of building false confidence on repeats.
4. (Sibling work) A Learn track with staged lessons, slides and video. This spec only reserves its place on the home screen.

## 1. What the board changed (v1 → v2)

| Topic | v1 draft | v2 decision | Why |
|---|---|---|---|
| Readiness | project a scaled-score band from practice accuracy | **No projected score from practice.** Show coverage and **first-try** accuracy per domain; the only score estimate is the latest strict mock's | Practice accuracy on our own items is an upper bound, and last-try accuracy is inflated by retries (unanimous) |
| Readiness gating | 30% coverage per domain | **Absolute: 20 first tries per domain** | A percentage gets harder every time the bank grows |
| Lightning | keep as is | **Recall Sprint** over questions already studied; timed answers never set a first try | 90 s over unseen scenario stems trains skimming, not exam behaviour |
| Hunt | own code path | **A themed skin over the drill engine** (one engine for Blueprint drills and Hunt) | Fewer implementations; every Hunt question is a real exam-mapped item |
| Tower | 10 floors or 5 wings | **Keep 10 floors and their save keys**, re-map to task-statement groups, draw from the whole pool | No migration; floors grow with the bank |
| Mock exposure | counted at build | **Counted when displayed**, once per attempt, for mock and practice exams | Counting at build marks items the learner never saw |
| Mock ranking | mockSeen → never answered → scenario → oldest | same, plus **a per-task-statement cap** inside each domain quota | Keeps a big task-statement pool from crowding out small ones |
| Results | "N seen before" | **Two numbers:** new to you, and appeared in an earlier mock | Honest about what a repeat-heavy score means |
| Saved mock | void when the bank hash changes | **Void only if one of its own questions is gone** | Bank growth shouldn't kill a running mock |
| Length cue | cap new items at 35% | **Fix the old 197 too; whole bank kept between 15% and 30%** | Blended bank would still sit at ~42%; and "never the longest" is a cue too |
| Bank target | 750 at once | **750 target, authored breadth-first, independently reviewed per batch** | Quality risk at volume |
| Source | — | **`src` doc URL on every new item** | Traceability when docs change |

Kept against advice: delivering the whole 750 in this PR rather than a 400–450 first wave, because Pankaj asked for 3x–5x and a smaller wave doesn't meet it. Each batch passes an independent reviewer before merge, which is the quality gate the waves were meant to provide.

Deferred (follow-ups): multiple-response items (still single-answer; the real exam has MR), a "report this question" button, per-option choice stats, exam-date countdown, a ts × scenario coverage grid gate.

## 2. Removal
- `hunt` bucket (hunt-00…hunt-11) and f07-11, f07-13, mx2-12, mx2-13 removed. Their ids are **retired**: `check_bank.py` fails if any is reused, and `oos` items are no longer allowed in the bank.
- Save schema 4 (`migrate4`, backup at `architects-ascent-v2.bak`): drop clinic cards and qstats for retired ids; `Cache Vampire` in the bestiary maps to its in-scope replacement **Schema Shapeshifter** (4.3, 4.1).
- `Bank.inScope()` is every question; bank keys are storage buckets only (no mode reads a bucket directly).

## 3. Home: a study path
1. **Exam readiness** panel: for each domain, coverage (first tries out of 20) and first-try accuracy against a 72% line; weighted practice accuracy once every domain has 20 first tries; last strict-mock estimate with its date. **Next best step** (one button): Learn or a D1 drill for a new player → Clinic at 10+ cards → the domain with the fewest first tries → a mock when weighted first-try accuracy ≥ 72% and no mock in 7 days → the weakest task statement drill (with its lesson when Learn has one).
2. **Learn**: Learning Path card (shown when `window.Learn` exists; the sibling thread owns `learn.js`, `screen-learn`, `screen-lesson`) and The Blueprint. Blueprint task-statement rows get a 🎓 Lesson button via `Learn.forTs(ts)`.
3. **Practice**: Tower, Anti-Pattern Hunt, Mistake Clinic, Recall Sprint.
4. **Test**: The Proctor (Mock + Practice exam).
5. **Your record**: stats, Bestiary, Trophy Hall.

### Modes
- **Tower:** F1 1.1 · F2 1.2 1.3 1.6 · F3 1.4 1.5 1.7 · F4 2.1–2.5 · F5 3.1–3.3 · F6 3.4–3.6 · F7 4.1–4.3 · F8 4.4–4.6 · F9 5.1–5.3 · F10 5.4–5.6. Each battle: 10 questions from the floor's task statements, unseen first, taking turns across task statements (`Bank.pick(refs, n, spread)`).
- **Anti-Pattern Hunt:** each of the 12 monsters haunts 1–3 task statements. A hunt is an 8-question drill over them; 6/8 captures (+100 XP). Bestiary cards show where each monster haunts and start its hunt.
- **Recall Sprint:** 90 s over questions you've seen (falls back to the whole pool under 20 seen). Answers count as seen but never as a first try.
- **Blueprint drills, Clinic:** unchanged apart from spread across task statements for domain and scenario drills.
- **Per-question stats:** `qstats[id].first` (0/1) is set on the first untimed answer. Older multi-try stats have no first try and don't count toward readiness.

## 4. Mock assembly prefers unseen
`save.mockSeen[id]` = how many mock or practice exams displayed the question. Within each domain quota (16/11/12/12/9), questions are ranked by fewest earlier exams, then never answered anywhere, then a drawn scenario, then least recently seen, random tie-break; no task statement takes more than `ceil(quota / task statements) + 1` until the quota needs it. With ~12x each domain quota in the pool, about a dozen mocks fit before any question must repeat.

## 5. Bank growth
- Target ≈ 750: D1 ~203, D2 ~135, D3 ~150, D4 ~150, D5 ~112 (27/18/20/20/15). Every task statement ≥ 18 (D5 sits near that floor by design).
- New items: bucket `bank-dN`, frozen ids `dN-NNN`, `ts`, `scenario` (scenario-framed, ≥ 3 scenarios per task statement, ≤ 1 general per task statement), `difficulty` core/hard, `src` (official doc URL).
- Pipeline: writers per task-statement group (brief: original items only, grounded in the guide and current docs, guide's terms where docs drifted) → `scripts/check_batch.py` → an **independent reviewer** per batch that re-verifies every key against the docs and repairs or drops items → `scripts/add_questions.py` (assigns ids, balances key positions) → `scripts/check_bank.py`.
- Never leaked or reconstructed exam items, and not the guide's sample questions.

## 6. Acceptance checks
1. `python3 scripts/check_bank.py` passes: unique and non-retired ids, valid ts/scenario on every item, no `oos`, ≥ 18 per task statement, each domain pool ≥ 8x its quota, key is the longest option in 15–30% of items, each key position 20–30%, no near-duplicate stems.
2. Mock: 60 unique items at exactly 16/11/12/12/9; a second mock right after the first shares no questions.
3. A schema-3 save with retired ids in its clinic and qstats loads cleanly; Cache Vampire becomes Schema Shapeshifter.
4. A mock started before a bank update resumes after it.
5. `scripts/build_tests.py` runs (10 floor tests by task statement, 3 disjoint printable mocks).
6. Light/dark and phone width.
