# Full Practice Exam 02 — CCAR-F simulation

Same format as the real exam guide: **60 questions, 120 minutes, scaled score out of 1000,
pass at 720.** Domain weighting: D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.
No question here appears in the other 2 printable exams.

Set a timer. No notes, no docs. For the interactive version with the clock, flags, and a score report, open the game.

---

## Question 1
A logistics operations agent calls a shipment-tracking tool that returns a 45-field JSON object per shipment, including carrier metadata, customs codes, and internal routing flags. The agent only ever uses status, ETA, and current location. Sessions tracking 30+ shipments hit context limits by mid-session. What should the architect do?

A) Run /compact to summarize accumulated history each time the session approaches the context limit
B) Add a PostToolUse hook that trims each result to status, ETA, and location before it enters history
C) Instruct the agent in the system prompt to ignore irrelevant fields when reading tool results
D) Upgrade to a model with a larger context window so the full 45-field payloads can accumulate safely

<details>
<summary>Answer & explanation</summary>

**B)** Verbose tool outputs should be trimmed before they accumulate; a PostToolUse hook deterministically reduces each result to the needed fields at the source of the bloat. /compact is lossy and acts only after the damage is done, prompting the agent to 'ignore' fields removes zero tokens, and a larger window just delays the failure while raising cost.

*Hint if stuck: Reduce the tokens at the moment they enter context, not after they have piled up.*
</details>

---

## Question 2
An engineer submits a Message Batch of 20,000 document extractions, then finds that 5,000 of the documents are duplicates she does not need. She cancels the batch about an hour in. When it reaches ended, some requests show succeeded and the rest show canceled. What should she do next?

A) Resubmit the 20,000 requests, since a canceled batch throws away the results it had produced
B) Wait for the canceled requests to resume, since cancelling merely pauses a batch for 24 hours
C) Add the canceled custom_ids back to the same batch, since a canceled batch accepts new requests
D) Keep the succeeded results, then resubmit the canceled custom_ids that are still needed

<details>
<summary>Answer & explanation</summary>

**D)** A canceled batch ends with partial results for requests processed before cancellation, and canceled requests were never sent to the model, so they are not billed. The efficient path is to keep what succeeded and resubmit only the canceled custom_ids that are still wanted, in a new batch. Results are not discarded on cancel, cancellation does not pause and resume, and a submitted batch cannot be modified.

*Hint if stuck: Think about what a canceled batch still holds and what was never sent to the model.*
</details>

---

## Question 3
After a runaway agent burned $400 in API calls overnight, an e-commerce team's incident review proposes capping the order-management agent at 3 loop iterations as the primary termination mechanism. A week later, 30% of legitimate multi-step tasks (check inventory, apply discount, create shipment) fail half-finished. What should the architecture look like?

A) Keep the cap at 3 but prompt the model to plan ahead so each task finishes within three tool calls
B) Let stop_reason end_turn drive termination, investigate why the runaway loop never reached it, and keep a generous iteration cap only as a safety fallback
C) Raise the cap to exactly the longest observed legitimate task length, currently measured at 6 iterations, so real tasks finish while runaway loops are still cut off early
D) Replace the loop with a fixed three-step pipeline so the iteration count becomes fully deterministic

<details>
<summary>Answer & explanation</summary>

**B)** Iteration caps are safety fallbacks against pathological loops, never the primary control; genuine completion is signaled by stop_reason end_turn. Tuning the cap to the longest observed task just moves the failure boundary — any task one step longer still truncates — and neither tuned cap explains or fixes whatever caused the original runaway. A fixed pipeline throws away the adaptive sequencing the order workflows need.

*Hint if stuck: Ask what mechanism should normally end the loop, and what role a hard cap is actually meant to play.*
</details>

---

## Question 4
To cut human review of insurance-claim extractions, a team adds a second Claude call that grades each extraction 'correct' or 'incorrect' and sends only 'incorrect' ones to people. In a demo the grader looks sensible. What should happen before the team relies on it to decide which extractions humans see?

A) Run the grader with the same prompt as the extractor so its judgments match how the fields were first extracted
B) Check its verdicts against expert human labels, refine the rubric until they agree, then keep spot-checking
C) Have the grader output a 1–10 score instead of a verdict, and send people only the items scoring under five
D) Trust the grader once it marks over 95% of extractions correct, since that matches the extraction dashboard

<details>
<summary>Answer & explanation</summary>

**B)** An LLM grader is only as good as its agreement with expert humans, so it should be calibrated against human labels, with its rubric refined until they agree, and spot-checked over time; giving it a way to answer 'unknown' also reduces confident guesses. Reusing the extractor's prompt copies the extractor's blind spots instead of catching them. Changing the output scale does nothing to validate the judgments. Matching the dashboard's pass rate is circular: a grader that approves everything would match too.

*Hint if stuck: A new reviewer, human or model, earns trust by being measured against something; ask what that should be.*
</details>

---

## Question 5
A developer-productivity agent uses the Messages API with its own client tools plus Anthropic's server-side web_search tool. Its loop runs tools when stop_reason is tool_use and otherwise returns the reply as the final answer. Two bugs show up: long code-generation replies reach users cut off mid-function, and on broad research questions the agent sometimes hands back a half-finished answer right after a burst of web searches. Which changes fix the loop? (Choose two.)

A) On max_tokens, treat the reply as cut off: continue it, or retry with a higher limit if a tool call broke
B) Treat each stop_reason other than tool_use as a failure and resend the identical request until it passes
C) Add stop_sequences for a closing marker so the model wraps up its answer before reaching the limit
D) Switch the request to streaming so that long code replies arrive in chunks instead of being truncated
E) On pause_turn, append the assistant content as it is and call again so the server-side search resumes

<details>
<summary>Answer & explanation</summary>

**A, E** max_tokens means the reply hit the length limit, so it is incomplete: continue the response, or raise max_tokens and retry when the cut fell inside a tool_use block. pause_turn means a server-tool turn was paused; sending the assistant content back as-is lets Claude finish the search and the answer. A stop sequence ends output earlier, which does not make long code fit. Resending the identical request drops the paused content and repeats the same cut-off. Streaming changes how tokens arrive, not how many the response may contain.

*Hint if stuck: Each non-tool_use stop reason means something different. Which ones say "not done yet", and what does each need?*
</details>

---

## Question 6
A research coordinator built on the Agent SDK delegates to custom search subagents defined with AgentDefinition (not forks). Each subagent call blocks until its report returns, and the coordinator spawns one, waits, then spawns the next, so a five-source query takes five times as long as the slowest search. The subagents also return papers outside the 2021-2024 window and from the publishers the coordinator agreed with the user to exclude earlier in its conversation. Which changes address both problems? (Choose two.)

A) Add the date window and exclusions to the coordinator's system prompt, which subagents inherit at start
B) Chain the subagents so each receives the previous one's full transcript and can skip sources it has seen
C) Have the coordinator emit the independent Task (Agent) calls in one response so searches run at once
D) Write the date window and the publisher exclusions into the prompt of each Task call the coordinator makes
E) Raise each subagent's maxTurns so it has room to work out the date window from the sources that it finds

<details>
<summary>Answer & explanation</summary>

**C, D** Several Task calls (named Agent in newer releases) in a single response run the subagents concurrently, so the query takes about as long as the slowest search. A non-fork subagent starts with no parent conversation: the prompt string the coordinator passes is the only content it receives from the coordinator, so constraints agreed earlier must be written into it. The parent's system prompt is not passed to subagents either. Chaining transcripts makes the work sequential again and bloats each context. More turns cannot recover a constraint the subagent was never told.

*Hint if stuck: Think about what a newly spawned subagent can actually see, and how to avoid waiting on each search in turn.*
</details>

---

## Question 7
A team creates a new service repository and wants to give Claude Code useful project memory quickly. Nobody has written a CLAUDE.md yet, and the tech lead plans to write one from scratch later this quarter. What is the most effective first step?

A) Run /init to generate a starter CLAUDE.md from the codebase, then review and trim it with the team
B) Copy another team's CLAUDE.md from a different service so there is at least some guidance to start
C) Leave memory empty and have each session start by asking Claude to explore and summarize the build
D) Paste the full contents of the architecture wiki into CLAUDE.md so Claude has every possible detail

<details>
<summary>Answer & explanation</summary>

**A)** The /init command analyses the codebase and produces a starter CLAUDE.md with build commands and structure, which the team can then refine. Another service's file carries conventions that may not apply here. Re-exploring in every session repeats the same discovery work and is never captured for the team, and dumping a whole wiki creates a bloated file that lowers adherence.

