# Full Practice Exam 02 — CCAR-F simulation

Same format as the real exam guide: **60 questions, 120 minutes, scaled score out of 1000,
pass at 720.** Domain weighting: D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.
No question here appears in the other 2 printable exams.

Set a timer. No notes, no docs. For the interactive version with the clock, flags, and a score report, open the game.

---

## Question 1
You are designing a multi-agent competitive-intelligence system: Haiku scouts gather facts and a Sonnet synthesizer writes the final report. Compliance requires that every claim in the report be traceable to a specific source document. Which design satisfies this requirement?

A) Instruct the synthesizer in its system prompt that every claim included in the final report must cite the specific source document from which it came
B) Log every URL each scout fetches during research and attach the complete list of fetched sources to the report as a reference appendix
C) Have scouts bind each claim to its source and date in structured findings, and require synthesis to carry those claim-source mappings into its output
D) Run a post-hoc verification agent that searches the web for a supporting source document for each claim that appears in the finished report

<details>
<summary>Answer & explanation</summary>

**C)** Provenance survives only when claim-source mappings are first-class structured data at every stage — scouts emit them and the synthesis stage is required to preserve them through to the final output. A prompt instruction is probabilistic best-effort, a URL appendix cannot tie a specific claim to a specific source, and post-hoc re-sourcing finds a plausible source rather than the one actually used.

*Hint if stuck: Traceability has to be carried through every stage as data, not reconstructed after the fact.*
</details>

---

## Question 2
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

## Question 3
An e-commerce refund agent's policy document covers refunds up to $500 with documented approval rules. A customer requests $612 for a damaged appliance; the policy says nothing about amounts above $500. The agent spends nine turns re-reading the policy and asking the customer clarifying questions, making no progress. What should the agent's design dictate here?

A) Deny the refund, since no policy rule authorizes amounts above $500 and the agent must not exceed its mandate
B) Recognize the policy gap as a reliable escalation trigger and hand off promptly with a structured case summary
C) Approve up to the documented $500 cap and tell the customer to file separately for the remaining $112
D) Continue clarifying with the customer until the request can be reframed to fit within an existing policy rule

<details>
<summary>Answer & explanation</summary>

**B)** A request falling outside documented policy is a policy gap — one of the reliable escalation triggers — and the nine-turn no-progress loop is a second reliable trigger pointing the same direction. Denying or partially approving invents policy the agent was never given, and reframing the request manufactures a fit that does not exist.

*Hint if stuck: When the rulebook is silent, the agent's job is not to write a new rule.*
</details>

---

## Question 4
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

## Question 5
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

## Question 6
A platform team maintains 60 lines of secure-coding standards used by 14 service packages in a monorepo. Each package's CLAUDE.md currently holds a pasted copy. After the standards changed last sprint, an audit found 9 of the 14 copies were stale. How should the team restructure this?

A) Add a sync script engineers are expected to run that re-copies the standards into all 14 CLAUDE.md files
B) Move the standards into each engineer's ~/.claude/CLAUDE.md and announce updates in Slack
C) Merge all 14 package files into a single large root CLAUDE.md so there is only one copy
D) Keep one canonical standards file and reference it from each package CLAUDE.md via @import

<details>
<summary>Answer & explanation</summary>

**D)** @import composes memory files, so 14 packages can share one canonical source that updates everywhere at once with no duplication. A sync script keeps 14 duplicates on disk and depends on every engineer remembering to run it — the same human-discipline failure that produced the stale copies. User-level placement loses version control and team sharing, and one giant root file forces every session to carry all 14 packages' content.

*Hint if stuck: There is a composition mechanism that lets many CLAUDE.md files share a single source of truth.*
</details>

---

## Question 7
A developer-productivity team distributes Claude Code skills from a central repo. A bootstrap script syncs new skill folders into .claude/skills when a session opens, but engineers report that skills added that morning never auto-invoke until they manually intervene, because the skill scan happens before the sync finishes. The team wants newly synced skills available automatically in every fresh session. What should they configure?

A) A UserPromptSubmit hook that runs the sync script before each prompt is processed
B) A note in CLAUDE.md telling engineers to run /reload-skills as their first command in every session
C) A SessionStart hook that runs the sync and returns reloadSkills so the skill scan picks up the new files
D) A PostToolUse hook on Bash that triggers whenever the sync script appears in a command

<details>
<summary>Answer & explanation</summary>

