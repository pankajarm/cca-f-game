# Practice Test 01: The Loop Chamber
**D1: Agentic Architecture & Orchestration** (27% of the exam) · task statements 1.1

30 questions. Exam pace is 2 minutes per question.

---

## Question 1
A returns-processing support agent calls a lookup_order tool, and the order service occasionally times out. When that happens the team's loop code raises an exception, logs it, and ends the conversation with a generic apology, even though the customer's request could often be completed another way. What should the loop do instead?

A) Return a tool_result for that call with is_error set and a short description of the timeout, then call the API again
B) Wrap the tool in an automatic retry with exponential backoff and only end the conversation after five consecutive timeouts
C) Catch the exception and substitute an empty order object so the conversation can continue without interruption
D) Detect the timeout and immediately route the customer to a human agent with the full transcript attached for context

<details>
<summary>Answer & explanation</summary>

**A)** Tool failures belong in the history like any other result: a tool_result flagged with is_error lets Claude reason about the failure and pick another path, such as asking for an order number or trying a different lookup. Silent backoff in code hides the problem from the model and still ends in the same apology, and an empty order object feeds the model false data. Escalating every timeout to a human throws away cases the agent could have finished itself.

*Hint if stuck: Think about who should decide what to do after a tool fails, and what they need to see to decide.*
</details>

---

## Question 2
A contract-extraction agent sometimes returns stop_reason max_tokens, and the last content block is a tool_use for record_clauses whose JSON input is cut off. The loop currently tries to parse that partial input, fills missing fields with nulls, and writes the record. Which change addresses the root cause?

A) Keep parsing the partial input but add a schema validator downstream that rejects records with more than two null fields
B) Treat the response as truncated: retry the request with a higher max_tokens so Claude can emit a complete tool call
C) Append the partial tool_use and a tool_result saying the input was truncated so Claude can resend only the missing fields
D) Lower the temperature for extraction calls so the model produces shorter, more predictable JSON that fits the token budget

<details>
<summary>Answer & explanation</summary>

**B)** A max_tokens stop with an incomplete tool_use block means the call was never fully formed, so it must not be executed; the documented fix is to retry with a higher max_tokens. A downstream validator still writes partial records that happen to pass, and answering a malformed call with a tool_result pretends the call was valid. Temperature does not control output length, so it leaves the truncation in place.

*Hint if stuck: Ask whether a tool call that was cut off mid-generation is a call at all.*
</details>

---

## Question 3
To save tokens, a developer-productivity agent's loop sends Claude only the system prompt, the original request, and the most recent tool_result on each iteration. Engineers report the agent re-reads the same files repeatedly and sometimes forgets a test failure it saw two steps earlier. What is the correct fix?

A) Raise the iteration limit so the agent has enough turns left to re-read every file it needs before giving its answer
B) Add a line to the system prompt telling Claude to remember earlier tool outputs and avoid repeating calls it already made
C) Keep appending each assistant turn and its tool_result blocks to the message history so later turns can reason over them
D) Cache tool outputs in the application and return the cached copy whenever Claude requests a file it has already read

<details>
<summary>Answer & explanation</summary>

**C)** The model only knows what is in the messages it receives; dropping earlier assistant turns and tool results erases its working memory, so repeated reads are the expected outcome. Keeping the full history is how the loop carries state. A prompt instruction cannot recall data that was never sent, a cache in the application makes repeated calls cheaper without restoring the lost reasoning, and more iterations only buy more repetition.

*Hint if stuck: Where does the model's memory of earlier steps actually live between API calls?*
</details>

---

## Question 4
A billing-support agent handles tickets that range from a single refund to a mix of plan changes, disputed charges and address updates. The original design hard-codes a sequence: always call get_account, then get_invoices, then get_payments, then answer. Half the calls are wasted and unusual tickets get wrong answers. What design should replace it?

A) Write a classifier that maps each ticket type to a fixed tool sequence and add new branches whenever a new ticket type appears
B) Ask Claude once at the start to produce a full plan of tool calls, then execute that plan in code without further model calls
C) Keep the fixed sequence but call all of the tools in parallel at the start so latency stays low even when results go unused
D) Give Claude the tools with clear descriptions and let it choose which to call each turn, looping until stop_reason is end_turn

