# Full Practice Exam 01 — CCAR-F simulation

Same format as the real exam guide: **60 questions, 120 minutes, scaled score out of 1000,
pass at 720.** Domain weighting: D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.
No question here appears in the other 2 printable exams.

Set a timer. No notes, no docs. For the interactive version with the clock, flags, and a score report, open the game.

---

## Question 1
Despite a project CLAUDE.md rule saying never delete anything under fixtures/golden, a headless claude -p run in CI executed rm -rf on that directory last Tuesday, breaking 30 snapshot tests. The team needs a guarantee this cannot recur. What should they add?

A) A deny rule in settings.json permissions matching destructive Bash patterns on fixtures/golden
B) A rewritten warning at the very top of CLAUDE.md using stronger and more explicit language
C) A PostToolUse hook that detects deletions under fixtures/golden and pages the on-call engineer
D) A plan-mode requirement so destructive steps in the pipeline wait for human approval first

<details>
<summary>Answer & explanation</summary>

**A)** CLAUDE.md instructions are probabilistic, so no rewording produces a guarantee; settings.json deny rules are deterministic — the harness refuses matching calls outright, including in headless runs. The PostToolUse hook fires after the files are already gone, and pausing a headless CI run for human approval defeats the purpose of running headless.

*Hint if stuck: Ask which mechanism stops the command before it runs instead of asking nicely or reacting afterwards.*
</details>

---

## Question 2
To cut request size, a CI test-generation agent includes the tools array only on the first request of each run; follow-up requests that carry tool results omit it. Runs now fail or stall right after the first tool call. What is the right fix?

A) Describe the available tools in plain text inside the system prompt so follow-up requests stay small without the array
B) Keep sending the same tools array on every request in the loop, including the requests that return tool results
C) Split the run so that every tool call starts a new conversation that includes the tools array on its first request
D) Ask Claude to request every tool call it will need in the first response, so later requests never require tools at all

<details>
<summary>Answer & explanation</summary>

**B)** Each Messages API request is stateless, so the tools array must be sent again on every request of the loop, including those that return tool results; without it the history refers to tools the request does not define. Describing tools in prose does not give Claude callable tools, and starting a new conversation per call discards the history the loop depends on. Asking for every call up front defeats the point of letting each result shape the next step.

*Hint if stuck: Think about what the server has to work with when it validates a request whose history contains tool calls.*
</details>

---

## Question 3
A developer resumes yesterday's Claude Code session on a caching refactor. Since then, only one thing changed: a teammate edited `cache-config.yaml` to lower the default TTL from 300 to 60 seconds. The rest of the session's analysis is still accurate. What is the best way to continue?

A) Start a fresh session and have Claude re-explore the whole caching layer, since any change makes the old session unsafe
B) Resume the session without mentioning the change, since Claude will notice the new TTL value the next time it happens to read that file
C) Resume the session and tell it that `cache-config.yaml` changed, giving the new TTL, so it re-reads that file before editing
D) Resume the session and run /compact first so that the outdated configuration details are summarised away automatically

<details>
<summary>Answer & explanation</summary>

**C)** When the change is small and known, resuming keeps the valid context, and naming the exact file that changed lets the agent re-verify it. A full fresh start throws away accurate work, staying silent leaves the agent reasoning from a stale tool result it may never re-read, and /compact can preserve the stale value inside its summary.

*Hint if stuck: Keep what is still true; point precisely at what is not.*
</details>

---

## Question 4
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

## Question 5
A long-running support session for a business customer was resumed after the company changed its refund policy from 30 to 14 days. Earlier in the session the agent fetched the old policy with a tool call and cited 30 days to the customer. The customer now asks whether a 20-day-old order can be refunded. What should the system do before the agent answers?

A) Nothing extra, since the agent will fetch the policy again automatically whenever the customer asks a policy question
B) Start a brand-new session for the customer, so that the agent can no longer see any of its earlier statements about the refund window
C) Inject a message into the resumed session stating that the refund policy changed to 14 days and the earlier result is outdated
D) Run /compact on the session so that the earlier policy lookup is condensed and no longer appears in the agent's context

<details>
<summary>Answer & explanation</summary>

**C)** The earlier tool result is now stale, and the agent will tend to reuse it rather than re-fetch; telling it precisely what changed keeps the case context while correcting the fact. Assuming a re-fetch is wishful, a brand-new session loses the case history, and compaction can preserve the outdated 30-day figure inside its summary.

*Hint if stuck: An agent trusts what it already read unless told otherwise.*
</details>

---

## Question 6
A content team's prompt says "summarise each meeting in five bullet points", but all three examples show three-bullet summaries because they were written for an older template. The model returns three bullets most of the time. A teammate proposes adding "IMPORTANT: always use five bullets" at the top. What should the architect recommend?

A) Rewrite the examples so they show five-bullet summaries, because the examples are the stronger signal and currently contradict the rule
B) Add the IMPORTANT line and also repeat the five-bullet rule at the end of the prompt, so the model sees the instruction twice
C) Remove the bullet count from the instruction and accept three bullets, since the model has evidently settled on that format
D) Add a post-processing step that asks the model to expand any summary with fewer than five bullets into a five-bullet version

<details>
<summary>Answer & explanation</summary>

**A)** Examples steer format more strongly than instructions, so when they conflict the examples tend to win; making the examples match the rule removes the conflict at its source. Shouting or repeating the instruction keeps fighting the stronger signal, dropping the requirement abandons the goal, and an expansion pass adds a second call and padded bullets to repair a problem the prompt created.

*Hint if stuck: When an instruction and its examples disagree, ask which one the model is copying.*
</details>

---

## Question 7
A telecom support agent runs on a model with a 1M-token context window. To 'never miss anything', the team now loads the full 600-page product and policy manual into every conversation, which fits with plenty of room to spare. Since the change, answers about specific plan terms have become less accurate, not more. What best explains this, and what should the team do?

