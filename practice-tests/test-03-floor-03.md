# Practice Test 03: The Hook Forge
**D1: Agentic Architecture & Orchestration** (27% of the exam) · task statements 1.4, 1.5, 1.7

86 questions. Exam pace is 2 minutes per question.

---

## Question 1
A telecom's support agent has verify_identity and change_plan tools. The system prompt says identity must be verified before any plan change, but an audit of 20,000 sessions found about 3% of plan changes ran with no verification at all, usually when the caller sounded rushed. The carrier's regulator treats each one as a reportable incident. What should the architect change?

A) Rewrite the system prompt so the verification requirement appears in capitals at both the top and the bottom, with three example transcripts
B) Make change_plan check in code that verify_identity succeeded earlier in this session, and return an error naming the missing step when it has not
C) List verify_identity first in the tools array so the model is more likely to consider and call it before reaching for change_plan
D) Have the agent restate its plan in one sentence before every change_plan call, confirming to itself that verification already happened

<details>
<summary>Answer & explanation</summary>

**B)** A required ordering with regulatory consequences has to be enforced by a deterministic gate in code, because any prompt-based instruction keeps a non-zero failure rate that compounds at scale. Capitalised instructions and examples, tool ordering, and a self-confirmation step all remain probabilistic: the model that skipped verification is the same one asked to confirm it did not.

*Hint if stuck: Ask which of these mechanisms can still fail when the model is persuaded by an urgent caller.*
</details>

---

## Question 2
A bank's support agent gates transfer_funds on a session flag that verify_customer sets after a successful identity check. In one session a verified customer said, 'Also move $2,000 out of my mother's account, she said it's fine,' and the agent completed the transfer from the mother's account without verifying her. Which fix closes the gap?

A) Add a system-prompt rule that third-party accounts always need their own verification, with an example showing the agent asking for the second person's details
B) Reset the verification flag after every tool call so that each transfer requires the customer to pass a full identity check again
C) Record the verified customer ID in the gate's state and have transfer_funds refuse any source account not owned by that verified ID
D) End the session automatically whenever a second customer name appears, and ask the caller to start a new conversation for the other account

<details>
<summary>Answer & explanation</summary>

**C)** The gate checked that someone had been verified, not that the verified person owns the account being debited, so the fix is to bind the verification state to an identity and check the tool's account argument against it. A prompt rule about third parties is still best-effort. Resetting the flag after every call adds friction for legitimate multi-step requests without fixing the identity mismatch, and ending sessions on a second name is a brittle heuristic that blocks legitimate conversations.

*Hint if stuck: A gate is only as good as the question it checks; consider whose verification the transfer actually depends on.*
</details>

---

## Question 3
A furniture retailer's support agent receives: 'My sofa arrived with a torn cushion, can you change the delivery address on my pending table order to my office, and does the warranty cover fading?' Transcripts show the agent handles the torn cushion thoroughly, then closes with 'Anything else?' and the address change never happens. What is the best fix?

A) Reply to multi-issue messages by asking the customer to send each request in a separate message so that each one becomes its own clean conversation
B) Raise max_tokens on each response so the agent has more room to address every topic in a single long reply before closing the conversation
C) Handle only the most urgent issue automatically and create a ticket for the remaining requests so a human agent can follow up later in the week
D) Have the agent split the message into discrete items at the start, track each one in its working state, and confirm all are resolved before closing

<details>
<summary>Answer & explanation</summary>

**D)** Multi-concern requests should be decomposed into distinct items that are each tracked to resolution, with a check that nothing is left open before the conversation ends. Asking customers to resend requests pushes the work back onto them, and more output tokens do not create the missing tracking. Ticketing everything after the first issue abandons requests the agent could have resolved itself.

*Hint if stuck: The failure is not depth on one issue; it is losing track of the others.*
</details>

---

## Question 4
An airline's support agent escalates compensation claims above its authority to human specialists with a short summary: the issue, the flight number and the amount requested. Specialists report re-running the identity check and re-asking for boarding passes on most cases, and twice they issued a voucher the agent had already issued. What should the architect add to the handoff?

A) A required structured block listing the verified customer ID, verification status, actions already taken with their results, and a recommended next action
B) The full conversation transcript appended under the summary so specialists can scroll back and confirm for themselves what happened earlier in the case
C) A confidence score for the agent's recommended amount so specialists know how much to trust the summary before deciding to re-check everything
D) An instruction to the agent to write a longer narrative summary that mentions everything it did and everything the customer said during the session

<details>
<summary>Answer & explanation</summary>

**A)** Specialists repeat work because the handoff omits state they need, so it must guarantee fields for verification status and actions already taken, plus the recommended action. Appending the transcript brings back the reconstruction burden the summary was meant to remove. A confidence score does not tell anyone a voucher was already issued, and a longer free-form narrative still does not guarantee those facts appear.

*Hint if stuck: Look at what the specialists keep redoing; that is what the handoff is missing.*
</details>

---

## Question 5
A multi-agent research system's coordinator is supposed to send every draft report through a citation-verification subagent before calling publish_report. When a user's deadline is tight, the coordinator sometimes publishes directly, and two reports went out last month with fabricated citations. What is the most reliable fix?

A) Instruct the synthesis subagent to double-check each of its own citations before returning, so drafts reach the coordinator already verified against their sources
B) Have publish_report refuse unless a verification record exists for the exact draft being published, and return an error saying verification is required
C) Add a line to the coordinator's prompt saying citation checks are mandatory even under deadline pressure, with an example of a late report
D) Raise the coordinator's turn limit so it always has enough remaining turns to fit the verification step in before it reaches the deadline

<details>
<summary>Answer & explanation</summary>

**B)** When a step must always happen before another, the downstream tool should refuse to run until there is evidence the prerequisite ran on the same artifact. Self-checking by the synthesis subagent is self-review, which shares the blind spots that produced the errors. A prompt line about deadline pressure stays probabilistic, and more turns do not make the coordinator choose to use them.

*Hint if stuck: Think about where in the system a skipped step can be made impossible rather than discouraged.*
</details>

---

## Question 6
A research system flags claims where sources conflict and routes them to a human fact-checker. Today it sends the fact-checker every subagent transcript for the report, often 60 pages. Fact-checkers say they cannot tell which claims are disputed, and they sometimes clear a claim without seeing the contradicting source. What should the handoff contain instead?

A) Only the final report with the disputed sentences highlighted, so the fact-checker reviews claims in the context where readers will meet them
B) The transcripts as before, plus a ranked list of subagents by how many conflicts each produced, so reviewers know where to start reading
C) A per-claim record with the claim, each supporting and contradicting source with its URL and date, what was already checked, and a suggested resolution
D) A rewritten report that drops every disputed claim, so nothing uncertain reaches readers and the fact-checker only does a final read-through before the report is published

<details>
<summary>Answer & explanation</summary>

**C)** A human reviewer needs a structured, per-item package: the claim, the evidence on both sides with source metadata, what was already tried, and a recommendation, so they can decide without reconstructing anything. Highlighting sentences in the report hides the contradicting source that caused the bad clearances. Ranking subagents still leaves reviewers inside the transcripts, and silently dropping disputed claims loses information instead of resolving it.

*Hint if stuck: The fact-checker's mistakes came from missing one specific kind of evidence.*
</details>

---

## Question 7
A platform team built an internal developer assistant with the Agent SDK that can run database migrations through apply_migration. Policy says a backup snapshot must be taken first via create_snapshot. In a demo the assistant ran a migration without a snapshot after the developer said they had 'just taken one manually.' How should the workflow be enforced?

A) Add to the system prompt that developer claims about manual snapshots must never be trusted, and that create_snapshot is required every time
B) Ask the developer to type CONFIRM before each apply_migration call so that a person takes responsibility for the snapshot step in the chat
C) Have the assistant post a checklist reply before each migration that lists the snapshot as done or pending, so reviewers can audit it
D) Have apply_migration look up a snapshot record for the target database newer than a set window and refuse to run when none is found

<details>
<summary>Answer & explanation</summary>

**D)** A prerequisite with real consequences belongs in code that checks for evidence it happened, here a recent snapshot record for the target database, instead of trusting anyone's word. A prompt rule can still be talked around, a typed confirmation checks the developer's attention rather than the snapshot's existence, and a checklist reply is only the model's own claim.

*Hint if stuck: Ask what the gate should verify: a statement, or the state of the system.*
</details>

---

## Question 8
A release assistant may call tag_release only after run_tests. The team implemented a gate that checks whether run_tests was called earlier in the session. Last week the assistant ran the tests, saw three failures, pushed a one-line fix, and tagged the release; the fix broke the build. What is the root cause in the gate design?

A) The gate checks that the step was invoked, not that it passed for the exact commit being tagged; it should require a passing result for that commit
B) The gate should also require the developer's approval in chat, since tool calls alone cannot capture human judgment about a release
C) The assistant needs a stronger prompt telling it that a failed test run means it must stop and report instead of trying to fix things
D) The session ran too long; a turn limit after the first test failure would have ended the run before the assistant could reach tag_release with the untested fix

<details>
<summary>Answer & explanation</summary>

**A)** A gate must check the condition that actually matters: a passing test run for the exact commit being released, not merely that the tool was called at some point. Adding human approval or a stronger prompt layers on extra controls without fixing the weak check. A turn limit is a crude stop that does not encode the release rule at all.

*Hint if stuck: Compare what the gate checks with what the policy actually requires.*
</details>

---

## Question 9
A utility company's support agent can waive late fees up to $50. A customer wants a $340 early-termination fee waived, which only a supervisor can approve. The agent currently either refuses flatly or keeps negotiating partial waivers it is not authorised to offer. What workflow should the architect design?

A) Let the agent offer the largest waiver within its own limit and close the case, telling the customer the remainder is final
B) Route over-limit requests to a supervisor queue with a structured handoff, and have the agent tell the customer what happens next
C) Raise the agent's waiver limit to $400 so it can resolve most termination-fee requests without involving a supervisor at all
D) Have the agent ask the customer to phone the supervisor line, ending the chat so the customer can explain the request again in full

<details>
<summary>Answer & explanation</summary>

**B)** When a request exceeds the agent's authority, the workflow should hand off to the person who has it, with a structured summary so the supervisor can act at once, and keep the customer informed. Offering a partial waiver and closing ignores the actual request, asking the customer to call in makes them repeat everything, and raising the limit changes the business policy instead of designing the workflow around it.

*Hint if stuck: The agent lacks authority, not information; who has the authority, and what do they need?*
</details>

---

## Question 10
An invoice-extraction pipeline gives the model three tools: extract_fields, validate_record and write_record. Validation checks totals and vendor IDs against the ERP. Roughly 1 in 200 invoices is written to the database without validation because the model calls write_record directly after extraction. What is the best fix?

A) Keep all three tools but add a prompt rule and examples showing validate_record called between the other two tools on every invoice
B) Ask the model to report in its final message whether it validated, and route invoices where it says no to a manual reprocessing queue
C) Have pipeline code run validation as a fixed step after extraction and write only records that pass, instead of leaving the order to the model
D) Merge validation into the extraction prompt so the model checks totals itself while it extracts, removing the separate validation tool from the pipeline

<details>
<summary>Answer & explanation</summary>

**C)** When the order of steps never varies, code should run them in that order, so validation cannot be skipped and writes only happen for passing records. Prompt rules and examples keep the 1-in-200 failure rate, and asking the model whether it validated relies on the same model's self-report. Folding validation into extraction swaps a deterministic ERP check for the model's own arithmetic.

