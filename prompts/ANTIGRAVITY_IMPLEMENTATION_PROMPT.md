# Antigravity implementation and visual-review prompt

Read AGENTS.md, GEMINI.md and prompts/MASTER_BUILD_PROMPT.md.

Use Gemini 4 Argon for architecture and multi-step implementation. Use Antigravity's browser, screenshots and artifact review as first-class parts of the workflow.

Build the first vertical slice in a feature branch. Follow project skills in .agents/skills and workspace rules in .agents/rules. Use subagents for separate audits: visual direction, accessibility, content integrity and performance. Do not allow concurrent agents to edit the same source files.

After each major scene milestone: run the app; capture desktop/tablet/mobile screenshots; review camera, legibility, hierarchy and fallback; record and fix defects; verify keyboard and reduced-motion behaviour.

Open a PR with screenshots and test evidence. Do not deploy, configure DNS or merge.
