// بنك بيانات علوم ثالث متوسط
// الدروس مطابقة لكتاب العلوم، والأسئلة ستضاف لاحقًا من الكتاب حصراً.

(function () {
  const root = window.SCIENCE_DATA =
    window.SCIENCE_DATA || { lessons: [], questions: [] };

  // اعتبار الدروس الحالية غير الموسومة تابعة لأول متوسط.
  root.lessons = (root.lessons || []).map(l => ({
    ...l,
    grade: String(l.grade || '1')
  }));

  const thirdGradeLessons = [

    // الفصل الأول
    {
      id: 'g3-science-method',
      title: 'أسلوب العلم',
      short: 'أسلوب العلم',
      grade: '3',
      chapter: 'الفصل الأول',
      icon: '🔬',
      color: 'teal',
      summary: 'أسلوب العلم وطرائق البحث العلمي.'
    },
    {
      id: 'g3-science-work',
      title: 'عمل العلم',
      short: 'عمل العلم',
      grade: '3',
      chapter: 'الفصل الأول',
      icon: '🧪',
      color: 'indigo',
      summary: 'حل المشكلات والبحث الوصفي والبحث التجريبي.'
    },
    {
      id: 'g3-science-technology-society',
      title: 'العلم والتقنية والمجتمع',
      short: 'العلم والتقنية والمجتمع',
      grade: '3',
      chapter: 'الفصل الأول',
      icon: '🌐',
      color: 'gold',
      summary: 'العلاقة بين العلم والتقنية والمجتمع.'
    },

    // الفصل الثاني
    {
      id: 'g3-earthquakes',
      title: 'الزلازل',
      short: 'الزلازل',
      grade: '3',
      chapter: 'الفصل الثاني',
      icon: '🌍',
      color: 'teal',
      summary: 'الزلازل والموجات الزلزالية وقياسها.'
    },
    {
      id: 'g3-volcanoes',
      title: 'البراكين',
      short: 'البراكين',
      grade: '3',
      chapter: 'الفصل الثاني',
      icon: '🌋',
      color: 'gold',
      summary: 'أنواع البراكين والمواد البركانية.'
    },
    {
      id: 'g3-plates-earthquakes-volcanoes',
      title: 'الصفائح الأرضية وعلاقتها بالزلازل والبراكين',
      short: 'الصفائح الأرضية والزلازل والبراكين',
      grade: '3',
      chapter: 'الفصل الثاني',
      icon: '🗺️',
      color: 'indigo',
      summary: 'حركة الصفائح وعلاقتها بالزلازل والبراكين.'
    },

    // الفصل الثالث
    {
      id: 'g3-cell-activities',
      title: 'أنشطة في الخلية',
      short: 'أنشطة في الخلية',
      grade: '3',
      chapter: 'الفصل الثالث',
      icon: '🧫',
      color: 'teal',
      summary: 'النقل عبر الغشاء والطاقة والعمليات الخلوية.'
    },
    {
      id: 'g3-cell-division-reproduction',
      title: 'انقسام الخلية وتكاثرها',
      short: 'انقسام الخلية وتكاثرها',
      grade: '3',
      chapter: 'الفصل الثالث',
      icon: '🧬',
      color: 'indigo',
      summary: 'دورة الخلية والانقسام والتكاثر.'
    },

    // الفصل الرابع
    {
      id: 'g3-dna',
      title: 'مادة الوراثة DNA',
      short: 'مادة الوراثة DNA',
      grade: '3',
      chapter: 'الفصل الرابع',
      icon: '🧬',
      color: 'teal',
      summary: 'DNA والجينات وRNA وتصنيع البروتين.'
    },
    {
      id: 'g3-genetics',
      title: 'علم الوراثة',
      short: 'علم الوراثة',
      grade: '3',
      chapter: 'الفصل الرابع',
      icon: '🌱',
      color: 'gold',
      summary: 'الصفات الوراثية وتجارب مندل والاحتمالات.'
    },

    // الفصل الخامس
    {
      id: 'g3-atomic-models',
      title: 'نماذج الذرة',
      short: 'نماذج الذرة',
      grade: '3',
      chapter: 'الفصل الخامس',
      icon: '⚛️',
      color: 'indigo',
      summary: 'تطور نماذج الذرة ومكوناتها.'
    },
    {
      id: 'g3-nucleus',
      title: 'النواة',
      short: 'النواة',
      grade: '3',
      chapter: 'الفصل الخامس',
      icon: '☢️',
      color: 'gold',
      summary: 'النواة والنظائر والتحلل الإشعاعي وعمر النصف.'
    },

    // الفصل السادس
    {
      id: 'g3-periodic-table-intro',
      title: 'مقدمة في الجدول الدوري',
      short: 'مقدمة في الجدول الدوري',
      grade: '3',
      chapter: 'الفصل السادس',
      icon: '🧩',
      color: 'teal',
      summary: 'تطور الجدول الدوري وتنظيم العناصر.'
    },
    {
      id: 'g3-representative-elements',
      title: 'العناصر الممثلة',
      short: 'العناصر الممثلة',
      grade: '3',
      chapter: 'الفصل السادس',
      icon: '🧪',
      color: 'indigo',
      summary: 'مجموعات العناصر الممثلة وخصائصها.'
    },
    {
      id: 'g3-transition-elements',
      title: 'العناصر الانتقالية',
      short: 'العناصر الانتقالية',
      grade: '3',
      chapter: 'الفصل السادس',
      icon: '⚗️',
      color: 'gold',
      summary: 'العناصر الانتقالية والعناصر الانتقالية الداخلية.'
    }

  ];

  // تحديث دروس ثالث متوسط ومنع التكرار.
  const lessonMap = new Map(
    (root.lessons || []).map(l => [String(l.id), l])
  );

  thirdGradeLessons.forEach(lesson => {
    lessonMap.set(String(lesson.id), lesson);
  });

  root.lessons = [...lessonMap.values()];

  // الحفاظ على الأسئلة الحالية كما هي.
  // أي سؤال ثالث متوسط سيستخدم معرف درس يبدأ بـ g3-
  root.questions = (root.questions || []).map(q => ({
    ...q,
    grade: String(
      q.grade ||
      (String(q.lesson || '').startsWith('g3-') ? '3' : '1')
    )
  }));

  window.SCIENCE_THIRD_GRADE_LESSON_IDS =
    thirdGradeLessons.map(l => l.id);

})();
