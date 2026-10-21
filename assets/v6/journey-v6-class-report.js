/* رحلة عالم العلوم — التقرير الشامل لأداء طلاب الفصل (V6)
   يُبنى من نتائج الطلاب المحمّلة في لوحة المعلم، ويُطبع أو يُحفظ PDF لإضافته إلى ملف الإنجاز. */
(function () {
  if (window.__JOURNEY_V6_CLASS_REPORT__) return;
  window.__JOURNEY_V6_CLASS_REPORT__ = true;
  const g = window;
  const E = s => String(s ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  const pct = v => Math.round(Number(v) || 0);
  const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
  const T = { teacher: 'علي طاهر البقاشي', principal: 'فوزي محمد الهلال', school: 'مدرسة أبي الدرداء المتوسطة', year: '1448هـ' };
  const LEVELS = [['متميز', 90, '#1E9E5A'], ['متقن', 80, '#0F8B8D'], ['جيد', 70, '#3A7BD5'], ['يحتاج تعزيزًا بسيطًا', 60, '#F4B63F'], ['يحتاج خطة علاجية', 0, '#D1495B']];
  const levelOf = p => LEVELS.find(l => p >= l[1]) || LEVELS[LEVELS.length - 1];
  const TYPE = { training: 'تدريب', test: 'اختبار', exam: 'اختبار', remedial: 'علاجي', enrich: 'إثراء' };
  const gradeOfClass = c => String(c || '').endsWith('/3') ? '3' : '1';
  const gradeName = gr => gr === '3' ? 'الصف الثالث المتوسط' : 'الصف الأول المتوسط';
  const nameKey = n => (typeof normalizeStudentNameKey === 'function' ? normalizeStudentNameKey(n) : String(n || '').trim());
  const fmtDate = v => { const d = new Date(v); return Number.isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(d); };
  const fmtShort = v => { const d = new Date(v); return Number.isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'short' }).format(d); };

  /* ---------------- واجهة التبويب ---------------- */
  function mountTab() {
    const tabs = document.querySelector('.tabs'); const portfolio = document.getElementById('portfolioTab');
    if (!tabs || !portfolio || document.getElementById('classreportTab')) return;
    const b = document.createElement('button'); b.className = 'tab'; b.dataset.tab = 'classreport'; b.textContent = 'التقرير الشامل للفصل';
    tabs.appendChild(b);
    const sec = document.createElement('section'); sec.id = 'classreportTab'; sec.className = 'panel glass hidden';
    sec.innerHTML = `
      <div class="section-head" style="margin-top:0"><div><h3>التقرير الشامل لأداء طلاب الفصل</h3>
      <p>تقرير لكل فصل من نتائج الطلاب الفعلية: المشاركة، ومستويات الأداء، ونتائج كل تكليف، وتطور الأداء، والمتميزون، والمحتاجون إلى خطة علاجية. اطبعه أو احفظه PDF لإضافته إلى ملف الإنجاز.</p></div></div>
      <div class="v6cr-controls">
        <div class="field"><label>الفصل</label><select id="v6crClass"></select></div>
        <div class="field"><label>من تاريخ</label><select id="v6crFrom"><option value="">من البداية</option></select></div>
        <div class="field"><label>إلى تاريخ</label><select id="v6crTo"><option value="">حتى اليوم</option></select></div>
        <div class="field"><label>نوع النشاط</label><select id="v6crType"><option value="">الكل</option><option value="training">تدريب</option><option value="test">اختبار</option><option value="remedial">علاجي</option><option value="enrich">إثراء</option></select></div>
        <div class="field"><label>المعيار في ملف الإنجاز (اختياري)</label><input id="v6crStandard" placeholder="يُطبع كما تكتبه"></div>
        <div class="field"><label>رقم الشاهد (اختياري)</label><input id="v6crEvidence" placeholder="يُطبع كما تكتبه"></div>
        <div class="field v6cr-wide"><label>ملاحظات المعلم (اختياري، تظهر في التقرير)</label><textarea id="v6crNotes" rows="2" placeholder="مثال: الإجراءات التي نُفذت مع الفصل"></textarea></div>
        <label class="v6cr-chk"><input type="checkbox" id="v6crHideAbsent"> عدم ذكر أسماء غير المشاركين (يُذكر عددهم فقط)</label>
      </div>
      <div id="v6crTasks" class="v6cr-tasks"></div>
      <div class="modal-actions" style="justify-content:flex-start"><button id="v6crBuild" class="btn">إنشاء التقرير الشامل</button><button id="v6crBuildOne" class="btn secondary">تقرير صفحة واحدة بدون أسماء (ملف الإنجاز)</button></div>
      <div id="v6crStatus" class="note good" style="margin-top:10px">اختر الفصل لعرض الأنشطة المشمولة.</div>`;
    portfolio.insertAdjacentElement('afterend', sec);
    const sel = sec.querySelector('#v6crClass');
    sel.innerHTML = (typeof CLASSES !== 'undefined' ? CLASSES : []).map(c => `<option>${E(c)}</option>`).join('');
    ['v6crClass', 'v6crFrom', 'v6crTo', 'v6crType'].forEach(id => sec.querySelector('#' + id).addEventListener('change', renderTaskChoices));
    sec.querySelector('#v6crBuild').onclick = () => buildReport('full');
    sec.querySelector('#v6crBuildOne').onclick = () => buildReport('one');
  }

  const baseSwitch = g.switchTab;
  g.switchTab = function (tab) {
    const mine = document.getElementById('classreportTab');
    if (tab === 'classreport') {
      document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x.dataset.tab === tab));
      ['tasks', 'participation', 'results', 'students', 'portfolio'].forEach(x => document.getElementById(x + 'Tab')?.classList.add('hidden'));
      mine?.classList.remove('hidden');
      renderTaskChoices();
      return;
    }
    mine?.classList.add('hidden');
    return baseSwitch.apply(this, arguments);
  };

  /* ---------------- الأنشطة المحذوفة من التقارير ----------------
     تُحفظ في الخادم ضمن تعديلات البنك بمعرّف خاص (لا يطابق أي سؤال فيُتجاهل في عرض الأسئلة)،
     ومعها نسخة على الجهاز احتياطًا. */
  const EXC_ID = '__v6_report_excluded__', EXC_LS = 'sj_v6_cr_excluded';
  let excluded = new Set();
  try { JSON.parse(localStorage.getItem(EXC_LS) || '[]').forEach(k => excluded.add(k)); } catch (e) {}
  async function loadExcluded() {
    try {
      const r = await jsonp({ action: 'getQuestionOverrides' });
      const it = (r?.overrides || []).filter(x => String(x?.questionId) === EXC_ID).pop();
      let p = it?.payload; if (typeof p === 'string') { try { p = JSON.parse(p); } catch (e) { p = null; } }
      if (p && Array.isArray(p.keys)) { excluded = new Set(p.keys); try { localStorage.setItem(EXC_LS, JSON.stringify(p.keys)); } catch (e) {} refreshAll(); }
    } catch (e) {}
  }
  async function saveExcluded() {
    const keys = [...excluded];
    try { localStorage.setItem(EXC_LS, JSON.stringify(keys)); } catch (e) {}
    try { await apiAction('upsertQuestionOverride', { questionId: EXC_ID, payload: JSON.stringify({ keys, updatedAt: new Date().toISOString() }) }); return true; }
    catch (e) { console.warn(e); return false; }
  }
  // تكليف عنوانه اسم طالب (مثل «علي» أو «محمد») يُعد تجريبيًا ولا يدخل التقارير.
  function studentNameSet() {
    const set = new Set();
    const add = n => { n = String(n || '').trim().replace(/\s+/g, ' '); if (!n) return; set.add(n); set.add(n.split(' ')[0]); };
    (results || []).forEach(r => add(r.studentName));
    if (typeof studentRoster !== 'undefined' && studentRoster) Object.values(studentRoster).forEach(l => Array.isArray(l) && l.forEach(s => add(s.name)));
    return set;
  }
  let nameCache = null, nameCacheLen = -1;
  function isNameTitle(t) {
    if ((results || []).length !== nameCacheLen) { nameCache = studentNameSet(); nameCacheLen = (results || []).length; }
    t = String(t || '').trim().replace(/\s+/g, ' ');
    return !!t && nameCache.has(t);
  }
  function groupTitle(r) { const task = r.taskId ? taskById(r.taskId) : null; return task?.title || resultTitle(r); }
  const isExcluded = r => excluded.has(groupKey(r)) || isNameTitle(groupTitle(r));
  function refreshAll() {
    try { if (document.getElementById('classreportTab') && !document.getElementById('classreportTab').classList.contains('hidden')) renderTaskChoices(); } catch (e) {}
    try { if (typeof g.renderTasks === 'function' && Array.isArray(tasks)) g.renderTasks(); } catch (e) {}
  }

  /* ---------------- البيانات ---------------- */
  function filters() {
    return {
      cls: document.getElementById('v6crClass').value,
      from: document.getElementById('v6crFrom').value,
      to: document.getElementById('v6crTo').value,
      type: document.getElementById('v6crType').value
    };
  }
  function classResults(f) {
    const from = f.from ? new Date(f.from + 'T00:00:00').getTime() : -Infinity;
    const to = f.to ? new Date(f.to + 'T23:59:59').getTime() : Infinity;
    return (Array.isArray(results) ? results : []).filter(r => {
      if (r.className !== f.cls) return false;
      if (isExcluded(r)) return false;
      const t = new Date(resultTime(r)).getTime();
      if (Number.isFinite(t) && (t < from || t > to)) return false;
      const ty = String(r.type || 'training') === 'exam' ? 'test' : String(r.type || 'training');
      if (f.type && ty !== f.type) return false;
      return true;
    });
  }
  const groupKey = r => r.taskId ? 'id:' + r.taskId : 't:' + resultTitle(r);
  function groupsOf(rows) {
    const m = new Map();
    rows.forEach(r => {
      const k = groupKey(r);
      if (!m.has(k)) {
        const task = r.taskId ? taskById(r.taskId) : null;
        m.set(k, { key: k, task, title: task?.title || resultTitle(r), type: String(task?.mode || r.type || 'training'), rows: [] });
      }
      m.get(k).rows.push(r);
    });
    return [...m.values()].sort((a, b) => Math.min(...a.rows.map(x => +new Date(resultTime(x)) || 0)) - Math.min(...b.rows.map(x => +new Date(resultTime(x)) || 0)));
  }
  function dayKey(v) { const d = new Date(v); if (Number.isNaN(d.getTime())) return ''; return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
  function fillDateOptions(cls) {
    const days = [...new Set((results || []).filter(r => r.className === cls && !isExcluded(r)).map(r => dayKey(resultTime(r))).filter(Boolean))].sort();
    [['v6crFrom', 'من البداية'], ['v6crTo', 'حتى اليوم']].forEach(([id, first]) => {
      const el = document.getElementById(id); if (!el) return;
      const cur = el.value;
      el.innerHTML = `<option value="">${first}</option>` + days.map(d => `<option value="${d}">${E(fmtDate(d + 'T12:00:00'))}</option>`).join('');
      el.value = days.includes(cur) ? cur : '';
    });
  }
  let lastDateCls = null;
  function renderTaskChoices() {
    const box = document.getElementById('v6crTasks'); if (!box) return;
    const clsNow = document.getElementById('v6crClass')?.value;
    if (clsNow !== lastDateCls || !document.getElementById('v6crFrom').options.length) { lastDateCls = clsNow; fillDateOptions(clsNow); }
    const f = filters(), groups = groupsOf(classResults(f));
    if (!(results || []).length) { box.innerHTML = ''; setStatus('حمّل لوحة المعلم بمفتاح المعلم أولًا حتى تظهر النتائج.'); return; }
    if (!groups.length) { box.innerHTML = ''; setStatus(`لا توجد نتائج للفصل ${f.cls} في الفترة المحددة.`); return; }
    box.innerHTML = '<b>الأنشطة المشمولة في التقرير</b><div class="v6cr-task-list">' + groups.map(gr =>
      `<label><input type="checkbox" value="${E(gr.key)}" checked> ${E(gr.title)} <small>${E(TYPE[gr.type] || gr.type)} • ${gr.rows.length} محاولة</small><button type="button" class="v6cr-x" data-exclude="${E(gr.key)}" data-title="${E(gr.title)}" title="حذف هذا النشاط من التقارير نهائيًا">✕</button></label>`).join('') + '</div>'
      + (excluded.size ? `<div class="v6cr-excl">محذوف من التقارير: ${excluded.size} نشاطًا <button type="button" class="v6cr-link" id="v6crRestore">استعادتها</button></div>` : '');
    box.querySelectorAll('[data-exclude]').forEach(b => b.onclick = async e => {
      e.preventDefault(); e.stopPropagation();
      const title = b.dataset.title || '';
      if (!confirm(`حذف «${title}» من جميع تقارير الفصول نهائيًا؟\n(لا تُحذف نتائج الطلاب من قاعدة البيانات، لكنها لا تظهر في التقارير.)`)) return;
      excluded.add(b.dataset.exclude);
      const ok = await saveExcluded();
      if (!ok) alert('حُذف النشاط من التقارير على هذا الجهاز فقط؛ تعذر حفظه في الخادم الآن.');
      refreshAll();
    });
    const rs = document.getElementById('v6crRestore');
    if (rs) rs.onclick = async () => { if (!confirm('إعادة جميع الأنشطة المحذوفة إلى التقارير؟')) return; excluded.clear(); await saveExcluded(); refreshAll(); };
    setStatus(`${groups.length} نشاطًا و${classResults(f).length} محاولة للفصل ${f.cls}.`, true);
  }
  function setStatus(t, good) { const s = document.getElementById('v6crStatus'); if (s) { s.textContent = t; s.className = good ? 'note good' : 'note'; } }

  async function rosterFor(cls) {
    let list = (typeof studentRoster !== 'undefined' && Array.isArray(studentRoster?.[cls])) ? studentRoster[cls] : [];
    if (!list.length) {
      try { const r = await jsonp({ action: 'getStudents', className: cls }); if (r?.ok && Array.isArray(r.students)) list = r.students.map(s => ({ code: String(s.code), name: String(s.name) })); } catch (e) {}
    }
    return list;
  }

  /* ---------------- الرسوم ---------------- */
  function hbars(items, max = 100, unit = '%') {
    const W = 520, rowH = 30, L = 170, H = items.length * rowH + 10;
    return `<svg viewBox="0 0 ${W} ${H}" class="v6cr-svg" role="img">` + items.map((it, i) => {
      const y = 6 + i * rowH, w = Math.max(2, (W - L - 50) * (it.v / (max || 1)));
      return `<text x="${W - 4}" y="${y + 18}" text-anchor="start" font-size="12.5" font-weight="700" fill="#16324F" direction="rtl">${E(it.label.length > 26 ? it.label.slice(0, 25) + '…' : it.label)}</text>
        <rect x="${W - L - w}" y="${y + 4}" width="${w}" height="18" rx="5" fill="${it.color || '#0F8B8D'}"/>
        <text x="${W - L - w - 6}" y="${y + 18}" text-anchor="end" font-size="12" font-weight="800" fill="#16324F">${it.text ?? (Math.round(it.v) + unit)}</text>`;
    }).join('') + '</svg>';
  }
  function donut(parts) {
    const total = parts.reduce((s, p) => s + p.v, 0) || 1, R = 70, r = 42, cx = 90, cy = 90;
    let a0 = -Math.PI / 2, paths = '';
    parts.forEach(p => {
      if (!p.v) return;
      const a1 = a0 + 2 * Math.PI * p.v / total, large = a1 - a0 > Math.PI ? 1 : 0;
      const P = (rad, a) => `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
      paths += p.v === total ? `<circle cx="${cx}" cy="${cy}" r="${(R + r) / 2}" fill="none" stroke="${p.color}" stroke-width="${R - r}"/>`
        : `<path d="M${P(R, a0)} A${R},${R} 0 ${large} 1 ${P(R, a1)} L${P(r, a1)} A${r},${r} 0 ${large} 0 ${P(r, a0)} Z" fill="${p.color}"/>`;
      a0 = a1;
    });
    const legend = parts.map((p, i) => `<g transform="translate(200,${22 + i * 28})"><rect x="250" y="-12" width="14" height="14" rx="3" fill="${p.color}"/>
      <text x="242" y="0" text-anchor="start" font-size="13" font-weight="700" fill="#16324F" direction="rtl">${E(p.label)}: ${p.v}</text></g>`).join('');
    return `<svg viewBox="0 0 470 180" class="v6cr-svg" role="img">${paths}<text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="18" font-weight="800" fill="#16324F">${total}</text>${legend}</svg>`;
  }
  function trendLine(points) {
    if (points.length < 2) return '<p class="v6cr-muted">يظهر منحنى تطور الأداء عند وجود نتائج في أسبوعين مختلفين على الأقل.</p>';
    const W = 520, H = 220, L = 40, B = 34, R = 14, Tp = 14, pw = W - L - R, ph = H - B - Tp;
    const X = i => L + (points.length === 1 ? pw / 2 : i * pw / (points.length - 1)), Y = v => Tp + ph - v / 100 * ph;
    let s = '';
    [0, 20, 40, 60, 80, 100].forEach(v => { s += `<line x1="${L}" y1="${Y(v)}" x2="${L + pw}" y2="${Y(v)}" stroke="#E4EEF2"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="#5E7384">${v}</text>`; });
    s += `<line x1="${L}" y1="${Y(80)}" x2="${L + pw}" y2="${Y(80)}" stroke="#1E9E5A" stroke-dasharray="5 4"/>`;
    s += `<polyline points="${points.map((p, i) => `${X(i)},${Y(p.v)}`).join(' ')}" fill="none" stroke="#0F8B8D" stroke-width="3"/>`;
    points.forEach((p, i) => { s += `<circle cx="${X(i)}" cy="${Y(p.v)}" r="4.5" fill="#fff" stroke="#0F8B8D" stroke-width="2.5"/><text x="${X(i)}" y="${Y(p.v) - 9}" text-anchor="middle" font-size="11" font-weight="800" fill="#16324F">${Math.round(p.v)}%</text><text x="${X(i)}" y="${H - 12}" text-anchor="middle" font-size="10.5" fill="#5E7384">${E(p.label)}</text>`; });
    return `<svg viewBox="0 0 ${W} ${H}" class="v6cr-svg" role="img">${s}</svg>`;
  }

  /* ---------------- بناء التقرير ---------------- */
  let last = null;
  async function buildReport(mode) {
    mode = mode === 'one' ? 'one' : 'full';
    const f = filters();
    const chosen = new Set([...document.querySelectorAll('#v6crTasks input:checked')].map(x => x.value));
    const rows = classResults(f).filter(r => chosen.has(groupKey(r)));
    if (!rows.length) { alert('لا توجد نتائج مشمولة. اختر الفصل والأنشطة أولًا.'); return; }
    const btns = ['v6crBuild', 'v6crBuildOne'].map(id => document.getElementById(id)).filter(Boolean);
    btns.forEach(b => { b.disabled = true; b.dataset.txt = b.dataset.txt || b.textContent; b.textContent = 'جارٍ إعداد التقرير...'; });
    try {
      const roster = await rosterFor(f.cls);
      last = { f, rows, roster };
      showReport(mode);
    } catch (e) { console.error(e); alert('تعذر إنشاء التقرير: ' + (e.message || e)); }
    finally { btns.forEach(b => { b.disabled = false; b.textContent = b.dataset.txt; }); }
  }
  function showReport(mode) {
    if (!last) return;
    const { f, rows, roster } = last;
    $('reportModalTitle').textContent = (mode === 'one' ? 'تقرير ملف الإنجاز (صفحة واحدة) — الفصل ' : 'التقرير الشامل لأداء طلاب الفصل ') + f.cls;
    const paper = $('reportPaper');
    paper.classList.remove('student-portfolio-paper'); paper.classList.add('v6cr-paper');
    paper.classList.toggle('v6cr-paper-one', mode === 'one');
    paper.innerHTML = reportHtml(f, rows, roster, mode);
    $('shareReport')?.classList.add('hidden');
    addArchiveButton(f, mode);
    $('reportModal').classList.remove('hidden');
    if (mode === 'one') { fitOnePage(); document.fonts?.ready?.then(fitOnePage); }
  }

  function reportHtml(f, rows, roster, mode) {
    const grade = gradeOfClass(f.cls);
    // الطلاب: من قائمة الفصل، مع إضافة من ظهر في النتائج ولم يكن في القائمة.
    const students = new Map();
    roster.forEach(s => students.set('c:' + s.code, { key: 'c:' + s.code, code: String(s.code), name: s.name, nk: nameKey(s.name), rows: [] }));
    rows.forEach(r => {
      let st = r.studentCode && students.get('c:' + r.studentCode);
      if (!st) st = [...students.values()].find(s => s.nk && s.nk === nameKey(r.studentName));
      if (!st) { const k = 'n:' + nameKey(r.studentName); st = students.get(k) || { key: k, code: String(r.studentCode || ''), name: r.studentName, nk: nameKey(r.studentName), rows: [] }; students.set(k, st); }
      st.rows.push(r);
    });
    const groups = groupsOf(rows);
    const all = [...students.values()];
    all.forEach(st => {
      st.rows.sort((a, b) => (+new Date(resultTime(a)) || 0) - (+new Date(resultTime(b)) || 0));
      st.best = {}; groups.forEach(gr => { const mine = st.rows.filter(r => groupKey(r) === gr.key).map(r => resultPercent(r)); if (mine.length) st.best[gr.key] = Math.max(...mine); });
      const bests = Object.values(st.best);
      st.avg = bests.length ? mean(bests) : null;
      st.attempts = st.rows.length;
      st.first = st.rows.length ? resultPercent(st.rows[0]) : null;
      st.last = st.rows.length ? resultPercent(st.rows[st.rows.length - 1]) : null;
      st.improve = st.rows.length > 1 ? st.last - st.first : null;
      st.done = bests.length;
    });
    const part = all.filter(s => s.attempts), absent = all.filter(s => !s.attempts);
    const N = all.length, P = part.length;
    const classAvg = mean(part.map(s => s.avg));
    const mastery = P ? part.filter(s => s.avg >= 80).length / P * 100 : 0;
    const impr = part.filter(s => s.improve !== null).map(s => s.improve);
    const gstats = groups.map(gr => {
      const per = all.map(s => s.best[gr.key]).filter(v => v !== undefined);
      return { ...gr, participants: per.length, rate: N ? per.length / N * 100 : 0, attempts: gr.rows.length, avg: mean(per), max: per.length ? Math.max(...per) : 0, min: per.length ? Math.min(...per) : 0, mastery: per.length ? per.filter(v => v >= 80).length / per.length * 100 : 0, lessons: gr.task && typeof taskLessonsLabel === 'function' ? taskLessonsLabel(gr.task) : '' };
    });
    const lv = LEVELS.map(l => ({ label: l[0], color: l[2], v: part.filter(s => levelOf(s.avg)[0] === l[0]).length }));
    // تطور الأداء أسبوعيًا
    const weeks = new Map();
    rows.forEach(r => { const d = new Date(resultTime(r)); if (Number.isNaN(d.getTime())) return; const s = new Date(d); s.setDate(d.getDate() - d.getDay()); s.setHours(0, 0, 0, 0); const k = +s; if (!weeks.has(k)) weeks.set(k, []); weeks.get(k).push(resultPercent(r)); });
    const trend = [...weeks.entries()].sort((a, b) => a[0] - b[0]).map(([k, v]) => ({ label: 'أسبوع ' + fmtShort(k), v: mean(v) }));
    // المهارات
    const skillMap = new Map(); let skillRows = 0;
    rows.forEach(r => {
      const raw = String(r.skills || ''); if (!raw) return; skillRows++;
      raw.split(';').forEach(p => { const [lid, cid, c, t] = p.split('|'); if (!lid || !t) return; const k = lid + '|' + cid; const o = skillMap.get(k) || { lid, cid, c: 0, t: 0 }; o.c += +c || 0; o.t += +t || 0; skillMap.set(k, o); });
    });
    const conceptName = (lid, cid) => { const l = (g.SCIENCE_DATA?.lessons || []).find(x => x.id === lid); return l?.concepts?.find(c => c.id === cid)?.name || cid; };
    const lessonTitle = lid => (g.SCIENCE_DATA?.lessons || []).find(x => x.id === lid)?.title || lid;
    const skills = [...skillMap.values()].filter(s => s.t >= 2).map(s => ({ ...s, p: s.c / s.t * 100, name: conceptName(s.lid, s.cid), lesson: lessonTitle(s.lid) })).sort((a, b) => a.p - b.p);
    const weakFreq = new Map();
    if (!skills.length) rows.forEach(r => String(r.weakConcepts || '').split(/[،,]/).map(x => x.trim()).filter(x => x && x !== '—').forEach(w => weakFreq.set(w, (weakFreq.get(w) || 0) + 1)));
    const ranked = part.slice().sort((a, b) => b.avg - a.avg || b.done - a.done);
    const honor = ranked.filter(s => s.avg >= 80).slice(0, 8);
    const remedial = ranked.filter(s => s.avg < 60 || Object.values(s.best).some(v => v < 60)).reverse();
    const improvers = part.filter(s => s.improve > 0).sort((a, b) => b.improve - a.improve).slice(0, 5);
    const times = rows.map(r => +new Date(resultTime(r))).filter(Number.isFinite);
    const range = f.from || f.to ? `${f.from ? fmtDate(f.from) : 'البداية'} – ${f.to ? fmtDate(f.to) : 'اليوم'}` : (times.length ? `${fmtDate(Math.min(...times))} – ${fmtDate(Math.max(...times))}` : '');
    const hide = document.getElementById('v6crHideAbsent').checked;
    const notes = document.getElementById('v6crNotes').value.trim();
    const standard = document.getElementById('v6crStandard').value.trim();
    const evidence = document.getElementById('v6crEvidence').value.trim();

    // قراءة تحليلية من الأرقام
    const insights = [];
    insights.push(`شارك ${P} من ${N} طالبًا (${pct(N ? P / N * 100 : 0)}%) في ${groups.length} نشاطًا، بإجمالي ${rows.length} محاولة، أي ${P ? (rows.length / P).toFixed(1) : 0} محاولة للطالب في المتوسط.`);
    insights.push(`بلغ متوسط أداء الفصل ${pct(classAvg)}%، ووصل ${pct(mastery)}% من المشاركين إلى مستوى الإتقان (80% فأكثر).`);
    if (gstats.length > 1) {
      const firstG = gstats[0], lastG = gstats[gstats.length - 1], d = lastG.avg - firstG.avg;
      insights.push(`كان متوسط أول نشاط «${firstG.title}» ${pct(firstG.avg)}%، ومتوسط آخر نشاط «${lastG.title}» ${pct(lastG.avg)}% (${d >= 0 ? 'ارتفاع' : 'انخفاض'} ${Math.abs(pct(d))} نقطة).`);
      const best = gstats.slice().sort((a, b) => b.avg - a.avg)[0], worst = gstats.slice().sort((a, b) => a.avg - b.avg)[0];
      if (best.key !== worst.key) insights.push(`أعلى متوسط في «${best.title}» (${pct(best.avg)}%)، وأدناه في «${worst.title}» (${pct(worst.avg)}%).`);
    }
    if (impr.length) {
      const mi = pct(mean(impr));
      insights.push(mi > 0 ? `من أعاد المحاولة (${impr.length} طالبًا) تحسّن أداؤه بمتوسط ${mi} نقطة بين أول محاولة وآخر محاولة.`
        : `لم يظهر تحسن واضح لدى من أعاد المحاولة (${impr.length} طالبًا) بين أول محاولة وآخر محاولة.`);
    }
    if (skills.length) insights.push(`أضعف المهارات: ${skills.slice(0, 3).map(s => `${s.name} (${pct(s.p)}%)`).join('، ')}.`);
    const recs = [];
    if (remedial.length) recs.push(`تنفيذ خطة علاجية لـ ${remedial.length} طالبًا لم يحققوا 60% في نشاط واحد على الأقل، بتكليف «علاجي» على الدروس الأضعف.`);
    if (skills.length) recs.push(`إعادة شرح المهارات الأضعف (${skills.slice(0, 3).map(s => s.name).join('، ')}) ثم تكليف تدريب قصير عليها.`);
    if (N && P / N < 0.8) recs.push(`رفع نسبة المشاركة بالتواصل مع ${absent.length} طالبًا لم يشاركوا وأولياء أمورهم.`);
    if (honor.length) recs.push(`تكليف المتميزين (${honor.length} طالبًا) بنشاط إثرائي، وتكريمهم.`);
    if (!recs.length) recs.push('الاستمرار في التكليفات الدورية مع متابعة الطلاب الأقل أداءً.');

    const kpi = (v, l, c = '') => `<div class="v6cr-kpi ${c}"><b>${v}</b><span>${l}</span></div>`;
    if (mode === 'one') return onePageHtml({ f, grade, rows, groups, gstats, N, P, classAvg, mastery, impr, lv, trend, skills, weakFreq, honor, remedial, improvers, absent, range, notes, standard, evidence, insights, recs, kpi });
    const studentRows = all.slice().filter(s => !hide || s.attempts)
      .sort((a, b) => (b.avg ?? -1) - (a.avg ?? -1) || String(a.name).localeCompare(String(b.name), 'ar')).map((s, i) => {
      if (!s.attempts) return `<tr class="v6cr-absent"><td>${i + 1}</td><td>${E(s.name)}</td><td colspan="7">لم يشارك</td></tr>`;
      const lvl = levelOf(s.avg);
      return `<tr><td>${i + 1}</td><td>${E(s.name)}</td><td>${s.done}/${groups.length}</td><td>${s.attempts}</td><td>${pct(s.first)}%</td><td>${pct(s.last)}%</td><td><b>${pct(s.avg)}%</b></td><td class="${s.improve > 0 ? 'up' : s.improve < 0 ? 'down' : ''}">${s.improve === null ? '—' : '<bdi dir="ltr">' + (s.improve > 0 ? '+' : '') + pct(s.improve) + '</bdi>'}</td><td><span class="v6cr-lv" style="background:${lvl[2]}">${lvl[0]}</span></td></tr>`;
    }).join('');

    return `<div class="v6cr" dir="rtl">
      <header class="v6cr-head">
        <div><div class="v6cr-eyebrow">منصة رحلة عالم العلوم • ${E(T.school)}</div>
        <h1>التقرير الشامل لأداء طلاب الفصل ${E(f.cls)}</h1>
        <p>مادة العلوم • ${gradeName(grade)} • العام الدراسي ${T.year}${f.type ? ' • ' + E(TYPE[f.type]) : ''}</p>
        <p>الفترة: ${E(range)} • تاريخ الإصدار: ${E(fmtDate(Date.now()))}</p></div>
        <div class="v6cr-badge"><b>${pct(classAvg)}%</b><span>متوسط الفصل</span></div>
      </header>

      <section class="v6cr-kpis">
        ${kpi(N, 'طلاب الفصل')}${kpi(P, 'شاركوا')}${kpi(pct(N ? P / N * 100 : 0) + '%', 'نسبة المشاركة')}${kpi(rows.length, 'المحاولات')}
        ${kpi(groups.length, 'الأنشطة')}${kpi(pct(classAvg) + '%', 'متوسط الأداء', 'main')}${kpi(pct(mastery) + '%', 'نسبة الإتقان (80%+)')}${kpi(impr.length ? '<bdi dir="ltr">' + (pct(mean(impr)) > 0 ? '+' : '') + pct(mean(impr)) + '</bdi>' : '—', 'متوسط التحسن')}
      </section>

      <section class="v6cr-sec"><h2>قراءة في النتائج</h2><ul class="v6cr-ins">${insights.map(x => `<li>${E(x)}</li>`).join('')}</ul></section>

      <section class="v6cr-grid">
        <div class="v6cr-card"><h3>توزيع الطلاب على مستويات الأداء</h3>${donut(lv)}</div>
        <div class="v6cr-card"><h3>متوسط الأداء في كل نشاط</h3>${hbars(gstats.map(x => ({ label: x.title, v: x.avg, color: levelOf(x.avg)[2] })))}</div>
        <div class="v6cr-card"><h3>نسبة المشاركة في كل نشاط</h3>${hbars(gstats.map(x => ({ label: x.title, v: x.rate, color: '#3A7BD5', text: `${x.participants}/${N}` })))}</div>
        <div class="v6cr-card"><h3>تطور متوسط الأداء أسبوعيًا</h3>${trendLine(trend)}</div>
      </section>

      <section class="v6cr-sec"><h2>نتائج الأنشطة</h2>
        <table class="v6cr-table"><thead><tr><th>#</th><th>النشاط</th><th>النوع</th><th>الدروس</th><th>المشاركون</th><th>المحاولات</th><th>المتوسط</th><th>الأعلى</th><th>الأدنى</th><th>الإتقان</th></tr></thead>
        <tbody>${gstats.map((x, i) => `<tr><td>${i + 1}</td><td><b>${E(x.title)}</b></td><td>${E(TYPE[x.type] || x.type)}</td><td>${E(x.lessons || '—')}</td><td>${x.participants}/${N}</td><td>${x.attempts}</td><td><b>${pct(x.avg)}%</b></td><td>${pct(x.max)}%</td><td>${pct(x.min)}%</td><td>${pct(x.mastery)}%</td></tr>`).join('')}</tbody></table>
      </section>

      ${skills.length ? `<section class="v6cr-sec"><h2>تحليل المهارات</h2>
        <div class="v6cr-grid two"><div class="v6cr-card"><h3>المهارات الأضعف</h3>${hbars(skills.slice(0, 8).map(s => ({ label: s.name, v: s.p, color: levelOf(s.p)[2] })))}</div>
        <div class="v6cr-card"><h3>المهارات الأقوى</h3>${hbars(skills.slice().reverse().slice(0, 8).map(s => ({ label: s.name, v: s.p, color: levelOf(s.p)[2] })))}</div></div>
        <p class="v6cr-muted">مبني على ${skillRows} محاولة تضمنت تفاصيل الإجابات.</p></section>`
        : weakFreq.size ? `<section class="v6cr-sec"><h2>المفاهيم التي تحتاج تعزيزًا</h2><ul class="v6cr-chips">${[...weakFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([w, n]) => `<li>${E(w)} <b>${n}</b></li>`).join('')}</ul></section>` : ''}

      <section class="v6cr-grid two">
        <div class="v6cr-card honor"><h3>🏅 لوحة التميز</h3>${honor.length ? `<ol>${honor.map(s => `<li>${E(s.name)} <b>${pct(s.avg)}%</b></li>`).join('')}</ol>` : '<p class="v6cr-muted">لم يصل أحد إلى 80% بعد.</p>'}
          ${improvers.length ? `<h4>الأكثر تحسنًا</h4><ol>${improvers.map(s => `<li>${E(s.name)} <b><bdi dir="ltr">+${pct(s.improve)}</bdi></b></li>`).join('')}</ol>` : ''}</div>
        <div class="v6cr-card remedial"><h3>🩺 المستهدفون بالخطة العلاجية</h3>${remedial.length ? `<ol>${remedial.map(s => { const w = Object.entries(s.best).sort((a, b) => a[1] - b[1])[0]; const gt = groups.find(x => x.key === w?.[0]); return `<li>${E(s.name)} <b>${pct(s.avg)}%</b><small>${gt ? 'الأضعف: ' + E(gt.title) + ' (' + pct(w[1]) + '%)' : ''}</small></li>`; }).join('')}</ol>` : '<p class="v6cr-muted">لا يوجد طلاب دون 60%.</p>'}
          <h4>غير المشاركين: ${absent.length}</h4>${!hide && absent.length ? `<p class="v6cr-absent-list">${absent.map(s => E(s.name)).join('، ')}</p>` : ''}</div>
      </section>

      <section class="v6cr-sec v6cr-break"><h2>أداء الطلاب</h2>
        <table class="v6cr-table"><thead><tr><th>#</th><th>الطالب</th><th>الأنشطة</th><th>المحاولات</th><th>أول نتيجة</th><th>آخر نتيجة</th><th>المتوسط</th><th>التحسن</th><th>المستوى</th></tr></thead><tbody>${studentRows}</tbody></table>
      </section>

      <section class="v6cr-sec"><h2>التوصيات والإجراءات المقترحة</h2><ol class="v6cr-ins">${recs.map(x => `<li>${E(x)}</li>`).join('')}</ol>
        ${notes ? `<div class="v6cr-notes"><b>ملاحظات المعلم:</b> ${E(notes)}</div>` : ''}</section>

      <footer class="v6cr-foot">
        <div class="v6cr-evid"><span>المعيار: <b>${standard ? E(standard) : '..............................'}</b></span><span>رقم الشاهد: <b>${evidence ? E(evidence) : '..........'}</b></span></div>
        <div class="v6cr-sign"><div><span>معلم المادة</span><b>${E(T.teacher)}</b><i>التوقيع: ..................</i></div><div><span>مدير المدرسة</span><b>${E(T.principal)}</b><i>التوقيع: ..................</i></div></div>
      </footer>
    </div>`;
  }

  /* ---------------- تقرير صفحة واحدة لملف الإنجاز (بلا أسماء طلاب) ---------------- */
  const mbars = items => '<div class="v6cr-mbars">' + items.map(it => `<div class="v6cr-mbar"><span title="${E(it.label)}">${E(it.label)}</span><i><em style="width:${Math.max(2, Math.min(100, it.v))}%;background:${it.color || '#0F8B8D'}"></em></i><b>${it.text ?? pct(it.v) + '%'}</b></div>`).join('') + '</div>';
  function mdonut(parts) {
    const total = parts.reduce((s, p) => s + p.v, 0) || 1, R = 40, r = 24, cx = 45, cy = 45; let a0 = -Math.PI / 2, paths = '';
    parts.forEach(p => {
      if (!p.v) return;
      const a1 = a0 + 2 * Math.PI * p.v / total, large = a1 - a0 > Math.PI ? 1 : 0, P = (rad, a) => `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
      paths += p.v === total ? `<circle cx="${cx}" cy="${cy}" r="${(R + r) / 2}" fill="none" stroke="${p.color}" stroke-width="${R - r}"/>` : `<path d="M${P(R, a0)} A${R},${R} 0 ${large} 1 ${P(R, a1)} L${P(r, a1)} A${r},${r} 0 ${large} 0 ${P(r, a0)} Z" fill="${p.color}"/>`;
      a0 = a1;
    });
    return `<div class="v6cr-mdonut"><svg viewBox="0 0 90 90">${paths}<text x="45" y="50" text-anchor="middle" font-size="15" font-weight="800" fill="#16324F">${parts.reduce((s, p) => s + p.v, 0)}</text></svg><ul>${parts.map(p => `<li><i style="background:${p.color}"></i>${E(p.label)}: <b>${p.v}</b></li>`).join('')}</ul></div>`;
  }
  // يصغّر التقرير عند الحاجة حتى يبقى في صفحة A4 واحدة (ارتفاع المحتوى المتاح ≈ 281 مم)
  function fitOnePage() {
    const el = document.querySelector('#reportPaper .v6cr-one'); if (!el) return;
    el.style.zoom = '';
    const h = el.getBoundingClientRect().height, max = 279 * 96 / 25.4;
    if (h > max) el.style.zoom = String(Math.floor(max / h * 1000) / 1000);
  }
  g.addEventListener('beforeprint', fitOnePage);
  function onePageHtml(d) {
    const { f, grade, rows, groups, gstats, N, P, classAvg, mastery, impr, lv, trend, skills, weakFreq, honor, remedial, improvers, absent, range, notes, standard, evidence, insights, recs, kpi } = d;
    const mi = impr.length ? pct(mean(impr)) : null;
    const third = skills.length
      ? `<div class="v6cr-card"><h3>المهارات الأضعف</h3>${mbars(skills.slice(0, 6).map(s => ({ label: s.name, v: s.p, color: levelOf(s.p)[2] })))}</div>`
      : trend.length >= 2 ? `<div class="v6cr-card"><h3>تطور متوسط الأداء أسبوعيًا</h3>${mbars(trend.slice(-6).map(t => ({ label: t.label, v: t.v, color: levelOf(t.v)[2] })))}</div>`
      : weakFreq.size ? `<div class="v6cr-card"><h3>مفاهيم تحتاج تعزيزًا</h3><ul class="v6cr-chips">${[...weakFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w, n]) => `<li>${E(w)} <b>${n}</b></li>`).join('')}</ul></div>`
      : `<div class="v6cr-card"><h3>نسبة المشاركة في كل نشاط</h3>${mbars(gstats.slice(-6).map(x => ({ label: x.title, v: x.rate, color: '#3A7BD5', text: `${x.participants}/${N}` })))}</div>`;
    return `<div class="v6cr v6cr-one" dir="rtl">
      <header class="v6cr-head">
        <div><div class="v6cr-eyebrow">ملف الإنجاز • شاهد على متابعة أداء الطلاب وتحليل النتائج</div>
        <h1>تقرير أداء طلاب الفصل ${E(f.cls)} في منصة رحلة عالم العلوم</h1>
        <p>${E(T.school)} • مادة العلوم • ${gradeName(grade)} • ${T.year}${f.type ? ' • ' + E(TYPE[f.type]) : ''}</p>
        <p>الفترة: ${E(range)} • تاريخ الإصدار: ${E(fmtDate(Date.now()))}</p></div>
        <div class="v6cr-badge"><b>${pct(classAvg)}%</b><span>متوسط الفصل</span></div>
      </header>
      <section class="v6cr-kpis">
        ${kpi(N, 'طلاب الفصل')}${kpi(P + ' <small>(' + pct(N ? P / N * 100 : 0) + '%)</small>', 'شاركوا')}${kpi(groups.length, 'الأنشطة')}${kpi(rows.length, 'المحاولات')}
        ${kpi(pct(mastery) + '%', 'نسبة الإتقان (80%+)', 'main')}${kpi(honor.length, 'متميزون (80%+)')}${kpi(remedial.length, 'مستهدفون بخطة علاجية')}${kpi(mi === null ? '—' : '<bdi dir="ltr">' + (mi > 0 ? '+' : '') + mi + '</bdi>', 'متوسط التحسن بعد إعادة المحاولة')}
      </section>
      <section class="v6cr-grid three">
        <div class="v6cr-card"><h3>توزيع الطلاب على مستويات الأداء</h3>${mdonut(lv)}</div>
        <div class="v6cr-card"><h3>متوسط الأداء في كل نشاط${gstats.length > 6 ? ' (آخر 6)' : ''}</h3>${mbars(gstats.slice(-6).map(x => ({ label: x.title, v: x.avg, color: levelOf(x.avg)[2] })))}</div>
        ${third}
      </section>
      <section class="v6cr-sec"><h2>نتائج الأنشطة</h2>
        <table class="v6cr-table"><thead><tr><th>#</th><th>النشاط</th><th>النوع</th><th>المشاركون</th><th>المتوسط</th><th>الأعلى</th><th>الأدنى</th><th>الإتقان</th></tr></thead>
        <tbody>${gstats.map((x, i) => `<tr><td>${i + 1}</td><td><b>${E(x.title)}</b></td><td>${E(TYPE[x.type] || x.type)}</td><td>${x.participants}/${N}</td><td><b>${pct(x.avg)}%</b></td><td>${pct(x.max)}%</td><td>${pct(x.min)}%</td><td>${pct(x.mastery)}%</td></tr>`).join('')}</tbody></table>
      </section>
      <section class="v6cr-grid two">
        <div class="v6cr-card"><h3>قراءة في النتائج</h3><ul class="v6cr-ins">${insights.slice(0, 5).map(x => `<li>${E(x)}</li>`).join('')}</ul></div>
        <div class="v6cr-card"><h3>الإجراءات والتوصيات</h3><ol class="v6cr-ins">${recs.map(x => `<li>${E(x)}</li>`).join('')}</ol>
          ${notes ? `<div class="v6cr-notes"><b>ملاحظات المعلم:</b> ${E(notes)}</div>` : ''}</div>
      </section>
      <footer class="v6cr-foot">
        <div class="v6cr-evid"><span>المعيار: <b>${standard ? E(standard) : '..............................'}</b></span><span>رقم الشاهد: <b>${evidence ? E(evidence) : '..........'}</b></span><span>التقرير لا يتضمن أسماء الطلاب.</span></div>
        <div class="v6cr-sign"><div><span>معلم المادة</span><b>${E(T.teacher)}</b><i>التوقيع: ..................</i></div><div><span>مدير المدرسة</span><b>${E(T.principal)}</b><i>التوقيع: ..................</i></div></div>
      </footer>
    </div>`;
  }

  /* ---------------- حفظ نسخة للأرشيف ---------------- */
  function addArchiveButton(f, mode) {
    const bar = document.querySelector('#reportModal .modal-actions'); if (!bar) return;
    let sw = document.getElementById('v6crSwitch');
    if (!sw) { sw = document.createElement('button'); sw.id = 'v6crSwitch'; sw.className = 'btn secondary'; bar.appendChild(sw); }
    sw.classList.remove('hidden');
    sw.textContent = mode === 'one' ? 'عرض التقرير الشامل المفصّل' : 'تقرير صفحة واحدة بدون أسماء (ملف الإنجاز)';
    sw.onclick = () => showReport(mode === 'one' ? 'full' : 'one');
    let b = document.getElementById('v6crArchive');
    if (!b) { b = document.createElement('button'); b.id = 'v6crArchive'; b.className = 'btn secondary'; b.textContent = 'تنزيل نسخة للأرشيف'; bar.appendChild(b); }
    b.classList.remove('hidden');
    b.onclick = () => {
      const css = [...document.styleSheets].map(ss => { try { return [...ss.cssRules].map(r => r.cssText).filter(t => /v6cr|v6-level|@font-face/.test(t)).join('\n'); } catch (e) { return ''; } }).join('\n');
      const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${mode === 'one' ? 'تقرير ملف الإنجاز' : 'التقرير الشامل'} للفصل ${E(f.cls)}</title><style>body{margin:0;background:#EDF4F6;font-family:'IBM Plex Sans Arabic',Tahoma,Arial,sans-serif;color:#16324F}.report-paper{max-width:1000px;margin:20px auto;background:#fff;padding:24px;border-radius:16px}${css}</style></head><body><div class="report-paper v6cr-paper${mode === 'one' ? ' v6cr-paper-one' : ''}">${$('reportPaper').innerHTML}</div></body></html>`;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
      a.download = `${mode === 'one' ? 'ملف-الإنجاز-' : ''}تقرير-الفصل-${String(f.cls).replace('/', '-')}-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    };
    // إخفاء الزر عند فتح تقارير أخرى
    const close = document.getElementById('closeReport');
    if (close && !close.dataset.v6cr) { close.dataset.v6cr = '1'; close.addEventListener('click', () => { b.classList.add('hidden'); document.getElementById('v6crSwitch')?.classList.add('hidden'); $('reportPaper').classList.remove('v6cr-paper', 'v6cr-paper-one'); }); }
  }

  /* ---------------- فتح التقرير مباشرة (من جدول الروابط الذكية) ---------------- */
  g.openClassReport = function (cls, taskId, mode) {
    const sel = document.getElementById('v6crClass'); if (!sel) return;
    if (![...sel.options].some(o => o.value === cls)) { alert('الفصل غير موجود: ' + cls); return; }
    if (!(results || []).length) { alert('لا توجد نتائج محمّلة بعد. حدّث اللوحة ثم أعد المحاولة.'); return; }
    sel.value = cls; lastDateCls = null;
    ['v6crFrom', 'v6crTo', 'v6crType'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    renderTaskChoices();
    const boxes = [...document.querySelectorAll('#v6crTasks input[type=checkbox]')];
    if (taskId) {
      const task = taskById(taskId);
      boxes.forEach(b => { b.checked = b.value === 'id:' + taskId || (!!task && b.value === 't:' + task.title); });
      if (!boxes.some(b => b.checked)) { alert(`لا توجد نتائج لهذا التكليف في الفصل ${cls} بعد.`); return; }
    } else if (!boxes.length) { alert(`لا توجد نتائج للفصل ${cls} بعد.`); return; }
    buildReport(mode);
  };

  const classesForGrade = gr => (typeof GRADE_CLASSES !== 'undefined' && GRADE_CLASSES[gr]) ? GRADE_CLASSES[gr] : (typeof CLASSES !== 'undefined' ? CLASSES : []).filter(c => gradeOfClass(c) === gr);
  const attemptsOf = (cls, taskId) => (results || []).filter(r => r.className === cls && (!taskId || String(r.taskId) === String(taskId)) && !isExcluded(r)).length;

  function reportStrip() {
    const sec = document.getElementById('tasksTab'); if (!sec) return;
    let strip = document.getElementById('v6crStrip');
    if (!strip) {
      strip = document.createElement('div'); strip.id = 'v6crStrip'; strip.className = 'v6cr-strip';
      sec.querySelector('.table-wrap')?.insertAdjacentElement('beforebegin', strip);
    }
    const all = (typeof CLASSES !== 'undefined' ? CLASSES : []);
    const row = (label, mode, cls) => `<div class="v6cr-strip-row"><b>${label}</b>` + all.map(c => {
      const n = attemptsOf(c);
      return `<button class="smallbtn v6cr-btn ${cls}" data-crclass="${E(c)}" data-crmode="${mode}" ${n ? '' : 'disabled'} title="${n} محاولة">${E(c)}${mode === 'full' ? ` <small>${n}</small>` : ''}</button>`;
    }).join('') + '</div>';
    const nameTasks = (Array.isArray(tasks) ? tasks : []).filter(t => isNameTitle(t.title));
    strip.innerHTML = row('📊 التقرير الشامل للفصل:', 'full', '') + row('📄 صفحة واحدة بدون أسماء (ملف الإنجاز):', 'one', 'one')
      + (nameTasks.length ? `<div class="v6cr-strip-row warn"><b>تكليفات عناوينها أسماء طلاب (${nameTasks.length}): ${nameTasks.map(t => '«' + E(t.title) + '»').join('، ')} — مستبعدة من التقارير.</b><button class="smallbtn remove" id="v6crDelNameTasks">حذفها نهائيًا</button></div>` : '');
    const dn = strip.querySelector('#v6crDelNameTasks');
    if (dn) dn.onclick = async () => {
      if (!confirm(`حذف ${nameTasks.length} تكليفًا نهائيًا: ${nameTasks.map(t => t.title).join('، ')}؟`)) return;
      dn.disabled = true; let fail = 0;
      for (const t of nameTasks) { try { await apiAction('deleteTask', { id: t.id }); tasks = tasks.filter(x => String(x.id) !== String(t.id)); } catch (e) { fail++; } }
      if (fail) alert(`تعذر حذف ${fail} تكليفًا.`);
      g.renderTasks();
    };
    strip.querySelectorAll('[data-crclass]').forEach(b => b.onclick = () => g.openClassReport(b.dataset.crclass, '', b.dataset.crmode));
  }

  const baseRenderTasks = g.renderTasks;
  if (typeof baseRenderTasks === 'function') {
    g.renderTasks = function () {
      const out = baseRenderTasks.apply(this, arguments);
      try {
        const head = document.querySelector('#tasksTab thead tr');
        if (head && !head.querySelector('.v6cr-th')) { const th = document.createElement('th'); th.className = 'v6cr-th'; th.textContent = 'تقرير الفصل'; head.insertBefore(th, head.lastElementChild); }
        const rows = [...document.querySelectorAll('#tasksBody > tr')];
        if (rows.length === tasks.length) rows.forEach((tr, i) => {
          const t = tasks[i], td = document.createElement('td');
          const cls = typeof normalizeClassName === 'function' ? normalizeClassName(t.className) : t.className;
          const list = cls ? [cls] : classesForGrade(taskGrade(t));
          td.innerHTML = '<div class="v6cr-cell">' + list.map(c => {
            const n = attemptsOf(c, t.id);
            return `<span class="v6cr-pair"><button class="smallbtn v6cr-btn" data-crtask="${E(t.id)}" data-crclass="${E(c)}" data-crmode="full" ${n ? '' : 'disabled'} title="التقرير الشامل • ${n} محاولة">${list.length > 1 ? E(c) : 'تقرير ' + E(c)} <small>${n}</small></button><button class="smallbtn v6cr-btn one" data-crtask="${E(t.id)}" data-crclass="${E(c)}" data-crmode="one" ${n ? '' : 'disabled'} title="صفحة واحدة بدون أسماء لملف الإنجاز">📄</button></span>`;
          }).join('') + '</div>';
          tr.insertBefore(td, tr.lastElementChild);
          td.querySelectorAll('[data-crtask]').forEach(b => b.onclick = () => g.openClassReport(b.dataset.crclass, b.dataset.crtask, b.dataset.crmode || 'full'));
        });
        else if (rows.length === 1) rows[0].firstElementChild?.setAttribute('colspan', '9');
        reportStrip();
      } catch (e) { console.error(e); }
      return out;
    };
  }

  function mountPortfolioCard() {
    const tab = document.getElementById('portfolioTab'); if (!tab || document.getElementById('v6crPortfolioCard')) return;
    const box = document.createElement('div'); box.id = 'v6crPortfolioCard'; box.className = 'v6cr-pcard';
    box.innerHTML = `<div class="v6cr-pcard-head"><span>📄</span><div><h4>تقرير الفصل لملف الإنجاز — صفحة واحدة بدون أسماء</h4><p>صفحة A4 واحدة بمؤشرات الفصل ونتائج الأنشطة والمهارات والتوصيات، دون ذكر أي اسم طالب. اطبعه أو احفظه PDF.</p></div></div>
      <div class="v6cr-pcard-row"><div class="field"><label>الفصل</label><select id="v6crPClass">${(typeof CLASSES !== 'undefined' ? CLASSES : []).map(c => `<option>${E(c)}</option>`).join('')}</select></div>
      <button id="v6crPBuild" class="btn">إنشاء تقرير الصفحة الواحدة</button><button id="v6crPFull" class="btn secondary">التقرير الشامل المفصّل</button></div>`;
    const head = tab.querySelector('.section-head');
    head ? head.insertAdjacentElement('afterend', box) : tab.prepend(box);
    box.querySelector('#v6crPBuild').onclick = () => g.openClassReport(box.querySelector('#v6crPClass').value, '', 'one');
    box.querySelector('#v6crPFull').onclick = () => g.openClassReport(box.querySelector('#v6crPClass').value, '', 'full');
  }

  mountTab();
  mountPortfolioCard();
  loadExcluded();
})();
