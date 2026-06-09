# Practice Test 03: The Hook Forge
**D1: Agentic Architecture & Orchestration** (27% of the exam) — Hooks & deterministic enforcement

15 questions. Exam pace is 2 minutes per question; aim for 30 minutes.
Pass bar in the game: 7/10 on a random draw. Pass bar here: be honest.

---

## Question 1
A fintech support agent has a process_refund tool. The system prompt states refunds above $200 require manager approval, yet logs show the agent issued a $480 refund last week after a persuasive customer message. Compliance now requires that over-cap refunds can never execute. What should the architect implement?

A) A PreToolUse hook on process_refund that checks the amount and exits with code 2 when it exceeds $200, writing the violation to stderr
B) A refund policy moved to the very top of the system prompt and repeated in CLAUDE.md so the model cannot miss it
C) A second model pass that reviews every pending refund and approves or rejects it before execution
D) A temperature of 0 on the support agent so it follows the refund policy more consistently

<details>
<summary>Answer & explanation</summary>

**A)** Critical business rules like refund caps belong in hooks because hooks are deterministic code that guarantees enforcement, while prompt instructions are probabilistic best-effort. Exit code 2 blocks the tool call and the stderr message is fed back to the model so it can adapt. The second-model reviewer is the strongest distractor, but it is still a probabilistic component and cannot guarantee zero violations, and temperature 0 changes sampling, not whether the model can be persuaded.

*Hint if stuck: Think about which mechanism is deterministic rather than probabilistic when a business rule must never be violated.*
</details>

---

## Question 2
A platform team wrote a PreToolUse hook to stop Claude Code from editing files under infra/prod/. The script correctly detects the protected path, prints 'Edit blocked: protected production path' to stdout, and exits with code 0. In testing, the edits still go through and the agent never acknowledges any block. What is wrong?

A) PreToolUse hooks cannot block tool calls; the rule must instead be a deny entry in settings.json permissions
B) The hook needs to return hookSpecificOutput.additionalContext containing the block decision
C) The hook must exit with code 2 to block the call, and write the explanation to stderr so it is fed back to the model
D) The hook fires too early to see the file path; the protection must move to a PostToolUse hook

<details>
<summary>Answer & explanation</summary>

**C)** For PreToolUse hooks, a zero exit code allows the tool call to proceed; exit code 2 is what blocks the call, and stderr (not stdout) is the channel fed back to the model explaining why. The first option is false because gating tool calls before they run is exactly what PreToolUse exists for. additionalContext injects information but does not block anything, and PreToolUse receives the full tool input including the file path, so it does not fire too early.

*Hint if stuck: Recall which exit code blocks a tool call and which output stream gets fed back to the model.*
</details>

---

## Question 3
A customer support agent calls a get_customer CRM tool that returns 40 fields per record, including marketing flags and audit metadata. After 15 lookups in a long session, context is bloated and the agent starts missing the three fields it actually uses: plan tier, billing status, and open tickets. What is the best fix?

A) Instruct the agent in the system prompt to ignore the irrelevant CRM fields when reading tool results
B) Add a PostToolUse hook on get_customer that trims each result down to the handful of fields the agent needs
C) Switch to a model with a larger context window so the full 40-field records fit comfortably
D) Run /compact after every few lookups to summarize the accumulated CRM payloads

<details>
<summary>Answer & explanation</summary>

**B)** Verbose tool outputs should be trimmed deterministically at the source, and PostToolUse is the hook designed to normalize and reduce tool results before they enter context. A larger context window still leaves 37 useless fields per record diluting attention, so lost-in-the-middle misses persist. Prompting the model to ignore fields is probabilistic and the tokens still consume context either way, and /compact is reactive and lossy: it lets the bloat accumulate first and its summarization can blur the exact field values the agent needs.

*Hint if stuck: Verbose tool outputs are best handled deterministically at the moment they are produced, not by the model afterward.*
</details>

---

## Question 4
A healthcare intake agent writes visit summaries to a shared log through a write_log tool. CLAUDE.md instructs it to redact Social Security numbers first, and audits show it complies about 98% of the time. The compliance team requires zero SSNs in the logs, full stop. Which approach satisfies the requirement?

A) Add few-shot examples of correctly redacted summaries to the system prompt
B) Repeat the redaction rule in both the system prompt and CLAUDE.md and label it as mandatory
C) Have a reviewer subagent check each summary for SSNs before it is logged
D) Add a hook that scans write_log input and deterministically redacts or blocks any SSN pattern before the write runs

<details>
<summary>Answer & explanation</summary>

