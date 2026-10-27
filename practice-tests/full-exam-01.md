# Full Practice Exam 01 — CCAR-F simulation

Same format as the real exam guide: **60 questions, 120 minutes, scaled score out of 1000,
pass at 720.** Domain weighting: D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.
No question here appears in the other 2 printable exams.

Set a timer. No notes, no docs. For the interactive version with the clock, flags, and a score report, open the game.

---

## Question 1
A developer-productivity team wants three automated behaviors in Claude Code: (1) load the current sprint's ticket list once when a session opens, (2) strip ANSI color codes out of every Bash result before the model reads it, and (3) prevent any edit to files under vendor/. Which hook events implement these behaviors?

A) (1) UserPromptSubmit, (2) PreToolUse, (3) Stop
B) (1) SessionStart, (2) PreToolUse, (3) PostToolUse
C) (1) UserPromptSubmit, (2) PostToolUse, (3) SessionStart
D) (1) SessionStart, (2) PostToolUse, (3) PreToolUse

<details>
<summary>Answer & explanation</summary>

**D)** SessionStart runs once when the session opens, which is the right place for one-time context like the sprint ticket list. PostToolUse fires after a tool runs and is where outputs get normalized, such as stripping ANSI codes from Bash results. PreToolUse gates calls before they execute, so it is where vendor/ edits get blocked with exit code 2. Pairing (2) with PreToolUse and (3) with PostToolUse reverses the last two events: PreToolUse cannot clean a result that does not exist yet, and PostToolUse fires only after the edit has already happened.

*Hint if stuck: For each behaviour, ask whether the thing it acts on exists yet at the moment the hook fires.*
</details>

---

## Question 2
An internal assistant helps engineers understand a 15-year-old billing monolith. It runs one general subagent holding Read, Grep, Glob, Edit, Write and Bash for both exploration and later refactors. Engineers complain that during pure exploration it sometimes 'tidies' files it was only asked to explain. What design should the architect adopt?

A) Keep one subagent and add a mode flag in its prompt that switches it between exploring and editing behaviour on each request
B) Split it into a read-only explorer with Read, Grep and Glob and a separate modifier subagent with editing tools
C) Keep one subagent and turn on Git hooks that reject any commit made while the assistant is in exploration
D) Keep one subagent but cap it at ten tool calls per explanation so it has no budget left for unrequested edits

<details>
<summary>Answer & explanation</summary>

**B)** Separating roles lets the exploration agent carry only read tools, so it cannot modify code no matter how it interprets a request, while refactors go to an agent built for editing. A prompt mode flag is a soft switch over the same capabilities. Commit hooks catch changes after files are already altered, and a tool-call cap is a budget, not a role boundary.

*Hint if stuck: Give the explaining role only the capabilities explaining requires.*
</details>

---

## Question 3
A developer asks Claude to migrate a large repository from one HTTP client library to another. Nobody knows how many files use the old library or how many wrap it in custom helpers. A teammate drafts a fixed 12-step plan listing the folders to change in order. What approach should the developer use instead?

A) Ask the agent to rewrite every file in the repository in one pass, since a single pass guarantees that no usage of the old library is missed
B) Follow the 12-step plan exactly, and if a step fails, add a new step to the end of the plan and rerun the whole migration from scratch
C) Have the agent first search for usages and wrappers to map the scope, then let it plan and assign file batches based on what it found
D) Split the repository into equal-sized chunks by directory and give each chunk to a separate subagent with identical migration instructions

<details>
<summary>Answer & explanation</summary>

**C)** When the number and location of subtasks cannot be known in advance, the plan should come from exploring first, which is the orchestrator-workers pattern. A fixed list encodes guesses about scope, a single pass over the whole repository dilutes attention, and equal directory chunks ignore where the usages actually are.

*Hint if stuck: Who knows how many files are involved before anyone has looked?*
</details>

---

## Question 4
A team uses Claude Code to generate database migration files. Their convention is a timestamped filename, an up and down function, and a comment linking the ticket. Generated migrations follow the convention about half the time, often omitting the down function. The team wants a prompt-level fix before adding any tooling. What is most likely to make the output consistent?

A) Paste the internal wiki page that describes the migration convention into the prompt so the model has the full written policy
B) Include two complete existing migrations, one simple and one with a data backfill, as examples of exactly what a finished file looks like
C) Ask the model to list the convention's rules before writing each migration, then check its own output against that list
D) Tell Claude Code to read the entire migrations directory on each request so it can infer the convention from hundreds of files for reference

<details>
<summary>Answer & explanation</summary>

**B)** A couple of complete, varied migrations show the filename, both functions and the ticket comment together, which is the most reliable way to make output consistent. The wiki is more prose of the kind already failing, reading hundreds of files floods context with noise and inconsistent legacy files, and restating rules then self-checking in the same pass shares the same blind spot.

*Hint if stuck: A small number of complete, well-chosen files says more than a long policy.*
</details>

---

## Question 5
A research coordinator spawns eight subagents for every query, so a question like "when was this company founded?" takes minutes and costs as much as a market study. On data-heavy studies, each subagent returns a 300-row pricing table that the coordinator retypes into the final report, and audits find transposed digits in the copied tables. Which changes address both problems? (Choose two.)

A) Raise the coordinator's max_tokens so it has enough room to copy each table into the report in full
B) Have subagents save large tables to a shared store and return a reference plus a short summary of each
C) Put scaling rules in the coordinator's prompt: one agent for a fact lookup, more for broad comparisons
D) Cap the coordinator at two subagents per query so that simple lookups stay quick and cheap to answer
E) Run every subagent inside one shared conversation so their tables are already in the coordinator's view

<details>
<summary>Answer & explanation</summary>

**B, C** Agents judge effort poorly, so explicit rules in the lead prompt (a single agent for simple fact-finding, a few for comparisons, many for complex research) stop overinvestment in easy queries. Letting subagents write outputs to an external store and pass back lightweight references avoids the lossy copy through the coordinator. A flat cap of two starves the complex studies that need more. One shared conversation throws away context isolation and still leaves the coordinator copying. More output room lets the coordinator copy more, but the copying is what introduces the errors.

*Hint if stuck: One problem is about matching effort to each question; the other is about whether bulky outputs need to travel through the lead agent.*
</details>

---

## Question 6
In a cited-report pipeline, the report-writing subagent needs author, year and venue for every source it cites, typically 30 to 50 per report. It currently asks the coordinator for each one, which spawns a search subagent per lookup and doubles total runtime. The metadata already sits in the run's citation store. What is the best fix?

A) Give the report subagent the search subagent's full web_search and fetch_page tools so it can find metadata itself
B) Have the coordinator batch all metadata requests and spawn one search subagent per report to answer them together
C) Give the report subagent a narrow get_citation_metadata tool that reads entries from the run's citation store
D) Have the report subagent write placeholder citations and let a final formatting pass fill in author, year and venue

<details>
<summary>Answer & explanation</summary>

**C)** A frequent, simple, cross-role need is best met with a small scoped tool, so the report agent reads metadata directly from the store without coordinator round trips. Handing it the full search toolkit invites off-role research. Batching still re-searches for data that already exists, and placeholders push the problem to a later pass that can mismatch citations.

*Hint if stuck: The data exists already; ask what the smallest tool is that reaches it.*
</details>

---

## Question 7
A research system's report subagent drafts a 20-page market analysis. The coordinator wants a quality gate before publishing that catches unsupported claims. Budget allows one extra model call per report section. How should the gate be designed?

A) Send each section and its cited sources to a separate reviewer instance that flags claims the sources do not support
B) Ask the report subagent to append a self-assessment section rating how well each claim is supported by its sources
C) Have the coordinator reread the whole report in its own context window and approve it for publishing if nothing looks inconsistent overall
D) Have the report subagent regenerate each section once and publish whichever version cites the larger number of sources

<details>
<summary>Answer & explanation</summary>

**A)** An independent reviewer per section, given the section and its sources but not the drafting context, can check claims against evidence without the writer's bias, and section-sized inputs keep its attention focused. A writer's self-assessment inherits its own blind spots, a single whole-report reread dilutes attention across 20 pages, and more citations is not the same as supported claims.

*Hint if stuck: Combine independence from the writer with a scope small enough to check carefully.*
</details>

