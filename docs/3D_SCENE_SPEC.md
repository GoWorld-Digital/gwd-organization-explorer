# 3D scene and interaction specification

## Scene concept
A spatial model of an AI-Native organization. Five stacked, slightly separated layers. Shared services form a connective belt; business units form clearly bounded modules; labs and ventures occupy an experimental zone. The Agency Agents catalogue is a surrounding capability field connected to the units it may support.

## Scene composition
- Five major strata aligned around a common axis and readable vertical rhythm.
- Governance: compact upper layer with Board of Administration and Advisory / Strategic Council.
- Executive: CEO / Executive Direction and AI Operations / coordination as a proposed function.
- Shared services: eight services in a connective belt.
- Business units: Academy, Media Factory & Growth, Sales & Customer Operations, Ventures & Venture Studio.
- Labs: AI & Systems, Organization Design and Venture Lab.
- Capability field: 18 division clusters. Cluster size may represent source profile count only, never GWD utilization or activity.

Do not build detailed text cards inside the 3D scene. Use short labels in scene and DOM panels for detail.

## Camera states
Overview; Governance focus; Business focus; Capability focus; Mission focus; Reset. Each state is accessible by normal UI controls and keyboard.

## Interaction rules
Click selects and opens a DOM detail panel. Hover is enhancement only. Keyboard activation works with Enter/Space. Focus is visible and announced through accessible labels. Every 3D view has a 2D map/list equivalent. Relationship types have distinct visual styles and a legend.

## Technical rules
- React Three Fiber 9 stable with React 19 for release 1.
- Use instancing for repeated points/edges/markers.
- Keep scene state separate from content and UI state.
- Use refs/render loop for transient animation; avoid per-frame React renders.
- Lazy-load 3D and avoid importing it into initial server-rendered path.
- Keep lighting, post-processing and materials modest.
- Do not use R3F v10 alpha/WebGPU-only architecture in production release 1.
- WebGL2 baseline; later WebGPU enhancement requires a tested WebGL2 fallback.

## Non-WebGL behaviour
If WebGL is unsupported or initialization fails, show the 2D organization explorer. Preserve labels, details, capability browsing and scenarios. Never leave a blank canvas or block navigation.
