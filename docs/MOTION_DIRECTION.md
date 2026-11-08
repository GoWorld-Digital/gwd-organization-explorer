# Motion and sensory direction

## Motion thesis
Motion should create the feeling of discovering a designed system. Each movement must reveal structure, indicate relationships, guide attention or explain a process. No constant particle storms or perpetual movement that competes with reading.

## Opening storyboard (12–18 seconds, skippable)
- 00–02s: dark field; a few precise points appear. Audio optional, off by default.
- 02–05s: fine lines connect selected points; central geometry resolves.
- 05–09s: five layers separate into a readable stack; labels appear sequentially.
- 09–13s: 18 division clusters appear around the organization; label the figure “283 source profiles catalogued”.
- 13–18s: camera settles; choices appear: Explore organization / Explore capabilities / Simulate a mission.

A visible Skip control exists from the first frame.

## Timing ranges
Micro-interaction 140–220ms; panel 240–380ms; focus 450–800ms; major scene transition 700–1200ms. All transitions are interruptible.

## Motion roles
- GSAP timelines: choreographed opening and scene sequences.
- ScrollTrigger: optional editorial storytelling only; core navigation must not depend on scroll.
- Motion for React: panels, cards, menus, shared layout and gestures.
- Three render loop: object drift, camera damping and shader uniforms.

Do not allow multiple animation libraries to control the same property on the same element.

## Sound
Optional and disabled by default. Never autoplay. Provide an explicit control. Sound must not carry essential meaning.

## Reduced motion
When prefers-reduced-motion is active, skip or shorten the opening, disable parallax/camera drift/particle travel, replace transitions with short opacity changes, and preserve all information and navigation.

## Cinematic quality bar
Every transition preserves orientation, selected content, user control and readable labels; it must work on touch devices, be keyboard accessible and avoid motion sickness.
