# Practice Test 08: Validation Gauntlet
**D4: Prompt Engineering & Structured Output** (20% of the exam) · task statements 4.4, 4.5, 4.6

72 questions. Exam pace is 2 minutes per question.

---

## Question 1
A shipping-documents pipeline validates each extracted bill of lading. When validation fails, it retries with the original prompt plus the line "Your previous output was invalid, please try again." About half of the retries fail with the same problem, such as a container number that does not match the required pattern. What change most improves the retry success rate?

A) Raise the retry limit from two attempts to five so the model has more chances to land on a valid container number
B) Switch to a larger model only for the retry calls, since a stronger model is more likely to notice what went wrong
C) Include the specific validator message in the retry, naming the field, the value it returned and the pattern it must match
D) Ask the model to explain its previous answer before trying again, so it reflects on whatever mistake it made on its first attempt

<details>
<summary>Answer & explanation</summary>

**C)** A generic "invalid" gives the model nothing to correct against; appending the specific error with the field, the failing value and the expected pattern is what makes a retry converge. More attempts repeat the same blind guess, a larger model still does not know what was wrong, and self-explanation without the validator's finding is reflection without new information.

*Hint if stuck: A retry can only fix what the model is told is broken.*
</details>

---

## Question 2
A mortgage team extracts policy numbers from scanned insurance declarations. About 4 percent of scans are cropped so the last digits of the policy number are cut off the page. The validator rejects those outputs, and the retry-with-feedback loop runs three times before failing each one. What should the architect change?

A) Increase the retry count for this field only, since the model sometimes recovers the full number on its fourth or fifth attempt
B) Include the validator's error and a description of the expected policy-number pattern in each retry so the model can rebuild the missing digits
C) Relax the validator so that partial policy numbers are accepted and leave it to the underwriting team to look them up later by hand
D) Recognise when the value is not recoverable from the source, stop retrying, and send the document back for a rescan with a clear reason

<details>
<summary>Answer & explanation</summary>

**D)** Retries cannot recover information that is not in the source; when the digits are cut off, the right action is to stop retrying and fix the input with a clear reason. Richer feedback only pressures the model to invent digits, accepting partial numbers pushes silent errors downstream, and a fourth attempt that succeeds on missing data is a fabrication, not a recovery.

*Hint if stuck: Ask whether the answer is anywhere in the document before asking the model again.*
</details>

---

## Question 3
A purchasing pipeline extracts purchase orders with quantity, unit price and line amount for each line. Auditors find that when a supplier's line amount does not equal quantity times unit price, the model quietly writes the product instead of the printed amount, hiding supplier errors. What design best preserves this audit signal?

A) Extract all three printed values as written, compute the product in code, and flag lines where the printed amount differs
B) Tell the model to always copy the printed line amount and to never do arithmetic of its own while it is extracting
C) Drop the line amount field and calculate it downstream from quantity and unit price, since the printed value is redundant
D) Ask the model to set a boolean field to true whenever it notices that the printed amount looks wrong for a given line

<details>
<summary>Answer & explanation</summary>

**A)** Keeping the stated values and computing the check deterministically in code surfaces every mismatch as a conflict for review. An instruction not to calculate is still probabilistic and gives no flag, dropping the printed amount destroys the exact evidence auditors need, and a model-set boolean depends on the model noticing the error it was already smoothing over.

*Hint if stuck: Keep what the document says and what the maths says side by side.*
</details>

---

## Question 4
A contract-review pipeline flags auto-renewal clauses and outputs only clause_id and is_auto_renewal. Reviewers dismiss about a third of flags, but the team cannot tell why the model is wrong, because nothing in the output shows what triggered each flag. What is the most useful change to the output schema?

A) Add a confidence score from zero to one so that reviewers can sort the flags and skip the ones with lower confidence
B) Add a detected_pattern field recording the phrase or rule that triggered each flag, so dismissed flags can be grouped by cause
C) Add a field for the clause's full text so that reviewers no longer have to open the full contract to check each flagged clause
D) Add a reviewer-feedback field to the schema so the model can learn from past dismissals during future extraction runs

<details>
<summary>Answer & explanation</summary>

**B)** A detected_pattern field records why each flag fired, so dismissed flags can be grouped by trigger and the prompt or rules fixed for the patterns that cause false positives. A confidence score helps triage but does not explain causes, clause text speeds review without revealing the trigger, and a feedback field in the output does not teach the model anything across runs.

*Hint if stuck: To fix false positives you first need to see what caused them.*
</details>

---

## Question 5
A CI job asks Claude for a structured JSON report of every finding in a large diff. On the biggest PRs the JSON fails to parse and the job retries the identical request up to three times, failing each time. Logs show those responses ended with stop_reason max_tokens. What is the right fix?

A) Add the parser's error message to each retry so that the model knows its JSON was malformed and closes all its brackets
B) Ask the model in the prompt to keep the report short so it fits, and retry until a response arrives that the parser accepts
C) Treat max_tokens as truncation, not a format error, and either raise the limit or split the diff into smaller review requests
D) Use a lenient JSON parser that repairs unclosed brackets so that the partial report can still be posted on the PR

<details>
<summary>Answer & explanation</summary>

**C)** A max_tokens stop means the output was cut off, so retrying the same request or adding parse feedback cannot help; the request needs more room or less work per call. Parse feedback treats truncation as a syntax mistake, asking for brevity risks dropping findings on exactly the largest diffs, and repairing brackets silently posts an incomplete review.

*Hint if stuck: Check why the response ended before deciding what kind of failure it is.*
</details>

---

## Question 6
A research system's synthesis agent quotes sources directly. A validator checks each quote against the fetched source text and finds that about 8 percent are paraphrases presented as quotes. Currently the team adds "double-check your quotes" to the prompt and reruns the whole synthesis. What is a better feedback loop?

A) Return the specific quotes that were not found in their sources and ask the agent to fix or remove only those quotes
B) Have the same agent review its full report for misquotes before submitting, adding a final self-check step to the prompt
C) Remove all direct quotes from reports and ask the agent to paraphrase every source, so that misquotes can never happen
D) Keep rerunning the full synthesis with the double-check instruction until the validator finds no misquoted passages at all

<details>
<summary>Answer & explanation</summary>

**A)** The validator already knows which quotes failed; feeding back those specific quotes lets the agent fix exactly the problem without regenerating the whole report. A self-check in the same session shares the blind spots that produced the paraphrases, banning quotes removes value readers need, and full reruns with a generic instruction are costly and do not target the errors.

*Hint if stuck: You already know exactly what is wrong; use that.*
</details>

---

## Question 7
A tax-form extraction service retries with specific validator feedback. Telemetry shows that forms passing on the first or second retry are almost always correct, while forms still failing after two retries rarely pass on later attempts and sometimes pass with invented values. What retry policy should the architect set?

A) Allow unlimited retries but lower the temperature on each attempt so that the output gradually becomes more stable
B) Stop after two feedback retries and send the form to human review with the validation errors and attempt history
C) Remove retries entirely and send every form that fails its first validation straight to the human review queue
D) Retry until the form passes validation, since a valid output is by definition one the downstream system can trust

<details>
<summary>Answer & explanation</summary>

**B)** The data shows that retries beyond two add risk, not value, so a small retry budget followed by human review with the error trail keeps the good recoveries and stops the forced fabrications. Unlimited retries at lower temperature still push the model to invent values, passing validation does not prove the values are true, and dropping retries sends many easily fixed forms to humans.

*Hint if stuck: Look at where the telemetry says retries stop helping.*
</details>

---

## Question 8
A lease-abstraction pipeline uses tool_use with a strict JSON schema, and every output is schema-valid. Yet reviewers find leases where end_date is before start_date, or where rent escalations sum to more than the stated maximum. The team proposes tightening the schema further. What should the architect recommend instead?

A) Rely on the strict schema and add a prompt instruction asking the model to check that the dates and sums make sense
B) Add more enum values and string patterns to the schema so that impossible dates and amounts become schema violations
C) Add a business-rule validator for cross-field checks and send any rule violations back to the model as specific feedback
D) Switch to a free-text extraction followed by a second model call that converts the text into the required JSON schema

<details>
<summary>Answer & explanation</summary>

**C)** JSON schemas remove syntax errors but cannot express cross-field rules like date order or summed caps, so a separate business-rule validator with specific feedback is needed. Prompt reminders are probabilistic and give no signal when they fail, tighter patterns cannot compare two fields, and a two-step text then JSON flow adds a call without any semantic check.

