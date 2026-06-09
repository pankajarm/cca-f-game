# Full Practice Exam — CCA-F simulation

Faithful to the real blueprint as of June 2026: **60 questions, 120 minutes,
scaled score out of 1000, pass at 720** (~44 of 60). Domain weighting:
D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.

Set a timer. No notes, no docs — the real exam is proctored.
For the interactive version with the clock, flags, and a score report, open the game.

---

## Question 1
A claude-code-action review handles the team's typical 300-line PRs well, but on a 4,800-line vendored-library upgrade it produced detailed comments on the first dozen files, skimmed the remaining forty with one-line notes, and closed with a normal wrap-up well under its output limit — missing a known injection bug in file 38. What should the team change?

A) Split large PRs into multiple review passes, one per module, and aggregate the findings
B) Switch the review to Opus with a maximum thinking budget so a single pass can cover everything
C) Prompt the reviewer to "give equal attention to every file regardless of its position in the diff"
D) Raise the action's maximum output tokens so the review is not truncated partway through the files

<details>
<summary>Answer & explanation</summary>

**A)** A single pass over a 4,800-line diff dilutes attention, and material deep in the context gets skimmed or missed — the lost-in-the-middle failure mode. Multi-pass review keeps each chunk within a size the model handles reliably and aggregates the results. The review finished normally under its output limit, so truncation is not the cause; a bigger model or thinking budget does not fix attention dilution, and an "equal attention" instruction is a best-effort wish, not a mechanism.

*Hint if stuck: When one context has to cover too much material, divide the work instead of exhorting the model.*
</details>

---

## Question 2
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

## Question 3
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

## Question 4
An e-commerce operations agent answers on-call engineers' questions in long-running sessions; engineers execute any deploys themselves. Answers must always reflect the current deploy-freeze status and on-call rotation, both of which change mid-session. Today the agent advised an engineer to deploy during a freeze that began an hour after the session started. Which hook placement fixes this?

A) A SessionStart hook that injects freeze status and the rotation when the session begins
B) A Stop hook that appends the latest freeze status to the agent's final answer each turn
C) A PreToolUse hook that inserts the current rotation into the parameters of every tool call
D) A UserPromptSubmit hook that fetches current freeze status and rotation and attaches them to each incoming prompt

<details>
<summary>Answer & explanation</summary>

**D)** The failure happened because the facts changed mid-session, so any mechanism that injects them only once at session start is guaranteed to go stale, which is exactly the trap in the SessionStart option. UserPromptSubmit fires on every user message, so the model reasons over current freeze and rotation data each time it answers. The Stop hook decorates output after reasoning is done, too late to change the advice, and the PreToolUse option only touches tool parameters, which never informs the model's answer to a question.

*Hint if stuck: Ask which hook fires often enough to keep fast-changing facts current throughout a session.*
</details>

---

## Question 5
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

## Question 6
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

## Question 7
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

## Question 8
A corporate expense-report extractor has a single total_amount field. The team discovers the model sometimes returns the arithmetically correct sum of the receipt lines instead of the different total the employee actually wrote — silently masking the addition errors finance is required to flag. An engineer proposes adding 'always copy the written total verbatim; never recalculate' to the prompt. Which approach best serves the finance requirement?

A) Adopt the prompt instruction: always copy the written total verbatim and never recalculate from the line items
B) Add post-processing that recomputes the sum from the extracted line items and overwrites total_amount for consistency
C) Ask the model to output whichever total it judges more trustworthy, plus a free-text note explaining its choice
D) Split the schema into stated_total and calculated_total fields with a conflict_detected flag for finance review

<details>
<summary>Answer & explanation</summary>

**D)** The gap between the written total and the computed total is precisely the business signal, so the structure must preserve both values plus an explicit conflict flag. The prompt instruction is the strongest distractor, but it is probabilistic — and even when followed perfectly it hides the arithmetic error, because finance still needs the computed value to detect the mismatch. Overwriting with the recomputed sum erases the written total, and a free-text trust judgment is unparseable and unauditable.

*Hint if stuck: When two values can legitimately disagree, the output structure should be able to say so explicitly.*
</details>

---

## Question 9
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

## Question 10
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

## Question 11
A fintech extraction pipeline's fetch_transactions tool returns dates in a mix of MM/DD/YYYY, ISO 8601, and Unix epoch depending on the upstream bank. The model must compare transaction dates against statement periods and gets it wrong on roughly 1 in 12 records, almost always the epoch-formatted ones. What is the root-cause fix?

A) A PostToolUse hook on fetch_transactions that converts every date to ISO 8601 before the model sees the result
B) A system prompt section with worked examples showing how to convert epoch timestamps correctly
C) A retry policy that re-fetches the transactions whenever a date comparison fails validation
D) A stricter output schema requiring the model to return all dates as ISO 8601 strings

<details>
<summary>Answer & explanation</summary>

**A)** Date normalization is a mechanical transformation, so it belongs in deterministic PostToolUse code that guarantees the model only ever sees one consistent format. The stricter output schema is the strongest distractor: it constrains the answer's format but does nothing to stop the model misreading epoch values on the way in, since schemas guarantee syntax, not semantic correctness. Prompted conversion examples remain probabilistic, and retries re-fetch the same mixed formats and reproduce the same misreads.

