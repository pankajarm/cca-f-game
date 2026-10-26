# Full Practice Exam 01 — CCAR-F simulation

Same format as the real exam guide: **60 questions, 120 minutes, scaled score out of 1000,
pass at 720.** Domain weighting: D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.
No question here appears in the other 2 printable exams.

Set a timer. No notes, no docs. For the interactive version with the clock, flags, and a score report, open the game.

---

## Question 1
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

## Question 2
An insurance claims pipeline extracts fields from faxed forms using a tool_use schema where policy_number is a required string. When a fax is missing the policy number, about 1 in 30, the model fills in a realistic-looking but invented value, which downstream systems then attempt to look up and fail on. What is the root-cause fix?

A) Add a prompt warning: 'Never fabricate a policy number; write UNKNOWN if it is absent from the document'
B) Add a post-extraction validator that checks each policy number against the policy database and discards misses
C) Change policy_number to type ['string','null'] so the schema itself gives the model a way to report absence
D) Add few-shot examples of faxes that do include policy numbers so extraction of the field becomes more reliable

<details>
<summary>Answer & explanation</summary>

**C)** A required field forces the model to produce a value even when none exists, which is exactly what drives fabrication; making the field nullable gives the model a legitimate way to say not present. A prompt warning is a probabilistic patch over a schema that still demands a value, database validation catches fabrications after the fact instead of preventing them, and examples of present values do nothing for absent ones.

*Hint if stuck: When the schema demands a value the document may not contain, the schema is the problem.*
</details>

---

## Question 3
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

## Question 4
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

## Question 5
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

## Question 6
An insurance claims extraction pipeline must begin every conversation by calling fetch_claim_document, and on multi-page claims the agent later needs fetch_supporting_exhibits before emitting the final extraction. The team set tool_choice to {"type": "tool", "name": "fetch_claim_document"} on every request, and now the agent fetches the same document repeatedly and never finishes. What is the fix?

A) Switch every request to tool_choice "any" so the model can choose freely among all the tools
B) Keep the forced setting but add a prompt instruction telling the model to fetch each document only once
C) Force the tool on the first request only, then send all follow-up requests with tool_choice "auto"
D) Switch to tool_choice "none" after the first call so the model is pushed straight to the extraction

<details>
<summary>Answer & explanation</summary>

**C)** Forcing a specific tool applies to every turn it is sent on, so the model can never do anything except call fetch_claim_document. The force-then-relax pattern guarantees the required first call and then returns control to the model under auto. The "any" distractor still mandates some tool call on every turn, so the model can never finish with a final response, and "none" on all follow-ups would block the legitimate fetch_supporting_exhibits calls multi-page claims require.

*Hint if stuck: A forced tool constrains every turn it applies to — figure out which turn actually needs the constraint.*
</details>

---

## Question 7
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

## Question 8
A CI workflow has Claude Code generate a payment-reconciliation module, then prompts in the same session: 'Now critically review the code you just wrote for bugs.' The review almost always concludes the implementation looks correct, yet QA keeps finding logic errors in the merged code. Which change most improves bug detection?

A) Strengthen the review prompt to 'act as a hostile senior reviewer and assume the code is broken until proven otherwise'
B) Repeat the same-session review three times and take the union of all findings to compensate for individual misses
C) Run the review in a separate session whose context contains only the diff, not the generation conversation
D) Enable extended thinking on the same-session review so the model reasons more deeply before approving the code

<details>
<summary>Answer & explanation</summary>

**C)** Same-session self-review keeps the generation reasoning in context, so the model tends to confirm the decisions it just made; an independent reviewer session sees only the artifact and evaluates it fresh. Harsher prompts and extended thinking still operate on top of the biased context, and repeating a biased review three times unions the same blind spots.

*Hint if stuck: Consider what the reviewer already believes when its context contains the reasoning that produced the code.*
</details>

---

## Question 9
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
After fighting attention dilution, a monorepo team redesigned its CI review so each file in a PR gets its own headless claude -p pass. Per-file bug detection improved sharply, but last week the pipeline approved a PR in which api-client.ts called an endpoint whose request shape had changed in routes.ts — each file was internally consistent on its own. What fixes the architecture?

A) Return to a single pass over all files at once, since only one shared context can observe relationships between the changed files in the PR
B) Enlarge each per-file pass so its prompt also includes the complete diff of every other file in the PR for reference
C) Keep the per-file passes and add a final integration pass that checks cross-file contracts like call sites against changed signatures
D) Require each per-file pass to emit an approval confidence score and block the merge whenever any file scores below 0.8

<details>
<summary>Answer & explanation</summary>

**C)** Per-file passes maximize depth on local defects but are structurally blind to inter-file contracts, so the complement is a dedicated integration pass scoped to cross-file interactions. Reverting to one giant pass reintroduces the original attention dilution, stuffing every other diff into each per-file pass recreates that dilution per pass, and self-reported confidence scores are poorly calibrated and cannot reveal defects the pass never saw.

*Hint if stuck: Each review pass can only find defects that are visible within its own scope.*
</details>

---

## Question 12
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

## Question 13
An engineer must rename a core payment abstraction across 23 files in 4 packages, and there are two defensible strategies: an adapter layer versus an in-place rewrite. On a similar task last month, Claude started editing immediately, switched strategies midway, and left half-converted files. A teammate suggests simply bolting on a strict reviewer pass to catch the mess afterwards. What workflow should the engineer use?

A) Use plan mode to settle the strategy before edits begin, then verify with a review pass in a separate session
B) Skip planning and invest in a stronger multi-pass reviewer that is prompted to hunt for half-converted files
C) Execute directly but cap Claude at editing five files per session so any strategy switch has a contained blast radius
D) Adopt plan mode as the team default for all future tasks, including one-line typo fixes, to be safe