*Hint if stuck: If the sequence is always the same, ask who should own the sequencing.*
</details>

---

## Question 11
A claims-form extraction pipeline sends low-confidence documents to a human review queue. Each queue item contains only the document ID and the label 'needs review', so reviewers re-extract the whole form by hand, and the team gets no signal about which fields fail. What should each handoff item contain?

A) The model's full reasoning transcript for that document, so reviewers can see exactly where its thinking went wrong before they correct anything in the record
B) The majority answer from three more extraction runs on that document, so reviewers only need to approve or reject a single candidate record
C) An overall confidence score and the document type, so the queue can be sorted and reviewers can take the least certain documents first
D) The extracted values, the fields that failed with the check each one failed, the source page or span for each, and what retries were already made

<details>
<summary>Answer & explanation</summary>

**D)** A handoff should let the human act on exactly what is uncertain: the extracted values, which fields failed and why, where in the source to look, and what was already tried. That also gives the team field-level failure data. A reasoning transcript is unstructured and slow to use, an overall score says nothing about which fields to check, and majority voting over reruns can still be wrong while hiding which fields were in doubt.

*Hint if stuck: Reviewers are redoing the whole form; what would let them check only the parts in doubt?*
</details>

---

## Question 12
A customer writes to a bank's support agent: 'Please update my mailing address, and I'm disputing a $1,200 charge from a merchant I've never heard of.' Disputes over $500 must go to a human fraud team. The agent currently escalates the whole conversation at once, so the address change waits two days in the fraud queue. What should the workflow do?

A) Complete the address change, escalate only the dispute with a structured summary, and tell the customer which item is done and which is pending
B) Escalate the whole conversation as now, but mark the address change as low priority so the fraud team handles it after the dispute
C) Ask the customer to submit the address change in a separate chat after the dispute is resolved, so each conversation stays single-purpose
D) Have the agent handle both items itself, filing the dispute through its standard dispute tool and noting the amount for later fraud review by the team

<details>
<summary>Answer & explanation</summary>

**A)** Multi-concern requests should be split so each item is resolved by the right path: the agent finishes what it is authorised to do and escalates only the item that needs a human, with a structured handoff. Handling the dispute itself breaks the fraud policy, escalating everything delays a routine change and loads the fraud queue with it, and sending the customer away creates friction for a request the agent could have finished.

*Hint if stuck: Escalation applies to an item, not necessarily to the whole conversation.*
</details>

---

## Question 13
A user asks a research system: 'Compare the three leading battery chemistries on cost, summarise each one's regulatory status in the EU, and list the main suppliers.' The final report covers cost and suppliers in depth but has no regulatory section, and nothing in the run signalled the gap. What should the coordinator do differently?

A) Use a single subagent for the whole question so there are no handoffs between agents where one of the parts can silently fall out
B) Split the request into explicit sub-questions at the start and check the synthesis against that list before finishing, re-dispatching any uncovered item
C) Ask the synthesis subagent to review its own report and add any section it thinks a reader would expect, before it returns the result
D) Append the user's original question verbatim to every subagent's prompt so each one keeps the full request in view while it works

<details>
<summary>Answer & explanation</summary>

**B)** Each part of a multi-part request should become a tracked item, and completion should be checked against that list so a missing part is caught and sent back out. A single subagent does not add any tracking and gives up parallel work. Self-review by the synthesiser misses the gap it created, and giving every subagent the full question invites overlap without anyone checking that each part was answered.

*Hint if stuck: A gap nobody noticed suggests nothing was keeping count.*
</details>

---

## Question 14
A developer asks an internal Agent SDK assistant: 'Rename the feature flag new_checkout to checkout_v2 everywhere, update the docs page that mentions it, and bump the minor version in package.json.' The assistant does the rename across 14 files, summarises it well, and stops. The docs and version are untouched. What design change best prevents this?

A) Increase the model's max_tokens so the summary of the rename does not crowd out the remaining work in the same turn
B) Tell developers in the team handbook to send one request per message so the assistant is never given more than one change at a time
C) Have the assistant record each requested change as a tracked task at the start and only finish once every task is marked complete
D) Add a system-prompt line asking the assistant to reread the request before finishing and mention anything it may have skipped

<details>
<summary>Answer & explanation</summary>

**C)** Requests with several parts are handled reliably when each part becomes an explicit tracked task and the agent cannot finish with tasks still open. More tokens do not change when the agent decides it is done, and one-request-per-message moves the burden to users. A reminder to reread the request helps sometimes but is not a tracking mechanism.

*Hint if stuck: The assistant did the first job well; what would make it remember the other two?*
</details>

---

## Question 15
An insurance support agent verifies callers with a one-time code, then can update beneficiaries. Policy says verification is valid for 15 minutes. Logs show a session where the caller verified, the conversation ran for 50 minutes covering several questions, and then a beneficiary change went through, which the compliance team flagged. What should the architect implement?

A) Have the agent ask the caller how long ago they verified and proceed only if the caller says it was within the last fifteen minutes
B) Add a reminder to the system prompt that verification expires after 15 minutes and that the agent should keep track of how long has passed
C) End every session automatically after 15 minutes so that no conversation can outlast the window in which verification remains valid
D) Have the update_beneficiary gate check the verification timestamp and refuse with a re-verification message once the 15-minute window has passed

<details>
<summary>Answer & explanation</summary>

**D)** The gate should check the condition the policy actually defines, which includes freshness, so an expired verification blocks the sensitive action and triggers re-verification. The model has no reliable sense of elapsed time, so a prompt reminder is weak. Ending all sessions at 15 minutes harms every long but legitimate call, and asking the caller relies on the very person being verified.

*Hint if stuck: A prerequisite can be satisfied once and still stop being satisfied later.*
</details>

---

## Question 16
A research system can email outside experts through send_email. Policy requires an editor to approve each draft first, so the team gave send_email a required boolean parameter, approved, and the tool refuses when it is false. An audit finds several emails no editor ever saw: in each, the coordinator set approved to true after an editor replied that they would 'take a look later'. What should the architect change?

A) Have send_email look up an editor approval for that draft's ID in the review system and refuse when none exists, whatever the caller passes
B) Add a second required parameter naming the approving editor, so the coordinator must say who approved each draft before the email can be sent
C) Rename the parameter to editor_has_explicitly_approved and spell out in the tool description exactly which editor replies count as an approval
D) Ask the coordinator to quote the editor's approval message in its reasoning before it sets approved to true on any send_email call to an expert

<details>
<summary>Answer & explanation</summary>

**A)** The gate checked a claim made by the same model it was meant to constrain, so it was only as reliable as the model's reading of the editor's reply. A real prerequisite gate checks system state the model cannot write: an approval record for that exact draft. A clearer parameter name, an approver-name field and a quoted message are all still supplied by the model, so a misread 'take a look later' gets through each of them.

*Hint if stuck: Ask who sets the value the gate is checking.*
</details>

---

## Question 17
A developer runs a long Claude Code session refactoring a payments module and has to hand the half-finished work to a colleague in another time zone. The first attempt was to share the full session transcript; the colleague spent an hour working out which files were done and accidentally re-applied a change. What should the handoff note include?

A) The full transcript again, together with the git diff, so the colleague can match each change in the diff to the turn that produced it
B) A list of the files changed with their status, decisions made and why, tests passing or failing now, and the specific next steps left to do
C) A short summary paragraph written by Claude at the end of the session describing the overall goal of the refactor and the general approach it took
D) A note telling the colleague to resume the same session so Claude can answer their questions about the work it has already completed

<details>
<summary>Answer & explanation</summary>

**B)** A handoff works when it hands over structured state: what changed, what was decided, the current test status and the concrete next steps, so the next person can act without reconstructing anything. The transcript plus diff is the same reconstruction burden in a bigger form. A general summary loses the per-file status that caused the duplicate change, and resuming the session depends on context the colleague cannot inspect directly.

*Hint if stuck: The colleague's mistake came from not knowing what was already done.*
</details>

---

## Question 18
A CI agent investigates failing builds and, when it decides a test is flaky, files a ticket for the owning team. Tickets contain the last 4,000 lines of the build log. Owning teams close most tickets as 'cannot reproduce' without acting, and the same flaky tests resurface weekly. Which ticket design would most likely get these acted on?

A) A short paragraph from the agent explaining in plain language why it thinks the test is flaky, replacing the log so the ticket is easy to read
B) The full build log as now, with a severity label added so the owning teams can prioritise the flaky-test tickets that matter most to them
C) The test ID, the failure signature, pass and fail counts across recent reruns, commits since it last passed reliably, a suspected cause, and a link to the logs
D) Only the final 200 lines of the log, since the actual failure is almost always printed near the end of a failing CI run

<details>
<summary>Answer & explanation</summary>

**C)** A handoff to another team should package the evidence they need to act: which test, how it fails, how often across reruns, what changed, a hypothesis, and a pointer to the raw logs. A plain-language paragraph gives no reproducible evidence, a severity label does not make 4,000 lines readable, and trimming the log can drop the rerun history that proves flakiness.

*Hint if stuck: Owners close the tickets because they cannot reproduce; what evidence would change that?*
</details>

---

## Question 19
An internal Agent SDK assistant can deploy branches to staging, and its deploy_to_staging tool is now gated: it refuses unless check_build has confirmed a green build for that commit. When the gate fires, the tool returns only 'Error 403'. Since launch, the assistant often tells engineers 'I don't have permission to deploy' and stops, even for branches whose builds are green. What should the architect change?

A) Remove the gate and move the green-build rule back into the system prompt, since the gate is causing more harm than it prevents
B) Make the tool call check_build internally and silently whenever the check is missing, so the gate never visibly fires in a conversation with an engineer
C) Add a system-prompt line telling the assistant that any 403 from a tool means it should retry the same call once before giving up
D) Have the gate return a message naming the unmet prerequisite and the next step, such as calling check_build to confirm the build for that commit

<details>
<summary>Answer & explanation</summary>

**D)** A gate should fail informatively so the model can recover: telling it which prerequisite is missing and what to do next lets it run check_build and continue. Removing the gate gives up enforcement. A silent internal check hides the build status from the conversation and the engineer, and retrying the same blocked call just hits the gate again.

*Hint if stuck: A blocked call is part of the conversation the model reasons over; what does the model learn from the current error?*
</details>

---

## Question 20
A team reports that its agent follows a prompt-instructed rule, 'always run the fraud check before issuing a payout', in 99.2% of runs, and proposes calling the problem solved. The agent issues about 40,000 payouts a month, and an unchecked payout can cost thousands of dollars. How should the architect respond?

A) Agree, since 99.2% compliance is well above what human agents achieve and further work on this would bring little additional value
B) Enforce the fraud check in code before the payout tool can run, because about 320 unchecked payouts a month is a real loss
C) Leave the prompt as is and add a dashboard that alerts the team each time a payout is detected without a fraud check after the fact
D) Keep improving the prompt with more examples until compliance reaches 99.9%, then leave the rule in the prompt as the main control

<details>
<summary>Answer & explanation</summary>

**B)** Prompt instructions have a non-zero failure rate, and at 40,000 payouts a month 0.8% is about 320 unchecked payouts, so a required step with this cost must be gated in code. Pushing compliance to 99.9% still leaves around 40 a month, and a dashboard detects losses after the money is gone. Comparing to human error rates does not change what the failures cost.

