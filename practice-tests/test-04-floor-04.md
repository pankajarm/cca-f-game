# Practice Test 04: The Tool Armory
**D2: Tool Design & MCP Integration** (18% of the exam) · task statements 2.1, 2.2, 2.3, 2.4, 2.5

135 questions. Exam pace is 2 minutes per question.

---

## Question 1
A telecom support agent built on the Agent SDK has a single MCP tool, crm_api, that takes an endpoint string and a JSON body and forwards them to the CRM. Traces show the model inventing endpoints that do not exist, calling write endpoints when it only meant to read, and taking four or five calls to answer a simple 'what plan am I on?' question. What should the architect change?

A) Replace the passthrough with a few purpose-specific tools such as get_customer_plan and list_open_tickets, each with its own typed parameters and a description of when to use it
B) Paste the full CRM endpoint catalogue into the crm_api description so the model can look up every valid path and its expected request body before making a call
C) Keep crm_api but add a validation layer that rejects unknown endpoints with an error, so the model learns the valid paths from failures over the course of a conversation
D) Add a system-prompt rule that the agent must only call read endpoints unless the customer has explicitly confirmed that they want something changed on the account

<details>
<summary>Answer & explanation</summary>

**A)** A generic passthrough pushes API design onto the model: it has to guess paths, and nothing separates reads from writes. Purpose-specific tools with typed inputs make the right call obvious and keep the write surface narrow. Pasting the endpoint catalogue into the description floods context and still leaves an over-broad tool, rejecting unknown endpoints only teaches by trial and error, and a prompt rule about reads is probabilistic while the dangerous capability stays exposed.

*Hint if stuck: Ask whether the tool's shape matches the tasks the agent performs, or the shape of the backend API.*
</details>

---

## Question 2
In a research system, the search subagent has web_search ('Search the web for a query') and fetch_url ('Fetch a web page'). Traces show it often calls fetch_url with guessed URLs like https://example-journal.org/search?q=battery+recycling instead of searching, then reports that the page had no relevant content. What is the most effective fix?

A) Remove fetch_url from the search subagent and give it to the analysis subagent, which only ever works on URLs that an earlier search step has already found and passed on
B) Rewrite both descriptions: fetch_url reads one known URL taken from search results and is not for discovering sources, while web_search is how new sources are found
C) Add a regex check to fetch_url that blocks any URL containing a query string, so guessed search URLs fail before the request is ever sent to the target site
D) Tell the coordinator to include the phrase 'use web_search first' in every task it delegates to the search subagent so the ordering is always made explicit

<details>
<summary>Answer & explanation</summary>

**B)** The model picks tools from their descriptions, and these two say nothing about when each one applies or what fetch_url is not for. Stating purpose and boundaries ('only for a URL you already have; not for discovery') fixes the routing at its source. Moving fetch_url away breaks the legitimate follow-up read the search agent needs, a regex block catches one symptom pattern, and repeating an instruction in every delegation is a prompt patch for a tool-interface problem.

*Hint if stuck: The model can only use the boundaries a description actually states.*
</details>

---

## Question 3
A retail support agent's get_account tool has one parameter named user, typed as a string with no description. About a fifth of calls fail because the model passes the customer's display name or email address, while the backend expects the numeric account ID that appears in the ticket header. Which change addresses the root cause?

A) Make the backend accept names, emails and IDs interchangeably, picking the first matching account whenever a lookup term turns out to be ambiguous
B) Add a retry wrapper that, on failure, asks the model to try again with a different value until the backend accepts the lookup or three attempts pass
C) Rename the parameter to account_id, describe it as the numeric ID from the ticket header with an example value, and constrain it with a pattern in the schema
D) Add a system-prompt reminder that the get_account tool should always be called with the customer's account number rather than with their name

<details>
<summary>Answer & explanation</summary>

**C)** An ambiguous parameter name like user invites the model to pass whatever identifies a user. An unambiguous name, a description saying where the value comes from, an example and a schema pattern make the expected input explicit at the point of use. Accepting any identifier and choosing the first match risks acting on the wrong account, retries just repeat the guess, and a system-prompt reminder is weaker than fixing the interface the model reads on every call.

*Hint if stuck: Look at what the model actually sees when it fills in this argument.*
</details>

---

## Question 4
An engineering team connects two MCP servers to Claude Code: one for Jira and one for Confluence. Each exposes a tool named search with a description of 'Search for content.' When developers ask 'find the design doc for the billing rewrite', Claude searches Jira tickets about half the time and comes back empty. What is the best fix?

A) Disconnect the Confluence server and copy the important design documents into the repository so that everything can be found with the built-in Grep tool
B) Add a CLAUDE.md line telling Claude that design documents usually live in Confluence while tickets, bugs and sprint work live in Jira, so it should search accordingly each time
C) Configure Claude Code so that the Confluence server is always listed before the Jira server, because the model tends to prefer whichever tool appears first
D) Give the tools distinct namespaced names such as jira_search_issues and confluence_search_pages, with descriptions saying what each corpus contains and when to use it

<details>
<summary>Answer & explanation</summary>

**D)** Two tools with the same name and a generic description give the model nothing to choose between, so routing is a coin flip. Namespacing by service and resource plus descriptions of each corpus is the documented fix for overlapping tools. A CLAUDE.md hint helps a little but leaves the ambiguous interface in place, relying on list order is not a real selection signal, and dropping the server throws away a needed source.

*Hint if stuck: Two tools that look identical to the model cannot be told apart by anything else in context.*
</details>

---

## Question 5
A developer-productivity agent's list_services tool returns entries like {"svc": "7f3a9c1e-...", "owner": "a91b...", "mime": "application/json"}. When engineers ask 'who owns the payments service?', the agent often answers with the wrong owner, and transcripts show it copying a UUID from one row into a follow-up call meant for another. Which change best addresses this?

A) Return high-signal fields such as service_name and owner_name, keeping an ID only where a follow-up call needs one, so the model reasons over meaningful values
B) Raise the model's effort setting so it reads each returned row more carefully and becomes less likely to transpose identifiers between neighbouring rows in long result sets
C) Add a verify_owner tool that the agent must call after list_services to double-check every owner it reports before giving any answer back to the engineer
D) Return the same rows as XML instead of JSON, since tags make it clearer to the model which value belongs to which field in every row of a long result

<details>
<summary>Answer & explanation</summary>

**A)** Opaque UUIDs and low-level fields like MIME types are hard for the model to track and easy to mix up, so it pairs the wrong values. Returning natural-language names, and only the identifiers needed for follow-up calls, cuts these errors at the source. A verification tool adds calls but still feeds on the same confusing rows, more effort does not make cryptic IDs meaningful, and switching JSON to XML changes formatting without removing the confusing fields.

*Hint if stuck: Consider what in the tool's output is making the model's job harder than it needs to be.*
</details>

---

## Question 6
An on-call helper agent investigates incidents through a read_logs tool that returns an entire service log file for a given date. Files often run to tens of thousands of lines; the agent's context fills up after two files, and it misses the relevant errors buried in the middle. How should the tool interface be redesigned?

A) Split read_logs into read_logs_morning and read_logs_afternoon so each call returns roughly half of the file and the agent can choose which half to read
B) Replace it with a search_logs tool that takes a query, service and time window and returns matching lines with a few lines of surrounding context
C) Keep read_logs unchanged but tell the agent in its system prompt to summarise each log file immediately after reading it, before opening another one
D) Move log reading into a separate subagent that receives the entire file and passes back to the main agent only the stack traces it happens to find

<details>
<summary>Answer & explanation</summary>

**B)** Tools should match how a person would actually do the task: an engineer searches logs rather than reading them end to end. A search_logs tool with filters returns only the relevant lines plus context, which protects the context window and surfaces the errors. Halving the file still floods context, summarising after reading happens too late, and a subagent reading whole files just moves the same flood elsewhere while narrowing what it reports.

*Hint if stuck: Think about how a human engineer would look for an error in a huge log.*
</details>

---

## Question 7
An extraction pipeline gives Claude a get_document_text tool that returns the full OCR text of a contract. Most contracts are a few pages, but some are 300 pages long; on those, the response is cut at the tool-output limit and the agent extracts the termination clause from whatever text happened to fit. What is the best interface change?

A) Raise the tool-output limit far enough that even the longest contracts are always returned in a single response, so that no contract is ever cut off partway through again
B) Add a note to the system prompt warning the agent that long contracts may be truncated, so that it should be cautious about clauses it cannot locate
C) Add page-range parameters with a sensible default, and when output is truncated say so explicitly and tell the agent how to request the next range or search
D) Pre-summarise every contract with a separate model call and have get_document_text return only that summary rather than the original contract text

<details>
<summary>Answer & explanation</summary>

**C)** Large responses need pagination or range selection with sensible defaults, and any truncation should be explicit and tell the agent how to narrow or continue. That way the agent knows it has not seen the whole document and can fetch the section it needs. Raising the limit just moves the ceiling and floods context, a prompt warning gives no way to get the missing text, and a pre-summary can drop exactly the clause being extracted.

*Hint if stuck: Silent truncation is the problem; ask what the agent would need to recover from it.*
</details>

---

## Question 8
A finance extraction agent has extract_invoice and extract_receipt tools with clear, distinct descriptions. Accuracy is high except on supplier credit notes: these look like invoices but carry negative totals, and the agent routes them to extract_invoice, which then fails schema validation on the negative amount. What should the architect do first?

A) Relax the extract_invoice schema so that it accepts negative totals, since credit notes are close enough to invoices for most of the fields downstream in the pipeline
B) Add a third tool, extract_document, that handles every document type at once, so the agent no longer has to choose between invoice and receipt tools
C) Have extract_invoice silently flip negative totals to positive before validating, so that credit notes pass and continue through the pipeline as normal
D) Decide where credit notes belong, then state that edge case explicitly in the tool descriptions, with how to recognise one and which tool to use for it

<details>
<summary>Answer & explanation</summary>

**D)** A good tool description covers edge cases and boundaries, not just the typical input; the agent misroutes credit notes because no description mentions them. Deciding the correct handling and documenting it (or adding a dedicated tool if they need different fields) fixes the routing where the decision is made. Relaxing the schema or flipping signs hides a real data difference and corrupts downstream totals, and a catch-all extract_document recreates the overlap problem in a new form.

*Hint if stuck: The descriptions are good for normal documents. What do they say about the unusual one?*
</details>

---

## Question 9
A support agent records refunds through issue_refund, whose reason parameter is a free-text string. The finance team reports that the agent writes 'damaged', 'arrived broken', 'defective item' and dozens of other variants, so their reports cannot group refunds by cause. Which change gives the most reliable result?

A) Constrain reason to an enum of the finance categories in the input schema, describe each value briefly, and add an optional free-text note field for details
B) List the preferred wording for each refund category in the system prompt and ask the agent to keep to those exact phrases whenever it issues a refund
C) Run a nightly job that uses a second model call to map each free-text reason onto the finance categories after the refunds have already been recorded
D) Add a few example issue_refund calls to the tool description showing the preferred reason wording, so the model copies that phrasing each time it records a refund

<details>
<summary>Answer & explanation</summary>

**A)** When downstream systems need a fixed set of values, the tool interface should enforce it: an enum in the input schema makes only valid categories possible, and a separate note field keeps the nuance. Prompt guidance and examples reduce variation but cannot guarantee it, and a nightly remapping job repairs data after the fact with a second probabilistic step instead of fixing the interface.

*Hint if stuck: Prefer a constraint the schema enforces over wording the model is asked to remember.*
</details>

---

## Question 10
A research team rewrote the descriptions of the six tools used by its search and analysis subagents. In a demo on five hand-picked questions the subagents chose the right tools every time, and the lead wants to ship. What is the best way to confirm the new descriptions actually improve tool selection?

A) Ask Claude to review the new descriptions against Anthropic's guidance and to rate each one for clarity on a scale of one to ten before deciding to ship them
B) Run a set of realistic multi-step research tasks with verifiable outcomes against both versions, measuring tool-selection accuracy, call counts and errors on held-out cases
C) Ship the change behind a flag and watch the overall report-quality score for a week, rolling back only if the average score falls below its current level
D) Repeat the five-question demo ten more times to make sure the right tools are chosen consistently across runs, and then ship if the results stay perfect

<details>
<summary>Answer & explanation</summary>

**B)** Description changes should be judged by evaluation: realistic multi-step tasks with verifiable outcomes, compared old against new, tracking tool choice, call counts and errors, with held-out cases to avoid overfitting. Repeating five hand-picked questions measures the demo, not the workload. A model rating its own descriptions is not evidence of selection behaviour, and an aggregate quality score watched for a week can hide misrouting on particular task types.

*Hint if stuck: A demo shows that something can work; ask what shows that it works across the real workload.*
</details>

---

## Question 11
A CI pipeline runs Claude Code to review pull requests through an MCP tool, post_comment(body, path, line), where path and line are optional. Reviewers complain that line-specific findings sometimes land as general PR comments and that the overall summary is sometimes pinned to a random line of the diff. What is the best redesign?

A) Make path and line required on post_comment, so that every comment Claude posts during a review is always attached to a specific line of the diff
B) Add a CLAUDE.md rule explaining that the summary should never include path or line values while findings always should, and remind Claude of it in the review prompt
C) Split it into post_inline_finding(path, line, body) with both location fields required, and post_review_summary(body), each described with when to use it
D) Post-process Claude's output with a script that moves any comment containing the word 'summary' to the PR conversation thread instead of to a line

<details>
<summary>Answer & explanation</summary>

**C)** One tool with optional fields hides two different actions, so the model mixes them up. Splitting it into purpose-specific tools whose schemas require exactly the fields each action needs makes misuse structurally hard. Making the fields required on the single tool removes the ability to post a summary at all, a CLAUDE.md rule is guidance the model can still miss, and keyword-based post-processing is brittle.

*Hint if stuck: When one tool does two jobs with optional fields, the model has to guess which job it is doing.*
</details>

---

## Question 12
A support agent's get_refund_quote tool returns {"amount": 4599}. The billing system stores values in cents, but the description only says 'Returns the refund amount for an order.' Customers have been told they will receive $4,599 instead of $45.99. Which change is the most robust fix?

A) Add a system-prompt instruction reminding the agent that the billing system stores all amounts in cents, and that it should divide by 100 before quoting
B) Add a post-processing step that scans the agent's replies and divides any quoted amount above $1,000 by 100 before it is sent, to correct the obvious mistakes
C) Add a calculator tool that the agent must call to convert every amount from cents to dollars before it tells a customer the size of their refund
D) Return an unambiguous field such as amount_usd ("45.99") or amount_cents with a currency code, and state the unit and format in the tool's description

<details>
<summary>Answer & explanation</summary>

**D)** The tool's output is ambiguous: a bare amount gives the model no way to know the unit. Naming the field with its unit and documenting the output format in the description removes the ambiguity where the value is produced. A prompt reminder relies on the model applying it every time, a calculator tool adds a step without telling the model that conversion is needed, and rewriting amounts over $1,000 corrupts legitimately large refunds.

