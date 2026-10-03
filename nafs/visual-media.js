// NAFS real-media mapping
// عرض الصور الواقعية المرتبطة بالسؤال فقط، دون تعديل نصوص الأسئلة أو الإجابات.
// 2026-10-03

(function () {
  const img = (src, alt) =>
    `<img src="${src}" alt="${alt}" loading="eager" decoding="async">`;

  window.NAFS_VISUAL_MEDIA = {
    // أنواع الصخور ودورة الصخور
    "NAFS-0648": img("./rock-cycle.webp", "صورة واقعية توضح دورة الصخور"),
    "NAFS-0650": img("./rock-cycle.webp", "صورة واقعية توضح دورة الصخور"),
    "NAFS-0651": img("./rock-cycle.webp", "صورة واقعية توضح دورة الصخور"),
    "NAFS-0652": img("./rock-cycle.webp", "صورة واقعية توضح دورة الصخور"),
    "NAFS-0653": img("./rock-cycle.webp", "صورة واقعية توضح دورة الصخور"),
    "NAFS-0654": img("./rock-cycle.webp", "صورة واقعية توضح دورة الصخور"),
    "NAFS-0658": img("./rock-cycle.webp", "صورة واقعية توضح دورة الصخور"),
    "NAFS-0660": img("./rock-cycle.webp", "صورة واقعية توضح دورة الصخور"),

    // الإجهادات والزلازل والبراكين
    "NAFS-0663": img("./volcano-structure.webp", "صورة واقعية توضح تركيب البركان"),
    "NAFS-0665": img("./earthquake-fault.webp", "صورة واقعية توضح الصدوع والزلازل"),
    "NAFS-0666": img("./volcano-structure.webp", "صورة واقعية توضح تركيب البركان"),
    "NAFS-0667": img("./earthquake-fault.webp", "صورة واقعية توضح الإجهادات والصدوع"),
    "NAFS-0668": img("./earthquake-fault.webp", "صورة واقعية توضح الزلازل والصدوع"),
    "NAFS-0673": img("./earthquake-fault.webp", "صورة واقعية توضح الإجهادات والصدوع"),
    "NAFS-0675": img("./volcano-structure.webp", "صورة واقعية توضح تركيب البركان"),

    // حركة الصفائح الأرضية
    "NAFS-0678": img("./earth-plates.webp", "صورة واقعية توضح الصفائح الأرضية وحدودها"),
    "NAFS-0680": img("./earth-plates.webp", "صورة واقعية توضح الصفائح الأرضية وحدودها"),
    "NAFS-0681": img("./earth-plates.webp", "صورة واقعية توضح حركة الصفائح وآثارها"),
    "NAFS-0682": img("./earth-layers.webp", "صورة واقعية توضح طبقات الأرض والغلاف الصخري والستار"),
    "NAFS-0683": img("./earth-plates.webp", "صورة واقعية توضح الصفائح الأرضية وحدودها"),
    "NAFS-0688": img("./earth-layers.webp", "صورة واقعية توضح طبقات الأرض والغلاف الصخري والستار"),
    "NAFS-0690": img("./earth-plates.webp", "صورة واقعية توضح حركة الصفائح وآثارها")
  };
})();