**D)** A 98% compliance rate is the signature of a probabilistic mechanism, and no amount of prompt reinforcement turns best-effort into a guarantee. PII redaction is a critical business rule, so it belongs in deterministic hook code that pattern-matches and rewrites or blocks the call every single time. The reviewer subagent is the strongest distractor, but it is another model and therefore still probabilistic; it can miss an SSN just as the original agent does.

*Hint if stuck: A 98% compliance rate is the fingerprint of a probabilistic mechanism.*
</details>

---

## Question 5
In a monorepo CI assistant, a run_coverage tool returns raw percentages per package. Reviewers notice the agent keeps flagging packages/legacy-billing for missing the 80% bar even though that package is formally exempt until Q3. The exemption list lives in a YAML file that changes as exemptions are granted and expire, and the agent rarely reads it. How should the team ensure coverage results are interpreted correctly every time?

A) Add a PostToolUse hook on run_coverage that reads the exemption YAML and injects current exemptions via hookSpecificOutput.additionalContext
B) Copy the exemption list into CLAUDE.md so it loads automatically at session start
C) Rename the tool to run_coverage_with_exemptions so the agent knows exemptions exist
D) Add a prompt instruction telling the agent to call a second tool to fetch exemptions after every coverage run

<details>
<summary>Answer & explanation</summary>

**A)** hookSpecificOutput.additionalContext lets a PostToolUse hook attach fresh interpretive context at the exact moment the tool result returns, so the model always sees the current exemptions alongside the numbers. CLAUDE.md is the strongest distractor, but it is a static copy that drifts from the changing YAML and can be lost mid-context in long sessions. The prompt-enforced second tool call is probabilistic and is exactly the behavior the agent is already failing to perform, and renaming the tool conveys nothing about which packages are exempt.

*Hint if stuck: Consider which mechanism can attach fresh interpretive context at the exact moment a tool result returns.*
</details>

---

## Question 6
A developer-productivity team distributes Claude Code skills from a central repo. A bootstrap script syncs new skill folders into .claude/skills when a session opens, but engineers report that skills added that morning never auto-invoke until they manually intervene, because the skill scan happens before the sync finishes. The team wants newly synced skills available automatically in every fresh session. What should they configure?

A) A UserPromptSubmit hook that runs the sync script before each prompt is processed
B) A note in CLAUDE.md telling engineers to run /reload-skills as their first command in every session
C) A SessionStart hook that runs the sync and returns reloadSkills so the skill scan picks up the new files
D) A PostToolUse hook on Bash that triggers whenever the sync script appears in a command

<details>
<summary>Answer & explanation</summary>

**C)** SessionStart hooks run when the session opens and can return reloadSkills, which makes the harness rescan the skills directory after the sync completes, solving the ordering problem deterministically. Asking engineers to run /reload-skills works mechanically but depends on every human remembering every time, which is best-effort. Re-syncing on every UserPromptSubmit is wasteful and does not itself trigger a skill rescan, so freshly synced skills still would not auto-invoke.

*Hint if stuck: One hook event runs at session open and can ask the harness to rescan skills.*
</details>

---

## Question 7
An e-commerce operations agent answers on-call engineers' questions in long-running sessions; engineers execute any deploys themselves. Answers must always reflect the current deploy-freeze status and on-call rotation, both of which change mid-session. Today the agent advised an engineer to deploy during a freeze that began an hour after the session started. Which hook placement fixes this?

A) A SessionStart hook that injects freeze status and the rotation when the session begins
B) A Stop hook that appends the latest freeze status to the agent's final answer each turn
C) A PreToolUse hook that inserts the current rotation into the parameters of every tool call
D) A UserPromptSubmit hook that fetches current freeze status and rotation and attaches them to each incoming prompt

<details>
<summary>Answer & explanation</summary>

**D)** The failure happened because the facts changed mid-session, so any mechanism that injects them only once at session start is guaranteed to go stale, which is exactly the trap in the SessionStart option. UserPromptSubmit fires on every user message, so the model reasons over current freeze and rotation data each time it answers. The Stop hook decorates output after reasoning is done, too late to change the advice, and the PreToolUse option only touches tool parameters, which never informs the model's answer to a question.

*Hint if stuck: Ask which hook fires often enough to keep fast-changing facts current throughout a session.*
</details>

---

## Question 8
A code-generation session in Claude Code keeps ending turns with edits in place but the test suite never run, despite a CLAUDE.md rule saying 'always run the tests before finishing.' The team wants a guarantee that no turn completes after file edits without a test run. What is the right mechanism?

