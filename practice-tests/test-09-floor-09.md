# Practice Test 09: The Memory Halls
**D5: Context Management & Reliability** (15% of the exam) — Context management & escalation

15 questions. Exam pace is 2 minutes per question; aim for 30 minutes.
Pass bar in the game: 7/10 on a random draw. Pass bar here: be honest.

---

## Question 1
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

## Question 2
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

## Question 3
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

## Question 4
A multi-agent research system's coordinator builds a 60k-token synthesis prompt: subagent findings concatenated chronologically, with the critical scope constraint ('only include peer-reviewed sources after 2020') stated once around token 30k, where it landed in sequence. The final report repeatedly cites blog posts from 2017. What change most directly fixes this?

A) Increase the thinking budget so the model reasons more carefully over the full 60k tokens
B) Rerun the synthesis on a model with a larger context window so the prompt fits more comfortably
C) Append a final instruction line — 'double-check that every citation meets the scope constraint' — to the prompt
D) Move the scope constraint and key summaries to the top of the prompt under clear headers

<details>
<summary>Answer & explanation</summary>

**D)** This is the lost-in-the-middle effect: facts buried mid-context get missed even when the prompt fits comfortably in the window. Placing critical constraints and summaries at the top under clear headers puts them where attention is strongest. The larger-window option misdiagnoses the problem — nothing overflowed — and a trailing reminder still requires the model to attend to the buried constraint.

*Hint if stuck: The prompt fits in the window — think about where in the window the constraint sits.*
</details>

---

## Question 5
A telecom support agent is mid-troubleshooting when the customer types 'Stop. I want to talk to a real person.' The agent responds 'I understand, but let's try resetting your router first' and continues for four more turns before the customer abandons the chat. How should escalation be designed?

A) Treat an explicit request for a human as an immediate escalation trigger, honored regardless of progress
B) Escalate when the customer's sentiment score drops below a calibrated threshold across two consecutive turns
C) Escalate after the agent's self-assessed confidence in resolution falls below 50 percent
D) Escalate once the agent has exhausted its full troubleshooting runbook without resolving the issue

<details>
<summary>Answer & explanation</summary>

**A)** An explicit human request is one of the reliable escalation triggers and must be honored immediately — continuing to troubleshoot past it destroys trust and drives abandonment. Sentiment and self-reported confidence are unreliable proxies, and waiting for runbook exhaustion is exactly the behavior that drove this customer away.

*Hint if stuck: One trigger in this list requires no inference at all — the customer stated it outright.*
</details>

---

## Question 6
An e-commerce support agent looks up a customer's orders for the last 30 days. The order-search tool returns an empty array, the agent's wrapper raises a SearchFailedError, and the agent retries the call five times before telling the customer 'our system is down.' The customer simply placed no orders that month. What is the correct design?

A) Have the agent retry with progressively wider date ranges until at least one order is found
B) The tool should return a structured success with results: [] and a zero count; the agent reports no orders in that window
C) Catch the SearchFailedError and have the agent apologize and escalate to a human after the first failure
D) Add a fallback that queries the data warehouse directly when the order-search tool returns nothing

<details>
<summary>Answer & explanation</summary>

**B)** An empty result set is a valid successful outcome — zero matches — not an error. The wrapper conflating 'no rows' with 'failure' caused phantom retries and a false outage report. Widening the date range fabricates an answer to a question the customer did not ask, and escalating a non-error wastes human time on a working system.

*Hint if stuck: Distinguish 'the search ran and found nothing' from 'the search could not run.'*
</details>

---

## Question 7
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

## Question 8
An insurance claims agent looks up 'Maria Garcia' and the policy-holder tool returns two records with different policy numbers and addresses. The agent silently picks the record with the more recent activity date and quotes a claim status — for the wrong Maria Garcia. What should the agent do instead?

A) Always select the record whose creation date is older, since it is more likely the original account
B) Merge the two records' fields and present a combined view so the agent never has to choose
C) Refuse to proceed and escalate any lookup that returns more than one matching record to a human
D) Ask the customer for an additional identifier — policy number, date of birth, or address — and re-query to disambiguate

<details>
<summary>Answer & explanation</summary>

**D)** Duplicate matches must be disambiguated with additional identifiers before any account-specific action; silently picking by any heuristic guarantees wrong-customer errors. Merging records leaks one customer's data into another's view, and escalating every multi-match is unnecessary overhead when the agent can resolve the ambiguity with one question.

*Hint if stuck: When a key is ambiguous, the fix is to add another key, not pick a favorite.*
</details>

---

## Question 9
In a multi-agent research system, a subagent assigned to gather regulatory filings hits a paywall it cannot bypass and returns only the string 'Task failed.' The coordinator, with no usable information, re-dispatches the identical task three times, failing identically each time. What should the subagent have returned?

A) A structured report: the paywalled source that failed, what was attempted, partial results gathered, and retryability
B) Nothing — it should keep retrying internally until its iteration cap forces termination
C) A confidence score on its partial findings so the coordinator can decide whether they are usable
D) Its full raw session transcript so the coordinator can inspect every step and diagnose the failure itself

