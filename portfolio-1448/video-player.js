/* مقاطع الفيديو في ملف الإنجاز 1448هـ — أدوات مشتركة للعرض والتشغيل
   تُستخدم في: index.html (صفحة المعلم) و principal.html (صفحة المدير) و videos.html (الإدارة) */
(function () {
  'use strict';
  var INDEX = 'videos/index.json';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hijri(iso) {
    if (!iso) return '';
    var d = new Date(String(iso).length === 10 ? iso + 'T12:00:00' : iso); if (isNaN(d)) return '';
    try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-arab', { day: 'numeric', month: 'long', year: 'numeric' }).format(d); } catch (e) { return d.toLocaleDateString('ar-SA'); }
  }

  /* تحليل الرابط: يوتيوب، Google Drive، ملف فيديو مباشر، أو رابط آخر */
  function parse(url) {
    url = String(url || '').trim(); var m;
    if (!/^https?:\/\//i.test(url)) return null;
    m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
    if (m) return { type: 'youtube', vid: m[1], url: url, embed: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?rel=0&playsinline=1', thumb: 'https://i.ytimg.com/vi/' + m[1] + '/hqdefault.jpg' };
    m = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([A-Za-z0-9_-]{20,})/i);
    if (m) return { type: 'drive', vid: m[1], url: url, embed: 'https://drive.google.com/file/d/' + m[1] + '/preview', thumb: '' };
    if (/\.(mp4|webm|m4v|mov|ogv)(\?|#|$)/i.test(url)) return { type: 'direct', url: url, embed: '', thumb: '' };
    return { type: 'link', url: url, embed: '', thumb: '' };
  }

  var TYPE_LABEL = { file: 'ملف فيديو', youtube: 'يوتيوب', drive: 'Google Drive', direct: 'رابط فيديو', link: 'رابط خارجي' };

  function load() {
    return fetch(INDEX + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { return Array.isArray(j.items) ? j.items : []; })
      .catch(function () { return []; });
  }
  function sortByDate(list) { return list.slice().sort(function (a, b) { return String(b.date || b.added).localeCompare(String(a.date || a.added)); }); }

  /* ===== الأنماط ===== */
  var css = '' +
    '.pfv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px;margin:12px 0}' +
    '.pfv-card{position:relative;display:flex;flex-direction:column;text-align:right;border:1px solid rgba(141,206,255,.35);border-radius:16px;overflow:hidden;background:#0f2d57;color:#fff;cursor:pointer;padding:0;font:inherit}' +
    '.pfv-card:focus-visible{outline:3px solid #ffd36b;outline-offset:2px}' +
    '.pfv-th{position:relative;aspect-ratio:16/9;background:linear-gradient(135deg,#123b73,#0a2148);display:grid;place-items:center;overflow:hidden}' +
    '.pfv-th img{width:100%;height:100%;object-fit:cover;display:block}' +
    '.pfv-th .pfv-ph{font-size:44px;opacity:.8}' +
    '.pfv-play{position:absolute;inset:0;margin:auto;width:58px;height:58px;border-radius:50%;background:rgba(7,26,64,.78);border:2px solid #ffd36b;display:grid;place-items:center}' +
    '.pfv-play:before{content:"";margin-right:-5px;border-style:solid;border-width:11px 0 11px 18px;border-color:transparent transparent transparent #ffd36b}' +
    '.pfv-tag{position:absolute;top:8px;right:8px;background:rgba(7,26,64,.85);color:#ffe2a0;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px}' +
    '.pfv-tx{padding:10px 12px 12px;display:flex;flex-direction:column;gap:3px}' +
    '.pfv-tx b{font-size:15px;line-height:1.5}' +
    '.pfv-tx small{color:#bed9f4;font-size:12.5px;line-height:1.6}' +
    '.pfv-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:18px}' +
    '.pfv-head h3{margin:0;color:#ffe5a3;font-size:19px}' +
    '.pfv-shade{position:fixed;inset:0;z-index:100000;background:rgba(4,12,30,.96);display:flex;flex-direction:column;padding:12px;gap:10px}' +
    '.pfv-bar{display:flex;align-items:center;gap:10px;color:#fff;font:700 16px Tajawal,Tahoma,sans-serif}' +
    '.pfv-bar span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.pfv-bar button,.pfv-bar a{border:0;border-radius:12px;background:#d4a73c;color:#071a40;font:800 15px Tajawal,Tahoma,sans-serif;padding:9px 16px;cursor:pointer;text-decoration:none}' +
    '.pfv-stage{flex:1;min-height:0;display:grid;place-items:center}' +
    '.pfv-stage iframe,.pfv-stage video{width:min(100%,calc((100vh - 90px)*16/9));aspect-ratio:16/9;max-height:100%;border:0;border-radius:14px;background:#000}' +
    '.pfv-stage video{object-fit:contain}' +
    '.pfv-msg{color:#fff;text-align:center;font:600 16px/1.9 Tajawal,Tahoma,sans-serif;max-width:520px}' +
    '.pfv-msg a{display:inline-block;margin-top:12px;border-radius:12px;background:#d4a73c;color:#071a40;font-weight:800;padding:10px 18px;text-decoration:none}';
  function injectCss() { if (document.getElementById('pfv-css')) return; var st = document.createElement('style'); st.id = 'pfv-css'; st.textContent = css; document.head.appendChild(st); }

  function card(rec, extra) {
    var thumb = rec.thumb || (rec.type === 'youtube' && rec.vid ? 'https://i.ytimg.com/vi/' + rec.vid + '/hqdefault.jpg' : '');
    var meta = [rec.section, hijri(rec.date)].filter(Boolean).join(' • ');
    return '<button type="button" class="pfv-card" data-vid="' + esc(rec.id) + '"><div class="pfv-th">' +
      (thumb ? '<img src="' + esc(thumb) + '" alt="" loading="lazy" onerror="this.remove()">' : '<span class="pfv-ph">🎬</span>') +
      '<span class="pfv-play"></span><span class="pfv-tag">' + esc(TYPE_LABEL[rec.type] || 'فيديو') + '</span></div>' +
      '<div class="pfv-tx"><b>' + esc(rec.title) + '</b>' + (meta ? '<small>' + esc(meta) + '</small>' : '') + (rec.notes ? '<small>' + esc(rec.notes) + '</small>' : '') + (extra || '') + '</div></button>';
  }

  function play(rec) {
    injectCss();
    var shade = document.createElement('div'); shade.className = 'pfv-shade'; shade.setAttribute('role', 'dialog'); shade.setAttribute('aria-modal', 'true');
    var bar = document.createElement('div'); bar.className = 'pfv-bar';
    var t = document.createElement('span'); t.textContent = '🎬 ' + (rec.title || 'مقطع فيديو');
    var close = document.createElement('button'); close.type = 'button'; close.textContent = 'إغلاق ✕';
    bar.appendChild(t);
    var stage = document.createElement('div'); stage.className = 'pfv-stage';
    var p = rec.type === 'file' ? null : parse(rec.url);
    if (rec.type === 'file' || (p && p.type === 'direct')) {
      var v = document.createElement('video'); v.controls = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'metadata';
      if (rec.thumb) v.poster = rec.thumb;
      v.src = rec.type === 'file' ? rec.file : p.url;
      v.onerror = function () { stage.innerHTML = '<div class="pfv-msg">تعذر تشغيل المقطع على هذا الجهاز. قد تكون صيغته غير مدعومة في المتصفح.<br><a href="' + esc(v.src) + '" target="_blank" rel="noopener">فتح المقطع في نافذة جديدة</a></div>'; };
      stage.appendChild(v);
      setTimeout(function () { try { v.play().catch(function () {}); } catch (e) {} }, 50);
    } else if (p && p.embed) {
      var f = document.createElement('iframe'); f.src = p.embed; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true; f.referrerPolicy = 'strict-origin-when-cross-origin'; f.title = rec.title || 'فيديو';
      stage.appendChild(f);
      var ext = document.createElement('a'); ext.href = p.url; ext.target = '_blank'; ext.rel = 'noopener'; ext.textContent = '↗ فتح في ' + (p.type === 'youtube' ? 'يوتيوب' : 'Drive'); bar.appendChild(ext);
    } else {
      var url = (p && p.url) || rec.url || '';
      stage.innerHTML = '<div class="pfv-msg">هذا المقطع محفوظ برابط خارجي لا يمكن تشغيله داخل المنصة.<br><a href="' + esc(url) + '" target="_blank" rel="noopener">فتح المقطع ↗</a></div>';
    }
    bar.appendChild(close);
    shade.appendChild(bar); shade.appendChild(stage);
    function finish() { var vv = stage.querySelector('video'); if (vv) { try { vv.pause(); } catch (e) {} } shade.remove(); document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; }
    function onKey(e) { if (e.key === 'Escape') finish(); }
    close.onclick = finish; document.addEventListener('keydown', onKey);
    var prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    document.body.appendChild(shade); close.focus();
  }

  window.PFVideo = { load: load, parse: parse, card: card, play: play, hijri: hijri, esc: esc, injectCss: injectCss, sortByDate: sortByDate, TYPE_LABEL: TYPE_LABEL };
})();
