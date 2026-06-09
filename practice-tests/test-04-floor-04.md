# Practice Test 04: The Tool Armory
**D2: Tool Design & MCP Integration** (18% of the exam) — Tool design & MCP

15 questions. Exam pace is 2 minutes per question; aim for 30 minutes.
Pass bar in the game: 7/10 on a random draw. Pass bar here: be honest.

---

## Question 1
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

## Question 2
An e-commerce assistant has accumulated 18 tools spanning catalog search, inventory, refunds, shipping, and loyalty promotions. After the last batch of tools shipped, wrong-tool calls climbed from 3% to 19% of sessions. What should the architect do?

A) Split the assistant into focused roles, each agent exposing only the 4-5 tools its job requires
B) Expand every tool description with full parameter documentation so the model can disambiguate all 18
C) Add a system prompt table that maps each customer intent to the tool that should handle it
D) Switch the assistant to a larger model that can keep track of more tools at once

<details>
<summary>Answer & explanation</summary>

**A)** Selection accuracy degrades once an agent carries roughly 15 or more tools; the canonical design is 4-5 focused tools per role. Splitting into role-scoped agents shrinks each decision space and fixes the root cause. Longer descriptions and intent tables add context without reducing the number of candidates the model must weigh on every turn, and a larger model does not change the crowded decision space.

*Hint if stuck: Think about how many tools one agent role should carry before selection quality drops.*
</details>

---

## Question 3
A refund-processing subagent in a support system shares a tool registry that includes adjust_loyalty_points and send_marketing_email. Despite a system prompt line saying "NEVER use marketing tools," the subagent sends a promotional email in about 2% of sessions. What is the right fix?

A) Repeat the prohibition at the top and bottom of the system prompt with stronger wording
B) Remove the marketing tools from the refund subagent's tool list entirely
C) Add a PreToolUse hook that blocks send_marketing_email and returns an error to the model
D) Lower the sampling temperature so the model follows the written prohibition more consistently

<details>
<summary>Answer & explanation</summary>

**B)** The governing rule is to remove cross-role tools rather than prompt against their use: a tool with no legitimate purpose for this role should not be visible at all. Removal eliminates the failure class deterministically and shrinks the selection space. The hook is the strongest distractor, but hooks guard tools that must remain available for legitimate uses; here the tool has no legitimate use, so a hook would just bounce calls the agent should never be able to attempt while still cluttering selection.

*Hint if stuck: If a tool has no legitimate use for this role, ask whether it should be in the agent's view at all.*
</details>

---

## Question 4
A fintech extraction agent's query_transactions tool returns the string "Operation failed" whenever the data warehouse times out. The model retries the identical query four times, burns its remaining turns, and gives up without producing output. How should the tool be redesigned?

A) Cap the agentic loop at three iterations so failed retries terminate the run quickly
B) Add a system prompt instruction telling the model to vary its query whenever any tool fails
C) Catch the timeout in the tool and raise an exception so the loop ends and a human is paged
D) Return a structured error with errorCategory timeout, an isRetryable flag, the attempted query, and any partial results

<details>
<summary>Answer & explanation</summary>

**D)** A bare "Operation failed" gives the model nothing to reason with, so it repeats the same call. A structured error stating the category, retryability, the query attempted, and partial results lets the model choose an informed next action. Iteration caps are safety fallbacks, not a primary control, paging a human on every transient timeout abandons recoverable work, and a generic prompt instruction cannot tell the model whether this specific failure is worth retrying.

*Hint if stuck: A tool error should hand the model enough information to choose its next move.*
</details>

---

## Question 5
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

## Question 8
A 12-person platform team wants a shared Jira MCP server available to everyone who clones their monorepo, but the Jira API token must never appear in version control. How should they configure it?

A) Have each engineer register the server in ~/.claude.json so the token stays on their own machine
B) Commit .mcp.json with the literal token in it, then add the file to .gitignore for safety
C) Use local scope for the server so the config stays project-specific but is never committed
D) Commit a project-scoped .mcp.json that references the token as ${JIRA_API_TOKEN} from each engineer's environment

<details>
<summary>Answer & explanation</summary>

**D)** Project scope (.mcp.json) is the version-controlled, team-shared configuration, and ${ENV_VAR} expansion keeps the secret out of the repo while each engineer supplies their own token locally. User scope and local scope both fail the sharing requirement — every engineer would have to configure the server independently. Committing a literal token and then gitignoring the file is self-contradictory: gitignored files are not shared, and the token would still be exposed wherever the file exists.

*Hint if stuck: One MCP scope is version-controlled for the whole team, and env expansion keeps secrets out of it.*
</details>

---

## Question 9
A CI workflow prompt for claude -p instructs: "Use Grep to collect every file matching *.integration.test.ts under services/, then run them." The step is slow and intermittently misses test files. A reviewer flags the instruction. What should it say instead?

A) Keep Grep but anchor the regular expression so it matches the file names more precisely
B) Tell Claude to Read the services/ directory listing and filter the entries itself
C) Use Glob with services/**/*.integration.test.ts, because Glob matches file paths while Grep searches file contents
D) Use Bash with find piped through xargs, because the built-in tools cannot enumerate files

<details>
<summary>Answer & explanation</summary>

**C)** Glob is the built-in for finding files by path pattern; Grep searches the contents of files, so using it to enumerate filenames is the wrong tool for the job and explains the misses. The Bash distractor would function but rests on a false premise — Glob exists exactly for this. Anchoring a content regex still searches the wrong dimension, and Read targets files, not directory traversal across a service tree.