*Hint if stuck: A schema checks the shape of the answer, not whether the parts agree with each other.*
</details>

---

## Question 9
A pipeline extracts certifications from supplier onboarding packets, and the validator produces two kinds of errors: date fields in the wrong format, and a required ISO certificate number that is blank. Both currently trigger the same three-attempt feedback loop. Most blank certificate numbers are packets that simply do not include the certificate. How should the loop treat these errors?

A) Treat both the same, but increase the retry limit for the blank certificate field since it is the more important one
B) Retry both with feedback, but add an instruction that the certificate number must be present in every valid packet
C) Skip retries for both types and mark every packet that fails validation for manual completion by the onboarding team
D) Retry the date-format errors with feedback, and route a blank certificate to a request for the missing document

<details>
<summary>Answer & explanation</summary>

**D)** Format errors are fixable from the source, so they are worth retrying with specific feedback, while a certificate the packet does not contain cannot be recovered by asking again. More retries or an instruction that the value must exist pressure the model to invent a number, and skipping retries entirely sends easily fixed format errors to people.

*Hint if stuck: Sort failures by whether the answer is actually in the document.*
</details>

---

## Question 10
A developer-productivity tool extracts breaking API changes from PR descriptions into a JSON changelog. On validation failure, the retry sends only the failed JSON and the error message, to save tokens. Retried outputs fix the reported field but often change other fields to values that are not in the PR at all. What is the most likely fix?

A) Include the original PR description in the retry along with the failed output and the specific validation error
B) Add an instruction to keep every field unchanged except the one named in the error message from the validator
C) Send only the failed field and its error, so the model cannot touch any of the other fields in the changelog entry
D) Run a second validator that rejects changes to any field other than the failed one, and retry again when it fires

<details>
<summary>Answer & explanation</summary>

**A)** Without the source document, the model has no grounding for the corrected output and fills gaps from guesses; the retry needs the original input, the failed output and the specific error together. Sending only the failed field loses cross-field context, an instruction not to change fields still leaves the model ungrounded, and a second validator stacks more retries on a request missing its source.

*Hint if stuck: A correction is only as good as the material the model can check it against.*
</details>

---

## Question 11
A bank's support agent extracts a refund amount from the customer's message to fill a refund form. A validator compares it with the transaction record, and when they differ it asks the model to re-extract. In many failing cases the customer simply typed a different figure from the actual charge, so retries keep returning the customer's number. What should the design do?

A) Keep retrying with stronger feedback until the extracted refund amount matches the figure in the transaction record
B) Replace the extracted amount with the transaction amount automatically whenever the two values do not match
C) Record both the customer's stated amount and the transaction amount, and have the agent confirm with the customer
D) Remove the validator, because the customer's message is the source of truth for what the customer is asking for

<details>
<summary>Answer & explanation</summary>

**C)** The extraction is correct: the customer really did state a different figure, so this is a conflict between sources, not an extraction error. Keeping both values and confirming with the customer resolves it, while pushing retries toward the record makes the model misreport the message, silently substituting hides a real discrepancy, and dropping the validator loses the check that found it.

*Hint if stuck: Ask whether the model misread the message or the message disagrees with the record.*
</details>

---

## Question 12
A CI step asks Claude to summarise failing tests as JSON and validates it with a library that raises "ValidationError: 1 validation error for Report". The pipeline appends that exception string to the retry, but retries fix the problem only about a third of the time. What change makes the feedback loop most effective?

A) Format the error to say which field failed, what value was returned and what was expected, and include that in the retry
B) Append the full JSON schema to the retry so the model can compare its whole output against the expected structure
C) Ask the model to validate its own output against the schema before responding, so that fewer retries are needed
D) Replace the exception string with a short generic note that the JSON did not match the schema and must be corrected

<details>
<summary>Answer & explanation</summary>

**A)** The retry needs specific, actionable feedback: which field, what came back and what was expected; a bare exception summary says only that something failed. A generic note is even less specific, resending the full schema makes the model hunt for the problem instead of pointing to it, and self-validation in the same pass catches little that it did not already get wrong.

*Hint if stuck: Feedback works when it points at the exact problem.*
</details>

---

## Question 13
A research system extracts statistics from studies for a meta-analysis. Reviewers find that when a paper reports raw counts but no percentage, the subagent computes a percentage and records it as if the paper stated it, and some of these are rounded differently from the source tables. What change best addresses this?

A) Instruct the subagent to stop computing percentages and leave the field empty whenever the paper does not state one
B) Record each value with a field saying whether it was stated in the paper or derived, and compute derived values in code
C) Ask the subagent to show its arithmetic in a notes field so reviewers can check the calculation behind each percentage
D) Let the subagent continue computing percentages but require that it always round them to one decimal place in output

<details>
<summary>Answer & explanation</summary>

**B)** Separating stated from derived values keeps provenance clear, and computing derived values in code makes them exact and consistent. Leaving the field empty discards information the analysis needs, showing arithmetic still mixes model maths with source facts, and a rounding rule fixes one symptom while derived numbers keep posing as stated ones.

*Hint if stuck: Readers need to know which numbers came from the paper and which were worked out.*
</details>

---

## Question 14
A customs-declaration pipeline retries with feedback on the failed field only, then re-validates only that field. Spot checks show some retried declarations now have a corrected tariff code but a changed country of origin that was correct on the first attempt. What change should the architect make?

A) Merge only the corrected field from the retry into the first output and discard every other field the retry returned
B) Lower the temperature on retries so that the model is less likely to change any fields it was not asked to correct
C) Re-run the full validation on every retried output and accept it only when the whole declaration passes all checks
D) Add an instruction to each retry asking the model to keep every other field exactly as it was in the first output

<details>
<summary>Answer & explanation</summary>

**C)** Retries can regress fields that were fine, so every attempt must pass the complete validation before it is accepted. Merging only the corrected field avoids this case but breaks when fields depend on each other, lower temperature reduces randomness without guaranteeing anything, and an instruction to leave fields alone is a probabilistic request with no check behind it.

*Hint if stuck: A retry is a new output and deserves the same checks as the first one.*
</details>

---

## Question 15
A fintech extraction pipeline validates Claude's invoice JSON against a schema plus business rules. When a rule fails — line_items sum to 4,210.50 but invoice_total reads 4,120.50 — the pipeline resends the exact same prompt, and all three retries return the same wrong output. What change makes the retry loop actually effective?

A) Raise the temperature on retries so each attempt samples a different output instead of repeating the same mistake
B) Include the exact validation failure in the retry prompt so the model knows what to fix and can reconcile the totals
C) Switch each retry to a larger, more capable model so the second attempt reasons more deeply about the invoice
D) Increase the retry count from three to ten so that one of the attempts eventually passes validation

<details>
<summary>Answer & explanation</summary>

**B)** A blind resend gives the model the identical input that already failed, so it reproduces the same failure; retries become corrective only when the specific error is fed back as new information. Raising temperature is gambling on randomness rather than correction, and neither a bigger model nor more attempts tells the model what was wrong.

*Hint if stuck: A retry can only outperform the first attempt if it receives information the first attempt did not have.*
</details>

---

## Question 16
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

## Question 17
A logistics company extracts line items and a total from carrier freight invoices. On about 3% of invoices the printed total does not equal the sum of the line charges — carrier billing errors the audit team is paid to find. Today the validator rejects those extractions as model mistakes, and the retry loop pressures the model until the numbers agree. How should the design change?

A) Keep a single total field and have post-processing overwrite whatever was extracted with the computed sum of the line items
B) Capture stated_total and calculated_total as separate fields with a conflict_detected flag, treating flagged rows as valid
C) Add a retry instruction telling the model to re-read the invoice as many times as needed until the two totals reconcile
D) Remove the total field from the schema entirely and compute invoice totals downstream from the extracted line items

<details>
<summary>Answer & explanation</summary>

**B)** A document that disagrees with itself is real data, not an extraction failure; the schema should preserve both the stated and the computed value with an explicit conflict flag so auditors see the discrepancy. Forcing reconciliation through retries or overwriting one value with the other destroys the billing errors the audit exists to catch, and dropping the total field entirely discards the printed total — without it there is nothing to compare the computed sum against, so the discrepancies vanish just the same.

*Hint if stuck: Sometimes a mismatch is the signal the business wants captured, not an error to retry away.*
</details>

---