<details>
<summary>Answer & explanation</summary>

**A)** Multi-file architectural work with multiple valid approaches is exactly what plan mode is for — agreeing on the strategy up front prevents the mid-stream pivot, while a separate-session review still catches residual defects. A review-only workflow patches the symptom of a missing plan after damage is done, arbitrary file caps fragment the refactor without fixing strategy drift, and forcing plan mode onto obvious single-file fixes is overcorrection.

*Hint if stuck: Decide which failure should be prevented before edits begin versus merely caught afterwards.*
</details>

---

## Question 14
A healthcare intake pipeline extracts discharge_date from referral packets, and the validator requires the field. About 12% of packets are outpatient referrals that contain no discharge date at all; for those, the retry-with-feedback loop burns all five attempts, and the model sometimes fabricates a plausible date on attempt four or five just to satisfy the validator. What is the root-cause fix?

A) Make discharge_date nullable and accept null as a valid result when the source omits it
B) Add a 'do not invent dates that are not present in the document' warning to the system prompt and keep the field required
C) Reduce the retry limit from five attempts to two so fewer tokens are wasted and fabrication gets fewer chances
D) Route every packet that exhausts its five retries into a human review queue for manual data entry

<details>
<summary>Answer & explanation</summary>

**A)** When the information is genuinely absent from the source, no number of retries can produce it, and a required field pressures the model toward fabrication. A nullable schema field fixes the root cause by making absence a legitimate, terminal answer. The prompt warning is a probabilistic patch on a deterministic schema flaw, fewer retries just fails faster, and human routing turns a design defect into a permanent operational expense for 12% of volume.

*Hint if stuck: Ask whether any retry could ever succeed when the source document simply does not contain the value.*
</details>

---

## Question 15
A fintech compliance pipeline must file a regulator-facing report by 9:00 AM daily. It submits the day's transactions as a Message Batch at 6:00 PM the prior evening; results usually land by midnight, but twice this month they arrived after 9:00 AM and the filing was late. Which redesign aligns the pipeline with the Batch API's actual guarantees?

A) Poll the batch status every 30 seconds instead of every 10 minutes so results are fetched the instant processing finishes
B) Split the nightly submission into four smaller batches, on the theory that smaller batches finish faster than one large one
C) Open a support ticket asking Anthropic to enable a priority processing tier for this regulated nightly workload
D) Schedule submission so the entire 24-hour window ends before 9:00 AM, with a synchronous fallback at a set cutoff

<details>
<summary>Answer & explanation</summary>

**D)** The only timing guarantee batch offers is completion within 24 hours — typical midnight turnarounds are an observation, not a contract. A deadline-bound pipeline must fit the full 24-hour window inside its SLA and keep a synchronous escape hatch for stragglers. Faster polling only retrieves results sooner once they exist, batch size buys no latency guarantee, and no priority batch tier exists to request.

*Hint if stuck: Design around the only completion guarantee the Batch API actually makes, not its typical turnaround time.*
</details>

---

## Question 16
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

## Question 17
A developer is prototyping a personal MCP server for their note-taking app and wants it available in every repository they open on their laptop, without teammates ever seeing it in any shared project. Where should it be configured?

A) Register the server at user scope in ~/.claude.json
B) Add it to each repository's .mcp.json and ask teammates to ignore the extra server
C) Add it at local scope inside the main repository the developer works in
D) Put the server launch command in the project settings.json env block

<details>
<summary>Answer & explanation</summary>

**A)** User scope in ~/.claude.json is for personal and experimental servers and applies across all of the developer's projects without touching anything version-controlled. Project .mcp.json is committed and would surface the server to the whole team. Local scope is the strongest distractor, but it is project-personal — it would cover only one repository, not every repo the developer opens. The settings.json env block holds environment variables, not MCP server registrations.

*Hint if stuck: Match the scope to who should see the server and how many projects it should cover.*
</details>

---

## Question 18
An invoice extraction agent calls a lookup_vendor tool to match extracted names against the vendor master database. When a vendor is missing, the tool returns the bare string "Operation failed", and the agent retries the identical lookup five times before abandoning the whole document. New vendors appear daily, so a missing match is a routine outcome. What should change?

A) Return zero-match lookups as successes with an empty result set, and reserve errors for real failures with errorCategory, isRetryable, the attempted query, and alternatives
B) Add a system prompt rule that the agent may retry any failing tool at most once, and treat "Operation failed" as a signal to leave the vendor field blank
C) Wrap lookup_vendor in a PreToolUse hook that caches recent failures and blocks any repeat call carrying the same arguments within a single session
D) Have the tool raise a typed VendorNotFound exception so the SDK surfaces a full stack trace the model can read and reason about before retrying

<details>
<summary>Answer & explanation</summary>

**A)** An empty result set is a success with zero matches, not an error — returning it as a failure tells the model something went wrong and invites pointless retries. Genuine failures need structured errors (errorCategory, isRetryable, the attempted query, suggested alternatives) so the model can act intelligently instead of guessing. The hook-based retry blocker suppresses the symptom while the tool keeps misreporting what actually happened, and a stack trace still frames a routine outcome as a failure.

*Hint if stuck: Consider whether "no match found" is actually an error from the tool's point of view.*
</details>

---

## Question 19
A docs team ships an MCP server whose tool search_product_docs is described only as "Searches data." When users ask product questions in Claude Code, the model keeps running Grep across a stale local docs/ folder instead of calling the MCP tool. What is the root-cause fix?

