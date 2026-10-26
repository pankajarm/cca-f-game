# Practice Test 09: The Memory Halls
**D5: Context Management & Reliability** (15% of the exam) · task statements 5.1, 5.2, 5.3

75 questions. Exam pace is 2 minutes per question.

---

## Question 1
A travel-booking support agent handles rebooking conversations that often run 40 turns. Older turns are summarised to save context. Customers complain that late in the chat the agent quotes the wrong rebooking fee and forgets the fare-class waiver it promised early on. What is the best fix?

A) Summarise less often, for example at 20 turns instead of 10, so fewer details are lost in each round
B) Disable summarisation and keep the full transcript, relying on the large context window to hold the conversation
C) Ask the summariser prompt to be especially careful to preserve numbers, dates and commitments when it condenses turns
D) Keep a structured case-facts block (booking ref, fees, waivers, promises) outside the summarised history, never summarised

<details>
<summary>Answer & explanation</summary>

**D)** Progressive summaries blur exact amounts and promises, so critical facts need a persistent block that is never summarised. Summarising less often or prompting the summariser to be careful only reduces the loss, and dropping summarisation trades the problem for a bloated context where details in the middle are read less reliably.

*Hint if stuck: Ask which details must stay exact for the whole chat, and whether any lossy step should be allowed to touch them.*
</details>

---

## Question 2
A coordinator in a pharmaceutical research system receives findings from six subagents, each returning around 3,000 words of narrative reasoning. Synthesis keeps missing trial sample sizes and p-values that were present in the narratives. What should the architect change first?

A) Have subagents return structured findings with key facts, figures and source references, instead of narrative reasoning
B) Have the coordinator summarise each narrative itself first, then synthesise from its own six short summaries
C) Raise the coordinator's context window budget so that the six full narratives fit with plenty of room to spare
D) Place a note at the top of the synthesis prompt reminding the coordinator to look carefully for each sample size

<details>
<summary>Answer & explanation</summary>

**A)** Asking upstream agents for structured facts puts the numbers where the coordinator can use them and cuts the noise that buries them. A bigger budget leaves the same buried detail, a coordinator-written summary adds another lossy step, and a reminder does not change where the figures sit in 18,000 words of prose.

*Hint if stuck: Ask whether the coordinator's problem starts in its own prompt or in what it is handed.*
</details>

---

## Question 3
An extraction pipeline sends Claude a 90-page insurance policy plus a list of 15 fields to extract. The current prompt puts the field list and instructions first, then the policy text. Accuracy is poor on fields defined deep in the document. Which change follows Anthropic's long-context guidance?

A) Repeat the field list before, during and after the policy text so the model cannot lose track of it
B) Put the long policy text at the top inside document tags, with the instructions and field list at the end of the prompt
C) Split the field list so that each field instruction is placed right before the page of the policy it is likely on
D) Keep the order as it is but bold the field names and add an instruction to read every page with equal care

<details>
<summary>Answer & explanation</summary>

**B)** Anthropic's guidance is to place long documents near the top and the query and instructions at the end, which measurably improves response quality on long inputs. Repeating instructions adds noise, guessing per-page placement assumes knowledge the pipeline lacks, and formatting or exhortations do not change how the long input is processed.

*Hint if stuck: Recall Anthropic's advice on how to arrange very long inputs relative to what you ask about them.*
</details>

---

## Question 4
A developer-productivity agent calls an internal CI-status tool that returns every job's full log, often 20,000 tokens per call, though engineers only ask whether jobs passed and which test failed. After a few calls the agent starts forgetting the branch name and ticket the engineer gave it. Which change best addresses this?

A) Instruct the agent to ignore the log sections of the tool output and focus on the job status lines
B) Run /compact after each tool call so the verbose logs are summarised before the next turn, keeping the branch and ticket
C) Wrap the tool to return only job name, status and failing tests, plus a separate tool to fetch a log on demand
D) Restate the branch name and ticket at the start of each user message so the agent keeps seeing them

<details>
<summary>Answer & explanation</summary>

**C)** Verbose tool results crowd out the facts that matter, so trimming output to the relevant fields at the tool boundary, with on-demand detail, fixes the root cause. Telling the agent to ignore sections still loads the tokens, compacting after every call is lossy and repetitive, and restating context by hand treats the symptom.

*Hint if stuck: Control what enters the context, not just what the model pays attention to.*
</details>

---

## Question 5
A support agent keeps a case-facts block, but it is appended at the end of an ever-growing context and updated by having the model rewrite it each turn. Over long chats, the block itself starts to lose details such as the second order number. What is the most robust way to maintain it?

A) Ask the model to rewrite the block more carefully each turn and not to remove any fact it has previously recorded
B) Store the block in the first user message and nowhere else, since the model reads the start of the context most reliably
C) Move the case-facts block into the summary so that it is condensed along with the rest of the earlier conversation
D) Have application code update the block from structured tool results and inject it in a fixed, prominent position each turn

<details>
<summary>Answer & explanation</summary>

**D)** When the model rewrites the block freely, it is just another lossy summary; code that writes facts from structured tool results and re-injects the block in a fixed position keeps them exact. A careful-rewrite instruction is still probabilistic, folding the block into the summary defeats its purpose, and pinning it only to the first message leaves it ever further from the current turn.

*Hint if stuck: Ask whether a block that is rewritten in full every turn is any safer than the summary it was meant to replace.*
</details>

---

## Question 6
After two hours in Claude Code diagnosing a flaky authentication test, a developer is about to start the fix. The context is nearly full, and the last automatic compaction produced a generic summary that dropped the exact failing test names and the environment variable that triggers the bug. What should the developer do before starting implementation?

A) Run /clear and re-explain the bug from memory, since a fresh context gives better results than a summarized one
B) Let automatic compaction keep running, since it already judges which details matter most for the next step
C) Switch to a model with a larger context window so that compaction does not have to run during this session
D) Run /compact with instructions naming what to keep, such as the failing test names and the triggering variable

<details>
<summary>Answer & explanation</summary>

**D)** /compact accepts focus instructions, so the summary keeps what you choose instead of what the automatic pass guesses matters; standing instructions about what to preserve can also go in CLAUDE.md. Clearing discards two hours of diagnosis and relies on the developer's memory. Automatic compaction already lost these details once. A larger window only delays compaction, which works the same at the bigger limit, and quality still degrades as context fills.

*Hint if stuck: A summary keeps whatever it is told matters; ask who is doing the telling here.*
</details>

---

## Question 7
A research subagent returns findings as one long paragraph, with the decisive result (a recall of a component used by three suppliers) mentioned in the eighth sentence. The coordinator often omits it from the brief. Short of defining a full output schema, what format change helps most?

A) Ask the subagent to bold the important sentence anywhere it happens to appear within the paragraph
B) Ask the subagent to lead with key findings under clear headers, then supporting detail and sources
C) Ask the subagent to repeat the key finding at the start, the middle and the end of its long paragraph
D) Ask the subagent to keep the paragraph format but shorten it to a maximum of four sentences overall

<details>
<summary>Answer & explanation</summary>

**B)** Leading with key findings under headers places them where they are read most reliably and makes them easy to lift into synthesis. Bolding inside dense prose and repeating the finding add noise without structure, and an arbitrary length cap may cut the very detail needed.

*Hint if stuck: Position and labels both affect what gets picked up downstream.*
</details>

---

## Question 8
An extraction agent processes a 300-email thread to build a timeline of a contract dispute. It retrieves emails via a search tool, and each result includes full headers, signatures and quoted replies. The final timeline is missing dates from the middle of the thread. Which change targets the cause most directly?

A) Ask the agent to number each email as it reads so it can confirm that none were skipped before writing the timeline
B) Ask the agent to build the timeline in two halves and then merge the halves, each with a prompt to focus on dates
C) Strip each email to sender, date, subject and new body text before it reaches the model; full text on request
D) Retrieve the 300 emails in a single tool call so the agent sees the whole thread at once in chronological order

<details>
<summary>Answer & explanation</summary>

**C)** Quoted replies and boilerplate multiply the token count and push mid-thread content into the poorly attended middle, so trimming results to relevant fields at retrieval is the direct fix. Splitting in halves can help but leaves the noise in place, numbering emails does not change attention, and one giant retrieval makes the dilution worse.

*Hint if stuck: Ask how much of each retrieved result the timeline actually needs.*
</details>

---

## Question 9
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

## Question 10
A research lead agent built on the Claude API runs for hours and calls web_fetch hundreds of times. The team turned on context editing with the clear_tool_uses strategy, so old fetch results are cleared once input passes 80k tokens. Runs no longer hit the context limit, but after each clearing the agent re-fetches pages it already read, and its interim notes drop figures it had pulled from them. What should the team add?

A) The memory tool, so Claude can write findings to memory files when warned that clearing is near and read them back afterwards
B) A higher keep value, so the 50 most recent fetch results stay in context and the older findings survive a good while longer
C) clear_tool_inputs set to true, so the cleared calls vanish as well and the agent stops trying to revisit those pages
D) A model with a larger context window and no clearing, so each fetched page stays available until the run ends

