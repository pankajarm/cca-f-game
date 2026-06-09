# Practice Test 06: The Pipeline Forge
**D3: Claude Code Configuration & Workflows** (20% of the exam) — Plan mode & CI/CD

15 questions. Exam pace is 2 minutes per question; aim for 30 minutes.
Pass bar in the game: 7/10 on a random draw. Pass bar here: be honest.

---

## Question 1
An engineer at a logistics company asks Claude Code to migrate the order-routing module from REST to gRPC — a change touching 35 files across three packages, with at least two viable migration strategies. Claude immediately starts editing files, and the engineer has to interrupt halfway through when the chosen approach turns out to conflict with the team's service-mesh setup. What should the engineer have done differently?

A) Cap the session at 10 file edits so a wrong approach fails fast and can be restarted
B) Add a CLAUDE.md rule telling Claude to describe every change before each edit
C) Start the task in plan mode so the migration strategy is reviewed and approved before any edits
D) Split the migration into 35 single-file sessions so each change stays small and obvious

<details>
<summary>Answer & explanation</summary>

**C)** Plan mode is designed for exactly this profile — multi-file, architectural work with multiple valid approaches — because the strategy gets reviewed before any code changes happen. Direct execution is only appropriate for single-file, obvious fixes. Splitting into 35 single-file sessions hides the architectural decision rather than surfacing it, an edit cap restarts the same mistake instead of preventing it, and a per-edit narration rule in CLAUDE.md is a probabilistic instruction, not a review gate.

*Hint if stuck: Match the execution mode to the shape of the change: how many files are touched, and how many valid approaches exist?*
</details>

---

## Question 2
A release engineer adds a GitHub Actions step that should have Claude Code turn the merged commits into release notes. She tries CLAUDE_HEADLESS=true claude "summarize the commits" and the job hangs waiting for an interactive terminal until the runner times out. Which invocation actually runs Claude Code non-interactively in CI?

A) claude -p "Summarize the merged commits into release notes"
B) claude --headless "Summarize the merged commits into release notes"
C) claude --batch "Summarize the merged commits into release notes"
D) Set CI=true so Claude Code detects the pipeline and disables interactive mode itself

<details>
<summary>Answer & explanation</summary>

**A)** claude -p is the headless print mode: it executes the prompt non-interactively, prints the result, and exits — the supported pattern for CI pipelines. --headless, --batch, and CLAUDE_HEADLESS-style environment variables are not real Claude Code interfaces, and there is no CI auto-detection that substitutes for -p.

*Hint if stuck: Exactly one real flag puts Claude Code into print-and-exit mode; the others are invented.*
</details>

---

## Question 3
A fintech team's pipeline runs claude -p to triage failing integration tests, then a Python script scrapes the verdict out of Claude's prose with a regex. Every few weeks the wording shifts ("the likely culprit is..." vs "root cause:") and the parser silently mis-routes tickets to the wrong on-call team. What fixes the root cause?

A) Tighten the regex to cover the new phrasings and add unit tests for the parser
B) Run claude -p with --output-format json and read the verdict from the structured result envelope
C) Append "always begin your answer with the exact phrase ROOT CAUSE:" to the prompt
D) Capture stderr and stdout separately so the prose and the verdict do not interleave

<details>
<summary>Answer & explanation</summary>

**B)** Scraping free-form prose is the root flaw; --output-format json makes claude -p emit a machine-readable envelope the script can parse deterministically. A prompted sentinel phrase is probabilistic and will eventually drift just like the prose did, hardening the regex only restarts the breakage cycle with the next wording change, and stream separation does nothing about wording inside the prose itself.

*Hint if stuck: Choose deterministic machine-readable output over ever-smarter parsing of natural language.*
</details>

---

## Question 4
A nightly job runs claude -p with --output-format json to scan a repo for deprecated API usage and must hand a dashboard importer records shaped like {file, line, severity}. The JSON envelope always parses, but the result field inside is free-form text, and the importer rejects roughly one run in five. What gives the importer a typed guarantee?

