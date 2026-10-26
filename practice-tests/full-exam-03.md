# Full Practice Exam 03 — CCAR-F simulation

Same format as the real exam guide: **60 questions, 120 minutes, scaled score out of 1000,
pass at 720.** Domain weighting: D1 27% · D2 18% · D3 20% · D4 20% · D5 15%.
No question here appears in the other 2 printable exams.

Set a timer. No notes, no docs. For the interactive version with the clock, flags, and a score report, open the game.

---

## Question 1
A research system routes every question through the same pipeline: planner, six search subagents, two analysis subagents, a synthesizer and a citation checker. Users asking simple lookups like 'When did the EU AI Act enter into force?' wait several minutes and the bill is high. What should the architect change?

A) Cap each search subagent at two tool calls so the six-way fan-out finishes faster no matter how hard the question is
B) Cache the pipeline's final answers by exact question text so that repeated simple lookups can skip the subagent fan-out entirely
C) Run all of the pipeline's subagents on the smallest available model so the full pipeline costs less for every query
D) Have the coordinator assess each query's complexity and spawn only the subagents it needs, down to none for a simple lookup

<details>
<summary>Answer & explanation</summary>

**D)** Effort should scale with the query: a simple fact needs one agent and a few tool calls, while a broad comparison justifies many subagents. Letting the coordinator choose subagents per query removes the waste at its source. An exact-match cache helps only repeated wording, a smaller model weakens hard queries while the pipeline stays oversized, and a tool-call cap starves complex questions while easy ones still pay for the fan-out.

*Hint if stuck: Should a one-line fact and a 20-source comparison really trigger the same machinery?*
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
An internal IT agent onboards new hires by creating accounts in four systems in sequence: directory, email, payroll, then badge access. When payroll's API times out, the agent retries from the start on the next run and creates duplicate directory and email accounts; when it eventually escalates, IT staff cannot tell which systems are done. What should the workflow do?

A) Have the agent re-check all four systems from scratch at the start of each run and work out for itself which accounts already exist and which are missing
B) Wrap the four steps in a single long tool call so that either all four accounts are created together or none of them are created
C) Persist each step's completion in workflow state, resume from the first incomplete step, and include done and pending steps in any escalation
D) Add a system-prompt rule telling the agent never to repeat a step it has already completed earlier for the same new hire

<details>
<summary>Answer & explanation</summary>

**C)** A multi-step workflow needs durable, code-held state for each step so it can resume where it stopped and so a human handoff can say exactly what is done and what is not. Having the model re-check all systems each run is slower and depends on its inference. A single all-or-nothing call is rarely possible across four independent systems, and a prompt rule cannot stop duplicates the model does not know about.

*Hint if stuck: After a timeout, ask what the system itself can tell you about how far the onboarding got.*
</details>

---

## Question 4
A platform team wrote .claude/skills/legacy-billing-context/SKILL.md explaining how a 2012 billing system stores currency and retries charges. Claude should pull it in whenever someone works near billing code, but developers keep typing /legacy-billing-context expecting it to do something, and are confused when it only prints background. Which frontmatter setting fits?

A) argument-hint with a short note, which tells developers in the menu that the skill takes no arguments
B) user-invocable: false, which hides it from the slash menu while Claude can still load it when relevant
C) disable-model-invocation: true, which keeps it in the slash menu but stops Claude from loading it alone
D) context: fork, which runs the skill in a subagent so its background text stays out of the main session

<details>
<summary>Answer & explanation</summary>

**B)** user-invocable: false hides a skill from the / menu and stops it running when someone types its name, while Claude can still invoke it; the skills docs describe exactly this use for background knowledge that is not a meaningful action for users. disable-model-invocation does the opposite, leaving only manual invocation, so Claude would stop using it near billing code. context: fork changes where the skill runs, not who can start it, and argument-hint only labels expected arguments.

*Hint if stuck: Decide who should be able to start this skill: the people typing commands, the model, or both.*
</details>

---

## Question 5
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

## Question 6
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

## Question 7
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

## Question 8
A team creates a new service repository and wants to give Claude Code useful project memory quickly. Nobody has written a CLAUDE.md yet, and the tech lead plans to write one from scratch later this quarter. What is the most effective first step?

A) Run /init to generate a starter CLAUDE.md from the codebase, then review and trim it with the team
B) Copy another team's CLAUDE.md from a different service so there is at least some guidance to start
C) Leave memory empty and have each session start by asking Claude to explore and summarize the build
D) Paste the full contents of the architecture wiki into CLAUDE.md so Claude has every possible detail

<details>
<summary>Answer & explanation</summary>

**A)** The /init command analyses the codebase and produces a starter CLAUDE.md with build commands and structure, which the team can then refine. Another service's file carries conventions that may not apply here. Re-exploring in every session repeats the same discovery work and is never captured for the team, and dumping a whole wiki creates a bloated file that lowers adherence.

*Hint if stuck: Ask what gets a reasonable first draft quickly without borrowing another codebase's assumptions.*
</details>

---

## Question 9
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

## Question 10
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

## Question 11
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

## Question 12
A developer asks Claude Code to "make the search endpoint faster." Claude adds caching, the developer says it is still slow, Claude tweaks a query, and the developer says it is better but not enough. Neither side knows when to stop. What would have made this iteration converge?

A) Asking Claude to optimize every endpoint in the service at once, so the improvements add up across calls
B) Telling Claude to keep trying different optimizations until the developer stops asking for more changes
C) Asking Claude to write a detailed explanation of each optimization so the developer can decide which one to keep
D) Giving a concrete target, such as p95 under 200 ms on a named benchmark script, and asking Claude to run it after each change

<details>
<summary>Answer & explanation</summary>

**D)** A measurable target with a runnable benchmark gives Claude a check to iterate against and a clear finish line, so the loop closes without the developer judging each attempt. Open-ended "keep trying" leaves the human as the only signal, explanations do not measure anything, and widening scope to every endpoint makes the work harder to verify.

