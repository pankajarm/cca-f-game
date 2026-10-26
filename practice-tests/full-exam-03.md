# Full Practice Exam 03 — CCAR-F simulation

Same format as the real exam guide: **60 questions, 120 minutes, scaled score out of 1000,
pass at 720.** Domain weighting: D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.
No question here appears in the other 2 printable exams.

Set a timer. No notes, no docs. For the interactive version with the clock, flags, and a score report, open the game.

---

## Question 1
A billing-support service runs Claude through the Agent SDK with nobody watching a terminal. Goodwill credits above $150 need sign-off from a team lead, which can take hours. The team wants Claude to stop at the issue_credit call, show the request in the service's own approvals queue, and carry on from that exact call once the lead decides. Which mechanism fits?

A) A PreToolUse hook that returns permissionDecision "defer" for large credits, then resuming the session once the lead has decided
B) A PreToolUse hook that returns "ask" for large credits, so that the approval prompt is shown to the lead in the terminal running the service
C) A PreToolUse hook that sleeps and polls the approvals queue until the lead answers, holding the tool call open for as long as it takes
D) A system-prompt rule telling Claude to end its turn and wait for the lead whenever a credit above $150 comes up in a conversation

<details>
<summary>Answer & explanation</summary>

**A)** Returning defer ends the turn with stop_reason tool_deferred and leaves the pending call in the transcript; the app reads deferred_tool_use, shows it in its own queue, and resumes the session, when the hook fires again and returns allow or deny. (It applies when Claude makes a single tool call in that turn.) ask needs someone to answer an in-process permission prompt, which a headless service lacks. A hook that blocks for hours ties up the run, and a prompt rule cannot hold a tool call open.

*Hint if stuck: No one is around to respond to a prompt inside this process; think about stopping cleanly and coming back later to the same pending call.*
</details>

---

## Question 2
An insurance-claims extraction agent calls an OCR tool that fails about 5% of the time with a transient service error. Each failure goes back to the model, which spends a turn reasoning about it and re-calling the tool; on long claim files this pushes runs over their turn budget. What is the best design change?

A) Put bounded retries with backoff for transient errors inside the tool wrapper, and surface a structured error to the model once those retries are exhausted
B) Add a system-prompt instruction telling the model to re-call the OCR tool immediately on failure without writing out any reasoning about it
C) Switch the OCR tool to return an empty page on failure, so the agent continues with the remaining pages and the run finishes within budget
D) Raise the agent's turn budget so that runs have enough headroom to absorb several transient OCR failures on even the longest claim files

<details>
<summary>Answer & explanation</summary>

**A)** Transient errors that are fixed by simply trying again should be handled deterministically in the tool layer, not by spending model turns. Bounded retries keep the run efficient, and a structured error still reaches the model if the service is really down. A bigger turn budget pays for the waste instead of removing it, a prompt instruction still costs a turn each time, and returning an empty page makes missing text look like a blank page.

*Hint if stuck: Ask whether a model turn is needed to decide to try again.*
</details>

---

## Question 3
A developer watches Claude Code start rewriting a date utility. Two edits in, she sees it has taken the wrong approach: it is converting everything to local time, but the module must stay in UTC. She wants to stop it right away and also undo the two edits already made, without losing the earlier part of the conversation. What should she do?

A) Run /clear to wipe the session, then retype the task with a note that the module must stay in UTC
B) Let it finish the task, then ask Claude in a new message to convert every function back to UTC
C) Run /compact so the wrong approach is summarised away, then restate the UTC requirement after it
D) Press Esc to stop it, then use /rewind to restore the code to the checkpoint before the edits

<details>
<summary>Answer & explanation</summary>

**D)** Esc stops Claude mid-action with context preserved, and Esc twice or /rewind opens the rewind menu, which can restore code, conversation or both to an earlier checkpoint; Claude snapshots files before each edit made with its editing tools. /clear throws away the useful earlier conversation and leaves the edits on disk. Letting it finish wastes work and piles more wrong edits on top, and /compact condenses history without undoing any file change.

*Hint if stuck: Weigh how early each choice stops the wrong work, and what it does to the files and to the conversation.*
</details>

---

## Question 4
An invoice-extraction pipeline outputs a confidence score for every field, and the team wants to auto-accept fields scoring 0.90 or higher without human review. Before setting that threshold, the architect wants evidence that the scores mean what they say. What check gives that evidence?

A) Check that the average confidence across all fields is close to the dashboard's overall accuracy figure
B) On a labelled set, bucket each field's scores and compare each bucket's observed accuracy to its score
C) Ask the model to explain each high-confidence field and accept the threshold if the reasons read as sound
D) Track the share of fields scoring 0.90 or higher each week and treat a stable share as proof of calibration

<details>
<summary>Answer & explanation</summary>

**B)** Calibration means stated confidence matches observed accuracy, so it has to be measured against labelled ground truth, per field and per confidence band: fields scored 0.9 and above should actually be right at least that often before auto-accepting them. Matching averages can hide bands or fields that are badly over-confident. Plausible-sounding explanations do not measure correctness. A stable share of high scores says nothing about whether those fields are right.

*Hint if stuck: Calibration is a claim about how often something is right; ask what you need in order to count that.*
</details>

---

## Question 5
An invoice pipeline sends a raw JSON schema through structured outputs. To stop impossible values, an engineer adds minimum: 0 to every amount field and maxLength: 20 to invoice_number. The next deploy fails on every request with a 400 error about the schema. How should those limits be enforced?

A) Leave the unsupported keywords out of the sent schema and check those limits in code on the response
B) Swap minimum for exclusiveMinimum and maxLength for minLength, which the decoder fully supports
C) Send the same schema as a tool with strict: true instead, since strict tool use enforces bounds
D) Wrap each bounded field in anyOf with a null branch, which makes the API skip constraint checks

<details>
<summary>Answer & explanation</summary>

**A)** Structured outputs do not support numerical constraints such as minimum, maximum and multipleOf, or string constraints such as minLength and maxLength, and using them returns a 400. Strict tool use shares the same limitations, so moving the schema into a tool changes nothing. The fix is to send the schema without those keywords and validate the limits in code; the SDK helpers do this for you by stripping them, noting them in the field description and checking the response. exclusiveMinimum and minLength are unsupported too, and anyOf does not switch validation off.

*Hint if stuck: Check which parts of JSON Schema the constrained decoder actually understands.*
</details>

---

## Question 6
On multi-hour research jobs, the coordinator's context grows past its limit and older turns are trimmed, after which it re-plans from scratch and re-delegates topics that subagents already covered. Most of that context is taken up by subagent returns, which include every page they read and every query they tried. Which changes should the team make? (Choose two.)

A) Run the subagents one after another so that fewer of their returns sit in the coordinator's context
B) Ask subagents to return condensed findings with source references, leaving their working notes out
C) Store every subagent return in the coordinator's system prompt, where trimming of older turns can't reach
D) Have the coordinator save its research plan to external memory and read it back once context is trimmed
E) Give each subagent the coordinator's full conversation so that the plan travels along with the work

<details>
<summary>Answer & explanation</summary>

**B, D** Writing the plan to external memory lets the coordinator recover it after trimming instead of starting over, and condensed returns with references keep the coordinator's context from filling with raw working material in the first place. Handing subagents the coordinator's whole conversation bloats their context and does nothing for the coordinator's. Running subagents in sequence changes timing, not how much each return adds. Moving returns into the system prompt still spends the same context window, just in a different place.

*Hint if stuck: What must survive when the lead agent loses older turns, and what should never have filled its window?*
</details>

---

## Question 7
Despite a project CLAUDE.md rule saying never delete anything under fixtures/golden, a headless claude -p run in CI executed rm -rf on that directory last Tuesday, breaking 30 snapshot tests. The team needs a guarantee this cannot recur. What should they add?

A) A deny rule in settings.json permissions matching destructive Bash patterns on fixtures/golden
B) A rewritten warning at the very top of CLAUDE.md using stronger and more explicit language
C) A PostToolUse hook that detects deletions under fixtures/golden and pages the on-call engineer
D) A plan-mode requirement so destructive steps in the pipeline wait for human approval first

<details>
<summary>Answer & explanation</summary>

**A)** CLAUDE.md instructions are probabilistic, so no rewording produces a guarantee; settings.json deny rules are deterministic — the harness refuses matching calls outright, including in headless runs. The PostToolUse hook fires after the files are already gone, and pausing a headless CI run for human approval defeats the purpose of running headless.