*Hint if stuck: Ask what gets a reasonable first draft quickly without borrowing another codebase's assumptions.*
</details>

---

## Question 8
A team's committed .mcp.json configures a code-quality server with headers set to Bearer ${QUALITY_TOKEN}. Locally it works for everyone, but in the CI review job the server rejects every request as unauthorized, and `claude mcp list` in the job prints a warning about an unresolved variable. What is the right fix?

A) Commit a CI-only copy of .mcp.json that contains the literal token value so the job never depends on expansion
B) Move the server to user scope on the CI runner image so that its configuration is stored outside the repo
C) Change the header to ${QUALITY_TOKEN:-ci-default} so that the job falls back to a default token when unset
D) Expose the token to the CI job as an environment variable named QUALITY_TOKEN from the CI secret store

<details>
<summary>Answer & explanation</summary>

**D)** When a referenced variable has no value, the config loads with the literal ${VAR} text and Claude Code warns; the fix is to supply the variable in the CI environment from its secret store. Committing the literal token defeats the reason for expansion. A default value would itself be a secret in the repo, and baking a user-scope config into the runner image duplicates configuration the project file already handles.

*Hint if stuck: The warning names the problem; fix it where it occurs without changing what is committed.*
</details>

---

## Question 9
A research coordinator plans four subagent tasks to compare treatment costs for a medical device across three countries. The first subagent reports that the device was withdrawn from one of those markets last year. The other three tasks are already queued with their original instructions. What should the coordinator do?

A) Let the queued tasks run unchanged and mention the withdrawal in a footnote of the final report so the original plan is honoured
B) Revise the remaining tasks in light of the finding, such as dropping or redirecting work on the withdrawn market
C) Ask the first subagent to double-check its finding three more times before the coordinator makes any change to the plan
D) Cancel the whole research job and ask the user to submit a new request that takes the market withdrawal into account

<details>
<summary>Answer & explanation</summary>

**B)** In adaptive decomposition, findings feed back into the plan; a premise-changing result should redirect queued work. Running stale tasks wastes effort on an invalid premise, cancelling everything throws away the valid parts of the job, and repeated re-checks delay a decision that a single sourced finding already justifies reviewing.

*Hint if stuck: What happens to a plan when one of its assumptions turns out to be wrong?*
</details>

---

## Question 10
A developer-tools team wrote a docs-style.md rule with paths: *.md to enforce heading and link conventions in documentation. The rule loads when Claude edits README.md at the repository root, but not when it edits docs/guides/setup.md or packages/cli/docs/usage.md. Which change applies it to all documentation?

A) Move docs-style.md into a docs/.claude/rules/ folder so it sits closer to the documentation it covers
B) Rename the rule file to markdown.md so Claude associates it with Markdown files anywhere in the tree
C) Change the pattern to **/*.md so Markdown files in any directory, including nested docs folders, match
D) Add an instruction to the rule body telling Claude to apply it to every Markdown file in the repository

<details>
<summary>Answer & explanation</summary>

**C)** A pattern like *.md is relative to the project root and matches only root-level files; **/*.md matches Markdown at any depth. The rule's filename carries no matching meaning, and text inside the rule body cannot load the rule in the first place. Moving it under docs/ would still miss packages/cli/docs/ and changes the base directory the pattern is resolved against.

*Hint if stuck: Patterns are resolved from the project root; how deep does *.md reach?*
</details>

---

## Question 11
A clear one-function bug in a payments service rounds refunds down instead of half-up. The fix and the expected values are known, and tests cover the function. Because payments are sensitive, a manager asks for plan mode. What is the most appropriate call?

A) Plan mode, because sensitive code always warrants planning whatever the size of the change
B) Plan mode followed by the Explore subagent, to make sure no other rounding paths exist
C) Direct execution without tests, since the expected values are already well understood
D) Direct execution with the expected values in the prompt, plus the usual tests and review

<details>
<summary>Answer & explanation</summary>

**D)** The mode follows the shape of the change, not how sensitive the area is: one clear function with known expected values is direct-execution work, and risk is managed by the tests and review that apply anyway. Plan mode adds an approval step with no design to decide, and adding an Explore sweep widens a scoped fix. Skipping tests removes the very safeguard sensitive code needs.

*Hint if stuck: Sensitivity and complexity are different things; which one decides the mode?*
</details>

---

## Question 12
A support agent records refunds through issue_refund, whose reason parameter is a free-text string. The finance team reports that the agent writes 'damaged', 'arrived broken', 'defective item' and dozens of other variants, so their reports cannot group refunds by cause. Which change gives the most reliable result?

A) Constrain reason to an enum of the finance categories in the input schema, describe each value briefly, and add an optional free-text note field for details
B) List the preferred wording for each refund category in the system prompt and ask the agent to keep to those exact phrases whenever it issues a refund
C) Run a nightly job that uses a second model call to map each free-text reason onto the finance categories after the refunds have already been recorded
D) Add a few example issue_refund calls to the tool description showing the preferred reason wording, so the model copies that phrasing each time it records a refund

<details>
<summary>Answer & explanation</summary>

**A)** When downstream systems need a fixed set of values, the tool interface should enforce it: an enum in the input schema makes only valid categories possible, and a separate note field keeps the nuance. Prompt guidance and examples reduce variation but cannot guarantee it, and a nightly remapping job repairs data after the fact with a second probabilistic step instead of fixing the interface.

*Hint if stuck: Prefer a constraint the schema enforces over wording the model is asked to remember.*
</details>

---

## Question 13
A support agent can issue refunds up to $200; larger ones need a supervisor. When it calls issue_refund for $650, the tool returns isError with the text 'Refund could not be processed.' The agent retries three times, then tells the customer the system is down. What should the tool return instead?

A) A transient error marked retryable, so the agent waits a few seconds and tries the same refund again before it gives the customer any update
B) A protocol-level JSON-RPC error, so the client stops the conversation and the platform routes the customer to a human agent automatically
C) A successful result with a partial refund of $200 already applied, so the customer gets something immediately and the remainder can be handled later
D) A structured business error: category policy_limit, isRetryable false, and a message saying refunds over the $200 limit need supervisor approval

<details>
<summary>Answer & explanation</summary>

**D)** The failure is a business rule, not an outage, so retrying can never succeed; a structured error saying what rule was hit, that it is not retryable and what the next step is lets the agent escalate correctly and explain it honestly. Marking it retryable repeats the same pointless loop, quietly issuing a partial refund takes an action nobody approved, and a protocol error hides the reason from the model instead of letting it recover.

*Hint if stuck: Ask what the agent needs to know to choose between retrying, escalating and explaining.*
</details>

---

## Question 14
A CI job posts a summary of each pull request to a chat channel that shows plain text only. The prompt is a long markdown document with headers and bullet lists, and it ends with 'Do not use markdown.' Summaries vary in structure from run to run (the risk section is sometimes missing entirely) and are full of raw asterisks and # signs. Which changes should the team make? (Choose two.)

A) Add 'Do not use markdown' to the system prompt as well as at the end of the user prompt
B) Add three example summaries for a bug fix, a feature and a refactor, all in the target layout
C) Rewrite the prompt in plain prose and describe the plain-text layout the summary should take
D) Add examples from the last three bug-fix PRs, since bug fixes make up most of the PR traffic
E) Ask for the summary inside <risks> and <changes> XML tags so the channel shows each section

<details>
<summary>Answer & explanation</summary>

**B, C** Example summaries in the target layout, across different kinds of PR, are the most reliable way to make the structure consistent. Markdown in the prompt pulls the output towards markdown, so writing the prompt in plain prose and saying what form to use, rather than only what to avoid, cuts the stray formatting. Repeating the negative instruction leaves the markdown-heavy prompt that is pulling the output, and says nothing about what to produce instead. Examples drawn from one kind of PR give the other kinds nothing to follow. A plain-text channel prints XML tags as raw text, just as it prints asterisks.

*Hint if stuck: Think about what the model imitates besides the instructions it is given.*
</details>

---

## Question 15
A support agent's create_return tool fails for orders delivered more than 30 days ago. It returns isError with 'Return window closed', and the agent ends the conversation with 'Sorry, we can't help.' Policy allows store credit up to 60 days, and the CSAT team says these customers would usually accept it. What should the tool return?

