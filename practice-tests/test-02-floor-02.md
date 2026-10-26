# Practice Test 02: Coordination Hall
**D1: Agentic Architecture & Orchestration** (27% of the exam) · task statements 1.2, 1.3, 1.6

21 questions. Exam pace is 2 minutes per question.

---

## Question 1
A security-review coordinator audits a payments service by spawning three subagents: SQL injection in /api/orders, XSS in /web/templates, and hardcoded secrets in /config. Two weeks after release, an SSRF vulnerability is exploited in /api/webhooks — a directory no subagent was ever assigned. What was the architectural failure?

A) The decomposition left coverage gaps; the coordinator should partition the full scope so every directory and vulnerability class has an owner
B) The subagents ran on Haiku, which is too weak to detect SSRF; the scouts should run on Opus
C) The SSRF-focused subagent failed silently; add retry logic so transient subagent failures are re-run
D) Each subagent prompt should have ended with 'also flag anything else suspicious you happen to notice'

<details>
<summary>Answer & explanation</summary>

**A)** Overly narrow decomposition is a known multi-agent pitfall: anything outside the assigned slices is simply never examined. The fix is to partition the entire scope — directories and vulnerability classes — so the union of subagent assignments covers everything. No SSRF agent existed to retry, and a vague 'anything else' suffix is a probabilistic patch that never guarantees /api/webhooks gets read.

*Hint if stuck: Ask whether the union of the assigned slices actually equals the whole scope.*
</details>

---

## Question 2
A market-intelligence coordinator spawns four research subagents scoped as 'pricing trends', 'market trends', 'industry trends', and 'competitor pricing'. The synthesized report repeats the same three statistics four times, and token spend is roughly quadruple a single-agent baseline. What should the architect change?

A) Add a deduplication pass in the synthesizer that strips repeated claims before writing the report
B) Redefine the subagent scopes as non-overlapping partitions of the research space before delegating
C) Instruct each subagent to skip any topic the other three subagents are already covering
D) Raise the scouts' temperature so the four agents are less likely to converge on identical findings

<details>
<summary>Answer & explanation</summary>

**B)** Overlapping scopes are a decomposition pitfall: the four assignments describe nearly the same territory, so duplicated work and token spend are baked in before any agent runs. Partitioning the scope into mutually exclusive slices fixes the root cause. A synthesizer dedup pass hides the symptom while still paying for the redundant research, sampling settings cannot change what territory each agent was assigned, and subagents cannot 'skip what others cover' because their contexts are isolated from one another.

*Hint if stuck: Look at the four scope definitions themselves rather than at what happens downstream.*
</details>

---

## Question 3
In a healthcare intake pipeline, a symptoms-extractor subagent identifies the patient's record ID from uploaded forms, and an insurance-verifier subagent later needs that ID. An engineer proposes letting the two subagents exchange data directly through a shared messages.json file. What is the recommended pattern instead?

A) Give both subagents the same session ID so they transparently share one context window
B) Have the extractor return the record ID in its result, and let the coordinator pack it into the verifier's Task prompt
C) Adopt the shared file, but add a PreToolUse hook that validates each write to messages.json so a bad record never reaches the verifier
D) Merge both roles into a single subagent so the data never has to move between agents

<details>
<summary>Answer & explanation</summary>

**B)** In hub-and-spoke orchestration, inter-agent communication routes through the coordinator: spokes return results to the hub, and the hub explicitly packs needed facts into the next subagent's prompt. This keeps sequencing, validation, and observability in one place. A shared file sidesteps the orchestrator and invites ordering and consistency problems that a validation hook only partially patches, and subagents cannot share a context window by reusing a session ID.

*Hint if stuck: In hub-and-spoke, who is supposed to carry information between spokes?*
</details>

---

## Question 4
A support platform fans every incoming ticket out to all six specialist subagents — billing, shipping, returns, technical, account, fraud — then aggregates. Telemetry shows 70% of tickets need exactly one specialist, median resolution latency is 90 seconds, and cost per ticket is six times the single-agent baseline. What is the right architectural fix?

