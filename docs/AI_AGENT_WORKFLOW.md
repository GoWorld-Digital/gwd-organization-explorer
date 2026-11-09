# AI Agent Workflow — Work, Codex, Claude Code and Antigravity

## Ownership model
One agent owns all writes to an active checkout/branch. Other agents may review read-only or work in separate worktrees/branches.

| Agent | Role | Preferred use |
|---|---|---|
| ChatGPT Work (GPT-6 Astra where eligible) | Product director, research, architecture, docs, acceptance and coordination | Holds project context and manages milestones |
| Codex | Primary implementation executor, code, terminal, tests and Git | Recommended default when working with local checkout/repository |
| Claude Code (Opus 5.5 where available) | Alternative implementation executor or independent code reviewer | Use instead of Codex for a phase, not concurrent edits |
| Google Antigravity (Gemini 4 Argon) | Visual exploration, image-assisted design references, browser-based work and optional implementation | Strong for visual iteration; may own code only if selected as sole executor |

Recommended sequence: Work coordinates → Antigravity explores and proposes visual direction if needed → choose Codex OR Claude Code OR Antigravity as sole implementation owner → second model reviews diff read-only → human approves merge and release.

## Model names checked 8 Nov 2026
- OpenAI Help Center lists GPT-6 Astra for eligible ChatGPT Work and Codex experiences, subject to plan/app version.
- Antigravity model docs list Gemini 4 Argon and Claude Opus 5.5 (Thinking) on eligible Google AI plans.
- Anthropic lists Claude Opus 5.5.
Entitlements, quotas and availability depend on account/plan; check the actual selector.

## Skills
- Codex and Antigravity project skill: `.agents/skills/gwd-immersive-organization-explorer/SKILL.md`.
- Claude Code project skill: `.claude/skills/gwd-immersive-organization-explorer/SKILL.md`.
- Official Motion AI Kit: https://motion.dev/docs/ai-kit ; install with `npx motion-ai`, follow the current installer menu and select project scope. Current installer lists Claude Code, Cursor, Amp, OpenCode, Gemini CLI and custom-folder installation. Verify the current supported host rather than assuming a named adapter.
- React Three Fiber skill reference: https://github.com/openai/plugins/tree/main/plugins/game-studio/skills/react-three-fiber-game
- Antigravity skill discovery: https://antigravity.google/docs/skills/
- Codex project guidance/skills: https://learn.chatgpt.com/docs/build-skills

Do not allow multiple agents to edit the same checkout concurrently. Use separate worktrees if parallel work is specifically required.
