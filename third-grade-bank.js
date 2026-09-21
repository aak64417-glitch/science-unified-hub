// بنك بيانات علوم ثالث متوسط — يندمج مع بنك أول متوسط دون استبداله.
(function () {
  const root = window.SCIENCE_DATA =
    window.SCIENCE_DATA || { lessons: [], questions: [] };

  // وسم دروس أول متوسط الحالية.
  root.lessons = (root.lessons || []).map(l => ({
    ...l,
    grade: String(l.grade || '1')
  }));

  const thirdGradeLessons = [
    {
      id: 'g3-science-method',
      title: 'أسلوب العلم',
      short: 'أسلوب العلم',
      grade: '3',
      chapter: 'الفصل الأول',
      icon: '🔬',
      color: 'teal',
      summary: 'الدرس الأول من الفصل الأول في علوم ثالث متوسط.'
    },
    {
      id: 'g3-science-work',
      title: 'عمل العلم',
      short: 'عمل العلم',
      grade: '3',
      chapter: 'الفصل الأول',
      icon: '🧪',
      color: 'indigo',
      summary: 'الدرس الثاني من الفصل الأول في علوم ثالث متوسط.'
    },
    {
      id: 'g3-science-technology-society',
      title: 'العلم والتقنية والمجتمع',
      short: 'العلم والتقنية والمجتمع',
      grade: '3',
      chapter: 'الفصل الأول',
      icon: '🌐',
      color: 'gold',
      summary: 'الدرس الثالث من الفصل الأول في علوم ثالث متوسط.'
    },
    {
      id: 'g3-earthquakes',
      title: 'الزلازل',
      short: 'الزلازل',
      grade: '3',
      chapter: 'الفصل الثاني',
      icon: '🌍',
      color: 'teal',
      summary: 'الدرس الأول من الفصل الثاني في علوم ثالث متوسط.'
    },
    {
      id: 'g3-volcanoes',
      title: 'البراكين',
      short: 'البراكين',
      grade: '3',
      chapter: 'الفصل الثاني',
      icon: '🌋',
      color: 'indigo',
      summary: 'الدرس الثاني من الفصل الثاني في علوم ثالث متوسط.'
    }
  ];

  // منع تكرار الدروس عند إعادة تحميل الملف.
  const existingIds = new Set(
    root.lessons.map(l => String(l.id))
  );

  thirdGradeLessons.forEach(lesson => {
    if (!existingIds.has(String(lesson.id))) {
      root.lessons.push(lesson);
    }
  });

  // إبقاء بنك الأسئلة الحالي كما هو.
  root.questions = root.questions || [];
})();