A) The manual still sits too close to the token limit; move to a larger context tier so the model has more headroom to reason
B) The model needs firmer instructions; add a system-prompt rule that it must read the entire manual before every single answer
C) Recall degrades as the window fills, even below the limit; load only the policy sections a case needs, retrieved on demand
D) The repeated manual confuses the prompt cache; turn caching off so every turn re-reads the manual fresh from the beginning

<details>
<summary>Answer & explanation</summary>

**C)** Anthropic's docs call this context rot: as the token count grows, accuracy and recall degrade, so curating what is in context matters as much as how much fits. Pulling in only the relevant policy sections when a case needs them keeps the context small and high-signal. A bigger window does not help because the drop appears well below the limit. A rule to read everything adds instructions without removing any noise. Caching changes cost and latency, not what the model attends to.

*Hint if stuck: Ask whether fitting inside the context limit is the same thing as being used well.*
</details>

---

## Question 8
A team designing a review pipeline asks whether the reviewer instance should also be allowed to edit and push fixes for what it finds, to save a round trip. The repository has strict change-control requirements. What should the architect recommend?

A) Keep the reviewer read-only and posting findings; any fixes go through a separate change that is itself reviewed
B) Let the reviewer push fixes, but only for findings it rates as high confidence, and leave the rest as review comments
C) Let the reviewer fix issues in the same session and then review its own fixes, so that every change is still reviewed once
D) Let the reviewer push fixes directly, since it already understands the issues and fixing them in the same pass is fastest

<details>
<summary>Answer & explanation</summary>

**A)** A reviewer that also writes and pushes fixes becomes an unreviewed author, which breaks both independence and change control. Anthropic's Code Review is read-only and never approves or pushes for this reason. Self-rated confidence is not a safe gate for unreviewed pushes, and having it review its own fixes reintroduces self-review.

*Hint if stuck: A reviewer that writes code has become an author.*
</details>

---

## Question 9
A developer asks an internal Claude assistant how request timeouts are set in a service. The wiki page, last edited 18 months ago, says 30 seconds; the current config file in the repository says 10 seconds. The assistant answers '30 seconds' because the wiki explains it more clearly. What should the assistant do instead?

A) Answer 30 seconds, since the wiki is the official documentation and should be treated as the source of truth for configuration questions
B) Answer 10 seconds without mentioning the wiki, since the code is what runs and mentioning older documents would only confuse the developer
C) Give both values with their sources and dates, and note that the config file reflects current behavior while the wiki may be out of date
D) Average the two values and recommend 20 seconds as a reasonable default, noting that the sources disagree on the exact number

<details>
<summary>Answer & explanation</summary>

**C)** Attribution and dates let the developer see that the code is current and the wiki is likely stale, and they also reveal the outdated page that needs fixing. Trusting the clearer source ignores which one is current, and dropping the wiki silently hides a discrepancy worth knowing about. Averaging makes up a number neither source supports.

*Hint if stuck: Show where each answer came from and when.*
</details>

---

## Question 10
After a runaway agent burned $400 in API calls overnight, an e-commerce team's incident review proposes capping the order-management agent at 3 loop iterations as the primary termination mechanism. A week later, 30% of legitimate multi-step tasks (check inventory, apply discount, create shipment) fail half-finished. What should the architecture look like?

A) Keep the cap at 3 but prompt the model to plan ahead so every task finishes within three tool calls
B) Let stop_reason end_turn drive termination, investigate why the runaway loop never reached it, and keep a generous iteration cap only as a safety fallback
C) Raise the cap to exactly the longest observed legitimate task length, currently measured at 6 iterations, so real tasks finish while runaway loops are still cut off early
D) Replace the loop with a fixed three-step pipeline so the iteration count becomes fully deterministic

<details>
<summary>Answer & explanation</summary>

**B)** Iteration caps are safety fallbacks against pathological loops, never the primary control; genuine completion is signaled by stop_reason end_turn. Tuning the cap to the longest observed task just moves the failure boundary — any task one step longer still truncates — and neither tuned cap explains or fixes whatever caused the original runaway. A fixed pipeline throws away the adaptive sequencing the order workflows need.

*Hint if stuck: Ask what mechanism should normally end the loop, and what role a hard cap is actually meant to play.*
</details>

---

## Question 11
A developer-tools team keeps build, test and release commands in README.md for humans. Their CLAUDE.md also holds Claude-specific guidance that does not belong in the README, plus a pasted copy of those commands that goes stale every time someone updates the README. What is the best way to keep a single source of truth?

A) Replace CLAUDE.md with a symlink to README.md, so Claude reads exactly the same file humans do
B) Reference the README from CLAUDE.md with an @README.md import so its content loads with the file
C) Add a line to CLAUDE.md asking Claude to read README.md at the start of each session before working
D) Add a CI check that fails when the README and the CLAUDE.md copy differ, and keep both files in sync

<details>
<summary>Answer & explanation</summary>

**B)** An @import pulls the README into context alongside CLAUDE.md, so there is one maintained copy and no drift. A symlink throws away any Claude-specific guidance the CLAUDE.md needs. Asking Claude to read the file is a probabilistic instruction, and a CI diff check keeps duplication alive while adding a chore.

*Hint if stuck: There is a way for CLAUDE.md to pull in another file instead of copying it.*
</details>

---

## Question 12
A nightly job runs claude -p with --output-format json to scan a repo for deprecated API usage and must hand a dashboard importer records shaped like {file, line, severity}. The JSON envelope always parses, but the result field inside is free-form text, and the importer rejects roughly one run in five. What gives the importer a typed guarantee?

