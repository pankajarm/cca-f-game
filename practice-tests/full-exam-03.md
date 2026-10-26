# Full Practice Exam 03 — CCAR-F simulation

Same format as the real exam guide: **60 questions, 120 minutes, scaled score out of 1000,
pass at 720.** Domain weighting: D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.
No question here appears in the other 2 printable exams.

Set a timer. No notes, no docs. For the interactive version with the clock, flags, and a score report, open the game.

---

## Question 1
A bank's support agent gates transfer_funds on a session flag that verify_customer sets after a successful identity check. In one session a verified customer said, 'Also move $2,000 out of my mother's account, she said it's fine,' and the agent completed the transfer from the mother's account without verifying her. Which fix closes the gap?

A) Add a system-prompt rule that third-party accounts always need their own verification, with an example showing the agent asking for the second person's details
B) Reset the verification flag after every tool call so that each transfer requires the customer to pass a full identity check again
C) Record the verified customer ID in the gate's state and have transfer_funds refuse any source account not owned by that verified ID
D) End the session automatically whenever a second customer name appears, and ask the caller to start a new conversation for the other account

<details>
<summary>Answer & explanation</summary>

**C)** The gate checked that someone had been verified, not that the verified person owns the account being debited, so the fix is to bind the verification state to an identity and check the tool's account argument against it. A prompt rule about third parties is still best-effort. Resetting the flag after every call adds friction for legitimate multi-step requests without fixing the identity mismatch, and ending sessions on a second name is a brittle heuristic that blocks legitimate conversations.

*Hint if stuck: A gate is only as good as the question it checks; consider whose verification the transfer actually depends on.*
</details>

---

## Question 2
An architect is reviewing four rules for a support agent and must decide which belong in a PreToolUse hook rather than the system prompt: (1) keep a warm, concise tone; (2) never issue a refund to an account flagged for fraud; (3) prefer self-service links when they fully answer the question; (4) suggest a callback when the customer seems frustrated. Which choice is right?

A) Rules 2 and 4 in hooks, since both protect the company and both involve a clear trigger the hook can detect in the conversation or the tool call input
B) All four in hooks, since hooks are deterministic and the business wants every rule to be followed consistently every time
C) Only rule 2 in a hook: it is a mechanical check on a tool call that must hold every time, while the others need judgment and fit the prompt
D) None in hooks; all four fit the system prompt, and the fraud rule can be backed by a weekly audit of refunds issued

<details>
<summary>Answer & explanation</summary>

**C)** Hooks suit rules that can be checked mechanically on a tool call and must be guaranteed, which is the fraud-flag refund block. Tone, when self-service suffices and whether a customer seems frustrated are judgments that belong in prompting; detecting frustration in a hook would be an unreliable heuristic. Putting everything in hooks forces judgment into code, and a weekly audit finds fraud refunds after they are paid.

*Hint if stuck: Sort the rules by whether code could decide them without understanding the conversation.*
</details>

---

## Question 3
A CI coordinator spawns a test-writer subagent with the Task prompt 'Write tests for the changes in this PR.' The subagent writes tests in the wrong framework against files the PR did not touch. What should the coordinator include in the Task prompt?

A) A reminder that the subagent can find all of the PR details by looking back through the coordinator's conversation history
B) An instruction to ask the developer which files and framework to use before it writes any of the tests
C) The changed file paths, the relevant diff hunks, the project's test framework and its conventions for test files
D) Nothing more, but restrict the subagent's tools to Read and Write so it cannot explore files outside the PR

<details>
<summary>Answer & explanation</summary>

**C)** The subagent sees only its Task prompt, so the coordinator must pass the changed paths, the diff and the test conventions explicitly. A regular subagent starts without the coordinator's history. A CI run has no developer to ask, and restricting tools to Read and Write does nothing to tell the subagent which files changed or which framework to use.

*Hint if stuck: List what a newcomer would need to write the right tests on the first try.*
</details>

---

## Question 4
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

## Question 5
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

## Question 6
A fintech document-extraction subagent processing 200 statements hits two failures: a 504 gateway timeout fetching one PDF, and an 'invalid credentials' error from the archival store for twelve older PDFs. It currently propagates both to the coordinator immediately, halting the entire batch. How should each failure be handled?

A) Propagate both immediately — the coordinator owns all error handling and subagents should stay stateless
B) Retry both locally with exponential backoff until they succeed or the iteration cap is reached
C) Retry the 504 locally with backoff; propagate the credentials failure with context, since no retry will fix it
D) Retry the credentials error locally — auth tokens often refresh — and propagate the 504 since timeouts indicate systemic load

<details>
<summary>Answer & explanation</summary>

**C)** Transient errors like gateway timeouts should be recovered locally with retries, while unresolvable errors like invalid credentials must be propagated with context because retrying cannot fix them. The reversed pairing retries an auth failure that no backoff will repair — burning iteration budget and masking a problem only the coordinator or an operator can resolve — while needlessly escalating a one-off timeout.

*Hint if stuck: Sort the two failures by whether a retry could ever change the outcome.*
</details>

---

## Question 7
An architect wants to resume a three-week-old research session about a regulatory landscape. Many of the web sources the session read may have been updated since, but nobody knows which ones. The session's high-level conclusions are probably still useful. What is the most reliable way to continue?

A) Resume the session and tell it which sources changed, so it re-reads only those before continuing the work
B) Start a fresh session seeded with a summary of the conclusions and the source list, and have it re-verify the sources
C) Fork the old session so the original is preserved, then continue the research inside the fork without changes
D) Resume the session as it is, since high-level conclusions about regulation rarely change within a few weeks

<details>
<summary>Answer & explanation</summary>