---

## Question 8
A developer-tools team plans a sprint to build their own GitHub MCP server for Claude Code (issues, pull requests, code search) and a second server for their in-house deployment orchestrator, which has no public integration. Which plan should the architect recommend?

A) Build both custom servers so that the team controls each tool name, schema and description across its integrations
B) Adopt an existing community or vendor GitHub MCP server, and build a custom one for the deploy orchestrator
C) Skip MCP for GitHub and the orchestrator and have the agent call both APIs through curl commands in Bash
D) Build the GitHub server now and postpone the orchestrator, since a standard integration is the safer start

<details>
<summary>Answer & explanation</summary>

**B)** For standard integrations like GitHub, an existing community or vendor server is maintained and proven, so custom work should be reserved for systems with no existing integration, such as the in-house orchestrator. Building both spends effort recreating a solved problem. Raw curl through Bash loses typed tools and descriptions, and postponing the orchestrator invests in the wrong half.

*Hint if stuck: Spend custom-build effort where nothing already exists.*
</details>

---

## Question 9
A CI workflow prompt for claude -p instructs: "Use Grep to collect every file matching *.integration.test.ts under services/, then run them." The step is slow and intermittently misses test files. A reviewer flags the instruction. What should it say instead?

A) Keep Grep but anchor the regular expression so it matches the file names more precisely
B) Tell Claude to Read the services/ directory listing and filter the entries itself
C) Use Glob with services/**/*.integration.test.ts, because Glob matches file paths while Grep searches file contents
D) Use Bash with find piped through xargs, because the built-in tools cannot enumerate files by a name pattern across directories

<details>
<summary>Answer & explanation</summary>

**C)** Glob matches file paths while Grep searches file contents, so using Grep to enumerate file names searches the wrong dimension and explains the misses. (Current Claude Code on macOS, Linux and WSL leaves Glob and Grep out by default and searches with find/grep through Bash unless a job names them in --tools or --allowedTools; the path-versus-content choice is the same either way.) The find/xargs option rests on a false premise, since path-pattern enumeration is exactly what Glob does. Anchoring a content regex still searches the wrong dimension, and filtering a directory listing by hand does not recurse through the service tree.

*Hint if stuck: Ask whether the instruction is looking for something in file names or in file text.*
</details>

---

## Question 10
A nightly job sends 40,000 document-classification requests through the Message Batches API. The team's code matches results to documents by line position, and some labels end up on the wrong documents. About 300 requests come back errored, mostly invalid_request_error from documents over the size limit, and the job then resubmits the whole batch. Which changes should they make? (Choose two.)

A) Give each request a unique custom_id and join each result to its document on that ID, not on position
B) Sort the results file by creation time before matching, so that it lines up with the order of submission
C) Resubmit just the errored custom_ids, after fixing those requests, e.g. by chunking big documents
D) Resubmit the errored requests unchanged in a new batch, since errors in a batch are usually transient
E) Split the job into 40 batches of 1,000 so that each smaller results file stays in submission order

<details>
<summary>Answer & explanation</summary>

**A, C** Batch results can come back in any order, so custom_id is the way to correlate each result with its request. Only the failed requests need resubmitting, and an invalid_request_error means the request body must be fixed (here, chunking oversize documents) before it can succeed. Sorting by time or using smaller batches still relies on an order the API does not guarantee. Resending invalid requests unchanged fails the same way again.

*Hint if stuck: Ask what the API promises about result order, and what an invalid request needs before it can succeed.*
</details>

---

## Question 11
A customer support coordinator agent has already looked up the customer's account ID, plan tier, and the disputed invoice number through earlier tool calls. It then spawns a billing-investigator subagent with the Task prompt 'Investigate why this customer was double-charged.' The subagent responds that it cannot proceed without knowing which customer or invoice is involved. What is the root cause?

A) The billing-investigator is running on Haiku, which cannot retain account details; switch its model to Opus
B) Project CLAUDE.md was never set up, so subagents load no memory at startup; create one containing the account details
C) Subagents start with isolated context; the coordinator must pack the account ID, plan tier, and invoice number directly into the Task prompt
D) Subagents need a shared-memory flag enabled in settings.json before they can read the coordinator's full conversation history, including the account details

<details>
<summary>Answer & explanation</summary>

**C)** Subagents do not inherit the coordinator's conversation — each starts with an isolated context, so any fact the subagent needs must be explicitly written into its task prompt. Packing the account ID, tier, and invoice number into the Task prompt fixes the root cause. CLAUDE.md is version-controlled project memory for stable standards, not a channel for per-ticket runtime facts, and no shared-memory flag exists in settings.json.

*Hint if stuck: Consider what a freshly spawned subagent can and cannot see of its parent's conversation.*
</details>

---

## Question 12
An engineer asks Claude Code to generate unit tests for a date-parsing utility it wrote earlier in the same session. All tests pass, but production fails on leap-day inputs. The team wants the tests to act as a real check on the code. What is the best change?

A) Ask the same session to list the edge cases it considered before writing tests, then add any it marks as untested
B) Tell the same session to write tests that try their hardest to break the code, with heavy emphasis on adversarial edge cases such as leap years
C) Require a code coverage target of 100 percent so the session is forced to write a test for each branch in the parser
D) Generate the tests in a separate session that receives only the function signature and the spec, not the implementation

<details>
<summary>Answer & explanation</summary>

**D)** Tests written by the context that wrote the code tend to encode the same assumptions, so the leap-day gap appears in both. A separate session working from the spec tests the intended behaviour instead. Adversarial wording and self-listed edge cases come from the same blind context, and branch coverage does not reveal a missing branch.

*Hint if stuck: Tests share the blind spots of whoever designed them.*
</details>

---

## Question 13
An automated PR reviewer posts about 30 comments per pull request. Developers say the security and correctness findings are mostly real, but the style and naming comments are wrong or trivial most of the time, and now they skip every comment. Adding "be conservative and only flag important issues" to the prompt changed nothing. Which changes should the team make? (Choose two.)

A) Switch off the style and naming category for now while its prompt is reworked and measured on real PRs
B) Have the model give each finding a confidence score and post just the findings it rates at 0.8 or above
C) Strengthen the line to "be extremely conservative" and repeat it at both the start and end of the prompt
D) Lower the temperature so the reviewer produces the same set of comments each time a PR is reviewed again
E) Replace the vague instruction with explicit criteria: which issue types to report and skip, with examples

<details>
<summary>Answer & explanation</summary>

**A, E** A noisy category drags down trust in the accurate ones, so pausing it while it is fixed restores the value of the real findings. Vague calls for caution do not raise precision; explicit criteria for what to report and what to skip, with examples, do. Self-rated confidence is not calibrated, so a 0.8 cut-off filters unpredictably. Repeating a stronger vague instruction is the approach that already failed, and a lower temperature makes the same false positives more consistent rather than fewer.

*Hint if stuck: Ask what is eroding developers' trust right now, and what kind of prompt wording actually changes what the model reports.*
</details>

---

## Question 14
An engineer asked Claude Code to change how a research platform attaches citations, logic spread over about 25 modules she has never read. In the first attempt the main session filled with grep and file-read output until it compacted and lost earlier findings, and Claude began editing three modules before she had agreed on an approach; she reverted them. Which changes address these problems? (Choose two.)

A) Have the Explore subagent map the citation code, so only its summary enters the main session
B) Run /compact after each batch of searches, so the main session keeps room for later results
C) Switch to acceptEdits mode, so the early edits are batched and she can review them at the end
D) List the 25 modules in the project CLAUDE.md, so every session loads the module map at start
E) Work in plan mode until she approves an approach, so no source file changes before she agrees

<details>
<summary>Answer & explanation</summary>

**A, E** Delegating discovery to the Explore subagent keeps the verbose search and read output in its own context and returns a summary, so the main session stays focused. Plan mode lets Claude read and propose without editing source until she approves a plan. Compacting more often keeps discarding the very findings she needs. acceptEdits approves edits automatically, the opposite of holding them back. Putting a module list in CLAUDE.md loads it into every session and does nothing to keep exploration output out of context.

*Hint if stuck: One problem is about where exploration output lands, the other about when edits are allowed to start.*
</details>

---