**C)** SessionStart hooks run when the session opens and can return reloadSkills, which makes the harness rescan the skills directory after the sync completes, solving the ordering problem deterministically. Asking engineers to run /reload-skills works mechanically but depends on every human remembering every time, which is best-effort. Re-syncing on every UserPromptSubmit is wasteful and does not itself trigger a skill rescan, so freshly synced skills still would not auto-invoke.

*Hint if stuck: One hook event runs at session open and can ask the harness to rescan skills.*
</details>

---

## Question 8
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

## Question 9
A platform repo has Terraform files in infra/, modules/, and services/*/deploy/. The team wants Terraform conventions applied whenever Claude Code edits any .tf file, and not loaded at all during application-code work. What is the best configuration?

A) Add a Terraform section to the root CLAUDE.md
B) Put a CLAUDE.md with the conventions in each of the three directories
C) Create .claude/rules/terraform.md with paths: ["**/*.tf"] in its YAML frontmatter
D) Create a terraform skill that developers invoke whenever they work on the infrastructure

<details>
<summary>Answer & explanation</summary>

**C)** A path-scoped rule with a glob loads only when matching files are edited, wherever they live. Root CLAUDE.md always loads, per-directory CLAUDE.md files miss new locations and duplicate content, and a skill relies on someone remembering to invoke it.

*Hint if stuck: The files are spread out, but they share an extension.*
</details>

---

## Question 10
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

## Question 11
A platform team's deployment agent decides whether to execute a tool with the check: if response.content[0].type == 'tool_use'. It worked in testing, but in production the agent frequently ends with half-finished commentary like 'Let me check the rollout status first' and never runs the tool. Why?

A) tool_use blocks are only emitted when tool_choice is set to any, so the default auto setting suppresses them in production traffic and the check sees only text
B) The model often emits a text block before the tool_use block, so checking only index zero misses the call; branch on stop_reason and scan all blocks
C) The streaming API reorders content blocks nondeterministically, so the agent must disable streaming to restore positional checks
D) The model is hitting max_tokens before reaching the tool_use block, so raising max_tokens will fix the behavior

<details>
<summary>Answer & explanation</summary>

**B)** A single response can contain both text and tool_use blocks, and the narrative text frequently comes first, so a content[0] check silently drops tool calls. The robust pattern is to branch on stop_reason tool_use and iterate over all content blocks to collect every tool_use. A max_tokens truncation would surface as stop_reason max_tokens, not as this position-dependent miss, and tool_choice auto does not suppress tool calls.

*Hint if stuck: Think about what else can occupy the first slot of the content array alongside a tool call.*
</details>

---

## Question 12
A developer asks Claude Code to convert a flat CSV export into nested JSON grouped by account, then by month. After three rounds of rewording the prose description, each attempt nests the data differently. What is the most effective next step?

A) Write an even longer, more precise prose description of the nesting, covering every level in detail
B) Ask Claude to explain its interpretation before each attempt
C) Switch to a larger model, since this is a reasoning failure
D) Provide two or three concrete input rows with the exact JSON output expected for each

<details>
<summary>Answer & explanation</summary>

**D)** When prose is read inconsistently, concrete input/output examples are the clearest way to communicate a transformation. More prose has already failed three times, explanations don't pin down the target format, and model size isn't the problem.

*Hint if stuck: Show, don't tell.*
</details>

---

## Question 13
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

## Question 14
A customer support resolution agent built on the Claude API runs an agentic loop. The implementation scans each assistant response for the phrase "Ticket resolved" to decide when to stop, and caps the loop at 4 iterations as its primary completion control. Tickets sometimes close while the agent still had a pending tool call, and complex tickets get cut off mid-investigation. Which change fixes the loop?

A) Raise the iteration cap to 12 and require the agent to print TICKET RESOLVED in capital letters on its own line before the loop is allowed to exit
B) Set tool_choice to "any" on every request so the agent always calls a tool and the loop can never end prematurely on a text-only response
C) Drive the loop off stop_reason — continue on "tool_use" by executing tools and resending history, finish on "end_turn" — keeping the cap as a safety fallback
D) Treat any response containing a text block as the final answer and end the loop there, on the assumption that tool-calling turns contain only tool_use blocks

<details>
<summary>Answer & explanation</summary>