<details>
<summary>Answer & explanation</summary>

**A)** Context editing frees the window by removing raw results, so what the agent learned from them has to live outside the window. Anthropic pairs it with the memory tool: as context nears the clearing threshold, Claude gets a warning and can save what matters to memory files, then consult them later. Keeping more results only delays the loss and takes back the space clearing was meant to free. Clearing the inputs too erases the record of what was fetched, so the agent loses its trail rather than its duplicates. A bigger window without clearing brings back context rot: recall falls as the window fills.

*Hint if stuck: Clearing decides what leaves the window. Ask where the knowledge drawn from those results should live once they are gone.*
</details>

---

## Question 11
A support agent on the Claude API calls get_entitlements once at the start of each chat to load which services and credits the customer's plan includes, then calls get_order_history many times. To control context, the team enabled clear_tool_uses with keep set to 3. In long chats the agent starts offering credits the plan does not include. The team wants to keep clearing the bulky order-history results. Which change fits best?

A) Add get_entitlements to exclude_tools so its result survives clearing, while order-history results are still cleared
B) Lower the trigger so clearing runs earlier and more often, keeping the context small enough that the plan details stay prominent
C) Raise keep to 20 tool uses so the entitlement lookup usually survives, as few chats make over twenty calls
D) Set clear_tool_inputs to true so the agent no longer sees a cleared entitlement call and stops assuming it knows the plan

<details>
<summary>Answer & explanation</summary>

**A)** exclude_tools lists tool names whose uses and results are never cleared, which gives exactly the split needed: the one small result the whole chat depends on stays, the bulky ones go. Clearing earlier removes the entitlement result sooner, not later. A bigger keep only makes survival likely in shorter chats and holds far more order history than needed. Clearing the inputs as well removes the evidence that the lookup happened; it does not give the agent back the plan details it is missing.

*Hint if stuck: Some lookups matter for the whole conversation and others for a moment. Which setting respects that difference?*
</details>

---

## Question 12
A team builds its own compaction step for a long-running coding agent on the Claude API: when context reaches 150k tokens, a separate call summarises the history and the agent continues from that summary. The summarisation prompt was tuned to produce very short summaries, and after compaction the agent keeps reopening bugs it had already diagnosed and forgets design decisions. How should the team rework the summarisation prompt?

A) Keep the short summaries but compact twice as often, so each summary covers fewer turns and loses less from each stretch
B) Ask the summariser to keep just the last ten turns verbatim and discard everything older, since recent turns matter most
C) Tune it on real long traces to capture everything relevant first, such as decisions and open bugs, then trim what is redundant
D) Ask the summariser to rate each turn's importance from 1 to 10 and keep the turns rated 8 or higher, dropping the others

<details>
<summary>Answer & explanation</summary>

**C)** Anthropic's context-engineering guidance is to start by maximising recall, so the compaction prompt keeps architectural decisions, unresolved bugs and implementation details, and only then improve precision by cutting redundant content such as old tool outputs. A prompt tuned for brevity throws away the state the agent needs. Compacting more often still runs the same lossy prompt. Keeping only recent turns discards early decisions wholesale. Self-rated importance is an unreliable filter that silently loses whatever it under-rates.

*Hint if stuck: When tuning a lossy step, decide up front which kind of mistake costs the agent most.*
</details>

---

## Question 13
In one chat, a customer of an electronics retailer raises three problems: a duplicate charge, a cracked screen on delivery and a wrong billing address. The agent works on the duplicate charge for 30 turns, older turns get summarised, and the agent then closes the chat after issuing the refund, never returning to the screen or the address. Which design change prevents this?

A) Record each raised problem as its own entry with a status in case facts kept outside the summary, and check them before closing
B) Summarise older turns less aggressively, so the opening message that listed the three problems stays visible in the history for much longer
C) Tell the agent in its system prompt to resolve the most urgent problem first and open a new chat for each remaining one
D) Ask the customer at the end of each chat whether anything else is needed, and rely on them to repeat any open problems

<details>
<summary>Answer & explanation</summary>

**A)** Summaries tend to keep the thread that dominated the conversation and blur the rest, so the list of open problems belongs in a structured block that is never summarised, with one entry and status per problem, checked before wrap-up. Asking the customer pushes the tracking onto them and fails when they assume the agent remembers. Gentler summarisation only delays the loss. Splitting into new chats makes the customer start over and still loses problems nobody recorded.

*Hint if stuck: Ask which part of the agent's state is immune to summarising, and what it would need to hold here.*
</details>

---

## Question 14
In long support chats the agent summarises older turns to save context. Customers complain that late in a chat it quotes the wrong refund amount and forgets the delivery date it promised. Its order-lookup tool also returns about 40 fields per order, mostly warehouse codes and audit metadata, which take up much of the context. Which changes protect the facts that matter? (Choose two.)

A) Summarise more often and ask each summary to keep the numbers, so the history stays short and facts survive
B) Keep a case-facts block of amounts, dates, order IDs and promises outside the summarised history
C) Place the full 40-field order record in the middle of the prompt, where the model attends to it most steadily
D) Trim lookup results to the fields the agent needs, such as status, amount and dates, before they enter context
E) Raise max_tokens on each reply so the model has room to restate each fact from earlier in the conversation

<details>
<summary>Answer & explanation</summary>

**B, D** Progressive summaries blur exact amounts, dates and commitments, so those facts should live in a persistent block that is never summarised and is sent with every turn. Verbose tool results crowd out what matters; keeping only the relevant fields leaves room for the facts. Summarising more often adds more lossy passes. The middle of a long context is where information is used least reliably, not most. max_tokens limits the reply's length and does nothing for what the model remembers.

*Hint if stuck: Ask which facts must never pass through a lossy step, and what is crowding them out.*
</details>

---

## Question 15
In a research system, six search subagents each return about 8,000 tokens of narrative notes that mix their reasoning with the facts they found. The synthesis agent's prompt opens with the research question and instructions, followed by all six notes. Reports often miss key figures that sit midway through the notes, and sometimes credit a figure to the wrong source. Which changes help? (Choose two.)

A) Turn on context editing so older subagent results are cleared and the synthesis prompt stays small
B) Move synthesis to a model with a larger context window so the six notes fit with plenty of room to spare
C) Have subagents return structured findings, each a claim with its figure, source and date, not reasoning
D) Have the coordinator merge the six notes into one short summary paragraph before synthesis sees them
E) Put the six findings blocks first and the research question and instructions at the end of the prompt

<details>
<summary>Answer & explanation</summary>

**C, E** Structured findings keep each figure tied to its source and date and drop the reasoning the synthesizer would otherwise wade through. For long inputs, putting the material at the top and the question and instructions at the end improves results, while facts buried mid-context are the ones most often missed. The notes already fit; a bigger window doesn't change how well the middle is read. A one-paragraph merge blurs figures and loses their sources. Clearing the subagent results removes the evidence synthesis needs.

*Hint if stuck: Think about both the shape of what reaches the synthesizer and the order in which it reads it.*
</details>

---

## Question 16
An extraction pipeline sends 150-page supply contracts to Claude in a single request to list 12 kinds of obligations, such as notice periods, penalties and renewal terms. The prompt gives the instructions and output format first, then pastes the contract as plain text. Obligations stated midway through long contracts are often missed or paraphrased with wrong numbers. Which prompt changes address this? (Choose two.)

A) Put the contract at the top inside document tags and move the instructions and output format to the end
B) Ask Claude to first quote the passages relevant to each obligation, then extract from those quotations
C) Summarise each contract in a first call and run the extraction on that summary instead of the full text
D) Repeat the list of 12 obligation types in capitals at both the start and the end of the prompt for emphasis
E) Ask Claude to rate its confidence in each obligation and rerun extraction on any rated lower than 0.8

<details>
<summary>Answer & explanation</summary>

**A, B** For 20k+ token inputs, the docs recommend long documents at the top (wrapped in document tags with metadata) and the query at the end, which improves quality by up to 30% in tests. Asking Claude to quote the relevant parts first focuses it on the exact text and keeps numbers verbatim. A summary is exactly where specific numbers and terms blur. Shouting the list doesn't change how the middle of the document is read. Self-rated confidence is poorly calibrated, so reruns would target the wrong items.

*Hint if stuck: Recall the long-context prompting advice: it covers both layout and a step before the task itself.*
</details>

---

## Question 17
A developer-productivity assistant gets its persona, coding standards, and 'never push directly to main' rules injected at the top of every user message, with each request's diff and ticket details following below. In long sessions adherence to the rules degrades, and prompt caching saves almost nothing. How should the prompt be restructured?

A) Keep the rules in the user messages but also repeat them verbatim in a final reminder line at the end of each request
B) Move the per-request diff and ticket details into the system prompt so the content shares one stable location
C) Move the persona, standards and rules into the system prompt and leave the diff and ticket details in user messages
D) Compress the rules into a one-line summary so repeating them inside each user message costs fewer tokens

<details>
<summary>Answer & explanation</summary>

