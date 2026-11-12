# Encore website

## User requirements

- Treat `C:/Users/Muhsin/Desktop/DevMode/Antigravity Projeleri/rustclip` as strictly read-only. Never create, edit, delete, format, build, or install dependencies there. Read source files only when needed for reference.
- Website work belongs in `C:/Users/Muhsin/Desktop/DevMode/Codex Projects/Encore Website`.
- No emojis in the website, copy, or communication.
- Avoid generic AI-generated design. Make deliberate choices grounded in Encore's actual capture and editing workflow. Avoid decorative gradient washes, repetitive card grids, filler copy, and scattered entrance animations.
- Use the exact supplied palette in `palette.css`. The user also supplied directional and radial gradients using these five colors; their availability does not require using them.
- Use Motion (motion.dev) for purposeful animation; respect reduced-motion preferences.
- Current phase: website implemented and deployed to https://encore-clips.vercel.app. Preserve the established visual design.
- Current hosting target is Vercel, project encore-clips in scope echokatanas-projects. Use Vercel CLI for subsequent deployments; see DEPLOYMENT.md. The earlier private Sites deployment remains separate.
- Use the same Encore E/replay mark from assets/encore-mark.svg everywhere, including the download section and footer. Do not replace it with a plain circular replay arrow.
- Support English and Turkish throughout, with a persistent EN/TR switch.
- The replay preview must contain actual animated footage, rendered with raea from replay-source/replay.tsx, with playback and scrubbing connected to the video. Respect reduced-motion preferences.

## Product source

Repository: https://github.com/yancelic/Encore

README reviewed on 2026-11-11: https://github.com/yancelic/Encore/blob/main/README.md

Encore is a Windows game clipping and multi-track replay studio built with Rust and Tauri 2. Its README describes a headless background recorder, game or active-window capture, configurable replay buffers and hardware H.264 encoding, separate game/chat/microphone audio tracks, and clip trimming, vertical exports, and montages.

Verify release assets and any performance or compatibility claims before publishing. Do not invent benchmarks, testimonials, usage counts, or anti-cheat guarantees.

## Skills prepared

- `frontend-design`: installed globally from `anthropics/skills`, path `skills/frontend-design`.
  Source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- `motion`: installed globally from `motiondivision/ai-kit`, path `plugins/motion/skills/motion`.
  Source: https://github.com/motiondivision/ai-kit/tree/main/plugins/motion/skills/motion
- Both skills are installed and discoverable. Motion's local best-practice references are included.
- Motion runtime `14.12.0` is installed in this folder and pinned in `package.json` and `package-lock.json`. The JavaScript `animate` and `spring` exports were verified. There is no application scaffold or chosen framework yet. If React is selected, install its runtime dependencies and import Motion from `motion/react`, following https://motion.dev/docs/react.
- The free Motion MCP endpoint `https://mcp.motion.dev` is registered globally as `motion` through `codex mcp add`. Codex reported a successful login. A direct MCP initialization and tool-list request succeeded, exposing `search-motion-docs` and `insert-motion-component` on 2026-11-11. Tool availability in this chat depends on the app reloading its MCP configuration; the current turn's tool catalog does not yet include Motion.

Choose typography, layout, and the visual concept in the design phase. No final design direction has been selected yet.
