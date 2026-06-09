# Practice Test 07: Prompt Workshop
**D4: Prompt Engineering & Structured Output** (20% of the exam) — Prompts & structured output

15 questions. Exam pace is 2 minutes per question; aim for 30 minutes.
Pass bar in the game: 7/10 on a random draw. Pass bar here: be honest.

---

## Question 1
Your CI pipeline runs claude -p to review every PR in a 40-developer monorepo. The review prompt includes the line 'be careful not to flag things that are not real problems,' yet PRs still average 12 comments each, mostly style nitpicks the linter already enforces. What is the most effective prompt change?

A) Lower the sampling temperature so the model generates fewer speculative findings and sticks to obvious problems
B) Strengthen the existing instruction to say the model should be very careful and only report issues it is extremely confident are real
C) Replace the vague caution with explicit flag and skip criteria: enumerate the defect types to report and state that linter-covered style issues must be skipped
D) Add a hard cap of five comments per PR so the volume of nitpicks stays manageable for reviewers

<details>
<summary>Answer & explanation</summary>

**C)** Vague cautions like 'be careful' give the model no operational definition of a real problem, so they fail at scale; explicit flag and skip criteria provide a checkable decision rule. Confidence-based phrasing is the same vagueness restated, temperature changes randomness rather than the decision rule, and a comment cap hides noise without improving precision.

*Hint if stuck: The fix is to make the decision rule operational, not to restate the caution more forcefully.*
</details>

---

## Question 2
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

## Question 3
A support-resolution agent ends each conversation by writing a handoff summary for human agents. The required format is four labeled sections, but in production the model sometimes merges sections, renames headers, or adds extras, even though the prompt describes the format in detail. What is the most reliable prompt-level fix?

A) Add two to four complete example summaries to the prompt that demonstrate the exact section structure on representative tickets
B) Expand the prose format description with stronger language such as 'you must always use exactly these four headers'
C) Append thirty example summaries covering every ticket category the support team has ever encountered
D) Ask the model to first restate the format rules in its own words, then write the summary beneath its restatement

<details>
<summary>Answer & explanation</summary>

**A)** Few-shot examples demonstrate format far more reliably than prose descriptions, and 2 to 4 well-chosen examples are typically enough for format consistency. Thirty examples add cost and context bloat with diminishing returns, stronger prose wording is the same probabilistic instruction that is already failing, and a restatement preamble adds extra text that itself violates the required four-section output.

*Hint if stuck: Showing the model the output usually beats describing it, but more of a good thing has diminishing returns.*
</details>

---

## Question 4
An automated security reviewer posts findings on PRs across your platform team's repositories. Its 'potential race condition' category has run at roughly 80 percent false positives for three weeks, and engineers have started dismissing every finding unread, including valid secret-exposure alerts from other categories. What should you do first?

A) Attach a model-reported confidence score to each finding so engineers can sort and triage the noisy category themselves
B) Disable the race-condition category in production, tune it offline against labeled examples, and re-enable it once precision recovers
C) Add a prompt instruction telling the model to flag race conditions only when it is certain the code is genuinely unsafe
D) Send the team a reliability ranking of the finding categories so they know which ones are worth reading carefully

<details>
<summary>Answer & explanation</summary>

**B)** One high-false-positive category poisons trust in the entire tool, so the first move is to pull it from production and fix it offline against labeled data, restoring it only when precision recovers. Self-reported confidence scores are poorly calibrated so sorting by them does not rebuild trust, a certainty instruction is a vague caution restated, and a reliability memo asks engineers to keep absorbing the noise.

*Hint if stuck: When one noisy category makes engineers ignore everything, think about protecting trust in the whole tool first.*
</details>

---

## Question 5
An e-commerce pipeline asks Claude to return product attributes as JSON in a plain text response. About 2 percent of responses begin with 'Here is the extracted JSON:' or wrap the object in a code fence, crashing the downstream parser. The prompt already says 'respond with only the JSON object, no other text.' What is the root-cause fix?

A) Use strict structured outputs or a tool_use schema so conformance is guaranteed rather than requested through instructions
B) Add a regex preprocessing step that strips any leading prose and code fences before the parser runs
C) Repeat the JSON-only instruction at both the start and the end of the prompt so the model cannot miss it
D) Detect parse failures at runtime and automatically resend the request until a clean JSON response comes back

<details>
<summary>Answer & explanation</summary>

**A)** Prompt instructions are probabilistic and will occasionally be violated at scale; strict structured outputs or tool_use with a schema make conformance a guarantee of the API rather than a request. Regex stripping and retry loops patch the symptom while leaving the unreliable mechanism in place, and repeating the instruction is more of the same best-effort approach.

