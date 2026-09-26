// بنك بيانات علوم ثالث متوسط
// المصدر الحالي للأسئلة: كتاب الطالب فقط.
// 15 درسًا × 15 سؤالًا = 225 سؤالًا.
// يمكن للمعلم تعديل/إضافة/حذف الأسئلة من لوحة المعلم، وتبقى التعديلات محفوظة كـ overrides.

(function () {
  const root = window.SCIENCE_DATA =
    window.SCIENCE_DATA || { lessons: [], questions: [] };

  // اعتبار الدروس الحالية غير الموسومة تابعة لأول متوسط.
  root.lessons = (root.lessons || []).map(l => ({
    ...l,
    grade: String(l.grade || '1')
  }));

  const thirdGradeLessons = [
  {
    "id": "g3-science-method",
    "title": "أسلوب العلم",
    "short": "أسلوب العلم",
    "grade": "3",
    "chapter": "الفصل الأول",
    "icon": "🔬",
    "color": "teal",
    "summary": "أسلوب العلم وطرائق البحث العلمي."
  },
  {
    "id": "g3-science-work",
    "title": "عمل العلم",
    "short": "عمل العلم",
    "grade": "3",
    "chapter": "الفصل الأول",
    "icon": "🧪",
    "color": "indigo",
    "summary": "حل المشكلات والبحث الوصفي والبحث التجريبي."
  },
  {
    "id": "g3-science-technology-society",
    "title": "العلم والتقنية والمجتمع",
    "short": "العلم والتقنية والمجتمع",
    "grade": "3",
    "chapter": "الفصل الأول",
    "icon": "🌐",
    "color": "gold",
    "summary": "العلاقة بين العلم والتقنية والمجتمع."
  },
  {
    "id": "g3-earthquakes",
    "title": "الزلازل",
    "short": "الزلازل",
    "grade": "3",
    "chapter": "الفصل الثاني",
    "icon": "🌍",
    "color": "teal",
    "summary": "الزلازل والموجات الزلزالية وقياسها."
  },
  {
    "id": "g3-volcanoes",
    "title": "البراكين",
    "short": "البراكين",
    "grade": "3",
    "chapter": "الفصل الثاني",
    "icon": "🌋",
    "color": "gold",
    "summary": "أنواع البراكين والمواد البركانية."
  },
  {
    "id": "g3-plates-earthquakes-volcanoes",
    "title": "الصفائح الأرضية وعلاقتها بالزلازل والبراكين",
    "short": "الصفائح الأرضية والزلازل والبراكين",
    "grade": "3",
    "chapter": "الفصل الثاني",
    "icon": "🗺️",
    "color": "indigo",
    "summary": "حركة الصفائح وعلاقتها بالزلازل والبراكين."
  },
  {
    "id": "g3-cell-activities",
    "title": "أنشطة في الخلية",
    "short": "أنشطة في الخلية",
    "grade": "3",
    "chapter": "الفصل الثالث",
    "icon": "🧫",
    "color": "teal",
    "summary": "النقل عبر الغشاء والطاقة والعمليات الخلوية."
  },
  {
    "id": "g3-cell-division-reproduction",
    "title": "انقسام الخلية وتكاثرها",
    "short": "انقسام الخلية وتكاثرها",
    "grade": "3",
    "chapter": "الفصل الثالث",
    "icon": "🧬",
    "color": "indigo",
    "summary": "دورة الخلية والانقسام والتكاثر."
  },
  {
    "id": "g3-dna",
    "title": "مادة الوراثة DNA",
    "short": "مادة الوراثة DNA",
    "grade": "3",
    "chapter": "الفصل الرابع",
    "icon": "🧬",
    "color": "teal",
    "summary": "DNA والجينات وRNA وتصنيع البروتين."
  },
  {
    "id": "g3-genetics",
    "title": "علم الوراثة",
    "short": "علم الوراثة",
    "grade": "3",
    "chapter": "الفصل الرابع",
    "icon": "🌱",
    "color": "gold",
    "summary": "الصفات الوراثية وتجارب مندل والاحتمالات."
  },
  {
    "id": "g3-atomic-models",
    "title": "نماذج الذرة",
    "short": "نماذج الذرة",
    "grade": "3",
    "chapter": "الفصل الخامس",
    "icon": "⚛️",
    "color": "indigo",
    "summary": "تطور نماذج الذرة ومكوناتها."
  },
  {
    "id": "g3-nucleus",
    "title": "النواة",
    "short": "النواة",
    "grade": "3",
    "chapter": "الفصل الخامس",
    "icon": "☢️",
    "color": "gold",
    "summary": "النواة والنظائر والتحلل الإشعاعي وعمر النصف."
  },
  {
    "id": "g3-periodic-table-intro",
    "title": "مقدمة في الجدول الدوري",
    "short": "مقدمة في الجدول الدوري",
    "grade": "3",
    "chapter": "الفصل السادس",
    "icon": "🧩",
    "color": "teal",
    "summary": "تطور الجدول الدوري وتنظيم العناصر."
  },
  {
    "id": "g3-representative-elements",
    "title": "العناصر الممثلة",
    "short": "العناصر الممثلة",
    "grade": "3",
    "chapter": "الفصل السادس",
    "icon": "🧪",
    "color": "indigo",
    "summary": "مجموعات العناصر الممثلة وخصائصها."
  },
  {
    "id": "g3-transition-elements",
    "title": "العناصر الانتقالية",
    "short": "العناصر الانتقالية",
    "grade": "3",
    "chapter": "الفصل السادس",
    "icon": "⚗️",
    "color": "gold",
    "summary": "العناصر الانتقالية والعناصر الانتقالية الداخلية."
  }
];

  const thirdGradeQuestions = [
  {
    "id": "g3-sm-01",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "العلم",
    "type": "choice",
    "q": "ما المقصود بالعلم؟",
    "options": [
      "طريقة منظمة لدراسة العالم والحصول على المعرفة",
      "حفظ المعلومات فقط",
      "استخدام الأجهزة فقط",
      "إجراء الحسابات فقط"
    ],
    "answer": 0,
    "explain": "طريقة منظمة لدراسة العالم والحصول على المعرفة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-02",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "العلم",
    "type": "choice",
    "q": "يساعد العلم الإنسان على:",
    "options": [
      "زيادة سرعة الأجهزة فقط",
      "فهم العالم من حوله",
      "الاستغناء عن الملاحظة",
      "حفظ جميع المعلومات"
    ],
    "answer": 1,
    "explain": "فهم العالم من حوله",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-03",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "استخدام العلم",
    "type": "choice",
    "q": "عند مواجهة مشكلة في الحياة اليومية، من الأساليب العلمية المناسبة:",
    "options": [
      "التخمين دون معلومات",
      "تجاهل المشكلة",
      "طرح الأسئلة وجمع المعلومات",
      "تغيير النتائج"
    ],
    "answer": 2,
    "explain": "طرح الأسئلة وجمع المعلومات",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-04",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "المعرفة السابقة",
    "type": "choice",
    "q": "لماذا يستفيد العلماء من المعرفة السابقة؟",
    "options": [
      "لإلغاء الملاحظات",
      "لمنع استخدام الأدوات",
      "للاستغناء عن المعلومات",
      "لمساعدتهم في دراسة المشكلات الجديدة"
    ],
    "answer": 3,
    "explain": "لمساعدتهم في دراسة المشكلات الجديدة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-05",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "استخدام العلم",
    "type": "choice",
    "q": "أي مما يأتي مثال على استخدام العلم في الحياة اليومية؟",
    "options": [
      "معرفة سبب مشكلة ومحاولة حلها",
      "تجاهل الملاحظات",
      "عدم استخدام المعلومات",
      "اختيار إجابة عشوائية"
    ],
    "answer": 0,
    "explain": "معرفة سبب مشكلة ومحاولة حلها",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-06",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "التقنية",
    "type": "choice",
    "q": "ما المقصود بالتقنية؟",
    "options": [
      "جمع المعلومات فقط",
      "تطبيق العلم لصنع منتجات وأدوات مفيدة",
      "حفظ المصطلحات",
      "تسجيل النتائج فقط"
    ],
    "answer": 1,
    "explain": "تطبيق العلم لصنع منتجات وأدوات مفيدة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-07",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "التقنية",
    "type": "choice",
    "q": "أي مما يأتي يُعد مثالًا على التقنية؟",
    "options": [
      "الملاحظة",
      "المقارنة",
      "الحاسوب",
      "السؤال"
    ],
    "answer": 2,
    "explain": "الحاسوب",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-08",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "مهارات العلم",
    "type": "choice",
    "q": "أي مما يأتي من المهارات التي يستخدمها العلماء؟",
    "options": [
      "التخمين العشوائي",
      "إهمال البيانات",
      "تغيير النتائج",
      "الملاحظة"
    ],
    "answer": 3,
    "explain": "الملاحظة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-09",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "الملاحظة",
    "type": "choice",
    "q": "تعتمد الملاحظة بصورة أساسية على:",
    "options": [
      "جمع معلومات عن الأشياء والأحداث",
      "تغيير النتائج",
      "تجاهل التفاصيل",
      "اختيار الإجابة قبل الفحص"
    ],
    "answer": 0,
    "explain": "جمع معلومات عن الأشياء والأحداث",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-10",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "القياس",
    "type": "choice",
    "q": "لماذا يستخدم العلماء أدوات مثل المسطرة ومقياس الحرارة؟",
    "options": [
      "لتغيير النتائج",
      "للحصول على ملاحظات وقياسات أدق",
      "لتقليل المعلومات",
      "للاستغناء عن الملاحظة"
    ],
    "answer": 1,
    "explain": "للحصول على ملاحظات وقياسات أدق",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-11",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "أدوات القياس",
    "type": "choice",
    "q": "أي أداة أنسب لقياس درجة الحرارة؟",
    "options": [
      "المسطرة",
      "الساعة",
      "مقياس الحرارة",
      "العدسة"
    ],
    "answer": 2,
    "explain": "مقياس الحرارة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-12",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "أدوات القياس",
    "type": "choice",
    "q": "أي أداة أنسب لقياس طول جسم؟",
    "options": [
      "مقياس الحرارة",
      "الميزان",
      "الساعة",
      "المسطرة"
    ],
    "answer": 3,
    "explain": "المسطرة",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-13",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "تسجيل البيانات",
    "type": "choice",
    "q": "لماذا يسجل العلماء ملاحظاتهم وبياناتهم؟",
    "options": [
      "للرجوع إليها ومقارنتها",
      "حتى لا يستخدموها",
      "لتغييرها لاحقًا",
      "للاستغناء عن القياس"
    ],
    "answer": 0,
    "explain": "للرجوع إليها ومقارنتها",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-14",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "التواصل العلمي",
    "type": "choice",
    "q": "من أهداف التواصل في العلم:",
    "options": [
      "إخفاء النتائج",
      "مشاركة المعلومات والنتائج مع الآخرين",
      "منع الآخرين من الاستفادة",
      "عدم تسجيل البيانات"
    ],
    "answer": 1,
    "explain": "مشاركة المعلومات والنتائج مع الآخرين",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sm-15",
    "lesson": "g3-science-method",
    "grade": "3",
    "concept": "القياس",
    "type": "choice",
    "q": "قاس طالب طول نبتة كل يوم وسجل النتائج. ما المهارة التي استخدمها بصورة مباشرة؟",
    "options": [
      "التخمين",
      "الحفظ",
      "القياس",
      "التقليد"
    ],
    "answer": 2,
    "explain": "القياس",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-01",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "حل المشكلات",
    "type": "choice",
    "q": "ما الخطوة التي تبدأ بها معالجة مشكلة علمية؟",
    "options": [
      "إعلان النتائج",
      "تغيير البيانات",
      "حذف الملاحظات",
      "تحديد المشكلة"
    ],
    "answer": 3,
    "explain": "تحديد المشكلة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-02",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "البحث الوصفي",
    "type": "choice",
    "q": "أي نوع من البحث يركز على تسجيل الملاحظات ووصف الظاهرة؟",
    "options": [
      "البحث الوصفي",
      "البحث التجريبي",
      "البحث العشوائي",
      "القياس فقط"
    ],
    "answer": 0,
    "explain": "البحث الوصفي",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-03",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "البحث التجريبي",
    "type": "choice",
    "q": "أي نوع من البحث يعتمد على ظروف يمكن التحكم فيها وضبطها؟",
    "options": [
      "البحث الوصفي",
      "البحث التجريبي",
      "البحث التاريخي",
      "المقارنة فقط"
    ],
    "answer": 1,
    "explain": "البحث التجريبي",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-04",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "الفرضية",
    "type": "choice",
    "q": "الفرضية هي:",
    "options": [
      "نتيجة نهائية ثابتة",
      "معلومة لا يمكن اختبارها",
      "توقع أو عبارة قابلة للاختبار",
      "أداة قياس"
    ],
    "answer": 2,
    "explain": "توقع أو عبارة قابلة للاختبار",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-05",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "المتغيرات",
    "type": "choice",
    "q": "المتغير الذي يغيّره الباحث عمدًا يسمى:",
    "options": [
      "المتغير التابع",
      "الثابت",
      "العينة الضابطة",
      "المتغير المستقل"
    ],
    "answer": 3,
    "explain": "المتغير المستقل",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-06",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "المتغيرات",
    "type": "choice",
    "q": "المتغير الذي يتم قياسه في التجربة يسمى:",
    "options": [
      "المتغير التابع",
      "المتغير المستقل",
      "الثابت",
      "الفرضية"
    ],
    "answer": 0,
    "explain": "المتغير التابع",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-07",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "الثوابت",
    "type": "choice",
    "q": "العوامل التي تبقى دون تغيير أثناء التجربة تسمى:",
    "options": [
      "المتغيرات التابعة",
      "الثوابت",
      "النتائج",
      "الفرضيات"
    ],
    "answer": 1,
    "explain": "الثوابت",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-08",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "المتغير المستقل",
    "type": "choice",
    "q": "في تجربة أثر نوع المضاد الحيوي في نمو البكتيريا، المتغير المستقل هو:",
    "options": [
      "نمو البكتيريا",
      "درجة حرارة الغرفة فقط",
      "نوع المضاد الحيوي",
      "عدد النتائج"
    ],
    "answer": 2,
    "explain": "نوع المضاد الحيوي",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-09",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "المتغير التابع",
    "type": "choice",
    "q": "في تجربة أثر المضاد الحيوي في البكتيريا، المتغير التابع هو:",
    "options": [
      "نوع المضاد الحيوي",
      "اسم الباحث",
      "لون الطبق",
      "نمو البكتيريا"
    ],
    "answer": 3,
    "explain": "نمو البكتيريا",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-10",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "تكرار المحاولات",
    "type": "choice",
    "q": "لماذا تُكرر التجربة عدة مرات بالطريقة نفسها؟",
    "options": [
      "لزيادة دقة النتائج",
      "لتغيير الفرضية كل مرة",
      "لإلغاء البيانات",
      "لمنع المقارنة"
    ],
    "answer": 0,
    "explain": "لزيادة دقة النتائج",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-11",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "تحليل النتائج",
    "type": "choice",
    "q": "بعد جمع البيانات، ماذا يفعل الباحث؟",
    "options": [
      "يحذف الملاحظات",
      "يحلل النتائج",
      "يغيّر المتغيرات دون سبب",
      "يتوقف قبل المقارنة"
    ],
    "answer": 1,
    "explain": "يحلل النتائج",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-12",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "تحليل النتائج",
    "type": "choice",
    "q": "إذا لم تدعم البيانات الفرضية فإن الباحث يمكن أن:",
    "options": [
      "يغيّر البيانات لتناسبها",
      "يتجاهل النتائج",
      "يراجع الفرضية أو يجري تجربة أخرى",
      "يعلن نجاح الفرضية"
    ],
    "answer": 2,
    "explain": "يراجع الفرضية أو يجري تجربة أخرى",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-13",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "التواصل بالنتائج",
    "type": "choice",
    "q": "ما فائدة التواصل بالنتائج؟",
    "options": [
      "إخفاء المعلومات",
      "منع تكرار البحث",
      "إلغاء الملاحظات",
      "مشاركة ما تم التوصل إليه والاستفادة من آراء الآخرين"
    ],
    "answer": 3,
    "explain": "مشاركة ما تم التوصل إليه والاستفادة من آراء الآخرين",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-14",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "المعلومات السابقة",
    "type": "choice",
    "q": "الرجوع إلى المعلومات السابقة مهم في:",
    "options": [
      "البحث الوصفي والبحث التجريبي",
      "البحث الوصفي فقط",
      "البحث التجريبي فقط",
      "لا يفيد في البحث"
    ],
    "answer": 0,
    "explain": "البحث الوصفي والبحث التجريبي",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sw-15",
    "lesson": "g3-science-work",
    "grade": "3",
    "concept": "البحث التجريبي",
    "type": "choice",
    "q": "إذا أردت معرفة أثر درجة الحرارة في إنبات البذور، فما الأنسب؟",
    "options": [
      "وصف لون البذور فقط",
      "بحث تجريبي مع ضبط بقية العوامل",
      "تغيير عدة عوامل معًا",
      "عدم تسجيل النتائج"
    ],
    "answer": 1,
    "explain": "بحث تجريبي مع ضبط بقية العوامل",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-01",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "التقنية",
    "type": "choice",
    "q": "ما المقصود بالتقنية في سياق الدرس؟",
    "options": [
      "حفظ المعلومات دون استخدامها",
      "إلغاء دور العلم",
      "تطبيق المعرفة العلمية في منتجات وعمليات مفيدة",
      "تسجيل البيانات فقط"
    ],
    "answer": 2,
    "explain": "تطبيق المعرفة العلمية في منتجات وعمليات مفيدة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-02",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "العلم في الحياة",
    "type": "choice",
    "q": "أي مما يأتي مثال على أثر العلم في الحياة اليومية؟",
    "options": [
      "إهمال المعلومات",
      "منع استخدام الحاسوب",
      "عدم اتخاذ قرارات",
      "تطوير أدوية جديدة"
    ],
    "answer": 3,
    "explain": "تطوير أدوية جديدة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-03",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "استخدام المعلومات",
    "type": "choice",
    "q": "تساعد المعلومات العلمية الناس على:",
    "options": [
      "اتخاذ قرارات مبنية على معرفة",
      "تجنب جمع المعلومات",
      "إلغاء الحاجة للتفكير",
      "تغيير الحقائق"
    ],
    "answer": 0,
    "explain": "اتخاذ قرارات مبنية على معرفة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-04",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "استخدام المعلومات",
    "type": "choice",
    "q": "يمكن أن تسهم المعلومات العلمية في:",
    "options": [
      "منع جميع التقنيات",
      "تطوير طرق جديدة لإنتاج الكهرباء",
      "إيقاف الاكتشافات",
      "الاستغناء عن البحث"
    ],
    "answer": 1,
    "explain": "تطوير طرق جديدة لإنتاج الكهرباء",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-05",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "حدود العلم",
    "type": "choice",
    "q": "هل يستطيع العلم التجريبي أن يقرر وحده أن معلومة ما أخلاقية أو غير أخلاقية؟",
    "options": [
      "نعم دائمًا",
      "فقط في الطب",
      "لا",
      "فقط في الفيزياء"
    ],
    "answer": 2,
    "explain": "لا",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-06",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "المعرفة التراكمية",
    "type": "choice",
    "q": "المعرفة العلمية توصف بأنها تراكمية لأن:",
    "options": [
      "كل عالم يبدأ من الصفر",
      "المعلومات القديمة تُلغى دائمًا",
      "لا تتغير المعرفة أبدًا",
      "النتائج الجديدة تبنى على ما توصل إليه الآخرون"
    ],
    "answer": 3,
    "explain": "النتائج الجديدة تبنى على ما توصل إليه الآخرون",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-07",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "العلم والمجتمع",
    "type": "choice",
    "q": "العلم والتقنية هما نتيجة:",
    "options": [
      "جهود كثير من الناس",
      "عمل شخص واحد فقط",
      "المصادفة فقط",
      "غياب التعاون"
    ],
    "answer": 0,
    "explain": "جهود كثير من الناس",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-08",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "تبادل المعلومات",
    "type": "choice",
    "q": "من وسائل تبادل المعلومات العلمية الحديثة:",
    "options": [
      "إخفاء التقارير",
      "شبكة الإنترنت",
      "عدم التواصل",
      "الاعتماد على الذاكرة فقط"
    ],
    "answer": 1,
    "explain": "شبكة الإنترنت",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-09",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "تقنية المعلومات",
    "type": "choice",
    "q": "تقنية المعلومات والاتصالات تساعد العلماء على:",
    "options": [
      "منع مشاركة النتائج",
      "تقليل مصادر المعرفة",
      "الوصول إلى المعلومات وتبادلها بسرعة",
      "إلغاء التواصل"
    ],
    "answer": 2,
    "explain": "الوصول إلى المعلومات وتبادلها بسرعة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-10",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "مصادر المعلومات",
    "type": "choice",
    "q": "عند استخدام الإنترنت للحصول على معلومات علمية يجب:",
    "options": [
      "قبول أي معلومة بلا فحص",
      "استخدام أول نتيجة فقط",
      "تجاهل مصدر المعلومة",
      "التحقق من موثوقية المصدر"
    ],
    "answer": 3,
    "explain": "التحقق من موثوقية المصدر",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-11",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "استخدام المعلومات",
    "type": "choice",
    "q": "أي موقف يوضح استخدامًا مسؤولًا للمعلومات العلمية؟",
    "options": [
      "مقارنة مصادر موثوقة قبل اتخاذ قرار",
      "نشر معلومة مجهولة المصدر",
      "تجاهل الأدلة",
      "اختيار الرأي قبل البحث"
    ],
    "answer": 0,
    "explain": "مقارنة مصادر موثوقة قبل اتخاذ قرار",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-12",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "العلم والتقنية",
    "type": "choice",
    "q": "تطوير سيارة أكثر أمانًا مثال على:",
    "options": [
      "البحث دون تطبيق",
      "توظيف العلم والتقنية لخدمة المجتمع",
      "إهمال المعرفة",
      "غياب التقنية"
    ],
    "answer": 1,
    "explain": "توظيف العلم والتقنية لخدمة المجتمع",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-13",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "العلم والمجتمع",
    "type": "choice",
    "q": "دراسة طرق إنتاج طاقة أقل ضررًا بالبيئة توضح ارتباط العلم بـ:",
    "options": [
      "الحفظ فقط",
      "الصدفة",
      "حاجات المجتمع والبيئة",
      "عدم التطبيق"
    ],
    "answer": 2,
    "explain": "حاجات المجتمع والبيئة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-14",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "التواصل العلمي",
    "type": "choice",
    "q": "لماذا يتبادل العلماء نتائجهم؟",
    "options": [
      "لمنع التقدم",
      "لإخفاء الأخطاء",
      "لإلغاء الأبحاث السابقة",
      "ليبني الآخرون عليها ويطوروا المعرفة"
    ],
    "answer": 3,
    "explain": "ليبني الآخرون عليها ويطوروا المعرفة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-sts-15",
    "lesson": "g3-science-technology-society",
    "grade": "3",
    "concept": "مصادر المعلومات",
    "type": "choice",
    "q": "إذا وجدت خبرًا علميًا جديدًا في موقع غير معروف، فأفضل خطوة هي:",
    "options": [
      "مقارنته بمصادر موثوقة",
      "نشره مباشرة",
      "اعتباره صحيحًا دائمًا",
      "تجاهل اسم المصدر"
    ],
    "answer": 0,
    "explain": "مقارنته بمصادر موثوقة",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-01",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "مكونات الزلزال",
    "type": "choice",
    "q": "النقطة داخل الأرض التي تبدأ عندها حركة الزلزال تسمى:",
    "options": [
      "المركز السطحي",
      "بؤرة الزلزال",
      "الفالق السطحي",
      "محطة الرصد"
    ],
    "answer": 1,
    "explain": "بؤرة الزلزال",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-02",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "مكونات الزلزال",
    "type": "choice",
    "q": "النقطة على سطح الأرض الواقعة مباشرة فوق بؤرة الزلزال تسمى:",
    "options": [
      "البؤرة",
      "الغلاف الصخري",
      "المركز السطحي",
      "الستار"
    ],
    "answer": 2,
    "explain": "المركز السطحي",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-03",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "الموجات الزلزالية",
    "type": "choice",
    "q": "أسرع الموجات الزلزالية هي:",
    "options": [
      "الموجات الثانوية S",
      "الموجات السطحية",
      "موجات الماء",
      "الموجات الأولية P"
    ],
    "answer": 3,
    "explain": "الموجات الأولية P",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-04",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "الموجات الزلزالية",
    "type": "choice",
    "q": "الموجات الثانوية S هي موجات:",
    "options": [
      "مستعرضة",
      "طولية",
      "سطحية فقط",
      "ضوئية"
    ],
    "answer": 0,
    "explain": "مستعرضة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-05",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "الموجات السطحية",
    "type": "choice",
    "q": "أي الموجات الزلزالية تسبب معظم الدمار؟",
    "options": [
      "الموجات P",
      "الموجات السطحية",
      "الموجات S فقط",
      "الموجات الصوتية"
    ],
    "answer": 1,
    "explain": "الموجات السطحية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-06",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "الموجات السطحية",
    "type": "choice",
    "q": "الموجات السطحية مقارنة بغيرها تكون:",
    "options": [
      "أسرع وأقصر",
      "تنتقل فقط في اللب",
      "أبطأ وأطول",
      "لا تصل إلى السطح"
    ],
    "answer": 2,
    "explain": "أبطأ وأطول",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-07",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "قياس الزلازل",
    "type": "choice",
    "q": "الجهاز الذي يسجل الموجات الزلزالية هو:",
    "options": [
      "الترمومتر",
      "البارومتر",
      "المجهر",
      "السيزموجراف"
    ],
    "answer": 3,
    "explain": "السيزموجراف",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-08",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "تحديد الموقع",
    "type": "choice",
    "q": "يستفاد من الفرق في زمن وصول موجات P وS في حساب:",
    "options": [
      "البعد عن المركز السطحي للزلزال",
      "درجة حرارة الصخر",
      "كتلة الأرض",
      "عمر الصخر"
    ],
    "answer": 0,
    "explain": "البعد عن المركز السطحي للزلزال",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-09",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "تحديد الموقع",
    "type": "choice",
    "q": "كلما زاد الفرق بين زمن وصول P وS فإن محطة الرصد تكون:",
    "options": [
      "أقرب دائمًا",
      "أبعد عن المركز السطحي",
      "فوق البؤرة مباشرة",
      "لا يمكن تحديد بعدها"
    ],
    "answer": 1,
    "explain": "أبعد عن المركز السطحي",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-10",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "تحديد الموقع",
    "type": "choice",
    "q": "لتحديد المركز السطحي للزلزال نحتاج بيانات من:",
    "options": [
      "محطة واحدة فقط",
      "جهاز حرارة",
      "ثلاث محطات رصد على الأقل",
      "محطتين فقط دائمًا"
    ],
    "answer": 2,
    "explain": "ثلاث محطات رصد على الأقل",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-11",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "مقياس رختر",
    "type": "choice",
    "q": "يعتمد مقياس رختر على قياس:",
    "options": [
      "درجة حرارة الصخور",
      "سرعة الرياح",
      "عمق المحيط",
      "سعة الموجة الزلزالية"
    ],
    "answer": 3,
    "explain": "سعة الموجة الزلزالية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-12",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "مقياس رختر",
    "type": "choice",
    "q": "زيادة درجة واحدة على مقياس رختر تعني أن سعة أكبر موجة تزيد نحو:",
    "options": [
      "10 مرات",
      "مرتين",
      "32 مرة",
      "100 مرة"
    ],
    "answer": 0,
    "explain": "10 مرات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-13",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "مقياس رختر",
    "type": "choice",
    "q": "زيادة درجة واحدة على مقياس رختر تعني أن الطاقة المتحررة تزيد نحو:",
    "options": [
      "10 مرات",
      "32 مرة",
      "مرتين",
      "100 مرة"
    ],
    "answer": 1,
    "explain": "32 مرة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-14",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "تحديد الموقع",
    "type": "choice",
    "q": "إذا التقت دوائر المسافات المرسومة من ثلاث محطات في نقطة، فإن هذه النقطة تمثل:",
    "options": [
      "البؤرة دائمًا",
      "مركز الأرض",
      "المركز السطحي للزلزال",
      "محطة الرصد"
    ],
    "answer": 2,
    "explain": "المركز السطحي للزلزال",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-eq-15",
    "lesson": "g3-earthquakes",
    "grade": "3",
    "concept": "الموجات وباطن الأرض",
    "type": "choice",
    "q": "دراسة الموجات الزلزالية ساعدت العلماء على معرفة:",
    "options": [
      "تركيب الشمس",
      "سرعة الرياح",
      "ملوحة المحيط",
      "الكثير عن باطن الأرض"
    ],
    "answer": 3,
    "explain": "الكثير عن باطن الأرض",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-01",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "الصهارة",
    "type": "choice",
    "q": "الصخر المنصهر الموجود تحت سطح الأرض يسمى:",
    "options": [
      "الصهارة",
      "اللابة",
      "الرماد",
      "الرسوبيات"
    ],
    "answer": 0,
    "explain": "الصهارة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-02",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "اللابة",
    "type": "choice",
    "q": "عندما تصل الصهارة إلى سطح الأرض تسمى:",
    "options": [
      "الصهارة",
      "اللابة",
      "الرماد",
      "الفالق"
    ],
    "answer": 1,
    "explain": "اللابة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-03",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "أنواع البراكين",
    "type": "choice",
    "q": "أي نوع من البراكين يتميز بجوانب قليلة الانحدار واتساع كبير؟",
    "options": [
      "البركان المخروطي",
      "البركان المركب",
      "البركان الدرعي",
      "الفوهة المنهارة فقط"
    ],
    "answer": 2,
    "explain": "البركان الدرعي",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-04",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "اللزوجة",
    "type": "choice",
    "q": "تنساب اللابة بسهولة أكبر عندما تكون لزوجتها:",
    "options": [
      "عالية جدًا",
      "ثابتة دائمًا",
      "لا علاقة لها",
      "قليلة"
    ],
    "answer": 3,
    "explain": "قليلة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-05",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "السليكا واللزوجة",
    "type": "choice",
    "q": "زيادة نسبة السليكا في الصهارة تؤدي غالبًا إلى:",
    "options": [
      "زيادة اللزوجة",
      "انخفاض اللزوجة دائمًا",
      "تحولها إلى ماء",
      "اختفاء الغازات"
    ],
    "answer": 0,
    "explain": "زيادة اللزوجة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-06",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "البركان المخروطي",
    "type": "choice",
    "q": "تتكون البراكين المخروطية أساسًا من:",
    "options": [
      "طبقة واحدة من الماء",
      "المقذوفات الصلبة",
      "الجليد",
      "الرمال فقط"
    ],
    "answer": 1,
    "explain": "المقذوفات الصلبة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-07",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "البركان المخروطي",
    "type": "choice",
    "q": "يكون ارتفاع البركان المخروطي غالبًا أقل من:",
    "options": [
      "3000 م",
      "30 كم",
      "300 م",
      "50 كم"
    ],
    "answer": 2,
    "explain": "300 م",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-08",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "البركان المركب",
    "type": "choice",
    "q": "تتكون البراكين المركبة من:",
    "options": [
      "لابة فقط",
      "رماد فقط",
      "ماء وصخور رسوبية فقط",
      "طبقات متتابعة من اللابة والمقذوفات الصلبة"
    ],
    "answer": 3,
    "explain": "طبقات متتابعة من اللابة والمقذوفات الصلبة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-09",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "أمثلة محلية",
    "type": "choice",
    "q": "من أمثلة البراكين المركبة في المملكة:",
    "options": [
      "جبل القدر",
      "حرة رهط فقط",
      "جزر هاواي",
      "البحر الأحمر"
    ],
    "answer": 0,
    "explain": "جبل القدر",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-10",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "ثوران الشقوق",
    "type": "choice",
    "q": "ثوران الشقوق يحدث عندما:",
    "options": [
      "تتجمد المياه داخل البركان",
      "تخرج صهارة قليلة اللزوجة من شقوق في سطح الأرض",
      "يتوقف تدفق اللابة",
      "تتحرك الرياح فقط"
    ],
    "answer": 1,
    "explain": "تخرج صهارة قليلة اللزوجة من شقوق في سطح الأرض",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-11",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "أمثلة محلية",
    "type": "choice",
    "q": "من أمثلة ثوران الشقوق في المملكة:",
    "options": [
      "جبل القدر فقط",
      "جبل إيفرست",
      "حرة رهط",
      "وادي النيل"
    ],
    "answer": 2,
    "explain": "حرة رهط",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-12",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "ثوران الشقوق",
    "type": "choice",
    "q": "الانسيابات البازلتية الواسعة الناتجة من ثوران الشقوق قد تكوّن:",
    "options": [
      "أودية جليدية",
      "كثبانًا رملية",
      "شعابًا مرجانية",
      "هضابًا بازلتية"
    ],
    "answer": 3,
    "explain": "هضابًا بازلتية",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-13",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "الغازات",
    "type": "choice",
    "q": "الغازات في الصهارة يمكن أن تؤثر في:",
    "options": [
      "شدة الثوران البركاني",
      "عدد أيام السنة",
      "سرعة الضوء",
      "ملوحة البحر"
    ],
    "answer": 0,
    "explain": "شدة الثوران البركاني",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-14",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "شدة الثوران",
    "type": "choice",
    "q": "إذا كانت الصهارة عالية اللزوجة ومحملة بالغازات، فالثوران المتوقع يكون:",
    "options": [
      "أكثر هدوءًا دائمًا",
      "أشد انفجارًا",
      "منعدمًا",
      "مائيًا فقط"
    ],
    "answer": 1,
    "explain": "أشد انفجارًا",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-vol-15",
    "lesson": "g3-volcanoes",
    "grade": "3",
    "concept": "البركان الدرعي",
    "type": "choice",
    "q": "أي نوع من البراكين يناسب لابة قليلة اللزوجة تنتشر لمسافات واسعة؟",
    "options": [
      "البركان المخروطي",
      "البركان المركب فقط",
      "البركان الدرعي",
      "لا يمكن تحديده"
    ],
    "answer": 2,
    "explain": "البركان الدرعي",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-01",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "الغلاف الصخري",
    "type": "choice",
    "q": "الغلاف الصخري يتكون من:",
    "options": [
      "اللب الداخلي فقط",
      "الغلاف المائع فقط",
      "القشرة وحدها",
      "القشرة والجزء العلوي الصلب من الستار"
    ],
    "answer": 3,
    "explain": "القشرة والجزء العلوي الصلب من الستار",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-02",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "الغلاف المائع",
    "type": "choice",
    "q": "الطبقة اللدنة التي تتحرك فوقها الصفائح تسمى:",
    "options": [
      "الغلاف المائع",
      "اللب الداخلي",
      "القشرة القارية",
      "اللب الخارجي"
    ],
    "answer": 0,
    "explain": "الغلاف المائع",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-03",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "حركة الصفائح",
    "type": "choice",
    "q": "تتحرك الصفائح الأرضية بسبب:",
    "options": [
      "الرياح السطحية",
      "الحمل الحراري في الستار",
      "الأمطار",
      "دوران القمر فقط"
    ],
    "answer": 1,
    "explain": "الحمل الحراري في الستار",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-04",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "حدود الصفائح",
    "type": "choice",
    "q": "عند الحدود التباعدية تتحرك الصفائح:",
    "options": [
      "نحو بعضها",
      "دون حركة",
      "بعيدًا عن بعضها",
      "إلى أعلى فقط"
    ],
    "answer": 2,
    "explain": "بعيدًا عن بعضها",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-05",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "حدود الصفائح",
    "type": "choice",
    "q": "عند الحدود التقاربية تتحرك الصفائح:",
    "options": [
      "بعيدًا عن بعضها",
      "في اتجاه واحد دون تقارب",
      "دون حركة",
      "نحو بعضها"
    ],
    "answer": 3,
    "explain": "نحو بعضها",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-06",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "حدود الصفائح",
    "type": "choice",
    "q": "عند الحدود التحويلية تتحرك الصفائح غالبًا:",
    "options": [
      "محاذية لبعضها في اتجاهين متعاكسين",
      "متباعدة فقط",
      "متقاربة فقط",
      "عموديًا إلى أعلى"
    ],
    "answer": 0,
    "explain": "محاذية لبعضها في اتجاهين متعاكسين",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-07",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "الصفائح والزلازل",
    "type": "choice",
    "q": "ترتبط معظم الزلازل والبراكين بـ:",
    "options": [
      "مراكز القارات فقط",
      "حدود الصفائح",
      "الأنهار",
      "الكثبان الرملية"
    ],
    "answer": 1,
    "explain": "حدود الصفائح",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-08",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "الحدود التباعدية",
    "type": "choice",
    "q": "تتكون قشرة محيطية جديدة غالبًا عند:",
    "options": [
      "الحدود التقاربية فقط",
      "الحدود التحويلية",
      "الحدود التباعدية",
      "مراكز القارات"
    ],
    "answer": 2,
    "explain": "الحدود التباعدية",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-09",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "البقع الساخنة",
    "type": "choice",
    "q": "البقع الساخنة يمكن أن تكوّن:",
    "options": [
      "جبالًا جليدية",
      "أنهارًا دائمة",
      "صحارى رملية",
      "سلسلة من الجزر البركانية"
    ],
    "answer": 3,
    "explain": "سلسلة من الجزر البركانية",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-10",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "باطن الأرض",
    "type": "choice",
    "q": "استخدم العلماء الموجات الزلزالية لمعرفة:",
    "options": [
      "تركيب باطن الأرض",
      "تركيب الغلاف الجوي",
      "اتجاه الرياح",
      "درجة ملوحة البحر"
    ],
    "answer": 0,
    "explain": "تركيب باطن الأرض",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-11",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "باطن الأرض",
    "type": "choice",
    "q": "اللب الخارجي للأرض يتكون معظمه من:",
    "options": [
      "حديد صلب",
      "حديد مصهور",
      "صخور رسوبية",
      "ماء"
    ],
    "answer": 1,
    "explain": "حديد مصهور",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-12",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "باطن الأرض",
    "type": "choice",
    "q": "اللب الداخلي للأرض يتكون معظمه من:",
    "options": [
      "حديد مصهور",
      "هواء",
      "حديد صلب",
      "صخور رسوبية"
    ],
    "answer": 2,
    "explain": "حديد صلب",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-13",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "سرعة الموجات",
    "type": "choice",
    "q": "سرعة موجات P في القشرة حسب مثال الكتاب نحو:",
    "options": [
      "8 كم/ث",
      "16 كم/ث",
      "2 كم/ث",
      "6 كم/ث"
    ],
    "answer": 3,
    "explain": "6 كم/ث",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-14",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "حساب الزمن",
    "type": "choice",
    "q": "إذا قطعت موجة P مسافة 300 كم في الستار العلوي بسرعة 8 كم/ث، فالزمن يساوي تقريبًا:",
    "options": [
      "37.5 ثانية",
      "24 ثانية",
      "48 ثانية",
      "80 ثانية"
    ],
    "answer": 0,
    "explain": "37.5 ثانية",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pl-15",
    "lesson": "g3-plates-earthquakes-volcanoes",
    "grade": "3",
    "concept": "حساب الزمن",
    "type": "choice",
    "q": "إذا قطعت موجة P مسافة 500 كم في القشرة بسرعة 6 كم/ث، فالزمن يساوي تقريبًا:",
    "options": [
      "30 ثانية",
      "83.3 ثانية",
      "12 ثانية",
      "500 ثانية"
    ],
    "answer": 1,
    "explain": "83.3 ثانية",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-01",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "الانتشار",
    "type": "choice",
    "q": "انتقال الجزيئات من منطقة تركيز عالٍ إلى منطقة تركيز منخفض يسمى:",
    "options": [
      "النقل النشط",
      "البلعمة",
      "الانتشار",
      "الإخراج الخلوي"
    ],
    "answer": 2,
    "explain": "الانتشار",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-02",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "الأسموزية",
    "type": "choice",
    "q": "انتقال الماء عبر الغشاء شبه المنفذ يسمى:",
    "options": [
      "البلعمة",
      "النقل النشط",
      "الأيض",
      "الأسموزية"
    ],
    "answer": 3,
    "explain": "الأسموزية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-03",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "الاتزان",
    "type": "choice",
    "q": "عند الوصول إلى تساوي تراكيز الجزيئات على جانبي الغشاء تسمى الحالة:",
    "options": [
      "الاتزان",
      "الانقسام",
      "التخمر",
      "الإخصاب"
    ],
    "answer": 0,
    "explain": "الاتزان",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-04",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "الانتشار المدعوم",
    "type": "choice",
    "q": "انتقال الجلوكوز عبر الغشاء بمساعدة بروتينات ناقلة يسمى:",
    "options": [
      "الأسموزية",
      "الانتشار المدعوم",
      "البلعمة",
      "الإخراج الخلوي"
    ],
    "answer": 1,
    "explain": "الانتشار المدعوم",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-05",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "النقل النشط",
    "type": "choice",
    "q": "أي عملية تحتاج إلى طاقة خلوية؟",
    "options": [
      "الانتشار",
      "الأسموزية",
      "النقل النشط",
      "الاتزان"
    ],
    "answer": 2,
    "explain": "النقل النشط",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-06",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "البلعمة",
    "type": "choice",
    "q": "في البلعمة يحيط الغشاء البلازمي بالمادة ويكوّن:",
    "options": [
      "كروموسومًا",
      "نواة جديدة",
      "إنزيمًا",
      "فجوة"
    ],
    "answer": 3,
    "explain": "فجوة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-07",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "الإخراج الخلوي",
    "type": "choice",
    "q": "طرح المواد خارج الخلية بواسطة اندماج الفجوة مع الغشاء يسمى:",
    "options": [
      "الإخراج الخلوي",
      "البلعمة",
      "الانتشار",
      "الأسموزية"
    ],
    "answer": 0,
    "explain": "الإخراج الخلوي",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-08",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "الأيض",
    "type": "choice",
    "q": "جميع التفاعلات الكيميائية التي تحدث في المخلوق الحي تسمى:",
    "options": [
      "الانتشار",
      "عمليات الأيض",
      "الاتزان",
      "الانقسام"
    ],
    "answer": 1,
    "explain": "عمليات الأيض",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-09",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "الإنزيمات",
    "type": "choice",
    "q": "دور الإنزيمات في الخلية هو:",
    "options": [
      "إيقاف جميع التفاعلات",
      "تكوين الكروموسومات",
      "تسريع التفاعلات الكيميائية",
      "منع إنتاج الطاقة"
    ],
    "answer": 2,
    "explain": "تسريع التفاعلات الكيميائية",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-10",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "الإنزيمات",
    "type": "choice",
    "q": "الإنزيم أثناء التفاعل الكيميائي:",
    "options": [
      "يتحول دائمًا إلى طاقة",
      "يختفي تمامًا",
      "يتحول إلى DNA",
      "لا يُستهلك ويمكن استخدامه مرة أخرى"
    ],
    "answer": 3,
    "explain": "لا يُستهلك ويمكن استخدامه مرة أخرى",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-11",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "الطاقة",
    "type": "choice",
    "q": "الطاقة الكيميائية التي تستخدمها الخلية تأتي أساسًا من:",
    "options": [
      "الغذاء",
      "الماء فقط",
      "الهواء فقط",
      "الأملاح فقط"
    ],
    "answer": 0,
    "explain": "الغذاء",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-12",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "البناء الضوئي",
    "type": "choice",
    "q": "العملية التي تصنع فيها الخلايا النباتية الغذاء باستخدام الضوء تسمى:",
    "options": [
      "التنفس الخلوي",
      "البناء الضوئي",
      "التخمر",
      "الانتشار"
    ],
    "answer": 1,
    "explain": "البناء الضوئي",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-13",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "التنفس الخلوي",
    "type": "choice",
    "q": "التنفس الخلوي يساعد الخلية على:",
    "options": [
      "تكوين غشاء جديد فقط",
      "إيقاف الأيض",
      "تحرير الطاقة من الغذاء",
      "منع استخدام الأكسجين"
    ],
    "answer": 2,
    "explain": "تحرير الطاقة من الغذاء",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-14",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "التخمر",
    "type": "choice",
    "q": "عند نقص الأكسجين قد تحصل بعض الخلايا على الطاقة بعملية:",
    "options": [
      "الأسموزية",
      "البلعمة",
      "الانقسام",
      "التخمر"
    ],
    "answer": 3,
    "explain": "التخمر",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-cell-15",
    "lesson": "g3-cell-activities",
    "grade": "3",
    "concept": "النقل عبر الغشاء",
    "type": "choice",
    "q": "أي مقارنة صحيحة؟",
    "options": [
      "النقل النشط يحتاج طاقة أما الانتشار فلا يحتاج طاقة خلوية",
      "الانتشار يحتاج طاقة والنقل النشط لا يحتاج",
      "كلاهما انقسام خلوي",
      "كلاهما يكوّن DNA"
    ],
    "answer": 0,
    "explain": "النقل النشط يحتاج طاقة أما الانتشار فلا يحتاج طاقة خلوية",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-01",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "أهمية الانقسام",
    "type": "choice",
    "q": "من أهمية انقسام الخلية:",
    "options": [
      "إيقاف النمو",
      "النمو وتعويض الخلايا التالفة",
      "منع التكاثر",
      "إلغاء المادة الوراثية"
    ],
    "answer": 1,
    "explain": "النمو وتعويض الخلايا التالفة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-02",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "دورة الخلية",
    "type": "choice",
    "q": "الفترة التي تنمو فيها الخلية وتتضاعف كروموسوماتها تسمى:",
    "options": [
      "الطور الاستوائي",
      "الطور الانفصالي",
      "الطور البيني",
      "الطور النهائي"
    ],
    "answer": 2,
    "explain": "الطور البيني",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-03",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "الانقسام المتساوي",
    "type": "choice",
    "q": "في الطور التمهيدي تبدأ في الظهور:",
    "options": [
      "نواتان مكتملتان دائمًا",
      "خليتان منفصلتان",
      "أمشاج",
      "الخيوط المغزلية"
    ],
    "answer": 3,
    "explain": "الخيوط المغزلية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-04",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "الانقسام المتساوي",
    "type": "choice",
    "q": "في الطور الاستوائي تصطف الكروماتيدات:",
    "options": [
      "في منتصف الخلية",
      "عند قطب واحد فقط",
      "خارج الخلية",
      "داخل الفجوة"
    ],
    "answer": 0,
    "explain": "في منتصف الخلية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-05",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "الانقسام المتساوي",
    "type": "choice",
    "q": "في الطور الانفصالي يحدث:",
    "options": [
      "تضاعف DNA للمرة الأولى",
      "انفصال الكروماتيدات",
      "اختفاء الخلية",
      "تكوين جدار فقط"
    ],
    "answer": 1,
    "explain": "انفصال الكروماتيدات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-06",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "الانقسام المتساوي",
    "type": "choice",
    "q": "في نهاية الانقسام المتساوي ينتج عادة:",
    "options": [
      "أربع خلايا مختلفة",
      "مشيج واحد",
      "خليتان جديدتان متماثلتان وراثيًا",
      "خلية بلا نواة"
    ],
    "answer": 2,
    "explain": "خليتان جديدتان متماثلتان وراثيًا",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-07",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "الانقسام المتساوي",
    "type": "choice",
    "q": "عدد الكروموسومات في الخلايا الناتجة من الانقسام المتساوي يكون:",
    "options": [
      "نصف العدد دائمًا",
      "ضعف العدد دائمًا",
      "صفرًا",
      "مساويًا للخلية الأصلية"
    ],
    "answer": 3,
    "explain": "مساويًا للخلية الأصلية",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-08",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "التكاثر اللاجنسي",
    "type": "choice",
    "q": "التكاثر الذي يحتاج إلى أب واحد فقط يسمى:",
    "options": [
      "التكاثر اللاجنسي",
      "التكاثر الجنسي",
      "الإخصاب",
      "الانقسام المنصف فقط"
    ],
    "answer": 0,
    "explain": "التكاثر اللاجنسي",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-09",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "التكاثر اللاجنسي",
    "type": "choice",
    "q": "من أمثلة التكاثر اللاجنسي:",
    "options": [
      "الإخصاب بين مشيجين",
      "التبرعم في الهيدرا",
      "اتحاد حيوان منوي وبويضة",
      "تكوين اللاقحة"
    ],
    "answer": 1,
    "explain": "التبرعم في الهيدرا",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-10",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "التكاثر الجنسي",
    "type": "choice",
    "q": "اتحاد الحيوان المنوي والبويضة يسمى:",
    "options": [
      "الانتشار",
      "الانقسام المتساوي",
      "الإخصاب",
      "الأسموزية"
    ],
    "answer": 2,
    "explain": "الإخصاب",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-11",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "الإخصاب",
    "type": "choice",
    "q": "الخلية الناتجة مباشرة من الإخصاب تسمى:",
    "options": [
      "المشيج",
      "الكروماتيد",
      "الفجوة",
      "اللاقحة"
    ],
    "answer": 3,
    "explain": "اللاقحة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-12",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "الكروموسومات",
    "type": "choice",
    "q": "الخلايا الجسمية تحتوي عادة على عدد كروموسومات:",
    "options": [
      "ثنائي المجموعة",
      "أحادي المجموعة",
      "صفري",
      "غير محدد"
    ],
    "answer": 0,
    "explain": "ثنائي المجموعة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-13",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "الأمشاج",
    "type": "choice",
    "q": "الأمشاج تحتوي على عدد كروموسومات:",
    "options": [
      "ثنائي المجموعة",
      "أحادي المجموعة",
      "ثلاثي المجموعة",
      "أربعة أضعاف"
    ],
    "answer": 1,
    "explain": "أحادي المجموعة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-14",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "الانقسام المنصف",
    "type": "choice",
    "q": "الانقسام الذي يخفض عدد الكروموسومات إلى النصف هو:",
    "options": [
      "الانقسام المتساوي",
      "الانشطار الثنائي",
      "الانقسام المنصف",
      "التبرعم"
    ],
    "answer": 2,
    "explain": "الانقسام المنصف",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-div-15",
    "lesson": "g3-cell-division-reproduction",
    "grade": "3",
    "concept": "الانقسام المنصف",
    "type": "choice",
    "q": "الهدف الرئيس من الانقسام المنصف هو تكوين:",
    "options": [
      "خلايا جلدية",
      "خلايا متطابقة للنمو",
      "فجوات غذائية",
      "الأمشاج"
    ],
    "answer": 3,
    "explain": "الأمشاج",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-01",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "DNA",
    "type": "choice",
    "q": "المادة الوراثية الأساسية في الخلية هي:",
    "options": [
      "DNA",
      "الماء",
      "الجلوكوز",
      "الأكسجين"
    ],
    "answer": 0,
    "explain": "DNA",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-02",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "DNA",
    "type": "choice",
    "q": "يوجد معظم DNA في الخلية حقيقية النواة داخل:",
    "options": [
      "الغشاء فقط",
      "النواة",
      "الفجوة",
      "الجدار الخلوي"
    ],
    "answer": 1,
    "explain": "النواة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-03",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "تركيب DNA",
    "type": "choice",
    "q": "يتكون جزيء DNA من:",
    "options": [
      "سلسلة واحدة فقط",
      "بروتين فقط",
      "سلسلتين ملتفتين",
      "دهون فقط"
    ],
    "answer": 2,
    "explain": "سلسلتين ملتفتين",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-04",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "القواعد النيتروجينية",
    "type": "choice",
    "q": "أي زوج من القواعد يرتبط في DNA؟",
    "options": [
      "A مع G",
      "C مع T",
      "G مع T",
      "A مع T"
    ],
    "answer": 3,
    "explain": "A مع T",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-05",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "القواعد النيتروجينية",
    "type": "choice",
    "q": "أي زوج من القواعد يرتبط في DNA؟",
    "options": [
      "C مع G",
      "C مع A",
      "G مع T",
      "A مع C"
    ],
    "answer": 0,
    "explain": "C مع G",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-06",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "تضاعف DNA",
    "type": "choice",
    "q": "عند تضاعف DNA تنفصل:",
    "options": [
      "النواة عن الخلية",
      "السلسلتان",
      "الرايبوسومات",
      "الأحماض الأمينية"
    ],
    "answer": 1,
    "explain": "السلسلتان",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-07",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "تضاعف DNA",
    "type": "choice",
    "q": "بعد تضاعف DNA ينتج:",
    "options": [
      "جزيء RNA فقط",
      "بروتين واحد",
      "جزيئان متطابقان من DNA",
      "كروموسوم بلا جينات"
    ],
    "answer": 2,
    "explain": "جزيئان متطابقان من DNA",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-08",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "الجينات",
    "type": "choice",
    "q": "الجين هو:",
    "options": [
      "نوع من الدهون",
      "عضية خلوية",
      "سكر بسيط",
      "جزء من DNA مسؤول عن تصنيع بروتين"
    ],
    "answer": 3,
    "explain": "جزء من DNA مسؤول عن تصنيع بروتين",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-09",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "الجينات",
    "type": "choice",
    "q": "يحتوي الكروموسوم الواحد على:",
    "options": [
      "مئات الجينات",
      "جين واحد فقط",
      "لا يحتوي جينات",
      "إنزيم واحد فقط"
    ],
    "answer": 0,
    "explain": "مئات الجينات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-10",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "تصنيع البروتين",
    "type": "choice",
    "q": "يحدث تصنيع البروتين في:",
    "options": [
      "النواة فقط",
      "الرايبوسومات",
      "الغشاء البلازمي",
      "الفجوة"
    ],
    "answer": 1,
    "explain": "الرايبوسومات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-11",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "RNA",
    "type": "choice",
    "q": "يحمل RNA الشفرة الوراثية من النواة إلى:",
    "options": [
      "الفجوة",
      "الجدار الخلوي",
      "الرايبوسوم",
      "الغشاء الخارجي"
    ],
    "answer": 2,
    "explain": "الرايبوسوم",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-12",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "RNA",
    "type": "choice",
    "q": "RNA مقارنة بـ DNA يتكون غالبًا من:",
    "options": [
      "سلسلتين دائمًا",
      "أربع سلاسل",
      "لا يحتوي قواعد",
      "سلسلة واحدة"
    ],
    "answer": 3,
    "explain": "سلسلة واحدة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-13",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "RNA",
    "type": "choice",
    "q": "القاعدة الموجودة في RNA بدل الثايمين هي:",
    "options": [
      "اليوراسيل U",
      "الأدينين A",
      "الجوانين G",
      "السايتوسين C"
    ],
    "answer": 0,
    "explain": "اليوراسيل U",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-14",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "أنواع RNA",
    "type": "choice",
    "q": "أي نوع من RNA يحمل الشفرة إلى الرايبوسوم؟",
    "options": [
      "tRNA فقط",
      "mRNA",
      "DNA",
      "ATP"
    ],
    "answer": 1,
    "explain": "mRNA",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-dna-15",
    "lesson": "g3-dna",
    "grade": "3",
    "concept": "تصنيع البروتين",
    "type": "choice",
    "q": "ترتيب الأحماض الأمينية في البروتين يتحدد بواسطة:",
    "options": [
      "كمية الماء",
      "حجم الخلية فقط",
      "الشفرة الوراثية",
      "لون النواة"
    ],
    "answer": 2,
    "explain": "الشفرة الوراثية",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-01",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "علم الوراثة",
    "type": "choice",
    "q": "العلم الذي يدرس انتقال الصفات من الآباء إلى الأبناء هو:",
    "options": [
      "علم البيئة",
      "علم الصخور",
      "علم الفلك",
      "علم الوراثة"
    ],
    "answer": 3,
    "explain": "علم الوراثة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-02",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "مندل",
    "type": "choice",
    "q": "العالم الذي ارتبطت تجاربه على البازلاء ببداية علم الوراثة هو:",
    "options": [
      "مندل",
      "رذرفورد",
      "طومسون",
      "دالتون"
    ],
    "answer": 0,
    "explain": "مندل",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-03",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "الصفات",
    "type": "choice",
    "q": "الصفة التي تظهر عند وجود جين سائد تسمى:",
    "options": [
      "صفة متنحية",
      "صفة سائدة",
      "طفرة فقط",
      "صفة مكتسبة"
    ],
    "answer": 1,
    "explain": "صفة سائدة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-04",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "الصفات",
    "type": "choice",
    "q": "الصفة المتنحية تظهر عندما يكون للمخلوق الحي:",
    "options": [
      "جين سائد واحد",
      "جينان سائدان دائمًا",
      "جينان متنحيان للصفة",
      "لا يحمل جينات"
    ],
    "answer": 2,
    "explain": "جينان متنحيان للصفة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-05",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "الطراز الجيني",
    "type": "choice",
    "q": "التركيب الجيني للمخلوق يسمى:",
    "options": [
      "الطراز الشكلي",
      "الصفة المكتسبة",
      "البيئة",
      "الطراز الجيني"
    ],
    "answer": 3,
    "explain": "الطراز الجيني",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-06",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "الطراز الشكلي",
    "type": "choice",
    "q": "المظهر الخارجي للصفة يسمى:",
    "options": [
      "الطراز الشكلي",
      "الطراز الجيني",
      "الجين المتنحي",
      "الكروموسوم"
    ],
    "answer": 0,
    "explain": "الطراز الشكلي",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-07",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "الطرز الجينية",
    "type": "choice",
    "q": "الفرد الذي يحمل جينين متماثلين للصفة يسمى:",
    "options": [
      "غير متماثل الجينات",
      "متماثل الجينات",
      "هجينًا دائمًا",
      "مكتسب الصفة"
    ],
    "answer": 1,
    "explain": "متماثل الجينات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-08",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "الطرز الجينية",
    "type": "choice",
    "q": "الفرد Bb يعد:",
    "options": [
      "متماثل الجينات السائد",
      "متماثل الجينات المتنحي",
      "غير متماثل الجينات",
      "بلا جينات"
    ],
    "answer": 2,
    "explain": "غير متماثل الجينات",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-09",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "مربع بانيت",
    "type": "choice",
    "q": "الأداة التي تستخدم لتوقع نتائج التزاوج الوراثي هي:",
    "options": [
      "مقياس رختر",
      "السيزموجراف",
      "الجدول الدوري",
      "مربع بانيت"
    ],
    "answer": 3,
    "explain": "مربع بانيت",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-10",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "تجارب مندل",
    "type": "choice",
    "q": "في تجارب مندل ظهر في الجيل الثاني تقريبًا نسبة:",
    "options": [
      "3 سائدة إلى 1 متنحية",
      "1 إلى 1 دائمًا",
      "4 متنحية إلى 0 سائدة",
      "2 إلى 3"
    ],
    "answer": 0,
    "explain": "3 سائدة إلى 1 متنحية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-11",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "الصفات المتنحية",
    "type": "choice",
    "q": "إذا كان B سائدًا و b متنحيًا، فأي طراز يعطي الصفة المتنحية؟",
    "options": [
      "BB",
      "bb",
      "Bb",
      "B-"
    ],
    "answer": 1,
    "explain": "bb",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-12",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "مربع بانيت",
    "type": "choice",
    "q": "عند تزاوج Bb × bb تكون نسبة النسل ذي الصفة السائدة حسب المثال:",
    "options": [
      "100%",
      "25%",
      "50%",
      "0%"
    ],
    "answer": 2,
    "explain": "50%",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-13",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "الصفات",
    "type": "choice",
    "q": "إذا كان اللون الأصفر Y سائدًا على الأخضر y، فإن النبات yy يكون:",
    "options": [
      "أصفر البذور",
      "أحمر البذور",
      "لا لون له",
      "أخضر البذور"
    ],
    "answer": 3,
    "explain": "أخضر البذور",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-14",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "الطفرات",
    "type": "choice",
    "q": "الطفرات يمكن أن تحدث في:",
    "options": [
      "الجينات السائدة والمتنحية",
      "الجينات السائدة فقط",
      "الجينات المتنحية فقط",
      "لا تحدث في الجينات"
    ],
    "answer": 0,
    "explain": "الجينات السائدة والمتنحية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-gen-15",
    "lesson": "g3-genetics",
    "grade": "3",
    "concept": "الطفرات",
    "type": "choice",
    "q": "الطفرة قد تكون:",
    "options": [
      "مفيدة دائمًا",
      "مفيدة أو ضارة أو بلا تأثير واضح",
      "ضارة دائمًا",
      "لا تنتقل أبدًا"
    ],
    "answer": 1,
    "explain": "مفيدة أو ضارة أو بلا تأثير واضح",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-01",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "دالتون",
    "type": "choice",
    "q": "من أفكار دالتون أن المادة تتكون من:",
    "options": [
      "خلايا",
      "أمواج",
      "ذرات",
      "صفائح"
    ],
    "answer": 2,
    "explain": "ذرات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-02",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "كروكس",
    "type": "choice",
    "q": "تجارب كروكس استخدمت:",
    "options": [
      "السيزموجراف",
      "مقياس رختر",
      "المجهر الضوئي",
      "أنبوب الأشعة المهبطية"
    ],
    "answer": 3,
    "explain": "أنبوب الأشعة المهبطية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-03",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "الأشعة المهبطية",
    "type": "choice",
    "q": "تتحرك جسيمات الأشعة المهبطية من:",
    "options": [
      "المهبط إلى المصعد",
      "المصعد إلى المهبط",
      "النواة إلى الغشاء",
      "السطح إلى المركز"
    ],
    "answer": 0,
    "explain": "المهبط إلى المصعد",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-04",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "طومسون",
    "type": "choice",
    "q": "استنتج طومسون أن الأشعة المهبطية جسيمات مشحونة لأن:",
    "options": [
      "لونها أخضر",
      "المغناطيس سبب انحناءها",
      "حرارتها مرتفعة",
      "توقفت في الهواء"
    ],
    "answer": 1,
    "explain": "المغناطيس سبب انحناءها",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-05",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "الإلكترون",
    "type": "choice",
    "q": "الجسيمات التي اكتشفها طومسون وسميت لاحقًا هي:",
    "options": [
      "البروتونات",
      "النيوترونات",
      "الإلكترونات",
      "الفوتونات"
    ],
    "answer": 2,
    "explain": "الإلكترونات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-06",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "الإلكترون",
    "type": "choice",
    "q": "شحنة الإلكترون هي:",
    "options": [
      "موجبة",
      "متعادلة",
      "متغيرة دائمًا",
      "سالبة"
    ],
    "answer": 3,
    "explain": "سالبة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-07",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "طومسون",
    "type": "choice",
    "q": "استنتج طومسون أن الإلكترونات موجودة في:",
    "options": [
      "جميع أنواع الذرات",
      "بعض الفلزات فقط",
      "الغازات فقط",
      "الماء فقط"
    ],
    "answer": 0,
    "explain": "جميع أنواع الذرات",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-08",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "نموذج طومسون",
    "type": "choice",
    "q": "نموذج طومسون صور الذرة على أنها:",
    "options": [
      "نواة فقط",
      "كرة موجبة تنتشر فيها إلكترونات سالبة",
      "إلكترونات بلا شحنة",
      "كرة مصمتة بلا أجزاء"
    ],
    "answer": 1,
    "explain": "كرة موجبة تنتشر فيها إلكترونات سالبة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-09",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "رذرفورد",
    "type": "choice",
    "q": "في تجربة رذرفورد استخدمت صفيحة رقيقة من:",
    "options": [
      "الحديد",
      "الألومنيوم",
      "الذهب",
      "النحاس"
    ],
    "answer": 2,
    "explain": "الذهب",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-10",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "رذرفورد",
    "type": "choice",
    "q": "معظم جسيمات ألفا في تجربة رذرفورد:",
    "options": [
      "ارتدت جميعها",
      "توقفت كلها",
      "تحولت إلى إلكترونات",
      "مرت خلال صفيحة الذهب دون انحراف كبير"
    ],
    "answer": 3,
    "explain": "مرت خلال صفيحة الذهب دون انحراف كبير",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-11",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "النواة",
    "type": "choice",
    "q": "ارتداد عدد قليل من جسيمات ألفا دل على وجود:",
    "options": [
      "نواة صغيرة كثيفة موجبة",
      "فراغ بلا نواة",
      "إلكترونات موجبة",
      "ذرة مصمتة تمامًا"
    ],
    "answer": 0,
    "explain": "نواة صغيرة كثيفة موجبة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-12",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "نموذج رذرفورد",
    "type": "choice",
    "q": "استنتج رذرفورد أن معظم حجم الذرة:",
    "options": [
      "نواة صلبة",
      "فراغ",
      "إلكترونات متلاصقة",
      "مادة سائلة"
    ],
    "answer": 1,
    "explain": "فراغ",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-13",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "البروتون",
    "type": "choice",
    "q": "الجسيم الموجب الموجود في النواة يسمى:",
    "options": [
      "الإلكترون",
      "النيوترون",
      "البروتون",
      "الفوتون"
    ],
    "answer": 2,
    "explain": "البروتون",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-14",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "النيوترون",
    "type": "choice",
    "q": "الجسيم المتعادل الموجود في النواة يسمى:",
    "options": [
      "البروتون",
      "الإلكترون",
      "الأيون",
      "النيوترون"
    ],
    "answer": 3,
    "explain": "النيوترون",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-atom-15",
    "lesson": "g3-atomic-models",
    "grade": "3",
    "concept": "تطور النماذج",
    "type": "choice",
    "q": "تغير نماذج الذرة عبر الزمن يدل على أن النماذج العلمية:",
    "options": [
      "تتطور مع ظهور أدلة جديدة",
      "لا تتغير أبدًا",
      "تعتمد على التخمين فقط",
      "تلغي التجارب"
    ],
    "answer": 0,
    "explain": "تتطور مع ظهور أدلة جديدة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-01",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "العدد الذري",
    "type": "choice",
    "q": "العدد الذري للعنصر يساوي عدد:",
    "options": [
      "النيوترونات",
      "البروتونات",
      "الإلكترونات والنيوترونات معًا",
      "النظائر"
    ],
    "answer": 1,
    "explain": "البروتونات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-02",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "النظائر",
    "type": "choice",
    "q": "ذرات العنصر نفسه تتفق في عدد:",
    "options": [
      "النيوترونات دائمًا",
      "الكتلة دائمًا",
      "البروتونات",
      "مستوى النشاط الإشعاعي"
    ],
    "answer": 2,
    "explain": "البروتونات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-03",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "النظائر",
    "type": "choice",
    "q": "النظائر هي ذرات للعنصر نفسه تختلف في عدد:",
    "options": [
      "البروتونات",
      "العدد الذري",
      "نوع العنصر",
      "النيوترونات"
    ],
    "answer": 3,
    "explain": "النيوترونات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-04",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "العدد الكتلي",
    "type": "choice",
    "q": "العدد الكتلي يساوي مجموع:",
    "options": [
      "البروتونات والنيوترونات",
      "الإلكترونات فقط",
      "البروتونات والإلكترونات",
      "النيوترونات والإلكترونات"
    ],
    "answer": 0,
    "explain": "البروتونات والنيوترونات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-05",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "العدد الكتلي",
    "type": "choice",
    "q": "ذرة كربون-14 تحتوي على 6 بروتونات، فعدد نيوتروناتها:",
    "options": [
      "6",
      "8",
      "14",
      "20"
    ],
    "answer": 1,
    "explain": "8",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-06",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "التحلل الإشعاعي",
    "type": "choice",
    "q": "التحلل الإشعاعي يحدث في:",
    "options": [
      "الأنوية المستقرة فقط",
      "الإلكترونات فقط",
      "الأنوية غير المستقرة",
      "الجزيئات غير المشحونة"
    ],
    "answer": 2,
    "explain": "الأنوية غير المستقرة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-07",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "عمر النصف",
    "type": "choice",
    "q": "عمر النصف هو الزمن اللازم لكي:",
    "options": [
      "تتضاعف الكتلة",
      "تختفي جميع الذرات",
      "يتوقف النشاط تمامًا",
      "تتحلل نصف كتلة العنصر المشع"
    ],
    "answer": 3,
    "explain": "تتحلل نصف كتلة العنصر المشع",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-08",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "عمر النصف",
    "type": "choice",
    "q": "إذا كان عمر نصف اليود-131 ثمانية أيام وبدأت بكتلة 4 جم، فبعد 8 أيام تبقى:",
    "options": [
      "2 جم",
      "4 جم",
      "1 جم",
      "0.5 جم"
    ],
    "answer": 0,
    "explain": "2 جم",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-09",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "عمر النصف",
    "type": "choice",
    "q": "إذا بدأت بـ4 جم من اليود-131، فبعد 16 يومًا تبقى:",
    "options": [
      "2 جم",
      "1 جم",
      "4 جم",
      "0.25 جم"
    ],
    "answer": 1,
    "explain": "1 جم",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-10",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "عمر النصف",
    "type": "choice",
    "q": "إذا كان عمر نصف التريتيوم 12.5 سنة وبدأت بـ20 جم، فبعد 50 سنة تبقى:",
    "options": [
      "10 جم",
      "5 جم",
      "1.25 جم",
      "2.5 جم"
    ],
    "answer": 2,
    "explain": "1.25 جم",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-11",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "التأريخ الكربوني",
    "type": "choice",
    "q": "يستخدم الكربون-14 لتقدير عمر:",
    "options": [
      "الصخور القديمة جدًا فقط",
      "الكواكب",
      "المعادن المصهورة",
      "بقايا المخلوقات الحية"
    ],
    "answer": 3,
    "explain": "بقايا المخلوقات الحية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-12",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "تأريخ الصخور",
    "type": "choice",
    "q": "لتحديد عمر الصخور يستخدم العلماء تحلل:",
    "options": [
      "اليورانيوم-238",
      "الكربون-14 فقط",
      "الأكسجين",
      "النيتروجين"
    ],
    "answer": 0,
    "explain": "اليورانيوم-238",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-13",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "النفايات المشعة",
    "type": "choice",
    "q": "يجب عزل النفايات المشعة عن:",
    "options": [
      "الهواء فقط",
      "الناس والبيئة",
      "الماء فقط",
      "التربة فقط"
    ],
    "answer": 1,
    "explain": "الناس والبيئة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-14",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "العناصر المصنعة",
    "type": "choice",
    "q": "العناصر المصنعة تنتج باستخدام:",
    "options": [
      "المجاهر",
      "السيزموجراف",
      "مسرعات الجسيمات",
      "المسطرة"
    ],
    "answer": 2,
    "explain": "مسرعات الجسيمات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-nuc-15",
    "lesson": "g3-nucleus",
    "grade": "3",
    "concept": "النظائر المشعة",
    "type": "choice",
    "q": "يمكن استخدام النظائر المشعة في الطب بوصفها:",
    "options": [
      "وقودًا غذائيًا",
      "بديلًا للماء",
      "مادة لبناء العظام مباشرة",
      "عناصر متتبعة لتشخيص بعض الأمراض"
    ],
    "answer": 3,
    "explain": "عناصر متتبعة لتشخيص بعض الأمراض",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-01",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "الجدول الدوري",
    "type": "choice",
    "q": "ترتب العناصر في الجدول الدوري الحديث حسب:",
    "options": [
      "العدد الذري",
      "الكتلة فقط",
      "اللون",
      "الحالة فقط"
    ],
    "answer": 0,
    "explain": "العدد الذري",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-02",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "الدورات",
    "type": "choice",
    "q": "الصفوف الأفقية في الجدول الدوري تسمى:",
    "options": [
      "مجموعات",
      "دورات",
      "سلاسل غذائية",
      "طبقات"
    ],
    "answer": 1,
    "explain": "دورات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-03",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "المجموعات",
    "type": "choice",
    "q": "الأعمدة الرأسية في الجدول الدوري تسمى:",
    "options": [
      "دورات",
      "مدارات",
      "مجموعات",
      "صفائح"
    ],
    "answer": 2,
    "explain": "مجموعات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-04",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "الدورات",
    "type": "choice",
    "q": "يزداد العدد الذري في الدورة من:",
    "options": [
      "اليمين إلى اليسار",
      "أعلى إلى أسفل فقط",
      "لا يتغير",
      "اليسار إلى اليمين"
    ],
    "answer": 3,
    "explain": "اليسار إلى اليمين",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-05",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "المجموعات",
    "type": "choice",
    "q": "عناصر المجموعة الواحدة تتشابه غالبًا في:",
    "options": [
      "خواصها الكيميائية",
      "أعدادها الذرية نفسها",
      "كتلها نفسها",
      "حالتها دائمًا"
    ],
    "answer": 0,
    "explain": "خواصها الكيميائية",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-06",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "مفتاح العنصر",
    "type": "choice",
    "q": "مفتاح العنصر في الجدول الدوري يوضح:",
    "options": [
      "اسم العالم فقط",
      "اسم العنصر ورمزه وعدده الذري وكتلته",
      "لون العنصر فقط",
      "موقعه الجغرافي"
    ],
    "answer": 1,
    "explain": "اسم العنصر ورمزه وعدده الذري وكتلته",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-07",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "رموز العناصر",
    "type": "choice",
    "q": "الرمز H في مفتاح العنصر يمثل:",
    "options": [
      "الهيليوم",
      "الزئبق",
      "الهيدروجين",
      "الهولميوم"
    ],
    "answer": 2,
    "explain": "الهيدروجين",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-08",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "مفتاح العنصر",
    "type": "choice",
    "q": "الحالة الفيزيائية للعنصر عند درجة حرارة الغرفة يمكن معرفتها من:",
    "options": [
      "عدد الدورات فقط",
      "اسم المجموعة فقط",
      "رقم الصفحة",
      "مفتاح العنصر"
    ],
    "answer": 3,
    "explain": "مفتاح العنصر",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-09",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "حالات العناصر",
    "type": "choice",
    "q": "معظم العناصر في الجدول الدوري عند درجة حرارة الغرفة تكون:",
    "options": [
      "صلبة",
      "غازية",
      "سائلة",
      "بلا حالة"
    ],
    "answer": 0,
    "explain": "صلبة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-10",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "حالات العناصر",
    "type": "choice",
    "q": "عدد العناصر السائلة عند درجة حرارة الغرفة في الجدول المشار إليه هو:",
    "options": [
      "عنصر واحد",
      "عنصران",
      "عشرة عناصر",
      "كل العناصر"
    ],
    "answer": 1,
    "explain": "عنصران",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-11",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "العناصر المصنعة",
    "type": "choice",
    "q": "العناصر التي لا توجد طبيعيًا ويصنعها الإنسان يشار إليها بأنها:",
    "options": [
      "غازات نبيلة",
      "هالوجينات",
      "عناصر مصنعة",
      "عناصر ممثلة فقط"
    ],
    "answer": 2,
    "explain": "عناصر مصنعة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-12",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "الدورية",
    "type": "choice",
    "q": "وجود العنصر في مجموعة معينة يساعد على توقع:",
    "options": [
      "اسمه فقط",
      "لونه فقط",
      "درجة حرارة الغرفة فقط",
      "خواصه وطريقة اتحاده"
    ],
    "answer": 3,
    "explain": "خواصه وطريقة اتحاده",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-13",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "الدورية",
    "type": "choice",
    "q": "موقع العنصر في الجدول الدوري يدل على:",
    "options": [
      "كيفية اتحاده مع عناصر أخرى",
      "سرعة الموجات الزلزالية",
      "نوع الصخر",
      "عدد الخلايا"
    ],
    "answer": 0,
    "explain": "كيفية اتحاده مع عناصر أخرى",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-14",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "الدورية",
    "type": "choice",
    "q": "تكرار نمط الخواص عند ترتيب العناصر يسمى:",
    "options": [
      "الانتشار",
      "الدورية",
      "التأين فقط",
      "التوازن"
    ],
    "answer": 1,
    "explain": "الدورية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-pt-15",
    "lesson": "g3-periodic-table-intro",
    "grade": "3",
    "concept": "المجموعات",
    "type": "choice",
    "q": "إذا كان عنصران في المجموعة نفسها فالمتوقع أن تكون خواصهما الكيميائية:",
    "options": [
      "متطابقة في الكتلة",
      "مختلفة دائمًا",
      "متشابهة",
      "بلا علاقة"
    ],
    "answer": 2,
    "explain": "متشابهة",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-01",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "العناصر الممثلة",
    "type": "choice",
    "q": "العناصر الممثلة تقع في المجموعات:",
    "options": [
      "3 إلى 12 فقط",
      "اللانثانيدات فقط",
      "الأكتنيدات فقط",
      "1 و2 و13 إلى 18"
    ],
    "answer": 3,
    "explain": "1 و2 و13 إلى 18",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-02",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "المجموعة 1",
    "type": "choice",
    "q": "عناصر المجموعة الأولى تسمى:",
    "options": [
      "الفلزات القلوية",
      "الغازات النبيلة",
      "الهالوجينات",
      "العناصر الانتقالية"
    ],
    "answer": 0,
    "explain": "الفلزات القلوية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-03",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "المجموعة 1",
    "type": "choice",
    "q": "الفلزات القلوية توصف بأنها:",
    "options": [
      "خاملة تمامًا",
      "شديدة التفاعل",
      "غازات دائمًا",
      "أشباه فلزات"
    ],
    "answer": 1,
    "explain": "شديدة التفاعل",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-04",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "المجموعة 2",
    "type": "choice",
    "q": "عناصر المجموعة الثانية تسمى:",
    "options": [
      "الهالوجينات",
      "الغازات النبيلة",
      "الفلزات القلوية الأرضية",
      "الأكتنيدات"
    ],
    "answer": 2,
    "explain": "الفلزات القلوية الأرضية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-05",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "المجموعة 14",
    "type": "choice",
    "q": "أي عنصر ينتمي إلى مجموعة الكربون؟",
    "options": [
      "الصوديوم",
      "الهيليوم",
      "الحديد",
      "الكربون"
    ],
    "answer": 3,
    "explain": "الكربون",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-06",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "المجموعة 14",
    "type": "choice",
    "q": "السليكون والجرمانيوم يصنفان على أنهما:",
    "options": [
      "أشباه فلزات",
      "غازات نبيلة",
      "فلزات قلوية",
      "هالوجينات"
    ],
    "answer": 0,
    "explain": "أشباه فلزات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-07",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "استخدامات السليكون",
    "type": "choice",
    "q": "يستخدم السليكون في صناعة:",
    "options": [
      "مقياس رختر",
      "رقاقات الحاسوب",
      "السيزموجراف",
      "أنابيب الرصد الزلزالي"
    ],
    "answer": 1,
    "explain": "رقاقات الحاسوب",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-08",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "أشباه الموصلات",
    "type": "choice",
    "q": "أشباه الموصلات توصل الكهرباء:",
    "options": [
      "أكثر من الفلزات دائمًا",
      "لا توصل مطلقًا",
      "أقل من الفلزات وأكثر من اللافلزات",
      "مثل الفراغ"
    ],
    "answer": 2,
    "explain": "أقل من الفلزات وأكثر من اللافلزات",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-09",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "استخدامات الرصاص",
    "type": "choice",
    "q": "يستخدم الرصاص للوقاية من:",
    "options": [
      "الأمطار",
      "الموجات الصوتية",
      "الضوء المرئي",
      "أشعة X"
    ],
    "answer": 3,
    "explain": "أشعة X",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-10",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "الكربون",
    "type": "choice",
    "q": "تحتوي أجسام المخلوقات الحية على مركبات:",
    "options": [
      "الكربون",
      "الهيليوم فقط",
      "النيون فقط",
      "الأرجون فقط"
    ],
    "answer": 0,
    "explain": "الكربون",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-11",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "الهالوجينات",
    "type": "choice",
    "q": "عناصر المجموعة 17 تسمى:",
    "options": [
      "الغازات النبيلة",
      "الهالوجينات",
      "الفلزات القلوية",
      "العناصر الانتقالية"
    ],
    "answer": 1,
    "explain": "الهالوجينات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-12",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "الهالوجينات",
    "type": "choice",
    "q": "الهالوجينات عناصر:",
    "options": [
      "خاملة تمامًا",
      "كلها فلزات",
      "شديدة التفاعل",
      "لا تتحد مع غيرها"
    ],
    "answer": 2,
    "explain": "شديدة التفاعل",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-13",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "الغازات النبيلة",
    "type": "choice",
    "q": "عناصر المجموعة 18 تسمى:",
    "options": [
      "الهالوجينات",
      "الفلزات القلوية",
      "الأكتنيدات",
      "الغازات النبيلة"
    ],
    "answer": 3,
    "explain": "الغازات النبيلة",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-14",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "الغازات النبيلة",
    "type": "choice",
    "q": "الغازات النبيلة تتميز بأنها:",
    "options": [
      "قليلة التفاعل كيميائيًا",
      "شديدة التفاعل دائمًا",
      "فلزات صلبة",
      "تكوّن أملاحًا بسهولة"
    ],
    "answer": 0,
    "explain": "قليلة التفاعل كيميائيًا",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-rep-15",
    "lesson": "g3-representative-elements",
    "grade": "3",
    "concept": "الغازات النبيلة",
    "type": "choice",
    "q": "إذا أردت عنصرًا لاستخدامه في بالون بسبب خفة وزنه وقلة تفاعله، فالأنسب:",
    "options": [
      "الكلور",
      "الهيليوم",
      "الصوديوم",
      "الحديد"
    ],
    "answer": 1,
    "explain": "الهيليوم",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-01",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "العناصر الانتقالية",
    "type": "choice",
    "q": "تقع العناصر الانتقالية في المجموعات:",
    "options": [
      "1 و2 فقط",
      "13 إلى 18 فقط",
      "3 إلى 12",
      "المجموعة 18 فقط"
    ],
    "answer": 2,
    "explain": "3 إلى 12",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-02",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "خصائص العناصر الانتقالية",
    "type": "choice",
    "q": "معظم العناصر الانتقالية هي:",
    "options": [
      "غازات نبيلة",
      "لافلزات",
      "هالوجينات",
      "فلزات"
    ],
    "answer": 3,
    "explain": "فلزات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-03",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "خصائص العناصر الانتقالية",
    "type": "choice",
    "q": "من خصائص كثير من العناصر الانتقالية:",
    "options": [
      "توصيل الكهرباء والحرارة",
      "عدم التوصيل مطلقًا",
      "كونها غازات فقط",
      "خمولها التام"
    ],
    "answer": 0,
    "explain": "توصيل الكهرباء والحرارة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-04",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "استخدامات العناصر الانتقالية",
    "type": "choice",
    "q": "تستخدم كثير من العناصر الانتقالية في:",
    "options": [
      "منع جميع التفاعلات",
      "الصناعات المختلفة",
      "تكوين الماء فقط",
      "إلغاء الكهرباء"
    ],
    "answer": 1,
    "explain": "الصناعات المختلفة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-05",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "العوامل المحفزة",
    "type": "choice",
    "q": "المادة التي تساعد على زيادة سرعة التفاعل الكيميائي دون أن تُستهلك تسمى:",
    "options": [
      "متفاعلًا رئيسيًا",
      "نظيرًا",
      "عاملًا محفزًا",
      "مذيبًا"
    ],
    "answer": 2,
    "explain": "عاملًا محفزًا",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-06",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "العوامل المحفزة",
    "type": "choice",
    "q": "تستخدم بعض العناصر الانتقالية كعوامل محفزة لأنها:",
    "options": [
      "توقف جميع التفاعلات",
      "تمنع تكوين المركبات",
      "تحول الفلز إلى غاز دائمًا",
      "تساعد على تسريع التفاعلات"
    ],
    "answer": 3,
    "explain": "تساعد على تسريع التفاعلات",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-07",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "العناصر الانتقالية الداخلية",
    "type": "choice",
    "q": "العناصر الانتقالية الداخلية تتكون من سلسلتي:",
    "options": [
      "اللانثانيدات والأكتنيدات",
      "الهالوجينات والغازات النبيلة",
      "القلويات والقلويات الأرضية",
      "المجموعة 13 و14"
    ],
    "answer": 0,
    "explain": "اللانثانيدات والأكتنيدات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-08",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "اللانثانيدات",
    "type": "choice",
    "q": "سلسلة اللانثانيدات تعد من:",
    "options": [
      "الفلزات القلوية",
      "العناصر الانتقالية الداخلية",
      "الهالوجينات",
      "الغازات النبيلة"
    ],
    "answer": 1,
    "explain": "العناصر الانتقالية الداخلية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-09",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "الأكتنيدات",
    "type": "choice",
    "q": "سلسلة الأكتنيدات تعد من:",
    "options": [
      "العناصر الممثلة فقط",
      "الهالوجينات",
      "العناصر الانتقالية الداخلية",
      "الغازات النبيلة"
    ],
    "answer": 2,
    "explain": "العناصر الانتقالية الداخلية",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-10",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "اليورانيوم",
    "type": "choice",
    "q": "أي عنصر هو الأثقل الموجود طبيعيًا في القشرة الأرضية حسب الدرس؟",
    "options": [
      "الهيدروجين",
      "الهيليوم",
      "الكربون",
      "اليورانيوم"
    ],
    "answer": 3,
    "explain": "اليورانيوم",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-11",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "اليورانيوم",
    "type": "choice",
    "q": "العدد الذري لليورانيوم هو:",
    "options": [
      "92",
      "26",
      "79",
      "118"
    ],
    "answer": 0,
    "explain": "92",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-12",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "العناصر المصنعة",
    "type": "choice",
    "q": "العناصر الأثقل من اليورانيوم تُصنع باستخدام:",
    "options": [
      "مقياس رختر",
      "مسرعات الجسيمات",
      "المجهر الضوئي",
      "المسطرة"
    ],
    "answer": 1,
    "explain": "مسرعات الجسيمات",
    "difficulty": "remember",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-13",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "تصنيع العناصر",
    "type": "choice",
    "q": "عند تصنيع عنصر أثقل تُقذف الأنوية بـ:",
    "options": [
      "موجات صوتية فقط",
      "قطرات ماء",
      "جسيمات سريعة",
      "ضوء مرئي فقط"
    ],
    "answer": 2,
    "explain": "جسيمات سريعة",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-14",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "العناصر المصنعة",
    "type": "choice",
    "q": "كثير من العناصر الثقيلة المصنعة تكون:",
    "options": [
      "غازات نبيلة مستقرة دائمًا",
      "غير ذرية",
      "بلا نواة",
      "نظائر مشعة قصيرة العمر"
    ],
    "answer": 3,
    "explain": "نظائر مشعة قصيرة العمر",
    "difficulty": "understand",
    "track": "core",
    "source": "كتاب الطالب"
  },
  {
    "id": "g3-tr-15",
    "lesson": "g3-transition-elements",
    "grade": "3",
    "concept": "العناصر الانتقالية",
    "type": "choice",
    "q": "أي مما يأتي مثال على عنصر انتقالي؟",
    "options": [
      "الحديد",
      "الهيليوم",
      "الكلور",
      "الصوديوم"
    ],
    "answer": 0,
    "explain": "الحديد",
    "difficulty": "apply",
    "track": "core",
    "source": "كتاب الطالب"
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

  // دمج أسئلة ثالث متوسط مع البنك الحالي دون تكرار.
  const questionMap = new Map(
    (root.questions || []).map(q => [String(q.id), {
      ...q,
      grade: String(
        q.grade ||
        (String(q.lesson || '').startsWith('g3-') ? '3' : '1')
      )
    }])
  );

  thirdGradeQuestions.forEach(q => {
    questionMap.set(String(q.id), q);
  });

  root.questions = [...questionMap.values()];

  window.SCIENCE_THIRD_GRADE_LESSON_IDS =
    thirdGradeLessons.map(l => l.id);

  window.SCIENCE_THIRD_GRADE_BOOK_QUESTION_IDS =
    thirdGradeQuestions.map(q => q.id);

})();


// ============================================================
// الهوية البصرية لبنك ثالث متوسط — رحلة العلوم
// لا تغيّر نصوص الأسئلة أو الإجابات؛ تضيف العرض البصري فقط.
// ============================================================
(function () {
  const root = window.SCIENCE_DATA = window.SCIENCE_DATA || { lessons: [], questions: [] };
  window.SCIENCE_G3_VISUAL_IDENTITY = {
    version: "2026-09-26-g3-visual-1", grade: "3",
    title: "رحلة العلوم — ثالث متوسط",
    school: "مدرسة أبي الدرداء المتوسطة", teacher: "علي طاهر البقاشي", year: "1448هـ",
    theme: {navy:"#063f81",blue:"#0f76c7",teal:"#008073",gold:"#e7b029",red:"#c02d30",surface:"#f6fafc"},
    cardStyle: "reference-book", sourcePolicy: "student-book-only"
  };
  const LESSON_VISUALS={
    "g3-science-method":"science-method",
    "g3-science-work":"scientific-investigation",
    "g3-science-technology-society":"science-technology-society",
    "g3-earthquakes":"earthquake-waves",
    "g3-volcanoes":"volcano",
    "g3-plates-earthquakes-volcanoes":"plate-tectonics",
    "g3-cell-activities":"cell-membrane",
    "g3-cell-division-reproduction":"cell-division",
    "g3-dna":"dna",
    "g3-genetics":"genetics",
    "g3-atomic-models":"atom-model",
    "g3-nucleus":"nucleus",
    "g3-periodic-table-intro":"periodic-table",
    "g3-representative-elements":"representative-elements",
    "g3-transition-elements":"transition-elements"
  };
  const CONCEPT_VISUALS=[
    [/قياس|أدوات القياس|درجة الحرارة|طول/i,"measurement"],
    [/بيانات|تسجيل البيانات|رسم|جدول/i,"data-chart"],
    [/بحث تجريبي|متغير|تجربة/i,"experiment"],
    [/بحث وصفي|ملاحظة/i,"observation"],
    [/موجات زلزالية|السيزموجراف|زلازل/i,"earthquake-waves"],
    [/بركان|حمم|لابة|مقذوفات/i,"volcano"],
    [/صفائح|حدود|بقع ساخنة/i,"plate-tectonics"],
    [/خلية|غشاء|انتشار|أسموزية|طاقة/i,"cell-membrane"],
    [/انقسام|ميتوزي|منصف|دورة الخلية/i,"cell-division"],
    [/DNA|RNA|جين|بروتين/i,"dna"],
    [/مندل|وراثة|صفة|احتمال/i,"genetics"],
    [/ذرة|إلكترون|نموذج الذرة/i,"atom-model"],
    [/نواة|نظير|تحلل|عمر النصف|إشعاع/i,"nucleus"],
    [/جدول دوري|دورة|مجموعة|عدد ذري/i,"periodic-table"],
    [/قلوية|هالوجين|غازات نبيلة|العناصر الممثلة/i,"representative-elements"],
    [/انتقالية|لانثانيدات|أكتنيدات/i,"transition-elements"]
  ];
  function resolveVisual(q){
    const blob=[q&&q.concept,q&&q.q,q&&q.explain].filter(Boolean).join(" ");
    for(const pair of CONCEPT_VISUALS){ if(pair[0].test(blob)) return pair[1]; }
    return LESSON_VISUALS[String(q&&q.lesson||"")]||"science-method";
  }
  root.lessons=(root.lessons||[]).map(l=>{
    if(String(l.grade||"")!=="3"&&!String(l.id||"").startsWith("g3-")) return l;
    return {...l,visualIdentity:"g3-reference-book",heroVisual:LESSON_VISUALS[String(l.id||"")]||"science-method"};
  });
  root.questions=(root.questions||[]).map(q=>{
    if(String(q.grade||"")!=="3"&&!String(q.lesson||"").startsWith("g3-")) return q;
    return {...q,visualIdentity:"g3-reference-book",visual:q.visual||resolveVisual(q)};
  });
})();
