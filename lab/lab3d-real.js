/* =====================================================================
   المختبر الافتراضي الذكي — المظهر الواقعي (نموذج تجريبي)
   استوديو مختبر واقعي + زجاج بانعكاس حواف + سوائل مشبعة الألوان
   تجربتان: الأحماض والقواعد وقياس pH · فصل المخاليط بالترشيح والتبخير
   إعداد أ. علي البقاشي — مدرسة أبي الدرداء المتوسطة
   ===================================================================== */
(function(){
'use strict';
if(typeof THREE==='undefined'||typeof Lab==='undefined'||!window.P3X||!window.X3)return;
const {P3,G,gm,Flame,setCol,$lc,sleep,hex6,clamp,show}=window.P3X;const {X}=window.X3;

/* ---------------- realistic studio ---------------- */
const R={};
let BG_TEX=null;
R.bgTex=()=>{if(BG_TEX)return BG_TEX;const W=2048,H=1024,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#f4f7fa');g.addColorStop(.55,'#e9eef3');g.addColorStop(1,'#dfe6ec');x.fillStyle=g;x.fillRect(0,0,W,H);
  /* windows light */
  [[120,60,300,330],[1620,60,300,330]].forEach(([a,b,w,h])=>{const gg=x.createLinearGradient(a,b,a+w,b+h);gg.addColorStop(0,'#ffffff');gg.addColorStop(1,'#eaf2f8');x.fillStyle=gg;x.fillRect(a,b,w,h);});
  /* two wall shelves with bottles and flasks */
  const cols=['#2f6fd0','#2fa04a','#d8342a','#f2b90f','#7cc4ef','#8a4bd0','#e07a1f','#bfe3f3'];
  [[150,'s'],[330,'s']].forEach(([y],row)=>{x.fillStyle='#cfd8df';x.fillRect(0,y+60,W,10);x.fillStyle='#b9c3cb';x.fillRect(0,y+70,W,4);
    for(let i=0,px=40+row*30;px<W-40;i++){const t=(i*7+row*3)%5,w=t===2?62:t===4?40:50,h=t===2?70:t===4?92:80,col=cols[(i*3+row)%cols.length];
      if(t===2){x.fillStyle='rgba(220,235,242,.9)';x.beginPath();x.moveTo(px+w*.38,y+60-h);x.lineTo(px+w*.62,y+60-h);x.lineTo(px+w*.62,y+60-h*.55);x.lineTo(px+w,y+60);x.lineTo(px,y+60);x.lineTo(px+w*.38,y+60-h*.55);x.closePath();x.fill();
        x.fillStyle=col;x.beginPath();x.moveTo(px+w*.14,y+60-h*.28);x.lineTo(px+w*.86,y+60-h*.28);x.lineTo(px+w,y+60);x.lineTo(px,y+60);x.closePath();x.fill();}
      else{x.fillStyle='rgba(225,238,245,.92)';x.fillRect(px,y+60-h,w,h);x.fillStyle=col;x.fillRect(px+3,y+60-h*.62,w-6,h*.62-2);x.fillStyle='rgba(255,255,255,.5)';x.fillRect(px+6,y+62-h,5,h-6);
        if(t===4){x.fillStyle='#3a3f44';x.fillRect(px+w*.3,y+48-h,w*.4,14);}}
      px+=w+18+(i%4===3?40:0);}});
  /* back counter + blue cabinets */
  x.fillStyle='#f2f4f5';x.fillRect(0,560,W,26);x.fillStyle='#c8d0d6';x.fillRect(0,586,W,6);
  for(let i=0;i<14;i++){const px=i*150;const gg=x.createLinearGradient(0,592,0,H);gg.addColorStop(0,'#3d7fd6');gg.addColorStop(1,'#2a5fae');x.fillStyle=gg;x.fillRect(px+4,592,142,H-592);
    x.fillStyle='rgba(255,255,255,.18)';x.fillRect(px+4,592,142,6);x.fillStyle='#dfe7ee';x.fillRect(px+60,660,30,8);}
  /* counter-top glassware */
  for(let i=0;i<22;i++){const px=30+i*92+(i%3)*12,h=40+(i%4)*18,w=26+(i%3)*8,col=cols[(i*5)%cols.length];x.fillStyle='rgba(225,238,245,.9)';x.fillRect(px,560-h,w,h);x.fillStyle=col;x.globalAlpha=.85;x.fillRect(px+2,560-h*.5,w-4,h*.5);x.globalAlpha=1;}
  /* blur by down/up scaling (works on every browser) */
  const s=document.createElement('canvas');s.width=256;s.height=128;const sx=s.getContext('2d');sx.imageSmoothingQuality='high';sx.drawImage(c,0,0,256,128);
  const m=document.createElement('canvas');m.width=512;m.height=256;const mx=m.getContext('2d');mx.imageSmoothingQuality='high';mx.drawImage(s,0,0,512,256);
  const o=document.createElement('canvas');o.width=1024;o.height=512;const ox=o.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(m,0,0,1024,512);
  BG_TEX=new THREE.CanvasTexture(o);BG_TEX.encoding=THREE.sRGBEncoding;BG_TEX.wrapS=THREE.RepeatWrapping;BG_TEX.repeat.x=2.2;return BG_TEX;};
R.studio=(L,o={})=>{const g=new THREE.Group();
  const bg=new THREE.Mesh(new THREE.CylinderGeometry(11,11,9,64,1,true,Math.PI*.62,Math.PI*.76),new THREE.MeshBasicMaterial({map:R.bgTex(),side:THREE.BackSide,toneMapped:false,fog:false}));
  bg.position.set(0,1.1,3.0);g.add(bg);
  const tm=new THREE.MeshPhysicalMaterial({color:0xe4e9ed,roughness:.28,clearcoat:1,clearcoatRoughness:.08});tm.userData.keepEnv=1;tm.envMapIntensity=.45;
  const top=new THREE.Mesh(RBox(14,.24,5.2,.06),tm);top.position.set(0,-.12,.5);top.receiveShadow=true;g.add(top);
  const cab=new THREE.Mesh(new THREE.BoxGeometry(13.6,2.6,4.8),new THREE.MeshStandardMaterial({color:$lc(0x2f6fc6),roughness:.45}));cab.position.set(0,-1.55,.45);g.add(cab);
  L.scene.add(g);L.scene.background=new THREE.Color(0xe6ecf1);L.scene.fog=null;L.renderer.toneMappingExposure=o.exposure||.82;
  L.scene.children.filter(l=>l.isDirectionalLight).forEach(l=>{l.intensity*=1.05;});
  const fill=new THREE.DirectionalLight(0xdfeaff,.45);fill.position.set(-5,4,6);L.scene.add(fill);return g;};
/* glass with fresnel rim (bright edges like real glassware) */
R.glass=(op=.1,tint=0xffffff)=>{const m=new THREE.MeshPhysicalMaterial({color:$lc(tint),roughness:.03,metalness:0,clearcoat:1,clearcoatRoughness:.03,transparent:true,opacity:op,side:THREE.DoubleSide,depthWrite:false});
  m.userData.keepEnv=1;m.userData.lin=1;m.userData.glass=1;m.envMapIntensity=1.5;
  m.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <dithering_fragment>','float frR=pow(1.0-abs(dot(normalize(normal),normalize(vViewPosition))),2.2);gl_FragColor.rgb+=vec3(frR*.22);gl_FragColor.a=clamp(gl_FragColor.a+frR*.62,0.0,.93);\n#include <dithering_fragment>');};return m;};
R.liquid=(col,op=.9)=>{const m=new THREE.MeshPhysicalMaterial({color:$lc(col),roughness:.18,clearcoat:.4,clearcoatRoughness:.1,transparent:true,opacity:op,emissive:$lc(col),emissiveIntensity:.42});m.userData.keepEnv=1;m.userData.lin=1;m.userData.liq=1;m.envMapIntensity=.45;return m;};
R.setLiq=(m,col)=>{setCol(m,col);m.emissive.copy(m.color);};
/* beaker: returns {g, set(level), lm, top, r, h} — origin at bottom */
R.beaker=(r,h,o={})=>{const g=new THREE.Group(),t=.016;
  const p=[[0,0],[r-.03,0],[r,.03],[r,h-.02],[r+.012,h],[r+.05,h+.01],[r+.035,h+.022],[r-t,h+.006],[r-t,t+.02],[r-.04,t],[0,t]].map(a=>new THREE.Vector2(a[0],a[1]));
  const gl=new THREE.Mesh(new THREE.LatheGeometry(p,72),R.glass(.08));gl.renderOrder=6;g.add(gl);
  const sp=new THREE.Mesh(new THREE.TorusGeometry(.035,.012,8,14,Math.PI),R.glass(.15));sp.position.set(-r-.01,h,0);sp.rotation.set(Math.PI/2,0,Math.PI/2);g.add(sp);
  if(o.grad){const tex=canvasTex(256,512,c=>{c.fillStyle='rgba(255,255,255,.92)';c.font='600 30px "IBM Plex Mono",monospace';for(let i=1;i<=8;i++){const y=500-i*55;c.fillRect(196,y,i%2?30:52,4);if(!(i%2))c.fillText(String(i*o.grad/8),110,y+11);}});
    const gm2=new THREE.Mesh(new THREE.CylinderGeometry(r+.003,r+.003,h*.88,32,1,true,-.35,.7),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));gm2.position.y=h*.46;gm2.renderOrder=7;g.add(gm2);}
  const lm=R.liquid(o.col||0xd6ecf7,o.op==null?.55:o.op);const lq=new THREE.Mesh(new THREE.CylinderGeometry(r-t-.006,r-t-.006,1,64),lm);lq.renderOrder=2;g.add(lq);
  const mm=new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.02,transparent:true,opacity:.22,clearcoat:1,depthWrite:false});mm.userData.keepEnv=1;mm.envMapIntensity=2;
  const men=new THREE.Mesh(new THREE.TorusGeometry(r-t-.012,.008,6,64),mm);men.rotation.x=Math.PI/2;men.renderOrder=3;g.add(men);
  const set=y=>{const on=y>.004;lq.visible=men.visible=on;if(!on)return;lq.scale.y=y;lq.position.y=t+y/2;men.position.y=t+y;};set(o.level||0);
  const sh=shadowDisc(r*.9,.55);g.add(sh);return {g,set,lm,lq,r:r-t,h,y0:t};};
