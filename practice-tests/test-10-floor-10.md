# Practice Test 10: Synthesis Chamber
**D5: Context Management & Reliability** (15% of the exam) · task statements 5.4, 5.5, 5.6

16 questions. Exam pace is 2 minutes per question.

---

## Question 1
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

## Question 2
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

## Question 3
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

## Question 4
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

## Question 5
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

## Question 6
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

## Question 7
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

## Question 8
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

## Question 9
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

## Question 10
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

## Question 11
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

## Question 12
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

## Question 13
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

## Question 14
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

## Question 15
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

## Question 16
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