A) Add three correctly formatted example records to the prompt and rerun any failures
B) Pin the model version so the formatting stays stable from run to run
C) Chain a second claude -p call that reformats the first run's output into the expected record shape
D) Pass the record schema to the job with --json-schema so the response carries validated records

<details>
<summary>Answer & explanation</summary>

**D)** --output-format json only structures the envelope; adding --json-schema makes the run return output validated against the supplied schema, in the response's structured_output field, which is the typed contract the importer needs. Few-shot examples improve the odds but stay probabilistic, pinning the model leaves the content free-form, and a second reformatting call adds cost with no guarantee.

*Hint if stuck: Separate what makes the wrapper parseable from what constrains the content inside it.*
</details>

---

## Question 13
A batch of 15,000 warranty-claim extractions finishes with 14,700 succeeded and 300 errored. Of the errors, 220 are invalid_request_error because their attachments were sent in a malformed content block, and 80 are server errors. What is the right recovery?

A) Resubmit all 300 errored requests unchanged as a new batch, since one retry usually clears transient batch errors
B) Fix the 220 invalid requests and send them synchronously, and drop the 80 server errors as an acceptable loss
C) Resubmit the whole batch of 15,000 with the fix applied so that every result comes from the same run and prompt
D) Fix the content block for the 220 invalid requests and resubmit them with the 80 server errors in a new batch

<details>
<summary>Answer & explanation</summary>

**D)** invalid_request_error means the body must be fixed before resending, while other errors can usually be retried as-is, and custom_ids let you resubmit only those 300. Resending the invalid ones unchanged fails again, rerunning all 15,000 pays twice for good results, and dropping retryable server errors loses data for no reason.

*Hint if stuck: Not every errored request needs the same treatment.*
</details>

---

## Question 14
On a Linux workstation, a team defines a read-only code-explorer subagent for Claude Code. It must search file names and contents but never run shell commands. The team worries it cannot search at all, because Glob and Grep are not in Claude Code's default tool set on Linux. How should they configure the subagent's tools?

A) List Read and Bash in its tools field, and add a prompt line telling it to run only find and grep commands in the shell
B) List only Read in its tools field, since without Bash the subagent has no way to search and must open files one by one
C) Leave out the tools field so it inherits Bash from the main session and searches with find and grep like the main agent
D) List Read, Grep and Glob in its tools field and leave out Bash, which brings both search tools back for that subagent

<details>
<summary>Answer & explanation</summary>

**D)** On macOS, Linux and WSL, Claude Code leaves Glob and Grep out of the default set and searches with find and grep through Bash. The tools come back when a subagent lists them in its tools field and leaves out Bash, which gives a search-capable explorer with no shell. Granting Bash with a prompt rule leaves the shell open to anything, a Read-only explorer has to open files blindly, and inheriting the main session's tools brings Bash along.

*Hint if stuck: The requirement is about what the subagent can do, not what it is told; check how its own tool list interacts with the default tool set.*
</details>

---

## Question 15
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

## Question 16
A travel-booking agent receives a response with four parallel tool_use blocks: two flight searches and two hotel searches. The calls run on an async worker pool and finish out of order. The developer sends each tool_result back as its own user message the moment it completes, and the API rejects the second request. What is the correct handling?

A) Buffer the results and send four consecutive user messages arranged in the original tool_use order
B) Re-run the workers sequentially so results arrive in exactly the order the model requested them
C) Send all four results together in one user message, each matched to its call by tool_use_id
D) Restrict the agent to one tool_use block per response using tool_choice so ordering never arises

<details>
<summary>Answer & explanation</summary>

**C)** All tool_results answering a parallel batch belong in the single next user message, where each is paired with its call by tool_use_id rather than by position or arrival time. Splitting results across multiple user messages leaves unanswered tool_use blocks at each intermediate step, which the API rejects regardless of ordering, and forcing sequential execution throws away the latency benefit of parallel calls.

*Hint if stuck: Consider what the API expects to see right after an assistant turn that made several calls at once.*
</details>

---

## Question 17
A support agent's refund-cap check is a PreToolUse shell hook defined in the repository's .claude/settings.json, and it worked in every test run. To stop the production Agent SDK service from picking up stray settings files, an engineer set settingSources to an empty list. Since that release, over-cap refunds have gone through and the hook's log is empty. What should the team do?

A) Move the check into a PostToolUse hook in the same settings file, since PostToolUse hooks still load when setting sources are restricted
B) Register the refund check as a PreToolUse callback in the query's hooks option, which runs no matter which settings files load
C) Put the cap in the system prompt as a hard rule, since an SDK service cannot run hooks of any kind once settings files are skipped
D) Set permissionMode to bypassPermissions, so that hooks are evaluated before every tool call no matter which settings were loaded

<details>
<summary>Answer & explanation</summary>

**B)** The SDK runs callback hooks passed in options plus shell hooks from settings files only when the matching settingSources entry is enabled; with an empty list, .claude/settings.json and its hooks are never read. A callback registered in code keeps the deterministic check without reopening the settings files the engineer wanted to ignore. A PostToolUse hook in the same file would not load either and would fire after the refund. The prompt fallback rests on a false premise and is probabilistic, and bypassPermissions loosens approval rather than loading any hooks.

*Hint if stuck: Ask where this check was defined, and what has to happen for the SDK to read that file at all.*
</details>

---

## Question 18
A team wants to make sure Claude Code never runs `npm publish` from developer machines. They wrote a PostToolUse hook on Bash that detects publish commands and alerts the security channel. In the first week, two internal packages were accidentally published to the public registry, and the alerts fired after both. What should they change?

A) Make the PostToolUse hook also run `npm unpublish` right after it detects a publish, so the package is withdrawn within seconds
B) Lower the alert hook's timeout so the security channel hears about publish commands faster than it does today
C) Add `npm publish` to the team's CLAUDE.md as a forbidden command, alongside the existing alert from the hook
D) Use a PreToolUse hook on Bash that denies publish commands with a reason, so the command never runs at all