A) Move the rule to the top of CLAUDE.md and rephrase it as a hard, non-negotiable requirement
B) Add a Stop hook that checks whether tests ran after the last edit and blocks completion with feedback telling the model to run them
C) Add a PostToolUse hook on Edit that runs the full test suite after every single file modification
D) Set a minimum iteration count so the session cannot end before a fixed number of tool calls

<details>
<summary>Answer & explanation</summary>

**B)** Stop hooks fire when the agent attempts to finish its turn and can deterministically block completion, feeding the reason back so the model runs the tests. The PostToolUse distractor is deterministic but enforces at the wrong granularity: it runs the whole suite after every one of possibly dozens of edits, burning time and failing spuriously on intentionally incomplete intermediate states mid-refactor, when the requirement only concerns the state at turn completion. Stronger prompt wording remains probabilistic, and iteration counts are safety fallbacks, not behavioral guarantees.

*Hint if stuck: There is a hook event that fires at the moment the agent tries to finish its turn.*
</details>

---

## Question 9
In a monorepo, the data team must prevent Claude Code from editing files under db/migrations/ that have already been applied to production. Applied migrations are listed in db/applied.json, which changes daily, and new unapplied migration files must remain fully editable. How should this be enforced?

A) A PreToolUse hook on Edit and Write that checks the target file against db/applied.json and exits 2 with an explanation when the migration is already applied
B) A settings.json permissions deny rule covering the entire db/migrations/ directory
C) A CLAUDE.md rule listing the currently applied migrations, regenerated by a nightly job
D) A PostToolUse hook that detects edits to applied migrations and reverts them with git checkout

<details>
<summary>Answer & explanation</summary>

**A)** The rule is conditional on data that changes daily, so it needs executable logic: a PreToolUse hook can read applied.json at call time, block only the applied files, and explain why via stderr. The static deny rule is the strongest distractor because it is also deterministic, but it is too blunt and blocks the legitimate new migrations the team must keep editable. The PostToolUse revert lets the forbidden write happen first and silently undoes it while the model still believes the edit succeeded, and CLAUDE.md is probabilistic and up to a day stale.

*Hint if stuck: A rule that depends on data that changes daily needs logic at call time, not a static pattern.*
</details>

---

## Question 10
An engineer resumes a Claude Code session from Friday to continue a refactor. Over the weekend a teammate merged 14 commits to main that renamed AuthClient to IdentityClient and moved the src/auth/ directory. The resumed agent immediately proposes edits referencing the old class name and paths. What is the most reliable way to handle this resume staleness?

A) Add a CLAUDE.md note saying that after resuming, the agent should assume any file may have changed and re-verify before editing
B) Have the team always start fresh sessions instead of resuming so stale context can never exist
C) On resume, inject a summary of the specific changes since the last session, such as the renames and moved paths, so the agent corrects its assumptions
D) Run /compact immediately after resuming so the stale history shrinks to a short summary

<details>
<summary>Answer & explanation</summary>

**C)** Stale resumed context is fixed by informing the agent of the specific changes, for example a SessionStart hook on resume that diffs against the last session's commit and injects what was renamed and moved. Always starting fresh is the strongest distractor, but it throws away the valuable in-progress refactor context that made resuming worthwhile. The CLAUDE.md note is probabilistic and forces wasteful wholesale re-reading, and /compact summarizes the stale facts without correcting any of them, so the wrong names survive in condensed form.

*Hint if stuck: Stale resumed context is fixed by telling the agent exactly what changed, not by general caution.*
</details>

---

## Question 11
A support resolution agent escalates hard cases to human specialists. Specialists complain that each escalation arrives as a raw 150-message transcript and they spend twenty minutes reconstructing what happened before they can act. What should each escalation carry instead?

A) A sentiment trajectory chart plus the customer's last five messages
B) A structured summary: customer id, the issue, what was already tried, and a recommended next action
C) The full transcript with a one-line subject added so specialists can skim it faster
D) A live link back into the agent session so the specialist can question the agent directly

<details>
<summary>Answer & explanation</summary>

**B)** Canonical human handoffs carry a structured summary covering the customer id, the issue, what was attempted, and a recommended action, so the specialist can act in minutes without replaying the conversation. The full transcript with a subject line is the strongest distractor, but it preserves the exact problem: the reconstruction burden stays on the human. Sentiment data does not tell the specialist what was tried or what to do next, and a live session link makes the specialist interrogate the agent instead of acting.

*Hint if stuck: Think about what a human needs in order to act in two minutes instead of twenty.*
</details>

---

## Question 12
A fintech extraction pipeline's fetch_transactions tool returns dates in a mix of MM/DD/YYYY, ISO 8601, and Unix epoch depending on the upstream bank. The model must compare transaction dates against statement periods and gets it wrong on roughly 1 in 12 records, almost always the epoch-formatted ones. What is the root-cause fix?

