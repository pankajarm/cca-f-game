# Practice Test 02: Coordination Hall
**D1: Agentic Architecture & Orchestration** (27% of the exam) · task statements 1.2, 1.3, 1.6

88 questions. Exam pace is 2 minutes per question.

---

## Question 1
A research coordinator delegates five regional market-sizing tasks. The Asia-Pacific subagent hits a paywall on its main source and gives up. Its prompt tells it to spawn a fresh 'backup researcher' subagent itself, and that backup's half-finished output never reaches the coordinator. How should failure handling be organized?

A) Give every subagent its own nested backup subagent with a longer timeout so that failures are fixed locally before anything is reported
B) Let the synthesis subagent fill in missing regions from its general knowledge when a regional subagent does not respond
C) Have the failing subagent return a structured failure with partial results, and let the coordinator decide whether to retry
D) Add a system-prompt rule telling every regional subagent that failure is not acceptable and it must find a source

<details>
<summary>Answer & explanation</summary>

**C)** In hub-and-spoke orchestration the coordinator owns error handling: subagents report what failed and what they did get, and the coordinator decides whether to retry, reassign or flag the gap. Nested backups hide failures inside branches the coordinator cannot see, which is exactly how the output got lost. Filling gaps from general knowledge invents unsourced data, and a 'never fail' rule only pushes subagents to fabricate.

*Hint if stuck: Ask which agent can see every branch and therefore should decide what happens after a failure.*
</details>

---

## Question 2
A research system routes every question through the same pipeline: planner, six search subagents, two analysis subagents, a synthesizer and a citation checker. Users asking simple lookups like 'When did the EU AI Act enter into force?' wait several minutes and the bill is high. What should the architect change?

A) Cap each search subagent at two tool calls so the six-way fan-out finishes faster no matter how hard the question is
B) Cache the pipeline's final answers by exact question text so that repeated simple lookups can skip the subagent fan-out entirely
C) Run all of the pipeline's subagents on the smallest available model so the full pipeline costs less for every query
D) Have the coordinator assess each query's complexity and spawn only the subagents it needs, down to none for a simple lookup

<details>
<summary>Answer & explanation</summary>

**D)** Effort should scale with the query: a simple fact needs one agent and a few tool calls, while a broad comparison justifies many subagents. Letting the coordinator choose subagents per query removes the waste at its source. An exact-match cache helps only repeated wording, a smaller model weakens hard queries while the pipeline stays oversized, and a tool-call cap starves complex questions while easy ones still pay for the fan-out.

*Hint if stuck: Should a one-line fact and a 20-source comparison really trigger the same machinery?*
</details>

---

## Question 3
A coordinator researching 'risks of lithium supply for EV makers' gets back findings from four subagents and immediately hands them to the report writer. The final report has no coverage of recycling or of South American mining policy, though both were in the original brief. What step is missing?

A) A coordinator review of the combined findings against the brief, with targeted subagents spawned for any gaps before synthesis
B) A rule in each subagent's prompt asking it to mention any related topics it notices that are outside its assigned scope
C) A larger context window for the report writer, so that it can fit more of the subagents' raw findings into the final report
D) A citation checker after the report is written, which flags sections that have fewer sources than the rest of the report

<details>
<summary>Answer & explanation</summary>

**A)** The coordinator should evaluate the aggregated findings against the brief and iterate on gaps with targeted delegation before final synthesis. A larger writer context cannot include findings nobody gathered, and asking subagents to mention adjacent topics is a hopeful side effect rather than coverage. A citation checker runs after the fact and measures source density, not whether whole topics are missing.

*Hint if stuck: Compare what was asked for with what came back before anyone writes the report.*
</details>

---

## Question 4
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

## Question 5
A support coordinator receives one email in which a customer asks for a refund on a damaged blender, wants their shipping address changed for an open order, and asks why their loyalty points vanished. Today the whole email goes to the refunds subagent, which answers the refund and ignores the rest. What should the coordinator do?

A) Send the full email to every specialist subagent and forward whichever reply sounds the most complete to the customer
B) Tell the refunds subagent in its prompt to also handle address changes and loyalty questions whenever they come up
C) Split the email into its separate concerns, route each to the right specialist subagent, then merge the results into one reply
D) Answer the refund now and send the customer a template asking them to open separate tickets for the other two topics

<details>
<summary>Answer & explanation</summary>

**C)** The coordinator owns routing and aggregation: decomposing the request, sending each part to the matching specialist and composing a single answer resolves all three concerns. Broadcasting the full email to everyone wastes work and still picks one partial answer. Stretching the refunds agent's remit erodes the specialization that made routing useful, and bouncing two of the three issues back to the customer fails first-contact resolution.

*Hint if stuck: One message, several problems: who should own pulling the answers together?*
</details>

---

## Question 6
A platform team wants to use a coordinator with parallel subagents to implement a feature that touches a tightly coupled payment module, where each change depends on decisions made in the previous file. Early trials produce subagent edits that conflict and break the build. What is the best recommendation?

A) Add a merge subagent that runs after the others and resolves the conflicting edits into one consistent change set
B) Have the subagents edit in a fixed order and pass each file's diff to the next subagent through the coordinator
C) Spawn more subagents with narrower file assignments so that each one is much less likely to touch the same lines of code
D) Do the work in a single agent with the shared context, keeping subagents for independent side tasks such as research

<details>
<summary>Answer & explanation</summary>

**D)** Multi-agent systems shine on work that splits into independent parts; tightly coupled edits that depend on each other's decisions need the shared context of one agent, while subagents can still handle separable side tasks. A merge step tries to repair conflicts that the decomposition created, and narrower slices increase the number of hidden dependencies. A relay of diffs through the coordinator becomes a slow sequential chain where each subagent still lacks the full design picture.

*Hint if stuck: Multi-agent setups pay off when the pieces do not need to keep talking to each other.*
</details>

---

## Question 7
A research coordinator assigns subagents to study 'regulation of autonomous trucking'. One subagent covers US federal rules, another covers state rules, and a third covers 'North American policy'. The third duplicates most of the first two and misses Mexico entirely. How should the coordinator partition the work?

A) Into mutually exclusive slices that together cover the scope, such as US federal, US state, Canada and Mexico
B) Into a broad overview subagent plus specialists, so the overview catches whatever the narrower specialists miss
C) Into slices as before, but with a deduplication step in the synthesizer that strips findings repeated across subagents
D) Into one subagent per source type, such as statutes, court rulings and news coverage, across all of North America

<details>
<summary>Answer & explanation</summary>

**A)** Good decomposition partitions the scope so slices do not overlap and their union covers everything; listing Canada and Mexico explicitly closes the gap that the vague 'North American' slice left. A broad overview agent overlaps every specialist by design and still relies on luck for coverage. Dedup in the synthesizer hides the wasted work rather than preventing it, and splitting by source type creates three overlapping sweeps of the same geography.

*Hint if stuck: Check both properties of a partition: no overlap, and nothing left out.*
</details>

---

## Question 8
A CI pipeline uses a coordinator that runs security, performance, accessibility and API-contract reviewer subagents on every pull request. Docs-only PRs take 12 minutes and receive irrelevant performance comments. What should the architect change?

A) Add a rule to each reviewer's prompt saying it should reply 'no findings' quickly whenever the diff contains no code
B) Have the coordinator inspect the changed files and invoke only the reviewers relevant to them, skipping the rest
C) Run the four reviewers on a smaller model for PRs under 50 lines so that docs-only changes finish more quickly
D) Filter the posted comments so that performance and security findings are dropped when no code files are changed

<details>
<summary>Answer & explanation</summary>

**B)** Choosing subagents per input is the coordinator's job: a docs-only diff does not need the performance or security reviewers at all. Prompting every reviewer to exit early still spawns all four and relies on each one obeying. A smaller model keeps the pointless runs, and filtering comments afterwards pays for the reviews and then throws them away.

*Hint if stuck: The cheapest reviewer run is the one the coordinator never starts.*
</details>

---

## Question 9
A coordinator for due-diligence research has a synthesis subagent that writes the final memo. When the synthesizer notices a gap, such as missing litigation history, it starts running its own web searches to fill it. Memos now contain uncited claims and the synthesizer often runs out of context. What is the better design?

A) Give the synthesizer a bigger context window and a citation tool so its own searches are properly sourced
B) Remove gap detection from the synthesizer entirely and accept that memos will sometimes miss a topic from the brief
C) Have the synthesizer report gaps back to the coordinator, which delegates targeted research and then resumes synthesis
D) Let the synthesizer spawn its own search subagents directly, so gaps are filled without involving the coordinator

<details>
<summary>Answer & explanation</summary>

**C)** Keeping roles distinct means the synthesizer flags gaps and the coordinator, which owns routing and has the full picture, sends targeted research and feeds results back. A bigger context and a citation tool still turn the synthesizer into an unbounded researcher. Letting it spawn its own subagents creates nested chains the coordinator cannot track, and ignoring gaps leaves the coverage problem unsolved.

*Hint if stuck: Detecting a gap and filling a gap can be different agents' jobs.*
</details>

---

## Question 10
A coordinator analyzing customer churn delegates to subagents that each read thousands of support tickets for one product line. Each subagent returns its full working notes, around 30,000 tokens each, and the coordinator's quality drops sharply after the third result arrives. What should change?

