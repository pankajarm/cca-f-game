# Practice Test 05: The Config Maze
**D3: Claude Code Configuration & Workflows** (20% of the exam) · task statements 3.1, 3.2, 3.3

83 questions. Exam pace is 2 minutes per question.

---

## Question 1
Priya, one of nine engineers on a shared web repo, wants Claude Code to use her personal staging URL and her preferred test account whenever she works in this project. Her teammates must not see or load these details, and they are irrelevant to her other projects. Where should she put them?

A) In a CLAUDE.local.md at the project root, added to .gitignore so it stays on her machine only
B) In her ~/.claude/CLAUDE.md, since user-level memory is private and is not shared with the team
C) In .claude/settings.local.json as env entries, since local settings are already ignored by git
D) In the project CLAUDE.md under a heading that says the section applies to Priya's sessions alone

<details>
<summary>Answer & explanation</summary>

**A)** CLAUDE.local.md is the personal, project-specific memory file: it loads alongside the project CLAUDE.md for her only and stays out of version control. A labelled section in the shared CLAUDE.md still loads for every teammate. User-level memory would apply her staging URL to every project she opens, and settings files hold configuration such as permissions and env vars, not instructions.

*Hint if stuck: Two constraints apply: private to one person, and specific to one project.*
</details>

---

## Question 2
A contractor uses Claude Code across eleven client repositories. She always wants explanations kept short and wants pnpm suggested over npm when both would work. None of the clients' teams should be affected by these preferences. Where should she record them?

A) In each client repository's CLAUDE.local.md, recreated whenever she clones a new client repo
B) In each client's project CLAUDE.md, flagged as optional preferences that other engineers may ignore
C) In her user-level ~/.claude/CLAUDE.md, which applies across all her projects and is not shared
D) In the opening message of each session, so the preferences stay out of any shared file

<details>
<summary>Answer & explanation</summary>

**C)** User-level memory is the place for personal preferences that span all projects, and it stays on her machine. Per-repo local files work but must be recreated for every client, which is the duplication user scope avoids. Writing preferences into clients' shared CLAUDE.md imposes them on their teams, and retyping them each session is unreliable.

*Hint if stuck: Match the scope of the file to the scope of the preference: one person, every project.*
</details>

---

## Question 3
A monorepo's root CLAUDE.md says to write tests with Jest. packages/web/CLAUDE.md says to use Vitest. When Claude works in packages/web, it sometimes writes Jest tests and sometimes Vitest tests. The team assumed the deeper file would override the root. What should they change?

A) Move the Vitest line to the top of packages/web/CLAUDE.md so it is read before the root instruction
B) Add IMPORTANT in capitals to the Vitest instruction so it outweighs the Jest line in the root file
C) Copy the full root CLAUDE.md into packages/web with Jest replaced, so a single file loads there
D) Scope the root line to non-web packages so the two files no longer contradict each other

<details>
<summary>Answer & explanation</summary>

**D)** CLAUDE.md files are concatenated into context rather than overriding each other, so contradictory instructions leave Claude to pick one arbitrarily; the fix is to remove the conflict. Reordering lines or adding emphasis keeps both instructions in context and only shifts the odds. Copying the root file into the package does not stop the root from loading, and it duplicates content that will drift.

*Hint if stuck: Before tuning order or emphasis, check whether Claude Code lets a deeper CLAUDE.md replace a parent one.*
</details>

---

## Question 4
An engineer starts Claude Code at the root of a monorepo and asks it to plan a change to the billing service before it has opened any billing files. The plan ignores conventions documented in services/billing/CLAUDE.md. Later in the same session, after Claude edits billing code, its suggestions follow them. What explains this, and what is the best adjustment?

A) Subdirectory CLAUDE.md files load on demand when Claude touches files there; start in that folder or read them first
B) Nested files load only once a command names them; adding /memory to every prompt will force the load
C) The root CLAUDE.md overrides nested ones at planning time, so the billing rules must move to the root
D) The billing file failed to parse; rewriting it as plain prose without any Markdown headings will make it load reliably

<details>
<summary>Answer & explanation</summary>

**A)** CLAUDE.md files above the launch directory load at startup, while files in subdirectories load once Claude reads or edits files in that subdirectory, which matches the observed behaviour. Launching from services/billing, or having Claude read billing files before planning, gets the conventions in early. Nothing suggests a parse failure, /memory is for inspecting what loaded rather than forcing loads, and the root file does not override nested ones.

*Hint if stuck: Consider when, not just whether, each CLAUDE.md enters the context.*
</details>

---

## Question 5
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

## Question 6
At a media company, Claude Code keeps suggesting moment.js even though the repo's CLAUDE.md never mentions it and the team removed the library a year ago. Engineers have searched the project's CLAUDE.md files and found nothing. What is the most effective first diagnostic step?

A) Delete and recreate the project CLAUDE.md from scratch so any hidden stale content is removed
B) Add a line to the project CLAUDE.md that says never use moment.js and see if the suggestions stop
C) Run /memory to see which memory files are loaded, including user-level and parent-directory files
D) Grep the git history of the project CLAUDE.md for moment.js to find when the line was deleted

<details>
<summary>Answer & explanation</summary>

**C)** The instruction is coming from somewhere outside the files the team checked, so the first step is to inspect the memory files in play: /memory lists the user, project and parent-directory memory file locations, such as a personal ~/.claude/CLAUDE.md (in current versions /context shows exactly which CLAUDE.md and rules files loaded). Adding a counter-instruction leaves a contradiction in place without finding its source. Recreating or searching the history of the project file looks in the one place already ruled out.

*Hint if stuck: Before fixing an unexpected instruction, find out where it is coming from.*
</details>

---

## Question 7
A developer works in one team's package inside a large monorepo. Claude Code loads the monorepo's top-level CLAUDE.md, written for another group, and its conventions keep pulling her sessions toward a different test framework. Her teammates are fine with that file loading for them. What should she configure?

A) Delete the top-level CLAUDE.md in her working copy and keep that deletion out of her commits
B) Add a line to her package's CLAUDE.md telling Claude to ignore the root file's test conventions
C) Add the root file's path to claudeMdExcludes in the committed .claude/settings.json for the team
D) Add the root file's path to claudeMdExcludes in her .claude/settings.local.json

<details>
<summary>Answer & explanation</summary>

**D)** claudeMdExcludes skips specific CLAUDE.md and rules files by path or glob pattern, and putting it in .claude/settings.local.json keeps the exclusion on her machine. Setting it in the committed project settings would also drop the file for teammates who want it. A counter-instruction leaves both sets of conventions in context to conflict, and deleting the file locally is easy to lose or to commit by accident.

*Hint if stuck: She wants the file gone from her sessions and nobody else's; think about both what to set and where it lives.*
</details>

---

## Question 8
A 30-engineer team's single CLAUDE.md covers testing, API design, security, git workflow and styling. Five different owners edit it, merge conflicts happen weekly, and nobody can tell who owns which rules. Every topic applies to all work in the repo. Which reorganization fits best?

A) Split each topic into its own file under .claude/rules/, such as testing.md and security.md, with owners per file
B) Move every topic into a separate skill so each owner maintains one, and engineers invoke them as needed
C) Have each owner keep their topic in their own ~/.claude/CLAUDE.md and share it on request with teammates
D) Keep the single file but add a per-section owner comment and require one reviewer per section edited

<details>
<summary>Answer & explanation</summary>

**A)** The .claude/rules/ directory exists for modular, topic-per-file instructions, and files without path scoping load like CLAUDE.md, so always-relevant topics stay always loaded while ownership and merges become per file. Skills load on demand, which suits optional workflows, not always-applicable standards. User-level files do not reach teammates, and owner comments leave the merge-conflict problem in place.

*Hint if stuck: Look for the organization feature built for one topic per file in a shared project.*
</details>

---

