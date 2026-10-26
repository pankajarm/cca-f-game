# Practice Test 10: Synthesis Chamber
**D5: Context Management & Reliability** (15% of the exam) · task statements 5.4, 5.5, 5.6

58 questions. Exam pace is 2 minutes per question.

---

## Question 1
A developer has spent two hours with Claude Code tracing a flaky checkout test across a 900-file Rails app, and the context is nearly full of log dumps and file reads. Next she wants Claude to implement the fix for the race condition they finally isolated in the order-lock service. What should she do before starting the implementation?

A) Raise the auto-compact threshold with /autocompact so the window can hold more of the debugging transcript while the implementation phase gets underway
B) Run /clear so the implementation starts from a fresh window, then paste the last few assistant messages back in by hand so the conclusions carry over
C) Let automatic compaction trigger whenever the window fills, since the automatic pass already decides which parts of the debugging history are worth keeping
D) Run /compact with an instruction to keep the isolated root cause, the affected files and the agreed fix, so the summary preserves what the next phase needs

<details>
<summary>Answer & explanation</summary>

**D)** Compacting at the phase boundary with focus instructions keeps exactly the conclusions the implementation needs and drops the noisy logs. Letting the automatic pass decide may keep the wrong details, and raising the threshold keeps more of the very noise that is crowding the window. Clearing and pasting a few messages back by hand risks losing the specifics the earlier messages held.

*Hint if stuck: Ask who should decide what carries over when one phase of work ends and the next begins.*
</details>

---

## Question 2
An engineer joining a platform team asks Claude Code, in her main session, how feature flags are evaluated across 30 microservices in a monorepo. Claude starts reading service after service, and after twelve services the context is already 60% full before she has written any code. What change gives her the answer without consuming her working context?

A) Ask Claude to read only the first 200 lines of each service file so that more of the thirty services fit into the session before it fills up
B) Switch the session to a 1M-token model variant so all thirty services can be read in full into the main conversation before any coding begins
C) Add every service's directory to CLAUDE.md with a one-line description so Claude can answer the question from memory without opening the code
D) Delegate the question to a subagent that explores the services in its own context and returns a short summary with the relevant file paths

<details>
<summary>Answer & explanation</summary>

**D)** A subagent does the heavy reading in a separate context window and hands back only a summary, so the main session stays free for the actual work. A bigger window or truncated reads still pour raw file content into the main conversation, and a directory list in CLAUDE.md cannot answer how flags are actually evaluated.

*Hint if stuck: Ask whether the main session needs the files themselves or only the conclusion drawn from them.*
</details>

---

## Question 3
After finishing a payments refactor in Claude Code, a developer switches to an unrelated task: updating the documentation build for the marketing site. The session still holds hours of payments discussion, and Claude's first doc edits mention payment module conventions that do not apply. What is the best move?

A) Run /compact with an instruction to focus on the documentation work so that the payments history is condensed but still available if needed
B) Keep going and correct Claude each time it brings up payments conventions, since the stale history will scroll out of the window soon enough
C) Add a line to CLAUDE.md telling Claude to ignore payment-module conventions whenever it is working on files under the marketing site directory
D) Run /clear before starting the documentation task, because the old conversation is unrelated and only crowds out what the new task needs

<details>
<summary>Answer & explanation</summary>

**D)** For unrelated work the docs recommend /clear: the old conversation has no value for the new task and keeps steering it. Compacting still carries a payments summary forward, and a CLAUDE.md rule patches one symptom while the irrelevant history keeps costing tokens on every message. Correcting it turn by turn leaves the root cause in place.

*Hint if stuck: Ask what the documentation work would lose if the payments discussion vanished.*
</details>

---

## Question 4
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

## Question 5
A CI job runs Claude Code headlessly on every pull request in a 12,000-file monorepo to flag risky changes. The prompt is 'review this repository for problems introduced by the PR', and runs regularly take 25 minutes, read hundreds of untouched files and sometimes time out. What is the most effective fix?

A) Give the job a longer timeout and a bigger runner so that the review can finish even when it reads large parts of the repository on each pull request
B) Pre-load the entire repository into the prompt with a concatenation script so that Claude never has to spend time searching for files itself
C) Split the repository into four parallel CI jobs that each review a quarter of the codebase, then merge their findings into one comment
D) Scope the prompt to the PR diff and the changed files, and let Claude pull in nearby callers only when the diff calls for it

<details>
<summary>Answer & explanation</summary>

**D)** An unscoped prompt invites whole-repo exploration; pointing Claude at the diff and changed files keeps the context on what the PR actually touched. More time, more runners or splitting the repo across jobs still reviews thousands of files the PR never changed, and pasting the repo in fills the window with noise before the review starts.

*Hint if stuck: Narrow the question before you add more compute.*
</details>

---

## Question 6
A team uses Claude Code for a three-phase job on a legacy billing system: map every place tax is calculated, design a single tax module, then migrate callers. Phase one takes a full session and produces dozens of findings, but by the design phase Claude is recommending changes that contradict call sites it found earlier. What working pattern should the team adopt?

A) Repeat the full list of call sites inside each design prompt, typing them from the team's notes so Claude cannot lose track of any of them
B) Keep all three phases in one continuous session so that Claude retains direct memory of every call site it found, and avoid compacting at any point
C) Ask Claude at the start of the design phase to re-read every file it opened during mapping, so its findings are fresh in context again
D) Have Claude write phase-one findings to a scratchpad file with file paths and notes, then begin the design phase in a fresh session that reads that file

<details>
<summary>Answer & explanation</summary>

**D)** Persisting findings to a file turns them into durable state that survives compaction and session boundaries, and a fresh session starts with only what matters. Keeping one ever-growing session is what caused the drift, and re-reading every file refills the context with the same raw material. Retyping the list by hand is fragile and still competes with the accumulated noise.

*Hint if stuck: Findings that must outlive the conversation belong somewhere other than the conversation.*
</details>

---

## Question 7
Early in a long Claude Code session, a developer told Claude in chat: 'never edit anything under src/generated/, those files are rebuilt from protobufs.' Hours later, after automatic compaction, Claude edits two generated files. Which fix makes the constraint hold across compactions?

A) Repeat the instruction in chat every time a compaction notice appears, so the most recent summary always contains it
B) Increase the auto-compact threshold so compaction runs less often and the original chat message stays in context longer
C) Put the constraint in the project-root CLAUDE.md, which is re-injected from disk after compaction
D) Ask Claude to acknowledge the rule in writing at the start, since acknowledged instructions are weighted more heavily in summaries

<details>
<summary>Answer & explanation</summary>

**C)** Chat instructions are summarized with the rest of the history, so they can be lost in compaction; the project-root CLAUDE.md is reloaded from disk afterward. Repeating it after each compaction depends on someone noticing, and delaying compaction only postpones the loss. Summaries do not weight acknowledged instructions any more heavily.

