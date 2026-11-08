# Agent Skills and Setup

## Project-native skill locations
- Codex: `.agents/skills/gwd-immersive-organization-explorer/SKILL.md`
- Antigravity: `.agents/skills/gwd-immersive-organization-explorer/SKILL.md`
- Claude Code: `.claude/skills/gwd-immersive-organization-explorer/SKILL.md`

Keep the two skill copies synchronized.

## Recommended references
- Motion AI Kit (official): https://motion.dev/docs/ai-kit — documentation search, examples and agent skill. Install with `npx motion-ai`; follow the current installer menu and choose project scope.
- React Three Fiber skill reference: https://github.com/openai/plugins/tree/main/plugins/game-studio/skills/react-three-fiber-game — recommends separating simulation state from scene rendering, keeping HUD in DOM and using R3F helpers intentionally.
- Vercel React Best Practices: https://vercel.com/blog/introducing-react-best-practices
- Codex skills and repository instructions: https://learn.chatgpt.com/docs/build-skills
- Antigravity skills: https://antigravity.google/docs/skills/

Do not commit API keys, provider secrets or user-specific MCP configuration.
