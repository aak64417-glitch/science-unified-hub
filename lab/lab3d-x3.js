/* =====================================================================
   المختبر الافتراضي الذكي — حزمة التجارب الجديدة (٣)
   ثالث متوسط ف١: لزوجة الصهارة ونوع الثوران
   ثالث متوسط ف٢: التوصيل في المركبات الأيونية والتساهمية · الزخم والتصادمات ·
                  صاروخ البالون · المجال المغناطيسي · المغناطيس الكهربائي
   إعداد أ. علي البقاشي — مدرسة أبي الدرداء المتوسطة
   ===================================================================== */
(function(){
'use strict';
if(typeof THREE==='undefined'||typeof Lab==='undefined'||!window.P3X||!window.X3)return;
const {P3,G,gm,Bubbles,setCol,$lc,sleep,hex6,clamp,show}=window.P3X;const {X}=window.X3;

/* =====================================================================
   ١٣) لزوجة الصهارة ونوع الثوران البركاني (ثالث متوسط · البراكين)
   ===================================================================== */
const VOLC={};EXP_MODS.volc9=VOLC;
VOLC.init=function(){gm();
const TYPES=[{k:'b',n:'بازلتية',si:48,visc:'منخفضة',er:'هادئ: تدفقات وينابيع من اللابة',shape:'بركان درعي واسع قليل الانحدار'},{k:'a',n:'أنديزيتية',si:60,visc:'متوسطة',er:'متوسط: انفجارات متقطعة وتدفقات قصيرة',shape:'بركان مركّب (طبقي)'},{k:'r',n:'ريوليتية (غنية بالسيليكا)',si:72,visc:'عالية جدًا',er:'انفجاري عنيف: رماد وقذائف بركانية',shape:'بركان مخروطي شديد الانحدار أو قبة'}];
const S={ti:0,busy:false,P:0,log:{},erupting:false};P3.dbg.volc9=S;
const NAMES=['اختر نوع الصهارة','ابدأ الثوران','جرّب الأنواع الثلاثة','استنتج'];
const sec=P3.section('volc9',{title:'لزوجة الصهارة ونوع الثوران البركاني',grade:'ثالث متوسط',lesson:'البراكين',
  hud:`<div class="p3-row">${X.m('نسبة السيليكا','vSi',1)}${X.m('لزوجة الصهارة','vVi')}</div><div class="p3-row">${X.m('ضغط الغازات','vP',1)}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts" style="flex-direction:column;align-items:stretch">${TYPES.map((t,i)=>`<button class="p3-b" data-a="t" data-i="${i}">${t.n} · سيليكا ${t.si}%</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b pri" data-a="go">🌋 ابدأ الثوران</button><button class="p3-b" data-a="reset">↺ إعادة</button></div>
    <p class="x-note">كلما زادت نسبة السيليكا زادت لزوجة الصهارة (مقاومتها للتدفق)، فتُحبس الغازات داخلها ويرتفع ضغطها.</p></div>`,
  learn:`<div class="panel"><h3>ما الذي يحدد نوع الثوران؟</h3><p>يعتمد نوع الثوران على <b>تركيب الصهارة</b>، وخاصة نسبة <b>السيليكا</b> وكمية <b>بخار الماء والغازات</b> فيها.</p>
    <p>الصهارة <b>البازلتية</b> قليلة السيليكا ومنخفضة اللزوجة، تتسرب منها الغازات بسهولة فيكون الثوران <b>هادئًا</b> وتتدفق اللابة مسافات بعيدة فتبني <b>براكين درعية</b>. ومن أمثلتها حرّات المملكة مثل <b>حرة رهط</b>.</p>
    <p>أما الصهارة الغنية بالسيليكا فلزجة جدًا تحبس الغازات حتى يرتفع ضغطها فتنفجر <b>انفجارًا عنيفًا</b> يقذف الرماد والقطع الصخرية.</p></div>`,
  quiz:[{q:'الصهارة الغنية بالسيليكا تكون:',o:['منخفضة اللزوجة','عالية اللزوجة','بلا غازات'],a:1},{q:'أي أنواع الصهارة يسبب ثورانًا هادئًا تتدفق فيه اللابة بعيدًا؟',o:['البازلتية','الريوليتية','الأنديزيتية'],a:0},
        {q:'لماذا تنفجر البراكين ذات الصهارة اللزجة بعنف؟',o:['لأن الغازات تُحبس داخلها فيرتفع ضغطها','لأنها أبرد','لأنها لا تحتوي على غازات'],a:0},{q:'حرّات المملكة العربية السعودية مثل حرة رهط تكوّنت من صهارة:',o:['ريوليتية','بازلتية','جرانيتية'],a:1}],
  report:()=>({title:'لزوجة الصهارة ونوع الثوران',grade:'ثالث متوسط',lesson:'البراكين',cols:['نوع الصهارة','السيليكا','اللزوجة','نوع الثوران','شكل البركان'],
    rows:TYPES.map(t=>S.log[t.k]?[t.n,t.si+'%',t.visc,t.er,t.shape]:[t.n,'','','','']),note:'ما العلاقة بين نسبة السيليكا ولزوجة الصهارة وشدة الثوران؟'})
});
const L=new Lab(sec,{target:V(0,.9,.3),dist:a=>Math.max(5.4,8.4/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* volcano model (morphing lathe) */
const rockT=canvasTex(512,512,c=>{c.fillStyle='#5b4a3e';c.fillRect(0,0,512,512);for(let i=0;i<6000;i++){const v=40+Math.random()*60|0;c.fillStyle=`rgba(${v+20},${v+8},${v},.5)`;c.fillRect(Math.random()*512,Math.random()*512,2+Math.random()*3,2+Math.random()*3);}
  for(let i=0;i<40;i++){c.strokeStyle='rgba(30,22,18,.35)';c.lineWidth=2+Math.random()*3;c.beginPath();const x=Math.random()*512;c.moveTo(x,0);c.lineTo(x+Math.random()*60-30,512);c.stroke();}});rockT.wrapS=rockT.wrapT=THREE.RepeatWrapping;rockT.repeat.set(4,2);
const vm=new THREE.MeshStandardMaterial({map:rockT,color:$lc(0xb59c88),roughness:.95});
const VX=0,VZ=.2;
const prof=si=>{const k=(si-45)/30;const H=.8+1.0*k,R=2.3-.7*k,cr=.22+.06*k;const pts=[V(0,H-.25,0),V(cr*.7,H-.22,0),V(cr,H,0),V(cr+.05,H+.01,0)];
  for(let i=1;i<=14;i++){const t=i/14;const r=cr+.05+(R-cr-.05)*t;const y=H*(1-Math.pow(t,.55+.9*(1-k)));pts.push(V(r,Math.max(0,y),0));}pts.push(V(R+.05,0,0));return {pts:pts.map(p=>new THREE.Vector2(p.x,p.y)),H,R,cr};};
let P0=prof(48);const vol=new THREE.Mesh(new THREE.LatheGeometry(P0.pts.slice().reverse(),72),vm);vol.position.set(VX,0,VZ);vol.castShadow=true;vol.receiveShadow=true;L.add(vol);
const glowCr=new THREE.Mesh(new THREE.CircleGeometry(.2,32),new THREE.MeshBasicMaterial({color:0xff6a1a}));glowCr.rotation.x=-Math.PI/2;L.scene.add(glowCr);
const crL=new THREE.PointLight(0xff7a2a,0,6,2);L.scene.add(crL);
function surfY(r){const p=P0.pts;for(let i=4;i<p.length-1;i++){if(r<=p[i+1].x){const u=(r-p[i].x)/(p[i+1].x-p[i].x);return p[i].y+(p[i+1].y-p[i].y)*u;}}return 0;}
function shapeTo(si){const A=P0,B=prof(si);return L.tw(900,q=>{const e=ease(q);const pts=A.pts.map((p,i)=>new THREE.Vector2(p.x+(B.pts[i].x-p.x)*e,p.y+(B.pts[i].y-p.y)*e));vol.geometry.dispose();vol.geometry=new THREE.LatheGeometry(pts.slice().reverse(),72);P0={pts,H:A.H+(B.H-A.H)*e,R:A.R+(B.R-A.R)*e,cr:A.cr+(B.cr-A.cr)*e};placeCr();}).then(()=>{P0=B;});}
function placeCr(){glowCr.position.set(VX,P0.H-.22,VZ);glowCr.scale.setScalar(P0.cr/.22);crL.position.set(VX,P0.H+.3,VZ);}
placeCr();
/* lava flows */
const lavaM=new THREE.MeshStandardMaterial({color:$lc(0x3a1a10),emissive:$lc(0xff5a12),emissiveIntensity:1.6,roughness:.7});
let flows=[];
function makeFlows(n,len,th){flows.forEach(f=>{L.scene.remove(f);f.geometry.dispose();});flows=[];
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+Math.random()*.4;const pts=[];const R=P0.R*len;for(let j=0;j<=24;j++){const r=P0.cr+.02+(R-P0.cr)*j/24;const w=Math.sin(j*.7+i)*.08;const x=VX+Math.cos(a+w*.3)*r,z=VZ+Math.sin(a+w*.3)*r;pts.push(V(x,surfY(r)+th*.5,z));}
    const geo=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),48,th,8);geo.setDrawRange(0,0);const m=new THREE.Mesh(geo,lavaM);m.scale.y=.55;m.position.y=th*.2;L.scene.add(m);flows.push(m);}}
/* particles: fountain/bombs + ash */
const NF=220,fp=new Float32Array(NF*3),fv=Array.from({length:NF},()=>({x:0,y:-9,z:0,vx:0,vy:0,vz:0,on:false}));const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.BufferAttribute(fp,3));
const fm=new THREE.PointsMaterial({color:0xffa040,size:.09,map:P3.glowTex(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});const fountain=new THREE.Points(fg,fm);fountain.frustumCulled=false;L.scene.add(fountain);
const bombs=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.06,0),new THREE.MeshStandardMaterial({color:$lc(0x2a2220),emissive:$lc(0xff4a10),emissiveIntensity:.8}),40);bombs.count=0;L.scene.add(bombs);const BB=[];
const ash=[];for(let i=0;i<130;i++){const m=new THREE.SpriteMaterial({map:P3.glowTex(),color:$lc(0x6e6560),transparent:true,opacity:0,depthWrite:false});const s=new THREE.Sprite(m);s.visible=false;s.renderOrder=12;L.scene.add(s);ash.push({s,m,t:9});}
const dome=new THREE.Mesh(new THREE.SphereGeometry(1,24,16,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:$lc(0x5a4a42),emissive:$lc(0xff4a10),emissiveIntensity:.25,roughness:.9}));dome.visible=false;L.scene.add(dome);
let fRate=0,fH=0,shake=0;const dO=new THREE.Object3D();
P3.loop(L,(dt,t)=>{const top=V(VX,P0.H-.15,VZ);
  if(fRate>0){let n=fRate*dt;while(n>0){if(Math.random()<n){const q=fv.find(p=>!p.on);if(q){q.on=true;q.x=top.x+(Math.random()-.5)*.1;q.y=top.y;q.z=top.z+(Math.random()-.5)*.1;const a=Math.random()*6.28,s=Math.random()*.6;q.vx=Math.cos(a)*s;q.vz=Math.sin(a)*s;q.vy=fH*(.7+Math.random()*.5);}}n-=1;}}
  fv.forEach((q,i)=>{if(q.on){q.vy-=9.8*.45*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;const r=Math.hypot(q.x-VX,q.z-VZ);if(q.y<surfY(r)&&q.vy<0)q.on=false;}fp[i*3]=q.on?q.x:0;fp[i*3+1]=q.on?q.y:-9;fp[i*3+2]=q.on?q.z:0;});fg.attributes.position.needsUpdate=true;
  for(let i=BB.length-1;i>=0;i--){const b=BB[i];b.vy-=9.8*.5*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;b.r+=dt*4;const rr=Math.hypot(b.x-VX,b.z-VZ);if(b.y<surfY(rr)&&b.vy<0){b.y=surfY(rr);b.vx*=.3;b.vz*=.3;b.vy=0;b.rest=(b.rest||0)+dt;if(b.rest>3)BB.splice(i,1);}}
  BB.forEach((b,i)=>{dO.position.set(b.x,b.y,b.z);dO.rotation.set(b.r,b.r*.7,0);dO.scale.setScalar(b.s);dO.updateMatrix();bombs.setMatrixAt(i,dO.matrix);});bombs.count=BB.length;bombs.instanceMatrix.needsUpdate=true;
  ash.forEach(a=>{if(a.t>6){a.s.visible=false;return;}a.t+=dt;const k=a.t/6;a.s.position.set(a.x+a.dx*k*3,a.y0+a.vy*(1-Math.exp(-a.t*.8))*2.2,a.z+a.dz*k*3);a.s.scale.setScalar(.4+k*2.4);a.m.opacity=.75*Math.min(1,a.t*2)*(1-k);});
  if(shake>0){shake-=dt;L.camera.position.x+=(Math.random()-.5)*.06*shake;L.camera.position.y+=(Math.random()-.5)*.06*shake;}
  crL.intensity=S.erupting?2.2+Math.sin(t*20)*.4:0.0;glowCr.material.color.setHSL(.05,1,S.erupting?.55:.25);
  X.txt(sec,'vP',Math.round(S.P)+' %');});
function upd(){const t=TYPES[S.ti];X.txt(sec,'vSi',t.si+' %');X.txt(sec,'vVi',t.visc);sec.$$('[data-a="t"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===S.ti));}
async function setT(i){if(S.busy)return;S.ti=i;upd();clear();S.busy=true;sync();await shapeTo(TYPES[i].si);S.busy=false;sync();render();toast('شكل البركان الذي تبنيه صهارة '+TYPES[i].n+': '+TYPES[i].shape+'.');}
function clear(){fRate=0;BB.length=0;ash.forEach(a=>a.t=9);flows.forEach(f=>f.geometry.setDrawRange(0,0));dome.visible=false;S.P=0;S.erupting=false;}
function bomb(n,sp){const top=V(VX,P0.H,VZ);for(let i=0;i<n;i++){const a=Math.random()*6.28,s=sp*(.4+Math.random()*.8);BB.push({x:top.x,y:top.y,z:top.z,vx:Math.cos(a)*s*.5,vz:Math.sin(a)*s*.5,vy:sp*(1+Math.random()),r:0,s:.6+Math.random()*1.4});}if(BB.length>40)BB.splice(0,BB.length-40);}
function ashCloud(n,h){const top=V(VX,P0.H,VZ);let c=0;ash.forEach(a=>{if(c>=n||a.t<6)return;c++;a.t=Math.random()*.6;a.x=top.x+(Math.random()-.5)*.3;a.z=top.z+(Math.random()-.5)*.3;a.y0=top.y;a.vy=h*(.5+Math.random()*.7);a.dx=(Math.random()-.5)*.8;a.dz=(Math.random()-.5)*.5;a.s.visible=true;});}
async function go(){if(S.busy)return;S.busy=true;clear();sync();const t=TYPES[S.ti];S.erupting=true;L.focus(V(3.2,3.2,6.4),V(0,1.1,.2),1000);
  if(t.k==='b'){makeFlows(7,1.0,.07);fRate=90;fH=2.4;await L.tw(1200,q=>S.P=q*25);P3.whoosh();
    await L.tw(6500,q=>{flows.forEach(f=>f.geometry.setDrawRange(0,Math.floor(f.geometry.index.count*Math.min(1,q*1.15))));S.P=25-10*q;});fRate=20;}
  else if(t.k==='a'){makeFlows(4,.5,.1);for(let k=0;k<3;k++){await L.tw(1400,q=>S.P=40+q*35);bomb(12,2.2);ashCloud(25,1.2);P3.noise(.5,.9,300,.6);shake=.4;fRate=60;fH=2.0;await sleep(500);fRate=0;S.P=40;
      flows.forEach(f=>f.geometry.setDrawRange(0,Math.floor(f.geometry.index.count*(k+1)/3)));}}
  else{dome.visible=true;dome.position.set(VX,P0.H-.2,VZ);await L.tw(3200,q=>{S.P=q*100;dome.scale.set(P0.cr*(.6+q*.5),P0.cr*(.3+q*.9),P0.cr*(.6+q*.5));});
    dome.visible=false;P3.flash(L,V(VX,P0.H+.2,VZ),0xffd0a0,6);P3.noise(1.6,1.4,140,.5);setTimeout(()=>P3.noise(1.2,.8,90,.4),120);shake=1.4;bomb(40,3.6);ashCloud(130,2.6);fRate=120;fH=4;await sleep(900);fRate=0;S.P=15;await sleep(2500);}
  S.erupting=t.k==='b';S.log[t.k]=true;S.busy=false;sync();renderNB();render();toast(t.k==='b'?'ثوران هادئ: تتدفق اللابة منخفضة اللزوجة بعيدًا على سفوح واسعة.':t.k==='a'?'ثوران متوسط: انفجارات متقطعة وتدفقات لابة قصيرة سميكة.':'ثوران انفجاري عنيف: حُبست الغازات في الصهارة اللزجة حتى انفجرت قاذفة الرماد والقذائف.');}
function reset(){if(S.busy)return;clear();S.log={};L.home(800);renderNB();render();}
function stepIdx(){const n=Object.keys(S.log).length;if(!n&&!S.busy)return S.ti===0&&!S.touched?0:1;if(n<3)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='اختر نوع الصهارة';html=`<p class="p3-txt">اختر نوع الصهارة من لوحة التحكم، ولاحظ كيف يتغير شكل البركان الذي تبنيه.</p>`;}
  else if(k===1){title='ابدأ الثوران';html=`<p class="p3-txt">اضغط «ابدأ الثوران» وراقب ضغط الغازات وطريقة خروج الصهارة. استخدم 🐢 لمشاهدة القذائف ببطء.</p>`;}
  else if(k===2){title='جرّب الأنواع الثلاثة';html=`<p class="p3-txt">جرّب الصهارة البازلتية والأنديزيتية والريوليتية وقارن (${Object.keys(S.log).length} / 3).</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">كلما زادت نسبة السيليكا زادت لزوجة الصهارة فاحتبست الغازات وارتفع ضغطها، فيصبح الثوران أكثر عنفًا. الصهارة البازلتية تثور بهدوء وتبني براكين درعية، والغنية بالسيليكا تنفجر بعنف.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>الصهارة</th><th>السيليكا</th><th>اللزوجة</th><th>الثوران</th></tr></thead><tbody>${TYPES.map(t=>`<tr><td>${t.n.split(' ')[0]}</td><td class="n">${t.si}%</td><td>${S.log[t.k]?t.visc:'—'}</td><td>${S.log[t.k]?t.er.split(':')[0]:'—'}</td></tr>`).join('')}</tbody></table>`;}
function sync(){sec.$('[data-a="go"]').disabled=S.busy;sec.$$('[data-a="t"]').forEach(b=>b.disabled=S.busy);}
X.side(sec,{t:b=>{S.touched=true;setT(+b.dataset.i);},go,reset});
upd();sync();render();renderNB();
};

/* =====================================================================
   ١٤) التوصيل الكهربائي للمركبات الأيونية والتساهمية (ثالث متوسط · ارتباط العناصر)
   ===================================================================== */
const BOND={};EXP_MODS.bond9=BOND;
BOND.init=function(){gm();
const SUB=[{k:'dw',n:'ماء مقطر',I:0,ion:false,col:0xd8ecf4,op:.32,liq:true,mol:'w'},{k:'na',n:'محلول ملح الطعام NaCl',I:.42,ion:true,col:0xdcecf2,op:.38,liq:true,mol:'ion'},
  {k:'cu',n:'محلول كبريتات النحاس',I:.33,ion:true,col:0x3a8ad0,op:.6,liq:true,mol:'ion'},{k:'su',n:'محلول السكر',I:0,ion:false,col:0xe8ecdc,op:.38,liq:true,mol:'cov'},
  {k:'et',n:'الإيثانول (كحول)',I:0,ion:false,col:0xeef4f6,op:.3,liq:true,mol:'cov'},{k:'ss',n:'ملح طعام صلب',I:0,ion:true,col:0xffffff,op:1,liq:false,mol:'lat'}];
const S={at:-1,busy:false,res:{},ans:{}};P3.dbg.bond9=S;
const NAMES=['اختبر المواد','قارن التوصيل','صنّف نوع الرابطة','استنتج'];
const sec=P3.section('bond9',{title:'التوصيل الكهربائي للمركبات الأيونية والتساهمية',grade:'ثالث متوسط',lesson:'ارتباط العناصر',
  hud:`<div class="p3-row">${X.m('شدة التيار','bI',1)}${X.m('المصباح','bL')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">اغمس القطبين في:</h4>
    <div class="x-grid3">${SUB.map((s,i)=>`<button class="p3-b" data-a="s" data-i="${i}">${s.n.replace(' NaCl','')}</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b" data-a="up">⬆ ارفع القطبين واغسلهما</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>الرابطة الأيونية والرابطة التساهمية</h3><p><b>الرابطة الأيونية</b> تنشأ بين أيونات موجبة وسالبة نتيجة انتقال الإلكترونات (مثل ملح الطعام NaCl). <b>الرابطة التساهمية</b> تنشأ بمشاركة الإلكترونات بين الذرات فتتكوّن جزيئات متعادلة (مثل السكر والإيثانول والماء).</p></div>
    <div class="panel"><h3>لماذا يوصل محلول الملح الكهرباء؟</h3><p>عند ذوبان المركب الأيوني في الماء تنفصل أيوناته وتصبح <b>حرة الحركة</b> فتنقل الشحنات بين القطبين. أما الملح الصلب فأيوناته مثبتة في الشبكة البلورية فلا يوصل. والمركبات التساهمية تذوب جزيئات متعادلة فلا توصل.</p></div>`,
  quiz:[{q:'لماذا يوصل محلول ملح الطعام التيار الكهربائي؟',o:['لاحتوائه على أيونات حرة الحركة','لأنه سائل فقط','لاحتوائه على جزيئات متعادلة'],a:0},{q:'لماذا لا يوصل ملح الطعام الصلب الكهرباء؟',o:['لأن أيوناته مثبتة في الشبكة البلورية','لأنه مركب تساهمي','لأنه لا يحتوي على أيونات'],a:0},
        {q:'محلول السكر لا يوصل الكهرباء لأن السكر:',o:['مركب أيوني','مركب تساهمي يذوب على شكل جزيئات','فلز'],a:1},{q:'الرابطة الناتجة عن مشاركة الإلكترونات:',o:['أيونية','تساهمية','فلزية'],a:1}],
  report:()=>({title:'التوصيل الكهربائي للمركبات',grade:'ثالث متوسط',lesson:'ارتباط العناصر',cols:['المادة','المصباح','شدة التيار (A)','نوع المركب'],
    rows:SUB.map(s=>S.res[s.k]!=null?[s.n,S.res[s.k]>0?'يضيء':'لا يضيء',S.res[s.k].toFixed(2),'']:[s.n,'','','']),note:'صنّف كل مادة: مركب أيوني أم تساهمي؟ وفسّر توصيل المحاليل الأيونية للكهرباء.'})
});
const L=new Lab(sec,{target:V(.4,.75,.4),dist:a=>Math.max(5.2,8/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* containers */
const C={};SUB.forEach((s,i)=>{const x=-1.45+i*.8;let o;if(s.liq){o=X.vessel(.3,.6,{level:.4,col:s.col,op:s.op});}else{o={g:new THREE.Group()};const d=new THREE.Mesh(new THREE.CylinderGeometry(.32,.26,.08,32),KIT.phys(0xe9ecea,{roughness:.3}));d.position.y=.04;o.g.add(d);
    const im=new THREE.InstancedMesh(RBox(.07,.07,.07,.01),new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.2,transparent:true,opacity:.85,clearcoat:1}),60);const dd=new THREE.Object3D();for(let j=0;j<60;j++){const a=j*2.4,r=(j%6)*.045;dd.position.set(Math.cos(a)*r,.1+Math.floor(j/20)*.06,Math.sin(a)*r);dd.rotation.set(j,j*.5,0);dd.updateMatrix();im.setMatrixAt(j,dd.matrix);}o.g.add(im);}
  o.g.position.set(x,0,.75);L.add(o.g);const card=P3.card([{t:s.n.split(' (')[0].replace(' NaCl',''),s:40}],.72,.17);card.position.set(x,.02,1.25);card.rotation.x=-1.2;L.add(card);C[s.k]={o,x};});
/* circuit: battery, bulb, ammeter, electrode holder */
const bat=new THREE.Mesh(RBox(.7,.3,.4,.04),KIT.phys(0x2b3036));bat.position.set(-1.2,.15,-.6);castAll(bat);L.add(bat);
const batL=P3.card([{t:'بطارية 6 V',s:60}],.5,.14);batL.position.set(-1.2,.31,-.6);batL.rotation.x=-Math.PI/2;L.add(batL);
const bulb=new THREE.Group();{const base=new THREE.Mesh(new THREE.CylinderGeometry(.1,.12,.16,20),KIT.mat(0x9aa0a4,{metalness:.7}));base.position.y=.08;const gl=new THREE.Mesh(new THREE.SphereGeometry(.16,24,18),G.glassT);gl.position.y=.3;bulb.add(base,gl);castAll(bulb);}
bulb.position.set(.1,0,-.6);L.add(bulb);const fil=new THREE.Mesh(new THREE.TorusGeometry(.05,.008,8,20,Math.PI),new THREE.MeshBasicMaterial({color:0x553322}));fil.position.set(.1,.3,-.6);L.scene.add(fil);
const bLight=new THREE.PointLight(0xffd27a,0,4,2);bLight.position.set(.1,.32,-.6);L.scene.add(bLight);const bGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:P3.glowTex(),color:0xffd27a,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));bGlow.scale.setScalar(.9);bGlow.position.set(.1,.32,-.6);L.scene.add(bGlow);
const am=new THREE.Mesh(RBox(.55,.38,.25,.04),KIT.phys(0xeeeeec));am.position.set(1.2,.19,-.6);castAll(am);L.add(am);const aml=KIT.lcd(.42,.16);aml.m.position.set(1.2,.25,-.47);L.add(aml.m);aml.set('0.00 A');
const hold=new THREE.Group();{const bar=new THREE.Mesh(RBox(.5,.06,.12,.02),KIT.mat(0x2b3036));bar.position.y=1.3;hold.add(bar);[-.1,.1].forEach(x=>{const e=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1.0,12),KIT.mat(0x2a2a2a,{roughness:.6}));e.position.set(x,.82,0);hold.add(e);});castAll(hold);}
const HH=V(0,.35,.75);hold.position.copy(HH);L.add(hold);
const w1=new THREE.Group(),w2=new THREE.Group();L.scene.add(w1,w2);
function wires(){[w1,w2].forEach(w=>{while(w.children.length)w.remove(w.children[0]);});const p=hold.position;
  w1.add(KIT.wire([V(-.85,.25,-.6),V(-.6,.9,-.2),V(p.x-.1,p.y+1.33,p.z)],0xc0392b,.018));w2.add(KIT.wire([V(p.x+.1,p.y+1.33,p.z),V(.6,.9,-.2),V(.95,.25,-.6)],0x222222,.018));}
L.add(KIT.wire([V(-1.55,.25,-.6),V(-1.3,.05,-.9),V(.0,.05,-.9),V(.05,.1,-.6)],0x222222,.018));L.add(KIT.wire([V(.15,.1,-.6),V(.6,.05,-.85),V(1.45,.25,-.6)],0xc0392b,.018));
wires();
const bub=Bubbles(80,{op:.6});L.scene.add(bub.mesh);
/* particle view */
const ov=X.ov(sec,'نظرة جزيئية بين القطبين',250,140);const PT=Array.from({length:26},(_,i)=>({x:Math.random(),y:Math.random(),q:i%2?1:-1,vx:0,vy:0,a:Math.random()*6}));
function drawMol(mode,on){const {x,w,h}=ov;x.clearRect(0,0,w,h);x.fillStyle='#0b1a18';x.fillRect(0,0,w,h);x.fillStyle='#555';x.fillRect(4,8,10,h-16);x.fillRect(w-14,8,10,h-16);x.fillStyle='#ff8a7a';x.font='700 12px "IBM Plex Mono",monospace';x.fillText('+',5,20);x.fillStyle='#8ab4ff';x.fillText('−',w-12,20);
  if(mode==='none'){x.fillStyle='#9fe8cf';x.font='700 11px "IBM Plex Sans Arabic",sans-serif';x.textAlign='center';x.fillText('اغمس القطبين في مادة',w/2,h/2);x.textAlign='left';return;}
  PT.forEach(p=>{const X0=22,W0=w-44;let px=X0+p.x*W0,py=12+p.y*(h-24);
    if(mode==='lat'){const i=PT.indexOf(p);px=X0+20+(i%6)*30;py=26+Math.floor(i/6)*22;}
    if(mode==='ion'){x.fillStyle=p.q>0?'#ff6a5a':'#5a8aff';x.beginPath();x.arc(px,py,p.q>0?5:7,0,7);x.fill();x.fillStyle='#fff';x.font='700 9px sans-serif';x.fillText(p.q>0?'+':'−',px-3,py+3);}
    else if(mode==='lat'){x.fillStyle=p.q>0?'#ff6a5a':'#5a8aff';x.beginPath();x.arc(px,py,p.q>0?5:7,0,7);x.fill();}
    else if(mode==='cov'){x.fillStyle='#e8d88a';x.beginPath();x.ellipse(px,py,9,5,p.a,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(px+Math.cos(p.a)*7,py+Math.sin(p.a)*4,2.5,0,7);x.fill();}
    else{x.fillStyle='#9fd3ff';x.beginPath();x.arc(px,py,4,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(px+4,py-3,2,0,7);x.arc(px-4,py-3,2,0,7);x.fill();}});}
let mode='none';
const lastH=new THREE.Vector3(9,9,9);
P3.loop(L,(dt,t)=>{if(lastH.distanceToSquared(hold.position)>1e-6){lastH.copy(hold.position);[w1,w2].forEach(w=>w.children.forEach(c=>c.geometry.dispose()));wires();}const s=S.at>=0?SUB[S.at]:null,on=s&&S.in;const I=on?s.I*(1+Math.sin(t*3)*.01):0;
  bLight.intensity=I*6;bGlow.material.opacity=Math.min(.9,I*2);fil.material.color.set(I>0?0xfff0b0:0x553322);aml.set(I.toFixed(2)+' A');X.txt(sec,'bI',I.toFixed(2)+' A');X.txt(sec,'bL',I>0?'يضيء 💡':'لا يضيء');
  if(on&&s.ion&&s.liq&&Math.random()<dt*25){const p=hold.position;bub.spawn(p.x+(Math.random()<.5?-.1:.1),.2,p.z,.008+Math.random()*.01,.44,.25);}bub.update(dt,t);
  PT.forEach(p=>{if(mode==='ion'){p.vx+=(Math.random()-.5)*dt*2+(on?p.q*-.25*dt:0);p.vy+=(Math.random()-.5)*dt*2;}else{p.vx+=(Math.random()-.5)*dt*1.5;p.vy+=(Math.random()-.5)*dt*1.5;}p.vx*=.96;p.vy*=.96;p.x+=p.vx*dt;p.y+=p.vy*dt;p.a+=dt;
    if(p.x<0){p.x=on&&mode==='ion'?.98:0;}if(p.x>1){p.x=on&&mode==='ion'?.02:1;}p.y=clamp(p.y,0,1);});drawMol(mode,on);});
async function dip(i){if(S.busy)return;S.busy=true;sync();if(S.in)await up(true);const c=C[SUB[i].k];await L.arc(hold,V(c.x,.75+.0,.75),700,1.0);await L.move(hold,V(c.x,SUB[i].liq?-.05:-.15,.75),500);
  S.at=i;S.in=true;mode=SUB[i].mol;S.res[SUB[i].k]=SUB[i].I;S.busy=false;sync();renderNB();render();toast(SUB[i].I>0?SUB[i].n+': أضاء المصباح! الأيونات الحرة تنقل الشحنات.':SUB[i].n+': لم يضئ المصباح.');}
async function up(inner){if(!S.in)return;if(!inner){S.busy=true;sync();}S.in=false;mode='none';await L.move(hold,V(hold.position.x,.55,.75),400);await L.arc(hold,HH,500,1.0);S.at=-1;if(!inner){S.busy=false;sync();}}
function reset(){if(S.busy)return;S.res={};S.ans={};up();renderNB();render();}
function setAns(k,v){S.ans[k]=v;renderNB();render();}
function stepIdx(){const n=Object.keys(S.res).length;if(n<3)return 0;if(n<SUB.length)return 1;if(Object.keys(S.ans).length<SUB.length)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='اختبر المواد';html=`<p class="p3-txt">اضغط على اسم مادة لتغمس فيها قطبي الجرافيت. يضيء المصباح ويتحرك مؤشر الأميتر إذا أوصلت المادة التيار. راقب النظرة الجزيئية.</p>`;}
  else if(k===1){title='قارن التوصيل';html=`<p class="p3-txt">اختبر جميع المواد الست (${Object.keys(S.res).length} / 6). قارن ملح الطعام الصلب بمحلوله.</p>`;}
  else if(k===2){title='صنّف نوع الرابطة';html=`<p class="p3-txt">اختر في دفتر المختبر نوع كل مركب: أيوني أم تساهمي؟ (الماء المقطر مركب تساهمي).</p>`;}
  else{const ok=SUB.every(s=>(S.ans[s.k]==='i')===s.ion);title='استنتج';html=`<p class="${ok?'p3-ok':'p3-txt'}">${ok?'تصنيفك صحيح! ':'راجع تصنيفك. '}المركبات الأيونية (ملح الطعام وكبريتات النحاس) توصل الكهرباء عندما تذوب في الماء لأن أيوناتها تتحرك بحرية، ولا توصلها وهي صلبة. والمركبات التساهمية (السكر والإيثانول والماء المقطر) لا توصل لأنها جزيئات متعادلة.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>المادة</th><th>التيار</th><th>نوع المركب</th></tr></thead><tbody>${SUB.map(s=>{const r=S.res[s.k];const a=S.ans[s.k];const ok=a?((a==='i')===s.ion):null;
  return `<tr><td>${s.n.replace(' NaCl','')}</td><td class="n">${r!=null?r.toFixed(2)+' A':'—'}</td><td>${r!=null?`<select data-k="${s.k}"><option value="">اختر</option><option value="i" ${a==='i'?'selected':''}>أيوني</option><option value="c" ${a==='c'?'selected':''}>تساهمي</option></select> ${ok==null?'':ok?'<b class="p3-fb ok">✓</b>':'<b class="p3-fb bad">✗</b>'}`:'—'}</td></tr>`;}).join('')}</tbody></table>`;}
sec.$('.p3-nb').addEventListener('change',e=>{const s=e.target.closest('select');if(s)setAns(s.dataset.k,s.value);});
function sync(){sec.$$('[data-a="s"]').forEach(b=>{b.disabled=S.busy;b.setAttribute('aria-pressed',S.at===+b.dataset.i);b.classList.toggle('done',S.res[SUB[+b.dataset.i].k]!=null);});sec.$('[data-a="up"]').disabled=S.busy||!S.in;}
X.side(sec,{s:b=>dip(+b.dataset.i),up:()=>up(),reset});
sync();render();renderNB();
};

/* =====================================================================
   ١٥) الزخم والتصادمات على المسار الهوائي (ثالث متوسط · الزخم والتصادمات)
   ===================================================================== */
const MOM={};EXP_MODS.mom9=MOM;
MOM.init=function(){gm();
const SC=2.0;/* scene units per metre */
const S={m1:.2,m2:.2,v0:.5,type:'el',run:false,x1:-1.6,x2:.3,v1:0,v2:0,hit:false,stuck:false,log:[],pre:null,post:null};P3.dbg.mom9=S;
const NAMES=['اختر الكتل والسرعة','أطلق العربة','قارن الزخم','غيّر نوع التصادم'];
const sec=P3.section('mom9',{title:'الزخم والتصادمات على المسار الهوائي',grade:'ثالث متوسط',lesson:'الزخم والتصادمات',
  hud:`<div class="p3-row">${X.m('سرعة العربة 1','mV1',1)}${X.m('سرعة العربة 2','mV2',1)}</div><div class="p3-row">${X.m('الزخم الكلي','mP')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">العربة 1:</span><button class="p3-b" data-a="m1" data-v="0.2" aria-pressed="true">0.2 kg</button><button class="p3-b" data-a="m1" data-v="0.4">0.4 kg</button></div>
    <div class="p3-acts"><span class="p3-lab">العربة 2:</span><button class="p3-b" data-a="m2" data-v="0.2" aria-pressed="true">0.2 kg</button><button class="p3-b" data-a="m2" data-v="0.4">0.4 kg</button></div>
    ${X.rng('سرعة العربة 1','mVr',.2,.8,.1,.5,' m/s')}
    <div class="p3-acts"><span class="p3-lab">التصادم:</span><button class="p3-b" data-a="ty" data-v="el" aria-pressed="true">🔵 مرن (نوابض)</button><button class="p3-b" data-a="ty" data-v="in">🟠 غير مرن (لاصق)</button></div>
    <div class="p3-acts"><button class="p3-b pri" data-a="go">▶ أطلق العربة 1</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>الزخم</h3><p>الزخم = الكتلة × السرعة (ز = ك × ع)، ووحدته kg·m/s، وهو كمية متجهة لها اتجاه السرعة نفسه.</p>
    <p><b>قانون حفظ الزخم:</b> الزخم الكلي لمجموعة من الأجسام قبل التصادم يساوي الزخم الكلي بعده ما لم تؤثر فيها قوة خارجية.</p></div>
    <div class="panel"><h3>أنواع التصادم</h3><p>في <b>التصادم المرن</b> ترتد الأجسام بعضها عن بعض. وفي <b>التصادم غير المرن</b> تلتصق الأجسام وتتحرك معًا بسرعة واحدة. وفي الحالتين يبقى الزخم الكلي محفوظًا.</p></div>`,
  quiz:[{q:'عربة كتلتها 0.4 kg تتحرك بسرعة 0.5 m/s. زخمها:',o:['0.2 kg·m/s','0.9 kg·m/s','0.8 kg·m/s'],a:0},{q:'في التصادم غير المرن تتحرك العربتان بعده:',o:['معًا بسرعة واحدة','في اتجاهين متعاكسين دائمًا','لا تتحركان'],a:0},
        {q:'تصادمت عربتان متساويتا الكتلة تصادمًا مرنًا والثانية ساكنة. بعد التصادم:',o:['تتوقف الأولى وتتحرك الثانية بسرعة الأولى','تلتصقان','ترتد الأولى بضعف سرعتها'],a:0},{q:'الزخم الكلي قبل التصادم وبعده:',o:['يزداد','يقل','يبقى ثابتًا'],a:2}],
  report:()=>({title:'الزخم والتصادمات',grade:'ثالث متوسط',lesson:'الزخم والتصادمات',cols:['التصادم','ك1 (kg)','ك2 (kg)','ع1 قبل (m/s)','ع1 بعد (m/s)','ع2 بعد (m/s)','الزخم قبل','الزخم بعد'],
    rows:S.log.length?S.log.map(r=>[r.t,String(r.m1),String(r.m2),r.u.toFixed(2),r.a.toFixed(2),r.b.toFixed(2),(r.m1*r.u).toFixed(3),(r.m1*r.a+r.m2*r.b).toFixed(3)]):[['','','','','','','','']],note:'قارن الزخم الكلي قبل التصادم وبعده في كل محاولة.'})
});
const L=new Lab(sec,{target:V(0,.55,.4),dist:a=>Math.max(5.6,8.6/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* track */
const TL=5.0;const track=new THREE.Group();{const beam=new THREE.Mesh(RBox(TL,.16,.22,.02),KIT.mat(0xc9d0d4,{metalness:.8,roughness:.3}));beam.position.y=.42;track.add(beam);
  const hm=new THREE.InstancedMesh(new THREE.CylinderGeometry(.008,.008,.01,6),KIT.mat(0x222222),90);const d=new THREE.Object3D();for(let i=0;i<90;i++){d.position.set(-TL/2+.1+i*(TL-.2)/89,.505,(i%2?.04:-.04));d.updateMatrix();hm.setMatrixAt(i,d.matrix);}track.add(hm);
  [-1.8,1.8].forEach(x=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.34,10),M.steel);l.position.set(x,.17,0);track.add(l);const f=new THREE.Mesh(RBox(.3,.04,.4,.01),KIT.mat(0x2b3036));f.position.set(x,.02,0);track.add(f);});
  [-TL/2,TL/2].forEach(x=>{const e=new THREE.Mesh(RBox(.08,.3,.3,.02),KIT.mat(0x2b3036));e.position.set(x,.52,0);track.add(e);});castAll(track);}
track.position.set(0,0,.4);L.add(track);
const blower=new THREE.Mesh(RBox(.6,.4,.5,.05),KIT.phys(0x2f6f62));blower.position.set(-2.9,.2,-.3);castAll(blower);L.add(blower);L.add(KIT.wire([V(-2.6,.3,-.3),V(-2.5,.2,.1),V(-2.45,.42,.4)],0x333333,.04));
/* gliders */
const mkG=(col)=>{const g=new THREE.Group();const b=new THREE.Mesh(RBox(.5,.16,.3,.03),KIT.phys(col,{roughness:.35}));b.position.y=.58;const fl=new THREE.Mesh(new THREE.BoxGeometry(.04,.22,.2),KIT.mat(0x222222));fl.position.set(0,.77,0);
  const mass=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.08,20),KIT.mat(0xb9c0c4,{metalness:.9,roughness:.3}));mass.position.set(.14,.7,0);mass.visible=false;g.add(b,fl,mass);g.userData.mass=mass;castAll(g);return g;};
const g1=mkG(0x2f6fbf),g2=mkG(0xe0703f);L.add(g1,g2);
const spr=new THREE.Mesh(new THREE.TorusGeometry(.05,.012,8,16),M.steel);spr.rotation.y=Math.PI/2;L.add(spr);
const velc=new THREE.Mesh(new THREE.BoxGeometry(.02,.1,.18),KIT.mat(0x333333,{roughness:1}));L.add(velc);
/* photogates */
const PG=[-.7,1.0];PG.forEach(x=>{const g=new THREE.Group();[-.22,.22].forEach(z=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.05,.5,.05),KIT.mat(0x2b3036));p.position.set(0,.75,z);g.add(p);});const t=new THREE.Mesh(new THREE.BoxGeometry(.06,.06,.5),KIT.mat(0x2b3036));t.position.y=1.0;g.add(t);
  const led=new THREE.Mesh(new THREE.SphereGeometry(.025,10,8),new THREE.MeshBasicMaterial({color:0xff2020}));led.position.set(0,.98,.26);g.add(led);g.position.set(x,0,.4);castAll(g);L.add(g);});
const pgL=PG.map((x,i)=>L.label('البوابة '+(i+1),V(x,1.15,.4),'x-d'));
/* arrows for momentum */
const arrow=(col)=>{const g=new THREE.Group();const s=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1,10),new THREE.MeshBasicMaterial({color:col}));s.rotation.z=-Math.PI/2;s.position.x=.5;const h=new THREE.Mesh(new THREE.ConeGeometry(.06,.14,12),new THREE.MeshBasicMaterial({color:col}));h.rotation.z=-Math.PI/2;h.position.x=1.05;g.add(s,h);L.scene.add(g);return g;};
const a1=arrow(0x2f6fbf),a2=arrow(0xe0703f);
function setArrow(a,x,p){const len=Math.abs(p)*6;a.visible=len>.03;a.position.set(x,1.0,.4);a.scale.set(Math.max(.05,len),1,1);a.rotation.y=p<0?Math.PI:0;}
const GW=.5;
function place(){g1.position.set(S.x1,0,.4);g2.position.set(S.x2,0,.4);spr.position.set(S.x2-GW/2-.03,.58,.4);spr.visible=S.type==='el';velc.position.set(S.x2-GW/2-.01,.58,.4);velc.visible=S.type==='in';
  g1.userData.mass.visible=S.m1>.3;g2.userData.mass.visible=S.m2>.3;setArrow(a1,S.x1,S.m1*S.v1);setArrow(a2,S.x2,S.m2*S.v2);
  X.txt(sec,'mV1',S.v1.toFixed(2)+' m/s');X.txt(sec,'mV2',S.v2.toFixed(2)+' m/s');X.txt(sec,'mP',(S.m1*S.v1+S.m2*S.v2).toFixed(3)+' kg·m/s');}
P3.loop(L,(dt)=>{if(!S.run)return;const n=10,h=dt/n;for(let i=0;i<n;i++){S.x1+=S.v1*SC*h;S.x2+=S.v2*SC*h;
    if(!S.hit&&S.x2-S.x1<=GW+.02){S.hit=true;const m1=S.m1,m2=S.m2,u1=S.v1,u2=S.v2;S.pre={u:u1};
      if(S.type==='el'){S.v1=((m1-m2)*u1+2*m2*u2)/(m1+m2);S.v2=((m2-m1)*u2+2*m1*u1)/(m1+m2);P3.tone(900,.05,'triangle',.07);}else{const v=(m1*u1+m2*u2)/(m1+m2);S.v1=S.v2=v;S.stuck=true;P3.tone(220,.08,'square',.05);}
      S.post={a:S.v1,b:S.v2};S.log.push({t:S.type==='el'?'مرن':'غير مرن',m1,m2,u:u1,a:S.v1,b:S.v2});renderNB();render();}
    if(S.stuck)S.x1=S.x2-GW-.02;
    const lim=TL/2-.3;if(S.x2>lim){S.x2=lim;S.v2=0;if(S.stuck)S.v1=0;}if(S.x1<-lim){S.x1=-lim;S.v1=0;}if(S.hit&&!S.stuck&&S.x1>S.x2-GW-.02){S.x1=S.x2-GW-.02;S.v1=Math.min(S.v1,S.v2);}}
  if(S.hit&&Math.abs(S.v1)<1e-3&&Math.abs(S.v2)<1e-3){S.run=false;sync();}
  if(S.hit&&S.x2>=TL/2-.31&&(Math.abs(S.v1)<.02||S.stuck)){S.run=false;S.v1=S.v2=0;sync();}
  place();});
function setM(w,v){if(S.run)return;S[w]=v;sec.$$(`[data-a="${w}"]`).forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));place();}
function setTy(v){if(S.run)return;S.type=v;sec.$$('[data-a="ty"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===v));place();}
async function go(){if(S.run)return;S.x1=-1.6;S.x2=.3;S.v1=0;S.v2=0;S.hit=false;S.stuck=false;place();P3.whoosh();await L.tw(250,q=>{S.x1=-1.6-.08*Math.sin(q*Math.PI);place();});S.v1=S.v0;S.run=true;sync();render();}
function reset(){S.run=false;S.x1=-1.6;S.x2=.3;S.v1=S.v2=0;S.log=[];S.hit=false;S.stuck=false;place();sync();renderNB();render();}
function stepIdx(){if(!S.log.length)return S.run?1:0;if(!S.log.some(r=>r.t==='غير مرن')||!S.log.some(r=>r.t==='مرن'))return S.log.length<2?2:3;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='اختر الكتل والسرعة';html=`<p class="p3-txt">العربة 2 ساكنة في منتصف المسار. اختر كتلتي العربتين وسرعة العربة 1 ونوع التصادم، ثم أطلق العربة 1.</p>`;}
  else if(k===1){title='راقب التصادم';html=`<p class="p3-txt">تقيس البوابتان الضوئيتان السرعة قبل التصادم وبعده. تمثّل الأسهم زخم كل عربة. جرّب 🐢 الحركة البطيئة.</p>`;}
  else if(k===2){title='قارن الزخم';html=`<p class="p3-txt">قارن الزخم الكلي قبل التصادم وبعده في دفتر المختبر. جرّب كتلًا مختلفة.</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">في كل التصادمات بقي الزخم الكلي ثابتًا (قانون حفظ الزخم). في التصادم المرن ترتد العربتان، وفي غير المرن تلتصقان وتتحركان معًا بسرعة أقل.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>النوع</th><th>ك1/ك2</th><th>ع1 قبل</th><th>ع1/ع2 بعد</th><th>ز قبل</th><th>ز بعد</th></tr></thead><tbody>${S.log.length?S.log.map(r=>`<tr><td>${r.t}</td><td class="n">${r.m1}/${r.m2}</td><td class="n">${r.u.toFixed(2)}</td><td class="n">${r.a.toFixed(2)} / ${r.b.toFixed(2)}</td><td class="n">${(r.m1*r.u).toFixed(3)}</td><td class="n"><b>${(r.m1*r.a+r.m2*r.b).toFixed(3)}</b></td></tr>`).join(''):'<tr><td colspan="6">—</td></tr>'}</tbody></table><p class="x-note">السرعات بوحدة m/s والزخم بوحدة kg·m/s.</p>`;}
function sync(){sec.$('[data-a="go"]').disabled=S.run;}
X.side(sec,{m1:b=>setM('m1',+b.dataset.v),m2:b=>setM('m2',+b.dataset.v),ty:b=>setTy(b.dataset.v),go,reset});
sec.$('#mVr').addEventListener('input',e=>{S.v0=+e.target.value;sec.$('#mVr-o').textContent=S.v0.toFixed(1)+' m/s';});
place();sync();render();renderNB();
};

/* =====================================================================
   ١٦) صاروخ البالون: الفعل ورد الفعل (ثالث متوسط · القانون الثالث لنيوتن)
   ===================================================================== */
const BAL={};EXP_MODS.ballo9=BAL;
BAL.init=function(){gm();
const S={pumps:3,load:0,air:0,x:-2.1,v:0,run:false,log:[],vmax:0,inflated:false};P3.dbg.ballo9=S;
const NAMES=['انفخ البالون','أطلق البالون','غيّر كمية الهواء والحمولة','استنتج'];
const sec=P3.section('ballo9',{title:'صاروخ البالون: الفعل ورد الفعل',grade:'ثالث متوسط',lesson:'القانون الثالث لنيوتن',
  hud:`<div class="p3-row">${X.m('المسافة المقطوعة','blD',1)}${X.m('السرعة','blV')}</div><div class="p3-row">${X.m('قوة الدفع','blF',1)}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    ${X.rng('عدد مرات النفخ','blP',1,5,1,3,'')}
    <div class="p3-acts"><span class="p3-lab">الحمولة:</span>${[0,1,2,3].map(n=>`<button class="p3-b" data-a="ld" data-v="${n}" ${n===0?'aria-pressed="true"':''}>${n} مشبك</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b" data-a="inf">🎈 انفخ البالون</button><button class="p3-b pri" data-a="go">🚀 أطلق</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>القانون الثالث لنيوتن</h3><p>لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه. القوتان تؤثران في <b>جسمين مختلفين</b> لذلك لا تلغي إحداهما الأخرى.</p>
    <p>في صاروخ البالون: يدفع البالون الهواء إلى <b>الخلف</b> (الفعل)، فيدفع الهواء البالون إلى <b>الأمام</b> (رد الفعل). وهكذا تعمل محركات الصواريخ الحقيقية.</p></div>
    <div class="panel"><h3>ما الذي يؤثر في المسافة؟</h3><p>كلما زادت كمية الهواء استمرت قوة الدفع مدة أطول فقطع البالون مسافة أكبر، وكلما زادت كتلة الحمولة قلّ تسارعه (القانون الثاني: ت = ق ÷ ك).</p></div>`,
  quiz:[{q:'عندما يندفع الهواء من البالون إلى الخلف يتحرك البالون إلى الأمام. هذا مثال على:',o:['القانون الأول لنيوتن','القانون الثالث لنيوتن','قانون الجاذبية'],a:1},{q:'قوة الفعل وقوة رد الفعل:',o:['متساويتان ومتعاكستان وتؤثران في جسمين مختلفين','متساويتان وفي الاتجاه نفسه','غير متساويتين'],a:0},
        {q:'ماذا يحدث للمسافة التي يقطعها البالون عند زيادة الحمولة؟',o:['تزداد','تقل','لا تتغير'],a:1},{q:'لماذا لا تلغي قوة الفعل قوة رد الفعل؟',o:['لأنهما تؤثران في جسمين مختلفين','لأن إحداهما أكبر','لأنهما في الاتجاه نفسه'],a:0}],
  report:()=>({title:'صاروخ البالون',grade:'ثالث متوسط',lesson:'القانون الثالث لنيوتن',cols:['#','عدد مرات النفخ','الحمولة (مشبك)','المسافة (m)','أقصى سرعة (m/s)'],
    rows:S.log.length?S.log.map((r,i)=>[String(i+1),String(r.p),String(r.l),r.d.toFixed(2),r.v.toFixed(2)]):[['1','','','','']],note:'حدّد قوة الفعل وقوة رد الفعل في التجربة، وما أثر كمية الهواء والحمولة في المسافة.'})
});
const L=new Lab(sec,{target:V(0,1.1,.4),dist:a=>Math.max(5.8,8.8/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
const SL=2.5,Y=1.45;
[-SL,SL].forEach(x=>{const st=KIT.stand(1.8);st.position.set(x+.35,0,.55);L.add(st);});
const str=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,SL*2,6),KIT.mat(0xf0e8d0));str.rotation.z=Math.PI/2;str.position.set(0,Y,.4);L.add(str);
const tape=canvasTex(1024,64,c=>{c.fillStyle='#f2d27a';c.fillRect(0,0,1024,64);c.fillStyle='#10302c';c.strokeStyle='#10302c';c.font='bold 22px "IBM Plex Mono",monospace';for(let i=0;i<=40;i++){const x=12+i*25;c.lineWidth=i%5?1.5:3;c.beginPath();c.moveTo(x,0);c.lineTo(x,i%5?18:30);c.stroke();if(!(i%10))c.fillText((i/10).toFixed(0)+' m',x+3,52);}});
const ruler=new THREE.Mesh(new THREE.PlaneGeometry(SL*2-.3,.14),new THREE.MeshStandardMaterial({map:tape,roughness:.7}));ruler.position.set(.15,.01,1.0);ruler.rotation.x=-Math.PI/2;L.add(ruler);
const bg=new THREE.Group();L.add(bg);
const straw=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.5,12),KIT.phys(0xffffff,{roughness:.3}));straw.rotation.z=Math.PI/2;bg.add(straw);
const balM=KIT.phys(0xd8322a,{roughness:.3,clearcoat:.8});const ball=new THREE.Mesh(new THREE.SphereGeometry(1,40,28),balM);bg.add(ball);
const nozzle=new THREE.Mesh(new THREE.CylinderGeometry(.03,.05,.1,12),balM);nozzle.rotation.z=Math.PI/2;bg.add(nozzle);
const tp=new THREE.Mesh(new THREE.BoxGeometry(.12,.02,.1),KIT.mat(0xe8e2c8));tp.position.y=-.03;bg.add(tp);
const clips=new THREE.Group();bg.add(clips);for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.TorusGeometry(.04,.006,6,16),M.steel);c.scale.y=1.8;c.position.set(-.1+i*.1,-.3,0);c.visible=false;clips.add(c);}
const jet=X.steam(L,70);
/* action/reaction arrows */
const arrow=(col,txt)=>{const g=new THREE.Group();const s=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,1,10),new THREE.MeshBasicMaterial({color:col}));s.rotation.z=-Math.PI/2;s.position.x=.5;const h=new THREE.Mesh(new THREE.ConeGeometry(.08,.18,12),new THREE.MeshBasicMaterial({color:col}));h.rotation.z=-Math.PI/2;h.position.x=1.08;g.add(s,h);L.scene.add(g);g.visible=false;return g;};
const aF=arrow(0x2f6fbf),aR=arrow(0xe0703f);const lF=L.label('رد الفعل: الهواء يدفع البالون للأمام',V(),'x-c'),lR=L.label('الفعل: البالون يدفع الهواء للخلف',V(),'x-w');show(lF,false);show(lR,false);
function size(){return .08+.06*S.air;}
function place(F){const r=size();ball.scale.set(r*1.35,r,r);ball.position.set(-.05,-r-.03,0);nozzle.position.set(-.05-r*1.35-.03,-r-.03,0);bg.position.set(S.x,Y,.4);clips.children.forEach((c,i)=>{c.visible=i<S.load;c.position.y=-2*r-.08;});
  const on=F>.02;aF.visible=aR.visible=on;show(lF,on);show(lR,on);if(on){const len=.3+F*.9;aF.position.set(S.x+.15,Y-r*.6,.75);aF.scale.set(len,1,1);aR.position.set(S.x-r*1.35-.1,Y-r*.6,.75);aR.rotation.y=Math.PI;aR.scale.set(len,1,1);
    L.labels.find(l=>l.el===lF).pos.set(S.x+.6,Y+.35,.75);L.labels.find(l=>l.el===lR).pos.set(S.x-.9,Y-.75,.75);}
  X.txt(sec,'blD',(S.x+2.1).toFixed(2)+' m');X.txt(sec,'blV',Math.abs(S.v).toFixed(2)+' m/s');X.txt(sec,'blF',F.toFixed(2)+' N');}
P3.loop(L,(dt)=>{let F=0;if(S.run){if(S.air>0){F=.3+.1*S.air;S.air=Math.max(0,S.air-dt*1.1);const r=size();for(let k=0;k<3;k++)jet.emit(V(S.x-r*1.35-.12,Y-r-.03,.4),.05,1.4,.16,.32,V(-1,0,0));}
    const fr=S.v>0?.05+.05*S.load:0;const a=(F-.9*S.v-fr)/(.45+.18*S.load);S.v=Math.max(0,S.v+a*dt);if(S.air<=0&&S.v<.01){S.v=0;S.run=false;S.log.push({p:S.pumps,l:S.load,d:S.x+2.1,v:S.vmax});P3.good();toast('توقّف البالون بعد '+(S.x+2.1).toFixed(2)+' m.');renderNB();render();sync();}
    S.x+=S.v*dt;S.vmax=Math.max(S.vmax,S.v);if(S.x>SL-.5){S.x=SL-.5;S.v=0;}}
  jet.tick(dt);place(F);});
async function inf(){if(S.run)return;S.inflated=true;const a0=S.air,a1=S.pumps;for(let i=0;i<S.pumps;i++){P3.noise(.25,.25,500,.8);await L.tw(380,q=>{S.air=a0+(a1-a0)*(i+q)/S.pumps;place(0);});}S.air=a1;sync();render();}
async function go(){if(S.run)return;if(S.air<=0){toast('انفخ البالون أولًا.');return;}S.v=0;S.vmax=0;S.run=true;P3.whoosh();sync();render();}
function ld(v){if(S.run)return;S.load=v;sec.$$('[data-a="ld"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));place(0);}
function reset(){S.run=false;S.x=-2.1;S.v=0;S.air=0;S.log=[];S.inflated=false;place(0);renderNB();render();sync();}
async function back(){if(S.run)return;await L.tw(700,q=>{S.x=S.x+(-2.1-S.x)*q;place(0);});S.x=-2.1;}
function stepIdx(){if(!S.log.length)return S.air>0?1:0;if(S.log.length<3)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='انفخ البالون';html=`<p class="p3-txt">البالون مثبّت بشريط لاصق على ماصّة تنزلق على خيط مشدود. اختر عدد مرات النفخ ثم انفخه.</p>`;}
  else if(k===1){title='أطلق البالون';html=`<p class="p3-txt">أطلق البالون وراقب السهمين: <b>الفعل</b> (البالون يدفع الهواء للخلف) و<b>رد الفعل</b> (الهواء يدفع البالون للأمام).</p>`;}
  else if(k===2){title='غيّر كمية الهواء والحمولة';html=`<p class="p3-txt">أعد البالون ثم جرّب كميات هواء وحمولات مختلفة، وسجّل المسافة (${S.log.length} / 3).</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">يدفع البالون الهواء إلى الخلف فيدفعه الهواء إلى الأمام بقوة مساوية ومعاكسة (القانون الثالث لنيوتن). وزيادة الهواء تزيد المسافة، وزيادة الحمولة تقللها.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>#</th><th>النفخ</th><th>الحمولة</th><th>المسافة</th><th>أقصى سرعة</th></tr></thead><tbody>${S.log.length?S.log.map((r,i)=>`<tr><td>${i+1}</td><td class="n">${r.p}</td><td class="n">${r.l}</td><td class="n"><b>${r.d.toFixed(2)} m</b></td><td class="n">${r.v.toFixed(2)}</td></tr>`).join(''):'<tr><td colspan="5">—</td></tr>'}</tbody></table>`;}
function sync(){sec.$('[data-a="go"]').disabled=S.run;sec.$('[data-a="inf"]').disabled=S.run;sec.$('[data-a="inf"]').textContent=S.x>-2.05&&!S.run?'↩ أعد البالون وانفخه':'🎈 انفخ البالون';}
X.side(sec,{inf:async()=>{if(S.x>-2.05)await back();inf();},go,ld:b=>ld(+b.dataset.v),reset});
sec.$('#blP').addEventListener('input',e=>{S.pumps=+e.target.value;sec.$('#blP-o').textContent=S.pumps;});
place(0);sync();render();renderNB();
};

/* =====================================================================
   ١٧) المجال المغناطيسي وبرادة الحديد (ثالث متوسط · الخصائص العامة للمغناطيس)
   ===================================================================== */
const MAG={};EXP_MODS.mag9=MAG;
MAG.init=function(){gm();
const CFG={one:{n:'مغناطيس واحد',p:[[-.45,0,1],[.45,0,-1]]},ns:{n:'قطبان مختلفان (ش–ج)',p:[[-1.45,0,1],[-.55,0,-1],[.55,0,1],[1.45,0,-1]]},nn:{n:'قطبان متشابهان (ش–ش)',p:[[-1.45,0,-1],[-.55,0,1],[.55,0,1],[1.45,0,-1]]}};
const S={cfg:'one',spr:false,al:0,lines:false,log:{},busy:false};P3.dbg.mag9=S;
const NAMES=['رشّ برادة الحديد','انقر على اللوح','جرّب ترتيبًا آخر','استنتج'];
const sec=P3.section('mag9',{title:'المجال المغناطيسي وبرادة الحديد',grade:'ثالث متوسط',lesson:'الخصائص العامة للمغناطيس',
  hud:`<div class="p3-row">${X.m('الترتيب','mgC',1)}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts" style="flex-direction:column;align-items:stretch">${Object.entries(CFG).map(([k,c])=>`<button class="p3-b" data-a="c" data-v="${k}" ${k==='one'?'aria-pressed="true"':''}>🧲 ${c.n}</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b pri" data-a="spr">✨ رشّ برادة الحديد</button><button class="p3-b" data-a="tap">👆 انقر على اللوح</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="lines" aria-pressed="false">〰 خطوط المجال</button><button class="p3-b" data-a="rec">📋 سجّل الملاحظة</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>المجال المغناطيسي</h3><p>لكل مغناطيس قطبان: <b>شمالي (ش)</b> و<b>جنوبي (ج)</b>. والمنطقة المحيطة بالمغناطيس التي تظهر فيها آثاره هي <b>المجال المغناطيسي</b>، وتمثّله خطوط تخرج من القطب الشمالي وتدخل في القطب الجنوبي.</p>
    <p>تتجمع خطوط المجال (والبرادة) بكثافة عند القطبين؛ لأن المجال أقوى ما يكون هناك.</p></div>
    <div class="panel"><h3>التجاذب والتنافر</h3><p>الأقطاب المختلفة <b>تتجاذب</b> فتمتد خطوط المجال بينها، والأقطاب المتشابهة <b>تتنافر</b> فتتباعد الخطوط وتظهر منطقة خالية بين القطبين.</p></div>`,
  quiz:[{q:'أين تتجمع برادة الحديد بكثافة حول المغناطيس؟',o:['عند منتصفه','عند القطبين','بعيدًا عنه'],a:1},{q:'تخرج خطوط المجال المغناطيسي من القطب:',o:['الشمالي','الجنوبي','من الطرفين'],a:0},
        {q:'عند تقريب قطبين شماليين:',o:['يتجاذبان','يتنافران','لا يحدث شيء'],a:1},{q:'لماذا تتخذ برادة الحديد شكل خطوط حول المغناطيس؟',o:['لأن كل قطعة تصبح مغناطيسًا صغيرًا يتجه مع المجال','لأنها ثقيلة','بسبب الهواء'],a:0}],
  report:()=>({title:'المجال المغناطيسي وبرادة الحديد',grade:'ثالث متوسط',lesson:'الخصائص العامة للمغناطيس',cols:['الترتيب','شكل البرادة','تجاذب أم تنافر؟'],
    rows:Object.entries(CFG).map(([k,c])=>[c.n,S.log[k]?(k==='one'?'خطوط من القطب إلى القطب وتتجمع عند القطبين':k==='ns'?'خطوط تمتد بين القطبين المتقابلين':'خطوط تتباعد وتترك منطقة خالية بينهما'):'',S.log[k]?(k==='one'?'—':k==='ns'?'تجاذب':'تنافر'):'']),note:'ارسم شكل البرادة في كل ترتيب، وحدّد عليه القطبين.'})
});
const L=new Lab(sec,{target:V(0,.15,.6),dist:a=>Math.max(3.8,6/a),exposure:.95});buildRoom(L);
L.resize=(o=>function(){const had=this.camSet;o.call(this);const d=this.distFn(this.stage.clientWidth/Math.max(1,this.stage.clientHeight));this.camHome.set(this.tgt.x,this.tgt.y+d*.92,this.tgt.z+d*.5);if(!had&&this.camSet)this.camera.position.copy(this.camHome);})(L.resize);
L.controls.minPolarAngle=.15;
const toast=m=>L.toast(m);
const BW=4.0,BD=2.4,BY=.12,BZ=.6;
const board=new THREE.Mesh(RBox(BW,.04,BD,.02),KIT.phys(0xfbfaf4,{roughness:.6,clearcoat:.1}));board.position.set(0,BY-.02,BZ);board.receiveShadow=true;L.add(board);
/* magnets (on the board) */
const mags=new THREE.Group();L.add(mags);
function bar(x1,x2,n1){const g=new THREE.Group();const len=Math.abs(x2-x1),cx=(x1+x2)/2;const half=(c,x)=>{const m=new THREE.Mesh(RBox(len/2,.14,.3,.02),KIT.phys(c,{roughness:.35}));m.position.set(x,.07,0);g.add(m);};
  const left=n1>0?0xd8322a:0x2f5fd0,right=n1>0?0x2f5fd0:0xd8322a;half(left,cx-len/4);half(right,cx+len/4);
  const lab=(t,x)=>{const c=P3.card([{t,s:120}],.18,.18,{bg:'#ffffff',bd:'#ffffff'});c.rotation.x=-Math.PI/2;c.position.set(x,.145,0);g.add(c);};lab(n1>0?'ش':'ج',cx-len/2+.14);lab(n1>0?'ج':'ش',cx+len/2-.14);
  g.position.set(0,BY,BZ);castAll(g);mags.add(g);}
function build(){while(mags.children.length)mags.remove(mags.children[0]);const p=CFG[S.cfg].p;for(let i=0;i<p.length;i+=2)bar(p[i][0],p[i+1][0],p[i][2]);X.txt(sec,'mgC',CFG[S.cfg].n);}
function field(x,z){let bx=0,bz=0;const p=CFG[S.cfg].p;p.forEach(([px,pz,q])=>{const dx=x-px,dz=z-pz;const r2=dx*dx+dz*dz+.004;const r3=r2*Math.sqrt(r2);bx+=q*dx/r3;bz+=q*dz/r3;});return [bx,bz];}
const inMag=(x,z)=>{const p=CFG[S.cfg].p;for(let i=0;i<p.length;i+=2){const a=Math.min(p[i][0],p[i+1][0])-.03,b=Math.max(p[i][0],p[i+1][0])+.03;if(x>a&&x<b&&Math.abs(z)<.18)return true;}return false;};
/* filings */
const NF=2600,fm=new THREE.InstancedMesh(new THREE.BoxGeometry(.05,.008,.008),KIT.mat(0x3a3d40,{metalness:.7,roughness:.5}),NF);fm.count=0;L.scene.add(fm);
const FL=[];for(let i=0;i<NF;i++){FL.push({x:(Math.random()-.5)*(BW-.2),z:(Math.random()-.5)*(BD-.2),a:Math.random()*Math.PI,y:1.5+Math.random()*.8,vy:0,tgt:0,str:0});}
function targets(){FL.forEach(f=>{const [bx,bz]=field(f.x,f.z);f.tgt=Math.atan2(bz,bx);f.str=Math.hypot(bx,bz);f.hide=inMag(f.x,f.z);});}
const dO=new THREE.Object3D();
function drawF(){for(let i=0;i<fm.count;i++){const f=FL[i];dO.position.set(f.x,f.hide?-5:Math.max(BY+.006,f.y),BZ+f.z);dO.rotation.set(0,-f.a,0);dO.updateMatrix();fm.setMatrixAt(i,dO.matrix);}fm.instanceMatrix.needsUpdate=true;}
/* compasses */
const comps=[[-1.6,.85],[0,.85],[1.6,.85],[0,-.85]].map(([x,z])=>{const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.04,28),KIT.phys(0xf0f0ec));const gl=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.01,28),G.glassT);gl.position.y=.03;
  const nd=new THREE.Group();const n=new THREE.Mesh(new THREE.ConeGeometry(.025,.1,10),KIT.mat(0xd8322a));n.rotation.z=-Math.PI/2;n.position.x=.05;const s=new THREE.Mesh(new THREE.ConeGeometry(.025,.1,10),KIT.mat(0x2f5fd0));s.rotation.z=Math.PI/2;s.position.x=-.05;nd.add(n,s);nd.position.y=.035;
  g.add(b,gl,nd);g.position.set(x,BY+.02,BZ+z);castAll(g);L.add(g);return {g,nd,x,z,a:0};});
/* field lines */
const linesG=new THREE.Group();L.scene.add(linesG);linesG.visible=false;
function buildLines(){while(linesG.children.length){const c=linesG.children[0];c.geometry.dispose();linesG.remove(c);}const p=CFG[S.cfg].p;const mat=new THREE.LineBasicMaterial({color:0x2563eb,transparent:true,opacity:.75});
  p.filter(q=>q[2]>0).forEach(([px,pz])=>{for(let k=0;k<16;k++){const a=k/16*Math.PI*2;let x=px+Math.cos(a)*.06,z=pz+Math.sin(a)*.06;const pts=[V(x,BY+.02,BZ+z)];for(let s=0;s<400;s++){const [bx,bz]=field(x,z);const m=Math.hypot(bx,bz)||1;x+=bx/m*.02;z+=bz/m*.02;pts.push(V(x,BY+.02,BZ+z));
      if(Math.abs(x)>BW/2-.05||Math.abs(z)>BD/2-.05)break;if(p.some(q=>q[2]<0&&Math.hypot(x-q[0],z-q[1])<.05))break;}linesG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),mat));}});}
P3.loop(L,(dt)=>{let any=false;for(let i=0;i<fm.count;i++){const f=FL[i];if(f.y>BY){f.vy+=9.8*.4*dt;f.y-=f.vy*dt;any=true;}}
  if(S.al>0){S.al-=dt;FL.forEach((f,i)=>{if(i>=fm.count)return;const k=clamp(f.str*.9,0,1)*Math.min(1,dt*6);let d=f.tgt-f.a;d=Math.atan2(Math.sin(2*d),Math.cos(2*d))/2;f.a+=d*k+(Math.random()-.5)*.05*(1-clamp(f.str,0,1));});any=true;}
  if(any)drawF();
  comps.forEach(c=>{const [bx,bz]=field(c.x,c.z);const t=Math.atan2(bz,bx);let d=t-c.a;d=Math.atan2(Math.sin(d),Math.cos(d));c.a+=d*Math.min(1,dt*4);c.nd.rotation.y=-c.a;});});
async function spr(){if(S.busy)return;S.spr=true;targets();FL.forEach(f=>{f.y=1.2+Math.random()*1.4;f.vy=0;f.a=Math.random()*Math.PI;});fm.count=NF;P3.noise(1.4,.2,3000,.5);L.focus(V(0,3.4,2.6),V(0,.1,.6),900);toast('رُشّت برادة الحديد. انقر على اللوح بلطف لترى ترتيبها.');render();}
function tap(){if(!S.spr){toast('رشّ برادة الحديد أولًا.');return;}S.al=2.5;P3.tone(260,.06,'square',.04);S.log[S.cfg]=true;renderNB();render();}
function setC(k){S.cfg=k;sec.$$('[data-a="c"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===k));build();if(S.spr){targets();FL.forEach(f=>{f.a=Math.random()*Math.PI;});drawF();toast('تغيّر الترتيب: انقر على اللوح مرة أخرى.');}if(S.lines)buildLines();render();}
function lines(b){S.lines=!S.lines;b.setAttribute('aria-pressed',S.lines);if(S.lines)buildLines();linesG.visible=S.lines;}
function rec(){if(!S.log[S.cfg]){toast('انقر على اللوح أولًا لترتيب البرادة.');return;}P3.click();toast('سُجّلت ملاحظة: '+CFG[S.cfg].n);renderNB();render();}
function reset(){S.spr=false;fm.count=0;S.log={};S.al=0;setC('one');L.home(800);renderNB();render();}
function stepIdx(){const n=Object.keys(S.log).length;if(!S.spr)return 0;if(!n)return 1;if(n<3)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='رشّ برادة الحديد';html=`<p class="p3-txt">المغناطيس موضوع على لوح أبيض، وحوله أربع بوصلات. رشّ برادة الحديد على اللوح.</p>`;}
  else if(k===1){title='انقر على اللوح';html=`<p class="p3-txt">انقر على اللوح بلطف فتهتز البرادة وتترتب على شكل خطوط المجال المغناطيسي. لاحظ اتجاه إبر البوصلات.</p>`;}
  else if(k===2){title='جرّب ترتيبًا آخر';html=`<p class="p3-txt">جرّب قطبين مختلفين متقابلين ثم قطبين متشابهين، وانقر على اللوح في كل مرة (${Object.keys(S.log).length} / 3). يمكنك إظهار خطوط المجال.</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">تتجمع البرادة عند القطبين حيث المجال أقوى، وتتخذ شكل خطوط من القطب الشمالي إلى الجنوبي. الأقطاب المختلفة تتجاذب فتمتد الخطوط بينها، والمتشابهة تتنافر فتتباعد الخطوط.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>الترتيب</th><th>الملاحظة</th></tr></thead><tbody>${Object.entries(CFG).map(([k,c])=>`<tr><td>${c.n}</td><td>${S.log[k]?(k==='one'?'البرادة كثيفة عند القطبين':k==='ns'?'خطوط تصل بين القطبين ← تجاذب':'خطوط متباعدة ومنطقة خالية ← تنافر'):'—'}</td></tr>`).join('')}</tbody></table>`;}
X.side(sec,{c:b=>setC(b.dataset.v),spr,tap,lines,rec,reset});
build();render();renderNB();
};

/* =====================================================================
   ١٨) المغناطيس الكهربائي (ثالث متوسط · الكهرومغناطيسية)
   ===================================================================== */
const EMAG={};EXP_MODS.emag9=EMAG;
EMAG.init=function(){gm();
const S={turns:20,cells:2,on:false,held:0,log:[],busy:false};P3.dbg.emag9=S;
const NAMES=['أغلق الدائرة','غيّر عدد اللفات','غيّر شدة التيار','استنتج'];
const sec=P3.section('emag9',{title:'المغناطيس الكهربائي: اللفات والتيار',grade:'ثالث متوسط',lesson:'الكهرومغناطيسية',
  hud:`<div class="p3-row">${X.m('شدة التيار','eI',1)}${X.m('المشابك المرفوعة','eN')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">عدد اللفات:</span>${[10,20,30].map(n=>`<button class="p3-b" data-a="t" data-v="${n}" ${n===20?'aria-pressed="true"':''}>${n} لفة</button>`).join('')}</div>
    <div class="p3-acts"><span class="p3-lab">البطاريات:</span>${[1,2,3].map(n=>`<button class="p3-b" data-a="b" data-v="${n}" ${n===2?'aria-pressed="true"':''}>${n} (${(n*1.5).toFixed(1)} V)</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b pri" data-a="sw">⚡ أغلق المفتاح</button><button class="p3-b" data-a="rec">📋 سجّل</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>المغناطيس الكهربائي</h3><p>عند مرور تيار كهربائي في سلك يتكوّن حوله مجال مغناطيسي. وإذا لُفّ السلك على شكل ملف حول قلب من الحديد المطاوع تكوّن <b>مغناطيس كهربائي</b> قوي.</p>
    <p>تزداد قوة المغناطيس الكهربائي بزيادة <b>عدد لفات الملف</b> وبزيادة <b>شدة التيار</b>، ويفقد مغناطيسيته عند فتح الدائرة.</p></div>
    <div class="panel"><h3>تطبيقات</h3><p>الرافعات الكهرومغناطيسية في مصانع الحديد، والأجراس الكهربائية، ومكبرات الصوت، والمحركات الكهربائية.</p></div>`,
  quiz:[{q:'أيٌّ مما يلي يزيد قوة المغناطيس الكهربائي؟',o:['تقليل عدد اللفات','زيادة شدة التيار','فتح الدائرة'],a:1},{q:'ماذا يحدث للمشابك عند فتح الدائرة؟',o:['تبقى معلقة','تسقط لأن المغناطيسية تزول','تنجذب أكثر'],a:1},
        {q:'لماذا يُستخدم قلب من الحديد داخل الملف؟',o:['لتقوية المجال المغناطيسي','لتقليل التيار','لأنه عازل'],a:0},{q:'من تطبيقات المغناطيس الكهربائي:',o:['الرافعة الكهرومغناطيسية','المرآة المستوية','ميزان الحرارة'],a:0}],
  report:()=>({title:'المغناطيس الكهربائي',grade:'ثالث متوسط',lesson:'الكهرومغناطيسية',cols:['#','عدد اللفات','عدد البطاريات','شدة التيار (A)','عدد المشابك'],
    rows:S.log.length?S.log.map((r,i)=>[String(i+1),String(r.t),String(r.b),r.I.toFixed(2),String(r.n)]):[['1','','','','']],note:'ما العوامل التي تزيد قوة المغناطيس الكهربائي؟'})
});
const L=new Lab(sec,{target:V(0,.8,.4),dist:a=>Math.max(4.4,6.8/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* stand + horizontal nail electromagnet held vertical */
const st=KIT.stand(2.4);st.position.set(-.15,0,.25);st.rotation.y=-Math.PI/2;L.add(st);const cl=KIT.clamp(.5,1.9);st.add(cl);
const NX=0,NTOP=1.95,NBOT=.95,NZ=.4;
const nail=new THREE.Group();{const sh=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,NTOP-NBOT,16),KIT.mat(0x8e969c,{metalness:.85,roughness:.3}));sh.position.y=(NTOP+NBOT)/2;const hd=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.03,20),KIT.mat(0x8e969c,{metalness:.85}));hd.position.y=NTOP;
  const tip=new THREE.Mesh(new THREE.ConeGeometry(.035,.08,16),KIT.mat(0x8e969c,{metalness:.85}));tip.rotation.x=Math.PI;tip.position.y=NBOT-.04;nail.add(sh,hd,tip);castAll(nail);}
nail.position.set(NX,0,NZ);L.add(nail);
let coil=null;const cm=KIT.mat(0xc8794a,{metalness:.8,roughness:.3});
function buildCoil(){if(coil){L.scene.remove(coil);coil.geometry.dispose();}const n=S.turns,pts=[];const y0=NBOT+.12,y1=NTOP-.12;const N=n*24;for(let i=0;i<=N;i++){const t=i/N,a=t*n*Math.PI*2;pts.push(V(NX+Math.cos(a)*.055,y0+(y1-y0)*t,NZ+Math.sin(a)*.055));}
  coil=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),N,.012,6),cm);coil.castShadow=true;L.scene.add(coil);}
/* battery pack + switch + ammeter */
const pack=new THREE.Group();L.add(pack);
function buildPack(){while(pack.children.length)pack.remove(pack.children[0]);for(let i=0;i<S.cells;i++){const c=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.45,20),KIT.mat(0x2b3036));b.rotation.z=Math.PI/2;const t=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.12,20),KIT.mat(0xd0a020,{metalness:.5}));t.rotation.z=Math.PI/2;t.position.x=.2;
    const p=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.03,10),M.steel);p.rotation.z=Math.PI/2;p.position.x=.28;c.add(b,t,p);c.position.set(-1.7,.09,.95-i*.2);castAll(c);pack.add(c);}}
const swB=new THREE.Mesh(RBox(.4,.06,.22,.02),KIT.mat(0xb07a4a));swB.position.set(-.9,.03,1.15);L.add(swB);const lever=new THREE.Mesh(new THREE.BoxGeometry(.32,.025,.04),M.steel);lever.position.set(-.9,.12,1.15);L.add(lever);
const amB=new THREE.Mesh(RBox(.5,.34,.24,.04),KIT.phys(0xeeeeec));amB.position.set(-1.0,.17,.15);castAll(amB);L.add(amB);const aml=KIT.lcd(.38,.14);aml.m.position.set(-1.0,.22,.275);L.add(aml.m);aml.set('0.00 A');
L.add(KIT.wire([V(-1.4,.1,.95),V(-1.2,.08,1.15),V(-1.1,.1,1.15)],0xc0392b,.016));L.add(KIT.wire([V(-.7,.1,1.15),V(-.4,.1,.9),V(-.05,.8,.42),V(NX+.05,NBOT+.12,NZ+.05)],0xc0392b,.016));
L.add(KIT.wire([V(NX+.05,NTOP-.12,NZ+.05),V(-.5,1.3,.3),V(-.8,.25,.15)],0x222222,.016));L.add(KIT.wire([V(-1.25,.15,.15),V(-1.8,.1,.4),V(-1.95,.09,.6)],0x222222,.016));
/* clip pile */
const dish=new THREE.Mesh(new THREE.CylinderGeometry(.42,.36,.06,32),KIT.phys(0xe9ecea,{roughness:.3}));dish.position.set(NX,.11,NZ);L.add(dish);
const NC=30,clipGeo=new THREE.TorusGeometry(.04,.007,6,18);const CL=[];
for(let i=0;i<NC;i++){const m=new THREE.Mesh(clipGeo,M.steel);m.scale.set(1,1.9,1);const a=Math.random()*6.28,r=Math.random()*.3;const home=V(NX+Math.cos(a)*r,.15+Math.random()*.03,NZ+Math.sin(a)*r);m.position.copy(home);m.rotation.set(Math.PI/2+Math.random()*.4,0,Math.random()*3);m.castShadow=true;L.add(m);CL.push({m,home,rot:m.rotation.clone(),up:false});}
const comp=new THREE.Group();{const b=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.04,28),KIT.phys(0xf0f0ec));const nd=new THREE.Group();const n=new THREE.Mesh(new THREE.ConeGeometry(.025,.1,10),KIT.mat(0xd8322a));n.rotation.z=-Math.PI/2;n.position.x=.05;const s=new THREE.Mesh(new THREE.ConeGeometry(.025,.1,10),KIT.mat(0x2f5fd0));s.rotation.z=Math.PI/2;s.position.x=-.05;nd.add(n,s);nd.position.y=.035;comp.add(b,nd);comp.userData.nd=nd;castAll(comp);}
comp.position.set(.75,.02,.95);L.add(comp);
const I=()=>S.cells*1.5/3;const nClips=()=>S.on?Math.min(NC,Math.round(S.turns*I()*.38)):0;
let fieldA=0;
P3.loop(L,(dt)=>{const tg=S.on?Math.min(1,S.turns*I()/45):0;fieldA+=(tg-fieldA)*Math.min(1,dt*4);comp.userData.nd.rotation.y=-(fieldA*1.2);X.txt(sec,'eI',(S.on?I():0).toFixed(2)+' A');aml.set((S.on?I():0).toFixed(2)+' A');X.txt(sec,'eN',String(S.held));
  lever.rotation.z=S.on?0:-.5;lever.position.y=S.on?.075:.12;});
async function update(){S.busy=true;sync();const want=nClips();const tasks=[];
  CL.forEach((c,i)=>{const up=i<want;if(up===c.up)return;c.up=up;const p0=c.m.position.clone();const tgt=up?V(NX+(Math.random()-.5)*.08,NBOT-.09-Math.floor(i/3)*.07,NZ+(Math.random()-.5)*.08):c.home.clone();
    tasks.push(new Promise(r=>setTimeout(()=>{L.tw(up?380:520,q=>{const e=up?q*q:q*q;c.m.position.copy(p0.clone().lerp(tgt,e));if(up)c.m.rotation.set(Math.PI/2*(1-q)+.0,q*.6,0);else c.m.rotation.copy(c.rot);},()=>{if(up)P3.tone(1200+Math.random()*400,.03,'triangle',.03);r();});},i*35)));});
  await Promise.all(tasks);S.held=want;S.busy=false;sync();render();}
function sw(b){if(S.busy)return;S.on=!S.on;b.textContent=S.on?'⭘ افتح المفتاح':'⚡ أغلق المفتاح';b.setAttribute('aria-pressed',S.on);P3.click();if(S.on)L.focus(V(.9,1.2,2.6),V(0,.7,.4),900);update();if(!S.on)toast('فُتحت الدائرة: زالت المغناطيسية فسقطت المشابك.');}
async function setT(v){if(S.busy)return;S.turns=v;sec.$$('[data-a="t"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));buildCoil();if(S.on)await update();}
async function setB(v){if(S.busy)return;S.cells=v;sec.$$('[data-a="b"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));buildPack();if(S.on)await update();}
function rec(){if(!S.on){toast('أغلق المفتاح أولًا.');return;}const r={t:S.turns,b:S.cells,I:I(),n:S.held};const k=S.log.findIndex(x=>x.t===r.t&&x.b===r.b);if(k>=0)S.log[k]=r;else S.log.push(r);P3.click();toast(`${r.t} لفة · ${r.I.toFixed(2)} A ← ${r.n} مشبكًا`);renderNB();render();}
async function reset(){if(S.busy)return;if(S.on){S.on=false;const b=sec.$('[data-a="sw"]');b.textContent='⚡ أغلق المفتاح';b.setAttribute('aria-pressed',false);await update();}S.log=[];L.home(700);renderNB();render();}
function stepIdx(){const ts=new Set(S.log.map(r=>r.t)),bs=new Set(S.log.map(r=>r.b));if(!S.log.length)return 0;if(ts.size<2)return 1;if(bs.size<2)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='أغلق الدائرة';html=`<p class="p3-txt">ملف من سلك نحاسي ملفوف حول مسمار حديدي، متصل ببطاريتين ومفتاح. أغلق المفتاح وراقب المشابك والبوصلة، ثم سجّل.</p>`;}
  else if(k===1){title='غيّر عدد اللفات';html=`<p class="p3-txt">ثبّت عدد البطاريات وغيّر عدد اللفات، وسجّل عدد المشابك في كل مرة.</p>`;}
  else if(k===2){title='غيّر شدة التيار';html=`<p class="p3-txt">ثبّت عدد اللفات وغيّر عدد البطاريات (شدة التيار)، وسجّل.</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">تزداد قوة المغناطيس الكهربائي (عدد المشابك المرفوعة) بزيادة عدد اللفات وبزيادة شدة التيار، وتزول مغناطيسيته عند فتح الدائرة.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){const pts=S.log.filter(r=>r.b===2).map(r=>[r.t,r.n]);sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>اللفات</th><th>البطاريات</th><th>التيار</th><th>المشابك</th></tr></thead><tbody>${S.log.length?S.log.map(r=>`<tr><td class="n">${r.t}</td><td class="n">${r.b}</td><td class="n">${r.I.toFixed(2)} A</td><td class="n"><b>${r.n}</b></td></tr>`).join(''):'<tr><td colspan="4">—</td></tr>'}</tbody></table>`+
  (pts.length>1?KIT.chart({w:320,h:170,xl:'عدد اللفات (بطاريتان)',yl:'عدد المشابك',xmin:0,xmax:30,ymin:0,xticks:[0,10,20,30],series:[{c:'var(--accent)',name:'المشابك',pts}]}):'');}
function sync(){['sw','rec','reset'].forEach(a=>sec.$(`[data-a="${a}"]`).disabled=S.busy);sec.$$('[data-a="t"],[data-a="b"]').forEach(b=>b.disabled=S.busy);}
X.side(sec,{t:b=>setT(+b.dataset.v),b:b=>setB(+b.dataset.v),sw,rec,reset});
buildCoil();buildPack();sync();render();renderNB();
};

X.reg(['volc9','bond9','mom9','ballo9','mag9','emag9']);
})();