*Hint if stuck: Ask which option turns 'please format it this way' into a guarantee.*
</details>

---

## Question 6
A healthcare intake assistant classifies patient messages as urgent, routine, or administrative. Accuracy on clear-cut messages is 98 percent, but messages mixing signals, like a medication-refill request that also mentions new chest pain, get classified inconsistently across runs. The prompt already contains three clear examples of each category. What should you add?

A) More clear-cut examples of each category, scaling up to ten per class so every label is better represented
B) An instruction telling the model to use its best clinical judgment whenever a message contains mixed signals
C) A higher extended-thinking budget so the model reasons for longer about every incoming patient message
D) A few examples of mixed-signal messages, each paired with the correct label and the reasoning that justifies it

<details>
<summary>Answer & explanation</summary>

**D)** The failures are concentrated in ambiguous inputs, so the examples must demonstrate how to resolve ambiguity, and including the reasoning teaches the decision process rather than just the answer. More clear-cut examples reinforce what already works, 'use best judgment' gives the model no new decision rule, and a bigger thinking budget adds latency to every message without supplying the missing tie-breaking criteria.

*Hint if stuck: Target the examples at where the model actually fails, and show the why, not only the what.*
</details>

---

## Question 7
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

## Question 8
A logistics intake system classifies shipping documents with an enum field of six values: bill_of_lading, packing_list, customs_declaration, invoice, delivery_receipt, insurance_certificate. A carrier starts sending a new dangerous-goods declaration form, and the model silently labels every one as customs_declaration. How should the schema evolve?

A) Replace the enum with a free-text document_type string so the model can name any document it encounters
B) Add dangerous_goods_declaration to the enum and plan to extend the list whenever a new form type appears
C) Keep the enum but instruct the model to pick a category only when it is confident the document truly matches it
D) Add an other value to the enum alongside a free-text detail field that captures what the document appears to be

<details>
<summary>Answer & explanation</summary>

**D)** A closed enum forces the model to misfile anything outside the list; an other value plus a free-text detail field lets unknown documents surface visibly instead of silently corrupting a known category. Adding one new enum value fixes today's form but leaves the same silent-misfiling failure waiting for the next one, free text sacrifices the structure downstream systems rely on, and a confidence instruction still gives the model no valid label to choose.

*Hint if stuck: Design the schema so inputs outside the known categories become visible instead of being force-fit.*
</details>

---

## Question 9
A legal-discovery pipeline receives unlabeled documents that may be contracts, depositions, or court filings, with a dedicated extraction tool for each type. With tool_choice set to auto, the model sometimes replies in prose asking which document type it is looking at instead of extracting anything. What configuration fixes this?

A) Set tool_choice to any so the model must call one of the extraction tools, choosing which based on the document's content
B) Set tool_choice to force the contracts tool, since contracts make up the majority of the incoming document stream
C) Add a system-prompt rule stating the model must never respond with a clarifying question during an extraction run
D) Combine the three tools into a single extractor whose schema is a union of all three document types' fields

<details>
<summary>Answer & explanation</summary>

**A)** tool_choice any guarantees a tool call on every request while leaving the model free to pick the right extractor for the content, the exact fit for unlabeled streams with one tool per document type. Forcing a specific named tool misroutes every non-contract, a prompt rule against clarifying questions is best-effort rather than a guarantee, and a union schema blurs three focused tools into one ambiguous surface.

*Hint if stuck: You need a guarantee that some tool gets called without dictating which one.*
</details>

---

## Question 10
A research-ingestion agent must always log a paper's title, authors, and venue via its extract_metadata tool before doing anything else, then decide among summarize_abstract, extract_citations, or finishing. In testing, the model occasionally skips metadata and goes straight to summarization. How do you enforce the ordering?

A) Set tool_choice to any for the whole session so every turn is guaranteed to produce some tool call
B) Force the first request with tool_choice naming the extract_metadata tool, then switch tool_choice to auto for subsequent turns
C) List extract_metadata first in the tools array, since the model weights earlier tool definitions more heavily
D) Add a system-prompt instruction in emphatic wording that extract_metadata must always be called before any other tool

<details>
<summary>Answer & explanation</summary>

**B)** Forcing a named tool with tool_choice guarantees the first call deterministically, and relaxing to auto afterward restores the model's judgment for the rest of the workflow, including the option to finish. tool_choice any guarantees a call but not which one, tool-list ordering carries no enforcement guarantee, and emphatic instructions are probabilistic, which is the failure already observed.

*Hint if stuck: Use the deterministic control for the step that must happen, then hand judgment back.*
</details>

---

## Question 11
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