<details>
<summary>Answer & explanation</summary>

**D)** Model-driven tool selection lets the agent adapt to what each ticket needs and to what earlier tool results reveal, which a fixed script or a branch-per-type classifier cannot do. The classifier just moves the decision tree somewhere else and grows with every new ticket type. A plan executed blindly in code cannot react to a surprising result, and calling everything in parallel wastes the same calls faster.

*Hint if stuck: Consider who is best placed to pick the next tool once the previous result is known.*
</details>

---

## Question 5
A research coordinator's loop correctly continues on tool_use and stops on end_turn, with a safety cap of 40 iterations. On a hard query the cap is reached while Claude is still mid-investigation, and the code returns the latest assistant text to the user as the finished report. How should the cap be handled?

A) Keep the cap as a guardrail, but when it fires mark the run as incomplete and surface that state instead of a final answer
B) Raise the cap to 200 iterations so that legitimate long investigations are never cut off before they reach end_turn
C) When the cap is hit, send one more request asking Claude to wrap up, and present whatever it returns as the final report
D) Remove the cap entirely, because the loop already terminates correctly on end_turn and the cap only causes truncated reports

<details>
<summary>Answer & explanation</summary>

**A)** An iteration cap is a safety backstop, not a completion signal: reaching it means the work did not finish, so the result must be reported as incomplete rather than dressed up as a final report. Removing the cap loses protection against runaway loops, and raising it only moves the same mislabelling further out. A forced wrap-up request still presents unfinished research as if it were complete.

*Hint if stuck: Ask what each way of stopping actually tells you about the state of the work.*
</details>

---

## Question 6
A CI agent fixes failing lint rules in a pull request. After every iteration the team makes a second Claude call that reads the transcript and answers yes or no to 'Is the task complete?', and the loop stops on yes. The judge sometimes says yes while Claude's last response still had stop_reason tool_use with an unexecuted fix. What should the team change?

A) Make the completion judge stricter by giving it the lint output and requiring it to cite the specific rules that now pass
B) Drop the judge and drive the loop from stop_reason: run tools on tool_use and stop on end_turn, then verify with the linter
C) Run the completion judge only every third iteration, so it sees more of the transcript and makes fewer premature calls
D) Replace the judge with a cheaper regex over Claude's latest text that looks for phrases such as 'all lint errors fixed' before stopping

<details>
<summary>Answer & explanation</summary>

**B)** stop_reason already tells the loop whether Claude wants to keep acting, so a second model guessing at completion adds a failure mode and can cut off pending tool calls. Driving the loop from stop_reason, then checking the outcome with the real linter, is both simpler and deterministic. A stricter judge or a less frequent one is still a probabilistic stand-in for a signal the API gives directly, and a phrase regex is the classic parse-the-prose anti-pattern.

*Hint if stuck: The API response already carries a field that says whether Claude is finished acting.*
</details>

---

## Question 7
A support agent's create_return_label tool runs successfully, but the tool_result the loop sends back is only the string 'ok'. Claude then tells customers it cannot find their tracking number, or calls get_return_status immediately to look it up. What is the best fix?

A) Have the application send the tracking number to the customer by email so Claude does not need to mention it at all
B) Instruct Claude in the system prompt to always call get_return_status right after creating a label to fetch the details
C) Return the useful facts from the call in the tool_result, such as the label id, tracking number and drop-off deadline
D) Store the label details in a session variable and inject them into the system prompt on the next turn of the loop

<details>
<summary>Answer & explanation</summary>

**C)** Tool results are what the next turn reasons over; a bare 'ok' leaves Claude without the facts it needs, so it either says it cannot find them or spends another call fetching them. Returning the label id, tracking number and deadline in the tool_result fixes the cause. Forcing a follow-up call by prompt pays for a round trip that should not exist, and smuggling data into the system prompt breaks the link between the call and its result.

*Hint if stuck: What does the model know right after a tool runs, other than what the result contains?*
</details>

---

