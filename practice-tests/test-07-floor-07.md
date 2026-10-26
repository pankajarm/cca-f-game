# Practice Test 07: Prompt Workshop
**D4: Prompt Engineering & Structured Output** (20% of the exam) · task statements 4.1, 4.2, 4.3

76 questions. Exam pace is 2 minutes per question.

---

## Question 1
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

## Question 2
A CI security reviewer flags every SQL string built with concatenation, including queries assembled only from hard-coded constants and those in test fixtures. Developers now dismiss its SQL findings without reading them. Which prompt change most improves precision?

A) State that it reports concatenation only when user data reaches an unparameterized query, and skips constants and test fixtures
B) Tell the reviewer to report SQL concatenation only when it is confident the code is genuinely exploitable by an attacker in production
C) Ask the reviewer to include a short justification with every SQL finding so developers can judge each one
D) Lower the SQL category's severity to informational so the findings stop blocking merges on every PR

<details>
<summary>Answer & explanation</summary>

**A)** Explicit criteria (user-controlled data reaching an unparameterized query) and an explicit skip list (constants, fixtures) give the model a checkable rule that separates real injection risk from noise. "Only when confident" is the same vague caution in new words, justifications add reading load without removing false positives, and downgrading severity leaves the noise in place.

*Hint if stuck: Turn the caution into a rule about what qualifies and what does not.*
</details>

---

## Question 3
A team's CI reviewer keeps commenting that private helper functions lack docstrings. The team's convention only requires docstrings on exported, public API functions, and nobody has told the reviewer that. What is the most effective fix?

A) Ask the reviewer to group all of its documentation findings into one summary comment at the end of each review instead of inline
B) State that docstrings are required only on exported public functions and that private helpers are to be skipped
C) Tell the reviewer to be less strict about documentation in general and to focus on more important issues
D) Remove documentation from the reviewer's scope entirely so it never comments on docstrings in any file

<details>
<summary>Answer & explanation</summary>

**B)** The false positives come from a missing criterion, so stating the team's actual rule (public API yes, private helpers no) fixes precision without losing useful checks. "Be less strict" gives no definition, grouping findings keeps the wrong findings, and dropping documentation entirely loses the legitimate public-API checks.

*Hint if stuck: The reviewer can't follow a convention nobody wrote down.*
</details>

---

## Question 4
A research system's evaluator subagent rates each source as "strong", "moderate" or "weak" evidence. Analysts find the same kind of source (a vendor white paper) rated strong in one report and weak in another. The prompt only lists the three labels. What change makes the ratings consistent?

A) Ask the evaluator to explain its reasoning in detail before each rating so that analysts can override any ratings they disagree with
B) Replace the three labels with a numeric 1 to 10 score so the evaluator can express finer distinctions
C) Define each level with concrete criteria and examples, such as a peer-reviewed study as strong and a vendor white paper as weak
D) Run the evaluator twice on every source and keep the lower of the two ratings to stay on the cautious side

<details>
<summary>Answer & explanation</summary>

**C)** Labels without definitions leave each run to invent its own boundaries; concrete criteria and examples for each level anchor the judgment so the same kind of source gets the same rating. A finer numeric scale multiplies the ambiguity, explanations help humans audit but do not fix the rule, and taking the lower of two runs biases ratings without making them consistent.

*Hint if stuck: Labels only mean something once each one has a definition.*
</details>

---

## Question 5
An invoice extraction pipeline also flags "anomalies" for the finance team. It now flags about 40 percent of invoices, mostly for rounding differences of a cent or two and for vendors that use a different date format. The finance team cares about duplicate invoice numbers, totals that differ from line items by more than 1 percent, and bank-detail changes. What is the best fix?

A) Tell the model to flag only anomalies it considers financially significant and to ignore anything trivial
B) Raise the anomaly threshold by asking the model to flag only invoices that show two or more separate anomalies at the same time
C) Have a second model review each flagged invoice and drop the flags that it judges to be unimportant
D) List the three anomaly types to report with thresholds, and state that rounding gaps and date formats are not anomalies

<details>
<summary>Answer & explanation</summary>

**D)** The finance team already knows what matters, so writing those three types and thresholds into the prompt, along with what to skip, gives a precise rule. "Financially significant" is undefined, requiring two anomalies would miss a single duplicate invoice, and a second model judging importance has no better definition than the first.

*Hint if stuck: Write down what the people receiving the flags actually care about.*
</details>

---

## Question 6
A QA agent audits support transcripts and flags "tone problems" in the resolution agent's replies. It flags almost every transcript that contains an apology or a refusal, and team leads have stopped opening its reports. What change most improves the audit's precision?

A) Define tone problems concretely, such as blaming the customer, with examples of acceptable apologies and refusals
B) Tell the QA agent that apologies and refusals are normal and that it should be more forgiving about them
C) Have the QA agent score each transcript's tone from 1 to 5 and flag only the transcripts that score below 2 on that scale
D) Limit the audit to transcripts where the customer later left a negative satisfaction rating

<details>
<summary>Answer & explanation</summary>

**A)** A concrete definition with examples of what does and does not count gives the agent a decision rule, so ordinary apologies and refusals stop being flagged. "Be more forgiving" is still vague, a numeric score with a threshold relies on an undefined scale, and filtering by satisfaction ratings misses tone problems with customers who never rated.

*Hint if stuck: Ask whether the QA agent has ever been told what a tone problem actually is.*
</details>

---

## Question 7
To cut noise, a team asked its CI reviewer to attach a confidence score from 0 to 1 to each finding and now posts only findings above 0.8. Most posted findings still turn out to be false positives, because the model gives high scores to style complaints. What is the root-cause fix?

A) Raise the cutoff to 0.95 so that only the findings the model is most certain about reach developers
B) Replace the confidence filter with explicit criteria listing which issue types to report and which to skip
C) Ask the model to write a justification for each confidence score so that inflated scores become easier to spot during review
D) Average the confidence over three independent runs to smooth out scores that are inflated by chance

<details>
<summary>Answer & explanation</summary>

**B)** The false positives come from the model not knowing what counts as a reportable issue, and self-rated confidence does not supply that definition; explicit report and skip criteria do. A higher cutoff or averaged scores still rank the wrong things, and justifications make inflation visible without preventing it.

*Hint if stuck: Ask whether a score tells the model anything about what this team wants to hear about.*
</details>

---

## Question 8
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

## Question 9
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

## Question 10
A platform team has rewritten its PR reviewer's prompt with explicit report and skip criteria. A manager wants to know whether precision actually improved before rolling it out to 30 repositories. What is the best way to find out?

A) Run old and new prompts on past PRs whose findings were labeled real or false, and compare precision per category
B) Ask the reviewer itself to estimate what share of its findings are real for a week of new PRs
C) Roll the new prompt out to all 30 repositories at once and track whether developers resolve more of its comments over the month
D) Ask a few senior engineers to read a handful of new reviews and say whether they feel less noisy

<details>
<summary>Answer & explanation</summary>

**A)** A labeled set of past findings lets the team measure precision directly, per category, for both prompts before anything ships. Impressions from a few engineers are anecdotal, the model's estimate of its own accuracy is not a measurement, and a full rollout makes every repository the experiment.

*Hint if stuck: Measure against known answers before you scale a change.*
</details>

---

