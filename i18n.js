(() => {
  const translations = new Map([
    ['Skip to content', 'İçeriğe geç'],
    ['Encore home', 'Encore ana sayfa'],
    ['Main navigation', 'Ana menü'],
    ['The workflow', 'Nasıl çalışır'],
    ['Source code', 'Kaynak kodu'],
    ['Back to Encore', 'Encore’a dön'],
    ['macOS setup', 'macOS kurulumu'],
    ['Get Encore', 'Encore’u indir'],
    ['A replay studio for Windows & macOS', 'Windows ve macOS için klip stüdyosu'],
    ['That was', 'Bu anı'], ['a keeper.', 'sakla.'],
    ['The clutch. The chaos. The “did you see that?”', 'O kritik hamle. O kaos. O “gördün mü?” anı.'],
    ['Keep your last moments of gameplay, then make', 'Oyunun son anlarını kaydet, sonra'],
    ['the cut worth watching.', 'tekrar izlemeye değer bir klibe dönüştür.'],
    ['Download Encore', 'Encore’u indir'],
    ['Free & open source. Yours to keep.', 'Ücretsiz, açık kaynak. Kontrol sende.'],
    ['Replay buffer ready', 'Anlık kayıt hazır'],
    ['Illustrated demo', 'Animasyonlu demo'],
    ['Animated racing replay', 'Animasyonlu yarış klibi'],
    ['Moment saved.', 'An kaydedildi.'],
    ['Now make it yours.', 'Şimdi sıra sende.'],
    ['Play illustrated replay', 'Animasyonlu klibi oynat'],
    ['Pause illustrated replay', 'Animasyonlu klibi duraklat'],
    ['Play replay', 'Klibi oynat'], ['Pause replay', 'Klibi duraklat'],
    ['Some things are worth a second look.', 'Bazı anlar tekrar izlemeye değer.'],
    ['Save the moment', 'Anı kaydet'], ['Replay saved', 'Klip kaydedildi'],
    ['Your replay, your cut.', 'Senin klibin, senin kurgun.'],
    ['Try the timeline. Mute a track.', 'Zaman çizelgesini dene. Bir kanalı sustur.'],
    ['Video', 'Video'], ['Game', 'Oyun'], ['Chat', 'Sohbet'], ['Mic', 'Mikrofon'],
    ['Replay position in seconds', 'Klibin saniye cinsinden konumu'],
    ['Mute game track', 'Oyun sesini kapat'], ['Unmute game track', 'Oyun sesini aç'],
    ['Mute chat track', 'Sohbet sesini kapat'], ['Unmute chat track', 'Sohbet sesini aç'],
    ['Mute microphone track', 'Mikrofon sesini kapat'], ['Unmute microphone track', 'Mikrofon sesini aç'],
    ['Three separate audio tracks. One better replay.', 'Üç ayrı ses kanalı. Daha iyi bir klip.'],
    ['Reset demo', 'Demoyu sıfırla'],
    ['Stay in the game.', 'Oyunda kal.'],
    ['The good part already happened.', 'En güzel an çoktan yaşandı.'],
    ['Encore keeps it within reach.', 'Encore ile elinin altında.'],
    ['Recording in the background', 'Arka planda kaydediyor'],
    ['The last', 'Son'], ['seconds.', 'saniye.'],
    ['Choose your replay buffer', 'Anlık kayıt süresini seç'],
    ['15 seconds', '15 saniye'], ['30 seconds', '30 saniye'], ['120 seconds', '120 saniye'],
    ['Keep what just happened. Skip recording the whole session.', 'Az önce olanı sakla. Tüm oturumu kaydetmene gerek yok.'],
    ['Play first. Save after.', 'Önce oyna. Sonra kaydet.'],
    ['Encore keeps a rolling replay buffer in the background. Hit your save hotkey when something happens. The lead-up comes with it.', 'Encore, oyunun son anlarını arka planda sürekli tutar. Bir şey olduğunda kayıt kısayoluna bas. O ana giden anlar da klibe dahil olur.'],
    ['A recorder that stays out of the way.', 'Sen oynarken işini yapar.'],
    ['The Rust recorder runs on its own. The desktop interface opens when you want to browse or edit, with hardware H.264 encoding handling capture.', 'Rust ile yazılan kayıt servisi bağımsız çalışır. Masaüstü arayüzü, kliplerine bakmak veya düzenlemek istediğinde açılır. Kayıtta donanım hızlandırmalı H.264 kodlama kullanılır.'],
    ['Your game. Your setup.', 'Senin oyunun. Senin ayarların.'],
    ['Use automatic game detection or capture your active window. Choose your resolution, frame rate, replay length, and save hotkey.', 'Otomatik oyun algılamayı kullan veya etkin pencereni kaydet. Çözünürlüğünü, kare hızını, kayıt süreni ve kayıt kısayolunu kendin seç.'],
    ['Make the second watch better.', 'Tekrarını daha iyi hale getir.'],
    ['Keep the play.', 'Hamleyi sakla.'], ['Cut the rest.', 'Gerisini kes.'],
    ['Trim the waiting. Keep the team reaction. Turn down your mic. Separate game, chat, and microphone tracks give every part of the moment its own place.', 'Bekleme kısmını kes. Takımın tepkisini bırak. Mikrofonunu biraz kıs. Ayrı oyun, sohbet ve mikrofon kanallarıyla her sesi istediğin gibi düzenle.'],
    ['Then export a vertical clip or build a montage from your favorites.', 'Ardından dikey bir video dışa aktar veya favori kliplerinden bir montaj oluştur.'],
    ['Try the track controls', 'Ses kanallarını dene'],
    ['Preview export format', 'Dışa aktarma biçimini önizle'],
    ['The full picture', 'Tam görüntü'], ['Ready for the feed', 'Paylaşmaya hazır'],
    ['Keep the whole scene in a landscape export.', 'Yatay videoda sahnenin tamamını koru.'],
    ['Put the moment front and center in a vertical export.', 'Dikey videoda asıl anı ön plana çıkar.'],
    ['Illustrative format preview', 'Örnek dışa aktarma görünümü'],
    ['Next time,', 'Bir dahakine,'], ['keep it.', 'sakla.'],
    ['Your next great play deserves an Encore.', 'Sıradaki harika hamlen bir Encore’u hak ediyor.'],
    ['Game capture, a clip library, and multi-track editing.', 'Oyun kaydı, klip kütüphanesi ve çok kanallı düzenleme.'],
    ['Choose your platform. Keep your next great play.', 'Platformunu seç. Sıradaki harika hamleni sakla.'],
    ['Stable downloads', 'Stabil sürümler'],
    ['Stable', 'Stabil'], ['Beta', 'Beta'],
    ['Download Encore for Windows', 'Windows için Encore’u indir'],
    ['Download Encore for macOS', 'macOS için Encore’u indir'],
    ['Download Encore for Ubuntu (beta)', 'Ubuntu için Encore’u indir (beta)'],
    ['Download Encore for Linux Flatpak (beta)', 'Linux Flatpak için Encore’u indir (beta)'],
    ['First time on macOS?', 'macOS’ta ilk kurulum mu?'],
    ['Thanks for your contributions to Encore on macOS,', 'Encore’un macOS sürümüne katkıların için teşekkürler,'],
    ['Read the installation notes', 'Kurulum notlarını oku'],
    ['. Manual updates; Apple notarization is not yet available.', '. Güncellemeler elle kurulur; henüz Apple noter onayı yoktur.'],
    ['For the Linux early birds.', 'Linux’u erkenden denemek isteyenlere.'],
    ['Beta previews. Automated checks passed; not yet tested on real user devices.', 'Beta önizlemeleri. Otomatik kontrollerden geçti; henüz gerçek kullanıcı cihazlarında test edilmedi.'],
    ['Linux installation & testing guide', 'Linux kurulum ve test rehberi'],
    ['Installation notes', 'Kurulum notları'],
    ['Installing Encore on macOS', 'macOS’ta Encore kurulumu'],
    ['Open the DMG and drag Encore into Applications. Quit Encore and its background recorder before replacing an older installation. Updates are installed manually.', 'DMG dosyasını aç ve Encore’u Applications klasörüne sürükle. Eski kurulumu değiştirmeden önce Encore’u ve arka plandaki kayıt servisini kapat. Güncellemeler elle kurulur.'],
    ['The app is ad-hoc signed and is not Apple Developer ID signed or notarized. After the first launch attempt, you may need System Settings → Privacy & Security → Open Anyway.', 'Uygulama ad-hoc imzalıdır; Apple Developer ID imzası veya Apple noter onayı yoktur. İlk açma denemesinden sonra Sistem Ayarları → Gizlilik ve Güvenlik → Yine de Aç seçeneğini kullanman gerekebilir.'],
    ['In Encore, open Settings → Permissions. Switch on Encore for screen recording and microphone, and Encore Recorder for Input Monitoring. Follow the illustrated guide for each step.', 'Encore’da Settings → Permissions bölümünü aç. Ekran kaydı ve mikrofon için Encore’u, Girdi İzleme için Encore Recorder’ı etkinleştir. Her adım için görselli rehberi izle.'],
    ['What should I expect from the Linux beta?', 'Linux betadan ne beklemeliyim?'],
    ['Ubuntu and Flatpak are development previews with manual updates. Desktop integration, Wayland permissions, GPU drivers, audio routing, and playback may still need fixes. The Flatpak download is a standalone bundle, not a Flathub listing.', 'Ubuntu ve Flatpak, güncellemeleri elle kurulan geliştirme önizlemeleridir. Masaüstü entegrasyonu, Wayland izinleri, GPU sürücüleri, ses yönlendirme ve oynatmada sorunlar olabilir. Flatpak indirmesi bağımsız bir pakettir; Flathub’da yayımlanmış değildir.'],
    ['Follow the Linux beta test guide', 'Linux beta test rehberi'],
    ['for installation steps, checks, and log locations.', 'ile kurulum adımlarını, kontrolleri ve günlük dosyalarının konumlarını öğrenebilirsin.'],
    ['Free and open source under GPL-3.0.', 'GPL-3.0 lisansıyla ücretsiz ve açık kaynak.'],
    ['Questions about Encore', 'Encore hakkında sorular'],
    ['A few things to know.', 'Bilmen gereken birkaç şey.'],
    ['How does saving a replay work?', 'Anlık kayıt nasıl çalışır?'],
    ['Encore records into a rolling buffer. Use the save hotkey, Alt+S by default, to keep the recent gameplay. Choose a buffer from 15 to 120 seconds in the desktop app.', 'Encore, son oyun anlarını sürekli yenilenen bir arabellekte tutar. Bu anları saklamak için varsayılan Alt+S kayıt kısayoluna bas. Masaüstü uygulamasında 15 ile 120 saniye arasında bir süre seçebilirsin.'],
    ['Can I edit game, chat, and microphone audio separately?', 'Oyun, sohbet ve mikrofon seslerini ayrı düzenleyebilir miyim?'],
    ['Yes. Encore captures three separate audio tracks, with per-track waveforms, volume controls, and mute toggles in the clip editor.', 'Evet. Encore üç ayrı ses kanalı kaydeder. Klip düzenleyicide her kanalın ses dalgasını görebilir, ses seviyesini ayarlayabilir veya sesi kapatabilirsin.'],
    ['What can I export?', 'Neleri dışa aktarabilirim?'],
    ['Trim a clip, export a 9:16 vertical video, or combine several clips into a montage. You can also copy clip files straight to the Windows clipboard.', 'Bir klibi kırpabilir, 9:16 dikey video dışa aktarabilir veya birkaç klibi bir montajda birleştirebilirsin. Klip dosyalarını doğrudan Windows panosuna da kopyalayabilirsin.'],
    ['Is Encore open source?', 'Encore açık kaynak mı?'],
    ['Yes. Encore is licensed under GPL-3.0. You can inspect the code, report issues, and find setup instructions on', 'Evet. Encore, GPL-3.0 lisansıyla sunulur. Kodu incelemek, sorun bildirmek ve kurulum yönergelerine ulaşmak için:'],
    ['Good games are worth keeping.', 'İyi oyunlar saklamaya değer.'], ['Releases ↗', 'Sürümler ↗'],
  ]);
  const records = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode, original = node.data.trim();
    if (!node.parentElement?.closest('[data-guide-copy]') && translations.has(original)) records.push({node,original,prefix:node.data.match(/^\s*/)[0],suffix:node.data.match(/\s*$/)[0]});
  }
  const attributes = [];
  document.querySelectorAll('[aria-label],[alt]').forEach(element => {
    for (const name of ['aria-label','alt']) {
      const original = element.getAttribute(name);
      if (translations.has(original)) attributes.push({element,name,original});
    }
  });
  let stored;
  try { stored = localStorage.getItem('encore-language'); } catch {}
  const requested = new URL(location.href).searchParams.get('lang');
  let language = ['en','tr'].includes(requested) ? requested : ['en','tr'].includes(stored) ? stored : navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en';
  const t = text => language === 'tr' ? translations.get(text) ?? text : text;
  function apply(value, persist = false) {
    language = value;
    document.documentElement.lang = language;
    for (const item of records) item.node.data = item.prefix + t(item.original) + item.suffix;
    for (const item of attributes) item.element.setAttribute(item.name,t(item.original));
    const page = window.encorePageI18n;
    document.querySelectorAll('[data-guide-copy]').forEach(element => { element.innerHTML = page.copy[language][element.dataset.guideCopy]; });
    document.querySelectorAll('[data-guide-alt]').forEach(element => { element.alt = page.copy[language][element.dataset.guideAlt]; });
    document.querySelectorAll('[data-guide-label]').forEach(element => { element.setAttribute('aria-label',page.copy[language][element.dataset.guideLabel]); });
    document.querySelectorAll('[data-macos-guide]').forEach(link => {
      const url = new URL('/macOS',location.origin);
      url.searchParams.set('lang',language);
      link.href=url.pathname+url.search;
    });
    document.title = page?.title[language] ?? (language === 'tr' ? 'Encore — Bu anı sakla.' : 'Encore — That was a keeper.');
    document.querySelector('meta[name=description]').content = page?.description[language] ?? (language === 'tr' ? 'Oyunun son anlarını kaydet, gerisini kes. Encore, açık kaynaklı oyun kayıt ve çok kanallı klip düzenleme stüdyosudur. Windows ve macOS stabil, Ubuntu ve Flatpak beta.' : 'Keep the play. Cut the downtime. Encore is an open-source game recorder and multi-track replay studio. Stable for Windows and macOS. Ubuntu and Flatpak in beta.');
    document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));
    if (persist) {
      try { localStorage.setItem('encore-language',language); } catch {}
      const url = new URL(location.href); url.searchParams.set('lang',language); history.replaceState(null,'',url);
    }
    document.dispatchEvent(new CustomEvent('encore:language'));
  }
  window.encoreI18n = {t, get language(){return language;}};
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>apply(button.dataset.language,true)));
  apply(language);
})();