## Question 15
A platform team wrote a PreToolUse hook to stop Claude Code from editing files under infra/prod/. The script correctly detects the protected path, prints 'Edit blocked: protected production path' to stdout, and exits with code 0. In testing, the edits still go through and the agent never acknowledges any block. What is wrong?

A) PreToolUse hooks cannot block tool calls; the rule must instead be a deny entry in settings.json permissions for that path
B) The hook needs to return hookSpecificOutput.additionalContext containing the block decision
C) The hook must exit with code 2 to block the call, and write the explanation to stderr so it is fed back to the model
D) The hook fires too early to see the file path; the protection must move to a PostToolUse hook

<details>
<summary>Answer & explanation</summary>

**C)** For PreToolUse hooks, a zero exit code allows the tool call to proceed; exit code 2 is what blocks the call, and stderr (not stdout) is the channel fed back to the model explaining why. PreToolUse hooks can block calls, since gating tool calls before they run is exactly what they exist for, so no settings.json deny rule is needed. additionalContext injects information but does not block anything, and PreToolUse receives the full tool input including the file path, so it does not fire too early.

*Hint if stuck: The script found the path correctly; look at how it reported its verdict back to Claude Code.*
</details>

---

## Question 16
In a healthcare intake pipeline, a symptoms-extractor subagent identifies the patient's record ID from uploaded forms, and an insurance-verifier subagent later needs that ID. An engineer proposes letting the two subagents exchange data directly through a shared messages.json file. What is the recommended pattern instead?

A) Give both subagents the same session ID so they transparently share one context window
B) Have the extractor return the record ID in its result, and let the coordinator pack it into the verifier's Task prompt
C) Adopt the shared file, but add a PreToolUse hook that validates each write to messages.json so a bad record never reaches the verifier
D) Merge both roles into a single subagent so the data never has to move between agents

<details>
<summary>Answer & explanation</summary>

**B)** In hub-and-spoke orchestration, inter-agent communication routes through the coordinator: spokes return results to the hub, and the hub explicitly packs needed facts into the next subagent's prompt. This keeps sequencing, validation, and observability in one place. A shared file sidesteps the orchestrator and invites ordering and consistency problems that a validation hook only partially patches, and subagents cannot share a context window by reusing a session ID.

*Hint if stuck: In hub-and-spoke, who is supposed to carry information between spokes?*
</details>

---

## Question 17
A developer-productivity agent must change one specific 'return null;' line inside a 900-line file. The statement appears 14 times, several of them inside near-identical blocks, so even old_string values widened with surrounding lines still match more than once. What is the reliable fallback?

A) Use Bash with sed to replace every occurrence of 'return null;' in the file
B) Call Edit with replace_all set to true so uniqueness is no longer required
C) Grep the file to count the occurrences, then call Edit again with the exact same old string
D) Read the full file, make the change in that content, and Write the whole file back

<details>
<summary>Answer & explanation</summary>

**D)** Edit needs an old_string that matches exactly once; when even widened context cannot single out the target, reading the file and writing it back with just that line changed is the reliable fallback. replace_all and a blanket sed would change all 14 occurrences rather than one, and counting matches with Grep does not make the anchor any more unique.

*Hint if stuck: If no anchor can be made unique, look for an approach that does not depend on string matching but still changes only the line you mean.*
</details>

---

## Question 18
A contract-review pipeline flags auto-renewal clauses and outputs only clause_id and is_auto_renewal. Reviewers dismiss about a third of flags, but the team cannot tell why the model is wrong, because nothing in the output shows what triggered each flag. What is the most useful change to the output schema?

A) Add a confidence score from zero to one so that reviewers can sort the flags and skip the ones with lower confidence
B) Add a detected_pattern field recording the phrase or rule that triggered each flag, so dismissed flags can be grouped by cause
C) Add a field for the clause's full text so that reviewers no longer have to open the full contract to check each flagged clause
D) Add a reviewer-feedback field to the schema so the model can learn from past dismissals during future extraction runs

<details>
<summary>Answer & explanation</summary>

**B)** A detected_pattern field records why each flag fired, so dismissed flags can be grouped by trigger and the prompt or rules fixed for the patterns that cause false positives. A confidence score helps triage but does not explain causes, clause text speeds review without revealing the trigger, and a feedback field in the output does not teach the model anything across runs.

*Hint if stuck: To fix false positives you first need to see what caused them.*
</details>

---

## Question 19
A synthesis step deduplicates findings that state the same fact. When two scouts reported 'the plant closed in May 2026', one citing a regulator filing and one a trade-press article, the merged claim kept only the trade-press source. That article was later corrected, and reviewers now cannot tell whether the claim still stands. How should merging work?

A) Keep the most authoritative source on the merged claim and drop the others to keep records simple
B) Skip deduplication and publish both claims separately, so readers see that two sources said the same thing
C) Merge the matching claims into one record that keeps every supporting source with its id and date
D) Keep the first source that arrived, but add a note to the claim saying it was also reported elsewhere

<details>
<summary>Answer & explanation</summary>

**C)** Claim-source mappings have to survive every synthesis step, including deduplication: a merged claim should carry all its supporting sources with dates, so it can be re-checked when one source changes and corroboration can be judged. Keeping only the 'best' source is a judgment call that still throws away the trail. Publishing duplicates clutters the report and still does not link the two sources to one claim. A note saying 'reported elsewhere' gives reviewers nothing they can check.

*Hint if stuck: Ask what a reviewer needs to re-check a claim after one of its sources changes.*
</details>

---

## Question 20
A team tuning an invoice extraction prompt has spent a session having Claude analyse 20 failed extractions and categorise the failure patterns. They now want to try two schema designs, one with nullable fields and one with an explicit 'unclear' enum, each needing several iterations. What is the most efficient setup?

A) Try the first schema in the current session, then run /clear and try the second one in the same session afterwards
B) Fork the analysis session once for each schema design so both iterations start from the same failure analysis
C) Start two new sessions and have each one reanalyse the same 20 failed extractions before trying its schema design
D) Try both schema designs in the same session at the same time, alternating prompts between the two different approaches

<details>
<summary>Answer & explanation</summary>

**B)** Two independent lines of work from one shared analysis is the use case for forking. Running /clear throws away the analysis needed for the second design, re-analysing in two new sessions repeats the work, and alternating designs in one session lets each contaminate the other's reasoning.

*Hint if stuck: You want two branches that share a starting point but nothing after it.*
</details>

---

## Question 21
A platform team wants Claude in CI to propose dependency-upgrade changes across services, but a human must approve the approach before any code is changed. One engineer suggests a single job whose prompt says 'describe your plan and wait for approval before editing'. What design meets the requirement?

A) Use the single job with a stronger prompt that forbids editing files until a reviewer comments
B) Run a first job in plan mode that publishes the plan, then a second job that executes it after approval
C) Run the single job directly and rely on pull-request review to catch the approach after changes
D) Use the single job but cap it at one turn so Claude cannot reach the editing step before review

<details>
<summary>Answer & explanation</summary>

**B)** Plan mode enforces the no-edit boundary even in non-interactive runs, so splitting into a planning job and a gated execution job gives a real approval point. A prompt instruction is a request, not a block. A turn cap is crude loop control that can still leave partial edits, and post-hoc PR review means the approach is judged only after the work is done.

*Hint if stuck: Where is the approval gate enforced: in the prompt, or in the workflow?*
</details>

---

## Question 22
An e-commerce team has finalized a new extraction prompt for product attributes and plans to submit all 10,000 legacy listings as a single Message Batch tonight. The prompt has only been eyeballed against two listings. A teammate objects to the plan. What should the team do before committing the full batch?

A) Submit the full batch now — at the 50% discount, even a flawed run costs half as much as a synchronous run
B) Run a small synchronous pilot of around 50 representative listings, validate the outputs, then submit the full batch
C) Submit the 10,000 listings as ten sequential batches of 1,000, checking each batch's results before sending the next
D) Add a system-prompt instruction asking the model to double-check its own work, then submit the 10,000 tonight

<details>
<summary>Answer & explanation</summary>

**B)** A small synchronous pilot gives immediate feedback on prompt quality before committing 10,000 jobs to a channel with no latency SLA. The staged sub-batch plan is the strongest distractor, but it still burns 1,000 unvalidated jobs on the first stage and waits up to 24 hours per checkpoint; the discount makes a bad run cheaper, not free, and a self-check instruction cannot validate outputs the team has never inspected.