*Hint if stuck: Ask where a rule should live if it has to outlast the chat message that first stated it.*
</details>

---

## Question 8
An overnight research coordinator gives a subagent the task 'explore the regulatory landscape for drone delivery'. The subagent returns 9,000 tokens of loosely ordered notes covering five countries, and the coordinator then has to spend its own context re-reading them to find the US and EU rules it actually needed. How should the delegation be changed?

A) Have the coordinator post-process the subagent's notes with a second summarizing subagent before reading them, so the coordinator sees a shorter version
B) Give the subagent more tools and a higher turn limit so that it can explore the topic more thoroughly and return a more complete set of notes
C) Let the coordinator read the regulatory sources directly instead of delegating, because the subagent's output is too long to be useful to it
D) Ask the specific question (current US and EU rules on beyond-visual-line-of-sight delivery) and specify a compact output format with sources

<details>
<summary>Answer & explanation</summary>

**D)** Delegation works best with a specific question and a defined return shape; a vague 'explore' task produces a sprawling dump that costs the coordinator context. More tools and turns make the dump bigger, and a second summarizer adds a lossy hop without fixing the vague request. Reading the sources directly puts all the raw material into the coordinator's own window.

*Hint if stuck: The quality of a subagent's answer starts with the question it is given.*
</details>

---

## Question 9
A developer needs three separate facts before refactoring a service in a large Go monorepo: where retries are configured, how config is loaded at startup, and which tests cover the payment client. Doing it in the main session took 40 file reads last time. Which approach should the architect recommend?

A) Ask the three questions one after another in the main session, running /compact after each answer to recover the context they used up
B) Spawn three subagents in parallel, each with one question, and have each return the answer with file paths and line references
C) Have one subagent answer all three questions in sequence so that it can reuse whatever it learns about the codebase between the questions
D) Write the three questions into CLAUDE.md so that every future session already knows to look for retries, config loading and payment tests

<details>
<summary>Answer & explanation</summary>

**B)** Independent questions map well to parallel subagents, each returning a compact answer with references, so the main context receives only the facts. Asking in the main session with compaction in between still pays for the reads and loses detail in each summary. One subagent for all three serializes the work, and CLAUDE.md is for standing instructions, not one-off questions.

*Hint if stuck: Independent questions can run side by side in separate contexts.*
</details>

---

## Question 10
A weekly CI job uses Claude Code to find unused exports across 340 packages in a TypeScript monorepo. The run takes about six hours, and when the runner is preempted at package 260 the next run starts over from package 1. What should the architect add?

A) A larger, non-preemptible runner and a retry wrapper that restarts the job from the beginning automatically whenever the runner is lost
B) A step that commits the partial report to the repository every hour, so the team at least sees some of the findings when a run fails
C) A manifest file recording each package's status and findings as it finishes, which a restarted run reads to process only the remaining packages
D) An instruction in the prompt telling Claude to skip packages that it remembers having analyzed in a previous run of the job

<details>
<summary>Answer & explanation</summary>

**C)** A manifest of per-package status and results is durable state a restarted run can resume from, so preemption costs one package instead of the whole job. Retrying from the start repeats six hours of work, and committing partial reports shows results without letting the next run resume. A fresh headless run has no memory of earlier runs to rely on.

*Hint if stuck: Recovery needs state that lives outside any single run.*
</details>

---

## Question 11
A developer notices that Claude Code responses have slowed and grown vaguer partway through a long session in a big repository, but he is not sure whether the cause is MCP tool definitions, large file reads or the conversation itself. What is the most useful first step?

A) Disable every MCP server for the rest of the session, since tool definitions are the most common reason that context fills up quickly
B) Ask Claude to summarize what it currently remembers about the task, and compare that summary against the developer's own notes on it
C) Restart Claude Code with a new session and re-explain the task from memory, since any long session eventually degrades in the same way
D) Run /context to see what is taking up the window, then target the biggest category with the fitting fix

<details>
<summary>Answer & explanation</summary>

**D)** /context gives a live breakdown by category, so the fix can target the real cause instead of a guess. Disabling all MCP servers assumes the answer, restarting throws away useful state without learning anything, and asking Claude to self-report its memory does not show where the tokens are going.

*Hint if stuck: Measure before you cut.*
</details>

---

## Question 12
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

## Question 13
A research coordinator keeps a running list of findings only in its conversation history. During a long run its context is compacted, and the final report omits two key findings from early subagents that the summary dropped. What design keeps findings safe from compaction?

A) Have the coordinator re-request all early subagent results just before writing the report, so they are back in context at the right time
B) Have the coordinator append each finding to an external findings store as it arrives and build the report from that store
C) Instruct the coordinator to mark important findings with a special tag so the summarizer is more likely to keep them during compaction
D) Turn off compaction for the coordinator so that its conversation history always keeps every finding exactly as each subagent first returned it

<details>
<summary>Answer & explanation</summary>

**B)** Writing each finding to an external store makes it durable, so the report no longer depends on what a summary happened to keep. Disabling compaction only delays the problem until the window runs out, and tagging makes it more likely but not certain a finding survives. Re-requesting results reruns paid work and still relies on the coordinator remembering what to ask for.

*Hint if stuck: Durable state should not live only in a window that gets summarized.*
</details>

---

## Question 14
A team's .claude/rules/money.md has paths: src/payments/** and says amounts must use the Money type, never floats. Early in a long session Claude edits payment files and follows it. After an automatic compaction, Claude works in src/billing/ helpers that call into payments and writes float arithmetic. The team wants this rule in effect for the whole session, whatever files Claude has opened lately. What should they change?

A) Move the rule into a CLAUDE.md inside src/payments/ so it sits next to the code it governs and loads with it
B) Add the rule to the focus instructions of one manual /compact, so that summary carries the rule forward
C) Keep the paths: frontmatter but mark the rule IMPORTANT so it is weighted more heavily whenever it loads
D) Remove the paths: frontmatter or move the rule into the root CLAUDE.md, which is re-injected after compaction

<details>
<summary>Answer & explanation</summary>

**D)** Path-scoped rules and nested CLAUDE.md files load into message history when Claude touches a matching file, so compaction summarizes them away and they come back only when such a file is touched again. Unscoped rules and the project-root CLAUDE.md are re-injected from disk after every compaction, which is what a session-wide rule needs. A nested CLAUDE.md in src/payments/ has the same on-demand behaviour. One focused /compact helps that summary only, not later compactions. Emphasis changes weight once loaded, not whether the rule is loaded.

*Hint if stuck: Ask which instruction sources are rebuilt from disk when the conversation is summarized, and which return only when a trigger fires.*
</details>

---

## Question 15
A developer has been working with Claude Code on a 40-package monorepo for five hours straight. Early in the session the agent cited exact file paths and line numbers; now it says things like "this service typically follows the standard repository pattern" and proposes an edit to a helper function that does not exist. What is the most likely explanation?

