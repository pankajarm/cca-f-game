/* ARCHITECT'S ASCENT — question bank
 * 192 scenario questions for the Claude Certified Architect — Foundations exam (2026).
 * Generated and adversarially verified June 2026. Single source of truth:
 * the markdown practice tests are built from this file by scripts/build_tests.py. */
window.BANK = {
 "floor-01": [
  {
   "q": "A customer support resolution agent's loop decides it is finished by checking whether the assistant's text contains the phrase TASK COMPLETE. In production the agent sometimes exits while a refund lookup is still pending, because the model wrote 'Task complete for step one — now checking refund status' right before emitting a tool_use block. What is the correct fix?",
   "options": [
    "Tighten the system prompt so the model writes TASK COMPLETE only as the final line of its genuinely last message",
    "Switch the completion check to look for an empty content array in the API response",
    "Terminate the loop only on stop_reason end_turn, and route stop_reason tool_use back into tool execution",
    "Add a regex that ignores TASK COMPLETE whenever it appears in the same response as a tool_use block"
   ],
   "correct": 2,
   "explanation": "stop_reason is the API's authoritative, machine-readable signal for whether the model is done; assistant prose is probabilistic and responses routinely mix narration with tool_use blocks. The regex patch still leaves termination dependent on phrasing the model is never guaranteed to produce, and the prompt-tightening fix is best-effort for the same reason, so both paper over the root cause instead of fixing it.",
   "hint": "The API already provides a machine-readable signal for whether the model is done — do not infer completion from language.",
   "difficulty": "core",
   "tags": [
    "stop_reason",
    "loop-termination"
   ]
  },
  {
   "q": "A fintech document-extraction service runs an agentic loop against the Claude API. After executing a lookup_exchange_rate tool, the developer appends a user message containing the tool_result and calls the API again — and the request fails with a 400 error saying the tool_result references an unknown tool_use id. What is wrong?",
   "options": [
    "The assistant message containing the tool_use block was never appended to history, so the tool_result has no preceding call to match against",
    "The tool_result block must be wrapped in an assistant-role message rather than a user-role message for the id matching to work",
    "The follow-up request must set tool_choice to any so the API can correlate the returned result with the originating call",
    "The tool_result content must be stringified JSON, because structured content blocks cannot be matched against a tool_use id"
   ],
   "correct": 0,
   "explanation": "Every tool_result must reference a tool_use block in the immediately preceding assistant message, so the loop has to append the full assistant response (including its tool_use blocks) and then a user message carrying the tool_result before resending the complete history. The assistant-role distractor inverts the protocol — tool_results belong in user messages because tool output is input you provide — and tool_choice and content formatting have nothing to do with id matching.",
   "hint": "A tool_result can only be matched against a tool_use block that actually exists in the history you send back.",
   "difficulty": "core",
   "tags": [
    "history-management",
    "tool_result"
   ]
  },
  {
   "q": "A platform team's deployment agent decides whether to execute a tool with the check: if response.content[0].type == 'tool_use'. It worked in testing, but in production the agent frequently ends with half-finished commentary like 'Let me check the rollout status first' and never runs the tool. Why?",
   "options": [
    "tool_use blocks are only emitted when tool_choice is set to any, so the default auto setting suppresses them in production traffic",
    "The model often emits a text block before the tool_use block, so checking only index zero misses the call; branch on stop_reason and scan every content block",
    "The streaming API reorders content blocks nondeterministically, so the agent must disable streaming to restore positional checks",
    "The model is hitting max_tokens before reaching the tool_use block, so raising max_tokens will fix the behavior"
   ],
   "correct": 1,
   "explanation": "A single response can contain both text and tool_use blocks, and the narrative text frequently comes first, so a content[0] check silently drops tool calls. The robust pattern is to branch on stop_reason tool_use and iterate over all content blocks to collect every tool_use. A max_tokens truncation would surface as stop_reason max_tokens, not as this position-dependent miss, and tool_choice auto does not suppress tool calls.",
   "hint": "Think about what else can occupy the first slot of the content array alongside a tool call.",
   "difficulty": "core",
   "tags": [
    "content-blocks",
    "stop_reason"
   ]
  },
  {
   "q": "A structured-extraction pipeline pulls clause data from 80-page legal contracts. The loop's logic is: if stop_reason is tool_use, run tools; otherwise treat the response as the final answer. QA reports that roughly 5% of outputs are valid-looking JSON that simply ends mid-field. What is the root cause?",
   "options": [
    "The model is hallucinating malformed JSON under load, so the pipeline needs a retry pass at temperature 0",
    "The extraction schema is missing required fields, so the model improvises structure and stops generating early",
    "The loop drops trailing content blocks whenever a response contains both text and tool_use together",
    "The loop treats stop_reason max_tokens as completion; it must detect truncation and request a continuation"
   ],
   "correct": 3,
   "explanation": "stop_reason max_tokens means the response was cut off at the token ceiling, not finished, and any branch that lumps everything other than tool_use together with end_turn will silently accept truncated output. Retrying at temperature 0 regenerates the same truncated result because the cause is the token limit, not randomness, and schema gaps would produce wrong structure, not output that stops mid-field.",
   "hint": "There are more stop_reason values than just tool_use and end_turn — one of them means the model was cut off.",
   "difficulty": "core",
   "tags": [
    "max_tokens",
    "stop_reason"
   ]
  },
  {
   "q": "After a runaway agent burned $400 in API calls overnight, an e-commerce team's incident review proposes capping the order-management agent at 3 loop iterations as the primary termination mechanism. A week later, 30% of legitimate multi-step tasks (check inventory, apply discount, create shipment) fail half-finished. What should the architecture look like?",
   "options": [
    "Keep the cap at 3 but prompt the model to plan ahead so every task finishes within three tool calls",
    "Let stop_reason end_turn drive termination, investigate why the runaway loop never reached it, and keep a generous iteration cap only as a safety fallback",
    "Raise the cap to exactly the longest observed legitimate task length, currently measured at 6 iterations",
    "Replace the loop with a fixed three-step pipeline so the iteration count becomes fully deterministic"
   ],
   "correct": 1,
   "explanation": "Iteration caps are safety fallbacks against pathological loops, never the primary control; genuine completion is signaled by stop_reason end_turn. Tuning the cap to the longest observed task just moves the failure boundary — any task one step longer still truncates — and neither tuned cap explains or fixes whatever caused the original runaway. A fixed pipeline throws away the adaptive sequencing the order workflows need.",
   "hint": "Ask what mechanism should normally end the loop, and what role a hard cap is actually meant to play.",
   "difficulty": "hard",
   "tags": [
    "iteration-caps",
    "loop-termination"
   ]
  },
  {
   "q": "A market-research agent asks Claude to compare three competitors, and the response comes back with stop_reason tool_use containing three web_search tool_use blocks. The developer's loop executes only the first tool_use block, appends a single tool_result, and resends the history. The API rejects the request. Why?",
   "options": [
    "Every tool_use block in the response must be executed, and the next user message must carry a tool_result for each of them",
    "Parallel tool calls require a separate API request per tool_use block, replayed back one at a time in order",
    "Search tools cannot be parallelized, so the agent must force sequential calls by setting tool_choice on each turn",
    "The text block preceding the tool calls must be stripped from history before any tool_results can be appended"
   ],
   "correct": 0,
   "explanation": "Claude requests parallel work by emitting multiple tool_use blocks in a single response, and the following user message must include a matching tool_result for every tool_use id. Answering only one leaves unmatched tool calls, which the API rejects. There is no one-call-per-request replay protocol — all results return together in the next user message — and assistant text blocks stay in history untouched.",
   "hint": "Count how many tool calls the model made versus how many answers you sent back.",
   "difficulty": "core",
   "tags": [
    "parallel-tools",
    "tool_result"
   ]
  },
  {
   "q": "A bank's account-onboarding agent must always run a KYC sanctions screen before account creation and always write an audit record afterward — regulators fine for misses. Between those two steps the conversation varies wildly: document re-requests, name clarifications, address conflicts. The current pure model-driven loop skipped the sanctions screen twice last quarter despite a bolded system-prompt instruction. What design fixes this?",
   "options": [
    "Strengthen the system prompt with few-shot examples that show the sanctions screen running first every time",
    "Replace the whole flow with a hard-coded decision tree that enumerates every possible onboarding path",
    "Use a hybrid: invoke the sanctions screen and audit write programmatically in code, and let the model-driven loop handle the variable conversation between them",
    "Set tool_choice to force the sanctions-screen tool on every single API call inside the loop"
   ],
   "correct": 2,
   "explanation": "Prompt instructions are probabilistic, so steps with regulatory consequences must be guaranteed by deterministic code, while the adaptive middle of the flow is exactly where a model-driven loop earns its keep. A full decision tree sacrifices the flexibility the variable steps need, few-shot examples remain best-effort, and forcing one tool on every call breaks the rest of the workflow entirely.",
   "hint": "Separate the steps that must happen every time from the steps that genuinely vary, and ask which mechanism guarantees each kind.",
   "difficulty": "hard",
   "tags": [
    "hybrid-loop",
    "orchestration"
   ]
  },
  {
   "q": "A logistics agent calls a track_shipment tool. The developer's code executes the tool, writes the carrier response to a dashboard, and immediately calls the API again with the message history unchanged. The model calls track_shipment again with identical arguments, and again, indefinitely. What explains the behavior?",
   "options": [
    "The model is overfitting to the tool description, so it should be rewritten to say call at most once per shipment",
    "track_shipment is not idempotent, so the API keeps retrying the call automatically until its results converge",
    "The loop needs tool_choice set to none after the first call so the model stops requesting the same tool",
    "From the model's perspective the tool was never answered, because the history it receives still ends at its own unanswered call"
   ],
   "correct": 3,
   "explanation": "The model's only memory is the message array you send; using the result out-of-band while resending unchanged history means every request is identical to the first, so re-requesting the tool is the model's rational move. The fix is to append the assistant message with its tool_use block plus a user message carrying the tool_result, then resend the full history. Setting tool_choice none suppresses the symptom while the model still never sees the data it asked for, and the API never executes or retries tools on its own.",
   "hint": "The model's entire memory of the conversation is the message array you send it.",
   "difficulty": "core",
   "tags": [
    "history-management",
    "infinite-loops"
   ]
  },
  {
   "q": "A telecom support agent has 12 tools. Transcripts show it alternating endlessly: get_customer, then search_invoices, then get_customer again with the same id, then search_invoices again. Inspecting the loop code, each API call sends only the system prompt, the original user question, and the single most recent assistant and tool_result exchange. What is the root cause?",
   "options": [
    "Earlier tool results are dropped from each request, so the model cannot see what it already learned and keeps re-fetching the same data",
    "get_customer and search_invoices have overlapping descriptions, so the model cannot decide between the two of them reliably",
    "The model needs an explicit scratchpad tool so it can persist its accumulated findings between loop iterations",
    "Twelve tools exceeds the reliable selection limit for one agent, so the model thrashes among similar-looking options"
   ],
   "correct": 0,
   "explanation": "The agentic loop requires resending the full accumulated history on every iteration; truncating to the latest exchange erases everything the model previously learned, making a re-fetch the rational next step every time. Overlapping descriptions or tool count would cause wrong-tool selection, not this precise alternating re-retrieval of data the agent already had, and a scratchpad tool is a workaround for history the loop should simply be sending.",
   "hint": "Compare what the agent has already learned with what each new API request actually contains.",
   "difficulty": "hard",
   "tags": [
    "infinite-loops",
    "history-management"
   ]
  },
  {
   "q": "An SRE team built an incident-triage agent as a hard-coded decision tree: 60 branches mapping alert types to runbook steps. Every novel failure mode requires an engineering sprint to add branches, and last month the tree dead-ended on 40% of incidents. No individual triage step is mandatory or compliance-sensitive — engineers just need the right runbook surfaced. What should they move to?",
   "options": [
    "A hybrid design that hard-codes the first three diagnostic steps and lets the model choose only afterward",
    "A model-driven loop with the runbooks and observability tools, letting stop_reason determine when triage is complete",
    "A much larger decision tree generated offline by Claude and regenerated weekly from incident history",
    "The existing tree plus a fallback branch that pages a human engineer for any unmatched alert type"
   ],
   "correct": 1,
   "explanation": "When the step sequence cannot be enumerated in advance and no step is invariant, a model-driven loop is the right architecture: the model adapts its tool sequence to each novel incident and signals completion via stop_reason. A hybrid only earns its complexity when specific steps must run deterministically, which this scenario explicitly rules out; a bigger tree merely postpones the next dead end, and paging a human on 40% of incidents is not triage.",
   "hint": "Hybrids exist to guarantee invariant critical steps — check whether this scenario actually has any.",
   "difficulty": "hard",
   "tags": [
    "model-driven-loops",
    "orchestration"
   ]
  },
  {
   "q": "A CI pipeline agent streams Claude's responses into a build log. The loop's rule is: if the response contains any text block, post it as the final summary and exit; otherwise execute tools. Builds frequently end with summaries like 'Now I will run the test suite to confirm' while the test tool never executes. What is the flaw?",
   "options": [
    "Streaming splits text across multiple deltas, so the loop observes text before the tool blocks finish parsing",
    "The system prompt should instruct the model to never produce text in the same turn as a tool call",
    "max_tokens is truncating each response after the text block but before the tool_use block arrives",
    "Text and tool_use blocks legitimately coexist in one response; stop_reason, not the content, tells the loop what to do next"
   ],
   "correct": 3,
   "explanation": "A response with stop_reason tool_use routinely carries narrative text alongside its tool_use blocks, so the mere presence of text says nothing about completion — the rule fails even on a fully assembled, non-streamed response, which makes the delta-ordering theory a red herring. Branching on stop_reason is deterministic and correct, whereas prompting the model to suppress accompanying text fights normal, useful behavior and remains best-effort.",
   "hint": "Ask which field of the response is the contract for the loop's next action — it is not the content array.",
   "difficulty": "core",
   "tags": [
    "content-blocks",
    "stop_reason"
   ]
  },
  {
   "q": "A travel-booking agent receives a response with four parallel tool_use blocks: two flight searches and two hotel searches. The calls run on an async worker pool and finish out of order. The developer sends each tool_result back as its own user message the moment it completes, and the API rejects the second request. What is the correct handling?",
   "options": [
    "Buffer the results and send four consecutive user messages arranged in the original tool_use order",
    "Re-run the workers sequentially so results arrive in exactly the order the model requested them",
    "Gather all four results into one user message, each tool_result matched by its tool_use_id; completion order is irrelevant",
    "Restrict the agent to one tool_use block per response using tool_choice so ordering never arises"
   ],
   "correct": 2,
   "explanation": "All tool_results answering a parallel batch belong in the single next user message, where each is paired with its call by tool_use_id rather than by position or arrival time. Splitting results across multiple user messages leaves unanswered tool_use blocks at each intermediate step, which the API rejects regardless of ordering, and forcing sequential execution throws away the latency benefit of parallel calls.",
   "hint": "Think about how the API pairs a result with its originating call — it is not by arrival order.",
   "difficulty": "hard",
   "tags": [
    "parallel-tools",
    "tool_result"
   ]
  },
  {
   "q": "A healthcare intake agent keeps hitting its 25-iteration safety cap. Traces show check_eligibility being called repeatedly with valid arguments; the executor wraps tool calls in a try/except that catches a flaky upstream timeout and appends a tool_result with empty content, after which the model calls the same tool again. The cap is the only thing stopping the loop. What is the right fix?",
   "options": [
    "Return a structured error in the tool_result — what failed, whether it is retryable, suggested alternatives — so the model can adapt or escalate",
    "Lower the safety cap from 25 to 5 so each runaway episode costs less when it inevitably happens",
    "Add a system-prompt rule telling the model to never call the same tool more than twice consecutively",
    "Have the executor silently retry the upstream service until it eventually succeeds, however long that takes"
   ],
   "correct": 0,
   "explanation": "An empty tool_result gives the model zero information, so retrying the identical call is its only sensible move; informative structured error content lets it retry deliberately, switch strategy, or escalate. A bounded local retry inside the executor is reasonable for transient timeouts, but unbounded silent retrying just trades an infinite model loop for an executor that hangs through any persistent outage while the model stays blind. Lowering the cap shrinks the blast radius without restoring progress, and the prompt rule is probabilistic.",
   "hint": "Ask what the model actually learns from each failed call, and what it would need to know to choose differently.",
   "difficulty": "hard",
   "tags": [
    "infinite-loops",
    "tool-errors"
   ]
  },
  {
   "q": "A developer-productivity Slack bot built on the Claude API answers questions like 'who owns the payments service?'. The loop calls Claude, sees stop_reason tool_use, executes the ownership-lookup tool, appends the assistant message and tool_result correctly — and then posts the raw tool_result JSON to Slack as the answer. Users complain the output is unreadable. What step is missing?",
   "options": [
    "A post-processing step in code that reformats the lookup JSON into readable prose before it gets posted",
    "A second formatting call to a separate Claude session that rewrites the JSON into a friendly answer",
    "Calling the API again with the full updated history so the model turns the tool_result into its answer, looping until stop_reason end_turn",
    "Changing the tool itself to return prose instead of JSON so no later formatting step is ever needed"
   ],
   "correct": 2,
   "explanation": "Executing a tool is the midpoint of a loop iteration, not the end: after appending the assistant message and tool_result, the loop must resend the full history so the model can interpret the data and compose its final answer, terminating on end_turn. Reformatting the JSON in code or in the tool still skips the model's interpretation of the result against the user's actual question, and a separate formatting session duplicates what the existing loop does for free while discarding the conversation context the answer depends on.",
   "hint": "Tool execution is the middle of one loop iteration — what closes the iteration?",
   "difficulty": "core",
   "tags": [
    "agentic-loop",
    "history-management"
   ]
  },
  {
   "q": "An internal code-generation agent for a monorepo executes a read_file tool and appends the result to history as a new assistant-role message containing the tool_result block. The next API call fails with a 400 validation error about tool_result placement. Where does the tool_result belong?",
   "options": [
    "Inside the same assistant message that contained the tool_use block, placed directly after it",
    "In a new user-role message immediately following the assistant message whose tool_use it answers",
    "In the system prompt as a transient context block that gets replaced on every iteration",
    "In a dedicated top-level tool_results request parameter, kept separate from the messages array"
   ],
   "correct": 1,
   "explanation": "The protocol alternates roles: the model's tool_use arrives in an assistant message, and your application replies with the result in a user message — from the API's perspective, tool output is input that you provide. There is no top-level tool_results parameter, results never live inside assistant messages or the system prompt, and everything flows through the messages array.",
   "hint": "Tool output is something your application tells the model — consider which conversation role that maps to.",
   "difficulty": "core",
   "tags": [
    "tool_result",
    "history-management"
   ]
  }
 ],
 "floor-02": [
  {
   "q": "A customer support coordinator agent has already looked up the customer's account ID, plan tier, and the disputed invoice number through earlier tool calls. It then spawns a billing-investigator subagent with the Task prompt 'Investigate why this customer was double-charged.' The subagent responds that it cannot proceed without knowing which customer or invoice is involved. What is the root cause?",
   "options": [
    "The billing-investigator is running on Haiku, which cannot retain account details; switch its model to Opus",
    "Project CLAUDE.md was never set up, so subagents load no memory at startup; create one containing the account details",
    "Subagents start with isolated context; the coordinator must pack the account ID, plan tier, and invoice number directly into the Task prompt",
    "Subagents need a shared-memory flag enabled in settings.json before they can read the coordinator's conversation history"
   ],
   "correct": 2,
   "explanation": "Subagents do not inherit the coordinator's conversation — each starts with an isolated context, so any fact the subagent needs must be explicitly written into its task prompt. Packing the account ID, tier, and invoice number into the Task prompt fixes the root cause. CLAUDE.md is version-controlled project memory for stable standards, not a channel for per-ticket runtime facts, and no shared-memory flag exists in settings.json.",
   "hint": "Consider what a freshly spawned subagent can and cannot see of its parent's conversation.",
   "difficulty": "core",
   "tags": [
    "context-isolation",
    "context-packing"
   ]
  },
  {
   "q": "A multi-agent research system must profile 8 competitors, and each profile is independent of the others. Today the coordinator spawns one research subagent, waits for its report, then spawns the next, taking 25 minutes end to end. What change makes the subagents run concurrently?",
   "options": [
    "Have the coordinator emit all 8 Task tool calls as multiple tool_use blocks in a single response",
    "Set CLAUDE_PARALLEL=8 in the environment so the runtime fans out Task calls automatically",
    "Submit the 8 profiles as a Message Batches job so they process simultaneously",
    "Add 'work on all competitors at the same time' to the coordinator's system prompt"
   ],
   "correct": 0,
   "explanation": "Parallel subagents are spawned by issuing multiple Task tool calls in one assistant response — each tool_use block launches a subagent that runs concurrently. CLAUDE_PARALLEL is not a real setting, and the Batch API trades latency for cost with results within 24 hours, so it cannot speed up a pipeline whose problem is wall-clock time. A prompt instruction is probabilistic best-effort; the actual mechanism is emitting the Task calls together in one turn, and only that guarantees concurrency.",
   "hint": "Recall how a single assistant turn can contain more than one tool invocation.",
   "difficulty": "core",
   "tags": [
    "parallel-tasks",
    "task-tool"
   ]
  },
  {
   "q": "A nightly CI job runs claude -p 'Audit every changed package for license violations' --allowedTools 'Read,Grep,Glob,Bash'. The prompt tells the coordinator to delegate each package to a subagent, but it never spawns any — it scans everything itself and exhausts its context window on large diffs. What is wrong?",
   "options": [
    "Headless print mode cannot spawn subagents; the audit must run in an interactive session",
    "The Task tool is missing from allowedTools, so the coordinator has no way to spawn subagents; add Task to the list",
    "The prompt needs firmer wording such as 'you MUST delegate every package to a subagent'",
    "Subagent support in CI requires exporting CLAUDE_SUBAGENTS=true before invoking claude -p"
   ],
   "correct": 1,
   "explanation": "Spawning subagents happens through the Task tool, so Task must appear in allowedTools like any other tool; without it the coordinator can only do the work inline. Headless mode supports subagents fine, and CLAUDE_SUBAGENTS is not a real variable. Stronger prompt wording cannot grant a capability the tool allowlist has removed.",
   "hint": "Delegation itself happens through a tool, and tools must be permitted.",
   "difficulty": "core",
   "tags": [
    "allowedTools",
    "headless"
   ]
  },
  {
   "q": "An architect spent 30 minutes in a Claude Code session reading 40 files of a monorepo and building a verified mental model of its service boundaries. She now wants to explore three mutually exclusive migration strategies, each requiring long follow-up investigation that would contaminate the others' reasoning. What is the most efficient setup?",
   "options": [
    "Explore the three strategies sequentially in the same session, running /compact between each one",
    "Spawn three Task subagents from the current session, one per strategy",
    "Paste a hand-written summary of the findings into three fresh sessions, one per strategy",
    "Use fork_session to branch three sessions from the current one, so each strategy starts from the same loaded baseline"
   ],
   "correct": 3,
   "explanation": "fork_session exists exactly for this: it branches new sessions from a shared baseline, so all three explorations start with the full 40-file understanding and none pollutes the others. Task subagents start with isolated, empty context, so the accumulated understanding would have to be repacked into each prompt and would arrive lossy. Sequential exploration with /compact lets earlier strategies bias later ones, and hand-written summaries lose fidelity.",
   "hint": "One mechanism duplicates an existing session's accumulated context; delegation does not.",
   "difficulty": "hard",
   "tags": [
    "fork_session",
    "branching"
   ]
  },
  {
   "q": "A security-review coordinator audits a payments service by spawning three subagents: SQL injection in /api/orders, XSS in /web/templates, and hardcoded secrets in /config. Two weeks after release, an SSRF vulnerability is exploited in /api/webhooks — a directory no subagent was ever assigned. What was the architectural failure?",
   "options": [
    "The decomposition left coverage gaps; the coordinator should partition the full scope so every directory and vulnerability class has an owner",
    "The subagents ran on Haiku, which is too weak to detect SSRF; the scouts should run on Opus",
    "The SSRF-focused subagent failed silently; add retry logic so transient subagent failures are re-run",
    "Each subagent prompt should have ended with 'also flag anything else suspicious you happen to notice'"
   ],
   "correct": 0,
   "explanation": "Overly narrow decomposition is a known multi-agent pitfall: anything outside the assigned slices is simply never examined. The fix is to partition the entire scope — directories and vulnerability classes — so the union of subagent assignments covers everything. No SSRF agent existed to retry, and a vague 'anything else' suffix is a probabilistic patch that never guarantees /api/webhooks gets read.",
   "hint": "Ask whether the union of the assigned slices actually equals the whole scope.",
   "difficulty": "core",
   "tags": [
    "decomposition",
    "coverage-gaps"
   ]
  },
  {
   "q": "A market-intelligence coordinator spawns four research subagents scoped as 'pricing trends', 'market trends', 'industry trends', and 'competitor pricing'. The synthesized report repeats the same three statistics four times, and token spend is roughly quadruple a single-agent baseline. What should the architect change?",
   "options": [
    "Add a deduplication pass in the synthesizer that strips repeated claims before writing the report",
    "Redefine the subagent scopes as non-overlapping partitions of the research space before delegating",
    "Instruct each subagent to skip any topic the other three subagents are already covering",
    "Raise the scouts' temperature so the four agents are less likely to converge on identical findings"
   ],
   "correct": 1,
   "explanation": "Overlapping scopes are a decomposition pitfall: the four assignments describe nearly the same territory, so duplicated work and token spend are baked in before any agent runs. Partitioning the scope into mutually exclusive slices fixes the root cause. A synthesizer dedup pass hides the symptom while still paying for the redundant research, sampling settings cannot change what territory each agent was assigned, and subagents cannot 'skip what others cover' because their contexts are isolated from one another.",
   "hint": "Look at the four scope definitions themselves rather than at what happens downstream.",
   "difficulty": "core",
   "tags": [
    "decomposition",
    "overlap"
   ]
  },
  {
   "q": "A platform team in a 300-developer monorepo wants a reusable schema-migration-checker subagent that any engineer's session can delegate to. It must be limited to Read, Grep, and Glob, and run on a cheaper model than the main session. How should it be defined?",
   "options": [
    "Document the checker's behavior and tool limits in the project CLAUDE.md so every session knows the convention",
    "Register it as an MCP server in .mcp.json with the tool restrictions in the server config",
    "Create .claude/agents/migration-checker.md with YAML frontmatter setting description, tools, and model, and commit it",
    "Add .claude/commands/migration-checker.md so engineers can invoke it as a slash command"
   ],
   "correct": 2,
   "explanation": "Custom subagents are defined as files in .claude/agents/ whose YAML frontmatter declares the description, the tool allowlist, and a per-agent model — exactly the three requirements here — and committing the file shares it repo-wide. CLAUDE.md is memory and cannot enforce tool or model restrictions. An MCP server exposes tools, not a delegable agent, and a slash command is a reusable prompt without its own restricted toolset and model.",
   "hint": "One specific directory holds delegable agent definitions with per-agent tools and model.",
   "difficulty": "core",
   "tags": [
    "custom-subagents",
    "claude-agents-dir"
   ]
  },
  {
   "q": "A research pipeline runs 12 scout subagents that each fetch one source and extract publication dates and key claims — mechanical work — plus one synthesizer that writes the final competitive analysis. Analysts trigger it on demand and wait for the memo, and each run costs about $40 with everything on Opus. How do you cut cost with the least quality risk?",
   "options": [
    "Move the whole pipeline, scouts and synthesizer alike, onto Haiku",
    "Reduce the scout count from 12 to 3 so fewer Opus invocations occur",
    "Submit the synthesizer's final call through the Batch API for the 50% discount",
    "Set model: haiku in the scout agents' frontmatter and keep the synthesizer on Opus"
   ],
   "correct": 3,
   "explanation": "Per-agent model selection is the point of the model field in .claude/agents/ frontmatter: simple fetch-and-extract scout work suits Haiku, while the quality-critical synthesis stays on a stronger model. Moving everything to Haiku risks the final analysis, and cutting scouts from 12 to 3 trades cost for coverage gaps. The Batch API has no latency SLA and can take up to 24 hours, which breaks an on-demand pipeline, and it discounts only one call while 12 Opus scouts drive most of the spend.",
   "hint": "Match model capability to each role's difficulty instead of pricing the whole pipeline uniformly.",
   "difficulty": "core",
   "tags": [
    "model-selection",
    "haiku-scouts"
   ]
  },
  {
   "q": "A due-diligence system spawns one subagent per source type — SEC filings, news coverage, earnings-call transcripts — and each returns a free-prose summary. The coordinator's final memo asserts 'revenue grew 40%', but analysts cannot trace which source said it, and the filings and a news article actually disagreed. What design change fixes this?",
   "options": [
    "Require subagents to return structured outputs that map each claim to its source and date",
    "Prompt the coordinator to always cite sources when it writes the final memo",
    "Have the coordinator re-fetch all the underlying documents itself and verify every figure before the memo is published",
    "Pass the subagents' full raw transcripts into the coordinator's context instead of summaries"
   ],
   "correct": 0,
   "explanation": "Attribution must be preserved at the boundary where it is lost: prose summaries strip provenance, so subagents should emit structured claim-source-date records the coordinator can carry into synthesis, keeping conflicting claims visible with temporal metadata. Prompting the coordinator to cite cannot work because the source information never reached it. Forwarding raw transcripts bloats the hub's context, and re-fetching duplicates the subagents' entire job.",
   "hint": "Find the exact point in the pipeline where provenance is destroyed.",
   "difficulty": "hard",
   "tags": [
    "structured-outputs",
    "attribution"
   ]
  },
  {
   "q": "In a healthcare intake pipeline, a symptoms-extractor subagent identifies the patient's record ID from uploaded forms, and an insurance-verifier subagent later needs that ID. An engineer proposes letting the two subagents exchange data directly through a shared messages.json file. What is the recommended pattern instead?",
   "options": [
    "Give both subagents the same session ID so they transparently share one context window",
    "Have the extractor return the record ID in its result, and let the coordinator pack it into the verifier's Task prompt",
    "Adopt the shared file, but add a PreToolUse hook that validates each write to messages.json",
    "Merge both roles into a single subagent so the data never has to move between agents"
   ],
   "correct": 1,
   "explanation": "In hub-and-spoke orchestration, inter-agent communication routes through the coordinator: spokes return results to the hub, and the hub explicitly packs needed facts into the next subagent's prompt. This keeps sequencing, validation, and observability in one place. A shared file sidesteps the orchestrator and invites ordering and consistency problems that a validation hook only partially patches, and subagents cannot share a context window by reusing a session ID.",
   "hint": "In hub-and-spoke, who is supposed to carry information between spokes?",
   "difficulty": "core",
   "tags": [
    "hub-and-spoke",
    "inter-agent-communication"
   ]
  },
  {
   "q": "A support platform fans every incoming ticket out to all six specialist subagents — billing, shipping, returns, technical, account, fraud — then aggregates. Telemetry shows 70% of tickets need exactly one specialist, median resolution latency is 90 seconds, and cost per ticket is six times the single-agent baseline. What is the right architectural fix?",
   "options": [
    "Keep all six but launch them as parallel Task calls in one response to bring latency down",
    "Switch all six specialists to Haiku to bring the per-ticket cost back in line",
    "Have the coordinator triage each ticket first and dynamically spawn only the specialists that ticket needs",
    "Add cache_control breakpoints to the six specialist system prompts to reuse the stable prefixes"
   ],
   "correct": 2,
   "explanation": "Running the full pipeline on every input is the anti-pattern here; dynamic subagent selection lets the coordinator triage and spawn only relevant specialists, which fixes both the 6x cost and the latency for the 70% single-specialist majority. Parallelizing all six helps latency but still pays for five useless invocations per ticket, and Haiku or caching shave cost without addressing the wasted work.",
   "hint": "Question whether every spoke should run at all, not how fast or cheaply they run.",
   "difficulty": "hard",
   "tags": [
    "dynamic-routing",
    "orchestration"
   ]
  },
  {
   "q": "A loan-processing coordinator establishes early in its run that an applicant's documents use DD/MM/YYYY dates and records this finding in its conversation. It then spawns an income-extractor subagent that reads 03/04/2025 as March 4 and mis-dates the pay stubs. What is the correct fix?",
   "options": [
    "Have the income-extractor independently re-derive the date convention from the documents before extracting",
    "Enable extended thinking on the extractor so it reasons its way to the right format",
    "Upgrade the extractor's model from Haiku to Opus so it stops making date-format mistakes",
    "Include the established DD/MM/YYYY determination explicitly in the extractor's task prompt"
   ],
   "correct": 3,
   "explanation": "The coordinator's finding never reached the subagent: subagent contexts are isolated, and nothing from the parent conversation is inherited, so validated facts must be packed into the task prompt explicitly. Having the extractor re-derive the convention duplicates work the hub already did and can land on a different answer for ambiguous documents. Extended thinking and bigger models are probabilistic mitigations for what is a missing-information problem.",
   "hint": "Decide whether this is a reasoning failure or an information-delivery failure.",
   "difficulty": "hard",
   "tags": [
    "context-packing",
    "context-isolation"
   ]
  },
  {
   "q": "An e-commerce refund system is wired as a chain: an order-analyzer subagent spawns an inventory-checker, which spawns a refund-calculator, three levels deep. When refund amounts come out wrong, engineers cannot tell which level introduced the error, and the analyzer's context fills with nested transcripts. How should the system be restructured?",
   "options": [
    "Flatten it to hub-and-spoke: one coordinator decomposes the job, delegates to each specialist directly, and aggregates results",
    "Keep the chain but require every agent in it to emit structured outputs so errors carry attribution",
    "Keep the chain but raise the analyzer's context budget so nested transcripts stop overflowing",
    "Add verbose logging at each level so engineers can replay the chain after a bad refund"
   ],
   "correct": 0,
   "explanation": "Daisy-chained subagents recreate the problems hub-and-spoke exists to solve: every intermediate result should return to a coordinator, where it is individually observable and where aggregation logic lives. Flattening the chain fixes both the debuggability and the nested-context bloat at once. Structured outputs within the chain — the strongest distractor — improve attribution but leave the deep nesting and tangled control flow in place, and bigger context budgets or verbose logging only patch symptoms of the flawed topology.",
   "hint": "Compare the topology itself against the canonical multi-agent shape.",
   "difficulty": "hard",
   "tags": [
    "hub-and-spoke",
    "orchestration"
   ]
  },
  {
   "q": "A legal-tech coordinator must review a 200-page master services agreement using multiple subagents, and the team is debating four decomposition schemes. Which one gives the most reliable coverage?",
   "options": [
    "One subagent per risk keyword — 'indemnity', 'liability', 'termination', 'warranty' — each scanning the whole document",
    "Subagents assigned to the contract's articles and exhibits, with boundaries chosen so every page belongs to exactly one agent",
    "200 subagents, one per page, so no single agent's context is ever strained",
    "A single subagent given the full contract, since splitting risks losing cross-references"
   ],
   "correct": 1,
   "explanation": "Good decomposition partitions the scope: every page is owned by exactly one agent, so there are no coverage gaps and no duplicated effort, and article boundaries keep semantic units intact. Keyword-scoped agents overlap heavily and leave risks phrased without those keywords with no owner. Per-page slicing is the too-narrow pitfall — clauses spanning pages get split so no agent sees a whole obligation — and a single agent over 200 pages forfeits delegation while straining one context.",
   "hint": "Aim for slices that are collectively exhaustive and mutually exclusive without splitting semantic units.",
   "difficulty": "hard",
   "tags": [
    "decomposition",
    "partitioning"
   ]
  },
  {
   "q": "In a 10-scout market-research swarm, the scout covering Latin America hits a rate-limited API on its first call and immediately returns the single word 'failed'. The coordinator drops that segment, and the published report silently omits an entire region. How should scout failure handling be designed?",
   "options": [
    "On any scout failure, the coordinator should restart the entire 10-scout pipeline from scratch",
    "Prompt the synthesizer to add a disclaimer listing any regions that appear to be missing from the data",
    "Scouts retry transient errors locally and propagate only unresolvable failures, with what was attempted and any partial results",
    "Scouts should raise failures directly to the end user the moment any API call errors"
   ],
   "correct": 2,
   "explanation": "The reliability rule for subagents is recover locally, propagate with context: a rate limit is transient and should be retried inside the scout, and a genuinely unresolvable failure must reach the coordinator as a structured report — what failed, what was tried, partial results — so the hub can reassign or flag the gap instead of silently dropping it. Restarting all 10 scouts wastes nine successful runs, a disclaimer still ships a report missing a region, and surfacing every transient API error to the end user defeats delegation.",
   "hint": "Recall which errors a subagent should absorb and what an unrecoverable one must carry upward.",
   "difficulty": "core",
   "tags": [
    "error-propagation",
    "reliability"
   ]
  }
 ],
 "floor-03": [
  {
   "q": "A fintech support agent has a process_refund tool. The system prompt states refunds above $200 require manager approval, yet logs show the agent issued a $480 refund last week after a persuasive customer message. Compliance now requires that over-cap refunds can never execute. What should the architect implement?",
   "options": [
    "A PreToolUse hook on process_refund that checks the amount and exits with code 2 when it exceeds $200, writing the violation to stderr",
    "A refund policy moved to the very top of the system prompt and repeated in CLAUDE.md so the model cannot miss it",
    "A second model pass that reviews every pending refund and approves or rejects it before execution",
    "A temperature of 0 on the support agent so it follows the refund policy more consistently"
   ],
   "correct": 0,
   "explanation": "Critical business rules like refund caps belong in hooks because hooks are deterministic code that guarantees enforcement, while prompt instructions are probabilistic best-effort. Exit code 2 blocks the tool call and the stderr message is fed back to the model so it can adapt. The second-model reviewer is the strongest distractor, but it is still a probabilistic component and cannot guarantee zero violations, and temperature 0 changes sampling, not whether the model can be persuaded.",
   "hint": "Think about which mechanism is deterministic rather than probabilistic when a business rule must never be violated.",
   "difficulty": "core",
   "tags": [
    "hooks",
    "refund-cap",
    "pretooluse"
   ]
  },
  {
   "q": "A platform team wrote a PreToolUse hook to stop Claude Code from editing files under infra/prod/. The script correctly detects the protected path, prints 'Edit blocked: protected production path' to stdout, and exits with code 0. In testing, the edits still go through and the agent never acknowledges any block. What is wrong?",
   "options": [
    "PreToolUse hooks cannot block tool calls; the rule must instead be a deny entry in settings.json permissions",
    "The hook needs to return hookSpecificOutput.additionalContext containing the block decision",
    "The hook must exit with code 2 to block the call, and write the explanation to stderr so it is fed back to the model",
    "The hook fires too early to see the file path; the protection must move to a PostToolUse hook"
   ],
   "correct": 2,
   "explanation": "For PreToolUse hooks, a zero exit code allows the tool call to proceed; exit code 2 is what blocks the call, and stderr (not stdout) is the channel fed back to the model explaining why. The first option is false because gating tool calls before they run is exactly what PreToolUse exists for. additionalContext injects information but does not block anything, and PreToolUse receives the full tool input including the file path, so it does not fire too early.",
   "hint": "Recall which exit code blocks a tool call and which output stream gets fed back to the model.",
   "difficulty": "core",
   "tags": [
    "hooks",
    "exit-code-2",
    "pretooluse"
   ]
  },
  {
   "q": "A customer support agent calls a get_customer CRM tool that returns 40 fields per record, including marketing flags and audit metadata. After 15 lookups in a long session, context is bloated and the agent starts missing the three fields it actually uses: plan tier, billing status, and open tickets. What is the best fix?",
   "options": [
    "Instruct the agent in the system prompt to ignore the irrelevant CRM fields when reading tool results",
    "Add a PostToolUse hook on get_customer that trims each result down to the handful of fields the agent needs",
    "Switch to a model with a larger context window so the full 40-field records fit comfortably",
    "Run /compact after every few lookups to summarize the accumulated CRM payloads"
   ],
   "correct": 1,
   "explanation": "Verbose tool outputs should be trimmed deterministically at the source, and PostToolUse is the hook designed to normalize and reduce tool results before they enter context. A larger context window still leaves 37 useless fields per record diluting attention, so lost-in-the-middle misses persist. Prompting the model to ignore fields is probabilistic and the tokens still consume context either way, and /compact is reactive and lossy: it lets the bloat accumulate first and its summarization can blur the exact field values the agent needs.",
   "hint": "Verbose tool outputs are best handled deterministically at the moment they are produced, not by the model afterward.",
   "difficulty": "core",
   "tags": [
    "hooks",
    "posttooluse",
    "context-trimming"
   ]
  },
  {
   "q": "A healthcare intake agent writes visit summaries to a shared log through a write_log tool. CLAUDE.md instructs it to redact Social Security numbers first, and audits show it complies about 98% of the time. The compliance team requires zero SSNs in the logs, full stop. Which approach satisfies the requirement?",
   "options": [
    "Add few-shot examples of correctly redacted summaries to the system prompt",
    "Repeat the redaction rule in both the system prompt and CLAUDE.md and label it as mandatory",
    "Have a reviewer subagent check each summary for SSNs before it is logged",
    "Add a hook that scans write_log input and deterministically redacts or blocks any SSN pattern before the write runs"
   ],
   "correct": 3,
   "explanation": "A 98% compliance rate is the signature of a probabilistic mechanism, and no amount of prompt reinforcement turns best-effort into a guarantee. PII redaction is a critical business rule, so it belongs in deterministic hook code that pattern-matches and rewrites or blocks the call every single time. The reviewer subagent is the strongest distractor, but it is another model and therefore still probabilistic; it can miss an SSN just as the original agent does.",
   "hint": "A 98% compliance rate is the fingerprint of a probabilistic mechanism.",
   "difficulty": "core",
   "tags": [
    "hooks",
    "deterministic-vs-probabilistic",
    "pii"
   ]
  },
  {
   "q": "In a monorepo CI assistant, a run_coverage tool returns raw percentages per package. Reviewers notice the agent keeps flagging packages/legacy-billing for missing the 80% bar even though that package is formally exempt until Q3. The exemption list lives in a YAML file that changes as exemptions are granted and expire, and the agent rarely reads it. How should the team ensure coverage results are interpreted correctly every time?",
   "options": [
    "Add a PostToolUse hook on run_coverage that reads the exemption YAML and injects current exemptions via hookSpecificOutput.additionalContext",
    "Copy the exemption list into CLAUDE.md so it loads automatically at session start",
    "Rename the tool to run_coverage_with_exemptions so the agent knows exemptions exist",
    "Add a prompt instruction telling the agent to call a second tool to fetch exemptions after every coverage run"
   ],
   "correct": 0,
   "explanation": "hookSpecificOutput.additionalContext lets a PostToolUse hook attach fresh interpretive context at the exact moment the tool result returns, so the model always sees the current exemptions alongside the numbers. CLAUDE.md is the strongest distractor, but it is a static copy that drifts from the changing YAML and can be lost mid-context in long sessions. The prompt-enforced second tool call is probabilistic and is exactly the behavior the agent is already failing to perform, and renaming the tool conveys nothing about which packages are exempt.",
   "hint": "Consider which mechanism can attach fresh interpretive context at the exact moment a tool result returns.",
   "difficulty": "hard",
   "tags": [
    "hooks",
    "additionalContext",
    "posttooluse"
   ]
  },
  {
   "q": "A developer-productivity team distributes Claude Code skills from a central repo. A bootstrap script syncs new skill folders into .claude/skills when a session opens, but engineers report that skills added that morning never auto-invoke until they manually intervene, because the skill scan happens before the sync finishes. The team wants newly synced skills available automatically in every fresh session. What should they configure?",
   "options": [
    "A UserPromptSubmit hook that runs the sync script before each prompt is processed",
    "A note in CLAUDE.md telling engineers to run /reload-skills as their first command in every session",
    "A SessionStart hook that runs the sync and returns reloadSkills so the skill scan picks up the new files",
    "A PostToolUse hook on Bash that triggers whenever the sync script appears in a command"
   ],
   "correct": 2,
   "explanation": "SessionStart hooks run when the session opens and can return reloadSkills, which makes the harness rescan the skills directory after the sync completes, solving the ordering problem deterministically. Asking engineers to run /reload-skills works mechanically but depends on every human remembering every time, which is best-effort. Re-syncing on every UserPromptSubmit is wasteful and does not itself trigger a skill rescan, so freshly synced skills still would not auto-invoke.",
   "hint": "One hook event runs at session open and can ask the harness to rescan skills.",
   "difficulty": "core",
   "tags": [
    "hooks",
    "session-start",
    "skills"
   ]
  },
  {
   "q": "An e-commerce operations agent answers on-call engineers' questions in long-running sessions; engineers execute any deploys themselves. Answers must always reflect the current deploy-freeze status and on-call rotation, both of which change mid-session. Today the agent advised an engineer to deploy during a freeze that began an hour after the session started. Which hook placement fixes this?",
   "options": [
    "A SessionStart hook that injects freeze status and the rotation when the session begins",
    "A Stop hook that appends the latest freeze status to the agent's final answer each turn",
    "A PreToolUse hook that inserts the current rotation into the parameters of every tool call",
    "A UserPromptSubmit hook that fetches current freeze status and rotation and attaches them to each incoming prompt"
   ],
   "correct": 3,
   "explanation": "The failure happened because the facts changed mid-session, so any mechanism that injects them only once at session start is guaranteed to go stale, which is exactly the trap in the SessionStart option. UserPromptSubmit fires on every user message, so the model reasons over current freeze and rotation data each time it answers. The Stop hook decorates output after reasoning is done, too late to change the advice, and the PreToolUse option only touches tool parameters, which never informs the model's answer to a question.",
   "hint": "Ask which hook fires often enough to keep fast-changing facts current throughout a session.",
   "difficulty": "core",
   "tags": [
    "hooks",
    "user-prompt-submit"
   ]
  },
  {
   "q": "A code-generation session in Claude Code keeps ending turns with edits in place but the test suite never run, despite a CLAUDE.md rule saying 'always run the tests before finishing.' The team wants a guarantee that no turn completes after file edits without a test run. What is the right mechanism?",
   "options": [
    "Move the rule to the top of CLAUDE.md and rephrase it as a hard, non-negotiable requirement",
    "Add a Stop hook that checks whether tests ran after the last edit and blocks completion with feedback telling the model to run them",
    "Add a PostToolUse hook on Edit that runs the full test suite after every single file modification",
    "Set a minimum iteration count so the session cannot end before a fixed number of tool calls"
   ],
   "correct": 1,
   "explanation": "Stop hooks fire when the agent attempts to finish its turn and can deterministically block completion, feeding the reason back so the model runs the tests. The PostToolUse distractor is deterministic but enforces at the wrong granularity: it runs the whole suite after every one of possibly dozens of edits, burning time and failing spuriously on intentionally incomplete intermediate states mid-refactor, when the requirement only concerns the state at turn completion. Stronger prompt wording remains probabilistic, and iteration counts are safety fallbacks, not behavioral guarantees.",
   "hint": "There is a hook event that fires at the moment the agent tries to finish its turn.",
   "difficulty": "hard",
   "tags": [
    "hooks",
    "stop-hook"
   ]
  },
  {
   "q": "In a monorepo, the data team must prevent Claude Code from editing files under db/migrations/ that have already been applied to production. Applied migrations are listed in db/applied.json, which changes daily, and new unapplied migration files must remain fully editable. How should this be enforced?",
   "options": [
    "A PreToolUse hook on Edit and Write that checks the target file against db/applied.json and exits 2 with an explanation when the migration is already applied",
    "A settings.json permissions deny rule covering the entire db/migrations/ directory",
    "A CLAUDE.md rule listing the currently applied migrations, regenerated by a nightly job",
    "A PostToolUse hook that detects edits to applied migrations and reverts them with git checkout"
   ],
   "correct": 0,
   "explanation": "The rule is conditional on data that changes daily, so it needs executable logic: a PreToolUse hook can read applied.json at call time, block only the applied files, and explain why via stderr. The static deny rule is the strongest distractor because it is also deterministic, but it is too blunt and blocks the legitimate new migrations the team must keep editable. The PostToolUse revert lets the forbidden write happen first and silently undoes it while the model still believes the edit succeeded, and CLAUDE.md is probabilistic and up to a day stale.",
   "hint": "A rule that depends on data that changes daily needs logic at call time, not a static pattern.",
   "difficulty": "hard",
   "tags": [
    "hooks",
    "protected-paths",
    "pretooluse"
   ]
  },
  {
   "q": "An engineer resumes a Claude Code session from Friday to continue a refactor. Over the weekend a teammate merged 14 commits to main that renamed AuthClient to IdentityClient and moved the src/auth/ directory. The resumed agent immediately proposes edits referencing the old class name and paths. What is the most reliable way to handle this resume staleness?",
   "options": [
    "Add a CLAUDE.md note saying that after resuming, the agent should assume any file may have changed and re-verify before editing",
    "Have the team always start fresh sessions instead of resuming so stale context can never exist",
    "On resume, inject a summary of the specific changes since the last session, such as the renames and moved paths, so the agent corrects its assumptions",
    "Run /compact immediately after resuming so the stale history shrinks to a short summary"
   ],
   "correct": 2,
   "explanation": "Stale resumed context is fixed by informing the agent of the specific changes, for example a SessionStart hook on resume that diffs against the last session's commit and injects what was renamed and moved. Always starting fresh is the strongest distractor, but it throws away the valuable in-progress refactor context that made resuming worthwhile. The CLAUDE.md note is probabilistic and forces wasteful wholesale re-reading, and /compact summarizes the stale facts without correcting any of them, so the wrong names survive in condensed form.",
   "hint": "Stale resumed context is fixed by telling the agent exactly what changed, not by general caution.",
   "difficulty": "hard",
   "tags": [
    "session-resume",
    "hooks",
    "stale-context"
   ]
  },
  {
   "q": "A support resolution agent escalates hard cases to human specialists. Specialists complain that each escalation arrives as a raw 150-message transcript and they spend twenty minutes reconstructing what happened before they can act. What should each escalation carry instead?",
   "options": [
    "A sentiment trajectory chart plus the customer's last five messages",
    "A structured summary: customer id, the issue, what was already tried, and a recommended next action",
    "The full transcript with a one-line subject added so specialists can skim it faster",
    "A live link back into the agent session so the specialist can question the agent directly"
   ],
   "correct": 1,
   "explanation": "Canonical human handoffs carry a structured summary covering the customer id, the issue, what was attempted, and a recommended action, so the specialist can act in minutes without replaying the conversation. The full transcript with a subject line is the strongest distractor, but it preserves the exact problem: the reconstruction burden stays on the human. Sentiment data does not tell the specialist what was tried or what to do next, and a live session link makes the specialist interrogate the agent instead of acting.",
   "hint": "Think about what a human needs in order to act in two minutes instead of twenty.",
   "difficulty": "core",
   "tags": [
    "escalation",
    "handoff"
   ]
  },
  {
   "q": "A fintech extraction pipeline's fetch_transactions tool returns dates in a mix of MM/DD/YYYY, ISO 8601, and Unix epoch depending on the upstream bank. The model must compare transaction dates against statement periods and gets it wrong on roughly 1 in 12 records, almost always the epoch-formatted ones. What is the root-cause fix?",
   "options": [
    "A PostToolUse hook on fetch_transactions that converts every date to ISO 8601 before the model sees the result",
    "A system prompt section with worked examples showing how to convert epoch timestamps correctly",
    "A retry policy that re-fetches the transactions whenever a date comparison fails validation",
    "A stricter output schema requiring the model to return all dates as ISO 8601 strings"
   ],
   "correct": 0,
   "explanation": "Date normalization is a mechanical transformation, so it belongs in deterministic PostToolUse code that guarantees the model only ever sees one consistent format. The stricter output schema is the strongest distractor: it constrains the answer's format but does nothing to stop the model misreading epoch values on the way in, since schemas guarantee syntax, not semantic correctness. Prompted conversion examples remain probabilistic, and retries re-fetch the same mixed formats and reproduce the same misreads.",
   "hint": "Mechanical transformations of tool output belong in deterministic code, not model instructions.",
   "difficulty": "core",
   "tags": [
    "hooks",
    "posttooluse",
    "normalization"
   ]
  },
  {
   "q": "An insurance support agent receives one message: 'I was double-billed in May, my new address is 14 Elm Street, and your last rep was rude - I want that on record.' The agent resolves the billing issue thoroughly and closes the conversation; the address change and the complaint are silently dropped. How should the architect fix this failure pattern?",
   "options": [
    "Increase max_tokens so the agent has enough room to address everything in a single reply",
    "Add a prompt instruction saying the agent must be thorough and never ignore parts of a message",
    "Route each incoming message to three specialized subagents selected by keyword matching",
    "Have the agent first decompose the message into distinct concerns and track each one to completion before ending the turn"
   ],
   "correct": 3,
   "explanation": "Multi-concern requests fail when the agent treats the message as one task, so the fix is explicit decomposition: enumerate the distinct concerns up front and verify each is resolved before finishing. Keyword-routed subagents are the strongest distractor, but the concern count varies per message and keyword matching creates coverage gaps on unexpected phrasing. A vague instruction to be thorough is probabilistic, and the dropped concerns were never a token-budget problem, since the agent finished its reply normally rather than hitting max_tokens.",
   "hint": "When one message carries several requests, the fix is explicit enumeration and tracking of each one.",
   "difficulty": "hard",
   "tags": [
    "decomposition",
    "support"
   ]
  },
  {
   "q": "An e-commerce agent's apply_store_credit tool is gated by a PreToolUse hook that exits 2 for credits over $50. The block works, but logs show the agent then retries the identical $75 credit four times before giving up, and the customer gets no resolution. The hook's stderr message is just the word 'Blocked.' What should change?",
   "options": [
    "Convert it to a PostToolUse hook so the agent can observe the outcome of the attempted credit",
    "Rewrite the stderr message to state the rule and the next step: the $50 cap, and that larger credits go through the escalate_to_human tool",
    "Add a hard cap of two retries on apply_store_credit in the agent loop configuration",
    "Remove apply_store_credit from the agent's tools and route all credit requests to humans"
   ],
   "correct": 1,
   "explanation": "When a PreToolUse hook blocks with exit code 2, its stderr is fed back to the model and is the model's only explanation of why the call was refused; a bare 'Blocked.' is the hook equivalent of a bare 'Operation failed' tool error, leaving nothing to adapt to. Stating the cap and the escalation path lets the agent immediately take the correct action. Retry caps are safety fallbacks that stop the loop without producing a resolution, converting to PostToolUse would let the over-cap credit execute, and removing the tool punishes every legitimate under-cap credit.",
   "hint": "What the hook writes to stderr is the model's only explanation of why the call was refused.",
   "difficulty": "hard",
   "tags": [
    "hooks",
    "error-messages",
    "exit-code-2"
   ]
  },
  {
   "q": "A developer-productivity team wants three automated behaviors in Claude Code: (1) load the current sprint's ticket list once when a session opens, (2) strip ANSI color codes out of every Bash result before the model reads it, and (3) prevent any edit to files under vendor/. Which hook events implement these behaviors?",
   "options": [
    "(1) UserPromptSubmit, (2) PreToolUse, (3) Stop",
    "(1) SessionStart, (2) PreToolUse, (3) PostToolUse",
    "(1) UserPromptSubmit, (2) PostToolUse, (3) SessionStart",
    "(1) SessionStart, (2) PostToolUse, (3) PreToolUse"
   ],
   "correct": 3,
   "explanation": "SessionStart runs once when the session opens, which is the right place for one-time context like the sprint ticket list. PostToolUse fires after a tool runs and is where outputs get normalized, such as stripping ANSI codes from Bash results. PreToolUse gates calls before they execute, so it is where vendor/ edits get blocked with exit code 2. The second option reverses the last two events: PreToolUse cannot clean a result that does not exist yet, and PostToolUse fires only after the edit has already happened.",
   "hint": "Match each behavior to when it must run: session open, after a tool returns, or before a tool executes.",
   "difficulty": "core",
   "tags": [
    "hooks",
    "hook-events"
   ]
  }
 ],
 "floor-04": [
  {
   "q": "A travel-booking support agent exposes search_bookings, described as \"Look up customer records,\" and search_refund_requests, described as \"Look up customer requests.\" In 14% of billing conversations the agent calls search_bookings when it actually needs refund status. What is the most effective fix?",
   "options": [
    "Add a keyword-based pre-classifier that picks the right tool before the model sees the conversation",
    "Add a system prompt rule: for any message that mentions refunds, always call search_refund_requests",
    "Rewrite each description to state the tool's purpose, input format, and when to use it instead of its sibling",
    "Force tool_choice to search_refund_requests whenever the conversation is tagged as a billing issue"
   ],
   "correct": 2,
   "explanation": "Tool descriptions are the model's primary selection mechanism, and these two are near-identical, so the model has no signal to distinguish them. Differentiating the descriptions fixes the root cause for every conversation type. A pre-classifier or forced tool_choice patches around the symptom and breaks on mixed-intent conversations, and keyword prompt rules are brittle.",
   "hint": "Ask what information the model actually reads when it decides between two sibling tools.",
   "difficulty": "core",
   "tags": [
    "tool-descriptions"
   ]
  },
  {
   "q": "An e-commerce assistant has accumulated 18 tools spanning catalog search, inventory, refunds, shipping, and loyalty promotions. After the last batch of tools shipped, wrong-tool calls climbed from 3% to 19% of sessions. What should the architect do?",
   "options": [
    "Split the assistant into focused roles, each agent exposing only the 4-5 tools its job requires",
    "Expand every tool description with full parameter documentation so the model can disambiguate all 18",
    "Add a system prompt table that maps each customer intent to the tool that should handle it",
    "Switch the assistant to a larger model that can keep track of more tools at once"
   ],
   "correct": 0,
   "explanation": "Selection accuracy degrades once an agent carries roughly 15 or more tools; the canonical design is 4-5 focused tools per role. Splitting into role-scoped agents shrinks each decision space and fixes the root cause. Longer descriptions and intent tables add context without reducing the number of candidates the model must weigh on every turn, and a larger model does not change the crowded decision space.",
   "hint": "Think about how many tools one agent role should carry before selection quality drops.",
   "difficulty": "core",
   "tags": [
    "tool-count",
    "multi-agent"
   ]
  },
  {
   "q": "A refund-processing subagent in a support system shares a tool registry that includes adjust_loyalty_points and send_marketing_email. Despite a system prompt line saying \"NEVER use marketing tools,\" the subagent sends a promotional email in about 2% of sessions. What is the right fix?",
   "options": [
    "Repeat the prohibition at the top and bottom of the system prompt with stronger wording",
    "Remove the marketing tools from the refund subagent's tool list entirely",
    "Add a PreToolUse hook that blocks send_marketing_email and returns an error to the model",
    "Lower the sampling temperature so the model follows the written prohibition more consistently"
   ],
   "correct": 1,
   "explanation": "The governing rule is to remove cross-role tools rather than prompt against their use: a tool with no legitimate purpose for this role should not be visible at all. Removal eliminates the failure class deterministically and shrinks the selection space. The hook is the strongest distractor, but hooks guard tools that must remain available for legitimate uses; here the tool has no legitimate use, so a hook would just bounce calls the agent should never be able to attempt while still cluttering selection.",
   "hint": "If a tool has no legitimate use for this role, ask whether it should be in the agent's view at all.",
   "difficulty": "core",
   "tags": [
    "tool-scoping",
    "cross-role-tools"
   ]
  },
  {
   "q": "A fintech extraction agent's query_transactions tool returns the string \"Operation failed\" whenever the data warehouse times out. The model retries the identical query four times, burns its remaining turns, and gives up without producing output. How should the tool be redesigned?",
   "options": [
    "Cap the agentic loop at three iterations so failed retries terminate the run quickly",
    "Add a system prompt instruction telling the model to vary its query whenever any tool fails",
    "Catch the timeout in the tool and raise an exception so the loop ends and a human is paged",
    "Return a structured error with errorCategory timeout, an isRetryable flag, the attempted query, and any partial results"
   ],
   "correct": 3,
   "explanation": "A bare \"Operation failed\" gives the model nothing to reason with, so it repeats the same call. A structured error stating the category, retryability, the query attempted, and partial results lets the model choose an informed next action. Iteration caps are safety fallbacks, not a primary control, paging a human on every transient timeout abandons recoverable work, and a generic prompt instruction cannot tell the model whether this specific failure is worth retrying.",
   "hint": "A tool error should hand the model enough information to choose its next move.",
   "difficulty": "core",
   "tags": [
    "structured-errors"
   ]
  },
  {
   "q": "A hardware support bot's lookup_warranty tool returns {\"error\": \"No records found\"} when a serial number has no active warranty. The agent treats this as a tool failure, apologizes, and escalates — and 30% of the human queue is now just out-of-warranty devices. What should change?",
   "options": [
    "Return a successful response with an empty results array, because zero matches is a valid answer rather than a failure",
    "Add a prompt note explaining that the \"No records found\" error actually means the device has no warranty",
    "Mark the error response as isRetryable false so the model stops escalating after the first attempt",
    "Have the tool return the closest matching serial number so the model always gets a record back"
   ],
   "correct": 0,
   "explanation": "An empty result set is a successful query with zero matches, not an error; encoding it as an error makes the model conclude the tool broke. Returning success with an empty array lets the agent state confidently that no warranty exists. The prompt-note distractor leaves the broken contract in place and asks the model to reinterpret it probabilistically, the isRetryable flag still encodes a valid answer as a failure so the model keeps escalating, and returning a near-match invites fabricated answers about the wrong device.",
   "hint": "Decide whether zero matches is a failure of the tool or an answer from it.",
   "difficulty": "core",
   "tags": [
    "empty-results",
    "structured-errors"
   ]
  },
  {
   "q": "An insurance claims extraction pipeline must begin every conversation by calling fetch_claim_document, and on multi-page claims the agent later needs fetch_supporting_exhibits before emitting the final extraction. The team set tool_choice to {\"type\": \"tool\", \"name\": \"fetch_claim_document\"} on every request, and now the agent fetches the same document repeatedly and never finishes. What is the fix?",
   "options": [
    "Switch every request to tool_choice \"any\" so the model can choose freely among all the tools",
    "Keep the forced setting but add a prompt instruction telling the model to fetch each document only once",
    "Force the tool on the first request only, then send all follow-up requests with tool_choice \"auto\"",
    "Switch to tool_choice \"none\" after the first call so the model is pushed straight to the extraction"
   ],
   "correct": 2,
   "explanation": "Forcing a specific tool applies to every turn it is sent on, so the model can never do anything except call fetch_claim_document. The force-then-relax pattern guarantees the required first call and then returns control to the model under auto. The \"any\" distractor still mandates some tool call on every turn, so the model can never finish with a final response, and \"none\" on all follow-ups would block the legitimate fetch_supporting_exhibits calls multi-page claims require.",
   "hint": "A forced tool constrains every turn it applies to — figure out which turn actually needs the constraint.",
   "difficulty": "hard",
   "tags": [
    "tool_choice",
    "force-then-relax"
   ]
  },
  {
   "q": "A healthcare intake triage step must always act through one of four tools — schedule_appointment, request_records, verify_insurance, or escalate_to_nurse — but in about 8% of turns the model replies with prose suggestions and calls nothing. Which change guarantees an action without over-constraining the choice?",
   "options": [
    "Force tool_choice to escalate_to_nurse so every triage turn is guaranteed to produce an action",
    "Set tool_choice to \"any\" on the triage request so the model must call one of the four tools",
    "Add a system prompt instruction stating that the model must always respond by calling a tool",
    "Keep tool_choice \"auto\" and retry the request whenever the response comes back as text only"
   ],
   "correct": 1,
   "explanation": "tool_choice \"any\" is the mode that guarantees some tool call while leaving the model free to pick the right one, which is exactly the requirement. Forcing a single named tool over-constrains a step where four tools are valid and would flood the nurse queue. The prompt instruction is probabilistic and is precisely what is already failing 8% of the time, and retry-on-text adds latency without ever guaranteeing the next attempt calls a tool.",
   "hint": "One tool_choice mode guarantees a tool call without dictating which tool it is.",
   "difficulty": "hard",
   "tags": [
    "tool_choice"
   ]
  },
  {
   "q": "A 12-person platform team wants a shared Jira MCP server available to everyone who clones their monorepo, but the Jira API token must never appear in version control. How should they configure it?",
   "options": [
    "Have each engineer register the server in ~/.claude.json so the token stays on their own machine",
    "Commit .mcp.json with the literal token in it, then add the file to .gitignore for safety",
    "Use local scope for the server so the config stays project-specific but is never committed",
    "Commit a project-scoped .mcp.json that references the token as ${JIRA_API_TOKEN} from each engineer's environment"
   ],
   "correct": 3,
   "explanation": "Project scope (.mcp.json) is the version-controlled, team-shared configuration, and ${ENV_VAR} expansion keeps the secret out of the repo while each engineer supplies their own token locally. User scope and local scope both fail the sharing requirement — every engineer would have to configure the server independently. Committing a literal token and then gitignoring the file is self-contradictory: gitignored files are not shared, and the token would still be exposed wherever the file exists.",
   "hint": "One MCP scope is version-controlled for the whole team, and env expansion keeps secrets out of it.",
   "difficulty": "core",
   "tags": [
    "mcp-config",
    "secrets"
   ]
  },
  {
   "q": "A CI workflow prompt for claude -p instructs: \"Use Grep to collect every file matching *.integration.test.ts under services/, then run them.\" The step is slow and intermittently misses test files. A reviewer flags the instruction. What should it say instead?",
   "options": [
    "Keep Grep but anchor the regular expression so it matches the file names more precisely",
    "Tell Claude to Read the services/ directory listing and filter the entries itself",
    "Use Glob with services/**/*.integration.test.ts, because Glob matches file paths while Grep searches file contents",
    "Use Bash with find piped through xargs, because the built-in tools cannot enumerate files"
   ],
   "correct": 2,
   "explanation": "Glob is the built-in for finding files by path pattern; Grep searches the contents of files, so using it to enumerate filenames is the wrong tool for the job and explains the misses. The Bash distractor would function but rests on a false premise — Glob exists exactly for this. Anchoring a content regex still searches the wrong dimension, and Read targets files, not directory traversal across a service tree.",
   "hint": "One built-in matches path patterns and another matches what is inside files.",
   "difficulty": "core",
   "tags": [
    "glob-vs-grep",
    "built-ins"
   ]
  },
  {
   "q": "A developer is prototyping a personal MCP server for their note-taking app and wants it available in every repository they open on their laptop, without teammates ever seeing it in any shared project. Where should it be configured?",
   "options": [
    "Register the server at user scope in ~/.claude.json",
    "Add it to each repository's .mcp.json and ask teammates to ignore the extra server",
    "Add it at local scope inside the main repository the developer works in",
    "Put the server launch command in the project settings.json env block"
   ],
   "correct": 0,
   "explanation": "User scope in ~/.claude.json is for personal and experimental servers and applies across all of the developer's projects without touching anything version-controlled. Project .mcp.json is committed and would surface the server to the whole team. Local scope is the strongest distractor, but it is project-personal — it would cover only one repository, not every repo the developer opens. The settings.json env block holds environment variables, not MCP server registrations.",
   "hint": "Match the scope to who should see the server and how many projects it should cover.",
   "difficulty": "core",
   "tags": [
    "mcp-config"
   ]
  },
  {
   "q": "A docs team ships an MCP server whose tool search_product_docs is described only as \"Searches data.\" When users ask product questions in Claude Code, the model keeps running Grep across a stale local docs/ folder instead of calling the MCP tool. What is the root-cause fix?",
   "options": [
    "Add a permissions deny rule for Grep so the model is forced to fall back to the MCP tool",
    "Rewrite the description to name the corpus it searches, its query format, and when to prefer it over built-in file search",
    "Add a CLAUDE.md instruction saying to always use search_product_docs for documentation questions",
    "Move the server from user scope to project scope so its tools rank higher during selection"
   ],
   "correct": 1,
   "explanation": "A vague MCP description gives the model no reason to prefer an unfamiliar tool, so it falls back to the familiar built-in Grep; a specific description stating purpose, corpus, query format, and when to use it over built-ins fixes selection at the source. Denying Grep breaks every legitimate code-search use, the CLAUDE.md rule is a probabilistic patch on top of an uninformative tool, and config scope controls visibility and sharing, not selection ranking.",
   "hint": "When a custom tool loses to a familiar built-in, ask what the model actually knows about each one.",
   "difficulty": "hard",
   "tags": [
    "mcp-descriptions",
    "tool-descriptions"
   ]
  },
  {
   "q": "A new engineer at a payments company asks Claude Code to map everywhere the deprecated applyLegacyFee function is still called across a 1,200-file repository before deleting it. Which workflow is the right one for the agent to follow?",
   "options": [
    "Read every file under src/ sequentially so that no call site can possibly be missed",
    "Glob for **/*.ts and then Read each matched file in order until the function appears",
    "Use Bash to cat the entire src tree into the context window and analyze it in one pass",
    "Grep for applyLegacyFee to find the call sites, then Read only the matching files to trace each usage"
   ],
   "correct": 3,
   "explanation": "The canonical discovery flow is Grep to locate usages by content, then Read to trace only the files that matter. Reading or catting hundreds of files floods the context window and degrades reasoning long before coverage is achieved. Glob is the wrong first step here because the question is about content (call sites), not file path patterns, and reading every match in order repeats the same context flooding.",
   "hint": "Search narrows the candidates and reading traces them — think about the order of operations.",
   "difficulty": "core",
   "tags": [
    "grep-then-read",
    "built-ins"
   ]
  },
  {
   "q": "In a multi-agent research system, a subagent's web_search tool hits a provider rate limit after retrieving 3 of 5 requested sources and currently returns {\"error\": \"request failed\"}, discarding everything. The coordinator restarts the entire research task from zero each time. How should the tool respond instead?",
   "options": [
    "Return the 3 retrieved sources as partial results along with errorCategory rate_limit and isRetryable true",
    "Return a normal success response containing the 3 sources and omit any mention of the failure",
    "Block inside the tool and sleep until the rate limit window resets, then return all 5 sources",
    "Raise an exception so the subagent terminates and the coordinator reassigns the task elsewhere"
   ],
   "correct": 0,
   "explanation": "Structured errors should preserve partial results and signal retryability so the caller can resume from where the work stopped instead of redoing it. The silent-success distractor is tempting because it avoids the restart, but it hides a known coverage gap from the coordinator, which then synthesizes from incomplete sources without knowing it. Blocking until reset hides unbounded latency inside a tool call, and a bare exception throws away the 3 sources entirely.",
   "hint": "A good error response keeps what succeeded and tells the caller whether trying again makes sense.",
   "difficulty": "hard",
   "tags": [
    "structured-errors",
    "multi-agent"
   ]
  },
  {
   "q": "A retail-banking assistant already carries 17 tools, and the product team wants to add 2 more for mortgage pre-qualification. Wrong-tool selection is already measurably rising. What should the architect recommend?",
   "options": [
    "Add the two tools but write extra-detailed descriptions for all 19 so they stay distinguishable",
    "Split the assistant into focused agents — accounts, cards, mortgage — each carrying 4-5 tools behind a coordinator",
    "Add the tools but prefix every tool name with its category, such as mortgage_check_rate",
    "Add a decision tree to the system prompt that maps each request type to exactly one tool"
   ],
   "correct": 1,
   "explanation": "Beyond roughly 15 tools, selection quality degrades no matter how well each tool is described, so the fix is structural: role-focused agents with 4-5 tools each. Better descriptions are the strongest distractor because descriptions are normally the first lever, but they cannot rescue a 19-tool decision space that is already failing. Name prefixes and prompt decision trees are surface conventions that leave all 19 candidates in play on every turn.",
   "hint": "Past a certain tool count, better wording stops compensating — think about what actually shrinks the decision space.",
   "difficulty": "hard",
   "tags": [
    "tool-count",
    "multi-agent"
   ]
  },
  {
   "q": "A nightly reporting agent gathers metrics through several tools, and its final request is supposed to produce a prose executive summary. In 12% of runs the model issues yet another tool call on that final request instead of writing the summary. What is the cleanest fix?",
   "options": [
    "Add a prompt line to the final request: \"You have all the data you need; do not call any more tools\"",
    "Cap the agentic loop at ten iterations so a runaway tool call cannot extend the nightly run",
    "Set tool_choice to \"none\" on the final summarization request so the model must respond with text",
    "Set tool_choice to \"any\" on the final request so the model finishes its remaining tool work faster"
   ],
   "correct": 2,
   "explanation": "tool_choice \"none\" is the deterministic mechanism for a turn where a tool call must not happen: the model can only respond with text, which is exactly what the summary step requires. The prompt instruction is probabilistic and is essentially the behavior already failing 12% of the time. Iteration caps are safety fallbacks rather than primary control, and \"any\" mandates the exact behavior being prevented.",
   "hint": "tool_choice has a mode for the turn where a tool call is exactly what you do not want.",
   "difficulty": "hard",
   "tags": [
    "tool_choice"
   ]
  }
 ],
 "floor-05": [
  {
   "q": "A fintech payments team of 12 engineers shares one repository. The tech lead wrote the team's TypeScript strict-mode and ledger error-handling standards into ~/.claude/CLAUDE.md on her laptop. Two new hires consistently generate code that violates these standards, and nobody can figure out why the rules are not being applied. What is the correct fix?",
   "options": [
    "Have every engineer copy the standards file into their own ~/.claude/CLAUDE.md",
    "Commit the standards to the project-level CLAUDE.md in the repository root",
    "Store the standards as environment entries in .claude/settings.json so they apply repo-wide",
    "Package the standards as a skill so Claude auto-invokes them whenever someone writes code"
   ],
   "correct": 1,
   "explanation": "User-level ~/.claude/CLAUDE.md is personal memory that lives only on one machine, so teammates never load it. Team standards belong in the version-controlled project CLAUDE.md, which every clone picks up automatically. Copying files per engineer reintroduces drift; settings.json holds permissions, hooks, and env rather than coding guidance; and a skill triggers probabilistically per task, while always-relevant standards must be reliably present in memory.",
   "hint": "Consider which level of the CLAUDE.md hierarchy travels with the repository rather than with one person's machine.",
   "difficulty": "core",
   "tags": [
    "claude-md",
    "config-hierarchy"
   ]
  },
  {
   "q": "A SaaS monorepo has packages/api built on Fastify and packages/dashboard built on React. The root CLAUDE.md documents both sets of conventions, and engineers report Claude applying React component patterns while editing API route handlers. Which change best fixes the misapplied conventions?",
   "options": [
    "Place a directory-level CLAUDE.md inside each package containing only that package's conventions",
    "Expand the root CLAUDE.md with conditional prose such as: when working in packages/api, ignore the React sections",
    "Split the monorepo into two repositories so each codebase gets its own dedicated CLAUDE.md",
    "Create one skill per package and tell engineers to invoke the matching one before editing"
   ],
   "correct": 0,
   "explanation": "Directory-level CLAUDE.md files scope guidance to the subtree where work is happening, so each package loads only its own conventions. Conditional prose in one big file is probabilistic — the model must remember to filter, which is exactly what is failing here. Splitting the repo is a drastic structural change to solve a configuration problem, and per-package skills depend on engineers remembering to invoke the right one before every edit.",
   "hint": "The CLAUDE.md hierarchy has a level designed for subtree-specific guidance.",
   "difficulty": "hard",
   "tags": [
    "claude-md",
    "monorepo"
   ]
  },
  {
   "q": "A customer-support team ships a skill that drafts refund-decision emails. Compliance requires that this skill never execute shell commands. The SKILL.md body states Never use Bash in bold, yet audit logs from last week show two sessions where the skill ran Bash anyway. What is the root-cause fix?",
   "options": [
    "Repeat the prohibition in all caps at both the top and bottom of the skill body",
    "Declare allowed-tools in the SKILL.md frontmatter listing only the tools the skill needs",
    "Add a project-wide PreToolUse hook that blocks every Bash invocation in the repository",
    "Lower the sampling temperature so the model follows the skill's instructions more reliably"
   ],
   "correct": 1,
   "explanation": "Instructions in a skill body are probabilistic; allowed-tools in the frontmatter is a deterministic restriction the harness enforces, scoped exactly to this skill. The project-wide hook is also deterministic but overbroad — it breaks every other workflow that legitimately needs Bash. Stronger wording and temperature tweaks leave compliance to chance.",
   "hint": "Look for the deterministic enforcement mechanism whose scope matches the thing being restricted.",
   "difficulty": "hard",
   "tags": [
    "skills",
    "allowed-tools"
   ]
  },
  {
   "q": "A platform team maintains 60 lines of secure-coding standards used by 14 service packages in a monorepo. Each package's CLAUDE.md currently holds a pasted copy. After the standards changed last sprint, an audit found 9 of the 14 copies were stale. How should the team restructure this?",
   "options": [
    "Add a sync script engineers are expected to run that re-copies the standards into all 14 CLAUDE.md files",
    "Move the standards into each engineer's ~/.claude/CLAUDE.md and announce updates in Slack",
    "Merge all 14 package files into a single large root CLAUDE.md so there is only one copy",
    "Keep one canonical standards file and reference it from each package CLAUDE.md via @import"
   ],
   "correct": 3,
   "explanation": "@import composes memory files, so 14 packages can share one canonical source that updates everywhere at once with no duplication. A sync script keeps 14 duplicates on disk and depends on every engineer remembering to run it — the same human-discipline failure that produced the stale copies. User-level placement loses version control and team sharing, and one giant root file forces every session to carry all 14 packages' content.",
   "hint": "There is a composition mechanism that lets many CLAUDE.md files share a single source of truth.",
   "difficulty": "core",
   "tags": [
    "import",
    "monorepo"
   ]
  },
  {
   "q": "In a repository of GitHub Actions pipelines, Claude has stopped following the YAML formatting conventions that should come from a directory-level CLAUDE.md inside .github/workflows. Before changing any configuration, the engineer wants to confirm whether that file is actually being loaded. What is the right first step?",
   "options": [
    "Restart the session and repeat the request to see whether the behavior changes",
    "Paste the conventions directly into the chat so the current task can proceed",
    "Run /reload-skills to force the session to rescan its configuration tree",
    "Run /memory to inspect exactly which memory files the session has loaded"
   ],
   "correct": 3,
   "explanation": "/memory shows which CLAUDE.md and memory files are loaded, turning a guess into a diagnosis. /reload-skills rescans skills, not memory files. Restarting or pasting content are blind workarounds that may mask the symptom without revealing whether the hierarchy is wired correctly.",
   "hint": "Diagnose what the session actually loaded before patching behavior.",
   "difficulty": "core",
   "tags": [
    "memory",
    "diagnostics"
   ]
  },
  {
   "q": "A document-processing team built .claude/skills/invoice-extractor/SKILL.md with a 200-line body of extraction rules for vendor invoices. Its frontmatter description reads: Internal helper for documents. Users paste invoices constantly, but the skill never auto-invokes. What should the team change?",
   "options": [
    "Rewrite the description to state what it does and when to use it, naming vendor invoices",
    "Add a line to the project CLAUDE.md instructing Claude to always use the invoice-extractor skill",
    "Move the 200 lines of extraction rules from the body into the description so the model sees them",
    "Set context: fork in the frontmatter so the skill executes in its own isolated context"
   ],
   "correct": 0,
   "explanation": "The frontmatter description drives auto-invocation; a vague phrase like Internal helper for documents gives the model nothing to match against invoice tasks. The CLAUDE.md directive is a probabilistic patch on top of the broken description and adds permanent context cost. Stuffing the body into the description destroys progressive disclosure, and context: fork affects execution, not triggering.",
   "hint": "Ask which piece of skill metadata the model actually reads when deciding whether to trigger it.",
   "difficulty": "core",
   "tags": [
    "skills",
    "auto-invocation"
   ]
  },
  {
   "q": "An engineer at an e-commerce company built a /release-checklist slash command in ~/.claude/commands that walks through the team's deployment checklist. During an incident, a teammate tried to run it and the command did not exist in her session. What is the right fix?",
   "options": [
    "Have the teammate recreate the command file under her own ~/.claude/commands directory",
    "Convert the checklist into a skill so it auto-invokes whenever a deployment is discussed",
    "Paste the checklist into the project CLAUDE.md so it is available in every session",
    "Move the command file into the repository's .claude/commands directory and commit it"
   ],
   "correct": 3,
   "explanation": "~/.claude/commands is personal scope — commands there exist only on the author's machine. Shared workflows belong in the project's .claude/commands directory, where they version with the repo and reach every teammate. Per-user recreation drifts over time; converting to a skill trades a deliberately explicit workflow for probabilistic triggering when the real problem is scope; and putting an on-demand checklist in CLAUDE.md pays an always-on context cost for content needed only at release time.",
   "hint": "Where a command file lives determines who can invoke it.",
   "difficulty": "core",
   "tags": [
    "slash-commands",
    "config-scope"
   ]
  },
  {
   "q": "A logistics startup's project CLAUDE.md has grown to 520 lines: about 40 lines of universal coding standards, 180 lines of test-writing guidance, 150 lines of API-package specifics, and a 150-line deployment runbook used a few times a month. Engineers report mid-file rules being ignored, and every session carries the full token cost. What is the best restructuring?",
   "options": [
    "Reorder the file so the most important rules sit at the top and bottom where model attention is strongest",
    "Split the content into ten topic files and @import every one of them from CLAUDE.md so the main file itself stays short",
    "Keep the 40 universal lines in CLAUDE.md, move scoped guidance to .claude/rules/ with paths globs, and make the runbook a skill",
    "Relocate the entire file to ~/.claude/CLAUDE.md so the content loads from the user level instead of the repository"
   ],
   "correct": 2,
   "explanation": "Only universally applicable standards should be always-on; path-scoped rules load when matching files are touched, and a skill body loads only when invoked thanks to progressive disclosure. The @import split is cosmetic — imported files still load every session, so the token cost and lost-in-the-middle problem remain. Reordering treats the attention symptom but fixes neither cost nor scoping, and moving everything to the user level loses version control while still loading all 520 lines.",
   "hint": "Match each block of content to the loading mechanism with the right scope and trigger.",
   "difficulty": "hard",
   "tags": [
    "claude-md",
    "rules",
    "progressive-disclosure"
   ]
  },
  {
   "q": "Six hours into a session on a healthcare data-extraction project, an engineer creates a new skill at .claude/skills/redact-phi/SKILL.md. When she asks Claude to use it in the same session, Claude responds that no such skill exists. She does not want to lose the session's accumulated context. What should she do?",
   "options": [
    "Exit and restart Claude Code, because skills are only discovered when a session starts",
    "Run /reload-skills so the current session rescans the skills directory",
    "Run /compact so the refreshed context window picks up the new skill",
    "Tell Claude the file path in chat so it reads SKILL.md and follows it manually"
   ],
   "correct": 1,
   "explanation": "/reload-skills rescans the skills tree mid-session, registering the new skill without discarding context. Restarting would work but throws away six hours of session state for no reason. /compact summarizes history and has nothing to do with skill discovery, and a manual Read bypasses the skill machinery entirely — no auto-invocation and no allowed-tools enforcement.",
   "hint": "There is a session command built specifically for picking up skill changes without starting over.",
   "difficulty": "core",
   "tags": [
    "reload-skills",
    "skills"
   ]
  },
  {
   "q": "A research-tooling team has a license-audit skill that shells out to dependency scanners, producing about 40,000 tokens of raw output per run. After each audit, the main session starts forgetting requirements the user stated earlier. Only a short verdict from the audit actually matters. What is the right design change?",
   "options": [
    "Instruct the skill body to request quieter output modes from the scanner commands",
    "Run /compact immediately after every audit to summarize the bloated transcript",
    "Move the audit instructions into the project CLAUDE.md so they are preloaded in every session",
    "Set context: fork in the skill frontmatter so the audit runs isolated and returns its summary"
   ],
   "correct": 3,
   "explanation": "context: fork executes the skill in an isolated context, so the 40,000 tokens of scanner noise never enter the main session — only the result comes back. Quieter output flags reduce but do not eliminate the pollution and depend on scanner cooperation. /compact is damage control applied after the context has already degraded, and CLAUDE.md placement changes loading, not execution isolation.",
   "hint": "Think about where the skill's verbose work should happen relative to the main conversation.",
   "difficulty": "hard",
   "tags": [
    "skills",
    "context-fork"
   ]
  },
  {
   "q": "An edtech React app keeps 80 lines of test-writing guidance (React Testing Library queries, a ban on snapshot tests) in its project CLAUDE.md, so every session loads it — including backend-only work. Test files are colocated with their components as *.test.tsx throughout src/. How should this guidance be scoped?",
   "options": [
    "Keep it in CLAUDE.md but preface it with: apply the following section only when editing test files",
    "Move it to .claude/rules/testing.md with paths: [\"**/*.test.tsx\"] in the YAML frontmatter",
    "Add a directory-level CLAUDE.md inside a central __tests__ folder that holds the guidance",
    "Convert the guidance into a slash command that engineers run before starting test work"
   ],
   "correct": 1,
   "explanation": ".claude/rules/ files with a paths glob in their frontmatter apply only when matching files are in play, which is exactly the scoping needed for colocated test files. A prose preface still loads all 80 lines everywhere and relies on the model to self-filter. A __tests__ directory CLAUDE.md cannot work because the tests are colocated, and a slash command depends on engineers remembering to run it.",
   "hint": "One mechanism attaches guidance to file patterns rather than to directories or whole sessions.",
   "difficulty": "core",
   "tags": [
    "rules",
    "path-scoping"
   ]
  },
  {
   "q": "Despite a project CLAUDE.md rule saying never delete anything under fixtures/golden, a headless claude -p run in CI executed rm -rf on that directory last Tuesday, breaking 30 snapshot tests. The team needs a guarantee this cannot recur. What should they add?",
   "options": [
    "A deny rule in settings.json permissions matching destructive Bash patterns on fixtures/golden",
    "A rewritten warning at the very top of CLAUDE.md using stronger and more explicit language",
    "A PostToolUse hook that detects deletions under fixtures/golden and pages the on-call engineer",
    "A plan-mode requirement so destructive steps in the pipeline wait for human approval first"
   ],
   "correct": 0,
   "explanation": "CLAUDE.md instructions are probabilistic, so no rewording produces a guarantee; settings.json deny rules are deterministic — the harness refuses matching calls outright, including in headless runs. The PostToolUse hook fires after the files are already gone, and pausing a headless CI run for human approval defeats the purpose of running headless.",
   "hint": "Guarantees come from the permission layer, not from louder instructions.",
   "difficulty": "hard",
   "tags": [
    "settings",
    "permissions"
   ]
  },
  {
   "q": "An e-commerce ops team shares a backfill-orders skill that needs a date range and a target environment. Teammates keep invoking it with no arguments, forcing Claude to ask follow-up questions every time. The team wants the expected inputs visible right at invocation. What is the designed mechanism for this?",
   "options": [
    "Rename the skill to backfill-orders-dates-env so the required inputs are part of its name",
    "Document the usage syntax in the onboarding section of the project CLAUDE.md",
    "Add argument-hint to the SKILL.md frontmatter describing the date range and environment",
    "Put a usage example at the top of the skill body so it is the first content loaded"
   ],
   "correct": 2,
   "explanation": "argument-hint is the frontmatter field built to surface expected arguments at invocation time. The skill body only loads after the skill is already triggered, so a usage example there arrives too late to shape what the user types. Renaming and CLAUDE.md documentation are workarounds users will not see at the moment of invocation.",
   "hint": "One frontmatter field exists specifically to tell invokers what to pass.",
   "difficulty": "core",
   "tags": [
    "skills",
    "argument-hint"
   ]
  },
  {
   "q": "An architect auditing an insurance-claims platform finds 24 skills, each with a SKILL.md body around 400 lines. Assuming every session pays the full cost of all of them, she drafts a plan to consolidate down to five skills. Which statement should change her plan?",
   "options": [
    "Only frontmatter metadata loads at session start; a body loads when its skill triggers, so 24 well-described skills are fine",
    "Every SKILL.md body loads into context at session start, so consolidating to five skills is the correct move",
    "Skills contribute nothing to context until invoked, including their descriptions, so auto-invocation needs a settings.json entry",
    "Bodies load at session start but /compact evicts them, so scheduled compaction solves the cost without consolidating"
   ],
   "correct": 0,
   "explanation": "Progressive disclosure means only the lightweight frontmatter — notably the description — is resident up front; the 400-line bodies cost nothing until a skill actually triggers. Consolidation would trade focused, well-scoped skills for muddier triggering with no token benefit. The claim that nothing loads is also wrong, since descriptions must be resident to drive auto-invocation, and /compact summarizes conversation history rather than evicting skill bodies on a schedule.",
   "hint": "Recall which part of a skill is resident before the skill is ever triggered.",
   "difficulty": "core",
   "tags": [
    "progressive-disclosure",
    "skills"
   ]
  },
  {
   "q": "A developer-productivity team is designing two helpers: one generates release notes and is run explicitly by an engineer before each release with a version tag; the other is a database-migration safety checklist that should engage automatically whenever Claude touches migration files. How should each be implemented?",
   "options": [
    "Both as skills, since skills handle both arguments and automatic triggering",
    "Both as slash commands, so engineers stay in explicit control of when each runs",
    "A slash command for the release notes and a description-driven skill for the migration checklist",
    "A skill for the release notes and a slash command for the migration safety checklist"
   ],
   "correct": 2,
   "explanation": "The release-notes flow is user-initiated with an argument — the classic slash command shape, giving deterministic on-demand invocation. The migration checklist must fire without anyone remembering to ask, which is exactly what a skill's description-driven auto-invocation provides. Making both skills leaves the deliberately explicit release flow to probabilistic triggering; making both slash commands loses the automatic safety net; and reversing the pairing puts manual invocation on the workflow that most needs to be automatic.",
   "hint": "Sort each helper by who initiates it: the human or the model.",
   "difficulty": "hard",
   "tags": [
    "slash-commands",
    "skills"
   ]
  }
 ],
 "floor-06": [
  {
   "q": "An engineer at a logistics company asks Claude Code to migrate the order-routing module from REST to gRPC — a change touching 35 files across three packages, with at least two viable migration strategies. Claude immediately starts editing files, and the engineer has to interrupt halfway through when the chosen approach turns out to conflict with the team's service-mesh setup. What should the engineer have done differently?",
   "options": [
    "Cap the session at 10 file edits so a wrong approach fails fast and can be restarted",
    "Add a CLAUDE.md rule telling Claude to describe every change before each edit",
    "Start the task in plan mode so the migration strategy is reviewed and approved before any edits",
    "Split the migration into 35 single-file sessions so each change stays small and obvious"
   ],
   "correct": 2,
   "explanation": "Plan mode is designed for exactly this profile — multi-file, architectural work with multiple valid approaches — because the strategy gets reviewed before any code changes happen. Direct execution is only appropriate for single-file, obvious fixes. Splitting into 35 single-file sessions hides the architectural decision rather than surfacing it, an edit cap restarts the same mistake instead of preventing it, and a per-edit narration rule in CLAUDE.md is a probabilistic instruction, not a review gate.",
   "hint": "Match the execution mode to the shape of the change: how many files are touched, and how many valid approaches exist?",
   "difficulty": "core",
   "tags": [
    "plan-mode",
    "claude-code"
   ]
  },
  {
   "q": "A release engineer adds a GitHub Actions step that should have Claude Code turn the merged commits into release notes. She tries CLAUDE_HEADLESS=true claude \"summarize the commits\" and the job hangs waiting for an interactive terminal until the runner times out. Which invocation actually runs Claude Code non-interactively in CI?",
   "options": [
    "claude -p \"Summarize the merged commits into release notes\"",
    "claude --headless \"Summarize the merged commits into release notes\"",
    "claude --batch \"Summarize the merged commits into release notes\"",
    "Set CI=true so Claude Code detects the pipeline and disables interactive mode itself"
   ],
   "correct": 0,
   "explanation": "claude -p is the headless print mode: it executes the prompt non-interactively, prints the result, and exits — the supported pattern for CI pipelines. --headless, --batch, and CLAUDE_HEADLESS-style environment variables are not real Claude Code interfaces, and there is no CI auto-detection that substitutes for -p.",
   "hint": "Exactly one real flag puts Claude Code into print-and-exit mode; the others are invented.",
   "difficulty": "core",
   "tags": [
    "headless",
    "ci-cd"
   ]
  },
  {
   "q": "A fintech team's pipeline runs claude -p to triage failing integration tests, then a Python script scrapes the verdict out of Claude's prose with a regex. Every few weeks the wording shifts (\"the likely culprit is...\" vs \"root cause:\") and the parser silently mis-routes tickets to the wrong on-call team. What fixes the root cause?",
   "options": [
    "Tighten the regex to cover the new phrasings and add unit tests for the parser",
    "Run claude -p with --output-format json and read the verdict from the structured result envelope",
    "Append \"always begin your answer with the exact phrase ROOT CAUSE:\" to the prompt",
    "Capture stderr and stdout separately so the prose and the verdict do not interleave"
   ],
   "correct": 1,
   "explanation": "Scraping free-form prose is the root flaw; --output-format json makes claude -p emit a machine-readable envelope the script can parse deterministically. A prompted sentinel phrase is probabilistic and will eventually drift just like the prose did, hardening the regex only restarts the breakage cycle with the next wording change, and stream separation does nothing about wording inside the prose itself.",
   "hint": "Choose deterministic machine-readable output over ever-smarter parsing of natural language.",
   "difficulty": "core",
   "tags": [
    "output-format",
    "headless"
   ]
  },
  {
   "q": "A nightly job runs claude -p with --output-format json to scan a repo for deprecated API usage and must hand a dashboard importer records shaped like {file, line, severity}. The JSON envelope always parses, but the result field inside is free-form text, and the importer rejects roughly one run in five. What gives the importer a typed guarantee?",
   "options": [
    "Add three correctly formatted example records to the prompt and rerun any failures",
    "Pin the model version so the formatting stays stable from run to run",
    "Chain a second claude -p call that reformats the first run's output into the record shape",
    "Pass the record schema to the job with --json-schema so the result payload itself is typed"
   ],
   "correct": 3,
   "explanation": "--output-format json structures the envelope, not the content inside it; --json-schema constrains the result payload to the supplied schema, which is what the importer's contract needs. Few-shot examples improve the odds but remain probabilistic, pinning the model version still leaves the result field free-form, and a second reformatting call adds cost while still offering no guarantee.",
   "hint": "One flag structures the wrapper around the answer; a different flag types the answer itself.",
   "difficulty": "hard",
   "tags": [
    "json-schema",
    "output-format"
   ]
  },
  {
   "q": "An e-commerce monorepo runs a long dependency-upgrade job through claude -p that takes about nine minutes. The CI runner kills any step that is silent on stdout for five minutes, so the job dies mid-run with nothing logged. The team wants real visibility into what the job is doing, not just a way to keep the runner from killing it. What should they change?",
   "options": [
    "Raise the runner's silence threshold to fifteen minutes for this one job",
    "Wrap the step in a shell loop that echoes a heartbeat line every sixty seconds",
    "Run the job with --output-format stream-json so events are emitted incrementally as they occur",
    "Split the upgrade into several claude -p calls so each one finishes in under five minutes"
   ],
   "correct": 2,
   "explanation": "stream-json emits each event as it happens, which keeps stdout active for the watchdog and gives the team a live trace of what Claude is actually doing. A heartbeat echo quiets the watchdog but reveals nothing about progress, raising the threshold just hides the observability gap, and splitting the job adds orchestration complexity while each call still runs as a silent blob.",
   "hint": "Think incremental events flowing out during the run, not one blob at the end.",
   "difficulty": "core",
   "tags": [
    "stream-json",
    "ci-cd"
   ]
  },
  {
   "q": "A 14-person platform team wants every GitHub pull request reviewed by Claude before human review. Today, reviews only happen when a developer remembers to run a review prompt locally, and about a quarter of PRs merge without one. What is the standard way to automate this?",
   "options": [
    "A nightly cron job that batch-reviews everything merged during the previous day",
    "Add claude-code-action to the repository's GitHub Actions workflow triggered on pull requests",
    "A pre-push hook on each developer laptop that runs claude -p against the branch diff",
    "A required PR checklist item where the author pastes the output of their local Claude review"
   ],
   "correct": 1,
   "explanation": "claude-code-action is the supported GitHub Actions integration for PR review: it runs server-side on every pull request, removing the dependency on individual developer discipline. Laptop hooks and checklist items still rely on each developer's machine and memory, and a nightly batch review lands after merge — too late to gate anything.",
   "hint": "Pick the mechanism that runs server-side on every PR regardless of what any developer remembers to do.",
   "difficulty": "core",
   "tags": [
    "claude-code-action",
    "ci-cd"
   ]
  },
  {
   "q": "A healthcare intake startup has one Claude Code session generate a FHIR message parser and then, in the same session, asks \"now review the code you just wrote for bugs.\" The review comes back clean, yet a null-handling defect ships to staging that week. What is the architectural flaw?",
   "options": [
    "The reviewer shares the generator's context, so it inherits and re-confirms the same reasoning that produced the bug",
    "The review prompt was too gentle; it should have demanded \"be extremely critical and assume bugs exist\"",
    "The session ran low on context window before the review, so the code was only partially re-read",
    "The generation step used too small a thinking budget, leaving the review without reasoning depth"
   ],
   "correct": 0,
   "explanation": "Same-session self-review keeps the entire generation rationale in context, so the model tends to confirm its own earlier decisions rather than challenge them. The fix is a separate reviewer session that sees only the code, not the reasoning behind it. Harsher prompt wording does not remove the bias because the original justifications are still sitting in the reviewer's context, and neither context exhaustion nor thinking budget explains why a clean-looking review systematically misses the generator's own mistakes.",
   "hint": "Consider what this reviewer can see that a genuinely independent reviewer never would.",
   "difficulty": "core",
   "tags": [
    "self-review",
    "reviewer-session"
   ]
  },
  {
   "q": "A claude-code-action review runs on every push to a PR. When a developer pushes a fix commit, the bot re-reviews and reposts the same nine findings as brand-new comments, and developers have started muting it entirely. The team wants re-reviews to surface only new issues or ones still unresolved. What is the best fix?",
   "options": [
    "Post-process the bot's output and suppress any comment whose text fuzzy-matches an earlier comment",
    "Restrict each re-review to only the files touched by the newest commit",
    "Have the action close all of its previous comment threads before posting each fresh review",
    "Include the prior review's findings in the new run's context so it skips duplicates and checks resolution"
   ],
   "correct": 3,
   "explanation": "The reviewer cannot avoid repeating itself or judge whether an issue was fixed unless it knows what it found last time — feeding prior findings into the re-review fixes that at the source. Fuzzy-match suppression breaks the moment wording shifts and can never confirm a finding was resolved, diff-only re-review silently drops unresolved findings in files the fix commit did not touch, and closing old threads just hides the duplication.",
   "hint": "A reviewer can only avoid duplicate findings if it has access to its own previous findings.",
   "difficulty": "hard",
   "tags": [
    "re-review",
    "claude-code-action"
   ]
  },
  {
   "q": "A nightly CI audit invokes claude -p to assess code quality across a payments repository and is meant to be strictly read-only. One morning the team discovers the job rewrote two config files and committed them via Bash, even though the prompt says \"do not modify anything.\" What is the strongest fix?",
   "options": [
    "Strengthen the prompt: \"READ-ONLY audit. Never use Edit, Write, or Bash under any circumstances\"",
    "Add a PostToolUse hook that git-restores any file the audit job touches",
    "Launch the job with --allowedTools limited to Read, Grep, and Glob so write-capable tools do not exist in the session",
    "Run the CI job under a Git identity that lacks push permission to the repository"
   ],
   "correct": 2,
   "explanation": "--allowedTools deterministically scopes what the session can do — with Edit, Write, and Bash absent, the job cannot modify anything regardless of what the model decides. Prompt prohibitions are probabilistic and have already failed once; revoking push permission still allows local edits that corrupt the workspace, and a PostToolUse revert cleans up damage instead of preventing it.",
   "hint": "Deterministic removal of a capability beats both instructions and after-the-fact cleanup.",
   "difficulty": "core",
   "tags": [
    "allowedTools",
    "ci-cd"
   ]
  },
  {
   "q": "A CI job asks Claude Code to generate unit tests for the files changed in each PR. Within a month the suite contains over 60 tests that duplicate existing coverage almost verbatim — same fixtures, same assertions — and CI time has doubled. What fixes the root cause?",
   "options": [
    "Add \"do not write tests that already exist\" to the generation prompt",
    "Include the package's existing test files in the job's context so generation targets uncovered gaps",
    "Run a post-generation script that deletes any new test whose name matches an existing test",
    "Cap the job at five new tests per PR to limit how fast duplication can accumulate"
   ],
   "correct": 1,
   "explanation": "The model cannot avoid duplicating tests it has never seen — the root cause is missing context, not a missing instruction. Providing the existing tests lets generation target genuine coverage gaps. The prompt rule is unenforceable without that visibility, name-matching deletion misses duplicates with different names, and a cap only slows the bloat.",
   "hint": "An instruction is useless if the model lacks the information needed to follow it.",
   "difficulty": "core",
   "tags": [
    "test-generation",
    "context"
   ]
  },
  {
   "q": "A claude-code-action review handles the team's typical 300-line PRs well, but on a 4,800-line vendored-library upgrade it produced detailed comments on the first dozen files, skimmed the remaining forty with one-line notes, and closed with a normal wrap-up well under its output limit — missing a known injection bug in file 38. What should the team change?",
   "options": [
    "Split large PRs into multiple review passes, one per module, and aggregate the findings",
    "Switch the review to Opus with a maximum thinking budget so a single pass can cover everything",
    "Prompt the reviewer to \"give equal attention to every file regardless of its position in the diff\"",
    "Raise the action's maximum output tokens so the review is not truncated partway through the files"
   ],
   "correct": 0,
   "explanation": "A single pass over a 4,800-line diff dilutes attention, and material deep in the context gets skimmed or missed — the lost-in-the-middle failure mode. Multi-pass review keeps each chunk within a size the model handles reliably and aggregates the results. The review finished normally under its output limit, so truncation is not the cause; a bigger model or thinking budget does not fix attention dilution, and an \"equal attention\" instruction is a best-effort wish, not a mechanism.",
   "hint": "When one context has to cover too much material, divide the work instead of exhorting the model.",
   "difficulty": "hard",
   "tags": [
    "multi-pass-review",
    "context"
   ]
  },
  {
   "q": "A platform team runs a nightly deprecation audit over 7,500 source files using parallel synchronous API calls at 2 a.m. The findings feed a weekly cleanup rotation, so nothing downstream ever blocks on the results, and the job now accounts for 30% of monthly model spend. Which change cuts cost without reducing coverage?",
   "options": [
    "Downgrade the audit to a weekly run so the spend is divided by seven",
    "Add cache_control breakpoints to every request to discount the per-file token cost",
    "Strip comments and whitespace from each file before sending to shrink input tokens",
    "Submit the audit through the Batch API with a custom_id per file and poll until results arrive"
   ],
   "correct": 3,
   "explanation": "The audit is fully non-blocking — exactly the profile the Message Batches API targets: a 50% discount, results within 24 hours with no latency SLA, and custom_id to match each result back to its file. A weekly cadence cuts how often issues are caught rather than unit cost, prompt caching only discounts a stable shared prefix and not the unique file content dominating this spend, and stripping comments yields marginal savings while distorting the line numbers the audit reports.",
   "hint": "When nobody is waiting on the response, one pricing model exists specifically for that situation.",
   "difficulty": "core",
   "tags": [
    "batch-api",
    "cost"
   ]
  },
  {
   "q": "To save money, a team moved its required pre-merge license-compliance check onto the Batch API. Most batches come back within 20 minutes, but some PRs sit blocked for six hours, and one Friday a batch took nearly a full day and froze all merges. What is the correct architecture?",
   "options": [
    "Split each submission into smaller batches so individual batches complete faster",
    "Run the blocking check synchronously via claude -p and reserve the Batch API for non-blocking audits",
    "Poll batch status every 30 seconds instead of every 10 minutes to retrieve results sooner",
    "Submit each PR's check as its own single-item batch so it never queues behind larger jobs"
   ],
   "correct": 1,
   "explanation": "The Batch API promises results within 24 hours and offers no latency SLA, so anything that gates merges must run synchronously. Polling cadence and batch sizing only change when you notice completion, not when it happens — the 24-hour window applies regardless of how small the batch is, including a single-item batch.",
   "hint": "One API trades a latency promise for a discount — match it only to work where nobody is blocked.",
   "difficulty": "hard",
   "tags": [
    "batch-api",
    "ci-cd"
   ]
  },
  {
   "q": "A release-notes step running claude -p in CI produces a different structure almost every run — sometimes bullets grouped by team, sometimes a single paragraph, sometimes a table of raw commit hashes. The prompt already says \"be consistent, concise, and professional.\" What is the most effective next step?",
   "options": [
    "Add two or three concrete input/output examples of the desired format and refine them against failed runs",
    "Replace the adjectives with a longer prose description spelling out every formatting rule",
    "Pin the temperature to zero so the model makes identical choices on every run",
    "Move the step to a larger model that follows style instructions more faithfully"
   ],
   "correct": 0,
   "explanation": "Adjectives like \"consistent\" underdefine the target; concrete input/output examples show the exact structure, and iterating on them against real failed runs closes the remaining gaps. Temperature zero only makes output deterministic for identical input — every release has different commits, so the format still drifts — a larger model still has no definition of the desired shape, and longer prose rules remain more ambiguous than one worked example.",
   "hint": "Show the model what success looks like rather than describing it, then tune against real failures.",
   "difficulty": "hard",
   "tags": [
    "few-shot",
    "iterative-refinement"
   ]
  },
  {
   "q": "After a botched refactor, a developer-productivity lead mandates plan mode for every Claude Code task. Two weeks later, developers complain that fixing a docstring typo or bumping a version string now requires reviewing and approving a plan, and several have stopped using the tool. What policy matches the actual intent of plan mode?",
   "options": [
    "Keep the mandate but configure plans to auto-approve after 30 seconds without objection",
    "Drop plan mode entirely and rely on PR review to catch bad approaches after the fact",
    "Reserve plan mode for multi-file or architectural work and let single-file obvious fixes run directly",
    "Keep plan mode mandatory but route trivial fixes to a faster model so plans generate quicker"
   ],
   "correct": 2,
   "explanation": "The criterion is the shape of the change: plan mode earns its overhead on multi-file, architectural tasks where multiple valid approaches exist, while single-file obvious fixes warrant direct execution. Auto-approving plans deletes the review that is plan mode's entire value, a faster model still forces a pointless approval step on trivial fixes, and dropping it everywhere recreates the risk that caused the original botched refactor.",
   "hint": "The mode should follow the blast radius of the change, not a blanket rule in either direction.",
   "difficulty": "hard",
   "tags": [
    "plan-mode",
    "workflow"
   ]
  }
 ],
 "floor-07": [
  {
   "q": "Your CI pipeline runs claude -p to review every PR in a 40-developer monorepo. The review prompt includes the line 'be careful not to flag things that are not real problems,' yet PRs still average 12 comments each, mostly style nitpicks the linter already enforces. What is the most effective prompt change?",
   "options": [
    "Lower the sampling temperature so the model generates fewer speculative findings and sticks to obvious problems",
    "Strengthen the existing instruction to say the model should be very careful and only report issues it is extremely confident are real",
    "Replace the vague caution with explicit flag and skip criteria: enumerate the defect types to report and state that linter-covered style issues must be skipped",
    "Add a hard cap of five comments per PR so the volume of nitpicks stays manageable for reviewers"
   ],
   "correct": 2,
   "explanation": "Vague cautions like 'be careful' give the model no operational definition of a real problem, so they fail at scale; explicit flag and skip criteria provide a checkable decision rule. Confidence-based phrasing is the same vagueness restated, temperature changes randomness rather than the decision rule, and a comment cap hides noise without improving precision.",
   "hint": "The fix is to make the decision rule operational, not to restate the caution more forcefully.",
   "difficulty": "core",
   "tags": [
    "explicit-criteria",
    "code-review",
    "prompting"
   ]
  },
  {
   "q": "Your fintech extraction service uses a tool_use definition with a detailed JSON schema to pull line items and totals from vendor invoices. Every response parses cleanly against the schema, yet on 6 percent of invoices the extracted line-item amounts do not add up to the extracted invoice total. What does this indicate?",
   "options": [
    "The schema is underspecified; adding minimum and maximum constraints on the amount fields will bring the sums into alignment",
    "The schema guarantees syntactic compliance only, so semantic checks like sum validation must run as a separate programmatic step",
    "tool_choice should be set to any so the model is forced to use the extraction tool on every invoice it processes",
    "The schema's field descriptions are too short; expanding them will make the extracted values arithmetically consistent"
   ],
   "correct": 1,
   "explanation": "A tool_use JSON schema guarantees the output's structure, not the correctness of its values, and JSON Schema cannot express cross-field arithmetic like line items summing to a total. The root-cause fix is programmatic semantic validation downstream; numeric bounds and longer descriptions cannot enforce arithmetic consistency, and tool_choice changes when tools are called, not whether values are right.",
   "hint": "Separate what a schema can promise about shape from what it can promise about meaning.",
   "difficulty": "core",
   "tags": [
    "json-schema",
    "semantic-validation",
    "tool_use"
   ]
  },
  {
   "q": "A support-resolution agent ends each conversation by writing a handoff summary for human agents. The required format is four labeled sections, but in production the model sometimes merges sections, renames headers, or adds extras, even though the prompt describes the format in detail. What is the most reliable prompt-level fix?",
   "options": [
    "Add two to four complete example summaries to the prompt that demonstrate the exact section structure on representative tickets",
    "Expand the prose format description with stronger language such as 'you must always use exactly these four headers'",
    "Append thirty example summaries covering every ticket category the support team has ever encountered",
    "Ask the model to first restate the format rules in its own words, then write the summary beneath its restatement"
   ],
   "correct": 0,
   "explanation": "Few-shot examples demonstrate format far more reliably than prose descriptions, and 2 to 4 well-chosen examples are typically enough for format consistency. Thirty examples add cost and context bloat with diminishing returns, stronger prose wording is the same probabilistic instruction that is already failing, and a restatement preamble adds extra text that itself violates the required four-section output.",
   "hint": "Showing the model the output usually beats describing it, but more of a good thing has diminishing returns.",
   "difficulty": "core",
   "tags": [
    "few-shot",
    "format-consistency"
   ]
  },
  {
   "q": "An automated security reviewer posts findings on PRs across your platform team's repositories. Its 'potential race condition' category has run at roughly 80 percent false positives for three weeks, and engineers have started dismissing every finding unread, including valid secret-exposure alerts from other categories. What should you do first?",
   "options": [
    "Attach a model-reported confidence score to each finding so engineers can sort and triage the noisy category themselves",
    "Disable the race-condition category in production, tune it offline against labeled examples, and re-enable it once precision recovers",
    "Add a prompt instruction telling the model to flag race conditions only when it is certain the code is genuinely unsafe",
    "Send the team a reliability ranking of the finding categories so they know which ones are worth reading carefully"
   ],
   "correct": 1,
   "explanation": "One high-false-positive category poisons trust in the entire tool, so the first move is to pull it from production and fix it offline against labeled data, restoring it only when precision recovers. Self-reported confidence scores are poorly calibrated so sorting by them does not rebuild trust, a certainty instruction is a vague caution restated, and a reliability memo asks engineers to keep absorbing the noise.",
   "hint": "When one noisy category makes engineers ignore everything, think about protecting trust in the whole tool first.",
   "difficulty": "hard",
   "tags": [
    "false-positives",
    "reviewer-trust",
    "code-review"
   ]
  },
  {
   "q": "An e-commerce pipeline asks Claude to return product attributes as JSON in a plain text response. About 2 percent of responses begin with 'Here is the extracted JSON:' or wrap the object in a code fence, crashing the downstream parser. The prompt already says 'respond with only the JSON object, no other text.' What is the root-cause fix?",
   "options": [
    "Use strict structured outputs or a tool_use schema so conformance is guaranteed rather than requested through instructions",
    "Add a regex preprocessing step that strips any leading prose and code fences before the parser runs",
    "Repeat the JSON-only instruction at both the start and the end of the prompt so the model cannot miss it",
    "Detect parse failures at runtime and automatically resend the request until a clean JSON response comes back"
   ],
   "correct": 0,
   "explanation": "Prompt instructions are probabilistic and will occasionally be violated at scale; strict structured outputs or tool_use with a schema make conformance a guarantee of the API rather than a request. Regex stripping and retry loops patch the symptom while leaving the unreliable mechanism in place, and repeating the instruction is more of the same best-effort approach.",
   "hint": "Ask which option turns 'please format it this way' into a guarantee.",
   "difficulty": "core",
   "tags": [
    "structured-outputs",
    "json-parsing"
   ]
  },
  {
   "q": "A healthcare intake assistant classifies patient messages as urgent, routine, or administrative. Accuracy on clear-cut messages is 98 percent, but messages mixing signals, like a medication-refill request that also mentions new chest pain, get classified inconsistently across runs. The prompt already contains three clear examples of each category. What should you add?",
   "options": [
    "More clear-cut examples of each category, scaling up to ten per class so every label is better represented",
    "An instruction telling the model to use its best clinical judgment whenever a message contains mixed signals",
    "A higher extended-thinking budget so the model reasons for longer about every incoming patient message",
    "A few examples of mixed-signal messages, each paired with the correct label and the reasoning that justifies it"
   ],
   "correct": 3,
   "explanation": "The failures are concentrated in ambiguous inputs, so the examples must demonstrate how to resolve ambiguity, and including the reasoning teaches the decision process rather than just the answer. More clear-cut examples reinforce what already works, 'use best judgment' gives the model no new decision rule, and a bigger thinking budget adds latency to every message without supplying the missing tie-breaking criteria.",
   "hint": "Target the examples at where the model actually fails, and show the why, not only the what.",
   "difficulty": "hard",
   "tags": [
    "few-shot",
    "ambiguous-cases"
   ]
  },
  {
   "q": "An insurance claims pipeline extracts fields from faxed forms using a tool_use schema where policy_number is a required string. When a fax is missing the policy number, about 1 in 30, the model fills in a realistic-looking but invented value, which downstream systems then attempt to look up and fail on. What is the root-cause fix?",
   "options": [
    "Add a prompt warning: 'Never fabricate a policy number; write UNKNOWN if it is absent from the document'",
    "Add a post-extraction validator that checks each policy number against the policy database and discards misses",
    "Change policy_number to type ['string','null'] so the schema itself gives the model a way to report absence",
    "Add few-shot examples of faxes that do include policy numbers so extraction of the field becomes more reliable"
   ],
   "correct": 2,
   "explanation": "A required field forces the model to produce a value even when none exists, which is exactly what drives fabrication; making the field nullable gives the model a legitimate way to say not present. A prompt warning is a probabilistic patch over a schema that still demands a value, database validation catches fabrications after the fact instead of preventing them, and examples of present values do nothing for absent ones.",
   "hint": "When the schema demands a value the document may not contain, the schema is the problem.",
   "difficulty": "core",
   "tags": [
    "nullable-fields",
    "fabrication",
    "json-schema"
   ]
  },
  {
   "q": "A logistics intake system classifies shipping documents with an enum field of six values: bill_of_lading, packing_list, customs_declaration, invoice, delivery_receipt, insurance_certificate. A carrier starts sending a new dangerous-goods declaration form, and the model silently labels every one as customs_declaration. How should the schema evolve?",
   "options": [
    "Replace the enum with a free-text document_type string so the model can name any document it encounters",
    "Add dangerous_goods_declaration to the enum and plan to extend the list whenever a new form type appears",
    "Keep the enum but instruct the model to pick a category only when it is confident the document truly matches it",
    "Add an other value to the enum alongside a free-text detail field that captures what the document appears to be"
   ],
   "correct": 3,
   "explanation": "A closed enum forces the model to misfile anything outside the list; an other value plus a free-text detail field lets unknown documents surface visibly instead of silently corrupting a known category. Adding one new enum value fixes today's form but leaves the same silent-misfiling failure waiting for the next one, free text sacrifices the structure downstream systems rely on, and a confidence instruction still gives the model no valid label to choose.",
   "hint": "Design the schema so inputs outside the known categories become visible instead of being force-fit.",
   "difficulty": "core",
   "tags": [
    "enums",
    "schema-design"
   ]
  },
  {
   "q": "A legal-discovery pipeline receives unlabeled documents that may be contracts, depositions, or court filings, with a dedicated extraction tool for each type. With tool_choice set to auto, the model sometimes replies in prose asking which document type it is looking at instead of extracting anything. What configuration fixes this?",
   "options": [
    "Set tool_choice to any so the model must call one of the extraction tools, choosing which based on the document's content",
    "Set tool_choice to force the contracts tool, since contracts make up the majority of the incoming document stream",
    "Add a system-prompt rule stating the model must never respond with a clarifying question during an extraction run",
    "Combine the three tools into a single extractor whose schema is a union of all three document types' fields"
   ],
   "correct": 0,
   "explanation": "tool_choice any guarantees a tool call on every request while leaving the model free to pick the right extractor for the content, the exact fit for unlabeled streams with one tool per document type. Forcing a specific named tool misroutes every non-contract, a prompt rule against clarifying questions is best-effort rather than a guarantee, and a union schema blurs three focused tools into one ambiguous surface.",
   "hint": "You need a guarantee that some tool gets called without dictating which one.",
   "difficulty": "core",
   "tags": [
    "tool_choice",
    "extraction"
   ]
  },
  {
   "q": "A research-ingestion agent must always log a paper's title, authors, and venue via its extract_metadata tool before doing anything else, then decide among summarize_abstract, extract_citations, or finishing. In testing, the model occasionally skips metadata and goes straight to summarization. How do you enforce the ordering?",
   "options": [
    "Set tool_choice to any for the whole session so every turn is guaranteed to produce some tool call",
    "Force the first request with tool_choice naming the extract_metadata tool, then switch tool_choice to auto for subsequent turns",
    "List extract_metadata first in the tools array, since the model weights earlier tool definitions more heavily",
    "Add a system-prompt instruction in emphatic wording that extract_metadata must always be called before any other tool"
   ],
   "correct": 1,
   "explanation": "Forcing a named tool with tool_choice guarantees the first call deterministically, and relaxing to auto afterward restores the model's judgment for the rest of the workflow, including the option to finish. tool_choice any guarantees a call but not which one, tool-list ordering carries no enforcement guarantee, and emphatic instructions are probabilistic, which is the failure already observed.",
   "hint": "Use the deterministic control for the step that must happen, then hand judgment back.",
   "difficulty": "core",
   "tags": [
    "tool_choice",
    "workflow-ordering"
   ]
  },
  {
   "q": "A developer-productivity assistant gets its persona, coding standards, and 'never push directly to main' rules injected at the top of every user message, with each request's diff and ticket details following below. In long sessions adherence to the rules degrades, and prompt caching saves almost nothing. How should the prompt be restructured?",
   "options": [
    "Keep the rules in the user messages but also repeat them verbatim in a final reminder line at the end of each request",
    "Move the per-request diff and ticket details into the system prompt so all content shares one stable location",
    "Put the stable persona, standards, and rules in the system prompt and keep only the per-request diff and ticket details in user messages",
    "Compress the rules into a one-line summary so repeating them inside every user message costs fewer tokens"
   ],
   "correct": 2,
   "explanation": "The system prompt is the home for stable identity, behavioral rules, and constraints, while user messages carry per-turn data, and that separation also creates the stable prefix prompt caching needs. Repeating rules in every user message duplicates tokens and mixes instructions with data, moving volatile per-request content into the system prompt would destroy the stable prefix entirely, and compressing the rules weakens them without fixing their placement.",
   "hint": "Stable instructions and volatile data each have a proper home in the request structure.",
   "difficulty": "core",
   "tags": [
    "system-prompt",
    "prompt-structure",
    "prompt-caching"
   ]
  },
  {
   "q": "A real-estate listing extractor sends a 28,000-token system prompt with taxonomy, field rules, and few-shot examples plus a cache_control breakpoint, followed by one listing per request at 40 requests per minute. Billing shows constant cache writes but almost no cache reads. The system prompt begins with the line 'Current time: 2026-06-09T14:32:07Z.' What is the cause?",
   "options": [
    "The 5-minute cache TTL is expiring between requests, so the team should switch to the 1-hour TTL option",
    "The cache breakpoint is placed too late in the prompt; moving it earlier would let partial prefixes match",
    "28,000 tokens exceeds the cacheable prefix size, so the system prompt must be trimmed before hits can occur",
    "The second-precision timestamp changes every request, so the prefix never matches; volatile values must move after the stable content"
   ],
   "correct": 3,
   "explanation": "Cache hits require the prefix to be identical across requests, so a timestamp that differs every second at the very start invalidates the entire 28,000-token prefix behind it, which is exactly why every request writes and none read. At 40 requests per minute the 5-minute TTL cannot be expiring, no breakpoint placement helps when the first line itself changes, and there is no prefix-size limit problem at this scale.",
   "hint": "A cache hit requires the prefix to be byte-for-byte identical across requests.",
   "difficulty": "hard",
   "tags": [
    "prompt-caching",
    "stable-prefix"
   ]
  },
  {
   "q": "After migrating an expense-report extractor to strict structured outputs, an engineer opens a PR deleting the downstream validation layer that checks each report's category subtotals against its grand total, arguing that 'the output is schema-guaranteed now.' How should you respond?",
   "options": [
    "Keep the validation layer: strict outputs guarantee structural conformance, but cross-field arithmetic is semantic and can still be wrong",
    "Approve the deletion, since strict structured outputs make schema violations impossible and the checks are now dead code",
    "Replace the validation layer with a prompt instruction requiring that subtotals always sum exactly to the grand total",
    "Encode the subtotal constraint directly in the JSON schema so the API enforces the arithmetic at generation time"
   ],
   "correct": 0,
   "explanation": "Strict structured outputs harden the syntactic guarantee of well-formed JSON matching the schema, but say nothing about whether the values are right, so semantic invariants like subtotal arithmetic still need programmatic checks. JSON Schema cannot express cross-field arithmetic constraints, so that option is not implementable, and a prompt instruction downgrades a deterministic check to a best-effort request.",
   "hint": "Upgrading the syntax guarantee does not upgrade the meaning of the values.",
   "difficulty": "hard",
   "tags": [
    "structured-outputs",
    "semantic-validation"
   ]
  },
  {
   "q": "A sentiment pipeline classifies 50,000 product reviews per day using a prompt with classification rules and few-shot examples ahead of a cache breakpoint, each review appended last. To 'keep the model fresh,' a teammate samples a new random set of eight examples from a 200-example pool on every request. Cache reads have dropped to zero and label formats have started drifting. What should change?",
   "options": [
    "Move the examples after the review text so the rotating content sits outside the cached portion of the prompt",
    "Fix a stable, hand-picked set of two to four examples in the prefix so the cache hits again and the format stays consistent",
    "Keep rotating examples but expand the pool to 1,000 so the model sees more diversity across the day's requests",
    "Shrink each rotated set from eight examples down to two so the changing portion of the prefix is smaller per request"
   ],
   "correct": 1,
   "explanation": "Rotating examples changes the prefix on every request, killing cache hits, and inconsistent demonstrations invite format drift; a stable, curated set of 2 to 4 examples fixes both at once. Moving examples after the review text would recover caching of the rules but the demonstrations still rotate, so the format drift continues; the root flaw is rotation itself, and shrinking or enlarging the rotated set keeps that flaw.",
   "hint": "Both symptoms trace to the same decision; ask what changing the prefix every request costs you.",
   "difficulty": "hard",
   "tags": [
    "few-shot",
    "prompt-caching"
   ]
  },
  {
   "q": "A medical-records pipeline forces its first call with tool_choice set to the extract_patient_header tool, which works, but the integration leaves that same tool_choice on every subsequent request. The model now re-extracts the header repeatedly and never calls extract_medications or produces its final summary. What is the fix?",
   "options": [
    "Add a system-prompt rule that the header tool may be called at most once per document so the model stops repeating it",
    "Switch tool_choice to any after the first turn so the model is forced to keep selecting among the remaining tools",
    "Remove extract_patient_header from the tools array after the first call so the model can no longer select it",
    "After the forced first call returns, send subsequent requests with tool_choice set to auto so the model can choose tools or finish"
   ],
   "correct": 3,
   "explanation": "The force-then-relax pattern requires actually relaxing: leaving a named tool forced compels every turn to call that tool. Switching to auto restores the model's ability to pick the right next tool or end the turn with the final summary. tool_choice any would still force some tool call on every turn, blocking the closing prose summary; removing the tool from the array while tool_choice still names it just breaks the request instead of relaxing the constraint; and a prompt rule cannot override a forced tool_choice at all.",
   "hint": "Forcing a named tool is a first-turn maneuver; recall what the second half of that pattern is.",
   "difficulty": "hard",
   "tags": [
    "tool_choice",
    "agentic-loop"
   ]
  }
 ],
 "floor-08": [
  {
   "q": "A fintech extraction pipeline validates Claude's invoice JSON against a schema plus business rules. When a rule fails — line_items sum to 4,210.50 but invoice_total reads 4,120.50 — the pipeline resends the exact same prompt, and all three retries return the same wrong output. What change makes the retry loop actually effective?",
   "options": [
    "Raise the temperature on retries so each attempt samples a different output instead of repeating the same mistake",
    "Include the exact validation failure in the retry prompt so the model knows what to fix and can reconcile the totals",
    "Switch each retry to a larger, more capable model so the second attempt reasons more deeply about the invoice",
    "Increase the retry count from three to ten so that one of the attempts eventually passes validation"
   ],
   "correct": 1,
   "explanation": "A blind resend gives the model the identical input that already failed, so it reproduces the same failure; retries become corrective only when the specific error is fed back as new information. Raising temperature is gambling on randomness rather than correction, and neither a bigger model nor more attempts tells the model what was wrong.",
   "hint": "A retry can only outperform the first attempt if it receives information the first attempt did not have.",
   "difficulty": "core",
   "tags": [
    "retry-loops",
    "validation"
   ]
  },
  {
   "q": "A healthcare intake pipeline extracts discharge_date from referral packets, and the validator requires the field. About 12% of packets are outpatient referrals that contain no discharge date at all; for those, the retry-with-feedback loop burns all five attempts, and the model sometimes fabricates a plausible date on attempt four or five just to satisfy the validator. What is the root-cause fix?",
   "options": [
    "Make discharge_date nullable and accept null as a valid result when the source omits it",
    "Add a 'do not invent dates that are not present in the document' warning to the system prompt and keep the field required",
    "Reduce the retry limit from five attempts to two so fewer tokens are wasted and fabrication gets fewer chances",
    "Route every packet that exhausts its five retries into a human review queue for manual data entry"
   ],
   "correct": 0,
   "explanation": "When the information is genuinely absent from the source, no number of retries can produce it, and a required field pressures the model toward fabrication. A nullable schema field fixes the root cause by making absence a legitimate, terminal answer. The prompt warning is a probabilistic patch on a deterministic schema flaw, fewer retries just fails faster, and human routing turns a design defect into a permanent operational expense for 12% of volume.",
   "hint": "Ask whether any retry could ever succeed when the source document simply does not contain the value.",
   "difficulty": "core",
   "tags": [
    "nullable-fields",
    "fabrication",
    "retry-loops"
   ]
  },
  {
   "q": "A logistics company extracts line items and a total from carrier freight invoices. On about 3% of invoices the printed total does not equal the sum of the line charges — carrier billing errors the audit team is paid to find. Today the validator rejects those extractions as model mistakes, and the retry loop pressures the model until the numbers agree. How should the design change?",
   "options": [
    "Keep a single total field and have post-processing overwrite whatever was extracted with the computed sum of the line items",
    "Capture stated_total and calculated_total as separate fields with a conflict_detected flag, treating flagged rows as valid",
    "Add a retry instruction telling the model to re-read the invoice as many times as needed until the two totals reconcile",
    "Remove the total field from the schema entirely and compute invoice totals downstream from the extracted line items"
   ],
   "correct": 1,
   "explanation": "A document that disagrees with itself is real data, not an extraction failure; the schema should preserve both the stated and the computed value with an explicit conflict flag so auditors see the discrepancy. Forcing reconciliation through retries or overwriting one value with the other destroys the billing errors the audit exists to catch, and dropping the total field entirely discards the printed total — without it there is nothing to compare the computed sum against, so the discrepancies vanish just the same.",
   "hint": "Sometimes a mismatch is the signal the business wants captured, not an error to retry away.",
   "difficulty": "core",
   "tags": [
    "conflict-detection",
    "schema-design"
   ]
  },
  {
   "q": "A CI pipeline runs claude -p to review pull requests. A 14-file PR fits comfortably in the context window at roughly 60k tokens, yet the review consistently produces detailed findings for the first four or five files and shallow or zero findings for the rest — even when humans later find real bugs in files 10 through 14. What is the most likely cause?",
   "options": [
    "The context window was silently truncated, so the later files were never actually delivered to the model",
    "Attention dilutes across a 14-file single pass, so files later in the prompt receive progressively shallower scrutiny",
    "The model classifies files appearing after the first few as test fixtures and automatically deprioritizes them",
    "The JSON output schema caps the number of findings, cutting off results before the later files are reported"
   ],
   "correct": 1,
   "explanation": "Fitting within the context window does not guarantee uniform scrutiny: a single pass over 14 files dilutes attention, and material later in the prompt gets shallower treatment. Truncation is ruled out because 60k tokens fits easily, the model has no built-in rule that demotes later files to test fixtures, and a schema cap would cut findings by count rather than consistently sparing the first files and starving the last ones. The fix points toward per-file review passes, not a bigger window.",
   "hint": "Fitting inside the context window is not the same as receiving equal scrutiny everywhere within it.",
   "difficulty": "core",
   "tags": [
    "attention-dilution",
    "code-review"
   ]
  },
  {
   "q": "A structured-extraction team submits a Message Batches job covering 8,000 archived support tickets, each request tagged with a custom_id. Results show 7,760 successes, 180 failures for exceeding the maximum request size, and 60 failures from intermittent server errors. What is the most efficient recovery?",
   "options": [
    "Resubmit the full 8,000-request batch from scratch, since the 50% batch discount makes a complete rerun affordable",
    "Resubmit all 240 failed requests unchanged as a new batch and repeat the resubmission until every request succeeds",
    "Use the custom_ids to isolate failures, chunk the 180 oversized tickets, and resubmit them plus the 60 transient ones",
    "Convert all 240 failed requests into synchronous API calls so an engineer can step through and debug each one interactively"
   ],
   "correct": 2,
   "explanation": "custom_id exists precisely so failures can be isolated and resubmitted without redoing completed work, and the two failure classes need different treatment: oversized requests fail deterministically and must be fixed before resubmission, while transient server errors can be retried as-is. Resubmitting all 240 unchanged guarantees the 180 oversized requests fail again, rerunning all 8,000 pays twice for finished work, and hand-debugging 240 requests synchronously forfeits the discount and the automation.",
   "hint": "Separate the failures that will recur deterministically from the ones that were just bad luck.",
   "difficulty": "core",
   "tags": [
    "batch-api",
    "custom_id",
    "retry-loops"
   ]
  },
  {
   "q": "A CI workflow has Claude Code generate a payment-reconciliation module, then prompts in the same session: 'Now critically review the code you just wrote for bugs.' The review almost always concludes the implementation looks correct, yet QA keeps finding logic errors in the merged code. Which change most improves bug detection?",
   "options": [
    "Strengthen the review prompt to 'act as a hostile senior reviewer and assume the code is broken until proven otherwise'",
    "Repeat the same-session review three times and take the union of all findings to compensate for individual misses",
    "Run the review in a separate session whose context contains only the diff, not the generation conversation",
    "Enable extended thinking on the same-session review so the model reasons more deeply before approving the code"
   ],
   "correct": 2,
   "explanation": "Same-session self-review keeps the generation reasoning in context, so the model tends to confirm the decisions it just made; an independent reviewer session sees only the artifact and evaluates it fresh. Harsher prompts and extended thinking still operate on top of the biased context, and repeating a biased review three times unions the same blind spots.",
   "hint": "Consider what the reviewer already believes when its context contains the reasoning that produced the code.",
   "difficulty": "core",
   "tags": [
    "independent-review",
    "ci-cd"
   ]
  },
  {
   "q": "An e-commerce team has finalized a new extraction prompt for product attributes and plans to submit all 10,000 legacy listings as a single Message Batch tonight. The prompt has only been eyeballed against two listings. A teammate objects to the plan. What should the team do before committing the full batch?",
   "options": [
    "Submit the full batch now — at the 50% discount, even a flawed run only costs as much as half a synchronous run",
    "Run a small synchronous pilot of around 50 representative listings, validate the outputs, then submit the full batch",
    "Submit the 10,000 listings as ten sequential batches of 1,000, checking each batch's results before sending the next",
    "Add a system-prompt instruction asking the model to double-check its own work, then submit all 10,000 tonight"
   ],
   "correct": 1,
   "explanation": "A small synchronous pilot gives immediate feedback on prompt quality before committing 10,000 jobs to a channel with no latency SLA. The staged sub-batch plan is the strongest distractor, but it still burns 1,000 unvalidated jobs on the first stage and waits up to 24 hours per checkpoint; the discount makes a bad run cheaper, not free, and a self-check instruction cannot validate outputs the team has never inspected.",
   "hint": "Compare how quickly each plan would reveal that the prompt is broken.",
   "difficulty": "hard",
   "tags": [
    "batch-api",
    "pilot-testing"
   ]
  },
  {
   "q": "A support-transcript pipeline flags messages that appear to contain payment card numbers, returning pii_flagged as true or false. Compliance reports a wave of false positives — 16-digit order IDs being flagged — but analysts cannot diagnose them because the output never indicates what triggered each flag. Which change best enables false-positive analysis?",
   "options": [
    "Add a detected_pattern field that records the exact text span and pattern type that triggered each flag",
    "Add a confidence score between 0 and 1 so analysts can filter out low-confidence flags before reviewing",
    "Tighten the flagging instructions in the prompt so that only unambiguous card numbers are ever flagged",
    "Have a second model re-check every flagged message and silently overwrite any flags it disagrees with"
   ],
   "correct": 0,
   "explanation": "Diagnosing false positives requires seeing what the model thought it matched; a detected_pattern field turns each flag into auditable evidence that analysts can classify as a true card number or an order ID. Self-reported confidence scores are poorly calibrated and explain nothing about the trigger, while prompt tightening and second-model overwrites change behavior without ever revealing why misfires occur — and silent overwrites hide the evidence entirely.",
   "hint": "Analysts cannot classify a misfire without seeing the evidence the model believed it found.",
   "difficulty": "core",
   "tags": [
    "detected_pattern",
    "false-positives",
    "schema-design"
   ]
  },
  {
   "q": "A fintech compliance pipeline must file a regulator-facing report by 9:00 AM daily. It submits the day's transactions as a Message Batch at 6:00 PM the prior evening; results usually land by midnight, but twice this month they arrived after 9:00 AM and the filing was late. Which redesign aligns the pipeline with the Batch API's actual guarantees?",
   "options": [
    "Poll the batch status every 30 seconds instead of every 10 minutes so results are fetched the instant processing finishes",
    "Split the nightly submission into four smaller batches, on the theory that smaller batches finish faster than one large one",
    "Open a support ticket asking Anthropic to enable a priority processing tier for this regulated nightly workload",
    "Schedule submission so the entire 24-hour window ends before 9:00 AM, with a synchronous fallback at a set cutoff"
   ],
   "correct": 3,
   "explanation": "The only timing guarantee batch offers is completion within 24 hours — typical midnight turnarounds are an observation, not a contract. A deadline-bound pipeline must fit the full 24-hour window inside its SLA and keep a synchronous escape hatch for stragglers. Faster polling only retrieves results sooner once they exist, batch size buys no latency guarantee, and no priority batch tier exists to request.",
   "hint": "Design around the only completion guarantee the Batch API actually makes, not its typical turnaround time.",
   "difficulty": "core",
   "tags": [
    "batch-api",
    "sla-planning"
   ]
  },
  {
   "q": "An insurance claims extraction service wraps its Claude calls in one retry loop. Logs reveal two failure modes handled identically with three immediate, unchanged resends: HTTP 529 overloaded errors, and schema-valid JSON that violates the rule that claim_amount must not exceed policy_limit. Neither mode improves across retries. What is the correct redesign?",
   "options": [
    "Apply exponential backoff to both failure modes, since waiting longer between attempts gives the model time to produce a better answer",
    "Treat both modes as terminal after a single attempt and route every failed claim directly into a human review queue",
    "Branch the handling: backoff-and-resend unchanged for the 529s; for rule violations, retry with the failed check stated in the prompt",
    "Raise both retry limits to ten attempts so transient capacity issues and rule violations alike eventually clear"
   ],
   "correct": 2,
   "explanation": "The two failures have different root causes and need different retry strategies: 529s are transient infrastructure errors where an unchanged resend after backoff succeeds, while business-rule violations are deterministic and improve only when the model is told exactly which check failed. Backoff applied to both is the strongest distractor, but waiting does not alter a deterministic output; giving up after one attempt forfeits recoverable transients, and more blind attempts change nothing.",
   "hint": "Match each retry strategy to whether the failure is transient infrastructure or a deterministic output problem.",
   "difficulty": "hard",
   "tags": [
    "retry-loops",
    "error-handling"
   ]
  },
  {
   "q": "After fighting attention dilution, a monorepo team redesigned its CI review so each file in a PR gets its own headless claude -p pass. Per-file bug detection improved sharply, but last week the pipeline approved a PR in which api-client.ts called an endpoint whose request shape had changed in routes.ts — each file was internally consistent on its own. What fixes the architecture?",
   "options": [
    "Return to a single pass over all files at once, since only one shared context can observe relationships between the files",
    "Enlarge each per-file pass so its prompt also includes the complete diff of every other file in the PR for reference",
    "Keep the per-file passes and add a final integration pass that checks cross-file contracts like call sites against changed signatures",
    "Require each per-file pass to emit an approval confidence score and block the merge whenever any file scores below 0.8"
   ],
   "correct": 2,
   "explanation": "Per-file passes maximize depth on local defects but are structurally blind to inter-file contracts, so the complement is a dedicated integration pass scoped to cross-file interactions. Reverting to one giant pass reintroduces the original attention dilution, stuffing every other diff into each per-file pass recreates that dilution per pass, and self-reported confidence scores are poorly calibrated and cannot reveal defects the pass never saw.",
   "hint": "Each review pass can only find defects that are visible within its own scope.",
   "difficulty": "hard",
   "tags": [
    "multi-pass-review",
    "code-review"
   ]
  },
  {
   "q": "A legal contract extraction pipeline retries with validation feedback up to six times. Telemetry shows 82% of contracts pass within two attempts, but 13% fail all six — and inspection reveals those contracts genuinely contain no governing-law clause. The feedback 'governing_law is missing, re-extract' just drives the model to fabricate jurisdictions on later attempts. What should the team change?",
   "options": [
    "Raise the attempt cap from six to ten so the stubborn 13% of contracts get more chances to converge",
    "Sharpen the retry feedback to list the exact contract sections where governing-law clauses conventionally appear",
    "Loosen the validator to accept any plausible jurisdiction string so the later attempts pass instead of failing",
    "Make governing_law nullable and treat a returned null as a terminal, valid outcome when the clause is absent"
   ],
   "correct": 3,
   "explanation": "Retry feedback only helps when the failure is recoverable; when the source lacks the clause, every extra attempt just increases fabrication pressure, so the schema must let the model report absence as a valid terminal answer. Sharper feedback is the strongest distractor, but no hint can locate a clause that does not exist, more attempts compound the waste, and loosening the validator institutionalizes fabricated jurisdictions in legal data.",
   "hint": "Before improving the retries, ask whether success is even possible for the failing 13%.",
   "difficulty": "hard",
   "tags": [
    "nullable-fields",
    "retry-loops",
    "fabrication"
   ]
  },
  {
   "q": "A media company summarizes each day's articles through the Batch API, submitting at 8:00 PM for a newsletter that ships at 8:00 AM. Results had arrived within three hours for months — until one night they had not arrived by 7:30 AM, the team panic-submitted a duplicate batch, and the newsletter shipped late and double-billed. What is the most robust redesign?",
   "options": [
    "Submit rolling batches as articles publish during the day, with a synchronous fallback for stragglers at a hard cutoff",
    "Keep the 8:00 PM submission but automatically submit a duplicate batch whenever results are not ready by 4:00 AM",
    "Keep the 8:00 PM submission and add a monitoring alert that pages the on-call engineer whenever results run late",
    "Move the entire workload to synchronous calls so every summary reliably completes within minutes of submission"
   ],
   "correct": 0,
   "explanation": "The pipeline was built on the typical three-hour turnaround, but the only guarantee is completion within 24 hours; submitting earlier in rolling waves keeps most volume at batch pricing while the synchronous cutoff handles whatever the window has not delivered. Going fully synchronous is the strongest distractor but forfeits the 50% discount on a workload that mostly fits the window, automated duplicate batches just systematize the double-billing incident, and paging a human changes nothing about when results arrive.",
   "hint": "A months-long streak of fast turnarounds is an observation, not a service guarantee.",
   "difficulty": "hard",
   "tags": [
    "batch-api",
    "sla-planning"
   ]
  },
  {
   "q": "A corporate expense-report extractor has a single total_amount field. The team discovers the model sometimes returns the arithmetically correct sum of the receipt lines instead of the different total the employee actually wrote — silently masking the addition errors finance is required to flag. An engineer proposes adding 'always copy the written total verbatim; never recalculate' to the prompt. Which approach best serves the finance requirement?",
   "options": [
    "Adopt the prompt instruction: always copy the written total verbatim and never recalculate from the line items",
    "Add post-processing that recomputes the sum from the extracted line items and overwrites total_amount for consistency",
    "Ask the model to output whichever total it judges more trustworthy, plus a free-text note explaining its choice",
    "Split the schema into stated_total and calculated_total fields with a conflict_detected flag for finance review"
   ],
   "correct": 3,
   "explanation": "The gap between the written total and the computed total is precisely the business signal, so the structure must preserve both values plus an explicit conflict flag. The prompt instruction is the strongest distractor, but it is probabilistic — and even when followed perfectly it hides the arithmetic error, because finance still needs the computed value to detect the mismatch. Overwriting with the recomputed sum erases the written total, and a free-text trust judgment is unparseable and unauditable.",
   "hint": "When two values can legitimately disagree, the output structure should be able to say so explicitly.",
   "difficulty": "hard",
   "tags": [
    "stated-vs-calculated",
    "conflict-detection",
    "schema-design"
   ]
  },
  {
   "q": "In a healthcare records batch, 600 of 12,000 requests failed with request-too-large errors because each embedded a full multi-year patient history. The on-call engineer correctly used custom_ids to isolate exactly those 600, resubmitted them unchanged in a new batch — and all 600 failed again with the identical error. What did the engineer miss?",
   "options": [
    "Request-too-large failures are deterministic — the oversized histories must be chunked or trimmed before any resubmission can succeed",
    "Resubmitted requests need fresh custom_ids, because the Batch API rejects custom_ids it has already processed once",
    "A model with a larger context window should have been selected, which raises the maximum request size the batch will accept",
    "The 600 requests should have been retried as synchronous calls, which accept larger payloads than batch requests do"
   ],
   "correct": 0,
   "explanation": "Targeted resubmission via custom_id was the right instinct, but only transient failures can be retried as-is; an unchanged oversized request exceeds the same limit on every attempt, so the payload itself must be fixed first. The custom_id reuse rule and the larger-payload mechanics in the other options are invented — none of them changes a request that is over the size limit.",
   "hint": "Resubmitting as-is only works when the cause of the failure can change between attempts.",
   "difficulty": "core",
   "tags": [
    "batch-api",
    "custom_id",
    "error-handling"
   ]
  }
 ],
 "floor-09": [
  {
   "q": "A fintech support agent handles a disputed charge of $147.23. The conversation runs 25 turns, and the agent uses progressive summarization to keep the history manageable. At turn 22 the agent offers the customer a refund of $47 — the exact figure has eroded through repeated summarization passes. What is the root-cause fix?",
   "options": [
    "Strengthen the summarization prompt with 'always preserve monetary amounts exactly as written' so figures survive each pass",
    "Disable summarization and rely on a model with a larger context window so the raw 25-turn history stays verbatim",
    "Keep exact figures, IDs, and dates in a structured case-facts block outside the summarized history",
    "Re-run the transaction lookup tool on every turn so the disputed amount is always freshly loaded in context"
   ],
   "correct": 2,
   "explanation": "Progressive summarization is lossy by design, so exact values must live in a structure that is never summarized. A case-facts block carried verbatim in every request guarantees $147.23 survives to turn 22. Prompting the summarizer to be careful is probabilistic best-effort, keeping the entire raw history merely trades erosion for mid-context burial and ever-growing cost, and re-running the lookup every turn wastes tokens while patching the symptom.",
   "hint": "Ask which data should be exempt from a lossy process rather than asking the lossy process to be careful.",
   "difficulty": "core",
   "tags": [
    "case-facts",
    "summarization",
    "context-management"
   ]
  },
  {
   "q": "A logistics operations agent calls a shipment-tracking tool that returns a 45-field JSON object per shipment, including carrier metadata, customs codes, and internal routing flags. The agent only ever uses status, ETA, and current location. Sessions tracking 30+ shipments hit context limits by mid-session. What should the architect do?",
   "options": [
    "Run /compact to summarize accumulated history each time the session approaches the context limit",
    "Add a PostToolUse hook that trims each result to status, ETA, and location before it enters history",
    "Instruct the agent in the system prompt to ignore irrelevant fields when reading tool results",
    "Upgrade to a model with a larger context window so the full 45-field payloads can accumulate safely"
   ],
   "correct": 1,
   "explanation": "Verbose tool outputs should be trimmed before they accumulate; a PostToolUse hook deterministically reduces each result to the needed fields at the source of the bloat. /compact is lossy and acts only after the damage is done, prompting the agent to 'ignore' fields removes zero tokens, and a larger window just delays the failure while raising cost.",
   "hint": "Reduce the tokens at the moment they enter context, not after they have piled up.",
   "difficulty": "core",
   "tags": [
    "context-management",
    "hooks",
    "tool-output-trimming"
   ]
  },
  {
   "q": "A healthcare intake assistant opens with a patient who reports three concerns: a billing question, a prescription refill, and a referral request. By turn 15 the assistant has resolved the billing question and closes the conversation, never addressing concerns #2 and #3. What design change fixes this reliably?",
   "options": [
    "Track the concerns in a structured issue list with per-item status, updated as each one closes",
    "Add a system prompt line: 'Always address every concern the patient raises before ending the conversation'",
    "Have the assistant ask the patient whether anything was missed before it closes the conversation",
    "Shorten the flow so all three concerns are handled within the first ten turns of the conversation"
   ],
   "correct": 0,
   "explanation": "Multi-issue conversations need an explicit issue list with status tracking that persists across turns, so open items are checked before the conversation closes. A prompt admonition is probabilistic and degrades exactly when the context grows long, and asking the patient to re-list their concerns shifts the burden onto the user while leaving the drift unfixed.",
   "hint": "Durable structured state beats a polite reminder when items must survive fifteen turns.",
   "difficulty": "core",
   "tags": [
    "issue-tracking",
    "context-management"
   ]
  },
  {
   "q": "A multi-agent research system's coordinator builds a 60k-token synthesis prompt: subagent findings concatenated chronologically, with the critical scope constraint ('only include peer-reviewed sources after 2020') stated once around token 30k, where it landed in sequence. The final report repeatedly cites blog posts from 2017. What change most directly fixes this?",
   "options": [
    "Increase the thinking budget so the model reasons more carefully over the full 60k tokens",
    "Rerun the synthesis on a model with a larger context window so the prompt fits more comfortably",
    "Append a final instruction line — 'double-check that every citation meets the scope constraint' — to the prompt",
    "Move the scope constraint and key summaries to the top of the prompt under clear headers"
   ],
   "correct": 3,
   "explanation": "This is the lost-in-the-middle effect: facts buried mid-context get missed even when the prompt fits comfortably in the window. Placing critical constraints and summaries at the top under clear headers puts them where attention is strongest. The larger-window option misdiagnoses the problem — nothing overflowed — and a trailing reminder still requires the model to attend to the buried constraint.",
   "hint": "The prompt fits in the window — think about where in the window the constraint sits.",
   "difficulty": "core",
   "tags": [
    "lost-in-the-middle",
    "context-management",
    "multi-agent"
   ]
  },
  {
   "q": "A telecom support agent is mid-troubleshooting when the customer types 'Stop. I want to talk to a real person.' The agent responds 'I understand, but let's try resetting your router first' and continues for four more turns before the customer abandons the chat. How should escalation be designed?",
   "options": [
    "Treat an explicit request for a human as an immediate escalation trigger, honored regardless of progress",
    "Escalate when the customer's sentiment score drops below a calibrated threshold across two consecutive turns",
    "Escalate after the agent's self-assessed confidence in resolution falls below 50 percent",
    "Escalate once the agent has exhausted its full troubleshooting runbook without resolving the issue"
   ],
   "correct": 0,
   "explanation": "An explicit human request is one of the reliable escalation triggers and must be honored immediately — continuing to troubleshoot past it destroys trust and drives abandonment. Sentiment and self-reported confidence are unreliable proxies, and waiting for runbook exhaustion is exactly the behavior that drove this customer away.",
   "hint": "One trigger in this list requires no inference at all — the customer stated it outright.",
   "difficulty": "core",
   "tags": [
    "escalation"
   ]
  },
  {
   "q": "An e-commerce support agent looks up a customer's orders for the last 30 days. The order-search tool returns an empty array, the agent's wrapper raises a SearchFailedError, and the agent retries the call five times before telling the customer 'our system is down.' The customer simply placed no orders that month. What is the correct design?",
   "options": [
    "Have the agent retry with progressively wider date ranges until at least one order is found",
    "The tool should return a structured success with results: [] and a zero count; the agent reports no orders in that window",
    "Catch the SearchFailedError and have the agent apologize and escalate to a human after the first failure",
    "Add a fallback that queries the data warehouse directly when the order-search tool returns nothing"
   ],
   "correct": 1,
   "explanation": "An empty result set is a valid successful outcome — zero matches — not an error. The wrapper conflating 'no rows' with 'failure' caused phantom retries and a false outage report. Widening the date range fabricates an answer to a question the customer did not ask, and escalating a non-error wastes human time on a working system.",
   "hint": "Distinguish 'the search ran and found nothing' from 'the search could not run.'",
   "difficulty": "core",
   "tags": [
    "zero-results",
    "tool-errors"
   ]
  },
  {
   "q": "A bank's support-agent team proposes escalating to humans whenever a sentiment classifier scores the customer below -0.6. In pilot, a furious customer demanding a routine card replacement is escalated within one turn, while a calm customer methodically describing unauthorized wire transfers totaling $18,400 is never escalated. What should the architects conclude?",
   "options": [
    "The sentiment threshold is miscalibrated; retrain the classifier on banking-domain transcripts and tune the cutoff",
    "Sentiment should be combined with message length and punctuation features to better approximate customer urgency",
    "Sentiment measures emotion, not case complexity; switch to triggers like policy gaps, no-progress loops, and explicit requests",
    "Both cases warrant escalation: lower the threshold further so calm-but-serious customers also cross the cutoff"
   ],
   "correct": 2,
   "explanation": "Sentiment is an unreliable escalation trigger because emotional tone does not correlate with case complexity or risk — the calm fraud victim is the proof. Retraining or tuning thresholds patches a proxy that measures the wrong thing entirely; reliable triggers are observable case properties such as policy gaps, no-progress loops, and explicit human requests.",
   "hint": "Ask what the signal actually measures versus what escalation is supposed to detect.",
   "difficulty": "hard",
   "tags": [
    "escalation",
    "sentiment"
   ]
  },
  {
   "q": "An insurance claims agent looks up 'Maria Garcia' and the policy-holder tool returns two records with different policy numbers and addresses. The agent silently picks the record with the more recent activity date and quotes a claim status — for the wrong Maria Garcia. What should the agent do instead?",
   "options": [
    "Always select the record whose creation date is older, since it is more likely the original account",
    "Merge the two records' fields and present a combined view so the agent never has to choose",
    "Refuse to proceed and escalate any lookup that returns more than one matching record to a human",
    "Ask the customer for an additional identifier — policy number, date of birth, or address — and re-query to disambiguate"
   ],
   "correct": 3,
   "explanation": "Duplicate matches must be disambiguated with additional identifiers before any account-specific action; silently picking by any heuristic guarantees wrong-customer errors. Merging records leaks one customer's data into another's view, and escalating every multi-match is unnecessary overhead when the agent can resolve the ambiguity with one question.",
   "hint": "When a key is ambiguous, the fix is to add another key, not pick a favorite.",
   "difficulty": "core",
   "tags": [
    "disambiguation",
    "customer-records"
   ]
  },
  {
   "q": "In a multi-agent research system, a subagent assigned to gather regulatory filings hits a paywall it cannot bypass and returns only the string 'Task failed.' The coordinator, with no usable information, re-dispatches the identical task three times, failing identically each time. What should the subagent have returned?",
   "options": [
    "A structured report: the paywalled source that failed, what was attempted, partial results gathered, and retryability",
    "Nothing — it should keep retrying internally until its iteration cap forces termination",
    "A confidence score on its partial findings so the coordinator can decide whether they are usable",
    "Its full raw session transcript so the coordinator can inspect every step and diagnose the failure itself"
   ],
   "correct": 0,
   "explanation": "Unresolvable failures must propagate with structured context — what failed, what was attempted, partial results, and whether retrying could help — so the coordinator can adapt by trying another source or accepting partial data instead of blind re-dispatch. A bare failure string and a raw transcript both lack actionable structure, and self-reported confidence scores are poorly calibrated.",
   "hint": "The coordinator can only recover as intelligently as the failure report allows.",
   "difficulty": "core",
   "tags": [
    "error-context",
    "multi-agent"
   ]
  },
  {
   "q": "A fintech document-extraction subagent processing 200 statements hits two failures: a 504 gateway timeout fetching one PDF, and an 'invalid credentials' error from the archival store for twelve older PDFs. It currently propagates both to the coordinator immediately, halting the entire batch. How should each failure be handled?",
   "options": [
    "Propagate both immediately — the coordinator owns all error handling and subagents should stay stateless",
    "Retry both locally with exponential backoff until they succeed or the iteration cap is reached",
    "Retry the 504 locally with backoff; propagate the credentials failure with context, since no retry will fix it",
    "Retry the credentials error locally — auth tokens often refresh — and propagate the 504 since timeouts indicate systemic load"
   ],
   "correct": 2,
   "explanation": "Transient errors like gateway timeouts should be recovered locally with retries, while unresolvable errors like invalid credentials must be propagated with context because retrying cannot fix them. The reversed pairing retries an auth failure that no backoff will repair — burning iteration budget and masking a problem only the coordinator or an operator can resolve — while needlessly escalating a one-off timeout.",
   "hint": "Sort the two failures by whether a retry could ever change the outcome.",
   "difficulty": "hard",
   "tags": [
    "retry",
    "error-handling",
    "multi-agent"
   ]
  },
  {
   "q": "A SaaS support platform's design review proposes that the agent append a self-assessed confidence score (0-100) to each turn, escalating when confidence drops below 60. Pilots show the agent reporting 85+ confidence while looping on an unresolvable licensing edge case, and 40 on questions it answers correctly. What is the right takeaway?",
   "options": [
    "Calibrate the scores post-hoc with a regression layer mapping reported confidence to observed accuracy",
    "Self-reported confidence is poorly calibrated; escalate on observable signals like no-progress loops and policy gaps instead",
    "Ask for confidence as a categorical (low/medium/high) instead of a number, since models handle categories better",
    "Average confidence across the last five turns to smooth out the noise before applying the threshold"
   ],
   "correct": 1,
   "explanation": "Model self-reported confidence is an unreliable escalation trigger because it is poorly calibrated — the pilot demonstrates exactly that, with high confidence during a hopeless loop. Reliable triggers are observable behaviors: no progress across turns, requests outside documented policy, explicit human requests. Calibration layers, smoothing, and rebucketing all keep depending on a signal that does not track reality.",
   "hint": "If the underlying signal does not track the truth, transformations of it will not either.",
   "difficulty": "hard",
   "tags": [
    "escalation",
    "confidence"
   ]
  },
  {
   "q": "A hospital intake agent maintains a structured case-facts block (allergies: penicillin; weight: 72 kg), exactly as the architecture guide recommends. The block was injected at turn 1, but by turn 30 it sits buried under 50k tokens of accumulated dialogue and tool results, and the agent suggests an amoxicillin prescription. The block's contents are intact and within the context window. What is the fix?",
   "options": [
    "Add a system prompt instruction telling the model to always consult the case-facts block before any medication suggestion",
    "Run /compact on the dialogue so the case-facts block becomes a larger share of the remaining context",
    "Expand the block with severity codes and timestamps so it stands out more in the context",
    "Re-inject the case-facts block at the top of every request under clear headers, not just at turn 1"
   ],
   "correct": 3,
   "explanation": "Maintaining a facts block is necessary but not sufficient — placement matters. Once buried mid-context under 50k tokens it suffers the lost-in-the-middle effect, so it must be re-injected at the top of each request with clear headers where attention is strongest. An instruction to 'consult the block' still points at a buried region, and compaction is lossy for everything else in the history.",
   "hint": "Having the facts in context is not the same as having them where the model attends.",
   "difficulty": "hard",
   "tags": [
    "lost-in-the-middle",
    "case-facts",
    "context-management"
   ]
  },
  {
   "q": "When a payments support agent escalates a suspected-fraud case, it forwards the entire 28k-token conversation transcript to the human fraud queue. Analysts report spending 8-10 minutes reconstructing each case before they can act, and sometimes miss that the agent already froze the card. What should the handoff contain?",
   "options": [
    "A structured summary: customer ID, the issue, what was already tried (card frozen), and a recommended action",
    "A model-generated narrative paragraph summarizing the conversation, replacing the transcript entirely in the queue",
    "Only the last ten turns of the transcript, since the most recent exchanges are most relevant to the analyst",
    "The full raw transcript plus an urgency score so analysts can triage which cases to read and act on first"
   ],
   "correct": 0,
   "explanation": "Escalation handoffs should carry a structured summary — customer ID, issue, actions already taken, recommended next action — so the human can act immediately without reconstruction; missing the card freeze is a direct symptom of an unstructured handoff. A freeform narrative loses guaranteed fields, and the last ten turns can omit early actions like the freeze entirely.",
   "hint": "The analyst needs specific fields guaranteed present, not more or fewer raw tokens.",
   "difficulty": "core",
   "tags": [
    "escalation",
    "handoff"
   ]
  },
  {
   "q": "A Claude Code session navigating a 4,000-file monorepo degrades after an hour: every Grep over the vendored directory returns hundreds of matches, and the team currently runs /compact every 20 minutes, after which Claude re-asks questions it had already answered. The team debates compacting even more aggressively. What is the better approach?",
   "options": [
    "Run /compact every 10 minutes instead of 20, before the noisy search results have time to accumulate",
    "Start a fresh session every hour and paste in a manually written summary of the progress so far",
    "Stop the bloat at its source: exclude vendored paths from searches and delegate verbose exploration to subagents",
    "Add a CLAUDE.md note instructing Claude to disregard matches from vendored directories when reasoning"
   ],
   "correct": 2,
   "explanation": "Compaction is lossy — re-asking already-answered questions is the evidence — so compacting more often just loses information sooner. The root cause is verbose, low-value output entering context in the first place; scoping searches and pushing exploration into subagents with isolated context means there is little left to compact. The CLAUDE.md note leaves all the tokens in context and merely asks the model to ignore them.",
   "hint": "Compare removing tokens before they accumulate with summarizing them after the damage is done.",
   "difficulty": "hard",
   "tags": [
    "context-management",
    "compaction",
    "subagents"
   ]
  },
  {
   "q": "An e-commerce refund agent's policy document covers refunds up to $500 with documented approval rules. A customer requests $612 for a damaged appliance; the policy says nothing about amounts above $500. The agent spends nine turns re-reading the policy and asking the customer clarifying questions, making no progress. What should the agent's design dictate here?",
   "options": [
    "Deny the refund, since no policy rule authorizes amounts above $500 and the agent must not exceed its mandate",
    "Recognize the policy gap as a reliable escalation trigger and hand off promptly with a structured case summary",
    "Approve up to the documented $500 cap and tell the customer to file separately for the remaining $112",
    "Continue clarifying with the customer until the request can be reframed to fit within an existing policy rule"
   ],
   "correct": 1,
   "explanation": "A request falling outside documented policy is a policy gap — one of the reliable escalation triggers — and the nine-turn no-progress loop is a second reliable trigger pointing the same direction. Denying or partially approving invents policy the agent was never given, and reframing the request manufactures a fit that does not exist.",
   "hint": "When the rulebook is silent, the agent's job is not to write a new rule.",
   "difficulty": "hard",
   "tags": [
    "escalation",
    "policy-gap"
   ]
  }
 ],
 "floor-10": [
  {
   "q": "A developer has been working with Claude Code on a 40-package monorepo for five hours straight. Early in the session the agent cited exact file paths and line numbers; now it says things like \"this service typically follows the standard repository pattern\" and proposes an edit to a helper function that does not exist. What is the most likely explanation?",
   "options": [
    "Anthropic silently routed the session to a smaller model under load, reducing answer quality and recall of specifics midway through the session",
    "Hours of accumulated verbose tool output are degrading recall — vague generalities and invented specifics are classic long-session degradation",
    "The project CLAUDE.md was evicted from the prompt cache, so the team's coding conventions are no longer visible to the model in later turns",
    "The developer's recent prompts have grown too short, leaving the model without enough instruction to stay specific about files and line numbers"
   ],
   "correct": 1,
   "explanation": "Multi-hour sessions accumulate verbose tool output that buries the specifics the model once cited precisely; the telltale symptom is a shift from exact citations to vague generalities and invented details. The remedy is context hygiene (scratchpads, /compact, subagent delegation). Claude Code does not silently swap models mid-session, and prompt-cache eviction affects cost and latency, not what is present in context.",
   "hint": "Ask what changes about a session's answer quality as hours of verbose tool output pile up in one context.",
   "difficulty": "core",
   "tags": [
    "context-degradation",
    "long-sessions"
   ]
  },
  {
   "q": "An expense-report extraction system shows 97% field-level accuracy on its aggregate dashboard, but the finance team keeps escalating wrong totals from handwritten receipts, which make up 4% of volume. Engineering points out that 97% comfortably exceeds the 95% SLA. What is the flaw in that reasoning?",
   "options": [
    "The SLA threshold is simply set too low; raising the aggregate accuracy target from 95% to 99% would force the handwritten receipt problem to surface on the dashboard",
    "A measured 97% is statistically indistinguishable from the 95% floor at this volume, so the system may already be violating the SLA without anyone noticing",
    "Aggregate accuracy masks per-segment failure — receipts may be failing badly while printed invoices carry the average; validate accuracy per document type and field",
    "The finance team is anchoring on rare anecdotes; at 97% field accuracy some visible errors are statistically expected and remain acceptable under the SLA"
   ],
   "correct": 2,
   "explanation": "A 4% segment can fail almost completely while the blended average stays above target — near-perfect printed invoices plus badly failing handwritten receipts still averages around 97%. The governing rule is per-segment validation by document type and field; raising the aggregate target is a patch that still cannot localize which segment is broken, and the escalations are a systematic segment failure, not anecdotal noise.",
   "hint": "A small segment can fail almost completely without moving a blended average below its target.",
   "difficulty": "core",
   "tags": [
    "per-segment-validation",
    "evaluation"
   ]
  },
  {
   "q": "A media company is running an 8-hour Claude Code session migrating 200 analytics reports to a new SQL dialect. The context keeps filling with thousands of lines of grep output and test logs, and by hour four the agent's answers turn slow and generic. Which working pattern addresses the root cause?",
   "options": [
    "Raise max_tokens on every request so the model has more room to reason over the long accumulated history of the session",
    "Switch the session over to Claude Opus, since its deeper reasoning capacity handles long accumulated contexts without degrading",
    "Restart the session every hour and paste the previous transcript into the new session as a primer to maintain continuity",
    "Persist findings to scratchpad files, run /compact at phase boundaries, and delegate verbose exploration to subagents"
   ],
   "correct": 3,
   "explanation": "The root cause is verbose intermediate output bloating the main context: scratchpad files externalize durable facts, /compact condenses at milestones, and subagents keep noisy exploration in isolated contexts so raw logs never enter the main session. max_tokens governs output length rather than input degradation, switching models does not stop context bloat from degrading recall, and pasting an old transcript into a fresh session simply reimports the bloat.",
   "hint": "The cure is keeping verbose intermediate output out of the main context, not making the context or the model bigger.",
   "difficulty": "core",
   "tags": [
    "scratchpad",
    "compact",
    "subagents"
   ]
  },
  {
   "q": "A research swarm gathering electric-vehicle market data flags a \"source conflict\": one finding says global EV sales were 10.5M units, another says 17.3M. Investigation shows the first comes from a 2023 report and the second from a 2025 report — and the synthesizer had discarded both figures as unreliable. What fixes this?",
   "options": [
    "Add a reconciliation step that averages the numeric claims whenever any two sources disagree by more than 20%, then report the blended figure",
    "Rank the sources by domain authority and keep only the figure that comes from the higher-authority publication, discarding the other",
    "Tighten the scout prompts so they only collect market figures published within the last 12 months, keeping the dataset current",
    "Capture publication dates as temporal metadata on every claim, so figures from different years read as a time series, not contradictions"
   ],
   "correct": 3,
   "explanation": "Figures measured at different times are not contradictions — they are data points about a changing quantity, and carrying temporal metadata through synthesis prevents false-conflict detection while preserving trend information. Averaging fabricates a number no source ever reported, authority ranking discards a valid historical data point, and restricting collection to recent sources throws away exactly the history trend analysis needs.",
   "hint": "Two correct measurements of a changing quantity can differ for a reason that a piece of metadata captures.",
   "difficulty": "core",
   "tags": [
    "temporal-metadata",
    "synthesis"
   ]
  },
  {
   "q": "A healthcare patient-intake system extracts 14 fields from 6,000 faxed forms daily; medication dosage and allergy fields are safety-critical. Reviewing every form by hand costs too much, and a 5% random spot-check let a dosage error through last month. How should human review be routed?",
   "options": [
    "Route forms to human review whenever the model's overall document-level confidence score falls below a fixed 0.8 threshold",
    "Route a fixed 20% random sample to review, weighted toward forms received outside business hours when fax quality is at its worst",
    "Route on deterministic field-level signals — null dosage or allergy values, schema failures, or out-of-range dosage units trigger human review",
    "Re-extract every form a second time with the same model and prompt, and route to human review only the forms where the two passes disagree on any field"
   ],
   "correct": 2,
   "explanation": "Review capacity should concentrate where errors are costly: deterministic per-field validation on the safety-critical fields (nulls, schema failures, out-of-range values) catches the dangerous cases. A document-level confidence score is poorly calibrated and can stay high even when one critical field is wrong — the same masking problem as aggregate accuracy. Bigger random samples spend budget on harmless fields, and double extraction doubles cost while missing systematic errors the model makes identically both times.",
   "hint": "The unit of risk in this pipeline is the field, not the document.",
   "difficulty": "hard",
   "tags": [
    "human-review",
    "field-validation"
   ]
  },
  {
   "q": "An overnight multi-agent research coordinator fans out 60 subagent tasks over roughly seven hours. A crash at hour five currently forces rerunning everything, wasting about $90 of API spend per incident. The team is debating recovery designs. Which is best?",
   "options": [
    "Enable 1-hour prompt caching on the coordinator's stable prefix so a restarted run reuses the cached work and skips already-completed reasoning",
    "Append each completed subagent's task id, status, and structured findings to a manifest; a restarted coordinator loads it and dispatches only incomplete tasks",
    "Persist the coordinator's full message history to disk every 10 minutes and on restart replay the conversation from the most recent snapshot to continue work",
    "Wrap every subagent call in retry-with-backoff so transient failures never surface and coordinator crashes become effectively impossible to hit"
   ],
   "correct": 1,
   "explanation": "A manifest recording completed task ids plus their structured findings is the minimal durable state needed to resume: restart logic deterministically skips finished work and re-dispatches only the rest. Replaying full message history restores bloated context and a fragile transcript rather than clean state, prompt caching is a cost optimization that holds no completion state, and retries handle transient tool errors but cannot make process crashes impossible.",
   "hint": "Ask what minimal durable state lets a freshly started coordinator know exactly which work is already done.",
   "difficulty": "hard",
   "tags": [
    "crash-recovery",
    "manifests",
    "multi-agent"
   ]
  },
  {
   "q": "An insurance claims extraction system has run in production for six months, and the team wants to detect quality drift as claim formats evolve. One engineer proposes dashboarding the model's self-reported confidence over time and alerting when the average drops. What is the better approach?",
   "options": [
    "Human-review a stratified random sample of production outputs across claim types on a regular cadence and track per-segment accuracy",
    "Build the confidence dashboard as proposed but alert on the median score rather than the mean to reduce the noise from outlier extractions",
    "Re-run last quarter's evaluation set against the model monthly; if accuracy on it holds steady, the production system has not drifted",
    "Add a second model that grades every extraction and alert whenever the two models disagree with each other more often than usual"
   ],
   "correct": 0,
   "explanation": "Self-reported confidence is poorly calibrated — the model can be confidently wrong, and drift often appears precisely where confidence stays high — so ground-truthing a stratified random sample of current traffic is the reliable signal. Re-running a frozen evaluation set fails because production drift comes from the inputs changing: new claim formats never enter a static test set. A second model's disagreement rate is not ground truth either, and shared blind spots pass silently.",
   "hint": "Drift detection needs ground truth on current real traffic, not the model's opinion of its own work.",
   "difficulty": "core",
   "tags": [
    "stratified-sampling",
    "drift",
    "monitoring"
   ]
  },
  {
   "q": "You are designing a multi-agent competitive-intelligence system: Haiku scouts gather facts and a Sonnet synthesizer writes the final report. Compliance requires that every claim in the report be traceable to a specific source document. Which design satisfies this requirement?",
   "options": [
    "Instruct the synthesizer in its system prompt that every claim included in the final report must cite the specific source document from which it came",
    "Log every URL each scout fetches during research and attach the complete list of fetched sources to the report as a reference appendix",
    "Have scouts bind each claim to its source and date in structured findings, and require synthesis to carry those claim-source mappings into its output",
    "Run a post-hoc verification agent that searches the web for a supporting source document for each claim that appears in the finished report"
   ],
   "correct": 2,
   "explanation": "Provenance survives only when claim-source mappings are first-class structured data at every stage — scouts emit them and the synthesis stage is required to preserve them through to the final output. A prompt instruction is probabilistic best-effort, a URL appendix cannot tie a specific claim to a specific source, and post-hoc re-sourcing finds a plausible source rather than the one actually used.",
   "hint": "Traceability has to be carried through every stage as data, not reconstructed after the fact.",
   "difficulty": "core",
   "tags": [
    "provenance",
    "claim-source"
   ]
  },
  {
   "q": "An e-commerce catalog-enrichment agent processes 3,000 product listings in one long-running session. After a crash at item 1,900, the restarted agent began again at item 1 and double-wrote records into the catalog database. What fixes the recovery problem?",
   "options": [
    "Maintain a structured manifest of item ids, per-item status, and partial results as items complete, so restarts resume from the manifest",
    "Persist the full conversation transcript to disk continuously and on restart replay it through the model so the agent recalls where it stopped",
    "Add a system-prompt instruction telling the agent to keep careful track of which catalog items it has already finished processing",
    "Split the run into 30 separate sessions of 100 items each so that any single crash costs at most 100 items of repeated work"
   ],
   "correct": 0,
   "explanation": "Durable progress state belongs in a structured manifest outside the model's context: restart logic reads it deterministically and resumes only pending items, eliminating both rework and double writes. Replaying a transcript is slow and reconstructs bloated context rather than state, a prompt instruction dies with the crashed session, and chunking merely shrinks the blast radius while a crash mid-chunk still double-writes.",
   "hint": "Recovery state should live in a deterministic artifact outside the model's context, not in its memory.",
   "difficulty": "core",
   "tags": [
    "crash-recovery",
    "manifests"
   ]
  },
  {
   "q": "A market-research synthesizer holds three findings on subscriber churn for the same vendor: Source A (2024 annual report) says 12%, Source B (March 2026 analyst note) says 8%, and Source C (April 2026 industry survey) says 15%. The current pipeline averages them and reports \"11.7% churn\". How should synthesis present this instead?",
   "options": [
    "Flag all three findings as a three-way contradiction and exclude churn from the report entirely until a fourth source can break the tie",
    "Report 8% as the definitive figure because Source B is the most recent analyst-grade source, moving the other two figures into footnotes",
    "Treat A as an earlier dated measurement, and present B and C as a genuine current conflict, both with attribution, dates, and method notes",
    "Drop A as stale, then average B and C to report approximately 11.5% current churn alongside a caveat about the recency of the underlying data"
   ],
   "correct": 2,
   "explanation": "Temporal metadata separates the two cases: a 2024 figure differing from 2026 figures is history, not conflict, while two contemporaneous 2026 sources disagreeing is a genuine conflict that must be preserved with attribution so readers see the disagreement. Averaging B and C still fabricates a number no source reported, and crowning the most recent source silently adjudicates a real methodological dispute.",
   "hint": "Sort the disagreements by time first — only same-period disagreements are true conflicts, and those must stay visible.",
   "difficulty": "hard",
   "tags": [
    "temporal-metadata",
    "conflicting-claims"
   ]
  },
  {
   "q": "A support resolution agent for an electronics retailer handles long multi-issue conversations, with the platform progressively summarizing older turns to control context size. After several summarization passes, the agent quoted a customer an RMA number and a refund amount of $214.50 that were both slightly wrong — even though both appeared correctly back in turn 12. What is the best fix?",
   "options": [
    "Stop summarizing conversations entirely and let each one run until the context window fills, forcing the platform to open a new session",
    "Prompt the summarizer to preserve all numbers, identifiers, and dollar amounts exactly as originally written when condensing the older turns",
    "Summarize less aggressively — keep the most recent 100 turns verbatim and only condense the conversation history beyond that point",
    "Keep a structured case-facts block (order ids, RMA numbers, amounts, commitments) outside the summarized history, always included verbatim"
   ],
   "correct": 3,
   "explanation": "Progressive summarization is lossy by nature and each pass further erodes exact identifiers and figures, so load-bearing facts must live in a structured block that never enters the compressor. Prompting the summarizer to be careful cannot make lossy compression lossless, summarizing later only delays the same erosion, and never summarizing trades drift for hard context exhaustion.",
   "hint": "Lossy compression plus a be-careful instruction is still lossy — decide what should never enter the compressor at all.",
   "difficulty": "hard",
   "tags": [
    "progressive-summarization",
    "case-facts",
    "context-management"
   ]
  },
  {
   "q": "A multi-agent due-diligence system has its coordinator spawn eight research subagents, each returning two to three paragraphs of prose findings. The coordinator's merged brief keeps dropping specific figures and attributing facts to the wrong company. What is the root-cause fix?",
   "options": [
    "Define a structured schema for subagent returns — entity, claim, source, date, confidence — so the coordinator aggregates typed records",
    "Increase the coordinator's extended-thinking budget so it reasons more carefully when reconciling the eight overlapping prose summaries",
    "Reduce the fan-out from eight subagents down to four so the coordinator has fewer overlapping prose summaries it needs to reconcile",
    "Require each subagent to end its prose findings with a bulleted recap listing its key figures and the company names they belong to"
   ],
   "correct": 0,
   "explanation": "Coordinators aggregate reliably when subagent results arrive as structured, typed records; free prose forces the coordinator to re-extract facts, which is exactly where figures get dropped and attributions get crossed. More thinking budget patches the symptom while leaving the lossy interface in place, fewer subagents risks coverage gaps, and a recap is still unstructured text with the same parsing risk.",
   "hint": "Look at the interface between subagents and coordinator — what return format makes aggregation lossless?",
   "difficulty": "core",
   "tags": [
    "structured-output",
    "subagents",
    "multi-agent"
   ]
  },
  {
   "q": "A legal-contracts extraction service runs monthly QA by reviewing the 200 extractions where the model reported the lowest confidence; sampled accuracy has held steady near 91% for three quarters. A client audit then finds a 22% error rate on a new contract template introduced in March — which the model processes with high confidence. Why did QA miss it, and what fixes it?",
   "options": [
    "Confidence-based sampling never inspects high-confidence outputs, so confidently wrong work stays invisible; switch to stratified random sampling by contract type",
    "The monthly sample of 200 lacks statistical power for rare failure modes; quadruple it to 800 low-confidence extractions to catch the rarer failures",
    "The confidence threshold needs recalibration so extractions from the new template score lower and start entering the existing QA review pool",
    "Add the new template to the regression evaluation set and gate future deployments on passing it, while keeping the QA sampling process unchanged"
   ],
   "correct": 0,
   "explanation": "Sampling conditioned on the model's own confidence systematically excludes the most dangerous failure mode — high-confidence errors — which is exactly where the new template's failures lived; stratified random sampling reviews every segment regardless of the model's self-assessment. Enlarging a pool that is still confidence-filtered keeps the blind spot, and recalibrating confidence or adding one template to a regression set patches this instance while leaving the next confidently-wrong segment undetectable.",
   "hint": "A QA pool filtered by the model's self-assessment can never contain the errors the model does not know it is making.",
   "difficulty": "hard",
   "tags": [
    "stratified-sampling",
    "drift"
   ]
  },
  {
   "q": "In a research system, scouts already return structured findings with claim text, source id, and retrieval date. Yet the final report — written by a synthesizer prompted to produce \"a polished executive narrative, citing sources\" — regularly contains untraceable claims: about 30% of spot-checked statements match no source id in any scout's output. What is the root-cause fix?",
   "options": [
    "Strengthen the synthesizer prompt so that every sentence must include a bracketed source id and nothing may be stated without a matching citation",
    "Make synthesis emit each claim as a structured record carrying its source ids, validated against the scouts' finding set before the narrative renders",
    "Lower the synthesizer's temperature to 0 so the narrative stays closer to the scouts' original wording and introduces fewer unsourced claims",
    "Add a final Haiku pass over the narrative that deletes any sentence lacking a bracketed citation before the finished report ships to readers"
   ],
   "correct": 1,
   "explanation": "Provenance dies at the one stage that converts structured data into free prose, so the fix is making synthesis itself produce structured claim records whose source ids can be programmatically validated against the scouts' findings before rendering. A stricter prompt is still probabilistic — the model can bracket fabricated ids — temperature does not prevent fabrication, and a deletion pass removes uncited sentences without catching plausible-but-wrong citations.",
   "hint": "Find the stage where structured data turns into free prose — that is where provenance is lost.",
   "difficulty": "hard",
   "tags": [
    "provenance",
    "structured-output",
    "synthesis"
   ]
  },
  {
   "q": "A healthcare-policy research agent finds two 2026 peer-reviewed studies reporting different readmission rates for the same procedure: 11% and 19%. The synthesis step currently outputs \"approximately 15%\", and a clinician reviewer has called the report untrustworthy. What should the synthesis do instead?",
   "options": [
    "Output a range of 11-19% without naming the individual studies, since a range communicates the uncertainty more honestly than any single point estimate",
    "Present both figures with explicit source attribution, study dates, and methodological context, so the disagreement itself is visible to the reader",
    "Spawn a tie-breaker subagent to find a third study and report whichever readmission figure wins majority support across the three sources",
    "Report the figure from the study with the larger sample size as primary and relegate the other study's result to a footnote in the report"
   ],
   "correct": 1,
   "explanation": "When credible contemporaneous sources genuinely conflict, synthesis must preserve both claims with attribution — averaging manufactures a figure no study reported, and an unattributed range destroys traceability while hiding that experts disagree. Majority voting and sample-size heuristics make the system silently adjudicate a scientific dispute it is not equipped to judge.",
   "hint": "When sources genuinely disagree, the disagreement is information the reader needs, not noise to smooth away.",
   "difficulty": "core",
   "tags": [
    "conflicting-claims",
    "attribution"
   ]
  }
 ],
 "exam-mix-1": [
  {
   "q": "A customer support resolution agent built on the Claude API runs an agentic loop. The implementation scans each assistant response for the phrase \"Ticket resolved\" to decide when to stop, and caps the loop at 4 iterations as its primary completion control. Tickets sometimes close while the agent still had a pending tool call, and complex tickets get cut off mid-investigation. Which change fixes the loop?",
   "options": [
    "Raise the iteration cap to 12 and require the agent to print TICKET RESOLVED in capital letters on its own line before the loop is allowed to exit",
    "Set tool_choice to \"any\" on every request so the agent always calls a tool and the loop can never end prematurely on a text-only response",
    "Drive the loop off stop_reason — continue on \"tool_use\" by executing tools and resending history, finish on \"end_turn\" — keeping the cap as a safety fallback",
    "Treat any response containing a text block as the final answer and end the loop there, on the assumption that tool-calling turns contain only tool_use blocks"
   ],
   "correct": 2,
   "explanation": "The loop's control signal is stop_reason, not assistant prose: \"tool_use\" means execute and continue, \"end_turn\" means done, and iteration caps are safety fallbacks rather than primary controls. Parsing text for a completion phrase is unreliable, and ending on any text block fails because responses can legitimately contain text and tool_use blocks together. Forcing tool_choice \"any\" prevents the loop from ever ending naturally, and raising the cap just patches the same broken signal.",
   "hint": "The API already gives you a machine-readable completion signal — do not infer completion from prose.",
   "difficulty": "core",
   "tags": [
    "d1",
    "stop_reason",
    "agent-loop"
   ]
  },
  {
   "q": "A fintech team extracts fields from 80,000 vendor invoices. Their schema marks vendor_tax_id as a required string, and spot checks show the model invents plausible-looking tax IDs for the roughly 12% of invoices that have none. The team's plan is to add \"NEVER fabricate tax IDs\" to the prompt and submit all 80,000 documents to the Batch API tonight. As the reviewing architect, what do you change?",
   "options": [
    "Make vendor_tax_id nullable (type [\"string\",\"null\"]) so absence is representable, and run a synchronous pilot on a sample before submitting the full batch",
    "Keep the required field but strengthen the prompt warning with concrete examples of fabricated IDs, then submit the full batch tonight to capture the 50% discount",
    "Split the 80,000 invoices into eight sequential overnight batches so fabricated IDs are easier to localize, and schedule a manual cleanup pass once all results return",
    "Switch the field to an enum of known tax ID formats with a catch-all pattern, and add a retry pass for any invoice the model flags as uncertain"
   ],
   "correct": 0,
   "explanation": "A required field forces the model to produce a value even when none exists, so fabrication here is a schema design flaw — a nullable field lets the model return null instead of inventing data. Piloting a sample synchronously before a massive batch run is the standard guard against burning a 24-hour cycle on a flawed configuration. Prompt warnings are probabilistic patches, splitting batches localizes bad output without preventing any of it, and self-reported uncertainty is too poorly calibrated to drive a retry pass.",
   "hint": "Ask whether the schema even allows the model to say a field is absent — and what you should validate before committing a huge batch.",
   "difficulty": "hard",
   "tags": [
    "d4",
    "schemas",
    "batch-api"
   ]
  },
  {
   "q": "A multi-agent research system answers \"How are EU battery manufacturers responding to the 2026 subsidy changes?\" The coordinator spawns 14 subagents, each scoped to a single manufacturer's press releases. The final report misses industry-wide patterns entirely, and when two subagents report contradictory capacity figures, nobody can tell which publication or date each figure came from. What is the best architectural fix?",
   "options": [
    "Keep the 14 single-manufacturer tasks but add a fifteenth subagent whose only job is to detect contradictions and delete the less credible figure from the report",
    "Re-scope to fewer, broader subagent tasks that can surface cross-cutting trends, and require each subagent to return claim-source mappings with publication dates",
    "Let subagents exchange findings directly with one another during research so contradictions get reconciled before the coordinator runs its aggregation pass",
    "Increase to 28 subagents covering component suppliers as well, giving the coordinator more raw material from which to infer industry-wide patterns"
   ],
   "correct": 1,
   "explanation": "Overly narrow decomposition causes coverage gaps — single-manufacturer scopes cannot surface cross-cutting trends — and synthesis without claim-source mappings plus dates loses provenance, making contradictions unresolvable. The fix addresses both flaws: broader task scoping and provenance metadata flowing back to the coordinator. Direct subagent-to-subagent exchange fails because inter-subagent traffic routes through the coordinator, and deleting conflicting claims discards information that attribution and temporal metadata would resolve.",
   "hint": "Two separate design flaws are present — one in how the work was sliced, one in what the subagents hand back.",
   "difficulty": "hard",
   "tags": [
    "d1",
    "multi-agent",
    "provenance"
   ]
  },
  {
   "q": "A support resolution agent built with the Claude Agent SDK has an issue_refund tool. The system prompt says refunds over $200 require human approval, yet last week it refunded $450 unprompted. Separately, transcripts show that when customers type \"let me talk to a person,\" the agent keeps troubleshooting for several more turns. Which combination fixes both failures at the root?",
   "options": [
    "Move the $200 limit to the very top of the system prompt in emphatic language, and add a sentiment classifier that escalates whenever customer frustration crosses a threshold",
    "Add a PostToolUse hook that detects refunds over $200 after they execute and files a reversal ticket, and prompt the agent to weigh its own confidence before escalating",
    "Lower the model temperature so the refund policy is followed more consistently, and add few-shot example transcripts demonstrating graceful handoffs to a human agent",
    "Add a PreToolUse hook that blocks issue_refund calls over $200 via exit code 2, and treat an explicit human request as an immediate escalation trigger"
   ],
   "correct": 3,
   "explanation": "Critical business rules like refund caps belong in deterministic PreToolUse hooks, which gate the call before it executes and feed the blocking reason back to the model — prompts are probabilistic and will eventually be ignored. Explicit human requests are a reliable escalation trigger that must be honored immediately, while sentiment is unreliable because sentiment does not equal complexity. The PostToolUse option fails because it cleans up after the violating refund has already gone through.",
   "hint": "One enforcement mechanism here is a guarantee and one is best-effort — and recall which escalation triggers are considered reliable.",
   "difficulty": "hard",
   "tags": [
    "d3",
    "hooks",
    "escalation"
   ]
  },
  {
   "q": "An invoice extraction agent calls a lookup_vendor tool to match extracted names against the vendor master database. When a vendor is missing, the tool returns the bare string \"Operation failed\", and the agent retries the identical lookup five times before abandoning the whole document. New vendors appear daily, so a missing match is a routine outcome. What should change?",
   "options": [
    "Return zero-match lookups as successes with an empty result set, and reserve errors for real failures with errorCategory, isRetryable, the attempted query, and alternatives",
    "Add a system prompt rule that the agent may retry any failing tool at most once, and treat \"Operation failed\" as a signal to leave the vendor field blank",
    "Wrap lookup_vendor in a PreToolUse hook that caches recent failures and blocks any repeat call carrying the same arguments within a single session",
    "Have the tool raise a typed VendorNotFound exception so the SDK surfaces a full stack trace the model can read and reason about before retrying"
   ],
   "correct": 0,
   "explanation": "An empty result set is a success with zero matches, not an error — returning it as a failure tells the model something went wrong and invites pointless retries. Genuine failures need structured errors (errorCategory, isRetryable, the attempted query, suggested alternatives) so the model can act intelligently instead of guessing. The hook-based retry blocker suppresses the symptom while the tool keeps misreporting what actually happened, and a stack trace still frames a routine outcome as a failure.",
   "hint": "Consider whether \"no match found\" is actually an error from the tool's point of view.",
   "difficulty": "hard",
   "tags": [
    "d2",
    "tool-errors",
    "retries"
   ]
  },
  {
   "q": "A six-engineer research swarm team uses an internal papers-search MCP server. Each engineer configured it by hand in ~/.claude.json, the nightly CI runner has no MCP config at all, and one teammate just pasted the literal API token into a draft .mcp.json to share it. What is the correct way to share this server across the team and CI?",
   "options": [
    "Commit each engineer's ~/.claude.json into the repository so the CI runner and new teammates inherit identical MCP server settings automatically",
    "Use local scope for the server in every clone, and circulate the API token through the team password manager for each person to enter manually",
    "Check a project-scope .mcp.json into the repository with the token referenced via ${ENV_VAR} expansion, supplied separately by each environment",
    "Keep the user-scope configs but add a SessionStart hook that downloads the latest server definition and current token from an internal wiki page"
   ],
   "correct": 2,
   "explanation": "Project-scope .mcp.json is the version-controlled, team-shared configuration surface, and ${ENV_VAR} expansion keeps secrets out of the repo while letting laptops and the CI runner each supply their own token. User scope (~/.claude.json) is for personal experimentation and is never committed, local scope is deliberately project-personal and uncommitted, and pulling a live token from a wiki page is both fragile and a secrets-handling violation.",
   "hint": "Match each MCP config scope to its intended audience, and remember what must never be committed as a literal value.",
   "difficulty": "core",
   "tags": [
    "d2",
    "mcp-config",
    "secrets"
   ]
  },
  {
   "q": "A support agent has three tools — get_order, fetch_order_info, and order_details — whose descriptions all read roughly \"Retrieves order information.\" The agent picks the wrong one about a third of the time: get_order takes an order ID, fetch_order_info takes a customer email, and order_details takes a tracking number. The team proposes building a small classifier that routes each request to the right tool. What should be done instead?",
   "options": [
    "Build the routing classifier as proposed, since deterministic routing code will always outperform the model's own probabilistic tool selection",
    "Rewrite each description to state its purpose, exact input format, and when to use it versus its siblings — descriptions are the model's primary selection mechanism",
    "Set tool_choice to \"any\" on each request so the model is forced to commit to a tool call instead of hedging between the three candidates",
    "Collapse the three tools into a single lookup tool with a mode parameter, relying on few-shot prompt examples to teach which mode fits each identifier type"
   ],
   "correct": 1,
   "explanation": "Tool descriptions are the primary selection mechanism; three near-identical descriptions give the model nothing to choose on, so it guesses. Stating purpose, input format, and when-to-use-versus-siblings fixes the root cause, whereas a routing classifier layers permanent extra machinery on top of a broken contract. tool_choice \"any\" only forces some tool call, and the merge just relocates the same ambiguity into a mode parameter propped up by probabilistic few-shot examples.",
   "hint": "Before adding routing machinery, ask what information the model actually uses to choose between tools.",
   "difficulty": "core",
   "tags": [
    "d2",
    "tool-descriptions"
   ]
  },
  {
   "q": "A team built .claude/skills/claims-extract/SKILL.md to standardize healthcare intake form extraction, but Claude Code never auto-invokes it — the frontmatter description just says \"Extraction helper.\" An engineer rewrote the description mid-session, yet the running session still does not pick the skill up. What resolves both problems?",
   "options": [
    "Move the skill body into the project CLAUDE.md so it is always loaded, since skills can only ever be triggered from explicit slash commands",
    "Add context: fork to the frontmatter — skills cannot auto-invoke until they are marked to execute inside an isolated forked context",
    "Convert the skill into .claude/commands/claims-extract.md, because automatic invocation is supported only for project slash commands",
    "Write a specific description of what the skill does and when to use it, then run /reload-skills so the session rescans the skills directory"
   ],
   "correct": 3,
   "explanation": "The frontmatter description drives auto-invocation, so a vague \"Extraction helper\" gives the model nothing to match intake-form requests against. /reload-skills rescans skills mid-session, picking up the edit without a restart. context: fork controls execution isolation rather than triggering, and slash commands are explicit-invocation only — moving the skill there abandons auto-invocation instead of fixing it, while inlining into CLAUDE.md sacrifices progressive disclosure.",
   "hint": "One frontmatter field decides whether a skill triggers, and a 2026 slash command refreshes skills without restarting the session.",
   "difficulty": "core",
   "tags": [
    "d3",
    "skills",
    "progressive-disclosure"
   ]
  },
  {
   "q": "In a multi-agent research session, the user spends ten turns with the coordinator narrowing scope: peer-reviewed sources only, 2024-2026 publications, exclude preprints. The coordinator then spawns four research subagents, and three of them come back citing 2019 preprints. Why did this happen, and what is the fix?",
   "options": [
    "Subagent contexts are isolated and inherit nothing — the coordinator must explicitly pack the scope constraints into every Task prompt it issues",
    "The subagents share the coordinator's context but lose mid-conversation details to lost-in-the-middle; move the constraints to the top of the history",
    "The Task tool truncates long prompts; store the scope constraints in a shared memory file that every subagent is instructed to read at startup",
    "The subagents were forked from too early a baseline; re-fork them after the scoping turns so the constraints land in the shared session baseline"
   ],
   "correct": 0,
   "explanation": "Subagents run with isolated context and inherit nothing from the coordinator's conversation, so any constraint that matters must be explicitly packed into each task prompt. Lost-in-the-middle applies only to facts that are actually in context, which these never were. Shared memory files and fork timing tricks trade explicit, auditable context passing for fragile implicit state — and these subagents were spawned with isolated contexts, not forked from a baseline.",
   "hint": "Ask what a freshly spawned subagent actually knows about the conversation that spawned it.",
   "difficulty": "core",
   "tags": [
    "d1",
    "multi-agent",
    "context-isolation"
   ]
  },
  {
   "q": "A support agent handles 60-turn sessions and uses progressive summarization to control context growth. In a recent case the agent confirmed order #88412 and a $63.20 refund early in the conversation; after two summarization passes it told the customer the refund was \"around $60\" and asked for the order number again. What is the right fix?",
   "options": [
    "Run summarization less frequently and double the summary token budget so numeric details survive more compression passes before they drift",
    "Maintain a structured case-facts block (order ID, amounts, commitments) outside the summarized history, pinned where the agent always sees it",
    "Instruct the summarizer prompt to always preserve all numbers exactly, and validate each summary with a regex check for currency amounts",
    "Switch the session to a larger-context model so summarization becomes unnecessary until the conversation passes roughly 200 turns"
   ],
   "correct": 1,
   "explanation": "Progressive summarization erodes exact figures by design — every pass paraphrases — so the durable fix is a structured case-facts block kept outside the summarized history entirely. Tuning summary frequency or prompting \"preserve all numbers\" still routes critical facts through lossy compression and merely delays the failure. A bigger context window postpones the problem and ignores the fact that long sessions degrade regardless of window size.",
   "hint": "Some facts should never travel through a lossy compression step at all.",
   "difficulty": "core",
   "tags": [
    "d5",
    "summarization",
    "context-management"
   ]
  },
  {
   "q": "A document extraction pipeline processes lab reports, referral letters, and insurance cards for a healthcare intake system. The dashboard shows 95% aggregate field accuracy, and the team plans to track the model's self-reported confidence trend as the ongoing quality signal. A clinician then discovers that insurance cards — 9% of volume — extract member IDs correctly only 58% of the time. What should the team do?",
   "options": [
    "Keep the aggregate metric but lower the alert threshold to 90%, so any future slide in insurance card accuracy trips the alarm earlier",
    "Add a second extraction pass for any document whose self-reported confidence falls below 0.7, routing those documents to a stronger model",
    "Report accuracy per document type and field, and run ongoing quality checks via stratified random sampling rather than confidence trends",
    "Pull insurance cards out of the automated pipeline for manual entry until the aggregate accuracy number stabilizes above 97%"
   ],
   "correct": 2,
   "explanation": "Aggregate accuracy masks per-segment failures — a 9% slice can collapse while the blended number still looks healthy — so measurement must happen per document type and field. Self-reported confidence is poorly calibrated, which makes both confidence-trend monitoring and confidence-threshold routing unreliable foundations; stratified random sampling gives unbiased ongoing coverage of every segment. Lowering an aggregate threshold still blends the failing segment into the same misleading number.",
   "hint": "Think about what a blended success metric hides, and which quality signals are actually calibrated.",
   "difficulty": "hard",
   "tags": [
    "d5",
    "validation",
    "sampling"
   ]
  },
  {
   "q": "A research swarm classifies each extracted claim into an enum field: market_trend, regulation, technology, or competitor_move. Reviewers keep finding genuinely novel claim types — supply chain disruptions, labor actions — silently shoehorned into competitor_move. What is the right schema fix?",
   "options": [
    "Add an \"other\" value to the enum together with a free-text detail field that captures what the claim actually describes",
    "Add five more specific enum values covering every claim type observed so far, and brief reviewers to expect occasional residual misfits",
    "Add a prompt instruction telling the model to classify carefully and to skip any claim that does not clearly match one of the four categories",
    "Make the category field nullable so the model can return null whenever a claim falls outside the four currently defined values"
   ],
   "correct": 0,
   "explanation": "Closed enums force the model to pick the least-wrong value, so novel claims get shoehorned; the canonical fix is an \"other\" or \"unclear\" escape value paired with a free-text detail field that preserves the information. A nullable category discards the signal entirely — you learn nothing about what the claim was. Adding more enum values is a treadmill: the next novel type shoehorns all over again, and a prompt instruction to skip claims silently drops data.",
   "hint": "The schema needs an escape hatch that still captures information instead of dropping it.",
   "difficulty": "core",
   "tags": [
    "d4",
    "schemas",
    "enums"
   ]
  },
  {
   "q": "A support agent emits structured ticket dispositions through a tool_use call with a JSON schema. Every response validates, yet in 4% of cases refund_total does not equal the sum of the line_items amounts, and resolution_code sometimes contradicts the narrative summary. The team concludes schema enforcement is broken and wants to switch providers. What is actually happening, and what is the fix?",
   "options": [
    "The schema lacks strict mode — switching to strict structured outputs guarantees both the payload's shape and its internal arithmetic consistency",
    "Temperature is too high for structured work — pinning it to 0 makes the numeric fields deterministic and therefore internally consistent",
    "The field descriptions are too thin — documenting each field's relationship to the others lets the model reliably self-enforce the cross-field invariants",
    "Schema enforcement worked: it guarantees syntactic compliance, not semantic correctness — add programmatic cross-field validation with a repair retry"
   ],
   "correct": 3,
   "explanation": "tool_use with a JSON schema guarantees the output parses and conforms structurally; it never guarantees semantic correctness such as sums that reconcile or fields that agree. Cross-field invariants therefore need programmatic validation with a repair loop. Strict structured outputs only harden the syntactic guarantee — arithmetic consistency is still semantics — richer descriptions help probabilistically but cannot guarantee the invariant, and determinism at temperature 0 just makes the same wrong sums repeatable.",
   "hint": "Distinguish what schema validation can promise from what only your own code can check.",
   "difficulty": "hard",
   "tags": [
    "d4",
    "structured-output",
    "validation"
   ]
  },
  {
   "q": "A data extraction monorepo keeps parser modules under packages/parsers/ with strict conventions — every parser needs a golden-file test, and regex date parsing is banned — alongside general team standards. Everything lives in one 1,800-line project CLAUDE.md that bloats every session's context, and engineers report Claude Code missing the parser rules anyway. How should this be restructured?",
   "options": [
    "Move the parser conventions into each engineer's ~/.claude/CLAUDE.md so they apply globally without inflating the shared project file",
    "Create a parsers slash command in .claude/commands/ that engineers run to load the conventions before touching any parser code",
    "Keep team-wide standards in the project CLAUDE.md and move parser conventions into .claude/rules/ files with frontmatter paths scoped to packages/parsers/**",
    "Split the 1,800 lines into twelve topic files and @import them all back into the project CLAUDE.md so each concern is separately editable"
   ],
   "correct": 2,
   "explanation": "Path-scoped rules (.claude/rules/*.md with YAML frontmatter paths) load conventions only when matching files are in play, keeping the always-loaded project CLAUDE.md lean for genuine team-wide standards. The @import split reorganizes the text but still loads all 1,800 lines into every session. User-level CLAUDE.md is personal and unversioned, so team conventions there drift immediately, and a slash command makes a mandatory standard opt-in and forgettable.",
   "hint": "Some guidance should load everywhere, and some only when matching files are being touched.",
   "difficulty": "core",
   "tags": [
    "d3",
    "claude-md",
    "rules"
   ]
  },
  {
   "q": "A research coordinator running on Opus is prompted to fan out work, and its response contains one text block plus three Task tool_use blocks targeting different subagents. The team's harness executes only the first Task call, discards the other two, and sends back a single tool_result; the coordinator then re-issues the missing tasks one at a time, tripling wall-clock time. What is the correct fix?",
   "options": [
    "Prompt the coordinator to emit exactly one Task call per turn, since mixing text with multiple tool calls in one response indicates a malformed turn",
    "Execute every tool_use block in the response — running the Tasks in parallel — and return one tool_result per tool_use_id in the next user message",
    "Set tool_choice to {\"type\":\"tool\",\"name\":\"Task\"} permanently so each response is constrained to a single, well-formed Task invocation",
    "Have subagents poll a shared queue that the coordinator writes task specifications into, decoupling spawning from the tool_use protocol entirely"
   ],
   "correct": 1,
   "explanation": "Parallel subagent fan-out is expressed as multiple Task tool_use blocks in a single response, and responses legitimately mix text with tool_use blocks; the harness must execute all of them and return a tool_result for each tool_use_id. Forcing one call per turn — by prompt or by permanently forcing tool_choice — serializes the very fan-out the coordinator was correctly attempting. The shared-queue design abandons the protocol and reintroduces implicit state instead of fixing the harness bug.",
   "hint": "A single assistant response can legitimately request several tool executions at once.",
   "difficulty": "core",
   "tags": [
    "d1",
    "parallel-tools",
    "multi-agent"
   ]
  }
 ],
 "exam-mix-2": [
  {
   "q": "A market-intelligence team runs a nightly CI job where a coordinator agent spawns six subagents through parallel Task calls to analyze competitor filings. The coordinator's conversation contains the target fiscal quarter and the exact ticker list, yet subagents repeatedly research the wrong quarter and unrelated companies. What is the correct fix?",
   "options": [
    "Move the quarter and ticker list into the project CLAUDE.md so subagents pick them up automatically each night",
    "Let subagents message the coordinator mid-task to request whichever parameters they find missing",
    "Have the coordinator pack the quarter and ticker list directly into each subagent's task prompt",
    "Raise the subagent iteration limit so they have time to rediscover the correct quarter on their own"
   ],
   "correct": 2,
   "explanation": "Subagent contexts are isolated — they inherit nothing from the coordinator's conversation, so every fact a subagent needs must be explicitly packed into its task prompt. CLAUDE.md is for stable team standards, not per-run parameters: routing nightly values through it would mean rewriting a version-controlled file on every run, and it still substitutes shared memory for explicit context passing. Subagents cannot interrogate the coordinator mid-task, since traffic routes through the coordinator only as task prompts and returned results, and extra iterations just burn tokens rediscovering facts the coordinator already had.",
   "hint": "Consider what a freshly spawned subagent can and cannot see of its parent's conversation.",
   "difficulty": "core",
   "tags": [
    "d1",
    "multi-agent",
    "context-isolation"
   ]
  },
  {
   "q": "A platform team's GitHub Actions job uses claude -p to generate a database migration script, then resumes the same session with a second claude -p --resume call asking: review the migration you just wrote for bugs. The review step almost always replies that the code is correct, yet defects keep reaching production. What should the team change?",
   "options": [
    "Run the review in a separate headless session that receives only the diff and schema context",
    "Strengthen the review prompt to say: be extremely critical and assume at least three bugs exist",
    "Keep one session but switch the review turn to a larger model with extended thinking enabled",
    "Add a loop that forces at least three review passes in the session before the job is allowed to exit"
   ],
   "correct": 0,
   "explanation": "Same-session self-review keeps the generation reasoning in context, so the model tends to confirm its own earlier decisions; generator and reviewer must be separate sessions. Adversarial prompting and bigger models are probabilistic patches layered on contaminated context, and repeating passes in the same session just repeats the same bias on every pass.",
   "hint": "Ask what context the reviewer is carrying when it judges the code.",
   "difficulty": "hard",
   "tags": [
    "d1",
    "ci-cd",
    "multi-pass-review"
   ]
  },
  {
   "q": "An e-commerce team built a custom agent loop that calls the Claude API to triage failing checkout tests in their deploy pipeline. The script scans the assistant's text for the word COMPLETE to decide when to exit. Sometimes the loop terminates while Claude is mid-investigation; other times it hangs after Claude has clearly finished. What is the correct loop control?",
   "options": [
    "Tighten the prompt so Claude always prints COMPLETE alone on the final line of its last message",
    "Branch on stop_reason: execute tools on tool_use, finish on end_turn, continue generation on max_tokens",
    "Cap the loop at ten iterations and treat reaching the cap as the signal that triage is complete",
    "Treat any response that contains a text block as the final answer, since tool calls always arrive without accompanying prose"
   ],
   "correct": 1,
   "explanation": "The agentic loop is driven by stop_reason, never by parsing prose: tool_use means execute the tool and resend the full history, end_turn means done, and max_tokens means truncated output needing continuation. Prose markers are unreliable, iteration caps are safety fallbacks rather than primary control, and treating any text block as final fails because a single response can contain text and tool_use blocks together.",
   "hint": "The API already tells you, in a dedicated field, why generation stopped.",
   "difficulty": "core",
   "tags": [
    "d1",
    "stop_reason",
    "headless"
   ]
  },
  {
   "q": "A monorepo platform team wants every engineer's Claude Code session to delegate dependency-graph exploration to a fast, cheap scout while the main session stays on Sonnet. Today each engineer ad-libs a prompt like use a cheaper model for this, with wildly inconsistent results. How should the team standardize this?",
   "options": [
    "Document the delegation prompt in an onboarding guide that each engineer pastes into their personal ~/.claude/CLAUDE.md",
    "Set a CLAUDE_SUBAGENT_MODEL environment variable in the team's shared settings.json file",
    "Add a project CLAUDE.md instruction telling Claude to mention Haiku whenever it spawns a Task for exploration",
    "Commit a custom subagent in .claude/agents/ whose YAML frontmatter sets its description, tools, and model: haiku"
   ],
   "correct": 3,
   "explanation": "Custom subagents live in .claude/agents/ with YAML frontmatter that pins description, tools, and model, and committing the file version-controls the behavior for the entire team. Personal CLAUDE.md copies drift and are not shared, CLAUDE_SUBAGENT_MODEL is not a real setting, and a CLAUDE.md nudge to mention Haiku remains probabilistic where a config field is deterministic.",
   "hint": "Look for the version-controlled artifact that pins a subagent's model deterministically.",
   "difficulty": "core",
   "tags": [
    "d1",
    "subagents",
    "team-config"
   ]
  },
  {
   "q": "A developer-productivity team ships an internal cross-repo code-search MCP server whose only tool is named search with the description: Searches the index. Engineers report that Claude Code keeps reaching for the built-in Grep instead, missing results from other repositories. What should the team fix first?",
   "options": [
    "Rewrite the description to state the index coverage, query format, and when to use it instead of Grep",
    "Add a CLAUDE.md instruction telling Claude to always prefer the internal search tool over built-in Grep for code questions",
    "Add a permissions deny rule for Grep in settings.json so the fallback becomes impossible",
    "Rename the MCP tool to grep so the model selects it out of long-standing habit"
   ],
   "correct": 0,
   "explanation": "Tool descriptions are the primary selection mechanism; a vague description gives the model no reason to leave a familiar built-in, which is exactly why it falls back to Grep. The CLAUDE.md nudge is a probabilistic patch over a broken description, denying Grep removes a tool that is still correct for single-repo content searches, and near-identical names cause wrong-tool confusion rather than curing it.",
   "hint": "What signal does the model actually use to choose between two overlapping tools?",
   "difficulty": "core",
   "tags": [
    "d2",
    "mcp",
    "tool-descriptions"
   ]
  },
  {
   "q": "A fintech team of 14 engineers plus a CI runner needs a shared Jira MCP server. One engineer got it working in his ~/.claude.json with his personal API token, but nobody else, including CI, has the server. He offers to commit his working config, token included, since the repo is private. What is the right setup?",
   "options": [
    "Commit the working config with the literal token included, since a private repository is an acceptable trust boundary",
    "Have every engineer copy the server block into their own ~/.claude.json and give the CI runner its own duplicate copy",
    "Commit a project-scoped .mcp.json referencing the token as ${JIRA_TOKEN}, with each environment supplying the variable",
    "Use local scope on each machine so the config stays tied to the project without ever entering version control"
   ],
   "correct": 2,
   "explanation": "Project .mcp.json is the version-controlled, team-shared scope, and ${ENV_VAR} expansion keeps secrets out of the repo while letting each dev machine and the CI runner supply its own token. Committing literal tokens is a credential leak regardless of repo visibility, and user-scope or local-scope copies are personal — they drift across 14 machines and never reach CI.",
   "hint": "One MCP scope is designed to be committed, and it has a built-in mechanism for secrets.",
   "difficulty": "core",
   "tags": [
    "d2",
    "mcp-config",
    "secrets"
   ]
  },
  {
   "q": "A developer-experience team distributes Claude Code skills from an internal git repo. A SessionStart hook pulls the latest skills into .claude/skills/ at the start of every session, but engineers find that skills added by the pull are not auto-invoked until they fully restart Claude Code. How should the team make newly synced skills register automatically, with no manual step?",
   "options": [
    "Move the sync script into a PreToolUse hook so it runs again before every tool call in the session",
    "Have the SessionStart hook return reloadSkills in its output so the synced skills are rescanned immediately",
    "Tell engineers to run /reload-skills manually right after each session starts so the new skills register",
    "List every skill's description in the project CLAUDE.md so the content loads as memory at session start instead"
   ],
   "correct": 1,
   "explanation": "SessionStart hooks can return reloadSkills, which triggers a skill rescan after the sync completes — fixing the ordering problem at its source with zero human steps. Manual /reload-skills works but depends on every engineer remembering it every session, which fails the no-manual-step requirement. PreToolUse is the wrong lifecycle event, wastefully re-syncing on every tool call without triggering a rescan, and pasting descriptions into CLAUDE.md defeats progressive disclosure without actually registering the skills.",
   "hint": "One hook event has a documented output field made for exactly this situation.",
   "difficulty": "hard",
   "tags": [
    "d3",
    "skills",
    "hooks"
   ]
  },
  {
   "q": "A healthcare-platform team encodes its FHIR naming conventions and review standards in the tech lead's ~/.claude/CLAUDE.md. PRs generated by claude-code-action in CI, and by every other engineer locally, consistently violate the conventions. Where should the standards live?",
   "options": [
    "In an onboarding document that each engineer pastes into their own user-level CLAUDE.md",
    "As an extra prompt prefix passed to claude -p inside the CI workflow definition file",
    "In a CLAUDE_MD_PATH environment variable in CI that points at the tech lead's file",
    "In the version-controlled project CLAUDE.md so every local and CI session loads them"
   ],
   "correct": 3,
   "explanation": "The user-level ~/.claude/CLAUDE.md is personal and travels with one person; team standards belong in the project CLAUDE.md, which is version-controlled and loaded by every session, including headless CI runs. Onboarding-doc copies drift per engineer, a CI-only prompt prefix leaves local sessions uncovered and duplicates the source of truth, and CLAUDE_MD_PATH is not a real mechanism.",
   "hint": "Recall which level of the CLAUDE.md hierarchy is shared through version control.",
   "difficulty": "core",
   "tags": [
    "d3",
    "claude-md",
    "ci-cd"
   ]
  },
  {
   "q": "An engineer must rename a core payment abstraction across 23 files in 4 packages, and there are two defensible strategies: an adapter layer versus an in-place rewrite. On a similar task last month, Claude started editing immediately, switched strategies midway, and left half-converted files. A teammate suggests simply bolting on a strict reviewer pass to catch the mess afterwards. What workflow should the engineer use?",
   "options": [
    "Use plan mode to settle the strategy before edits begin, then verify with a review pass in a separate session",
    "Skip planning and invest in a stronger multi-pass reviewer that is prompted to hunt for half-converted files",
    "Execute directly but cap Claude at editing five files per session so any strategy switch has a contained blast radius",
    "Adopt plan mode as the team default for all future tasks, including one-line typo fixes, to be safe"
   ],
   "correct": 0,
   "explanation": "Multi-file architectural work with multiple valid approaches is exactly what plan mode is for — agreeing on the strategy up front prevents the mid-stream pivot, while a separate-session review still catches residual defects. A review-only workflow patches the symptom of a missing plan after damage is done, arbitrary file caps fragment the refactor without fixing strategy drift, and forcing plan mode onto obvious single-file fixes is overcorrection.",
   "hint": "Decide which failure should be prevented before edits begin versus merely caught afterwards.",
   "difficulty": "hard",
   "tags": [
    "d3",
    "plan-mode",
    "multi-pass-review"
   ]
  },
  {
   "q": "A release-notes pipeline runs claude -p to summarize merged PRs, and a downstream script calls JSON.parse on the output. Roughly once a week the job fails because the response begins with a sentence like: Here is the JSON you requested. What is the robust fix?",
   "options": [
    "Export CLAUDE_HEADLESS=true in the workflow so conversational prose is suppressed in print mode",
    "Harden the prompt: respond with ONLY raw JSON, no prose, no code fences, or the build will fail",
    "Use --output-format json together with --json-schema so the pipeline receives validated, typed output",
    "Post-process the output with a regex that strips everything before the first opening brace before parsing"
   ],
   "correct": 2,
   "explanation": "Headless pipelines should request machine-readable output through the CLI's first-class flags: --output-format json plus --json-schema yields typed, validated results instead of prose to parse. CLAUDE_HEADLESS is not a real mechanism, prompt hardening is probabilistic and is already failing weekly, and regex stripping patches one symptom while staying fragile to every other prose shape.",
   "hint": "The CLI has first-class flags for machine-readable output; one of these options invents a flag instead.",
   "difficulty": "core",
   "tags": [
    "d4",
    "structured-output",
    "headless"
   ]
  },
  {
   "q": "An insurance company extracts fields from 80,000 scanned claim forms through the Message Batches API. The extraction tool schema marks policy_end_date as a required string; on forms where the date is illegible, Claude returns plausible fabricated dates. Adding NEVER GUESS — write UNKNOWN to the prompt cut fabrication only slightly. What fixes the root cause?",
   "options": [
    "Escalate the prompt warning and add three few-shot examples demonstrating refusal to guess illegible dates",
    "Change policy_end_date to type [\"string\",\"null\"] and remove it from required so the model can return null",
    "Set temperature to 0 so the model stops inventing values when the source document is uncertain",
    "Move the illegible forms over to synchronous API calls, where extraction accuracy is higher"
   ],
   "correct": 1,
   "explanation": "A required string field forces the model to emit some string even when the document lacks the data — that schema constraint is the structural cause of fabrication, and a nullable field gives the model a legitimate way to return null. Prompt warnings and few-shot examples fight the schema and stay probabilistic, temperature does not change a forced-required constraint, and the Batch API runs the identical model with identical accuracy to synchronous calls.",
   "hint": "When a schema demands a value the document may not contain, ask what escape hatch is missing.",
   "difficulty": "core",
   "tags": [
    "d4",
    "schema-design",
    "batch-api"
   ]
  },
  {
   "q": "A fintech reconciliation pipeline extracts invoice line items with tool_use against a detailed JSON schema. Every output validates against the schema, yet auditors find that on 4 percent of invoices the line_items amounts do not sum to invoice_total. The team is debating fixes. Which approach addresses the actual gap?",
   "options": [
    "Tighten the schema with stricter numeric types, minimums, and required flags on every amount field",
    "Migrate to strict structured outputs mode so the platform hard-guarantees every response honors the schema",
    "Add a prompt instruction telling the model to double-check that line items sum to the total before answering",
    "Add a post-validation step that checks the sum invariant and routes failures to re-extraction or review"
   ],
   "correct": 3,
   "explanation": "Schema compliance — whether via tool_use or strict structured outputs — is a syntactic guarantee; no schema can enforce arithmetic relationships between fields, so semantic invariants need programmatic validation downstream. Stricter types and strict mode still only constrain shape, which already validates perfectly on the failing invoices, and a double-check instruction is best-effort where auditors need a guarantee.",
   "hint": "Separate what a schema can guarantee from what only code that does the math can verify.",
   "difficulty": "hard",
   "tags": [
    "d4",
    "structured-output",
    "validation"
   ]
  },
  {
   "q": "A pre-merge CI check sends every PR diff plus the same immutable 30,000-token engineering-standards document to the Claude API, and finance has flagged the spend. An engineer proposes moving the check to the Message Batches API for the 50 percent discount. What should the architect recommend?",
   "options": [
    "Keep the check synchronous and add a cache_control breakpoint on the stable standards prefix",
    "Adopt the Batch API across the board; a 50 percent discount on every PR check outweighs the latency tradeoff",
    "Trim the standards document down to its 5,000 most important tokens so every individual request gets cheaper",
    "Run the check as a nightly batch job and allow PRs to merge provisionally during the working day"
   ],
   "correct": 0,
   "explanation": "Batch results arrive within 24 hours with no latency SLA, so batching can never gate a blocking pre-merge check, and provisional merging quietly removes the gate the check exists to provide. Prompt caching targets exactly this workload shape — a large stable prefix repeated across requests — delivering major savings without changing the check's semantics, and the 1-hour TTL option covers repos where PRs land less often than the default 5-minute window. Trimming the document sacrifices the standards themselves.",
   "hint": "One discount mechanism trades away latency guarantees; ask whether this workload can afford that.",
   "difficulty": "hard",
   "tags": [
    "d5",
    "prompt-caching",
    "batch-api"
   ]
  },
  {
   "q": "A support-bot team enabled prompt caching. Each request is assembled as: a timestamp and customer-context block first, then the 12,000-token policy manual carrying the cache_control breakpoint, then the conversation. The cache hit rate is near zero and costs are unchanged. What went wrong?",
   "options": [
    "Too few breakpoints — cache_control should be attached to every content block to maximize cache coverage",
    "The stable policy manual must come first; the leading timestamp changes the prefix on every request",
    "The customer-context block also needs its own cache_control entry so it gets cached per customer",
    "The 5-minute TTL is expiring between requests; switching to the 1-hour TTL option will restore hits"
   ],
   "correct": 1,
   "explanation": "Prompt caching matches on the exact token prefix, so a timestamp at position zero alters the prefix on every single request and guarantees misses no matter where the breakpoint sits — stable content must precede dynamic content. Adding breakpoints to dynamic blocks caches content that never repeats, and TTL length is irrelevant when the prefix never matches in the first place.",
   "hint": "Caching is prefix matching; ask what the very first tokens of each request look like.",
   "difficulty": "hard",
   "tags": [
    "d5",
    "prompt-caching"
   ]
  },
  {
   "q": "An SRE team's observability MCP server returns 40-plus fields per query, including raw spans and verbose metadata, though incident-triage workflows in Claude Code only ever use five of them. After about 30 minutes of triage, sessions start missing findings they surfaced earlier. What is the architectural fix?",
   "options": [
    "Add a system-prompt line instructing Claude to ignore the irrelevant fields whenever it reads tool results",
    "Have incident responders run /compact every few minutes during triage to keep the context window small",
    "Add a PostToolUse hook that trims each tool result down to the five needed fields before it enters context",
    "Move triage sessions to a model with a much larger context window so the verbose results all fit"
   ],
   "correct": 2,
   "explanation": "PostToolUse hooks are the right place to normalize and trim verbose tool outputs, so the noise never enters context and long-session degradation stops at the source. A prompt instruction does not stop unused fields from consuming context, frequent /compact lossily summarizes the symptom instead of removing the cause, and a larger window still suffers lost-in-the-middle on a bloated history.",
   "hint": "Stop the bloat deterministically at the moment a tool result enters the conversation.",
   "difficulty": "core",
   "tags": [
    "d5",
    "hooks",
    "context-management"
   ]
  }
 ],
 "hunt": [
  {
   "q": "A customer support resolution agent at a telco runs an agentic loop around the Messages API. The engineer who built it breaks the loop whenever the assistant's reply text contains the phrase ticket resolved or all done. Last Tuesday the agent wrote 'the refund step is all done, now checking shipping status' alongside a pending tool_use block, and the loop exited with the shipping check never executed. Other sessions run forever because the model phrases completion as 'nothing further is needed'. The history-append and tool-execution code are correct, and stop_reason is returned on every response but never read. Name the monster.",
   "options": [
    "Iteration Cap Golem",
    "Generic Error Ghost",
    "Loop Terminator",
    "Prompt Whisperer"
   ],
   "correct": 2,
   "explanation": "Loop Terminator: the loop exits based on prose — breaking 'whenever the assistant's reply text contains the phrase ticket resolved' — instead of checking stop_reason. The API already provides a deterministic signal: tool_use means execute the tool and continue, end_turn means done, and a response can carry text and tool_use blocks together. The Iteration Cap Golem is absent because no counter acts as primary control; the fix is to branch on stop_reason and never parse assistant text for completion.",
   "hint": "This monster haunts the place where the agentic loop decides it is finished — ask what signal the API already provides.",
   "difficulty": "core",
   "tags": [
    "hunt",
    "stop_reason",
    "agent-loop"
   ]
  },
  {
   "q": "A nightly CI job drives a lint-fixing agent through the Messages API across a monorepo. The orchestration script wraps the model call in for i in range(8) and simply stops after the eighth round trip, regardless of what the API returned. Long fixes were getting abandoned with edits applied to 3 of 7 files, so the team bumped the constant to 20; now short fixes burn budget on dead turns and long ones still die mid-tool-chain. Nowhere in the script is stop_reason consulted — not for end_turn, not for tool_use, not for max_tokens. Which monster is lurking?",
   "options": [
    "Iteration Cap Golem",
    "Loop Terminator",
    "Context Glutton",
    "Generic Error Ghost"
   ],
   "correct": 0,
   "explanation": "Iteration Cap Golem: the arbitrary counter is the PRIMARY termination mechanism — 'nowhere in the script is stop_reason consulted'. Caps are legitimate only as safety fallbacks behind a stop_reason-driven loop, which is why tuning the number can never fix it. It is not the Loop Terminator because no assistant prose is being parsed; the fix is to loop while stop_reason is tool_use and keep a generous cap purely as a runaway guard.",
   "hint": "Look at which mechanism is the primary controller of loop termination versus what should only be a safety net.",
   "difficulty": "core",
   "tags": [
    "hunt",
    "agent-loop",
    "ci-cd"
   ]
  },
  {
   "q": "An e-commerce returns agent has a process_refund tool and a system prompt that says, in bold capitals, NEVER ISSUE A REFUND ABOVE $500 WITHOUT MANAGER APPROVAL. For four months it behaved, then during a 60-turn conversation with a persistent customer it issued a $2,300 refund — the instruction was still in context, just buried. The postmortem proposes stating the rule a second time at the end of the prompt and again inside the tool description. Nothing in the system intercepts the tool call before it executes. Name the monster.",
   "options": [
    "Sentiment Siren",
    "Iteration Cap Golem",
    "The Tool Hoarder",
    "Prompt Whisperer"
   ],
   "correct": 3,
   "explanation": "Prompt Whisperer: a critical business rule lives only in a prompt — 'NEVER ISSUE A REFUND ABOVE $500' — and prompt instructions are probabilistic best-effort that degrades in long contexts, hence the $2,300 refund on turn 60. Repeating the rule twice more is just louder whispering at the same broken layer. The fix is a deterministic PreToolUse hook that inspects process_refund arguments and blocks amounts over $500 with exit code 2, feeding the reason back to the model via stderr.",
   "hint": "Ask which enforcement mechanism is deterministic code and which is merely probabilistic best-effort.",
   "difficulty": "core",
   "tags": [
    "hunt",
    "hooks"
   ]
  },
  {
   "q": "A platform team built one do-everything developer assistant and registered 18 tools on it: Jira search, Jira create, Slack post, Slack search, GitHub PR review, calendar booking, deploy status, log query, and ten more. Every description is well-written, yet the agent calls search_jira_issues when it should call search_slack_messages about 20% of the time, and once booked a calendar slot when asked to file a ticket. Time to first token has also crept up as the tool definition block ballooned. Telemetry shows the failures are wrong-tool selection, not bad arguments. Which monster?",
   "options": [
    "The Pinhole Planner",
    "The Tool Hoarder",
    "Generic Error Ghost",
    "Context Glutton"
   ],
   "correct": 1,
   "explanation": "The Tool Hoarder: 18 tools on one agent degrades selection even with good descriptions — telemetry confirms 'wrong-tool selection, not bad arguments'. Around 4-5 focused tools per agent role keeps selection reliable, so the fix is to split into role-scoped agents (ticketing, comms, deploys) rather than polishing descriptions further. The Pinhole Planner concerns how a coordinator decomposes tasks, not how many tools one agent carries, and Context Glutton would implicate indiscriminately inlined data — here the bloat is the tool roster itself and the symptom is selection error.",
   "hint": "Count what the single agent is carrying and recall the threshold where tool selection quality falls apart.",
   "difficulty": "core",
   "tags": [
    "hunt",
    "tool-design"
   ]
  },
  {
   "q": "A telecom support bot routes conversations to human agents whenever a classifier scores the customer's message as angry or frustrated. The human queue is now flooded with furious-but-trivial cases — 'I HATE THIS ROUTER' password resets the bot could solve in one tool call — while a polite customer with a genuinely tangled double-billing dispute was kept in the bot loop for 47 turns. Explicit requests like 'let me talk to a person' get honored only if the message also sounds upset. Escalation volume has tripled while resolution rates fell. What is the monster?",
   "options": [
    "Sentiment Siren",
    "Confidence Phantom",
    "The Accuracy Mirage",
    "Prompt Whisperer"
   ],
   "correct": 0,
   "explanation": "Sentiment Siren: routing on whether a message 'sounds angry or frustrated' conflates emotion with complexity — furious password resets flood humans while the polite double-billing dispute loops for 47 turns. Reliable escalation triggers are explicit human requests honored immediately, policy gaps, no-progress loops, and hard caps exceeded; the fix is replacing the sentiment classifier with those. Confidence Phantom would involve trusting self-reported confidence scores, which never appear in this story.",
   "hint": "Recall which escalation triggers are reliable and which popular signal confuses feeling with difficulty.",
   "difficulty": "core",
   "tags": [
    "hunt",
    "escalation"
   ]
  },
  {
   "q": "A healthcare intake pipeline extracts patient data from scanned forms and asks Claude to append a confidence score from 0 to 100 to each record. Records scoring 90 or above skip human review and flow straight into the EHR. A compliance audit sampled the auto-approved set and found 7% of records with confidence 95 or higher contained a wrong date of birth or a swapped medication dosage, while plenty of low-confidence records were perfectly fine. The team's proposed fix is to raise the auto-approve threshold to 97. Which monster is in the pipeline?",
   "options": [
    "The Accuracy Mirage",
    "Self-Review Shadow",
    "Confidence Phantom",
    "Sentiment Siren"
   ],
   "correct": 2,
   "explanation": "Confidence Phantom: the gate trusts self-reported confidence — 'records scoring 90 or above skip human review' — but model confidence is poorly calibrated, which is exactly why 95+ records carry swapped dosages while low scorers are fine. Raising the threshold to 97 keeps trusting the same broken signal. The fix is validation independent of self-assessment: stratified random sampling and per-field checks. The Accuracy Mirage is about aggregate metrics hiding segment failures, and Self-Review Shadow requires a reviewer sharing a generation session's context; a numeric self-score gate is the Phantom's signature.",
   "hint": "Think about how well models calibrate the numbers they report about themselves.",
   "difficulty": "hard",
   "tags": [
    "hunt",
    "reliability",
    "evaluation"
   ]
  },
  {
   "q": "An insurance claims agent assembles every request by inlining the claimant's full 40-field CRM record, the entire 180-page policy manual, every prior ticket from the household, and the complete raw JSON of all earlier tool results in the session. Requests average 150k tokens, costs are running 9x projections, and the model keeps missing the one deductible clause that actually matters, buried around token 80,000. Answer quality is measurably worse than an early prototype that included only the relevant policy chapter. The prompt prefix is stable and caching is configured correctly. Name the monster.",
   "options": [
    "Cache Vampire",
    "Context Glutton",
    "The Pinhole Planner",
    "Prompt Whisperer"
   ],
   "correct": 1,
   "explanation": "Context Glutton: the agent inlines 'the full 40-field CRM record, the entire 180-page policy manual, every prior ticket' — indiscriminate stuffing that triggers lost-in-the-middle misses at token 80,000 and 9x cost. The fix is selective context: trim tool outputs to needed fields (a PostToolUse hook works well), retrieve only the relevant policy chapter, and keep a structured case-facts block instead of raw history. The Cache Vampire is explicitly ruled out — 'the prompt prefix is stable and caching is configured correctly' — so this is a volume problem, not an ordering one.",
   "hint": "This creature feeds on indiscriminate inclusion — ask what actually needed to be in the context window.",
   "difficulty": "hard",
   "tags": [
    "hunt",
    "context"
   ]
  },
  {
   "q": "A GitHub Actions workflow has Claude Code generate a bug fix, then — in the same session, with the full generation history still in context — appends the prompt 'now review the diff you just wrote for security issues'. The reviewer approves 96% of its own diffs, including one that shipped a SQL injection a human caught two days later. When the same diffs are fed to a fresh headless claude -p session instead, it flags real problems in 31% of them. The team cannot understand why the in-session reviewer is so agreeable. Which monster?",
   "options": [
    "Loop Terminator",
    "Confidence Phantom",
    "Iteration Cap Golem",
    "Self-Review Shadow"
   ],
   "correct": 3,
   "explanation": "Self-Review Shadow: reviewing 'in the same session, with the full generation history still in context' means the reviewer inherits its own generation reasoning and confirms its own decisions — hence 96% self-approval versus 31% flags from a clean session. Generator and reviewer must be separate sessions, with prior review findings fed back on re-runs to avoid duplicate findings. Confidence Phantom involves trusting numeric self-reported confidence, not a contaminated review context.",
   "hint": "Consider what this reviewer can see that an independent reviewer could not.",
   "difficulty": "core",
   "tags": [
    "hunt",
    "ci-cd",
    "self-review"
   ]
  },
  {
   "q": "An e-commerce agent calls a custom MCP inventory server. Whenever anything goes wrong — SKU not found, warehouse API timeout, malformed date filter — the tool returns the same string: Operation failed. The agent responds by retrying the identical call three times and then telling the customer the item is unavailable, even when the real problem was a transient timeout that a one-second backoff would have cured. Worse, a search that legitimately matches zero SKUs also comes back as Operation failed, so empty shelves get reported as system outages. Name the monster.",
   "options": [
    "Generic Error Ghost",
    "The Tool Hoarder",
    "Loop Terminator",
    "Context Glutton"
   ],
   "correct": 0,
   "explanation": "Generic Error Ghost: every failure collapses into the bare string 'Operation failed', so the model cannot tell a retryable timeout from a bad SKU or a malformed filter and resorts to blind identical retries. Structured tool errors — errorCategory, isRetryable, the attempted query, partial results, and suggested alternatives — let the agent recover intelligently. And an empty result set must be returned as a success with zero matches, never as an error.",
   "hint": "This monster hides inside what the tool says when things go wrong.",
   "difficulty": "core",
   "tags": [
    "hunt",
    "tool-errors",
    "mcp"
   ]
  },
  {
   "q": "A fintech extraction service reports a healthy 96.4% field-level accuracy on its loan-document dashboard, and the number has been stable for two quarters. Then a regional bank complains that nearly every handwritten 1980s-era deed they submit comes back with the wrong lien amount. Digging in, the team discovers handwritten deeds are 3% of volume and only 58% accurate, drowned out by millions of clean digital PDFs. No per-document-type breakdown has ever been run; the release gate is the single blended number. Which monster?",
   "options": [
    "Confidence Phantom",
    "Sentiment Siren",
    "The Accuracy Mirage",
    "Generic Error Ghost"
   ],
   "correct": 2,
   "explanation": "The Accuracy Mirage: 'the release gate is the single blended number', and 96.4% overall hides handwritten deeds at 58% because they are only 3% of volume. Aggregate accuracy masks per-segment failures; the fix is validating per document type and per field, gating releases on segment-level metrics, and monitoring ongoing quality with stratified random sampling. Confidence Phantom requires trusting self-reported confidence scores, which this pipeline never collects.",
   "hint": "One blended number can look healthy while a small slice of traffic quietly drowns.",
   "difficulty": "hard",
   "tags": [
    "hunt",
    "evaluation",
    "reliability"
   ]
  },
  {
   "q": "A multi-agent research system is asked to assess the competitive landscape for the company's payments product. The Opus coordinator decomposes this into exactly three subagent tasks: scrape competitor A's pricing page, scrape competitor B's pricing page, scrape competitor C's pricing page. The final report arrives fast and is impeccably formatted, but it says nothing about competitor funding rounds, the new entrant that launched last month, regulatory shifts, or hiring signals — precisely what the strategy team needed. Each Haiku subagent executed its narrow task flawlessly and propagated no errors. Name the monster.",
   "options": [
    "Context Glutton",
    "The Tool Hoarder",
    "Self-Review Shadow",
    "The Scope Creep"
   ],
   "correct": 3,
   "explanation": "The Scope Creep: the coordinator's decomposition is far too narrow — three variations of 'scrape a pricing page' for a question about an entire competitive landscape — and overly narrow decomposition causes coverage gaps. Every subagent succeeded, so the defect sits in the decomposition step: the coordinator should derive subtasks spanning the question's dimensions (pricing, funding, new entrants, regulation, talent) before delegating. Context Glutton is the opposite failure direction, over-stuffing context rather than under-scoping tasks.",
   "hint": "The defect lives in how the coordinator carved up the mission, not in how the workers executed it.",
   "difficulty": "hard",
   "tags": [
    "hunt",
    "multi-agent",
    "orchestration"
   ]
  },
  {
   "q": "A legal contract review bot assembles every request in this order: first a header containing the current timestamp, a UUID request ID, and the requesting attorney's name; then the firm's stable 30,000-token clause playbook; then the contract under review. cache_control breakpoints are set right after the playbook, yet the cache hit rate sits at 0% and the monthly bill is double the estimate. The playbook has not changed in six weeks. Time to first token is also far worse than the proof of concept, which happened to send the playbook first. Which monster?",
   "options": [
    "Context Glutton",
    "Cache Vampire",
    "The Accuracy Mirage",
    "Iteration Cap Golem"
   ],
   "correct": 1,
   "explanation": "Cache Vampire: the volatile header — 'the current timestamp, a UUID request ID, and the requesting attorney's name' — sits before the stable 30k-token playbook, so the cached prefix never matches and the hit rate is 0%. Prompt caching only pays when stable content forms the prefix: move the playbook first, set the breakpoint after it, and append all per-request material afterward. Context Glutton fails as a diagnosis because the playbook is genuinely needed — the problem is ordering, not volume.",
   "hint": "This monster cares about the order of your prompt, not its size.",
   "difficulty": "hard",
   "tags": [
    "hunt",
    "prompt-caching",
    "context"
   ]
  }
 ]
};
