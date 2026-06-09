# Practice Test 01: The Loop Chamber
**D1: Agentic Architecture & Orchestration** (27% of the exam) — Agentic loop mechanics

15 questions. Exam pace is 2 minutes per question; aim for 30 minutes.
Pass bar in the game: 7/10 on a random draw. Pass bar here: be honest.

---

## Question 1
A customer support resolution agent's loop decides it is finished by checking whether the assistant's text contains the phrase TASK COMPLETE. In production the agent sometimes exits while a refund lookup is still pending, because the model wrote 'Task complete for step one — now checking refund status' right before emitting a tool_use block. What is the correct fix?

A) Tighten the system prompt so the model writes TASK COMPLETE only as the final line of its genuinely last message
B) Switch the completion check to look for an empty content array in the API response
C) Terminate the loop only on stop_reason end_turn, and route stop_reason tool_use back into tool execution
D) Add a regex that ignores TASK COMPLETE whenever it appears in the same response as a tool_use block

<details>
<summary>Answer & explanation</summary>

**C)** stop_reason is the API's authoritative, machine-readable signal for whether the model is done; assistant prose is probabilistic and responses routinely mix narration with tool_use blocks. The regex patch still leaves termination dependent on phrasing the model is never guaranteed to produce, and the prompt-tightening fix is best-effort for the same reason, so both paper over the root cause instead of fixing it.

*Hint if stuck: The API already provides a machine-readable signal for whether the model is done — do not infer completion from language.*
</details>

---

## Question 2
A fintech document-extraction service runs an agentic loop against the Claude API. After executing a lookup_exchange_rate tool, the developer appends a user message containing the tool_result and calls the API again — and the request fails with a 400 error saying the tool_result references an unknown tool_use id. What is wrong?

A) The assistant message containing the tool_use block was never appended to history, so the tool_result has no preceding call to match against
B) The tool_result block must be wrapped in an assistant-role message rather than a user-role message for the id matching to work
C) The follow-up request must set tool_choice to any so the API can correlate the returned result with the originating call
D) The tool_result content must be stringified JSON, because structured content blocks cannot be matched against a tool_use id

<details>
<summary>Answer & explanation</summary>

**A)** Every tool_result must reference a tool_use block in the immediately preceding assistant message, so the loop has to append the full assistant response (including its tool_use blocks) and then a user message carrying the tool_result before resending the complete history. The assistant-role distractor inverts the protocol — tool_results belong in user messages because tool output is input you provide — and tool_choice and content formatting have nothing to do with id matching.

*Hint if stuck: A tool_result can only be matched against a tool_use block that actually exists in the history you send back.*
</details>

---

## Question 3
A platform team's deployment agent decides whether to execute a tool with the check: if response.content[0].type == 'tool_use'. It worked in testing, but in production the agent frequently ends with half-finished commentary like 'Let me check the rollout status first' and never runs the tool. Why?

A) tool_use blocks are only emitted when tool_choice is set to any, so the default auto setting suppresses them in production traffic
B) The model often emits a text block before the tool_use block, so checking only index zero misses the call; branch on stop_reason and scan every content block
C) The streaming API reorders content blocks nondeterministically, so the agent must disable streaming to restore positional checks
D) The model is hitting max_tokens before reaching the tool_use block, so raising max_tokens will fix the behavior

<details>
<summary>Answer & explanation</summary>

**B)** A single response can contain both text and tool_use blocks, and the narrative text frequently comes first, so a content[0] check silently drops tool calls. The robust pattern is to branch on stop_reason tool_use and iterate over all content blocks to collect every tool_use. A max_tokens truncation would surface as stop_reason max_tokens, not as this position-dependent miss, and tool_choice auto does not suppress tool calls.

*Hint if stuck: Think about what else can occupy the first slot of the content array alongside a tool call.*
</details>

---

## Question 4
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

## Question 5
After a runaway agent burned $400 in API calls overnight, an e-commerce team's incident review proposes capping the order-management agent at 3 loop iterations as the primary termination mechanism. A week later, 30% of legitimate multi-step tasks (check inventory, apply discount, create shipment) fail half-finished. What should the architecture look like?

A) Keep the cap at 3 but prompt the model to plan ahead so every task finishes within three tool calls
B) Let stop_reason end_turn drive termination, investigate why the runaway loop never reached it, and keep a generous iteration cap only as a safety fallback
C) Raise the cap to exactly the longest observed legitimate task length, currently measured at 6 iterations
D) Replace the loop with a fixed three-step pipeline so the iteration count becomes fully deterministic

<details>
<summary>Answer & explanation</summary>

**B)** Iteration caps are safety fallbacks against pathological loops, never the primary control; genuine completion is signaled by stop_reason end_turn. Tuning the cap to the longest observed task just moves the failure boundary — any task one step longer still truncates — and neither tuned cap explains or fixes whatever caused the original runaway. A fixed pipeline throws away the adaptive sequencing the order workflows need.