*Hint if stuck: Compare how quickly each plan would reveal that the prompt is broken.*
</details>

---

## Question 23
An engineer needs to add an optional timeout_seconds field, defaulting to 30, to one dataclass in config/http.py and cover it with a unit test in the matching test file. The requirements are fully specified and there is only one sensible way to do it. How should she run the task in Claude Code?

A) Ask for direct execution with the exact field, default and test expectation in the prompt
B) Delegate the work to an Explore subagent first so that it can map each usage of the config class
C) Enter plan mode so Claude can propose two alternatives for the field before writing any code
D) Draft a spec document with Claude first, then start a fresh session to implement that spec

<details>
<summary>Answer & explanation</summary>

**A)** A small, clear, well-scoped change with one obvious approach is what direct execution is for; spelling out the field, default and test gives Claude everything it needs. Plan mode adds a review step with nothing to decide. An Explore pass or a spec-then-fresh-session workflow is overhead suited to unfamiliar or large work.

*Hint if stuck: How many real decisions does this change contain?*
</details>

---

## Question 24
In a market-research system, the synthesis subagent was given the same web_search and fetch_page tools as the search subagents 'so it can fill gaps'. Reports now take three times longer because synthesis keeps launching fresh research tangents, yet about a third of its tool calls are just quick checks that a cited statistic matches its source. What should the architect change?

A) Keep the full search toolkit but add a system prompt rule limiting synthesis to five searches per report
B) Let synthesis keep both tools but route its calls through a hook that logs each search so the team can audit tangents later
C) Remove every tool from synthesis so that any missing fact or statistic must be requested from the search subagents through the coordinator
D) Remove web_search and fetch_page from synthesis and give it a narrow verify_claim tool for checking a cited figure against its source

<details>
<summary>Answer & explanation</summary>

**D)** Agents misuse tools outside their role, so the general search tools should leave synthesis; the frequent, legitimate need (quick citation checks) is served by a small, scoped cross-role tool. A prompt cap on searches is a probabilistic limit on a tool the role should not hold. Stripping every tool forces a coordinator round trip for each routine check, and logging the calls only observes the tangents instead of preventing them.

*Hint if stuck: Look at what the synthesis role actually uses its tools for most of the time.*
</details>

---

## Question 25
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

## Question 26
A support agent's get_refund_quote tool returns {"amount": 4599}. The billing system stores values in cents, but the description only says 'Returns the refund amount for an order.' Customers have been told they will receive $4,599 instead of $45.99. Which change is the most robust fix?

A) Add a system-prompt instruction reminding the agent that the billing system stores all amounts in cents, and that it should divide by 100 before quoting
B) Add a post-processing step that scans the agent's replies and divides any quoted amount above $1,000 by 100 before it is sent, to correct the obvious mistakes
C) Add a calculator tool that the agent must call to convert every amount from cents to dollars before it tells a customer the size of their refund
D) Return an unambiguous field such as amount_usd ("45.99") or amount_cents with a currency code, and state the unit and format in the tool's description

<details>
<summary>Answer & explanation</summary>

**D)** The tool's output is ambiguous: a bare amount gives the model no way to know the unit. Naming the field with its unit and documenting the output format in the description removes the ambiguity where the value is produced. A prompt reminder relies on the model applying it every time, a calculator tool adds a step without telling the model that conversion is needed, and rewriting amounts over $1,000 corrupts legitimately large refunds.

*Hint if stuck: The model can only interpret a number using what the tool tells it about that number.*
</details>

---

## Question 27
An e-commerce assistant has accumulated 18 tools spanning catalog search, inventory, refunds, shipping, and loyalty promotions. After the last batch of tools shipped, wrong-tool calls climbed from 3% to 19% of sessions. What should the architect do?

A) Split the assistant into focused roles, each agent exposing the 4-5 tools its job requires
B) Expand each tool description with full parameter documentation so the model can tell the 18 tools apart
C) Add a system prompt table that maps each customer intent to the tool that should handle it
D) Switch the assistant to a larger model that can keep track of more tools at once

<details>
<summary>Answer & explanation</summary>

**A)** Selection accuracy degrades as an agent's tool count grows, and the jump from 3% to 19% wrong-tool calls after the last batch shows it. Splitting into role-scoped agents with 4-5 tools each shrinks each decision space and fixes the root cause. Longer descriptions and an intent table add context without reducing the candidates the model weighs on every turn, and a larger model does not remove the crowded choice.

*Hint if stuck: Ask whether a fix reduces what the model must choose between, or only documents the choices better.*
</details>

---

## Question 28
An architect is reviewing four rules for a support agent and must decide which belong in a PreToolUse hook rather than the system prompt: (1) keep a warm, concise tone; (2) never issue a refund to an account flagged for fraud; (3) prefer self-service links when they fully answer the question; (4) suggest a callback when the customer seems frustrated. Which choice is right?

A) Rules 2 and 4 in hooks, since both protect the company and both involve a clear trigger the hook can detect in the conversation or the tool call input
B) All four in hooks, since hooks are deterministic and the business wants every rule to be followed consistently every time
C) Only rule 2 in a hook: it is a mechanical check on a tool call that must hold every time, while the others need judgment and fit the prompt
D) None in hooks; all four fit the system prompt, and the fraud rule can be backed by a weekly audit of refunds issued

<details>
<summary>Answer & explanation</summary>

**C)** Hooks suit rules that can be checked mechanically on a tool call and must be guaranteed, which is the fraud-flag refund block. Tone, when self-service suffices and whether a customer seems frustrated are judgments that belong in prompting; detecting frustration in a hook would be an unreliable heuristic. Putting everything in hooks forces judgment into code, and a weekly audit finds fraud refunds after they are paid.

*Hint if stuck: Sort the rules by whether code could decide them without understanding the conversation.*
</details>

---

## Question 29
A claims-form extraction pipeline sends low-confidence documents to a human review queue. Each queue item contains only the document ID and the label 'needs review', so reviewers re-extract the whole form by hand, and the team gets no signal about which fields fail. What should each handoff item contain?

A) The model's full reasoning transcript for that document, so reviewers can see exactly where its thinking went wrong before they correct anything in the record
B) The majority answer from three more extraction runs on that document, so reviewers only need to approve or reject a single candidate record
C) An overall confidence score and the document type, so the queue can be sorted and reviewers can take the least certain documents first
D) The extracted values, the fields that failed with the check each one failed, the source page or span for each, and what retries were already made

<details>
<summary>Answer & explanation</summary>

**D)** A handoff should let the human act on exactly what is uncertain: the extracted values, which fields failed and why, where in the source to look, and what was already tried. That also gives the team field-level failure data. A reasoning transcript is unstructured and slow to use, an overall score says nothing about which fields to check, and majority voting over reruns can still be wrong while hiding which fields were in doubt.

*Hint if stuck: Reviewers are redoing the whole form; what would let them check only the parts in doubt?*
</details>

---

## Question 30
A CI job has Claude Code call an MCP lint tool on changed files. The tool returns isError true whenever it finds lint violations, with the violations listed in the message. Claude has started reporting 'linting could not be run' on PRs that actually have violations, and skips commenting on them. What is the correct fix?

A) Tell Claude in the CI prompt that lint errors with isError true still contain useful findings, and that it should read them before deciding what to post
B) Return violations as a normal successful result, and use isError only when the linter itself could not run, for example on a crash or a missing config
C) Have the tool set isError true when there are more than ten violations, so that small numbers of findings are reported as normal results
D) Split the tool into run_lint and get_lint_violations, so that the second call fetches the findings separately once the first call has reported an error

<details>
<summary>Answer & explanation</summary>

**B)** isError means the tool call failed, not that the tool found problems; a linter that ran successfully and found violations has succeeded. Returning findings as a normal result and reserving isError for real failures makes the signal mean one thing. A prompt rule asks Claude to second-guess the flag, a threshold makes the flag's meaning depend on counts, and splitting the tool adds a call without fixing the misuse of the flag.

*Hint if stuck: Ask what isError should mean, and whether finding problems is the same as failing.*
</details>

---