## Question 9
A team put the rule "never log request bodies, they may contain card numbers" in .claude/rules/api-logging.md with paths frontmatter matching src/api/**. A security audit then found Claude adding body logging to background workers in src/workers/. What is the right fix?

A) Add a second path-scoped rule for src/workers/** with the same text, and repeat for new directories
B) Remove the path scoping so the rule is always loaded, or move it into the project CLAUDE.md
C) Rename the rule file to security-critical.md so its name signals that it applies everywhere in the repo
D) Add the logging rule to each developer's user-level memory so it follows them into each directory

<details>
<summary>Answer & explanation</summary>

**B)** A rule that applies to all code must not be path-scoped; making it unconditional, through the project CLAUDE.md or a rule without paths frontmatter, loads it for every task. Adding a scoped copy per directory leaves gaps whenever new code lands elsewhere. A file name has no effect on when a rule loads, and user-level memory is not shared with CI or new teammates.

*Hint if stuck: Compare where the risk can actually occur with where the rule currently loads.*
</details>

---

## Question 10
A team's CLAUDE.md says "never modify files under vendor/". In about one session in fifty, Claude still edits a vendored library while fixing a build error, and the team needs a guarantee. Which change provides it?

A) Move the vendor rule to the very top of CLAUDE.md and rewrite it in capital letters with heavy emphasis
B) Duplicate the vendor rule into each directory-level CLAUDE.md so it is loaded wherever Claude works
C) Keep the guidance in CLAUDE.md, and add a permissions deny rule or PreToolUse hook that blocks edits to vendor/
D) Add a path-scoped rule in .claude/rules/ for vendor/** so the warning loads when Claude opens those files

<details>
<summary>Answer & explanation</summary>

**C)** CLAUDE.md is context, not enforced configuration, so a guarantee needs a deterministic control such as a deny rule or a PreToolUse hook, with CLAUDE.md still explaining why. Emphasis, repetition across files and path-scoped reminders all raise the odds of compliance but remain probabilistic instructions. The one-in-fifty failure rate is exactly what instructions alone produce.

*Hint if stuck: Which of these controls still holds in the one session out of fifty where Claude ignores its instructions?*
</details>

---

## Question 11
A developer joins a new team whose repo targets Python 3.12. Claude keeps writing Python 2-compatible code with __future__ imports in her sessions only. /memory shows her ~/.claude/CLAUDE.md, carried over from a previous job, says to always keep code Python 2-compatible. What is the best fix?

A) Ask the team to add a Python 3.12 line to the project CLAUDE.md so that it overrides her user-level memory file
B) Copy the team's project CLAUDE.md into her user-level file so both say the same thing everywhere
C) Start every session with a reminder that this repository targets Python 3.12 and modern syntax
D) Remove the project-specific Python 2 rule from her user file; put any rule still needed in project memory

<details>
<summary>Answer & explanation</summary>

**D)** Her user-level file applies to every project, so a rule that only made sense for one old codebase does not belong there. Memory files are combined rather than overriding each other, so a counter-instruction in the project file leaves a conflict. Copying project rules into user scope spreads them to unrelated repos, and per-session reminders are unreliable.

*Hint if stuck: User-level memory should hold only what is true for you in every project.*
</details>

---

## Question 12
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

## Question 13
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

## Question 14
In a repo with apps/web and apps/mobile, both apps must follow the same design-token rules. Those rules currently live only in apps/web/CLAUDE.md, alongside web-only conventions. When an engineer launches Claude Code in apps/mobile, the token rules are missing. What is the cleanest fix?

A) Copy the token rules into apps/mobile/CLAUDE.md so each app's own memory file is fully self-contained
B) Ask mobile engineers to launch Claude Code from apps/web so they pick up the web app's memory file
C) Move the token rules into apps/CLAUDE.md or the root CLAUDE.md, a shared ancestor of both apps
D) Add an @import of apps/web/CLAUDE.md into the mobile file, so mobile loads all of the web app's rules

<details>
<summary>Answer & explanation</summary>

**C)** Ancestor CLAUDE.md files load for any session started beneath them, so placing shared rules in a common parent covers both apps from one copy. Copying them creates two versions that will drift. Launching from the wrong app or importing the whole web file also brings in web-only conventions that do not apply to mobile.

*Hint if stuck: Think about which CLAUDE.md files a session started inside apps/mobile reads without being told to.*
</details>

---

## Question 15
A developer created CLAUDE.local.md at the project root with her personal sandbox URLs, yet Claude keeps using the shared staging URLs. In the running session she wants to check whether that file is among the memory files that actually loaded and how much of the context window those files take up. Which step gives her that?

A) Run /init, which rescans the project and reports which of its CLAUDE.md files are active in this session
B) Run /context and look for the file in the memory files section of its breakdown of the context window
C) Run /compact and read the summary it produces, which lists every instruction file the session had loaded
D) Ask Claude to cat CLAUDE.local.md, since any file Claude is able to read has already been loaded as memory

<details>
<summary>Answer & explanation</summary>

**B)** /context breaks down what occupies the context window and lists the CLAUDE.md and CLAUDE.local.md files that loaded under Memory files, so it answers both questions; the memory docs point to it for confirming a file loaded. A /compact summary is not an inventory of instruction files. Having Claude cat the file puts its text into the conversation now, which says nothing about whether it loaded as memory at launch. /init generates or improves a CLAUDE.md rather than reporting what is loaded.

*Hint if stuck: Separate commands that change or create instruction files from one that reports what the session is holding right now.*
</details>

---

## Question 16
A team's project CLAUDE.md includes CI-only instructions: never ask clarifying questions, and print findings as a JSON array. Engineers using Claude Code interactively now get JSON arrays instead of explanations and are never asked to clarify ambiguous requests. Where should the CI-only instructions live?

A) In the CI invocation itself, through the prompt or --append-system-prompt, leaving CLAUDE.md for shared conventions
B) In a directory-level CLAUDE.md under .github/ so the instructions load only when CI is running in the repo
C) In a section of CLAUDE.md that begins with: if you are running in CI, follow the instructions below
D) In each engineer's ~/.claude/CLAUDE.md, with a line that tells Claude to ignore the project's CI section

<details>
<summary>Answer & explanation</summary>

**A)** Instructions that apply only to automated runs belong in the CI call, where they reach just that invocation, while CLAUDE.md keeps conventions every session should follow. A CLAUDE.md under .github/ loads based on which files Claude touches, not whether it is in CI. Conditional prose relies on Claude detecting its environment, and per-engineer overrides leave a contradiction in every local session.

*Hint if stuck: Ask which instructions apply to every session and which apply to one kind of run.*
</details>

---

## Question 17
Engineers modernizing a legacy Java monolith notice that every new Claude Code session spends its first several minutes rediscovering how to build the project, which Maven profile to use and how to run a single test module. What is the most effective change?

A) Have each engineer paste the build steps into their opening prompt so each session starts informed
B) Add the build, profile and single-module test commands to the project CLAUDE.md that each session loads
C) Let Claude rediscover the steps each time, since exploring the build helps it understand the code
D) Create a skill describing the build, which engineers invoke before asking for code changes

<details>
<summary>Answer & explanation</summary>

**B)** Build and test commands are facts every session needs, which is exactly what project CLAUDE.md is for, and committing them helps the whole team. Pasting them into prompts depends on each engineer remembering. Rediscovery wastes time and context every session, and an on-demand skill fits occasional workflows, not information needed in nearly every task.

*Hint if stuck: Facts needed in almost every session belong in memory that loads every session.*
</details>

---

## Question 18
A team lead wrote the repo's testing conventions in ~/.claude/CLAUDE.md on her laptop and the staging deploy checklist in CLAUDE.local.md at the repo root, which the .gitignore excludes. The committed ./CLAUDE.md holds only build commands. A new teammate clones the repo, and Claude Code follows neither the testing conventions nor the checklist for him. Which facts explain what he is missing? (Choose two.)

A) A user-level ~/.claude/CLAUDE.md is read on the machine where it lives and does not reach teammates
B) Memory files load after each developer runs /memory once to register them for that particular project
C) Memory files load after the developer runs /init, which sets the project up for Claude Code on his machine
D) CLAUDE.local.md is for personal project notes; kept out of git, it is missing from his clone
E) The committed ./CLAUDE.md takes precedence and stops the other memory files from loading once it exists

<details>
<summary>Answer & explanation</summary>

**A, D** The user-level file is personal and loads only on the lead's own machine. CLAUDE.local.md is meant for private per-project preferences and is kept out of version control, so a fresh clone does not contain it. Both sets of rules belong in committed project files. Memory files are concatenated rather than overriding one another, /memory lists and opens memory files but is not needed to load them, and /init only drafts a starting CLAUDE.md; existing memory files load without it.

*Hint if stuck: Trace where each file physically lives and who else can ever see it.*
</details>

---

## Question 19
A team's root CLAUDE.md grew to 850 lines: 60 lines of repo-wide standards, long sections for the React app (web/**) and the Go services (svc/**), and a 200-line release runbook used once a quarter. Last sprint a developer moved each long section into its own file under docs/claude/ and left an @import line in its place, yet a token check shows sessions load about as much as before. Which changes would cut what a typical session loads? (Choose two.)

A) Keep the @import lines but move them to the end, so the imports load after the core standards
B) Move the React and Go sections into .claude/rules/ files whose paths match web/** and svc/**
C) Turn the release runbook into a skill, so its body loads when someone asks to cut a release
D) Move the React and Go sections into CLAUDE.local.md, so they sit outside the project memory
E) Move the release runbook into ~/.claude/CLAUDE.md, so it loads from user scope, not project

<details>
<summary>Answer & explanation</summary>

**B, C** Path-scoped rules load only when Claude works with files matching their globs, so React and Go guidance stays out of sessions that never touch those areas. A skill's body loads only when it is invoked or judged relevant, which suits a runbook used once a quarter. Imported files load together with the CLAUDE.md that imports them wherever the @ line sits, so moving the imports saves nothing. CLAUDE.local.md loads at launch like CLAUDE.md and also stops the guidance reaching teammates. A user-level CLAUDE.md loads in every session too, and only on one machine.

*Hint if stuck: Ask what decides whether each file enters context at all, not where its text happens to be stored.*
</details>

---

## Question 20
Dana's clone of payments-api lives at ~/work/payments-api. Only in her sessions does Claude Code write tests with unittest instead of pytest; teammates get pytest, the repo's CLAUDE.md never mentions a test framework, and she always launches Claude from the repo root. She suspects a memory file outside the committed project is the source. Which files could be adding the unittest instruction to her sessions? (Choose two.)

A) ~/work/billing-api/CLAUDE.md, in a sibling repo she cloned right beside payments-api last month
B) A teammate's CLAUDE.local.md at the payments-api root, kept out of git by the .gitignore
C) payments-api/legacy/CLAUDE.md, a committed folder-level file loaded at launch from the root
D) ~/.claude/CLAUDE.md on her laptop, the user-level file loaded in her sessions in any project
E) ~/work/CLAUDE.md, a file one folder above the repo, loaded when she launches inside the repo

<details>
<summary>Answer & explanation</summary>

**D, E** Claude Code loads the user-level ~/.claude/CLAUDE.md in every session on that machine, and it loads CLAUDE.md files from the launch directory and every directory above it, so ~/work/CLAUDE.md reaches her sessions and not teammates' (unless they keep the same layout). A sibling repo is not an ancestor of her working directory, so its file never loads. A teammate's gitignored CLAUDE.local.md exists only in his own clone. A CLAUDE.md in a subdirectory loads on demand when Claude touches files there, and being committed it would affect teammates too.

*Hint if stuck: Trace how discovery walks the folders at startup, and which file exists on her machine alone.*
</details>

---

## Question 21
An engineer launches Claude Code at the root of a monorepo and asks for a plan to change refund handling in the billing service. The plan ignores conventions in services/billing/CLAUDE.md, such as storing amounts as integer cents, though Claude follows them later once it starts editing billing files. She wants them applied from the first planning prompt. Which changes would achieve that? (Choose two.)

A) Launch Claude Code from services/billing, so the billing CLAUDE.md is read when the session starts
B) Run /memory once in the root session, so the billing CLAUDE.md is registered and loads at launch
C) Have Claude read a file in services/billing before planning, so the billing CLAUDE.md loads
D) Rename the billing file CLAUDE.local.md, so it loads at launch beside the root project memory file
E) Move the billing rules to .claude/rules/billing.md with paths set to services/billing/**/* instead

<details>
<summary>Answer & explanation</summary>

**A, C** Claude Code loads CLAUDE.md files from the launch directory and its ancestors at startup, so launching in services/billing loads the billing file (and the root file above it) before the first prompt. CLAUDE.md files in subdirectories load once Claude reads or edits a file there, so a deliberate read before planning brings the rules in. /memory lists and opens memory files; it does not change what loads. A CLAUDE.local.md in a subdirectory is discovered the same on-demand way as a CLAUDE.md there. A path-scoped rule also waits for a matching file to be touched, so it has the same gap during planning.