<details>
<summary>Answer & explanation</summary>

**D)** PostToolUse runs after the tool has executed, so it can only react; blocking an action requires a PreToolUse hook that denies the call before it runs. Auto-unpublishing still exposes the package and may not be allowed by the registry. A CLAUDE.md rule is best-effort, and faster alerts do not prevent anything.

*Hint if stuck: The alerts fired every time, yet the harm still happened. What does that say about timing?*
</details>

---

## Question 19
A research coordinator keeps running new rounds of subagents until it hits a hard limit of eight rounds, because nothing tells it when the research is good enough. Simple questions burn all eight rounds; hard ones are cut off. Which change gives the loop a sensible stopping point?

A) Lower the hard limit to four rounds so that simple questions finish sooner and hard ones are cut off less often
B) Stop as soon as a round returns fewer new sources than the round before it, regardless of what the original brief asked for
C) Have the coordinator check the findings against explicit success criteria after each round and stop when they are met
D) Let each subagent decide on its own whether more research is needed and spawn the next round when it thinks so

<details>
<summary>Answer & explanation</summary>

**C)** Stopping should come from evaluating findings against the brief's success criteria: coverage of the required sub-questions and evidence quality. A different round limit is the same blunt cap tuned differently, and source-count deltas measure activity, not whether the question is answered. Letting each subagent spawn further rounds removes the coordinator's control over scope and cost.

*Hint if stuck: What would 'done' mean for this brief, and who is placed to judge it?*
</details>

---

## Question 20
When a support agent hands a disputed charge to a human specialist, its summary says 'the customer was charged twice on 3 March and never received the replacement'. The specialist later finds the double charge in billing records, but the non-delivery was only the customer's statement; the shipping tool showed a delivered status. What should the handoff summary do?

A) Give the specialist the full conversation transcript instead of a summary, so they can work out for themselves which statements were verified
B) Present the customer's account in full and trust it, since the specialist will check the details again during the investigation anyway
C) Include only facts confirmed by internal systems, leaving out the customer's account so the specialist works from verified data alone
D) Mark each fact as verified by a named system or reported by the customer, and note where the two disagree

<details>
<summary>Answer & explanation</summary>

**D)** Labelling each fact by where it came from, and flagging where the customer and the systems disagree, lets the specialist start from the real dispute. A raw transcript pushes the sorting work onto the specialist, dropping the customer's account hides the disagreement, and treating customer statements as fact repeats the original error.

*Hint if stuck: Who said it matters as much as what was said.*
</details>

---

## Question 21
A support resolution agent escalates hard cases to human specialists. Specialists complain that each escalation arrives as a raw 150-message transcript and they spend twenty minutes reconstructing what happened before they can act. What should each escalation carry instead?

A) A sentiment trajectory chart plus the customer's last five messages
B) A structured summary: customer id, the issue, what was already tried, and a recommended next action
C) The full transcript with a one-line subject added so specialists can skim it faster
D) A live link back into the agent session so the specialist can question the agent directly about the case

<details>
<summary>Answer & explanation</summary>

**B)** Canonical human handoffs carry a structured summary covering the customer id, the issue, what was attempted, and a recommended action, so the specialist can act in minutes without replaying the conversation. The full transcript with a subject line is the strongest distractor, but it preserves the exact problem: the reconstruction burden stays on the human. Sentiment data does not tell the specialist what was tried or what to do next, and a live session link makes the specialist interrogate the agent instead of acting.

*Hint if stuck: Think about what a human needs in order to act in two minutes instead of twenty.*
</details>

---

## Question 22
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

## Question 23
A developer-productivity agent connects to five MCP servers (GitHub, Jira, Confluence, Sentry, and an internal deploy server), exposing 31 tools. It has a code-exploration subagent and a release-notes subagent, both defined without tool restrictions. The exploration subagent now regularly files Jira tickets and triggers preview deploys while 'investigating'. Which change best addresses this?

A) Give the exploration subagent an explicit tool list of Read, Grep, Glob and the GitHub read tools it actually needs
B) Add to the exploration subagent's prompt that it must never call Jira or deploy tools while exploring code
C) Disconnect the Jira and deploy servers from the project so that no agent in the system can call them at all
D) Add a PreToolUse hook that blocks deploy calls from every agent but leaves the Jira tools available to the exploration subagent

<details>
<summary>Answer & explanation</summary>

**A)** Without a tools list the subagent inherits every tool, including all MCP servers, so it both misuses off-role tools and chooses among 31 options. Scoping it to its role's handful of tools fixes both problems. A prompt rule leaves the tools in view, disconnecting servers breaks the release-notes work that needs Jira, and a hook on deploy alone leaves Jira misuse and the oversized selection space untouched.

*Hint if stuck: Fix the misbehaving role without taking capabilities from the roles that legitimately use them.*
</details>

---

## Question 24
A research coordinator was paused overnight. It is resumed in the morning, but the shared pricing dataset that two of its subagents queried was refreshed at 2 a.m.; the other four subagents used static sources. What is the most effective way to continue the run?

A) Resume the coordinator without changes, since data refreshed only a few hours ago is unlikely to change the conclusions much
B) Resume the coordinator, tell it which dataset was refreshed and which subagent results came from it, and re-run only those queries
C) Discard the coordinator session and rerun all six subagents from scratch so that every result reflects the same moment
D) Resume the coordinator and ask it to decide for itself, without guidance, which of the results might now be out of date

<details>
<summary>Answer & explanation</summary>

**B)** When you know exactly what changed, resuming and telling the agent precisely which results are stale keeps the valid work and refreshes only what is affected. Ignoring the refresh leaves stale data in the analysis, rerunning everything wastes four still-valid results, and asking the agent to guess gives it no way to know about a change it never observed.