**B)** Telling a resumed session what changed works only when you know what changed; here you do not, so many tool results may be silently stale and a fresh session with a summary plus re-verification is safer. Resuming as-is trusts unknown stale data, and forking copies the same stale history into a new branch.

*Hint if stuck: Targeted updates need you to know what changed; what if you don't?*
</details>

---

## Question 8
A team's claude-code-action job occasionally loops for over an hour on hard tasks, consuming runner minutes and API spend. They want a hard ceiling on how much work one run can do. Which configuration is most appropriate?

A) Add a CLAUDE.md line telling Claude to keep every CI task brief and stop once it has a reasonable answer
B) Ask Claude in the prompt to report its own elapsed time and stop on its own after about ten minutes
C) Set a --max-turns limit for the action and a timeout-minutes on the workflow job as an outer runtime limit
D) Lower the model's output length so each turn produces less text and the overall run finishes sooner

<details>
<summary>Answer & explanation</summary>

**C)** A turn limit on the action and a workflow-level timeout are both enforced outside the model, giving a real ceiling on each run. Instructions in CLAUDE.md or the prompt are requests Claude may not follow on hard tasks. Shorter outputs per turn do nothing to stop a run that takes many turns.

*Hint if stuck: Put limits where something other than the model enforces them.*
</details>

---

## Question 9
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

## Question 10
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

## Question 11
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

## Question 12
A claude-code-action review runs on every push to a PR. When a developer pushes a fix commit, the bot re-reviews and reposts the same nine findings as brand-new comments, and developers have started muting it entirely. The team wants re-reviews to surface only new issues or ones still unresolved. What is the best fix?

A) Post-process the bot's output and suppress any comment whose text fuzzy-matches an earlier comment
B) Restrict each re-review to only the files touched by the newest commit
C) Have the action close all of its previous comment threads before posting each fresh review on the pull request
D) Include the prior review's findings in the new run's context so it skips duplicates and checks resolution

<details>
<summary>Answer & explanation</summary>

**D)** The reviewer cannot avoid repeating itself or judge whether an issue was fixed unless it knows what it found last time — feeding prior findings into the re-review fixes that at the source. Fuzzy-match suppression breaks the moment wording shifts and can never confirm a finding was resolved, diff-only re-review silently drops unresolved findings in files the fix commit did not touch, and closing old threads just hides the duplication.

*Hint if stuck: A reviewer can only avoid duplicate findings if it has access to its own previous findings.*
</details>

---

## Question 13
A team uses Claude Code to generate API reference docs and an LLM judge to score them for accuracy; the judge rates 94% as 'accurate'. When two senior engineers read 50 docs, they judge only 70% accurate, mostly due to wrong parameter defaults the judge missed. What should the team do?

A) Replace the judge with a larger, more capable model, since a stronger grader will catch the wrong parameter defaults without any further changes
B) Calibrate the judge against expert labels: refine its rubric and inputs until its grades match the engineers', and keep spot-checking periodically
C) Average the judge's score with the engineers' score to get a combined accuracy figure that the team can report from now on
D) Trust the judge's 94% for reporting, since 50 docs is too small a sample to overrule a grader that has scored thousands of documents

<details>
<summary>Answer & explanation</summary>

**B)** An LLM judge is only trustworthy once its grades agree with human experts, so the rubric needs refining against their labels and periodic spot checks. A bigger model is not calibrated by being bigger, and averaging two disagreeing numbers hides the problem. A 24-point gap on 50 expert-reviewed docs is strong evidence the judge is miscalibrated, not noise.

*Hint if stuck: A grader needs a reference to be trusted against.*
</details>

---

## Question 14
An engineer asks a productivity agent to list dead code in a large Java service. The report includes handlers registered through a plugin registry, methods invoked by reflection from a config file, and public API methods that external clients call. What prompt change most improves the report's precision?

A) Ask the agent to report only code it is highly certain is unused, and to leave out anything doubtful
B) Ask the agent to list everything it found but sort the report so that the most likely dead code appears first and the rest follows
C) Tell the agent that this codebase uses reflection heavily and that it should take that into account
D) State that code reached through the plugin registry, reflection config or public API is in use and is not reported

<details>
<summary>Answer & explanation</summary>

**D)** Naming the exact ways code can be live without a direct call (registry, reflection config, public API) gives the agent concrete exclusions it can check. "Highly certain" is vague caution, a general note about reflection does not say which references count, and sorting keeps every false positive in the report.

*Hint if stuck: Tell the agent exactly which kinds of reference count as use.*
</details>

---

## Question 15
A developer-productivity agent proposes a refactor across 40 files of a legacy billing module. The staff engineer wants an automated review before a human looks at it, and the agent's session is already near its context limit. What review setup is most appropriate?

A) Spawn fresh reviewer instances for groups of related files, then run one integration review over the module's public interfaces
B) Have the same session review the files in reverse order so it reads the last-changed files while its attention is strongest
C) Run /compact in the agent's session to free space, then ask it to review its own refactor while the plan is still fresh
D) Skip the automated review and send all 40 files to the staff engineer, since AI review adds little to a large refactor

<details>
<summary>Answer & explanation</summary>

**A)** Fresh reviewer instances avoid both the near-full context and the self-review bias, and grouping files keeps each pass focused while a final integration review covers the module's seams. Compacting and self-reviewing keeps the bias and loses detail, re-ordering does not create independence, and dropping automation pushes 40 files of review onto one person.

*Hint if stuck: Two problems here, a full context and an author reviewing itself; one design fixes both.*
</details>

---