## Question 18
A support-transcript pipeline flags messages that appear to contain payment card numbers, returning pii_flagged as true or false. Compliance reports a wave of false positives — 16-digit order IDs being flagged — but analysts cannot diagnose them because the output never indicates what triggered each flag. Which change best enables false-positive analysis?

A) Add a detected_pattern field that records the exact text span and pattern type that triggered each flag
B) Add a confidence score between 0 and 1 so analysts can filter out low-confidence flags before reviewing
C) Tighten the flagging instructions in the prompt so that only unambiguous card numbers are ever flagged
D) Have a second model re-check every flagged message and silently overwrite any flags it disagrees with

<details>
<summary>Answer & explanation</summary>

**A)** Diagnosing false positives requires seeing what the model thought it matched; a detected_pattern field turns each flag into auditable evidence that analysts can classify as a true card number or an order ID. Self-reported confidence scores are poorly calibrated and explain nothing about the trigger, while prompt tightening and second-model overwrites change behavior without ever revealing why misfires occur — and silent overwrites hide the evidence entirely.

*Hint if stuck: Analysts cannot classify a misfire without seeing the evidence the model believed it found.*
</details>

---

## Question 19
An insurance claims extraction service wraps its Claude calls in one retry loop. Logs reveal two failure modes handled identically with three immediate, unchanged resends: HTTP 529 overloaded errors, and schema-valid JSON that violates the rule that claim_amount must not exceed policy_limit. Neither mode improves across retries. What is the correct redesign?

A) Apply exponential backoff to both failure modes, since waiting longer between attempts gives the model time to produce a better answer
B) Treat both modes as terminal after a single attempt and route every failed claim directly into a human review queue
C) Branch the handling: backoff-and-resend unchanged for the 529s; for rule violations, retry with the failed check stated in the prompt
D) Raise both retry limits to ten attempts so transient capacity issues and rule violations alike eventually clear

<details>
<summary>Answer & explanation</summary>

**C)** The two failures have different root causes and need different retry strategies: 529s are transient infrastructure errors where an unchanged resend after backoff succeeds, while business-rule violations are deterministic and improve only when the model is told exactly which check failed. Backoff applied to both is the strongest distractor, but waiting does not alter a deterministic output; giving up after one attempt forfeits recoverable transients, and more blind attempts change nothing.

*Hint if stuck: Match each retry strategy to whether the failure is transient infrastructure or a deterministic output problem.*
</details>

---

## Question 20
A legal contract extraction pipeline retries with validation feedback up to six times. Telemetry shows 82% of contracts pass within two attempts, but 13% fail all six — and inspection reveals those contracts genuinely contain no governing-law clause. The feedback 'governing_law is missing, re-extract' just drives the model to fabricate jurisdictions on later attempts. What should the team change?

A) Raise the attempt cap from six to ten so the stubborn 13% of contracts get more chances to converge
B) Sharpen the retry feedback to list the exact contract sections where governing-law clauses conventionally appear
C) Loosen the validator to accept any plausible jurisdiction string so the later attempts pass instead of failing
D) Make governing_law nullable and treat a returned null as a terminal, valid outcome when the clause is absent

<details>
<summary>Answer & explanation</summary>

**D)** Retry feedback only helps when the failure is recoverable; when the source lacks the clause, every extra attempt just increases fabrication pressure, so the schema must let the model report absence as a valid terminal answer. Sharper feedback is the strongest distractor, but no hint can locate a clause that does not exist, more attempts compound the waste, and loosening the validator institutionalizes fabricated jurisdictions in legal data.

*Hint if stuck: Before improving the retries, ask whether success is even possible for the failing 13%.*
</details>

---

## Question 21
A corporate expense-report extractor has a single total_amount field. The team discovers the model sometimes returns the arithmetically correct sum of the receipt lines instead of the different total the employee actually wrote — silently masking the addition errors finance is required to flag. An engineer proposes adding 'always copy the written total verbatim; never recalculate' to the prompt. Which approach best serves the finance requirement?

A) Adopt the prompt instruction: always copy the written total verbatim and never recalculate from the line items
B) Add post-processing that recomputes the sum from the extracted line items and overwrites total_amount for consistency
C) Ask the model to output whichever total it judges more trustworthy, plus a free-text note explaining its choice
D) Split the schema into stated_total and calculated_total fields with a conflict_detected flag for finance review

<details>
<summary>Answer & explanation</summary>

**D)** The gap between the written total and the computed total is precisely the business signal, so the structure must preserve both values plus an explicit conflict flag. The prompt instruction is the strongest distractor, but it is probabilistic — and even when followed perfectly it hides the arithmetic error, because finance still needs the computed value to detect the mismatch. Overwriting with the recomputed sum erases the written total, and a free-text trust judgment is unparseable and unauditable.

*Hint if stuck: When two values can legitimately disagree, the output structure should be able to say so explicitly.*
</details>

---

## Question 22
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

## Question 23
A platform team runs two Claude-powered jobs: a security check that must pass before any PR can merge, and a weekly report scoring every repository's dependency hygiene for the architecture board. Both run synchronously and the bill has doubled. Which plan cuts cost without hurting developers?

A) Move both jobs to the Message Batches API and ask developers to wait for the security check results before merging on every pull request in the queue
B) Keep both synchronous and run the weekly dependency report only once a month so that it costs a quarter as much
C) Move the security check to the Message Batches API, since it runs most often, and keep the weekly report synchronous
D) Keep the security check synchronous and move the weekly dependency report to the Message Batches API with a custom_id per repository

<details>
<summary>Answer & explanation</summary>

**D)** Batches cost half as much but can take up to 24 hours with no latency guarantee, so they suit the weekly report where nobody is waiting, while the merge-blocking check stays synchronous. Batching the gate can stall merges for hours, and running the report less often cuts coverage rather than unit cost.

*Hint if stuck: Match the discounted, slower path only to work where nobody is waiting.*
</details>

---

## Question 24
A records team submits 20,000 scanned forms as a Message Batch and writes the results back to their database by matching the nth result line to the nth form submitted. After a run, spot checks show extracted names attached to the wrong forms. What is the fix?

A) Give each request a custom_id equal to the form's record ID and match results by custom_id, not by line position
B) Submit the forms in sorted order by record ID so that the results come back in the same sorted order as the input
C) Submit smaller batches of 1,000 forms so that the result order is more likely to match the order of submission
D) Include the form's record ID in the prompt and ask the model to echo it back at the start of every extracted record

<details>
<summary>Answer & explanation</summary>

**A)** Batch results can come back in any order, so each request needs a unique custom_id that ties its result to the input. Sorting or smaller batches does not make ordering guaranteed, and asking the model to echo an ID makes correlation depend on model output instead of the API's own identifier.

*Hint if stuck: Results from a batch do not promise to keep their place in line.*
</details>

---

## Question 25
A logistics company submits each day's delivery notes as a Message Batch, with custom_id set to the row number in that day's CSV, such as row-42. A monthly job merges results from all daily batches into one table, and the analytics team reports deliveries overwritten by other days' data. What change fixes this at the root?

A) Store each day's results in a separate table so that row numbers from different days never collide during the merge
B) Use a stable business identifier such as the delivery note number as the custom_id, unique across all batches
C) Merge the daily results in submission order so that the newest batch always wins and overwrites the older rows
D) Add the batch submission date to the result rows after download so that the merge job can tell days apart by date

<details>
<summary>Answer & explanation</summary>

**B)** Row numbers repeat every day, so they are not unique beyond one batch; a stable business identifier makes every result traceable wherever it ends up. Separate tables and post-download dates work around the collision instead of fixing the identifier, and letting the newest batch win silently discards real deliveries.

*Hint if stuck: An identifier only helps if it stays unique wherever the result travels.*
</details>

---

## Question 26
A research team wants to cut cost by moving its literature-review agent to the Message Batches API. Each review currently runs an agentic loop: Claude calls the team's own search_library tool, reads results, calls their fetch_fulltext tool (both executed by the team's code), and repeats until it has enough sources, then writes a summary. Which design is correct?

A) Submit each full review as one batch request with the tools defined, and let the agent loop inside the batch until it finishes
B) Submit each review as a batch with tool_choice set to any, so the agent is forced to call tools inside the batch request
C) Keep the agentic search loop synchronous, then batch the summarising step on the sources once they have been fetched
D) Batch the whole agent but set a long max_tokens so each request has enough room for all of its tool calls and summary

<details>
<summary>Answer & explanation</summary>

