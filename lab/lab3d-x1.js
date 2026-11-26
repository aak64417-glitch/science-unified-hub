/* =====================================================================
   المختبر الافتراضي الذكي — حزمة التجارب الجديدة (١)
   أول متوسط ف٢: الجبهات الهوائية · الفصول الأربعة · النظام البيئي المغلق
   ثاني متوسط ف١: منحنى التسخين · قاعدة أرخميدس · طاقة البندول
   محاكاة حيّة تعتمد على القوانين العلمية الحقيقية (لا رسوم ثابتة)
   إعداد أ. علي البقاشي — مدرسة أبي الدرداء المتوسطة
   ===================================================================== */
(function(){
'use strict';
if(typeof THREE==='undefined'||typeof Lab==='undefined'||!window.P3X)return;
const {P3,G,gm,TestTube,Bubbles,setCol,$lc,sleep,hex6,clamp,show,LRI}=window.P3X;

/* ---------------- shared helpers for the new packs ---------------- */
const X={};
X.css=`
.p3 .p3-rng output{font-family:var(--f-mono);min-width:64px;text-align:center;direction:ltr;background:var(--surface-2);border-radius:8px;padding:2px 6px}
.x-ov{position:absolute;bottom:62px;left:10px;background:#0b1a18ee;border-radius:12px;border:1px solid #2a4a44;padding:6px 8px;z-index:2;color:#d9f3ec;font-weight:700;font-size:.72rem}
.x-ov canvas{display:block}
.x-ov .t{margin-bottom:3px;color:#9fe8cf}
.x-q{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.x-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:6px}
.x-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-top:6px}
.x-grid3 .p3-b,.x-grid4 .p3-b{justify-content:center;padding:5px 3px}
.x-cls{display:grid;grid-template-columns:1fr 1fr;gap:4px 10px}.x-cls div{display:flex;align-items:center;gap:4px}.x-cls span{flex:1;font-weight:700;font-size:.8rem}.x-cls .p3-b{padding:3px 6px;font-size:.74rem}.x-cls b{min-width:12px;margin:0}
.x-note{font-size:.8rem;font-weight:600;color:var(--ink-2);margin:6px 0 0;line-height:1.6}
.p3-t td.ok{color:var(--ok)}.p3-t td.bad{color:var(--bad)}
.lbl.x-c{background:#2563ebe6;color:#fff;border-color:#2563eb}.lbl.x-w{background:#dc2626e6;color:#fff;border-color:#dc2626}
.lbl.x-d{background:#10302ce6;color:#fff;border-color:#10302c}
@media (max-width:880px){.x-ov{bottom:58px}.x-ov canvas{max-width:200px;height:auto}}
`;
{const st=document.createElement('style');st.textContent=X.css;document.head.appendChild(st);}
X.m=(lab,cls,warm)=>`<div class="p3-m${warm?' warm':''}"><small>${lab}</small><b class="${cls}">—</b></div>`;
X.rng=(lab,id,min,max,step,val,unit)=>`<label class="p3-rng">${lab}<input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><output id="${id}-o">${val}${unit||''}</output></label>`;
X.side=(sec,map)=>sec.$('.p3-side').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const a=b.dataset.a;if(a&&map[a])map[a](b);});
X.txt=(sec,cls,t)=>{const e=sec.$('.'+cls);if(e)e.textContent=t;};
X.ov=(sec,title,w,h)=>{const d=document.createElement('div');d.className='x-ov';d.innerHTML=`<div class="t">${title}</div><canvas width="${w*2}" height="${h*2}" style="width:${w}px;height:${h}px"></canvas>`;sec.$('.p3-stage').appendChild(d);
  const c=d.querySelector('canvas'),x=c.getContext('2d');x.scale(2,2);return {el:d,c,x,w,h};};
X.reg=ids=>{EXPS.forEach(e=>{if(EXP_MODS[e.id])e.ready=true;if(ids.includes(e.id))e.d3=true;});if(typeof renderLib==='function')renderLib();};
/* glass box (open top) with metal edges; origin at bottom centre */
X.glassBox=(w,h,d,o={})=>{const g=new THREE.Group(),t=.018;
  const f=(sx,sy,sz,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),G.glass);m.position.set(x,y,z);m.renderOrder=5;g.add(m);};
  f(w,h,t,0,h/2,d/2);f(w,h,t,0,h/2,-d/2);f(t,h,d,w/2,h/2,0);f(t,h,d,-w/2,h/2,0);
  const base=new THREE.Mesh(new THREE.BoxGeometry(w+.04,.04,d+.04),G.glassS);base.position.y=.02;g.add(base);
  if(o.frame!==false){const em=KIT.mat(0x9aa4aa,{metalness:.8,roughness:.3});const e=(sx,sy,sz,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),em);m.position.set(x,y,z);m.castShadow=true;g.add(m);};
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([a,b])=>e(.035,h,.035,a*w/2,h/2,b*d/2));[1,-1].forEach(a=>{e(w,.035,.035,0,h,a*d/2);e(w,.035,.035,0,.02,a*d/2);e(.035,.035,d,a*w/2,h,0);e(.035,.035,d,a*w/2,.02,0);});}
  return g;};
/* glass lathe vessel (beaker/jar). returns {g, liq(setLevel), lm} */
X.vessel=(r,h,o={})=>{const g=new THREE.Group(),t=.022;
  const pts=[[0,0],[r-.04,0],[r,.035],[r,h],[r+.03,h+.02],[r-t,h+.025],[r-t,t+.02],[r-.05,t],[0,t]].map(p=>new THREE.Vector2(p[0],p[1]));
  const gl=new THREE.Mesh(new THREE.LatheGeometry(pts,64),G.glass);gl.renderOrder=4;g.add(gl);
  const lm=G.water(o.col||0xbfe2f0,o.op||.42);const lq=new THREE.Mesh(new THREE.CylinderGeometry(r-t-.004,r-t-.004,1,56),lm);lq.renderOrder=1;g.add(lq);
  const set=y=>{const on=y>.004;lq.visible=on;if(!on)return;lq.scale.y=y;lq.position.y=t+y/2;};set(o.level||0);
  if(o.grad){const tex=canvasTex(128,512,c=>{c.strokeStyle='rgba(255,255,255,.95)';c.fillStyle='rgba(255,255,255,.95)';c.lineWidth=4;c.font='bold 26px "IBM Plex Mono",monospace';
      for(let i=1;i<=10;i++){const y=512-i*46;c.beginPath();c.moveTo(10,y);c.lineTo(i%2?50:80,y);c.stroke();if(!(i%2))c.fillText(i*o.grad/10,86,y+9);}});
    const gm2=new THREE.Mesh(new THREE.CylinderGeometry(r+.004,r+.004,h*.92,24,1,true,-.5,1),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));gm2.position.y=h*.47;gm2.renderOrder=6;g.add(gm2);}
  return {g,set,lm,lq,r:r-t,h,y0:t};};
X.steam=(L,max=40)=>{const S=[];const mats=[];for(let i=0;i<max;i++){const m=new THREE.SpriteMaterial({map:P3.glowTex(),color:0xffffff,transparent:true,opacity:0,depthWrite:false});const s=new THREE.Sprite(m);s.visible=false;s.renderOrder=12;L.scene.add(s);S.push({s,m,t:9,x:0,y:0,z:0,v:0});}
  let k=0;return {emit(p,spread=.15,v=.5,size=.4,op=.35,dir){const q=S[k++%max];q.t=0;q.x=p.x+(Math.random()-.5)*spread;q.y=p.y;q.z=p.z+(Math.random()-.5)*spread;q.v=v*(.7+Math.random()*.6);q.size=size;q.op=op;q.dx=(Math.random()-.5)*.12;q.d=dir||null;q.s.visible=true;},
    tick(dt){S.forEach(q=>{if(q.t>=1.6){q.s.visible=false;return;}q.t+=dt;const k2=q.t/1.6;if(q.d)q.s.position.set(q.x+q.d.x*q.v*q.t,q.y+q.d.y*q.v*q.t+q.dx*q.t,q.z+q.d.z*q.v*q.t);else q.s.position.set(q.x+q.dx*q.t,q.y+q.v*q.t,q.z);q.s.scale.setScalar(q.size*(.4+k2));q.m.opacity=q.op*Math.sin(Math.PI*Math.min(1,k2));});}};};
X.fmtT=s=>{const m=Math.floor(s/60),x=Math.floor(s%60);return m+':'+String(x).padStart(2,'0');};
window.X3={X};

/* =====================================================================
   ١) لقاء الكتل الهوائية — حوض الجبهات (أول متوسط · الكتل والجبهات الهوائية)
   نمذجة الكتلتين بماء بارد (أزرق) وماء دافئ (أحمر): تيار جاذبي حقيقي
   ===================================================================== */