*Hint if stuck: Be specific about which earlier results can no longer be trusted.*
</details>

---

## Question 25
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

## Question 26
A developer-experience team regenerates reference docs for 3,000 internal modules every Sunday so engineers see fresh docs on Monday morning. The job uses synchronous calls in a loop and takes six hours of runner time. Nothing reads the docs until Monday, and the team has been asked to cut the job's API cost. What is the best change?

A) Run the loop with more parallel synchronous workers so that the six-hour job finishes in under an hour on Sunday
B) Submit the 3,000 generation requests as a Message Batch on Sunday with a custom_id per module and collect results
C) Start the same synchronous loop at 2 AM on Monday instead of Sunday so the runner sits idle over the weekend
D) Move the job to run every night instead of Sundays so that each run covers fewer modules and costs less overall

<details>
<summary>Answer & explanation</summary>

**B)** A weekly job with a Monday deadline is a natural fit for the Message Batches API: half the cost and plenty of slack for its 24-hour window, with custom_id mapping results back to modules. More parallel workers finish faster at full price, moving the start time changes nothing about price and leaves little slack before engineers arrive, and nightly runs add total work rather than lowering unit cost.

*Hint if stuck: When the deadline is a day away, speed is not what you are paying for.*
</details>

---

## Question 27
An extraction subagent processes a 40-page loan application and fails on pages 31 to 40 because they are scanned images it cannot read. It currently returns only 'extraction failed.' What should its failure report to the orchestrator contain?

A) The fields it did extract from pages 1 to 30, which pages failed and why, and suggested alternatives such as OCR
B) Just the failure message, since the orchestrator should simply re-run the whole document from page 1 when it sees it
C) A complete record where the unreadable fields are filled with their most likely values based on similar applications
D) A detailed apology explaining that scanned pages are a known limitation and that the document cannot be processed

<details>
<summary>Answer & explanation</summary>

**A)** A useful failure report carries the failure type, what was tried, the partial results and possible alternatives, so the orchestrator can recover without redoing good work. A bare message forces a full rerun that will fail again, invented values hide the gap, and an apology gives the orchestrator nothing actionable.

*Hint if stuck: What would the orchestrator need to recover without starting over?*
</details>

---

## Question 28
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

## Question 29
An extraction pipeline reads purchase orders. Some orders list two different delivery dates (one in the header, one in the line items) and the pipeline must emit a single delivery_date. The batch runs unattended overnight. How should the extractor handle these documents?

A) Emit the field with both candidate values and a conflict flag so the document routes to human review
B) Take the later of the two dates, since that is the safer commitment for the buyer to plan around
C) Take the header date, since headers are more authoritative, and continue without flagging the document
D) Leave the delivery_date field out of the record entirely so downstream systems treat it as unknown

<details>
<summary>Answer & explanation</summary>

**A)** With no human in the loop, ambiguity should be captured explicitly and routed for review rather than resolved by a silent rule. Picking the header or later date is a guess that downstream systems will trust, and dropping the field loses the evidence a reviewer would need to decide.

*Hint if stuck: When no one can be asked, make the ambiguity visible.*
</details>

---

## Question 30
A platform team wrote a PreToolUse hook to stop Claude Code from editing files under infra/prod/. The script correctly detects the protected path, prints 'Edit blocked: protected production path' to stdout, and exits with code 0. In testing, the edits still go through and the agent never acknowledges any block. What is wrong?

A) PreToolUse hooks cannot block tool calls; the rule must instead be a deny entry in settings.json permissions for that path
B) The hook needs to return hookSpecificOutput.additionalContext containing the block decision
C) The hook must exit with code 2 to block the call, and write the explanation to stderr so it is fed back to the model
D) The hook fires too early to see the file path; the protection must move to a PostToolUse hook

<details>
<summary>Answer & explanation</summary>

**C)** For PreToolUse hooks, a zero exit code allows the tool call to proceed; exit code 2 is what blocks the call, and stderr (not stdout) is the channel fed back to the model explaining why. PreToolUse hooks can block calls, since gating tool calls before they run is exactly what they exist for, so no settings.json deny rule is needed. additionalContext injects information but does not block anything, and PreToolUse receives the full tool input including the file path, so it does not fire too early.

*Hint if stuck: The script found the path correctly; look at how it reported its verdict back to Claude Code.*
</details>

---

## Question 31
A developer asks Claude, in direct execution, to 'tweak' how a helper formats currency. Midway, Claude reports that the helper is called from 14 places, three of which depend on the old rounding, and asks whether to change their behaviour too. What is the best next step?

A) Tell Claude to change all 14 call sites to the new format and fix any test failures it finds
B) Stop and switch to plan mode to decide how the call sites should be handled before editing more
C) Let Claude keep the old rounding in the three special call sites without further discussion
D) Undo the change and leave the helper as it is, because touching it has turned out to be risky

<details>
<summary>Answer & explanation</summary>

**B)** Once a small task turns out to need a cross-cutting decision, it has become plan-mode work: lay out the options for the dependent call sites and agree before making more edits. Pushing ahead with all 14, or quietly special-casing three, makes a behavioural decision without review. Abandoning the change avoids the decision rather than making it.

*Hint if stuck: The task changed shape halfway; should the mode change too?*
</details>

---

## Question 32
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

## Question 33
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

## Question 34
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

## Question 35
A fintech payments team of 12 engineers shares one repository. The tech lead wrote the team's TypeScript strict-mode and ledger error-handling standards into ~/.claude/CLAUDE.md on her laptop. Two new hires consistently generate code that violates these standards, and nobody can figure out why the rules are not being applied. What is the correct fix?