**C)** A batch request cannot run a client-side tool and continue mid-request, because your code never gets a chance to execute the tool and return the result. Keeping the loop synchronous and batching the self-contained summarising step gets the discount where it fits. Defining tools, forcing tool calls or raising max_tokens does not change that a batch request ends when Claude asks for one of your own tools.

*Hint if stuck: Ask who runs the tool and when, if a request is processed with nobody listening.*
</details>

---

## Question 27
A batch of 15,000 warranty-claim extractions finishes with 14,700 succeeded and 300 errored. Of the errors, 220 are invalid_request_error because their attachments were sent in a malformed content block, and 80 are server errors. What is the right recovery?

A) Resubmit all 300 errored requests unchanged as a new batch, since one retry usually clears transient batch errors
B) Fix the 220 invalid requests and send them synchronously, and drop the 80 server errors as an acceptable loss
C) Resubmit the whole batch of 15,000 with the fix applied so that every result comes from the same run and prompt
D) Fix the content block for the 220 invalid requests and resubmit them with the 80 server errors in a new batch

<details>
<summary>Answer & explanation</summary>

**D)** invalid_request_error means the body must be fixed before resending, while other errors can usually be retried as-is, and custom_ids let you resubmit only those 300. Resending the invalid ones unchanged fails again, rerunning all 15,000 pays twice for good results, and dropping retryable server errors loses data for no reason.

*Hint if stuck: Not every errored request needs the same treatment.*
</details>

---

## Question 28
A national retailer submits one 90,000-request batch every month-end to extract supplier rebate terms. During a period of heavy demand, the batch hit the 24-hour window with 6,000 requests marked expired. Downstream reports are due in three days. What should the team do?

A) Resubmit only the 6,000 expired requests, by custom_id, as a new batch now, which leaves ample time before the reports are due
B) Resubmit the entire 90,000-request batch, since an expired batch must be rerun from scratch to keep results consistent
C) Wait for the expired requests to finish in the background, since the API completes them after the window closes
D) Move all future month-end extraction to synchronous calls, since batches cannot be relied upon to finish on time

<details>
<summary>Answer & explanation</summary>

**A)** Expired requests never reached the model and are not billed, so resubmitting just those custom_ids as a new batch completes the job well inside the three-day deadline. Rerunning everything pays again for 84,000 good results, expired requests do not continue in the background, and abandoning batches throws away the discount for work with a three-day deadline.

*Hint if stuck: Find out exactly which requests are missing and why before redoing anything.*
</details>

---

## Question 29
A developer-experience team regenerates reference docs for 3,000 internal modules every Sunday so engineers see fresh docs on Monday morning. The job uses synchronous calls in a loop and takes six hours of runner time. Nothing reads the docs until Monday, and the team has been asked to cut the job's API cost. What is the best change?

A) Run the loop with more parallel synchronous workers so that the six-hour job finishes in under an hour on Sunday
B) Submit the 3,000 generation requests as a Message Batch on Sunday with a custom_id per module and collect results
C) Start the same synchronous loop at 2 AM on Monday instead of Sunday so the runner sits idle over the weekend
D) Move the job to run every night instead of Sundays so that each run covers fewer modules and costs less overall

<details>
<summary>Answer & explanation</summary>

**B)** A weekly job with a Monday deadline is a natural fit for the Message Batches API: half the cost and plenty of slack for its 24-hour window, with custom_id mapping results back to modules. More parallel workers finish faster at full price, moving the start time changes nothing about price and leaves little slack before engineers arrive, and nightly runs add total work rather than lowering unit cost.

*Hint if stuck: When the deadline is a day away, speed is not what you are paying for.*
</details>

---

## Question 30
A support organisation uses Claude both to answer customers live in chat and to score yesterday's 40,000 closed conversations for quality coaching, which supervisors read at 10 AM. Finance asks to move everything to the Message Batches API for the discount. What should the architect recommend?

A) Move both workloads to batches, and show chat customers a message saying a reply will arrive within the next day
B) Batch the live chat replies in small groups every minute so that customers wait only briefly for the discount
C) Batch the overnight quality scoring and keep the live chat replies on synchronous calls where customers are waiting
D) Keep both workloads synchronous, because mixing batch and synchronous calls makes the system harder to operate

<details>
<summary>Answer & explanation</summary>

**C)** The quality scoring is non-blocking work with a morning deadline, which suits the batch discount, while live chat has a customer waiting and needs synchronous responses. Batches have no latency guarantee, so small batches or delayed replies break the live experience, and keeping everything synchronous gives up a large saving for no real operational gain.

*Hint if stuck: Ask which of the two jobs has a person waiting on it.*
</details>

---

## Question 31
An insurer submitted 50,000 claim-extraction requests as one batch. Twelve hours later every request came back errored because each used a parameter the model does not accept. The prompt had been tested in a notebook, but the batch request bodies were built by a different script. What practice would have caught this earliest?

A) Polling the batch every few minutes so that the team could cancel it as soon as the first errored results appeared
B) Adding a validation step that checks each extracted claim against the schema as soon as the results are downloaded
C) Splitting the job into fifty batches of 1,000 so that a bad parameter would only affect a small fraction of requests
D) Sending a few request bodies from the batch script through the Messages API first, since batch params are checked later

<details>
<summary>Answer & explanation</summary>

**D)** Batch request params are validated asynchronously, so a bad body may only surface after the batch ends; sending a few real request bodies through the Messages API first catches it in seconds. Polling cannot see per-request errors until the batch is done, smaller batches would all share the same bug, and output validation runs after the requests have already failed.

*Hint if stuck: Test exactly what you will submit, using the path that answers immediately.*
</details>

---

## Question 32
A research group wants to screen 260,000 abstracts for relevance to a systematic review overnight. Their single Message Batch submission is rejected because it is too large. What should the architect do?

A) Split the abstracts into several batches within the limits, each request carrying a custom_id that is the abstract's ID
B) Shorten the screening prompt so that each request is smaller and the whole submission fits inside one batch
C) Switch the screening to synchronous calls, since workloads above the batch limits are not meant for the batch API
D) Screen only a random sample of 100,000 abstracts, since that is enough to estimate the relevance rate statistically in the IDE

<details>
<summary>Answer & explanation</summary>

**A)** Batches have per-batch limits on request count and size, and the docs recommend splitting very large datasets into multiple batches; stable custom_ids let results be merged afterwards. Synchronous calls give up the discount for overnight work, a shorter prompt cannot solve a request-count limit, and sampling fails a systematic review that must screen everything.

*Hint if stuck: The limit is per batch, not per job.*
</details>

---

## Question 33
A developer-tools team notices that their in-IDE assistant, which explains a selected code block when a developer presses a hotkey, is their largest cost line. A manager proposes moving those requests to the Message Batches API to halve the cost. What should the architect say?

A) Agree, as long as the IDE plugin polls frequently enough that most explanations still arrive within a few seconds
B) Disagree: a developer is waiting on each explanation, and batches give no latency guarantee, so it must stay synchronous
C) Agree, and add a loading spinner so that developers understand that explanations can take a little longer to arrive from the API
D) Agree, but only for explanations of very large code blocks, since those are the most expensive individual requests

<details>
<summary>Answer & explanation</summary>

**B)** Interactive requests with a person waiting must stay synchronous, because batches can take up to 24 hours with no latency guarantee. Frequent polling does not speed up processing, large blocks still have a developer waiting on them, and a spinner cannot hide a delay that might be hours long.

*Hint if stuck: Discounts that come with no promise about timing only fit work nobody is watching.*
</details>

---

## Question 34
A pipeline downloads the full results of a 100,000-request extraction batch into memory before parsing, and the worker crashes with out-of-memory errors on the largest batches. The same results must be written to a database keyed by custom_id. What is the recommended approach?

A) Increase the worker's memory allocation so the full results file can be loaded and parsed in a single pass
B) Ask the model to return shorter outputs so that the results file is small enough to load into memory
C) Iterate over the results as a stream, handling each result by its custom_id and type as it is read
D) Cancel any batch larger than 20,000 requests and resubmit it as smaller batches before retrieving results

<details>
<summary>Answer & explanation</summary>

**C)** The docs recommend streaming batch results rather than downloading them all at once; handling each line by custom_id and result type keeps memory flat at any size. More memory postpones the problem, shorter outputs trade away extraction quality, and cancelling large batches discards work that is already done.

*Hint if stuck: Results come one per line, so they do not need to be held all at once.*
</details>

---

## Question 35
Ninety minutes into a 30,000-request batch of lease extractions, an engineer sees a handful of errored results for oversized documents and proposes cancelling the whole batch, fixing those few and resubmitting all 30,000. What should the team lead advise?