*Hint if stuck: Separate the files read at startup from those that wait for Claude to work in their folder.*
</details>

---

## Question 22
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

## Question 23
A SaaS monorepo has packages/api built on Fastify and packages/dashboard built on React. The root CLAUDE.md documents both sets of conventions, and engineers report Claude applying React component patterns while editing API route handlers. Which change best fixes the misapplied conventions?

A) Place a directory-level CLAUDE.md inside each package containing only that package's conventions
B) Expand the root CLAUDE.md with conditional prose such as: when working in packages/api, ignore the React sections
C) Split the monorepo into two repositories so each codebase gets its own dedicated CLAUDE.md
D) Create one skill per package and tell engineers to invoke the matching one before editing

<details>
<summary>Answer & explanation</summary>

**A)** Directory-level CLAUDE.md files scope guidance to the subtree where work is happening, so each package loads only its own conventions. Conditional prose in one big file is probabilistic — the model must remember to filter, which is exactly what is failing here. Splitting the repo is a drastic structural change to solve a configuration problem, and per-package skills depend on engineers remembering to invoke the right one before every edit.

*Hint if stuck: Ask where each framework's guidance applies, and what loads instructions only for work in that part of the repo.*
</details>

---

## Question 24
A platform team maintains 60 lines of secure-coding standards used by 14 service packages in a monorepo. Each package's CLAUDE.md currently holds a pasted copy. After the standards changed last sprint, an audit found 9 of the 14 copies were stale. How should the team restructure this?

A) Add a sync script engineers are expected to run that re-copies the standards into the 14 CLAUDE.md files
B) Move the standards into each engineer's ~/.claude/CLAUDE.md and announce updates in Slack
C) Merge the 14 package files into a single large root CLAUDE.md so there is one copy
D) Keep one canonical standards file and reference it from each package CLAUDE.md via @import

<details>
<summary>Answer & explanation</summary>

**D)** @import composes memory files, so 14 packages can share one canonical source that updates everywhere at once with no duplication. A sync script keeps 14 duplicates on disk and depends on every engineer remembering to run it — the same human-discipline failure that produced the stale copies. User-level placement loses version control and team sharing, and one giant root file forces every session to carry all 14 packages' content.

*Hint if stuck: There is a composition mechanism that lets many CLAUDE.md files share a single source of truth.*
</details>

---

## Question 25
In a repository of GitHub Actions pipelines, Claude has stopped following the YAML formatting conventions that should come from a directory-level CLAUDE.md inside .github/workflows. Before changing any configuration, the engineer wants to confirm whether that file is actually being loaded. What is the right first step?

A) Restart the session and repeat the request to see whether the behavior changes
B) Paste the conventions directly into the chat so the current task can proceed
C) Run /reload-skills to force the session to rescan its configuration tree
D) Run /memory to inspect exactly which memory files the session has loaded

<details>
<summary>Answer & explanation</summary>

**D)** Inspecting the memory files is the diagnostic step: /memory lists the session's CLAUDE.md and memory file locations, and in current Claude Code /context shows exactly which CLAUDE.md and rules files loaded. A nested CLAUDE.md under .github/workflows loads only after Claude reads or edits a file in that folder, which this check would reveal. /reload-skills rescans skills, not memory files, and restarting or pasting the conventions are blind workarounds that can hide the symptom without explaining it.

*Hint if stuck: Before changing anything, find out which instruction files are actually in play.*
</details>

---

## Question 26
A logistics startup's project CLAUDE.md has grown to 520 lines: about 40 lines of universal coding standards, 180 lines of test-writing guidance, 150 lines of API-package specifics, and a 150-line deployment runbook used a few times a month. Engineers report mid-file rules being ignored, and every session carries the full token cost. What is the best restructuring?

A) Reorder the file so the most important rules sit at the top and bottom where model attention is strongest
B) Split the content into ten topic files and @import every one of them from CLAUDE.md so the main file itself stays short and readable
C) Keep the 40 universal lines in CLAUDE.md, move scoped guidance to .claude/rules/ with paths globs, and make the runbook a skill
D) Relocate the entire file to ~/.claude/CLAUDE.md so the content loads from the user level instead of the repository

<details>
<summary>Answer & explanation</summary>

**C)** Only universally applicable standards should be always-on; path-scoped rules load when matching files are touched, and a skill body loads only when invoked thanks to progressive disclosure. The @import split is cosmetic — imported files still load every session, so the token cost and lost-in-the-middle problem remain. Reordering treats the attention symptom but fixes neither cost nor scoping, and moving everything to the user level loses version control while still loading all 520 lines.

*Hint if stuck: Match each block of content to the loading mechanism with the right scope and trigger.*
</details>

---

## Question 27
A monorepo has a root CLAUDE.md with team-wide standards and packages/billing/CLAUDE.md with billing rules such as storing amounts as integer cents. Midway through a long billing session the developer runs /compact. For the next few turns, while Claude plans changes without opening any billing file, it follows the root standards but proposes float amounts. What explains this?

A) The root file is re-read after compaction; the billing file reloads only when Claude next reads or edits a file in that folder
B) Compaction condenses each CLAUDE.md into a short digest, and the integer-cents detail was dropped from the billing file's digest
C) Nested CLAUDE.md files are read once at launch, so the billing rules stay missing until the developer starts a brand-new session
D) /compact removes subdirectory memory files from the session for good, so the billing rules have to be pasted back by hand

<details>
<summary>Answer & explanation</summary>

**A)** After /compact, Claude Code re-reads the project-root CLAUDE.md from disk and re-injects it, but a CLAUDE.md in a subdirectory loads on demand: it comes back only when Claude reads, writes or edits a file in that subdirectory. Until a billing file is touched again, the integer-cents rule is simply not in context. Compaction does not make digests of instruction files, nested files never load at launch in the first place, and nothing is removed for good, since touching a billing file reloads it.

*Hint if stuck: Ask which instruction files are loaded up front and which are triggered by the files Claude works on.*
</details>

---

## Question 28
A CI reliability team wrote a /triage-flaky skill that re-runs the full integration suite several times to classify flaky tests, which takes about 20 minutes and occupies a shared runner. Engineers only want it to run when someone deliberately types the command, but Claude has started launching it on its own whenever a conversation mentions a flaky test. What is the right fix?

A) Move the skill from .claude/skills/ into ~/.claude/skills/ so it stops loading for shared sessions
B) Set user-invocable: false in the frontmatter so the skill stops appearing as an automatic option
C) Append 'do not run this unless the user explicitly asks for it' to the end of the skill's description field
D) Add disable-model-invocation: true to the skill's frontmatter so only a person can trigger it

<details>
<summary>Answer & explanation</summary>

**D)** disable-model-invocation: true is the switch for workflows with side effects or cost that a person should launch on purpose; it also keeps the description out of Claude's context so Claude cannot pick it. Setting user-invocable: false does the opposite, hiding it from the / menu while leaving Claude free to invoke it. A sentence in the description is a soft request Claude may still override, and moving the file to a personal folder changes who has it, not who can trigger it.

*Hint if stuck: Ask who should be allowed to start this workflow, and which frontmatter field controls exactly that.*
</details>

---

## Question 29
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

## Question 30
A platform team's api-style skill has grown to a 650-line SKILL.md: a short checklist followed by dozens of request and response examples for every endpoint family. Each time the skill is invoked, the whole file lands in the session and stays there, even when the engineer only needs the checklist. How should they restructure it?

A) Copy the checklist into the project CLAUDE.md and delete the skill so that the guidance is always on hand
B) Keep SKILL.md as a short overview and move the examples into supporting files that SKILL.md links to by name
C) Compress the examples into one dense reference table near the top of SKILL.md so the file reads faster
D) Split the content into twelve separate skills, one per endpoint family, each carrying its own full set of examples

<details>
<summary>Answer & explanation</summary>

**B)** Skills are designed for progressive disclosure: SKILL.md stays a concise overview and links to reference files that Claude reads only when they are needed. Moving the checklist into CLAUDE.md makes it an always-on cost in every session, including ones that never touch the API. A denser table still loads every example on every invocation, and twelve near-duplicate skills multiply descriptions and maintenance without solving the oversized-body problem.

*Hint if stuck: Separate what Claude needs every time the skill runs from what it needs only occasionally.*
</details>

---

## Question 31
At a payments startup, one engineer packaged the rule 'always use pnpm, never npm or yarn' as a skill called package-manager-policy. Engineers keep finding npm install in Claude's commands because the skill is only picked up when someone happens to mention dependencies. Where does this guidance belong?

A) In a longer skill description listing each phrase engineers might use when they talk about dependencies
B) In a forked skill with context: fork so its instructions stay isolated from the noise in the main session
C) In the project CLAUDE.md, because it is a short standard that should apply in every session
D) In a personal ~/.claude/skills/ folder so that each engineer can choose whether or not to adopt it

<details>
<summary>Answer & explanation</summary>

**C)** Short, always-on project standards belong in CLAUDE.md, which loads at the start of every session; skills are for on-demand workflows and knowledge that only matter some of the time. Padding the description with trigger phrases still leaves the rule dependent on Claude choosing to load it. Forking isolates the instructions further from the work that needs them, and a personal folder turns a team standard into an optional preference.

*Hint if stuck: Is this something Claude should know only sometimes, or every time it touches the repo?*
</details>

---

## Question 32
A developer-productivity team keeps a 280-line procedure for writing incident postmortems (timeline format, blameless wording, the ticket fields to fill) inside the root CLAUDE.md. Postmortems are written about twice a month, but every session in the repo now starts with that procedure loaded. What is the best restructuring?

A) Move the procedure into an @imported file referenced from CLAUDE.md so the main file stays shorter
B) Keep it in CLAUDE.md but shorten it to a twenty-line summary that leaves out the ticket field details
C) Put the procedure in a path-scoped rule matching docs/**/*.md so it loads when docs are being edited or created
D) Move the procedure into a postmortem skill that loads when someone invokes it or asks for a postmortem

<details>
<summary>Answer & explanation</summary>

**D)** A multi-step procedure needed occasionally is the textbook case for a skill: only its short description sits in context until the workflow is actually requested. Imported files load together with CLAUDE.md, so they tidy the file without saving context. Trimming to a summary throws away detail the procedure needs, and a docs path rule would load it during every unrelated documentation edit.

*Hint if stuck: Ask how often this content is needed and what should trigger it.*
</details>