*Hint if stuck: Ask which mechanism stops the command before it runs instead of asking nicely or reacting afterwards.*
</details>

---

## Question 8
Claims reviewers can check 400 of the 3,000 extractions the pipeline produces each day, and today they take them in arrival order. Each extraction carries calibrated field confidence and the results of consistency checks, such as line items that do not sum to the total or a loss date before the policy start. How should the review queue be built?

A) Keep arrival order so each document has the same chance of review, and add reviewers when budget allows
B) Send reviewers the highest-value claims first, since dollar amount is the clearest sign of where errors matter
C) Spread the 400 reviews evenly across document types so each type gets the same number of checks per day
D) Put items with failed consistency checks or low calibrated confidence first, ordered by the payout at stake

<details>
<summary>Answer & explanation</summary>

**D)** Scarce review time should go where errors are most likely and most costly: internal contradictions and low calibrated confidence are the strongest error signals, and the amount at stake breaks ties, the same idea as routing by risk level. Arrival order spends most reviews on items that are probably fine. Value alone sends clean high-value claims to humans while contradictory low-value ones pass. Even spreading across types is a measurement design; a small stratified random sample should run alongside to estimate error rates, but it is not how to triage which risky items get checked.

*Hint if stuck: Ask which signals say an item is likely wrong, and which say it matters if it is.*
</details>

---

## Question 9
An Agent SDK assistant for engineers connects MCP servers for GitHub, Jira, PagerDuty and an internal deploy system, about 220 tools in all, with tool search on (the default). Many tools have names like query, get and list_items, with one-line descriptions such as "Query data". Traces show the agent's tool searches often come back without the tool it needed, so it falls back to Bash and curl. Which changes make the right tools easier to find? (Choose two.)

A) Deny Bash in disallowedTools so the agent has to keep searching the catalog until it finds an MCP tool
B) Give tools specific names and keyword-rich descriptions, e.g. search_jira_issues: by project, status, date
C) Set ENABLE_TOOL_SEARCH to false so that each of the 220 tool definitions is loaded into context on each turn
D) Shorten each tool description to a few words so the catalog summary that the agent receives stays small
E) Add a system prompt section that lists the tool categories available, such as Jira, PagerDuty and deploys

<details>
<summary>Answer & explanation</summary>

**B, E** Tool search matches the agent's query against tool names and descriptions, so specific names and descriptions with the words users actually use surface for more requests than query or "Query data". A system prompt section listing the categories tells the agent what kinds of tools exist to search for. Loading all 220 definitions on every turn costs a large share of context, and selection accuracy degrades well before that many tools. Shorter descriptions give the search even less to match. Removing Bash doesn't make the search any better at finding the right tool.

*Hint if stuck: Ask how the agent decides what to search for, and what its search can match against.*
</details>

---

## Question 10
A healthcare intake startup has one Claude Code session generate a FHIR message parser and then, in the same session, asks "now review the code you just wrote for bugs." The review comes back clean, yet a null-handling defect ships to staging that week. What is the architectural flaw?

A) The reviewer shares the generator's context, so it inherits and re-confirms the same reasoning that produced the bug
B) The review prompt was too gentle; it should have demanded "be extremely critical and assume bugs exist"
C) The session ran low on context window before the review, so the code was only partially re-read
D) The generation step used too small a thinking budget, leaving the review without reasoning depth

<details>
<summary>Answer & explanation</summary>

**A)** Same-session self-review keeps the entire generation rationale in context, so the model tends to confirm its own earlier decisions rather than challenge them. The fix is a separate reviewer session that sees only the code, not the reasoning behind it. Harsher prompt wording does not remove the bias because the original justifications are still sitting in the reviewer's context, and neither context exhaustion nor thinking budget explains why a clean-looking review systematically misses the generator's own mistakes.

*Hint if stuck: Ask what the review step already believed about the code before it started reading.*
</details>

---

## Question 11
A support system routes conversations to billing, returns, and account subagents. Roughly 15% of conversations in every specialty need a human handoff, but only the coordinator holds escalate_to_human, so each specialist must return control, and the coordinator often escalates with a thin summary that loses the specialist's findings. What is the best change?

A) Have each specialist return its full conversation transcript to the coordinator so it can write a richer escalation summary
B) Merge the three specialists into one agent that holds the billing, returns, account, and escalation tools together
C) Give each specialist a small escalate_to_human tool with a structured summary schema, keeping other cross-role tools off
D) Add an escalation subagent that the coordinator invokes, which re-interviews the customer before passing the case on

<details>
<summary>Answer & explanation</summary>

**C)** Escalation is a frequent need shared by every role, which is exactly when a small cross-role tool belongs on each specialist; the agent with the findings writes the structured handoff. Passing full transcripts bloats the coordinator and still relies on it to summarise well. Merging roles recreates the oversized toolset, and re-interviewing the customer adds latency and frustration without preserving the specialist's work.

*Hint if stuck: Ask which agent holds the knowledge the handoff needs, and how common that need is across roles.*
</details>

---

## Question 12
An on-call engineer asks Claude Code why a nightly batch failed. The job's log is a 90 MB, 1.2-million-line text file. The agent reads the first few thousand lines, sees nothing alarming, and concludes the log shows no errors. What should the agent do?

A) Ask the engineer to delete the older half of the log so the remaining file fits in one Read call
B) Read the file repeatedly with increasing offsets until it has paged through all 1.2 million lines of the log
C) Grep the log for ERROR or Exception with a few context lines, then Read just the ranges around the hits
D) Accept the partial view as representative, since batch failures are usually logged near startup

<details>
<summary>Answer & explanation</summary>

**C)** A pattern search locates the failure lines anywhere in the file, and targeted Reads with offset and limit pull in only the surrounding context. Paging through the entire log spends enormous context on irrelevant lines. Deleting data to make a tool fit is destructive, and treating a partial view as complete is exactly the mistake that produced the wrong conclusion.

*Hint if stuck: When a file is too big to read, search it to find where to look.*
</details>

---

## Question 13
A support platform uses the Agent SDK in TypeScript. Each incoming customer message calls `query()` with `continue: true` so the agent remembers the conversation. With many customers chatting at once, agents have begun referencing other customers' orders. What change fixes the root cause?

A) Capture each conversation's session_id from the result message, store it per customer, and pass it to `resume` on later turns
B) Add a system-prompt instruction telling the agent to ignore any earlier messages that mention a different customer
C) Switch to `forkSession: true` on every call so that each customer message starts from a clean copy of the shared history
D) Turn off session persistence entirely so that every customer message is answered on its own, without any earlier conversation context

<details>
<summary>Answer & explanation</summary>

**A)** `continue` picks up the most recent session in the directory, which is the wrong session in a multi-user app; resuming by a stored per-customer session ID is what the docs recommend. A prompt instruction cannot undo context that should never have been loaded, forking from the shared session still copies the mixed history, and disabling persistence loses each customer's own context.

*Hint if stuck: How does each option decide which past conversation to load?*
</details>

---

## Question 14
An engineering lead proposes replacing a three-step prompt chain that classifies, summarises and tags incoming bug reports with a multi-agent orchestrator plus five specialist subagents. The current chain is accurate on 97% of reports and the failures are mostly malformed inputs. What is the most sensible response?

A) Keep the chain and fix the malformed-input cases directly, adding complexity only if evaluation shows a simpler design falling short
B) Adopt the orchestrator, since multi-agent designs are more capable and the remaining failures will likely disappear with them
C) Run the orchestrator alongside the chain permanently and publish whichever of the two outputs has the higher model confidence
D) Collapse the chain into one prompt, since fewer steps is simpler and simpler is the better architectural choice in general

<details>
<summary>Answer & explanation</summary>

**A)** Anthropic's guidance is to use the simplest design that works and add complexity only when it demonstrably improves outcomes; the remaining errors come from inputs, not from the decomposition. A multi-agent rebuild adds cost and failure modes for no evidenced gain, running both permanently doubles cost, and collapsing the chain discards a structure that is already working.

*Hint if stuck: Fix the failures you actually see before redesigning what already works.*
</details>

---

## Question 15
A team runs Claude Code in CI to review pull requests for security issues. The review prompt tells Claude to run the team's static security scanner first and use its findings, but on about a fifth of PRs Claude reviews without running it, and those reviews miss issues the scanner would have caught. What is the most reliable fix?

A) Run the scanner as a fixed pipeline step before invoking Claude, and pass its findings into the review prompt as input
B) Move the scanner instruction to the top of the review prompt and add an example review that starts by calling the scanner
C) Add a second Claude review stage that reads the first review and runs the scanner if the first stage did not run it
D) Ask Claude to end every review with a line confirming whether it ran the scanner, and fail the job when the line is missing

