# Full Practice Exam 01 — CCAR-F simulation

Same format as the real exam guide: **60 questions, 120 minutes, scaled score out of 1000,
pass at 720.** Domain weighting: D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.
No question here appears in the other 2 printable exams.

Set a timer. No notes, no docs. For the interactive version with the clock, flags, and a score report, open the game.

---

## Question 1
A CI platform team has container conventions (pinned base-image digests, a non-root USER, no curl-pipe-to-shell) that should apply whenever Claude edits a Dockerfile. The files are named Dockerfile, Dockerfile.dev and Dockerfile.ci and sit in services/*/, tools/ and the repository root. Engineers working on application code should not get these conventions. Which setup fits?

A) A rule with paths: **/*.dockerfile so every container definition in the repository matches it
B) A rule with paths: services/*/Dockerfile, since most of the Dockerfiles live in the services tree
C) A nested CLAUDE.md placed next to each Dockerfile in services/*/ and tools/ and at the repo root
D) A rule with paths: **/Dockerfile* so every Dockerfile variant at any depth loads the conventions

<details>
<summary>Answer & explanation</summary>

**D)** A path-scoped rule with **/Dockerfile* matches the bare name and every suffixed variant at any depth, so container edits get the conventions and application work does not. A *.dockerfile extension pattern matches none of these filenames, and limiting the glob to services/ misses tools/ and the root. Copying a CLAUDE.md beside each Dockerfile duplicates the text and drifts.

*Hint if stuck: Write the glob against how the files are actually named, not how you would expect them to be named.*
</details>

---

## Question 2
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

## Question 3
A competitive-intelligence coordinator needs three things: a list of a rival's product launches, a pricing analysis of those launches, and a market-share estimate that does not depend on either. Today it spawns all three subagents at once, and the pricing subagent guesses which launches to analyze. How should it orchestrate them?

A) Merge the launches and pricing work into one subagent and drop the market-share estimate to keep the plan simple
B) Run all three subagents strictly one after the other, so each one can read whatever the previous subagent produced
C) Keep spawning all three at once, but tell the pricing subagent to wait and poll for the finished launch list before it starts any analysis
D) Run the launches and market-share subagents in parallel, then start the pricing subagent with the launch list in its prompt

<details>
<summary>Answer & explanation</summary>

**D)** Independent tasks can run in parallel, while a dependent task should start once its input exists, with that input passed explicitly by the coordinator. Running everything in series wastes the time the independent market-share task could save. Telling the pricing subagent to wait and poll leaves the dependency to the subagents instead of having the coordinator pass the list once it exists, and dropping a required deliverable is not orchestration.

*Hint if stuck: Map which task needs another task's output before deciding what runs together.*
</details>

---

## Question 4
A travel-booking agent receives a response with four parallel tool_use blocks: two flight searches and two hotel searches. The calls run on an async worker pool and finish out of order. The developer sends each tool_result back as its own user message the moment it completes, and the API rejects the second request. What is the correct handling?

A) Buffer the results and send four consecutive user messages arranged in the original tool_use order
B) Re-run the workers sequentially so results arrive in exactly the order the model requested them
C) Gather all four results into one user message, each tool_result matched by its tool_use_id; completion order is irrelevant
D) Restrict the agent to one tool_use block per response using tool_choice so ordering never arises

<details>
<summary>Answer & explanation</summary>

**C)** All tool_results answering a parallel batch belong in the single next user message, where each is paired with its call by tool_use_id rather than by position or arrival time. Splitting results across multiple user messages leaves unanswered tool_use blocks at each intermediate step, which the API rejects regardless of ordering, and forcing sequential execution throws away the latency benefit of parallel calls.

*Hint if stuck: Think about how the API pairs a result with its originating call — it is not by arrival order.*
</details>

---

## Question 5
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

## Question 6
A content team's prompt says "summarise each meeting in five bullet points", but all three examples show three-bullet summaries because they were written for an older template. The model returns three bullets most of the time. A teammate proposes adding "IMPORTANT: always use five bullets" at the top. What should the architect recommend?

A) Rewrite the examples so they show five-bullet summaries, because the examples are the stronger signal and currently contradict the rule
B) Add the IMPORTANT line and also repeat the five-bullet rule at the end of the prompt, so the model sees the instruction twice
C) Remove the bullet count from the instruction and accept three bullets, since the model has evidently settled on that format
D) Add a post-processing step that asks the model to expand any summary with fewer than five bullets into a five-bullet version

<details>
<summary>Answer & explanation</summary>

**A)** Examples steer format more strongly than instructions, so when they conflict the examples tend to win; making the examples match the rule removes the conflict at its source. Shouting or repeating the instruction keeps fighting the stronger signal, dropping the requirement abandons the goal, and an expansion pass adds a second call and padded bullets to repair a problem the prompt created.

*Hint if stuck: When an instruction and its examples disagree, ask which one the model is copying.*
</details>

---

## Question 7
A fintech support agent handles a disputed charge of $147.23. The conversation runs 25 turns, and the agent uses progressive summarization to keep the history manageable. At turn 22 the agent offers the customer a refund of $47 — the exact figure has eroded through repeated summarization passes. What is the root-cause fix?

A) Strengthen the summarization prompt with 'always preserve monetary amounts exactly as written' so figures survive each pass
B) Disable summarization and rely on a model with a larger context window so the raw 25-turn history stays verbatim
C) Keep exact figures, IDs, and dates in a structured case-facts block outside the summarized history
D) Re-run the transaction lookup tool on every turn so the disputed amount is always freshly loaded in context

<details>
<summary>Answer & explanation</summary>

**C)** Progressive summarization is lossy by design, so exact values must live in a structure that is never summarized. A case-facts block carried verbatim in every request guarantees $147.23 survives to turn 22. Prompting the summarizer to be careful is probabilistic best-effort, keeping the entire raw history merely trades erosion for mid-context burial and ever-growing cost, and re-running the lookup every turn wastes tokens while patching the symptom.

*Hint if stuck: Ask which data should be exempt from a lossy process rather than asking the lossy process to be careful.*
</details>

---

## Question 8
An invoice extraction pipeline adds a reviewer instance that re-extracts totals independently. When the two instances disagree, the current code simply keeps the second instance's value. Error rates did not improve. What should happen on a disagreement?

A) Always keep the first instance's value, because the original extraction had the most complete view of the document
B) Treat it as a signal: route the field to a human or targeted re-check with both values and the source span
C) Run a third instance and silently keep whichever value two of the three instances agree on, without any further check
D) Average the two numeric values so that small discrepancies between the instances cancel each other out over time

<details>
<summary>Answer & explanation</summary>

**B)** The point of independent passes is to surface disagreements that mark risky fields, so a disagreement should trigger review rather than an arbitrary pick. Preferring either instance discards that signal, averaging produces a number that matches neither document reading, and a silent majority vote can still be wrong on the same hard field without anyone looking.

*Hint if stuck: Two readings that differ are telling you something.*
</details>

---

## Question 9
A report on regional housing markets includes median prices for eight cities over five years, quotes from three economists and a narrative on policy changes. The current synthesizer writes everything as paragraphs, and readers cannot compare prices across cities or tell which economist said what. How should the report be rendered?