A) Move all of the ticket reading back into the coordinator so it sees the source data directly instead of the notes
B) Process the subagent results one at a time in separate coordinator sessions and concatenate the outputs at the end
C) Ask the coordinator to skim each result and ignore anything that does not seem relevant to the churn question
D) Have each subagent return a condensed summary of findings with ticket references, instead of its raw working notes

<details>
<summary>Answer & explanation</summary>

**D)** Part of a subagent's value is compression: it explores in its own context and hands back a distilled result, so the coordinator stays focused. Requiring a condensed summary with references keeps the evidence traceable without flooding the hub. Separate coordinator sessions lose the cross-product view that aggregation needs, telling the model to skim still loads every token, and pulling the reading back into the coordinator brings the overload back in a worse form.

*Hint if stuck: What should cross the boundary from subagent back to coordinator: the exploration or its result?*
</details>

---

## Question 11
A developer asks a Claude Code session to find why a nightly job slowed down. The main session reads 40 large log files itself, and by the time it reaches the code its context is cluttered and it forgets the original timing numbers. How should the work be orchestrated?

A) Delegate the log analysis to a subagent that returns a short summary, keeping the main session's context for the code
B) Read the logs in smaller chunks in the main session, compacting the conversation after every five files to save space
C) Paste the timing numbers into CLAUDE.md so the main session can always find them again after reading the logs
D) Start a fresh session for the code investigation and ask the developer to re-type the timing numbers when it begins

<details>
<summary>Answer & explanation</summary>

**A)** Subagents run in their own context, so delegating noisy exploration lets the main session receive a concise summary and keep room for the actual investigation. CLAUDE.md is for durable project instructions, not per-task data, and repeated compaction in the main session still burns its context and loses detail. Starting fresh without the log findings makes the developer the message bus between two blind sessions.

*Hint if stuck: Think about which work produces a lot of text that the main thread will never need to see again.*
</details>

---

## Question 12
A research coordinator spawns six subagents in parallel. One crashes on a malformed PDF and returns nothing; the coordinator synthesizes the five results it has and presents the report as complete, with no mention of the missing area. What change most directly addresses this?

A) Increase the number of subagents so that each area is covered twice and a single crash cannot remove any coverage
B) Have the coordinator track the expected results, retry or reassign missing ones, and label any remaining gaps in the report
C) Give the synthesizer an instruction to write a smooth report that does not draw attention to areas with thin evidence
D) Make each subagent catch every exception internally and return a best-effort answer even when its main source cannot be read

<details>
<summary>Answer & explanation</summary>

**B)** The coordinator owns aggregation, which includes knowing what it is still waiting for; tracking expected results lets it retry or reassign and, failing that, state the gap honestly. Doubling every subagent doubles the cost to cover a rare failure and still says nothing when both copies fail. A smooth report hides the gap even more, and a forced best-effort answer from an unreadable source invites fabrication.

*Hint if stuck: A missing result is still something the final report owes the reader.*
</details>

---

## Question 13
A support system has an identity-verification subagent and a refunds subagent. To save a hop, the team lets the refunds subagent message the verification subagent directly. Weeks later, auditors cannot reconstruct why several refunds were approved, and some approvals went ahead while verification was still pending. Which design addresses this?

A) Add timestamps and request ids to every message the two subagents exchange so the auditors can rebuild the sequence of events later
B) Merge the two subagents into one so that verification and refund approval always happen inside the same context
C) Route the exchange through the coordinator, which records each result and only dispatches the refund after verification
D) Tell the refunds subagent in its prompt to wait until it has received a verification message before approving

<details>
<summary>Answer & explanation</summary>

**C)** Hub-and-spoke puts the coordinator in charge of communication, ordering and error handling, which gives a single point for observability and lets it enforce that verification finishes before refunds proceed. Timestamps describe the problem after it happens without preventing it. Merging the agents throws away the specialization for an ordering problem, and a prompt instruction to wait is probabilistic where the requirement is strict.

*Hint if stuck: Where should the one agent that sees and sequences every handoff sit?*
</details>

---

## Question 14
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

## Question 15
A support coordinator lets each specialist subagent send its reply straight to the customer. Customers with multi-part issues receive three separate emails with different tones, and one apologizes for a delay that another email denies. What should the architect change?

A) Have specialists return results to the coordinator, which composes one consistent reply and sends it to the customer
B) Give all specialist subagents the same tone guide and brand voice so their separate emails read consistently
C) Add a short delay so that all of the specialist emails reach the customer within the same minute, grouped in one email thread
D) Let only the first specialist to finish contact the customer and discard the results that arrive after it

<details>
<summary>Answer & explanation</summary>

**A)** Aggregation is the coordinator's job: it sees all specialist results, can reconcile contradictions such as the delay, and sends a single coherent answer. A shared tone guide makes the emails sound alike while they still contradict each other. Batching the emails delivers the same conflict faster, and keeping only the first result drops the other issues.

*Hint if stuck: Contradictions can only be caught by an agent that sees every answer together.*
</details>

---

## Question 16
Three research subagents return findings in different shapes: one as prose, one as a bullet list with URLs, and one as a table with no sources. The coordinator's merged report mislabels which claims came from where. What should the coordinator do when delegating?

A) Add a reformatting subagent after the others that converts all three results into one common shape for merging
B) Specify one output format for every subagent, with each claim paired with its source, date and confidence
C) Ask the report writer to infer sources for unsourced claims from its own knowledge of the topic at hand
D) Use only the subagent that returned URLs and discard the results from the two that did not include sources

<details>
<summary>Answer & explanation</summary>

**B)** The coordinator controls the contract for what subagents return; asking each one for claims paired with source and date makes aggregation reliable and keeps attribution intact. A reformatting pass cannot recover sources that were never captured. Inferring sources invents citations, and discarding two-thirds of the research to dodge a formatting problem wastes the work and the coverage.

*Hint if stuck: Fix the shape of the results at the point where the work is handed out.*
</details>

---

## Question 17
A research coordinator keeps running new rounds of subagents until it hits a hard limit of eight rounds, because nothing tells it when the research is good enough. Simple questions burn all eight rounds; hard ones are cut off. Which change gives the loop a sensible stopping point?

A) Lower the hard limit to four rounds so that simple questions finish sooner and hard ones are cut off less often
B) Stop as soon as a round returns fewer new sources than the round before it, regardless of what the original brief asked for
C) Have the coordinator check the findings against explicit success criteria after each round and stop when they are met
D) Let each subagent decide on its own whether more research is needed and spawn the next round when it thinks so

<details>
<summary>Answer & explanation</summary>

**C)** Stopping should come from evaluating findings against the brief's success criteria: coverage of the required sub-questions and evidence quality. A different round limit is the same blunt cap tuned differently, and source-count deltas measure activity, not whether the question is answered. Letting each subagent spawn further rounds removes the coordinator's control over scope and cost.

*Hint if stuck: What would 'done' mean for this brief, and who is placed to judge it?*
</details>

---

## Question 18
An internal developer assistant has a coordinator with subagents for code search, test running and documentation lookup. When a developer asks 'what does the retry decorator in utils do?', the coordinator runs all three, including the full test suite. What should the coordinator do?

A) Run all three subagents but in the background, so the developer gets the code search answer first and the rest later
B) Merge the three subagents into one general agent that has all tools, so there is no routing decision to make
C) Ask the developer before every request which of the three subagents they want to use for their question
D) Pick only the subagents the question needs, here code search and possibly docs, and skip the test runner

<details>
<summary>Answer & explanation</summary>

**D)** The coordinator should select subagents per request; a read-only explanation question needs search and maybe docs, not a full test run. Running the test suite in the background still wastes compute and clutters results. Asking the developer every time moves the coordinator's job onto the user, and a single all-tools agent gives up both the routing and the context isolation that subagents provide.

*Hint if stuck: Match the agents you start to what the question actually requires.*
</details>

---

## Question 19
A coordinator asked to map operational risks for a regional hospital network pulls the 40 suppliers from the procurement database and spawns one subagent per supplier. The risk map is thorough on supplier issues but says nothing about staffing shortages, regulatory changes or power resilience. A teammate proposes adding 'also note any non-supplier risks you see' to each subagent's prompt. Why is that a weak fix, and what is better?

A) It still leaves non-supplier risks unowned; the coordinator should rework its decomposition so those risk areas get their own slices
B) It is fine as written; subagents will notice non-supplier risks while researching their suppliers and add them to their findings
C) It is weak because subagents tend to ignore prompt suffixes; the fix is to move the same instruction into each subagent's system prompt
D) It is weak because 40 subagents is too few; the coordinator should split each supplier's research across two subagents instead

<details>
<summary>Answer & explanation</summary>

**A)** The gap comes from the decomposition itself: slicing by the procurement list means no subagent owns risks that are not tied to a supplier, so coverage of staffing, regulation and power depends on side effects. Reworking the partition so those areas get their own slices fixes the root cause. Moving the hint into a system prompt keeps it a hint, and doubling subagents along the same supplier axis adds overlap without covering what was missing.

*Hint if stuck: A scope that no slice owns will only be covered by accident.*
</details>

---

## Question 20
A team is choosing an architecture for a returns agent that must check order history, warehouse stock and fraud signals before approving. One proposal has each specialist subagent call the next in a chain; another has a coordinator call each specialist and decide. Which is preferred, and why?