*Hint if stuck: Turn the percentage into a monthly count before deciding whether it is good enough.*
</details>

---

## Question 21
An internal IT agent onboards new hires by creating accounts in four systems in sequence: directory, email, payroll, then badge access. When payroll's API times out, the agent retries from the start on the next run and creates duplicate directory and email accounts; when it eventually escalates, IT staff cannot tell which systems are done. What should the workflow do?

A) Have the agent re-check all four systems from scratch at the start of each run and work out for itself which accounts already exist and which are missing
B) Wrap the four steps in a single long tool call so that either all four accounts are created together or none of them are created
C) Persist each step's completion in workflow state, resume from the first incomplete step, and include done and pending steps in any escalation
D) Add a system-prompt rule telling the agent never to repeat a step it has already completed earlier for the same new hire

<details>
<summary>Answer & explanation</summary>

**C)** A multi-step workflow needs durable, code-held state for each step so it can resume where it stopped and so a human handoff can say exactly what is done and what is not. Having the model re-check all systems each run is slower and depends on its inference. A single all-or-nothing call is rarely possible across four independent systems, and a prompt rule cannot stop duplicates the model does not know about.

*Hint if stuck: Both symptoms come from the same missing piece of information.*
</details>

---

## Question 22
A platform team exposes a rotate_db_credentials tool to two Agent SDK assistants built as separate loops: a CLI helper and a chat-ops bot. The team added code to the CLI helper's loop that blocks the tool until the requester's on-call status is confirmed with check_oncall. A month later, an audit finds rotations by engineers who were not on call, all coming through the chat-ops bot. What is the right fix?

A) Copy the same gating code into the chat-ops bot's loop so that both loops apply the same check before calling the rotation tool
B) Add the on-call requirement to the chat-ops bot's system prompt, since chat requests are slower and give the model more time to follow it carefully
C) Route all rotation requests from chat to the CLI helper so that only the loop that already has the gate can perform credential rotations
D) Move the check into the rotate_db_credentials service itself, so every caller, from any assistant, must present a confirmed on-call requester

<details>
<summary>Answer & explanation</summary>

**D)** Enforcement belongs at the point every path must pass through, which is the tool or service itself, so new or forgotten callers cannot bypass it. Copying the code into each loop works until the next assistant is added, a prompt rule is not enforcement, and rerouting chat requests to the CLI helper changes the product to work around a misplaced check.

*Hint if stuck: Ask where a gate must live so that a new caller cannot skip it.*
</details>

---

## Question 23
A team runs Claude Code in CI to review pull requests for security issues. The review prompt tells Claude to run the team's static security scanner first and use its findings, but on about a fifth of PRs Claude reviews without running it, and those reviews miss issues the scanner would have caught. What is the most reliable fix?

A) Run the scanner as a fixed pipeline step before invoking Claude, and pass its findings into the review prompt as input
B) Move the scanner instruction to the top of the review prompt and add an example review that starts by calling the scanner
C) Add a second Claude review stage that reads the first review and runs the scanner if the first stage did not run it
D) Ask Claude to end every review with a line confirming whether it ran the scanner, and fail the job when the line is missing

<details>
<summary>Answer & explanation</summary>

**A)** A step that must happen on every PR, in the same order, can simply be run by the pipeline before the model is involved, so the review always has the scanner's output. Prompt placement and examples remain probabilistic, a second review stage adds cost and still depends on a model noticing, and a self-reported confirmation line can be present even when the scan was skipped.

*Hint if stuck: If the step never varies, does the model need to be the one deciding to run it?*
</details>

---

## Question 24
A support agent escalates a $900 goodwill credit to a supervisor, who approves it with conditions: the credit applies to the March invoice only. The agent then resumes, reads the supervisor's chat reply, and in some cases applies $900 to the current invoice, or $9,000 after misreading a comma. How should the approval be handed back to the agent?

A) Paste the supervisor's reply into the conversation verbatim and add a prompt line asking the agent to reread approvals carefully before acting
B) Return a structured approval record with ID, amount, invoice and expiry, and have apply_credit refuse calls that do not match it
C) Ask the agent to restate the approved amount and invoice back to the supervisor and wait for a thumbs-up before applying anything
D) Have the supervisor apply the credit manually in the billing system, and let the agent only tell the customer the outcome afterwards

<details>
<summary>Answer & explanation</summary>

**B)** Handoffs work in both directions: the human's decision should come back as structured data that code can check, so the credit tool only accepts calls that match the approved amount and invoice. A verbatim reply with a reminder is still free text for the model to interpret, manual application gives up the automation the agent exists for, and a restate-and-confirm loop adds another human round-trip without any enforcement.

*Hint if stuck: Make the approval something the credit tool can verify, not just something the agent can read.*
</details>

---

## Question 25
A bank's account-onboarding agent must always run a KYC sanctions screen before account creation and always write an audit record afterward — regulators fine for misses. Between those two steps the conversation varies wildly: document re-requests, name clarifications, address conflicts. The current pure model-driven loop skipped the sanctions screen twice last quarter despite a bolded system-prompt instruction. What design fixes this?

A) Strengthen the system prompt with few-shot examples that show the sanctions screen running first every time
B) Replace the whole flow with a hard-coded decision tree that enumerates every possible onboarding path
C) Use a hybrid: invoke the sanctions screen and audit write programmatically in code, and let the model-driven loop handle the variable conversation between them
D) Set tool_choice to force the sanctions-screen tool on every single API call inside the loop

<details>
<summary>Answer & explanation</summary>

**C)** Prompt instructions are probabilistic, so steps with regulatory consequences must be guaranteed by deterministic code, while the adaptive middle of the flow is exactly where a model-driven loop earns its keep. A full decision tree sacrifices the flexibility the variable steps need, few-shot examples remain best-effort, and forcing one tool on every call breaks the rest of the workflow entirely.

*Hint if stuck: Separate the steps that must happen every time from the steps that genuinely vary, and ask which mechanism guarantees each kind.*
</details>

---

## Question 26
A support resolution agent escalates hard cases to human specialists. Specialists complain that each escalation arrives as a raw 150-message transcript and they spend twenty minutes reconstructing what happened before they can act. What should each escalation carry instead?

A) A sentiment trajectory chart plus the customer's last five messages
B) A structured summary: customer id, the issue, what was already tried, and a recommended next action
C) The full transcript with a one-line subject added so specialists can skim it faster
D) A live link back into the agent session so the specialist can question the agent directly about the case

<details>
<summary>Answer & explanation</summary>

**B)** Canonical human handoffs carry a structured summary covering the customer id, the issue, what was attempted, and a recommended action, so the specialist can act in minutes without replaying the conversation. The full transcript with a subject line is the strongest distractor, but it preserves the exact problem: the reconstruction burden stays on the human. Sentiment data does not tell the specialist what was tried or what to do next, and a live session link makes the specialist interrogate the agent instead of acting.

*Hint if stuck: Think about what a human needs in order to act in two minutes instead of twenty.*
</details>

---

## Question 27
An insurance support agent receives one message: 'I was double-billed in May, my new address is 14 Elm Street, and your last rep was rude - I want that on record.' The agent resolves the billing issue thoroughly and closes the conversation; the address change and the complaint are silently dropped. How should the architect fix this failure pattern?

A) Increase max_tokens so the agent has enough room to address everything in a single reply
B) Add a prompt instruction saying the agent must be thorough and never ignore parts of a message
C) Route each incoming message to three specialized subagents selected by keyword matching
D) Have the agent first decompose the message into distinct concerns and track each one to completion before ending the turn

<details>
<summary>Answer & explanation</summary>

**D)** Multi-concern requests fail when the agent treats the message as one task, so the fix is explicit decomposition: enumerate the distinct concerns up front and verify each is resolved before finishing. Keyword-routed subagents are the strongest distractor, but the concern count varies per message and keyword matching creates coverage gaps on unexpected phrasing. A vague instruction to be thorough is probabilistic, and the dropped concerns were never a token-budget problem, since the agent finished its reply normally rather than hitting max_tokens.

*Hint if stuck: When one message carries several requests, the fix is explicit enumeration and tracking of each one.*
</details>

---

## Question 28
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

## Question 29
A support agent queries two order systems after a merger. The legacy system returns statuses like 'SHP', 'BKO' and 'CXL'; the new one returns 'shipped', 'backordered' and 'cancelled'. The agent sometimes tells customers a cancelled order 'is on its way'. Both systems are owned by other teams with year-long change queues. What should the architect implement?

A) A mapping table of legacy codes in the system prompt with instructions to translate every status before replying to a customer about an order
B) A new normalize_status tool the agent is instructed to call on every status it receives from either system before it answers
C) A PostToolUse hook on both order tools that rewrites every status into one canonical vocabulary before the result reaches the model
D) A request to both owning teams to align on a shared status vocabulary, with the agent kept as it is until the change ships

<details>
<summary>Answer & explanation</summary>

**C)** When tools return inconsistent formats, a PostToolUse hook can normalise every result deterministically before the model reasons over it, without touching upstream systems. A prompt mapping table and an extra tool both depend on the model remembering to translate on each call. Waiting on upstream teams leaves customers misinformed for a year.

*Hint if stuck: Look for the point where every tool result passes through code you control.*
</details>

---

## Question 30
A team protects .env files in Claude Code with a PreToolUse hook whose matcher is 'Write|Edit'; the callback denies any call whose file_path ends in .env. In a review they find Claude updated .env anyway by running `echo 'API_URL=...' >> .env` in the terminal. What should they do to close the gap?

A) Change the matcher to '*.env' so the hook fires for every tool call that touches a file with that extension, whichever tool is used
B) Switch the hook to PostToolUse so that it inspects every tool's result afterwards and reverts any .env change it detects
C) Add a line to CLAUDE.md saying .env files must never be modified, including through shell commands or redirects
D) Also cover the Bash tool, with the callback inspecting tool_input.command for writes to .env and denying them with a reason

<details>
<summary>Answer & explanation</summary>

**D)** A hook with a 'Write|Edit' matcher only runs for those tools, so a Bash command that writes the file bypasses it; the hook must also cover Bash and inspect the command. Matchers match tool names, not file paths, so '*.env' does not do what it suggests. Reverting after the fact lets the write happen first, and a CLAUDE.md rule is not enforcement.

*Hint if stuck: Ask which tool actually performed the write, and whether the hook ever saw it.*
</details>

---

## Question 31
In a multi-agent research system, web-research subagents call a fetch_page tool that returns raw page text including navigation menus, cookie banners and footers. About 70% of each result is boilerplate, subagents run out of context after a dozen pages, and the publication date is often lost. What is the best fix?

A) Add a PostToolUse hook on fetch_page that strips boilerplate and returns the main text with URL and date as separate fields
B) Give the subagents a larger context window so that more raw pages fit before compaction or truncation becomes a problem
C) Add a PreToolUse hook that limits each subagent to six fetch_page calls so total page text stays within the context budget for each subagent
D) Tell each subagent in its prompt to skip navigation and footer text and to note publication dates whenever it notices them

<details>
<summary>Answer & explanation</summary>

**A)** A PostToolUse hook can trim and restructure tool output before the model sees it, cutting context use and keeping source metadata as explicit fields. Prompting subagents to ignore boilerplate still makes them read all of it, a bigger window postpones the problem, and capping calls reduces coverage without fixing the noisy results.