A) Agree, because results from a batch that contained errors are not reliable and must be regenerated in a clean run
B) Agree, but resubmit the 30,000 synchronously this time so that each error is visible the moment it happens
C) Let the batch finish, then rerun all 30,000 with the fix so that every lease is extracted by the same request shape
D) Let the batch finish, since one failed request does not affect the others, then fix and resubmit only failed custom_ids

<details>
<summary>Answer & explanation</summary>

**D)** One failed request does not affect the others in a batch, so the efficient path is to let it finish, then fix and resubmit only the failed custom_ids, for example by chunking the oversized leases. Treating the whole batch as tainted or rerunning everything pays twice for good results, and synchronous calls give up the discount just to watch errors arrive sooner.

*Hint if stuck: Ask whether one bad request actually affects the rest.*
</details>

---

## Question 36
A support team wants Claude to draft updated help-centre articles every Friday night by summarising the week's clustered tickets, about 1,500 clusters. Editors review drafts on Monday. Meanwhile, the live support agent answers customers using the current articles. How should the article drafting run?

A) As a Message Batch on Friday night, with each cluster's ID as its custom_id, so drafts are ready well before Monday
B) As synchronous calls from the live support agent, drafting articles in between customer conversations during the week
C) As synchronous calls on Friday night with high parallelism, so that all drafts finish before midnight on Friday
D) As a Message Batch submitted Monday morning, so editors see the drafts appear soon after they arrive for work

<details>
<summary>Answer & explanation</summary>

**A)** A weekend of slack fits the batch's 24-hour window at half the cost, and custom_id ties each draft back to its cluster. Running drafts through the live agent competes with customers, high parallelism pays full price to finish early for no benefit, and submitting on Monday morning risks drafts arriving after the review should have started.

*Hint if stuck: Use the slack in the schedule to pay less, and leave enough of it.*
</details>

---

## Question 37
A research system must screen 25,000 papers for inclusion, then do a deep analysis using the team's own client-side data tools, on the few hundred that qualify, for a report due in a week. The team wants to minimise cost without missing the deadline. Which pipeline fits best?

A) Run the deep tool-assisted analysis on all 25,000 papers as one batch so that screening and analysis happen together
B) Screen with a Message Batch, then run the deep tool-assisted analysis synchronously on the qualifying papers only
C) Skip screening and run the deep analysis synchronously on every paper, since a week is enough time to finish it
D) Screen all 25,000 papers synchronously so that the shortlist is ready quickly, then batch the deep analysis afterwards

<details>
<summary>Answer & explanation</summary>

**B)** Screening is single-turn, high-volume and non-urgent, which is ideal for a batch, while the deep analysis needs tool calls mid-task, which a batch request cannot do when the tools run in the team's own code, so it runs synchronously on the small shortlist. Batching the tool-assisted analysis cannot run the tools, synchronous screening pays double on the largest stage, and analysing every paper in depth wastes most of the budget.

*Hint if stuck: Separate the work that needs tools from the work that does not.*
</details>

---

## Question 38
A CI team wants a nightly batch job to triage the day's flaky-test failures. In their prototype, Claude calls a get_logs tool for each failure before classifying it. The team wants the batch discount. What is the simplest design that works?

A) Define get_logs as a tool in each batch request so that Claude can call it while the batch request is being processed
B) Keep the whole nightly triage on synchronous calls, because tool-dependent work can never use batch processing
C) Fetch each failure's logs in code before submitting, include them in the request, and batch the classification step
D) Use tool_choice to force a single get_logs call per request, so each batch request needs only one round trip

<details>
<summary>Answer & explanation</summary>

**C)** A batch request cannot pause for your code to run a tool, so the logs must already be in the request; fetching them first turns triage into a single-turn task that batches well. Defining or forcing the tool still ends the request at the tool call with no result, and giving up on batching is unnecessary once the data is fetched up front.

*Hint if stuck: If the tool's answer is predictable, it can be fetched before the request is sent.*
</details>

---

## Question 39
A batch monitor marks a nightly extraction job as complete as soon as the batch's processing status changes to ended, and the downstream load then runs. Weeks later, finance finds invoices that were never extracted. What should the monitor do instead?

A) Check that the processing status is ended and that the results file was downloaded without any network errors
B) Wait an extra hour after the batch ends before loading, so that late results have time to arrive in the file
C) Compare the number of result lines with the number of submitted requests and alert only when the two counts differ
D) Count result types and send any errored or expired custom_ids back for retry before marking the job complete

<details>
<summary>Answer & explanation</summary>

**D)** A batch that has ended can still contain errored, canceled or expired requests, so completion has to be judged per result, retrying failed custom_ids before the job is marked done. A clean download says nothing about each result, waiting longer adds no results, and line counts match even when many lines are errors.

*Hint if stuck: Ended describes the batch, not whether each request worked.*
</details>

---

## Question 40
A medical-coding team's batch reports 9,950 of 10,000 requests as succeeded and loads them straight into the billing system. Billing then rejects a cluster of records with truncated code lists. Inspection shows those succeeded messages stopped with max_tokens. What should change in the pipeline?

A) Treat succeeded only as a message created, validate each result and stop_reason, and resubmit truncated custom_ids with more room
B) Trust the succeeded type for loading, but ask billing to reject truncated records so the team can fix them by hand
C) Resubmit the entire 10,000-request batch with a higher max_tokens limit so that no result can be truncated again
D) Treat any max_tokens result as an errored request and leave it out of the billing load until the next monthly batch is submitted and processed

<details>
<summary>Answer & explanation</summary>

**A)** Succeeded means a message was created, not that the extraction is complete or valid, so each result still needs validation, including its stop_reason, and only the truncated custom_ids need resubmitting with more output room. Relying on billing to catch errors puts bad data in a production system, rerunning everything pays twice for good results, and waiting a month delays the fix.

*Hint if stuck: A request can succeed while its answer is still unusable.*
</details>

---

## Question 41
A platform team runs a nightly deprecation audit over 7,500 source files using parallel synchronous API calls at 2 a.m. The findings feed a weekly cleanup rotation, so nothing downstream ever blocks on the results, and the job now accounts for 30% of monthly model spend. Which change cuts cost without reducing coverage?

A) Downgrade the audit to a weekly run so the spend is divided by seven
B) Add cache_control breakpoints to every request to discount the per-file token cost of the audit
C) Strip comments and whitespace from each file before sending to shrink input tokens
D) Submit the audit through the Batch API with a custom_id per file and poll until results arrive

<details>
<summary>Answer & explanation</summary>

**D)** The audit is fully non-blocking — exactly the profile the Message Batches API targets: a 50% discount, results within 24 hours with no latency SLA, and custom_id to match each result back to its file. A weekly cadence cuts how often issues are caught rather than unit cost, prompt caching only discounts a stable shared prefix and not the unique file content dominating this spend, and stripping comments yields marginal savings while distorting the line numbers the audit reports.

*Hint if stuck: When nobody is waiting on the response, one pricing model exists specifically for that situation.*
</details>

---

## Question 42
To save money, a team moved its required pre-merge license-compliance check onto the Batch API. Most batches come back within 20 minutes, but some PRs sit blocked for six hours, and one Friday a batch took nearly a full day and froze all merges. What is the correct architecture?

A) Split each submission into smaller batches so individual batches complete faster
B) Run the blocking check synchronously via claude -p and reserve the Batch API for non-blocking audits
C) Poll batch status every 30 seconds instead of every 10 minutes to retrieve results sooner
D) Submit each PR's check as its own single-item batch so it never queues behind other, larger batch jobs

<details>
<summary>Answer & explanation</summary>

**B)** The Batch API promises results within 24 hours and offers no latency SLA, so anything that gates merges must run synchronously. Polling cadence and batch sizing only change when you notice completion, not when it happens — the 24-hour window applies regardless of how small the batch is, including a single-item batch.

*Hint if stuck: One API trades a latency promise for a discount — match it only to work where nobody is blocked.*
</details>

---

## Question 43
A structured-extraction team submits a Message Batches job covering 8,000 archived support tickets, each request tagged with a custom_id. Results show 7,760 successes, 180 failures for exceeding the maximum request size, and 60 failures from intermittent server errors. What is the most efficient recovery?

A) Resubmit the full 8,000-request batch from scratch, since the 50% batch discount makes a complete rerun affordable
B) Resubmit all 240 failed requests unchanged as a new batch and repeat the resubmission until every request succeeds
C) Use the custom_ids to isolate failures, chunk the 180 oversized tickets, and resubmit them plus the 60 transient ones
D) Convert all 240 failed requests into synchronous API calls so an engineer can step through and debug each one interactively

