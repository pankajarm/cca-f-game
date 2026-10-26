/* ARCHITECT'S ASCENT — exam guide outline
 * Structure of the official "Claude Certified Architect – Foundations Exam Guide"
 * (v1.0, effective July 2026, exam code CCAR-F): domains, task statements, scenarios.
 * Task-statement titles follow the guide; the key ideas are our own short paraphrase.
 * Questions point here through their `ts` ("1.4") and `scenario` (1-6, 0 = general). */
window.GUIDE = {
  version: 'Exam Guide v1.0 · July 2026 · CCAR-F',
  exam: { items: 60, minutes: 120, scenarios: 4, scenarioBank: 6, pass: 720, scaleMin: 100, scaleMax: 1000 },

  domains: [
    { id: 'D1', n: 1, label: 'Agentic Architecture & Orchestration', weight: 27, exam: 16 },
    { id: 'D2', n: 2, label: 'Tool Design & MCP Integration', weight: 18, exam: 11 },
    { id: 'D3', n: 3, label: 'Claude Code Configuration & Workflows', weight: 20, exam: 12 },
    { id: 'D4', n: 4, label: 'Prompt Engineering & Structured Output', weight: 20, exam: 12 },
    { id: 'D5', n: 5, label: 'Context Management & Reliability', weight: 15, exam: 9 },
  ],

  taskStatements: [
    { id: '1.1', title: 'Design and implement agentic loops for autonomous task execution',
      know: ['Loop on stop_reason: tool_use means run tools and call again, end_turn means stop', 'Tool results go back into the history so the next turn can reason over them', 'Model-driven tool choice beats hard-coded decision trees'],
      skills: ['Never end the loop on parsed prose, an iteration cap, or "has text" checks'] },
    { id: '1.2', title: 'Orchestrate multi-agent systems with coordinator-subagent patterns',
      know: ['Hub-and-spoke: the coordinator owns routing, errors and aggregation', 'Subagents start with isolated context', 'Too-narrow decomposition silently drops coverage'],
      skills: ['Pick subagents per query instead of always running the full pipeline', 'Partition scope to avoid overlap; iterate on gaps before final synthesis'] },
    { id: '1.3', title: 'Configure subagent invocation, context passing, and spawning',
      know: ['Subagents are spawned with the Task tool; allowedTools must include it', 'Nothing is inherited: pass findings explicitly in the prompt', 'AgentDefinition sets description, prompt and tool limits per subagent'],
      skills: ['Emit several Task calls in one response to run subagents in parallel', 'Pass structured context that keeps source metadata separate from content', 'Give subagents goals and quality bars, not step-by-step scripts'] },
    { id: '1.4', title: 'Implement multi-step workflows with enforcement and handoff patterns',
      know: ['Prompts have a non-zero failure rate; required ordering needs code gates', 'Human handoffs need a structured summary, not a transcript'],
      skills: ['Block downstream tools until a prerequisite (e.g. verified customer) has run', 'Split multi-concern requests and resolve each item', 'Hand off with customer id, root cause, amounts and a recommended action'] },
    { id: '1.5', title: 'Apply Agent SDK hooks for tool call interception and data normalization',
      know: ['PostToolUse hooks reshape tool results before the model sees them', 'Pre-call interception enforces policy deterministically'],
      skills: ['Normalise mixed date/status formats from different tools in a hook', 'Block policy-violating calls (e.g. refunds over a cap) and redirect to escalation', 'Choose hooks over prompt rules when compliance must be guaranteed'] },
    { id: '1.6', title: 'Design task decomposition strategies for complex workflows',
      know: ['Fixed prompt chains suit predictable multi-aspect work', 'Open-ended investigations need plans that adapt to what is found'],
      skills: ['Review per file, then run a separate cross-file integration pass', 'For open-ended work: map structure, find high-impact areas, plan, then adapt'] },
    { id: '1.7', title: 'Manage session state, resumption, and forking',
      know: ['--resume <name> continues a named session', 'fork_session branches from a shared baseline', 'Stale tool results make a fresh session with a summary safer than resuming'],
      skills: ['Tell a resumed session exactly which files changed', 'Fork to compare two approaches from the same analysis'] },

    { id: '2.1', title: 'Design effective tool interfaces with clear descriptions and boundaries',
      know: ['Descriptions are what the model uses to pick a tool', 'Overlapping descriptions cause misrouting', 'System-prompt keywords can pull the model toward the wrong tool'],
      skills: ['State purpose, inputs, examples, edge cases and when not to use it', 'Rename or split overlapping/generic tools into purpose-specific ones'] },
    { id: '2.2', title: 'Implement structured error responses for MCP tools',
      know: ['isError tells the agent a call failed', 'Transient, validation, business and permission errors need different handling', '"Operation failed" prevents sensible recovery'],
      skills: ['Return errorCategory, isRetryable and a readable message', 'Treat an empty result as success, not as an error', 'Recover locally from transient errors; propagate the rest with partial results'] },
    { id: '2.3', title: 'Distribute tools appropriately across agents and configure tool choice',
      know: ['18 tools is worse than 4–5: selection degrades with choice count', 'Agents misuse tools outside their role', 'tool_choice: "auto", "any", or a forced named tool'],
      skills: ['Scope each agent to its role, with small cross-role tools for frequent needs', 'Force a tool for the first step, then relax; use "any" to guarantee a tool call'] },
    { id: '2.4', title: 'Integrate MCP servers into Claude Code and agent workflows',
      know: ['Project scope (.mcp.json) is shared; user scope (~/.claude.json) is personal', '${ENV_VAR} expansion keeps secrets out of git', 'MCP resources expose catalogs so agents explore less'],
      skills: ['Write rich MCP tool descriptions so the agent prefers them over Grep', 'Prefer community servers for standard integrations; build custom only when needed'] },
    { id: '2.5', title: 'Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively',
      know: ['Grep searches file contents; Glob matches file paths', 'Edit needs a unique anchor; fall back to Read + Write'],
      skills: ['Start with Grep to find entry points, then Read to follow the flow', 'Trace wrapped functions by finding exported names, then searching each'] },

    { id: '3.1', title: 'Configure CLAUDE.md files with appropriate hierarchy, scoping, and modular organization',
      know: ['User (~/.claude/CLAUDE.md), project, and directory levels', 'User-level instructions are not shared with the team', '@import and .claude/rules/ keep instructions modular'],
      skills: ['Diagnose "new teammate does not get the rules" as a hierarchy problem', 'Use /memory to see which memory files are loaded'] },
    { id: '3.2', title: 'Create and configure custom slash commands and skills',
      know: ['.claude/commands/ is shared; ~/.claude/commands/ is personal', 'SKILL.md frontmatter: context: fork, allowed-tools, argument-hint'],
      skills: ['Fork noisy skills so their output does not pollute the main session', 'Restrict tools in a skill; prompt for arguments with argument-hint', 'Skills for on-demand workflows, CLAUDE.md for always-on standards'] },
    { id: '3.3', title: 'Apply path-specific rules for conditional convention loading',
      know: ['.claude/rules/ files can carry paths: globs in YAML frontmatter', 'Path-scoped rules load only when matching files are edited'],
      skills: ['Use globs like **/*.test.tsx for conventions spread across directories', 'Prefer path rules over per-directory CLAUDE.md for cross-cutting conventions'] },
    { id: '3.4', title: 'Determine when to use plan mode vs direct execution',
      know: ['Plan mode: large, multi-file, architectural or multi-approach work', 'Direct execution: small, clear, well-scoped changes', 'The Explore subagent keeps verbose discovery out of the main context'],
      skills: ['Plan first, then execute the agreed plan directly'] },
    { id: '3.5', title: 'Apply iterative refinement techniques for progressive improvement',
      know: ['Concrete input/output examples beat prose descriptions', 'Test-first iteration: share failing tests to steer fixes', 'Interview pattern: let Claude ask questions before building'],
      skills: ['Send interacting issues together; fix independent issues one by one', 'Give exact edge-case examples (e.g. null handling) with expected output'] },
    { id: '3.6', title: 'Integrate Claude Code into CI/CD pipelines',
      know: ['-p / --print runs non-interactively', '--output-format json and --json-schema give machine-readable output', 'A fresh session reviews code better than the one that wrote it'],
      skills: ['Feed prior findings so re-reviews only report new issues', 'Give existing tests and CLAUDE.md test standards to avoid duplicate tests'] },

    { id: '4.1', title: 'Design prompts with explicit criteria to improve precision and reduce false positives',
      know: ['"Be conservative" does not raise precision; explicit criteria do', 'Noisy categories erode trust in the accurate ones'],
      skills: ['Say exactly what to report and what to skip', 'Temporarily disable high-false-positive categories while fixing them', 'Define severity levels with concrete examples'] },
    { id: '4.2', title: 'Apply few-shot prompting to improve output consistency and quality',
      know: ['Few-shot is the strongest lever for consistent format', 'Examples teach judgment on ambiguous cases and generalise'],
      skills: ['2–4 targeted examples that explain why one choice beats the alternatives', 'Show varied document layouts to reduce empty or invented extractions'] },
    { id: '4.3', title: 'Enforce structured output using tool use and JSON schemas',
      know: ['tool_use with a JSON schema removes syntax errors, not semantic ones', '"auto" may answer in text, "any" must call some tool, forced must call one tool'],
      skills: ['Make fields nullable when the source may lack them', 'Use enums with "unclear" and "other" + detail', 'Add normalisation rules alongside the schema'] },
    { id: '4.4', title: 'Implement validation, retry, and feedback loops for extraction quality',
      know: ['Retry with the specific validation error appended', 'Retries cannot recover information that is not in the source', 'detected_pattern fields make false-positive analysis possible'],
      skills: ['Extract stated vs calculated totals and flag conflicts', 'Retry format errors; stop retrying missing-data cases'] },
    { id: '4.5', title: 'Design efficient batch processing strategies',
      know: ['Message Batches: 50% cheaper, up to 24 h, no latency SLA', 'No multi-turn tool calling inside a batch request', 'custom_id correlates requests and results'],
      skills: ['Batch for overnight/weekly work, synchronous for blocking checks', 'Resubmit only failed custom_ids, fixed (e.g. chunked)', 'Pilot the prompt on a sample before a large batch'] },
    { id: '4.6', title: 'Design multi-instance and multi-pass review architectures',
      know: ['Self-review in the same session inherits its own blind spots', 'An independent instance catches more than "review your work" prompts'],
      skills: ['Per-file passes plus a cross-file integration pass', 'Have the model report confidence per finding to route review'] },

    { id: '5.1', title: 'Manage conversation context to preserve critical information across long interactions',
      know: ['Progressive summaries blur numbers, dates and promises', 'Lost in the middle: start and end are read best', 'Verbose tool results crowd out what matters'],
      skills: ['Keep a persistent case-facts block outside summarised history', 'Trim tool output to relevant fields; put key findings first with headers', 'Ask upstream agents for structured facts, not reasoning dumps'] },
    { id: '5.2', title: 'Design effective escalation and ambiguity resolution patterns',
      know: ['Escalate on explicit human requests, policy gaps, or no progress', 'Sentiment and self-rated confidence are poor escalation signals', 'Multiple matches call for another identifier, not a guess'],
      skills: ['Write explicit escalation criteria with examples', 'Honour "get me a human" immediately'] },
    { id: '5.3', title: 'Implement error propagation strategies across multi-agent systems',
      know: ['Structured error context lets the coordinator recover', 'Access failures differ from valid empty results', 'Hiding errors and killing the whole workflow are both anti-patterns'],
      skills: ['Return failure type, what was tried, partial results, alternatives', 'Annotate synthesis with coverage gaps'] },
    { id: '5.4', title: 'Manage context effectively in large codebase exploration',
      know: ['Long sessions drift into "typical patterns" instead of specifics', 'Scratchpad files and subagents preserve findings', 'Manifests enable crash recovery'],
      skills: ['Delegate specific questions to subagents; summarise between phases', 'Use /compact when discovery output fills the context'] },
    { id: '5.5', title: 'Design human review workflows and confidence calibration',
      know: ['Aggregate accuracy can hide weak document types or fields', 'Stratified sampling measures error in high-confidence output', 'Field-level confidence must be calibrated on labelled data'],
      skills: ['Check accuracy per type and field before reducing review', 'Route low-confidence or contradictory items to humans first'] },
    { id: '5.6', title: 'Preserve information provenance and handle uncertainty in multi-source synthesis',
      know: ['Summaries lose claim-to-source links unless kept structured', 'Conflicting credible figures should be shown with attribution', 'Dates prevent time differences looking like contradictions'],
      skills: ['Carry claim-source mappings through synthesis', 'Separate established from contested findings', 'Render each content type in a suitable format'] },
  ],

  scenarios: [
    { id: 1, name: 'Customer Support Resolution Agent', domains: ['D1', 'D2', 'D5'],
      blurb: 'An Agent SDK support agent handles returns, billing disputes and account issues through MCP tools, aiming for high first-contact resolution while knowing when to escalate.' },
    { id: 2, name: 'Code Generation with Claude Code', domains: ['D3', 'D5'],
      blurb: 'A team uses Claude Code for generation, refactoring, debugging and docs, with custom commands, CLAUDE.md setup and a choice between plan mode and direct execution.' },
    { id: 3, name: 'Multi-Agent Research System', domains: ['D1', 'D2', 'D5'],
      blurb: 'A coordinator delegates to search, analysis, synthesis and report subagents to produce cited research reports.' },
    { id: 4, name: 'Developer Productivity with Claude', domains: ['D2', 'D3', 'D1'],
      blurb: 'An agent helps engineers explore unfamiliar code, understand legacy systems, generate boilerplate and automate chores with built-in tools and MCP servers.' },
    { id: 5, name: 'Claude Code for Continuous Integration', domains: ['D3', 'D4'],
      blurb: 'Claude Code runs in CI/CD to review pull requests, generate tests and post feedback, with prompts tuned for actionable, low-noise findings.' },
    { id: 6, name: 'Structured Data Extraction', domains: ['D4', 'D5'],
      blurb: 'A pipeline extracts data from unstructured documents, validates it against JSON schemas, handles edge cases and feeds downstream systems.' },
  ],

  outOfScope: [
    'Fine-tuning or training models', 'API auth, billing, account management', 'Language/framework specifics beyond tool and schema config',
    'Hosting or deploying MCP servers', "Claude's internals, training, weights", 'Constitutional AI, RLHF, safety training',
    'Embeddings and vector databases', 'Computer use', 'Vision / image analysis', 'Streaming and server-sent events',
    'Rate limits, quotas, pricing maths', 'OAuth and key rotation', 'Cloud-provider specifics', 'Benchmarks and model comparisons',
    'Prompt caching internals (knowing it exists is enough)', 'Tokenisation details',
  ],
};

