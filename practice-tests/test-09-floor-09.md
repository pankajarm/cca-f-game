# Practice Test 09: The Memory Halls
**D5: Context Management & Reliability** (15% of the exam) · task statements 5.1, 5.2, 5.3

19 questions. Exam pace is 2 minutes per question.

---

## Question 1
A developer-productivity assistant gets its persona, coding standards, and 'never push directly to main' rules injected at the top of every user message, with each request's diff and ticket details following below. In long sessions adherence to the rules degrades, and prompt caching saves almost nothing. How should the prompt be restructured?

A) Keep the rules in the user messages but also repeat them verbatim in a final reminder line at the end of each request
B) Move the per-request diff and ticket details into the system prompt so all content shares one stable location
C) Put the stable persona, standards, and rules in the system prompt and keep only the per-request diff and ticket details in user messages
D) Compress the rules into a one-line summary so repeating them inside every user message costs fewer tokens

<details>
<summary>Answer & explanation</summary>

**C)** The system prompt is the home for stable identity, behavioral rules, and constraints, while user messages carry per-turn data, and that separation also creates the stable prefix prompt caching needs. Repeating rules in every user message duplicates tokens and mixes instructions with data, moving volatile per-request content into the system prompt would destroy the stable prefix entirely, and compressing the rules weakens them without fixing their placement.

*Hint if stuck: Stable instructions and volatile data each have a proper home in the request structure.*
</details>

---

## Question 2
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

## Question 3
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

## Question 4
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

## Question 5
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

## Question 6
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

## Question 7
A support resolution agent for an electronics retailer handles long multi-issue conversations, with the platform progressively summarizing older turns to control context size. After several summarization passes, the agent quoted a customer an RMA number and a refund amount of $214.50 that were both slightly wrong — even though both appeared correctly back in turn 12. What is the best fix?

A) Stop summarizing conversations entirely and let each one run until the context window fills, forcing the platform to open a new session
B) Prompt the summarizer to preserve all numbers, identifiers, and dollar amounts exactly as originally written when condensing the older turns
C) Summarize less aggressively — keep the most recent 100 turns verbatim and only condense the conversation history beyond that point
D) Keep a structured case-facts block (order ids, RMA numbers, amounts, commitments) outside the summarized history, always included verbatim

<details>
<summary>Answer & explanation</summary>

**D)** Progressive summarization is lossy by nature and each pass further erodes exact identifiers and figures, so load-bearing facts must live in a structured block that never enters the compressor. Prompting the summarizer to be careful cannot make lossy compression lossless, summarizing later only delays the same erosion, and never summarizing trades drift for hard context exhaustion.

*Hint if stuck: Lossy compression plus a be-careful instruction is still lossy — decide what should never enter the compressor at all.*
</details>

---

## Question 8
A multi-agent due-diligence system has its coordinator spawn eight research subagents, each returning two to three paragraphs of prose findings. The coordinator's merged brief keeps dropping specific figures and attributing facts to the wrong company. What is the root-cause fix?

A) Define a structured schema for subagent returns — entity, claim, source, date, confidence — so the coordinator aggregates typed records
B) Increase the coordinator's extended-thinking budget so it reasons more carefully when reconciling the eight overlapping prose summaries
C) Reduce the fan-out from eight subagents down to four so the coordinator has fewer overlapping prose summaries it needs to reconcile
D) Require each subagent to end its prose findings with a bulleted recap listing its key figures and the company names they belong to

<details>
<summary>Answer & explanation</summary>

**A)** Coordinators aggregate reliably when subagent results arrive as structured, typed records; free prose forces the coordinator to re-extract facts, which is exactly where figures get dropped and attributions get crossed. More thinking budget patches the symptom while leaving the lossy interface in place, fewer subagents risks coverage gaps, and a recap is still unstructured text with the same parsing risk.

*Hint if stuck: Look at the interface between subagents and coordinator — what return format makes aggregation lossless?*
</details>

---

## Question 9
A support agent handles 60-turn sessions and uses progressive summarization to control context growth. In a recent case the agent confirmed order #88412 and a $63.20 refund early in the conversation; after two summarization passes it told the customer the refund was "around $60" and asked for the order number again. What is the right fix?

A) Run summarization less frequently and double the summary token budget so numeric details survive more compression passes before they drift
B) Maintain a structured case-facts block (order ID, amounts, commitments) outside the summarized history, pinned where the agent always sees it
C) Instruct the summarizer prompt to always preserve all numbers exactly, and validate each summary with a regex check for currency amounts
D) Switch the session to a larger-context model so summarization becomes unnecessary until the conversation passes roughly 200 turns

<details>
<summary>Answer & explanation</summary>