A) Have every engineer copy the standards file into their own ~/.claude/CLAUDE.md
B) Commit the standards to the project-level CLAUDE.md in the repository root
C) Store the standards as environment entries in .claude/settings.json so they apply repo-wide
D) Package the standards as a skill so Claude auto-invokes them whenever someone writes code

<details>
<summary>Answer & explanation</summary>

**B)** User-level ~/.claude/CLAUDE.md is personal memory that lives only on one machine, so teammates never load it. Team standards belong in the version-controlled project CLAUDE.md, which every clone picks up automatically. Copying files per engineer reintroduces drift; settings.json holds permissions, hooks, and env rather than coding guidance; and a skill triggers probabilistically per task, while always-relevant standards must be reliably present in memory.

*Hint if stuck: Ask where those rules physically live, and whether the new hires' sessions can ever read that location.*
</details>

---

## Question 36
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

## Question 37
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

## Question 38
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

## Question 39
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

## Question 40
A fact-check subagent in a research system marks a claim "unsupported" whenever the source words it differently, even when the figures and the meaning match. Synthesis is dropping many correctly sourced claims. What is the best change to the fact-checker's prompt?

A) Tell the fact-checker to give claims the benefit of the doubt and to mark them supported unless the source clearly contradicts them
B) Remove the unsupported label and let the synthesis agent decide on its own which claims to keep
C) Define support: same figures and meaning count even if paraphrased, but a different year, scope or figure does not
D) Ask the fact-checker to require an exact quote match before it marks any claim as supported by a source

<details>
<summary>Answer & explanation</summary>

**C)** An explicit definition of support, with what counts (paraphrase with matching figures) and what does not (different year, scope or figure), fixes the false "unsupported" labels without letting real mismatches through. Benefit of the doubt swings to false negatives, exact-quote matching is the current problem made stricter, and removing the label just moves the undefined judgment elsewhere.

*Hint if stuck: Ask what rule the fact-checker is applying today, and what rule the synthesis step actually needs.*
</details>

---

## Question 41
A claude-code-action review runs on every push to a PR. When a developer pushes a fix commit, the bot re-reviews and reposts the same nine findings as brand-new comments, and developers have started muting it entirely. The team wants re-reviews to surface only new issues or ones still unresolved. What is the best fix?

A) Post-process the bot's output and suppress any comment whose text fuzzy-matches an earlier comment
B) Restrict each re-review to only the files touched by the newest commit
C) Have the action close all of its previous comment threads before posting each fresh review on the pull request
D) Include the prior review's findings in the new run's context so it skips duplicates and checks resolution

<details>
<summary>Answer & explanation</summary>

**D)** The reviewer cannot avoid repeating itself or judge whether an issue was fixed unless it knows what it found last time — feeding prior findings into the re-review fixes that at the source. Fuzzy-match suppression breaks the moment wording shifts and can never confirm a finding was resolved, diff-only re-review silently drops unresolved findings in files the fix commit did not touch, and closing old threads just hides the duplication.

*Hint if stuck: Ask what the bot knows, at the start of each run, about what it said last time.*
</details>

---

## Question 42
A CI job runs Claude Code headlessly to update a dependency. The upgrade guide offers two incompatible migration paths, and the right one depends on a product decision the job cannot see. Nobody is watching the job. How should the job be designed to handle this?

A) Stop on this kind of ambiguity and open the PR or an issue describing both paths and the decision needed
B) Pick the path that changes the fewest files, since a smaller diff is easier for reviewers to approve later on
C) Implement both migration paths on separate branches and let the CI system automatically merge whichever passes tests
D) Keep retrying the migration with different prompts until one of the paths compiles cleanly and then merge it

<details>
<summary>Answer & explanation</summary>

**A)** In an unattended run, a decision the agent cannot make should be surfaced to a human with the options laid out, rather than settled by a proxy. Smallest-diff and passes-tests are heuristics that do not answer the product question, and retrying until something compiles turns a decision into luck.

*Hint if stuck: Ask who is able to make this choice, and how they will learn that it needs making.*
</details>

---

## Question 43
An e-commerce ops team shares a backfill-orders skill that needs a date range and a target environment. Teammates keep invoking it with no arguments, forcing Claude to ask follow-up questions every time. The team wants the expected inputs visible right at invocation. What is the designed mechanism for this?

A) Rename the skill to backfill-orders-dates-env so the required inputs are part of its name
B) Document the usage syntax in the onboarding section of the project CLAUDE.md
C) Add argument-hint to the SKILL.md frontmatter describing the date range and environment
D) Put a usage example at the top of the skill body so it is the first content loaded

<details>
<summary>Answer & explanation</summary>

**C)** argument-hint is the frontmatter field built to surface expected arguments at invocation time. The skill body only loads after the skill is already triggered, so a usage example there arrives too late to shape what the user types. Renaming and CLAUDE.md documentation are workarounds users will not see at the moment of invocation.

*Hint if stuck: Think about what someone sees while typing the command, before any of the skill's content has loaded.*
</details>

---

## Question 44
A research system must screen 25,000 papers for inclusion, then do a deep analysis using the team's own client-side data tools, on the few hundred that qualify, for a report due in a week. The team wants to minimise cost without missing the deadline. Which pipeline fits best?

A) Run the deep tool-assisted analysis on all 25,000 papers as one batch so that screening and analysis happen together
B) Screen with a Message Batch, then run the deep tool-assisted analysis synchronously on the qualifying papers only
C) Skip screening and run the deep analysis synchronously on every paper, since a week is enough time to finish it
D) Screen all 25,000 papers synchronously so that the shortlist is ready quickly, then batch the deep analysis afterwards

<details>
<summary>Answer & explanation</summary>

**B)** Screening is single-turn, high-volume and non-urgent, which is ideal for a batch, while the deep analysis needs tool calls mid-task, which a batch request cannot do when the tools run in the team's own code, so it runs synchronously on the small shortlist. Batching the tool-assisted analysis cannot run the tools, synchronous screening pays double on the largest stage, and analysing every paper in depth wastes most of the budget.