A) Anthropic silently routed the session to a smaller model under load, reducing answer quality and recall of specifics midway through the session
B) Hours of accumulated verbose tool output are degrading recall — vague generalities and invented specifics are classic long-session degradation
C) The project CLAUDE.md was evicted from the prompt cache, so the team's coding conventions are no longer visible to the model in later turns
D) The developer's recent prompts have grown too short, leaving the model without enough instruction to stay specific about files and line numbers

<details>
<summary>Answer & explanation</summary>

**B)** Multi-hour sessions accumulate verbose tool output that buries the specifics the model once cited precisely; the telltale symptom is a shift from exact citations to vague generalities and invented details. The remedy is context hygiene (scratchpads, /compact, subagent delegation). Claude Code does not silently swap models mid-session, and prompt-cache eviction affects cost and latency, not what is present in context.

*Hint if stuck: Think about what keeps accumulating when one conversation runs all day.*
</details>

---

## Question 16
An engineer spent the first 20 messages of a Claude Code session giving a precise spec for migrating analytics reports. Then came a 90-minute detour fixing a broken local database, with thousands of log lines. The detour is over; she wants the spec kept word for word, a brief record of what the database fix was, and the detour's bulk out of context. What should she do?

A) Run /rewind, pick the message where the detour began, and choose Summarize from here
B) Run /compact, which condenses the whole conversation, spec included, into one structured summary
C) Run /clear and paste the spec back in, since a restart is the only way to drop the detour's output
D) Run /rewind to where the detour began and choose Restore conversation, dropping everything after it

<details>
<summary>Answer & explanation</summary>

**A)** Summarize from here compresses the conversation from the selected message forward and leaves earlier messages intact, so the spec stays verbatim while the detour shrinks to a summary that still records the fix. /compact summarizes everything, including the spec she wants kept exactly. /clear throws away the spec and the record of the fix, and relies on her pasting things back. Restore conversation removes the detour entirely, losing what was learned about the database.

*Hint if stuck: She wants different treatment for messages before and after one point; look for the tool that works on part of the history.*
</details>

---

## Question 17
An overnight multi-agent research coordinator fans out 60 subagent tasks over roughly seven hours. A crash at hour five currently forces rerunning everything, wasting about $90 of API spend per incident. The team is debating recovery designs. Which is best?

A) Enable 1-hour prompt caching on the coordinator's stable prefix so a restarted run reuses the cached work and skips already-completed reasoning
B) Append each completed subagent's task id, status, and structured findings to a manifest; a restarted coordinator loads it and dispatches only incomplete tasks
C) Persist the coordinator's full message history to disk every 10 minutes and on restart replay the conversation from the most recent snapshot to continue work
D) Wrap every subagent call in retry-with-backoff so transient failures never surface and coordinator crashes become effectively impossible to hit

<details>
<summary>Answer & explanation</summary>

**B)** A manifest recording completed task ids plus their structured findings is the minimal durable state needed to resume: restart logic deterministically skips finished work and re-dispatches only the rest. Replaying full message history restores bloated context and a fragile transcript rather than clean state, prompt caching is a cost optimization that holds no completion state, and retries handle transient tool errors but cannot make process crashes impossible.

*Hint if stuck: Ask what small record would let a fresh run skip the work that already finished.*
</details>

---

## Question 18
During a multi-hour Claude Code migration of 140 modules, a script keeps migration-progress.json up to date. After each automatic compaction, Claude loses track of which modules are already done and re-migrates some of them. The team wants the current progress back in Claude's context right after every compaction, with no manual steps. What should they set up?

A) A copy of the progress list in the project CLAUDE.md, which engineers update by hand after each module
B) A later auto-compact threshold set with /autocompact, so compaction happens later and less often
C) A SessionStart hook with the compact matcher that prints a summary of migration-progress.json
D) A path-scoped rule matching the migrated modules that holds the progress list and loads with those files

<details>
<summary>Answer & explanation</summary>

**C)** Claude Code runs SessionStart hooks that match the compact source after compaction and adds their output to the compacted context, and the command can print dynamic state such as a summary of the progress file. CLAUDE.md is re-injected after compaction but suits stable instructions; hand-maintained progress goes stale and needs manual steps. Delaying compaction changes when details are lost, not whether. Path-scoped rules load into message history only when a matching file is touched, so compaction summarizes them away.

*Hint if stuck: Look for the mechanism that runs automatically at the moment the context has just been rebuilt.*
</details>

---

## Question 19
A logistics company extracts data from bills of lading, customs declarations and delivery receipts. Every document currently gets full human review. After a month the dashboard shows 98% field accuracy overall, and operations wants to stop reviewing anything above a confidence of 0.85. What should the architect insist on first?

A) Approve the change, since 98% accuracy across thousands of documents already proves the extraction is reliable enough to need less review
B) Lower the threshold to 0.75 first to see how much the reviewer workload drops, then decide whether to go further based on reviewer feedback
C) Measure accuracy by document type and by field on a labelled set, and lower review only where each segment meets the target
D) Ask the model to report its own accuracy for each document type, and stop review for any type where it says it is more than 95% accurate

<details>
<summary>Answer & explanation</summary>

**C)** An aggregate number can hide a document type or field that fails badly, so review should be lowered segment by segment against labelled data. Approving on the 98% overall figure is exactly that trap, and lowering the threshold to watch workload measures cost, not accuracy. The model's own estimate of its accuracy is not ground truth.

*Hint if stuck: Ask where the 98% comes from before trusting it everywhere.*
</details>

---

## Question 20
An invoice extraction pipeline attaches a confidence score to each field, and the team plans to auto-approve anything above 0.9. A labelled check of 2,000 fields shows that fields scored 0.9 to 1.0 are correct only 84% of the time, while the team's target is 97%. What should they do?

A) Add a sentence to the prompt asking the model to be more conservative with its scores, then auto-approve fields above 0.9 as planned
B) Drop confidence scores entirely and send every field to human review, since the scores have shown they cannot be trusted at all
C) Keep the 0.9 threshold and add a second model that re-scores each field, auto-approving only when both models report a score above 0.9
D) Calibrate the threshold on labelled data, choosing the score cut-off where observed accuracy actually reaches 97% for each field

<details>
<summary>Answer & explanation</summary>

**D)** Raw scores are only useful once they are mapped to observed accuracy on labelled data; the right threshold is wherever accuracy really meets the target, per field. Prompting for conservative scores leaves them uncalibrated, and a second uncalibrated scorer gives no ground truth either. Dropping scores throws away a signal that calibration could make usable.

*Hint if stuck: Ask what would have to be true of a score before it can safely gate auto-approval.*
</details>

---

## Question 21
A support team wants to audit its resolution agent each week with 150 human-reviewed conversations. The current plan samples only conversations the agent marked 'unresolved' or that customers rated poorly, and the audit has found few problems for two months. Which sampling plan gives a truer picture of quality?

