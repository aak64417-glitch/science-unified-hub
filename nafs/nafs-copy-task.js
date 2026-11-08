// ===== نافس: تكرار التكليف لفصول أخرى بنفس الأسئلة 2026-11-06 =====
window.addEventListener('load', function () {
  if (typeof window.saveTask !== 'function' || typeof window.openTaskEditor !== 'function' || typeof CLASSES === 'undefined') return;
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function allTasks() { try { return Array.isArray(tasks) ? tasks : []; } catch (e) { return []; } }
  function find(id) { return allTasks().find(function (t) { return String(t.taskId) === String(id); }); }
  function qkey(ids) { return (ids || []).map(String).sort().join('|'); }
  // يوجد في الفصل تكليف مطابق (نفس الاسم ونفس الأسئلة)؟
  function identicalIn(src, c) { var k = qkey(src.questionIds), ti = String(src.title || '').trim(); return allTasks().some(function (x) { return String(x.className) === c && String(x.title || '').trim() === ti && qkey(x.questionIds) === k; }); }
  var busy = false;
  function sameTitleIn(t, c) { return allTasks().some(function (x) { return x !== t && String(x.className) === c && String(x.title || '').trim() === String(t.title || '').trim(); }); }

  async function createCopies(src, classes, status) {
    var ok = 0, fail = [], seen = {}, skip = [];
    for (var i = 0; i < classes.length; i++) {
      var c = classes[i];
      if (seen[c]) continue;
      if (identicalIn(src, c)) { skip.push(c); continue; } // لا يُنشأ التكليف مرتين لنفس الفصل
      seen[c] = 1;
      if (status) status('⏳ جاري إنشاء التكليف للفصل ' + c + ' (' + (i + 1) + ' من ' + classes.length + ')...');
      var d = {
        taskId: '', title: src.title, type: src.type || 'training', className: c,
        targetMode: 'ALL', studentCodes: [], questionIds: (src.questionIds || []).slice(),
        openAt: src.openAt || '', closeAt: src.closeAt || '', status: src.status || 'DRAFT',
        attemptPolicy: src.attemptPolicy || 'UNLIMITED', notes: 'نسخة من تكليف الفصل ' + (src.className || '')
      };
      try { await jsonp({ action: 'saveTask', key: teacherKey(), data: JSON.stringify(d) }, 60000); ok++; }
      catch (e) { fail.push(c + ': ' + (e.message || e)); }
    }
    try { await refreshData(true); } catch (e) {}
    try { renderTasks(); } catch (e) {}
    return { ok: ok, fail: fail, skip: skip };
  }

  // نافذة التكرار من بطاقة التكليف
  window.copyTaskToClasses = function (id) {
    var t = find(id); if (!t) return;
    if (!teacherKey()) return alert('أدخل مفتاح المعلم في أعلى الصفحة أولًا.');
    var list = CLASSES.filter(function (c) { return c !== String(t.className); });
    openModal('تكرار التكليف لفصول أخرى',
      '<div class="helper">«<b>' + E(t.title) + '</b>» — الفصل ' + E(t.className) + ' • ' + (t.questionIds || []).length + ' سؤالًا<br>' +
      '<small>تُنسخ نفس الأسئلة والنوع وسياسة المحاولات والحالة وموعدا البدء والانتهاء، ويُنشأ لكل فصل تكليف مستقل.</small></div>' +
      '<div style="display:flex;gap:8px;margin:10px 0"><button class="btn-mini btn-view" id="ncAll">تحديد الكل</button><button class="btn-mini btn-hide" id="ncNone">إلغاء التحديد</button></div>' +
      '<div id="ncList" style="display:grid;gap:8px">' + list.map(function (c) {
        var has = sameTitleIn(t, c);
        return '<label style="display:flex;align-items:center;gap:10px;padding:12px 14px;border:2px solid #d8e7f5;border-radius:14px;background:#fff;font-weight:800;cursor:pointer;text-align:right">' +
          '<input type="checkbox" class="nc-check" value="' + E(c) + '" ' + (has ? '' : 'checked') + ' style="width:20px;height:20px;margin:0">الفصل ' + E(c) +
          (has ? '<small style="margin-inline-start:auto;color:#8a5a00">يوجد له تكليف بنفس الاسم</small>' : '') + '</label>';
      }).join('') + '</div>' +
      '<div id="ncStatus" class="helper" style="display:none;margin-top:10px"></div>' +
      '<button class="primary" id="ncGo" style="width:100%;margin-top:12px">إنشاء التكليف للفصول المحددة</button>');
    var body = document.getElementById('appModalBody');
    document.getElementById('ncAll').onclick = function () { body.querySelectorAll('.nc-check').forEach(function (x) { x.checked = true; }); };
    document.getElementById('ncNone').onclick = function () { body.querySelectorAll('.nc-check').forEach(function (x) { x.checked = false; }); };
    var go = document.getElementById('ncGo');
    go.onclick = async function () {
      var chosen = [].slice.call(body.querySelectorAll('.nc-check:checked')).map(function (x) { return x.value; });
      if (!chosen.length) return alert('اختر فصلًا واحدًا على الأقل.');
      if (busy || go.disabled) return;
      busy = true; go.disabled = true;
      var st = document.getElementById('ncStatus'); st.style.display = '';
      var r;
      try { r = await createCopies(t, chosen, function (s) { st.textContent = s; }); } finally { busy = false; }
      closeAppModal();
      notice('تم إنشاء التكليف لـ ' + r.ok + ' فصل بنفس الأسئلة.', !!r.fail.length);
      alert('تم إنشاء التكليف لـ ' + r.ok + ' فصل بنفس الأسئلة.' + (r.skip.length ? '\nلم يُكرَّر للفصول ' + r.skip.join('، ') + ' لأن التكليف نفسه موجود لها.' : '') + (r.fail.length ? '\nتعذر:\n' + r.fail.join('\n') : ''));
      try { goTo('assignments'); } catch (e) {}
    };
  };

  // زر في كل بطاقة تكليف
  var origTasks = window.renderTasks;
  window.renderTasks = function () {
    var r = origTasks.apply(this, arguments);
    try {
      document.querySelectorAll('#tasksList button[onclick*="editTaskById"]').forEach(function (b) {
        if (b.nextElementSibling && b.nextElementSibling.classList.contains('nafs-copy-btn')) return;
        var m = String(b.getAttribute('onclick')).match(/editTaskById\((.*)\)/); if (!m) return;
        var id; try { id = JSON.parse(m[1]); } catch (e) { id = m[1].replace(/['"]/g, ''); }
        var c = document.createElement('button'); c.className = 'btn-mini btn-edit nafs-copy-btn';
        c.style.cssText = 'background:#ffb020;color:#10234f'; c.textContent = '🔁 تكرار لفصول أخرى';
        c.onclick = function () { copyTaskToClasses(id); };
        b.insertAdjacentElement('afterend', c);
      });
    } catch (e) {}
    return r;
  };

  // خيار داخل محرر التكليف الجديد: أنشئه أيضًا لفصول أخرى
  var editing = false;
  function mountExtra() {
    var sel = document.getElementById('teClass'); if (!sel) return;
    var box = document.getElementById('ncExtra');
    var prev = {}; if (box) box.querySelectorAll('input:checked').forEach(function (x) { prev[x.value] = 1; });
    if (!box) {
      box = document.createElement('div'); box.id = 'ncExtra'; box.className = 'helper full';
      box.style.cssText = 'grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;border:2px solid #9fe0c4;background:#eafaf2;font-weight:800';
      var grid = sel.closest('.form-grid'); grid.appendChild(box);
      sel.addEventListener('change', mountExtra);
    }
    if (editing) { box.style.display = 'none'; return; }
    var list = CLASSES.filter(function (c) { return c !== sel.value; });
    box.innerHTML = '<b>أنشئ نفس التكليف أيضًا للفصول:</b>' + list.map(function (c) {
      return '<label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" value="' + E(c) + '" ' + (prev[c] ? 'checked' : '') + ' style="width:20px;height:20px;margin:0"> ' + E(c) + '</label>';
    }).join('') + '<button type="button" class="btn-mini btn-view" id="ncExtraAll">الكل</button>' +
      '<small style="flex-basis:100%;font-weight:700;color:#147147">بنفس الأسئلة المحددة دون إعادة اختيارها، ولكل فصل تكليفه.</small>';
    document.getElementById('ncExtraAll').onclick = function () { box.querySelectorAll('input').forEach(function (x) { x.checked = true; }); };
  }
  var origOpen = window.openTaskEditor;
  window.openTaskEditor = function (task) {
    editing = !!(task && task.taskId);
    var r = origOpen.apply(this, arguments);
    setTimeout(mountExtra, 0);
    return r;
  };

  var origSave = window.saveTask;
  window.saveTask = async function (id) {
    if (busy) return; // منع الحفظ المزدوج عند الضغط مرتين
    busy = true;
    var btn = document.querySelector('#appModalBody button[onclick^="saveTask"]');
    if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = '⏳ جارٍ الحفظ...'; }
    try { return await saveImpl.apply(this, arguments); }
    finally { busy = false; if (btn) { btn.disabled = false; btn.textContent = btn.dataset.t || 'حفظ التكليف'; } }
  };
  async function saveImpl(id) {
    var extra = id ? [] : [].slice.call(document.querySelectorAll('#ncExtra input:checked')).map(function (x) { return x.value; })
      .filter(function (c) { return c !== (document.getElementById('teClass') || {}).value; });
    if (!extra.length) return origSave.apply(this, arguments);
    var src = {
      title: document.getElementById('teTitle').value.trim(), type: document.getElementById('teType').value,
      className: document.getElementById('teClass').value, status: document.getElementById('teStatus').value,
      attemptPolicy: document.getElementById('teAttempt').value,
      openAt: document.getElementById('teOpen').value ? new Date(document.getElementById('teOpen').value).toISOString() : '',
      closeAt: document.getElementById('teClose').value ? new Date(document.getElementById('teClose').value).toISOString() : ''
    };
    var r = await origSave.apply(this, arguments);
    if (document.getElementById('appModal').classList.contains('show')) return r; // لم يُحفظ الأصل
    src.questionIds = [...taskSelection];
    try { await refreshData(true); } catch (e) {}
    var c = await createCopies(src, extra);
    notice('تم حفظ التكليف وإنشاؤه أيضًا لـ ' + c.ok + ' فصل إضافي.', !!c.fail.length);
    alert('تم حفظ التكليف وإنشاؤه أيضًا لـ ' + c.ok + ' فصل إضافي بنفس الأسئلة.' + (c.fail.length ? '\nتعذر:\n' + c.fail.join('\n') : ''));
    try { goTo('assignments'); } catch (e) {}
    return r;
  }

  try { window.renderTasks(); } catch (e) {}
});
