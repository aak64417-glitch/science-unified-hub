/* نافذة تعديل تقرير نافس — ملف الإنجاز 1448هـ
   تعديل العنوان والوصف والمصدر ونوع الأسماء، وتبديل ملف الشاهد، وحذف التقرير.
   يتطلب رمز الوصول المحفوظ على هذا الجهاز (PFStore.token). */
(function () {
  'use strict';
  var KIND = { pdf: 'pdf', png: 'image', jpg: 'image', jpeg: 'image', webp: 'image', html: 'html', htm: 'html' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var css = '.nfe-bg{position:fixed;inset:0;z-index:9999;background:rgba(3,12,30,.78);display:grid;place-items:center;padding:12px;direction:rtl;font-family:inherit}' +
    '.nfe{width:min(640px,100%);max-height:94vh;overflow:auto;background:#0f2f5c;border:1px solid #6a9cd1;border-radius:20px;color:#fff;padding:18px 20px;box-shadow:0 20px 60px #0008}' +
    '.nfe h3{margin:0 0 10px;color:#ffe2a0;font-size:22px;display:flex;justify-content:space-between;align-items:center;gap:10px}' +
    '.nfe h3 button{border:0;background:#ffffff22;color:#fff;border-radius:10px;width:38px;height:38px;font-size:18px;cursor:pointer}' +
    '.nfe label{display:block;margin:10px 0 5px;font-weight:700;font-size:16px}' +
    '.nfe input[type=text],.nfe textarea{width:100%;box-sizing:border-box;border:1px solid #83b7db;border-radius:10px;padding:10px;font:inherit;font-size:16px;background:#fff;color:#122b43}' +
    '.nfe .seg{display:flex;gap:8px;flex-wrap:wrap}.nfe .seg label{display:flex;align-items:center;gap:6px;margin:0;font-weight:600;background:#ffffff14;border-radius:10px;padding:7px 12px;cursor:pointer}' +
    '.nfe .cur{font-size:14px;color:#c2d9e8;margin:4px 0}.nfe .cur a{color:#9fd3ff}' +
    '.nfe .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;align-items:center}' +
    '.nfe .b{border:0;border-radius:11px;padding:11px 18px;font:inherit;font-size:16px;font-weight:700;cursor:pointer;color:#fff;background:#1569ab}' +
    '.nfe .b.del{background:#902e39;margin-inline-start:auto}.nfe .b.gh{background:#ffffff1f}.nfe .b:disabled{opacity:.5}' +
    '.nfe .msg{min-height:22px;margin-top:10px;font-size:15px}.nfe .msg.err{color:#ffb4b4}.nfe .msg.ok{color:#a7f3c0}' +
    '.nfe .file{border:2px dashed #83b7db;border-radius:12px;padding:10px;background:#ffffff0d}';

  function open(rec, onDone) {
    if (!document.getElementById('nfe-css')) { var s = document.createElement('style'); s.id = 'nfe-css'; s.textContent = css; document.head.appendChild(s); }
    var bg = document.createElement('div'); bg.className = 'nfe-bg';
    var hasTok = window.PFStore && PFStore.token();
    bg.innerHTML = '<div class="nfe" role="dialog" aria-label="تعديل التقرير"><h3>✎ تعديل التقرير <button type="button" data-x aria-label="إغلاق">✕</button></h3>' +
      (hasTok ? '' : '<p class="msg err">رمز الوصول غير محفوظ على هذا الجهاز. احفظه أولًا من صفحة <a style="color:#9fd3ff" href="nafs-reports.html">إضافة وإدارة تقارير نافس</a>.</p>') +
      '<label>عنوان التقرير</label><input type="text" data-f="title" maxlength="140" value="' + esc(rec.title) + '">' +
      '<label>الوصف المختصر</label><textarea data-f="notes" rows="2" maxlength="400">' + esc(rec.notes) + '</textarea>' +
      '<label>مصدر التقرير</label><div class="seg"><label><input type="radio" name="nfe-src" value="inside"' + (rec.source !== 'outside' ? ' checked' : '') + '> من داخل منصة نافس</label><label><input type="radio" name="nfe-src" value="outside"' + (rec.source === 'outside' ? ' checked' : '') + '> من خارج المنصة</label></div>' +
      '<label>نوع التقرير</label><div class="seg"><label><input type="radio" name="nfe-nm" value="0"' + (rec.names !== true ? ' checked' : '') + '> بدون أسماء الطلاب</label><label><input type="radio" name="nfe-nm" value="1"' + (rec.names === true ? ' checked' : '') + '> بأسماء الطلاب</label></div>' +
      '<label>🔄 تبديل الشاهد (اختياري)</label><div class="file"><p class="cur">الشاهد الحالي: <a href="' + esc(rec.file) + '" target="_blank" rel="noopener">فتح</a> — اختر ملفًا جديدًا ليحلّ محله (PDF أو صورة أو HTML، حتى 20 ميجابايت)</p><input type="file" data-f="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.html,.htm"></div>' +
      '<div class="row"><button type="button" class="b" data-save' + (hasTok ? '' : ' disabled') + '>💾 حفظ التعديلات</button><button type="button" class="b gh" data-x>إلغاء</button><button type="button" class="b del" data-del' + (hasTok ? '' : ' disabled') + '>🗑 حذف التقرير</button></div>' +
      '<div class="msg" data-msg></div></div>';
    document.body.appendChild(bg);
    var q = function (sel) { return bg.querySelector(sel); };
    var busy = false;
    function close() { if (!busy) bg.remove(); }
    function say(t, ok) { var m = q('[data-msg]'); m.textContent = t; m.className = 'msg ' + (ok ? 'ok' : 'err'); }
    function lock(v) { busy = v; bg.querySelectorAll('button').forEach(function (b) { if (!b.hasAttribute('data-x')) b.disabled = v || !hasTok; }); }
    bg.querySelectorAll('[data-x]').forEach(function (b) { b.onclick = close; });
    bg.addEventListener('click', function (e) { if (e.target === bg) close(); });

    q('[data-save]').onclick = function () {
      var title = q('[data-f=title]').value.trim(); if (!title) { say('اكتب عنوان التقرير.'); return; }
      var ch = { title: title, notes: q('[data-f=notes]').value.trim(), source: bg.querySelector('input[name=nfe-src]:checked').value, names: bg.querySelector('input[name=nfe-nm]:checked').value === '1' };
      var f = q('[data-f=file]').files[0], ext = '';
      if (f) { ext = (f.name.split('.').pop() || '').toLowerCase(); if (!KIND[ext]) { say('نوع الملف غير مدعوم. استخدم PDF أو صورة أو HTML.'); return; } if (f.size > 20 * 1024 * 1024) { say('حجم الملف أكبر من 20 ميجابايت.'); return; } }
      lock(true); say(f ? 'جارٍ رفع الشاهد الجديد…' : 'جارٍ الحفظ…', true);
      var step = Promise.resolve(null);
      if (f) step = new Promise(function (ok, fail) { var rd = new FileReader(); rd.onerror = function () { fail(new Error('تعذر قراءة الملف.')); }; rd.onload = function () { ok(String(rd.result).split(',')[1] || ''); }; rd.readAsDataURL(f); })
        .then(function (b64) { return PFStore.replaceReportFile(rec, ext === 'htm' ? 'html' : ext, KIND[ext], b64); });
      step.then(function (nf) { if (nf) { ch.file = nf.file; ch.kind = nf.kind; } return PFStore.updateReport(rec.id, { title: ch.title, notes: ch.notes, source: ch.source, names: ch.names }); })
        .then(function () { for (var k in ch) rec[k] = ch[k]; busy = false; say('تم الحفظ ✓ (يظهر للمدير خلال دقيقة إلى دقيقتين)', true); setTimeout(function () { bg.remove(); if (onDone) onDone('saved', rec); }, 700); })
        .catch(function (e) { lock(false); say(e.message || 'تعذر الحفظ'); });
    };

    var armed = false;
    q('[data-del]').onclick = function () {
      if (!armed) { armed = true; this.textContent = '⚠ اضغط مرة أخرى لتأكيد الحذف'; var b = this; setTimeout(function () { if (b.isConnected) { armed = false; b.textContent = '🗑 حذف التقرير'; } }, 4000); return; }
      lock(true); say('جارٍ الحذف…', true);
      PFStore.removeReport(rec).then(function () { busy = false; bg.remove(); if (onDone) onDone('deleted', rec); })
        .catch(function (e) { lock(false); say(e.message || 'تعذر الحذف'); });
    };
  }
  window.PFNafsEdit = { open: open };
})();
