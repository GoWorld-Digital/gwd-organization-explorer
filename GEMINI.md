# Antigravity project guidance

Read AGENTS.md before making changes. It contains shared product truth, architecture constraints and verification gates.

Read the relevant project docs before implementation. Agent Skills are located in .agents/skills. Workspace invariants are recorded in .agents/rules.

Use Antigravity's browser and artifact capabilities to iterate on the running UI. Capture and review visual artifacts at desktop and mobile widths. Do not accept a polished screenshot if keyboard use, information clarity, responsive behaviour or the 2D fallback is broken.

Use parallel agents only for isolated review tasks or independent deliverables. One primary agent owns code integration. Do not run concurrent agents that edit the same scene or shared data files.

The first release is a public, read-only, evidence-aware explorer. No operational DB, credentials, login, live agent control or production deployment is authorized by this blueprint.
