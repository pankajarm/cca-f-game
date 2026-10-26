# Practice Test 09: The Memory Halls
**D5: Context Management & Reliability** (15% of the exam) · task statements 5.1, 5.2, 5.3

55 questions. Exam pace is 2 minutes per question.

---

## Question 1
A travel-booking support agent handles rebooking conversations that often run 40 turns. Older turns are summarised to save context. Customers complain that late in the chat the agent quotes the wrong rebooking fee and forgets the fare-class waiver it promised early on. What is the best fix?

A) Summarise less often, for example every 20 turns instead of every 10, so fewer details are lost in each round
B) Disable summarisation completely and keep the full transcript, relying on the large context window to hold every turn
C) Ask the summariser prompt to be especially careful to preserve all numbers, dates and commitments when it condenses turns
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
C) Raise the coordinator's context window budget so that all six full narratives fit with plenty of room to spare
D) Place a note at the top of the synthesis prompt reminding the coordinator to look carefully for every sample size

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

A) Instruct the agent to ignore the log sections of the tool output and to focus on the job status lines only
B) Run /compact after every tool call so the verbose logs are summarised before the next turn, keeping the branch and ticket
C) Wrap the tool to return only job name, status and failing tests, plus a separate tool to fetch a log on demand
D) Restate the branch name and ticket at the start of every user message so the agent keeps seeing them

<details>
<summary>Answer & explanation</summary>

**C)** Verbose tool results crowd out the facts that matter, so trimming output to the relevant fields at the tool boundary, with on-demand detail, fixes the root cause. Telling the agent to ignore sections still loads the tokens, compacting after every call is lossy and repetitive, and restating context by hand treats the symptom.

*Hint if stuck: Control what enters the context, not just what the model pays attention to.*
</details>

---

## Question 5
A support agent keeps a case-facts block, but it is appended at the end of an ever-growing context and updated by having the model rewrite it each turn. Over long chats, the block itself starts to lose details such as the second order number. What is the most robust way to maintain it?

A) Ask the model to rewrite the block more carefully each turn and to never remove any fact it has previously recorded
B) Store the block in the first user message only, since the model reads the start of the context most reliably
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

A) Run /clear and re-explain the bug from memory, since a fresh context always beats a summarized one in quality
B) Let automatic compaction keep running, since it already judges which details matter most for the next step
C) Switch to a model with a larger context window so that compaction never has to run during this session
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
C) Ask the subagent to repeat the key finding at the start, the middle and the end of its paragraph
D) Ask the subagent to keep the paragraph format but shorten it to a maximum of four sentences overall

<details>
<summary>Answer & explanation</summary>

**B)** Leading with key findings under headers places them where they are read most reliably and makes them easy to lift into synthesis. Bolding inside dense prose and repeating the finding add noise without structure, and an arbitrary length cap may cut the very detail needed.

*Hint if stuck: Position and labels both affect what gets picked up downstream.*
</details>

---

## Question 8
An extraction agent processes a 300-email thread to build a timeline of a contract dispute. It retrieves emails via a search tool, and each result includes full headers, signatures and quoted replies. The final timeline is missing dates from the middle of the thread. Which change targets the cause most directly?

A) Ask the agent to number every email as it reads so it can confirm that none were skipped before writing the timeline
B) Ask the agent to build the timeline in two halves and then merge the halves, each with a prompt to focus on dates
C) Strip each email to sender, date, subject and new body text before it reaches the model; full text on request
D) Retrieve all 300 emails in a single tool call so the agent sees the whole thread at once in chronological order

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
A developer-productivity assistant gets its persona, coding standards, and 'never push directly to main' rules injected at the top of every user message, with each request's diff and ticket details following below. In long sessions adherence to the rules degrades, and prompt caching saves almost nothing. How should the prompt be restructured?

A) Keep the rules in the user messages but also repeat them verbatim in a final reminder line at the end of each request
B) Move the per-request diff and ticket details into the system prompt so all content shares one stable location
C) Put the stable persona, standards, and rules in the system prompt and keep only the per-request diff and ticket details in user messages
D) Compress the rules into a one-line summary so repeating them inside every user message costs fewer tokens

<details>
<summary>Answer & explanation</summary>

**C)** The system prompt is the home for stable identity, behavioral rules, and constraints, while user messages carry per-turn data, and that separation also creates the stable prefix prompt caching needs. Repeating rules in every user message duplicates tokens and mixes instructions with data, moving volatile per-request content into the system prompt would destroy the stable prefix entirely, and compressing the rules weakens them without fixing their placement.

