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
// ===== مشاركة تقرير المشاركين عبر واتساب وتلجرام 2026-10-09 =====
window.addEventListener('load',function(){
  if(typeof window.viewTaskParticipants!=='function')return;
  var orig=window.viewTaskParticipants;
  function cls(v){
    v=String(v||'').trim();
    if(/^\d{4}-\d{2}-\d{2}T/.test(v)){var d=new Date(new Date(v).getTime()+12*3600e3);v=(d.getUTCMonth()+1)+'/'+d.getUTCDate();}
    return v;
  }
  function wa(t){return 'https://wa.me/?text='+encodeURIComponent(t)}
  function tg(t){return 'https://t.me/share/url?url='+encodeURIComponent(' ')+'&text='+encodeURIComponent(t)}
  function btn(label,bg,fn){var b=document.createElement('button');b.type='button';b.textContent=label;
    b.style.cssText='border:0;border-radius:10px;padding:7px 12px;margin:3px;font-weight:700;cursor:pointer;color:#fff;background:'+bg;
    b.onclick=fn;return b}
  function open(u){window.open(u,'_blank')}
  window.viewTaskParticipants=function(id){
    orig.apply(this,arguments);
    try{
      var body=document.getElementById('appModalBody');if(!body)return;
      var title=(document.getElementById('appModalTitle').textContent||'').replace(/^المشاركون\s*—\s*/,'');
      var rows=[].slice.call(body.querySelectorAll('tbody tr')).filter(function(r){return r.children.length>=6});
      if(!rows.length)return;
      var head=body.querySelector('thead tr');if(head){var th=document.createElement('th');th.textContent='إرسال';head.appendChild(th);}
      var list=rows.map(function(r){
        var c=r.children;c[2].textContent=cls(c[2].textContent);
        return{name:c[1].textContent.trim(),cls:c[2].textContent.trim(),att:c[3].textContent.trim(),pct:c[4].textContent.trim(),at:c[5].textContent.trim(),row:r};
      });
      var klass=list[0].cls;
      var sum='📊 تقرير تكليف: '+title+'\nالفصل: '+klass+'\nعدد المشاركين: '+list.length+' طالبًا\n\n'+
        list.map(function(p,i){return (i+1)+'. '+p.name+' — '+p.pct}).join('\n')+
        '\n\nمنصة تدريب نافس • متوسطة أبي الدرداء';
      var bar=document.createElement('div');bar.style.cssText='margin-top:12px;text-align:center';
      bar.appendChild(btn('واتساب: ملخص الفصل','#1fa855',function(){open(wa(sum))}));
      bar.appendChild(btn('تلجرام: ملخص الفصل','#229ed9',function(){open(tg(sum))}));
      bar.appendChild(btn('نسخ الملخص','#5b6b85',function(){
        (navigator.clipboard?navigator.clipboard.writeText(sum):Promise.reject()).then(function(){alert('تم نسخ الملخص.')},function(){prompt('انسخ الملخص:',sum)});
      }));
      body.appendChild(bar);
      list.forEach(function(p){
        var msg='📘 تقرير الطالب: '+p.name+'\nالفصل: '+p.cls+'\nالتكليف: '+title+'\nنتيجة آخر محاولة: '+p.pct+'\nعدد المحاولات: '+p.att+'\nآخر مشاركة: '+p.at+'\n\nمنصة تدريب نافس • متوسطة أبي الدرداء';
        var td=document.createElement('td');td.style.whiteSpace='nowrap';
        td.appendChild(btn('واتساب','#1fa855',function(){open(wa(msg))}));
        td.appendChild(btn('تلجرام','#229ed9',function(){open(tg(msg))}));
        p.row.appendChild(td);
      });
    }catch(e){console.warn('share report',e)}
  };
});
// ===== المشاركة عبر تطبيقات الجهاز بدل مواقع الويب 2026-10-09 =====
(function(){
  var origOpen=window.open;
  window.open=function(u){
    try{
      var s=String(u||''),m=null,app='';
      if(s.indexOf('https://wa.me/?text=')===0){m=s.split('text=')[1];app='whatsapp://send?text=';}
      else if(s.indexOf('https://t.me/share/url')===0){m=s.split('&text=')[1];app='tg://msg?text=';}
      if(m!==null){
        var text=decodeURIComponent(m);
        if(navigator.share){navigator.share({text:text}).catch(function(){});return null;}
        location.href=app+encodeURIComponent(text);return null;
      }
    }catch(e){}
    return origOpen.apply(window,arguments);
  };
})();
// ===== تقرير مفصل لكل تكليف بالرسوم البيانية 2026-10-16 =====
window.addEventListener('load',function(){
  if(typeof window.renderTasks!=='function')return;
  function cls(v){v=String(v==null?'':v).trim();
    if(/^\d{4}-\d{2}-\d{2}T/.test(v)){var d=new Date(new Date(v).getTime()+12*3600e3);v=(d.getUTCMonth()+1)+'/'+d.getUTCDate();}return v}
  function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function fd(v){if(!v)return '—';try{return new Intl.DateTimeFormat('ar-SA',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(v))}catch(e){return String(v)}}
  function dur(s){s=Number(s||0);if(!(s>0))return '—';var m=Math.floor(s/60),x=Math.round(s%60);return m+'د '+x+'ث'}
  function pj(v){if(v&&typeof v==='object')return v;try{return JSON.parse(String(v||''))}catch(e){return null}}
  function avg(a){return a.length?a.reduce(function(x,y){return x+y},0)/a.length:0}
  function r0(x){return Math.round(x)}
  var BANDS=[{n:'ممتاز',min:90,c:'#104281'},{n:'جيد جدًا',min:80,c:'#1c5cab'},{n:'جيد',min:70,c:'#2a78d6'},{n:'مقبول',min:60,c:'#5598e7'},{n:'يحتاج دعمًا',min:0,c:'#86b6ef'}];
  function band(p){for(var i=0;i<BANDS.length;i++)if(p>=BANDS[i].min)return i;return BANDS.length-1}

  function vbars(items,opt){ // أعمدة رأسية من اليمين لليسار
    var W=640,H=260,pr=40,pb=56,pt=24,max=opt.max||Math.max.apply(null,items.map(function(i){return i.value}).concat([1]));
    var bw=(W-pr-10)/items.length,g='';
    for(var k=0;k<=4;k++){var y=pt+(H-pt-pb)*(1-k/4);g+='<line x1="10" x2="'+(W-pr)+'" y1="'+y+'" y2="'+y+'" stroke="#e7e6e2"/><text x="'+(W-pr+6)+'" y="'+(y+4)+'" direction="ltr" text-anchor="start" font-size="11" fill="#76746f">'+r0(max*k/4)+(opt.pct?'%':'')+'</text>'}
    items.forEach(function(it,i){var h=(H-pt-pb)*(it.value/max),x=W-pr-(i+1)*bw+bw*0.18,w=bw*0.64,y=H-pb-h,cx=x+w/2;
      g+='<g><title>'+E(it.tip||(it.label+': '+it.display))+'</title><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+Math.max(h,0)+'" rx="4" fill="'+(it.color||'#2a78d6')+'"/>'+
      '<text x="'+cx+'" y="'+(y-6)+'" direction="ltr" text-anchor="middle" font-size="12" font-weight="700" fill="#0b0b0b">'+E(it.display)+'</text>'+
      '<text x="'+cx+'" y="'+(H-pb+18)+'" text-anchor="middle" font-size="12" fill="#52514e">'+E(it.label)+'</text>'+(it.sub?'<text x="'+cx+'" y="'+(H-pb+34)+'" direction="ltr" text-anchor="middle" font-size="11" fill="#76746f">'+E(it.sub)+'</text>':'')+'</g>'});
    return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+E(opt.aria||'')+'">'+g+'<line x1="10" x2="'+(W-pr)+'" y1="'+(H-pb)+'" y2="'+(H-pb)+'" stroke="#b9b7b0"/></svg>';
  }
  function hbars(items,opt){ // أشرطة أفقية تبدأ من اليمين
    var W=640,row=28,lab=230,x0=W-lab,span=x0-50,H=items.length*row+24,g='';
    [0,25,50,75,100].forEach(function(t){var x=x0-span*t/100;g+='<line x1="'+x+'" x2="'+x+'" y1="4" y2="'+(H-18)+'" stroke="#e7e6e2"/><text x="'+x+'" y="'+(H-4)+'" direction="ltr" text-anchor="middle" font-size="11" fill="#76746f">'+t+'%</text>'});
    items.forEach(function(it,i){var y=8+i*row,w=span*Math.max(0,Math.min(100,it.value))/100;
      g+='<g><title>'+E(it.tip||(it.label+': '+it.display))+'</title><text x="'+(W-4)+'" y="'+(y+15)+'" direction="rtl" text-anchor="start" font-size="12" fill="#0b0b0b">'+E(it.label.length>34?it.label.slice(0,33)+'…':it.label)+'</text>'+
      '<rect x="'+(x0-Math.max(w,2))+'" y="'+(y+3)+'" width="'+Math.max(w,2)+'" height="16" rx="4" fill="'+(it.color||'#2a78d6')+'"/><text x="'+(x0-w-6)+'" y="'+(y+15)+'" direction="ltr" text-anchor="end" font-size="12" font-weight="700" fill="#0b0b0b">'+E(it.display)+'</text></g>'});
    return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+E(opt.aria||'')+'">'+g+'</svg>';
  }

  async function build(id,w){
    var t=(tasks||[]).find(function(x){return String(x.taskId)===String(id)});if(!t)throw new Error('التكليف غير موجود');
    var all=(dashboardData.results||[]);
    try{var full=await jsonp({action:'results',key:teacherKey()},90000);if(full&&Array.isArray(full.results))all=full.results}catch(e){}
    var tc=cls(t.className);
    var res=all.filter(function(r){return String(r.taskId||'')===String(id)});
    var roster=(dashboardData.students||[]).filter(function(s){return cls(s.className)===tc&&String(s.status||'ACTIVE').toUpperCase()==='ACTIVE'});
    var by={};
    res.forEach(function(r){var k=String(r.studentCode||r.studentName||'').trim();if(!k)return;
      (by[k]=by[k]||{code:r.studentCode,name:r.studentName||k,list:[]}).list.push(r)});
    var studs=Object.keys(by).map(function(k){var s=by[k];s.list.sort(function(a,b){return String(a.submittedAt)<String(b.submittedAt)?-1:1});
      var ps=s.list.map(function(r){return Number(r.percent)||0});
      s.attempts=ps.length;s.first=r0(ps[0]);s.last=r0(ps[ps.length-1]);s.best=r0(Math.max.apply(null,ps));
      s.avgDur=avg(s.list.map(function(r){return Number(r.durationSec)||0}));s.lastAt=s.list[s.list.length-1].submittedAt;return s});
    studs.sort(function(a,b){return b.last-a.last});
    var partCodes={};studs.forEach(function(s){partCodes[String(s.code)]=1;partCodes[String(s.name).trim()]=1});
    var non=roster.filter(function(s){return!partCodes[String(s.code)]&&!partCodes[String(s.name).trim()]});
    var lasts=studs.map(function(s){return s.last});
    var classSize=roster.length,np=studs.length;
    var partPct=classSize?r0(np/classSize*100):0;
    var mastery=np?r0(studs.filter(function(s){return s.last>=80}).length/np*100):0;
    var sorted=lasts.slice().sort(function(a,b){return a-b});
    var median=np?(np%2?sorted[(np-1)/2]:r0((sorted[np/2-1]+sorted[np/2])/2)):0;
    // توزيع المستويات
    var bc=BANDS.map(function(){return 0});lasts.forEach(function(p){bc[band(p)]++});
    // تحليل الأسئلة
    var qids=(t.questionIds||[]).map(String);var bank={};
    try{(typeof mergedBank==='function'?mergedBank():[]).forEach(function(q){bank[String(q.id)]=q})}catch(e){}
    var qs={};qids.forEach(function(q){qs[q]={id:q,seen:0,wrong:0}});
    var analysed=0;
    res.forEach(function(r){var a=pj(r.answers);if(!a)return;analysed++;
      if(Array.isArray(a)){a.forEach(function(x){var q=String(x.id||x.questionId||'');if(!q)return;qs[q]=qs[q]||{id:q,seen:0,wrong:0};qs[q].seen++;if(!Number(x.correct))qs[q].wrong++})}
      else{var wr=(a.wrongQuestionIds||[]).map(String);qids.forEach(function(q){qs[q].seen++});wr.forEach(function(q){qs[q]=qs[q]||{id:q,seen:1,wrong:0};qs[q].wrong++})}});
    var qlist=Object.keys(qs).map(function(k){var q=qs[k],b=bank[k]||{};q.rate=q.seen?r0((q.seen-q.wrong)/q.seen*100):null;q.text=b.text||'';q.outcome=b.outcomeTitle||b.lesson||'';q.code=b.outcomeCode||'';q.level=b.cognitiveLevel||'';q.domain=b.officialDomain||b.domain||'';return q}).filter(function(q){return q.rate!==null});
    qlist.forEach(function(q,i){q.n=qids.indexOf(q.id)+1||i+1});
    var hard=qlist.slice().sort(function(a,b){return a.rate-b.rate}).slice(0,5);
    function groupBy(f){var m={};qlist.forEach(function(q){var k=q[f]||'غير محدد';m[k]=m[k]||{s:0,n:0};m[k].s+=q.seen-q.wrong;m[k].n+=q.seen});return Object.keys(m).map(function(k){return{label:k,value:m[k].n?r0(m[k].s/m[k].n*100):0}})}
    var levels=groupBy('level'),outs=groupBy('outcome').sort(function(a,b){return a.value-b.value});
    // ملاحظات مستخرجة من البيانات فقط
    var notes=[];
    if(classSize)notes.push('شارك '+np+' من '+classSize+' طالبًا في الفصل ('+partPct+'%).');
    if(np)notes.push('متوسط نتيجة آخر محاولة '+r0(avg(lasts))+'%، وبلغت نسبة الإتقان (80% فأكثر) '+mastery+'%.');
    if(np&&bc[4])notes.push(bc[4]+' طالبًا نتيجتهم أقل من 60% ويحتاجون دعمًا.');
    if(hard.length)notes.push('أصعب سؤال: السؤال رقم '+hard[0].n+' بنسبة إجابة صحيحة '+hard[0].rate+'%.');
    if(outs.length>1)notes.push('أضعف ناتج تعلم في هذا التكليف: «'+outs[0].label+'» ('+outs[0].value+'%).');
    var improved=studs.filter(function(s){return s.attempts>1&&s.last>s.first}).length;
    if(improved)notes.push(improved+' طالبًا تحسنت نتيجتهم بين أول محاولة وآخر محاولة.');

    var kpi=function(l,v,s){return '<div class="kpi"><div class="kv">'+v+'</div><div class="kl">'+l+'</div>'+(s?'<div class="ks">'+s+'</div>':'')+'</div>'};
    var typeName={training:'تدريب',test:'اختبار',remedial:'علاجي',enrichment:'إثرائي'}[t.type]||t.type||'—';
    var html='<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>تقرير '+E(t.title)+'</title>'+
    '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">'+
    '<style>:root{--bg:#f4f6fa;--card:#fff;--ink:#0b0b0b;--ink2:#52514e;--muted:#76746f;--line:#e7e6e2;--accent:#1c5cab}'+
    '*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:Tajawal,Tahoma,Arial,sans-serif;line-height:1.7}'+
    '.wrap{max-width:900px;margin:0 auto;padding:20px 16px 40px}header{background:linear-gradient(135deg,#0d366b,#1c5cab);color:#fff;border-radius:20px;padding:22px 24px}'+
    'header h1{margin:0 0 4px;font-size:24px}header p{margin:0;opacity:.9;font-size:14px}.meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.meta span{background:rgba(255,255,255,.15);border-radius:999px;padding:3px 12px;font-size:13px}'+
    '.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px 18px;margin-top:16px;break-inside:avoid}h2{margin:0 0 4px;font-size:18px;color:var(--accent)}.sub{margin:0 0 12px;color:var(--muted);font-size:13px}'+
    '.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:16px}.kpi{background:#fff;border:1px solid var(--line);border-radius:16px;padding:12px;text-align:center}.kv{font-size:26px;font-weight:800;color:#0d366b}.kl{font-size:13px;color:var(--ink2)}.ks{font-size:11px;color:var(--muted)}'+
    'svg{width:100%;height:auto;display:block}table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:8px 6px;border-bottom:1px solid var(--line);text-align:right;vertical-align:top}th{background:#f1f4f9;color:var(--ink2);font-weight:700}td.n{text-align:center}'+
    '.pill{display:inline-block;border-radius:999px;padding:1px 10px;font-size:12px;font-weight:700;color:#fff}.notes li{margin-bottom:4px}.tools{display:flex;gap:8px;justify-content:center;margin-top:16px}.tools button{border:0;border-radius:12px;padding:10px 18px;font:inherit;font-weight:700;cursor:pointer;background:#1c5cab;color:#fff}'+
    '.non{columns:2;font-size:13px}.legend{display:flex;flex-wrap:wrap;gap:10px;font-size:12px;color:var(--ink2);margin-top:6px}.legend i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-left:4px;vertical-align:-2px}'+
    'footer{text-align:center;color:var(--muted);font-size:12px;margin-top:20px}@media print{body{background:#fff}.tools{display:none}.card,.kpi{border-color:#ccc}header{-webkit-print-color-adjust:exact;print-color-adjust:exact}svg rect,.pill{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'+
    '@media(max-width:560px){.non{columns:1}header h1{font-size:20px}}</style></head><body><div class="wrap">'+
    '<header><h1>تقرير أداء الطلاب — '+E(t.title)+'</h1><p>منصة تدريب نافس • علوم الصف الثالث المتوسط • متوسطة أبي الدرداء</p>'+
    '<div class="meta"><span>الفصل '+E(tc)+'</span><span>'+E(typeName)+'</span><span>'+(qids.length)+' سؤالًا</span>'+(t.openAt?'<span>من '+E(fd(t.openAt))+'</span>':'')+(t.closeAt?'<span>إلى '+E(fd(t.closeAt))+'</span>':'')+'</div></header>'+
    '<div class="kpis">'+kpi('طلاب الفصل',classSize||'—')+kpi('المشاركون',np,partPct+'% من الفصل')+kpi('متوسط النتيجة',np?r0(avg(lasts))+'%':'—','آخر محاولة')+kpi('الوسيط',np?median+'%':'—')+kpi('أعلى نتيجة',np?Math.max.apply(null,lasts)+'%':'—')+kpi('أدنى نتيجة',np?Math.min.apply(null,lasts)+'%':'—')+kpi('نسبة الإتقان',np?mastery+'%':'—','80% فأكثر')+kpi('إجمالي المحاولات',res.length)+'</div>';
    if(!np){html+='<div class="card"><h2>لا توجد مشاركات بعد</h2><p class="sub">لم يُسجَّل أي طالب نتيجة في هذا التكليف حتى الآن.</p></div>'}
    else{
      html+='<div class="card"><h2>ملاحظات من البيانات</h2><ul class="notes">'+notes.map(function(n){return '<li>'+E(n)+'</li>'}).join('')+'</ul></div>';
      html+='<div class="card"><h2>توزيع الطلاب حسب المستوى</h2><p class="sub">حسب نتيجة آخر محاولة لكل طالب • العدد ونسبته من المشاركين</p>'+
        vbars(BANDS.map(function(b,i){return{label:b.n,value:bc[i],display:bc[i]+' ('+(np?r0(bc[i]/np*100):0)+'%)',color:b.c,sub:b.min?(b.min+'%'+(i?'–'+(BANDS[i-1].min-1)+'%':'+')):'أقل من 60%'}}),{aria:'توزيع المستويات'})+'</div>';
      html+='<div class="card"><h2>نتيجة كل طالب</h2><p class="sub">آخر محاولة، مرتبة من الأعلى</p>'+
        hbars(studs.map(function(s){return{label:s.name,value:s.last,display:s.last+'%',color:BANDS[band(s.last)].c,tip:s.name+' — آخر محاولة '+s.last+'%، أفضل '+s.best+'%، '+s.attempts+' محاولات'}}),{aria:'نتيجة كل طالب'})+
        '<div class="legend">'+BANDS.map(function(b){return '<span><i style="background:'+b.c+'"></i>'+b.n+'</span>'}).join('')+'</div></div>';
      if(qlist.length){
        html+='<div class="card"><h2>نسبة الإجابة الصحيحة لكل سؤال</h2><p class="sub">من '+analysed+' محاولة • مرتبة من الأصعب</p>'+
          hbars(qlist.slice().sort(function(a,b){return a.rate-b.rate}).map(function(q){return{label:'س'+q.n+(q.outcome?' — '+q.outcome:''),value:q.rate,display:q.rate+'%',tip:'السؤال '+q.n+': '+q.text}}),{aria:'نسبة صحة كل سؤال'})+'</div>';
        if(levels.length>1||levels[0].label!=='غير محدد')html+='<div class="card"><h2>الأداء حسب المستوى المعرفي</h2><p class="sub">نسبة الإجابات الصحيحة</p>'+vbars(levels.map(function(l){return{label:l.label,value:l.value,display:l.value+'%'}}),{max:100,pct:true,aria:'المستوى المعرفي'})+'</div>';
        if(outs.length>1)html+='<div class="card"><h2>الأداء حسب ناتج التعلم</h2><p class="sub">نسبة الإجابات الصحيحة، من الأضعف</p>'+hbars(outs.map(function(o){return{label:o.label,value:o.value,display:o.value+'%'}}),{aria:'نواتج التعلم'})+'</div>';
        html+='<div class="card"><h2>الأسئلة الأكثر صعوبة</h2><table><thead><tr><th>#</th><th>السؤال</th><th>ناتج التعلم</th><th>المستوى</th><th>الإجابة الصحيحة</th></tr></thead><tbody>'+
          hard.map(function(q){return '<tr><td class="n">'+q.n+'</td><td>'+E(q.text||q.id)+'</td><td>'+E(q.outcome)+(q.code?'<br><small>'+E(q.code)+'</small>':'')+'</td><td>'+E(q.level)+'</td><td class="n"><b>'+q.rate+'%</b></td></tr>'}).join('')+'</tbody></table></div>';
      }else{html+='<div class="card"><h2>تحليل الأسئلة</h2><p class="sub">لا تتوفر تفاصيل الإجابات لهذا التكليف.</p></div>'}
      html+='<div class="card"><h2>تفاصيل الطلاب</h2><div style="overflow-x:auto"><table><thead><tr><th>#</th><th>الطالب</th><th>المحاولات</th><th>أول</th><th>آخر</th><th>أفضل</th><th>المستوى</th><th>متوسط الزمن</th><th>آخر مشاركة</th></tr></thead><tbody>'+
        studs.map(function(s,i){var b=BANDS[band(s.last)];return '<tr><td class="n">'+(i+1)+'</td><td>'+E(s.name)+'</td><td class="n">'+s.attempts+'</td><td class="n">'+s.first+'%</td><td class="n"><b>'+s.last+'%</b></td><td class="n">'+s.best+'%</td><td><span class="pill" style="background:'+b.c+'">'+b.n+'</span></td><td class="n">'+dur(s.avgDur)+'</td><td>'+E(fd(s.lastAt))+'</td></tr>'}).join('')+'</tbody></table></div></div>';
      if(non.length)html+='<div class="card"><h2>لم يشاركوا بعد ('+non.length+')</h2><ol class="non">'+non.map(function(s){return '<li>'+E(s.name)+'</li>'}).join('')+'</ol></div>';
    }
    html+='<div class="tools"><button onclick="window.print()">🖨️ طباعة / حفظ PDF</button></div><footer>أُنشئ التقرير في '+E(fd(new Date().toISOString()))+'</footer></div></body></html>';
    w.document.open();w.document.write(html);w.document.close();
  }
  window.openTaskReport=function(id){
    var w=window.open('','_blank');
    if(!w){alert('اسمح بفتح النوافذ المنبثقة لعرض التقرير.');return}
    w.document.write('<html dir="rtl"><body style="font-family:Tahoma;text-align:center;padding:60px;color:#1c5cab">⏳ جارٍ إعداد التقرير وجلب أحدث النتائج...</body></html>');
    build(id,w).catch(function(e){w.document.body.innerHTML='تعذر إعداد التقرير: '+E(e.message||e)});
  };
  var orig=window.renderTasks;
  window.renderTasks=function(){
    orig.apply(this,arguments);
    try{document.querySelectorAll('#tasksList button[onclick*="viewTaskParticipants"]').forEach(function(b){
      if(b.nextElementSibling&&b.nextElementSibling.classList.contains('nafs-report-btn'))return;
      var m=String(b.getAttribute('onclick')).match(/viewTaskParticipants\((.*)\)/);if(!m)return;
      var id;try{id=JSON.parse(m[1])}catch(e){id=m[1].replace(/['"]/g,'')}
      var r=document.createElement('button');r.className='btn-mini btn-view nafs-report-btn';r.textContent='📊 تقرير';
      r.onclick=function(){openTaskReport(id)};b.insertAdjacentElement('afterend',r);
    })}catch(e){}
  };
  try{window.renderTasks()}catch(e){}
});