A) A transient error marked retryable, so that the agent tries the return again later in the conversation in case the policy check produced the wrong answer
B) A successful return anyway, so the customer is not disappointed and the finance team can reverse the return later if the order turns out to be ineligible
C) A business error, not retryable, stating the window closed on a given date and listing available alternatives, such as store credit until day 60
D) A protocol-level error that triggers automatic escalation to a human agent, who can then decide whether to offer the customer any other options

<details>
<summary>Answer & explanation</summary>

**C)** A business-rule error is most useful when it explains the rule that applied and what can still be done, so the agent can move to the next best resolution instead of a dead end. Marking it retryable invites a loop that can never succeed, approving an ineligible return breaks policy, and escalating every closed window to a human throws away a resolution the agent could offer itself.

*Hint if stuck: Ask what the customer could still be offered, and whether the agent has any way of learning that.*
</details>

---

## Question 16
An architect spent 30 minutes in a Claude Code session reading 40 files of a monorepo and building a verified mental model of its service boundaries. She now wants to explore three mutually exclusive migration strategies, each requiring long follow-up investigation that would contaminate the others' reasoning. What is the most efficient setup?

A) Explore the three strategies sequentially in the same session, running /compact between each one to free up context for the next
B) Spawn three Task subagents from the current session, one per strategy
C) Paste a hand-written summary of the findings into three fresh sessions, one per strategy
D) Use fork_session to branch three sessions from the current one, so each strategy starts from the same loaded baseline

<details>
<summary>Answer & explanation</summary>

**D)** fork_session exists exactly for this: it branches new sessions from a shared baseline, so all three explorations start with the full 40-file understanding and none pollutes the others. Task subagents start with isolated, empty context, so the accumulated understanding would have to be repacked into each prompt and would arrive lossy. Sequential exploration with /compact lets earlier strategies bias later ones, and hand-written summaries lose fidelity.

*Hint if stuck: One mechanism duplicates an existing session's accumulated context; delegation does not.*
</details>

---

## Question 17
A developer-productivity agent is asked to 'add comprehensive tests to our legacy billing codebase' (300 modules, almost no existing tests, unclear dependencies). Which decomposition approach should it take?

A) Map the codebase first, identify the highest-impact areas, then build a prioritised plan that is revised as dependencies are discovered
B) Generate tests module by module in alphabetical order until each module has at least one test
C) Ask for the whole test suite in a single pass so the model sees the codebase at once
D) Write a detailed 40-step procedure up front covering each module and dependency, and have the agent follow it step by step without deviation

<details>
<summary>Answer & explanation</summary>

**A)** An open-ended task over an unfamiliar codebase needs adaptive decomposition: explore and map first, prioritise by impact, and let the plan change as dependencies surface. Alphabetical order ignores impact, a single pass dilutes attention across 300 modules, and a rigid upfront procedure cannot account for what has not been discovered yet.

*Hint if stuck: You cannot plan well for code you have not explored yet.*
</details>

---

## Question 18
A support agent queries two order systems after a merger. The legacy system returns statuses like 'SHP', 'BKO' and 'CXL'; the new one returns 'shipped', 'backordered' and 'cancelled'. The agent sometimes tells customers a cancelled order 'is on its way'. Both systems are owned by other teams with year-long change queues. What should the architect implement?

A) A mapping table of legacy codes in the system prompt with instructions to translate every status before replying to a customer about an order
B) A new normalize_status tool the agent is instructed to call on every status it receives from either system before it answers
C) A PostToolUse hook on both order tools that rewrites every status into one canonical vocabulary before the result reaches the model
D) A request to both owning teams to align on a shared status vocabulary, with the agent kept as it is until the change ships

<details>
<summary>Answer & explanation</summary>

**C)** When tools return inconsistent formats, a PostToolUse hook can normalise every result deterministically before the model reasons over it, without touching upstream systems. A prompt mapping table and an extra tool both depend on the model remembering to translate on each call. Waiting on upstream teams leaves customers misinformed for a year.

*Hint if stuck: Upstream can't change and the model keeps misreading. Where could the inconsistency be removed without relying on the model to remember?*
</details>

---

## Question 19
In a research system, scouts already return structured findings with claim text, source id, and retrieval date. Yet the final report — written by a synthesizer prompted to produce "a polished executive narrative, citing sources" — regularly contains untraceable claims: about 30% of spot-checked statements match no source id in any scout's output. What is the root-cause fix?

A) Strengthen the synthesizer prompt so that every sentence must include a bracketed source id and nothing may be stated without a matching citation
B) Make synthesis emit each claim as a structured record carrying its source ids, validated against the scouts' finding set before the narrative renders
C) Lower the synthesizer's temperature to 0 so the narrative stays closer to the scouts' original wording and introduces fewer unsourced claims
D) Add a final Haiku pass over the narrative that deletes any sentence lacking a bracketed citation before the finished report ships to readers

<details>
<summary>Answer & explanation</summary>

**B)** Provenance dies at the one stage that converts structured data into free prose, so the fix is making synthesis itself produce structured claim records whose source ids can be programmatically validated against the scouts' findings before rendering. A stricter prompt is still probabilistic — the model can bracket fabricated ids — temperature does not prevent fabrication, and a deletion pass removes uncited sentences without catching plausible-but-wrong citations.

*Hint if stuck: Ask at which step the link between a sentence and the evidence behind it can first go missing, and whether anything checks it there.*
</details>

---

## Question 20
A research coordinator built with the Agent SDK has search, analysis and report subagents. Only the analysis subagent should query the internal data-warehouse MCP server, which exposes sensitive revenue tables, but today every subagent inherits the server's tools and the report writer has run ad hoc warehouse queries. Which configuration fits best?

A) Give the analysis subagent the warehouse tools in its definition and list explicit tools for the others that exclude them
B) Keep the warehouse on the main session and tell the search and report subagents in their own prompts not to query it
C) Start the warehouse server for the analysis phase and shut it down before the report subagent is spawned
D) Let each subagent keep access but log each warehouse query so that the data team can review any misuse weekly

<details>
<summary>Answer & explanation</summary>

**A)** Subagent definitions can scope tools per role, including MCP servers and their tools, so the warehouse belongs only on the analysis subagent and the others get explicit lists that leave it out. Prompt prohibitions leave sensitive tools in view. Starting and stopping servers by phase is fragile orchestration that breaks when phases overlap, and weekly log review only detects misuse after the data is exposed.

*Hint if stuck: Grant the sensitive server to the one role that needs it.*
</details>

---

## Question 21
A CI step asks Claude to 'check that code comments are accurate'. It flags dozens of comments per PR for minor wording, and developers have started ignoring it. Which prompt change most improves precision?

A) Add 'stick to high-confidence findings'
B) Ask the model to rate each finding from 1 to 10 for confidence and post those it rated 8 or higher
C) Add 'be conservative and avoid nitpicks'
D) Flag a comment only when the behaviour it describes contradicts what the code actually does

<details>
<summary>Answer & explanation</summary>

**D)** Defining the defect (a comment whose described behaviour contradicts the code) tells the model exactly what to report, so wording nitpicks drop out. 'Stick to high-confidence findings' and 'be conservative' are vague cautions that leave the model's notion of an issue unchanged, and a self-rated 1-10 score ranks the same wrong findings because the model has no criterion to score against.

*Hint if stuck: Define what counts as wrong, rather than how careful to be.*
</details>

---

## Question 22
A developer-tools app built on the Agent SDK defines a test-runner subagent with AgentDefinition, using the description "Runs things". When users ask the main agent whether a change broke anything, it usually runs the whole suite itself and floods its own context with output. On the rare runs where test-runner is used, the main agent learns only "Tests done, some failed" and cannot say which tests failed. Which changes fix this? (Choose two.)

A) Set the subagent's model to opus so that its reports come back longer and more detailed than before
B) Rewrite the description to say it runs the test suite and when to use it, such as after code changes
C) Have the main agent read the subagent's tool results from its own context after the subagent returns
D) Leave the tools field out of the definition so test-runner inherits each tool the main agent has
E) Have test-runner's prompt require a final report listing each failing test, its file and its error

<details>
<summary>Answer & explanation</summary>

**B, E** Claude decides whether to delegate by matching the task to each subagent's description, so "Runs things" gives it nothing to match. Only the subagent's final message returns to the parent; its tool calls and output stay in its own context, so the report must carry the failing tests, files and errors. The parent cannot read the subagent's intermediate tool results. A bigger model does not tell the subagent what its report must contain. Omitting tools widens what test-runner can do but fixes neither the routing nor the report.