---

## Question 33
A team fixed a bug in their shared deploy skill at .claude/skills/deploy/SKILL.md and merged it. Everyone except one engineer now sees the corrected behaviour; when she runs /deploy, Claude still follows the old steps. She confirms her checkout has the latest commit. A year ago she had copied the skill into ~/.claude/skills/deploy/ to experiment. What is the most likely cause?

A) Her personal deploy skill shares the name and overrides the project skill, so she should rename or delete her copy
B) Her session cached the old skill body, so she needs to run /reload-skills and the project version will take over
C) Project skills only load after a fresh git clone, so she should re-clone the repository to pick up the newly merged fix
D) Personal and project skills are merged line by line, so the old steps in her copy are winning the merge conflict

<details>
<summary>Answer & explanation</summary>

**A)** When skills share a name, the personal copy in ~/.claude/skills/ takes precedence over the project one, so her old experiment shadows the team's fix. Reloading picks up file changes but does not change which same-named skill wins. Skills are not merged line by line, and project skills load from the working tree, so a fresh clone changes nothing.

*Hint if stuck: Two skills with the same name exist on her machine; which one wins?*
</details>

---

## Question 34
A CI team's /review-pr skill says 'look at the pull request diff and review it against our checklist'. In practice Claude spends several turns working out which git commands to run, and twice it reviewed the diff against the wrong base branch. The team wants every run to start from the exact same diff. What change makes this reliable?

A) Add a line in bold to the skill body telling Claude to compare against origin/main before reviewing
B) Use shell-command injection in the skill body, such as !`gh pr diff`, so the diff is inserted before Claude reads it
C) Fork the skill with context: fork so that a separate subagent can figure out the diff without cluttering the review
D) Ask engineers to paste the diff into the chat before they run /review-pr so Claude does not need to look it up itself

<details>
<summary>Answer & explanation</summary>

**B)** Skills can run shell commands as preprocessing and inline their output, so the exact diff is in the prompt before Claude starts reasoning; this removes the guesswork deterministically. A bold instruction is still a request Claude can misapply. Forking moves the same guesswork into a subagent, and relying on engineers to paste diffs reintroduces manual variation.

*Hint if stuck: Can the skill supply the data itself rather than asking Claude to go and find it?*
</details>

---

## Question 35
A document-extraction team runs a /reextract skill against a vendor and a billing month, for example /reextract acme 2026-08. The skill body says 'reprocess the vendor and month the user mentioned', and Claude sometimes swaps the two values or asks which vendor was meant. How should the skill be written?

A) Add more example invocations to the description so that Claude learns which value is meant to come first
B) Have the skill ask Claude to confirm the vendor and month back to the user before it starts reprocessing
C) Declare named arguments such as vendor and month in the frontmatter and reference $vendor and $month in the body
D) Remove the arguments entirely and have the skill read the vendor and month from a shared config file each time instead

<details>
<summary>Answer & explanation</summary>

**C)** Named arguments (or indexed placeholders such as $0 and $1) substitute the exact values typed after the command into the body, so the skill no longer depends on Claude interpreting free text. More examples in the description and a confirmation step both leave the mapping to interpretation and add friction. A config file breaks the one-line invocation the team actually wants.

*Hint if stuck: Let the command line fill the values in, instead of letting Claude infer them.*
</details>

---

## Question 36
Engineers on a multi-agent research system have a /map-sources skill that walks the repository to list every place a subagent fetches external sources. Each run reads dozens of files and floods the main session, and a reviewer insists the skill must never modify anything. Which frontmatter best meets both needs?

A) disable-model-invocation: true, so that engineers decide when the expensive walk is allowed to happen
B) context: fork on its own, so the walk runs in a general-purpose subagent with the session's full tool set
C) allowed-tools: Read Grep, together with a line in the body telling Claude to avoid editing any files
D) context: fork with agent: Explore, so the walk runs in a read-only subagent and only its summary returns

<details>
<summary>Answer & explanation</summary>

**D)** Forking keeps the noisy file walk out of the main context, and agent: Explore runs it in a subagent that has only read-only tools, so both requirements are met by configuration. A plain fork uses the general-purpose agent, which can still edit files. allowed-tools pre-approves the listed tools without removing the others, so it neither guarantees read-only behaviour nor stops the walk flooding the main session, and disable-model-invocation controls who starts the skill, which addresses neither need.

*Hint if stuck: One field controls where the skill runs; another controls what kind of agent runs it.*
</details>

---

## Question 37
A team's db-migration skill has a description several paragraphs long, well past what the skill listing shows: a history of the migration tooling first, with the phrases that should trigger it ('add a column', 'backfill', 'new index') at the very end. Claude rarely loads it when engineers use those phrases. What is the most effective fix?

A) Rewrite the description so the main use case and trigger phrases come first and the text stays concise
B) Copy the trigger phrases into the project CLAUDE.md with an instruction to always use the db-migration skill
C) Mark the skill disable-model-invocation: true and ask engineers to start migrations by typing /db-migration
D) Repeat the trigger phrases near the top of the SKILL.md body so Claude meets them as soon as it opens the skill

<details>
<summary>Answer & explanation</summary>

**A)** Claude decides whether to load a skill from its description, and long descriptions are cut down in the skill listing, so trigger phrases buried at the end may never be seen; leading with the key use case fixes the root cause. A CLAUDE.md instruction adds always-on text to compensate for a bad description, and disabling model invocation gives up the automatic use the team wants. The SKILL.md body is read only after the skill has been chosen, so phrases placed there cannot help Claude choose it.

*Hint if stuck: Claude chooses skills from a short listing; what does it actually get to read there?*
</details>

---

## Question 38
An engineer wants a /standup command that summarises her own git commits from the last day across the three repositories she works in. Nobody else on the team uses this format, and she does not want it showing up in teammates' sessions. Where should she define it?

A) In .claude/commands/ of each of the three repositories so the command is versioned alongside the code
B) In her personal ~/.claude/commands/ or ~/.claude/skills/ folder so it follows her across every project
C) In the root CLAUDE.md of each repository as a standup section that tells Claude how to write a summary
D) In a shared plugin installed for the whole team so it can be updated centrally as her format evolves

<details>
<summary>Answer & explanation</summary>

**B)** Personal workflows that span projects belong in the user-level commands or skills folder, which is available in every project for that user and invisible to teammates. Project .claude/commands/ and a team plugin are sharing mechanisms, which is exactly what she wants to avoid. Putting it in CLAUDE.md loads it for everyone in every session.

*Hint if stuck: Decide the scope first: one person, all projects.*
</details>

---

## Question 39
A frontend team created a format-after-edit skill telling Claude to run Prettier on every file it changes. Reviews still show unformatted files, because Claude only sometimes remembers to load the skill after an edit. The team wants formatting to happen after every single edit with no exceptions. What should they use?

A) A more specific skill description stating that the skill must run after each Edit or Write tool call
B) A sentence in CLAUDE.md requiring Claude to invoke format-after-edit after every file it modifies
C) A PostToolUse hook on Edit and Write that runs Prettier on the changed file each time an edit completes
D) The same skill with context: fork, so formatting runs in a subagent without slowing the main session

<details>
<summary>Answer & explanation</summary>

**C)** Something that must happen every time, without exception, needs deterministic enforcement, and a PostToolUse hook runs on every matching tool call regardless of what Claude decides. Sharpening the description or adding a CLAUDE.md line both still depend on Claude choosing to act. Forking changes where the skill runs, not whether it is triggered.

*Hint if stuck: Skills are chosen by the model; what mechanism fires regardless of the model's choice?*
</details>

---

## Question 40
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

## Question 41
A team's /audit-deps skill walks every dependency and prints a long report. There are two complaints: the tool output it produces floods the main conversation and pushes earlier work out of context, and people run it without a package name because nothing tells them it expects one. Which SKILL.md frontmatter changes fix both? (Choose two.)

A) Add disable-model-invocation: true so the report stays out of the conversation until someone asks for it
B) Move the skill into ~/.claude/skills so its output is held in a personal context outside the session
C) Add context: fork so the skill runs in a forked subagent and just its result returns to the main session
D) Add allowed-tools: Read, Grep so the skill is limited to fewer tools and the report it writes comes out shorter
E) Add argument-hint: [package-name] so autocomplete shows the expected argument when /audit-deps is typed

<details>
<summary>Answer & explanation</summary>

**C, E** context: fork runs the skill in a forked subagent context, so its verbose tool calls stay there and only the result comes back. argument-hint is the autocomplete hint that shows which argument a skill expects. allowed-tools pre-approves tools for the skill's turn (in current docs it does not block others) and does not shorten output. disable-model-invocation only stops Claude from loading the skill automatically. Moving a skill to the personal folder changes who has it, not where its output goes.

*Hint if stuck: Match each complaint to the frontmatter field whose documented job is exactly that.*
</details>

---

## Question 42
An engineer wrote a deploy-staging skill in ~/.claude/skills/deploy-staging/ on her laptop. Two complaints follow: teammates who pull the repo can't run /deploy-staging at all, and twice Claude began a staging deploy on its own right after she remarked that the branch looked ready. Which changes fix both complaints? (Choose two.)

A) Set user-invocable: false in its frontmatter, so a deploy can't start without a person present
B) Move the skill folder into the repo's .claude/skills/ directory and commit it with the code
C) Add context: fork to its frontmatter, so the deploy runs in a subagent away from the main chat
D) Set disable-model-invocation: true in its frontmatter, so it runs only when someone types it
E) Copy the skill into ~/.claude/commands/, so the command is listed for anyone who opens the project

<details>
<summary>Answer & explanation</summary>

**B, D** Skills under ~/.claude/skills/ are personal to one machine; committing the folder under the project's .claude/skills/ shares it with everyone who clones the repo (moving it also avoids her personal copy overriding the project one). disable-model-invocation: true stops Claude from triggering the skill itself, which is what a deploy with side effects needs. user-invocable: false does the opposite: it hides the skill from the / menu and leaves only Claude able to invoke it. context: fork isolates the run in a subagent but does not change who can start it. ~/.claude/commands/ is a personal location too.

*Hint if stuck: Two complaints, two levers: one is about visibility to teammates, the other about who may trigger a run.*
</details>

---

## Question 43
A platform team is trimming a 600-line project CLAUDE.md. Each item below sits in it today. The team's rule of thumb is that content Claude needs in nearly every session stays always-on, behaviour that must happen every time without fail is automated, and the rest should load only when the task calls for it. Which items should become skills? (Choose two.)

