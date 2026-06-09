# The Anti-Pattern Hunt — printable edition

Twelve production war stories. Exactly one monster of bad architecture lurks in each.
Name it. (The interactive version in the game awards bestiary cards.)

---

## Question 1
A customer support resolution agent at a telco runs an agentic loop around the Messages API. The engineer who built it breaks the loop whenever the assistant's reply text contains the phrase ticket resolved or all done. Last Tuesday the agent wrote 'the refund step is all done, now checking shipping status' alongside a pending tool_use block, and the loop exited with the shipping check never executed. Other sessions run forever because the model phrases completion as 'nothing further is needed'. The history-append and tool-execution code are correct, and stop_reason is returned on every response but never read. Name the monster.

A) Iteration Cap Golem
B) Generic Error Ghost
C) Loop Terminator
D) Prompt Whisperer

<details>
<summary>Answer & explanation</summary>

**C)** Loop Terminator: the loop exits based on prose — breaking 'whenever the assistant's reply text contains the phrase ticket resolved' — instead of checking stop_reason. The API already provides a deterministic signal: tool_use means execute the tool and continue, end_turn means done, and a response can carry text and tool_use blocks together. The Iteration Cap Golem is absent because no counter acts as primary control; the fix is to branch on stop_reason and never parse assistant text for completion.

*Hint if stuck: This monster haunts the place where the agentic loop decides it is finished — ask what signal the API already provides.*
</details>

---

## Question 2
A nightly CI job drives a lint-fixing agent through the Messages API across a monorepo. The orchestration script wraps the model call in for i in range(8) and simply stops after the eighth round trip, regardless of what the API returned. Long fixes were getting abandoned with edits applied to 3 of 7 files, so the team bumped the constant to 20; now short fixes burn budget on dead turns and long ones still die mid-tool-chain. Nowhere in the script is stop_reason consulted — not for end_turn, not for tool_use, not for max_tokens. Which monster is lurking?

A) Iteration Cap Golem
B) Loop Terminator
C) Context Glutton
D) Generic Error Ghost

<details>
<summary>Answer & explanation</summary>

**A)** Iteration Cap Golem: the arbitrary counter is the PRIMARY termination mechanism — 'nowhere in the script is stop_reason consulted'. Caps are legitimate only as safety fallbacks behind a stop_reason-driven loop, which is why tuning the number can never fix it. It is not the Loop Terminator because no assistant prose is being parsed; the fix is to loop while stop_reason is tool_use and keep a generous cap purely as a runaway guard.

*Hint if stuck: Look at which mechanism is the primary controller of loop termination versus what should only be a safety net.*
</details>

---

## Question 3
An e-commerce returns agent has a process_refund tool and a system prompt that says, in bold capitals, NEVER ISSUE A REFUND ABOVE $500 WITHOUT MANAGER APPROVAL. For four months it behaved, then during a 60-turn conversation with a persistent customer it issued a $2,300 refund — the instruction was still in context, just buried. The postmortem proposes stating the rule a second time at the end of the prompt and again inside the tool description. Nothing in the system intercepts the tool call before it executes. Name the monster.

A) Sentiment Siren
B) Iteration Cap Golem
C) The Tool Hoarder
D) Prompt Whisperer

<details>
<summary>Answer & explanation</summary>

**D)** Prompt Whisperer: a critical business rule lives only in a prompt — 'NEVER ISSUE A REFUND ABOVE $500' — and prompt instructions are probabilistic best-effort that degrades in long contexts, hence the $2,300 refund on turn 60. Repeating the rule twice more is just louder whispering at the same broken layer. The fix is a deterministic PreToolUse hook that inspects process_refund arguments and blocks amounts over $500 with exit code 2, feeding the reason back to the model via stderr.

*Hint if stuck: Ask which enforcement mechanism is deterministic code and which is merely probabilistic best-effort.*
</details>

---

## Question 4
A platform team built one do-everything developer assistant and registered 18 tools on it: Jira search, Jira create, Slack post, Slack search, GitHub PR review, calendar booking, deploy status, log query, and ten more. Every description is well-written, yet the agent calls search_jira_issues when it should call search_slack_messages about 20% of the time, and once booked a calendar slot when asked to file a ticket. Time to first token has also crept up as the tool definition block ballooned. Telemetry shows the failures are wrong-tool selection, not bad arguments. Which monster?

A) The Pinhole Planner
B) The Tool Hoarder
C) Generic Error Ghost
D) Context Glutton

<details>
<summary>Answer & explanation</summary>

**B)** The Tool Hoarder: 18 tools on one agent degrades selection even with good descriptions — telemetry confirms 'wrong-tool selection, not bad arguments'. Around 4-5 focused tools per agent role keeps selection reliable, so the fix is to split into role-scoped agents (ticketing, comms, deploys) rather than polishing descriptions further. The Pinhole Planner concerns how a coordinator decomposes tasks, not how many tools one agent carries, and Context Glutton would implicate indiscriminately inlined data — here the bloat is the tool roster itself and the symptom is selection error.