*Hint if stuck: Ask what mechanism should normally end the loop, and what role a hard cap is actually meant to play.*
</details>

---

## Question 6
A market-research agent asks Claude to compare three competitors, and the response comes back with stop_reason tool_use containing three web_search tool_use blocks. The developer's loop executes only the first tool_use block, appends a single tool_result, and resends the history. The API rejects the request. Why?

A) Every tool_use block in the response must be executed, and the next user message must carry a tool_result for each of them
B) Parallel tool calls require a separate API request per tool_use block, replayed back one at a time in order
C) Search tools cannot be parallelized, so the agent must force sequential calls by setting tool_choice on each turn
D) The text block preceding the tool calls must be stripped from history before any tool_results can be appended

<details>
<summary>Answer & explanation</summary>

**A)** Claude requests parallel work by emitting multiple tool_use blocks in a single response, and the following user message must include a matching tool_result for every tool_use id. Answering only one leaves unmatched tool calls, which the API rejects. There is no one-call-per-request replay protocol — all results return together in the next user message — and assistant text blocks stay in history untouched.

*Hint if stuck: Count how many tool calls the model made versus how many answers you sent back.*
</details>

---

## Question 7
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

## Question 8
A logistics agent calls a track_shipment tool. The developer's code executes the tool, writes the carrier response to a dashboard, and immediately calls the API again with the message history unchanged. The model calls track_shipment again with identical arguments, and again, indefinitely. What explains the behavior?

A) The model is overfitting to the tool description, so it should be rewritten to say call at most once per shipment
B) track_shipment is not idempotent, so the API keeps retrying the call automatically until its results converge
C) The loop needs tool_choice set to none after the first call so the model stops requesting the same tool
D) From the model's perspective the tool was never answered, because the history it receives still ends at its own unanswered call

<details>
<summary>Answer & explanation</summary>

**D)** The model's only memory is the message array you send; using the result out-of-band while resending unchanged history means every request is identical to the first, so re-requesting the tool is the model's rational move. The fix is to append the assistant message with its tool_use block plus a user message carrying the tool_result, then resend the full history. Setting tool_choice none suppresses the symptom while the model still never sees the data it asked for, and the API never executes or retries tools on its own.

*Hint if stuck: The model's entire memory of the conversation is the message array you send it.*
</details>

---

## Question 9
A telecom support agent has 12 tools. Transcripts show it alternating endlessly: get_customer, then search_invoices, then get_customer again with the same id, then search_invoices again. Inspecting the loop code, each API call sends only the system prompt, the original user question, and the single most recent assistant and tool_result exchange. What is the root cause?

A) Earlier tool results are dropped from each request, so the model cannot see what it already learned and keeps re-fetching the same data
B) get_customer and search_invoices have overlapping descriptions, so the model cannot decide between the two of them reliably
C) The model needs an explicit scratchpad tool so it can persist its accumulated findings between loop iterations
D) Twelve tools exceeds the reliable selection limit for one agent, so the model thrashes among similar-looking options

<details>
<summary>Answer & explanation</summary>

**A)** The agentic loop requires resending the full accumulated history on every iteration; truncating to the latest exchange erases everything the model previously learned, making a re-fetch the rational next step every time. Overlapping descriptions or tool count would cause wrong-tool selection, not this precise alternating re-retrieval of data the agent already had, and a scratchpad tool is a workaround for history the loop should simply be sending.

*Hint if stuck: Compare what the agent has already learned with what each new API request actually contains.*
</details>

---

## Question 10
An SRE team built an incident-triage agent as a hard-coded decision tree: 60 branches mapping alert types to runbook steps. Every novel failure mode requires an engineering sprint to add branches, and last month the tree dead-ended on 40% of incidents. No individual triage step is mandatory or compliance-sensitive — engineers just need the right runbook surfaced. What should they move to?

A) A hybrid design that hard-codes the first three diagnostic steps and lets the model choose only afterward
B) A model-driven loop with the runbooks and observability tools, letting stop_reason determine when triage is complete
C) A much larger decision tree generated offline by Claude and regenerated weekly from incident history
D) The existing tree plus a fallback branch that pages a human engineer for any unmatched alert type

<details>
<summary>Answer & explanation</summary>

**B)** When the step sequence cannot be enumerated in advance and no step is invariant, a model-driven loop is the right architecture: the model adapts its tool sequence to each novel incident and signals completion via stop_reason. A hybrid only earns its complexity when specific steps must run deterministically, which this scenario explicitly rules out; a bigger tree merely postpones the next dead end, and paging a human on 40% of incidents is not triage.

*Hint if stuck: Hybrids exist to guarantee invariant critical steps — check whether this scenario actually has any.*
</details>