*Hint if stuck: Fix the result before it reaches the model, not after it has been read.*
</details>

---

## Question 32
An internal Agent SDK assistant provisions cloud machines through create_instance. Policy lets engineers self-serve instances up to $500 a month; anything larger needs a FinOps request, which the assistant can open with file_finops_request. The prompt states the policy, yet each month a few $3,000 GPU instances get created after engineers insist. What should the architect implement?

A) A PostToolUse hook on create_instance that checks the new instance's monthly cost and shuts the instance down straight away whenever it is over $500
B) A PreToolUse hook on create_instance that prices the requested configuration, denies anything over $500, and says in its reason to file a FinOps request instead
C) A firmer system-prompt rule with examples of engineers insisting, telling the assistant to politely refuse every request over the $500 limit
D) A PreToolUse hook that sends every create_instance call, whatever its size, to the FinOps team for approval before the call is allowed to run

<details>
<summary>Answer & explanation</summary>

**B)** A cost cap that must always hold is a mechanical check on the tool input, so a pre-call hook should block over-limit calls and its reason should point the model to the escalation path, here a FinOps request. Shutting instances down afterwards still creates and bills them, a firmer prompt keeps a failure rate under pressure, and routing every request to FinOps blocks the self-service the policy allows.

*Hint if stuck: The policy has two halves: what must never happen, and where over-limit requests should go.*
</details>

---

## Question 33
A support agent has two PreToolUse hooks on issue_credit: an enrichment hook that looks up the customer's tier and stores it in shared state, and a policy hook that reads that tier to decide whether the credit exceeds the tier's limit. Most of the time it works, but occasionally a gold-tier customer's valid credit is denied. What is the likely cause and fix?

A) The deny from the policy hook is overriding an allow from the enrichment hook; the enrichment hook should return allow with a higher priority
B) The enrichment hook takes too long and should be made async so that it returns at once and the policy hook can then read the stored tier
C) Matching hooks run in parallel in no fixed order, so the policy hook sometimes reads the tier before it is set; it should look the tier up itself
D) The policy check belongs in a PostToolUse hook, which always runs after every PreToolUse hook and so would always see the stored tier value when it ran

<details>
<summary>Answer & explanation</summary>

**C)** Hooks matching the same event run in parallel and their completion order is not deterministic, so a hook must not depend on another having run first; the policy hook should fetch the tier itself or the two should be merged. Deny does take priority over allow, but the enrichment hook is not deciding anything. An async hook cannot influence the operation at all, and a PostToolUse check runs after the credit has been issued.

*Hint if stuck: Ask what the policy hook assumes about the other hook, and whether that assumption is guaranteed.*
</details>

---

## Question 34
A CI job uses Claude Code to triage test failures across three services that use pytest, Jest and Go's test runner. Each call to the team's run_tests MCP tool returns a different raw format, and Claude sometimes counts skipped tests as failures or misses the failing test name in Go output. What change makes triage most reliable?

A) Add each runner's output format to CLAUDE.md with examples of passed, failed and skipped results for Claude to follow
B) Ask Claude to write a short parsing script at the start of each run and use it to read the output of every test run in that job
C) Run each service's tests in a separate Claude session so that each session only ever sees one runner's output format
D) Use a PostToolUse hook on run_tests that converts each runner's output into one summary with suite, test, status and message

<details>
<summary>Answer & explanation</summary>

**D)** Normalising heterogeneous tool output in a PostToolUse hook gives the model one consistent structure to reason over, which removes the parsing errors at the source. Documenting the formats still leaves the parsing to the model, a self-written parser is regenerated each run and may differ, and separate sessions lose the cross-service view triage needs while still leaving each format raw.

*Hint if stuck: Make the three formats look like one before the model reads them.*
</details>

---

## Question 35
A receipts-extraction pipeline reads amounts through an ocr_receipt tool. Receipts from different countries come back as '1.234,56 EUR', '$1,234.56' and '1 234,56 kr', and the model mis-reads about 4% of amounts by a factor of 100 or 1,000. Downstream accounting needs a decimal value with an ISO currency code. What should the architect do?

A) Add a PostToolUse hook on ocr_receipt that parses each amount by locale into a decimal value and an ISO currency code
B) Add few-shot examples of each locale's number format to the extraction prompt so the model learns how to read them
C) Tighten the output JSON schema so the amount field must be a number and the currency must be a three-letter code
D) Run each receipt through extraction twice and send any receipt whose two amounts disagree to the manual review queue for a person to check

<details>
<summary>Answer & explanation</summary>

**A)** Locale-dependent number formats are a deterministic parsing problem, so a PostToolUse hook should convert them before the model sees them. Few-shot examples lower the error rate but keep it non-zero. A stricter schema guarantees the output is a number, not that it is the right number, and double runs catch only cases where the two runs disagree.

*Hint if stuck: Ask whether this is a judgment the model must make or a conversion code can make every time.*
</details>

---

## Question 36
A telecom support agent's get_billing_profile tool returns full payment card numbers along with the rest of the profile. The agent never needs them, but they appear in logs and once were read back to a caller. Security wants card numbers kept out of the model's context entirely while the billing API is unchanged. What should the architect implement?

A) A system-prompt rule telling the agent never to repeat card numbers and to refer only to the last four digits when needed
B) A PostToolUse hook on get_billing_profile that masks card numbers to their last four digits before the result reaches the model
C) A PreToolUse hook on get_billing_profile that denies the call whenever the conversation contains the word card or payment
D) An output filter on the agent's replies that removes any 16-digit card number before the message is shown or spoken to the caller

<details>
<summary>Answer & explanation</summary>

**B)** A PostToolUse hook can redact sensitive fields from a tool result before the model sees it, so the data never enters context or logs. A prompt rule leaves the numbers in context and relies on compliance, denying the call on keywords breaks legitimate billing questions, and filtering replies still leaves the numbers in context and logs.

*Hint if stuck: Security wants the data out of the context, not just out of the replies.*
</details>

---

## Question 37
A developer-productivity assistant has a run_sql tool that takes a connection name and a query. Developers should be able to explore data freely, but every query must run against the read replica, never the primary. Developers sometimes ask for 'the primary, it's fresher', and the model passes 'primary' as the connection. The data team wants such requests simply served from the replica, which lags by under a second, rather than refused. What is the best design?

A) A PreToolUse hook that denies every run_sql call whose connection is not the replica, so the model must retry with the correct connection
B) A system-prompt rule saying that run_sql must always use the replica connection whatever the developer asks for in the conversation
C) A PreToolUse hook that rewrites the connection field to the replica via updatedInput, returning a new input object with the other fields kept
D) A PostToolUse hook that checks which connection served each query and warns the developer whenever the primary was used

<details>
<summary>Answer & explanation</summary>

**C)** A PreToolUse hook can modify tool input through updatedInput, so every query is redirected to the replica without blocking exploration; it should return a new object that keeps the other fields. Denying works but adds failed round-trips and pushback for a request the hook could simply correct. A prompt rule is not enforcement, and a PostToolUse warning comes after the primary has already been queried.

*Hint if stuck: Blocking is one way to enforce a rule; ask whether this rule needs the call stopped or just changed.*
</details>

---

## Question 38
A team wants to make sure Claude Code never runs `npm publish` from developer machines. They wrote a PostToolUse hook on Bash that detects publish commands and alerts the security channel. In the first week, two internal packages were accidentally published to the public registry, and the alerts fired after both. What should they change?

A) Make the PostToolUse hook also run `npm unpublish` right after it detects a publish, so the package is withdrawn within seconds
B) Lower the alert hook's timeout so the security channel hears about publish commands faster than it does today
C) Add `npm publish` to the team's CLAUDE.md as a forbidden command, alongside the existing alert from the hook
D) Use a PreToolUse hook on Bash that denies publish commands with a reason, so the command never runs at all

<details>
<summary>Answer & explanation</summary>

**D)** PostToolUse runs after the tool has executed, so it can only react; blocking an action requires a PreToolUse hook that denies the call before it runs. Auto-unpublishing still exposes the package and may not be allowed by the registry. A CLAUDE.md rule is best-effort, and faster alerts do not prevent anything.

*Hint if stuck: Ask when each hook event fires relative to the command itself.*
</details>

---

## Question 39
A research system's subagents may only cite sources from an approved list of journals and government sites. Despite a clear prompt, about one in ten reports includes material fetched from content farms. The team wants unapproved domains never fetched, while subagents should still be able to choose which approved pages to read. What should they implement?

A) Add a PreToolUse hook on the fetch tool that checks the URL's host against the allowlist and denies others with a reason listing approved sources
B) Add a PostToolUse hook on the fetch tool that drops the content of any page from an unapproved domain after it is retrieved
C) Remove the fetch tool from the subagents and have the coordinator fetch every page itself after checking each URL against the allowlist of approved journals and sites
D) Add the full approved list to each subagent's prompt and ask the synthesis step to remove any citation not on the list

<details>
<summary>Answer & explanation</summary>

**A)** A PreToolUse hook enforces the allowlist before a request is made and its reason lets the subagent pick an approved source instead, while leaving the choice of pages to the model. Moving all fetching to the coordinator removes the subagents' autonomy and creates a bottleneck. Dropping content afterwards still fetches the page, and prompt lists with cleanup at synthesis remain best-effort.

*Hint if stuck: The requirement is that the request never happens.*
</details>

---

## Question 40
A PreToolUse hook blocks close_account for accounts with an open balance. It returns permissionDecision 'deny' with an empty permissionDecisionReason, plus a systemMessage: 'Account has balance: escalate to billing.' Customers now hear 'something went wrong on our end' and the agent never escalates. What is the fix?

A) Change the decision from deny to ask so that the agent stops and asks the customer whether they want to escalate to billing
B) Put the explanation and the next step, escalating to billing, in permissionDecisionReason, which is what the model receives about the denial
C) Make the systemMessage longer and more explicit about escalation so the agent has enough detail to decide what to do next
D) Add a system-prompt line telling the agent that any blocked close_account call should always be escalated to the billing team

<details>
<summary>Answer & explanation</summary>

**B)** permissionDecisionReason is the channel that tells the model why a call was denied; systemMessage is shown to the user, not the model, so the agent saw a denial with no explanation. A longer systemMessage still never reaches the model, ask routes the decision to a human permission prompt instead of guiding the agent, and a prompt rule covers this one tool while leaving the reason channel empty for every other denial.

*Hint if stuck: Ask which output field the model actually reads when its call is denied.*
</details>

---

## Question 41
A contracts-extraction pipeline has a PostToolUse hook that converts parties' names and dates from the parse_contract tool into a canonical format. To speed up the pipeline, an engineer made every hook return async output. Throughput improved, but the model is again seeing raw, unnormalised dates. What should the team do?

A) Keep the hooks async but raise asyncTimeout so the normalisation has enough time to finish before the model reads the result
B) Move the normalisation into a PreToolUse hook, which runs before the tool and so is not affected by the async setting
C) Make the normalisation hook synchronous again and keep async output only for hooks with side effects such as logging
D) Remove the normalisation hook and ask the model to normalise dates itself as part of its output schema instructions

<details>
<summary>Answer & explanation</summary>

**C)** Async hook output tells the agent to continue without waiting, so an async hook cannot modify the result or inject context; anything that reshapes data must be synchronous. Raising the async timeout does not change that, a PreToolUse hook runs before there is any result to normalise, and handing normalisation back to the model gives up the deterministic conversion.