A) A PostToolUse hook on fetch_transactions that converts every date to ISO 8601 before the model sees the result
B) A system prompt section with worked examples showing how to convert epoch timestamps correctly
C) A retry policy that re-fetches the transactions whenever a date comparison fails validation
D) A stricter output schema requiring the model to return all dates as ISO 8601 strings

<details>
<summary>Answer & explanation</summary>

**A)** Date normalization is a mechanical transformation, so it belongs in deterministic PostToolUse code that guarantees the model only ever sees one consistent format. The stricter output schema is the strongest distractor: it constrains the answer's format but does nothing to stop the model misreading epoch values on the way in, since schemas guarantee syntax, not semantic correctness. Prompted conversion examples remain probabilistic, and retries re-fetch the same mixed formats and reproduce the same misreads.

*Hint if stuck: Mechanical transformations of tool output belong in deterministic code, not model instructions.*
</details>

---

## Question 13
An insurance support agent receives one message: 'I was double-billed in May, my new address is 14 Elm Street, and your last rep was rude - I want that on record.' The agent resolves the billing issue thoroughly and closes the conversation; the address change and the complaint are silently dropped. How should the architect fix this failure pattern?

A) Increase max_tokens so the agent has enough room to address everything in a single reply
B) Add a prompt instruction saying the agent must be thorough and never ignore parts of a message
C) Route each incoming message to three specialized subagents selected by keyword matching
D) Have the agent first decompose the message into distinct concerns and track each one to completion before ending the turn

<details>
<summary>Answer & explanation</summary>

**D)** Multi-concern requests fail when the agent treats the message as one task, so the fix is explicit decomposition: enumerate the distinct concerns up front and verify each is resolved before finishing. Keyword-routed subagents are the strongest distractor, but the concern count varies per message and keyword matching creates coverage gaps on unexpected phrasing. A vague instruction to be thorough is probabilistic, and the dropped concerns were never a token-budget problem, since the agent finished its reply normally rather than hitting max_tokens.

*Hint if stuck: When one message carries several requests, the fix is explicit enumeration and tracking of each one.*
</details>

---

## Question 14
An e-commerce agent's apply_store_credit tool is gated by a PreToolUse hook that exits 2 for credits over $50. The block works, but logs show the agent then retries the identical $75 credit four times before giving up, and the customer gets no resolution. The hook's stderr message is just the word 'Blocked.' What should change?

A) Convert it to a PostToolUse hook so the agent can observe the outcome of the attempted credit
B) Rewrite the stderr message to state the rule and the next step: the $50 cap, and that larger credits go through the escalate_to_human tool
C) Add a hard cap of two retries on apply_store_credit in the agent loop configuration
D) Remove apply_store_credit from the agent's tools and route all credit requests to humans

<details>
<summary>Answer & explanation</summary>

**B)** When a PreToolUse hook blocks with exit code 2, its stderr is fed back to the model and is the model's only explanation of why the call was refused; a bare 'Blocked.' is the hook equivalent of a bare 'Operation failed' tool error, leaving nothing to adapt to. Stating the cap and the escalation path lets the agent immediately take the correct action. Retry caps are safety fallbacks that stop the loop without producing a resolution, converting to PostToolUse would let the over-cap credit execute, and removing the tool punishes every legitimate under-cap credit.

*Hint if stuck: What the hook writes to stderr is the model's only explanation of why the call was refused.*
</details>

---

## Question 15
A developer-productivity team wants three automated behaviors in Claude Code: (1) load the current sprint's ticket list once when a session opens, (2) strip ANSI color codes out of every Bash result before the model reads it, and (3) prevent any edit to files under vendor/. Which hook events implement these behaviors?

A) (1) UserPromptSubmit, (2) PreToolUse, (3) Stop
B) (1) SessionStart, (2) PreToolUse, (3) PostToolUse
C) (1) UserPromptSubmit, (2) PostToolUse, (3) SessionStart
D) (1) SessionStart, (2) PostToolUse, (3) PreToolUse

<details>
<summary>Answer & explanation</summary>

**D)** SessionStart runs once when the session opens, which is the right place for one-time context like the sprint ticket list. PostToolUse fires after a tool runs and is where outputs get normalized, such as stripping ANSI codes from Bash results. PreToolUse gates calls before they execute, so it is where vendor/ edits get blocked with exit code 2. The second option reverses the last two events: PreToolUse cannot clean a result that does not exist yet, and PostToolUse fires only after the edit has already happened.

*Hint if stuck: Match each behavior to when it must run: session open, after a tool returns, or before a tool executes.*
</details>

---