*Hint if stuck: The model can only interpret a number using what the tool tells it about that number.*
</details>

---

## Question 13
A platform team's deploy-history MCP tool, list_deploys, has a since parameter described only as 'start date'. When engineers ask Claude 'what shipped since last Tuesday?', calls fail because the model passes values like 'last Tuesday' or '10/14', and the server expects an ISO 8601 timestamp in UTC. What is the best fix?

A) Update the parameter description to require an ISO 8601 UTC timestamp, include an example value, and declare the format in the schema so bad values are rejected clearly
B) Make the server try several date parsers in turn and guess the most likely timestamp whenever the value passed is not already in ISO 8601 format
C) Add a CLAUDE.md note listing the deploy tool's expected date format, so that Claude sees it at the start of every session in this repository
D) Remove the since parameter entirely and have the tool return the full deploy history every time, leaving the model to filter by date on its own

<details>
<summary>Answer & explanation</summary>

**A)** Input formats belong in the tool interface: a description that names the format with an example, backed by the schema, tells the model exactly what to send at the moment it fills the argument. Guessing parsers turns ambiguous input like '10/14' into silently wrong date ranges, a CLAUDE.md note sits far from the call and does not travel to other clients, and returning the full history wastes context and pushes filtering onto the model.

*Hint if stuck: The fix belongs where the model decides what value to send.*
</details>

---

## Question 14
In a research system, the search subagent's search_papers tool returns full metadata for every hit: abstract, all authors, affiliations, DOIs and internal record IDs. Most calls only need titles and one-line summaries to decide relevance, but a follow-up call to fetch_paper needs the record ID. Context is filling up quickly. Which design best balances these needs?

A) Strip record IDs from all search results to save space, and have fetch_paper look papers up by exact title whenever the agent needs the full text of a paper
B) Add a response_format parameter: a concise mode returning titles, summaries and record IDs, and a detailed mode returning full metadata when it is needed
C) Cap search_papers at three results per call so that the full metadata always fits, and have the agent run many narrower searches to cover the topic
D) Keep the full output but move search into a separate subagent per query so that each one's context window only ever has to hold a single result set

<details>
<summary>Answer & explanation</summary>

**B)** Letting the agent choose how much detail it gets back, with the concise mode still carrying the identifiers needed for follow-up calls, cuts context use without breaking the workflow. Dropping IDs makes the next call depend on fragile exact-title matching, capping results at three hurts recall and multiplies calls, and spawning a subagent per query adds orchestration overhead to work around an interface that returns too much.

*Hint if stuck: Let the caller decide how much it needs back, but keep what the next call depends on.*
</details>

---

## Question 15
A support agent decides refund eligibility by calling get_order, then get_return_policy for the product category, then compute_days_since_delivery. In about 10% of conversations it skips the policy lookup and applies a default 30-day window, approving refunds that the 14-day electronics policy should have refused. Which change best addresses this?

A) Add a system-prompt rule that get_return_policy must always be called before any refund decision is made, stated in capital letters near the top of the prompt
B) Add a reviewer subagent that reads the conversation after each refund decision and flags any case where the policy lookup step appears to be missing
C) Replace the three calls with one check_refund_eligibility(order_id) tool that applies the category policy and returns eligible, reason and the policy applied
D) Merge the policy text for every product category into the system prompt so the agent always has it in context and never needs to look it up at all

<details>
<summary>Answer & explanation</summary>

**C)** When a workflow always needs the same chain of steps, a single tool that performs the whole chain removes the chance of skipping one. Consolidating into check_refund_eligibility applies the policy every time and returns the reasoning. A capitalised prompt rule remains probabilistic, a post-hoc reviewer catches mistakes after the decision, and pasting every policy into the prompt bloats context while still letting the model apply the wrong one.

*Hint if stuck: If a step must never be skipped, ask whether it should be the model's step at all.*
</details>

---

## Question 16
A help-desk agent uses update_ticket(ticket_id, fields), described as 'Updates a ticket.' The backend replaces the whole record with the fields provided, so when the agent only means to add a note, it sends {"notes": "..."} and wipes the status, assignee and priority. Which change is the best fix?

A) Add a sentence to the description warning that every field must be resent on each call, and include an example call that shows a full ticket being sent
B) Have the agent call get_ticket immediately before every update and merge the fields itself, as required by a new rule in the agent's system prompt for ticket updates
C) Keep update_ticket as is but add a nightly job that restores any status, assignee or priority fields that were cleared during the previous day
D) Replace it with narrow tools such as add_ticket_note and set_ticket_status that change only their own fields, each with a description stating what it changes

<details>
<summary>Answer & explanation</summary>

**D)** The tool's interface hides a destructive side effect behind a generic name, so the model's natural use of it causes damage. Narrow, purpose-specific tools that touch only their own fields make the safe action the only action. A warning in the description and a read-merge-write rule both depend on the model remembering a fragile procedure, and a nightly repair job lets data stay wrong for a day.

*Hint if stuck: Ask whether the tool's name and shape match what the agent is trying to do.*
</details>

---

## Question 17
A team adds a semantic_code_search MCP tool to Claude Code so engineers can ask conceptual questions about a large monorepo. Its description reads 'Searches code.' Claude keeps using Grep for questions like 'where do we decide whether a user is on a trial?', missing logic that never mentions the word 'trial'. What should the team change first?

A) Rewrite the description to say it finds code by meaning, when to prefer it over Grep (concept questions, unknown names) and when not to
B) Disable the built-in Grep tool for the repository so that Claude has no choice but to use semantic_code_search for every code question it is asked
C) Rename the tool to search_code_first so it sorts first in the tool list and the model sees it before any other search tool when choosing what to call
D) Add a custom slash command, /semantic, that engineers type before a conceptual question to force Claude to use the semantic search tool for that turn only

<details>
<summary>Answer & explanation</summary>

**A)** The model chose Grep because the new tool's description gives no reason to prefer it. A description that states what it is good at, when to use it instead of Grep and when not to gives the model what it needs to route conceptual questions correctly. Disabling Grep removes the right tool for exact-identifier searches, renaming for list position is not a selection signal, and a slash command makes engineers do the routing.

*Hint if stuck: Two tools look similar to the model until a description says how they differ.*
</details>

---

## Question 18
A CI review job gives Claude Code an MCP tool run_tests, described as 'Runs the test suite and returns results.' It actually runs only unit tests; integration tests run in a later pipeline stage. Review comments have started saying 'all tests pass, including the database migration paths', and engineers merge on that basis. What is the best fix?

A) Change the CI prompt to forbid Claude from making any statement about test results at all, so review comments only discuss the code changes
B) State the scope in the tool's description and output: unit tests only, integration tests not run here, so Claude knows what a passing result does and does not cover
C) Have run_tests also run the full integration suite, even though that adds about forty minutes to every review job and duplicates the later pipeline stage that already runs them
D) Add a reviewer step in which a second Claude call checks each review comment for overconfident language before it is posted to the pull request

<details>
<summary>Answer & explanation</summary>

**B)** A tool's description should state its limits as well as its purpose; here the vague wording leads Claude to claim more coverage than the tool provides. Stating 'unit tests only' in the description and the result lets Claude report accurately. Banning test statements throws away useful signal, running integration tests in review duplicates a later stage at great cost, and a second model screening comments only catches some of the wording after the fact.

*Hint if stuck: Ask whether the tool tells Claude what it does not do.*
</details>

---

## Question 19
A team using Claude Code exposes a custom generate_migration tool from its internal MCP server. Its description is 'Works with database schemas.' When a developer asks Claude to document the current schema in the README, Claude calls generate_migration and leaves a new, empty migration file in the repo. What is the most effective fix?

A) Add a PostToolUse hook that checks each new migration file and deletes it if it contains no statements, so empty migrations never reach a commit
B) Remove generate_migration from the MCP server and ask developers to create their migration files by hand using the framework's own CLI from now on
C) Describe the tool precisely: it creates a new migration file for a schema change the user asked for; it is not for reading or documenting the existing schema
D) Add a line to CLAUDE.md telling Claude to ask the developer before calling any MCP tool, so that unexpected tool calls can be caught before they happen

<details>
<summary>Answer & explanation</summary>

**C)** A vague description like 'Works with database schemas' matches almost any schema-related request, so Claude reaches for it. Stating exactly what the tool does and what it is not for prevents the misroute. Removing the tool loses a useful capability, a cleanup hook treats the symptom after the wrong call, and asking before every MCP call adds friction to all tools to fix one bad description.

*Hint if stuck: A description that matches everything will be chosen for everything.*
</details>

---

## Question 20
A logistics support agent has a check_atp tool described as 'Returns ATP for a SKU at a node.' Agents answer 'is this in stock near me?' questions inconsistently: sometimes they call it, sometimes they call get_product instead, and they misread a negative ATP value as an error. What should the architect change?

A) Shorten the description to 'Stock lookup' so that it matches the words customers actually use when they ask whether an item is available near them
B) Add a system-prompt glossary of internal supply-chain terms like ATP and node, so that the agent understands the vocabulary in every conversation
C) Rename the tool to check_stock and keep the original description, since the name is what the model reads when deciding which tool to call for a stock question
D) Rewrite the description as you would for a new hire: what ATP means, what a node is, when to use it instead of get_product, and what negative values mean

<details>
<summary>Answer & explanation</summary>

**D)** Descriptions should explain specialised terms, inputs, outputs and relationships to other tools, as if onboarding a new team member. Jargon like ATP and node gives the model nothing to match on, and nothing explains negative values. A glossary in the system prompt sits apart from the tool and does not say when to prefer this tool, and a better name alone or a two-word description still leaves the output unexplained.

*Hint if stuck: Imagine handing this tool to a capable new hire who has never seen the warehouse system.*
</details>

---

## Question 21
In a research system, the search subagent's web_search tool returns a title, URL and a 200-character snippet per hit. The synthesis subagent has begun citing specific figures that appear in snippets as if it had read the full article, and several figures turn out to be wrong once read in context. What is the best interface-level fix?

A) Document in web_search's description and results that snippets are partial previews, not sources, and that claims must be verified by fetching the full page
B) Increase the snippet length to 2,000 characters so that the figures in each snippet come with enough of the surrounding text to be interpreted correctly
C) Tell the synthesis subagent in its prompt to avoid quoting numbers in its reports unless the same number appears in at least two different search snippets from separate sites
D) Remove snippets from web_search entirely and return only titles and URLs, so that no partial text can ever be quoted in a final research report

<details>
<summary>Answer & explanation</summary>

**A)** The tool's output is being treated as more than it is because nothing says what a snippet is. Making the output's limits explicit in the description and the results tells the agents to fetch before citing. Longer snippets are still partial, cross-snippet agreement can repeat the same out-of-context fragment, and removing snippets throws away the signal the search agent needs to judge relevance.

*Hint if stuck: Ask whether the tool explains what its output can and cannot be used for.*
</details>

---

## Question 22
A platform team is writing a review checklist for every new tool definition submitted to their internal agent catalogue. One draft entry has a clear verb-noun name and a typed input schema, but its description is a single line: 'Gets customer orders.' Which addition to the checklist would most improve how reliably agents pick and use these tools?

A) Require that every tool name be fewer than twenty characters and use a standard verb from an approved list, such as get, list, create or delete
B) Require that descriptions cover what the tool does, what each input means and its format, what it returns, edge cases, and when not to use it
C) Require that descriptions stay under one sentence so that they take less context when an agent has many tools loaded at the same time
D) Require that every tool be accompanied by a matching system-prompt paragraph that tells agents in which situations the tool should be used

<details>
<summary>Answer & explanation</summary>

**B)** Detailed descriptions are the most important factor in tool performance: purpose, inputs with formats, outputs, edge cases and when not to use the tool are what the model uses to select and call it correctly. Name rules help a little but cannot carry that information, one-sentence limits work against it, and separate system-prompt paragraphs scatter tool guidance away from the definition and can introduce keyword pulls.

*Hint if stuck: What does the model actually read when it chooses a tool?*
</details>

---

## Question 23
An expense-extraction pipeline calls lookup_tax_rate(region) to validate tax lines. The region parameter is a free-text string. When a receipt says 'CA', the agent sometimes passes Canada and sometimes California, and the tool returns a rate for whichever it receives, so validation passes with the wrong rate. What is the best fix?

A) Add a sentence to the extraction prompt telling the agent to think carefully about whether CA means Canada or California before calling the tool
B) Have lookup_tax_rate return the rates for both Canada and California whenever it receives the ambiguous code CA, and let the agent pick the right one
C) Replace region with required country_code (ISO 3166-1) and optional subdivision_code fields, described with examples, so the call must state which place is meant
D) Hard-code CA to mean California in the tool, since most receipts processed by the pipeline come from merchants based in the United States

<details>
<summary>Answer & explanation</summary>

**C)** A free-text field lets an ambiguous value through and the tool silently resolves it. Structured, unambiguous parameters with standard codes force the call to say which jurisdiction is meant, and the description's examples show how. A prompt nudge leaves the ambiguity in the interface, returning both rates hands the same guess back to the model, and hard-coding a default will be wrong for every Canadian receipt.

*Hint if stuck: Ambiguity in an input should be removed by the interface, not resolved by a guess.*
</details>

---

## Question 24
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

## Question 25
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

## Question 26
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

## Question 27
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

## Question 28
A retail support agent calls lookup_order with an order_id extracted from the customer's message. When a customer types "#A-1234" the tool fails, because IDs must be ten digits, and the agent tells the customer the order does not exist. What should the tool integration return so the agent can recover?

A) Return an empty result so the agent proceeds as if no order was found and offers the customer the standard next steps
B) Raise an exception that ends the conversation and opens a ticket for a human agent to follow up on the order manually
C) Silently strip the non-digit characters and pad the ID with zeros before running the lookup against the order system
D) Return a tool_result with is_error set and a specific message that the ID must be ten digits and what was received

<details>
<summary>Answer & explanation</summary>

**D)** An is_error tool_result with a specific message gives the model the feedback it needs to correct the value or ask the customer for the right ID. An empty result looks like a genuine "not found", ending the conversation escalates a recoverable input problem, and silently rewriting the ID can match the wrong order.

*Hint if stuck: Errors the model can read are errors the model can fix.*
</details>

---

## Question 29
A support agent can issue refunds up to $200; larger ones need a supervisor. When it calls issue_refund for $650, the tool returns isError with the text 'Refund could not be processed.' The agent retries three times, then tells the customer the system is down. What should the tool return instead?

A) A transient error marked retryable, so the agent waits a few seconds and tries the same refund again before it gives the customer any update
B) A protocol-level JSON-RPC error, so the client stops the conversation and the platform routes the customer to a human agent automatically
C) A successful result with a partial refund of $200 already applied, so the customer gets something immediately and the remainder can be handled later
D) A structured business error: category policy_limit, isRetryable false, and a message saying refunds over the $200 limit need supervisor approval

<details>
<summary>Answer & explanation</summary>

