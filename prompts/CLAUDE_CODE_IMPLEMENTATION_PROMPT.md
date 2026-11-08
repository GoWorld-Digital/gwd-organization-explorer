# Claude Code implementation prompt

Read AGENTS.md, CLAUDE.md and prompts/MASTER_BUILD_PROMPT.md.

Use Claude Opus 5.5 as the primary model for a long-running implementation, with plan-first execution and focused subagents for independent reviews. Do not have subagents edit the same files as the primary agent.

Apply project skills under .claude/skills. Keep broad invariants in CLAUDE.md and task procedures in skills. Use hooks only for deterministic checks such as formatting, typecheck or preventing secrets from being committed.

Build the first vertical slice in a feature branch. Run the app, inspect it in a real browser, capture desktop/mobile screenshots and iterate. Run full verification before opening a PR.

Do not deploy, change DNS, merge or connect operational systems.