A) The chain, because each specialist can hand its full working context to the next one, so nothing ever has to be summarized
B) The coordinator, because it keeps routing, error handling and the final decision in one place that can be observed
C) The chain, because fewer coordinator calls means lower latency and a simpler system for the team to maintain
D) Neither; a single agent with every tool is always better than splitting the work across several agents

<details>
<summary>Answer & explanation</summary>

**B)** Hub-and-spoke keeps routing, error handling and aggregation with one coordinator, so failures are visible and the final decision has all inputs. In a chain, an early failure silently stops everything downstream and no single agent sees the whole picture. A single agent can be right for tightly coupled work, but 'always' ignores the context-isolation benefits that specialists give here.

*Hint if stuck: Consider where a failure surfaces in each design and who can act on it.*
</details>

---

## Question 21
A coordinator investigating flaky tests in a large monorepo assigns one subagent per test directory. Two of the subagents independently discover the same root cause, a shared clock mock, and each proposes a different fix. What should happen next?

A) Apply both fixes, since each was proposed by a subagent that investigated its own directory in full
B) Apply the fix from whichever subagent finished first and close the other investigation as a duplicate
C) Have the coordinator reconcile the overlapping findings, pick or combine a fix, and verify it across both directories
D) Ask both subagents to keep working until they agree, by sending each one the other's proposal to review

<details>
<summary>Answer & explanation</summary>

**C)** Aggregation includes reconciling overlapping or conflicting results, and only the coordinator sees both proposals and the shared root cause. Applying both fixes risks conflicting edits to the same mock, and taking the first finisher ignores which fix is better. Having subagents negotiate with each other recreates peer-to-peer coordination without anyone owning the decision.

*Hint if stuck: Two answers to one shared problem need a single owner to settle them.*
</details>

---

## Question 22
A research coordinator always produces a final report directly from the first round of subagent results. Reviewers find that most reports answer the main question but leave follow-up questions, raised by the findings themselves, unexplored. Which process change fits the coordinator-subagent pattern?

A) Have subagents add a 'further questions' section to their output and include it in the final report unanswered
B) Ask the report writer to answer the follow-up questions from what it already knows about the research topic
C) Double the number of subagents in the first round so that likely follow-up questions are more likely to be covered at once
D) After the first round, have the coordinator review findings for new questions that matter and delegate a second round

<details>
<summary>Answer & explanation</summary>

**D)** Research is iterative: the coordinator should evaluate first-round findings, identify gaps or new questions that matter to the brief, and delegate a targeted second round before synthesis. Listing unanswered questions passes the work to the reader, and a bigger first round cannot target questions that only emerge from its own results. Having the writer answer from memory adds unsourced claims to a cited report.

*Hint if stuck: Some of the right questions only appear once the early findings come back.*
</details>

---

## Question 23
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

## Question 24
A market-intelligence coordinator spawns four research subagents scoped as 'pricing trends', 'market trends', 'industry trends', and 'competitor pricing'. The synthesized report repeats the same three statistics four times, and token spend is roughly quadruple a single-agent baseline. What should the architect change?

A) Add a deduplication pass in the synthesizer that strips repeated claims before writing the report
B) Redefine the subagent scopes as non-overlapping partitions of the research space before delegating
C) Instruct each subagent to skip any topic the other three subagents are already covering
D) Raise the scouts' temperature so the four agents are less likely to converge on identical findings

<details>
<summary>Answer & explanation</summary>

**B)** Overlapping scopes are a decomposition pitfall: the four assignments describe nearly the same territory, so duplicated work and token spend are baked in before any agent runs. Partitioning the scope into mutually exclusive slices fixes the root cause. A synthesizer dedup pass hides the symptom while still paying for the redundant research, sampling settings cannot change what territory each agent was assigned, and subagents cannot 'skip what others cover' because their contexts are isolated from one another.

*Hint if stuck: Look at the four scope definitions themselves rather than at what happens downstream.*
</details>

---

## Question 25
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

## Question 26
A support platform fans every incoming ticket out to all six specialist subagents — billing, shipping, returns, technical, account, fraud — then aggregates. Telemetry shows 70% of tickets need exactly one specialist, median resolution latency is 90 seconds, and cost per ticket is six times the single-agent baseline. What is the right architectural fix?

A) Keep all six but launch them as parallel Task calls in one response to bring latency down
B) Switch all six specialists to Haiku to bring the per-ticket cost back in line
C) Have the coordinator triage each ticket first and dynamically spawn only the specialists that ticket needs
D) Add cache_control breakpoints to the six specialist system prompts to reuse the stable prefixes across tickets

<details>
<summary>Answer & explanation</summary>

**C)** Running the full pipeline on every input is the anti-pattern here; dynamic subagent selection lets the coordinator triage and spawn only relevant specialists, which fixes both the 6x cost and the latency for the 70% single-specialist majority. Parallelizing all six helps latency but still pays for five useless invocations per ticket, and Haiku or caching shave cost without addressing the wasted work.

*Hint if stuck: Question whether every spoke should run at all, not how fast or cheaply they run.*
</details>

---

## Question 27
An e-commerce refund system is wired as a chain: an order-analyzer subagent spawns an inventory-checker, which spawns a refund-calculator, three levels deep. When refund amounts come out wrong, engineers cannot tell which level introduced the error, and the analyzer's context fills with nested transcripts. How should the system be restructured?

A) Flatten it to hub-and-spoke: one coordinator decomposes the job, delegates to each specialist directly, and aggregates results
B) Keep the chain but require every agent in it to emit structured outputs so errors carry attribution back up through each level
C) Keep the chain but raise the analyzer's context budget so nested transcripts stop overflowing
D) Add verbose logging at each level so engineers can replay the chain after a bad refund

<details>
<summary>Answer & explanation</summary>

**A)** Daisy-chained subagents recreate the problems hub-and-spoke exists to solve: every intermediate result should return to a coordinator, where it is individually observable and where aggregation logic lives. Flattening the chain fixes both the debuggability and the nested-context bloat at once. Structured outputs within the chain — the strongest distractor — improve attribution but leave the deep nesting and tangled control flow in place, and bigger context budgets or verbose logging only patch symptoms of the flawed topology.

*Hint if stuck: Compare the topology itself against the canonical multi-agent shape.*
</details>

---

## Question 28
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

## Question 29
A multi-agent research system answers "How are EU battery manufacturers responding to the 2026 subsidy changes?" The coordinator spawns 14 subagents, each scoped to a single manufacturer's press releases. The final report misses industry-wide patterns entirely, and when two subagents report contradictory capacity figures, nobody can tell which publication or date each figure came from. What is the best architectural fix?

A) Keep the 14 single-manufacturer tasks but add a fifteenth subagent whose only job is to detect contradictions and delete the less credible figure from the report
B) Re-scope to fewer, broader subagent tasks that can surface cross-cutting trends, and require each subagent to return claim-source mappings with publication dates
C) Let subagents exchange findings directly with one another during research so contradictions get reconciled before the coordinator runs its aggregation pass
D) Increase to 28 subagents covering component suppliers as well, giving the coordinator more raw material from which to infer industry-wide patterns

<details>
<summary>Answer & explanation</summary>

**B)** Overly narrow decomposition causes coverage gaps — single-manufacturer scopes cannot surface cross-cutting trends — and synthesis without claim-source mappings plus dates loses provenance, making contradictions unresolvable. The fix addresses both flaws: broader task scoping and provenance metadata flowing back to the coordinator. Direct subagent-to-subagent exchange fails because inter-subagent traffic routes through the coordinator, and deleting conflicting claims discards information that attribution and temporal metadata would resolve.

*Hint if stuck: Two separate design flaws are present — one in how the work was sliced, one in what the subagents hand back.*
</details>

---

## Question 30
A research coordinator passes search findings to a synthesis subagent as one long block of prose in which URLs, publication dates and quoted text are interleaved. The synthesizer's report often attaches the right quote to the wrong source or drops dates entirely. How should the coordinator pass the findings?

A) As structured records that keep source metadata (URL, title, date) in separate fields from the extracted content
B) As prose, but with each source's URL in bold so the synthesizer can visually tell where one source ends and the next begins
C) As the raw HTML of every page the search subagents visited, so the synthesizer can extract its own metadata directly
D) As a short summary written by the coordinator, with the sources listed once at the end in a single bibliography

<details>
<summary>Answer & explanation</summary>

**A)** Keeping metadata in fields separate from content lets the synthesizer carry each claim's source and date through to the report without having to untangle them. Bold formatting still leaves attribution to guesswork inside prose. Raw HTML floods the subagent's context and repeats extraction work, and a summary with a bibliography at the end is exactly how claim-to-source links get lost.

*Hint if stuck: Attribution survives a handoff best when it travels in its own slot.*
</details>

---

## Question 31
A coordinator's Task prompt to a pricing-research subagent is a 15-step script: open the vendor's site, click Pricing, copy the table, and so on. Whenever a vendor's site is laid out differently, the subagent stops at the step that does not match and reports failure. How should the prompt be rewritten?

A) Add branches for the three most common alternative site layouts so the script covers most of the vendors
B) State the goal, the output needed and the quality bar, such as current list prices per tier with a source URL
C) Shorten the script to five steps so there are fewer places where a vendor's layout can break the instructions
D) Keep the script and have the coordinator retry the subagent from step one whenever a step fails to match

