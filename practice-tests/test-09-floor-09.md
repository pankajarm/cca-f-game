# Practice Test 09: The Memory Halls
**D5: Context Management & Reliability** (15% of the exam) · task statements 5.1, 5.2, 5.3

56 questions. Exam pace is 2 minutes per question.

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

*Hint if stuck: Some facts should never pass through a summariser at all.*
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

*Hint if stuck: Fix the shape of the data at the source.*
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

*Hint if stuck: Where should the question sit relative to a very long document?*
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

*Hint if stuck: Who should own the facts block: the model or the application?*
</details>

---

## Question 6
In a Claude Code refactoring session, the engineer's constraint 'do not change the public API of the payments package' was stated in turn 2. By turn 60, after several automatic compactions, Claude edits a public function signature. Which approach best preserves this constraint?

A) Put the constraint in the project CLAUDE.md so it is reloaded from disk instead of living only in conversation history
B) Restate the constraint in chat every ten turns so it is always somewhere in the recent part of the conversation
C) Disable automatic compaction for the whole session, so that the original turn 2 statement of the constraint is never summarised away or blurred
D) Ask Claude at the start to remember the constraint permanently and confirm that it has stored it in memory

<details>
<summary>Answer & explanation</summary>

**A)** Durable rules belong in a file that is reloaded independently of the conversation, so compaction cannot blur them; the project CLAUDE.md is that place. Restating by hand is fragile, disabling compaction lets the context fill until quality drops, and asking Claude to remember does not create any storage that survives summarisation.

*Hint if stuck: Move critical facts out of the part of context that gets summarised.*
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

*Hint if stuck: Most of each email is not new information.*
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

## Question 14
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

## Question 15
A hospital intake agent maintains a structured case-facts block (allergies: penicillin; weight: 72 kg), exactly as the architecture guide recommends. The block was injected at turn 1, but by turn 30 it sits buried under 50k tokens of accumulated dialogue and tool results, and the agent suggests an amoxicillin prescription. The block's contents are intact and within the context window. What is the fix?

A) Add a system prompt instruction telling the model to always consult the case-facts block before any medication suggestion
B) Run /compact on the dialogue so the case-facts block becomes a larger share of the remaining context
C) Expand the block with severity codes and timestamps so it stands out more in the context
D) Re-inject the case-facts block at the top of every request under clear headers, not just at turn 1

<details>
<summary>Answer & explanation</summary>

**D)** Maintaining a facts block is necessary but not sufficient — placement matters. Once buried mid-context under 50k tokens it suffers the lost-in-the-middle effect, so it must be re-injected at the top of each request with clear headers where attention is strongest. An instruction to 'consult the block' still points at a buried region, and compaction is lossy for everything else in the history.

*Hint if stuck: Having the facts in context is not the same as having them where the model attends.*
</details>

---

## Question 16
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

## Question 17
A multi-agent due-diligence system has its coordinator spawn eight research subagents, each returning two to three paragraphs of prose findings. The coordinator's merged brief keeps dropping specific figures and attributing facts to the wrong company. What is the root-cause fix?

A) Define a structured schema for subagent returns — entity, claim, source, date, confidence — so the coordinator aggregates typed records
B) Increase the coordinator's extended-thinking budget so it reasons more carefully when reconciling the eight overlapping prose summaries
C) Reduce the fan-out from eight subagents down to four so the coordinator has fewer overlapping prose summaries it needs to reconcile
D) Require each subagent to end its prose findings with a bulleted recap listing its key figures and the company names they belong to

<details>
<summary>Answer & explanation</summary>

**A)** Coordinators aggregate reliably when subagent results arrive as structured, typed records; free prose forces the coordinator to re-extract facts, which is exactly where figures get dropped and attributions get crossed. More thinking budget patches the symptom while leaving the lossy interface in place, fewer subagents risks coverage gaps, and a recap is still unstructured text with the same parsing risk.

*Hint if stuck: Look at the interface between subagents and coordinator — what return format makes aggregation lossless?*
</details>

---

## Question 18
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

## Question 19
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

## Question 20
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

## Question 21
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

## Question 22
A support team's escalation prompt says only: 'Escalate when the situation is complex or the customer is unhappy.' Audits show the agent escalates 35 percent of chats, many of them routine, while missing chats where policy did not cover the request. What is the most effective fix?

A) Add a sentiment classifier and escalate only when the customer's sentiment score falls below a tuned threshold
B) Have the agent report a confidence score on each turn and escalate only when its own confidence in resolving the case falls below 50 percent
C) Replace the vague rule with explicit criteria (human requested, policy gap, no progress) and worked examples of each
D) Tell the agent that escalations are costly and should be avoided wherever possible to bring the rate down