<details>
<summary>Answer & explanation</summary>

**C)** custom_id exists precisely so failures can be isolated and resubmitted without redoing completed work, and the two failure classes need different treatment: oversized requests fail deterministically and must be fixed before resubmission, while transient server errors can be retried as-is. Resubmitting all 240 unchanged guarantees the 180 oversized requests fail again, rerunning all 8,000 pays twice for finished work, and hand-debugging 240 requests synchronously forfeits the discount and the automation.

*Hint if stuck: Separate the failures that will recur deterministically from the ones that were just bad luck.*
</details>

---

## Question 44
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

## Question 45
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

## Question 46
A media company summarizes each day's articles through the Batch API, submitting at 8:00 PM for a newsletter that ships at 8:00 AM. Results had arrived within three hours for months — until one night they had not arrived by 7:30 AM, the team panic-submitted a duplicate batch, and the newsletter shipped late and double-billed. What is the most robust redesign?

A) Submit rolling batches as articles publish during the day, with a synchronous fallback for stragglers at a hard cutoff
B) Keep the 8:00 PM submission but automatically submit a duplicate batch whenever results are not ready by 4:00 AM the next morning
C) Keep the 8:00 PM submission and add a monitoring alert that pages the on-call engineer whenever results run late
D) Move the entire workload to synchronous calls so every summary reliably completes within minutes of submission

<details>
<summary>Answer & explanation</summary>

**A)** The pipeline was built on the typical three-hour turnaround, but the only guarantee is completion within 24 hours; submitting earlier in rolling waves keeps most volume at batch pricing while the synchronous cutoff handles whatever the window has not delivered. Going fully synchronous is the strongest distractor but forfeits the 50% discount on a workload that mostly fits the window, automated duplicate batches just systematize the double-billing incident, and paging a human changes nothing about when results arrive.

*Hint if stuck: A months-long streak of fast turnarounds is an observation, not a service guarantee.*
</details>

---

## Question 47
In a healthcare records batch, 600 of 12,000 requests failed with request-too-large errors because each embedded a full multi-year patient history. The on-call engineer correctly used custom_ids to isolate exactly those 600, resubmitted them unchanged in a new batch — and all 600 failed again with the identical error. What did the engineer miss?

A) Request-too-large failures are deterministic — the oversized histories must be chunked or trimmed before any resubmission can succeed
B) Resubmitted requests need fresh custom_ids, because the Batch API rejects custom_ids it has already processed once
C) A model with a larger context window should have been selected, which raises the maximum request size the batch will accept per request
D) The 600 requests should have been retried as synchronous calls, which accept larger payloads than batch requests do

<details>
<summary>Answer & explanation</summary>

**A)** Targeted resubmission via custom_id was the right instinct, but only transient failures can be retried as-is; an unchanged oversized request exceeds the same limit on every attempt, so the payload itself must be fixed first. The custom_id reuse rule and the larger-payload mechanics in the other options are invented — none of them changes a request that is over the size limit.

*Hint if stuck: Resubmitting as-is only works when the cause of the failure can change between attempts.*
</details>

---

## Question 48
A fintech team's CI job runs one claude -p review over each pull request. Reviews of a recent PR caught a rounding bug inside ledger.py but missed that the same PR renamed a field in models.py that three other services still read. Every individual file looked fine in isolation. What change to the review architecture addresses this miss?

A) Use focused per-file passes plus a separate integration pass that receives the cross-file changes and their call sites
B) Raise the review's max output tokens so the reviewer has room to comment on the relationships between files
C) Tell the reviewer in the system prompt to always consider how each change might affect other files in the repository
D) Run the same single-pass review twice and merge the two sets of comments, so that a finding missed once may appear the second time

<details>
<summary>Answer & explanation</summary>

**A)** Per-file passes are good at local defects but by design cannot see how a change in one file breaks consumers elsewhere, so a dedicated cross-file integration pass is needed. A prompt reminder to consider other files does not give the reviewer the call sites it needs, running the same pass twice repeats the same blind spot, and output length was never the constraint.

*Hint if stuck: Ask which pass in the pipeline ever looks at the seams between files.*
</details>

---

## Question 49
A developer uses Claude Code to write a rate-limiter middleware, then types in the same session: 'Act as a strict senior reviewer and find every flaw.' The review lists only cosmetic nits. A colleague later finds the limiter resets its counter on every deploy. Which workflow would most reliably have caught the defect?

A) Keep the same session but switch to a stronger persona prompt that says the code was written by an untrusted contractor
B) Open a fresh Claude Code session that sees only the diff and the requirements, and ask it to review the middleware
C) Ask the same session to review the code three more times and only accept a pass when all reviews agree
D) Have the same session write unit tests for the middleware first, then review the code with those tests already in its context

<details>
<summary>Answer & explanation</summary>

**B)** A same-session reviewer still holds the reasoning that produced the code, so it tends to confirm those decisions no matter what persona it is given. A fresh session without the generation rationale reviews the code on its own merits. Repeating the review in the same session or adding tests written by the same context keeps the shared blind spot.

*Hint if stuck: Persona wording does not change what is already sitting in the context window.*
</details>

---

## Question 50
A CI review bot posts about 25 inline comments per PR, and engineers have started ignoring all of them because roughly half are false positives. Recall on real bugs is good. The team lead wants fewer comments without losing the real bugs. Which design change best fits?

A) Add a prompt line telling the reviewer to report only issues it is completely certain about and skip anything speculative
B) Cap the bot at five comments per PR, keeping whichever findings the reviewer happens to list first in its output
C) Add a verification pass in which a separate instance checks each candidate finding against the code and drops unconfirmed ones
D) Switch the bot to only review files over 200 changed lines, since that is where most of the real bugs have been found

<details>
<summary>Answer & explanation</summary>

**C)** A find-then-verify pipeline keeps the recall of the first pass and uses an independent check to filter false positives before anything is posted, which is how Anthropic's own Code Review is built. A certainty instruction relies on the model's self-assessment and tends to cut real bugs too, while a hard comment cap or a file-size filter drops findings by position or size rather than by validity.

*Hint if stuck: Separate generating candidate findings from deciding which ones are real.*
</details>

---

## Question 51
An extraction pipeline pulls 30 fields from commercial leases. The team adds a second step in which the same conversation is asked 'double-check every field you just extracted.' Accuracy barely moves, and the misread renewal dates stay wrong. What should replace the double-check step?

A) A second call in the same conversation that re-reads the lease with temperature lowered to zero for consistency
B) A rule that the model must mark any field it felt unsure about as low confidence, then auto-accept the rest
C) A longer system prompt for the original extraction listing every date format that commercial leases commonly use
D) An independent instance that re-reads the source lease and checks the fields without seeing the first pass's reasoning

<details>
<summary>Answer & explanation</summary>

**D)** Asking the same context to re-check its work tends to reproduce its original reading, so an independent pass over the source document is what surfaces disagreements worth examining. Lowering temperature in the same conversation keeps the same reasoning, a longer list of date formats may help the first pass but is not a review step, and self-flagged doubt is not a calibrated signal.

*Hint if stuck: A checker that already believes the answer is a weak checker.*
</details>

---

## Question 52
A research system's report subagent drafts a 20-page market analysis. The coordinator wants a quality gate before publishing that catches unsupported claims. Budget allows one extra model call per report section. How should the gate be designed?

A) Send each section and its cited sources to a separate reviewer instance that flags claims the sources do not support
B) Ask the report subagent to append a self-assessment section rating how well each claim is supported by its sources
C) Have the coordinator reread the whole report in its own context window and approve it for publishing if nothing looks inconsistent overall
D) Have the report subagent regenerate each section once and publish whichever version cites the larger number of sources

<details>
<summary>Answer & explanation</summary>

**A)** An independent reviewer per section, given the section and its sources but not the drafting context, can check claims against evidence without the writer's bias, and section-sized inputs keep its attention focused. A writer's self-assessment inherits its own blind spots, a single whole-report reread dilutes attention across 20 pages, and more citations is not the same as supported claims.

*Hint if stuck: Combine independence from the writer with a scope small enough to check carefully.*
</details>

---

## Question 53
A CI review pipeline now asks the reviewer to output each finding with a severity and a confidence score. Leadership wants to use those fields to reduce the human workload. Which routing design uses them best?