*Hint if stuck: Stable instructions and volatile data each have a proper home in the request structure.*
</details>

---

## Question 11
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

## Question 12
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

## Question 13
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

## Question 14
A hospital intake agent keeps a structured case-facts block (allergies: penicillin; weight: 72 kg). The block was injected at turn 1, but by turn 30 it sits buried under 50k tokens of accumulated dialogue and tool results, and the agent suggests an amoxicillin prescription. The block's contents are intact and within the context window. What is the fix?

A) Add a system prompt instruction telling the model to always consult the case-facts block before any medication suggestion
B) Run /compact on the dialogue so the case-facts block becomes a larger share of the remaining context
C) Expand the block with severity codes and timestamps so it stands out more in the context
D) Re-inject the block on every request in a fixed, prominent spot under clear headers, not just at turn 1

<details>
<summary>Answer & explanation</summary>

**D)** Keeping a facts block is necessary but not enough: once it is buried in the middle of a long context it is read less reliably, so the application should re-inject it on every request in a fixed, clearly headed position rather than once at turn 1. An instruction to consult the block still points at a buried region. Compaction is lossy for everything else in the history and does not move the block, and adding more fields to the block does not change where it sits.

*Hint if stuck: Having the facts in context is not the same as having them where the model attends.*
</details>

---

## Question 15
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

## Question 16
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

## Question 17
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

## Question 18
A developer-productivity agent built on the Claude API upgrades a service's dependencies over roughly 80 loop turns, calling read_file and run_tests. Every raw output stays in the message history even after the agent has recorded what it learned from it, and by turn 60 it re-runs checks and forgets the upgrade order the engineer gave it. What is the lightest-touch fix?

A) Clear old tool results once they are deep in the history and already used, leaving the call so it can be re-run if needed
B) Summarize the entire conversation into a single paragraph every ten turns and restart the loop from that paragraph alone
C) Raise max_tokens on every request so the model has more room to process all the accumulated tool output each turn
D) Move every earlier tool output into the system prompt so it is treated as stable guidance rather than as message history

<details>
<summary>Answer & explanation</summary>

**A)** Anthropic describes tool result clearing as one of the safest, lightest-touch forms of compaction: once a raw result is deep in the history and its conclusion has been captured, it rarely needs to stay, and the API's context editing can clear old tool results automatically. Wholesale summarizing every ten turns blurs details the agent still needs, such as the upgrade order. max_tokens caps the output length and adds no room for input. Promoting stale output into the system prompt keeps all the noise and gives it the weight of instructions.

*Hint if stuck: Ask which earlier content has already done its job and could go without losing anything the agent still relies on.*
</details>

---

## Question 19
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

## Question 20
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

## Question 21
A support team's escalation prompt says only: 'Escalate when the situation is complex or the customer is unhappy.' Audits show the agent escalates 35 percent of chats, many of them routine, while missing chats where policy did not cover the request. What is the most effective fix?

A) Add a sentiment classifier and escalate only when the customer's sentiment score falls below a tuned threshold
B) Have the agent report a confidence score on each turn and escalate only when its own confidence in resolving the case falls below 50 percent
C) Replace the vague rule with explicit criteria (human requested, policy gap, no progress) and worked examples of each
D) Tell the agent that escalations are costly and should be avoided wherever possible to bring the rate down

<details>
<summary>Answer & explanation</summary>

**C)** Vague criteria produce inconsistent escalation, and explicit triggers with concrete examples, including what should not be escalated, align the agent with policy. Sentiment and self-reported confidence are poor proxies for whether a case actually needs a human, and discouraging escalation in general cuts the policy-gap cases too.

*Hint if stuck: Ask whether the current rule gives the agent anything concrete to test a chat against.*
</details>

---

## Question 22
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

## Question 23
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

## Question 24
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

## Question 25
An engineer tells Claude Code: 'Add caching to the user service.' The service has three plausible layers to cache (HTTP responses, database queries, a computed permissions map) and the choice changes invalidation behaviour substantially. The session is interactive. What should Claude do?

A) Pick the database-query layer, since it is usually the safest place to cache, and note the choice in the commit message
B) Implement caching at all three layers behind feature flags so that the engineer can choose afterwards in production
C) Ask the engineer which layer they intend, briefly naming the options and the invalidation trade-off for each
D) Write an analysis document of all three options and wait for the engineer to read it before making any change

<details>
<summary>Answer & explanation</summary>