*Hint if stuck: How does the main agent decide to delegate, and what part of a subagent's run does the main agent actually get back?*
</details>

---

## Question 23
A healthcare intake assistant classifies patient messages as urgent, routine, or administrative. Accuracy on clear-cut messages is 98 percent, but messages mixing signals, like a medication-refill request that also mentions new chest pain, get classified inconsistently across runs. The prompt already contains three clear examples of each category. What should you add?

A) More clear-cut examples of each category, scaling up to ten per class so each label is better represented
B) An instruction telling the model to use its best clinical judgment whenever a message contains mixed signals
C) A higher extended-thinking budget so the model reasons for longer about each incoming patient message
D) A few examples of mixed-signal messages, each paired with the correct label and the reasoning that justifies it

<details>
<summary>Answer & explanation</summary>

**D)** The failures are concentrated in ambiguous inputs, so the examples must demonstrate how to resolve ambiguity, and including the reasoning teaches the decision process rather than just the answer. More clear-cut examples reinforce what already works, 'use best judgment' gives the model no new decision rule, and a bigger thinking budget adds latency to every message without supplying the missing tie-breaking criteria.

*Hint if stuck: Ask where the errors cluster and what the prompt currently teaches about those cases.*
</details>

---

## Question 24
Before refactoring how feature flags are read, a developer wants to know every place flags are evaluated in a 2,000-file repository. Her previous attempt ran the search in the main session and left thousands of lines of grep output in context, crowding out the plan she was building. What is the best approach this time?

A) Run the search in the main session but ask Claude to forget the results once it has finished
B) Skip the search and let Claude discover usages one at a time as it goes on to edit each file
C) Use the Explore subagent for the search and keep only its summarised list in the main session
D) Start in plan mode, because plan mode stops search output from being added to the context

<details>
<summary>Answer & explanation</summary>

**C)** The Explore subagent is built for read-only discovery in its own context, returning a condensed result so the main session keeps room for planning. Claude cannot be told to forget output already in its context, and plan mode changes what Claude may edit, not where search output goes. Skipping discovery risks missing usages in a refactor that needs all of them.

*Hint if stuck: Keep the noisy part of the work out of the context you want to keep.*
</details>

---

## Question 25
Claude Code runs the project's test suite many times while fixing a service, and each run prints about 8,000 lines, nearly all of them passing tests. Within an hour the session is compacting repeatedly and losing details. The team wants every test run in every session to put only the failures into Claude's context, without anyone having to remember. What should they set up?

A) A CLAUDE.md note asking Claude to skim test output and focus on just the failing tests when it reads the results
B) A habit of running /compact right after each test run, with an instruction to keep just the failing test names
C) A PreToolUse hook on Bash that rewrites test-runner commands so their output is filtered down to failures
D) A higher auto-compact threshold, so the session holds more test output before it summarises the history

<details>
<summary>Answer & explanation</summary>

**C)** Claude Code's cost guide shows this pattern: a PreToolUse hook detects test-runner commands and returns updatedInput that filters the output to failures, so the passing noise never enters context, on every run. Asking Claude to focus doesn't help once the full output is already in context. Manual /compact depends on someone remembering and pays for the output first. A higher threshold just stores more noise.

*Hint if stuck: The cheapest tokens are the ones that never reach the conversation. Where can you step in every time?*
</details>

---

## Question 26
A CI security reviewer flags every SQL string built with concatenation, including queries assembled only from hard-coded constants and those in test fixtures. Developers now dismiss its SQL findings without reading them. Which prompt change most improves precision?

A) State that it reports concatenation only when user data reaches an unparameterized query, and skips constants and test fixtures
B) Tell the reviewer to report SQL concatenation when it is confident the code is genuinely exploitable by an attacker in production
C) Ask the reviewer to include a short justification with each SQL finding so developers can judge each one
D) Lower the SQL category's severity to informational so the findings stop blocking merges on each PR

<details>
<summary>Answer & explanation</summary>

**A)** Explicit criteria (user-controlled data reaching an unparameterized query) and an explicit skip list (constants, fixtures) give the model a checkable rule that separates real injection risk from noise. "When it is confident" is the same vague caution in new words, justifications add reading load without removing false positives, and downgrading severity leaves the noise in place.

*Hint if stuck: Turn the caution into a rule about what qualifies and what does not.*
</details>

---

## Question 27
A research subagent labels each source as primary, secondary or unreliable before synthesis. Reviewers find it is inconsistent on preprints, company white papers and conference abstracts, while the written definitions of each label are already detailed and agreed by the team. What is the most effective next step?

A) Rewrite the three label definitions at greater length, adding sub-clauses for preprints, white papers and abstracts so each case is spelled out in prose
B) Have a second subagent independently label the same sources and keep only those where both agree, discarding all the sources with disagreements
C) Add worked examples of a preprint, a white paper and an abstract, each with the chosen label and the reason it fits better than the alternatives
D) Add a fourth label called uncertain so that the model can opt out of labelling preprints, white papers and abstracts when it cannot decide

<details>
<summary>Answer & explanation</summary>

**C)** The definitions are already good; what is missing is demonstrated judgment on the ambiguous types, and examples that explain why one label beats the others generalise to similar sources. Longer definitions add more prose the model already interprets inconsistently, dual labelling discards useful sources rather than fixing the judgment, and an opt-out label hides the inconsistency instead of resolving it.

*Hint if stuck: When the rules are clear but the borderline calls are not, show the borderline calls.*
</details>

---

## Question 28
A platform team is trimming a 600-line project CLAUDE.md. Each item below sits in it today. The team's rule of thumb is that content Claude needs in nearly every session stays always-on, behaviour that must happen every time without fail is automated, and the rest should load only when the task calls for it. Which items should become skills? (Choose two.)

A) Prefer pnpm over npm or yarn for each install and script command run in this repository
B) A 180-line template and tone guide for incident postmortems, used about twice a month
C) Run the formatter on each file right after Claude edits it, without relying on a reminder
D) The commands to build, lint and run one test file, which Claude needs in most of its work
E) The steps to cut a release: bump versions, update the changelog, tag, and trigger the build

<details>
<summary>Answer & explanation</summary>

**B, E** The postmortem guide and the release steps are long, task-specific workflows used occasionally, which is what skills are for: only their descriptions sit in context until someone invokes them or asks for that task. The package-manager rule and the build and test commands apply in almost every session, so they belong in CLAUDE.md. Formatting after every edit must happen each time without Claude choosing to, so it belongs in a PostToolUse hook; a skill is loaded only when invoked or judged relevant.

*Hint if stuck: Sort each item by when it is needed and whether Claude may decide to skip it.*
</details>

---

## Question 29
A CI job runs Claude Code headlessly to update a dependency. The upgrade guide offers two incompatible migration paths, and the right one depends on a product decision the job cannot see. Nobody is watching the job. How should the job be designed to handle this?

A) Stop on this kind of ambiguity and open the PR or an issue describing both paths and the decision needed
B) Pick the path that changes the fewest files, since a smaller diff is easier for reviewers to approve later on
C) Implement both migration paths on separate branches and let the CI system automatically merge whichever passes tests
D) Keep retrying the migration with different prompts until one of the paths compiles cleanly and then merge it

<details>
<summary>Answer & explanation</summary>

**A)** In an unattended run, a decision the agent cannot make should be surfaced to a human with the options laid out, rather than settled by a proxy. Smallest-diff and passes-tests are heuristics that do not answer the product question, and retrying until something compiles turns a decision into luck.

*Hint if stuck: Ask who is able to make this choice, and how they will learn that it needs making.*
</details>

---

## Question 30
A team resumes Claude Code sessions across several days of work on an internal search service. Developers launch with `--mcp-config` pointing at a local file that adds the search-index MCP server, and resumed sessions keep coming back without the search-index tools whenever someone forgets the flag. Which change prevents this class of failure?

A) Run /compact right after each resume so that the summary of earlier tool calls brings the search-index tools back into context
B) Stop resuming sessions and start a fresh one each day, since resumed sessions cannot be relied on to have MCP tools available
C) Add a CLAUDE.md line asking Claude to reconnect the search-index server itself whenever it notices those tools are missing
D) Move the server into the project's committed .mcp.json configuration, which is read at every launch, instead of a per-launch flag

<details>
<summary>Answer & explanation</summary>