<details>
<summary>Answer & explanation</summary>

**A)** Unresolvable failures must propagate with structured context — what failed, what was attempted, partial results, and whether retrying could help — so the coordinator can adapt by trying another source or accepting partial data instead of blind re-dispatch. A bare failure string and a raw transcript both lack actionable structure, and self-reported confidence scores are poorly calibrated.

*Hint if stuck: The coordinator can only recover as intelligently as the failure report allows.*
</details>

---

## Question 10
A fintech document-extraction subagent processing 200 statements hits two failures: a 504 gateway timeout fetching one PDF, and an 'invalid credentials' error from the archival store for twelve older PDFs. It currently propagates both to the coordinator immediately, halting the entire batch. How should each failure be handled?

A) Propagate both immediately — the coordinator owns all error handling and subagents should stay stateless
B) Retry both locally with exponential backoff until they succeed or the iteration cap is reached
C) Retry the 504 locally with backoff; propagate the credentials failure with context, since no retry will fix it
D) Retry the credentials error locally — auth tokens often refresh — and propagate the 504 since timeouts indicate systemic load

<details>
<summary>Answer & explanation</summary>

**C)** Transient errors like gateway timeouts should be recovered locally with retries, while unresolvable errors like invalid credentials must be propagated with context because retrying cannot fix them. The reversed pairing retries an auth failure that no backoff will repair — burning iteration budget and masking a problem only the coordinator or an operator can resolve — while needlessly escalating a one-off timeout.

*Hint if stuck: Sort the two failures by whether a retry could ever change the outcome.*
</details>

---

## Question 11
A SaaS support platform's design review proposes that the agent append a self-assessed confidence score (0-100) to each turn, escalating when confidence drops below 60. Pilots show the agent reporting 85+ confidence while looping on an unresolvable licensing edge case, and 40 on questions it answers correctly. What is the right takeaway?

A) Calibrate the scores post-hoc with a regression layer mapping reported confidence to observed accuracy
B) Self-reported confidence is poorly calibrated; escalate on observable signals like no-progress loops and policy gaps instead
C) Ask for confidence as a categorical (low/medium/high) instead of a number, since models handle categories better
D) Average confidence across the last five turns to smooth out the noise before applying the threshold

<details>
<summary>Answer & explanation</summary>

**B)** Model self-reported confidence is an unreliable escalation trigger because it is poorly calibrated — the pilot demonstrates exactly that, with high confidence during a hopeless loop. Reliable triggers are observable behaviors: no progress across turns, requests outside documented policy, explicit human requests. Calibration layers, smoothing, and rebucketing all keep depending on a signal that does not track reality.

*Hint if stuck: If the underlying signal does not track the truth, transformations of it will not either.*
</details>

---

## Question 12
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

## Question 13
When a payments support agent escalates a suspected-fraud case, it forwards the entire 28k-token conversation transcript to the human fraud queue. Analysts report spending 8-10 minutes reconstructing each case before they can act, and sometimes miss that the agent already froze the card. What should the handoff contain?

A) A structured summary: customer ID, the issue, what was already tried (card frozen), and a recommended action
B) A model-generated narrative paragraph summarizing the conversation, replacing the transcript entirely in the queue
C) Only the last ten turns of the transcript, since the most recent exchanges are most relevant to the analyst
D) The full raw transcript plus an urgency score so analysts can triage which cases to read and act on first

<details>
<summary>Answer & explanation</summary>

**A)** Escalation handoffs should carry a structured summary — customer ID, issue, actions already taken, recommended next action — so the human can act immediately without reconstruction; missing the card freeze is a direct symptom of an unstructured handoff. A freeform narrative loses guaranteed fields, and the last ten turns can omit early actions like the freeze entirely.

*Hint if stuck: The analyst needs specific fields guaranteed present, not more or fewer raw tokens.*
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
An e-commerce refund agent's policy document covers refunds up to $500 with documented approval rules. A customer requests $612 for a damaged appliance; the policy says nothing about amounts above $500. The agent spends nine turns re-reading the policy and asking the customer clarifying questions, making no progress. What should the agent's design dictate here?

A) Deny the refund, since no policy rule authorizes amounts above $500 and the agent must not exceed its mandate
B) Recognize the policy gap as a reliable escalation trigger and hand off promptly with a structured case summary
C) Approve up to the documented $500 cap and tell the customer to file separately for the remaining $112
D) Continue clarifying with the customer until the request can be reframed to fit within an existing policy rule

<details>
<summary>Answer & explanation</summary>

**B)** A request falling outside documented policy is a policy gap — one of the reliable escalation triggers — and the nine-turn no-progress loop is a second reliable trigger pointing the same direction. Denying or partially approving invents policy the agent was never given, and reframing the request manufactures a fit that does not exist.

*Hint if stuck: When the rulebook is silent, the agent's job is not to write a new rule.*
</details>

---