A) Add a permissions deny rule for Grep so the model is forced to fall back to the MCP tool
B) Rewrite the description to name the corpus it searches, its query format, and when to prefer it over built-in file search
C) Add a CLAUDE.md instruction saying to always use search_product_docs for documentation questions instead of the built-in Grep
D) Move the server from user scope to project scope so its tools rank higher during selection

<details>
<summary>Answer & explanation</summary>

**B)** A vague MCP description gives the model no reason to prefer an unfamiliar tool, so it falls back to the familiar built-in Grep; a specific description stating purpose, corpus, query format, and when to use it over built-ins fixes selection at the source. Denying Grep breaks every legitimate code-search use, the CLAUDE.md rule is a probabilistic patch on top of an uninformative tool, and config scope controls visibility and sharing, not selection ranking.

*Hint if stuck: When a custom tool loses to a familiar built-in, ask what the model actually knows about each one.*
</details>

---

## Question 20
A claude-code-action review handles the team's typical 300-line PRs well, but on a 4,800-line vendored-library upgrade it produced detailed comments on the first dozen files, skimmed the remaining forty with one-line notes, and closed with a normal wrap-up well under its output limit — missing a known injection bug in file 38. What should the team change?

A) Split large PRs into multiple review passes, one per module, and aggregate the findings
B) Switch the review to Opus with a maximum thinking budget so a single pass can cover everything
C) Prompt the reviewer to "give equal attention to every file regardless of its position in the diff"
D) Raise the action's maximum output tokens so the review is not truncated partway through the files

<details>
<summary>Answer & explanation</summary>

**A)** A single pass over a 4,800-line diff dilutes attention, and material deep in the context gets skimmed or missed — the lost-in-the-middle failure mode. Multi-pass review keeps each chunk within a size the model handles reliably and aggregates the results. The review finished normally under its output limit, so truncation is not the cause; a bigger model or thinking budget does not fix attention dilution, and an "equal attention" instruction is a best-effort wish, not a mechanism.

*Hint if stuck: When one context has to cover too much material, divide the work instead of exhorting the model.*
</details>

---

## Question 21
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

## Question 22
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

## Question 23
An internal code-generation agent for a monorepo executes a read_file tool and appends the result to history as a new assistant-role message containing the tool_result block. The next API call fails with a 400 validation error about tool_result placement. Where does the tool_result belong?

A) Inside the same assistant message that contained the tool_use block, placed directly after it
B) In a new user-role message immediately following the assistant message whose tool_use it answers
C) In the system prompt as a transient context block that gets replaced on every iteration
D) In a dedicated top-level tool_results request parameter, kept separate from the messages array

<details>
<summary>Answer & explanation</summary>

**B)** The protocol alternates roles: the model's tool_use arrives in an assistant message, and your application replies with the result in a user message — from the API's perspective, tool output is input that you provide. There is no top-level tool_results parameter, results never live inside assistant messages or the system prompt, and everything flows through the messages array.

*Hint if stuck: Tool output is something your application tells the model — consider which conversation role that maps to.*
</details>

---

## Question 24
A support agent handles clear requests well, but ambiguous ones like 'where's my money?', which could be a refund status check or a billing dispute, are routed inconsistently between check_refund_status and open_billing_dispute. What is the most effective improvement?

A) Add twenty clear-cut examples for each tool
B) Add a keyword router in front of the agent that picks the tool based on terms like refund, charge, or transfer in the request
C) Merge the two tools into one handle_money_question tool
D) Add two to four examples of ambiguous requests, each showing which tool was chosen and why the other was not

<details>
<summary>Answer & explanation</summary>

**D)** Few-shot examples work best when they target the ambiguous cases and show the reasoning for one choice over a plausible alternative, which lets the model generalise its judgement. Many clear-cut examples don't cover the hard cases, a keyword router bypasses the model's understanding, and merging tools just hides the decision.

*Hint if stuck: Teach the hard cases, with the reasoning.*
</details>

---

## Question 25
A travel-booking support agent exposes search_bookings, described as "Look up customer records," and search_refund_requests, described as "Look up customer requests." In 14% of billing conversations the agent calls search_bookings when it actually needs refund status. What is the most effective fix?

A) Add a keyword-based pre-classifier that picks the right tool before the model sees the conversation
B) Add a system prompt rule: for any message that mentions refunds, always call search_refund_requests
C) Rewrite each description to state the tool's purpose, input format, and when to use it instead of its sibling
D) Force tool_choice to search_refund_requests whenever the conversation is tagged as a billing issue

<details>
<summary>Answer & explanation</summary>

**C)** Tool descriptions are the model's primary selection mechanism, and these two are near-identical, so the model has no signal to distinguish them. Differentiating the descriptions fixes the root cause for every conversation type. A pre-classifier or forced tool_choice patches around the symptom and breaks on mixed-intent conversations, and keyword prompt rules are brittle.

*Hint if stuck: Ask what information the model actually reads when it decides between two sibling tools.*
</details>

---

## Question 26
Your fintech extraction service uses a tool_use definition with a detailed JSON schema to pull line items and totals from vendor invoices. Every response parses cleanly against the schema, yet on 6 percent of invoices the extracted line-item amounts do not add up to the extracted invoice total. What does this indicate?

A) The schema is underspecified; adding minimum and maximum constraints on the amount fields will bring the sums into alignment
B) The schema guarantees syntactic compliance only, so semantic checks like sum validation must run as a separate programmatic step
C) tool_choice should be set to any so the model is forced to use the extraction tool on every invoice it processes
D) The schema's field descriptions are too short; expanding them will make the extracted values arithmetically consistent

<details>
<summary>Answer & explanation</summary>

