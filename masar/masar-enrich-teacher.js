/* ===== مسار التقدم — الخطة الإثرائية للطلاب المتميزين (لوحة المعلم) =====
   طلاب الخطة الإثرائية يُسجَّلون في جدول الطلاب نفسه بفصل يبدأ بكلمة «إثراء» (مثل: إثراء 1/1)،
   فيُفصلون آليًا عن الخطة العلاجية (students / assignments / results) ويُعرضون هنا فقط. */
(function(){
"use strict";
if(!document.getElementById("enCard")||!window.ENRICH)return;
const SK_Q="إثراء — تحدي التفكير",SK_T="إثراء — المهمة الإبداعية",PREFIX="إثراء ";
const E=window.ENRICH;
const enIdx=k=>E.findIndex(e=>e.key===k||e.t===k);
const enCls=s=>String(s.class_name||"").replace(/^إثراء\s*/,"");
const act=()=>enrStudents.filter(x=>x.active);
const LEVELS=[[0,"🔭 مستكشف"],[60,"🔬 باحث"],[150,"🧠 مفكّر"],[280,"🏅 عالم صغير"],[450,"👑 عبقري العلوم"]];
const BANDS={none:["لم تُكلَّف أنشطة","#adb5bd"],"0":["لم يبدأ","#e03131"],"1":["بداية (أقل من 50%)","#f08c00"],"2":["متقدم (50–84%)","#1c7ed6"],"3":["متفوق (85% فأكثر)","#2f9e44"]};
const msg=(t,ok)=>{const e=$("enNote");e.textContent=t;e.style.color=ok===false?"#c92a2a":ok?"#2f9e44":"#3b1f6e"};

/* ---------- الإحصاءات ---------- */
function enStat(s){
 const keys=[...new Set(enrAssignments.filter(a=>a.student_id===s.id&&a.enabled).map(a=>a.lesson_key))].filter(k=>enIdx(k)>=0);
 const all=enrAll.filter(r=>r.student_id===s.id),rs=all.filter(r=>String(r.skill_title||"").startsWith("إثراء"));
 const lg=all.filter(r=>r.assessment_kind==="دخول"),lastLogin=lg.reduce((a,r)=>r.recorded_at>a?r.recorded_at:a,"");
 const touched=[...new Set([...keys,...rs.map(r=>r.lesson_key)])].filter(k=>enIdx(k)>=0);
 const per=touched.map(k=>{const q=rs.filter(r=>r.lesson_key===k&&r.skill_title===SK_Q),t=rs.some(r=>r.lesson_key===k&&r.skill_title===SK_T);
  const best=q.length?Math.max(...q.map(r=>+r.correct_count||0)):null,last=rs.filter(r=>r.lesson_key===k).reduce((a,r)=>r.recorded_at>a?r.recorded_at:a,"");
  return {k,i:enIdx(k),assigned:keys.includes(k),best,tries:q.length,task:t,last,done:best!=null&&best>=3&&t,pts:(best||0)*10+(best===4?10:0)+(t?20:0)}}).sort((a,b)=>a.i-b.i);
 const asg=per.filter(p=>p.assigned),acts=asg.length*2,doneActs=asg.reduce((a,p)=>a+(p.best!=null&&p.best>=3?1:0)+(p.task?1:0),0);
 const qs=rs.filter(r=>r.skill_title===SK_Q),cor=qs.reduce((a,r)=>a+(+r.correct_count||0),0),tot=qs.reduce((a,r)=>a+(+r.total_count||0),0);
 const progress=pct(doneActs,acts),pts=per.reduce((a,p)=>a+p.pts,0);let lv=0;LEVELS.forEach((x,i)=>{if(pts>=x[0])lv=i});
 const band=!keys.length?"none":!rs.length?"0":progress>=85?"3":progress>=50?"2":"1";
 const badges=[["🌟","أول إنجاز",rs.length>0],["🧠","مفكر ناقد",per.filter(p=>p.best===4).length>=3],["🛠️","مبتكر",per.filter(p=>p.task).length>=3],["🏆","بطل الإثراء",asg.length>0&&asg.every(p=>p.done)],["🔥","مثابر",lg.length>=5]];
 return {s,keys,per,asg,progress,acc:pct(cor,tot),tot,pts,level:LEVELS[lv][1],band,badges,completed:asg.filter(p=>p.done).length,tasks:per.filter(p=>p.task).length,perfect:per.filter(p=>p.best===4).length,
  attempts:qs.length,secs:rs.reduce((a,r)=>a+(+r.seconds_spent||0),0),last:rs.reduce((a,r)=>r.recorded_at>a?r.recorded_at:a,""),loginN:lg.length,lastLogin}}

/* ---------- العرض ---------- */
function renderEnr(){
 const list=act(),st=list.map(enStat),planned=st.filter(x=>x.keys.length),started=planned.filter(x=>x.attempts||x.tasks);
 $("enKpis").innerHTML=`<div class="en-kpis">${[[list.length,"طالبًا متميزًا"],[E.filter((e,i)=>list.some(s=>enrAssignments.some(a=>a.student_id===s.id&&a.enabled&&enIdx(a.lesson_key)===i))).length+" / "+E.length,"نشاطًا مفعّلًا"],[started.length,"بدأوا الأنشطة"],[planned.length?Math.round(planned.reduce((a,x)=>a+x.progress,0)/planned.length)+"%":"—","متوسط الإنجاز"],[st.reduce((a,x)=>a+x.completed,0),"مهمة مكتملة"]].map(t=>`<div><b>${t[0]}</b><span>${t[1]}</span></div>`).join("")}</div>`;
 /* الطلاب */
 const tb=$("enStudents");tb.replaceChildren();
 const rows=[...enrStudents].sort((a,b)=>(b.active-a.active)||enCls(a).localeCompare(enCls(b))||a.full_name.localeCompare(b.full_name,"ar"));
 if(!rows.length){tb.innerHTML='<tr><td colspan="8" class="en-empty">لا يوجد طلاب في الخطة الإثرائية بعد — أضفهم من «إضافة طلاب متميزين».</td></tr>'}
 rows.forEach((s,i)=>{const x=enStat(s),url=linkOf(s),tr=document.createElement("tr");if(!s.active)tr.className="off";
  tr.innerHTML=`<td>${i+1}</td><td class="nm"></td><td>${escR(enCls(s))}</td><td class="pc">${s.active?bar(x.progress)+"<b>"+x.progress+"%</b>":"موقوف"}</td><td>${x.pts}</td><td>${fmtDate(x.lastLogin)}</td><td>${url?"✓ صالح":"✗ لم يصدر"}</td><td class="en-act"></td>`;
  tr.querySelector(".nm").textContent=s.full_name;const td=tr.querySelector(".en-act");
  const btn=(t,f,cls)=>{const b=document.createElement("button");b.type="button";b.className="secondary qc-b"+(cls?" "+cls:"");b.textContent=t;b.onclick=f;td.append(b)};
  if(s.active&&url){btn("🖨️ بطاقة",()=>enPrint([s]));btn("🖼️ صورة",()=>enImage(s));btn("واتساب",()=>window.open("https://wa.me/?text="+encodeURIComponent(enShare(s,url)),"_blank","noopener"));btn("📋",()=>copyEn(url,"نُسخ رابط "+s.full_name));btn("🔗 تجربة",()=>window.open(url,"_blank","noopener"))}
  if(s.active&&!url&&TOKSEED)btn("🔐 إصدار باركود",async()=>{try{msg("⏳ جارٍ الإصدار…");(await issueOne(s))?msg("✓ صدر باركود "+s.full_name,true):msg("تعذر التحقق من الرمز مع الخادم",false);renderEnr()}catch(e){msg(e.message,false)}});
  btn("🎓 ملف إنجاز",()=>openRep("enPf",s.id));
  btn(s.active?"⏸ إيقاف":"↩ إعادة",async()=>{try{await api("masar_students?id=eq."+s.id,"PATCH",{active:!s.active});await reload();msg("✓ تم تعديل حالة "+s.full_name,true)}catch(e){msg(e.message,false)}});
  btn("🗑️",()=>delStudents([s],"حذف الطالب «"+s.full_name+"» من الخطة الإثرائية نهائيًا؟"),"en-del");
  tb.append(tr)});
 /* الأنشطة */
 const host=$("enLessons");host.replaceChildren();
 E.forEach((e,i)=>{const n=list.filter(s=>enrAssignments.some(a=>a.student_id===s.id&&a.enabled&&a.lesson_key===e.key)).length,full=list.length&&n===list.length;
  const done=st.filter(x=>x.per.some(p=>p.i===i&&p.done)).length;
  const b=document.createElement("button");b.type="button";b.className="en-les"+(n?" on":"")+(n&&!full?" part":"");
  b.innerHTML=`<i>${n?"✓":e.ic}</i><span><b></b><small>${n?"✓ مفعّل لـ "+n+" من "+list.length+(done?" • أكمله "+done:""):"غير مفعّل"}</small></span>`;b.querySelector("b").textContent=(i+1)+". "+e.t;
  b.onclick=()=>toggleLesson([i],!full);host.append(b)});
 /* البطاقات */
 const ready=list.filter(linkOf).length;$("enQr").innerHTML=!TOKSEED?"سجّل الدخول لعرض الباركود.":`<b>${ready}</b> من <b>${list.length}</b> طالبًا متميزًا لديهم باركود صالح`+(ready<list.length?' — اضغط «إصدار باركود المتميزين» لإكمال الباقين':" ✓")+". الطالب المتميز يدخل بالباركود إلى صفحة «مسار التميّز» مباشرة.";
 /* قائمة ملفات الإنجاز */
 const sel=$("enPfSel"),v=sel.value;sel.innerHTML='<option value="all">ملفات إنجاز جميع الطلاب المتميزين</option>'+list.map(s=>`<option value="${s.id}">${escR(s.full_name)} — ${escR(enCls(s))}</option>`).join("");sel.value=[...sel.options].some(o=>o.value===v)?v:"all";
}

/* ---------- تفعيل الأنشطة ---------- */
async function toggleLesson(idxs,enable){const targets=act();if(!targets.length){msg("أضف الطلاب المتميزين أولًا.",false);return}
 const names=idxs.map(i=>E[i].t);if(!enable&&!confirm("إيقاف "+(idxs.length>1?idxs.length+" نشاطًا":"نشاط «"+names[0]+"»")+" لجميع الطلاب المتميزين؟\nتبقى نتائجهم محفوظة."))return;
 let n=0;const total=idxs.length*targets.length;try{for(const i of idxs){const key=E[i].key;for(const s of targets){const prev=enrAssignments.find(a=>a.student_id===s.id&&a.lesson_key===key);
   if(prev){if(prev.enabled!==enable)await api("masar_assignments?id=eq."+prev.id,"PATCH",{enabled:enable})}else if(enable)await api("masar_assignments","POST",{teacher_id:uid,student_id:s.id,lesson_key:key,lesson_title:key,enabled:true});n++;msg("⏳ جارٍ الحفظ… "+n+" من "+total)}}
  await reload();msg("✓ تم "+(enable?"تفعيل":"إيقاف")+" "+(idxs.length>1?idxs.length+" نشاطًا":"«"+names[0]+"»")+" لـ "+targets.length+" طالبًا متميزًا",true)}
 catch(e){msg("تعذر الحفظ: "+e.message,false);await reload().catch(()=>{})}}
$("enAllOn").onclick=()=>toggleLesson(E.map((e,i)=>i),true);
$("enAllOff").onclick=()=>toggleLesson(E.map((e,i)=>i),false);

/* ---------- إضافة الطلاب ---------- */
function parseNames(){const def=$("enClass").value;let cl=def;const out=[];
 $("enNames").value.split(/\n/).forEach(line=>{const raw=line.trim().replace(/\s+/g," ");if(!raw)return;
  const nr=raw.replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d));const m=nr.match(/^(?:الفصل|فصل|صف)?\s*(\d+)\s*\/\s*(\d+)\s*(?:صف|فصل)?\s*:?$/);if(m){cl=m[1]+"/"+m[2];return}
  if(/^(اسماء|أسماء)\s+الطلاب/.test(raw))return;
  raw.split(/[،,]/).map(x=>x.replace(/^[\s\d٠-٩.\-–_)•ـ]+/,"").trim()).filter(x=>x.length>2&&!/\d+\s*\/\s*\d+/.test(x)).forEach(n=>out.push({n,cl}))});return out}