*Hint if stuck: Separate the work that needs tools from the work that does not.*
</details>

---

## Question 45
A research swarm gathering electric-vehicle market data flags a "source conflict": one finding says global EV sales were 10.5M units, another says 17.3M. Investigation shows the first comes from a 2023 report and the second from a 2025 report — and the synthesizer had discarded both figures as unreliable. What fixes this?

A) Add a reconciliation step that averages the numeric claims whenever any two sources disagree by more than 20%, then report the blended figure
B) Rank the sources by domain authority and keep only the figure that comes from the higher-authority publication, discarding the other
C) Tighten the scout prompts so they only collect market figures published within the last 12 months, keeping the dataset current
D) Capture publication dates as temporal metadata on every claim, so figures from different years read as a time series, not contradictions

<details>
<summary>Answer & explanation</summary>

**D)** Figures measured at different times are not contradictions — they are data points about a changing quantity, and carrying temporal metadata through synthesis prevents false-conflict detection while preserving trend information. Averaging fabricates a number no source ever reported, authority ranking discards a valid historical data point, and restricting collection to recent sources throws away exactly the history trend analysis needs.

*Hint if stuck: Before calling two figures a conflict, ask whether they describe the same moment.*
</details>

---

## Question 46
An invoice extraction pipeline adds a reviewer instance that re-extracts totals independently. When the two instances disagree, the current code simply keeps the second instance's value. Error rates did not improve. What should happen on a disagreement?

A) Always keep the first instance's value, because the original extraction had the most complete view of the document
B) Treat it as a signal: route the field to a human or targeted re-check with both values and the source span
C) Run a third instance and silently keep whichever value two of the three instances agree on, without any further check
D) Average the two numeric values so that small discrepancies between the instances cancel each other out over time

<details>
<summary>Answer & explanation</summary>

**B)** The point of independent passes is to surface disagreements that mark risky fields, so a disagreement should trigger review rather than an arbitrary pick. Preferring either instance discards that signal, averaging produces a number that matches neither document reading, and a silent majority vote can still be wrong on the same hard field without anyone looking.

*Hint if stuck: Two readings that differ are telling you something.*
</details>

---

## Question 47
A pipeline downloads the full results of a 100,000-request extraction batch into memory before parsing, and the worker crashes with out-of-memory errors on the largest batches. The same results must be written to a database keyed by custom_id. What is the recommended approach?

A) Increase the worker's memory allocation so the full results file can be loaded and parsed in a single pass
B) Ask the model to return shorter outputs so that the results file is small enough to load into memory
C) Iterate over the results as a stream, handling each result by its custom_id and type as it is read
D) Cancel any batch larger than 20,000 requests and resubmit it as smaller batches before retrieving results

<details>
<summary>Answer & explanation</summary>

**C)** The docs recommend streaming batch results rather than downloading them all at once; handling each line by custom_id and result type keeps memory flat at any size. More memory postpones the problem, shorter outputs trade away extraction quality, and cancelling large batches discards work that is already done.

*Hint if stuck: Results come one per line, so they do not need to be held all at once.*
</details>

---

## Question 48
A CI reviewer's "possible performance regression" category is 75 percent false positives, but it caught one serious N+1 query bug last quarter, so a product manager objects to turning it off. What approach best balances precision and that occasional catch?

A) Keep posting the category but add a disclaimer to every performance comment saying it may be a false positive
B) Keep the category in PR comments and ask developers to report each false positive so that the model can learn from their feedback
C) Merge the performance category into the general comments so its findings carry less weight with developers
D) Stop posting the category to PRs, log its findings privately, and rewrite its criteria from those logs before re-enabling it

<details>
<summary>Answer & explanation</summary>

**D)** Pausing a noisy category on PRs protects trust in the rest of the reviewer, while logging its output privately keeps any real catches visible and gives data for writing better criteria before it returns. Disclaimers and blending into general comments leave the noise in front of developers, and the model does not learn from reported false positives without a prompt change.

*Hint if stuck: You can stop showing a noisy category without stopping work on it.*
</details>

---

## Question 49
A synthesis step deduplicates findings that state the same fact. When two scouts reported 'the plant closed in May 2026', one citing a regulator filing and one a trade-press article, the merged claim kept only the trade-press source. That article was later corrected, and reviewers now cannot tell whether the claim still stands. How should merging work?

A) Keep only the most authoritative source on the merged claim and drop the rest to keep records simple
B) Skip deduplication and publish both claims separately, so readers see that two sources said the same thing
C) Merge the matching claims into one record that keeps every supporting source with its id and date
D) Keep the first source that arrived, but add a note to the claim saying it was also reported elsewhere

<details>
<summary>Answer & explanation</summary>

**C)** Claim-source mappings have to survive every synthesis step, including deduplication: a merged claim should carry all its supporting sources with dates, so it can be re-checked when one source changes and corroboration can be judged. Keeping only the 'best' source is a judgment call that still throws away the trail. Publishing duplicates clutters the report and still does not link the two sources to one claim. A note saying 'reported elsewhere' gives reviewers nothing they can check.

*Hint if stuck: Ask what a reviewer needs to re-check a claim after one of its sources changes.*
</details>

---

## Question 50
A billing-support service runs Claude through the Agent SDK with nobody watching a terminal. Goodwill credits above $150 need sign-off from a team lead, which can take hours. The team wants Claude to stop at the issue_credit call, show the request in the service's own approvals queue, and carry on from that exact call once the lead decides. Which mechanism fits?