**D)** The failure is a business rule, not an outage, so retrying can never succeed; a structured error saying what rule was hit, that it is not retryable and what the next step is lets the agent escalate correctly and explain it honestly. Marking it retryable repeats the same pointless loop, quietly issuing a partial refund takes an action nobody approved, and a protocol error hides the reason from the model instead of letting it recover.

*Hint if stuck: Ask what the agent needs to know to choose between retrying, escalating and explaining.*
</details>

---

## Question 30
A Claude Code user's internal MCP server exposes create_ticket with a priority field. When Claude passes 'urgent', the server returns isError with the message 'Invalid input.' Claude tries 'high', then 'critical', then gives up and tells the developer the ticket system is broken. The valid values are P1 to P4. Which change best fixes this?

A) Return a validation error that names the field, the value received and the allowed values P1 to P4, and declare those values as an enum in the input schema
B) Return the failure as a JSON-RPC protocol error with code -32602, since invalid parameters are a request-structure problem that the client should handle on its own
C) Keep the generic message but add a CLAUDE.md note listing the four valid priority values so Claude can look them up whenever it creates a ticket
D) Have the server map any unrecognised priority to P3 so tickets are always created, and mention the default in the ticket body for later review

<details>
<summary>Answer & explanation</summary>

**A)** A bad argument is a failure the model can fix itself, but only if the error reaches it as an actionable tool result: which field, what was wrong, what is allowed. Declaring the enum in the schema prevents most bad values in the first place. Silently defaulting to P3 hides real urgency, a protocol error is less likely to reach the model in a form it can recover from, and a CLAUDE.md list leaves the tool's own feedback useless.

*Hint if stuck: An error message is useful when it tells the model exactly what to change.*
</details>

---

## Question 31
A team's MCP server for a feature-flag service rejects bad arguments, such as a date in the past for a scheduled rollout, by returning a JSON-RPC error object. In Claude Code, these surface to the model as a terse failure without the server's explanation, and Claude repeats the same bad call. How should the server report these failures?

A) As a JSON-RPC error with a longer message field, since clients pass protocol error messages to the model in full whenever the error code is -32602
B) As a tool result with isError set to true and a message explaining what was wrong, for example that the rollout date must be in the future, so the model can correct it
C) As an ordinary successful tool result whose text begins with the word ERROR, so that the client does not filter the message out before the model sees it
D) As a server-side log entry only, with the tool returning an empty result so the model moves on to other work instead of repeating the same failed call

<details>
<summary>Answer & explanation</summary>

**B)** The MCP spec reports failures the model can act on, such as a business rule or a bad input value, as tool results with isError true so the model can self-correct. Lengthening a protocol error message still relies on the client passing it on, which the spec does not require. Returning a success with an ERROR prefix hides the failure from anything that checks the flag, and an empty result tells the model nothing.

*Hint if stuck: The spec gives models a channel for errors they can fix; ask whether this server is using it.*
</details>

---

## Question 32
In a research system, the search subagent's tool occasionally times out when a news API is briefly overloaded; a second attempt a few seconds later almost always succeeds. Today each timeout goes straight back to the coordinator, which re-plans the whole research task. Where should these failures be handled?

A) At the coordinator, which should keep a log of each timeout and decide case by case whether the search is worth repeating in a later round of work
B) By raising the API timeout from 10 seconds to 120 seconds so that slow responses are given enough time to finish and no longer count as failures
C) Inside the search subagent or its tool, with a few bounded retries and backoff, escalating to the coordinator only if retries are exhausted and including what was tried
D) In the synthesis subagent, which should notice any missing news sources in the material it receives and request them again from the search agent directly

<details>
<summary>Answer & explanation</summary>

**C)** Transient errors should be recovered close to where they happen; bounded retries with backoff in the subagent or tool absorb the blips, and only a persistent failure is propagated, with context, to the coordinator. Sending every blip upward makes the coordinator re-plan needlessly, a very long timeout makes each call hang during genuine outages, and expecting synthesis to spot gaps puts recovery in the wrong agent.

*Hint if stuck: Handle a failure at the lowest level that can actually fix it.*
</details>

---

## Question 33
A research coordinator asks a subagent to search a medical database. The database credentials have expired, every query fails, and the subagent's wrapper catches the exceptions and returns {"results": []}. The final report states that 'no peer-reviewed studies exist on this intervention.' What is the root-cause fix?

A) Tell the synthesis subagent to word any no-results finding cautiously, saying that studies may exist but were not found, in every report it writes
B) Have the coordinator re-run any search that returns zero results a second time, to rule out a transient fault before it accepts an empty result set
C) Add a weekly job that checks the database credentials and alerts the operations team when they are close to their expiry date or have expired
D) Make the subagent return an access failure as a structured error, distinct from a valid empty result, so the coordinator can report a coverage gap

<details>
<summary>Answer & explanation</summary>

**D)** The wrapper turns an access failure into what looks like a successful search with no results, so the coordinator draws a false conclusion. Errors and genuine empty results must be distinguishable: the failure should come back as a structured error the coordinator can act on and disclose. Cautious wording hides real absence and real failure alike, re-running a search fails the same way with expired credentials, and credential monitoring is good hygiene but does not stop the next failure being masked.

*Hint if stuck: Ask whether the coordinator can tell 'nothing exists' from 'we could not look'.*
</details>

---

## Question 34
An extraction agent submits each extracted record through a save_record tool. When the downstream API rejects a record, the tool returns isError with 'Save failed (422).' The agent re-extracts the whole document from scratch and often hits the same rejection. The API's response body lists the exact fields that failed and why. What should change?

A) Return the field-level details in the error, such as invoice_date must be YYYY-MM-DD, marked as a validation error, so the agent fixes only those fields
B) Have save_record retry the same payload up to five times with backoff, since 422 responses are often caused by short-lived load on the downstream API under heavy traffic
C) Have save_record drop any fields that fail validation and save the rest of the record, logging the dropped fields so they can be reviewed later
D) Raise the model's effort level for the extraction step, so its first extraction is more careful and fewer records are rejected by the downstream API

<details>
<summary>Answer & explanation</summary>

**A)** The information needed to recover already exists in the API response; the tool discards it. Passing back which fields failed and why, categorised as a validation error, lets the agent correct those fields instead of starting over. Retrying an unchanged payload cannot fix a validation failure, silently dropping fields saves incomplete records as if they were correct, and more effort on extraction does not tell the model what was wrong.

*Hint if stuck: The downstream system already said what is wrong; ask whether the agent ever hears it.*
</details>

---

## Question 35
A support agent's charge_card tool maps every gateway failure to {"isError": true, "isRetryable": true}. When a customer's card is declined for insufficient funds, the agent retries the charge four times in a row, and the bank flags the card for suspected fraud. Which change fixes the root cause?

A) Add a system-prompt rule that the agent must never retry a charge more than once, no matter what the tool reports back after the first failure
B) Map gateway responses to categories: a decline is a non-retryable business error with a readable reason, while a timeout is transient and may be retried
C) Remove isRetryable from the tool's errors entirely and let the model judge from the gateway's raw response code whether a retry makes any sense for this charge
D) Insert a fixed thirty-second delay between charge attempts so that repeated retries are spread out and look less suspicious to the issuing bank

<details>
<summary>Answer & explanation</summary>

**B)** The tool labels every failure the same way, so the agent cannot tell a decline (retrying can never help and causes harm) from a timeout (retrying is reasonable). Categorising errors and setting isRetryable correctly lets the agent respond properly to each. A blanket one-retry rule still retries declines and blocks valid timeout retries, raw gateway codes push interpretation onto the model, and spacing out retries still repeats a charge that will be declined.

*Hint if stuck: Different failures call for different responses; ask whether the agent can tell them apart.*
</details>

---

## Question 36
A developer-productivity agent's get_repo_info tool, when a repository does not exist, returns the text 'ERROR: repository acme/payments-v3 not found' with isError false. The agent goes on to summarise the 'repository description' as 'ERROR: repository acme/payments-v3 not found' in its report on service ownership. What is the correct fix?

A) Add a system-prompt rule telling the agent to ignore any tool output that contains the word ERROR when it writes its summaries for engineers
B) Change the text to start with 'WARNING:' so it looks less like regular data and the model is more likely to treat it as a problem with the lookup itself
C) Set isError to true on that result, with a clear message and category, so the agent knows the call failed and can try another name or report the gap
D) Return an empty string for missing repositories, so that no misleading text reaches the agent's report and the field is simply left blank instead

<details>
<summary>Answer & explanation</summary>

**C)** isError is the signal that tells the agent a call failed; without it, error text is just content and gets treated as data. Setting the flag with a readable message and category lets the agent recover or report the gap. Changing the prefix still relies on the model inferring failure from wording, a keyword-ignore rule is brittle and can discard real data, and an empty string turns a failure into an apparently valid blank value.

*Hint if stuck: Ask how the agent is supposed to know this call failed.*
</details>

---

## Question 37
A support agent for a multi-region bank calls get_statements for a customer whose account is held by the EU entity; the agent's credentials only cover US accounts. The tool returns 'Error 403.' The agent retries, then tries get_transactions and get_balance, each failing the same way, before apologising vaguely. What should the tool return?

A) A transient error marked retryable, since the EU entity's access controls may be updated soon and a later attempt could well succeed for this customer
B) An empty statements list, so the agent tells the customer there are no statements available instead of exposing internal permission details to them
C) A JSON-RPC protocol error, so the client ends the session and the customer is automatically transferred to the EU support queue by the platform
D) A structured permission error: category permission, not retryable, explaining that the account is held by the EU entity and naming the handoff route

<details>
<summary>Answer & explanation</summary>

**D)** A permission failure is not fixed by retrying or by trying neighbouring tools; the agent needs to know it lacks access, why, and where to send the customer. A structured permission error with that context lets it hand off cleanly. Marking it retryable invites the same loop, an empty list lies to the customer about their account, and a protocol error removes the explanation the model needs to respond helpfully.

*Hint if stuck: Ask what the agent should do next and whether the error tells it.*
</details>

---

## Question 38
A CI job asks Claude Code to review pull requests and report test coverage using an MCP tool, get_coverage. When the coverage artifact from the test stage is missing, the tool catches the exception and returns {"line_coverage": 0}. Review comments then tell authors their change 'drops coverage to 0%' and block the merge. What is the best fix?

A) Return a structured error when the artifact is missing, such as dependency_missing, not retryable within the job, so the review says coverage was unavailable
B) Have the review prompt tell Claude to treat any reported coverage of exactly 0% as suspicious and to leave it out of the review comment it posts
C) Make get_coverage return the coverage figure from the main branch whenever the current artifact is missing, so the review always has some figure to report to the author
D) Make the CI pipeline fail the whole job whenever the coverage artifact is missing, so that no review comment is ever posted on that pull request

<details>
<summary>Answer & explanation</summary>

**A)** Returning 0 makes a failure look like a valid measurement, which is worse than no answer. A structured error that says what is missing lets Claude report that coverage could not be checked instead of inventing a regression. A prompt rule about 0% would also hide genuine zero coverage, substituting main-branch numbers reports a figure that does not describe this change, and failing the job throws away the rest of a useful review.

*Hint if stuck: A failure disguised as data produces confident wrong conclusions.*
</details>

---

## Question 39
A research team is defining error handling for subagents. Searches can fail with rate-limit blips, malformed queries the subagent wrote itself, paywalled sources, and a topic the coordinator was told not to research. Which policy best fits structured error handling?

A) Every failure goes straight to the coordinator with the raw error text, so that one agent makes every recovery decision for the whole system of subagents
B) Retry rate limits and fix its own malformed queries locally; propagate paywall and out-of-scope failures as structured errors with any partial results
C) Subagents report only successful results and leave failed searches out of their output, so the coordinator's context stays focused on usable material
D) Subagents retry every failure up to five times with backoff before reporting anything, since most errors resolve if given enough attempts to succeed

<details>
<summary>Answer & explanation</summary>

**B)** Each error type has a natural owner: transient blips and self-inflicted validation errors can be fixed locally, while access and scope problems need a decision above the subagent and should be propagated with category, context and partial results. Sending everything upward floods the coordinator with noise, retrying everything wastes calls on errors that can never succeed, and silently omitting failures hides coverage gaps.

*Hint if stuck: Match each error type to the agent that can actually do something about it.*
</details>

---

## Question 40
An internal developer agent's run_query tool returns the database driver's full Python traceback, often 150 lines, whenever a query fails. The agent's context fills with stack frames, and it frequently guesses at the cause, for example rewriting a correct query when the real problem was a connection timeout. What should the tool return instead?

A) Nothing extra; instead give the agent a larger context window so that full tracebacks fit comfortably and never crowd out the rest of the session
B) Only the last line of the traceback, since that line usually contains the exception type and message needed to work out what went wrong with the query
C) A short structured error with category (timeout, syntax, permission), whether it is retryable and a readable message, while the full traceback is logged server-side
D) A generic 'query failed, please try again' message, so that the agent is not distracted by internal details and simply retries the same query once more

<details>
<summary>Answer & explanation</summary>

**C)** Raw tracebacks are noisy and leave the model to diagnose the failure, while a concise structured error states the category, retryability and an actionable message, with the full trace kept for humans in logs. A bigger context window just stores more noise, the last line alone often lacks the category or next step, and a generic 'try again' message prevents sensible recovery for syntax or permission errors.

*Hint if stuck: Give the agent the diagnosis, not the raw evidence.*
</details>

---

## Question 41
A document-extraction tool processes batches of 50 scanned forms. When 3 forms fail OCR, the tool returns isError true for the whole batch with 'Batch processing failed', and the agent resubmits all 50, paying for the 47 good extractions again. Often the same 3 fail again. Which redesign is best?

A) Return isError false with only the 47 successful extractions, so the batch completes and the three failed forms can be picked up in a later run
B) Retry the whole batch automatically inside the tool up to three times before returning anything, so that occasional OCR failures are absorbed without the agent noticing
C) Reduce the batch size to a single document per call, so that each failure only ever affects one form and never forces the agent to resubmit the others
D) Return per-document results: the 47 extractions as successes plus a structured error for each of the 3 failures, with its category and whether retrying could help

<details>
<summary>Answer & explanation</summary>

**D)** Failing the whole batch for a partial failure throws away good work and hides which items need attention. Returning partial results alongside structured per-item errors lets the agent keep the successes and handle each failure appropriately, for example routing an unreadable scan to a human. Whole-batch retries repeat the same failures, one-document batches avoid the design question at a large overhead, and dropping failures silently loses three forms.

*Hint if stuck: Ask what happens to the 47 forms that worked.*
</details>

---

## Question 42
A utilities support agent's update_address tool returns isError with the message 'ERR_FK_CONSTRAINT_2291' when the postcode is not in the service area. The agent passes this on to customers, telling them 'there was an error ERR_FK_CONSTRAINT_2291, please try again later.' Which change fixes this best?

A) Translate the failure into a business error with a readable message, that the postcode is outside the service area and not retryable, so the agent can explain and offer options
B) Add a system-prompt rule that the agent must never repeat error codes to customers and should apologise in general terms whenever a tool call fails
C) Have the tool return a successful result and queue the address change for a human to review later, so the customer never sees any error at all
D) Keep the code but add a lookup tool that maps database error codes to explanations, so the agent can look up the meaning of each code itself