**C)** The loop's control signal is stop_reason, not assistant prose: "tool_use" means execute and continue, "end_turn" means done, and iteration caps are safety fallbacks rather than primary controls. Parsing text for a completion phrase is unreliable, and ending on any text block fails because responses can legitimately contain text and tool_use blocks together. Forcing tool_choice "any" prevents the loop from ever ending naturally, and raising the cap just patches the same broken signal.

*Hint if stuck: The API already gives you a machine-readable completion signal — do not infer completion from prose.*
</details>

---

## Question 15
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

## Question 16
An e-commerce catalog-enrichment agent processes 3,000 product listings in one long-running session. After a crash at item 1,900, the restarted agent began again at item 1 and double-wrote records into the catalog database. What fixes the recovery problem?

A) Maintain a structured manifest of item ids, per-item status, and partial results as items complete, so restarts resume from the manifest
B) Persist the full conversation transcript to disk continuously and on restart replay it through the model so the agent recalls where it stopped
C) Add a system-prompt instruction telling the agent to keep careful track of which catalog items it has already finished processing
D) Split the run into 30 separate sessions of 100 items each so that any single crash costs at most 100 items of repeated work

<details>
<summary>Answer & explanation</summary>

**A)** Durable progress state belongs in a structured manifest outside the model's context: restart logic reads it deterministically and resumes only pending items, eliminating both rework and double writes. Replaying a transcript is slow and reconstructs bloated context rather than state, a prompt instruction dies with the crashed session, and chunking merely shrinks the blast radius while a crash mid-chunk still double-writes.

*Hint if stuck: Recovery state should live in a deterministic artifact outside the model's context, not in its memory.*
</details>

---

## Question 17
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

## Question 18
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

## Question 19
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

## Question 20
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

## Question 21
An e-commerce refund system is wired as a chain: an order-analyzer subagent spawns an inventory-checker, which spawns a refund-calculator, three levels deep. When refund amounts come out wrong, engineers cannot tell which level introduced the error, and the analyzer's context fills with nested transcripts. How should the system be restructured?

A) Flatten it to hub-and-spoke: one coordinator decomposes the job, delegates to each specialist directly, and aggregates results
B) Keep the chain but require every agent in it to emit structured outputs so errors carry attribution back up through each level
C) Keep the chain but raise the analyzer's context budget so nested transcripts stop overflowing
D) Add verbose logging at each level so engineers can replay the chain after a bad refund

<details>
<summary>Answer & explanation</summary>

**A)** Daisy-chained subagents recreate the problems hub-and-spoke exists to solve: every intermediate result should return to a coordinator, where it is individually observable and where aggregation logic lives. Flattening the chain fixes both the debuggability and the nested-context bloat at once. Structured outputs within the chain — the strongest distractor — improve attribution but leave the deep nesting and tangled control flow in place, and bigger context budgets or verbose logging only patch symptoms of the flawed topology.

*Hint if stuck: Compare the topology itself against the canonical multi-agent shape.*
</details>

---

## Question 22
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

## Question 23
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

## Question 24
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

## Question 25
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

## Question 26
An SRE team's observability MCP server returns 40-plus fields per query, including raw spans and verbose metadata, though incident-triage workflows in Claude Code only ever use five of them. After about 30 minutes of triage, sessions start missing findings they surfaced earlier. What is the architectural fix?

A) Add a system-prompt line instructing Claude to ignore the irrelevant fields whenever it reads tool results
B) Have incident responders run /compact every few minutes during triage to keep the context window small
C) Add a PostToolUse hook that trims each tool result down to the five needed fields before it enters context
D) Move triage sessions to a model with a much larger context window so the verbose results all fit

<details>
<summary>Answer & explanation</summary>

**C)** PostToolUse hooks are the right place to normalize and trim verbose tool outputs, so the noise never enters context and long-session degradation stops at the source. A prompt instruction does not stop unused fields from consuming context, frequent /compact lossily summarizes the symptom instead of removing the cause, and a larger window still suffers lost-in-the-middle on a bloated history.

*Hint if stuck: Stop the bloat deterministically at the moment a tool result enters the conversation.*
</details>

---

## Question 27
An e-commerce monorepo runs a long dependency-upgrade job through claude -p that takes about nine minutes. The CI runner kills any step that is silent on stdout for five minutes, so the job dies mid-run with nothing logged. The team wants real visibility into what the job is doing, not just a way to keep the runner from killing it. What should they change?