## Question 11
A contract-review pipeline flags agreements that "contain an auto-renewal clause." It flags many contracts that only offer an optional renewal the customer must request, and legal reviewers are wasting hours on them. What change most improves precision?

A) Ask the model to quote the exact clause it relied on for each flag so that legal reviewers can reject the false positives more quickly
B) Define the target as renewal that happens unless a party gives notice, and exclude renewal options the customer must request
C) Tell the model to flag only clauses that are clearly and unambiguously auto-renewal and nothing else
D) Add a keyword check that only passes contracts to the model when the word automatic appears in them

<details>
<summary>Answer & explanation</summary>

**B)** A precise definition with an explicit exclusion separates true auto-renewal from optional renewal, which is exactly the confusion causing the false positives. Quoting the clause speeds up rejecting false positives without preventing them, "clearly and unambiguously" adds no definition, and a keyword gate misses auto-renewal clauses written without that word.

*Hint if stuck: Ask what the model currently cannot tell apart, and which change gives it a way to.*
</details>

---

## Question 12
A team adds a /precommit-review custom command in Claude Code so developers get a quick check before committing. The command's prompt says "flag anything that should block this commit," and it blocks on missing comments, long functions and TODOs. The team wants it to block only on real problems. What should they change?

A) Change the wording to "flag only serious problems" so that minor issues like comments and TODOs fall through
B) Have the command print all of its findings without blocking, and let each developer decide which of them to fix before committing
C) Define blocking issues, such as a failing build, secrets in code or an unmigrated public API change, and call the rest advisory
D) Run the command only on files larger than a set size so the small changes are not slowed down by reviews

<details>
<summary>Answer & explanation</summary>

**C)** An explicit list of what blocks (build failures, secrets, unmigrated API changes) and a statement that everything else is advisory gives the command a precise rule. "Serious problems" is still undefined, removing blocking entirely discards the check, and a file-size filter has nothing to do with what is worth blocking.

*Hint if stuck: Write down what "blocking" means for this team.*
</details>

---

## Question 13
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

## Question 14
A support agent decides refund eligibility and was told to "be strict about refunds to prevent abuse." Customers with valid, in-policy returns are now being refused and escalating. The policy is clear: unused items within 30 days, or any item that arrived damaged. What is the best fix?

A) Replace the strictness instruction with the actual eligibility rules, plus examples of approved and refused cases
B) Route every refund request to a human so that no valid return is refused by the agent again
C) Ask the agent to rate its confidence that each refund request is legitimate and approve only those that land above a set threshold
D) Change the instruction to "be fair but careful with refunds" so the agent strikes a more balanced tone

<details>
<summary>Answer & explanation</summary>

**A)** Vague strictness leads to over-refusal; stating the actual criteria with examples lets the agent approve exactly the in-policy cases and refuse the rest. A softer adjective is still vague, sending everything to humans gives up on automation, and self-rated confidence is not a substitute for the policy's rules.

*Hint if stuck: The policy already says who qualifies; give it to the agent.*
</details>

---

## Question 15
An intake pipeline routes "incomplete applications" to manual review. It sends about a third of all applications, mostly because optional fields such as a fax number or middle name are blank or because answers use common abbreviations, even when every required field is present and clear. Manual reviewers are overwhelmed. Which change best fixes the routing?

A) Tell the model to be more tolerant of imperfect applications and to route only the worst cases to reviewers
B) Define incomplete as a required field being missing or ambiguous, and say blank optional fields and abbreviations do not count
C) Route only every second flagged application to manual review so the reviewers' workload is cut in half
D) Ask the model to score completeness from 1 to 10 and route only the applications scoring below a cutoff tuned on last month's data

<details>
<summary>Answer & explanation</summary>

**B)** Tying the criterion to what matters (missing or ambiguous required fields) and excluding blank optional fields and abbreviations gives a precise rule. "More tolerant" and "the worst cases" are undefined, sampling half the flags drops real problems at random, and a 1 to 10 score with a cutoff relies on an undefined scale.

*Hint if stuck: Base the rule on what the downstream step actually needs.*
</details>

---

## Question 16
A research system's source-screening agent flags sources for "possible bias." It flags nearly every industry report and most news articles, and analysts have stopped reading the flags. The analysts actually want to know about undisclosed funding from the company being studied and about authors with a stake in the outcome. What should change?

A) Tell the agent to flag bias only when it is strongly suspected rather than for every possible concern
B) Ask the agent to list every potential bias it notices but sort the list so the most severe concerns appear first for the analysts
C) Flag only undisclosed funding from the subject company and authors with a stake in the outcome, and nothing else
D) Exclude industry reports and news articles from screening, since those are the sources it flags most often

<details>
<summary>Answer & explanation</summary>

**C)** Listing the exact conditions the analysts care about, and saying everything else is out of scope, gives a decision rule that cuts the noise. "Strongly suspected" is still vague, sorting keeps every false flag in the list, and excluding whole source types would also hide the funding conflicts the analysts want.

*Hint if stuck: Ask what the readers of the flag actually act on.*
</details>

---

## Question 17
A monorepo's CI reviewer comments on performance in one-off maintenance scripts under /scripts, which run once a quarter. The team only cares about performance in request-handling code under /services. What change best removes these comments?

A) Tell the reviewer to focus on the most important performance issues in each PR and not to waste comments on the minor ones
B) Ask the reviewer to mark performance comments in scripts as low priority so developers know to skip them
C) Disable the performance category for the whole repository, since most of its comments are not useful
D) Scope the performance criteria to request-handling code under /services, and state that /scripts is out of scope

<details>
<summary>Answer & explanation</summary>

**D)** The comments are false positives because the reviewer does not know where performance matters; scoping the criteria to /services and excluding /scripts fixes that precisely. "Most important" is undefined, labeling them low priority keeps the noise, and disabling the category would lose the request-path findings the team wants.

*Hint if stuck: Say where the rule applies, not just how hard to apply it.*
</details>

---

## Question 18
A CI reviewer labels findings "critical", "major" or "minor", and the team wants to post only critical findings inline and put the rest in a summary. In practice the model labels most findings critical, so the summary is nearly empty. What is the best fix?

A) Define each level with concrete examples, such as critical for data loss or auth bypass and minor for readability
B) Post only the top three critical findings inline and move the rest of them into the summary
C) Ask the model to justify each critical label in a sentence or two so that over-labeling becomes visible to the human reviewers
D) Tell the model to use the critical label sparingly and only when it is truly necessary

<details>
<summary>Answer & explanation</summary>

**A)** Concrete definitions and examples for each severity level anchor the labels, so routing to inline comments or the summary becomes reliable. "Use it sparingly" is vague, a top-three cut arbitrarily drops real critical findings, and justifications expose inflation without defining the levels.

*Hint if stuck: Give each label a concrete meaning the model can match against.*
</details>

---

## Question 19
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

## Question 20
A developer productivity agent audits dependencies and flags every package that is not on its latest version as a "risk." Its weekly report lists 600 packages, and engineers ignore it. The security team wants only packages with a known CVE or on an end-of-life major version. What change fixes the report?

A) Tell the agent to flag only the most outdated packages and to ignore packages that are a little behind
B) Ask the agent to rank all 600 packages by its own estimate of risk and report only the top fifty of them in each weekly report
C) Report only packages with a known CVE or on an end-of-life major version, and state that version lag alone is not a risk
D) Run the audit monthly instead of weekly so the report is reviewed less often and with more attention