/* Official documentation per task statement (fetched and checked 2026-10-24), and where current docs
 * have moved on since the July 2026 guide. The exam follows the guide; the notes keep you current. */
window.GUIDE.docsCheckedOn = '2026-10-24';
window.GUIDE.docs = {
 "1.1": [
  {
   "title": "How tool use works",
   "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works"
  },
  {
   "title": "Handle tool calls",
   "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls"
  },
  {
   "title": "Stop reasons and fallback",
   "url": "https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons"
  }
 ],
 "1.2": [
  {
   "title": "How we built our multi-agent research system",
   "url": "https://www.anthropic.com/engineering/multi-agent-research-system"
  },
  {
   "title": "Create custom subagents",
   "url": "https://code.claude.com/docs/en/sub-agents"
  },
  {
   "title": "Run agents in parallel",
   "url": "https://code.claude.com/docs/en/agents"
  }
 ],
 "1.3": [
  {
   "title": "Subagents in the SDK",
   "url": "https://code.claude.com/docs/en/agent-sdk/subagents"
  },
  {
   "title": "Create custom subagents",
   "url": "https://code.claude.com/docs/en/sub-agents"
  },
  {
   "title": "Agent SDK reference · TypeScript",
   "url": "https://code.claude.com/docs/en/agent-sdk/typescript"
  }
 ],
 "1.4": [
  {
   "title": "Intercept and control agent behavior with hooks",
   "url": "https://code.claude.com/docs/en/agent-sdk/hooks"
  },
  {
   "title": "Configure permissions",
   "url": "https://code.claude.com/docs/en/agent-sdk/permissions"
  },
  {
   "title": "Handle approvals and user input",
   "url": "https://code.claude.com/docs/en/agent-sdk/user-input"
  }
 ],
 "1.5": [
  {
   "title": "Intercept and control agent behavior with hooks",
   "url": "https://code.claude.com/docs/en/agent-sdk/hooks"
  },
  {
   "title": "Hooks reference",
   "url": "https://code.claude.com/docs/en/hooks"
  }
 ],
 "1.6": [
  {
   "title": "Building effective AI agents",
   "url": "https://www.anthropic.com/engineering/building-effective-agents"
  },
  {
   "title": "Prompting best practices",
   "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
  },
  {
   "title": "Orchestrate subagents at scale with dynamic workflows",
   "url": "https://code.claude.com/docs/en/workflows"
  }
 ],
 "1.7": [
  {
   "title": "Work with sessions",
   "url": "https://code.claude.com/docs/en/agent-sdk/sessions"
  },
  {
   "title": "Manage sessions",
   "url": "https://code.claude.com/docs/en/sessions"
  }
 ],
 "2.1": [
  {
   "title": "Define tools",
   "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools"
  },
  {
   "title": "Writing effective tools for AI agents",
   "url": "https://www.anthropic.com/engineering/writing-tools-for-agents"
  }
 ],
 "2.2": [
  {
   "title": "MCP specification: Tools",
   "url": "https://modelcontextprotocol.io/specification/2026-07-28/server/tools"
  },
  {
   "title": "Give Claude custom tools (Agent SDK) · Handle errors",
   "url": "https://code.claude.com/docs/en/agent-sdk/custom-tools"
  },
  {
   "title": "Handle tool calls",
   "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls"
  }
 ],
 "2.3": [
  {
   "title": "Define tools",
   "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools"
  },
  {
   "title": "Parallel tool use",
   "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use"
  },
  {
   "title": "Subagents in the SDK",
   "url": "https://code.claude.com/docs/en/agent-sdk/subagents"
  }
 ],
 "2.4": [
  {
   "title": "Connect Claude Code to tools via MCP",
   "url": "https://code.claude.com/docs/en/mcp"
  },
  {
   "title": "Connect to MCP servers",
   "url": "https://code.claude.com/docs/en/mcp-quickstart"
  },
  {
   "title": "Connect to external tools with MCP",
   "url": "https://code.claude.com/docs/en/agent-sdk/mcp"
  }
 ],
 "2.5": [
  {
   "title": "Tools reference",
   "url": "https://code.claude.com/docs/en/tools-reference"
  },
  {
   "title": "How the agent loop works",
   "url": "https://code.claude.com/docs/en/agent-sdk/agent-loop"
  }
 ],
 "3.1": [
  {
   "title": "How Claude remembers your project",
   "url": "https://code.claude.com/docs/en/memory"
  },
  {
   "title": "Best practices for Claude Code: Write an effective CLAUDE.md",
   "url": "https://code.claude.com/docs/en/best-practices"
  },
  {
   "title": "Extend Claude Code: CLAUDE.md vs rules vs skills",
   "url": "https://code.claude.com/docs/en/features-overview"
  }
 ],
 "3.2": [
  {
   "title": "Extend Claude with skills",
   "url": "https://code.claude.com/docs/en/skills"
  },
  {
   "title": "Extend Claude Code: Skill vs Subagent, Hook vs Skill",
   "url": "https://code.claude.com/docs/en/features-overview"
  }
 ],
 "3.3": [
  {
   "title": "How Claude remembers your project: Path-specific rules",
   "url": "https://code.claude.com/docs/en/memory"
  },
  {
   "title": "Set up Claude Code in a monorepo or large codebase",
   "url": "https://code.claude.com/docs/en/large-codebases"
  },
  {
   "title": "Explore the context window: What survives compaction",
   "url": "https://code.claude.com/docs/en/context-window"
  }
 ],
 "3.4": [
  {
   "title": "Choose a permission mode: Plan mode",
   "url": "https://code.claude.com/docs/en/permission-modes"
  },
  {
   "title": "Create custom subagents: Built-in Explore and Plan agents",
   "url": "https://code.claude.com/docs/en/sub-agents"
  },
  {
   "title": "Best practices: Explore first, then plan, then code",
   "url": "https://code.claude.com/docs/en/best-practices"
  }
 ],
 "3.5": [
  {
   "title": "Best practices for Claude Code: verification, interview, course-correct",
   "url": "https://code.claude.com/docs/en/best-practices"
  },
  {
   "title": "Common workflows",
   "url": "https://code.claude.com/docs/en/common-workflows"
  },
  {
   "title": "Prompting best practices: Use examples effectively",
   "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
  }
 ],
 "3.6": [
  {
   "title": "Run Claude Code programmatically",
   "url": "https://code.claude.com/docs/en/headless"
  },
  {
   "title": "Claude Code GitHub Actions",
   "url": "https://code.claude.com/docs/en/github-actions"
  },
  {
   "title": "CLI reference",
   "url": "https://code.claude.com/docs/en/cli-reference"
  }
 ],
 "4.1": [
  {
   "title": "Prompting best practices",
   "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
  },
  {
   "title": "Customize Code Review",
   "url": "https://code.claude.com/docs/en/code-review-customize"
  },
  {
   "title": "Define success criteria and build evaluations",
   "url": "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests"
  }
 ],
 "4.2": [
  {
   "title": "Prompting best practices: Use examples effectively",
   "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
  },
  {
   "title": "Increase output consistency",
   "url": "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency"
  },
  {
   "title": "Ticket routing use-case guide",
   "url": "https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing"
  }
 ],
 "4.3": [
  {
   "title": "Structured outputs",
   "url": "https://platform.claude.com/docs/en/build-with-claude/structured-outputs"
  },
  {
   "title": "Define tools",
   "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools"
  },
  {
   "title": "Cookbook: Extracting structured JSON using Claude and tool use",
   "url": "https://platform.claude.com/cookbook/tool-use-extracting-structured-json"
  }
 ],
 "4.4": [
  {
   "title": "Handle tool calls",
   "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls"
  },
  {
   "title": "Get structured output from agents",
   "url": "https://code.claude.com/docs/en/agent-sdk/structured-outputs"
  },
  {
   "title": "Structured outputs: refusals and max_tokens truncation",
   "url": "https://platform.claude.com/docs/en/build-with-claude/structured-outputs"
  }
 ],
 "4.5": [
  {
   "title": "Batch processing",
   "url": "https://platform.claude.com/docs/en/build-with-claude/batch-processing"
  },
  {
   "title": "Cookbook: Batch processing with Message Batches API",
   "url": "https://platform.claude.com/cookbook/misc-batch-processing"
  }
 ],
 "4.6": [
  {
   "title": "Code Review",
   "url": "https://code.claude.com/docs/en/code-review"
  },
  {
   "title": "Best practices: Writer/Reviewer pattern and adversarial review step",
   "url": "https://code.claude.com/docs/en/best-practices"
  },
  {
   "title": "Building effective agents",
   "url": "https://www.anthropic.com/engineering/building-effective-agents"
  }
 ],
 "5.1": [
  {
   "title": "Effective context engineering for AI agents",
   "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
  },
  {
   "title": "Prompting best practices: Long context prompting",
   "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
  },
  {
   "title": "Writing effective tools for AI agents",
   "url": "https://www.anthropic.com/engineering/writing-tools-for-agents"
  }
 ],
 "5.2": [
  {
   "title": "Agent SDK: Handle approvals and user input",
   "url": "https://code.claude.com/docs/en/agent-sdk/user-input"
  },
  {
   "title": "Prompting best practices: Balancing autonomy and safety; default-to-action vs do-not-act",
   "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
  },
  {
   "title": "Customer support agent use-case guide",
   "url": "https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat"
  }
 ],
 "5.3": [
  {
   "title": "How we built our multi-agent research system",
   "url": "https://www.anthropic.com/engineering/multi-agent-research-system"
  },
  {
   "title": "Create custom subagents: API errors in subagents, partial results",
   "url": "https://code.claude.com/docs/en/sub-agents"
  },
  {
   "title": "Handle tool calls: is_error and instructive error messages",
   "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls"
  }
 ],
 "5.4": [
  {
   "title": "Explore the context window: What survives compaction",
   "url": "https://code.claude.com/docs/en/context-window"
  },
  {
   "title": "Set up Claude Code in a monorepo or large codebase",
   "url": "https://code.claude.com/docs/en/large-codebases"
  },
  {
   "title": "Best practices: Manage context aggressively; use subagents for investigation",
   "url": "https://code.claude.com/docs/en/best-practices"
  }
 ],
 "5.5": [
  {
   "title": "Define success criteria and build evaluations",
   "url": "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests"
  },
  {
   "title": "Demystifying evals for AI agents",
   "url": "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
  },
  {
   "title": "Content moderation use-case guide",
   "url": "https://platform.claude.com/docs/en/about-claude/use-case-guides/content-moderation"
  }
 ],
 "5.6": [
  {
   "title": "Citations",
   "url": "https://platform.claude.com/docs/en/build-with-claude/citations"
  },
  {
   "title": "Search results",
   "url": "https://platform.claude.com/docs/en/build-with-claude/search-results"
  },
  {
   "title": "How we built our multi-agent research system",
   "url": "https://www.anthropic.com/engineering/multi-agent-research-system"
  }
 ]
};

