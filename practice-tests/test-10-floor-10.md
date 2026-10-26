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

*Hint if stuck: Phase boundaries are the moment to choose what a summary keeps.*
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

*Hint if stuck: Where the reading happens decides whose context pays for it.*
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

*Hint if stuck: Ask whether anything in the old conversation is useful for the new task.*
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

*Hint if stuck: Some content is rebuilt from disk after compaction, and some only gets summarized.*
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
A Claude Code session navigating a 4,000-file monorepo degrades after an hour: every Grep over the vendored directory returns hundreds of matches, and the team currently runs /compact every 20 minutes, after which Claude re-asks questions it had already answered. The team debates compacting even more aggressively. What is the better approach?

A) Run /compact every 10 minutes instead of 20, before the noisy search results have time to accumulate
B) Start a fresh session every hour and paste in a manually written summary of the progress so far
C) Stop the bloat at its source: exclude vendored paths from searches and delegate verbose exploration to subagents
D) Add a CLAUDE.md note instructing Claude to disregard matches from vendored directories when reasoning

<details>
<summary>Answer & explanation</summary>

**C)** Compaction is lossy — re-asking already-answered questions is the evidence — so compacting more often just loses information sooner. The root cause is verbose, low-value output entering context in the first place; scoping searches and pushing exploration into subagents with isolated context means there is little left to compact. The CLAUDE.md note leaves all the tokens in context and merely asks the model to ignore them.

*Hint if stuck: Compare removing tokens before they accumulate with summarizing them after the damage is done.*
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

*Hint if stuck: Ask what changes about a session's answer quality as hours of verbose tool output pile up in one context.*
</details>

---

## Question 16
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

## Question 17
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

## Question 18
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

*Hint if stuck: A score means what labelled data says it means.*
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

*Hint if stuck: Prioritize risk, but still measure the part you assume is safe.*
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

*Hint if stuck: A segment's estimate is only as good as the samples drawn from that segment.*
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

*Hint if stuck: Decide review level per segment, not for the whole.*
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

*Hint if stuck: Sample so every kind of file has a chance to be seen.*
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
A freight-audit pipeline reports a 94 percent first-pass validation rate across all carriers, and the retry-with-feedback loop raises it to 98 percent. A new carrier's invoices make up 6 percent of volume, and complaints from that carrier's account team keep rising. What should the architect check first?

A) Whether the retry limit should be raised to push the overall rate from 98 percent closer to 100 percent
B) Whether the overall validation threshold should be lowered so fewer invoices are sent to the retry loop
C) Whether more examples from the largest carriers would raise the aggregate first-pass validation rate further
D) Pass and retry rates broken out by carrier and document layout, to see whether the new carrier is failing

<details>
<summary>Answer & explanation</summary>

**D)** An aggregate rate can look healthy while a small segment fails badly; breaking metrics out by carrier and layout shows whether the new carrier's invoices are the problem. Raising the retry limit or lowering thresholds tunes the aggregate without locating the failure, and more examples from large carriers improves the segment that is already fine.

*Hint if stuck: Averages can hide a small group that is doing badly.*
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

*Hint if stuck: A small segment can fail almost completely without moving a blended average below its target.*
</details>

---

## Question 36
A healthcare patient-intake system extracts 14 fields from 6,000 faxed forms daily; medication dosage and allergy fields are safety-critical. Reviewing every form by hand costs too much, and a 5% random spot-check let a dosage error through last month. How should human review be routed?

A) Route forms to human review whenever the model's overall document-level confidence score falls below a fixed 0.8 threshold
B) Route a fixed 20% random sample to review, weighted toward forms received outside business hours when fax quality is at its worst
C) Route on deterministic field-level signals — null dosage or allergy values, schema failures, or out-of-range dosage units trigger human review
D) Re-extract every form a second time with the same model and prompt, and route to human review only the forms where the two passes disagree on any field

<details>
<summary>Answer & explanation</summary>

**C)** Review capacity should concentrate where errors are costly: deterministic per-field validation on the safety-critical fields (nulls, schema failures, out-of-range values) catches the dangerous cases. A document-level confidence score is poorly calibrated and can stay high even when one critical field is wrong — the same masking problem as aggregate accuracy. Bigger random samples spend budget on harmless fields, and double extraction doubles cost while missing systematic errors the model makes identically both times.

*Hint if stuck: The unit of risk in this pipeline is the field, not the document.*
</details>

---

## Question 37
An insurance claims extraction system has run in production for six months, and the team wants to detect quality drift as claim formats evolve. One engineer proposes dashboarding the model's self-reported confidence over time and alerting when the average drops. What is the better approach?

