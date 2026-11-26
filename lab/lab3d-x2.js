/* =====================================================================
   المختبر الافتراضي الذكي — حزمة التجارب الجديدة (٢)
   ثاني متوسط ف١: القلب ومعدل النبض · هضم النشا · نموذج الرئتين
   ثاني متوسط ف٢: التوصيل الحراري · الصوت · انعكاس الضوء
   إعداد أ. علي البقاشي — مدرسة أبي الدرداء المتوسطة
   ===================================================================== */
(function(){
'use strict';
if(typeof THREE==='undefined'||typeof Lab==='undefined'||!window.P3X||!window.X3)return;
const {P3,G,gm,TestTube,Bubbles,Flame,setCol,$lc,sleep,hex6,clamp,show}=window.P3X;const {X}=window.X3;

/* =====================================================================
   ٧) القلب ومعدل النبض (ثاني متوسط · جهاز الدوران)
   ===================================================================== */
const HEART={};EXP_MODS.heart8=HEART;
HEART.init=function(){gm();
const ACT={rest:{n:'راحة (جلوس)',hr:72},walk:{n:'بعد المشي دقيقتين',hr:102},run:{n:'بعد الجري دقيقتين',hr:148}};
const S={act:'rest',hr:72,tgt:72,rec:false,recT:0,count:null,busy:false,log:[],sound:true,phase:0};P3.dbg.heart8=S;
const NAMES=['قِس النبض في الراحة','مارس نشاطًا ثم قِس','تابع العودة إلى الراحة','استنتج'];
const sec=P3.section('heart8',{title:'القلب ومعدل النبض',grade:'ثاني متوسط',lesson:'جهاز الدوران',
  hud:`<div class="p3-row">${X.m('معدل النبض','hrV',1)}${X.m('الحالة','hrA')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">النشاط:</span><button class="p3-b" data-a="act" data-v="rest" aria-pressed="true">🪑 راحة</button><button class="p3-b" data-a="act" data-v="walk">🚶 مشي</button><button class="p3-b" data-a="act" data-v="run">🏃 جري</button></div>
    <div class="p3-acts"><button class="p3-b pri" data-a="count">⏱ عُدّ النبض 15 ثانية</button><button class="p3-b" data-a="recov">🧘 توقّف واسترح</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="snd" aria-pressed="true">🔊 صوت القلب</button><button class="p3-b" data-a="reset">↺ إعادة</button></div>
    <p class="x-note ctN"></p></div>`,
  learn:`<div class="panel"><h3>القلب مضخة عضلية</h3><p>القلب عضلة تضخ الدم في الجسم، ويتكوّن من أربع حجرات: <b>أذينان</b> في الأعلى يستقبلان الدم، و<b>بطينان</b> في الأسفل يضخانه. يخرج الدم الغني بالأكسجين من البطين الأيسر عبر <b>الشريان الأورطي</b>، ويعود الدم الفقير بالأكسجين إلى الأذين الأيمن عبر <b>الوريدين الأجوفين</b>.</p></div>
    <div class="panel"><h3>لماذا يزداد النبض أثناء النشاط؟</h3><p>تحتاج العضلات أثناء النشاط إلى أكسجين وغذاء أكثر، فيزداد عدد ضربات القلب ليوصل الدم إليها بسرعة. وبعد التوقف يعود النبض تدريجيًا إلى معدله الطبيعي (60–100 نبضة في الدقيقة للبالغين).</p><p class="p3-eq">معدل النبض في الدقيقة = عدد النبضات في 15 ثانية × 4</p></div>`,
  quiz:[{q:'لماذا يزداد معدل النبض أثناء الجري؟',o:['لتوصيل أكسجين وغذاء أكثر إلى العضلات','لأن القلب يصغر','لتقليل تدفق الدم'],a:0},{q:'إذا عددت 20 نبضة في 15 ثانية فمعدل النبض في الدقيقة:',o:['35','80','60'],a:1},
        {q:'أي حجرات القلب تضخ الدم الغني بالأكسجين إلى الجسم؟',o:['الأذين الأيمن','البطين الأيسر','البطين الأيمن'],a:1},{q:'الوعاء الدموي الذي يخرج من البطين الأيسر إلى الجسم هو:',o:['الشريان الأورطي','الوريد الأجوف','الشريان الرئوي'],a:0}],
  report:()=>({title:'القلب ومعدل النبض',grade:'ثاني متوسط',lesson:'جهاز الدوران',cols:['الحالة','النبضات في 15 ثانية','معدل النبض في الدقيقة'],
    rows:S.log.length?S.log.map(r=>[r.n,String(r.c),String(r.c*4)]):[['','','']],note:'مثّل النتائج بالأعمدة البيانية، وفسّر تغيّر معدل النبض مع النشاط.'})
});
const L=new Lab(sec,{target:V(0,1.25,.4),dist:a=>Math.max(4.2,6.6/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* stand */
const ped=new THREE.Group();{const b=new THREE.Mesh(new THREE.CylinderGeometry(.45,.55,.12,40),KIT.phys(0x2b3036,{roughness:.3}));b.position.y=.06;const r=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.6,12),M.steel);r.position.y=.4;ped.add(b,r);castAll(ped);}
ped.position.set(0,0,.4);L.add(ped);
const H=new THREE.Group();H.position.set(0,1.32,.4);H.scale.setScalar(1.05);L.add(H);
const muscle=KIT.phys(0x8e1b16,{roughness:.5,clearcoat:.35});const muscleD=KIT.phys(0x641420,{roughness:.5,clearcoat:.3});
const prof=[];for(let i=0;i<=24;i++){const t=i/24;const r=.5*Math.pow(Math.sin(Math.PI*Math.min(1,t*1.05)),.9)*(t<.5?1:1-.35*(t-.5));prof.push(new THREE.Vector2(Math.max(.001,r),-.62+t*1.0));}
const vent=new THREE.Mesh(new THREE.LatheGeometry(prof,48),muscle);vent.rotation.z=.32;vent.scale.set(1,1,.82);H.add(vent);
const raA=new THREE.Mesh(new THREE.SphereGeometry(.27,32,24),muscleD);raA.position.set(-.3,.42,.05);raA.scale.set(1,.85,.85);H.add(raA);
const laA=new THREE.Mesh(new THREE.SphereGeometry(.24,32,24),muscle);laA.position.set(.28,.46,-.08);laA.scale.set(1,.85,.85);H.add(laA);
const tube=(pts,r,col)=>{const c=new THREE.CatmullRomCurve3(pts);const m=new THREE.Mesh(new THREE.TubeGeometry(c,64,r,16),KIT.phys(col,{roughness:.4,clearcoat:.5}));H.add(m);return c;};
const aortaC=tube([V(.06,.3,0),V(.08,.75,0),V(-.05,1.0,-.05),V(-.32,.95,-.12),V(-.42,.6,-.2),V(-.4,.1,-.3)],.11,0xb02a22);
const pulmC=tube([V(-.05,.32,.18),V(-.05,.68,.2),V(.2,.82,.12),V(.55,.78,.05)],.085,0x34489e);
const svcC=tube([V(-.38,1.1,.02),V(-.36,.8,.04),V(-.32,.52,.05)],.08,0x2c3f92);
const ivcC=tube([V(-.36,-.55,.0),V(-.38,-.1,.05),V(-.32,.3,.05)],.08,0x2c3f92);
[[V(.05,.25,.4),V(.25,-.05,.38),V(.12,-.4,.3)],[V(-.1,.25,.4),V(-.25,0,.36),V(-.2,-.35,.25)]].forEach(p=>{const c=new THREE.CatmullRomCurve3(p);H.add(new THREE.Mesh(new THREE.TubeGeometry(c,24,.018,8),KIT.mat(0xe0c070,{roughness:.6})));});
castAll(H);
/* blood particles */
const flows=[{c:aortaC,col:0xff3a2a,dir:1},{c:pulmC,col:0x5f78ff,dir:1},{c:svcC,col:0x4058e0,dir:1},{c:ivcC,col:0x4058e0,dir:1}];
const NB=26;flows.forEach(f=>{f.m=new THREE.InstancedMesh(new THREE.SphereGeometry(.035,8,6),new THREE.MeshStandardMaterial({color:$lc(f.col),emissive:$lc(f.col),emissiveIntensity:.5}),NB);f.u=Array.from({length:NB},(_,i)=>i/NB);H.add(f.m);});
const dO=new THREE.Object3D();
const lbl=[['البطين الأيسر',V(.3,-.15,.45)],['الأذين الأيمن',V(-.6,.45,.2)],['الشريان الأورطي',V(-.25,1.15,0)],['الوريد الأجوف',V(-.75,.95,0)],['الشريان الرئوي',V(.62,.9,.1)]].map(([t,p])=>({el:L.label(t,p.clone().multiplyScalar(1.05).add(H.position),'x-d'),p}));
/* ECG overlay */
const ov=X.ov(sec,'تخطيط القلب (ECG)',250,92);const ecg=new Float32Array(250);let ei=0;
function ecgVal(p){const g=(c,w,a)=>a*Math.exp(-Math.pow((p-c)/w,2));return g(.12,.03,.12)-g(.24,.008,.15)+g(.26,.012,1)-g(.29,.01,.25)+g(.5,.05,.28);}
function drawECG(){const {x,w,h}=ov;x.clearRect(0,0,w,h);x.strokeStyle='rgba(126,240,200,.12)';x.lineWidth=1;for(let i=0;i<w;i+=12){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke();}for(let j=0;j<h;j+=12){x.beginPath();x.moveTo(0,j);x.lineTo(w,j);x.stroke();}
  x.strokeStyle='#5effb2';x.lineWidth=2;x.beginPath();for(let i=0;i<w;i++){const v=ecg[(ei+i)%w];const y=h*.68-v*h*.55;i?x.lineTo(i,y):x.moveTo(i,y);}x.stroke();
  x.fillStyle='#fff';x.font='700 12px "IBM Plex Mono",monospace';x.textAlign='right';x.fillText(Math.round(S.hr)+' bpm',w-4,14);}
let lastBeat=0,acc=0;
P3.loop(L,(dt,t)=>{if(S.rec){S.recT+=dt*20;S.tgt=72+(S.peak-72)*Math.exp(-S.recT/70);}S.hr+=(S.tgt-S.hr)*Math.min(1,dt*.8);
  const bps=S.hr/60,p0=S.phase;S.phase+=dt*bps;if(S.phase>=1)S.phase-=1;const p=S.phase;const cross=(a)=>(p0<a&&p>=a)||(p0>p&&(p>=a||p0<a));
  if(cross(.27)){if(S.sound)P3.tone(58,.09,'sine',.18);if(S.counting){S.count++;X.txt(sec,'ctN','العدّ: '+S.count+' نبضة');}}if(cross(.58)&&S.sound)P3.tone(74,.07,'sine',.12);
  const sq=p>.26&&p<.6?Math.sin((p-.26)/.34*Math.PI):0;const at=p>.08&&p<.24?Math.sin((p-.08)/.16*Math.PI):0;
  vent.scale.set(1-.08*sq,1-.05*sq,.82*(1-.08*sq));raA.scale.set(1-.1*at,.85*(1-.1*at),.85*(1-.1*at));laA.scale.set(1-.1*at,.85*(1-.1*at),.85*(1-.1*at));
  const sp=.18*bps*(.6+.8*sq);flows.forEach(f=>{for(let i=0;i<NB;i++){f.u[i]=(f.u[i]+dt*sp)%1;const q=f.c.getPointAt(f.u[i]);dO.position.copy(q);dO.updateMatrix();f.m.setMatrixAt(i,dO.matrix);}f.m.instanceMatrix.needsUpdate=true;});
  acc+=dt;const step=1/90;while(acc>step){acc-=step;ecg[ei]=ecgVal(S.phase);ei=(ei+1)%ecg.length;}drawECG();
  X.txt(sec,'hrV',Math.round(S.hr)+' نبضة/د');X.txt(sec,'hrA',S.rec?'استراحة بعد '+ACT[S.act].n.replace('بعد ',''):ACT[S.act].n);});
function act(v){if(S.counting)return;S.act=v;S.rec=false;S.tgt=ACT[v].hr+(Math.random()*6-3);sec.$$('[data-a="act"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===v));toast(v==='rest'?'الطالب يجلس مرتاحًا.':'مارس الطالب '+(v==='walk'?'المشي':'الجري')+' دقيقتين: راقب سرعة دقات القلب وتدفق الدم.');render();}
async function count(){if(S.counting)return;await sleep(400);S.counting=true;S.count=0;sync();X.txt(sec,'ctN','العدّ: 0 نبضة');const hr0=S.hr;
  await new Promise(r=>{const t0=L.vt;const f=()=>{if(L.vt-t0>=15000)return r();requestAnimationFrame(f);};f();});
  S.counting=false;const n=S.count,name=S.rec?'استراحة بعد '+ACT[S.act].n.replace('بعد ','')+' ('+Math.round(S.recT/60)+' د)':ACT[S.act].n;
  S.log.push({n:name,c:n,act:S.act,rec:S.rec});X.txt(sec,'ctN',`عددت ${n} نبضة في 15 ثانية ← ${n} × 4 = ${n*4} نبضة في الدقيقة.`);P3.good();sync();renderNB();render();}
function recov(){if(S.act==='rest'){toast('اختر نشاطًا (مشي أو جري) أولًا.');return;}S.rec=true;S.recT=0;S.peak=S.hr;toast('توقّف الطالب ليستريح: راقب عودة النبض تدريجيًا.');render();}
function snd(b){S.sound=!S.sound;b.setAttribute('aria-pressed',S.sound);}
function reset(){if(S.counting)return;S.log=[];S.rec=false;act('rest');S.hr=72;X.txt(sec,'ctN','');renderNB();render();}
function stepIdx(){const has=a=>S.log.some(r=>r.act===a&&!r.rec);if(!has('rest'))return 0;if(!has('walk')&&!has('run'))return 1;if(!S.log.some(r=>r.rec))return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='قِس النبض في الراحة';html=`<p class="p3-txt">الطالب جالس مرتاحًا. اضغط «عُدّ النبض 15 ثانية» واستمع لدقات القلب، ثم اضرب العدد في 4.</p>`;}
  else if(k===1){title='مارس نشاطًا ثم قِس';html=`<p class="p3-txt">اختر «مشي» أو «جري» وراقب تسارع الضربات وتدفق الدم في الأوعية، ثم عُدّ النبض مرة أخرى.</p>`;}
  else if(k===2){title='تابع العودة إلى الراحة';html=`<p class="p3-txt">اضغط «توقّف واسترح» ثم قِس النبض مرة أو مرتين لترى كيف يعود إلى معدله الطبيعي.</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">يزداد معدل النبض مع زيادة النشاط لأن العضلات تحتاج أكسجينًا وغذاءً أكثر، فيضخ القلب الدم أسرع. وبعد التوقف يعود النبض تدريجيًا إلى معدل الراحة.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>الحالة</th><th>في 15 ث</th><th>في الدقيقة</th></tr></thead><tbody>${S.log.length?S.log.map(r=>`<tr><td>${r.n}</td><td class="n">${r.c}</td><td class="n"><b>${r.c*4}</b></td></tr>`).join(''):'<tr><td colspan="3">—</td></tr>'}</tbody></table>`;}
function sync(){sec.$('[data-a="count"]').disabled=!!S.counting;}
X.side(sec,{act:b=>act(b.dataset.v),count,recov,snd,reset});
render();renderNB();
};

/* =====================================================================
   ٨) هضم النشا بإنزيم اللعاب (ثاني متوسط · الجهاز الهضمي والمواد الغذائية)
   ===================================================================== */
const STAR={};EXP_MODS.starch8=STAR;
STAR.init=function(){gm();
const TB=[{k:'A',n:'نشا + لعاب',c:'37°C',tau:2.4},{k:'B',n:'نشا + ماء',c:'37°C',tau:1e9},{k:'C',n:'نشا + لعاب',c:'في الثلج 4°C',tau:30},{k:'D',n:'نشا + لعاب مغلي',c:'37°C',tau:1e9}];
const S={started:false,t:0,col:0,res:{},busy:false};P3.dbg.starch8=S;
const NAMES=['أضف اللعاب والماء','اختبر باليود كل دقيقتين','قارن الأنابيب','استنتج'];
const IOD=f=>f>.6?{h:0x1b1844,n:'أزرق داكن'}:f>.25?{h:0x4a2a3a,n:'بني داكن'}:{h:0xc98a2c,n:'بني مصفر'};
const sec=P3.section('starch8',{title:'هضم النشا بإنزيم اللعاب',grade:'ثاني متوسط',lesson:'الجهاز الهضمي والمواد الغذائية',
  hud:`<div class="p3-row">${X.m('الزمن','stT',1)}${X.m('الاختبارات','stN')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <p class="x-note">في كل أنبوب 5 mL من محلول النشا. محلول اليود البني يتحوّل إلى <b>أزرق داكن</b> بوجود النشا.</p>
    <div class="p3-acts"><button class="p3-b pri" data-a="start">💧 أضف اللعاب والماء وابدأ</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="test">🧪 اختبر عيّنات باليود</button><button class="p3-b" data-a="wait">⏩ انتظر دقيقتين</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>الهضم الكيميائي في الفم</h3><p>يحتوي اللعاب على إنزيم <b>الأميليز</b> الذي يحلّل النشا (جزيئات كبيرة) إلى سكريات بسيطة صغيرة. ويبدأ الهضم الكيميائي للكربوهيدرات في الفم.</p></div>
    <div class="panel"><h3>الإنزيمات والحرارة</h3><p>يعمل إنزيم اللعاب أفضل ما يمكن عند درجة حرارة الجسم (37°C)، ويبطؤ عمله كثيرًا في البرودة، ويتلف بالغليان فلا يعود يعمل.</p><p class="p3-eq">نشا + يود ← أزرق داكن · سكر + يود ← بني مصفر</p></div>`,
  quiz:[{q:'ما الإنزيم الموجود في اللعاب الذي يهضم النشا؟',o:['الأميليز','البيبسين','الليبيز'],a:0},{q:'لماذا بقي لون الأنبوب B أزرق داكنًا طوال التجربة؟',o:['لعدم وجود إنزيم يهضم النشا','لأن حرارته منخفضة','لأن النشا تحوّل إلى سكر'],a:0},
        {q:'لماذا لم يُهضم النشا في الأنبوب D؟',o:['لأن الغليان أتلف الإنزيم','لأن الماء كثير','لأن الإنزيم يعمل أسرع'],a:0},{q:'أي الأنابيب يمثّل المجموعة الضابطة؟',o:['A','B','C'],a:1}],
  report:()=>({title:'هضم النشا بإنزيم اللعاب',grade:'ثاني متوسط',lesson:'الجهاز الهضمي والمواد الغذائية',cols:['الأنبوب','المحتوى',...Array.from({length:S.col},(_,i)=>(i*2)+' د')],
    rows:TB.map(t=>[t.k,t.n+' ('+t.c+')',...Array.from({length:S.col},(_,i)=>S.res[t.k+i]||'')]),note:'في أي الأنابيب هُضم النشا؟ وما أثر درجة الحرارة والغليان في عمل الإنزيم؟'})
});
const L=new Lab(sec,{target:V(0,.6,.55),dist:a=>Math.max(4,6.4/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* water bath (37) and ice bath */
const bath=X.vessel(.82,.8,{level:.55,col:0xd8ecf4,op:.32});bath.g.position.set(-.55,0,.25);L.add(bath.g);
const ice=X.vessel(.42,.8,{level:.55,col:0xe2f2fa,op:.35});ice.g.position.set(1.15,0,.25);L.add(ice.g);
{const im=new THREE.InstancedMesh(RBox(.12,.12,.12,.025),new THREE.MeshPhysicalMaterial({color:0xe6f5ff,roughness:.1,transparent:true,opacity:.75,clearcoat:1}),14);const d=new THREE.Object3D();
  for(let i=0;i<14;i++){const a=i*2.3,r=.12+(i%3)*.08;d.position.set(1.15+Math.cos(a)*r,.5+Math.random()*.08,.25+Math.sin(a)*r);d.rotation.set(Math.random()*2,Math.random()*2,0);d.updateMatrix();im.setMatrixAt(i,d.matrix);}L.add(im);}
const th=KIT.lcd(.42,.15,'#ffd27a','#1a1408');th.m.position.set(-.55,.95,.9);L.add(th.m);th.set('37.0°C');const th2=KIT.lcd(.42,.15,'#9fe0ff','#081620');th2.m.position.set(1.15,.95,.7);L.add(th2.m);th2.set('4.0°C');
const T={};
TB.forEach((t,i)=>{const tt=TestTube(.1,.95);const x=t.k==='C'?1.15:-.95+i*.32+(i>1?-.32:0);const xx=t.k==='D'?-.95+2*.32:x;tt.g.position.set(t.k==='C'?1.15:xx,.12,.25);tt.seg(0,.36);setCol(tt.lm,0xf2f0e6);tt.lm.opacity=.7;L.add(tt.g);
  const card=P3.card([{t:t.k,s:150}],.2,.2,t.k==='A'?{}:{bd:'#8a3b2a'});card.position.set(t.k==='C'?1.15:xx,1.25,.25);L.add(card);
  T[t.k]={t,tt,f:1,x:t.k==='C'?1.15:xx};});
/* spotting tile */
const tile=new THREE.Group();{const b=new THREE.Mesh(RBox(2.0,.06,.95,.03),KIT.phys(0xfbfbf8,{roughness:.25}));b.position.y=.03;tile.add(b);}
tile.position.set(0,0,1.55);L.add(tile);
const wells={};const wellMat=()=>new THREE.MeshStandardMaterial({color:$lc(0xf2f2ee),roughness:.3});
TB.forEach((t,r)=>{for(let c=0;c<6;c++){const w=new THREE.Mesh(new THREE.CylinderGeometry(.09,.07,.02,24),wellMat());w.position.set(-.8+c*.32,.065,-.33+r*.22);tile.add(w);wells[t.k+c]=w;}
  const lb=P3.card([{t:t.k,s:80}],.12,.12);lb.rotation.x=-Math.PI/2;lb.position.set(-1.0+.0,.066,-.33+r*.22);lb.position.x=.95;tile.add(lb);});
for(let c=0;c<6;c++){const lb=P3.card([{t:(c*2)+' د',s:64}],.22,.11,{bd:'#fffdf6'});lb.rotation.x=-Math.PI/2;lb.position.set(-.8+c*.32,.066,.42);tile.add(lb);}
/* dropper */
const drop=new THREE.Group();{const g=new THREE.Mesh(new THREE.CylinderGeometry(.025,.012,.45,12),G.glassT);g.position.y=.22;const b=new THREE.Mesh(new THREE.SphereGeometry(.05,14,10),G.rubber);b.scale.y=1.4;b.position.y=.5;drop.add(g,b);}
const DH=V(-1.35,.4,1.45);drop.position.copy(DH);L.add(drop);
const iod=X.vessel(.13,.3,{level:.22,col:0xa35a1c,op:.85});iod.g.position.set(-1.35,0,1.25);L.add(iod.g);
function frac(k,t){return Math.exp(-t/T[k].t.tau);}
async function start(){if(S.started||S.busy)return;S.busy=true;sync();for(const k of ['A','B','C','D']){const o=T[k];await L.arc(drop,V(o.x,1.35,.25),550,1.5);await L.tw(350,q=>o.tt.seg(0,.36+.1*q));P3.tone(700,.05,'triangle',.04);}
  await L.arc(drop,DH,500,1.5);S.started=true;S.busy=false;toast('أُضيف اللعاب إلى A وC وD (مغليًا في D)، والماء إلى B. اختبر العيّنات الآن عند الدقيقة 0.');sync();render();}
async function test(){if(!S.started||S.busy)return;if(S.col>=6){toast('امتلأ لوح التنقيط (حتى الدقيقة 10).');return;}if(S.col>Math.round(S.t/2)){toast('اختبرت هذه الدقيقة؛ انتظر دقيقتين ثم اختبر.');return;}S.busy=true;sync();
  const c=S.col;L.focus(V(0,2.6,3.4),V(0,.3,1.4),800);
  for(const k of ['A','B','C','D']){const o=T[k],w=wells[k+c];await L.arc(drop,V(o.x,1.3,.25),420,1.5);await L.move(drop,V(o.x,.85,.25),200);await L.move(drop,V(o.x,1.3,.25),200);
    const wp=w.getWorldPosition(new THREE.Vector3());await L.arc(drop,V(wp.x,.42,wp.z),420,1.4);
    const f=frac(k,S.t),r=IOD(f);const c0=$lc(0xa35a1c),c1=$lc(r.h);await L.tw(500,q=>w.material.color.copy(c0).lerp(c1,q));S.res[k+c]=r.n;P3.click();}
  await L.arc(drop,DH,400,1.4);S.col++;S.busy=false;L.home(900);sync();renderNB();render();}
async function wait(){if(!S.started||S.busy)return;if(S.t>=10){toast('انتهى زمن التجربة (10 دقائق).');return;}S.busy=true;sync();const t0=S.t;
  await L.tw(1600,q=>{S.t=t0+2*q;X.txt(sec,'stT',S.t.toFixed(1)+' دقيقة');TB.forEach(t=>{const f=frac(t.k,S.t);setCol(T[t.k].tt.lm,new THREE.Color(0xf2f0e6).lerp(new THREE.Color(0xf6f8fa),1-f).getHex());T[t.k].tt.lm.opacity=.45+.25*f;});});
  S.t=t0+2;S.busy=false;sync();render();}
function reset(){if(S.busy)return;S.started=false;S.t=0;S.col=0;S.res={};Object.values(wells).forEach(w=>w.material.color.copy($lc(0xf2f2ee)));TB.forEach(t=>{T[t.k].tt.seg(0,.36);setCol(T[t.k].tt.lm,0xf2f0e6);T[t.k].tt.lm.opacity=.7;});X.txt(sec,'stT','0.0 دقيقة');sync();renderNB();render();}
function stepIdx(){if(!S.started)return 0;if(S.col<3)return 1;if(S.col<5)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='جهّز الأنابيب';html=`<p class="p3-txt">A: نشا + لعاب (37°C) · B: نشا + ماء (37°C) · C: نشا + لعاب في الثلج · D: نشا + لعاب مغلي (37°C). اضغط «أضف اللعاب والماء وابدأ».</p>`;}
  else if(k===1){title='اختبر باليود كل دقيقتين';html=`<p class="p3-txt">اختبر عيّنة من كل أنبوب على لوح التنقيط، ثم «انتظر دقيقتين» واختبر مرة أخرى. اللون الأزرق الداكن يعني وجود النشا.</p>`;}
  else if(k===2){title='قارن الأنابيب';html=`<p class="p3-txt">في أي الأنابيب اختفى اللون الأزرق الداكن أولًا؟ وفي أيها بقي؟ تابع حتى الدقيقة 8 أو 10.</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">هُضم النشا بسرعة في الأنبوب A فقط (لعاب عند 37°C)، وببطء شديد في C (البرودة تبطئ الإنزيم)، ولم يُهضم في B (لا إنزيم) ولا في D (الغليان أتلف الإنزيم).</p>`;}
  sec.steps(NAMES,k,title,html);X.txt(sec,'stN',S.col+' / 6');}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>الأنبوب</th>${Array.from({length:Math.max(1,S.col)},(_,i)=>`<th>${i*2} د</th>`).join('')}</tr></thead><tbody>${TB.map(t=>`<tr><td><b>${t.k}</b></td>${Array.from({length:Math.max(1,S.col)},(_,i)=>{const v=S.res[t.k+i];return `<td>${v?`<span class="p3-sw" style="background:${hex6(v==='أزرق داكن'?0x1b1844:v==='بني داكن'?0x4a2a3a:0xc98a2c)}"></span>`:''}${v||'—'}</td>`;}).join('')}</tr>`).join('')}</tbody></table>`;}
function sync(){const b=S.busy;sec.$('[data-a="start"]').disabled=b||S.started;sec.$('[data-a="start"]').classList.toggle('done',S.started);['test','wait'].forEach(a=>sec.$(`[data-a="${a}"]`).disabled=b||!S.started);sec.$('[data-a="reset"]').disabled=b;}
X.side(sec,{start,test,wait,reset});X.txt(sec,'stT','0.0 دقيقة');
sync();render();renderNB();
};

/* =====================================================================
   ٩) نموذج الرئتين وآلية التنفس (ثاني متوسط · جهازا التنفس والإخراج)
   ===================================================================== */
const LUNG={};EXP_MODS.lung8=LUNG;
LUNG.init=function(){gm();
const S={pull:0,tgt:0,vel:0,auto:false,rate:15,ph:0,seenIn:false,seenOut:false,log:[]};P3.dbg.lung8=S;
const NAMES=['اسحب الغشاء لأسفل','ادفع الغشاء لأعلى','شغّل التنفس المستمر','استنتج'];
const sec=P3.section('lung8',{title:'نموذج الرئتين وآلية التنفس',grade:'ثاني متوسط',lesson:'جهازا التنفس والإخراج',
  hud:`<div class="p3-row">${X.m('الضغط داخل الرئتين','lgP')}${X.m('حجم الهواء في الرئتين','lgV',1)}</div><div class="p3-row">${X.m('الحالة','lgS',1)}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    ${X.rng('سحب الغشاء المطاطي (الحجاب الحاجز)','lgR',0,100,1,0,'%')}
    <div class="p3-acts"><button class="p3-b" data-a="in">⬇ اسحب (شهيق)</button><button class="p3-b" data-a="out">⬆ ادفع (زفير)</button></div>
    <div class="p3-acts"><button class="p3-b pri" data-a="auto">🫁 تنفّس مستمر</button><span class="p3-lab">المعدل:</span><button class="p3-b" data-a="rate" data-v="15" aria-pressed="true">15/د</button><button class="p3-b" data-a="rate" data-v="30">30/د</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>كيف نتنفس؟</h3><p><b>الشهيق:</b> ينقبض الحجاب الحاجز ويتحرك إلى أسفل فيزداد حجم التجويف الصدري ويقل الضغط داخله عن الضغط الجوي، فيندفع الهواء إلى الرئتين.</p>
    <p><b>الزفير:</b> ينبسط الحجاب الحاجز ويرتفع إلى أعلى فيقل حجم التجويف الصدري ويزداد الضغط داخله، فيخرج الهواء من الرئتين.</p></div>
    <div class="panel"><h3>أجزاء النموذج</h3><p>الناقوس = القفص الصدري · الأنبوب = القصبة الهوائية · الفرعان = الشعبتان الهوائيتان · البالونان = الرئتان · الغشاء المطاطي = الحجاب الحاجز.</p></div>`,
  quiz:[{q:'عند سحب الغشاء المطاطي إلى أسفل فإن البالونين:',o:['ينتفخان','ينكمشان','لا يتغيران'],a:0},{q:'ماذا يمثّل الغشاء المطاطي في النموذج؟',o:['الرئتين','الحجاب الحاجز','القصبة الهوائية'],a:1},
        {q:'يدخل الهواء إلى الرئتين لأن الضغط داخلهما يصبح:',o:['أكبر من الضغط الجوي','أقل من الضغط الجوي','مساويًا للصفر'],a:1},{q:'في الزفير يتحرك الحجاب الحاجز:',o:['إلى أسفل','إلى أعلى','إلى الجانبين فقط'],a:1}],
  report:()=>({title:'نموذج الرئتين وآلية التنفس',grade:'ثاني متوسط',lesson:'جهازا التنفس والإخراج',cols:['حركة الغشاء','حجم التجويف','الضغط داخل الرئتين','البالونان','حركة الهواء'],
    rows:S.log.length?S.log.map(r=>[r.m,r.v,r.p,r.b,r.a]):[['','','','','']],note:'قارن بين الشهيق والزفير من حيث حركة الحجاب الحاجز والضغط وحركة الهواء.'})
});
const L=new Lab(sec,{target:V(0,1.05,.4),dist:a=>Math.max(4.4,6.8/a),exposure:.95});buildRoom(L);L.controls.minPolarAngle=.9;
const toast=m=>L.toast(m);
/* bell jar on ring stand */
const JY=.55,JR=.72,JH=1.35;
const pts=[];for(let i=0;i<=20;i++){const t=i/20;const r=t<.75?JR:JR*Math.cos((t-.75)/.25*Math.PI/2*.92);const y=t<.75?t/.75*JH*.78:JH*.78+Math.sin((t-.75)/.25*Math.PI/2)*JH*.22;pts.push(new THREE.Vector2(Math.max(.09,r),y));}
const jar=new THREE.Mesh(new THREE.LatheGeometry(pts,64),G.glassT);jar.renderOrder=5;jar.position.set(0,JY,.4);L.add(jar);
const neck=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.1,24,1,true),G.glassT);neck.position.set(0,JY+JH+.04,.4);L.add(neck);
const stp=new THREE.Mesh(new THREE.CylinderGeometry(.13,.1,.16,24),G.rubber);stp.position.set(0,JY+JH+.12,.4);castAll(stp);L.add(stp);
const ring=new THREE.Mesh(new THREE.TorusGeometry(JR+.03,.035,10,64),M.steel);ring.rotation.x=Math.PI/2;ring.position.set(0,JY,.4);L.add(ring);
[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([a,b])=>{const leg=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,JY,10),M.steel);leg.position.set(a*.55,JY/2,.4+b*.55);castAll(leg);L.add(leg);});
/* Y tube */
const tg=G.glassS;const tubeM=(a,b,r=.035)=>{const d=b.clone().sub(a);const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),14),tg);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());L.add(m);return m;};
const top=V(0,JY+JH+.45,.4),fork=V(0,JY+JH-.35,.4),lE=V(-.28,JY+JH-.62,.4),rE=V(.28,JY+JH-.62,.4);tubeM(top,fork);tubeM(fork,lE);tubeM(fork,rE);
/* balloons */
const balM=KIT.phys(0xe0607a,{roughness:.35,clearcoat:.7,transparent:true,opacity:.92});
const mkB=(p)=>{const b=new THREE.Mesh(new THREE.SphereGeometry(1,40,28),balM);b.position.copy(p);L.add(b);return b;};
const bL=mkB(lE),bR=mkB(rE);
/* rubber diaphragm (deformable disc) */
const dg=new THREE.CircleGeometry(JR+.02,48,0,Math.PI*2);dg.rotateX(-Math.PI/2);const base=Float32Array.from(dg.attributes.position.array);
const dia=new THREE.Mesh(dg,KIT.phys(0xd8892e,{roughness:.6,side:THREE.DoubleSide}));dia.position.set(0,JY,.4);L.add(dia);
const knob=new THREE.Group();{const s=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.25,10),KIT.mat(0x333333));s.position.y=-.12;const k=new THREE.Mesh(new THREE.SphereGeometry(.07,16,12),KIT.mat(0xe0703f));k.position.y=-.27;knob.add(s,k);castAll(knob);}
L.add(knob);
/* air particles */
const NA=40,ap=new Float32Array(NA*3),au=Array.from({length:NA},()=>Math.random());const ag=new THREE.BufferGeometry();ag.setAttribute('position',new THREE.BufferAttribute(ap,3));
const am=new THREE.PointsMaterial({color:0x6fc3ff,size:.06,map:P3.glowTex(),transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});const air=new THREE.Points(ag,am);air.frustumCulled=false;L.scene.add(air);
const path=new THREE.CatmullRomCurve3([V(0,JY+JH+1.0,.4),top,fork,lE]);const path2=new THREE.CatmullRomCurve3([V(0,JY+JH+1.0,.4),top,fork,rE]);
[['القصبة الهوائية',V(.32,JY+JH+.3,.45)],['الشعبتان الهوائيتان',V(-.55,JY+JH-.42,.45)],['الرئتان (البالونان)',V(.75,JY+JH-.85,.45)],['الحجاب الحاجز',V(.95,JY-.05,.5)],['القفص الصدري',V(-.95,JY+.6,.45)]].forEach(([t,p])=>L.label(t,p,'x-d'));
let prev=0,lv=0;
P3.loop(L,(dt,t)=>{if(S.auto){S.ph+=dt*S.rate/60;S.tgt=50-50*Math.cos(S.ph*2*Math.PI);}
  const old=S.pull;S.pull+=(S.tgt-S.pull)*Math.min(1,dt*4);S.vel=(S.pull-old)/Math.max(dt,1e-3);
  const d=S.pull/100*.32;const p=dg.attributes.position.array;for(let i=0;i<p.length;i+=3){const x=base[i],z=base[i+2];const r2=(x*x+z*z)/((JR+.02)*(JR+.02));p[i+1]=-d*(1-r2);}dg.attributes.position.needsUpdate=true;dg.computeVertexNormals();
  knob.position.set(0,JY-d,.4);
  lv+=(S.pull-lv)*Math.min(1,dt*3.2);const flow=(S.pull-lv);const rs=.13+.17*(lv/100);bL.scale.set(rs,rs*1.15,rs);bR.scale.set(rs,rs*1.15,rs);bL.position.copy(lE).add(V(-rs*.35,-rs*.9,0));bR.position.copy(rE).add(V(rs*.35,-rs*.9,0));
  const P=101.3-flow*.012;X.txt(sec,'lgP',P.toFixed(2)+' kPa');X.txt(sec,'lgV',Math.round(500+lv*25)+' mL');const st=flow>.8?'شهيق: يدخل الهواء':flow<-.8?'زفير: يخرج الهواء':'سكون';X.txt(sec,'lgS',st);
  if(flow>3&&!S.seenIn){S.seenIn=true;S.log.push({m:'إلى أسفل',v:'يزداد',p:'يقل عن الضغط الجوي',b:'ينتفخان',a:'يدخل الرئتين'});P3.good();toast('شهيق! زاد حجم التجويف فقلّ الضغط داخله، فاندفع الهواء إلى البالونين.');renderNB();render();}
  if(flow<-3&&S.seenIn&&!S.seenOut){S.seenOut=true;S.log.push({m:'إلى أعلى',v:'يقل',p:'يزيد على الضغط الجوي',b:'ينكمشان',a:'يخرج من الرئتين'});P3.good();toast('زفير! قلّ حجم التجويف فزاد الضغط، فخرج الهواء من البالونين.');renderNB();render();}
  am.opacity=Math.min(.9,Math.abs(flow)*.12);const dir=Math.sign(flow)||1;for(let i=0;i<NA;i++){au[i]=(au[i]+dt*.5*dir+1)%1;const q=(i%2?path:path2).getPointAt(au[i]);ap[i*3]=q.x+(Math.sin(i*7)*.015);ap[i*3+1]=q.y;ap[i*3+2]=q.z+(Math.cos(i*5)*.015);}ag.attributes.position.needsUpdate=true;
  if(!S.auto){sec.$('#lgR').value=Math.round(S.tgt);sec.$('#lgR-o').textContent=Math.round(S.tgt)+'%';}});
function setP(v){S.auto=false;S.tgt=v;syncA();render();}
function auto(){S.auto=!S.auto;if(S.auto){S.ph=Math.acos(clamp(1-S.pull/50,-1,1))/(2*Math.PI);}syncA();render();}
function rate(v){S.rate=v;sec.$$('[data-a="rate"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));}
function syncA(){sec.$('[data-a="auto"]').textContent=S.auto?'⏸ أوقف التنفس':'🫁 تنفّس مستمر';sec.$('[data-a="auto"]').setAttribute('aria-pressed',S.auto);}
function reset(){S.auto=false;S.tgt=0;S.seenIn=false;S.seenOut=false;S.log=[];syncA();renderNB();render();}
function stepIdx(){if(!S.seenIn)return 0;if(!S.seenOut)return 1;if(!S.autoUsed)return 2;return 3;}
function render(){if(S.auto)S.autoUsed=true;const k=stepIdx();let title,html;
  if(k===0){title='اسحب الغشاء لأسفل';html=`<p class="p3-txt">اسحب الغشاء المطاطي (الحجاب الحاجز) إلى أسفل باستخدام الشريط أو زر «اسحب». راقب البالونين والضغط داخل الرئتين.</p>`;}
  else if(k===1){title='ادفع الغشاء لأعلى';html=`<p class="p3-txt">الآن ادفع الغشاء إلى أعلى. ماذا يحدث للبالونين وللهواء؟</p>`;}
  else if(k===2){title='شغّل التنفس المستمر';html=`<p class="p3-txt">شغّل «تنفّس مستمر» وقارن بين معدل 15 و30 مرة في الدقيقة (مثل الراحة والنشاط).</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">عندما يتحرك الحجاب الحاجز إلى أسفل يزداد حجم التجويف الصدري ويقل الضغط داخله فيدخل الهواء (شهيق)، وعندما يرتفع يقل الحجم ويزداد الضغط فيخرج الهواء (زفير).</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>الغشاء</th><th>الحجم</th><th>الضغط</th><th>البالونان</th><th>الهواء</th></tr></thead><tbody>${S.log.length?S.log.map(r=>`<tr><td>${r.m}</td><td>${r.v}</td><td>${r.p}</td><td>${r.b}</td><td>${r.a}</td></tr>`).join(''):'<tr><td colspan="5">—</td></tr>'}</tbody></table>`;}
X.side(sec,{in:()=>setP(100),out:()=>setP(0),auto,rate:b=>rate(+b.dataset.v),reset});
sec.$('#lgR').addEventListener('input',e=>setP(+e.target.value));
render();renderNB();
};

/* =====================================================================
   ١٠) انتقال الحرارة بالتوصيل في الفلزات (ثاني متوسط · انتقال الحرارة)
   ===================================================================== */
const COND={};EXP_MODS.cond8=COND;
COND.init=function(){gm();
const RODS=[{k:'cu',n:'نحاس',a:1.11e-4,col:0xc8794a,met:.85},{k:'al',n:'ألومنيوم',a:9.7e-5,col:0xc5ccd2,met:.8},{k:'fe',n:'حديد',a:2.3e-5,col:0x7d858b,met:.75},{k:'gl',n:'زجاج',a:3.4e-7,col:0xdfeef0,met:0}];
const N=40,LEN=.2,dx=LEN/(N-1),BEADS=[.3,.6,.9,1.2,1.5],RL=1.6,MELT=60;
const S={on:false,t:0,Tb:25,ts:30,thermal:false,drop:{},busy:false};P3.dbg.cond8=S;
const NAMES=['أشعل اللهب','راقب سقوط كرات الشمع','استخدم الكاميرا الحرارية','رتّب الموصلات'];
const sec=P3.section('cond8',{title:'انتقال الحرارة بالتوصيل في الفلزات',grade:'ثاني متوسط',lesson:'انتقال الحرارة',
  hud:`<div class="p3-row">${X.m('الزمن','cT',1)}${X.m('حرارة الكتلة الوسطى','cB')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <p class="x-note">أربعة قضبان متساوية الطول تتصل بكتلة نحاسية في الوسط، وعلى كل قضيب خمس كرات من الشمع تنصهر عند 60°C.</p>
    <div class="p3-acts"><button class="p3-b pri" data-a="fire">🔥 أشعل اللهب</button><button class="p3-b" data-a="thermal" aria-pressed="false">🌡 الكاميرا الحرارية</button></div>
    <div class="p3-acts"><span class="p3-lab">تسريع الزمن:</span><button class="p3-b" data-a="ts" data-v="10">×10</button><button class="p3-b" data-a="ts" data-v="30" aria-pressed="true">×30</button><button class="p3-b" data-a="ts" data-v="90">×90</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>التوصيل الحراري</h3><p>التوصيل انتقال الطاقة الحرارية عبر المادة بتصادم جسيماتها دون أن تنتقل المادة نفسها. وتختلف المواد في قدرتها على التوصيل.</p>
    <p>الفلزات مثل النحاس والألومنيوم <b>موصلات جيدة</b> للحرارة، أما الزجاج والخشب والبلاستيك فهي <b>عوازل</b>.</p></div>
    <div class="panel"><h3>تطبيقات</h3><p>تُصنع قواعد أواني الطبخ من النحاس أو الألومنيوم لتوصيل الحرارة بسرعة، وتُصنع مقابضها من البلاستيك أو الخشب العازل.</p></div>`,
  quiz:[{q:'في أي القضبان سقطت كرات الشمع أولًا؟',o:['الزجاج','النحاس','الحديد'],a:1},{q:'الزجاج يُعد:',o:['موصلًا جيدًا للحرارة','عازلًا للحرارة','فلزًا'],a:1},
        {q:'انتقال الحرارة عبر قضيب فلزي يسمى:',o:['حملًا','توصيلًا','إشعاعًا'],a:1},{q:'لماذا تُصنع مقابض أواني الطبخ من البلاستيك؟',o:['لأنه موصل جيد','لأنه عازل للحرارة','لأنه أثقل'],a:1}],
  report:()=>({title:'انتقال الحرارة بالتوصيل',grade:'ثاني متوسط',lesson:'انتقال الحرارة',cols:['القضيب','الكرة 1 (ث)','الكرة 2 (ث)','الكرة 3 (ث)','الكرة 4 (ث)','الكرة 5 (ث)'],
    rows:RODS.map(r=>[r.n,...BEADS.map((_,i)=>S.drop[r.k+i]!=null?String(Math.round(S.drop[r.k+i])):'')]),note:'رتّب المواد من الأفضل توصيلًا للحرارة إلى الأقل.'})
});
const L=new Lab(sec,{target:V(0,.7,.4),dist:a=>Math.max(4.8,7.6/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* tripod + block + burner */
const trip=new THREE.Group();{[0,1,2].forEach(i=>{const a=i*2.094+.5;const l=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1.0,10),M.steel);l.position.set(Math.cos(a)*.28,.48,Math.sin(a)*.28);l.rotation.set(Math.sin(a)*.2,0,-Math.cos(a)*.2);trip.add(l);});
  const r=new THREE.Mesh(new THREE.TorusGeometry(.2,.025,8,32),M.steel);r.rotation.x=Math.PI/2;r.position.y=.96;trip.add(r);castAll(trip);}
trip.position.set(0,0,.4);L.add(trip);
const blk=new THREE.Mesh(RBox(.36,.22,.36,.03),KIT.mat(0xc8794a,{metalness:.85,roughness:.35}));blk.position.set(0,1.08,.4);castAll(blk);L.add(blk);
const bn=KIT.burner();bn.g.position.set(0,0,.4);bn.g.scale.setScalar(1.2);L.add(bn.g);const fl=Flame({s:.9});fl.S.air=1;fl.g.position.set(0,.78,.4);L.scene.add(fl.g);
/* rods */
const heat=t=>{const k=clamp((t-20)/330,0,1);const st=[[0,[20,30,110]],[.25,[80,40,200]],[.45,[210,40,120]],[.65,[250,120,30]],[.85,[255,220,60]],[1,[255,255,230]]];for(let i=0;i<st.length-1;i++){if(k<=st[i+1][0]){const u=(k-st[i][0])/(st[i+1][0]-st[i][0]);return st[i][1].map((c,j)=>c+(st[i+1][1][j]-c)*u);}}return [255,255,230];};
const R={};const DIRS=[V(1,0,0),V(-1,0,0),V(0,0,1),V(0,0,-1)];
RODS.forEach((r,i)=>{const d=DIRS[i];const T=new Float32Array(N).fill(25);
  const tex=new THREE.DataTexture(new Uint8Array(N*4),N,1,THREE.RGBAFormat);tex.needsUpdate=true;tex.magFilter=THREE.LinearFilter;
  const mN=r.k==='gl'?new THREE.MeshPhysicalMaterial({color:$lc(r.col),roughness:.05,transparent:true,opacity:.6,clearcoat:1}):KIT.mat(r.col,{metalness:r.met,roughness:.3});if(r.k!=='gl')mN.color.convertSRGBToLinear();
  const mT=new THREE.MeshBasicMaterial({map:tex});
  const geo=new THREE.CylinderGeometry(.045,.045,RL,20,1);geo.rotateZ(-Math.PI/2);/* uv.x along length after rotation: map u by vertex x */
  {const pos=geo.attributes.position,uv=geo.attributes.uv;for(let j=0;j<pos.count;j++)uv.setXY(j,(pos.getX(j)+RL/2)/RL,.5);uv.needsUpdate=true;}
  const m=new THREE.Mesh(geo,mN);m.castShadow=true;const g=new THREE.Group();g.add(m);m.position.x=.18+RL/2;g.position.set(0,1.08,.4);g.rotation.y=Math.atan2(-d.z,d.x);L.scene.add(g);
  const sup=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,1.05,8),M.steel);sup.position.set(d.x*(1.75),.53,.4+d.z*1.75);L.add(sup);
  const beads=BEADS.map((p,j)=>{const b=new THREE.Mesh(new THREE.SphereGeometry(.06,16,12),KIT.mat(0xf2d27a,{roughness:.55}));b.castShadow=true;const pos=V(.18+p,1.08-.095,.4);const wp=V(d.x*(.18+p),1.08-.095,.4+d.z*(.18+p));b.position.copy(wp);L.add(b);return {b,home:wp.clone(),fall:false,vy:0,done:false};});
  const card=P3.card([{t:r.n,s:70}],.42,.16);card.position.set(d.x*2.05,.16,.4+d.z*2.05);card.rotation.x=-1.0;if(d.z<0){card.position.set(d.x*2.05+.45,.16,.4+d.z*1.6);}L.add(card);
  R[r.k]={r,T,tex,m,mN,mT,beads};});
function texUpd(o){const d=o.tex.image.data;for(let i=0;i<N;i++){const c=heat(o.T[i]);d[i*4]=c[0];d[i*4+1]=c[1];d[i*4+2]=c[2];d[i*4+3]=255;}o.tex.needsUpdate=true;}
function sim(sdt){S.Tb+=((S.on?380:25)-S.Tb)*(1-Math.exp(-sdt/(S.on?55:200)));
  RODS.forEach(r=>{const o=R[r.k],T=o.T,a=r.a,lim=.4*dx*dx/a;const n=Math.max(1,Math.ceil(sdt/lim)),h=sdt/n;
    for(let s=0;s<n;s++){T[0]=S.Tb;const k=a*h/(dx*dx);let prev=T[0];for(let i=1;i<N-1;i++){const cur=T[i];T[i]=cur+k*(T[i+1]-2*cur+prev)-.0025*h*(cur-25);prev=cur;}T[N-1]=T[N-1]+2*k*(T[N-2]-T[N-1])-.0025*h*(T[N-1]-25);}});}
function TatRod(o,p){const f=clamp((p)/RL*(N-1)*(RL/(RL))*(1),0,N-1);const x=clamp(p/(RL)*(N-1),0,N-1);const i=Math.floor(x),u=x-i;return o.T[i]*(1-u)+o.T[Math.min(N-1,i+1)]*u;}
let nb=0;
P3.loop(L,(dt)=>{bn.tick&&bn.tick(L.vt);fl.S.on=S.on;fl.tick(L.vt);
  if(S.on||S.Tb>30){const sdt=dt*S.ts;sim(sdt);S.t+=S.on?sdt:0;}
  RODS.forEach((r,i)=>{const o=R[r.k];if(S.thermal)texUpd(o);o.beads.forEach((b,j)=>{const T=TatRod(o,BEADS[j]-.0);if(!b.fall&&!b.done&&T>=MELT){b.fall=true;S.drop[r.k+j]=S.t;P3.tone(900-j*80,.05,'triangle',.05);renderNB();if(Object.keys(S.drop).length===1)toast('سقطت أول كرة شمع من قضيب '+r.n+'!');render();}
    if(b.fall&&!b.done){b.vy+=dt*9.8*.6;b.b.position.y-=b.vy*dt;b.b.scale.y=Math.max(.6,b.b.scale.y-dt*.3);if(b.b.position.y<=.06){b.b.position.y=.06;b.done=true;b.b.scale.set(1.3,.4,1.3);P3.tone(320,.04,'square',.03);}}});});
  X.txt(sec,'cT',X.fmtT(S.t));X.txt(sec,'cB',S.Tb.toFixed(0)+' °C');nb+=dt;});
function fire(b){S.on=!S.on;b.textContent=S.on?'⏹ أطفئ اللهب':'🔥 أشعل اللهب';b.setAttribute('aria-pressed',S.on);if(S.on)P3.whoosh();render();}
function thermal(b){S.thermal=!S.thermal;b.setAttribute('aria-pressed',S.thermal);RODS.forEach(r=>{const o=R[r.k];o.m.material=S.thermal?o.mT:o.mN;if(S.thermal)texUpd(o);});
  L.scene.background=new THREE.Color(S.thermal?0x080b14:0xd9d5cc);if(S.thermal){S.thUsed=true;L.focus(V(0,4.4,3.2),V(0,.9,.4),900);}else L.home(800);toast(S.thermal?'الكاميرا الحرارية: الأصفر والأبيض أسخن، والأزرق الداكن أبرد.':'عادت الرؤية العادية.');render();}
function ts(v){S.ts=v;sec.$$('[data-a="ts"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));}
function reset(){S.on=false;S.t=0;S.Tb=25;S.drop={};RODS.forEach(r=>{const o=R[r.k];o.T.fill(25);texUpd(o);o.beads.forEach(b=>{b.fall=false;b.done=false;b.vy=0;b.b.position.copy(b.home);b.b.scale.set(1,1,1);});});
  const b=sec.$('[data-a="fire"]');b.textContent='🔥 أشعل اللهب';b.setAttribute('aria-pressed',false);renderNB();render();}
function stepIdx(){const n=Object.keys(S.drop).length;if(!S.on&&!n)return 0;if(n<6)return 1;if(!S.thUsed)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='أشعل اللهب';html=`<p class="p3-txt">أشعل اللهب تحت الكتلة النحاسية الوسطى. ستنتقل الحرارة عبر القضبان الأربعة نحو أطرافها.</p>`;}
  else if(k===1){title='راقب سقوط كرات الشمع';html=`<p class="p3-txt">كلما وصلت الحرارة إلى كرة شمع وتجاوزت 60°C انصهرت وسقطت. يُسجّل زمن سقوط كل كرة تلقائيًا.</p>`;}
  else if(k===2){title='استخدم الكاميرا الحرارية';html=`<p class="p3-txt">شغّل «الكاميرا الحرارية» لترى انتشار الحرارة داخل القضبان بالألوان.</p>`;}
  else{title='رتّب الموصلات';html=`<p class="p3-ok">ترتيب التوصيل من الأفضل: النحاس ← الألومنيوم ← الحديد ← الزجاج (عازل). الحرارة تنتقل بالتوصيل أسرع في الفلزات.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>القضيب</th>${BEADS.map((_,i)=>`<th>ك${i+1}</th>`).join('')}</tr></thead><tbody>${RODS.map(r=>`<tr><td>${r.n}</td>${BEADS.map((_,i)=>`<td class="n">${S.drop[r.k+i]!=null?Math.round(S.drop[r.k+i])+'s':'—'}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="x-note">زمن سقوط كل كرة بالثواني (ك1 الأقرب إلى اللهب).</p>`;}
X.side(sec,{fire,thermal,ts:b=>ts(+b.dataset.v),reset});
RODS.forEach(r=>texUpd(R[r.k]));render();renderNB();
};

/* =====================================================================
   ١١) الصوت: التردد وحدّة الصوت والسعة (ثاني متوسط · موجات الصوت)
   ===================================================================== */
const SND={};EXP_MODS.sound8=SND;
SND.init=function(){gm();
const VS=343;
const S={f:300,A:5,on:true,audio:false,log:[],ph:0};P3.dbg.sound8=S;
const NAMES=['شغّل مولّد الإشارات','غيّر التردد','غيّر السعة','استنتج'];
const sec=P3.section('sound8',{title:'الصوت: التردد وحدّة الصوت والسعة',grade:'ثاني متوسط',lesson:'موجات الصوت',
  hud:`<div class="p3-row">${X.m('التردد','sF',1)}${X.m('الطول الموجي','sL')}</div><div class="p3-row">${X.m('حدّة الصوت','sP',1)}${X.m('شدة الصوت','sI')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    ${X.rng('التردد','sFr',100,1000,50,300,' Hz')}${X.rng('السعة','sAr',1,10,1,5,'')}
    <div class="p3-acts"><button class="p3-b" data-a="audio" aria-pressed="false">🔊 استمع للصوت</button><button class="p3-b pri" data-a="rec">📋 سجّل القراءة</button><button class="p3-b" data-a="reset">↺ إعادة</button></div>
    <p class="x-note">جسيمات الهواء تُعرض بحركة مبطّأة جدًا لنراها؛ أما الطول الموجي فمحسوب بدقة من سرعة الصوت في الهواء (343 m/s).</p></div>`,
  learn:`<div class="panel"><h3>الموجات الصوتية</h3><p>الصوت <b>موجة طولية</b> تنتقل في الوسط على شكل <b>تضاغطات</b> (جسيمات متقاربة) و<b>تخلخلات</b> (جسيمات متباعدة). ولا ينتقل الصوت في الفراغ.</p>
    <p class="p3-eq">سرعة الموجة = الطول الموجي × التردد</p></div>
    <div class="panel"><h3>الحدّة والشدة</h3><p><b>حدّة الصوت</b> تعتمد على <b>التردد</b>: التردد الكبير صوت حاد (رفيع)، والتردد الصغير صوت غليظ. <b>شدة الصوت</b> (علوّه) تعتمد على <b>السعة</b>: كلما زادت السعة زادت الطاقة وعلا الصوت.</p></div>`,
  quiz:[{q:'عند زيادة تردد الصوت فإن الطول الموجي:',o:['يزداد','يقل','لا يتغير'],a:1},{q:'حدّة الصوت تعتمد على:',o:['السعة','التردد','سرعة الصوت'],a:1},
        {q:'تردد صوت 343 Hz في الهواء (سرعة الصوت 343 m/s). طوله الموجي:',o:['1 m','343 m','0.5 m'],a:0},{q:'المناطق التي تتقارب فيها جسيمات الهواء تسمى:',o:['تخلخلات','تضاغطات','قمم'],a:1}],
  report:()=>({title:'الصوت: التردد وحدّة الصوت والسعة',grade:'ثاني متوسط',lesson:'موجات الصوت',cols:['التردد (Hz)','الطول الموجي (m)','السعة','حدّة الصوت','شدة الصوت'],
    rows:S.log.length?S.log.map(r=>[String(r.f),r.l.toFixed(2),String(r.A),r.p,r.i]):[['','','','','']],note:'ما العلاقة بين التردد والطول الموجي؟ وما الذي يغيّر شدة الصوت؟'})
});
const L=new Lab(sec,{target:V(.35,.95,.5),dist:a=>Math.max(5,7.8/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* generator */
const gen=new THREE.Group();{const b=new THREE.Mesh(RBox(.9,.42,.6,.04),KIT.phys(0x2f3b44,{roughness:.4}));b.position.y=.21;gen.add(b);[[-.25,.0],[.05,.0],[.3,0]].forEach(([x])=>{const k=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.04,20),KIT.mat(0xd0d4d6,{metalness:.6}));k.rotation.x=Math.PI/2;k.position.set(x,.1,.31);gen.add(k);});castAll(gen);}
gen.position.set(-1.9,0,1.15);L.add(gen);const gl=KIT.lcd(.6,.16,'#7ef0c8','#0b1a18');gl.m.position.set(-1.9,.3,1.465);L.add(gl.m);
/* speaker on stand */
const spk=new THREE.Group();{const box=new THREE.Mesh(RBox(.3,.8,.8,.04),KIT.mat(0x1d2226,{roughness:.6}));spk.add(box);const rim=new THREE.Mesh(new THREE.TorusGeometry(.3,.03,10,40),KIT.mat(0x444a4f,{metalness:.5}));rim.rotation.y=Math.PI/2;rim.position.x=.16;spk.add(rim);castAll(spk);}
spk.position.set(-1.45,1.0,.4);L.add(spk);
const cone=new THREE.Mesh(new THREE.ConeGeometry(.28,.18,40,1,true),KIT.mat(0x2c3136,{side:THREE.DoubleSide,roughness:.7}));cone.rotation.z=Math.PI/2;cone.position.set(-1.33,1.0,.4);L.add(cone);
const dust=new THREE.Mesh(new THREE.SphereGeometry(.08,20,14),KIT.mat(0x3a4046,{metalness:.4}));dust.scale.x=.5;dust.position.set(-1.26,1.0,.4);L.add(dust);
const sst=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,.6,12),M.steel);sst.position.set(-1.45,.3,.4);L.add(sst);
L.add(KIT.wire([V(-1.6,.2,1.1),V(-1.55,.08,.8),V(-1.48,.4,.45)],0x222222,.015));
/* air particle column */
const NX=90,NY=6,NZ=6,NP=NX*NY*NZ,X0=-1.15,X1=2.6;const im=new THREE.InstancedMesh(new THREE.SphereGeometry(.022,8,6),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.5}),NP);im.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(NP*3),3);L.scene.add(im);
const PB=[];for(let i=0;i<NX;i++)for(let j=0;j<NY;j++)for(let k=0;k<NZ;k++)PB.push([X0+(X1-X0)*(i+Math.random()*.25)/NX,.72+j*.11+Math.random()*.03,.12+k*.11+Math.random()*.03]);
const tubeG=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,X1-X0+.1,40,1,true),G.glass);tubeG.rotation.z=Math.PI/2;tubeG.position.set((X0+X1)/2,1.0,.4);tubeG.renderOrder=5;L.add(tubeG);
/* oscilloscope */
const osc=new THREE.Group();{const b=new THREE.Mesh(RBox(1.1,.8,.5,.04),KIT.phys(0xd6dadb,{roughness:.4}));osc.add(b);castAll(osc);}osc.position.set(1.7,2.15,-1.2);L.add(osc);
const otex=canvasTex(512,320,()=>{});const oscr=new THREE.Mesh(new THREE.PlaneGeometry(.9,.56),new THREE.MeshBasicMaterial({map:otex}));oscr.position.set(1.7,2.17,-.94);L.add(oscr);
const mic=new THREE.Mesh(new THREE.CylinderGeometry(.04,.03,.25,14),KIT.mat(0x222222));mic.rotation.z=Math.PI/2;mic.position.set(2.75,1.0,.4);L.add(mic);
L.add(KIT.wire([V(2.85,1.0,.4),V(2.9,1.6,-.3),V(2.2,1.9,-.9)],0x222222,.012));
const lc=L.label('تضاغط',V(0,1.42,.4),'x-w'),lr=L.label('تخلخل',V(0,1.42,.4),'x-c');
const lamL=L.label('λ',V(0,.55,.4),'x-d');
function lam(){return VS/S.f;}
function sceneLam(){return lam()*1.6;}
function drawOsc(t){const c=otex.userData.ctx,w=512,h=320;c.fillStyle='#071612';c.fillRect(0,0,w,h);c.strokeStyle='rgba(126,240,200,.18)';c.lineWidth=1;for(let i=0;i<=10;i++){c.beginPath();c.moveTo(i*w/10,0);c.lineTo(i*w/10,h);c.stroke();}for(let j=0;j<=8;j++){c.beginPath();c.moveTo(0,j*h/8);c.lineTo(w,j*h/8);c.stroke();}
  c.strokeStyle='#5effb2';c.lineWidth=3;c.beginPath();const win=.01;for(let x=0;x<=w;x+=2){const tt=x/w*win;const y=h/2-Math.sin(2*Math.PI*S.f*tt+t*3)*S.A*13;x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  c.fillStyle='#b8ffe0';c.font='600 22px "IBM Plex Mono",monospace';c.fillText('1 ms/div',12,28);c.textAlign='right';c.fillText(S.f+' Hz',w-12,28);c.textAlign='left';otex.needsUpdate=true;}
const dO=new THREE.Object3D(),col=new THREE.Color();
P3.loop(L,(dt,t)=>{const fv=.55+S.f/1000*.9;S.ph+=dt*fv*2*Math.PI;const k=2*Math.PI/sceneLam(),amp=Math.min(.018*S.A,sceneLam()/7);
  for(let n=0;n<NP;n++){const [x,y,z]=PB[n];const ph=k*(x-X0)-S.ph;const dx=amp*Math.sin(ph)*(S.on?1:0);const comp=-Math.cos(ph);dO.position.set(x+dx,y,z);dO.updateMatrix();im.setMatrixAt(n,dO.matrix);
    const w=.35+.65*S.A/10,cp=Math.max(0,comp)*w,rf=Math.max(0,-comp)*w;col.setRGB(.72+.28*cp-.45*rf,.76-.5*cp-.25*rf,.8-.55*cp+.2*rf);col.convertSRGBToLinear();im.setColorAt(n,col);}
  im.instanceMatrix.needsUpdate=true;im.instanceColor.needsUpdate=true;
  cone.position.x=-1.33+Math.sin(S.ph)*.006*S.A;dust.position.x=-1.26+Math.sin(S.ph)*.006*S.A;
  const xc=X0+((S.ph/k)%sceneLam());const xr=xc+sceneLam()/2;L.labels.find(l=>l.el===lc).pos.set(Math.min(X1-.2,xc+0),1.5,.4);L.labels.find(l=>l.el===lr).pos.set(xr<X1?xr:xr-sceneLam(),1.5,.4);L.labels.find(l=>l.el===lamL).pos.set(X0+sceneLam()/2,.5,.4);
  drawOsc(t);});
let osc_=null,gain=null;
function audioUpd(){try{if(!S.audio){if(osc_){osc_.stop();osc_=null;}return;}const a=P3.ac=P3.ac||new (window.AudioContext||window.webkitAudioContext)();if(a.state==='suspended')a.resume();
  if(!osc_){osc_=a.createOscillator();gain=a.createGain();osc_.type='sine';osc_.connect(gain);gain.connect(a.destination);osc_.start();}osc_.frequency.setTargetAtTime(S.f,a.currentTime,.03);gain.gain.setTargetAtTime(.012*S.A,a.currentTime,.05);}catch(e){}}
const pitch=f=>f<300?'غليظة (منخفضة)':f<650?'متوسطة':'حادة (عالية)',loud=A=>A<=3?'منخفضة':A<=7?'متوسطة':'عالية';
function upd(){X.txt(sec,'sF',S.f+' Hz');X.txt(sec,'sL',lam().toFixed(2)+' m');X.txt(sec,'sP',pitch(S.f));X.txt(sec,'sI',loud(S.A)+' (≈'+(45+S.A*5)+' dB)');gl.set(S.f+' Hz');lamL.textContent='λ = '+lam().toFixed(2)+' m';audioUpd();}
function audio(b){S.audio=!S.audio;b.setAttribute('aria-pressed',S.audio);b.textContent=S.audio?'🔇 أوقف الصوت':'🔊 استمع للصوت';audioUpd();}
function rec(){const r={f:S.f,l:lam(),A:S.A,p:pitch(S.f),i:loud(S.A)};S.log.push(r);P3.click();toast(`سُجّل: ${r.f} Hz ← λ = ${r.l.toFixed(2)} m`);renderNB();render();}
function reset(){S.log=[];S.f=300;S.A=5;sec.$('#sFr').value=300;sec.$('#sAr').value=5;sec.$('#sFr-o').textContent='300 Hz';sec.$('#sAr-o').textContent='5';upd();renderNB();render();}
function stepIdx(){const fs=new Set(S.log.map(r=>r.f)),as=new Set(S.log.map(r=>r.A));if(!S.log.length)return 0;if(fs.size<3)return 1;if(as.size<2)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='شغّل مولّد الإشارات';html=`<p class="p3-txt">مكبّر الصوت يهتز فيدفع جسيمات الهواء ويسحبها، فتتكوّن <b>تضاغطات</b> (أحمر) و<b>تخلخلات</b> (أزرق). سجّل القراءة الأولى، ويمكنك تشغيل الصوت.</p>`;}
  else if(k===1){title='غيّر التردد';html=`<p class="p3-txt">زِد التردد وسجّل ثلاث قراءات مختلفة على الأقل. ماذا يحدث للطول الموجي (المسافة بين تضاغطين متتاليين)؟</p>`;}
  else if(k===2){title='غيّر السعة';html=`<p class="p3-txt">ثبّت التردد وغيّر السعة. لاحظ ارتفاع الموجة على راسم الذبذبات وشدة الصوت.</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">كلما زاد التردد قلّ الطول الموجي وأصبح الصوت أحدّ (حاصل ضربهما ثابت = سرعة الصوت). وكلما زادت السعة زادت طاقة الموجة فعلا الصوت (زادت شدته) دون أن تتغير حدّته.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>التردد</th><th>λ (m)</th><th>λ × f</th><th>السعة</th><th>الحدّة</th></tr></thead><tbody>${S.log.length?S.log.map(r=>`<tr><td class="n">${r.f} Hz</td><td class="n">${r.l.toFixed(2)}</td><td class="n">${(r.l*r.f).toFixed(0)}</td><td class="n">${r.A}</td><td>${r.p}</td></tr>`).join(''):'<tr><td colspan="5">—</td></tr>'}</tbody></table>`;}
X.side(sec,{audio,rec,reset});
sec.$('#sFr').addEventListener('input',e=>{S.f=+e.target.value;sec.$('#sFr-o').textContent=S.f+' Hz';upd();});
sec.$('#sAr').addEventListener('input',e=>{S.A=+e.target.value;sec.$('#sAr-o').textContent=S.A;upd();});
document.getElementById('backBtn').addEventListener('click',()=>{if(S.audio){S.audio=false;audioUpd();const b=sec.$('[data-a="audio"]');b.setAttribute('aria-pressed',false);b.textContent='🔊 استمع للصوت';}});
upd();render();renderNB();
};

/* =====================================================================
   ١٢) انعكاس الضوء في المرآة المستوية (ثاني متوسط · الضوء)
   ===================================================================== */
const MIRR={};EXP_MODS.mirr8=MIRR;
MIRR.init=function(){gm();
const S={i:30,mode:'ray',d:.8,log:[],img:[]};P3.dbg.mirr8=S;
const NAMES=['وجّه الشعاع','سجّل ثلاث زوايا','الصورة في المرآة','استنتج'];
const sec=P3.section('mirr8',{title:'انعكاس الضوء في المرآة المستوية',grade:'ثاني متوسط',lesson:'الضوء',
  hud:`<div class="p3-row">${X.m('زاوية السقوط','mI',1)}${X.m('زاوية الانعكاس','mR')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">١) قانون الانعكاس</h4>
    ${X.rng('زاوية السقوط','mA',0,80,5,30,'°')}
    <div class="p3-acts"><button class="p3-b pri" data-a="rec">📋 سجّل الزاويتين</button></div></div>
    <div class="p3-box"><h4 class="p3-h">٢) الصورة في المرآة المستوية</h4>
    ${X.rng('بعد الشمعة عن المرآة','mD',.4,1.4,.1,.8,' m')}
    <div class="p3-acts"><button class="p3-b" data-a="mode">🕯 اعرض الشمعة وصورتها</button><button class="p3-b" data-a="recI">📋 سجّل البعدين</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>قانون الانعكاس</h3><p>عندما يسقط شعاع ضوئي على سطح عاكس أملس فإن <b>زاوية السقوط = زاوية الانعكاس</b>، وتُقاس الزاويتان من <b>العمود المقام</b> على السطح عند نقطة السقوط.</p></div>
    <div class="panel"><h3>صفات الصورة في المرآة المستوية</h3><p>الصورة <b>تقديرية</b> (لا تتكوّن على حاجز)، و<b>معتدلة</b>، و<b>مساوية للجسم</b> في الطول، و<b>بعدها عن المرآة يساوي بعد الجسم</b>، ومقلوبة جانبيًا (اليمين يظهر يسارًا).</p></div>`,
  quiz:[{q:'سقط شعاع على مرآة مستوية بزاوية 40°. زاوية الانعكاس:',o:['50°','40°','80°'],a:1},{q:'تُقاس زاويتا السقوط والانعكاس من:',o:['سطح المرآة','العمود المقام على السطح','الشعاع الساقط'],a:1},
        {q:'وقف طالب على بعد 2 m من مرآة مستوية. بعد صورته عن المرآة:',o:['1 m','2 m','4 m'],a:1},{q:'الصورة في المرآة المستوية:',o:['حقيقية ومقلوبة','تقديرية ومعتدلة','حقيقية ومكبّرة'],a:1}],
  report:()=>({title:'انعكاس الضوء في المرآة المستوية',grade:'ثاني متوسط',lesson:'الضوء',cols:['#','زاوية السقوط (°)','زاوية الانعكاس (°)','بعد الجسم (m)','بعد الصورة (m)'],
    rows:Array.from({length:Math.max(1,S.log.length,S.img.length)},(_,k)=>[String(k+1),S.log[k]?String(S.log[k]):'',S.log[k]!=null?String(S.log[k]):'',S.img[k]?S.img[k].toFixed(1):'',S.img[k]?S.img[k].toFixed(1):'']),note:'ماذا تستنتج عن العلاقة بين زاويتي السقوط والانعكاس؟ وبين بعدي الجسم والصورة؟'})
});
const L=new Lab(sec,{target:V(0,.15,.75),dist:a=>Math.max(3.6,5.6/a),exposure:.95});buildRoom(L);
L.controls.minPolarAngle=.2;L.resize=(o=>function(){const had=this.camSet;o.call(this);const d=this.distFn(this.stage.clientWidth/Math.max(1,this.stage.clientHeight));this.camHome.set(this.tgt.x,this.tgt.y+d*.85,this.tgt.z+d*.62);if(!had&&this.camSet)this.camera.position.copy(this.camHome);})(L.resize);
const toast=m=>L.toast(m);
/* optical board (protractor) */
const BR=1.35,C=V(0,.07,.65);
const btex=canvasTex(1024,1024,c=>{const w=1024,cx=512;c.fillStyle='#fbfaf5';c.fillRect(0,0,w,w);c.strokeStyle='#10302c';c.fillStyle='#10302c';c.textAlign='center';c.textBaseline='middle';
  c.beginPath();c.arc(cx,cx,500,0,7);c.lineWidth=6;c.stroke();for(let a=0;a<360;a+=5){const r=Math.PI*a/180,L1=a%10?470:445;c.lineWidth=a%10?2:4;c.beginPath();c.moveTo(cx+Math.cos(r)*500,cx+Math.sin(r)*500);c.lineTo(cx+Math.cos(r)*L1,cx+Math.sin(r)*L1);c.stroke();}
  c.font='bold 30px "IBM Plex Mono",monospace';for(let a=-90;a<=90;a+=10){const r=Math.PI*(a-90)/180;c.save();c.translate(cx+Math.cos(r)*405,cx+Math.sin(r)*405);c.rotate(Math.PI);c.fillText(Math.abs(a),0,0);c.restore();}
  c.setLineDash([16,12]);c.lineWidth=3;c.strokeStyle='#2563eb';c.beginPath();c.moveTo(cx,cx);c.lineTo(cx,40);c.stroke();c.setLineDash([]);
  c.fillStyle='#2563eb';c.font='bold 30px "IBM Plex Sans Arabic",sans-serif';c.save();c.translate(cx-100,190);c.rotate(Math.PI);c.fillText('العمود المقام',0,0);c.restore();});
const board=new THREE.Mesh(new THREE.CylinderGeometry(BR,BR,.04,96),[KIT.mat(0xe9e6dc),new THREE.MeshStandardMaterial({map:btex,roughness:.8}),KIT.mat(0xe9e6dc)]);board.position.set(C.x,.02,C.z);board.rotation.y=-Math.PI/2;board.receiveShadow=true;L.add(board);
/* mirror along x axis through C, reflecting side facing +z (toward viewer)  */
const mir=new THREE.Group();{const g=new THREE.Mesh(RBox(1.4,.4,.05,.01),new THREE.MeshStandardMaterial({color:0xe9f2f5,metalness:1,roughness:.04,envMapIntensity:1.6}));g.position.y=.2;const back=new THREE.Mesh(RBox(1.42,.42,.03,.01),KIT.mat(0x2b3036));back.position.set(0,.2,-.04);
  const ft=new THREE.Mesh(RBox(.3,.06,.18,.02),KIT.mat(0x2b3036));ft.position.set(0,.03,-.05);mir.add(g,back,ft);castAll(mir);}
mir.position.set(C.x,.04,C.z-.03);L.add(mir);
/* laser box */
const lz=new THREE.Group();{const b=new THREE.Mesh(RBox(.42,.16,.2,.03),KIT.mat(0x1d2226,{roughness:.5}));lz.add(b);const ap=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.03,12),new THREE.MeshBasicMaterial({color:0xff3030}));ap.rotation.z=Math.PI/2;ap.position.x=-.22;lz.add(ap);castAll(lz);}
L.add(lz);
const beamM=new THREE.MeshBasicMaterial({color:0xff2a2a,transparent:true,opacity:.95});const glowM=new THREE.MeshBasicMaterial({color:0xff4a4a,transparent:true,opacity:.25,blending:THREE.AdditiveBlending,depthWrite:false});
const mkBeam=()=>{const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,1,8),beamM);const h=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,1,10),glowM);g.add(c,h);L.scene.add(g);return g;};
const inc=mkBeam(),ref=mkBeam();
const spot=new THREE.Sprite(new THREE.SpriteMaterial({map:P3.glowTex(),color:0xff5050,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));spot.scale.setScalar(.25);L.scene.add(spot);
const aI=L.label('',V(),'x-w'),aR=L.label('',V(),'x-c');
function beam(g,a,b){const d=b.clone().sub(a);g.position.copy(a).add(b).multiplyScalar(.5);g.scale.set(1,d.length(),1);g.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());}
const Y=.12;
function rays(){const a=S.i*Math.PI/180;const P=V(C.x,Y,C.z);const src=V(C.x-Math.sin(a)*1.15,Y,C.z+Math.cos(a)*1.15);const out=V(C.x+Math.sin(a)*1.25,Y,C.z+Math.cos(a)*1.25);
  beam(inc,src,P);beam(ref,P,out);spot.position.copy(P);lz.position.set(C.x-Math.sin(a)*1.38,Y,C.z+Math.cos(a)*1.38);lz.rotation.y=-Math.PI/2-a;
  L.labels.find(l=>l.el===aI).pos.set(C.x-Math.sin(a)*.85,.2,C.z+Math.cos(a)*.85);L.labels.find(l=>l.el===aR).pos.set(C.x+Math.sin(a)*.85,.2,C.z+Math.cos(a)*.85);
  aI.textContent='السقوط '+S.i+'°';aR.textContent='الانعكاس '+S.i+'°';X.txt(sec,'mI',S.i+'°');X.txt(sec,'mR',S.i+'°');}
