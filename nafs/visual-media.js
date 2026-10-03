// النسخة الموحدة المعتمدة لبنك نافس
// تشمل: الأحياء + الكيمياء + الفيزياء + تغيرات الأرض
// لا تعدّل نصوص الأسئلة أو الخيارات أو الإجابات؛ تعدّل الوسائط فقط.
// 2026-10-03

(function(){
  const M = {};
  const img = (src,alt)=>`<img src="${src}" alt="${alt}" loading="eager" decoding="async">`;
  const addGroup = (start, html) => {
    // بنك نافس مكوّن من مجموعات كل منها 15 سؤالًا.
    // الأسئلة البصرية المعتادة: 2–9 و11–15 من كل مجموعة.
    for(let offset=1; offset<=14; offset++){
      if(offset===9) continue; // السؤال العاشر نصي
      const n=start+offset;
      M['NAFS-'+String(n).padStart(4,'0')]=html;
    }
  };

  addGroup(1, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الخلية والنظرية الخلوية">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الخلية والنظرية الخلوية</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">صورة علمية مرتبطة بمفهوم الخلية</text>

<ellipse cx="450" cy="310" rx="250" ry="155" fill="#e8f8ff" stroke="#2c82c9" stroke-width="7"/>
<ellipse cx="455" cy="307" rx="75" ry="62" fill="#b9a8ef" stroke="#6954d9" stroke-width="5"/>
<circle cx="455" cy="307" r="22" fill="#6954d9"/>
<g fill="#72c99f" stroke="#2e9b6f" stroke-width="3">
 <ellipse cx="315" cy="250" rx="38" ry="17"/><ellipse cx="590" cy="250" rx="35" ry="16"/>
 <ellipse cx="315" cy="365" rx="36" ry="16"/><ellipse cx="585" cy="370" rx="34" ry="16"/>
</g>
<g fill="#ffc36e" stroke="#ef8b3a" stroke-width="3"><circle cx="375" cy="195" r="14"/><circle cx="530" cy="205" r="12"/><circle cx="370" cy="408" r="12"/></g>
<path d="M225 315c70-70 120-110 175-80" fill="none" stroke="#7bbde6" stroke-width="5" stroke-dasharray="10 10"/>
<text x="450" y="482" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">نموذج خلية حقيقية المكونات: غشاء، سيتوبلازم، نواة وعضيات</text>
</svg>`);

  addGroup(16, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="دورة الخلية والانقسام">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">دورة الخلية والانقسام</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">مراحل الخلية والانقسام</text>

<g transform="translate(95 185)">
 <circle cx="95" cy="105" r="70" fill="#e8f8ff" stroke="#2c82c9" stroke-width="5"/><circle cx="95" cy="105" r="28" fill="#8f79e6"/>
 <circle cx="290" cy="105" r="70" fill="#e8f8ff" stroke="#2c82c9" stroke-width="5"/><path d="M270 78l40 54m0-54l-40 54" stroke="#6954d9" stroke-width="8"/>
 <circle cx="485" cy="105" r="70" fill="#e8f8ff" stroke="#2c82c9" stroke-width="5"/><path d="M450 75l25 55m45-55l-25 55" stroke="#6954d9" stroke-width="7"/>
 <circle cx="680" cy="105" r="70" fill="#e8f8ff" stroke="#2c82c9" stroke-width="5"/><line x1="680" y1="38" x2="680" y2="172" stroke="#fff" stroke-width="10"/><circle cx="650" cy="105" r="20" fill="#8f79e6"/><circle cx="710" cy="105" r="20" fill="#8f79e6"/>
</g>
<path d="M190 290h65m130 0h65m130 0h65" stroke="#6e8297" stroke-width="5" marker-end="url(#a)"/>
<text x="450" y="475" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">تتابع بصري لمراحل انقسام الخلية وتوزيع المادة الوراثية</text>
</svg>`);

  addGroup(31, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="أجهزة جسم الإنسان والاتزان الداخلي">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">أجهزة جسم الإنسان والاتزان الداخلي</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">أعضاء تعمل معًا داخل الجسم</text>

<circle cx="450" cy="175" r="45" fill="#f0c7a9"/>
<path d="M365 235Q450 195 535 235L565 420Q450 470 335 420Z" fill="#e8f8ff" stroke="#2c82c9" stroke-width="5"/>
<path d="M425 270c-50-35-72 20-55 85 12 45 48 42 66 10z" fill="#8dd4c1" stroke="#2e9b6f" stroke-width="4"/>
<path d="M475 270c50-35 72 20 55 85-12 45-48 42-66 10z" fill="#8dd4c1" stroke="#2e9b6f" stroke-width="4"/>
<path d="M450 310c-28-25-52 10-45 36 8 32 45 52 45 52s37-20 45-52c7-26-17-61-45-36z" fill="#ef6d78"/>
<path d="M405 412h90" stroke="#ef8b3a" stroke-width="16" stroke-linecap="round"/>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">تكامل أجهزة الجسم للمحافظة على الاتزان الداخلي</text>
</svg>`);

  addGroup(46, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="التصنيف الحديث للمخلوقات الحية">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">التصنيف الحديث للمخلوقات الحية</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">تنظيم المخلوقات حسب الصفات</text>

<circle cx="450" cy="180" r="48" fill="url(#violet)"/>
<path d="M450 228v55M450 282H250M450 282H650M250 282v60M650 282v60" stroke="#6954d9" stroke-width="7" fill="none"/>
<g fill="#fff" stroke="#2c82c9" stroke-width="5">
 <rect x="165" y="342" width="170" height="78" rx="20"/><rect x="365" y="342" width="170" height="78" rx="20"/><rect x="565" y="342" width="170" height="78" rx="20"/>
</g>
<circle cx="220" cy="381" r="18" fill="#72c99f"/><path d="M400 390q50-65 100 0" fill="none" stroke="#ef8b3a" stroke-width="10"/><path d="M620 394q25-55 50 0t50 0" fill="none" stroke="#2c82c9" stroke-width="8"/>
<text x="450" y="476" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">شجرة تصنيف تربط المخلوقات الحية وفق الصفات المشتركة</text>
</svg>`);

  addGroup(61, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="التنوع الحيوي والتكيف">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">التنوع الحيوي والتكيف</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">تنوع الكائنات والبيئات</text>

<rect x="85" y="330" width="730" height="95" rx="28" fill="#cfeecf"/>
<path d="M80 330L230 190 350 330M300 330L455 155 610 330" fill="#d5e9fb" stroke="#8bbce4" stroke-width="4"/>
<g fill="#2e9b6f"><rect x="155" y="280" width="18" height="80"/><circle cx="164" cy="260" r="45"/><rect x="690" y="275" width="18" height="85"/><circle cx="699" cy="252" r="47"/></g>
<path d="M535 245q38-28 76 0q-38 7-76 0" fill="#ef8b3a"/><path d="M250 385q35-35 70 0q-35 34-70 0" fill="#2c82c9"/>
<circle cx="278" cy="375" r="4" fill="#17385e"/>
<text x="450" y="477" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">تنوع في المواطن والأنواع والتكيفات داخل النظام البيئي</text>
</svg>`);

  addGroup(76, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الانقراض والسجل الأحفوري">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الانقراض والسجل الأحفوري</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">طبقات الأرض والأحافير</text>

<g transform="translate(105 175)">
 <rect width="690" height="62" rx="12" fill="#e0b77d"/><rect y="72" width="690" height="62" rx="12" fill="#c99762"/><rect y="144" width="690" height="62" rx="12" fill="#b88154"/><rect y="216" width="690" height="62" rx="12" fill="#9a6b48"/>
 <path d="M310 108c-48-45-120 15-80 70 30 42 104 17 92-36-8-36-58-41-74-12 18-9 43 2 43 22 0 28-41 34-57 8" fill="none" stroke="#fff4d6" stroke-width="10" stroke-linecap="round"/>
 <path d="M500 32c40 4 70 15 95 40-55 8-100 2-135-19 11-13 23-20 40-21z" fill="#f7e4bd"/>
</g>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">طبقات رسوبية وأحفورة تساعدان على قراءة السجل الجيولوجي</text>
</svg>`);

  addGroup(91, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="انتقال الطاقة ودورات المادة">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">انتقال الطاقة ودورات المادة</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">انتقال الطاقة في السلاسل الغذائية</text>

<circle cx="120" cy="190" r="52" fill="#ffd76a"/><g stroke="#f0b329" stroke-width="7"><path d="M120 115v-30M120 295v30M45 190H15M225 190h30M65 135l-23-23M175 245l23 23M175 135l23-23M65 245l-23 23"/></g>
<path d="M280 410q55-160 110 0" fill="#72c99f"/><path d="M335 410q55-150 110 0" fill="#2e9b6f"/>
<ellipse cx="545" cy="365" rx="70" ry="44" fill="#d7b18b"/><circle cx="595" cy="335" r="28" fill="#d7b18b"/><path d="M620 330l25-18-9 30" fill="#d7b18b"/>
<path d="M690 365q70-70 120 0q-55 55-120 0z" fill="#ef8b3a"/>
<path d="M185 315c45 0 70 20 95 45M435 360h40M615 360h55" fill="none" stroke="#526b85" stroke-width="6" stroke-dasharray="12 8"/>
<text x="450" y="482" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">انتقال الطاقة من الشمس إلى المنتج ثم المستهلكات</text>
</svg>`);

  addGroup(106, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الأنظمة البيئية والعلاقات التفاعلية">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الأنظمة البيئية والعلاقات التفاعلية</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">علاقات الكائنات داخل النظام البيئي</text>

<path d="M60 390q170-80 340 0t440 0v70H60z" fill="#8dd4c1"/>
<rect x="120" y="260" width="18" height="125" fill="#8a5b3d"/><circle cx="129" cy="240" r="65" fill="#55b978"/>
<rect x="700" y="275" width="18" height="110" fill="#8a5b3d"/><circle cx="709" cy="255" r="58" fill="#55b978"/>
<ellipse cx="460" cy="360" rx="120" ry="45" fill="#78c6e8"/>
<path d="M430 360q40-36 80 0q-40 33-80 0z" fill="#ef8b3a"/>
<path d="M580 270q35-30 70 0q-35 10-70 0z" fill="#6954d9"/>
<text x="450" y="482" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">مكونات حيوية وغير حيوية وعلاقات تفاعلية في نظام بيئي</text>
</svg>`);

  addGroup(121, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="اتزان النظام البيئي">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">اتزان النظام البيئي</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">مكونات النظام المتوازن</text>

<path d="M450 175v220" stroke="#526b85" stroke-width="10"/><path d="M285 235h330" stroke="#526b85" stroke-width="8"/>
<path d="M300 235l-90 120h180zM600 235l-90 120h180z" fill="#e8f8ff" stroke="#2c82c9" stroke-width="5"/>
<g fill="#55b978"><circle cx="270" cy="325" r="26"/><circle cx="330" cy="325" r="18"/></g>
<g fill="#ef8b3a"><circle cx="570" cy="325" r="24"/><circle cx="630" cy="325" r="20"/></g>
<text x="450" y="475" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">اتزان يعتمد على تفاعل العوامل الحيوية وغير الحيوية</text>
</svg>`);

  addGroup(136, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الكتلة الحيوية والوقود الحيوي">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الكتلة الحيوية والوقود الحيوي</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">مادة عضوية تتحول إلى طاقة</text>

<path d="M210 400q35-155 95 0M265 400q35-175 95 0M320 400q35-145 95 0" fill="#55b978"/>
<path d="M400 330h130" stroke="#526b85" stroke-width="8"/><polygon points="530,330 505,314 505,346" fill="#526b85"/>
<rect x="565" y="245" width="120" height="155" rx="18" fill="#dfe8ef" stroke="#526b85" stroke-width="5"/>
<path d="M625 375c-45-43-12-77 4-100 9 22 43 49 10 100z" fill="#ef8b3a"/>
<path d="M695 330h85" stroke="#526b85" stroke-width="8"/><polygon points="780,330 755,314 755,346" fill="#526b85"/>
<circle cx="805" cy="330" r="34" fill="#ffd76a"/>
<text x="450" y="475" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">تحويل مادة عضوية نباتية إلى وقود أو طاقة</text>
</svg>`);

  addGroup(151, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="قوانين مندل والصفات الوراثية">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">قوانين مندل والصفات الوراثية</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">نموذج وراثة للصفات</text>

<g transform="translate(120 190)">
 <path d="M80 220V25" stroke="#2e9b6f" stroke-width="10"/><path d="M80 70q-55-25-55 35q55 10 55-35M80 120q55-25 55 35q-55 10-55-35" fill="#72c99f"/>
 <circle cx="45" cy="185" r="22" fill="#ffd76a"/><circle cx="95" cy="180" r="22" fill="#55b978"/>
</g>
<g transform="translate(400 180)" stroke="#6954d9" stroke-width="4" fill="#fff">
 <rect width="300" height="230" rx="18"/><line x1="100" y1="0" x2="100" y2="230"/><line x1="200" y1="0" x2="200" y2="230"/><line x1="0" y1="76" x2="300" y2="76"/><line x1="0" y1="153" x2="300" y2="153"/>
 <g fill="#6954d9"><circle cx="150" cy="115" r="14"/><circle cx="250" cy="115" r="14"/><circle cx="150" cy="192" r="14"/><circle cx="250" cy="192" r="14"/></g>
</g>
<text x="450" y="477" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">نموذج وراثي مستوحى من تجارب مندل ومربع احتمالات</text>
</svg>`);

  addGroup(166, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الكروموسومات والأحماض النووية والطفرات">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الكروموسومات والأحماض النووية والطفرات</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">DNA والكروموسومات</text>

<path d="M325 165c220 60 30 250 250 310M575 165c-220 60-30 250-250 310" fill="none" stroke="#2c82c9" stroke-width="11"/>
<g stroke="#6954d9" stroke-width="6">
 <line x1="365" y1="185" x2="535" y2="185"/><line x1="325" y1="235" x2="575" y2="235"/><line x1="350" y1="285" x2="550" y2="285"/><line x1="390" y1="335" x2="510" y2="335"/><line x1="350" y1="385" x2="550" y2="385"/><line x1="325" y1="435" x2="575" y2="435"/>
</g>
<circle cx="270" cy="305" r="48" fill="#b9a8ef"/><path d="M245 280l50 50m0-50l-50 50" stroke="#fff" stroke-width="7"/>
<text x="450" y="495" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">DNA وكروموسوم يوضحان موضع المعلومات الوراثية والطفرات</text>
</svg>`);

  addGroup(181, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الذرة والنظائر والنشاط الإشعاعي">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الذرة والنظائر والنشاط الإشعاعي</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">تركيب الذرة والنواة والإلكترونات</text>

<circle cx="450" cy="310" r="55" fill="#ef8b3a"/><circle cx="425" cy="300" r="18" fill="#ef6d78"/><circle cx="475" cy="320" r="18" fill="#6bb7e8"/>
<ellipse cx="450" cy="310" rx="250" ry="85" fill="none" stroke="#6954d9" stroke-width="5"/>
<ellipse cx="450" cy="310" rx="95" ry="250" fill="none" stroke="#2c82c9" stroke-width="5" transform="rotate(38 450 310)"/>
<ellipse cx="450" cy="310" rx="95" ry="250" fill="none" stroke="#2e9b6f" stroke-width="5" transform="rotate(-38 450 310)"/>
<g fill="#17385e"><circle cx="205" cy="310" r="14"/><circle cx="545" cy="105" r="14"/><circle cx="645" cy="365" r="14"/></g>
<text x="450" y="485" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">نواة وإلكترونات ومدارات تمثيلية لشرح الذرة والنظائر</text>
</svg>`);

  addGroup(196, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="المركبات والمخاليط والمحاليل">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">المركبات والمخاليط والمحاليل</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">عينات مخبرية للمخاليط والمحاليل</text>

<g transform="translate(120 175)">
 <path d="M40 0v210q0 55 85 55t85-55V0" fill="#e6f5ff" stroke="#2c82c9" stroke-width="6"/><path d="M55 150h140v60q0 40-70 40t-70-40z" fill="#77c9ef"/>
 <circle cx="95" cy="185" r="12" fill="#ffd76a"/><circle cx="145" cy="210" r="12" fill="#ffd76a"/><circle cx="175" cy="175" r="12" fill="#ffd76a"/>
</g>
<g transform="translate(500 175)">
 <path d="M40 0v210q0 55 85 55t85-55V0" fill="#f7f8fb" stroke="#6954d9" stroke-width="6"/><path d="M55 150h140v60q0 40-70 40t-70-40z" fill="#bbaaf0"/>
 <g fill="#fff"><circle cx="90" cy="185" r="10"/><circle cx="125" cy="205" r="10"/><circle cx="160" cy="178" r="10"/><circle cx="145" cy="225" r="10"/></g>
</g>
<text x="450" y="478" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">مزيج غير متجانس ومحلول متجانس في أوعية مخبرية</text>
</svg>`);

  addGroup(211, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الذائبية ومعدل الذوبان">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الذائبية ومعدل الذوبان</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">ذوبان مادة في مذيب</text>

<g transform="translate(235 180)">
 <path d="M60 0v210q0 65 155 65t155-65V0" fill="#f8fbff" stroke="#2c82c9" stroke-width="6"/><path d="M78 135h274v75q0 46-137 46T78 210z" fill="#7ecbed"/>
 <g fill="#ffd76a"><circle cx="140" cy="180" r="12"/><circle cx="190" cy="205" r="12"/><circle cx="245" cy="175" r="12"/><circle cx="290" cy="215" r="12"/></g>
 <path d="M370 40c50 25 48 95 10 130" fill="none" stroke="#ef8b3a" stroke-width="8"/><path d="M395 165l-25 8 5-27" fill="#ef8b3a"/>
</g>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">مذاب داخل مذيب مع تحريك وحرارة لتمثيل معدل الذوبان</text>
</svg>`);

  addGroup(226, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="خصائص السوائل والمواد الصلبة">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">خصائص السوائل والمواد الصلبة</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">مقارنة جسيمات الصلب والسائل</text>

<g transform="translate(110 185)">
 <rect width="275" height="235" rx="25" fill="#fff" stroke="#6954d9" stroke-width="6"/>
 <g fill="#6954d9">
  <circle cx="55" cy="65" r="17"/><circle cx="110" cy="65" r="17"/><circle cx="165" cy="65" r="17"/><circle cx="220" cy="65" r="17"/>
  <circle cx="55" cy="120" r="17"/><circle cx="110" cy="120" r="17"/><circle cx="165" cy="120" r="17"/><circle cx="220" cy="120" r="17"/>
  <circle cx="55" cy="175" r="17"/><circle cx="110" cy="175" r="17"/><circle cx="165" cy="175" r="17"/><circle cx="220" cy="175" r="17"/>
 </g>
</g>
<g transform="translate(515 185)">
 <path d="M0 0v190q0 45 135 45t135-45V0" fill="#fff" stroke="#2c82c9" stroke-width="6"/>
 <path d="M20 120h230v70q0 30-115 30T20 190z" fill="#7ecbed"/>
 <g fill="#2c82c9"><circle cx="60" cy="165" r="13"/><circle cx="115" cy="190" r="13"/><circle cx="175" cy="155" r="13"/><circle cx="210" cy="195" r="13"/></g>
</g>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">نموذج جسيمي يقارن مادة صلبة بلورية وسائلًا</text>
</svg>`);

  addGroup(241, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الجدول الدوري وخصائص العناصر">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الجدول الدوري وخصائص العناصر</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">مواقع العناصر في الجدول الدوري</text>

<g transform="translate(115 165)" stroke="#fff" stroke-width="3">
<rect x="0" y="0" width="62" height="56" rx="8" fill="#6bb7e8"/><rect x="68" y="0" width="62" height="56" rx="8" fill="#72c99f"/><rect x="136" y="0" width="62" height="56" rx="8" fill="#ffc36e"/><rect x="204" y="0" width="62" height="56" rx="8" fill="#b9a8ef"/><rect x="272" y="0" width="62" height="56" rx="8" fill="#6bb7e8"/><rect x="340" y="0" width="62" height="56" rx="8" fill="#72c99f"/><rect x="408" y="0" width="62" height="56" rx="8" fill="#ffc36e"/><rect x="476" y="0" width="62" height="56" rx="8" fill="#b9a8ef"/><rect x="544" y="0" width="62" height="56" rx="8" fill="#6bb7e8"/><rect x="612" y="0" width="62" height="56" rx="8" fill="#72c99f"/><rect x="0" y="62" width="62" height="56" rx="8" fill="#72c99f"/><rect x="68" y="62" width="62" height="56" rx="8" fill="#ffc36e"/><rect x="136" y="62" width="62" height="56" rx="8" fill="#b9a8ef"/><rect x="204" y="62" width="62" height="56" rx="8" fill="#6bb7e8"/><rect x="272" y="62" width="62" height="56" rx="8" fill="#72c99f"/><rect x="340" y="62" width="62" height="56" rx="8" fill="#ffc36e"/><rect x="408" y="62" width="62" height="56" rx="8" fill="#b9a8ef"/><rect x="476" y="62" width="62" height="56" rx="8" fill="#6bb7e8"/><rect x="544" y="62" width="62" height="56" rx="8" fill="#72c99f"/><rect x="612" y="62" width="62" height="56" rx="8" fill="#ffc36e"/><rect x="0" y="124" width="62" height="56" rx="8" fill="#ffc36e"/><rect x="68" y="124" width="62" height="56" rx="8" fill="#b9a8ef"/><rect x="136" y="124" width="62" height="56" rx="8" fill="#6bb7e8"/><rect x="204" y="124" width="62" height="56" rx="8" fill="#72c99f"/><rect x="272" y="124" width="62" height="56" rx="8" fill="#ffc36e"/><rect x="340" y="124" width="62" height="56" rx="8" fill="#b9a8ef"/><rect x="408" y="124" width="62" height="56" rx="8" fill="#6bb7e8"/><rect x="476" y="124" width="62" height="56" rx="8" fill="#72c99f"/><rect x="544" y="124" width="62" height="56" rx="8" fill="#ffc36e"/><rect x="612" y="124" width="62" height="56" rx="8" fill="#b9a8ef"/><rect x="0" y="186" width="62" height="56" rx="8" fill="#b9a8ef"/><rect x="68" y="186" width="62" height="56" rx="8" fill="#6bb7e8"/><rect x="136" y="186" width="62" height="56" rx="8" fill="#72c99f"/><rect x="204" y="186" width="62" height="56" rx="8" fill="#ffc36e"/><rect x="272" y="186" width="62" height="56" rx="8" fill="#b9a8ef"/><rect x="340" y="186" width="62" height="56" rx="8" fill="#6bb7e8"/><rect x="408" y="186" width="62" height="56" rx="8" fill="#72c99f"/><rect x="476" y="186" width="62" height="56" rx="8" fill="#ffc36e"/><rect x="544" y="186" width="62" height="56" rx="8" fill="#b9a8ef"/><rect x="612" y="186" width="62" height="56" rx="8" fill="#6bb7e8"/>
</g>
<rect x="115" y="165" width="62" height="56" rx="8" fill="#ef6d78" stroke="#fff" stroke-width="3"/>
<rect x="727" y="351" width="62" height="56" rx="8" fill="#ef8b3a" stroke="#fff" stroke-width="3"/>
<text x="450" y="475" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">تنظيم دوري للعناصر يوضح المجموعات والدورات ومناطق الأنواع المختلفة</text>
</svg>`);

  addGroup(256, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الأحماض والقواعد والأملاح">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الأحماض والقواعد والأملاح</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">مقياس الحموضة والقاعدية</text>

<rect x="120" y="280" width="660" height="64" rx="20" fill="url(#blue)"/>
<g font-size="19" font-weight="800" fill="#17385e"><text x="120" y="260">0</text><text x="450" y="260">7</text><text x="770" y="260">14</text></g>
<path d="M450 205v155" stroke="#fff" stroke-width="7"/>
<g transform="translate(210 170)"><path d="M0 0h90v170q0 35-45 35T0 170z" fill="#fff" stroke="#ef6d78" stroke-width="5"/><path d="M10 110h70v60q0 25-35 25t-35-25z" fill="#f3a1aa"/></g>
<g transform="translate(600 170)"><path d="M0 0h90v170q0 35-45 35T0 170z" fill="#fff" stroke="#6954d9" stroke-width="5"/><path d="M10 110h70v60q0 25-35 25t-35-25z" fill="#b9a8ef"/></g>
<text x="450" y="475" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">مقياس pH مع عينات حمضية وقاعدية وتمثيل للتعادل</text>
</svg>`);

  addGroup(271, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الروابط الكيميائية">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الروابط الكيميائية</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">إلكترونات وتكوين روابط بين الذرات</text>

<g transform="translate(130 185)">
 <circle cx="105" cy="110" r="62" fill="#6bb7e8"/><circle cx="255" cy="110" r="62" fill="#ef8b3a"/>
 <path d="M175 110h18" stroke="#17385e" stroke-width="12"/><path d="M190 95l22 15-22 15" fill="#17385e"/>
 <circle cx="135" cy="65" r="9" fill="#17385e"/><circle cx="225" cy="65" r="9" fill="#17385e"/>
</g>
<g transform="translate(510 185)">
 <circle cx="80" cy="110" r="62" fill="#72c99f"/><circle cx="200" cy="110" r="62" fill="#72c99f"/>
 <circle cx="130" cy="78" r="10" fill="#17385e"/><circle cx="150" cy="78" r="10" fill="#17385e"/>
 <path d="M140 70v80" stroke="#fff" stroke-width="5" opacity=".6"/>
</g>
<text x="450" y="478" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">انتقال أو مشاركة إلكترونات التكافؤ لتكوين الروابط الكيميائية</text>
</svg>`);

  addGroup(286, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="التفاعلات الكيميائية وحفظ الكتلة">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">التفاعلات الكيميائية وحفظ الكتلة</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">إعادة ترتيب الذرات في التفاعل</text>

<g transform="translate(100 190)">
 <circle cx="80" cy="105" r="34" fill="#6bb7e8"/><circle cx="150" cy="105" r="34" fill="#ef8b3a"/><circle cx="115" cy="165" r="34" fill="#72c99f"/>
</g>
<path d="M340 295h180" stroke="#526b85" stroke-width="10"/><polygon points="520,295 488,276 488,314" fill="#526b85"/>
<g transform="translate(575 190)">
 <circle cx="80" cy="105" r="34" fill="#6bb7e8"/><circle cx="145" cy="105" r="34" fill="#ef8b3a"/><circle cx="112" cy="160" r="34" fill="#72c99f"/>
 <path d="M75 105h75M112 110v45" stroke="#fff" stroke-width="7"/>
</g>
<path d="M410 390q40-70 80 0" fill="none" stroke="#ef8b3a" stroke-width="8"/>
<text x="450" y="477" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">إعادة ترتيب الجسيمات مع بقاء عدد الذرات محفوظًا أثناء التفاعل</text>
</svg>`);

  addGroup(301, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="السرعة والتسارع والحركة">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">السرعة والتسارع والحركة</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">حركة جسم وتمثيل بياني</text>

<rect x="100" y="375" width="700" height="14" rx="7" fill="#6e8297"/>
<g transform="translate(180 250)"><rect width="180" height="72" rx="18" fill="#2c82c9"/><path d="M35 0l45-48h70l35 48" fill="#8ed0ef"/><circle cx="45" cy="78" r="26" fill="#263748"/><circle cx="145" cy="78" r="26" fill="#263748"/></g>
<path d="M390 300h210" stroke="#ef8b3a" stroke-width="10"/><polygon points="600,300 565,280 565,320" fill="#ef8b3a"/>
<g transform="translate(560 165)" stroke="#6954d9" stroke-width="4" fill="none"><path d="M0 180V0M0 180h210"/><polyline points="15,160 65,135 120,90 190,40" stroke-width="8"/></g>
<text x="450" y="478" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">حركة جسم مع اتجاه السرعة ورسم بياني للمسافة أو السرعة مع الزمن</text>
</svg>`);

  addGroup(316, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الزخم وحفظ الزخم">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الزخم وحفظ الزخم</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">تصادم أجسام متحركة</text>

<rect x="100" y="380" width="700" height="13" rx="6" fill="#6e8297"/>
<g transform="translate(145 265)"><rect width="150" height="65" rx="15" fill="#6bb7e8"/><circle cx="35" cy="70" r="22" fill="#263748"/><circle cx="115" cy="70" r="22" fill="#263748"/></g>
<g transform="translate(605 265)"><rect width="150" height="65" rx="15" fill="#ef8b3a"/><circle cx="35" cy="70" r="22" fill="#263748"/><circle cx="115" cy="70" r="22" fill="#263748"/></g>
<path d="M320 300h110" stroke="#2c82c9" stroke-width="9"/><polygon points="430,300 400,282 400,318" fill="#2c82c9"/>
<path d="M580 300H470" stroke="#ef8b3a" stroke-width="9"/><polygon points="470,300 500,282 500,318" fill="#ef8b3a"/>
<circle cx="450" cy="300" r="38" fill="#b9a8ef" opacity=".8"/>
<text x="450" y="478" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">تصادم عربتين لتمثيل الزخم قبل التصادم وبعده في نظام معزول</text>
</svg>`);

  addGroup(331, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الاحتكاك">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الاحتكاك</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">احتكاك إطار مع سطح الطريق</text>

<rect x="70" y="360" width="760" height="70" rx="18" fill="#697786"/>
<path d="M90 385h720" stroke="#e9edf1" stroke-width="7" stroke-dasharray="45 25"/>
<g transform="translate(265 230)"><rect width="280" height="95" rx="22" fill="#2c82c9"/><path d="M55 0l65-60h85l55 60" fill="#8ed0ef"/><circle cx="70" cy="105" r="37" fill="#252f38"/><circle cx="220" cy="105" r="37" fill="#252f38"/></g>
<path d="M245 300H135" stroke="#ef6d78" stroke-width="9"/><polygon points="135,300 168,280 168,320" fill="#ef6d78"/>
<path d="M565 300h120" stroke="#55b978" stroke-width="9"/><polygon points="685,300 652,280 652,320" fill="#55b978"/>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">تماس الإطار بالطريق يوضح قوة الاحتكاك واتجاهها بالنسبة للحركة</text>
</svg>`);

  addGroup(346, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="القصور الذاتي وقانون نيوتن الأول">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">القصور الذاتي وقانون نيوتن الأول</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">حركة راكب داخل مركبة</text>

<g transform="translate(150 235)"><rect width="500" height="145" rx="30" fill="#6bb7e8"/><rect x="65" y="25" width="300" height="70" rx="15" fill="#dff3ff"/><circle cx="110" cy="155" r="38" fill="#273746"/><circle cx="400" cy="155" r="38" fill="#273746"/></g>
<circle cx="430" cy="270" r="25" fill="#f0c7a9"/><path d="M430 295v70M430 320l-48 28M430 320l55 18" stroke="#17385e" stroke-width="9" stroke-linecap="round"/>
<path d="M690 300h110" stroke="#ef8b3a" stroke-width="9"/><polygon points="800,300 770,282 770,318" fill="#ef8b3a"/>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">راكب داخل حافلة متحركة لتمثيل القصور الذاتي وقانون نيوتن الأول</text>
</svg>`);

  addGroup(361, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="قانون نيوتن الثاني والجاذبية">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">قانون نيوتن الثاني والجاذبية</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">قوة محصلة تؤثر في عربة</text>

<rect x="90" y="390" width="720" height="12" rx="6" fill="#6e8297"/>
<g transform="translate(300 260)"><rect width="220" height="105" rx="18" fill="#b9a8ef" stroke="#6954d9" stroke-width="5"/><circle cx="45" cy="115" r="28" fill="#263748"/><circle cx="175" cy="115" r="28" fill="#263748"/></g>
<path d="M550 310h180" stroke="#ef8b3a" stroke-width="12"/><polygon points="730,310 692,287 692,333" fill="#ef8b3a"/>
<path d="M280 310H170" stroke="#526b85" stroke-width="7" stroke-dasharray="12 10"/>
<circle cx="245" cy="190" r="55" fill="#6bb7e8" opacity=".35"/>
<text x="450" y="478" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">عربة وقوة محصلة توضح العلاقة بين القوة والكتلة والتسارع</text>
</svg>`);

  addGroup(376, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="قانون نيوتن الثالث والجذب الكوني">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">قانون نيوتن الثالث والجذب الكوني</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">فعل ورد فعل في الدفع</text>

<g transform="translate(335 155)">
 <path d="M115 0l70 120-35 90H80l-35-90z" fill="#dfe8ef" stroke="#526b85" stroke-width="5"/>
 <circle cx="115" cy="90" r="28" fill="#6bb7e8"/>
 <path d="M85 210l30 95 30-95" fill="#ef8b3a"/><path d="M98 210l17 62 17-62" fill="#ffd76a"/>
</g>
<path d="M305 300H130" stroke="#2c82c9" stroke-width="10"/><polygon points="130,300 165,280 165,320" fill="#2c82c9"/>
<path d="M595 300h175" stroke="#ef6d78" stroke-width="10"/><polygon points="770,300 735,280 735,320" fill="#ef6d78"/>
<text x="450" y="487" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">دفع صاروخي يوضح قوتي الفعل ورد الفعل المتبادلتين</text>
</svg>`);

  addGroup(391, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="التيار والجهد والمقاومة">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">التيار والجهد والمقاومة</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">دائرة كهربائية وقانون أوم</text>

<path d="M190 300h120M590 300h120M310 300v-90h280v90" fill="none" stroke="#526b85" stroke-width="8"/>
<rect x="385" y="185" width="130" height="50" rx="12" fill="#ef8b3a"/>
<g transform="translate(205 245)"><circle cx="0" cy="55" r="52" fill="#fff" stroke="#2c82c9" stroke-width="6"/><text x="0" y="65" text-anchor="middle" font-size="34" font-weight="900" fill="#2c82c9">A</text></g>
<g transform="translate(695 245)"><circle cx="0" cy="55" r="52" fill="#fff" stroke="#6954d9" stroke-width="6"/><text x="0" y="65" text-anchor="middle" font-size="34" font-weight="900" fill="#6954d9">V</text></g>
<text x="450" y="375" text-anchor="middle" font-size="36" font-weight="900" fill="#17385e">V = I × R</text>
<text x="450" y="477" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">دائرة قياس توضح العلاقة بين الجهد والتيار والمقاومة</text>
</svg>`);

  addGroup(406, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="المجال الكهربائي والدوائر">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">المجال الكهربائي والدوائر</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">مجال كهربائي بين شحنتين</text>

<circle cx="275" cy="295" r="52" fill="#ef6d78"/><text x="275" y="307" text-anchor="middle" font-size="42" font-weight="900" fill="#fff">+</text>
<circle cx="625" cy="295" r="52" fill="#6bb7e8"/><text x="625" y="307" text-anchor="middle" font-size="42" font-weight="900" fill="#fff">−</text>
<g stroke="#6954d9" stroke-width="5" fill="none">
 <path d="M335 245q115-95 230 0"/><path d="M335 295h230"/><path d="M335 345q115 95 230 0"/>
</g>
<g fill="#6954d9"><polygon points="565,245 540,232 544,260"/><polygon points="565,295 540,282 540,308"/><polygon points="565,345 544,330 540,358"/></g>
<text x="450" y="475" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">خطوط مجال كهربائي بين شحنتين وتمثيل لمسار القوة</text>
</svg>`);

  addGroup(421, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الموصلات والعوازل">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الموصلات والعوازل</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">انتقال الشحنات في المواد</text>

<g transform="translate(110 210)">
 <rect x="0" y="70" width="285" height="80" rx="20" fill="#dfe8ef" stroke="#526b85" stroke-width="5"/>
 <path d="M25 110h235" stroke="#ef8b3a" stroke-width="18"/><g fill="#17385e"><circle cx="70" cy="110" r="8"/><circle cx="130" cy="110" r="8"/><circle cx="190" cy="110" r="8"/></g>
</g>
<g transform="translate(505 210)">
 <rect x="0" y="70" width="285" height="80" rx="20" fill="#6954d9" opacity=".18" stroke="#6954d9" stroke-width="5"/>
 <path d="M25 110h235" stroke="#b9a8ef" stroke-width="18"/><circle cx="75" cy="110" r="8" fill="#17385e"/>
</g>
<text x="450" y="477" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">مقارنة انتقال الشحنات في موصل وعازل كهربائي</text>
</svg>`);

  addGroup(436, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="التيار والمجال المغناطيسي">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">التيار والمجال المغناطيسي</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">ملف كهربائي ومجال مغناطيسي</text>

<rect x="180" y="285" width="540" height="42" rx="20" fill="#ef8b3a"/>
<g fill="none" stroke="#6954d9" stroke-width="9">
 <ellipse cx="300" cy="306" rx="42" ry="90"/><ellipse cx="370" cy="306" rx="42" ry="90"/><ellipse cx="440" cy="306" rx="42" ry="90"/><ellipse cx="510" cy="306" rx="42" ry="90"/><ellipse cx="580" cy="306" rx="42" ry="90"/>
</g>
<path d="M220 190q230-125 460 0M220 420q230 125 460 0" fill="none" stroke="#2c82c9" stroke-width="5"/>
<path d="M180 306H100" stroke="#526b85" stroke-width="8"/><polygon points="100,306 128,289 128,323" fill="#526b85"/>
<text x="450" y="485" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">ملف يمر فيه تيار وينشأ حوله مجال مغناطيسي</text>
</svg>`);

  addGroup(451, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الطاقة الحرارية ودرجة الحرارة">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الطاقة الحرارية ودرجة الحرارة</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">حركة الجسيمات ودرجة الحرارة</text>

<g transform="translate(135 175)">
 <rect width="260" height="250" rx="25" fill="#dff3ff" stroke="#2c82c9" stroke-width="5"/>
 <g fill="#6bb7e8"><circle cx="50" cy="55" r="15"/><circle cx="110" cy="90" r="15"/><circle cx="190" cy="55" r="15"/><circle cx="70" cy="160" r="15"/><circle cx="160" cy="180" r="15"/><circle cx="220" cy="135" r="15"/></g>
</g>
<g transform="translate(505 175)">
 <rect width="260" height="250" rx="25" fill="#fff0e5" stroke="#ef8b3a" stroke-width="5"/>
 <g fill="#ef8b3a"><circle cx="45" cy="45" r="15"/><circle cx="135" cy="65" r="15"/><circle cx="215" cy="40" r="15"/><circle cx="75" cy="180" r="15"/><circle cx="175" cy="205" r="15"/><circle cx="225" cy="135" r="15"/></g>
 <g stroke="#ef6d78" stroke-width="4"><path d="M25 25l-20-18M95 35l-5-25M180 25l15-22M50 135l-25 15M150 150l25 10M220 100l20-20"/></g>
</g>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">حركة الجسيمات تزداد مع ارتفاع درجة الحرارة</text>
</svg>`);

  addGroup(466, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="انتقال الحرارة وقياسها">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">انتقال الحرارة وقياسها</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">التوصيل والحمل والإشعاع</text>

<g transform="translate(80 180)">
 <rect x="0" y="140" width="220" height="45" rx="16" fill="#dfe8ef"/><rect x="85" y="35" width="50" height="120" rx="18" fill="#ef8b3a"/>
 <path d="M110 35V0" stroke="#ef6d78" stroke-width="6"/>
</g>
<g transform="translate(340 170)">
 <path d="M40 20v190q0 40 95 40t95-40V20" fill="#e6f5ff" stroke="#2c82c9" stroke-width="5"/><path d="M58 130h154v80q0 25-77 25t-77-25z" fill="#7ecbed"/>
 <path d="M85 195q-35-45 0-85M185 110q35 45 0 85" fill="none" stroke="#ef8b3a" stroke-width="6"/>
</g>
<g transform="translate(650 205)">
 <circle cx="65" cy="85" r="48" fill="#ffd76a"/><g stroke="#ef8b3a" stroke-width="6"><path d="M65 20V0M65 170v20M0 85h-20M130 85h20M18 38L0 20M112 132l18 18M112 38l18-18M18 132L0 150"/></g>
</g>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">نماذج للتوصيل والحمل والإشعاع كطرق انتقال للحرارة</text>
</svg>`);

  addGroup(481, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الحرارة النوعية">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الحرارة النوعية</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">استجابة مواد مختلفة للتسخين</text>

<g transform="translate(120 180)">
 <rect width="250" height="230" rx="22" fill="#dfe8ef" stroke="#526b85" stroke-width="5"/><path d="M35 150h180" stroke="#6bb7e8" stroke-width="70"/>
 <rect x="180" y="20" width="20" height="150" rx="10" fill="#fff" stroke="#ef6d78" stroke-width="4"/><rect x="185" y="80" width="10" height="85" rx="5" fill="#ef6d78"/>
</g>
<g transform="translate(530 180)">
 <rect width="250" height="230" rx="22" fill="#fff0e5" stroke="#ef8b3a" stroke-width="5"/><path d="M35 150h180" stroke="#ffc36e" stroke-width="70"/>
 <rect x="180" y="20" width="20" height="150" rx="10" fill="#fff" stroke="#ef6d78" stroke-width="4"/><rect x="185" y="55" width="10" height="110" rx="5" fill="#ef6d78"/>
</g>
<text x="450" y="478" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">عينتان متماثلتا الكتلة تستجيبان للحرارة بمعدلين مختلفين</text>
</svg>`);

  addGroup(496, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الطاقة الحركية وطاقة الوضع">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الطاقة الحركية وطاقة الوضع</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">تحولات الطاقة الميكانيكية</text>

<path d="M100 390q120-260 250 0t250 0t200-70" fill="none" stroke="#6954d9" stroke-width="14" stroke-linecap="round"/>
<g transform="translate(235 195)"><rect width="85" height="46" rx="12" fill="#ef8b3a"/><circle cx="18" cy="50" r="14" fill="#263748"/><circle cx="67" cy="50" r="14" fill="#263748"/></g>
<path d="M245 165v-65" stroke="#2c82c9" stroke-width="7"/><polygon points="245,100 230,130 260,130" fill="#2c82c9"/>
<path d="M540 390h95" stroke="#ef6d78" stroke-width="8"/><polygon points="635,390 605,372 605,408" fill="#ef6d78"/>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">تحول بين طاقة الوضع وطاقة الحركة على مسار مرتفع ومنخفض</text>
</svg>`);

  addGroup(511, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="حفظ الطاقة ومصادرها">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">حفظ الطاقة ومصادرها</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">مصادر طاقة وتحولاتها</text>

<circle cx="170" cy="210" r="55" fill="#ffd76a"/><g stroke="#ef8b3a" stroke-width="6"><path d="M170 130v-30M170 320v30M90 210H60M280 210h30"/></g>
<g transform="translate(340 160)" fill="#6bb7e8" stroke="#2c82c9" stroke-width="4">
 <rect x="0" y="120" width="180" height="110" rx="10"/><line x1="60" y1="120" x2="60" y2="230"/><line x1="120" y1="120" x2="120" y2="230"/><line x1="0" y1="175" x2="180" y2="175"/>
</g>
<g transform="translate(650 145)" stroke="#526b85" stroke-width="7" fill="none"><path d="M70 85v180"/><circle cx="70" cy="85" r="15" fill="#fff"/><path d="M70 85L15 25M70 85l80-10M70 85l-30 80"/></g>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">مصادر متجددة وتحولات للطاقة في منظومة شمسية ورياح</text>
</svg>`);

  addGroup(526, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الصوت">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الصوت</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">موجة صوتية ومصدر اهتزاز</text>

<g transform="translate(120 210)"><path d="M0 70h85l95-65v270l-95-65H0z" fill="#526b85"/><path d="M190 55q90 80 0 160M220 25q135 110 0 220" fill="none" stroke="#2c82c9" stroke-width="9"/></g>
<path d="M440 310q45-95 90 0t90 0t90 0" fill="none" stroke="#6954d9" stroke-width="8"/>
<line x1="440" y1="310" x2="790" y2="310" stroke="#d3dce5" stroke-width="3"/>
<text x="450" y="478" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">موجات صوتية تنتشر في وسط مادي مع تمثيل للتردد والسعة</text>
</svg>`);

  addGroup(541, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الضوء والطيف الكهرومغناطيسي">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الضوء والطيف الكهرومغناطيسي</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">ضوء وطيف وانكسار</text>

<g transform="translate(120 220)">
 <path d="M0 80h200" stroke="#fff1a5" stroke-width="18"/><polygon points="235,80 195,45 195,115" fill="#fff1a5"/>
</g>
<polygon points="410,190 520,340 300,340" fill="#fff" stroke="#526b85" stroke-width="5"/>
<g stroke-width="12"><path d="M410 265l270-100" stroke="#ef6d78"/><path d="M420 275l270-55" stroke="#ef8b3a"/><path d="M430 286l270-10" stroke="#ffd76a"/><path d="M435 298l265 40" stroke="#55b978"/><path d="M430 310l250 95" stroke="#2c82c9"/><path d="M420 320l220 135" stroke="#6954d9"/></g>
<text x="450" y="490" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">تحلل الضوء إلى ألوان الطيف وتمثيل لسلوك الموجات الكهرومغناطيسية</text>
</svg>`);

  addGroup(556, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="استكشاف الكون">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">استكشاف الكون</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">مركبة فضائية وأدوات رصد</text>

<circle cx="680" cy="215" r="70" fill="#6bb7e8"/><path d="M625 205q55-50 110 0q-55 55-110 0" fill="#2e9b6f" opacity=".8"/>
<g transform="translate(210 170)"><path d="M80 0l55 95-28 75H53L25 95z" fill="#dfe8ef" stroke="#526b85" stroke-width="5"/><circle cx="80" cy="72" r="22" fill="#6bb7e8"/><path d="M55 170l25 70 25-70" fill="#ef8b3a"/></g>
<path d="M350 220q150-100 260 0" fill="none" stroke="#b9a8ef" stroke-width="5" stroke-dasharray="12 10"/>
<circle cx="510" cy="145" r="12" fill="#ffd76a"/>
<text x="450" y="478" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">مركبة فضائية وأرض وأجرام بعيدة لتمثيل أدوات استكشاف الكون</text>
</svg>`);

  addGroup(571, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الأجرام السماوية وظروفها">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الأجرام السماوية وظروفها</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">أنواع مختلفة من الأجرام</text>

<circle cx="170" cy="285" r="80" fill="#ffd76a"/>
<circle cx="430" cy="285" r="52" fill="#6bb7e8"/><ellipse cx="430" cy="285" rx="95" ry="25" fill="none" stroke="#b9a8ef" stroke-width="8"/>
<circle cx="690" cy="285" r="68" fill="#ef8b3a"/><circle cx="660" cy="260" r="10" fill="#b86d2d"/><circle cx="715" cy="315" r="14" fill="#b86d2d"/>
<g fill="#fff"><circle cx="110" cy="145" r="5"/><circle cx="330" cy="165" r="6"/><circle cx="560" cy="145" r="5"/><circle cx="780" cy="155" r="6"/></g>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">أجرام سماوية مختلفة في الحجم والتركيب والظروف الفيزيائية</text>
</svg>`);

  addGroup(586, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="التغيرات المناخية">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">التغيرات المناخية</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">الأرض واتجاهات مناخية</text>

<circle cx="280" cy="305" r="115" fill="#6bb7e8"/><path d="M220 260q80-75 140 0q-35 35-140 0M250 350q75-45 115 15q-80 45-115-15" fill="#55b978"/>
<g transform="translate(520 180)" fill="none" stroke="#ef6d78" stroke-width="7"><path d="M0 220V0M0 220h230"/><polyline points="20,195 65,175 105,150 150,105 205,55" stroke-width="10"/></g>
<path d="M445 335q45-75 90 0" fill="none" stroke="#ef8b3a" stroke-width="7"/>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">الأرض ومنحنى اتجاه عام لتمثيل تغير المناخ عبر الزمن</text>
</svg>`);

  addGroup(601, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="دورة الكربون">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">دورة الكربون</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">انتقال الكربون في النظام الأرضي</text>

<circle cx="450" cy="280" r="105" fill="#6bb7e8"/><path d="M380 250q70-70 140 0q-35 45-140 0M410 330q80-40 110 25q-65 40-110-25" fill="#55b978"/>
<path d="M255 230q-75 40-55 120q15 55 80 65" fill="none" stroke="#2e9b6f" stroke-width="7"/><polygon points="280,415 250,400 255,432" fill="#2e9b6f"/>
<path d="M645 335q75-40 55-120q-15-55-80-65" fill="none" stroke="#ef8b3a" stroke-width="7"/><polygon points="620,150 650,165 645,133" fill="#ef8b3a"/>
<g transform="translate(105 325)"><rect width="105" height="75" fill="#697786"/><path d="M80 0v-80h25V0" fill="#697786"/><path d="M95-95q35-45 60 0" fill="none" stroke="#a9b3bb" stroke-width="13"/></g>
<g transform="translate(690 335)"><rect x="0" y="20" width="16" height="70" fill="#8a5b3d"/><circle cx="8" cy="0" r="45" fill="#55b978"/></g>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">انتقال الكربون بين الغلاف الجوي والكائنات والأنشطة البشرية</text>
</svg>`);

  addGroup(616, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الدورات الطبيعية">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الدورات الطبيعية</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">انتقال المادة في دورة طبيعية</text>

<circle cx="450" cy="290" r="125" fill="#e8f8ff" stroke="#2c82c9" stroke-width="5"/>
<path d="M450 175q95 20 115 105" fill="none" stroke="#2c82c9" stroke-width="9"/><polygon points="565,280 540,255 575,250" fill="#2c82c9"/>
<path d="M565 315q-30 95-115 105" fill="none" stroke="#55b978" stroke-width="9"/><polygon points="450,420 470,395 480,425" fill="#55b978"/>
<path d="M415 420q-95-25-115-105" fill="none" stroke="#ef8b3a" stroke-width="9"/><polygon points="300,315 325,340 290,345" fill="#ef8b3a"/>
<path d="M300 280q30-90 115-105" fill="none" stroke="#6954d9" stroke-width="9"/><polygon points="415,175 395,200 385,170" fill="#6954d9"/>
<path d="M415 300q35-70 70 0q-35 55-70 0" fill="#6bb7e8"/>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">دورة طبيعية مغلقة توضح انتقال المادة بين خزانات مختلفة</text>
</svg>`);

  addGroup(631, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="المعادن وخصائص الصخور">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">المعادن وخصائص الصخور</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">عينات معدنية وبلورية</text>

<g transform="translate(115 210)">
 <polygon points="70,20 145,0 205,65 165,155 65,175 10,105" fill="#8bd1c0" stroke="#2e9b6f" stroke-width="5"/>
 <path d="M70 20l60 95 75-50M10 105l120 10" stroke="#fff" stroke-width="4" opacity=".55"/>
</g>
<g transform="translate(370 190)">
 <polygon points="85,0 170,55 150,170 60,210 0,125 20,40" fill="#b9a8ef" stroke="#6954d9" stroke-width="5"/>
 <path d="M20 40l130 130M0 125l170-70" stroke="#fff" stroke-width="4" opacity=".55"/>
</g>
<g transform="translate(650 230)">
 <polygon points="60,0 125,35 115,115 45,145 0,85 10,25" fill="#ffc36e" stroke="#ef8b3a" stroke-width="5"/>
</g>
<text x="450" y="478" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">عينات معدنية بأشكال بلورية مختلفة لتمثيل خواص المعادن والصخور</text>
</svg>`);

  addGroup(691, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="النشاط البشري والمخاطر الطبيعية">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">النشاط البشري والمخاطر الطبيعية</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">تفاعل الإنسان مع المخاطر الطبيعية</text>

<path d="M70 395q120-190 250 0t250 0t260 0v60H70z" fill="#cfeecf"/>
<g transform="translate(145 250)"><rect width="120" height="110" fill="#dfe8ef"/><path d="M0 0l60-60 60 60" fill="#ef6d78"/></g>
<path d="M410 180l-65 175h130z" fill="#8a6b58"/><path d="M385 245q25-65 50 0q-25 35-50 0" fill="#ef8b3a"/>
<g transform="translate(640 245)"><rect width="110" height="120" fill="#697786"/><path d="M70 0v-85h25V0" fill="#697786"/><path d="M85-100q35-40 60 0" fill="none" stroke="#a9b3bb" stroke-width="12"/></g>
<path d="M300 405q40-80 80 0" fill="none" stroke="#6bb7e8" stroke-width="12"/>
<text x="450" y="480" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">مخاطر طبيعية مع منشآت بشرية توضح أثر النشاط البشري في مستوى الخطر</text>
</svg>`);

  addGroup(706, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="الموارد الطبيعية واستدامتها">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#eef6ff"/></linearGradient>
  <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2c82c9"/><stop offset="1" stop-color="#6bb7e8"/></linearGradient>
  <linearGradient id="violet" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6954d9"/><stop offset="1" stop-color="#9b8cf0"/></linearGradient>
  <linearGradient id="green" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2e9b6f"/><stop offset="1" stop-color="#72c99f"/></linearGradient>
  <linearGradient id="orange" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef8b3a"/><stop offset="1" stop-color="#ffc36e"/></linearGradient>
  <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".14"/></filter>
</defs>
<rect width="900" height="520" rx="30" fill="url(#bg)"/>
<rect x="25" y="22" width="850" height="76" rx="22" fill="#fff" filter="url(#shadow)"/>
<text x="450" y="55" text-anchor="middle" font-size="27" font-weight="800" fill="#17385e" direction="rtl">الموارد الطبيعية واستدامتها</text>
<text x="450" y="82" text-anchor="middle" font-size="14" font-weight="600" fill="#657a92" direction="rtl">موارد واستخدام مستدام</text>

<circle cx="250" cy="300" r="105" fill="#6bb7e8"/><path d="M180 270q70-70 140 0q-35 45-140 0M210 350q80-40 115 25q-70 40-115-25" fill="#55b978"/>
<g transform="translate(470 185)" fill="#6bb7e8" stroke="#2c82c9" stroke-width="4"><rect x="0" y="115" width="180" height="115" rx="10"/><line x1="60" y1="115" x2="60" y2="230"/><line x1="120" y1="115" x2="120" y2="230"/><line x1="0" y1="173" x2="180" y2="173"/></g>
<path d="M730 205q-55 25-70 80q15 65 80 70q60-30 55-95q-15-40-65-55z" fill="#72c99f"/><path d="M730 355V230" stroke="#2e9b6f" stroke-width="7"/>
<text x="450" y="478" text-anchor="middle" font-size="18" fill="#526b85" direction="rtl">موارد طبيعية مع طاقة متجددة واستخدام مستدام للبيئة</text>
</svg>`);


  // ===== صور تغيرات الأرض الواقعية الموجودة أصلًا في مجلد nafs =====
  addGroup(646, img('./rock-cycle.webp','صورة واقعية مرتبطة بأنواع الصخور ودورة الصخور'));

  // الإجهادات والزلازل والبراكين: نختار الصورة بحسب نمط المفهوم داخل المجموعة.
  for(let offset=1; offset<=14; offset++){
    if(offset===9) continue;
    const n=661+offset;
    const concept=(n-661)%3;
    M['NAFS-'+String(n).padStart(4,'0')] =
      concept===2
      ? img('./volcano-structure.webp','صورة واقعية مرتبطة بالبراكين وتركيب البركان')
      : img('./earthquake-fault.webp','صورة واقعية مرتبطة بالإجهادات والصدوع والزلازل');
  }

  // حركة الصفائح: طبقات الأرض للمفهوم الأول، وصورة الصفائح لبقية المفاهيم.
  for(let offset=1; offset<=14; offset++){
    if(offset===9) continue;
    const n=676+offset;
    const concept=(n-676)%3;
    M['NAFS-'+String(n).padStart(4,'0')] =
      concept===0
      ? img('./earth-layers.webp','صورة واقعية مرتبطة بالغلاف الصخري وطبقات الأرض والستار')
      : img('./earth-plates.webp','صورة واقعية مرتبطة بحركة الصفائح وحدودها وآثارها');
  }

  window.NAFS_VISUAL_MEDIA=M;
})();
