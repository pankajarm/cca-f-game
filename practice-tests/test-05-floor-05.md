# Practice Test 05: The Config Maze
**D3: Claude Code Configuration & Workflows** (20% of the exam) — CLAUDE.md, rules, skills, commands

15 questions. Exam pace is 2 minutes per question; aim for 30 minutes.
Pass bar in the game: 7/10 on a random draw. Pass bar here: be honest.

---

## Question 1
A fintech payments team of 12 engineers shares one repository. The tech lead wrote the team's TypeScript strict-mode and ledger error-handling standards into ~/.claude/CLAUDE.md on her laptop. Two new hires consistently generate code that violates these standards, and nobody can figure out why the rules are not being applied. What is the correct fix?

A) Have every engineer copy the standards file into their own ~/.claude/CLAUDE.md
B) Commit the standards to the project-level CLAUDE.md in the repository root
C) Store the standards as environment entries in .claude/settings.json so they apply repo-wide
D) Package the standards as a skill so Claude auto-invokes them whenever someone writes code

<details>
<summary>Answer & explanation</summary>

**B)** User-level ~/.claude/CLAUDE.md is personal memory that lives only on one machine, so teammates never load it. Team standards belong in the version-controlled project CLAUDE.md, which every clone picks up automatically. Copying files per engineer reintroduces drift; settings.json holds permissions, hooks, and env rather than coding guidance; and a skill triggers probabilistically per task, while always-relevant standards must be reliably present in memory.

*Hint if stuck: Consider which level of the CLAUDE.md hierarchy travels with the repository rather than with one person's machine.*
</details>

---

## Question 2
A SaaS monorepo has packages/api built on Fastify and packages/dashboard built on React. The root CLAUDE.md documents both sets of conventions, and engineers report Claude applying React component patterns while editing API route handlers. Which change best fixes the misapplied conventions?

A) Place a directory-level CLAUDE.md inside each package containing only that package's conventions
B) Expand the root CLAUDE.md with conditional prose such as: when working in packages/api, ignore the React sections
C) Split the monorepo into two repositories so each codebase gets its own dedicated CLAUDE.md
D) Create one skill per package and tell engineers to invoke the matching one before editing

<details>
<summary>Answer & explanation</summary>

**A)** Directory-level CLAUDE.md files scope guidance to the subtree where work is happening, so each package loads only its own conventions. Conditional prose in one big file is probabilistic — the model must remember to filter, which is exactly what is failing here. Splitting the repo is a drastic structural change to solve a configuration problem, and per-package skills depend on engineers remembering to invoke the right one before every edit.

*Hint if stuck: The CLAUDE.md hierarchy has a level designed for subtree-specific guidance.*
</details>

---

## Question 3
A customer-support team ships a skill that drafts refund-decision emails. Compliance requires that this skill never execute shell commands. The SKILL.md body states Never use Bash in bold, yet audit logs from last week show two sessions where the skill ran Bash anyway. What is the root-cause fix?

A) Repeat the prohibition in all caps at both the top and bottom of the skill body
B) Declare allowed-tools in the SKILL.md frontmatter listing only the tools the skill needs
C) Add a project-wide PreToolUse hook that blocks every Bash invocation in the repository
D) Lower the sampling temperature so the model follows the skill's instructions more reliably

<details>
<summary>Answer & explanation</summary>

**B)** Instructions in a skill body are probabilistic; allowed-tools in the frontmatter is a deterministic restriction the harness enforces, scoped exactly to this skill. The project-wide hook is also deterministic but overbroad — it breaks every other workflow that legitimately needs Bash. Stronger wording and temperature tweaks leave compliance to chance.

*Hint if stuck: Look for the deterministic enforcement mechanism whose scope matches the thing being restricted.*
</details>

---

## Question 4
A platform team maintains 60 lines of secure-coding standards used by 14 service packages in a monorepo. Each package's CLAUDE.md currently holds a pasted copy. After the standards changed last sprint, an audit found 9 of the 14 copies were stale. How should the team restructure this?