A) Put all content in one large table so that every fact in the report, including the quotes and narrative, is laid out in a single format
B) Use a table with source and date columns for the prices, attributed quotes for the economists, and prose for the narrative
C) Keep the paragraphs but bold every number so that readers can find the prices quickly when they skim through the narrative sections
D) Write everything as bullet points so that each fact stands alone, which makes the whole report easier to skim than paragraphs

<details>
<summary>Answer & explanation</summary>

**B)** Each content type has a natural format: comparable numbers belong in a table with source and date, quotes need attribution, and the narrative reads best as prose. Forcing everything into one table or one bullet list suits some content and harms the rest, and bolding numbers in paragraphs still leaves the comparison scattered.

*Hint if stuck: Match the format to the kind of content.*
</details>

---

## Question 10
A structured-extraction pipeline pulls clause data from 80-page legal contracts. The loop's logic is: if stop_reason is tool_use, run tools; otherwise treat the response as the final answer. QA reports that roughly 5% of outputs are valid-looking JSON that simply ends mid-field. What is the root cause?

A) The model is hallucinating malformed JSON under load, so the pipeline needs a retry pass at temperature 0
B) The extraction schema is missing required fields, so the model improvises structure and stops generating early
C) The loop drops trailing content blocks whenever a response contains both text and tool_use together
D) The loop treats stop_reason max_tokens as completion; it must detect truncation and request a continuation

<details>
<summary>Answer & explanation</summary>

**D)** stop_reason max_tokens means the response was cut off at the token ceiling, not finished, and any branch that lumps everything other than tool_use together with end_turn will silently accept truncated output. Retrying at temperature 0 regenerates the same truncated result because the cause is the token limit, not randomness, and schema gaps would produce wrong structure, not output that stops mid-field.

*Hint if stuck: There are more stop_reason values than just tool_use and end_turn — one of them means the model was cut off.*
</details>

---

## Question 11
On a customer-support agent, the escalation message sent to customers has a typo ('recieve') in one string constant in escalation.py, and a snapshot test pins the exact text. The engineer wants it fixed quickly. How should this be run in Claude Code?

A) Plan mode, because customer-facing text should always be reviewed in a written plan
B) The Explore subagent first, to find every other string in the codebase with a typo
C) Direct execution: fix the constant and update the snapshot test in the same change
D) A new skill for copy edits, so that future typos in the agent follow a fixed process

<details>
<summary>Answer & explanation</summary>

**C)** A one-line fix with an obvious change and a test that covers it is direct-execution work; code review on the change still applies. Plan mode adds an approval step with nothing to decide. A repository-wide typo hunt and a new skill expand a trivial task into unrelated projects.

*Hint if stuck: How big is the change, and how many ways are there to make it?*
</details>

---

## Question 12
An extraction pipeline team keeps PII-masking conventions for parsers in .claude/rules/pii.md with paths: parsers/**/*.py. To be safe, someone pasted the same conventions into the root CLAUDE.md. After a policy change only the rule was updated, and Claude now gets two conflicting versions while editing parsers. What should the team do?

A) Keep both copies and ask reviewers to check that the two versions match on every pull request
B) Delete the rule and keep the copy in CLAUDE.md, since it loads at launch and is therefore seen first
C) Keep both copies and add a note to CLAUDE.md saying that the rule file wins whenever the two disagree
D) Delete the copy in CLAUDE.md and keep the path-scoped rule as the single source for these conventions

<details>
<summary>Answer & explanation</summary>

**D)** Duplicated instructions drift and conflict, and Claude may follow either version; the conventions only matter for parser files, so the scoped rule should be the single source. Keeping the CLAUDE.md copy loads PII conventions into unrelated sessions. A precedence note or a review checklist manages the duplication instead of removing it.

*Hint if stuck: Where should these conventions live exactly once?*
</details>

---

## Question 13
A support organisation wants automated QA on agent replies before they are sent for refunds above $200. The draft design has the support agent append 'Before sending, review your reply for policy compliance' to its own instructions. Policy violations still slip through at the same rate. What should the architect propose?

A) Make the self-review instruction more specific by listing all fourteen refund policy rules directly inside it
B) Route qualifying replies to a separate checker instance that compares the reply and case facts against the refund policy
C) Have the agent rate its own compliance from 1 to 10 and hold any reply that it scores below 8 for a human to check
D) Lower the threshold so that the self-review instruction applies to every refund reply the agent sends, and not only to the ones above $200

<details>
<summary>Answer & explanation</summary>

**B)** A separate checker that sees the reply, the case facts and the policy is not anchored on the agent's reasoning, so it catches violations the agent rationalised. Listing policy rules or widening the scope of self-review keeps the same blind spot, and self-rated compliance scores are poorly calibrated.

*Hint if stuck: The agent that made the decision is the weakest judge of it.*
</details>

---

## Question 14
A new hire at an insurance firm asks Claude Code to explain how a refund request moves through a legacy Java service with 2,000 files. The agent has begun reading every file under src/ in alphabetical order. Which approach should it take instead?

A) Grep for the refund route string to locate the entry point, then Read it and follow each call it makes
B) Read the build file and the README first, then infer the request path from the module list alone
C) Read files in order of size, smallest first, so more of the codebase fits before context runs out
D) Glob for every *Controller.java file and Read all of them in full, since controllers usually define the flow

<details>
<summary>Answer & explanation</summary>

**A)** Grep on the route string pins down the exact entry point, and reading outward from there follows the real execution path with only the files that matter. Reading every controller still loads many unrelated files. A README and module list describe structure but not the actual flow, and ordering reads by size is just a cheaper way of reading everything.

*Hint if stuck: Find one concrete anchor for the flow, then read outward from it.*
</details>

---

## Question 15
A research system must screen 25,000 papers for inclusion, then do a deep analysis using the team's own client-side data tools, on the few hundred that qualify, for a report due in a week. The team wants to minimise cost without missing the deadline. Which pipeline fits best?

A) Run the deep tool-assisted analysis on all 25,000 papers as one batch so that screening and analysis happen together
B) Screen with a Message Batch, then run the deep tool-assisted analysis synchronously on the qualifying papers only
C) Skip screening and run the deep analysis synchronously on every paper, since a week is enough time to finish it
D) Screen all 25,000 papers synchronously so that the shortlist is ready quickly, then batch the deep analysis afterwards

<details>
<summary>Answer & explanation</summary>

**B)** Screening is single-turn, high-volume and non-urgent, which is ideal for a batch, while the deep analysis needs tool calls mid-task, which a batch request cannot do when the tools run in the team's own code, so it runs synchronously on the small shortlist. Batching the tool-assisted analysis cannot run the tools, synchronous screening pays double on the largest stage, and analysing every paper in depth wastes most of the budget.

*Hint if stuck: Separate the work that needs tools from the work that does not.*
</details>

---

## Question 16
A CI pipeline agent streams Claude's responses into a build log. The loop's rule is: if the response contains any text block, post it as the final summary and exit; otherwise execute tools. Builds frequently end with summaries like 'Now I will run the test suite to confirm' while the test tool never executes. What is the flaw?

A) Streaming splits text across multiple deltas, so the loop observes text before the tool blocks finish parsing
B) The system prompt should instruct the model to never produce text in the same turn as a tool call
C) max_tokens is truncating each response after the text block but before the tool_use block arrives
D) Text and tool_use blocks legitimately coexist in one response; stop_reason, not the content, tells the loop what to do next

<details>
<summary>Answer & explanation</summary>