A) Post every finding as a blocking comment regardless of score, so the scores only serve as metadata for later reporting
B) Post high-confidence findings directly; route low-confidence or high-severity ones to a verification pass or a human first
C) Drop all findings below a confidence of 0.9 without anyone seeing them, since low-confidence findings are mostly noise
D) Sort the findings by confidence and post only the top three on each PR, so that engineers are never overwhelmed by the volume of review output

<details>
<summary>Answer & explanation</summary>

**B)** Per-finding confidence is most useful as a routing signal: confident findings flow straight through while uncertain or high-stakes ones get extra scrutiny. Silently discarding low-confidence findings throws away real bugs, a top-three cap ignores severity, and treating scores as metadata only leaves the noise problem untouched.

*Hint if stuck: Confidence decides where a finding goes next, not whether it exists.*
</details>

---

## Question 54
A platform team splits PR review into three parallel reviewer instances: security, performance and correctness. Engineers now complain that the same SQL injection appears as three slightly different comments, and two of the reviewers disagree on its severity. What step is missing from the architecture?

A) Merging the three reviewers back into a single generalist reviewer so that no finding can ever be reported more than once
B) A rule that only the security reviewer may comment on injection issues, enforced by a line in each of the other two prompts
C) An aggregation step that deduplicates overlapping findings across reviewers and reconciles each into one ranked comment
D) Running the three reviewers sequentially so that each one can read the comments the earlier reviewers have already posted

<details>
<summary>Answer & explanation</summary>

**C)** Multi-instance review needs a final aggregation stage that merges duplicates and settles severity before anything reaches the PR. Collapsing back to one generalist loses the depth the specialists provide, chaining reviewers so later ones see earlier comments erodes their independence, and a prompt-level ownership rule is best-effort and does not resolve severity conflicts.

*Hint if stuck: Parallel reviewers need something downstream that turns many outputs into one.*
</details>

---

## Question 55
A team in Claude Code wants a writer/reviewer workflow for a new OAuth callback handler. One engineer proposes giving the reviewer session the full transcript of the writer session 'so it understands the design choices.' Another proposes giving it only the diff and the spec. Which should the architect choose, and why?

A) The full transcript, because the reviewer cannot judge design choices without the reasoning that led to them
B) The full transcript plus the spec, because more context always produces a more accurate and thorough review
C) Neither of them; the reviewer should instead get a short summary written by the writer session explaining which areas it should check most closely
D) Only the diff and the spec, because a reviewer that reads the writer's reasoning tends to adopt it rather than test it

<details>
<summary>Answer & explanation</summary>

**D)** The value of a second instance is independence; handing it the writer's transcript reintroduces the same rationale that produced any blind spots. A writer-authored summary of what to check steers the reviewer toward the writer's view of the risky areas, and more context is not automatically better when it carries bias.

*Hint if stuck: What makes a second reviewer worth paying for in the first place?*
</details>

---

## Question 56
A legal-tech team uses Claude to review 400-page contract bundles for risky clauses. A single review call over the whole bundle catches risks in the opening and closing sections but misses an indemnity clause on page 210. What is the most effective redesign?

A) Review each contract section in its own pass, then run a final pass over the collected findings for cross-section conflicts
B) Move the instructions to the end of the prompt and ask the model to give every section equal attention as it reads
C) Ask the single review call to first list every clause it read, as proof it covered the whole bundle, before giving findings
D) Use extended thinking with the largest allowed budget so the single pass can reason more carefully about the middle pages

<details>
<summary>Answer & explanation</summary>

**A)** Attention over a very long input is uneven, and the middle is read least reliably, so chunking into per-section passes followed by a cross-section pass over the findings is the structural fix. Asking for equal attention or a clause inventory does not change how attention is distributed, and a bigger thinking budget does not fix dilution of the input itself.

*Hint if stuck: When one context must cover too much, change the shape of the work.*
</details>

---

## Question 57
A support organisation wants automated QA on agent replies before they are sent for refunds above $200. The draft design has the support agent append 'Before sending, review your reply for policy compliance' to its own instructions. Policy violations still slip through at the same rate. What should the architect propose?

A) Make the self-review instruction more specific by listing all fourteen refund policy rules directly inside it
B) Route qualifying replies to a separate checker instance that compares the reply and case facts against the refund policy
C) Have the agent rate its own compliance from 1 to 10 and hold any reply that it scores below 8 for a human to check
D) Lower the threshold so that the self-review instruction applies to every refund reply the agent sends, and not only to the ones above $200

<details>
<summary>Answer & explanation</summary>

**B)** A separate checker that sees the reply, the case facts and the policy is not anchored on the agent's reasoning, so it catches violations the agent rationalised. Listing policy rules or widening the scope of self-review keeps the same blind spot, and self-rated compliance scores are poorly calibrated.

*Hint if stuck: The agent that made the decision is the weakest judge of it.*
</details>

---

## Question 58
A CI pipeline runs a per-file review pass and then an integration pass. The integration pass gets the full 9,000-line diff again and keeps re-reporting per-file nits while still missing interface mismatches. What should the integration pass receive instead?

A) The full diff again, but with a prompt telling it to ignore anything that the per-file passes already reported
B) Only the files with the highest number of per-file findings, since those are the most likely places for broken interfaces
C) A focused input: changed public signatures, exports and schemas, plus their call sites, alongside the per-file findings
D) The per-file findings only, so it can rank and deduplicate them without needing to see any of the code at all

<details>
<summary>Answer & explanation</summary>

**C)** The integration pass exists to check seams, so it should get exactly the interface-level material plus the per-file results, not a full re-read that dilutes attention and invites repeat nits. Findings alone cannot reveal mismatches that no per-file pass noticed, picking the noisiest files misses quiet interface changes, and an ignore instruction leaves the dilution in place.

*Hint if stuck: Give each pass the material that matches its job.*
</details>

---

## Question 59
An engineer asks Claude Code to generate unit tests for a date-parsing utility it wrote earlier in the same session. All tests pass, but production fails on leap-day inputs. The team wants the tests to act as a real check on the code. What is the best change?

A) Ask the same session to list the edge cases it considered before writing tests, then add any it marks as untested
B) Tell the same session to write tests that try their hardest to break the code, with heavy emphasis on adversarial edge cases such as leap years
C) Require a code coverage target of 100 percent so the session is forced to write a test for every branch in the parser
D) Generate the tests in a separate session that receives only the function signature and the spec, not the implementation

<details>
<summary>Answer & explanation</summary>

**D)** Tests written by the context that wrote the code tend to encode the same assumptions, so the leap-day gap appears in both. A separate session working from the spec tests the intended behaviour instead. Adversarial wording and self-listed edge cases come from the same blind context, and branch coverage does not reveal a missing branch.

*Hint if stuck: Tests share the blind spots of whoever designed them.*
</details>

---

## Question 60
A developer-productivity agent proposes a refactor across 40 files of a legacy billing module. The staff engineer wants an automated review before a human looks at it, and the agent's session is already near its context limit. What review setup is most appropriate?

A) Spawn fresh reviewer instances for groups of related files, then run one integration review over the module's public interfaces
B) Have the same session review the files in reverse order so it reads the last-changed files while its attention is strongest
C) Run /compact in the agent's session to free space, then ask it to review its own refactor while the plan is still fresh
D) Skip the automated review and send all 40 files to the staff engineer, since AI review adds little to a large refactor

<details>
<summary>Answer & explanation</summary>

**A)** Fresh reviewer instances avoid both the near-full context and the self-review bias, and grouping files keeps each pass focused while a final integration review covers the module's seams. Compacting and self-reviewing keeps the bias and loses detail, re-ordering does not create independence, and dropping automation pushes 40 files of review onto one person.

*Hint if stuck: Two problems here, a full context and an author reviewing itself; one design fixes both.*
</details>

---

## Question 61
An invoice extraction pipeline adds a reviewer instance that re-extracts totals independently. When the two instances disagree, the current code simply keeps the second instance's value. Error rates did not improve. What should happen on a disagreement?

A) Always keep the first instance's value, because the original extraction had the most complete view of the document
B) Treat it as a signal: route the field to a human or targeted re-check with both values and the source span
C) Run a third instance and silently keep whichever value two of the three instances agree on, without any further check
D) Average the two numeric values so that small discrepancies between the instances cancel each other out over time

<details>
<summary>Answer & explanation</summary>