**D)** Resume restores the conversation, not every launch flag, so configuration that lives only in a command-line flag is lost whenever someone forgets it; configuration files read at each launch remove the human step. Compaction summarises history and cannot load tools, abandoning resume throws away valid context to work around a configuration problem, and Claude cannot attach an MCP server to its own session from an instruction.

*Hint if stuck: Think about what a resumed session re-reads at launch and what it only gets if you type it again.*
</details>

---

## Question 31
A developer used --fork-session to try two caching strategies from the same analysis. After an hour, the fork using a write-through cache is clearly better. The original session explored the alternative. How should he carry on with the winning approach tomorrow?

A) Resume the fork using its own session ID or name, since it is an independent session and the original was left unchanged
B) Resume the original session, since forks are temporary branches and their history is merged back into the original on exit
C) Start a fresh session and paste the fork's final message, since a forked session cannot itself be resumed later
D) Fork the original session again tomorrow and repeat the write-through work in the new fork from the same analysis

<details>
<summary>Answer & explanation</summary>

**A)** A fork gets its own session ID and history and can be resumed like any other session; the original stays as it was. Forks are not merged back, they are fully resumable, and redoing the work in a new fork wastes the hour already spent.

*Hint if stuck: A fork is a session in its own right.*
</details>

---

## Question 32
A developer-productivity team plans to connect Claude Code to eight MCP servers exposing about 150 tools in total. One engineer argues that all those tool definitions will fill the context window at session start, so the team should cut down to two servers. On a current model with default settings, what should the architect tell the team?

A) Keep the servers but set ENABLE_TOOL_SEARCH=false, so that each definition loads upfront and Claude can see each tool before choosing
B) Tool search defers MCP tool definitions until Claude needs them, so keep the servers and put search terms early in descriptions
C) Cut down to two servers as proposed, since Claude Code loads the full definition of each tool from each server when a session starts
D) Merge the eight servers into one server with 150 tools, since Claude Code charges context per connected server rather than per tool

<details>
<summary>Answer & explanation</summary>

**B)** Tool search is on by default on current models: only tool names and server instructions load at session start, and definitions are fetched on demand, so adding servers has little effect on context. Because matching reads the start of a description, the docs advise putting the words Claude would search for near the start. Turning tool search off loads every definition upfront, which is the cost the engineer fears, and context is spent per tool definition, not per server.

*Hint if stuck: Check what Claude Code actually loads for MCP servers when a session begins on a current model.*
</details>

---

## Question 33
A returns agent built with the Agent SDK defines create_return as a custom tool in an in-process MCP server, and the handler doesn't catch errors. When the warehouse API answers 409 because a return already exists for the order, Claude sees only "Request failed with status code 409" and tells the customer the system is down. Separately, about one call in ten fails because Claude passes reason values such as "broken" that the API does not accept. Which changes help? (Choose two.)

A) Wrap the query() call in try/catch so that tool exceptions surface there and the whole turn can be retried
B) Return the raw 409 response body as a normal success result so that Claude can parse the details from it
C) Catch the 409 in the handler and return isError: true with a message naming the existing return and status
D) Let the exception propagate, since an uncaught error stops the query and the app can restart the session
E) Declare reason as an enum of the API's accepted codes in the tool's input schema, with a line on each code

<details>
<summary>Answer & explanation</summary>

**C, E** When a handler throws, the SDK's in-process server turns the exception into an error result carrying the raw message, so Claude reads only the bare status; catching it and returning isError with a composed message (a return already exists, its ID and status) gives Claude something to tell the customer. An enum in the input schema, described briefly, shows Claude the accepted reason codes so it stops inventing values. An uncaught handler error doesn't stop the agent loop, and tool exceptions don't surface from query(), so neither try/catch nor restarting addresses it. Returning a failure as a success hides that the call failed.

*Hint if stuck: Trace what actually reaches the model in each case, and fix each problem at the earliest point that can.*
</details>

---

## Question 34
An insurance claims pipeline extracts 20 fields per claim but returns a single document-level confidence. Any claim below 0.8 goes to a reviewer, who then re-checks all 20 fields by hand, and review costs are rising. Which change makes human review more efficient without losing accuracy?

A) Lower the document-level threshold to 0.7 so that fewer claims are sent to reviewers, while keeping the full 20-field check for each one
B) Have the model write a summary of each claim so that reviewers can skim it instead of checking the individual extracted fields
C) Produce calibrated confidence for each field and have reviewers check only the fields flagged as low confidence
D) Split the 20 fields across two reviewers who each check ten, so that each flagged claim moves through the review queue twice as fast

<details>
<summary>Answer & explanation</summary>

**C)** Calibrated field-level confidence points reviewers at the fields that are actually uncertain instead of the whole document. Lowering the document threshold just reviews fewer claims and lets more errors through, without making each review more efficient. Splitting fields across reviewers keeps the full workload, and a skimmable summary hides the field errors reviewers are there to catch.

*Hint if stuck: Make the confidence signal as fine-grained as the review work.*
</details>

---

## Question 35
A ticket-routing extractor uses structured outputs with an enum of queue names such as Billing support and Account access. A validator does exact string matching against the enum and rejects a small share of otherwise correct responses because they contain Billing Support with a capital S. Retries usually pass. What is the better fix?

A) Compare enum values case-insensitively in the validator and avoid values that differ only by case
B) Treat each casing mismatch as a model failure and keep retrying until the exact string comes back
C) Add few-shot examples showing the exact casing so the model stops varying the capitalisation
D) Replace the enum with a free-text string field and map whatever queue name comes back afterwards

<details>
<summary>Answer & explanation</summary>

**A)** Structured outputs do not guarantee the capitalisation of string enum and const values, typically the first letter of a word after a space, and the response completes normally with no error or special stop_reason. The docs say to compare enum values case-insensitively and avoid values that differ only by case. Retrying spends calls on a known gap, examples can make the slip rarer but cannot guarantee it, and free text gives up the enum's constraint altogether.

*Hint if stuck: Ask whether this mismatch is a real error in the data or a known gap in what the schema guarantees.*
</details>

---

## Question 36
A developer-productivity team is designing two helpers in .claude/skills/. One generates release notes and should run only when an engineer deliberately starts it with a version tag. The other is a database-migration safety checklist that should engage on its own whenever Claude works on migrations. How should each be configured?

A) Leave both model-invocable with clear descriptions, so Claude decides when each one applies
B) Set disable-model-invocation: true on both, so engineers stay in control of when each runs
C) Release notes: disable-model-invocation and an argument; checklist: a description naming migrations
D) Release notes: a description-driven skill Claude picks; checklist: disable-model-invocation: true

<details>
<summary>Answer & explanation</summary>

**C)** Commands and skills are one system, so the design choice is who may invoke each. disable-model-invocation: true keeps release notes manual (typed with its version argument), while a description that names migration work lets Claude load the checklist itself when relevant. Leaving both model-invocable lets Claude start release notes unprompted, disabling both loses the automatic safety net, and the reversed pairing puts manual control on the helper that must engage automatically.

*Hint if stuck: Sort each helper by who should start it, then find the setting that expresses that.*
</details>

---

## Question 37
During a long refactor a developer runs /compact. Right after, Claude proposes a plan for a new React component that ignores the team's .claude/rules/react.md (paths: src/**/*.tsx), although the rule was followed before compaction. Two turns later, once Claude opens an existing .tsx file to copy its imports, the rule is followed again. What is the correct reading of this?

A) Compaction corrupted the rule's frontmatter, and opening a .tsx file made Claude Code parse it again
B) The glob is too narrow, so it matched only the existing file and would never match a new component
C) Rules are summarised during compaction, and the summary lost detail until the next file was opened
D) Path-scoped rules drop out at compaction and load again once a matching file is read or edited

<details>
<summary>Answer & explanation</summary>

**D)** Compaction re-injects the project-root CLAUDE.md, but rules with paths frontmatter load again only on demand, when a matching file is next read or edited. That is why the rule was missing from the plan and came back once Claude opened a .tsx file. Compaction does not touch a rule's frontmatter, src/**/*.tsx matches any .tsx under src including new files, and rule files are not condensed into summaries. A rule that must hold right after compaction belongs in an unscoped rule or the root CLAUDE.md.

*Hint if stuck: Compare what is restored automatically once the conversation is summarized with what has to be triggered again.*
</details>

---

## Question 38
A customer writes in capitals that they are furious their package is late, but tracking shows it arrives tomorrow and the agent can offer the standard late-delivery credit. The customer has not asked for a human. What is the best response pattern?