**D)** A response with stop_reason tool_use routinely carries narrative text alongside its tool_use blocks, so the mere presence of text says nothing about completion — the rule fails even on a fully assembled, non-streamed response, which makes the delta-ordering theory a red herring. Branching on stop_reason is deterministic and correct, whereas prompting the model to suppress accompanying text fights normal, useful behavior and remains best-effort.

*Hint if stuck: Ask which field of the response is the contract for the loop's next action — it is not the content array.*
</details>

---

## Question 17
A developer asks Claude to work out why the team's build time doubled over the past month. The repository has 300 packages and a custom build graph. Which first step gives the investigation the best chance of finding the cause efficiently?

A) Ask Claude to read the build configuration of every package in alphabetical order and report anything unusual that it notices
B) Ask Claude to map the build graph and measure where the time now goes, then plan deeper investigation of the highest-cost areas
C) Ask Claude to propose the ten most common causes of slow builds and then check each of them one at a time against the repository
D) Ask Claude to revert the last month of build-related commits one at a time until the build time returns to what it was before

<details>
<summary>Answer & explanation</summary>

**B)** Open-ended diagnosis starts by mapping the system and finding where impact is concentrated, then planning from there. Reading every package spends equal effort everywhere, a checklist of common causes is a fixed plan built on guesses, and reverting commits one by one is slow and ignores what the data would show.

*Hint if stuck: Find where the time is going before deciding where to look.*
</details>

---

## Question 18
A document-processing service receives a mix of invoices, purchase orders and signed contracts in the same inbox. A single extraction prompt handles all three and its accuracy on contracts is poor because the instructions are dominated by invoice rules. What decomposition should the team use?

A) Add more contract examples to the shared prompt so the model has a stronger sense of what contract fields look like
B) Classify each document first, then send it to an extraction chain written specifically for that document type and its fields
C) Ask the model to state which document type it thinks it has at the top of its output, then continue extracting in the same prompt
D) Process every document with all three extraction prompts and keep the output from the prompt that fills the most fields

<details>
<summary>Answer & explanation</summary>

**B)** Distinct input categories handled better by specialised prompts call for a routing step followed by type-specific chains. More examples in the shared prompt still mix competing instructions, running all three prompts triples cost and picks winners on a misleading signal, and self-labelling inside the same prompt leaves the instructions just as tangled.

*Hint if stuck: Different kinds of document may deserve different instructions.*
</details>

---

## Question 19
A coordinator explores an unfamiliar 2-million-line codebase for a new engineer by spawning one explorer subagent per top-level directory. The resulting onboarding guide never mentions the shared/ library that every service imports, because shared/ lives outside the directories that were assigned. Which change best prevents this class of miss?

A) Raise each explorer's maximum turns so it has time to follow imports into code outside its assigned directory
B) Ask each explorer to list the external modules its area depends on, and have the coordinator assign any unowned ones
C) Add a final subagent that reads the whole repository in one pass to catch anything the per-directory explorers happened to miss
D) Switch to one explorer per file type, such as Python, YAML and SQL, so every file in the repository has an owner

<details>
<summary>Answer & explanation</summary>

**B)** Having explorers report outward dependencies gives the coordinator what it needs to spot unowned areas and assign them, closing the coverage gap with a check rather than luck. More turns only make it more likely that an explorer wanders outside its scope. A single whole-repository reader brings back the context overload that decomposition was meant to avoid, and slicing by file type still leaves shared logic split with no owner.

*Hint if stuck: The coordinator can only fill gaps it knows about; who can tell it where they are?*
</details>

---

## Question 20
A scout subagent finds a single trade-blog post claiming a major chipmaker will exit the memory market; no other source mentions it. The synthesizer is currently prompted to 'include only verified facts', so it drops the claim, and the client later says they would have wanted to know. How should the system handle such claims?

A) State the claim as a finding in the main report body, since the scout found it during research and the client wants complete coverage
B) Keep dropping such claims, since including unverified information in a research report is always worse than leaving it out
C) Include the claim with its source, and label it clearly as single-source and unverified in a separate section of the report
D) Have another subagent search until it finds a second source, and keep the claim out of the report unless one is eventually found

<details>
<summary>Answer & explanation</summary>

**C)** Uncertain claims should be kept visible with attribution and a clear label, so readers can weigh them rather than miss them. Dropping the claim loses signal the client wanted, presenting it as a finding overstates it, and making inclusion depend on finding a second source reverses the problem: a real but thinly covered signal may never get one.

*Hint if stuck: Uncertainty is information to label, not to delete.*
</details>

---

## Question 21
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

## Question 22
A CI job has Claude Code call an MCP lint tool on changed files. The tool returns isError true whenever it finds lint violations, with the violations listed in the message. Claude has started reporting 'linting could not be run' on PRs that actually have violations, and skips commenting on them. What is the correct fix?

A) Tell Claude in the CI prompt that lint errors with isError true still contain useful findings, and that it should read them before deciding what to post
B) Return violations as a normal successful result, and use isError only when the linter itself could not run, for example on a crash or a missing config
C) Have the tool return isError true only when there are more than ten violations, so that small numbers of findings are reported as normal results
D) Split the tool into run_lint and get_lint_violations, so that the second call fetches the findings separately once the first call has reported an error

<details>
<summary>Answer & explanation</summary>

**B)** isError means the tool call failed, not that the tool found problems; a linter that ran successfully and found violations has succeeded. Returning findings as a normal result and reserving isError for real failures makes the signal mean one thing. A prompt rule asks Claude to second-guess the flag, a threshold makes the flag's meaning depend on counts, and splitting the tool adds a call without fixing the misuse of the flag.

*Hint if stuck: Ask what isError should mean, and whether finding problems is the same as failing.*
</details>

---

## Question 23
Claude Code read config/routes.ts, then the editor's format-on-save reflowed the file. When Claude tries to Edit a route using the text it read earlier, the edit fails because old_string no longer matches. What is the right recovery?

A) Disable format-on-save for the rest of the session so the cached copy of the file stays accurate
B) Write the whole file from the earlier read with the route change applied, overriding the formatter's reflow
C) Re-read the file to get its current text, then retry the Edit with an old_string copied from that read
D) Shorten old_string to the route's path string alone so formatting differences no longer matter

<details>
<summary>Answer & explanation</summary>

**C)** The file changed on disk, so the agent needs a fresh read and an old_string taken from the current content. Writing from the stale copy would silently undo the formatter's changes and anything else that changed. Disabling tooling to keep a stale copy valid treats the symptom, and a bare path string may not be unique or may still differ after reflow.

*Hint if stuck: When the file has moved on, your view of it has to move on too.*
</details>

---

## Question 24
A platform team built an internal developer assistant with the Agent SDK that can run database migrations through apply_migration. Policy says a backup snapshot must be taken first via create_snapshot. In a demo the assistant ran a migration without a snapshot after the developer said they had 'just taken one manually.' How should the workflow be enforced?

A) Add to the system prompt that developer claims about manual snapshots must never be trusted, and that create_snapshot is required every time
B) Ask the developer to type CONFIRM before each apply_migration call so that a person takes responsibility for the snapshot step in the chat
C) Have the assistant post a checklist reply before each migration that lists the snapshot as done or pending, so reviewers can audit it
D) Have apply_migration look up a snapshot record for the target database newer than a set window and refuse to run when none is found

<details>
<summary>Answer & explanation</summary>