A) Draw a stratified random sample across issue categories, including conversations the agent closed as resolved with high confidence
B) Sample conversations that run longest in each category, since a long conversation is the strongest single signal of a resolution going wrong
C) Keep the current plan but double the sample size to 300 conversations each week so that rarer problems have a better chance of appearing
D) Sample only conversations the agent marked 'unresolved', because those are where its mistakes are most likely to show up

<details>
<summary>Answer & explanation</summary>

**A)** Only random sampling within each category, including confident 'resolved' cases, can reveal errors the agent does not know it is making. Sampling only flagged or poorly rated conversations, or only long ones, inspects where problems are already suspected, and doubling a biased sample makes it bigger without making it representative.

*Hint if stuck: Confidently wrong work never shows up in a sample of self-flagged work.*
</details>

---

## Question 22
A receipts extraction system returns a 'total' field and line items. On one receipt the line items sum to 48.20 but the extracted total is 84.20, and the model reports 0.97 confidence for both. The review queue is ordered by lowest confidence. How should this case be handled?

A) Trust the high confidence for this receipt, since both values were extracted cleanly and the mismatch is probably a rounding difference
B) Add a code check that compares the line-item sum with the extracted total and sends any mismatch to human review, ahead of confidence ordering
C) Recompute the total from the line items in code and silently overwrite the extracted total so the record stays internally consistent
D) Ask the model to re-extract the receipt with a prompt that stresses accuracy, and keep whichever total comes back the second time

<details>
<summary>Answer & explanation</summary>

**B)** An internal contradiction is a strong error signal no matter what the confidence says, so a deterministic check should send it to a person first. Trusting the confidence ignores clear evidence of an error. Silently overwriting the total assumes the line items are the correct side, and re-extracting just picks one of two answers without verifying either.

*Hint if stuck: A contradiction inside the record outranks the model's confidence.*
</details>

---

## Question 23
A policy research team has 10 reviewer-hours a week to fact-check reports from its multi-agent system, which typically produce about 400 claims each week. Most claims cite two or more agreeing sources, some cite one, and some cite sources that disagree. How should reviewer time be allocated?

A) Spend all reviewer time on the single-source and conflicting claims, since claims with agreeing sources can be assumed correct
B) Review claims in report order from the top until the hours run out each week, so that the opening findings readers see first are always verified
C) Review single-source and conflicting claims first, and also check a random sample of well-supported claims to measure their real error rate
D) Review the claims the synthesis agent rates as least confident, since its self-assessment is the best guide to where its errors are

<details>
<summary>Answer & explanation</summary>

**C)** Routing the riskiest claims to people first uses scarce time well, and a random sample of well-supported claims shows whether that confidence is earned. Assuming well-supported claims are correct leaves their error rate unmeasured. Reviewing in report order ignores risk, and the agent's own confidence is not calibrated.

*Hint if stuck: Ask whether skipping a group entirely leaves you any way to know if skipping it was safe.*
</details>

---

## Question 24
A mortgage-document extraction service handles 12 document types; handwritten gift letters make up 2% of volume. The team draws a uniform random sample of 300 extractions a month to estimate accuracy, which yields about six gift letters, and has concluded those letters are fine. What is the problem, and the fix?

A) The sample is too small overall, so it should grow to 3,000 random extractions a month to make every estimate precise enough
B) The model should be asked to report extra-careful confidence on gift letters so that low scores flag any problems with that type
C) Gift letters are only 2% of volume, so their accuracy barely affects the overall number and can be safely left out of monthly QA
D) Six samples cannot support a reliable estimate for the rare type, so stratify and oversample gift letters to get a meaningful per-type measure

<details>
<summary>Answer & explanation</summary>

**D)** Uniform sampling gives rare types too few items to estimate anything, so stratified sampling with oversampling of rare strata is needed for a real per-type estimate. Growing the whole sample tenfold is a costly way to get there, and excluding a type because it is rare is how weak segments go unnoticed. Self-reported confidence does not substitute for measurement.

*Hint if stuck: Count how many of the rare documents the monthly QA actually examines, then ask what that count can support.*
</details>

---

## Question 25
A CI review bot built on Claude Code leaves comments in four categories: security, performance, style and test gaps. The platform team wants to let style and test-gap comments block merges automatically. Developers complain that some categories are noisy. What should the architect do before enabling auto-blocking?

A) Have engineers label a sample of the bot's comments in each category, and enable blocking only for categories whose measured precision meets the bar
B) Enable blocking for all four categories at once and let developers override false positives, which will also generate useful feedback
C) Ask the bot to rate its own certainty on each comment and block merges only when it reports being highly certain of the finding
D) Enable blocking for style comments only, because style is the most objective category and is unlikely to produce false positives

<details>
<summary>Answer & explanation</summary>

**A)** Automation should be earned per category with precision measured against human labels, since noisy categories erode trust in the whole bot. Blocking everything at once puts the cost of false positives on developers, and the bot's self-rated certainty is not calibrated. Assuming style is objective is a guess, not a measurement.

*Hint if stuck: Earn automation one category at a time, with evidence.*
</details>

---

## Question 26
A team uses Claude Code to generate API reference docs and an LLM judge to score them for accuracy; the judge rates 94% as 'accurate'. When two senior engineers read 50 docs, they judge only 70% accurate, mostly due to wrong parameter defaults the judge missed. What should the team do?

A) Replace the judge with a larger, more capable model, since a stronger grader will catch the wrong parameter defaults without any further changes
B) Calibrate the judge against expert labels: refine its rubric and inputs until its grades match the engineers', and keep spot-checking periodically
C) Average the judge's score with the engineers' score to get a combined accuracy figure that the team can report from now on
D) Trust the judge's 94% for reporting, since 50 docs is too small a sample to overrule a grader that has scored thousands of documents

<details>
<summary>Answer & explanation</summary>

**B)** An LLM judge is only trustworthy once its grades agree with human experts, so the rubric needs refining against their labels and periodic spot checks. A bigger model is not calibrated by being bigger, and averaging two disagreeing numbers hides the problem. A 24-point gap on 50 expert-reviewed docs is strong evidence the judge is miscalibrated, not noise.

*Hint if stuck: A grader needs a reference to be trusted against.*
</details>

---

## Question 27
An insurance claims pipeline extracts 20 fields per claim but returns a single document-level confidence. Any claim below 0.8 goes to a reviewer, who then re-checks all 20 fields by hand, and review costs are rising. Which change makes human review more efficient without losing accuracy?

A) Lower the document-level threshold to 0.7 so that fewer claims are sent to reviewers, while keeping the full 20-field check for each one
B) Have the model write a summary of each claim so that reviewers can skim it instead of checking the individual extracted fields
C) Produce calibrated confidence for each field and have reviewers check only the fields flagged as low confidence
D) Split the 20 fields across two reviewers who each check ten, so that every flagged claim moves through the review queue twice as fast

<details>
<summary>Answer & explanation</summary>