A) Escalate straight away, because the customer's anger in capitals indicates a high risk of churn that a human agent is better placed to handle
B) Acknowledge the frustration, give the delivery date, apply the standard credit, and escalate if they then ask for a person
C) Ask the customer to calm down before continuing, so that the conversation can stay productive for both sides
D) Offer a larger credit than the standard amount, since an angry customer needs more than the usual remedy

<details>
<summary>Answer & explanation</summary>

**B)** Strong sentiment alone is a poor escalation signal; when the agent can resolve the issue within policy, it should do so while acknowledging the emotion, and still honour a request for a human if one comes. Escalating on anger floods the queue, telling the customer to calm down is counterproductive, and going beyond policy because of tone is improvisation.

*Hint if stuck: Separate how the customer feels from whether the agent can resolve the case.*
</details>

---

## Question 39
An e-commerce support agent classifies each incoming message as order_status, return_request, damaged_item or account_issue before choosing a workflow. Messages like "the box arrived crushed but the item seems fine, can I still send it back?" are labelled differently from run to run. The category definitions were rewritten twice with little gain. What is the most effective next step?

A) Add a few examples of mixed messages like this one, each with the chosen label and a short rationale for picking it over the others
B) Replace the four categories with a free-text intent field and let the downstream workflow decide what to do from the text
C) Add a fifth category called mixed for messages that touch more than one workflow and route all of them to a human queue
D) Ask the model to output a probability for each category and pick the highest one, so that the decision becomes deterministic

<details>
<summary>Answer & explanation</summary>

**A)** After definitions have been refined, examples of the specific ambiguous cases with a rationale are what teach consistent judgment, and they generalise to similar mixed messages. A catch-all mixed label pushes ordinary messages onto humans, free-text intent moves the ambiguity downstream, and self-reported probabilities are not calibrated, so taking the maximum does not make the underlying judgment consistent.

*Hint if stuck: Better definitions have already been tried; what else teaches a boundary?*
</details>

---

## Question 40
An invoice extraction pipeline attaches a confidence score to each field, and the team plans to auto-approve anything above 0.9. A labelled check of 2,000 fields shows that fields scored 0.9 to 1.0 are correct only 84% of the time, while the team's target is 97%. What should they do?

A) Add a sentence to the prompt asking the model to be more conservative with its scores, then auto-approve fields above 0.9 as planned
B) Drop confidence scores and send each field to human review, since the scores have shown they cannot be trusted
C) Keep the 0.9 threshold and add a second model that re-scores each field, auto-approving when both models report a score above 0.9
D) Calibrate the threshold on labelled data, choosing the score cut-off where observed accuracy actually reaches 97% for each field

<details>
<summary>Answer & explanation</summary>

**D)** Raw scores are only useful once they are mapped to observed accuracy on labelled data; the right threshold is wherever accuracy really meets the target, per field. Prompting for conservative scores leaves them uncalibrated, and a second uncalibrated scorer gives no ground truth either. Dropping scores throws away a signal that calibration could make usable.

*Hint if stuck: Ask what would have to be true of a score before it can safely gate auto-approval.*
</details>

---

## Question 41
A platform team exposes a rotate_db_credentials tool to two Agent SDK assistants built as separate loops: a CLI helper and a chat-ops bot. The team added code to the CLI helper's loop that blocks the tool until the requester's on-call status is confirmed with check_oncall. A month later, an audit finds rotations by engineers who were not on call, all coming through the chat-ops bot. What is the right fix?

A) Copy the same gating code into the chat-ops bot's loop so that both loops apply the same check before calling the rotation tool
B) Add the on-call requirement to the chat-ops bot's system prompt, since chat requests are slower and give the model more time to follow it carefully
C) Route rotation requests from chat to the CLI helper so that the loop that already has the gate performs credential rotations
D) Move the check into the rotate_db_credentials service itself, so every caller, from any assistant, must present a confirmed on-call requester

<details>
<summary>Answer & explanation</summary>

**D)** Enforcement belongs at the point every path must pass through, which is the tool or service itself, so new or forgotten callers cannot bypass it. Copying the code into each loop works until the next assistant is added, a prompt rule is not enforcement, and rerouting chat requests to the CLI helper changes the product to work around a misplaced check.

*Hint if stuck: Picture a third assistant being added next quarter. Which fix would still hold without anyone having to remember anything?*
</details>

---

## Question 42
A developer-productivity agent is asked where the PAYMENT_TIMEOUT_MS environment variable is consumed in a 900-file Node service. It starts reading src/ file by file, and after 45 full-file reads the session is near its context limit with no answer yet. Which change to the agent's approach fixes this?

A) Have the agent summarize each file after reading it and then discard the raw contents from its notes
B) Raise the session's context budget so the agent can finish reading every file under src/
C) Grep for PAYMENT_TIMEOUT_MS to get the exact files and lines, then Read just those locations
D) Use Glob to list files whose names contain config or env, and Read those files before any others

<details>
<summary>Answer & explanation</summary>

**C)** A single Grep for the variable name returns the exact files and line numbers, so the agent reads a few targeted regions instead of the whole tree. Summarizing after each read still pays the cost of reading everything, and a bigger budget only delays the same waste. Guessing by file names with Glob misses consumers that live in ordinary service files.

*Hint if stuck: The cheapest way to find a known identifier is to search for it, not to read toward it.*
</details>

---

## Question 43
A team defines a read-only code-explorer subagent in .claude/agents/explorer.md with disallowedTools: Write and no tools field. During one investigation it changed a config value in an existing file, and later it rewrote a test fixture by running a shell command. Which statements explain how it could still change files? (Choose two.)

A) Denying Write blocks the creation of new files, so it was not meant to cover changes to existing ones
B) Edit is a separate tool from Write, so denying Write leaves in-place edits of existing files available
C) Bash is still inherited, and shell commands such as sed -i or output redirects can rewrite any file
D) disallowedTools is applied when the subagent is invoked by name, but not when Claude delegates to it
E) A subagent always runs with the main session's full tool list, so its disallowedTools list is ignored

<details>
<summary>Answer & explanation</summary>

**B, C** With no tools field the subagent inherits every tool available, and disallowedTools removes only the names it lists. Edit is its own tool, so in-place edits survive; Bash is still there, and shell commands can modify files. A read-only explorer should list its tools (for example Read, Grep, Glob) or disallow Write, Edit and Bash. disallowedTools applies however the subagent is invoked, and it does narrow the inherited list. Write also overwrites existing files, so denying it removes more than file creation.

*Hint if stuck: Work out which tools the subagent ends up holding, not only which one it lost.*
</details>

---

## Question 44
A research coordinator asks five subagents to survey the literature on grid-scale battery recycling. Each subagent returns its full working notes, roughly 15,000 tokens each, and by the synthesis step the coordinator misses findings buried in the middle of its context. Which change addresses the root cause?

A) Have the coordinator run its synthesis twice and merge the two drafts, so that findings missed in the first pass are likely to appear in the second
B) Move the coordinator to a larger context window model so that all five sets of working notes fit with plenty of room to spare for the synthesis
C) Tell the coordinator in its system prompt to read every subagent's notes carefully from start to finish before it begins writing the synthesis
D) Require each subagent to return a condensed, structured findings list with claims and sources rather than its raw working notes

<details>
<summary>Answer & explanation</summary>

**D)** The value of subagents is that exploration noise stays in their contexts; returning raw notes defeats that and floods the coordinator. Condensed, structured findings give the coordinator less to read and nothing to lose. A bigger window or a stronger instruction leaves the same flood in place, and running synthesis twice spends more tokens without fixing why findings get missed.

*Hint if stuck: What crosses the boundary between subagent and coordinator?*
</details>

---

## Question 45
Your CI pipeline runs claude -p to review every PR in a 40-developer monorepo. The review prompt includes the line 'be careful not to flag things that are not real problems,' yet PRs still average 12 comments each, mostly style nitpicks the linter already enforces. What is the most effective prompt change?

A) Lower the sampling temperature so the model generates fewer speculative findings and sticks to obvious problems
B) Strengthen the existing instruction to say the model should be very careful and only report issues it is extremely confident are real bugs worth a reviewer's time
C) Replace the vague caution with explicit flag and skip criteria: enumerate the defect types to report and state that linter-covered style issues are skipped
D) Add a hard cap of five comments per PR so the volume of nitpicks stays manageable for reviewers

<details>
<summary>Answer & explanation</summary>