A) Keep all six but launch them as parallel Task calls in one response to bring latency down
B) Switch all six specialists to Haiku to bring the per-ticket cost back in line
C) Have the coordinator triage each ticket first and dynamically spawn only the specialists that ticket needs
D) Add cache_control breakpoints to the six specialist system prompts to reuse the stable prefixes across tickets

<details>
<summary>Answer & explanation</summary>

**C)** Running the full pipeline on every input is the anti-pattern here; dynamic subagent selection lets the coordinator triage and spawn only relevant specialists, which fixes both the 6x cost and the latency for the 70% single-specialist majority. Parallelizing all six helps latency but still pays for five useless invocations per ticket, and Haiku or caching shave cost without addressing the wasted work.

*Hint if stuck: Question whether every spoke should run at all, not how fast or cheaply they run.*
</details>

---

## Question 5
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

## Question 6
A legal-tech coordinator must review a 200-page master services agreement using multiple subagents, and the team is debating four decomposition schemes. Which one gives the most reliable coverage?

A) One subagent per risk keyword — 'indemnity', 'liability', 'termination', 'warranty' — each scanning the whole document
B) Subagents assigned to the contract's articles and exhibits, with boundaries chosen so every page belongs to exactly one agent
C) 200 subagents, one per page, so no single agent's context is ever strained
D) A single subagent given the full contract, since splitting risks losing cross-references

<details>
<summary>Answer & explanation</summary>

**B)** Good decomposition partitions the scope: every page is owned by exactly one agent, so there are no coverage gaps and no duplicated effort, and article boundaries keep semantic units intact. Keyword-scoped agents overlap heavily and leave risks phrased without those keywords with no owner. Per-page slicing is the too-narrow pitfall — clauses spanning pages get split so no agent sees a whole obligation — and a single agent over 200 pages forfeits delegation while straining one context.

*Hint if stuck: Aim for slices that are collectively exhaustive and mutually exclusive without splitting semantic units.*
</details>

---

## Question 7
A multi-agent research system answers "How are EU battery manufacturers responding to the 2026 subsidy changes?" The coordinator spawns 14 subagents, each scoped to a single manufacturer's press releases. The final report misses industry-wide patterns entirely, and when two subagents report contradictory capacity figures, nobody can tell which publication or date each figure came from. What is the best architectural fix?

A) Keep the 14 single-manufacturer tasks but add a fifteenth subagent whose only job is to detect contradictions and delete the less credible figure from the report
B) Re-scope to fewer, broader subagent tasks that can surface cross-cutting trends, and require each subagent to return claim-source mappings with publication dates
C) Let subagents exchange findings directly with one another during research so contradictions get reconciled before the coordinator runs its aggregation pass
D) Increase to 28 subagents covering component suppliers as well, giving the coordinator more raw material from which to infer industry-wide patterns

<details>
<summary>Answer & explanation</summary>

**B)** Overly narrow decomposition causes coverage gaps — single-manufacturer scopes cannot surface cross-cutting trends — and synthesis without claim-source mappings plus dates loses provenance, making contradictions unresolvable. The fix addresses both flaws: broader task scoping and provenance metadata flowing back to the coordinator. Direct subagent-to-subagent exchange fails because inter-subagent traffic routes through the coordinator, and deleting conflicting claims discards information that attribution and temporal metadata would resolve.

*Hint if stuck: Two separate design flaws are present — one in how the work was sliced, one in what the subagents hand back.*
</details>

---

## Question 8
A customer support coordinator agent has already looked up the customer's account ID, plan tier, and the disputed invoice number through earlier tool calls. It then spawns a billing-investigator subagent with the Task prompt 'Investigate why this customer was double-charged.' The subagent responds that it cannot proceed without knowing which customer or invoice is involved. What is the root cause?

A) The billing-investigator is running on Haiku, which cannot retain account details; switch its model to Opus
B) Project CLAUDE.md was never set up, so subagents load no memory at startup; create one containing the account details
C) Subagents start with isolated context; the coordinator must pack the account ID, plan tier, and invoice number directly into the Task prompt
D) Subagents need a shared-memory flag enabled in settings.json before they can read the coordinator's full conversation history, including the account details

<details>
<summary>Answer & explanation</summary>