A) Raise the runner's silence threshold to fifteen minutes for this one job
B) Wrap the step in a shell loop that echoes a heartbeat line every sixty seconds
C) Run the job with --output-format stream-json --verbose so events are emitted incrementally as they occur
D) Split the upgrade into several claude -p calls so each one finishes in under five minutes

<details>
<summary>Answer & explanation</summary>

**C)** stream-json emits each event as it happens (print mode requires --verbose alongside it), which keeps stdout active for the watchdog and gives the team a live trace of what Claude is actually doing. A heartbeat echo quiets the watchdog but reveals nothing about progress, raising the threshold just hides the observability gap, and splitting the job adds orchestration complexity while each call still runs as a silent blob.

*Hint if stuck: Think incremental events flowing out during the run, not one blob at the end.*
</details>

---

## Question 28
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

## Question 29
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

## Question 30
A fintech payments team of 12 engineers shares one repository. The tech lead wrote the team's TypeScript strict-mode and ledger error-handling standards into ~/.claude/CLAUDE.md on her laptop. Two new hires consistently generate code that violates these standards, and nobody can figure out why the rules are not being applied. What is the correct fix?

A) Have every engineer copy the standards file into their own ~/.claude/CLAUDE.md
B) Commit the standards to the project-level CLAUDE.md in the repository root
C) Store the standards as environment entries in .claude/settings.json so they apply repo-wide
D) Package the standards as a skill so Claude auto-invokes them whenever someone writes code

<details>
<summary>Answer & explanation</summary>

**B)** User-level ~/.claude/CLAUDE.md is personal memory that lives only on one machine, so teammates never load it. Team standards belong in the version-controlled project CLAUDE.md, which every clone picks up automatically. Copying files per engineer reintroduces drift; settings.json holds permissions, hooks, and env rather than coding guidance; and a skill triggers probabilistically per task, while always-relevant standards must be reliably present in memory.

*Hint if stuck: Consider which level of the CLAUDE.md hierarchy travels with the repository rather than with one person's machine.*
</details>

---

## Question 31
A 14-person platform team wants every GitHub pull request reviewed by Claude before human review. Today, reviews only happen when a developer remembers to run a review prompt locally, and about a quarter of PRs merge without one. What is the standard way to automate this?

A) A nightly cron job that batch-reviews everything merged during the previous day
B) Add claude-code-action to the repository's GitHub Actions workflow triggered on pull requests
C) A pre-push hook on each developer laptop that runs claude -p against the branch diff
D) A required PR checklist item where the author pastes the output of their local Claude review

<details>
<summary>Answer & explanation</summary>

**B)** claude-code-action is the supported GitHub Actions integration for PR review: it runs server-side on every pull request, removing the dependency on individual developer discipline. Laptop hooks and checklist items still rely on each developer's machine and memory, and a nightly batch review lands after merge — too late to gate anything.

*Hint if stuck: Pick the mechanism that runs server-side on every PR regardless of what any developer remembers to do.*
</details>

---

## Question 32
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

## Question 33
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

## Question 34
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

## Question 35
A fintech support agent handles a disputed charge of $147.23. The conversation runs 25 turns, and the agent uses progressive summarization to keep the history manageable. At turn 22 the agent offers the customer a refund of $47 — the exact figure has eroded through repeated summarization passes. What is the root-cause fix?

A) Strengthen the summarization prompt with 'always preserve monetary amounts exactly as written' so figures survive each pass
B) Disable summarization and rely on a model with a larger context window so the raw 25-turn history stays verbatim
C) Keep exact figures, IDs, and dates in a structured case-facts block outside the summarized history
D) Re-run the transaction lookup tool on every turn so the disputed amount is always freshly loaded in context

<details>
<summary>Answer & explanation</summary>

**C)** Progressive summarization is lossy by design, so exact values must live in a structure that is never summarized. A case-facts block carried verbatim in every request guarantees $147.23 survives to turn 22. Prompting the summarizer to be careful is probabilistic best-effort, keeping the entire raw history merely trades erosion for mid-context burial and ever-growing cost, and re-running the lookup every turn wastes tokens while patching the symptom.

*Hint if stuck: Ask which data should be exempt from a lossy process rather than asking the lossy process to be careful.*
</details>

---

## Question 36
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

## Question 37
A due-diligence system spawns one subagent per source type — SEC filings, news coverage, earnings-call transcripts — and each returns a free-prose summary. The coordinator's final memo asserts 'revenue grew 40%', but analysts cannot trace which source said it, and the filings and a news article actually disagreed. What design change fixes this?