*Hint if stuck: Mechanical transformations of tool output belong in deterministic code, not model instructions.*
</details>

---

## Question 12
A research swarm classifies each extracted claim into an enum field: market_trend, regulation, technology, or competitor_move. Reviewers keep finding genuinely novel claim types — supply chain disruptions, labor actions — silently shoehorned into competitor_move. What is the right schema fix?

A) Add an "other" value to the enum together with a free-text detail field that captures what the claim actually describes
B) Add five more specific enum values covering every claim type observed so far, and brief reviewers to expect occasional residual misfits
C) Add a prompt instruction telling the model to classify carefully and to skip any claim that does not clearly match one of the four categories
D) Make the category field nullable so the model can return null whenever a claim falls outside the four currently defined values

<details>
<summary>Answer & explanation</summary>

**A)** Closed enums force the model to pick the least-wrong value, so novel claims get shoehorned; the canonical fix is an "other" or "unclear" escape value paired with a free-text detail field that preserves the information. A nullable category discards the signal entirely — you learn nothing about what the claim was. Adding more enum values is a treadmill: the next novel type shoehorns all over again, and a prompt instruction to skip claims silently drops data.

*Hint if stuck: The schema needs an escape hatch that still captures information instead of dropping it.*
</details>

---

## Question 13
A platform team wrote a PreToolUse hook to stop Claude Code from editing files under infra/prod/. The script correctly detects the protected path, prints 'Edit blocked: protected production path' to stdout, and exits with code 0. In testing, the edits still go through and the agent never acknowledges any block. What is wrong?

A) PreToolUse hooks cannot block tool calls; the rule must instead be a deny entry in settings.json permissions
B) The hook needs to return hookSpecificOutput.additionalContext containing the block decision
C) The hook must exit with code 2 to block the call, and write the explanation to stderr so it is fed back to the model
D) The hook fires too early to see the file path; the protection must move to a PostToolUse hook

<details>
<summary>Answer & explanation</summary>

**C)** For PreToolUse hooks, a zero exit code allows the tool call to proceed; exit code 2 is what blocks the call, and stderr (not stdout) is the channel fed back to the model explaining why. The first option is false because gating tool calls before they run is exactly what PreToolUse exists for. additionalContext injects information but does not block anything, and PreToolUse receives the full tool input including the file path, so it does not fire too early.

*Hint if stuck: Recall which exit code blocks a tool call and which output stream gets fed back to the model.*
</details>

---

## Question 14
A research swarm gathering electric-vehicle market data flags a "source conflict": one finding says global EV sales were 10.5M units, another says 17.3M. Investigation shows the first comes from a 2023 report and the second from a 2025 report — and the synthesizer had discarded both figures as unreliable. What fixes this?

A) Add a reconciliation step that averages the numeric claims whenever any two sources disagree by more than 20%, then report the blended figure
B) Rank the sources by domain authority and keep only the figure that comes from the higher-authority publication, discarding the other
C) Tighten the scout prompts so they only collect market figures published within the last 12 months, keeping the dataset current
D) Capture publication dates as temporal metadata on every claim, so figures from different years read as a time series, not contradictions

<details>
<summary>Answer & explanation</summary>

**D)** Figures measured at different times are not contradictions — they are data points about a changing quantity, and carrying temporal metadata through synthesis prevents false-conflict detection while preserving trend information. Averaging fabricates a number no source ever reported, authority ranking discards a valid historical data point, and restricting collection to recent sources throws away exactly the history trend analysis needs.

*Hint if stuck: Two correct measurements of a changing quantity can differ for a reason that a piece of metadata captures.*
</details>

---

## Question 15
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

## Question 16
A legal contract extraction pipeline retries with validation feedback up to six times. Telemetry shows 82% of contracts pass within two attempts, but 13% fail all six — and inspection reveals those contracts genuinely contain no governing-law clause. The feedback 'governing_law is missing, re-extract' just drives the model to fabricate jurisdictions on later attempts. What should the team change?

A) Raise the attempt cap from six to ten so the stubborn 13% of contracts get more chances to converge
B) Sharpen the retry feedback to list the exact contract sections where governing-law clauses conventionally appear
C) Loosen the validator to accept any plausible jurisdiction string so the later attempts pass instead of failing
D) Make governing_law nullable and treat a returned null as a terminal, valid outcome when the clause is absent

<details>
<summary>Answer & explanation</summary>

**D)** Retry feedback only helps when the failure is recoverable; when the source lacks the clause, every extra attempt just increases fabrication pressure, so the schema must let the model report absence as a valid terminal answer. Sharper feedback is the strongest distractor, but no hint can locate a clause that does not exist, more attempts compound the waste, and loosening the validator institutionalizes fabricated jurisdictions in legal data.

*Hint if stuck: Before improving the retries, ask whether success is even possible for the failing 13%.*
</details>

---

## Question 17
A CI workflow has Claude Code generate a payment-reconciliation module, then prompts in the same session: 'Now critically review the code you just wrote for bugs.' The review almost always concludes the implementation looks correct, yet QA keeps finding logic errors in the merged code. Which change most improves bug detection?