const FRONT={};EXP_MODS.front7=FRONT;
FRONT.init=function(){gm();
const W=3.0,HW=.92,D=.82;
const S={dT:30,lift:false,s:0,pred:null,busy:false,log:[],done:false};P3.dbg.front7=S;
const NAMES=['توقّع','ارفع الحاجز','راقب المجسّات','سجّل واستنتج'];
const sec=P3.section('front7',{title:'لقاء الكتل الهوائية: الجبهة الباردة والدافئة',grade:'أول متوسط',lesson:'الكتل والجبهات الهوائية',
  hud:`<div class="p3-row">${X.m('مجس أعلى اليسار','fT1')}${X.m('مجس أعلى اليمين','fT2',1)}</div><div class="p3-row">${X.m('مجس أسفل اليسار','fT3')}${X.m('مجس أسفل اليمين','fT4',1)}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    ${X.rng('حرارة الكتلة الدافئة','fW',20,55,1,38,'°C')}
    <p class="x-note">الكتلة الباردة ثابتة عند 8°C. كلما زاد فرق الحرارة زاد فرق الكثافة فتتحرك الكتل أسرع.</p>
    <div class="p3-acts"><span class="p3-lab">توقّعك:</span><button class="p3-b" data-a="p0">الباردة تنزلق أسفل الدافئة</button><button class="p3-b" data-a="p1">الباردة تصعد فوق الدافئة</button><button class="p3-b" data-a="p2">تبقيان في مكانهما</button></div>
    <div class="p3-acts"><button class="p3-b pri" data-a="lift">⬆ ارفع الحاجز</button><button class="p3-b" data-a="rec">📋 سجّل قراءات المجسّات</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>الكتل الهوائية</h3><p>الكتلة الهوائية جسم ضخم من الهواء له درجة حرارة ورطوبة متقاربتان. الهواء البارد <b>أكثف</b> من الهواء الدافئ، لذلك يهبط ويندفع أسفل الهواء الدافئ.</p>
    <p>في هذا النموذج نمثّل الكتلتين بماء بارد ملوّن بالأزرق وماء دافئ ملوّن بالأحمر؛ لأن الماء يسلك سلوك الهواء نفسه لكن ببطء نراه بأعيننا.</p></div>
    <div class="panel"><h3>الجبهات الهوائية</h3><p><b>الجبهة الباردة:</b> كتلة باردة تندفع أسفل كتلة دافئة فترفعها بسرعة إلى أعلى؛ فتتكوّن سحب ركامية وأمطار غزيرة وعواصف رعدية لفترة قصيرة.</p>
    <p><b>الجبهة الدافئة:</b> كتلة دافئة تنزلق ببطء فوق كتلة باردة؛ فتتكوّن سحب طبقية وأمطار خفيفة مستمرة.</p></div>`,
  quiz:[{q:'لماذا اندفع الماء البارد على قاع الحوض؟',o:['لأنه أكثف من الماء الدافئ','لأنه أخف من الماء الدافئ','لأن لونه أزرق'],a:0},
        {q:'عندما تندفع كتلة هوائية باردة أسفل كتلة دافئة تتكوّن جبهة:',o:['دافئة','باردة','ثابتة'],a:1},
        {q:'ما الطقس المصاحب غالبًا للجبهة الباردة؟',o:['أمطار خفيفة مستمرة أيامًا','عواصف رعدية وأمطار غزيرة قصيرة','صحو دائم'],a:1},
        {q:'ماذا يحدث لسرعة اندفاع الكتل عند زيادة فرق درجة الحرارة بينهما؟',o:['تزداد','تقل','لا تتغير'],a:0}],
  report:()=>({title:'لقاء الكتل الهوائية',grade:'أول متوسط',lesson:'الكتل والجبهات الهوائية',cols:['القراءة','الحرارة الدافئة','أعلى اليسار','أعلى اليمين','أسفل اليسار','أسفل اليمين'],
    rows:S.log.length?S.log.map((r,i)=>[String(i+1),r.w+'°C',...r.t.map(x=>x.toFixed(1)+'°C')]):[['1','','','','','']],note:'أين استقرت الكتلة الباردة؟ وأين استقرت الدافئة؟ فسّر ذلك بالكثافة.'})
});
const L=new Lab(sec,{target:V(0,.6,.4),dist:a=>Math.max(4.6,7.6/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* tank */
const tank=X.glassBox(W+.04,1.12,D+.04);tank.position.set(0,0,.4);L.add(tank);
const U={uS:{value:0},uT:{value:0},uH:{value:HW/2},uC:{value:new THREE.Color(0x1f5fd6)},uW:{value:new THREE.Color(0xd8322a)},uA:{value:.93}};
const wm=new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,
  vertexShader:`varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normalMatrix*normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader:`uniform float uS,uT,uH,uA;uniform vec3 uC,uW;varying vec3 vP;varying vec3 vN;
  void main(){float yn=clamp(vP.y/uH,-1.0,1.0);float s=uS;
   float xi=-s*yn;float head=s>0.02?0.10*min(s,1.2)*exp(-pow((yn+0.78)*3.4,2.0)):0.0;xi+=head-0.10*min(s,1.2)*exp(-pow((yn-0.78)*3.4,2.0));
   float kh=sin(yn*15.0+uT*2.6+vP.z*4.0)*0.045*min(s,1.0)*(1.0-yn*yn);xi+=kh;
   float w=0.025+0.05*min(s,1.0);float m=smoothstep(-w,w,xi-vP.x);
   vec3 mixc=vec3(0.52,0.30,0.62);vec3 c=mix(uW,uC,m);c=mix(c,mixc,0.55*(1.0-abs(m*2.0-1.0)));
   float sh=0.78+0.22*(yn*0.5+0.5);float lit=0.82+0.18*abs(normalize(vN).z);
   gl_FragColor=vec4(c*sh*lit,uA);}`});
const water=new THREE.Mesh(new THREE.BoxGeometry(W,HW,D),wm);water.position.set(0,.04+HW/2,.4);water.renderOrder=2;L.scene.add(water);
const surf=new THREE.Mesh(new THREE.PlaneGeometry(W,D),G.water(0xe9f3f8,.25));surf.rotation.x=-Math.PI/2;surf.position.set(0,.045+HW,.4);L.add(surf);
/* divider */
const div=new THREE.Group();{const p=new THREE.Mesh(RBox(.03,1.3,D+.06,.01),KIT.phys(0xf3f4f2,{roughness:.4}));p.position.y=.65;const h=new THREE.Mesh(RBox(.16,.08,.3,.03),KIT.mat(0x2b3036));h.position.y=1.34;div.add(p,h);castAll(div);}
div.position.set(0,.03,.4);L.add(div);
/* thermometers / sensors */
const SENS=[[-1.15,.78],[1.15,.78],[-1.15,.2],[1.15,.2]];
SENS.forEach(([x,y],i)=>{const g=new THREE.Group();const rod=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,1.3-y,10),M.steel);rod.position.y=(1.3-y)/2;
  const tip=new THREE.Mesh(new THREE.SphereGeometry(.035,14,10),KIT.mat(0x22272b,{metalness:.5}));const head=new THREE.Mesh(RBox(.14,.1,.1,.02),KIT.mat(i%2?0xb3261e:0x1f4e9c));head.position.y=1.3-y+.05;
  g.add(rod,tip,head);g.position.set(x,.04+y,.4+(i<2?-.18:.18));castAll(g);L.add(g);});
const cardC=P3.card([{t:'ماء بارد 8°C',s:60},{t:'يمثّل كتلة هوائية باردة',s:40}],.9,.26,{bd:'#1f5fd6'});cardC.position.set(-.8,.012,1.3);cardC.rotation.x=-1.25;L.add(cardC);
const cardW=P3.card([{t:'ماء دافئ',s:60},{t:'يمثّل كتلة هوائية دافئة',s:40}],.9,.26,{bd:'#d8322a'});cardW.position.set(.8,.012,1.3);cardW.rotation.x=-1.25;L.add(cardW);
const lbC=L.label('مقدمة الكتلة الباردة ← جبهة باردة',V(0,.15,.85),'x-c'),lbW=L.label('لسان الكتلة الدافئة ← جبهة دافئة',V(0,1,.85),'x-w');show(lbC,false);show(lbW,false);
/* physics of the lock-exchange current */
const tw0=38,tc=8;
const xi=(x,yn)=>{const s=S.s;let v=-s*yn;return v;};
function sensorT(i){const [x,y]=SENS[i];const yn=clamp((y-HW/2)/(HW/2),-1,1);const xx=xi(x,yn);const w=.03+.05*Math.min(S.s,1);const m=clamp((xx-x)/(2*w)+.5,0,1);const mix=1-Math.abs(m*2-1);
  const tw=S.dT+tc;return tc*m+tw*(1-m)+(tw-tc)*.0*mix;}
function hud(){const t=[0,1,2,3].map(sensorT);['fT1','fT2','fT3','fT4'].forEach((c,i)=>X.txt(sec,c,t[i].toFixed(1)+' °C'));return t;}
function setW(v){S.dT=v-tc;sec.$('#fW-o').textContent=v+'°C';const k=(v-20)/35;U.uW.value.set(mixHex(0xe86a4a,0xc81e1e,k));cardW.material.map.dispose();
  const nc=P3.card([{t:'ماء دافئ '+v+'°C',s:60},{t:'يمثّل كتلة هوائية دافئة',s:40}],.9,.26,{bd:'#d8322a'});nc.material.color.convertSRGBToLinear();cardW.material=nc.material;hud();}
function mixHex(a,b,t){return new THREE.Color(a).lerp(new THREE.Color(b),t).getHex();}
P3.loop(L,(dt,t)=>{U.uT.value=t;if(S.lift){const Ufr=.075*Math.sqrt(S.dT);const half=W/2;
    if(S.s<half)S.s+=Ufr*dt;else S.s+=(S.s*.55+.15)*dt*Ufr;if(S.s>40)S.s=40;U.uS.value=S.s;
    const s=Math.min(S.s,half-.12);lbC.style.display='';lbC.classList.toggle('p3-off',S.s>half*1.6);lbW.classList.toggle('p3-off',S.s>half*1.6);
    L.labels.find(l=>l.el===lbC).pos.set(s,.12,.86);L.labels.find(l=>l.el===lbW).pos.set(-s,.04+HW-.08,.86);
    if(!S.done&&S.s>half*1.05){S.done=true;P3.good();toast('اكتملت الحركة: الماء البارد يستقر في الأسفل والدافئ في الأعلى. سجّل قراءات المجسّات.');render();}
    hud();}});
async function lift(){if(S.busy||S.lift)return;if(S.pred==null){toast('اختر توقّعك أولًا ثم ارفع الحاجز.');return;}S.busy=true;sync();P3.whoosh();
  await L.tw(900,k=>{div.position.y=.03+ease(k)*1.6;div.rotation.z=ease(k)*.12;});div.visible=false;S.lift=true;show(lbC,true);show(lbW,true);S.busy=false;
  L.focus(V(.3,1.9,5.6),V(0,.55,.4),1200);sync();render();}
function pred(i){if(S.lift)return;S.pred=i;sec.$$('[data-a^="p"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.a==='p'+i));P3.click();render();}
function rec(){if(!S.lift)return;const t=hud();S.log.push({w:S.dT+tc,t});P3.click();toast('سُجّلت القراءة '+S.log.length+'.');renderNB();render();}
function reset(){if(S.busy)return;S.lift=false;S.s=0;U.uS.value=0;S.done=false;div.visible=true;div.position.y=.03;div.rotation.z=0;show(lbC,false);show(lbW,false);hud();L.home(700);sync();render();}
function stepIdx(){if(!S.lift)return S.pred==null?0:1;if(!S.done)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='توقّع ماذا سيحدث';html=`<p class="p3-txt">في الحوض ماء بارد (أزرق) وماء دافئ (أحمر) يفصل بينهما حاجز. ماذا سيحدث للكتلتين عند رفع الحاجز؟ اختر توقّعك من لوحة التحكم.</p>`;}
  else if(k===1){title='ارفع الحاجز';html=`<p class="p3-txt">اضغط «ارفع الحاجز» وراقب الحوض جيدًا. يمكنك تفعيل 🐢 الحركة البطيئة لترى الدوّامات عند سطح الالتقاء.</p>`;}
  else if(k===2){title='راقب المجسّات الأربعة';html=`<p class="p3-txt">لاحظ كيف تنخفض قراءة <b>المجس السفلي الأيمن</b> عندما يصل إليه الماء البارد، وترتفع قراءة <b>المجس العلوي الأيسر</b> بوصول الماء الدافئ.</p>`;}
  else{const ok=S.pred===0;title='سجّل واستنتج';html=`<p class="${ok?'p3-ok':'p3-txt'}">${ok?'توقّعك صحيح! ':'قارن توقّعك بما شاهدت. '}الكتلة الباردة الأكثف انزلقت على القاع أسفل الدافئة، والدافئة الأقل كثافة صعدت فوقها. هكذا تتكوّن <b>الجبهة الباردة</b> (مقدمة الكتلة الباردة)، و<b>الجبهة الدافئة</b> (انزلاق الدافئة فوق الباردة).</p>${S.log.length?'':'<p class="x-note">سجّل قراءات المجسّات بعد استقرار الكتلتين.</p>'}`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>#</th><th>الدافئة</th><th>أعلى يسار</th><th>أعلى يمين</th><th>أسفل يسار</th><th>أسفل يمين</th></tr></thead><tbody>${S.log.length?S.log.map((r,i)=>`<tr><td>${i+1}</td><td class="n">${r.w}°</td>${r.t.map(x=>`<td class="n">${x.toFixed(1)}°</td>`).join('')}</tr>`).join(''):'<tr><td colspan="6">—</td></tr>'}</tbody></table>`;}
function sync(){sec.$('[data-a="lift"]').disabled=S.busy||S.lift;sec.$('[data-a="rec"]').disabled=!S.lift;sec.$('#fW').disabled=S.lift;}
X.side(sec,{p0:()=>pred(0),p1:()=>pred(1),p2:()=>pred(2),lift,rec,reset});
sec.$('#fW').addEventListener('input',e=>setW(+e.target.value));
setW(38);sync();render();renderNB();
};

/* =====================================================================
   ٢) الفصول الأربعة وميل محور الأرض (أول متوسط · الأرض والنظام الشمسي)
   ===================================================================== */
const SEAS={};EXP_MODS.seas7=SEAS;
SEAS.init=function(){gm();
const LAT=24.7,MON=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],MD=[15,46,74,105,135,166,196,227,258,288,319,349];
const S={d:172,tilt:true,play:false,follow:false,log:[],noTilt:false};P3.dbg.seas7=S;
const NAMES=['حرّك الأرض في مدارها','سجّل أربعة أشهر','أزل ميل المحور','استنتج'];
const sec=P3.section('seas7',{title:'الفصول الأربعة وميل محور الأرض',grade:'أول متوسط',lesson:'الأرض والنظام الشمسي',
  hud:`<div class="p3-row">${X.m('التاريخ','sDt',1)}${X.m('الفصل في الرياض','sSe',1)}</div><div class="p3-row">${X.m('ارتفاع الشمس ظهرًا','sAl')}${X.m('طول النهار','sDl')}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="x-grid4">${MON.map((m,i)=>`<button class="p3-b" data-a="m" data-i="${i}">${m}</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b" data-a="play">▶ دوران سنة كاملة</button><button class="p3-b" data-a="tilt" aria-pressed="false">⟂ إلغاء ميل المحور</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="follow" aria-pressed="false">🎥 اقترب من الأرض</button><button class="p3-b pri" data-a="rec">📋 سجّل الشهر</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>لماذا تحدث الفصول الأربعة؟</h3><p>يميل محور دوران الأرض بزاوية <b>23.5°</b> تقريبًا، ويبقى متجهًا نحو الاتجاه نفسه في الفضاء طوال دورانها حول الشمس.</p>
    <p>عندما يميل نصف الكرة الشمالي نحو الشمس تسقط الأشعة عليه <b>عمودية تقريبًا</b> ويطول النهار فيكون الصيف، وعندما يميل بعيدًا عنها تسقط الأشعة <b>مائلة</b> وتتوزع على مساحة أكبر ويقصر النهار فيكون الشتاء.</p></div>
    <div class="panel"><h3>معلومة مهمة</h3><p>ليس سبب الصيف قرب الأرض من الشمس؛ فالأرض تكون أقرب إلى الشمس في شهر يناير، وهو شتاء عندنا في المملكة.</p></div>`,
  quiz:[{q:'سبب حدوث الفصول الأربعة هو:',o:['ميل محور الأرض أثناء دورانها حول الشمس','تغيّر بعد الأرض عن الشمس','دوران الأرض حول محورها'],a:0},
        {q:'في فصل الصيف في الرياض تكون أشعة الشمس ظهرًا:',o:['مائلة كثيرًا','قريبة من العمودية','غير موجودة'],a:1},
        {q:'إذا لم يكن محور الأرض مائلًا فإن طول النهار في الرياض:',o:['يبقى 12 ساعة تقريبًا طوال السنة','يزداد في الصيف','يصبح 24 ساعة'],a:0},
        {q:'أطول نهار في نصف الكرة الشمالي يكون في شهر:',o:['ديسمبر','يونيو','مارس'],a:1}],
  report:()=>({title:'الفصول الأربعة وميل محور الأرض',grade:'أول متوسط',lesson:'الأرض والنظام الشمسي',cols:['الشهر','ميل المحور','ارتفاع الشمس ظهرًا','طول النهار','الفصل'],
    rows:S.log.length?S.log.map(r=>[r.m,r.tilt?'23.5°':'0°',r.al.toFixed(0)+'°',r.dl.toFixed(1)+' ساعة',r.se]):[['','','','','']],note:'في أي الأشهر كانت الأشعة أقرب إلى العمودية والنهار أطول؟ وماذا حدث عند إلغاء ميل المحور؟'})
});
const L=new Lab(sec,{target:V(0,1.1,0),dist:a=>Math.max(8,12/a),exposure:1.05,fov:38});
L.scene.background=new THREE.Color(0x060b18);L.scene.environment=null;L.scene.children.filter(o=>o.isLight).forEach(l=>l.intensity*=l.isHemisphereLight?.25:.05);
L.controls.minAzimuthAngle=-Math.PI;L.controls.maxAzimuthAngle=Math.PI;L.controls.minPolarAngle=.2;L.controls.maxPolarAngle=1.5;L.controls.maxDistance=24;
const toast=m=>L.toast(m);
/* stars */
{const n=1400,p=new Float32Array(n*3);for(let i=0;i<n;i++){const u=Math.random()*2-1,a=Math.random()*6.283,r=45;const s=Math.sqrt(1-u*u);p[i*3]=r*s*Math.cos(a);p[i*3+1]=r*u;p[i*3+2]=r*s*Math.sin(a);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));L.scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xcfd8ff,size:.09,sizeAttenuation:true})));}
const Y=1.1,R=3.1;
/* sun */
const sun=new THREE.Mesh(new THREE.SphereGeometry(.6,48,32),new THREE.MeshBasicMaterial({color:0xffd56a}));sun.position.y=Y;L.scene.add(sun);
[[3.2,.55,0xffc44d],[5.5,.25,0xff9a3a]].forEach(([s,o,c])=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:P3.glowTex(),color:c,transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false}));sp.scale.setScalar(s);sp.position.y=Y;L.scene.add(sp);});
const sl=new THREE.PointLight(0xfff3dd,2.6,0,0);sl.position.y=Y;L.scene.add(sl);
/* orbit ring + month ticks */
{const pts=[];for(let i=0;i<=128;i++){const a=i/128*6.2832;pts.push(V(R*Math.cos(a),Y,-R*Math.sin(a)));}L.scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x4a5d8a,transparent:true,opacity:.7})));}
const theta=d=>Math.PI+2*Math.PI*(d-172)/365;
MON.forEach((m,i)=>{const a=theta(MD[i]);const c=P3.card([{t:m,s:70}],.62,.2,{bg:'#0e1a33',ink:'#cfe0ff',bd:'#3b5aa0'});c.material=new THREE.MeshBasicMaterial({map:c.material.map});c.position.set((R+.7)*Math.cos(a),Y+.12,-(R+.7)*Math.sin(a));c.lookAt(c.position.x*1.6,Y+3.2,c.position.z*1.6+6);L.scene.add(c);});
/* earth */
const etex=canvasTex(1024,512,c=>{const g=c.createLinearGradient(0,0,0,512);g.addColorStop(0,'#1b4f8f');g.addColorStop(.5,'#1f63b0');g.addColorStop(1,'#1b4f8f');c.fillStyle=g;c.fillRect(0,0,1024,512);
  const land=(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach((p,i)=>{const x=(p[0]+180)/360*1024,y=(90-p[1])/180*512;i?c.lineTo(x,y):c.moveTo(x,y);});c.closePath();c.fill();};
  const G1='#3f8f3a',D1='#c9a45a';
  land([[-165,68],[-140,70],[-95,72],[-60,60],[-75,45],[-80,30],[-97,18],[-105,22],[-118,33],[-125,48],[-150,58]],G1);
  land([[-80,10],[-60,8],[-35,-6],[-40,-22],[-58,-38],[-70,-52],[-75,-40],[-72,-15],[-81,-3]],G1);
  land([[-17,35],[10,37],[33,31],[43,12],[51,11],[40,-15],[32,-28],[20,-35],[12,-15],[9,4],[-8,5],[-17,15]],D1);
  land([[34,30],[36,33],[47,30],[56,26],[59,22],[52,16],[44,12],[38,20]],D1);
  land([[-10,36],[-9,44],[0,50],[10,56],[30,70],[70,73],[140,72],[178,66],[160,58],[140,50],[125,40],[120,25],[105,10],[90,22],[78,8],[72,20],[62,25],[50,38],[30,40],[25,36],[10,44],[0,38]],G1);
  land([[113,-22],[130,-12],[143,-12],[153,-28],[146,-38],[132,-32],[116,-34]],D1);
  land([[-60,82],[-20,82],[-20,70],[-45,60],[-55,70]],'#e8eef2');c.fillStyle='#eef3f6';c.fillRect(0,476,1024,36);c.fillRect(0,0,1024,14);
  for(let i=0;i<260;i++){c.fillStyle='rgba(255,255,255,.18)';c.beginPath();c.ellipse(Math.random()*1024,40+Math.random()*430,8+Math.random()*30,3+Math.random()*6,0,0,7);c.fill();}});
const tiltG=new THREE.Group();L.scene.add(tiltG);
const earth=new THREE.Mesh(new THREE.SphereGeometry(.5,64,40),new THREE.MeshStandardMaterial({map:etex,roughness:.75,metalness:0}));tiltG.add(earth);
const axis=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,1.7,8),new THREE.MeshBasicMaterial({color:0xfff2b0}));tiltG.add(axis);
const npole=P3.card([{t:'ش',s:90}],.16,.16,{bg:'#fff2b0',ink:'#10302c',bd:'#fff2b0'});npole.material=new THREE.MeshBasicMaterial({map:npole.material.map,transparent:true});npole.position.y=.96;tiltG.add(npole);
const pin=new THREE.Mesh(new THREE.SphereGeometry(.035,12,10),new THREE.MeshBasicMaterial({color:0xff3b30}));{const la=LAT*Math.PI/180,lo=45*Math.PI/180;pin.position.set(.51*Math.cos(la)*Math.cos(lo),.51*Math.sin(la),-.51*Math.cos(la)*Math.sin(lo));}earth.add(pin);
const pinLb=L.label('الرياض',V(),'x-d');
const ray=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,1,8),new THREE.MeshBasicMaterial({color:0xffe08a,transparent:true,opacity:.5}));L.scene.add(ray);
/* inset: sun angle at Riyadh */
const ov=X.ov(sec,'زاوية أشعة الشمس ظهرًا في الرياض',240,130);
function decl(d){return S.tilt?23.44*Math.sin(2*Math.PI*(d-80)/365):0;}
function calc(d){const de=decl(d),al=90-Math.abs(LAT-de);const x=-Math.tan(LAT*Math.PI/180)*Math.tan(de*Math.PI/180);const dl=2*Math.acos(clamp(x,-1,1))*180/Math.PI/15;
  let se;if(!S.tilt)se='لا فصول';else{const q=((d%365)+365)%365;se=q>=80&&q<172?'الربيع':q>=172&&q<266?'الصيف':q>=266&&q<355?'الخريف':'الشتاء';}return {de,al,dl,se};}
function monthOf(d){let best=0,bd=1e9;MD.forEach((m,i)=>{const x=Math.min(Math.abs(d-m),365-Math.abs(d-m));if(x<bd){bd=x;best=i;}});return best;}
function drawInset(al){const {x,w,h}=ov;x.clearRect(0,0,w,h);const gy=h-22,cx=w/2,a=al*Math.PI/180,bw=34;
  x.fillStyle='#c79a52';x.fillRect(0,gy,w,22);const foot=Math.min(w-24,bw/Math.sin(a));
  const dx=Math.cos(a),dy=Math.sin(a);x.fillStyle='rgba(255,214,90,.28)';x.beginPath();x.moveTo(cx-foot/2,gy);x.lineTo(cx+foot/2,gy);x.lineTo(cx+foot/2-dx*140,gy-dy*140);x.lineTo(cx-foot/2-dx*140,gy-dy*140);x.closePath();x.fill();
  x.strokeStyle='#ffd65a';x.lineWidth=1.6;for(let k=0;k<=4;k++){const sx=cx-foot/2+foot*k/4;x.beginPath();x.moveTo(sx-dx*140,gy-dy*140);x.lineTo(sx,gy);x.stroke();}
  x.fillStyle='rgba(255,214,90,.9)';x.fillRect(cx-foot/2,gy,foot,4);
  x.fillStyle='#fff';x.font='700 13px "IBM Plex Mono",monospace';x.textAlign='left';x.fillText(al.toFixed(0)+'°',8,gy-6);
  x.fillStyle='#ffd65a';x.font='700 10px "IBM Plex Sans Arabic",sans-serif';x.textAlign='right';x.fillText('مساحة البقعة المضيئة: '+(1/Math.sin(a)).toFixed(2)+' ضعف',w-6,gy+15);}
let spin=0;
function place(d){const a=theta(d),ex=R*Math.cos(a),ez=-R*Math.sin(a);tiltG.position.set(ex,Y,ez);tiltG.rotation.set(0,0,S.tilt?-23.44*Math.PI/180:0);
  const dir=V(-ex,0,-ez).normalize();ray.position.set(ex/2,Y,ez/2);ray.scale.y=R-1.0;ray.quaternion.setFromUnitVectors(V(0,1,0),dir);ray.position.copy(V(0,Y,0).add(V(ex,0,ez).multiplyScalar(.5)));
  const c=calc(d),mi=monthOf(d);X.txt(sec,'sDt',MON[mi]);X.txt(sec,'sSe',c.se);X.txt(sec,'sAl',c.al.toFixed(0)+'°');X.txt(sec,'sDl',c.dl.toFixed(1)+' ساعة');drawInset(c.al);
  sec.$$('[data-a="m"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===mi&&Math.abs(MD[mi]-d)<3));}
P3.loop(L,(dt)=>{spin+=dt*1.2;earth.rotation.y=spin;if(S.play){S.d+=dt*36;if(S.d>=S.d0+365){S.d=S.d0+365;S.play=false;sync();}place(S.d%365);}
  const wp=pin.getWorldPosition(new THREE.Vector3());L.labels.find(l=>l.el===pinLb).pos.copy(wp).add(V(0,.12,0));
  if(S.follow){const e=tiltG.position;const want=V(e.x*1.55,Y+.7,e.z*1.55+.01);L.camera.position.lerp(want,Math.min(1,dt*3));L.controls.target.lerp(e,Math.min(1,dt*4));}});
async function goMonth(i){S.play=false;const d0=S.d%365;let d1=MD[i];let dd=d1-d0;if(dd<0)dd+=365;const s=S.d;await L.tw(500+dd*6,k=>{S.d=s+dd*ease(k);place(S.d%365);});S.d=d1;place(d1);P3.click();sync();render();}
function play(){if(S.play){S.play=false;sync();return;}S.d0=S.d;S.play=true;sync();}
function tilt(b){S.tilt=!S.tilt;b.setAttribute('aria-pressed',!S.tilt);b.textContent=S.tilt?'⟂ إلغاء ميل المحور':'↺ أعد ميل المحور 23.5°';if(!S.tilt)S.noTilt=true;place(S.d%365);toast(S.tilt?'عاد المحور مائلًا 23.5°.':'أصبح المحور عموديًا: راقب طول النهار وارتفاع الشمس في الأشهر المختلفة.');render();}
function follow(b){S.follow=!S.follow;b.setAttribute('aria-pressed',S.follow);if(!S.follow)L.home(900);}
function rec(){const d=S.d%365,c=calc(d),mi=monthOf(d);const r={m:MON[mi],tilt:S.tilt,al:c.al,dl:c.dl,se:c.se};const k=S.log.findIndex(x=>x.m===r.m&&x.tilt===r.tilt);if(k>=0)S.log[k]=r;else S.log.push(r);P3.click();toast('سُجّل شهر '+r.m+'.');renderNB();render();}
function reset(){S.play=false;S.d=172;S.tilt=true;S.log=[];S.noTilt=false;const b=sec.$('[data-a="tilt"]');b.setAttribute('aria-pressed',false);b.textContent='⟂ إلغاء ميل المحور';place(172);renderNB();sync();render();}
function stepIdx(){const n=S.log.filter(r=>r.tilt).length;if(n<1)return 0;if(n<4)return 1;if(!S.log.some(r=>!r.tilt))return 2;return 3;}
function render(){const k=stepIdx(),n=S.log.filter(r=>r.tilt).length;let title,html;
  if(k===0){title='حرّك الأرض حول الشمس';html=`<p class="p3-txt">اختر شهرًا أو شغّل «دوران سنة كاملة». لاحظ أن محور الأرض يبقى مائلًا نحو الاتجاه نفسه، وأن ارتفاع الشمس وطول النهار في <b>الرياض</b> يتغيران.</p>`;}
  else if(k===1){title='سجّل أربعة أشهر';html=`<p class="p3-txt">سجّل يونيو وديسمبر ومارس وسبتمبر على الأقل (${n} / 4). قارن ارتفاع الشمس وطول النهار.</p>`;}
  else if(k===2){title='أزل ميل المحور';html=`<p class="p3-txt">اضغط «إلغاء ميل المحور» ثم سجّل شهرين مختلفين. هل بقيت الفصول؟</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">مع ميل المحور 23.5° تتغير زاوية سقوط الأشعة وطول النهار خلال السنة فتحدث الفصول. وعند إلغاء الميل يبقى النهار نحو 12 ساعة وارتفاع الشمس ثابتًا فلا توجد فصول.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){const pts=S.log.filter(r=>r.tilt).map(r=>[MON.indexOf(r.m)+1,+r.dl.toFixed(2)]);
  sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>الشهر</th><th>الميل</th><th>ارتفاع الشمس</th><th>طول النهار</th><th>الفصل</th></tr></thead><tbody>${S.log.length?S.log.map(r=>`<tr><td>${r.m}</td><td class="n">${r.tilt?'23.5°':'0°'}</td><td class="n">${r.al.toFixed(0)}°</td><td class="n">${r.dl.toFixed(1)} h</td><td>${r.se}</td></tr>`).join(''):'<tr><td colspan="5">—</td></tr>'}</tbody></table>`+
  (pts.length>1?KIT.chart({w:330,h:180,xl:'الشهر',yl:'طول النهار (ساعة)',xmin:1,xmax:12,ymin:9,ymax:15,xticks:[1,3,5,7,9,11],series:[{c:'var(--accent)',name:'طول النهار',pts,dots:true}]}):'');}
function sync(){sec.$('[data-a="play"]').textContent=S.play?'⏸ إيقاف الدوران':'▶ دوران سنة كاملة';}
X.side(sec,{m:b=>goMonth(+b.dataset.i),play,tilt,follow,rec,reset});
place(172);sync();render();renderNB();
};

/* =====================================================================
   ٣) الدورة المائية في نظام بيئي مغلق (أول متوسط · ما النظام البيئي؟)
   ===================================================================== */
const ECO={};EXP_MODS.eco7=ECO;
ECO.init=function(){gm();
const COMP=[{id:'plant',n:'النباتات',bio:true},{id:'snail',n:'الحلزون',bio:true},{id:'worm',n:'دودة الأرض',bio:true},{id:'soil',n:'التربة',bio:false},{id:'water',n:'الماء',bio:false},{id:'rock',n:'الصخور',bio:false},{id:'air',n:'الهواء',bio:false},{id:'light',n:'ضوء المصباح',bio:false}];
const S={cls:{},checked:false,lamp:false,lid:true,T:24,RH:55,cond:0,rain:0,seen:{evap:false,cond:false,rain:false},hours:0,openSeen:false};P3.dbg.eco7=S;
const NAMES=['صنّف المكوّنات','شغّل الضوء','راقب الدورة المائية','افتح الغطاء وقارن'];
const sec=P3.section('eco7',{title:'الدورة المائية في نظام بيئي مغلق',grade:'أول متوسط',lesson:'ما النظام البيئي؟',
  hud:`<div class="p3-row">${X.m('درجة الحرارة','eT',1)}${X.m('الرطوبة النسبية','eH')}</div><div class="p3-row">${X.m('الزمن','eHr',1)}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">١) صنّف مكوّنات النظام البيئي</h4>
    <div class="x-cls">${COMP.map(c=>`<div><span>${c.n}</span><button class="p3-b" data-a="c" data-id="${c.id}" data-v="1">حي</button><button class="p3-b" data-a="c" data-id="${c.id}" data-v="0">غير حي</button><b class="p3-fb" id="ecf-${c.id}"></b></div>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b" data-a="chk">تحقّق من التصنيف</button><span class="p3-fb ecm"></span></div></div>
    <div class="p3-box"><h4 class="p3-h">٢) لوحة التحكم</h4>
    <div class="p3-acts"><button class="p3-b pri" data-a="lamp">💡 شغّل المصباح (الشمس)</button><button class="p3-b" data-a="lid">🫙 افتح الغطاء</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>النظام البيئي</h3><p>النظام البيئي مخلوقات حية (<b>عوامل حيوية</b>) تتفاعل فيما بينها ومع البيئة غير الحية (<b>عوامل لا حيوية</b>) مثل الماء والتربة والهواء والضوء ودرجة الحرارة.</p></div>
    <div class="panel"><h3>الدورة المائية في القارورة</h3><p>يسخّن الضوء الماء فيتبخّر (<b>تبخّر</b>)، وتطلق النباتات بخار الماء من أوراقها (<b>نتح</b>)، ثم يبرد البخار على الجدار والغطاء فيتحوّل إلى قطرات (<b>تكاثف</b>)، ثم تنزلق القطرات إلى التربة (<b>هطول</b>). لذلك يعيش النظام المغلق مدة طويلة دون أن نسقيه.</p></div>`,
  quiz:[{q:'أيٌّ مما يلي عامل لا حيوي في النظام البيئي؟',o:['الحلزون','الماء','النبات'],a:1},{q:'تكوّن القطرات على غطاء القارورة يسمى:',o:['تبخّرًا','تكاثفًا','نتحًا'],a:1},
        {q:'خروج بخار الماء من أوراق النبات يسمى:',o:['النتح','الهطول','الترشيح'],a:0},{q:'ماذا يحدث للرطوبة داخل القارورة عند فتح الغطاء؟',o:['ترتفع','تنخفض لأن البخار يخرج','لا تتغير'],a:1}],
  report:()=>({title:'الدورة المائية في نظام بيئي مغلق',grade:'أول متوسط',lesson:'ما النظام البيئي؟',cols:['المكوّن','التصنيف'],
    rows:COMP.map(c=>[c.n,S.checked&&S.cls[c.id]!=null?(S.cls[c.id]?'حي':'غير حي'):'']),note:'صف مراحل الدورة المائية التي شاهدتها داخل القارورة: '+[S.seen.evap?'تبخّر':'',S.seen.cond?'تكاثف':'',S.seen.rain?'هطول':''].filter(Boolean).join('، ')})
});
const L=new Lab(sec,{target:V(0,.85,.4),dist:a=>Math.max(4,6.4/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* jar */
const JR=.95,JH=1.55,J=X.vessel(JR,JH,{level:0});J.g.position.set(0,0,.4);L.add(J.g);
const lid=new THREE.Group();{const t=new THREE.Mesh(new THREE.CylinderGeometry(JR+.06,JR+.06,.07,64),KIT.phys(0x2f6f62,{roughness:.35}));const k=new THREE.Mesh(new THREE.CylinderGeometry(.12,.14,.08,24),KIT.phys(0x245a50));k.position.y=.07;lid.add(t,k);castAll(lid);}
lid.position.set(0,JH+.06,.4);L.add(lid);
/* soil layers */
const lay=(r,h,y,col,rough)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,48),KIT.mat(col,{roughness:rough||.95}));m.position.set(0,y,.4);m.receiveShadow=true;L.add(m);return m;};
lay(JR-.03,.14,.1,0x9a9488);const soil=lay(JR-.03,.3,.32,0x4a3424);
{const im=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.03,0),KIT.mat(0xb7ae9f),120);const d=new THREE.Object3D();for(let i=0;i<120;i++){const a=Math.random()*6.28,r=(.2+Math.random()*.7)*(JR-.05);d.position.set(Math.cos(a)*r,.05+Math.random()*.1,.4+Math.sin(a)*r);d.rotation.set(Math.random()*3,Math.random()*3,0);d.scale.setScalar(.6+Math.random()*.8);d.updateMatrix();im.setMatrixAt(i,d.matrix);}L.add(im);}
const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.2,1),KIT.mat(0x8b8a84,{roughness:.9}));rock.scale.set(1.2,.7,1);rock.position.set(.45,.52,.15);castAll(rock);L.add(rock);
const dish=new THREE.Mesh(new THREE.CylinderGeometry(.26,.22,.06,32),KIT.phys(0xe9ecea,{roughness:.3}));dish.position.set(-.4,.5,.68);L.add(dish);
const wtr=new THREE.Mesh(new THREE.CylinderGeometry(.23,.23,.02,32),G.water(0x58a9e0,.75));wtr.position.set(-.4,.53,.68);L.add(wtr);
/* plants */
const plants=new THREE.Group();const leafM=KIT.phys(0x3f9a3a,{roughness:.5,side:THREE.DoubleSide});
[[0,.02],[.3,.6],[-.45,.05],[.1,.78]].forEach(([x,z],pi)=>{const g=new THREE.Group();const h=.5+pi%2*.25;const st=new THREE.Mesh(new THREE.CylinderGeometry(.015,.022,h,8),KIT.mat(0x4d7a2a));st.position.y=h/2;g.add(st);
  for(let i=0;i<7;i++){const lf=new THREE.Mesh(new THREE.SphereGeometry(.1,10,6),leafM);lf.scale.set(1,.18,.5);const a=i*2.4;lf.position.set(Math.cos(a)*.09,h*(.35+i*.09),Math.sin(a)*.09);lf.rotation.set(.3,a,-.5);g.add(lf);}
  g.position.set(x,.47,.4+z-.4);g.position.z=z+.0;g.position.set(x,.47,z);castAll(g);plants.add(g);});