A) A PreToolUse hook that returns permissionDecision "defer" for large credits, then resuming the session once the lead has decided
B) A PreToolUse hook that returns "ask" for large credits, so that the approval prompt is shown to the lead in the terminal running the service
C) A PreToolUse hook that sleeps and polls the approvals queue until the lead answers, holding the tool call open for as long as it takes
D) A system-prompt rule telling Claude to end its turn and wait for the lead whenever a credit above $150 comes up in a conversation

<details>
<summary>Answer & explanation</summary>

**A)** Returning defer ends the turn with stop_reason tool_deferred and leaves the pending call in the transcript; the app reads deferred_tool_use, shows it in its own queue, and resumes the session, when the hook fires again and returns allow or deny. (It applies when Claude makes a single tool call in that turn.) ask needs someone to answer an in-process permission prompt, which a headless service lacks. A hook that blocks for hours ties up the run, and a prompt rule cannot hold a tool call open.

*Hint if stuck: No one is around to respond to a prompt inside this process; think about stopping cleanly and coming back later to the same pending call.*
</details>

---

## Question 51
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

## Question 52
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

## Question 53
A team migrating from another editor copied its rule files into .claude/rules/ unchanged. Each file starts with frontmatter like globs: "src/api/**/*.ts". The API conventions now appear in every session, even sessions spent entirely on the mobile app. What is the cause?

A) Rules in subdirectories of .claude/rules/ are always loaded, so the files must sit directly in .claude/rules/
B) Rule frontmatter must be JSON rather than YAML, so the whole header is being skipped by Claude Code
C) The glob needs a leading ./ to be resolved relative to the project root, so it currently matches every file
D) Claude Code only reads a paths field in rule frontmatter, so globs is ignored and the rule loads unconditionally

<details>
<summary>Answer & explanation</summary>

**D)** paths is the only frontmatter field Claude Code reads from a rule; other fields are silently ignored, and a rule without paths loads at launch for every session. Renaming globs to paths scopes it again. The YAML format and the src/api/** pattern are fine as written, and rules in subdirectories of .claude/rules/ are discovered recursively without losing their scoping.

*Hint if stuck: A misspelled or foreign frontmatter key does not raise an error; what happens to the rule then?*
</details>

---

## Question 54
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

## Question 55
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

## Question 56
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

## Question 57
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

## Question 58
A research coordinator keeps a running list of findings only in its conversation history. During a long run its context is compacted, and the final report omits two key findings from early subagents that the summary dropped. What design keeps findings safe from compaction?

A) Have the coordinator re-request all early subagent results just before writing the report, so they are back in context at the right time
B) Have the coordinator append each finding to an external findings store as it arrives and build the report from that store
C) Instruct the coordinator to mark important findings with a special tag so the summarizer is more likely to keep them during compaction
D) Turn off compaction for the coordinator so that its conversation history always keeps every finding exactly as each subagent first returned it

<details>
<summary>Answer & explanation</summary>

**B)** Writing each finding to an external store makes it durable, so the report no longer depends on what a summary happened to keep. Disabling compaction only delays the problem until the window runs out, and tagging makes it more likely but not certain a finding survives. Re-requesting results reruns paid work and still relies on the coordinator remembering what to ask for.

*Hint if stuck: Durable state should not live only in a window that gets summarized.*
</details>

---

## Question 59
An engineer asks Claude to write a script that pulls request IDs, latency and status codes out of a legacy service's logs. The log format has three variants (with and without a tenant prefix, and a multi-line stack trace form). Two rounds of prose explanation have produced parsers that handle one variant and break the others. What should the engineer do next?

A) Describe the three variants again in more detail, this time listing each field's position and delimiter in words
B) Paste a few real log lines of each variant with the exact fields expected from each, and ask Claude to test against them
C) Ask Claude to write a parser flexible enough to accept any line and drop whatever it fails to understand
D) Switch to plan mode and ask Claude to design a general log-parsing framework before handling these variants

<details>
<summary>Answer & explanation</summary>

**B)** Concrete input/output examples remove the ambiguity that two rounds of prose have not fixed, and they double as checks Claude can run. A third prose description repeats what already failed, a parser that drops unparseable lines hides the bug rather than fixing it, and a general framework is over-building for a known set of three formats.

*Hint if stuck: When describing a format keeps failing, show it instead.*
</details>

---

## Question 60
A nightly reporting agent gathers metrics through several tools, and its final request is supposed to produce a prose executive summary. In 12% of runs the model issues yet another tool call on that final request instead of writing the summary. What is the cleanest fix?

A) Add a prompt line to the final request: "You have all the data you need; do not call any more tools"
B) Cap the agentic loop at ten iterations so a runaway tool call cannot extend the nightly run
C) Set tool_choice to "none" on the final summarization request so the model must respond with text
D) Set tool_choice to "any" on the final request so the model finishes its remaining tool work faster

<details>
<summary>Answer & explanation</summary>

**C)** tool_choice "none" is the deterministic mechanism for a turn where a tool call must not happen: the model can only respond with text, which is exactly what the summary step requires. The prompt instruction is probabilistic and is essentially the behavior already failing 12% of the time. Iteration caps are safety fallbacks rather than primary control, and "any" mandates the exact behavior being prevented.

*Hint if stuck: Prefer a setting that makes the unwanted call impossible over wording that asks the model to skip it.*
</details>

---

## Answer key (no peeking until scored)

1:A 2:B 3:C 4:C 5:C 6:A 7:C 8:A 9:C 10:B 11:B 12:D 13:D 14:D 15:A 16:C 17:B 18:D 19:C 20:D 21:B 22:D 23:A 24:B 25:B 26:B 27:A 28:A 29:A 30:C 31:B 32:B 33:D 34:D 35:B 36:B 37:C 38:B 39:A 40:C 41:D 42:A 43:C 44:B 45:D 46:B 47:C 48:D 49:C 50:A 51:D 52:C 53:D 54:A 55:C 56:D 57:A 58:B 59:B 60:C