*Hint if stuck: Define done in a form Claude can measure itself.*
</details>

---

## Question 13
An insurance claims pipeline extracts 20 fields per claim but returns a single document-level confidence. Any claim below 0.8 goes to a reviewer, who then re-checks all 20 fields by hand, and review costs are rising. Which change makes human review more efficient without losing accuracy?

A) Lower the document-level threshold to 0.7 so that fewer claims are sent to reviewers, while keeping the full 20-field check for each one
B) Have the model write a summary of each claim so that reviewers can skim it instead of checking the individual extracted fields
C) Produce calibrated confidence for each field and have reviewers check only the fields flagged as low confidence
D) Split the 20 fields across two reviewers who each check ten, so that every flagged claim moves through the review queue twice as fast

<details>
<summary>Answer & explanation</summary>

**C)** Calibrated field-level confidence points reviewers at the fields that are actually uncertain instead of the whole document. Lowering the document threshold just reviews fewer claims and lets more errors through, without making each review more efficient. Splitting fields across reviewers keeps the full workload, and a skimmable summary hides the field errors reviewers are there to catch.

*Hint if stuck: Make the confidence signal as fine-grained as the review work.*
</details>

---

## Question 14
In a multi-agent research system, the synthesis agent writes findings that a downstream script parses to build a bibliography. Some runs cite sources as numbered brackets, others as author-year, and some put the URL inline, which breaks the parser. The prompt describes the citation format in one sentence. What is the most reliable fix at the prompt level?

A) Add a second sentence to the citation description that lists every format the model should avoid, including author-year and inline URLs
B) Add a few short example findings that show claims paired with sources in the exact citation format the parser expects, wrapped in example tags
C) Let the parser accept all three citation styles with separate regular expressions, since normalising the model output is out of the team's control
D) Ask the subagents to return their sources in the same citation style, since the synthesis agent tends to copy whatever style it receives

<details>
<summary>Answer & explanation</summary>

**B)** Showing a few finished findings in the exact format is the strongest prompt lever for format consistency, and wrapping them in example tags keeps them distinct from instructions. Listing formats to avoid is still a prose description, widening the parser chases each new variant instead of stabilising the output, and changing the subagents shifts the problem upstream without guaranteeing the synthesis agent's own format.

*Hint if stuck: Formatting rules stick best when the model can see a finished instance.*
</details>

---

## Question 15
A support agent routes each ticket by calling a route_ticket tool, with tool_choice set to force that tool. Escalation staff want a sentence explaining each routing choice, so the prompt now says: before calling the tool, briefly explain your reasoning. Responses still contain only the tool_use block. The model in use supports every tool_choice mode. What is the best fix?

A) Raise max_tokens so the model has enough room to write an explanation before the forced call
B) Set tool_choice to any instead, which still forces a tool call but lets the model write text first
C) Move the explain-first instruction into the system prompt, where it outweighs the user message
D) Switch tool_choice to auto and ask in the user message for a reason, then a route_ticket call

<details>
<summary>Answer & explanation</summary>

**D)** With tool_choice any or tool, the API prefills the assistant turn to force a tool call, so the model emits no natural-language text before the tool_use block even when asked. The documented route for getting text as well is auto plus an explicit instruction in the user message to use the tool; a short explanation field in the tool's schema is another option (ask for a brief explanation, not step-by-step reasoning). any prefills the same way as a forced tool, and neither moving the instruction nor raising max_tokens gets past the prefill. On the newest models any and forced return a 400, which is a further reason to know the auto route.

*Hint if stuck: Consider what the API does to the start of the assistant's turn when a tool call is required.*
</details>

---

## Question 16
An invoice-extraction pipeline outputs a confidence score for every field, and the team wants to auto-accept fields scoring 0.90 or higher without human review. Before setting that threshold, the architect wants evidence that the scores mean what they say. What check gives that evidence?

A) Check that the average confidence across all fields is close to the dashboard's overall accuracy figure
B) On a labelled set, bucket each field's scores and compare each bucket's observed accuracy with its score
C) Ask the model to explain each high-confidence field and accept the threshold if the reasons read as sound
D) Track the share of fields scoring 0.90 or higher each week and treat a stable share as proof of calibration

<details>
<summary>Answer & explanation</summary>

**B)** Calibration means stated confidence matches observed accuracy, so it has to be measured against labelled ground truth, per field and per confidence band: fields scored 0.9 and above should actually be right at least that often before auto-accepting them. Matching averages can hide bands or fields that are badly over-confident. Plausible-sounding explanations do not measure correctness. A stable share of high scores says nothing about whether those fields are right.

*Hint if stuck: Calibration is a claim about how often something is right; ask what you need in order to count that.*
</details>

---

## Question 17
A CI review bot posts about 25 inline comments per PR, and engineers have started ignoring all of them because roughly half are false positives. Recall on real bugs is good. The team lead wants fewer comments without losing the real bugs. Which design change best fits?

A) Add a prompt line telling the reviewer to report only issues it is completely certain about and skip anything speculative
B) Cap the bot at five comments per PR, keeping whichever findings the reviewer happens to list first in its output
C) Add a verification pass in which a separate instance checks each candidate finding against the code and drops unconfirmed ones
D) Switch the bot to only review files over 200 changed lines, since that is where most of the real bugs have been found

<details>
<summary>Answer & explanation</summary>

**C)** A find-then-verify pipeline keeps the recall of the first pass and uses an independent check to filter false positives before anything is posted, which is how Anthropic's own Code Review is built. A certainty instruction relies on the model's self-assessment and tends to cut real bugs too, while a hard comment cap or a file-size filter drops findings by position or size rather than by validity.

*Hint if stuck: Ask whether the step that proposes an issue should also be the one that confirms it.*
</details>

---

## Question 18
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