## Question 16
A support agent handles 60-turn sessions and uses progressive summarization to control context growth. In a recent case the agent confirmed order #88412 and a $63.20 refund early in the conversation; after two summarization passes it told the customer the refund was "around $60" and asked for the order number again. What is the right fix?

A) Run summarization less frequently and double the summary token budget so numeric details survive more compression passes before they drift
B) Maintain a structured case-facts block (order ID, amounts, commitments) outside the summarized history, pinned where the agent always sees it
C) Instruct the summarizer prompt to always preserve all numbers exactly, and validate each summary with a regex check for currency amounts
D) Switch the session to a larger-context model so summarization becomes unnecessary until the conversation passes roughly 200 turns

<details>
<summary>Answer & explanation</summary>

**B)** Progressive summarization erodes exact figures by design — every pass paraphrases — so the durable fix is a structured case-facts block kept outside the summarized history entirely. Tuning summary frequency or prompting "preserve all numbers" still routes critical facts through lossy compression and merely delays the failure. A bigger context window postpones the problem and ignores the fact that long sessions degrade regardless of window size.

*Hint if stuck: Some facts should never travel through a lossy compression step at all.*
</details>

---

## Question 17
A research team moves its synthesis agent to strict structured outputs, and every report now validates against the schema. A reviewer still finds that `published_date` sometimes holds the date the source was accessed rather than published, and a few `source_url` values point to the wrong paper. The lead proposes tightening the schema further. What is the better response?

A) Add a regex pattern for `source_url` so that only well-formed URLs pass the schema validation
B) Make `published_date` a required field so the model cannot leave it out of any report
C) Switch from structured outputs back to plain tool use, on the belief that tool use applies stricter checks to field values
D) Clarify field descriptions and add semantic checks, such as resolving each URL and comparing titles

<details>
<summary>Answer & explanation</summary>

**D)** Schema compliance guarantees structure, not correctness, so wrong dates and mismatched URLs need clearer field definitions (published versus accessed) and application-level checks. A URL regex accepts a well-formed wrong URL, making the date required does not make it the right date, and tool use offers the same structural guarantees, not semantic ones.

*Hint if stuck: Ask what kind of error a schema can and cannot catch.*
</details>

---

## Question 18
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

## Question 19
A CI job reviews very large pull requests by fanning out one subagent per changed file and then running an integration pass. The integration step is given the raw contents of all 60 files and keeps timing out with shallow results. What should the integration pass receive instead?

A) The per-file findings plus a summary of each file's changed interfaces, exports and call sites, so it can reason about connections
B) The raw contents of only the ten largest files, since big files are the most likely to contain the cross-file problems
C) Nothing from the per-file step, so that the integration review stays independent and unbiased by what other reviewers already said
D) The full contents of all 60 files split across six sequential integration calls of ten files each, with each call reviewed separately

<details>
<summary>Answer & explanation</summary>

**A)** The integration pass exists to reason about how files connect, so it needs condensed structured input about interfaces and findings rather than raw text. Picking the largest files is an arbitrary filter, withholding per-file findings makes it redo work, and splitting into ten-file batches reintroduces the very boundaries the integration pass is meant to cross.

*Hint if stuck: Give the cross-file step what it needs to see connections, not everything.*
</details>

---

## Question 20
A team's testing rule uses paths: **/*.test.ts. The repository also has older tests named *.spec.ts and some helpers under __tests__/ folders, and Claude ignores the testing conventions when it edits those. What is the most direct fix?

