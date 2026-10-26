# Practice Test 04: The Tool Armory
**D2: Tool Design & MCP Integration** (18% of the exam) · task statements 2.1, 2.2, 2.3, 2.4, 2.5

26 questions. Exam pace is 2 minutes per question.

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

## Question 3
A support agent's tools have detailed, well-differentiated descriptions. Yet whenever a customer mentions the word 'order', even in 'I can't log in to place an order', the agent calls lookup_order first. The system prompt contains: 'Always check the customer's ORDER history before anything else.' What is the most likely cause and fix?

A) The tool descriptions are still too short; add more examples to lookup_order
B) The agent has too many tools; remove lookup_order from the support agent
C) The keyword-heavy system prompt instruction is overriding the tool descriptions; rewrite it to describe when order history is actually relevant
D) Force tool_choice to get_customer on every turn so the agent cannot pick lookup_order

<details>
<summary>Answer & explanation</summary>

**C)** System prompt wording can create strong keyword associations that override good tool descriptions. The fix is to review and rewrite that instruction. The descriptions are already good, removing the tool breaks order queries, and forcing a tool every turn throws away model-driven selection.

*Hint if stuck: The descriptions are fine. What else is the model reading?*
</details>

---

## Question 4
A support agent has three tools — get_order, fetch_order_info, and order_details — whose descriptions all read roughly "Retrieves order information." The agent picks the wrong one about a third of the time: get_order takes an order ID, fetch_order_info takes a customer email, and order_details takes a tracking number. The team proposes building a small classifier that routes each request to the right tool. What should be done instead?

A) Build the routing classifier as proposed, since deterministic routing code will always outperform the model's own probabilistic tool selection
B) Rewrite each description to state its purpose, exact input format, and when to use it versus its siblings — descriptions are the model's primary selection mechanism
C) Set tool_choice to "any" on each request so the model is forced to commit to a tool call instead of hedging between the three candidates
D) Collapse the three tools into a single lookup tool with a mode parameter, relying on few-shot prompt examples to teach the model which mode fits each identifier type

<details>
<summary>Answer & explanation</summary>

**B)** Tool descriptions are the primary selection mechanism; three near-identical descriptions give the model nothing to choose on, so it guesses. Stating purpose, input format, and when-to-use-versus-siblings fixes the root cause, whereas a routing classifier layers permanent extra machinery on top of a broken contract. tool_choice "any" only forces some tool call, and the merge just relocates the same ambiguity into a mode parameter propped up by probabilistic few-shot examples.

*Hint if stuck: Before adding routing machinery, ask what information the model actually uses to choose between tools.*
</details>

---

## Question 5
A healthcare intake agent keeps hitting its 25-iteration safety cap. Traces show check_eligibility being called repeatedly with valid arguments; the executor wraps tool calls in a try/except that catches a flaky upstream timeout and appends a tool_result with empty content, after which the model calls the same tool again. The cap is the only thing stopping the loop. What is the right fix?

A) Return a structured error in the tool_result — what failed, whether it is retryable, suggested alternatives — so the model can adapt or escalate
B) Lower the safety cap from 25 to 5 so each runaway episode costs less when it inevitably happens
C) Add a system-prompt rule telling the model to never call the same tool more than twice consecutively
D) Have the executor silently retry the upstream service with exponential backoff until it eventually succeeds, however long that takes in practice

<details>
<summary>Answer & explanation</summary>

**A)** An empty tool_result gives the model zero information, so retrying the identical call is its only sensible move; informative structured error content lets it retry deliberately, switch strategy, or escalate. A bounded local retry inside the executor is reasonable for transient timeouts, but unbounded silent retrying just trades an infinite model loop for an executor that hangs through any persistent outage while the model stays blind. Lowering the cap shrinks the blast radius without restoring progress, and the prompt rule is probabilistic.

*Hint if stuck: Ask what the model actually learns from each failed call, and what it would need to know to choose differently.*
</details>

---

## Question 6
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

## Question 7
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

## Question 8
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

