const $ = (selector) => document.querySelector(selector);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionAnimate = (element, keyframes, options = {}) => {
  if (window.Motion?.animate) return window.Motion.animate(element, keyframes, { ...options, duration: reduceMotion.matches ? 0 : options.duration ?? .25 });
  for (const [property, values] of Object.entries(keyframes)) element.style[property] = Array.isArray(values) ? values.at(-1) : values;
};
let position = 18.4;
let playing = false;
let lastTime = 0;
let frame = 0;
let saveTimer;
const scrubber = $('#scrubber');
const playButton = $('#scene-play');
const scene = $('.race-scene');
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
  scrubber.value = position;
  $('#playhead').style.left = `${position / 30 * 100}%`;
  const seconds = String(Math.floor(position)).padStart(2, '0');
  $('#current-time').textContent = `00:${seconds}`;
  $('#scene-time').textContent = `00:${seconds}.${String(Math.round(position % 1 * 100)).padStart(2, '0')}`;
  scene.style.transform = reduceMotion.matches ? 'scale(1.06)' : `scale(${1.06 + position / 30 * .035}) translateX(${(position - 15) * .13}%)`;
}
function setPlaying(value) {
  playing = value;
  playButton.setAttribute('aria-label', `${value ? 'Pause' : 'Play'} illustrated replay`);
  playButton.innerHTML = value ? '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM15 5h4v14h-4z"/></svg>' : '<svg viewBox="0 0 24 24"><path d="m9 5 11 7-11 7z"/></svg>';
  cancelAnimationFrame(frame);
  if (value) { if (position >= 30) position = 0; lastTime = performance.now(); frame = requestAnimationFrame(tick); }
}
function tick(now) {
  if (!playing) return;
  position = Math.min(30, position + (now - lastTime) / 1000);
  lastTime = now;
  renderPosition();
  if (position >= 30) return setPlaying(false);
  frame = requestAnimationFrame(tick);
}
playButton.addEventListener('click', () => setPlaying(!playing));
scrubber.addEventListener('input', () => { position = Number(scrubber.value); renderPosition(); });
document.querySelectorAll('.track-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const muted = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(muted));
    button.setAttribute('aria-label', `${muted ? 'Unmute' : 'Mute'} ${button.dataset.track === 'mic' ? 'microphone' : button.dataset.track} track`);
    $(`#wave-${button.dataset.track}`).classList.toggle('muted', muted);
  });
  button.setAttribute('aria-label', `Mute ${button.dataset.track === 'mic' ? 'microphone' : button.dataset.track} track`);
});
function saveMoment() {
  setPlaying(false);
  clearTimeout(saveTimer);
  const feedback = $('#save-feedback');
  feedback.style.visibility = 'visible';
  motionAnimate(feedback, { opacity: [0, 1], scale: [.96, 1] }, { type: 'spring', bounce: .1, duration: .32 });
  $('#save').firstChild.nextSibling.textContent = 'Replay saved';
  saveTimer = setTimeout(() => {
    motionAnimate(feedback, { opacity: 0 }, { duration: .2 });
    $('#save').firstChild.nextSibling.textContent = 'Save the moment ';
  }, 2600);
}
$('#save').addEventListener('click', saveMoment);
document.addEventListener('keydown', event => {
  if (event.altKey && event.code === 'KeyS') { event.preventDefault(); saveMoment(); }
});
$('#reset-demo').addEventListener('click', () => {
  setPlaying(false); position = 18.4; renderPosition();
  clearTimeout(saveTimer); $('#save-feedback').style.opacity = 0;
  $('#save').firstChild.nextSibling.textContent = 'Save the moment ';
  document.querySelectorAll('.track-toggle[aria-pressed=true]').forEach(button => button.click());
});
function updateBuffer() {
  const value = Number($('#buffer').value);
  $('#buffer-value').textContent = value;
  $('#buffer-output').value = `${value} seconds`;
  const bars = document.querySelectorAll('.buffer-history i');
  bars.forEach((bar, index) => bar.classList.toggle('kept', index >= bars.length * (1 - value / 120)));
}
$('#buffer').addEventListener('input', updateBuffer);
function updateCrop(vertical, animate = true) {
  const stage = $('.format-stage');
  const inset = vertical ? Math.max(0, (1 - (stage.clientHeight * 9 / 16) / stage.clientWidth) * 50) : 0;
  motionAnimate($('#crop-frame'), { clipPath: `inset(0 ${inset}%)` }, { type: 'spring', bounce: 0, duration: animate ? .4 : 0 });
  $('#format-label').textContent = vertical ? '1080 × 1920' : '1920 × 1080';
  $('#crop-description').textContent = vertical ? 'Put the moment front and center in a vertical export.' : 'Keep the whole scene in a landscape export.';
}
document.querySelectorAll('[data-format]').forEach(button => button.addEventListener('click', () => {
  const vertical = button.dataset.format === 'vertical';
  document.querySelectorAll('[data-format]').forEach(tab => { const selected = tab === button; tab.classList.toggle('active', selected); tab.setAttribute('aria-pressed', String(selected)); });
  updateCrop(vertical);
}));
new ResizeObserver(() => updateCrop($('[data-format="vertical"]').getAttribute('aria-pressed') === 'true', false)).observe($('.format-stage'));
document.addEventListener('visibilitychange', () => { if (document.hidden) setPlaying(false); });
updateBuffer(); renderPosition();