$("enAdd").onclick=async()=>{const items=parseNames();if(!items.length){msg("اكتب اسم طالب واحد على الأقل",false);return}
 const dup=items.filter(x=>enrStudents.some(s=>s.full_name===x.n)),add=items.filter(x=>!dup.includes(x));
 if(!add.length){msg("جميع الأسماء موجودة مسبقًا في الخطة الإثرائية",false);return}
 const by={};add.forEach(x=>(by[x.cl]=by[x.cl]||[]).push(x.n));
 if(!confirm("إضافة "+add.length+" طالبًا إلى الخطة الإثرائية:\n"+Object.keys(by).map(c=>"الفصل "+c+": "+by[c].length).join("\n")+(dup.length?"\n(تجاوز "+dup.length+" اسم موجود مسبقًا)":"")+"\nمتابعة؟"))return;
 const b=$("enAdd");b.disabled=true;let ok=0,qr=0,fail="";
 for(const x of add){msg("⏳ إضافة "+x.n+" ("+(ok+1)+" من "+add.length+")…");
  try{const r=await insertStudent({full_name:x.n,class_name:PREFIX+x.cl,active:true});const row=Array.isArray(r)?r[0]:r;if(!row||!row.id)throw Error("لم يُرجع الخادم سجل الطالب");enrStudents.push(row);ok++;
   if($("enIssueNew").checked&&TOKSEED){if(!TOKFIELD)TOKFIELD=detectField();if(TOKFIELD){try{if(await issueOne(row))qr++}catch(e){}}}}
  catch(e){fail=e.message;break}}
 b.disabled=false;await reload();
 if(ok)$("enNames").value="";
 if(/row-level|policy|permission/i.test(fail))fail="قاعدة البيانات لا تسمح بعد لحساب المعلم بإضافة طلاب — شغّل ملف الصلاحيات (SETUP-control-panel.sql) مرة واحدة في Supabase";msg(ok?"✓ أُضيف "+ok+" طالبًا متميزًا"+($("enIssueNew").checked?" • باركود جاهز لـ "+qr:"")+(fail?" • توقفت الإضافة: "+fail:"")+". فعّل لهم الأنشطة من الأسفل.":"تعذرت الإضافة: "+fail,ok&&!fail?true:false)};