window.GUIDE.deltas = {
 "1.1": "The API has newer stop reasons (pause_turn, refusal, model_context_window_exceeded). The core rule the exam tests still holds: continue on tool_use, stop on end_turn.",
 "1.3": "Claude Code v2.1.63 renamed the Task tool to Agent (Task still works as an alias). allowedTools auto-approves tools; restricting them uses tools / disallowedTools. Subagents now run in the background and can nest. Answer exam items in the guide's terms.",
 "1.4": "PreToolUse hooks can now return permissionDecision \"defer\", which pauses the run with stop_reason tool_deferred until a human decides (headless -p runs only, one tool call per turn; the calling app resumes the session).",
 "1.5": "PostToolUse hooks can replace any tool's result with updatedToolOutput (updatedMCPToolOutput is the older, MCP-only field).",
 "2.2": "The MCP spec has no standard retryable field: errorCategory / isRetryable are an application convention inside the result. Since spec 2025-11-25, input validation errors come back as isError results.",
 "2.3": "On the newest models (Opus 5.5, Sonnet 5.5, Fable 5.1, Mythos 5.1) tool_choice \"any\" and forced tool return a 400; the docs suggest auto with strict tool use. The guide still tests auto / any / forced.",
 "2.4": "claude mcp add defaults to local scope (private to you, in this project); shared team servers need --scope project. SSE transport is deprecated in favour of HTTP.",
 "2.5": "On macOS, Linux and WSL, Glob and Grep are no longer in Claude Code's default tool set; Claude searches with find/grep through Bash unless you enable them.",
 "3.1": "@imports organise instructions but load together with the parent file, so they don't save context. After compaction, nested CLAUDE.md files reload only when a matching file is touched again. /memory now lists and opens memory files; to see which CLAUDE.md and rules files actually loaded, run /context. Exam items keep the guide's /memory wording.",
 "3.2": "Custom commands and skills are now one system: .claude/commands/x.md and .claude/skills/x/SKILL.md both create /x. allowed-tools pre-approves tools for the skill's turn rather than blocking others.",
 "3.3": "Path-scoped rules drop out at compaction and reload when a matching file is touched again.",
 "3.4": "The built-in Explore subagent now runs on the main conversation's model and starts without CLAUDE.md.",
 "3.6": "--json-schema works only with -p, and the result lands in structured_output. The GitHub Action v1 replaced direct_prompt with prompt; CLI flags go in claude_args.",
 "4.3": "Structured outputs are generally available (no beta header) and can't be combined with citations or prefill. See 2.3 for forced tool_choice on the newest models.",
 "4.5": "A batch request may carry tool definitions and earlier tool turns, but your code can't run a tool mid-request. Results are kept for 29 days.",
 "5.1": "Anthropic's docs call the long-context problem \"context rot\". Put long documents at the top and the question at the end."
};

