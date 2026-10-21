/* رحلة عالم العلوم — امتداد لوحة المعلم V6
   يعرّف لوحة المعلم بأنماط الأسئلة الجديدة (أكمل – مطابقة – تصنيف) والرسوم والجداول،
   ويتجاهل اختيارات وتعديلات أسئلة البنك السابق حتى لا تتعطل التكليفات القديمة.
   لا يغيّر إنشاء التكليفات أو الروابط أو النتائج أو إدارة الطلاب. */
(function () {
  if (window.__JOURNEY_V6_TEACHER__) return;
  window.__JOURNEY_V6_TEACHER__ = true;
  const g = window;
  const escH = s => String(s ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  const bank = () => (g.SCIENCE_DATA?.questions || []);
  const bankIds = () => new Set(bank().map(q => String(q.id)));
  const NEW_TYPES = ['fill', 'match', 'classify'];

  const TYPE_LABELS = { choice: 'اختيار من متعدد', tf: 'صح أو خطأ', multi: 'اختيار متعدد', order: 'ترتيب', fill: 'أكمل', match: 'مطابقة', classify: 'تصنيف' };
  g.questionTypeLabel = function (type) { return TYPE_LABELS[type] || type || 'غير محدد'; };

  const baseAnswerText = g.answerTextForQuestion;
  g.answerTextForQuestion = function (q) {
    if (q.type === 'fill') return (q.answer || []).map(a => (a || [])[0]).join(' / ');
    if (q.type === 'match') return (q.left || []).map((l, i) => `${l} ← ${(q.right || [])[q.answer[i]]}`).join('، ');
    if (q.type === 'classify') return (q.items || []).map((it, i) => `${it} (${(q.categories || [])[q.answer[i]]})`).join('، ');
    return baseAnswerText ? baseAnswerText(q) : String(q.answer ?? '');
  };

  /* تعديلات البنك السابق لا تُضاف إلى البنك الجديد */
  g.applyQuestionOverrides = function (items) {
    const data = refreshLessonCatalog(), qmap = new Map((data.questions || []).map(q => [String(q.id), q]));
    (Array.isArray(items) ? items : []).forEach(item => {
      const id = String(item?.questionId || '').trim(); if (!id) return;
      if (String(item.action || 'upsert') === 'delete') { qmap.delete(id); return; }
      const p = item?.payload; if (!p || typeof p !== 'object' || Array.isArray(p)) return;
      if (!qmap.has(id)) return;
      qmap.set(id, { ...qmap.get(id), ...p, id });
    });
    data.questions = [...qmap.values()];
    g.SCIENCE_DATA = data;
    refreshLessonCatalog();
  };

  /* اختيارات الأسئلة المحفوظة في التكليفات القديمة تشير إلى البنك السابق؛ تُحذف عند فتح التكليف للتعديل */
  const baseNormalize = g.normalizeQuestionSelections;
  g.normalizeQuestionSelections = function (raw) {
    const sel = baseNormalize(raw), ids = bankIds(), out = {};
    Object.entries(sel).forEach(([lesson, list]) => {
      const keep = (list || []).filter(id => ids.has(String(id)));
      if (keep.length) out[lesson] = keep;
    });
    return out;
  };

  /* ================= منتقي الأسئلة: المعلم يرى السؤال كاملًا ويختاره ================= */
  const LET = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'];
  function previewHtml(q) {
    let body = '';
    if (q.figure) body += `<div class="v6-figure v6-pv-fig">${q.figure}</div>`;
    if (q.table && Array.isArray(q.table.head)) {
      body += '<table class="v6-table"><thead><tr>' + q.table.head.map(h => `<th>${escH(h)}</th>`).join('') + '</tr></thead><tbody>' +
        (q.table.rows || []).map(r => '<tr>' + r.map(c => `<td>${escH(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table>';
    }
    if (q.type === 'choice' || q.type === 'multi') {
      const ok = i => q.type === 'multi' ? (q.answer || []).includes(i) : i === Number(q.answer);
      body += '<ol class="v6-pv-opts">' + (q.options || []).map((o, i) => `<li class="${ok(i) ? 'ok' : ''}"><b>${LET[i] || i + 1}</b>${escH(o)}${ok(i) ? ' ✓' : ''}</li>`).join('') + '</ol>';
    } else if (q.type === 'tf') {
      body += `<div class="v6-pv-ans">الإجابة: <b>${q.answer ? 'صح' : 'خطأ'}</b></div>`;
    } else if (q.type === 'fill') {
      body += `<div class="v6-pv-ans">الإجابة: <b>${escH((q.answer || []).map(a => a.join(' أو ')).join(' / '))}</b></div>`;
    } else if (q.type === 'match') {
      body += '<ul class="v6-pv-list">' + (q.left || []).map((l, i) => `<li>${escH(l)} ← <b>${escH((q.right || [])[q.answer[i]])}</b></li>`).join('') + '</ul>';
    } else if (q.type === 'classify') {
      body += '<ul class="v6-pv-list">' + (q.items || []).map((it, i) => `<li>${escH(it)} ← <b>${escH((q.categories || [])[q.answer[i]])}</b></li>`).join('') + '</ul>';
    } else if (q.type === 'order') {
      body += '<ol class="v6-pv-list">' + (q.options || []).map(o => `<li>${escH(o)}</li>`).join('') + '</ol>';
    }
    if (q.explain) body += `<div class="v6-pv-exp">${escH(q.explain)}</div>`;
    return body;
  }
  const levelDots = c => `<span class="v6-level">${[1, 2, 3].map(i => `<i class="${i <= c ? 'on' : ''}"></i>`).join('')}</span>`;

  g.openQuestionPicker = async function (lessonId) {
    currentQuestionPickerLesson = String(lessonId || '');
    await ensureQuestionOverridesLoaded();
    const qs = lessonQuestions(currentQuestionPickerLesson);
    if (!qs.length) { alert('لا توجد أسئلة في هذا الدرس.'); return; }
    const explicit = explicitQuestionIds(currentQuestionPickerLesson);
    const allowed = new Set(explicit === null ? (pickerMode() === 'teacher' ? [] : qs.map(q => String(q.id))) : explicit);
    const lesson = (refreshLessonCatalog().lessons || []).find(l => String(l.id) === currentQuestionPickerLesson);
    $('questionPickerTitle').textContent = 'أسئلة درس: ' + (lesson?.title || currentQuestionPickerLesson);
    const types = [...new Set(qs.map(q => q.type))], skills = [...new Set(qs.map(q => q.skill).filter(Boolean))];
    let tools = document.getElementById('v6PickerFilters');
    if (!tools) {
      tools = document.createElement('div'); tools.id = 'v6PickerFilters'; tools.className = 'v6-pk-filters';
      $('questionPickerList').insertAdjacentElement('beforebegin', tools);
    }
    tools.innerHTML = `
      <input id="v6PkSearch" placeholder="ابحث في نص السؤال">
      <select id="v6PkType"><option value="">كل الأنماط</option>${types.map(t => `<option value="${t}">${escH(g.questionTypeLabel(t))}</option>`).join('')}</select>
      <select id="v6PkLevel"><option value="">كل المستويات</option><option value="1">سهل</option><option value="2">متوسط</option><option value="3">متقدم</option></select>
      <select id="v6PkSkill"><option value="">كل المهارات</option>${skills.map(s => `<option>${escH(s)}</option>`).join('')}</select>
      <label class="v6-pk-chk"><input type="checkbox" id="v6PkFig"> بها رسم أو جدول</label>
      <label class="v6-pk-chk"><input type="checkbox" id="v6PkSel"> المحددة فقط</label>
      <button type="button" class="btn secondary" id="v6PkShownOn">تحديد الظاهرة</button>
      <button type="button" class="btn secondary" id="v6PkShownOff">إلغاء الظاهرة</button>
      <div class="v6-pk-mix" id="v6PkMix"></div>`;
    $('questionPickerList').innerHTML = qs.map((q, i) => `
      <div class="question-picker-row v6-pk-row" data-type="${q.type}" data-level="${q.levelCode || ''}" data-skill="${escH(q.skill || '')}" data-fig="${q.figure || q.table ? 1 : 0}">
        <input type="checkbox" class="question-picker-check" value="${escH(q.id)}" ${allowed.has(String(q.id)) ? 'checked' : ''}>
        <div class="v6-pk-main">
          <div class="v6-pk-head"><span class="v6-pk-n">${i + 1}</span><b class="v6-pk-q">${escH(String(q.q || '').replace(/_{3,}/g, ' ....... '))}</b></div>
          <div class="v6-pk-tags"><span>${escH(g.questionTypeLabel(q.type))}</span>${q.levelCode ? `<span>${levelDots(q.levelCode)} ${escH(q.level || '')}</span>` : ''}${q.cognitive ? `<span>${escH(q.cognitive)}</span>` : ''}${q.skill ? `<span>${escH(q.skill)}</span>` : ''}${q.figure ? '<span>رسم</span>' : ''}${q.table ? '<span>جدول</span>' : ''}</div>
          <details class="v6-pk-details"><summary>عرض السؤال كاملًا والإجابة</summary>${previewHtml(q)}</details>
        </div>
        <button type="button" class="smallbtn question-edit-btn" data-edit-question="${escH(q.id)}">تعديل</button>
      </div>`).join('');
    $('questionPickerList').querySelectorAll('[data-edit-question]').forEach(b => b.onclick = e => { e.preventDefault(); e.stopPropagation(); g.openQuestionEdit(b.dataset.editQuestion); });
    const rows = [...$('questionPickerList').querySelectorAll('.v6-pk-row')];
    const applyFilter = () => {
      const s = ($('v6PkSearch').value || '').trim(), t = $('v6PkType').value, l = $('v6PkLevel').value, k = $('v6PkSkill').value, f = $('v6PkFig').checked, only = $('v6PkSel').checked;
      rows.forEach(r => {
        const show = (!s || r.querySelector('.v6-pk-q').textContent.includes(s)) && (!t || r.dataset.type === t) && (!l || r.dataset.level === l) &&
          (!k || r.dataset.skill === k) && (!f || r.dataset.fig === '1') && (!only || r.querySelector('.question-picker-check').checked);
        r.style.display = show ? '' : 'none';
      });
    };
    ['v6PkSearch', 'v6PkType', 'v6PkLevel', 'v6PkSkill', 'v6PkFig', 'v6PkSel'].forEach(id => { $(id).oninput = applyFilter; $(id).onchange = applyFilter; });
    $('v6PkShownOn').onclick = () => { rows.forEach(r => { if (r.style.display !== 'none') r.querySelector('.question-picker-check').checked = true; }); g.updateQuestionPickerCount(); };
    $('v6PkShownOff').onclick = () => { rows.forEach(r => { if (r.style.display !== 'none') r.querySelector('.question-picker-check').checked = false; }); g.updateQuestionPickerCount(); };
    g.updateQuestionPickerCount();
    $('questionPickerModal').classList.remove('hidden');
  };
  g.updateQuestionPickerCount = function () {
    const checks = [...document.querySelectorAll('#questionPickerList .question-picker-check')];
    const on = checks.filter(x => x.checked);
    if ($('questionPickerCount')) $('questionPickerCount').textContent = `الأسئلة المحددة: ${on.length} من ${checks.length}`;
    const mixBox = document.getElementById('v6PkMix');
    if (mixBox) {
      const m = {};
      on.forEach(c => { const row = c.closest('.v6-pk-row'); const lv = row?.dataset.level; if (lv) m[lv] = (m[lv] || 0) + 1; });
      mixBox.textContent = on.length ? `توزيع المحدد: سهل ${m[1] || 0} • متوسط ${m[2] || 0} • متقدم ${m[3] || 0}` : '';
    }
  };

  /* ================= طريقة اختيار الأسئلة في التكليف ================= */
  const MODE_KEY = 'sj_v6_question_mode';
  function pickerMode() { const r = document.querySelector('input[name="v6QMode"]:checked'); return r ? r.value : (localStorage.getItem(MODE_KEY) || 'teacher'); }
  function ensureModeBox() {
    if (document.getElementById('v6QModeBox')) return;
    const box = document.querySelector('#taskModal .task-lessons-box'); if (!box) return;
    const d = document.createElement('div'); d.id = 'v6QModeBox'; d.className = 'v6-qmode';
    d.innerHTML = `<b>طريقة اختيار الأسئلة</b>
      <label><input type="radio" name="v6QMode" value="teacher"> يختارها المعلم من بنك الدرس</label>
      <label><input type="radio" name="v6QMode" value="random"> عشوائيًا من بنك الدرس</label>
      <small id="v6QModeHint"></small>`;
    box.insertAdjacentElement('beforebegin', d);
    d.querySelectorAll('input').forEach(r => r.onchange = () => { try { localStorage.setItem(MODE_KEY, r.value); } catch (e) {} applyModeToRows(); });
  }
  function applyModeToRows() {
    const teacher = pickerMode() === 'teacher';
    const hint = document.getElementById('v6QModeHint');
    if (hint) hint.textContent = teacher
      ? 'فعّل الدرس ثم اضغط «اختيار الأسئلة» وحدد الأسئلة بنفسك؛ يظهر للطالب ما حددته فقط، ويُحسب العدد تلقائيًا.'
      : 'تُسحب الأسئلة عشوائيًا من بنك الدرس بالعدد الذي تكتبه لكل درس.';
    document.querySelectorAll('#taskLessonChoices .task-lesson-option').forEach(row => {
      const id = String(row.querySelector('.task-lesson-check')?.value || ''), n = row.querySelector('.task-lesson-count');
      const sel = explicitQuestionIds(id);
      if (n) { n.readOnly = teacher; n.title = teacher ? 'العدد = الأسئلة التي حددتها' : ''; if (teacher) n.value = String(sel ? sel.length : 0); }
      const btn = row.querySelector('.task-question-picker'); if (btn) btn.classList.toggle('v6-need', teacher && row.querySelector('.task-lesson-check')?.checked && !sel);
      const st = row.querySelector('.question-pick-status'); if (st) st.textContent = g.questionSelectionStatus(id);
    });
    updateTaskCountTotal();
  }
  const baseStatus = g.questionSelectionStatus;
  g.questionSelectionStatus = function (lessonId) {
    const explicit = explicitQuestionIds(lessonId), all = lessonQuestions(lessonId);
    if (explicit === null && pickerMode() === 'teacher') return `لم تُحدَّد أسئلة بعد (البنك ${all.length})`;
    if (explicit !== null) return `حددت ${explicit.length} من ${all.length} سؤالًا`;
    return baseStatus ? baseStatus(lessonId) : '';
  };
  const baseRenderChoices = g.renderTaskLessonChoices;
  g.renderTaskLessonChoices = function () {
    const r = baseRenderChoices.apply(this, arguments);
    ensureModeBox();
    document.querySelectorAll('#taskLessonChoices .task-lesson-check').forEach(c => c.addEventListener('change', applyModeToRows));
    applyModeToRows();
    return r;
  };
  const baseOpenTask = g.openTaskEditor;
  g.openTaskEditor = function (task) {
    ensureModeBox();
    const hasSel = task && Object.keys(g.normalizeQuestionSelections(task.questionSelections)).length > 0;
    const mode = task ? (hasSel ? 'teacher' : 'random') : (localStorage.getItem(MODE_KEY) || 'teacher');
    document.querySelectorAll('input[name="v6QMode"]').forEach(r => r.checked = r.value === mode);
    return baseOpenTask.apply(this, arguments);
  };
  const baseSavePicker = g.saveQuestionPickerSelection;
  g.saveQuestionPickerSelection = function () { const r = baseSavePicker.apply(this, arguments); applyModeToRows(); return r; };
  const baseResetPicker = g.resetQuestionPickerToFullBank;
  g.resetQuestionPickerToFullBank = function () { const r = baseResetPicker.apply(this, arguments); applyModeToRows(); return r; };
  const baseCreate = g.createTask;
  g.createTask = async function () {
    if (pickerMode() === 'teacher') {
      const missing = selectedTaskLessonIds().filter(id => !explicitQuestionIds(id));
      if (missing.length) { alert('اختر أسئلة هذه الدروس أولًا من زر «اختيار الأسئلة»:\n' + missing.map(id => '• ' + (LESSONS[id] || id)).join('\n')); return; }
      applyModeToRows();
    } else {
      // في الوضع العشوائي لا تُرسل اختيارات يدوية سابقة.
      selectedTaskLessonIds().forEach(id => { delete taskQuestionSelections[id]; });
    }
    return baseCreate.apply(this, arguments);
  };

  /* تعديل السؤال: الأنماط الجديدة يُعدَّل فيها النص والتفسير فقط */
  const baseOpenEdit = g.openQuestionEdit;
  g.openQuestionEdit = function (questionId) {
    baseOpenEdit.apply(this, arguments);
    const q = bank().find(x => String(x.id) === String(questionId));
    if (!q || !NEW_TYPES.includes(q.type)) return;
    $('questionEditOptionsWrap').classList.add('hidden');
    const ans = $('questionEditAnswer'); ans.disabled = true; ans.value = g.answerTextForQuestion(q);
    $('questionEditAnswerLabel').textContent = 'الإجابة الصحيحة';
    $('questionEditHelp').textContent = 'في هذا النمط (' + g.questionTypeLabel(q.type) + ') يمكن تعديل نص السؤال والتفسير، وتبقى الإجابات كما هي في البنك.';
  };
  const baseSaveEdit = g.saveQuestionEdit;
  g.saveQuestionEdit = async function () {
    const id = currentEditingQuestionId; if (!id) return;
    const data = refreshLessonCatalog(), q = (data.questions || []).find(x => String(x.id) === id);
    if (!q || !NEW_TYPES.includes(q.type)) return baseSaveEdit.apply(this, arguments);
    const text = String($('questionEditText').value || '').trim(); if (!text) { alert('نص السؤال لا يمكن أن يكون فارغًا.'); return; }
    const updated = { ...q, q: text, explain: String($('questionEditExplain').value || '').trim() };
    const btn = $('saveQuestionEdit');
    try {
      btn.disabled = true; btn.textContent = 'جارٍ الحفظ...';
      await apiAction('upsertQuestionOverride', { questionId: id, payload: JSON.stringify(updated) });
      const idx = data.questions.findIndex(x => String(x.id) === id);
      if (idx >= 0) data.questions[idx] = updated; else data.questions.push(updated);
      g.SCIENCE_DATA = data; questionOverridesLoaded = true;
      $('questionEditModal').classList.add('hidden');
      await g.openQuestionPicker(currentQuestionPickerLesson);
      alert('تم حفظ تعديل السؤال وسيظهر للطلاب في التكليفات.');
    } catch (e) { alert(e.message || e); }
    finally { btn.disabled = false; btn.textContent = 'حفظ تعديل السؤال'; }
  };

})();

/* إلغاء تصدير النتائج بصيغة CSV (بطلب المعلم) */
(function () {
  // الزر يبقى في الصفحة مخفيًا لأن تهيئة اللوحة تربطه عند التحميل؛ والدالة لا تفعل شيئًا.
  window.exportCsv = function () {};
})();