*Hint if stuck: Count what the single agent is carrying and recall the threshold where tool selection quality falls apart.*
</details>

---

## Question 5
A telecom support bot routes conversations to human agents whenever a classifier scores the customer's message as angry or frustrated. The human queue is now flooded with furious-but-trivial cases — 'I HATE THIS ROUTER' password resets the bot could solve in one tool call — while a polite customer with a genuinely tangled double-billing dispute was kept in the bot loop for 47 turns. Explicit requests like 'let me talk to a person' get honored only if the message also sounds upset. Escalation volume has tripled while resolution rates fell. What is the monster?

A) Sentiment Siren
B) Confidence Phantom
C) The Accuracy Mirage
D) Prompt Whisperer

<details>
<summary>Answer & explanation</summary>

**A)** Sentiment Siren: routing on whether a message 'sounds angry or frustrated' conflates emotion with complexity — furious password resets flood humans while the polite double-billing dispute loops for 47 turns. Reliable escalation triggers are explicit human requests honored immediately, policy gaps, no-progress loops, and hard caps exceeded; the fix is replacing the sentiment classifier with those. Confidence Phantom would involve trusting self-reported confidence scores, which never appear in this story.

*Hint if stuck: Recall which escalation triggers are reliable and which popular signal confuses feeling with difficulty.*
</details>

---

## Question 6
A healthcare intake pipeline extracts patient data from scanned forms and asks Claude to append a confidence score from 0 to 100 to each record. Records scoring 90 or above skip human review and flow straight into the EHR. A compliance audit sampled the auto-approved set and found 7% of records with confidence 95 or higher contained a wrong date of birth or a swapped medication dosage, while plenty of low-confidence records were perfectly fine. The team's proposed fix is to raise the auto-approve threshold to 97. Which monster is in the pipeline?

A) The Accuracy Mirage
B) Self-Review Shadow
C) Confidence Phantom
D) Sentiment Siren

<details>
<summary>Answer & explanation</summary>

**C)** Confidence Phantom: the gate trusts self-reported confidence — 'records scoring 90 or above skip human review' — but model confidence is poorly calibrated, which is exactly why 95+ records carry swapped dosages while low scorers are fine. Raising the threshold to 97 keeps trusting the same broken signal. The fix is validation independent of self-assessment: stratified random sampling and per-field checks. The Accuracy Mirage is about aggregate metrics hiding segment failures, and Self-Review Shadow requires a reviewer sharing a generation session's context; a numeric self-score gate is the Phantom's signature.

*Hint if stuck: Think about how well models calibrate the numbers they report about themselves.*
</details>

---

## Question 7
An insurance claims agent assembles every request by inlining the claimant's full 40-field CRM record, the entire 180-page policy manual, every prior ticket from the household, and the complete raw JSON of all earlier tool results in the session. Requests average 150k tokens, costs are running 9x projections, and the model keeps missing the one deductible clause that actually matters, buried around token 80,000. Answer quality is measurably worse than an early prototype that included only the relevant policy chapter. The prompt prefix is stable and caching is configured correctly. Name the monster.

A) Cache Vampire
B) Context Glutton
C) The Pinhole Planner
D) Prompt Whisperer

<details>
<summary>Answer & explanation</summary>

**B)** Context Glutton: the agent inlines 'the full 40-field CRM record, the entire 180-page policy manual, every prior ticket' — indiscriminate stuffing that triggers lost-in-the-middle misses at token 80,000 and 9x cost. The fix is selective context: trim tool outputs to needed fields (a PostToolUse hook works well), retrieve only the relevant policy chapter, and keep a structured case-facts block instead of raw history. The Cache Vampire is explicitly ruled out — 'the prompt prefix is stable and caching is configured correctly' — so this is a volume problem, not an ordering one.

*Hint if stuck: This creature feeds on indiscriminate inclusion — ask what actually needed to be in the context window.*
</details>

---

## Question 8
A GitHub Actions workflow has Claude Code generate a bug fix, then — in the same session, with the full generation history still in context — appends the prompt 'now review the diff you just wrote for security issues'. The reviewer approves 96% of its own diffs, including one that shipped a SQL injection a human caught two days later. When the same diffs are fed to a fresh headless claude -p session instead, it flags real problems in 31% of them. The team cannot understand why the in-session reviewer is so agreeable. Which monster?

A) Loop Terminator
B) Confidence Phantom
C) Iteration Cap Golem
D) Self-Review Shadow

<details>
<summary>Answer & explanation</summary>

**D)** Self-Review Shadow: reviewing 'in the same session, with the full generation history still in context' means the reviewer inherits its own generation reasoning and confirms its own decisions — hence 96% self-approval versus 31% flags from a clean session. Generator and reviewer must be separate sessions, with prior review findings fed back on re-runs to avoid duplicate findings. Confidence Phantom involves trusting numeric self-reported confidence, not a contaminated review context.