**B)** A tool_use JSON schema guarantees the output's structure, not the correctness of its values, and JSON Schema cannot express cross-field arithmetic like line items summing to a total. The root-cause fix is programmatic semantic validation downstream; numeric bounds and longer descriptions cannot enforce arithmetic consistency, and tool_choice changes when tools are called, not whether values are right.

*Hint if stuck: Separate what a schema can promise about shape from what it can promise about meaning.*
</details>

---

## Question 27
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

## Question 28
In a multi-agent research system, the analysis subagent has two tools: analyze_content ('Analyzes content and returns insights') and analyze_document ('Analyzes a document and returns insights'). Web search results are frequently routed to analyze_document, which expects a PDF and returns poor output. What is the most effective fix?

A) Rename analyze_content to extract_web_results and rewrite its description to say it handles web search results, with its inputs and when to use it instead of analyze_document
B) Add a system prompt line telling the agent to prefer analyze_content
C) Lower the temperature so tool selection becomes more deterministic
D) Remove analyze_content so every input goes through analyze_document

<details>
<summary>Answer & explanation</summary>

**A)** The two tools are near-identical in name and description, so the model has nothing to tell them apart. Renaming and rewriting the description removes the overlap at its source. A system-prompt nudge is a workaround that can misfire, temperature does not create missing information, and deleting a tool removes needed functionality.

*Hint if stuck: If two tools read the same, the model will guess.*
</details>

---

## Question 29
A fintech extraction agent's query_transactions tool returns the string "Operation failed" whenever the data warehouse times out. The model retries the identical query four times, burns its remaining turns, and gives up without producing output. How should the tool be redesigned?

A) Cap the agentic loop at three iterations so failed retries terminate the run quickly
B) Add a system prompt instruction telling the model to vary its query whenever any tool fails
C) Catch the timeout in the tool and raise an exception so the agentic loop ends immediately and a human on call is paged to investigate
D) Return a structured error with errorCategory timeout, an isRetryable flag, the attempted query, and any partial results

<details>
<summary>Answer & explanation</summary>

**D)** A bare "Operation failed" gives the model nothing to reason with, so it repeats the same call. A structured error stating the category, retryability, the query attempted, and partial results lets the model choose an informed next action. Iteration caps are safety fallbacks, not a primary control, paging a human on every transient timeout abandons recoverable work, and a generic prompt instruction cannot tell the model whether this specific failure is worth retrying.

*Hint if stuck: A tool error should hand the model enough information to choose its next move.*
</details>

---

## Question 30
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

## Question 31
A code-generation session in Claude Code keeps ending turns with edits in place but the test suite never run, despite a CLAUDE.md rule saying 'always run the tests before finishing.' The team wants a guarantee that no turn completes after file edits without a test run. What is the right mechanism?

A) Move the rule to the top of CLAUDE.md and rephrase it as a hard, non-negotiable requirement
B) Add a Stop hook that checks whether tests ran after the last edit and blocks completion with feedback telling the model to run them
C) Add a PostToolUse hook on Edit that runs the full test suite after every single file modification, so tests run even for one-line changes
D) Set a minimum iteration count so the session cannot end before a fixed number of tool calls

<details>
<summary>Answer & explanation</summary>

**B)** Stop hooks fire when the agent attempts to finish its turn and can deterministically block completion, feeding the reason back so the model runs the tests. The PostToolUse distractor is deterministic but enforces at the wrong granularity: it runs the whole suite after every one of possibly dozens of edits, burning time and failing spuriously on intentionally incomplete intermediate states mid-refactor, when the requirement only concerns the state at turn completion. Stronger prompt wording remains probabilistic, and iteration counts are safety fallbacks, not behavioral guarantees.

*Hint if stuck: There is a hook event that fires at the moment the agent tries to finish its turn.*
</details>

---

## Question 32
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

## Question 33
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

## Question 34
A fintech document-extraction service runs an agentic loop against the Claude API. After executing a lookup_exchange_rate tool, the developer appends a user message containing the tool_result and calls the API again — and the request fails with a 400 error saying the tool_result references an unknown tool_use id. What is wrong?

A) The assistant message containing the tool_use block was never appended to history, so the tool_result has no preceding call to match
B) The tool_result block must be wrapped in an assistant-role message rather than a user-role message, otherwise the API cannot perform the id matching
C) The follow-up request must set tool_choice to any so the API can correlate the returned result with the originating call
D) The tool_result content must be stringified JSON, because structured content blocks cannot be matched against a tool_use id

<details>
<summary>Answer & explanation</summary>

**A)** Every tool_result must reference a tool_use block in the immediately preceding assistant message, so the loop has to append the full assistant response (including its tool_use blocks) and then a user message carrying the tool_result before resending the complete history. The assistant-role distractor inverts the protocol — tool_results belong in user messages because tool output is input you provide — and tool_choice and content formatting have nothing to do with id matching.

*Hint if stuck: A tool_result can only be matched against a tool_use block that actually exists in the history you send back.*
</details>

---

## Question 35
A six-engineer research swarm team uses an internal papers-search MCP server. Each engineer configured it by hand in ~/.claude.json, the nightly CI runner has no MCP config at all, and one teammate just pasted the literal API token into a draft .mcp.json to share it. What is the correct way to share this server across the team and CI?

A) Commit each engineer's ~/.claude.json into the repository so the CI runner and new teammates inherit identical MCP server settings automatically
B) Use local scope for the server in every clone, and circulate the API token through the team password manager for each person to enter manually
C) Check a project-scope .mcp.json into the repository with the token referenced via ${ENV_VAR} expansion, supplied separately by each environment
D) Keep the user-scope configs but add a SessionStart hook that downloads the latest server definition and current token from an internal wiki page

<details>
<summary>Answer & explanation</summary>

