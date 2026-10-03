// ==========================================================
// منصة نافس – الوسائط الواقعية النهائية لجميع الأسئلة
// الأحياء + الكيمياء + الفيزياء + علوم الأرض والفضاء
// 2026-10-03
//
// هذا الملف لا يغيّر نص السؤال أو الخيارات أو الإجابة.
// يضيف فقط مفتاح الوسيط عند الحاجة ويربط كل سؤال بصورة واقعية.
// ==========================================================
(function(){
  'use strict';

  const MEDIA_BASE='./media-realistic/';
  const M={};

  function imageHtml(file,alt){
    return `<img src="${MEDIA_BASE}${file}" alt="${alt}" loading="eager" decoding="async"
      style="display:block;width:100%;height:auto;max-height:520px;object-fit:cover;border-radius:18px">`;
  }

  // 1-15 | الخلية والنظرية الخلوية
  for(let n=1;n<=15;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("bio-01-cell.webp","الخلية والنظرية الخلوية");
  }
  // 16-30 | دورة الخلية والانقسام
  for(let n=16;n<=30;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("bio-02-cell-division.webp","دورة الخلية والانقسام");
  }
  // 31-45 | أجهزة جسم الإنسان والاتزان الداخلي
  for(let n=31;n<=45;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("bio-03-human-systems.webp","أجهزة جسم الإنسان والاتزان الداخلي");
  }
  // 46-60 | التصنيف الحديث للمخلوقات الحية
  for(let n=46;n<=60;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("bio-04-classification.webp","التصنيف الحديث للمخلوقات الحية");
  }
  // 61-75 | التنوع الحيوي والتكيف
  for(let n=61;n<=75;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("bio-05-biodiversity.webp","التنوع الحيوي والتكيف");
  }
  // 76-90 | الانقراض والسجل الأحفوري
  for(let n=76;n<=90;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("bio-06-fossils.webp","الانقراض والسجل الأحفوري");
  }
  // 91-105 | انتقال الطاقة ودورات المادة
  for(let n=91;n<=105;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("bio-07-energy-matter.webp","انتقال الطاقة ودورات المادة");
  }
  // 106-120 | الأنظمة البيئية والعلاقات التفاعلية
  for(let n=106;n<=120;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("bio-08-ecosystems.webp","الأنظمة البيئية والعلاقات التفاعلية");
  }
  // 121-135 | اتزان النظام البيئي
  for(let n=121;n<=135;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("bio-09-ecosystem-balance.webp","اتزان النظام البيئي");
  }
  // 136-150 | الكتلة الحيوية والوقود الحيوي
  for(let n=136;n<=150;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("bio-10-biomass.webp","الكتلة الحيوية والوقود الحيوي");
  }
  // 151-165 | قوانين مندل والصفات الوراثية
  for(let n=151;n<=165;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("bio-11-mendel.webp","قوانين مندل والصفات الوراثية");
  }
  // 166-180 | الكروموسومات والأحماض النووية والطفرات
  for(let n=166;n<=180;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("bio-12-dna-mutations.webp","الكروموسومات والأحماض النووية والطفرات");
  }
  // 181-195 | الذرة والنظائر والنشاط الإشعاعي
  for(let n=181;n<=195;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("chem-01-atom-isotopes.webp","الذرة والنظائر والنشاط الإشعاعي");
  }
  // 196-210 | المركبات والمخاليط والمحاليل
  for(let n=196;n<=210;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("chem-02-compounds-mixtures-solutions.webp","المركبات والمخاليط والمحاليل");
  }
  // 211-225 | الذائبية ومعدل الذوبان
  for(let n=211;n<=225;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("chem-03-solubility.webp","الذائبية ومعدل الذوبان");
  }
  // 226-240 | خصائص السوائل والمواد الصلبة
  for(let n=226;n<=240;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("chem-04-solids-liquids.webp","خصائص السوائل والمواد الصلبة");
  }
  // 241-255 | الجدول الدوري وخصائص العناصر
  for(let n=241;n<=255;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("chem-05-periodic-elements.webp","الجدول الدوري وخصائص العناصر");
  }
  // 256-270 | الأحماض والقواعد والأملاح
  for(let n=256;n<=270;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("chem-06-acids-bases-ph.webp","الأحماض والقواعد والأملاح");
  }
  // 271-285 | الروابط الكيميائية
  for(let n=271;n<=285;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("chem-07-chemical-bonds.webp","الروابط الكيميائية");
  }
  // 286-300 | التفاعلات الكيميائية وحفظ الكتلة
  for(let n=286;n<=300;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("chem-08-reactions.webp","التفاعلات الكيميائية وحفظ الكتلة");
  }
  // 301-315 | السرعة والتسارع والحركة
  for(let n=301;n<=315;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-01-motion.webp","السرعة والتسارع والحركة");
  }
  // 316-330 | الزخم وحفظ الزخم
  for(let n=316;n<=330;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-02-momentum.webp","الزخم وحفظ الزخم");
  }
  // 331-345 | الاحتكاك
  for(let n=331;n<=345;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-03-friction.webp","الاحتكاك");
  }
  // 346-360 | القصور الذاتي وقانون نيوتن الأول
  for(let n=346;n<=360;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-04-inertia.webp","القصور الذاتي وقانون نيوتن الأول");
  }
  // 361-375 | قانون نيوتن الثاني والجاذبية
  for(let n=361;n<=375;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-05-newton2-gravity.webp","قانون نيوتن الثاني والجاذبية");
  }
  // 376-390 | قانون نيوتن الثالث والجذب الكوني
  for(let n=376;n<=390;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-06-newton3-gravity.webp","قانون نيوتن الثالث والجذب الكوني");
  }
  // 391-405 | التيار والجهد والمقاومة
  for(let n=391;n<=405;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-07-current-voltage-resistance.webp","التيار والجهد والمقاومة");
  }
  // 406-420 | المجال الكهربائي والدوائر
  for(let n=406;n<=420;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-08-electric-field-circuits.webp","المجال الكهربائي والدوائر");
  }
  // 421-435 | الموصلات والعوازل
  for(let n=421;n<=435;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-09-conductors-insulators.webp","الموصلات والعوازل");
  }
  // 436-450 | التيار والمجال المغناطيسي
  for(let n=436;n<=450;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-10-electromagnetism.webp","التيار والمجال المغناطيسي");
  }
  // 451-465 | الطاقة الحرارية ودرجة الحرارة
  for(let n=451;n<=465;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-11-thermal-energy.webp","الطاقة الحرارية ودرجة الحرارة");
  }
  // 466-480 | انتقال الحرارة وقياسها
  for(let n=466;n<=480;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-12-heat-transfer.webp","انتقال الحرارة وقياسها");
  }
  // 481-495 | الحرارة النوعية
  for(let n=481;n<=495;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-13-specific-heat.webp","الحرارة النوعية");
  }
  // 496-510 | الطاقة الحركية وطاقة الوضع
  for(let n=496;n<=510;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-14-kinetic-potential.webp","الطاقة الحركية وطاقة الوضع");
  }
  // 511-525 | حفظ الطاقة ومصادرها
  for(let n=511;n<=525;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-15-energy-conservation.webp","حفظ الطاقة ومصادرها");
  }
  // 526-540 | الصوت
  for(let n=526;n<=540;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-16-sound.webp","الصوت");
  }
  // 541-555 | الضوء والطيف الكهرومغناطيسي
  for(let n=541;n<=555;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("phys-17-light-spectrum.webp","الضوء والطيف الكهرومغناطيسي");
  }
  // 556-570 | استكشاف الكون
  for(let n=556;n<=570;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("earth-01-space-exploration.webp","استكشاف الكون");
  }
  // 571-585 | الأجرام السماوية وظروفها
  for(let n=571;n<=585;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("earth-02-celestial-bodies.webp","الأجرام السماوية وظروفها");
  }
  // 586-600 | التغيرات المناخية
  for(let n=586;n<=600;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("earth-03-climate-change.webp","التغيرات المناخية");
  }
  // 601-615 | دورة الكربون
  for(let n=601;n<=615;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("earth-04-carbon-cycle.webp","دورة الكربون");
  }
  // 616-630 | الدورات الطبيعية
  for(let n=616;n<=630;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("earth-05-natural-cycles.webp","الدورات الطبيعية");
  }
  // 631-645 | المعادن وخصائص الصخور
  for(let n=631;n<=645;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("earth-06-minerals-rocks.webp","المعادن وخصائص الصخور");
  }
  // 646-660 | أنواع الصخور ودورة الصخور
  for(let n=646;n<=660;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("earth-07-rock-cycle.webp","أنواع الصخور ودورة الصخور");
  }
  // 661-675 | الإجهادات والزلازل والبراكين
  for(let n=661;n<=675;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("earth-08-earthquakes-volcanoes.webp","الإجهادات والزلازل والبراكين");
  }
  // 676-690 | حركة الصفائح الأرضية
  for(let n=676;n<=690;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("earth-09-plate-tectonics.webp","حركة الصفائح الأرضية");
  }
  // 691-705 | النشاط البشري والمخاطر الطبيعية
  for(let n=691;n<=705;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("earth-10-natural-hazards.webp","النشاط البشري والمخاطر الطبيعية");
  }
  // 706-720 | الموارد الطبيعية واستدامتها
  for(let n=706;n<=720;n++){
    M['NAFS-'+String(n).padStart(4,'0')]=imageHtml("earth-11-resources-sustainability.webp","الموارد الطبيعية واستدامتها");
  }

  window.NAFS_VISUAL_MEDIA=M;

  // البنك الأصلي يحتوي بعض الأسئلة بلا "معرف وسيط".
  // اعتراض تحميل بنك نافس فقط، ثم إضافة مفتاح الصورة دون لمس أي محتوى تعليمي.
  const BANK_NAME="بنك_نافس_علوم_ثالث_متوسط_720_سؤال_نهائي_بصري.json";

  if(!window.__NAFS_REALISTIC_MEDIA_FETCH_PATCHED && typeof window.fetch==='function'){
    const originalFetch=window.fetch.bind(window);

    window.fetch=async function(input,init){
      const response=await originalFetch(input,init);

      try{
        const url=typeof input==='string'
          ? input
          : (input && typeof input.url==='string' ? input.url : '');

        if(!response.ok || !url.includes(BANK_NAME)){
          return response;
        }

        const raw=await response.clone().json();
        if(!Array.isArray(raw)){
          return response;
        }

        raw.forEach((q,index)=>{
          const n=Number(q && q['رقم السؤال']) || (index+1);
          if(n>=1 && n<=720){
            q['معرف الوسيط']='NAFS-'+String(n).padStart(4,'0');
            q['وسيط مفعل']=true;
          }
        });

        const headers=new Headers(response.headers);
        headers.set('content-type','application/json; charset=utf-8');
        headers.delete('content-length');
        headers.delete('content-encoding');

        return new Response(JSON.stringify(raw),{
          status:response.status,
          statusText:response.statusText,
          headers
        });
      }catch(err){
        // عند أي خطأ يعود البنك الأصلي كما هو.
        return response;
      }
    };

    window.__NAFS_REALISTIC_MEDIA_FETCH_PATCHED=true;
  }

  // معلومات فحص سريعة من وحدة التحكم عند الحاجة.
  window.NAFS_REALISTIC_MEDIA_INFO={
    version:'20261003-realistic-final',
    questions:720,
    topics:48,
    images:48
  };
})();
