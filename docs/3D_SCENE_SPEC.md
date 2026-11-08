# 3D Scene Specification

## Objective
Translate the proposed organization into a spatial model that is quickly understood and then explored layer by layer.

## Spatial grammar
A central vertical architectural stack with five organizational strata, surrounded by 18 capability clusters. This surrounding capability constellation is an overlay, not a command hierarchy.

- Layer 1 / Governance: compact, topmost, visually protected.
- Layer 2 / Executive Leadership: central coordination tier.
- Layer 3 / Shared Services: broad transversal ring.
- Layer 4 / Business Units: four balanced radial zones.
- Layer 5 / Labs & Innovation: lower/foundation tier with experimental branches.
- Agency Agents constellation: 18 clusters anchored around the core; visually linked to relevant functions without implying management authority.

## Geometry
Use procedural low-poly/clean geometry and reusable primitives:
- shallow architectural plates or softened polygonal platforms;
- thin arcs, Bezier connectors and radial paths;
- small instanced nodes for capability clusters;
- DOM labels and accessible detail panels;
- one coherent central focal object.

Do not create a 3D mesh for every profile. Use 18 3D capability anchors; profile-level detail belongs in a searchable 2D list.

## Suggested scene components
OrganizationCanvas; OrganizationScene; LayerStack; CapabilityConstellation; ConnectionField; CameraDirector; Atmosphere; SceneFallback. DOM overlays own headings, controls, legends and details.

## Camera states
overview, governance, executive, shared-services, business-units, labs, capabilities and reset. Transitions should be short, smooth, reversible and interruptible. Do not rotate the camera while someone is reading a detail panel.

## Interaction
Pointer, keyboard and touch selection. Selection mirrors into accessible DOM. Provide visible Reset and 2D View actions. No hover-only disclosure or auto-follow camera that fights user control.

## Motion ownership
- React Three Fiber / Three.js: scene graph, geometry, lighting, camera, raycasting and subtle scene motion.
- GSAP: cinematic opening, named camera shots and optional scroll storytelling.
- Motion for React: DOM navigation, panels, menus and micro-interactions.
- useFrame only for ref-based high-frequency scene motion; never trigger broad React renders every frame.
- Never let GSAP and Motion animate the same element/property at once.

## Rendering
WebGL2 is the baseline. WebGPU is an optional future progressive enhancement, never a V1 requirement. Keep bloom/vignette/atmospheric effects restrained; never blur text. Support context loss and static/2D fallback.

## Assets
Prefer procedural scene assets in V1. Any later GLB/glTF file needs a provenance/author/licence record and size budget. Do not use stock or generated images that falsely depict real GWD offices, staff or deployed infrastructure.