plants.position.z=0;L.add(plants);
/* snail + worm */
const snail=new THREE.Group();{const sh=new THREE.Mesh(new THREE.TorusGeometry(.06,.04,10,20),KIT.phys(0xa0703a,{roughness:.4}));sh.rotation.y=Math.PI/2;sh.position.y=.08;
  const bd=new THREE.Mesh(new THREE.CylinderGeometry(.035,.03,.2,12),KIT.mat(0xc9b08a));bd.rotation.z=Math.PI/2;bd.position.y=.035;snail.add(sh,bd);castAll(snail);}
snail.position.set(.15,.48,.95);L.add(snail);
const worm=KIT.wire([V(-.62,.49,.95),V(-.5,.52,1.02),V(-.36,.49,1.04),V(-.22,.51,.98),V(-.1,.49,1.03)],0xc97b7b,.026);L.add(worm);
/* lamp */
const lamp=new THREE.Group();{const b=new THREE.Mesh(new THREE.CylinderGeometry(.25,.3,.06,24),KIT.mat(0x2b3036,{metalness:.4}));b.position.y=.03;const a1=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,2.4,10),M.steel);a1.position.y=1.2;
  const a2=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,1.3,10),M.steel);a2.rotation.z=Math.PI/2;a2.position.set(.65,2.4,0);
  const sh=new THREE.Mesh(new THREE.ConeGeometry(.32,.36,32,1,true),KIT.mat(0xe0703f,{side:THREE.DoubleSide,metalness:.3}));sh.position.set(1.3,2.26,0);
  lamp.add(b,a1,a2,sh);castAll(lamp);}