**C)** Calibrated field-level confidence points reviewers at the fields that are actually uncertain instead of the whole document. Lowering the document threshold just reviews fewer claims and lets more errors through, without making each review more efficient. Splitting fields across reviewers keeps the full workload, and a skimmable summary hides the field errors reviewers are there to catch.

*Hint if stuck: Make the confidence signal as fine-grained as the review work.*
</details>

---

## Question 28
Human agents review every refund the support agent approves. Overall, reviewers agree with the agent 96% of the time, so leadership wants to stop reviewing refunds. A breakdown shows 99% agreement on full refunds for damaged goods but only 78% on partial refunds involving promotional credits. What should the architect recommend?

A) Stop reviewing all refunds, since 96% agreement is high and the partial-refund cases are a small minority of the total volume
B) Keep reviewing everything until agreement reaches 99% in every category, since any reduction before then puts customers at risk
C) Add stronger instructions about promotional credits to the prompt and stop reviewing refunds once that prompt change has been deployed
D) Reduce review for damaged-goods full refunds, keep full review for partial refunds with promotional credits, and keep sampling both

<details>
<summary>Answer & explanation</summary>

**D)** Review should be reduced only in segments that have earned it, and kept where a segment is clearly weaker, with ongoing sampling to catch drift. Stopping all review lets the overall number hide the 78% segment, and a prompt change is unverified until measured. Waiting for 99% everywhere wastes effort on a segment that has already met the bar.

*Hint if stuck: Look at what the 96 percent is made of before deciding anything.*
</details>

---

## Question 29
Reviewers correct about 300 extracted fields a week in a purchase-order pipeline, but their corrections are only used to fix the individual records. Six months on, the confidence thresholds set at launch still drive routing even though vendors have changed their templates. What improvement should the architect make?

A) Store reviewer corrections as labelled data and use them to re-check calibration and adjust per-field thresholds on a regular schedule
B) Have reviewers leave comments explaining each correction so that prompt engineers can read them whenever they next update the prompt
C) Lower every threshold by 0.05 each quarter to compensate for template drift, so more fields reach reviewers as vendor formats change
D) Retrain reviewers every quarter so their corrections stay consistent as vendors change, keeping the launch thresholds unchanged

<details>
<summary>Answer & explanation</summary>

**A)** Reviewer corrections are a continuous source of ground truth, so feeding them back into calibration keeps thresholds tied to current accuracy as inputs drift. A fixed quarterly cut is a guess rather than a measurement, and comments for prompt engineers are not a calibration mechanism. Retraining reviewers does nothing about stale thresholds.

*Hint if stuck: The review queue produces labels as well as fixes.*
</details>

---

## Question 30
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

## Question 31
A team used Claude Code to generate 420 unit-test files for a legacy inventory service. Reviewing every file would take weeks, but merging them unreviewed worries the tech lead, since past generated tests sometimes asserted buggy behavior. What is the sound review approach?

A) Merge all of them, since generated tests that pass on the current code are by definition correct descriptions of how it behaves
B) Review the first 40 files in alphabetical order, and merge the rest if those 40 all look correct to the reviewing engineers
C) Review a stratified random sample across modules and complexity, measure the defect rate per stratum, and review fully where it is high
D) Ask Claude Code to review its own generated tests in the same session and flag any tests that it believes might be asserting buggy behavior

<details>
<summary>Answer & explanation</summary>

**C)** A stratified sample estimates quality per module and complexity band, so full review can be targeted where defects actually cluster. Passing tests can lock in existing bugs, and the first files alphabetically are not representative. Self-review in the same session tends to repeat the reasoning that produced the tests.

*Hint if stuck: Ask whether the files you check tell you anything about the ones you do not.*
</details>

---

## Question 32
To calibrate confidence thresholds for a contract-clause classifier, a team has two lawyers label 1,000 clauses. They disagree on 20% of clauses for the 'limitation of liability' category, mostly where indemnity language overlaps. The team plans to use the first lawyer's labels and proceed. What should happen first?

A) Proceed with the first lawyer's labels, since any single qualified expert is a reasonable gold standard and calibration will absorb the remaining noise
B) Average the two lawyers' labels into a probability per clause and calibrate the thresholds against those averaged soft labels
C) Ask the model to label the disputed clauses as a tiebreaker, since it can apply the category definition consistently across all of them
D) Reconcile the disagreements and tighten the labelling guideline for the overlap until agreement is acceptable, then calibrate against those labels

<details>
<summary>Answer & explanation</summary>

**D)** Calibration is only as good as its ground truth; 20% disagreement means the category is ambiguous, so the guideline needs fixing and the disputes reconciled first. Picking one lawyer's labels hard-codes one reading of an unclear rule, and averaging keeps the ambiguity in the labels. Using the model as tiebreaker calibrates the model against itself.

*Hint if stuck: Check the ruler before you measure with it.*
</details>

---

## Question 33
An expense-receipt pipeline passes 97 percent of extractions through schema and business-rule validation. A quarterly audit then finds that some passing records have the merchant and the payment processor swapped, which no current rule checks. What is the best way to close this gap going forward?

A) Ask the model to add a self-reported confidence to every record and send all records under a fixed threshold to auditors
B) Sample passing records for human review on a regular schedule and turn each recurring error type into a new rule or example
C) Raise the validation bar by requiring two independent extractions to match exactly before any record is allowed to pass
D) Wait for the next quarterly audit and fix whichever error types it finds, since the overall pass rate is already very high

<details>
<summary>Answer & explanation</summary>

**B)** Validators only catch what they check, so regular sampling of passing records finds new error types early, and feeding them back as rules or examples closes the loop. Self-reported confidence is poorly calibrated for errors the model does not see, requiring two extractions to agree doubles cost and both can make the same swap, and waiting a quarter lets errors accumulate behind a high pass rate.

*Hint if stuck: Passing validation only means passing the checks you thought to write.*
</details>

---

## Question 34
Claims reviewers can check 400 of the 3,000 extractions the pipeline produces each day, and today they take them in arrival order. Each extraction carries calibrated field confidence and the results of consistency checks, such as line items that do not sum to the total or a loss date before the policy start. How should the review queue be built?

A) Keep arrival order so every document has the same chance of review, and add reviewers when budget allows
B) Send reviewers only the highest-value claims, since dollar amount is the clearest sign of where errors matter
C) Spread the 400 reviews evenly across document types so each type gets the same number of checks per day
D) Put items with failed consistency checks or low calibrated confidence first, ordered by the payout at stake

<details>
<summary>Answer & explanation</summary>

**D)** Scarce review time should go where errors are most likely and most costly: internal contradictions and low calibrated confidence are the strongest error signals, and the amount at stake breaks ties, the same idea as routing by risk level. Arrival order spends most reviews on items that are probably fine. Value alone sends clean high-value claims to humans while contradictory low-value ones pass. Even spreading across types is a measurement design; a small stratified random sample should run alongside to estimate error rates, but it is not how to triage which risky items get checked.