<details>
<summary>Answer & explanation</summary>

**B)** Subagents work best when given goals, required outputs and quality bars, which let them adapt to whatever they find; rigid step-by-step scripts break on the first surprise. Adding branches or trimming steps keeps the brittle script approach, and retrying from step one hits the same mismatch again.

*Hint if stuck: Describe the destination and how to judge arrival, not every turn along the way.*
</details>

---

## Question 32
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

## Question 33
A support coordinator uses an AgentDefinition for a refund-eligibility subagent that should only read order and policy data. The definition omits the tools field, and in testing the subagent sometimes calls issue_refund directly from the MCP billing server. What is the right configuration change?

A) Add a sentence to the subagent's prompt forbidding it from calling issue_refund under any circumstances
B) Leave the tools field out, but log every issue_refund call made by the subagent so it can be reviewed later
C) Remove issue_refund from the coordinator's allowedTools so no agent in the system can call that tool at all
D) Set the tools field to only the read-only order and policy lookups the subagent needs for its job

<details>
<summary>Answer & explanation</summary>

**D)** When tools is omitted, the subagent inherits every tool available to subagents, so restricting it to the read-only lookups it needs is the deterministic fix. A prompt rule is probabilistic and can fail. Taking issue_refund away from the whole system breaks the legitimate refund path, and logging records the violation after money has moved.

*Hint if stuck: What does a subagent get by default when its tool list is left blank?*
</details>

---

## Question 34
A coordinator researching battery chemistries spawns a second round of subagents after a first round found the key papers. The new subagents re-run the same searches and return many of the same papers, because they have no idea what was already found. What should the coordinator include when spawning them?

A) The list of sources already collected and the specific open questions this round must answer, in each Task prompt
B) A note asking each new subagent to check the coordinator's conversation history for sources found in round one
C) A higher search result count for every search, so that each new subagent is more likely to reach papers beyond the first round's
D) Nothing extra; the coordinator should simply discard duplicate papers when it merges the second round's output

<details>
<summary>Answer & explanation</summary>

**A)** Subagents start with fresh context and inherit nothing from the coordinator, so what is already known and what remains open must be written into each Task prompt. Pointing them at the coordinator's history does not work because a regular subagent starts without that history. More search results still start from the same queries, and deduplicating afterwards pays for the repeated work.

*Hint if stuck: A new subagent knows only what its prompt tells it.*
</details>

---

## Question 35
A coordinator needs four reports on one supplier: financial health, legal disputes and news sentiment are independent, but a risk summary depends on all three. Which spawning pattern finishes fastest while keeping the summary correct?

A) Emit all four Task calls in one response and let the risk subagent read the others' results once they are ready
B) Emit the three independent Task calls in one response, then spawn the risk subagent with their results in its prompt
C) Spawn the four subagents one per turn in a fixed order, finishing with the risk summary once the others are done
D) Spawn one subagent that does all four analyses in sequence, so the risk summary can see every earlier result in one shared context

<details>
<summary>Answer & explanation</summary>

**B)** Multiple Task calls in one response run in parallel, so the three independent reports should go out together; the dependent summary starts afterwards with their results passed explicitly. Launching the summary in parallel starts it before the other reports exist, and nothing passes their results into its prompt. Spawning one per turn serializes independent work, and a single all-in-one subagent gives up both parallelism and isolation.

*Hint if stuck: Parallelize what is independent, and hand dependent work its inputs directly.*
</details>

---

## Question 36
To make sure nothing is lost, a coordinator pastes its entire 120,000-token conversation, including every earlier tool result, into the Task prompt of each of six subagents. Subagents run slowly and often focus on irrelevant details from old tool output. What should the coordinator do instead?

A) Paste the conversation as before but put an instruction at the top asking subagents to ignore the older tool results
B) Pass nothing from the conversation and let each subagent rediscover what it needs through its own tool calls
C) Pass only the facts, constraints and sources each subagent needs for its task, in a compact structured form
D) Store the conversation in a shared file and tell each subagent to read the file whenever it needs some context

<details>
<summary>Answer & explanation</summary>

**C)** Because nothing is inherited, context must be passed explicitly, but the goal is to pass what each task needs, not everything. A compact, structured brief gives subagents the relevant facts without drowning them. Telling them to ignore parts of a huge dump still fills their context, passing nothing forces expensive rediscovery, and a shared file just moves the same dump behind a tool call.

*Hint if stuck: Explicit context passing is about choosing what to send, not sending all of it.*
</details>

---

## Question 37
A coordinator asks three analysis subagents for findings, and each returns a few paragraphs of free text. The coordinator then struggles to merge them, mixing up which statistics came from which source. Which change to the Task prompts is most effective?

A) Ask each subagent to keep its answer under 200 words so the coordinator has less text to compare and merge
B) Tell each subagent to read the other two subagents' outputs before writing, so they can align their findings
C) Ask each subagent to write in the same tone and with the same paragraph structure as the other two subagents
D) Require each subagent to return its findings as a list of claims, each with its source, date and a confidence note

<details>
<summary>Answer & explanation</summary>

**D)** Specifying a structured return format in the Task prompt, with each claim tied to its source, makes the coordinator's merge mechanical and keeps attribution intact. A word limit shortens the text without fixing attribution, and a shared tone or structure still leaves sources buried in prose. The three run in parallel with isolated contexts, so there are no finished outputs to read, and aligning among themselves would bypass the coordinator.

*Hint if stuck: Ask for results in the shape the coordinator needs to combine them.*
</details>

---

## Question 38
A support coordinator has a dispute-investigation subagent defined with AgentDefinition. The team keeps adding each customer's account details, invoice numbers and conversation history to the definition's prompt field before every run, and the definition file churns constantly. Where should each kind of information go?

A) The role, method and standards in the AgentDefinition prompt; the case-specific details in the Task prompt
B) Everything in the AgentDefinition prompt, since that is the only text the subagent reads before it starts
C) Everything in the Task prompt, leaving the AgentDefinition prompt empty so the definition never has to change
D) The case details in CLAUDE.md so they load automatically, and the role and standards in the Task prompt

<details>
<summary>Answer & explanation</summary>

**A)** The AgentDefinition prompt is the subagent's stable system prompt for its role and standards, while the Task prompt carries per-invocation specifics such as this customer's account and invoices. Putting case data in the definition makes it churn on every ticket. An empty definition loses the reusable role, and CLAUDE.md holds project instructions, not per-case customer data.

*Hint if stuck: Separate what is true for every run from what is true only for this one.*
</details>

---

## Question 39
A document-extraction coordinator spawns one subagent per scanned contract and passes only the OCR text. The merged output cannot say which contract or page a clause came from, and downstream reviewers cannot verify anything. What should the coordinator pass to each subagent?

A) The OCR text with the file name added as a line at the top, so the subagent can always see which contract it is reading
B) The OCR text with document id and page numbers as separate fields, and an output format that cites both per clause
C) The OCR text only, but ask the subagent to infer the contract's name and pages from the content it is reading
D) The OCR text for all of the contracts at once, so each subagent can cross-reference clauses between documents

<details>
<summary>Answer & explanation</summary>

**B)** Passing document id and page numbers as separate metadata, and asking for them on each extracted clause, keeps provenance traceable through the merge. A file name in the text body may survive or may not, and gives no page-level detail. Inferring metadata from content invites errors, and giving every subagent every contract defeats the per-document isolation.

*Hint if stuck: Provenance has to be passed in before it can come back out.*
</details>

---

## Question 40
A coordinator's Task prompt tells a source-gathering subagent to 'find sources on hydrogen fuel cell costs'. It returns after two blog posts. The team needs at least three primary sources from the last two years and any disagreement between them flagged. What is the best change?

A) Raise the subagent's maximum turns so it has time to keep searching after it finds the first two sources
B) Spawn three copies of the same subagent with the same prompt and merge whatever sources they each bring back
C) State the quality bar in the Task prompt: three primary sources from the last two years, with conflicts flagged
D) Have the coordinator run its own extra searches after the subagent finishes to top up the list of sources

<details>
<summary>Answer & explanation</summary>

**C)** A subagent stops when it believes its task is done, so the Task prompt has to define what 'done' means: the number and kind of sources, recency and how to handle conflicts. More turns do not change a goal that two blog posts already meet. Three copies of the same vague prompt return three thin answers, and topping up in the coordinator duplicates the delegated work.

*Hint if stuck: A subagent can only meet a standard it has been told about.*
</details>

---

## Question 41
A coordinator spawns a research subagent to compare two cloud vendors. Halfway through, the subagent is unsure whether 'cost' means list price or total cost of ownership, and it guesses list price, which is not what the user wanted. The user had already clarified this to the coordinator. What should the coordinator have done?

A) Told the subagent it may pause and ask the user directly whenever it is unsure what a term means
B) Spawned two subagents, one for each meaning of cost, and let the user choose which result they wanted
C) Waited for the subagent's results and then re-run the comparison itself with the user's preferred definition
D) Included the user's clarification, total cost of ownership, in the Task prompt as part of the requirements

<details>
<summary>Answer & explanation</summary>

**D)** Decisions the user has already made live in the coordinator's conversation, which the subagent cannot see, so they must be written into the Task prompt. Routing questions from the subagent to the user bypasses the coordinator that already has the answer. Re-running the work afterwards wastes the delegation, and splitting into two subagents pays twice for a question that was already settled.