A) Add three correctly formatted example records to the prompt and rerun any failures
B) Pin the model version so the formatting stays stable from run to run
C) Chain a second claude -p call that reformats the first run's output into the record shape
D) Pass the record schema to the job with --json-schema so the result payload itself is typed

<details>
<summary>Answer & explanation</summary>

**D)** --output-format json structures the envelope, not the content inside it; --json-schema constrains the result payload to the supplied schema, which is what the importer's contract needs. Few-shot examples improve the odds but remain probabilistic, pinning the model version still leaves the result field free-form, and a second reformatting call adds cost while still offering no guarantee.

*Hint if stuck: One flag structures the wrapper around the answer; a different flag types the answer itself.*
</details>

---

## Question 5
An e-commerce monorepo runs a long dependency-upgrade job through claude -p that takes about nine minutes. The CI runner kills any step that is silent on stdout for five minutes, so the job dies mid-run with nothing logged. The team wants real visibility into what the job is doing, not just a way to keep the runner from killing it. What should they change?

A) Raise the runner's silence threshold to fifteen minutes for this one job
B) Wrap the step in a shell loop that echoes a heartbeat line every sixty seconds
C) Run the job with --output-format stream-json so events are emitted incrementally as they occur
D) Split the upgrade into several claude -p calls so each one finishes in under five minutes

<details>
<summary>Answer & explanation</summary>

**C)** stream-json emits each event as it happens, which keeps stdout active for the watchdog and gives the team a live trace of what Claude is actually doing. A heartbeat echo quiets the watchdog but reveals nothing about progress, raising the threshold just hides the observability gap, and splitting the job adds orchestration complexity while each call still runs as a silent blob.

*Hint if stuck: Think incremental events flowing out during the run, not one blob at the end.*
</details>

---

## Question 6
A 14-person platform team wants every GitHub pull request reviewed by Claude before human review. Today, reviews only happen when a developer remembers to run a review prompt locally, and about a quarter of PRs merge without one. What is the standard way to automate this?

A) A nightly cron job that batch-reviews everything merged during the previous day
B) Add claude-code-action to the repository's GitHub Actions workflow triggered on pull requests
C) A pre-push hook on each developer laptop that runs claude -p against the branch diff
D) A required PR checklist item where the author pastes the output of their local Claude review

<details>
<summary>Answer & explanation</summary>

**B)** claude-code-action is the supported GitHub Actions integration for PR review: it runs server-side on every pull request, removing the dependency on individual developer discipline. Laptop hooks and checklist items still rely on each developer's machine and memory, and a nightly batch review lands after merge — too late to gate anything.

*Hint if stuck: Pick the mechanism that runs server-side on every PR regardless of what any developer remembers to do.*
</details>

---

## Question 7
A healthcare intake startup has one Claude Code session generate a FHIR message parser and then, in the same session, asks "now review the code you just wrote for bugs." The review comes back clean, yet a null-handling defect ships to staging that week. What is the architectural flaw?

A) The reviewer shares the generator's context, so it inherits and re-confirms the same reasoning that produced the bug
B) The review prompt was too gentle; it should have demanded "be extremely critical and assume bugs exist"
C) The session ran low on context window before the review, so the code was only partially re-read
D) The generation step used too small a thinking budget, leaving the review without reasoning depth

<details>
<summary>Answer & explanation</summary>

**A)** Same-session self-review keeps the entire generation rationale in context, so the model tends to confirm its own earlier decisions rather than challenge them. The fix is a separate reviewer session that sees only the code, not the reasoning behind it. Harsher prompt wording does not remove the bias because the original justifications are still sitting in the reviewer's context, and neither context exhaustion nor thinking budget explains why a clean-looking review systematically misses the generator's own mistakes.

*Hint if stuck: Consider what this reviewer can see that a genuinely independent reviewer never would.*
</details>

---

## Question 8
A claude-code-action review runs on every push to a PR. When a developer pushes a fix commit, the bot re-reviews and reposts the same nine findings as brand-new comments, and developers have started muting it entirely. The team wants re-reviews to surface only new issues or ones still unresolved. What is the best fix?

