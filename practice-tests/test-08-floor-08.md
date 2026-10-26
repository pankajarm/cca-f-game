# Practice Test 08: Validation Gauntlet
**D4: Prompt Engineering & Structured Output** (20% of the exam) · task statements 4.4, 4.5, 4.6

21 questions. Exam pace is 2 minutes per question.

---

## Question 1
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

## Question 2
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

## Question 3
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

## Question 4
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

## Question 5
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

## Question 6
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

## Question 7
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

## Question 8
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

## Question 9
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

## Question 10
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

## Question 11
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

## Question 12
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

## Question 13
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

## Question 14
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

## Question 15
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

## Question 16
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

## Question 17
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

## Question 18
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

## Question 19
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

## Question 20
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

## Question 21
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