## Question 8
An invoice-extraction agent has a validate_invoice tool that checks Claude's draft against a JSON schema. When validation fails, the loop code discards the draft and starts a brand-new conversation with the same prompt, which often fails the same way three times in a row. What should the loop do?

A) Start the new conversation with a higher temperature so that each retry is more likely to produce a different draft
B) Accept the draft after three failed attempts and flag the invoice for manual review so the pipeline keeps moving
C) Add the full JSON schema to the system prompt a second time so the model pays closer attention to the requirements
D) Return the validation errors as the tool_result so Claude can see exactly which fields failed and correct its draft

<details>
<summary>Answer & explanation</summary>

**D)** Validation errors are exactly the information Claude needs to fix the draft, and returning them as a tool_result in the same conversation lets the next turn act on them. Restarting from scratch throws that feedback away, so repeated identical failures are expected; a higher temperature only makes the guesses more random. Repeating the schema adds nothing the model was missing, and accepting after three failures turns a fixable error into manual work.

*Hint if stuck: Ask what each new attempt knows about why the previous one was rejected.*
</details>

---

## Question 9
A developer building a code-search agent appends each tool's output to the system prompt under a 'Recent results' heading, then sends a user message saying 'continue'. Claude often calls the same tool again with the same input, as if it had not seen the output. Which change fixes this?

A) Send each output as a tool_result block that references the matching tool_use id in the next user message
B) Move the 'Recent results' heading to the top of the system prompt so the model reads the outputs before its other instructions
C) Replace the word 'continue' with an explicit instruction naming the tool output Claude should use in its next response
D) Truncate each tool output to its first 500 characters so the system prompt stays short enough for the model to attend to

<details>
<summary>Answer & explanation</summary>

**A)** Claude links results to calls through tool_result blocks that carry the tool_use_id; text pasted into the system prompt is not connected to the call that produced it, so the model treats the call as unanswered. Sending proper tool_result blocks fixes the cause. Reordering the system prompt or wording the user message more precisely keeps the broken structure, and truncating outputs throws away data while leaving the mismatch.

*Hint if stuck: How does the API connect a result to the call that requested it?*
</details>

---

## Question 10
To cut request size, a CI test-generation agent includes the tools array only on the first request of each run; follow-up requests that carry tool results omit it. Runs now fail or stall right after the first tool call. What is the right fix?

A) Describe the available tools in plain text inside the system prompt so follow-up requests stay small without the array
B) Keep sending the same tools array on every request in the loop, including the requests that return tool results
C) Split the run so that each tool call starts a new conversation that includes the tools array on its first request
D) Ask Claude to request each tool call it will need in the first response, so later requests can leave the tools out

<details>
<summary>Answer & explanation</summary>

**B)** Each Messages API request is stateless, so the tools array must be sent again on every request of the loop, including those that return tool results; without it the history refers to tools the request does not define. Describing tools in prose does not give Claude callable tools, and starting a new conversation per call discards the history the loop depends on. Asking for every call up front defeats the point of letting each result shape the next step.

*Hint if stuck: Think about what the server has to work with when it validates a request whose history contains tool calls.*
</details>

---

## Question 11
After returning tool results, a support agent's loop also appends a text block saying 'Here are the results, please continue.' in the same user message. The team starts seeing responses with stop_reason end_turn and almost no content right after tool calls. What should they change first?

A) Detect empty end_turn responses and resend the identical request until Claude produces a non-empty reply
B) Switch the loop to stop on non-empty text alone, so an empty end_turn response triggers another API call
C) Send only the tool_result blocks in that user message and drop the extra text that follows them
D) Move the 'please continue' text into the system prompt so it applies to each turn instead of the user message

<details>
<summary>Answer & explanation</summary>

**C)** Text appended after tool_result blocks teaches Claude that a user message follows each tool result, and it starts ending its turn early; the documented fix is to send only the tool_result blocks. Resending the same request does not change the pattern, and gating termination on non-empty text reintroduces the text-check anti-pattern. A blanket 'continue' instruction in the system prompt is a prompt patch over a message-format problem.

*Hint if stuck: Look at what the message after a tool call is supposed to contain, and nothing else.*
</details>

---