**C)** The system prompt is the home for stable identity, behavioral rules, and constraints, while user messages carry per-turn data, and that separation also creates the stable prefix prompt caching needs. Repeating rules in every user message duplicates tokens and mixes instructions with data, moving volatile per-request content into the system prompt would destroy the stable prefix entirely, and compressing the rules weakens them without fixing their placement.

*Hint if stuck: Stable instructions and volatile data each have a proper home in the request structure.*
</details>

---

## Question 18
A telecom support agent runs on a model with a 1M-token context window. To 'never miss anything', the team now loads the full 600-page product and policy manual into every conversation, which fits with plenty of room to spare. Since the change, answers about specific plan terms have become less accurate, not more. What best explains this, and what should the team do?

A) The manual still sits too close to the token limit; move to a larger context tier so the model has more headroom to reason
B) The model needs firmer instructions; add a system-prompt rule that it must read the entire manual before each answer
C) Recall degrades as the window fills, even below the limit; load only the policy sections a case needs, retrieved on demand
D) The repeated manual confuses the prompt cache; turn caching off so each turn re-reads the manual fresh from the beginning

<details>
<summary>Answer & explanation</summary>

**C)** Anthropic's docs call this context rot: as the token count grows, accuracy and recall degrade, so curating what is in context matters as much as how much fits. Pulling in only the relevant policy sections when a case needs them keeps the context small and high-signal. A bigger window does not help because the drop appears well below the limit. A rule to read everything adds instructions without removing any noise. Caching changes cost and latency, not what the model attends to.

*Hint if stuck: Ask whether fitting inside the context limit is the same thing as being used well.*
</details>

---

## Question 19
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

## Question 20
A multi-agent research system's coordinator builds a 60k-token synthesis prompt: subagent findings concatenated chronologically, with the critical scope constraint ('only include peer-reviewed sources after 2020') stated once around token 30k, where it landed in sequence. The final report repeatedly cites blog posts from 2017. What change most directly fixes this?

A) Increase the thinking budget so the model reasons more carefully over the full 60k tokens
B) Rerun the synthesis on a model with a larger context window so the prompt fits more comfortably
C) Drop older findings until the prompt is short enough that the constraint no longer sits in the middle
D) Lift the scope rule out of the findings into a headed instruction block at the end of the prompt

<details>
<summary>Answer & explanation</summary>

**D)** A rule stated once in the middle of a long prompt is easy to miss even when everything fits in the window. Anthropic's long-context guidance puts the long material first and the instructions and query at the end, clearly separated with headers or tags, so the scope rule belongs in its own instruction block after the findings. More thinking or a bigger window leaves the buried sentence where it is, and dropping findings throws away evidence instead of fixing where the rule sits.

*Hint if stuck: The prompt fits in the window, so ask where in it the rule actually sits.*
</details>

---

## Question 21
A hospital intake agent keeps a structured case-facts block (allergies: penicillin; weight: 72 kg). The block was injected at turn 1, but by turn 30 it sits buried under 50k tokens of accumulated dialogue and tool results, and the agent suggests an amoxicillin prescription. The block's contents are intact and within the context window. What is the fix?

A) Add a system prompt instruction telling the model to consult the case-facts block before any medication suggestion
B) Run /compact on the dialogue so the case-facts block becomes a larger share of the remaining context
C) Expand the block with severity codes and timestamps so it stands out more in the context
D) Re-inject the block on each request in a fixed, prominent spot under clear headers, not just at turn 1

<details>
<summary>Answer & explanation</summary>

**D)** Keeping a facts block is necessary but not enough: once it is buried in the middle of a long context it is read less reliably, so the application should re-inject it on every request in a fixed, clearly headed position rather than once at turn 1. An instruction to consult the block still points at a buried region. Compaction is lossy for everything else in the history and does not move the block, and adding more fields to the block does not change where it sits.

*Hint if stuck: Having the facts in context is not the same as having them where the model attends.*
</details>

---

## Question 22
A warranty-support agent builds each request as: system prompt, then the customer's question and answer instructions, then about 30,000 tokens of retrieved warranty terms and order history appended last 'so the freshest data sits closest to the reply'. Answers often ignore exclusions that are clearly stated in the terms. How should the request be ordered?

A) Keep the data last, since the end of a prompt gets the most attention, and repeat the customer question once more at the top
B) Interleave each warranty clause with a copy of the customer question so the model compares every clause against it in turn
C) Summarize the warranty terms to a few hundred tokens in a separate call first, so the order of the prompt stops mattering
D) Place the warranty terms and order history first in tagged blocks, with the customer question and instructions after them

<details>
<summary>Answer & explanation</summary>

**D)** Anthropic's long-context tips say to put long documents and inputs near the top, above the query and instructions; queries at the end improved response quality by up to 30 percent in tests with complex multi-document inputs. Wrapping each source in its own tags keeps them distinct. Keeping the data last leaves the question buried in the middle. Interleaving copies of the question inflates the context and fragments the documents. Pre-summarizing throws away exactly the exclusion details customers ask about.

*Hint if stuck: Think about where the request belongs when a prompt carries tens of thousands of tokens of reference material.*
</details>

---

## Question 23
A research coordinator hands its report-writer subagent a 25,000-token brief merged from eight researcher subagents, ordered by the time each researcher finished. The three findings that decide the report's conclusion sit in sections four to six of the brief, and the final report keeps under-weighting them. Which change to the brief helps most?

A) Keep the finish-time order but bold the most important sentences wherever they happen to appear across the brief
B) Pass the writer the eight raw research transcripts instead of a brief so it can judge importance on its own
C) Open the brief with a short key-findings section, then give each research thread its own clearly headed section
D) Cut the brief to its first 5,000 tokens so only the work of the earliest-finishing researchers is included

<details>
<summary>Answer & explanation</summary>

**C)** Material buried mid-context is used less reliably than material at the start, so the findings that matter most should lead, and distinct sections marked with headers or tags make a long input easy to navigate. Anthropic recommends organizing context into distinct sections delimited with XML tags or Markdown headers. Bolding leaves the key findings where they are, in the middle. Raw transcripts make the input far larger and noisier. Truncating by finish time drops findings arbitrarily, possibly the decisive ones.

*Hint if stuck: Think about where in a long input the reader is most likely to give material full weight, and how it finds its way around the rest.*
</details>

---

## Question 24
An extraction pipeline sends Claude a 120-page master services agreement, already placed at the top of the prompt with the request at the end, and asks for every obligation the supplier has. The output reads well, but reviewers find obligations that loosely paraphrase the contract and two that blend clauses from different sections. Which prompt change best follows Anthropic's long-document guidance?

A) Move the request and instructions above the contract so the model knows what to look for before it starts reading the text
B) Ask Claude to first pull the relevant clauses out verbatim in tagged blocks, then derive each obligation from those passages
C) Split the agreement into 120 single-page requests and merge the per-page obligations with a final deduplication pass at the end
D) Add an instruction to be precise and never paraphrase, repeated once at the start and once again at the end of the prompt

<details>
<summary>Answer & explanation</summary>

**B)** For long-document tasks Anthropic recommends having Claude quote the relevant parts of the documents first and then do the task, which focuses it on the right passages and makes each conclusion checkable against the text. Moving the request above the contract reverses the documented order of long material on top and the query at the end. Page-by-page requests break the definitions and cross-references that span sections. Repeating an exhortation to be precise does not change which passages the model works from.

*Hint if stuck: Consider what intermediate output would make every conclusion checkable against the document itself.*
</details>

---

## Question 25
A developer-productivity agent built on the Claude API upgrades a service's dependencies over roughly 80 loop turns, calling read_file and run_tests. Every raw output stays in the message history even after the agent has recorded what it learned from it, and by turn 60 it re-runs checks and forgets the upgrade order the engineer gave it. What is the lightest-touch fix?

A) Clear old tool results once they are deep in the history and already used, leaving the call so it can be re-run if needed
B) Summarize the whole conversation into one paragraph after each ten turns and restart the loop from that paragraph alone
C) Raise max_tokens on each request so the model has more room to process the accumulated tool output on each turn
D) Move earlier tool outputs into the system prompt so they are treated as stable guidance rather than as message history

<details>
<summary>Answer & explanation</summary>

**A)** Anthropic describes tool result clearing as one of the safest, lightest-touch forms of compaction: once a raw result is deep in the history and its conclusion has been captured, it rarely needs to stay, and the API's context editing can clear old tool results automatically. Wholesale summarizing every ten turns blurs details the agent still needs, such as the upgrade order. max_tokens caps the output length and adds no room for input. Promoting stale output into the system prompt keeps all the noise and gives it the weight of instructions.

*Hint if stuck: Ask which earlier content has already done its job and could go without losing anything the agent still relies on.*
</details>

---

## Question 26
A utilities support agent is helping a customer read a confusing bill. Midway, the customer writes: 'Honestly, just put me through to someone.' The agent believes it can explain the bill in two more messages. What should the agent do?

