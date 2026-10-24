/* جسر منصة نافس ← ملف الإنجاز
   - «إرسال إلى ملف الإنجاز» لتقرير الإنجاز العام.
   - إرسال تقرير طالب فردي بدون اسم، أو تقارير طلاب فصل كامل بدون أسماء في ملف واحد.
   كل ما يُرسل يظهر في بند نافس في ملف الإنجاز (ولصفحة المدير). */
(function () {
  'use strict';
  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  var EXTRA_CSS = '.pf-print{position:fixed;top:12px;left:12px;border:0;border-radius:10px;background:#176bd5;color:#fff;padding:9px 14px;font:inherit;cursor:pointer;z-index:9}' +
    '.pf-anon{background:#eef7ff;border:1px solid #cfe3f7;border-radius:12px;padding:8px 12px;margin:0 auto 14px;max-width:1000px;font-size:13px;color:#35516a;text-align:center}' +
    '.pf-sep{page-break-after:always;break-after:page;height:0;margin:28px 0;border-top:2px dashed #cfdced}' +
    '@media print{.pf-print{display:none}.pf-sep{border:0;margin:0}}';
  function hijri(d) { try { return d.toLocaleDateString('ar-SA-u-ca-islamic-umalqura-nu-arab', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* يشغّل دالة طباعة من دوال المنصة ويلتقط الصفحة التي كانت ستُفتح للطباعة */
  function capture(run) {
    var html = '', realOpen = window.open;
    window.open = function () {
      return { document: { open: function () {}, write: function (h) { html += h; }, close: function () {} }, focus: function () {}, print: function () {}, close: function () {} };
    };
    try { run(); } finally { window.open = realOpen; }
    return html.replace(/<script>window\.onload=[\s\S]*?<\/script>/, '');
  }
  function finish(html, note) {
    html = html.replace('</style>', EXTRA_CSS + '</style>');
    return html.replace('<body>', '<body><button class="pf-print" onclick="window.print()">🖨 طباعة</button>' + (note ? '<div class="pf-anon">' + note + '</div>' : ''));
  }

  /* ===== بيانات الطلاب ===== */
  function students() { try { return (dashboardData && dashboardData.students) || []; } catch (e) { return []; } }
  function results() { try { return (dashboardData && dashboardData.results) || []; } catch (e) { return []; } }
  function nameRx(name) { return new RegExp(String(name).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'), 'g'); }

  /* تقرير طالب واحد بدون اسم: يستبدل الاسم بوسم مجهول ثم يمسح أي ظهور متبقٍ للاسم */
  function anonStudentHtml(code, label) {
    var orig = window.studentByCode2, real = orig(code);
    if (!real) throw new Error('لم يتم العثور على الطالب.');
    window.studentByCode2 = function (c) { var s = orig(c); return s ? Object.assign({}, s, { name: label }) : s; };
    var html;
    try { html = capture(function () { window.printStudentReport(code); }); } finally { window.studentByCode2 = orig; }
    if (!html) throw new Error('تعذر إنشاء تقرير الطالب.');
    if (real.name && String(real.name).trim()) html = html.replace(nameRx(real.name), label);
    return html;
  }

  /* ترتيب طلاب الفصل وترقيمهم دون الاعتماد على الأسماء */
  function classRoster(cls) {
    return students().filter(function (s) { return String(s.className || '') === String(cls); })
      .slice().sort(function (a, b) { return String(a.code || '').localeCompare(String(b.code || ''), 'en', { numeric: true }); });
  }
  function labelFor(st) {
    var list = classRoster(st.className || ''), i = list.findIndex(function (s) { return String(s.code) === String(st.code); });
    return 'طالب رقم ' + (i + 1) + ' — بدون اسم';
  }

  /* ===== الإرسال ===== */
  function ensureToken() {
    if (!window.PFStore) { alert('تعذر تحميل أداة ملف الإنجاز.'); return false; }
    if (PFStore.token()) return true;
    if (confirm('يلزم حفظ رمز الوصول لملف الإنجاز على هذا الجهاز أولًا. فتح صفحة تقارير نافس في ملف الإنجاز؟')) window.open('../portfolio-1448/nafs-reports.html', '_blank');
    return false;
  }
  function upload(btn, title, html) {
    title = prompt('عنوان التقرير في ملف الإنجاز:', title);
    if (title === null) return;
    title = title.trim() || 'تقرير منصة تدريب نافس';
    var label = btn.innerHTML; btn.disabled = true; btn.innerHTML = '⏳ جارٍ الإرسال…';
    PFStore.addReport({ title: title, source: 'inside', kind: 'html' }, 'html', PFStore.b64utf8(html))
      .then(function () { alert('تم إرسال التقرير إلى ملف الإنجاز ✓\nيظهر في بند نافس للمدير خلال دقيقة إلى دقيقتين.'); })
      .catch(function (e) { alert('تعذر الإرسال: ' + e.message); })
      .then(function () { btn.disabled = false; btn.innerHTML = label; });
  }

  function sendAchievement(btn) {
    if (!ensureToken()) return;
    if (typeof window.printAchievementReport !== 'function') { alert('تقرير الإنجاز غير متاح في هذه الصفحة.'); return; }
    var html = capture(function () { window.printAchievementReport(); });
    if (!html) return; /* المنصة تعرض تنبيهها الخاص عند عدم توفر البيانات */
    upload(btn, 'تقرير إنجاز منصة تدريب نافس — ' + hijri(new Date()), finish(html));
  }

  function sendStudent(btn, code) {
    if (!ensureToken()) return;
    var st = window.studentByCode2 && window.studentByCode2(code);
    if (!st) { alert('لم يتم العثور على الطالب.'); return; }
    var label = labelFor(st), html;
    try { html = anonStudentHtml(code, label); } catch (e) { alert(e.message); return; }
    upload(btn, 'تقرير أداء طالب (بدون اسم) — الفصل ' + (st.className || '') + ' — ' + hijri(new Date()),
      finish(html, '🔒 أُخفي اسم الطالب في هذا التقرير لأغراض ملف الإنجاز.'));
  }

  function sendClass(btn) {
    if (!ensureToken()) return;
    var sel = document.getElementById('reportClass'), cls = sel ? sel.value : '';
    var all = students();
    if (!all.length) { alert('أدخل مفتاح المعلم واضغط «تحديث التقارير» أولًا حتى تظهر بيانات الطلاب.'); return; }
    var classes = cls ? [cls] : Array.from(new Set(all.map(function (s) { return String(s.className || ''); }))).filter(Boolean).sort();
    var withResults = new Set(results().map(function (r) { return String(r.studentCode || ''); }));
    var onlyActive = confirm('هل تريد إرسال تقارير الطلاب الذين لديهم محاولات فقط؟\n\nموافق = الطلاب الذين تدربوا فقط\nإلغاء = جميع طلاب ' + (cls ? 'الفصل ' + cls : 'الفصول'));
    var head = '', parts = [], count = 0;
    try {
      classes.forEach(function (c) {
        classRoster(c).forEach(function (st, i) {
          if (onlyActive && !withResults.has(String(st.code || ''))) return;
          var h = anonStudentHtml(st.code, 'طالب رقم ' + (i + 1) + ' — بدون اسم');
          var b = h.indexOf('<body>'), e = h.lastIndexOf('</body>');
          if (!head) head = h.slice(0, b);
          parts.push(h.slice(b + 6, e < 0 ? undefined : e)); count++;
        });
      });
    } catch (err) { alert(err.message); return; }
    if (!count) { alert('لا توجد تقارير طلاب لإرسالها وفق الاختيار.'); return; }
    head = head.replace(/<title>[\s\S]*?<\/title>/, '<title>تقارير الطلاب بدون أسماء</title>');
    var html = finish(head + '<body>' + parts.join('<div class="pf-sep"></div>') + '</body></html>',
      '🔒 تقارير ' + count + ' طالبًا' + (cls ? ' — الفصل ' + esc(cls) : '') + '، وأُخفيت الأسماء واستُبدلت بأرقام لأغراض ملف الإنجاز.');
    upload(btn, 'تقارير أداء الطلاب (بدون أسماء) — ' + (cls ? 'الفصل ' + cls : 'جميع الفصول') + ' — ' + hijri(new Date()), html);
  }

  function makeBtn(text, onClick, cls) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = cls || 'primary'; b.setAttribute('data-pf-send', '1');
    b.innerHTML = text;
    b.addEventListener('click', function () { onClick(b); });
    return b;
  }
  function addToHead(sectionId, btn) {
    var sec = document.getElementById(sectionId), head = sec && sec.querySelector('.section-head');
    if (!head || head.querySelector('[data-pf-send]')) return;
    var wrap = document.createElement('div'); wrap.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap';
    var first = head.querySelector(':scope > button');
    if (first) { head.insertBefore(wrap, first); wrap.appendChild(first); } else head.appendChild(wrap);
    wrap.appendChild(btn);
  }

  ready(function () {
    addToHead('achievement', makeBtn('📁 إرسال إلى ملف الإنجاز', sendAchievement));
    if (typeof window.printStudentReport === 'function')
      addToHead('reports', makeBtn('📁 إرسال تقارير الطلاب لملف الإنجاز (بدون أسماء)', sendClass));

    var body = document.getElementById('appModalBody');
    if (body) new MutationObserver(function () {
      var t = document.getElementById('appModalTitle'); if (!t || body.querySelector('[data-pf-send]')) return;
      var title = t.textContent.trim(), b;
      if (title === 'تقرير الإنجاز') {
        var p1 = body.querySelector('button[onclick*="printAchievementReport"]');
        if (p1) { b = makeBtn('📁 إرسال إلى ملف الإنجاز', sendAchievement); b.style.marginInlineStart = '8px'; p1.parentNode.appendChild(b); }
      } else if (title.indexOf('تقرير الطالب') === 0) {
        var p2 = body.querySelector('button[onclick*="printStudentReport"]'), m = p2 && /printStudentReport\('([^']*)'\)/.exec(p2.getAttribute('onclick') || '');
        if (m) { var code = m[1].replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'); b = makeBtn('📁 إرسال لملف الإنجاز (بدون اسم)', function (x) { sendStudent(x, code); }); b.style.marginInlineStart = '8px'; p2.parentNode.appendChild(b); }
      }
    }).observe(body, { childList: true });
  });
})();
