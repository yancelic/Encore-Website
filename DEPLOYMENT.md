# Encore website hosting

Production: https://encore-clips.vercel.app

Vercel project: `encore-clips`, scope `echokatanas-projects`.

The user chose Vercel as the current hosting target on 2026-11-11. Use Vercel for subsequent website updates. The older private ChatGPT Site remains a separate deployment; do not treat it as the current production target.

## Deploy

Run from the website directory (never from the read-only rustclip directory):

```powershell
npm run build
vercel deploy --yes --prod --scope echokatanas-projects
```

`vercel.json` configures the static site: `npm ci`, `npm run build`, output `dist/`. Vercel serves only the built website. `.vercelignore` excludes internal notes, replay composition source, and the old Sites metadata from source uploads.

The download button uses `/api/download`, a Vercel Function. It queries GitHub's `/repos/yancelic/Encore/releases/latest` and temporarily redirects to that release's Windows x64 installer. Versioned asset names are resolved dynamically; future releases do not require a website deployment. GitHub Latest excludes drafts and prereleases. Successful redirects are cached at the edge for 60 seconds, with up to 60 seconds of stale-while-revalidate. If GitHub is unavailable or the release has no installer, the visitor is sent to the latest release page. No GitHub token is required. `npm test` checks asset selection and failure behavior.

The local `.vercel/` directory contains the project link and is ignored by Git. On a fresh checkout, sign in with `vercel login`, then link with:

```powershell
vercel link --yes --project encore-clips --scope echokatanas-projects
```

Never put authentication tokens in tracked files. There is currently no Git-triggered automatic deployment configured; this deployment uses Vercel CLI.

## Verified on first Vercel deployment

- Root page and translations return HTTP 200.
- Updated timeline play control is present; removed scene label is absent.
- Replay video serves as video/mp4 and supports byte ranges (HTTP 206), needed for seeking.
- Existing English/Turkish switching, local fonts, and video assets are included in dist.