*Hint if stuck: Consider what an async hook is allowed to change once the agent has moved on.*
</details>

---

## Question 42
A company's compliance team needs an audit trail of every tool call its internal Agent SDK assistants complete: tool name, inputs, result and timestamp. The first design adds a log_action tool and instructs the assistant to call it after each action, but spot checks show gaps in about 8% of sessions. What should replace it?

A) A stronger instruction with examples making log_action the last step of every turn so that no session finishes without logging
B) A nightly job that reads conversation transcripts and reconstructs the audit trail from the tool calls recorded in them
C) A second assistant that monitors the first one's conversation in real time and records each action it observes there
D) A PostToolUse hook with no matcher that writes each call's tool name, input, result and tool_use_id to the audit store

<details>
<summary>Answer & explanation</summary>

**D)** Logging that must be complete belongs in a hook, which runs on every tool call in code rather than relying on the model to remember; omitting the matcher covers every tool. A stronger instruction keeps a failure rate, nightly transcript parsing is a reconstruction that can miss calls or lag, and a monitoring assistant is another probabilistic component.

*Hint if stuck: Ask which mechanism runs on every tool call without the model choosing to.*
</details>

---

## Question 43
A CI pipeline runs Claude Code to review pull requests and post findings through a post_review_comment tool. Some diffs contain hard-coded API keys, and twice the review quoted a key verbatim in a public comment. The review prompt already says never to repeat secrets. The team wants such comments never posted, while reviews should still flag the problem. What should they implement?

A) A PreToolUse hook on post_review_comment that scans the comment body for credential patterns and denies it, saying to cite the file and line instead
B) Remove post_review_comment and have Claude write its findings to a file that a maintainer reads and then posts to the pull request by hand
C) A stronger review prompt that repeats the rule at the top and bottom and gives examples of flagging a leaked key without quoting its value
D) A PostToolUse hook on post_review_comment that deletes any posted comment containing a credential pattern and then reposts it with the value removed

<details>
<summary>Answer & explanation</summary>

**A)** Inspecting the tool input before the call runs blocks the leak deterministically, and the deny reason tells Claude how to still report the problem. Deleting after posting leaves the key exposed in notifications and history, routing everything through a maintainer gives up the automated review, and a stronger prompt keeps the non-zero failure rate that already leaked keys twice.

*Hint if stuck: The comment must never exist, so look at what can act before the post happens.*
</details>

---

## Question 44
A platform team requires that new npm dependencies come only from an approved list maintained in deps-allowlist.json, which changes weekly. Claude Code sessions in the monorepo keep running `npm install` for unapproved packages when solving tasks, and reviewers catch them late. What is the most effective control?

A) A permissions deny rule for every package name not on the list, regenerated by hand each week when the allowlist file changes
B) A PreToolUse hook on Bash that reads deps-allowlist.json, denies installs of unlisted packages, and names the approval process in its reason
C) A CLAUDE.md section that copies the current allowlist and tells Claude to install only packages that appear in that section
D) A PostToolUse hook on Bash that runs `npm uninstall` for any unlisted package straight after it has been installed

<details>
<summary>Answer & explanation</summary>

**B)** A PreToolUse hook can apply a rule that depends on changing data at call time, block the install before it runs, and tell the model how to proceed. Hand-maintained deny rules cannot list every package not on the list and drift from the file. A copied allowlist in CLAUDE.md goes stale and is best-effort, and uninstalling afterwards still runs install scripts.

*Hint if stuck: The rule depends on a file that changes; which control can read it at the moment of the call?*
</details>

---

## Question 45
An architect is reviewing four rules for a support agent and must decide which belong in a PreToolUse hook rather than the system prompt: (1) keep a warm, concise tone; (2) never issue a refund to an account flagged for fraud; (3) prefer self-service links when they fully answer the question; (4) suggest a callback when the customer seems frustrated. Which choice is right?

A) Rules 2 and 4 in hooks, since both protect the company and both involve a clear trigger the hook can detect in the conversation or the tool call input
B) All four in hooks, since hooks are deterministic and the business wants every rule to be followed consistently every time
C) Only rule 2 in a hook: it is a mechanical check on a tool call that must hold every time, while the others need judgment and fit the prompt
D) None in hooks; all four fit the system prompt, and the fraud rule can be backed by a weekly audit of refunds issued

<details>
<summary>Answer & explanation</summary>

**C)** Hooks suit rules that can be checked mechanically on a tool call and must be guaranteed, which is the fraud-flag refund block. Tone, when self-service suffices and whether a customer seems frustrated are judgments that belong in prompting; detecting frustration in a hook would be an unreliable heuristic. Putting everything in hooks forces judgment into code, and a weekly audit finds fraud refunds after they are paid.

*Hint if stuck: Sort the rules by whether code could decide them without understanding the conversation.*
</details>

---

## Question 46
A fintech support agent has a process_refund tool. The system prompt states refunds above $200 require manager approval, yet logs show the agent issued a $480 refund last week after a persuasive customer message. Compliance now requires that over-cap refunds can never execute. What should the architect implement?

A) A PreToolUse hook on process_refund that checks the amount and exits with code 2 when it exceeds $200, writing the violation to stderr
B) A refund policy moved to the very top of the system prompt and repeated in CLAUDE.md, in bold, so the model cannot miss the $200 limit on any refund
C) A second model pass that reviews every pending refund and approves or rejects it before execution
D) A temperature of 0 on the support agent so it follows the refund policy more consistently

<details>
<summary>Answer & explanation</summary>

**A)** Critical business rules like refund caps belong in hooks because hooks are deterministic code that guarantees enforcement, while prompt instructions are probabilistic best-effort. Exit code 2 blocks the tool call and the stderr message is fed back to the model so it can adapt. The second-model reviewer is the strongest distractor, but it is still a probabilistic component and cannot guarantee zero violations, and temperature 0 changes sampling, not whether the model can be persuaded.

*Hint if stuck: Think about which mechanism is deterministic rather than probabilistic when a business rule must never be violated.*
</details>

---

## Question 47
A platform team wrote a PreToolUse hook to stop Claude Code from editing files under infra/prod/. The script correctly detects the protected path, prints 'Edit blocked: protected production path' to stdout, and exits with code 0. In testing, the edits still go through and the agent never acknowledges any block. What is wrong?

A) PreToolUse hooks cannot block tool calls; the rule must instead be a deny entry in settings.json permissions for that path
B) The hook needs to return hookSpecificOutput.additionalContext containing the block decision
C) The hook must exit with code 2 to block the call, and write the explanation to stderr so it is fed back to the model
D) The hook fires too early to see the file path; the protection must move to a PostToolUse hook

<details>
<summary>Answer & explanation</summary>

**C)** For PreToolUse hooks, a zero exit code allows the tool call to proceed; exit code 2 is what blocks the call, and stderr (not stdout) is the channel fed back to the model explaining why. PreToolUse hooks can block calls, since gating tool calls before they run is exactly what they exist for, so no settings.json deny rule is needed. additionalContext injects information but does not block anything, and PreToolUse receives the full tool input including the file path, so it does not fire too early.

*Hint if stuck: Recall which exit code blocks a tool call and which output stream gets fed back to the model.*
</details>

---

## Question 48
A customer support agent calls a get_customer CRM tool that returns 40 fields per record, including marketing flags and audit metadata. After 15 lookups in a long session, context is bloated and the agent starts missing the three fields it actually uses: plan tier, billing status, and open tickets. What is the best fix?

A) Instruct the agent in the system prompt to ignore the irrelevant CRM fields when reading tool results
B) Add a PostToolUse hook on get_customer that trims each result down to the handful of fields the agent needs
C) Switch to a model with a larger context window so the full 40-field records fit comfortably
D) Run /compact after every few lookups to summarize the accumulated CRM payloads

<details>
<summary>Answer & explanation</summary>

**B)** Verbose tool outputs should be trimmed deterministically at the source, and PostToolUse is the hook designed to normalize and reduce tool results before they enter context. A larger context window still leaves 37 useless fields per record diluting attention, so lost-in-the-middle misses persist. Prompting the model to ignore fields is probabilistic and the tokens still consume context either way, and /compact is reactive and lossy: it lets the bloat accumulate first and its summarization can blur the exact field values the agent needs.

*Hint if stuck: Verbose tool outputs are best handled deterministically at the moment they are produced, not by the model afterward.*
</details>

---

## Question 49
A healthcare intake agent writes visit summaries to a shared log through a write_log tool. CLAUDE.md instructs it to redact Social Security numbers first, and audits show it complies about 98% of the time. The compliance team requires zero SSNs in the logs, full stop. Which approach satisfies the requirement?

A) Add few-shot examples of correctly redacted summaries to the system prompt
B) Repeat the redaction rule in both the system prompt and CLAUDE.md and label it as mandatory
C) Have a reviewer subagent check each summary for SSNs before it is logged
D) Add a hook that scans write_log input and deterministically redacts or blocks any SSN pattern before the write runs

<details>
<summary>Answer & explanation</summary>

**D)** A 98% compliance rate is the signature of a probabilistic mechanism, and no amount of prompt reinforcement turns best-effort into a guarantee. PII redaction is a critical business rule, so it belongs in deterministic hook code that pattern-matches and rewrites or blocks the call every single time. The reviewer subagent is the strongest distractor, but it is another model and therefore still probabilistic; it can miss an SSN just as the original agent does.

*Hint if stuck: A 98% compliance rate is the fingerprint of a probabilistic mechanism.*
</details>

---

## Question 50
In a monorepo CI assistant, a run_coverage tool returns raw percentages per package. Reviewers notice the agent keeps flagging packages/legacy-billing for missing the 80% bar even though that package is formally exempt until Q3. The exemption list lives in a YAML file that changes as exemptions are granted and expire, and the agent rarely reads it. How should the team ensure coverage results are interpreted correctly every time?

A) Add a PostToolUse hook on run_coverage that reads the exemption YAML and injects current exemptions via hookSpecificOutput.additionalContext
B) Copy the exemption list into CLAUDE.md so it loads automatically at session start
C) Rename the tool to run_coverage_with_exemptions so the agent knows exemptions exist
D) Add a prompt instruction telling the agent to call a second tool that fetches the current exemption YAML after every single coverage run it performs

<details>
<summary>Answer & explanation</summary>

**A)** hookSpecificOutput.additionalContext lets a PostToolUse hook attach fresh interpretive context at the exact moment the tool result returns, so the model always sees the current exemptions alongside the numbers. CLAUDE.md is the strongest distractor, but it is a static copy that drifts from the changing YAML and can be lost mid-context in long sessions. The prompt-enforced second tool call is probabilistic and is exactly the behavior the agent is already failing to perform, and renaming the tool conveys nothing about which packages are exempt.

*Hint if stuck: Consider which mechanism can attach fresh interpretive context at the exact moment a tool result returns.*
</details>

---

## Question 51
An e-commerce operations agent answers on-call engineers' questions in long-running sessions; engineers execute any deploys themselves. Answers must always reflect the current deploy-freeze status and on-call rotation, both of which change mid-session. Today the agent advised an engineer to deploy during a freeze that began an hour after the session started. Which hook placement fixes this?

A) A SessionStart hook that injects freeze status and the rotation when the session begins
B) A Stop hook that appends the latest freeze status to the agent's final answer each turn
C) A PreToolUse hook that inserts the current rotation into the parameters of every tool call the agent makes during a turn
D) A UserPromptSubmit hook that fetches current freeze status and rotation and attaches them to each incoming prompt