*Hint if stuck: Ask which signals say an item is likely wrong, and which say it matters if it is.*
</details>

---

## Question 35
An expense-report extraction system shows 97% field-level accuracy on its aggregate dashboard, but the finance team keeps escalating wrong totals from handwritten receipts, which make up 4% of volume. Engineering points out that 97% comfortably exceeds the 95% SLA. What is the flaw in that reasoning?

A) The SLA threshold is simply set too low; raising the aggregate accuracy target from 95% to 99% would force the handwritten receipt problem to surface on the dashboard
B) A measured 97% is statistically indistinguishable from the 95% floor at this volume, so the system may already be violating the SLA without anyone noticing
C) Aggregate accuracy masks per-segment failure — receipts may be failing badly while printed invoices carry the average; validate accuracy per document type and field
D) The finance team is anchoring on rare anecdotes; at 97% field accuracy some visible errors are statistically expected and remain acceptable under the SLA

<details>
<summary>Answer & explanation</summary>

**C)** A 4% segment can fail almost completely while the blended average stays above target — near-perfect printed invoices plus badly failing handwritten receipts still averages around 97%. The governing rule is per-segment validation by document type and field; raising the aggregate target is a patch that still cannot localize which segment is broken, and the escalations are a systematic segment failure, not anecdotal noise.

*Hint if stuck: Work out what 97 percent overall could look like if one small slice of documents were mostly wrong.*
</details>

---

## Question 36
A healthcare patient-intake system extracts 14 fields from 6,000 faxed forms daily; medication dosage and allergy fields are safety-critical. Reviewing every form by hand costs too much, and a 5% random spot-check let a dosage error through last month. How should human review be routed?

A) Route forms to human review whenever the model's overall document-level confidence score falls below a fixed 0.8 threshold
B) Route a fixed 20% random sample to review, weighted toward forms received outside business hours when fax quality is at its worst
C) Route on deterministic field-level signals: null dosage or allergy values, schema failures, or out-of-range dosage units trigger review
D) Re-extract every form a second time with the same model and prompt, and route to human review only the forms where the two passes disagree on any field

<details>
<summary>Answer & explanation</summary>

**C)** Review capacity should concentrate where errors are costly: deterministic per-field validation on the safety-critical fields (nulls, schema failures, out-of-range values) catches the dangerous cases. A document-level confidence score is poorly calibrated and can stay high even when one critical field is wrong — the same masking problem as aggregate accuracy. Bigger random samples spend budget on harmless fields, and double extraction doubles cost while missing systematic errors the model makes identically both times.

*Hint if stuck: The unit of risk in this pipeline is the field, not the document.*
</details>

---

## Question 37
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

## Question 38
A legal-contracts extraction service runs monthly QA by reviewing the 200 extractions where the model reported the lowest confidence; sampled accuracy has held steady near 91% for three quarters. A client audit then finds a 22% error rate on a new contract template introduced in March — which the model processes with high confidence. Why did QA miss it, and what fixes it?

A) Confidence-based sampling never inspects high-confidence outputs, so confidently wrong work stays invisible; switch to stratified random sampling by contract type
B) The monthly sample of 200 lacks the statistical power to catch rare failure modes; quadruple it to 800 low-confidence extractions per month so the rarer failures surface
C) The confidence threshold needs recalibration so extractions from the new template score lower and start entering the existing QA review pool
D) Add the new template to the regression evaluation set and gate future deployments on passing it, while keeping the QA sampling process unchanged

<details>
<summary>Answer & explanation</summary>

**A)** Sampling conditioned on the model's own confidence systematically excludes the most dangerous failure mode — high-confidence errors — which is exactly where the new template's failures lived; stratified random sampling reviews every segment regardless of the model's self-assessment. Enlarging a pool that is still confidence-filtered keeps the blind spot, and recalibrating confidence or adding one template to a regression set patches this instance while leaving the next confidently-wrong segment undetectable.

*Hint if stuck: Ask which kinds of mistakes the present QA pool is structurally unable to contain.*
</details>

---

## Question 39
An invoice-extraction pipeline outputs a confidence score for every field, and the team wants to auto-accept fields scoring 0.90 or higher without human review. Before setting that threshold, the architect wants evidence that the scores mean what they say. What check gives that evidence?

A) Check that the average confidence across all fields is close to the dashboard's overall accuracy figure
B) On a labelled set, bucket each field's scores and compare each bucket's observed accuracy with its score
C) Ask the model to explain each high-confidence field and accept the threshold if the reasons read as sound
D) Track the share of fields scoring 0.90 or higher each week and treat a stable share as proof of calibration

<details>
<summary>Answer & explanation</summary>

**B)** Calibration means stated confidence matches observed accuracy, so it has to be measured against labelled ground truth, per field and per confidence band: fields scored 0.9 and above should actually be right at least that often before auto-accepting them. Matching averages can hide bands or fields that are badly over-confident. Plausible-sounding explanations do not measure correctness. A stable share of high scores says nothing about whether those fields are right.

*Hint if stuck: Calibration is a claim about how often something is right; ask what you need in order to count that.*
</details>

---

## Question 40
A research system's report on microplastics in drinking water blends everything into confident prose. Reviewers find that some statements rest on five independent studies while others rest on one disputed preprint, but the report reads them all the same way. How should synthesis be changed?

A) Have the synthesizer separate established findings from contested or single-source ones, with attribution for each claim
B) Add a sentence at the end of the report noting that some findings are less certain than others and that readers should check the sources
C) Have the synthesizer drop any finding supported by fewer than three sources so that the report contains only well-established conclusions
D) Ask the synthesizer to soften every sentence with hedging words such as 'may' or 'suggests' so that no claim is ever overstated

<details>
<summary>Answer & explanation</summary>

**A)** Readers need to see which claims are settled and which are contested, and that requires keeping the two apart with sources attached. Dropping thinly supported findings loses information the reader may need, and a blanket disclaimer or hedging everything treats strong and weak claims alike, which is the same flattening problem in another form.

*Hint if stuck: The reader should be able to tell how solid each claim is.*
</details>

---

## Question 41
A market-research system reports that a startup's funding figure is 'confirmed by three independent sources'. An analyst finds that two of the three news articles simply quote the company's own press release, which is the third source. What design change prevents this overstatement?

A) Require at least four sources before any claim can be described as confirmed, so that echoed sources are diluted by the larger count
B) Record which original source each finding traces back to, so that derivative reports are not counted as independent corroboration
C) Tell the synthesizer to be skeptical of news articles in general and to give them less weight than primary documents in the report
D) Prefer press releases over news articles whenever both are found, since the original announcement is always the most reliable source

<details>
<summary>Answer & explanation</summary>

**B)** Corroboration only counts when sources are independent, so findings need to carry where the information originally came from. Raising the source count still counts echoes, a blanket preference for press releases trusts the party making the claim, and general skepticism of news does not identify which articles are derivative.