**C)** Project-scope .mcp.json is the version-controlled, team-shared configuration surface, and ${ENV_VAR} expansion keeps secrets out of the repo while letting laptops and the CI runner each supply their own token. User scope (~/.claude.json) is for personal experimentation and is never committed, local scope is deliberately project-personal and uncommitted, and pulling a live token from a wiki page is both fragile and a secrets-handling violation.

*Hint if stuck: Match each MCP config scope to its intended audience, and remember what must never be committed as a literal value.*
</details>

---

## Question 36
A CI job asks Claude Code to generate unit tests for the files changed in each PR. Within a month the suite contains over 60 tests that duplicate existing coverage almost verbatim — same fixtures, same assertions — and CI time has doubled. What fixes the root cause?

A) Add "do not write tests that already exist" to the generation prompt
B) Include the package's existing test files in the job's context so generation targets uncovered gaps
C) Run a post-generation script that deletes any new test whose name matches an existing test in the package
D) Cap the job at five new tests per PR to limit how fast duplication can accumulate

<details>
<summary>Answer & explanation</summary>

**B)** The model cannot avoid duplicating tests it has never seen — the root cause is missing context, not a missing instruction. Providing the existing tests lets generation target genuine coverage gaps. The prompt rule is unenforceable without that visibility, name-matching deletion misses duplicates with different names, and a cap only slows the bloat.

*Hint if stuck: An instruction is useless if the model lacks the information needed to follow it.*
</details>

---

## Question 37
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

## Question 38
A support resolution agent built with the Claude Agent SDK has an issue_refund tool. The system prompt says refunds over $200 require human approval, yet last week it refunded $450 unprompted. Separately, transcripts show that when customers type "let me talk to a person," the agent keeps troubleshooting for several more turns. Which combination fixes both failures at the root?

A) Move the $200 limit to the very top of the system prompt in emphatic language, and add a sentiment classifier that escalates whenever customer frustration crosses a threshold
B) Add a PostToolUse hook that detects refunds over $200 after they execute and files a reversal ticket, and prompt the agent to weigh its own confidence before escalating
C) Lower the model temperature so the refund policy is followed more consistently, and add few-shot example transcripts demonstrating graceful handoffs to a human agent
D) Add a PreToolUse hook that blocks issue_refund calls over $200 via exit code 2, and treat an explicit human request as an immediate escalation trigger

<details>
<summary>Answer & explanation</summary>

**D)** Critical business rules like refund caps belong in deterministic PreToolUse hooks, which gate the call before it executes and feed the blocking reason back to the model — prompts are probabilistic and will eventually be ignored. Explicit human requests are a reliable escalation trigger that must be honored immediately, while sentiment is unreliable because sentiment does not equal complexity. The PostToolUse option fails because it cleans up after the violating refund has already gone through.

*Hint if stuck: One enforcement mechanism here is a guarantee and one is best-effort — and recall which escalation triggers are considered reliable.*
</details>

---

## Question 39
A release engineer adds a GitHub Actions step that should have Claude Code turn the merged commits into release notes. She tries CLAUDE_HEADLESS=true claude "summarize the commits" and the job hangs waiting for an interactive terminal until the runner times out. Which invocation actually runs Claude Code non-interactively in CI?

A) claude -p "Summarize the merged commits into release notes"
B) claude --headless "Summarize the merged commits into release notes"
C) claude --batch "Summarize the merged commits into release notes"
D) Set CI=true so Claude Code detects the pipeline and disables interactive mode itself

<details>
<summary>Answer & explanation</summary>

**A)** claude -p is the headless print mode: it executes the prompt non-interactively, prints the result, and exits — the supported pattern for CI pipelines. --headless, --batch, and CLAUDE_HEADLESS-style environment variables are not real Claude Code interfaces, and there is no CI auto-detection that substitutes for -p.

*Hint if stuck: Exactly one real flag puts Claude Code into print-and-exit mode; the others are invented.*
</details>

---

## Question 40
An e-commerce team has finalized a new extraction prompt for product attributes and plans to submit all 10,000 legacy listings as a single Message Batch tonight. The prompt has only been eyeballed against two listings. A teammate objects to the plan. What should the team do before committing the full batch?

A) Submit the full batch now — at the 50% discount, even a flawed run only costs as much as half a synchronous run
B) Run a small synchronous pilot of around 50 representative listings, validate the outputs, then submit the full batch
C) Submit the 10,000 listings as ten sequential batches of 1,000, checking each batch's results before sending the next
D) Add a system-prompt instruction asking the model to double-check its own work, then submit all 10,000 tonight

<details>
<summary>Answer & explanation</summary>

**B)** A small synchronous pilot gives immediate feedback on prompt quality before committing 10,000 jobs to a channel with no latency SLA. The staged sub-batch plan is the strongest distractor, but it still burns 1,000 unvalidated jobs on the first stage and waits up to 24 hours per checkpoint; the discount makes a bad run cheaper, not free, and a self-check instruction cannot validate outputs the team has never inspected.

*Hint if stuck: Compare how quickly each plan would reveal that the prompt is broken.*
</details>

---

## Question 41
A retail-banking assistant already carries 17 tools, and the product team wants to add 2 more for mortgage pre-qualification. Wrong-tool selection is already measurably rising. What should the architect recommend?

A) Add the two tools but write extra-detailed descriptions for all 19 so they stay distinguishable to the model at selection time
B) Split the assistant into focused agents — accounts, cards, mortgage — each carrying 4-5 tools behind a coordinator
C) Add the tools but prefix every tool name with its category, such as mortgage_check_rate
D) Add a decision tree to the system prompt that maps each request type to exactly one tool

<details>
<summary>Answer & explanation</summary>