A) Hand off to a human now, with a structured summary of the account, the bill question and what was explained
B) Ask the customer to confirm they really want a human, mentioning the 25-minute wait, before transferring
C) Give the two-message explanation first, since resolving it now is faster for the customer than waiting in a queue
D) Offer a discount on the next bill if the customer agrees to continue the conversation with the agent instead

<details>
<summary>Answer & explanation</summary>

**A)** An explicit request for a human is an escalation trigger that should be honoured immediately, with a structured handoff so the customer does not repeat themselves. Pushing on with the explanation, adding friction through confirmation and wait-time warnings, or bargaining to keep the customer all override a clear request.

*Hint if stuck: Some escalation triggers are not judgment calls.*
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
A hotel-booking support agent's policy lets it waive cancellation fees for documented medical emergencies. A guest asks for a waiver because a hurricane warning closed the airport; the policy says nothing about weather. The agent waived the fee, reasoning that the case is 'similar to a medical emergency'. What should its instructions say about cases like this?

A) Extend the closest matching rule when a request resembles a covered case, and note the reasoning used
B) Decline requests the policy does not mention, since a waiver outside policy is a cost to the business
C) Treat requests the policy does not cover as escalations, passing the details to a human to decide
D) Grant the waiver when the guest seems upset, since a frustrated guest is likely to complain elsewhere

<details>
<summary>Answer & explanation</summary>

**C)** A request the policy does not address is a policy gap, and the agent should hand it to a human with the facts instead of inventing coverage. Stretching a nearby rule by analogy is the agent making policy, flatly declining applies a rule nobody wrote, and the guest's mood does not tell the agent whether a waiver is allowed.

*Hint if stuck: Notice who wrote the weather rule the agent just applied.*
</details>

---

## Question 29
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

## Question 30
A home-internet support agent has walked a customer through router restart, cable checks and a firmware reset. Each step reports the same failure, and the agent has no further troubleshooting tools. The customer remains calm and patient. What should the agent do next?

A) Escalate to a human technician with the steps tried and their results, since the agent is no longer making progress
B) Repeat the troubleshooting sequence once more, since intermittent faults sometimes clear on a second attempt
C) Keep the conversation open and ask the customer to try again in an hour, since the customer is not upset
D) Suggest the customer buy a new router, since the router is the most common cause of persistent failures

<details>
<summary>Answer & explanation</summary>

**A)** Lack of progress is a valid escalation trigger regardless of the customer's mood, and the handoff should carry what was tried. Repeating the same steps or deferring keeps the customer stuck, and recommending a purchase is a guess outside the agent's diagnostic evidence.

*Hint if stuck: Ask what has changed, and what has not, across the last three troubleshooting steps.*
</details>

---

## Question 31
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

## Question 32
An engineer tells Claude Code: 'Add caching to the user service.' The service has three plausible layers to cache (HTTP responses, database queries, a computed permissions map) and the choice changes invalidation behaviour substantially. The session is interactive. What should Claude do?

A) Pick the database-query layer, since it is usually the safest place to cache, and note the choice in the commit message
B) Implement caching at the three layers behind feature flags so that the engineer can choose afterwards in production
C) Ask the engineer which layer they intend, briefly naming the options and the invalidation trade-off for each
D) Write an analysis document of the three options and wait for the engineer to read it before making any change

<details>
<summary>Answer & explanation</summary>

**C)** When a request has several valid readings with materially different consequences and a human is available, a short clarifying question resolves the ambiguity cheaply. Guessing a layer risks rework, building all three adds complexity no one asked for, and a full analysis document is heavier than needed when a quick question will do.

*Hint if stuck: How costly is a wrong guess compared with one short question?*
</details>

---

## Question 33
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

## Question 34
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

## Question 35
A bank's support agent escalates every refund above $100 to a human, even though the documented policy authorises the agent to refund up to $250 for duplicate charges. Queue times have doubled. Leadership asks the architect to reduce escalations without adding risk. What should change?

A) Tell the agent in the prompt to be more confident and avoid escalating unless it really is necessary
B) Align criteria with policy: resolve duplicate-charge refunds up to $250, escalate above that or outside it
C) Raise the escalation threshold to $500 for each refund type so the agent handles more refunds on its own
D) Add a sentiment check so the agent escalates refunds over $100 when the customer seems upset

<details>
<summary>Answer & explanation</summary>

**B)** The agent is escalating cases the policy already covers, so the fix is criteria that match the policy's actual limits. A general push for confidence is vague, a blanket $500 threshold exceeds what policy authorises and adds risk, and sentiment has nothing to do with whether a refund is within authority.

*Hint if stuck: Over-escalation is also a criteria problem.*
</details>

---

## Question 36
A Claude Code session is asked to 'clean up the old feature flags.' It finds 14 flags, 3 of which are also named in an external config service whose usage Claude cannot inspect. The engineer is available in the terminal. What should Claude do?

A) Remove the 14 flags, since the request said to clean up old flags and the config service is not in the repository
B) Remove none of the flags and write a report instead, since any uncertainty means the whole task should go back to the engineer to decide
C) Remove the 11 flags it can verify as unused and ask the engineer about the 3 referenced by the external config service
D) Remove the 3 externally referenced flags first, since those are the oldest and most likely to be the ones intended

<details>
<summary>Answer & explanation</summary>

**C)** Claude should complete the unambiguous part and ask about the specific items it cannot verify, which keeps progress while avoiding a risky guess. Deleting everything ignores a real unknown, refusing everything wastes the clear work, and prioritising the uncertain flags inverts the risk.

*Hint if stuck: Separate what is clear from what is genuinely uncertain.*
</details>

---

## Question 37
A research system is compiling a report on Meridian Logistics' safety record. The search subagent returns findings for two companies with that name, a US trucking firm and a UK freight forwarder, and the coordinator cannot tell from the brief which one the user means. What should it do?

A) Merge the findings from both companies into one profile, since together they give the fullest picture
B) Keep the company with more search results, since it is most likely the one the user had in mind
C) Report on the US firm, since the brief was written in US English and that firm has the larger fleet
D) Ask the user which company is meant, giving a distinguishing detail for each, before going on

<details>
<summary>Answer & explanation</summary>

**D)** Two entities matching one name is an ambiguity the system cannot settle from what it has, so it should ask for an identifier, such as the country, before researching further. Merging produces a profile of a company that does not exist, and choosing by result count or by spelling is a guess that could point the whole report at the wrong firm.

*Hint if stuck: When the evidence fits two different targets, think about who holds the information that settles it.*
</details>

---

## Question 38
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

## Question 39
A broadband support agent's prompt says 'escalate to a human if you are not making progress.' Logs show chats where it calls run_line_test, gets the same failure, suggests another router restart and repeats this cycle for 25 turns before the customer gives up. The team wants escalation in these cases to happen reliably. What should they change?

A) Rewrite the instruction in capitals marked IMPORTANT, and add that the agent must count its own attempts before each reply
B) Track repeated identical tool failures in code and hand the chat to a human with the steps tried once a set limit is hit
C) Have the agent rate its own progress from 0 to 10 after each turn and escalate automatically whenever the score drops below 4
D) Escalate when a sentiment model detects rising frustration, since customers stuck in these loops eventually become annoyed

<details>
<summary>Answer & explanation</summary>

**B)** No progress is a valid escalation trigger, but a prompt-only rule fails at some rate, and here the model is clearly not applying it. Detecting the loop from observable facts in code (the same tool failing the same way, again and again) and handing off with what was tried makes the trigger dependable. Louder wording is still a prompt rule. Self-rated progress is poorly calibrated; the agent apparently believes each restart might help. Sentiment measures mood, not progress, and fires late or never for patient customers.

*Hint if stuck: When a rule must fire every time, ask what can observe the situation without relying on the model's own judgment.*
</details>

---

## Question 40
A research app built on the Agent SDK runs interactively: a coordinator spawns subagents through the Agent tool. When a subagent hits a fork only the user can settle (for example, whether 'battery costs' means cell or pack level), the team wants the user asked. They added AskUserQuestion to the subagent's tools, but no question ever reaches the user. Under current Agent SDK docs, what is the right design?

A) Run the subagent with bypassPermissions so its AskUserQuestion calls skip the approval flow and are shown to the user directly
B) Tell the subagent to pick the most common interpretation and continue, since subagents are meant to finish without stopping
C) Have the subagent return the open choice and what depends on it, and let the coordinator ask the user and re-dispatch the task
D) List AskUserQuestion in the coordinator's allowedTools too, so the subagent's calls are pre-approved and reach the user

<details>
<summary>Answer & explanation</summary>

**C)** The SDK docs list a limitation: AskUserQuestion is not currently available in subagents spawned through the Agent tool. Clarifying questions therefore belong to the main agent, whose canUseTool callback surfaces them: the subagent reports the ambiguity and the options, the coordinator asks, then sends a new task with the answer. A permission mode doesn't make an unavailable tool available, and neither does pre-approving it on the coordinator. Guessing silently is the behaviour the team is trying to avoid.

*Hint if stuck: Check which agent in the hierarchy is actually connected to the person.*
</details>

---

