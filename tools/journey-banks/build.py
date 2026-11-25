# -*- coding: utf-8 -*-
"""مولّد بنوك أسئلة منصة رحلة العلوم (V6) من صيغة مختصرة.

الاستخدام:  python3 build.py
يقرأ ملفات data_*.py ويكتب assets/v6/journey-bank-*.js

صيغة السطر (الحقول مفصولة بـ " | "):
  c | المستوى | رقم المفهوم | نص السؤال | الإجابة الصحيحة | خطأ1 | خطأ2 | خطأ3 | التفسير
  t | المستوى | رقم المفهوم | العبارة | ص أو خ | التفسير
  m | المستوى | رقم المفهوم | نص السؤال | أ => ب ; ج => د ; ... | التفسير (اختياري)
  k | المستوى | رقم المفهوم | نص السؤال | تصنيف1 ; تصنيف2 | عنصر :: 1 ; عنصر :: 2 | التفسير (اختياري)
  o | المستوى | رقم المفهوم | نص السؤال | خطوة1 ; خطوة2 ; ... (بالترتيب الصحيح) | التفسير
إضافات داخل نص السؤال:
  @T رأس1 ~ رأس2 § خلية ~ خلية § ...      جدول
  @C عنصر ~ عنصر ~ ؟ ~ عنصر                  مخطط تسلسلي (؟ = المطلوب)
  @B العنوان ~ التسمية:القيمة ~ ... ~ الوحدة   رسم بياني بالأعمدة
"""
import json, os, random, re, sys, importlib.util
from html import escape

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(REPO, 'assets', 'v6')

CH_NAMES = {1: 'الفصل الأول', 2: 'الفصل الثاني', 3: 'الفصل الثالث', 4: 'الفصل الرابع', 5: 'الفصل الخامس',
            6: 'الفصل السادس', 7: 'الفصل السابع', 8: 'الفصل الثامن', 9: 'الفصل التاسع', 10: 'الفصل العاشر',
            11: 'الفصل الحادي عشر', 12: 'الفصل الثاني عشر', 13: 'الفصل الثالث عشر'}
LEVELS = {
    '1': ('سهل', 1, 'معرفة وفهم', 'remember', 'core'),
    '2': ('متوسط', 2, 'تطبيق', 'apply', 'core'),
    '3': ('متقدم', 3, 'استدلال وتحليل', 'analyze', 'enrich'),
}
FONT = "'IBM Plex Sans Arabic','Noto Kufi Arabic',sans-serif"


def t(s):
    return escape(s.strip(), quote=True)


def svg_chain(qid, items):
    n = len(items)
    gap = 16
    w = (548 - gap * (n - 1)) / n
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 84" font-family="{FONT}" role="img">'
             f'<defs><marker id="{qid}-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
             f'<path d="M0,0 L10,5 L0,10 z" fill="#16324F"/></marker></defs>']
    for i, label in enumerate(items):
        x = 554 - (i + 1) * w - i * gap  # من اليمين إلى اليسار
        q = label.strip() in ('؟', '?')
        fs = 22 if q else (12.5 if len(label.strip()) <= 14 else 11)
        if q:
            parts.append(f'<rect x="{x:.1f}" y="18" width="{w:.1f}" height="48" rx="10" fill="#FFF6DF" stroke="#F4B63F" stroke-width="2.4" stroke-dasharray="5 4"/>')
        else:
            parts.append(f'<rect x="{x:.1f}" y="18" width="{w:.1f}" height="48" rx="10" fill="#E3F4F3" stroke="#0F8B8D" stroke-width="1.6" />')
        parts.append(f'<text x="{x + w / 2:.1f}" y="47.0" font-size="{fs}" text-anchor="middle" font-weight="{700 if q else 600}" fill="#16324F" direction="rtl">{t("؟" if q else label)}</text>')
        if i < n - 1:
            parts.append(f'<line x1="{x - 2:.1f}" y1="42.0" x2="{x - gap + 5:.1f}" y2="42.0" stroke="#16324F" stroke-width="1.8" marker-end="url(#{qid}-ah)"/>')
    parts.append('</svg>')
    return ''.join(parts)