**D)** A prerequisite with real consequences belongs in code that checks for evidence it happened, here a recent snapshot record for the target database, instead of trusting anyone's word. A prompt rule can still be talked around, a typed confirmation checks the developer's attention rather than the snapshot's existence, and a checklist reply is only the model's own claim.

*Hint if stuck: Ask what the gate should verify: a statement, or the state of the system.*
</details>

---

## Question 25
A new engineer at a payments company asks Claude Code to map everywhere the deprecated applyLegacyFee function is still called across a 1,200-file repository before deleting it. Which workflow is the right one for the agent to follow?

A) Read every file under src/ sequentially so that no call site can possibly be missed
B) Glob for **/*.ts and then Read each matched file in order until the function appears
C) Use Bash to cat the entire src tree into the context window and analyze all the call sites together in one pass
D) Grep for applyLegacyFee to find the call sites, then Read only the matching files to trace each usage

<details>
<summary>Answer & explanation</summary>

**D)** The canonical discovery flow is Grep to locate usages by content, then Read to trace only the files that matter. Reading or catting hundreds of files floods the context window and degrades reasoning long before coverage is achieved. Glob is the wrong first step here because the question is about content (call sites), not file path patterns, and reading every match in order repeats the same context flooding.

*Hint if stuck: Search narrows the candidates and reading traces them — think about the order of operations.*
</details>

---

## Question 26
A support organisation uses Claude both to answer customers live in chat and to score yesterday's 40,000 closed conversations for quality coaching, which supervisors read at 10 AM. Finance asks to move everything to the Message Batches API for the discount. What should the architect recommend?

A) Move both workloads to batches, and show chat customers a message saying a reply will arrive within the next day
B) Batch the live chat replies in small groups every minute so that customers wait only briefly for the discount
C) Batch the overnight quality scoring and keep the live chat replies on synchronous calls where customers are waiting
D) Keep both workloads synchronous, because mixing batch and synchronous calls makes the system harder to operate

<details>
<summary>Answer & explanation</summary>

**C)** The quality scoring is non-blocking work with a morning deadline, which suits the batch discount, while live chat has a customer waiting and needs synchronous responses. Batches have no latency guarantee, so small batches or delayed replies break the live experience, and keeping everything synchronous gives up a large saving for no real operational gain.

*Hint if stuck: Ask which of the two jobs has a person waiting on it.*
</details>

---

## Question 27
An extraction subagent processes a 40-page loan application and fails on pages 31 to 40 because they are scanned images it cannot read. It currently returns only 'extraction failed.' What should its failure report to the orchestrator contain?

A) The fields it did extract from pages 1 to 30, which pages failed and why, and suggested alternatives such as OCR
B) Just the failure message, since the orchestrator should simply re-run the whole document from page 1 when it sees it
C) A complete record where the unreadable fields are filled with their most likely values based on similar applications
D) A detailed apology explaining that scanned pages are a known limitation and that the document cannot be processed

<details>
<summary>Answer & explanation</summary>

**A)** A useful failure report carries the failure type, what was tried, the partial results and possible alternatives, so the orchestrator can recover without redoing good work. A bare message forces a full rerun that will fail again, invented values hide the gap, and an apology gives the orchestrator nothing actionable.

*Hint if stuck: What would the orchestrator need to recover without starting over?*
</details>

---

## Question 28
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

## Question 29
An extraction pipeline reads purchase orders. Some orders list two different delivery dates (one in the header, one in the line items) and the pipeline must emit a single delivery_date. The batch runs unattended overnight. How should the extractor handle these documents?

A) Emit the field with both candidate values and a conflict flag so the document routes to human review
B) Take the later of the two dates, since that is the safer commitment for the buyer to plan around
C) Take the header date, since headers are more authoritative, and continue without flagging the document
D) Leave the delivery_date field out of the record entirely so downstream systems treat it as unknown

<details>
<summary>Answer & explanation</summary>

**A)** With no human in the loop, ambiguity should be captured explicitly and routed for review rather than resolved by a silent rule. Picking the header or later date is a guess that downstream systems will trust, and dropping the field loses the evidence a reviewer would need to decide.

*Hint if stuck: When no one can be asked, make the ambiguity visible.*
</details>

---

## Question 30
A fintech support agent has a process_refund tool. The system prompt states refunds above $200 require manager approval, yet logs show the agent issued a $480 refund last week after a persuasive customer message. Compliance now requires that over-cap refunds can never execute. What should the architect implement?

A) A PreToolUse hook on process_refund that checks the amount and exits with code 2 when it exceeds $200, writing the violation to stderr
B) A refund policy moved to the very top of the system prompt and repeated in CLAUDE.md, in bold, so the model cannot miss the $200 limit on any refund
C) A second model pass that reviews every pending refund and approves or rejects it before execution
D) A temperature of 0 on the support agent so it follows the refund policy more consistently

<details>
<summary>Answer & explanation</summary>

**A)** Critical business rules like refund caps belong in hooks because hooks are deterministic code that guarantees enforcement, while prompt instructions are probabilistic best-effort. Exit code 2 blocks the tool call and the stderr message is fed back to the model so it can adapt. The second-model reviewer is the strongest distractor, but it is still a probabilistic component and cannot guarantee zero violations, and temperature 0 changes sampling, not whether the model can be persuaded.

*Hint if stuck: Think about which mechanism is deterministic rather than probabilistic when a business rule must never be violated.*
</details>

---

## Question 31
In a repo with apps/web and apps/mobile, both apps must follow the same design-token rules. Those rules currently live only in apps/web/CLAUDE.md, alongside web-only conventions. When an engineer launches Claude Code in apps/mobile, the token rules are missing. What is the cleanest fix?

A) Copy the token rules into apps/mobile/CLAUDE.md so each app's own memory file is fully self-contained
B) Ask mobile engineers to launch Claude Code from apps/web so they pick up the web app's memory file
C) Move the token rules into apps/CLAUDE.md or the root CLAUDE.md, a shared ancestor of both apps
D) Add an @import of apps/web/CLAUDE.md into the mobile file, so mobile loads all of the web app's rules

<details>
<summary>Answer & explanation</summary>

**C)** Ancestor CLAUDE.md files load for any session started beneath them, so placing shared rules in a common parent covers both apps from one copy. Copying them creates two versions that will drift. Launching from the wrong app or importing the whole web file also brings in web-only conventions that do not apply to mobile.

*Hint if stuck: Shared rules belong at the lowest level that both consumers sit under.*
</details>

---

## Question 32
A CI test-generation agent writes unit tests and needs to run the suite on almost every iteration to see if they pass. It was given unrestricted Bash for this, and in one run it installed a new testing framework and changed the CI config. What is the best way to meet its frequent need?

A) Keep unrestricted Bash but add to the prompt that only the test command may be run and nothing else
B) Keep unrestricted Bash but review the agent's command history weekly and tighten the prompt as needed
C) Remove the ability to run tests and have a separate job report failures back on the next pipeline run
D) Replace general Bash with a run_tests tool that runs the project's test command and returns the results

<details>
<summary>Answer & explanation</summary>

**D)** The role needs one frequent capability, running tests, so a scoped tool shaped to that need serves it without granting arbitrary shell. A prompt limit over full Bash remains probabilistic. Removing test runs slows the loop to one iteration per pipeline, and weekly history review finds misuse after it has already changed the CI config.

*Hint if stuck: Match the tool to the single action the role repeats.*
</details>

---

## Question 33
A platform team is writing a review checklist for every new tool definition submitted to their internal agent catalogue. One draft entry has a clear verb-noun name and a typed input schema, but its description is a single line: 'Gets customer orders.' Which addition to the checklist would most improve how reliably agents pick and use these tools?

A) Require that every tool name be fewer than twenty characters and use a standard verb from an approved list, such as get, list, create or delete
B) Require that descriptions cover what the tool does, what each input means and its format, what it returns, edge cases, and when not to use it
C) Require that descriptions stay under one sentence so that they take less context when an agent has many tools loaded at the same time
D) Require that every tool be accompanied by a matching system-prompt paragraph that tells agents in which situations the tool should be used

<details>
<summary>Answer & explanation</summary>

**B)** Detailed descriptions are the most important factor in tool performance: purpose, inputs with formats, outputs, edge cases and when not to use the tool are what the model uses to select and call it correctly. Name rules help a little but cannot carry that information, one-sentence limits work against it, and separate system-prompt paragraphs scatter tool guidance away from the definition and can introduce keyword pulls.

*Hint if stuck: What does the model actually read when it chooses a tool?*
</details>

---

## Question 34
A developer asks Claude Code to write a `parseShipDate` helper for a logistics app. The first version passes the happy path, but QA reports it crashes on an empty string, silently accepts "2025-02-30", and returns local time for inputs that carry a UTC offset. The developer's follow-up prompt so far reads "make it handle edge cases properly." What should the developer send instead?

A) A switch to plan mode so Claude can research date-handling libraries before writing a fresh version of the helper
B) A request that Claude review its own helper carefully and list every edge case it can think of before changing the code
C) A longer prose paragraph explaining that dates must be validated strictly and timezone offsets must always be respected
D) A list of the exact problem inputs paired with the expected output for each, asking Claude to add them as test cases and run them

<details>
<summary>Answer & explanation</summary>

**D)** Exact inputs with expected outputs (empty string returns null, "2025-02-30" is rejected, offsets are preserved) remove ambiguity and give Claude a check it can run and iterate against. A longer prose paragraph is still open to interpretation, self-listing edge cases relies on the same judgment that missed them, and plan mode adds research overhead to what is a small, well-defined fix.

*Hint if stuck: Show Claude the precise cases and what success looks like for each, in a form it can verify.*
</details>

---

## Question 35
Claude Code's first pass at a CSV export endpoint has three issues: the header row uses internal column names, dates are in local time instead of UTC, and the filename lacks the report date. Each is a separate concern in a different function. The developer wants to describe all three at once to save time. What is the best approach?

A) Describe all three in one message and accept whatever combined diff Claude produces, since they are small
B) Ask Claude to rewrite the endpoint from scratch with the three issues listed as extra requirements
C) Address them one by one, with expected output for each, checking each fix before moving to the next
D) Ask Claude which of the three it thinks matters most and fix only that one before shipping the endpoint

<details>
<summary>Answer & explanation</summary>

**C)** Independent issues are best fixed in sequence, each with a clear expected result, so every change is small and verified before the next. Bundling them gives a larger diff that is harder to check, a rewrite risks breaking what already works, and fixing only one ships known defects.

*Hint if stuck: Separate concerns can be fixed and verified separately.*
</details>

---

## Question 36
A logistics support agent has a check_atp tool described as 'Returns ATP for a SKU at a node.' Agents answer 'is this in stock near me?' questions inconsistently: sometimes they call it, sometimes they call get_product instead, and they misread a negative ATP value as an error. What should the architect change?

A) Shorten the description to 'Stock lookup' so that it matches the words customers actually use when they ask whether an item is available near them
B) Add a system-prompt glossary of internal supply-chain terms like ATP and node, so that the agent understands the vocabulary in every conversation
C) Rename the tool to check_stock and keep the original description, since the name is what the model reads when deciding which tool to call for a stock question
D) Rewrite the description as you would for a new hire: what ATP means, what a node is, when to use it instead of get_product, and what negative values mean

<details>
<summary>Answer & explanation</summary>

**D)** Descriptions should explain specialised terms, inputs, outputs and relationships to other tools, as if onboarding a new team member. Jargon like ATP and node gives the model nothing to match on, and nothing explains negative values. A glossary in the system prompt sits apart from the tool and does not say when to prefer this tool, and a better name alone or a two-word description still leaves the output unexplained.

*Hint if stuck: Imagine handing this tool to a capable new hire who has never seen the warehouse system.*
</details>

---

## Question 37
At a media company, Claude Code keeps suggesting moment.js even though the repo's CLAUDE.md never mentions it and the team removed the library a year ago. Engineers have searched the project's CLAUDE.md files and found nothing. What is the most effective first diagnostic step?

A) Delete and recreate the project CLAUDE.md from scratch so any hidden stale content is removed
B) Add a line to the project CLAUDE.md that says never use moment.js and see if the suggestions stop
C) Run /memory to see which memory files are loaded, including user-level and parent-directory files
D) Grep the git history of the project CLAUDE.md for moment.js to find when the line was deleted

<details>
<summary>Answer & explanation</summary>

**C)** The instruction is coming from somewhere outside the files the team checked, and /memory shows every memory file actually loaded, such as a personal ~/.claude/CLAUDE.md or one in a parent directory. Adding a counter-instruction leaves a contradiction in place without finding its source. Recreating or searching the history of the project file looks in the one place already ruled out.

*Hint if stuck: Before fixing an unexpected instruction, find out where it is coming from.*
</details>

---

## Question 38
A support-transcript pipeline flags messages that appear to contain payment card numbers, returning pii_flagged as true or false. Compliance reports a wave of false positives — 16-digit order IDs being flagged — but analysts cannot diagnose them because the output never indicates what triggered each flag. Which change best enables false-positive analysis?

A) Add a detected_pattern field that records the exact text span and pattern type that triggered each flag
B) Add a confidence score between 0 and 1 so analysts can filter out low-confidence flags before reviewing
C) Tighten the flagging instructions in the prompt so that only unambiguous card numbers are ever flagged
D) Have a second model re-check every flagged message and silently overwrite any flags it disagrees with

<details>
<summary>Answer & explanation</summary>

**A)** Diagnosing false positives requires seeing what the model thought it matched; a detected_pattern field turns each flag into auditable evidence that analysts can classify as a true card number or an order ID. Self-reported confidence scores are poorly calibrated and explain nothing about the trigger, while prompt tightening and second-model overwrites change behavior without ever revealing why misfires occur — and silent overwrites hide the evidence entirely.

*Hint if stuck: Analysts cannot classify a misfire without seeing the evidence the model believed it found.*
</details>

---

## Question 39
Two developers both resume the same Claude Code session, one on each terminal of a shared dev box, to explore a database connection leak from different angles. Afterwards the transcript is a confusing mix of both lines of questioning. What should they have done?

A) Taken turns, with each developer running /compact before handing the session over to the other developer to continue
B) Each resumed with --fork-session so that both got their own session ID and history starting from the shared analysis
C) Agreed to prefix every prompt with their own name so that the agent could keep the two lines of questioning separate
D) Resumed with --continue instead of --resume, since --continue keeps a separate history for each terminal that uses it

<details>
<summary>Answer & explanation</summary>

**B)** Resuming one session in two places without forking interleaves both conversations into one transcript; forking gives each developer an independent branch from the same baseline. Taking turns with /compact still merges the two lines of work, name prefixes are a soft convention on a shared history, and --continue reopens the same most-recent session rather than isolating terminals.

*Hint if stuck: Parallel lines of work from one starting point need separate branches.*
</details>

---

## Question 40
A mortgage team extracts policy numbers from scanned insurance declarations. About 4 percent of scans are cropped so the last digits of the policy number are cut off the page. The validator rejects those outputs, and the retry-with-feedback loop runs three times before failing each one. What should the architect change?

A) Increase the retry count for this field only, since the model sometimes recovers the full number on its fourth or fifth attempt
B) Include the validator's error and a description of the expected policy-number pattern in each retry so the model can rebuild the missing digits
C) Relax the validator so that partial policy numbers are accepted and leave it to the underwriting team to look them up later by hand
D) Recognise when the value is not recoverable from the source, stop retrying, and send the document back for a rescan with a clear reason

<details>
<summary>Answer & explanation</summary>

**D)** Retries cannot recover information that is not in the source; when the digits are cut off, the right action is to stop retrying and fix the input with a clear reason. Richer feedback only pressures the model to invent digits, accepting partial numbers pushes silent errors downstream, and a fourth attempt that succeeds on missing data is a fabrication, not a recovery.

*Hint if stuck: Ask whether the answer is anywhere in the document before asking the model again.*
</details>

---

## Question 41
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

## Question 42
A news-monitoring research system has a subagent that, when a source fails to load, quietly replaces it with the next search result so it always returns five sources. Reports look complete, but editors find that some cited sources are weaker substitutes for the ones requested. What is the best change?

A) Keep substituting sources, but ask the subagent to choose substitutes from a list of reputable outlets only
B) Stop substituting and abort the subagent's whole task whenever any single source fails to load properly
C) Have the subagent report the failed source and what it substituted, so the coordinator and readers can see the swap
D) Raise the number of sources per subagent to ten, so a few failures do not affect the overall report quality

<details>
<summary>Answer & explanation</summary>

**C)** Silent substitution hides a failure behind a result that looks normal; the subagent should report the failure and any fallback explicitly so it can be weighed. A reputable-outlets list still hides the swap, aborting on any failure discards good sources, and fetching more sources does not make the substitutions visible.

*Hint if stuck: A workaround can be fine; hiding it is not.*
</details>

---

## Question 43
A team's project CLAUDE.md includes CI-only instructions: never ask clarifying questions, and print findings as a JSON array. Engineers using Claude Code interactively now get JSON arrays instead of explanations and are never asked to clarify ambiguous requests. Where should the CI-only instructions live?

A) In the CI invocation itself, through the prompt or --append-system-prompt, leaving CLAUDE.md for shared conventions
B) In a directory-level CLAUDE.md under .github/ so the instructions load only when CI is running in the repo
C) In a section of CLAUDE.md that begins with: if you are running in CI, follow the instructions below
D) In each engineer's ~/.claude/CLAUDE.md, with a line that tells Claude to ignore the project's CI section

<details>
<summary>Answer & explanation</summary>

**A)** Instructions that apply only to automated runs belong in the CI call, where they reach just that invocation, while CLAUDE.md keeps conventions every session should follow. A CLAUDE.md under .github/ loads based on which files Claude touches, not whether it is in CI. Conditional prose relies on Claude detecting its environment, and per-engineer overrides leave a contradiction in every local session.

*Hint if stuck: Ask which instructions apply to every session and which apply to one kind of run.*
</details>

---

## Question 44
A developer productivity agent generates deployment config entries, and its `environment` field is a free string. Engineers find "prod", "Production", "PRD" and "live" in the same repository, and the deploy tool only recognizes three exact values. What is the most effective fix?

A) Add a lookup table in the deploy tool that maps every spelling seen so far to the three recognized values
B) Ask the agent in the prompt to always spell environments in the same way as the other files in the repo
C) Rename the field to `deployment_environment` so the agent better understands which value it should use
D) Change the field to an enum of the three values the deploy tool accepts, with a description of each

<details>
<summary>Answer & explanation</summary>

**D)** An enum restricts the output to exactly the values the deploy tool accepts, and descriptions help the model map intent to the right value. A lookup table chases spellings that keep appearing, a prompt request is not enforced, and renaming the field does not limit the values.

*Hint if stuck: If only a fixed set of values is valid, make the schema say so.*
</details>

---

## Question 45
A media company is running an 8-hour Claude Code session migrating 200 analytics reports to a new SQL dialect. The context keeps filling with thousands of lines of grep output and test logs, and by hour four the agent's answers turn slow and generic. Which working pattern addresses the root cause?

A) Raise max_tokens on every request so the model has more room to reason over the long accumulated history of the session
B) Switch the session over to Claude Opus, since its deeper reasoning capacity handles long accumulated contexts without degrading
C) Restart the session every hour and paste the previous transcript into the new session as a primer to maintain continuity
D) Persist findings to scratchpad files, run /compact at phase boundaries, and delegate verbose exploration to subagents

<details>
<summary>Answer & explanation</summary>

**D)** The root cause is verbose intermediate output bloating the main context: scratchpad files externalize durable facts, /compact condenses at milestones, and subagents keep noisy exploration in isolated contexts so raw logs never enter the main session. max_tokens governs output length rather than input degradation, switching models does not stop context bloat from degrading recall, and pasting an old transcript into a fresh session simply reimports the bloat.

*Hint if stuck: The cure is keeping verbose intermediate output out of the main context, not making the context or the model bigger.*
</details>

---

## Question 46
A release pipeline asks Claude to turn merged PR titles into user-facing changelog lines. Product wants each line in plain language, grouped under Added, Changed or Fixed, with internal ticket numbers removed. Output varies: some lines keep jargon, some keep ticket IDs, and grouping headers change names between releases. What change gives the most consistent output?

A) Write a longer description of what plain language means for the product's audience, with a list of jargon words that must be removed
B) Add a short example changelog built from real PR titles, showing the three headers and how jargon and ticket IDs are rewritten
C) Strip ticket IDs from PR titles with a regex before sending them, and let the model handle the grouping and wording as it does now
D) Have a second model call check the changelog against the rules and send it back for another attempt whenever it finds a violation

<details>
<summary>Answer & explanation</summary>

**B)** A worked example from real PR titles shows the headers, the tone and the removal of ticket IDs in one place, which is the most reliable way to get repeatable format. A longer description and jargon list stay abstract, a checking loop adds cost while the generator remains inconsistent, and a regex fixes only the ticket IDs while the headers and jargon keep drifting.

*Hint if stuck: One concrete before-and-after can carry several formatting rules at once.*
</details>

---

## Question 47
A developer-tools team notices that their in-IDE assistant, which explains a selected code block when a developer presses a hotkey, is their largest cost line. A manager proposes moving those requests to the Message Batches API to halve the cost. What should the architect say?

A) Agree, as long as the IDE plugin polls frequently enough that most explanations still arrive within a few seconds
B) Disagree: a developer is waiting on each explanation, and batches give no latency guarantee, so it must stay synchronous
C) Agree, and add a loading spinner so that developers understand that explanations can take a little longer to arrive from the API
D) Agree, but only for explanations of very large code blocks, since those are the most expensive individual requests

<details>
<summary>Answer & explanation</summary>

**B)** Interactive requests with a person waiting must stay synchronous, because batches can take up to 24 hours with no latency guarantee. Frequent polling does not speed up processing, large blocks still have a developer waiting on them, and a spinner cannot hide a delay that might be hours long.

*Hint if stuck: Discounts that come with no promise about timing only fit work nobody is watching.*
</details>

---

## Question 48
A monorepo's CI reviewer comments on performance in one-off maintenance scripts under /scripts, which run once a quarter. The team only cares about performance in request-handling code under /services. What change best removes these comments?

A) Tell the reviewer to focus on the most important performance issues in each PR and not to waste comments on the minor ones
B) Ask the reviewer to mark performance comments in scripts as low priority so developers know to skip them
C) Disable the performance category for the whole repository, since most of its comments are not useful
D) Scope the performance criteria to request-handling code under /services, and state that /scripts is out of scope

<details>
<summary>Answer & explanation</summary>

**D)** The comments are false positives because the reviewer does not know where performance matters; scoping the criteria to /services and excluding /scripts fixes that precisely. "Most important" is undefined, labeling them low priority keeps the noise, and disabling the category would lose the request-path findings the team wants.

*Hint if stuck: Say where the rule applies, not just how hard to apply it.*
</details>

---

## Question 49
An e-commerce catalog-enrichment agent processes 3,000 product listings in one long-running session. After a crash at item 1,900, the restarted agent began again at item 1 and double-wrote records into the catalog database. What fixes the recovery problem?

A) Maintain a structured manifest of item ids, per-item status, and partial results as items complete, so restarts resume from the manifest
B) Persist the full conversation transcript to disk continuously and on restart replay it through the model so the agent recalls where it stopped
C) Add a system-prompt instruction telling the agent to keep careful track of which catalog items it has already finished processing
D) Split the run into 30 separate sessions of 100 items each so that any single crash costs at most 100 items of repeated work

<details>
<summary>Answer & explanation</summary>

**A)** Durable progress state belongs in a structured manifest outside the model's context: restart logic reads it deterministically and resumes only pending items, eliminating both rework and double writes. Replaying a transcript is slow and reconstructs bloated context rather than state, a prompt instruction dies with the crashed session, and chunking merely shrinks the blast radius while a crash mid-chunk still double-writes.

*Hint if stuck: Recovery state should live in a deterministic artifact outside the model's context, not in its memory.*
</details>

---

## Question 50
A customer support resolution agent built on the Claude API runs an agentic loop. The implementation scans each assistant response for the phrase "Ticket resolved" to decide when to stop, and caps the loop at 4 iterations as its primary completion control. Tickets sometimes close while the agent still had a pending tool call, and complex tickets get cut off mid-investigation. Which change fixes the loop?

A) Raise the iteration cap to 12 and require the agent to print TICKET RESOLVED in capital letters on its own line before the loop is allowed to exit
B) Set tool_choice to "any" on every request so the agent always calls a tool and the loop can never end prematurely on a text-only response
C) Drive the loop off stop_reason — continue on "tool_use" by executing tools and resending history, finish on "end_turn" — keeping the cap as a safety fallback
D) Treat any response containing a text block as the final answer and end the loop there, on the assumption that tool-calling turns contain only tool_use blocks

<details>
<summary>Answer & explanation</summary>

**C)** The loop's control signal is stop_reason, not assistant prose: "tool_use" means execute and continue, "end_turn" means done, and iteration caps are safety fallbacks rather than primary controls. Parsing text for a completion phrase is unreliable, and ending on any text block fails because responses can legitimately contain text and tool_use blocks together. Forcing tool_choice "any" prevents the loop from ever ending naturally, and raising the cap just patches the same broken signal.

*Hint if stuck: The API already gives you a machine-readable completion signal — do not infer completion from prose.*
</details>

---

## Question 51
A nightly reporting agent gathers metrics through several tools, and its final request is supposed to produce a prose executive summary. In 12% of runs the model issues yet another tool call on that final request instead of writing the summary. What is the cleanest fix?

A) Add a prompt line to the final request: "You have all the data you need; do not call any more tools"
B) Cap the agentic loop at ten iterations so a runaway tool call cannot extend the nightly run
C) Set tool_choice to "none" on the final summarization request so the model must respond with text
D) Set tool_choice to "any" on the final request so the model finishes its remaining tool work faster

<details>
<summary>Answer & explanation</summary>

**C)** tool_choice "none" is the deterministic mechanism for a turn where a tool call must not happen: the model can only respond with text, which is exactly what the summary step requires. The prompt instruction is probabilistic and is essentially the behavior already failing 12% of the time. Iteration caps are safety fallbacks rather than primary control, and "any" mandates the exact behavior being prevented.

*Hint if stuck: tool_choice has a mode for the turn where a tool call is exactly what you do not want.*
</details>

---

## Question 52
An on-call assistant investigates latency incidents using a fixed six-step pipeline: check CPU, check memory, check database, check cache, check network, summarise. For last week's spike the real cause was a misconfigured feature flag in a downstream service, which no step looks at, and the summary blamed the cache. What change addresses the underlying problem?

A) Add a seventh fixed step that checks feature flags
B) Switch to an adaptive investigation that generates its next subtasks from what each step finds
C) Increase max_tokens so the summary step can consider more possibilities
D) Run all six steps in parallel to finish faster and leave time for a manual check of the summary afterward

<details>
<summary>Answer & explanation</summary>

**B)** Incident investigation is open-ended: the right next step depends on the evidence so far. A fixed pipeline, however long, only finds causes someone predicted; adding a seventh step fixes last week's incident and not the next unknown one. More tokens or parallelism do not change what gets investigated.

*Hint if stuck: The pipeline can only find what its author predicted.*
</details>

---

## Question 53
A developer-productivity team wants a weekly report of stale TODO comments posted as an issue in their repo every Monday, with no one needing to ask for it. They have claude-code-action installed, and today it only responds when someone comments @claude. What should they configure?

A) A CLAUDE.md line telling Claude to post a TODO report whenever it runs on a Monday in this repository
B) A Monday reminder for one engineer to open an issue and comment @claude asking for the TODO report
C) A trigger_phrase change to TODO so that any TODO comment in the code starts a Claude run automatically
D) A workflow on a cron schedule that gives the action its task directly, so it runs in automation mode

<details>
<summary>Answer & explanation</summary>

**D)** When the workflow supplies the task itself, the action runs in automation mode on any event, including a schedule, without waiting for a mention. A calendar reminder keeps a human in the loop for a mechanical task. The trigger phrase applies to comments, not code contents, and CLAUDE.md cannot start a run that nothing triggers.

*Hint if stuck: Interactive mode waits for a mention; something else runs on events.*
</details>

---

## Question 54
A loan-processing coordinator establishes early in its run that an applicant's documents use DD/MM/YYYY dates and records this finding in its conversation. It then spawns an income-extractor subagent that reads 03/04/2025 as March 4 and mis-dates the pay stubs. What is the correct fix?

A) Have the income-extractor independently re-derive the date convention from the documents before extracting
B) Enable extended thinking on the extractor so it reasons its way to the right format
C) Upgrade the extractor's model from Haiku to Opus so it stops making date-format mistakes
D) Include the established DD/MM/YYYY determination explicitly in the extractor's task prompt

<details>
<summary>Answer & explanation</summary>

**D)** The coordinator's finding never reached the subagent: subagent contexts are isolated, and nothing from the parent conversation is inherited, so validated facts must be packed into the task prompt explicitly. Having the extractor re-derive the convention duplicates work the hub already did and can land on a different answer for ambiguous documents. Extended thinking and bigger models are probabilistic mitigations for what is a missing-information problem.

*Hint if stuck: Decide whether this is a reasoning failure or an information-delivery failure.*
</details>

---

## Question 55
A support agent built on the Agent SDK registers an orders MCP server under the key orders in mcpServers. To auto-approve its search tool, the developer added search_orders to allowedTools, but every call still stops for a permission decision in the headless service. What is wrong?

A) The allowedTools entry must use the full name mcp__orders__search_orders rather than the bare tool name
B) MCP tools cannot be auto-approved at all, so the service must handle permission requests in a callback
C) The server must be moved into a project .mcp.json file, because allowedTools only applies to file-based servers
D) The tool needs to be renamed on the server to orders_search_orders so the SDK can match it to its server

<details>
<summary>Answer & explanation</summary>

**A)** MCP tools are named mcp__<server-name>__<tool-name>, and permission rules must use that full name, so the bare search_orders entry matches nothing. MCP tools can be auto-approved through allowedTools, servers passed in code are permitted the same way as file-based ones, and renaming the tool on the server does not change the prefix the SDK applies.

*Hint if stuck: Look at how the SDK names tools that come from an MCP server.*
</details>

---

## Question 56
In a research system, the search subagent's tool occasionally times out when a news API is briefly overloaded; a second attempt a few seconds later almost always succeeds. Today each timeout goes straight back to the coordinator, which re-plans the whole research task. Where should these failures be handled?

A) At the coordinator, which should keep a log of each timeout and decide case by case whether the search is worth repeating in a later round of work
B) By raising the API timeout from 10 seconds to 120 seconds so that slow responses are given enough time to finish and no longer count as failures
C) Inside the search subagent or its tool, with a few bounded retries and backoff, escalating to the coordinator only if retries are exhausted and including what was tried
D) In the synthesis subagent, which should notice any missing news sources in the material it receives and request them again from the search agent directly

<details>
<summary>Answer & explanation</summary>

**C)** Transient errors should be recovered close to where they happen; bounded retries with backoff in the subagent or tool absorb the blips, and only a persistent failure is propagated, with context, to the coordinator. Sending every blip upward makes the coordinator re-plan needlessly, a very long timeout makes each call hang during genuine outages, and expecting synthesis to spot gaps puts recovery in the wrong agent.

*Hint if stuck: Handle a failure at the lowest level that can actually fix it.*
</details>

---

## Question 57
A platform team runs a nightly deprecation audit over 7,500 source files using parallel synchronous API calls at 2 a.m. The findings feed a weekly cleanup rotation, so nothing downstream ever blocks on the results, and the job now accounts for 30% of monthly model spend. Which change cuts cost without reducing coverage?

A) Downgrade the audit to a weekly run so the spend is divided by seven
B) Add cache_control breakpoints to every request to discount the per-file token cost of the audit
C) Strip comments and whitespace from each file before sending to shrink input tokens
D) Submit the audit through the Batch API with a custom_id per file and poll until results arrive

<details>
<summary>Answer & explanation</summary>

**D)** The audit is fully non-blocking — exactly the profile the Message Batches API targets: a 50% discount, results within 24 hours with no latency SLA, and custom_id to match each result back to its file. A weekly cadence cuts how often issues are caught rather than unit cost, prompt caching only discounts a stable shared prefix and not the unique file content dominating this spend, and stripping comments yields marginal savings while distorting the line numbers the audit reports.

*Hint if stuck: When nobody is waiting on the response, one pricing model exists specifically for that situation.*
</details>

---

## Question 58
A senior engineer onboarding to a 5,000-file Java codebase asks Claude Code to 'read everything under src/ first so you fully understand the system, then we will plan the caching layer'. The read-through fills the context before planning begins. What should the architect recommend instead?

A) Start from the entry points and the code paths that caching would touch, and use searches for specific symbols to pull in only relevant files
B) Generate a full architectural summary of the codebase once, save it in CLAUDE.md, and load it into every session so the system is always understood
C) Read the src/ tree in alphabetical batches of 200 files, running /compact between batches so that Claude builds up a summary of the whole system
D) Have Claude list every class name in the codebase first and then decide which of the listed classes are worth reading in full for the caching layer

<details>
<summary>Answer & explanation</summary>

**A)** Targeted exploration from entry points and specific symbols loads only what the caching decision depends on. Batch reading with compaction still spends the window on irrelevant code and flattens details into summaries, and a giant summary in CLAUDE.md costs context on every session. A full class listing is a smaller version of the same read-everything habit.

*Hint if stuck: Explore toward the question rather than across the whole tree.*
</details>

---

## Question 59
A developer fixes a currency-rounding bug with Claude, and the invoice totals test then fails. They ask Claude to fix the totals, and the rounding test breaks again. After two loops it is clear that both functions share a half-cent rounding helper with conflicting expectations. How should the developer proceed?

A) Keep alternating between the two fixes, verifying each separately, since independent changes are easiest to review
B) Ask Claude to fix only the totals test and mark the rounding test as skipped until the next release cycle
C) Describe both failures in one prompt with the shared helper and the expected output of each, and fix them together
D) Ask Claude to make each function use its own private copy of the rounding helper so the two fixes stop colliding

<details>
<summary>Answer & explanation</summary>

**C)** These issues interact through the shared helper, so fixing them one at a time causes the oscillation; presenting both together with expected outputs lets Claude find a change that satisfies both. Duplicating the helper hides the conflict and creates two diverging versions of the rule, and skipping a failing test discards the very check that exposed the problem.

*Hint if stuck: Oscillating fixes are a sign the problems are linked.*
</details>

---

## Question 60
A team's shared .mcp.json points a feature-flags MCP server at the production flags API. Developers want local sessions to hit staging by default, while the release pipeline must keep using production. Today two engineers edit the URL by hand before each session and occasionally commit the change. What configuration should the team adopt?

A) Set the url to ${FLAGS_API_URL:-https://staging.flags.internal}/mcp, with the release pipeline setting FLAGS_API_URL
B) Keep two committed files, .mcp.staging.json and .mcp.prod.json, and have engineers copy the right one into place
C) Have each developer add a user-scope entry pointing at staging and remove the server from the shared .mcp.json
D) Point the shared file at staging and have the pipeline run sed over .mcp.json to swap in the production URL

<details>
<summary>Answer & explanation</summary>

**A)** Environment variable expansion supports defaults, so one committed file can target staging unless the pipeline sets the variable to production. Copying between two files and rewriting with sed are the same hand edits that caused accidental commits, just moved around. Pulling the server into personal user scope loses the shared configuration and still leaves the pipeline needing its own setup.

*Hint if stuck: Expansion can carry a fallback value.*
</details>

---

## Answer key (no peeking until scored)

1:D 2:B 3:D 4:C 5:D 6:A 7:C 8:B 9:B 10:D 11:C 12:D 13:B 14:A 15:B 16:D 17:B 18:B 19:B 20:C 21:C 22:B 23:C 24:D 25:D 26:C 27:A 28:C 29:A 30:A 31:C 32:D 33:B 34:D 35:C 36:D 37:C 38:A 39:B 40:D 41:D 42:C 43:A 44:D 45:D 46:B 47:B 48:D 49:A 50:C 51:C 52:B 53:D 54:D 55:A 56:C 57:D 58:A 59:C 60:A