**B)** Beyond roughly 15 tools, selection quality degrades no matter how well each tool is described, so the fix is structural: role-focused agents with 4-5 tools each. Better descriptions are the strongest distractor because descriptions are normally the first lever, but they cannot rescue a 19-tool decision space that is already failing. Name prefixes and prompt decision trees are surface conventions that leave all 19 candidates in play on every turn.

*Hint if stuck: Past a certain tool count, better wording stops compensating — think about what actually shrinks the decision space.*
</details>

---

## Question 42
A fintech reconciliation pipeline extracts invoice line items with tool_use against a detailed JSON schema. Every output validates against the schema, yet auditors find that on 4 percent of invoices the line_items amounts do not sum to invoice_total. The team is debating fixes. Which approach addresses the actual gap?

A) Tighten the schema with stricter numeric types, minimums, and required flags on every amount field
B) Migrate to strict structured outputs mode so the platform hard-guarantees every response honors the schema
C) Add a prompt instruction telling the model to double-check that line items sum to the total before answering
D) Add a post-validation step that checks the sum invariant and routes failures to re-extraction or review

<details>
<summary>Answer & explanation</summary>

**D)** Schema compliance — whether via tool_use or strict structured outputs — is a syntactic guarantee; no schema can enforce arithmetic relationships between fields, so semantic invariants need programmatic validation downstream. Stricter types and strict mode still only constrain shape, which already validates perfectly on the failing invoices, and a double-check instruction is best-effort where auditors need a guarantee.

*Hint if stuck: Separate what a schema can guarantee from what only code that does the math can verify.*
</details>

---

## Question 43
In a repository of GitHub Actions pipelines, Claude has stopped following the YAML formatting conventions that should come from a directory-level CLAUDE.md inside .github/workflows. Before changing any configuration, the engineer wants to confirm whether that file is actually being loaded. What is the right first step?

A) Restart the session and repeat the request to see whether the behavior changes
B) Paste the conventions directly into the chat so the current task can proceed
C) Run /reload-skills to force the session to rescan its configuration tree
D) Run /memory to inspect exactly which memory files the session has loaded

<details>
<summary>Answer & explanation</summary>

**D)** /memory shows which CLAUDE.md and memory files are loaded, turning a guess into a diagnosis. /reload-skills rescans skills, not memory files. Restarting or pasting content are blind workarounds that may mask the symptom without revealing whether the hierarchy is wired correctly.

*Hint if stuck: Diagnose what the session actually loaded before patching behavior.*
</details>

---

## Question 44
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

## Question 45
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

## Question 46
An engineer at an e-commerce company built a /release-checklist slash command in ~/.claude/commands that walks through the team's deployment checklist. During an incident, a teammate tried to run it and the command did not exist in her session. What is the right fix?

A) Have the teammate recreate the command file under her own ~/.claude/commands directory
B) Convert the checklist into a skill so it auto-invokes whenever a deployment is discussed
C) Paste the checklist into the project CLAUDE.md so it is available in every session
D) Move the command file into the repository's .claude/commands directory and commit it

<details>
<summary>Answer & explanation</summary>

**D)** ~/.claude/commands is personal scope — commands there exist only on the author's machine. Shared workflows belong in the project's .claude/commands directory, where they version with the repo and reach every teammate. Per-user recreation drifts over time; converting to a skill trades a deliberately explicit workflow for probabilistic triggering when the real problem is scope; and putting an on-demand checklist in CLAUDE.md pays an always-on context cost for content needed only at release time.

*Hint if stuck: Where a command file lives determines who can invoke it.*
</details>

---

## Question 47
After a runaway agent burned $400 in API calls overnight, an e-commerce team's incident review proposes capping the order-management agent at 3 loop iterations as the primary termination mechanism. A week later, 30% of legitimate multi-step tasks (check inventory, apply discount, create shipment) fail half-finished. What should the architecture look like?

A) Keep the cap at 3 but prompt the model to plan ahead so every task finishes within three tool calls
B) Let stop_reason end_turn drive termination, investigate why the runaway loop never reached it, and keep a generous iteration cap only as a safety fallback
C) Raise the cap to exactly the longest observed legitimate task length, currently measured at 6 iterations, so real tasks finish while runaway loops are still cut off early
D) Replace the loop with a fixed three-step pipeline so the iteration count becomes fully deterministic

<details>
<summary>Answer & explanation</summary>

**B)** Iteration caps are safety fallbacks against pathological loops, never the primary control; genuine completion is signaled by stop_reason end_turn. Tuning the cap to the longest observed task just moves the failure boundary — any task one step longer still truncates — and neither tuned cap explains or fixes whatever caused the original runaway. A fixed pipeline throws away the adaptive sequencing the order workflows need.

*Hint if stuck: Ask what mechanism should normally end the loop, and what role a hard cap is actually meant to play.*
</details>

---

## Question 48
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

## Question 49
An automated security reviewer posts findings on PRs across your platform team's repositories. Its 'potential race condition' category has run at roughly 80 percent false positives for three weeks, and engineers have started dismissing every finding unread, including valid secret-exposure alerts from other categories. What should you do first?

A) Attach a model-reported confidence score to each finding so engineers can sort the findings and triage the noisy race-condition category by themselves
B) Disable the race-condition category in production, tune it offline against labeled examples, and re-enable it once precision recovers
C) Add a prompt instruction telling the model to flag race conditions only when it is certain the code is genuinely unsafe
D) Send the team a reliability ranking of the finding categories so they know which ones are worth reading carefully

<details>
<summary>Answer & explanation</summary>