<details>
<summary>Answer & explanation</summary>

**C)** The security team's criteria are precise, so writing them into the prompt, and saying version lag alone does not count, aligns the report with what they act on. A top-fifty cut by estimated risk can still miss a CVE, "most outdated" is a different and vaguer rule, and running less often does not change what is flagged.

*Hint if stuck: Report what the readers act on, defined in their terms.*
</details>

---

## Question 21
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

## Question 22
Your CI pipeline runs claude -p to review every PR in a 40-developer monorepo. The review prompt includes the line 'be careful not to flag things that are not real problems,' yet PRs still average 12 comments each, mostly style nitpicks the linter already enforces. What is the most effective prompt change?

A) Lower the sampling temperature so the model generates fewer speculative findings and sticks to obvious problems
B) Strengthen the existing instruction to say the model should be very careful and only report issues it is extremely confident are real bugs worth a reviewer's time
C) Replace the vague caution with explicit flag and skip criteria: enumerate the defect types to report and state that linter-covered style issues are skipped
D) Add a hard cap of five comments per PR so the volume of nitpicks stays manageable for reviewers

<details>
<summary>Answer & explanation</summary>

**C)** Vague cautions like 'be careful' give the model no operational definition of a real problem, so they fail at scale; explicit flag and skip criteria provide a checkable decision rule. Confidence-based phrasing is the same vagueness restated, temperature changes randomness rather than the decision rule, and a comment cap hides noise without improving precision.

*Hint if stuck: Ask what the model would need in order to tell a nitpick from a defect on its own.*
</details>

---

## Question 23
An automated security reviewer posts findings on PRs across your platform team's repositories. Its 'potential race condition' category has run at roughly 80 percent false positives for three weeks, and engineers have started dismissing every finding unread, including valid secret-exposure alerts from other categories. What should you do first?

A) Attach a model-reported confidence score to each finding so engineers can sort the findings and triage the noisy race-condition category by themselves
B) Disable the race-condition category in production, tune it offline against labeled examples, and re-enable it once precision recovers
C) Add a prompt instruction telling the model to flag race conditions only when it is certain the code is genuinely unsafe
D) Send the team a reliability ranking of the finding categories so they know which ones are worth reading carefully

<details>
<summary>Answer & explanation</summary>

**B)** One high-false-positive category poisons trust in the entire tool, so the first move is to pull it from production and fix it offline against labeled data, restoring it only when precision recovers. Self-reported confidence scores are poorly calibrated so sorting by them does not rebuild trust, a certainty instruction is a vague caution restated, and a reliability memo asks engineers to keep absorbing the noise.

*Hint if stuck: When one noisy category makes engineers ignore everything, think about protecting trust in the whole tool first.*
</details>

---

## Question 24
A CI step asks Claude to 'check that code comments are accurate'. It flags dozens of comments per PR for minor wording, and developers have started ignoring it. Which prompt change most improves precision?

A) Add 'only report high-confidence findings'
B) Ask the model to rate each finding from 1 to 10 for confidence and post only those it rated 8 or higher
C) Add 'be conservative and avoid nitpicks'
D) Flag a comment only when the behaviour it describes contradicts what the code actually does

<details>
<summary>Answer & explanation</summary>

**D)** Defining the defect (a comment whose described behaviour contradicts the code) tells the model exactly what to report, so wording nitpicks drop out. 'High-confidence only' and 'be conservative' are vague cautions that leave the model's notion of an issue unchanged, and a self-rated 1-10 score ranks the same wrong findings because the model has no criterion to score against.

*Hint if stuck: Define what counts as wrong, rather than how careful to be.*
</details>

---

## Question 25
An automated reviewer labels the same unchecked null dereference 'critical' on one PR and 'minor' on another, and teams can't trust its severity labels for routing. What is the most effective fix?

A) Run the review three times and use the most common severity
B) Add 'be consistent with severity ratings' to the prompt
C) Define explicit criteria for each severity level, each with a concrete code example
D) Drop severity labels entirely and post every finding at the same level so ratings can never disagree

<details>
<summary>Answer & explanation</summary>

**C)** Consistent classification comes from explicit level definitions illustrated by concrete examples. Majority voting averages an undefined standard, 'be consistent' gives the model nothing to be consistent with, and removing severity loses the routing signal the team needs.

*Hint if stuck: Consistent with what?*
</details>

---

## Question 26
A procurement team extracts supplier, invoice date and line items from invoices. All three examples in the prompt come from the company's largest supplier, whose invoices use a clean two-column header. On invoices from smaller suppliers with tabular headers or stamped dates, the model often returns empty fields or fills in values that appear nowhere on the page. What change addresses the cause?

A) Add a sentence telling the model that invoices from smaller suppliers can look different and it should search the whole page carefully before giving up and treat a missing field as a last resort only
B) Replace the examples with a set drawn from several distinct invoice layouts, including one with a stamped date and one with a tabular header, each showing the correct extraction
C) Keep the current examples but add a fourth one from the same large supplier so the model sees the expected format reinforced more strongly
D) Lower the temperature to zero for this pipeline so the model stops improvising values and returns the same fields on every invoice

<details>
<summary>Answer & explanation</summary>

**B)** The examples all share one layout, so the model learned that layout rather than the task; showing varied layouts with correct extractions teaches it where fields can hide and reduces both empty and invented extractions. A generic warning to search carefully is a vague instruction that does not show what the other layouts look like, another example from the same supplier deepens the bias, and temperature affects randomness, not the missing knowledge of other layouts.

*Hint if stuck: Ask what the model never got to see before it met the smaller suppliers' invoices.*
</details>

---

## Question 27
A clinical-trials team extracts adverse_event_grade from case reports into a nullable field. Every example in the prompt shows a report where the grade is stated, and in production the model returns a plausible grade such as 2 for reports that never mention one. The schema already allows null. Which prompt change most directly reduces these invented values?

A) Add an instruction in capital letters stating that the model must never guess a grade, and that inventing values will cause regulatory problems for the sponsor
B) Make adverse_event_grade a required field so the model has to commit to a value and the validator can catch implausible grades downstream
C) Add an example of a report with no stated grade whose expected output is null, with a short note explaining that the grade is absent rather than implied
D) Remove the examples entirely so the model is not anchored to graded reports, and rely on the field description to explain when null is appropriate

<details>
<summary>Answer & explanation</summary>

**C)** When every example has a value, the model infers that the field is always filled; an example whose correct answer is null, with the reason, shows the boundary directly. Emphatic capitalised warnings are the prose instruction that already failed, making the field required pushes the model toward fabrication, and removing the examples throws away the strongest lever instead of fixing the gap in coverage.

*Hint if stuck: Examples teach what normal looks like, including what an empty answer looks like.*
</details>

---

## Question 28
A telecom's support agent drafts the final reply after resolving a billing issue. The style guide says replies should acknowledge the issue, state what was done, and give the next step, in under 120 words. The guide is pasted into the system prompt, yet replies vary widely in structure and some run to 300 words. What is the most effective improvement?

A) Ask the model to rate its own draft against the style guide and rewrite it whenever the self-assigned score falls below eight before the reply goes out
B) Post-process every reply with a script that truncates anything beyond 120 words before it is sent to the customer
C) Move the style guide from the system prompt into the user turn so it sits closer to the conversation and gets more attention
D) Add three short example replies for different issue types, each following the acknowledge, action, next-step structure within the word limit

