# CLAUDE.md — Apex Prometheus Immersive Landing Page

## Always Do First
- **Run Blueprint Mode** before writing any frontend code, every session, no exceptions. The blueprint skill is located at `blueprint-mode.skill` in the project root. Extract and read it with: `unzip -p blueprint-mode.skill "blueprint-mode/SKILL.md"`. Follow its 9-phase process (Structural Scan → SVG Blueprint → Spec Tables → Color Map → Responsive Breakpoints → State Mapping → Animation Specs → Accessibility Audit → Issues Summary). Blueprint FIRST, code SECOND.
- Read this entire file before starting any task.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `npm run dev` (Vite dev server)
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:5174`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:5173 label` → saves as `screenshot-N-label.png`
- After screenshotting, read the PNG with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"

## Project: What This Is
An immersive scroll-driven 3D landing page for apexprometheus.ai — an AI consulting company for trades and small businesses. Full-screen WebGL where scroll drives a camera through 8 scenes with HTML content overlaid.

## Stack
React 18 + TypeScript + Vite + React Three Fiber + @react-three/drei + @react-three/postprocessing + Tailwind CSS + detect-gpu

## Visual Language (every 3D scene follows this)
- Tiny white pinprick nodes: gl_PointSize 1.5-2.0 max, hard cutoff at 0.12 distance, no glow, no halo
- Lines are the star: hundreds of thin white connecting lines (opacity 0.05-0.10) forming dense woven mesh structures
- Wireframe panels: PlaneGeometry with border-only shaders, no fill — like holographic screens
- Grid floor: faint diagonal crosshatch at y=-2, opacity 0.02-0.03
- Background always #0A0A0F. Darkness is the design. Black space between particles is essential.
- Bloom 0.08 intensity, luminanceThreshold 0.8 — subtle only
- Node gl_PointSize caps at 2.0. If particles look like blobs, they're too big.
- Line opacity caps at 0.12. Lines should be gossamer threads, not thick connections.

## Brand
- Fonts: Orbitron (headings), Rajdhani (body), Share Tech Mono (labels/mono)
- Colors: --plasma #00E5FF, --fire #FF6B00, --fire-hot #FFAA00, --void #0A0A0F, --panel #161625, --text #E0E0EC, --text-dim #6A6A8A, --border-color #252540
- Cards use clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))
- Flame logo: https://d2xsxph8kpxj0f.cloudfront.net/310519663387224517/jub4jdiQA2cL5JLPsWtMq2/digital-flame-circle-transparent_b225caae.png

## Architecture
- SCROLL_PAGES = 8
- 8 sections with 37-unit Z gaps between each phase:
  - hero(Z=-2), problem(Z=-39), offer(Z=-76), services(Z=-113), industries(Z=-150), social(Z=-187), about(Z=-224), contact(Z=-261)
- Each scene receives progress (0-1) and uses remap/smoothstep for local range
- Scenes return null outside their scroll range with 0.02 overlap
- Camera keyframes interpolated with smoothstep + 0.07 lerp damping via Catmull-Rom spline (15 waypoints, Z=+14 to Z=-290)
- Camera far plane: 400
- GPU tiers: high=120 nodes, medium=80, low=40

## 3D Text Style (canonical pattern for all sections)
- All 3D text uses drei `<Text>` components (not DOM overlays)
- Fonts: Orbitron 900 (headings), Rajdhani 500 (body), Share Tech Mono 400 (tags/labels)
- Tags: orange (#FF6B00), fontSize 0.12, letterSpacing 0.18, opacity 0.6
- Headlines: white (#E0E0EC), fontSize 0.50, cyan outline (0.005 width, 0.25 opacity) + ghost echo duplicate offset [0.04, -0.02, -0.15] in cyan at opacity 0.06
- Emphasis text (e.g. "WITH AI"): cyan (#00E5FF), fontSize 0.48-0.58
- Body: Rajdhani, fontSize 0.14, opacity 0.35, lineHeight 1.6
- Dividers: orange lineSegments, opacity 0.18
- CTA buttons: wireframe rectangles (lineSegments border + Text label). Primary: orange fill (opacity 0.15) + orange border (0.6). Secondary: dim border (#252540, 0.5) + white text (0.4)
- All text materials: fog=true, transparent=true, depthWrite=false, renderOrder layered (0-3)

## Section Layout Pattern
- Hero: text centered above, 3D object centered below (scale 0.9)
- Problem: object left (X=-8.0), text right (X=-1.5), camera approaches from right and flies through object
- Offer: text left (X=-5.0), object right (X=3.5), camera approaches from left and flies through diamond
- Each section alternates object/text sides for visual variety
- Camera path swoops toward objects and flies through their centers

## File Structure
- src/three/scenes/ — wrapper scene files (Scene1_Hero through Scene8_Contact)
- src/three/sections3D/ — 3D scene implementations (HeroSection3D, ProblemSection3D, OfferSection3D, ServicesSection3D, IndustriesSection3D, SocialSection3D, AboutSection3D, ContactSection3D)
- src/three/ — SceneManager, CameraRig, NodeNetwork, GridFloor, WireframePanel, StackedFloors, WorldEnvironment, holoGeometry.ts, fonts.ts
- src/components/ — ContentOverlay, Navigation, LoadingScreen, GrainScanlineOverlay, DiamondDivider, SeoContent
- src/components/sections/ — DOM content per section (HeroContent, ProblemContent, OfferContent, ServicesContent, IndustriesContent, SocialMediaContent, AboutContent, ContactContent)
- src/components/ui/ — aether-flow-hero.tsx
- src/hooks/ — useGpuTier
- src/utils/ — mathUtils.ts (remap, smoothstep, lerp)

## Anti-Generic Guardrails
- Never use default Tailwind palette (indigo-500, blue-600, etc.) — use the brand colors above
- Shadows: layered, color-tinted with low opacity. Never flat shadow-md.
- Typography: Orbitron for headings, Rajdhani for body — always paired, never same font for both
- Tight tracking (-0.03em) on large headings, generous line-height (1.7) on body
- Gradients: layer multiple radial gradients. Add grain/texture via SVG noise filter.
- Animations: only animate transform and opacity. Never transition-all. Use spring-style easing.
- Spacing: intentional consistent tokens, not random Tailwind steps
- Surfaces should have a layering system (base → elevated → floating)

## Hard Rules
- All 3D/WebGL components go in src/scenes/ — never import Three.js in non-canvas contexts
- 3D text uses the canonical drei Text style (see "3D Text Style" section above)
- No glow halos on nodes. Fragment shader: discard beyond 0.12 distance from center.
- Do not add sections, features, or content not requested
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use transition-all
- Every clickable element needs hover, focus-visible, and active states
- Run npm run build after changes to verify no TypeScript errors