A) Prefer pnpm over npm or yarn for each install and script command run in this repository
B) A 180-line template and tone guide for incident postmortems, used about twice a month
C) Run the formatter on each file right after Claude edits it, without relying on a reminder
D) The commands to build, lint and run one test file, which Claude needs in most of its work
E) The steps to cut a release: bump versions, update the changelog, tag, and trigger the build

<details>
<summary>Answer & explanation</summary>

**B, E** The postmortem guide and the release steps are long, task-specific workflows used occasionally, which is what skills are for: only their descriptions sit in context until someone invokes them or asks for that task. The package-manager rule and the build and test commands apply in almost every session, so they belong in CLAUDE.md. Formatting after every edit must happen each time without Claude choosing to, so it belongs in a PostToolUse hook; a skill is loaded only when invoked or judged relevant.

*Hint if stuck: Sort each item by when it is needed and whether Claude may decide to skip it.*
</details>

---

## Question 44
A team's .claude/skills/schema-migrate/SKILL.md works when someone types /schema-migrate users, but Claude never uses it on its own when a developer asks to add a column or backfill a table. Its frontmatter is: description: "Helper.", disable-model-invocation: true, argument-hint: [table], allowed-tools: Bash(psql *). Which settings explain why Claude doesn't pick the skill up unprompted? (Choose two.)

A) The description doesn't mention migrations, so Claude can't match a request about one to it
B) argument-hint makes the skill wait for a table name, so Claude can't start it without one
C) allowed-tools names just psql, so Claude passes over it when a request may need other tools
D) disable-model-invocation: true stops Claude from loading the skill unless a person types it
E) The skill sits in the project folder; Claude starts skills unprompted only from ~/.claude/skills

<details>
<summary>Answer & explanation</summary>

**A, D** Claude decides whether to apply a skill from its description, and "Helper." gives it nothing to match against a migration request. disable-model-invocation: true reserves the skill for manual /name use, so Claude never invokes it even with a good description; both need fixing. argument-hint only shows the expected argument in autocomplete. allowed-tools pre-approves the listed tools while the skill runs; it does not hide the skill. Project and personal skills can both be invoked by Claude.

*Hint if stuck: Look for the fields that govern whether Claude may and can choose the skill, not how it runs once started.*
</details>

---

## Question 45
A team's .claude/skills/nightly-triage/SKILL.md runs an unattended loop that sorts new issues into labels. Twice it stalled for hours because Claude stopped to ask a clarifying question with AskUserQuestion, and once it edited a source file it should never touch. The skill already lists Read and Grep under allowed-tools. What frontmatter change stops the skill from asking questions or editing files while it runs?

A) List AskUserQuestion, Edit and Write under disallowed-tools in the skill's frontmatter
B) Treat allowed-tools as the full whitelist, since any tool missing from it is already blocked
C) Set disable-model-invocation: true so the skill starts when a person types its name rather than on its own
D) Set user-invocable: false so Claude alone can start the skill and no prompts are shown

<details>
<summary>Answer & explanation</summary>

**A)** disallowed-tools removes the listed tools from Claude's available pool while the skill is active, and the skills docs name AskUserQuestion in a background loop as the typical case. allowed-tools only pre-approves the tools it lists; it does not block anything else. disable-model-invocation and user-invocable decide who can start a skill, not which tools it may call. To block a tool everywhere, use permission deny rules instead.

*Hint if stuck: Separate settings that grant tools without a prompt from settings that take tools away.*
</details>

---

## Question 46
A customer-support team ships a skill that drafts refund-decision emails. Compliance requires that this skill never execute shell commands. The SKILL.md body states Never use Bash in bold, yet audit logs from last week show two sessions where the skill ran Bash anyway. What is the root-cause fix?

A) Repeat the prohibition in capital letters at both the top and bottom of the skill body
B) Lower the sampling temperature so the model follows the skill's instructions more reliably
C) Add a project-wide PreToolUse hook that blocks each Bash invocation in the repository
D) Restrict the skill's tools in its frontmatter so Bash is removed while the skill runs

<details>
<summary>Answer & explanation</summary>

**D)** Prose in a skill body is probabilistic; a tool restriction declared in the skill's frontmatter is applied by the harness and scoped to this skill. In current Claude Code the field is disallowed-tools, which removes Bash from the pool while the skill is active (allowed-tools only pre-approves tools and does not block others). A project-wide hook is deterministic but overbroad, breaking every workflow that legitimately needs Bash, and capitals or a lower temperature leave compliance to chance.

*Hint if stuck: Look for the deterministic enforcement mechanism whose scope matches the thing being restricted.*
</details>

---

## Question 47
A platform team wrote .claude/skills/legacy-billing-context/SKILL.md explaining how a 2012 billing system stores currency and retries charges. Claude should pull it in whenever someone works near billing code, but developers keep typing /legacy-billing-context expecting it to do something, and are confused when it only prints background. Which frontmatter setting fits?

A) argument-hint with a short note, which tells developers in the menu that the skill takes no arguments
B) user-invocable: false, which hides it from the slash menu but lets Claude still load it when relevant
C) disable-model-invocation: true, which keeps it in the slash menu but stops Claude from loading it alone
D) context: fork, which runs the skill in a subagent so its background text stays out of the main session

<details>
<summary>Answer & explanation</summary>

**B)** user-invocable: false hides a skill from the / menu and stops it running when someone types its name, while Claude can still invoke it; the skills docs describe exactly this use for background knowledge that is not a meaningful action for users. disable-model-invocation does the opposite, leaving only manual invocation, so Claude would stop using it near billing code. context: fork changes where the skill runs, not who can start it, and argument-hint only labels expected arguments.

*Hint if stuck: Decide who should be able to start this skill: the people typing commands, the model, or both.*
</details>

---

## Question 48
An engineer at an e-commerce company built a /release-checklist slash command in ~/.claude/commands that walks through the team's deployment checklist. During an incident, a teammate tried to run it and the command did not exist in her session. What is the right fix?

A) Have the teammate recreate the command file under her own ~/.claude/commands directory
B) Convert the checklist into a skill so it auto-invokes whenever a deployment is discussed
C) Paste the checklist into the project CLAUDE.md so it is available in every session
D) Move the command file into the repository's .claude/commands directory and commit it

<details>
<summary>Answer & explanation</summary>

**D)** ~/.claude/commands is personal scope: commands there exist only on the author's machine. Shared workflows belong in the repository's .claude/commands (or .claude/skills) directory, where they version with the code and reach every teammate. Recreating the file per user drifts over time; converting to a skill does not touch the real problem, which is where the file lives; and pasting an on-demand checklist into CLAUDE.md pays an always-on context cost for content needed only at release time.

*Hint if stuck: Where a definition is stored decides who is able to use it.*
</details>

---

## Question 49
Six hours into a session on a healthcare data-extraction project, an engineer creates the project's first skill at .claude/skills/redact-phi/SKILL.md; the .claude/skills/ directory did not exist when the session started. When she asks Claude to use it in the same session, Claude responds that no such skill exists. She does not want to lose the session's accumulated context. What should she do?

A) Exit and restart Claude Code, because skills are only discovered when a session starts
B) Run /reload-skills so the current session rescans the skills directory
C) Run /compact so the refreshed context window picks up the new skill
D) Tell Claude the file path in chat so it reads SKILL.md and follows it manually

<details>
<summary>Answer & explanation</summary>

**B)** Claude Code watches the skill directories that existed at startup and picks up changes there live, but a top-level skills directory created mid-session is not watched yet; /reload-skills rescans and registers the new skill without discarding context. Restarting would also work but throws away six hours of session state. /compact summarizes history and has nothing to do with skill discovery, and pointing Claude at the file makes it follow the text ad hoc without registering the skill for later use.

*Hint if stuck: There is a session command built specifically for picking up skill changes without starting over.*
</details>

---

## Question 50
A research-tooling team has a license-audit skill that shells out to dependency scanners, producing about 40,000 tokens of raw output per run. After each audit, the main session starts forgetting requirements the user stated earlier. Only a short verdict from the audit actually matters. What is the right design change?

A) Instruct the skill body to request quieter output modes from the scanner commands
B) Run /compact immediately after each audit to summarize the bloated transcript
C) Move the audit instructions into the project CLAUDE.md so they are preloaded in each session
D) Set context: fork in the skill frontmatter so the audit runs isolated and returns its summary

<details>
<summary>Answer & explanation</summary>

**D)** context: fork executes the skill in an isolated context, so the 40,000 tokens of scanner noise never enter the main session — only the result comes back. Quieter output flags reduce but do not eliminate the pollution and depend on scanner cooperation. /compact is damage control applied after the context has already degraded, and CLAUDE.md placement changes loading, not execution isolation.

*Hint if stuck: Think about where the skill's verbose work should happen relative to the main conversation.*
</details>

---

## Question 51
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

## Question 52
An architect auditing an insurance-claims platform finds 24 skills, each with a SKILL.md body around 400 lines. Assuming every session pays the full cost of all of them, she drafts a plan to consolidate down to five skills. Which statement should change her plan?

A) Only frontmatter metadata loads at session start; a body loads when its skill triggers, so 24 well-described skills are fine
B) Each SKILL.md body loads into context at session start, so consolidating to five skills is the correct move
C) Skills contribute nothing to context until invoked, including their descriptions, so auto-invocation needs a settings.json entry
D) Bodies load at session start but /compact evicts them, so scheduled compaction solves the cost without consolidating

<details>
<summary>Answer & explanation</summary>

**A)** Progressive disclosure means only the lightweight frontmatter — notably the description — is resident up front; the 400-line bodies cost nothing until a skill actually triggers. Consolidation would trade focused, well-scoped skills for muddier triggering with no token benefit. The claim that nothing loads is also wrong, since descriptions must be resident to drive auto-invocation, and /compact summarizes conversation history rather than evicting skill bodies on a schedule.

*Hint if stuck: Recall which part of a skill is resident before the skill is ever triggered.*
</details>

---

## Question 53
A developer-productivity team is designing two helpers in .claude/skills/. One generates release notes and should run only when an engineer deliberately starts it with a version tag. The other is a database-migration safety checklist that should engage on its own whenever Claude works on migrations. How should each be configured?