<details>
<summary>Answer & explanation</summary>

**D)** Concrete examples of finished replies are the most reliable way to get consistent structure and length; the model can copy the shape instead of interpreting a description. Truncation chops replies mid-sentence without fixing structure, moving the guide changes placement but not its abstract form, and self-scoring in the same pass inherits the same interpretation of the guide that produced the drift.

*Hint if stuck: Consider whether the model is being told the format or shown it.*
</details>

---

## Question 29
An airline's support agent decides whether to escalate to a human. Clear cases are handled well, but borderline ones, like a furious customer whose problem is a simple seat change, or a calm customer describing a possible safety issue, flip between outcomes on reruns. The prompt already has two examples, both of obvious escalations. What should the architect change?

A) Replace the two obvious examples with borderline cases like these, each showing the decision and a sentence on why it beats the other choice
B) Add a numeric sentiment threshold to the prompt so that any customer scoring above it on anger is escalated automatically regardless of the issue
C) Add many more examples of obvious escalations so that the model has a larger sample from which to infer where the boundary lies
D) Instruct the model to escalate whenever it is uncertain, since an unnecessary escalation is cheaper than a mishandled case

<details>
<summary>Answer & explanation</summary>

**A)** Examples teach judgment best when they sit on the decision boundary and explain why one choice wins; obvious cases give the model nothing to learn about the hard calls. A sentiment threshold encodes exactly the wrong signal for the angry seat-change case, more obvious examples still never touch the boundary, and escalating on uncertainty floods humans because the model's uncertainty is not well calibrated.

*Hint if stuck: The examples you choose should sit where the model is actually confused.*
</details>

---

## Question 30
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

## Question 31
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

## Question 32
A platform team's internal assistant generates commit messages from staged diffs. The team's convention is a type prefix, a scope in parentheses, and a lowercase imperative summary under 72 characters. Despite a clear description, generated messages mix past tense, title case and missing scopes, and the commit-lint hook rejects about a third of them. What should the team add to the prompt?

A) A list of all the valid type prefixes and scopes in the repository, so the model always has the correct vocabulary available while writing
B) An instruction to imitate the style of the Linux kernel's commit history, since that is a well-known and consistent commit convention
C) A rule that the model must count the characters of its summary and rewrite it if the count exceeds 72 before returning the final message
D) Several real commit messages from the repository that pass the linter, chosen to cover different types and scopes, shown as examples

<details>
<summary>Answer & explanation</summary>

**D)** Real, passing commit messages show tense, case, scope and length all at once, which is what the description failed to convey. A vocabulary list fixes only the prefix and scope choices, character counting is unreliable and does nothing for tense or case, and the kernel's convention differs from this team's, so it would add a new inconsistency.

*Hint if stuck: The model already knows the rules in words; give it something concrete to match.*
</details>

---

## Question 33
A developer-productivity bot summarises pull requests for a weekly digest. The prompt has three examples, and each example summary happens to begin with "This PR refactors". Now nearly every digest entry starts the same way, even for bug fixes and new features, and readers complain it is misleading. What is the best fix?

A) Rewrite the examples so they cover a bug fix, a feature and a refactor, each opening in a way that reflects what that change actually does
B) Remove the examples so the model writes freely, and rely on a description of what a good summary should contain instead
C) Add an instruction telling the model that it must not start summaries with "This PR refactors" unless the change really is a refactor according to its diff
D) Post-process the digest to replace the opening words with a label generated from the PR's title and its type tag in the tracker

<details>
<summary>Answer & explanation</summary>

**A)** The model picked up an unintended pattern because the examples were not diverse; varying the examples by change type removes the accidental template and shows the intended behaviour. A negative instruction patches one phrase while leaving the examples' bias in place, dropping examples loses the format benefit, and rewriting openings in code treats the symptom while summaries still describe everything as a refactor.

*Hint if stuck: Models copy what examples share, including things you did not mean them to share.*
</details>

---

## Question 34
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

## Question 35
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

## Question 36
A legal team's extraction prompt contains three sample contracts with their expected JSON, followed by the real contract to process. On short contracts the model sometimes returns party names and dates from the sample contracts instead of the real one. The samples are pasted as plain text with headings like "Contract 1". What change most directly fixes this?

A) Validate that every extracted party name appears in the real contract and rerun the whole request automatically whenever an extracted value turns up in a sample instead
B) Shorten the sample contracts to just a few lines each so that they are less likely to be mistaken for part of the real document
C) Move the samples after the real contract so that the document the model reads most recently is always the one it should extract from
D) Wrap each sample in example tags and the real contract in its own clearly named tag, so the model can tell demonstrations apart from the input

<details>
<summary>Answer & explanation</summary>

**D)** The model is confusing demonstrations with input because nothing separates them; the docs recommend wrapping examples in example tags so Claude can distinguish them from instructions and data. Shortening samples reduces their teaching value without separating them, putting the samples last makes them more likely to be read as the input, and a post-hoc validator catches leaks but leaves the root cause in place.

*Hint if stuck: Look at the raw prompt as the model sees it: what marks one block as teaching material and another as the work to do?*
</details>

---

## Question 37
An e-commerce support agent classifies each incoming message as order_status, return_request, damaged_item or account_issue before choosing a workflow. Messages like "the box arrived crushed but the item seems fine, can I still send it back?" are labelled differently from run to run. The category definitions were rewritten twice with little gain. What is the most effective next step?

A) Add a few examples of mixed messages like this one, each with the chosen label and a short rationale for picking it over the others
B) Replace the four categories with a free-text intent field and let the downstream workflow decide what to do from the text
C) Add a fifth category called mixed for messages that touch more than one workflow and route all of them to a human queue
D) Ask the model to output a probability for each category and pick the highest one, so that the decision becomes deterministic

<details>
<summary>Answer & explanation</summary>

**A)** After definitions have been refined, examples of the specific ambiguous cases with a rationale are what teach consistent judgment, and they generalise to similar mixed messages. A catch-all mixed label pushes ordinary messages onto humans, free-text intent moves the ambiguity downstream, and self-reported probabilities are not calibrated, so taking the maximum does not make the underlying judgment consistent.

*Hint if stuck: Better definitions have already been tried; what else teaches a boundary?*
</details>

---

## Question 38
A research system's extraction subagent pulls the main quantitative finding from each paper. The prompt's four examples are all papers whose key result appears in the abstract. Evaluation shows the subagent now misses findings in papers that report the key number only in a results table, returning the abstract's vaguer claim instead. What should the architect do?

A) Instruct the subagent to always skip the abstract and read only the results section, since that is where the precise numbers are reported
B) Replace one or two examples with papers whose key number appears only in a results table, showing that the table value is the answer
C) Increase the number of examples to ten, all chosen from highly cited papers, so that the subagent sees a broader sample of good writing
D) Add a sentence to the prompt saying the key finding may sometimes be in a table, and that tables should be checked before the abstract

<details>
<summary>Answer & explanation</summary>

**B)** The examples unintentionally taught that the finding lives in the abstract; adding examples where it lives in a table shows the intended behaviour. Skipping the abstract overcorrects and breaks the papers that do state it there, a one-line note competes with four examples pointing the other way, and more examples chosen by citation count do not fix the missing layout.

*Hint if stuck: If every example shares a trait, the model may treat that trait as a rule.*
</details>