## Question 31
A support agent's refund-cap check is a PreToolUse shell hook defined in the repository's .claude/settings.json, and it worked in every test run. To stop the production Agent SDK service from picking up stray settings files, an engineer set settingSources to an empty list. Since that release, over-cap refunds have gone through and the hook's log is empty. What should the team do?

A) Move the check into a PostToolUse hook in the same settings file, since PostToolUse hooks still load when setting sources are restricted
B) Register the refund check as a PreToolUse callback in the query's hooks option, which runs no matter which settings files load
C) Put the cap in the system prompt as a hard rule, since an SDK service cannot run hooks of any kind once settings files are skipped
D) Set permissionMode to bypassPermissions, so that hooks are evaluated before every tool call no matter which settings were loaded

<details>
<summary>Answer & explanation</summary>

**B)** The SDK runs callback hooks passed in options plus shell hooks from settings files only when the matching settingSources entry is enabled; with an empty list, .claude/settings.json and its hooks are never read. A callback registered in code keeps the deterministic check without reopening the settings files the engineer wanted to ignore. A PostToolUse hook in the same file would not load either and would fire after the refund. The prompt fallback rests on a false premise and is probabilistic, and bypassPermissions loosens approval rather than loading any hooks.

*Hint if stuck: Ask where this check was defined, and what has to happen for the SDK to read that file at all.*
</details>

---

## Question 32
An extraction job pulls revenue, headcount and debt figures from 50 annual reports into a comparison spreadsheet. A reviewer finds an implausible headcount for one company but cannot tell which report, page or passage it came from, so checking it means re-reading the whole filing. What should the extraction schema include?

A) For each value, the source document ID, page number and the exact quoted passage it came from
B) A free-text notes field where the model can describe, in its own words, any part of the document that it found difficult to interpret
C) A confidence score for each value so that reviewers can tell which figures the model was unsure of and check those first
D) A summary of each annual report so that reviewers can skim the summary rather than the full filing when checking any value

<details>
<summary>Answer & explanation</summary>

**A)** Carrying the document, page and quoted span with each value makes every figure checkable in seconds and keeps provenance through later aggregation. A confidence score says nothing about where a value came from, free-text notes are unstructured and inconsistent, and a summary is another lossy layer between the value and its evidence.

*Hint if stuck: Every figure should point back to its evidence.*
</details>

---

## Question 33
A company runs claude -p on shared self-hosted CI runners to label failing test logs, and the same commit gets different labels on different runners. Investigation shows one runner's ~/.claude holds a plugin whose hook rewrites prompts, and another has a stale auto-memory note. The team wants every run to depend only on what the job passes in. What should they add?

A) --permission-mode plan, so Claude is limited to reading files and the plugin's hook cannot run
B) --bare, which skips host hooks, plugins and memory, with any needed context passed in
C) --output-format json, so each runner returns the same envelope and the labels stay stable
D) --max-turns 1, so Claude has no room to load hooks or memory before producing the labels

<details>
<summary>Answer & explanation</summary>

**B)** --bare skips auto-discovery of hooks, skills, plugins, MCP servers, auto memory and CLAUDE.md, and the headless docs recommend it for scripted calls so a run does not pick up whatever the host has configured. Because it also skips CLAUDE.md, any standards the job needs should be passed explicitly. JSON output only changes the envelope around the answer, a turn limit does not stop startup loading, and plan mode limits edits but does not switch off hooks.

*Hint if stuck: Look for what removes the run's dependence on whatever happens to be installed on the machine.*
</details>

---

## Question 34
A research swarm gathering electric-vehicle market data flags a "source conflict": one finding says global EV sales were 10.5M units, another says 17.3M. Investigation shows the first comes from a 2023 report and the second from a 2025 report — and the synthesizer had discarded both figures as unreliable. What fixes this?

A) Add a reconciliation step that averages the numeric claims whenever any two sources disagree by more than 20%, then report the blended figure
B) Rank the sources by domain authority and keep the figure that comes from the higher-authority publication, discarding the other
C) Tighten the scout prompts so they collect market figures published within the last 12 months, keeping the dataset current
D) Capture publication dates as temporal metadata on every claim, so figures from different years read as a time series, not contradictions

<details>
<summary>Answer & explanation</summary>

**D)** Figures measured at different times are not contradictions — they are data points about a changing quantity, and carrying temporal metadata through synthesis prevents false-conflict detection while preserving trend information. Averaging fabricates a number no source ever reported, authority ranking discards a valid historical data point, and restricting collection to recent sources throws away exactly the history trend analysis needs.

*Hint if stuck: Before calling two figures a conflict, ask whether they describe the same moment.*
</details>

---

## Question 35
After a large feature lands, a developer finds four problems: a typo in an error message in the billing module, a missing index hint in an unrelated reporting query, a wrong default page size in the admin API, and a stale link in the README. None of the fixes touch the same code. How should the developer work through them with Claude Code?

A) Paste all four into one prompt so Claude can see the full picture and fix them in a single combined change
B) Fix them one at a time, verifying each before moving on, because they are independent of one another
C) Ask Claude to re-plan the whole feature in plan mode, since four defects suggest the original design was flawed
D) Ask Claude to rank the four by risk and then let it fix whichever ones it judges worth changing right now

<details>
<summary>Answer & explanation</summary>

**B)** Independent issues are best handled one by one: each fix is small, easy to verify, and a failure in one does not muddy the others. Bundling unrelated fixes makes a bigger diff that is harder to check and mixes concerns, and re-planning the whole feature is out of proportion for four small, unrelated defects.

*Hint if stuck: Compare how easy it is to verify one small change with how easy it is to verify four mixed together.*
</details>

---

## Question 36
A customer-support team ships a skill that drafts refund-decision emails. Compliance requires that this skill never execute shell commands. The SKILL.md body states Never use Bash in bold, yet audit logs from last week show two sessions where the skill ran Bash anyway. What is the root-cause fix?

A) Repeat the prohibition in capital letters at both the top and bottom of the skill body
B) Lower the sampling temperature so the model follows the skill's instructions more reliably
C) Add a project-wide PreToolUse hook that blocks each Bash invocation in the repository
D) Restrict the skill's tools in its frontmatter so Bash is removed while the skill runs

<details>
<summary>Answer & explanation</summary>

**D)** Prose in a skill body is probabilistic; a tool restriction declared in the skill's frontmatter is applied by the harness and scoped to this skill. In current Claude Code the field is disallowed-tools, which removes Bash from the pool while the skill is active (allowed-tools only pre-approves tools and does not block others). A project-wide hook is deterministic but overbroad, breaking every workflow that legitimately needs Bash, and capitals or a lower temperature leave compliance to chance.

*Hint if stuck: Look for the deterministic enforcement mechanism whose scope matches the thing being restricted.*
</details>

---

## Question 37
An expense-extraction pipeline calls lookup_tax_rate(region) to validate tax lines. The region parameter is a free-text string. When a receipt says 'CA', the agent sometimes passes Canada and sometimes California, and the tool returns a rate for whichever it receives, so validation passes with the wrong rate. What is the best fix?

A) Add a sentence to the extraction prompt telling the agent to think carefully about whether CA means Canada or California before calling the tool
B) Have lookup_tax_rate return the rates for both Canada and California whenever it receives the ambiguous code CA, and let the agent pick the right one
C) Replace region with required country_code (ISO 3166-1) and optional subdivision_code fields, described with examples, so the call must state which place is meant
D) Hard-code CA to mean California in the tool, since most receipts processed by the pipeline come from merchants based in the United States

<details>
<summary>Answer & explanation</summary>

**C)** A free-text field lets an ambiguous value through and the tool silently resolves it. Structured, unambiguous parameters with standard codes force the call to say which jurisdiction is meant, and the description's examples show how. A prompt nudge leaves the ambiguity in the interface, returning both rates hands the same guess back to the model, and hard-coding a default will be wrong for every Canadian receipt.

*Hint if stuck: Ambiguity in an input should be removed by the interface, not resolved by a guess.*
</details>

---

## Question 38
A CI step asks Claude to summarise failing tests as JSON and validates it with a library that raises "ValidationError: 1 validation error for Report". The pipeline appends that exception string to the retry, but retries fix the problem only about a third of the time. What change makes the feedback loop most effective?