A) Leave both model-invocable with clear descriptions, so Claude decides when each one applies
B) Set disable-model-invocation: true on both, so engineers stay in control of when each runs
C) Release notes: disable-model-invocation and an argument; checklist: a description naming migrations
D) Release notes: a description-driven skill Claude picks; checklist: disable-model-invocation: true

<details>
<summary>Answer & explanation</summary>

**C)** Commands and skills are one system, so the design choice is who may invoke each. disable-model-invocation: true keeps release notes manual (typed with its version argument), while a description that names migration work lets Claude load the checklist itself when relevant. Leaving both model-invocable lets Claude start release notes unprompted, disabling both loses the automatic safety net, and the reversed pairing puts manual control on the helper that must engage automatically.

*Hint if stuck: Sort each helper by who should start it, then find the setting that expresses that.*
</details>

---

## Question 54
A team gives its /api-style skill context: fork so it stays out of the main session. The SKILL.md body lists conventions (error envelope shape, pagination fields, naming) but sets no task. When Claude invokes it while building an endpoint, the forked run returns almost nothing and the new code ignores the conventions. What fix fits?

A) Add agent: Explore so the forked subagent can read the codebase before it applies the conventions
B) Add allowed-tools listing Read and Edit so the forked subagent has permission to change the files
C) Remove context: fork so the conventions load inline as reference for the main conversation
D) Set background: false so the forked subagent finishes before Claude starts writing the endpoint

<details>
<summary>Answer & explanation</summary>

**C)** With context: fork, the skill content becomes the prompt of a separate subagent that does not see the conversation. A body of guidelines with no task gives that subagent nothing to act on, so it returns little and the conventions never reach the conversation writing the code. Reference content like this should run inline. Choosing Explore, pre-approving tools or waiting for the result still leaves the conventions with a subagent that has no task.

*Hint if stuck: Ask who receives the skill's text when it runs, and whether that reader is the one writing the endpoint.*
</details>

---

## Question 55
A developer-experience team distributes Claude Code skills from an internal git repo. A SessionStart hook pulls the latest skills into .claude/skills/ at the start of every session, but engineers find that skills added by the pull are not auto-invoked until they fully restart Claude Code. How should the team make newly synced skills register automatically, with no manual step?

A) Move the sync script into a PreToolUse hook so it runs again before each tool call in the session
B) Have the SessionStart hook return reloadSkills in its output so the synced skills are rescanned immediately
C) Tell engineers to run /reload-skills manually right after each session starts so the new skills register
D) List each skill's description in the project CLAUDE.md so the content loads as memory at session start instead

<details>
<summary>Answer & explanation</summary>

**B)** SessionStart hooks can return reloadSkills, which triggers a skill rescan after the sync completes — fixing the ordering problem at its source with zero human steps. Manual /reload-skills works but depends on every engineer remembering it every session, which fails the no-manual-step requirement. PreToolUse is the wrong lifecycle event, wastefully re-syncing on every tool call without triggering a rescan, and pasting descriptions into CLAUDE.md defeats progressive disclosure without actually registering the skills.

*Hint if stuck: Ask which event already performs the sync, and whether that event can ask Claude Code to look again when it finishes.*
</details>

---

## Question 56
A design-system team keeps its component conventions in .claude/rules/components.md with paths: src/components/*.tsx. Engineers notice the conventions apply when Claude edits src/components/Button.tsx but not src/components/forms/DatePicker.tsx or anything else in subfolders. What change fixes this?

A) Change the pattern to src/components/**/*.tsx so files at any depth under src/components/ match
B) Copy components.md into a CLAUDE.md file inside each subfolder of src/components/ so each one is covered
C) Remove the paths field so the component conventions load in each session regardless of the files touched
D) Add a second rule file with paths: src/components/forms/*.tsx to cover the one subfolder that was reported

<details>
<summary>Answer & explanation</summary>

**A)** A single * matches within one directory level, while ** matches across any depth, so src/components/**/*.tsx covers nested components too. Patching one subfolder with a second rule leaves the next new subfolder uncovered. Dropping paths loads the conventions everywhere, and per-folder CLAUDE.md copies drift apart and do the same job less well.

*Hint if stuck: Look at how many directory levels the glob is allowed to cross.*
</details>

---

## Question 57
A team keeps two nearly identical rule files: ts-style.md with paths: src/**/*.ts and tsx-style.md with paths: src/**/*.tsx. Every update has to be made twice, and last week the copies diverged on import ordering. What is the cleanest setup?

A) Merge them into the root CLAUDE.md, because the TypeScript code is the majority of the repository
B) Merge them into one rule with paths: src/**/*.{ts,tsx} so one file covers both extensions
C) Keep both files but add a CI check that fails whenever the two rule files stop being byte-for-byte identical
D) Merge them into one rule with paths: src/**/* so that every file under src/ shares one style rule

<details>
<summary>Answer & explanation</summary>

**B)** Rules support brace expansion, so src/**/*.{ts,tsx} gives one source of truth scoped to exactly the files it is meant for. A CI check polices duplication instead of removing it. src/**/* would also load the rule for CSS, JSON and other files, and moving it into CLAUDE.md makes it load even in sessions that never touch TypeScript.

*Hint if stuck: Look for a single pattern syntax that names alternatives, and check what else each candidate pattern would sweep in.*
</details>

---

## Question 58
A developer-tools team wrote a docs-style.md rule with paths: *.md to enforce heading and link conventions in documentation. The rule loads when Claude edits README.md at the repository root, but not when it edits docs/guides/setup.md or packages/cli/docs/usage.md. Which change applies it to all documentation?

A) Move docs-style.md into a docs/.claude/rules/ folder so it sits closer to the documentation it covers
B) Rename the rule file to markdown.md so Claude associates it with Markdown files anywhere in the tree
C) Change the pattern to **/*.md so Markdown files in any directory, including nested docs folders, match
D) Add an instruction to the rule body telling Claude to apply it to every Markdown file in the repository

<details>
<summary>Answer & explanation</summary>

**C)** A pattern like *.md is relative to the project root and matches only root-level files; **/*.md matches Markdown at any depth. The rule's filename carries no matching meaning, and text inside the rule body cannot load the rule in the first place. Moving it under docs/ would still miss packages/cli/docs/ and changes the base directory the pattern is resolved against.

*Hint if stuck: Patterns are resolved from the project root; how deep does *.md reach?*
</details>

---

## Question 59
A team migrating from another editor copied its rule files into .claude/rules/ unchanged. Each file starts with frontmatter like globs: "src/api/**/*.ts". The API conventions now appear in every session, even sessions spent entirely on the mobile app. What is the cause?

A) Rules in subdirectories of .claude/rules/ load unconditionally, so the files must sit directly in .claude/rules/
B) Rule frontmatter must be JSON rather than YAML, so the whole header is being skipped by Claude Code
C) The glob needs a leading ./ to be resolved relative to the project root, so it currently matches any file
D) Claude Code only reads a paths field in rule frontmatter, so globs is ignored and the rule loads unconditionally

<details>
<summary>Answer & explanation</summary>

**D)** paths is the only frontmatter field Claude Code reads from a rule; other fields are silently ignored, and a rule without paths loads at launch for every session. Renaming globs to paths scopes it again. The YAML format and the src/api/** pattern are fine as written, and rules in subdirectories of .claude/rules/ are discovered recursively without losing their scoping.

*Hint if stuck: A misspelled or foreign frontmatter key does not raise an error; what happens to the rule then?*
</details>

---

## Question 60
GraphQL resolvers in a large codebase live in nine packages (packages/*/src/resolvers/). Each package has its own CLAUDE.md with a copy of the 60-line resolver conventions, and three copies are now out of date. What should the team do?

A) Replace the copies with one .claude/rules/ file scoped to packages/*/src/resolvers/** in its paths
B) Move the conventions into the root CLAUDE.md so each session sees a single, up-to-date copy of them
C) Ask Claude to reconcile the nine copies at the start of each session, before it touches any resolver code
D) Keep the per-package files but add a script that copies the newest version into each of the nine weekly

<details>
<summary>Answer & explanation</summary>

**A)** A convention that cuts across many directories is best expressed as a single path-scoped rule: one source of truth that loads only when resolver files are touched. A sync script keeps the duplication and its drift risk. The root CLAUDE.md fixes duplication but loads the conventions in every session, and asking Claude to reconcile copies spends context on a maintenance problem.

*Hint if stuck: One convention, many directories: what gives one source of truth that still loads conditionally?*
</details>

---

## Question 61
During a long refactor a developer runs /compact. Right after, Claude proposes a plan for a new React component that ignores the team's .claude/rules/react.md (paths: src/**/*.tsx), although the rule was followed before compaction. Two turns later, once Claude opens an existing .tsx file to copy its imports, the rule is followed again. What is the correct reading of this?

A) Compaction corrupted the rule's frontmatter, and opening a .tsx file made Claude Code parse it again
B) The glob is too narrow, so it matched only the existing file and would never match a new component
C) Rules are summarised during compaction, and the summary lost detail until the next file was opened
D) Path-scoped rules drop out at compaction and load again once a matching file is read or edited

<details>
<summary>Answer & explanation</summary>

**D)** Compaction re-injects the project-root CLAUDE.md, but rules with paths frontmatter load again only on demand, when a matching file is next read or edited. That is why the rule was missing from the plan and came back once Claude opened a .tsx file. Compaction does not touch a rule's frontmatter, src/**/*.tsx matches any .tsx under src including new files, and rule files are not condensed into summaries. A rule that must hold right after compaction belongs in an unscoped rule or the root CLAUDE.md.

*Hint if stuck: Compare what is restored automatically once the conversation is summarized with what has to be triggered again.*
</details>

---

