/* عرض شاهد محفوظ على الجهاز للمدير: يرفع الملف إلى المنصة ويضيفه إلى فهرس shared-reports */
(function () {
  'use strict';
  var KIND = { pdf: 'pdf', png: 'image', jpg: 'image', jpeg: 'image', webp: 'image' };
  function ext(name, type) {
    var e = String(name || '').split('.').pop().toLowerCase();
    if (KIND[e]) return e === 'jpeg' ? 'jpg' : e;
    if (type === 'application/pdf') return 'pdf';
    if (type === 'image/png') return 'png'; if (type === 'image/jpeg') return 'jpg'; if (type === 'image/webp') return 'webp';
    return '';
  }
  function b64(blob) { return new Promise(function (ok, fail) { var r = new FileReader(); r.onload = function () { ok(String(r.result).split(',')[1] || ''); }; r.onerror = function () { fail(new Error('تعذر قراءة الملف')); }; r.readAsDataURL(blob); }); }
  /* rec: {file, filename, title, criterion, subsection, date} — يعيد {id,file} */
  function share(rec) {
    if (!window.PFStore || !PFStore.token()) return Promise.reject(new Error('رمز الوصول غير محفوظ على هذا الجهاز. احفظه من «لوحة التحكم بعرض المدير» ثم أعد المحاولة.'));
    var e = ext(rec.filename, rec.file && rec.file.type);
    if (!e) return Promise.reject(new Error('لا يمكن عرض هذا النوع للمدير. الأنواع المدعومة: PDF والصور. حوّل ملفات Word وExcel إلى PDF أولًا.'));
    if (rec.file.size > 20 * 1024 * 1024) return Promise.reject(new Error('الملف أكبر من 20 ميجابايت.'));
    var d = new Date(rec.date || Date.now()), iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    return b64(rec.file).then(function (data) {
      return PFStore.shared.add({ title: rec.title, std: +rec.criterion, section: rec.subsection || 'تقارير عامة', kind: KIND[e], date: rec.eventDate || iso }, [{ ext: e, base64: data, role: 'main' }]);
    }).then(function (s) { return { id: s.id, file: s.file }; });
  }
  function unshare(sh) {
    if (!window.PFStore || !PFStore.token()) return Promise.reject(new Error('رمز الوصول غير محفوظ على هذا الجهاز.'));
    return PFStore.shared.remove({ id: sh.id, file: sh.file, title: 'شاهد' });
  }
  window.PFShare = { share: share, unshare: unshare, canShare: function (r) { return !!ext(r.filename, r.file && r.file.type); } };
})();