A) Strengthen the review prompt to 'act as a hostile senior reviewer and assume the code is broken until proven otherwise'
B) Repeat the same-session review three times and take the union of all findings to compensate for individual misses
C) Run the review in a separate session whose context contains only the diff, not the generation conversation
D) Enable extended thinking on the same-session review so the model reasons more deeply before approving the code

<details>
<summary>Answer & explanation</summary>

**C)** Same-session self-review keeps the generation reasoning in context, so the model tends to confirm the decisions it just made; an independent reviewer session sees only the artifact and evaluates it fresh. Harsher prompts and extended thinking still operate on top of the biased context, and repeating a biased review three times unions the same blind spots.

*Hint if stuck: Consider what the reviewer already believes when its context contains the reasoning that produced the code.*
</details>

---

## Question 18
A support agent emits structured ticket dispositions through a tool_use call with a JSON schema. Every response validates, yet in 4% of cases refund_total does not equal the sum of the line_items amounts, and resolution_code sometimes contradicts the narrative summary. The team concludes schema enforcement is broken and wants to switch providers. What is actually happening, and what is the fix?

A) The schema lacks strict mode — switching to strict structured outputs guarantees both the payload's shape and its internal arithmetic consistency
B) Temperature is too high for structured work — pinning it to 0 makes the numeric fields deterministic and therefore internally consistent
C) The field descriptions are too thin — documenting each field's relationship to the others lets the model reliably self-enforce the cross-field invariants
D) Schema enforcement worked: it guarantees syntactic compliance, not semantic correctness — add programmatic cross-field validation with a repair retry

<details>
<summary>Answer & explanation</summary>

**D)** tool_use with a JSON schema guarantees the output parses and conforms structurally; it never guarantees semantic correctness such as sums that reconcile or fields that agree. Cross-field invariants therefore need programmatic validation with a repair loop. Strict structured outputs only harden the syntactic guarantee — arithmetic consistency is still semantics — richer descriptions help probabilistically but cannot guarantee the invariant, and determinism at temperature 0 just makes the same wrong sums repeatable.

*Hint if stuck: Distinguish what schema validation can promise from what only your own code can check.*
</details>

---

## Question 19
An e-commerce agent's apply_store_credit tool is gated by a PreToolUse hook that exits 2 for credits over $50. The block works, but logs show the agent then retries the identical $75 credit four times before giving up, and the customer gets no resolution. The hook's stderr message is just the word 'Blocked.' What should change?

A) Convert it to a PostToolUse hook so the agent can observe the outcome of the attempted credit
B) Rewrite the stderr message to state the rule and the next step: the $50 cap, and that larger credits go through the escalate_to_human tool
C) Add a hard cap of two retries on apply_store_credit in the agent loop configuration
D) Remove apply_store_credit from the agent's tools and route all credit requests to humans

<details>
<summary>Answer & explanation</summary>

**B)** When a PreToolUse hook blocks with exit code 2, its stderr is fed back to the model and is the model's only explanation of why the call was refused; a bare 'Blocked.' is the hook equivalent of a bare 'Operation failed' tool error, leaving nothing to adapt to. Stating the cap and the escalation path lets the agent immediately take the correct action. Retry caps are safety fallbacks that stop the loop without producing a resolution, converting to PostToolUse would let the over-cap credit execute, and removing the tool punishes every legitimate under-cap credit.

*Hint if stuck: What the hook writes to stderr is the model's only explanation of why the call was refused.*
</details>

---

## Question 20
A fintech team of 14 engineers plus a CI runner needs a shared Jira MCP server. One engineer got it working in his ~/.claude.json with his personal API token, but nobody else, including CI, has the server. He offers to commit his working config, token included, since the repo is private. What is the right setup?

A) Commit the working config with the literal token included, since a private repository is an acceptable trust boundary
B) Have every engineer copy the server block into their own ~/.claude.json and give the CI runner its own duplicate copy
C) Commit a project-scoped .mcp.json referencing the token as ${JIRA_TOKEN}, with each environment supplying the variable
D) Use local scope on each machine so the config stays tied to the project without ever entering version control

<details>
<summary>Answer & explanation</summary>

**C)** Project .mcp.json is the version-controlled, team-shared scope, and ${ENV_VAR} expansion keeps secrets out of the repo while letting each dev machine and the CI runner supply its own token. Committing literal tokens is a credential leak regardless of repo visibility, and user-scope or local-scope copies are personal — they drift across 14 machines and never reach CI.

*Hint if stuck: One MCP scope is designed to be committed, and it has a built-in mechanism for secrets.*
</details>

---

## Question 21
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

## Question 22
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

## Question 23
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

## Question 24
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

## Question 25
An e-commerce pipeline asks Claude to return product attributes as JSON in a plain text response. About 2 percent of responses begin with 'Here is the extracted JSON:' or wrap the object in a code fence, crashing the downstream parser. The prompt already says 'respond with only the JSON object, no other text.' What is the root-cause fix?

A) Use strict structured outputs or a tool_use schema so conformance is guaranteed rather than requested through instructions
B) Add a regex preprocessing step that strips any leading prose and code fences before the parser runs
C) Repeat the JSON-only instruction at both the start and the end of the prompt so the model cannot miss it
D) Detect parse failures at runtime and automatically resend the request until a clean JSON response comes back

<details>
<summary>Answer & explanation</summary>