A) Format the error to say which field failed, what value was returned and what was expected, and include that in the retry
B) Append the full JSON schema to the retry so the model can compare its whole output against the expected structure
C) Ask the model to validate its own output against the schema before responding, so that fewer retries are needed
D) Replace the exception string with a short generic note that the JSON did not match the schema and must be corrected

<details>
<summary>Answer & explanation</summary>

**A)** The retry needs specific, actionable feedback: which field, what came back and what was expected; a bare exception summary says only that something failed. A generic note is even less specific, resending the full schema makes the model hunt for the problem instead of pointing to it, and self-validation in the same pass catches little that it did not already get wrong.

*Hint if stuck: Feedback works when it points at the exact problem.*
</details>

---

## Question 39
A purchase-order extractor uses a schema where `line_items` is a single string. The model returns values like "Widget A x2 @ 4.50; Bolt M8 x100 @ 0.12", and the ERP import script breaks whenever a product name contains a semicolon or the letter x. What is the best schema change?

A) Ask the model to use a rarer separator, such as a pipe, between line items in the string
B) Keep the string but have a second model call split it into separate lines before the ERP import runs
C) Make `line_items` an array of objects with description, quantity and unit_price fields, each typed
D) Add a rule asking the model to wrap each product name in double quotes inside the string before it returns

<details>
<summary>Answer & explanation</summary>

**C)** An array of typed objects encodes the structure directly, so no delimiter can collide with product names and quantities and prices arrive as numbers. A rarer separator only moves the collision, a second splitting call is another fragile parse, and quoting names fails as soon as a name itself contains a quote mark.

*Hint if stuck: Represent structure in the schema, not in a delimited string.*
</details>

---

## Question 40
After a long interview session, Claude has written a detailed SPEC.md for a feature-flag cleanup tool. The session now contains dozens of back-and-forth questions, rejected ideas and exploratory file reads. What is the best way to move to implementation?

A) Continue in the same session, since it holds every detail of the discussion that produced the spec
B) Start a fresh session and have Claude implement from SPEC.md, with clean context focused on the build
C) Hand the spec to a teammate to implement by hand, since the interview has already done the hard design work
D) Ask Claude to compact the session and then begin implementing from the compacted summary of the discussion

<details>
<summary>Answer & explanation</summary>

**B)** Once the spec is written, a fresh session gives Claude clean context focused on implementation, with the written spec as its single source of truth. Continuing in the interview session drags along rejected ideas and noise, a compacted summary is a lossy copy of what the spec already captures precisely, and handing off to a human throws away the implementation help.

*Hint if stuck: The spec exists so the build does not depend on the conversation that produced it.*
</details>

---

## Question 41
A records team submits 20,000 scanned forms as a Message Batch and writes the results back to their database by matching the nth result line to the nth form submitted. After a run, spot checks show extracted names attached to the wrong forms. What is the fix?

A) Give each request a custom_id equal to the form's record ID and match results by custom_id, not position
B) Submit the forms in sorted order by record ID so that the results come back in the same sorted order as the input
C) Submit smaller batches of 1,000 forms so that the result order is more likely to match the order of submission
D) Include the form's record ID in the prompt and ask the model to echo it back at the start of every extracted record

<details>
<summary>Answer & explanation</summary>

**A)** Batch results can come back in any order, so each request needs a unique custom_id that ties its result to the input. Sorting or smaller batches does not make ordering guaranteed, and asking the model to echo an ID makes correlation depend on model output instead of the API's own identifier.

*Hint if stuck: Results from a batch do not promise to keep their place in line.*
</details>

---

## Question 42
Human agents review every refund the support agent approves. Overall, reviewers agree with the agent 96% of the time, so leadership wants to stop reviewing refunds. A breakdown shows 99% agreement on full refunds for damaged goods but only 78% on partial refunds involving promotional credits. What should the architect recommend?

A) Stop reviewing refunds, since 96% agreement is high and the partial-refund cases are a small minority of the total volume
B) Keep reviewing everything until agreement reaches 99% in each category, since any reduction before then puts customers at risk
C) Add stronger instructions about promotional credits to the prompt and stop reviewing refunds once that prompt change has been deployed
D) Reduce review for damaged-goods full refunds, keep full review for partial refunds with promotional credits, and keep sampling both

<details>
<summary>Answer & explanation</summary>

**D)** Review should be reduced only in segments that have earned it, and kept where a segment is clearly weaker, with ongoing sampling to catch drift. Stopping all review lets the overall number hide the 78% segment, and a prompt change is unverified until measured. Waiting for 99% everywhere wastes effort on a segment that has already met the bar.

*Hint if stuck: Look at what the 96 percent is made of before deciding anything.*
</details>

---