## Question 12
In a multi-agent research system, a search subagent's loop ends the run with the message 'No data found' whenever a web_search tool returns zero results. Many of these queries could succeed with different keywords or a narrower date range. What change best fits an agentic design?

A) Add a list of fallback keyword templates in code and run them automatically whenever a search comes back empty
B) Raise the number of results requested per search from 10 to 50 so that searches are far less likely to return nothing at all
C) Have the coordinator detect 'No data found' and respawn the same subagent with the same prompt one more time
D) Return the empty result to Claude as a normal tool_result and let it decide whether to reformulate or report the gap

<details>
<summary>Answer & explanation</summary>

**D)** An empty result is information, and the model is best placed to decide whether to rephrase, widen the date range, or conclude that the gap is real. Hard-coded fallback templates rebuild a brittle decision tree outside the model, and asking for more results does not help when the query itself is wrong. Respawning with an identical prompt simply repeats the same search.

*Hint if stuck: Ask whether an empty search is a failure of the run or just one more fact to reason about.*
</details>

---

## Question 13
A code-generation agent's loop receives a response with stop_reason tool_use and runs the requested tools, but then builds the next request from the old history plus a user message holding the tool_result blocks. It never appends the assistant turn that contained the tool_use blocks. What will happen, and what is the fix?

A) The request will be rejected for results with no matching call; append the assistant content, then the results
B) Claude will work normally but use more tokens; trim the tool_result blocks so the history stays compact between loop turns
C) Claude will repeat its last call; add a system-prompt rule telling it never to call the same tool twice in a row
D) Claude will lose its tool definitions; resend the full tools array with a note naming the tool that was just called

<details>
<summary>Answer & explanation</summary>

**A)** Each tool_result must respond to a tool_use in the preceding assistant message, so skipping the assistant turn leaves results that point at calls the history does not contain; the request is malformed and the model loses its own reasoning. The fix is to append the assistant content exactly as received, then the results. Trimming results or adding a no-repeat rule does not repair the missing turn, and the tools array is not what was lost.

*Hint if stuck: Every result in the history must have a call it answers, sitting just before it.*
</details>

---

## Question 14
A developer-productivity agent can run shell commands, and the application has a deny-list for commands like rm -rf. When Claude requests a denied command, the loop silently skips it and sends the next request with results only for the other tool calls in that response. What is the correct handling?

A) Remove the denied tool_use block from the assistant message before appending it, so the history matches the results sent
B) Return a tool_result for the denied call explaining that policy blocked it, alongside results for the calls that did run
C) Run the denied command inside a disposable container instead, so every tool_use still gets a genuine execution result
D) Stop the loop and show the user an error, because a denied command means the agent can no longer be trusted

<details>
<summary>Answer & explanation</summary>

**B)** Every tool_use needs a matching tool_result, and an explicit 'blocked by policy' result keeps the history valid and lets Claude choose a safer approach. Editing the assistant message rewrites what the model actually said and hides the refusal from it. Running the command elsewhere defeats the policy, and ending the whole session over one blocked call throws away work the agent can still finish safely.

*Hint if stuck: Think about what the history must look like for the next request to be valid, and what Claude should learn from it.*
</details>

---

## Question 15
An internal dev-tools agent built directly on the Messages API has two bugs. Sometimes it replies "I'll run the test suite now" and the program exits without running anything. When tools do run, Claude calls run_tests again and again as if it never saw the output. The loop decides it is finished whenever the response contains a text block, and each iteration sends only the system prompt plus the user's original request. Which changes fix the loop? (Choose two.)

A) Branch on stop_reason: run the requested tools and call again on tool_use, and finish on end_turn
B) Append the assistant's tool_use turn and a user turn of matching tool_result blocks before each new call
C) Scan the reply text for phrases such as "I'll run" and keep looping for as long as one of them shows up
D) Set tool_choice to any so that each response has to contain a tool call until the agent has finished
E) Cap the loop at three iterations so that repeated run_tests calls stop before they use up the budget

<details>
<summary>Answer & explanation</summary>