A) List additional patterns in paths, such as **/*.spec.ts and **/__tests__/**, in the same rule file
B) Remove the paths field so that the testing conventions load whenever any file in the repo is edited
C) Rename every older test file to *.test.ts so the existing rule pattern happens to match all of them
D) Create a second rule with identical content for the *.spec.ts files and the __tests__ helper folders

<details>
<summary>Answer & explanation</summary>

**A)** The paths field accepts a list of patterns, so the same rule can cover every test naming convention at once. Renaming hundreds of files to suit a glob is churn with no benefit. Removing paths loads test conventions everywhere, and a duplicated second rule brings back the drift problem.

*Hint if stuck: A rule can carry more than one pattern.*
</details>

---

## Question 21
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

## Question 22
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

## Question 23
A team built .claude/skills/claims-extract/SKILL.md to standardize healthcare intake form extraction, but Claude Code never auto-invokes it — the frontmatter description just says "Extraction helper." An engineer rewrote the description mid-session, yet the running session still does not pick the skill up. What resolves both problems?

A) Move the skill body into the project CLAUDE.md so it is always loaded, since skills can only ever be triggered from explicit slash commands
B) Add context: fork to the frontmatter — skills cannot auto-invoke until they are marked to execute inside an isolated forked context
C) Convert the skill into .claude/commands/claims-extract.md, because automatic invocation is supported only for project slash commands
D) Write a specific description of what the skill does and when to use it, then run /reload-skills so the session rescans the skills directory

<details>
<summary>Answer & explanation</summary>

**D)** The frontmatter description drives auto-invocation, so a vague "Extraction helper" gives the model nothing to match intake-form requests against. /reload-skills rescans skills mid-session, picking up the edit without a restart. context: fork controls execution isolation rather than triggering, and slash commands are explicit-invocation only — moving the skill there abandons auto-invocation instead of fixing it, while inlining into CLAUDE.md sacrifices progressive disclosure.

*Hint if stuck: One frontmatter field decides whether a skill triggers, and a 2026 slash command refreshes skills without restarting the session.*
</details>

---

## Question 24
A team built a /decision-log skill meant to summarise the design decisions made earlier in the current Claude Code conversation and append them to docs/decisions.md. To keep the main session tidy they added context: fork to its frontmatter. Since then the skill writes generic entries that ignore everything the team discussed in the session. What explains this, and what should they change?

A) A forked skill runs in an isolated context without the conversation history, so this skill should run inline without context: fork
B) The forked subagent runs on a smaller default model, so add a model override that matches the main session's model
C) The description is too vague for a forked run, so expand it with examples of decisions the team usually records
D) Forked skills cannot write files, so add Write and Edit to allowed-tools so the subagent can append to the log

<details>
<summary>Answer & explanation</summary>

**A)** context: fork runs the skill in a separate subagent whose prompt is the skill content, so it has no access to what was said earlier in the main conversation; a skill whose whole job is to read that conversation must run inline. Expanding the description affects when the skill is chosen, not what context it sees. Granting more tools or changing the model leaves the subagent just as blind to the discussion it is supposed to summarise.

*Hint if stuck: Think about what a forked subagent can and cannot see when it starts.*
</details>

---

## Question 25
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

## Question 26
A developer asks Claude Code to replace every `console.log` call with the team's structured `logger.info` across 400 files. The mapping is mechanical and identical everywhere, and tests exist for all files. A teammate suggests an investigate-first approach that explores the architecture and plans adaptively. What is the better choice?

A) Agree with the teammate, since any task touching 400 files is complex enough to need an exploratory mapping phase first
B) Have Claude choose a different approach for each directory based on what it finds there, to account for local code styles
C) Treat it as a predictable task: apply the same transformation to each batch of files and verify each batch with the tests
D) Ask Claude to do all 400 files in one prompt, since the change is so simple that splitting it into separate steps would add nothing useful

<details>
<summary>Answer & explanation</summary>

**C)** Scale alone does not make a task open-ended; a mechanical, identical change is predictable work best handled as a fixed per-batch step with test gates. An exploratory phase adds cost with nothing to discover, varying the approach per directory creates inconsistency, and one giant pass dilutes attention and makes failures hard to isolate.

*Hint if stuck: Is the work hard to plan, or just large?*
</details>

---

## Question 27
A subscription-box support agent looks up a customer by email and finds no account, but finds two accounts by the name 'J. Okafor' in the same city, one with an active order. The customer wants to change the shipping address on 'my order'. What is the right next step?

A) Change the address on the account with the active order, since it is the only one that could have an order to change
B) Ask the customer for an identifier that distinguishes the accounts, such as an order number or the phone on file
C) Escalate to a human immediately, because any ambiguity in customer identity is outside what the agent can resolve
D) Show the customer both accounts' addresses and order details so they can point out which one is theirs

<details>
<summary>Answer & explanation</summary>

**B)** When a lookup returns multiple matches, the agent should ask for another identifier rather than guess. Picking the active-order account is a plausible guess that can redirect a stranger's shipment, showing both records leaks another customer's data, and escalating is premature when one more question resolves it.

*Hint if stuck: Multiple matches call for more information, not inference.*
</details>

---

## Question 28
A freight-audit pipeline reports a 94 percent first-pass validation rate across all carriers, and the retry-with-feedback loop raises it to 98 percent. A new carrier's invoices make up 6 percent of volume, and complaints from that carrier's account team keep rising. What should the architect check first?

A) Whether the retry limit should be raised to push the overall rate from 98 percent closer to 100 percent
B) Whether the overall validation threshold should be lowered so fewer invoices are sent to the retry loop
C) Whether more examples from the largest carriers would raise the aggregate first-pass validation rate further
D) Pass and retry rates broken out by carrier and document layout, to see whether the new carrier is failing

<details>
<summary>Answer & explanation</summary>

**D)** An aggregate rate can look healthy while a small segment fails badly; breaking metrics out by carrier and layout shows whether the new carrier's invoices are the problem. Raising the retry limit or lowering thresholds tunes the aggregate without locating the failure, and more examples from large carriers improves the segment that is already fine.

*Hint if stuck: Averages can hide a small group that is doing badly.*
</details>

---

## Question 29
A support agent has two PreToolUse hooks on issue_credit: an enrichment hook that looks up the customer's tier and stores it in shared state, and a policy hook that reads that tier to decide whether the credit exceeds the tier's limit. Most of the time it works, but occasionally a gold-tier customer's valid credit is denied. What is the likely cause and fix?

A) The deny from the policy hook is overriding an allow from the enrichment hook; the enrichment hook should return allow with a higher priority
B) The enrichment hook takes too long and should be made async so that it returns at once and the policy hook can then read the stored tier
C) Matching hooks run in parallel in no fixed order, so the policy hook sometimes reads the tier before it is set; it should look the tier up itself
D) The policy check belongs in a PostToolUse hook, which always runs after every PreToolUse hook and so would always see the stored tier value when it ran

<details>
<summary>Answer & explanation</summary>

**C)** Hooks matching the same event run in parallel and their completion order is not deterministic, so a hook must not depend on another having run first; the policy hook should fetch the tier itself or the two should be merged. Deny does take priority over allow, but the enrichment hook is not deciding anything. An async hook cannot influence the operation at all, and a PostToolUse check runs after the credit has been issued.

*Hint if stuck: Ask what the policy hook assumes about the other hook, and whether that assumption is guaranteed.*
</details>

---

## Question 30
An extraction team pasted their 400-line Python schema validator into the body of a validate-extraction skill so Claude would 'know' the checks. Each invocation now loads the whole script into context, and Claude occasionally rewrites parts of the validator inline instead of running it. How should the skill be structured?

A) Convert the validator into a long list of prose rules in SKILL.md so that Claude applies the same checks
B) Keep the script but move it into the project CLAUDE.md so that it is already loaded before the skill runs
C) Split the validator across four smaller skills, each holding about a hundred lines of the original script
D) Ship the validator as scripts/validate.py inside the skill folder and have SKILL.md tell Claude to execute it

<details>
<summary>Answer & explanation</summary>

**D)** Scripts bundled in a skill's folder are executed rather than loaded, so the checks run exactly as written and the code costs no context. Prose rules make Claude re-implement validation by judgment, which is less reliable than the real validator. Moving the script into CLAUDE.md makes it an always-on cost, and splitting it into four skills keeps the same context cost while fragmenting the logic.

*Hint if stuck: Should Claude read this code or run it?*
</details>

---

## Question 31
A research subagent returns findings as one long paragraph, with the decisive result (a recall of a component used by three suppliers) mentioned in the eighth sentence. The coordinator often omits it from the brief. Short of defining a full output schema, what format change helps most?

A) Ask the subagent to bold the important sentence anywhere it happens to appear within the paragraph
B) Ask the subagent to lead with key findings under clear headers, then supporting detail and sources
C) Ask the subagent to repeat the key finding at the start, the middle and the end of its paragraph
D) Ask the subagent to keep the paragraph format but shorten it to a maximum of four sentences overall

<details>
<summary>Answer & explanation</summary>

**B)** Leading with key findings under headers places them where they are read most reliably and makes them easy to lift into synthesis. Bolding inside dense prose and repeating the finding add noise without structure, and an arbitrary length cap may cut the very detail needed.

*Hint if stuck: Position and labels both affect what gets picked up downstream.*
</details>

---

## Question 32
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

## Question 33
A team asks Claude Code to write unit tests in their house style: arrange-act-assert blocks, one behaviour per test, and descriptive names. The prompt includes one example test for a pure function. Generated tests for functions with database or network calls invent mocking patterns the team does not use. What change should the architect make?

A) Add an instruction telling the model never to mock anything and to use real database and network connections in all tests
B) Add a long description of the team's mocking library and its API so the model can work out the correct pattern on its own
C) Ask Claude Code to generate three alternative tests for each function so a developer can choose the one closest to the house style
D) Add a second example test for a function with a database call, showing the team's mocking pattern alongside the house structure

<details>
<summary>Answer & explanation</summary>

**D)** The single example only covered pure functions, so the model had nothing to imitate for the database case; a targeted example with the team's mocking pattern covers that variation. Banning mocks forces slow, flaky tests the team does not want, an API description leaves the pattern to interpretation, and generating alternatives shifts the selection work onto developers without fixing the gap.

*Hint if stuck: Look for the kind of input the examples never covered.*
</details>

---

## Question 34
A CI reviewer comments heavily on generated files, including database migration snapshots, lockfiles and protobuf stubs, which developers never edit by hand. Every comment on these is dismissed. What is the most precise fix?

A) Tell the reviewer to skip files that look automatically generated or that seem unimportant to the change
B) Mark every comment the reviewer makes on any file as advisory so none of them block the merge
C) Ask the reviewer to collapse all of its comments on generated files into a single short note at the end of each review it posts
D) List the generated paths explicitly, such as lockfiles, migration snapshots and protobuf stubs, and exclude them from review

<details>
<summary>Answer & explanation</summary>

**D)** Naming the exact paths and patterns to skip gives a deterministic, checkable scope instead of leaving the model to guess what "looks generated." Collapsing comments keeps the noise, "unimportant to the change" is undefined, and making every comment advisory weakens real findings elsewhere.

*Hint if stuck: Be exact about what is out of scope.*
</details>

---

## Question 35
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

## Question 36
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

## Question 37
Engineers on a multi-agent research system have a /map-sources skill that walks the repository to list every place a subagent fetches external sources. Each run reads dozens of files and floods the main session, and a reviewer insists the skill must never modify anything. Which frontmatter best meets both needs?

A) disable-model-invocation: true, so that engineers decide when the expensive walk is allowed to happen
B) context: fork on its own, so the walk runs in a general-purpose subagent with the session's full tool set
C) allowed-tools: Read Grep, together with a line in the body telling Claude to avoid editing any files at all
D) context: fork with agent: Explore, so the walk runs in a read-only subagent and only its summary returns

<details>
<summary>Answer & explanation</summary>

**D)** Forking keeps the noisy file walk out of the main context, and pairing it with the Explore agent type runs it in a subagent built for read-only exploration, so both requirements are met by configuration. A plain fork uses a general-purpose agent that can still edit files. Narrowing the tool list speaks to the write risk but leaves the file walk flooding the main session, and limiting who can invoke the skill solves neither the noise nor the write risk.

*Hint if stuck: One field controls where the skill runs; another controls what kind of agent runs it.*
</details>

---

## Question 38
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

## Question 39
A support coordinator uses an AgentDefinition for a refund-eligibility subagent that should only read order and policy data. The definition omits the tools field, and in testing the subagent sometimes calls issue_refund directly from the MCP billing server. What is the right configuration change?

A) Add a sentence to the subagent's prompt forbidding it from calling issue_refund under any circumstances
B) Leave the tools field out, but log every issue_refund call made by the subagent so it can be reviewed later
C) Remove issue_refund from the coordinator's allowedTools so no agent in the system can call that tool at all
D) Set the tools field to only the read-only order and policy lookups the subagent needs for its job

<details>
<summary>Answer & explanation</summary>

**D)** When tools is omitted, the subagent inherits every tool available to subagents, so restricting it to the read-only lookups it needs is the deterministic fix. A prompt rule is probabilistic and can fail. Taking issue_refund away from the whole system breaks the legitimate refund path, and logging records the violation after money has moved.

*Hint if stuck: What does a subagent get by default when its tool list is left blank?*
</details>

---

## Question 40
A CI job asks Claude to review a PR and "return findings as JSON." A script then parses the reply to post comments, but a few runs a week fail because the reply has a sentence before the JSON or a trailing comma. What is the most reliable fix?

A) Add a stronger instruction to return only raw JSON with no prose before or after it
B) Wrap the parser in a retry that re-runs the whole review whenever the JSON fails to parse, up to three times per PR
C) Use a regular expression to cut out whatever lies between the first and the last curly brace
D) Define a `report_findings` tool with a JSON schema for findings and have Claude return them through it

<details>
<summary>Answer & explanation</summary>

**D)** Returning findings through a tool with a JSON schema (or a structured output format) removes syntax and stray-prose failures at the source, so the parser always receives valid structure. A stronger instruction is still only advisory, retries waste runs on a problem that can be prevented, and brace-slicing breaks on nested or malformed content.

*Hint if stuck: Remove the syntax problem at the source instead of repairing it afterward.*
</details>

---

## Question 41
An airline support agent can rebook passengers under a documented disruption policy. A passenger asks for compensation for a missed wedding caused by a 9-hour delay, something the policy does not mention at all. The agent has access to a goodwill-credit tool. What should it do?

A) Issue a moderate goodwill credit with the tool, since the delay was clearly long, the passenger has a reasonable complaint and the tool is available
B) Tell the passenger that compensation for personal events is not offered, since the policy does not list it
C) Ask the passenger to send evidence of the wedding, then decide on a credit amount once the evidence arrives
D) Escalate to a human, since the request falls outside documented policy, passing along the delay details and the request

<details>
<summary>Answer & explanation</summary>

**D)** A request the policy does not cover is a policy gap, and gaps should go to a human rather than be improvised. Issuing a credit or collecting evidence to decide an amount means the agent inventing policy, and declining treats silence in the policy as a firm no, which is also a decision the agent was not given.

*Hint if stuck: Silence in the policy is not permission, and it is not a refusal either.*
</details>

---

## Question 42
A CI job runs Claude non-interactively to post review comments, and a script parses each comment for a file path, line number and severity. Comments arrive as free paragraphs, as bullet lists, or with severity at the end, so the script drops about 20 percent of findings. The team does not want to change the parser. What prompt change fixes this most reliably?

A) Add a sentence to the prompt saying the parser is strict and that badly formatted comments will be silently dropped from the review
B) Run the review twice and keep whichever run produced more parseable comments, discarding the run that produced fewer of them
C) Add two or three example comments in the exact layout the parser expects, covering a high, a medium and a low severity finding
D) Tell the model to put the severity first and the file path second, and list the allowed severity words directly beneath that rule

<details>
<summary>Answer & explanation</summary>

**C)** Concrete examples in the exact target layout are the most reliable prompt lever for consistent format, and covering several severities shows the pattern holds across cases. Explaining that the parser is strict is still a description, running twice doubles cost and keeps the variance, and a written ordering rule is the same kind of prose that already left a fifth of comments unparseable.

*Hint if stuck: Think about which lever is strongest for making format repeat exactly.*
</details>

---

## Question 43
A developer-productivity tool extracts breaking API changes from PR descriptions into a JSON changelog. On validation failure, the retry sends only the failed JSON and the error message, to save tokens. Retried outputs fix the reported field but often change other fields to values that are not in the PR at all. What is the most likely fix?

A) Include the original PR description in the retry along with the failed output and the specific validation error
B) Add an instruction to keep every field unchanged except the one named in the error message from the validator
C) Send only the failed field and its error, so the model cannot touch any of the other fields in the changelog entry
D) Run a second validator that rejects changes to any field other than the failed one, and retry again when it fires

<details>
<summary>Answer & explanation</summary>

**A)** Without the source document, the model has no grounding for the corrected output and fills gaps from guesses; the retry needs the original input, the failed output and the specific error together. Sending only the failed field loses cross-field context, an instruction not to change fields still leaves the model ungrounded, and a second validator stacks more retries on a request missing its source.

*Hint if stuck: A correction is only as good as the material the model can check it against.*
</details>

---

## Question 44
A team's PR review job runs claude-code-action. Their test-writing standards (factory helpers, no network in unit tests) live on an internal wiki, and developers paste them into local prompts. CI-generated tests never follow them. How should the team make the standards apply both locally and in CI?

A) Paste the standards into the action's prompt input, and ask developers to keep pasting them locally
B) Ask each developer to add the standards to their own ~/.claude/CLAUDE.md so local sessions follow them
C) Link the wiki URL in the PR template so Claude can read the standards from each pull request body
D) Commit the standards to the repo as project memory, in CLAUDE.md or a .claude/rules/testing.md file

<details>
<summary>Answer & explanation</summary>

**D)** Project-level memory is version-controlled and loads for every session in the repo, including the CI runner, so one committed file serves both local and automated runs. Pasting into the CI prompt and local prompts keeps two copies to maintain. User-level files never reach CI or teammates, and a wiki link in a PR body depends on Claude fetching and following it each time.

*Hint if stuck: Find the scope that both a laptop session and a CI runner load from the same checkout.*
</details>

---

## Question 45
An internal IT agent onboards new hires by creating accounts in four systems in sequence: directory, email, payroll, then badge access. When payroll's API times out, the agent retries from the start on the next run and creates duplicate directory and email accounts; when it eventually escalates, IT staff cannot tell which systems are done. What should the workflow do?

A) Have the agent re-check all four systems from scratch at the start of each run and work out for itself which accounts already exist and which are missing
B) Wrap the four steps in a single long tool call so that either all four accounts are created together or none of them are created
C) Persist each step's completion in workflow state, resume from the first incomplete step, and include done and pending steps in any escalation
D) Add a system-prompt rule telling the agent never to repeat a step it has already completed earlier for the same new hire

<details>
<summary>Answer & explanation</summary>

**C)** A multi-step workflow needs durable, code-held state for each step so it can resume where it stopped and so a human handoff can say exactly what is done and what is not. Having the model re-check all systems each run is slower and depends on its inference. A single all-or-nothing call is rarely possible across four independent systems, and a prompt rule cannot stop duplicates the model does not know about.

*Hint if stuck: Both symptoms come from the same missing piece of information.*
</details>

---

## Question 46
A developer runs a long Claude Code session refactoring a payments module and has to hand the half-finished work to a colleague in another time zone. The first attempt was to share the full session transcript; the colleague spent an hour working out which files were done and accidentally re-applied a change. What should the handoff note include?

A) The full transcript again, together with the git diff, so the colleague can match each change in the diff to the turn that produced it
B) A list of the files changed with their status, decisions made and why, tests passing or failing now, and the specific next steps left to do
C) A short summary paragraph written by Claude at the end of the session describing the overall goal of the refactor and the general approach it took
D) A note telling the colleague to resume the same session so Claude can answer their questions about the work it has already completed

<details>
<summary>Answer & explanation</summary>

**B)** A handoff works when it hands over structured state: what changed, what was decided, the current test status and the concrete next steps, so the next person can act without reconstructing anything. The transcript plus diff is the same reconstruction burden in a bigger form. A general summary loses the per-file status that caused the duplicate change, and resuming the session depends on context the colleague cannot inspect directly.

*Hint if stuck: The colleague's mistake came from not knowing what was already done.*
</details>

---

## Question 47
An engineer's ~/.claude/rules/style.md says to indent with 4 spaces in TypeScript. His team's project rule .claude/rules/ts.md says 2 spaces. Claude's output in that repository switches between the two from one session to the next. What is the right fix?

A) Nothing is needed, because project rules always override user rules when the two of them disagree
B) Reconcile the two rules, for example by dropping the indent line from his personal rule, so they no longer contradict
C) Move the team's 2-space rule into CLAUDE.md, since CLAUDE.md always outranks any of the rule files
D) Rename the project rule so it sorts after the user rule alphabetically and therefore gets priority

<details>
<summary>Answer & explanation</summary>

**B)** User and project rules both load and neither overrides the other; when they conflict Claude may follow either, so the only reliable fix is to remove the contradiction. There is no override precedence between them, filenames don't set priority, and CLAUDE.md does not outrank rules, so moving the team instruction leaves the same conflict in place.

*Hint if stuck: When two loaded instructions contradict each other, does anything decide the winner?*
</details>

---

## Question 48
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

## Question 49
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

## Question 50
An evaluation on 300 labeled findings shows that adding "be conservative and only report real problems" to a review prompt cut true positives and false positives by about the same proportion. Precision barely moved, and recall dropped. What does this suggest the team should do next?

A) Strengthen the conservative wording further, since it is already reducing the number of false positives
B) Replace the vague caution with explicit criteria describing which issue types to report and which to skip
C) Revert the change and leave the prompt as it was, since prompt changes cannot improve precision here
D) Keep the wording and add a confidence threshold on top, so that only the strongest findings remain

<details>
<summary>Answer & explanation</summary>

**B)** A general caution makes the model report less of everything, which is why true and false positives fell together; explicit criteria change which findings are reported, which is what moves precision. Stronger wording just cuts recall further, a confidence threshold relies on self-rating, and reverting gives up on a problem that explicit criteria can fix.

*Hint if stuck: Reporting less is not the same as reporting the right things.*
</details>

---

## Question 51
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

## Question 52
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

## Question 53
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

## Question 54
A support-resolution agent ends each conversation by writing a handoff summary for human agents. The required format is four labeled sections, but in production the model sometimes merges sections, renames headers, or adds extras, even though the prompt describes the format in detail. What is the most reliable prompt-level fix?

A) Add two to four complete example summaries to the prompt that demonstrate the exact section structure on representative tickets
B) Expand the prose format description with stronger language such as 'you must always use exactly these four section headers in this order'
C) Append thirty example summaries covering every ticket category the support team has ever encountered
D) Ask the model to first restate the format rules in its own words, then write the summary beneath its restatement

<details>
<summary>Answer & explanation</summary>

**A)** Few-shot examples demonstrate format far more reliably than prose descriptions, and 2 to 4 well-chosen examples are typically enough for format consistency. Thirty examples add cost and context bloat with diminishing returns, stronger prose wording is the same probabilistic instruction that is already failing, and a restatement preamble adds extra text that itself violates the required four-section output.

*Hint if stuck: Showing the model the output usually beats describing it, but more of a good thing has diminishing returns.*
</details>

---

## Question 55
A research subagent labels each source as primary, secondary or unreliable before synthesis. Reviewers find it is inconsistent on preprints, company white papers and conference abstracts, while the written definitions of each label are already detailed and agreed by the team. What is the most effective next step?

A) Rewrite the three label definitions at greater length, adding sub-clauses for preprints, white papers and abstracts so each case is spelled out in prose
B) Have a second subagent independently label the same sources and keep only those where both agree, discarding all the sources with disagreements
C) Add worked examples of a preprint, a white paper and an abstract, each with the chosen label and the reason it fits better than the alternatives
D) Add a fourth label called uncertain so that the model can opt out of labelling preprints, white papers and abstracts when it cannot decide

<details>
<summary>Answer & explanation</summary>

**C)** The definitions are already good; what is missing is demonstrated judgment on the ambiguous types, and examples that explain why one label beats the others generalise to similar sources. Longer definitions add more prose the model already interprets inconsistently, dual labelling discards useful sources rather than fixing the judgment, and an opt-out label hides the inconsistency instead of resolving it.

*Hint if stuck: When the rules are clear but the borderline calls are not, show the borderline calls.*
</details>

---

## Question 56
A research coordinator receives the request 'Compare the leading battery suppliers.' It is unclear whether the user means EV cells, grid storage or consumer electronics, and each would send subagents to very different sources. The system runs interactively. What is the best first step?

A) Run subagents for all three markets in parallel and let the final report cover each of them in separate sections
B) Choose EV cells as the most common meaning and add a footnote in the report saying other markets were not covered
C) Spawn one subagent to search the web for which interpretation is most popular and then proceed with that one
D) Ask the user which market they mean, along with any time frame or region constraint, before spawning subagents

<details>
<summary>Answer & explanation</summary>

**D)** Resolving a scope ambiguity before fanning out avoids spending a whole multi-agent run on the wrong question, and one question can pin down market, region and timeframe together. Covering all three triples the cost and dilutes the report, guessing with a footnote risks a wasted run, and popularity does not reveal what this user meant.

*Hint if stuck: Ambiguity is cheapest to fix before the expensive work starts.*
</details>

---

## Question 57
A CI job runs cd services/payments && claude -p for payment-related reviews. Believing the root CLAUDE.md would not load from a subdirectory, the team copied all 150 root lines into services/payments/CLAUDE.md. Reviews now show contradictory advice where the two copies have drifted. What should they do?

A) Delete the root CLAUDE.md, since the payments copy is the one CI actually depends on for its reviews
B) Remove the copied root content from the payments file, since ancestor CLAUDE.md files load anyway
C) Launch the CI job from the repo root instead, so only the root CLAUDE.md loads during the reviews
D) Add a header to the payments copy telling Claude to prefer it over any other CLAUDE.md content

<details>
<summary>Answer & explanation</summary>

**B)** Claude Code loads CLAUDE.md files from the working directory and every directory above it, so the root file already loads in the payments job; the copy only adds drift and contradictions. Deleting the root file breaks every other session. Moving the launch directory changes which nested files load rather than fixing duplication, and a prefer-me header leaves both copies in context.

*Hint if stuck: Think about which directories Claude Code reads memory from when started in a subfolder.*
</details>

---

## Question 58
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

## Question 59
A CI agent investigates failing builds and, when it decides a test is flaky, files a ticket for the owning team. Tickets contain the last 4,000 lines of the build log. Owning teams close most tickets as 'cannot reproduce' without acting, and the same flaky tests resurface weekly. Which ticket design would most likely get these acted on?

A) A short paragraph from the agent explaining in plain language why it thinks the test is flaky, replacing the log so the ticket is easy to read
B) The full build log as now, with a severity label added so the owning teams can prioritise the flaky-test tickets that matter most to them
C) The test ID, the failure signature, pass and fail counts across recent reruns, commits since it last passed reliably, a suspected cause, and a link to the logs
D) Only the final 200 lines of the log, since the actual failure is almost always printed near the end of a failing CI run

<details>
<summary>Answer & explanation</summary>

**C)** A handoff to another team should package the evidence they need to act: which test, how it fails, how often across reruns, what changed, a hypothesis, and a pointer to the raw logs. A plain-language paragraph gives no reproducible evidence, a severity label does not make 4,000 lines readable, and trimming the log can drop the rerun history that proves flakiness.

*Hint if stuck: Owners close the tickets because they cannot reproduce; what evidence would change that?*
</details>

---

## Question 60
In a monorepo CI assistant, a run_coverage tool returns raw percentages per package. Reviewers notice the agent keeps flagging packages/legacy-billing for missing the 80% bar even though that package is formally exempt until Q3. The exemption list lives in a YAML file that changes as exemptions are granted and expire, and the agent rarely reads it. How should the team ensure coverage results are interpreted correctly every time?

A) Add a PostToolUse hook on run_coverage that reads the exemption YAML and injects current exemptions via hookSpecificOutput.additionalContext
B) Copy the exemption list into CLAUDE.md so it loads automatically at session start
C) Rename the tool to run_coverage_with_exemptions so the agent knows exemptions exist
D) Add a prompt instruction telling the agent to call a second tool that fetches the current exemption YAML after every single coverage run it performs

<details>
<summary>Answer & explanation</summary>

**A)** hookSpecificOutput.additionalContext lets a PostToolUse hook attach fresh interpretive context at the exact moment the tool result returns, so the model always sees the current exemptions alongside the numbers. CLAUDE.md is the strongest distractor, but it is a static copy that drifts from the changing YAML and can be lost mid-context in long sessions. The prompt-enforced second tool call is probabilistic and is exactly the behavior the agent is already failing to perform, and renaming the tool conveys nothing about which packages are exempt.

*Hint if stuck: Consider which mechanism can attach fresh interpretive context at the exact moment a tool result returns.*
</details>

---

## Answer key (no peeking until scored)

1:C 2:C 3:C 4:A 5:C 6:C 7:B 8:C 9:B 10:B 11:B 12:D 13:B 14:D 15:A 16:B 17:D 18:D 19:A 20:A 21:A 22:B 23:D 24:A 25:B 26:C 27:B 28:D 29:C 30:D 31:B 32:A 33:D 34:D 35:C 36:D 37:D 38:D 39:D 40:D 41:D 42:C 43:A 44:D 45:C 46:B 47:B 48:D 49:C 50:B 51:A 52:A 53:C 54:A 55:C 56:D 57:B 58:B 59:C 60:A
