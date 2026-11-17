const latestApi = 'https://api.github.com/repos/yancelic/Encore/releases/latest';
const latestPage = 'https://github.com/yancelic/Encore/releases/latest';
const betaApi = 'https://api.github.com/repos/yancelic/Encore/releases/tags/beta';
const betaPage = 'https://github.com/yancelic/Encore/releases/tag/beta';
const platforms = new Map([
  ['windows', { api: latestApi, page: latestPage, matches: name => !/arm64|aarch64|armv7|ia32|i[3-6]86|x86(?![_-]64)|portable/i.test(name) && /(?:setup|install).*\.exe$|\.msi$/i.test(name) }],
  ['macos', { api: latestApi, page: latestPage, matches: name => /(?:aarch64|arm64|apple[-_ ]silicon).*\.dmg$/i.test(name) }],
  ['ubuntu', { api: betaApi, page: betaPage, beta: true, matches: name => /(?:amd64|x86[_-]64|x64)\.deb$/i.test(name) }],
  ['flatpak', { api: betaApi, page: betaPage, beta: true, matches: name => /(?:amd64|x86[_-]64|x64)\.flatpak$/i.test(name) }],
]);

export function selectWindowsInstaller(release) {
  return selectInstaller(release, 'windows');
}

export function selectInstaller(release, platform) {
  const config = platforms.get(platform);
  if (!config || !release || release.draft || !Array.isArray(release.assets)) return null;
  if (config.beta ? release.tag_name !== 'beta' : release.prerelease) return null;
  return release.assets
    .filter(asset => {
      if (asset.state !== 'uploaded' || typeof asset.name !== 'string') return false;
      const name = asset.name;
      if (!/^encore/i.test(name) || !config.matches(name)) return false;
      try {
        const url = new URL(asset.browser_download_url);
        const path = '/yancelic/encore/releases/download/';
        return url.origin === 'https://github.com' && !url.username && !url.password &&
          url.pathname.toLowerCase().startsWith(config.beta ? `${path}beta/` : path);
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
  const parameters = new URL(request.url ?? '/', 'https://encore-clips.vercel.app').searchParams.getAll('platform');
  const platform = request.query?.platform ?? (parameters.length > 1 ? parameters : parameters[0]) ?? 'windows';
  const config = platforms.get(platform);
  if (!config) {
    response.setHeader('Cache-Control', 'no-store');
    response.statusCode = 400;
    return response.end('Unknown platform. Choose windows, macos, ubuntu, or flatpak.');
  }
  let destination = config.page;
  let foundInstaller = false;
  try {
    const result = await fetch(config.api, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Encore-Website' },
      signal: AbortSignal.timeout(5000),
    });
    if (result.ok) {
      const installer = selectInstaller(await result.json(), platform);
      if (installer) { destination = installer.browser_download_url; foundInstaller = true; }
    }
  } catch {}
  response.setHeader('Cache-Control', foundInstaller ? 'public, max-age=0, s-maxage=60, stale-while-revalidate=60' : 'no-store');
  response.setHeader('Location', destination);
  response.statusCode = 307;
  response.end();
}
