import test from 'node:test';
import assert from 'node:assert/strict';
import download, { selectWindowsInstaller, selectInstaller } from '../api/download.js';

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

test('macOS stable selects Apple Silicon DMGs without leaking beta or Intel packages', () => {
  for (const name of ['Encore_0.6.0_aarch64.dmg', 'Encore_12.4.1_arm64.dmg']) {
    const dmg = asset(name);
    assert.equal(selectInstaller(release([asset('Encore_0.6.0_x64.dmg'), asset(`${name}.sig`), dmg]), 'macos'), dmg);
    assert.equal(selectInstaller({...release([dmg]), prerelease:true}, 'macos'), null);
    assert.equal(selectInstaller({...release([dmg]), draft:true}, 'macos'), null);
  }
});

test('Linux downloads select their own x64 package from the beta tag only', () => {
  const deb = asset('Encore-Ubuntu-amd64.deb', 'beta');
  const flatpak = asset('Encore-Linux-x86_64.flatpak', 'beta');
  const beta = {...release([
    asset('Encore-Ubuntu-arm64.deb', 'beta'), asset('Encore-Linux-aarch64.flatpak', 'beta'),
    asset('Encore-macOS-Apple-Silicon.dmg', 'beta'), asset(`${deb.name}.sig`, 'beta'), deb, flatpak,
  ]), tag_name:'beta', prerelease:true};
  assert.equal(selectInstaller(beta, 'ubuntu'), deb);
  assert.equal(selectInstaller(beta, 'flatpak'), flatpak);
  assert.equal(selectInstaller(beta, 'windows'), null);
  assert.equal(selectInstaller(beta, 'macos'), null);
  for (const platform of ['ubuntu', 'flatpak']) {
    assert.equal(selectInstaller({...beta, draft:true}, platform), null);
    assert.equal(selectInstaller({...beta, tag_name:'v0.6.0'}, platform), null);
    assert.equal(selectInstaller({...beta, assets:beta.assets.map(item => ({...item,state:'new'}))}, platform), null);
  }
});

test('all platforms reject external assets and beta assets outside the beta tag', () => {
  for (const [platform, name] of [['macos','Encore_0.6.0_aarch64.dmg'],['ubuntu','Encore-Ubuntu-amd64.deb'],['flatpak','Encore-Linux-x86_64.flatpak']]) {
    for (const browser_download_url of ['https://example.com/file', 'https://github.com/other/repo/releases/download/beta/file']) {
      assert.equal(selectInstaller({...release([{...asset(name,'beta'),browser_download_url}]),tag_name:'beta'},platform),null);
    }
    if (platform !== 'macos') assert.equal(selectInstaller({...release([asset(name)]),tag_name:'beta'},platform),null);
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

test('each platform uses the correct release channel for GET and HEAD', async context => {
  for (const [platform, name, channel] of [
    ['windows','Encore_0.6.0_x64-setup.exe','latest'],
    ['macos','Encore_0.6.0_aarch64.dmg','latest'],
    ['ubuntu','Encore-Ubuntu-amd64.deb','tags/beta'],
    ['flatpak','Encore-Linux-x86_64.flatpak','tags/beta'],
  ]) {
    const beta = channel === 'tags/beta';
    const installer = asset(name, beta ? 'beta' : 'v0.6.0');
    const mock = context.mock.method(globalThis,'fetch',async url => {
      assert.equal(url,`https://api.github.com/repos/yancelic/Encore/releases/${channel}`);
      return {ok:true,json:async()=>({...release([installer]),tag_name:beta ? 'beta' : 'v0.6.0',prerelease:beta})};
    });
    for (const method of ['GET','HEAD']) {
      for (const request of [{method,query:{platform}},{method,url:`/api/download?platform=${platform}`}]) {
        const result = response(); await download(request,result);
        assert.equal(result.statusCode,307);
        assert.equal(result.headers.Location,installer.browser_download_url);
        assert.match(result.headers['Cache-Control'],/s-maxage=60/);
        assert.equal(result.ended,true);
      }
    }
    mock.mock.restore();
  }
});

test('platform failures stay on their release channel without caching', async context => {
  for (const platform of ['macos','ubuntu','flatpak']) {
    for (const fetchResult of [async()=>({ok:true,json:async()=>release([])}),async()=>({ok:false,status:403}),async()=>{throw new Error('Network unavailable');}]) {
      const mock=context.mock.method(globalThis,'fetch',fetchResult);
      const result=response(); await download({method:'GET',query:{platform}},result);
      assert.equal(result.statusCode,307);
      assert.equal(result.headers.Location,`https://github.com/yancelic/Encore/releases/${platform === 'macos' ? 'latest' : 'tag/beta'}`);
      assert.equal(result.headers['Cache-Control'],'no-store');
      mock.mock.restore();
    }
  }
});

test('unknown and ambiguous platforms and unsupported methods never fetch a release', async context => {
  const mock=context.mock.method(globalThis,'fetch',async()=>{throw new Error('Must not fetch');});
  for (const request of [
    {method:'GET',query:{platform:'android'}}, {method:'GET',query:{platform:['macos','windows']}},
    {method:'GET',url:'/api/download?platform=macos&platform=windows'},
    {method:'GET',query:{platform:'__proto__'}}, {method:'GET',query:{platform:''}},
  ]) {
    const result=response(); await download(request,result);
    assert.equal(result.statusCode,400);
    assert.equal(result.headers.Location,undefined);
  }
  const result=response(); await download({method:'POST'},result);
  assert.equal(result.statusCode,405);
  assert.equal(result.headers.Allow,'GET, HEAD');
  assert.equal(mock.mock.callCount(),0);
});