<details>
<summary>Answer & explanation</summary>

**A)** A raw database code tells the model nothing about what went wrong or what to do; a categorised, readable message lets it explain the real situation and suggest next steps. A generic apology rule hides the useful reason and still invites pointless retries, a fake success misleads the customer, and a code-lookup tool adds a call to compensate for an error the tool itself should have described.

*Hint if stuck: The agent can only explain what the error message explains.*
</details>

---

## Question 43
A platform team runs a dozen internal MCP servers used by support and research agents. Each server reports failures differently: some throw, some return strings, some return {"ok": false}. Agents handle failures inconsistently across tools. What should the team standardise on?

A) A rule that every server must throw an exception on any failure, so the agent framework catches it centrally and stops the agent run immediately
B) Failures returned as tool results with isError true, plus an agreed errorCategory, isRetryable and readable message in the content
C) A convention that all failures return an empty result, so that agents treat every failure the same way and simply move on to the next step
D) A shared error-code table of numeric codes that every server must use, published as a document that agents can read through a lookup tool

<details>
<summary>Answer & explanation</summary>

**B)** Agents recover well when every tool signals failure the same way: isError to flag it, and an application-level convention of category, retryability and a readable message to guide the next step. The MCP spec does not define those extra fields, so the team agrees on them itself. Throwing ends runs that could have recovered, numeric codes need a lookup to mean anything, and empty results make failures indistinguishable from real empty answers.

*Hint if stuck: Consistency helps only if what is made consistent carries what the agent needs.*
</details>

---

## Question 44
A developer agent opens a database session with open_session, which returns a handle used by later run_query calls. Handles expire after 30 minutes idle. After a long code-reading detour, run_query returns isError with 'invalid argument: session', and the agent keeps re-sending the same handle with small changes to the query. What should the tool do?

A) Extend the handle lifetime to 24 hours so that expiry never occurs during a working session, however long the agent spends reading other code
B) Silently open a new session inside run_query whenever the handle has expired, so the agent never needs to know that its handle stopped working after expiry
C) Return an error saying the session handle has expired, that it is not retryable with that handle, and that calling open_session will create a new one
D) Return a JSON-RPC protocol error, since an unknown handle means the request itself is malformed and cannot be fixed by the model or the agent

<details>
<summary>Answer & explanation</summary>

**C)** An expired handle is a recoverable condition, but only if the error says what happened and how to recover. A clear tool execution error pointing to open_session lets the agent fix it in one step. Silently opening a new session can lose transaction state the agent relied on, a very long lifetime just postpones the same confusion, and a protocol error hides the explanation the model needs.

*Hint if stuck: A good error tells the agent both what went wrong and the step that fixes it.*
</details>

---

## Question 45
A research coordinator runs five subagents in parallel. The patents subagent returns a structured error: category access_denied, not retryable, with two patents found before the failure. The coordinator currently aborts the whole job whenever any subagent errors. What should the coordinator do instead?

A) Retry the patents subagent repeatedly until it succeeds, since the report cannot be considered complete until every planned source type has been covered by a subagent
B) Abort as it does now but log the structured error, so that an engineer can rerun the whole research job manually once access has been restored
C) Drop the patents section silently and present the report as complete, because the other four sources already provide enough material for a good report
D) Continue with the other four subagents' results, include the two partial patent results, and note in the report that patent coverage is incomplete and why

<details>
<summary>Answer & explanation</summary>

**D)** Structured errors with partial results exist so that higher-level agents can make sensible decisions instead of failing everything. The coordinator should keep what it has, use the partial results and disclose the gap. Retrying a non-retryable access error wastes work, dropping the section silently presents an incomplete report as complete, and aborting throws away four good results.

*Hint if stuck: A failure in one part does not have to mean failure of the whole.*
</details>

---

## Question 46
An insurance-claims extraction agent calls an OCR tool that fails about 5% of the time with a transient service error. Each failure goes back to the model, which spends a turn reasoning about it and re-calling the tool; on long claim files this pushes runs over their turn budget. What is the best design change?

A) Put bounded retries with backoff for transient errors inside the tool wrapper, and surface a structured error to the model only if those retries are exhausted
B) Add a system-prompt instruction telling the model to re-call the OCR tool immediately on failure without writing out any reasoning about it
C) Switch the OCR tool to return an empty page on failure, so the agent continues with the remaining pages and the run finishes within budget
D) Raise the agent's turn budget so that runs have enough headroom to absorb several transient OCR failures on even the longest claim files

<details>
<summary>Answer & explanation</summary>

**A)** Transient errors that are fixed by simply trying again should be handled deterministically in the tool layer, not by spending model turns. Bounded retries keep the run efficient, and a structured error still reaches the model if the service is really down. A bigger turn budget pays for the waste instead of removing it, a prompt instruction still costs a turn each time, and returning an empty page makes missing text look like a blank page.

*Hint if stuck: Ask whether a model turn is needed to decide to try again.*
</details>

---

## Question 47
A CI job has Claude Code call an MCP lint tool on changed files. The tool returns isError true whenever it finds lint violations, with the violations listed in the message. Claude has started reporting 'linting could not be run' on PRs that actually have violations, and skips commenting on them. What is the correct fix?

A) Tell Claude in the CI prompt that lint errors with isError true still contain useful findings, and that it should read them before deciding what to post
B) Return violations as a normal successful result, and use isError only when the linter itself could not run, for example on a crash or a missing config
C) Have the tool return isError true only when there are more than ten violations, so that small numbers of findings are reported as normal results
D) Split the tool into run_lint and get_lint_violations, so that the second call fetches the findings separately once the first call has reported an error

<details>
<summary>Answer & explanation</summary>

**B)** isError means the tool call failed, not that the tool found problems; a linter that ran successfully and found violations has succeeded. Returning findings as a normal result and reserving isError for real failures makes the signal mean one thing. A prompt rule asks Claude to second-guess the flag, a threshold makes the flag's meaning depend on counts, and splitting the tool adds a call without fixing the misuse of the flag.

*Hint if stuck: Ask what isError should mean, and whether finding problems is the same as failing.*
</details>

---

## Question 48
A support agent's create_return tool fails for orders delivered more than 30 days ago. It returns isError with 'Return window closed', and the agent ends the conversation with 'Sorry, we can't help.' Policy allows store credit up to 60 days, and the CSAT team says these customers would usually accept it. What should the tool return?

A) A transient error marked retryable, so that the agent tries the return again later in the conversation in case the policy check produced the wrong answer
B) A successful return anyway, so the customer is not disappointed and the finance team can reverse the return later if the order turns out to be ineligible
C) A business error, not retryable, stating the window closed on a given date and listing available alternatives, such as store credit until day 60
D) A protocol-level error that triggers automatic escalation to a human agent, who can then decide whether to offer the customer any other options

<details>
<summary>Answer & explanation</summary>

**C)** A business-rule error is most useful when it explains the rule that applied and what can still be done, so the agent can move to the next best resolution instead of a dead end. Marking it retryable invites a loop that can never succeed, approving an ineligible return breaks policy, and escalating every closed window to a human throws away a resolution the agent could offer itself.

*Hint if stuck: A good error can point to the alternative, not just the refusal.*
</details>

---

## Question 49
A developer agent's search_commits tool times out when asked for every commit touching 'src/' across a ten-year monorepo. The tool returns isError with isRetryable true, so the agent repeats the same query five times, each timing out. Narrower queries by path and date return in under a second. What should the error say?

A) Nothing different; instead the tool should use a much longer timeout, so that very broad queries across the full history are able to complete in the end
B) That the failure was transient and should be retried with exponential backoff, waiting longer between each attempt until the query eventually succeeds
C) That the request failed, and that the agent should ask the developer whether they really need the full history before trying anything else
D) That the query was too broad to complete, that repeating it will not help, and how to narrow it, for example by subdirectory or a date range

<details>
<summary>Answer & explanation</summary>

**D)** Not every timeout is transient: this one is caused by the request itself, so marking it retryable sends the agent into a loop. An error that says the query is too broad, not to repeat it unchanged, and how to narrow it lets the agent recover on the next call. Backoff just repeats the doomed query more slowly, a longer timeout ties up the session and may still fail, and asking the developer hands over a problem the agent could solve itself.

*Hint if stuck: Ask whether the same call, sent again, could ever succeed.*
</details>

---

## Question 50
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

## Question 51
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

## Question 52
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

## Question 53
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

## Question 54
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

## Question 55
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

## Question 56
In a market-research system, the synthesis subagent was given the same web_search and fetch_page tools as the search subagents 'so it can fill gaps'. Reports now take three times longer because synthesis keeps launching fresh research tangents, yet about a third of its tool calls are just quick checks that a cited statistic matches its source. What should the architect change?

A) Keep the full search toolkit but add a system prompt rule limiting synthesis to five searches per report
B) Let synthesis keep both tools but route its calls through a hook that logs each search so the team can audit tangents later
C) Remove every tool from synthesis so that any missing fact or statistic must be requested from the search subagents through the coordinator
D) Remove web_search and fetch_page from synthesis and give it a narrow verify_claim tool for checking a cited figure against its source

<details>
<summary>Answer & explanation</summary>

**D)** Agents misuse tools outside their role, so the general search tools should leave synthesis; the frequent, legitimate need (quick citation checks) is served by a small, scoped cross-role tool. A prompt cap on searches is a probabilistic limit on a tool the role should not hold. Stripping every tool forces a coordinator round trip for each routine check, and logging the calls only observes the tangents instead of preventing them.

*Hint if stuck: Separate the frequent narrow need from the broad capability that invites off-role behaviour.*
</details>

---

## Question 57
A research coordinator was configured with the Task tool plus every tool its four subagents use: web_search, fetch_page, run_statistics, and format_citations. In traces, the coordinator increasingly runs searches and statistics itself, its context fills with raw pages, and the specialist subagents are invoked on fewer than half of queries. Which configuration fixes this?

A) Give the coordinator the Task tool and only the aggregation tools it needs, leaving search and statistics tools on the subagents
B) Add a system prompt instruction telling the coordinator it must always delegate searching and analysis to subagents
C) Set tool_choice to any on every coordinator request so that it is always obliged to call one of the registered tools
D) Move the coordinator to a model with a larger context window so the raw pages it fetches itself no longer crowd out its reasoning

<details>
<summary>Answer & explanation</summary>

**A)** When the coordinator holds every specialist tool it takes shortcuts around its own subagents; scoping its toolset to delegation and aggregation makes the hub-and-spoke design structural. A prompt instruction to delegate competes with tools that are right there and still fails some of the time. Forcing tool calls with any does nothing to prefer Task over web_search, and a larger context only hides the symptom.

*Hint if stuck: An agent will use whatever tools it can see, so decide what the coordinator's role actually needs.*
</details>

---

## Question 58
A team adds .claude/agents/dependency-auditor.md to their repo so Claude Code can audit third-party packages for licence and CVE issues. The frontmatter has a name and description but no tools field. During one audit, the subagent ran a package upgrade through Bash and edited the lockfile. What is the right fix?

A) Add a line to the subagent's prompt saying it must only report its findings and must never modify files or run package installs
B) Add a tools field listing only read-only tools such as Read, Grep and Glob, since an omitted field inherits everything
C) Require plan mode for the whole repository so every Claude Code session asks for approval before any file change
D) Rename the subagent to dependency-reader so that its description signals read-only intent to the main agent

<details>
<summary>Answer & explanation</summary>

**B)** A subagent with no tools list inherits every tool available to subagents, including Bash and Edit, so the audit role was over-provisioned. Listing only read-only tools removes the capability, and a tool left out is simply absent from the subagent's session. A prompt prohibition remains probabilistic, plan mode for every session penalises all other work to fix one agent, and renaming changes routing hints, not capability.

*Hint if stuck: Check what a subagent gets when its tool list is left unspecified.*
</details>

---

## Question 59
A support system routes conversations to billing, returns, and account subagents. Roughly 15% of conversations in every specialty need a human handoff, but only the coordinator holds escalate_to_human, so each specialist must return control, and the coordinator often escalates with a thin summary that loses the specialist's findings. What is the best change?

A) Have each specialist return its full conversation transcript to the coordinator so it can write a richer escalation summary
B) Merge the three specialists into one agent that holds every billing, returns, account, and escalation tool together
C) Give each specialist a small escalate_to_human tool with a structured summary schema, keeping all other cross-role tools off
D) Add an escalation subagent that the coordinator invokes, which re-interviews the customer before passing the case on

<details>
<summary>Answer & explanation</summary>

**C)** Escalation is a frequent need shared by every role, which is exactly when a small cross-role tool belongs on each specialist; the agent with the findings writes the structured handoff. Passing full transcripts bloats the coordinator and still relies on it to summarise well. Merging roles recreates the oversized toolset, and re-interviewing the customer adds latency and frustration without preserving the specialist's work.

*Hint if stuck: Ask which agent holds the knowledge the handoff needs, and how common that need is across roles.*
</details>

---

## Question 60
To ship faster, a support team gave its refunds agent one tool, admin_api, which accepts any HTTP method and path on the internal commerce API. In a recent incident the agent 'resolved' a complaint by calling a PATCH endpoint that changed a customer's subscription tier. What should the architect do?

A) Keep admin_api but add a detailed description listing the endpoints the agent is permitted to call for refunds
B) Move admin_api behind a second reviewer agent that approves or rejects each call the refunds agent proposes
C) Keep admin_api but require the agent to explain its intended call in plain text before each request so that reviewers can audit it
D) Replace admin_api with purpose-built tools such as get_order and issue_refund whose parameters cover only refund actions

<details>
<summary>Answer & explanation</summary>

**D)** A do-anything tool gives the agent capabilities far outside its role, and no description can make it safe. Narrow tools whose schemas only express refund operations remove the failure class. Describing permitted endpoints is a prompt-level fence on an over-broad tool, narrating intent creates an audit trail but blocks nothing, and a reviewer agent is model-on-model checking of a capability the role never needed.

*Hint if stuck: Consider whether the tool's own shape lets the agent act outside its job.*
</details>

---

## Question 61
A support coordinator must begin every conversation with classify_request, whose output drives routing. The team set tool_choice to any on the opening request, but in 9% of conversations the model instead opens with lookup_order because the customer mentioned an order number, and routing then runs without a classification. Which change fixes this?

A) Force classify_request by name on the opening request, then use auto for the requests that follow it
B) Keep any but rewrite the classify_request description to say it must always be called before any other tool
C) Remove lookup_order from the coordinator so that classify_request is the only plausible tool on its opening turn
D) Switch the opening request to auto and add a code check that retries the turn when no classification was produced

<details>
<summary>Answer & explanation</summary>

**A)** The any setting guarantees that some tool is called, not which one; when a specific tool must run, forcing it by name on that request is the deterministic answer, and relaxing to auto afterwards lets the conversation proceed. A stronger description is still a probabilistic nudge. Removing lookup_order breaks later turns that legitimately need it, and retry-on-miss under auto spends extra calls to achieve what forcing gives directly.