## Question 12
A real-estate listing extractor sends a 28,000-token system prompt with taxonomy, field rules, and few-shot examples plus a cache_control breakpoint, followed by one listing per request at 40 requests per minute. Billing shows constant cache writes but almost no cache reads. The system prompt begins with the line 'Current time: 2026-06-09T14:32:07Z.' What is the cause?

A) The 5-minute cache TTL is expiring between requests, so the team should switch to the 1-hour TTL option
B) The cache breakpoint is placed too late in the prompt; moving it earlier would let partial prefixes match
C) 28,000 tokens exceeds the cacheable prefix size, so the system prompt must be trimmed before hits can occur
D) The second-precision timestamp changes every request, so the prefix never matches; volatile values must move after the stable content

<details>
<summary>Answer & explanation</summary>

**D)** Cache hits require the prefix to be identical across requests, so a timestamp that differs every second at the very start invalidates the entire 28,000-token prefix behind it, which is exactly why every request writes and none read. At 40 requests per minute the 5-minute TTL cannot be expiring, no breakpoint placement helps when the first line itself changes, and there is no prefix-size limit problem at this scale.

*Hint if stuck: A cache hit requires the prefix to be byte-for-byte identical across requests.*
</details>

---

## Question 13
After migrating an expense-report extractor to strict structured outputs, an engineer opens a PR deleting the downstream validation layer that checks each report's category subtotals against its grand total, arguing that 'the output is schema-guaranteed now.' How should you respond?

A) Keep the validation layer: strict outputs guarantee structural conformance, but cross-field arithmetic is semantic and can still be wrong
B) Approve the deletion, since strict structured outputs make schema violations impossible and the checks are now dead code
C) Replace the validation layer with a prompt instruction requiring that subtotals always sum exactly to the grand total
D) Encode the subtotal constraint directly in the JSON schema so the API enforces the arithmetic at generation time

<details>
<summary>Answer & explanation</summary>

**A)** Strict structured outputs harden the syntactic guarantee of well-formed JSON matching the schema, but say nothing about whether the values are right, so semantic invariants like subtotal arithmetic still need programmatic checks. JSON Schema cannot express cross-field arithmetic constraints, so that option is not implementable, and a prompt instruction downgrades a deterministic check to a best-effort request.

*Hint if stuck: Upgrading the syntax guarantee does not upgrade the meaning of the values.*
</details>

---

## Question 14
A sentiment pipeline classifies 50,000 product reviews per day using a prompt with classification rules and few-shot examples ahead of a cache breakpoint, each review appended last. To 'keep the model fresh,' a teammate samples a new random set of eight examples from a 200-example pool on every request. Cache reads have dropped to zero and label formats have started drifting. What should change?

A) Move the examples after the review text so the rotating content sits outside the cached portion of the prompt
B) Fix a stable, hand-picked set of two to four examples in the prefix so the cache hits again and the format stays consistent
C) Keep rotating examples but expand the pool to 1,000 so the model sees more diversity across the day's requests
D) Shrink each rotated set from eight examples down to two so the changing portion of the prefix is smaller per request

<details>
<summary>Answer & explanation</summary>

**B)** Rotating examples changes the prefix on every request, killing cache hits, and inconsistent demonstrations invite format drift; a stable, curated set of 2 to 4 examples fixes both at once. Moving examples after the review text would recover caching of the rules but the demonstrations still rotate, so the format drift continues; the root flaw is rotation itself, and shrinking or enlarging the rotated set keeps that flaw.

*Hint if stuck: Both symptoms trace to the same decision; ask what changing the prefix every request costs you.*
</details>

---

## Question 15
A medical-records pipeline forces its first call with tool_choice set to the extract_patient_header tool, which works, but the integration leaves that same tool_choice on every subsequent request. The model now re-extracts the header repeatedly and never calls extract_medications or produces its final summary. What is the fix?

A) Add a system-prompt rule that the header tool may be called at most once per document so the model stops repeating it
B) Switch tool_choice to any after the first turn so the model is forced to keep selecting among the remaining tools
C) Remove extract_patient_header from the tools array after the first call so the model can no longer select it
D) After the forced first call returns, send subsequent requests with tool_choice set to auto so the model can choose tools or finish

<details>
<summary>Answer & explanation</summary>

**D)** The force-then-relax pattern requires actually relaxing: leaving a named tool forced compels every turn to call that tool. Switching to auto restores the model's ability to pick the right next tool or end the turn with the final summary. tool_choice any would still force some tool call on every turn, blocking the closing prose summary; removing the tool from the array while tool_choice still names it just breaks the request instead of relaxing the constraint; and a prompt rule cannot override a forced tool_choice at all.

*Hint if stuck: Forcing a named tool is a first-turn maneuver; recall what the second half of that pattern is.*
</details>

---