lamp.position.set(-1.3,0,.1);L.add(lamp);
const bulb=new THREE.Mesh(new THREE.SphereGeometry(.11,20,14),new THREE.MeshBasicMaterial({color:0x9a9a8a}));bulb.position.set(0,2.18,.1);L.scene.add(bulb);
const spot=new THREE.SpotLight(0xffe2a8,0,6,.7,.5,1.2);spot.position.set(0,2.15,.1);spot.target.position.set(0,.4,.4);spot.castShadow=true;L.scene.add(spot,spot.target);
const glw=new THREE.Sprite(new THREE.SpriteMaterial({map:P3.glowTex(),color:0xffd27a,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));glw.scale.setScalar(1.4);glw.position.copy(bulb.position);L.scene.add(glw);
/* condensation droplets on inner wall + lid */
const ND=420,dm=new THREE.MeshPhysicalMaterial({color:0xf4fbff,roughness:.02,transparent:true,opacity:.55,clearcoat:1,depthWrite:false});dm.userData.keepEnv=1;dm.envMapIntensity=1.8;
const drops=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),dm,ND);drops.count=ND;drops.renderOrder=6;L.scene.add(drops);
const DR=[];for(let i=0;i<ND;i++){const top=i<110;const a=Math.random()*6.283;DR.push(top?{top,a,r:Math.random()*(JR-.08),y:JH-.01,s:0,max:.012+Math.random()*.018,v:0}:{top,a,y:.75+Math.random()*(JH-.8),s:0,max:.01+Math.random()*.02,v:0});}
const dO=new THREE.Object3D();
function drawDrops(){for(let i=0;i<ND;i++){const q=DR[i];if(q.top){dO.position.set(Math.cos(q.a)*q.r,q.y+.0,.4+Math.sin(q.a)*q.r);dO.scale.set(q.s,q.s*.7,q.s);}
  else{const r=JR-.03;dO.position.set(Math.cos(q.a)*r,q.y,.4+Math.sin(q.a)*r);dO.scale.set(q.s*.6,q.s*(1+q.v*8),q.s*.6);}dO.updateMatrix();drops.setMatrixAt(i,dO.matrix);}drops.instanceMatrix.needsUpdate=true;}
