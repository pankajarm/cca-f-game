# Practice Test 02: Coordination Hall
**D1: Agentic Architecture & Orchestration** (27% of the exam) — Multi-agent orchestration

15 questions. Exam pace is 2 minutes per question; aim for 30 minutes.
Pass bar in the game: 7/10 on a random draw. Pass bar here: be honest.

---

## Question 1
A customer support coordinator agent has already looked up the customer's account ID, plan tier, and the disputed invoice number through earlier tool calls. It then spawns a billing-investigator subagent with the Task prompt 'Investigate why this customer was double-charged.' The subagent responds that it cannot proceed without knowing which customer or invoice is involved. What is the root cause?

A) The billing-investigator is running on Haiku, which cannot retain account details; switch its model to Opus
B) Project CLAUDE.md was never set up, so subagents load no memory at startup; create one containing the account details
C) Subagents start with isolated context; the coordinator must pack the account ID, plan tier, and invoice number directly into the Task prompt
D) Subagents need a shared-memory flag enabled in settings.json before they can read the coordinator's conversation history

<details>
<summary>Answer & explanation</summary>

**C)** Subagents do not inherit the coordinator's conversation — each starts with an isolated context, so any fact the subagent needs must be explicitly written into its task prompt. Packing the account ID, tier, and invoice number into the Task prompt fixes the root cause. CLAUDE.md is version-controlled project memory for stable standards, not a channel for per-ticket runtime facts, and no shared-memory flag exists in settings.json.

*Hint if stuck: Consider what a freshly spawned subagent can and cannot see of its parent's conversation.*
</details>

---

## Question 2
A multi-agent research system must profile 8 competitors, and each profile is independent of the others. Today the coordinator spawns one research subagent, waits for its report, then spawns the next, taking 25 minutes end to end. What change makes the subagents run concurrently?

A) Have the coordinator emit all 8 Task tool calls as multiple tool_use blocks in a single response
B) Set CLAUDE_PARALLEL=8 in the environment so the runtime fans out Task calls automatically
C) Submit the 8 profiles as a Message Batches job so they process simultaneously
D) Add 'work on all competitors at the same time' to the coordinator's system prompt

<details>
<summary>Answer & explanation</summary>

**A)** Parallel subagents are spawned by issuing multiple Task tool calls in one assistant response — each tool_use block launches a subagent that runs concurrently. CLAUDE_PARALLEL is not a real setting, and the Batch API trades latency for cost with results within 24 hours, so it cannot speed up a pipeline whose problem is wall-clock time. A prompt instruction is probabilistic best-effort; the actual mechanism is emitting the Task calls together in one turn, and only that guarantees concurrency.

*Hint if stuck: Recall how a single assistant turn can contain more than one tool invocation.*
</details>

---

## Question 3
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

## Question 4
An architect spent 30 minutes in a Claude Code session reading 40 files of a monorepo and building a verified mental model of its service boundaries. She now wants to explore three mutually exclusive migration strategies, each requiring long follow-up investigation that would contaminate the others' reasoning. What is the most efficient setup?

A) Explore the three strategies sequentially in the same session, running /compact between each one
B) Spawn three Task subagents from the current session, one per strategy
C) Paste a hand-written summary of the findings into three fresh sessions, one per strategy
D) Use fork_session to branch three sessions from the current one, so each strategy starts from the same loaded baseline

<details>
<summary>Answer & explanation</summary>

**D)** fork_session exists exactly for this: it branches new sessions from a shared baseline, so all three explorations start with the full 40-file understanding and none pollutes the others. Task subagents start with isolated, empty context, so the accumulated understanding would have to be repacked into each prompt and would arrive lossy. Sequential exploration with /compact lets earlier strategies bias later ones, and hand-written summaries lose fidelity.

*Hint if stuck: One mechanism duplicates an existing session's accumulated context; delegation does not.*
</details>

---

## Question 5
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

## Question 6
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

## Question 7
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

## Question 8
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

## Question 9
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

## Question 10
In a healthcare intake pipeline, a symptoms-extractor subagent identifies the patient's record ID from uploaded forms, and an insurance-verifier subagent later needs that ID. An engineer proposes letting the two subagents exchange data directly through a shared messages.json file. What is the recommended pattern instead?