/* إضافة طالب: يُربط بحساب المعلم (teacher_id) حتى يسمح له الجدول بقراءته بعد الإضافة */
let TID=null,SAMPLE=null;
async function sample(){if(SAMPLE)return SAMPLE;try{const r=await api("masar_students?select=*&limit=1");SAMPLE=(r&&r[0])||{}}catch(e){SAMPLE={}}return SAMPLE}
async function teacherId(){if(TID)return TID;const sm=await sample();if(sm.teacher_id)TID=sm.teacher_id;else{try{const r=await api("masar_students?select=teacher_id&teacher_id=not.is.null&limit=1");if(r&&r[0])TID=r[0].teacher_id}catch(e){}}return TID||uid}
const isUuid=v=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(v||""));
const newUuid=()=>crypto.randomUUID?crypto.randomUUID():"10000000-1000-4000-8000-100000000000".replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16));
/* يجهّز سجل الطالب كاملًا: رمز المعلم + معرّف + رمز الدخول (token_digest) لأن الجدول يشترطهما */
async function buildRow(row){const sm=await sample(),out=Object.assign({teacher_id:await teacherId()},row);
 if(isUuid(sm.id)||!("id" in sm))out.id=newUuid();
 let t="";try{if(out.id&&TOKSEED)t=await tokenFor({id:out.id})}catch(e){}
 if(!t)t="P"+hex(await sha("pending|"+Date.now()+"|"+Math.random()));
 /* كل أعمدة الرمز تُملأ من رمز الطالب الحقيقي وبصيغة القيم الموجودة عند الطلاب الحاليين */
 const fmt=async(v)=>{v=String(v||"");if(/^\\x[0-9a-f]{64}$/i.test(v))return SCHEMES.hexsalt(t);if(/^[0-9a-f]{64}$/i.test(v))return SCHEMES.hex(t);if(/^[A-Za-z0-9+/]{43}=$/.test(v))return SCHEMES.b64(t);if(/^M[A-Za-z0-9_-]{40,}$/.test(v))return t;return SCHEMES.hex(t)};
 const cols=new Set(["token_digest"]);if(TOKFIELD)cols.add(TOKFIELD);Object.keys(sm).forEach(k=>{if(/token|digest|hash/i.test(k)&&typeof sm[k]==="string")cols.add(k)});
 for(const c of cols){if(c===TOKFIELD&&TOKSCHEME)out[c]=await SCHEMES[TOKSCHEME](t);else out[c]=await fmt(sm[c])}
 out.__tok=t;return out}