**C)** Subagents do not inherit the coordinator's conversation — each starts with an isolated context, so any fact the subagent needs must be explicitly written into its task prompt. Packing the account ID, tier, and invoice number into the Task prompt fixes the root cause. CLAUDE.md is version-controlled project memory for stable standards, not a channel for per-ticket runtime facts, and no shared-memory flag exists in settings.json.

*Hint if stuck: Consider what a freshly spawned subagent can and cannot see of its parent's conversation.*
</details>

---

## Question 9
A multi-agent research system must profile 8 competitors, and each profile is independent of the others. Today the coordinator spawns one research subagent, waits for its report, then spawns the next, taking 25 minutes end to end. What change makes the subagents run concurrently?

A) Have the coordinator emit all 8 Task tool calls as multiple tool_use blocks in a single response
B) Set CLAUDE_PARALLEL=8 in the environment so the runtime fans out the coordinator's Task calls automatically
C) Submit the 8 profiles as a Message Batches job so they process simultaneously
D) Add 'work on all competitors at the same time' to the coordinator's system prompt

<details>
<summary>Answer & explanation</summary>

**A)** Parallel subagents are spawned by issuing multiple Task tool calls in one assistant response — each tool_use block launches a subagent that runs concurrently. CLAUDE_PARALLEL is not a real setting, and the Batch API trades latency for cost with results within 24 hours, so it cannot speed up a pipeline whose problem is wall-clock time. A prompt instruction is probabilistic best-effort; the actual mechanism is emitting the Task calls together in one turn, and only that guarantees concurrency.

*Hint if stuck: Recall how a single assistant turn can contain more than one tool invocation.*
</details>

---

## Question 10
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

## Question 11
A platform team in a 300-developer monorepo wants a reusable schema-migration-checker subagent that any engineer's session can delegate to. It must be limited to Read, Grep, and Glob, and run on a cheaper model than the main session. How should it be defined?

A) Document the checker's behavior and tool limits in the project CLAUDE.md so every session knows the convention
B) Register it as an MCP server in .mcp.json with the tool restrictions in the server config
C) Create .claude/agents/migration-checker.md with YAML frontmatter setting description, tools, and model, and commit it
D) Add .claude/commands/migration-checker.md so engineers can invoke it as a slash command

<details>
<summary>Answer & explanation</summary>

**C)** Custom subagents are defined as files in .claude/agents/ whose YAML frontmatter declares the description, the tool allowlist, and a per-agent model — exactly the three requirements here — and committing the file shares it repo-wide. CLAUDE.md is memory and cannot enforce tool or model restrictions. An MCP server exposes tools, not a delegable agent, and a slash command is a reusable prompt without its own restricted toolset and model.

*Hint if stuck: One specific directory holds delegable agent definitions with per-agent tools and model.*
</details>

---

## Question 12
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

## Question 13
A loan-processing coordinator establishes early in its run that an applicant's documents use DD/MM/YYYY dates and records this finding in its conversation. It then spawns an income-extractor subagent that reads 03/04/2025 as March 4 and mis-dates the pay stubs. What is the correct fix?

A) Have the income-extractor independently re-derive the date convention from the documents before extracting
B) Enable extended thinking on the extractor so it reasons its way to the right format
C) Upgrade the extractor's model from Haiku to Opus so it stops making date-format mistakes
D) Include the established DD/MM/YYYY determination explicitly in the extractor's task prompt

<details>
<summary>Answer & explanation</summary>

**D)** The coordinator's finding never reached the subagent: subagent contexts are isolated, and nothing from the parent conversation is inherited, so validated facts must be packed into the task prompt explicitly. Having the extractor re-derive the convention duplicates work the hub already did and can land on a different answer for ambiguous documents. Extended thinking and bigger models are probabilistic mitigations for what is a missing-information problem.

*Hint if stuck: Decide whether this is a reasoning failure or an information-delivery failure.*
</details>

---

## Question 14
In a multi-agent research session, the user spends ten turns with the coordinator narrowing scope: peer-reviewed sources only, 2024-2026 publications, exclude preprints. The coordinator then spawns four research subagents, and three of them come back citing 2019 preprints. Why did this happen, and what is the fix?