## Question 9
An e-commerce support agent looks up a customer's orders for the last 30 days. The order-search tool returns an empty array, the agent's wrapper raises a SearchFailedError, and the agent retries the call five times before telling the customer 'our system is down.' The customer simply placed no orders that month. What is the correct design?

A) Have the agent retry with progressively wider date ranges until at least one order is found
B) The tool should return a structured success with results: [] and a zero count; the agent reports no orders in that window
C) Catch the SearchFailedError and have the agent apologize and escalate the conversation to a human agent after the first failed search
D) Add a fallback that queries the data warehouse directly when the order-search tool returns nothing

<details>
<summary>Answer & explanation</summary>

**B)** An empty result set is a valid successful outcome — zero matches — not an error. The wrapper conflating 'no rows' with 'failure' caused phantom retries and a false outage report. Widening the date range fabricates an answer to a question the customer did not ask, and escalating a non-error wastes human time on a working system.

*Hint if stuck: Distinguish 'the search ran and found nothing' from 'the search could not run.'*
</details>

---

## Question 10
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

## Question 11
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

## Question 12
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

## Question 13
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

## Question 14
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

## Question 15
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

## Question 16
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

## Question 17
A 12-person platform team wants a shared Jira MCP server available to everyone who clones their monorepo, but the Jira API token must never appear in version control. How should they configure it?

A) Have each engineer register the server individually in ~/.claude.json so the token stays on their own machine only
B) Commit .mcp.json with the literal token in it, then add the file to .gitignore for safety
C) Use local scope for the server so the config stays project-specific but is never committed
D) Commit a project-scoped .mcp.json that references the token as ${JIRA_API_TOKEN} from each engineer's environment

<details>
<summary>Answer & explanation</summary>

**D)** Project scope (.mcp.json) is the version-controlled, team-shared configuration, and ${ENV_VAR} expansion keeps the secret out of the repo while each engineer supplies their own token locally. User scope and local scope both fail the sharing requirement — every engineer would have to configure the server independently. Committing a literal token and then gitignoring the file is self-contradictory: gitignored files are not shared, and the token would still be exposed wherever the file exists.

*Hint if stuck: One MCP scope is version-controlled for the whole team, and env expansion keeps secrets out of it.*
</details>

---

## Question 18
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

## Question 21
A developer-productivity team ships an internal cross-repo code-search MCP server whose only tool is named search with the description: Searches the index. Engineers report that Claude Code keeps reaching for the built-in Grep instead, missing results from other repositories. What should the team fix first?

A) Rewrite the description to state the index coverage, query format, and when to use it instead of Grep
B) Add a CLAUDE.md instruction telling Claude to always prefer the internal search tool over built-in Grep for code questions
C) Add a permissions deny rule for Grep in settings.json so the fallback becomes impossible
D) Rename the MCP tool to grep so the model selects it out of long-standing habit

<details>
<summary>Answer & explanation</summary>

**A)** Tool descriptions are the primary selection mechanism; a vague description gives the model no reason to leave a familiar built-in, which is exactly why it falls back to Grep. The CLAUDE.md nudge is a probabilistic patch over a broken description, denying Grep removes a tool that is still correct for single-repo content searches, and near-identical names cause wrong-tool confusion rather than curing it.

*Hint if stuck: What signal does the model actually use to choose between two overlapping tools?*
</details>

---

## Question 22
A fintech team of 14 engineers plus a CI runner needs a shared Jira MCP server. One engineer got it working in his ~/.claude.json with his personal API token, but nobody else, including CI, has the server. He offers to commit his working config, token included, since the repo is private. What is the right setup?

A) Commit the working config with the literal token included, since a private repository is an acceptable trust boundary
B) Have every engineer copy the server block into their own ~/.claude.json and give the CI runner its own separate duplicate copy
C) Commit a project-scoped .mcp.json referencing the token as ${JIRA_TOKEN}, with each environment supplying the variable
D) Use local scope on each machine so the config stays tied to the project without ever entering version control

<details>
<summary>Answer & explanation</summary>