<details>
<summary>Answer & explanation</summary>

**C)** Vague criteria produce inconsistent escalation, and explicit triggers with concrete examples, including what should not be escalated, align the agent with policy. Sentiment and self-reported confidence are poor proxies for whether a case actually needs a human, and discouraging escalation in general cuts the policy-gap cases too.

*Hint if stuck: Clear triggers with examples beat proxies and general pressure.*
</details>

---

## Question 23
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

## Question 24
A home-internet support agent has walked a customer through router restart, cable checks and a firmware reset. Each step reports the same failure, and the agent has no further troubleshooting tools. The customer remains calm and patient. What should the agent do next?

A) Escalate to a human technician with the steps tried and their results, since the agent is no longer making progress
B) Repeat the troubleshooting sequence once more, since intermittent faults sometimes clear on a second attempt
C) Keep the conversation open and ask the customer to try again in an hour, since the customer is not upset
D) Suggest the customer buy a new router, since the router is the most common cause of persistent failures

<details>
<summary>Answer & explanation</summary>

**A)** Lack of progress is a valid escalation trigger regardless of the customer's mood, and the handoff should carry what was tried. Repeating the same steps or deferring keeps the customer stuck, and recommending a purchase is a guess outside the agent's diagnostic evidence.

*Hint if stuck: Calm customers can still need a human.*
</details>

---

## Question 25
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

## Question 26
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

## Question 27
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

## Question 28
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

## Question 29
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

## Question 30
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

## Question 31
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

## Question 32
A CI job runs Claude Code headlessly to update a dependency. The upgrade guide offers two incompatible migration paths, and the right one depends on a product decision the job cannot see. Nobody is watching the job. How should the job be designed to handle this?

A) Stop on this kind of ambiguity and open the PR or an issue describing both paths and the decision needed
B) Pick the path that changes the fewest files, since a smaller diff is easier for reviewers to approve later on
C) Implement both migration paths on separate branches and let the CI system automatically merge whichever passes tests
D) Keep retrying the migration with different prompts until one of the paths compiles cleanly and then merge it

<details>
<summary>Answer & explanation</summary>

**A)** In an unattended run, a decision the agent cannot make should be surfaced to a human with the options laid out, rather than settled by a proxy. Smallest-diff and passes-tests are heuristics that do not answer the product question, and retrying until something compiles turns a decision into luck.

*Hint if stuck: A product decision cannot be settled by a passing build.*
</details>

---

## Question 33
A telecom support agent is mid-troubleshooting when the customer types 'Stop. I want to talk to a real person.' The agent responds 'I understand, but let's try resetting your router first' and continues for four more turns before the customer abandons the chat. How should escalation be designed?

A) Treat an explicit request for a human as an immediate escalation trigger, honored regardless of progress
B) Escalate when the customer's sentiment score drops below a calibrated threshold across two consecutive turns
C) Escalate after the agent's self-assessed confidence in resolution falls below 50 percent
D) Escalate once the agent has exhausted its full troubleshooting runbook without resolving the issue

<details>
<summary>Answer & explanation</summary>

**A)** An explicit human request is one of the reliable escalation triggers and must be honored immediately — continuing to troubleshoot past it destroys trust and drives abandonment. Sentiment and self-reported confidence are unreliable proxies, and waiting for runbook exhaustion is exactly the behavior that drove this customer away.

*Hint if stuck: One trigger in this list requires no inference at all — the customer stated it outright.*
</details>

---

## Question 34
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

## Question 35
An insurance claims agent looks up 'Maria Garcia' and the policy-holder tool returns two records with different policy numbers and addresses. The agent silently picks the record with the more recent activity date and quotes a claim status — for the wrong Maria Garcia. What should the agent do instead?

A) Always select the record whose creation date is older, since it is more likely the original account
B) Merge the two records' fields and present a combined view so the agent never has to choose
C) Refuse to proceed and escalate any lookup that returns more than one matching record to a human agent for manual resolution
D) Ask the customer for an additional identifier — policy number, date of birth, or address — and re-query to disambiguate

<details>
<summary>Answer & explanation</summary>

**D)** Duplicate matches must be disambiguated with additional identifiers before any account-specific action; silently picking by any heuristic guarantees wrong-customer errors. Merging records leaks one customer's data into another's view, and escalating every multi-match is unnecessary overhead when the agent can resolve the ambiguity with one question.

*Hint if stuck: When a key is ambiguous, the fix is to add another key, not pick a favorite.*
</details>