## Question 43
GraphQL resolvers in a large codebase live in nine packages (packages/*/src/resolvers/). Each package has its own CLAUDE.md with a copy of the 60-line resolver conventions, and three copies are now out of date. What should the team do?

A) Replace the copies with one .claude/rules/ file scoped to packages/*/src/resolvers/** in its paths
B) Move the conventions into the root CLAUDE.md so each session sees a single, up-to-date copy of them
C) Ask Claude to reconcile the nine copies at the start of each session, before it touches any resolver code
D) Keep the per-package files but add a script that copies the newest version into each of the nine weekly

<details>
<summary>Answer & explanation</summary>

**A)** A convention that cuts across many directories is best expressed as a single path-scoped rule: one source of truth that loads only when resolver files are touched. A sync script keeps the duplication and its drift risk. The root CLAUDE.md fixes duplication but loads the conventions in every session, and asking Claude to reconcile copies spends context on a maintenance problem.

*Hint if stuck: One convention, many directories: what gives one source of truth that still loads conditionally?*
</details>

---

## Question 44
An e-commerce pipeline asks Claude to return product attributes as JSON in a plain text response. About 2 percent of responses begin with 'Here is the extracted JSON:' or wrap the object in a code fence, crashing the downstream parser. The prompt already says 'respond with only the JSON object, no other text.' What is the root-cause fix?

A) Use strict structured outputs or a tool_use schema so conformance is guaranteed rather than requested through instructions
B) Add a regex preprocessing step that strips any leading prose and code fences before the parser runs
C) Repeat the bare-JSON instruction at both the start and the end of the prompt so the model cannot miss it
D) Detect parse failures at runtime and automatically resend the request until a clean JSON response comes back from the model

<details>
<summary>Answer & explanation</summary>

**A)** Prompt instructions are probabilistic and will occasionally be violated at scale; strict structured outputs or tool_use with a schema make conformance a guarantee of the API rather than a request. Regex stripping and retry loops patch the symptom while leaving the unreliable mechanism in place, and repeating the instruction is more of the same best-effort approach.

*Hint if stuck: Ask which option turns 'please format it this way' into a guarantee.*
</details>

---

## Question 45
A support agent's tools have detailed, well-differentiated descriptions. Yet whenever a customer mentions the word 'order', even in 'I can't log in to place an order', the agent calls lookup_order first. The system prompt contains: 'Always check the customer's ORDER history before anything else.' What is the most likely cause and fix?

A) The tool descriptions are still too short; add more usage examples to lookup_order so it is chosen more carefully
B) The agent has too many overlapping tools; remove lookup_order from it and route order questions to another agent
C) The capitalised system-prompt line pulls any 'order' mention to lookup_order; rewrite it to say when it applies
D) Force tool_choice to get_customer on every turn so the agent can no longer open with lookup_order on login issues

<details>
<summary>Answer & explanation</summary>

**C)** Keyword-heavy system prompt wording can create strong associations that override good tool descriptions, which is why the word 'order' triggers lookup_order even on login problems. Rewriting the instruction to say when order history is actually relevant removes the pull. The descriptions are already good, removing the tool breaks real order queries, and forcing a tool every turn throws away model-driven selection.

*Hint if stuck: The descriptions are fine. What else is the model reading?*
</details>

---

## Question 46
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

## Question 47
A CI review job pastes 120 lines of authentication conventions into its prompt on every run, and developers working locally separately paste the same text when they touch auth code. The conventions only matter for files under services/*/auth/. What setup removes the duplication for both?

A) Put the conventions in each developer's ~/.claude/CLAUDE.md and keep the paste in the CI prompt
B) Store the conventions in a CI secret so the review workflow can inject them into each prompt it runs
C) Commit a rule scoped to services/*/auth/** in .claude/rules/ so local and CI sessions both load it
D) Add the conventions to the root CLAUDE.md so the CI job and the local sessions both always see them

<details>
<summary>Answer & explanation</summary>

**C)** A committed path-scoped rule travels with the repository, so any Claude Code session over that checkout, local or in CI, loads it when auth files are touched. Personal CLAUDE.md files don't reach CI or new teammates. The root CLAUDE.md loads the conventions for every task, and a CI secret keeps the CI-only paste and does nothing for local work.

*Hint if stuck: What travels with the repository and still loads only for the right files?*
</details>

---

## Question 48
A team has a labelled set of 5,000 extractions with model confidence scores. It must decide whether outputs above 0.92 can be auto-approved under a 98% accuracy requirement. Which measurement answers that question?

A) The overall accuracy of all 5,000 extractions, since it reflects how the model performs across the full range of real inputs
B) The accuracy of the extractions scored above 0.92, measured per field and document type, compared against the 98% requirement
C) The average confidence score of the extractions scored above 0.92, since a high average shows those outputs are reliable
D) The share of extractions that score above 0.92, since a larger share means more of the workload can be automated safely

<details>
<summary>Answer & explanation</summary>

**B)** What matters is how often the auto-approved slice is actually correct, broken down so a weak segment cannot hide. Overall accuracy mixes in outputs that would still be reviewed, average confidence is the model's own claim rather than a measurement, and the share above threshold measures volume, not correctness.

*Hint if stuck: Measure the slice you plan to automate, not the whole.*
</details>

---

## Question 49
A customer writes to a bank's support agent: 'Please update my mailing address, and I'm disputing a $1,200 charge from a merchant I've never heard of.' Disputes over $500 must go to a human fraud team. The agent currently escalates the whole conversation at once, so the address change waits two days in the fraud queue. What should the workflow do?

A) Complete the address change, escalate only the dispute with a structured summary, and tell the customer which item is done and which is pending
B) Escalate the whole conversation as now, but mark the address change as low priority so the fraud team handles it after the dispute
C) Ask the customer to submit the address change in a separate chat after the dispute is resolved, so each conversation stays single-purpose
D) Have the agent handle both items itself, filing the dispute through its standard dispute tool and noting the amount for later fraud review by the team

<details>
<summary>Answer & explanation</summary>

**A)** Multi-concern requests should be split so each item is resolved by the right path: the agent finishes what it is authorised to do and escalates only the item that needs a human, with a structured handoff. Handling the dispute itself breaks the fraud policy, escalating everything delays a routine change and loads the fraud queue with it, and sending the customer away creates friction for a request the agent could have finished.

*Hint if stuck: Escalation applies to an item, not necessarily to the whole conversation.*
</details>

---

## Question 50
A multi-agent research system answers "How are EU battery manufacturers responding to the 2026 subsidy changes?" The coordinator spawns 14 subagents, each scoped to a single manufacturer's press releases. The final report misses industry-wide patterns entirely, and when two subagents report contradictory capacity figures, nobody can tell which publication or date each figure came from. What is the best architectural fix?

A) Keep the 14 single-manufacturer tasks but add a fifteenth subagent whose only job is to detect contradictions and delete the less credible figure from the report
B) Re-scope to fewer, broader subagent tasks that can surface cross-cutting trends, and require each subagent to return claim-source mappings with publication dates
C) Let subagents exchange findings directly with one another during research so contradictions get reconciled before the coordinator runs its aggregation pass
D) Increase to 28 subagents covering component suppliers as well, giving the coordinator more raw material from which to infer industry-wide patterns

<details>
<summary>Answer & explanation</summary>

**B)** Overly narrow decomposition causes coverage gaps — single-manufacturer scopes cannot surface cross-cutting trends — and synthesis without claim-source mappings plus dates loses provenance, making contradictions unresolvable. The fix addresses both flaws: broader task scoping and provenance metadata flowing back to the coordinator. Direct subagent-to-subagent exchange fails because inter-subagent traffic routes through the coordinator, and deleting conflicting claims discards information that attribution and temporal metadata would resolve.

*Hint if stuck: Trace each symptom back to the design decision that produced it before choosing a remedy.*
</details>

---

## Question 51
A security-review coordinator audits a payments service by spawning three subagents: SQL injection in /api/orders, XSS in /web/templates, and hardcoded secrets in /config. Two weeks after release, an SSRF vulnerability is exploited in /api/webhooks — a directory no subagent was ever assigned. What was the architectural failure?

A) Coverage gap: the full scope should be partitioned so every directory and flaw class has an owner
B) The subagents ran on Haiku, which is too weak to detect SSRF; the scouts should run on Opus
C) The SSRF-focused subagent failed silently; add retry logic so transient subagent failures are re-run
D) Each subagent prompt should have ended with 'also flag anything else suspicious you happen to notice'

<details>
<summary>Answer & explanation</summary>

**A)** Overly narrow decomposition is a known multi-agent pitfall: anything outside the assigned slices is simply never examined. The fix is to partition the entire scope — directories and vulnerability classes — so the union of subagent assignments covers everything. No SSRF agent existed to retry, and a vague 'anything else' suffix is a probabilistic patch that never guarantees /api/webhooks gets read.

*Hint if stuck: Look at which parts of the system, and which kinds of flaw, anyone was ever asked to examine.*
</details>

---

## Question 52
An architect writes the error policy for a research system built on the Claude API. Search subagents call a fetch_page tool. Two failures recur: some pages return HTTP 403, and occasionally a subagent's own model request fails with an overloaded error partway through its run. Where should each failure be handled?

A) Raise the 403 as an exception that ends the subagent so the coordinator can reassign the URL to another subagent
B) Return the 403 as an is_error result the subagent can work around; retry or report the API failure in loop code
C) Return both failures as is_error tool results so the subagent's model decides how to recover from each one the same way
D) Tell subagents in their prompt to skip failed fetches and continue silently, so neither failure interrupts the research

<details>
<summary>Answer & explanation</summary>

**B)** A tool execution error belongs in a tool_result with is_error set and an instructive message, so Claude can adapt, for example by trying another source. An API error interrupts the model call itself, so the model never gets a turn to reason about it; the code running the loop must retry with backoff or report the failure, with any partial output, to the coordinator. Ending the subagent over a routine 403 discards its context and work. The model cannot receive its own failed request as a tool result. Silent skipping hides coverage gaps from synthesis.

*Hint if stuck: Ask which failure the model is actually present to see, and which one happens to the model call itself.*
</details>

---

## Question 53
In a receipts pipeline, human reviewers correct about 400 extracted values a week, mostly tax amounts on foreign receipts. They overwrite the value and close the item, so nothing about the correction is kept, and the same errors recur month after month. The team wants the corrections to improve the system. Which changes should it make? (Choose two.)

A) Log each correction with field, document type and original value, and add the cases to the labelled set
B) Have reviewers just mark items approve or reject, which is quicker than typing in the corrected value
C) Fine-tune the model on the corrected receipts each month so that it learns the right tax values itself
D) Turn recurring patterns into prompt fixes, such as few-shot examples, and test them on that set first
E) Lower the auto-approve threshold a step each time a reviewer corrects a value in that kind of field

<details>
<summary>Answer & explanation</summary>

**A, D** Recording what was corrected, where and from what turns review effort into labelled production failures, which belong in the eval set. Recurring patterns can then be fixed in the prompt, for example with targeted examples, and the change measured on that set before it ships. Fine-tuning is outside what this system controls and doesn't give a measured fix. Moving the threshold on every correction reacts to noise without measuring accuracy. Approve or reject alone throws away the right value the next fix needs.

*Hint if stuck: Ask what a reviewer's fix can teach if it is kept, and how you'd know a change helped.*
</details>

---

## Question 54
An insurer submitted 50,000 claim-extraction requests as one batch. Twelve hours later every request came back errored because each used a parameter the model does not accept. The prompt had been tested in a notebook, but the batch request bodies were built by a different script. What practice would have caught this earliest?

A) Polling the batch at short intervals so that the team could cancel it as soon as the first errored results appeared
B) Adding a validation step that checks each extracted claim against the schema as soon as the results are downloaded
C) Splitting the job into fifty batches of 1,000 so that a bad parameter would affect a small fraction of requests
D) Sending a few request bodies from the batch script through the Messages API first, since batch params are checked later

<details>
<summary>Answer & explanation</summary>

**D)** Batch request params are validated asynchronously, so a bad body may only surface after the batch ends; sending a few real request bodies through the Messages API first catches it in seconds. Polling cannot see per-request errors until the batch is done, smaller batches would all share the same bug, and output validation runs after the requests have already failed.

*Hint if stuck: Test exactly what you will submit, using the path that answers immediately.*
</details>

---

## Question 55
A CI job runs claude -p to apply lint auto-fixes across changed files. Someone set --permission-mode plan on the job 'for safety', and since then the job reports a plan in its log but every lint error is still there. What should the team change?

A) Increase the job's turn limit so Claude has enough time to move from planning to editing
B) Add an instruction to the prompt telling Claude to exit plan mode once its plan is ready
C) Have the job approve the plan by piping 'yes' into the process once the plan is printed
D) Run lint auto-fix as direct execution with tight permissions, since it is a narrow task

<details>
<summary>Answer & explanation</summary>

**D)** Plan mode blocks source edits until a plan is approved, and that block holds in non-interactive -p runs, so a job meant to apply narrow fixes should run in a normal mode with tightly scoped permissions. More turns or a prompt instruction cannot lift the block, and piping text into a headless run is not an approval mechanism.

*Hint if stuck: What does plan mode prevent, and does that change in headless runs?*
</details>

---

## Question 56
A coordinator delegates with one-line tasks such as "research the semiconductor shortage". Two subagents end up running nearly the same searches on current supply chains, while nobody covers the 2021 auto-chip crisis the user asked about. The subagents also come back with two or three sources each, and their logs show long, very specific queries that match almost nothing. Which changes should the team make? (Choose two.)

A) Give each task an objective, an output format, the sources to use and limits such as the time period
B) Let subagents pick their own angle on the topic when they start, so the work spreads out by itself
C) Prompt the search subagents to open with short, broad queries and narrow them as they see what exists
D) Have subagents add each keyword from the user's request to every query so results stay on the topic
E) Have the coordinator write the exact query strings for each subagent, to be run in the order it gives

<details>
<summary>Answer & explanation</summary>

**A, C** Vague one-line tasks let subagents misread the job and duplicate each other; each needs an objective, output format, source guidance and clear boundaries such as the period to cover. Agents tend to write overly long, specific queries, so prompting them to start broad and then narrow brings back far more relevant sources. Exact query strings from the coordinator turn subagents into scripts and do nothing about narrow queries. Self-chosen angles are how the duplication happened. Packing every keyword into each query makes queries longer and more specific, which is the cause of the thin results.

*Hint if stuck: Two separate failures: what the coordinator tells each subagent, and how a subagent goes about searching.*
</details>

---

## Question 57
A research hierarchy runs filings subagent, then regional coordinator, then top-level coordinator, then report. The filings subagent returns a structured error: type auth_expired, source the filings mirror, 3 of 8 companies retrieved. The regional coordinator forwards only 'filings: unavailable', and the final report states that no filings exist for five of the companies. What should change?

A) Each layer passes the structured error upward intact, adding its own context instead of rewriting it as a status word
B) The regional coordinator retries the auth_expired error with backoff until it succeeds before reporting anything upward
C) The top-level coordinator queries the filings subagent directly whenever an upstream status reads 'unavailable'
D) The regional layer drops its error handling, and the final report simply leaves out any section with missing data

<details>
<summary>Answer & explanation</summary>

**A)** Recovery and honest reporting depend on the error's type, scope and partial results reaching whoever makes the final call, so every hop should forward the structured error and add context rather than collapse it; 'unavailable' let the access failure turn into a false claim that no filings exist. An expired credential is not transient, so retrying with backoff will not fix it and delays the report. Bypassing the middle layer patches one symptom and breaks the hierarchy's routing. Silently dropping sections hides the gap instead of annotating it.

*Hint if stuck: Trace which fact about the failure the final writer needed, and where it disappeared.*
</details>

---

## Question 58
In one chat, a customer of an electronics retailer raises three problems: a duplicate charge, a cracked screen on delivery and a wrong billing address. The agent works on the duplicate charge for 30 turns, older turns get summarised, and the agent then closes the chat after issuing the refund, never returning to the screen or the address. Which design change prevents this?

A) Record each raised problem as its own entry with a status in case facts kept outside the summary, and check them before closing
B) Summarise older turns less aggressively, so the opening message that listed the three problems stays visible in the history for much longer
C) Tell the agent in its system prompt to resolve the most urgent problem first and open a new chat for each remaining one
D) Ask the customer at the end of each chat whether anything else is needed, and rely on them to repeat any open problems

<details>
<summary>Answer & explanation</summary>

**A)** Summaries tend to keep the thread that dominated the conversation and blur the rest, so the list of open problems belongs in a structured block that is never summarised, with one entry and status per problem, checked before wrap-up. Asking the customer pushes the tracking onto them and fails when they assume the agent remembers. Gentler summarisation only delays the loss. Splitting into new chats makes the customer start over and still loses problems nobody recorded.

*Hint if stuck: Ask which part of the agent's state is immune to summarising, and what it would need to hold here.*
</details>

---

## Question 59
A telecom support agent answers customer messages and, in the same prompt, is told to screen each message for abuse and for attempts to obtain other customers' data. Reviews show that when it works hard on a tricky billing problem it often skips the screening, and when it screens carefully its answers get weaker. Which design addresses both problems?

A) Move the screening rules to the top of the system prompt in bold, so the agent applies them before it starts working on the billing problem
B) Screen only after the answer is written, by having the same call review both the customer's message and its own reply in one final pass
C) Run a separate screening call on each incoming message in parallel with the call that drafts the answer, and act on both results in code
D) Ask the agent to reason step by step and write its screening verdict in a tag before it answers, all inside the same single response

<details>
<summary>Answer & explanation</summary>

**C)** This is the sectioning form of parallelization: independent subtasks run as separate calls and code combines the results. Anthropic's guidance gives guardrails as the example, noting that one instance answering while another screens tends to perform better than one call handling both, because each consideration gets focused attention. Bold rules, a step-by-step tag or a self-review pass all keep both jobs in one call, which is exactly what is splitting its attention.

*Hint if stuck: Ask whether the two jobs depend on each other, and whether one call really has to carry both.*
</details>

---

## Question 60
A developer asks Claude Code to write normalize_phone() for a CRM import. After three rounds of rewording her request ("handle international numbers properly"), the function still mangles numbers with extensions and treats empty strings inconsistently, and each fix breaks a case that worked before. She already knows the exact result every input should give. Which techniques should she switch to? (Choose two.)

A) List the problem inputs, such as '+44 20 7946 0958 x12' and '', with the exact output each needs
B) Have Claude interview her about phone formats before it writes another version of the code
C) Have Claude write those cases as tests, confirm they fail, then change code until they pass
D) Switch to plan mode, so Claude writes a plan for phone handling before it edits the function
E) Add 'handle every international format and edge case' to the project CLAUDE.md for each run

<details>
<summary>Answer & explanation</summary>

**A, C** Concrete input and output pairs remove the ambiguity that prose like "properly" leaves, and failing tests give Claude a check it can run after each change, so a fix that breaks an earlier case shows up at once. An interview helps when requirements are unclear, but she already knows every expected result. Plan mode would produce a plan from the same vague description. Another prose instruction in CLAUDE.md repeats the approach that has already failed three times.

*Hint if stuck: When she already knows the answers, what form lets Claude check its own work against them?*
</details>

---

## Answer key (no peeking until scored)

1:D 2:B 3:C 4:B 5:B,C 6:C 7:A 8:B 9:C 10:A,C 11:C 12:D 13:A,E 14:A,E 15:C 16:B 17:D 18:B 19:C 20:B 21:B 22:B 23:A 24:D 25:C 26:D 27:A 28:C 29:D 30:B 31:B 32:A 33:B 34:D 35:B 36:D 37:C 38:A 39:C 40:B 41:A 42:D 43:A 44:A 45:C 46:B 47:C 48:B 49:A 50:B 51:A 52:B 53:A,D 54:D 55:D 56:A,C 57:A 58:A 59:C 60:A,C
