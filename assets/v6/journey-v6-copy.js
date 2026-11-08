/* رحلة العلوم V6f — تكرار التكليف لفصول أخرى بنفس الأسئلة دون إعادة اختيارها */
(function () {
  'use strict';
  const g = window;
  const E = s => String(s ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  const $ = id => document.getElementById(id);
  const classesOf = gr => (GRADE_CLASSES && GRADE_CLASSES[gr]) || [];

  /* حمولة التكليف من حالة النموذج الحالية — نفس ما يرسله createTask تمامًا */
  function payloadFromForm(className) {
    const lessonIds = selectedTaskLessonIds();
    return {
      id: '', title: $('taskTitle').value.trim(), mode: $('taskMode').value, grade: $('taskGrade').value,
      lesson: JSON.stringify(lessonIds), lessonIds: JSON.stringify(lessonIds), lessonCounts: JSON.stringify(selectedTaskLessonCounts()),
      questionSelections: JSON.stringify(selectedTaskQuestionSelections()), excludedQuestionIds: JSON.stringify(selectedTaskExcludedQuestionIds()),
      className, count: updateTaskCountTotal(), timePerQuestion: $('taskTime').value, attempts: $('taskAttempts').value,
      startAt: $('taskStart').value, endAt: $('taskEnd').value
    };
  }

  const norm = v => { try { const o = typeof v === 'string' ? JSON.parse(v || '{}') : (v || {}); return JSON.stringify(Object.keys(o).sort().map(k => [k, Array.isArray(o[k]) ? o[k].map(String).sort() : o[k]])); } catch (e) { return String(v || ''); } };
  // يوجد في الفصل تكليف مطابق (نفس الاسم والدروس والأسئلة)؟
  const identicalIn = (p, cls) => tasks.some(t => normalizeClassName(t.className) === cls && String(t.title || '').trim() === p.title
    && norm(t.lessonIds || t.lesson) === norm(p.lessonIds) && norm(t.questionSelections) === norm(p.questionSelections));
  let busy = false;
  async function createCopies(classList, status) {
    const base = payloadFromForm('');
    let ok = 0, missing = false; const fail = [], skip = [];
    const seen = new Set();
    for (let i = 0; i < classList.length; i++) {
      const cls = classList[i];
      if (seen.has(cls)) continue;
      if (identicalIn(base, cls)) { skip.push(cls); continue; } // لا يُنشأ التكليف مرتين لنفس الفصل
      seen.add(cls);
      if (status) status(`جاري إنشاء التكليف للفصل ${cls} (${i + 1} من ${classList.length})...`);
      try {
        const res = await apiAction('createTask', { ...base, className: cls });
        if (res && res.task) tasks.unshift(res.task); else missing = true;
        ok++;
      } catch (e) { fail.push(cls + ': ' + (e.message || e)); }
    }
    if (missing) { try { await loadTeacher(); } catch (e) {} }
    renderTasks(); stats(); try { updatePortfolioTasks(); updateResultFilters(); saveTeacherCache(); } catch (e) {}
    return { ok, fail, skip };
  }

  /* ========== نافذة التكرار ========== */
  function ensureModal() {
    let m = $('v6CopyModal'); if (m) return m;
    m = document.createElement('div'); m.id = 'v6CopyModal'; m.className = 'modal hidden';
    m.innerHTML = `<div class="modal-card glass v6cp-card">
      <div class="section-head" style="margin-top:0"><div><h3>تكرار التكليف لفصول أخرى</h3><p id="v6cpInfo"></p></div><button id="v6cpClose" class="btn secondary">إغلاق</button></div>
      <div class="v6cp-acts"><button type="button" class="smallbtn" id="v6cpAll">تحديد الكل</button><button type="button" class="smallbtn" id="v6cpNone">إلغاء التحديد</button></div>
      <div id="v6cpList" class="v6cp-list"></div>
      <div id="v6cpStatus" class="note"></div>
      <div class="modal-actions"><button id="v6cpGo" class="btn">إنشاء التكليف للفصول المحددة</button></div></div>`;
    document.body.appendChild(m);
    $('v6cpClose').onclick = () => m.classList.add('hidden');
    $('v6cpAll').onclick = () => m.querySelectorAll('.v6cp-check:not(:disabled)').forEach(c => c.checked = true);
    $('v6cpNone').onclick = () => m.querySelectorAll('.v6cp-check').forEach(c => c.checked = false);
    return m;
  }

  function openCopy(taskId) {
    const t = tasks.find(x => String(x.id) === String(taskId)); if (!t) return;
    const m = ensureModal();
    const gr = taskGrade(t), src = normalizeClassName(t.className) || '';
    const has = c => tasks.some(x => x !== t && normalizeClassName(x.className) === c && String(x.title).trim() === String(t.title).trim());
    const list = classesOf(gr).filter(c => c !== src);
    $('v6cpInfo').innerHTML = `«<b>${E(t.title)}</b>» — ${E(taskLessonsLabel(t))}<br><small>تُنسخ نفس الدروس والأسئلة المحددة والنوع والزمن والمحاولات والتواريخ، ويُنشأ لكل فصل رابط مستقل.</small>`;
    $('v6cpList').innerHTML = list.map(c => `<label class="v6cp-item"><input type="checkbox" class="v6cp-check" value="${E(c)}" ${has(c) ? '' : 'checked'}><b>الفصل ${E(c)}</b>${has(c) ? '<small>يوجد له تكليف بنفس الاسم</small>' : ''}</label>`).join('') || '<p>لا توجد فصول أخرى لهذا الصف.</p>';
    $('v6cpStatus').textContent = '';
    const go = $('v6cpGo'); go.disabled = !list.length;
    go.onclick = async () => {
      const chosen = [...m.querySelectorAll('.v6cp-check:checked')].map(c => c.value);
      if (!chosen.length) { alert('اختر فصلًا واحدًا على الأقل.'); return; }
      if (busy || go.disabled) return;
      busy = true; go.disabled = true;
      // تعبئة النموذج من التكليف الأصلي لأخذ الأسئلة كما حُفظت، ثم إخفاؤه
      openTaskEditor(t); $('taskModal').classList.add('hidden'); window.__editingTaskId = '';
      try {
        const r = await createCopies(chosen, s => $('v6cpStatus').textContent = s);
        $('v6cpStatus').textContent = '';
        m.classList.add('hidden');
        alert(`تم إنشاء التكليف لـ ${r.ok} فصل بنفس الأسئلة.` + (r.skip.length ? `\nلم يُكرَّر للفصول ${r.skip.join('، ')} لأن التكليف نفسه موجود لها.` : '') + (r.fail.length ? `\nتعذر:\n${r.fail.join('\n')}` : ''));
      } finally { busy = false; go.disabled = false; }
    };
    m.classList.remove('hidden');
  }
  g.openTaskCopy = openCopy;

  /* زر في كل صف من جدول التكليفات */
  const baseRender = g.renderTasks;
  g.renderTasks = function () {
    const out = baseRender.apply(this, arguments);
    try {
      const rows = [...document.querySelectorAll('#tasksBody > tr')];
      if (rows.length === tasks.length) rows.forEach((tr, i) => {
        const td = tr.lastElementChild; if (!td || td.querySelector('[data-v6copy]')) return;
        const b = document.createElement('button');
        b.className = 'smallbtn copy v6cp-btn'; b.dataset.v6copy = tasks[i].id; b.textContent = 'تكرار لفصول أخرى';
        b.onclick = () => openCopy(b.dataset.v6copy);
        td.prepend(b, ' ');
      });
    } catch (e) { console.error(e); }
    return out;
  };

  /* خيار داخل نافذة الإنشاء: أنشئه أيضًا لفصول أخرى */
  function mountExtra() {
    let box = $('v6cpExtra');
    const cls = $('taskClass'); if (!cls) return;
    if (!box) {
      box = document.createElement('div'); box.id = 'v6cpExtra'; box.className = 'v6cp-extra';
      cls.closest('.field').insertAdjacentElement('afterend', box);
    }
    const editing = !!window.__editingTaskId;
    const cur = cls.value, list = classesOf($('taskGrade').value).filter(c => c !== cur);
    const prev = new Set([...box.querySelectorAll('input:checked')].map(c => c.value));
    box.classList.toggle('hidden', editing || !list.length);
    box.innerHTML = `<b>أنشئ نفس التكليف أيضًا للفصول:</b>` + list.map(c => `<label><input type="checkbox" value="${E(c)}" ${prev.has(c) ? 'checked' : ''}> ${E(c)}</label>`).join('')
      + `<button type="button" class="smallbtn" id="v6cpExtraAll">الكل</button><small>بنفس الأسئلة المحددة دون إعادة اختيارها، ولكل فصل رابطه.</small>`;
    $('v6cpExtraAll').onclick = () => box.querySelectorAll('input').forEach(c => c.checked = true);
  }
  const baseOpen = g.openTaskEditor;
  g.openTaskEditor = function () {
    const r = baseOpen.apply(this, arguments);
    const box = $('v6cpExtra'); if (box) box.innerHTML = '';
    mountExtra();
    return r;
  };
  document.addEventListener('change', e => { if (e.target && (e.target.id === 'taskClass' || e.target.id === 'taskGrade')) setTimeout(mountExtra, 0); });

  const baseCreate = g.createTask;
  g.createTask = async function () {
    if (busy) return; // منع الحفظ المزدوج عند الضغط مرتين
    busy = true;
    try { return await createImpl.apply(this, arguments); } finally { busy = false; }
  };
  async function createImpl() {
    const editing = !!window.__editingTaskId;
    const extra = editing ? [] : [...document.querySelectorAll('#v6cpExtra input:checked')].map(c => c.value).filter(c => c !== $('taskClass').value);
    if (!extra.length) return baseCreate.apply(this, arguments);
    const realAlert = g.alert; let msg = '';
    g.alert = m => { msg = String(m); };
    try { await baseCreate.apply(this, arguments); } finally { g.alert = realAlert; }
    if (!$('taskModal').classList.contains('hidden')) { if (msg) alert(msg); return; } // لم يُحفظ الأصل
    const r = await createCopies(extra);
    alert(`${msg}\nوأُنشئ نفس التكليف لـ ${r.ok} فصل إضافي.` + (r.fail.length ? `\nتعذر:\n${r.fail.join('\n')}` : ''));
  }

  const st = document.createElement('style');
  st.textContent = `.v6cp-card{max-width:560px}.v6cp-acts{display:flex;gap:8px;margin:6px 0 10px}
.v6cp-list{display:grid;gap:8px;margin-bottom:10px}
.v6cp-item{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;border:1.4px solid #D3E2E8;background:#fff;cursor:pointer;font-weight:700}
.v6cp-item input,.v6cp-extra input{width:20px;height:20px;accent-color:var(--v6-teal,#0F8B8D)}
.v6cp-item small{margin-inline-start:auto;color:#9A6B00}
.v6cp-extra{grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;padding:12px 14px;border-radius:14px;background:#EAF6F1;border:1.4px solid #A9D9C4;font-weight:700}
.v6cp-extra label{display:flex;align-items:center;gap:6px;cursor:pointer}
.v6cp-extra small{flex-basis:100%;color:#11593A;font-weight:600}
.v6cp-btn{background:#F4B63F!important;color:#16324F!important}`;
  document.head.appendChild(st);
})();