## Question 41
A team's Claude Code setup tells Claude to 'always confirm with the developer before choosing between approaches.' Developers now get asked whether to name a variable count or total, whether to put a helper above or below its caller, and whether to add a test, which they always want. They still want questions when a choice really matters. How should the instruction change?

A) Remove the instruction and deny AskUserQuestion, so Claude decides everything itself and developers review the diff
B) Ask Claude to state its confidence in each choice and ask the developer just when its confidence is below 70 percent
C) Require plan mode for each task, so the choices come up at once in a plan the developer approves before any edits
D) Ask only when valid options lead to materially different results the code and context can't settle; otherwise pick and say why

<details>
<summary>Answer & explanation</summary>

**D)** Clarifying questions pay off when several options are valid, their outcomes differ materially (behaviour, data, public APIs, invalidation) and the answer can't be found in the repo or conversation. Trivial or already-settled choices should be made with the assumption stated. Banning questions brings back silent guesses on choices that matter. Self-reported confidence is poorly calibrated, so it makes a weak gate. Plan mode on every task adds overhead to small changes and still doesn't say which choices deserve a question.

*Hint if stuck: Think about what makes a question worth interrupting a developer for.*
</details>

---

## Question 42
An internal platform agent on the Claude API has tools to read and edit repositories and CI config. Engineers ask things like 'why is the staging build so slow?' and the agent goes ahead and rewrites shared pipeline files, which nobody asked it to change. When engineers say 'speed up the staging build', they do want edits. What system-prompt guidance fits best?

A) Tell it that when intent is unclear it should investigate and recommend, and edit only when the request clearly asks for changes
B) Tell it to estimate a confidence score that edits are wanted, and to edit whenever that score is above 0.8 and explain otherwise
C) Tell it to ask the engineer for confirmation before every tool call, reads included, so nothing happens without approval
D) Tell it to infer the most useful likely action by default and make changes rather than merely suggest them, using tools to fill gaps

<details>
<summary>Answer & explanation</summary>

**A)** Anthropic's prompting guide shows two opposite defaults. For an agent that should not jump into changes, it suggests: when intent is ambiguous, default to information, research and recommendations, and make edits only when explicitly asked. The default-to-action prompt is the opposite and would make this worse. A self-rated confidence threshold is not a calibrated signal. Confirming every call, even reads, buries engineers in prompts and treats a clear 'speed it up' the same as a question.

*Hint if stuck: The agent must tell an inquiry from an instruction. What should it fall back on when it can't?*
</details>

---

## Question 43
A billing support agent escalates to humans whenever a sentiment classifier marks a customer as angry, so venting customers with simple fixes wait an hour in the human queue. Meanwhile customers who type "I want to talk to a real person" are told the agent can solve it and are kept in the chat for several more turns. Which changes should the team make? (Choose two.)

A) Raise the sentiment threshold so the angriest customers are escalated and the rest stay with the agent
B) Hand off right away when a customer asks for a human, instead of first trying to resolve the issue
C) Escalate when the agent's self-rated confidence in its answer drops below 0.7 on any turn of the chat
D) Ask customers who request a human to confirm twice, so handoffs happen when they really mean it
E) Base escalation on written criteria with examples, such as policy gaps or no progress, not on sentiment

<details>
<summary>Answer & explanation</summary>

**B, E** An explicit request for a human should be honoured immediately. Anger says little about whether the agent can solve the problem, so escalation should follow explicit criteria (policy gaps, requests outside its authority, no progress) illustrated with examples. A higher sentiment threshold is still the wrong signal, self-rated confidence is poorly calibrated, and making customers confirm twice ignores the request they already made.

*Hint if stuck: Ask which signals actually tell you the agent cannot or should not continue, and whose stated wishes outrank the agent's plan.*
</details>

---

## Question 44
A telecom support agent identifies callers by name. When a lookup on "J. Patel" returned three accounts, it picked the one with the most recent activity and discussed that account's bill, which belonged to someone else. In another chat a customer asked for a match on a competitor's price; the written policy covers only price drops on the company's own plans, and the agent invented a 10% credit. Which changes should the team make? (Choose two.)

A) Let the agent grant credits up to 10% on requests the policy doesn't cover, so customers aren't kept waiting
B) Act on one of the matched accounts once the agent rates its confidence in that match at 0.9 or above
C) When a lookup returns several accounts, ask the caller for another identifier, such as the account number
D) Escalate requests that the policy doesn't cover to a human with a summary, rather than making up an offer
E) Escalate to a human whenever a lookup returns more than one account, so that no agent guesses at identity

<details>
<summary>Answer & explanation</summary>

**C, D** Several matches mean the agent lacks information the customer can supply, so it should ask for an identifier rather than guess or hand off. A request the policy doesn't cover is a policy gap: the agent lacks authority, so it should escalate with a summary instead of inventing terms. Escalating every multi-match sends a question the agent could settle in one message to a human queue. A standing credit allowance is a business decision the team hasn't made, and it still lets the agent improvise. Self-rated confidence is a poor signal, and any guess at identity risks disclosing someone else's account.

*Hint if stuck: For each case, ask what the agent is missing, information or authority, and the cheapest way to get it.*
</details>

---

## Question 45
A team's CLAUDE.md says "check with the developer before any change." Developers complain that Claude stops to ask before editing the files it was asked to change and before running tests. Yet last week, while cleaning up branches, Claude force-pushed to a shared branch and deleted two remote branches without asking. Which changes fit? (Choose two.)

A) Replace the line with guidance to go ahead on local, reversible work and ask before hard-to-undo actions
B) Deny the AskUserQuestion tool so that Claude stops asking questions and decides each step on its own
C) Remove the line and start sessions in bypassPermissions mode so routine edits and tests stop prompting
D) Keep the line and use plan mode for each task, so that each change is approved before Claude starts
E) Add permission ask rules for git push --force and deleting remote branches, so each needs approval

<details>
<summary>Answer & explanation</summary>

**A, E** Anthropic's guidance is to encourage local, reversible actions such as edits and test runs and to ask before actions that are destructive, hard to reverse or affect shared systems, such as force-pushes and branch deletion. Because a prompt is advisory, ask rules in the permission settings make those specific commands prompt every time. bypassPermissions removes the very safeguards the force-push needed. Plan mode for every task adds approval overhead to routine edits. Denying AskUserQuestion stops all questions, including the ones that matter.

*Hint if stuck: Sort the actions by how easily they can be undone, and decide which safeguards can rest on a prompt alone.*
</details>

---

## Question 46
A billing agent processes a plan downgrade in three tool calls: refund the prorated amount (done), cancel the add-on (done), and apply the new plan (not yet called). Before the third call, the customer writes: 'Stop. Get me a person.' What should the agent's design have it do?

A) Apply the new plan first so the account ends up consistent, then transfer the customer with a short note attached
B) Start no further steps, hand off now, and state in the summary which steps finished and which are pending
C) Reverse the refund and the add-on cancellation so nothing is half-done, then transfer the customer to a person
D) Ask the customer to confirm they want to abandon the downgrade before transferring, so the final state is clear

<details>
<summary>Answer & explanation</summary>

**B)** An explicit request for a human is honoured right away, and the handoff has to be structured so the person taking over can act safely: here that means stating exactly where the multi-step change stopped, so they can complete or reverse it with the customer. Finishing the last step overrides the customer's instruction and takes a further account action without them. Rolling back on its own takes more hard-to-reverse actions, such as clawing back a refund, that nobody asked for. A confirmation round delays an escalation the customer has already requested.

*Hint if stuck: Weigh honouring the request promptly against leaving the next person able to act on the account safely.*
</details>

---

## Question 47
A bank's support-agent team proposes escalating to humans whenever a sentiment classifier scores the customer below -0.6. In pilot, a furious customer demanding a routine card replacement is escalated within one turn, while a calm customer methodically describing unauthorized wire transfers totaling $18,400 is never escalated. What should the architects conclude?

A) The sentiment threshold is miscalibrated; retrain the classifier on banking-domain transcripts and tune the cutoff
B) Sentiment should be combined with message length and punctuation features to better approximate customer urgency
C) Sentiment measures emotion, not case complexity; switch to triggers like policy gaps, no-progress loops, and explicit requests
D) Both cases warrant escalation: lower the threshold further so calm-but-serious customers also cross the cutoff

<details>
<summary>Answer & explanation</summary>

**C)** Sentiment is an unreliable escalation trigger because emotional tone does not correlate with case complexity or risk — the calm fraud victim is the proof. Retraining or tuning thresholds patches a proxy that measures the wrong thing entirely; reliable triggers are observable case properties such as policy gaps, no-progress loops, and explicit human requests.

*Hint if stuck: Ask what the signal actually measures versus what escalation is supposed to detect.*
</details>

---

## Question 48
A platform team builds an internal scaffolding agent with the Agent SDK, passing tools ['Read', 'Glob', 'Grep', 'Write'] and a canUseTool callback that shows write approvals to the engineer. Asked to 'add caching to the orders service', where an in-process cache and a shared Redis cache are both valid, it silently picks one, and engineers often redo the work. The team wants it to ask when several approaches are valid. What should they change?

