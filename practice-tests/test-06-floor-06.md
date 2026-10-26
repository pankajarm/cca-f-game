# Practice Test 06: The Pipeline Forge
**D3: Claude Code Configuration & Workflows** (20% of the exam) · task statements 3.4, 3.5, 3.6

18 questions. Exam pace is 2 minutes per question.

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
After a botched refactor, a developer-productivity lead mandates plan mode for every Claude Code task. Two weeks later, developers complain that fixing a docstring typo or bumping a version string now requires reviewing and approving a plan, and several have stopped using the tool. What policy matches the actual intent of plan mode?

A) Keep the mandate but configure plans to auto-approve after 30 seconds without objection
B) Drop plan mode entirely and rely on PR review to catch bad approaches after the fact
C) Reserve plan mode for multi-file or architectural work and let single-file obvious fixes run directly
D) Keep plan mode mandatory but route trivial fixes to a faster model so their plans generate and get approved quicker

<details>
<summary>Answer & explanation</summary>

**C)** The criterion is the shape of the change: plan mode earns its overhead on multi-file, architectural tasks where multiple valid approaches exist, while single-file obvious fixes warrant direct execution. Auto-approving plans deletes the review that is plan mode's entire value, a faster model still forces a pointless approval step on trivial fixes, and dropping it everywhere recreates the risk that caused the original botched refactor.

*Hint if stuck: The mode should follow the blast radius of the change, not a blanket rule in either direction.*
</details>

---

## Question 3
A bug report includes a clear stack trace pointing to a missing date check in one function, parseInvoiceDate, in a single file. The fix is a three-line conditional. How should the developer run it in Claude Code?

A) Direct execution: describe the fix and let Claude make the change
B) Plan mode, so the change is reviewed before any edit
C) Plan mode followed by an Explore subagent to map the codebase first
D) Fork the session so the fix can be compared against an alternative

<details>
<summary>Answer & explanation</summary>

**A)** A well-scoped, single-file fix with a clear cause is what direct execution is for. Plan mode pays off for multi-file, architectural or multi-approach work; here it only adds overhead, as do exploration or forking.

*Hint if stuck: How many valid approaches are there?*
</details>

---

## Question 4
An engineer must rename a core payment abstraction across 23 files in 4 packages, and there are two defensible strategies: an adapter layer versus an in-place rewrite. On a similar task last month, Claude started editing immediately, switched strategies midway, and left half-converted files. A teammate suggests simply bolting on a strict reviewer pass to catch the mess afterwards. What workflow should the engineer use?

A) Use plan mode to settle the strategy before edits begin, then verify with a review pass in a separate session
B) Skip planning and invest in a stronger multi-pass reviewer that is prompted to hunt for half-converted files
C) Execute directly but cap Claude at editing five files per session so any strategy switch has a contained blast radius
D) Adopt plan mode as the team default for all future tasks, including one-line typo fixes, to be safe

<details>
<summary>Answer & explanation</summary>

**A)** Multi-file architectural work with multiple valid approaches is exactly what plan mode is for — agreeing on the strategy up front prevents the mid-stream pivot, while a separate-session review still catches residual defects. A review-only workflow patches the symptom of a missing plan after damage is done, arbitrary file caps fragment the refactor without fixing strategy drift, and forcing plan mode onto obvious single-file fixes is overcorrection.

*Hint if stuck: Decide which failure should be prevented before edits begin versus merely caught afterwards.*
</details>

---

## Question 5
A release-notes step running claude -p in CI produces a different structure almost every run — sometimes bullets grouped by team, sometimes a single paragraph, sometimes a table of raw commit hashes. The prompt already says "be consistent, concise, and professional." What is the most effective next step?

A) Add two or three concrete input/output examples of the desired format and refine them against failed runs
B) Replace the adjectives with a longer prose description spelling out every formatting rule in exact, unambiguous detail
C) Pin the temperature to zero so the model makes identical choices on every run
D) Move the step to a larger model that follows style instructions more faithfully

