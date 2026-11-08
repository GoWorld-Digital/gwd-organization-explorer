# GWD — AI-Native Organization Explorer

> **Explore the architecture of an AI-Native organization.**
>
> A cinematic, interactive and evidence-aware experience for exploring GWD's proposed organizational model, its capability ecosystem and illustrative business scenarios.

## Product status

**Stage:** Blueprint / product architecture  
**Public destination (proposed):** `https://explore.goworld.digital`  
**Repository:** `GoWorld-Digital/gwd-organization-explorer`  
**Organization:** GoWorld Digital (GWD)

This repository is the independent public-experience project. It is not the GWD Ops Core, not an ERP, not a live agent control plane and not an AtlasHub product.

## What this will become

The Explorer will combine five connected experiences:

1. **Organization Explorer** — governance, executive leadership, shared services, business units, cost/profit centres, ventures and labs.
2. **Agency Agents Explorer** — a searchable, attributable view of the 18 divisions and 283 agent profiles inventoried from the Agency Agents source repository.
3. **Business Architecture Simulator** — illustrative cost, profit and investment-centre models.
4. **Mission Simulator** — explain how a hypothetical business mission mobilizes capabilities, units and human approvals.
5. **Ventures & Innovation** — a portfolio view of proposed labs, experiments and future ventures.

The visual grammar is cinematic and spatial, but the product remains serious, comprehensible, accessible and honest about what is proposed, catalogued, tested or operational.

## Non-negotiable truth rules

- The 283 Agency Agents profiles are a **source catalogue**, not 283 agents deployed by GWD.
- The 18 divisions are capability domains, not necessarily GWD departments.
- Governance bodies and business units shown in the first release are a **proposed organizational model** unless independently confirmed as formally constituted.
- Financial values in demos are illustrative assumptions, never actual GWD results or forecasts.
- No Agency Agents content is copied wholesale until source commit, attribution, license and file-level suitability are reviewed.
- `atlas-agent-packs` is an AtlasHub.SI project and is **out of scope** for this GWD build.
- The Explorer initially uses curated, versioned static data. It must not depend on GWD Ops Core or a database to launch.

## Read first

1. [Product brief](docs/PRODUCT_BRIEF.md)
2. [Organizational model](docs/ORGANIZATION_MODEL.md)
3. [Experience and information architecture](docs/EXPERIENCE_ARCHITECTURE.md)
4. [Art direction](docs/ART_DIRECTION.md)
5. [3D scene and interaction specification](docs/3D_SCENE_SPEC.md)
6. [Technical architecture](docs/TECHNICAL_ARCHITECTURE.md)
7. [Agency Agents source and provenance](docs/AGENCY_AGENTS_SOURCE.md)
8. [Roadmap and acceptance criteria](docs/ROADMAP_AND_ACCEPTANCE.md)
9. [Master build prompt](prompts/MASTER_BUILD_PROMPT.md)

## Recommended implementation stack

- Next.js 16.x (Active LTS), React 19.x and TypeScript.
- Three.js + React Three Fiber 9 + Drei for the cinematic 3D scene.
- React Flow / XYFlow for precise 2D hierarchy and network views.
- GSAP for choreographed cinematic sequences and scroll-linked storytelling.
- Motion for UI transitions, shared layouts and micro-interactions.
- Tailwind CSS with a documented GWD design-token layer.
- Zod for structured data validation.
- Vitest and Playwright for tests and browser verification.

Use stable releases. Do not adopt React Three Fiber v10 alpha or a WebGPU-only architecture for the first public version. WebGL2 is the baseline; WebGPU may be evaluated behind a tested progressive-enhancement path.

## Working principles

- The public experience is read-only and privacy-safe.
- The first release has no login, no user data collection and no write path to operational systems.
- All important content has provenance and a status label.
- 3D is for spatial orientation and emotional impact; 2D is for precise reading and navigation.
- Motion must support comprehension, not compete with it.
- The app must remain useful when 3D, WebGL or motion is unavailable.

## Repository structure (target)

```
app/                         Next.js application
components/                  UI and scene components
content/                     curated organization and capability data
design/mockups/              visual direction and wireframes
docs/                        product, architecture and QA specifications
public/                      approved assets only
prompts/                     execution prompts by agent and phase
.agents/skills/              portable Agent Skills
.agents/rules/               Antigravity workspace rules
.claude/skills/              Claude Code skill mirrors
```

## First engineering objective

Build a **high-fidelity vertical slice**, not a broad but shallow app:

1. Responsive cinematic opening.
2. A navigable 3D organization structure with five layers.
3. Selecting a layer opens an informative panel and a synchronized 2D view.
4. The public 18-division Agency Agents capability map is explorable with correct counts and provenance.
5. Reduced-motion and non-WebGL fallback.
6. Automated tests plus desktop, tablet and mobile screenshots.

Do not deploy or connect a production domain before the visual, content, accessibility and security gates in the roadmap are satisfied.