A) Add a sync script engineers are expected to run that re-copies the standards into all 14 CLAUDE.md files
B) Move the standards into each engineer's ~/.claude/CLAUDE.md and announce updates in Slack
C) Merge all 14 package files into a single large root CLAUDE.md so there is only one copy
D) Keep one canonical standards file and reference it from each package CLAUDE.md via @import

<details>
<summary>Answer & explanation</summary>

**D)** @import composes memory files, so 14 packages can share one canonical source that updates everywhere at once with no duplication. A sync script keeps 14 duplicates on disk and depends on every engineer remembering to run it — the same human-discipline failure that produced the stale copies. User-level placement loses version control and team sharing, and one giant root file forces every session to carry all 14 packages' content.

*Hint if stuck: There is a composition mechanism that lets many CLAUDE.md files share a single source of truth.*
</details>

---

## Question 5
In a repository of GitHub Actions pipelines, Claude has stopped following the YAML formatting conventions that should come from a directory-level CLAUDE.md inside .github/workflows. Before changing any configuration, the engineer wants to confirm whether that file is actually being loaded. What is the right first step?

A) Restart the session and repeat the request to see whether the behavior changes
B) Paste the conventions directly into the chat so the current task can proceed
C) Run /reload-skills to force the session to rescan its configuration tree
D) Run /memory to inspect exactly which memory files the session has loaded

<details>
<summary>Answer & explanation</summary>

**D)** /memory shows which CLAUDE.md and memory files are loaded, turning a guess into a diagnosis. /reload-skills rescans skills, not memory files. Restarting or pasting content are blind workarounds that may mask the symptom without revealing whether the hierarchy is wired correctly.

*Hint if stuck: Diagnose what the session actually loaded before patching behavior.*
</details>

---

## Question 6
A document-processing team built .claude/skills/invoice-extractor/SKILL.md with a 200-line body of extraction rules for vendor invoices. Its frontmatter description reads: Internal helper for documents. Users paste invoices constantly, but the skill never auto-invokes. What should the team change?

A) Rewrite the description to state what it does and when to use it, naming vendor invoices
B) Add a line to the project CLAUDE.md instructing Claude to always use the invoice-extractor skill
C) Move the 200 lines of extraction rules from the body into the description so the model sees them
D) Set context: fork in the frontmatter so the skill executes in its own isolated context

<details>
<summary>Answer & explanation</summary>

**A)** The frontmatter description drives auto-invocation; a vague phrase like Internal helper for documents gives the model nothing to match against invoice tasks. The CLAUDE.md directive is a probabilistic patch on top of the broken description and adds permanent context cost. Stuffing the body into the description destroys progressive disclosure, and context: fork affects execution, not triggering.

*Hint if stuck: Ask which piece of skill metadata the model actually reads when deciding whether to trigger it.*
</details>

---

## Question 7
An engineer at an e-commerce company built a /release-checklist slash command in ~/.claude/commands that walks through the team's deployment checklist. During an incident, a teammate tried to run it and the command did not exist in her session. What is the right fix?

A) Have the teammate recreate the command file under her own ~/.claude/commands directory
B) Convert the checklist into a skill so it auto-invokes whenever a deployment is discussed
C) Paste the checklist into the project CLAUDE.md so it is available in every session
D) Move the command file into the repository's .claude/commands directory and commit it

<details>
<summary>Answer & explanation</summary>

**D)** ~/.claude/commands is personal scope — commands there exist only on the author's machine. Shared workflows belong in the project's .claude/commands directory, where they version with the repo and reach every teammate. Per-user recreation drifts over time; converting to a skill trades a deliberately explicit workflow for probabilistic triggering when the real problem is scope; and putting an on-demand checklist in CLAUDE.md pays an always-on context cost for content needed only at release time.

*Hint if stuck: Where a command file lives determines who can invoke it.*
</details>

---

## Question 8
A logistics startup's project CLAUDE.md has grown to 520 lines: about 40 lines of universal coding standards, 180 lines of test-writing guidance, 150 lines of API-package specifics, and a 150-line deployment runbook used a few times a month. Engineers report mid-file rules being ignored, and every session carries the full token cost. What is the best restructuring?