<details>
<summary>Answer & explanation</summary>

**A)** A step that must happen on every PR, in the same order, can simply be run by the pipeline before the model is involved, so the review always has the scanner's output. Prompt placement and examples remain probabilistic, a second review stage adds cost and still depends on a model noticing, and a self-reported confirmation line can be present even when the scan was skipped.

*Hint if stuck: If the step never varies, does the model need to be the one deciding to run it?*
</details>

---

## Question 16
A data team uses Claude to split free-text mailing addresses into street, unit, city and postcode fields. Units come back wrong for inputs like "Flat 3B, 12 High St" and "12 High St #4", and adding a sentence about "handling apartment numbers correctly" to the prompt changed nothing. What is the most effective next refinement?

A) Add several of the failing addresses as examples, each with the exact field values expected, including a no-unit case
B) Add a post-processing regex that moves any token containing a digit and a letter into the unit field
C) Add a sentence telling the model to be especially careful with apartment and flat numbers in every address
D) Ask the model to return a confidence score per field and drop the unit value whenever confidence is low

<details>
<summary>Answer & explanation</summary>

**A)** Worked input/output examples drawn from real failures show the model exactly how units appear and where they belong, which a vague instruction to be careful does not. A regex post-processor encodes a brittle guess that breaks on other formats, and dropping low-confidence units throws away data instead of fixing the extraction.

*Hint if stuck: Use the failures themselves as teaching material.*
</details>

---

## Question 17
A returns agent escalates 35% of its chats to humans, and most are routine, such as refund-status questions well inside policy. Its system prompt says only: 'Escalate whenever the situation is complex or the customer is unhappy.' Human agents are swamped, and leadership asks for a prompt fix that keeps escalation for the cases that need it. What change works best?

A) Write explicit criteria with the reason behind them, plus examples of cases to escalate and cases to resolve
B) Add 'CRITICAL: escalate sparingly and as a last resort' at the top of the prompt so the model takes the rule seriously
C) Have the agent rate its own confidence from 1 to 10 and escalate when that self-rating falls below five
D) Add a sentiment classifier and escalate once the customer's measured frustration passes a set threshold

<details>
<summary>Answer & explanation</summary>

**A)** Vague triggers like 'complex' or 'unhappy' leave the boundary to guesswork, so the fix is explicit criteria (policy gaps, explicit requests for a human, no progress) with the reason for them and a few diverse examples, including near-boundary cases the agent should resolve itself. Anthropic's guidance is that explained instructions generalize better and that examples should cover edge cases. Shouting in capitals changes the tone, not the boundary, and can make newer models overcorrect. Self-rated confidence and sentiment are poor escalation signals: an annoyed customer with a routine refund question does not need a human.

*Hint if stuck: Ask what the model would need in order to tell a routine case from a real handoff case it has never seen before.*
</details>

---

## Question 18
A coordinator spawns a fact-checking subagent and passes it the analysis subagent's conclusion, 'Vendor X's market share grew 12%', along with the coordinator's note that this looked right. The checker almost always confirms. What should the coordinator pass instead to get an independent check?

A) The same conclusion and note, plus an instruction to be extra skeptical and look hard for possible errors
B) The analysis subagent's full transcript, so the checker can see exactly how the number was reached
C) Only the vendor's name, so the checker has to rediscover the market-share figure from scratch on its own
D) The specific claim and the cited source excerpt, without the coordinator's view on whether the claim is right

<details>
<summary>Answer & explanation</summary>

**D)** An independent check needs the claim and its evidence, not the coordinator's opinion, which primes the checker to agree. Asking for extra skepticism while still passing the verdict keeps the bias in place. Passing only the vendor name makes the checker redo the research, and the full transcript drags the original reasoning, and any of its mistakes, into the checker's context.

*Hint if stuck: What would anchor the checker toward agreeing before it has looked at anything?*
</details>

---

## Question 19
An e-commerce agent's apply_store_credit tool is gated by a PreToolUse hook that exits 2 for credits over $50. The block works, but logs show the agent then retries the identical $75 credit four times before giving up, and the customer gets no resolution. The hook's stderr message is just the word 'Blocked.' What should change?

A) Convert it to a PostToolUse hook so the agent can observe the outcome of each attempted credit and then adjust its next step accordingly
B) Rewrite the stderr message to state the rule and the next step: the $50 cap, and that larger credits go through escalate_to_human
C) Add a hard cap of two retries on apply_store_credit in the agent loop configuration
D) Remove apply_store_credit from the agent's tools and route all credit requests to humans

<details>
<summary>Answer & explanation</summary>

**B)** When a PreToolUse hook blocks with exit code 2, its stderr is fed back to the model and is the model's only explanation of why the call was refused; a bare 'Blocked.' is the hook equivalent of a bare 'Operation failed' tool error, leaving nothing to adapt to. Stating the cap and the escalation path lets the agent immediately take the correct action. Retry caps are safety fallbacks that stop the loop without producing a resolution, converting to PostToolUse would let the over-cap credit execute, and removing the tool punishes every legitimate under-cap credit.

*Hint if stuck: Put yourself in the model's place: after the refusal, what did it learn about what to do instead?*
</details>

---

## Question 20
A support team wants Claude to draft updated help-centre articles every Friday night by summarising the week's clustered tickets, about 1,500 clusters. Editors review drafts on Monday. Meanwhile, the live support agent answers customers using the current articles. How should the article drafting run?

A) As a Message Batch on Friday night, with each cluster's ID as its custom_id, so drafts are ready well before Monday
B) As synchronous calls from the live support agent, drafting articles in between customer conversations during the week
C) As synchronous calls on Friday night with high parallelism, so that all drafts finish before midnight on Friday
D) As a Message Batch submitted Monday morning, so editors see the drafts appear soon after they arrive for work

<details>
<summary>Answer & explanation</summary>

**A)** A weekend of slack fits the batch's 24-hour window at half the cost, and custom_id ties each draft back to its cluster. Running drafts through the live agent competes with customers, high parallelism pays full price to finish early for no benefit, and submitting on Monday morning risks drafts arriving after the review should have started.

*Hint if stuck: Use the slack in the schedule to pay less, and leave enough of it.*
</details>

---

## Question 21
A CI pipeline agent streams Claude's responses into a build log. The loop's rule is: if the response contains any text block, post it as the final summary and exit; otherwise execute tools. Builds frequently end with summaries like 'Now I will run the test suite to confirm' while the test tool never executes. What is the flaw?

A) Streaming splits text across multiple deltas, so the loop observes text before the tool blocks finish parsing
B) The system prompt should instruct the model to never produce text in the same turn as a tool call
C) max_tokens is truncating each response after the text block but before the tool_use block arrives
D) Text and tool_use blocks can share a response, so the loop should branch on stop_reason, not on content

<details>
<summary>Answer & explanation</summary>

**D)** A response with stop_reason tool_use routinely carries narrative text alongside its tool_use blocks, so the mere presence of text says nothing about completion — the rule fails even on a fully assembled, non-streamed response, which makes the delta-ordering theory a red herring. Branching on stop_reason is deterministic and correct, whereas prompting the model to suppress accompanying text fights normal, useful behavior and remains best-effort.

*Hint if stuck: Ask whether this failure would still happen with streaming switched off and the full response in hand.*
</details>

---

## Question 22
A 30-engineer team's single CLAUDE.md covers testing, API design, security, git workflow and styling. Five different owners edit it, merge conflicts happen weekly, and nobody can tell who owns which rules. Every topic applies to all work in the repo. Which reorganization fits best?

A) Split each topic into its own file under .claude/rules/, such as testing.md and security.md, with owners per file
B) Move every topic into a separate skill so each owner maintains one, and engineers invoke them as needed
C) Have each owner keep their topic in their own ~/.claude/CLAUDE.md and share it on request with teammates
D) Keep the single file but add a per-section owner comment and require one reviewer per section edited

<details>
<summary>Answer & explanation</summary>

**A)** The .claude/rules/ directory exists for modular, topic-per-file instructions, and files without path scoping load like CLAUDE.md, so always-relevant topics stay always loaded while ownership and merges become per file. Skills load on demand, which suits optional workflows, not always-applicable standards. User-level files do not reach teammates, and owner comments leave the merge-conflict problem in place.

*Hint if stuck: Look for the organization feature built for one topic per file in a shared project.*
</details>

---

