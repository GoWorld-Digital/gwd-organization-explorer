# Claude Code project guidance

Read AGENTS.md first. It is the shared repository contract and source of truth.

Read the product, design, scene, data-provenance and acceptance documents before implementation. Use project skills under .claude/skills where appropriate; portable versions also live under .agents/skills.

For visual work, do not stop after compiling. Run the app, inspect it in a real browser, capture screenshots at 1440px, 1024px, 390px and 360px widths, and compare against the design and acceptance criteria.

Use subagents for independent audits (architecture, accessibility, performance, content integrity), not simultaneous edits to the same files. Keep one primary implementation agent responsible for integration.

Do not deploy or modify DNS. Do not connect operational databases. Do not state that the 283 profiles are active GWD agents.