**B)** One high-false-positive category poisons trust in the entire tool, so the first move is to pull it from production and fix it offline against labeled data, restoring it only when precision recovers. Self-reported confidence scores are poorly calibrated so sorting by them does not rebuild trust, a certainty instruction is a vague caution restated, and a reliability memo asks engineers to keep absorbing the noise.

*Hint if stuck: When one noisy category makes engineers ignore everything, think about protecting trust in the whole tool first.*
</details>

---

## Question 50
A research-tooling team has a license-audit skill that shells out to dependency scanners, producing about 40,000 tokens of raw output per run. After each audit, the main session starts forgetting requirements the user stated earlier. Only a short verdict from the audit actually matters. What is the right design change?

A) Instruct the skill body to request quieter output modes from the scanner commands
B) Run /compact immediately after every audit to summarize the bloated transcript
C) Move the audit instructions into the project CLAUDE.md so they are preloaded in every session
D) Set context: fork in the skill frontmatter so the audit runs isolated and returns its summary

<details>
<summary>Answer & explanation</summary>

**D)** context: fork executes the skill in an isolated context, so the 40,000 tokens of scanner noise never enter the main session — only the result comes back. Quieter output flags reduce but do not eliminate the pollution and depend on scanner cooperation. /compact is damage control applied after the context has already degraded, and CLAUDE.md placement changes loading, not execution isolation.

*Hint if stuck: Think about where the skill's verbose work should happen relative to the main conversation.*
</details>

---

## Question 51
A claude-code-action review runs on every push to a PR. When a developer pushes a fix commit, the bot re-reviews and reposts the same nine findings as brand-new comments, and developers have started muting it entirely. The team wants re-reviews to surface only new issues or ones still unresolved. What is the best fix?

A) Post-process the bot's output and suppress any comment whose text fuzzy-matches an earlier comment
B) Restrict each re-review to only the files touched by the newest commit
C) Have the action close all of its previous comment threads before posting each fresh review on the pull request
D) Include the prior review's findings in the new run's context so it skips duplicates and checks resolution

<details>
<summary>Answer & explanation</summary>

**D)** The reviewer cannot avoid repeating itself or judge whether an issue was fixed unless it knows what it found last time — feeding prior findings into the re-review fixes that at the source. Fuzzy-match suppression breaks the moment wording shifts and can never confirm a finding was resolved, diff-only re-review silently drops unresolved findings in files the fix commit did not touch, and closing old threads just hides the duplication.

*Hint if stuck: A reviewer can only avoid duplicate findings if it has access to its own previous findings.*
</details>

---

## Question 52
A developer-experience team distributes Claude Code skills from an internal git repo. A SessionStart hook pulls the latest skills into .claude/skills/ at the start of every session, but engineers find that skills added by the pull are not auto-invoked until they fully restart Claude Code. How should the team make newly synced skills register automatically, with no manual step?

A) Move the sync script into a PreToolUse hook so it runs again before every tool call in the session
B) Have the SessionStart hook return reloadSkills in its output so the synced skills are rescanned immediately
C) Tell engineers to run /reload-skills manually right after each session starts so the new skills register
D) List every skill's description in the project CLAUDE.md so the content loads as memory at session start instead

<details>
<summary>Answer & explanation</summary>

**B)** SessionStart hooks can return reloadSkills, which triggers a skill rescan after the sync completes — fixing the ordering problem at its source with zero human steps. Manual /reload-skills works but depends on every engineer remembering it every session, which fails the no-manual-step requirement. PreToolUse is the wrong lifecycle event, wastefully re-syncing on every tool call without triggering a rescan, and pasting descriptions into CLAUDE.md defeats progressive disclosure without actually registering the skills.

*Hint if stuck: One hook event has a documented output field made for exactly this situation.*
</details>

---

## Question 53
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

## Question 54
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

## Question 55
A SaaS monorepo has packages/api built on Fastify and packages/dashboard built on React. The root CLAUDE.md documents both sets of conventions, and engineers report Claude applying React component patterns while editing API route handlers. Which change best fixes the misapplied conventions?

A) Place a directory-level CLAUDE.md inside each package containing only that package's conventions
B) Expand the root CLAUDE.md with conditional prose such as: when working in packages/api, ignore the React sections
C) Split the monorepo into two repositories so each codebase gets its own dedicated CLAUDE.md
D) Create one skill per package and tell engineers to invoke the matching one before editing

<details>
<summary>Answer & explanation</summary>

**A)** Directory-level CLAUDE.md files scope guidance to the subtree where work is happening, so each package loads only its own conventions. Conditional prose in one big file is probabilistic — the model must remember to filter, which is exactly what is failing here. Splitting the repo is a drastic structural change to solve a configuration problem, and per-package skills depend on engineers remembering to invoke the right one before every edit.

*Hint if stuck: The CLAUDE.md hierarchy has a level designed for subtree-specific guidance.*
</details>

---

## Question 56
A hardware support bot's lookup_warranty tool returns {"error": "No records found"} when a serial number has no active warranty. The agent treats this as a tool failure, apologizes, and escalates — and 30% of the human queue is now just out-of-warranty devices. What should change?

A) Return a successful response with an empty results array, because zero matches is a valid answer rather than a failure
B) Add a prompt note explaining that the "No records found" error actually means the device has no warranty
C) Mark the error response as isRetryable false so the model stops escalating after the first attempt
D) Have the tool return the closest matching serial number so the model always gets a record back

<details>
<summary>Answer & explanation</summary>

**A)** An empty result set is a successful query with zero matches, not an error; encoding it as an error makes the model conclude the tool broke. Returning success with an empty array lets the agent state confidently that no warranty exists. The prompt-note distractor leaves the broken contract in place and asks the model to reinterpret it probabilistically, the isRetryable flag still encodes a valid answer as a failure so the model keeps escalating, and returning a near-match invites fabricated answers about the wrong device.

