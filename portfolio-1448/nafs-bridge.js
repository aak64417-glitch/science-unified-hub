/* جسر منصة نافس ← ملف الإنجاز: زر «إرسال إلى ملف الإنجاز» لتقرير الإنجاز في لوحة معلم نافس.
   يرفع نسخة من تقرير الإنجاز (بدون أسماء طلاب) إلى بند نافس في ملف الإنجاز. */
(function () {
  'use strict';
  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  function captureReportHtml() {
    if (typeof window.printAchievementReport !== 'function') throw new Error('تقرير الإنجاز غير متاح في هذه الصفحة.');
    var html = '', realOpen = window.open;
    window.open = function () {
      return { document: { open: function () {}, write: function (h) { html += h; }, close: function () {} }, focus: function () {}, print: function () {}, close: function () {} };
    };
    try { window.printAchievementReport(); } finally { window.open = realOpen; }
    if (!html) throw new Error('');
    html = html.replace(/<script>window\.onload=[\s\S]*?<\/script>/, '');
    html = html.replace('</style>', '.pf-print{position:fixed;top:12px;left:12px;border:0;border-radius:10px;background:#176bd5;color:#fff;padding:9px 14px;font:inherit;cursor:pointer}@media print{.pf-print{display:none}}</style>');
    html = html.replace('<body>', '<body><button class="pf-print" onclick="window.print()">🖨 طباعة</button>');
    return html;
  }

  function send(btn) {
    if (!window.PFStore) { alert('تعذر تحميل أداة ملف الإنجاز.'); return; }
    if (!PFStore.token()) {
      if (confirm('يلزم حفظ رمز الوصول لملف الإنجاز على هذا الجهاز أولًا. فتح صفحة تقارير نافس في ملف الإنجاز؟')) window.open('../portfolio-1448/nafs-reports.html', '_blank');
      return;
    }
    var html;
    try { html = captureReportHtml(); } catch (e) { if (e.message) alert(e.message); return; }
    var d = new Date(), title = 'تقرير إنجاز منصة تدريب نافس — ' + d.toLocaleDateString('ar-SA-u-ca-islamic-umalqura-nu-arab', { day: 'numeric', month: 'long', year: 'numeric' });
    title = prompt('عنوان التقرير في ملف الإنجاز:', title);
    if (title === null) return;
    title = title.trim() || 'تقرير إنجاز منصة تدريب نافس';
    var label = btn.innerHTML; btn.disabled = true; btn.innerHTML = '⏳ جارٍ الإرسال…';
    PFStore.addReport({ title: title, source: 'inside', kind: 'html' }, 'html', PFStore.b64utf8(html))
      .then(function () { alert('تم إرسال التقرير إلى ملف الإنجاز ✓\nيظهر في بند نافس للمدير خلال دقيقة إلى دقيقتين.'); })
      .catch(function (e) { alert('تعذر الإرسال: ' + e.message); })
      .then(function () { btn.disabled = false; btn.innerHTML = label; });
  }

  function makeBtn(cls) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = cls || 'primary'; b.setAttribute('data-pf-send', '1');
    b.innerHTML = '📁 إرسال إلى ملف الإنجاز';
    b.addEventListener('click', function () { send(b); });
    return b;
  }

  ready(function () {
    /* زر في قسم «ملف الإنجاز» بجانب «تحديث بيانات التقرير» */
    var sec = document.getElementById('achievement');
    var head = sec && sec.querySelector('.section-head');
    if (head && !head.querySelector('[data-pf-send]')) {
      var wrap = document.createElement('div'); wrap.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap';
      var refresh = head.querySelector('button');
      if (refresh) { head.insertBefore(wrap, refresh); wrap.appendChild(refresh); } else head.appendChild(wrap);
      wrap.appendChild(makeBtn('primary'));
    }
    /* زر داخل نافذة «تقرير الإنجاز» */
    var body = document.getElementById('appModalBody');
    if (body) new MutationObserver(function () {
      var t = document.getElementById('appModalTitle');
      if (!t || t.textContent.trim() !== 'تقرير الإنجاز' || body.querySelector('[data-pf-send]')) return;
      var printBtn = body.querySelector('button[onclick*="printAchievementReport"]');
      if (printBtn) { var b = makeBtn('primary'); b.style.marginInlineStart = '8px'; printBtn.parentNode.appendChild(b); }
    }).observe(body, { childList: true });
  });
})();