A) Tell Claude to end its turn with a plain-text question whenever it is unsure which of several approaches to take
B) Delegate design choices to a subagent that calls AskUserQuestion, so the main agent's context stays free of the back-and-forth
C) Register a PreToolUse hook that denies each Write until an engineer approves a plan in a separate review tool
D) Add AskUserQuestion to the tools list and handle it in canUseTool by showing the options and returning the answers

<details>
<summary>Answer & explanation</summary>

**D)** In the Agent SDK, Claude asks clarifying questions by calling AskUserQuestion, which fires the canUseTool callback; your code shows the multiple-choice options and returns the selections as answers. When you pass an explicit tools array, AskUserQuestion has to be in it, which is why this agent never asks. A plain-text question ends the run instead of pausing it for an answer. AskUserQuestion is not currently available in subagents spawned through the Agent tool. Blocking every write adds friction to all edits without letting Claude ask the specific question.

*Hint if stuck: Look at what the agent is allowed to do: can it currently pause and put a choice in front of the engineer at all?*
</details>

---

## Question 49
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

## Question 50
A returns agent escalates 35% of its chats to humans, and most are routine, such as refund-status questions well inside policy. Its system prompt says only: 'Escalate whenever the situation is complex or the customer is unhappy.' Human agents are swamped, and leadership asks for a prompt fix that keeps escalation for the cases that need it. What change works best?

A) Write explicit criteria with the reason behind them, plus examples of cases to escalate and cases to resolve
B) Add 'CRITICAL: escalate sparingly and as a last resort' at the top of the prompt so the model takes the rule seriously
C) Have the agent rate its own confidence from 1 to 10 and escalate when that self-rating falls below five
D) Add a sentiment classifier and escalate once the customer's measured frustration passes a set threshold

<details>
<summary>Answer & explanation</summary>

**A)** Vague triggers like 'complex' or 'unhappy' leave the boundary to guesswork, so the fix is explicit criteria (policy gaps, explicit requests for a human, no progress) with the reason for them and a few diverse examples, including near-boundary cases the agent should resolve itself. Anthropic's guidance is that explained instructions generalize better and that examples should cover edge cases. Shouting in capitals changes the tone, not the boundary, and can make newer models overcorrect. Self-rated confidence and sentiment are poor escalation signals: an annoyed customer with a routine refund question does not need a human.

*Hint if stuck: Ask what the model would need in order to tell a routine case from a real handoff case it has never seen before.*
</details>

---

## Question 51
A research coordinator launches three background subagents (patents, papers, market data) and keeps drafting. The papers subagent ends on a usage-limit API error after covering 2019–2022 of its 2019–2025 range; the completion notification marks it failed, names the error, and includes its last output. How should the coordinator handle this?

A) Discard the partial output and launch a fresh subagent for the full 2019–2025 range at once, while the limit is still active
B) Treat the returned output as that subagent's final answer, since a background subagent reports once its work is done
C) Keep the 2019–2022 findings, mark 2023–2025 as not covered and why, and resume that subagent once the limit clears
D) Abort the whole run and restart the three subagents later, so the report is not built from mixed complete and partial work

<details>
<summary>Answer & explanation</summary>

**C)** When a background subagent ends on an API error, it is marked failed and the notification names the error and carries its last output so partial work is not lost; once the error clears it can be retried or resumed with its history intact. The coordinator should keep the partial results, record the uncovered years as a gap, and recover that piece. Relaunching at once throws away finished work and hits the same limit. Treating the output as final hides the gap, because a failed notification is not a completion. Aborting everything is the kill-the-workflow anti-pattern.

*Hint if stuck: Separate what the failed worker already delivered from what is still missing, and ask what each part needs.*
</details>

---

## Question 52
A support agent's refund tool calls a payments API that occasionally times out. Today the tool returns the text 'Error' and the agent tells customers the refund failed, even when a retry a second later would succeed. How should the tool report this failure to the agent?

A) Raise an unhandled exception in the tool so the agent loop crashes and the on-call engineer gets alerted
B) Return a success message anyway, since the payment usually goes through after a short delay on the provider side
C) Return a tool result marked is_error with the error category (timeout), whether it is retryable, and what was attempted
D) Keep returning 'Error', but tell the agent in its system prompt to retry every failed tool call twice before telling the customer

<details>
<summary>Answer & explanation</summary>

**C)** A tool result flagged with is_error and an informative message, including category and retryability, lets the agent decide sensibly whether to retry or escalate. Reporting false success misleads the customer, crashing the loop turns a transient error into an outage, and a blanket retry instruction treats every error the same.

*Hint if stuck: The agent can only reason about an error it can actually read.*
</details>

---

## Question 53
A coordinator runs eight analysis subagents for a quarterly competitor report. One subagent fails after its two retries on a data provider outage. The current orchestrator aborts the entire run on any subagent failure, and the report is due in an hour. What is the better design?

A) Keep aborting on any failure, because a report with missing sections is worse than no report
B) Continue with the seven results and let the synthesis subagent fill the missing section from its general knowledge
C) Restart the eight subagents from the beginning, since the outage may also have corrupted the seven completed runs
D) Continue with the seven results, record the failed segment and its cause, and mark that coverage gap in the report

<details>
<summary>Answer & explanation</summary>

**D)** The coordinator should use what succeeded and annotate the synthesis with the coverage gap and its cause, so readers know what is missing. Aborting or restarting everything wastes seven good results, and having synthesis fill the gap from general knowledge presents unsourced content as research.

*Hint if stuck: Ask what readers of the report need to know about the analysis that did not finish.*
</details>

---

## Question 54
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

## Question 55
A web-search subagent in a research system hits a site that returns HTTP 429 on its first request. It currently passes the raw 429 back to the coordinator, which then reassigns the whole topic to a different subagent that hits the same site. What is the better division of responsibility?

A) The coordinator should handle each HTTP error itself, since it has the broadest view and can reassign topics
B) The subagent retries transient errors locally with backoff and escalates if they persist, with what it tried and found
C) The subagent should silently skip the site and return whatever it found elsewhere without mentioning the skip
D) Both agents should ignore rate limit errors, since they are transient and will resolve themselves eventually

<details>
<summary>Answer & explanation</summary>

**B)** Transient errors are best absorbed locally where the context is, and only unresolved failures should go up with what was attempted and any partial results. Pushing every HTTP error to the coordinator overloads it and leads to blind reassignment, silently skipping hides a gap, and ignoring rate limits leaves the data missing.

*Hint if stuck: Recover where you can, report what you cannot.*
</details>

---

## Question 56
A CI pipeline uses three Claude Code subagents: lint-review, security-review and test-generation. The security subagent fails because the SAST tool it relies on is not installed in the runner image. The pipeline currently posts the other two reviews with a green check and no mention of security. What should change?

A) Mark the whole pipeline as failed and post no review comments at all until the runner image is fixed
B) Have the lint-review subagent take over security checks with a prompt telling it to look for vulnerabilities
C) Post the other two reviews and add a clear note that the security review did not run, why, and how to fix it
D) Leave the behaviour as is, since the security tool missing is an infrastructure problem and not a review problem

<details>
<summary>Answer & explanation</summary>

**C)** The results that succeeded are still useful, but a missing security review must be visible so nobody reads the green check as a clean security pass. Failing the whole pipeline throws away good reviews, silently substituting a lint reviewer pretends to coverage it lacks, and staying silent is exactly the hidden failure to avoid.

*Hint if stuck: A missing check that looks like a passing check is the worst outcome.*
</details>

---

## Question 57
A coordinator's synthesis step merges results from five regional market subagents. Two returned partial data: one reached 3 of its 5 sources, another hit a paywall on its main source. The draft report presents all five regions with equal confidence. What should the synthesis output do?

A) Present the five regions the same way, since showing uncertainty would undermine the reader's trust in the report
B) Drop the two partial regions from the report so that each section presented is fully supported
C) Re-run the two partial subagents repeatedly until they reach full coverage, delaying the report until then
D) Annotate the affected sections with what coverage was missing and why, so readers can weigh those findings

<details>
<summary>Answer & explanation</summary>

**D)** Synthesis should carry coverage gaps forward as annotations so readers know which conclusions rest on incomplete data. Presenting everything as equally solid hides the gap, dropping regions discards useful partial findings, and retrying indefinitely cannot get past a paywall.

*Hint if stuck: Ask what a reader would need in order to weigh a section built on thinner evidence.*
</details>

---

## Question 58
A developer-productivity agent delegates 'find all callers of deprecated function parseLegacy' to a subagent that uses a code-search MCP server. The server times out on one of four repositories, and the subagent reports '12 callers found.' The engineer deletes the function and breaks a service in the fourth repository. What should the subagent have returned?

A) The count from the three repositories searched, plus an explicit note that the fourth timed out and was not searched
B) The same count but with a footnote recommending the engineer double-check the result before acting on it
C) Nothing until the four repositories had been searched, waiting and retrying for as long as it took to finish
D) An estimated total for the four repositories, extrapolated from the average across the three it did search

