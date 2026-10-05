// منصة نافس – الوسائط الواقعية المتوافقة مع بنك 720 سؤالًا
// إصدار نهائي آمن 2026-10-05: طبيعة العلم بصياغة محاكية لنافس داخل تغيرات الأرض، والأسئلة الجديدة نصية بلا صور.
(function(){
  'use strict';
  const BANK_NAME='بنك_نافس_علوم_ثالث_متوسط_720_سؤال_نهائي_بصري.json';
  const MEDIA_BASE='./media-realistic/';
  const NO_MEDIA=new Set([4, 13, 19, 34, 49, 64, 94, 109, 124, 154, 156, 169, 184, 193, 199, 208, 214, 223, 229, 238, 259, 274, 289, 298, 304, 319, 334, 364, 379, 394, 439, 469, 484, 499, 529, 544, 557, 559, 561, 563, 564, 568, 570, 572, 574, 576, 579, 583, 585, 589, 591, 598, 600, 604, 606, 613, 615, 619, 621, 624, 628, 630, 634, 636, 643, 645, 648, 650, 651, 653, 658, 660, 663, 665, 666, 668, 670, 673, 675, 678, 680, 681, 688, 690, 692, 694, 696, 703, 705, 709, 711, 718, 720]);
  function id(n){return 'NAFS-'+String(n).padStart(4,'0');}
  function imageHtml(file,alt){return `<img src="${MEDIA_BASE}${file}" alt="${alt}" loading="eager" decoding="async" style="display:block;width:100%;height:auto;max-height:520px;object-fit:cover;border-radius:18px">`;}
  const M={};
  for(let n=1;n<=15;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("bio-01-cell.webp","الخلية والنظرية الخلوية");}
  for(let n=16;n<=30;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("bio-02-cell-division.webp","دورة الخلية والانقسام");}
  for(let n=31;n<=45;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("bio-03-human-systems.webp","أجهزة جسم الإنسان والاتزان الداخلي");}
  for(let n=46;n<=60;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("bio-04-classification.webp","التصنيف الحديث للمخلوقات الحية");}
  for(let n=61;n<=75;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("bio-05-biodiversity.webp","التنوع الحيوي والتكيف");}
  for(let n=76;n<=90;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("bio-06-fossils.webp","الانقراض والسجل الأحفوري");}
  for(let n=91;n<=105;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("bio-07-energy-matter.webp","انتقال الطاقة ودورات المادة");}
  for(let n=106;n<=120;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("bio-08-ecosystems.webp","الأنظمة البيئية والعلاقات التفاعلية");}
  for(let n=121;n<=135;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("bio-09-ecosystem-balance.webp","اتزان النظام البيئي");}
  for(let n=136;n<=150;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("bio-10-biomass.webp","الكتلة الحيوية والوقود الحيوي");}
  for(let n=151;n<=165;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("bio-11-mendel.webp","قوانين مندل والصفات الوراثية");}
  for(let n=166;n<=180;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("bio-12-dna-mutations.webp","الكروموسومات والأحماض النووية والطفرات");}
  for(let n=181;n<=195;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("chem-01-atom-isotopes.webp","الذرة والنظائر والنشاط الإشعاعي");}
  for(let n=196;n<=210;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("chem-02-compounds-mixtures-solutions.webp","المركبات والمخاليط والمحاليل");}
  for(let n=211;n<=225;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("chem-03-solubility.webp","الذائبية ومعدل الذوبان");}
  for(let n=226;n<=240;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("chem-04-solids-liquids.webp","خصائص السوائل والمواد الصلبة");}
  for(let n=241;n<=255;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("chem-05-periodic-elements.webp","الجدول الدوري وخصائص العناصر");}
  for(let n=256;n<=270;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("chem-06-acids-bases-ph.webp","الأحماض والقواعد والأملاح");}
  for(let n=271;n<=285;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("chem-07-chemical-bonds.webp","الروابط الكيميائية");}
  for(let n=286;n<=300;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("chem-08-reactions.webp","التفاعلات الكيميائية وحفظ الكتلة");}
  for(let n=301;n<=315;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-01-motion.webp","السرعة والتسارع والحركة");}
  for(let n=316;n<=330;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-02-momentum.webp","الزخم وحفظ الزخم");}
  for(let n=331;n<=345;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-03-friction.webp","الاحتكاك");}
  for(let n=346;n<=360;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-04-inertia.webp","القصور الذاتي وقانون نيوتن الأول");}
  for(let n=361;n<=375;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-05-newton2-gravity.webp","قانون نيوتن الثاني والجاذبية");}
  for(let n=376;n<=390;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-06-newton3-gravity.webp","قانون نيوتن الثالث والجذب الكوني");}
  for(let n=391;n<=405;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-07-current-voltage-resistance.webp","التيار والجهد والمقاومة");}
  for(let n=406;n<=420;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-08-electric-field-circuits.webp","المجال الكهربائي والدوائر");}
  for(let n=421;n<=435;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-09-conductors-insulators.webp","الموصلات والعوازل");}
  for(let n=436;n<=450;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-10-electromagnetism.webp","التيار والمجال المغناطيسي");}
  for(let n=451;n<=465;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-11-thermal-energy.webp","الطاقة الحرارية ودرجة الحرارة");}
  for(let n=466;n<=480;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-12-heat-transfer.webp","انتقال الحرارة وقياسها");}
  for(let n=481;n<=495;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-13-specific-heat.webp","الحرارة النوعية");}
  for(let n=496;n<=510;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-14-kinetic-potential.webp","الطاقة الحركية وطاقة الوضع");}
  for(let n=511;n<=525;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-15-energy-conservation.webp","حفظ الطاقة ومصادرها");}
  for(let n=526;n<=540;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-16-sound.webp","الصوت");}
  for(let n=541;n<=555;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("phys-17-light-spectrum.webp","الضوء والطيف الكهرومغناطيسي");}
  for(let n=556;n<=570;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("earth-01-space-exploration.webp","استكشاف الكون");}
  for(let n=571;n<=585;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("earth-02-celestial-bodies.webp","الأجرام السماوية وظروفها");}
  for(let n=586;n<=600;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("earth-03-climate-change.webp","التغيرات المناخية");}
  for(let n=601;n<=615;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("earth-04-carbon-cycle.webp","دورة الكربون");}
  for(let n=616;n<=630;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("earth-05-natural-cycles.webp","الدورات الطبيعية");}
  for(let n=631;n<=645;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("earth-06-minerals-rocks.webp","المعادن وخصائص الصخور");}
  for(let n=646;n<=660;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("earth-07-rock-cycle.webp","أنواع الصخور ودورة الصخور");}
  for(let n=661;n<=675;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("earth-08-earthquakes-volcanoes.webp","الإجهادات والزلازل والبراكين");}
  for(let n=676;n<=690;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("earth-09-plate-tectonics.webp","حركة الصفائح الأرضية");}
  for(let n=691;n<=705;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("earth-10-natural-hazards.webp","النشاط البشري والمخاطر الطبيعية");}
  for(let n=706;n<=720;n++){if(!NO_MEDIA.has(n)) M[id(n)]=imageHtml("earth-11-resources-sustainability.webp","الموارد الطبيعية واستدامتها");}
  window.NAFS_VISUAL_MEDIA=M;
  if(!window.__NAFS_MEDIA_720_NOS_PATCHED && typeof window.fetch==='function'){
    const originalFetch=window.fetch.bind(window);
    window.fetch=async function(input,init){
      const response=await originalFetch(input,init);
      try{
        const url=typeof input==='string'?input:(input&&typeof input.url==='string'?input.url:'');
        if(!response.ok || !url.includes(BANK_NAME)) return response;
        const raw=await response.clone().json();
        if(!Array.isArray(raw) || raw.length!==720) return response;
        raw.forEach((q,index)=>{
          const n=Number(q&&q['رقم السؤال'])||(index+1);
          if(NO_MEDIA.has(n)){
            q['وسيط مفعل']=false; q['نوع الوسيط الفعلي']=''; q['مسار الوسيط']=''; q['معرف الوسيط']=''; q['وصف الوسيط']=''; q['الوسيط المقترح']='بدون';
            return;
          }
          if(q['مسار الوسيط']){q['وسيط مفعل']=true; return;}
          q['معرف الوسيط']=id(n); q['وسيط مفعل']=true;
          if(!q['نوع الوسيط الفعلي']) q['نوع الوسيط الفعلي']=q['الوسيط المقترح']||'صورة توضيحية';
          if(!q['وصف الوسيط']) q['وصف الوسيط']='وسيط بصري مرتبط بموضوع «'+String(q['موضوع الناتج']||'')+'».';
        });
        const headers=new Headers(response.headers);
        headers.set('content-type','application/json; charset=utf-8');
        headers.delete('content-length'); headers.delete('content-encoding');
        return new Response(JSON.stringify(raw),{status:response.status,statusText:response.statusText,headers});
      }catch(err){console.warn('NAFS media patch fallback:',err); return response;}
    };
    window.__NAFS_MEDIA_720_NOS_PATCHED=true;
  }
  window.NAFS_VISUAL_MEDIA_INFO={version:'20261005-nafs-nos-safe-final',questions:720,natureOfScienceQuestions:45,workbookQuestions:48,mediaQuestions:627,topics:48,images:48};
})();
