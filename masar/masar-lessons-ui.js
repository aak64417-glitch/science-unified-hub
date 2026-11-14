/* ===== مسار التقدم — ملف الدروس: تنقل أسهل وأكثر سلاسة =====
   - شريط علوي مضغوط ثابت، وعلى الجوال شريط سفلي للأقسام الرئيسة.
   - المحطات الخمس كدرب مرقّم يظهر كاملًا، مع زر «المحطة التالية» دائم.
   - زر الرجوع في المتصفح/الجوال يعيد إلى المكتبة بدل الخروج من الصفحة.
   لا يغيّر محتوى الدروس ولا حفظ النتائج أو إرسالها. */
(function(){
  'use strict';
  if(typeof state==='undefined'||typeof render!=='function'||typeof DB==='undefined')return;
  var STEPS=[['teach','📖','الشرح'],['lab','🧪','التجربة'],['skills','🎯','المهارات'],['review','✍️','التدريب'],['bank','📝','الاختبارات']];
  var stepIndex=function(t){for(var i=0;i<STEPS.length;i++)if(STEPS[i][0]===t)return i;return 0};

  /* ---------- الشعار وأزرار التنقل ---------- */
  var atom=document.querySelector('.atom');
  if(atom)atom.innerHTML='<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6 27c0-7 14-5 14-12S8 10 8 5" stroke="#0A4239" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="0.1 6"/><circle cx="6" cy="27" r="3" fill="#0A4239"/><path d="M22 4v9" stroke="#0A4239" stroke-width="2.4" stroke-linecap="round"/><path d="M22 4l7 2.6-7 2.6z" fill="#EE6C2B"/></svg>';
  var NAV={home:['📚','الدروس'],progress:['📈','تقدّمي'],guide:['💡','الدليل']};
  Array.prototype.forEach.call(document.querySelectorAll('#topnav [data-nav]'),function(b){var n=NAV[b.dataset.nav];if(n)b.innerHTML='<i>'+n[0]+'</i><span>'+n[1]+'</span>'});

  /* ---------- المحطات كدرب مرقّم ---------- */
  tabs=function(){
    if(stepIndex(state.tab)===0&&state.tab!=='teach')state.tab='teach';
    var cur=stepIndex(state.tab);
    return '<nav class="tabs mz-steps" aria-label="محطات الدرس">'+STEPS.map(function(s,i){
      return '<button type="button" data-tab="'+s[0]+'" class="'+(i===cur?'active':i<cur?'passed':'')+'"'+(i===cur?' aria-current="step"':'')+'><i>'+s[1]+'</i><span>'+(i+1)+'. '+s[2]+'</span></button>';
    }).join('')+'</nav>';
  };

  /* ---------- الدروس المتاحة للتنقل (المكلّفة فقط عند دخول الطالب بالباركود) ---------- */
  function lessonList(){
    var all=DB.lessons.map(function(_,i){return i});
    try{if(typeof MASAR!=='undefined'&&MASAR.status==='ok'&&MASAR.assigned&&MASAR.assigned.size&&!MASAR.showAll){
      var mine=all.filter(function(i){return MASAR.assigned.has(i)});if(mine.indexOf(state.li)>=0)return mine}}catch(e){}
    return all;
  }

  /* ---------- إضافات شاشة الدرس ---------- */
  function decorateLesson(){
    var hero=app.querySelector('.hero-lesson');if(!hero)return;
    var list=lessonList(),pos=list.indexOf(state.li),prevL=pos>0?list[pos-1]:-1,nextL=pos>=0&&pos<list.length-1?list[pos+1]:-1;
    if(!app.querySelector('.mz-crumb')){
      var c=document.createElement('div');c.className='mz-crumb';
      c.innerHTML='<button type="button" class="mz-back" data-nav="home">→ مكتبة الدروس</button>'+
        '<span class="mz-pos">الدرس '+(pos+1)+' من '+list.length+'</span>'+
        '<button type="button" class="mz-arrow" data-mz-lesson="'+prevL+'"'+(prevL<0?' disabled':'')+' aria-label="الدرس السابق" title="الدرس السابق">→<span> السابق</span></button>'+
        '<button type="button" class="mz-arrow" data-mz-lesson="'+nextL+'"'+(nextL<0?' disabled':'')+' aria-label="الدرس التالي" title="الدرس التالي"><span>التالي </span>←</button>';
      hero.parentNode.insertBefore(c,hero);
    }
    var old=app.querySelector('[data-next-lesson]');if(old){var row=old.closest('.row');if(row)row.remove()}
    /* أزرار الانتقال القديمة داخل المحطة تتكرر مع شريط «السابقة / التالية» */
    Array.prototype.forEach.call(app.querySelectorAll('#lessonbody .row'),function(r){
      var kids=r.children;if(kids.length&&Array.prototype.every.call(kids,function(k){return k.matches('button.btn[data-tab]')}))r.remove();
    });
    if(!app.querySelector('.mz-pager')){
      var cur=stepIndex(state.tab),p=document.createElement('div');p.className='mz-pager';
      var prevBtn=cur>0?'<button type="button" class="mz-prev" data-tab="'+STEPS[cur-1][0]+'">→ السابقة</button>':'<button type="button" class="mz-prev" data-nav="home">→ المكتبة</button>';
      var nextBtn=cur<STEPS.length-1
        ?'<button type="button" class="mz-next" data-tab="'+STEPS[cur+1][0]+'"><span>المحطة التالية: '+STEPS[cur+1][2]+' '+STEPS[cur+1][1]+'</span><span>←</span></button>'
        :(nextL>=0?'<button type="button" class="mz-next" data-mz-lesson="'+nextL+'"><span>الدرس التالي: '+esc(DB.lessons[nextL].title)+'</span><span>←</span></button>'
                  :'<button type="button" class="mz-next" data-nav="home"><span>أنهيت المحطات 🎉 العودة إلى المكتبة</span></button>');
      p.innerHTML=prevBtn+nextBtn;
      var body=document.getElementById('lessonbody');
      if(body&&body.parentNode)body.parentNode.insertBefore(p,body.nextSibling);else app.appendChild(p);
    }
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-mz-lesson]');if(!b||b.disabled)return;
    var i=Number(b.dataset.mzLesson);if(i>=0&&i<DB.lessons.length)openLesson(i);
  });

  /* ---------- سجل التصفح: زر الرجوع يعيد إلى المكتبة ---------- */
  var lastPage=null,lastLi=null,lastTab=null,popping=false,started=false;
  function hashOf(){return state.page==='lesson'?'lesson-'+state.li+'-'+state.tab:(state.page||'home')}
  function syncHistory(){
    var h='#'+hashOf();
    try{
      var pageChanged=state.page!==lastPage||(state.page==='lesson'&&state.li!==lastLi);
      if(!started||popping||!pageChanged){if(location.hash!==h)history.replaceState(null,'',h)}
      else history.pushState(null,'',h);
    }catch(e){}
    started=true;
  }
  function restore(){
    var h=(location.hash||'').replace('#',''),m=/^lesson-(\d+)-([a-z]+)$/.exec(h);
    popping=true;
    try{
      if(m&&Number(m[1])<DB.lessons.length){
        var li=Number(m[1]),tab=m[2];
        if(state.page!=='lesson'||state.li!==li)openLesson(li);
        if(STEPS.some(function(s){return s[0]===tab})&&state.tab!==tab){state.tab=tab;state.quiz=null;render()}
      }else if(h==='progress'||h==='guide'){if(state.page!==h)route(h)}
      else if(state.page!=='home')route('home');
    }finally{popping=false}
  }
  window.addEventListener('popstate',restore);

  /* ---------- بعد كل رسم: الإضافات، الحركة، موضع التمرير ---------- */
  var _render=render;
  render=function(){
    var r=_render.apply(this,arguments);
    try{
      var pageChanged=state.page!==lastPage||(state.page==='lesson'&&state.li!==lastLi);
      var tabChanged=!pageChanged&&state.page==='lesson'&&state.tab!==lastTab;
      document.body.classList.toggle('in-lesson',state.page==='lesson');
      document.body.dataset.mzPage=state.page||'home';
      if(state.page==='lesson')decorateLesson();
      if(pageChanged){
        Array.prototype.forEach.call(app.children,function(el,i){el.classList.add('mz-enter');el.style.animationDelay=Math.min(i,5)*45+'ms'});
      }else if(tabChanged){
        var body=document.getElementById('lessonbody');if(body)body.classList.add('mz-enter-tab');
        var steps=app.querySelector('.mz-steps');
        if(steps){var bar=document.querySelector('body>header'),off=(bar?bar.offsetHeight:56)+6,top=steps.getBoundingClientRect().top;
          if(top<off-2||top>window.innerHeight*0.45)window.scrollTo({top:window.scrollY+top-off,behavior:'smooth'})}
      }
      if(pageChanged||tabChanged)syncHistory();
      lastPage=state.page;lastLi=state.li;lastTab=state.tab;
    }catch(e){console.warn('masar-ui',e)}
    return r;
  };

  /* ---------- البداية ---------- */
  var hasLi=false;try{hasLi=new URLSearchParams(location.search).has('li')}catch(e){}
  if(location.hash&&location.hash.length>1&&!hasLi)restore();
  render();
})();
