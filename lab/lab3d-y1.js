/* =====================================================================
   المختبر الافتراضي الذكي — تحويل التجارب إلى 3D (١): أول متوسط · الفصل الأول
   الحركة · قانون نيوتن الثاني · الرافعة · الشغل والآلات · الكثافة · التغيرات
   الشرح والأسئلة وأعمدة التقرير مأخوذة كما هي من النسخة الأصلية (lab2d-content.js)
   إعداد أ. علي البقاشي — مدرسة أبي الدرداء المتوسطة
   ===================================================================== */
(function(){
'use strict';
if(typeof THREE==='undefined'||typeof Lab==='undefined'||!window.P3X||!window.X3)return;
const {P3,G,gm,TestTube,Bubbles,Flame,setCol,$lc,sleep,hex6,clamp,show}=window.P3X;const {X}=window.X3;
const CC=window.L2C||{};
const Y={};window.Y3=Y;
Y.sec=(id,o)=>{const c=CC[id]||{};return P3.section(id,{title:o.title||c.title,grade:o.grade,lesson:o.lesson,hud:o.hud,side:o.side,learn:c.learn||'',quiz:c.quiz||[],
  report:()=>{const r=(CC[id]&&CC[id].report)||{};const d=o.report();return {title:o.title||c.title,grade:o.grade,lesson:o.lesson,cols:d.cols||r.cols,rows:d.rows,note:d.note!==undefined?d.note:r.note};}});};
Y.tape=(len,m,label)=>canvasTex(2048,96,c=>{c.fillStyle='#f6d34a';c.fillRect(0,0,2048,96);c.fillStyle='#10302c';c.strokeStyle='#10302c';c.font='bold 30px "IBM Plex Mono",monospace';c.textAlign='center';
  const n=Math.round(m*100);for(let i=0;i<=n;i++){const x=24+i*(2000/n);c.lineWidth=i%10?2:4;c.beginPath();c.moveTo(x,0);c.lineTo(x,i%10?18:i%50?34:44);c.stroke();if(!(i%(n>100?20:10)))c.fillText((i/100).toFixed(1)+(label||''),x,80);}});
Y.metal=c=>KIT.mat(c,{metalness:.75,roughness:.32});
Y.box=(w,h,d,c,o={})=>{let m;const oo=Object.assign({},o);delete oo.phys;m=new THREE.Mesh(RBox(w,h,d,Math.min(w,h,d)*.12),o.phys?KIT.phys(c,oo):KIT.mat(c,oo));m.castShadow=true;m.receiveShadow=true;return m;};
Y.cyl=(r1,r2,h,c,seg=28,o={})=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg),KIT.mat(c,o));m.castShadow=true;return m;};
Y.gate=()=>{const g=new THREE.Group();const p=KIT.mat(0x2b3036,{metalness:.3});[-.2,.2].forEach(z=>{const s=new THREE.Mesh(new THREE.BoxGeometry(.05,.42,.05),p);s.position.set(0,.21,z);g.add(s);});const t=new THREE.Mesh(new THREE.BoxGeometry(.06,.06,.46),p);t.position.y=.42;g.add(t);
  const led=new THREE.Mesh(new THREE.SphereGeometry(.032,12,10),new THREE.MeshBasicMaterial({color:0x552222}));led.position.set(0,.47,0);g.add(led);g.userData.led=led;castAll(g);return g;};
Y.springScale=(max)=>{const g=new THREE.Group();const body=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.8,24,1,true),G.glassT);body.position.y=-.45;g.add(body);
  const cap=Y.cyl(.075,.075,.05,0xe0703f);cap.position.y=-.03;g.add(cap);const cap2=cap.clone();cap2.position.y=-.87;g.add(cap2);
  const tex=canvasTex(128,640,c=>{c.fillStyle='#fffbe8';c.fillRect(0,0,128,640);c.fillStyle='#10302c';c.strokeStyle='#10302c';c.font='bold 30px "IBM Plex Mono",monospace';
    for(let i=0;i<=10;i++){const y=30+i*58;c.lineWidth=4;c.beginPath();c.moveTo(70,y);c.lineTo(122,y);c.stroke();c.fillText(String(Math.round(i*max/10)),8,y+10);}c.font='bold 26px sans-serif';c.fillText('N',90,632);});
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(.1,.74),new THREE.MeshStandardMaterial({map:tex,roughness:.6}));pl.position.set(0,-.45,.072);g.add(pl);
  const ptr=new THREE.Mesh(new THREE.BoxGeometry(.13,.014,.02),KIT.mat(0xd0302a));g.add(ptr);const rod=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.4,8),M.steel);g.add(rod);
  const hook=new THREE.Mesh(new THREE.TorusGeometry(.025,.007,8,16,Math.PI*1.5),M.steel);g.add(hook);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.03,.007,8,16),M.steel);ring.position.y=.04;g.add(ring);
  g.userData.set=F=>{const y=-.1-.71*(F/max)*.95-.03;ptr.position.set(0,y,.08);rod.position.y=y-.2;hook.position.y=y-.42;g.userData.hk=-(y-.42)+.025;};g.userData.set(0);castAll(g);return g;};
const SND=t=>P3.tone(t||880,.05,'triangle',.05);

/* =====================================================================
   الحركة: السرعة ومنحنى المسافة-الزمن
   ===================================================================== */
