# Proposed GWD Organizational Model

**Persistent public label:** Proposed organizational model — subject to governance and legal formalization.

## Layer 1 — Governance
- **Board of Administration (`board`, proposed):** Define institutional purpose, long-term strategic direction, capital allocation principles, risk appetite and executive accountability.
- **Advisory / Strategic Council (`advisory-council`, proposed):** Provide independent domain expertise, research critique, strategic challenge and ecosystem perspectives without executive or statutory authority (`advises` -> `board`).

## Layer 2 — Executive Leadership
- **CEO & Executive Direction (`ceo-direction`, proposed):** Translate board mandate into corporate strategy, operating priorities, portfolio resource allocation and executive accountability (`reports_to` -> `board`).
- **AI Operations / Ops Core (`ai-operations`, design-principle):** Intended coordination architecture for cross-unit missions, dependency tracking, human approval gates, budget evidence and operating rhythm (`reports_to` -> `ceo-direction`). This Explorer is not Ops Core and must not present it as operational.

## Layer 3 — Shared Services / Transversal Departments
- **Strategy & Intelligence (`strategy-intelligence`, cost-centre):** Strategic analysis, market/competitive intelligence, geospatial/data synthesis and scenario planning.
- **Finance & Administration (`finance-admin`, cost-centre):** Financial control, budgeting, shared-service cost allocation, unit-economics reporting and administration.
- **People & Agent Operations (`people-agent-ops`, cost-centre):** Human talent, role design, upstream agent profile evaluation, capability lifecycle governance and human-in-the-loop standards.
- **AI Platform & Engineering (`ai-platform-engineering`, cost-centre):** Shared software infrastructure, AI integration patterns, reliability engineering and automated quality verification.
- **Legal, Risk & Compliance (`legal-risk-compliance`, cost-centre):** Legal review, IP/licensing provenance, regulatory compliance, contract governance and risk controls.
- **Marketing & Communications (`marketing-comms`, cost-centre-or-allocated-service):** Institutional brand narrative, public communications, editorial standards and shared demand-generation systems.
- **Product & Innovation (`product-innovation`, cost-centre-or-allocated-service):** Product strategy, design systems, spatial/interactive UX, prototyping standards and quality of experience.
- **Security & Data Governance (`security-data-governance`, cost-centre):** Cybersecurity architecture, privacy protection, data access boundaries, auditability and operational assurance.

These begin as central cost centres (`reports_to` -> `ceo-direction`) with explicit `provides_service_to` edges to Business Units; do not invent named office holders or claim the functions are staffed.

## Layer 4 — Business Units
- **GWD Academy (`academy`, profit-centre-candidate, proposed):** Executive education, applied AI training programs, learning communities, curricula and certification tracks.
- **GWD Media Factory & Growth (`media-growth`, profit-centre-candidate, proposed):** Digital media production, interactive brand storytelling, multi-channel campaigns and growth programs.
- **GWD Sales & Customer Operations (`sales-customer-ops`, profit-centre-candidate, proposed):** Commercial pipeline operations, client onboarding, CRM workflows, service delivery coordination and customer success.
- **GWD Ventures & Venture Studio (`ventures`, investment-centre-candidate, proposed, `maturityStage: "venture-proposal"`):** Identify, validate and incubate new AI-native venture opportunities, strategic partnerships and potential spin-offs under stage-gated capital discipline.

Academy, Media and Sales are profit-centre candidates only once real products, revenue, cost allocation and accountability exist. Ventures is an investment-centre candidate, not an established fund.

## Layer 5 — Labs & Innovation
Canonical Layer 5 Labs (`economicType: "innovation-cost-centre-candidate"`, `status: "proposed"`):
1. **AI Research & Systems Lab (`ai-research-lab`, `maturityStage: "research"`):** Applied AI systems, model evaluation benchmarks, reasoning reliability and foundational technical capabilities (`reports_to` -> `ceo-direction`).
2. **Agentic Architecture Lab (`agentic-architecture-lab`, `maturityStage: "prototype"`):** Multi-step workflow orchestration, bounded tool use, verification loops and human-approval gate protocols (`reports_to` -> `ceo-direction`).
3. **Data & Knowledge Lab (`data-knowledge-lab`, `maturityStage: "research"`):** Structured knowledge graphs, provenance tracking, geospatial/domain datasets and retrieval quality (`reports_to` -> `ceo-direction`).
4. **Human-AI Interaction Lab (`human-ai-interaction-lab`, `maturityStage: "prototype"`):** Spatial interfaces, supervisory command environments, accessible 2D/3D visual grammars and collaborative human-agent workflows (`reports_to` -> `ceo-direction`).
5. **Venture Experimentation Lab (`venture-experimentation-lab`, `maturityStage: "validation"`):** Time-boxed problem discovery, market validation sprints and early prototypes prior to formal Venture Studio incubation (`reports_to` -> `ventures`).

Labs are proposed/time-boxed experiments; promote to BU or venture only by explicit decision.

### Documented Discrepancy Note (5 Labs vs. 3 Labs Across Blueprint Branches)
- **`blueprint/immersive-explorer-v1` (canonical active branch):** Specifies the 5 Labs listed above (`ai-research-lab`, `agentic-architecture-lab`, `data-knowledge-lab`, `human-ai-interaction-lab`, `venture-experimentation-lab`).
- **`blueprint/gwd-explorer-v1` (earlier seed `organization.seed.json`):** Specified 3 Labs: `AI & Systems Lab` (`ai-systems-lab`), `Organization Design Lab` (`organization-design-lab`, focused on AI-native operating models, human-agent collaboration and decision rights), and `Venture Lab` (`venture-lab`).
- **Reconciliation:** The 5-Lab model on `blueprint/immersive-explorer-v1` is preserved as canonical (`discrepancyNotes` in `content/organization/organization-model.json`). Whether `Organization Design Lab` should be added as a 6th Lab or remain consolidated within `Human-AI Interaction Lab` and `People & Agent Operations` is recorded as an open organizational decision for human governance.

## Agency Agents as Cross-Cutting Capability Ecosystem
The upstream Agency Agents library is a capability taxonomy, not a reporting hierarchy. Each division maps to candidate GWD units via explicit `capability_supports` edges (`status: "catalogued"`). An agent profile is not an employee, contractor or active production agent.

## Relationship Rules
- `reports_to`: formal accountability (`ceo-direction` -> `board`; shared services, BUs and core labs -> `ceo-direction`; `venture-experimentation-lab` -> `ventures`).
- `advises`: non-binding strategic/domain counsel (`advisory-council` -> `board`).
- `provides_service_to`: transversal shared-service delivery from Layer 3 units to Layer 4 Business Units.
- `capability_supports`: candidate mapping from the 18 Agency Agents divisions to GWD units.
- Human approval remains mandatory for legal, financial, client, security-sensitive, strategic and launch actions.