*Hint if stuck: One built-in matches path patterns and another matches what is inside files.*
</details>

---

## Question 10
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

## Question 11
A docs team ships an MCP server whose tool search_product_docs is described only as "Searches data." When users ask product questions in Claude Code, the model keeps running Grep across a stale local docs/ folder instead of calling the MCP tool. What is the root-cause fix?

A) Add a permissions deny rule for Grep so the model is forced to fall back to the MCP tool
B) Rewrite the description to name the corpus it searches, its query format, and when to prefer it over built-in file search
C) Add a CLAUDE.md instruction saying to always use search_product_docs for documentation questions
D) Move the server from user scope to project scope so its tools rank higher during selection

<details>
<summary>Answer & explanation</summary>

**B)** A vague MCP description gives the model no reason to prefer an unfamiliar tool, so it falls back to the familiar built-in Grep; a specific description stating purpose, corpus, query format, and when to use it over built-ins fixes selection at the source. Denying Grep breaks every legitimate code-search use, the CLAUDE.md rule is a probabilistic patch on top of an uninformative tool, and config scope controls visibility and sharing, not selection ranking.

*Hint if stuck: When a custom tool loses to a familiar built-in, ask what the model actually knows about each one.*
</details>

---

## Question 12
A new engineer at a payments company asks Claude Code to map everywhere the deprecated applyLegacyFee function is still called across a 1,200-file repository before deleting it. Which workflow is the right one for the agent to follow?

A) Read every file under src/ sequentially so that no call site can possibly be missed
B) Glob for **/*.ts and then Read each matched file in order until the function appears
C) Use Bash to cat the entire src tree into the context window and analyze it in one pass
D) Grep for applyLegacyFee to find the call sites, then Read only the matching files to trace each usage

<details>
<summary>Answer & explanation</summary>

**D)** The canonical discovery flow is Grep to locate usages by content, then Read to trace only the files that matter. Reading or catting hundreds of files floods the context window and degrades reasoning long before coverage is achieved. Glob is the wrong first step here because the question is about content (call sites), not file path patterns, and reading every match in order repeats the same context flooding.

*Hint if stuck: Search narrows the candidates and reading traces them — think about the order of operations.*
</details>

---

## Question 13
In a multi-agent research system, a subagent's web_search tool hits a provider rate limit after retrieving 3 of 5 requested sources and currently returns {"error": "request failed"}, discarding everything. The coordinator restarts the entire research task from zero each time. How should the tool respond instead?

A) Return the 3 retrieved sources as partial results along with errorCategory rate_limit and isRetryable true
B) Return a normal success response containing the 3 sources and omit any mention of the failure
C) Block inside the tool and sleep until the rate limit window resets, then return all 5 sources
D) Raise an exception so the subagent terminates and the coordinator reassigns the task elsewhere

<details>
<summary>Answer & explanation</summary>

**A)** Structured errors should preserve partial results and signal retryability so the caller can resume from where the work stopped instead of redoing it. The silent-success distractor is tempting because it avoids the restart, but it hides a known coverage gap from the coordinator, which then synthesizes from incomplete sources without knowing it. Blocking until reset hides unbounded latency inside a tool call, and a bare exception throws away the 3 sources entirely.

*Hint if stuck: A good error response keeps what succeeded and tells the caller whether trying again makes sense.*
</details>

---

## Question 14
A retail-banking assistant already carries 17 tools, and the product team wants to add 2 more for mortgage pre-qualification. Wrong-tool selection is already measurably rising. What should the architect recommend?

A) Add the two tools but write extra-detailed descriptions for all 19 so they stay distinguishable
B) Split the assistant into focused agents — accounts, cards, mortgage — each carrying 4-5 tools behind a coordinator
C) Add the tools but prefix every tool name with its category, such as mortgage_check_rate
D) Add a decision tree to the system prompt that maps each request type to exactly one tool

<details>
<summary>Answer & explanation</summary>

**B)** Beyond roughly 15 tools, selection quality degrades no matter how well each tool is described, so the fix is structural: role-focused agents with 4-5 tools each. Better descriptions are the strongest distractor because descriptions are normally the first lever, but they cannot rescue a 19-tool decision space that is already failing. Name prefixes and prompt decision trees are surface conventions that leave all 19 candidates in play on every turn.

*Hint if stuck: Past a certain tool count, better wording stops compensating — think about what actually shrinks the decision space.*
</details>

---

## Question 15
A nightly reporting agent gathers metrics through several tools, and its final request is supposed to produce a prose executive summary. In 12% of runs the model issues yet another tool call on that final request instead of writing the summary. What is the cleanest fix?

A) Add a prompt line to the final request: "You have all the data you need; do not call any more tools"
B) Cap the agentic loop at ten iterations so a runaway tool call cannot extend the nightly run
C) Set tool_choice to "none" on the final summarization request so the model must respond with text
D) Set tool_choice to "any" on the final request so the model finishes its remaining tool work faster

<details>
<summary>Answer & explanation</summary>

**C)** tool_choice "none" is the deterministic mechanism for a turn where a tool call must not happen: the model can only respond with text, which is exactly what the summary step requires. The prompt instruction is probabilistic and is essentially the behavior already failing 12% of the time. Iteration caps are safety fallbacks rather than primary control, and "any" mandates the exact behavior being prevented.

*Hint if stuck: tool_choice has a mode for the turn where a tool call is exactly what you do not want.*
</details>

---