drawDrops();
const vap=X.steam(L,60);
/* tap-to-identify */
const lbls={};const tapObj={plant:plants,snail,worm,soil,water:wtr,rock,light:bulb};
Object.entries(tapObj).forEach(([k,o])=>{L.onTap(o,()=>{const c=COMP.find(x=>x.id===k);toast(c.n+': هل هو حي أم غير حي؟ صنّفه في الجدول.');});});
P3.loop(L,(dt,t)=>{const k=dt*(S.lamp?1:0);const tgtT=S.lamp?(S.lid?32:29):24,tgtH=S.lamp?(S.lid?94:60):(S.lid?62:52);
  S.T+=(tgtT-S.T)*Math.min(1,dt*.25);S.RH+=(tgtH-S.RH)*Math.min(1,dt*(S.lid?.18:.4));if(S.lamp)S.hours+=dt*2;
  X.txt(sec,'eT',S.T.toFixed(1)+' °C');X.txt(sec,'eH',S.RH.toFixed(0)+' %');X.txt(sec,'eHr',(S.hours|0)+' ساعة');
  if(S.lamp&&Math.random()<dt*14){vap.emit(V(-.4+(Math.random()-.5)*.3,.56,.68),.2,.35,.3,.22);S.seen.evap=true;}
  if(S.lamp&&Math.random()<dt*6){const p=plants.children[(Math.random()*4)|0];const wp=p.getWorldPosition(new THREE.Vector3());vap.emit(V(wp.x,wp.y+.5,wp.z),.2,.3,.25,.16);}
  vap.tick(dt);
  const grow=S.lid&&S.RH>78;const dry=!S.lid;let any=false,rain=false;
  DR.forEach(q=>{if(grow)q.s=Math.min(q.max,q.s+dt*q.max*(.08+Math.random()*.12));else if(dry)q.s=Math.max(0,q.s-dt*.01);
    if(q.s>.004)any=true;
    if(!q.top&&q.s>=q.max*.98&&grow){q.v=Math.min(.6,q.v+dt*.6);q.y-=q.v*dt;if(q.y<.5){q.y=.75+Math.random()*(JH-.8);q.s=0;q.v=0;rain=true;}}
    if(q.top&&q.s>=q.max*.98&&grow&&Math.random()<dt*.2){q.s=0;rain=true;}});
  if(any&&!S.seen.cond){S.seen.cond=true;toast('تكاثف! ظهرت قطرات الماء على الجدار والغطاء.');renderNB();render();}
  if(rain&&!S.seen.rain){S.seen.rain=true;toast('هطول: القطرات الكبيرة تنزلق عائدة إلى التربة.');renderNB();render();}
  drawDrops();});
function cls(id,v){S.cls[id]=v;sec.$$(`[data-a="c"][data-id="${id}"]`).forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));P3.click();}
function chk(){let ok=0,n=0;COMP.forEach(c=>{const e=sec.$('#ecf-'+c.id);if(S.cls[c.id]==null){e.textContent='';return;}n++;const g=(S.cls[c.id]===1)===c.bio;if(g)ok++;e.textContent=g?'✓':'✗';e.className='p3-fb '+(g?'ok':'bad');});
  const m=sec.$('.ecm');m.textContent=n<COMP.length?'صنّف جميع المكوّنات أولًا.':`الصحيح ${ok} من ${COMP.length}`;m.className='p3-fb ecm '+(ok===COMP.length?'ok':'bad');if(ok===COMP.length){S.checked=true;P3.good();toast('أحسنت! الآن شغّل المصباح ليمثّل الشمس.');}render();renderNB();}
function lampT(b){S.lamp=!S.lamp;spot.intensity=S.lamp?3.2:0;glw.material.opacity=S.lamp?.85:0;bulb.material.color.set(S.lamp?0xfff3c4:0x9a9a8a);b.textContent=S.lamp?'💡 أطفئ المصباح':'💡 شغّل المصباح (الشمس)';b.setAttribute('aria-pressed',S.lamp);if(S.lamp)L.focus(V(0,1.6,3.2),V(0,.9,.4),1100);render();}
async function lidT(b){S.lid=!S.lid;b.textContent=S.lid?'🫙 افتح الغطاء':'🫙 أغلق الغطاء';const y0=lid.position.y,y1=S.lid?JH+.06:JH+.7,x0=lid.position.x,x1=S.lid?0:.9;
  await L.tw(700,k=>{lid.position.y=y0+(y1-y0)*ease(k);lid.position.x=x0+(x1-x0)*ease(k);lid.rotation.z=(S.lid?0:-.5)*ease(k)+(S.lid?-.5*(1-ease(k)):0);});if(!S.lid){S.openSeen=true;toast('فُتح الغطاء: يخرج بخار الماء إلى الغرفة فتنخفض الرطوبة وتجف القطرات.');}render();}
function reset(){S.lamp=false;S.T=24;S.RH=55;S.hours=0;S.seen={evap:false,cond:false,rain:false};S.openSeen=false;spot.intensity=0;glw.material.opacity=0;bulb.material.color.set(0x9a9a8a);DR.forEach(q=>{q.s=0;q.v=0;});
  if(!S.lid){S.lid=true;lid.position.set(0,JH+.06,.4);lid.rotation.z=0;}sec.$('[data-a="lamp"]').textContent='💡 شغّل المصباح (الشمس)';sec.$('[data-a="lid"]').textContent='🫙 افتح الغطاء';L.home(700);renderNB();render();}
function stepIdx(){if(!S.checked)return 0;if(!S.lamp&&!S.seen.evap)return 1;if(!S.seen.rain)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='صنّف مكوّنات النظام البيئي';html=`<p class="p3-txt">داخل القارورة نباتات وحلزون ودودة أرض وتربة وماء وصخور وهواء، وفوقها مصباح يمثّل الشمس. صنّف كل مكوّن: حي أم غير حي؟ (اضغط على أي مكوّن في المشهد لتتعرّفه).</p>`;}
  else if(k===1){title='شغّل المصباح';html=`<p class="p3-txt">المصباح يمثّل الشمس. شغّله وراقب درجة الحرارة والرطوبة داخل القارورة المغلقة.</p>`;}
  else if(k===2){title='راقب الدورة المائية';html=`<p class="p3-txt">${S.seen.evap?'✓ تبخّر الماء ونتح النبات':'انتظر التبخّر'} · ${S.seen.cond?'✓ تكاثف على الجدار والغطاء':'انتظر التكاثف'} · ${S.seen.rain?'✓ هطول':'انتظر الهطول'}. فعّل 🐢 لترى انزلاق القطرات ببطء.</p>`;}
  else{title='افتح الغطاء وقارن';html=`<p class="${S.openSeen?'p3-ok':'p3-txt'}">${S.openSeen?'عند فتح الغطاء خرج البخار وانخفضت الرطوبة وجفّت القطرات؛ أما القارورة المغلقة فتعيد استخدام الماء نفسه باستمرار: تبخّر ← تكاثف ← هطول. لهذا يبقى النظام البيئي المغلق حيًّا دون ريّ.':'اكتملت الدورة المائية داخل القارورة. افتح الغطاء الآن وراقب الرطوبة والقطرات.'}</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>مرحلة الدورة المائية</th><th>أين شاهدتها؟</th></tr></thead><tbody>
  <tr><td>التبخّر والنتح</td><td>${S.seen.evap?'من طبق الماء وأوراق النبات':'—'}</td></tr><tr><td>التكاثف</td><td>${S.seen.cond?'قطرات على الجدار والغطاء':'—'}</td></tr><tr><td>الهطول</td><td>${S.seen.rain?'قطرات تنزلق إلى التربة':'—'}</td></tr></tbody></table>`;}
X.side(sec,{c:b=>cls(b.dataset.id,+b.dataset.v),chk,lamp:lampT,lid:lidT,reset});
render();renderNB();
};

/* =====================================================================
   ٤) منحنى التسخين: من الجليد إلى البخار (ثاني متوسط · الحرارة وتحولات المادة)
   ===================================================================== */
const HEAT={};EXP_MODS.heat8=HEAT;
HEAT.init=function(){gm();
const M0=.2,CI=2100,CW=4186,LF=334000,LV=2.26e6;
const S={on:false,P:300,t:0,T:-10,ice:M0,wat:0,vap:0,pts:[[0,-10]],rows:[],ts:30,ended:false,mPhase:{melt:false,boil:false}};P3.dbg.heat8=S;
const NAMES=['شغّل السخان','راقب الانصهار','راقب الغليان','استنتج'];
const sec=P3.section('heat8',{title:'منحنى التسخين: من الجليد إلى البخار',grade:'ثاني متوسط',lesson:'الحرارة وتحولات المادة',
  hud:`<div class="p3-row">${X.m('الزمن','hTm',1)}${X.m('درجة الحرارة','hT')}</div><div class="p3-row">${X.m('الحالة الفيزيائية','hSt',1)}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <p class="x-note">في الكأس 200 g من الجليد عند ‎-10°C. السخان يعطي طاقة ثابتة كل ثانية.</p>
    <div class="p3-acts"><span class="p3-lab">قدرة السخان:</span><button class="p3-b" data-a="p" data-v="150">150 واط</button><button class="p3-b" data-a="p" data-v="300" aria-pressed="true">300 واط</button></div>
    <div class="p3-acts"><span class="p3-lab">تسريع الزمن:</span><button class="p3-b" data-a="ts" data-v="10">×10</button><button class="p3-b" data-a="ts" data-v="30" aria-pressed="true">×30</button><button class="p3-b" data-a="ts" data-v="60">×60</button></div>
    <div class="p3-acts"><button class="p3-b pri" data-a="go">🔥 شغّل السخان</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>الحرارة وتحولات المادة</h3><p>عندما نسخّن مادة صلبة ترتفع درجة حرارتها حتى تصل إلى <b>درجة الانصهار</b> (0°C للجليد)، ثم <b>تثبت</b> درجة الحرارة رغم استمرار التسخين؛ لأن الطاقة تُستخدم في كسر الروابط بين الجزيئات وتحويل الصلب إلى سائل.</p>
    <p>وبعد انصهار الجليد كله ترتفع الحرارة حتى <b>درجة الغليان</b> (100°C عند سطح البحر)، فتثبت مرة أخرى حتى يتحول السائل إلى غاز.</p></div>
    <div class="panel"><h3>اقرأ المنحنى</h3><p>الأجزاء المائلة: تغيّر في درجة الحرارة. الأجزاء الأفقية: تغيّر في الحالة الفيزيائية (انصهار ثم غليان).</p></div>`,
  quiz:[{q:'ماذا يحدث لدرجة حرارة الجليد أثناء انصهاره رغم استمرار التسخين؟',o:['ترتفع بسرعة','تبقى ثابتة عند 0°C','تنخفض'],a:1},{q:'أين تذهب الطاقة أثناء الغليان؟',o:['إلى رفع درجة الحرارة','إلى تحويل السائل إلى غاز','لا تذهب إلى أي مكان'],a:1},
        {q:'عند مضاعفة قدرة السخان فإن زمن الانصهار:',o:['يقل إلى النصف تقريبًا','يتضاعف','لا يتغير'],a:0},{q:'درجة غليان الماء النقي عند سطح البحر:',o:['0°C','100°C','37°C'],a:1}],
  report:()=>({title:'منحنى التسخين: من الجليد إلى البخار',grade:'ثاني متوسط',lesson:'الحرارة وتحولات المادة',cols:['الزمن (دقيقة)','درجة الحرارة (°C)','الحالة'],
    rows:S.rows.length?S.rows.map(r=>[String(r[0]),r[1].toFixed(1),r[2]]):[['','','']],note:'ارسم منحنى التسخين (الحرارة مقابل الزمن)، وحدّد عليه مرحلتي الانصهار والغليان.'})
});
const L=new Lab(sec,{target:V(.2,.95,.4),dist:a=>Math.max(4.8,7.6/a),exposure:.92});buildRoom(L);
const toast=m=>L.toast(m);
/* hot plate */
const hp=new THREE.Group();{const b=new THREE.Mesh(RBox(1.3,.24,1.1,.05),KIT.phys(0xeeeeec,{roughness:.35}));b.position.y=.12;const top=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.03,48),KIT.mat(0x30363c,{metalness:.5,roughness:.4}));top.position.y=.255;
  const kb=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.06,20),KIT.mat(0x222222));kb.rotation.x=Math.PI/2;kb.position.set(-.35,.12,.56);hp.add(b,top,kb);castAll(hp);}