## Question 19
A returns-processing support agent calls a lookup_order tool, and the order service occasionally times out. When that happens the team's loop code raises an exception, logs it, and ends the conversation with a generic apology, even though the customer's request could often be completed another way. What should the loop do instead?

A) Return a tool_result for that call with is_error set and a short description of the timeout, then call the API again
B) Wrap the tool in an automatic retry with exponential backoff and only end the conversation after five consecutive timeouts
C) Catch the exception and substitute an empty order object so the conversation can continue without interruption
D) Detect the timeout and immediately route the customer to a human agent with the full transcript attached for context

<details>
<summary>Answer & explanation</summary>

**A)** Tool failures belong in the history like any other result: a tool_result flagged with is_error lets Claude reason about the failure and pick another path, such as asking for an order number or trying a different lookup. Silent backoff in code hides the problem from the model and still ends in the same apology, and an empty order object feeds the model false data. Escalating every timeout to a human throws away cases the agent could have finished itself.

*Hint if stuck: Think about who should decide what to do after a tool fails, and what they need to see to decide.*
</details>

---

## Question 20
A multi-agent research system keeps its subagent prompt templates in prompts/**/*.md, and the team has strict conventions for them (XML-tagged sections, a fixed citation block, no model names). Those 90 lines currently sit in the root CLAUDE.md, so they also load when engineers work on the Python orchestration code. What is the better arrangement?

A) Move them into a skill named prompt-conventions that loads whenever someone mentions a prompt
B) Move them into a path-scoped rule with paths: prompts/**/*.md so they load with the templates
C) Keep them in CLAUDE.md but shorten them to ten lines so the always-on cost is easier to accept
D) Move them into the ~/.claude/CLAUDE.md of the engineers who usually edit the prompt templates

<details>
<summary>Answer & explanation</summary>

**B)** Conventions tied to a set of files are what path-scoped rules are for: they load when Claude works with matching templates and stay out of orchestration work. A skill depends on Claude deciding the conventions are relevant, which is weaker than matching on file paths. Shortening them loses detail, and personal CLAUDE.md files leave out anyone else who edits a template, so the team conventions stop being shared.

*Hint if stuck: Which mechanism loads guidance based on which files Claude is working with?*
</details>

---

## Question 21
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

## Question 22
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

## Question 23
A research-tooling team has a license-audit skill that shells out to dependency scanners, producing about 40,000 tokens of raw output per run. After each audit, the main session starts forgetting requirements the user stated earlier. Only a short verdict from the audit actually matters. What is the right design change?

A) Instruct the skill body to request quieter output modes from the scanner commands
B) Run /compact immediately after every audit to summarize the bloated transcript
C) Move the audit instructions into the project CLAUDE.md so they are preloaded in every session
D) Set context: fork in the skill frontmatter so the audit runs isolated and returns its summary

<details>
<summary>Answer & explanation</summary>

**D)** context: fork executes the skill in an isolated context, so the 40,000 tokens of scanner noise never enter the main session — only the result comes back. Quieter output flags reduce but do not eliminate the pollution and depend on scanner cooperation. /compact is damage control applied after the context has already degraded, and CLAUDE.md placement changes loading, not execution isolation.

*Hint if stuck: Think about where the skill's verbose work should happen relative to the main conversation.*
</details>

---

## Question 24
A developer-productivity team wants a weekly report of stale TODO comments posted as an issue in their repo every Monday, with no one needing to ask for it. They have claude-code-action installed, and today it only responds when someone comments @claude. What should they configure?

A) A CLAUDE.md line telling Claude to post a TODO report whenever it runs on a Monday in this repository
B) A Monday reminder for one engineer to open an issue and comment @claude asking for the TODO report
C) A trigger_phrase change to TODO so that any TODO comment in the code starts a Claude run automatically
D) A workflow on a cron schedule that gives the action its task directly, so it runs in automation mode

<details>
<summary>Answer & explanation</summary>

**D)** When the workflow supplies the task itself, the action runs in automation mode on any event, including a schedule, without waiting for a mention. A calendar reminder keeps a human in the loop for a mechanical task. The trigger phrase applies to comments, not code contents, and CLAUDE.md cannot start a run that nothing triggers.

*Hint if stuck: Interactive mode waits for a mention; something else runs on events.*
</details>

---

## Question 25
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

## Question 26
A security-review coordinator audits a payments service by spawning three subagents: SQL injection in /api/orders, XSS in /web/templates, and hardcoded secrets in /config. Two weeks after release, an SSRF vulnerability is exploited in /api/webhooks — a directory no subagent was ever assigned. What was the architectural failure?

A) Coverage gap: the full scope should be partitioned so every directory and flaw class has an owner
B) The subagents ran on Haiku, which is too weak to detect SSRF; the scouts should run on Opus
C) The SSRF-focused subagent failed silently; add retry logic so transient subagent failures are re-run
D) Each subagent prompt should have ended with 'also flag anything else suspicious you happen to notice'

<details>
<summary>Answer & explanation</summary>

**A)** Overly narrow decomposition is a known multi-agent pitfall: anything outside the assigned slices is simply never examined. The fix is to partition the entire scope — directories and vulnerability classes — so the union of subagent assignments covers everything. No SSRF agent existed to retry, and a vague 'anything else' suffix is a probabilistic patch that never guarantees /api/webhooks gets read.

*Hint if stuck: Look at which parts of the system, and which kinds of flaw, anyone was ever asked to examine.*
</details>

---

## Question 27
A research coordinator receives the request 'Compare the leading battery suppliers.' It is unclear whether the user means EV cells, grid storage or consumer electronics, and each would send subagents to very different sources. The system runs interactively. What is the best first step?

A) Run subagents for all three markets in parallel and let the final report cover each of them in separate sections
B) Choose EV cells as the most common meaning and add a footnote in the report saying other markets were not covered
C) Spawn one subagent to search the web for which interpretation is most popular and then proceed with that one
D) Ask the user which market they mean, along with any time frame or region constraint, before spawning subagents

