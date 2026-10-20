/* رحلة عالم العلوم — امتداد صفحة الطالب V6
   يضيف: الرسوم والجداول داخل السؤال، وأنماط (أكمل – مطابقة – تصنيف)، ورموز البدائل (أ ب ج د)،
   ويحمي التكليفات القديمة التي اختيرت أسئلتها من البنك السابق.
   لا يغيّر منطق التكليفات أو إرسال النتائج أو إدارة الطلاب. */
(function () {
  if (window.__JOURNEY_V6_STUDENT__) return;
  window.__JOURNEY_V6_STUDENT__ = true;

  const LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'];
  const NEW_TYPES = ['fill', 'match', 'classify'];
  const g = window;
  const byId = id => document.getElementById(id);
  const escH = s => String(s ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  const isExam = () => (state.mode === 'exam' || state.task?.mode === 'exam');
  const mix = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  /* ---------- تطبيع الإجابة النصية في أسئلة «أكمل» ---------- */
  function norm(s) {
    return String(s || '').normalize('NFKC')
      .replace(/[ً-ٰٟـ]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
      .replace(/[.,،؛;:!?؟()«»"'\-–—]/g, ' ')
      .replace(/\s+/g, ' ').trim().toLowerCase();
  }
  function variants(s) {
    const n = norm(s), out = new Set([n, n.replace(/\s/g, '')]);
    const noAl = n.split(' ').map(w => w.startsWith('ال') && w.length > 3 ? w.slice(2) : w).join(' ');
    out.add(noAl); out.add(noAl.replace(/\s/g, ''));
    out.add(n.replace(/ا$/, '')); out.add(noAl.replace(/ا$/, ''));
    return out;
  }
  function blankOk(user, accepted) {
    const u = variants(user);
    return (accepted || []).some(a => [...variants(a)].some(v => v && u.has(v)));
  }

  /* ---------- حماية التكليفات القديمة ---------- */
  const bankIds = () => new Set((g.SCIENCE_DATA?.questions || []).map(q => String(q.id)));
  if (typeof g.applyQuestionOverrides === 'function') {
    g.applyQuestionOverrides = function (items) {
      const data = g.SCIENCE_DATA || { lessons: [], questions: [] };
      const qmap = new Map((data.questions || []).map(q => [String(q.id), q]));
      (Array.isArray(items) ? items : []).forEach(item => {
        const id = String(item?.questionId || '').trim(); if (!id) return;
        if (String(item.action || 'upsert') === 'delete') { qmap.delete(id); return; }
        const p = item?.payload; if (!p || typeof p !== 'object' || Array.isArray(p)) return;
        // تعديلات أسئلة البنك السابق لا تُعاد إلى البنك الجديد.
        if (!qmap.has(id)) return;
        qmap.set(id, { ...qmap.get(id), ...p, id });
      });
      data.questions = [...qmap.values()];
      g.SCIENCE_DATA = data;
    };
  }
  if (typeof g.taskQuestionPoolForLesson === 'function') {
    g.taskQuestionPoolForLesson = function (lessonId) {
      const all = DATA.questions.filter(q => String(q.lesson) === String(lessonId));
      let arr = all;
      const ids = bankIds();
      const selected = state.task?.questionSelections?.[lessonId];
      if (Array.isArray(selected) && selected.length) {
        const keep = new Set(selected.map(String).filter(id => ids.has(id)));
        if (keep.size) arr = arr.filter(q => keep.has(String(q.id)));
      }
      const excluded = state.task?.excludedQuestionIds?.[lessonId];
      if (Array.isArray(excluded) && excluded.length) {
        const blocked = new Set(excluded.map(String));
        const left = arr.filter(q => !blocked.has(String(q.id)));
        if (left.length) arr = left;
      }
      return arr;
    };
  }
  g.conceptName = function (lessonId, conceptId) {
    const l = (DATA.lessons || []).find(x => x.id === lessonId);
    return l?.concepts?.find(c => c.id === conceptId)?.name || conceptId || '';
  };

  /* ---------- خلط البدائل مع الحفاظ على الإجابة ---------- */
  g.randomizeChoice = function (q) {
    const c = structuredClone(q);
    if (c.type === 'choice' && !c.fixedOrder && Array.isArray(c.options)) {
      const m = mix(c.options.map((text, i) => ({ text, ok: i === c.answer })));
      c.options = m.map(x => x.text); c.answer = m.findIndex(x => x.ok);
    } else if (c.type === 'match' && Array.isArray(c.right)) {
      const m = mix(c.right.map((text, i) => ({ text, i })));
      c.right = m.map(x => x.text);
      c.answer = (q.answer || []).map(ri => m.findIndex(x => x.i === ri));
    } else if (c.type === 'classify' && Array.isArray(c.items)) {
      const m = mix(c.items.map((text, i) => ({ text, a: q.answer[i] })));
      c.items = m.map(x => x.text); c.answer = m.map(x => x.a);
    }
    return c;
  };

  const baseQType = g.qType;
  g.qType = function (type) {
    return ({ fill: 'أكمل', match: 'مطابقة', classify: 'تصنيف', choice: 'اختيار من متعدد', tf: 'صح أو خطأ', multi: 'اختيار متعدد', order: 'ترتيب' }[type]) || (baseQType ? baseQType(type) : type);
  };

  /* ---------- الرسم والجدول ومستوى الصعوبة ---------- */
  function decorate(q) {
    const h3 = byId('questionText'); if (!h3) return;
    const host = h3.parentElement;
    host.querySelectorAll('.v6-figure,.v6-table-wrap').forEach(n => n.remove());
    if (q.type === 'fill') h3.textContent = String(q.q || '').replace(/_{3,}/g, ' ....... ');
    let after = h3;
    if (q.figure) {
      const f = document.createElement('div'); f.className = 'v6-figure'; f.innerHTML = q.figure;
      after.insertAdjacentElement('afterend', f); after = f;
    }
    if (q.table && Array.isArray(q.table.head)) {
      const w = document.createElement('div'); w.className = 'v6-table-wrap';
      w.innerHTML = '<table class="v6-table"><thead><tr>' + q.table.head.map(h => `<th>${escH(h)}</th>`).join('') +
        '</tr></thead><tbody>' + (q.table.rows || []).map(r => '<tr>' + r.map(c => `<td>${escH(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table>';
      after.insertAdjacentElement('afterend', w);
    }
    const tags = host.querySelector('.q-tags');
    if (tags) {
      let lv = byId('qLevel');
      if (!lv) { lv = document.createElement('span'); lv.id = 'qLevel'; lv.className = 'q-tag'; tags.appendChild(lv); }
      const code = Number(q.levelCode || 0);
      lv.style.display = code ? '' : 'none';
      lv.innerHTML = code ? `<span class="v6-level">${[1, 2, 3].map(i => `<i class="${i <= code ? 'on' : ''}"></i>`).join('')}</span> ${escH(q.level || '')}` : '';
    }
  }
  const baseRender = g.renderQuestion;
  g.renderQuestion = function () {
    const r = baseRender.apply(this, arguments);
    try { decorate(state.quiz[state.i]); } catch (e) { console.warn('V6 decorate', e); }
    return r;
  };

  /* ---------- رسم الإجابات ---------- */
  function examSubmitButton(box, q) {
    if (!isExam()) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'btn v6-submit'; b.textContent = 'تأكيد الإجابة';
    b.onclick = () => { if (state.answered) return; const r = g.response(q); if (r === null || (Array.isArray(r) && !r.length)) { alert('أكمل الإجابة أولًا.'); return; } b.disabled = true; submitExam(r, false); };
    box.appendChild(b);
  }
  const baseAnswers = g.renderAnswers;
  g.renderAnswers = function (q) {
    const box = byId('answers');
    box.classList.remove('v6-grid2');
    if (q.type === 'fill') {
      const n = Array.isArray(q.answer) ? q.answer.length : 1;
      box.innerHTML = '<div class="v6-fill">' + Array.from({ length: n }, (_, i) =>
        `<label><b>${n > 1 ? i + 1 : '✎'}</b><input type="text" autocomplete="off" data-blank="${i}" placeholder="اكتب الإجابة هنا"></label>`).join('') + '</div>';
      box.querySelectorAll('input').forEach(inp => inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); if (isExam()) box.querySelector('.v6-submit')?.click(); else byId('checkBtn')?.click(); }
      }));
      examSubmitButton(box, q); return;
    }
    if (q.type === 'match') {
      box.innerHTML = '<p class="v6-hint">اختر لكل عبارة ما يناسبها من القائمة.</p><div class="v6-rows">' + q.left.map((l, i) =>
        `<div class="v6-row" data-row="${i}"><span>${i + 1}. ${escH(l)}</span><select data-match="${i}"><option value="">اختر…</option>${q.right.map((r, j) => `<option value="${j}">${escH(r)}</option>`).join('')}</select></div>`).join('') + '</div>';
      examSubmitButton(box, q); return;
    }
    if (q.type === 'classify') {
      box.innerHTML = '<p class="v6-hint">اختر التصنيف المناسب لكل عبارة.</p><div class="v6-rows">' + q.items.map((it, i) =>
        `<div class="v6-row" data-row="${i}"><span>${escH(it)}</span><div class="v6-cats" data-cls="${i}">${q.categories.map((c, j) => `<button type="button" data-cat="${j}">${escH(c)}</button>`).join('')}</div></div>`).join('') + '</div>';
      box.querySelectorAll('.v6-cats').forEach(grp => grp.querySelectorAll('button').forEach(b => b.onclick = () => {
        if (state.answered) return; grp.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); grp.dataset.value = b.dataset.cat;
      }));
      examSubmitButton(box, q); return;
    }
    baseAnswers.apply(this, arguments);
    if (q.type === 'order' || q.type === 'multi') { examSubmitButton(box, q); return; }
    const btns = [...box.querySelectorAll('.answer')];
    btns.forEach((b, i) => {
      const t = b.textContent; b.textContent = '';
      const lt = document.createElement('span'); lt.className = 'v6-lt'; lt.textContent = LETTERS[i] || String(i + 1);
      const tx = document.createElement('span'); tx.textContent = t;
      b.append(lt, tx);
    });
    if (btns.length >= 4 && btns.every(b => b.textContent.length <= 30)) box.classList.add('v6-grid2');
    // في الاختبار: إجابة «صح أو خطأ» تُرسل قيمة منطقية (كانت تُرسل رقم الزر فتُحسب خطأ دائمًا).
    if (q.type === 'tf' && isExam()) {
      btns.forEach((b, i) => b.onclick = () => {
        if (state.answered) return;
        btns.forEach(x => x.classList.remove('selected')); b.classList.add('selected');
        submitExam(i === 0, false);
      });
    }
  };

  const baseResponse = g.response;
  g.response = function (q) {
    const box = byId('answers');
    if (q.type === 'fill') {
      const vals = [...box.querySelectorAll('input[data-blank]')].map(x => x.value.trim());
      return vals.some(v => !v) ? null : vals;
    }
    if (q.type === 'match') {
      const vals = [...box.querySelectorAll('select[data-match]')].map(x => x.value);
      return vals.some(v => v === '') ? null : vals.map(Number);
    }
    if (q.type === 'classify') {
      const vals = [...box.querySelectorAll('.v6-cats')].map(x => x.dataset.value);
      return vals.some(v => v === undefined || v === '') ? null : vals.map(Number);
    }
    return baseResponse.apply(this, arguments);
  };

  const baseEq = g.eq;
  g.eq = function (a, b) {
    if (Array.isArray(a) && Array.isArray(b) && b.length && Array.isArray(b[0])) {
      return a.length === b.length && a.every((v, i) => blankOk(v, b[i]));
    }
    return baseEq(a, b);
  };

  const baseMark = g.mark;
  g.mark = function (q, r) {
    const box = byId('answers');
    if (q.type === 'fill') {
      box.querySelectorAll('input[data-blank]').forEach((inp, i) => {
        inp.disabled = true;
        const ok = r && blankOk(r[i], q.answer[i]);
        inp.classList.add(ok ? 'ok' : 'no');
        if (!ok) { const s = document.createElement('span'); s.className = 'v6-right'; s.textContent = '✓ ' + q.answer[i][0]; inp.parentElement.appendChild(s); }
      });
      return;
    }
    if (q.type === 'match' || q.type === 'classify') {
      box.querySelectorAll('.v6-row').forEach((row, i) => {
        row.querySelectorAll('select,button').forEach(x => x.disabled = true);
        const ok = Array.isArray(r) && r[i] === q.answer[i];
        row.classList.add(ok ? 'ok' : 'no');
        if (!ok) {
          const right = q.type === 'match' ? q.right[q.answer[i]] : q.categories[q.answer[i]];
          const s = document.createElement('span'); s.className = 'v6-right'; s.textContent = '✓ ' + right; row.appendChild(s);
        }
      });
      box.querySelector('.v6-submit')?.remove();
      return;
    }
    box.querySelector('.v6-submit')?.remove();
    return baseMark.apply(this, arguments);
  };
})();