## Question 23
A developer-productivity app built on the Agent SDK defines a dependency-auditor subagent with a clear, specific description. Claude usually delegates license checks to it, but in a nightly compliance job the audit must always run inside that subagent, and logs show Claude sometimes does the check itself in the main agent. What is the most direct way to guarantee delegation for that job?

A) Name the subagent in the job's prompt, for example by asking Claude to use the dependency-auditor agent for the license check
B) Add a line to the dependency-auditor's own prompt field saying it must be used for license checks in every job that the app runs
C) Add Agent(dependency-auditor) to allowedTools so that the main agent is required to route every license check through that subagent
D) Set the subagent's model to opus so the main agent treats it as more capable and routes license checks to it more consistently

<details>
<summary>Answer & explanation</summary>

**A)** The SDK docs say that to guarantee Claude uses a specific subagent, you mention it by name in the prompt, which bypasses automatic matching. The subagent's prompt field is its own system prompt, which it only sees after it has been invoked, so it cannot influence routing. allowedTools pre-approves tool calls but compels nothing, and the model setting changes how the subagent runs, not whether Claude chooses it.

*Hint if stuck: Automatic matching is a judgement call; think about what the caller can say to take that judgement out of the loop.*
</details>

---

## Question 24
A due-diligence system spawns one subagent per source type — SEC filings, news coverage, earnings-call transcripts — and each returns a free-prose summary. The coordinator's final memo asserts 'revenue grew 40%', but analysts cannot trace which source said it, and the filings and a news article actually disagreed. What design change fixes this?

A) Require subagents to return structured outputs that map each claim to its source and date
B) Prompt the coordinator to cite sources for each figure when it writes the final memo
C) Have the coordinator re-fetch the underlying documents itself and verify each figure before the memo is published
D) Pass the subagents' full raw transcripts into the coordinator's context instead of summaries

<details>
<summary>Answer & explanation</summary>

**A)** Attribution must be preserved at the boundary where it is lost: prose summaries strip provenance, so subagents should emit structured claim-source-date records the coordinator can carry into synthesis, keeping conflicting claims visible with temporal metadata. Prompting the coordinator to cite cannot work because the source information never reached it. Forwarding raw transcripts bloats the hub's context, and re-fetching duplicates the subagents' entire job.

*Hint if stuck: Find the exact point in the pipeline where provenance is destroyed.*
</details>

---

## Question 25
A developer-productivity assistant has a run_sql tool that takes a connection name and a query. Developers should be able to explore data freely, but every query must run against the read replica, never the primary. Developers sometimes ask for 'the primary, it's fresher', and the model passes 'primary' as the connection. The data team wants such requests simply served from the replica, which lags by under a second, rather than refused. What is the best design?

A) A PreToolUse hook that denies every run_sql call whose connection is not the replica, so the model must retry with the correct connection
B) A system-prompt rule saying that run_sql must always use the replica connection whatever the developer asks for in the conversation
C) A PreToolUse hook that rewrites the connection field to the replica via updatedInput, returning a new input object with the other fields kept
D) A PostToolUse hook that checks which connection served each query and warns the developer whenever the primary was used

<details>
<summary>Answer & explanation</summary>

**C)** A PreToolUse hook can modify tool input through updatedInput, so every query is redirected to the replica without blocking exploration; it should return a new object that keeps the other fields. Denying works but adds failed round-trips and pushback for a request the hook could simply correct. A prompt rule is not enforcement, and a PostToolUse warning comes after the primary has already been queried.

*Hint if stuck: Blocking is one way to enforce a rule; ask whether this rule needs the call stopped or just changed.*
</details>

---

## Question 26
In a research system, the search subagent's tool occasionally times out when a news API is briefly overloaded; a second attempt a few seconds later almost always succeeds. Today each timeout goes straight back to the coordinator, which re-plans the whole research task. Where should these failures be handled?

A) At the coordinator, which should keep a log of each timeout and decide case by case whether the search is worth repeating in a later round of work
B) By raising the API timeout from 10 seconds to 120 seconds so that slow responses are given enough time to finish and no longer count as failures
C) Inside the search subagent or its tool, with a few bounded retries and backoff, escalating to the coordinator once retries are exhausted and including what was tried
D) In the synthesis subagent, which should notice any missing news sources in the material it receives and request them again from the search agent directly

<details>
<summary>Answer & explanation</summary>

**C)** Transient errors should be recovered close to where they happen; bounded retries with backoff in the subagent or tool absorb the blips, and only a persistent failure is propagated, with context, to the coordinator. Sending every blip upward makes the coordinator re-plan needlessly, a very long timeout makes each call hang during genuine outages, and expecting synthesis to spot gaps puts recovery in the wrong agent.

*Hint if stuck: Handle a failure at the lowest level that can actually fix it.*
</details>

---

## Question 27
A three-stage extraction pipeline (OCR, field extraction, normalisation) feeds a payments system. When the normaliser crashes on a document, it writes null for the affected fields and moves on. Downstream, null means "not stated in the source", so those invoices are paid with no late-fee terms applied. About 3% of documents are affected. Which changes fix the error handling? (Choose two.)

A) Fail the whole nightly batch when any document errors, so no partial output reaches the payments system
B) Carry a status for each field, such as extracted, not_in_source or processing_error, through each stage
C) Route documents with processing errors to a retry-and-review queue instead of passing them downstream
D) Fill fields that failed with the most common value seen across other documents from the same supplier
E) Drop documents that fail from the batch output, so the payments system receives just clean records

<details>
<summary>Answer & explanation</summary>

**B, C** A processing failure is not the same as a field the source never stated; an explicit status lets downstream stages tell them apart instead of treating a crash as a valid empty value. Documents that failed should go to retry and review with their error, while the other 97% continue. Failing the whole batch for 3% of documents is the kill-the-workflow anti-pattern. Filling in typical values invents data. Dropping documents silently hides the failure and leaves invoices unprocessed with no one told.

*Hint if stuck: Ask how a downstream stage can tell 'the source didn't say' from 'we never found out', and what should happen next.*
</details>

---

## Question 28
A benefits administrator extracts member ID and claim amount from claim forms. Typed forms work well, but on handwritten forms and forms where the member ID is in a sidebar box, the model often reports the ID as missing. The prompt has two examples, both of typed forms with the ID in the header. What change addresses the cause?

A) Instruct the model that the member ID is present on valid forms and that it should keep looking until it finds a value
B) Add examples of a handwritten form and a form with the ID in a sidebar box, each showing where the ID was found and extracted
C) Mark member_id as required in the schema so that the model cannot leave it empty and must return a value for it
D) Route the handwritten forms and sidebar-layout forms to a manual data-entry team and keep the model on the typed forms

<details>
<summary>Answer & explanation</summary>

**B)** The examples only showed one layout, so the model did not learn that the ID can sit elsewhere; adding the other layouts reduces empty extractions. Telling it the ID is present invites invented IDs when one is truly missing, a required field forces fabrication rather than better search, and manual routing avoids the problem at a high ongoing cost.

*Hint if stuck: Empty results on unfamiliar layouts often trace back to what the examples showed.*
</details>

---

## Question 29
A claims-extraction service on Sonnet 5.5 returns its final summary through output_config.format, which works reliably. Claude also calls a record_claim tool, and about 1 in 200 of those calls arrives with claim_amount as a string or a required field missing, which breaks the database insert. What change addresses the tool inputs?

A) Add strict: true to the record_claim tool definition so its inputs are validated against its schema
B) Tighten the output_config.format schema, since that grammar applies to tool calls in the response too
C) Drop output_config.format, because structured outputs and tool use cannot be combined in one request
D) Set tool_choice to force record_claim so that its input has to follow the declared input_schema

<details>
<summary>Answer & explanation</summary>

**A)** output_config.format shapes Claude's response; it does not apply to tool_use calls. Strict tool use (strict: true on the tool definition) constrains the tool's inputs to its input_schema, and the two features can be combined in one request, so the format setting can stay. Forcing record_claim through tool_choice returns a 400 on Sonnet 5.5, and even where it is supported it makes the call happen without validating its arguments.

*Hint if stuck: Two different schema features are in play; ask which of them reaches the arguments of a tool call.*
</details>

---

## Question 30
A nightly CI job runs claude -p with --output-format json and --json-schema to extract contract fields from 2,000 scanned agreements. The import script reads the schema-conforming output from each JSON result. One night a document Claude declined to process came back without that output and crashed the script with a missing-key error and halted the whole batch. What is the best fix?