async function insertStudent(row){let body=await buildRow(row);delete body.__tok;
 const sm=await sample();for(let i=0;i<6;i++){try{return await api("masar_students","POST",body)}catch(e){const m=e.message||"";
   const col=(m.match(/column "?([a-z_]+)"? of relation/i)||m.match(/find the '([a-z_]+)' column/i)||[])[1];
   if(col&&/could not find|does not exist/i.test(m)&&col in body){delete body[col];continue}
   if(/invalid input syntax for type (integer|bigint)/i.test(m)&&body.id){delete body.id;continue}
   if(col&&/not-null/i.test(m)&&!(col in body)&&/token|digest|hash/i.test(col)){body[col]=body.token_digest;continue}
   if(col&&/not-null/i.test(m)&&!(col in body)&&sm[col]!=null){body[col]=sm[col];continue}
   if(!/row-level|policy/i.test(m))throw e;
   const r=await fetch(B+"/rest/v1/masar_students",{method:"POST",headers:{apikey:K,Authorization:"Bearer "+jwt,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify(body)});
   if(!r.ok){let t="";try{t=(await r.json()).message||""}catch(x){}throw Error(t||m)}
   const f=await api("masar_students?select=*&full_name=eq."+encodeURIComponent(row.full_name)+"&class_name=eq."+encodeURIComponent(row.class_name));if(!f.length)throw Error("أُضيف الطالب لكن قاعدة البيانات لا تسمح للمعلم بقراءته");return f}}
 throw Error("تعذرت إضافة الطالب")}
window.masarInsertStudent=insertStudent;

/* ---------- الحذف ---------- */
async function delStudents(list,question){if(!list.length)return;if(!confirm(question))return;let del=0,off=0;
 for(const s of list){msg("⏳ "+s.full_name+"…");try{try{await api("masar_skill_results?student_id=eq."+s.id,"DELETE")}catch(e){}await api("masar_assignments?student_id=eq."+s.id,"DELETE");await api("masar_students?id=eq."+s.id,"DELETE");del++}
  catch(e){try{await api("masar_students?id=eq."+s.id,"PATCH",{active:false,class_name:"أرشيف "+String(s.class_name)});off++}catch(e2){}}}
 await reload();msg("✓ حُذف "+del+" طالب"+(off?" • تعذر الحذف النهائي لـ "+off+" فأُوقفوا ونُقلوا إلى الأرشيف":""),true)}
$("enWipe").onclick=()=>{const all=[...enrStudents];if(!all.length){msg("لا يوجد طلاب في الخطة الإثرائية",false);return}
 delStudents(all,"سيُحذف "+all.length+" طالبًا من الخطة الإثرائية مع تكليفاتهم نهائيًا.\nهل أنت متأكد؟")};

/* ---------- الباركود ---------- */
function enShare(s,url){return "🌟 مادة العلوم — مسار التميّز (الخطة الإثرائية)\nالطالب: "+s.full_name+" — الفصل "+enCls(s)+"\nرابط دخولك الشخصي (لا تشاركه مع غيرك):\n"+url}
async function copyEn(t,ok){try{await navigator.clipboard.writeText(t);msg("✓ "+ok,true)}catch(e){prompt("انسخ:",t)}}
function enCardNode(s,fc){const w=cardNode(Object.assign({},s,{class_name:enCls(s)}),linkOf(s),fc||"");w.querySelectorAll("text").forEach(t=>{if(t.textContent.trim()==="مسار التقدم التعليمي")t.textContent="الخطة الإثرائية"});return w}
function enPrint(list){list=list.filter(linkOf);if(!list.length){msg("لا يوجد باركود صالح للطباعة — أصدر الباركود أولًا.",false);return}if(typeof QRCode!=="function"){msg("تعذر تحميل أداة الباركود؛ تحقق من الإنترنت.",false);return}
 const box=$("qcPrint");box.replaceChildren();list.forEach(s=>box.append(enCardNode(s)));document.body.classList.add("qc-printing");setTimeout(()=>{window.print();setTimeout(()=>document.body.classList.remove("qc-printing"),500)},400)}
async function enImage(s){try{msg("⏳ جارٍ تجهيز صورة البطاقة…");const fc=await embedFont(),node=enCardNode(s,fc),svg=node.querySelector("svg");svg.setAttribute("width","2112");svg.setAttribute("height","1392");
 const img=new Image();await new Promise((r,j)=>{img.onload=r;img.onerror=()=>j(Error("تعذر رسم البطاقة"));img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(new XMLSerializer().serializeToString(svg))});await new Promise(r=>setTimeout(r,150));
 const cv=document.createElement("canvas");cv.width=2112;cv.height=1392;cv.getContext("2d").drawImage(img,0,0);const blob=await new Promise(r=>cv.toBlob(r,"image/png"));
 const name="بطاقة-تميز-"+s.full_name+".png",file=new File([blob],name,{type:"image/png"});
 if(navigator.canShare&&navigator.canShare({files:[file]}))await navigator.share({files:[file],title:"بطاقة "+s.full_name,text:enShare(s,linkOf(s))});else{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000)}msg("✓ جُهّزت صورة بطاقة "+s.full_name,true)}catch(e){if(e.name!=="AbortError")msg(e.message,false)}}
$("enIssue").onclick=async()=>{const list=act().filter(s=>!linkOf(s));if(!list.length){msg("✓ جميع الطلاب المتميزين لديهم باركود صالح.",true);return}
 if(!TOKFIELD)TOKFIELD=detectField();if(!TOKFIELD){msg("لم أجد حقل رمز الدخول في سجل الطالب.",false);return}
 if(!confirm("سيُصدر باركود شخصي ثابت لـ "+list.length+" طالبًا متميزًا. متابعة؟"))return;let ok=0,fail=0;
 for(const s of list){msg("⏳ جارٍ إصدار الباركود… "+(ok+fail+1)+" من "+list.length);try{(await issueOne(s))?ok++:fail++}catch(e){msg(e.message,false);break}}renderEnr();msg("✓ صدر "+ok+" باركود"+(fail?" — تعذر "+fail:""),!fail)};
$("enPrint").onclick=()=>enPrint(act());
$("enCopy").onclick=()=>{const t=act().filter(linkOf).map(s=>s.full_name+" — الفصل "+enCls(s)+"\n"+linkOf(s)).join("\n\n");t?copyEn(t,"نُسخت روابط الطلاب المتميزين"):msg("لا يوجد باركود صالح",false)};

/* ---------- التقارير ---------- */
function enPool(){const c=$("rpClass").value;return act().filter(s=>c==="all"||enCls(s)===c)}
function enData(){const pool=enPool(),st=pool.map(enStat),planned=st.filter(x=>x.keys.length),started=planned.filter(x=>x.attempts||x.tasks);
 const bands={};["0","1","2","3"].forEach(b=>bands[b]=planned.filter(x=>x.band===b).length);
 const ids=new Set(pool.map(s=>s.id)),rs=enrAll.filter(r=>ids.has(r.student_id)&&String(r.skill_title||"").startsWith("إثراء")),lg=enrAll.filter(r=>ids.has(r.student_id)&&r.assessment_kind==="دخول");
 const perLesson=E.map((e,i)=>{const asg=planned.filter(x=>x.keys.some(k=>enIdx(k)===i)),q=rs.filter(r=>enIdx(r.lesson_key)===i&&r.skill_title===SK_Q),pp=st.map(x=>x.per.find(p=>p.i===i)).filter(Boolean);
  return {t:e.t,i,assigned:asg.length,acc:pct(q.reduce((a,r)=>a+(+r.correct_count||0),0),q.reduce((a,r)=>a+(+r.total_count||0),0)),attempts:q.length,done:pp.filter(p=>p.done).length,tasks:pp.filter(p=>p.task).length}}).filter(x=>x.assigned||x.attempts);
 const classes=[...new Set(pool.map(enCls))].sort().map(c=>{const x=planned.filter(q=>enCls(q.s)===c);return {c,n:pool.filter(s=>enCls(s)===c).length,started:x.filter(q=>q.attempts||q.tasks).length,prog:x.length?Math.round(x.reduce((a,q)=>a+q.progress,0)/x.length):0}});
 const qs=rs.filter(r=>r.skill_title===SK_Q);
 return {pool,st,planned,started,bands,perLesson,classes,avgP:planned.length?Math.round(planned.reduce((a,x)=>a+x.progress,0)/planned.length):0,avgA:pct(qs.reduce((a,r)=>a+(+r.correct_count||0),0),qs.reduce((a,r)=>a+(+r.total_count||0),0)),
  completed:st.reduce((a,x)=>a+x.completed,0),tasks:st.reduce((a,x)=>a+x.tasks,0),perfect:st.reduce((a,x)=>a+x.perfect,0),attempts:qs.length,secs:rs.reduce((a,r)=>a+(+r.seconds_spent||0),0),logins:lg.length,top:planned.filter(x=>x.band==="3").length}}