/* lathe vessel whose liquid follows the inner profile (flask, funnel, dish) */
R.profVessel=(prof,o={})=>{const g=new THREE.Group();const pts=prof.map(a=>new THREE.Vector2(a[0],a[1]));const gl=new THREE.Mesh(new THREE.LatheGeometry(pts,64),R.glass(o.op||.09));gl.renderOrder=6;g.add(gl);
  const rAt=y=>{for(let i=0;i<prof.length-1;i++){const a=prof[i],b=prof[i+1];if(y>=Math.min(a[1],b[1])&&y<=Math.max(a[1],b[1])&&b[1]!==a[1]){const u=(y-a[1])/(b[1]-a[1]);return a[0]+(b[0]-a[0])*u;}}return prof[prof.length-1][0];};
  const lm=R.liquid(o.col||0xd6ecf7,o.lop||.6);let lq=null;const y0=o.y0||.02;
  const set=h=>{if(lq){g.remove(lq);lq.geometry.dispose();lq=null;}if(h<.005)return;const n=14,pp=[new THREE.Vector2(0,y0)];for(let i=0;i<=n;i++){const y=y0+h*i/n;pp.push(new THREE.Vector2(Math.max(.001,rAt(y)-.018),y));}pp.push(new THREE.Vector2(0,y0+h));
    lq=new THREE.Mesh(new THREE.LatheGeometry(pp,48),lm);lq.renderOrder=2;g.add(lq);};
  return {g,set,lm,rAt};};
window.R3=R;

/* =====================================================================
   الأحماض والقواعد وقياس pH — نسخة واقعية ثلاثية الأبعاد
   ===================================================================== */
const PHR={};EXP_MODS.ph=PHR;
PHR.init=function(){gm();
const SL=[{id:'lemon',n:'عصير الليمون',ph:2.2,c:0xf0dc78,op:.82},{id:'vinegar',n:'الخل الأبيض',ph:2.9,c:0xeef3f4,op:.4},{id:'water',n:'الماء المقطر',ph:7.0,c:0xdaeef8,op:.35},{id:'bicarb',n:'بيكربونات الصوديوم',ph:8.3,c:0xeaf0f2,op:.5},{id:'soap',n:'ماء وصابون',ph:10.0,c:0xe6eef1,op:.72}];
const KIND={acid:'حمضي',neutral:'متعادل',base:'قاعدي'};const kind=p=>p<6.5?'acid':p>7.5?'base':'neutral';
const BLUE=0x2f5fd0,RED=0xd03a3a;
const S={cur:'lemon',busy:false,R:{}};SL.forEach(s=>S.R[s.id]={});P3.dbg.ph=S;
const NAMES=['اختر محلولًا','ورق عباد الشمس','الكاشف العام','جهاز pH','صنّف المحاليل'];
const sec=P3.section('ph',{title:'الأحماض والقواعد وقياس pH',grade:'أول متوسط',lesson:'الخواص والتغيرات الكيميائية',
  hud:`<div class="p3-row">${X.m('المحلول المختار','phN',1)}${X.m('جهاز pH','phV')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">اختر المحلول</h4><div class="x-grid3">${SL.map(s=>`<button class="p3-b" data-a="pick" data-v="${s.id}">${s.n}</button>`).join('')}</div></div>
    <div class="p3-box"><h4 class="p3-h">أدوات الكشف</h4><div class="x-grid4" style="grid-template-columns:1fr 1fr">
      <button class="p3-b" data-a="use" data-v="blue">🟦 ورق عباد الشمس الأزرق</button><button class="p3-b" data-a="use" data-v="red">🟥 ورق عباد الشمس الأحمر</button>
      <button class="p3-b" data-a="use" data-v="ui">🧪 الكاشف العام</button><button class="p3-b pri" data-a="use" data-v="meter">📟 جهاز pH</button></div>
    <div class="p3-acts phCls"></div></div>`,
  learn:`<div class="panel"><h3>الفكرة العلمية</h3><p><b>الحمض:</b> مادة تحوّل ورق عباد الشمس الأزرق إلى الأحمر، وقيمة pH لها أقل من 7.</p><p><b>القاعدة:</b> مادة تحوّل ورق عباد الشمس الأحمر إلى الأزرق، وقيمة pH لها أكبر من 7.</p><p><b>المتعادل:</b> قيمة pH له 7، ولا يغيّر لون ورق عباد الشمس.</p></div>
    <div class="panel"><h3>أدوات الكشف</h3><p><b>ورق عباد الشمس:</b> يميّز الحمض من القاعدة فقط.</p><p><b>الكاشف العام:</b> يتغيّر لونه بحسب قيمة pH، ونقارنه بمقياس الألوان.</p><p><b>جهاز pH:</b> يعطي القيمة الرقمية بدقة.</p></div>`,
  quiz:[{q:'محلول قيمة pH له 3 يكون:',o:['حمضيًا','قاعديًا','متعادلًا'],a:0},{q:'ورق عباد الشمس الأحمر يتحول إلى الأزرق في:',o:['القواعد','الأحماض','الماء المقطر'],a:0},
    {q:'قيمة pH للماء المقطر:',o:['7','1','14'],a:0},{q:'الأداة التي تعطي قيمة pH رقمية دقيقة:',o:['جهاز pH','ورق عباد الشمس','الكاشف العام'],a:0},{q:'عصير الليمون مادة:',o:['حمضية','قاعدية','متعادلة'],a:0}],
  report:()=>({title:'الأحماض والقواعد وقياس pH',grade:'أول متوسط',lesson:'الخواص والتغيرات الكيميائية',cols:['المحلول','ورق عباد الشمس الأزرق','ورق عباد الشمس الأحمر','لون الكاشف العام','قراءة جهاز pH','التصنيف'],
    rows:SL.map(s=>{const r=S.R[s.id];return [s.n,r.blueTxt||'',r.redTxt||'',r.ui?swatch(hex6(r.ui),''):'',r.meter!=null?r.meter.toFixed(1):'',r.cls?KIND[r.cls]:''];}),note:'قارن لون الكاشف العام بمقياس الألوان، ثم صنّف كل محلول: حمضي أم متعادل أم قاعدي.'})
});
const L=new Lab(sec,{target:V(0,.62,.75),dist:a=>Math.max(3.6,5.9/a),exposure:1});R.studio(L);
const toast=m=>L.toast(m);
const XS=[-1.7,-.85,0,.85,1.7],BZ=.55,BR=.33,BH=.78;const B={};
SL.forEach((s,i)=>{const b=R.beaker(BR,BH,{level:.5,col:s.c,op:s.op,grad:250});b.g.position.set(XS[i],0,BZ);L.add(b.g);B[s.id]={b,x:XS[i],col:s.c};
  if(s.id==='soap'){const fm=new THREE.InstancedMesh(new THREE.SphereGeometry(.035,10,8),new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.1,transparent:true,opacity:.75,clearcoat:1}),40);const d=new THREE.Object3D();
    for(let k=0;k<40;k++){const a=Math.random()*6.28,r=Math.random()*(BR-.06);d.position.set(Math.cos(a)*r,.53+Math.random()*.03,Math.sin(a)*r);d.scale.setScalar(.6+Math.random()*.9);d.updateMatrix();fm.setMatrixAt(k,d.matrix);}b.g.add(fm);}
  const card=P3.card([{t:s.n,s:44}],.74,.16,{bd:'#ffffff'});card.position.set(XS[i],.012,BZ+.55);card.rotation.x=-1.2;L.add(card);
  L.onTap(b.g,()=>pick(s.id));});