<details>
<summary>Answer & explanation</summary>

**A)** The subagent should report the partial result together with the specific gap, so the caller knows the count does not cover the fourth repository. A vague double-check footnote does not say what is missing, waiting indefinitely blocks the engineer and may never finish, and an estimate presents a guess as a search result.

*Hint if stuck: A partial answer is fine; an unlabelled partial answer is not.*
</details>

---

## Question 59
An invoice-processing coordinator sends each document to an extraction subagent. When a vendor's PDF is password-protected, the subagent returns a JSON record with every field null and status 'ok'. Finance later finds 60 invoices that were never paid. Which change fixes the root cause?

A) Add a downstream check that flags records with more than half their fields null for later manual review
B) Return status 'error' with type 'document_locked' and the document id, so the coordinator can route it
C) Add a prompt to the subagent telling it to try harder to read protected PDFs before it gives up on them
D) Have the coordinator re-send every all-null record to the subagent a second time before accepting it

<details>
<summary>Answer & explanation</summary>

**B)** The subagent knows exactly why it failed, so it should say so with a typed error that the coordinator can route, instead of disguising the failure as a successful empty record. A downstream null-count heuristic guesses at what the subagent already knew, trying harder cannot open a locked file, and resending gets the same result.

*Hint if stuck: The component that knows why it failed should be the one to say so.*
</details>

---

## Question 60
A research coordinator receives a structured failure from a subagent: type 'source_unavailable', tried 'SEC EDGAR full-text search', partial results for 2021 to 2023 only, suggested alternative 'company investor-relations pages'. What is the coordinator's best next move?

A) Discard the partial results and rerun the whole task on a fresh subagent with the same instructions for one consistent dataset
B) Pass the failure message straight to the end user and ask them how they would like the research to proceed
C) Spawn a follow-up subagent targeted at the missing years via the suggested alternative source, and keep the partial results
D) Accept the partial results as complete and let the synthesis step proceed without mentioning the missing years

<details>
<summary>Answer & explanation</summary>

**C)** Structured error context exists so the coordinator can recover intelligently: keep what worked and target the gap with the suggested alternative. Restarting with the same instructions repeats the failure and wastes good data, bouncing it to the user abandons a recovery the system can do itself, and treating partial data as complete hides the gap.

*Hint if stuck: Use every field the failure report gave you.*
</details>

---

## Question 61
A support coordinator agent delegates order lookups to a subagent. When the order database is down, the subagent's error says only 'lookup failed', and the coordinator tells the customer 'I couldn't find your order.' The customer panics, thinking the order is lost. How should the error contract be redesigned?

A) Have the subagent tell the customer directly what went wrong, bypassing the coordinator whenever an error occurs
B) Have the subagent retry the database for up to ten minutes before responding, so transient outages do not reach the customer
C) Have the coordinator say 'please try again later' for any lookup error, whatever the underlying cause
D) Distinguish 'order not found' from 'database unavailable' in the error type, so the coordinator can respond correctly

<details>
<summary>Answer & explanation</summary>

**D)** A valid empty result and an access failure lead to different customer messages and next steps, so the error contract must distinguish them. Bypassing the coordinator breaks hub-and-spoke control, a generic try-later message is wrong when the order truly does not exist, and a long blocking retry leaves the customer waiting with no update.

*Hint if stuck: Ask what the coordinator would need to know to choose the right thing to tell the customer.*
</details>

---

## Question 62
A coordinator receives structured errors from subagents with fields for type, attempted actions, partial results and alternatives. To 'keep the context clean', a developer proposes that the coordinator log errors to a file and only pass a count of failed subagents into synthesis. What is the main problem with this proposal?

A) Synthesis loses which topics failed and why, so it cannot annotate coverage gaps and the report will look complete
B) Logging to a file is slower than keeping errors in memory, which will noticeably increase the run's latency
C) The count of failures could exceed the context window when many subagents fail during a very large run
D) The coordinator can no longer retry transient failures, because its retry logic needs the error details now kept only in the log

<details>
<summary>Answer & explanation</summary>

**A)** A bare count tells synthesis something failed but not what, so it cannot mark which sections are incomplete, and the report reads as complete coverage. Logging latency and context size are minor here, and retries are not driven by the log file. Keeping errors lean is fine, but the topic and cause of each gap must reach synthesis.

*Hint if stuck: Ask what someone reading the finished document would be unable to tell.*
</details>

---

## Question 63
A Claude Code session spawns a subagent to run a database migration dry-run. The subagent's run is cut short by an API error midway. The engineer wants the main session to handle this sensibly rather than assume success. What should the main session do with the subagent's outcome?

A) Treat the dry-run as successful if the subagent produced any output before the error interrupted it
B) Treat the outcome as incomplete, inspect what partial output exists, and re-run or report the gap rather than proceed
C) Proceed straight to the real migration, since a dry-run failure does not mean the real migration will fail too
D) Abandon the whole session and start over from scratch, because any subagent error makes the session's state unreliable

<details>
<summary>Answer & explanation</summary>

**B)** An interrupted subagent yields partial results, and the parent should treat them as incomplete: check what exists and re-run or surface the gap instead of assuming success. Counting any output as success or proceeding to the real migration ignores the missing verification, and abandoning the session discards useful state over a recoverable error.

*Hint if stuck: Ask what an interrupted run actually proves about the thing it was meant to check.*
</details>

---

## Question 64
A news-monitoring research system has a subagent that, when a source fails to load, quietly replaces it with the next search result so it always returns five sources. Reports look complete, but editors find that some cited sources are weaker substitutes for the ones requested. What is the best change?

A) Keep substituting sources, but ask the subagent to choose substitutes from a list of reputable outlets only
B) Stop substituting and abort the subagent's whole task whenever any single source fails to load properly
C) Have the subagent report the failed source and what it substituted, so the coordinator and readers can see the swap
D) Raise the number of sources per subagent to ten, so a few failures do not affect the overall report quality

<details>
<summary>Answer & explanation</summary>

**C)** Silent substitution hides a failure behind a result that looks normal; the subagent should report the failure and any fallback explicitly so it can be weighed. A reputable-outlets list still hides the swap, aborting on any failure discards good sources, and fetching more sources does not make the substitutions visible.

*Hint if stuck: A workaround can be fine; hiding it is not.*
</details>

---

## Question 65
An architect reviews an orchestration framework with two opposite failure policies across teams: one swallows every subagent exception and continues, the other terminates the whole workflow on the first exception. The architect must write one policy for both. Which policy should it be?

A) Terminate the workflow on the first unhandled exception and report it, so no output is ever built on incomplete subagent results
B) Catch every exception inside the subagent, log it, and return an empty result so the coordinator always receives a well-formed reply
C) Retry each failed subagent up to three times inside the framework, then drop it and let synthesis proceed with whatever has arrived
D) Retry transient failures locally, return the rest as structured errors with context, and let the coordinator decide and note the gaps

<details>
<summary>Answer & explanation</summary>

**D)** Recovering transient errors where they happen and passing unresolved ones up as structured errors gives the coordinator what it needs to reroute, accept partial results or record a gap. Terminating on the first exception throws away every good result. Catching everything and returning empty results disguises access failures as valid empty answers. Retrying then silently dropping a subagent still hides the gap from synthesis and readers.

*Hint if stuck: Ask who is best placed to judge what one broken piece means for the whole run.*
</details>

---

## Question 66
A support agent on the Claude API often requests three tools in one turn: get_order, get_shipment and get_refund_status. When the refund service throws an exception, the loop code sends back only the two successful tool_result blocks, and the API rejects the next request with a 400 error about tool_use ids without results. How should the loop handle the failed call?

A) Send back the two successful results and add a text block before them explaining that the refund lookup failed this time
B) Return the three results in one user message, the failed one marked is_error with a short note on what went wrong
C) Retry the whole batch of three calls until each succeeds, then send the results back to the model together
D) Return each result in its own user message, with the failed refund result placed last, so Claude can handle the error separately

<details>
<summary>Answer & explanation</summary>

**B)** Every tool_use block needs a matching tool_result, all in the next user message, with tool_result blocks before any text. A failed call gets its own tool_result with is_error set and an instructive message, so Claude can retry, try another route or tell the customer accurately. Leaving a result out is what triggers the 400, and text placed before tool results breaks the ordering rule. Retrying the whole batch repeats calls that already worked and can stall on an outage. Splitting results across messages is a pattern the docs say teaches Claude to stop making parallel calls.

*Hint if stuck: Every request the model made is owed a reply, even an unhappy one.*
</details>

---

## Question 67
A research coordinator fans out 12 subagents per report, and most of them query the same patent database. During an outage, each subagent retries five times with backoff and then returns a structured error marking the source unavailable, so every report now takes 40 minutes longer and the database owner complains about the retry storm. How should error handling change?

A) Raise each subagent's retry count and backoff ceiling, so the subagents keep trying until the database recovers mid-run
B) Have subagents skip the patent database silently whenever a call fails, so reports finish on time from the other sources
C) Once the first structured error marks the source down, have the coordinator tell other subagents to skip it and record the gap
D) Abort the whole report as soon as any subagent reports the outage, and rerun everything once the database is back up