**B)** The point of independent passes is to surface disagreements that mark risky fields, so a disagreement should trigger review rather than an arbitrary pick. Preferring either instance discards that signal, averaging produces a number that matches neither document reading, and a silent majority vote can still be wrong on the same hard field without anyone looking.

*Hint if stuck: Two readings that differ are telling you something.*
</details>

---

## Question 62
A team asks why their Claude Code CI review over a 6-file PR should be split into per-file passes plus an integration pass when the whole diff fits easily in the context window. Which reasoning should the architect give?

A) Context windows silently truncate long diffs, so splitting is the only way to guarantee every line is actually received
B) Splitting into passes is mainly a cost optimisation, because many small calls are always cheaper than one large call
C) Fitting in the window is not even attention; focused passes deepen each file's review and a separate pass covers the seams
D) Per-file passes let the reviewer skip integration concerns entirely, removing the most error-prone part of the review

<details>
<summary>Answer & explanation</summary>

**C)** Even inputs well within the window get uneven attention, so per-file passes improve local depth and an integration pass handles cross-file effects. Splitting is not mainly about cost and may cost more, the window does not silently truncate a diff that fits, and integration concerns are kept, just moved to their own pass.

*Hint if stuck: Capacity and attention are different things.*
</details>

---

## Question 63
A research coordinator runs a fact-check step on its final report. Today the fact-checker is the same synthesis subagent that wrote the report, re-invoked with 'verify every number.' It passes reports in which a market-size figure was copied from the wrong year. What is the root-cause fix?

A) Give the synthesis subagent a stricter fact-check prompt that lists the kinds of numeric errors it tends to make
B) Have the synthesis subagent cite a page number for every figure in the report, so that it is forced to go back and look each one up again
C) Add a final instruction asking the synthesis subagent to state its confidence in each figure and drop the low ones
D) Use a separate fact-check instance that compares each figure against the source excerpts, without the synthesis reasoning

<details>
<summary>Answer & explanation</summary>

**D)** The checker shares the writer's context and assumptions, so the wrong-year figure looks right to it. An independent instance that checks figures against source excerpts is not anchored on that reasoning. Stricter prompts, forced citations and self-stated confidence all leave the same instance judging its own work.

*Hint if stuck: Who is doing the checking matters more than how hard they are told to check.*
</details>

---

## Question 64
A team designing a review pipeline asks whether the reviewer instance should also be allowed to edit and push fixes for what it finds, to save a round trip. The repository has strict change-control requirements. What should the architect recommend?

A) Keep the reviewer read-only and posting findings; any fixes go through a separate change that is itself reviewed
B) Let the reviewer push fixes, but only for findings it rates as high confidence, and leave the rest as review comments
C) Let the reviewer fix issues in the same session and then review its own fixes, so that every change is still reviewed once
D) Let the reviewer push fixes directly, since it already understands the issues and fixing them in the same pass is fastest

<details>
<summary>Answer & explanation</summary>

**A)** A reviewer that also writes and pushes fixes becomes an unreviewed author, which breaks both independence and change control. Anthropic's Code Review is read-only and never approves or pushes for this reason. Self-rated confidence is not a safe gate for unreviewed pushes, and having it review its own fixes reintroduces self-review.

*Hint if stuck: A reviewer that writes code has become an author.*
</details>

---

## Question 65
A data team uses Claude to generate SQL migrations in a developer-productivity workflow. They want a review step that catches destructive operations such as dropped columns. Two designs are on the table: an independent reviewer instance, or a deterministic check in code that blocks any migration containing DROP or ALTER ... DROP without a waiver. Which is the best design?

A) Use only the deterministic check, because an AI reviewer adds no value once a hard block exists
B) Use the deterministic block for known-destructive patterns and an independent reviewer for logic no pattern catches
C) Use only the independent reviewer instance, because a model reviewer can understand the intent behind each migration
D) Use only the reviewer instance, with a system-prompt rule to always reject any migration that drops or alters a column

<details>
<summary>Answer & explanation</summary>

**B)** Known-destructive patterns that must never slip through belong in a deterministic gate, while an independent reviewer covers logic errors that no pattern can express. Relying only on the model, even with a firm instruction, leaves a non-zero miss rate on the critical case, and relying only on the regex misses semantic mistakes.

*Hint if stuck: Must-never-happen rules and judgment calls need different mechanisms.*
</details>

---

## Question 66
An architect is designing a generic review harness for several Claude-generated artifacts. For each finding, the harness asks the reviewer to output the location, the issue, the evidence and a confidence level. A teammate asks why the confidence field is needed if every finding will be seen eventually. What is the best answer?

A) Confidence is mainly for audit records; it has no effect on how findings flow through the harness once produced
B) Confidence lets the harness skip human review for any batch whose average confidence clears a threshold tuned on past reviews
C) Confidence lets the harness route findings: confident ones go straight through, uncertain ones get verification or a human first
D) Confidence tells the reviewer to work harder on low-confidence areas, which improves accuracy within the same pass

<details>
<summary>Answer & explanation</summary>

**C)** Per-finding confidence is a routing signal that spends scarce verification and human attention where it matters most. Batch-level averages can hide individual weak findings, treating confidence as audit-only wastes it, and asking for confidence does not by itself make the same pass more accurate.

*Hint if stuck: Think about where the next unit of review effort should go.*
</details>

---

## Question 67
A healthcare intake startup has one Claude Code session generate a FHIR message parser and then, in the same session, asks "now review the code you just wrote for bugs." The review comes back clean, yet a null-handling defect ships to staging that week. What is the architectural flaw?

A) The reviewer shares the generator's context, so it inherits and re-confirms the same reasoning that produced the bug
B) The review prompt was too gentle; it should have demanded "be extremely critical and assume bugs exist"
C) The session ran low on context window before the review, so the code was only partially re-read
D) The generation step used too small a thinking budget, leaving the review without reasoning depth

<details>
<summary>Answer & explanation</summary>

**A)** Same-session self-review keeps the entire generation rationale in context, so the model tends to confirm its own earlier decisions rather than challenge them. The fix is a separate reviewer session that sees only the code, not the reasoning behind it. Harsher prompt wording does not remove the bias because the original justifications are still sitting in the reviewer's context, and neither context exhaustion nor thinking budget explains why a clean-looking review systematically misses the generator's own mistakes.

*Hint if stuck: Consider what this reviewer can see that a genuinely independent reviewer never would.*
</details>

---

## Question 68
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

## Question 69
A CI pipeline runs claude -p to review pull requests. A 14-file PR fits comfortably in the context window at roughly 60k tokens, yet the review consistently produces detailed findings for the first four or five files and shallow or zero findings for the rest — even when humans later find real bugs in files 10 through 14. What is the most likely cause?

A) The context window was silently truncated, so the later files were never actually delivered to the model
B) Attention dilutes across a 14-file single pass, so files later in the prompt receive progressively shallower scrutiny
C) The model classifies files appearing after the first few as test fixtures and automatically deprioritizes them during review
D) The JSON output schema caps the number of findings, cutting off results before the later files are reported

<details>
<summary>Answer & explanation</summary>

**B)** Fitting within the context window does not guarantee uniform scrutiny: a single pass over 14 files dilutes attention, and material later in the prompt gets shallower treatment. Truncation is ruled out because 60k tokens fits easily, the model has no built-in rule that demotes later files to test fixtures, and a schema cap would cut findings by count rather than consistently sparing the first files and starving the last ones. The fix points toward per-file review passes, not a bigger window.

*Hint if stuck: Fitting inside the context window is not the same as receiving equal scrutiny everywhere within it.*
</details>

---

## Question 70
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

## Question 71
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

## Question 72
A platform team's GitHub Actions job uses claude -p to generate a database migration script, then resumes the same session with a second claude -p --resume call asking: review the migration you just wrote for bugs. The review step almost always replies that the code is correct, yet defects keep reaching production. What should the team change?

A) Run the review in a separate headless session that receives only the diff and schema context
B) Strengthen the review prompt to say: be extremely critical and assume at least three bugs exist
C) Keep one session but switch the review turn to a larger model with extended thinking enabled
D) Add a loop that forces at least three review passes in the session before the job is allowed to exit

<details>
<summary>Answer & explanation</summary>

**A)** Same-session self-review keeps the generation reasoning in context, so the model tends to confirm its own earlier decisions; generator and reviewer must be separate sessions. Adversarial prompting and bigger models are probabilistic patches layered on contaminated context, and repeating passes in the same session just repeats the same bias on every pass.

*Hint if stuck: Ask what context the reviewer is carrying when it judges the code.*
</details>

---