*Hint if stuck: Consider what this reviewer can see that an independent reviewer could not.*
</details>

---

## Question 9
An e-commerce agent calls a custom MCP inventory server. Whenever anything goes wrong — SKU not found, warehouse API timeout, malformed date filter — the tool returns the same string: Operation failed. The agent responds by retrying the identical call three times and then telling the customer the item is unavailable, even when the real problem was a transient timeout that a one-second backoff would have cured. Worse, a search that legitimately matches zero SKUs also comes back as Operation failed, so empty shelves get reported as system outages. Name the monster.

A) Generic Error Ghost
B) The Tool Hoarder
C) Loop Terminator
D) Context Glutton

<details>
<summary>Answer & explanation</summary>

**A)** Generic Error Ghost: every failure collapses into the bare string 'Operation failed', so the model cannot tell a retryable timeout from a bad SKU or a malformed filter and resorts to blind identical retries. Structured tool errors — errorCategory, isRetryable, the attempted query, partial results, and suggested alternatives — let the agent recover intelligently. And an empty result set must be returned as a success with zero matches, never as an error.

*Hint if stuck: This monster hides inside what the tool says when things go wrong.*
</details>

---

## Question 10
A fintech extraction service reports a healthy 96.4% field-level accuracy on its loan-document dashboard, and the number has been stable for two quarters. Then a regional bank complains that nearly every handwritten 1980s-era deed they submit comes back with the wrong lien amount. Digging in, the team discovers handwritten deeds are 3% of volume and only 58% accurate, drowned out by millions of clean digital PDFs. No per-document-type breakdown has ever been run; the release gate is the single blended number. Which monster?

A) Confidence Phantom
B) Sentiment Siren
C) The Accuracy Mirage
D) Generic Error Ghost

<details>
<summary>Answer & explanation</summary>

**C)** The Accuracy Mirage: 'the release gate is the single blended number', and 96.4% overall hides handwritten deeds at 58% because they are only 3% of volume. Aggregate accuracy masks per-segment failures; the fix is validating per document type and per field, gating releases on segment-level metrics, and monitoring ongoing quality with stratified random sampling. Confidence Phantom requires trusting self-reported confidence scores, which this pipeline never collects.

*Hint if stuck: One blended number can look healthy while a small slice of traffic quietly drowns.*
</details>

---

## Question 11
A multi-agent research system is asked to assess the competitive landscape for the company's payments product. The Opus coordinator decomposes this into exactly three subagent tasks: scrape competitor A's pricing page, scrape competitor B's pricing page, scrape competitor C's pricing page. The final report arrives fast and is impeccably formatted, but it says nothing about competitor funding rounds, the new entrant that launched last month, regulatory shifts, or hiring signals — precisely what the strategy team needed. Each Haiku subagent executed its narrow task flawlessly and propagated no errors. Name the monster.

A) Context Glutton
B) The Tool Hoarder
C) Self-Review Shadow
D) The Scope Creep

<details>
<summary>Answer & explanation</summary>

**D)** The Scope Creep: the coordinator's decomposition is far too narrow — three variations of 'scrape a pricing page' for a question about an entire competitive landscape — and overly narrow decomposition causes coverage gaps. Every subagent succeeded, so the defect sits in the decomposition step: the coordinator should derive subtasks spanning the question's dimensions (pricing, funding, new entrants, regulation, talent) before delegating. Context Glutton is the opposite failure direction, over-stuffing context rather than under-scoping tasks.

*Hint if stuck: The defect lives in how the coordinator carved up the mission, not in how the workers executed it.*
</details>

---

## Question 12
A legal contract review bot assembles every request in this order: first a header containing the current timestamp, a UUID request ID, and the requesting attorney's name; then the firm's stable 30,000-token clause playbook; then the contract under review. cache_control breakpoints are set right after the playbook, yet the cache hit rate sits at 0% and the monthly bill is double the estimate. The playbook has not changed in six weeks. Time to first token is also far worse than the proof of concept, which happened to send the playbook first. Which monster?

A) Context Glutton
B) Cache Vampire
C) The Accuracy Mirage
D) Iteration Cap Golem

<details>
<summary>Answer & explanation</summary>

**B)** Cache Vampire: the volatile header — 'the current timestamp, a UUID request ID, and the requesting attorney's name' — sits before the stable 30k-token playbook, so the cached prefix never matches and the hit rate is 0%. Prompt caching only pays when stable content forms the prefix: move the playbook first, set the breakpoint after it, and append all per-request material afterward. Context Glutton fails as a diagnosis because the playbook is genuinely needed — the problem is ordering, not volume.

*Hint if stuck: This monster cares about the order of your prompt, not its size.*
</details>

---