/* candle + virtual image */
const mkCandle=(ghost)=>{const g=new THREE.Group();const wax=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.42,20),ghost?new THREE.MeshStandardMaterial({color:$lc(0xf4ead2),transparent:true,opacity:.35,depthWrite:false}):KIT.mat(0xf4ead2,{roughness:.6}));wax.position.y=.21;g.add(wax);
  const fl=Flame({s:.3});fl.S.air=0;fl.S.on=true;fl.g.position.y=.44;if(ghost)fl.S.boost=.5;g.add(fl.g);g.userData.fl=fl;return g;};
const cand=mkCandle(false),img=mkCandle(true);cand.visible=img.visible=false;L.scene.add(cand,img);
const dl1=L.label('',V(),'x-d'),dl2=L.label('',V(),'x-d');show(dl1,false);show(dl2,false);
const rul=new THREE.Mesh(new THREE.BoxGeometry(.04,.01,3.0),KIT.mat(0xf2d27a));rul.position.set(C.x+.35,.05,C.z);rul.visible=false;L.add(rul);
function cand_(){const z1=C.z+S.d,z2=C.z-S.d;cand.position.set(C.x+.0,.04,z1);img.position.set(C.x,.04,z2);L.labels.find(l=>l.el===dl1).pos.set(C.x+.45,.12,(C.z+z1)/2);L.labels.find(l=>l.el===dl2).pos.set(C.x+.45,.12,(C.z+z2)/2);
  dl1.textContent='بعد الجسم '+S.d.toFixed(1)+' m';dl2.textContent='بعد الصورة '+S.d.toFixed(1)+' m';}
