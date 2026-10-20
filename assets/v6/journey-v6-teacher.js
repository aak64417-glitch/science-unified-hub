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

  /* قائمة اختيار الأسئلة: إظهار الرسم أو الجدول والمستوى */
  const basePicker = g.openQuestionPicker;
  g.openQuestionPicker = async function () {
    const r = await basePicker.apply(this, arguments);
    try {
      const map = new Map(bank().map(q => [String(q.id), q]));
      document.querySelectorAll('#questionPickerList .question-picker-row').forEach(row => {
        const q = map.get(String(row.querySelector('.question-picker-check')?.value)); if (!q) return;
        const small = row.querySelector('small'); if (!small || small.dataset.v6) return;
        small.dataset.v6 = '1';
        const extra = [q.level, q.figure ? 'يتضمن رسمًا' : '', q.table ? 'يتضمن جدولًا' : '', q.skill || ''].filter(Boolean);
        small.textContent = [g.questionTypeLabel(q.type), ...extra].join(' • ');
        if (q.figure) {
          const f = document.createElement('div'); f.className = 'v6-figure'; f.style.maxWidth = '340px'; f.style.margin = '8px 0 0';
          f.innerHTML = q.figure; small.insertAdjacentElement('afterend', f);
        }
      });
    } catch (e) { console.warn('V6 picker', e); }
    return r;
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