---

## Question 39
A lab-results pipeline extracts test name, value and unit from reports produced by dozens of clinics. Glucose appears as "GLU 5.4 mmol/L", "Glucose: 97 mg/dL" and "Fasting glucose 97". The schema needs a canonical test name and the unit exactly as written, and outputs are inconsistent across clinics. Which prompt change most improves consistency?

A) Add a sentence asking the model to normalise test names to their canonical form while keeping each unit exactly as it was written in the output
B) Ask the model to convert every value to mmol/L so that the output never contains a mix of units for the same test
C) Add examples showing each of these raw forms mapped to the canonical name and the unit as written, including one with no unit stated
D) Pass each clinic's reports through a separate prompt tuned with that clinic's own wording and abbreviations for its tests

<details>
<summary>Answer & explanation</summary>

**C)** Showing the different raw forms mapped to the canonical output, including the missing-unit case, demonstrates exactly how normalisation should behave across layouts. A one-line instruction leaves each variant to interpretation, converting units violates the requirement to keep units as written, and per-clinic prompts multiply maintenance across dozens of sources without teaching the general mapping.

*Hint if stuck: Show the mapping from messy input to clean output rather than describe it.*
</details>

---

## Question 40
An insurance team built its few-shot set by sampling twelve random claims from last month's traffic. Accuracy is high on routine claims, but the costly errors are on claims with partial liability or multiple policies, and none of the twelve examples covers those. The prompt is already long. What is the best way to revise the examples?

A) Add twelve more randomly sampled claims so that the larger sample is more likely to include partial-liability and multi-policy cases
B) Keep the twelve examples and add a paragraph that describes how partial liability and multiple policies should be handled
C) Keep the examples and add a validator rule that sends every claim mentioning liability or multiple policies to human review
D) Swap most of the routine examples for a small, targeted set that includes partial-liability and multi-policy claims with reasoning

<details>
<summary>Answer & explanation</summary>

**D)** Random samples mirror traffic, so they over-represent easy claims; a small, deliberately chosen set that targets the hard categories and explains the reasoning teaches the judgment where errors occur, and it shortens the prompt. More random samples bloat the prompt and may still miss the rare cases, a prose paragraph lacks the demonstrated reasoning, and routing all such claims to humans avoids the problem instead of improving extraction.

*Hint if stuck: Examples earn their place by covering what the model gets wrong, not what is common.*
</details>

---

## Question 41
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

## Question 42
A release pipeline asks Claude to turn merged PR titles into user-facing changelog lines. Product wants each line in plain language, grouped under Added, Changed or Fixed, with internal ticket numbers removed. Output varies: some lines keep jargon, some keep ticket IDs, and grouping headers change names between releases. What change gives the most consistent output?

A) Write a longer description of what plain language means for the product's audience, with a list of jargon words that must be removed
B) Add a short example changelog built from real PR titles, showing the three headers and how jargon and ticket IDs are rewritten
C) Strip ticket IDs from PR titles with a regex before sending them, and let the model handle the grouping and wording as it does now
D) Have a second model call check the changelog against the rules and send it back for another attempt whenever it finds a violation

<details>
<summary>Answer & explanation</summary>

**B)** A worked example from real PR titles shows the headers, the tone and the removal of ticket IDs in one place, which is the most reliable way to get repeatable format. A longer description and jargon list stay abstract, a checking loop adds cost while the generator remains inconsistent, and a regex fixes only the ticket IDs while the headers and jargon keep drifting.

*Hint if stuck: One concrete before-and-after can carry several formatting rules at once.*
</details>

---

## Question 43
An internal developer Q&A assistant answers questions about the company's APIs, and an IDE plugin renders each answer as a short explanation, a code snippet and a link. About a quarter of answers put the code first or omit the link, so the plugin shows them badly. The prompt describes the three parts in a paragraph. What should the team change?

A) Have the plugin detect the code block and link wherever they appear and rearrange them into the expected order before display
B) Ask the model to return its answer as three numbered paragraphs so the plugin can split them by number into the right slots
C) Add two example answers to different API questions that show the explanation, snippet and link in the required order
D) Shorten the paragraph describing the three parts to a single sentence so the structure is easier for the model to remember

<details>
<summary>Answer & explanation</summary>

**C)** Showing two complete answers in the required order is the most reliable way to fix structural drift, because the model can match the pattern rather than interpret a paragraph. Rearranging in the plugin cannot add a missing link, numbered paragraphs are another described format that can drift in the same way, and a shorter description is still a description.

*Hint if stuck: A paragraph of rules and a picture of the result are not equally strong.*
</details>

---

## Question 44
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

## Question 45
A CI review bot labels each finding as blocker, warning or nit. Teams complain the same pattern, an unchecked return value, is a blocker in one PR and a nit in the next. The severity definitions are written out, and the bot's output format is already consistent. Which change best reduces this inconsistency?

A) Add examples of borderline findings such as an unchecked return value, each with the chosen severity and why it is not the adjacent level
B) Collapse the three severities into one label so that there is no severity judgment left for the model to make inconsistently
C) Instruct the bot to choose the higher severity whenever it is unsure, so that real problems are never under-reported to the teams reading the review
D) Run the bot three times on each PR and report the severity that appears most often across those three separate runs

<details>
<summary>Answer & explanation</summary>

**A)** The inconsistency is in judgment, not format, and examples of borderline findings with reasons for the chosen level teach the boundary in a way that generalises. Collapsing the levels throws away information teams need, defaulting upward floods PRs with false blockers, and majority voting triples the cost while still voting among unstable judgments.

*Hint if stuck: The definitions exist and the output shape is stable; ask what the model lacks for cases that sit near a boundary.*
</details>

---

## Question 46
A benefits administrator extracts member ID and claim amount from claim forms. Typed forms work well, but on handwritten forms and forms where the member ID is in a sidebar box, the model often reports the ID as missing. The prompt has two examples, both of typed forms with the ID in the header. What change addresses the cause?

A) Instruct the model that the member ID is always present on valid forms and that it should keep looking until it finds a value
B) Add examples of a handwritten form and a form with the ID in a sidebar box, each showing where the ID was found and extracted
C) Mark member_id as required in the schema so that the model cannot leave it empty and must always return a value for it
D) Route all handwritten forms and sidebar-layout forms to a manual data-entry team and keep the model on the typed forms

<details>
<summary>Answer & explanation</summary>

**B)** The examples only showed one layout, so the model did not learn that the ID can sit elsewhere; adding the other layouts reduces empty extractions. Telling it the ID is always present invites invented IDs when one is truly missing, a required field forces fabrication rather than better search, and manual routing avoids the problem at a high ongoing cost.

*Hint if stuck: Empty results on unfamiliar layouts often trace back to what the examples showed.*
</details>

---

## Question 47
A support-resolution agent ends each conversation by writing a handoff summary for human agents. The required format is four labeled sections, but in production the model sometimes merges sections, renames headers, or adds extras, even though the prompt describes the format in detail. What is the most reliable prompt-level fix?

A) Add two to four complete example summaries to the prompt that demonstrate the exact section structure on representative tickets
B) Expand the prose format description with stronger language such as 'you must always use exactly these four section headers in this order'
C) Append thirty example summaries covering every ticket category the support team has ever encountered
D) Ask the model to first restate the format rules in its own words, then write the summary beneath its restatement