<details>
<summary>Answer & explanation</summary>

**D)** Resolving a scope ambiguity before fanning out avoids spending a whole multi-agent run on the wrong question, and one question can pin down market, region and timeframe together. Covering all three triples the cost and dilutes the report, guessing with a footnote risks a wasted run, and popularity does not reveal what this user meant.

*Hint if stuck: Compare the cost of one question with the cost of a full research run on the wrong topic.*
</details>

---

## Question 28
Claims reviewers can check 400 of the 3,000 extractions the pipeline produces each day, and today they take them in arrival order. Each extraction carries calibrated field confidence and the results of consistency checks, such as line items that do not sum to the total or a loss date before the policy start. How should the review queue be built?

A) Keep arrival order so every document has the same chance of review, and add reviewers when budget allows
B) Send reviewers only the highest-value claims, since dollar amount is the clearest sign of where errors matter
C) Spread the 400 reviews evenly across document types so each type gets the same number of checks per day
D) Put items with failed consistency checks or low calibrated confidence first, ordered by the payout at stake

<details>
<summary>Answer & explanation</summary>

**D)** Scarce review time should go where errors are most likely and most costly: internal contradictions and low calibrated confidence are the strongest error signals, and the amount at stake breaks ties, the same idea as routing by risk level. Arrival order spends most reviews on items that are probably fine. Value alone sends clean high-value claims to humans while contradictory low-value ones pass. Even spreading across types is a measurement design; a small stratified random sample should run alongside to estimate error rates, but it is not how to triage which risky items get checked.

*Hint if stuck: Ask which signals say an item is likely wrong, and which say it matters if it is.*
</details>

---

## Question 29
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

## Question 30
Before refactoring how feature flags are read, a developer wants to know every place flags are evaluated in a 2,000-file repository. Her previous attempt ran the search in the main session and left thousands of lines of grep output in context, crowding out the plan she was building. What is the best approach this time?

A) Run the search in the main session but ask Claude to forget the results once it has finished
B) Skip the search entirely and let Claude discover usages one at a time as it goes on to edit each file
C) Use the Explore subagent for the search and keep only its summarised list in the main session
D) Start in plan mode, because plan mode stops search output from being added to the context

<details>
<summary>Answer & explanation</summary>

**C)** The Explore subagent is built for read-only discovery in its own context, returning a condensed result so the main session keeps room for planning. Claude cannot be told to forget output already in its context, and plan mode changes what Claude may edit, not where search output goes. Skipping discovery risks missing usages in a refactor that needs all of them.

*Hint if stuck: Keep the noisy part of the work out of the context you want to keep.*
</details>

---

## Question 31
A long-running billing-dispute agent must hand the case to a second agent after a shift change. The proposed design passes the full 120-turn transcript as the second agent's context. The architect worries the new agent will miss the agreed credit amount. What is the better handoff?

A) Pass the transcript but highlight the turn where the credit amount was agreed, so the second agent can find it quickly
B) Pass the last 20 turns of the transcript only, since recent turns contain the most relevant state of the dispute
C) Pass a free-text summary written by the first agent of how the conversation went and what the customer wants
D) Pass a structured case record with customer id, disputed items, amounts agreed, commitments made and open questions

<details>
<summary>Answer & explanation</summary>

**D)** A structured record keeps exact amounts and commitments intact and puts them up front, which a long transcript or a narrative summary does not guarantee. Highlighting one turn still buries it in 120 turns, and trimming to the last 20 turns can drop the very agreement that matters.

*Hint if stuck: What does the receiving agent actually need to act correctly?*
</details>

---

## Question 32
A support agent tags each ticket with a `reason` enum: billing, shipping, product_defect, account_access. When a message is too vague to tell ("it still doesn't work"), the agent picks whichever reason seems closest, and these tickets are misrouted. The team wants such tickets to go to a clarifying-question flow instead. What schema change fits best?

A) Add an "unclear" value to the enum and route tickets carrying it to the clarifying-question flow
B) Make the `reason` field optional so the agent can leave it out when it cannot tell which one applies
C) Add an "other" value with a free-text detail field so the agent can describe the ticket in its own words
D) Ask the agent in the prompt to choose the closest reason only when it is reasonably sure of the match

<details>
<summary>Answer & explanation</summary>

**A)** An explicit "unclear" value gives the model an honest choice for ambiguous messages and gives the router a clear signal to ask a clarifying question. "Other" with detail is for cases that are clear but outside the listed categories, not for messages too vague to classify. An omitted field is harder to route on than an explicit value, and a prompt caveat still forces a guess.

*Hint if stuck: Distinguish "doesn't fit the list" from "can't tell yet".*
</details>

---

## Question 33
A team uses Claude Code to generate database migration files. Their convention is a timestamped filename, an up and down function, and a comment linking the ticket. Generated migrations follow the convention about half the time, often omitting the down function. The team wants a prompt-level fix before adding any tooling. What is most likely to make the output consistent?

A) Paste the internal wiki page that describes the migration convention into the prompt so the model has the full written policy
B) Include two complete existing migrations, one simple and one with a data backfill, as examples of exactly what a finished file looks like
C) Ask the model to list the convention's rules before writing each migration, then check its own output against that list
D) Tell Claude Code to read the entire migrations directory on each request so it can infer the convention from hundreds of files for reference

<details>
<summary>Answer & explanation</summary>

**B)** A couple of complete, varied migrations show the filename, both functions and the ticket comment together, which is the most reliable way to make output consistent. The wiki is more prose of the kind already failing, reading hundreds of files floods context with noise and inconsistent legacy files, and restating rules then self-checking in the same pass shares the same blind spot.

*Hint if stuck: A small number of complete, well-chosen files says more than a long policy.*
</details>

---

## Question 34
A team asks why their Claude Code CI review over a 6-file PR should be split into per-file passes plus an integration pass when the whole diff fits easily in the context window. Which reasoning should the architect give?