A) Remove --json-schema and parse the result text field instead, which is present on each run
B) Check that the schema output is present before using it and route results without it to a review queue
C) Add a prompt instruction telling Claude to return the schema even for documents it cannot process
D) Wrap the import in a retry loop that re-runs the same document until the schema output finally appears

<details>
<summary>Answer & explanation</summary>

**B)** A run that ends without valid structured output, such as a declined document, carries no schema result, so the script must check for it and route those documents for handling instead of crashing the batch. Parsing free text reintroduces fragile scraping. Forcing a schema for unprocessable documents invites fabricated values, and blind retries waste runs on a document that will be declined again.

*Hint if stuck: Design the consumer for the case where the structured result is absent.*
</details>

---

## Question 31
A help-desk agent uses update_ticket(ticket_id, fields), described as 'Updates a ticket.' The backend replaces the whole record with the fields provided, so when the agent only means to add a note, it sends {"notes": "..."} and wipes the status, assignee and priority. Which change is the best fix?

A) Add a sentence to the description warning that the full record must be resent on each call, and include an example call that shows a full ticket being sent
B) Have the agent call get_ticket immediately before each update and merge the fields itself, as required by a new rule in the agent's system prompt for ticket updates
C) Keep update_ticket as is but add a nightly job that restores any status, assignee or priority fields that were cleared during the previous day
D) Replace it with narrow tools such as add_ticket_note and set_ticket_status that change only their own fields, each with a description stating what it changes

<details>
<summary>Answer & explanation</summary>

**D)** The tool's interface hides a destructive side effect behind a generic name, so the model's natural use of it causes damage. Narrow, purpose-specific tools that touch only their own fields make the safe action the only action. A warning in the description and a read-merge-write rule both depend on the model remembering a fragile procedure, and a nightly repair job lets data stay wrong for a day.

*Hint if stuck: Ask whether the tool's name and shape match what the agent is trying to do.*
</details>

---

## Question 32
A bank's support-agent team proposes escalating to humans whenever a sentiment classifier scores the customer below -0.6. In pilot, a furious customer demanding a routine card replacement is escalated within one turn, while a calm customer methodically describing unauthorized wire transfers totaling $18,400 is never escalated. What should the architects conclude?

A) The sentiment threshold is miscalibrated; retrain the classifier on banking-domain transcripts and tune the cutoff
B) Sentiment should be combined with message length and punctuation features to better approximate customer urgency
C) Sentiment measures emotion, not case complexity; switch to triggers like policy gaps, no-progress loops, and explicit requests
D) Both cases warrant escalation: lower the threshold further so calm-but-serious customers also cross the cutoff

<details>
<summary>Answer & explanation</summary>

**C)** Sentiment is an unreliable escalation trigger because emotional tone does not correlate with case complexity or risk — the calm fraud victim is the proof. Retraining or tuning thresholds patches a proxy that measures the wrong thing entirely; reliable triggers are observable case properties such as policy gaps, no-progress loops, and explicit human requests.

*Hint if stuck: Ask what the signal actually measures versus what escalation is supposed to detect.*
</details>

---

## Question 33
A code-generation session in Claude Code keeps ending turns with edits in place but the test suite never run, despite a CLAUDE.md rule saying 'always run the tests before finishing.' The team wants a guarantee that no turn completes after file edits without a test run. What is the right mechanism?

A) Move the rule to the top of CLAUDE.md and rephrase it as a hard, non-negotiable requirement
B) Add a Stop hook that checks whether tests ran after the last edit and blocks completion with feedback telling the model to run them
C) Add a PostToolUse hook on Edit that runs the full test suite after every single file modification, so tests run even for one-line changes
D) Set a minimum iteration count so the session cannot end before a fixed number of tool calls

<details>
<summary>Answer & explanation</summary>

**B)** Stop hooks fire when the agent attempts to finish its turn and can deterministically block completion, feeding the reason back so the model runs the tests. The PostToolUse distractor is deterministic but enforces at the wrong granularity: it runs the whole suite after every one of possibly dozens of edits, burning time and failing spuriously on intentionally incomplete intermediate states mid-refactor, when the requirement only concerns the state at turn completion. Stronger prompt wording remains probabilistic, and iteration counts are safety fallbacks, not behavioral guarantees.

*Hint if stuck: The requirement is about the state when a turn ends, not after each individual change.*
</details>

---

## Question 34
A team gives its /api-style skill context: fork so it stays out of the main session. The SKILL.md body lists conventions (error envelope shape, pagination fields, naming) but sets no task. When Claude invokes it while building an endpoint, the forked run returns almost nothing and the new code ignores the conventions. What fix fits?

A) Add agent: Explore so the forked subagent can read the codebase before it applies the conventions
B) Add allowed-tools listing Read and Edit so the forked subagent has permission to change the files
C) Remove context: fork so the conventions load inline as reference for the main conversation
D) Set background: false so the forked subagent finishes before Claude starts writing the endpoint

<details>
<summary>Answer & explanation</summary>

**C)** With context: fork, the skill content becomes the prompt of a separate subagent that does not see the conversation. A body of guidelines with no task gives that subagent nothing to act on, so it returns little and the conventions never reach the conversation writing the code. Reference content like this should run inline. Choosing Explore, pre-approving tools or waiting for the result still leaves the conventions with a subagent that has no task.

*Hint if stuck: Ask who receives the skill's text when it runs, and whether that reader is the one writing the endpoint.*
</details>

---

## Question 35
A content team runs a weekly report agent for 'top changes in our competitors' public pricing'. The report always has the same five sections and draws on the same eight public pages. The agent currently plans freely each week and sometimes skips a competitor entirely. What design would make the report reliable?

A) Give the agent more autonomy and a larger turn budget so it has time to cover every competitor on its own each week
B) Add a final step in which the agent rereads its own report and checks that every competitor was included before it publishes
C) Ask the agent to list each competitor at the top of its plan, trusting that the explicit list will keep it from skipping any of them
D) Use a fixed chain: one fetch-and-summarise step per page, then an assembly step that fills the five sections, with a coverage check

<details>
<summary>Answer & explanation</summary>

**D)** The inputs and outputs are the same every week, so a fixed chain with per-page steps and a coverage gate makes completeness structural. More autonomy is the cause of the variability, a self-review step relies on the same model catching its own omission, and listing competitors in the plan is still a soft instruction it can drift from.

*Hint if stuck: Repeated work with a known shape rarely needs the model to plan it.*
</details>

---

## Question 36
A compliance team submits a monthly Message Batch of 30,000 contract extractions. An auditor wants to re-download the raw results of the March batch in the second week of May. The team's plan was to keep only the batch IDs and fetch results from the API whenever they are needed. What does this plan miss?

A) Results are kept only until the first download, so any later fetch by the auditor returns an empty file
B) Nothing, since batch results stay downloadable for as long as the batch ID exists in the organisation
C) Results stay downloadable for 29 days after creation, so they must be saved in the team's own storage
D) Results expire 24 hours after the batch ends, so they must be fetched on the same day it completes

<details>
<summary>Answer & explanation</summary>

**C)** Batch results are available for 29 days after the batch is created; after that the batch can still be viewed but its results can no longer be downloaded, so anything needed longer must be copied into the team's own storage. The 24-hour figure is the processing window, not retention, and results are not deleted on first download.

*Hint if stuck: Separate how long processing may take from how long the output is kept.*
</details>

---

## Question 37
After Claude Code builds a CSV importer, a review lists five problems. The developer wants to send problems whose fixes interact in one message and work through the independent ones one at a time, checking each fix. Which problems belong together in a single message? (Choose two.)

A) The parser trims spaces inside quoted values in the free-text notes column of each row
B) The row validator's error message misspells 'column' as 'colum' when it rejects a row
C) The importer writes each rejected row to the audit log twice, once per validation pass
D) The parser drops the last field of any row whose final quoted value contains a comma
E) The row validator was loosened to accept 9 or 10 fields so the short rows would pass

<details>
<summary>Answer & explanation</summary>

**D, E** The dropped field and the loosened validator interact: fixing the parser makes every row 10 fields, and the workaround that accepts 9 would then hide future parsing errors, so both must be changed together. The whitespace trimming, the typo in the error message and the duplicate audit entries sit in the same components but don't depend on either fix, so each can be handled and verified on its own.

*Hint if stuck: Ask whether fixing one problem changes the right fix for another, not whether they share a file.*
</details>

---

## Question 38
A team wants to make sure Claude Code never runs `npm publish` from developer machines. They wrote a PostToolUse hook on Bash that detects publish commands and alerts the security channel. In the first week, two internal packages were accidentally published to the public registry, and the alerts fired after both. What should they change?

