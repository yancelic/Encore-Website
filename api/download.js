const latestApi = 'https://api.github.com/repos/yancelic/Encore/releases/latest';
const latestPage = 'https://github.com/yancelic/Encore/releases/latest';

export function selectWindowsInstaller(release) {
  if (!release || release.draft || release.prerelease || !Array.isArray(release.assets)) return null;
  return release.assets
    .filter(asset => {
      if (asset.state !== 'uploaded' || typeof asset.name !== 'string') return false;
      const name = asset.name;
      if (!/^encore/i.test(name) || /arm64|aarch64|armv7|ia32|i[3-6]86|x86(?![_-]64)|portable/i.test(name)) return false;
      if (!(/(?:setup|install).*\.exe$/i.test(name) || /\.msi$/i.test(name))) return false;
      try {
        const url = new URL(asset.browser_download_url);
        return url.origin === 'https://github.com' && url.pathname.toLowerCase().startsWith('/yancelic/encore/releases/download/');
      } catch { return false; }
    })
    .sort((a, b) => installerScore(b.name) - installerScore(a.name))[0] ?? null;
}

function installerScore(name) {
  return (/x64|x86[_-]64|amd64|win64/i.test(name) ? 2 : 0) + (/\.exe$/i.test(name) ? 1 : 0);
}

export default async function download(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    response.statusCode = 405;
    return response.end();
  }
  let destination = latestPage;
  let foundInstaller = false;
  try {
    const result = await fetch(latestApi, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Encore-Website' },
      signal: AbortSignal.timeout(5000),
    });
    if (result.ok) {
      const installer = selectWindowsInstaller(await result.json());
      if (installer) { destination = installer.browser_download_url; foundInstaller = true; }
    }
  } catch {}
  response.setHeader('Cache-Control', foundInstaller ? 'public, max-age=0, s-maxage=60, stale-while-revalidate=60' : 'no-store');
  response.setHeader('Location', destination);
  response.statusCode = 307;
  response.end();
}