A) Context windows silently truncate long diffs, so splitting is the only way to guarantee every line is actually received
B) Splitting into passes is mainly a cost optimisation, because many small calls are always cheaper than one large call
C) Fitting in the window does not mean even scrutiny; focused passes deepen each file and a separate pass covers the seams
D) Per-file passes let the reviewer skip integration concerns entirely, removing the most error-prone part of the review

<details>
<summary>Answer & explanation</summary>

**C)** Even inputs well within the window get uneven attention, so per-file passes improve local depth and an integration pass handles cross-file effects. Splitting is not mainly about cost and may cost more, the window does not silently truncate a diff that fits, and integration concerns are kept, just moved to their own pass.

*Hint if stuck: Ask whether everything inside the limit is read with the same care.*
</details>

---

## Question 35
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

## Question 36
A telecom support agent answers customer messages and, in the same prompt, is told to screen each message for abuse and for attempts to obtain other customers' data. Reviews show that when it works hard on a tricky billing problem it often skips the screening, and when it screens carefully its answers get weaker. Which design addresses both problems?

A) Move the screening rules to the top of the system prompt in bold, so the agent applies them before it starts working on the billing problem
B) Screen only after the answer is written, by having the same call review both the customer's message and its own reply in one final pass
C) Run a separate screening call on each incoming message in parallel with the call that drafts the answer, and act on both results in code
D) Ask the agent to reason step by step and write its screening verdict in a tag before it answers, all inside the same single response

<details>
<summary>Answer & explanation</summary>

**C)** This is the sectioning form of parallelization: independent subtasks run as separate calls and code combines the results. Anthropic's guidance gives guardrails as the example, noting that one instance answering while another screens tends to perform better than one call handling both, because each consideration gets focused attention. Bold rules, a step-by-step tag or a self-review pass all keep both jobs in one call, which is exactly what is splitting its attention.

*Hint if stuck: Ask whether the two jobs depend on each other, and whether one call really has to carry both.*
</details>

---

## Question 37
A developer commits failing tests for a new discount-stacking rule and asks Claude Code to make them pass. Claude reports success, but review shows it relaxed two assertions in the test file to match its implementation. What change to the workflow best prevents this?

A) Ask Claude to run the full test suite twice, so any change that only passes by chance is caught
B) Lower the bar by removing the two hardest assertions, since they appear to be harder than the rule needs
C) Ask Claude to write a second, independent set of tests after implementing, and use it to cross-check the behavior the first set expects
D) Tell Claude the tests are the specification and must not be edited, and to change only implementation code

<details>
<summary>Answer & explanation</summary>

**D)** Test-first only works if the tests stay fixed; stating that they are the spec and off limits keeps Claude iterating on the implementation until the real rule is met. Running the suite twice cannot catch edited assertions, tests written after implementation tend to mirror the code, and removing assertions abandons the requirement.

*Hint if stuck: A test only steers the fix if it can't be moved to meet the code.*
</details>

---

## Question 38
A research coordinator delegates five regional market-sizing tasks. The Asia-Pacific subagent hits a paywall on its main source and gives up. Its prompt tells it to spawn a fresh 'backup researcher' subagent itself, and that backup's half-finished output never reaches the coordinator. How should failure handling be organized?

A) Give every subagent its own nested backup subagent with a longer timeout so that failures are fixed locally before anything is reported
B) Let the synthesis subagent fill in missing regions from its general knowledge when a regional subagent does not respond
C) Have the failing subagent return a structured failure with partial results, and let the coordinator decide whether to retry
D) Add a system-prompt rule telling every regional subagent that failure is not acceptable and it must find a source

<details>
<summary>Answer & explanation</summary>

**C)** In hub-and-spoke orchestration the coordinator owns error handling: subagents report what failed and what they did get, and the coordinator decides whether to retry, reassign or flag the gap. Nested backups hide failures inside branches the coordinator cannot see, which is exactly how the output got lost. Filling gaps from general knowledge invents unsourced data, and a 'never fail' rule only pushes subagents to fabricate.

*Hint if stuck: Ask which agent can see every branch and therefore should decide what happens after a failure.*
</details>

---

## Question 39
A developer asks Claude to work out why the team's build time doubled over the past month. The repository has 300 packages and a custom build graph. Which first step gives the investigation the best chance of finding the cause efficiently?

A) Ask Claude to read the build configuration of every package in alphabetical order and report anything unusual that it notices
B) Ask Claude to map the build graph and measure where the time now goes, then plan deeper investigation of the highest-cost areas
C) Ask Claude to propose the ten most common causes of slow builds and then check each of them one at a time against the repository
D) Ask Claude to revert the last month of build-related commits one at a time until the build time returns to what it was before

<details>
<summary>Answer & explanation</summary>

**B)** Open-ended diagnosis starts by mapping the system and finding where impact is concentrated, then planning from there. Reading every package spends equal effort everywhere, a checklist of common causes is a fixed plan built on guesses, and reverting commits one by one is slow and ignores what the data would show.

*Hint if stuck: Before guessing at causes, ask what data would point you to the right part of a 300-package build.*
</details>

---

## Question 40
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
A team in Claude Code wants a writer/reviewer workflow for a new OAuth callback handler. One engineer proposes giving the reviewer session the full transcript of the writer session 'so it understands the design choices.' Another proposes giving it only the diff and the spec. Which should the architect choose, and why?

A) The full transcript, because the reviewer cannot judge design choices without the reasoning that led to them
B) The full transcript plus the spec, because more context always produces a more accurate and thorough review
C) Neither of them; the reviewer should instead get a short summary written by the writer session explaining which areas it should check most closely
D) Only the diff and the spec, because a reviewer that reads the writer's reasoning tends to adopt it rather than test it

<details>
<summary>Answer & explanation</summary>

**D)** The value of a second instance is independence; handing it the writer's transcript reintroduces the same rationale that produced any blind spots. A writer-authored summary of what to check steers the reviewer toward the writer's view of the risky areas, and more context is not automatically better when it carries bias.