*Hint if stuck: Ask whether three reports that all repeat one announcement are really three witnesses.*
</details>

---

## Question 42
A contract extraction pipeline reads a master services agreement and a later amendment for the same customer. The agreement gives a termination notice period of 90 days and the amendment gives 60 days, and the pipeline currently outputs whichever value it saw last. What should the extraction output instead?

A) Output only the value from the longest document, since the master agreement is the primary contract and amendments are secondary
B) Average the two values to 75 days so that the record reflects both documents without favoring either one over the other
C) Record each value with its source document and effective date, so the amended value is shown as superseding the original
D) Output the shorter notice period, since shorter notice periods are the more conservative choice for the customer's legal team

<details>
<summary>Answer & explanation</summary>

**C)** Keeping each value tied to its source and effective date makes it clear the amendment supersedes the original and keeps the history auditable. Choosing by document length or by which is more conservative ignores which document governs, and averaging invents a value neither document contains.

*Hint if stuck: Dates and sources explain what looks like a conflict.*
</details>

---

## Question 43
A support agent looks up a customer's plan: the CRM tool says 'Gold' and the billing tool says 'Silver'. The customer is asking whether a premium feature is included. The agent currently picks the CRM value because it was called first. What should the agent do?

A) Tell the customer the plan is Gold, since the CRM is the system the support team uses most and is therefore likely to be the most current
B) Ask the customer which plan they believe they are on and use the answer to settle the discrepancy between the two systems
C) Tell the customer the plan is Silver, since billing determines what the customer pays and that should decide which features apply
D) Note the conflict with both sources in its response, avoid a firm answer on the feature, and route the mismatch for resolution

<details>
<summary>Answer & explanation</summary>

**D)** When two authoritative systems disagree, the agent should surface the conflict with attribution and route it for resolution rather than quietly pick one. Choosing by call order or by a guess about which system matters more hides the discrepancy, and asking the customer settles a data conflict with an unverified claim.

*Hint if stuck: Do not hide a disagreement between trusted sources.*
</details>

---

## Question 44
A research pipeline passes source documents to Claude with citations enabled, and also sets output_config.format so the answer comes back as JSON. The request fails with a 400 error. The team still needs both cited claims and a structured findings record. Which design works?

A) Get cited claims from a citation-enabled call, then map the citations into the findings schema in code or a separate structuring step
B) Remove citations and ask the model to type source names inline in the JSON, since the schema is the more important of the two features
C) Retry the same request with a different model, since the 400 error is caused by the model rather than by the combination of features
D) Keep both settings and wrap the documents in a tool result instead of a user message, which allows citations and the format together

<details>
<summary>Answer & explanation</summary>

**A)** Current docs state that citations and structured outputs cannot be combined in one request (enabling both returns a 400), so the citation-enabled call should produce verifiable claims and a later step should map them into the schema. Typing source names into JSON loses the exact cited passages, and switching models or moving documents into a tool result does not lift the restriction.

*Hint if stuck: When two features cannot share a request, split the work.*
</details>

---

## Question 45
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

## Question 46
A developer asks an internal Claude assistant how request timeouts are set in a service. The wiki page, last edited 18 months ago, says 30 seconds; the current config file in the repository says 10 seconds. The assistant answers '30 seconds' because the wiki explains it more clearly. What should the assistant do instead?

A) Answer 30 seconds, since the wiki is the official documentation and should be treated as the source of truth for configuration questions
B) Answer 10 seconds without mentioning the wiki, since the code is what runs and mentioning older documents would only confuse the developer
C) Give both values with their sources and dates, and note that the config file reflects current behavior while the wiki may be out of date
D) Average the two values and recommend 20 seconds as a reasonable default, noting that the sources disagree on the exact number

<details>
<summary>Answer & explanation</summary>

**C)** Attribution and dates let the developer see that the code is current and the wiki is likely stale, and they also reveal the outdated page that needs fixing. Trusting the clearer source ignores which one is current, and dropping the wiki silently hides a discrepancy worth knowing about. Averaging makes up a number neither source supports.

*Hint if stuck: Show where each answer came from and when.*
</details>

---

## Question 47
A search subagent retrieves passages from an internal knowledge base and returns them to the agent as plain text in tool results. The final answers cite 'internal docs' generically, and auditors cannot tell which article supports which claim. What change gives claim-level attribution?

A) Prepend each passage with a line reading 'Source:' and the article title, and instruct the agent to repeat that line next to claims
B) Concatenate all passages into one document per query so that the agent has a single source to cite whenever it answers a question
C) Ask the agent to list every article it consulted at the end of each answer, so that auditors at least know which articles were used
D) Return each passage as a search_result block with its source identifier and title, with citations enabled so claims point to the passage

<details>
<summary>Answer & explanation</summary>

**D)** search_result blocks carry a source and title, and with citations enabled each claim comes back tied to the exact passage it rests on. A typed 'Source:' line depends on the model copying it faithfully, a bibliography at the end does not link claims to sources, and merging passages into one document erases the distinctions auditors need.

*Hint if stuck: Let the API carry the link between claim and source.*
</details>

---

## Question 48
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

## Question 49
A developer asks Claude Code to write an incident postmortem from 14 log files, six Jira tickets and a Slack export. The draft is readable, but the on-call lead cannot verify statements like 'the cache failed first' because nothing points back to the evidence. How should the developer change the request?

A) Ask Claude to add a 'Sources' section at the end of the postmortem listing every log file, ticket and export it read while writing
B) Ask Claude to tie each factual statement to its evidence, such as the log file and timestamp or the ticket ID it came from
C) Ask Claude to write more cautiously and mark any statement it is unsure of with a question mark so that readers know to check it
D) Ask Claude to re-read all the inputs and confirm that the draft is accurate before the developer hands the postmortem to the on-call lead

<details>
<summary>Answer & explanation</summary>

**B)** Claim-level references let the lead check each statement directly against the evidence. A sources list at the end does not say which source supports which claim, self-confirmation by the same session does not produce anything a reader can verify, and question marks flag doubt without pointing to evidence.

*Hint if stuck: Ask how the lead could check one sentence without rereading every input.*
</details>

---

## Question 50
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

## Question 51
When a support agent hands a disputed charge to a human specialist, its summary says 'the customer was charged twice on 3 March and never received the replacement'. The specialist later finds the double charge in billing records, but the non-delivery was only the customer's statement; the shipping tool showed a delivered status. What should the handoff summary do?

A) Give the specialist the full conversation transcript instead of a summary, so they can work out for themselves which statements were verified
B) Present the customer's account in full and trust it, since the specialist will check the details again during the investigation anyway
C) Include only facts confirmed by internal systems, leaving out the customer's account so the specialist works from verified data alone
D) Mark each fact as verified by a named system or reported by the customer, and note where the two disagree

<details>
<summary>Answer & explanation</summary>