<details>
<summary>Answer & explanation</summary>

**D)** The failure happened because the facts changed mid-session, so any mechanism that injects them only once at session start is guaranteed to go stale, which is exactly the trap in the SessionStart option. UserPromptSubmit fires on every user message, so the model reasons over current freeze and rotation data each time it answers. The Stop hook decorates output after reasoning is done, too late to change the advice, and the PreToolUse option only touches tool parameters, which never informs the model's answer to a question.

*Hint if stuck: Ask which hook fires often enough to keep fast-changing facts current throughout a session.*
</details>

---

## Question 52
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

## Question 53
In a monorepo, the data team must prevent Claude Code from editing files under db/migrations/ that have already been applied to production. Applied migrations are listed in db/applied.json, which changes daily, and new unapplied migration files must remain fully editable. How should this be enforced?

A) A PreToolUse hook on Edit and Write that checks the target against db/applied.json and exits 2 with an explanation when the migration is already applied
B) A settings.json permissions deny rule covering the entire db/migrations/ directory
C) A CLAUDE.md rule listing the currently applied migrations, regenerated by a nightly job
D) A PostToolUse hook that detects edits to already-applied migrations after they are written and reverts them with git checkout before the next tool call runs

<details>
<summary>Answer & explanation</summary>

**A)** The rule is conditional on data that changes daily, so it needs executable logic: a PreToolUse hook can read applied.json at call time, block only the applied files, and explain why via stderr. The static deny rule is the strongest distractor because it is also deterministic, but it is too blunt and blocks the legitimate new migrations the team must keep editable. The PostToolUse revert lets the forbidden write happen first and silently undoes it while the model still believes the edit succeeded, and CLAUDE.md is probabilistic and up to a day stale.

*Hint if stuck: A rule that depends on data that changes daily needs logic at call time, not a static pattern.*
</details>

---

## Question 54
A fintech extraction pipeline's fetch_transactions tool returns dates in a mix of MM/DD/YYYY, ISO 8601, and Unix epoch depending on the upstream bank. The model must compare transaction dates against statement periods and gets it wrong on roughly 1 in 12 records, almost always the epoch-formatted ones. What is the root-cause fix?

A) A PostToolUse hook on fetch_transactions that converts every date to ISO 8601 before the model sees the result
B) A system prompt section with worked examples showing how to convert epoch timestamps to ISO 8601 correctly before comparing dates
C) A retry policy that re-fetches the transactions whenever a date comparison fails validation
D) A stricter output schema requiring the model to return all dates as ISO 8601 strings

<details>
<summary>Answer & explanation</summary>

**A)** Date normalization is a mechanical transformation, so it belongs in deterministic PostToolUse code that guarantees the model only ever sees one consistent format. The stricter output schema is the strongest distractor: it constrains the answer's format but does nothing to stop the model misreading epoch values on the way in, since schemas guarantee syntax, not semantic correctness. Prompted conversion examples remain probabilistic, and retries re-fetch the same mixed formats and reproduce the same misreads.

*Hint if stuck: Mechanical transformations of tool output belong in deterministic code, not model instructions.*
</details>

---

## Question 55
An e-commerce agent's apply_store_credit tool is gated by a PreToolUse hook that exits 2 for credits over $50. The block works, but logs show the agent then retries the identical $75 credit four times before giving up, and the customer gets no resolution. The hook's stderr message is just the word 'Blocked.' What should change?

A) Convert it to a PostToolUse hook so the agent can observe the outcome of each attempted credit and then adjust its next step accordingly
B) Rewrite the stderr message to state the rule and the next step: the $50 cap, and that larger credits go through escalate_to_human
C) Add a hard cap of two retries on apply_store_credit in the agent loop configuration
D) Remove apply_store_credit from the agent's tools and route all credit requests to humans

<details>
<summary>Answer & explanation</summary>

**B)** When a PreToolUse hook blocks with exit code 2, its stderr is fed back to the model and is the model's only explanation of why the call was refused; a bare 'Blocked.' is the hook equivalent of a bare 'Operation failed' tool error, leaving nothing to adapt to. Stating the cap and the escalation path lets the agent immediately take the correct action. Retry caps are safety fallbacks that stop the loop without producing a resolution, converting to PostToolUse would let the over-cap credit execute, and removing the tool punishes every legitimate under-cap credit.

*Hint if stuck: What the hook writes to stderr is the model's only explanation of why the call was refused.*
</details>

---

## Question 56
A developer-productivity team wants three automated behaviors in Claude Code: (1) load the current sprint's ticket list once when a session opens, (2) strip ANSI color codes out of every Bash result before the model reads it, and (3) prevent any edit to files under vendor/. Which hook events implement these behaviors?

A) (1) UserPromptSubmit, (2) PreToolUse, (3) Stop
B) (1) SessionStart, (2) PreToolUse, (3) PostToolUse
C) (1) UserPromptSubmit, (2) PostToolUse, (3) SessionStart
D) (1) SessionStart, (2) PostToolUse, (3) PreToolUse

<details>
<summary>Answer & explanation</summary>

**D)** SessionStart runs once when the session opens, which is the right place for one-time context like the sprint ticket list. PostToolUse fires after a tool runs and is where outputs get normalized, such as stripping ANSI codes from Bash results. PreToolUse gates calls before they execute, so it is where vendor/ edits get blocked with exit code 2. Pairing (2) with PreToolUse and (3) with PostToolUse reverses the last two events: PreToolUse cannot clean a result that does not exist yet, and PostToolUse fires only after the edit has already happened.

*Hint if stuck: Match each behavior to when it must run: session open, after a tool returns, or before a tool executes.*
</details>

---

## Question 57
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

## Question 58
A developer forks a Claude Code session twice with --fork-session to compare two refactors of the same payments module, planning to run both forks at the same time in the same checkout. A teammate warns this will go wrong. Why, and what should the developer do?

A) Forks share one conversation history, so each fork will see the other's messages; run them one at a time instead
B) Forks cannot be created from the same parent twice, so the second fork will fail; create the second one from the first fork instead
C) Forks copy the conversation, not the files, so both forks edit the same working tree; give each fork its own worktree or checkout
D) Forks lose the parent's earlier tool results, so neither will know the module; paste a summary of the analysis into each fork first

<details>
<summary>Answer & explanation</summary>

**C)** Forking branches the conversation history, not the filesystem, so two forks editing one checkout overwrite each other's changes; separate worktrees keep the experiments apart. Forks have independent histories, so they do not see each other's messages, a parent can be forked more than once, and each fork starts with a copy of the parent's history, including its tool results.

*Hint if stuck: Ask what exactly gets copied when a session is forked.*
</details>

---

## Question 59
A developer juggles two tasks in Claude Code: a flaky-test investigation in the morning and a dependency upgrade in the afternoon. Each morning she runs `claude --continue`, and twice it reopened the dependency-upgrade conversation instead of the test investigation. What is the most reliable way for her to return to the right conversation?

A) Keep using --continue but always end the day in the test-investigation session so that it is the most recent one
B) Start a fresh session every morning and paste in her notes from the previous day about where the investigation stopped
C) Run both tasks in a single long-lived session so that there is only ever one conversation that can be resumed
D) Name each session when it starts, for example with -n or /rename, and return with `claude --resume <name>`

<details>
<summary>Answer & explanation</summary>

**D)** --continue always reopens the most recent session in the directory, so with parallel tasks the reliable handle is a session name passed to --resume. Ordering her day around --continue is fragile, re-pasting notes throws away the session's loaded context, and merging two unrelated tasks into one session mixes their context.

*Hint if stuck: One command picks the latest conversation; another picks a specific one.*
</details>

---

## Question 60
A support platform uses the Agent SDK in TypeScript. Each incoming customer message calls `query()` with `continue: true` so the agent remembers the conversation. With many customers chatting at once, agents have begun referencing other customers' orders. What change fixes the root cause?

A) Capture each conversation's session_id from the result message, store it per customer, and pass it to `resume` on later turns
B) Add a system-prompt instruction telling the agent to ignore any earlier messages that mention a different customer
C) Switch to `forkSession: true` on every call so that each customer message starts from a clean copy of the shared history
D) Turn off session persistence entirely so that every customer message is answered on its own, without any earlier conversation context

<details>
<summary>Answer & explanation</summary>

**A)** `continue` picks up the most recent session in the directory, which is the wrong session in a multi-user app; resuming by a stored per-customer session ID is what the docs recommend. A prompt instruction cannot undo context that should never have been loaded, forking from the shared session still copies the mixed history, and disabling persistence loses each customer's own context.

*Hint if stuck: How does each option decide which past conversation to load?*
</details>

---

## Question 61
A CI workflow runs an analysis job on one ephemeral runner and a fix job on a different runner later in the pipeline. The fix job calls the Agent SDK with `resume` and the analysis job's session ID, but fails with a not-found error. What is the most robust way to carry the analysis into the fix job?

A) Switch the fix job to `continue: true` so the SDK finds the most recent session without needing the session ID
B) Have the analysis job emit its findings as a structured artifact and pass them into a fresh session's prompt in the fix job
C) Retry the resume a few times with backoff, since the session file usually becomes available after a short delay
D) Pin both jobs to the same working directory path so that the session lookup on the second runner resolves to the same project folder

<details>
<summary>Answer & explanation</summary>

**B)** Session files live on the machine that created them, so a different runner cannot find them; the docs note that capturing results as application state and passing them to a fresh session is often more robust than shipping transcripts. `continue` searches the same missing local storage, retries do not create a file that was never there, and matching paths does not move data between machines.

*Hint if stuck: Where is a session stored, and is that place still there for the second job?*
</details>

---

## Question 62
A developer resumes yesterday's Claude Code session on a caching refactor. Since then, only one thing changed: a teammate edited `cache-config.yaml` to lower the default TTL from 300 to 60 seconds. The rest of the session's analysis is still accurate. What is the best way to continue?

A) Start a fresh session and have Claude re-explore the whole caching layer, since any change makes the old session unsafe
B) Resume the session without mentioning the change, since Claude will notice the new TTL value the next time it happens to read that file
C) Resume the session and tell it that `cache-config.yaml` changed, giving the new TTL, so it re-reads that file before editing
D) Resume the session and run /compact first so that the outdated configuration details are summarised away automatically

<details>
<summary>Answer & explanation</summary>

**C)** When the change is small and known, resuming keeps the valid context, and naming the exact file that changed lets the agent re-verify it. A full fresh start throws away accurate work, staying silent leaves the agent reasoning from a stale tool result it may never re-read, and /compact can preserve the stale value inside its summary.

*Hint if stuck: Keep what is still true; point precisely at what is not.*
</details>

---

## Question 63
A research agent built on the Agent SDK ended its run with `error_max_turns` after gathering about 80% of the sources for a market study. The team's current recovery is to start the whole study again with a higher turn limit. What is the better recovery?

A) Start again with the higher limit but ask the agent to work faster so that it finishes within the original number of turns
B) Paste the partial final answer into a new session and ask it to finish the remaining part of the study from there
C) Fork the session and continue in the fork, so that the original truncated run stays available for later comparison
D) Resume the session by its ID with a higher turn limit, so the agent continues with the sources it already gathered

<details>
<summary>Answer & explanation</summary>