*Hint if stuck: What makes a second reviewer worth paying for in the first place?*
</details>

---

## Question 43
A CI review bot reports security issues, logic bugs and style comments. Its security findings are accurate, but most PRs also get a dozen style comments that repeat what the linter already enforces. Developers now resolve all bot comments without reading them, and last week a real injection flaw was dismissed with the rest. What should the team change first?

A) Add severity labels so security findings stand out, while keeping every style comment in each review
B) Tell the reviewer to skip anything the linter already enforces, so the comments left carry real weight
C) Require developers to reply to each bot comment before merging, so nothing is resolved without reading
D) Ask the reviewer to be more conservative overall, so it reports fewer findings in every category

<details>
<summary>Answer & explanation</summary>

**B)** A noisy category teaches developers to ignore the bot as a whole, so the accurate security findings lose their value too; the fix is an explicit criterion that removes the noise, and the Code Review docs suggest listing what CI already enforces among the things not to report. Severity labels help ranking but leave the flood in place, forced replies add friction without removing the cause, and a vague request to be conservative cuts across every category, including security, without saying what to skip.

*Hint if stuck: Consider why developers stopped reading the accurate findings at all.*
</details>

---

## Question 44
A developer has corrected Claude Code three times in one session about the same mistake: it keeps calling a deprecated logging wrapper instead of the new structured logger. Each correction works briefly, then the old wrapper reappears in the next file. The session history is long and full of the failed attempts. What is the best next step?

A) Add "IMPORTANT" in capitals to the next correction and repeat the instruction at the end of every message
B) Ask Claude to summarize what went wrong so far and continue in this session using the summary as a guide
C) Keep correcting in the same session, because the history now contains every example of what not to do
D) Clear the session and start fresh with a sharper prompt that names the structured logger and points to an example file

<details>
<summary>Answer & explanation</summary>

**D)** After repeated failed corrections the context is cluttered with the wrong approach, and a clean session with a better initial prompt that includes what was learned almost always does better. Repeating the instruction louder or keeping the failed attempts in history leaves the noise in place, and a summary within the same session still carries the cluttered context forward.

*Hint if stuck: Ask whether the problem is the instruction or the context the instruction is competing with.*
</details>

---

## Question 45
A customer writes to a bank's support agent: 'Please update my mailing address, and I'm disputing a $1,200 charge from a merchant I've never heard of.' Disputes over $500 must go to a human fraud team. The agent currently escalates the whole conversation at once, so the address change waits two days in the fraud queue. What should the workflow do?

A) Complete the address change, escalate only the dispute with a structured summary, and tell the customer which item is done and which is pending
B) Escalate the whole conversation as now, but mark the address change as low priority so the fraud team handles it after the dispute
C) Ask the customer to submit the address change in a separate chat after the dispute is resolved, so each conversation stays single-purpose
D) Have the agent handle both items itself, filing the dispute through its standard dispute tool and noting the amount for later fraud review by the team

<details>
<summary>Answer & explanation</summary>

**A)** Multi-concern requests should be split so each item is resolved by the right path: the agent finishes what it is authorised to do and escalates only the item that needs a human, with a structured handoff. Handling the dispute itself breaks the fraud policy, escalating everything delays a routine change and loads the fraud queue with it, and sending the customer away creates friction for a request the agent could have finished.

*Hint if stuck: Escalation applies to an item, not necessarily to the whole conversation.*
</details>

---

## Question 46
A developer-productivity app built on the Agent SDK defines a dependency-auditor subagent with a clear, specific description. Claude usually delegates license checks to it, but in a nightly compliance job the audit must always run inside that subagent, and logs show Claude sometimes does the check itself in the main agent. What is the most direct way to guarantee delegation for that job?

A) Name the subagent in the job's prompt, for example by asking Claude to use the dependency-auditor agent for the license check
B) Add a line to the dependency-auditor's own prompt field saying it must be used for license checks in every job that the app runs
C) Add Agent(dependency-auditor) to allowedTools so that the main agent is required to route every license check through that subagent
D) Set the subagent's model to opus so the main agent treats it as more capable and routes license checks to it more consistently

<details>
<summary>Answer & explanation</summary>

**A)** The SDK docs say that to guarantee Claude uses a specific subagent, you mention it by name in the prompt, which bypasses automatic matching. The subagent's prompt field is its own system prompt, which it only sees after it has been invoked, so it cannot influence routing. allowedTools pre-approves tool calls but compels nothing, and the model setting changes how the subagent runs, not whether Claude chooses it.

*Hint if stuck: Automatic matching is a judgement call; think about what the caller can say to take that judgement out of the loop.*
</details>

---

## Question 47
A developer watches Claude Code start rewriting a date utility. Two edits in, she sees it has taken the wrong approach: it is converting everything to local time, but the module must stay in UTC. She wants to stop it right away and also undo the two edits already made, without losing the earlier part of the conversation. What should she do?

A) Run /clear to wipe the session, then retype the task with a note that the module must stay in UTC
B) Let it finish the task, then ask Claude in a new message to convert every function back to UTC
C) Run /compact so the wrong approach is summarised away, then restate the UTC requirement after it
D) Press Esc to stop it, then use /rewind to restore the code to the checkpoint before those edits

<details>
<summary>Answer & explanation</summary>

**D)** Esc stops Claude mid-action with context preserved, and Esc twice or /rewind opens the rewind menu, which can restore code, conversation or both to an earlier checkpoint; Claude snapshots files before each edit made with its editing tools. /clear throws away the useful earlier conversation and leaves the edits on disk. Letting it finish wastes work and piles more wrong edits on top, and /compact condenses history without undoing any file change.

*Hint if stuck: Weigh how early each choice stops the wrong work, and what it does to the files and to the conversation.*
</details>

---

## Question 48
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