A) Post-process the bot's output and suppress any comment whose text fuzzy-matches an earlier comment
B) Restrict each re-review to only the files touched by the newest commit
C) Have the action close all of its previous comment threads before posting each fresh review
D) Include the prior review's findings in the new run's context so it skips duplicates and checks resolution

<details>
<summary>Answer & explanation</summary>

**D)** The reviewer cannot avoid repeating itself or judge whether an issue was fixed unless it knows what it found last time — feeding prior findings into the re-review fixes that at the source. Fuzzy-match suppression breaks the moment wording shifts and can never confirm a finding was resolved, diff-only re-review silently drops unresolved findings in files the fix commit did not touch, and closing old threads just hides the duplication.

*Hint if stuck: A reviewer can only avoid duplicate findings if it has access to its own previous findings.*
</details>

---

## Question 9
A nightly CI audit invokes claude -p to assess code quality across a payments repository and is meant to be strictly read-only. One morning the team discovers the job rewrote two config files and committed them via Bash, even though the prompt says "do not modify anything." What is the strongest fix?

A) Strengthen the prompt: "READ-ONLY audit. Never use Edit, Write, or Bash under any circumstances"
B) Add a PostToolUse hook that git-restores any file the audit job touches
C) Launch the job with --allowedTools limited to Read, Grep, and Glob so write-capable tools do not exist in the session
D) Run the CI job under a Git identity that lacks push permission to the repository

<details>
<summary>Answer & explanation</summary>

**C)** --allowedTools deterministically scopes what the session can do — with Edit, Write, and Bash absent, the job cannot modify anything regardless of what the model decides. Prompt prohibitions are probabilistic and have already failed once; revoking push permission still allows local edits that corrupt the workspace, and a PostToolUse revert cleans up damage instead of preventing it.

*Hint if stuck: Deterministic removal of a capability beats both instructions and after-the-fact cleanup.*
</details>

---

## Question 10
A CI job asks Claude Code to generate unit tests for the files changed in each PR. Within a month the suite contains over 60 tests that duplicate existing coverage almost verbatim — same fixtures, same assertions — and CI time has doubled. What fixes the root cause?

A) Add "do not write tests that already exist" to the generation prompt
B) Include the package's existing test files in the job's context so generation targets uncovered gaps
C) Run a post-generation script that deletes any new test whose name matches an existing test
D) Cap the job at five new tests per PR to limit how fast duplication can accumulate

<details>
<summary>Answer & explanation</summary>

**B)** The model cannot avoid duplicating tests it has never seen — the root cause is missing context, not a missing instruction. Providing the existing tests lets generation target genuine coverage gaps. The prompt rule is unenforceable without that visibility, name-matching deletion misses duplicates with different names, and a cap only slows the bloat.

*Hint if stuck: An instruction is useless if the model lacks the information needed to follow it.*
</details>

---

## Question 11
A claude-code-action review handles the team's typical 300-line PRs well, but on a 4,800-line vendored-library upgrade it produced detailed comments on the first dozen files, skimmed the remaining forty with one-line notes, and closed with a normal wrap-up well under its output limit — missing a known injection bug in file 38. What should the team change?

A) Split large PRs into multiple review passes, one per module, and aggregate the findings
B) Switch the review to Opus with a maximum thinking budget so a single pass can cover everything
C) Prompt the reviewer to "give equal attention to every file regardless of its position in the diff"
D) Raise the action's maximum output tokens so the review is not truncated partway through the files

<details>
<summary>Answer & explanation</summary>

**A)** A single pass over a 4,800-line diff dilutes attention, and material deep in the context gets skimmed or missed — the lost-in-the-middle failure mode. Multi-pass review keeps each chunk within a size the model handles reliably and aggregates the results. The review finished normally under its output limit, so truncation is not the cause; a bigger model or thinking budget does not fix attention dilution, and an "equal attention" instruction is a best-effort wish, not a mechanism.

*Hint if stuck: When one context has to cover too much material, divide the work instead of exhorting the model.*
</details>

---