/* Exam-day facts and prep from official program pages; tips are themes from public candidate write-ups. */
window.GUIDE.prep = {
 "facts": [
  "Open only to employees of Claude Partner Network organisations (company email). Everyone else can take the free courses on academy.claude.com.",
  "Delivered by Pearson VUE: online (OnVUE) or at a test center. About 135 minutes of seat time for 120 minutes of answering.",
  "Offered in English and Japanese. Closed book, no AI tools. Online, you get a digital whiteboard and the proctor can't pause the clock.",
  "Your score shows on screen at the end. Reschedule or cancel free up to 48 hours before (the guide's 24 hours is out of date).",
  "The old official practice exam was retired in the June 2026 move to Pearson. The guide's 12 sample questions and 4 exercises are the only official practice material."
 ],
 "courses": [
  {
   "title": "Building with the Claude API (~9 h)",
   "url": "https://academy.claude.com/courses/building-with-the-claude-api"
  },
  {
   "title": "Claude Code in Action (~1 h)",
   "url": "https://academy.claude.com/courses/claude-code-in-action"
  },
  {
   "title": "Introduction to Model Context Protocol (~1 h)",
   "url": "https://academy.claude.com/courses/introduction-to-model-context-protocol"
  },
  {
   "title": "MCP: Advanced Topics (~1.5 h)",
   "url": "https://academy.claude.com/courses/model-context-protocol-advanced-topics"
  },
  {
   "title": "Introduction to subagents (~45 min)",
   "url": "https://academy.claude.com/courses/introduction-to-subagents"
  },
  {
   "title": "Introduction to agent skills (~1 h)",
   "url": "https://academy.claude.com/courses/introduction-to-agent-skills"
  },
  {
   "title": "Agent SDK docs (no official course)",
   "url": "https://code.claude.com/docs/en/agent-sdk/overview"
  }
 ],
 "official": [
  {
   "title": "Partner Academy certification page",
   "url": "https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification"
  },
  {
   "title": "Certification FAQ",
   "url": "https://anthropic-partners.skilljar.com/page/faq-certifications"
  },
  {
   "title": "Official prep course list",
   "url": "https://anthropic-partners.skilljar.com/page/claude-certified-architect-foundations-prep-courses"
  },
  {
   "title": "Pearson VUE: Anthropic",
   "url": "https://www.pearsonvue.com/us/en/anthropic.html"
  },
  {
   "title": "Pearson OnVUE rules",
   "url": "https://www.pearsonvue.com/us/en/anthropic/onvue.html"
  },
  {
   "title": "Credly badge skills",
   "url": "https://www.credly.com/org/anthropic/badge/claude-certified-architect-foundations"
  }
 ],
 "tips": [
  "Time is the most common complaint. Read the question before the scenario, aim to commit in about 90 seconds, flag and move on.",
  "Never leave a blank: unanswered items score the same as wrong ones.",
  "Expect several plausible options. Look for the root-cause fix over the patch, and use the out-of-scope list to rule options out.",
  "Hands-on time pays off: build a small Agent SDK agent, an MCP server, and run Claude Code headless in CI.",
  "Repeated practice pools inflate scores. Watch the \"seen before\" count on your mock results."
 ]
};
