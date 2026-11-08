# Technical architecture

## Architecture decision
Build a standalone, static-first Next.js application. The initial release is public, read-only and powered by curated data in version control. No database or live operational integration is required to launch.

## Recommended stack
| Concern | Choice | Purpose |
|---|---|---|
| Framework | Next.js 16.x Active LTS | Routing, static/server rendering and deployment |
| UI | React 19.x + TypeScript | Typed composable UI |
| Styling | Tailwind CSS + CSS variables | Controlled design tokens |
| 3D | Three.js + React Three Fiber 9 stable + Drei | Spatial scene |
| 2D graph | React Flow / XYFlow | Organization and dependency maps |
| Sequenced motion | GSAP | Cinematic timelines |
| UI animation | Motion for React | Layout transitions, panels and gestures |
| State | Zustand or small React context | Shared selection and simulation state |
| Validation | Zod | Runtime validation of curated JSON |
| Icons | Lucide | Consistent iconography |
| Tests | Vitest + Testing Library | Unit and component checks |
| Browser E2E | Playwright | Real-browser paths and screenshots |
| Accessibility | axe-core + manual keyboard checks | Automated and manual a11y |
| Hosting | Vercel | Preview deployments and custom domain |

Pin current stable patch versions in the package lock when implementation starts. Do not introduce canary dependencies in production.

## Rendering strategy
- Next.js renders routes, metadata, navigation and primary informational content.
- The 3D experience is a client-only, lazy-loaded island.
- 2D organization and capability views use the same validated data.
- Heavy graphics dependencies are not loaded on informational routes until needed.
- WebGL2 is the release 1 baseline. WebGPU may be evaluated as enhancement only after stable library support and real-device fallback testing.
- Do not use R3F v10 alpha in release 1.

## Data architecture
Curated JSON/TypeScript under content/ is the source of truth:
- organization model
- capability divisions and source profiles
- mission scenarios
- status and provenance records

Validate imported/authored data at build time. Reject missing provenance or invalid status. Never silently render malformed or unreviewed imports.

## No first-release backend
Do not add Supabase, Prisma, authentication, CMS or server-side AI API calls for release 1. Any future persistence needs an architecture decision describing purpose, data classification, access control, ownership and deletion.

## Component boundaries
- app/: routes and layouts
- components/shell/: navigation and global UI
- components/organization/: 2D hierarchy and node details
- components/scene/: R3F canvas, camera, layers, edges and effects
- components/capabilities/: division/profile catalogue
- components/missions/: scenario interface and playback
- components/economics/: illustrative models and indicators
- content/: typed content
- lib/data/: schemas, loaders and selectors
- lib/motion/: tokens and timeline utilities
- design/: tokens and static mockups

## Performance architecture
Keep text and controls in DOM. Limit pixel ratio dynamically. Prefer demand rendering for static scenes. Pause render work when hidden/offscreen. Use instancing for repeated geometry. Use deterministic seeds for stable screenshots.

## SEO and sharing
Provide meaningful title, description, Open Graph image, shareable URLs for important states where practical, and accessible static content for crawlers.