hp.position.set(0,0,.4);L.add(hp);
const coilM=new THREE.MeshStandardMaterial({color:0x3a1a12,emissive:0x000000,roughness:.6});const coil=new THREE.Mesh(new THREE.TorusGeometry(.3,.025,8,48),coilM);coil.rotation.x=Math.PI/2;coil.position.set(0,.272,.4);L.add(coil);
const led=new THREE.Mesh(new THREE.SphereGeometry(.03,10,8),new THREE.MeshBasicMaterial({color:0x330000}));led.position.set(.35,.13,.95);L.add(led);
/* beaker */
const B=X.vessel(.42,.95,{level:0,grad:500});B.g.position.set(0,.27,.4);L.add(B.g);
const ICE=[];const iceM=new THREE.MeshPhysicalMaterial({color:0xcfe9f7,roughness:.12,clearcoat:1,transparent:true,opacity:.62,envMapIntensity:.9});iceM.userData.keepEnv=1;
for(let i=0;i<10;i++){const c=new THREE.Mesh(RBox(.2,.2,.2,.04),iceM);const a=i*2.1,r=i<6?.2:.09;c.userData={x:Math.cos(a)*r,z:Math.sin(a)*r,ry:Math.random()*3,lay:i<6?0:1};c.rotation.set(Math.random()*.4,c.userData.ry,Math.random()*.4);L.add(c);ICE.push(c);}
const bub=Bubbles(160,{op:.7});L.scene.add(bub.mesh);const steam=X.steam(L,50);
/* thermometer probe on stand */
const st=KIT.stand(2.2);st.position.set(.75,0,.15);L.add(st);const cl=KIT.clamp(.75,1.75);st.add(cl);
const probe=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,1.35,12),M.steel);probe.position.set(.27,1.0,.55);probe.rotation.z=.1;L.add(probe);
const lcd=KIT.lcd(.62,.24,'#ffd27a','#1a1408');lcd.m.position.set(.95,1.95,.25);L.add(lcd.m);
const lcdBox=new THREE.Mesh(RBox(.74,.34,.08,.03),KIT.mat(0x2b3036));lcdBox.position.set(.95,1.95,.2);L.add(lcdBox);
/* physics */
function step(dt){let Q=S.P*dt;
  if(S.ice>0&&S.T<0){const need=(0-S.T)*(S.ice*CI+S.wat*CW);if(Q<need){S.T+=Q/(S.ice*CI+S.wat*CW);return;}Q-=need;S.T=0;}
  if(S.ice>0){const melt=Math.min(S.ice,Q/LF);S.ice-=melt;S.wat+=melt;Q-=melt*LF;if(S.ice>1e-6)return;S.ice=0;}
  if(S.T<100){const need=(100-S.T)*S.wat*CW;if(Q<need){S.T+=Q/(S.wat*CW);return;}Q-=need;S.T=100;}
  const ev=Math.min(S.wat,Q/LV);S.wat-=ev;S.vap+=ev;}
function state(){if(S.ice>0&&S.T<0)return 'صلب';if(S.ice>0)return 'صلب + سائل (انصهار)';if(S.T<99.95)return 'سائل';return 'سائل + غاز (غليان)';}
let acc=0,nbT=0,lastMin=-1;
function visuals(){const A=Math.PI*B.r*B.r,lw=S.wat/A,fl=lw>.06,tot=fl?(S.wat+S.ice)/A:lw;B.set(Math.max(0,tot));
  const frac=S.ice/M0,surfY=.27+B.y0+tot,lvl=lw;
  ICE.forEach((c,i)=>{const s=Math.cbrt(Math.max(0,frac-(i%3)*.02))*1;c.visible=s>.08;c.scale.setScalar(Math.max(.01,s));const y=fl?surfY-.06*s:.27+B.y0+.1*s+c.userData.lay*.18*s;
    c.position.set(c.userData.x,y,.4+c.userData.z);});
  const h=S.on?Math.min(1,S.P/300):0;coilM.emissive.setRGB(.9*h,.22*h,.05*h);led.material.color.set(S.on?0xff2a1a:0x330000);
  X.txt(sec,'hTm',X.fmtT(S.t));X.txt(sec,'hT',S.T.toFixed(1)+' °C');X.txt(sec,'hSt',state());lcd.set(S.T.toFixed(1)+'°C');}
P3.loop(L,(dt,tt)=>{if(S.on&&!S.ended){const sdt=dt*S.ts;const n=Math.ceil(sdt/.5);for(let i=0;i<n;i++)step(sdt/n);S.t+=sdt;
    if(Math.floor(S.t/30)>Math.floor((S.t-sdt)/30))S.pts.push([+(S.t/60).toFixed(2),+S.T.toFixed(1)]);
    const mn=Math.floor(S.t/60);if(mn!==lastMin){lastMin=mn;S.rows.push([mn,S.T,state()]);}
    if(!S.mPhase.melt&&S.ice>0&&S.T>=0){S.mPhase.melt=true;toast('بدأ الانصهار: لاحظ ثبات درجة الحرارة عند 0°C رغم استمرار التسخين.');L.focus(V(.6,1.6,3.3),V(0,.6,.4),1000);render();}
    if(!S.mPhase.boil&&S.T>=99.95){S.mPhase.boil=true;toast('بدأ الغليان: تثبت درجة الحرارة عند 100°C والفقاعات تحمل بخار الماء.');render();}
    if(S.vap>.03&&!S.ended){S.ended=true;S.on=false;P3.good();toast('اكتمل المنحنى. لاحظ الجزأين الأفقيين في الرسم البياني.');sync();render();}
    nbT+=dt;if(nbT>.35){nbT=0;renderNB();}}
  const hot=S.ice<=0&&S.T>70;if(hot){const rate=S.T>=99.9?90:(S.T-70)*1.4;acc+=dt*rate;while(acc>1){acc--;const a=Math.random()*6.28,r=Math.random()*(B.r-.04);const top=.27+B.y0+B.lq.scale.y;
      bub.spawn(Math.cos(a)*r,.27+B.y0+.02,.4+Math.sin(a)*r,S.T>=99.9?.012+Math.random()*.03:.006+Math.random()*.01,top-.01,S.T>=99.9?.5:.25);}}
  bub.update(dt,tt);if(S.T>85&&S.ice<=0&&Math.random()<dt*(S.T>=99.9?22:5)){const top=.27+B.y0+B.lq.scale.y;steam.emit(V((Math.random()-.5)*.4,top+.05,.4),.3,.45,.45,S.T>=99.9?.32:.14);}steam.tick(dt);
  visuals();});