---

## Question 36
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

## Question 37
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

## Question 38
A patent-search subagent queries an external database and returns an empty list. The coordinator writes 'no prior art found' into the final report. Logs later show the database had returned an authentication error, which the subagent's wrapper converted to an empty result. What should the subagent return in this case?

A) Keep returning an empty list, plus a note for the report that prior-art results from this database may be incomplete
B) A structured error marking an access failure, with the query tried, so it is not mistaken for a valid empty search
C) A retry loop inside the subagent that keeps calling the database until it gets a non-empty result back
D) An exception that stops the entire research workflow so that no report is produced with missing data

<details>
<summary>Answer & explanation</summary>

**B)** An access failure and a genuine no-results answer mean very different things, so the subagent must report the failure type and what it tried instead of masking it as empty. A generic caveat still asserts no prior art, retrying until something comes back cannot fix bad credentials and may never end, and killing the whole workflow throws away the other subagents' work.

*Hint if stuck: Empty because nothing exists and empty because nothing could be read are not the same answer.*
</details>

---

## Question 39
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

## Question 40
A coordinator runs eight analysis subagents for a quarterly competitor report. One subagent fails after its two retries on a data provider outage. The current orchestrator aborts the entire run on any subagent failure, and the report is due in an hour. What is the better design?

A) Keep aborting on any failure, because a report with missing sections is worse than no report at all
B) Continue with the seven results and let the synthesis subagent fill the missing section from its general knowledge
C) Restart all eight subagents from the beginning, since the outage may also have corrupted the seven completed runs
D) Continue with the seven results, record the failed segment and its cause, and mark that coverage gap in the report

<details>
<summary>Answer & explanation</summary>

**D)** The coordinator should use what succeeded and annotate the synthesis with the coverage gap and its cause, so readers know what is missing. Aborting or restarting everything wastes seven good results, and having synthesis fill the gap from general knowledge presents unsourced content as research.

*Hint if stuck: Neither all-or-nothing nor silent filling is acceptable.*
</details>

---

## Question 41
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

## Question 42
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

## Question 43
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

## Question 44
A coordinator's synthesis step merges results from five regional market subagents. Two returned partial data: one reached 3 of its 5 sources, another hit a paywall on its main source. The draft report presents all five regions with equal confidence. What should the synthesis output do?

A) Present all five regions the same way, since showing uncertainty would undermine the reader's trust in the report
B) Drop the two partial regions from the report entirely so that only fully supported sections are ever presented
C) Re-run the two partial subagents repeatedly until they reach full coverage, delaying the report until then
D) Annotate the affected sections with what coverage was missing and why, so readers can weigh those findings

<details>
<summary>Answer & explanation</summary>

**D)** Synthesis should carry coverage gaps forward as annotations so readers know which conclusions rest on incomplete data. Presenting everything as equally solid hides the gap, dropping regions discards useful partial findings, and retrying indefinitely cannot get past a paywall.

*Hint if stuck: Readers need to know how complete each part is.*
</details>

---

## Question 45
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

## Question 46
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

## Question 47
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

## Question 48
A support coordinator agent delegates order lookups to a subagent. When the order database is down, the subagent's error says only 'lookup failed', and the coordinator tells the customer 'I couldn't find your order.' The customer panics, thinking the order is lost. How should the error contract be redesigned?

A) Have the subagent tell the customer directly what went wrong, bypassing the coordinator for all error messages
B) Have the subagent retry the database for up to ten minutes before responding, so transient outages never reach the customer
C) Have the coordinator always say 'please try again later' for any lookup error, whatever the underlying cause
D) Distinguish 'order not found' from 'database unavailable' in the error type, so the coordinator can respond correctly

<details>
<summary>Answer & explanation</summary>

**D)** A valid empty result and an access failure lead to different customer messages and next steps, so the error contract must distinguish them. Bypassing the coordinator breaks hub-and-spoke control, a generic try-later message is wrong when the order truly does not exist, and a long blocking retry leaves the customer waiting with no update.

*Hint if stuck: Not found and could not look are different facts.*
</details>

---

## Question 49
A coordinator receives structured errors from subagents with fields for type, attempted actions, partial results and alternatives. To 'keep the context clean', a developer proposes that the coordinator log errors to a file and only pass a count of failed subagents into synthesis. What is the main problem with this proposal?

A) Synthesis loses which topics failed and why, so it cannot annotate coverage gaps and the report will look complete
B) Logging to a file is slower than keeping errors in memory, which will noticeably increase the run's latency
C) The count of failures could exceed the context window when many subagents fail during a very large run
D) The coordinator can no longer retry transient failures, because its retry logic needs the error details now kept only in the log

