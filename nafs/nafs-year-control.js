/* =====================================================================
   منصة تدريب نافس — لوحة التحكم (إدارة العام الدراسي والفصول والطلاب)
   تعمل فوق صفحة المعلم teacher-final-visual-v6.html دون تغيير الخادم:
   تستخدم أوامر الخادم الموجودة فقط (addStudent / updateStudent /
   bulkAddStudents / deleteStudent / saveTask / setTaskStatus / dashboard).
   ===================================================================== */
(function(){
  'use strict';

  const SETTINGS_KEY='nafsYearControlV1';
  const DEFAULT_CLASSES=['1/3','2/3','3/3','4/3'];
  const READ_ACTIONS=new Set(['dashboard','dashboardLite']);
  const BACKUP_VALID_MS=24*60*60*1000;

  let RAW={students:[],results:[],sessions:[],tasks:[],questionOverrides:[],config:{}};
  let archiveMode=null;   // {year, createdAt, fileName}
  let busy=false;

  /* ---------- أدوات عامة ---------- */
  const $=id=>document.getElementById(id);
  const arr=v=>(typeof safeArray==='function')?safeArray(v):(Array.isArray(v)?v:[]);
  const h=s=>(typeof esc==='function')?esc(s):String(s??'');
  const enc=s=>encodeURIComponent(String(s??'')).replace(/'/g,'%27');
  const cmp=(a,b)=>String(a).localeCompare(String(b),'ar',{numeric:true});
  const toTime=v=>{if(!v)return NaN;const t=new Date(v).getTime();return t};
  const fmtDay=t=>{try{return new Intl.DateTimeFormat('ar-SA',{year:'numeric',month:'long',day:'numeric'}).format(new Date(t))}catch(e){return ''}};
  const todayInput=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
  const wait=ms=>new Promise(r=>setTimeout(r,ms));

  function S(){
    const base={classes:null,yearStart:'',viewMode:'current',backupAt:0,backupYear:'',log:[]};
    try{return Object.assign(base,JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}'))}catch(e){return base}
  }
  function saveS(patch){
    const s=Object.assign(S(),patch);
    try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(s))}catch(e){}
    return s;
  }
  function addLog(text){
    const log=arr(S().log);log.unshift({at:Date.now(),text});
    saveS({log:log.slice(0,30)});
  }
  function key(){return (typeof teacherKey==='function')?teacherKey():''}
  function needKey(){if(!key()){alert('أدخل مفتاح المعلم في أعلى الصفحة أولًا.');return true}return false}
  function needLive(){if(archiveMode){alert('أنت في وضع عرض الأرشيف (للقراءة فقط). اخرج منه أولًا.');return true}return false}
  function identity(){return (typeof getIdentity==='function')?getIdentity():{academicYear:''}}

  /* ---------- الفصول ---------- */
  function computeClasses(students){
    const s=S();
    const set=new Set(Array.isArray(s.classes)?s.classes:DEFAULT_CLASSES);
    (students||[]).forEach(st=>{const c=String(st.className||'').trim();if(c)set.add(c)});
    return [...set].filter(Boolean).sort(cmp);
  }
  function applyClasses(list){
    if(typeof CLASSES!=='undefined'&&Array.isArray(CLASSES))CLASSES.splice(0,CLASSES.length,...list);
    ['studentClassF','reportClass'].forEach(id=>{
      const el=$(id);if(!el)return;
      const v=el.value;
      el.innerHTML='<option value="">كل الفصول</option>'+list.map(c=>'<option value="'+h(c)+'">الفصل '+h(c)+'</option>').join('');
      if(list.includes(v))el.value=v;
    });
  }
  function classStudents(c){return RAW.students.filter(s=>String(s.className||'')===c)}
  function isLiveTask(t){return String(t.status||'').toUpperCase()!=='ARCHIVED'}
  function taskState(t){try{return taskStatus(t)}catch(e){return String(t.status||'')}}

  /* ---------- عرض العام الحالي فقط ---------- */
  function startTime(){
    const v=S().yearStart;if(!v)return 0;
    const t=new Date(v+'T00:00:00').getTime();return Number.isFinite(t)?t:0;
  }
  function sessionTime(x){
    for(const k of ['startedAt','startAt','createdAt','lastSeenAt','lastSeen','updatedAt','finishedAt','at','time','timestamp','date']){
      if(x&&x[k]){const t=toTime(x[k]);if(Number.isFinite(t))return t}
    }
    return NaN;
  }
  function viewData(raw){
    if(archiveMode||S().viewMode==='all')return {students:raw.students,results:raw.results,sessions:raw.sessions,tasks:raw.tasks};
    const codes=new Set(raw.students.map(s=>String(s.code||'')));
    const st=startTime();
    const keepDate=t=>!st||!Number.isFinite(t)||t>=st;
    const mine=c=>!c||codes.has(String(c));
    return {
      students:raw.students,
      results:raw.results.filter(r=>mine(r.studentCode)&&keepDate(toTime(r.submittedAt))),
      sessions:raw.sessions.filter(x=>mine(x.studentCode)&&keepDate(sessionTime(x))),
      tasks:raw.tasks.filter(t=>{
        if(!st)return true;
        const a=toTime(t.openAt);
        if(!Number.isFinite(a)||a>=st)return true;
        const s=taskState(t);return s==='OPEN'||s==='SCHEDULED';
      })
    };
  }

  /* ---------- ربط الصفحة الأصلية ---------- */
  const origApply=window.applyServerData;
  const origRefresh=window.refreshData;
  const origJsonp=window.jsonp;
  const origGoTo=window.goTo;
  const origClose=window.closeAppModal;

  function pushView(){
    if(typeof origApply!=='function')return;
    origApply(Object.assign({},RAW,viewData(RAW)));
  }
  window.applyServerData=function(r){
    r=r||{};
    RAW={students:arr(r.students),results:arr(r.results),sessions:arr(r.sessions),tasks:arr(r.tasks),
         questionOverrides:arr(r.questionOverrides),config:r.config||{}};
    applyClasses(computeClasses(RAW.students));
    origApply(Object.assign({},r,viewData(RAW)));
    if(isVisible())renderControl();
  };
  window.refreshData=function(silent){
    if(archiveMode){if(!silent)notice('وضع عرض الأرشيف مفعّل — اخرج منه لعرض بيانات الخادم الحالية.');return Promise.resolve()}
    return origRefresh.apply(this,arguments);
  };
  window.jsonp=function(p,t){
    if(archiveMode&&p&&!READ_ACTIONS.has(p.action))return Promise.reject(new Error('وضع عرض الأرشيف للقراءة فقط — اخرج منه أولًا'));
    return origJsonp(p,t);
  };
  window.goTo=function(id){
    origGoTo(id);
    if(id==='control'){
      renderControl();
      if(key()&&!RAW.students.length&&!archiveMode)window.refreshData(true).then(renderControl).catch(()=>{});
    }
  };
  window.closeAppModal=function(){
    if(busy){alert('العملية جارية، انتظر حتى تنتهي.');return}
    origClose();
  };
  function isVisible(){return $('control')?.classList.contains('active')}

  /* ---------- تنفيذ عمليات متتابعة مع شريط تقدم ---------- */
  async function runQueue(title,items,worker){
    const total=items.length;let done=0;const failed=[];
    openModal(title,`<div class="yc-progress">
      <div class="yc-bar"><i id="ycBar" style="width:0%"></i></div>
      <div id="ycProg" class="yc-prog">0 من ${total}</div>
      <div class="warning-box">لا تغلق الصفحة حتى تنتهي العملية.</div>
      <div id="ycDoneBox"></div></div>`);
    busy=true;
    try{
      for(const it of items){
        try{await worker(it)}
        catch(e){
          await wait(1500);
          try{await worker(it)}catch(e2){failed.push({it,msg:e2.message||String(e2)})}
        }
        done++;
        const b=$('ycBar'),p=$('ycProg');
        if(b)b.style.width=Math.round(done/total*100)+'%';
        if(p)p.textContent=done+' من '+total;
      }
    }finally{busy=false}
    return {done,failed,total};
  }
  function finishQueue(res,okText,describe){
    const box=$('ycDoneBox');if(!box)return;
    const ok=res.total-res.failed.length;
    box.innerHTML=`<div class="helper"><b>✓ ${h(okText)}:</b> ${ok} من ${res.total}</div>`+
      (res.failed.length?`<div class="warning-box"><b>لم تكتمل ${res.failed.length} عملية:</b><br>${res.failed.slice(0,15).map(f=>'• '+h(describe(f.it))+' — '+h(f.msg)).join('<br>')}<br>أعد تنفيذ الخطوة نفسها لإكمال الباقي.</div>`:'')+
      `<button class="primary" onclick="closeAppModal()">إغلاق</button>`;
  }

  function taskPayload(t,patch){
    return Object.assign({
      taskId:t.taskId,title:t.title||'تكليف',type:t.type||'training',className:t.className||'',
      targetMode:t.targetMode||'ALL',studentCodes:arr(t.studentCodes),questionIds:arr(t.questionIds),
      openAt:t.openAt||'',closeAt:t.closeAt||'',status:t.status||'ACTIVE',
      attemptPolicy:t.attemptPolicy||'',notes:t.notes||''
    },patch||{});
  }

  /* ---------- إدارة الفصول ---------- */
  window.ycAddClass=function(){
    const v=($('ycNewClass')?.value||'').trim();
    if(!v)return alert('اكتب اسم الفصل الجديد، مثل: 5/3');
    if(CLASSES.includes(v))return alert('الفصل '+v+' موجود مسبقًا.');
    saveS({classes:[...CLASSES,v]});
    applyClasses(computeClasses(RAW.students));renderControl();
    notice('تمت إضافة الفصل '+v+'. أضف طلابه من خطوة «الفصول والطلاب الجدد».');
  };
  window.ycDeleteClass=function(c){
    c=decodeURIComponent(c);
    if(classStudents(c).length)return alert('لا يمكن حذف فصل فيه طلاب. انقل طلابه أو احذفهم أولًا.');
    if(!confirm('حذف الفصل '+c+' من قائمة الفصول؟'))return;
    saveS({classes:CLASSES.filter(x=>x!==c)});
    applyClasses(computeClasses(RAW.students));renderControl();
  };
  window.ycRenameClass=function(c){
    c=decodeURIComponent(c);
    if(needLive())return;
    const n=classStudents(c).length;
    const tk=RAW.tasks.filter(t=>t.className===c&&isLiveTask(t)).length;
    openModal('إعادة تسمية الفصل '+c,`<div class="form-grid two">
        <label>الاسم الحالي<input value="${h(c)}" disabled></label>
        <label>الاسم الجديد<input id="ycNewName" placeholder="مثال: 1/3"></label>
      </div>
      <label class="yc-check"><input type="checkbox" id="ycMoveTasks" ${tk?'checked':''} ${tk?'':'disabled'}> نقل تكليفات هذا الفصل غير المؤرشفة إلى الاسم الجديد (${tk})</label>
      <div class="helper">سيُنقل ${n} طالبًا إلى الاسم الجديد، وتبقى أكوادهم وروابطهم ونتائجهم كما هي. إن كان الاسم الجديد لفصل موجود فسيُدمج الطلاب فيه.</div>
      <button class="primary" onclick="ycDoRename('${enc(c)}')">تنفيذ إعادة التسمية</button>`);
  };
  window.ycDoRename=async function(c){
    c=decodeURIComponent(c);
    if(needKey()||needLive())return;
    const nn=($('ycNewName')?.value||'').trim();
    if(!nn)return alert('اكتب الاسم الجديد للفصل.');
    if(nn===c)return alert('الاسم الجديد مطابق للحالي.');
    if(CLASSES.includes(nn)&&!confirm('الفصل '+nn+' موجود، سيتم دمج طلاب '+c+' فيه. متابعة؟'))return;
    const moveTasks=!!$('ycMoveTasks')?.checked;
    const sts=classStudents(c);
    const tks=moveTasks?RAW.tasks.filter(t=>t.className===c&&isLiveTask(t)):[];
    const items=[...sts.map(s=>({kind:'s',s})),...tks.map(t=>({kind:'t',t}))];
    let res={done:0,failed:[],total:0};
    if(items.length){
      res=await runQueue('إعادة تسمية الفصل '+c+' ← '+nn,items,async it=>{
        if(it.kind==='s')await origJsonp({action:'updateStudent',key:key(),code:it.s.code,name:it.s.name,className:nn},60000);
        else await origJsonp({action:'saveTask',key:key(),data:JSON.stringify(taskPayload(it.t,{className:nn}))},60000);
      });
    }else openModal('إعادة تسمية الفصل','<div id="ycDoneBox"></div>');
    const studentFails=res.failed.filter(f=>f.it.kind==='s').length;
    const list=CLASSES.filter(x=>studentFails?true:x!==c);
    if(!list.includes(nn))list.push(nn);
    saveS({classes:list});
    addLog('إعادة تسمية الفصل '+c+' إلى '+nn+' ('+sts.length+' طالب)');
    await window.refreshData(true);
    if(!items.length)res.total=0;
    finishQueue(res,'تم نقل',it=>it.kind==='s'?it.s.name:('تكليف: '+(it.t.title||'')));
    renderControl();
  };

  /* ---------- النسخة الاحتياطية ---------- */
  function download(name,text,type){
    const blob=new Blob([text],{type});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;
    document.body.appendChild(a);a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);
  }
  function csvCell(v){v=String(v??'');return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}
  function studentsCsv(src){
    const res=arr(src.results),ses=arr(src.sessions);
    const rows=[['الفصل','اسم الطالب','الكود','رابط الدخول','عدد المحاولات','متوسط النسبة','آخر نشاط']];
    arr(src.students).slice().sort((a,b)=>cmp(a.className,b.className)||cmp(a.name,b.name)).forEach(st=>{
      const code=String(st.code||'');
      const rr=res.filter(r=>String(r.studentCode||'')===code);
      const vals=rr.map(r=>Number(r.percent)).filter(Number.isFinite);
      const times=rr.map(r=>toTime(r.submittedAt)).concat(ses.filter(x=>String(x.studentCode||'')===code).map(sessionTime)).filter(Number.isFinite);
      rows.push([st.className||'',st.name||'',code,(typeof studentPersonalUrl==='function')?studentPersonalUrl(code):'',
        rr.length,vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length)+'%':'',times.length?fmtDay(Math.max(...times)):'']);
    });
    return '﻿'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
  }
  window.ycBackup=async function(){
    if(needKey()||needLive())return;
    notice('جاري تجهيز النسخة الاحتياطية الكاملة من الخادم... قد يستغرق ذلك دقيقة.');
    let full=null;
    try{full=await origJsonp({action:'dashboard',key:key()},90000)}catch(e){}
    if(!full||!Array.isArray(full.students)){try{full=await origJsonp({action:'dashboardLite',key:key()},60000)}catch(e){}}
    const fromServer=!!(full&&Array.isArray(full.students));
    const src=fromServer?full:RAW;
    const id=identity(),day=todayInput();
    const backup={
      type:'nafs-backup',version:1,createdAt:new Date().toISOString(),
      academicYear:id.academicYear||'',yearStart:S().yearStart||'',identity:id,classes:CLASSES.slice(),
      students:arr(src.students),results:arr(src.results),sessions:arr(src.sessions),
      tasks:arr(src.tasks),questionOverrides:arr(src.questionOverrides),config:src.config||{}
    };
    const yr=String(id.academicYear||'').replace(/[\u0660-\u0669]/g,d=>String(d.charCodeAt(0)-0x660)).replace(/\D+/g,'')||'year';
    download('nafs-backup-'+yr+'-'+day+'.json',JSON.stringify(backup),'application/json');
    setTimeout(()=>download('nafs-students-'+yr+'-'+day+'.csv',studentsCsv(src),'text/csv;charset=utf-8'),700);
    saveS({backupAt:Date.now(),backupYear:id.academicYear||''});
    addLog('نسخة احتياطية: '+backup.students.length+' طالب، '+backup.results.length+' نتيجة');
    notice(fromServer?'تم تنزيل النسخة الاحتياطية الكاملة وكشف الطلاب. احفظ الملفين في مكان آمن.':'تعذر جلب النسخة الكاملة من الخادم؛ نُزّلت آخر بيانات محمّلة في الصفحة.',!fromServer);
    renderControl();
  };
  function backupFresh(){return Date.now()-Number(S().backupAt||0)<BACKUP_VALID_MS}

  /* ---------- إنهاء العام السابق ---------- */
  window.ycToggleClassBoxes=function(c,on){
    c=decodeURIComponent(c);
    document.querySelectorAll('.yc-del-st').forEach(cb=>{if(cb.dataset.cls===c)cb.checked=on});
    ycCountSelected();
  };
  window.ycCountSelected=function(){
    const n=document.querySelectorAll('.yc-del-st:checked').length;
    const el=$('ycDelCount');if(el)el.textContent=n;
  };
  window.ycEndYear=async function(){
    if(needKey()||needLive())return;
    if(!backupFresh())return alert('احفظ نسخة احتياطية أولًا (الخطوة ١). يجب أن تكون النسخة خلال آخر ٢٤ ساعة.');
    const codes=[...document.querySelectorAll('.yc-del-st:checked')].map(cb=>cb.value);
    const archiveTasks=!!$('ycArchiveTasks')?.checked;
    const tks=archiveTasks?RAW.tasks.filter(isLiveTask):[];
    if(!codes.length&&!tks.length)return alert('لم تحدد طلابًا للحذف ولا تكليفات للأرشفة.');
    if(!confirm('سيتم:\n• حذف '+codes.length+' طالب من قائمة الطلاب (تبقى نتائجهم محفوظة في الخادم وفي النسخة الاحتياطية)\n• أرشفة '+tks.length+' تكليف\n\nمتابعة؟'))return;
    const byCode=new Map(RAW.students.map(s=>[String(s.code),s]));
    const items=[...codes.map(c=>({kind:'s',s:byCode.get(String(c))||{code:c,name:c}})),...tks.map(t=>({kind:'t',t}))];
    const res=await runQueue('إنهاء العام الدراسي السابق',items,async it=>{
      if(it.kind==='s')await origJsonp({action:'deleteStudent',key:key(),code:it.s.code},60000);
      else await origJsonp({action:'setTaskStatus',key:key(),taskId:it.t.taskId,status:'ARCHIVED'},60000);
    });
    addLog('إنهاء العام: حذف '+codes.length+' طالب وأرشفة '+tks.length+' تكليف');
    await window.refreshData(true);
    finishQueue(res,'تم التنفيذ',it=>it.kind==='s'?it.s.name:('تكليف: '+(it.t.title||'')));
    renderControl();
  };

  /* ---------- بيانات العام الجديد ---------- */
  window.ycSaveYear=function(){
    const y=($('ycYearName')?.value||'').trim();
    const d=($('ycYearStart')?.value||'').trim();
    if(!y)return alert('اكتب اسم العام الدراسي الجديد، مثل: 1449 هـ');
    try{
      const cur=JSON.parse(localStorage.getItem('nafsIdentitySettings')||'{}');
      cur.academicYear=y;localStorage.setItem('nafsIdentitySettings',JSON.stringify(cur));
    }catch(e){}
    saveS({yearStart:d});
    if(typeof loadIdentityIntoForm==='function')loadIdentityIntoForm();
    addLog('اعتماد العام الدراسي '+y+(d?' — بداية '+d:''));
    pushView();renderControl();
    notice('تم اعتماد العام الدراسي '+y+(d?'، وتُعرض الآن نتائج هذا العام فقط.':'.'));
  };
  window.ycSetView=function(mode){saveS({viewMode:mode});pushView();renderControl()};

  /* ---------- الفصول والطلاب الجدد ---------- */
  window.ycSaveClassList=function(){
    const list=[...new Set(($('ycClassList')?.value||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean))];
    if(!list.length)return alert('اكتب فصلًا واحدًا على الأقل، كل فصل في سطر.');
    const withStudents=[...new Set(RAW.students.map(s=>String(s.className||'')).filter(c=>c&&!list.includes(c)))];
    saveS({classes:list});
    applyClasses(computeClasses(RAW.students));renderControl();
    notice('تم حفظ قائمة الفصول.'+(withStudents.length?' ما زال فيها طلاب فتبقى ظاهرة: '+withStudents.join('، '):''),!!withStudents.length);
  };
  function parseNames(){
    const def=$('ycAddClass')?.value||'';
    const out=new Map(),unknown=new Set();let count=0;
    ($('ycAddNames')?.value||'').split(/\r?\n/).forEach(line=>{
      if(!line.trim())return;
      let name=line,cls=def;
      if(line.includes('\t')){const p=line.split('\t').map(x=>x.trim());name=p[0];cls=p[1]||def}
      name=name.replace(/^\s*\d+\s*[-.)]\s*/,'').replace(/\s+/g,' ').trim();
      if(!name)return;
      if(!CLASSES.includes(cls)){unknown.add(cls||'(بدون فصل)');return}
      if(!out.has(cls))out.set(cls,[]);
      out.get(cls).push(name);count++;
    });
    return {groups:out,unknown:[...unknown],count};
  }
  window.ycPreviewNames=function(){
    const box=$('ycAddPreview');if(!box)return;
    const p=parseNames();
    if(!p.count&&!p.unknown.length){box.innerHTML='';return}
    box.innerHTML='<b>جاهز للإضافة:</b> '+([...p.groups].map(([c,n])=>'الفصل '+h(c)+': '+n.length).join(' • ')||'لا شيء')+
      (p.unknown.length?'<br><span class="yc-bad">فصول غير موجودة (أضفها أولًا): '+h(p.unknown.join('، '))+'</span>':'');
  };
  window.ycAddStudents=async function(){
    if(needKey()||needLive())return;
    const p=parseNames();
    if(p.unknown.length)return alert('توجد فصول غير موجودة في القائمة: '+p.unknown.join('، ')+'\nأضفها من قائمة الفصول أولًا.');
    if(!p.count)return alert('الصق أسماء الطلاب أولًا، اسم في كل سطر.');
    const chunks=[];
    p.groups.forEach((names,cls)=>{for(let i=0;i<names.length;i+=5)chunks.push({cls,names:names.slice(i,i+5)})});
    let added=0,skipped=0;
    const res=await runQueue('إضافة '+p.count+' طالبًا',chunks,async c=>{
      const r=await origJsonp({action:'bulkAddStudents',key:key(),data:JSON.stringify({className:c.cls,names:c.names})},60000);
      added+=Number(r.added||0);skipped+=Number(r.skipped||0);
    });
    addLog('إضافة طلاب جدد: '+added+' (تجاوز '+skipped+' مكرر)');
    if($('ycAddNames'))$('ycAddNames').value='';
    await window.refreshData(true);
    finishQueue(res,'تمت إضافة '+added+' طالب وتجاوز '+skipped+' اسم مكرر — دفعات مكتملة',c=>'الفصل '+c.cls+': '+c.names.join('، '));
    renderControl();
  };

  /* ---------- بطاقات الدخول (باركود) ---------- */
  window.ycPrintCards=function(c){
    c=decodeURIComponent(c||'');
    const list=RAW.students.filter(s=>!c||s.className===c).slice().sort((a,b)=>cmp(a.className,b.className)||cmp(a.name,b.name));
    if(!list.length)return alert('لا يوجد طلاب في هذا الاختيار.');
    if(typeof QRCode==='undefined')return alert('تعذر تحميل مكتبة الباركود. تحقق من الاتصال ثم أعد المحاولة.');
    const w=window.open('','_blank');
    if(!w)return alert('اسمح بالنوافذ المنبثقة لهذه الصفحة لطباعة البطاقات.');
    const holder=document.createElement('div');holder.style.cssText='position:fixed;left:-9999px;top:0';
    document.body.appendChild(holder);
    const cards=list.map(st=>{
      const d=document.createElement('div');holder.appendChild(d);
      let src='';
      try{
        new QRCode(d,{text:studentPersonalUrl(st.code),width:200,height:200,colorDark:'#10234f',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
        const cv=d.querySelector('canvas');src=cv?cv.toDataURL('image/png'):(d.querySelector('img')?.src||'');
      }catch(e){}
      return {st,src};
    });
    holder.remove();
    const id=identity();
    w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>بطاقات الدخول — ${h(c?'الفصل '+c:'جميع الفصول')}</title>
      <style>
        @page{size:A4;margin:10mm}
        body{margin:0;font-family:Tahoma,Arial,sans-serif;color:#10234f}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
        .card{border:1.5px dashed #8aa3c2;padding:10px 8px;text-align:center;break-inside:avoid;page-break-inside:avoid;height:66mm;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
        .pf{font-size:12px;font-weight:800;color:#1168d7}
        .nm{font-size:17px;font-weight:900;line-height:1.35}
        .cl{font-size:14px;font-weight:800;background:#eaf4ff;border-radius:8px;padding:2px 10px}
        img{width:34mm;height:34mm}
        .cd{font-size:13px;font-weight:800}
        .hint{font-size:11px;font-weight:700;color:#4a5a75}
        .bar{display:flex;justify-content:space-between;font-weight:800;font-size:13px;margin-bottom:6px}
        @media screen{body{padding:16px;background:#f2f6fb}.grid{background:#fff}}
      </style></head><body>
      <div class="bar"><span>${h(id.platformName||'منصة تدريب نافس')} — ${h(id.school||'')}</span><span>${h(c?'الفصل '+c:'جميع الفصول')} • ${list.length} طالب • ${h(id.academicYear||'')}</span></div>
      <div class="grid">${cards.map(x=>`<div class="card">
        <div class="pf">${h(id.platformName||'منصة تدريب نافس')}</div>
        <div class="nm">${h(x.st.name||'')}</div>
        <div class="cl">الفصل ${h(x.st.className||'')}</div>
        ${x.src?`<img src="${x.src}" alt="">`:''}
        <div class="cd">الكود: <bdi dir="ltr">${h(x.st.code||'')}</bdi></div>
        <div class="hint">امسح الرمز بكاميرا الجوال للدخول إلى التدريب</div>
      </div>`).join('')}</div>
      <script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script></body></html>`);
    w.document.close();
  };

  /* ---------- فحص جودة البيانات ---------- */
  function normName(s){
    return String(s||'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[ً-ْـ]/g,'').replace(/\s+/g,' ').trim();
  }
  window.ycCheckData=function(){
    const box=$('ycCheckBox');if(!box)return;
    const v=viewData(RAW);
    const entered=new Set(v.sessions.map(x=>String(x.studentCode||'')));
    const trained=new Set(v.results.map(x=>String(x.studentCode||'')));
    const groups=new Map();
    RAW.students.forEach(s=>{const k=normName(s.name);if(!k)return;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(s)});
    const dups=[...groups.values()].filter(g=>g.length>1);
    const noClass=RAW.students.filter(s=>!String(s.className||'').trim());
    const emptyClasses=CLASSES.filter(c=>!classStudents(c).length);
    const neverIn=CLASSES.map(c=>({c,list:classStudents(c).filter(s=>!entered.has(String(s.code)))})).filter(x=>x.list.length);
    const noTrain=RAW.students.filter(s=>!trained.has(String(s.code))).length;
    const stBtn=s=>`<button class="btn-mini btn-edit" onclick="openStudentEditor('${h(s.code)}')">تعديل</button>`;
    let html='';
    html+=dups.length?`<div class="yc-issue bad"><b>⚠️ أسماء مكررة (${dups.length})</b>${dups.map(g=>`<div>${g.map(s=>h(s.name)+' — الفصل '+h(s.className||'؟')+' '+stBtn(s)).join('<br>')}</div>`).join('')}</div>`
                     :`<div class="yc-issue ok">✓ لا توجد أسماء مكررة.</div>`;
    html+=noClass.length?`<div class="yc-issue bad"><b>⚠️ طلاب بلا فصل (${noClass.length})</b><div>${noClass.map(s=>h(s.name)+' '+stBtn(s)).join('<br>')}</div></div>`
                        :`<div class="yc-issue ok">✓ كل الطلاب مرتبطون بفصل.</div>`;
    if(emptyClasses.length)html+=`<div class="yc-issue warn"><b>فصول بلا طلاب:</b> ${emptyClasses.map(h).join('، ')}</div>`;
    html+=neverIn.length?`<div class="yc-issue warn"><b>لم يدخلوا المنصة في هذا العام:</b>${neverIn.map(x=>`<div><b>الفصل ${h(x.c)} (${x.list.length}):</b> ${x.list.map(s=>h(s.name)).join('، ')}</div>`).join('')}</div>`
                        :(RAW.students.length?`<div class="yc-issue ok">✓ جميع الطلاب دخلوا المنصة.</div>`:'');
    html+=`<div class="yc-issue info">طلاب بلا أي محاولة تدريب في هذا العام: <b>${noTrain}</b> من ${RAW.students.length}</div>`;
    box.innerHTML=html;
  };

  /* ---------- أرشيف الأعوام السابقة ---------- */
  window.ycOpenArchive=function(input){
    const f=input?.files?.[0];if(!f)return;
    const rd=new FileReader();
    rd.onload=()=>{
      let d=null;try{d=JSON.parse(rd.result)}catch(e){}
      input.value='';
      if(!d||!Array.isArray(d.students))return alert('الملف ليس نسخة احتياطية صالحة من منصة نافس.');
      archiveMode={year:d.academicYear||'عام سابق',createdAt:d.createdAt||'',fileName:f.name};
      RAW={students:arr(d.students),results:arr(d.results),sessions:arr(d.sessions),tasks:arr(d.tasks),
           questionOverrides:arr(d.questionOverrides),config:d.config||{}};
      applyClasses(computeClasses(RAW.students));
      pushView();showArchiveBanner();renderControl();
      notice('تم فتح أرشيف '+archiveMode.year+' للعرض فقط. التقارير وملف الإنجاز تعرض الآن بيانات ذلك العام.');
    };
    rd.readAsText(f);
  };
  window.ycExitArchive=function(){
    archiveMode=null;
    $('ycArchiveBanner')?.remove();
    const restored=(typeof restoreServerCache==='function')?restoreServerCache():0;
    if(!restored){RAW={students:[],results:[],sessions:[],tasks:[],questionOverrides:[],config:{}};applyClasses(computeClasses([]));pushView()}
    window.refreshData(true).catch(()=>{});
    renderControl();
    notice('تم الخروج من الأرشيف والعودة إلى بيانات العام الحالي.');
  };
  function showArchiveBanner(){
    $('ycArchiveBanner')?.remove();
    const b=document.createElement('div');b.id='ycArchiveBanner';b.className='yc-archive-banner';
    b.innerHTML=`<span>📦 وضع عرض الأرشيف: <b>${h(archiveMode.year)}</b>${archiveMode.createdAt?' — نسخة '+h(fmtDay(archiveMode.createdAt)):''} • للعرض والطباعة فقط</span><button class="primary" onclick="ycExitArchive()">الخروج من الأرشيف</button>`;
    const anchor=document.querySelector('.loginbar');
    if(anchor)anchor.insertAdjacentElement('afterend',b);else document.querySelector('.app')?.prepend(b);
  }

  /* ---------- رسم اللوحة ---------- */
  function renderControl(){
    const root=$('yearControlRoot');if(!root)return;
    // حفظ ما كتبه المعلم قبل إعادة الرسم (مثل الأسماء الملصقة)
    const keep={};
    ['ycAddNames','ycNewClass','ycYearName','ycYearStart'].forEach(k=>{const el=$(k);if(el&&el.value)keep[k]=el.value});
    const keepClass=$('ycAddClass')?.value||'';
    const openBoxes=new Set([...root.querySelectorAll('details.yc-class-box[open]')].map(d=>d.dataset.cls));
    const unchecked=new Set([...root.querySelectorAll('.yc-del-st:not(:checked)')].map(cb=>cb.value));
    const s=S(),id=identity(),v=viewData(RAW);
    const hiddenRes=RAW.results.length-v.results.length;
    const liveTasks=RAW.tasks.filter(isLiveTask);
    const fresh=backupFresh();
    const lastBackup=s.backupAt?fmtDay(s.backupAt):'لم تُحفظ بعد';
    const loaded=RAW.students.length||RAW.results.length||RAW.tasks.length;

    const classRows=CLASSES.map(c=>{
      const n=classStudents(c).length;
      const t=RAW.tasks.filter(x=>x.className===c&&isLiveTask(x)).length;
      return `<tr><td><b>الفصل ${h(c)}</b></td><td>${n}</td><td>${t}</td><td class="yc-actions">
        <button class="btn-mini btn-edit" onclick="ycRenameClass('${enc(c)}')">إعادة تسمية</button>
        <button class="btn-mini btn-view" onclick="ycPrintCards('${enc(c)}')" ${n?'':'disabled'}>بطاقات الدخول</button>
        <button class="btn-mini btn-hide" onclick="ycDeleteClass('${enc(c)}')" ${n?'disabled title="فيه طلاب"':''}>حذف</button>
      </td></tr>`;
    }).join('');

    const endYearLists=CLASSES.filter(c=>classStudents(c).length).map(c=>{
      const sts=classStudents(c).slice().sort((a,b)=>cmp(a.name,b.name));
      return `<details class="yc-class-box" data-cls="${h(c)}"><summary><b>الفصل ${h(c)}</b> — ${sts.length} طالب
          <span class="yc-sum-btns"><button class="btn-mini btn-hide" onclick="event.preventDefault();ycToggleClassBoxes('${enc(c)}',true)">تحديد الكل</button>
          <button class="btn-mini btn-view" onclick="event.preventDefault();ycToggleClassBoxes('${enc(c)}',false)">إلغاء التحديد</button></span></summary>
        <div class="yc-st-grid">${sts.map(st=>`<label><input type="checkbox" class="yc-del-st" data-cls="${h(c)}" value="${h(st.code)}" checked onchange="ycCountSelected()"> ${h(st.name)}</label>`).join('')}</div>
      </details>`;
    }).join('');

    const step=(n,title,done,body)=>`<div class="yc-step ${done?'done':''}"><div class="yc-step-head"><span class="yc-num">${done?'✓':n}</span><h4>${title}</h4></div><div class="yc-step-body">${body}</div></div>`;

    root.innerHTML=`
    <div class="section-head">
      <div><h2>لوحة التحكم</h2><small>إدارة العام الدراسي • الفصول • الطلاب • الأرشيف</small></div>
      <button class="primary" onclick="refreshData().then(()=>goTo('control'))" ${archiveMode?'disabled':''}>تحديث البيانات</button>
    </div>
    ${archiveMode?`<div class="warning-box">📦 تعرض الآن أرشيف <b>${h(archiveMode.year)}</b> من الملف «${h(archiveMode.fileName)}» — للعرض فقط. <button class="btn-mini btn-edit" onclick="ycExitArchive()">الخروج من الأرشيف</button></div>`:''}
    ${!loaded&&!archiveMode?`<div class="warning-box">أدخل مفتاح المعلم في أعلى الصفحة ثم اضغط «تحديث البيانات» لعرض الفصول والطلاب.</div>`:''}

    <div class="yc-stats">
      <div class="yc-stat"><strong>${h(archiveMode?archiveMode.year:(id.academicYear||'—'))}</strong><span>العام الدراسي</span></div>
      <div class="yc-stat"><strong>${s.yearStart&&!archiveMode?h(fmtDay(s.yearStart+'T00:00:00')):'—'}</strong><span>بداية العام</span></div>
      <div class="yc-stat"><strong>${CLASSES.length}</strong><span>الفصول</span></div>
      <div class="yc-stat"><strong>${RAW.students.length}</strong><span>الطلاب</span></div>
      <div class="yc-stat"><strong>${v.results.length}</strong><span>محاولات هذا العام</span></div>
      <div class="yc-stat"><strong>${hiddenRes}</strong><span>محاولات مؤرشفة مخفية</span></div>
    </div>

    <div class="yc-card yc-view">
      <b>عرض البيانات في الإحصاءات والتقارير:</b>
      <label><input type="radio" name="ycView" ${s.viewMode!=='all'?'checked':''} onchange="ycSetView('current')" ${archiveMode?'disabled':''}> العام الحالي فقط</label>
      <label><input type="radio" name="ycView" ${s.viewMode==='all'?'checked':''} onchange="ycSetView('all')" ${archiveMode?'disabled':''}> كل الأعوام</label>
      <small>«العام الحالي فقط» يعرض نتائج الطلاب الموجودين حاليًا${s.yearStart?' منذ بداية العام':''}، وتبقى النتائج القديمة محفوظة في الخادم.</small>
    </div>

    <div class="yc-card">
      <h3>🏫 الفصول</h3>
      <div class="bank-table-wrap"><table>
        <thead><tr><th>الفصل</th><th>الطلاب</th><th>تكليفات غير مؤرشفة</th><th>الإجراءات</th></tr></thead>
        <tbody>${classRows||'<tr><td colspan="4" style="text-align:center">لا توجد فصول.</td></tr>'}</tbody>
      </table></div>
      <div class="yc-inline">
        <input id="ycNewClass" placeholder="اسم فصل جديد، مثل: 5/3">
        <button class="primary" onclick="ycAddClass()">+ إضافة فصل</button>
        <button class="btn-mini btn-view" onclick="ycPrintCards('')" ${RAW.students.length?'':'disabled'}>طباعة بطاقات كل الفصول</button>
      </div>
    </div>

    <div class="yc-card">
      <h3>🗓️ معالج بدء عام دراسي جديد</h3>
      <div class="helper">نفّذ الخطوات بالترتيب في بداية كل عام. الأكواد الجديدة تُنشأ تلقائيًا للطلاب الجدد، ونتائج الأعوام السابقة لا تُحذف من الخادم.</div>

      ${step(1,'حفظ نسخة احتياطية من العام الحالي',fresh,`
        <p>ينزّل ملفين: نسخة كاملة (JSON) لفتحها لاحقًا من «أرشيف الأعوام»، وكشف الطلاب ونتائجهم (يفتح في Excel).</p>
        <div class="yc-inline"><button class="primary" onclick="ycBackup()" ${archiveMode?'disabled':''}>تنزيل النسخة الاحتياطية</button>
        <span class="yc-note">آخر نسخة: <b>${h(lastBackup)}</b>${s.backupYear?' ('+h(s.backupYear)+')':''}</span></div>`)}

      ${step(2,'إنهاء العام السابق',false,`
        <p>اختر الطلاب الذين سيُحذفون من القائمة (المتخرجون والمنقولون). <b>أزل التحديد</b> عن الطالب الباقي (مثل الراسب) ثم انقله لفصله الجديد من «إدارة الطلاب».</p>
        ${endYearLists||'<div class="warning-box">لا يوجد طلاب حاليًا.</div>'}
        <label class="yc-check"><input type="checkbox" id="ycArchiveTasks" ${liveTasks.length?'checked':''} ${liveTasks.length?'':'disabled'}> أرشفة جميع التكليفات غير المؤرشفة (${liveTasks.length})</label>
        <div class="yc-inline"><button class="primary yc-danger" onclick="ycEndYear()" ${archiveMode?'disabled':''}>تنفيذ: حذف <span id="ycDelCount">${RAW.students.length}</span> طالب وأرشفة التكليفات</button>
        ${fresh?'':'<span class="yc-bad">يتطلب نسخة احتياطية خلال آخر ٢٤ ساعة (الخطوة ١).</span>'}</div>`)}

      ${step(3,'بيانات العام الجديد',!!s.yearStart&&!archiveMode,`
        <div class="form-grid two">
          <label>اسم العام الدراسي<input id="ycYearName" value="${h(id.academicYear||'')}" placeholder="مثال: 1449 هـ"></label>
          <label>تاريخ بداية العام<input id="ycYearStart" type="date" value="${h(s.yearStart||todayInput())}"></label>
        </div>
        <p class="yc-note">النتائج قبل هذا التاريخ تُخفى من الإحصاءات والتقارير وملف الإنجاز، ويمكن إظهارها بخيار «كل الأعوام».</p>
        <button class="primary" onclick="ycSaveYear()">اعتماد العام الجديد</button>`)}

      ${step(4,'الفصول والطلاب الجدد',false,`
        <div class="yc-two">
          <div>
            <label class="yc-lbl">فصول العام الجديد — فصل في كل سطر
              <textarea id="ycClassList" rows="6">${h(CLASSES.join('\n'))}</textarea></label>
            <button class="btn-mini btn-edit" onclick="ycSaveClassList()">حفظ قائمة الفصول</button>
          </div>
          <div>
            <label class="yc-lbl">الفصل
              <select id="ycAddClass" onchange="ycPreviewNames()">${CLASSES.map(c=>`<option value="${h(c)}">الفصل ${h(c)}</option>`).join('')}</select></label>
            <label class="yc-lbl">أسماء الطلاب — اسم في كل سطر
              <textarea id="ycAddNames" rows="7" oninput="ycPreviewNames()" placeholder="الصق الأسماء هنا&#10;أو انسخ عمودين من Excel: الاسم ثم الفصل"></textarea></label>
            <div id="ycAddPreview" class="yc-note"></div>
            <button class="primary" onclick="ycAddStudents()" ${archiveMode?'disabled':''}>إضافة الطلاب وإنشاء أكوادهم</button>
          </div>
        </div>`)}

      ${step(5,'طباعة بطاقات الدخول',false,`
        <p>بطاقة لكل طالب فيها اسمه وفصله وكوده وباركود الدخول المباشر — ١٢ بطاقة في كل صفحة A4.</p>
        <div class="yc-inline">${CLASSES.filter(c=>classStudents(c).length).map(c=>`<button class="btn-mini btn-view" onclick="ycPrintCards('${enc(c)}')">الفصل ${h(c)}</button>`).join('')||'<span class="yc-note">أضف الطلاب أولًا.</span>'}</div>`)}
    </div>

    <div class="yc-grid2">
      <div class="yc-card">
        <h3>🔍 فحص جودة البيانات</h3>
        <p class="yc-note">يكشف الأسماء المكررة، والطلاب بلا فصل، ومن لم يدخل المنصة هذا العام.</p>
        <button class="primary" onclick="ycCheckData()">تشغيل الفحص</button>
        <div id="ycCheckBox"></div>
      </div>
      <div class="yc-card">
        <h3>🗄️ أرشيف الأعوام السابقة</h3>
        <p class="yc-note">افتح ملف نسخة احتياطية لعام سابق لعرض تقاريره وملف إنجازه وطباعتها دون تغيير بيانات العام الحالي.</p>
        <label class="primary yc-file">فتح ملف نسخة احتياطية<input type="file" accept=".json,application/json" onchange="ycOpenArchive(this)"></label>
        ${arr(s.log).length?`<h4 class="yc-log-h">سجل العمليات على هذا الجهاز</h4><ul class="yc-log">${arr(s.log).slice(0,8).map(l=>`<li><span>${h(fmtDay(l.at))}</span> ${h(l.text)}</li>`).join('')}</ul>`:''}
      </div>
    </div>`;

    Object.entries(keep).forEach(([k,val])=>{const el=$(k);if(el)el.value=val});
    if(keepClass&&$('ycAddClass')&&CLASSES.includes(keepClass))$('ycAddClass').value=keepClass;
    root.querySelectorAll('details.yc-class-box').forEach(d=>{if(openBoxes.has(d.dataset.cls))d.open=true});
    root.querySelectorAll('.yc-del-st').forEach(cb=>{if(unchecked.has(cb.value))cb.checked=false});
    window.ycCountSelected();
    if(keep.ycAddNames)window.ycPreviewNames();
  }
  window.renderYearControl=renderControl;

  /* ---------- التنسيق ---------- */
  const css=document.createElement('style');
  css.textContent=`
  #control{font-weight:600}
  .yc-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin:6px 0 14px}
  .yc-stat{background:#fff;border:1px solid var(--line);border-radius:18px;padding:14px;text-align:center;box-shadow:0 7px 20px rgba(20,66,125,.06)}
  .yc-stat strong{display:block;font-size:22px;color:var(--navy);font-weight:900;line-height:1.3}
  .yc-stat span{color:#4d5b75;font-weight:800;font-size:13px}
  .yc-card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:16px 18px;margin-bottom:14px;box-shadow:0 7px 20px rgba(20,66,125,.05)}
  .yc-card h3{margin:0 0 10px;font-size:20px;color:var(--navy)}
  .yc-view{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px}
  .yc-view label{font-weight:800;cursor:pointer}
  .yc-view small{flex-basis:100%;color:#4d5b75;font-weight:700}
  .yc-actions{white-space:nowrap}
  .yc-actions .btn-mini[disabled],.yc-inline .btn-mini[disabled]{opacity:.45;cursor:not-allowed}
  .yc-inline{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px}
  .yc-inline input{border:1px solid #cfe0f1;border-radius:12px;padding:10px;min-width:220px;font-weight:700}
  .yc-step{border:1px solid #d9e6f3;border-radius:16px;margin-top:12px;overflow:hidden}
  .yc-step.done{border-color:#bfe8cf}
  .yc-step-head{display:flex;align-items:center;gap:10px;background:#f2f8ff;padding:10px 14px}
  .yc-step.done .yc-step-head{background:#eefaf3}
  .yc-step-head h4{margin:0;font-size:17px;color:var(--navy)}
  .yc-num{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--blue);color:#fff;font-weight:900;flex:none}
  .yc-step.done .yc-num{background:var(--green)}
  .yc-step-body{padding:12px 14px;line-height:1.7}
  .yc-step-body p{margin:0 0 8px}
  .yc-class-box{border:1px solid #e1ebf6;border-radius:12px;margin:8px 0;padding:8px 12px;background:#fbfdff}
  .yc-class-box summary{cursor:pointer;display:flex;flex-wrap:wrap;align-items:center;gap:8px}
  .yc-sum-btns{margin-inline-start:auto;display:flex;gap:6px}
  .yc-st-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px 12px;margin-top:10px}
  .yc-st-grid label{font-weight:700;cursor:pointer}
  .yc-check{display:flex;gap:8px;align-items:center;font-weight:800;margin:10px 0;cursor:pointer}
  .yc-danger{background:linear-gradient(135deg,#d93848,#ee4d5a)!important}
  .yc-bad{color:#b22836;font-weight:800}
  .yc-note{color:#4d5b75;font-weight:700}
  .yc-two{display:grid;grid-template-columns:1fr 1.4fr;gap:16px}
  .yc-lbl{display:block;font-weight:800;color:#17376c;margin-bottom:8px}
  .yc-lbl textarea,.yc-lbl select,.yc-step-body .form-grid input{width:100%;margin-top:6px;border:1px solid #cfe0f1;border-radius:12px;padding:10px;font:inherit;font-weight:700;color:#10234f;background:#fff;box-sizing:border-box}
  .yc-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .yc-issue{border-radius:12px;padding:10px 12px;margin-top:10px;line-height:1.8}
  .yc-issue.ok{background:#eefaf3;color:#147147}
  .yc-issue.bad{background:#fff0f2;color:#93283a}
  .yc-issue.warn{background:#fff8e7;color:#7e5b0c}
  .yc-issue.info{background:#eef6ff;color:#0d4f99}
  .yc-file{position:relative;overflow:hidden;display:inline-block;cursor:pointer}
  .yc-file input{position:absolute;inset:0;opacity:0;cursor:pointer}
  .yc-log-h{margin:14px 0 6px;color:var(--navy)}
  .yc-log{margin:0;padding:0 18px 0 0;line-height:1.8;font-weight:700}
  .yc-log span{color:#4d5b75}
  .yc-progress{padding:6px 2px}
  .yc-bar{height:16px;background:#e6eef8;border-radius:999px;overflow:hidden}
  .yc-bar i{display:block;height:100%;background:linear-gradient(90deg,#1168d7,#22c8c3);transition:width .3s}
  .yc-prog{font-weight:900;font-size:18px;text-align:center;margin:10px 0}
  .yc-archive-banner{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;padding:12px 16px;border-radius:16px;background:#fff4dc;border:2px solid #f2c45a;color:#6b4a00;font-weight:800}
  @media(max-width:1000px){.yc-stats{grid-template-columns:repeat(3,1fr)}.yc-grid2,.yc-two{grid-template-columns:1fr}}
  @media(max-width:600px){.yc-stats{grid-template-columns:repeat(2,1fr)}.yc-inline input{min-width:0;width:100%}}
  `;
  document.head.appendChild(css);

  /* عند التحميل: طبّق الفصول المحفوظة على القوائم */
  applyClasses(computeClasses([]));
})();