## Question 12
A platform team runs a nightly deprecation audit over 7,500 source files using parallel synchronous API calls at 2 a.m. The findings feed a weekly cleanup rotation, so nothing downstream ever blocks on the results, and the job now accounts for 30% of monthly model spend. Which change cuts cost without reducing coverage?

A) Downgrade the audit to a weekly run so the spend is divided by seven
B) Add cache_control breakpoints to every request to discount the per-file token cost
C) Strip comments and whitespace from each file before sending to shrink input tokens
D) Submit the audit through the Batch API with a custom_id per file and poll until results arrive

<details>
<summary>Answer & explanation</summary>

**D)** The audit is fully non-blocking — exactly the profile the Message Batches API targets: a 50% discount, results within 24 hours with no latency SLA, and custom_id to match each result back to its file. A weekly cadence cuts how often issues are caught rather than unit cost, prompt caching only discounts a stable shared prefix and not the unique file content dominating this spend, and stripping comments yields marginal savings while distorting the line numbers the audit reports.

*Hint if stuck: When nobody is waiting on the response, one pricing model exists specifically for that situation.*
</details>

---

## Question 13
To save money, a team moved its required pre-merge license-compliance check onto the Batch API. Most batches come back within 20 minutes, but some PRs sit blocked for six hours, and one Friday a batch took nearly a full day and froze all merges. What is the correct architecture?

A) Split each submission into smaller batches so individual batches complete faster
B) Run the blocking check synchronously via claude -p and reserve the Batch API for non-blocking audits
C) Poll batch status every 30 seconds instead of every 10 minutes to retrieve results sooner
D) Submit each PR's check as its own single-item batch so it never queues behind larger jobs

<details>
<summary>Answer & explanation</summary>

**B)** The Batch API promises results within 24 hours and offers no latency SLA, so anything that gates merges must run synchronously. Polling cadence and batch sizing only change when you notice completion, not when it happens — the 24-hour window applies regardless of how small the batch is, including a single-item batch.

*Hint if stuck: One API trades a latency promise for a discount — match it only to work where nobody is blocked.*
</details>

---

## Question 14
A release-notes step running claude -p in CI produces a different structure almost every run — sometimes bullets grouped by team, sometimes a single paragraph, sometimes a table of raw commit hashes. The prompt already says "be consistent, concise, and professional." What is the most effective next step?

A) Add two or three concrete input/output examples of the desired format and refine them against failed runs
B) Replace the adjectives with a longer prose description spelling out every formatting rule
C) Pin the temperature to zero so the model makes identical choices on every run
D) Move the step to a larger model that follows style instructions more faithfully

<details>
<summary>Answer & explanation</summary>

**A)** Adjectives like "consistent" underdefine the target; concrete input/output examples show the exact structure, and iterating on them against real failed runs closes the remaining gaps. Temperature zero only makes output deterministic for identical input — every release has different commits, so the format still drifts — a larger model still has no definition of the desired shape, and longer prose rules remain more ambiguous than one worked example.

*Hint if stuck: Show the model what success looks like rather than describing it, then tune against real failures.*
</details>

---

## Question 15
After a botched refactor, a developer-productivity lead mandates plan mode for every Claude Code task. Two weeks later, developers complain that fixing a docstring typo or bumping a version string now requires reviewing and approving a plan, and several have stopped using the tool. What policy matches the actual intent of plan mode?

A) Keep the mandate but configure plans to auto-approve after 30 seconds without objection
B) Drop plan mode entirely and rely on PR review to catch bad approaches after the fact
C) Reserve plan mode for multi-file or architectural work and let single-file obvious fixes run directly
D) Keep plan mode mandatory but route trivial fixes to a faster model so plans generate quicker

<details>
<summary>Answer & explanation</summary>

**C)** The criterion is the shape of the change: plan mode earns its overhead on multi-file, architectural tasks where multiple valid approaches exist, while single-file obvious fixes warrant direct execution. Auto-approving plans deletes the review that is plan mode's entire value, a faster model still forces a pointless approval step on trivial fixes, and dropping it everywhere recreates the risk that caused the original botched refactor.

*Hint if stuck: The mode should follow the blast radius of the change, not a blanket rule in either direction.*
</details>

---