function go(b){if(S.ended){toast('أعد التجربة لتبدأ من جديد.');return;}S.on=!S.on;sync();render();if(S.on)P3.click();}
function setP(v){if(S.on||S.t>0){toast('غيّر القدرة قبل بدء التسخين.');return;}S.P=v;sec.$$('[data-a="p"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));}
function setTs(v){S.ts=v;sec.$$('[data-a="ts"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));}
function reset(){Object.assign(S,{on:false,t:0,T:-10,ice:M0,wat:0,vap:0,pts:[[0,-10]],rows:[],ended:false,mPhase:{melt:false,boil:false}});lastMin=-1;bub.clear();L.home(700);sync();render();renderNB();visuals();}
function stepIdx(){if(!S.on&&S.t===0)return 0;if(S.ice>0||S.T<99.9&&!S.mPhase.boil)return S.mPhase.melt?1:0;if(!S.ended)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='شغّل السخان';html=`<p class="p3-txt">اختر قدرة السخان وتسريع الزمن، ثم شغّل السخان. يُرسم المنحنى تلقائيًا في دفتر المختبر وتُسجّل القراءة كل دقيقة.</p>`;}
  else if(k===1){title='راقب الانصهار';html=`<p class="p3-txt">الجليد ينصهر ودرجة الحرارة <b>ثابتة عند 0°C</b>. أين تذهب طاقة السخان الآن؟</p>`;}
  else if(k===2){title='راقب الغليان';html=`<p class="p3-txt">الماء يغلي وتظهر فقاعات كبيرة من القاع، ودرجة الحرارة <b>ثابتة عند 100°C</b>.</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">ترتفع درجة الحرارة عند تسخين حالة واحدة، وتثبت أثناء تغيّر الحالة (الانصهار عند 0°C والغليان عند 100°C) لأن الطاقة تُستهلك في تغيير الحالة لا في رفع الحرارة.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){const rs=S.rows.slice(-6);sec.$('.p3-nb').innerHTML=KIT.chart({w:330,h:200,xl:'الزمن (دقيقة)',yl:'درجة الحرارة (°C)',xmin:0,xmax:Math.max(4,Math.ceil(S.t/60)),ymin:-50,ymax:150,series:[{c:'#d0432b',name:'الحرارة',pts:S.pts}]})+
  `<table class="p3-t"><thead><tr><th>الدقيقة</th><th>الحرارة</th><th>الحالة</th></tr></thead><tbody>${rs.length?rs.map(r=>`<tr><td class="n">${r[0]}</td><td class="n">${r[1].toFixed(1)}°</td><td>${r[2]}</td></tr>`).join(''):'<tr><td colspan="3">—</td></tr>'}</tbody></table>`;}
function sync(){const b=sec.$('[data-a="go"]');b.textContent=S.on?'⏸ أوقف السخان':(S.t>0&&!S.ended?'🔥 تابع التسخين':'🔥 شغّل السخان');b.setAttribute('aria-pressed',S.on);}
X.side(sec,{go,p:b=>setP(+b.dataset.v),ts:b=>setTs(+b.dataset.v),reset});
visuals();sync();render();renderNB();
};

/* =====================================================================
   ٥) قاعدة أرخميدس وقوة الطفو (ثاني متوسط · سلوك الموائع)
   ===================================================================== */
const BUOY={};EXP_MODS.buoy8=BUOY;
BUOY.init=function(){gm();
const VOL=100e-6,g=9.8;
const BLK={al:{n:'ألومنيوم',rho:2700,col:0xc5ccd2},cu:{n:'نحاس',rho:8960,col:0xc8794a}},LIQ={w:{n:'ماء',rho:1000,col:0xbfe2f0,op:.42},s:{n:'ماء مالح',rho:1200,col:0xd8ecf0,op:.5},o:{n:'زيت',rho:800,col:0xe8c35a,op:.7}};
const S={b:'al',l:'w',dep:0,tgt:0,col:0,log:[],busy:false};P3.dbg.buoy8=S;
const NAMES=['قِس الوزن في الهواء','اغمر الجسم','قارن القوى','غيّر السائل'];
const sec=P3.section('buoy8',{title:'قاعدة أرخميدس وقوة الطفو',grade:'ثاني متوسط',lesson:'سلوك الموائع',
  hud:`<div class="p3-row">${X.m('قراءة الميزان النابضي','bF')}${X.m('قوة الطفو','bB',1)}</div><div class="p3-row">${X.m('كتلة السائل المزاح','bM')}${X.m('وزن السائل المزاح','bW',1)}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">الجسم:</span>${Object.entries(BLK).map(([k,b])=>`<button class="p3-b" data-a="b" data-v="${k}">${b.n} (100 cm³)</button>`).join('')}</div>
    <div class="p3-acts"><span class="p3-lab">السائل:</span>${Object.entries(LIQ).map(([k,l])=>`<button class="p3-b" data-a="l" data-v="${k}">${l.n}</button>`).join('')}</div>
    ${X.rng('مقدار الغمر','bD',0,100,5,0,'%')}
    <div class="p3-acts"><button class="p3-b" data-a="full">⬇ اغمره كاملًا</button><button class="p3-b pri" data-a="rec">📋 سجّل القراءات</button><button class="p3-b" data-a="reset">↺ إعادة الملء</button></div></div>`,
  learn:`<div class="panel"><h3>قاعدة أرخميدس</h3><p>الجسم المغمور كليًا أو جزئيًا في مائع يتأثر بقوة دفع إلى أعلى تسمى <b>قوة الطفو</b>، تساوي <b>وزن المائع الذي يزيحه الجسم</b>.</p><p class="p3-eq">قوة الطفو = الوزن في الهواء − الوزن الظاهري = وزن السائل المزاح</p></div>
    <div class="panel"><h3>ما الذي يغيّر قوة الطفو؟</h3><p>تزداد قوة الطفو بزيادة <b>حجم الجزء المغمور</b> وبزيادة <b>كثافة السائل</b>. ولا تعتمد على مادة الجسم إذا تساوى الحجم.</p></div>`,
  quiz:[{q:'قوة الطفو المؤثرة في جسم مغمور تساوي:',o:['وزن الجسم في الهواء','وزن السائل الذي يزيحه الجسم','كتلة الجسم'],a:1},{q:'جسمان لهما الحجم نفسه أحدهما ألومنيوم والآخر نحاس غُمرا كليًا في الماء. قوة الطفو:',o:['أكبر على النحاس','متساوية','أكبر على الألومنيوم'],a:1},
        {q:'أي السوائل يعطي أكبر قوة طفو للجسم نفسه؟',o:['الزيت','الماء','الماء المالح'],a:2},{q:'وزن جسم في الهواء 2.6 N وظاهريًا في الماء 1.6 N. قوة الطفو:',o:['1.0 N','4.2 N','2.6 N'],a:0}],
  report:()=>({title:'قاعدة أرخميدس وقوة الطفو',grade:'ثاني متوسط',lesson:'سلوك الموائع',cols:['الجسم','السائل','الوزن في الهواء (N)','الوزن الظاهري (N)','قوة الطفو (N)','وزن السائل المزاح (N)'],
    rows:S.log.length?S.log.map(r=>[r.b,r.l,r.W.toFixed(2),r.F.toFixed(2),r.B.toFixed(2),r.Wd.toFixed(2)]):[['','','','','','']],note:'قارن قوة الطفو بوزن السائل المزاح في كل محاولة. ماذا تستنتج؟'})
});
const L=new Lab(sec,{target:V(0,1.3,.4),dist:a=>Math.max(4.6,7.2/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* stand + spring balance */
const PX=-.35;const stand=KIT.stand(3.0);stand.position.set(PX+.35,0,-.3);L.add(stand);
const arm=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.9,10),M.steel);arm.rotation.x=Math.PI/2;arm.position.set(PX,2.85,-.02);L.add(arm);const sb=new THREE.Group();sb.position.set(PX,2.82,.4);L.add(sb);
const body=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.9,24,1,true),G.glassT);body.position.y=-.5;sb.add(body);
const cap=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.05,24),KIT.mat(0xe0703f));cap.position.y=-.04;sb.add(cap);
const cap2=cap.clone();cap2.position.y=-.96;sb.add(cap2);
const scaleT=canvasTex(128,640,c=>{c.fillStyle='#fffbe8';c.fillRect(0,0,128,640);c.fillStyle='#10302c';c.strokeStyle='#10302c';c.font='bold 30px "IBM Plex Mono",monospace';
  for(let i=0;i<=10;i++){const y=30+i*58;c.lineWidth=4;c.beginPath();c.moveTo(70,y);c.lineTo(122,y);c.stroke();c.fillText(i,18,y+10);if(i<10)for(let j=1;j<5;j++){const yy=y+j*11.6;c.lineWidth=2;c.beginPath();c.moveTo(96,yy);c.lineTo(122,yy);c.stroke();}}
  c.font='bold 26px sans-serif';c.fillText('N',90,632);});
const plate=new THREE.Mesh(new THREE.PlaneGeometry(.11,.82),new THREE.MeshStandardMaterial({map:scaleT,roughness:.6}));plate.position.set(0,-.5,.076);sb.add(plate);
const spring=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({length:120},(_,i)=>V(Math.cos(i*.9)*.04,-i/119,Math.sin(i*.9)*.04))),240,.006,6),M.steel);spring.position.y=-.07;sb.add(spring);
const ptr=new THREE.Mesh(new THREE.BoxGeometry(.13,.012,.02),KIT.mat(0xd0302a));sb.add(ptr);
const rodH=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.5,8),M.steel);sb.add(rodH);
const hook=new THREE.Mesh(new THREE.TorusGeometry(.025,.006,8,16,Math.PI*1.5),M.steel);sb.add(hook);
/* string + block */
const str=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,1,6),KIT.mat(0x222222));L.add(str);
const BR=.16,BH=.3;const blkM=KIT.mat(BLK.al.col,{metalness:.8,roughness:.32});const blk=new THREE.Mesh(new THREE.CylinderGeometry(BR,BR,BH,32),blkM);castAll(blk);L.add(blk);
const eye=new THREE.Mesh(new THREE.TorusGeometry(.03,.008,8,16),M.steel);L.add(eye);
/* overflow can */
const CX=PX,CR=.36,CH=.95,can=X.vessel(CR,CH,{level:.86,col:0xbfe2f0});can.g.position.set(CX,0,.4);L.add(can.g);
const spout=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.42,14,1,true),G.glassT);spout.rotation.z=Math.PI/2+.35;spout.position.set(CX+CR+.17,.86,.4);L.add(spout);
/* catch beaker on balance */
const bal=new THREE.Group();{const b=new THREE.Mesh(RBox(.82,.14,.72,.03),KIT.phys(0xf0f0ee,{roughness:.35}));b.position.y=.07;const pan=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.02,32),M.steel);pan.position.y=.15;bal.add(b,pan);castAll(bal);}
bal.position.set(CX+CR+.6,0,.5);L.add(bal);const bl=KIT.lcd(.4,.13);bl.m.position.set(CX+CR+.6,.09,.87);bl.m.rotation.x=-.4;L.add(bl.m);
const cb=X.vessel(.3,.48,{level:0});cb.g.position.set(CX+CR+.6,.16,.5);L.add(cb.g);
/* stream particles */
const NS=60,sp=new Float32Array(NS*3),sd=Array.from({length:NS},()=>({t:Math.random(),on:false}));const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
const sm=new THREE.PointsMaterial({color:0x8cc8e8,size:.045,transparent:true,opacity:.9,depthWrite:false});const stream=new THREE.Points(sg,sm);stream.frustumCulled=false;L.scene.add(stream);let flow=0;
/* physics */
const W=()=>BLK[S.b].rho*VOL*g;const sub=()=>S.dep/100;const Fb=()=>LIQ[S.l].rho*g*VOL*sub();
const baseLvl=.86,canA=Math.PI*CR*CR;
function layout(){const F=W()-Fb();const ext=.058+F*.0743;spring.scale.y=ext;ptr.position.set(0,-.07-ext,.08);rodH.position.y=-.07-ext-.25;hook.position.y=-.07-ext-.52;
  const hookY=2.82-.07-ext-.53;const top=can.y0+baseLvl;const blockBottom0=top+.02;
  const dy=S.dep/100*BH;const by=blockBottom0-dy+BH/2;blk.position.set(PX,by,.4);eye.position.set(PX,by+BH/2+.03,.4);
  const sl=hookY-(by+BH/2+.05);str.scale.y=Math.max(.01,sl);str.position.set(PX,by+BH/2+.05+sl/2,.4);
  const vMax=S.col/LIQ[S.l].rho;const vNow=VOL*sub();const lvl=baseLvl-(vMax-vNow)*1000/canA;can.set(lvl);
  cb.set(Math.min(.44,vMax*1000/(Math.PI*cb.r*cb.r)));
  X.txt(sec,'bF',F.toFixed(2)+' N');X.txt(sec,'bB',Fb().toFixed(2)+' N');X.txt(sec,'bM',(S.col*1000).toFixed(0)+' g');X.txt(sec,'bW',(S.col*g).toFixed(2)+' N');bl.set((S.col*1000).toFixed(1)+' g');}
P3.loop(L,(dt)=>{if(Math.abs(S.dep-S.tgt)>.01){const d=S.tgt-S.dep;S.dep+=Math.sign(d)*Math.min(Math.abs(d),dt*35);
    const m=LIQ[S.l].rho*VOL*sub();if(m>S.col+1e-7){flow=1;S.col=m;}}else flow=Math.max(0,flow-dt*1.5);
  const o=V(CX+CR+.36,.78,.4);for(let i=0;i<NS;i++){const q=sd[i];q.t+=dt*1.6;if(q.t>1){q.t=0;q.on=flow>.05;}const t=q.t;sp[i*3]=o.x+.12*t+ (q.on?0:99);sp[i*3+1]=o.y-.55*t*t-.05*t;sp[i*3+2]=o.z+.08*t+(Math.sin(i)*.01);}
  sg.attributes.position.needsUpdate=true;sm.opacity=Math.min(.9,flow);layout();});
function setB(k){if(S.dep>0){toast('ارفع الجسم من السائل أولًا (اجعل مقدار الغمر 0%).');return;}S.b=k;setCol(blkM,BLK[k].col);sec.$$('[data-a="b"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===k));render();}
function setL(k){S.l=k;S.dep=0;S.tgt=0;S.col=0;sec.$('#bD').value=0;sec.$('#bD-o').textContent='0%';setCol(can.lm,LIQ[k].col);can.lm.opacity=LIQ[k].op;setCol(cb.lm,LIQ[k].col);cb.lm.opacity=LIQ[k].op;sec.$$('[data-a="l"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===k));render();toast('مُلئ وعاء الإزاحة بـ'+LIQ[k].n+' حتى فتحة الصنبور، وأُفرغت الكأس.');}
function dep(v){S.tgt=v;sec.$('#bD').value=v;sec.$('#bD-o').textContent=v+'%';render();}
function rec(){if(S.dep<99){toast('اغمر الجسم كاملًا قبل التسجيل.');return;}const r={b:BLK[S.b].n,l:LIQ[S.l].n,W:W(),F:W()-Fb(),B:Fb(),Wd:S.col*g};const k=S.log.findIndex(x=>x.b===r.b&&x.l===r.l);if(k>=0)S.log[k]=r;else S.log.push(r);P3.good();toast('سُجّلت المحاولة: قوة الطفو = وزن السائل المزاح = '+r.B.toFixed(2)+' N');renderNB();render();}
function reset(){setL(S.l);L.home(700);}
function stepIdx(){if(S.tgt===0&&!S.log.length)return 0;if(!S.log.length)return 1;if(new Set(S.log.map(r=>r.l)).size<2)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='قِس الوزن في الهواء';html=`<p class="p3-txt">الجسم معلّق في الميزان النابضي خارج السائل. قراءة الميزان الآن = <b>وزنه في الهواء</b> (${W().toFixed(2)} N). حرّك شريط «مقدار الغمر» ببطء.</p>`;}
  else if(k===1){title='اغمر الجسم';html=`<p class="p3-txt">كلما زاد الجزء المغمور قلّت قراءة الميزان وانسكب سائل أكثر في الكأس. اغمره كاملًا ثم سجّل.</p>`;}
  else if(k===2){title='قارن القوى';html=`<p class="p3-txt">لاحظ أن <b>قوة الطفو</b> (الوزن في الهواء − الوزن الظاهري) تساوي <b>وزن السائل المزاح</b>. جرّب سائلًا آخر.</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">قوة الطفو تساوي وزن السائل المزاح (قاعدة أرخميدس)، وتزداد بزيادة كثافة السائل، ولا تتغير بتغيّر مادة الجسم إذا كان حجمه ثابتًا.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>الجسم</th><th>السائل</th><th>الهواء</th><th>الظاهري</th><th>الطفو</th><th>المزاح</th></tr></thead><tbody>${S.log.length?S.log.map(r=>`<tr><td>${r.b}</td><td>${r.l}</td><td class="n">${r.W.toFixed(2)}</td><td class="n">${r.F.toFixed(2)}</td><td class="n">${r.B.toFixed(2)}</td><td class="n">${r.Wd.toFixed(2)}</td></tr>`).join(''):'<tr><td colspan="6">—</td></tr>'}</tbody></table><p class="x-note">القوى بوحدة نيوتن (N).</p>`;}
X.side(sec,{b:b=>setB(b.dataset.v),l:b=>setL(b.dataset.v),full:()=>dep(100),rec,reset});
sec.$('#bD').addEventListener('input',e=>dep(+e.target.value));
sec.$$('[data-a="b"]')[0].setAttribute('aria-pressed',true);sec.$$('[data-a="l"]')[0].setAttribute('aria-pressed',true);layout();render();renderNB();
};

/* =====================================================================
   ٦) تحولات الطاقة في البندول (ثاني متوسط · تحولات الطاقة)
   ===================================================================== */
const PEND={};EXP_MODS.pend8=PEND;
PEND.init=function(){gm();
const Lp=1.6,gg=9.8;
const S={a0:40,th:0,w:0,run:false,pause:false,m:.2,drag:false,log:[],strobe:true,dragUsed:false};P3.dbg.pend8=S;
const NAMES=['اختر زاوية الإطلاق','أطلق الكرة','سجّل عند ثلاثة مواضع','أضف مقاومة الهواء','استنتج'];
const sec=P3.section('pend8',{title:'تحولات الطاقة في البندول',grade:'ثاني متوسط',lesson:'تحولات الطاقة',
  hud:`<div class="p3-row">${X.m('الارتفاع','pH')}${X.m('السرعة','pV',1)}</div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    ${X.rng('زاوية الإطلاق','pA',10,60,5,40,'°')}
    <div class="p3-acts"><span class="p3-lab">الكتلة:</span><button class="p3-b" data-a="m" data-v="0.2" aria-pressed="true">0.2 kg</button><button class="p3-b" data-a="m" data-v="0.4">0.4 kg</button></div>
    <div class="p3-acts"><button class="p3-b pri" data-a="go">▶ أطلق الكرة</button><button class="p3-b" data-a="pause">⏸ إيقاف مؤقت</button><button class="p3-b" data-a="rec">📋 سجّل هذه اللحظة</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="drag" aria-pressed="false">💨 مقاومة الهواء</button><button class="p3-b" data-a="strobe" aria-pressed="true">📸 تصوير متعدد الومضات</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>الطاقة الميكانيكية</h3><p><b>طاقة الوضع</b> (الكامنة) تعتمد على الارتفاع: ط و = ك × ج × ف. <b>الطاقة الحركية</b> تعتمد على السرعة: ط ح = ½ ك ع².</p>
    <p>في البندول تتحوّل طاقة الوضع إلى طاقة حركية عند النزول، ثم تعود طاقة وضع عند الصعود. ومجموعهما (<b>الطاقة الميكانيكية</b>) ثابت إذا أهملنا الاحتكاك.</p></div>
    <div class="panel"><h3>قانون حفظ الطاقة</h3><p>الطاقة لا تفنى ولا تُستحدث من العدم، بل تتحول من شكل إلى آخر. مع مقاومة الهواء تتحول بعض الطاقة الميكانيكية إلى طاقة حرارية فيتناقص ارتفاع التأرجح تدريجيًا.</p></div>`,
  quiz:[{q:'أين تكون الطاقة الحركية للبندول أكبر ما يمكن؟',o:['عند أعلى نقطة','عند أدنى نقطة','في منتصف الصعود'],a:1},{q:'أين تكون طاقة الوضع أكبر ما يمكن؟',o:['عند أعلى نقطة','عند أدنى نقطة','لا تتغير'],a:0},
        {q:'بإهمال الاحتكاك، الطاقة الميكانيكية للبندول:',o:['تزداد','تتناقص','تبقى ثابتة'],a:2},{q:'لماذا يتوقف البندول الحقيقي بعد فترة؟',o:['لأن الطاقة تفنى','لأن جزءًا من الطاقة يتحول إلى حرارة بسبب الاحتكاك ومقاومة الهواء','لأن كتلته تقل'],a:1}],
  report:()=>({title:'تحولات الطاقة في البندول',grade:'ثاني متوسط',lesson:'تحولات الطاقة',cols:['#','الارتفاع (m)','السرعة (m/s)','طاقة الوضع (J)','الطاقة الحركية (J)','الطاقة الميكانيكية (J)'],
    rows:S.log.length?S.log.map((r,i)=>[String(i+1),r.h.toFixed(2),r.v.toFixed(2),r.pe.toFixed(2),r.ke.toFixed(2),(r.pe+r.ke).toFixed(2)]):[['1','','','','','']],note:'قارن مجموع الطاقتين في المواضع المختلفة. ماذا تستنتج؟'})
});
const L=new Lab(sec,{target:V(0,1.3,.4),dist:a=>Math.max(5.2,8/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
const PV=V(0,3.05,.4);
const fr=new THREE.Group();{const sm=KIT.mat(0x2b3036,{metalness:.4});[-1.5,1.5].forEach(x=>{const b=new THREE.Mesh(RBox(.5,.07,.6,.02),sm);b.position.set(x,.035,.4);const r=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,3.1,12),M.steel);r.position.set(x,1.58,.4);fr.add(b,r);});
  const top=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,3.06,12),M.steel);top.rotation.z=Math.PI/2;top.position.set(0,3.12,.4);fr.add(top);castAll(fr);}
L.add(fr);
const piv=new THREE.Mesh(new THREE.SphereGeometry(.05,16,12),KIT.mat(0x222222));piv.position.copy(PV);L.add(piv);
const str=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,1,6),KIT.mat(0xe8e2d0));L.add(str);
const bobM=KIT.mat(0xc49a3a,{metalness:.85,roughness:.28});const bob=new THREE.Mesh(new THREE.SphereGeometry(.13,32,24),bobM);castAll(bob);L.add(bob);
/* height ruler */
const rt=canvasTex(128,512,c=>{c.fillStyle='#fffbe8';c.fillRect(0,0,128,512);c.fillStyle='#10302c';c.strokeStyle='#10302c';c.font='bold 26px "IBM Plex Mono",monospace';
  for(let i=0;i<=10;i++){const y=496-i*48;c.lineWidth=3;c.beginPath();c.moveTo(0,y);c.lineTo(i%5?40:70,y);c.stroke();if(!(i%2))c.fillText((i*.1).toFixed(1),74,y+9);}});
const ruler=new THREE.Mesh(new THREE.PlaneGeometry(.22,1.0667),new THREE.MeshStandardMaterial({map:rt,roughness:.7}));ruler.position.set(1.25,PV.y-Lp-.13-.0333+.5333,.1);L.add(ruler);
const hLine=new THREE.Mesh(new THREE.BoxGeometry(2.6,.006,.006),new THREE.MeshBasicMaterial({color:0xe0703f,transparent:true,opacity:.7}));L.add(hLine);
/* strobe ghosts */
const GN=14,ghosts=[];for(let i=0;i<GN;i++){const m=new THREE.MeshStandardMaterial({color:$lc(0xc49a3a),metalness:.6,roughness:.3,transparent:true,opacity:0,depthWrite:false});const s=new THREE.Mesh(new THREE.SphereGeometry(.13,20,14),m);s.visible=false;L.scene.add(s);ghosts.push({s,m,t:9});}
let gi=0,gT=0;
/* energy bars overlay */
const ov=X.ov(sec,'الطاقة (جول)',230,150);
function bars(pe,ke){const {x,w,h}=ov;x.clearRect(0,0,w,h);const E0=S.m*gg*Lp*(1-Math.cos(60*Math.PI/180));const sc=(h-34)/Math.max(.01,E0);
  const B=[['الوضع',pe,'#4f8bff'],['الحركية',ke,'#ff8a3d'],['الميكانيكية',pe+ke,'#3ecf8e']];
  B.forEach(([n,v,c],i)=>{const bx=12+i*74,bh=Math.max(0,v*sc);x.fillStyle='rgba(255,255,255,.08)';x.fillRect(bx,6,52,h-34);x.fillStyle=c;x.fillRect(bx,h-28-bh,52,bh);
    x.fillStyle='#fff';x.font='700 11px "IBM Plex Mono",monospace';x.textAlign='center';x.fillText(v.toFixed(2),bx+26,h-32-bh-2<14?14:h-32-bh-2);x.fillStyle='#cfe';x.font='700 10px "IBM Plex Sans Arabic",sans-serif';x.fillText(n,bx+26,h-12);});}
function energy(){const h=Lp*(1-Math.cos(S.th)),v=Math.abs(S.w)*Lp;return {h,v,pe:S.m*gg*h,ke:.5*S.m*v*v};}
function place(){const x=PV.x+Lp*Math.sin(S.th),y=PV.y-Lp*Math.cos(S.th);bob.position.set(x,y,.4);str.position.set((PV.x+x)/2,(PV.y+y)/2,.4);str.scale.y=Lp-.12;str.rotation.z=S.th;
  const e=energy();hLine.position.set(0,y-.13+.0,.12);X.txt(sec,'pH',e.h.toFixed(2)+' m');X.txt(sec,'pV',e.v.toFixed(2)+' m/s');bars(e.pe,e.ke);}
const acc=(th,w)=>-(gg/Lp)*Math.sin(th)-(S.drag?.22*w:0);
P3.loop(L,(dt)=>{if(S.run&&!S.pause){const n=8,h=dt/n;for(let i=0;i<n;i++){const k1t=S.w,k1w=acc(S.th,S.w),k2t=S.w+h/2*k1w,k2w=acc(S.th+h/2*k1t,S.w+h/2*k1w),k3t=S.w+h/2*k2w,k3w=acc(S.th+h/2*k2t,S.w+h/2*k2w),k4t=S.w+h*k3w,k4w=acc(S.th+h*k3t,S.w+h*k3w);
      S.th+=h/6*(k1t+2*k2t+2*k3t+k4t);S.w+=h/6*(k1w+2*k2w+2*k3w+k4w);}
    if(S.strobe){gT+=dt;if(gT>.11){gT=0;const q=ghosts[gi++%GN];q.s.position.copy(bob.position);q.t=0;q.s.visible=true;}}}
  ghosts.forEach(q=>{if(q.t>1.4){q.s.visible=false;return;}q.t+=dt;q.m.opacity=.35*(1-q.t/1.4);});place();});
function setA(v){if(S.run)return;S.a0=v;S.th=v*Math.PI/180;S.w=0;sec.$('#pA-o').textContent=v+'°';place();}
function go(){if(S.run){S.run=false;S.th=S.a0*Math.PI/180;S.w=0;place();sync();render();return;}S.run=true;S.pause=false;P3.click();sync();render();}
function pause(){if(!S.run)return;S.pause=!S.pause;sync();}
function rec(){const e=energy();S.log.push({h:e.h,v:e.v,pe:e.pe,ke:e.ke,drag:S.drag});P3.click();toast(`سُجّل: ط و = ${e.pe.toFixed(2)} J ، ط ح = ${e.ke.toFixed(2)} J ، المجموع = ${(e.pe+e.ke).toFixed(2)} J`);renderNB();render();}
function setM(v){if(S.run){toast('أوقف البندول أولًا.');return;}S.m=v;bob.scale.setScalar(v>.3?1.22:1);sec.$$('[data-a="m"]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v));place();}
function drag(b){S.drag=!S.drag;if(S.drag)S.dragUsed=true;b.setAttribute('aria-pressed',S.drag);toast(S.drag?'مقاومة الهواء مفعّلة: راقب عمود الطاقة الميكانيكية.':'أُلغيت مقاومة الهواء.');render();}
function strobe(b){S.strobe=!S.strobe;b.setAttribute('aria-pressed',S.strobe);}
function reset(){S.run=false;S.pause=false;S.log=[];S.drag=false;S.dragUsed=false;sec.$('[data-a="drag"]').setAttribute('aria-pressed',false);setA(S.a0);sync();render();renderNB();}
function stepIdx(){if(!S.run&&!S.log.length)return 0;if(!S.log.length)return 1;if(S.log.filter(r=>!r.drag).length<3)return 2;if(!S.dragUsed)return 3;return 4;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='اختر زاوية الإطلاق';html=`<p class="p3-txt">حرّك شريط الزاوية لترفع الكرة. كلما زادت الزاوية زاد ارتفاعها فزادت <b>طاقة الوضع</b>. ثم أطلقها.</p>`;}
  else if(k===1){title='راقب تحوّل الطاقة';html=`<p class="p3-txt">راقب أعمدة الطاقة: عند النزول يقصر عمود الوضع ويطول عمود الحركية، والعمود الأخضر (المجموع) ثابت.</p>`;}
  else if(k===2){title='سجّل عند ثلاثة مواضع';html=`<p class="p3-txt">استعمل ⏸ أو 🐢 وسجّل عند <b>أعلى نقطة</b> و<b>أدنى نقطة</b> و<b>منتصف المسار</b> (${S.log.filter(r=>!r.drag).length} / 3).</p>`;}
  else if(k===3){title='أضف مقاومة الهواء';html=`<p class="p3-txt">فعّل «مقاومة الهواء» وراقب ارتفاع التأرجح والعمود الأخضر.</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">تتحول طاقة الوضع إلى طاقة حركية والعكس، ويبقى مجموعهما ثابتًا دون احتكاك (حفظ الطاقة). ومع مقاومة الهواء تتحول تدريجيًا إلى طاقة حرارية فيقلّ ارتفاع التأرجح.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>#</th><th>ف (m)</th><th>ع (m/s)</th><th>ط و</th><th>ط ح</th><th>المجموع</th></tr></thead><tbody>${S.log.length?S.log.map((r,i)=>`<tr><td>${i+1}${r.drag?'💨':''}</td><td class="n">${r.h.toFixed(2)}</td><td class="n">${r.v.toFixed(2)}</td><td class="n">${r.pe.toFixed(2)}</td><td class="n">${r.ke.toFixed(2)}</td><td class="n"><b>${(r.pe+r.ke).toFixed(2)}</b></td></tr>`).join(''):'<tr><td colspan="6">—</td></tr>'}</tbody></table><p class="x-note">الطاقة بوحدة الجول (J). 💨 = مع مقاومة الهواء.</p>`;}
function sync(){sec.$('[data-a="go"]').textContent=S.run?'⏹ أوقف وأعد الكرة':'▶ أطلق الكرة';sec.$('[data-a="pause"]').textContent=S.pause?'▶ تابع':'⏸ إيقاف مؤقت';sec.$('[data-a="pause"]').disabled=!S.run;sec.$('#pA').disabled=S.run;}
X.side(sec,{go,pause,rec,m:b=>setM(+b.dataset.v),drag,strobe,reset});
sec.$('#pA').addEventListener('input',e=>setA(+e.target.value));
setA(40);sync();render();renderNB();
};

X.reg(['front7','seas7','eco7','heat8','buoy8','pend8']);
})();
