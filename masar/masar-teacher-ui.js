/* ===== مسار التقدم — لوحة المعلم: تنقل بالأقسام + الصفحة الرئيسية =====
   لا يغيّر منطق اللوحة: يوزّع البطاقات القائمة على أقسام، ويعرض قسمًا واحدًا في كل مرة.
   البطاقات تبقى أبناء مباشرين لـ #panel حتى لا تتأثر قواعد الطباعة (بطاقات الباركود والتقارير). */
(function(){
  'use strict';
  var panel=document.getElementById('panel'),login=document.getElementById('login');
  if(!panel)return;
  var $=function(id){return document.getElementById(id)};
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var VIEWS=[
    ['home','🏠','الرئيسية','نظرة عامة','الرئيسية'],
    ['assign','📚','تكليف الدروس','تفعيل الدروس للفصول','التكليف'],
    ['students','👥','الطلاب','المستهدفون وحالتهم','الطلاب'],
    ['cards','🔑','بطاقات الدخول','الباركود والروابط','البطاقات'],
    ['follow','📈','المتابعة','الزيارات والنتائج','المتابعة'],
    ['reports','📊','التقارير','تقدم الطلاب وملف الإنجاز','التقارير']
  ];
  var IDS=VIEWS.map(function(v){return v[0]});

  /* ---------- الشريط العلوي ---------- */
  var header=document.querySelector('body>header');
  if(header){
    var h1=header.querySelector('h1'),p=header.querySelector('p');
    var txt=document.createElement('div');
    if(h1){h1.textContent='مسار التقدم';txt.appendChild(h1)}
    if(p){p.textContent='لوحة المعلم · الخطة العلاجية لمادة العلوم';txt.appendChild(p)}
    var mark=document.createElement('div');mark.className='mz-mark';
    mark.innerHTML='<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6 27c0-7 14-5 14-12S8 10 8 5" stroke="#0A4239" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="0.1 6"/><circle cx="6" cy="27" r="3" fill="#0A4239"/><path d="M22 4v9" stroke="#0A4239" stroke-width="2.4" stroke-linecap="round"/><path d="M22 4l7 2.6-7 2.6z" fill="#EE6C2B"/></svg>';
    var tools=document.createElement('div');tools.className='mz-tools';
    header.textContent='';header.appendChild(mark);header.appendChild(txt);header.appendChild(tools);
    ['refresh','logout'].forEach(function(id){var b=$(id);if(b){b.classList.remove('secondary');tools.appendChild(b)}});
    if($('refresh'))$('refresh').textContent='↻ تحديث';
  }

  /* ---------- توزيع البطاقات على الأقسام ---------- */
  function cardOf(id){var el=$(id);while(el&&el.parentElement!==panel)el=el.parentElement;return el}
  function tag(id,view,sub){var c=cardOf(id);if(c){c.dataset.view=view;if(sub)c.dataset.sub=sub}return c}
  var noteCard=tag('note','note');
  if(noteCard){noteCard.classList.add('mz-notecard');var st=$('stats');if(st)st.style.display='none'}
  var prev=cardOf('previewToggle');if(prev){prev.dataset.view='home';prev.classList.add('mz-preview')}
  tag('asLessons','assign');tag('students','students');tag('qcRows','cards');
  tag('acTabs','follow','visits');tag('results','follow','results');
  var rep=panel.querySelector('.rp-card');if(rep)rep.dataset.view='reports';
  /* أي بطاقة لم تُصنَّف تبقى في الرئيسية حتى لا يختفي شيء */
  Array.prototype.forEach.call(panel.children,function(c){if(c.classList.contains('card')&&!c.dataset.view)c.dataset.view='home'});

  /* شريط الرسائل: يظهر في كل الأقسام عند وجود رسالة فقط */
  var css=document.createElement('style');
  css.textContent='body.tv-in #panel>.mz-notecard{display:none;padding:12px 16px!important;border-inline-start:6px solid #EE6C2B;margin-bottom:12px}body.tv-in #panel>.mz-notecard.has{display:block}body.tv-in:not([data-tv="reports"]) #reportWrap{display:none}';
  document.head.appendChild(css);
  var note=$('note');
  if(note&&noteCard){var syncNote=function(){noteCard.classList.toggle('has',!!note.textContent.trim())};new MutationObserver(syncNote).observe(note,{childList:true,characterData:true,subtree:true});syncNote()}

  /* ---------- الرئيسية ---------- */
  var home=document.createElement('div');home.className='card';home.id='mzHome';home.dataset.view='home';
  panel.insertBefore(home,panel.firstChild);
  function get(name){try{return (0,eval)(name)}catch(e){return []}}
  function drawHome(){
    var students=get('students')||[],assignments=get('assignments')||[],results=get('results')||[],logins=get('logins')||[];
    var active=students.filter(function(s){return s.active});
    var trainedIds={};results.forEach(function(r){trainedIds[r.student_id]=1});
    var trained=active.filter(function(s){return trainedIds[s.id]}).length;
    var day='';try{day=new Date().toLocaleDateString('ar-SA-u-ca-gregory-nu-latn',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}catch(e){}
    var tiles=[
      [students.length,'طالبًا مسجلًا','#0F5B4F'],
      [active.length,'نشطًا في الخطة','#2E8B6F'],
      [assignments.filter(function(a){return a.enabled}).length,'تكليفًا فعّالًا','#F4C04A'],
      [trained,'طالبًا تدرّب','#EE6C2B'],
      [results.length,'نتيجة مسجلة','#7A5AA6'],
      [logins.length,'مرة دخول','#3C7FA8']
    ];
    var classes={};active.forEach(function(s){(classes[s.class_name]=classes[s.class_name]||[]).push(s)});
    var rows=Object.keys(classes).sort().map(function(c){
      var n=classes[c].length,t=classes[c].filter(function(s){return trainedIds[s.id]}).length,pc=n?Math.round(t/n*100):0;
      return '<div class="mz-class"><b>'+esc(c)+'</b><div class="mz-bar"><i style="width:'+pc+'%"></i></div><span>تدرّب '+t+' من '+n+'</span></div>';
    }).join('');
    home.innerHTML=
      '<div class="mz-hero">'+(day?'<span class="mz-date">'+esc(day)+'</span>':'')+
        '<h2>مرحبًا بك في مسار التقدم</h2><p>من هنا تُسند الدروس العلاجية، وتوزّع بطاقات الدخول، وتتابع تدريب طلابك وتقاريرهم.</p>'+
        '<svg class="mz-trail" viewBox="0 0 330 150" fill="none" aria-hidden="true"><path d="M8 138c40-4 60-34 104-34s52 22 96 6 52-66 112-92" stroke="#F4C04A" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 13"/><circle cx="8" cy="138" r="7" fill="#F4C04A"/><circle cx="112" cy="104" r="7" fill="#fff"/><circle cx="208" cy="110" r="7" fill="#fff"/><path d="M318 20V-4" stroke="#fff" stroke-width="3"/><circle cx="318" cy="20" r="9" fill="#EE6C2B"/></svg>'+
      '</div>'+
      '<div class="mz-tiles">'+tiles.map(function(t){return '<div class="mz-tile" style="--c:'+t[2]+'"><b>'+t[0]+'</b><span>'+t[1]+'</span></div>'}).join('')+'</div>'+
      '<div class="mz-two">'+
        '<div class="mz-box"><h3>مشاركة الفصول في التدريب</h3>'+(rows||'<p class="mz-empty">لا يوجد طلاب نشطون بعد.</p>')+'</div>'+
        '<div class="mz-box"><h3>انتقل مباشرة إلى</h3><div class="mz-go">'+VIEWS.slice(1).map(function(v){return '<a href="#'+v[0]+'"><i>'+v[1]+'</i><span>'+v[2]+'<small>'+v[3]+'</small></span><em>←</em></a>'}).join('')+'</div></div>'+
      '</div>';
  }
  if(typeof window.render==='function'){
    var _render=window.render;
    window.render=function(){var r=_render.apply(this,arguments);try{drawHome()}catch(e){console.warn('mzHome',e)}return r};
  }
  drawHome();

  /* ---------- تبويب المتابعة: الزيارات / النتائج ---------- */
  var sub=document.createElement('div');sub.className='mz-sub';sub.dataset.view='follow';
  sub.innerHTML='<button type="button" data-s="visits">🚪 سجل الزيارات</button><button type="button" data-s="results">🎯 نتائج المهارات</button>';
  var firstFollow=panel.querySelector('[data-view="follow"]');
  if(firstFollow){
    sub.classList.add('card');sub.style.cssText='background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important';
    panel.insertBefore(sub,firstFollow);
  }
  function setSub(s){document.body.dataset.sub=s;Array.prototype.forEach.call(sub.children,function(b){b.classList.toggle('on',b.dataset.s===s)})}
  sub.addEventListener('click',function(e){var b=e.target.closest('[data-s]');if(b)setSub(b.dataset.s)});
  setSub('visits');

  /* ---------- القائمة ---------- */
  var nav=document.createElement('nav');nav.className='mz-nav';nav.setAttribute('aria-label','أقسام لوحة المعلم');
  nav.innerHTML=VIEWS.map(function(v){return '<a href="#'+v[0]+'" data-v="'+v[0]+'"><i>'+v[1]+'</i><span><b class="mz-l">'+v[2]+'</b><b class="mz-s">'+v[4]+'</b><small>'+v[3]+'</small></span></a>'}).join('')+
    '<div class="mz-nav-foot">مدرسة أبي الدرداء المتوسطة<br>علوم الأول المتوسط</div>';
  document.body.appendChild(nav);
  var current='';
  function apply(scroll){
    var v=(location.hash||'').replace('#','');if(IDS.indexOf(v)<0)v='home';
    if(v===current)return;current=v;
    document.body.dataset.tv=v;
    Array.prototype.forEach.call(nav.querySelectorAll('a'),function(a){var on=a.dataset.v===v;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    if(scroll!==false)window.scrollTo(0,0);
  }
  window.addEventListener('hashchange',function(){apply()});
  apply(false);

  /* ---------- حالة الدخول ---------- */
  function syncIn(){
    var on=!panel.classList.contains('hide');
    document.body.classList.toggle('tv-in',on);
    if(on)try{drawHome()}catch(e){}
  }
  new MutationObserver(syncIn).observe(panel,{attributes:true,attributeFilter:['class']});syncIn();

  /* ---------- التقرير: يُفتح داخل قسم التقارير ثم يعود إلى القسم السابق عند الإغلاق ---------- */
  var wrap=$('reportWrap'),back='';
  if(wrap)new MutationObserver(function(){
    var open=!wrap.classList.contains('hide');
    if(open){
      if(current!=='reports'){back=current;location.hash='reports'}
      setTimeout(function(){wrap.scrollIntoView({behavior:'smooth',block:'start'})},60);
    }else if(back){var b=back;back='';location.hash=b}
  }).observe(wrap,{attributes:true,attributeFilter:['class']});
})();
