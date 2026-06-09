# CCA-F Study Guide — 12 weeks, 1 hour a day

*Mapped to the game's tower. Current as of June 2026 (exam launched March 12, 2026).*

**Target:** 720/1000 on the real exam. **Game gate before booking:** clear all
ten floors, then beat The Proctor twice in a row — once above 750, once above 800.

## How the hour breaks down

20 min reading/building · 25 min game (the day's floor or mode) · 15 min
Mistake Clinic. The clinic is non-negotiable — it is your error surface.

## Phase 1 — Agentic foundations (weeks 1–3 · D1 · 27%)

**Week 1 · F1 The Loop Chamber.** The agentic loop: send → check `stop_reason` →
on `tool_use` execute, append assistant message + `tool_result`, resend full
history → on `end_turn` stop. `max_tokens` means truncation. Parallel tool
calls: several `tool_use` blocks in one response, all results in the next turn.
Anti-patterns: parsing prose for "done", iteration caps as primary control,
checking `content[0].type`. Build a minimal loop against the API.
*Boss gate: clear F1.*

**Week 2 · F2 Coordination Hall.** Hub-and-spoke; subagent context is isolated —
pack facts into the task prompt explicitly. Parallel subagents = multiple Task
calls in one response. `allowedTools` must include Task. Custom subagents in
`.claude/agents/` (cheap Haiku scouts, stronger synthesizers). Decomposition
sins: too narrow → coverage gaps; overlapping → duplicates. `fork_session` to
branch from a shared baseline. *Boss gate: clear F2.*

**Week 3 · F3 The Hook Forge.** PreToolUse (exit code 2 blocks, stderr returns
to the model), PostToolUse (normalize/trim, `additionalContext`),
UserPromptSubmit, SessionStart (`reloadSkills`), Stop. The law of the floor:
hooks are deterministic, prompts are probabilistic — refund caps, PII, protected
paths go in hooks. Build the $500 refund-cap hook. *Boss gate: clear F3.*

## Phase 2 — Tools and configuration (weeks 4–6 · D2+D3 · 38%)

**Week 4 · F4 The Tool Armory.** Descriptions are the selection mechanism;
differentiate near-identical tools before adding routing layers. 4–5 tools per
role; remove cross-role tools rather than prompting against them. Structured
errors: `errorCategory`, `isRetryable`, attempted query, partial results. Empty
result ≠ error. `tool_choice`: auto / any / forced / none — force then relax.
MCP scopes: project `.mcp.json` (committed, `${ENV_VAR}` secrets) vs user
`~/.claude.json` vs local. Built-ins: Glob for paths, Grep for content,
Grep→Read discovery. *Boss gate: clear F4.*

**Week 5 · F5 The Config Maze.** CLAUDE.md hierarchy (user / project /
directory), `@import`, `.claude/rules/` with `paths:` globs. Commands vs
skills; SKILL.md frontmatter: `description` (auto-invocation), `context: fork`,
`allowed-tools`, `argument-hint`; progressive disclosure. `/memory`,
`/reload-skills`. Set up a real project config for your team. *Boss gate: clear F5.*

**Week 6 · F6 The Pipeline Forge.** Plan mode for multi-file/architectural work;
direct execution for obvious fixes. Headless: `claude -p`,
`--output-format json|stream-json`, `--json-schema` (beware fake flags:
`CLAUDE_HEADLESS`, `--batch`, `--headless`). Generator and reviewer in separate
sessions; feed prior findings on re-review; provide existing tests to prevent
duplicates. Batch API for nightly audits only — never blocking checks.
*Boss gate: clear F6. Midpoint: run The Proctor once for a baseline.*

## Phase 3 — Output discipline (weeks 7–8 · D4 · 20%)

**Week 7 · F7 Prompt Workshop.** Explicit flag/skip criteria beat "be careful".
A high-false-positive category nukes reviewer trust — disable it, fix offline.
Few-shot (2–4 examples) for format and for ambiguous-case judgment with
reasoning. `tool_use` schemas: syntax guaranteed, semantics not. Nullable
fields stop fabrication; enums take `other`/`unclear` + detail. Prompt caching:
stable prefix first. *Boss gate: clear F7.*

**Week 8 · F8 Validation Gauntlet.** Retry **with the specific validation
errors** appended; absent source info → retries are useless, return null.
`stated_total` vs `calculated_total` + conflict flag. Batch `custom_id`
resubmission: chunk the oversized, retry the transient. Pilot a sample before
10k jobs; leave SLA buffer inside the 24h window. Multi-pass review: per-file
then cross-file integration; attention dilution is the tell. *Boss gate: clear F8.*

## Phase 4 — Context and reliability (weeks 9–10 · D5 · 15%)

**Week 9 · F9 The Memory Halls.** Case-facts blocks keep $147.23 from becoming
$47. Structured issue lists survive turn 15. Trim 40-field lookups. Lost in
the middle: top placement + headers. Escalation: honor explicit human requests
immediately; policy gaps and no-progress escalate; sentiment and self-reported
confidence never decide. Transient errors recover locally; unresolvable ones
propagate with context. *Boss gate: clear F9.*

**Week 10 · F10 Synthesis Chamber.** Long-session degradation → scratchpads,
`/compact`, subagent delegation; manifests for crash recovery. Aggregate
accuracy lies — validate per type and field; stratified sampling for drift.
Provenance: claim-source mappings, temporal metadata, preserve conflicts with
attribution (never average them away). *Boss gate: clear F10 — tower complete.*

## Phase 5 — Exam conditioning (weeks 11–12)

**Week 11.** Anti-Pattern Hunt until the bestiary is full. Empty the Mistake
Clinic. The Proctor, untimed pressure: target 750+. Print
`practice-tests/full-exam-01.md`, sit it on paper at full 120-minute conditions.

**Week 12.** Drill your two weakest Proctor domains via floor rematches (aim ★).
The Proctor twice more: 800+ and you book the real exam. Day before: Lightning
Rounds and the bestiary table in GAME.md. Day of: read the scenario for the
root cause; the patch answers are the distractors.

## The one-sentence cheat sheet

If two answers look right, pick the one that **fixes the root cause with a
deterministic mechanism** — and if the question smells like a monster from the
bestiary, it is.