## Question 62
A mobile team has a 150-line release procedure (bump versions, update changelogs, tag, trigger the store build). Someone added it as .claude/rules/release.md with paths: **/*.gradle, reasoning that releases touch gradle files. Now the procedure loads whenever anyone adjusts a dependency, yet it is only wanted when someone is actually cutting a release. What is the better home?

A) The same rule with a narrower glob, such as app/build.gradle, so fewer edits trigger it
B) The root CLAUDE.md, trimmed down to a short summary that sits next to the build commands
C) A skill that loads when someone asks to cut a release or runs its slash command
D) A nested CLAUDE.md in the app/ folder that covers all of the store release steps in full

<details>
<summary>Answer & explanation</summary>

**C)** Path rules fit conventions tied to kinds of files; a procedure tied to a task, whatever files it touches, fits a skill, which loads only when the release workflow is requested. Narrowing the glob still triggers on ordinary dependency edits in that file. CLAUDE.md and a nested CLAUDE.md both load the procedure in sessions that have nothing to do with releasing.

*Hint if stuck: Is this content triggered by a file type or by a task?*
</details>

---

## Question 63
A CI platform team wants every GitHub Actions workflow Claude writes or edits to pin actions to a full commit SHA and declare explicit permissions. Workflows live in .github/workflows/ with both .yml and .yaml extensions. Application developers who never touch CI do not want these rules in their sessions. What should the team add?

A) A paragraph about workflow pinning in the root CLAUDE.md under a heading named CI conventions
B) A rule in .claude/rules/ with no paths field and a body that says it applies to workflow files
C) A skill named ci-conventions that the CI engineers invoke manually before editing any workflow
D) A rule in .claude/rules/ with paths: .github/workflows/*.{yml,yaml} holding the conventions

<details>
<summary>Answer & explanation</summary>

**D)** A path-scoped rule with a brace-expanded glob loads the conventions only when workflow files are touched, so CI edits get them and app work does not. A rule without paths loads everywhere, whatever its body says. CLAUDE.md is always-on, and a manually invoked skill depends on engineers remembering to call it.

*Hint if stuck: The trigger is a file location; pick the mechanism that keys on it.*
</details>

---

## Question 64
A staff engineer prefers Google-style docstrings whenever Claude writes Python, across all of her projects. Her teams' repositories don't mandate a docstring style, and she does not want to impose her preference on teammates. Where should she put it?

A) A rule in ~/.claude/rules/ with paths: **/*.py so it applies only to her, whenever Python is touched
B) A skill in ~/.claude/skills/ that she triggers before starting each Python session she opens
C) A rule in each repository's .claude/rules/ with paths: **/*.py, committed alongside the code
D) A Python section in each repository's CLAUDE.local.md, which she copies by hand into new projects

<details>
<summary>Answer & explanation</summary>

**A)** User-level rules in ~/.claude/rules/ apply to every project on her machine and can carry paths frontmatter, so the preference loads only when Python files are involved and never reaches teammates. Committed project rules impose it on everyone. A manually triggered skill relies on memory, and per-project local files must be copied and kept in sync by hand.

*Hint if stuck: Personal scope and file-type scope can be combined.*
</details>

---

## Question 65
An engineer's ~/.claude/rules/style.md says to indent with 4 spaces in TypeScript. His team's project rule .claude/rules/ts.md says 2 spaces. Claude's output in that repository switches between the two from one session to the next. What is the right fix?

A) Nothing is needed, because project rules override user rules when the two of them disagree
B) Reconcile the two rules, for example by dropping the indent line from his personal rule
C) Move the team's 2-space rule into CLAUDE.md, since CLAUDE.md outranks any of the rule files
D) Rename the project rule so it sorts after the user rule alphabetically and therefore gets priority

<details>
<summary>Answer & explanation</summary>

**B)** User and project rules both load and neither overrides the other; when they conflict Claude may follow either, so the only reliable fix is to remove the contradiction. There is no override precedence between them, filenames don't set priority, and CLAUDE.md does not outrank rules, so moving the team instruction leaves the same conflict in place.

*Hint if stuck: Check what the docs promise about precedence between personal and team rule files.*
</details>

---

## Question 66
A team keeps a single .claude/rules/conventions.md with paths listing both web/**/*.tsx and api/**/*.go, and a body covering frontend styling, Go error handling and SQL migrations. Editing one button component pulls in all 300 lines. How should they reorganise?

A) Move the whole file into the root CLAUDE.md, because it is loaded in most sessions anyway
B) Keep one file but add headings so Claude can skip the sections that do not apply to the current edit
C) Split it into topic files such as frontend.md and go-errors.md, each with its own narrow paths
D) Add @imports for each topic inside conventions.md so the sections live in separate files

<details>
<summary>Answer & explanation</summary>

**C)** A rule loads as a whole when any of its patterns match, so mixing topics means every match brings in everything; one topic per file, each scoped to its own paths, loads only what applies. Headings do not stop the content from loading. Imports load with the importing file, and moving everything into CLAUDE.md makes it load in every session.

*Hint if stuck: A rule loads all or nothing; what decides how much comes in?*
</details>

---

## Question 67
An extraction pipeline team keeps PII-masking conventions for parsers in .claude/rules/pii.md with paths: parsers/**/*.py. To be safe, someone pasted the same conventions into the root CLAUDE.md. After a policy change only the rule was updated, and Claude now gets two conflicting versions while editing parsers. What should the team do?

A) Keep both copies and ask reviewers to check that the two versions match on every pull request
B) Delete the rule and keep the copy in CLAUDE.md, since it loads at launch and is therefore seen first
C) Keep both copies and add a note to CLAUDE.md saying that the rule file wins whenever the two disagree
D) Delete the copy in CLAUDE.md and keep the path-scoped rule as the single source for these conventions

<details>
<summary>Answer & explanation</summary>

**D)** Duplicated instructions drift and conflict, and Claude may follow either version; the conventions only matter for parser files, so the scoped rule should be the single source. Keeping the CLAUDE.md copy loads PII conventions into unrelated sessions. A precedence note or a review checklist manages the duplication instead of removing it.

*Hint if stuck: Think about what happens over time when one instruction is kept in two places, and which location loads it only when it is relevant.*
</details>

---

## Question 68
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

## Question 69
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

## Question 70
A CI review job pastes 120 lines of authentication conventions into its prompt on every run, and developers working locally separately paste the same text when they touch auth code. The conventions only matter for files under services/*/auth/. What setup removes the duplication for both?

A) Put the conventions in each developer's ~/.claude/CLAUDE.md and keep the paste in the CI prompt
B) Store the conventions in a CI secret so the review workflow can inject them into each prompt it runs
C) Commit a rule scoped to services/*/auth/** in .claude/rules/ so local and CI sessions both load it
D) Add the conventions to the root CLAUDE.md so the CI job and the local sessions both always see them

<details>
<summary>Answer & explanation</summary>

**C)** A committed path-scoped rule travels with the repository, so any Claude Code session over that checkout, local or in CI, loads it when auth files are touched. Personal CLAUDE.md files don't reach CI or new teammates. The root CLAUDE.md loads the conventions for every task, and a CI secret keeps the CI-only paste and does nothing for local work.

*Hint if stuck: What travels with the repository and still loads only for the right files?*
</details>

---

## Question 71
To slim the root CLAUDE.md, a team moved its architecture overview (service boundaries, data flow, which team owns what) into a rule with paths: src/**. Now when an engineer asks Claude a design question before any file has been opened, the answers ignore the architecture entirely. What should they do?

A) Change the pattern to **/* so the overview matches every file in the repository
B) Ask engineers to open a source file first so that the architecture rule gets loaded
C) Move the overview into a skill so Claude loads it when it thinks a question needs it
D) Put a short overview back in CLAUDE.md, since it is needed regardless of files

<details>
<summary>Answer & explanation</summary>

**D)** Path-scoped rules load only once Claude works with matching files, so knowledge needed from the first message of every session belongs in CLAUDE.md (kept concise). Widening the glob still waits for a file to be touched. A workaround of opening files first is fragile, and a skill makes essential context depend on Claude guessing it is relevant.

*Hint if stuck: Path rules wait for a matching file; is this knowledge file-specific?*
</details>

---

## Question 72
A data-extraction team has conventions for JSON Schemas (nullable optional fields, 'other' plus detail for enums, a $comment on every property) that matter whenever Claude edits files under schemas/ or the generated validators in src/validators/. Elsewhere the conventions are noise. Which setup fits?

A) One rule whose paths list schemas/**/*.json and src/validators/** so either location loads it
B) Two rules with identical text, one in schemas/ and one in src/validators/, kept in sync by hand
C) A rule with no paths field so the schema conventions are always present for extraction work
D) A section in the root CLAUDE.md, since the extraction pipeline is the main product of the repo

<details>
<summary>Answer & explanation</summary>

**A)** One rule can list several patterns, so both related locations load the same conventions from a single file and nothing else does. A rule without paths and a CLAUDE.md section both load in every session. Two hand-synced copies invite drift.

*Hint if stuck: One topic, two locations: can a single rule cover both?*
</details>

---

## Question 73
A customer-support agent's repository keeps MCP tool definitions in tools/*.json and agent prompts in prompts/*.md. The team has 70 lines of conventions for tool descriptions (state when to use and when not to, list input formats, give edge cases) that matter only when editing tool definitions. They currently put them in a nested tools/CLAUDE.md, but the definitions are being moved into tools/billing/ and tools/returns/ subfolders, plus a shared/tools/ folder. What should they do?

A) Keep tools/CLAUDE.md and add a copy of it in shared/tools/ so that both locations are covered
B) Replace it with a rule whose paths cover tools/**/*.json and shared/tools/**/*.json
C) Fold the conventions into the root CLAUDE.md, since tool descriptions matter so much
D) Move the conventions into the system prompt of the support agent so it follows them

<details>
<summary>Answer & explanation</summary>

**B)** Once the same conventions span several directory trees, a single path-scoped rule with multiple globs is the one source of truth; nested CLAUDE.md files would need copies in each tree. The root CLAUDE.md loads them for unrelated work, and the support agent's runtime system prompt is the wrong audience: these are conventions for Claude Code while editing the repo, not instructions for the deployed agent.

*Hint if stuck: Who reads these conventions, and which files should trigger them?*
</details>

---

## Question 74
A research-platform repo has a 700-line root CLAUDE.md: build commands and commit conventions, then long sections on the React dashboard (web/**), the Python crawler (crawler/**) and Terraform (infra/**). Adherence has dropped. A lead proposes moving each section into its own file and pulling them into CLAUDE.md with @imports. Which plan reduces context use and improves focus?

A) Adopt the @imports proposal, because splitting the content into separate files shrinks the context
B) Keep the file whole but put the most important instructions in bold so they stand out while reading
C) Keep shared items in CLAUDE.md and move each area's section into a rule scoped to its paths
D) Move all four sections, including build commands, into path-scoped rules so nothing loads by default

<details>
<summary>Answer & explanation</summary>

**C)** Universal facts stay in CLAUDE.md, while area-specific guidance moves into path-scoped rules that load only when Claude works in that area. Imported files load together with CLAUDE.md, so the proposal reorganises without reducing context. Bold text does not cut size, and scoping the build commands too would hide the facts every session needs.

*Hint if stuck: Decide, section by section, whether the content is universal or tied to an area of the repo.*
</details>

---

## Question 75
A CI platform team has container conventions (pinned base-image digests, a non-root USER, no curl-pipe-to-shell) that should apply whenever Claude edits a Dockerfile. The files are named Dockerfile, Dockerfile.dev and Dockerfile.ci and sit in services/*/, tools/ and the repository root. Engineers working on application code should not get these conventions. Which setup fits?

A) A rule with paths: **/*.dockerfile so each container definition in the repository matches it
B) A rule with paths: services/*/Dockerfile, since most of the Dockerfiles live in the services tree
C) A nested CLAUDE.md placed next to each Dockerfile in services/*/ and tools/ and at the repo root
D) A rule with paths: **/Dockerfile* so every Dockerfile variant at any depth loads the conventions