def svg_bars(qid, spec):
    title = spec[0].strip()
    unit = spec[-1].strip()
    bars = []
    for s in spec[1:-1]:
        lab, val = s.rsplit(':', 1)
        bars.append((lab.strip(), float(val)))
    import math
    raw = max(v for _, v in bars) or 1
    step = None
    for mag in (0.1, 1, 10, 100, 1000, 10000):
        for m in (1, 2, 2.5, 5):
            if math.ceil(raw / (m * mag) - 1e-9) <= 5:
                step = m * mag
                break
        if step:
            break
    ticks = max(1, math.ceil(raw / step - 1e-9))
    vmax = step * ticks
    W, H, top, bottom, left, right = 560, 250, 56, 46, 44, 16
    ph = H - top - bottom
    n = len(bars)
    slot = (W - left - right) / n
    bw = min(64, slot * 0.55)
    colors = ['#0F8B8D', '#F4B63F', '#3E6FB0', '#D9614C', '#6A9E3F', '#8A5DB5']
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="{FONT}" role="img">',
         f'<text x="{W / 2}" y="20" font-size="14" text-anchor="middle" font-weight="700" fill="#16324F" direction="rtl">{t(title)}</text>',
         f'<line x1="{left}" y1="{top + ph}" x2="{W - right}" y2="{top + ph}" stroke="#16324F" stroke-width="1.6"/>',
         f'<line x1="{left}" y1="{top}" x2="{left}" y2="{top + ph}" stroke="#16324F" stroke-width="1.6"/>',
         f'<text x="{W / 2}" y="38" font-size="11.5" text-anchor="middle" font-weight="600" fill="#5E7384" direction="rtl">الوحدة: {t(unit)}</text>']
    for k in range(ticks + 1):
        y = top + ph - ph * k / ticks
        val = step * k
        lab = f'{val:g}' if abs(val - round(val)) < 1e-9 else f'{val:.1f}'
        p.append(f'<line x1="{left}" y1="{y:.1f}" x2="{W - right}" y2="{y:.1f}" stroke="#D3E2E8" stroke-width="1"/>')
        p.append(f'<text x="{left - 6}" y="{y + 4:.1f}" font-size="10.5" text-anchor="end" fill="#5E7384">{lab}</text>')
    for i, (lab, v) in enumerate(bars):
        cx = left + slot * (i + 0.5)
        h = ph * v / vmax
        p.append(f'<rect x="{cx - bw / 2:.1f}" y="{top + ph - h:.1f}" width="{bw:.1f}" height="{h:.1f}" rx="5" fill="{colors[i % len(colors)]}"/>')
        p.append(f'<text x="{cx:.1f}" y="{top + ph - h - 6:.1f}" font-size="12" text-anchor="middle" font-weight="700" fill="#16324F">{v:g}</text>')
        p.append(f'<text x="{cx:.1f}" y="{top + ph + 18:.1f}" font-size="12" text-anchor="middle" font-weight="600" fill="#16324F" direction="rtl">{t(lab)}</text>')
    p.append('</svg>')
    return ''.join(p)


def split_stem(qid, stem):
    out = {}
    m = re.search(r'\s@([TCB])\s(.*)$', stem)
    if not m:
        return stem.strip(), out
    kind, body = m.group(1), m.group(2)
    stem = stem[:m.start()].strip()
    if kind == 'T':
        rows = [[c.strip() for c in r.split('~')] for r in body.split('§')]
        out['table'] = {'head': rows[0], 'rows': rows[1:]}
    elif kind == 'C':
        out['figure'] = svg_chain(qid, [x.strip() for x in body.split('~')])
    elif kind == 'B':
        out['figure'] = svg_bars(qid, body.split('~'))
    return stem, out


def build_question(qid, lesson, grade, line, concepts):
    line = line.rstrip()
    while line.endswith('|'):
        line = line[:-1].rstrip()
    f = [x.strip() for x in line.split(' | ')]
    if any('|' in x for x in f):
        raise ValueError(f'{qid}: stray pipe')
    typ, lvl, k = f[0], f[1], int(f[2])
    if k < 1 or k > len(concepts):
        raise ValueError(f'{qid}: concept {k} out of range')
    level, code, cog, diff, track = LEVELS[lvl]
    stem, extra = split_stem(qid, f[3])
    rnd = random.Random(qid)
    q = {'id': qid, 'lesson': lesson, 'grade': grade, 'concept': f'k{k:02d}', 'skill': concepts[k - 1],
         'level': level, 'levelCode': code, 'cognitive': cog, 'difficulty': diff, 'track': track, 'q': stem}
    q.update(extra)
    if typ == 'c':
        if len(f) != 9:
            raise ValueError(f'{qid}: choice needs 9 fields, got {len(f)}')
        opts = f[4:8]
        if len(set(opts)) != 4:
            raise ValueError(f'{qid}: duplicate options')
        order = list(range(4))
        rnd.shuffle(order)
        q.update(type='choice', options=[opts[i] for i in order], answer=order.index(0), explain=f[8])
    elif typ == 't':
        if len(f) != 6 or f[4] not in ('ص', 'خ'):
            raise ValueError(f'{qid}: bad tf')
        q.update(type='tf', answer=(f[4] == 'ص'), explain=f[5])
    elif typ == 'm':
        pairs = [p.split('=>') for p in f[4].split(';') if p.strip()]
        left = [a.strip() for a, b in pairs]
        rightc = [b.strip() for a, b in pairs]
        if len(set(rightc)) != len(rightc):
            raise ValueError(f'{qid}: duplicate match targets')
        perm = list(range(len(rightc)))
        while perm == sorted(perm):
            rnd.shuffle(perm)
        right = [rightc[i] for i in perm]
        ans = [right.index(rightc[i]) for i in range(len(left))]
        expl = f[5] if len(f) > 5 and f[5] else '، '.join(f'{a} ← {b}' for a, b in zip(left, rightc))
        q.update(type='match', left=left, right=right, answer=ans, explain=expl)
    elif typ == 'k':
        cats = [c.strip() for c in f[4].split(';')]
        items, ans = [], []
        for it in f[5].split(';'):
            if not it.strip():
                continue
            a, b = it.rsplit('::', 1)
            idx = int(b) - 1
            if idx < 0 or idx >= len(cats):
                raise ValueError(f'{qid}: classify index')
            items.append(a.strip())
            ans.append(idx)
        expl = f[6] if len(f) > 6 and f[6] else 'التصنيف الصحيح: ' + '، '.join(f'{a} ({cats[b]})' for a, b in zip(items, ans))
        q.update(type='classify', categories=cats, items=items, answer=ans, explain=expl)
    elif typ == 'o':
        steps = [s.strip() for s in f[4].split(';') if s.strip()]
        q.update(type='order', options=steps, answer=list(range(len(steps))), explain=f[5])
    else:
        raise ValueError(f'{qid}: unknown type {typ}')
    return q


