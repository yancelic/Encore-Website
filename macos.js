const guideDialog = document.querySelector('#guide-lightbox');
const guideDialogImage = document.querySelector('#lightbox-image');
const guideDialogCaption = document.querySelector('#lightbox-caption');
const guideReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const guideMobile = matchMedia('(max-width:760px)');
const guideToc = document.querySelector('.guide-toc');
let guideImageTrigger;
let guideCopyTimer;
const guideCopy = key => window.encorePageI18n.copy[window.encoreI18n.language][key];

function openGuideAnchor() {
  const id = location.hash.slice(1);
  const target = document.getElementById(id);
  if (target?.matches('.guide-faq details')) target.open = true;
  if (target) requestAnimationFrame(() => target.scrollIntoView({behavior:'instant',block:'start'}));
}

function syncGuideLanguage() {
  const lang = window.encoreI18n.language;
  document.querySelectorAll('[data-guide-image]').forEach(img => {
    img.src = `/assets/macos-install/${img.dataset.guideImage}-${lang}.png`;
  });
  document.querySelectorAll('[data-home-link]').forEach(link => { link.href = `/?lang=${lang}`; });
  document.querySelector('[data-apple-support]').href = `https://support.apple.com/${lang==='tr'?'tr-tr':'en-us'}/102445`;
  document.querySelector('.guide-step-nav').setAttribute('aria-label',lang==='tr'?'Kurulum adımları':'Installation steps');
  if (guideDialog.open && guideImageTrigger) {
    const img = guideImageTrigger.querySelector('img');
    guideDialogImage.src = img.src;
    guideDialogImage.alt = img.alt;
    guideDialogCaption.textContent = img.alt;
  }
  if (location.hash) openGuideAnchor();
}

function syncGuideToc() { guideToc.open = !guideMobile.matches; }
syncGuideToc();
guideMobile.addEventListener('change',syncGuideToc);
window.addEventListener('hashchange',openGuideAnchor);
document.addEventListener('encore:language',syncGuideLanguage);
syncGuideLanguage();
openGuideAnchor();

document.addEventListener('click',async event => {
  const figureButton = event.target.closest('[data-enlarge]');
  if (figureButton) {
    const img = figureButton.querySelector('img');
    guideImageTrigger = figureButton;
    guideDialogImage.src = img.src;
    guideDialogImage.alt = img.alt;
    guideDialogCaption.textContent = img.alt;
    guideDialog.showModal();
    if (!guideReducedMotion.matches && window.Motion?.animate) window.Motion.animate(guideDialog,{opacity:[0,1]},{duration:.16});
  }
  if (event.target.closest('[data-close-image]') || event.target === guideDialog) guideDialog.close();
  const anchor = event.target.closest('a[href^="#"]');
  if (anchor) {
    const target = document.getElementById(anchor.hash.slice(1));
    if (target?.matches('.guide-faq details')) target.open = true;
    if (guideMobile.matches && anchor.closest('.guide-step-nav')) guideToc.open = false;
  }
  const copyButton = event.target.closest('[data-copy-command]');
  if (copyButton) {
    const status = document.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText(document.querySelector('#checksum-command').textContent);
      copyButton.textContent = guideCopy('copied');
      status.textContent = guideCopy('copied');
      clearTimeout(guideCopyTimer);
      guideCopyTimer = setTimeout(() => { copyButton.textContent=guideCopy('copy'); status.textContent=''; },2500);
    } catch { status.textContent=guideCopy('copyFailed'); }
  }
});
guideDialog.addEventListener('close',() => { guideImageTrigger?.focus({preventScroll:true}); });

const guideSections = [...document.querySelectorAll('[data-guide-section]')];
const guideObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
  if (!visible) return;
  document.querySelectorAll('.guide-step-nav a').forEach(link => {
    if (link.hash===`#${visible.target.id}`) link.setAttribute('aria-current','step');
    else link.removeAttribute('aria-current');
  });
},{rootMargin:'-5% 0px -65% 0px',threshold:0});
guideSections.forEach(section=>guideObserver.observe(section));

const guideURL = new URL(location.href);
if (guideURL.searchParams.get('download') === '1') {
  guideURL.searchParams.delete('download');
  history.replaceState(null,'',guideURL);
  document.querySelector('#download-status').hidden = false;
}
