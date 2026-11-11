const $ = selector => document.querySelector(selector);
const t = text => window.encoreI18n.t(text);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionAnimate = (element, keyframes, options = {}) => {
  if (window.Motion?.animate) return window.Motion.animate(element, keyframes, { ...options, duration: reduceMotion.matches ? 0 : options.duration ?? .25 });
  for (const [property, values] of Object.entries(keyframes)) element.style[property] = Array.isArray(values) ? values.at(-1) : values;
};
const video = $('#replay-video'), cropVideo = $('#crop-video');
const scrubber = $('#scrubber'), playButton = $('#scene-play'), deskPlayButton = $('#desk-play');
let saved = false, saveTimer, userPaused = false, viewerVisible = true, deskVisible = false, cropVisible = false;
let scrubbing = false, scrubTarget = 0, scrubPointer = null, resumeAfterScrub = false, explicitPlayback = false;
let videoFrame = null, fallbackFrame = null;
const initialPosition = 18.4;
for (const [index, track] of [...document.querySelectorAll('.waveform')].entries()) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 180; i++) {
    const bar = document.createElement('i');
    const value = (Math.sin(i * 1.73 + index * 7) * Math.cos(i * .31 + index) + 1) / 2;
    const gate = index === 1 && i % 44 > 22 || index === 2 && i % 51 > 30;
    bar.style.setProperty('--h', `${gate ? 2 : 3 + value * 17}px`);
    fragment.append(bar);
  }
  track.append(fragment);
}
for (let i = 0; i < 56; i++) {
  const bar = document.createElement('i');
  bar.style.setProperty('--h', `${14 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * .29)) * 40}px`);
  $('.buffer-history').append(bar);
}
function renderPosition() {
  const position = scrubbing ? scrubTarget : video.currentTime || 0;
  scrubber.value = position;
  scrubber.setAttribute('aria-valuetext', `${position.toFixed(1)} ${window.encoreI18n.language === 'tr' ? 'saniye' : 'seconds'}`);
  $('#playhead').style.left = `${position / replayDuration() * 100}%`;
  const centiseconds = Math.floor(position * 100), seconds = String(Math.floor(centiseconds / 100)).padStart(2, '0');
  $('#current-time').textContent = `00:${seconds}`;
  $('#scene-time').textContent = `00:${seconds}.${String(centiseconds % 100).padStart(2, '0')}`;
}
function renderPlayButton() {
  const playing = !video.paused;
  for (const button of [playButton, deskPlayButton]) {
    const label = t(button === deskPlayButton ? playing ? 'Pause replay' : 'Play replay' : playing ? 'Pause illustrated replay' : 'Play illustrated replay');
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(playing));
    button.title = label;
    button.innerHTML = playing ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM15 5h4v14h-4z"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7z"/></svg>';
  }
}
function stopFrameUpdates() {
  if (videoFrame !== null && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(videoFrame);
  if (fallbackFrame !== null) cancelAnimationFrame(fallbackFrame);
  videoFrame = fallbackFrame = null;
}
function frameUpdate() {
  renderPosition();
  if (video.paused) return;
  if (video.requestVideoFrameCallback) videoFrame = video.requestVideoFrameCallback(frameUpdate);
  else fallbackFrame = requestAnimationFrame(frameUpdate);
}
function playReplay() { if (video.readyState > 0) video.play().catch(renderPlayButton); }
function replayDuration() { return Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 30; }
function initializeReplay() {
  scrubber.max = replayDuration();
  video.currentTime = initialPosition; renderPosition();
  if (viewerVisible && !reduceMotion.matches && !userPaused && !document.hidden) playReplay();
}
video.addEventListener('loadedmetadata', initializeReplay, { once: true });
if (video.readyState > 0) initializeReplay();
video.addEventListener('play', () => { stopFrameUpdates(); renderPlayButton(); frameUpdate(); });
video.addEventListener('pause', () => { stopFrameUpdates(); renderPlayButton(); renderPosition(); });
video.addEventListener('seeked', renderPosition);
video.addEventListener('timeupdate', renderPosition);
function togglePlayback() {
  userPaused = !video.paused;
  if (userPaused) video.pause();
  else { explicitPlayback = true; playReplay(); }
}
playButton.addEventListener('click', togglePlayback);
deskPlayButton.addEventListener('click', togglePlayback);
scrubber.addEventListener('input', () => { if (video.readyState > 0) video.currentTime = Number(scrubber.value); renderPosition(); });
function seekWithPointer(event) {
  const bounds = scrubber.getBoundingClientRect();
  scrubTarget = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)) * replayDuration();
  if (video.readyState > 0) video.currentTime = scrubTarget;
  renderPosition();
}
scrubber.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  event.preventDefault();
  resumeAfterScrub = !video.paused;
  scrubbing = true; scrubPointer = event.pointerId;
  video.pause();
  scrubber.focus({preventScroll:true});
  scrubber.setPointerCapture(event.pointerId);
  seekWithPointer(event);
});
scrubber.addEventListener('pointermove', event => {
  if (scrubbing && event.pointerId === scrubPointer) seekWithPointer(event);
});
function finishScrub(event) {
  if (!scrubbing || event.pointerId !== scrubPointer) return;
  if (event.type === 'pointerup') seekWithPointer(event);
  scrubbing = false; scrubPointer = null;
  renderPosition();
  if (resumeAfterScrub && !document.hidden && (viewerVisible || deskVisible)) playReplay();
}
scrubber.addEventListener('pointerup', finishScrub);
scrubber.addEventListener('pointercancel', finishScrub);
scrubber.addEventListener('lostpointercapture', finishScrub);
function updateTrackLabel(button) {
  const action = button.getAttribute('aria-pressed') === 'true' ? 'Unmute' : 'Mute';
  const track = button.dataset.track === 'mic' ? 'microphone' : button.dataset.track;
  button.setAttribute('aria-label', t(`${action} ${track} track`));
}
document.querySelectorAll('.track-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const muted = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(muted)); updateTrackLabel(button);
    $(`#wave-${button.dataset.track}`).classList.toggle('muted', muted);
  }); updateTrackLabel(button);
});
function updateSaveLabel() { $('#save').firstChild.nextSibling.textContent = t(saved ? 'Replay saved' : 'Save the moment') + ' '; }
function saveMoment() {
  video.pause(); userPaused = true; clearTimeout(saveTimer); saved = true;
  const feedback = $('#save-feedback'); feedback.style.visibility = 'visible';
  motionAnimate(feedback, { opacity: [0, 1], scale: [.96, 1] }, { type: 'spring', bounce: .1, duration: .32 });
  updateSaveLabel();
  saveTimer = setTimeout(() => { motionAnimate(feedback, { opacity: 0 }, { duration: .2 }); saved = false; updateSaveLabel(); }, 2600);
}
$('#save').addEventListener('click', saveMoment);
document.addEventListener('keydown', event => { if (event.altKey && event.code === 'KeyS') { event.preventDefault(); saveMoment(); } });
$('#reset-demo').addEventListener('click', () => {
  userPaused = true; explicitPlayback = false; video.pause(); if (video.readyState > 0) video.currentTime = 0;
  clearTimeout(saveTimer); $('#save-feedback').style.opacity = 0; saved = false; updateSaveLabel();
  document.querySelectorAll('.track-toggle[aria-pressed=true]').forEach(button => button.click());
});
function updateBuffer() {
  const value = Number($('#buffer').value); $('#buffer-value').textContent = value;
  $('#buffer-output').value = `${value} ${window.encoreI18n.language === 'tr' ? 'saniye' : 'seconds'}`;
  $('#buffer').setAttribute('aria-valuetext', $('#buffer-output').value);
  const bars = document.querySelectorAll('.buffer-history i');
  bars.forEach((bar, index) => bar.classList.toggle('kept', index >= bars.length * (1 - value / 120)));
}
$('#buffer').addEventListener('input', updateBuffer);
function updateCrop(vertical, animate = true) {
  const stage = $('.format-stage');
  const inset = vertical ? Math.max(0, (1 - (stage.clientHeight * 9 / 16) / stage.clientWidth) * 50) : 0;
  motionAnimate($('#crop-frame'), { clipPath: `inset(0 ${inset}%)` }, { type: 'spring', bounce: 0, duration: animate ? .4 : 0 });
  $('#format-label').textContent = vertical ? '1080 × 1920' : '1920 × 1080';
  $('#crop-description').textContent = t(vertical ? 'Put the moment front and center in a vertical export.' : 'Keep the whole scene in a landscape export.');
}
document.querySelectorAll('[data-format]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-format]').forEach(tab => { const selected = tab === button; tab.classList.toggle('active', selected); tab.setAttribute('aria-pressed', String(selected)); });
  updateCrop(button.dataset.format === 'vertical');
}));
new ResizeObserver(() => updateCrop($('[data-format="vertical"]').getAttribute('aria-pressed') === 'true', false)).observe($('.format-stage'));
const replayVisibility = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.target === $('#viewer')) viewerVisible = entry.isIntersecting;
    else deskVisible = entry.isIntersecting;
  }
  updatePlaybackVisibility();
}, {threshold:.01});
replayVisibility.observe($('#viewer'));
replayVisibility.observe($('#replay-desk'));
new IntersectionObserver(entries => {
  cropVisible = entries[0].isIntersecting;
  if (cropVisible && !document.hidden && !reduceMotion.matches) cropVideo.play().catch(() => {});
  else cropVideo.pause();
}, {threshold:.1}).observe($('.format-stage'));
function updatePlaybackVisibility() {
  if (document.hidden) { video.pause(); cropVideo.pause(); return; }
  if (!scrubbing) {
    if ((viewerVisible || deskVisible) && !userPaused && (!reduceMotion.matches || explicitPlayback)) playReplay();
    else video.pause();
  }
  if (cropVisible && !reduceMotion.matches) cropVideo.play().catch(() => {});
  else cropVideo.pause();
}
document.addEventListener('visibilitychange', updatePlaybackVisibility);
reduceMotion.addEventListener('change', () => { explicitPlayback = false; updatePlaybackVisibility(); });
document.addEventListener('encore:language', () => {
  renderPlayButton(); renderPosition(); updateBuffer(); updateSaveLabel();
  document.querySelectorAll('.track-toggle').forEach(updateTrackLabel);
  updateCrop($('[data-format="vertical"]').getAttribute('aria-pressed') === 'true', false);
});
updateBuffer(); renderPlayButton(); updateSaveLabel();