---

## Question 11
A CI pipeline agent streams Claude's responses into a build log. The loop's rule is: if the response contains any text block, post it as the final summary and exit; otherwise execute tools. Builds frequently end with summaries like 'Now I will run the test suite to confirm' while the test tool never executes. What is the flaw?

A) Streaming splits text across multiple deltas, so the loop observes text before the tool blocks finish parsing
B) The system prompt should instruct the model to never produce text in the same turn as a tool call
C) max_tokens is truncating each response after the text block but before the tool_use block arrives
D) Text and tool_use blocks legitimately coexist in one response; stop_reason, not the content, tells the loop what to do next

<details>
<summary>Answer & explanation</summary>

**D)** A response with stop_reason tool_use routinely carries narrative text alongside its tool_use blocks, so the mere presence of text says nothing about completion — the rule fails even on a fully assembled, non-streamed response, which makes the delta-ordering theory a red herring. Branching on stop_reason is deterministic and correct, whereas prompting the model to suppress accompanying text fights normal, useful behavior and remains best-effort.

*Hint if stuck: Ask which field of the response is the contract for the loop's next action — it is not the content array.*
</details>

---

## Question 12
A travel-booking agent receives a response with four parallel tool_use blocks: two flight searches and two hotel searches. The calls run on an async worker pool and finish out of order. The developer sends each tool_result back as its own user message the moment it completes, and the API rejects the second request. What is the correct handling?

A) Buffer the results and send four consecutive user messages arranged in the original tool_use order
B) Re-run the workers sequentially so results arrive in exactly the order the model requested them
C) Gather all four results into one user message, each tool_result matched by its tool_use_id; completion order is irrelevant
D) Restrict the agent to one tool_use block per response using tool_choice so ordering never arises

<details>
<summary>Answer & explanation</summary>

**C)** All tool_results answering a parallel batch belong in the single next user message, where each is paired with its call by tool_use_id rather than by position or arrival time. Splitting results across multiple user messages leaves unanswered tool_use blocks at each intermediate step, which the API rejects regardless of ordering, and forcing sequential execution throws away the latency benefit of parallel calls.

*Hint if stuck: Think about how the API pairs a result with its originating call — it is not by arrival order.*
</details>

---

## Question 13
A healthcare intake agent keeps hitting its 25-iteration safety cap. Traces show check_eligibility being called repeatedly with valid arguments; the executor wraps tool calls in a try/except that catches a flaky upstream timeout and appends a tool_result with empty content, after which the model calls the same tool again. The cap is the only thing stopping the loop. What is the right fix?

A) Return a structured error in the tool_result — what failed, whether it is retryable, suggested alternatives — so the model can adapt or escalate
B) Lower the safety cap from 25 to 5 so each runaway episode costs less when it inevitably happens
C) Add a system-prompt rule telling the model to never call the same tool more than twice consecutively
D) Have the executor silently retry the upstream service until it eventually succeeds, however long that takes

<details>
<summary>Answer & explanation</summary>

**A)** An empty tool_result gives the model zero information, so retrying the identical call is its only sensible move; informative structured error content lets it retry deliberately, switch strategy, or escalate. A bounded local retry inside the executor is reasonable for transient timeouts, but unbounded silent retrying just trades an infinite model loop for an executor that hangs through any persistent outage while the model stays blind. Lowering the cap shrinks the blast radius without restoring progress, and the prompt rule is probabilistic.

*Hint if stuck: Ask what the model actually learns from each failed call, and what it would need to know to choose differently.*
</details>

---

## Question 14
A developer-productivity Slack bot built on the Claude API answers questions like 'who owns the payments service?'. The loop calls Claude, sees stop_reason tool_use, executes the ownership-lookup tool, appends the assistant message and tool_result correctly — and then posts the raw tool_result JSON to Slack as the answer. Users complain the output is unreadable. What step is missing?

A) A post-processing step in code that reformats the lookup JSON into readable prose before it gets posted
B) A second formatting call to a separate Claude session that rewrites the JSON into a friendly answer
C) Calling the API again with the full updated history so the model turns the tool_result into its answer, looping until stop_reason end_turn
D) Changing the tool itself to return prose instead of JSON so no later formatting step is ever needed

<details>
<summary>Answer & explanation</summary>

**C)** Executing a tool is the midpoint of a loop iteration, not the end: after appending the assistant message and tool_result, the loop must resend the full history so the model can interpret the data and compose its final answer, terminating on end_turn. Reformatting the JSON in code or in the tool still skips the model's interpretation of the result against the user's actual question, and a separate formatting session duplicates what the existing loop does for free while discarding the conversation context the answer depends on.

*Hint if stuck: Tool execution is the middle of one loop iteration — what closes the iteration?*
</details>

---

## Question 15
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