<details>
<summary>Answer & explanation</summary>

**D)** A path-scoped rule with **/Dockerfile* matches the bare name and every suffixed variant at any depth, so container edits get the conventions and application work does not. A *.dockerfile extension pattern matches none of these filenames, and limiting the glob to services/ misses tools/ and the root. Copying a CLAUDE.md beside each Dockerfile duplicates the text and drifts.

*Hint if stuck: Write the glob against how the files are actually named, not how you would expect them to be named.*
</details>

---

## Question 76
A fintech monorepo has database migrations in packages/*/migrations/ across nine packages. The team wants strict migration rules (reversible steps, no data deletes) applied whenever Claude touches a migration file, but not loaded when it edits anything else. Which setup fits best?

A) A CLAUDE.md inside each of the nine migrations folders, each holding a copy of the same migration rules
B) A file in .claude/rules/ with paths frontmatter matching packages/*/migrations/**, holding the migration rules
C) A section in the root CLAUDE.md that opens with: apply these rules only when editing migration files
D) A migration skill that engineers invoke by name before they ask Claude to write or change a migration

<details>
<summary>Answer & explanation</summary>

**B)** A path-scoped rule loads only when Claude works with files matching its glob, so one file covers all nine packages without loading elsewhere. Nine directory-level copies would drift apart as rules change. A conditional section in the root file loads every session and relies on the model filtering itself, and a manually invoked skill depends on engineers remembering it.

*Hint if stuck: Look for the mechanism that scopes by file pattern across many directories at once.*
</details>

---

## Question 77
A monorepo's React testing conventions apply to files matching **/*.test.tsx, which sit in a dozen packages. Today they live in the root CLAUDE.md and load into every session, even backend-only work. An earlier attempt to move them into packages/web/CLAUDE.md meant tests in other packages were written without them. Which steps load the conventions only when relevant, wherever the test files live? (Choose two.)

A) Move the conventions out of the root CLAUDE.md into a markdown file of their own under .claude/rules/
B) Give the rule file frontmatter with paths: ["**/*.test.tsx"] so it loads when matching files are used
C) Keep a copy in a CLAUDE.md inside each package that has tests so that each of those directories gets the rules
D) @import the conventions file from the root CLAUDE.md so that it loads once a test file is opened
E) Add paths: ["**/*.test.tsx"] frontmatter to packages/web/CLAUDE.md so it loads for test files in any package

<details>
<summary>Answer & explanation</summary>

**A, B** Files in .claude/rules/ are project memory, and a paths glob in their frontmatter makes them load only when Claude reads or edits a matching file; a rule without paths loads unconditionally, so both steps are needed. paths frontmatter is a rules feature: a subdirectory CLAUDE.md loads when Claude works in that directory, so packages/web/CLAUDE.md never reaches tests in other packages. Per-package CLAUDE.md copies drift apart and are tied to directories, not to the test-file pattern. An @import loads together with the file that imports it, so it would still load in every session.

*Hint if stuck: Think about a mechanism keyed to file patterns rather than to directories, and what makes it conditional rather than always on.*
</details>

---

## Question 78
A team has two rule files. .claude/rules/api.md begins with frontmatter globs: "src/api/**/*.ts", and its API conventions show up in every session, even frontend-only ones. .claude/rules/ui/components.md has paths: ["src/components/*.tsx"]; it is followed when Claude edits src/components/Button.tsx but ignored for src/components/forms/DatePicker.tsx. Which explain both problems? (Choose two.)

A) Rules with a glob in frontmatter load at launch and stay loaded until the first /compact
B) Rule files in a subfolder of .claude/rules/ match files at that folder's depth and no other
C) api.md has no paths key, so its glob is ignored and the file loads as an unscoped rule
D) A YAML list in paths is read per folder, so it matches the first folder level and no deeper
E) In components.md a single * matches one level, so files in deeper subfolders do not match

<details>
<summary>Answer & explanation</summary>

**C, E** Claude Code scopes a rule only through a paths field; a rule without one, such as a file using another tool's globs key, loads unconditionally. In src/components/*.tsx the single * matches file names directly in that folder, so src/components/**/*.tsx is needed for nested files. Path-scoped rules are not loaded at launch; they load when a matching file is used. .claude/rules/ is searched recursively, and the subfolder name has nothing to do with matching. paths accepts a list of globs, each matched in full.

*Hint if stuck: Check each file twice: does Claude Code recognise its scoping at all, and if so, what does the pattern match?*
</details>

---

## Question 79
A team keeps React conventions in .claude/rules/frontend/react.md with paths: ["src/**/*.tsx"]. Developers report that Claude sometimes ignores those conventions, though at other times it follows them closely. In which of these moments is the rule most likely missing from Claude's context? (Choose two.)

A) Claude is asked to plan a new component before it has opened or edited any .tsx file in src/
B) Right after /compact in a long React session, before Claude has touched another .tsx file
C) Claude edits src/features/cart/ui/CartLine.tsx, a file five folders below the src/ directory
D) Claude creates src/hooks/useCart.tsx, a new file that did not exist when the session started
E) Claude edits src/App.tsx while the rule lives in .claude/rules/frontend/ instead of rules/

<details>
<summary>Answer & explanation</summary>

**A, B** A path-scoped rule loads when Claude works with a matching file, so before any .tsx file has been opened or edited the conventions are not in context, and a plan drafted then misses them. Path-scoped rules also drop out at compaction and come back only when a matching file is touched again. src/**/*.tsx matches files at any depth, writing a new matching file loads the rule like editing one, and rule files in subfolders of .claude/rules/ are discovered recursively.

*Hint if stuck: Trace when a scoped rule enters context, and whether it stays there for the rest of the session.*
</details>

---

## Question 80
An edtech React app keeps 80 lines of test-writing guidance (React Testing Library queries, a ban on snapshot tests) in its project CLAUDE.md, so every session loads it — including backend-only work. Test files are colocated with their components as *.test.tsx throughout src/. How should this guidance be scoped?

A) Keep it in CLAUDE.md but preface it with: apply the following section only when editing test files
B) Move it to .claude/rules/testing.md with paths: ["**/*.test.tsx"] in the YAML frontmatter
C) Add a directory-level CLAUDE.md inside a central __tests__ folder that holds the guidance
D) Convert the guidance into a slash command that engineers run before starting test work

<details>
<summary>Answer & explanation</summary>

**B)** .claude/rules/ files with a paths glob in their frontmatter apply only when matching files are in play, which is exactly the scoping needed for colocated test files. A prose preface still loads all 80 lines everywhere and relies on the model to self-filter. A __tests__ directory CLAUDE.md cannot work because the tests are colocated, and a slash command depends on engineers remembering to run it.

*Hint if stuck: The test files sit beside their components all over src/; what can follow them wherever they are?*
</details>

---

## Question 81
A platform repo has Terraform files in infra/, modules/, and services/*/deploy/. The team wants Terraform conventions applied whenever Claude Code edits any .tf file, and not loaded at all during application-code work. What is the best configuration?

A) Add a Terraform section to the root CLAUDE.md
B) Put a CLAUDE.md with the conventions in each of the three directories
C) Create .claude/rules/terraform.md with paths: ["**/*.tf"] in its YAML frontmatter
D) Create a terraform skill that developers invoke whenever they work on the infrastructure

<details>
<summary>Answer & explanation</summary>

**C)** A path-scoped rule with a glob loads only when matching files are edited, wherever they live. Root CLAUDE.md always loads, per-directory CLAUDE.md files miss new locations and duplicate content, and a skill relies on someone remembering to invoke it.

*Hint if stuck: The files are spread out, but they share an extension.*
</details>

---

## Question 82
A team split its large CLAUDE.md into eight files in .claude/rules/ (testing.md, api.md, migrations.md and so on), expecting context use to drop. Token usage didn't change, and all eight rule files are loaded even in a session that only touches docs. What did they miss?

A) Rules files only load conditionally when the root CLAUDE.md @imports them
B) None of the files have a paths field in YAML frontmatter, so each loads unconditionally
C) Claude Code loads at most one rules file per session, so they must merge them back into one file
D) They need to run /compact once so the rules are re-evaluated

<details>
<summary>Answer & explanation</summary>

**B)** Rule files without paths frontmatter apply everywhere. Adding paths globs makes each load only when matching files are touched, which is where the token savings come from. @import does the opposite of conditional loading, there is no one-file limit, and /compact does not change which rules apply.

*Hint if stuck: What tells a rules file when it applies?*
</details>

---

## Question 83
A project has .claude/rules/migrations.md with paths: db/migrations/**/*.sql, requiring every migration to be reversible. A developer asks Claude which migrations drop a column. Claude runs a recursive grep over the folder, lists twelve matching files from the search output, and proposes a fix plan that ignores the rule. The glob is correct. Why was the rule absent?

A) Path rules load after the developer names a matching path explicitly in the prompt they type
B) The rule loaded during the search, but the long grep output pushed it out of the context window
C) The rule loads when a matching file is read, edited or written, not when it shows up in search results
D) Path rules load at the moment Claude creates a new file, so migrations that already exist do not trigger them

<details>
<summary>Answer & explanation</summary>

**C)** A path-scoped rule loads when Claude uses Read, Write or Edit on a matching file, or views a single matching file with a Bash command that counts as a read, such as cat or head. A recursive grep lists matches without opening any one file, so the rule never triggered. Existing files trigger rules as soon as they are read, typing a path in the prompt does not load anything, and a loaded rule is not evicted by later tool output.

*Hint if stuck: Consider which kinds of file access count as Claude working on a file.*
</details>

---