**A, B** A text block often accompanies a tool_use block, so stopping on 'has text' exits mid-task; stop_reason is the signal to continue (tool_use) or stop (end_turn). Claude only knows a tool's output if the assistant's tool_use turn and the matching tool_result turn are in the messages it receives, so the history must accumulate. Matching phrases in the prose is the same fragile text check in another form. Forcing a tool call on every turn means the agent can never end with an answer. An iteration cap hides the missing history instead of fixing it and cuts off legitimate long tasks.

*Hint if stuck: Ask what signal the API gives you for 'more work to do', and what Claude can see on the next call.*
</details>

---

## Question 16
A returns agent built on the Messages API often gets one response with three tool_use blocks: lookup_order, get_return_policy and check_warehouse. The loop runs all three but sends back the result for the first one only, and the next request is rejected with an error about tool_use ids that lack tool_result blocks. Separately, when check_warehouse times out, the loop raises an exception and the conversation ends. The team wants to keep the lookups in parallel. Which changes fix the loop? (Choose two.)

A) Reply with one user message holding a tool_result for every tool_use block, each with its tool_use_id
B) When a tool fails, send its tool_result with is_error set to true and the error text, then call again
C) Drop the failed call's tool_use block from the assistant turn and send back the results that succeeded
D) Report the timeout as a plain text block placed ahead of the tool_result blocks in the next user turn
E) Set disable_parallel_tool_use to true so each response carries one tool_use block and needs one result

<details>
<summary>Answer & explanation</summary>

**A, B** Every tool_use block in a response needs a matching tool_result, by tool_use_id, in the user message that follows, so returning one result of three is rejected. A failed tool should still get a tool_result, marked is_error with a readable message, so Claude can retry, work around it or tell the customer, instead of the loop crashing. Disabling parallel tool use would avoid the first error but gives up the parallel lookups the team wants to keep. Editing the assistant turn to hide the failed call rewrites history and leaves Claude unaware that the stock check never happened. A text block cannot stand in for the missing result, and tool_result blocks must come first in that user message.

*Hint if stuck: For each call Claude asked for, what must the next message contain, and how does a failure still count as an answer?*
</details>

---

## Question 17
A research coordinator's loop runs one fixed sequence for every question: web_search, then fetch_page on the top three hits, then summarize. Simple factual questions waste calls, and broad questions stop before enough sources are read. The loop also ends as soon as the reply contains the words "Final report", which Claude sometimes writes while it is still planning. Which changes should the team make? (Choose two.)

A) Set tool_choice to name the next tool in the sequence on each turn so the order is applied reliably
B) Ask Claude to end its final reply with a JSON line {"done": true}, and stop the loop on that line
C) Keep looping while stop_reason is tool_use, and treat end_turn as the sign the research is finished
D) Give Claude the tools with clear descriptions and let it pick each next call from what it has found
E) Pick one of three fixed tool sequences per question with a classifier call that runs before the loop

<details>
<summary>Answer & explanation</summary>

**C, D** Letting the model choose the next tool from what it has learned fits the work to each question, which a fixed path cannot do. stop_reason is the API's signal: tool_use means run the tools and call again, end_turn means Claude has finished. Choosing among three fixed sequences is still a hard-coded decision tree with fewer branches. Forcing each next tool through tool_choice enforces the rigid order more strictly. A done flag in the reply text is another phrase to parse and fails the same way the "Final report" check does.

*Hint if stuck: Who should decide the next step in an open-ended task, and what does the API itself tell you about whether a turn is over?*
</details>

---

## Question 18
A developer-productivity agent uses the Messages API with its own client tools plus Anthropic's server-side web_search tool. Its loop runs tools when stop_reason is tool_use and otherwise returns the reply as the final answer. Two bugs show up: long code-generation replies reach users cut off mid-function, and on broad research questions the agent sometimes hands back a half-finished answer right after a burst of web searches. Which changes fix the loop? (Choose two.)

A) On max_tokens, treat the reply as cut off: continue it, or retry with a higher limit if a tool call broke
B) Treat each stop_reason other than tool_use as a failure and resend the identical request until it passes
C) Add stop_sequences for a closing marker so the model wraps up its answer before reaching the limit
D) Switch the request to streaming so that long code replies arrive in chunks instead of being truncated
E) On pause_turn, append the assistant content as it is and call again so the server-side search resumes