const MOTN={};EXP_MODS.motn=MOTN;
MOTN.init=function(){gm();
const MARKS=[0,.4,.8,1.2,1.6,2.0],RUNS={slow:{n:'السيارة البطيئة',c:0x2a9d8f},fast:{n:'السيارة السريعة',c:0xe76f51},ramp:{n:'الكرة على المنحدر',c:0x6a4c93}};
const pos=(m,t)=>m==='slow'?.2*t:m==='fast'?.4*t:.08*t*t;
const S={mode:'slow',run:false,t:0,res:{slow:{},fast:{},ramp:{}},busy:false};P3.dbg.motn=S;
const NAMES=['اختر الجسم','انطلق','اقرأ الزمن','احسب السرعة'];
const sec=Y.sec('motn',{grade:'أول متوسط',lesson:'الحركة',
  hud:`<div class="p3-row">${X.m('الزمن','mnT',1)}${X.m('المسافة','mnD')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">اختر الجسم</h4><div class="p3-acts" style="flex-direction:column;align-items:stretch">${Object.entries(RUNS).map(([k,r])=>`<button class="p3-b" data-a="m" data-v="${k}">${r.n}</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b pri" data-a="go">▶ انطلق</button><button class="p3-b" data-a="reset">↺ إعادة</button></div><div class="mnCalc"></div></div>`,
  report:()=>({rows:MARKS.map(d=>[d.toFixed(1),...['slow','fast','ramp'].map(k=>S.res[k][d]!=null?S.res[k][d].toFixed(2):'')])})});
const L=new Lab(sec,{target:V(0,.45,.5),dist:a=>Math.max(4.6,7.6/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
const TR=new THREE.Group();L.add(TR);const X0=-2,K=2;
const board=Y.box(4.5,.08,.7,0xc89a62);board.position.set(0,.04,0);TR.add(board);
const tape=new THREE.Mesh(new THREE.PlaneGeometry(4.2,.16),new THREE.MeshStandardMaterial({map:Y.tape(4.2,2.0,''),roughness:.7}));tape.rotation.x=-Math.PI/2;tape.position.set(0,.082,.28);TR.add(tape);
[-.2,.2].forEach(z=>{const r=Y.box(4.5,.05,.04,0x8a5a2a);r.position.set(0,.105,z);TR.add(r);});
const gates=MARKS.map(m=>{const g=Y.gate();g.position.set(X0+m*K,.08,0);TR.add(g);return g;});
const gl=MARKS.map(m=>L.label(m.toFixed(1)+' m',V(X0+m*K,.66,.5),''));
const ramp=Y.box(.9,.5,.7,0x8a5a2a);ramp.position.set(-2.65,.05,0);ramp.visible=false;L.add(ramp);
TR.position.set(0,0,.5);
const car=new THREE.Group();{const b=Y.box(.42,.16,.26,0x2a9d8f,{phys:true,roughness:.3,clearcoat:.8});b.position.y=.17;const cab=Y.box(.22,.11,.22,0xe9f2f4);cab.position.set(-.03,.3,0);car.add(b,cab);
  [[.13,.13],[.13,-.13],[-.13,.13],[-.13,-.13]].forEach(([x,z])=>{const w=Y.cyl(.07,.07,.05,0x222222,20);w.rotation.x=Math.PI/2;w.position.set(x,.08,z);car.add(w);});castAll(car);}
const ball=new THREE.Mesh(new THREE.SphereGeometry(.12,32,24),KIT.phys(0x6a4c93,{roughness:.3,clearcoat:.8}));ball.castShadow=true;
TR.add(car,ball);
function setMode(k){if(S.run)return;S.mode=k;car.visible=k!=='ramp';ball.visible=k==='ramp';if(k!=='ramp')setCol(car.children[0].material,RUNS[k].c);TR.rotation.z=k==='ramp'?-.035:0;TR.position.y=k==='ramp'?.07:0;ramp.visible=false;
  sec.$$('[data-a="m"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===k));place(0);render();}
function place(d){const x=X0+d*K;car.position.set(x-.0,.08,0);ball.position.set(x,.08+.12,0);ball.rotation.z=-d*K/.12;X.txt(sec,'mnD',d.toFixed(2)+' m');}
P3.loop(L,(dt)=>{if(!S.run)return;S.t+=dt;const d=Math.min(2.0,pos(S.mode,S.t));place(d);X.txt(sec,'mnT',S.t.toFixed(2)+' s');
  MARKS.forEach((m,i)=>{if(S.res[S.mode][m]==null&&d>=m-1e-9){const t=m===0?0:Math.round((S.mode==='ramp'?Math.sqrt(m/.08):m/(S.mode==='slow'?.2:.4))*100)/100;S.res[S.mode][m]=t;gates[i].userData.led.material.color.set(0x22ff66);SND(700+i*60);renderNB();}});
  if(d>=2.0){S.run=false;sync();render();renderNB();toast('اكتملت الرحلة. اقرأ الأزمنة من البوابات في دفتر المختبر.');}});
function go(){if(S.run)return;S.res[S.mode]={};gates.forEach(g=>g.userData.led.material.color.set(0x552222));S.t=0;place(0);S.run=true;P3.whoosh();L.focus(V(0,1.4,4.4),V(0,.3,.5),900);sync();render();}
function reset(){S.run=false;S.res={slow:{},fast:{},ramp:{}};S.t=0;gates.forEach(g=>g.userData.led.material.color.set(0x552222));place(0);X.txt(sec,'mnT','0.00 s');L.home(700);sync();render();renderNB();}
const done=k=>S.res[k][2.0]!=null;
function render(){const k=S.mode,dn=done(k);let st=!dn?(S.run?1:0):3,title,html;
  if(S.run){title='راقب الحركة';html=`<p class="p3-txt">تومض كل بوابة باللون الأخضر لحظة مرور ${RUNS[k].n.replace('ال','ال')} وتسجّل الزمن.</p>`;}
  else if(!dn){title='اختر الجسم ثم انطلق';html=`<p class="p3-txt">${CC.motn?CC.motn.hint:''}</p>`;}
  else{const t=S.res[k][2.0],v=2.0/t;title='احسب السرعة المتوسطة';html=`<p class="p3-ok">${RUNS[k].n}: السرعة المتوسطة = المسافة ÷ الزمن = 2.0 ÷ ${t.toFixed(2)} = <b>${v.toFixed(2)} m/s</b>.${k==='ramp'?' لاحظ أن الكرة تقطع مسافات أكبر في الأزمنة المتساوية لأنها تتسارع.':''}</p>`;}
  sec.steps(NAMES,st,title,html);
  sec.$('.mnCalc').innerHTML=['slow','fast','ramp'].filter(done).map(r=>`<p class="x-note">${RUNS[r].n}: ${(2/S.res[r][2.0]).toFixed(2)} m/s</p>`).join('');}
function renderNB(){const ser=['slow','fast','ramp'].filter(k=>Object.keys(S.res[k]).length).map(k=>({c:hex6(RUNS[k].c),name:RUNS[k].n,dots:true,pts:MARKS.filter(m=>S.res[k][m]!=null).map(m=>[S.res[k][m],m])}));
  sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>المسافة</th><th>البطيئة</th><th>السريعة</th><th>الكرة</th></tr></thead><tbody>${MARKS.map(m=>`<tr><td class="n">${m.toFixed(1)} m</td>${['slow','fast','ramp'].map(k=>`<td class="n">${S.res[k][m]!=null?S.res[k][m].toFixed(2)+' s':'—'}</td>`).join('')}</tr>`).join('')}</tbody></table>`+
  (ser.length?KIT.chart({w:330,h:190,xl:'الزمن (s)',yl:'المسافة (m)',xmin:0,xmax:10,ymin:0,ymax:2,xticks:[0,2,4,6,8,10],series:ser}):'');}
function sync(){sec.$('[data-a="go"]').disabled=S.run;sec.$$('[data-a="m"]').forEach(b=>b.disabled=S.run);}
X.side(sec,{m:b=>setMode(b.dataset.v),go,reset});
setMode('slow');sync();renderNB();
};

/* =====================================================================
   قانون نيوتن الثاني
   ===================================================================== */
const NEWT={};EXP_MODS.newt=NEWT;
NEWT.init=function(){gm();
const D=1.0;const S={F:2,M:1,run:false,t:0,log:[],last:null};P3.dbg.newt=S;
const acc=()=>S.F/S.M,tT=()=>Math.sqrt(2*D/acc());
const NAMES=['اضبط القوة والكتلة','أطلق العربة','اقرأ الزمن','احسب التسارع'];
const sec=Y.sec('newt',{grade:'أول متوسط',lesson:'قوانين نيوتن للحركة',
  hud:`<div class="p3-row">${X.m('القوة','nwF',1)}${X.m('الكتلة','nwM',1)}</div><div class="p3-row">${X.m('الزمن بين البوابتين','nwT')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">قوة المحرك:</span>${[1,2,3].map(f=>`<button class="p3-b" data-a="f" data-v="${f}">${f} N</button>`).join('')}</div>
    <div class="p3-acts"><span class="p3-lab">كتلة العربة:</span>${[1,2].map(m=>`<button class="p3-b" data-a="mm" data-v="${m}">${m} kg</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b pri" data-a="go">▶ أطلق العربة</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  report:()=>({rows:S.log.length?S.log.map((r,i)=>[String(i+1),String(r.M),String(r.F),r.t.toFixed(2)]):[['','','','']]})});
const L=new Lab(sec,{target:V(.3,.5,.5),dist:a=>Math.max(5.4,8.8/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
const track=Y.box(4.6,.1,.5,0xc5ccd2,{metalness:.7,roughness:.3});track.position.set(0,.05,.5);L.add(track);
const G1=-1.0,G2=1.0;/* 1.0 m = 2 units */
const g1=Y.gate(),g2=Y.gate();g1.position.set(G1,.1,.5);g2.position.set(G2,.1,.5);L.add(g1,g2);L.label('البوابة 1',V(G1,.7,.5),'');L.label('البوابة 2',V(G2,.7,.5),'');
const tp=new THREE.Mesh(new THREE.PlaneGeometry(2.0,.12),new THREE.MeshStandardMaterial({map:Y.tape(2,1.0,' m'),roughness:.7}));tp.rotation.x=-Math.PI/2;tp.position.set(0,.102,.72);L.add(tp);
const motor=new THREE.Group();{const b=Y.box(.32,.3,.34,0x2b3036);b.position.y=.15;const d=Y.cyl(.08,.08,.24,0xd0a020,24,{metalness:.5});d.rotation.x=Math.PI/2;d.position.set(-.1,.3,0);motor.add(b,d);castAll(motor);}
motor.position.set(2.45,.1,.5);L.add(motor);const ml=L.label('محرك بقوة ثابتة',V(2.3,.85,.5),'');
const cart=new THREE.Group();{const b=Y.box(.48,.14,.32,0x2f6fbf,{phys:true,roughness:.3,clearcoat:.7});b.position.y=.2;cart.add(b);[[.15,.13],[.15,-.13],[-.15,.13],[-.15,-.13]].forEach(([x,z])=>{const w=Y.cyl(.055,.055,.04,0x222222,18);w.rotation.x=Math.PI/2;w.position.set(x,.12,z);cart.add(w);});
  const fs=Y.box(.12,.1,.12,0xeeeeec);fs.position.set(.22,.31,0);cart.add(fs);const blk=Y.box(.22,.14,.22,0x8e969c,{metalness:.8,roughness:.3});blk.position.set(-.05,.34,0);blk.visible=false;cart.add(blk);cart.userData.blk=blk;castAll(cart);}
L.add(cart);const rope=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,1,6),KIT.mat(0xe9e3cf));rope.rotation.z=Math.PI/2;L.add(rope);
const X0=G1;
function place(x){cart.position.set(x,.1,.5);const a=x+.28,b=2.35;rope.position.set((a+b)/2,.41,.5);rope.scale.y=Math.max(.01,b-a);}
P3.loop(L,(dt)=>{if(!S.run)return;S.t+=dt;const xm=.5*acc()*S.t*S.t;/* released from rest at gate 1 */const x=X0+xm*2;place(Math.min(x,2.0));
  X.txt(sec,'nwT',Math.min(S.t,S.tt).toFixed(2)+' s');
  if(x>=G1&&!S.p1){S.p1=1;g1.userData.led.material.color.set(0x22ff66);SND(700);}
  if(x>=G2&&!S.p2){S.p2=1;g2.userData.led.material.color.set(0x22ff66);SND(900);const t=Math.round(S.tt*100)/100;S.last={F:S.F,M:S.M,t};S.log.push(S.last);X.txt(sec,'nwT',t.toFixed(2)+' s');renderNB();render();}
  if(x>=2.0){S.run=false;sync();render();}});
function setF(v){if(S.run)return;S.F=v;sec.$$('[data-a="f"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));X.txt(sec,'nwF',v+' N');render();}
function setM(v){if(S.run)return;S.M=v;cart.userData.blk.visible=v>1;sec.$$('[data-a="mm"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));X.txt(sec,'nwM',v+' kg');render();}
function go(){if(S.run)return;S.t=0;S.p1=S.p2=0;S.last=null;
  S.tt=tT();
  [g1,g2].forEach(g=>g.userData.led.material.color.set(0x552222));place(X0);S.run=true;P3.whoosh();sync();render();}
function reset(){S.run=false;S.log=[];S.last=null;place(X0);[g1,g2].forEach(g=>g.userData.led.material.color.set(0x552222));X.txt(sec,'nwT','0.00 s');sync();render();renderNB();}
function render(){let st=S.run?1:S.last?3:0,title,html;
  if(S.run){title='راقب العربة';html=`<p class="p3-txt">تسجّل البوابتان الزمن الذي تستغرقه العربة لقطع 1.0 m بينهما.</p>`;}
  else if(!S.last){title='اضبط القوة والكتلة';html=`<p class="p3-txt">${CC.newt?CC.newt.hint:''}</p>`;}
  else{const r=S.last,a=2*D/(r.t*r.t);title='احسب التسارع';html=`<p class="p3-ok">ت = 2ف ÷ ز² = 2 × 1.0 ÷ ${r.t.toFixed(2)}² = <b>${a.toFixed(2)} m/s²</b>، والقوة ÷ الكتلة = ${r.F} ÷ ${r.M} = <b>${(r.F/r.M).toFixed(2)} m/s²</b>. القيمتان متساويتان: ق = ك × ت.</p>`;}
  sec.steps(NAMES,st,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>#</th><th>الكتلة</th><th>القوة</th><th>الزمن</th><th>2ف÷ز²</th><th>ق÷ك</th></tr></thead><tbody>${S.log.length?S.log.map((r,i)=>`<tr><td>${i+1}</td><td class="n">${r.M} kg</td><td class="n">${r.F} N</td><td class="n">${r.t.toFixed(2)} s</td><td class="n">${(2/(r.t*r.t)).toFixed(2)}</td><td class="n">${(r.F/r.M).toFixed(2)}</td></tr>`).join(''):'<tr><td colspan="6">—</td></tr>'}</tbody></table>`;}
function sync(){sec.$('[data-a="go"]').disabled=S.run;}
X.side(sec,{f:b=>setF(+b.dataset.v),mm:b=>setM(+b.dataset.v),go,reset});
setF(2);setM(1);place(X0);sync();renderNB();
};

/* =====================================================================
   الآلات البسيطة: الرافعة
   ===================================================================== */
const MACH={};EXP_MODS.mach=MACH;
MACH.init=function(){gm();
const XL=20,XE=80;const S={f:50,W:12,pred:null,pulled:false,read:false,log:[],busy:false};P3.dbg.mach=S;
const F=()=>S.W*(S.f-XL)/(XE-S.f);
const NAMES=['اضبط الرافعة','توقّع','اسحب الميزان','اقرأ القوة','الفائدة الآلية'];
const sec=Y.sec('mach',{grade:'أول متوسط',lesson:'الشغل والآلات البسيطة',
  hud:`<div class="p3-row">${X.m('ذراع المقاومة','mcA')}${X.m('ذراع القوة','mcB')}</div><div class="p3-row">${X.m('الحمل','mcW',1)}${X.m('قراءة الميزان','mcF',1)}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>${X.rng('موضع نقطة الارتكاز','mcFr',30,60,10,50,' cm')}
    <div class="p3-acts"><span class="p3-lab">الحمل:</span>${[6,12,24].map(w=>`<button class="p3-b" data-a="w" data-v="${w}">${w} N</button>`).join('')}</div>
    <div class="p3-acts"><span class="p3-lab">توقّعك: القوة اللازمة</span><button class="p3-b" data-a="p" data-v="lt">أقل من الحمل</button><button class="p3-b" data-a="p" data-v="eq">تساوي الحمل</button><button class="p3-b" data-a="p" data-v="gt">أكبر من الحمل</button></div>
    <div class="p3-acts"><button class="p3-b pri" data-a="pull">⬇ اسحب الميزان حتى تتزن</button><button class="p3-b" data-a="read">🔍 اقرأ القوة</button><button class="p3-b" data-a="rel">↺ أرخِ الميزان</button></div></div>`,
  report:()=>({rows:S.log.length?S.log.map((r,i)=>[String(i+1),String(r.f),String(r.f-XL),String(XE-r.f),String(r.W),r.F.toFixed(1)]):[['','','','','','']]})});
const L=new Lab(sec,{target:V(0,1.0,.5),dist:a=>Math.max(4.4,6.8/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
const U=.032;/* units per cm : 1 m stick = 3.2 units */const xs=cm=>(cm-50)*U;
const piv=new THREE.Group();L.add(piv);
const stick=new THREE.Mesh(new THREE.BoxGeometry(100*U+.06,.06,.18),new THREE.MeshStandardMaterial({map:canvasTex(2048,128,c=>{c.fillStyle='#f2d58c';c.fillRect(0,0,2048,128);c.fillStyle='#10302c';c.strokeStyle='#10302c';c.font='bold 30px "IBM Plex Mono",monospace';c.textAlign='center';
  for(let i=0;i<=100;i++){const x=24+i*20;c.lineWidth=i%10?2:4;c.beginPath();c.moveTo(x,0);c.lineTo(x,i%10?22:42);c.stroke();if(!(i%10))c.fillText(String(i),x,82);}}),roughness:.6}));stick.castShadow=true;piv.add(stick);
const PY=1.2;const wedge=new THREE.Mesh(new THREE.ConeGeometry(.2,.5,3),KIT.phys(0xe0703f,{roughness:.4}));wedge.rotation.y=Math.PI/6;wedge.castShadow=true;L.add(wedge);const ped=Y.box(.34,PY-.5-.06,.34,0x5c666d,{metalness:.4});L.add(ped);
const base=Y.box(3.7,.06,.6,0x2b3036);base.position.set(0,.03,.5);L.add(base);
/* load hanger */
const hang=new THREE.Group();{const str=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.35,6),KIT.mat(0x222222));str.position.y=-.2;hang.add(str);hang.userData.str=str;}piv.add(hang);
const masses=new THREE.Group();hang.add(masses);
function buildMass(){while(masses.children.length)masses.remove(masses.children[0]);const n=S.W/6;for(let i=0;i<n;i++){const d=Y.cyl(.14,.14,.07,0xb08a3a,32,{metalness:.7,roughness:.3});d.position.y=-.42-i*.075;masses.add(d);}
  const lb=P3.card([{t:S.W+' N',s:80}],.3,.13,{bd:'#ffffff'});lb.position.set(0,-.42-(n-1)*.0375,.16);masses.add(lb);}
/* spring balance at 80 cm, pulled down */
const sb=Y.springScale(50);sb.rotation.z=Math.PI;L.add(sb);const hand=Y.box(.2,.12,.12,0xe8c39e);L.add(hand);
let ang=0,ext=0;
function layout(){const fx=xs(S.f);piv.position.set(fx,PY,.5);wedge.position.set(fx,PY-.03-.25,.5);ped.position.set(fx,.06+(PY-.56)/2,.5);piv.rotation.z=ang;hang.position.set(xs(XL)-fx,-.03,0);hang.rotation.z=-ang;
  const tip=new THREE.Vector3(xs(XE)-fx,-.03,0).applyAxisAngle(V(0,0,1),ang).add(piv.position);const Fv=S.pulled?F():0;sb.userData.set(ext*Fv);sb.position.set(tip.x,tip.y-.03-sb.userData.hk,.5);hand.position.set(tip.x,sb.position.y-.1,.5);
  X.txt(sec,'mcA',(S.f-XL)+' cm');X.txt(sec,'mcB',(XE-S.f)+' cm');X.txt(sec,'mcW',S.W+' N');X.txt(sec,'mcF',S.read?F().toFixed(1)+' N':'—');}
const restAng=()=>{const t=S.W*(S.f-XL);return clamp(t/400,0,.32);};
async function setup(){S.pulled=false;S.read=false;ext=0;const a0=ang,a1=restAng();await L.tw(500,q=>{ang=a0+(a1-a0)*ease(q);layout();});render();}
function setFr(v){if(S.busy)return;S.f=v;sec.$('#mcFr-o').textContent=v+' cm';S.pred=null;sec.$$('[data-a="p"]').forEach(b=>b.setAttribute('aria-pressed',false));setup();}
function setW(v){if(S.busy)return;S.W=v;buildMass();sec.$$('[data-a="w"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));S.pred=null;sec.$$('[data-a="p"]').forEach(b=>b.setAttribute('aria-pressed',false));setup();}
function pred(v){if(S.pulled)return;S.pred=v;sec.$$('[data-a="p"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===v));P3.click();render();}
async function pull(){if(S.busy||S.pulled)return;if(!S.pred){toast('سجّل توقّعك أولًا.');return;}S.busy=true;const a0=ang;await L.tw(1400,q=>{ang=a0*(1-ease(q));ext=ease(q);S.pulled=true;layout();});S.busy=false;P3.click();toast('اتزنت الرافعة أفقيًا. اقرأ قراءة الميزان النابضي.');render();}
function read(){if(!S.pulled||S.read)return;S.read=true;const r={f:S.f,W:S.W,F:F()};const k=S.log.findIndex(x=>x.f===r.f&&x.W===r.W);if(k>=0)S.log[k]=r;else S.log.push(r);L.focus(V(sb.position.x+.5,sb.position.y+.5,2.3),V(sb.position.x,sb.position.y+.5,.5),800);layout();P3.good();renderNB();render();}
function rel(){if(S.busy)return;L.home(700);setup();}
function render(){const st=!S.pred?(S.pulled?3:1):!S.pulled?2:!S.read?3:4;let title,html;
  if(!S.pred){title='اضبط الرافعة ثم توقّع';html=`<p class="p3-txt">${CC.mach?CC.mach.hint:''} الحمل معلّق عند 20 cm، والميزان عند 80 cm.</p>`;}
  else if(!S.pulled){title='اسحب الميزان';html=`<p class="p3-txt">اسحب الميزان النابضي إلى أسفل حتى تصبح الرافعة أفقية.</p>`;}
  else if(!S.read){title='اقرأ القوة';html=`<p class="p3-txt">اضغط «اقرأ القوة» لتقترب الكاميرا من تدريج الميزان.</p>`;}
  else{const f=F(),ok=S.pred===(f<S.W-1e-9?'lt':Math.abs(f-S.W)<1e-9?'eq':'gt');title='الفائدة الآلية';html=`<p class="${ok?'p3-ok':'p3-txt'}">${ok?'توقّعك صحيح. ':'قارن توقّعك بالقراءة. '}القوة = <b>${f.toFixed(1)} N</b>. الفائدة الآلية = الحمل ÷ القوة = ${S.W} ÷ ${f.toFixed(1)} = <b>${(S.W/f).toFixed(2)}</b>. كلما طال ذراع القوة مقارنة بذراع المقاومة قلّت القوة اللازمة.</p>`;}
  sec.steps(NAMES,st,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>#</th><th>الارتكاز</th><th>ذ. المقاومة</th><th>ذ. القوة</th><th>الحمل</th><th>القوة</th><th>ف.آ</th></tr></thead><tbody>${S.log.length?S.log.map((r,i)=>`<tr><td>${i+1}</td><td class="n">${r.f}</td><td class="n">${r.f-XL}</td><td class="n">${XE-r.f}</td><td class="n">${r.W}</td><td class="n">${r.F.toFixed(1)}</td><td class="n">${(r.W/r.F).toFixed(2)}</td></tr>`).join(''):'<tr><td colspan="7">—</td></tr>'}</tbody></table><p class="x-note">الأطوال بوحدة cm والقوى بوحدة N.</p>`;}
X.side(sec,{w:b=>setW(+b.dataset.v),p:b=>pred(b.dataset.v),pull,read,rel});
sec.$('#mcFr').addEventListener('input',e=>setFr(+e.target.value));
S.W=12;buildMass();sec.$$('[data-a="w"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===12));ang=restAng();layout();render();renderNB();
};

/* =====================================================================
   الشغل: البكرات والمستوى المائل
   ===================================================================== */
const WORK={};EXP_MODS.work=WORK;
WORK.init=function(){gm();
const LOAD=20,H=.5;const MODES={direct:{n:'رفع مباشر',F:20,d:.5},fixed:{n:'بكرة ثابتة',F:20,d:.5},movable:{n:'بكرة متحركة',F:10,d:1.0},ramp1:{n:'مستوى مائل 1 m',F:10,d:1.0},ramp2:{n:'مستوى مائل 2 m',F:5,d:2.0}};
const S={mode:'direct',k:0,pulled:false,rF:false,rD:false,log:{},busy:false};P3.dbg.work=S;
const NAMES=['اختر الآلة','اسحب','اقرأ القوة','اقرأ المسافة','احسب الشغل'];
const sec=Y.sec('work',{grade:'أول متوسط',lesson:'الشغل والآلات البسيطة',
  hud:`<div class="p3-row">${X.m('قراءة الميزان','wkF',1)}${X.m('مسافة السحب','wkD')}</div><div class="p3-row">${X.m('ارتفاع الحمل','wkH')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">اختر الآلة</h4><div class="x-grid3" style="grid-template-columns:1fr 1fr">${Object.entries(MODES).map(([k,m])=>`<button class="p3-b" data-a="m" data-v="${k}">${m.n}</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b pri" data-a="pull">⬆ ارفع الحمل 0.5 m</button><button class="p3-b" data-a="rf">🔍 اقرأ القوة</button><button class="p3-b" data-a="rd">📏 اقرأ المسافة</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  report:()=>({rows:Object.keys(MODES).map(k=>{const r=S.log[k];return [MODES[k].n,r?'0.5':'',r?String(r.F):'',r?r.d.toFixed(1):''];})})});
const L=new Lab(sec,{target:V(0,1.0,.5),dist:a=>Math.max(4.6,7.2/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
const U=2;/* units per metre */
/* frame for pulleys */
const fr=new THREE.Group();{const sm=KIT.mat(0x2b3036,{metalness:.4});[-.7,.9].forEach(x=>{const p=Y.box(.08,3.6,.08,0x5c666d,{metalness:.5});p.position.set(x,1.8,0);fr.add(p);});const t=Y.box(1.7,.08,.08,0x5c666d,{metalness:.5});t.position.set(.1,3.6,0);fr.add(t);const b=Y.box(1.7,.06,.6,0x2b3036);b.position.set(0,.03,0);fr.add(b);castAll(fr);}
fr.position.set(-.9,0,.4);L.add(fr);
const pul=()=>{const g=new THREE.Group();const w=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.06,32),KIT.mat(0xd0a020,{metalness:.6}));w.rotation.x=Math.PI/2;const ax=Y.cyl(.025,.025,.1,0x333333,10);ax.rotation.x=Math.PI/2;g.add(w,ax);castAll(g);return g;};
const pFix=pul();const pMov=pul();L.add(pFix,pMov);
const block=Y.box(.38,.3,.32,0x8e969c,{metalness:.8,roughness:.3});L.add(block);const bl=P3.card([{t:'20 N',s:80}],.3,.13,{bd:'#ffffff'});block.add(bl);bl.position.set(0,0,.17);
const sb=Y.springScale(25);L.add(sb);
const ropeM=KIT.mat(0xe9e3cf);const ropes=[0,1,2,3].map(()=>{const r=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,1,6),ropeM);L.add(r);return r;});
function seg(r,a,b){if(!a){r.visible=false;return;}r.visible=true;const d=b.clone().sub(a);r.position.copy(a).add(b).multiplyScalar(.5);r.scale.y=Math.max(.001,d.length());r.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());}
/* ramps */
const rmp=new THREE.Group();L.add(rmp);const board=Y.box(1,.05,.42,0xc89a62);rmp.add(board);const sup=Y.box(.1,1,.42,0x8a5a2a);rmp.add(sup);
const hRuler=new THREE.Mesh(new THREE.PlaneGeometry(.12,1.1),new THREE.MeshStandardMaterial({map:canvasTex(96,512,c=>{c.fillStyle='#f6d34a';c.fillRect(0,0,96,512);c.fillStyle='#10302c';c.strokeStyle='#10302c';c.font='bold 22px monospace';for(let i=0;i<=10;i++){const y=490-i*44;c.lineWidth=3;c.beginPath();c.moveTo(0,y);c.lineTo(i%5?30:55,y);c.stroke();if(!(i%5))c.fillText((i/20).toFixed(2),40,y-4);}}),roughness:.7}));L.add(hRuler);
const BX=-.9,BZ=.4,Y0=.06+.15;
function geom(){const m=S.mode,k=S.k,lift=k*H*U,Md=MODES[m];const isR=m.startsWith('ramp');fr.visible=!isR;rmp.visible=isR;pFix.visible=m==='fixed';pMov.visible=m==='movable';
  hRuler.position.set(BX-.45,.6,BZ+.25);ropes.forEach(r=>r.visible=false);sb.userData.set(S.k>0?Md.F:0);const hk=sb.userData.hk;
  const TOPY=3.45,R=.16;
  if(!isR){const by=Y0+lift,top=by+.15;block.position.set(BX,by,BZ);block.rotation.z=0;
    if(m==='direct'){sb.rotation.z=0;const hy=top+.25;sb.position.set(BX,hy+hk,BZ);seg(ropes[0],V(BX,top,BZ),V(BX,hy,BZ));}
    else if(m==='fixed'){pFix.position.set(BX+R,TOPY,BZ);const end=3.2-k*H*U;sb.rotation.z=Math.PI;sb.position.set(BX+2*R,end-hk,BZ);
      seg(ropes[0],V(BX,top,BZ),V(BX,TOPY,BZ));seg(ropes[1],V(BX+2*R,TOPY,BZ),V(BX+2*R,end,BZ));}
    else{const my=top+.35;pMov.position.set(BX,my,BZ);pFix.visible=true;pFix.position.set(BX+2*R,TOPY,BZ);const end=3.25-k*Md.d*U;sb.rotation.z=Math.PI;sb.position.set(BX+3*R,end-hk,BZ);
      seg(ropes[0],V(BX-R,my,BZ),V(BX-R,3.6,BZ));seg(ropes[1],V(BX+R,my,BZ),V(BX+R,TOPY,BZ));seg(ropes[2],V(BX+3*R,TOPY,BZ),V(BX+3*R,end,BZ));seg(ropes[3],V(BX,top,BZ),V(BX,my-R,BZ));}}
  else{const Lr=m==='ramp1'?1:2,len=Lr*U,th=Math.asin(H/Lr),c=Math.cos(th),sn=Math.sin(th),RX=-2.3;rmp.position.set(RX,0,0);board.scale.x=len;board.position.set(len/2*c,len/2*sn+.02,BZ);board.rotation.z=th;sup.position.set(len*c,H*U/2,BZ);sup.scale.y=H*U;
    hRuler.position.set(RX+len*c+.2,.6,BZ+.25);
    const s0=.25,s=s0+k*(len-.55);const bx=RX+s*c-.15*sn,by=s*sn+.045+.15*c;block.position.set(bx,by,BZ);block.rotation.z=th;
    const hp=V(bx+.19*c+.25*c,by+.19*sn+.25*sn,BZ);sb.rotation.z=th-Math.PI/2;sb.position.copy(hp).add(V(hk*c,hk*sn,0));seg(ropes[0],V(bx+.19*c,by+.19*sn,BZ),hp);}
  X.txt(sec,'wkF',S.rF?Md.F+' N':'—');X.txt(sec,'wkD',S.rD?Md.d.toFixed(1)+' m':(k*Md.d).toFixed(2)+' m');X.txt(sec,'wkH',(k*H).toFixed(2)+' m');}
function setMode(k){if(S.busy)return;S.mode=k;S.k=0;S.pulled=S.rF=S.rD=false;sec.$$('[data-a="m"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===k));geom();view();sync();render();}
function view(){if(S.mode.startsWith('ramp'))L.focus(V(-.3,1.9,6.6),V(-.3,.6,.4),700);else L.focus(V(-.3,2.0,8.4),V(-.5,1.85,.4),700);}
async function pull(){if(S.busy||S.pulled)return;S.busy=true;sync();P3.whoosh();await L.tw(2200,q=>{S.k=ease(q);geom();});S.pulled=true;S.busy=false;sync();render();}
function rf(){if(!S.pulled)return;S.rF=true;const cp=new THREE.Vector3(0,-.45,0).applyQuaternion(sb.quaternion).add(sb.position);L.focus(V(cp.x+.4,cp.y+.1,BZ+1.9),cp,700);geom();P3.click();save();}
function rd(){if(!S.pulled)return;S.rD=true;geom();P3.click();save();}
function save(){if(S.rF&&S.rD){const Md=MODES[S.mode];S.log[S.mode]={F:Md.F,d:Md.d};P3.good();renderNB();}sync();render();}
function reset(){if(S.busy)return;S.log={};setMode('direct');renderNB();}
function render(){const st=!S.pulled?(S.busy?1:0):!S.rF?2:!S.rD?3:4,Md=MODES[S.mode];let title,html;
  if(!S.pulled){title='اختر الآلة واسحب';html=`<p class="p3-txt">${CC.work?CC.work.hint:''}</p>`;}
  else if(!S.rF){title='اقرأ القوة';html=`<p class="p3-txt">اقرأ قراءة الميزان النابضي أثناء رفع الحمل بـ${Md.n}.</p>`;}
  else if(!S.rD){title='اقرأ المسافة';html=`<p class="p3-txt">ما المسافة التي سُحب بها الحبل أو الحمل؟</p>`;}
  else{title='احسب الشغل';html=`<p class="p3-ok">الشغل = القوة × المسافة = ${Md.F} × ${Md.d.toFixed(1)} = <b>${(Md.F*Md.d).toFixed(1)} J</b>. والشغل اللازم لرفع الحمل مباشرة = 20 × 0.5 = 10 J. الآلة تقلل القوة أو تغيّر اتجاهها، لكنها لا تقلل الشغل.</p>`;}
  sec.steps(NAMES,st,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>الآلة</th><th>القوة</th><th>المسافة</th><th>الشغل</th></tr></thead><tbody>${Object.keys(MODES).map(k=>{const r=S.log[k];return `<tr><td>${MODES[k].n}</td><td class="n">${r?r.F+' N':'—'}</td><td class="n">${r?r.d.toFixed(1)+' m':'—'}</td><td class="n">${r?(r.F*r.d).toFixed(1)+' J':'—'}</td></tr>`;}).join('')}</tbody></table>`;}
function sync(){sec.$('[data-a="pull"]').disabled=S.busy||S.pulled;sec.$('[data-a="rf"]').disabled=!S.pulled||S.rF;sec.$('[data-a="rd"]').disabled=!S.pulled||S.rD;sec.$$('[data-a="m"]').forEach(b=>b.disabled=S.busy);}
X.side(sec,{m:b=>setMode(b.dataset.v),pull,rf,rd,reset});
setMode('direct');renderNB();
};

/* =====================================================================
   قياس الكثافة: يطفو أم يغوص؟
   ===================================================================== */
const DENS={};EXP_MODS.dens=DENS;
DENS.init=function(){gm();
const V1=50;const OBJS=[{id:'al',n:'مكعب ألومنيوم',V:10,m:27.0,c:0xc4ccd4,met:.8,shape:'cube',w:2.2,h:2.2},{id:'cu',n:'مكعب نحاس',V:10,m:89.6,c:0xb8713a,met:.8,shape:'cube',w:2.2,h:2.2},
  {id:'wd',n:'قطعة خشب',V:20,m:12.0,c:0xc38b4f,met:0,shape:'block',w:2.4,h:3.4},{id:'st',n:'حجر',V:15,m:39.0,c:0x8b8173,met:0,shape:'stone',w:3.2,h:2.2},{id:'wx',n:'قطعة شمع',V:20,m:18.0,c:0xefe6c8,met:0,shape:'candle',w:2.3,h:3.6}];
const rho=o=>o.m/o.V;const S={cur:null,stage:0,pred:null,pushed:false,res:{},busy:false};P3.dbg.dens=S;
/* stage: 0 choose,1 on balance,2 mass read,3 V1 read,4 predicted,5 dropped,6 V2 read,7 tank tested */
const NAMES=['اختر','على الميزان','المنسوب الأول','توقّع واغمر','المنسوب الثاني','الكثافة'];
const sec=Y.sec('dens',{grade:'أول متوسط',lesson:'الخواص والتغيرات الفيزيائية',
  hud:`<div class="p3-row">${X.m('الميزان','dsM',1)}${X.m('منسوب الماء في المخبار','dsV')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">اختر العيّنة</h4><div class="x-grid3">${OBJS.map(o=>`<button class="p3-b" data-a="o" data-v="${o.id}">${o.n}</button>`).join('')}</div></div>
    <div class="p3-box"><h4 class="p3-h">خطوات القياس</h4><div class="p3-acts">
    <button class="p3-b" data-a="bal">⚖ ضعها على الميزان</button><button class="p3-b" data-a="v1">🔍 اقرأ منسوب الماء</button></div>
    <div class="p3-acts"><span class="p3-lab">توقّع:</span><button class="p3-b" data-a="p" data-v="float">ستطفو</button><button class="p3-b" data-a="p" data-v="sink">ستغوص</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="drop">⬇ اغمرها في المخبار</button><button class="p3-b" data-a="push">📍 اغمرها بقضيب رفيع</button><button class="p3-b" data-a="v2">🔍 اقرأ المنسوب الجديد</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="tank">🌊 ضعها في حوض الماء</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  report:()=>({rows:OBJS.map(o=>{const r=S.res[o.id]||{};return [o.n,r.m!=null?r.m.toFixed(1):'',r.v1!=null?String(r.v1):'',r.v2!=null?String(r.v2):'',r.tank||''];})})});
const L=new Lab(sec,{target:V(0,.75,.5),dist:a=>Math.max(4.4,6.9/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
const SC=.14;/* units per cm */
/* balance */
const bal=new THREE.Group();{const b=Y.box(.9,.16,.75,0xf0f0ee,{phys:true,roughness:.35});b.position.y=.08;const p=Y.cyl(.32,.32,.025,0xb9c0c4,32,{metalness:.8});p.position.y=.18;bal.add(b,p);castAll(bal);}bal.position.set(-1.7,0,.5);L.add(bal);
const lcd=KIT.lcd(.5,.15);lcd.m.position.set(-1.7,.1,.885);lcd.m.rotation.x=-.3;L.add(lcd.m);lcd.set('0.0 g');
/* graduated cylinder 100 mL */
const CR=.25,AREA=Math.PI*CR*CR,PERML=Math.pow(SC,3)/AREA,CH=110*PERML+.15;
const cyl=X.vessel(CR+.022,CH,{level:V1*PERML,col:0x6fb7e6});cyl.g.position.set(0,.06,.5);L.add(cyl.g);
const cbase=Y.cyl(.36,.4,.06,0x2b3036,32);cbase.position.set(0,.03,.5);L.add(cbase);
const gtex=canvasTex(256,1024,c=>{c.clearRect(0,0,256,1024);c.fillStyle='#10302c';c.strokeStyle='#10302c';c.font='bold 40px "IBM Plex Mono",monospace';
  const y0=1024-1024*(.022/CH),per=1024*PERML/CH;for(let v=0;v<=100;v+=2){const y=y0-v*per;c.lineWidth=v%10?3:6;c.beginPath();c.moveTo(0,y);c.lineTo(v%10?50:95,y);c.stroke();if(!(v%10))c.fillText(String(v),104,y+14);}});
const gm2=new THREE.Mesh(new THREE.CylinderGeometry(CR+.03,CR+.03,CH,32,1,true,-.55,1.1),new THREE.MeshBasicMaterial({map:gtex,transparent:true,depthWrite:false}));gm2.position.set(0,.06+CH/2,.5);gm2.renderOrder=7;L.add(gm2);gm2.userData.noEdge=1;
/* tank */
const tank=X.glassBox(1.0,.7,.6);tank.position.set(1.75,0,.4);L.add(tank);const tw=new THREE.Mesh(new THREE.BoxGeometry(.97,.55,.57),G.water(0x6fb7e6,.5));tw.position.set(1.75,.04+.275,.4);L.add(tw);
L.label('حوض الماء',V(1.75,.85,.7),'');L.label('المخبار المدرّج',V(0,CH+.3,.5),'');L.label('الميزان',V(-1.7,.5,.5),'');
/* objects */
const mk=o=>{let m;const w=o.w*SC,h=o.h*SC;const mat=KIT.mat(o.c,{metalness:o.met,roughness:o.met?.3:.75});
  if(o.shape==='cube')m=new THREE.Mesh(RBox(w,w,w,.015),mat);else if(o.shape==='block')m=new THREE.Mesh(RBox(w,h,w*.8,.015),mat);
  else if(o.shape==='stone'){m=new THREE.Mesh(new THREE.DodecahedronGeometry(1,1),mat);m.scale.set(w/2,h/2,w/2.4);}else m=new THREE.Mesh(new THREE.CylinderGeometry(w/2,w/2,h,24),mat);
  m.castShadow=true;m.userData.h=o.shape==='stone'?h:o.shape==='cube'?w:h;return m;};
const OM={};OBJS.forEach((o,i)=>{const m=mk(o);const home=V(-1.25+i*.55+.0,0,1.55);m.position.set(home.x,m.userData.h/2,home.z);L.add(m);OM[o.id]={m,home:m.position.clone()};
  const c=P3.card([{t:o.n,s:44}],.5,.13,{bd:'#ffffff'});c.position.set(home.x,.012,1.85);c.rotation.x=-1.2;L.add(c);L.onTap(m,()=>pick(o.id));});
let level=V1,sub=0;
function setLvl(v){level=v;cyl.set(v*PERML);X.txt(sec,'dsV',S.stage>=3?(S.stage>=6||S.stage<5?Math.round(v)+' mL':'—'):'—');}
function pick(id){if(S.busy)return;if(S.cur&&S.cur!==id)home(S.cur);S.cur=id;S.stage=0;S.pred=null;S.pushed=false;setLvl(V1);lcd.set('0.0 g');sec.$$('[data-a="o"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===id));sec.$$('[data-a="p"]').forEach(b=>b.setAttribute('aria-pressed',false));P3.click();L.home(600);sync();render();}
function home(id){const o=OM[id];o.m.position.copy(o.home);o.m.rotation.set(0,0,0);}
async function onBal(){const o=OBJS.find(x=>x.id===S.cur),m=OM[o.id].m;S.busy=true;sync();await L.arc(m,V(-1.7,.19+m.userData.h/2,.5),700,1.2);
  await L.tw(800,q=>lcd.set((o.m*q).toFixed(1)+' g'));lcd.set(o.m.toFixed(1)+' g');X.txt(sec,'dsM',o.m.toFixed(1)+' g');S.res[o.id]=S.res[o.id]||{};S.res[o.id].m=o.m;S.stage=2;S.busy=false;P3.good();sync();render();renderNB();}
function v1(){if(S.stage!==2)return;S.stage=3;S.res[S.cur].v1=V1;setLvl(V1);L.focus(V(.6,.06+V1*PERML+.3,1.6),V(0,.06+V1*PERML,.5),800);P3.click();sync();render();renderNB();}
function pred(v){if(S.stage!==3&&S.stage!==4)return;S.pred=v;S.stage=4;sec.$$('[data-a="p"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===v));P3.click();sync();render();}
async function drop(){if(S.stage!==4||S.busy)return;const o=OBJS.find(x=>x.id===S.cur),m=OM[o.id].m,h=m.userData.h;S.busy=true;sync();L.home(600);lcd.set('0.0 g');
  await L.arc(m,V(0,.06+CH+.25,.5),700,1.2);const fl=rho(o)<1;const wTop=()=>.06+.022+level*PERML;
  const yBot=.06+.03+h/2;const yFl=()=>wTop()-h*rho(o)+h/2;
  await L.tw(1100,q=>{const target=fl?yFl():yBot;m.position.y=.06+CH+.25+(target-(.06+CH+.25))*ease(q);const subH=clamp(wTop()-(m.position.y-h/2),0,h);const vs=o.V*(subH/h);setLvl(V1+(fl?Math.min(vs,o.m):vs));});
  if(fl){setLvl(V1+o.m);m.position.y=yFl();toast('الجسم طافٍ! جزء منه فوق سطح الماء. اغمره بقضيب رفيع حتى يختفي تحت السطح.');}
  S.stage=5;S.busy=false;P3.splash&&P3.splash();sync();render();}
async function push(){const o=OBJS.find(x=>x.id===S.cur);if(S.stage!==5||rho(o)>=1||S.pushed)return;const m=OM[o.id].m,h=m.userData.h;S.busy=true;const y0=m.position.y;
  await L.tw(900,q=>{m.position.y=y0-(y0-(.06+.022+(V1+o.V)*PERML-h/2-.02))*ease(q);setLvl(V1+o.m+(o.V-o.m)*ease(q));});S.pushed=true;S.busy=false;sync();render();}
function v2(){const o=OBJS.find(x=>x.id===S.cur);if(S.stage!==5)return;if(rho(o)<1&&!S.pushed){toast('اغمر الجسم كاملًا أولًا.');return;}S.stage=6;setLvl(V1+o.V);S.res[o.id].v2=V1+o.V;L.focus(V(.6,.06+level*PERML+.3,1.6),V(0,.06+level*PERML,.5),800);P3.good();sync();render();renderNB();}
async function tankT(){if(S.stage!==6||S.busy)return;const o=OBJS.find(x=>x.id===S.cur),m=OM[o.id].m,h=m.userData.h;S.busy=true;sync();L.home(600);setLvl(V1);
  await L.arc(m,V(1.75,1.0,.4),800,1.2);const fl=rho(o)<1,wt=.04+.55;await L.tw(1000,q=>{m.position.y=1.0+((fl?wt-h*rho(o)+h/2:.06+h/2)-1.0)*ease(q);});
  S.res[o.id].tank=fl?'طفت':'غاصت';S.stage=7;S.busy=false;P3.click();sync();render();renderNB();}
function reset(){if(S.busy)return;OBJS.forEach(o=>home(o.id));S.res={};S.cur=null;S.stage=0;setLvl(V1);lcd.set('0.0 g');X.txt(sec,'dsM','—');L.home(600);sec.$$('[data-a="o"]').forEach(b=>b.setAttribute('aria-pressed',false));sync();render();renderNB();}
function render(){const o=OBJS.find(x=>x.id===S.cur);const st=S.stage<=1?(S.cur?1:0):S.stage<=3?2:S.stage<=5?3:S.stage===6?4:5;let title,html;
  if(!o){title='اختر عيّنة';html=`<p class="p3-txt">${CC.dens?CC.dens.hint:''}</p>`;}
  else if(S.stage<2){title='على الميزان';html=`<p class="p3-txt">ضع ${o.n} على الميزان الرقمي واقرأ كتلته.</p>`;}
  else if(S.stage===2){title='اقرأ منسوب الماء';html=`<p class="p3-txt">الكتلة = <b>${o.m.toFixed(1)} g</b>. اقرأ الآن منسوب الماء في المخبار قبل الغمر.</p>`;}
  else if(S.stage===3){title='توقّع';html=`<p class="p3-txt">منسوب الماء = <b>${V1} mL</b>. هل تتوقع أن تطفو ${o.n} أم تغوص؟</p>`;}
  else if(S.stage===4){title='اغمرها في المخبار';html=`<p class="p3-txt">اغمر العيّنة في المخبار وراقب ارتفاع الماء.</p>`;}
  else if(S.stage===5){title='اقرأ المنسوب الجديد';html=`<p class="p3-txt">${rho(o)<1&&!S.pushed?'العيّنة طافية؛ اغمرها بالقضيب الرفيع أولًا.':'اقرأ منسوب الماء بعد الغمر.'}</p>`;}
  else{const r=S.res[o.id],v=r.v2-r.v1,d=o.m/v;const ok=S.pred===(d<1?'float':'sink');title='الكثافة';html=`<p class="${ok?'p3-ok':'p3-txt'}">الحجم = ${r.v2} − ${r.v1} = <b>${v} cm³</b>. الكثافة = ${o.m.toFixed(1)} ÷ ${v} = <b>${d.toFixed(2)} g/cm³</b>، وهي ${d<1?'أقل':'أكبر'} من كثافة الماء (1 g/cm³) فـ${d<1?'تطفو':'تغوص'}. ${ok?'توقّعك صحيح.':''}${S.stage===6?' جرّبها في حوض الماء.':''}</p>`;}
  sec.steps(NAMES,st,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>العيّنة</th><th>الكتلة</th><th>قبل</th><th>بعد</th><th>الكثافة</th><th>الحوض</th></tr></thead><tbody>${OBJS.map(o=>{const r=S.res[o.id]||{};return `<tr><td>${o.n}</td><td class="n">${r.m!=null?r.m.toFixed(1)+' g':'—'}</td><td class="n">${r.v1!=null?r.v1:'—'}</td><td class="n">${r.v2!=null?r.v2:'—'}</td><td class="n">${r.v2!=null?(o.m/(r.v2-r.v1)).toFixed(2):'—'}</td><td>${r.tank||'—'}</td></tr>`;}).join('')}</tbody></table><p class="x-note">الحجوم بوحدة mL (cm³).</p>`;}
function sync(){const b=S.busy,st=S.stage,o=OBJS.find(x=>x.id===S.cur);const d=(a,c)=>{const e=sec.$(`[data-a="${a}"]`);if(e)e.disabled=b||!c;};
  d('bal',o&&st<2);d('v1',st===2);d('drop',st===4);d('push',st===5&&o&&rho(o)<1&&!S.pushed);d('v2',st===5);d('tank',st===6);sec.$$('[data-a="p"]').forEach(x=>x.disabled=b||!(st===3||st===4));sec.$$('[data-a="o"]').forEach(x=>x.disabled=b);}
X.side(sec,{o:b=>pick(b.dataset.v),bal:onBal,v1,p:b=>pred(b.dataset.v),drop,push,v2,tank:tankT,reset});
sync();render();renderNB();
};

/* =====================================================================
   التغيرات الفيزيائية والكيميائية
   ===================================================================== */
const CHG={};EXP_MODS.chg=CHG;
CHG.init=function(){gm();
const EV={state:'تغيّر الحالة',dissolve:'ذوبان المادة',shape:'تغيّر الشكل أو الحجم',gas:'تصاعد غاز',color:'تكوّن مادة جديدة بلون مختلف',ppt:'تكوّن راسب'};const TYPE={phys:'فيزيائي',chem:'كيميائي'};
const STN=[{id:'ice',name:'انصهار مكعب ثلج',act:'سخّن الثلج',type:'phys',ev:'state',see:'تحوّل مكعب الثلج الصلب إلى ماء سائل عند التسخين.'},
  {id:'soda',name:'الخل وبيكربونات الصوديوم',act:'أسقط البيكربونات في الخل',type:'chem',ev:'gas',see:'ظهرت فقاعات ورغوة بسرعة، وانتفخ البالون.'},
  {id:'paper',name:'تمزيق ورقة',act:'مزّق الورقة',type:'phys',ev:'shape',see:'انقسمت الورقة إلى قطع أصغر.'},
  {id:'rust',name:'مسمار حديد في ماء مالح',act:'مرّر 5 أيام',type:'chem',ev:'color',see:'بعد 5 أيام ظهرت طبقة بنية محمرّة على المسمار، وتغيّر لون الماء، وترسّبت مادة بنية في القاع.'},
  {id:'sugar',name:'إذابة السكر في الماء',act:'أضف السكر وحرّك',type:'phys',ev:'dissolve',see:'اختفت بلورات السكر في الماء مع التحريك، وبقي المحلول شفافًا.'},
  {id:'ppt',name:'خلط محلولين شفافين',act:'اخلط المحلولين',type:'chem',ev:'ppt',see:'عند خلط المحلولين الشفافين أصبح الخليط أبيض عكرًا، ثم استقرت مادة صلبة بيضاء في القاع.'}];
const S={cur:'ice',done:{},ans:{},busy:false};P3.dbg.chg=S;
const NAMES=['اختر التجربة','نفّذها','لاحظ','صنّف'];
const sec=Y.sec('chg',{grade:'أول متوسط',lesson:'الخواص والتغيرات الكيميائية',
  hud:`<div class="p3-row">${X.m('التجارب المنفّذة','cgN',1)}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">اختر التجربة</h4><div class="x-grid3" style="grid-template-columns:1fr 1fr">${STN.map(s=>`<button class="p3-b" data-a="s" data-v="${s.id}">${s.name}</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b pri" data-a="act">▶ نفّذ</button></div><div class="cgCls"></div></div>`,
  report:()=>({rows:STN.map(s=>[s.name,S.done[s.id]?s.see:''])})});
const L=new Lab(sec,{target:V(0,.55,.5),dist:a=>Math.max(4.8,7.6/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
const POS={ice:V(-1.6,0,-.1),soda:V(0,0,-.1),paper:V(1.6,0,-.1),rust:V(-1.6,0,1.25),sugar:V(0,0,1.25),ppt:V(1.6,0,1.25)};
STN.forEach(s=>{const t=Y.box(1.2,.04,.95,0xe9ecee);t.position.copy(POS[s.id]).add(V(0,.02,0));L.add(t);const c=P3.card([{t:s.name,s:42}],.95,.14,{bd:'#ffffff'});c.position.copy(POS[s.id]).add(V(0,.05,.58));c.rotation.x=-1.1;L.add(c);});
const ring=new THREE.Mesh(new THREE.RingGeometry(.62,.7,48),new THREE.MeshBasicMaterial({color:0xe0703f}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;L.scene.add(ring);
/* ice */
const P0=POS.ice;const glassW=new THREE.Mesh(new THREE.CylinderGeometry(.34,.24,.05,32),G.glassT);glassW.position.copy(P0).add(V(0,.32,0));L.add(glassW);
const heater=Y.box(.5,.25,.5,0x2b3036);heater.position.copy(P0).add(V(0,.17,0));L.add(heater);const coil=new THREE.Mesh(new THREE.TorusGeometry(.15,.02,8,32),new THREE.MeshStandardMaterial({color:0x3a1a12,emissive:0}));coil.rotation.x=Math.PI/2;coil.position.copy(P0).add(V(0,.3,0));L.add(coil);
const ice=new THREE.Mesh(RBox(.22,.22,.22,.04),new THREE.MeshPhysicalMaterial({color:0xcfe9f7,roughness:.1,transparent:true,opacity:.75,clearcoat:1}));ice.position.copy(P0).add(V(0,.47,0));L.add(ice);
const pud=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.02,32),G.water(0x6fb7e6,.7));pud.position.copy(P0).add(V(0,.35,0));pud.scale.set(.01,1,.01);L.add(pud);
/* soda */
const P1=POS.soda;const fl1=X.vessel(.28,.55,{level:.25,col:0xeef3f4});fl1.g.position.copy(P1);L.add(fl1.g);
const ball=new THREE.Mesh(new THREE.SphereGeometry(.16,24,18),KIT.phys(0xe0607a,{roughness:.35,clearcoat:.6}));ball.scale.set(.7,.5,.7);ball.position.copy(P1).add(V(0,.62,0));L.add(ball);
const foam=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,1,32),new THREE.MeshStandardMaterial({color:$lc(0xfaf6ee),roughness:.9}));foam.visible=false;L.add(foam);const bub1=Bubbles(80,{op:.8});L.scene.add(bub1.mesh);
/* paper */
const P2=POS.paper;const pieces=[];[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.3,.006,.4),KIT.mat(0xfbfaf4,{roughness:.9}));p.position.copy(P2).add(V(a*.15,.05,b*.2));p.userData.h=p.position.clone();L.add(p);pieces.push(p);});
/* rust */
const P3p=POS.rust;const bk2=X.vessel(.3,.55,{level:.38,col:0xdbe9ef});bk2.g.position.copy(P3p);L.add(bk2.g);
const nail=new THREE.Group();{const sh=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.5,12),KIT.mat(0x9aa3a8,{metalness:.85,roughness:.3}));const hd=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.02,16),sh.material);hd.position.y=.25;nail.add(sh,hd);nail.userData.m=sh.material;}
nail.position.copy(P3p).add(V(0,.3,0));nail.rotation.z=.25;L.add(nail);const sedi=new THREE.Mesh(new THREE.CylinderGeometry(.26,.26,.03,32),KIT.mat(0x8a4a1c,{roughness:.9}));sedi.position.copy(P3p).add(V(0,.05,0));sedi.visible=false;L.add(sedi);
/* sugar */
const P4=POS.sugar;const bk3=X.vessel(.3,.55,{level:.36,col:0xdbe9ef});bk3.g.position.copy(P4);L.add(bk3.g);
const cubes=[];for(let i=0;i<6;i++){const c=new THREE.Mesh(RBox(.07,.07,.07,.01),KIT.mat(0xffffff,{roughness:.6}));c.position.copy(P4).add(V(.45+(i%3)*.09,.04,-.15+Math.floor(i/3)*.09));c.userData.h=c.position.clone();L.add(c);cubes.push(c);}
/* ppt */
const P5=POS.ppt;const bk4=X.vessel(.3,.55,{level:.0,col:0xeef3f4});bk4.g.position.copy(P5);L.add(bk4.g);
const tA=TestTube(.07,.5),tB=TestTube(.07,.5);tA.seg(0,.3);tB.seg(0,.3);setCol(tA.lm,0xe9f1f4);setCol(tB.lm,0xe9f1f4);tA.g.position.copy(P5).add(V(-.48,0,0));tB.g.position.copy(P5).add(V(.48,0,0));L.add(tA.g,tB.g);
const ppt=new THREE.Mesh(new THREE.CylinderGeometry(.26,.26,.04,32),KIT.mat(0xffffff,{roughness:.9}));ppt.position.copy(P5).add(V(0,.05,0));ppt.visible=false;L.add(ppt);
P3.loop(L,(dt,t)=>{bub1.update(dt,t);});
function pick(id){if(S.busy)return;S.cur=id;ring.position.x=POS[id].x;ring.position.z=POS[id].z;sec.$$('[data-a="s"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===id));sec.$('[data-a="act"]').textContent='▶ '+STN.find(s=>s.id===id).act;L.focus(POS[id].clone().add(V(0,1.6,2.4)),POS[id].clone().add(V(0,.3,0)),700);sync();render();}
async function act(){const id=S.cur;if(S.busy||S.done[id])return;S.busy=true;sync();const P=POS[id];
  if(id==='ice'){coil.material.emissive.setRGB(.9,.25,.05);await L.tw(3200,q=>{ice.scale.setScalar(Math.max(.02,1-q));ice.position.y=P.y+.36+.11*(1-q);pud.scale.set(.1+q*.9,1,.1+q*.9);});ice.visible=false;coil.material.emissive.setRGB(0,0,0);}
  if(id==='soda'){await L.tw(500,q=>ball.rotation.z=q*Math.PI*.9);foam.visible=true;P3.noise(1.6,.6,1500,.4);
    await L.tw(2600,q=>{for(let k=0;k<3;k++)bub1.spawn(P.x+(Math.random()-.5)*.4,P.y+.05,P.z+(Math.random()-.5)*.4,.01+Math.random()*.02,P.y+.5,.5);foam.scale.y=.05+q*.25;foam.position.set(P.x,P.y+.27+foam.scale.y/2,P.z);ball.scale.set(.7+q*.9,.5+q*1.1,.7+q*.9);ball.position.y=P.y+.62+q*.2;});}
  if(id==='paper'){P3.noise(.4,.4,2500,.5);await L.tw(1200,q=>pieces.forEach((p,i)=>{p.position.copy(p.userData.h).add(V((i%2?1:-1)*q*.25,q*.1*Math.sin(q*Math.PI),(i<2?-1:1)*q*.15));p.rotation.y=q*(i-1.5)*.5;}));}
  if(id==='rust'){await L.tw(3000,q=>{nail.userData.m.color.copy($lc(0x9aa3a8)).lerp($lc(0x8a3a14),q);nail.userData.m.metalness=.85-.6*q;bk2.lm.color.copy($lc(0xdbe9ef)).lerp($lc(0xc98a4a),q*.7);});sedi.visible=true;}
  if(id==='sugar'){for(const c of cubes){await L.arc(c,P.clone().add(V((Math.random()-.5)*.2,.3,(Math.random()-.5)*.2)),300,1.2);}await L.tw(2400,q=>cubes.forEach(c=>c.scale.setScalar(Math.max(.01,1-q))));cubes.forEach(c=>c.visible=false);}
  if(id==='ppt'){for(const [tt,sx] of [[tA,-1],[tB,1]]){await L.arc(tt.g,P.clone().add(V(sx*.12,.7,0)),600,1.2);await L.tw(400,q=>tt.g.rotation.z=-sx*q*2);await L.tw(800,q=>{tt.seg(0,.3*(1-q));bk4.set((sx<0?0:.16)+.16*q);});await L.tw(300,q=>tt.g.rotation.z=-sx*2*(1-q));tt.g.position.copy(P).add(V(sx*.48,0,0));}
    await L.tw(1200,q=>{bk4.lm.color.copy($lc(0xeef3f4)).lerp($lc(0xf6f6f2),q);bk4.lm.opacity=.4+.55*q;});ppt.visible=true;await L.tw(1600,q=>{bk4.lm.opacity=.95-.45*q;ppt.scale.y=q;});}
  S.done[id]=true;S.busy=false;P3.good();toast(STN.find(s=>s.id===id).see);sync();render();renderNB();}
sec.$('.p3-side').addEventListener('change',e=>{const sl=e.target.closest('select');if(!sl)return;S.ans[S.cur]=S.ans[S.cur]||{};S.ans[S.cur][sl.dataset.k]=sl.value;render();});
function chk(){const s=STN.find(x=>x.id===S.cur),a=S.ans[s.id]||{};const ok=a.ev===s.ev&&a.ty===s.type;a.ok=ok;S.ans[s.id]=a;if(ok){P3.good();toast(s.name+': تغيّر '+TYPE[s.type]+'.');}else toast('راجع: هل تكوّنت مادة جديدة لها خواص مختلفة؟');render();renderNB();}
function render(){const s=STN.find(x=>x.id===S.cur),dn=S.done[s.id],a=S.ans[s.id]||{};const st=!dn?(S.busy?1:0):a.ok?3:2;let title=s.name,html;
  if(!dn)html=`<p class="p3-txt">${CC.chg?CC.chg.hint:''} اضغط «${s.act}».</p>`;else html=`<p class="${a.ok?'p3-ok':'p3-txt'}">${s.see}${a.ok?' — تغيّر <b>'+TYPE[s.type]+'</b>.':''}</p>`;
  sec.steps(NAMES,st,title,html);X.txt(sec,'cgN',Object.keys(S.done).length+' / 6');
  sec.$('.cgCls').innerHTML=dn&&!a.ok?`<table class="p3-t"><tbody><tr><td>الدليل</td><td><select data-k="ev"><option value="">اختر</option>${Object.entries(EV).map(([k,v])=>`<option value="${k}" ${a.ev===k?'selected':''}>${v}</option>`).join('')}</select></td></tr><tr><td>نوع التغيّر</td><td><select data-k="ty"><option value="">اختر</option>${Object.entries(TYPE).map(([k,v])=>`<option value="${k}" ${a.ty===k?'selected':''}>${v}</option>`).join('')}</select></td></tr></tbody></table><div class="p3-acts"><button class="p3-b pri" data-a="chk">تحقّق</button></div>`:'';}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>التغيير</th><th>ماذا لاحظنا؟</th><th>النوع</th></tr></thead><tbody>${STN.map(s=>`<tr><td>${s.name}</td><td>${S.done[s.id]?s.see:'—'}</td><td>${S.ans[s.id]&&S.ans[s.id].ok?TYPE[s.type]:'—'}</td></tr>`).join('')}</tbody></table>`;}
function sync(){sec.$('[data-a="act"]').disabled=S.busy||!!S.done[S.cur];sec.$$('[data-a="s"]').forEach(b=>{b.disabled=S.busy;b.classList.toggle('done',!!S.done[b.dataset.v]);});}
X.side(sec,{s:b=>pick(b.dataset.v),act,chk});
pick('ice');renderNB();
};

X.reg(['motn','newt','mach','work','dens','chg']);
})();