**C)** When a request has several valid readings with materially different consequences and a human is available, a short clarifying question resolves the ambiguity cheaply. Guessing a layer risks rework, building all three adds complexity no one asked for, and a full analysis document is heavier than needed when a quick question will do.

*Hint if stuck: How costly is a wrong guess compared with one short question?*
</details>

---

## Question 26
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

## Question 27
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

## Question 28
A bank's support agent escalates every refund above $100 to a human, even though the documented policy authorises the agent to refund up to $250 for duplicate charges. Queue times have doubled. Leadership asks the architect to reduce escalations without adding risk. What should change?

A) Tell the agent in the prompt to be more confident and avoid escalating unless it really is necessary
B) Align criteria with policy: resolve duplicate-charge refunds up to $250, escalate above that or outside it
C) Raise the escalation threshold to $500 for all refund types so the agent handles more refunds on its own
D) Add a sentiment check so the agent escalates refunds over $100 only when the customer seems upset

<details>
<summary>Answer & explanation</summary>

**B)** The agent is escalating cases the policy already covers, so the fix is criteria that match the policy's actual limits. A general push for confidence is vague, a blanket $500 threshold exceeds what policy authorises and adds risk, and sentiment has nothing to do with whether a refund is within authority.

*Hint if stuck: Over-escalation is also a criteria problem.*
</details>

---

## Question 29
A Claude Code session is asked to 'clean up the old feature flags.' It finds 14 flags, 3 of which are also named in an external config service whose usage Claude cannot inspect. The engineer is available in the terminal. What should Claude do?

A) Remove all 14 flags, since the request said to clean up old flags and the config service is not in the repository
B) Remove none of the flags and write a report instead, since any uncertainty at all means the whole task should go back to the engineer to decide
C) Remove the 11 flags it can verify as unused and ask the engineer about the 3 referenced by the external config service
D) Remove the 3 externally referenced flags first, since those are the oldest and most likely to be the ones intended

<details>
<summary>Answer & explanation</summary>

**C)** Claude should complete the unambiguous part and ask about the specific items it cannot verify, which keeps progress while avoiding a risky guess. Deleting everything ignores a real unknown, refusing everything wastes the clear work, and prioritising the uncertain flags inverts the risk.

*Hint if stuck: Separate what is clear from what is genuinely uncertain.*
</details>

---

## Question 30
A telecom support agent's handoff to humans today is a link to the full chat transcript. Human agents say they spend the first five minutes of every escalated case re-reading it and often re-ask customers for details. What should the escalation output include instead?

A) The transcript plus a sentiment score, so human agents know how carefully they need to approach the customer
B) A one-line note saying why the case was escalated, so the human can quickly decide which queue it belongs in
C) The last five messages of the conversation only, since those reflect the customer's current state most accurately
D) A structured summary: customer id, issue, steps tried and results, escalation reason, and a recommended next action

<details>
<summary>Answer & explanation</summary>

**D)** An escalation should hand over a structured summary that lets the human act immediately without re-reading or re-asking. A sentiment score adds little, a one-line reason lacks the facts needed to act, and the last five messages can omit identifiers and earlier troubleshooting.

*Hint if stuck: Design the handoff for the person who receives it.*
</details>

---

## Question 31
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

## Question 32
A billing agent processes a plan downgrade in three tool calls: refund the prorated amount (done), cancel the add-on (done), and apply the new plan (not yet called). Before the third call, the customer writes: 'Stop. Get me a person.' What should the agent's design have it do?

A) Apply the new plan first so the account ends up consistent, then transfer the customer with a short note attached
B) Start no further steps, hand off now, and state in the summary which steps finished and which are still pending
C) Reverse the refund and the add-on cancellation so nothing is half-done, then transfer the customer to a person
D) Ask the customer to confirm they want to abandon the downgrade before transferring, so the final state is clear

<details>
<summary>Answer & explanation</summary>

**B)** An explicit request for a human is honoured right away, and the handoff has to be structured so the person taking over can act safely: here that means stating exactly where the multi-step change stopped, so they can complete or reverse it with the customer. Finishing the last step overrides the customer's instruction and takes a further account action without them. Rolling back on its own takes more hard-to-reverse actions, such as clawing back a refund, that nobody asked for. A confirmation round delays an escalation the customer has already requested.

*Hint if stuck: Weigh honouring the request promptly against leaving the next person able to act on the account safely.*
</details>

---

## Question 33
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

## Question 34
A platform team builds an internal scaffolding agent with the Agent SDK, passing tools ['Read', 'Glob', 'Grep', 'Write'] and a canUseTool callback that shows write approvals to the engineer. Asked to 'add caching to the orders service', where an in-process cache and a shared Redis cache are both valid, it silently picks one, and engineers often redo the work. The team wants it to ask when several approaches are valid. What should they change?