**C)** Project .mcp.json is the version-controlled, team-shared scope, and ${ENV_VAR} expansion keeps secrets out of the repo while letting each dev machine and the CI runner supply its own token. Committing literal tokens is a credential leak regardless of repo visibility, and user-scope or local-scope copies are personal — they drift across 14 machines and never reach CI.

*Hint if stuck: One MCP scope is designed to be committed, and it has a built-in mechanism for secrets.*
</details>

---

## Question 23
A CI workflow prompt for claude -p instructs: "Use Grep to collect every file matching *.integration.test.ts under services/, then run them." The step is slow and intermittently misses test files. A reviewer flags the instruction. What should it say instead?

A) Keep Grep but anchor the regular expression so it matches the file names more precisely
B) Tell Claude to Read the services/ directory listing and filter the entries itself
C) Use Glob with services/**/*.integration.test.ts, because Glob matches file paths while Grep searches file contents
D) Use Bash with find piped through xargs, because the built-in tools cannot enumerate files by a name pattern across directories

<details>
<summary>Answer & explanation</summary>

**C)** Glob is the built-in for finding files by path pattern; Grep searches the contents of files, so using it to enumerate filenames is the wrong tool for the job and explains the misses. The Bash distractor would function but rests on a false premise — Glob exists exactly for this. Anchoring a content regex still searches the wrong dimension, and Read targets files, not directory traversal across a service tree.

*Hint if stuck: One built-in matches path patterns and another matches what is inside files.*
</details>

---

## Question 24
A new engineer at a payments company asks Claude Code to map everywhere the deprecated applyLegacyFee function is still called across a 1,200-file repository before deleting it. Which workflow is the right one for the agent to follow?

A) Read every file under src/ sequentially so that no call site can possibly be missed
B) Glob for **/*.ts and then Read each matched file in order until the function appears
C) Use Bash to cat the entire src tree into the context window and analyze all the call sites together in one pass
D) Grep for applyLegacyFee to find the call sites, then Read only the matching files to trace each usage

<details>
<summary>Answer & explanation</summary>

**D)** The canonical discovery flow is Grep to locate usages by content, then Read to trace only the files that matter. Reading or catting hundreds of files floods the context window and degrades reasoning long before coverage is achieved. Glob is the wrong first step here because the question is about content (call sites), not file path patterns, and reading every match in order repeats the same context flooding.

*Hint if stuck: Search narrows the candidates and reading traces them — think about the order of operations.*
</details>

---

## Question 25
A developer-productivity agent needs to change one specific 'return null;' line inside a 900-line file. Edit keeps failing because the text 'return null;' appears 14 times in the file. What is the reliable fallback?

A) Use Bash with sed to replace every occurrence of 'return null;' in the file
B) Retry Edit with the same old string until it succeeds
C) Grep the file to count the occurrences, then call Edit again with the exact same old string
D) Read the full file, make the change in that content, and Write the whole file back

<details>
<summary>Answer & explanation</summary>

**D)** Edit needs a unique anchor. When the text is not unique, Read followed by Write gives a reliable full-file modification. sed changes all 14 occurrences, retrying the same Edit fails the same way, and counting matches does not make the anchor unique.

*Hint if stuck: Edit needs a unique match. What else can change a file?*
</details>

---

## Question 26
An agent must find every caller of formatCurrency. The function is defined in utils/money.ts but re-exported from a wrapper module, src/lib/index.ts, under the names fmtMoney and toCurrency, and most of the codebase imports those names. A Grep for formatCurrency found only 3 callers. What should the agent do next?

A) Read every file in src/ to be sure no caller is missed
B) Read the wrapper module to list every exported name for the function, then Grep the codebase for each name
C) Glob for files named *currency* and treat them as the callers
D) Accept the 3 results, since Grep searches the entire codebase

<details>
<summary>Answer & explanation</summary>

**B)** To trace usage through a wrapper, first identify all the names it exports, then search for each name. Reading every file wastes context, a filename Glob finds files and not call sites, and the first Grep missed the aliased imports.

*Hint if stuck: The callers don't use the original name.*
</details>

---
