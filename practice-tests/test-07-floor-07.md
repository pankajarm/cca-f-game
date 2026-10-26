# Practice Test 07: Prompt Workshop
**D4: Prompt Engineering & Structured Output** (20% of the exam) · task statements 4.1, 4.2, 4.3

20 questions. Exam pace is 2 minutes per question.

---

## Question 1
Your CI pipeline runs claude -p to review every PR in a 40-developer monorepo. The review prompt includes the line 'be careful not to flag things that are not real problems,' yet PRs still average 12 comments each, mostly style nitpicks the linter already enforces. What is the most effective prompt change?

A) Lower the sampling temperature so the model generates fewer speculative findings and sticks to obvious problems
B) Strengthen the existing instruction to say the model should be very careful and only report issues it is extremely confident are real bugs worth a reviewer's time
C) Replace the vague caution with explicit flag and skip criteria: enumerate the defect types to report and state that linter-covered style issues are skipped
D) Add a hard cap of five comments per PR so the volume of nitpicks stays manageable for reviewers

<details>
<summary>Answer & explanation</summary>

**C)** Vague cautions like 'be careful' give the model no operational definition of a real problem, so they fail at scale; explicit flag and skip criteria provide a checkable decision rule. Confidence-based phrasing is the same vagueness restated, temperature changes randomness rather than the decision rule, and a comment cap hides noise without improving precision.

*Hint if stuck: The fix is to make the decision rule operational, not to restate the caution more forcefully.*
</details>

---

## Question 2
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

## Question 3
A CI step asks Claude to 'check that code comments are accurate'. It flags dozens of comments per PR for minor wording, and developers have started ignoring it. Which prompt change most improves precision?

A) Add 'only report high-confidence findings'
B) Ask the model to rate each finding from 1 to 10 for confidence and post only those it rated 8 or higher
C) Add 'be conservative and avoid nitpicks'
D) Flag a comment only when the behaviour it describes contradicts what the code actually does

<details>
<summary>Answer & explanation</summary>

**D)** Explicit categorical criteria define what counts as an issue. General instructions like 'be conservative' or 'high confidence only' don't reliably improve precision, and self-rated confidence is poorly calibrated.

*Hint if stuck: Define what counts as wrong, rather than how careful to be.*
</details>

---

## Question 4
An automated reviewer labels the same unchecked null dereference 'critical' on one PR and 'minor' on another, and teams can't trust its severity labels for routing. What is the most effective fix?

A) Run the review three times and use the most common severity
B) Add 'be consistent with severity ratings' to the prompt
C) Define explicit criteria for each severity level, each with a concrete code example
D) Drop severity labels entirely and post every finding at the same level so ratings can never disagree

<details>
<summary>Answer & explanation</summary>

**C)** Consistent classification comes from explicit level definitions illustrated by concrete examples. Majority voting averages an undefined standard, 'be consistent' gives the model nothing to be consistent with, and removing severity loses the routing signal the team needs.

*Hint if stuck: Consistent with what?*
</details>

---

## Question 5
A support-resolution agent ends each conversation by writing a handoff summary for human agents. The required format is four labeled sections, but in production the model sometimes merges sections, renames headers, or adds extras, even though the prompt describes the format in detail. What is the most reliable prompt-level fix?

A) Add two to four complete example summaries to the prompt that demonstrate the exact section structure on representative tickets
B) Expand the prose format description with stronger language such as 'you must always use exactly these four section headers in this order'
C) Append thirty example summaries covering every ticket category the support team has ever encountered
D) Ask the model to first restate the format rules in its own words, then write the summary beneath its restatement

<details>
<summary>Answer & explanation</summary>

**A)** Few-shot examples demonstrate format far more reliably than prose descriptions, and 2 to 4 well-chosen examples are typically enough for format consistency. Thirty examples add cost and context bloat with diminishing returns, stronger prose wording is the same probabilistic instruction that is already failing, and a restatement preamble adds extra text that itself violates the required four-section output.

*Hint if stuck: Showing the model the output usually beats describing it, but more of a good thing has diminishing returns.*
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
An extraction pipeline pulls sample_size from research papers. When the paper has a Methods section it works; when the sample size is mentioned inside the results text, the model returns null even though the number is there. What change best fixes this?

A) Add few-shot examples showing correct extraction from both layouts: a dedicated Methods section and figures embedded in results text
B) Make sample_size a required field in the extraction schema so the model must always provide a value, even for papers with unusual layouts
C) Retry each null result with the same prompt up to three times
D) Add a paragraph explaining that sample sizes can appear anywhere

<details>
<summary>Answer & explanation</summary>

**A)** Few-shot examples that show varied document structures are the most effective way to reduce empty extractions caused by layout differences. A required field pushes the model to invent values when the data really is absent, unchanged retries repeat the failure, and prose explanations are weaker than demonstrations.

*Hint if stuck: Show it what the other layout looks like.*
</details>

---

## Question 8
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

## Question 9
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