A) Give both subagents the same session ID so they transparently share one context window
B) Have the extractor return the record ID in its result, and let the coordinator pack it into the verifier's Task prompt
C) Adopt the shared file, but add a PreToolUse hook that validates each write to messages.json
D) Merge both roles into a single subagent so the data never has to move between agents

<details>
<summary>Answer & explanation</summary>

**B)** In hub-and-spoke orchestration, inter-agent communication routes through the coordinator: spokes return results to the hub, and the hub explicitly packs needed facts into the next subagent's prompt. This keeps sequencing, validation, and observability in one place. A shared file sidesteps the orchestrator and invites ordering and consistency problems that a validation hook only partially patches, and subagents cannot share a context window by reusing a session ID.

*Hint if stuck: In hub-and-spoke, who is supposed to carry information between spokes?*
</details>

---

## Question 11
A support platform fans every incoming ticket out to all six specialist subagents — billing, shipping, returns, technical, account, fraud — then aggregates. Telemetry shows 70% of tickets need exactly one specialist, median resolution latency is 90 seconds, and cost per ticket is six times the single-agent baseline. What is the right architectural fix?

A) Keep all six but launch them as parallel Task calls in one response to bring latency down
B) Switch all six specialists to Haiku to bring the per-ticket cost back in line
C) Have the coordinator triage each ticket first and dynamically spawn only the specialists that ticket needs
D) Add cache_control breakpoints to the six specialist system prompts to reuse the stable prefixes

<details>
<summary>Answer & explanation</summary>

**C)** Running the full pipeline on every input is the anti-pattern here; dynamic subagent selection lets the coordinator triage and spawn only relevant specialists, which fixes both the 6x cost and the latency for the 70% single-specialist majority. Parallelizing all six helps latency but still pays for five useless invocations per ticket, and Haiku or caching shave cost without addressing the wasted work.

*Hint if stuck: Question whether every spoke should run at all, not how fast or cheaply they run.*
</details>

---

## Question 12
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

## Question 13
An e-commerce refund system is wired as a chain: an order-analyzer subagent spawns an inventory-checker, which spawns a refund-calculator, three levels deep. When refund amounts come out wrong, engineers cannot tell which level introduced the error, and the analyzer's context fills with nested transcripts. How should the system be restructured?

A) Flatten it to hub-and-spoke: one coordinator decomposes the job, delegates to each specialist directly, and aggregates results
B) Keep the chain but require every agent in it to emit structured outputs so errors carry attribution
C) Keep the chain but raise the analyzer's context budget so nested transcripts stop overflowing
D) Add verbose logging at each level so engineers can replay the chain after a bad refund

<details>
<summary>Answer & explanation</summary>

**A)** Daisy-chained subagents recreate the problems hub-and-spoke exists to solve: every intermediate result should return to a coordinator, where it is individually observable and where aggregation logic lives. Flattening the chain fixes both the debuggability and the nested-context bloat at once. Structured outputs within the chain — the strongest distractor — improve attribution but leave the deep nesting and tangled control flow in place, and bigger context budgets or verbose logging only patch symptoms of the flawed topology.

*Hint if stuck: Compare the topology itself against the canonical multi-agent shape.*
</details>

---

## Question 14
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

## Question 15
In a 10-scout market-research swarm, the scout covering Latin America hits a rate-limited API on its first call and immediately returns the single word 'failed'. The coordinator drops that segment, and the published report silently omits an entire region. How should scout failure handling be designed?

A) On any scout failure, the coordinator should restart the entire 10-scout pipeline from scratch
B) Prompt the synthesizer to add a disclaimer listing any regions that appear to be missing from the data
C) Scouts retry transient errors locally and propagate only unresolvable failures, with what was attempted and any partial results
D) Scouts should raise failures directly to the end user the moment any API call errors

<details>
<summary>Answer & explanation</summary>

**C)** The reliability rule for subagents is recover locally, propagate with context: a rate limit is transient and should be retried inside the scout, and a genuinely unresolvable failure must reach the coordinator as a structured report — what failed, what was tried, partial results — so the hub can reassign or flag the gap instead of silently dropping it. Restarting all 10 scouts wastes nine successful runs, a disclaimer still ships a report missing a region, and surfacing every transient API error to the end user defeats delegation.

*Hint if stuck: Recall which errors a subagent should absorb and what an unrecoverable one must carry upward.*
</details>

---