<details>
<summary>Answer & explanation</summary>

**A, E** max_tokens means the reply hit the length limit, so it is incomplete: continue the response, or raise max_tokens and retry when the cut fell inside a tool_use block. pause_turn means a server-tool turn was paused; sending the assistant content back as-is lets Claude finish the search and the answer. A stop sequence ends output earlier, which does not make long code fit. Resending the identical request drops the paused content and repeats the same cut-off. Streaming changes how tokens arrive, not how many the response may contain.

*Hint if stuck: Each non-tool_use stop reason means something different. Which ones say "not done yet", and what does each need?*
</details>

---

## Question 19
A research coordinator calls the Messages API with Anthropic's server-side web_search tool and no client tools. On broad questions, some responses come back with stop_reason pause_turn and a server_tool_use block that has no result yet. The loop treats anything other than tool_use as final, so these partial answers get published as finished reports. How should the loop handle this stop reason?

A) Run the web search locally for the dangling server_tool_use block and return its output in a tool_result block that carries the matching id
B) Send a new request with the paused assistant content appended as-is, so Claude can resume the server-side search and finish its turn
C) Treat pause_turn the same as end_turn and publish the report, since Claude only pauses after it has gathered enough sources to answer
D) Raise max_tokens and repeat the original request without the paused content, since the pause means the output budget was used up

<details>
<summary>Answer & explanation</summary>

**B)** pause_turn means a server-tool loop reached its iteration limit; the docs say to send the assistant content back unchanged so Claude can continue. The search runs on Anthropic's side, so the client has nothing to execute: a response that waits on a client tool always stops with tool_use, never pause_turn. Treating the pause as end_turn publishes unfinished work, and max_tokens is a separate stop reason; restarting without the paused content throws away the progress already made.

*Hint if stuck: Ask who executes this tool, and what the API expects from you so that the turn it started can carry on.*
</details>

---

## Question 20
A platform team's deployment agent decides whether to execute a tool with the check: if response.content[0].type == 'tool_use'. It worked in testing, but in production the agent frequently ends with half-finished commentary like 'Let me check the rollout status first' and never runs the tool. Why?

A) tool_use blocks require tool_choice set to any, so the default auto setting suppresses them in production traffic and leaves the check with text
B) The model often emits a text block before the tool_use block, so checking only index zero misses the call; branch on stop_reason and scan all blocks
C) The streaming API reorders content blocks nondeterministically, so the agent must disable streaming to restore positional checks
D) The model is hitting max_tokens before reaching the tool_use block, so raising max_tokens will fix the behavior

<details>
<summary>Answer & explanation</summary>

**B)** A single response can contain both text and tool_use blocks, and the narrative text frequently comes first, so a content[0] check silently drops tool calls. The robust pattern is to branch on stop_reason tool_use and iterate over all content blocks to collect every tool_use. A max_tokens truncation would surface as stop_reason max_tokens, not as this position-dependent miss, and tool_choice auto does not suppress tool calls.

*Hint if stuck: Think about what else can occupy the first slot of the content array alongside a tool call.*
</details>

---

## Question 21
A structured-extraction pipeline pulls clause data from 80-page legal contracts. The loop's logic is: if stop_reason is tool_use, run tools; otherwise treat the response as the final answer. QA reports that roughly 5% of outputs are valid-looking JSON that simply ends mid-field. What is the root cause?

A) The model is hallucinating malformed JSON under load, so the pipeline needs a retry pass at temperature 0
B) The extraction schema is missing required fields, so the model improvises structure and stops generating early
C) The loop drops trailing content blocks whenever a response contains both text and tool_use together
D) The loop treats stop_reason max_tokens as completion; it must detect truncation and request a continuation

<details>
<summary>Answer & explanation</summary>

**D)** stop_reason max_tokens means the response was cut off at the token ceiling, not finished, and any branch that lumps everything other than tool_use together with end_turn will silently accept truncated output. Retrying at temperature 0 regenerates the same truncated result because the cause is the token limit, not randomness, and schema gaps would produce wrong structure, not output that stops mid-field.

*Hint if stuck: Consider every way a response can end, and which of them this branch quietly treats as finished.*
</details>