A) Human-review a stratified random sample of production outputs across claim types on a regular cadence and track per-segment accuracy
B) Build the confidence dashboard as proposed but alert on the median score rather than the mean to reduce the noise from outlier extractions
C) Re-run last quarter's evaluation set against the model monthly; if accuracy on it holds steady, the production system has not drifted
D) Add a second model that grades every extraction and alert whenever the two models disagree with each other more often than usual

<details>
<summary>Answer & explanation</summary>

**A)** Self-reported confidence is poorly calibrated — the model can be confidently wrong, and drift often appears precisely where confidence stays high — so ground-truthing a stratified random sample of current traffic is the reliable signal. Re-running a frozen evaluation set fails because production drift comes from the inputs changing: new claim formats never enter a static test set. A second model's disagreement rate is not ground truth either, and shared blind spots pass silently.

*Hint if stuck: Drift detection needs ground truth on current real traffic, not the model's opinion of its own work.*
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

*Hint if stuck: A QA pool filtered by the model's self-assessment can never contain the errors the model does not know it is making.*
</details>

---

## Question 39
A document extraction pipeline processes lab reports, referral letters, and insurance cards for a healthcare intake system. The dashboard shows 95% aggregate field accuracy, and the team plans to track the model's self-reported confidence trend as the ongoing quality signal. A clinician then discovers that insurance cards — 9% of volume — extract member IDs correctly only 58% of the time. What should the team do?

A) Keep the aggregate metric but lower the alert threshold to 90%, so any future slide in insurance card accuracy trips the alarm earlier
B) Add a second extraction pass for any document whose self-reported confidence falls below 0.7, routing those documents to a stronger model
C) Report accuracy per document type and field, and run ongoing quality checks via stratified random sampling rather than confidence trends
D) Pull insurance cards out of the automated pipeline for manual entry until the aggregate accuracy number stabilizes above 97%

<details>
<summary>Answer & explanation</summary>

**C)** Aggregate accuracy masks per-segment failures — a 9% slice can collapse while the blended number still looks healthy — so measurement must happen per document type and field. Self-reported confidence is poorly calibrated, which makes both confidence-trend monitoring and confidence-threshold routing unreliable foundations; stratified random sampling gives unbiased ongoing coverage of every segment. Lowering an aggregate threshold still blends the failing segment into the same misleading number.

*Hint if stuck: Think about what a blended success metric hides, and which quality signals are actually calibrated.*
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

*Hint if stuck: Count independent origins, not copies.*
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

*Hint if stuck: Verifiable means each claim says where it came from.*
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

*Hint if stuck: Two correct measurements of a changing quantity can differ for a reason that a piece of metadata captures.*
</details>

---

## Question 55
You are designing a multi-agent competitive-intelligence system: Haiku scouts gather facts and a Sonnet synthesizer writes the final report. Compliance requires that every claim in the report be traceable to a specific source document. Which design satisfies this requirement?

A) Instruct the synthesizer in its system prompt that every claim included in the final report must cite the specific source document from which it came
B) Log every URL each scout fetches during research and attach the complete list of fetched sources to the report as a reference appendix
C) Have scouts bind each claim to its source and date in structured findings, and require synthesis to carry those claim-source mappings into its output
D) Run a post-hoc verification agent that searches the web for a supporting source document for each claim that appears in the finished report

<details>
<summary>Answer & explanation</summary>

**C)** Provenance survives only when claim-source mappings are first-class structured data at every stage — scouts emit them and the synthesis stage is required to preserve them through to the final output. A prompt instruction is probabilistic best-effort, a URL appendix cannot tie a specific claim to a specific source, and post-hoc re-sourcing finds a plausible source rather than the one actually used.

*Hint if stuck: Traceability has to be carried through every stage as data, not reconstructed after the fact.*
</details>

---

## Question 56
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

## Question 57
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

## Question 58
A healthcare-policy research agent finds two 2026 peer-reviewed studies reporting different readmission rates for the same procedure: 11% and 19%. The synthesis step currently outputs "approximately 15%", and a clinician reviewer has called the report untrustworthy. What should the synthesis do instead?

A) Output a range of 11-19% without naming the individual studies, since a range communicates the uncertainty more honestly than any single point estimate
B) Present both figures with explicit source attribution, study dates, and methodological context, so the disagreement itself is visible to the reader
C) Spawn a tie-breaker subagent to find a third study and report whichever readmission figure wins majority support across the three sources
D) Report the figure from the study with the larger sample size as primary and relegate the other study's result to a footnote in the report

<details>
<summary>Answer & explanation</summary>

**B)** When credible contemporaneous sources genuinely conflict, synthesis must preserve both claims with attribution — averaging manufactures a figure no study reported, and an unattributed range destroys traceability while hiding that experts disagree. Majority voting and sample-size heuristics make the system silently adjudicate a scientific dispute it is not equipped to judge.

*Hint if stuck: When sources genuinely disagree, the disagreement is information the reader needs, not noise to smooth away.*
</details>

---