A) Tell Claude to end its turn with a plain-text question whenever it is unsure which of several approaches to take
B) Delegate design choices to a subagent that calls AskUserQuestion, so the main agent's context stays free of all that
C) Register a PreToolUse hook that denies every Write until an engineer approves a plan in a separate review tool
D) Add AskUserQuestion to the tools list and handle it in canUseTool by showing the options and returning the answers

<details>
<summary>Answer & explanation</summary>

**D)** In the Agent SDK, Claude asks clarifying questions by calling AskUserQuestion, which fires the canUseTool callback; your code shows the multiple-choice options and returns the selections as answers. When you pass an explicit tools array, AskUserQuestion has to be in it, which is why this agent never asks. A plain-text question ends the run instead of pausing it for an answer. AskUserQuestion is not currently available in subagents spawned through the Agent tool. Blocking every write adds friction to all edits without letting Claude ask the specific question.

*Hint if stuck: Look at what the agent is allowed to do: can it currently pause and put a choice in front of the engineer at all?*
</details>

---

## Question 35
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

## Question 36
A returns agent escalates 35% of its chats to humans, and most are routine, such as refund-status questions well inside policy. Its system prompt says only: 'Escalate whenever the situation is complex or the customer is unhappy.' Human agents are swamped, and leadership asks for a prompt fix that keeps escalation for the cases that need it. What change works best?

A) Write explicit criteria with the reason behind them, plus examples of cases to escalate and cases to resolve
B) Add 'CRITICAL: only escalate when truly necessary' at the top of the prompt so the model takes the rule seriously
C) Have the agent rate its own confidence from 1 to 10 and escalate only when that self-rating falls below five
D) Add a sentiment classifier and escalate only when the customer's measured frustration passes a set threshold

<details>
<summary>Answer & explanation</summary>

**A)** Vague triggers like 'complex' or 'unhappy' leave the boundary to guesswork, so the fix is explicit criteria (policy gaps, explicit requests for a human, no progress) with the reason for them and a few diverse examples, including near-boundary cases the agent should resolve itself. Anthropic's guidance is that explained instructions generalize better and that examples should cover edge cases. Shouting in capitals changes the tone, not the boundary, and can make newer models overcorrect. Self-rated confidence and sentiment are poor escalation signals: an annoyed customer with a routine refund question does not need a human.

*Hint if stuck: Ask what the model would need in order to tell a routine case from a real handoff case it has never seen before.*
</details>

---

## Question 37
A research coordinator launches three background subagents (patents, papers, market data) and keeps drafting. The papers subagent ends on a usage-limit API error after covering 2019–2022 of its 2019–2025 range; the completion notification marks it failed, names the error, and includes its last output. How should the coordinator handle this?

A) Discard the partial output and launch a fresh subagent for the full 2019–2025 range at once, while the limit is still active
B) Treat the returned output as that subagent's final answer, since a background subagent only reports once its work is done
C) Keep the 2019–2022 findings, mark 2023–2025 as not yet covered and why, and resume that subagent once the limit clears
D) Abort the whole run and restart all three subagents later, so the report is never built from mixed complete and partial work

<details>
<summary>Answer & explanation</summary>

**C)** When a background subagent ends on an API error, it is marked failed and the notification names the error and carries its last output so partial work is not lost; once the error clears it can be retried or resumed with its history intact. The coordinator should keep the partial results, record the uncovered years as a gap, and recover that piece. Relaunching at once throws away finished work and hits the same limit. Treating the output as final hides the gap, because a failed notification is not a completion. Aborting everything is the kill-the-workflow anti-pattern.

*Hint if stuck: Separate what the failed worker already delivered from what is still missing, and ask what each part needs.*
</details>

---

## Question 38
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

## Question 39
A coordinator runs eight analysis subagents for a quarterly competitor report. One subagent fails after its two retries on a data provider outage. The current orchestrator aborts the entire run on any subagent failure, and the report is due in an hour. What is the better design?

A) Keep aborting on any failure, because a report with missing sections is worse than no report at all
B) Continue with the seven results and let the synthesis subagent fill the missing section from its general knowledge
C) Restart all eight subagents from the beginning, since the outage may also have corrupted the seven completed runs
D) Continue with the seven results, record the failed segment and its cause, and mark that coverage gap in the report

<details>
<summary>Answer & explanation</summary>