<details>
<summary>Answer & explanation</summary>

**A)** A bare count tells synthesis something failed but not what, so it cannot mark which sections are incomplete, and the report reads as complete coverage. Logging latency and context size are minor here, and retries are not driven by the log file. Keeping errors lean is fine, but the topic and cause of each gap must reach synthesis.

*Hint if stuck: What does the synthesis step need to be honest about coverage?*
</details>

---

## Question 50
A Claude Code session spawns a subagent to run a database migration dry-run. The subagent's run is cut short by an API error midway. The engineer wants the main session to handle this sensibly rather than assume success. What should the main session do with the subagent's outcome?

A) Treat the dry-run as successful if the subagent produced any output before the error interrupted it
B) Treat the outcome as incomplete, inspect what partial output exists, and re-run or report the gap rather than proceed
C) Proceed straight to the real migration, since a dry-run failure does not mean the real migration will fail too
D) Abandon the whole session and start over from scratch, because any subagent error makes the session's state unreliable

<details>
<summary>Answer & explanation</summary>

**B)** An interrupted subagent yields partial results, and the parent should treat them as incomplete: check what exists and re-run or surface the gap instead of assuming success. Counting any output as success or proceeding to the real migration ignores the missing verification, and abandoning the session discards useful state over a recoverable error.

*Hint if stuck: Partial output is not a pass.*
</details>

---

## Question 51
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

## Question 52
An architect reviews an orchestration framework with two opposite failure policies across teams: one swallows every subagent exception and continues, the other terminates the whole workflow on the first exception. The architect must write one policy for both. Which policy should it be?

A) Terminate on the first exception, because correctness matters more than completeness in any multi-agent system
B) Swallow all exceptions and continue, because finishing the run on time matters more than any single subagent's result
C) Let each subagent choose its own policy in its prompt, since each one knows its own task better than the framework
D) Recover transient errors locally, propagate the rest as structured errors, and let the coordinator decide and record gaps

<details>
<summary>Answer & explanation</summary>

**D)** Both swallowing errors and terminating on any error are anti-patterns; the robust policy recovers locally where possible, propagates unresolved failures with context, and lets the coordinator decide and annotate gaps. Leaving policy to each subagent's prompt produces the same inconsistency the architect is trying to remove.

*Hint if stuck: Both extremes appear on the list of anti-patterns.*
</details>

---

## Question 53
In a 10-scout market-research swarm, the scout covering Latin America hits a rate-limited API on its first call and immediately returns the single word 'failed'. The coordinator drops that segment, and the published report silently omits an entire region. How should scout failure handling be designed?

A) On any scout failure, the coordinator should restart the entire 10-scout pipeline from scratch
B) Prompt the synthesizer to add a disclaimer listing any regions that appear to be missing from the data the scouts returned to it
C) Scouts retry transient errors locally and propagate only unresolvable failures, with what was attempted and any partial results
D) Scouts should raise failures directly to the end user the moment any API call errors

<details>
<summary>Answer & explanation</summary>

**C)** The reliability rule for subagents is recover locally, propagate with context: a rate limit is transient and should be retried inside the scout, and a genuinely unresolvable failure must reach the coordinator as a structured report — what failed, what was tried, partial results — so the hub can reassign or flag the gap instead of silently dropping it. Restarting all 10 scouts wastes nine successful runs, a disclaimer still ships a report missing a region, and surfacing every transient API error to the end user defeats delegation.

*Hint if stuck: Recall which errors a subagent should absorb and what an unrecoverable one must carry upward.*
</details>

---

## Question 54
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

## Question 55
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

## Question 56
A research coordinator's document-analysis subagent could not reach 2 of 9 sources (both paywalled) and returned findings from the other 7. The final report reads as complete, and a reviewer later finds that one whole subtopic relied only on the missing sources. What should change?

A) Have the subagent return structured error context for the failed sources, and have synthesis annotate which topic areas have gaps because of them
B) Stop the whole report whenever any source fails
C) Have the subagent retry the paywalled sources until they succeed
D) Leave the missing sources out silently, since 7 of 9 is good coverage

<details>
<summary>Answer & explanation</summary>

**A)** Errors should travel upward as structured context, and the synthesis should mark which findings are well supported and which areas have gaps. Stopping everything over one failure, retrying a permission failure indefinitely, and silently dropping the failures are all anti-patterns.

*Hint if stuck: The reader needs to know what's missing.*
</details>

---