**A)** Prompt instructions are probabilistic and will occasionally be violated at scale; strict structured outputs or tool_use with a schema make conformance a guarantee of the API rather than a request. Regex stripping and retry loops patch the symptom while leaving the unreliable mechanism in place, and repeating the instruction is more of the same best-effort approach.

*Hint if stuck: Ask which option turns 'please format it this way' into a guarantee.*
</details>

---

## Question 26
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

## Question 27
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

## Question 28
A data extraction monorepo keeps parser modules under packages/parsers/ with strict conventions — every parser needs a golden-file test, and regex date parsing is banned — alongside general team standards. Everything lives in one 1,800-line project CLAUDE.md that bloats every session's context, and engineers report Claude Code missing the parser rules anyway. How should this be restructured?

A) Move the parser conventions into each engineer's ~/.claude/CLAUDE.md so they apply globally without inflating the shared project file
B) Create a parsers slash command in .claude/commands/ that engineers run to load the conventions before touching any parser code
C) Keep team-wide standards in the project CLAUDE.md and move parser conventions into .claude/rules/ files with frontmatter paths scoped to packages/parsers/**
D) Split the 1,800 lines into twelve topic files and @import them all back into the project CLAUDE.md so each concern is separately editable

<details>
<summary>Answer & explanation</summary>

**C)** Path-scoped rules (.claude/rules/*.md with YAML frontmatter paths) load conventions only when matching files are in play, keeping the always-loaded project CLAUDE.md lean for genuine team-wide standards. The @import split reorganizes the text but still loads all 1,800 lines into every session. User-level CLAUDE.md is personal and unversioned, so team conventions there drift immediately, and a slash command makes a mandatory standard opt-in and forgettable.

*Hint if stuck: Some guidance should load everywhere, and some only when matching files are being touched.*
</details>

---

## Question 29
A developer-experience team distributes Claude Code skills from an internal git repo. A SessionStart hook pulls the latest skills into .claude/skills/ at the start of every session, but engineers find that skills added by the pull are not auto-invoked until they fully restart Claude Code. How should the team make newly synced skills register automatically, with no manual step?

A) Move the sync script into a PreToolUse hook so it runs again before every tool call in the session
B) Have the SessionStart hook return reloadSkills in its output so the synced skills are rescanned immediately
C) Tell engineers to run /reload-skills manually right after each session starts so the new skills register
D) List every skill's description in the project CLAUDE.md so the content loads as memory at session start instead

<details>
<summary>Answer & explanation</summary>

**B)** SessionStart hooks can return reloadSkills, which triggers a skill rescan after the sync completes — fixing the ordering problem at its source with zero human steps. Manual /reload-skills works but depends on every engineer remembering it every session, which fails the no-manual-step requirement. PreToolUse is the wrong lifecycle event, wastefully re-syncing on every tool call without triggering a rescan, and pasting descriptions into CLAUDE.md defeats progressive disclosure without actually registering the skills.

*Hint if stuck: One hook event has a documented output field made for exactly this situation.*
</details>

---

## Question 30
A Claude Code session navigating a 4,000-file monorepo degrades after an hour: every Grep over the vendored directory returns hundreds of matches, and the team currently runs /compact every 20 minutes, after which Claude re-asks questions it had already answered. The team debates compacting even more aggressively. What is the better approach?

A) Run /compact every 10 minutes instead of 20, before the noisy search results have time to accumulate
B) Start a fresh session every hour and paste in a manually written summary of the progress so far
C) Stop the bloat at its source: exclude vendored paths from searches and delegate verbose exploration to subagents
D) Add a CLAUDE.md note instructing Claude to disregard matches from vendored directories when reasoning

<details>
<summary>Answer & explanation</summary>

**C)** Compaction is lossy — re-asking already-answered questions is the evidence — so compacting more often just loses information sooner. The root cause is verbose, low-value output entering context in the first place; scoping searches and pushing exploration into subagents with isolated context means there is little left to compact. The CLAUDE.md note leaves all the tokens in context and merely asks the model to ignore them.

*Hint if stuck: Compare removing tokens before they accumulate with summarizing them after the damage is done.*
</details>

---

## Question 31
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

## Question 32
An e-commerce team has finalized a new extraction prompt for product attributes and plans to submit all 10,000 legacy listings as a single Message Batch tonight. The prompt has only been eyeballed against two listings. A teammate objects to the plan. What should the team do before committing the full batch?

A) Submit the full batch now — at the 50% discount, even a flawed run only costs as much as half a synchronous run
B) Run a small synchronous pilot of around 50 representative listings, validate the outputs, then submit the full batch
C) Submit the 10,000 listings as ten sequential batches of 1,000, checking each batch's results before sending the next
D) Add a system-prompt instruction asking the model to double-check its own work, then submit all 10,000 tonight

<details>
<summary>Answer & explanation</summary>

**B)** A small synchronous pilot gives immediate feedback on prompt quality before committing 10,000 jobs to a channel with no latency SLA. The staged sub-batch plan is the strongest distractor, but it still burns 1,000 unvalidated jobs on the first stage and waits up to 24 hours per checkpoint; the discount makes a bad run cheaper, not free, and a self-check instruction cannot validate outputs the team has never inspected.

*Hint if stuck: Compare how quickly each plan would reveal that the prompt is broken.*
</details>

---

## Question 33
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

## Question 34
A medical-records pipeline forces its first call with tool_choice set to the extract_patient_header tool, which works, but the integration leaves that same tool_choice on every subsequent request. The model now re-extracts the header repeatedly and never calls extract_medications or produces its final summary. What is the fix?

A) Add a system-prompt rule that the header tool may be called at most once per document so the model stops repeating it
B) Switch tool_choice to any after the first turn so the model is forced to keep selecting among the remaining tools
C) Remove extract_patient_header from the tools array after the first call so the model can no longer select it
D) After the forced first call returns, send subsequent requests with tool_choice set to auto so the model can choose tools or finish

<details>
<summary>Answer & explanation</summary>

**D)** The force-then-relax pattern requires actually relaxing: leaving a named tool forced compels every turn to call that tool. Switching to auto restores the model's ability to pick the right next tool or end the turn with the final summary. tool_choice any would still force some tool call on every turn, blocking the closing prose summary; removing the tool from the array while tool_choice still names it just breaks the request instead of relaxing the constraint; and a prompt rule cannot override a forced tool_choice at all.

*Hint if stuck: Forcing a named tool is a first-turn maneuver; recall what the second half of that pattern is.*
</details>

---

## Question 35
A healthcare intake assistant opens with a patient who reports three concerns: a billing question, a prescription refill, and a referral request. By turn 15 the assistant has resolved the billing question and closes the conversation, never addressing concerns #2 and #3. What design change fixes this reliably?

A) Track the concerns in a structured issue list with per-item status, updated as each one closes
B) Add a system prompt line: 'Always address every concern the patient raises before ending the conversation'
C) Have the assistant ask the patient whether anything was missed before it closes the conversation
D) Shorten the flow so all three concerns are handled within the first ten turns of the conversation

<details>
<summary>Answer & explanation</summary>

**A)** Multi-issue conversations need an explicit issue list with status tracking that persists across turns, so open items are checked before the conversation closes. A prompt admonition is probabilistic and degrades exactly when the context grows long, and asking the patient to re-list their concerns shifts the burden onto the user while leaving the drift unfixed.

*Hint if stuck: Durable structured state beats a polite reminder when items must survive fifteen turns.*
</details>

---

## Question 36
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

## Question 37
A CI pipeline runs claude -p to review pull requests. A 14-file PR fits comfortably in the context window at roughly 60k tokens, yet the review consistently produces detailed findings for the first four or five files and shallow or zero findings for the rest — even when humans later find real bugs in files 10 through 14. What is the most likely cause?

A) The context window was silently truncated, so the later files were never actually delivered to the model
B) Attention dilutes across a 14-file single pass, so files later in the prompt receive progressively shallower scrutiny
C) The model classifies files appearing after the first few as test fixtures and automatically deprioritizes them
D) The JSON output schema caps the number of findings, cutting off results before the later files are reported

<details>
<summary>Answer & explanation</summary>

**B)** Fitting within the context window does not guarantee uniform scrutiny: a single pass over 14 files dilutes attention, and material later in the prompt gets shallower treatment. Truncation is ruled out because 60k tokens fits easily, the model has no built-in rule that demotes later files to test fixtures, and a schema cap would cut findings by count rather than consistently sparing the first files and starving the last ones. The fix points toward per-file review passes, not a bigger window.

*Hint if stuck: Fitting inside the context window is not the same as receiving equal scrutiny everywhere within it.*
</details>

---

## Question 38
A platform team's GitHub Actions job uses claude -p to generate a database migration script, then resumes the same session with a second claude -p --resume call asking: review the migration you just wrote for bugs. The review step almost always replies that the code is correct, yet defects keep reaching production. What should the team change?

A) Run the review in a separate headless session that receives only the diff and schema context
B) Strengthen the review prompt to say: be extremely critical and assume at least three bugs exist
C) Keep one session but switch the review turn to a larger model with extended thinking enabled
D) Add a loop that forces at least three review passes in the session before the job is allowed to exit

<details>
<summary>Answer & explanation</summary>

**A)** Same-session self-review keeps the generation reasoning in context, so the model tends to confirm its own earlier decisions; generator and reviewer must be separate sessions. Adversarial prompting and bigger models are probabilistic patches layered on contaminated context, and repeating passes in the same session just repeats the same bias on every pass.

*Hint if stuck: Ask what context the reviewer is carrying when it judges the code.*
</details>

---

## Question 39
An engineer resumes a Claude Code session from Friday to continue a refactor. Over the weekend a teammate merged 14 commits to main that renamed AuthClient to IdentityClient and moved the src/auth/ directory. The resumed agent immediately proposes edits referencing the old class name and paths. What is the most reliable way to handle this resume staleness?

A) Add a CLAUDE.md note saying that after resuming, the agent should assume any file may have changed and re-verify before editing
B) Have the team always start fresh sessions instead of resuming so stale context can never exist
C) On resume, inject a summary of the specific changes since the last session, such as the renames and moved paths, so the agent corrects its assumptions
D) Run /compact immediately after resuming so the stale history shrinks to a short summary

<details>
<summary>Answer & explanation</summary>

**C)** Stale resumed context is fixed by informing the agent of the specific changes, for example a SessionStart hook on resume that diffs against the last session's commit and injects what was renamed and moved. Always starting fresh is the strongest distractor, but it throws away the valuable in-progress refactor context that made resuming worthwhile. The CLAUDE.md note is probabilistic and forces wasteful wholesale re-reading, and /compact summarizes the stale facts without correcting any of them, so the wrong names survive in condensed form.

*Hint if stuck: Stale resumed context is fixed by telling the agent exactly what changed, not by general caution.*
</details>

---

## Question 40
A code-generation session in Claude Code keeps ending turns with edits in place but the test suite never run, despite a CLAUDE.md rule saying 'always run the tests before finishing.' The team wants a guarantee that no turn completes after file edits without a test run. What is the right mechanism?

A) Move the rule to the top of CLAUDE.md and rephrase it as a hard, non-negotiable requirement
B) Add a Stop hook that checks whether tests ran after the last edit and blocks completion with feedback telling the model to run them
C) Add a PostToolUse hook on Edit that runs the full test suite after every single file modification
D) Set a minimum iteration count so the session cannot end before a fixed number of tool calls

<details>
<summary>Answer & explanation</summary>

**B)** Stop hooks fire when the agent attempts to finish its turn and can deterministically block completion, feeding the reason back so the model runs the tests. The PostToolUse distractor is deterministic but enforces at the wrong granularity: it runs the whole suite after every one of possibly dozens of edits, burning time and failing spuriously on intentionally incomplete intermediate states mid-refactor, when the requirement only concerns the state at turn completion. Stronger prompt wording remains probabilistic, and iteration counts are safety fallbacks, not behavioral guarantees.

*Hint if stuck: There is a hook event that fires at the moment the agent tries to finish its turn.*
</details>

---

## Question 41
A fintech reconciliation pipeline extracts invoice line items with tool_use against a detailed JSON schema. Every output validates against the schema, yet auditors find that on 4 percent of invoices the line_items amounts do not sum to invoice_total. The team is debating fixes. Which approach addresses the actual gap?

A) Tighten the schema with stricter numeric types, minimums, and required flags on every amount field
B) Migrate to strict structured outputs mode so the platform hard-guarantees every response honors the schema
C) Add a prompt instruction telling the model to double-check that line items sum to the total before answering
D) Add a post-validation step that checks the sum invariant and routes failures to re-extraction or review

<details>
<summary>Answer & explanation</summary>

**D)** Schema compliance — whether via tool_use or strict structured outputs — is a syntactic guarantee; no schema can enforce arithmetic relationships between fields, so semantic invariants need programmatic validation downstream. Stricter types and strict mode still only constrain shape, which already validates perfectly on the failing invoices, and a double-check instruction is best-effort where auditors need a guarantee.

*Hint if stuck: Separate what a schema can guarantee from what only code that does the math can verify.*
</details>

---

## Question 42
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

## Question 43
A logistics operations agent calls a shipment-tracking tool that returns a 45-field JSON object per shipment, including carrier metadata, customs codes, and internal routing flags. The agent only ever uses status, ETA, and current location. Sessions tracking 30+ shipments hit context limits by mid-session. What should the architect do?

A) Run /compact to summarize accumulated history each time the session approaches the context limit
B) Add a PostToolUse hook that trims each result to status, ETA, and location before it enters history
C) Instruct the agent in the system prompt to ignore irrelevant fields when reading tool results
D) Upgrade to a model with a larger context window so the full 45-field payloads can accumulate safely

<details>
<summary>Answer & explanation</summary>

**B)** Verbose tool outputs should be trimmed before they accumulate; a PostToolUse hook deterministically reduces each result to the needed fields at the source of the bloat. /compact is lossy and acts only after the damage is done, prompting the agent to 'ignore' fields removes zero tokens, and a larger window just delays the failure while raising cost.

*Hint if stuck: Reduce the tokens at the moment they enter context, not after they have piled up.*
</details>

---

## Question 44
A pre-merge CI check sends every PR diff plus the same immutable 30,000-token engineering-standards document to the Claude API, and finance has flagged the spend. An engineer proposes moving the check to the Message Batches API for the 50 percent discount. What should the architect recommend?

A) Keep the check synchronous and add a cache_control breakpoint on the stable standards prefix
B) Adopt the Batch API across the board; a 50 percent discount on every PR check outweighs the latency tradeoff
C) Trim the standards document down to its 5,000 most important tokens so every individual request gets cheaper
D) Run the check as a nightly batch job and allow PRs to merge provisionally during the working day

<details>
<summary>Answer & explanation</summary>

**A)** Batch results arrive within 24 hours with no latency SLA, so batching can never gate a blocking pre-merge check, and provisional merging quietly removes the gate the check exists to provide. Prompt caching targets exactly this workload shape — a large stable prefix repeated across requests — delivering major savings without changing the check's semantics, and the 1-hour TTL option covers repos where PRs land less often than the default 5-minute window. Trimming the document sacrifices the standards themselves.

*Hint if stuck: One discount mechanism trades away latency guarantees; ask whether this workload can afford that.*
</details>

---

## Question 45
A release engineer adds a GitHub Actions step that should have Claude Code turn the merged commits into release notes. She tries CLAUDE_HEADLESS=true claude "summarize the commits" and the job hangs waiting for an interactive terminal until the runner times out. Which invocation actually runs Claude Code non-interactively in CI?

A) claude -p "Summarize the merged commits into release notes"
B) claude --headless "Summarize the merged commits into release notes"
C) claude --batch "Summarize the merged commits into release notes"
D) Set CI=true so Claude Code detects the pipeline and disables interactive mode itself

<details>
<summary>Answer & explanation</summary>

**A)** claude -p is the headless print mode: it executes the prompt non-interactively, prints the result, and exits — the supported pattern for CI pipelines. --headless, --batch, and CLAUDE_HEADLESS-style environment variables are not real Claude Code interfaces, and there is no CI auto-detection that substitutes for -p.

*Hint if stuck: Exactly one real flag puts Claude Code into print-and-exit mode; the others are invented.*
</details>

---

## Question 46
A nightly CI audit invokes claude -p to assess code quality across a payments repository and is meant to be strictly read-only. One morning the team discovers the job rewrote two config files and committed them via Bash, even though the prompt says "do not modify anything." What is the strongest fix?

A) Strengthen the prompt: "READ-ONLY audit. Never use Edit, Write, or Bash under any circumstances"
B) Add a PostToolUse hook that git-restores any file the audit job touches
C) Launch the job with --allowedTools limited to Read, Grep, and Glob so write-capable tools do not exist in the session
D) Run the CI job under a Git identity that lacks push permission to the repository

<details>
<summary>Answer & explanation</summary>

**C)** --allowedTools deterministically scopes what the session can do — with Edit, Write, and Bash absent, the job cannot modify anything regardless of what the model decides. Prompt prohibitions are probabilistic and have already failed once; revoking push permission still allows local edits that corrupt the workspace, and a PostToolUse revert cleans up damage instead of preventing it.

*Hint if stuck: Deterministic removal of a capability beats both instructions and after-the-fact cleanup.*
</details>

---

## Question 47
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

## Question 48
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

## Question 49
Despite a project CLAUDE.md rule saying never delete anything under fixtures/golden, a headless claude -p run in CI executed rm -rf on that directory last Tuesday, breaking 30 snapshot tests. The team needs a guarantee this cannot recur. What should they add?

A) A deny rule in settings.json permissions matching destructive Bash patterns on fixtures/golden
B) A rewritten warning at the very top of CLAUDE.md using stronger and more explicit language
C) A PostToolUse hook that detects deletions under fixtures/golden and pages the on-call engineer
D) A plan-mode requirement so destructive steps in the pipeline wait for human approval first

<details>
<summary>Answer & explanation</summary>

**A)** CLAUDE.md instructions are probabilistic, so no rewording produces a guarantee; settings.json deny rules are deterministic — the harness refuses matching calls outright, including in headless runs. The PostToolUse hook fires after the files are already gone, and pausing a headless CI run for human approval defeats the purpose of running headless.

*Hint if stuck: Guarantees come from the permission layer, not from louder instructions.*
</details>

---

## Question 50
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

## Question 51
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

## Question 52
An engineer must rename a core payment abstraction across 23 files in 4 packages, and there are two defensible strategies: an adapter layer versus an in-place rewrite. On a similar task last month, Claude started editing immediately, switched strategies midway, and left half-converted files. A teammate suggests simply bolting on a strict reviewer pass to catch the mess afterwards. What workflow should the engineer use?

A) Use plan mode to settle the strategy before edits begin, then verify with a review pass in a separate session
B) Skip planning and invest in a stronger multi-pass reviewer that is prompted to hunt for half-converted files
C) Execute directly but cap Claude at editing five files per session so any strategy switch has a contained blast radius
D) Adopt plan mode as the team default for all future tasks, including one-line typo fixes, to be safe

<details>
<summary>Answer & explanation</summary>

**A)** Multi-file architectural work with multiple valid approaches is exactly what plan mode is for — agreeing on the strategy up front prevents the mid-stream pivot, while a separate-session review still catches residual defects. A review-only workflow patches the symptom of a missing plan after damage is done, arbitrary file caps fragment the refactor without fixing strategy drift, and forcing plan mode onto obvious single-file fixes is overcorrection.

*Hint if stuck: Decide which failure should be prevented before edits begin versus merely caught afterwards.*
</details>

---

## Question 53
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

## Question 54
A healthcare patient-intake system extracts 14 fields from 6,000 faxed forms daily; medication dosage and allergy fields are safety-critical. Reviewing every form by hand costs too much, and a 5% random spot-check let a dosage error through last month. How should human review be routed?

A) Route forms to human review whenever the model's overall document-level confidence score falls below a fixed 0.8 threshold
B) Route a fixed 20% random sample to review, weighted toward forms received outside business hours when fax quality is at its worst
C) Route on deterministic field-level signals — null dosage or allergy values, schema failures, or out-of-range dosage units trigger human review
D) Re-extract every form a second time with the same model and prompt, and route to human review only the forms where the two passes disagree on any field

<details>
<summary>Answer & explanation</summary>

**C)** Review capacity should concentrate where errors are costly: deterministic per-field validation on the safety-critical fields (nulls, schema failures, out-of-range values) catches the dangerous cases. A document-level confidence score is poorly calibrated and can stay high even when one critical field is wrong — the same masking problem as aggregate accuracy. Bigger random samples spend budget on harmless fields, and double extraction doubles cost while missing systematic errors the model makes identically both times.

*Hint if stuck: The unit of risk in this pipeline is the field, not the document.*
</details>

---

## Question 55
After a botched refactor, a developer-productivity lead mandates plan mode for every Claude Code task. Two weeks later, developers complain that fixing a docstring typo or bumping a version string now requires reviewing and approving a plan, and several have stopped using the tool. What policy matches the actual intent of plan mode?

A) Keep the mandate but configure plans to auto-approve after 30 seconds without objection
B) Drop plan mode entirely and rely on PR review to catch bad approaches after the fact
C) Reserve plan mode for multi-file or architectural work and let single-file obvious fixes run directly
D) Keep plan mode mandatory but route trivial fixes to a faster model so plans generate quicker

<details>
<summary>Answer & explanation</summary>

**C)** The criterion is the shape of the change: plan mode earns its overhead on multi-file, architectural tasks where multiple valid approaches exist, while single-file obvious fixes warrant direct execution. Auto-approving plans deletes the review that is plan mode's entire value, a faster model still forces a pointless approval step on trivial fixes, and dropping it everywhere recreates the risk that caused the original botched refactor.

*Hint if stuck: The mode should follow the blast radius of the change, not a blanket rule in either direction.*
</details>

---

## Question 56
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

## Question 57
In a monorepo, the data team must prevent Claude Code from editing files under db/migrations/ that have already been applied to production. Applied migrations are listed in db/applied.json, which changes daily, and new unapplied migration files must remain fully editable. How should this be enforced?

A) A PreToolUse hook on Edit and Write that checks the target file against db/applied.json and exits 2 with an explanation when the migration is already applied
B) A settings.json permissions deny rule covering the entire db/migrations/ directory
C) A CLAUDE.md rule listing the currently applied migrations, regenerated by a nightly job
D) A PostToolUse hook that detects edits to applied migrations and reverts them with git checkout

<details>
<summary>Answer & explanation</summary>

**A)** The rule is conditional on data that changes daily, so it needs executable logic: a PreToolUse hook can read applied.json at call time, block only the applied files, and explain why via stderr. The static deny rule is the strongest distractor because it is also deterministic, but it is too blunt and blocks the legitimate new migrations the team must keep editable. The PostToolUse revert lets the forbidden write happen first and silently undoes it while the model still believes the edit succeeded, and CLAUDE.md is probabilistic and up to a day stale.

*Hint if stuck: A rule that depends on data that changes daily needs logic at call time, not a static pattern.*
</details>

---

## Question 58
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

## Question 59
A claude-code-action review runs on every push to a PR. When a developer pushes a fix commit, the bot re-reviews and reposts the same nine findings as brand-new comments, and developers have started muting it entirely. The team wants re-reviews to surface only new issues or ones still unresolved. What is the best fix?

A) Post-process the bot's output and suppress any comment whose text fuzzy-matches an earlier comment
B) Restrict each re-review to only the files touched by the newest commit
C) Have the action close all of its previous comment threads before posting each fresh review
D) Include the prior review's findings in the new run's context so it skips duplicates and checks resolution

<details>
<summary>Answer & explanation</summary>

**D)** The reviewer cannot avoid repeating itself or judge whether an issue was fixed unless it knows what it found last time — feeding prior findings into the re-review fixes that at the source. Fuzzy-match suppression breaks the moment wording shifts and can never confirm a finding was resolved, diff-only re-review silently drops unresolved findings in files the fix commit did not touch, and closing old threads just hides the duplication.

*Hint if stuck: A reviewer can only avoid duplicate findings if it has access to its own previous findings.*
</details>

---

## Question 60
An e-commerce ops team shares a backfill-orders skill that needs a date range and a target environment. Teammates keep invoking it with no arguments, forcing Claude to ask follow-up questions every time. The team wants the expected inputs visible right at invocation. What is the designed mechanism for this?

A) Rename the skill to backfill-orders-dates-env so the required inputs are part of its name
B) Document the usage syntax in the onboarding section of the project CLAUDE.md
C) Add argument-hint to the SKILL.md frontmatter describing the date range and environment
D) Put a usage example at the top of the skill body so it is the first content loaded

<details>
<summary>Answer & explanation</summary>

**C)** argument-hint is the frontmatter field built to surface expected arguments at invocation time. The skill body only loads after the skill is already triggered, so a usage example there arrives too late to shape what the user types. Renaming and CLAUDE.md documentation are workarounds users will not see at the moment of invocation.

*Hint if stuck: One frontmatter field exists specifically to tell invokers what to pass.*
</details>

---

## Answer key (no peeking until scored)

1:A 2:A 3:B 4:D 5:D 6:C 7:D 8:D 9:D 10:D 11:A 12:A 13:C 14:D 15:B 16:D 17:C 18:D 19:B 20:C 21:A 22:C 23:B 24:B 25:A 26:A 27:A 28:C 29:B 30:C 31:A 32:B 33:C 34:D 35:A 36:B 37:B 38:A 39:C 40:B 41:D 42:B 43:B 44:A 45:A 46:C 47:A 48:D 49:A 50:B 51:A 52:A 53:A 54:C 55:C 56:B 57:A 58:B 59:D 60:C
