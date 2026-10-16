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
// ===== تقرير التكليف في صفحة واحدة مع المشاركة والتنزيل والطباعة 2026-10-16 =====
window.addEventListener('load',function(){
  if(typeof window.renderTasks!=='function')return;
  function cls(v){v=String(v==null?'':v).trim();
    if(/^\d{4}-\d{2}-\d{2}T/.test(v)){var d=new Date(new Date(v).getTime()+12*3600e3);v=(d.getUTCMonth()+1)+'/'+d.getUTCDate();}return v}
  function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function fd(v,short){if(!v)return '—';try{return new Intl.DateTimeFormat('ar-SA',short?{month:'numeric',day:'numeric'}:{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(v))}catch(e){return String(v)}}
  function pj(v){if(v&&typeof v==='object')return v;try{return JSON.parse(String(v||''))}catch(e){return null}}
  function avg(a){return a.length?a.reduce(function(x,y){return x+y},0)/a.length:0}
  function r0(x){return Math.round(x)}
  var BANDS=[{n:'ممتاز',min:90,c:'#104281',t:'#fff'},{n:'جيد جدًا',min:80,c:'#1c5cab',t:'#fff'},{n:'جيد',min:70,c:'#2a78d6',t:'#fff'},{n:'مقبول',min:60,c:'#6da7ec',t:'#0b0b0b'},{n:'يحتاج دعمًا',min:0,c:'#b7d3f6',t:'#0b0b0b'}];
  function band(p){for(var i=0;i<BANDS.length;i++)if(p>=BANDS[i].min)return i;return BANDS.length-1}

  function distChart(bc,np){ // أعمدة رأسية من اليمين لليسار
    var W=360,H=170,pb=40,pt=20,max=Math.max.apply(null,bc.concat([1])),bw=(W-10)/5,g='';
    bc.forEach(function(v,i){var h=(H-pt-pb)*(v/max),x=W-(i+1)*bw+bw*0.16,w=bw*0.68,y=H-pb-h,cx=x+w/2,b=BANDS[i];
      g+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+Math.max(h,1)+'" rx="4" fill="'+b.c+'"/>'+
      '<text x="'+cx+'" y="'+(y-5)+'" direction="ltr" text-anchor="middle" font-size="11" font-weight="700" fill="#0b0b0b">'+v+' ('+(np?r0(v/np*100):0)+'%)</text>'+
      '<text x="'+cx+'" y="'+(H-pb+15)+'" text-anchor="middle" font-size="11" fill="#33322f">'+b.n+'</text>'+
      '<text x="'+cx+'" y="'+(H-pb+29)+'" direction="ltr" text-anchor="middle" font-size="9.5" fill="#76746f">'+(b.min?(i?b.min+'–'+(BANDS[i-1].min-1)+'%':b.min+'%+'):'< 60%')+'</text>'});
    return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="توزيع المستويات">'+g+'<line x1="4" x2="'+W+'" y1="'+(H-pb)+'" y2="'+(H-pb)+'" stroke="#b9b7b0"/></svg>';
  }
  function barList(items){ // أشرطة أفقية صغيرة
    return items.map(function(it){return '<div class="bl"><span class="bll">'+E(it.label)+'</span><span class="blt"><i style="width:'+Math.max(2,it.value)+'%"></i></span><b>'+it.value+'%</b></div>'}).join('');
  }

  async function collect(id){
    var t=(tasks||[]).find(function(x){return String(x.taskId)===String(id)});if(!t)throw new Error('التكليف غير موجود');
    var all=(dashboardData.results||[]);
    try{var full=await jsonp({action:'results',key:teacherKey()},90000);if(full&&Array.isArray(full.results))all=full.results}catch(e){}
    var tc=cls(t.className),res=all.filter(function(r){return String(r.taskId||'')===String(id)});
    var roster=(dashboardData.students||[]).filter(function(s){return cls(s.className)===tc&&String(s.status||'ACTIVE').toUpperCase()==='ACTIVE'});
    var by={};res.forEach(function(r){var k=String(r.studentCode||r.studentName||'').trim();if(!k)return;(by[k]=by[k]||{code:r.studentCode,name:r.studentName||k,list:[]}).list.push(r)});
    var studs=Object.keys(by).map(function(k){var s=by[k];s.list.sort(function(a,b){return String(a.submittedAt)<String(b.submittedAt)?-1:1});
      var ps=s.list.map(function(r){return Number(r.percent)||0});s.attempts=ps.length;s.first=r0(ps[0]);s.last=r0(ps[ps.length-1]);s.best=r0(Math.max.apply(null,ps));return s});
    studs.sort(function(a,b){return b.last-a.last||String(a.name).localeCompare(String(b.name),'ar')});
    var seen={};studs.forEach(function(s){seen[String(s.code)]=1;seen[String(s.name).trim()]=1});
    var non=roster.filter(function(s){return!seen[String(s.code)]&&!seen[String(s.name).trim()]});
    var lasts=studs.map(function(s){return s.last}),np=studs.length,size=roster.length;
    var sorted=lasts.slice().sort(function(a,b){return a-b});
    var bc=BANDS.map(function(){return 0});lasts.forEach(function(p){bc[band(p)]++});
    var qids=(t.questionIds||[]).map(String),bank={};
    try{(typeof mergedBank==='function'?mergedBank():[]).forEach(function(q){bank[String(q.id)]=q})}catch(e){}
    var qs={};qids.forEach(function(q){qs[q]={id:q,seen:0,wrong:0}});var analysed=0;
    res.forEach(function(r){var a=pj(r.answers);if(!a)return;analysed++;
      if(Array.isArray(a)){a.forEach(function(x){var q=String(x.id||x.questionId||'');if(!q)return;qs[q]=qs[q]||{id:q,seen:0,wrong:0};qs[q].seen++;if(!Number(x.correct))qs[q].wrong++})}
      else{qids.forEach(function(q){qs[q].seen++});(a.wrongQuestionIds||[]).map(String).forEach(function(q){qs[q]=qs[q]||{id:q,seen:1,wrong:0};qs[q].wrong++})}});
    var qlist=Object.keys(qs).map(function(k){var q=qs[k],b=bank[k]||{};q.rate=q.seen?r0((q.seen-q.wrong)/q.seen*100):null;q.n=qids.indexOf(k)+1;q.text=b.text||'';q.outcome=b.outcomeTitle||b.lesson||'';q.level=b.cognitiveLevel||'';return q}).filter(function(q){return q.rate!==null});
    qlist.sort(function(a,b){return a.n-b.n});
    function groupBy(f){var m={};qlist.forEach(function(q){var k=q[f];if(!k)return;m[k]=m[k]||{s:0,n:0};m[k].s+=q.seen-q.wrong;m[k].n+=q.seen});return Object.keys(m).map(function(k){return{label:k,value:m[k].n?r0(m[k].s/m[k].n*100):0}})}
    var hard=qlist.slice().sort(function(a,b){return a.rate-b.rate}).slice(0,3);
    var outs=groupBy('outcome').sort(function(a,b){return a.value-b.value}),levels=groupBy('level');
    var o={t:t,tc:tc,res:res,studs:studs,non:non,np:np,size:size,lasts:lasts,bc:bc,qids:qids,qlist:qlist,hard:hard,outs:outs,levels:levels,analysed:analysed};
    o.avg=np?r0(avg(lasts)):0;o.median=np?(np%2?sorted[(np-1)/2]:r0((sorted[np/2-1]+sorted[np/2])/2)):0;
    o.max=np?Math.max.apply(null,lasts):0;o.min=np?Math.min.apply(null,lasts):0;o.part=size?r0(np/size*100):0;
    o.mastery=np?r0(studs.filter(function(s){return s.last>=80}).length/np*100):0;
    o.improved=studs.filter(function(s){return s.attempts>1&&s.last>s.first}).length;
    return o;
  }

  function page(o){
    var t=o.t,typeName={training:'تدريب',test:'اختبار',remedial:'علاجي',enrichment:'إثرائي'}[t.type]||t.type||'—';
    var kpi=function(l,v,s){return '<div class="kpi"><b>'+v+'</b><span>'+l+'</span>'+(s?'<small>'+s+'</small>':'')+'</div>'};
    var notes=[];
    if(o.size)notes.push('شارك '+o.np+' من '+o.size+' طالبًا ('+o.part+'%).');
    if(o.np)notes.push('المتوسط '+o.avg+'%، ونسبة الإتقان (80% فأكثر) '+o.mastery+'%.');
    if(o.bc[4])notes.push(o.bc[4]+' طالبًا أقل من 60% ويحتاجون دعمًا.');
    if(o.outs.length>1)notes.push('أضعف ناتج تعلم: «'+o.outs[0].label+'» ('+o.outs[0].value+'%).');
    if(o.improved)notes.push(o.improved+' طالبًا تحسنت نتيجتهم بين أول وآخر محاولة.');
    var h='<header><div><h1>تقرير أداء الطلاب — '+E(t.title)+'</h1><p>منصة تدريب نافس • علوم الصف الثالث المتوسط • متوسطة أبي الدرداء</p></div>'+
      '<div class="meta"><span>الفصل '+E(o.tc)+'</span><span>'+E(typeName)+'</span><span>'+o.qids.length+' سؤالًا</span>'+(t.closeAt?'<span>حتى '+E(fd(t.closeAt))+'</span>':'')+'</div></header>';
    h+='<div class="kpis">'+kpi('المشاركون',o.np+' / '+(o.size||'—'),o.part+'% من الفصل')+kpi('متوسط النتيجة',o.np?o.avg+'%':'—','آخر محاولة')+kpi('الوسيط',o.np?o.median+'%':'—')+kpi('أعلى',o.np?o.max+'%':'—')+kpi('أدنى',o.np?o.min+'%':'—')+kpi('الإتقان',o.np?o.mastery+'%':'—','80% فأكثر')+kpi('المحاولات',o.res.length)+'</div>';
    if(!o.np)return h+'<section class="box"><h2>لا توجد مشاركات بعد</h2><p class="mut">لم يُسجَّل أي طالب نتيجة في هذا التكليف حتى الآن.</p></section>';
    h+='<div class="row"><section class="box"><h2>توزيع الطلاب حسب المستوى</h2>'+distChart(o.bc,o.np)+'</section>'+
      '<section class="box"><h2>ملاحظات من البيانات</h2>'+notes.map(function(n){return '<div class="nt">• '+E(n)+'</div>'}).join('')+
      (o.levels.length?'<h3>حسب المستوى المعرفي</h3>'+barList(o.levels):'')+'</section></div>';
    if(o.qlist.length){
      h+='<section class="box"><h2>نسبة الإجابة الصحيحة لكل سؤال <small>(من '+o.analysed+' محاولة)</small></h2><div class="qgrid">'+
        o.qlist.map(function(q){var b=BANDS[band(q.rate)];return '<div class="q" style="background:'+b.c+';color:'+b.t+'" title="'+E(q.text)+'"><span>س'+q.n+'</span><b>'+q.rate+'%</b></div>'}).join('')+'</div>'+
        '<div class="hard"><b>الأصعب:</b> '+o.hard.map(function(q){return '<span>س'+q.n+' ('+q.rate+'%)'+(q.outcome?' — '+E(q.outcome):'')+'</span>'}).join(' • ')+'</div></section>';
    }
    h+='<section class="box"><h2>نتائج الطلاب <small>(آخر محاولة • أفضل محاولة • عدد المحاولات)</small></h2><div class="sgrid'+(o.np>24?' c3':'')+'">'+
      o.studs.map(function(s,i){var b=BANDS[band(s.last)];return '<div class="s"><span class="sn">'+(i+1)+'. '+E(s.name)+'</span><span class="sp" style="background:'+b.c+';color:'+b.t+'">'+s.last+'%</span><span class="sx">'+s.best+'% • '+s.attempts+'</span></div>'}).join('')+'</div>'+
      '<div class="legend">'+BANDS.map(function(b){return '<span><i style="background:'+b.c+'"></i>'+b.n+'</span>'}).join('')+'</div></section>';
    if(o.non.length)h+='<section class="box"><h2>لم يشاركوا بعد ('+o.non.length+')</h2><p class="non">'+o.non.map(function(s){return E(s.name)}).join('، ')+'</p></section>';
    return h;
  }

  var libsP=null;
  function ensureLibs(){
    if(window.html2canvas&&window.jspdf)return Promise.resolve();
    if(libsP)return libsP;
    function load(u){return new Promise(function(ok,bad){var sc=document.createElement('script');sc.src=u;sc.onload=ok;sc.onerror=function(){libsP=null;bad(new Error('load'))};document.head.appendChild(sc)})}
    libsP=Promise.all([load('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),load('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')]);
    return libsP;
  }
  function summaryText(o){
    var s='📊 تقرير تكليف: '+o.t.title+'\nالفصل: '+o.tc+'\nالمشاركون: '+o.np+' من '+o.size+' ('+o.part+'%)';
    if(o.np)s+='\nالمتوسط: '+o.avg+'% • الإتقان: '+o.mastery+'%\nأعلى: '+o.max+'% • أدنى: '+o.min+'%';
    return s+'\n\nمنصة تدريب نافس • متوسطة أبي الدرداء';
  }

  function render(o){
    var name='تقرير-'+String(o.t.title||'تكليف').replace(/[\\\/:*?"<>|]+/g,'-').trim();
    var P='#nafsReport ';
    var css=P+'{position:fixed;inset:0;z-index:2147483000;overflow:auto;background:#e9edf3;direction:rtl;font-family:Tajawal,Tahoma,Arial,sans-serif;color:#0b0b0b;text-align:right}'+P+'*{box-sizing:border-box}'+
    P+'.nr-bar{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;padding:10px;background:#0d366b}'+
    P+'.nr-bar button{border:0;border-radius:10px;padding:9px 14px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;background:#fff;color:#0d366b;margin:0}'+P+'.nr-bar .nr-x{background:#c0392b;color:#fff}'+P+'.nr-msg{color:#fff;font-size:13px}'+
    P+'.nr-stage{padding:14px 0}'+P+'.page{position:relative;width:794px;height:1123px;margin:0 auto;background:#fff;padding:26px 28px;overflow:hidden;box-shadow:0 6px 30px rgba(0,0,0,.15);line-height:1.5;font-size:var(--fs,12.5px)}'+
    P+'header{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;background:linear-gradient(135deg,#0d366b,#1c5cab);color:#fff;border-radius:14px;padding:14px 18px;margin:0;position:static;box-shadow:none}'+
    P+'h1{margin:0;font-size:1.55em;color:#fff;line-height:1.35}'+P+'header p{margin:2px 0 0;opacity:.9;font-size:.9em;color:#fff}'+P+'.meta{display:flex;flex-wrap:wrap;gap:5px;justify-content:flex-end;max-width:45%}'+P+'.meta span{background:rgba(255,255,255,.16);border-radius:99px;padding:1px 9px;font-size:.85em;white-space:nowrap}'+
    P+'.kpis{display:grid;grid-template-columns:repeat(7,1fr);gap:7px;margin:10px 0}'+P+'.kpi{border:1px solid #e1e5ec;border-radius:12px;padding:7px 4px;text-align:center;display:flex;flex-direction:column;background:#fff}'+P+'.kpi b{font-size:1.6em;color:#0d366b;line-height:1.2}'+P+'.kpi span{font-size:.88em;color:#52514e}'+P+'.kpi small{font-size:.75em;color:#8a8882}'+
    P+'.row{display:grid;grid-template-columns:1.15fr 1fr;gap:10px}'+P+'.box{border:1px solid #e1e5ec;border-radius:12px;padding:9px 12px;margin:0 0 10px;background:#fff;box-shadow:none}'+
    P+'h2{margin:0 0 6px;font-size:1.08em;color:#1c5cab}'+P+'h2 small{color:#8a8882;font-weight:400;font-size:.8em}'+P+'h3{margin:8px 0 4px;font-size:.95em;color:#33322f}'+P+'ul{margin:0;padding:0 18px 0 0}'+P+'.nt{margin-bottom:3px}'+P+'.mut{color:#76746f}'+P+'svg{width:100%;height:auto;display:block}'+
    P+'.bl{display:flex;align-items:center;gap:6px;margin:3px 0;font-size:.9em}'+P+'.bll{width:62px}'+P+'.blt{flex:1;height:10px;background:#eef1f6;border-radius:5px;overflow:hidden;display:flex}'+P+'.blt i{display:block;height:100%;background:#2a78d6;border-radius:5px}'+P+'.bl b{width:36px;text-align:left;direction:ltr}'+
    P+'.qgrid{display:grid;grid-template-columns:repeat(10,1fr);gap:4px}'+P+'.q{border-radius:7px;padding:3px 0;text-align:center;line-height:1.25}'+P+'.q span{display:block;font-size:.78em;opacity:.9}'+P+'.q b{font-size:.95em;direction:ltr;display:block}'+P+'.hard{margin-top:6px;font-size:.9em;color:#33322f}'+
    P+'.sgrid{display:grid;grid-template-columns:1fr 1fr;column-gap:16px}'+P+'.sgrid.c3{grid-template-columns:1fr 1fr 1fr;column-gap:10px}'+P+'.s{display:flex;align-items:center;gap:5px;padding:2px 0;border-bottom:1px solid #f0f2f6;font-size:.88em}'+
    P+'.sn{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+P+'.sp{border-radius:99px;padding:0 7px;font-weight:700;direction:ltr;min-width:40px;text-align:center}'+P+'.sx{color:#76746f;font-size:.85em;direction:ltr;white-space:nowrap}'+
    P+'.legend{display:flex;gap:10px;flex-wrap:wrap;margin-top:5px;font-size:.8em;color:#52514e}'+P+'.legend i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-left:4px;vertical-align:-1px}'+P+'.non{margin:0;font-size:.85em;color:#33322f}'+
    P+'footer{position:absolute;bottom:12px;left:28px;right:28px;text-align:center;font-size:.75em;color:#8a8882;background:none;padding:0;margin:0}'+
    '@media print{body.nr-print>*:not(#nafsReport){display:none!important}body.nr-print #nafsReport{position:static;overflow:visible;background:#fff}body.nr-print #nafsReport .nr-bar{display:none}body.nr-print #nafsReport .nr-stage{padding:0}body.nr-print #nafsReport .page{box-shadow:none;margin:0;zoom:1!important;width:210mm;height:296mm;page-break-after:avoid;break-after:avoid}body.nr-print{margin:0!important;padding:0!important}body.nr-print #nafsReport *{-webkit-print-color-adjust:exact;print-color-adjust:exact}}';
    var st=document.getElementById('nafsReportCss');if(!st){st=document.createElement('style');st.id='nafsReportCss';document.head.appendChild(st)}st.textContent=css;
    if(!document.getElementById('nafsReportFont')){var lk=document.createElement('link');lk.id='nafsReportFont';lk.rel='stylesheet';lk.href='https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&display=swap';document.head.appendChild(lk)}
    var old=document.getElementById('nafsReport');if(old)old.remove();
    var ov=document.createElement('div');ov.id='nafsReport';
    ov.innerHTML='<div class="nr-bar"><button class="nr-x" data-a="x">✕ إغلاق</button><button data-a="share">📤 مشاركة</button><button data-a="pdf">⬇️ تنزيل PDF</button><button data-a="img">🖼️ حفظ صورة</button><button data-a="print">🖨️ طباعة</button><span class="nr-msg"></span></div>'+
      '<div class="nr-stage"><div class="page">'+page(o)+'<footer>أُنشئ في '+E(fd(new Date().toISOString()))+'</footer></div></div>';
    document.body.appendChild(ov);
    var pg=ov.querySelector('.page'),msg=ov.querySelector('.nr-msg'),prevOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    function fit(){var fs=12.5;pg.style.setProperty('--fs',fs+'px');var g=0;while(pg.scrollHeight>pg.clientHeight+1&&fs>8&&g++<40){fs-=0.25;pg.style.setProperty('--fs',fs+'px')}}
    function zoom(){var z=Math.min(1,(window.innerWidth-16)/794);pg.style.zoom=z<1?z:''}
    function say(t){msg.textContent=t||''}
    async function canvas(){say('جارٍ التجهيز...');var z=pg.style.zoom;pg.style.zoom='';try{await ensureLibs();return await window.html2canvas(pg,{scale:2,backgroundColor:'#ffffff',useCORS:true,scrollX:0,scrollY:0,windowWidth:1000})}finally{pg.style.zoom=z;say('')}}
    async function pdfBlob(){var c=await canvas();var D=new window.jspdf.jsPDF({orientation:'p',unit:'mm',format:'a4'});D.addImage(c.toDataURL('image/jpeg',0.92),'JPEG',0,0,210,297);return D.output('blob')}
    function dl(blob,fn){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fn;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},4000)}
    function close(){ov.remove();document.body.style.overflow=prevOverflow;window.removeEventListener('resize',zoom)}
    var act={
      x:close,
      print:function(){var ps=document.createElement('style');ps.textContent='@page{size:A4;margin:0}';document.head.appendChild(ps);document.body.classList.add('nr-print');
        var done=function(){document.body.classList.remove('nr-print');ps.remove();window.removeEventListener('afterprint',done)};window.addEventListener('afterprint',done);window.print();setTimeout(done,1500)},
      pdf:async function(){try{dl(await pdfBlob(),name+'.pdf')}catch(e){say('');alert('تعذر إنشاء PDF. استخدم «طباعة» ثم اختر «حفظ كـ PDF».')}},
      img:async function(){try{var c=await canvas();c.toBlob(function(b){dl(b,name+'.png')},'image/png')}catch(e){say('');alert('تعذر حفظ الصورة، تأكد من الاتصال بالإنترنت.')}},
      share:async function(){var text=summaryText(o);
        try{if(navigator.canShare){var f=new File([await pdfBlob()],name+'.pdf',{type:'application/pdf'});if(navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name,text:text});return}}}catch(e){if(e&&e.name==='AbortError')return}
        try{if(navigator.share){await navigator.share({title:name,text:text});return}}catch(e){if(e&&e.name==='AbortError')return}
        try{await navigator.clipboard.writeText(text);alert('تم نسخ ملخص التقرير. يمكنك لصقه في واتساب أو تلجرام.')}catch(e){prompt('انسخ الملخص:',text)}}
    };
    ov.querySelector('.nr-bar').addEventListener('click',function(e){var b=e.target.closest('button');if(b&&act[b.dataset.a])act[b.dataset.a]()});
    var go=function(){fit();zoom()};go();
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go);setTimeout(go,900);window.addEventListener('resize',zoom);
    ensureLibs().catch(function(){});
  }

  window.openTaskReport=function(id){
    var tmp=document.createElement('div');tmp.id='nafsReportLoading';tmp.style.cssText='position:fixed;inset:0;z-index:2147483001;background:rgba(13,54,107,.55);display:flex;align-items:center;justify-content:center;font:700 16px Tahoma;color:#fff';
    tmp.textContent='⏳ جارٍ إعداد التقرير وجلب أحدث النتائج...';document.body.appendChild(tmp);
    collect(id).then(render).catch(function(e){alert('تعذر إعداد التقرير: '+(e.message||e))}).then(function(){tmp.remove()});
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