A) Make the PostToolUse hook also run `npm unpublish` right after it detects a publish, so the package is withdrawn within seconds
B) Lower the alert hook's timeout so the security channel hears about publish commands faster than it does today
C) Add `npm publish` to the team's CLAUDE.md as a forbidden command, alongside the existing alert from the hook
D) Use a PreToolUse hook on Bash that denies publish commands with a reason, so the command never runs at all

<details>
<summary>Answer & explanation</summary>

**D)** PostToolUse runs after the tool has executed, so it can only react; blocking an action requires a PreToolUse hook that denies the call before it runs. Auto-unpublishing still exposes the package and may not be allowed by the registry. A CLAUDE.md rule is best-effort, and faster alerts do not prevent anything.

*Hint if stuck: The alerts fired every time, yet the harm still happened. What does that say about timing?*
</details>

---

## Question 39
A support agent on the Claude API needs get_order, get_shipment and get_invoice for most billing questions. The three lookups are independent, yet the agent requests them one per turn, adding seconds of latency. The loop code runs each requested tool and sends each tool_result back to the API in a user message of its own. Which changes should get the three lookups requested together? (Choose two.)

A) Send a turn's tool_result blocks together in a single user message instead of one message per result
B) Set tool_choice to any so each response must contain tool calls and the agent can't stop between lookups
C) Raise max_tokens on each request so that one response has room for several tool_use blocks at once
D) Set disable_parallel_tool_use to false in tool_choice so that Claude is allowed to request several tools
E) Add a system prompt instruction to call independent tools at the same time rather than one after another

<details>
<summary>Answer & explanation</summary>

**A, E** The docs warn that returning each tool result in a separate user message teaches Claude to avoid parallel calls; all results for a turn belong together in one user message. If the default still isn't enough, a system prompt section asking Claude to invoke independent tools simultaneously strengthens parallel use. disable_parallel_tool_use already defaults to false, so setting it changes nothing. tool_choice any forces some tool call but not several at once. A few tool_use blocks are short; output length isn't what keeps them apart.

*Hint if stuck: Ask what the model learns from how its earlier calls were answered, and what it has been asked to do.*
</details>

---

## Question 40
An extraction service moved to structured outputs with output_config.format. Every response now validates, but two consumers broke: a legacy exporter that writes CSV columns in the order the keys appear finds the optional discount and po_number values shifted after all the required fields, and a router that exact-matches the department enum misses some values. Which changes fix these? (Choose two.)

A) Move discount and po_number to the top of the schema so they come out ahead of the others
B) Have the exporter look up each CSV column by its key name rather than by the key's position
C) Switch from JSON outputs to strict tool use, which keeps enum casing exactly as in the schema
D) Compare department values case-insensitively in the router instead of by exact string match
E) Add additionalProperties: false to the schema so the output keeps its keys in schema order

<details>
<summary>Answer & explanation</summary>

**B, D** With structured outputs, required properties come first and optional ones follow, so an exporter that relies on key position breaks; reading columns by key (or making every property required) removes that dependence. The docs also say the capitalisation of string enum values isn't guaranteed, so compare them case-insensitively. Moving optional properties up the schema doesn't help, because required ones are still emitted first. The casing caveat applies to strict tool use as well. additionalProperties: false is already required for objects and says nothing about order.

*Hint if stuck: Ask what the docs promise about the output beyond its validity against the schema.*
</details>

---

## Question 41
A CI job runs cd services/payments && claude -p for payment-related reviews. Believing the root CLAUDE.md would not load from a subdirectory, the team copied all 150 root lines into services/payments/CLAUDE.md. Reviews now show contradictory advice where the two copies have drifted. What should they do?

A) Delete the root CLAUDE.md, since the payments copy is the one CI actually depends on for its reviews
B) Remove the copied root content from the payments file, since ancestor CLAUDE.md files load anyway
C) Launch the CI job from the repo root instead, so only the root CLAUDE.md loads during the reviews
D) Add a header to the payments copy telling Claude to prefer it over any other CLAUDE.md content

<details>
<summary>Answer & explanation</summary>

**B)** Claude Code loads CLAUDE.md files from the working directory and every directory above it, so the root file already loads in the payments job; the copy only adds drift and contradictions. Deleting the root file breaks every other session. Moving the launch directory changes which nested files load rather than fixing duplication, and a prefer-me header leaves both copies in context.

*Hint if stuck: Think about which directories Claude Code reads memory from when started in a subfolder.*
</details>

---

## Question 42
A data team uses Claude to generate SQL migrations in a developer-productivity workflow. They want a review step that catches destructive operations such as dropped columns. Two designs are on the table: an independent reviewer instance, or a deterministic check in code that blocks any migration containing DROP or ALTER ... DROP without a waiver. Which is the best design?

A) Rely on the deterministic check by itself, since an AI reviewer adds little once a hard block exists
B) Use the deterministic block for known-destructive patterns and an independent reviewer for logic no pattern catches
C) Use the independent reviewer instance instead of the check, because a model reviewer understands each migration's intent
D) Replace the check with the reviewer instance, plus a system-prompt rule to reject any migration that drops or alters a column

<details>
<summary>Answer & explanation</summary>

**B)** Known-destructive patterns that must never slip through belong in a deterministic gate, while an independent reviewer covers logic errors that no pattern can express. Relying only on the model, even with a firm instruction, leaves a non-zero miss rate on the critical case, and relying only on the regex misses semantic mistakes.

*Hint if stuck: Must-never-happen rules and judgment calls need different mechanisms.*
</details>

---

## Question 43
A support agent for a multi-region bank calls get_statements for a customer whose account is held by the EU entity; the agent's credentials only cover US accounts. The tool returns 'Error 403.' The agent retries, then tries get_transactions and get_balance, each failing the same way, before apologising vaguely. What should the tool return?

A) A transient error marked retryable, since the EU entity's access controls may be updated soon and a later attempt could well succeed for this customer
B) An empty statements list, so the agent tells the customer there are no statements available instead of exposing internal permission details to them
C) A JSON-RPC protocol error, so the client ends the session and the customer is automatically transferred to the EU support queue by the platform
D) A structured permission error: category permission, not retryable, explaining that the account is held by the EU entity and naming the handoff route

<details>
<summary>Answer & explanation</summary>

**D)** A permission failure is not fixed by retrying or by trying neighbouring tools; the agent needs to know it lacks access, why, and where to send the customer. A structured permission error with that context lets it hand off cleanly. Marking it retryable invites the same loop, an empty list lies to the customer about their account, and a protocol error removes the explanation the model needs to respond helpfully.

*Hint if stuck: Ask what the agent should do next and whether the error tells it.*
</details>

---

## Question 44
A bank's support agent escalates every refund above $100 to a human, even though the documented policy authorises the agent to refund up to $250 for duplicate charges. Queue times have doubled. Leadership asks the architect to reduce escalations without adding risk. What should change?

A) Tell the agent in the prompt to be more confident and avoid escalating unless it really is necessary
B) Align criteria with policy: resolve duplicate-charge refunds up to $250, escalate above that or outside it
C) Raise the escalation threshold to $500 for each refund type so the agent handles more refunds on its own
D) Add a sentiment check so the agent escalates refunds over $100 when the customer seems upset

<details>
<summary>Answer & explanation</summary>

**B)** The agent is escalating cases the policy already covers, so the fix is criteria that match the policy's actual limits. A general push for confidence is vague, a blanket $500 threshold exceeds what policy authorises and adds risk, and sentiment has nothing to do with whether a refund is within authority.

*Hint if stuck: Over-escalation is also a criteria problem.*
</details>

---

## Question 45
An extraction service moved from prompt-only JSON to output_config.format with a JSON schema. The old code prefilled the assistant turn with an opening brace to push the model straight into JSON, and the migration ticket asks whether that prefill should stay. What is the right call?

A) Keep the prefill and add the beta header, which is what lets a prefill coexist with a JSON output schema
B) Remove the prefill, because the schema already shapes the output and prefills don't work with it
C) Extend the prefill to the first key as well, so the start of the output lines up with the schema
D) Move the opening brace into the system prompt, which has the same effect as a prefill with schemas

<details>
<summary>Answer & explanation</summary>

**B)** Prefilling is listed as incompatible with JSON outputs, and it is unnecessary: constrained decoding already guarantees the response follows the schema from its first token. A longer prefill makes the conflict no better, a brace in the system prompt is just text with no effect on decoding, and structured outputs are generally available with no beta header, nor does any header make prefills compatible.

