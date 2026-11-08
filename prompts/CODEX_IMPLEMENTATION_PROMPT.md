# Codex implementation prompt

Read AGENTS.md and prompts/MASTER_BUILD_PROMPT.md.

Work as the sole primary implementation agent. Use GPT-6 Astra for the architecture pass and difficult implementation decisions; use a more efficient available model for routine changes only if quality remains adequate.

First inspect the repository and report the plan. Then build the first vertical slice in a feature branch. Use project Agent Skills under .agents/skills and inspect the recommended Vercel skills before installing.

Run the project locally. Use browser automation and screenshots to verify actual UI output. Do not stop at static component code. Complete lint, typecheck, unit tests, browser tests and production build.

Do not deploy, change DNS, merge the pull request or connect any operational system.