*Hint if stuck: Distinguish guaranteeing a tool call from guaranteeing a particular tool call.*
</details>

---

## Question 62
An expense-processing pipeline sends each scanned receipt to Claude with a single tool, record_receipt, whose input schema holds merchant, date, total, and tax lines. With tool_choice left at auto, about 6% of responses are a prose description of the receipt, which the downstream parser rejects. What is the most direct fix?

A) Append 'Respond only by calling record_receipt' to the user message and lower the temperature to zero
B) Set tool_choice to force record_receipt on these requests so every response is a call to that tool
C) Add a regex fallback that extracts merchant, date and totals from prose whenever no tool call is returned
D) Retry each prose response up to three times with auto and fail the receipt if no tool call appears

<details>
<summary>Answer & explanation</summary>

**B)** When the request exists only to produce one structured call, forcing that named tool makes the tool call guaranteed rather than likely. Stronger wording and temperature still leave a failure rate. A regex fallback builds a second, brittle extraction path for prose that should never have been produced, and retries spend calls on a problem that configuration removes.

*Hint if stuck: The request has exactly one acceptable kind of response.*
</details>

---

## Question 63
A claims-intake pipeline forces extract_claim on every uploaded document. Auditors find that for faxes that are badly smudged or are not claims at all, the pipeline still returns complete-looking extractions with invented policy numbers. The team needs a guaranteed structured response but not a fabricated one. Which configuration should they use?

A) Keep forcing extract_claim and add a confidence field to its schema so downstream code can discard low-confidence extractions
B) Switch to auto so the model can reply in prose when a document is unreadable, and route prose to manual review
C) Add a flag_unprocessable tool beside extract_claim and set tool_choice to any so one of the two is always called
D) Keep forcing extract_claim but make every field nullable so the model can leave unknown values empty

<details>
<summary>Answer & explanation</summary>

**C)** Forcing a single extraction tool leaves the model no legitimate way to say the input is unusable, so it fills the schema. Offering a structured escape-hatch tool with any keeps the guaranteed tool call while letting the model choose the honest path. A self-reported confidence field is still produced under pressure to fill the form, auto reintroduces unstructured prose, and nullable fields help with partial documents but do not signal that the document is not a claim at all.

*Hint if stuck: If the model must call a tool, make sure one of the tools it can call matches the honest answer.*
</details>

---

## Question 64
A purchase-order extraction agent must confirm that each extracted vendor ID exists, which it needs on nearly every document. Today it holds a general run_sql tool against the procurement database for this purpose, and a review found queries that joined payroll tables while 'investigating' a vendor. What is the best tool design?

A) Keep run_sql but restrict its description to the vendors table and add a prompt rule against reading other tables
B) Keep run_sql but have a validation subagent review each query the extraction agent writes before it is executed
C) Remove database access and let the agent mark every vendor ID as unverified for a human to check afterwards
D) Replace run_sql with a read-only lookup_vendor tool that takes a vendor ID and returns only the registry record

<details>
<summary>Answer & explanation</summary>

**D)** The frequent, legitimate need is a vendor lookup, so a narrow tool shaped to that one question serves the role and removes the ability to wander into unrelated data. Restricting a general SQL tool by description and prompt leaves the capability in place. Removing access pushes a routine check onto humans for every document, and a reviewing subagent adds cost while still relying on model judgment over an over-broad tool.

*Hint if stuck: Shape the tool around the question the agent actually needs answered.*
</details>

---

## Question 65
A developer-productivity agent connects to five MCP servers (GitHub, Jira, Confluence, Sentry, and an internal deploy server), exposing 31 tools. It has a code-exploration subagent and a release-notes subagent, both defined without tool restrictions. The exploration subagent now regularly files Jira tickets and triggers preview deploys while 'investigating'. Which change best addresses this?

A) Give the exploration subagent an explicit tool list of Read, Grep, Glob and the GitHub read tools it actually needs
B) Add to the exploration subagent's prompt that it must never call Jira or deploy tools while exploring code
C) Disconnect the Jira and deploy servers from the project so that no agent in the system can call them at all
D) Add a PreToolUse hook that blocks deploy calls from every agent but leaves the Jira tools available to the exploration subagent

<details>
<summary>Answer & explanation</summary>

**A)** Without a tools list the subagent inherits every tool, including all MCP servers, so it both misuses off-role tools and chooses among 31 options. Scoping it to its role's handful of tools fixes both problems. A prompt rule leaves the tools in view, disconnecting servers breaks the release-notes work that needs Jira, and a hook on deploy alone leaves Jira misuse and the oversized selection space untouched.

*Hint if stuck: Each subagent should see only the tools its role needs, including MCP tools.*
</details>

---

## Question 66
An internal assistant helps engineers understand a 15-year-old billing monolith. It runs one general subagent holding Read, Grep, Glob, Edit, Write and Bash for both exploration and later refactors. Engineers complain that during pure exploration it sometimes 'tidies' files it was only asked to explain. What design should the architect adopt?

A) Keep one subagent and add a mode flag in its prompt that switches it between exploring-only and editing behaviour on each request
B) Split it into a read-only explorer with Read, Grep and Glob and a separate modifier subagent with editing tools
C) Keep one subagent and turn on Git hooks that reject any commit made while the assistant is in exploration
D) Keep one subagent but cap it at ten tool calls per explanation so it has no budget left for unrequested edits

<details>
<summary>Answer & explanation</summary>

**B)** Separating roles lets the exploration agent carry only read tools, so it cannot modify code no matter how it interprets a request, while refactors go to an agent built for editing. A prompt mode flag is a soft switch over the same capabilities. Commit hooks catch changes after files are already altered, and a tool-call cap is a budget, not a role boundary.

*Hint if stuck: Give the explaining role only the capabilities explaining requires.*
</details>

---

## Question 67
A boilerplate-generator subagent looks up the company's service templates on almost every request. The templates live behind an internal platform MCP server that also exposes 13 other tools, including rotate_credentials and scale_service. Right now the subagent is granted mcp__platform__* and has occasionally called scale_service. What is the right configuration?

A) Keep mcp__platform__* and add a system prompt section explaining that the subagent may only read templates
B) Remove the platform server entirely and paste the current template files into the subagent's system prompt
C) Grant the subagent only mcp__platform__get_template rather than the whole server's wildcard
D) Keep the wildcard but set tool_choice to force get_template on every request the subagent makes

<details>
<summary>Answer & explanation</summary>

**C)** MCP tools can be granted individually, so the subagent should get the one tool it uses frequently and nothing else from that server. A prompt explanation leaves 13 off-role tools in view. Pasting templates into the prompt goes stale and bloats context, and forcing get_template on every request would stop the subagent from finishing with generated code.

*Hint if stuck: A server-wide wildcard is broader than the role's actual need.*
</details>

---

## Question 68
A pull-request review job runs Claude Code in CI. Its job is to post inline comments, but it was configured with the default tool set, and on two occasions it pushed 'fix' commits directly to contributors' branches. The team wants reviewers to stay advisory. What should they change?

A) Tell the reviewer in its prompt that it must never commit and should only post comments on the pull request
B) Run the reviewer on a forked copy of the branch so that any commits it makes never reach the contributor
C) Let the reviewer keep committing but require a human to approve the CI run before its commits are pushed
D) Restrict the job to read-only tools plus the comment-posting tool, removing Edit, Write and git-capable Bash

<details>
<summary>Answer & explanation</summary>

**D)** An advisory reviewer should hold only the tools its role needs: reading the change and posting comments. Removing editing and git capability makes direct commits impossible. A prompt rule remains probabilistic, adding a human gate keeps a capability that should not exist, and a scratch fork hides the commits rather than fixing the agent's role.

*Hint if stuck: The job's output is comments; ask which tools that requires.*
</details>

---

## Question 69
A CI review bot calls the API directly. To make sure every response produces a post_review tool call, the team set tool_choice to force post_review. Reviewers now complain that the bot no longer writes the short reasoning paragraph it used to emit before its findings, even though the prompt still asks for it. The post_review schema is shared with other bots and cannot change. What should the team do?

A) Go back to auto and instruct the model in the user message to explain its reasoning and then call post_review
B) Add a reasoning field to the post_review schema and keep forcing the tool so the explanation is captured inside the call
C) Keep forcing post_review and repeat the instruction to explain reasoning at the end of the system prompt
D) Keep forcing post_review and send a second request afterwards asking the model to justify the findings it posted

<details>
<summary>Answer & explanation</summary>

**A)** With a forced tool the API prefills the assistant turn so the model goes straight to the tool_use block and cannot emit text first, no matter what the prompt says; the documented way to get both is auto plus an explicit instruction to use the tool. Repeating the instruction cannot override the prefill. A schema reasoning field is ruled out because the shared schema cannot change, and a follow-up justification is written after the fact rather than guiding the review.

*Hint if stuck: Think about what forcing a tool does to the start of the model's response.*
</details>

---

## Question 70
An HR helpdesk assistant has tools for leave balances, payslips and policy search. To stop it from occasionally answering policy questions from memory, the team set tool_choice to any on every request. Now even 'thanks, that's all' triggers a pointless policy search before the goodbye, and employees notice the delay. What should the architect do?

A) Keep any and add a lightweight end_conversation tool the model can call when the user is simply signing off
B) Use auto and address memory answers through tool descriptions and an instruction to cite policy search results
C) Keep any but cache policy search results so the unnecessary calls on goodbyes return without noticeable delay
D) Switch to forcing policy_search by name so that at least every forced call returns relevant policy content

<details>
<summary>Answer & explanation</summary>

**B)** The any setting requires a tool call on every turn, which is wrong for a conversational assistant where some turns legitimately need none; auto restores that choice, and clear descriptions plus a grounding instruction address answering from memory. Adding a dummy sign-off tool works around a misconfiguration, caching makes the wasted call cheaper but keeps it, and forcing one named tool is even more rigid.

*Hint if stuck: Ask whether every turn in this conversation truly requires a tool.*
</details>

---

## Question 71
In a cited-report pipeline, the report-writing subagent needs author, year and venue for every source it cites, typically 30 to 50 per report. It currently asks the coordinator for each one, which spawns a search subagent per lookup and doubles total runtime. The metadata already sits in the run's citation store. What is the best fix?

A) Give the report subagent the search subagent's full web_search and fetch_page tools so it can find metadata itself
B) Have the coordinator batch all metadata requests and spawn one search subagent per report to answer them together
C) Give the report subagent a narrow get_citation_metadata tool that reads entries from the run's citation store
D) Have the report subagent write placeholder citations and let a final formatting pass fill in author, year and venue

<details>
<summary>Answer & explanation</summary>

**C)** A frequent, simple, cross-role need is best met with a small scoped tool, so the report agent reads metadata directly from the store without coordinator round trips. Handing it the full search toolkit invites off-role research. Batching still re-searches for data that already exists, and placeholders push the problem to a later pass that can mismatch citations.

*Hint if stuck: The data exists already; ask what the smallest tool is that reaches it.*
</details>

---

## Question 72
A research system uses a search subagent with 4 tools and an analysis subagent with 5. To cut one handoff and reduce latency, an engineer proposes merging them into one 'research' subagent holding all 9 tools plus 3 new ones for the next quarter. Tool-selection accuracy is currently high in both agents. How should the architect respond?

A) Approve the merge, since 12 tools is still well within the range a single capable agent can handle without any measurable degradation
B) Approve the merge and put the three new tools behind a feature flag so selection accuracy can be measured later
C) Approve the merge but add detailed routing guidance to the system prompt explaining which tool to use for each step
D) Keep the agents separate with their focused toolsets and reduce latency elsewhere, such as running independent searches in parallel

<details>
<summary>Answer & explanation</summary>

**D)** Selection quality degrades as the number of tools an agent weighs grows, and blending roles invites agents to misuse tools outside their purpose, so trading focused agents for one handoff is a poor bargain when accuracy is currently good. Latency can be recovered by parallelising independent work. Routing guidance in the prompt only partly offsets a crowded tool list, and deferring three tools still merges the two roles.

*Hint if stuck: Weigh one saved handoff against what larger toolsets do to selection.*
</details>

---

## Question 73
In a telecom support system, the account-changes subagent occasionally needs to issue a refund, in about 1% of its conversations, while the dedicated refunds subagent handles thousands daily with fraud checks built into its prompt and tools. A product manager asks to add issue_refund to the account-changes agent 'for convenience'. What should the architect recommend?

A) Leave refunds with the refunds subagent and have the coordinator route those rare cases there
B) Add issue_refund to the account-changes agent, because cross-role tools are the standard fix for shared needs
C) Add issue_refund to the account-changes agent but cap refunds at a low amount through a prompt instruction
D) Merge the account-changes and refunds subagents so every conversation has access to both sets of tools

<details>
<summary>Answer & explanation</summary>

**A)** Small cross-role tools are justified for frequent needs; a 1% case with real risk belongs with the specialist that carries the fraud checks, reached through coordinator routing. Treating every shared need as a cross-role tool spreads a sensitive capability to an agent without its safeguards. A prompt-level amount cap is not enforcement, and merging the two agents enlarges both toolsets.

*Hint if stuck: How often the need arises, and what safeguards travel with the tool, both matter.*
</details>

---

## Question 74
A shipping-manifest extraction request includes six tools: extract_manifest, lookup_port_code, web_search, send_email, create_ticket, and summarize_text, with tool_choice set to any. On ambiguous manifests the model calls web_search or summarize_text instead of extracting, and the pipeline stalls. Which change addresses the root cause?

A) Keep all six tools and rewrite every description to stress that extraction is the main goal of the request
B) Send this request only the tools the extraction step needs, extract_manifest and lookup_port_code
C) Change tool_choice from any to auto so that the model can explain in prose why a manifest is ambiguous
D) Force extract_manifest on every request in the loop, including any follow-ups that need port code lookups

<details>
<summary>Answer & explanation</summary>

**B)** Tools unrelated to the step widen the choice and give the model off-role ways to satisfy any; scoping the request to the extraction toolset fixes the cause. Rewriting descriptions keeps the distractors in play. Switching to auto loses the structured guarantee, and forcing extract_manifest on every request blocks the port lookups the step legitimately needs.

*Hint if stuck: Look at which tools on this request have any role in the step.*
</details>

---

## Question 75
A support agent is required to finish every resolved conversation with a call to log_resolution, which feeds compliance reporting. The prompt says so, yet 4% of resolved conversations end with a friendly goodbye and no log. Forcing the tool on every request is not possible because the agent cannot know in advance which turn is the last. What should the architect do?

A) Move the log_resolution requirement to the top of the system prompt and mark it as mandatory in capitals
B) Have code parse the goodbye message and write a compliance log entry from that text whenever none is called
C) When the loop ends without a log, have code send one more request with tool_choice forcing log_resolution
D) Set tool_choice to any on every request so that the agent is always obliged to call some tool before finishing

<details>
<summary>Answer & explanation</summary>

**C)** The application knows when the loop has ended, so it can deterministically issue a final request that forces the logging tool, keeping the structured log while leaving earlier turns on auto. Stronger prompt wording keeps a non-zero miss rate. Writing logs from parsed prose bypasses the schema, and any on every turn would block the agent from ever ending with text.