*Hint if stuck: Ask what job the prefill was doing and whether anything in the new setup already does it.*
</details>

---

## Question 46
A team put the rule "never log request bodies, they may contain card numbers" in .claude/rules/api-logging.md with paths frontmatter matching src/api/**. A security audit then found Claude adding body logging to background workers in src/workers/. What is the right fix?

A) Add a second path-scoped rule for src/workers/** with the same text, and repeat for new directories
B) Remove the path scoping so the rule is always loaded, or move it into the project CLAUDE.md
C) Rename the rule file to security-critical.md so its name signals that it applies everywhere in the repo
D) Add the logging rule to each developer's user-level memory so it follows them into each directory

<details>
<summary>Answer & explanation</summary>

**B)** A rule that applies to all code must not be path-scoped; making it unconditional, through the project CLAUDE.md or a rule without paths frontmatter, loads it for every task. Adding a scoped copy per directory leaves gaps whenever new code lands elsewhere. A file name has no effect on when a rule loads, and user-level memory is not shared with CI or new teammates.

*Hint if stuck: Compare where the risk can actually occur with where the rule currently loads.*
</details>

---

## Question 47
A broadband support agent's prompt says 'escalate to a human if you are not making progress.' Logs show chats where it calls run_line_test, gets the same failure, suggests another router restart and repeats this cycle for 25 turns before the customer gives up. The team wants escalation in these cases to happen reliably. What should they change?

A) Rewrite the instruction in capitals marked IMPORTANT, and add that the agent must count its own attempts before each reply
B) Track repeated identical tool failures in code and hand the chat to a human with the steps tried once a set limit is hit
C) Have the agent rate its own progress from 0 to 10 after each turn and escalate automatically whenever the score drops below 4
D) Escalate when a sentiment model detects rising frustration, since customers stuck in these loops eventually become annoyed

<details>
<summary>Answer & explanation</summary>

**B)** No progress is a valid escalation trigger, but a prompt-only rule fails at some rate, and here the model is clearly not applying it. Detecting the loop from observable facts in code (the same tool failing the same way, again and again) and handing off with what was tried makes the trigger dependable. Louder wording is still a prompt rule. Self-rated progress is poorly calibrated; the agent apparently believes each restart might help. Sentiment measures mood, not progress, and fires late or never for patient customers.

*Hint if stuck: When a rule must fire every time, ask what can observe the situation without relying on the model's own judgment.*
</details>

---

## Question 48
A team adds .claude/agents/dependency-auditor.md to their repo so Claude Code can audit third-party packages for licence and CVE issues. The frontmatter has a name and description but no tools field. During one audit, the subagent ran a package upgrade through Bash and edited the lockfile. What is the right fix?

A) Add a line to the subagent's prompt saying it must report its findings and must not modify files or run package installs
B) Add a tools field listing only read-only tools such as Read, Grep and Glob, since an omitted field inherits everything
C) Require plan mode for the whole repository so each Claude Code session asks for approval before any file change
D) Rename the subagent to dependency-reader so that its description signals to the main agent that it does not modify code

<details>
<summary>Answer & explanation</summary>

**B)** A subagent with no tools list inherits every tool available to subagents, including Bash and Edit, so the audit role was over-provisioned. Listing only read-only tools removes the capability, and a tool left out is simply absent from the subagent's session. A prompt prohibition remains probabilistic, plan mode for every session penalises all other work to fix one agent, and renaming changes routing hints, not capability.

*Hint if stuck: Check what a subagent gets when its tool list is left unspecified.*
</details>

---

## Question 49
A research coordinator's loop runs one fixed sequence for every question: web_search, then fetch_page on the top three hits, then summarize. Simple factual questions waste calls, and broad questions stop before enough sources are read. The loop also ends as soon as the reply contains the words "Final report", which Claude sometimes writes while it is still planning. Which changes should the team make? (Choose two.)

A) Set tool_choice to name the next tool in the sequence on each turn so the order is applied reliably
B) Ask Claude to end its final reply with a JSON line {"done": true}, and stop the loop on that line
C) Keep looping while stop_reason is tool_use, and treat end_turn as the sign the research is finished
D) Give Claude the tools with clear descriptions and let it pick each next call from what it has found
E) Pick one of three fixed tool sequences per question with a classifier call that runs before the loop

<details>
<summary>Answer & explanation</summary>

**C, D** Letting the model choose the next tool from what it has learned fits the work to each question, which a fixed path cannot do. stop_reason is the API's signal: tool_use means run the tools and call again, end_turn means Claude has finished. Choosing among three fixed sequences is still a hard-coded decision tree with fewer branches. Forcing each next tool through tool_choice enforces the rigid order more strictly. A done flag in the reply text is another phrase to parse and fails the same way the "Final report" check does.

*Hint if stuck: Who should decide the next step in an open-ended task, and what does the API itself tell you about whether a turn is over?*
</details>

---

## Question 50
To slim the root CLAUDE.md, a team moved its architecture overview (service boundaries, data flow, which team owns what) into a rule with paths: src/**. Now when an engineer asks Claude a design question before any file has been opened, the answers ignore the architecture entirely. What should they do?

A) Change the pattern to **/* so the overview matches every file in the repository
B) Ask engineers to open a source file first so that the architecture rule gets loaded
C) Move the overview into a skill so Claude loads it when it thinks a question needs it
D) Put a short overview back in CLAUDE.md, since it is needed regardless of files

<details>
<summary>Answer & explanation</summary>

**D)** Path-scoped rules load only once Claude works with matching files, so knowledge needed from the first message of every session belongs in CLAUDE.md (kept concise). Widening the glob still waits for a file to be touched. A workaround of opening files first is fragile, and a skill makes essential context depend on Claude guessing it is relevant.

*Hint if stuck: Path rules wait for a matching file; is this knowledge file-specific?*
</details>

---

## Question 51
Claude Code tries to change a timeout in a Python file but Edit keeps failing with a no-match error. The agent wrote old_string from memory of what the code probably looks like, using four-space indentation, while the file actually uses tabs. What should the agent do next?

A) Read the relevant lines first, then copy the exact text, tabs included, into old_string for the Edit
B) Shorten old_string to just the number 30 so the match no longer depends on any indentation
C) Retry the same Edit a few more times, since a transient file lock is the usual cause of no-match errors
D) Switch to Write and regenerate the whole file from memory with the new timeout already in place

<details>
<summary>Answer & explanation</summary>

**A)** Edit performs exact string matching, so old_string must be copied from the file as it really is, which means reading the region first. Regenerating the whole file from memory risks silently changing other lines. A bare number like 30 is likely to appear more than once and fail the uniqueness check, and retrying an identical edit cannot fix a content mismatch.

*Hint if stuck: Exact-match tools need exact input; get it from the source, not from memory.*
</details>

---

## Question 52
A platform team registers a subagent through AgentDefinition with the description 'Helper agent' and a detailed prompt for analyzing database query plans. Developers ask the main agent about slow queries all day, yet it never delegates to the new subagent. What is the most likely fix?

A) Give the subagent every tool available to the main agent so it is seen as capable enough for these requests
B) Move the detailed query-plan instructions out of the prompt field and into the description field of the definition
C) Rewrite the description to say what the subagent does and when to use it, such as analyzing slow SQL query plans
D) Change the subagent's model to the largest one available so the main agent will prefer it for difficult questions

<details>
<summary>Answer & explanation</summary>

**C)** The main agent decides when to delegate by matching the task against each subagent's description, so a vague description like 'Helper agent' gives it nothing to match. The prompt field is the subagent's own system prompt and is the right place for the detailed instructions; moving them into the description bloats the routing signal. Tool access and model choice do not influence whether the description matches the request.

*Hint if stuck: Think about which field the main agent reads when deciding whom to call.*
</details>

---

## Question 53
A team in Claude Code wants a writer/reviewer workflow for a new OAuth callback handler. One engineer proposes giving the reviewer session the full transcript of the writer session 'so it understands the design choices.' Another proposes giving it only the diff and the spec. Which should the architect choose, and why?

A) The full transcript, because the reviewer cannot judge design choices without the reasoning that led to them
B) The full transcript plus the spec, because more context produces a more accurate and thorough review
C) Neither of them; the reviewer should instead get a short summary written by the writer session explaining which areas it should check most closely
D) Only the diff and the spec, because a reviewer that reads the writer's reasoning tends to adopt it rather than test it

<details>
<summary>Answer & explanation</summary>