**D)** Labelling each fact by where it came from, and flagging where the customer and the systems disagree, lets the specialist start from the real dispute. A raw transcript pushes the sorting work onto the specialist, dropping the customer's account hides the disagreement, and treating customer statements as fact repeats the original error.

*Hint if stuck: Who said it matters as much as what was said.*
</details>

---

## Question 52
To keep a coordinator's context small, a team compresses each subagent's findings into a short paragraph before passing it up. Final reports now contain claims that cannot be traced to any source, even though the subagents had recorded sources. What fix keeps the context benefit without losing traceability?

A) Compress the claim text but make source ID and date required fields on every finding, so compression cannot drop them
B) Ask the coordinator to add sources back at the end by searching again for each claim that appears in the final report
C) Stop compressing and pass each subagent's full output to the coordinator, accepting the larger context as the price of traceability
D) Have the compressing step write its paragraphs more carefully so that the important source names are mentioned in the text

<details>
<summary>Answer & explanation</summary>

**A)** Making source and date required fields keeps provenance structural, so compression can shorten the claim without dropping its origin. Passing full outputs gives up the context savings, re-searching after the fact can attach the wrong source, and asking for more careful prose relies on the same lossy step that caused the problem.

*Hint if stuck: Make provenance part of the structure, not part of the prose.*
</details>

---

## Question 53
A due-diligence system spawns one subagent per source type — SEC filings, news coverage, earnings-call transcripts — and each returns a free-prose summary. The coordinator's final memo asserts 'revenue grew 40%', but analysts cannot trace which source said it, and the filings and a news article actually disagreed. What design change fixes this?

A) Require subagents to return structured outputs that map each claim to its source and date
B) Prompt the coordinator to always cite sources when it writes the final memo
C) Have the coordinator re-fetch all the underlying documents itself and verify every figure before the memo is published
D) Pass the subagents' full raw transcripts into the coordinator's context instead of summaries

<details>
<summary>Answer & explanation</summary>

**A)** Attribution must be preserved at the boundary where it is lost: prose summaries strip provenance, so subagents should emit structured claim-source-date records the coordinator can carry into synthesis, keeping conflicting claims visible with temporal metadata. Prompting the coordinator to cite cannot work because the source information never reached it. Forwarding raw transcripts bloats the hub's context, and re-fetching duplicates the subagents' entire job.

*Hint if stuck: Find the exact point in the pipeline where provenance is destroyed.*
</details>

---

## Question 54
A research swarm gathering electric-vehicle market data flags a "source conflict": one finding says global EV sales were 10.5M units, another says 17.3M. Investigation shows the first comes from a 2023 report and the second from a 2025 report — and the synthesizer had discarded both figures as unreliable. What fixes this?

A) Add a reconciliation step that averages the numeric claims whenever any two sources disagree by more than 20%, then report the blended figure
B) Rank the sources by domain authority and keep only the figure that comes from the higher-authority publication, discarding the other
C) Tighten the scout prompts so they only collect market figures published within the last 12 months, keeping the dataset current
D) Capture publication dates as temporal metadata on every claim, so figures from different years read as a time series, not contradictions

<details>
<summary>Answer & explanation</summary>

**D)** Figures measured at different times are not contradictions — they are data points about a changing quantity, and carrying temporal metadata through synthesis prevents false-conflict detection while preserving trend information. Averaging fabricates a number no source ever reported, authority ranking discards a valid historical data point, and restricting collection to recent sources throws away exactly the history trend analysis needs.

*Hint if stuck: Before calling two figures a conflict, ask whether they describe the same moment.*
</details>

---

## Question 55
A research system passes 40 earnings-call transcripts to Claude as plain-text documents with citations enabled. Analysts complain that citations often cover a single sentence that splits an executive's multi-sentence answer, so the quoted text misses the context they need. They want each citation to point to one complete speaker turn. What should change?

A) Send each transcript as a custom content document whose content blocks are individual speaker turns
B) Convert each transcript to PDF so the citations come back as page numbers that analysts can look up
C) Turn off citations and use structured outputs with a source_quote field that the model fills in per claim
D) Keep plain text but tell the model in the prompt to cite only whole speaker turns, never single sentences

<details>
<summary>Answer & explanation</summary>

**A)** Plain-text and PDF documents are chunked into sentences, and those chunks are what citations can point to. Custom content documents get no extra chunking: each content block you provide is a citable unit, returned as block indices, so making each block one speaker turn sets the granularity directly. PDFs are still sentence-chunked and only add page numbers. Citations cannot be combined with structured outputs, and a quote the model writes itself is not a verified pointer into the source. A prompt instruction cannot change how the API chunks the document.

*Hint if stuck: Ask what decides the smallest piece of a document a citation can point to.*
</details>

---

## Question 56
A synthesis step deduplicates findings that state the same fact. When two scouts reported 'the plant closed in May 2026', one citing a regulator filing and one a trade-press article, the merged claim kept only the trade-press source. That article was later corrected, and reviewers now cannot tell whether the claim still stands. How should merging work?

A) Keep only the most authoritative source on the merged claim and drop the rest to keep records simple
B) Skip deduplication and publish both claims separately, so readers see that two sources said the same thing
C) Merge the matching claims into one record that keeps every supporting source with its id and date
D) Keep the first source that arrived, but add a note to the claim saying it was also reported elsewhere

<details>
<summary>Answer & explanation</summary>

**C)** Claim-source mappings have to survive every synthesis step, including deduplication: a merged claim should carry all its supporting sources with dates, so it can be re-checked when one source changes and corroboration can be judged. Keeping only the 'best' source is a judgment call that still throws away the trail. Publishing duplicates clutters the report and still does not link the two sources to one claim. A note saying 'reported elsewhere' gives reviewers nothing they can check.

*Hint if stuck: Ask what a reviewer needs to re-check a claim after one of its sources changes.*
</details>

---

## Question 57
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

## Question 58
A healthcare-policy research agent finds two 2026 peer-reviewed studies reporting different readmission rates for the same procedure: 11% and 19%. The synthesis step currently outputs "approximately 15%", and a clinician reviewer has called the report untrustworthy. What should the synthesis do instead?

A) Output a range of 11-19% without naming the individual studies, since a range communicates the uncertainty more honestly than any single point estimate
B) Present both figures with explicit source attribution, study dates, and methodological context, so the disagreement itself is visible to the reader
C) Spawn a tie-breaker subagent to find a third study and report whichever readmission figure wins majority support across the three sources
D) Report the figure from the study with the larger sample size as primary and relegate the other study's result to a footnote in the report

<details>
<summary>Answer & explanation</summary>

**B)** When credible contemporaneous sources genuinely conflict, synthesis must preserve both claims with attribution — averaging manufactures a figure no study reported, and an unattributed range destroys traceability while hiding that experts disagree. Majority voting and sample-size heuristics make the system silently adjudicate a scientific dispute it is not equipped to judge.

*Hint if stuck: Ask whether turning two credible results into one number tells the reader more or less than the studies did.*
</details>

---