**C)** Vague cautions like 'be careful' give the model no operational definition of a real problem, so they fail at scale; explicit flag and skip criteria provide a checkable decision rule. Confidence-based phrasing is the same vagueness restated, temperature changes randomness rather than the decision rule, and a comment cap hides noise without improving precision.

*Hint if stuck: Ask what the model would need in order to tell a nitpick from a defect on its own.*
</details>

---

## Question 46
A developer productivity agent audits dependencies and flags every package that is not on its latest version as a "risk." Its weekly report lists 600 packages, and engineers ignore it. The security team wants only packages with a known CVE or on an end-of-life major version. What change fixes the report?

A) Tell the agent to flag the most outdated packages and to ignore packages that are a little behind
B) Ask the agent to rank the 600 packages by its own estimate of risk and report the top fifty of them in each weekly report
C) Report only packages with a known CVE or on an end-of-life major version, and state that version lag alone is not a risk
D) Run the audit monthly instead of weekly so the report is reviewed less often and with more attention

<details>
<summary>Answer & explanation</summary>

**C)** The security team's criteria are precise, so writing them into the prompt, and saying version lag alone does not count, aligns the report with what they act on. A top-fifty cut by estimated risk can still miss a CVE, "most outdated" is a different and vaguer rule, and running less often does not change what is flagged.

*Hint if stuck: Report what the readers act on, defined in their terms.*
</details>

---

## Question 47
A developer asks Claude to work out why the team's build time doubled over the past month. The repository has 300 packages and a custom build graph. Which first step gives the investigation the best chance of finding the cause efficiently?

A) Ask Claude to read the build configuration of every package in alphabetical order and report anything unusual that it notices
B) Ask Claude to map the build graph and measure where the time now goes, then plan deeper investigation of the highest-cost areas
C) Ask Claude to propose the ten most common causes of slow builds and then check each of them one at a time against the repository
D) Ask Claude to revert the last month of build-related commits one at a time until the build time returns to what it was before

<details>
<summary>Answer & explanation</summary>

**B)** Open-ended diagnosis starts by mapping the system and finding where impact is concentrated, then planning from there. Reading every package spends equal effort everywhere, a checklist of common causes is a fixed plan built on guesses, and reverting commits one by one is slow and ignores what the data would show.

*Hint if stuck: Before guessing at causes, ask what data would point you to the right part of a 300-package build.*
</details>

---

## Question 48
A team must rename the log field user_id to account_id in 60 files. The change is purely mechanical: an exact string in logger calls, no behaviour change, and a test suite that checks log output. A lead insists on plan mode because 'anything over 20 files needs a plan'. What is the better call?

A) Use plan mode as the lead says, since the number of files touched is what decides the mode
B) Run it as direct execution with clear instructions and confirm it with the existing log tests
C) Use plan mode, then approve each of the 60 file edits manually so that nothing slips through
D) Split it into six sessions of ten files each so that every session stays below the threshold

<details>
<summary>Answer & explanation</summary>

**B)** File count is a proxy; what plan mode is for is architectural or multi-approach work. A fully specified mechanical rename has one approach and a test suite to verify it, so direct execution is right. Plan mode, with or without manual per-edit approval, adds review where there is nothing to decide, and splitting into batches only games an arbitrary threshold.

*Hint if stuck: Are there decisions to review here, or just a lot of identical edits?*
</details>

---

## Question 49
A developer-tools team notices that their in-IDE assistant, which explains a selected code block when a developer presses a hotkey, is their largest cost line. A manager proposes moving those requests to the Message Batches API to halve the cost. What should the architect say?

A) Agree, as long as the IDE plugin polls frequently enough that most explanations still arrive within a few seconds
B) Disagree: a developer is waiting on each explanation, and batches give no latency guarantee, so it must stay synchronous
C) Agree, and add a loading spinner so that developers understand that explanations can take a little longer to arrive from the API
D) Agree, but limit it to explanations of very large code blocks, since those are the most expensive individual requests

<details>
<summary>Answer & explanation</summary>

**B)** Interactive requests with a person waiting must stay synchronous, because batches can take up to 24 hours with no latency guarantee. Frequent polling does not speed up processing, large blocks still have a developer waiting on them, and a spinner cannot hide a delay that might be hours long.

*Hint if stuck: Discounts that come with no promise about timing only fit work nobody is watching.*
</details>

---

## Question 50
A document-extraction team runs a /reextract skill against a vendor and a billing month, for example /reextract acme 2026-08. The skill body says 'reprocess the vendor and month the user mentioned', and Claude sometimes swaps the two values or asks which vendor was meant. How should the skill be written?

A) Add more example invocations to the description so that Claude learns which value is meant to come first
B) Have the skill ask Claude to confirm the vendor and month back to the user before it starts reprocessing
C) Declare named arguments such as vendor and month in the frontmatter and reference $vendor and $month in the body
D) Remove the arguments entirely and have the skill read the vendor and month from a shared config file each time instead

<details>
<summary>Answer & explanation</summary>

**C)** Named arguments (or indexed placeholders such as $0 and $1) substitute the exact values typed after the command into the body, so the skill no longer depends on Claude interpreting free text. More examples in the description and a confirmation step both leave the mapping to interpretation and add friction. A config file breaks the one-line invocation the team actually wants.

*Hint if stuck: Let the command line fill the values in, instead of letting Claude infer them.*
</details>

---

## Question 51
A research coordinator asks a subagent to search a medical database. The database credentials have expired, every query fails, and the subagent's wrapper catches the exceptions and returns {"results": []}. The final report states that 'no peer-reviewed studies exist on this intervention.' What is the root-cause fix?

A) Tell the synthesis subagent to word any no-results finding cautiously, saying that studies may exist but were not found, in every report it writes
B) Have the coordinator re-run any search that returns zero results a second time, to rule out a transient fault before it accepts an empty result set
C) Add a weekly job that checks the database credentials and alerts the operations team when they are close to their expiry date or have expired
D) Make the subagent return an access failure as a structured error, distinct from a valid empty result, so the coordinator can report a coverage gap

<details>
<summary>Answer & explanation</summary>

**D)** The wrapper turns an access failure into what looks like a successful search with no results, so the coordinator draws a false conclusion. Errors and genuine empty results must be distinguishable: the failure should come back as a structured error the coordinator can act on and disclose. Cautious wording hides real absence and real failure alike, re-running a search fails the same way with expired credentials, and credential monitoring is good hygiene but does not stop the next failure being masked.

*Hint if stuck: Trace where the false conclusion first entered the pipeline.*
</details>

---