*Hint if stuck: The answer existed; it just never crossed the boundary.*
</details>

---

## Question 42
A developer-productivity coordinator uses a subagent to summarize third-party web pages about a library. A page includes hidden text instructing readers to run a shell command that deletes files. The subagent definition omits the tools field. Which configuration best limits the damage from such content?

A) Set the subagent's tools to only what it needs, such as fetching and reading, so it cannot run shell commands
B) Add a line to the subagent's prompt telling it never to follow instructions that appear inside web pages
C) Have the coordinator scan every page for suspicious commands before passing it to the summarizing subagent
D) Run the summarizing subagent on a smaller model that is less likely to act on instructions found in pages

<details>
<summary>Answer & explanation</summary>

**A)** Restricting the subagent's tools to fetching and reading means injected instructions have nothing dangerous to call; with tools omitted, it inherits everything available, including shell access. A prompt rule against following page instructions is a probabilistic defence. Scanning pages for suspicious commands is an arms race, and a smaller model is not a security boundary.

*Hint if stuck: The surest way to stop a dangerous action is to make it impossible rather than discouraged.*
</details>

---

## Question 43
A developer asks Claude Code to rename a config key used in three files. The main agent spawns three subagents, one per file, each of which re-reads the codebase to understand the key's meaning before editing. The rename takes far longer than doing it directly. What is the better approach?

A) Spawn the three subagents in parallel in one response, so the rename finishes in the time of the slowest one
B) Do the small, tightly scoped edit in the main agent, and save subagents for work that benefits from isolation
C) Give each subagent the full file list and the meaning of the key so that none of them has to explore
D) Spawn a single subagent to do all three edits so the main agent's context stays clean during the change

<details>
<summary>Answer & explanation</summary>

**B)** Each subagent starts with fresh context and must rebuild understanding, so delegation only pays when isolation or parallelism outweighs that cost; a three-file rename is cheaper done directly. Parallel spawning still pays the exploration cost three times. Passing context into each subagent reduces waste but keeps an unnecessary split, and a single subagent adds overhead to protect context that a small edit barely uses.

*Hint if stuck: Spawning has a cost; weigh it against what isolation buys for this task.*
</details>

---

## Question 44
A CI coordinator spawns a test-writer subagent with the Task prompt 'Write tests for the changes in this PR.' The subagent writes tests in the wrong framework against files the PR did not touch. What should the coordinator include in the Task prompt?

A) A reminder that the subagent can find all of the PR details by looking back through the coordinator's conversation history
B) An instruction to ask the developer which files and framework to use before it writes any of the tests
C) The changed file paths, the relevant diff hunks, the project's test framework and its conventions for test files
D) Nothing more, but restrict the subagent's tools to Read and Write so it cannot explore files outside the PR

<details>
<summary>Answer & explanation</summary>

**C)** The subagent sees only its Task prompt, so the coordinator must pass the changed paths, the diff and the test conventions explicitly. A regular subagent starts without the coordinator's history. A CI run has no developer to ask, and restricting tools to Read and Write does nothing to tell the subagent which files changed or which framework to use.

*Hint if stuck: List what a newcomer would need to write the right tests on the first try.*
</details>

---

## Question 45
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

## Question 46
A coordinator in a developer-productivity tool spawns several Task calls in one response to analyze different services in parallel. All the calls use the same prompt, 'Analyze the service for performance issues', and they return nearly identical reports about the same service. What is the fix?

A) Give each Task call its own prompt naming the service it owns and the boundaries it should stay within
B) Spawn the subagents one at a time instead, so each new subagent can see what the earlier ones already reported
C) Lower the number of parallel subagents to two so that the amount of duplicated work is much smaller
D) Add a deduplication step in the coordinator that merges reports when two subagents analyze the same service

<details>
<summary>Answer & explanation</summary>

**A)** Parallel Task calls are only useful if each carries a distinct scope; identical prompts lead independent subagents to the same obvious target. Naming each service and its boundaries in its own Task prompt fixes this. Spawning one at a time does not help because later subagents still see only their own prompt unless the coordinator passes the earlier reports, fewer subagents means less coverage, and deduplicating afterwards pays for the duplicated work.

*Hint if stuck: Running in parallel is pointless if every runner gets the same assignment.*
</details>

---

## Question 47
A coordinator in a research system summarizes a search subagent's results in its own words before passing them to a writing subagent. The summaries drop URLs and blur exact figures, and the final report's citations are wrong. What should change in the handoff?

A) Have the coordinator write longer summaries that mention each source by name when it describes a finding
B) Pass the search subagent's structured findings, with their source fields, to the writer instead of a paraphrase
C) Give the writing subagent web access so it can search again for sources for any figure it is unsure about
D) Have the writing subagent add a disclaimer that citations are approximate whenever a source is missing

<details>
<summary>Answer & explanation</summary>

**B)** Each paraphrase between agents is a chance to lose detail; forwarding the structured findings, with source metadata in their own fields, keeps exact figures and URLs intact. Longer summaries still paraphrase and still blur numbers. Giving the writer search access turns it into a second researcher, and a disclaimer accepts the loss rather than fixing it.

*Hint if stuck: Every retelling in a relay is a chance for details to slip.*
</details>

---

## Question 48
A Claude Code coordinator delegates a dependency audit to a subagent and later needs to tell the developer exactly which manifest files were inspected. The subagent's final reply says only 'No vulnerable versions found', and the coordinator cannot list the files, even though the subagent read many of them with its tools. What should the coordinator change?

A) Re-run the audit in the coordinator itself so that every file read shows up in the coordinator's own conversation history
B) Read the subagent's tool results directly from the coordinator's context, since they are appended there as the subagent runs
C) Ask the subagent, in the Task prompt, to include the list of files it inspected and how it checked them in its final report
D) Give the subagent the same session as the coordinator so their histories merge and the file reads become visible to both

<details>
<summary>Answer & explanation</summary>

**C)** Only a subagent's final message returns to its parent; its intermediate tool calls and results stay in its own context. If the coordinator needs the list of files, the Task prompt must ask for it in the final report. The tool results are not appended to the coordinator's context, redoing the audit in the coordinator throws away the isolation, and there is no option to merge a regular subagent's history into the parent's.

*Hint if stuck: Consider what actually travels back from a subagent when it finishes.*
</details>

---

## Question 49
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

## Question 50
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

## Question 51
A nightly CI job runs claude -p 'Audit every changed package for license violations' --allowedTools 'Read,Grep,Glob,Bash'. The prompt tells the coordinator to delegate each package to a subagent, but it never spawns any — it scans everything itself and exhausts its context window on large diffs. What is wrong?

A) Headless print mode cannot spawn subagents; the audit must run in an interactive session
B) The Task tool is missing from allowedTools, so the coordinator has no way to spawn subagents; add Task to the list
C) The prompt needs firmer wording such as 'you MUST delegate every package to a subagent'
D) Subagent support in CI requires exporting CLAUDE_SUBAGENTS=true before invoking claude -p

<details>
<summary>Answer & explanation</summary>

**B)** Spawning subagents happens through the Task tool, so Task must appear in allowedTools like any other tool; without it the coordinator can only do the work inline. Headless mode supports subagents fine, and CLAUDE_SUBAGENTS is not a real variable. Stronger prompt wording cannot grant a capability the tool allowlist has removed.

*Hint if stuck: Delegation itself happens through a tool, and tools must be permitted.*
</details>

---

## Question 52
A platform team in a 300-developer monorepo wants a reusable schema-migration-checker subagent that any engineer's session can delegate to. It must be limited to Read, Grep, and Glob, and run on a cheaper model than the main session. How should it be defined?

A) Document the checker's behavior and tool limits in the project CLAUDE.md so every session knows the convention
B) Register it as an MCP server in .mcp.json with the tool restrictions in the server config
C) Create .claude/agents/migration-checker.md with YAML frontmatter setting description, tools, and model, and commit it
D) Add .claude/commands/migration-checker.md so engineers can invoke it as a slash command

<details>
<summary>Answer & explanation</summary>

**C)** Custom subagents are defined as files in .claude/agents/ whose YAML frontmatter declares the description, the tool allowlist, and a per-agent model — exactly the three requirements here — and committing the file shares it repo-wide. CLAUDE.md is memory and cannot enforce tool or model restrictions. An MCP server exposes tools, not a delegable agent, and a slash command is a reusable prompt without its own restricted toolset and model.

*Hint if stuck: One specific directory holds delegable agent definitions with per-agent tools and model.*
</details>

---

## Question 53
A research pipeline runs 12 scout subagents that each fetch one source and extract publication dates and key claims — mechanical work — plus one synthesizer that writes the final competitive analysis. Analysts trigger it on demand and wait for the memo, and each run costs about $40 with everything on Opus. How do you cut cost with the least quality risk?

A) Move the whole pipeline, scouts and synthesizer alike, onto Haiku
B) Reduce the scout count from 12 to 3 so fewer Opus invocations occur
C) Submit the synthesizer's final call through the Batch API for the 50% discount
D) Set model: haiku in the scout agents' frontmatter and keep the synthesizer on Opus

<details>
<summary>Answer & explanation</summary>