## Question 10
An e-commerce pipeline asks Claude to return product attributes as JSON in a plain text response. About 2 percent of responses begin with 'Here is the extracted JSON:' or wrap the object in a code fence, crashing the downstream parser. The prompt already says 'respond with only the JSON object, no other text.' What is the root-cause fix?

A) Use strict structured outputs or a tool_use schema so conformance is guaranteed rather than requested through instructions
B) Add a regex preprocessing step that strips any leading prose and code fences before the parser runs
C) Repeat the JSON-only instruction at both the start and the end of the prompt so the model cannot miss it
D) Detect parse failures at runtime and automatically resend the request until a clean JSON response comes back from the model

<details>
<summary>Answer & explanation</summary>

**A)** Prompt instructions are probabilistic and will occasionally be violated at scale; strict structured outputs or tool_use with a schema make conformance a guarantee of the API rather than a request. Regex stripping and retry loops patch the symptom while leaving the unreliable mechanism in place, and repeating the instruction is more of the same best-effort approach.

*Hint if stuck: Ask which option turns 'please format it this way' into a guarantee.*
</details>

---

## Question 11
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

## Question 12
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

## Question 13
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

## Question 14
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

## Question 15
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

## Question 16
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

## Question 17
A fintech team extracts fields from 80,000 vendor invoices. Their schema marks vendor_tax_id as a required string, and spot checks show the model invents plausible-looking tax IDs for the roughly 12% of invoices that have none. The team's plan is to add "NEVER fabricate tax IDs" to the prompt and submit all 80,000 documents to the Batch API tonight. As the reviewing architect, what do you change?

A) Make vendor_tax_id nullable (type ["string","null"]) so absence is representable, and run a synchronous pilot on a sample before submitting the full batch
B) Keep the required field but strengthen the prompt warning with concrete examples of fabricated IDs, then submit the full batch tonight to capture the 50% discount
C) Split the 80,000 invoices into eight sequential overnight batches so fabricated IDs are easier to localize, and schedule a manual cleanup pass once all results return
D) Switch the field to an enum of known tax ID formats with a catch-all pattern, and add a retry pass for any invoice the model flags as uncertain

<details>
<summary>Answer & explanation</summary>

**A)** A required field forces the model to produce a value even when none exists, so fabrication here is a schema design flaw — a nullable field lets the model return null instead of inventing data. Piloting a sample synchronously before a massive batch run is the standard guard against burning a 24-hour cycle on a flawed configuration. Prompt warnings are probabilistic patches, splitting batches localizes bad output without preventing any of it, and self-reported uncertainty is too poorly calibrated to drive a retry pass.

*Hint if stuck: Ask whether the schema even allows the model to say a field is absent — and what you should validate before committing a huge batch.*
</details>

---

## Question 18
A research swarm classifies each extracted claim into an enum field: market_trend, regulation, technology, or competitor_move. Reviewers keep finding genuinely novel claim types — supply chain disruptions, labor actions — silently shoehorned into competitor_move. What is the right schema fix?

A) Add an "other" value to the enum together with a free-text detail field that captures what the claim actually describes
B) Add five more specific enum values covering every claim type observed so far, and brief reviewers to expect occasional residual misfits
C) Add a prompt instruction telling the model to classify carefully and to skip any claim that does not clearly match one of the four categories
D) Make the category field nullable so the model can return null whenever a claim falls outside the four currently defined values

<details>
<summary>Answer & explanation</summary>

**A)** Closed enums force the model to pick the least-wrong value, so novel claims get shoehorned; the canonical fix is an "other" or "unclear" escape value paired with a free-text detail field that preserves the information. A nullable category discards the signal entirely — you learn nothing about what the claim was. Adding more enum values is a treadmill: the next novel type shoehorns all over again, and a prompt instruction to skip claims silently drops data.

*Hint if stuck: The schema needs an escape hatch that still captures information instead of dropping it.*
</details>

---

## Question 19
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

## Question 20
An insurance company extracts fields from 80,000 scanned claim forms through the Message Batches API. The extraction tool schema marks policy_end_date as a required string; on forms where the date is illegible, Claude returns plausible fabricated dates. Adding NEVER GUESS — write UNKNOWN to the prompt cut fabrication only slightly. What fixes the root cause?

A) Escalate the prompt warning and add three few-shot examples demonstrating refusal to guess illegible dates
B) Change policy_end_date to type ["string","null"] and remove it from required so the model can return null
C) Set temperature to 0 so the model stops inventing values when the source document is uncertain
D) Move the illegible forms over to synchronous API calls, where extraction accuracy is higher

<details>
<summary>Answer & explanation</summary>

**B)** A required string field forces the model to emit some string even when the document lacks the data — that schema constraint is the structural cause of fabrication, and a nullable field gives the model a legitimate way to return null. Prompt warnings and few-shot examples fight the schema and stay probabilistic, temperature does not change a forced-required constraint, and the Batch API runs the identical model with identical accuracy to synchronous calls.

*Hint if stuck: When a schema demands a value the document may not contain, ask what escape hatch is missing.*
</details>

---