<details>
<summary>Answer & explanation</summary>

**A)** Few-shot examples demonstrate format far more reliably than prose descriptions, and 2 to 4 well-chosen examples are typically enough for format consistency. Thirty examples add cost and context bloat with diminishing returns, stronger prose wording is the same probabilistic instruction that is already failing, and a restatement preamble adds extra text that itself violates the required four-section output.

*Hint if stuck: Prose has already been tried in detail; ask what else can carry a format to the model.*
</details>

---

## Question 48
A healthcare intake assistant classifies patient messages as urgent, routine, or administrative. Accuracy on clear-cut messages is 98 percent, but messages mixing signals, like a medication-refill request that also mentions new chest pain, get classified inconsistently across runs. The prompt already contains three clear examples of each category. What should you add?

A) More clear-cut examples of each category, scaling up to ten per class so every label is better represented
B) An instruction telling the model to use its best clinical judgment whenever a message contains mixed signals
C) A higher extended-thinking budget so the model reasons for longer about every incoming patient message
D) A few examples of mixed-signal messages, each paired with the correct label and the reasoning that justifies it

<details>
<summary>Answer & explanation</summary>

**D)** The failures are concentrated in ambiguous inputs, so the examples must demonstrate how to resolve ambiguity, and including the reasoning teaches the decision process rather than just the answer. More clear-cut examples reinforce what already works, 'use best judgment' gives the model no new decision rule, and a bigger thinking budget adds latency to every message without supplying the missing tie-breaking criteria.

*Hint if stuck: Ask where the errors cluster and what the prompt currently teaches about those cases.*
</details>

---

## Question 49
An extraction pipeline pulls sample_size from research papers. When the paper has a Methods section it works; when the sample size is mentioned inside the results text, the model returns null even though the number is there. What change best fixes this?

A) Add few-shot examples showing correct extraction from both layouts: a dedicated Methods section and figures embedded in results text
B) Make sample_size a required field in the extraction schema so the model must always provide a value, even for papers with unusual layouts
C) Retry each null result with the same prompt up to three times
D) Add a paragraph explaining that sample sizes can appear anywhere

<details>
<summary>Answer & explanation</summary>

**A)** Few-shot examples that show varied document structures are the most effective way to reduce empty extractions caused by layout differences. A required field pushes the model to invent values when the data really is absent, unchanged retries repeat the failure, and prose explanations are weaker than demonstrations.

*Hint if stuck: Ask what the model has seen that would tell it the number can live somewhere other than Methods.*
</details>

---

## Question 50
A support agent handles clear requests well, but ambiguous ones like 'where's my money?', which could be a refund status check or a billing dispute, are routed inconsistently between check_refund_status and open_billing_dispute. What is the most effective improvement?

A) Add twenty clear-cut examples for each tool
B) Add a keyword router in front of the agent that picks the tool based on terms like refund, charge, or transfer in the request
C) Merge the two tools into one handle_money_question tool
D) Add two to four examples of ambiguous requests, each showing which tool was chosen and why the other was not

<details>
<summary>Answer & explanation</summary>

**D)** Few-shot examples work best when they target the ambiguous cases and show the reasoning for one choice over a plausible alternative, which lets the model generalise its judgement. Many clear-cut examples don't cover the hard cases, a keyword router bypasses the model's understanding, and merging tools just hides the decision.

*Hint if stuck: Ask which requests the agent currently gets wrong and what the prompt shows it about them.*
</details>

---

## Question 51
A lease-abstraction pipeline extracts `commencement_date` from commercial leases written in the US, UK and Germany. The schema declares the field as a string, and output arrives as "03/04/2025", "4 March 2025" and "04.03.2025", so downstream systems misread US and UK dates. Every response is schema-valid. What should the team add?

A) A normalization rule in the field description: output ISO 8601, reading day-month order by the lease's jurisdiction
B) A stricter string pattern in the schema so that only one punctuation style is accepted for every date
C) A downstream parser that tries each common date format in turn, in order of frequency, and keeps the first one that succeeds
D) A second extraction pass that asks the model to double-check each date it returned the first time

<details>
<summary>Answer & explanation</summary>

**A)** A schema guarantees shape, not meaning; normalization rules alongside it tell the model the single output format and how to resolve day-month order, which is the actual ambiguity. A punctuation pattern forces one style but can still swap day and month, a first-match parser silently picks the wrong reading of 03/04, and a double-check pass has no rule to check against.

*Hint if stuck: The schema fixes the type; something else has to fix the convention.*
</details>

---

## Question 52
A support agent records each case's outcome through a `log_resolution` tool whose `refund_amount` field is a string. Values arrive as "$45", "45.00 USD", "forty-five dollars" and "45", and the finance export fails on a third of them. What is the best schema change?

A) Keep the field as a string and add a downstream script that strips currency words and symbols before the finance export runs
B) Make `refund_amount` a number, add a `currency` enum field, and add a rule to record amounts without symbols
C) Add a sentence to the system prompt asking the agent to write amounts in a consistent and tidy format
D) Make `refund_amount` an enum of the refund amounts the business most often issues to its customers

<details>
<summary>Answer & explanation</summary>

**B)** Typing the amount as a number and splitting currency into an enum lets the schema enforce the shape, and a normalization rule removes the remaining ambiguity. A cleanup script chases every new variant after the fact, a prompt request for tidiness is not enforced, and an enum of common amounts cannot represent the many legitimate values.

*Hint if stuck: Let the types carry the structure instead of cleaning up free text later.*
</details>

---

## Question 53
A freight pipeline extracts shipment weight from bills of lading as a number. Some documents state pounds and others kilograms, and the model returns the number exactly as written, so a 2,000 lb load and a 2,000 kg load look identical downstream. What is the best fix?

A) Ask the model to convert every weight to kilograms before answering and return only the converted number in the field
B) Assume every weight is in kilograms, since most of the carriers in the network operate in metric countries
C) Add a `weight_unit` enum of kg and lb beside the number, recording the unit exactly as the document states it
D) Reject any document whose weight unit is not kilograms and send it to a human for manual entry

<details>
<summary>Answer & explanation</summary>

**C)** Capturing the unit in the schema, as an enum filled from what the document states, stops two very different loads from looking the same and leaves downstream code free to convert reliably. Assuming kilograms is wrong for every pound document, having the model convert without recording the unit hides the source value and makes any misread unit or arithmetic slip undetectable, and rejecting every pound document creates needless manual work.

*Hint if stuck: Ask what a downstream reader needs in order to interpret the figure 2,000 correctly.*
</details>

---

## Question 54
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

## Question 55
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

## Question 56
A loan-application extractor has a required `co_applicant_name` string. When there is no co-applicant, the model sometimes returns an empty string and sometimes copies the primary applicant's name, and underwriting cannot tell "no co-applicant" from a bad extraction. What is the best schema design?

A) Keep the field required and tell the model to write "N/A" whenever no co-applicant appears anywhere on the form
B) Make the field nullable, describe null as meaning no co-applicant is listed, and add a `has_co_applicant` boolean
C) Remove the co-applicant field and extract it in a separate request made only when underwriting asks for it
D) Keep the field required and have a validator reject any co-applicant name that matches the primary applicant

<details>
<summary>Answer & explanation</summary>