**D)** Resuming with a higher limit is the documented recovery from `error_max_turns`: the agent picks up with everything it already gathered. Restarting wastes the earlier work, forking adds a branch with no alternative to compare, and the partial answer omits most of the tool results the agent collected.

*Hint if stuck: The session already holds everything the agent learned before it stopped.*
</details>

---

## Question 64
A support agent's session for a customer was paused while a human supervisor approved a goodwill credit outside the agent's authority. The customer writes back the next morning. The supervisor's action happened in the billing system, not in the agent's conversation. How should the system continue the case?

A) Resume the customer's session and inject a note stating that the supervisor approved and applied the credit, with its amount
B) Start a new session with no history, so that the agent's old pending-approval reasoning cannot confuse it about whether the credit was applied
C) Fork the customer's session so that the original stays unchanged while the fork handles the customer's new message
D) Resume the customer's session as it was, since the agent can work out what happened from the customer's new message

<details>
<summary>Answer & explanation</summary>

**A)** Resuming keeps the case context, and the agent must be told explicitly about the state change that happened outside its conversation. Relying on the customer's message leaves the agent with an outdated pending view, a fresh session loses the case history, and forking adds a second branch without telling either one about the credit.

*Hint if stuck: Changes made outside the conversation are invisible to it unless you report them.*
</details>

---

## Question 65
Two developers both resume the same Claude Code session, one on each terminal of a shared dev box, to explore a database connection leak from different angles. Afterwards the transcript is a confusing mix of both lines of questioning. What should they have done?

A) Taken turns, with each developer running /compact before handing the session over to the other developer to continue
B) Each resumed with --fork-session so that both got their own session ID and history starting from the shared analysis
C) Agreed to prefix every prompt with their own name so that the agent could keep the two lines of questioning separate
D) Resumed with --continue instead of --resume, since --continue keeps a separate history for each terminal that uses it

<details>
<summary>Answer & explanation</summary>

**B)** Resuming one session in two places without forking interleaves both conversations into one transcript; forking gives each developer an independent branch from the same baseline. Taking turns with /compact still merges the two lines of work, name prefixes are a soft convention on a shared history, and --continue reopens the same most-recent session rather than isolating terminals.

*Hint if stuck: Parallel lines of work from one starting point need separate branches.*
</details>

---

## Question 66
A research coordinator has spent a long session collecting and vetting 40 sources on the adoption of heat pumps. The team now wants two final reports from the same evidence: one framed for policymakers and one for installers, each needing several rounds of revision. What setup is best?

A) Write both reports in the same session, one after the other, so that the second report can reuse whatever the first one already decided
B) Run the source collection again in two new sessions, one per audience, so that each report has its own research
C) Fork the session once per audience so each report develops from the same vetted evidence without affecting the other
D) Paste the list of 40 source titles into two new sessions and ask each one to write a report for its audience

<details>
<summary>Answer & explanation</summary>

**C)** Forking gives each audience its own branch from the shared baseline of vetted evidence, so revisions on one cannot leak into the other. Sequential work in one session lets the first framing bleed into the second, recollecting sources wastes the vetting effort, and source titles alone drop the analysis the session built.

*Hint if stuck: Branch from shared evidence when you need independent outputs.*
</details>

---

## Question 67
An extraction service processes 5,000 shipping documents a day. To save setup time, an engineer changed it so that every document is sent as a new turn in one long-running resumed session. Accuracy has been drifting down through the day, and some outputs contain values from earlier documents. What is the right design?

A) Keep one long session but run /compact every hundred documents so that older documents are summarised away
B) Keep the long session and add a system-prompt rule stating that the agent must only ever use values taken from the current document
C) Fork a new session from the long-running one for every document so each starts with the accumulated experience
D) Process each document in its own independent call with no carried-over history, since documents do not depend on one another

<details>
<summary>Answer & explanation</summary>

**D)** Independent documents need no shared history; carrying it over fills context with unrelated data and invites cross-document leakage. Compaction still keeps summaries of other documents, forking from the long session copies all of that history into every document, and a prompt rule cannot reliably stop the model from using material that is in its context.

*Hint if stuck: Should one document's processing ever see another document?*
</details>

---

## Question 68
A developer used --fork-session to try two caching strategies from the same analysis. After an hour, the fork using a write-through cache is clearly better. The original session explored the alternative. How should he carry on with the winning approach tomorrow?

A) Resume the fork using its own session ID or name, since it is an independent session and the original was left unchanged
B) Resume the original session, since forks are temporary branches and their history is merged back into the original on exit
C) Start a fresh session and paste the fork's final message, since a forked session cannot itself be resumed later
D) Fork the original session again tomorrow and repeat the write-through work in the new fork from the same analysis

<details>
<summary>Answer & explanation</summary>

**A)** A fork gets its own session ID and history and can be resumed like any other session; the original stays as it was. Forks are not merged back, they are fully resumable, and redoing the work in a new fork wastes the hour already spent.

*Hint if stuck: A fork is a session in its own right.*
</details>

---

## Question 69
An architect wants to resume a three-week-old research session about a regulatory landscape. Many of the web sources the session read may have been updated since, but nobody knows which ones. The session's high-level conclusions are probably still useful. What is the most reliable way to continue?

A) Resume the session and tell it which sources changed, so it re-reads only those before continuing the work
B) Start a fresh session seeded with a summary of the conclusions and the source list, and have it re-verify the sources
C) Fork the old session so the original is preserved, then continue the research inside the fork without changes
D) Resume the session as it is, since high-level conclusions about regulation rarely change within a few weeks

<details>
<summary>Answer & explanation</summary>

**B)** Telling a resumed session what changed works only when you know what changed; here you do not, so many tool results may be silently stale and a fresh session with a summary plus re-verification is safer. Resuming as-is trusts unknown stale data, and forking copies the same stale history into a new branch.

*Hint if stuck: Targeted updates need you to know what changed; what if you don't?*
</details>

---

## Question 70
Mid-session, a developer ran /clear to start on a different bug, then realised she needed a detail Claude had found earlier about the auth middleware. What is the most direct way to get that context back?

A) Run /compact in the new conversation, which merges a summary of the cleared conversation back into the current one
B) Ask Claude in the new conversation to recall what it found about the auth middleware before the /clear
C) Use /resume to return to the earlier session, which Claude Code saved when /clear started the new one
D) Search the project CLAUDE.md, since Claude saves its findings there automatically whenever /clear is run

<details>
<summary>Answer & explanation</summary>

**C)** /clear saves the previous session, so /resume can switch back to it with its context intact. The new conversation has no record of the earlier findings, Claude does not write findings into CLAUDE.md on /clear, and /compact only summarises the conversation you are currently in.

*Hint if stuck: Clearing context does not delete the earlier conversation.*
</details>

---

## Question 71
Claude Code crashed while it was running a long database migration command during a schema refactor. The developer resumes the session. The transcript shows the migration call as cut off with no result. What should happen next?

A) Have Claude rerun the migration immediately, since a tool call with no recorded result can safely be assumed to have done nothing at all
B) Fork the session and rerun the migration in the fork, so the original session keeps a record if something goes wrong
C) Start a fresh session instead, because a resumed session with an interrupted tool call can never be trusted again
D) Have Claude check the database's migration state to see whether the migration applied before deciding whether to rerun it

<details>
<summary>Answer & explanation</summary>

**D)** A missing result does not mean the action did not happen, so the safe next step is to verify the real state before repeating a side-effecting command. Rerunning blindly risks applying the migration twice, a fresh session discards valid context without solving the uncertainty, and a fork changes nothing about the shared database.

*Hint if stuck: Did the command take effect? Find out before doing it again.*
</details>

---

## Question 72
A support team wants to test whether offering store credit instead of a refund would resolve a long-running dispute better, using the real customer conversation as the starting point, without touching the live conversation the customer can see. What is the best way to set this up with the Agent SDK?

A) Resume the live session with `fork_session` enabled, so the experiment runs in a new session that starts from a copy of the history
B) Resume the live session and send the store-credit message there, then edit the transcript file by hand afterwards to remove the attempt
C) Start a new session with an empty history and describe the dispute in a paragraph, so the experiment stays separate
D) Resume the live session with `continue` instead of `resume`, which runs the experiment without saving any messages

<details>
<summary>Answer & explanation</summary>

**A)** Forking creates a new session from a copy of the original history while leaving the original untouched, which is exactly what an off-line experiment needs. Editing transcript files by hand is fragile and unsupported, an empty session loses the real context being tested, and `continue` adds to the most recent session rather than creating a throwaway one.

*Hint if stuck: Try the alternative on a copy, not on the original.*
</details>

---

## Question 73
A research coordinator was paused overnight. It is resumed in the morning, but the shared pricing dataset that two of its subagents queried was refreshed at 2 a.m.; the other four subagents used static sources. What is the most effective way to continue the run?

A) Resume the coordinator without changes, since data refreshed only a few hours ago is unlikely to change the conclusions much
B) Resume the coordinator, tell it which dataset was refreshed and which subagent results came from it, and re-run only those queries
C) Discard the coordinator session and rerun all six subagents from scratch so that every result reflects the same moment
D) Resume the coordinator and ask it to decide for itself, without guidance, which of the results might now be out of date

<details>
<summary>Answer & explanation</summary>

**B)** When you know exactly what changed, resuming and telling the agent precisely which results are stale keeps the valid work and refreshes only what is affected. Ignoring the refresh leaves stale data in the analysis, rerunning everything wastes four still-valid results, and asking the agent to guess gives it no way to know about a change it never observed.

*Hint if stuck: Be specific about which earlier results can no longer be trusted.*
</details>

---

## Question 74
A team's CI bot keeps one long-lived Claude Code session per repository and resumes it for every new pull request, so it 'remembers' past reviews. Reviews have started citing functions that were deleted weeks ago. What is the better design?

A) Keep the long-lived session but run /compact at the start of each review to reduce the amount of old material
B) Fork the long-lived session for every pull request, so that each review starts from the full accumulated history of earlier reviews
C) Start a fresh session per pull request, passing in only the specific prior findings that are still relevant to it
D) Keep resuming the session but add an instruction that the bot must verify each function exists before citing it

<details>
<summary>Answer & explanation</summary>

**C)** A long-lived session accumulates tool results about code that no longer exists; a fresh session per PR with only the relevant prior findings avoids reasoning from stale state. Compaction keeps summaries of the stale material, forking copies all of it into every review, and a verification instruction is a soft fix for a structural problem.

*Hint if stuck: Is the remembered history still about the code that exists today?*
</details>

---

## Question 75
A team resumes Claude Code sessions across several days of work on an internal search service. Developers launch with `--mcp-config` pointing at a local file that adds the search-index MCP server, and resumed sessions keep coming back without the search-index tools whenever someone forgets the flag. Which change prevents this class of failure?

A) Run /compact right after each resume so that the summary of earlier tool calls brings the search-index tools back into context
B) Stop resuming sessions and start a fresh one every day, since resumed sessions cannot be relied on to have MCP tools available
C) Add a CLAUDE.md line asking Claude to reconnect the search-index server itself whenever it notices those tools are missing
D) Move the server into the project's committed .mcp.json configuration, which is read at every launch, instead of a per-launch flag

<details>
<summary>Answer & explanation</summary>

**D)** Resume restores the conversation, not every launch flag, so configuration that lives only in a command-line flag is lost whenever someone forgets it; configuration files read at each launch remove the human step. Compaction summarises history and cannot load tools, abandoning resume throws away valid context to work around a configuration problem, and Claude cannot attach an MCP server to its own session from an instruction.