<details>
<summary>Answer & explanation</summary>

**A)** Adjectives like "consistent" underdefine the target; concrete input/output examples show the exact structure, and iterating on them against real failed runs closes the remaining gaps. Temperature zero only makes output deterministic for identical input — every release has different commits, so the format still drifts — a larger model still has no definition of the desired shape, and longer prose rules remain more ambiguous than one worked example.

*Hint if stuck: Show the model what success looks like rather than describing it, then tune against real failures.*
</details>

---

## Question 6
A developer asks Claude Code to convert a flat CSV export into nested JSON grouped by account, then by month. After three rounds of rewording the prose description, each attempt nests the data differently. What is the most effective next step?

A) Write an even longer, more precise prose description of the nesting, covering every level in detail
B) Ask Claude to explain its interpretation before each attempt
C) Switch to a larger model, since this is a reasoning failure
D) Provide two or three concrete input rows with the exact JSON output expected for each

<details>
<summary>Answer & explanation</summary>

**D)** When prose is read inconsistently, concrete input/output examples are the clearest way to communicate a transformation. More prose has already failed three times, explanations don't pin down the target format, and model size isn't the problem.

*Hint if stuck: Show, don't tell.*
</details>

---

## Question 7
A developer needs a caching layer for a pricing service but has never built one and doesn't know the domain's failure modes. Before any code is written, what technique best surfaces design considerations they might miss?

A) Ask Claude to implement the simplest cache first and see what breaks in production
B) The interview pattern: have Claude ask questions about invalidation, staleness tolerance and failure behaviour before it implements anything
C) Have Claude write the cache and then review its own code in the same session
D) Copy a caching implementation from another service and adapt it

<details>
<summary>Answer & explanation</summary>

**B)** The interview pattern has Claude ask the questions an expert would, such as invalidation strategy and failure modes, before implementation, which is exactly what an unfamiliar domain needs. Learning from production failures is expensive, same-session self-review is weak, and copying code skips the design questions.

*Hint if stuck: Who should be asking the questions?*
</details>

---

## Question 8
After Claude implements a CSV importer, a developer finds three problems: (A) the parser drops quoted commas, (B) the serializer relies on the parser's broken field count, so fixing A will change B's output, and (C) a typo in a log message. How should the feedback be given?

A) Fix one issue per message in the order A, B, C
B) Send all three in one message, since batching is always faster
C) Describe A and B together in one detailed message because their fixes interact, and handle C separately
D) Ask Claude to rewrite the importer from scratch to avoid partial fixes

<details>
<summary>Answer & explanation</summary>

**C)** Interacting problems belong in one message so the fixes are designed together; independent ones can be handled on their own. Fixing A alone would break B, bundling the unrelated typo adds noise, and a full rewrite discards working code.

*Hint if stuck: Which of the fixes depend on each other?*
</details>

---

## Question 9
Despite a project CLAUDE.md rule saying never delete anything under fixtures/golden, a headless claude -p run in CI executed rm -rf on that directory last Tuesday, breaking 30 snapshot tests. The team needs a guarantee this cannot recur. What should they add?

A) A deny rule in settings.json permissions matching destructive Bash patterns on fixtures/golden
B) A rewritten warning at the very top of CLAUDE.md using stronger and more explicit language
C) A PostToolUse hook that detects deletions under fixtures/golden and pages the on-call engineer
D) A plan-mode requirement so destructive steps in the pipeline wait for human approval first

<details>
<summary>Answer & explanation</summary>

**A)** CLAUDE.md instructions are probabilistic, so no rewording produces a guarantee; settings.json deny rules are deterministic — the harness refuses matching calls outright, including in headless runs. The PostToolUse hook fires after the files are already gone, and pausing a headless CI run for human approval defeats the purpose of running headless.