P3.loop(L,(dt)=>{if(cand.visible){cand.userData.fl.tick(L.vt);img.userData.fl.tick(L.vt);}spot.material.opacity=.7+.3*Math.sin(L.vt/90);});
function setI(v){S.i=v;sec.$('#mA-o').textContent=v+'°';rays();}
function rec(){if(!S.log.includes(S.i))S.log.push(S.i);P3.click();toast(`زاوية السقوط ${S.i}° = زاوية الانعكاس ${S.i}°`);renderNB();render();}
function mode(b){S.mode=S.mode==='ray'?'img':'ray';const im=S.mode==='img';cand.visible=img.visible=rul.visible=im;show(dl1,im);show(dl2,im);[inc,ref,spot,lz].forEach(o=>o.visible=!im);show(aI,!im);show(aR,!im);mir.children[0].material.metalness=im?.6:1;mir.children[0].material.transparent=im;mir.children[0].material.opacity=im?.55:1;
  b.textContent=im?'🔦 عُد إلى شعاع الليزر':'🕯 اعرض الشمعة وصورتها';if(im){cand_();L.focus(V(2.6,2.6,2.8),V(0,.3,.65),900);}else L.home(800);render();}
function setD(v){S.d=v;sec.$('#mD-o').textContent=v.toFixed(1)+' m';if(S.mode==='img')cand_();}
function recI(){if(S.mode!=='img'){toast('اعرض الشمعة وصورتها أولًا.');return;}if(!S.img.includes(S.d))S.img.push(S.d);P3.click();toast('بعد الجسم = بعد الصورة = '+S.d.toFixed(1)+' m');renderNB();render();}
function reset(){S.log=[];S.img=[];if(S.mode==='img')mode(sec.$('[data-a="mode"]'));setI(30);renderNB();render();}
function stepIdx(){if(!S.log.length)return 0;if(S.log.length<3)return 1;if(!S.img.length)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='وجّه الشعاع';html=`<p class="p3-txt">حرّك شريط «زاوية السقوط» لتدوير صندوق الليزر حول اللوح المدرّج، وقارن الزاوية بين الشعاع الساقط والعمود المقام بالزاوية بين الشعاع المنعكس والعمود.</p>`;}
  else if(k===1){title='سجّل ثلاث زوايا';html=`<p class="p3-txt">سجّل ثلاث زوايا سقوط مختلفة (${S.log.length} / 3).</p>`;}
  else if(k===2){title='الصورة في المرآة';html=`<p class="p3-txt">اضغط «اعرض الشمعة وصورتها» وحرّك الشمعة، ثم سجّل بعد الجسم وبعد الصورة عن المرآة.</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">زاوية السقوط = زاوية الانعكاس دائمًا. والصورة في المرآة المستوية تقديرية معتدلة مساوية للجسم، وبعدها عن المرآة يساوي بعد الجسم.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>#</th><th>السقوط</th><th>الانعكاس</th></tr></thead><tbody>${S.log.length?S.log.map((a,i)=>`<tr><td>${i+1}</td><td class="n">${a}°</td><td class="n">${a}°</td></tr>`).join(''):'<tr><td colspan="3">—</td></tr>'}</tbody></table>`+
  (S.img.length?`<table class="p3-t" style="margin-top:8px"><thead><tr><th>بعد الجسم</th><th>بعد الصورة</th></tr></thead><tbody>${S.img.map(d=>`<tr><td class="n">${d.toFixed(1)} m</td><td class="n">${d.toFixed(1)} m</td></tr>`).join('')}</tbody></table>`:'');}
X.side(sec,{rec,mode,recI,reset});
sec.$('#mA').addEventListener('input',e=>setI(+e.target.value));sec.$('#mD').addEventListener('input',e=>setD(+e.target.value));
rays();render();renderNB();
};

X.reg(['heart8','starch8','lung8','cond8','sound8','mirr8']);
})();