A) Subagent contexts are isolated and inherit nothing — the coordinator must explicitly pack the scope constraints into every Task prompt it issues
B) The subagents share the coordinator's context but lose mid-conversation details to lost-in-the-middle; move the constraints to the top of the history
C) The Task tool truncates long prompts; store the scope constraints in a shared memory file that every subagent is instructed to read at startup
D) The subagents were forked from too early a baseline; re-fork them after the scoping turns so the constraints land in the shared session baseline

<details>
<summary>Answer & explanation</summary>

**A)** Subagents run with isolated context and inherit nothing from the coordinator's conversation, so any constraint that matters must be explicitly packed into each task prompt. Lost-in-the-middle applies only to facts that are actually in context, which these never were. Shared memory files and fork timing tricks trade explicit, auditable context passing for fragile implicit state — and these subagents were spawned with isolated contexts, not forked from a baseline.

*Hint if stuck: Ask what a freshly spawned subagent actually knows about the conversation that spawned it.*
</details>

---

## Question 15
A research coordinator running on Opus is prompted to fan out work, and its response contains one text block plus three Task tool_use blocks targeting different subagents. The team's harness executes only the first Task call, discards the other two, and sends back a single tool_result; the coordinator then re-issues the missing tasks one at a time, tripling wall-clock time. What is the correct fix?

A) Prompt the coordinator to emit exactly one Task call per turn, since mixing text with multiple tool calls in one response indicates a malformed turn
B) Execute every tool_use block in the response — running the Tasks in parallel — and return one tool_result per tool_use_id in the next user message
C) Set tool_choice to {"type":"tool","name":"Task"} permanently so each response is constrained to a single, well-formed Task invocation
D) Have subagents poll a shared queue that the coordinator writes task specifications into, decoupling spawning from the tool_use protocol entirely

<details>
<summary>Answer & explanation</summary>

**B)** Parallel subagent fan-out is expressed as multiple Task tool_use blocks in a single response, and responses legitimately mix text with tool_use blocks; the harness must execute all of them and return a tool_result for each tool_use_id. Forcing one call per turn — by prompt or by permanently forcing tool_choice — serializes the very fan-out the coordinator was correctly attempting. The shared-queue design abandons the protocol and reintroduces implicit state instead of fixing the harness bug.

*Hint if stuck: A single assistant response can legitimately request several tool executions at once.*
</details>

---

## Question 16
A market-intelligence team runs a nightly CI job where a coordinator agent spawns six subagents through parallel Task calls to analyze competitor filings. The coordinator's conversation contains the target fiscal quarter and the exact ticker list, yet subagents repeatedly research the wrong quarter and unrelated companies. What is the correct fix?

A) Move the quarter and ticker list into the project CLAUDE.md so subagents pick them up automatically each night
B) Let subagents message the coordinator mid-task to request whichever parameters they find missing
C) Have the coordinator pack the quarter and ticker list directly into each subagent's task prompt
D) Raise the subagent iteration limit so they have time to rediscover the correct quarter on their own

<details>
<summary>Answer & explanation</summary>

**C)** Subagent contexts are isolated — they inherit nothing from the coordinator's conversation, so every fact a subagent needs must be explicitly packed into its task prompt. CLAUDE.md is for stable team standards, not per-run parameters: routing nightly values through it would mean rewriting a version-controlled file on every run, and it still substitutes shared memory for explicit context passing. Subagents cannot interrogate the coordinator mid-task, since traffic routes through the coordinator only as task prompts and returned results, and extra iterations just burn tokens rediscovering facts the coordinator already had.

*Hint if stuck: Consider what a freshly spawned subagent can and cannot see of its parent's conversation.*
</details>

---

## Question 17
A monorepo platform team wants every engineer's Claude Code session to delegate dependency-graph exploration to a fast, cheap scout while the main session stays on Sonnet. Today each engineer ad-libs a prompt like use a cheaper model for this, with wildly inconsistent results. How should the team standardize this?

A) Document the delegation prompt in an onboarding guide that each engineer pastes into their personal ~/.claude/CLAUDE.md
B) Set a CLAUDE_SUBAGENT_MODEL environment variable in the team's shared settings.json file
C) Add a project CLAUDE.md instruction telling Claude to mention Haiku whenever it spawns a Task for exploration
D) Commit a custom subagent in .claude/agents/ whose YAML frontmatter sets its description, tools, and model: haiku