*Hint if stuck: Your code, not the model, knows when the conversation has ended.*
</details>

---

## Question 76
A CI test-generation agent writes unit tests and needs to run the suite on almost every iteration to see if they pass. It was given unrestricted Bash for this, and in one run it installed a new testing framework and changed the CI config. What is the best way to meet its frequent need?

A) Keep unrestricted Bash but add to the prompt that only the test command may be run and nothing else
B) Keep unrestricted Bash but review the agent's command history weekly and tighten the prompt as needed
C) Remove the ability to run tests and have a separate job report failures back on the next pipeline run
D) Replace general Bash with a run_tests tool that runs the project's test command and returns the results

<details>
<summary>Answer & explanation</summary>

**D)** The role needs one frequent capability, running tests, so a scoped tool shaped to that need serves it without granting arbitrary shell. A prompt limit over full Bash remains probabilistic. Removing test runs slows the loop to one iteration per pipeline, and weekly history review finds misuse after it has already changed the CI config.

*Hint if stuck: Match the tool to the single action the role repeats.*
</details>

---

## Question 77
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

## Question 78
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

## Question 79
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

## Question 80
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

## Question 81
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

## Question 82
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

## Question 83
A platform engineer ran `claude mcp add --transport http sentry https://mcp.sentry.example/mcp` in the team's service repo and the Sentry tools work for her. A week later, none of her five teammates see the server after pulling main, and there is no .mcp.json in the repository. What should she do?

A) Re-add the server with --scope project so it is written to .mcp.json, then commit that file for the team
B) Ask each teammate to run the same claude mcp add command on their machine so everyone ends up with the server
C) Re-add the server with --scope user, since user scope is the configuration that is shared through the repository
D) Copy her ~/.claude.json into the repository root so the team inherits her complete Claude Code configuration

<details>
<summary>Answer & explanation</summary>

**A)** claude mcp add defaults to local scope, which is private to her in this project and stored in ~/.claude.json; project scope writes .mcp.json, which is what gets shared through version control. Having everyone repeat the command works but drifts over time and misses CI. User scope is personal across her projects, not shared, and committing ~/.claude.json would leak personal settings and credentials.

*Hint if stuck: Check which scope the add command uses when you do not specify one.*
</details>

---

## Question 84
A team's .mcp.json defines a server named design-tokens that was moved to a new URL last sprint. Everyone else picked up the change, but one developer's Claude Code still calls the old, decommissioned endpoint. `claude mcp list` shows design-tokens, and months ago he had added a server with that same name while testing. What is the most likely cause and fix?

A) His Claude Code cached the old tool list, so he should clear the cache and restart the session to reconnect
B) His local-scope entry with the same name takes precedence over the project one, so he should remove that entry
C) The project .mcp.json needs a higher priority flag on the server so that it overrides any personal entries
D) Claude Code merges the two entries field by field, so he should delete the url field from his own entry

<details>
<summary>Answer & explanation</summary>

**B)** When the same server name is defined in several scopes, Claude Code uses only the highest-precedence definition, and local scope outranks project scope; the whole entry is used, with no field merging. Removing his stale local entry lets the team's project definition apply. Clearing caches would reconnect to the same stale URL, there is no priority flag in .mcp.json, and deleting one field does not merge in the project's values.

*Hint if stuck: Same name in two scopes means only one definition wins, whole.*
</details>

---

## Question 85
Engineers use Claude Code with an analytics-warehouse MCP server that offers a run_query tool. Before answering any question, the agent spends six to ten queries against information_schema just to discover which of the 400 tables exist and what they contain, and sessions often hit context limits. What should the server team add?

A) A system prompt in each repo's CLAUDE.md that lists all 400 tables with their columns and descriptions
B) A rule that limits run_query to three calls per question so exploration cannot consume so much context
C) An MCP resource exposing a table catalog with descriptions, so the agent can read it instead of exploring by query
D) A second tool, list_everything, that dumps every table, column and sample row in one single, very large tool response

<details>
<summary>Answer & explanation</summary>

**C)** MCP resources let a server expose catalogs and reference content that the agent can read directly, cutting exploratory tool calls. Pasting 400 tables into CLAUDE.md loads them into every session whether needed or not and goes stale. A call cap starves legitimate work, and a dump-everything tool trades many small exploration calls for one enormous result.

*Hint if stuck: Give the agent a map rather than making it walk every street.*
</details>

---

## Question 86
In a research system, search subagents query an internal archive MCP server that holds 60 curated collections. Traces show each subagent runs several broad search calls just to learn which collections exist and what they cover, and the coordinator cannot plan scopes because it does not know either. Which change best reduces this exploratory overhead?

A) Merge all 60 collections into a single index so that the subagents never need to know which collection they search
B) Paste the full list of 60 collections and their descriptions into the coordinator's and every subagent's system prompt
C) Add a cap of two discovery searches per subagent and let the coordinator retry any subagent that comes back empty
D) Expose the collection index as an MCP resource the coordinator and subagents read when planning searches

<details>
<summary>Answer & explanation</summary>

**D)** A collection index is exactly the kind of catalog MCP resources exist for: agents read it on demand to plan instead of discovering by trial queries. Hard-coding the list into every system prompt duplicates content that changes as collections are added. A discovery cap limits symptoms without supplying the knowledge, and collapsing collections removes the curation that makes scoped searches precise.

*Hint if stuck: The missing piece is knowledge of what exists, not more search calls.*
</details>

---

## Question 87
A support agent answers questions using a policy MCP server with a get_policy(policy_id) tool. Because it does not know which policies exist, it often guesses IDs, gets not-found errors, and retries, averaging four failed calls per conversation. The policy set changes weekly. Which design should the architect choose?

A) Have the server expose a policy catalog resource listing IDs and summaries that the agent consults first
B) Hard-code the current list of policy IDs into the agent's system prompt and regenerate the prompt every week
C) Make get_policy return the closest matching policy whenever an ID is not found, instead of an error
D) Let the agent keep guessing IDs but raise its tool-call budget so it does not run out on long conversations

<details>
<summary>Answer & explanation</summary>

**A)** A catalog resource served by the same server stays current with the weekly changes and lets the agent pick valid IDs instead of guessing. A regenerated system prompt is a manual pipeline that drifts and loads the full list into every conversation. Silent fuzzy matching hides errors and can return the wrong policy, and a larger budget pays for the guessing rather than removing it.

*Hint if stuck: The server already knows what exists; let the agent see that.*
</details>

---

## Question 88
A developer-tools team plans a sprint to build their own GitHub MCP server for Claude Code (issues, pull requests, code search) and a second server for their in-house deployment orchestrator, which has no public integration. Which plan should the architect recommend?

A) Build both custom servers so that the team controls every tool name, schema and description across all their integrations
B) Adopt an existing community or vendor GitHub MCP server, and build a custom server only for the deploy orchestrator
C) Skip MCP for GitHub and the orchestrator and have the agent call both APIs through curl commands in Bash
D) Build the GitHub server now and postpone the orchestrator, since a standard integration is the safer start

<details>
<summary>Answer & explanation</summary>

**B)** For standard integrations like GitHub, an existing community or vendor server is maintained and proven, so custom work should be reserved for systems with no existing integration, such as the in-house orchestrator. Building both spends effort recreating a solved problem. Raw curl through Bash loses typed tools and descriptions, and postponing the orchestrator invests in the wrong half.

*Hint if stuck: Spend custom-build effort where nothing already exists.*
</details>

---

## Question 89
A support organisation runs a 20-year-old in-house ticketing system with a quirky REST API and no existing MCP integration. An engineer proposes connecting the agent to a generic community HTTP-fetch server and teaching it the API through a long prompt. The alternative is a thin custom MCP server with tools like get_ticket and add_internal_note. What should the architect choose?

A) The generic HTTP-fetch server, because community servers should always be preferred over building custom ones
B) The generic HTTP-fetch server, with a PreToolUse hook that rejects any URL outside the ticketing API's host
C) A thin custom server with domain tools, since no integration exists and the agent needs safe, well-described operations
D) Neither: export tickets nightly into a shared folder and let the agent read the files with its built-in tools

<details>
<summary>Answer & explanation</summary>

**C)** Preferring community servers applies to standard integrations; when no integration exists, a custom server with narrow, well-described domain tools is the right investment. A generic fetch tool makes the agent drive a quirky API from prompt instructions and grants arbitrary calls; a host filter narrows destinations but still allows any endpoint or method. Nightly exports go stale and cannot write internal notes.

*Hint if stuck: The prefer-community guideline has a condition attached to it.*
</details>

---

## Question 90
A team builds a literature-review agent with the Agent SDK and passes a papers MCP server in mcpServers. The system init message shows the server as connected and lists its mcp__papers__ tools, yet the agent never calls them in headless runs and falls back to web search. allowedTools contains only Read and WebSearch. What should they change?

A) Set permissionMode to bypassPermissions so that every tool, including the MCP ones, runs without approval
B) Set permissionMode to acceptEdits so that the agent no longer pauses for approval before calling tools
C) Rewrite the papers tool descriptions so the model prefers them over WebSearch for academic queries
D) Add mcp__papers__* to allowedTools so the server's tools are approved for use in these runs

<details>
<summary>Answer & explanation</summary>

**D)** MCP tools need explicit permission; the agent can see them but cannot call them until they are allowed, and a wildcard in allowedTools grants exactly that server. bypassPermissions also works but disables most other safety prompts, which is broader than needed. Better descriptions do not help a tool that is not permitted, and acceptEdits covers file edits, not MCP tools.

*Hint if stuck: Visible is not the same as permitted.*
</details>

---

## Question 91
A support agent built on the Agent SDK registers an orders MCP server under the key orders in mcpServers. To auto-approve its search tool, the developer added search_orders to allowedTools, but every call still stops for a permission decision in the headless service. What is wrong?

A) The allowedTools entry must use the full name mcp__orders__search_orders rather than the bare tool name
B) MCP tools cannot be auto-approved at all, so the service must handle permission requests in a callback
C) The server must be moved into a project .mcp.json file, because allowedTools only applies to file-based servers
D) The tool needs to be renamed on the server to orders_search_orders so the SDK can match it to its server

<details>
<summary>Answer & explanation</summary>

**A)** MCP tools are named mcp__<server-name>__<tool-name>, and permission rules must use that full name, so the bare search_orders entry matches nothing. MCP tools can be auto-approved through allowedTools, servers passed in code are permitted the same way as file-based ones, and renaming the tool on the server does not change the prefix the SDK applies.

*Hint if stuck: Look at how the SDK names tools that come from an MCP server.*
</details>

---

## Question 92
A nightly competitive-intelligence run uses the Agent SDK with an internal filings MCP server. Last week the server's credentials expired; the init message reported it as needs-auth, the run carried on without it, and the published report cited only public web sources with no sign that internal filings were missing. What should the architect add?

A) A prompt instruction telling the agent to mention in the report whenever it cannot reach the filings tools
B) A check of each server's status in the init message that fails or flags the run when filings is failed or needs-auth
C) A retry wrapper that re-runs the whole job up to three times whenever the final report contains no filings citations
D) A larger MCP_TIMEOUT so the filings server has more time to connect before the first turn of the run begins

<details>
<summary>Answer & explanation</summary>

**B)** A server that fails to connect does not throw; the run continues without its tools, so the application should read the server statuses in the init message and stop or flag the run when a required server is failed or needs-auth. Asking the model to notice is unreliable because it may not know the tools were ever expected. Re-running on missing citations repeats the same auth failure, and a longer timeout does not fix expired credentials.

*Hint if stuck: The SDK tells you each server's status before work begins.*
</details>

---

## Question 93
An open-source project runs Claude Code headlessly with claude -p to review every pull request, including PRs from forks. A maintainer notices that a fork PR could add a new server to the repository's .mcp.json, and that in non-interactive runs project-scoped servers load without the approval prompt developers see locally. How should the CI job be configured?

A) Add an instruction to the review prompt telling Claude to ignore any MCP server that a pull request introduces
B) Keep loading .mcp.json but require a maintainer to approve each PR before the CI review job is allowed to run
C) Run with --strict-mcp-config and pass only a CI-owned MCP config, so servers in the PR's .mcp.json are ignored
D) Delete the repository's .mcp.json and ask every contributor to configure the shared servers at local scope

<details>
<summary>Answer & explanation</summary>

**C)** In claude -p runs the project-server approval prompt cannot appear, so a PR could introduce a server that loads automatically; --strict-mcp-config with a CI-controlled config keeps the job's servers out of the PR author's hands. A prompt instruction does not stop a server from loading and running. Gating on maintainer approval adds friction to every PR and still trusts the edited file once approved, and deleting .mcp.json breaks the team's shared setup.

*Hint if stuck: In CI, who should control which servers start: the pipeline or the pull request?*
</details>

---

## Question 94
A team's committed .mcp.json configures a code-quality server with headers set to Bearer ${QUALITY_TOKEN}. Locally it works for everyone, but in the CI review job the server rejects every request as unauthorized, and `claude mcp list` in the job prints a warning about an unresolved variable. What is the right fix?

A) Commit a CI-only copy of .mcp.json that contains the literal token value so the job never depends on expansion
B) Move the server to user scope on the CI runner image so that its configuration is stored outside the repo
C) Change the header to ${QUALITY_TOKEN:-ci-default} so that the job falls back to a default token when unset
D) Expose the token to the CI job as an environment variable named QUALITY_TOKEN from the CI secret store

<details>
<summary>Answer & explanation</summary>

**D)** When a referenced variable has no value, the config loads with the literal ${VAR} text and Claude Code warns; the fix is to supply the variable in the CI environment from its secret store. Committing the literal token defeats the reason for expansion. A default value would itself be a secret in the repo, and baking a user-scope config into the runner image duplicates configuration the project file already handles.

*Hint if stuck: The config is fine; something it refers to is missing in one environment.*
</details>

---

## Question 95
A team's shared .mcp.json points a feature-flags MCP server at the production flags API. Developers want local sessions to hit staging by default, while the release pipeline must keep using production. Today two engineers edit the URL by hand before each session and occasionally commit the change. What configuration should the team adopt?

A) Set the url to ${FLAGS_API_URL:-https://staging.flags.internal}/mcp, with the release pipeline setting FLAGS_API_URL
B) Keep two committed files, .mcp.staging.json and .mcp.prod.json, and have engineers copy the right one into place
C) Have each developer add a user-scope entry pointing at staging and remove the server from the shared .mcp.json
D) Point the shared file at staging and have the pipeline run sed over .mcp.json to swap in the production URL

<details>
<summary>Answer & explanation</summary>

**A)** Environment variable expansion supports defaults, so one committed file can target staging unless the pipeline sets the variable to production. Copying between two files and rewriting with sed are the same hand edits that caused accidental commits, just moved around. Pulling the server into personal user scope loses the shared configuration and still leaves the pipeline needing its own setup.

*Hint if stuck: Expansion can carry a fallback value.*
</details>

---