**D)** The coordinator should use what succeeded and annotate the synthesis with the coverage gap and its cause, so readers know what is missing. Aborting or restarting everything wastes seven good results, and having synthesis fill the gap from general knowledge presents unsourced content as research.

*Hint if stuck: Ask what readers of the report need to know about the analysis that did not finish.*
</details>

---

## Question 40
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

## Question 41
A web-search subagent in a research system hits a site that returns HTTP 429 on its first request. It currently passes the raw 429 back to the coordinator, which then reassigns the whole topic to a different subagent that hits the same site. What is the better division of responsibility?

A) The coordinator should handle every HTTP error itself, since it has the broadest view and can reassign topics
B) The subagent retries transient errors locally with backoff and escalates only if they persist, with what it tried and found
C) The subagent should silently skip the site and return whatever it found elsewhere without mentioning the skip
D) Both agents should ignore rate limit errors, since they are transient and will always resolve themselves eventually

<details>
<summary>Answer & explanation</summary>

**B)** Transient errors are best absorbed locally where the context is, and only unresolved failures should go up with what was attempted and any partial results. Pushing every HTTP error to the coordinator overloads it and leads to blind reassignment, silently skipping hides a gap, and ignoring rate limits leaves the data missing.

*Hint if stuck: Recover where you can, report what you cannot.*
</details>

---

## Question 42
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

## Question 43
A coordinator's synthesis step merges results from five regional market subagents. Two returned partial data: one reached 3 of its 5 sources, another hit a paywall on its main source. The draft report presents all five regions with equal confidence. What should the synthesis output do?

A) Present all five regions the same way, since showing uncertainty would undermine the reader's trust in the report
B) Drop the two partial regions from the report entirely so that only fully supported sections are ever presented
C) Re-run the two partial subagents repeatedly until they reach full coverage, delaying the report until then
D) Annotate the affected sections with what coverage was missing and why, so readers can weigh those findings

<details>
<summary>Answer & explanation</summary>

**D)** Synthesis should carry coverage gaps forward as annotations so readers know which conclusions rest on incomplete data. Presenting everything as equally solid hides the gap, dropping regions discards useful partial findings, and retrying indefinitely cannot get past a paywall.

*Hint if stuck: Ask what a reader would need in order to weigh a section built on thinner evidence.*
</details>

---

## Question 44
A developer-productivity agent delegates 'find all callers of deprecated function parseLegacy' to a subagent that uses a code-search MCP server. The server times out on one of four repositories, and the subagent reports '12 callers found.' The engineer deletes the function and breaks a service in the fourth repository. What should the subagent have returned?

A) The count from the three repositories searched, plus an explicit note that the fourth timed out and was not searched
B) The same count but with a footnote recommending the engineer double-check the result before acting on it
C) Nothing until all four repositories had been searched, waiting and retrying for as long as it took to finish
D) An estimated total for all four repositories, extrapolated from the average across the three it did search

<details>
<summary>Answer & explanation</summary>

**A)** The subagent should report the partial result together with the specific gap, so the caller knows the count does not cover the fourth repository. A vague double-check footnote does not say what is missing, waiting indefinitely blocks the engineer and may never finish, and an estimate presents a guess as a search result.

*Hint if stuck: A partial answer is fine; an unlabelled partial answer is not.*
</details>

---

## Question 45
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

## Question 46
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

## Question 47
A support coordinator agent delegates order lookups to a subagent. When the order database is down, the subagent's error says only 'lookup failed', and the coordinator tells the customer 'I couldn't find your order.' The customer panics, thinking the order is lost. How should the error contract be redesigned?

A) Have the subagent tell the customer directly what went wrong, bypassing the coordinator for all error messages
B) Have the subagent retry the database for up to ten minutes before responding, so transient outages never reach the customer
C) Have the coordinator always say 'please try again later' for any lookup error, whatever the underlying cause
D) Distinguish 'order not found' from 'database unavailable' in the error type, so the coordinator can respond correctly

<details>
<summary>Answer & explanation</summary>

**D)** A valid empty result and an access failure lead to different customer messages and next steps, so the error contract must distinguish them. Bypassing the coordinator breaks hub-and-spoke control, a generic try-later message is wrong when the order truly does not exist, and a long blocking retry leaves the customer waiting with no update.

*Hint if stuck: Ask what the coordinator would need to know to choose the right thing to tell the customer.*
</details>

---

## Question 48
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

## Question 49
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

## Question 50
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

## Question 51
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

## Question 52
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

## Question 53
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

## Question 54
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

## Question 55
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