<details>
<summary>Answer & explanation</summary>

**D)** Custom subagents live in .claude/agents/ with YAML frontmatter that pins description, tools, and model, and committing the file version-controls the behavior for the entire team. Personal CLAUDE.md copies drift and are not shared, CLAUDE_SUBAGENT_MODEL is not a real setting, and a CLAUDE.md nudge to mention Haiku remains probabilistic where a config field is deterministic.

*Hint if stuck: Look for the version-controlled artifact that pins a subagent's model deterministically.*
</details>

---

## Question 18
A CI review job must check every pull request for the same three things: security issues, breaking API contract changes, and missing tests. Today one long prompt asks for all three at once and the security section is often thin. An engineer proposes replacing it with an autonomous agent that decides for itself what to investigate on each PR. What is the better design?

A) Keep one prompt but tell the model to spend equal effort on each of the three areas
B) Use the autonomous agent, since it can adapt its investigation to each pull request and decide for itself which areas deserve the most attention
C) Break the review into a fixed prompt chain with one focused step per aspect, since the aspects are known and identical on every PR
D) Run the single prompt three times and keep only findings that appear in at least two runs

<details>
<summary>Answer & explanation</summary>

**C)** When the work is predictable and multi-aspect, a fixed prompt chain gives each aspect its own focused pass and consistent coverage. Dynamic, self-directed decomposition is for open-ended investigations where the next step depends on what was found; here the steps never change. Asking for equal effort does not fix dilution inside one prompt, and majority voting suppresses real findings that only appear intermittently.

*Hint if stuck: Are the steps known in advance, or discovered along the way?*
</details>

---

## Question 19
A developer-productivity agent is asked to 'add comprehensive tests to our legacy billing codebase' (300 modules, almost no existing tests, unclear dependencies). Which decomposition approach should it take?

A) Map the codebase first, identify the highest-impact areas, then build a prioritised plan that is revised as dependencies are discovered
B) Generate tests module by module in alphabetical order until every module has at least one test
C) Ask for all of the tests in a single pass so the model sees the whole codebase at once
D) Write a detailed 40-step procedure up front covering every module and dependency, and have the agent follow it step by step without deviation

<details>
<summary>Answer & explanation</summary>

**A)** An open-ended task over an unfamiliar codebase needs adaptive decomposition: explore and map first, prioritise by impact, and let the plan change as dependencies surface. Alphabetical order ignores impact, a single pass dilutes attention across 300 modules, and a rigid upfront procedure cannot account for what has not been discovered yet.

*Hint if stuck: You cannot plan well for code you have not explored yet.*
</details>

---

## Question 20
An on-call assistant investigates latency incidents using a fixed six-step pipeline: check CPU, check memory, check database, check cache, check network, summarise. For last week's spike the real cause was a misconfigured feature flag in a downstream service, which no step looks at, and the summary blamed the cache. What change addresses the underlying problem?

A) Add a seventh fixed step that checks feature flags
B) Switch to an adaptive investigation that generates its next subtasks from what each step finds
C) Increase max_tokens so the summary step can consider more possibilities
D) Run all six steps in parallel to finish faster and leave time for a manual check of the summary afterward

<details>
<summary>Answer & explanation</summary>

**B)** Incident investigation is open-ended: the right next step depends on the evidence so far. A fixed pipeline, however long, only finds causes someone predicted; adding a seventh step fixes last week's incident and not the next unknown one. More tokens or parallelism do not change what gets investigated.

*Hint if stuck: The pipeline can only find what its author predicted.*
</details>

---

## Question 21
Which of these workflows most clearly calls for dynamic, adaptive task decomposition instead of a fixed prompt chain?

A) A nightly summary of the same four lint checks across a repository
B) Translating each release note into three languages
C) Reformatting every incoming invoice from many different vendors into a fixed internal template
D) Finding the root cause of an intermittent memory leak that spans several services

<details>
<summary>Answer & explanation</summary>

**D)** A root-cause hunt across services is open-ended, so each finding changes what to examine next, which is what adaptive decomposition is for. The other three are predictable, repeated transformations where a fixed chain is simpler and more reliable.

*Hint if stuck: Which one could not be planned step by step in advance?*
</details>

---