## Question 49
A multi-agent research system must profile 8 competitors, and each profile is independent of the others. Today the coordinator spawns one research subagent, waits for its report, then spawns the next, taking 25 minutes end to end. What change makes the subagents run concurrently?

A) Have the coordinator emit all 8 Task tool calls as multiple tool_use blocks in a single response
B) Set CLAUDE_PARALLEL=8 in the environment so the runtime fans out the coordinator's Task calls automatically
C) Submit the 8 profiles as a Message Batches job so they process simultaneously
D) Add 'work on all competitors at the same time' to the coordinator's system prompt

<details>
<summary>Answer & explanation</summary>

**A)** Parallel subagents are spawned by issuing multiple Task tool calls in one assistant response — each tool_use block launches a subagent that runs concurrently. CLAUDE_PARALLEL is not a real setting, and the Batch API trades latency for cost with results within 24 hours, so it cannot speed up a pipeline whose problem is wall-clock time. A prompt instruction is probabilistic best-effort; the actual mechanism is emitting the Task calls together in one turn, and only that guarantees concurrency.

*Hint if stuck: Separate real runtime mechanisms from settings or wording that only sound like one.*
</details>

---

## Question 50
An invoice pipeline offers two tools: `extract_invoice` for readable invoices and `flag_unreadable` for documents that cannot be processed. With `tool_choice` set to auto, the model sometimes replies in plain text ("This scan is too blurry to read"), which the pipeline cannot route. The team's model supports every `tool_choice` mode. Which `tool_choice` setting fits?

A) Force `extract_invoice` on every request, so the pipeline always receives structured invoice data
B) Set `tool_choice` to any, so the model must call one of the two tools and can still choose the right one
C) Force `flag_unreadable` first and then switch to auto, so every document is checked before extraction
D) Keep auto and add a prompt line telling the model to always use one of the tools rather than plain text

<details>
<summary>Answer & explanation</summary>

**B)** "any" requires a tool call while leaving the model free to choose between extracting and flagging, which is exactly what the pipeline needs. Forcing `extract_invoice` makes the model extract from blurry scans it should flag, forcing `flag_unreadable` first wastes a call and still leaves the auto problem, and a prompt line under auto is only advisory.

*Hint if stuck: Ask which setting rules out a plain-text reply without dictating which path the document takes.*
</details>

---

## Question 51
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

## Question 52
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

## Question 53
An overnight multi-agent research coordinator fans out 60 subagent tasks over roughly seven hours. A crash at hour five currently forces rerunning everything, wasting about $90 of API spend per incident. The team is debating recovery designs. Which is best?

A) Enable 1-hour prompt caching on the coordinator's stable prefix so a restarted run reuses the cached work and skips already-completed reasoning
B) Append each completed subagent's task id, status, and structured findings to a manifest; a restarted coordinator loads it and dispatches only incomplete tasks
C) Persist the coordinator's full message history to disk every 10 minutes and on restart replay the conversation from the most recent snapshot to continue work
D) Wrap every subagent call in retry-with-backoff so transient failures never surface and coordinator crashes become effectively impossible to hit

<details>
<summary>Answer & explanation</summary>

**B)** A manifest recording completed task ids plus their structured findings is the minimal durable state needed to resume: restart logic deterministically skips finished work and re-dispatches only the rest. Replaying full message history restores bloated context and a fragile transcript rather than clean state, prompt caching is a cost optimization that holds no completion state, and retries handle transient tool errors but cannot make process crashes impossible.

*Hint if stuck: Ask what small record would let a fresh run skip the work that already finished.*
</details>

---

## Question 54
A pipeline extracts certifications from supplier onboarding packets, and the validator produces two kinds of errors: date fields in the wrong format, and a required ISO certificate number that is blank. Both currently trigger the same three-attempt feedback loop. Most blank certificate numbers are packets that simply do not include the certificate. How should the loop treat these errors?

A) Treat both the same, but increase the retry limit for the blank certificate field since it is the more important one
B) Retry both with feedback, but add an instruction that the certificate number must be present in every valid packet
C) Skip retries for both types and mark every packet that fails validation for manual completion by the onboarding team
D) Retry the date-format errors with feedback, and route a blank certificate to a request for the missing document

<details>
<summary>Answer & explanation</summary>

**D)** Format errors are fixable from the source, so they are worth retrying with specific feedback, while a certificate the packet does not contain cannot be recovered by asking again. More retries or an instruction that the value must exist pressure the model to invent a number, and skipping retries entirely sends easily fixed format errors to people.

*Hint if stuck: For each error type, ask whether another attempt has anything new to work with.*
</details>

---

## Question 55
An invoice pipeline sends a raw JSON schema through structured outputs. To stop impossible values, an engineer adds minimum: 0 to every amount field and maxLength: 20 to invoice_number. The next deploy fails on every request with a 400 error about the schema. How should those limits be enforced?

A) Leave the unsupported keywords out of the sent schema and check those limits in code on the response
B) Swap minimum for exclusiveMinimum and maxLength for minLength, which the decoder fully supports
C) Send the same schema as a tool with strict: true instead, since strict tool use enforces bounds
D) Wrap each bounded field in anyOf with a null branch, which makes the API skip constraint checks

<details>
<summary>Answer & explanation</summary>

**A)** Structured outputs do not support numerical constraints such as minimum, maximum and multipleOf, or string constraints such as minLength and maxLength, and using them returns a 400. Strict tool use shares the same limitations, so moving the schema into a tool changes nothing. The fix is to send the schema without those keywords and validate the limits in code; the SDK helpers do this for you by stripping them, noting them in the field description and checking the response. exclusiveMinimum and minLength are unsupported too, and anyOf does not switch validation off.

*Hint if stuck: Check which parts of JSON Schema the constrained decoder actually understands.*
</details>

---

## Question 56
A customer writes in capitals that they are furious their package is late, but tracking shows it arrives tomorrow and the agent can offer the standard late-delivery credit. The customer has not asked for a human. What is the best response pattern?