**D)** The value of a second instance is independence; handing it the writer's transcript reintroduces the same rationale that produced any blind spots. A writer-authored summary of what to check steers the reviewer toward the writer's view of the risky areas, and more context is not automatically better when it carries bias.

*Hint if stuck: What makes a second reviewer worth paying for in the first place?*
</details>

---

## Question 54
A Claude Code user's internal MCP server exposes create_ticket with a priority field. When Claude passes 'urgent', the server returns isError with the message 'Invalid input.' Claude tries 'high', then 'critical', then gives up and tells the developer the ticket system is broken. The valid values are P1 to P4. Which change best fixes this?

A) Return a validation error that names the field, the value received and the allowed values P1 to P4, and declare those values as an enum in the input schema
B) Return the failure as a JSON-RPC protocol error with code -32602, since invalid parameters are a request-structure problem that the client should handle on its own
C) Keep the generic message but add a CLAUDE.md note listing the four valid priority values so Claude can look them up whenever it creates a ticket
D) Have the server map any unrecognised priority to P3 so tickets are always created, and mention the default in the ticket body for later review

<details>
<summary>Answer & explanation</summary>

**A)** A bad argument is a failure the model can fix itself, but only if the error reaches it as an actionable tool result: which field, what was wrong, what is allowed. Declaring the enum in the schema prevents most bad values in the first place. Silently defaulting to P3 hides real urgency, a protocol error is less likely to reach the model in a form it can recover from, and a CLAUDE.md list leaves the tool's own feedback useless.

*Hint if stuck: An error message is useful when it tells the model exactly what to change.*
</details>

---

## Question 55
A subscription-box support agent looks up a customer by email and finds no account, but finds two accounts by the name 'J. Okafor' in the same city, one with an active order. The customer wants to change the shipping address on 'my order'. What is the right next step?

A) Change the address on the account with the active order, since it is the only one that could have an order to change
B) Ask the customer for an identifier that distinguishes the accounts, such as an order number or the phone on file
C) Escalate to a human immediately, because any ambiguity in customer identity is outside what the agent can resolve
D) Show the customer both accounts' addresses and order details so they can point out which one is theirs

<details>
<summary>Answer & explanation</summary>

**B)** When a lookup returns multiple matches, the agent should ask for another identifier rather than guess. Picking the active-order account is a plausible guess that can redirect a stranger's shipment, showing both records leaks another customer's data, and escalating is premature when one more question resolves it.

*Hint if stuck: Multiple matches call for more information, not inference.*
</details>

---

## Question 56
A research system's evaluator subagent rates each source as "strong", "moderate" or "weak" evidence. Analysts find the same kind of source (a vendor white paper) rated strong in one report and weak in another. The prompt only lists the three labels. What change makes the ratings consistent?

A) Ask the evaluator to explain its reasoning in detail before each rating so that analysts can override any ratings they disagree with
B) Replace the three labels with a numeric 1 to 10 score so the evaluator can express finer distinctions
C) Define each level with concrete criteria and examples, such as a peer-reviewed study as strong and a vendor white paper as weak
D) Run the evaluator twice on every source and keep the lower of the two ratings to stay on the cautious side

<details>
<summary>Answer & explanation</summary>

**C)** Labels without definitions leave each run to invent its own boundaries; concrete criteria and examples for each level anchor the judgment so the same kind of source gets the same rating. A finer numeric scale multiplies the ambiguity, explanations help humans audit but do not fix the rule, and taking the lower of two runs biases ratings without making them consistent.

*Hint if stuck: Labels only mean something once each one has a definition.*
</details>

---

## Question 57
A nightly job uses the Agent SDK in two steps. Step one audits licences and records its session ID; step two asks follow-up questions that need that audit. When both steps ran on the same runner, step two worked. Since the pipeline moved step two to a fresh container, resuming by that ID fails to find the session. Which approaches let step two build on the audit? (Choose two.)

A) Name the session in step one so that step two can resume it by its name from any machine in the run
B) Pass forkSession: true with the recorded ID so the SDK copies the session over to the new container
C) Copy step one's .jsonl transcript to the same ~/.claude/projects/ path in the new container, then resume
D) Export the audit findings as structured data and pass them into a fresh session's prompt in step two
E) Pass continue: true in step two so the SDK finds the most recent session without needing the ID

<details>
<summary>Answer & explanation</summary>

**C, D** Session transcripts are files local to the machine that wrote them. Restoring the .jsonl file under ~/.claude/projects/ on the new host, at the path the first run used, makes it resumable there, and passing the results into a fresh session's prompt avoids depending on transcripts at all. continue looks for the most recent session on the new host, where none exists. Forking needs the original session on the same host and copies nothing between machines. A name is a label for a local session, not a way to reach one stored elsewhere.

*Hint if stuck: Where does a session actually live, and what has to be on the new machine for step two to use it?*
</details>

---

## Question 58
A platform team's api-style skill has grown to a 650-line SKILL.md: a short checklist followed by dozens of request and response examples for every endpoint family. Each time the skill is invoked, the whole file lands in the session and stays there, even when the engineer only needs the checklist. How should they restructure it?

A) Copy the checklist into the project CLAUDE.md and delete the skill so that the guidance is always on hand
B) Keep SKILL.md as a short overview and move the examples into supporting files that SKILL.md links to by name
C) Compress the examples into one dense reference table near the top of SKILL.md so the file reads faster
D) Split the content into twelve separate skills, one per endpoint family, each carrying its own full set of examples

<details>
<summary>Answer & explanation</summary>

**B)** Skills are designed for progressive disclosure: SKILL.md stays a concise overview and links to reference files that Claude reads only when they are needed. Moving the checklist into CLAUDE.md makes it an always-on cost in every session, including ones that never touch the API. A denser table still loads every example on every invocation, and twelve near-duplicate skills multiply descriptions and maintenance without solving the oversized-body problem.

*Hint if stuck: Separate what Claude needs every time the skill runs from what it needs only occasionally.*
</details>

---

## Question 59
A 14-person platform team wants every GitHub pull request reviewed by Claude before human review. Today, reviews only happen when a developer remembers to run a review prompt locally, and about a quarter of PRs merge without one. What is the standard way to automate this?

A) A nightly cron job that batch-reviews everything merged during the previous day
B) Add claude-code-action to the repository's GitHub Actions workflow triggered on pull requests
C) A pre-push hook on each developer laptop that runs claude -p against the branch diff
D) A required PR checklist item where the author pastes the output of their local Claude review

<details>
<summary>Answer & explanation</summary>

**B)** claude-code-action is the supported GitHub Actions integration for PR review: it runs server-side on every pull request, removing the dependency on individual developer discipline. Laptop hooks and checklist items still rely on each developer's machine and memory, and a nightly batch review lands after merge — too late to gate anything.

*Hint if stuck: Ask which approach stops depending on what people remember and still happens ahead of human review.*
</details>

---

## Question 60
A national retailer submits one 90,000-request batch every month-end to extract supplier rebate terms. During a period of heavy demand, the batch hit the 24-hour window with 6,000 requests marked expired. Downstream reports are due in three days. What should the team do?

A) Resubmit only the 6,000 expired requests, by custom_id, as a new batch now, which leaves ample time before the reports are due
B) Resubmit the entire 90,000-request batch, since an expired batch must be rerun from scratch to keep results consistent
C) Wait for the expired requests to finish in the background, since the API completes them after the window closes
D) Move future month-end extraction to synchronous calls, since batches cannot be relied upon to finish on time

<details>
<summary>Answer & explanation</summary>

**A)** Expired requests never reached the model and are not billed, so resubmitting just those custom_ids as a new batch completes the job well inside the three-day deadline. Rerunning everything pays again for 84,000 good results, expired requests do not continue in the background, and abandoning batches throws away the discount for work with a three-day deadline.

*Hint if stuck: Ask whether the requests that ran successfully need to run again.*
</details>

---

## Answer key (no peeking until scored)

1:A 2:A 3:D 4:B 5:A 6:B,D 7:A 8:D 9:B,E 10:A 11:C 12:C 13:A 14:A 15:A 16:A 17:A 18:D 19:B 20:A 21:D 22:A 23:A 24:A 25:C 26:C 27:B,C 28:B 29:A 30:B 31:D 32:C 33:B 34:C 35:D 36:C 37:D,E 38:D 39:A,E 40:B,D 41:B 42:B 43:D 44:B 45:B 46:B 47:B 48:B 49:C,D 50:D 51:A 52:C 53:D 54:A 55:B 56:C 57:C,D 58:B 59:B 60:A
