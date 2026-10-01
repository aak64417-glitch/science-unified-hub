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

    // تحديث الخادم في الخلفية
    window.loadDashboard=async function(silent=false){

      if(deleteBusy) return;

      try{
        await originalLoadDashboard(true);

        if(pendingDeleteIds.size){
          data.tasks=(data.tasks||[]).filter(
            t=>!pendingDeleteIds.has(String(t.taskId))
          );

          if(
            document.querySelector('.tab.active')?.id
            ==='tab-tasks'
          ){
            renderTasks();
          }
        }

        saveTeacherCache();

        if(!silent){
          msg('تم تحديث البيانات.');
        }

      }catch(e){
        if(!silent){
          msg(e.message,true);
        }
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
          loadDashboard(true);
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

      if(restored){

        // تظهر الصفحة فورًا مثل صفحة الطالب
        msg('تم فتح آخر البيانات، ويجري تحديثها في الخلفية.');

        setTimeout(()=>{
          loadDashboard(true);
        },10);

      }else{

        // يحدث مرة واحدة فقط أول استخدام
        msg('جاري تجهيز البيانات لأول مرة...');

        setTimeout(async()=>{
          await loadDashboard(true);
          saveTeacherCache();
        },10);
      }
    }

  });

})();