A) Require subagents to return structured outputs that map each claim to its source and date
B) Prompt the coordinator to always cite sources when it writes the final memo
C) Have the coordinator re-fetch all the underlying documents itself and verify every figure before the memo is published
D) Pass the subagents' full raw transcripts into the coordinator's context instead of summaries

<details>
<summary>Answer & explanation</summary>

**A)** Attribution must be preserved at the boundary where it is lost: prose summaries strip provenance, so subagents should emit structured claim-source-date records the coordinator can carry into synthesis, keeping conflicting claims visible with temporal metadata. Prompting the coordinator to cite cannot work because the source information never reached it. Forwarding raw transcripts bloats the hub's context, and re-fetching duplicates the subagents' entire job.

*Hint if stuck: Find the exact point in the pipeline where provenance is destroyed.*
</details>

---

## Question 38
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

## Question 39
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

## Question 40
A research pipeline runs 12 scout subagents that each fetch one source and extract publication dates and key claims — mechanical work — plus one synthesizer that writes the final competitive analysis. Analysts trigger it on demand and wait for the memo, and each run costs about $40 with everything on Opus. How do you cut cost with the least quality risk?

A) Move the whole pipeline, scouts and synthesizer alike, onto Haiku
B) Reduce the scout count from 12 to 3 so fewer Opus invocations occur
C) Submit the synthesizer's final call through the Batch API for the 50% discount
D) Set model: haiku in the scout agents' frontmatter and keep the synthesizer on Opus

<details>
<summary>Answer & explanation</summary>

**D)** Per-agent model selection is the point of the model field in .claude/agents/ frontmatter: simple fetch-and-extract scout work suits Haiku, while the quality-critical synthesis stays on a stronger model. Moving everything to Haiku risks the final analysis, and cutting scouts from 12 to 3 trades cost for coverage gaps. The Batch API has no latency SLA and can take up to 24 hours, which breaks an on-demand pipeline, and it discounts only one call while 12 Opus scouts drive most of the spend.

*Hint if stuck: Match model capability to each role's difficulty instead of pricing the whole pipeline uniformly.*
</details>

---

## Question 41
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

## Question 42
A nightly CI job runs claude -p 'Audit every changed package for license violations' --allowedTools 'Read,Grep,Glob,Bash'. The prompt tells the coordinator to delegate each package to a subagent, but it never spawns any — it scans everything itself and exhausts its context window on large diffs. What is wrong?

A) Headless print mode cannot spawn subagents; the audit must run in an interactive session
B) The Task tool is missing from allowedTools, so the coordinator has no way to spawn subagents; add Task to the list
C) The prompt needs firmer wording such as 'you MUST delegate every package to a subagent'
D) Subagent support in CI requires exporting CLAUDE_SUBAGENTS=true before invoking claude -p

<details>
<summary>Answer & explanation</summary>

**B)** Spawning subagents happens through the Task tool, so Task must appear in allowedTools like any other tool; without it the coordinator can only do the work inline. Headless mode supports subagents fine, and CLAUDE_SUBAGENTS is not a real variable. Stronger prompt wording cannot grant a capability the tool allowlist has removed.

*Hint if stuck: Delegation itself happens through a tool, and tools must be permitted.*
</details>

---

## Question 43
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

## Question 44
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

## Question 45
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
A customer-support team ships a skill that drafts refund-decision emails. Compliance requires that this skill never execute shell commands. The SKILL.md body states Never use Bash in bold, yet audit logs from last week show two sessions where the skill ran Bash anyway. What is the root-cause fix?

A) Repeat the prohibition in all caps at both the top and bottom of the skill body
B) Declare allowed-tools in the SKILL.md frontmatter listing only the tools the skill needs
C) Add a project-wide PreToolUse hook that blocks every Bash invocation in the repository
D) Lower the sampling temperature so the model follows the skill's instructions more reliably

<details>
<summary>Answer & explanation</summary>

**B)** Instructions in a skill body are probabilistic; allowed-tools in the frontmatter is a deterministic restriction the harness enforces, scoped exactly to this skill. The project-wide hook is also deterministic but overbroad — it breaks every other workflow that legitimately needs Bash. Stronger wording and temperature tweaks leave compliance to chance.

*Hint if stuck: Look for the deterministic enforcement mechanism whose scope matches the thing being restricted.*
</details>

---