## Question 96
An observability MCP server offers get_logs(service), which returns every log line from the past 24 hours. In Claude Code, results routinely exceed the output limit, Claude Code warns about oversized output, and the agent misses the relevant errors buried in the middle. A developer proposes raising MAX_MCP_OUTPUT_TOKENS to 200,000. What should the architect recommend instead?

A) Raise MAX_MCP_OUTPUT_TOKENS as proposed, since the agent should see complete logs before it diagnoses anything
B) Add filter and paging parameters such as time window, level and query so the tool returns focused results
C) Have the agent call get_logs several times in a row and piece the oversized outputs together in its context
D) Wrap get_logs in a summarizer subagent that receives the full output and returns a short digest to the main agent

<details>
<summary>Answer & explanation</summary>

**B)** The root problem is a tool that returns far more than the task needs, so the server should let the agent ask for a narrow slice. Raising the limit floods context with irrelevant lines and makes the needle harder to find. Stitching repeated calls returns the same oversized data, and a summarizer subagent still has to digest a full day of logs and may drop the decisive line.

*Hint if stuck: Change what the tool returns, not how much of it is allowed through.*
</details>

---

## Question 97
An invoice-extraction pipeline uses a community Postgres MCP server so the agent can check extracted vendor and PO numbers against the ERP database. The server's single execute_sql tool runs any statement, and the prompt says 'only SELECT queries'. Security wants a guarantee that the agent can never change ERP data. What should the team do?

A) Strengthen the prompt with examples of forbidden statements and a warning that write attempts will be audited
B) Add a validation subagent that reviews each SQL statement and approves it only when it begins with SELECT
C) Configure the server in its read-only mode and connect it with a database role that has only SELECT rights
D) Replace the database server with nightly CSV exports of the vendor and PO tables that the agent reads as files

<details>
<summary>Answer & explanation</summary>

**C)** A guarantee needs enforcement outside the model: the server's read-only setting rejects writes, and a SELECT-only database role backs it up at the database. Prompt warnings and examples remain probabilistic. A reviewing subagent can be fooled by statements that start with SELECT but still modify data, and nightly exports give up live validation to solve a configuration problem.

*Hint if stuck: Guarantees come from configuration and credentials, not instructions.*
</details>

---

## Question 98
After a team rewrote their monorepo-search MCP tool's description to be detailed, Claude Code now calls it for everything, including searching a single file the user has open, where a local Grep would answer in milliseconds. Cross-repo queries work well. What is the best adjustment?

A) Revert to the short description, since the old Grep-first behaviour was faster for most everyday questions
B) Add a CLAUDE.md rule telling Claude to try Grep first and fall back to the MCP tool only when Grep finds nothing
C) Remove Grep from Claude Code's allowed tools so that every search goes consistently through the MCP server
D) Extend the description to say when not to use the tool, such as searches within the current repo or an open file

<details>
<summary>Answer & explanation</summary>

**D)** Good tool descriptions say when to use a tool and when not to, so stating the boundary keeps the cross-repo win while sending local lookups back to Grep. Reverting the description brings back the original miss on cross-repo queries. Removing Grep forces slow remote searches for trivial lookups, and a Grep-first rule misroutes cross-repo questions whenever local Grep finds a partial match.

*Hint if stuck: A description can draw the line on both sides.*
</details>

---

## Question 99
A research coordinator built with the Agent SDK has search, analysis and report subagents. Only the analysis subagent should query the internal data-warehouse MCP server, which exposes sensitive revenue tables, but today every subagent inherits the server's tools and the report writer has run ad hoc warehouse queries. Which configuration fits best?

A) Give the analysis subagent the warehouse tools in its definition and list explicit tools for the others that exclude them
B) Keep the warehouse on the main session and tell the search and report subagents in their own prompts never to query it
C) Run the warehouse server only during the analysis phase and shut it down before the report subagent is spawned
D) Let every subagent keep access but log each warehouse query so that the data team can review any misuse weekly

<details>
<summary>Answer & explanation</summary>

**A)** Subagent definitions can scope tools per role, including MCP servers and their tools, so the warehouse belongs only on the analysis subagent and the others get explicit lists that leave it out. Prompt prohibitions leave sensitive tools in view. Starting and stopping servers by phase is fragile orchestration that breaks when phases overlap, and weekly log review only detects misuse after the data is exposed.

*Hint if stuck: Grant the sensitive server to the one role that needs it.*
</details>

---

## Question 100
A team's design-docs MCP server exposes each architecture decision record as a resource. A developer refactoring the payments module wants Claude Code to follow ADR-042 exactly, but when she says 'check our ADRs' the agent calls a search tool, gets several partial matches, and sometimes follows the wrong record. What should she do?

A) Paste the full text of ADR-042 from the wiki into her prompt each time she asks Claude to work on payments
B) Reference the resource directly with an @ mention of ADR-042 so its contents are attached to her request
C) Ask the server team to remove the search tool so the agent has no choice but to read all of the ADR resources
D) Add a CLAUDE.md line saying that ADR-042 always applies to the payments module and should be searched for first

<details>
<summary>Answer & explanation</summary>

**B)** MCP resources can be referenced with an @ mention in Claude Code, which attaches that exact resource instead of relying on a search to find it. Pasting text by hand is error-prone and can drift from the source record. Removing the search tool hurts everyone else's discovery, and a CLAUDE.md rule still depends on the same unreliable search to locate the record.

*Hint if stuck: When you already know exactly which resource you need, you do not have to search for it.*
</details>

---

## Question 101
A CI job that runs Claude Code to generate tests uses a stdio MCP server for coverage data. The server spends about 40 seconds loading a coverage index at startup, and roughly half of CI runs report the server as failed and proceed without coverage data, producing redundant tests. Which change addresses this most directly?

A) Add an instruction asking Claude to wait for the coverage server before generating any tests in the job
B) Raise MAX_MCP_OUTPUT_TOKENS so that the coverage index can be returned in full once the server connects
C) Raise the MCP connection timeout through MCP_TIMEOUT in the CI job so the server can finish starting
D) Retry the whole CI job automatically whenever the generated tests duplicate tests that already exist

<details>
<summary>Answer & explanation</summary>

**C)** Connections time out after 30 seconds by default, and MCP_TIMEOUT raises that startup limit so a slow server can connect; pre-warming or a lighter index are further options. A prompt instruction cannot make the client wait for a connection that has already failed. The output token limit governs result size, not startup, and retrying on duplicates repeats the same race.

*Hint if stuck: The failure happens before any tool is called.*
</details>

---

## Question 102
A developer wants to try an experimental build of the team's code-review MCP server, which is defined in the shared .mcp.json as review-bot, for a week on his own machine. He must not affect teammates, the shared file, or CI. What is the cleanest way to do this?

A) Edit the url in the shared .mcp.json locally and be careful never to stage that file while the experiment runs
B) Create a branch whose .mcp.json points at the experimental build and work only on that branch for the week
C) Add the experimental build at user scope under the same name, since user scope outranks project scope on every machine
D) Add a local-scope entry named review-bot pointing at the experimental build, which overrides the project entry only for him

<details>
<summary>Answer & explanation</summary>

**D)** Local scope is private to him in this project and takes precedence over a project entry with the same name, so it swaps the definition for him alone and is removed cleanly afterwards. Editing the shared file locally risks an accidental commit. User scope ranks below project scope, so it would not override the team entry, and a branch-specific .mcp.json leaks into any pushes and blocks normal work on main.

*Hint if stuck: Think about which scope is both private and higher precedence than project.*
</details>

---

## Question 103
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

## Question 104
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

## Question 105
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

## Question 106
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

## Question 107
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

## Question 108
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

## Question 109
A platform engineer at a logistics company asks Claude Code which of the repository's 300 Kubernetes manifests still set the deprecated key legacy_queue_url. The agent's plan is to list every .yaml file and then Read them one at a time to look for the key. What should the agent do instead?

A) Use Glob with the pattern **/*legacy_queue_url*.yaml to collect the manifests that use the key
B) Run Grep for legacy_queue_url restricted to YAML files, then Read only the files that match
C) Read the manifests in batches of twenty so the context stays small while it scans each one
D) Ask the engineer to export the manifests into one combined file so a single Read covers all of them

<details>
<summary>Answer & explanation</summary>

**B)** The question is about file contents, so Grep with a YAML file filter finds every manifest containing the key in one call, and Read is reserved for the handful of hits. Glob only matches file paths, so a name pattern cannot tell which manifests contain the key. Reading in batches still pulls all 300 files into context, and asking for a combined export pushes tool work onto the human.

*Hint if stuck: Ask whether the thing you are looking for lives in file names or inside the files.*
</details>

---

## Question 110
A developer-productivity agent is asked where the PAYMENT_TIMEOUT_MS environment variable is consumed in a 900-file Node service. It starts reading src/ file by file, and after 45 full-file reads the session is near its context limit with no answer yet. Which change to the agent's approach fixes this?

A) Have the agent summarize each file after reading it and then discard the raw contents from its notes
B) Raise the session's context budget so the agent can finish reading every file under src/
C) Grep for PAYMENT_TIMEOUT_MS to get the exact files and lines, then Read just those locations
D) Use Glob to list files whose names contain config or env, and Read those files before any others

<details>
<summary>Answer & explanation</summary>

**C)** A single Grep for the variable name returns the exact files and line numbers, so the agent reads a few targeted regions instead of the whole tree. Summarizing after each read still pays the cost of reading everything, and a bigger budget only delays the same waste. Guessing by file names with Glob misses consumers that live in ordinary service files.

*Hint if stuck: The cheapest way to find a known identifier is to search for it, not to read toward it.*
</details>

---

## Question 111
While refactoring a 700-line billing module, Claude Code must rename the constant MAX_RETRY_MS to MAX_RETRY_DELAY_MS. The constant appears 31 times in that file, and every occurrence should change. Edit refuses the change because old_string is not unique. What is the best way to complete the rename?

A) Expand old_string with surrounding lines and issue 31 separate Edit calls, one for each of the occurrences in turn
B) Read the whole file and Write it back with every occurrence renamed in one full-file rewrite
C) Run sed -i through Bash across the file, since text tools handle bulk substitution better than Edit
D) Call Edit once with old_string MAX_RETRY_MS, new_string MAX_RETRY_DELAY_MS and replace_all set to true

<details>
<summary>Answer & explanation</summary>

**D)** When every occurrence should change, Edit with replace_all is the exact, single-step tool for it and keeps the change reviewable. Thirty-one context-expanded edits are slow and error-prone, and a full Read plus Write rewrite is the fallback for when Edit cannot express the change, not for a plain rename. A sed call through Bash bypasses the file-edit tool and its permission and review path for no gain.

*Hint if stuck: Uniqueness matters when one occurrence should change; consider what to do when all of them should.*
</details>

---

## Question 112
Claude Code tries to change a timeout in a Python file but Edit keeps failing with a no-match error. The agent wrote old_string from memory of what the code probably looks like, using four-space indentation, while the file actually uses tabs. What should the agent do next?

A) Read the relevant lines first, then copy the exact text, tabs included, into old_string for the Edit
B) Shorten old_string to just the number 30 so the match no longer depends on any indentation
C) Retry the same Edit a few more times, since a transient file lock is the usual cause of no-match errors
D) Switch to Write and regenerate the whole file from memory with the new timeout already in place

<details>
<summary>Answer & explanation</summary>

**A)** Edit performs exact string matching, so old_string must be copied from the file as it really is, which means reading the region first. Regenerating the whole file from memory risks silently changing other lines. A bare number like 30 is likely to appear more than once and fail the uniqueness check, and retrying an identical edit cannot fix a content mismatch.

*Hint if stuck: Exact-match tools need exact input; get it from the source, not from memory.*
</details>

---

## Question 113
An engineer exploring an event-driven order service asks Claude Code what triggers handleInvoiceCreated. Grep for that name finds only its definition and one line: bus.on('invoice.created', handleInvoiceCreated). The agent is about to report that nothing calls the handler. What is the right next step?

A) Report that the handler is effectively dead code, since Grep found no direct call sites anywhere in the repository
B) Grep for the event name string invoice.created to find the code that emits it, then Read those emitters
C) Glob for files named *invoice* and Read each of them in turn to see which one dispatches the event
D) Read the bus implementation end to end, because the dispatch logic there must contain the caller

<details>
<summary>Answer & explanation</summary>

**B)** The handler is wired through an event registration, so its real callers are whoever emits invoice.created; searching for that string finds them directly. Declaring dead code ignores the indirection the registration line plainly shows. Guessing by file names misses emitters in unrelated files, and reading the bus itself only explains the dispatch mechanism, not who sends this event.

*Hint if stuck: When a function is registered rather than called, follow the registration key.*
</details>

---

## Question 114
In a multi-agent research system, an analysis subagent works over a local mirror of 3,000 Markdown notes. To find notes that mention the compound name tirzepatide, it runs cat on every file through Bash and scans the combined output, which overflows its context. Which tool approach should the subagent use?

A) Use Glob for **/*tirzepatide*.md so only notes with the compound in their file names are opened
B) Keep cat but pipe the output through head so only the opening lines of each note are returned
C) Grep for tirzepatide with output listing matching files, then Read only the notes that match
D) Ask the coordinator to split the corpus so each of ten subagents can cat three hundred notes

<details>
<summary>Answer & explanation</summary>

**C)** Grep searches contents without loading every file into context, and a files-with-matches result gives the short list to Read. Name-based Glob misses notes that mention the compound only in their body. Truncating with head drops mentions further down each note, and splitting the cat job across ten subagents multiplies the same waste.

*Hint if stuck: Search first, read second: let a content search narrow the set before anything is loaded.*
</details>

---

## Question 115
Claude Code needed to change one port number in a 600-line docker-compose.yml. It read the file, then used Write to output the entire file with the new port. The commit also reverted three service definitions that a teammate's sync script had written to the file between the read and the write. Which practice would have prevented this?

A) Re-read the file immediately before each Write so that the regenerated copy always reflects the latest disk state
B) Ask Claude to diff its rewritten output against the original file and confirm the only change was the port
C) Lock the file through a Bash flock command while Claude regenerates it, so other processes cannot change it
D) Use Edit with a unique old_string around the port line, so only that span changes and nothing else is touched

<details>
<summary>Answer & explanation</summary>

**D)** A targeted Edit replaces only the matched span, so unrelated content, including a teammate's new services, is left alone. Re-reading before a full rewrite narrows the window but still regenerates 600 lines from the model's copy. An advisory flock does nothing against a script that never checks it, and self-diffing relies on the same model that produced the bad output.

*Hint if stuck: Pick the tool whose blast radius matches the size of the change.*
</details>

---

## Question 116
A new hire at an insurance firm asks Claude Code to explain how a refund request moves through a legacy Java service with 2,000 files. The agent has begun reading every file under src/ in alphabetical order. Which approach should it take instead?

A) Grep for the refund route string to locate the entry point, then Read it and follow each call it makes
B) Read the build file and the README first, then infer the request path from the module list alone
C) Read files in order of size, smallest first, so more of the codebase fits before context runs out
D) Glob for every *Controller.java file and Read all of them in full, since controllers usually define the flow