*Hint if stuck: Decide whether zero matches is a failure of the tool or an answer from it.*
</details>

---

## Question 57
A support agent emits structured ticket dispositions through a tool_use call with a JSON schema. Every response validates, yet in 4% of cases refund_total does not equal the sum of the line_items amounts, and resolution_code sometimes contradicts the narrative summary. The team concludes schema enforcement is broken and wants to switch providers. What is actually happening, and what is the fix?

A) The schema lacks strict mode — switching to strict structured outputs guarantees both the payload's shape and its internal arithmetic consistency
B) Temperature is too high for structured work — pinning it to 0 makes the numeric fields deterministic and therefore internally consistent
C) The field descriptions are too thin — documenting each field's relationship to the others lets the model reliably self-enforce the cross-field invariants
D) Schema enforcement worked: it guarantees syntactic compliance, not semantic correctness — add programmatic cross-field validation with a repair retry

<details>
<summary>Answer & explanation</summary>

**D)** tool_use with a JSON schema guarantees the output parses and conforms structurally; it never guarantees semantic correctness such as sums that reconcile or fields that agree. Cross-field invariants therefore need programmatic validation with a repair loop. Strict structured outputs only harden the syntactic guarantee — arithmetic consistency is still semantics — richer descriptions help probabilistically but cannot guarantee the invariant, and determinism at temperature 0 just makes the same wrong sums repeatable.

*Hint if stuck: Distinguish what schema validation can promise from what only your own code can check.*
</details>

---

## Question 58
A healthcare intake triage step must always act through one of four tools — schedule_appointment, request_records, verify_insurance, or escalate_to_nurse — but in about 8% of turns the model replies with prose suggestions and calls nothing. Which change guarantees an action without over-constraining the choice?

A) Force tool_choice to escalate_to_nurse so every triage turn is guaranteed to produce an action
B) Set tool_choice to "any" on the triage request so the model must call one of the four tools
C) Add a system prompt instruction stating that the model must always respond by calling a tool
D) Keep tool_choice "auto" and retry the request whenever the response comes back as text only

<details>
<summary>Answer & explanation</summary>

**B)** tool_choice "any" is the mode that guarantees some tool call while leaving the model free to pick the right one, which is exactly the requirement. Forcing a single named tool over-constrains a step where four tools are valid and would flood the nurse queue. The prompt instruction is probabilistic and is precisely what is already failing 8% of the time, and retry-on-text adds latency without ever guaranteeing the next attempt calls a tool.

*Hint if stuck: One tool_choice mode guarantees a tool call without dictating which tool it is.*
</details>

---

## Question 59
A nightly CI audit invokes claude -p to assess code quality across a payments repository and is meant to be strictly read-only. One morning the team discovers the job rewrote two config files and committed them via Bash, even though the prompt says "do not modify anything." What is the strongest fix?

A) Strengthen the prompt: "READ-ONLY audit. Never use Edit, Write, or Bash under any circumstances"
B) Add a PostToolUse hook that git-restores any file the audit job touches
C) Launch the job with --allowedTools limited to Read, Grep, and Glob so write-capable tools are unavailable
D) Run the CI job under a Git identity that lacks push permission to the repository, so no edits can ever be pushed

<details>
<summary>Answer & explanation</summary>

**C)** --allowedTools deterministically scopes what the session can do — with Edit, Write, and Bash absent, the job cannot modify anything regardless of what the model decides. Prompt prohibitions are probabilistic and have already failed once; revoking push permission still allows local edits that corrupt the workspace, and a PostToolUse revert cleans up damage instead of preventing it.

*Hint if stuck: Deterministic removal of a capability beats both instructions and after-the-fact cleanup.*
</details>

---

## Question 60
A team built .claude/skills/claims-extract/SKILL.md to standardize healthcare intake form extraction, but Claude Code never auto-invokes it — the frontmatter description just says "Extraction helper." An engineer rewrote the description mid-session, yet the running session still does not pick the skill up. What resolves both problems?

A) Move the skill body into the project CLAUDE.md so it is always loaded, since skills can only ever be triggered from explicit slash commands
B) Add context: fork to the frontmatter — skills cannot auto-invoke until they are marked to execute inside an isolated forked context
C) Convert the skill into .claude/commands/claims-extract.md, because automatic invocation is supported only for project slash commands
D) Write a specific description of what the skill does and when to use it, then run /reload-skills so the session rescans the skills directory

<details>
<summary>Answer & explanation</summary>

**D)** The frontmatter description drives auto-invocation, so a vague "Extraction helper" gives the model nothing to match intake-form requests against. /reload-skills rescans skills mid-session, picking up the edit without a restart. context: fork controls execution isolation rather than triggering, and slash commands are explicit-invocation only — moving the skill there abandons auto-invocation instead of fixing it, while inlining into CLAUDE.md sacrifices progressive disclosure.

*Hint if stuck: One frontmatter field decides whether a skill triggers, and a 2026 slash command refreshes skills without restarting the session.*
</details>

---

## Answer key (no peeking until scored)

1:A 2:C 3:D 4:C 5:A 6:C 7:C 8:C 9:B 10:C 11:C 12:C 13:A 14:A 15:D 16:C 17:A 18:A 19:B 20:A 21:C 22:B 23:B 24:D 25:C 26:B 27:A 28:A 29:D 30:A 31:B 32:D 33:B 34:A 35:C 36:B 37:D 38:D 39:A 40:B 41:B 42:D 43:D 44:B 45:C 46:D 47:B 48:C 49:B 50:D 51:D 52:B 53:A 54:A 55:A 56:A 57:D 58:B 59:C 60:D
