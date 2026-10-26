# Full Practice Exam 03 — CCAR-F simulation

Same format as the real exam guide: **60 questions, 120 minutes, scaled score out of 1000,
pass at 720.** Domain weighting: D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.
No question here appears in the other 2 printable exams.

Set a timer. No notes, no docs. For the interactive version with the clock, flags, and a score report, open the game.

---

## Question 1
A data extraction monorepo keeps parser modules under packages/parsers/ with strict conventions — every parser needs a golden-file test, and regex date parsing is banned — alongside general team standards. Everything lives in one 1,800-line project CLAUDE.md that bloats every session's context, and engineers report Claude Code missing the parser rules anyway. How should this be restructured?

A) Move the parser conventions into each engineer's ~/.claude/CLAUDE.md so they apply globally without inflating the shared project file
B) Create a parsers slash command in .claude/commands/ that engineers run to load the conventions before touching any parser code
C) Keep team-wide standards in the project CLAUDE.md and move parser conventions into .claude/rules/ files with frontmatter paths scoped to packages/parsers/**
D) Split the 1,800 lines into twelve topic files and @import them all back into the project CLAUDE.md so each concern is separately editable and owned by one team

<details>
<summary>Answer & explanation</summary>

**C)** Path-scoped rules (.claude/rules/*.md with YAML frontmatter paths) load conventions only when matching files are in play, keeping the always-loaded project CLAUDE.md lean for genuine team-wide standards. The @import split reorganizes the text but still loads all 1,800 lines into every session. User-level CLAUDE.md is personal and unversioned, so team conventions there drift immediately, and a slash command makes a mandatory standard opt-in and forgettable.

*Hint if stuck: Some guidance should load everywhere, and some only when matching files are being touched.*
</details>

---

## Question 2
An e-commerce ops team shares a backfill-orders skill that needs a date range and a target environment. Teammates keep invoking it with no arguments, forcing Claude to ask follow-up questions every time. The team wants the expected inputs visible right at invocation. What is the designed mechanism for this?

A) Rename the skill to backfill-orders-dates-env so the required inputs are part of its name
B) Document the usage syntax in the onboarding section of the project CLAUDE.md
C) Add argument-hint to the SKILL.md frontmatter describing the date range and environment
D) Put a usage example at the top of the skill body so it is the first content loaded

<details>
<summary>Answer & explanation</summary>

**C)** argument-hint is the frontmatter field built to surface expected arguments at invocation time. The skill body only loads after the skill is already triggered, so a usage example there arrives too late to shape what the user types. Renaming and CLAUDE.md documentation are workarounds users will not see at the moment of invocation.

*Hint if stuck: One frontmatter field exists specifically to tell invokers what to pass.*
</details>

---

## Question 3
A legal-tech coordinator must review a 200-page master services agreement using multiple subagents, and the team is debating four decomposition schemes. Which one gives the most reliable coverage?

A) One subagent per risk keyword — 'indemnity', 'liability', 'termination', 'warranty' — each scanning the whole document
B) Subagents assigned to the contract's articles and exhibits, with boundaries chosen so every page belongs to exactly one agent
C) 200 subagents, one per page, so no single agent's context is ever strained
D) A single subagent given the full contract, since splitting risks losing cross-references

<details>
<summary>Answer & explanation</summary>

**B)** Good decomposition partitions the scope: every page is owned by exactly one agent, so there are no coverage gaps and no duplicated effort, and article boundaries keep semantic units intact. Keyword-scoped agents overlap heavily and leave risks phrased without those keywords with no owner. Per-page slicing is the too-narrow pitfall — clauses spanning pages get split so no agent sees a whole obligation — and a single agent over 200 pages forfeits delegation while straining one context.

*Hint if stuck: Aim for slices that are collectively exhaustive and mutually exclusive without splitting semantic units.*
</details>

---

## Question 4
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

## Question 5
A medical-records pipeline forces its first call with tool_choice set to the extract_patient_header tool, which works, but the integration leaves that same tool_choice on every subsequent request. The model now re-extracts the header repeatedly and never calls extract_medications or produces its final summary. What is the fix?

A) Add a system-prompt rule that the header tool may be called at most once per document so the model stops repeating it
B) Switch tool_choice to any after the first turn so the model is forced to keep selecting among the remaining tools
C) Remove extract_patient_header from the tools array after the first call so the model can no longer select it
D) After the forced first call returns, send subsequent requests with tool_choice set to auto so the model can choose tools or finish

<details>
<summary>Answer & explanation</summary>

**D)** The force-then-relax pattern requires actually relaxing: leaving a named tool forced compels every turn to call that tool. Switching to auto restores the model's ability to pick the right next tool or end the turn with the final summary. tool_choice any would still force some tool call on every turn, blocking the closing prose summary; removing the tool from the array while tool_choice still names it just breaks the request instead of relaxing the constraint; and a prompt rule cannot override a forced tool_choice at all.

*Hint if stuck: Forcing a named tool is a first-turn maneuver; recall what the second half of that pattern is.*
</details>

---

## Question 6
A CI review job must check every pull request for the same three things: security issues, breaking API contract changes, and missing tests. Today one long prompt asks for all three at once and the security section is often thin. An engineer proposes replacing it with an autonomous agent that decides for itself what to investigate on each PR. What is the better design?

A) Keep one prompt but tell the model to spend equal effort on each of the three areas
B) Use the autonomous agent, since it can adapt its investigation to each pull request and decide for itself which areas deserve the most attention
C) Break the review into a fixed prompt chain with one focused step per aspect, since the aspects are known and identical on every PR
D) Run the single prompt three times and keep only findings that appear in at least two runs

<details>
<summary>Answer & explanation</summary>

**C)** When the work is predictable and multi-aspect, a fixed prompt chain gives each aspect its own focused pass and consistent coverage. Dynamic, self-directed decomposition is for open-ended investigations where the next step depends on what was found; here the steps never change. Asking for equal effort does not fix dilution inside one prompt, and majority voting suppresses real findings that only appear intermittently.

*Hint if stuck: Are the steps known in advance, or discovered along the way?*
</details>

---

## Question 7
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

## Question 8
Your CI pipeline runs claude -p to review every PR in a 40-developer monorepo. The review prompt includes the line 'be careful not to flag things that are not real problems,' yet PRs still average 12 comments each, mostly style nitpicks the linter already enforces. What is the most effective prompt change?

A) Lower the sampling temperature so the model generates fewer speculative findings and sticks to obvious problems
B) Strengthen the existing instruction to say the model should be very careful and only report issues it is extremely confident are real bugs worth a reviewer's time
C) Replace the vague caution with explicit flag and skip criteria: enumerate the defect types to report and state that linter-covered style issues are skipped
D) Add a hard cap of five comments per PR so the volume of nitpicks stays manageable for reviewers

<details>
<summary>Answer & explanation</summary>

**C)** Vague cautions like 'be careful' give the model no operational definition of a real problem, so they fail at scale; explicit flag and skip criteria provide a checkable decision rule. Confidence-based phrasing is the same vagueness restated, temperature changes randomness rather than the decision rule, and a comment cap hides noise without improving precision.

*Hint if stuck: The fix is to make the decision rule operational, not to restate the caution more forcefully.*
</details>

---

## Question 9
A platform team wrote a PreToolUse hook to stop Claude Code from editing files under infra/prod/. The script correctly detects the protected path, prints 'Edit blocked: protected production path' to stdout, and exits with code 0. In testing, the edits still go through and the agent never acknowledges any block. What is wrong?

A) PreToolUse hooks cannot block tool calls; the rule must instead be a deny entry in settings.json permissions for that path
B) The hook needs to return hookSpecificOutput.additionalContext containing the block decision
C) The hook must exit with code 2 to block the call, and write the explanation to stderr so it is fed back to the model
D) The hook fires too early to see the file path; the protection must move to a PostToolUse hook

<details>
<summary>Answer & explanation</summary>

**C)** For PreToolUse hooks, a zero exit code allows the tool call to proceed; exit code 2 is what blocks the call, and stderr (not stdout) is the channel fed back to the model explaining why. PreToolUse hooks can block calls, since gating tool calls before they run is exactly what they exist for, so no settings.json deny rule is needed. additionalContext injects information but does not block anything, and PreToolUse receives the full tool input including the file path, so it does not fire too early.

*Hint if stuck: Recall which exit code blocks a tool call and which output stream gets fed back to the model.*
</details>

---

## Question 10
A market-research agent asks Claude to compare three competitors, and the response comes back with stop_reason tool_use containing three web_search tool_use blocks. The developer's loop executes only the first tool_use block, appends a single tool_result, and resends the history. The API rejects the request. Why?

A) Every tool_use block in the response must be executed, and the next user message must carry a tool_result for each of them
B) Parallel tool calls require a separate API request per tool_use block, replayed back one at a time in order
C) Search tools cannot be parallelized, so the agent must force sequential calls by setting tool_choice to a single named tool on each turn
D) The text block preceding the tool calls must be stripped from history before any tool_results can be appended

<details>
<summary>Answer & explanation</summary>

**A)** Claude requests parallel work by emitting multiple tool_use blocks in a single response, and the following user message must include a matching tool_result for every tool_use id. Answering only one leaves unmatched tool calls, which the API rejects. There is no one-call-per-request replay protocol — all results return together in the next user message — and assistant text blocks stay in history untouched.

*Hint if stuck: Count how many tool calls the model made versus how many answers you sent back.*
</details>

---

## Question 11
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

## Question 12
An insurance company extracts fields from 80,000 scanned claim forms through the Message Batches API. The extraction tool schema marks policy_end_date as a required string; on forms where the date is illegible, Claude returns plausible fabricated dates. Adding NEVER GUESS — write UNKNOWN to the prompt cut fabrication only slightly. What fixes the root cause?

A) Escalate the prompt warning and add three few-shot examples demonstrating refusal to guess illegible dates
B) Change policy_end_date to type ["string","null"] and remove it from required so the model can return null
C) Set temperature to 0 so the model stops inventing values when the source document is uncertain
D) Move the illegible forms over to synchronous API calls, where extraction accuracy is higher

<details>
<summary>Answer & explanation</summary>

**B)** A required string field forces the model to emit some string even when the document lacks the data — that schema constraint is the structural cause of fabrication, and a nullable field gives the model a legitimate way to return null. Prompt warnings and few-shot examples fight the schema and stay probabilistic, temperature does not change a forced-required constraint, and the Batch API runs the identical model with identical accuracy to synchronous calls.

*Hint if stuck: When a schema demands a value the document may not contain, ask what escape hatch is missing.*
</details>

---

## Question 13
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

## Question 14
A multi-agent research system must profile 8 competitors, and each profile is independent of the others. Today the coordinator spawns one research subagent, waits for its report, then spawns the next, taking 25 minutes end to end. What change makes the subagents run concurrently?

A) Have the coordinator emit all 8 Task tool calls as multiple tool_use blocks in a single response
B) Set CLAUDE_PARALLEL=8 in the environment so the runtime fans out the coordinator's Task calls automatically
C) Submit the 8 profiles as a Message Batches job so they process simultaneously
D) Add 'work on all competitors at the same time' to the coordinator's system prompt

<details>
<summary>Answer & explanation</summary>

**A)** Parallel subagents are spawned by issuing multiple Task tool calls in one assistant response — each tool_use block launches a subagent that runs concurrently. CLAUDE_PARALLEL is not a real setting, and the Batch API trades latency for cost with results within 24 hours, so it cannot speed up a pipeline whose problem is wall-clock time. A prompt instruction is probabilistic best-effort; the actual mechanism is emitting the Task calls together in one turn, and only that guarantees concurrency.

*Hint if stuck: Recall how a single assistant turn can contain more than one tool invocation.*
</details>

---

## Question 15
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

## Question 16
A hospital intake agent maintains a structured case-facts block (allergies: penicillin; weight: 72 kg), exactly as the architecture guide recommends. The block was injected at turn 1, but by turn 30 it sits buried under 50k tokens of accumulated dialogue and tool results, and the agent suggests an amoxicillin prescription. The block's contents are intact and within the context window. What is the fix?

A) Add a system prompt instruction telling the model to always consult the case-facts block before any medication suggestion
B) Run /compact on the dialogue so the case-facts block becomes a larger share of the remaining context
C) Expand the block with severity codes and timestamps so it stands out more in the context
D) Re-inject the case-facts block at the top of every request under clear headers, not just at turn 1

<details>
<summary>Answer & explanation</summary>

**D)** Maintaining a facts block is necessary but not sufficient — placement matters. Once buried mid-context under 50k tokens it suffers the lost-in-the-middle effect, so it must be re-injected at the top of each request with clear headers where attention is strongest. An instruction to 'consult the block' still points at a buried region, and compaction is lossy for everything else in the history.

*Hint if stuck: Having the facts in context is not the same as having them where the model attends.*
</details>

---

## Question 17
A document-processing team built .claude/skills/invoice-extractor/SKILL.md with a 200-line body of extraction rules for vendor invoices. Its frontmatter description reads: Internal helper for documents. Users paste invoices constantly, but the skill never auto-invokes. What should the team change?

A) Rewrite the description to state what it does and when to use it, naming vendor invoices
B) Add a line to the project CLAUDE.md instructing Claude to always use the invoice-extractor skill
C) Move the 200 lines of extraction rules from the body into the description so the model sees them
D) Set context: fork in the frontmatter so the skill executes in its own isolated context

<details>
<summary>Answer & explanation</summary>

**A)** The frontmatter description drives auto-invocation; a vague phrase like Internal helper for documents gives the model nothing to match against invoice tasks. The CLAUDE.md directive is a probabilistic patch on top of the broken description and adds permanent context cost. Stuffing the body into the description destroys progressive disclosure, and context: fork affects execution, not triggering.

*Hint if stuck: Ask which piece of skill metadata the model actually reads when deciding whether to trigger it.*
</details>

---

## Question 18
A support resolution agent escalates hard cases to human specialists. Specialists complain that each escalation arrives as a raw 150-message transcript and they spend twenty minutes reconstructing what happened before they can act. What should each escalation carry instead?

A) A sentiment trajectory chart plus the customer's last five messages
B) A structured summary: customer id, the issue, what was already tried, and a recommended next action
C) The full transcript with a one-line subject added so specialists can skim it faster
D) A live link back into the agent session so the specialist can question the agent directly about the case

<details>
<summary>Answer & explanation</summary>

**B)** Canonical human handoffs carry a structured summary covering the customer id, the issue, what was attempted, and a recommended action, so the specialist can act in minutes without replaying the conversation. The full transcript with a subject line is the strongest distractor, but it preserves the exact problem: the reconstruction burden stays on the human. Sentiment data does not tell the specialist what was tried or what to do next, and a live session link makes the specialist interrogate the agent instead of acting.

*Hint if stuck: Think about what a human needs in order to act in two minutes instead of twenty.*
</details>

---

## Question 19
A developer-productivity team wants three automated behaviors in Claude Code: (1) load the current sprint's ticket list once when a session opens, (2) strip ANSI color codes out of every Bash result before the model reads it, and (3) prevent any edit to files under vendor/. Which hook events implement these behaviors?

A) (1) UserPromptSubmit, (2) PreToolUse, (3) Stop
B) (1) SessionStart, (2) PreToolUse, (3) PostToolUse
C) (1) UserPromptSubmit, (2) PostToolUse, (3) SessionStart
D) (1) SessionStart, (2) PostToolUse, (3) PreToolUse

<details>
<summary>Answer & explanation</summary>

**D)** SessionStart runs once when the session opens, which is the right place for one-time context like the sprint ticket list. PostToolUse fires after a tool runs and is where outputs get normalized, such as stripping ANSI codes from Bash results. PreToolUse gates calls before they execute, so it is where vendor/ edits get blocked with exit code 2. Pairing (2) with PreToolUse and (3) with PostToolUse reverses the last two events: PreToolUse cannot clean a result that does not exist yet, and PostToolUse fires only after the edit has already happened.

*Hint if stuck: Match each behavior to when it must run: session open, after a tool returns, or before a tool executes.*
</details>

---

## Question 20
An automated reviewer labels the same unchecked null dereference 'critical' on one PR and 'minor' on another, and teams can't trust its severity labels for routing. What is the most effective fix?

A) Run the review three times and use the most common severity
B) Add 'be consistent with severity ratings' to the prompt
C) Define explicit criteria for each severity level, each with a concrete code example
D) Drop severity labels entirely and post every finding at the same level so ratings can never disagree

<details>
<summary>Answer & explanation</summary>

**C)** Consistent classification comes from explicit level definitions illustrated by concrete examples. Majority voting averages an undefined standard, 'be consistent' gives the model nothing to be consistent with, and removing severity loses the routing signal the team needs.

*Hint if stuck: Consistent with what?*
</details>

---

## Question 21
A refund-processing subagent in a support system shares a tool registry that includes adjust_loyalty_points and send_marketing_email. Despite a system prompt line saying "NEVER use marketing tools," the subagent sends a promotional email in about 2% of sessions. What is the right fix?

A) Repeat the prohibition at the top and bottom of the system prompt with stronger wording
B) Remove the marketing tools from the refund subagent's tool list entirely
C) Add a PreToolUse hook that blocks send_marketing_email and returns an error to the model
D) Lower the sampling temperature so the model follows the written prohibition more consistently

<details>
<summary>Answer & explanation</summary>

**B)** The governing rule is to remove cross-role tools rather than prompt against their use: a tool with no legitimate purpose for this role should not be visible at all. Removal eliminates the failure class deterministically and shrinks the selection space. The hook is the strongest distractor, but hooks guard tools that must remain available for legitimate uses; here the tool has no legitimate use, so a hook would just bounce calls the agent should never be able to attempt while still cluttering selection.

*Hint if stuck: If a tool has no legitimate use for this role, ask whether it should be in the agent's view at all.*
</details>

---

## Question 22
An engineer resumes a Claude Code session from Friday to continue a refactor. Over the weekend a teammate merged 14 commits to main that renamed AuthClient to IdentityClient and moved the src/auth/ directory. The resumed agent immediately proposes edits referencing the old class name and paths. What is the most reliable way to handle this resume staleness?

A) Add a CLAUDE.md note saying that after resuming, the agent should assume any file may have changed and re-verify before editing
B) Have the team always start fresh sessions instead of resuming, so stale context about renamed or moved files can never exist in the first place
C) On resume, inject a summary of the specific changes since the last session, like renames and moved paths, so the agent corrects its assumptions
D) Run /compact immediately after resuming so the stale history shrinks to a short summary

<details>
<summary>Answer & explanation</summary>

**C)** Stale resumed context is fixed by informing the agent of the specific changes, for example a SessionStart hook on resume that diffs against the last session's commit and injects what was renamed and moved. Always starting fresh is the strongest distractor, but it throws away the valuable in-progress refactor context that made resuming worthwhile. The CLAUDE.md note is probabilistic and forces wasteful wholesale re-reading, and /compact summarizes the stale facts without correcting any of them, so the wrong names survive in condensed form.

*Hint if stuck: Stale resumed context is fixed by telling the agent exactly what changed, not by general caution.*
</details>

---

## Question 23
A logistics intake system classifies shipping documents with an enum field of six values: bill_of_lading, packing_list, customs_declaration, invoice, delivery_receipt, insurance_certificate. A carrier starts sending a new dangerous-goods declaration form, and the model silently labels every one as customs_declaration. How should the schema evolve?

A) Replace the enum with a free-text document_type string so the model can name any document it encounters
B) Add dangerous_goods_declaration to the enum and plan to extend the list whenever a new form type appears
C) Keep the enum but instruct the model to pick a category only when it is confident the document truly matches it
D) Add an other value to the enum alongside a free-text detail field that captures what the document appears to be

<details>
<summary>Answer & explanation</summary>

**D)** A closed enum forces the model to misfile anything outside the list; an other value plus a free-text detail field lets unknown documents surface visibly instead of silently corrupting a known category. Adding one new enum value fixes today's form but leaves the same silent-misfiling failure waiting for the next one, free text sacrifices the structure downstream systems rely on, and a confidence instruction still gives the model no valid label to choose.

*Hint if stuck: Design the schema so inputs outside the known categories become visible instead of being force-fit.*
</details>

---

## Question 24
A research coordinator running on Opus is prompted to fan out work, and its response contains one text block plus three Task tool_use blocks targeting different subagents. The team's harness executes only the first Task call, discards the other two, and sends back a single tool_result; the coordinator then re-issues the missing tasks one at a time, tripling wall-clock time. What is the correct fix?

A) Prompt the coordinator to emit exactly one Task call per turn, since mixing text with multiple tool calls in one response indicates a malformed turn
B) Execute every tool_use block in the response — running the Tasks in parallel — and return one tool_result per tool_use_id in the next user message
C) Set tool_choice to {"type":"tool","name":"Task"} permanently so each response is constrained to a single, well-formed Task invocation
D) Have subagents poll a shared queue that the coordinator writes task specifications into, decoupling spawning from the tool_use protocol entirely

<details>
<summary>Answer & explanation</summary>

**B)** Parallel subagent fan-out is expressed as multiple Task tool_use blocks in a single response, and responses legitimately mix text with tool_use blocks; the harness must execute all of them and return a tool_result for each tool_use_id. Forcing one call per turn — by prompt or by permanently forcing tool_choice — serializes the very fan-out the coordinator was correctly attempting. The shared-queue design abandons the protocol and reintroduces implicit state instead of fixing the harness bug.

*Hint if stuck: A single assistant response can legitimately request several tool executions at once.*
</details>

---

## Question 25
A market-research synthesizer holds three findings on subscriber churn for the same vendor: Source A (2024 annual report) says 12%, Source B (March 2026 analyst note) says 8%, and Source C (April 2026 industry survey) says 15%. The current pipeline averages them and reports "11.7% churn". How should synthesis present this instead?

A) Flag all three findings as a three-way contradiction and exclude churn from the report entirely until a fourth source can break the tie
B) Report 8% as the definitive figure because Source B is the most recent analyst-grade source, moving the other two figures into footnotes
C) Treat A as an earlier dated measurement, and present B and C as a genuine current conflict, both with attribution, dates, and method notes
D) Drop A as stale, then average B and C to report approximately 11.5% current churn alongside a caveat about the recency of the underlying data

<details>
<summary>Answer & explanation</summary>

**C)** Temporal metadata separates the two cases: a 2024 figure differing from 2026 figures is history, not conflict, while two contemporaneous 2026 sources disagreeing is a genuine conflict that must be preserved with attribution so readers see the disagreement. Averaging B and C still fabricates a number no source reported, and crowning the most recent source silently adjudicates a real methodological dispute.

*Hint if stuck: Sort the disagreements by time first — only same-period disagreements are true conflicts, and those must stay visible.*
</details>

---

## Question 26
A healthcare intake assistant opens with a patient who reports three concerns: a billing question, a prescription refill, and a referral request. By turn 15 the assistant has resolved the billing question and closes the conversation, never addressing concerns #2 and #3. What design change fixes this reliably?

A) Track the concerns in a structured issue list with per-item status, updated as each one closes
B) Add a system prompt line: 'Always address every concern the patient raises before ending the conversation'
C) Have the assistant ask the patient whether anything was missed before it closes the conversation
D) Shorten the flow so all three concerns are handled within the first ten turns of the conversation

<details>
<summary>Answer & explanation</summary>

**A)** Multi-issue conversations need an explicit issue list with status tracking that persists across turns, so open items are checked before the conversation closes. A prompt admonition is probabilistic and degrades exactly when the context grows long, and asking the patient to re-list their concerns shifts the burden onto the user while leaving the drift unfixed.

*Hint if stuck: Durable structured state beats a polite reminder when items must survive fifteen turns.*
</details>

---

## Question 27
Six hours into a session on a healthcare data-extraction project, an engineer creates a new skill at .claude/skills/redact-phi/SKILL.md. When she asks Claude to use it in the same session, Claude responds that no such skill exists. She does not want to lose the session's accumulated context. What should she do?

A) Exit and restart Claude Code, because skills are only discovered when a session starts
B) Run /reload-skills so the current session rescans the skills directory
C) Run /compact so the refreshed context window picks up the new skill
D) Tell Claude the file path in chat so it reads SKILL.md and follows it manually

<details>
<summary>Answer & explanation</summary>

**B)** /reload-skills rescans the skills tree mid-session, registering the new skill without discarding context. Restarting would work but throws away six hours of session state for no reason. /compact summarizes history and has nothing to do with skill discovery, and a manual Read bypasses the skill machinery entirely — no auto-invocation and no allowed-tools enforcement.

*Hint if stuck: There is a session command built specifically for picking up skill changes without starting over.*
</details>

---

## Question 28
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

## Question 29
To save money, a team moved its required pre-merge license-compliance check onto the Batch API. Most batches come back within 20 minutes, but some PRs sit blocked for six hours, and one Friday a batch took nearly a full day and froze all merges. What is the correct architecture?

A) Split each submission into smaller batches so individual batches complete faster
B) Run the blocking check synchronously via claude -p and reserve the Batch API for non-blocking audits
C) Poll batch status every 30 seconds instead of every 10 minutes to retrieve results sooner
D) Submit each PR's check as its own single-item batch so it never queues behind other, larger batch jobs

<details>
<summary>Answer & explanation</summary>

**B)** The Batch API promises results within 24 hours and offers no latency SLA, so anything that gates merges must run synchronously. Polling cadence and batch sizing only change when you notice completion, not when it happens — the 24-hour window applies regardless of how small the batch is, including a single-item batch.

*Hint if stuck: One API trades a latency promise for a discount — match it only to work where nobody is blocked.*
</details>

---

## Question 30
A fintech extraction pipeline's fetch_transactions tool returns dates in a mix of MM/DD/YYYY, ISO 8601, and Unix epoch depending on the upstream bank. The model must compare transaction dates against statement periods and gets it wrong on roughly 1 in 12 records, almost always the epoch-formatted ones. What is the root-cause fix?

A) A PostToolUse hook on fetch_transactions that converts every date to ISO 8601 before the model sees the result
B) A system prompt section with worked examples showing how to convert epoch timestamps to ISO 8601 correctly before comparing dates
C) A retry policy that re-fetches the transactions whenever a date comparison fails validation
D) A stricter output schema requiring the model to return all dates as ISO 8601 strings

<details>
<summary>Answer & explanation</summary>

**A)** Date normalization is a mechanical transformation, so it belongs in deterministic PostToolUse code that guarantees the model only ever sees one consistent format. The stricter output schema is the strongest distractor: it constrains the answer's format but does nothing to stop the model misreading epoch values on the way in, since schemas guarantee syntax, not semantic correctness. Prompted conversion examples remain probabilistic, and retries re-fetch the same mixed formats and reproduce the same misreads.

*Hint if stuck: Mechanical transformations of tool output belong in deterministic code, not model instructions.*
</details>

---

## Question 31
A platform team's GitHub Actions job uses claude -p to generate a database migration script, then resumes the same session with a second claude -p --resume call asking: review the migration you just wrote for bugs. The review step almost always replies that the code is correct, yet defects keep reaching production. What should the team change?

A) Run the review in a separate headless session that receives only the diff and schema context
B) Strengthen the review prompt to say: be extremely critical and assume at least three bugs exist
C) Keep one session but switch the review turn to a larger model with extended thinking enabled
D) Add a loop that forces at least three review passes in the session before the job is allowed to exit

<details>
<summary>Answer & explanation</summary>

**A)** Same-session self-review keeps the generation reasoning in context, so the model tends to confirm its own earlier decisions; generator and reviewer must be separate sessions. Adversarial prompting and bigger models are probabilistic patches layered on contaminated context, and repeating passes in the same session just repeats the same bias on every pass.

*Hint if stuck: Ask what context the reviewer is carrying when it judges the code.*
</details>

---

## Question 32
An e-commerce agent's apply_store_credit tool is gated by a PreToolUse hook that exits 2 for credits over $50. The block works, but logs show the agent then retries the identical $75 credit four times before giving up, and the customer gets no resolution. The hook's stderr message is just the word 'Blocked.' What should change?

A) Convert it to a PostToolUse hook so the agent can observe the outcome of each attempted credit and then adjust its next step accordingly
B) Rewrite the stderr message to state the rule and the next step: the $50 cap, and that larger credits go through escalate_to_human
C) Add a hard cap of two retries on apply_store_credit in the agent loop configuration
D) Remove apply_store_credit from the agent's tools and route all credit requests to humans

<details>
<summary>Answer & explanation</summary>

**B)** When a PreToolUse hook blocks with exit code 2, its stderr is fed back to the model and is the model's only explanation of why the call was refused; a bare 'Blocked.' is the hook equivalent of a bare 'Operation failed' tool error, leaving nothing to adapt to. Stating the cap and the escalation path lets the agent immediately take the correct action. Retry caps are safety fallbacks that stop the loop without producing a resolution, converting to PostToolUse would let the over-cap credit execute, and removing the tool punishes every legitimate under-cap credit.

*Hint if stuck: What the hook writes to stderr is the model's only explanation of why the call was refused.*
</details>

---

## Question 33
A developer-productivity assistant gets its persona, coding standards, and 'never push directly to main' rules injected at the top of every user message, with each request's diff and ticket details following below. In long sessions adherence to the rules degrades, and prompt caching saves almost nothing. How should the prompt be restructured?

A) Keep the rules in the user messages but also repeat them verbatim in a final reminder line at the end of each request
B) Move the per-request diff and ticket details into the system prompt so all content shares one stable location
C) Put the stable persona, standards, and rules in the system prompt and keep only the per-request diff and ticket details in user messages
D) Compress the rules into a one-line summary so repeating them inside every user message costs fewer tokens

<details>
<summary>Answer & explanation</summary>

**C)** The system prompt is the home for stable identity, behavioral rules, and constraints, while user messages carry per-turn data, and that separation also creates the stable prefix prompt caching needs. Repeating rules in every user message duplicates tokens and mixes instructions with data, moving volatile per-request content into the system prompt would destroy the stable prefix entirely, and compressing the rules weakens them without fixing their placement.

*Hint if stuck: Stable instructions and volatile data each have a proper home in the request structure.*
</details>

---

## Question 34
A security-review coordinator audits a payments service by spawning three subagents: SQL injection in /api/orders, XSS in /web/templates, and hardcoded secrets in /config. Two weeks after release, an SSRF vulnerability is exploited in /api/webhooks — a directory no subagent was ever assigned. What was the architectural failure?

A) The decomposition left coverage gaps; the coordinator should partition the full scope so every directory and vulnerability class has an owner
B) The subagents ran on Haiku, which is too weak to detect SSRF; the scouts should run on Opus
C) The SSRF-focused subagent failed silently; add retry logic so transient subagent failures are re-run
D) Each subagent prompt should have ended with 'also flag anything else suspicious you happen to notice'

<details>
<summary>Answer & explanation</summary>

**A)** Overly narrow decomposition is a known multi-agent pitfall: anything outside the assigned slices is simply never examined. The fix is to partition the entire scope — directories and vulnerability classes — so the union of subagent assignments covers everything. No SSRF agent existed to retry, and a vague 'anything else' suffix is a probabilistic patch that never guarantees /api/webhooks gets read.

*Hint if stuck: Ask whether the union of the assigned slices actually equals the whole scope.*
</details>

---

## Question 35
A structured-extraction team submits a Message Batches job covering 8,000 archived support tickets, each request tagged with a custom_id. Results show 7,760 successes, 180 failures for exceeding the maximum request size, and 60 failures from intermittent server errors. What is the most efficient recovery?

A) Resubmit the full 8,000-request batch from scratch, since the 50% batch discount makes a complete rerun affordable
B) Resubmit all 240 failed requests unchanged as a new batch and repeat the resubmission until every request succeeds
C) Use the custom_ids to isolate failures, chunk the 180 oversized tickets, and resubmit them plus the 60 transient ones
D) Convert all 240 failed requests into synchronous API calls so an engineer can step through and debug each one interactively

<details>
<summary>Answer & explanation</summary>

**C)** custom_id exists precisely so failures can be isolated and resubmitted without redoing completed work, and the two failure classes need different treatment: oversized requests fail deterministically and must be fixed before resubmission, while transient server errors can be retried as-is. Resubmitting all 240 unchanged guarantees the 180 oversized requests fail again, rerunning all 8,000 pays twice for finished work, and hand-debugging 240 requests synchronously forfeits the discount and the automation.

*Hint if stuck: Separate the failures that will recur deterministically from the ones that were just bad luck.*
</details>

---

## Question 36
In a research system, scouts already return structured findings with claim text, source id, and retrieval date. Yet the final report — written by a synthesizer prompted to produce "a polished executive narrative, citing sources" — regularly contains untraceable claims: about 30% of spot-checked statements match no source id in any scout's output. What is the root-cause fix?

A) Strengthen the synthesizer prompt so that every sentence must include a bracketed source id and nothing may be stated without a matching citation
B) Make synthesis emit each claim as a structured record carrying its source ids, validated against the scouts' finding set before the narrative renders
C) Lower the synthesizer's temperature to 0 so the narrative stays closer to the scouts' original wording and introduces fewer unsourced claims
D) Add a final Haiku pass over the narrative that deletes any sentence lacking a bracketed citation before the finished report ships to readers

<details>
<summary>Answer & explanation</summary>

**B)** Provenance dies at the one stage that converts structured data into free prose, so the fix is making synthesis itself produce structured claim records whose source ids can be programmatically validated against the scouts' findings before rendering. A stricter prompt is still probabilistic — the model can bracket fabricated ids — temperature does not prevent fabrication, and a deletion pass removes uncited sentences without catching plausible-but-wrong citations.

*Hint if stuck: Find the stage where structured data turns into free prose — that is where provenance is lost.*
</details>

---

## Question 37
An insurance claims agent looks up 'Maria Garcia' and the policy-holder tool returns two records with different policy numbers and addresses. The agent silently picks the record with the more recent activity date and quotes a claim status — for the wrong Maria Garcia. What should the agent do instead?

A) Always select the record whose creation date is older, since it is more likely the original account
B) Merge the two records' fields and present a combined view so the agent never has to choose
C) Refuse to proceed and escalate any lookup that returns more than one matching record to a human agent for manual resolution
D) Ask the customer for an additional identifier — policy number, date of birth, or address — and re-query to disambiguate

<details>
<summary>Answer & explanation</summary>

**D)** Duplicate matches must be disambiguated with additional identifiers before any account-specific action; silently picking by any heuristic guarantees wrong-customer errors. Merging records leaks one customer's data into another's view, and escalating every multi-match is unnecessary overhead when the agent can resolve the ambiguity with one question.

*Hint if stuck: When a key is ambiguous, the fix is to add another key, not pick a favorite.*
</details>

---

## Question 38
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

## Question 39
An e-commerce team built a custom agent loop that calls the Claude API to triage failing checkout tests in their deploy pipeline. The script scans the assistant's text for the word COMPLETE to decide when to exit. Sometimes the loop terminates while Claude is mid-investigation; other times it hangs after Claude has clearly finished. What is the correct loop control?

A) Tighten the prompt so Claude always prints COMPLETE alone on the final line of its last message
B) Branch on stop_reason: execute tools on tool_use, finish on end_turn, continue generation on max_tokens
C) Cap the loop at ten iterations and treat reaching the cap as the signal that triage is complete
D) Treat any response that contains a text block as the final answer, since tool calls always arrive without accompanying prose

<details>
<summary>Answer & explanation</summary>

**B)** The agentic loop is driven by stop_reason, never by parsing prose: tool_use means execute the tool and resend the full history, end_turn means done, and max_tokens means truncated output needing continuation. Prose markers are unreliable, iteration caps are safety fallbacks rather than primary control, and treating any text block as final fails because a single response can contain text and tool_use blocks together.

*Hint if stuck: The API already tells you, in a dedicated field, why generation stopped.*
</details>

---

## Question 40
A research coordinator's document-analysis subagent could not reach 2 of 9 sources (both paywalled) and returned findings from the other 7. The final report reads as complete, and a reviewer later finds that one whole subtopic relied only on the missing sources. What should change?

A) Have the subagent return structured error context for the failed sources, and have synthesis annotate which topic areas have gaps because of them
B) Stop the whole report whenever any source fails
C) Have the subagent retry the paywalled sources until they succeed
D) Leave the missing sources out silently, since 7 of 9 is good coverage

<details>
<summary>Answer & explanation</summary>

**A)** Errors should travel upward as structured context, and the synthesis should mark which findings are well supported and which areas have gaps. Stopping everything over one failure, retrying a permission failure indefinitely, and silently dropping the failures are all anti-patterns.

*Hint if stuck: The reader needs to know what's missing.*
</details>

---

## Question 41
A developer has been working with Claude Code on a 40-package monorepo for five hours straight. Early in the session the agent cited exact file paths and line numbers; now it says things like "this service typically follows the standard repository pattern" and proposes an edit to a helper function that does not exist. What is the most likely explanation?

A) Anthropic silently routed the session to a smaller model under load, reducing answer quality and recall of specifics midway through the session
B) Hours of accumulated verbose tool output are degrading recall — vague generalities and invented specifics are classic long-session degradation
C) The project CLAUDE.md was evicted from the prompt cache, so the team's coding conventions are no longer visible to the model in later turns
D) The developer's recent prompts have grown too short, leaving the model without enough instruction to stay specific about files and line numbers

<details>
<summary>Answer & explanation</summary>

**B)** Multi-hour sessions accumulate verbose tool output that buries the specifics the model once cited precisely; the telltale symptom is a shift from exact citations to vague generalities and invented details. The remedy is context hygiene (scratchpads, /compact, subagent delegation). Claude Code does not silently swap models mid-session, and prompt-cache eviction affects cost and latency, not what is present in context.

*Hint if stuck: Ask what changes about a session's answer quality as hours of verbose tool output pile up in one context.*
</details>

---

## Question 42
A support agent has three tools — get_order, fetch_order_info, and order_details — whose descriptions all read roughly "Retrieves order information." The agent picks the wrong one about a third of the time: get_order takes an order ID, fetch_order_info takes a customer email, and order_details takes a tracking number. The team proposes building a small classifier that routes each request to the right tool. What should be done instead?

A) Build the routing classifier as proposed, since deterministic routing code will always outperform the model's own probabilistic tool selection
B) Rewrite each description to state its purpose, exact input format, and when to use it versus its siblings — descriptions are the model's primary selection mechanism
C) Set tool_choice to "any" on each request so the model is forced to commit to a tool call instead of hedging between the three candidates
D) Collapse the three tools into a single lookup tool with a mode parameter, relying on few-shot prompt examples to teach the model which mode fits each identifier type

<details>
<summary>Answer & explanation</summary>

**B)** Tool descriptions are the primary selection mechanism; three near-identical descriptions give the model nothing to choose on, so it guesses. Stating purpose, input format, and when-to-use-versus-siblings fixes the root cause, whereas a routing classifier layers permanent extra machinery on top of a broken contract. tool_choice "any" only forces some tool call, and the merge just relocates the same ambiguity into a mode parameter propped up by probabilistic few-shot examples.

*Hint if stuck: Before adding routing machinery, ask what information the model actually uses to choose between tools.*
</details>

---

## Question 43
In a monorepo CI assistant, a run_coverage tool returns raw percentages per package. Reviewers notice the agent keeps flagging packages/legacy-billing for missing the 80% bar even though that package is formally exempt until Q3. The exemption list lives in a YAML file that changes as exemptions are granted and expire, and the agent rarely reads it. How should the team ensure coverage results are interpreted correctly every time?

A) Add a PostToolUse hook on run_coverage that reads the exemption YAML and injects current exemptions via hookSpecificOutput.additionalContext
B) Copy the exemption list into CLAUDE.md so it loads automatically at session start
C) Rename the tool to run_coverage_with_exemptions so the agent knows exemptions exist
D) Add a prompt instruction telling the agent to call a second tool that fetches the current exemption YAML after every single coverage run it performs

<details>
<summary>Answer & explanation</summary>

**A)** hookSpecificOutput.additionalContext lets a PostToolUse hook attach fresh interpretive context at the exact moment the tool result returns, so the model always sees the current exemptions alongside the numbers. CLAUDE.md is the strongest distractor, but it is a static copy that drifts from the changing YAML and can be lost mid-context in long sessions. The prompt-enforced second tool call is probabilistic and is exactly the behavior the agent is already failing to perform, and renaming the tool conveys nothing about which packages are exempt.

*Hint if stuck: Consider which mechanism can attach fresh interpretive context at the exact moment a tool result returns.*
</details>

---

## Question 44
An overnight multi-agent research coordinator fans out 60 subagent tasks over roughly seven hours. A crash at hour five currently forces rerunning everything, wasting about $90 of API spend per incident. The team is debating recovery designs. Which is best?

A) Enable 1-hour prompt caching on the coordinator's stable prefix so a restarted run reuses the cached work and skips already-completed reasoning
B) Append each completed subagent's task id, status, and structured findings to a manifest; a restarted coordinator loads it and dispatches only incomplete tasks
C) Persist the coordinator's full message history to disk every 10 minutes and on restart replay the conversation from the most recent snapshot to continue work
D) Wrap every subagent call in retry-with-backoff so transient failures never surface and coordinator crashes become effectively impossible to hit

<details>
<summary>Answer & explanation</summary>

**B)** A manifest recording completed task ids plus their structured findings is the minimal durable state needed to resume: restart logic deterministically skips finished work and re-dispatches only the rest. Replaying full message history restores bloated context and a fragile transcript rather than clean state, prompt caching is a cost optimization that holds no completion state, and retries handle transient tool errors but cannot make process crashes impossible.

*Hint if stuck: Ask what minimal durable state lets a freshly started coordinator know exactly which work is already done.*
</details>

---

## Question 45
In a multi-agent research system, a subagent's web_search tool hits a provider rate limit after retrieving 3 of 5 requested sources and currently returns {"error": "request failed"}, discarding everything. The coordinator restarts the entire research task from zero each time. How should the tool respond instead?

A) Return the 3 retrieved sources as partial results along with errorCategory rate_limit and isRetryable true
B) Return a normal success response containing the 3 sources and omit any mention of the failure
C) Block inside the tool and sleep until the rate limit window resets, then return all 5 sources
D) Raise an exception so the subagent terminates and the coordinator reassigns the task elsewhere

<details>
<summary>Answer & explanation</summary>

**A)** Structured errors should preserve partial results and signal retryability so the caller can resume from where the work stopped instead of redoing it. The silent-success distractor is tempting because it avoids the restart, but it hides a known coverage gap from the coordinator, which then synthesizes from incomplete sources without knowing it. Blocking until reset hides unbounded latency inside a tool call, and a bare exception throws away the 3 sources entirely.

*Hint if stuck: A good error response keeps what succeeded and tells the caller whether trying again makes sense.*
</details>

---

## Question 46
Two weeks ago an agent session analysed a service's module layout. Since then the team has refactored 60 files and renamed several packages. A developer wants to pick the analysis back up today. Which approach is most reliable?

A) Resume the old session and trust its earlier analysis, since the overall architecture is similar
B) Resume the old session and immediately run /compact to shrink the outdated context
C) Fork the old session so the original analysis is preserved while the fork works on the new code with all the earlier context intact
D) Start a fresh session seeded with a structured summary of the earlier findings, and let it re-read the code that changed

<details>
<summary>Answer & explanation</summary>

**D)** When many earlier tool results are stale, resuming makes the agent reason from file contents that no longer exist. A new session seeded with a concise summary keeps the useful conclusions without the stale details. Compacting or forking still carries the outdated tool results forward.

*Hint if stuck: How much of the old context is still true?*
</details>

---

## Question 47
An e-commerce pipeline asks Claude to return product attributes as JSON in a plain text response. About 2 percent of responses begin with 'Here is the extracted JSON:' or wrap the object in a code fence, crashing the downstream parser. The prompt already says 'respond with only the JSON object, no other text.' What is the root-cause fix?

A) Use strict structured outputs or a tool_use schema so conformance is guaranteed rather than requested through instructions
B) Add a regex preprocessing step that strips any leading prose and code fences before the parser runs
C) Repeat the JSON-only instruction at both the start and the end of the prompt so the model cannot miss it
D) Detect parse failures at runtime and automatically resend the request until a clean JSON response comes back from the model

<details>
<summary>Answer & explanation</summary>

**A)** Prompt instructions are probabilistic and will occasionally be violated at scale; strict structured outputs or tool_use with a schema make conformance a guarantee of the API rather than a request. Regex stripping and retry loops patch the symptom while leaving the unreliable mechanism in place, and repeating the instruction is more of the same best-effort approach.

*Hint if stuck: Ask which option turns 'please format it this way' into a guarantee.*
</details>

---

## Question 48
An e-commerce support agent looks up a customer's orders for the last 30 days. The order-search tool returns an empty array, the agent's wrapper raises a SearchFailedError, and the agent retries the call five times before telling the customer 'our system is down.' The customer simply placed no orders that month. What is the correct design?

A) Have the agent retry with progressively wider date ranges until at least one order is found
B) The tool should return a structured success with results: [] and a zero count; the agent reports no orders in that window
C) Catch the SearchFailedError and have the agent apologize and escalate the conversation to a human agent after the first failed search
D) Add a fallback that queries the data warehouse directly when the order-search tool returns nothing

<details>
<summary>Answer & explanation</summary>

**B)** An empty result set is a valid successful outcome — zero matches — not an error. The wrapper conflating 'no rows' with 'failure' caused phantom retries and a false outage report. Widening the date range fabricates an answer to a question the customer did not ask, and escalating a non-error wastes human time on a working system.

*Hint if stuck: Distinguish 'the search ran and found nothing' from 'the search could not run.'*
</details>

---

## Question 49
A logistics startup's project CLAUDE.md has grown to 520 lines: about 40 lines of universal coding standards, 180 lines of test-writing guidance, 150 lines of API-package specifics, and a 150-line deployment runbook used a few times a month. Engineers report mid-file rules being ignored, and every session carries the full token cost. What is the best restructuring?

A) Reorder the file so the most important rules sit at the top and bottom where model attention is strongest
B) Split the content into ten topic files and @import every one of them from CLAUDE.md so the main file itself stays short and readable
C) Keep the 40 universal lines in CLAUDE.md, move scoped guidance to .claude/rules/ with paths globs, and make the runbook a skill
D) Relocate the entire file to ~/.claude/CLAUDE.md so the content loads from the user level instead of the repository

<details>
<summary>Answer & explanation</summary>

**C)** Only universally applicable standards should be always-on; path-scoped rules load when matching files are touched, and a skill body loads only when invoked thanks to progressive disclosure. The @import split is cosmetic — imported files still load every session, so the token cost and lost-in-the-middle problem remain. Reordering treats the attention symptom but fixes neither cost nor scoping, and moving everything to the user level loses version control while still loading all 520 lines.

*Hint if stuck: Match each block of content to the loading mechanism with the right scope and trigger.*
</details>

---

## Question 50
An extraction pipeline pulls sample_size from research papers. When the paper has a Methods section it works; when the sample size is mentioned inside the results text, the model returns null even though the number is there. What change best fixes this?

A) Add few-shot examples showing correct extraction from both layouts: a dedicated Methods section and figures embedded in results text
B) Make sample_size a required field in the extraction schema so the model must always provide a value, even for papers with unusual layouts
C) Retry each null result with the same prompt up to three times
D) Add a paragraph explaining that sample sizes can appear anywhere

<details>
<summary>Answer & explanation</summary>

**A)** Few-shot examples that show varied document structures are the most effective way to reduce empty extractions caused by layout differences. A required field pushes the model to invent values when the data really is absent, unchanged retries repeat the failure, and prose explanations are weaker than demonstrations.

*Hint if stuck: Show it what the other layout looks like.*
</details>

---

## Question 51
A customer support resolution agent's loop decides it is finished by checking whether the assistant's text contains the phrase TASK COMPLETE. In production the agent sometimes exits while a refund lookup is still pending, because the model wrote 'Task complete for step one — now checking refund status' right before emitting a tool_use block. What is the correct fix?

A) Tighten the system prompt so the model writes TASK COMPLETE only as the final line of its genuinely last message
B) Switch the completion check to look for an empty content array in the API response
C) Terminate the loop only on stop_reason end_turn, and route stop_reason tool_use back into tool execution
D) Add a regex that ignores TASK COMPLETE whenever it appears in the same response as a tool_use block

<details>
<summary>Answer & explanation</summary>

**C)** stop_reason is the API's authoritative, machine-readable signal for whether the model is done; assistant prose is probabilistic and responses routinely mix narration with tool_use blocks. The regex patch still leaves termination dependent on phrasing the model is never guaranteed to produce, and the prompt-tightening fix is best-effort for the same reason, so both paper over the root cause instead of fixing it.

*Hint if stuck: The API already provides a machine-readable signal for whether the model is done — do not infer completion from language.*
</details>

---

## Question 52
In a healthcare records batch, 600 of 12,000 requests failed with request-too-large errors because each embedded a full multi-year patient history. The on-call engineer correctly used custom_ids to isolate exactly those 600, resubmitted them unchanged in a new batch — and all 600 failed again with the identical error. What did the engineer miss?

A) Request-too-large failures are deterministic — the oversized histories must be chunked or trimmed before any resubmission can succeed
B) Resubmitted requests need fresh custom_ids, because the Batch API rejects custom_ids it has already processed once
C) A model with a larger context window should have been selected, which raises the maximum request size the batch will accept per request
D) The 600 requests should have been retried as synchronous calls, which accept larger payloads than batch requests do

<details>
<summary>Answer & explanation</summary>

**A)** Targeted resubmission via custom_id was the right instinct, but only transient failures can be retried as-is; an unchanged oversized request exceeds the same limit on every attempt, so the payload itself must be fixed first. The custom_id reuse rule and the larger-payload mechanics in the other options are invented — none of them changes a request that is over the size limit.

*Hint if stuck: Resubmitting as-is only works when the cause of the failure can change between attempts.*
</details>

---

## Question 53
A legal contract extraction pipeline retries with validation feedback up to six times. Telemetry shows 82% of contracts pass within two attempts, but 13% fail all six — and inspection reveals those contracts genuinely contain no governing-law clause. The feedback 'governing_law is missing, re-extract' just drives the model to fabricate jurisdictions on later attempts. What should the team change?

A) Raise the attempt cap from six to ten so the stubborn 13% of contracts get more chances to converge
B) Sharpen the retry feedback to list the exact contract sections where governing-law clauses conventionally appear
C) Loosen the validator to accept any plausible jurisdiction string so the later attempts pass instead of failing
D) Make governing_law nullable and treat a returned null as a terminal, valid outcome when the clause is absent

<details>
<summary>Answer & explanation</summary>

**D)** Retry feedback only helps when the failure is recoverable; when the source lacks the clause, every extra attempt just increases fabrication pressure, so the schema must let the model report absence as a valid terminal answer. Sharper feedback is the strongest distractor, but no hint can locate a clause that does not exist, more attempts compound the waste, and loosening the validator institutionalizes fabricated jurisdictions in legal data.

*Hint if stuck: Before improving the retries, ask whether success is even possible for the failing 13%.*
</details>

---

## Answer key (no peeking until scored)

1:C 2:C 3:B 4:A 5:D 6:C 7:C 8:C 9:C 10:A 11:A 12:B 13:A 14:A 15:D 16:D 17:A 18:B 19:D 20:C 21:B 22:C 23:D 24:B 25:C 26:A 27:B 28:C 29:B 30:A 31:A 32:B 33:C 34:A 35:C 36:B 37:D 38:B 39:B 40:A 41:B 42:B 43:A 44:B 45:A 46:D 47:A 48:B 49:C 50:A 51:C 52:A 53:D
