# Encore website hosting

Production: https://encore.yancelic.dev (also https://encore-clips.vercel.app)

Vercel project: `encore-clips`, scope `echokatanas-projects`.

The user chose Vercel as the current hosting target on 2026-11-11. Use Vercel for subsequent website updates. The older private ChatGPT Site remains a separate deployment; do not treat it as the current production target.

## Deploy

The preferred publishing workflow is to commit and push the website changes to `main` in `yancelic/Encore-Website`. Vercel's connected Git integration builds and deploys that commit to production automatically. Check the commit's Vercel status and the live URLs after pushing.

Run checks from the website directory (never from the read-only rustclip directory):

```powershell
npm test
npm run build
```

The Vercel CLI remains available for preview deployments or an explicitly authorized manual production deployment:

```powershell
vercel deploy --yes --prod --scope echokatanas-projects
```

`vercel.json` configures the static site: `npm ci`, `npm run build`, output `dist/`. Vercel serves only the built website. `.vercelignore` excludes internal notes, replay composition source, and the old Sites metadata from source uploads.

Downloads use `/api/download`, a Vercel Function, with an optional `platform` query:

| Platform | Endpoint | Release source | Package |
| --- | --- | --- | --- |
| Windows stable | `/api/download` (or `?platform=windows`) | GitHub latest stable | x64 `.exe`, MSI fallback |
| macOS stable | `/api/download?platform=macos` | GitHub latest stable | Apple Silicon `.dmg` |
| Ubuntu beta | `/api/download?platform=ubuntu` | GitHub `beta` tag | amd64 `.deb` |
| Linux Flatpak beta | `/api/download?platform=flatpak` | GitHub `beta` tag | x86_64 `.flatpak` |

Versioned asset names are resolved dynamically; future releases do not require a website deployment. Stable downloads reject drafts and prereleases. Beta downloads accept only the `beta` tag. All packages must be fully uploaded and hosted in the Encore GitHub repository. Unknown platforms return HTTP 400. Successful redirects are cached at the edge for 60 seconds, with up to 60 seconds of stale-while-revalidate. If GitHub is unavailable or the selected package is missing, the visitor is sent to the corresponding stable or beta release page without caching the fallback. No GitHub token is required. `npm test` checks platform/channel selection, architectures, and failure behavior.

The page labels Windows and macOS as stable and Ubuntu/Flatpak as beta, with English and Turkish installation notes. macOS requires version 15+ and Apple Silicon; packages use ad-hoc signing without Apple notarization and manual updates. Linux beta packages have passed automated checks but have not yet been tested on real user devices. The Flatpak download is a standalone bundle rather than a Flathub listing.

## macOS installation guide

`/macOS` is a bilingual illustrated installation guide. `build.mjs` builds it from `macos.html` and `content/macos-guide.mjs` into `dist/macOS.html`; Vercel's `cleanUrls` serves the extensionless route. The local server supports the same route. Images in `assets/macos-install/` are supplied redrawn illustrations and are labeled as such; they have not been verified against a real Mac installation.

The homepage macOS download is a normal link to `/api/download?platform=macos`. Its unmodified-click handler also opens `/macOS?lang=<language>&download=1` in a new tab, synchronously with the user gesture. The original tab performs a native download navigation; no hidden iframe or page-load download is needed. The guide displays retry guidance and removes the status parameter from its URL. Direct visits, reloads, shared step/FAQ anchors, and language changes never trigger another download. A normal macOS download link is always available in the guide. If JavaScript or popups are blocked, the homepage download still works and the separate setup link opens the guide. The guide does not claim the file has finished downloading.

Shared `i18n.js` handles persistent EN/TR preferences and the guide's content keys, image labels, title, and description. `macos.js` switches system-image language, handles section navigation, deep-linked FAQ answers, copy feedback, and a native dialog for enlarged images. Encore interface labels remain in English. Only the dialog open feedback uses Motion, respecting reduced motion.

The permission mapping follows the app's `Permissions.tsx`: Screen & System Audio Recording and Microphone list **Encore**, while Input Monitoring lists **Encore Recorder**. The supplied beta guide was updated for the stable release and distinguishes unverified-developer alerts from damaged-app/malware alerts using Apple's support documentation. The troubleshooting command verifies downloaded DMG checksums; it does not remove quarantine flags.

The local `.vercel/` directory contains the project link and is ignored by Git. On a fresh checkout, sign in with `vercel login`, then link with:

```powershell
vercel link --yes --project encore-clips --scope echokatanas-projects
```

Never put authentication tokens in tracked files. GitHub repository: https://github.com/yancelic/Encore-Website. The main branch is connected to the existing Vercel project for automatic production deployments; other branches create previews.

## Verified on first Vercel deployment

- Root page and translations return HTTP 200.
- Updated timeline play control is present; removed scene label is absent.
- Replay video serves as video/mp4 and supports byte ranges (HTTP 206), needed for seeking.
- Existing English/Turkish switching, local fonts, and video assets are included in dist.