**D)** Per-agent model selection is the point of the model field in .claude/agents/ frontmatter: simple fetch-and-extract scout work suits Haiku, while the quality-critical synthesis stays on a stronger model. Moving everything to Haiku risks the final analysis, and cutting scouts from 12 to 3 trades cost for coverage gaps. The Batch API has no latency SLA and can take up to 24 hours, which breaks an on-demand pipeline, and it discounts only one call while 12 Opus scouts drive most of the spend.

*Hint if stuck: Match model capability to each role's difficulty instead of pricing the whole pipeline uniformly.*
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
In a multi-agent research session, the user spends ten turns with the coordinator narrowing scope: peer-reviewed sources only, 2024-2026 publications, exclude preprints. The coordinator then spawns four research subagents, and three of them come back citing 2019 preprints. Why did this happen, and what is the fix?

A) Subagent contexts are isolated and inherit nothing — the coordinator must explicitly pack the scope constraints into every Task prompt it issues
B) The subagents share the coordinator's context but lose mid-conversation details to lost-in-the-middle; move the constraints to the top of the history
C) The Task tool truncates long prompts; store the scope constraints in a shared memory file that every subagent is instructed to read at startup
D) The subagents were forked from too early a baseline; re-fork them after the scoping turns so the constraints land in the shared session baseline

<details>
<summary>Answer & explanation</summary>

**A)** Subagents run with isolated context and inherit nothing from the coordinator's conversation, so any constraint that matters must be explicitly packed into each task prompt. Lost-in-the-middle applies only to facts that are actually in context, which these never were. Shared memory files and fork timing tricks trade explicit, auditable context passing for fragile implicit state — and these subagents were spawned with isolated contexts, not forked from a baseline.

*Hint if stuck: Ask what a freshly spawned subagent actually knows about the conversation that spawned it.*
</details>

---

## Question 56
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

## Question 57
A market-intelligence team runs a nightly CI job where a coordinator agent spawns six subagents through parallel Task calls to analyze competitor filings. The coordinator's conversation contains the target fiscal quarter and the exact ticker list, yet subagents repeatedly research the wrong quarter and unrelated companies. What is the correct fix?

A) Move the quarter and ticker list into the project CLAUDE.md so subagents pick them up automatically each night
B) Let subagents message the coordinator mid-task to request whichever parameters they find missing
C) Have the coordinator pack the quarter and ticker list directly into each subagent's task prompt
D) Raise the subagent iteration limit so they have time to rediscover the correct quarter on their own

<details>
<summary>Answer & explanation</summary>

**C)** Subagent contexts are isolated — they inherit nothing from the coordinator's conversation, so every fact a subagent needs must be explicitly packed into its task prompt. CLAUDE.md is for stable team standards, not per-run parameters: routing nightly values through it would mean rewriting a version-controlled file on every run, and it still substitutes shared memory for explicit context passing. Subagents cannot interrogate the coordinator mid-task, since traffic routes through the coordinator only as task prompts and returned results, and extra iterations just burn tokens rediscovering facts the coordinator already had.

*Hint if stuck: Consider what a freshly spawned subagent can and cannot see of its parent's conversation.*
</details>

---

## Question 58
A monorepo platform team wants every engineer's Claude Code session to delegate dependency-graph exploration to a fast, cheap scout while the main session stays on Sonnet. Today each engineer ad-libs a prompt like use a cheaper model for this, with wildly inconsistent results. How should the team standardize this?

A) Document the delegation prompt in an onboarding guide that each engineer pastes into their personal ~/.claude/CLAUDE.md
B) Set a CLAUDE_SUBAGENT_MODEL environment variable in the team's shared settings.json file
C) Add a project CLAUDE.md instruction telling Claude to mention Haiku whenever it spawns a Task for exploration
D) Commit a custom subagent in .claude/agents/ whose YAML frontmatter sets its description, tools, and model: haiku

<details>
<summary>Answer & explanation</summary>

**D)** Custom subagents live in .claude/agents/ with YAML frontmatter that pins description, tools, and model, and committing the file version-controls the behavior for the entire team. Personal CLAUDE.md copies drift and are not shared, CLAUDE_SUBAGENT_MODEL is not a real setting, and a CLAUDE.md nudge to mention Haiku remains probabilistic where a config field is deterministic.

*Hint if stuck: Look for the version-controlled artifact that pins a subagent's model deterministically.*
</details>

---

## Question 59
A platform team's CI job sends all 22 changed files of a pull request to Claude in one review prompt. Reviewers notice that findings cluster on the first and last few files, files in the middle get one-line comments, and the same retry pattern is praised in one file and flagged in another. What change to the review design addresses this?

A) Keep the single prompt but add an instruction to give every file equal attention and to apply the same standard to repeated patterns
B) Review each file in its own focused pass for local issues, then run a separate integration pass that looks at cross-file data flow and consistency
C) Run the single-prompt review three times and keep only the findings that appear in at least two of the three runs before posting
D) Sort the files so the most security-sensitive ones appear first in the prompt, where the model reliably pays the most attention to them

<details>
<summary>Answer & explanation</summary>

**B)** Splitting into per-file local passes gives every file focused attention, and a dedicated integration pass catches the cross-file issues that per-file passes cannot see. Telling the model to pay equal attention is a prompt-only fix for a structural attention problem, and voting across runs of the same overloaded prompt just repeats the same blind spots.

*Hint if stuck: When one pass has too much to look at, think about splitting local checks from cross-cutting ones.*
</details>

---

## Question 60
A CI review pipeline already reviews each changed file in its own pass. On a recent PR it approved every file, yet the merge broke production: `formatAmount()` in currency.ts changed from returning a string to returning an object, and two callers in other files still concatenate it. Which change fixes the root cause?

A) Give each per-file pass the full contents of every other changed file as extra context so it can notice broken callers on its own
B) Tell each per-file reviewer in its prompt to think carefully about how other code in the repository might call the functions it changed
C) Add a separate integration pass after the per-file passes that examines how changed interfaces are used across the files in the PR
D) Raise the severity threshold so that any change to a function's return type blocks the merge until a human approves the pull request

<details>
<summary>Answer & explanation</summary>

**C)** The per-file design has no step whose job is cross-file consistency, so a contract change with stale callers falls between passes; a dedicated integration pass fills that gap. Stuffing every file into each per-file pass recreates the attention dilution the split was meant to fix, and an instruction to think about callers cannot help a pass that never sees them.

*Hint if stuck: Each step can only catch what its input lets it see.*
</details>

---

## Question 61
A multi-agent research system receives the request: 'Assess how the new battery-recycling rules will affect our European supply chain.' The coordinator immediately splits it into five fixed subtopics and dispatches subagents, but two subtopics turn out to be irrelevant and a key upstream supplier issue is never examined. How should the coordinator decompose open-ended requests like this?

A) Use a larger fixed template of ten subtopics so that the decomposition covers more of the possible ground on every request
B) Ask the user to list the exact subtopics up front so the coordinator never has to make decomposition decisions on its own
C) Dispatch one subagent per supplier in the company's vendor list so every part of the supply chain gets an independent investigation
D) First run a short scoping step to map the landscape and find the highest-impact areas, then plan subtasks and revise them as findings arrive

<details>
<summary>Answer & explanation</summary>

**D)** Open-ended investigations need a plan that starts from mapping what matters and then adapts as findings come in. A bigger fixed template still only covers what someone predicted, pushing the decomposition back to the user ignores the system's job, and one subagent per vendor spends effort uniformly rather than on high-impact areas.

*Hint if stuck: For work whose shape is unknown at the start, the first subtask is learning the shape.*
</details>

---

## Question 62
An accounts-payable pipeline extracts data from supplier invoices. Every invoice goes through the same steps: identify the supplier, extract line items, compute totals, and check totals against the stated amount. The team currently uses an autonomous agent with tool access that sometimes skips the totals check. What design fits best?

A) Replace it with a fixed prompt chain, one step per stage, with a programmatic gate that verifies the totals before output is accepted
B) Keep the autonomous agent and add a system-prompt rule saying the totals check is mandatory and must never be skipped
C) Keep the autonomous agent but add a separate reviewer subagent whose only job is checking the first agent's extraction for skipped steps
D) Merge all four stages into one carefully engineered prompt so that the model sees the whole procedure in a single request

<details>
<summary>Answer & explanation</summary>

**A)** The steps are known and identical for every invoice, which is the textbook case for a fixed prompt chain, and a programmatic gate makes the totals check deterministic. A system-prompt rule is a probabilistic fix for something that must always happen, and a reviewer subagent adds cost while leaving the skipped step to chance.

*Hint if stuck: If you can write the steps down in advance, you may not need the model to choose them.*
</details>

---

## Question 63
A customer writes to the support agent: 'My last order arrived damaged, I was charged twice for it, and I need to change my delivery address for next week's order.' The current agent handles the damaged item thoroughly and then closes the conversation. What decomposition approach should the agent use for messages like this?

A) Answer the concern the customer mentioned first, then ask whether they have any other issues before the agent closes the support ticket
B) Split the message into its separate issues, investigate each one with the shared customer context, then send one combined resolution
C) Route the message to whichever specialist queue matches the most urgent of the issues and let that queue handle the full ticket
D) Reply asking the customer to open a separate ticket for each issue so that every request is tracked and resolved independently

<details>
<summary>Answer & explanation</summary>