## Question 48
An edtech React app keeps 80 lines of test-writing guidance (React Testing Library queries, a ban on snapshot tests) in its project CLAUDE.md, so every session loads it — including backend-only work. Test files are colocated with their components as *.test.tsx throughout src/. How should this guidance be scoped?

A) Keep it in CLAUDE.md but preface it with: apply the following section only when editing test files
B) Move it to .claude/rules/testing.md with paths: ["**/*.test.tsx"] in the YAML frontmatter
C) Add a directory-level CLAUDE.md inside a central __tests__ folder that holds the guidance
D) Convert the guidance into a slash command that engineers run before starting test work

<details>
<summary>Answer & explanation</summary>

**B)** .claude/rules/ files with a paths glob in their frontmatter apply only when matching files are in play, which is exactly the scoping needed for colocated test files. A prose preface still loads all 80 lines everywhere and relies on the model to self-filter. A __tests__ directory CLAUDE.md cannot work because the tests are colocated, and a slash command depends on engineers remembering to run it.

*Hint if stuck: One mechanism attaches guidance to file patterns rather than to directories or whole sessions.*
</details>

---

## Question 49
An architect auditing an insurance-claims platform finds 24 skills, each with a SKILL.md body around 400 lines. Assuming every session pays the full cost of all of them, she drafts a plan to consolidate down to five skills. Which statement should change her plan?

A) Only frontmatter metadata loads at session start; a body loads when its skill triggers, so 24 well-described skills are fine
B) Every SKILL.md body loads into context at session start, so consolidating to five skills is the correct move
C) Skills contribute nothing to context until invoked, including their descriptions, so auto-invocation needs a settings.json entry
D) Bodies load at session start but /compact evicts them, so scheduled compaction solves the cost without consolidating

<details>
<summary>Answer & explanation</summary>

**A)** Progressive disclosure means only the lightweight frontmatter — notably the description — is resident up front; the 400-line bodies cost nothing until a skill actually triggers. Consolidation would trade focused, well-scoped skills for muddier triggering with no token benefit. The claim that nothing loads is also wrong, since descriptions must be resident to drive auto-invocation, and /compact summarizes conversation history rather than evicting skill bodies on a schedule.

*Hint if stuck: Recall which part of a skill is resident before the skill is ever triggered.*
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
A support resolution agent for an electronics retailer handles long multi-issue conversations, with the platform progressively summarizing older turns to control context size. After several summarization passes, the agent quoted a customer an RMA number and a refund amount of $214.50 that were both slightly wrong — even though both appeared correctly back in turn 12. What is the best fix?

A) Stop summarizing conversations entirely and let each one run until the context window fills, forcing the platform to open a new session
B) Prompt the summarizer to preserve all numbers, identifiers, and dollar amounts exactly as originally written when condensing the older turns
C) Summarize less aggressively — keep the most recent 100 turns verbatim and only condense the conversation history beyond that point
D) Keep a structured case-facts block (order ids, RMA numbers, amounts, commitments) outside the summarized history, always included verbatim

<details>
<summary>Answer & explanation</summary>

**D)** Progressive summarization is lossy by nature and each pass further erodes exact identifiers and figures, so load-bearing facts must live in a structured block that never enters the compressor. Prompting the summarizer to be careful cannot make lossy compression lossless, summarizing later only delays the same erosion, and never summarizing trades drift for hard context exhaustion.

*Hint if stuck: Lossy compression plus a be-careful instruction is still lossy — decide what should never enter the compressor at all.*
</details>

---

## Question 52
A SaaS support platform's design review proposes that the agent append a self-assessed confidence score (0-100) to each turn, escalating when confidence drops below 60. Pilots show the agent reporting 85+ confidence while looping on an unresolvable licensing edge case, and 40 on questions it answers correctly. What is the right takeaway?

A) Calibrate the scores post-hoc with a regression layer mapping reported confidence to observed accuracy
B) Self-reported confidence is poorly calibrated; escalate on observable signals like no-progress loops and policy gaps instead
C) Ask for confidence as a categorical (low/medium/high) instead of a number, since models handle categories better
D) Average confidence across the last five turns to smooth out the noise before applying the threshold

<details>
<summary>Answer & explanation</summary>

**B)** Model self-reported confidence is an unreliable escalation trigger because it is poorly calibrated — the pilot demonstrates exactly that, with high confidence during a hopeless loop. Reliable triggers are observable behaviors: no progress across turns, requests outside documented policy, explicit human requests. Calibration layers, smoothing, and rebucketing all keep depending on a signal that does not track reality.