<details>
<summary>Answer & explanation</summary>

**A)** Grep on the route string pins down the exact entry point, and reading outward from there follows the real execution path with only the files that matter. Reading every controller still loads many unrelated files. A README and module list describe structure but not the actual flow, and ordering reads by size is just a cheaper way of reading everything.

*Hint if stuck: Find one concrete anchor for the flow, then read outward from it.*
</details>

---

## Question 117
A CI job runs claude -p before merge to check that no test file in a 400-file suite still contains a focused test such as it.only( or describe.only(. The current prompt tells Claude to Read every test file and report any it finds, and the job takes 14 minutes. What is the better tool instruction?

A) Use Glob for **/*.only.test.ts, since focused tests are normally kept in separately named files
B) Grep the test directories for the regex \.only\( and report every file and line that matches
C) Read only the test files changed in the PR and trust that unchanged files were checked earlier
D) Split the Read work across four parallel claude -p jobs so each one reads a quarter of the suite

<details>
<summary>Answer & explanation</summary>

**B)** Grep searches the whole suite for the pattern in one pass and returns exact file and line locations, which is the right tool for a content check. Focused tests live inside ordinary test files, so a file-name Glob finds nothing. Checking only changed files assumes earlier runs were complete, and parallel reads cut wall time while keeping the wasteful approach.

*Hint if stuck: A yes-or-no question about file contents across many files is a search problem.*
</details>

---

## Question 118
Claude Code must change return cachedValue; to return freshValue; inside getPrice() in pricing.ts. The same statement also appears inside getDiscount(), which must not change. Edit fails because the string occurs twice. What is the best way to make the change?

A) Set replace_all to true, then manually restore the getDiscount() occurrence with a second Edit afterwards
B) Read the full file and Write it back with only the getPrice() occurrence changed by hand
C) Widen old_string to include the getPrice() signature and lines up to the statement, so it is unique
D) Use Bash with sed and a line number to replace the statement only on the getPrice() line

<details>
<summary>Answer & explanation</summary>

**C)** Adding enough surrounding context from getPrice() makes old_string unique, so Edit changes exactly one occurrence and the diff stays minimal. Replacing all and then undoing one is two risky edits where one would do. A full Read plus Write rewrite is the fallback when no unique anchor exists, and a line-number sed breaks as soon as the file shifts.

*Hint if stuck: Before reaching for a fallback, ask whether more context can make the anchor unique.*
</details>

---

## Question 119
A data-platform team keeps Protocol Buffer definitions in schemas/ directories scattered across 60 services. Claude Code is asked to list them all. Its plan is to Grep for the line syntax = "proto3" across the repository and treat the matches as the full list. What is the problem with that plan, and what should it do?

A) The plan is fine; Grep is the right tool for any discovery task across a large repository
B) It should Read every file under each schemas/ folder, since only reading guarantees completeness
C) It should Grep for the keyword message instead, since every proto file declares at least one message type
D) It should Glob for **/schemas/**/*.proto, because the task is about file paths, not content markers

<details>
<summary>Answer & explanation</summary>

**D)** The goal is to list files by name and location, which is exactly what Glob does; a content marker like the proto3 syntax line misses proto2 files or files without the header. Grepping for message is the same content-proxy mistake with even more false positives. Reading every file under schemas/ is wasteful when a path pattern answers the question directly.

*Hint if stuck: Match the tool to what defines membership in the set: a name pattern or a phrase inside the file.*
</details>

---

## Question 120
A retailer's support agent, built on the Agent SDK, needs to look up return-policy rules stored as 80 Markdown files in a policies/ folder. The prototype gives the agent Bash so it can run cat and grep. Security review objects that one tool can modify files or reach the network. Which tool configuration best meets the need?

A) Give the agent Read and Grep only, which cover searching and reading the policies without side effects
B) Keep Bash but add a system-prompt rule telling the agent to run only cat and grep commands
C) Remove file tools entirely and paste all 80 policy files into the system prompt at session start
D) Give the agent Write and Edit as well, so it can annotate policies it finds unclear for later review

<details>
<summary>Answer & explanation</summary>

**A)** Read and Grep do exactly what the lookup needs and cannot modify files or run arbitrary commands, which satisfies the review through least privilege. A prompt rule asking Bash to behave is a probabilistic control on an over-broad tool. Pasting every policy into the prompt bloats context on every turn, and adding Write and Edit widens the surface the review is worried about.

*Hint if stuck: Give the agent the narrowest tools that still complete the job, and enforce limits through the tool set rather than instructions.*
</details>

---

## Question 121
In a multi-agent research system, the report subagent builds a 3,000-word Markdown report by running Bash commands like echo "..." >> report.md for each paragraph. Quotes and backticks in the text keep breaking the shell commands, leaving the report with missing sections. How should the subagent produce the file?

A) Escape every quote and backtick in each paragraph before passing it to echo through Bash
B) Use Write to create report.md with its full content, and Edit for any later section changes
C) Return the report as chat text and have the coordinator paste it into a file by hand afterwards
D) Switch the Bash commands from echo to printf, which handles special characters more predictably

<details>
<summary>Answer & explanation</summary>

**B)** Write puts content into a file directly with no shell quoting, and Edit makes later section-level changes precise. Escaping and switching to printf are patches on the wrong tool and still break on unusual text. Handing the text back for manual pasting moves file work to a human and loses the automated pipeline.

*Hint if stuck: Use the file tools for file content and keep the shell for commands.*
</details>

---

## Question 122
An on-call engineer asks Claude Code why a nightly batch failed. The job's log is a 90 MB, 1.2-million-line text file. The agent reads the first few thousand lines, sees nothing alarming, and concludes the log shows no errors. What should the agent do?

A) Ask the engineer to delete the older half of the log so the remaining file fits in one Read call
B) Read the file repeatedly with increasing offsets until it has paged through all 1.2 million lines of the log
C) Grep the log for ERROR or Exception with a few context lines, then Read just the ranges around the hits
D) Accept the partial view as representative, since batch failures are usually logged near startup

<details>
<summary>Answer & explanation</summary>

**C)** A pattern search locates the failure lines anywhere in the file, and targeted Reads with offset and limit pull in only the surrounding context. Paging through the entire log spends enormous context on irrelevant lines. Deleting data to make a tool fit is destructive, and treating a partial view as complete is exactly the mistake that produced the wrong conclusion.

*Hint if stuck: When a file is too big to read, search it to find where to look.*
</details>

---

## Question 123
Claude Code is asked to update an import path from @acme/legacy-ui to @acme/ui in a monorepo. The old path appears in about 25 files, each with slightly different surrounding code. Which approach is most reliable?

A) Glob for every .ts and .tsx file in the repo, Read each one, and Write back any file containing the path
B) Write a new barrel file that re-exports @acme/ui under the old name so no imports need to change
C) Run one recursive sed through Bash across the repo, since 25 edits are too many for the file tools
D) Grep for @acme/legacy-ui to list the affected files, then Edit each import line using its exact text

<details>
<summary>Answer & explanation</summary>

**D)** Grep gives the exact set of affected files and lines, and per-file Edits change only the import lines, which keeps the change precise and reviewable. Globbing and rewriting every source file reads far more than needed and risks unintended changes. A blind recursive sed skips the exact-match safety of Edit, and a re-export shim leaves the old path in place instead of completing the migration.

*Hint if stuck: Use a search to scope the change, then a precise tool to apply it.*
</details>

---

## Question 124
A CI job asks claude -p to fix a failing unit test in a payments service. Claude edits the code, re-reads the changed function, says the logic now looks correct, and ends. The pipeline then fails on the same test. The job's tool list includes Read, Edit and Bash restricted to npm test. What should the prompt instruct Claude to do?

A) Run npm test through Bash after each edit and keep iterating until the failing test actually passes
B) Ask a second claude -p call to read the diff and judge whether the fix looks correct before the job ends
C) Explain its reasoning in detail before finishing, so reviewers can spot flaws in the fix later on
D) Re-read the edited function a second time and compare it line by line with the test's expectations

<details>
<summary>Answer & explanation</summary>

**A)** Executing the tests is the only objective check that the fix works, and the job already allows exactly that command. Re-reading code or explaining reasoning are self-assessments that missed the bug the first time. A second model reading the diff adds an opinion, not evidence, while the test runner gives a definitive result.

*Hint if stuck: Prefer a check that runs the code over one that reads it.*
</details>

---

## Question 125
A developer-productivity agent must report which packages in a 70-package JavaScript monorepo define their own lint configuration, saved as .eslintrc.json, .eslintrc.js or eslint.config.js. Which approach answers this most directly?

A) Grep every JSON and JS file for the word rules and treat each matching directory as having a config
B) Glob for the three config file names under packages/ and report the package directories they sit in
C) Read each package's package.json and infer from the dependency list whether it has its own config
D) Ask the agent to Read the root ESLint config, which lists every package-level override in the repo

<details>
<summary>Answer & explanation</summary>

**B)** The question is about the existence of files with known names, which Glob answers directly with their paths. Grepping for rules matches countless unrelated files and does not prove a lint config exists. Dependency lists show what is installed, not what is configured, and the root config does not necessarily list package-level files.

*Hint if stuck: When membership is defined by a file name, search by file name.*
</details>

---

## Question 126
Claude Code read config/routes.ts, then the editor's format-on-save reflowed the file. When Claude tries to Edit a route using the text it read earlier, the edit fails because old_string no longer matches. What is the right recovery?

A) Disable format-on-save for the rest of the session so the cached copy of the file stays accurate
B) Write the whole file from the earlier read with the route change applied, overriding the formatter's reflow
C) Re-read the file to get its current text, then retry the Edit with an old_string copied from that read
D) Shorten old_string to the route's path string alone so formatting differences no longer matter

<details>
<summary>Answer & explanation</summary>

**C)** The file changed on disk, so the agent needs a fresh read and an old_string taken from the current content. Writing from the stale copy would silently undo the formatter's changes and anything else that changed. Disabling tooling to keep a stale copy valid treats the symptom, and a bare path string may not be unique or may still differ after reflow.

*Hint if stuck: When the file has moved on, your view of it has to move on too.*
</details>

---

## Question 127
A legal-operations team at a software company needs to know every source file that still carries the old GPL-2.0 license header before a relicensing deadline. The repo has 12,000 files across 15 languages and the headers sit inside comments. Which tool approach should their Claude Code session use?

A) Glob for files named LICENSE or COPYING in each directory and treat their folders as GPL-2.0 code
B) Ask Claude to recall which languages usually use GPL-2.0 and Glob for those file extensions only
C) Read the top 20 lines of every file in the repo, since license headers always sit at the very start
D) Grep for GPL-2.0 across the repo with a file list output, then Read samples to confirm the header form

<details>
<summary>Answer & explanation</summary>

**D)** The license text lives inside files, so a content search across the repo finds every file with the header, and spot reads confirm the format. LICENSE file locations say nothing about individual source headers. Reading the top of 12,000 files is an expensive way to do a search, and guessing by language replaces evidence with assumption.

*Hint if stuck: The marker you need is inside the files, so search the contents.*
</details>

---

## Question 128
A research coordinator spawns a search subagent to find relevant passages in a local cache of downloaded papers. The subagent was given Read, Grep, Glob, Write and Bash for convenience. In one run it rewrote two cached papers while trying to clean up their formatting. What change best prevents this?

A) Restrict the search subagent's tools to Read, Grep and Glob, since its role never requires writing
B) Keep the full tool set but have the coordinator diff the cache after each run and restore any changes
C) Add a line to the subagent's prompt saying the cached papers are read-only and must not be modified
D) Mark the cached papers read-only on disk, while leaving the subagent's tool list exactly as it is

<details>
<summary>Answer & explanation</summary>

**A)** Scoping the subagent's tools to its role removes the ability to modify the cache at all, which is a deterministic control. A prompt rule is probabilistic and already failed in spirit. After-the-fact diffs and restores only clean up damage, and filesystem permissions alone leave Bash available for other unintended side effects.

*Hint if stuck: Give each subagent only the tools its role needs.*
</details>

---

## Question 129
Claude Code found the entry point of a legacy order pipeline in orders/main.py using Grep. To follow the flow, it now Greps the whole repo for each function main.py calls, such as process and validate, and gets hundreds of unrelated matches for those common names. What should it do instead?

A) Grep with case-sensitive whole-word matching so that process only matches exact function names
B) Read main.py's imports to see which modules provide those names, then Read those modules directly
C) Grep again but limit output to the first ten matches so the noise stays manageable in context
D) Glob for files named process.py and validate.py and assume those contain the functions being called

<details>
<summary>Answer & explanation</summary>

**B)** Once the entry point is known, the imports say exactly which module each called name comes from, so reading along that path follows the real flow. Whole-word Grep still matches every unrelated function or variable named process. Guessing by file names is unreliable, and capping results simply hides the matches that might matter.

*Hint if stuck: Search to find a starting point; read to follow the path from there.*
</details>

---

## Question 130
A developer asks Claude Code to add a test file for a new RefundCalculator class. The team's existing test files follow a strict layout with shared fixtures and a naming convention, but Claude writes the new test from scratch and it uses different fixture helpers and naming. What workflow should Claude follow?

A) Write the test from scratch as before, then run the linter through Bash to fix any naming problems
B) Copy an existing test file with Bash cp and use replace_all Edits to swap every class name to RefundCalculator
C) Read an existing test file for a similar class first, then Write the new file following its structure
D) Generate the test from scratch and ask the developer to point out which conventions it should follow

<details>
<summary>Answer & explanation</summary>

**C)** Reading a nearby example grounds the new file in the team's real fixtures and naming, and Write then creates it correctly. Linters catch formatting, not fixture usage or test structure. Blind copy-and-rename carries over irrelevant tests, and pushing convention discovery onto the developer skips a step the agent can do itself.

*Hint if stuck: Look at how the codebase already does it before creating something new.*
</details>

---

## Question 131
A CI job asks Claude Code to estimate the blast radius of removing the logAudit helper. Claude runs Grep in content mode, sees 12 matching lines shown before the output was cut off by its result limit, and reports that logAudit is used in only 12 places. The real number is over 300. Which change to the tool usage fixes this?

A) Ask Claude to estimate the total from the visible sample, scaling by the fraction of files it searched
B) Repeat the same content-mode Grep and trust the result, since Grep output is deterministic between runs
C) Use Glob for *audit* files and count call sites by Reading each of them in full, since Glob is never truncated
D) Run Grep in count mode or files-with-matches mode first to get the full scope, then page content as needed

<details>
<summary>Answer & explanation</summary>

**D)** Count or files-with-matches output gives the complete scope even when individual lines would be truncated, and content can then be paged with offsets. Rerunning the same limited search returns the same truncated view. File names do not reveal call sites, and extrapolating from a truncated sample is a guess dressed up as a measurement.

*Hint if stuck: Make sure you are looking at the whole result before drawing conclusions from it.*
</details>

---

## Question 132
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

## Question 133
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

## Question 134
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

## Question 135
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