A) Escalate straight away, because the customer's anger in capitals indicates a high risk of churn that a human agent is better placed to handle
B) Acknowledge the frustration, give the delivery date, apply the standard credit, and escalate if they then ask for a person
C) Ask the customer to calm down before continuing, so that the conversation can stay productive for both sides
D) Offer a larger credit than the standard amount, since an angry customer needs more than the usual remedy

<details>
<summary>Answer & explanation</summary>

**B)** Strong sentiment alone is a poor escalation signal; when the agent can resolve the issue within policy, it should do so while acknowledging the emotion, and still honour a request for a human if one comes. Escalating on anger floods the queue, telling the customer to calm down is counterproductive, and going beyond policy because of tone is improvisation.

*Hint if stuck: Separate how the customer feels from whether the agent can resolve the case.*
</details>

---

## Question 57
A developer wants a local git pre-commit hook that asks Claude Code to flag secrets or debug statements in the staged changes and print a short report. Her first attempt launches claude with no flags from the hook, and the commit hangs waiting for input. How should the hook invoke Claude?

A) Launch claude in a background terminal tab from the hook and read the report once it is finished
B) Run claude --continue so the hook reuses the developer's open interactive session for the check
C) Pipe git diff --cached into claude -p with a prompt asking for the report, and print the output
D) Wrap the interactive claude command with expect to answer prompts automatically during the hook

<details>
<summary>Answer & explanation</summary>

**C)** The -p flag runs Claude Code non-interactively, and piping the staged diff gives it exactly the content to check without extra tool permissions. A background terminal or expect-wrapper fights an interactive UI that is not meant for scripts. Continuing an interactive session couples the hook to whatever conversation happens to be open.

*Hint if stuck: Scripts need the mode built for scripts.*
</details>

---

## Question 58
A support agent, running on a model that supports forced tool use, is required to finish every resolved conversation with a call to log_resolution, which feeds compliance reporting. The prompt says so, yet 4% of resolved conversations end with a friendly goodbye and no log. Forcing the tool on every request is not possible because the agent cannot know in advance which turn is the last. What should the architect do?

A) Move the log_resolution requirement to the top of the system prompt and mark it as mandatory in capitals
B) Have code parse the goodbye message and write a compliance log entry from that text whenever none is called
C) When the loop ends without a log, have code send one more request with tool_choice forcing log_resolution
D) Set tool_choice to any on every request so that the agent is always obliged to call some tool before finishing

<details>
<summary>Answer & explanation</summary>

**C)** The application knows when the loop has ended, so it can deterministically issue a final request that forces the logging tool, keeping the structured log while leaving earlier turns on auto. Stronger prompt wording keeps a non-zero miss rate. Writing logs from parsed prose bypasses the schema, and any on every turn would block the agent from ever ending with text. (On the newest models, Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1, "any" and forced tool_choice return a 400 error; there you keep auto and use strict tool use or structured outputs.)

*Hint if stuck: Your code, not the model, knows when the conversation has ended.*
</details>

---

## Question 59
A contract-extraction agent sometimes returns stop_reason max_tokens, and the last content block is a tool_use for record_clauses whose JSON input is cut off. The loop currently tries to parse that partial input, fills missing fields with nulls, and writes the record. Which change addresses the root cause?

A) Keep parsing the partial input but add a schema validator downstream that rejects records with more than two null fields
B) Treat the response as truncated: retry the request with a higher max_tokens so Claude can emit a complete tool call
C) Append the partial tool_use and a tool_result saying the input was truncated so Claude can resend only the missing fields
D) Lower the temperature for extraction calls so the model produces shorter, more predictable JSON that fits the token budget

<details>
<summary>Answer & explanation</summary>

**B)** A max_tokens stop with an incomplete tool_use block means the call was never fully formed, so it must not be executed; the documented fix is to retry with a higher max_tokens. A downstream validator still writes partial records that happen to pass, and answering a malformed call with a tool_result pretends the call was valid. Temperature does not control output length, so it leaves the truncation in place.

*Hint if stuck: Ask whether a tool call that was cut off mid-generation is a call at all.*
</details>

---

## Question 60
An e-commerce operations agent answers on-call engineers' questions in long-running sessions; engineers execute any deploys themselves. Answers must always reflect the current deploy-freeze status and on-call rotation, both of which change mid-session. Today the agent advised an engineer to deploy during a freeze that began an hour after the session started. Which hook placement fixes this?

A) A SessionStart hook that injects freeze status and the rotation when the session begins
B) A Stop hook that appends the latest freeze status to the agent's final answer each turn
C) A PreToolUse hook that inserts the current rotation into the parameters of every tool call the agent makes during a turn
D) A UserPromptSubmit hook that fetches current freeze status and rotation and attaches them to each incoming prompt

<details>
<summary>Answer & explanation</summary>

**D)** The failure happened because the facts changed mid-session, so any mechanism that injects them only once at session start is guaranteed to go stale, which is exactly the trap in the SessionStart option. UserPromptSubmit fires on every user message, so the model reasons over current freeze and rotation data each time it answers. The Stop hook decorates output after reasoning is done, too late to change the advice, and the PreToolUse option only touches tool parameters, which never informs the model's answer to a question.

*Hint if stuck: Ask which hook fires often enough to keep fast-changing facts current throughout a session.*
</details>

---

## Answer key (no peeking until scored)

1:D 2:C 3:C 4:B 5:B 6:B 7:C 8:A 9:C 10:C 11:A 12:D 13:C 14:B 15:D 16:B 17:C 18:B 19:A 20:B 21:B 22:B 23:D 24:D 25:C 26:A 27:D 28:D 29:B 30:C 31:D 32:A 33:B 34:C 35:B 36:C 37:D 38:C 39:B 40:C 41:D 42:D 43:B 44:D 45:A 46:A 47:D 48:A 49:A 50:B 51:D 52:D 53:B 54:D 55:A 56:B 57:C 58:C 59:B 60:D