*Hint if stuck: Guarantees come from the permission layer, not from louder instructions.*
</details>

---

## Question 10
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

## Question 11
A fintech team's pipeline runs claude -p to triage failing integration tests, then a Python script scrapes the verdict out of Claude's prose with a regex. Every few weeks the wording shifts ("the likely culprit is..." vs "root cause:") and the parser silently mis-routes tickets to the wrong on-call team. What fixes the root cause?

A) Tighten the regex to cover the new phrasings and add unit tests for the parser
B) Run claude -p with --output-format json and a --json-schema defining the verdict and owning team as enum fields, and route on that typed output
C) Append "always begin your answer with the exact phrase ROOT CAUSE:" to the prompt
D) Capture stderr and stdout separately so the prose and the verdict do not interleave, then point the existing regex parser only at the cleaned stdout stream

<details>
<summary>Answer & explanation</summary>

**B)** Scraping free-form prose is the root flaw. With --json-schema, claude -p returns a payload that matches a schema the script owns, with the verdict and team as fixed enum values, so routing no longer depends on wording; --output-format json alone would only wrap the same prose in an envelope. A prompted sentinel phrase is probabilistic and will eventually drift just like the prose did, hardening the regex only restarts the breakage cycle with the next wording change, and stream separation does nothing about wording inside the prose itself.

*Hint if stuck: Choose output typed against a schema over ever-smarter parsing of natural language.*
</details>

---

## Question 12
A nightly job runs claude -p with --output-format json to scan a repo for deprecated API usage and must hand a dashboard importer records shaped like {file, line, severity}. The JSON envelope always parses, but the result field inside is free-form text, and the importer rejects roughly one run in five. What gives the importer a typed guarantee?

A) Add three correctly formatted example records to the prompt and rerun any failures
B) Pin the model version so the formatting stays stable from run to run
C) Chain a second claude -p call that reformats the first run's output into the expected record shape
D) Pass the record schema to the job with --json-schema so the result payload itself is typed

<details>
<summary>Answer & explanation</summary>

**D)** --output-format json structures the envelope, not the content inside it; --json-schema constrains the result payload to the supplied schema, which is what the importer's contract needs. Few-shot examples improve the odds but remain probabilistic, pinning the model version still leaves the result field free-form, and a second reformatting call adds cost while still offering no guarantee.

*Hint if stuck: One flag structures the wrapper around the answer; a different flag types the answer itself.*
</details>

---

## Question 13
An e-commerce monorepo runs a long dependency-upgrade job through claude -p that takes about nine minutes. The CI runner kills any step that is silent on stdout for five minutes, so the job dies mid-run with nothing logged. The team wants real visibility into what the job is doing, not just a way to keep the runner from killing it. What should they change?

A) Raise the runner's silence threshold to fifteen minutes for this one job
B) Wrap the step in a shell loop that echoes a heartbeat line every sixty seconds
C) Run the job with --output-format stream-json --verbose so events are emitted incrementally as they occur
D) Split the upgrade into several claude -p calls so each one finishes in under five minutes

<details>
<summary>Answer & explanation</summary>

**C)** stream-json emits each event as it happens (print mode requires --verbose alongside it), which keeps stdout active for the watchdog and gives the team a live trace of what Claude is actually doing. A heartbeat echo quiets the watchdog but reveals nothing about progress, raising the threshold just hides the observability gap, and splitting the job adds orchestration complexity while each call still runs as a silent blob.

*Hint if stuck: Think incremental events flowing out during the run, not one blob at the end.*
</details>

---

## Question 14
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

## Question 15
A claude-code-action review runs on every push to a PR. When a developer pushes a fix commit, the bot re-reviews and reposts the same nine findings as brand-new comments, and developers have started muting it entirely. The team wants re-reviews to surface only new issues or ones still unresolved. What is the best fix?