**B)** A multi-concern request should be broken into distinct items that are each investigated, then synthesised into one unified response. Asking whether there is anything else relies on the customer to repeat themselves, routing on the most urgent issue drops the others, and making the customer open three tickets pushes the decomposition work onto them.

*Hint if stuck: Count the problems in the message before you start solving any of them.*
</details>

---

## Question 64
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

## Question 65
An agent was asked to untangle a slow nightly data job. It mapped the job's stages, picked the three slowest, and wrote a plan. While working on the first stage it discovered that two of the 'slow' stages are only slow because they wait on a lock held by the third. It keeps executing its original plan step by step. What should the architect change?

A) Write a more detailed plan up front that lists every possible dependency, so the agent never has to change course once execution starts
B) Require the agent to finish every planned step before it is allowed to act on anything new that it discovers along the way
C) Cap the number of plan steps at three so the agent cannot drift away from the original priorities into extra investigation
D) Have the agent revisit and re-prioritise its plan whenever a finding changes the picture, instead of treating the plan as fixed

<details>
<summary>Answer & explanation</summary>

**D)** Adaptive decomposition means the plan is a working hypothesis that is updated as findings arrive; the lock discovery changes which stage matters, so the plan should change. A more detailed upfront plan still cannot anticipate discoveries, forcing completion first wastes effort on symptoms, and a step cap is a blunt limit that does nothing to steer the plan toward the real cause.

*Hint if stuck: A plan for open-ended work is a starting point, not a contract.*
</details>

---

## Question 66
A developer asks Claude Code to add per-tenant rate-limit settings to an unfamiliar codebase where the change will touch the admin UI, an API layer and a database migration. The developer wants the work to go smoothly the first time. Which way of breaking down the task is most effective?

A) Have Claude first explore how existing settings flow from UI to storage, identify the affected modules, agree a plan, then implement and adjust it
B) Start with the database migration because it is the lowest layer, then let the API and UI changes follow from whatever the schema needs
C) Ask Claude to implement all three layers in one go and then run the full test suite to discover what it missed in the unfamiliar code
D) Write three separate prompts, one per layer, and run them in parallel sessions so that no layer's changes depend on the others

<details>
<summary>Answer & explanation</summary>

**A)** In unfamiliar code the efficient decomposition is to map the existing structure, find where the change lands, plan, and then adapt during implementation. Starting at the bottom layer assumes the design before understanding it, implement-then-test discovers mistakes late, and parallel per-layer sessions ignore that the layers share a contract.

*Hint if stuck: Understand how a similar thing already works before deciding the order of edits.*
</details>

---

## Question 67
A CI pipeline runs a fixed four-step review chain on every pull request: security, performance, API contracts, tests. Many PRs only change Markdown docs, and on those the security and performance steps produce irrelevant warnings that developers have started ignoring everywhere. What is the best fix?

A) Tell each review step in its prompt to return no findings when it decides that the changes it was given do not affect its area at all
B) Add a step before the chain that classifies the change type and routes docs-only PRs to a short docs-specific check instead of the full chain
C) Replace the fixed chain with an autonomous agent that decides for itself which review aspects are relevant for each pull request
D) Keep running the full chain for all PRs but hide the security and performance comments from developers when they are low severity

<details>
<summary>Answer & explanation</summary>

**B)** Inputs fall into distinct categories that need different handling, so a routing step in front of the chain keeps each path focused while the full chain still runs on code changes. Asking each step to stay quiet relies on probabilistic judgement in every step, an autonomous agent throws away the predictability that suits code review, and hiding comments treats the symptom.

*Hint if stuck: When different kinds of input need different paths, decide the path before doing the work.*
</details>

---

## Question 68
A loan-processing team extracts data from each application packet: a form, three pay stubs, a bank statement and an employer letter. Each document is extracted well on its own, but the system missed that the income on the form was 40% higher than the pay stubs showed. What should the architect add?

A) A stricter JSON schema for each document type so that every income field must be filled in with a validated numeric value
B) One combined extraction prompt over all six documents so that the model can see every income figure in the packet at once
C) A reconciliation pass after the per-document extractions that compares the related fields across documents and flags conflicts
D) A follow-up instruction in each document's extraction prompt to flag any figure that looks unusually high for an applicant

<details>
<summary>Answer & explanation</summary>

**C)** This is the per-unit then integration pattern: per-document passes do local extraction well, and a separate cross-document pass is where consistency checks belong. A stricter schema validates each document alone and cannot see the conflict, merging everything into one prompt sacrifices the per-document accuracy that already works, and asking each extractor to judge 'unusually high' gives it no comparison point.

*Hint if stuck: A per-document step cannot spot a disagreement between documents.*
</details>

---

## Question 69
A support resolution agent is handling a billing dispute where the customer says a refund never arrived. It planned to check the order, check the refund record, then reply. The refund record shows the refund was issued to an account the customer says they closed last year. What should the agent's decomposition strategy be at this point?

A) Finish the original three steps and reply that the refund was issued, since that is the plan the agent started with
B) Escalate the case to a human straight away, since any deviation from the expected path means the agent cannot handle it
C) Restart the investigation from the beginning with a fresh plan so the earlier assumptions do not influence the new attempt
D) Treat the finding as new information and add steps to verify the account's status and the re-issue options before replying

<details>
<summary>Answer & explanation</summary>

**D)** Investigations should adapt when a finding changes the situation; the closed account becomes a new subtask before the reply. Sticking to the original plan produces a technically true but useless answer, escalating on any deviation throws away work the agent can still do, and restarting from scratch discards the evidence already gathered.

*Hint if stuck: Let what you just learned decide the next step.*
</details>

---

## Question 70
A CI job reviews very large pull requests by fanning out one subagent per changed file and then running an integration pass. The integration step is given the raw contents of all 60 files and keeps timing out with shallow results. What should the integration pass receive instead?

A) The per-file findings plus a summary of each file's changed interfaces, exports and call sites, so it can reason about connections
B) The raw contents of only the ten largest files, since big files are the most likely to contain the cross-file problems
C) Nothing from the per-file step, so that the integration review stays independent and unbiased by what other reviewers already said
D) The full contents of all 60 files split across six sequential integration calls of ten files each, with each call reviewed separately

<details>
<summary>Answer & explanation</summary>

**A)** The integration pass exists to reason about how files connect, so it needs condensed structured input about interfaces and findings rather than raw text. Picking the largest files is an arbitrary filter, withholding per-file findings makes it redo work, and splitting into ten-file batches reintroduces the very boundaries the integration pass is meant to cross.

*Hint if stuck: Give the cross-file step what it needs to see connections, not everything.*
</details>

---

## Question 71
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

## Question 72
A team uses Claude Code to generate 14 REST endpoints for an internal admin service. Every endpoint follows the same pattern: route, validation, handler, repository call, tests. The first attempt asked for all 14 at once and produced inconsistent validation. How should the work be decomposed?

A) Have Claude explore the codebase from scratch before each endpoint, since each one may reveal something unexpected about the design
B) Ask for all 14 again with a much longer prompt that spells out the validation rules in more detail for every single endpoint
C) Use a fixed sequence per endpoint built from one agreed template, then run a final pass that checks consistency across all of them
D) Have one autonomous agent decide its own order and approach for the endpoints, checking in only when every one is finished

<details>
<summary>Answer & explanation</summary>

**C)** The work is predictable and repetitive, so a fixed per-endpoint chain from a shared template gives focused, consistent output, and a final cross-endpoint pass catches drift. Re-exploring before each endpoint treats predictable work as open-ended, a longer all-at-once prompt keeps the dilution, and an unsupervised agent adds variability with no benefit.

*Hint if stuck: Is the shape of each piece of work known before you start?*
</details>

---

## Question 73
A research pipeline writes market briefs in a fixed chain: outline, draft, edit. Briefs are sometimes missing a required regulatory section, and the gap only surfaces when a reviewer reads the finished brief. Where is the most effective place to catch this?

A) Move the regulatory section to the top of the outline template so that the model is more likely to remember to include it
B) Add a line to the drafting prompt reminding the model that the regulatory section is mandatory in every brief it writes
C) Add a final review step after editing in which the model rereads the whole brief and adds anything that it thinks is missing
D) Add a programmatic check after the outline step that confirms every required section is present before drafting begins

<details>
<summary>Answer & explanation</summary>

**D)** Prompt chains benefit from gates on intermediate outputs: checking the outline catches the gap cheaply, before drafting and editing effort is spent, and does so deterministically. A drafting reminder is still probabilistic, a final self-review step relies on the same model spotting its own omission late, and moving the section only nudges likelihood.

*Hint if stuck: Catch a structural gap at the earliest step where it becomes visible.*
</details>

---

## Question 74
An engineering lead proposes replacing a three-step prompt chain that classifies, summarises and tags incoming bug reports with a multi-agent orchestrator plus five specialist subagents. The current chain is accurate on 97% of reports and the failures are mostly malformed inputs. What is the most sensible response?

A) Keep the chain and fix the malformed-input cases directly, adding complexity only if evaluation shows a simpler design falling short
B) Adopt the orchestrator, since multi-agent designs are more capable and the remaining failures will likely disappear with them
C) Run the orchestrator alongside the chain permanently and publish whichever of the two outputs has the higher model confidence
D) Collapse the chain into one prompt, since fewer steps is always simpler and simpler is always the better architectural choice