**B)** Progressive summarization erodes exact figures by design — every pass paraphrases — so the durable fix is a structured case-facts block kept outside the summarized history entirely. Tuning summary frequency or prompting "preserve all numbers" still routes critical facts through lossy compression and merely delays the failure. A bigger context window postpones the problem and ignores the fact that long sessions degrade regardless of window size.

*Hint if stuck: Some facts should never travel through a lossy compression step at all.*
</details>

---

## Question 10
An SRE team's observability MCP server returns 40-plus fields per query, including raw spans and verbose metadata, though incident-triage workflows in Claude Code only ever use five of them. After about 30 minutes of triage, sessions start missing findings they surfaced earlier. What is the architectural fix?

A) Add a system-prompt line instructing Claude to ignore the irrelevant fields whenever it reads tool results
B) Have incident responders run /compact every few minutes during triage to keep the context window small
C) Add a PostToolUse hook that trims each tool result down to the five needed fields before it enters context
D) Move triage sessions to a model with a much larger context window so the verbose results all fit

<details>
<summary>Answer & explanation</summary>

**C)** PostToolUse hooks are the right place to normalize and trim verbose tool outputs, so the noise never enters context and long-session degradation stops at the source. A prompt instruction does not stop unused fields from consuming context, frequent /compact lossily summarizes the symptom instead of removing the cause, and a larger window still suffers lost-in-the-middle on a bloated history.

*Hint if stuck: Stop the bloat deterministically at the moment a tool result enters the conversation.*
</details>

---

## Question 11
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

## Question 12
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

## Question 13
An insurance claims agent looks up 'Maria Garcia' and the policy-holder tool returns two records with different policy numbers and addresses. The agent silently picks the record with the more recent activity date and quotes a claim status — for the wrong Maria Garcia. What should the agent do instead?

A) Always select the record whose creation date is older, since it is more likely the original account
B) Merge the two records' fields and present a combined view so the agent never has to choose
C) Refuse to proceed and escalate any lookup that returns more than one matching record to a human agent for manual resolution
D) Ask the customer for an additional identifier — policy number, date of birth, or address — and re-query to disambiguate

<details>
<summary>Answer & explanation</summary>

**D)** Duplicate matches must be disambiguated with additional identifiers before any account-specific action; silently picking by any heuristic guarantees wrong-customer errors. Merging records leaks one customer's data into another's view, and escalating every multi-match is unnecessary overhead when the agent can resolve the ambiguity with one question.

*Hint if stuck: When a key is ambiguous, the fix is to add another key, not pick a favorite.*
</details>

---

## Question 14
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

## Question 16
In a 10-scout market-research swarm, the scout covering Latin America hits a rate-limited API on its first call and immediately returns the single word 'failed'. The coordinator drops that segment, and the published report silently omits an entire region. How should scout failure handling be designed?

A) On any scout failure, the coordinator should restart the entire 10-scout pipeline from scratch
B) Prompt the synthesizer to add a disclaimer listing any regions that appear to be missing from the data the scouts returned to it
C) Scouts retry transient errors locally and propagate only unresolvable failures, with what was attempted and any partial results
D) Scouts should raise failures directly to the end user the moment any API call errors

<details>
<summary>Answer & explanation</summary>

**C)** The reliability rule for subagents is recover locally, propagate with context: a rate limit is transient and should be retried inside the scout, and a genuinely unresolvable failure must reach the coordinator as a structured report — what failed, what was tried, partial results — so the hub can reassign or flag the gap instead of silently dropping it. Restarting all 10 scouts wastes nine successful runs, a disclaimer still ships a report missing a region, and surfacing every transient API error to the end user defeats delegation.

*Hint if stuck: Recall which errors a subagent should absorb and what an unrecoverable one must carry upward.*
</details>

---

## Question 17
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

## Question 18
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

## Question 19
A research coordinator's document-analysis subagent could not reach 2 of 9 sources (both paywalled) and returned findings from the other 7. The final report reads as complete, and a reviewer later finds that one whole subtopic relied only on the missing sources. What should change?

A) Have the subagent return structured error context for the failed sources, and have synthesis annotate which topic areas have gaps because of them
B) Stop the whole report whenever any source fails
C) Have the subagent retry the paywalled sources until they succeed
D) Leave the missing sources out silently, since 7 of 9 is good coverage

<details>
<summary>Answer & explanation</summary>

**A)** Errors should travel upward as structured context, and the synthesis should mark which findings are well supported and which areas have gaps. Stopping everything over one failure, retrying a permission failure indefinitely, and silently dropping the failures are all anti-patterns.

*Hint if stuck: The reader needs to know what's missing.*
</details>

---