<details>
<summary>Answer & explanation</summary>

**C)** Structured errors exist so the coordinator can act on them. After one subagent reports a non-transient outage, the coordinator knows something the others don't: it should stop sending work at that source (or point it at an alternative) and annotate the report with the missing coverage. More retries make the storm and the delay worse. Silent skipping hides the gap from readers. Aborting throws away all the work that doesn't depend on the patent database.

*Hint if stuck: One subagent's failure is information the others could use. Who is in a position to share it?*
</details>

---

## Question 68
A research subagent built on the Claude API works through a 60-step investigation. The orchestration code wraps every tool call, and when any call raises an exception (a timeout from one site, a parse error on one PDF) it kills the subagent and starts it again from step one. Runs often never finish. What change follows Anthropic's guidance for agents whose errors compound?

A) Have the subagent pre-check each site and file before it starts and drop any that fail, so no call can raise an error mid-run
B) Keep restarting on failure but lower the temperature, so each fresh run takes the same path and is less likely to hit errors
C) Catch each exception and return an empty tool result instead, so the subagent carries on without being distracted by failures
D) Return the failure to the subagent as an is_error result so it can adapt, and resume crashed runs from saved progress

<details>
<summary>Answer & explanation</summary>

**D)** Anthropic's multi-agent write-up notes that agents are stateful and errors compound, so restarting from the beginning is costly. Letting the agent know a tool is failing and allowing it to adapt works well, combined with deterministic safeguards such as retries and checkpoints so a real crash resumes from where it was. Lower temperature doesn't stop sites from timing out. Empty results disguise failures as valid answers. Pre-checks can't predict failures that happen later in the run, and they drop sources needlessly.

*Hint if stuck: Consider who is best placed to work around one failed step, and what a restart throws away.*
</details>

---

## Question 69
A research coordinator sends a literature-search subagent to three databases. One database times out; the subagent catches the timeout and returns an empty list for it, the same shape as 'no studies found'. The final report then states that no trials of the drug have been published, though that database holds most of them. Which changes should the team make? (Choose two.)

A) Have the subagent return a structured failure: the source, the error type, the query tried, partial results
B) Drop the results from the other two databases whenever one fails, so the report rests on complete data
C) Abort the whole research run whenever a subagent hits an error, so no partial report gets produced
D) Have the final report name the sources that could not be searched instead of claiming no studies exist
E) Have the subagent retry the timed-out database quietly until it answers, however long that may take

<details>
<summary>Answer & explanation</summary>

**A, D** An access failure dressed up as an empty result is indistinguishable from a real 'none found', so the subagent must report what failed, what it tried and what it did get, letting the coordinator retry or route around it. The synthesis should annotate the coverage gap rather than turn missing data into a claim. Killing the whole run and silently retrying forever are both anti-patterns, and discarding the good results throws away valid work.

*Hint if stuck: Ask how the coordinator could ever tell 'nothing exists' apart from 'we couldn't look', and what the reader should be told.*
</details>

---

## Question 70
A three-stage extraction pipeline (OCR, field extraction, normalisation) feeds a payments system. When the normaliser crashes on a document, it writes null for the affected fields and moves on. Downstream, null means "not stated in the source", so those invoices are paid with no late-fee terms applied. About 3% of documents are affected. Which changes fix the error handling? (Choose two.)

A) Fail the whole nightly batch when any document errors, so no partial output reaches the payments system
B) Carry a status for each field, such as extracted, not_in_source or processing_error, through each stage
C) Route documents with processing errors to a retry-and-review queue instead of passing them downstream
D) Fill fields that failed with the most common value seen across other documents from the same supplier
E) Drop documents that fail from the batch output, so the payments system receives just clean records

<details>
<summary>Answer & explanation</summary>

**B, C** A processing failure is not the same as a field the source never stated; an explicit status lets downstream stages tell them apart instead of treating a crash as a valid empty value. Documents that failed should go to retry and review with their error, while the other 97% continue. Failing the whole batch for 3% of documents is the kill-the-workflow anti-pattern. Filling in typical values invents data. Dropping documents silently hides the failure and leaves invoices unprocessed with no one told.

*Hint if stuck: Ask how a downstream stage can tell 'the source didn't say' from 'we never found out', and what should happen next.*
</details>

---

## Question 71
A support coordinator delegates refunds to a billing subagent whose issue_refund call sometimes times out after the payment provider has already received the request. The subagent reports only "refund failed", so the coordinator either asks it to issue the refund again, which has produced duplicate refunds, or tells the customer the refund didn't go through when it did. Which changes fix this? (Choose two.)

A) Tell the customer the refund went through whenever a timeout occurs, since most such requests complete
B) Return an empty result on timeouts so the coordinator treats the refund as one that hasn't started yet
C) Retry issue_refund inside the subagent with backoff, since timeouts are transient and clear on their own
D) Have the subagent report a timeout as outcome unknown, with the refund request ID, not as a failure
E) Have the coordinator check the refund's status by that ID before it retries or replies to the customer

<details>
<summary>Answer & explanation</summary>

**D, E** A timeout after the provider received the request means the outcome is unknown, not failed; saying so, with the request ID, gives the coordinator what it needs to find out. Checking the status first prevents both the duplicate refund and the wrong message to the customer. Blind local retry is right for transient errors on safe operations, but here it is what creates duplicates. Assuming success misinforms the customer when the refund really failed. An empty result hides the error and invites a second refund.

*Hint if stuck: Ask what is actually known after a timeout, and what must be learned before anyone acts again.*
</details>

---

## Question 72
An architect writes the error policy for a research system built on the Claude API. Search subagents call a fetch_page tool. Two failures recur: some pages return HTTP 403, and occasionally a subagent's own model request fails with an overloaded error partway through its run. Where should each failure be handled?

A) Raise the 403 as an exception that ends the subagent so the coordinator can reassign the URL to another subagent
B) Return the 403 as an is_error result the subagent can work around; retry or report the API failure in loop code
C) Return both failures as is_error tool results so the subagent's model decides how to recover from each one the same way
D) Tell subagents in their prompt to skip failed fetches and continue silently, so neither failure interrupts the research

<details>
<summary>Answer & explanation</summary>

**B)** A tool execution error belongs in a tool_result with is_error set and an instructive message, so Claude can adapt, for example by trying another source. An API error interrupts the model call itself, so the model never gets a turn to reason about it; the code running the loop must retry with backoff or report the failure, with any partial output, to the coordinator. Ending the subagent over a routine 403 discards its context and work. The model cannot receive its own failed request as a tool result. Silent skipping hides coverage gaps from synthesis.

*Hint if stuck: Ask which failure the model is actually present to see, and which one happens to the model call itself.*
</details>

---

## Question 73
In a multi-agent research system, a subagent assigned to gather regulatory filings hits a paywall it cannot bypass and returns only the string 'Task failed.' The coordinator, with no usable information, re-dispatches the identical task three times, failing identically each time. What should the subagent have returned?

A) A structured report: the paywalled source that failed, what was attempted, partial results gathered, and retryability
B) Nothing — it should keep retrying internally until its iteration cap forces termination
C) A confidence score on its partial findings so the coordinator can decide whether they are usable
D) Its full raw session transcript so the coordinator can inspect every step and diagnose the failure itself

<details>
<summary>Answer & explanation</summary>

**A)** Unresolvable failures must propagate with structured context — what failed, what was attempted, partial results, and whether retrying could help — so the coordinator can adapt by trying another source or accepting partial data instead of blind re-dispatch. A bare failure string and a raw transcript both lack actionable structure, and self-reported confidence scores are poorly calibrated.

*Hint if stuck: The coordinator can only recover as intelligently as the failure report allows.*
</details>

---

## Question 74
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

## Question 75
A research hierarchy runs filings subagent, then regional coordinator, then top-level coordinator, then report. The filings subagent returns a structured error: type auth_expired, source the filings mirror, 3 of 8 companies retrieved. The regional coordinator forwards only 'filings: unavailable', and the final report states that no filings exist for five of the companies. What should change?

A) Each layer passes the structured error upward intact, adding its own context instead of rewriting it as a status word
B) The regional coordinator retries the auth_expired error with backoff until it succeeds before reporting anything upward
C) The top-level coordinator queries the filings subagent directly whenever an upstream status reads 'unavailable'
D) The regional layer drops its error handling, and the final report simply leaves out any section with missing data

<details>
<summary>Answer & explanation</summary>

**A)** Recovery and honest reporting depend on the error's type, scope and partial results reaching whoever makes the final call, so every hop should forward the structured error and add context rather than collapse it; 'unavailable' let the access failure turn into a false claim that no filings exist. An expired credential is not transient, so retrying with backoff will not fix it and delays the report. Bypassing the middle layer patches one symptom and breaks the hierarchy's routing. Silently dropping sections hides the gap instead of annotating it.

*Hint if stuck: Trace which fact about the failure the final writer needed, and where it disappeared.*
</details>

---