---

## Question 22
After a runaway agent burned $400 in API calls overnight, an e-commerce team's incident review proposes capping the order-management agent at 3 loop iterations as the primary termination mechanism. A week later, 30% of legitimate multi-step tasks (check inventory, apply discount, create shipment) fail half-finished. What should the architecture look like?

A) Keep the cap at 3 but prompt the model to plan ahead so each task finishes within three tool calls
B) Let stop_reason end_turn drive termination, investigate why the runaway loop never reached it, and keep a generous iteration cap only as a safety fallback
C) Raise the cap to exactly the longest observed legitimate task length, currently measured at 6 iterations, so real tasks finish while runaway loops are still cut off early
D) Replace the loop with a fixed three-step pipeline so the iteration count becomes fully deterministic

<details>
<summary>Answer & explanation</summary>

**B)** Iteration caps are safety fallbacks against pathological loops, never the primary control; genuine completion is signaled by stop_reason end_turn. Tuning the cap to the longest observed task just moves the failure boundary — any task one step longer still truncates — and neither tuned cap explains or fixes whatever caused the original runaway. A fixed pipeline throws away the adaptive sequencing the order workflows need.

*Hint if stuck: Ask what mechanism should normally end the loop, and what role a hard cap is actually meant to play.*
</details>

---

## Question 23
A market-research agent asks Claude to compare three competitors, and the response comes back with stop_reason tool_use containing three web_search tool_use blocks. The developer's loop executes only the first tool_use block, appends a single tool_result, and resends the history. The API rejects the request. Why?

A) Every tool_use block in the response must be executed, and the next user message must carry a tool_result for each of them
B) Parallel tool calls require a separate API request per tool_use block, replayed back one at a time in order
C) Search tools cannot be parallelized, so the agent must force sequential calls by setting tool_choice to a single named tool on each turn
D) The text block preceding the tool calls must be stripped from history before any tool_results can be appended

<details>
<summary>Answer & explanation</summary>

**A)** Claude requests parallel work by emitting multiple tool_use blocks in a single response, and the following user message must include a matching tool_result for every tool_use id. Answering only one leaves unmatched tool calls, which the API rejects. There is no one-call-per-request replay protocol — all results return together in the next user message — and assistant text blocks stay in history untouched.

*Hint if stuck: Count how many tool calls the model made versus how many answers you sent back.*
</details>

---

## Question 24
A logistics agent calls a track_shipment tool. The developer's code executes the tool, writes the carrier response to a dashboard, and immediately calls the API again with the message history unchanged. The model calls track_shipment again with identical arguments, and again, indefinitely. What explains the behavior?

A) The model is overfitting to the tool description, so it should be rewritten to say call at most once per shipment
B) track_shipment is not idempotent, so the API keeps retrying the call automatically until its results converge
C) The loop needs tool_choice set to none after the first call so the model stops requesting the same tool
D) The result never entered the history, so each request looks like the first and the model asks again

<details>
<summary>Answer & explanation</summary>

**D)** The model's only memory is the message array you send; using the result out-of-band while resending unchanged history means every request is identical to the first, so re-requesting the tool is the model's rational move. The fix is to append the assistant message with its tool_use block plus a user message carrying the tool_result, then resend the full history. Setting tool_choice none suppresses the symptom while the model still never sees the data it asked for, and the API never executes or retries tools on its own.

*Hint if stuck: Picture the exact request the API receives on the second call and compare it with the first.*
</details>

---

## Question 25
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

## Question 26
A CI pipeline agent streams Claude's responses into a build log. The loop's rule is: if the response contains any text block, post it as the final summary and exit; otherwise execute tools. Builds frequently end with summaries like 'Now I will run the test suite to confirm' while the test tool never executes. What is the flaw?

A) Streaming splits text across multiple deltas, so the loop observes text before the tool blocks finish parsing
B) The system prompt should instruct the model to never produce text in the same turn as a tool call
C) max_tokens is truncating each response after the text block but before the tool_use block arrives
D) Text and tool_use blocks can share a response, so the loop should branch on stop_reason, not on content

<details>
<summary>Answer & explanation</summary>