const strip=d=>{const n=d.planned.length||1;return `<div class="rp-strip">${["3","2","1","0"].map(b=>d.bands[b]?`<i style="flex:${d.bands[b]};background:${BANDS[b][1]}">${d.bands[b]}</i>`:"").join("")||'<i style="flex:1;background:#dee2e6">لا بيانات بعد</i>'}</div><div class="rp-legend">${["3","2","1","0"].map(b=>`<span><i style="background:${BANDS[b][1]}"></i>${BANDS[b][0]}: <b>${d.bands[b]}</b> (${pct(d.bands[b],n)}%)</span>`).join("")}</div>`};
const clsLabel=()=>$("rpClass").value!=="all"?" — الفصل "+$("rpClass").value:"";
const sign3='<div class="rp-sign"><div>معلم المادة<br><b>علي طاهر البقاشي</b></div><div>المرشد الطلابي<br><b>مانع المعيدي</b></div><div>مدير المدرسة<br><b>فوزي محمد الهلال</b></div></div>';
const enHead=(t,s)=>rpHead(t,s).replace('class="rp-head"','class="rp-head en-head"').replace("🧬","🌟");

function planHtml(){const d=enData(),acts=d.perLesson.filter(l=>l.assigned);
 return `<div class="rp">${enHead("تقرير الخطة الإثرائية للطلاب المتميزين","منصة مسار التقدم — علوم الصف الأول المتوسط"+clsLabel())}
 <h2>بيانات التنفيذ</h2><p><b>المعلم:</b> علي طاهر البقاشي &nbsp;•&nbsp; <b>مدير المدرسة:</b> فوزي محمد الهلال &nbsp;•&nbsp; <b>المرشد الطلابي:</b> مانع المعيدي &nbsp;•&nbsp; <b>الفئة المستهدفة:</b> الطلاب المتميزون في العلوم</p>
 <h2>فكرة الخطة</h2><p>مسار إثرائي رقمي مستقل داخل منصة مسار التقدم، يقدّم للطلاب المتميزين محتوى يتجاوز متطلبات الدرس الأساسية. يدخل كل طالب ببطاقة باركود شخصية إلى صفحة «مسار التميّز»، ويجد الأنشطة التي فعّلها المعلم، ولكل نشاط ثلاث مراحل: فكرة إثرائية تربط الدرس بالواقع وبإسهامات العلماء، ثم أربعة تحديات في مهارات التفكير العليا (التطبيق، التحليل، التقويم، الاستدلال) مع تبرير علمي فوري لكل إجابة، ثم مهمة إبداعية ينفذها الطالب بيده (تصميم تجربة، بناء نموذج، تحقيق علمي). ويحصل الطالب على نقاط تميّز وأوسمة ومستويات تحفّزه على الاستمرار.</p>
 <h2>الأهداف</h2><ul><li>رعاية الطلاب المتميزين وتنمية قدراتهم في مادة العلوم بما يتجاوز المحتوى الأساسي.</li><li>تنمية مهارات التفكير العليا: التطبيق، والتحليل، والتقويم، والاستدلال العلمي.</li><li>تنمية الإبداع والابتكار عبر مهمات عملية: تصميم التجارب، وبناء النماذج، وتقويم الادعاءات العلمية.</li><li>ربط مفاهيم الدروس بالواقع وبالبيئة المحلية وبإسهامات العلماء.</li><li>متابعة إنجاز كل طالب رقميًا وتوثيقه في ملف إنجاز خاص به.</li></ul>
 <h2>مؤشرات التنفيذ</h2>${tiles([[d.pool.length,"طالبًا متميزًا مستهدفًا"],[d.started.length+" من "+d.planned.length,"بدأوا الأنشطة"],[d.avgP+"%","متوسط الإنجاز"],[d.attempts?d.avgA+"%":"—","دقة تحديات التفكير العليا"],[d.completed,"مهمة إثرائية مكتملة"],[d.tasks,"مهمة إبداعية منفذة"]])}
 <h2>الفئة المستهدفة حسب الفصول</h2>${hbars(d.classes.map(c=>["الفصل "+c.c+" ("+c.started+" من "+c.n+" بدأوا)",pct(c.started,c.n),"#7048e8"]))}
 <h2>الأنشطة الإثرائية المفعّلة (${acts.length} من ${E.length})</h2>${acts.length?`<div class="rp-tw"><table class="rp-t"><thead><tr><th>#</th><th>النشاط الإثرائي</th><th>المهمة الإبداعية</th><th>المستفيدون</th><th>دقة التحديات</th><th>أكملوه</th></tr></thead><tbody>${acts.map((l,i)=>`<tr><td>${i+1}</td><td class="nm">${escR(l.t)}</td><td>${escR(E[l.i].task.h)}</td><td>${l.assigned}</td><td>${l.attempts?l.acc+"%":"—"}</td><td>${l.done}</td></tr>`).join("")}</tbody></table></div>`:'<p class="rp-empty">لم تُفعّل أنشطة بعد.</p>'}
 <h2>توزيع الطلاب حسب مستوى الإنجاز</h2>${strip(d)}
 <h2>الشواهد الرقمية</h2><div class="rp-ev">مرات دخول الطلاب المتميزين: <b>${d.logins}</b> &nbsp;•&nbsp; محاولات تحديات التفكير: <b>${d.attempts}</b> &nbsp;•&nbsp; تحديات أُجيبت كاملة (٤ من ٤): <b>${d.perfect}</b> &nbsp;•&nbsp; المهمات الإبداعية المنفذة: <b>${d.tasks}</b> &nbsp;•&nbsp; زمن العمل: <b>${fmtMin(d.secs)}</b><br>تُسجَّل كل محاولة رقميًا بتاريخها ووقتها وزمنها ونتيجتها، ولكل طالب ملف إنجاز خاص يوثّق مهماته وأوسمته.</div>
 <h2>التوصيات</h2><ul>${d.planned.length-d.started.length>0?`<li>متابعة ${d.planned.length-d.started.length} طالب متميز لم يبدأ الأنشطة بعد وتشجيعه على الدخول بالباركود.</li>`:""}${d.top?`<li>تكريم ${d.top} طالب متفوق (85% فأكثر) وعرض مهماتهم الإبداعية في الإذاعة المدرسية أو معرض العلوم.</li>`:""}<li>إشراك الطلاب المتميزين قادةً ومساعدين لزملائهم في الخطة العلاجية.</li><li>تفعيل أنشطة إثرائية جديدة تباعًا مع تقدم الدروس، وترشيح المتفوقين للمسابقات العلمية.</li></ul>
 <p class="rp-note">التقرير لا يتضمن أسماء الطلاب؛ جميع الأرقام مجمّعة ومحسوبة آليًا من سجل المنصة حتى تاريخ إصداره.</p>${sign3}</div>`}

function progHtml(){const d=enData();
 return `<div class="rp">${enHead("تقرير تقدم الطلاب المتميزين في الخطة الإثرائية","منصة مسار التقدم — علوم الصف الأول المتوسط"+clsLabel())}
 ${tiles([[d.pool.length,"طالبًا متميزًا"],[d.started.length,"بدأوا الأنشطة"],[d.avgP+"%","متوسط الإنجاز"],[d.attempts?d.avgA+"%":"—","دقة التحديات"],[d.top,"متفوقون (85% فأكثر)"],[d.bands["0"],"لم يبدأوا بعد"]])}
 <h2>توزيع الطلاب حسب مستوى الإنجاز</h2>${strip(d)}
 <h2>تقدم كل طالب</h2><div class="rp-tw"><table class="rp-t"><thead><tr><th>#</th><th>الطالب</th><th>الفصل</th><th>الأنشطة المفعّلة</th><th>المكتملة</th><th>نسبة الإنجاز</th><th>دقة التحديات</th><th>المهمات الإبداعية</th><th>النقاط</th><th>المستوى</th><th>مرات الدخول</th><th>آخر نشاط</th><th>الحالة</th></tr></thead><tbody>${d.st.sort((a,b)=>b.progress-a.progress||b.pts-a.pts||a.s.full_name.localeCompare(b.s.full_name,"ar")).map((x,i)=>`<tr><td>${i+1}</td><td class="nm">${escR(x.s.full_name)}</td><td>${escR(enCls(x.s))}</td><td>${x.keys.length}</td><td>${x.completed}</td><td class="pc">${bar(x.progress)}<b>${x.progress}%</b></td><td>${x.attempts?x.acc+"%":"—"}</td><td>${x.tasks}</td><td>${x.pts}</td><td>${x.level}</td><td>${x.loginN}</td><td>${fmtDate(x.last)}</td><td><span class="rp-chip" style="background:${BANDS[x.band][1]}">${BANDS[x.band][0].split(" (")[0]}</span></td></tr>`).join("")||'<tr><td colspan="13">لا يوجد طلاب متميزون في هذا الاختيار.</td></tr>'}</tbody></table></div>
 <div class="rp-2"><div><h2>دقة التحديات في كل نشاط</h2>${hbars(d.perLesson.filter(l=>l.attempts).map(l=>[l.t,l.acc]))}</div><div><h2>متوسط الإنجاز لكل فصل</h2>${hbars(d.classes.map(c=>["الفصل "+c.c+" ("+c.n+")",c.prog]))}</div></div>
 <p class="rp-note">طريقة الحساب: لكل نشاط مفعّل جزءان: تحديات التفكير (تُحتسب منجزة عند ٣ إجابات صحيحة من ٤ فأكثر في أفضل محاولة) والمهمة الإبداعية. نسبة الإنجاز = الأجزاء المنجزة ÷ أجزاء الأنشطة المفعّلة. النقاط = ١٠ لكل إجابة صحيحة في أفضل محاولة + ١٠ مكافأة للعلامة الكاملة + ٢٠ للمهمة الإبداعية.</p>
 <div class="rp-sign"><div>معلم المادة<br><b>علي طاهر البقاشي</b></div><div>مدير المدرسة<br><b>فوزي محمد الهلال</b></div></div></div>`}

function pfOne(s){const x=enStat(s),earned=x.badges.filter(b=>b[2]);
 return `<div class="rp en-pf">${enHead("ملف إنجاز الطالب المتميز","الخطة الإثرائية — منصة مسار التقدم — علوم الصف الأول المتوسط")}
 <div class="en-id"><div class="en-av">🌟</div><div><small>اسم الطالب</small><b>${escR(s.full_name)}</b><span>الفصل ${escR(enCls(s))} • المستوى: ${x.level}</span></div><div class="en-pts"><b>${x.pts}</b><span>نقطة تميّز</span></div></div>
 ${tiles([[x.completed+" / "+x.keys.length,"مهمة إثرائية مكتملة"],[x.progress+"%","نسبة الإنجاز"],[x.attempts?x.acc+"%":"—","دقة تحديات التفكير"],[x.tasks,"مهمة إبداعية منفذة"],[x.loginN,"مرة دخول"],[x.secs?fmtMin(x.secs):"—","زمن العمل"]])}
 <h2>الأوسمة</h2><div class="en-bdg">${x.badges.map(b=>`<span class="${b[2]?"":"off"}">${b[0]} ${b[1]}</span>`).join("")}</div>
 <h2>سجل المهمات الإثرائية</h2>${x.per.length?`<div class="rp-tw"><table class="rp-t"><thead><tr><th>#</th><th>النشاط الإثرائي</th><th>أفضل نتيجة في التحديات</th><th>المحاولات</th><th>المهمة الإبداعية</th><th>الحالة</th><th>التاريخ</th></tr></thead><tbody>${x.per.map((p,i)=>`<tr><td>${i+1}</td><td class="nm">${escR(E[p.i].t)}</td><td>${p.best!=null?`<span class="en-stars">${"★".repeat(p.best)}${"☆".repeat(4-p.best)}</span> ${p.best}/4`:"—"}</td><td>${p.tries}</td><td>${p.task?"✓ "+escR(E[p.i].task.h):"—"}</td><td>${p.done?"✅ مكتملة":p.best!=null||p.task?"قيد الإنجاز":p.assigned?"لم تبدأ":"—"}</td><td>${fmtDate(p.last)}</td></tr>`).join("")}</tbody></table></div>`:'<p class="rp-empty">لم تُفعّل للطالب أنشطة بعد.</p>'}
 ${earned.length||x.completed?`<div class="en-cert"><b>شهادة تميّز</b><p>تشهد إدارة مدرسة أبي الدرداء المتوسطة ومعلم مادة العلوم بأن الطالب <b>${escR(s.full_name)}</b> قد شارك في الخطة الإثرائية للطلاب المتميزين، وأنجز <b>${x.completed}</b> مهمة إثرائية، وحصل على <b>${x.pts}</b> نقطة تميّز${earned.length?"، ونال أوسمة: "+earned.map(b=>b[1]).join("، "):""}. مع تمنياتنا له بدوام التفوق.</p></div>`:""}
 <h2>ملاحظات معلم المادة</h2><div class="en-lines"><i></i><i></i></div>
 <div class="rp-sign"><div>معلم المادة<br><b>علي طاهر البقاشي</b></div><div>ولي أمر الطالب<br><b>&nbsp;</b></div><div>مدير المدرسة<br><b>فوزي محمد الهلال</b></div></div></div>`}

const KINDS={enPlan:()=>{$("reportDoc").innerHTML=planHtml()},enProg:()=>{$("reportDoc").innerHTML=progHtml()},
 enPf:()=>{const v=$("enPfSel").value,list=v==="all"?act():act().filter(s=>s.id===v||String(s.id)===v);$("reportDoc").innerHTML=list.length?list.map(pfOne).join(""):'<div class="rp"><p class="rp-empty">لا يوجد طلاب متميزون بعد.</p></div>'}};
function openRep(kind,sid){if(sid!=null){$("enPfSel").value=String(sid)}KINDS[kind]();$("reportWrap").dataset.kind=kind;$("rpStatus").textContent="";$("reportWrap").classList.remove("hide");$("reportWrap").scrollIntoView({behavior:"smooth"})}
$("enRpPlan").onclick=()=>openRep("enPlan");$("enRpProg").onclick=()=>openRep("enProg");$("enRpPf").onclick=()=>openRep("enPf");
const isMine=()=>!!KINDS[$("reportWrap").dataset.kind];

/* أدوات التقرير: نُضيف دعم تقارير الإثراء دون تغيير سلوك تقارير الخطة العلاجية */
{const oc=$("rpClass").onchange;$("rpClass").onchange=function(){if(!$("reportWrap").classList.contains("hide")&&isMine()){KINDS[$("reportWrap").dataset.kind]();return}return oc&&oc.apply(this,arguments)}}
{const op=$("rpPdf").onclick;$("rpPdf").onclick=async function(){if(!isMine())return op&&op.apply(this,arguments);const st=$("rpStatus");st.textContent="جارٍ إنشاء PDF…";
 try{if(typeof html2canvas==="undefined"||!window.jspdf)throw Error("تعذر تحميل أداة PDF؛ تحقق من الإنترنت.");const {jsPDF}=window.jspdf,pdf=new jsPDF("p","mm","a4"),m=8,w=210-m*2,ph=297-m*2;let first=true;
  for(const el of $("reportDoc").querySelectorAll(".rp")){const c=await html2canvas(el,{scale:1.7,backgroundColor:"#ffffff",useCORS:true}),h=c.height*w/c.width,img=c.toDataURL("image/jpeg",.92);let y=0;while(y<h){if(!first)pdf.addPage();first=false;pdf.addImage(img,"JPEG",m,m-y,w,h);y+=ph}}
  const k=$("reportWrap").dataset.kind;pdf.save((k==="enPlan"?"ملف-إنجاز-الخطة-الإثرائية-مسار-التقدم":k==="enProg"?"تقرير-تقدم-الطلاب-المتميزين":"ملف-إنجاز-الطالب-المتميز")+".pdf");st.textContent="✓ تم تنزيل ملف PDF"}catch(e){st.textContent=e.message}}}
{const os=$("rpShare").onclick;$("rpShare").onclick=async function(){if(!isMine())return os&&os.apply(this,arguments);const d=enData();
 const t=`الخطة الإثرائية للطلاب المتميزين — منصة مسار التقدم\nعلوم الأول المتوسط — مدرسة أبي الدرداء المتوسطة\nالمعلم: علي طاهر البقاشي\nالطلاب المتميزون: ${d.pool.length}\nبدأوا الأنشطة: ${d.started.length}\nمتوسط الإنجاز: ${d.avgP}%\nدقة تحديات التفكير العليا: ${d.attempts?d.avgA+"%":"—"}\nالمهمات المكتملة: ${d.completed} • المهمات الإبداعية: ${d.tasks}`;
 if(navigator.share){try{await navigator.share({title:"الخطة الإثرائية",text:t});return}catch(e){}}try{await navigator.clipboard.writeText(t);$("rpStatus").textContent="✓ نُسخ الملخص"}catch(e){prompt("انسخ الملخص:",t)}}}
new MutationObserver(()=>{if($("reportWrap").dataset.kind==="enPlan")$("rpAddPf").classList.remove("hide")}).observe($("reportWrap"),{attributes:true,attributeFilter:["data-kind","class"]});
{const oa=$("rpAddPf").onclick;$("rpAddPf").onclick=async function(){if($("reportWrap").dataset.kind!=="enPlan")return oa&&oa.apply(this,arguments);const st=$("rpStatus");
 if(!window.PFStore){st.textContent="تعذر تحميل أداة ملف الإنجاز؛ تحقق من الإنترنت.";return}
 if(!confirm("سيُضاف تقرير الخطة الإثرائية إلى ملف الإنجاز (المعيار ٥: تحسين نتائج المتعلمين) دون أي أسماء طلاب. متابعة؟"))return;
 let tk=PFStore.token();if(!tk){tk=(prompt("أدخل رمز الوصول المحفوظ في لوحة تحكم ملف الإنجاز (يُحفظ على هذا الجهاز فقط):")||"").trim();if(!tk)return;PFStore.setToken(tk)}
 const box=document.createElement("div");box.style.cssText="position:fixed;left:-3000px;top:0;width:1000px;background:#fff";box.innerHTML=planHtml();document.body.appendChild(box);
 try{st.textContent="⏳ جارٍ تجهيز صورة التقرير…";const cv=await html2canvas(box.firstElementChild,{scale:1.5,backgroundColor:"#ffffff"}),b64=cv.toDataURL("image/jpeg",.9).split(",")[1];
  st.textContent="⏳ جارٍ الرفع إلى ملف الإنجاز…";const c=$("rpClass").value;
  await PFStore.shared.add({title:"تقرير الخطة الإثرائية للطلاب المتميزين — منصة مسار التقدم"+(c!=="all"?" — الفصل "+c:""),std:5,section:"الخطة الإثرائية — منصة مسار التقدم",kind:"image",date:new Date().toISOString().slice(0,10)},[{ext:"jpg",base64:b64,role:"main"}]);
  st.textContent="✓ أُضيف التقرير إلى ملف الإنجاز (المعيار ٥) — يظهر خلال دقيقة أو دقيقتين"}
 catch(e){st.textContent="✗ "+(e.message||"تعذر الرفع")+(e.status===401||e.status===403?" — حدّث رمز الوصول من لوحة تحكم ملف الإنجاز":"");if(e.status===401)PFStore.setToken("")}finally{box.remove()}}}

/* ---------- التنسيق ---------- */
const css=document.createElement("style");css.textContent=`
#enCard .en-sub,.en-help{color:#5b5274;font-size:14.5px}.en-help{margin:4px 0 8px}
.en-h{margin:22px 0 8px;font-size:18px;color:#3b1f6e!important;border-bottom:2px solid #ece4fb;padding-bottom:4px}.en-h small{font-size:12.5px;color:#7a6f96;font-weight:500}
.en-kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:12px 0}.en-kpis div{background:linear-gradient(135deg,#f6f1ff,#fff8e6);border:1px solid #e7dcfa;border-radius:14px;padding:10px;text-align:center}.en-kpis b{display:block;font-size:24px;color:#5b2fb3;line-height:1.3}.en-kpis span{font-size:12.5px;color:#6b5f8a}
#enNames{width:100%;border:1px solid #e1d6f5;border-radius:12px;padding:10px;font:600 15px/1.8 inherit;margin:6px 0}
.en-note{font-weight:700;min-height:1.4em;margin:8px 0}
.en-t{width:100%;border-collapse:collapse;font-size:14px}.en-t th{background:#f3edff;color:#3b1f6e;padding:8px;white-space:nowrap}.en-t td{border-bottom:1px solid #eee6fb;padding:6px 8px;text-align:center}.en-t td.nm{text-align:right;font-weight:700}.en-t tr.off td{opacity:.55}
.en-t td.pc{min-width:110px}.en-t td.pc .rp-bar{display:inline-block;width:60px;vertical-align:middle;margin-inline-end:6px}.en-act{text-align:right!important}.en-act .qc-b{margin:2px}.en-del{color:#c92a2a!important}.en-empty{color:#7a6f96;padding:16px!important}
.en-lessons{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px;margin:10px 0}
.en-les{background:#fff;border:2px solid #e7dcfa;border-radius:14px;padding:10px 12px;display:grid;grid-template-columns:34px 1fr;gap:8px;align-items:center;text-align:right;color:#24164a;font:600 14px inherit}
.en-les i{font-style:normal;width:32px;height:32px;border-radius:10px;background:#f3edff;display:grid;place-items:center;font-size:17px}.en-les small{display:block;color:#7a6f96;font-weight:500;font-size:12.5px}
.en-les.on{background:#5b2fb3;border-color:#5b2fb3;color:#fff}.en-les.on i{background:#f2b632;color:#3a2600}.en-les.on small{color:#e3d6ff}.en-les.part{background:#7b55c7;border-color:#7b55c7}
.en-demo{display:inline-block;background:#f2b632;color:#3a2600;padding:10px 14px;border-radius:12px;text-decoration:none;font-weight:700}
.en-head{background:linear-gradient(115deg,#24124a,#4b2596 55%,#8a4fd8)!important}
.en-id{display:flex;align-items:center;gap:14px;margin:16px 0;background:linear-gradient(135deg,#f6f1ff,#fff8e6);border:1px solid #e7dcfa;border-radius:16px;padding:14px 16px}
.en-av{width:58px;height:58px;border-radius:16px;background:#f2b632;display:grid;place-items:center;font-size:30px}.en-id small{display:block;color:#7a6f96}.en-id b{display:block;font-size:22px;color:#24164a}.en-id span{color:#5b5274}
.en-pts{margin-inline-start:auto;text-align:center;background:#5b2fb3;color:#fff;border-radius:14px;padding:8px 16px}.en-pts b{display:block;font-size:26px;line-height:1.2;color:#fff!important}.en-pts span{font-size:12px;color:#f3e9ff!important}
.en-bdg{display:flex;flex-wrap:wrap;gap:8px}.en-bdg span{border:1px solid #e7dcfa;background:#fff;border-radius:999px;padding:4px 12px;font-weight:700}.en-bdg span.off{opacity:.35;filter:grayscale(1)}
.en-stars{color:#e0a106;letter-spacing:1px}
.en-cert{margin:18px 0;border:3px double #c98a07;border-radius:16px;padding:14px 18px;background:#fffbef;text-align:center}.en-cert b:first-child{font-size:20px;color:#8a5a00}.en-cert p{margin:6px 0 0}
.en-lines i{display:block;border-bottom:1px dashed #bbb;height:30px}
#reportDoc .rp+.rp{margin-top:18px}
@media print{#reportDoc .rp+.rp{break-before:page;page-break-before:always;margin-top:0}.en-head,.en-pts,.en-av,.en-id,.en-cert{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
@media(max-width:760px){.en-kpis{grid-template-columns:repeat(2,1fr)}.en-lessons{grid-template-columns:1fr 1fr}.en-les{grid-template-columns:28px 1fr;padding:8px;font-size:13px}}
body.tv-in[data-tv="enrich"] #panel>[data-view="enrich"]{display:block;animation:mzIn .28s ease both}`;document.head.appendChild(css);

/* ربط إعادة التحميل */
{const _r=reload;reload=async function(){await _r.apply(this,arguments);try{renderEnr()}catch(e){console.error(e)}}}
})();