/* selection ring */
const ring=new THREE.Mesh(new THREE.RingGeometry(BR+.06,BR+.1,48),new THREE.MeshBasicMaterial({color:0x0d5f56,transparent:true,opacity:.75}));ring.rotation.x=-Math.PI/2;ring.position.y=.006;L.scene.add(ring);
/* universal indicator scale card */
const uiCard=new THREE.Mesh(new THREE.PlaneGeometry(1.9,.32),new THREE.MeshStandardMaterial({map:canvasTex(1200,200,c=>{c.fillStyle='#fff';c.fillRect(0,0,1200,200);for(let i=0;i<=14;i++){c.fillStyle='#'+uiColor(i).getHexString();c.fillRect(20+i*77,20,74,110);c.fillStyle='#10302c';c.font='bold 40px "IBM Plex Mono",monospace';c.textAlign='center';c.fillText(String(i),57+i*77,180);}}),roughness:.6}));
uiCard.position.set(-.9,.012,1.75);uiCard.rotation.x=-1.25;L.add(uiCard);
/* pen pH meter like a real handheld one */
const meter=new THREE.Group();{const body=new THREE.Mesh(RBox(.2,.62,.12,.05),KIT.phys(0xf6f7f7,{roughness:.3,clearcoat:.6}));body.position.y=.31;
  const lcdT=KIT.lcd(.15,.11,'#10302c','#c8d8c0');lcdT.m.position.set(0,.46,.062);meter.userData.lcd=lcdT;const b1=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,.012,16),KIT.mat(0x2b3036));b1.rotation.x=Math.PI/2;b1.position.set(-.04,.33,.062);const b2=b1.clone();b2.position.x=.04;
  const tip=new THREE.Mesh(new THREE.CylinderGeometry(.03,.04,.28,20),KIT.phys(0xe9ecee,{roughness:.3}));tip.position.y=-.14;const sens=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.06,14),R.glass(.4));sens.position.y=-.3;
  meter.add(body,lcdT.m,b1,b2,tip,sens);castAll(meter);}