*Hint if stuck: Think about what a resumed session re-reads at launch and what it only gets if you type it again.*
</details>

---

## Question 76
A developer has to hand over a half-finished investigation into memory growth in a worker service to a colleague who uses a different laptop. The developer's Claude Code session holds a lot of useful analysis. What is the most practical way to carry it over?

A) Have Claude write a structured summary of findings, ruled-out causes and next steps, which the colleague uses to start a fresh session
B) Ask the colleague to run `claude --continue` in the same repository, which finds the developer's most recent session
C) Send the colleague the session's name so that they can run `claude --resume <name>` on their own laptop
D) Fork the session and share the fork's ID with the colleague, since forks are created in a location shared across machines

<details>
<summary>Answer & explanation</summary>

**A)** Sessions are stored locally on the machine that created them, so a structured summary seeding a fresh session is the practical way to transfer the knowledge. A name or --continue only finds sessions on the colleague's own machine, and forks are stored locally just like any other session.

*Hint if stuck: Where does a session live, and who can reach it?*
</details>

---

## Question 77
A team tuning an invoice extraction prompt has spent a session having Claude analyse 20 failed extractions and categorise the failure patterns. They now want to try two schema designs, one with nullable fields and one with an explicit 'unclear' enum, each needing several iterations. What is the most efficient setup?

A) Try the first schema in the current session, then run /clear and try the second one in the same session afterwards
B) Fork the analysis session once for each schema design so both iterations start from the same failure analysis
C) Start two new sessions and have each one reanalyse the same 20 failed extractions before trying its schema design
D) Try both schema designs in the same session at the same time, alternating prompts between the two different approaches

<details>
<summary>Answer & explanation</summary>

**B)** Two independent lines of work from one shared analysis is the use case for forking. Running /clear throws away the analysis needed for the second design, re-analysing in two new sessions repeats the work, and alternating designs in one session lets each contaminate the other's reasoning.

*Hint if stuck: You want two branches that share a starting point but nothing after it.*
</details>

---

## Question 78
A long-running support session for a business customer was resumed after the company changed its refund policy from 30 to 14 days. Earlier in the session the agent fetched the old policy with a tool call and cited 30 days to the customer. The customer now asks whether a 20-day-old order can be refunded. What should the system do before the agent answers?

A) Nothing extra, since the agent will fetch the policy again automatically whenever the customer asks a policy question
B) Start a brand-new session for the customer, so that the agent can no longer see any of its earlier statements about the refund window
C) Inject a message into the resumed session stating that the refund policy changed to 14 days and the earlier result is outdated
D) Run /compact on the session so that the earlier policy lookup is condensed and no longer appears in the agent's context

<details>
<summary>Answer & explanation</summary>

**C)** The earlier tool result is now stale, and the agent will tend to reuse it rather than re-fetch; telling it precisely what changed keeps the case context while correcting the fact. Assuming a re-fetch is wishful, a brand-new session loses the case history, and compaction can preserve the outdated 30-day figure inside its summary.

*Hint if stuck: An agent trusts what it already read unless told otherwise.*
</details>

---

## Question 79
A nightly CI job first runs `claude -p` to audit dependency licences and records the result message's session_id. A second step on the same runner should ask that audit session a follow-up question and parse the answer as JSON. How should the second step be written?

A) Run `claude -p --continue` so that the CLI picks the most recent interactive session on the runner automatically
B) Run a new `claude -p` call that includes the first step's printed output pasted at the top of its prompt text
C) Run `claude -p --fork-session` with no session reference so that a copy of the audit is created for the question
D) Run `claude -p --resume <session-id> --output-format json` with the follow-up prompt and parse the result field

<details>
<summary>Answer & explanation</summary>

**D)** Resuming by the captured session ID targets exactly the audit session, and JSON output makes the follow-up answer parseable. --continue picks whatever is most recent rather than a specific session, --fork-session needs a session to fork from, and pasting printed output loses the tool results the audit gathered.

*Hint if stuck: You already captured the handle for the exact session you need.*
</details>

---

## Question 80
An architect has spent an hour in Claude Code mapping how a monolith's order module talks to six other modules. She now wants to evaluate splitting it out as a service, but the evaluation involves speculative changes she may abandon. She also wants to keep working on a small bug fix from the same understanding. What is the best approach?

A) Keep the bug fix in this session and run the speculative evaluation in a --fork-session fork working in a separate git worktree
B) Do the speculative evaluation in the current session first, then run /compact and switch to the bug fix afterwards
C) Write a summary of the module map into CLAUDE.md, run /clear, and then do both pieces of work in turn from there
D) Open a second terminal, resume the same session there, and run the evaluation and bug fix side by side in both terminals

<details>
<summary>Answer & explanation</summary>

**A)** Forking lets the speculative work branch from the shared understanding while the original session stays clean for the bug fix, and because a fork copies the conversation but not the files, a separate worktree keeps abandoned speculative edits out of the bug fix's checkout. Doing the speculation first pollutes the context the bug fix depends on, a CLAUDE.md summary is a lossy replacement for the session and clutters shared project memory, and resuming one session in two terminals interleaves both conversations.

*Hint if stuck: Keep speculative work on a branch you can abandon.*
</details>

---

## Question 81
An engineer resumes a Claude Code session after a long weekend. In the meantime, the team rebased the feature branch, which rewrote 300 files including most of the ones the session read. The engineer is unsure exactly which changes matter. Which approach is most reliable?

A) Resume the session and paste in the full git diff of the rebase, so it can work out which of its earlier file reads are now wrong
B) Start a fresh session with a short summary of the earlier conclusions, and let it re-read the code it needs from the new branch
C) Fork the old session and continue in the fork, so the original keeps an accurate record of the pre-rebase state of the code
D) Resume the session and continue as normal, re-reading files only when an edit fails because its anchor no longer matches

<details>
<summary>Answer & explanation</summary>

**B)** When most of the session's tool results are stale and the changes are too broad to describe precisely, a fresh session with a summary is safer than resuming. A 300-file diff floods the context and still leaves stale reads behind, waiting for edit failures only catches some stale reads, and forking copies the same outdated history.

*Hint if stuck: How much of what the session read is still true?*
</details>

---

## Question 82
A data team spent yesterday afternoon in a Claude Code session named `po-edge-cases` cataloguing why purchase-order extractions fail on scanned multi-currency documents. Nothing in the repository or the sample set has changed since. A teammate suggests starting a fresh session with a summary 'to be safe'. What should the analyst do?

A) Start the fresh session with a summary, since a resumed session always carries some risk of stale tool results
B) Fork `po-edge-cases` before continuing, so the original catalogue is protected in case today's work goes badly
C) Run `claude --resume po-edge-cases` and carry on, since the session's earlier reads and analysis are all still valid
D) Copy the session's key findings into CLAUDE.md and start a new session so the findings load automatically

<details>
<summary>Answer & explanation</summary>

**C)** Resuming is the right default when the session's tool results are still accurate; it keeps the full analysis without any lossy summarising. A fresh session with a summary is the remedy for stale context, which is not the situation here, forking is for exploring divergent approaches rather than simply continuing, and CLAUDE.md is for durable project guidance, not one investigation's working notes.

*Hint if stuck: Staleness is the reason to avoid resuming; is anything stale here?*
</details>

---

## Question 83
An architect spent 30 minutes in a Claude Code session reading 40 files of a monorepo and building a verified mental model of its service boundaries. She now wants to explore three mutually exclusive migration strategies, each requiring long follow-up investigation that would contaminate the others' reasoning. What is the most efficient setup?

A) Explore the three strategies sequentially in the same session, running /compact between each one to free up context for the next
B) Spawn three Task subagents from the current session, one per strategy
C) Paste a hand-written summary of the findings into three fresh sessions, one per strategy
D) Use fork_session to branch three sessions from the current one, so each strategy starts from the same loaded baseline

<details>
<summary>Answer & explanation</summary>

**D)** fork_session exists exactly for this: it branches new sessions from a shared baseline, so all three explorations start with the full 40-file understanding and none pollutes the others. Task subagents start with isolated, empty context, so the accumulated understanding would have to be repacked into each prompt and would arrive lossy. Sequential exploration with /compact lets earlier strategies bias later ones, and hand-written summaries lose fidelity.

*Hint if stuck: One mechanism duplicates an existing session's accumulated context; delegation does not.*
</details>

---

## Question 84
An engineer resumes a Claude Code session from Friday to continue a refactor. Over the weekend a teammate merged 14 commits to main that renamed AuthClient to IdentityClient and moved the src/auth/ directory. The resumed agent immediately proposes edits referencing the old class name and paths. What is the most reliable way to handle this resume staleness?

A) Add a CLAUDE.md note saying that after resuming, the agent should assume any file may have changed and re-verify before editing
B) Have the team always start fresh sessions instead of resuming, so stale context about renamed or moved files can never exist in the first place
C) On resume, inject a summary of the specific changes since the last session, like renames and moved paths, so the agent corrects its assumptions
D) Run /compact immediately after resuming so the stale history shrinks to a short summary

<details>
<summary>Answer & explanation</summary>

**C)** Stale resumed context is fixed by informing the agent of the specific changes, for example a SessionStart hook on resume that diffs against the last session's commit and injects what was renamed and moved. Always starting fresh is the strongest distractor, but it throws away the valuable in-progress refactor context that made resuming worthwhile. The CLAUDE.md note is probabilistic and forces wasteful wholesale re-reading, and /compact summarizes the stale facts without correcting any of them, so the wrong names survive in condensed form.

*Hint if stuck: Stale resumed context is fixed by telling the agent exactly what changed, not by general caution.*
</details>

---

## Question 85
On Monday an engineer spent an hour in a Claude Code session named payment-flake narrowing down a flaky payments test. Nothing in the repository changed overnight. On Tuesday she wants to continue exactly where she left off. What should she do?

A) Start a new session and paste Monday's whole transcript into the first message
B) Run claude --resume payment-flake to continue the named session
C) Use fork_session so Tuesday's work does not disturb Monday's history
D) Add Monday's findings to the project CLAUDE.md so any new session picks them up

<details>
<summary>Answer & explanation</summary>

**B)** Named session resumption continues a specific prior conversation with its context intact, and because nothing changed, its earlier tool results are still valid. Pasting a transcript is a clumsy copy of the same thing, forking is for exploring divergent approaches from a shared baseline, and CLAUDE.md is for durable project standards, not one investigation's notes.

*Hint if stuck: The prior context is still valid, so keep it.*
</details>

---

## Question 86
Two weeks ago an agent session analysed a service's module layout. Since then the team has refactored 60 files and renamed several packages. A developer wants to pick the analysis back up today. Which approach is most reliable?

A) Resume the old session and trust its earlier analysis, since the overall architecture is similar
B) Resume the old session and immediately run /compact to shrink the outdated context
C) Fork the old session so the original analysis is preserved while the fork works on the new code with all the earlier context intact
D) Start a fresh session seeded with a structured summary of the earlier findings, and let it re-read the code that changed

<details>
<summary>Answer & explanation</summary>

**D)** When many earlier tool results are stale, resuming makes the agent reason from file contents that no longer exist. A new session seeded with a concise summary keeps the useful conclusions without the stale details. Compacting or forking still carries the outdated tool results forward.

*Hint if stuck: How much of the old context is still true?*
</details>

---