A) Reorder the file so the most important rules sit at the top and bottom where model attention is strongest
B) Split the content into ten topic files and @import every one of them from CLAUDE.md so the main file itself stays short
C) Keep the 40 universal lines in CLAUDE.md, move scoped guidance to .claude/rules/ with paths globs, and make the runbook a skill
D) Relocate the entire file to ~/.claude/CLAUDE.md so the content loads from the user level instead of the repository

<details>
<summary>Answer & explanation</summary>

**C)** Only universally applicable standards should be always-on; path-scoped rules load when matching files are touched, and a skill body loads only when invoked thanks to progressive disclosure. The @import split is cosmetic — imported files still load every session, so the token cost and lost-in-the-middle problem remain. Reordering treats the attention symptom but fixes neither cost nor scoping, and moving everything to the user level loses version control while still loading all 520 lines.

*Hint if stuck: Match each block of content to the loading mechanism with the right scope and trigger.*
</details>

---

## Question 9
Six hours into a session on a healthcare data-extraction project, an engineer creates a new skill at .claude/skills/redact-phi/SKILL.md. When she asks Claude to use it in the same session, Claude responds that no such skill exists. She does not want to lose the session's accumulated context. What should she do?

A) Exit and restart Claude Code, because skills are only discovered when a session starts
B) Run /reload-skills so the current session rescans the skills directory
C) Run /compact so the refreshed context window picks up the new skill
D) Tell Claude the file path in chat so it reads SKILL.md and follows it manually

<details>
<summary>Answer & explanation</summary>

**B)** /reload-skills rescans the skills tree mid-session, registering the new skill without discarding context. Restarting would work but throws away six hours of session state for no reason. /compact summarizes history and has nothing to do with skill discovery, and a manual Read bypasses the skill machinery entirely — no auto-invocation and no allowed-tools enforcement.

*Hint if stuck: There is a session command built specifically for picking up skill changes without starting over.*
</details>

---

## Question 10
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

## Question 11
An edtech React app keeps 80 lines of test-writing guidance (React Testing Library queries, a ban on snapshot tests) in its project CLAUDE.md, so every session loads it — including backend-only work. Test files are colocated with their components as *.test.tsx throughout src/. How should this guidance be scoped?

A) Keep it in CLAUDE.md but preface it with: apply the following section only when editing test files
B) Move it to .claude/rules/testing.md with paths: ["**/*.test.tsx"] in the YAML frontmatter
C) Add a directory-level CLAUDE.md inside a central __tests__ folder that holds the guidance
D) Convert the guidance into a slash command that engineers run before starting test work

<details>
<summary>Answer & explanation</summary>

**B)** .claude/rules/ files with a paths glob in their frontmatter apply only when matching files are in play, which is exactly the scoping needed for colocated test files. A prose preface still loads all 80 lines everywhere and relies on the model to self-filter. A __tests__ directory CLAUDE.md cannot work because the tests are colocated, and a slash command depends on engineers remembering to run it.

*Hint if stuck: One mechanism attaches guidance to file patterns rather than to directories or whole sessions.*
</details>

---

## Question 12
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

## Question 13
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

## Question 14
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

## Question 15
A developer-productivity team is designing two helpers: one generates release notes and is run explicitly by an engineer before each release with a version tag; the other is a database-migration safety checklist that should engage automatically whenever Claude touches migration files. How should each be implemented?

A) Both as skills, since skills handle both arguments and automatic triggering
B) Both as slash commands, so engineers stay in explicit control of when each runs
C) A slash command for the release notes and a description-driven skill for the migration checklist
D) A skill for the release notes and a slash command for the migration safety checklist

<details>
<summary>Answer & explanation</summary>

**C)** The release-notes flow is user-initiated with an argument — the classic slash command shape, giving deterministic on-demand invocation. The migration checklist must fire without anyone remembering to ask, which is exactly what a skill's description-driven auto-invocation provides. Making both skills leaves the deliberately explicit release flow to probabilistic triggering; making both slash commands loses the automatic safety net; and reversing the pairing puts manual invocation on the workflow that most needs to be automatic.

*Hint if stuck: Sort each helper by who initiates it: the human or the model.*
</details>

---