<details>
<summary>Answer & explanation</summary>

**A)** Anthropic's guidance is to use the simplest design that works and add complexity only when it demonstrably improves outcomes; the remaining errors come from inputs, not from the decomposition. A multi-agent rebuild adds cost and failure modes for no evidenced gain, running both permanently doubles cost, and collapsing the chain discards a structure that is already working.

*Hint if stuck: Fix the failures you actually see before redesigning what already works.*
</details>

---

## Question 75
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

## Question 76
A team uses a fixed prompt chain for routine support tasks such as address changes. A product manager wants to use the same fixed chain (look up order, check policy, apply change, confirm) for complaints about unexplained account charges, which often turn out to involve fraud, family-member purchases or bank errors. What should the architect advise?

A) Use the fixed chain for both, since one consistent workflow for all support tickets makes the system easier to test and maintain
B) Extend the fixed chain with steps for fraud, family purchases and bank errors so that every charge complaint passes through all of them
C) Keep the fixed chain for address changes but handle charge investigations adaptively, letting each finding decide the next step
D) Send all charge complaints straight to human agents, since a model cannot handle cases that do not follow a predictable pattern

<details>
<summary>Answer & explanation</summary>

**C)** Fixed chains suit predictable tasks; charge investigations branch on what is found, so they need adaptive decomposition. A single chain forces open-ended cases down a path that does not fit, running every possible branch on every complaint wastes effort and still misses new causes, and handing all such cases to humans gives up work the agent can do.

*Hint if stuck: Match the decomposition style to how predictable the task is.*
</details>

---

## Question 77
A team per-file reviews a 30-file PR with parallel subagents. The results contradict each other: one subagent flags a silent `catch {}` block as a bug, while another accepts the identical pattern in a sibling file. Developers do not know which verdict to trust. What is the most effective improvement?

A) Merge all 30 files back into one review prompt so that a single reviewer applies one consistent standard to every file at the same time
B) Ask every per-file subagent to rate its confidence and keep only the findings that were rated as high confidence
C) Run each per-file review twice with different random seeds and flag only those patterns that both of the runs agree on
D) Add an integration pass that reconciles findings across files, so the same pattern gets one verdict and contradictions are resolved

<details>
<summary>Answer & explanation</summary>

**D)** Per-file passes are independent, so they can disagree; a cross-file integration pass is where consistency gets enforced. Merging back into one prompt reintroduces attention dilution, self-rated confidence does not resolve a contradiction between reviewers, and repeated runs of the same per-file setup still never compare files with each other.

*Hint if stuck: Which step is responsible for comparing files with each other?*
</details>

---

## Question 78
A new staff engineer asks Claude to help document an undocumented internal platform of about 200 modules before a quarterly planning meeting in two weeks. They cannot document everything in time. How should the work be broken down?

A) Map entry points and dependency structure first, find the modules most other code relies on, and plan to document those first
B) Document modules in alphabetical order and stop when the deadline arrives, then pick up the rest next quarter
C) Ask Claude to generate a short summary of all 200 modules in a single pass, so that no part of the platform is left out of the documentation
D) Ask each team that owns a module to list its most important functions and document only the functions they nominate

<details>
<summary>Answer & explanation</summary>

**A)** With limited time on an open-ended task, the right decomposition maps the structure, ranks areas by impact, and plans from there. Alphabetical order spends time without regard to value, a single shallow pass over everything produces little usable documentation, and waiting on nominations from each team turns a mapping job into a coordination problem.

*Hint if stuck: When you cannot cover everything, decide what matters most before you start.*
</details>

---

## Question 79
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

## Question 80
A developer asks Claude Code to replace every `console.log` call with the team's structured `logger.info` across 400 files. The mapping is mechanical and identical everywhere, and tests exist for all files. A teammate suggests an investigate-first approach that explores the architecture and plans adaptively. What is the better choice?

A) Agree with the teammate, since any task touching 400 files is complex enough to need an exploratory mapping phase first
B) Have Claude choose a different approach for each directory based on what it finds there, to account for local code styles
C) Treat it as a predictable task: apply the same transformation to each batch of files and verify each batch with the tests
D) Ask Claude to do all 400 files in one prompt, since the change is so simple that splitting it into separate steps would add nothing useful

<details>
<summary>Answer & explanation</summary>

**C)** Scale alone does not make a task open-ended; a mechanical, identical change is predictable work best handled as a fixed per-batch step with test gates. An exploratory phase adds cost with nothing to discover, varying the approach per directory creates inconsistency, and one giant pass dilutes attention and makes failures hard to isolate.

*Hint if stuck: Is the work hard to plan, or just large?*
</details>

---

## Question 81
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

## Question 82
An extraction service processes 80-page supplier contracts in one prompt that pulls 45 fields, normalises dates and currencies, and checks clause consistency. Fields from the last third of the contract are often missing or wrong. Which redesign best addresses this?

A) Split the contract into sections, extract each section's fields in its own step, then run normalisation and a cross-section consistency step
B) Raise max_tokens substantially so the single prompt has more room to write out every one of the 45 fields in full
C) Tell the model in the prompt to read the final third of the contract with extra care, since that is where most errors occur
D) Repeat the same single-prompt extraction twice and fill any missing fields in the first result using values from the second run

<details>
<summary>Answer & explanation</summary>

**A)** One prompt doing many jobs over a long document dilutes attention; splitting into focused section steps, then normalising and checking consistency across sections, gives each concern its own pass. More output tokens does not fix attention, an instruction to take extra care is a prompt-only fix, and merging two runs of the same overloaded prompt repeats its weakness.

*Hint if stuck: When one step does too much over too much text, split by both scope and concern.*
</details>

---

## Question 83
A research system's coordinator dispatches two subagents in parallel: one to identify the five largest vendors of warehouse robots, and one to compare those five vendors' service contracts. The comparison subagent keeps choosing its own list of vendors, which rarely matches the first subagent's list. What is the right fix to the decomposition?

A) Give the comparison subagent a longer prompt explaining that it must pick the same vendors as the other subagent
B) Run the two tasks in sequence, passing the identified vendor list into the comparison task as an explicit input
C) Let both subagents run in parallel and have the coordinator discard any comparisons for vendors not on the first list
D) Merge both tasks into one subagent prompt and tell it to identify the vendors and compare them in a single response

<details>
<summary>Answer & explanation</summary>

**B)** Parallel decomposition only works for independent subtasks; the comparison depends on the vendor list, so the steps must run in sequence with the list passed along. A prompt telling the second subagent to match a list it cannot see cannot work, discarding mismatches wastes most of its effort, and merging into one prompt gives up the focus the split was meant to provide.

*Hint if stuck: Check whether one subtask needs the other's output before running them side by side.*
</details>

---

## Question 84
A document pipeline handles leases, invoices and NDAs, each with its own extraction schema. Today one prompt contains all three schemas and asks the model to pick the right one and extract. About 6% of documents are extracted against the wrong schema, which corrupts downstream records. What design best fixes this?

A) Run a separate classification step first, then have code choose the schema for that type and run extraction with only that schema
B) Ask the model to state the document type on the first line of its output before extracting, then extract in the same response
C) Add more examples of each document type to the combined prompt so the model gets better at choosing the matching schema on its own
D) Lower the temperature to zero so that the model picks the same schema consistently for documents that look alike to each other

<details>
<summary>Answer & explanation</summary>

**A)** Breaking the task into a classification step and an extraction step, with code routing between them, makes each step simpler and lets the routing be deterministic. More examples and stating the type first still leave schema choice and extraction tangled in one call. Temperature zero makes the choice consistent, not correct.

*Hint if stuck: Separate the decision from the work that depends on it.*
</details>

---

## Question 85
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

## Question 86
A developer-productivity agent is asked to 'add comprehensive tests to our legacy billing codebase' (300 modules, almost no existing tests, unclear dependencies). Which decomposition approach should it take?

A) Map the codebase first, identify the highest-impact areas, then build a prioritised plan that is revised as dependencies are discovered
B) Generate tests module by module in alphabetical order until every module has at least one test
C) Ask for all of the tests in a single pass so the model sees the whole codebase at once
D) Write a detailed 40-step procedure up front covering every module and dependency, and have the agent follow it step by step without deviation

<details>
<summary>Answer & explanation</summary>

**A)** An open-ended task over an unfamiliar codebase needs adaptive decomposition: explore and map first, prioritise by impact, and let the plan change as dependencies surface. Alphabetical order ignores impact, a single pass dilutes attention across 300 modules, and a rigid upfront procedure cannot account for what has not been discovered yet.

*Hint if stuck: You cannot plan well for code you have not explored yet.*
</details>

---

## Question 87
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

## Question 88
Which of these workflows most clearly calls for dynamic, adaptive task decomposition instead of a fixed prompt chain?

A) A nightly summary of the same four lint checks across a repository
B) Translating each release note into three languages
C) Reformatting every incoming invoice from many different vendors into a fixed internal template
D) Finding the root cause of an intermittent memory leak that spans several services

<details>
<summary>Answer & explanation</summary>

**D)** A root-cause hunt across services is open-ended, so each finding changes what to examine next, which is what adaptive decomposition is for. The other three are predictable, repeated transformations where a fixed chain is simpler and more reliable.

*Hint if stuck: Which one could not be planned step by step in advance?*
</details>

---
