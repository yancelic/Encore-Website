import test from 'node:test';
import assert from 'node:assert/strict';
import download, { selectWindowsInstaller } from '../api/download.js';

const asset = (name, tag = 'v0.3.0') => ({
  name, state: 'uploaded',
  browser_download_url: `https://github.com/yancelic/Encore/releases/download/${tag}/${name}`,
});
const release = assets => ({ draft: false, prerelease: false, assets });

test('selects the installer from both current and future versioned releases', () => {
  for (const version of ['0.3.0', '12.4.1']) {
    const installer = asset(`Encore_${version}_x64-setup.exe`, `v${version}`);
    assert.equal(selectWindowsInstaller(release([installer])), installer);
  }
});

test('prefers the x64 executable over MSI and skips other architectures and signatures', () => {
  const installer = asset('Encore_0.3.0_x64-setup.exe');
  assert.equal(selectWindowsInstaller(release([
    asset('Encore_0.3.0_arm64-setup.exe'), asset('Encore_0.3.0_x86-setup.exe'),
    asset('Encore_0.3.0_x64_en-US.msi'), asset('Encore_0.3.0_x64-setup.exe.sig'), installer,
  ])), installer);
});

test('supports AMD64 installers and falls back to a Windows MSI', () => {
  const exe = asset('Encore-12.4.1-amd64-installer.exe');
  const msi = asset('Encore_12.4.1_x64.msi');
  assert.equal(selectWindowsInstaller(release([exe])), exe);
  assert.equal(selectWindowsInstaller(release([msi])), msi);
});

test('does not download portable binaries, unfinished uploads, drafts, or prereleases', () => {
  const installer = asset('Encore_0.3.0_x64-setup.exe');
  assert.equal(selectWindowsInstaller(release([asset('Encore-portable-x64.exe'), asset('encore-recorder.exe'), {...installer, state:'new'}])), null);
  assert.equal(selectWindowsInstaller({...release([installer]), draft:true}), null);
  assert.equal(selectWindowsInstaller({...release([installer]), prerelease:true}), null);
});

test('does not redirect to assets outside the Encore GitHub repository', () => {
  const installer = asset('Encore_0.3.0_x64-setup.exe');
  for (const browser_download_url of ['https://example.com/setup.exe', 'https://github.com/other/repo/releases/download/v1/setup.exe']) {
    assert.equal(selectWindowsInstaller(release([{...installer,browser_download_url}])), null);
  }
});

function response() {
  return { headers:{}, setHeader(key,value){this.headers[key]=value;}, end(){this.ended=true;} };
}

test('download endpoint resolves the latest release and redirects directly to its installer', async context => {
  const installer = asset('Encore_12.4.1_x64-setup.exe', 'v12.4.1');
  context.mock.method(globalThis,'fetch',async url => {
    assert.equal(url,'https://api.github.com/repos/yancelic/Encore/releases/latest');
    return {ok:true,json:async()=>release([installer])};
  });
  const result=response(); await download({method:'GET'},result);
  assert.equal(result.statusCode,307);
  assert.equal(result.headers.Location,installer.browser_download_url);
});

test('missing installers, rate limiting, and network failure open the latest release page', async context => {
  for (const fetchResult of [async()=>({ok:true,json:async()=>release([])}), async()=>({ok:false,status:403}), async()=>{throw new Error('Network unavailable');}]) {
    const mock=context.mock.method(globalThis,'fetch',fetchResult);
    const result=response(); await download({method:'GET'},result);
    assert.equal(result.statusCode,307);
    assert.equal(result.headers.Location,'https://github.com/yancelic/Encore/releases/latest');
    assert.equal(result.headers['Cache-Control'],'no-store');
    mock.mock.restore();
  }
});