**B)** A nullable field with a clear meaning for null, plus an explicit boolean, lets the model state that no co-applicant exists instead of inventing or blanking a value. A sentinel string like "N/A" mixes a status into a name field, a match-the-primary validator catches only one of the failure modes, and a separate on-demand request adds work without fixing the schema.

*Hint if stuck: Give absence its own honest representation.*
</details>

---

## Question 57
A research coordinator receives each search subagent's results as prose with inline citations and uses regular expressions to pull out claims, source URLs and publication dates. Every change in the subagent's phrasing breaks the parser, and some claims lose their sources. What is the best design change?

A) Have the coordinator ask a separate model to re-read each prose result carefully and list every claim it can identify in it
B) Ask each subagent to keep its prose format identical every time so that the regular expressions continue to work
C) Have subagents return findings via a `submit_findings` tool with claim, source_url and published_date per item
D) Let the coordinator rely only on claims that appear in more than one subagent's prose output

<details>
<summary>Answer & explanation</summary>

**C)** A tool with a schema that pairs each claim with its source and date makes the hand-off structured, so the coordinator no longer parses prose and claim-source links are kept. Asking for identical prose is advisory and fragile, a re-reading model adds another lossy step, and requiring agreement across subagents throws away valid single-source findings.

*Hint if stuck: Make the hand-off a structure, not text to be parsed.*
</details>

---

## Question 58
A developer productivity agent generates deployment config entries, and its `environment` field is a free string. Engineers find "prod", "Production", "PRD" and "live" in the same repository, and the deploy tool only recognizes three exact values. What is the most effective fix?

A) Add a lookup table in the deploy tool that maps every spelling seen so far to the three recognized values
B) Ask the agent in the prompt to always spell environments in the same way as the other files in the repo
C) Rename the field to `deployment_environment` so the agent better understands which value it should use
D) Change the field to an enum of the three values the deploy tool accepts, with a description of each

<details>
<summary>Answer & explanation</summary>

**D)** An enum restricts the output to exactly the values the deploy tool accepts, and descriptions help the model map intent to the right value. A lookup table chases spellings that keep appearing, a prompt request is not enforced, and renaming the field does not limit the values.

*Hint if stuck: If only a fixed set of values is valid, make the schema say so.*
</details>

---

## Question 59
A support agent records related order IDs in a required `related_orders` array. For customers with no related orders, the model sometimes invents a plausible order number so the array is not empty. What is the best fix?

A) State in the description that the array lists only order IDs mentioned in the conversation, and is empty if none are
B) Remove `related_orders` from the schema and ask the agent to mention related orders in the free-text notes
C) Make the array require at least one item so the model must look harder for a real order before answering
D) Add a validator that checks every listed order ID against the order database and rejects the whole record on any miss

<details>
<summary>Answer & explanation</summary>

**A)** Stating that the array holds only order IDs that appear in the conversation, and should be empty when there are none, gives the model a valid way to express absence. Requiring at least one item forces invention, moving the data into free text loses structure, and a database check catches fabrications after the fact without stopping them.

*Hint if stuck: Make sure the schema lets the model say there is nothing to report.*
</details>

---

## Question 60
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

## Question 61
A purchase-order extractor uses a schema where `line_items` is a single string. The model returns values like "Widget A x2 @ 4.50; Bolt M8 x100 @ 0.12", and the ERP import script breaks whenever a product name contains a semicolon or the letter x. What is the best schema change?

A) Ask the model to use a rarer separator, such as a pipe, between line items in the string
B) Keep the string but have a second model call split it into separate lines before the ERP import runs
C) Make `line_items` an array of objects with description, quantity and unit_price fields, each typed
D) Add a rule asking the model to wrap each product name in double quotes inside the string before it returns

<details>
<summary>Answer & explanation</summary>

**C)** An array of typed objects encodes the structure directly, so no delimiter can collide with product names and quantities and prices arrive as numbers. A rarer separator only moves the collision, a second splitting call is another fragile parse, and quoting names fails as soon as a name itself contains a quote mark.

*Hint if stuck: Represent structure in the schema, not in a delimited string.*
</details>

---

## Question 62
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

## Question 63
A CI test-generation step returns results through a tool whose schema has `test_type` as an enum of unit, integration and e2e. Some generated tests are contract tests, so the model files them under integration and the team cannot tell them apart later. The team wants to discover how many new kinds of test appear before deciding on more enum values. What change fits best?

A) Add an "other" value with an `other_detail` string to fill in, and review those details to decide later additions
B) Remove the enum entirely and let `test_type` be a free string so the model can name any kind of test that it encounters
C) Add an "unclear" enum value so the model can flag tests whose type it is unable to determine
D) Keep the three values and tell the model in the prompt to put anything unusual under integration

<details>
<summary>Answer & explanation</summary>

**A)** "Other" plus a detail field keeps the enum's structure while capturing new categories in words the team can review and promote later. A free string loses the controlled values for every test, "unclear" is for cases the model cannot judge, not ones it can name but that fall outside the list, and forcing them into integration is today's problem.

*Hint if stuck: Leave room for the unexpected without giving up the controlled list.*
</details>

---

## Question 64
A document-extraction pipeline is moving to Claude Opus 5.5. Its requests set tool_choice to {"type": "tool", "name": "record_invoice"} so every response is a call carrying the extracted fields, and on the new model those requests now fail with a 400 error. The team still needs each invoice to come back as schema-valid record_invoice input. What should they change?

A) Set tool_choice to any, which still makes Claude call one of the tools and is accepted on the new model where naming one tool is rejected
B) Remove the tools array, ask for the fields as JSON in the reply text, and pull them out of each reply with a regular expression
C) Keep the forced tool_choice and wrap each request in a retry loop, because the 400 error is a transient fault that clears on a later try
D) Set tool_choice to auto, add strict: true to record_invoice, and instruct Claude in the prompt to record each invoice with that tool

<details>
<summary>Answer & explanation</summary>

**D)** On Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1, both any and a named tool return a 400, and the docs point to auto with strict tool use (or structured outputs for a fixed JSON reply). strict: true guarantees the inputs match the schema, and the prompt steers which tool auto picks. any is rejected on these models too, although on models that support forced tool use it remains a valid way to guarantee a call. Regex over free text gives up the schema guarantee, and the 400 is a permanent model restriction, not a transient fault.

*Hint if stuck: Separate the two guarantees the old setting gave you, and ask which of them the new model still lets you enforce at the API level.*
</details>

---

## Question 65
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

## Question 66
An e-commerce pipeline asks Claude to return product attributes as JSON in a plain text response. About 2 percent of responses begin with 'Here is the extracted JSON:' or wrap the object in a code fence, crashing the downstream parser. The prompt already says 'respond with only the JSON object, no other text.' What is the root-cause fix?

A) Use strict structured outputs or a tool_use schema so conformance is guaranteed rather than requested through instructions
B) Add a regex preprocessing step that strips any leading prose and code fences before the parser runs
C) Repeat the JSON-only instruction at both the start and the end of the prompt so the model cannot miss it
D) Detect parse failures at runtime and automatically resend the request until a clean JSON response comes back from the model

<details>
<summary>Answer & explanation</summary>

**A)** Prompt instructions are probabilistic and will occasionally be violated at scale; strict structured outputs or tool_use with a schema make conformance a guarantee of the API rather than a request. Regex stripping and retry loops patch the symptom while leaving the unreliable mechanism in place, and repeating the instruction is more of the same best-effort approach.

