# AI tooling, agent roles and project skills

## Recommended delivery arrangement
Use one primary implementation agent and one independent visual reviewer. Do not let three coding agents make concurrent changes to the same working tree.

### Primary recommendation: Codex with GPT-6 Astra
Use Codex as primary code implementation:
- It is dedicated to repository work, code changes, terminal commands, tests and review.
- It can inspect the repository and run the local toolchain.
- Use GPT-6 Astra for architecture-heavy or unfamiliar work; use a more efficient available model for routine edits where appropriate.
- Start with a plan and permissions review. Work on a branch.

### Visual review: Antigravity with Gemini 4 Argon
Use Antigravity for a separate visual QA pass:
- Open the implementation branch after the primary builder has completed a milestone.
- Inspect the actual running app in its browser.
- Capture screenshots and walkthrough artifacts.
- Review scene pacing, composition, mobile behaviour and interaction hierarchy.
- Produce a findings report. Do not independently rewrite the same branch while Codex is active.

### Alternative primary: Claude Code with Claude Opus 5.5
Claude Code with Opus 5.5 is a credible alternative for long-running agentic coding and complex systems work. Choose it as the primary builder if preferred, not as a simultaneous co-author with Codex.

## Suggested workflow
1. GPT-6 Astra / ChatGPT Work coordinates product decisions, reviews plans and reconciles deliverables.
2. Codex implements, tests and manages Git changes.
3. Antigravity / Gemini 4 Argon reviews the browser experience after each visual milestone.
4. Claude Code / Opus 5.5 is an alternative builder or independent architecture/code reviewer.
5. Human owner approves public claims, license decisions, launch and production domain.

## Project skills
Portable Agent Skills live under .agents/skills and are mirrored under .claude/skills for Claude Code. Antigravity discovers workspace skills under .agents/skills. Codex can use project skills under .agents/skills.

Initial custom skills:
- gwd-art-direction
- gwd-r3f-cinematic
- gwd-org-data-integrity
- gwd-visual-qa

## External skills to inspect/install
Use skills CLI and inspect the resulting files before installation:
- Vercel React Best Practices: vercel-labs/agent-skills / react-best-practices.
- Vercel Composition Patterns: vercel-labs/agent-skills / composition-patterns.
- Vercel Next Dev Loop: vercel-labs/agent-skills / next-dev-loop.
- Agent Skills specification: agentskills/agentskills.

Record exact version/commit and license. Do not blindly install skills containing scripts.

## Skills versus tools
A skill provides repeatable guidance. It does not grant access to GitHub, Vercel, a browser, shell, database or production environment. Access and permission are separate.
