/* نافذة نقل الشاهد/التقرير بين البنود والأقسام — ملف إنجاز المعلم 1448هـ */
(function () {
  "use strict";
  var STANDARDS = ["أداء الواجبات الوظيفية", "التفاعل مع المجتمع المهني", "التفاعل مع أولياء الأمور", "التنوع في استراتيجيات التدريس", "تحسين نتائج المتعلمين", "إعداد وتنفيذ خطة التعلم", "توظيف تقنيات ووسائل التعلم المناسبة", "تهيئة البيئة التعليمية", "الإدارة الصفية", "تحليل نتائج المتعلمين وتشخيص مستوياتهم", "تنوع أساليب التقويم"];
  var DEFAULTS = [["حصص الانتظار", "المناوبة والإشراف اليومي", "أعمال اللجان"], ["الزيارات المتبادلة", "المجتمعات المهنية"], ["التواصل مع أولياء الأمور"], ["أنشطة التعلم", "استراتيجيات التدريس"], ["الخطط العلاجية"], ["خطط التعلم", "توزيع المنهج"], ["الدروس التفاعلية", "مقاطع الفيديو التعليمية", "المختبر الافتراضي"], ["تجهيز المختبر"], ["الإدارة الصفية"], ["تحليل الاختبارات"], ["المهام الأدائية", "التقويم التكويني"]];
  var STATIC = {"1":["حصص الانتظار","المناوبة والإشراف"],"2":["التطوير المهني"],"4":["استراتيجيات التعلم"],"7":["توظيف التقنية في التعلم"],"10":["تقارير تحليل الاختبارات"],"11":["مهام أدائية"]};
  var GENERAL = "تقارير عامة", NEW = "__new__";

  function css() {
    if (document.getElementById("pm-style")) return;
    var s = document.createElement("style");
    s.id = "pm-style";
    s.textContent = ".pm-shade{position:fixed;inset:0;z-index:100000;background:rgba(4,14,34,.82);display:flex;align-items:center;justify-content:center;padding:16px;direction:rtl}" +
      ".pm-box{width:min(560px,100%);max-height:92vh;overflow:auto;background:linear-gradient(160deg,#0c2b5e,#071c43);border:1px solid rgba(141,206,255,.4);border-radius:20px;padding:22px;color:#fff;font-family:inherit;box-shadow:0 20px 60px rgba(0,0,0,.5)}" +
      ".pm-box h3{margin:0 0 6px;color:#ffe5a3;font-size:22px}.pm-box .pm-sub{margin:0 0 16px;color:#bed9f4;font-size:15px}" +
      ".pm-box label{display:block;margin:14px 0 6px;font-weight:bold;font-size:16px}" +
      ".pm-box select,.pm-box input{width:100%;box-sizing:border-box;font:inherit;font-size:17px;padding:12px;border-radius:12px;border:1px solid rgba(141,206,255,.45);background:#fff;color:#0b2147}" +
      ".pm-row{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap}.pm-row button{flex:1;min-width:130px;font:inherit;font-size:17px;font-weight:bold;padding:13px;border-radius:13px;border:1px solid rgba(141,206,255,.4);cursor:pointer;color:#fff;background:#173a72}" +
      ".pm-row .pm-ok{background:linear-gradient(125deg,#1c9ff0,#0652d5)}.pm-msg{min-height:20px;margin-top:10px;color:#ffd27a;font-size:15px}";
    document.head.appendChild(s);
  }

  /* opts: { record, getSections:async n=>[], save:async(updated,{newSection,criterion})=>bool, onDone(updated) } */
  function open(opts) {
    css();
    var r = opts.record, from = Number(r.criterion) || 1, fromSec = r.subsection || GENERAL;
    var shade = document.createElement("div"); shade.className = "pm-shade";
    var box = document.createElement("div"); box.className = "pm-box"; box.setAttribute("role", "dialog");
    var h = document.createElement("h3"); h.textContent = "↔ نقل الشاهد";
    var sub = document.createElement("p"); sub.className = "pm-sub"; sub.textContent = "«" + r.title + "» — حاليًا في البند " + from + " / " + fromSec;
    var l1 = document.createElement("label"); l1.textContent = "البند المستهدف";
    var crit = document.createElement("select");
    STANDARDS.forEach(function (name, i) { crit.add(new Option((i + 1) + ". " + name, i + 1)); });
    crit.value = String(from);
    var l2 = document.createElement("label"); l2.textContent = "القسم داخل البند";
    var sec = document.createElement("select");
    var l3 = document.createElement("label"); l3.textContent = "اسم القسم الجديد";
    var fresh = document.createElement("input"); fresh.maxLength = 90; fresh.placeholder = "مثال: الزيارات التبادلية";
    l3.hidden = fresh.hidden = true;
    var msg = document.createElement("div"); msg.className = "pm-msg";
    var row = document.createElement("div"); row.className = "pm-row";
    var ok = document.createElement("button"); ok.className = "pm-ok"; ok.textContent = "✓ نقل الشاهد";
    var cancel = document.createElement("button"); cancel.textContent = "إلغاء";
    row.append(ok, cancel);
    box.append(h, sub, l1, crit, l2, sec, l3, fresh, msg, row);
    shade.appendChild(box); document.body.appendChild(shade);

    function close() { shade.remove(); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    shade.addEventListener("click", function (e) { if (e.target === shade) close(); });
    cancel.onclick = close;

    async function fill() {
      var n = Number(crit.value), names = [];
      try { names = await opts.getSections(n); } catch (e) { names = (DEFAULTS[n - 1] || []).slice(); }
      if (names.indexOf(GENERAL) < 0) names.unshift(GENERAL);
      sec.replaceChildren();
      names.forEach(function (name) { sec.add(new Option(name, name)); });
      sec.add(new Option("➕ إنشاء قسم جديد داخل هذا البند…", NEW));
      sec.value = (n === from && names.indexOf(fromSec) >= 0) ? fromSec : names[0];
      toggle();
    }
    function toggle() { var isNew = sec.value === NEW; l3.hidden = fresh.hidden = !isNew; if (isNew) fresh.focus(); }
    crit.onchange = fill; sec.onchange = toggle;

    ok.onclick = async function () {
      var n = Number(crit.value), isNew = sec.value === NEW, name = isNew ? fresh.value.trim() : sec.value;
      if (!name) { msg.textContent = "اكتب اسم القسم الجديد."; return; }
      if (n === from && name === fromSec) { msg.textContent = "الشاهد موجود أصلًا في هذا البند والقسم."; return; }
      ok.disabled = true; msg.textContent = "جارٍ النقل…";
      var updated = Object.assign({}, r, { criterion: n, subsection: name });
      delete updated._sourceDB;
      var done = false;
      try { done = await opts.save(updated, { newSection: isNew ? name : null, criterion: n }); } catch (e) { msg.textContent = "تعذر النقل: " + e.message; }
      ok.disabled = false;
      if (done) { close(); if (opts.onDone) opts.onDone(updated); }
      else if (!msg.textContent || msg.textContent === "جارٍ النقل…") msg.textContent = "تعذر النقل، حاول مرة أخرى.";
    };
    fill();
  }

  /* أدوات قاعدة بيانات التابلت لاستخدامها من الصفحة الرئيسية */
  var TABLET_DB = "portfolio-tablet-library-v1";
  function openTablet() {
    return new Promise(function (ok, fail) {
      var q = indexedDB.open(TABLET_DB, 1);
      q.onupgradeneeded = function () { var d = q.result; if (!d.objectStoreNames.contains("reports")) d.createObjectStore("reports", { keyPath: "id" }); if (!d.objectStoreNames.contains("metadata")) d.createObjectStore("metadata"); };
      q.onsuccess = function () { ok(q.result); };
      q.onerror = function (e) { e.preventDefault(); var p = indexedDB.open(TABLET_DB); p.onsuccess = function () { ok(p.result); }; p.onerror = function () { fail(p.error); }; };
    });
  }
  function metaGet(d, key) {
    return new Promise(function (ok, fail) {
      if (!d.objectStoreNames.contains("metadata")) return ok(undefined);
      var q = d.transaction("metadata", "readonly").objectStore("metadata").get(key);
      q.onsuccess = function () { ok(q.result); }; q.onerror = function () { fail(q.error); };
    });
  }
  function metaPut(d, key, value) {
    return new Promise(function (ok, fail) {
      if (!d.objectStoreNames.contains("metadata")) return ok(false);
      var t = d.transaction("metadata", "readwrite"); t.objectStore("metadata").put(value, key);
      t.oncomplete = function () { ok(true); }; t.onerror = function () { fail(t.error); };
    });
  }
  async function tabletSections(n) {
    var d = await openTablet();
    try {
      var sections = (await metaGet(d, "sections")) || {}, hidden = (await metaGet(d, "hiddenSections")) || {};
      var hid = hidden[n] || [];
      var all = (STATIC[n] || []).concat(DEFAULTS[n - 1] || [], sections[n] || []);
      return all.filter(function (v, i) { return all.indexOf(v) === i && hid.indexOf(v) < 0; });
    } finally { d.close(); }
  }
  async function addTabletSection(n, name) {
    var d = await openTablet();
    try {
      var sections = (await metaGet(d, "sections")) || {}, hidden = (await metaGet(d, "hiddenSections")) || {};
      sections[n] = sections[n] || [];
      if (sections[n].indexOf(name) < 0 && (DEFAULTS[n - 1] || []).indexOf(name) < 0) sections[n].push(name);
      hidden[n] = (hidden[n] || []).filter(function (v) { return v !== name; });
      await metaPut(d, "sections", sections); await metaPut(d, "hiddenSections", hidden);
    } finally { d.close(); }
  }

  window.PortfolioMove = { open: open, STANDARDS: STANDARDS, STATIC: STATIC, DEFAULTS: DEFAULTS, tabletSections: tabletSections, addTabletSection: addTabletSection };
})();