A) Post-process the bot's output and suppress any comment whose text fuzzy-matches an earlier comment
B) Restrict each re-review to only the files touched by the newest commit
C) Have the action close all of its previous comment threads before posting each fresh review on the pull request
D) Include the prior review's findings in the new run's context so it skips duplicates and checks resolution

<details>
<summary>Answer & explanation</summary>

**D)** The reviewer cannot avoid repeating itself or judge whether an issue was fixed unless it knows what it found last time — feeding prior findings into the re-review fixes that at the source. Fuzzy-match suppression breaks the moment wording shifts and can never confirm a finding was resolved, diff-only re-review silently drops unresolved findings in files the fix commit did not touch, and closing old threads just hides the duplication.

*Hint if stuck: A reviewer can only avoid duplicate findings if it has access to its own previous findings.*
</details>

---

## Question 16
A nightly CI audit invokes claude -p to assess code quality across a payments repository and is meant to be strictly read-only. One morning the team discovers the job rewrote two config files and committed them via Bash, even though the prompt says "do not modify anything." What is the strongest fix?

A) Strengthen the prompt: "READ-ONLY audit. Never use Edit, Write, or Bash under any circumstances"
B) Add a PostToolUse hook that git-restores any file the audit job touches
C) Launch the job with --allowedTools limited to Read, Grep, and Glob so write-capable tools are unavailable
D) Run the CI job under a Git identity that lacks push permission to the repository, so no edits can ever be pushed

<details>
<summary>Answer & explanation</summary>

**C)** --allowedTools deterministically scopes what the session can do — with Edit, Write, and Bash absent, the job cannot modify anything regardless of what the model decides. Prompt prohibitions are probabilistic and have already failed once; revoking push permission still allows local edits that corrupt the workspace, and a PostToolUse revert cleans up damage instead of preventing it.

*Hint if stuck: Deterministic removal of a capability beats both instructions and after-the-fact cleanup.*
</details>

---

## Question 17
A CI job asks Claude Code to generate unit tests for the files changed in each PR. Within a month the suite contains over 60 tests that duplicate existing coverage almost verbatim — same fixtures, same assertions — and CI time has doubled. What fixes the root cause?

A) Add "do not write tests that already exist" to the generation prompt
B) Include the package's existing test files in the job's context so generation targets uncovered gaps
C) Run a post-generation script that deletes any new test whose name matches an existing test in the package
D) Cap the job at five new tests per PR to limit how fast duplication can accumulate

<details>
<summary>Answer & explanation</summary>

**B)** The model cannot avoid duplicating tests it has never seen — the root cause is missing context, not a missing instruction. Providing the existing tests lets generation target genuine coverage gaps. The prompt rule is unenforceable without that visibility, name-matching deletion misses duplicates with different names, and a cap only slows the bloat.

*Hint if stuck: An instruction is useless if the model lacks the information needed to follow it.*
</details>

---

## Question 18
A release-notes pipeline runs claude -p to summarize merged PRs, and a downstream script calls JSON.parse on the output. Roughly once a week the job fails because the response begins with a sentence like: Here is the JSON you requested. What is the robust fix?

A) Export CLAUDE_HEADLESS=true in the workflow so conversational prose is suppressed in print mode
B) Harden the prompt: respond with ONLY raw JSON, no prose, no code fences, or the build will fail
C) Use --output-format json together with --json-schema so the pipeline receives validated, typed output
D) Post-process the output with a regex that strips everything before the first opening brace before parsing

<details>
<summary>Answer & explanation</summary>

**C)** Headless pipelines should request machine-readable output through the CLI's first-class flags: --output-format json plus --json-schema yields typed, validated results instead of prose to parse. CLAUDE_HEADLESS is not a real mechanism, prompt hardening is probabilistic and is already failing weekly, and regex stripping patches one symptom while staying fragile to every other prose shape.

*Hint if stuck: The CLI has first-class flags for machine-readable output; one of these options invents a flag instead.*
</details>

---
