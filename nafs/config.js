// رابط Web App الخاص بمنصة تدريب نافس
window.NAFS_API_URL = 'https://script.google.com/macros/s/AKfycbyCZB1jIsV2tH3g3eXPbzcw_8YOE6hDTroK2_tD9tfp3l9N3qTHI1jd5iKYVQLgprKIfQ/exec';

// ===== تسريع لوحة المعلم =====
// لا يعمل إلا في teacher.html ولا يؤثر على صفحة الطالب.
(function(){

  if(!/\/nafs\/teacher\.html$/i.test(location.pathname)) return;

  const CACHE_KEY='nafsTeacherFastCacheV3';
  const pendingDeleteIds=new Set();
  let deleteBusy=false;

  window.addEventListener('load',()=>{

    const originalLoadDashboard=window.loadDashboard;

    function saveTeacherCache(){
      try{
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            students:Array.isArray(data.students)?data.students:[],
            results:Array.isArray(data.results)?data.results:[],
            sessions:Array.isArray(data.sessions)?data.sessions:[],
            config:data.config||{},
            tasks:Array.isArray(data.tasks)?data.tasks:[],
            questionOverrides:Array.isArray(data.questionOverrides)
              ?data.questionOverrides:[],
            savedAt:Date.now()
          })
        );
      }catch(e){
        console.warn('teacher cache save',e);
      }
    }

    function restoreTeacherCache(){
      try{
        const raw=localStorage.getItem(CACHE_KEY);
        if(!raw) return false;

        const c=JSON.parse(raw);
        if(!c) return false;

        data.students=Array.isArray(c.students)?c.students:[];
        data.results=Array.isArray(c.results)?c.results:[];
        data.sessions=Array.isArray(c.sessions)?c.sessions:[];
        data.tasks=Array.isArray(c.tasks)?c.tasks:[];
        data.config=c.config||{};

        if(
          Array.isArray(c.questionOverrides) &&
          c.questionOverrides.length
        ){
          data.questionOverrides=c.questionOverrides;
        }

        if($('testOpen') && data.config.testOpen!==undefined){
          $('testOpen').value=
            String(data.config.testOpen).toUpperCase();
        }

        if(
          $('showResult') &&
          data.config.showResultToStudent!==undefined
        ){
          $('showResult').value=
            String(data.config.showResultToStudent).toUpperCase();
        }

        renderAll();

        return true;

      }catch(e){
        console.warn('teacher cache restore',e);
        return false;
      }
    }

    // تحديث الخادم (يُظهر النتيجة الحقيقية)
    function isBusy(){
      return typeof dashboardRefreshing!=='undefined' && dashboardRefreshing;
    }

    function waitIdle(maxMs=130000){
      return new Promise(res=>{
        const start=Date.now();
        (function check(){
          if(!isBusy() || Date.now()-start>maxMs) return res();
          setTimeout(check,250);
        })();
      });
    }

    let queuedRun=null;

    async function runRefresh(silent){
      await originalLoadDashboard(silent);

      if(pendingDeleteIds.size){
        data.tasks=(data.tasks||[]).filter(
          t=>!pendingDeleteIds.has(String(t.taskId))
        );
        if(document.querySelector('.tab.active')?.id==='tab-tasks'){
          renderTasks();
        }
      }

      // الحفظ في الكاش بعد النجاح فقط
      saveTeacherCache();
      return true;
    }

    window.loadDashboard=async function(silent=false){

      if(!key()){
        if(!silent) msg('أدخل مفتاح المعلم أولًا.',true);
        return false;
      }

      try{

        // أثناء الحذف أو وجود تحديث جارٍ: جدولة تحديث جديد بعده بدل تجاهل الطلب
        if(deleteBusy || isBusy()){

          if(!silent) msg('يوجد تحديث جارٍ، سيتم جلب أحدث البيانات فور انتهائه...');

          // تحديث تلقائي متكرر لا داعي لجدولته
          if(silent && !deleteBusy) return false;

          if(!queuedRun){
            queuedRun=(async()=>{
              await waitIdle();
              while(deleteBusy) await new Promise(r=>setTimeout(r,250));
              try{ return await runRefresh(silent); }
              finally{ queuedRun=null; }
            })();
          }
          return await queuedRun;
        }

        return await runRefresh(silent);

      }catch(e){
        if(!silent){
          // نعرض الخطأ دون رميه، حتى لا تظهر عمليات الحفظ الناجحة كأنها فشلت
          msg('تعذر تحديث العرض: '+(e.message||e)+' — ما حفظته محفوظ في الخادم، اضغط "تحديث البيانات" بعد قليل.',true);
          return false;
        }
        throw e;
      }
    };

    // حذف سريع جدًا
    window.deleteTask=async function(id){

      id=String(id||'');

      const t=(data.tasks||[]).find(
        x=>String(x.taskId)===id
      );

      const title=t?.title||id;

      if(!confirm(
        'هل تريد حذف التكليف "'+
        title+
        '" نهائيًا؟\n\n'+
        'لن يتم حذف نتائج الطلاب السابقة.'
      )) return;

      const previousTasks=[...(data.tasks||[])];

      // يختفي من الشاشة فورًا
      pendingDeleteIds.add(id);
      deleteBusy=true;

      data.tasks=(data.tasks||[]).filter(
        x=>String(x.taskId)!==id
      );

      renderTasks();
      saveTeacherCache();

      try{

        await jsonp({
          action:'deleteTask',
          key:key(),
          taskId:id
        },30000);

        pendingDeleteIds.delete(id);
        deleteBusy=false;

        msg('تم حذف التكليف بنجاح.');

        // مزامنة صامتة بعد الحذف
        setTimeout(()=>{
          loadDashboard(true).catch(()=>{});
        },300);

      }catch(e){

        pendingDeleteIds.delete(id);
        deleteBusy=false;

        // إعادة التكليف فقط إذا فشل الحذف
        data.tasks=previousTasks;

        renderTasks();
        saveTeacherCache();

        alert(
          'تعذر حذف التكليف: '+
          e.message
        );
      }
    };

    // فتح فوري من النسخة المحفوظة
    const restored=restoreTeacherCache();

    if(key()){

      msg(restored
        ?'تم فتح آخر البيانات، ويجري تحديثها في الخلفية...'
        :'جاري تجهيز البيانات لأول مرة...');

      setTimeout(async()=>{
        try{
          const ok=await loadDashboard(true);
          if(ok) msg('تم تحديث البيانات.');
        }catch(e){
          msg((restored
            ?'تعذر التحديث، المعروض آخر نسخة محفوظة: '
            :'تعذر تحميل البيانات: ')+(e.message||e),true);
        }
      },10);
    }

  });

})();
// ===== إصلاح دخول الباركود 2026-10-07 =====
(function(){
  if(!/\/nafs\/(?:index\.html)?$/i.test(location.pathname)) return;

  const FIXED_API =
    'https://script.google.com/macros/s/AKfycbyCZB1jIsV2tH3g3eXPbzcw_8YOE6hDTroK2_tD9tfp3l9N3qTHI1jd5iKYVQLgprKIfQ/exec';

  function directJsonp(params,timeout=60000){
    return new Promise((resolve,reject)=>{
      const cb =
        'nafsBarcodeFix_' +
        Date.now() +
        '_' +
        Math.random().toString(36).slice(2);

      const s=document.createElement('script');
      let done=false;

      const timer=setTimeout(
        ()=>finish(new Error('انتهت مهلة الاتصال بالخادم')),
        timeout
      );

      function cleanup(){
        clearTimeout(timer);
        try{
          delete window[cb];
        }catch(_e){
          window[cb]=undefined;
        }

        try{
          s.remove();
        }catch(_e){}
      }

      function finish(err,data){
        if(done) return;
        done=true;
        cleanup();

        if(err) reject(err);
        else resolve(data);
      }

      window[cb]=(data)=>{
        if(data && data.ok===false){
          return finish(
            new Error(data.message || 'رفض الخادم الطلب')
          );
        }

        finish(null,data);
      };

      const q=new URLSearchParams();

      Object.entries(params||{}).forEach(([k,v])=>{
        q.set(k,v==null ? '' : String(v));
      });

      q.set('callback',cb);
      q.set('_',String(Date.now()));

      s.async=true;
      s.referrerPolicy='no-referrer';
      s.src=FIXED_API+'?'+q.toString();

      s.onerror=()=>{
        finish(
          new Error('تعذر الاتصال بخادم نافس')
        );
      };

      document.head.appendChild(s);
    });
  }

  window.addEventListener('load',()=>{

    setTimeout(async()=>{

      try{

        const code=(
          new URLSearchParams(location.search)
            .get('code') || ''
        ).trim();

        if(!code) return;

        if(
          typeof state!=='undefined' &&
          state.identity
        ) return;

        const info=await directJsonp({
          action:'studentInfo',
          code:code
        });

        const st=info && info.student;

        if(
          !st ||
          !st.code ||
          !st.name ||
          !['1/3','2/3','3/3','4/3']
            .includes(String(st.className))
        ){
          throw new Error(
            'الباركود غير صالح أو الطالب غير مسجل.'
          );
        }

        if(typeof state!=='undefined'){
          state.identity={
            studentName:st.name,
            className:st.className,
            studentCode:st.code
          };
        }

        const val=(id,value)=>{
          const el=document.getElementById(id);

          if(!el) return;

          if('value' in el){
            el.value=value;
          }else{
            el.textContent=value;
          }
        };

        val('studentName',st.name);
        val('className',st.className);

        val(
          'studentDisplayName',
          st.name
        );

        val(
          'studentDisplayClass',
          'الفصل '+st.className
        );

        val(
          'heroStudentName',
          st.name
        );

        val(
          'heroStudentClass',
          'الفصل '+st.className
        );

        const show=id=>{
          document
            .getElementById(id)
            ?.classList.remove('hidden');
        };

        const hide=id=>{
          document
            .getElementById(id)
            ?.classList.add('hidden');
        };

        show('studentIdentityCard');
        show('heroStudentBadge');
        show('modeGrid');

        hide('barcodeRequired');

        if(
          typeof updateLandingTaskButton==='function'
        ){
          updateLandingTaskButton();
        }

        if(
          typeof startStudentSession==='function'
        ){
          startStudentSession();
        }

        if(
          typeof ensureQuestionBankReady==='function' &&
          typeof loadStudentTasks==='function'
        ){

          ensureQuestionBankReady()
            .then(loadStudentTasks)
            .catch(()=>loadStudentTasks());

        }else if(
          typeof loadStudentTasks==='function'
        ){
          loadStudentTasks();
        }

        const msg=
          document.getElementById('identityMsg');

        if(msg){

          const safeName=
            String(st.name).replace(
              /[&<>"']/g,
              m=>({
                '&':'&amp;',
                '<':'&lt;',
                '>':'&gt;',
                '"':'&quot;',
                "'":'&#39;'
              }[m])
            );

          msg.innerHTML=
            '<div class="notice success">' +
            'تم التعرف على الطالب بنجاح. أهلاً ' +
            safeName +
            '.</div>';
        }

      }catch(err){

        console.warn(
          'NAFS barcode repair',
          err
        );

      }

    },1200);

  },{once:true});

})();
// ===== إصلاح فصل الطالب المخزن كتاريخ 2026-10-07 =====
(function(){
  function norm(v){
    var raw=String(v==null?'':v).trim(),t=raw.replace(/\s*[\\\/\-_ ]\s*/g,'/'),a,b,m=t.match(/^(\d{1,2})\/(\d{1,2})$/);
    if(m){a=+m[1];b=+m[2];}else{var d=new Date(raw);if(isNaN(d))return raw;d=new Date(d.getTime()+432e5);a=d.getUTCMonth()+1;b=d.getUTCDate();}
    var s=(a===3&&b>=1&&b<=4)?b:((b===3&&a>=1&&a<=4)?a:0);
    return s?s+'/3':raw;
  }
  var orig=Node.prototype.appendChild;
  Node.prototype.appendChild=function(n){
    try{
      if(n&&n.tagName==='SCRIPT'&&/[?&]action=studentInfo(&|$)/.test(n.src||'')){
        var cb=new URL(n.src).searchParams.get('callback'),f=cb&&window[cb];
        if(typeof f==='function')window[cb]=function(d){
          try{if(d&&d.student)d.student.className=norm(d.student.className);}catch(e){}
          return f.apply(this,arguments);
        };
      }
    }catch(e){}
    return orig.apply(this,arguments);
  };
})();
// ===== تسريع ظهور التكليف 2026-10-07 =====
(function(){
  var code=(new URLSearchParams(location.search).get('code')||'').trim();
  if(!code||!window.NAFS_API_URL)return;
  var orig=Node.prototype.appendChild,pre={},t0=Date.now();
  function fetchNow(action,extra){
    var p=new Promise(function(ok,bad){
      var cb='nafsPre_'+action+'_'+t0,s=document.createElement('script'),q=new URLSearchParams(extra||{});
      q.set('action',action);q.set('callback',cb);q.set('_',String(t0));
      var tm=setTimeout(function(){bad()},40000);
      window[cb]=function(d){clearTimeout(tm);try{delete window[cb]}catch(e){}s.remove();(d&&d.ok!==false)?ok(d):bad()};
      s.onerror=function(){clearTimeout(tm);bad()};
      s.src=window.NAFS_API_URL+'?'+q.toString();
      orig.call(document.head,s);
    });
    p.catch(function(){});
    pre[action]=p;
  }
  fetchNow('studentTasks',{studentCode:code});
  fetchNow('questionOverrides');
  Node.prototype.appendChild=function(n){
    try{
      if(n&&n.tagName==='SCRIPT'&&n.src&&n.src.indexOf(window.NAFS_API_URL)===0){
        var u=new URL(n.src),a=u.searchParams.get('action'),cb=u.searchParams.get('callback'),p=pre[a];
        var same=a==='questionOverrides'||(a==='studentTasks'&&u.searchParams.get('studentCode')===code);
        if(p&&same&&Date.now()-t0<90000){
          delete pre[a];
          var self=this;
          p.then(function(d){if(typeof window[cb]==='function')window[cb](d)},
                 function(){orig.call(self,n)});
          return n;
        }
      }
    }catch(e){}
    return orig.apply(this,arguments);
  };
})();
// ===== إصلاح زر إنهاء التدريب 2026-10-08 =====
window.addEventListener('load',function(){
  if(typeof nextAction!=='function'||typeof finishCurrent!=='function')return;
  var origNext=nextAction;
  window.nextAction=async function(){
    try{
      if(typeof state!=='undefined'&&state.questions.length&&state.index>=state.questions.length&&!state.submitting){
        return await finishCurrent();
      }
    }catch(e){}
    return origNext.apply(this,arguments);
  };
});
// ===== إصلاح حفظ نتيجة التدريب 2026-10-08 =====
(function(){
  function addMissing(){
    ['mistakesBtn','testEntryBtn'].forEach(function(id){
      if(!document.getElementById(id)){
        var b=document.createElement('button');
        b.id=id;b.type='button';b.style.display='none';
        document.body.appendChild(b);
      }
    });
  }
  if(document.body)addMissing();
  document.addEventListener('DOMContentLoaded',addMissing);
})();
// ===== إظهار نتيجة التدريب فورًا والحفظ في الخلفية 2026-10-08 =====
(function(){
  var QKEY='nafsPendingTraining';
  function readQ(){try{return JSON.parse(localStorage.getItem(QKEY)||'[]')}catch(e){return[]}}
  function writeQ(q){try{localStorage.setItem(QKEY,JSON.stringify(q))}catch(e){}}
  var flushing=false;
  async function flush(){
    if(flushing||typeof jsonp!=='function')return;
    flushing=true;
    try{
      var q=readQ();
      for(var i=0;i<q.length;i++){
        try{
          await jsonp({action:'saveTraining',data:JSON.stringify(q[i].data)},120000);
          var now=readQ().filter(function(x){return x.id!==q[i].id});
          writeQ(now);
        }catch(e){ break; }
      }
    }finally{ flushing=false; }
    if(readQ().length)setTimeout(flush,20000);
  }
  window.addEventListener('load',function(){
    setTimeout(flush,3000);
    if(typeof finishCurrent!=='function'||typeof state==='undefined')return;
    var origFinish=finishCurrent;
    window.finishCurrent=async function(){
      if(state.mode!=='training')return origFinish.apply(this,arguments);
      try{stopTimer()}catch(e){}
      var correct=0,wrong=[];
      state.questions.forEach(function(q,i){if(state.answers[i]===q.correctIndex)correct++;else wrong.push(q)});
      state.correct=correct;state.lastWrongQuestions=wrong;
      var mb=document.getElementById('mistakesBtn');if(mb)mb.disabled=!wrong.length;
      var total=state.questions.length,pct=Math.round(correct/total*100);
      var data={studentName:state.identity.studentName,className:state.identity.className,studentCode:state.identity.studentCode||'',
        topic:state.topic,loginAt:window.__nafsLoginAt,startedAt:new Date(state.startAt).toISOString(),submittedAt:new Date().toISOString(),
        correct:correct,total:total,percent:pct,durationSec:Math.round((Date.now()-state.startAt)/1000),
        wrongQuestionIds:wrong.map(function(q){return q.id}),sessionId:state.sessionId||'',
        taskId:(state.currentTask&&state.currentTask.taskId)||'',taskTitle:(state.currentTask&&state.currentTask.title)||state.topic,
        taskType:(state.currentTask&&state.currentTask.type)||'training'};
      var q=readQ();q.push({id:'P'+Date.now()+Math.random().toString(36).slice(2,6),data:data});writeQ(q);
      try{renderResult({score:correct,total:total,percent:pct,showResult:true},true)}catch(e){}
      try{document.getElementById('loading').classList.add('hidden')}catch(e){}
      try{touchStudentSession('إنهاء تدريب: '+state.topic,true)}catch(e){}
      flush();
    };
  });
})();
// ===== حالة إرسال النتيجة للمعلم 2026-10-08 =====
(function(){
  var seen=false,since=0;
  function pending(){try{return JSON.parse(localStorage.getItem('nafsPendingTraining')||'[]').length}catch(e){return 0}}
  function box(){
    var b=document.getElementById('sendStatus');
    if(!b){
      var rt=document.getElementById('resultText');if(!rt)return null;
      b=document.createElement('div');b.id='sendStatus';
      b.style.cssText='margin:12px auto 0;padding:10px 16px;border-radius:12px;font-weight:700;max-width:520px;text-align:center';
      rt.insertAdjacentElement('afterend',b);
    }
    return b;
  }
  function paint(b,txt,bg,fg){b.textContent=txt;b.style.background=bg;b.style.color=fg;b.style.display='block'}
  setInterval(function(){
    var r=document.getElementById('result');
    if(!r||r.classList.contains('hidden')){seen=false;var o=document.getElementById('sendStatus');if(o)o.style.display='none';return}
    if(typeof state!=='undefined'&&state.mode!=='training')return;
    var b=box();if(!b)return;
    if(pending()>0){
      if(!seen){seen=true;since=Date.now()}
      if(Date.now()-since>120000)paint(b,'لم يكتمل الإرسال بعد بسبب الاتصال. ستُرسل النتيجة تلقائيًا عند فتح رابطك مرة أخرى.','#fff4e5','#8a4b00');
      else paint(b,'⏳ جارٍ إرسال النتيجة إلى المعلم... لا تغلق الصفحة','#eef4ff','#1d3f8f');
    }else if(seen){
      paint(b,'✓ تم إرسال النتيجة إلى المعلم بنجاح','#e8f7ee','#1b6b3a');
    }
  },300);
})();