const MH=V(2.6,.33,.35);meter.position.copy(MH);meter.rotation.z=.12;L.add(meter);meter.userData.lcd.set('--.-');
/* litmus strips + indicator dropper */
const mkStrip=c=>{const g=new THREE.Group();const p=new THREE.Mesh(new THREE.BoxGeometry(.05,.42,.006),KIT.mat(0xf4f1ea,{roughness:.9}));const tm2=new THREE.MeshStandardMaterial({color:$lc(c),roughness:.85});tm2.userData.lin=1;const t=new THREE.Mesh(new THREE.BoxGeometry(.052,.18,.008),tm2);t.position.y=-.12;g.add(p,t);g.userData.tip=t;return g;};
const drop=new THREE.Group();{const gl=new THREE.Mesh(new THREE.CylinderGeometry(.022,.01,.4,14),R.glass(.25));gl.position.y=.2;const ins=new THREE.Mesh(new THREE.CylinderGeometry(.014,.007,.25,10),R.liquid(0x2fa04a,.9));ins.position.y=.14;const bl=new THREE.Mesh(new THREE.SphereGeometry(.045,16,12),G.rubber);bl.scale.y=1.5;bl.position.y=.45;drop.add(gl,ins,bl);}
const DH=V(-2.55,.05,.35);drop.position.copy(DH);L.add(drop);
const uiBot=R.beaker(.13,.28,{level:.2,col:0x2fa04a,op:.85});uiBot.g.position.set(-2.55,0,.35);L.add(uiBot.g);
const bubD=new THREE.Mesh(new THREE.SphereGeometry(.018,10,8),R.liquid(0x2fa04a,.95));bubD.visible=false;L.scene.add(bubD);
function selRing(){ring.position.x=B[S.cur].x;ring.position.z=BZ;sec.$$('[data-a="pick"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===S.cur));X.txt(sec,'phN',SL.find(s=>s.id===S.cur).n);}
function pick(id){if(S.busy)return;S.cur=id;P3.click();meter.userData.lcd.set('--.-');X.txt(sec,'phV','—');selRing();render();}
async function use(t){if(S.busy)return;const s=SL.find(x=>x.id===S.cur),o=B[s.id],r=S.R[s.id],k=kind(s.ph),x=o.x;S.busy=true;sync();
  const top=V(x,BH+.35,BZ),near=V(x,.05,BZ+.36);
  if(t==='blue'||t==='red'){const c0=t==='blue'?BLUE:RED,c1=t==='blue'?(k==='acid'?RED:BLUE):(k==='base'?BLUE:RED);const st=mkStrip(c0);st.position.set(x+.9,.3,BZ+.6);L.add(st);
    await L.focus(V(x+.2,1.15,BZ+2.0),V(x,.45,BZ),700);await L.arc(st,top,600,1.2);await L.move(st,V(x,.42,BZ),600);P3.tone(500,.04,'sine',.03);
    const a=$lc(c0),b=$lc(c1);await L.tw(900,q=>st.userData.tip.material.color.copy(a).lerp(b,q));await sleep(250);await L.move(st,top,500);
    if(r[t+'S'])L.scene.remove(r[t+'S']);await L.arc(st,V(x+(t==='blue'?-.12:.12),.01,BZ+.42),600,1.0);st.rotation.set(-Math.PI/2,0,0);r[t+'S']=st;
    r[t]=c1;r[t+'Txt']=c1===c0?'لم يتغير':(c1===RED?'أحمر':'أزرق');toast(`${t==='blue'?'الورق الأزرق':'الورق الأحمر'} في ${s.n}: ${r[t+'Txt']==='لم يتغير'?'لم يتغير لونه':'تحوّل إلى '+r[t+'Txt']}.`);P3.tone(c1===c0?400:700,.08,'triangle',.05);}
  if(t==='ui'){if(r.ui){toast('أُضيف الكاشف العام إلى هذا المحلول من قبل.');S.busy=false;sync();return;}await L.focus(V(x+.2,1.15,BZ+2.0),V(x,.45,BZ),700);await L.move(drop,V(-2.55,.3,.35),300);await L.arc(drop,V(x,BH+.12,BZ),700,1.2);
    const c1=uiColor(s.ph).getHex();
    for(let j=0;j<3;j++){bubD.visible=true;await L.tw(380,q=>bubD.position.set(x,BH+.1-q*(BH-.45),BZ));bubD.visible=false;P3.tone(900-j*80,.04,'sine',.04);}
    const c0=new THREE.Color(o.col),cc=new THREE.Color(c1);await L.tw(1400,q=>{R.setLiq(o.b.lm,c0.clone().lerp(cc,q).getHex());o.b.lm.opacity=s.op+(.95-s.op)*q;});o.col=c1;r.ui=c1;
    await L.arc(drop,DH,600,1.2);toast('قارن لون المحلول بمقياس ألوان الكاشف العام أمام الكؤوس.');}
  if(t==='meter'){await L.focus(V(x+.5,1.2,BZ+1.9),V(x,.6,BZ),700);await L.arc(meter,V(x,BH+.5,BZ),700,1.2);meter.rotation.z=0;await L.move(meter,V(x,.62,BZ),600);
    await L.tw(1700,q=>{const v=s.ph+(1-q)*(Math.sin(q*28)*.5+(7-s.ph)*.4*(1-q));meter.userData.lcd.set(v.toFixed(1));X.txt(sec,'phV',v.toFixed(1));});
    meter.userData.lcd.set(s.ph.toFixed(1));X.txt(sec,'phV',s.ph.toFixed(1));r.meter=s.ph;P3.good();await sleep(500);await L.move(meter,V(x,BH+.5,BZ),500);await L.arc(meter,MH,700,1.2);meter.rotation.z=.12;}
  S.busy=false;L.home(900);sync();render();renderNB();}
function classify(v){const s=SL.find(x=>x.id===S.cur),r=S.R[s.id];if(v===kind(s.ph)){r.cls=v;P3.good();toast(s.n+': '+KIND[v]+'. اختر محلولًا آخر.');}else{P3.bad&&P3.bad();toast('pH أقل من 7 حمضي، و 7 متعادل، وأكبر من 7 قاعدي.');}render();renderNB();}
function stepIdx(){const r=S.R[S.cur],n=SL.filter(s=>S.R[s.id].cls).length;if(n===5)return 4;if(!r.blue&&!r.red&&!r.ui&&r.meter==null)return n?4:0;if(!r.ui)return 1;if(r.meter==null)return 2;return 3;}
function render(){const s=SL.find(x=>x.id===S.cur),r=S.R[s.id],k=stepIdx(),n=SL.filter(x=>S.R[x.id].cls).length;let title,html;
  if(n===5){title='أحسنت!';html=`<p class="p3-ok">صنّفت المحاليل الخمسة: الليمون والخل <b>حمضيان</b>، والماء المقطر <b>متعادل</b>، والبيكربونات والصابون <b>قاعديان</b>. لاحظ أن ألوان الكاشف العام تتدرج من الأحمر إلى الأزرق بزيادة pH.</p>`;}
  else if(k===0){title='اختر محلولًا';html=`<p class="p3-txt">اضغط على كأس أو على اسم المحلول، ثم اختبره بورق عباد الشمس والكاشف العام، وقِس قيمة pH بالجهاز.</p>`;}
  else if(k===1){title='ورق عباد الشمس';html=`<p class="p3-txt">اغمس الورق الأزرق ثم الأحمر في <b>${s.n}</b> ولاحظ تغيّر اللون. بعدها أضف قطرات الكاشف العام.</p>`;}
  else if(k===2){title='الكاشف العام';html=`<p class="p3-txt">قارن لون المحلول بمقياس الألوان (0–14) أمام الكؤوس، ثم قِس القيمة بدقة بجهاز pH.</p>`;}
  else{title='صنّف المحلول';html=`<p class="p3-txt">قراءة جهاز pH لـ<b>${s.n}</b> = <b>${r.meter.toFixed(1)}</b>. ${r.cls?'صنّفته: <b>'+KIND[r.cls]+'</b>. اختر محلولًا آخر.':'اختر تصنيفه من لوحة الأدوات.'}</p>`;}
  sec.steps(NAMES,Math.min(k,4),title,html);
  sec.$('.phCls').innerHTML=r.meter!=null&&!r.cls?`<span class="p3-lab">صنّف ${s.n}:</span>`+Object.entries(KIND).map(([kk,v])=>`<button class="p3-b" data-a="cls" data-v="${kk}">${v}</button>`).join(''):'';}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>المحلول</th><th>الأزرق</th><th>الأحمر</th><th>الكاشف</th><th>pH</th><th>التصنيف</th></tr></thead><tbody>${SL.map(s=>{const r=S.R[s.id];return `<tr><td>${s.n}</td><td>${r.blueTxt||'—'}</td><td>${r.redTxt||'—'}</td><td>${r.ui?`<span class="p3-sw" style="background:${hex6(r.ui)}"></span>`:'—'}</td><td class="n">${r.meter!=null?r.meter.toFixed(1):'—'}</td><td>${r.cls?KIND[r.cls]:'—'}</td></tr>`;}).join('')}</tbody></table>`;}
function sync(){sec.$$('[data-a="use"],[data-a="pick"]').forEach(b=>b.disabled=S.busy);}
X.side(sec,{pick:b=>pick(b.dataset.v),use:b=>use(b.dataset.v),cls:b=>classify(b.dataset.v)});
selRing();sync();render();renderNB();
};

/* =====================================================================
   فصل المخاليط بالترشيح والتبخير — نسخة واقعية ثلاثية الأبعاد
   ===================================================================== */
const FTR={};EXP_MODS.filt=FTR;
FTR.init=function(){gm();
const ROWS=[{id:'sand',name:'الرمل'},{id:'salt',name:'الملح'},{id:'water',name:'الماء'}];
const METH={filt:'الترشيح',evap:'التبخير',none:'لا يُسترجع (يتبخر)'};const ANS={sand:'filt',salt:'evap',water:'none'};
const QS={dis:{q:'ماذا حدث للملح عندما حرّكت المخلوط؟',o:{a:'ذاب في الماء',b:'ترسّب في القاع',c:'طفا على السطح'},ans:'a',why:'الملح يذوب في الماء، أما الرمل فلا يذوب.'},
  where:{q:'أين بقي الرمل بعد الترشيح؟',o:{a:'على ورق الترشيح',b:'في الدورق مع الماء',c:'اختفى'},ans:'a',why:'ثقوب ورق الترشيح أصغر من حبيبات الرمل، فيبقى الرمل (الراسب) ويمر المحلول (الراشح).'},
  cry:{q:'ما المادة البيضاء التي بقيت في الجفنة؟',o:{a:'الرمل',b:'الملح',c:'الماء'},ans:'b',why:'تبخّر الماء بالتسخين وبقي الملح الذائب على هيئة بلورات.'}};
const S={step:0,sand:false,salt:false,q:null,busy:false,obs:{sand:'',salt:'',water:''},sel:{},T:25,done:false};P3.dbg.filt=S;
const NAMES=['حضّر المخلوط','حرّك','رشّح','بخّر','حدّد الطرائق'];
const sec=P3.section('filt',{title:'فصل المخاليط بالترشيح والتبخير',grade:'أول متوسط',lesson:'العناصر والمركبات والمخاليط',
  hud:`<div class="p3-row">${X.m('حرارة الجفنة','ftT',1)}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">خطوات العمل</h4>
    <div class="p3-acts"><button class="p3-b" data-a="sand">🥄 أضف الرمل</button><button class="p3-b" data-a="salt">🥄 أضف الملح</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="stir">🌀 حرّك بالساق الزجاجية</button><button class="p3-b" data-a="pour">⏬ اسكب في القمع</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="evap">🔥 بخّر الراشح</button><button class="p3-b" data-a="reset">↺ إعادة</button></div>
    <p class="x-note">سلامة: لا تلمس الجفنة الساخنة، واستخدم النظارة الواقية.</p></div><div class="p3-box ftQ" hidden></div>`,
  learn:`<div class="panel"><h3>الفكرة العلمية</h3><p><b>المخلوط:</b> مادتان أو أكثر مختلطتان دون أن تتحدا كيميائيًا، ويمكن فصلهما بطرائق فيزيائية.</p>
    <p><b>الترشيح:</b> يفصل المادة الصلبة غير الذائبة (مثل الرمل) عن السائل؛ يبقى الصلب على ورق الترشيح (الراسب) ويمر السائل (الراشح).</p>
    <p><b>التبخير:</b> يفصل المادة الصلبة الذائبة (مثل الملح) عن الماء بتسخين المحلول حتى يتبخر الماء وتبقى البلورات.</p></div>
    <div class="panel"><h3>خطوات العمل</h3><p>١. أضف الملح والرمل إلى الماء وحرّك.</p><p>٢. رشّح المخلوط عبر ورق الترشيح في القمع.</p><p>٣. ضع الراشح في جفنة التبخير وسخّنه.</p><p>٤. حدّد طريقة فصل كل مكوّن.</p><p class="muted">تنبيه سلامة: لا تلمس الجفنة الساخنة، واستخدم الملقط والنظارة الواقية.</p></div>`,
  quiz:[{q:'لفصل الرمل عن الماء نستخدم:',o:['التبخير','الترشيح','المغناطيس'],a:1},{q:'الملح الذائب في الماء يمر مع:',o:['الراشح','الراسب','ورق الترشيح'],a:0},
    {q:'لاستخلاص الملح من محلوله نستخدم:',o:['الترشيح','التبخير','الغربلة'],a:1},{q:'المادة التي تبقى على ورق الترشيح تسمى:',o:['الراشح','الراسب','المذيب'],a:1},{q:'خليط الرمل والملح والماء يُعدّ:',o:['مركبًا','مخلوطًا','عنصرًا'],a:1}],
  report:()=>({title:'فصل المخاليط بالترشيح والتبخير',grade:'أول متوسط',lesson:'العناصر والمركبات والمخاليط',cols:['المكوّن','ماذا لاحظنا؟','طريقة الفصل'],rows:ROWS.map(r=>[r.name,S.obs[r.id]||'',S.done?METH[ANS[r.id]]:'']),note:'حدّد خاصية المادة التي استُفيد منها في فصل كل مكوّن.'})
});
const L=new Lab(sec,{target:V(-.2,.8,.7),dist:a=>Math.max(4.8,7.6/a),exposure:1});R.studio(L);
const toast=m=>L.toast(m);
/* mixture beaker in a pivot (for pouring) */
const BX=-1.85,BZ=.6,BR=.36,BH=.8;
const piv=new THREE.Group();piv.position.set(BX-BR-.02,BH,BZ);L.scene.add(piv);
const bk=R.beaker(BR,BH,{level:.46,col:0xd6ecf7,op:.5,grad:400});bk.g.position.set(BR+.02,-BH,0);piv.add(bk.g);
/* sand & salt grains inside beaker (local to bk.g) */
const sMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.95});sMat.userData.lin=1;const NS=260,sandM=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.014,0),sMat,NS);sandM.count=0;bk.g.add(sandM);
const SG=[];for(let i=0;i<NS;i++){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*(BR-.05);SG.push({x:Math.cos(a)*r,z:Math.sin(a)*r,y:.03+Math.random()*.035,sy:0,s:.7+Math.random()*.8,c:i%3});}
const NSL=90,saltM=new THREE.InstancedMesh(new THREE.BoxGeometry(.022,.022,.022),new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.25,clearcoat:1,transparent:true,opacity:.95}),NSL);saltM.count=0;bk.g.add(saltM);
const SA=[];for(let i=0;i<NSL;i++){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*(BR-.06);SA.push({x:Math.cos(a)*r,z:Math.sin(a)*r,y:.06+Math.random()*.03,s:1,ry:Math.random()*3});}
/* sand & salt source dishes + spoon */
const dish=(x,col,label)=>{const g=new THREE.Group();const d=new THREE.Mesh(new THREE.CylinderGeometry(.24,.2,.07,32),KIT.phys(0xf4f4f2,{roughness:.25,clearcoat:.5}));d.position.y=.035;const f=new THREE.Mesh(new THREE.SphereGeometry(.2,24,12,0,Math.PI*2,0,Math.PI/2),KIT.mat(col,{roughness:.95}));f.scale.y=.35;f.position.y=.06;g.add(d,f);castAll(g);g.position.set(x,0,1.55);L.add(g);
  const c=P3.card([{t:label,s:60}],.42,.14,{bd:'#ffffff'});c.position.set(x,.012,1.92);c.rotation.x=-1.2;L.add(c);return g;};
dish(-2.35,0xc29a5c,'رمل');dish(-1.65,0xf6f6f2,'ملح');
const spoon=new THREE.Group();{const b=new THREE.Mesh(new THREE.SphereGeometry(.055,16,10,0,Math.PI*2,0,Math.PI/2),M.steel);b.rotation.x=Math.PI;b.scale.y=.5;const h=new THREE.Mesh(new THREE.CylinderGeometry(.01,.012,.42,8),M.steel);h.rotation.z=Math.PI/2;h.position.x=.25;spoon.add(b,h);castAll(spoon);}
const SPH=V(-2.0,.03,1.25);spoon.position.copy(SPH);L.add(spoon);
const rod=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,1.0,10),R.glass(.45));rod.position.set(-1.5,.02,1.2);rod.rotation.z=Math.PI/2;L.add(rod);
/* filtration rig */
const FX=-.1,FZ=.45;
const st=KIT.stand(2.4);st.position.set(FX+.35,0,FZ-.75);L.add(st);
const ringT=new THREE.Mesh(new THREE.TorusGeometry(.33,.02,8,40),M.steel);ringT.rotation.x=Math.PI/2;ringT.position.set(FX,1.5,FZ);L.add(ringT);
const arm=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.6,8),M.steel);arm.rotation.x=Math.PI/2;arm.position.set(FX,1.5,FZ-.6);L.add(arm);
const FUN=[[.42,.52],[.4,.5],[.06,.06],[.045,0],[.035,-.5],[.025,-.5],[.033,0],[.048,.07],[.385,.5]];
const fun=R.profVessel(FUN.map(([r,y])=>[r,y]),{op:.12,col:0xb59a6a,lop:.85});fun.g.position.set(FX,1.38,FZ);L.add(fun.g);
const paperM=new THREE.MeshStandardMaterial({color:$lc(0xfbfaf4),roughness:.9,side:THREE.DoubleSide});paperM.userData.lin=1;const paper=new THREE.Mesh(new THREE.ConeGeometry(.36,.42,8,1,true),paperM);paper.rotation.x=Math.PI;paper.position.set(FX,1.38+.29,FZ);L.add(paper);
/* funnel muddy liquid cone + sand cake */
const fLm=R.liquid(0xb59a6a,.82);const fLiq=new THREE.Mesh(new THREE.ConeGeometry(1,1,24),fLm);fLiq.rotation.x=Math.PI;fLiq.visible=false;L.scene.add(fLiq);
const ckM=new THREE.MeshStandardMaterial({color:$lc(0xb8904f),roughness:.95,side:THREE.DoubleSide,map:canvasTex(128,128,c=>{c.fillStyle='#b8904f';c.fillRect(0,0,128,128);for(let i=0;i<900;i++){c.fillStyle=['#a37a43','#c9a46c','#8f6a38'][i%3];c.fillRect(Math.random()*128,Math.random()*128,2,2);}})});ckM.userData.lin=1;
const cake=new THREE.Mesh(new THREE.ConeGeometry(.3,.35,24,1,true),ckM);cake.rotation.x=Math.PI;cake.visible=false;L.scene.add(cake);
const cakeM=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.014,0),sandM.material,NS);cakeM.count=0;L.scene.add(cakeM);
/* conical flask */
const FL=[[0,0],[.33,0],[.36,.03],[.36,.06],[.12,.62],[.1,.66],[.1,.84],[.12,.86],[.105,.87],[.085,.85],[.085,.67],[.335,.06],[.31,.025],[0,.025]];
const flk=R.profVessel(FL,{op:.1,col:0xe6f4fb,lop:.55,y0:.03});flk.g.position.set(FX,0,FZ);L.add(flk.g);
const fls=shadowDisc(.32,.55);fls.position.set(FX,0,FZ);L.add(fls);
/* evaporation: tripod + gauze + dish + burner */
const EX=1.85,EZ=.55;
const trip=new THREE.Group();{[0,1,2].forEach(i=>{const a=i*2.094+.6;const l=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.95,8),M.steel);l.position.set(Math.cos(a)*.3,.47,Math.sin(a)*.3);l.rotation.set(Math.sin(a)*.12,0,-Math.cos(a)*.12);trip.add(l);});
  const r=new THREE.Mesh(new THREE.TorusGeometry(.3,.02,8,32),M.steel);r.rotation.x=Math.PI/2;r.position.y=.94;trip.add(r);
  const gz=new THREE.Mesh(new THREE.BoxGeometry(.72,.012,.72),new THREE.MeshStandardMaterial({color:0x9aa0a4,metalness:.6,roughness:.5,map:canvasTex(256,256,c=>{c.fillStyle='#8f969a';c.fillRect(0,0,256,256);c.strokeStyle='#c8cdd0';c.lineWidth=2;for(let i=0;i<256;i+=12){c.beginPath();c.moveTo(i,0);c.lineTo(i,256);c.stroke();c.beginPath();c.moveTo(0,i);c.lineTo(256,i);c.stroke();}c.fillStyle='#e8e2d6';c.beginPath();c.arc(128,128,70,0,7);c.fill();})}));gz.position.y=.96;trip.add(gz);castAll(trip);}
trip.position.set(EX,0,EZ);L.add(trip);
const DSH=[[0,.0],[.12,.005],[.26,.05],[.34,.14],[.36,.16],[.33,.155],[.24,.065],[.11,.025],[0,.02]];
const evd=new THREE.Group();{const pts=DSH.map(a=>new THREE.Vector2(a[0],a[1]));const m=new THREE.Mesh(new THREE.LatheGeometry(pts,48),KIT.phys(0xf3efe6,{roughness:.35,clearcoat:.6,side:THREE.DoubleSide}));evd.add(m);castAll(evd);}
evd.position.set(EX,.97,EZ);L.add(evd);
const eLm=R.liquid(0xe6f4fb,.6);let eLiq=null;
function setDish(h){if(eLiq){evd.remove(eLiq);eLiq.geometry.dispose();eLiq=null;}if(h<.004)return;const r=.12+h/.13*.2;eLiq=new THREE.Mesh(new THREE.CylinderGeometry(r,.1,h,40),eLm);eLiq.position.y=.025+h/2;eLiq.renderOrder=2;evd.add(eLiq);}
const NC=110,cryM=new THREE.InstancedMesh(new THREE.BoxGeometry(.024,.024,.024),saltM.material,NC);cryM.count=0;evd.add(cryM);
const CR=[];for(let i=0;i<NC;i++){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*.2;CR.push({x:Math.cos(a)*r,z:Math.sin(a)*r,y:.03+r*.25,ry:Math.random()*3,rx:Math.random()*3,s:.5+Math.random()*.8});}
const bn=KIT.burner();bn.g.position.set(EX,0,EZ);L.add(bn.g);const fl=Flame({s:.75});fl.S.air=1;fl.S.on=false;fl.g.position.set(EX,.66,EZ);L.scene.add(fl.g);
const steam=X.steam(L,40);
/* labels */
[['كأس المخلوط',V(BX,.012,BZ+.6)],['قمع وورق ترشيح',V(FX,.012,FZ+.75)],['جفنة التبخير',V(EX,.012,EZ+.75)]].forEach(([t,p])=>{const c=P3.card([{t,s:46}],.72,.15,{bd:'#ffffff'});c.position.copy(p);c.rotation.x=-1.2;L.add(c);});
/* stream particles (generic) */
const NP=70,pp=new Float32Array(NP*3),pu=Array.from({length:NP},()=>Math.random());const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pp,3));
const pm=new THREE.PointsMaterial({color:0xb59a6a,size:.05,transparent:true,opacity:0,depthWrite:false});const strm=new THREE.Points(pg,pm);strm.frustumCulled=false;L.scene.add(strm);let SA_=null,SB_=null,SON=0;
const drip=new THREE.Mesh(new THREE.SphereGeometry(.018,10,8),R.liquid(0xcfeaf8,.9));drip.visible=false;L.scene.add(drip);let DRIP=false,dT=0;
/* state draw */
let cloud=0,stirT=0,stirOn=false,sandUp=0;
const dO=new THREE.Object3D(),cS=[$lc(0xc29a5c),$lc(0xa98048),$lc(0xd4b07a)];
function drawGrains(){for(let i=0;i<sandM.count;i++){const g=SG[i];let x=g.x,z=g.z,y=g.y+g.sy;if(sandUp>0){const a=Math.atan2(z,x)+stirT*(1.5+i%5*.2),r=Math.hypot(x,z);x=Math.cos(a)*r;z=Math.sin(a)*r;y=g.y+sandUp*(.05+((i*.37)%1)*.28);}
    dO.position.set(x,y,z);dO.rotation.set(i,i*.7,0);dO.scale.setScalar(g.s);dO.updateMatrix();sandM.setMatrixAt(i,dO.matrix);sandM.setColorAt&&sandM.setColorAt(i,cS[g.c]);}sandM.instanceMatrix.needsUpdate=true;if(sandM.instanceColor)sandM.instanceColor.needsUpdate=true;
  for(let i=0;i<saltM.count;i++){const g=SA[i];dO.position.set(g.x,g.y,g.z);dO.rotation.set(g.ry,g.ry*.5,0);dO.scale.setScalar(Math.max(.001,g.s));dO.updateMatrix();saltM.setMatrixAt(i,dO.matrix);}saltM.instanceMatrix.needsUpdate=true;}
P3.loop(L,(dt,t)=>{if(stirOn){stirT+=dt*6;rod.position.set(BX+Math.cos(stirT)*.12,.75,BZ+Math.sin(stirT)*.12);}
  if(SON>0||pm.opacity>0){pm.opacity=Math.max(0,Math.min(.9,SON));for(let i=0;i<NP;i++){pu[i]=(pu[i]+dt*1.8)%1;const u=pu[i];const p=SA_&&SB_?SA_.clone().lerp(SB_,u):V(0,-9,0);p.y-=u*u*.12*0;pp[i*3]=p.x+(Math.sin(i*3)*.01);pp[i*3+1]=p.y-(u*(1-u))*-.1;pp[i*3+2]=p.z+(Math.cos(i*5)*.01);}pg.attributes.position.needsUpdate=true;}
  if(DRIP){dT+=dt;const k=(dT*1.6)%1;drip.visible=true;drip.position.set(FX,1.38-.5-k*.35,FZ);}else drip.visible=false;
  fl.tick(L.vt);if(fl.S.on&&eLiq&&Math.random()<dt*10)steam.emit(V(EX,1.1,EZ),.2,.4,.35,.25);steam.tick(dt);X.txt(sec,'ftT',Math.round(S.T)+' °C');
  if(sandM.count)drawGrains();});
function cards(){const qb=sec.$('.ftQ');if(S.q){const Q=QS[S.q];qb.hidden=false;qb.innerHTML=`<h4 class="p3-h">${Q.q}</h4><div class="p3-acts" style="flex-direction:column;align-items:stretch">${Object.entries(Q.o).map(([k,v])=>`<button class="p3-b" data-a="ans" data-v="${k}">${v}</button>`).join('')}</div>`;}
  else if(S.step===4&&!S.done){qb.hidden=false;qb.innerHTML=`<h4 class="p3-h">حدّد طريقة فصل كل مكوّن</h4><table class="p3-t"><tbody>${ROWS.map(r=>`<tr><td>${r.name}</td><td><select data-id="${r.id}"><option value="">اختر</option>${Object.entries(METH).map(([k,v])=>`<option value="${k}" ${S.sel[r.id]===k?'selected':''}>${v}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table><div class="p3-acts"><button class="p3-b pri" data-a="chk">تحقّق</button></div>`;}
  else{qb.hidden=true;qb.innerHTML='';}}
sec.$('.p3-side').addEventListener('change',e=>{const s=e.target.closest('select');if(s)S.sel[s.dataset.id]=s.value;});
function answer(v){const Q=QS[S.q];if(v===Q.ans){P3.good();toast('صحيح. '+Q.why);S.q=null;}else{toast('فكّر مرة أخرى وانظر إلى المشهد.');}sync();render();}
function check(){const ok=ROWS.every(r=>S.sel[r.id]===ANS[r.id]);if(ok){P3.good();S.done=true;S.step=5;}else toast('راجع: أي المكوّنات لا يذوب؟ وأيها يذوب؟ وماذا حدث للماء عند التسخين؟');sync();render();renderNB();}
async function add(which){if(S.busy||S.step!==0||S[which])return;S.busy=true;sync();const src=V(which==='sand'?-2.35:-1.65,.14,1.55);
  await L.focus(V(BX+.4,1.4,BZ+2.3),V(BX,.45,BZ),700);await L.arc(spoon,src,500,1.2);await L.move(spoon,V(src.x,.2,src.z),200);await L.arc(spoon,V(BX,BH+.25,BZ),650,1.3);await L.tw(300,q=>spoon.rotation.x=q*1.6);
  if(which==='sand'){sandM.count=NS;SG.forEach(g=>g.sy=.9);await L.tw(1100,q=>{SG.forEach((g,i)=>{g.sy=Math.max(0,.9*(1-Math.min(1,q*1.4-(i%10)*.04)));});drawGrains();});SG.forEach(g=>g.sy=0);}
  else{saltM.count=NSL;const y0=SA.map(g=>g.y);SA.forEach(g=>g.y=.85);await L.tw(1000,q=>{SA.forEach((g,i)=>{g.y=y0[i]+(.85-y0[i])*Math.max(0,1-Math.min(1,q*1.4-(i%10)*.04));});drawGrains();});SA.forEach((g,i)=>g.y=y0[i]);}
  P3.noise(.3,.2,1800,.4);await L.tw(250,q=>spoon.rotation.x=1.6*(1-q));await L.arc(spoon,SPH,600,1.2);S[which]=true;if(S.sand&&S.salt){S.step=1;toast('أضفت الرمل والملح إلى الماء. حرّك المخلوط ولاحظ.');}S.busy=false;sync();render();}
async function stir(){if(S.busy||S.step!==1)return;S.busy=true;sync();await L.arc(rod,V(BX,1.3,BZ),600,1.0);rod.rotation.z=.15;await L.move(rod,V(BX,.75,BZ),400);stirOn=true;P3.whoosh();
  const c0=$lc(0xd6ecf7),c1=$lc(0xb9a37a);await L.tw(2800,q=>{sandUp=Math.sin(Math.min(1,q*1.3)*Math.PI/2);bk.lm.color.copy(c0).lerp(c1,Math.min(1,q*1.5));bk.lm.emissive.copy(bk.lm.color);bk.lm.opacity=.5+.3*Math.min(1,q*1.5);SA.forEach((g,i)=>g.s=Math.max(0,1-q*1.25+(i%7)*.02));});
  stirOn=false;await L.move(rod,V(BX,1.3,BZ),400);await L.arc(rod,V(-1.5,.02,1.2),600,1.0);rod.rotation.z=Math.PI/2;saltM.count=0;
  await L.tw(1600,q=>{sandUp=1-q;});sandUp=0;S.obs.salt='اختفت بلوراته في الماء (ذاب)';S.obs.sand='لم يذب، وترسّب في قاع الكأس';S.step=2;S.q='dis';S.busy=false;sync();render();renderNB();}
async function pour(){if(S.busy||S.step!==2||S.q)return;S.busy=true;sync();await L.focus(V(FX-.6,2.0,FZ+3.0),V(FX-.4,1.0,FZ),800);
  const p0=piv.position.clone(),p1=V(FX+.12,1.98,FZ);await L.tw(1000,q=>{const e=ease(q);piv.position.lerpVectors(p0,p1,e);piv.position.y+=Math.sin(q*Math.PI)*.3;});
  await L.tw(700,q=>{piv.rotation.z=ease(q)*1.15;});
  SA_=V(FX+.05,1.95,FZ);SB_=V(FX,1.62,FZ);SON=1;fLiq.visible=true;
  const cs=[];for(let i=0;i<NS;i++)cs.push(V(FX+(Math.random()-.5)*.02,0,FZ));
  const lvl0=.46;await L.tw(2600,q=>{bk.set(lvl0*(1-q));const h=.08+.22*Math.sin(Math.min(1,q*1.2)*Math.PI*.5);fLiq.scale.set(.06+h*.75,h,.06+h*.75);fLiq.position.set(FX,1.38+.07+h/2,FZ);
    sandM.count=Math.round(NS*(1-q));cakeM.count=Math.round(NS*q);for(let i=0;i<cakeM.count;i++){const a=i*2.4,r=.04+((i*.618)%1)*.12,y=1.38+.1+r*.95;dO.position.set(FX+Math.cos(a)*r,y,FZ+Math.sin(a)*r);dO.rotation.set(i,i,0);dO.scale.setScalar(SG[i].s);dO.updateMatrix();cakeM.setMatrixAt(i,dO.matrix);}cakeM.instanceMatrix.needsUpdate=true;
    cake.visible=q>.05;const cs2=.25+.75*q;cake.scale.set(cs2,cs2,cs2);cake.position.set(FX,1.46+.35*cs2/2+.005,FZ);
    if(q>.2)DRIP=true;flk.set(.3*Math.max(0,q-.15)/.85);});
  SON=0;await L.tw(600,q=>{piv.rotation.z=1.15*(1-ease(q));});await L.tw(900,q=>{const e=ease(q);piv.position.lerpVectors(p1,p0,e);piv.position.y+=Math.sin(q*Math.PI)*.3;});bk.set(0);
  await L.tw(1400,q=>{const h=.3*(1-q)+.02;fLiq.scale.set(.06+h*.75,h,.06+h*.75);fLiq.position.set(FX,1.38+.07+h/2,FZ);flk.set(.3+.06*q);});fLiq.visible=false;DRIP=false;
  S.obs.sand='بقي على ورق الترشيح (راسب)';S.obs.water='مرّ عبر ورق الترشيح إلى الدورق (راشح شفاف)';S.step=3;S.q='where';S.busy=false;L.home(900);sync();render();renderNB();}
async function evap(){if(S.busy||S.step!==3||S.q)return;S.busy=true;sync();await L.focus(V(EX-.3,2.0,EZ+2.7),V(EX-.6,.9,EZ),800);
  flk.g.position.set(FX,0,FZ);const g0=flk.g.position.clone();await L.tw(900,q=>{const e=ease(q);flk.g.position.set(g0.x+(EX-.32-g0.x)*e,g0.y+1.12*e,g0.z+(EZ-g0.z)*e);});
  await L.tw(600,q=>flk.g.rotation.z=-ease(q)*1.4);SA_=V(EX-.2,1.38,EZ);SB_=V(EX-.05,1.02,EZ);pm.color.set(0xcfeaf8);SON=1;await L.tw(1600,q=>{flk.set(.36*(1-q));setDish(.12*q);});SON=0;
  await L.tw(500,q=>flk.g.rotation.z=-1.4*(1-ease(q)));await L.tw(900,q=>{const e=ease(q);flk.g.position.set(EX-.32+(g0.x-EX+.32)*e,1.12*(1-e),EZ+(g0.z-EZ)*e);});
  fl.S.on=true;P3.whoosh();await L.tw(1500,q=>S.T=25+q*75);
  cryM.count=0;await L.tw(5200,q=>{setDish(.12*(1-q));cryM.count=Math.round(NC*q);for(let i=0;i<cryM.count;i++){const c=CR[i];dO.position.set(c.x,c.y,c.z);dO.rotation.set(c.rx,c.ry,0);dO.scale.setScalar(c.s*Math.min(1,(q*NC-i)/8));dO.updateMatrix();cryM.setMatrixAt(i,dO.matrix);}cryM.instanceMatrix.needsUpdate=true;});
  setDish(0);fl.S.on=false;await L.tw(1500,q=>S.T=100-q*60);
  S.obs.salt='ظهرت بلوراته البيضاء في الجفنة بعد تبخر الماء';S.obs.water='تبخّر عند التسخين';S.step=4;S.q='cry';S.busy=false;L.home(900);sync();render();renderNB();}
function reset(){if(S.busy)return;Object.assign(S,{step:0,sand:false,salt:false,q:null,obs:{sand:'',salt:'',water:''},sel:{},T:25,done:false});sandM.count=0;saltM.count=0;cakeM.count=0;cryM.count=0;cake.visible=false;SA.forEach(g=>g.s=1);
  bk.set(.46);R.setLiq(bk.lm,0xd6ecf7);bk.lm.opacity=.5;flk.set(0);setDish(0);flk.g.rotation.z=0;fl.S.on=false;L.home(700);sync();render();renderNB();}
function render(){const k=Math.min(4,S.step);let title,html;
  if(S.step>=5){title='أحسنت!';html=`<p class="p3-ok">فصلت الرمل <b>بالترشيح</b> لأنه لا يذوب في الماء، وفصلت الملح <b>بالتبخير</b> لأنه يذوب. هذه طرائق <b>فيزيائية</b>؛ فمكوّنات المخلوط تحتفظ بخصائصها.</p>`;}
  else if(S.busy){title='راقب…';html=`<p class="p3-txt">لاحظ ما يحدث في المشهد. يمكنك تفعيل 🐢 الحركة البطيئة.</p>`;}
  else if(S.q){title='أجب عن السؤال';html=`<p class="p3-txt">${QS[S.q].q} اختر الإجابة من لوحة التحكم.</p>`;}
  else if(S.step===0){title='حضّر المخلوط';html=`<p class="p3-txt">في الكأس ماء. أضف ملعقة رمل وملعقة ملح.</p>`;}
  else if(S.step===1){title='حرّك المخلوط';html=`<p class="p3-txt">حرّك المخلوط بالساق الزجاجية، وراقب الملح والرمل.</p>`;}
  else if(S.step===2){title='رشّح المخلوط';html=`<p class="p3-txt">اسكب المخلوط في القمع المبطّن بورق الترشيح، وراقب ما يبقى على الورق وما يمر إلى الدورق.</p>`;}
  else if(S.step===3){title='بخّر الراشح';html=`<p class="p3-txt">انقل الراشح إلى جفنة التبخير وسخّنه حتى يتبخر الماء.</p>`;}
  else{title='حدّد طرائق الفصل';html=`<p class="p3-txt">اختر طريقة فصل كل مكوّن في لوحة التحكم ثم اضغط «تحقّق».</p>`;}
  sec.steps(NAMES,k,title,html);cards();}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>المكوّن</th><th>ماذا لاحظنا؟</th></tr></thead><tbody>${ROWS.map(r=>`<tr><td>${r.name}</td><td>${S.obs[r.id]||'—'}</td></tr>`).join('')}</tbody></table>`;}
function sync(){const b=S.busy||!!S.q;const d=(a,c)=>{const e=sec.$(`[data-a="${a}"]`);e.disabled=b||c;};d('sand',S.step!==0||S.sand);d('salt',S.step!==0||S.salt);d('stir',S.step!==1);d('pour',S.step!==2);d('evap',S.step!==3);sec.$('[data-a="reset"]').disabled=S.busy;
  ['sand','salt'].forEach(a=>sec.$(`[data-a="${a}"]`).classList.toggle('done',S[a]));}
X.side(sec,{sand:()=>add('sand'),salt:()=>add('salt'),stir,pour,evap,reset,ans:b=>answer(b.dataset.v),chk:check});
sync();render();renderNB();
};

X.reg(['ph','filt']);
})();