def load(path):
    spec = importlib.util.spec_from_file_location(os.path.basename(path)[:-3], path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def build_bank(files, grade, term, prefix, version, outname, header):
    lessons, questions = [], []
    for fn in files:
        mod = load(os.path.join(HERE, fn))
        for L in mod.LESSONS:
            concepts = L['k']
            lesson = {'id': L['id'], 'title': L['title'], 'short': L.get('short', L['title']), 'icon': L['icon'],
                      'color': L['color'], 'summary': L['summary'], 'objectives': L['obj'],
                      'chapter': CH_NAMES[L['ch']], 'grade': grade, 'term': term, 'unit': L['unit'],
                      'chapterTitle': L['chTitle'],
                      'concepts': [{'id': f'k{i + 1:02d}', 'name': c, 'note': ''} for i, c in enumerate(concepts)]}
            lessons.append(lesson)
            lines = [x.strip() for x in L['q'].strip().split('\n') if x.strip() and not x.strip().startswith('#')]
            for n, line in enumerate(lines, 1):
                qid = f'{prefix}-C{L["ch"]}-L{L["no"]}-{n:03d}'
                questions.append(build_question(qid, L['id'], grade, line, concepts))
    ids = [q['id'] for q in questions]
    assert len(ids) == len(set(ids)), 'duplicate ids'
    lids = [l['id'] for l in lessons]
    assert len(lids) == len(set(lids)), 'duplicate lesson ids'
    bank = {'version': version, 'lessons': lessons, 'questions': questions}
    js = ('// ' + header + '\n'
          '// يُضاف إلى بنوك المنصة دون حذف أي درس أو سؤال سابق؛ معرّفات الدروس جديدة ولا تتعارض مع التكليفات القديمة.\n'
          '(function () {\n'
          '  const root = window.SCIENCE_DATA = window.SCIENCE_DATA || { lessons: [], questions: [] };\n'
          "  root.lessons = (root.lessons || []).map(l => ({ ...l, grade: String(l.grade || '1'), term: String(l.term || '1') }));\n"
          '  const BANK = ' + json.dumps(bank, ensure_ascii=False, separators=(',', ':')) + ';\n'
          '  const ids = new Set(BANK.lessons.map(l => String(l.id)));\n'
          '  root.lessons = root.lessons.filter(l => !ids.has(String(l.id))).concat(BANK.lessons);\n'
          '  root.questions = (root.questions || []).filter(q => !ids.has(String(q.lesson))).concat(BANK.questions);\n'
          '})();\n')
    with open(os.path.join(OUT, outname), 'w', encoding='utf-8') as fh:
        fh.write(js)
    print(f'{outname}: {len(lessons)} lessons, {len(questions)} questions')
    return bank


if __name__ == '__main__':
    build_bank(['data_g7t2a.py', 'data_g7t2b.py'], '1', '2', 'G7', 'G7-T2-1448-v1', 'journey-bank-g7-t2.js',
               'بنك أسئلة علوم أول متوسط – الفصل الدراسي الثاني 1448هـ (منصة رحلة العلوم)')
    build_bank(['data_g8t1a.py', 'data_g8t1b.py'], '2', '1', 'G8', 'G8-T1-1448-v1', 'journey-bank-g8-t1.js',
               'بنك أسئلة علوم ثاني متوسط – الفصل الدراسي الأول 1448هـ (منصة رحلة العلوم)')
    build_bank(['data_g8t2a.py', 'data_g8t2b.py'], '2', '2', 'G8', 'G8-T2-1448-v1', 'journey-bank-g8-t2.js',
               'بنك أسئلة علوم ثاني متوسط – الفصل الدراسي الثاني 1448هـ (منصة رحلة العلوم)')
    build_bank(['data_g9t2a.py', 'data_g9t2b.py'], '3', '2', 'G9', 'G9-T2-1448-v1', 'journey-bank-g9-t2.js',
               'بنك أسئلة علوم ثالث متوسط – الفصل الدراسي الثاني 1448هـ (منصة رحلة العلوم)')