## Question 52
A research-platform repo has a 700-line root CLAUDE.md: build commands and commit conventions, then long sections on the React dashboard (web/**), the Python crawler (crawler/**) and Terraform (infra/**). Adherence has dropped. A lead proposes moving each section into its own file and pulling them into CLAUDE.md with @imports. Which plan reduces context use and improves focus?

A) Adopt the @imports proposal, because splitting the content into separate files shrinks the context
B) Keep the file whole but put the most important instructions in bold so they stand out while reading
C) Keep shared items in CLAUDE.md and move each area's section into a rule scoped to its paths
D) Move all four sections, including build commands, into path-scoped rules so nothing loads by default

<details>
<summary>Answer & explanation</summary>

**C)** Universal facts stay in CLAUDE.md, while area-specific guidance moves into path-scoped rules that load only when Claude works in that area. Imported files load together with CLAUDE.md, so the proposal reorganises without reducing context. Bold text does not cut size, and scoping the build commands too would hide the facts every session needs.

*Hint if stuck: Decide, section by section, whether the content is universal or tied to an area of the repo.*
</details>

---

## Question 53
An extraction agent submits each extracted record through a save_record tool. When the downstream API rejects a record, the tool returns isError with 'Save failed (422).' The agent re-extracts the whole document from scratch and often hits the same rejection. The API's response body lists the exact fields that failed and why. What should change?

A) Return the field-level details in the error, such as invoice_date must be YYYY-MM-DD, marked as a validation error, so the agent fixes just those fields
B) Have save_record retry the same payload up to five times with backoff, since 422 responses are often caused by short-lived load on the downstream API under heavy traffic
C) Have save_record drop any fields that fail validation and save the rest of the record, logging the dropped fields so they can be reviewed later
D) Raise the model's effort level for the extraction step, so its first extraction is more careful and fewer records are rejected by the downstream API

<details>
<summary>Answer & explanation</summary>

**A)** The information needed to recover already exists in the API response; the tool discards it. Passing back which fields failed and why, categorised as a validation error, lets the agent correct those fields instead of starting over. Retrying an unchanged payload cannot fix a validation failure, silently dropping fields saves incomplete records as if they were correct, and more effort on extraction does not tell the model what was wrong.

*Hint if stuck: The downstream system already said what is wrong; ask whether the agent ever hears it.*
</details>

---

## Question 54
An internal IT agent onboards new hires by creating accounts in four systems in sequence: directory, email, payroll, then badge access. When payroll's API times out, the agent retries from the start on the next run and creates duplicate directory and email accounts; when it eventually escalates, IT staff cannot tell which systems are done. What should the workflow do?

A) Have the agent re-check the four systems from scratch at the start of each run and work out for itself which accounts already exist and which are missing
B) Wrap the four steps in a single long tool call so that the four accounts are created together or none of them are created
C) Persist each step's completion in workflow state, resume from the first incomplete step, and include done and pending steps in any escalation
D) Add a system-prompt rule telling the agent not to repeat a step it has already completed earlier for the same new hire

<details>
<summary>Answer & explanation</summary>

**C)** A multi-step workflow needs durable, code-held state for each step so it can resume where it stopped and so a human handoff can say exactly what is done and what is not. Having the model re-check all systems each run is slower and depends on its inference. A single all-or-nothing call is rarely possible across four independent systems, and a prompt rule cannot stop duplicates the model does not know about.

*Hint if stuck: After a timeout, ask what the system itself can tell you about how far the onboarding got.*
</details>

---

## Question 55
A CI job runs Claude Code to review each pull request. At first the job hung until it timed out because Claude Code opened its interactive interface on the runner; once that was worked around, the step that posts comments failed because it received free-form prose instead of the findings object it parses. Which changes fix the job? (Choose two.)

A) Add --verbose so Claude Code logs each step and the CI runner can tell when the review has finished
B) Add "reply only in valid JSON" to the project CLAUDE.md so that the review comes back in a parseable form
C) Run Claude Code with -p so it handles the prompt non-interactively and exits once the review is done
D) Add --output-format json with --json-schema and read the findings from the structured_output field
E) Pass --continue on each run so the job reuses the previous review session instead of opening a new one

<details>
<summary>Answer & explanation</summary>

**C, D** -p (--print) runs Claude Code non-interactively and exits when done, which is what a CI step needs. --output-format json with --json-schema returns schema-conforming output in structured_output (the schema flag works only with -p). An instruction in CLAUDE.md asks for JSON but does not guarantee it. --continue carries an earlier PR's review into the next one and does nothing about interactivity. --verbose adds logging but does not stop the interactive interface.

*Hint if stuck: One failure is about how the process runs; the other is about whether the output's shape is guaranteed or merely requested.*
</details>

---

## Question 56
A document pipeline handles leases, invoices and NDAs, each with its own extraction schema. Today one prompt contains all three schemas and asks the model to pick the right one and extract. About 6% of documents are extracted against the wrong schema, which corrupts downstream records. What design best fixes this?

A) Run a separate classification step first, then have code choose the schema for that type and run extraction with only that schema
B) Ask the model to state the document type on the first line of its output before extracting, then extract in the same response
C) Add more examples of each document type to the combined prompt so the model gets better at choosing the matching schema on its own
D) Lower the temperature to zero so that the model picks the same schema consistently for documents that look alike to each other

<details>
<summary>Answer & explanation</summary>

**A)** Breaking the task into a classification step and an extraction step, with code routing between them, makes each step simpler and lets the routing be deterministic. More examples and stating the type first still leave schema choice and extraction tangled in one call. Temperature zero makes the choice consistent, not correct.

*Hint if stuck: Ask whether choosing the schema and filling it in need to happen in the same model call.*
</details>

---

## Question 57
An airline's support agent decides whether to escalate to a human. Clear cases are handled well, but borderline ones, like a furious customer whose problem is a simple seat change, or a calm customer describing a possible safety issue, flip between outcomes on reruns. The prompt already has two examples, both of obvious escalations. What should the architect change?

A) Replace the two obvious examples with borderline cases like these, each showing the decision and a sentence on why it beats the other choice
B) Add a numeric sentiment threshold to the prompt so that any customer scoring above it on anger is escalated automatically regardless of the issue
C) Add many more examples of obvious escalations so that the model has a larger sample from which to infer where the boundary lies
D) Instruct the model to escalate whenever it is uncertain, since an unnecessary escalation is cheaper than a mishandled case

<details>
<summary>Answer & explanation</summary>

**A)** Examples teach judgment best when they sit on the decision boundary and explain why one choice wins; obvious cases give the model nothing to learn about the hard calls. A sentiment threshold encodes exactly the wrong signal for the angry seat-change case, more obvious examples still never touch the boundary, and escalating on uncertainty floods humans because the model's uncertainty is not well calibrated.

*Hint if stuck: The examples you choose should sit where the model is actually confused.*
</details>

---

## Question 58
A team uses a fixed prompt chain for routine support tasks such as address changes. A product manager wants to use the same fixed chain (look up order, check policy, apply change, confirm) for complaints about unexplained account charges, which often turn out to involve fraud, family-member purchases or bank errors. What should the architect advise?

A) Use the fixed chain for both, since one consistent workflow across support tickets makes the system easier to test and maintain
B) Extend the fixed chain with steps for fraud, family purchases and bank errors so that each charge complaint passes through each of them
C) Keep the fixed chain for address changes but handle charge investigations adaptively, letting each finding decide the next step
D) Send charge complaints straight to human agents, since a model cannot handle cases that do not follow a predictable pattern

<details>
<summary>Answer & explanation</summary>

**C)** Fixed chains suit predictable tasks; charge investigations branch on what is found, so they need adaptive decomposition. A single chain forces open-ended cases down a path that does not fit, running every possible branch on every complaint wastes effort and still misses new causes, and handing all such cases to humans gives up work the agent can do.

*Hint if stuck: Match the decomposition style to how predictable the task is.*
</details>

---

## Question 59
A support agent's session for a customer was paused while a human supervisor approved a goodwill credit outside the agent's authority. The customer writes back the next morning. The supervisor's action happened in the billing system, not in the agent's conversation. How should the system continue the case?

A) Resume the customer's session and inject a note stating that the supervisor approved and applied the credit, with its amount
B) Start a new session with no history, so that the agent's old pending-approval reasoning cannot confuse it about whether the credit was applied
C) Fork the customer's session so that the original stays unchanged while the fork handles the customer's new message
D) Resume the customer's session as it was, since the agent can work out what happened from the customer's new message

<details>
<summary>Answer & explanation</summary>

**A)** Resuming keeps the case context, and the agent must be told explicitly about the state change that happened outside its conversation. Relying on the customer's message leaves the agent with an outdated pending view, a fresh session loses the case history, and forking adds a second branch without telling either one about the credit.

*Hint if stuck: Changes made outside the conversation are invisible to it unless you report them.*
</details>

---

## Question 60
A team inherits a 2,000-line pricing module with no tests and wants Claude to break it into smaller functions. Nobody fully understands the current behavior, but it is correct in production and must not change. What should they do before asking Claude to refactor?

A) Ask Claude to read the module closely and write a detailed prose summary of its behavior to compare against once the refactor is done
B) Ask Claude to add detailed comments throughout the module so the refactored version can follow the same logic
C) Refactor in one pass and rely on the staging environment to reveal any behavior that changed along the way
D) Have Claude write characterization tests that capture current outputs for representative inputs, then refactor until they pass

<details>
<summary>Answer & explanation</summary>

**D)** Characterization tests turn today's behavior into a pass/fail check, so Claude can refactor and verify that nothing changed. A prose summary or comments cannot be run, so they still leave a human comparing behavior by hand, and relying on staging finds regressions late and only for the paths that happen to be exercised.

*Hint if stuck: Lock in current behavior as something runnable before changing the structure.*
</details>

---

## Answer key (no peeking until scored)

1:B 2:D 3:B 4:B 5:A,E 6:C,D 7:A 8:D 9:B 10:C 11:D 12:A 13:D 14:B,C 15:C 16:D 17:A 18:C 19:B 20:A 21:D 22:B,E 23:D 24:C 25:C 26:A 27:C 28:B,E 29:A 30:D 31:A 32:B 33:C,E 34:C 35:A 36:C 37:D 38:B 39:A 40:D 41:D 42:C 43:B,C 44:D 45:C 46:C 47:B 48:B 49:B 50:C 51:D 52:C 53:A 54:C 55:C,D 56:A 57:A 58:C 59:A 60:D