*Hint if stuck: Ask which option turns 'please format it this way' into a guarantee.*
</details>

---

## Question 67
An insurance claims pipeline extracts fields from faxed forms using a tool_use schema where policy_number is a required string. When a fax is missing the policy number, about 1 in 30, the model fills in a realistic-looking but invented value, which downstream systems then attempt to look up and fail on. What is the root-cause fix?

A) Add a prompt warning: 'Never fabricate a policy number; write UNKNOWN if it is absent from the document'
B) Add a post-extraction validator that checks each policy number against the policy database and discards misses
C) Change policy_number to type ['string','null'] so the schema itself gives the model a way to report absence
D) Add few-shot examples of faxes that do include policy numbers so extraction of the field becomes more reliable

<details>
<summary>Answer & explanation</summary>

**C)** A required field forces the model to produce a value even when none exists, which is exactly what drives fabrication; making the field nullable gives the model a legitimate way to say not present. A prompt warning is a probabilistic patch over a schema that still demands a value, database validation catches fabrications after the fact instead of preventing them, and examples of present values do nothing for absent ones.

*Hint if stuck: When the schema demands a value the document may not contain, the schema is the problem.*
</details>

---

## Question 68
A logistics intake system classifies shipping documents with an enum field of six values: bill_of_lading, packing_list, customs_declaration, invoice, delivery_receipt, insurance_certificate. A carrier starts sending a new dangerous-goods declaration form, and the model silently labels every one as customs_declaration. How should the schema evolve?

A) Replace the enum with a free-text document_type string so the model can name any document it encounters
B) Add dangerous_goods_declaration to the enum and plan to extend the list whenever a new form type appears
C) Keep the enum but instruct the model to pick a category only when it is confident the document truly matches it
D) Add an other value to the enum alongside a free-text detail field that captures what the document appears to be

<details>
<summary>Answer & explanation</summary>

**D)** A closed enum forces the model to misfile anything outside the list; an other value plus a free-text detail field lets unknown documents surface visibly instead of silently corrupting a known category. Adding one new enum value fixes today's form but leaves the same silent-misfiling failure waiting for the next one, free text sacrifices the structure downstream systems rely on, and a confidence instruction still gives the model no valid label to choose.

*Hint if stuck: Design the schema so inputs outside the known categories become visible instead of being force-fit.*
</details>

---

## Question 69
A legal-discovery pipeline receives unlabeled documents that may be contracts, depositions, or court filings, with a dedicated extraction tool for each type. With tool_choice set to auto, the model sometimes replies in prose asking which document type it is looking at instead of extracting anything. The pipeline runs on a model that supports every tool_choice mode. What configuration fixes this?

A) Set tool_choice to any so the model must call one of the extraction tools, choosing which based on the document's content
B) Set tool_choice to force the contracts tool, since contracts make up the majority of the incoming document stream
C) Add a system-prompt rule stating the model must never respond with a clarifying question during an extraction run
D) Combine the three tools into a single extractor whose schema is a union of all three document types' fields

<details>
<summary>Answer & explanation</summary>

**A)** On a model that supports it, tool_choice any guarantees a tool call on every request while leaving the model free to pick the right extractor for the content, the exact fit for unlabeled streams with one tool per document type. Forcing a specific named tool misroutes every non-contract, a prompt rule against clarifying questions is best-effort rather than a guarantee, and a union schema blurs three focused tools into one ambiguous surface. (The newest models reject any and forced tool_choice; there the docs recommend auto with strict tool use.)

*Hint if stuck: Ask which setting rules out a prose reply without deciding in advance what kind of file it is.*
</details>

---

## Question 70
A research-ingestion agent must always log a paper's title, authors, and venue via its extract_metadata tool before doing anything else, then decide among summarize_abstract, extract_citations, or finishing. It runs on a model that supports forced tool use. In testing, the model occasionally skips metadata and goes straight to summarization. How do you enforce the ordering?

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

## Question 71
After migrating an expense-report extractor to strict structured outputs, an engineer opens a PR deleting the downstream validation layer that checks each report's category subtotals against its grand total, arguing that 'the output is schema-guaranteed now.' How should you respond?

A) Keep the validation layer, since strict mode fixes the output's shape but not whether its numbers add up
B) Approve the deletion, since strict structured outputs make schema violations impossible and the checks are now dead code
C) Replace the validation layer with a prompt instruction requiring that subtotals always sum exactly to the grand total
D) Encode the subtotal constraint directly in the JSON schema so the API enforces the arithmetic at generation time

<details>
<summary>Answer & explanation</summary>

**A)** Strict structured outputs harden the syntactic guarantee of well-formed JSON matching the schema, but say nothing about whether the values are right, so semantic invariants like subtotal arithmetic still need programmatic checks. JSON Schema cannot express cross-field arithmetic constraints, so that option is not implementable, and a prompt instruction downgrades a deterministic check to a best-effort request.

*Hint if stuck: Ask what kind of mistake the old validation layer was written to catch.*
</details>

---

## Question 72
A medical-records pipeline, on a model that supports forced tool use, forces its first call with tool_choice set to the extract_patient_header tool, which works, but the integration leaves that same tool_choice on every subsequent request. The model now re-extracts the header repeatedly and never calls extract_medications or produces its final summary. What is the fix?

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

## Question 73
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

## Question 74
A research system's report subagent uses output_config.format with a JSON schema so the coordinator can parse each section. The team now also wants source-anchored citations, so it enables citations on the attached documents in the same request. Every request starts failing with a 400 error. What is the right design?

A) Ask for the citations as a JSON array in the schema and leave the citations feature switched on
B) Lower max_tokens so the citation blocks fit inside the schema's string fields without a conflict
C) Keep citations and the schema in separate requests, or carry source quotes as fields in the schema
D) Add the structured-outputs beta header, which lets citations and a JSON schema share one request

<details>
<summary>Answer & explanation</summary>

**C)** Structured outputs are incompatible with citations: citations interleave citation blocks with text, which conflicts with strict schema constraints, and the API returns a 400 when both are on. The fix is to split the work (a cited request and a structured one) or to drop the feature and capture quotes and document references as schema fields. Structured outputs are generally available, and no header makes the two compatible. Keeping the feature on still triggers the 400, and max_tokens has nothing to do with it.

*Hint if stuck: Ask whether two output features impose conflicting shapes on the same response.*
</details>

---

## Question 75
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

## Question 76
An extraction service moved from prompt-only JSON to output_config.format with a JSON schema. The old code prefilled the assistant turn with an opening brace to push the model straight into JSON, and the migration ticket asks whether that prefill should stay. What is the right call?

A) Keep the prefill and add a beta header, which is what lets a prefill coexist with a JSON schema
B) Remove the prefill, because the schema already shapes the output and prefills don't work with it
C) Extend the prefill to the first key as well, so the start of the output lines up with the schema
D) Move the opening brace into the system prompt, which has the same effect as a prefill with schemas

<details>
<summary>Answer & explanation</summary>

**B)** Prefilling is listed as incompatible with JSON outputs, and it is unnecessary: constrained decoding already guarantees the response follows the schema from its first token. A longer prefill makes the conflict no better, a brace in the system prompt is just text with no effect on decoding, and structured outputs are generally available with no beta header, nor does any header make prefills compatible.

*Hint if stuck: Ask what job the prefill was doing and whether anything in the new setup already does it.*
</details>

---
