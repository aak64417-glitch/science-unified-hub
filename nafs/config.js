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