**D)** A response with stop_reason tool_use routinely carries narrative text alongside its tool_use blocks, so the mere presence of text says nothing about completion — the rule fails even on a fully assembled, non-streamed response, which makes the delta-ordering theory a red herring. Branching on stop_reason is deterministic and correct, whereas prompting the model to suppress accompanying text fights normal, useful behavior and remains best-effort.

*Hint if stuck: Ask whether this failure would still happen with streaming switched off and the full response in hand.*
</details>

---

## Question 27
A travel-booking agent receives a response with four parallel tool_use blocks: two flight searches and two hotel searches. The calls run on an async worker pool and finish out of order. The developer sends each tool_result back as its own user message the moment it completes, and the API rejects the second request. What is the correct handling?

A) Buffer the results and send four consecutive user messages arranged in the original tool_use order
B) Re-run the workers sequentially so results arrive in exactly the order the model requested them
C) Send all four results together in one user message, each matched to its call by tool_use_id
D) Restrict the agent to one tool_use block per response using tool_choice so the ordering problem disappears

<details>
<summary>Answer & explanation</summary>

**C)** All tool_results answering a parallel batch belong in the single next user message, where each is paired with its call by tool_use_id rather than by position or arrival time. Splitting results across multiple user messages leaves unanswered tool_use blocks at each intermediate step, which the API rejects regardless of ordering, and forcing sequential execution throws away the latency benefit of parallel calls.

*Hint if stuck: Consider what the API expects to see right after an assistant turn that made several calls at once.*
</details>

---

## Question 28
A developer-productivity Slack bot built on the Claude API answers questions like 'who owns the payments service?'. The loop calls Claude, sees stop_reason tool_use, executes the ownership-lookup tool, appends the assistant message and tool_result correctly — and then posts the raw tool_result JSON to Slack as the answer. Users complain the output is unreadable. What step is missing?

A) A post-processing step in code that reformats the lookup JSON into readable prose before it gets posted
B) A second formatting call to a separate Claude session that rewrites the JSON into a friendly answer
C) Calling the API again with the updated history so the model can turn the tool result into its answer
D) Changing the tool itself to return prose instead of JSON so no later formatting step is ever needed

<details>
<summary>Answer & explanation</summary>

**C)** Executing a tool is the midpoint of a loop iteration, not the end: after appending the assistant message and tool_result, the loop must resend the full history so the model can interpret the data and compose its final answer, terminating on end_turn. Reformatting the JSON in code or in the tool still skips the model's interpretation of the result against the user's actual question, and a separate formatting session duplicates what the existing loop does for free while discarding the conversation context the answer depends on.

*Hint if stuck: Tool execution is the middle of one loop iteration — what closes the iteration?*
</details>

---

## Question 29
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

## Question 30
A customer support resolution agent built on the Claude API runs an agentic loop. The implementation scans each assistant response for the phrase "Ticket resolved" to decide when to stop, and caps the loop at 4 iterations as its primary completion control. Tickets sometimes close while the agent still had a pending tool call, and complex tickets get cut off mid-investigation. Which change fixes the loop?

A) Raise the iteration cap to 12 and require the agent to print TICKET RESOLVED in capital letters on its own line before the loop is allowed to exit
B) Set tool_choice to "any" on every request so the agent always calls a tool and the loop can never end prematurely on a text-only response
C) Drive the loop off stop_reason: run tools and resend history on tool_use, finish on end_turn, keep the cap as a backstop
D) Treat any response containing a text block as the final answer and end the loop there, on the assumption that tool-calling turns contain only tool_use blocks

<details>
<summary>Answer & explanation</summary>

**C)** The loop's control signal is stop_reason, not assistant prose: "tool_use" means execute and continue, "end_turn" means done, and iteration caps are safety fallbacks rather than primary controls. Parsing text for a completion phrase is unreliable, and ending on any text block fails because responses can legitimately contain text and tool_use blocks together. Forcing tool_choice "any" prevents the loop from ever ending naturally, and raising the cap just patches the same broken signal.

*Hint if stuck: The API already gives you a machine-readable completion signal — do not infer completion from prose.*
</details>

---