*Hint if stuck: If the underlying signal does not track the truth, transformations of it will not either.*
</details>

---

## Question 53
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

## Question 54
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

## Question 55
A multi-agent research system's coordinator builds a 60k-token synthesis prompt: subagent findings concatenated chronologically, with the critical scope constraint ('only include peer-reviewed sources after 2020') stated once around token 30k, where it landed in sequence. The final report repeatedly cites blog posts from 2017. What change most directly fixes this?

A) Increase the thinking budget so the model reasons more carefully over the full 60k tokens
B) Rerun the synthesis on a model with a larger context window so the prompt fits more comfortably
C) Append a final instruction line — 'double-check that every citation meets the scope constraint' — to the prompt
D) Move the scope constraint and key summaries to the top of the prompt under clear headers

<details>
<summary>Answer & explanation</summary>

**D)** This is the lost-in-the-middle effect: facts buried mid-context get missed even when the prompt fits comfortably in the window. Placing critical constraints and summaries at the top under clear headers puts them where attention is strongest. The larger-window option misdiagnoses the problem — nothing overflowed — and a trailing reminder still requires the model to attend to the buried constraint.

*Hint if stuck: The prompt fits in the window — think about where in the window the constraint sits.*
</details>

---

## Question 56
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

## Question 57
A developer-productivity team is designing two helpers: one generates release notes and is run explicitly by an engineer before each release with a version tag; the other is a database-migration safety checklist that should engage automatically whenever Claude touches migration files. How should each be implemented?

A) Both as skills, since skills handle both arguments and automatic triggering
B) Both as slash commands, so engineers stay in explicit control of when each runs
C) A slash command for the release notes and a description-driven skill for the migration checklist
D) A description-driven skill for the release notes and a slash command for the migration safety checklist

<details>
<summary>Answer & explanation</summary>

**C)** The release-notes flow is user-initiated with an argument — the classic slash command shape, giving deterministic on-demand invocation. The migration checklist must fire without anyone remembering to ask, which is exactly what a skill's description-driven auto-invocation provides. Making both skills leaves the deliberately explicit release flow to probabilistic triggering; making both slash commands loses the automatic safety net; and reversing the pairing puts manual invocation on the workflow that most needs to be automatic.

*Hint if stuck: Sort each helper by who initiates it: the human or the model.*
</details>

---

## Question 58
A fintech team's pipeline runs claude -p to triage failing integration tests, then a Python script scrapes the verdict out of Claude's prose with a regex. Every few weeks the wording shifts ("the likely culprit is..." vs "root cause:") and the parser silently mis-routes tickets to the wrong on-call team. What fixes the root cause?

A) Tighten the regex to cover the new phrasings and add unit tests for the parser
B) Run claude -p with --output-format json and a --json-schema defining the verdict and owning team as enum fields, and route on that typed output
C) Append "always begin your answer with the exact phrase ROOT CAUSE:" to the prompt
D) Capture stderr and stdout separately so the prose and the verdict do not interleave, then point the existing regex parser only at the cleaned stdout stream

<details>
<summary>Answer & explanation</summary>

**B)** Scraping free-form prose is the root flaw. With --json-schema, claude -p returns a payload that matches a schema the script owns, with the verdict and team as fixed enum values, so routing no longer depends on wording; --output-format json alone would only wrap the same prose in an envelope. A prompted sentinel phrase is probabilistic and will eventually drift just like the prose did, hardening the regex only restarts the breakage cycle with the next wording change, and stream separation does nothing about wording inside the prose itself.

*Hint if stuck: Choose output typed against a schema over ever-smarter parsing of natural language.*
</details>

---

## Question 59
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

## Question 60
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

## Answer key (no peeking until scored)

1:C 2:C 3:B 4:D 5:A 6:D 7:C 8:A 9:C 10:A 11:B 12:D 13:D 14:C 15:A 16:A 17:C 18:D 19:D 20:C 21:A 22:C 23:B 24:D 25:A 26:C 27:C 28:B 29:D 30:B 31:B 32:D 33:D 34:A 35:C 36:C 37:A 38:B 39:B 40:D 41:D 42:B 43:A 44:B 45:A 46:A 47:B 48:B 49:A 50:A 51:D 52:B 53:B 54:C 55:D 56:B 57:C 58:B 59:A 60:C
