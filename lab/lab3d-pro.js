/* =====================================================================
   المختبر الافتراضي الذكي — تجارب كيمياء ثلاثية الأبعاد (Pro 3D)
   ١) التحليل الكهربائي للماء  ٢) تحضير الغازات والكشف عنها  ٣) الكشف باللهب
   يعتمد على محرك المختبر في index.html: Lab · KIT · buildRoom · reportShell
   إعداد أ. علي البقاشي — مدرسة أبي الدرداء المتوسطة
   ===================================================================== */
(function(){
'use strict';
if(typeof THREE==='undefined'||typeof Lab==='undefined'||typeof EXP_MODS==='undefined')return;

/* ---------------- styles ---------------- */
const CSS=`
.p3 .labbar{padding-block:10px}
.p3-grid{display:grid;grid-template-columns:360px minmax(0,1fr);gap:12px;height:calc(100dvh - 138px);min-height:470px;max-height:900px}
.p3 .p3-stage{height:100%;margin-top:0}
.p3-side{display:flex;flex-direction:column;gap:10px;min-height:0;overflow:auto;padding-inline-end:2px}
.p3-box{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:11px 13px}
.p3-steps{display:flex;gap:4px}
.p3-steps i{flex:1;height:6px;border-radius:4px;background:var(--line)}
.p3-steps i.on{background:var(--accent)}.p3-steps i.past{background:var(--brand)}
.p3-sn{font-size:.76rem;font-weight:700;color:var(--ink-2);margin-top:7px}
.p3-stitle{font-family:var(--f-display);font-weight:700;font-size:1.04rem;margin:2px 0 4px;color:var(--ink)}
.p3-txt{font-size:.9rem;font-weight:600;color:var(--ink-2);line-height:1.75;margin:0}
.p3-txt b{color:var(--ink)}
.p3-eq{direction:ltr;text-align:center;font-family:var(--f-mono);font-weight:600;background:var(--surface-2);border-radius:10px;padding:6px 8px;margin-top:8px;font-size:.88rem;color:var(--ink)}
.p3-ok{background:var(--ok-soft);color:var(--ok);border-radius:10px;padding:7px 10px;margin-top:8px;font-weight:700;font-size:.88rem}
.p3-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;align-items:center}
.p3-acts:first-of-type{margin-top:0}
.p3-lab{font-weight:700;font-size:.78rem;color:var(--ink-2);min-width:52px}
.p3-b{border:2px solid var(--line);background:var(--surface);border-radius:10px;padding:5px 9px;font-weight:700;font-size:.82rem;color:var(--ink);font-family:inherit;cursor:pointer;display:inline-flex;gap:6px;align-items:center;line-height:1.3}
.p3-b:hover:not(:disabled){border-color:var(--brand)}
.p3-b[aria-pressed="true"]{border-color:var(--accent);background:var(--accent-soft)}
.p3-b.pri{background:var(--brand);border-color:var(--brand);color:#fff}
.p3-b.pri[aria-pressed="true"]{background:#b33a2e;border-color:#b33a2e;color:#fff}
.p3-b.done{border-color:var(--ok);background:var(--ok-soft)}
.p3-b:disabled{opacity:.42;cursor:default}
.p3-b .dt{width:12px;height:12px;border-radius:50%;border:1px solid rgb(0 0 0/.25);flex:none}
.p3-h{font-family:var(--f-display);font-size:.92rem;font-weight:700;margin:0 0 6px;color:var(--ink)}
.p3-t{width:100%;min-width:0;border-collapse:collapse;font-size:.82rem}
.p3-t th,.p3-t td{padding:5px 5px;border-bottom:1px solid var(--line);text-align:start;font-weight:600;vertical-align:middle}
.p3-t th{font-size:.74rem;background:var(--surface-2);color:var(--ink-2)}
.p3-t td.n{font-family:var(--f-mono);direction:ltr;text-align:right}
.p3-t select{border:1px solid var(--line);border-radius:8px;padding:3px 4px;font-family:inherit;font-weight:600}
.p3-sw{display:inline-block;width:13px;height:13px;border-radius:4px;vertical-align:-2px;margin-inline-end:5px;border:1px solid rgb(0 0 0/.2)}
.p3-hud{position:absolute;top:10px;left:10px;display:flex;flex-direction:column;gap:7px;align-items:flex-start;pointer-events:none;z-index:2}
.p3-row{display:flex;gap:7px}
.p3-m{background:#0b1a18e8;color:#7ef0c8;border-radius:11px;padding:5px 10px;border:1px solid #234;min-width:100px;text-align:right;box-shadow:0 4px 14px rgb(0 0 0/.25)}
.p3-m small{display:block;color:#b5d4cc;font-size:.7rem;font-weight:700}
.p3-m b{font-family:var(--f-mono);font-size:1.08rem;direction:ltr;display:block;font-weight:600}
.p3-m.warm{color:#ffd27a}
.p3-mol{position:absolute;bottom:62px;left:10px;background:#0b1a18ee;border-radius:12px;border:1px solid #2a4a44;padding:6px;z-index:2}
.p3-mol canvas{display:block;width:300px;height:195px}
.p3 .lbl{font-weight:700}
.p3 .lbl.p3-off{visibility:hidden}
.p3 .lbl.hot{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
.p3 .lbl.gas{background:#10302c;color:#fff;border-color:#10302c}
.p3-rng{display:flex;align-items:center;gap:8px;font-weight:700;font-size:.84rem;flex:1;min-width:180px}
.p3-rng input{flex:1;accent-color:var(--accent)}
.p3-salts{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-top:8px}
.p3-salts .p3-b{justify-content:center;padding:6px 4px;font-family:var(--f-mono);font-size:.82rem}
.p3-fb{font-weight:700;font-size:.82rem;margin-inline-start:6px}.p3-fb.ok{color:var(--ok)}.p3-fb.bad{color:var(--bad)}
@media (max-width:880px){.p3-grid{grid-template-columns:1fr;height:auto;max-height:none}.p3 .p3-stage{height:58vh;order:-1}.p3-side{overflow:visible}.p3-mol canvas{width:210px;height:137px}.p3-m b{font-size:1.05rem}.p3-m{min-width:96px}}
`;
const stEl=document.createElement('style');stEl.textContent=CSS;document.head.appendChild(stEl);

/* ---------------- helpers ---------------- */
const P3={dbg:{}};window.__p3=P3.dbg;
const $lc=h=>new THREE.Color(h).convertSRGBToLinear();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const hex6=h=>'#'+new THREE.Color(h).getHexString();
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const mixHex=(a,b,t)=>new THREE.Color(a).lerp(new THREE.Color(b),t).getHex();
let _glow=null;
P3.glowTex=()=>_glow||(_glow=canvasTex(128,128,(c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.22,'rgba(255,255,255,.6)');g.addColorStop(.55,'rgba(255,255,255,.14)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,w,h);},false));

/* audio */
P3.ac=null;
P3.noise=(d=.25,vol=.5,freq=900,q=1)=>{try{const a=P3.ac=P3.ac||new (window.AudioContext||window.webkitAudioContext)();const n=Math.max(1,a.sampleRate*d|0),b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);
  for(let i=0;i<n;i++)x[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.5);const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;f.Q.value=q;
  const g=a.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(a.destination);s.start();}catch(e){}};
P3.tone=(f,d,t,v)=>{try{L2.tone(f,d,t,v);}catch(e){}};
P3.pop=()=>{P3.noise(.16,1.1,1500,.8);P3.tone(1900,.09,'triangle',.07);setTimeout(()=>P3.tone(1300,.07,'triangle',.05),40);};
P3.whoosh=()=>P3.noise(.7,.35,420,.6);
P3.spark=()=>{P3.noise(.05,.6,3200,2);setTimeout(()=>P3.noise(.05,.5,3000,2),90);};
P3.good=()=>{try{L2.good();}catch(e){}};
P3.click=()=>{try{L2.click();}catch(e){}};

/* shared materials */
const G={};
function gm(){if(G.ok)return;G.ok=1;ensureShared();
  G.glass=new THREE.MeshPhysicalMaterial({color:0xf2fafb,roughness:.04,metalness:0,transparent:true,opacity:.2,clearcoat:1,clearcoatRoughness:.03,side:THREE.DoubleSide,depthWrite:false});G.glass.userData.keepEnv=1;G.glass.userData.glass=1;G.glass.envMapIntensity=1.6;
  G.glassT=new THREE.MeshPhysicalMaterial({color:0xd4e8ec,roughness:.05,transparent:true,opacity:.34,clearcoat:1,side:THREE.DoubleSide,depthWrite:false});G.glassT.userData.keepEnv=1;G.glassT.userData.glass=1;G.glassT.envMapIntensity=1.6;
  G.glassS=new THREE.MeshPhysicalMaterial({color:0xe3f0f2,roughness:.08,transparent:true,opacity:.55,clearcoat:1});G.glassS.userData.keepEnv=1;G.glassS.userData.glass=1;G.glassS.envMapIntensity=1.2;
  G.brass=KIT.mat(0xc49a3a,{metalness:.85,roughness:.3});
  G.rubber=KIT.mat(0x7a2e1e,{roughness:.85});
}
G.water=(c=0xbfe2f0,o=.42)=>{const m=new THREE.MeshPhysicalMaterial({color:c,roughness:.06,transparent:true,opacity:o,depthWrite:false,clearcoat:.6});m.userData.keepEnv=1;m.userData.liq=1;m.envMapIntensity=.55;return m;};
const setCol=(m,h)=>m.color.copy($lc(h));

/* readable label card in the scene */
P3.card=(lines,w=.56,h=.26,o={})=>{const W=512,H=Math.round(512*h/w);
  const tex=canvasTex(W,H,(c)=>{c.fillStyle=o.bg||'#fffdf6';c.fillRect(0,0,W,H);c.strokeStyle=o.bd||'#0d5f56';c.lineWidth=12;c.strokeRect(6,6,W-12,H-12);c.fillStyle=o.ink||'#10302c';c.textAlign='center';c.textBaseline='middle';
    lines.forEach((ln,i)=>{c.font=`${ln.w||700} ${ln.s||64}px ${ln.mono?'"IBM Plex Mono",monospace':'"IBM Plex Sans Arabic","Segoe UI",Tahoma,sans-serif'}`;c.direction=ln.mono?'ltr':'rtl';
      c.fillText(ln.t,W/2,lines.length===1?H/2:H*(i+.5)/lines.length+(i?-6:6));});});
  return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tex,roughness:.75}));};

/* ---------------- flame (shader) ---------------- */
const FV=`uniform float uTime;uniform float uAmp;varying vec2 vUv;varying float vRim;
void main(){vUv=uv;vec3 p=position;float h=uv.y;
float w=sin(uTime*9.0+h*7.0)*.6+sin(uTime*15.0+h*13.0+1.7)*.4;
p.x+=w*uAmp*h*h;p.z+=cos(uTime*11.0+h*9.0)*uAmp*h*h*.8;
vec4 mv=modelViewMatrix*vec4(p,1.0);vec3 n=normalize(normalMatrix*normal);vRim=abs(dot(n,normalize(-mv.xyz)));gl_Position=projectionMatrix*mv;}`;
const FF=`uniform float uTime;uniform float uOp;uniform float uMix;uniform vec3 uCol;uniform vec3 uCore;varying vec2 vUv;varying float vRim;
void main(){float h=vUv.y;float fade=smoothstep(0.0,0.08,h)*(1.0-smoothstep(0.42,1.0,h));
float body=pow(vRim,1.25);float fl=.84+.16*sin(uTime*23.0+h*31.0+vUv.x*6.2832);
vec3 c=mix(uCore,uCol,smoothstep(0.0,uMix,h));float a=clamp(uOp*fade*body*fl,0.0,1.0);gl_FragColor=vec4(c,a);}`;
const flameProf=(R,H,n=22)=>{const p=[];for(let i=0;i<=n;i++){const t=i/n;const r=R*(.5+.5*Math.sin(Math.PI*Math.min(1,t*1.25)))*Math.pow(1-t,.7);p.push(new THREE.Vector2(Math.max(.0008,r),t*H));}return p;};
const _w=new THREE.Color(0xffffff);
function Flame(o={}){const s=o.s||1,g=new THREE.Group();
  const mk=(R,H,col,core,op,amp,mix)=>{const m=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uOp:{value:0},uMix:{value:mix},uAmp:{value:amp*s},uCol:{value:new THREE.Color(col)},uCore:{value:new THREE.Color(core)}},
      vertexShader:FV,fragmentShader:FF,transparent:true,depthWrite:false,blending:THREE.NormalBlending,side:THREE.DoubleSide});
    const me=new THREE.Mesh(new THREE.LatheGeometry(flameProf(R*s,H*s),36),m);me.renderOrder=9;me.frustumCulled=false;me.userData.op=op;g.add(me);return me;};
  const bOut=mk(.11,.66,0x3b55ff,0x6f8fff,.42,.012,.5),bIn=mk(.06,.25,0x2f7bff,0x9fdcff,.85,.004,.7),
        lum=mk(.125,1.1,0xff9a1f,0x4a63ff,.8,.05,.18),lumC=mk(.07,.75,0xffd34d,0xffe9a0,.6,.04,.5),
        salt=mk(.2,1.15,0xffffff,0xffffff,1.6,.025,.3),saltC=mk(.12,.75,0xffffff,0xffffff,1.1,.018,.4);
  const glowM=new THREE.SpriteMaterial({map:P3.glowTex(),color:0xffffff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
  const glow=new THREE.Sprite(glowM);glow.scale.setScalar(1.2*s);glow.position.y=.36*s;glow.renderOrder=10;g.add(glow);
  const light=new THREE.PointLight(0xffaa66,0,5*s,2);light.position.y=.4*s;g.add(light);
  const NS=46,sp=new Float32Array(NS*3),sd=[];for(let i=0;i<NS;i++)sd.push({y:Math.random(),x:(Math.random()-.5)*.14,z:(Math.random()-.5)*.14,v:.5+Math.random()*.8});
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
  const sm=new THREE.PointsMaterial({size:.07*s,map:P3.glowTex(),color:0xffffff,transparent:true,opacity:0,depthWrite:false});
  const pts=new THREE.Points(sg,sm);pts.frustumCulled=false;pts.renderOrder=10;g.add(pts);
  const S={on:false,air:1,salt:0xffffff,saltK:0,lumK:1,boost:1,wB:0,wL:0,wS:0,lightK:1};
  let last=performance.now();const cB=new THREE.Color(),cL=new THREE.Color(),cS=new THREE.Color(),cT=new THREE.Color();
  const blueC=$lc(0x6a7dff),lumCol=$lc(0xffa24a);
  function tick(now){const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000,k=Math.min(1,dt*7);
    const tb=S.on?S.air:0,tl=S.on?(1-S.air):0,ts=S.on?S.saltK:0;
    S.wB+=(tb-S.wB)*k;S.wL+=(tl-S.wL)*k;S.wS+=(ts-S.wS)*Math.min(1,dt*9);
    const set=(me,w)=>{const u=me.material.uniforms;u.uOp.value=me.userData.op*w*S.boost;u.uTime.value=t;me.visible=w>.01;};
    set(bOut,S.wB*(1-S.wS));set(bIn,S.wB*(1-.6*S.wS));set(lum,S.wL*S.lumK);set(lumC,S.wL*S.lumK);set(salt,S.wS);set(saltC,S.wS);
    salt.material.uniforms.uCol.value.set(S.salt);salt.material.uniforms.uCore.value.set(S.salt);
    saltC.material.uniforms.uCol.value.set(S.salt);saltC.material.uniforms.uCore.value.set(S.salt).lerp(_w,.15);
    cB.copy(blueC).multiplyScalar(S.wB*.35);cL.copy(lumCol).multiplyScalar(S.wL*S.lumK);cS.copy($lc(S.salt)).multiplyScalar(S.wS*1.2);
    cT.copy(cB).add(cL).add(cS);const tot=Math.max(cT.r,cT.g,cT.b);
    if(tot>.001){glowM.color.copy(cT).multiplyScalar(1/tot);light.color.copy(glowM.color);}
    glowM.opacity=Math.min(.4,tot*.4)*S.boost;light.intensity=tot*1.5*s*S.lightK*S.boost;glow.visible=tot>.01;
    sm.opacity=S.wS*.95;pts.visible=S.wS>.03;if(pts.visible){sm.color.copy($lc(S.salt));
      for(let i=0;i<NS;i++){const d=sd[i];d.y+=d.v*dt;if(d.y>1){d.y=0;d.x=(Math.random()-.5)*.14;d.z=(Math.random()-.5)*.14;}
        sp[i*3]=(d.x*(1+d.y*1.5)+Math.sin(t*9+i)*.02)*s;sp[i*3+1]=(.12+d.y*.85)*s;sp[i*3+2]=(d.z*(1+d.y*1.5))*s;}sg.attributes.position.needsUpdate=true;}
  }
  return {g,S,tick};
}
P3.Flame=Flame;

/* ---------------- bubbles (instanced) ---------------- */
function Bubbles(max,o={}){const mat=new THREE.MeshPhysicalMaterial({color:o.col||0xffffff,roughness:.05,transparent:true,opacity:o.op||.6,clearcoat:1,depthWrite:false});mat.userData.keepEnv=1;mat.envMapIntensity=1.5;
  const im=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,8),mat,max);im.count=0;im.frustumCulled=false;im.renderOrder=2;
  const B=[],d=new THREE.Object3D();
  return {mesh:im,B,
    spawn(x,y,z,s,top,vy,cb){if(B.length>=max)return;B.push({x,y,z,ox:x,oz:z,s,top,vy:vy||(.3+Math.random()*.3),ph:Math.random()*6.28,cb});},
    clear(){B.length=0;im.count=0;},
    update(dt,t){for(let i=B.length-1;i>=0;i--){const b=B[i];b.y+=b.vy*dt;b.vy=Math.min(b.vy+dt*.35,1.2);b.x=b.ox+Math.sin(t*7+b.ph)*b.s*.9;b.z=b.oz+Math.cos(t*6+b.ph)*b.s*.7;
        const top=typeof b.top==='function'?b.top():b.top;if(b.y>=top){B.splice(i,1);if(b.cb)b.cb();}}
      for(let i=0;i<B.length;i++){const b=B[i];d.position.set(b.x,b.y,b.z);d.scale.setScalar(b.s);d.updateMatrix();im.setMatrixAt(i,d.matrix);}
      im.count=B.length;im.instanceMatrix.needsUpdate=true;}};}

/* ---------------- wooden splint ---------------- */
function Splint(){const g=new THREE.Group();g.visible=false;
  const stick=new THREE.Mesh(new THREE.BoxGeometry(.04,.8,.04),KIT.mat(0xdcb683,{roughness:.85}));stick.position.y=.43;stick.castShadow=true;
  const ch=new THREE.Mesh(new THREE.BoxGeometry(.043,.09,.043),KIT.mat(0x2b1b12,{roughness:.95}));ch.position.y=.045;
  const em=new THREE.Mesh(new THREE.SphereGeometry(.028,12,10),new THREE.MeshBasicMaterial({color:0xff6a1a}));em.position.y=.012;
  const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:P3.glowTex(),color:0xff7a2a,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));gl.scale.setScalar(.3);gl.position.y=.02;gl.renderOrder=10;
  const fl=Flame({s:.34});fl.S.air=0;fl.S.lightK=.6;fl.g.position.y=-.03;
  g.add(stick,ch,em,gl,fl.g);
  const S={mode:'out'};
  const set=m=>{S.mode=m;fl.S.on=(m==='burn'||m==='bright');fl.S.boost=m==='bright'?1.45:1;fl.g.scale.setScalar(m==='bright'?1.55:1);em.visible=gl.visible=(m!=='out');};
  set('out');
  return {g,set,S,tick(now){fl.tick(now);if(S.mode==='glow'){const k=.72+.28*Math.sin(now/110);gl.material.opacity=k;em.scale.setScalar(.85+.25*k);}else{gl.material.opacity=S.mode==='out'?0:.55;em.scale.setScalar(1);}}};}

/* flash + smoke */
P3.flash=(L,pos,col=0xfff2c0,size=1.5)=>{const m=new THREE.SpriteMaterial({map:P3.glowTex(),color:$lc(col),transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false});
  const s=new THREE.Sprite(m);s.position.copy(pos);s.renderOrder=11;L.scene.add(s);
  const pl=new THREE.PointLight($lc(col),3,6,2);pl.position.copy(pos);L.scene.add(pl);
  L.tween(480,t=>{s.scale.setScalar(.1+size*Math.sqrt(t));m.opacity=1-t;pl.intensity=3*(1-t);},()=>{L.scene.remove(s);L.scene.remove(pl);});};
P3.smoke=(L,pos)=>{for(let i=0;i<6;i++){const m=new THREE.SpriteMaterial({map:P3.glowTex(),color:$lc(0x8e959a),transparent:true,opacity:0,depthWrite:false});
  const s=new THREE.Sprite(m);s.position.copy(pos);L.scene.add(s);const dx=(Math.random()-.5)*.3,d=1500+i*180;
  setTimeout(()=>L.tween(d,t=>{s.position.set(pos.x+dx*t,pos.y+t*.95,pos.z);s.scale.setScalar(.1+t*.55);m.opacity=.6*Math.sin(Math.PI*t);},()=>L.scene.remove(s)),i*110);}};

/* simple glass test tube; origin = centre of round bottom; open mouth at y=h */
function TestTube(r=.13,h=1.0){const g=new THREE.Group();
  const gl=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,28,1,true),G.glassT);gl.position.y=h/2;gl.renderOrder=3;
  const bt=new THREE.Mesh(new THREE.SphereGeometry(r,28,12,0,Math.PI*2,Math.PI/2,Math.PI/2),G.glassT);bt.renderOrder=3;
  const lip=new THREE.Mesh(new THREE.TorusGeometry(r+.006,.013,8,28),G.glassS);lip.rotation.x=Math.PI/2;lip.position.y=h;
  const lm=G.water();const liq=new THREE.Mesh(new THREE.CylinderGeometry(r*.9,r*.9,1,24),lm);liq.renderOrder=1;
  const lb=new THREE.Mesh(new THREE.SphereGeometry(r*.9,24,10,0,Math.PI*2,Math.PI/2,Math.PI/2),lm);lb.renderOrder=1;
  const stp=new THREE.Mesh(new THREE.CylinderGeometry(r+.035,r-.01,.17,20),G.rubber);stp.position.y=h+.045;stp.visible=false;stp.castShadow=true;
  g.add(gl,bt,lip,liq,lb,stp);
  const seg=(a,b)=>{const on=b-a>.003;liq.visible=on;lb.visible=on&&a<=.001;if(!on)return;liq.scale.y=b-a;liq.position.y=(a+b)/2;};seg(0,0);
  return {g,lm,seg,stp,h,r};}

/* hook with dt */
P3.loop=(L,fn)=>{let last=performance.now();L.hooks.push(now=>{const dt=Math.min(.05,(now-last)/1000);last=now;fn(dt,now/1000,now);});};
P3.qFrom=(x,y,z)=>new THREE.Quaternion().setFromUnitVectors(V(0,1,0),V(x,y,z).normalize());

/* ---------------- page shell ---------------- */
P3.section=(id,cfg)=>{
  const sec=document.createElement('section');sec.id='lab-'+id;sec.className='wrap p3';sec.hidden=true;
  sec.innerHTML=`
  <div class="labbar"><h2>${cfg.title}</h2><span class="chip">${cfg.grade} · ${cfg.lesson}</span><span class="chip">3D</span><div style="flex:1"></div>
    <div class="tabs" role="tablist"><button role="tab" aria-selected="true" data-pane="bench">المختبر ثلاثي الأبعاد</button><button role="tab" aria-selected="false" data-pane="learn">المعلومات والأسئلة</button><button role="tab" aria-selected="false" data-pane="report">عرض النتائج للفصل</button></div></div>
  <div data-p="bench" class="p3-grid">
    <aside class="p3-side">
      <div class="p3-box"><div class="p3-steps"></div><div class="p3-card"></div></div>
      ${cfg.side||''}
      <div class="p3-box"><h4 class="p3-h">دفتر المختبر</h4><div class="p3-nb"></div></div>
    </aside>
    <div class="stage p3-stage"><div class="labels"></div><div class="p3-hud">${cfg.hud||''}</div>${cfg.overlay||''}
      <div class="zoom"><button data-z="0.85" aria-label="تقريب">+</button><button data-z="1.18" aria-label="تبعيد">−</button><button data-z="home" aria-label="إعادة الكاميرا">⟲</button></div>
      <div class="toast"></div></div>
  </div>
  <div data-p="learn" hidden><div class="info">${cfg.learn}</div><div class="panel"><h3>اختبر نفسك <span class="score"></span></h3><div class="quiz"></div></div></div>
  <div data-p="report" hidden><div class="p3-acts" style="justify-content:center;margin:4px 0 12px"><a class="p3-b pri" href="sheet-${id}.html?print=1" target="_blank" rel="noopener" style="text-decoration:none">🖨 ورقة تقرير الطالب للطباعة</a><a class="p3-b" href="sheet-${id}.html" target="_blank" rel="noopener" style="text-decoration:none">👁 معاينة الورقة</a></div>${reportShell()}</div>`;
  document.querySelector('main').appendChild(sec);
  sec.$=q=>sec.querySelector(q);sec.$$=q=>[...sec.querySelectorAll(q)];
  sec.querySelector('.tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    sec.$$('.tabs button').forEach(x=>x.setAttribute('aria-selected',x===b));
    sec.$$('[data-p]').forEach(p=>p.hidden=p.dataset.p!==b.dataset.pane);
    if(b.dataset.pane==='report'&&cfg.report)renderReport(sec,cfg.report());});
  const qz=sec.$('.quiz'),ans={};
  qz.innerHTML=cfg.quiz.map((x,i)=>`<div class="q"><p>${i+1}. ${x.q}</p><div class="opts">${x.o.map((o,j)=>`<button data-q="${i}" data-j="${j}">${o}</button>`).join('')}</div></div>`).join('');
  qz.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const i=+b.dataset.q,j=+b.dataset.j;if(ans[i]!=null)return;ans[i]=j;
    b.parentElement.children[cfg.quiz[i].a].classList.add('ok');if(j!==cfg.quiz[i].a)b.classList.add('bad');
    sec.$('.score').textContent=`· ${Object.entries(ans).filter(([k,v])=>cfg.quiz[k].a===v).length} / ${cfg.quiz.length}`;});
  wireReport(sec);
  sec.steps=(names,cur,title,html)=>{sec.$('.p3-steps').innerHTML=names.map((n,i)=>`<i class="${i===cur?'on':i<cur?'past':''}" title="${n}"></i>`).join('');
    sec.$('.p3-card').innerHTML=`<div class="p3-sn">الخطوة ${Math.min(cur,names.length-1)+1} من ${names.length}: ${names[Math.min(cur,names.length-1)]}</div><h3 class="p3-stitle">${title}</h3>${html}`;};
  return sec;
};
const show=(el,on)=>el.classList.toggle('p3-off',!on);
const LRI=t=>'\u2066'+t+'\u2069';
const sw=(h,t)=>`<span class="p3-sw" style="background:${hex6(h)}"></span>${t}`;

/* =====================================================================
   ١) التحليل الكهربائي للماء — جهاز هوفمان
   ===================================================================== */
const ELEC={};EXP_MODS.elec=ELEC;
ELEC.init=function(){gm();
const S={salt:false,btb:false,btbK:0,n:3,on:false,sp:10,t:0,vh:0,vo:0,I:0,rows:[],tests:[null,null],idf:[null,null],splint:null,busy:false,
  distTried:false,saltOn:false,pc:0,pa:0,mol:false,acc:[0,0]};
P3.dbg.elec=S;const NAMES=['تحضير المحلول','إغلاق الدائرة','جمع الغازين','الكشف عن الغازين'];
const sec=P3.section('elec',{title:'التحليل الكهربائي للماء',grade:'ثالث متوسط · ثانوي',lesson:'التحليل الكهربائي',
  hud:`<div class="p3-row"><div class="p3-m"><small>الجهد</small><b class="elV">4.5 V</b></div><div class="p3-m"><small>التيار</small><b class="elI">0.000 A</b></div><div class="p3-m"><small>الزمن</small><b class="elT">00:00</b></div></div>
       <div class="p3-row"><div class="p3-m warm"><small>غاز المهبط (−)</small><b class="elH">0.0 mL</b></div><div class="p3-m warm"><small>غاز المصعد (+)</small><b class="elO">0.0 mL</b></div></div>`,
  overlay:`<div class="p3-mol" hidden><canvas width="600" height="390"></canvas></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">المحلول</span><button class="p3-b" data-a="salt">＋ كبريتات الصوديوم</button><button class="p3-b" data-a="btb">＋ كاشف بروموثيمول</button></div>
    <div class="p3-acts"><span class="p3-lab">البطاريات</span><button class="p3-b" data-n="2">2</button><button class="p3-b" data-n="3">3</button><button class="p3-b" data-n="4">4</button><span class="p3-lab" style="min-width:0">× 1.5 V</span></div>
    <div class="p3-acts"><span class="p3-lab">الدائرة</span><button class="p3-b pri" data-a="sw">⏻ أغلق الدائرة</button><button class="p3-b" data-a="rec">📋 سجّل القراءة</button></div>
    <div class="p3-acts"><span class="p3-lab">الزمن</span><button class="p3-b" data-sp="1">×1</button><button class="p3-b" data-sp="10">×10</button><button class="p3-b" data-sp="30">×30</button><button class="p3-b" data-a="mol">⚛ المستوى الجزيئي</button></div>
    <div class="p3-acts"><span class="p3-lab">الكشف</span><button class="p3-b" data-s="burn">🔥 شظية مشتعلة</button><button class="p3-b" data-s="glow">✨ شظية متوهجة</button></div>
    <div class="p3-acts elTg" hidden><span class="p3-lab">قرّبها من</span><button class="p3-b" data-t="0">أنبوب المهبط (−)</button><button class="p3-b" data-t="1">أنبوب المصعد (+)</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة التجربة</button></div></div>`,
  learn:`<div class="panel"><h3>ماذا يحدث؟</h3><p>عند إمرار تيار كهربائي مستمر في الماء المضاف إليه مادة إلكتروليتية (مثل كبريتات الصوديوم) يتحلّل الماء إلى غازين.</p>
      <p class="p3-eq">2H₂O(l) → 2H₂(g) + O₂(g)</p></div>
    <div class="panel"><h3>عند القطبين</h3><p><b>المهبط (القطب السالب):</b> يتصاعد غاز الهيدروجين.</p><p><b>المصعد (القطب الموجب):</b> يتصاعد غاز الأكسجين.</p><p>حجم الهيدروجين يساوي <b>ضعف</b> حجم الأكسجين؛ لأن كل جزيئين من الماء يعطيان جزيئين من الهيدروجين وجزيئًا واحدًا من الأكسجين.</p></div>
    <div class="panel"><h3>لماذا نضيف كبريتات الصوديوم؟</h3><p>الماء النقي ضعيف التوصيل للكهرباء لقلة أيوناته، فنضيف إلكتروليتًا يزيد عدد الأيونات فيمرّ التيار، ولا يدخل في نواتج التحليل.</p><p>كاشف بروموثيمول الأزرق: يتحول إلى <b>الأزرق</b> قرب المهبط (تتكوّن أيونات OH⁻) وإلى <b>الأصفر</b> قرب المصعد (تتكوّن أيونات H⁺).</p></div>
    <div class="panel"><h3>الكشف عن الغازين</h3><p><b>الهيدروجين:</b> يشتعل بفرقعة عند تقريب شظية مشتعلة.</p><p><b>الأكسجين:</b> يعيد اشتعال الشظية المتوهجة.</p></div>`,
  quiz:[{q:'أي الغازين يتصاعد عند المهبط (القطب السالب)؟',o:['الأكسجين','الهيدروجين','ثاني أكسيد الكربون'],a:1},
        {q:'إذا تجمّع 20 mL من الهيدروجين، فكم يكون حجم الأكسجين تقريبًا؟',o:['10 mL','20 mL','40 mL'],a:0},
        {q:'لماذا تُضاف كبريتات الصوديوم إلى الماء؟',o:['لتلوين الماء','لزيادة توصيل الماء للكهرباء','لإنتاج غاز الكلور'],a:1},
        {q:'ما الاختبار الذي يكشف عن غاز الأكسجين؟',o:['تعكّر ماء الجير','فرقعة مع شظية مشتعلة','إعادة اشتعال شظية متوهجة'],a:2},
        {q:'ماذا يحدث لسرعة تصاعد الغاز عند زيادة عدد البطاريات؟',o:['تزداد','تقل','لا تتغير'],a:0}],
  report:()=>({title:'التحليل الكهربائي للماء',grade:'ثالث متوسط · ثانوي',lesson:'التحليل الكهربائي',
    cols:['القراءة','الزمن','حجم غاز المهبط (−) mL','حجم غاز المصعد (+) mL','عدد البطاريات'],
    rows:S.rows.length?S.rows.map((r,i)=>[`القراءة ${i+1}`,fmtT(r.t),r.vh.toFixed(1),r.vo.toFixed(1),String(r.n)]):[['القراءة 1','','','','']],
    note:testsNote()})
});
const L=new Lab(sec,{target:V(-.45,1.85,.5),dist:a=>Math.max(6.8,10.4/a),exposure:.92});buildRoom(L);
const toast=m=>L.toast(m);
const fmtT=s=>{s=Math.floor(s);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};

/* ---------- Hofmann voltameter ---------- */
const HX=1.0,HZ=.2,TX=[-.45,.45],TR=.12,TB=.45,TT=2.75,Y0=2.70,KV=.06;
const H=new THREE.Group();H.position.set(HX,0,HZ);
const gradTexE=canvasTex(160,1024,(c,w,h)=>{c.clearRect(0,0,w,h);c.fillStyle='rgba(255,255,255,.62)';c.fillRect(0,0,118,h);
  c.fillStyle='#14303a';c.strokeStyle='#14303a';c.font='700 44px "IBM Plex Mono",monospace';c.textBaseline='middle';
  for(let v=0;v<=25;v++){const y=(v/25)*(h*.94)+h*.03;const maj=v%5===0;c.lineWidth=maj?6:3;c.beginPath();c.moveTo(0,y);c.lineTo(maj?50:28,y);c.stroke();if(maj)c.fillText(String(v),56,y+2);}});
const HS=1.5/.94;
const tubes=[],handles=[],liqM=[G.water(),G.water()];
TX.forEach((x,i)=>{
  const t=new THREE.Mesh(new THREE.CylinderGeometry(TR,TR,TT-TB,32,1,true),G.glass);t.position.set(x,(TT+TB)/2,0);t.renderOrder=3;H.add(t);tubes.push(t);
  const cone=new THREE.Mesh(new THREE.CylinderGeometry(.035,TR,.18,32,1,true),G.glass);cone.position.set(x,TT+.09,0);cone.renderOrder=3;
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(.03,.035,.1,16,1,true),G.glass);neck.position.set(x,TT+.23,0);
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.17,18),G.glassS);body.rotation.x=Math.PI/2;body.position.set(x,TT+.3,0);
  const hg=new THREE.Group();hg.position.set(x,TT+.3,.1);const hb=new THREE.Mesh(RBox(.24,.045,.045,.015),KIT.mat(0x2d3a40,{roughness:.4}));hg.add(hb);handles.push(hg);
  const jet=new THREE.Mesh(new THREE.CylinderGeometry(.018,.026,.2,16,1,true),G.glass);jet.position.set(x,TT+.48,0);
  const scale=new THREE.Mesh(new THREE.CylinderGeometry(TR+.004,TR+.004,HS,24,1,true,-.5,1.0),new THREE.MeshBasicMaterial({map:gradTexE,transparent:true,depthWrite:false}));
  scale.position.set(x,Y0+.03*HS-HS/2,0);scale.renderOrder=4;
  const plug=new THREE.Mesh(new THREE.CylinderGeometry(.125,.105,.13,24),KIT.mat(0x1d2124,{roughness:.7}));plug.position.set(x,TB-.04,0);
  const term=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.13,16),KIT.mat(i?0xc62828:0x222222,{roughness:.35}));term.position.set(x,TB-.17,0);
  const rodE=new THREE.Mesh(new THREE.CylinderGeometry(.009,.009,.26,8),M.steel);rodE.position.set(x,TB+.1,0);
  const plate=new THREE.Mesh(new THREE.BoxGeometry(.13,.34,.014),KIT.mat(0xd8dde0,{metalness:.9,roughness:.22}));plate.position.set(x,TB+.4,0);
  H.add(cone,neck,body,hg,jet,scale,plug,term,rodE,plate);
});
// connector + reservoir
const conn=new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,.9,20,1,true),G.glass);conn.rotation.z=Math.PI/2;conn.position.set(0,.62,0);conn.renderOrder=3;
const cen=new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,2.36,24,1,true),G.glass);cen.position.set(0,.62+1.18,0);cen.renderOrder=3;
const YB=3.2,RB=.24;const bulb=new THREE.Mesh(new THREE.SphereGeometry(RB,32,20),G.glass);bulb.position.set(0,YB,0);bulb.renderOrder=3;
const bneck=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.22,20,1,true),G.glass);bneck.position.set(0,YB+RB+.08,0);
H.add(conn,cen,bulb,bneck);
// liquids
const cM=G.water();
const liqS=TX.map((x,i)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(TR-.014,TR-.014,1,32),liqM[i]);m.position.x=x;m.renderOrder=1;H.add(m);return m;});
const liqC=new THREE.Mesh(new THREE.CylinderGeometry(.052,.052,1,20),cM);liqC.renderOrder=1;
const liqConn=new THREE.Mesh(new THREE.CylinderGeometry(.052,.052,.9,16),cM);liqConn.rotation.z=Math.PI/2;liqConn.position.set(0,.62,0);liqConn.renderOrder=1;
const liqB=new THREE.Mesh(new THREE.BufferGeometry(),cM);liqB.position.set(0,YB,0);liqB.renderOrder=1;
H.add(liqC,liqConn,liqB);
let lastBulb=-1;
function setLevels(){const lv=[Y0-KV*S.vh,Y0-KV*S.vo];
  lv.forEach((y,i)=>{liqS[i].scale.y=y-TB;liqS[i].position.y=(y+TB)/2;});
  const yc=Y0+(S.vh+S.vo)*.012,ycT=Math.min(yc,YB-RB+.015);liqC.scale.y=ycT-.62;liqC.position.y=(ycT+.62)/2;
  if(yc>YB-RB+.02){if(Math.abs(yc-lastBulb)>.004){lastBulb=yc;const r=RB-.012,dy=clamp(yc-YB,-r,r),th=Math.acos(dy/r);liqB.geometry.dispose();liqB.geometry=new THREE.SphereGeometry(r,24,12,0,Math.PI*2,th,Math.PI-th);}liqB.visible=true;}
  else liqB.visible=false;
  return lv;}
// stand + clamps
const stB=new THREE.Mesh(RBox(1.2,.07,.6,.02),KIT.mat(0x2b3036,{metalness:.3}));stB.position.set(HX,.035,-.45);
const stR=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,3.9,12),M.steel);stR.position.set(HX,1.95,-.62);
const stand=new THREE.Group();stand.add(stB,stR);
[2.35,1.05].forEach(y=>{const arm=new THREE.Mesh(new THREE.BoxGeometry(.045,.045,.78),M.steel);arm.position.set(HX,y,-.21);
  const boss=new THREE.Mesh(RBox(.11,.11,.11,.02),KIT.mat(0x222222));boss.position.set(HX,y,-.62);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.085,.02,8,24),KIT.mat(0x2d3a40));ring.rotation.x=Math.PI/2;ring.position.set(HX,y,HZ);stand.add(arm,boss,ring);});
castAll(stand);L.add(stand);
const bub=Bubbles(260);H.add(bub.mesh);
L.add(H);

/* ---------- battery pack ---------- */
const BP=new THREE.Group();BP.position.set(-2.55,0,.55);
const tray=new THREE.Mesh(RBox(2.72,.16,.5,.04),KIT.mat(0x23292e,{roughness:.55}));tray.position.y=.08;BP.add(tray);
const cellTex=canvasTex(256,512,(c,w,h)=>{const g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'#0f1215');g.addColorStop(.5,'#3a4048');g.addColorStop(1,'#0f1215');c.fillStyle=g;c.fillRect(0,0,w,h);
  c.fillStyle='#d58a22';c.fillRect(0,0,w,h*.24);c.fillStyle='#f2f2f2';c.font='700 76px "IBM Plex Mono",monospace';c.textAlign='center';c.textBaseline='middle';
  c.save();c.translate(w/2,h*.6);c.rotate(Math.PI/2);c.fillText('1.5V',0,0);c.restore();c.fillStyle='#fff';c.font='700 70px "IBM Plex Mono"';c.fillText('+',w/2,h*.11);});
const cellGeo=new THREE.CylinderGeometry(.165,.165,.6,32);cellGeo.rotateY(Math.PI);
const cells=[],links=[];
[-.96,-.32,.32,.96].forEach(x=>{const c=new THREE.Mesh(cellGeo,new THREE.MeshStandardMaterial({map:cellTex,roughness:.35,metalness:.3}));c.rotation.z=Math.PI/2;c.position.set(x,.33,0);c.castShadow=true;
  const nub=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.04,16),M.steel);nub.rotation.z=Math.PI/2;nub.position.set(x-.32,.33,0);
  const cg=new THREE.Group();cg.add(c,nub);BP.add(cg);cells.push(cg);
  const lk=new THREE.Mesh(new THREE.BoxGeometry(.62,.03,.08),G.brass);lk.position.set(x,.175,0);BP.add(lk);links.push(lk);});
[[-1.38,0xc62828],[1.38,0x1c1c1c]].forEach(([x,c])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.06,.26,16),KIT.mat(c,{roughness:.35}));p.position.set(x,.29,0);p.castShadow=true;BP.add(p);});
L.add(BP);
function setCells(){cells.forEach((c,i)=>c.visible=i<S.n);links.forEach((l,i)=>l.visible=i>=S.n);}
setCells();

/* ---------- knife switch ---------- */
const SW=new THREE.Group();SW.position.set(-.55,0,1.45);
const swb=new THREE.Mesh(RBox(.7,.09,.32,.02),KIT.wood(0x9b6a3c));swb.position.y=.045;swb.castShadow=true;SW.add(swb);
[-.2,.2].forEach(x=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.05,.16,.09),G.brass);p.position.set(x,.17,0);SW.add(p);});
[-.29,.29].forEach(x=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.08,12),G.brass);p.position.set(x,.13,0);SW.add(p);});
const piv=new THREE.Group();piv.position.set(-.2,.23,0);
const blade=new THREE.Mesh(new THREE.BoxGeometry(.44,.025,.07),KIT.mat(0xd2ab50,{metalness:.85,roughness:.25}));blade.position.x=.22;
const knob=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.18,14),KIT.mat(0x1c1c1c));knob.position.set(.44,.08,0);
piv.add(blade,knob);piv.rotation.z=1.0;SW.add(piv);castAll(SW);L.add(SW);
/* ---------- ammeter ---------- */
const AM=new THREE.Group();AM.position.set(.45,0,1.55);
const amb=new THREE.Mesh(RBox(.68,.5,.2,.05),KIT.mat(0xf0b429,{roughness:.45}));amb.position.y=.25;amb.castShadow=true;
const amf=new THREE.Mesh(RBox(.58,.4,.02,.02),KIT.mat(0x1a1d20));amf.position.set(0,.27,.1);
const amL=KIT.lcd(.5,.19);amL.m.position.set(0,.31,.113);amL.set('0.00 A');
AM.add(amb,amf,amL.m);
[[-.18,0xc62828],[.18,0x1c1c1c]].forEach(([x,c])=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.06,12),KIT.mat(c));t.rotation.x=Math.PI/2;t.position.set(x,.11,.12);AM.add(t);});
L.add(AM);
/* ---------- wires with electron flow ---------- */
function FlowWire(pts,col,dir){const curve=new THREE.CatmullRomCurve3(pts.map(p=>V(...p)),false,'centripetal');
  const m=new THREE.Mesh(new THREE.TubeGeometry(curve,140,.028,8),KIT.mat(col,{roughness:.45}));m.castShadow=true;
  const g=new THREE.Group();g.add(m);const dm=new THREE.MeshBasicMaterial({color:0xfff07a});const dots=[];
  const n=Math.max(6,Math.round(curve.getLength()*5));for(let i=0;i<n;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(.036,10,8),dm);d.visible=false;g.add(d);dots.push(d);}
  let ph=0;return {g,tick(dt,v){ph=(ph+dt*v/curve.getLength())%1;dots.forEach((d,i)=>{d.visible=v>0;if(!v)return;let t=(i/n+ph)%1;if(dir<0)t=1-t;d.position.copy(curve.getPointAt(t));});}};}
const wires=[
  FlowWire([[-3.93,.42,.55],[-3.98,.2,.8],[-3.7,.03,1.2],[-2.6,.03,1.55],[-1.4,.03,1.6],[-.95,.05,1.5],[-.84,.13,1.45]],0xc62828,-1),
  FlowWire([[-.26,.13,1.45],[-.1,.04,1.55],[.1,.04,1.7],[.27,.11,1.68]],0xc62828,-1),
  FlowWire([[.63,.11,1.68],[.85,.04,1.6],[1.3,.03,1.2],[1.47,.04,.7],[1.47,.08,.35],[1.45,.18,.2]],0xc62828,-1),
  FlowWire([[-1.17,.42,.55],[-1.05,.2,.62],[-.7,.03,.8],[.1,.03,.85],[.5,.04,.6],[.53,.08,.35],[.55,.18,.2]],0x1c1c1c,1)];
wires.forEach(w=>L.add(w.g));
/* ---------- reagents + splints ---------- */
function Jar(col,cap,text,r=.2,h=.42){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,28),KIT.phys(col,{roughness:.35}));b.position.y=h/2;
  const c=new THREE.Mesh(new THREE.CylinderGeometry(r*.75,r*.75,.09,24),KIT.mat(cap));c.position.y=h+.045;const lb=P3.card([{t:text,mono:1,s:96}],r*1.7,r*.9);lb.position.set(0,h*.5,r+.004);g.add(b,c,lb);castAll(g);return g;}
const saltJar=Jar(0xf3f3ef,0x1f4e9c,'Na₂SO₄');saltJar.position.set(2.45,0,.2);
const btbJar=new THREE.Group();{const b=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.3,24),KIT.phys(0x2f6f9c,{roughness:.2,transparent:true,opacity:.85}));b.position.y=.15;
  const c=new THREE.Mesh(new THREE.CylinderGeometry(.06,.07,.08,16),KIT.mat(0x111111));c.position.y=.34;const bl=new THREE.Mesh(new THREE.SphereGeometry(.06,16,12),KIT.mat(0x111111,{roughness:.8}));bl.scale.y=1.4;bl.position.y=.44;
  const lb=P3.card([{t:'BTB',mono:1,s:110}],.2,.1);lb.position.set(0,.15,.124);btbJar.add(b,c,bl,lb);castAll(btbJar);}
btbJar.position.set(2.95,0,.55);
const sjar=new THREE.Group();{const b=new THREE.Mesh(new THREE.CylinderGeometry(.16,.14,.36,24,1,true),G.glass);b.position.y=.18;b.renderOrder=3;sjar.add(b);
  [-.05,.03,.06].forEach((x,i)=>{const s=new THREE.Mesh(new THREE.BoxGeometry(.035,.75,.035),KIT.mat(0xdcb683,{roughness:.85}));s.position.set(x,.37,(i-1)*.05);s.rotation.z=(i-1)*.12;sjar.add(s);});}
sjar.position.set(2.55,0,1.15);
L.add(saltJar,btbJar,sjar);
const sp=Splint();L.add(sp.g);
/* labels */
const lab=[L.label('غاز المهبط (−)',V(HX+TX[0]-.62,2.85,HZ),'gas'),L.label('غاز المصعد (+)',V(HX+TX[1]+.62,2.85,HZ),'gas')];
L.label('جهاز هوفمان',V(HX,3.72,HZ),'small');L.label('البطاريات',V(-2.55,.75,.55),'small');L.label('المفتاح',V(-.55,.62,1.45),'small');L.label('الأميتر',V(.45,.72,1.55),'small');
L.label('مهبط −',V(HX+TX[0]-.32,.32,HZ),'small');L.label('مصعد +',V(HX+TX[1]+.32,.32,HZ),'small');

/* ---------- molecular view ---------- */
const molBox=sec.$('.p3-mol'),molCv=molBox.querySelector('canvas'),mx=molCv.getContext('2d');
const MW=molCv.width,MH=molCv.height;const ws=[];for(let i=0;i<16;i++)ws.push({x:110+Math.random()*(MW-220),y:70+Math.random()*(MH-150),a:Math.random()*6.28,vx:(Math.random()-.5)*26,vy:(Math.random()-.5)*26,va:(Math.random()-.5)});
const gms=[];let molAcc=0,nH=0,nO=0;
function atom(x,y,r,c){mx.beginPath();mx.arc(x,y,r,0,7);const g=mx.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r);g.addColorStop(0,'#fff');g.addColorStop(.35,c);g.addColorStop(1,c);mx.fillStyle=g;mx.fill();}
function water(x,y,a){const d=15;atom(x+Math.cos(a+.9)*d,y+Math.sin(a+.9)*d,8,'#e8eef2');atom(x+Math.cos(a-.9)*d,y+Math.sin(a-.9)*d,8,'#e8eef2');atom(x,y,13,'#e0473c');}
function drawMol(dt,rate){mx.clearRect(0,0,MW,MH);mx.fillStyle='#0e2522';mx.fillRect(0,0,MW,MH);
  mx.fillStyle='#5b6670';mx.fillRect(22,46,22,MH-130);mx.fillRect(MW-44,46,22,MH-130);
  mx.font='700 26px "IBM Plex Sans Arabic",sans-serif';mx.textAlign='center';mx.direction='rtl';mx.fillStyle='#9fe8ff';mx.fillText('المهبط (−)',92,32);mx.fillStyle='#ffc28a';mx.fillText('المصعد (+)',MW-92,32);
  ws.forEach(w=>{w.x+=w.vx*dt;w.y+=w.vy*dt;w.a+=w.va*dt;if(w.x<90||w.x>MW-90)w.vx*=-1;if(w.y<70||w.y>MH-100)w.vy*=-1;water(w.x,w.y,w.a);});
  molAcc+=dt*rate;while(molAcc>=1){molAcc--;gms.push({t:'H',x:66,y:MH-110-Math.random()*130,vy:-55-Math.random()*25});nH++;if(nH%2===0){gms.push({t:'O',x:MW-66,y:MH-110-Math.random()*130,vy:-45});nO++;}}
  for(let i=gms.length-1;i>=0;i--){const m=gms[i];m.y+=m.vy*dt;if(m.y<50){gms.splice(i,1);continue;}
    if(m.t==='H'){atom(m.x-8,m.y,9,'#e8eef2');atom(m.x+8,m.y,9,'#e8eef2');}else{atom(m.x-11,m.y,12,'#e0473c');atom(m.x+11,m.y,12,'#e0473c');}}
  mx.fillStyle='rgba(0,0,0,.35)';mx.fillRect(0,MH-62,MW,62);mx.direction='ltr';mx.font='600 25px "IBM Plex Mono",monospace';
  mx.fillStyle='#9fe8ff';mx.fillText('H₂ × '+nH,100,MH-24);mx.fillStyle='#ffc28a';mx.fillText('O₂ × '+nO,MW-100,MH-24);mx.fillStyle='#fff';mx.fillText('2H₂O → 2H₂ + O₂',MW/2,MH-24);}

/* ---------- logic ---------- */
const BTB_G=0x5fae58,BTB_B=0x2f5fd0,BTB_Y=0xe2c22a,WAT=0xbfe2f0;
function liquidColors(){const k=S.btbK;
  const base=k>0?mixHex(WAT,BTB_G,k):WAT;
  setCol(liqM[0],k>0?mixHex(base,BTB_B,S.pc*k):base);setCol(liqM[1],k>0?mixHex(base,BTB_Y,S.pa*k):base);setCol(cM,base);
  const op=.42+.2*k;liqM[0].opacity=liqM[1].opacity=cM.opacity=op;}
function current(){const V=S.n*1.5;return S.on?(S.salt?Math.max(0,V-1.8)/6:.0006*S.n):0;}
let hudT=0,lastI=-1;
P3.loop(L,(dt,t,now)=>{
  S.I=current();const dts=dt*S.sp;
  if(S.on&&S.I>.01){S.t+=dts;const rate=S.I*.1244;S.vh=Math.min(25,S.vh+rate*dts);S.vo=Math.min(12.5,S.vo+rate*dts/2);
    if(S.btb){S.pc=Math.min(1,S.pc+dts*S.I*.012);S.pa=Math.min(1,S.pa+dts*S.I*.012);}
    if(S.vh>=25){setSwitch(false);toast('امتلأ أنبوب المهبط حتى 25 mL، فأُوقف التيار. اكشف عن الغازين الآن.');}}
  else if(S.on)S.t+=dts;
  if(S.btb&&S.btbK<1)S.btbK=Math.min(1,S.btbK+dt*.8);
  liquidColors();const lv=setLevels();
  const vis=Math.min(48,S.I*75*(S.sp>1?1.4:1));
  [0,1].forEach(i=>{S.acc[i]+=dt*vis*(i?.5:1);while(S.acc[i]>=1){S.acc[i]--;const x=TX[i]+(Math.random()-.5)*.11,y=.7+Math.random()*.3;bub.spawn(x,y,(Math.random()-.5)*.03,(i?.013:.01)+Math.random()*.012,()=>(i?Y0-KV*S.vo:Y0-KV*S.vh));}});
  bub.update(dt,t);
  const fv=S.on&&S.I>.05?.25+S.I*.9:0;wires.forEach(w=>w.tick(dt,fv));
  sp.tick(now);
  if(now-hudT>120){hudT=now;sec.$('.elV').textContent=(S.n*1.5).toFixed(1)+' V';sec.$('.elI').textContent=S.I.toFixed(3)+' A';
    sec.$('.elH').textContent=S.vh.toFixed(1)+' mL';sec.$('.elO').textContent=S.vo.toFixed(1)+' mL';sec.$('.elT').textContent=fmtT(S.t);
    if(Math.abs(S.I-lastI)>.004){lastI=S.I;amL.set(S.I.toFixed(2)+' A');}
    lab[0].textContent=(S.idf[0]?LRI(S.idf[0])+' · ':'غاز المهبط (−) · ')+LRI(S.vh.toFixed(1)+' mL');lab[1].textContent=(S.idf[1]?LRI(S.idf[1])+' · ':'غاز المصعد (+) · ')+LRI(S.vo.toFixed(1)+' mL');
    const rt=sec.$('.elRatio');if(rt)rt.textContent=S.vo>.3?(S.vh/S.vo).toFixed(2):'—';}
  if(S.mol&&!molBox.hidden)drawMol(dt,S.on&&S.I>.05?Math.min(3.2,S.I*4.2):0);
});

function setSwitch(on){S.on=on;const a0=piv.rotation.z,a1=on?0:1.0;L.tween(260,k=>piv.rotation.z=a0+(a1-a0)*ease(k));P3.click();
  if(on){if(S.salt)S.saltOn=true;else S.distTried=true;}sync();render();}
function toggle(){if(S.busy)return;setSwitch(!S.on);
  if(S.on)toast(S.salt?'أُغلقت الدائرة: تتصاعد فقاعات عند القطبين، وأكثرها عند المهبط.':'الماء المقطر رديء التوصيل: التيار ضئيل جدًا (أقل من 0.01 A) ولا تظهر فقاعات تقريبًا.');}
async function pour(obj,dropCol,isPowder){const home=obj.position.clone();await L.arc(obj,V(HX+.18,3.85,HZ),900,4.1);
  await L.tw(380,k=>obj.rotation.z=1.9*ease(k));
  const n=isPowder?70:5,geo=new THREE.BufferGeometry(),pos=new Float32Array(n*3),sd=[];for(let i=0;i<n;i++)sd.push({x:(Math.random()-.5)*.08,z:(Math.random()-.5)*.08,d:Math.random()*.5});
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const pm=new THREE.PointsMaterial({color:$lc(dropCol),size:isPowder?.035:.07,transparent:true,depthWrite:false});const P=new THREE.Points(geo,pm);P.frustumCulled=false;L.scene.add(P);
  await L.tw(1100,k=>{for(let i=0;i<n;i++){const kk=clamp(k*1.6-sd[i].d,0,1);pos[i*3]=HX+sd[i].x;pos[i*3+1]=3.72-kk*.75;pos[i*3+2]=HZ+sd[i].z;}geo.attributes.position.needsUpdate=true;pm.opacity=k<.85?1:(1-k)/.15;});
  L.scene.remove(P);await L.tw(320,k=>obj.rotation.z=1.9*(1-ease(k)));await L.arc(obj,home,800,4.1);}
async function addSalt(){if(S.busy||S.salt)return;S.busy=true;sync();await pour(saltJar,0xffffff,true);S.salt=true;S.busy=false;
  toast('أُضيفت كبريتات الصوديوم: أصبح المحلول موصلًا للكهرباء (محلول إلكتروليتي).');if(S.on)S.saltOn=true;sync();render();}
async function addBtb(){if(S.busy||S.btb)return;S.busy=true;sync();await pour(btbJar,0x2f6fd0,false);S.btb=true;S.busy=false;
  toast('أُضيف كاشف بروموثيمول الأزرق: لونه أخضر في المحلول المتعادل.');sync();render();}
function record(){if(S.t<1||(S.vh<.1)){toast('أغلق الدائرة واجمع شيئًا من الغاز أولًا.');return;}if(S.rows.length>=8){toast('سُجّلت 8 قراءات؛ يكفي هذا للمقارنة.');return;}
  S.rows.push({t:S.t,vh:S.vh,vo:S.vo,n:S.n});P3.good();renderNB();render();}
const RES={'0burn':'تُسمع فرقعة (احتراق سريع)','0glow':'انطفأ التوهج ولم تشتعل','1glow':'اشتعلت الشظية المتوهجة من جديد','1burn':'ازداد اشتعال الشظية'};
async function test(i){if(S.busy)return;if(!S.splint){toast('اختر نوع الشظية أولًا من لوحة التحكم.');return;}
  const v=i?S.vo:S.vh;if(v<4){toast('اجمع 4 mL على الأقل من الغاز في هذا الأنبوب أولًا.');return;}
  if(S.on){setSwitch(false);toast('أُوقف التيار أثناء الاختبار.');}
  S.busy=true;sync();const type=S.splint;
  sp.set(type);sp.g.visible=true;sp.g.position.set(2.55,.9,1.15);
  const top=V(HX+TX[i],TT+.62,HZ);await L.arc(sp.g,top,1300,3.9);
  await L.tw(300,k=>handles[i].rotation.z=Math.PI/2*ease(k));
  const v0=v;await L.tw(900,k=>{if(i)S.vo=v0*(1-k);else S.vh=v0*(1-k);});
  const key=i+type;
  if(key==='0burn'){P3.pop();P3.flash(L,top.clone().add(V(0,.05,0)),0xfff0c0,1.6);sp.set('out');P3.smoke(L,top);S.idf[0]='H₂';}
  else if(key==='0glow'){sp.set('out');P3.smoke(L,top);}
  else if(key==='1glow'){P3.whoosh();sp.set('burn');S.idf[1]='O₂';}
  else{P3.whoosh();sp.set('bright');}
  S.tests[i]={type,res:RES[key]};toast((i?'أنبوب المصعد: ':'أنبوب المهبط: ')+RES[key]+'.');
  await sleep(1700);await L.tw(300,k=>handles[i].rotation.z=Math.PI/2*(1-ease(k)));
  await L.arc(sp.g,V(2.55,.9,1.15),900,3.9);sp.set('out');sp.g.visible=false;
  S.busy=false;if(S.idf[0]&&S.idf[1])P3.good();sync();renderNB();render();}
function testsNote(){const t=S.tests.map((x,i)=>x?`${i?'أنبوب المصعد':'أنبوب المهبط'}: ${x.type==='burn'?'شظية مشتعلة':'شظية متوهجة'} ← ${x.res}`:null).filter(Boolean);
  return t.length?'نتائج الكشف — '+t.join(' · '):'';}
function reset(){if(S.busy)return;Object.assign(S,{salt:false,btb:false,btbK:0,on:false,t:0,vh:0,vo:0,rows:[],tests:[null,null],idf:[null,null],splint:null,distTried:false,saltOn:false,pc:0,pa:0});
  piv.rotation.z=1.0;handles.forEach(h=>h.rotation.z=0);bub.clear();nH=nO=0;gms.length=0;sync();renderNB();render();toast('أُعيدت التجربة إلى بدايتها.');}

/* ---------- UI ---------- */
function stepIdx(){if(!S.salt)return 0;if(!S.saltOn)return 1;if(S.rows.length<3&&!(S.tests[0]||S.tests[1]))return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='جهّز المحلول';html=S.distTried?`<p class="p3-txt">لاحظت أن التيار ضئيل جدًا ولا تتصاعد فقاعات؛ لأن <b>الماء المقطر رديء التوصيل</b> للكهرباء. افتح الدائرة ثم أضف <b>كبريتات الصوديوم</b> ليصبح المحلول موصلًا.</p>`
      :`<p class="p3-txt">جهاز هوفمان مملوء بماء مقطر. <b>أغلق الدائرة أولًا</b> ولاحظ قراءة الأميتر والقطبين، ثم أضف كبريتات الصوديوم وقارن.</p>`;}
  else if(k===1){title='أغلق الدائرة';html=`<p class="p3-txt">أغلق المفتاح من لوحة التحكم أو بالضغط عليه في المشهد، ولاحظ الفقاعات عند القطبين. يمكنك إضافة <b>كاشف بروموثيمول الأزرق</b> لملاحظة تغيّر اللون قرب كل قطب.</p>`;}
  else if(k===2){title='اجمع الغازين وسجّل';html=`<p class="p3-txt">اقرأ حجم الغاز من أعلى كل أنبوب و<b>سجّل ثلاث قراءات</b> على الأقل. جرّب تغيير عدد البطاريات ولاحظ أثره في التيار وسرعة تجمّع الغاز.</p><p class="p3-eq">حجم المهبط ÷ حجم المصعد = <span class="elRatio">—</span></p>`;}
  else{const both=S.idf[0]&&S.idf[1];title=both?'أحسنت!':'اكشف عن الغازين';
    html=both?`<p class="p3-ok">غاز المهبط هيدروجين H₂، وغاز المصعد أكسجين O₂، وحجم الهيدروجين ضعف حجم الأكسجين.</p><p class="p3-eq">2H₂O → 2H₂ + O₂</p>`
      :`<p class="p3-txt">اختر الشظية المناسبة لكل أنبوب، ثم اضغط على الأنبوب في المشهد أو على زر الأنبوب. يُفتح الصنبور فيخرج الغاز نحو الشظية.</p><p class="p3-eq">حجم المهبط ÷ حجم المصعد = <span class="elRatio">—</span></p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){const r=S.rows;let h=`<table class="p3-t"><thead><tr><th>الزمن</th><th>المهبط (−) mL</th><th>المصعد (+) mL</th><th>النسبة</th></tr></thead><tbody>`;
  h+=r.length?r.map(x=>`<tr><td class="n">${fmtT(x.t)}</td><td class="n">${x.vh.toFixed(1)}</td><td class="n">${x.vo.toFixed(1)}</td><td class="n">${x.vo>.3?(x.vh/x.vo).toFixed(2):'—'}</td></tr>`).join(''):`<tr><td colspan="4" class="muted">اضغط «سجّل القراءة» أثناء جمع الغاز.</td></tr>`;
  h+='</tbody></table>';
  h+=`<table class="p3-t" style="margin-top:8px"><thead><tr><th>الأنبوب</th><th>الاختبار</th><th>الملاحظة</th></tr></thead><tbody>`+[0,1].map(i=>{const x=S.tests[i];return `<tr><td>${i?'المصعد (+)':'المهبط (−)'}</td><td>${x?(x.type==='burn'?'شظية مشتعلة':'شظية متوهجة'):'—'}</td><td>${x?x.res:'—'}</td></tr>`;}).join('')+'</tbody></table>';
  sec.$('.p3-nb').innerHTML=h;}
function sync(){const b=S.busy;
  sec.$('[data-a="salt"]').disabled=b||S.salt;sec.$('[data-a="salt"]').classList.toggle('done',S.salt);
  sec.$('[data-a="btb"]').disabled=b||S.btb;sec.$('[data-a="btb"]').classList.toggle('done',S.btb);
  sec.$$('[data-n]').forEach(x=>x.setAttribute('aria-pressed',+x.dataset.n===S.n));
  sec.$$('[data-sp]').forEach(x=>x.setAttribute('aria-pressed',+x.dataset.sp===S.sp));
  const s=sec.$('[data-a="sw"]');s.setAttribute('aria-pressed',S.on);s.textContent=S.on?'⏻ افتح الدائرة':'⏻ أغلق الدائرة';s.disabled=b;
  sec.$('[data-a="mol"]').setAttribute('aria-pressed',S.mol);
  sec.$$('[data-s]').forEach(x=>{x.setAttribute('aria-pressed',x.dataset.s===S.splint);x.disabled=b;});
  sec.$('.elTg').hidden=!S.splint;sec.$$('[data-t]').forEach(x=>x.disabled=b);
  lab.forEach(l=>l.classList.toggle('hot',!!S.splint&&!b));
  sec.$('[data-a="reset"]').disabled=b;}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const d=x.dataset;
  if(d.a==='salt')addSalt();else if(d.a==='btb')addBtb();else if(d.a==='sw')toggle();else if(d.a==='rec')record();else if(d.a==='reset')reset();
  else if(d.a==='mol'){S.mol=!S.mol;molBox.hidden=!S.mol;sync();}
  else if(d.n){S.n=+d.n;setCells();P3.click();sync();}
  else if(d.sp){S.sp=+d.sp;sync();}
  else if(d.s){S.splint=S.splint===d.s?null:d.s;sync();}
  else if(d.t!=null)test(+d.t);});
L.onTap(SW,toggle);
tubes.forEach((t,i)=>L.onTap(t,()=>{if(S.splint)test(i);else toast('هذا أنبوب '+(i?'المصعد (+)':'المهبط (−)')+'. لاختبار غازه اختر شظية أولًا.');}));
L.onTap(saltJar,addSalt);L.onTap(btbJar,addBtb);
setLevels();liquidColors();sync();render();renderNB();
};

/* =====================================================================
   ٢) تحضير الغازات والكشف عنها — O₂ · CO₂ · H₂
   ===================================================================== */
const GASP={};EXP_MODS.gasp=GASP;
GASP.init=function(){gm();
const GAS={o2:{n:'الأكسجين',f:'O₂',solid:'ثاني أكسيد المنجنيز MnO₂ (عامل حفّاز)',liq:'فوق أكسيد الهيدروجين H₂O₂',lq:'H₂O₂',sq:'MnO₂',eq:'2H₂O₂ → 2H₂O + O₂',rate:1},
  co2:{n:'ثاني أكسيد الكربون',f:'CO₂',solid:'رقائق الرخام CaCO₃',liq:'حمض الهيدروكلوريك المخفف HCl',lq:'HCl',sq:'CaCO₃',eq:'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂',rate:.85},
  h2:{n:'الهيدروجين',f:'H₂',solid:'حبيبات الخارصين Zn',liq:'حمض الهيدروكلوريك المخفف HCl',lq:'HCl',sq:'Zn',eq:'Zn + 2HCl → ZnCl₂ + H₂',rate:.7}};
const OUT={o2:{burn:'ازداد اشتعالها',glow:'اشتعلت من جديد',lime:'بقي رائقًا'},co2:{burn:'انطفأت',glow:'انطفأ التوهج',lime:'تعكّر (حليبي)'},h2:{burn:'فرقعة مسموعة',glow:'انطفأ التوهج',lime:'بقي رائقًا'}};
const TN={burn:'الشظية المشتعلة',glow:'الشظية المتوهجة',lime:'ماء الجير'};
const S={gas:null,ph:0,react:0,fill:0,busy:false,tube:null,obs:{o2:{},co2:{},h2:{}},unk:null,unkObs:{},unkAns:'',unkOk:null,last:null,accF:0,accO:0};
P3.dbg.gasp=S;const NAMES=['اختيار الغاز','إضافة المواد','جمع الغاز','الكشف عن الغاز'];
const sec=P3.section('gasp',{title:'تحضير الغازات والكشف عنها',grade:'ثالث متوسط · ثانوي',lesson:'تحضير الغازات',
  hud:`<div class="p3-m warm"><small>امتلاء أنبوب الجمع</small><b class="gpF">0%</b></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">الغاز</span><button class="p3-b" data-g="o2">O₂ الأكسجين</button><button class="p3-b" data-g="co2">CO₂ ثاني أكسيد الكربون</button><button class="p3-b" data-g="h2">H₂ الهيدروجين</button></div>
    <div class="p3-acts"><span class="p3-lab">التحضير</span><button class="p3-b" data-a="solid">① المادة الصلبة</button><button class="p3-b" data-a="liq">② افتح صنبور القمع</button></div>
    <div class="p3-acts"><span class="p3-lab">الجمع</span><button class="p3-b" data-a="place">③ ضع أنبوب الجمع</button><button class="p3-b" data-a="move">④ سُدّه وانقله</button></div>
    <div class="p3-acts"><span class="p3-lab">الكشف</span><button class="p3-b" data-t="burn">🔥 شظية مشتعلة</button><button class="p3-b" data-t="glow">✨ شظية متوهجة</button><button class="p3-b" data-t="lime">🥛 ماء الجير</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="new">↻ أنبوب جديد</button><button class="p3-b" data-a="unk">❓ غاز مجهول</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>تحضير الأكسجين</h3><p class="p3-eq">2H₂O₂ → 2H₂O + O₂</p><p>يتحلل فوق أكسيد الهيدروجين بسرعة بوجود ثاني أكسيد المنجنيز، وهو <b>عامل حفّاز</b> يسرّع التفاعل ولا يُستهلك.</p></div>
    <div class="panel"><h3>تحضير ثاني أكسيد الكربون</h3><p class="p3-eq">CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂</p><p>يتفاعل الرخام (كربونات الكالسيوم) مع الحمض المخفف فيتصاعد ثاني أكسيد الكربون.</p></div>
    <div class="panel"><h3>تحضير الهيدروجين</h3><p class="p3-eq">Zn + 2HCl → ZnCl₂ + H₂</p><p>يحل الخارصين محل الهيدروجين في الحمض فيتصاعد غاز الهيدروجين.</p></div>
    <div class="panel"><h3>الجمع والكشف</h3><p>تُجمع الغازات هنا <b>بإزاحة الماء</b>: يدخل الغاز أنبوبًا مقلوبًا مملوءًا بالماء فيدفع الماء إلى أسفل. تُترك الفقاعات الأولى لأنها هواء الدورق.</p>
      <p><b>O₂:</b> يعيد اشتعال الشظية المتوهجة. <b>H₂:</b> يحترق بفرقعة مع الشظية المشتعلة. <b>CO₂:</b> يعكّر ماء الجير ويطفئ الشظية المشتعلة.</p><p class="p3-eq">Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O</p></div>`,
  quiz:[{q:'ما دور ثاني أكسيد المنجنيز في تحضير الأكسجين؟',o:['مادة متفاعلة تُستهلك','عامل حفّاز يسرّع التفاعل','يمتص الأكسجين'],a:1},
        {q:'أي غاز يعكّر ماء الجير؟',o:['الأكسجين','الهيدروجين','ثاني أكسيد الكربون'],a:2},
        {q:'ماذا يحدث عند تقريب شظية مشتعلة من أنبوب فيه هيدروجين؟',o:['فرقعة مسموعة','تعكّر','لا شيء'],a:0},
        {q:'لماذا لا نجمع أول الفقاعات الخارجة من أنبوب التوصيل؟',o:['لأنها هواء كان في الدورق','لأنها بخار ماء','لأنها غاز سام'],a:0},
        {q:'ما ناتج تفاعل الخارصين مع حمض الهيدروكلوريك؟',o:['O₂','H₂','CO₂'],a:1}],
  report:()=>({title:'تحضير الغازات والكشف عنها',grade:'ثالث متوسط · ثانوي',lesson:'تحضير الغازات',cols:['الغاز','الشظية المشتعلة','الشظية المتوهجة','ماء الجير'],
    rows:['o2','co2','h2'].map(g=>[`${GAS[g].n} ${GAS[g].f}`,S.obs[g].burn||'',S.obs[g].glow||'',S.obs[g].lime||'']).concat(S.unk?[['الغاز المجهول',S.unkObs.burn||'',S.unkObs.glow||'',S.unkObs.lime||'']]:[]),
    note:'اكتب في ورقة التقرير اسم كل غاز والاختبار المميز له.'})
});
const L=new Lab(sec,{target:V(.65,1.3,.5),dist:a=>Math.max(5.4,10.2/a),exposure:.92});buildRoom(L);
const toast=m=>L.toast(m);

/* ---------- side-arm conical flask ---------- */
const FX=-2.0,FZ=.35;const FG=new THREE.Group();FG.position.set(FX,0,FZ);
const fpts=[[0,0],[.56,0],[.6,.04],[.6,.1],[.2,.98],[.17,1.05],[.17,1.42],[.2,1.45],[.185,1.47]].map(p=>new THREE.Vector2(p[0],p[1]));
const flask=new THREE.Mesh(new THREE.LatheGeometry(fpts,48),G.glass);flask.renderOrder=3;FG.add(flask);
const arm=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.3,14,1,true),G.glass);arm.rotation.z=Math.PI/2-.12;arm.position.set(.3,1.26,0);FG.add(arm);
const fr=y=>y<.1?.6:.6-.4*(y-.1)/.88;
const flM=G.water(0xcfe6ee,.52);const flLiq=new THREE.Mesh(new THREE.BufferGeometry(),flM);flLiq.renderOrder=1;FG.add(flLiq);
let flLvl=-1;function setFlask(lv){if(Math.abs(lv-flLvl)<.004)return;flLvl=lv;flLiq.visible=lv>.03;if(!flLiq.visible)return;flLiq.geometry.dispose();
  flLiq.geometry=new THREE.CylinderGeometry(fr(lv)-.03,.57,lv-.02,40);flLiq.position.y=(lv+.02)/2;}
setFlask(0);
// solids inside the flask (one instanced mesh per reagent)
const SOL={o2:{geo:new THREE.SphereGeometry(.03,6,5),mat:KIT.mat(0x1d1b1a,{roughness:.95}),n:110,sy:.45},
  co2:{geo:new THREE.IcosahedronGeometry(.07,0),mat:KIT.mat(0xece8e0,{roughness:.6}),n:16,sy:.7},
  h2:{geo:new THREE.DodecahedronGeometry(.048,0),mat:KIT.mat(0x9aa3a8,{metalness:.75,roughness:.35}),n:26,sy:.8}};
const dum=new THREE.Object3D();
Object.entries(SOL).forEach(([k,s])=>{s.im=new THREE.InstancedMesh(s.geo,s.mat,s.n);s.im.count=0;s.im.frustumCulled=false;s.pos=[];
  for(let i=0;i<s.n;i++){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*.36;s.pos.push(V(Math.cos(a)*r,.035+Math.random()*.02,Math.sin(a)*r));}FG.add(s.im);});
function setSolid(k,cnt,drop=0){const s=SOL[k];s.im.count=cnt;for(let i=0;i<cnt;i++){const p=s.pos[i];dum.position.set(p.x,p.y+drop*(1-((i%7)/7))*1.2,p.z);dum.rotation.set(i,i*2,i*3);dum.scale.set(1,s.sy,1);dum.updateMatrix();s.im.setMatrixAt(i,dum.matrix);}s.im.instanceMatrix.needsUpdate=true;}
// bung + tap funnel (lifts while adding the solid)
const BF=new THREE.Group();FG.add(BF);
const bung=new THREE.Mesh(new THREE.CylinderGeometry(.205,.165,.2,24),G.rubber);bung.position.y=1.47;bung.castShadow=true;
const stem=new THREE.Mesh(new THREE.CylinderGeometry(.028,.028,1.45,12,1,true),G.glass);stem.position.y=.55+.725;stem.renderOrder=3;
const tapB=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.16,16),G.glassS);tapB.rotation.x=Math.PI/2;tapB.position.y=2.0;
const tapH=new THREE.Group();tapH.position.set(0,2.0,.1);tapH.add(new THREE.Mesh(RBox(.22,.045,.045,.015),KIT.mat(0x2d3a40)));
const fpp=[[.03,2.06],[.12,2.13],[.26,2.36],[.27,2.5],[.2,2.68],[.07,2.76],[.07,2.86]];
const funnel=new THREE.Mesh(new THREE.LatheGeometry(fpp.map(p=>new THREE.Vector2(p[0],p[1])),40),G.glass);funnel.renderOrder=3;
const fstop=new THREE.Mesh(new THREE.CylinderGeometry(.085,.07,.1,16),KIT.mat(0x2d3a40));fstop.position.y=2.9;
const fnR=y=>{for(let i=0;i<fpp.length-1;i++){const[a,ya]=fpp[i],[b,yb]=fpp[i+1];if(y<=yb)return a+(b-a)*(y-ya)/(yb-ya);}return .07;};
const fnM=G.water(0xe4f2f4,.5);const fnLiq=new THREE.Mesh(new THREE.BufferGeometry(),fnM);fnLiq.renderOrder=1;
let fnL=-1;function setFunnel(lv){if(Math.abs(lv-fnL)<.004)return;fnL=lv;fnLiq.visible=lv>2.1;if(!fnLiq.visible)return;const p=[new THREE.Vector2(0,2.08)];for(let y=2.08;y<lv;y+=.03)p.push(new THREE.Vector2(fnR(y)*.88,y));p.push(new THREE.Vector2(fnR(lv)*.88,lv),new THREE.Vector2(0,lv));
  fnLiq.geometry.dispose();fnLiq.geometry=new THREE.LatheGeometry(p,32);}
const stream=new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,1.4,8),G.water(0xe4f2f4,.7));stream.position.y=1.3;stream.visible=false;
BF.add(bung,stem,tapB,tapH,funnel,fstop,fnLiq,stream);castAll(BF);
L.add(FG);
const fBub=Bubbles(160,{op:.65});FG.add(fBub.mesh);
const fLab=L.label('',V(FX,3.15,FZ),'small');show(fLab,false);
const dLab={classList:{toggle(){}},textContent:''};
/* ---------- delivery tubing ---------- */
const rub=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(FX+.44,1.22,FZ),V(FX+.62,1.35,FZ),V(FX+.82,1.75,FZ),V(FX+1.0,2.02,FZ)],false,'centripetal'),40,.05,10),G.rubber);rub.castShadow=true;
const dcur=new THREE.CatmullRomCurve3([V(FX+.96,2.0,FZ),V(FX+1.1,2.07,FZ),V(-.2,2.1,FZ),V(.25,2.1,FZ),V(.42,1.96,FZ),V(.45,1.6,FZ),V(.45,.5,FZ),V(.52,.29,FZ),V(.75,.24,FZ),V(.95,.28,FZ),V(1.0,.36,FZ)],false,'centripetal',.5);
const dtube=new THREE.Mesh(new THREE.TubeGeometry(dcur,160,.034,10),G.glassS);
L.add(rub,dtube);
/* ---------- pneumatic trough ---------- */
const TRX=1.05,TW=1.9,TD=1.0,THh=.75,WL=.59;const TRG=new THREE.Group();TRG.position.set(TRX,0,FZ);
const tg=new THREE.MeshPhysicalMaterial({color:0xe8f4f6,roughness:.06,transparent:true,opacity:.28,clearcoat:1,side:THREE.DoubleSide,depthWrite:false});tg.userData.keepEnv=1;tg.envMapIntensity=1.4;
[[TW,THh,0,0,TD/2],[TW,THh,0,0,-TD/2],[TD,THh,Math.PI/2,TW/2,0],[TD,THh,Math.PI/2,-TW/2,0]].forEach(([w,h,ry,x,z])=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),tg);p.rotation.y=ry;p.position.set(x,h/2,z);p.renderOrder=3;TRG.add(p);});
{const em=KIT.mat(0x6f8f99,{roughness:.4});[[TW,0,TD/2],[TW,0,-TD/2]].forEach(([w,x,z])=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w+.03,.03,.03),em);b.position.set(x,THh,z);TRG.add(b);});[[TW/2],[-TW/2]].forEach(([x])=>{const b=new THREE.Mesh(new THREE.BoxGeometry(.03,.03,TD+.03),em);b.position.set(x,THh,0);TRG.add(b);const v=new THREE.Mesh(new THREE.BoxGeometry(.03,THh,.03),em);v.position.set(x,THh/2,TD/2);TRG.add(v);});}
const tfl=new THREE.Mesh(new THREE.BoxGeometry(TW,.03,TD),KIT.mat(0xdfe8ea,{roughness:.4}));tfl.position.y=.015;TRG.add(tfl);
const twM=G.water(0xa9d6ea,.38);const tw=new THREE.Mesh(new THREE.BoxGeometry(TW-.02,WL-.03,TD-.02),twM);tw.position.y=.03+(WL-.03)/2;tw.renderOrder=1;TRG.add(tw);
// beehive shelf
const shelf=new THREE.Mesh(new THREE.CylinderGeometry(.25,.27,.42,24),M.ceramic);shelf.position.set(1.0-TRX,.21,0);
const shHole=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.01,16),KIT.mat(0x30363a));shHole.position.set(1.0-TRX,.425,0);
TRG.add(shelf,shHole);castAll(TRG);L.add(TRG);
const tBub=Bubbles(90,{op:.7});L.add(tBub.mesh);
/* ---------- collecting tube ---------- */
const CT=TestTube(.13,1.0);L.add(CT.g);
const TUBE_REST=V(1.62,1.08,FZ),TUBE_SHELF=V(1.0,1.43,FZ),TUBE_HOLD=V(2.95,.95,FZ);
function tubeHome(){CT.g.position.copy(TUBE_REST);CT.g.rotation.set(0,0,Math.PI);CT.g.scale.setScalar(1);CT.seg(0,CT.h);setCol(CT.lm,0xbfe2f0);CT.lm.opacity=.42;CT.stp.visible=false;}
tubeHome();
const tLab=L.label('أنبوب الجمع',V(1.62,1.35,FZ+.15),'small');
/* ---------- holder stand, limewater, splints ---------- */
const HS=KIT.stand(2.4);HS.position.set(3.3,0,FZ-.3);L.add(HS);
{const arm=new THREE.Mesh(new THREE.BoxGeometry(.04,.04,.45),M.steel);arm.position.set(2.95,1.55,FZ-.225);const boss=new THREE.Mesh(RBox(.1,.1,.1,.02),KIT.mat(0x222222));boss.position.set(2.95,1.55,FZ-.45);L.add(arm,boss);}
const ring=new THREE.Mesh(new THREE.TorusGeometry(.15,.02,8,24),KIT.mat(0x2d3a40));ring.rotation.x=Math.PI/2;ring.position.set(2.95,1.55,FZ);L.add(ring);
const LB=new THREE.Group();{const b=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.5,26),KIT.phys(0xf0f4f4,{roughness:.15,transparent:true,opacity:.6}));b.position.y=.25;b.renderOrder=3;
  const lq=new THREE.Mesh(new THREE.CylinderGeometry(.155,.155,.36,24),G.water(0xf2f6f4,.55));lq.position.y=.19;
  const nk=new THREE.Mesh(new THREE.CylinderGeometry(.06,.1,.12,16),KIT.phys(0xf0f4f4,{transparent:true,opacity:.6}));nk.position.y=.56;
  const lb=P3.card([{t:'ماء الجير',s:72},{t:'Ca(OH)₂',mono:1,s:58}],.3,.17);lb.position.set(0,.27,.172);LB.add(b,lq,nk,lb);castAll(LB);}
LB.position.set(3.75,0,FZ+.75);L.add(LB);
const sjar=new THREE.Group();{const b=new THREE.Mesh(new THREE.CylinderGeometry(.16,.14,.36,24,1,true),G.glass);b.position.y=.18;b.renderOrder=3;sjar.add(b);
  [-.05,.03,.06].forEach((x,i)=>{const s=new THREE.Mesh(new THREE.BoxGeometry(.035,.75,.035),KIT.mat(0xdcb683,{roughness:.85}));s.position.set(x,.37,(i-1)*.05);s.rotation.z=(i-1)*.12;sjar.add(s);});}
sjar.position.set(2.45,0,FZ+.95);L.add(sjar);
const sp=Splint();L.add(sp.g);
const hLab=L.label('',V(2.95,2.4,FZ),'gas');show(hLab,false);
/* watch glass with the chosen solid */
const WG=new THREE.Group();WG.position.set(-.75,0,FZ+.95);
const wgl=new THREE.Mesh(new THREE.LatheGeometry([[0,.0],[.2,.015],[.3,.06],[.31,.07]].map(p=>new THREE.Vector2(p[0],p[1])),36),G.glassS);wgl.position.y=.02;WG.add(wgl);
const wgS={};Object.entries(SOL).forEach(([k,s])=>{const im=new THREE.InstancedMesh(s.geo,s.mat,14);for(let i=0;i<14;i++){const a=i*2.4,r=.04+(i%5)*.03;dum.position.set(Math.cos(a)*r,.05+(i%3)*.012,Math.sin(a)*r);dum.rotation.set(i,i,i);dum.scale.set(1,s.sy,1);dum.updateMatrix();im.setMatrixAt(i,dum.matrix);}
  im.visible=false;WG.add(im);wgS[k]=im;});
L.add(WG);const wLab=L.label('',V(-.75,.42,FZ+.95),'small');show(wLab,false);

/* ---------- simulation ---------- */
const waterTop=()=>CT.g.position.y-Math.max(-.12,S.fill*CT.h);
P3.loop(L,(dt,t,now)=>{
  if(S.ph>=3&&S.gas){S.react+=dt;const r=GAS[S.gas].rate*Math.min(1,S.react/1.4);
    S.accF+=dt*r*42;while(S.accF>=1){S.accF--;const a=Math.random()*6.28,rr=Math.sqrt(Math.random())*.34;fBub.spawn(Math.cos(a)*rr,.06,Math.sin(a)*rr,.012+Math.random()*.016,()=>flLvl,.3+Math.random()*.25);}
    if(S.react>1.1){S.accO+=dt*r*8;while(S.accO>=1){S.accO--;const col=S.ph===4;
      tBub.spawn(1.0+(Math.random()-.5)*.02,.36,FZ+(Math.random()-.5)*.02,.03+Math.random()*.018,col?waterTop:WL-.01,.45,col?()=>{if(S.ph===4){S.fill=Math.min(1,S.fill+.024);if(S.fill>=1)full();}}:null);}}}
  fBub.update(dt,t);tBub.update(dt,t);sp.tick(now);
  if(S.ph===4||S.ph===5)CT.seg(S.fill*CT.h,CT.h);
  sec.$('.gpF').textContent=Math.round(S.fill*100)+'%';
  const fl=sec.$('.gpFill');if(fl)fl.textContent=Math.round(S.fill*100)+'%';
});
function full(){if(S.ph!==4)return;S.ph=5;P3.good();toast('امتلأ الأنبوب بالغاز. سُدّه بالسدادة وانقله إلى الحامل.');sync();render();}

/* ---------- actions ---------- */
function chooseGas(g){if(S.busy)return;resetApparatus();S.gas=g;S.ph=1;const G2=GAS[g];
  Object.entries(wgS).forEach(([k,im])=>im.visible=k===g);wLab.textContent=G2.sq;show(wLab,true);
  fLab.textContent=G2.lq;show(fLab,true);setCol(fnM,g==='o2'?0xe6f3f6:0xeef1e6);setFunnel(2.62);dLab.textContent='المزيج في الدورق';
  P3.click();sync();render();renderNB();}
async function addSolid(){if(S.busy||S.ph!==1)return;S.busy=true;sync();const home=WG.position.clone();
  await L.tw(600,k=>BF.position.y=1.15*ease(k));
  await L.arc(WG,V(FX+.05,2.0,FZ),900,2.6);await L.tw(300,k=>WG.rotation.z=1.4*ease(k));wgS[S.gas].visible=false;
  const s=SOL[S.gas];await L.tw(700,k=>setSolid(S.gas,s.n,1-ease(k)));setSolid(S.gas,s.n,0);P3.tone(240,.06,'square',.05);
  await L.tw(300,k=>WG.rotation.z=1.4*(1-ease(k)));await L.arc(WG,home,800,2.6);
  await L.tw(600,k=>BF.position.y=1.15*(1-ease(k)));S.ph=2;S.busy=false;
  toast('وُضعت المادة الصلبة وأُحكمت السدادة. افتح صنبور القمع لإضافة السائل.');sync();render();}
async function addLiquid(){if(S.busy||S.ph!==2)return;S.busy=true;sync();
  await L.tw(300,k=>tapH.rotation.z=Math.PI/2*ease(k));stream.visible=true;
  await L.tw(2200,k=>{setFunnel(2.62-.48*k);setFlask(.36*k);});stream.visible=false;await L.tw(300,k=>tapH.rotation.z=Math.PI/2*(1-ease(k)));
  S.ph=3;S.react=0;S.busy=false;setTimeout(()=>{if(S.ph===3)toast('الفقاعات الأولى هواء الدورق… انتظر قليلًا ثم ضع أنبوب الجمع.');},600);sync();render();}
async function placeTube(){if(S.busy||S.ph!==3)return;if(S.react<2.6){toast('انتظر حتى تخرج فقاعات الهواء الأولى من أنبوب التوصيل.');return;}
  S.busy=true;sync();show(tLab,false);await L.move(CT.g,V(1.62,1.47,FZ),500);await L.move(CT.g,V(1.0,1.47,FZ),700);await L.move(CT.g,TUBE_SHELF,300);
  S.fill=0;S.ph=4;S.busy=false;toast('الأنبوب فوق الرف: يتجمع الغاز في أعلاه ويدفع الماء إلى أسفل.');sync();render();}
async function moveTube(){if(S.busy||S.ph!==5)return;S.busy=true;sync();
  CT.stp.visible=true;CT.stp.scale.setScalar(.01);await L.tw(300,k=>CT.stp.scale.setScalar(.01+.99*k));
  const p0=CT.g.position.clone();await L.move(CT.g,V(p0.x,2.3,p0.z),500);CT.seg(0,0);
  const r0=CT.g.rotation.z,pA=CT.g.position.clone();await L.tw(1100,k=>{const e=ease(k);CT.g.position.copy(lerpV(pA,V(TUBE_HOLD.x,2.2,TUBE_HOLD.z),e));CT.g.rotation.z=r0*(1-e);});
  await L.move(CT.g,TUBE_HOLD,500);S.ph=6;S.tube={gas:S.gas,unknown:false,used:false};hLab.textContent=GAS[S.gas].f;show(hLab,true);S.busy=false;
  toast('الأنبوب على الحامل. اختر اختبار الكشف من لوحة التحكم.');sync();render();}
async function freshTube(){if(S.busy||!S.tube||!S.tube.used)return;S.busy=true;sync();
  await L.tw(350,k=>CT.g.scale.setScalar(1-k*.98));CT.seg(0,0);setCol(CT.lm,0xbfe2f0);CT.lm.opacity=.42;CT.stp.visible=true;CT.stp.position.set(0,CT.h+.045,0);CT.stp.rotation.set(0,0,0);
  CT.g.rotation.set(0,0,0);CT.g.position.copy(TUBE_HOLD);await L.tw(400,k=>CT.g.scale.setScalar(.02+.98*ease(k)));S.tube.used=false;S.busy=false;toast('أنبوب جديد مملوء بالغاز نفسه.');sync();}
async function unknown(){if(S.busy)return;resetApparatus();const ks=['o2','co2','h2'];S.unk=ks[Math.floor(Math.random()*3)];S.unkObs={};S.unkAns='';S.unkOk=null;
  CT.g.rotation.set(0,0,0);CT.g.position.copy(TUBE_HOLD);CT.seg(0,0);CT.stp.visible=true;show(tLab,false);CT.g.scale.setScalar(.02);
  await L.tw(400,k=>CT.g.scale.setScalar(.02+.98*ease(k)));S.tube={gas:S.unk,unknown:true,used:false};hLab.textContent='؟ غاز مجهول';show(hLab,true);
  toast('أنبوب فيه غاز مجهول: أجرِ الاختبارات ثم حدّد الغاز في دفتر المختبر.');sync();render();renderNB();}
const MOUTH=()=>V(TUBE_HOLD.x,TUBE_HOLD.y+CT.h,TUBE_HOLD.z);
async function runTest(type){if(S.busy)return;if(!S.tube){toast(S.ph>=4?'انقل الأنبوب إلى الحامل أولًا.':'حضّر الغاز واجمعه أولًا، أو جرّب «غاز مجهول».');return;}
  if(S.tube.used){toast('استُخدم غاز هذا الأنبوب. اضغط «أنبوب جديد» لإجراء اختبار آخر.');return;}
  S.busy=true;sync();const g=S.tube.gas,m=MOUTH();
  const sp0=CT.stp.position.clone();
  if(type!=='lime'){await L.tw(350,k=>{CT.stp.position.set(sp0.x+.35*k,sp0.y+.25*Math.sin(Math.PI*k*.5),sp0.z);});CT.stp.visible=false;
    sp.set(type);sp.g.visible=true;sp.g.position.set(2.45,.9,FZ+.95);await L.arc(sp.g,V(m.x,m.y+.25,m.z),1100,2.9);await L.move(sp.g,V(m.x,m.y-.12,m.z),400);
    const tip=V(m.x,m.y-.1,m.z);
    if(type==='burn'){if(g==='h2'){P3.pop();P3.flash(L,tip.clone().add(V(0,.12,0)),0xfff0c0,1.5);sp.set('out');P3.smoke(L,tip);}else if(g==='co2'){sp.set('out');P3.smoke(L,tip);P3.noise(.3,.2,300);}else{P3.whoosh();sp.set('bright');}}
    else{if(g==='o2'){P3.whoosh();sp.set('burn');}else{sp.set('out');P3.smoke(L,tip);}}
    await sleep(1600);await L.move(sp.g,V(m.x,m.y+.3,m.z),300);await L.arc(sp.g,V(2.45,.9,FZ+.95),800,2.9);sp.set('out');sp.g.visible=false;}
  else{const home=LB.position.clone();await L.tw(350,k=>{CT.stp.position.set(sp0.x+.35*k,sp0.y+.25*Math.sin(Math.PI*k*.5),sp0.z);});CT.stp.visible=false;
    await L.arc(LB,V(m.x+.42,m.y+.2,m.z),900,2.9);await L.tw(350,k=>LB.rotation.z=1.75*ease(k));setCol(CT.lm,0xeef6f4);CT.lm.opacity=.5;
    await L.tw(900,k=>CT.seg(0,.3*k));await L.tw(300,k=>LB.rotation.z=1.75*(1-ease(k)));await L.arc(LB,home,800,2.9);
    CT.stp.position.copy(sp0);CT.stp.visible=true;
    await L.tw(1200,k=>CT.g.rotation.z=Math.sin(k*Math.PI*6)*.22*(1-k));CT.g.rotation.z=0;
    if(g==='co2'){const c0=new THREE.Color(0xeef6f4),c1=new THREE.Color(0xf6f5ef);await L.tw(1400,k=>{CT.lm.color.copy(c0.clone().lerp(c1,k)).convertSRGBToLinear();CT.lm.opacity=.5+.42*k;});}
    await sleep(400);}
  CT.stp.position.copy(sp0);CT.stp.visible=type==='lime';S.tube.used=true;
  const res=OUT[g][type];S.last=`${TN[type]}: ${res}`;if(S.tube.unknown)S.unkObs[type]=res;else S.obs[g][type]=res;
  toast(S.last+'.');P3.click();S.busy=false;sync();render();renderNB();}
function resetApparatus(){S.ph=0;S.gas=null;S.react=0;S.fill=0;S.tube=null;S.unk=null;S.last=null;S.accF=S.accO=0;
  fBub.clear();tBub.clear();Object.keys(SOL).forEach(k=>setSolid(k,0));setFlask(0);setFunnel(0);BF.position.y=0;tapH.rotation.z=0;stream.visible=false;
  Object.values(wgS).forEach(im=>im.visible=false);show(wLab,false);show(fLab,false);dLab.textContent='';show(hLab,false);show(tLab,true);WG.rotation.z=0;tubeHome();}
function reset(){if(S.busy)return;resetApparatus();S.obs={o2:{},co2:{},h2:{}};S.unkObs={};sync();render();renderNB();toast('أُعيدت التجربة إلى بدايتها.');}

/* ---------- UI ---------- */
function stepIdx(){if(S.tube)return 3;if(!S.gas)return 0;if(S.ph<3)return 1;return 2;}
function render(){const k=stepIdx(),g=S.gas&&GAS[S.gas];let title,html;
  if(k===0){title='اختر الغاز';html=`<p class="p3-txt">اختر الغاز الذي تريد تحضيره، فتظهر موادّه على الطاولة. أو اضغط <b>«غاز مجهول»</b> لتحدٍّ سريع في الكشف.</p>`;}
  else if(k===1){title='تحضير '+g.n;html=`<p class="p3-txt"><b>المادة الصلبة:</b> ${g.solid}<br><b>السائل:</b> ${g.liq}<br>${S.ph===1?'ضع المادة الصلبة في الدورق أولًا.':'افتح صنبور القمع لإضافة السائل.'}</p><p class="p3-eq">${g.eq}</p>`;}
  else if(k===2){title='اجمع الغاز بإزاحة الماء';html=S.ph===3?`<p class="p3-txt">تتصاعد الفقاعات في الدورق. الفقاعات الأولى <b>هواء الدورق</b>؛ انتظر قليلًا ثم ضع أنبوب الجمع المملوء بالماء فوق الرف.</p>`
      :S.ph===4?`<p class="p3-txt">يدخل الغاز الأنبوب المقلوب ويدفع الماء إلى أسفل… <b class="gpFill">0%</b></p>`:`<p class="p3-txt">امتلأ الأنبوب بالغاز. <b>سُدّه بالسدادة</b> وهو تحت الماء، ثم انقله إلى الحامل.</p>`;}
  else{const u=S.tube.unknown;title=u?'حدّد الغاز المجهول':'اكشف عن '+GAS[S.tube.gas].n;
    html=`<p class="p3-txt">اختر اختبارًا: شظية مشتعلة، أو شظية متوهجة، أو ماء الجير. كل اختبار يحتاج <b>أنبوبًا جديدًا</b> من الغاز.</p>${S.last?`<p class="p3-ok">${S.last}</p>`:''}${u&&S.unkOk?'<p class="p3-ok">إجابة صحيحة!</p>':''}`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){let h=`<table class="p3-t"><thead><tr><th>الغاز</th><th>مشتعلة</th><th>متوهجة</th><th>ماء الجير</th></tr></thead><tbody>`+
  ['o2','co2','h2'].map(g=>`<tr><td>${GAS[g].f}</td><td>${S.obs[g].burn||'—'}</td><td>${S.obs[g].glow||'—'}</td><td>${S.obs[g].lime||'—'}</td></tr>`).join('');
  if(S.unk)h+=`<tr><td>؟</td><td>${S.unkObs.burn||'—'}</td><td>${S.unkObs.glow||'—'}</td><td>${S.unkObs.lime||'—'}</td></tr>`;
  h+='</tbody></table>';
  if(S.unk)h+=`<div class="p3-acts" style="margin-top:8px"><span class="p3-lab">الغاز المجهول هو</span><select class="gpSel" aria-label="الغاز المجهول"><option value="">اختر</option>${['o2','co2','h2'].map(g=>`<option value="${g}" ${S.unkAns===g?'selected':''}>${GAS[g].n} ${GAS[g].f}</option>`).join('')}</select><button class="p3-b" data-a="chk">تحقق</button><span class="p3-fb ${S.unkOk==null?'':S.unkOk?'ok':'bad'}">${S.unkOk==null?'':S.unkOk?'✓ صحيح':'✗ راجع نتائج الاختبارات'}</span></div>`;
  sec.$('.p3-nb').innerHTML=h;const sel=sec.$('.gpSel');if(sel)sel.onchange=()=>{S.unkAns=sel.value;};}
function sync(){const b=S.busy,ph=S.ph;
  sec.$$('[data-g]').forEach(x=>{x.setAttribute('aria-pressed',x.dataset.g===S.gas);x.disabled=b;});
  const set=(a,dis,done)=>{const x=sec.$(`[data-a="${a}"]`);x.disabled=b||dis;x.classList.toggle('done',!!done);};
  set('solid',ph!==1,ph>=2&&ph<7&&S.gas);set('liq',ph!==2,ph>=3&&S.gas);set('place',ph!==3,ph>=4&&S.gas);set('move',ph!==5,ph>=6&&S.gas);
  set('new',!(S.tube&&S.tube.used));set('unk',false);set('reset',false);
  sec.$$('[data-t]').forEach(x=>x.disabled=b||!S.tube||S.tube.used);}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const d=x.dataset;
  if(d.g)chooseGas(d.g);else if(d.a==='solid')addSolid();else if(d.a==='liq')addLiquid();else if(d.a==='place')placeTube();else if(d.a==='move')moveTube();
  else if(d.a==='new')freshTube();else if(d.a==='unk')unknown();else if(d.a==='reset')reset();
  else if(d.a==='chk'){if(!S.unkAns){toast('اختر اسم الغاز أولًا.');return;}S.unkOk=S.unkAns===S.unk;if(S.unkOk)P3.good();else{try{L2.bad(x);}catch(err){}}renderNB();render();}
  else if(d.t)runTest(d.t);});
L.onTap(WG,()=>{if(S.ph===1)addSolid();});L.onTap(tapH,()=>{if(S.ph===2)addLiquid();});L.onTap(funnel,()=>{if(S.ph===2)addLiquid();});
L.onTap(CT.g,()=>{if(S.ph===3)placeTube();else if(S.ph===5)moveTube();});
sync();render();renderNB();
};

/* =====================================================================
   ٣) الكشف باللهب — ألوان لهب أيونات الفلزات
   ===================================================================== */
const FLAME={};EXP_MODS.flame=FLAME;
FLAME.init=function(){gm();
const SALTS=[
  {id:'li',f:'LiCl',n:'كلوريد الليثيوم',ion:'Li⁺',col:0xff1f4b,cn:'قرمزي',pw:0xf4f1ea},
  {id:'na',f:'NaCl',n:'كلوريد الصوديوم',ion:'Na⁺',col:0xffb11a,cn:'أصفر برتقالي',pw:0xf7f7f2},
  {id:'k',f:'KCl',n:'كلوريد البوتاسيوم',ion:'K⁺',col:0xc48cff,cn:'بنفسجي فاتح (ليلكي)',pw:0xf5f5f0},
  {id:'ca',f:'CaCl₂',n:'كلوريد الكالسيوم',ion:'Ca²⁺',col:0xff5a1a,cn:'أحمر طوبي (برتقالي محمر)',pw:0xf2efe8},
  {id:'sr',f:'SrCl₂',n:'كلوريد السترونشيوم',ion:'Sr²⁺',col:0xff1a1a,cn:'أحمر',pw:0xf4f2ee},
  {id:'ba',f:'BaCl₂',n:'كلوريد الباريوم',ion:'Ba²⁺',col:0xa8ff4a,cn:'أخضر تفاحي (أخضر مصفر)',pw:0xf6f6f1},
  {id:'cu',f:'CuCl₂',n:'كلوريد النحاس (II)',ion:'Cu²⁺',col:0x1fe6b0,cn:'أخضر مزرق',pw:0x3f9f8f}];
const SB={};SALTS.forEach(s=>SB[s.id]=s);
const S={lit:false,air:.15,cobalt:false,busy:false,loop:'new',rec:{},recCob:{},unk:SALTS[Math.floor(Math.random()*SALTS.length)].id,unkSeen:null,unkAns:'',unkOk:null,airTold:false,last:null};
P3.dbg.flame=S;const NAMES=['إشعال الموقد','ضبط اللهب الأزرق','تنظيف السلك','الكشف عن الأملاح'];
const sec=P3.section('flame',{title:'الكشف باللهب',grade:'ثالث متوسط · ثانوي',lesson:'الكشف عن العناصر',
  hud:`<div class="p3-m warm" style="min-width:170px"><small>لون اللهب الملاحظ</small><b class="flC" style="font-family:var(--f-body);font-size:1.05rem">—</b></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><button class="p3-b pri" data-a="lit">🔥 أشعل الموقد</button><label class="p3-rng">فتحة الهواء<input type="range" min="0" max="100" value="15" class="flAir" aria-label="فتحة الهواء"></label></div>
    <div class="p3-acts"><button class="p3-b" data-a="clean">🧪 نظّف السلك بالحمض</button><button class="p3-b" data-a="cob">🔷 الزجاج الأزرق</button></div>
    <div class="p3-salts">${SALTS.map(s=>`<button class="p3-b" data-s="${s.id}" title="${s.n}">${s.f}</button>`).join('')}<button class="p3-b" data-s="x" title="عيّنة مجهولة">X ؟</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة التجربة</button></div></div>`,
  learn:`<div class="panel"><h3>لماذا يتلوّن اللهب؟</h3><p>عند تسخين مركّب الفلز في اللهب تمتص إلكترونات أيون الفلز طاقة فتنتقل إلى مستويات طاقة أعلى، وعند عودتها تطلق الطاقة على شكل ضوء له <b>لون مميّز لكل عنصر</b>.</p></div>
    <div class="panel"><h3>ألوان اللهب</h3>${SALTS.map(s=>`<p>${sw(s.col,'')}<b>${s.ion}</b> (${s.n}): ${s.cn}</p>`).join('')}</div>
    <div class="panel"><h3>خطوات صحيحة</h3><p>١) استخدم <b>لهبًا أزرق غير مضيء</b> (فتحة الهواء مفتوحة) لأن اللهب الأصفر يحجب الألوان.</p><p>٢) <b>نظّف السلك</b> بغمسه في حمض الهيدروكلوريك ثم تسخينه حتى لا يلوّن اللهب، وكرّر ذلك قبل كل عيّنة.</p><p>٣) الزجاج الأزرق (زجاج الكوبالت) يحجب لون الصوديوم الأصفر، فيُرى لون البوتاسيوم حتى لو كانت العيّنة ملوّثة بالصوديوم.</p></div>`,
  quiz:[{q:'ما لون لهب أيون الصوديوم Na⁺؟',o:['أصفر برتقالي','أخضر مزرق','قرمزي'],a:0},
        {q:'لماذا يُنظَّف السلك بحمض الهيدروكلوريك قبل كل عيّنة؟',o:['لتسخينه أسرع','لإزالة بقايا العيّنة السابقة','لتغيير لون اللهب'],a:1},
        {q:'أي أيون يعطي لهبًا أخضر مزرقًا؟',o:['K⁺','Cu²⁺','Ca²⁺'],a:1},
        {q:'لماذا نستخدم اللهب الأزرق غير المضيء؟',o:['لأنه أبرد','لأنه لا يحجب ألوان العيّنات','لأنه أسهل إشعالًا'],a:1},
        {q:'ما فائدة الزجاج الأزرق (الكوبالت)؟',o:['يحجب لون الصوديوم الأصفر','يزيد حرارة اللهب','يلوّن اللهب بالأزرق'],a:0}],
  report:()=>({title:'الكشف باللهب',grade:'ثالث متوسط · ثانوي',lesson:'الكشف عن العناصر',cols:['الملح','الأيون','لون اللهب'],
    rows:SALTS.map(s=>[`${s.n} ${s.f}`,s.ion,S.rec[s.id]?s.cn:'']).concat([['العيّنة المجهولة X','',S.unkSeen?SB[S.unk].cn:'']]),
    note:'حدّد الأيون في العيّنة المجهولة بمقارنة لون لهبها بالألوان المسجلة.'})
});
const L=new Lab(sec,{target:V(0,1.0,.85),dist:a=>Math.max(5.4,9.8/a),exposure:.88});buildRoom(L);
const toast=m=>L.toast(m);
/* ---------- Bunsen burner ---------- */
const BX=0,BZ=.25,BY=1.15;const BG=new THREE.Group();BG.position.set(BX,0,BZ);
const bbase=new THREE.Mesh(new THREE.CylinderGeometry(.3,.35,.08,32),KIT.mat(0x2f363c,{metalness:.5,roughness:.4}));bbase.position.y=.04;
const bcone=new THREE.Mesh(new THREE.CylinderGeometry(.09,.24,.08,28),KIT.mat(0x2f363c,{metalness:.5,roughness:.4}));bcone.position.y=.12;
const btube=new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,BY-.14,24),M.steel);btube.position.y=.14+(BY-.14)/2;
const collar=new THREE.Group();collar.position.y=.33;
const col=new THREE.Mesh(new THREE.CylinderGeometry(.083,.083,.18,24,1,true),KIT.mat(0xc49a3a,{metalness:.85,roughness:.3,side:THREE.DoubleSide}));
const hole=new THREE.Mesh(new THREE.CircleGeometry(.04,16),new THREE.MeshBasicMaterial({color:0x0a0a0a}));hole.position.set(0,0,.084);
const hole2=hole.clone();hole2.position.set(0,0,-.084);hole2.rotation.y=Math.PI;collar.add(col,hole,hole2);
const barb=new THREE.Mesh(new THREE.CylinderGeometry(.025,.03,.22,12),G.brass);barb.rotation.z=Math.PI/2;barb.position.set(.2,.14,0);
const mouth=new THREE.Mesh(new THREE.TorusGeometry(.065,.01,8,24),M.steel);mouth.rotation.x=Math.PI/2;mouth.position.y=BY;
BG.add(bbase,bcone,btube,collar,barb,mouth);castAll(BG);L.add(BG);
// dark matte screen behind the burner (flame tests are viewed against a dark background)
const scr=new THREE.Group();{const p=new THREE.Mesh(RBox(1.9,1.9,.05,.03),KIT.mat(0x0d1114,{roughness:.95}));p.position.y=1.95;
  const f1=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,1.0,10),M.steel);f1.position.set(-.8,.5,0);const f2=f1.clone();f2.position.x=.8;
  const ft=new THREE.Mesh(RBox(1.9,.05,.3,.01),KIT.mat(0x2d3a40));ft.position.y=.025;scr.add(p,f1,f2,ft);castAll(scr);}
scr.position.set(BX,0,BZ-.75);L.add(scr);
const flame=Flame({s:1.35});flame.g.position.set(BX,BY,BZ);flame.S.air=S.air;L.add(flame.g);
// gas tap + hose
const GT=new THREE.Group();GT.position.set(1.7,0,-1.3);
const gtp=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,.42,16),G.brass);gtp.position.y=.21;
const gtl=new THREE.Group();gtl.position.set(0,.36,.07);gtl.add(new THREE.Mesh(RBox(.05,.32,.05,.02),KIT.mat(0x1c1c1c)));gtl.children[0].position.y=.12;gtl.rotation.x=0;
const gtn=new THREE.Mesh(new THREE.CylinderGeometry(.025,.03,.2,12),G.brass);gtn.rotation.x=Math.PI/2;gtn.position.set(0,.3,.12);
GT.add(gtp,gtl,gtn);castAll(GT);L.add(GT);
const hose=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(1.7,.3,-1.08),V(1.72,.12,-.85),V(1.4,.04,-.4),V(.8,.04,.05),V(.45,.1,.25),V(.31,.14,BZ)],false,'centripetal'),80,.045,10),KIT.mat(0xd8692b,{roughness:.6}));hose.castShadow=true;L.add(hose);
/* ---------- HCl beaker ---------- */
const KX=-1.75,KZ=.35;const KB=new THREE.Group();KB.position.set(KX,0,KZ);
const kpts=[[0,0],[.25,0],[.27,.03],[.27,.6],[.3,.63],[.26,.62]].map(p=>new THREE.Vector2(p[0],p[1]));
const kgl=new THREE.Mesh(new THREE.LatheGeometry(kpts,40),G.glass);kgl.renderOrder=3;
const kl=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.3,32),G.water(0xeaf3dc,.48));kl.position.y=.16;kl.renderOrder=1;
const kc=P3.card([{t:'HCl',mono:1,s:110}],.28,.14);kc.position.set(0,.45,.275);
KB.add(kgl,kl,kc);L.add(KB);
/* ---------- wire loop ---------- */
const LP=new THREE.Group();
const wm=KIT.mat(0xc9ccd0,{metalness:.9,roughness:.3});
const ringM=new THREE.Mesh(new THREE.TorusGeometry(.036,.0075,8,24),wm);ringM.position.y=.036;
const wire=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.46,6),wm);wire.position.y=.3;
const hdl=new THREE.Mesh(new THREE.CylinderGeometry(.03,.034,.55,14),KIT.mat(0x22313a,{roughness:.5}));hdl.position.y=.53+.275;
const blob=new THREE.Mesh(new THREE.SphereGeometry(.03,12,10),KIT.mat(0xffffff,{roughness:.9}));blob.position.y=.036;blob.visible=false;
const hot=new THREE.Sprite(new THREE.SpriteMaterial({map:P3.glowTex(),color:$lc(0xff5a1a),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));hot.scale.setScalar(.16);hot.position.y=.04;hot.renderOrder=10;
LP.add(ringM,wire,hdl,blob,hot);castAll(LP);L.add(LP);
const holder=new THREE.Mesh(RBox(.28,.2,.28,.03),KIT.wood(0x8a5a32));holder.position.set(-.95,.1,1.0);holder.castShadow=true;L.add(holder);
const Q_WORK=P3.qFrom(.55,.5,.67),Q_REST=P3.qFrom(.1,-1,.06);
const HOLD=V(-.95,.2,1.0);const REST=HOLD.clone().sub(V(0,1.08,0).applyQuaternion(Q_REST));
LP.position.copy(REST);LP.quaternion.copy(Q_REST);
const FE=V(BX+.12,BY+.42,BZ+.05);
const CAM_F=V(BX,BY+1.15,BZ+3.7),TGT_F=V(BX,BY+.65,BZ);
async function focus(on){const c=L.controls,p0=L.camera.position.clone(),t0=c.target.clone();
  const p1=on?CAM_F:L.camHome,t1=on?TGT_F:L.tgt;await L.tw(700,k=>{const e=ease(k);L.camera.position.copy(lerpV(p0,p1,e));c.target.copy(lerpV(t0,t1,e));});}
async function moveLoop(p,q,d){const p0=LP.position.clone(),q0=LP.quaternion.clone();await L.tw(d,k=>{const e=ease(k);LP.position.copy(lerpV(p0,p,e));LP.quaternion.copy(q0).slerp(q,e);});}
/* ---------- sample dishes ---------- */
const DZ=1.6,DX=[-2.45,-1.75,-1.05,-.35,.35,1.05,1.75,2.45];
const dpts=[[0,0],[.22,0],[.27,.05],[.28,.075],[.262,.075],[.21,.028],[0,.028]].map(p=>new THREE.Vector2(p[0],p[1]));
const dishes={};
[...SALTS,{id:'x'}].forEach((s,i)=>{const g=new THREE.Group();g.position.set(DX[i],0,DZ);
  const d=new THREE.Mesh(new THREE.LatheGeometry(dpts,36),M.ceramic);d.castShadow=true;
  const pc=s.id==='x'?SB[S.unk].pw:s.pw;const pw=new THREE.Mesh(new THREE.SphereGeometry(.15,20,10),KIT.mat(pc,{roughness:.95}));pw.scale.y=.32;pw.position.y=.035;
  const c=P3.card(s.id==='x'?[{t:'X',mono:1,s:96},{t:'عيّنة مجهولة',s:56}]:[{t:s.f,mono:1,s:88},{t:s.n,s:50}],.6,.27,s.id==='x'?{bd:'#e0703f'}:{});
  c.position.set(0,.13,.38);c.rotation.x=-.95;g.add(d,pw,c);L.add(g);dishes[s.id]={g,x:DX[i],pw};});
/* ---------- cobalt glass ---------- */
const CB=new THREE.Group();
const cpl=new THREE.Mesh(new THREE.PlaneGeometry(.95,1.05),new THREE.MeshPhysicalMaterial({color:0x1d3cff,roughness:.1,transparent:true,opacity:.5,clearcoat:1,side:THREE.DoubleSide,depthWrite:false}));cpl.renderOrder=12;cpl.material.userData.keepEnv=1;
const cfr=new THREE.Mesh(new THREE.BoxGeometry(1.0,.05,.05),KIT.mat(0x2d3a40));cfr.position.y=-.55;
const cst=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,1.0,10),M.steel);cst.position.y=-1.05;
const cft=new THREE.Mesh(RBox(.3,.04,.2,.01),KIT.mat(0x2d3a40));cft.position.y=-1.55;
CB.add(cpl,cfr,cst,cft);L.add(CB);
const CB_OFF={p:V(2.25,1.57,.25),r:-1.25},CB_ON={p:V(BX,1.57,BZ+.85),r:0};CB.position.copy(CB_OFF.p);CB.rotation.y=CB_OFF.r;
L.label('موقد بنزن',V(BX-.5,.55,BZ+.2),'small');L.label('حمض HCl للتنظيف',V(KX,.95,KZ),'small');L.label('سلك النيكروم',V(REST.x,REST.y+.25,REST.z),'small');L.label('صنبور الغاز',V(1.7,.75,-1.3),'small');

/* ---------- colours ---------- */
function cobaltOf(h,id){if(id==='na')return 0x060410;const c=new THREE.Color(h);return new THREE.Color(c.r*.62,c.g*.08,Math.min(1,c.b+c.r*.12)).getHex();}
function shown(hex,id,prevHex,prevId){let a=S.cobalt?cobaltOf(hex,id):hex;if(prevHex!=null){const b=S.cobalt?cobaltOf(prevHex,prevId):prevHex;a=prevId==='na'&&!S.cobalt?mixHex(a,b,.7):mixHex(a,b,.5);}return a;}
const flC=sec.$('.flC');

P3.loop(L,(dt,t,now)=>{flame.tick(now);});

/* ---------- actions ---------- */
function setAir(v){S.air=v;flame.S.air=v;collar.rotation.y=v*Math.PI*.9;
  if(S.lit&&v>=.6&&!S.airTold){S.airTold=true;toast('لهب أزرق غير مضيء: مناسب للكشف لأنه لا يحجب الألوان.');}render();}
async function lit(){if(S.busy)return;S.lit=!S.lit;const a0=gtl.rotation.x,a1=S.lit?-1.4:0;await L.tw(250,k=>gtl.rotation.x=a0+(a1-a0)*ease(k));
  if(S.lit){P3.spark();setTimeout(()=>{flame.S.on=true;P3.whoosh();},180);toast(S.air<.6?'اشتعل الموقد بلهب أصفر مضيء. افتح فتحة الهواء للحصول على لهب أزرق.':'اشتعل الموقد بلهب أزرق.');}
  else flame.S.on=false;sync();render();}
async function clean(){if(S.busy)return;if(!S.lit){toast('أشعل الموقد أولًا.');return;}S.busy=true;sync();await doClean();
  await moveLoop(REST,Q_REST,850);S.busy=false;toast('السلك نظيف: لم يعد يلوّن اللهب.');sync();render();}
async function doClean(){
  await moveLoop(V(KX,.95,KZ),Q_WORK,700);await moveLoop(V(KX,.22,KZ),Q_WORK,350);await sleep(250);await moveLoop(V(KX,.95,KZ),Q_WORK,350);await moveLoop(FE,Q_WORK,750);
  hot.material.opacity=.9;const prev=S.loop;
  if(prev!=='clean'){const p=prev==='new'?SB.na:SB[prev==='x'?S.unk:prev];flame.S.salt=shown(p.col,p.id);flame.S.saltK=.55;await sleep(700);flame.S.saltK=0;}
  await sleep(900);hot.material.opacity=0;S.loop='clean';blob.visible=false;}
async function test(id){if(S.busy)return;if(!S.lit){toast('أشعل الموقد أولًا.');return;}S.busy=true;sync();
  const real=id==='x'?SB[S.unk]:SB[id],d=dishes[id];
  if(S.loop!=='clean'){toast('يُنظَّف السلك بالحمض أولًا حتى لا تختلط الألوان…');await doClean();}
  await moveLoop(V(d.x,.75,DZ),Q_WORK,700);await moveLoop(V(d.x,.085,DZ),Q_WORK,330);
  blob.material.color.copy($lc(real.pw));blob.visible=true;await sleep(160);await moveLoop(V(d.x,.85,DZ),Q_WORK,330);await Promise.all([moveLoop(FE,Q_WORK,800),focus(true)]);
  const prev=S.loop,cont=prev!=='clean'&&prev!==id;let ph=null,pid=null;
  if(cont){const p=prev==='new'?SB.na:SB[prev==='x'?S.unk:prev];if(p.id!==real.id){ph=p.col;pid=p.id;}}
  const disp=shown(real.col,real.id,ph,pid);const lumi=S.air<.6;
  flame.S.salt=disp;flame.S.saltK=lumi?.3:1;hot.material.opacity=.9;
  flC.innerHTML=lumi?'غير واضح (لهب مضيء)':`<span class="p3-sw" style="background:${hex6(disp)};width:22px;height:22px;vertical-align:-6px"></span>${pid?'لون مختلط':S.cobalt?'عبر الزجاج الأزرق':id==='x'?'لاحظ اللون':real.cn}`;
  setTimeout(()=>{blob.visible=false;},1200);
  await sleep(4200);flame.S.saltK=0;hot.material.opacity=0;
  if(lumi)S.last='اللهب المضيء يحجب لون العيّنة؛ افتح فتحة الهواء ثم كرّر.';
  else if(pid)S.last='اللون غير دقيق لأن السلك ملوّث بعيّنة سابقة. نظّفه بالحمض ثم كرّر.';
  else{if(id==='x'){S.unkSeen=disp;S.last='لاحظ لون لهب العيّنة X وحدّد الأيون في دفتر المختبر.';}
    else{if(S.cobalt){S.recCob[id]=disp;S.last=`${real.f} عبر الزجاج الأزرق: ${id==='na'?'يختفي اللون الأصفر تقريبًا':'لاحظ اللون'}`;}else{S.rec[id]=true;S.last=`${real.f}: لون اللهب ${real.cn}`;}}}
  toast(S.last);S.loop=id;
  await Promise.all([moveLoop(REST,Q_REST,900),focus(false)]);S.busy=false;flC.textContent='—';sync();render();renderNB();}
async function cobalt(){if(S.busy)return;S.cobalt=!S.cobalt;const a=S.cobalt?CB_OFF:CB_ON,b=S.cobalt?CB_ON:CB_OFF;const p0=a.p.clone();
  await L.tw(700,k=>{const e=ease(k);CB.position.copy(lerpV(p0,b.p,e));CB.rotation.y=a.r+(b.r-a.r)*e;});
  toast(S.cobalt?'الزجاج الأزرق أمام اللهب: يحجب لون الصوديوم الأصفر.':'أُبعد الزجاج الأزرق.');sync();}
function reset(){if(S.busy)return;Object.assign(S,{lit:false,cobalt:false,loop:'new',rec:{},recCob:{},unkSeen:null,unkAns:'',unkOk:null,airTold:false,last:null});
  S.unk=SALTS[Math.floor(Math.random()*SALTS.length)].id;dishes.x.pw.material.color.copy($lc(SB[S.unk].pw));
  flame.S.on=false;gtl.rotation.x=0;sec.$('.flAir').value=15;setAir(.15);CB.position.copy(CB_OFF.p);CB.rotation.y=CB_OFF.r;LP.position.copy(REST);LP.quaternion.copy(Q_REST);blob.visible=false;
  sync();render();renderNB();toast('أُعيدت التجربة، واختيرت عيّنة مجهولة جديدة.');}

/* ---------- UI ---------- */
function stepIdx(){if(!S.lit)return 0;if(S.air<.6)return 1;if(S.loop!=='clean'&&!Object.keys(S.rec).length)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='أشعل موقد بنزن';html=`<p class="p3-txt">اضغط «أشعل الموقد» أو اضغط على الموقد في المشهد. فتحة الهواء شبه مغلقة الآن.</p>`;}
  else if(k===1){title='اضبط اللهب';html=`<p class="p3-txt">اللهب <b>أصفر مضيء</b> لأن فتحة الهواء مغلقة. حرّك منزلق <b>فتحة الهواء</b> حتى يصبح اللهب <b>أزرق غير مضيء</b>.</p>`;}
  else if(k===2){title='نظّف السلك';html=`<p class="p3-txt">اغمس سلك النيكروم في <b>حمض الهيدروكلوريك</b> ثم سخّنه في اللهب حتى لا يلوّنه. كرّر التنظيف قبل كل عيّنة.</p>`;}
  else{title='اكشف عن الأملاح';html=`<p class="p3-txt">اختر ملحًا من اللوحة أو اضغط على طبقه. ${S.loop==='clean'?'السلك نظيف وجاهز.':'يُنظَّف السلك تلقائيًا قبل كل عيّنة.'} سجّلت ${Object.keys(S.rec).length} من ${SALTS.length}.</p>${S.last?`<p class="p3-ok">${S.last}</p>`:''}`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){let h=`<table class="p3-t"><thead><tr><th>الملح</th><th>الأيون</th><th>لون اللهب</th><th>عبر الأزرق</th></tr></thead><tbody>`+
  SALTS.map(s=>`<tr><td class="n">${s.f}</td><td>${s.ion}</td><td>${S.rec[s.id]?sw(s.col,s.cn):'—'}</td><td>${S.recCob[s.id]!=null?sw(S.recCob[s.id],s.id==='na'?'لا يُرى':''):'—'}</td></tr>`).join('')+
  `<tr><td class="n">X</td><td>؟</td><td colspan="2">${S.unkSeen!=null?sw(S.unkSeen,'لوحظ'):'—'}</td></tr></tbody></table>`;
  h+=`<div class="p3-acts" style="margin-top:8px"><span class="p3-lab">أيون العيّنة X</span><select class="flSel" aria-label="أيون العيّنة المجهولة"><option value="">اختر</option>${SALTS.map(s=>`<option value="${s.id}" ${S.unkAns===s.id?'selected':''}>${s.ion}</option>`).join('')}</select><button class="p3-b" data-a="chk">تحقق</button><span class="p3-fb ${S.unkOk==null?'':S.unkOk?'ok':'bad'}">${S.unkOk==null?'':S.unkOk?'✓ صحيح':'✗ قارن لونها بالجدول'}</span></div>`;
  sec.$('.p3-nb').innerHTML=h;const sel=sec.$('.flSel');sel.onchange=()=>{S.unkAns=sel.value;};}
function sync(){const b=S.busy;const l=sec.$('[data-a="lit"]');l.setAttribute('aria-pressed',S.lit);l.textContent=S.lit?'⏻ أطفئ الموقد':'🔥 أشعل الموقد';l.disabled=b;
  sec.$('[data-a="clean"]').disabled=b||!S.lit;sec.$('[data-a="clean"]').classList.toggle('done',S.loop==='clean');
  sec.$('[data-a="cob"]').setAttribute('aria-pressed',S.cobalt);sec.$('[data-a="cob"]').disabled=b;
  sec.$$('[data-s]').forEach(x=>{x.disabled=b||!S.lit;x.classList.toggle('done',!!S.rec[x.dataset.s]||(x.dataset.s==='x'&&S.unkSeen!=null));});
  sec.$('[data-a="reset"]').disabled=b;}
sec.$('.flAir').addEventListener('input',e=>setAir(e.target.value/100));
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const d=x.dataset;
  if(d.a==='lit')lit();else if(d.a==='clean')clean();else if(d.a==='cob')cobalt();else if(d.a==='reset')reset();
  else if(d.a==='chk'){if(!S.unkAns){toast('اختر الأيون أولًا.');return;}if(S.unkSeen==null){toast('اختبر العيّنة X في اللهب أولًا.');return;}S.unkOk=S.unkAns===S.unk;if(S.unkOk)P3.good();else{try{L2.bad(x);}catch(err){}}renderNB();}
  else if(d.s)test(d.s);});
L.onTap(BG,lit);L.onTap(GT,lit);L.onTap(KB,clean);L.onTap(CB,cobalt);
Object.entries(dishes).forEach(([id,d])=>L.onTap(d.g,()=>{if(!S.lit)toast('أشعل الموقد أولًا.');else test(id);}));
setAir(S.air);sync();render();renderNB();
};


/* =====================================================================
   ٤) تعرّف المعادن بخصائصها — 3D (أول متوسط · جواهر الأرض)
   ===================================================================== */
const MINR={};EXP_MODS.minr=MINR;
MINR.init=function(){gm();
const MIN={
  talc:{n:'التلك',H:1,streak:'أبيض',sc:0xf4f4f0,lus:'لؤلؤي (غير فلزي)',mag:false,acid:false},
  gyps:{n:'الجبس',H:2,streak:'أبيض',sc:0xf4f4f0,lus:'زجاجي (غير فلزي)',mag:false,acid:false},
  calc:{n:'الكالسيت',H:3,streak:'أبيض',sc:0xf4f4f0,lus:'زجاجي (غير فلزي)',mag:false,acid:true},
  quar:{n:'الكوارتز',H:7,streak:'لا يترك مخدشًا',sc:null,lus:'زجاجي (غير فلزي)',mag:false,acid:false},
  magn:{n:'الماجنتيت',H:6,streak:'أسود',sc:0x1c1c1c,lus:'فلزي',mag:true,acid:false},
  hema:{n:'الهيماتيت',H:6,streak:'بني محمر',sc:0x8a3324,lus:'فلزي إلى ترابي',mag:false,acid:false},
  pyri:{n:'البايرايت',H:6.5,streak:'أسود مخضر',sc:0x2f3a2c,lus:'فلزي (ذهبي اللون)',mag:false,acid:false}};
const SAMPLES=[{k:'A',m:'calc'},{k:'B',m:'magn'},{k:'C',m:'quar'},{k:'D',m:'gyps'},{k:'E',m:'pyri'},{k:'F',m:'hema'}];
const TOOLS={nail:{n:'ظفر الإصبع',H:2.5},coin:{n:'قطعة نقود نحاسية',H:3.5},glass:{n:'لوح الزجاج',H:5.5},steel:{n:'مسمار فولاذ',H:6.5},streak:{n:'لوح المخدش'},lus:{n:'البريق'},mag:{n:'المغناطيس'},acid:{n:'الحمض المخفف'}};
const S={cur:null,busy:false,R:{},ans:{},ok:{}};SAMPLES.forEach(s=>S.R[s.k]={});P3.dbg.minr=S;
const NAMES=['اختيار العيّنة','اختبار القساوة','الاختبارات الأخرى','تحديد المعدن'];
const sec=P3.section('minr',{title:'تعرّف المعادن بخصائصها',grade:'أول متوسط',lesson:'جواهر الأرض',
  hud:`<div class="p3-m warm" style="min-width:190px"><small>نتيجة آخر اختبار</small><b class="mnR" style="font-family:var(--f-body);font-size:1rem">—</b></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">العيّنة</span>${SAMPLES.map(s=>`<button class="p3-b" data-k="${s.k}" style="font-family:var(--f-mono)">${s.k}</button>`).join('')}</div>
    <div class="p3-acts"><span class="p3-lab">القساوة</span><button class="p3-b" data-t="nail">✋ الظفر 2.5</button><button class="p3-b" data-t="coin">🪙 النقود 3.5</button><button class="p3-b" data-t="glass">▭ الزجاج 5.5</button><button class="p3-b" data-t="steel">📌 الفولاذ 6.5</button></div>
    <div class="p3-acts"><span class="p3-lab">خصائص</span><button class="p3-b" data-t="streak">⬜ لون المخدش</button><button class="p3-b" data-t="lus">🔍 البريق</button><button class="p3-b" data-t="mag">🧲 المغناطيس</button><button class="p3-b" data-t="acid">💧 الحمض</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة التجربة</button></div></div>`,
  learn:`<div class="panel"><h3>مقياس موس للقساوة</h3><p>يرتّب المعادن من 1 (التلك، الأقل قساوة) إلى 10 (الألماس). المعدن الأقسى يخدش الأقل قساوة.</p><p>أدوات للمقارنة: <b>الظفر 2.5</b> · <b>النقود النحاسية 3.5</b> · <b>الزجاج 5.5</b> · <b>المسمار الفولاذي 6.5</b>.</p></div>
    <div class="panel"><h3>جدول خصائص المعادن</h3><div class="tblwrap"><table class="p3-t"><thead><tr><th>المعدن</th><th>القساوة</th><th>المخدش</th><th>البريق</th><th>أخرى</th></tr></thead><tbody>${Object.values(MIN).map(m=>`<tr><td>${m.n}</td><td class="n">${m.H}</td><td>${m.streak}</td><td>${m.lus}</td><td>${m.mag?'ينجذب للمغناطيس':m.acid?'يفور مع الحمض':'—'}</td></tr>`).join('')}</tbody></table></div></div>
    <div class="panel"><h3>لماذا نستخدم عدة اختبارات؟</h3><p>اللون وحده قد يخدع؛ فالبايرايت ذهبي اللون لكنه ليس ذهبًا. لذلك نجمع القساوة ولون المخدش والبريق والخواص الخاصة كالمغناطيسية والفوران مع الحمض.</p></div>`,
  quiz:[{q:'معدن يخدشه الظفر، قساوته تقريبًا:',o:['أقل من 2.5','بين 3.5 و5.5','أكثر من 6.5'],a:0},{q:'المعدن الذي يفور مع الحمض المخفف:',o:['الكوارتز','الكالسيت','الماجنتيت'],a:1},
        {q:'لون مسحوق المعدن على لوح الخزف يُسمّى:',o:['البريق','المخدش','الانفصام'],a:1},{q:'معدن يخدش الزجاج ولا يترك مخدشًا:',o:['الكوارتز','الجبس','التلك'],a:0},{q:'المعدن الذي ينجذب إلى المغناطيس:',o:['الهيماتيت','الماجنتيت','البايرايت'],a:1}],
  report:()=>({title:'تعرّف المعادن بخصائصها',grade:'أول متوسط',lesson:'جواهر الأرض',cols:['العيّنة','القساوة','لون المخدش','البريق','المغناطيس / الحمض'],
    rows:SAMPLES.map(s=>{const r=S.R[s.k];return [`العيّنة ${s.k}`,hRange(s.k)||'',r.streak||'',r.lus||'',[r.mag,r.acid].filter(Boolean).join(' · ')];}),note:'اكتب اسم كل معدن مستعينًا بجدول الخصائص.'})
});
const L=new Lab(sec,{target:V(0,.2,.55),dist:a=>Math.max(3.9,6.5/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m),mnR=sec.$('.mnR');
/* ---------- rock factory ---------- */
function jitter(geo,amt,seed){const p=geo.attributes.position,v=new THREE.Vector3();let s=seed;const rnd=()=>{s=(s*9301+49297)%233280;return s/233280;};const map=new Map();
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const key=v.x.toFixed(3)+v.y.toFixed(3)+v.z.toFixed(3);if(!map.has(key))map.set(key,1+(rnd()-.5)*amt);v.multiplyScalar(map.get(key));p.setXYZ(i,v.x,v.y,v.z);}geo.computeVertexNormals();return geo;}
function rock(m,i){const g=new THREE.Group();let top=.2;
  if(m==='quar'){const mt=KIT.phys(0xeef3f8,{roughness:.05,transparent:true,opacity:.62,clearcoat:1});mt.userData.keepEnv=1;mt.envMapIntensity=1.8;
    [[0,0,0,1],[.09,-.02,.05,.75],[-.08,-.03,-.04,.7]].forEach(([x,y,z,s])=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.07*s,.07*s,.26*s,6),mt);c.position.set(x,y+.13*s,z);c.rotation.z=x*2;
      const t=new THREE.Mesh(new THREE.ConeGeometry(.07*s,.1*s,6),mt);t.position.y=.18*s;c.add(t);g.add(c);});top=.38;}
  else if(m==='pyri'){const mt=KIT.mat(0xc9a548,{metalness:.95,roughness:.22});[[0,.09,0,.18],[.12,.06,.06,.12],[-.1,.05,.05,.1]].forEach(([x,y,z,s])=>{const c=new THREE.Mesh(new THREE.BoxGeometry(s,s,s),mt);c.position.set(x,y,z);c.rotation.set(x,y*3,z);g.add(c);});top=.2;}
  else if(m==='calc'){const geo=new THREE.BoxGeometry(.3,.18,.24);geo.applyMatrix4(new THREE.Matrix4().makeShear(0,0,.35,0,0,0));const mt=KIT.phys(0xf1e9d6,{roughness:.25,transparent:true,opacity:.92});
    const c=new THREE.Mesh(geo,mt);c.position.y=.1;c.rotation.y=.4;g.add(c);top=.2;}
  else if(m==='gyps'){const mt=KIT.phys(0xece6d8,{roughness:.35});for(let j=0;j<4;j++){const p=new THREE.Mesh(new THREE.BoxGeometry(.32-j*.04,.04,.22-j*.02),mt);p.position.set(j*.01,.02+j*.042,0);p.rotation.y=j*.12;g.add(p);}top=.18;}
  else{const col=m==='magn'?0x2c2d31:0x5b3a33,mt=KIT.mat(col,{metalness:m==='magn'?.75:.45,roughness:m==='magn'?.3:.55,flatShading:true});
    const c=new THREE.Mesh(jitter(new THREE.IcosahedronGeometry(.15,1),.35,i*97+11),mt);c.scale.y=.75;c.position.y=.11;g.add(c);top=.22;}
  g.traverse(o=>{if(o.isMesh){o.castShadow=true;}});g.userData.top=top;return g;}
/* ---------- bench layout ---------- */
const PAD=V(-.15,0,.25);
const pad=new THREE.Mesh(RBox(1.0,.03,.75,.01),KIT.mat(0xf3f1ea,{roughness:.9}));pad.position.set(PAD.x,.015,PAD.z);pad.receiveShadow=true;L.add(pad);
L.label('منطقة الفحص',V(PAD.x,.02,PAD.z+.48),'small');
const tray=new THREE.Mesh(RBox(3.6,.05,.6,.02),KIT.wood(0x9b6a3c));tray.position.set(-.1,.025,1.45);L.add(tray);
const rocks={};SAMPLES.forEach((s,i)=>{const r=rock(s.m,i);const home=V(-1.55+i*.62,.05,1.42);r.position.copy(home);r.userData.home=home.clone();L.add(r);rocks[s.k]=r;
  const c=P3.card([{t:s.k,mono:1,s:120}],.2,.14);c.position.set(home.x,.08,1.74);c.rotation.x=-.9;L.add(c);L.onTap(r,()=>pick(s.k));});
// glass plate + streak tile
const GLP=V(-1.45,0,.25),STP=V(1.2,0,.25);
const gplate=new THREE.Mesh(new THREE.BoxGeometry(.75,.025,.5),new THREE.MeshPhysicalMaterial({color:0xd6eef3,roughness:.05,transparent:true,opacity:.5,clearcoat:1}));gplate.position.set(GLP.x,.0125,GLP.z);gplate.material.userData.keepEnv=1;L.add(gplate);
const tile=new THREE.Mesh(RBox(.7,.03,.45,.01),KIT.mat(0xfbfaf6,{roughness:.8}));tile.position.set(STP.x,.015,STP.z);tile.castShadow=true;L.add(tile);
L.label('لوح زجاج',V(GLP.x,.05,GLP.z+.38),'small');L.label('لوح المخدش (خزف)',V(STP.x,.05,STP.z+.36),'small');
// tools rack at the back
const rack=new THREE.Mesh(RBox(3.4,.06,.5,.02),KIT.mat(0x2b3036,{metalness:.3}));rack.position.set(0,.03,-.75);L.add(rack);
const tools={};
{const g=new THREE.Group();const f=new THREE.Mesh(new THREE.CylinderGeometry(.055,.06,.42,16),KIT.mat(0xe7b48f,{roughness:.6}));f.position.y=.21;const tip=new THREE.Mesh(new THREE.SphereGeometry(.055,16,12),f.material);tip.position.y=0;
  const nl=new THREE.Mesh(new THREE.BoxGeometry(.06,.07,.012),KIT.mat(0xf6dccb,{roughness:.3}));nl.position.set(0,.03,.052);g.add(f,tip,nl);g.rotation.z=.25;tools.nail=g;}
{const g=new THREE.Group();const c=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.02,28),KIT.mat(0xb87333,{metalness:.85,roughness:.3}));c.rotation.x=Math.PI/2;g.add(c);tools.coin=g;}
{const g=new THREE.Group();const n=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.42,10),M.steel);n.position.y=.24;const tp=new THREE.Mesh(new THREE.ConeGeometry(.018,.06,10),M.steel);tp.rotation.x=Math.PI;tp.position.y=.0;
  const hd=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.02,16),M.steel);hd.position.y=.45;g.add(n,tp,hd);g.rotation.z=.3;tools.steel=g;}
{const g=new THREE.Group();const red=KIT.mat(0xc62828,{roughness:.4}),st=KIT.mat(0xd9dde0,{metalness:.9,roughness:.25});
  const u=new THREE.Mesh(new THREE.TorusGeometry(.12,.04,12,24,Math.PI),red);u.rotation.z=Math.PI;u.position.y=.3;
  [-.12,.12].forEach(x=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.08,.16,.08),red);l.position.set(x,.22,0);const t=new THREE.Mesh(new THREE.BoxGeometry(.08,.05,.08),st);t.position.set(x,.12,0);g.add(l,t);});g.add(u);tools.mag=g;}
{const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.2,18),KIT.phys(0x7a5a2a,{transparent:true,opacity:.8}));b.position.y=.1;const p=new THREE.Mesh(new THREE.CylinderGeometry(.014,.02,.16,10),G.glassS);p.position.y=-.06;
  const bl=new THREE.Mesh(new THREE.SphereGeometry(.05,14,10),KIT.mat(0x111111,{roughness:.8}));bl.scale.y=1.4;bl.position.y=.25;const lb=P3.card([{t:'HCl',mono:1,s:110}],.12,.06);lb.position.set(0,.1,.071);g.add(b,p,bl,lb);tools.acid=g;}
{const g=new THREE.Group();const ring=new THREE.Mesh(new THREE.TorusGeometry(.16,.022,10,32),KIT.mat(0x1c1c1c));const lens=new THREE.Mesh(new THREE.CircleGeometry(.16,32),new THREE.MeshPhysicalMaterial({color:0xe8f6fa,transparent:true,opacity:.25,roughness:0,clearcoat:1,side:THREE.DoubleSide,depthWrite:false}));
  const h=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.32,10),KIT.mat(0x1c1c1c));h.position.y=-.32;g.add(ring,lens,h);tools.lus=g;}
const RACK={nail:[-1.4,.06],coin:[-.95,.08],steel:[-.5,.04],mag:[0,.06],acid:[.5,.12],lus:[1.05,.5]};
Object.entries(RACK).forEach(([k,[x,y]])=>{const t=tools[k];t.position.set(x,y,-.75);t.userData.home=t.position.clone();t.userData.rot=t.rotation.clone();castAll(t);L.add(t);});
tools.coin.rotation.x=-Math.PI/2+.0;tools.coin.position.y=.07;tools.coin.userData.home=tools.coin.position.clone();
tools.lus.rotation.x=-.3;tools.lus.userData.home=tools.lus.position.clone();
const bub=Bubbles(120,{op:.75});L.add(bub.mesh);let fizz=0;
const marks=[];// scratch / streak marks added to the scene
P3.loop(L,(dt,t)=>{if(fizz>0){fizz-=dt;const r=rocks[S.cur];if(r)for(let i=0;i<3;i++)bub.spawn(r.position.x+(Math.random()-.5)*.22,r.position.y+.08+Math.random()*.08,r.position.z+(Math.random()-.5)*.18,.008+Math.random()*.012,r.position.y+.32,.25);}bub.update(dt,t);});

/* ---------- helpers ---------- */
function hRange(k){const r=S.R[k];let lo=null,hi=null;['nail','coin','glass','steel'].forEach(t=>{if(r[t]==null)return;const H=TOOLS[t].H;
    const softer=t==='glass'?r.glass==='لا يخدش الزجاج':r[t]==='يُخدش';if(softer)hi=hi==null?H:Math.min(hi,H);else lo=lo==null?H:Math.max(lo,H);});
  if(lo==null&&hi==null)return '';if(lo==null)return `أقل من ${hi}`;if(hi==null)return `أكبر من ${lo}`;return `بين ${lo} و${hi}`;}
function result(t){mnR.textContent=t;if(t&&t!=='—')toast(t);}
/* عدسة البريق: عرض مكبَّر واضح لسطح العيّنة يوضح نوع البريق مع مقارنة بالأنواع الأربعة */
const LUS={met:{n:'فلزي',d:'يلمع ويعكس الضوء كالمعادن (مثل سطح ملعقة)'},gla:{n:'زجاجي',d:'لامع كالزجاج، وقد يكون شفافًا أو نصف شفاف'},pea:{n:'لؤلؤي',d:'لمعان ناعم هادئ يشبه سطح اللؤلؤ'},ear:{n:'ترابي (معتم)',d:'باهت لا يعكس الضوء، يشبه التراب أو الطين'}};
const SKIN={talc:['#eef0e8','#d9dccf','pea'],gyps:['#f3efe4','#ddd6c6','gla'],calc:['#f4ecd8','#e2d4b4','gla'],quar:['#eef6fb','#c9dbe6','gla'],magn:['#55585e','#1d1e22','met'],hema:['#8a5a50','#4a2a24','met'],pyri:['#f0d77a','#9c7a26','met']};
if(!document.getElementById('lusCss')){const st=document.createElement('style');st.id='lusCss';st.textContent=`
.lusOv{position:absolute;inset:0;z-index:30;display:grid;place-items:center;background:rgba(10,18,24,.55);backdrop-filter:blur(2px)}
.lusP{background:#fff;color:#14222b;border-radius:22px;padding:16px 20px;width:min(720px,94%);box-shadow:0 20px 60px rgba(0,0,0,.4);display:grid;grid-template-columns:230px 1fr;gap:18px;align-items:center;direction:rtl}
.lusP h3{grid-column:1/-1;margin:0;font-size:1.25rem}
.lusL{width:220px;height:220px;border-radius:50%;border:12px solid #1c1c1c;box-shadow:0 0 0 4px #888 inset,0 8px 20px rgba(0,0,0,.35);position:relative;overflow:hidden}
.lusL i{position:absolute;inset:0}
.lusL .gl{background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.95) 45%,transparent 58%);animation:lusSw 2.2s ease-in-out infinite}
.lusL.pea .gl{background:linear-gradient(115deg,transparent 20%,rgba(255,230,250,.55) 38%,rgba(210,240,255,.55) 50%,rgba(255,255,230,.5) 62%,transparent 80%);animation-duration:3.4s;filter:blur(6px)}
.lusL.gla .gl{background:linear-gradient(115deg,transparent 38%,rgba(255,255,255,.98) 46%,transparent 52%),radial-gradient(circle at 70% 30%,rgba(255,255,255,.9) 0 6%,transparent 7%)}
.lusL.ear .gl{display:none}
.lusL.ear .tx{background-image:radial-gradient(rgba(0,0,0,.25) 1.2px,transparent 1.6px),radial-gradient(rgba(255,255,255,.18) 1px,transparent 1.5px);background-size:9px 9px,13px 13px}
.lusL .fc{background:repeating-linear-gradient(35deg,rgba(255,255,255,.12) 0 18px,rgba(0,0,0,.12) 18px 36px)}
.lusL.met .fc{background:conic-gradient(from 30deg,rgba(255,255,255,.35),rgba(0,0,0,.35),rgba(255,255,255,.5),rgba(0,0,0,.3),rgba(255,255,255,.35))}
@keyframes lusSw{0%{transform:translateX(-70%)}60%,100%{transform:translateX(70%)}}
.lusT{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}
.lusT div{border:2px solid #dfe5ea;border-radius:12px;padding:6px 10px;opacity:.55;font-size:.92rem}
.lusT div.on{opacity:1;border-color:#e08a2e;background:#fff4e6;box-shadow:0 0 0 3px rgba(224,138,46,.25)}
.lusT b{display:block;font-size:1.02rem}
.lusR{font-size:1.15rem;font-weight:700;color:#8a4b00;margin:4px 0}
`;document.head.appendChild(st);}
function hideLus(){const o=L.stage.querySelector('.lusOv');if(o)o.remove();}
function showLus(k,mk){hideLus();const m=MIN[mk],sk=SKIN[mk],types=mk==='hema'?['met','ear']:[sk[2]];
  const o=document.createElement('div');o.className='lusOv';
  o.innerHTML=`<div class="lusP"><h3>🔍 فحص البريق بالعدسة المكبرة · العيّنة ${k}</h3>
   <div class="lusL ${types[types.length-1]==='ear'&&types.length===1?'ear':sk[2]}"><i style="background:radial-gradient(circle at 35% 30%,${sk[0]},${sk[1]})"></i><i class="fc"></i><i class="tx"></i><i class="gl"></i></div>
   <div><div class="lusR">البريق: ${m.lus}</div><p style="margin:0;font-size:.95rem">البريق هو طريقة انعكاس الضوء عن سطح المعدن. لاحظ كيف يلمع سطح العيّنة تحت العدسة، ثم قارنه بالأنواع:</p>
   <div class="lusT">${Object.entries(LUS).map(([key,v])=>`<div class="${types.includes(key)?'on':''}"><b>${v.n}</b>${v.d}</div>`).join('')}</div>
   <button class="p3-b pri lusX">متابعة ←</button></div></div>`;
  o.addEventListener('click',e=>{if(e.target===o||e.target.closest('.lusX'))o.remove();});L.stage.appendChild(o);}
function addMark(parent,col,w,pos,rot){const m=new THREE.Mesh(new THREE.BoxGeometry(w,.004,.012),new THREE.MeshBasicMaterial({color:$lc(col)}));m.position.copy(pos);m.rotation.y=rot||0;parent.add(m);marks.push({m,parent});return m;}
async function pick(k){if(S.busy)return;if(S.cur===k)return;S.busy=true;sync();
  if(S.cur){const o=rocks[S.cur];await L.arc(o,o.userData.home,600,.6);}
  S.cur=k;const r=rocks[k];await L.arc(r,V(PAD.x,.03,PAD.z),700,.7);S.busy=false;P3.click();result('—');sync();render();renderNB();}
async function scrub(o,c,ax='x',amp=.12,n=3,d=900){const p0=o.position[ax];await L.tw(d,k=>{o.position[ax]=p0+Math.sin(k*Math.PI*2*n)*amp;});o.position[ax]=p0;}
async function test(t){if(S.busy)return;if(!S.cur){toast('اختر عيّنة أولًا (A إلى F).');return;}const k=S.cur,s=SAMPLES.find(x=>x.k===k),m=MIN[s.m],r=rocks[k],R=S.R[k];
  if(R[t]!=null){toast('أجريت هذا الاختبار على العيّنة '+k+' من قبل.');return;}
  hideLus();S.busy=true;sync();const top=r.position.y+r.userData.top;
  if(t==='nail'||t==='coin'||t==='steel'){const tool=tools[t],th=tool.userData.home.clone(),tr=tool.rotation.clone();
    await L.arc(tool,V(r.position.x+.05,top+(t==='coin'?.08:.02),r.position.z+.02),700,1.0);
    if(t==='coin'){tool.rotation.set(0,0,.5);}
    P3.noise(.9,.25,m.H<TOOLS[t].H?600:2600,1.5);await scrub(tool);const scr=m.H<TOOLS[t].H;
    if(scr)addMark(r,0xffffff,.16,V(0,r.userData.top-.003,0),Math.random()*2);
    R[t]=scr?'يُخدش':'لا يُخدش';result(`${TOOLS[t].n}: ${scr?'ظهر خدش على العيّنة':'لا يوجد خدش'}`);
    tool.rotation.copy(tr);await L.arc(tool,th,700,1.0);}
  else if(t==='glass'){await L.arc(r,V(GLP.x,.03,GLP.z),700,.8);P3.noise(.9,.3,m.H>5.5?3000:700,1.5);await scrub(r,null,'x',.14);const scr=m.H>5.5;
    if(scr)addMark(L.scene,0xffffff,.3,V(GLP.x,.027,GLP.z),.2+Math.random()*.4);R.glass=scr?'يخدش الزجاج':'لا يخدش الزجاج';
    result(scr?'ظهر خدش على الزجاج':'الزجاج سليم: العيّنة لم تخدشه');await L.arc(r,V(PAD.x,.03,PAD.z),700,.8);}
  else if(t==='streak'){await L.arc(r,V(STP.x-.12,.03,STP.z),700,.8);await L.tw(900,kk=>r.position.x=STP.x-.12+.24*kk);
    if(m.sc!=null)addMark(L.scene,m.sc,.26,V(STP.x,.032,STP.z+(marks.filter(x=>x.parent===L.scene).length%4)*.07-.1),0).scale.set(1,1,3);
    R.streak=m.streak;result('لون المخدش: '+m.streak);await L.arc(r,V(PAD.x,.03,PAD.z),700,.8);}
  else if(t==='lus'){const lens=tools.lus,h=lens.userData.home.clone(),q=lens.rotation.clone();await L.arc(lens,V(r.position.x,top+.45,r.position.z+.15),800,1.0);
    const c0=L.camera.position.clone(),t0=L.controls.target.clone(),c1=V(r.position.x,top+.9,r.position.z+1.4),t1=V(r.position.x,top,r.position.z);
    await L.tw(600,kk=>{const e=ease(kk);L.camera.position.copy(lerpV(c0,c1,e));L.controls.target.copy(lerpV(t0,t1,e));});
    const y0=r.rotation.y;await L.tw(1600,kk=>r.rotation.y=y0+kk*Math.PI*2);R.lus=m.lus;result('البريق: '+m.lus);showLus(k,s.m);
    await L.tw(600,kk=>{const e=ease(kk);L.camera.position.copy(lerpV(c1,c0,e));L.controls.target.copy(lerpV(t1,t0,e));});lens.rotation.copy(q);await L.arc(lens,h,700,1.0);}
  else if(t==='mag'){const mg=tools.mag,h=mg.userData.home.clone();await L.arc(mg,V(r.position.x,top+.35,r.position.z),800,1.0);
    if(m.mag){P3.tone(520,.15,'triangle',.06);const p0=r.position.clone();await L.move(r,V(p0.x,top+.16,p0.z),250);await sleep(700);await L.move(r,p0,350);}else await sleep(800);
    R.mag=m.mag?'ينجذب للمغناطيس':'لا ينجذب';result(m.mag?'انجذبت العيّنة إلى المغناطيس':'لم تنجذب إلى المغناطيس');await L.arc(mg,h,700,1.0);}
  else if(t==='acid'){const ac=tools.acid,h=ac.userData.home.clone();await L.arc(ac,V(r.position.x,top+.35,r.position.z),800,1.0);
    const d=new THREE.Mesh(new THREE.SphereGeometry(.018,10,8),G.water(0xeaf3dc,.8));d.position.set(r.position.x,top+.2,r.position.z);L.scene.add(d);
    await L.tw(400,kk=>d.position.y=top+.2-.2*kk);L.scene.remove(d);if(m.acid){fizz=2.4;P3.noise(1.6,.25,4000,.8);}await sleep(1500);
    R.acid=m.acid?'يفور مع الحمض':'لا يتفاعل';result(m.acid?'فوران: تتصاعد فقاعات غاز':'لا يحدث تفاعل');await L.arc(ac,h,700,1.0);}
  P3.click();S.busy=false;sync();render();renderNB();}
function reset(){if(S.busy)return;marks.forEach(x=>x.parent.remove(x.m));marks.length=0;SAMPLES.forEach(s=>{S.R[s.k]={};const r=rocks[s.k];r.position.copy(r.userData.home);r.rotation.y=0;});
  S.cur=null;S.ans={};S.ok={};result('—');sync();render();renderNB();toast('أُعيدت التجربة إلى بدايتها.');}
/* ---------- UI ---------- */
function stepIdx(){if(!S.cur)return 0;const R=S.R[S.cur];const hn=['nail','coin','glass','steel'].filter(t=>R[t]!=null).length,on=['streak','lus','mag','acid'].filter(t=>R[t]!=null).length;
  if(hn<2)return 1;if(on<2)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='اختر عيّنة';html=`<p class="p3-txt">أمامك ست عيّنات معادن مجهولة (A إلى F). اختر عيّنة لتنتقل إلى منطقة الفحص.</p>`;}
  else if(k===1){title='اختبر القساوة — العيّنة '+S.cur;html=`<p class="p3-txt">اخدش العيّنة بالظفر ثم بقطعة النقود ثم بالمسمار، واخدش بها لوح الزجاج. المعدن الأقسى يخدش الأقل قساوة.</p>`;}
  else if(k===2){title='اختبارات أخرى — العيّنة '+S.cur;html=`<p class="p3-txt">اختبر لون المخدش والبريق، وجرّب المغناطيس والحمض المخفف.</p>`;}
  else{title='حدّد المعدن — العيّنة '+S.cur;html=`<p class="p3-txt">قارن نتائجك بجدول الخصائص في تبويب «المعلومات والأسئلة»، ثم اختر اسم المعدن في دفتر المختبر.</p>${hRange(S.cur)?`<p class="p3-eq" dir="rtl">القساوة: ${hRange(S.cur)}</p>`:''}`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){let h=`<table class="p3-t"><thead><tr><th>العيّنة</th><th>القساوة</th><th>المخدش</th><th>المعدن</th></tr></thead><tbody>`+SAMPLES.map(s=>{const r=S.R[s.k];
    return `<tr><td class="n">${s.k}</td><td>${hRange(s.k)||'—'}</td><td>${r.streak||'—'}</td><td><select data-k="${s.k}" aria-label="معدن العيّنة ${s.k}"><option value="">اختر</option>${Object.entries(MIN).map(([mk,v])=>`<option value="${mk}" ${S.ans[s.k]===mk?'selected':''}>${v.n}</option>`).join('')}</select> <span class="p3-fb ${S.ok[s.k]==null?'':S.ok[s.k]?'ok':'bad'}">${S.ok[s.k]==null?'':S.ok[s.k]?'✓':'✗'}</span></td></tr>`;}).join('')+'</tbody></table>';
  if(S.cur){const r=S.R[S.cur];h+=`<p class="p3-txt" style="margin-top:6px;font-size:.82rem"><b>العيّنة ${S.cur}:</b> البريق: ${r.lus||'—'} · المغناطيس: ${r.mag||'—'} · الحمض: ${r.acid||'—'}</p>`;}
  h+=`<div class="p3-acts"><button class="p3-b" data-a="chk">تحقق من إجاباتي</button></div>`;
  sec.$('.p3-nb').innerHTML=h;sec.$$('.p3-nb select').forEach(x=>x.onchange=()=>{S.ans[x.dataset.k]=x.value;delete S.ok[x.dataset.k];});}
function sync(){const b=S.busy;sec.$$('[data-k]').forEach(x=>{if(x.tagName!=='BUTTON')return;x.setAttribute('aria-pressed',x.dataset.k===S.cur);x.disabled=b;});
  sec.$$('[data-t]').forEach(x=>{x.disabled=b||!S.cur;x.classList.toggle('done',!!(S.cur&&S.R[S.cur][x.dataset.t]!=null));});sec.$('[data-a="reset"]').disabled=b;}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const d=x.dataset;
  if(d.k&&x.closest('.p3-acts')&&!x.closest('.p3-nb'))pick(d.k);else if(d.t)test(d.t);else if(d.a==='reset')reset();
  else if(d.a==='chk'){const ks=Object.keys(S.ans).filter(k=>S.ans[k]);if(!ks.length){toast('اختر اسم معدن لعيّنة واحدة على الأقل.');return;}
    let ok=0;ks.forEach(k=>{S.ok[k]=S.ans[k]===SAMPLES.find(s=>s.k===k).m;if(S.ok[k])ok++;});if(ok===ks.length)P3.good();toast(`صحيح ${ok} من ${ks.length}.`);renderNB();}});
Object.entries(RACK).forEach(([k])=>L.onTap(tools[k],()=>test(k)));L.onTap(gplate,()=>test('glass'));L.onTap(tile,()=>test('streak'));
sync();render();renderNB();
};

/* =====================================================================
   ٥) التجوية الكيميائية: الطباشير في الخل — 3D (أول متوسط · التجوية والتعرية)
   ===================================================================== */
const WEAT={};EXP_MODS.weat=WEAT;
WEAT.init=function(){gm();
const M0=5.00;
const B=[{k:'w',n:'ماء',sub:'مجموعة ضابطة',liq:0xbfe0f2,acid:false,crushed:false,warm:false,m1:5.00,x:-1.95},
  {k:'v',n:'خل',sub:'درجة حرارة الغرفة',liq:0xefe6c4,acid:true,crushed:false,warm:false,m1:4.40,x:-.85},
  {k:'vc',n:'خل + طباشير مفتّت',sub:'مساحة سطح أكبر',liq:0xefe6c4,acid:true,crushed:true,warm:false,m1:3.70,x:.25},
  {k:'vw',n:'خل دافئ',sub:'على سخان 40 °س',liq:0xf3dcbc,acid:true,crushed:false,warm:true,m1:3.90,x:1.35}];
const S={ph:0,min:0,busy:false,res:{},w0:false};P3.dbg.weat=S;
const NAMES=['زِن الطباشير','ضعه في الكؤوس','انتظر 15 دقيقة','زِن بعد التجربة'];
const sec=P3.section('weat',{title:'التجوية الكيميائية: الطباشير في الخل',grade:'أول متوسط',lesson:'التجوية والتعرية وأثرهما',
  hud:`<div class="p3-row"><div class="p3-m"><small>الزمن</small><b class="wtT">0 min</b></div><div class="p3-m warm"><small>الميزان</small><b class="wtB">0.00 g</b></div></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><button class="p3-b" data-a="w0">⚖ ① زِن قطعة طباشير</button><button class="p3-b" data-a="add">⬇ ② ضعها في الكؤوس</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="wait">⏩ ③ مرور 15 دقيقة</button><button class="p3-b" data-a="w1">⚖ ④ زِن القطع بعد التجربة</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة التجربة</button></div></div>`,
  learn:`<div class="panel"><h3>التجوية الكيميائية</h3><p>تغيّر في التركيب الكيميائي للصخور يجعلها تتفتت. الحجر الجيري والطباشير (كربونات الكالسيوم) يتفاعلان مع الأحماض كالخل وماء المطر الحمضي فينتج غاز ثاني أكسيد الكربون.</p>
      <p class="p3-eq">CaCO₃ + 2CH₃COOH → Ca(CH₃COO)₂ + H₂O + CO₂</p></div>
    <div class="panel"><h3>عوامل تزيد سرعة التجوية الكيميائية</h3><p><b>مساحة السطح:</b> تفتيت الصخر يكشف سطحًا أكبر للحمض.</p><p><b>درجة الحرارة:</b> الحرارة تزيد سرعة التفاعل.</p><p><b>وجود الحمض:</b> الماء وحده لم يغيّر كتلة الطباشير في التجربة.</p></div>`,
  quiz:[{q:'لماذا لم تتغير كتلة الطباشير في كأس الماء؟',o:['لأن الماء وحده لا يتفاعل معه في هذه المدة','لأن الماء دافئ','لأن الطباشير مفتّت'],a:0},
        {q:'الغاز المتصاعد عند وضع الطباشير في الخل هو:',o:['الأكسجين','ثاني أكسيد الكربون','الهيدروجين'],a:1},
        {q:'نقصت الكتلة أكثر في الطباشير المفتّت لأن:',o:['مساحة السطح المعرّضة للحمض أكبر','كتلته أكبر','الخل أبرد'],a:0},
        {q:'كأس الماء في التجربة يمثّل:',o:['المتغير المستقل','المجموعة الضابطة','المتغير التابع'],a:1}],
  report:()=>({title:'التجوية الكيميائية: الطباشير في الخل',grade:'أول متوسط',lesson:'التجوية والتعرية وأثرهما',cols:['الكأس','الكتلة قبل (g)','الكتلة بعد (g)','النقص (g)'],
    rows:B.map(b=>{const r=S.res[b.k];return [b.n,r?M0.toFixed(2):'',r?r.toFixed(2):'',r?(M0-r).toFixed(2):''];}),note:'رتّب الكؤوس حسب النقص في الكتلة، وفسّر النتيجة.'})
});
const L=new Lab(sec,{target:V(.3,.4,.6),dist:a=>Math.max(4.4,7.8/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m),hB=sec.$('.wtB'),hT=sec.$('.wtT');
/* ---------- beakers ---------- */
const bpts=[[0,0],[.34,0],[.36,.03],[.36,.78],[.39,.81],[.35,.8]].map(p=>new THREE.Vector2(p[0],p[1]));
const BK={};
function chalkStick(){const m=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.34,18),KIT.mat(0xf8f6f0,{roughness:.95}));m.rotation.z=Math.PI/2;m.castShadow=true;return m;}
function chalkBits(){const g=new THREE.Group();for(let i=0;i<9;i++){const p=new THREE.Mesh(new THREE.DodecahedronGeometry(.045+Math.random()*.02,0),KIT.mat(0xf8f6f0,{roughness:.95}));p.position.set((Math.random()-.5)*.22,(i%3)*.03,(Math.random()-.5)*.16);p.rotation.set(i,i*2,i*3);p.castShadow=true;g.add(p);}return g;}
B.forEach(b=>{const g=new THREE.Group();g.position.set(b.x,0,.3);let y0=0;
  if(b.warm){const hp=new THREE.Mesh(RBox(.9,.14,.8,.03),KIT.mat(0x2b3036,{metalness:.3}));hp.position.y=.07;const pl=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.02,32),KIT.mat(0x7a2e1e,{emissive:0x3a0a00}));pl.position.y=.15;
    const kn=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.04,16),KIT.mat(0x111111));kn.rotation.x=Math.PI/2;kn.position.set(.3,.07,.41);g.add(hp,pl,kn);y0=.16;castAll(hp);}
  const gl=new THREE.Mesh(new THREE.LatheGeometry(bpts,40),G.glass);gl.position.y=y0;gl.renderOrder=3;
  const lq=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.5,36),G.water(b.liq,.5));lq.position.y=y0+.27;lq.renderOrder=1;
  const card=P3.card([{t:b.n,s:58},{t:b.sub,s:42}],.62,.26,b.acid?{}:{bd:'#2f6fb2'});card.position.set(0,.13,.75);card.rotation.x=-.9;
  g.add(gl,lq,card);L.add(g);
  const ch=b.crushed?chalkBits():chalkStick();ch.position.set(b.x,.06,1.25);L.add(ch);
  const bub=Bubbles(70,{op:.7});bub.mesh.position.copy(g.position);L.add(bub.mesh);
  BK[b.k]={g,y0,ch,bub,acc:0,shrink:0};L.onTap(g,()=>{});});
/* ---------- digital balance ---------- */
const BAL=V(2.55,0,.35);const bal=new THREE.Group();bal.position.copy(BAL);
const bb=new THREE.Mesh(RBox(.85,.16,.75,.04),KIT.mat(0xe8eaec,{roughness:.4}));bb.position.y=.08;
const bp=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.03,32),M.steel);bp.position.y=.175;
const lcd=KIT.lcd(.5,.17);lcd.m.position.set(0,.09,.381);lcd.set('0.00 g');
bal.add(bb,bp,lcd.m);castAll(bal);L.add(bal);L.label('ميزان رقمي',V(BAL.x,.45,BAL.z),'small');
let shown=0;function balance(v){const t0=performance.now(),a=shown;L.tween(700,k=>{const x=a+(v-a)*(1-Math.pow(1-k,3));shown=x;lcd.set(x.toFixed(2)+' g');hB.textContent=x.toFixed(2)+' g';});}
/* clock */
const clk=new THREE.Group();{const f=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.05,40),KIT.mat(0xffffff));f.rotation.x=Math.PI/2;const r=new THREE.Mesh(new THREE.TorusGeometry(.28,.03,10,40),KIT.mat(0x0d5f56));
  clk.add(f,r);for(let i=0;i<12;i++){const t=new THREE.Mesh(new THREE.BoxGeometry(.015,.05,.01),KIT.mat(0x222222));const a=i/12*Math.PI*2;t.position.set(Math.sin(a)*.22,Math.cos(a)*.22,.03);t.rotation.z=-a;clk.add(t);}}
const hand=new THREE.Mesh(new THREE.BoxGeometry(.018,.2,.012),KIT.mat(0xc62828));hand.geometry.translate(0,.09,0);hand.position.z=.04;clk.add(hand);
clk.position.set(-.3,1.45,-1.85);L.add(clk);
/* ---------- sim ---------- */
P3.loop(L,(dt,t)=>{B.forEach(b=>{const o=BK[b.k];if(S.ph===2&&b.acid){const rate=(M0-b.m1)/1.3;o.acc+=dt*rate*40;while(o.acc>=1){o.acc--;o.bub.spawn((Math.random()-.5)*.24,o.y0+.08,(Math.random()-.5)*.18,.01+Math.random()*.012,o.y0+.5,.3+Math.random()*.2);}}o.bub.update(dt,t);});});
function setShrink(b,k){const o=BK[b.k],s=1-k*(M0-b.m1)/M0*.9;o.ch.scale.setScalar(s);}
/* ---------- actions ---------- */
async function weigh0(){if(S.busy||S.ph!==0)return;S.busy=true;sync();const c=BK.w.ch,h=c.position.clone();await L.arc(c,V(BAL.x,.25,BAL.z),800,1.0);balance(M0);await sleep(1100);
  await L.arc(c,h,700,1.0);balance(0);S.w0=true;S.ph=1;S.busy=false;toast('كتلة كل قطعة 5.00 g قبل التجربة (القطع الأربع متساوية).');sync();render();renderNB();}
async function add(){if(S.busy||S.ph!==1)return;S.busy=true;sync();
  await Promise.all(B.map(async(b,i)=>{await sleep(i*180);const o=BK[b.k];await L.arc(o.ch,V(b.x,o.y0+.08,.3),900,1.2);}));P3.tone(240,.08,'square',.05);
  S.ph=2;S.busy=false;toast('لاحظ: فقاعات في كؤوس الخل، ولا شيء في كأس الماء.');sync();render();}
async function wait(){if(S.busy||S.ph!==2)return;S.busy=true;sync();
  await L.tw(5000,k=>{S.min=k*15;hT.textContent=Math.round(S.min)+' min';hand.rotation.z=-k*Math.PI*.5;B.forEach(b=>setShrink(b,k));});S.ph=3;S.busy=false;
  toast('مرّت 15 دقيقة. أخرج القطع وزنها.');sync();render();}
async function weigh1(){if(S.busy||S.ph!==3)return;S.busy=true;sync();
  for(const b of B){const o=BK[b.k];await L.arc(o.ch,V(BAL.x,.25,BAL.z),800,1.2);balance(b.m1);await sleep(1000);S.res[b.k]=b.m1;renderNB();await L.arc(o.ch,V(b.x,.06,1.25),700,1.2);balance(0);}
  S.ph=4;S.busy=false;P3.good();toast('سُجّلت الكتل. قارن النقص في الكتلة بين الكؤوس.');sync();render();renderNB();}
function reset(){if(S.busy)return;Object.assign(S,{ph:0,min:0,res:{},w0:false});B.forEach(b=>{const o=BK[b.k];o.ch.position.set(b.x,.06,1.25);o.ch.scale.setScalar(1);o.bub.clear();});
  hand.rotation.z=0;hT.textContent='0 min';balance(0);sync();render();renderNB();toast('أُعيدت التجربة إلى بدايتها.');}
/* ---------- UI ---------- */
function render(){const k=Math.min(S.ph,3);let title,html;
  if(S.ph===0){title='زِن قطعة الطباشير';html=`<p class="p3-txt">الطباشير (كربونات الكالسيوم) يشبه الحجر الجيري. القطع الأربع متساوية الكتلة؛ زِن واحدة منها.</p>`;}
  else if(S.ph===1){title='ضع الطباشير في الكؤوس';html=`<p class="p3-txt">كأس ماء (مجموعة ضابطة)، وكأس خل، وكأس خل مع طباشير مفتّت، وكأس خل دافئ.</p>`;}
  else if(S.ph===2){title='راقب ثم انتظر';html=`<p class="p3-txt">في أي الكؤوس تتصاعد فقاعات أكثر؟ ثم اضغط «مرور 15 دقيقة».</p>`;}
  else if(S.ph===3){title='زِن القطع بعد التجربة';html=`<p class="p3-txt">تُخرج كل قطعة وتُجفف ثم توضع على الميزان.</p>`;}
  else{title='النتيجة';html=`<p class="p3-ok">لم تتغير الكتلة في الماء، ونقصت في الخل (تجوية كيميائية). وكان النقص أكبر عند تفتيت الطباشير وعند تدفئة الخل.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){const ks=B.filter(b=>S.res[b.k]!=null);let h=`<table class="p3-t"><thead><tr><th>الكأس</th><th>قبل (g)</th><th>بعد (g)</th><th>النقص (g)</th></tr></thead><tbody>`+
  B.map(b=>{const r=S.res[b.k];return `<tr><td>${b.n}</td><td class="n">${S.w0?M0.toFixed(2):'—'}</td><td class="n">${r!=null?r.toFixed(2):'—'}</td><td class="n">${r!=null?(M0-r).toFixed(2):'—'}</td></tr>`;}).join('')+'</tbody></table>';
  if(ks.length)h+=`<div style="margin-top:8px">${B.map(b=>{const r=S.res[b.k];const v=r!=null?M0-r:0;return `<div style="display:flex;align-items:center;gap:6px;margin:3px 0;font-size:.78rem;font-weight:700"><span style="width:96px">${b.n}</span><span style="flex:1;background:var(--surface-2);border-radius:6px;height:14px;overflow:hidden"><i style="display:block;height:100%;width:${v/1.4*100}%;background:var(--accent)"></i></span><span class="n" style="width:34px;direction:ltr">${r!=null?v.toFixed(2):''}</span></div>`;}).join('')}</div>`;
  sec.$('.p3-nb').innerHTML=h;}
function sync(){const b=S.busy;[['w0',0],['add',1],['wait',2],['w1',3]].forEach(([a,p])=>{const x=sec.$(`[data-a="${a}"]`);x.disabled=b||S.ph!==p;x.classList.toggle('done',S.ph>p);});sec.$('[data-a="reset"]').disabled=b;}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const a=x.dataset.a;
  if(a==='w0')weigh0();else if(a==='add')add();else if(a==='wait')wait();else if(a==='w1')weigh1();else if(a==='reset')reset();});
L.onTap(bal,()=>{if(S.ph===0)weigh0();else if(S.ph===3)weigh1();});
sync();render();renderNB();
};

/* =====================================================================
   ٦) تجربة رذرفورد: صفيحة الذهب — 3D (ثالث متوسط · نماذج الذرة)
   ===================================================================== */
const RUTH={};EXP_MODS.ruth=RUTH;
RUTH.init=function(){gm();
const N=400,D=Math.PI/180;
const S={pred:null,runs:[],last:null,busy:false,zoom:false};P3.dbg.ruth=S;
const NAMES=['التوقّع','نموذج طومسون','الإطلاق الفعلي','الاستنتاج'];
function angle(real){if(!real)return Math.abs(Math.random()+Math.random()+Math.random()-1.5)*.012;
  const r=Math.random();if(r<.006)return (95+Math.random()*80)*D;if(r<.056)return (10+80*Math.random()**2)*D;return 8*Math.random()**3*D;}
const sec=P3.section('ruth',{title:'تجربة رذرفورد: صفيحة الذهب',grade:'ثالث متوسط',lesson:'نماذج الذرة',
  hud:`<div class="p3-row"><div class="p3-m" style="color:#3fd0b0"><small>نفذت (أقل من 10°)</small><b class="ruA">0</b></div><div class="p3-m warm"><small>انحرفت (10°–90°)</small><b class="ruB">0</b></div><div class="p3-m" style="color:#ff8a8a"><small>ارتدّت (أكثر من 90°)</small><b class="ruC">0</b></div></div>`,
  overlay:`<div class="p3-mol" hidden><canvas width="600" height="390"></canvas></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">توقّع</span><span class="p3-txt" style="font-size:.82rem">وفق نموذج طومسون (الكعكة بالزبيب)، ماذا يحدث لجسيمات ألفا؟</span></div>
    <div class="p3-acts"><button class="p3-b" data-p="pass">تنفذ كلها تقريبًا</button><button class="p3-b" data-p="back">يرتد معظمها</button><button class="p3-b" data-p="stop">تتوقف داخل الصفيحة</button></div>
    <div class="p3-acts"><span class="p3-lab">الإطلاق</span><button class="p3-b" data-m="thom">⚛ وفق نموذج طومسون</button><button class="p3-b pri" data-m="real">☢ على صفيحة الذهب</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="zoom">🔬 عرض مقرّب للذرات</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>نموذج طومسون</h3><p>تصوّر طومسون الذرة كرة موجبة الشحنة تنتشر فيها الإلكترونات السالبة مثل الزبيب في الكعكة؛ فتوقّع أن تنفذ جسيمات ألفا كلها تقريبًا بانحراف ضئيل.</p></div>
    <div class="panel"><h3>ما الذي وجده رذرفورد؟</h3><p>نفذت <b>معظم</b> الجسيمات دون انحراف ← معظم حجم الذرة <b>فراغ</b>.</p><p>انحرف <b>قليل</b> منها وارتد عدد <b>قليل جدًا</b> ← في مركز الذرة <b>نواة</b> صغيرة جدًا كثيفة <b>موجبة الشحنة</b> تتنافر مع جسيمات ألفا الموجبة.</p></div>`,
  quiz:[{q:'نفذت معظم جسيمات ألفا دون انحراف، وهذا يدل على أن:',o:['معظم حجم الذرة فراغ','الذرة كرة مصمتة','الذرة سالبة الشحنة'],a:0},
        {q:'ارتداد عدد قليل جدًا من الجسيمات يدل على وجود:',o:['نواة صغيرة جدًا كثيفة في المركز','إلكترونات كثيرة على السطح','ثقوب في الصفيحة'],a:0},
        {q:'شحنة النواة موجبة لأن جسيمات ألفا الموجبة:',o:['تنافرت معها فانحرفت أو ارتدت','انجذبت إليها والتصقت بها','لم تتأثر بها'],a:0},
        {q:'وفق نموذج طومسون كان المتوقع أن:',o:['ترتد معظم الجسيمات','تنفذ الجسيمات كلها تقريبًا','تتوقف داخل الصفيحة'],a:1}],
  report:()=>({title:'تجربة رذرفورد: صفيحة الذهب',grade:'ثالث متوسط',lesson:'نماذج الذرة',cols:['الإطلاق','نفذت','انحرفت','ارتدّت','نسبة النافذة'],
    rows:S.runs.length?S.runs.map((r,i)=>[(r.real?'صفيحة الذهب':'نموذج طومسون')+` (${i+1})`,String(r.a),String(r.b),String(r.c),(r.a/N*100).toFixed(1)+'%']):[['','','','','']],note:'ماذا تستنتج عن تركيب الذرة؟'})
});
const L=new Lab(sec,{target:V(.3,.9,.3),dist:a=>Math.max(3.5,5.9/a),exposure:.85});buildRoom(L);
const toast=m=>L.toast(m);
/* ---------- vacuum chamber (dark box, open towards the viewer) ---------- */
const CX=.3,CY=.95,CZ=.1,R=1.2;const CH=new THREE.Group();CH.position.set(CX,0,CZ);
const dark=KIT.mat(0x0b1216,{roughness:.95});
const box=new THREE.Group();[[0,CY,-1.45,3.4,1.9,.05],[0,.04,0,3.4,.08,2.9],[-1.7,CY,0,.05,1.9,2.9],[1.7,CY,0,.05,1.9,2.9],[0,CY+.95,0,3.4,.05,2.9]].forEach(([x,y,z,w,h,d])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),dark);m.position.set(x,y,z);box.add(m);});
const rim=new THREE.Mesh(new THREE.BoxGeometry(3.5,.06,.06),KIT.mat(0x2d3a40,{metalness:.5}));rim.position.set(0,CY+.95,1.45);box.add(rim);
const inLight=new THREE.PointLight(0x9fd8ff,.6,4,2);inLight.position.set(0,CY+.8,.6);box.add(inLight);
// fluorescent ZnS screen (ring, opening faces the viewer)
const scrM=new THREE.MeshStandardMaterial({color:0x1b4a36,emissive:0x0c3a24,roughness:.7,side:THREE.DoubleSide});
const scr=new THREE.Mesh(new THREE.CylinderGeometry(R,R,.55,96,1,true,Math.PI*.2,Math.PI*1.6),scrM);scr.position.y=CY;
const foilF=new THREE.Mesh(RBox(.05,.55,.45,.01),KIT.mat(0x3a3f44,{metalness:.6}));foilF.position.set(0,CY,0);
const foil=new THREE.Mesh(new THREE.PlaneGeometry(.36,.42),new THREE.MeshStandardMaterial({color:0xffcf4a,metalness:.9,roughness:.2,side:THREE.DoubleSide,emissive:0x8a6000,emissiveIntensity:.6}));foil.rotation.y=Math.PI/2;foil.position.set(.028,CY,0);
const post=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,CY-.3,10),M.steel);post.position.set(0,(CY-.3)/2+.08,0);
const src=new THREE.Group();const lead=new THREE.Mesh(RBox(.42,.36,.36,.03),KIT.mat(0x55606a,{metalness:.4,roughness:.5}));src.add(lead);
const slit=new THREE.Mesh(new THREE.BoxGeometry(.02,.05,.05),new THREE.MeshBasicMaterial({color:0xff7a4d}));slit.position.x=.215;src.add(slit);
const rad=P3.card([{t:'☢ مصدر ألفا',s:54}],.34,.12,{bg:'#ffd84a',bd:'#222',ink:'#222'});rad.position.set(0,.03,.182);src.add(rad);
src.position.set(-.95,CY,0);const srcPost=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,CY-.25,10),M.steel);srcPost.position.set(-.95,(CY-.25)/2+.08,0);
CH.add(box,scr,foilF,foil,post,src,srcPost);L.add(CH);
L.label('مصدر جسيمات ألفا',V(CX-.95,CY+.36,CZ),'small');L.label('صفيحة ذهب رقيقة',V(CX,CY+.4,CZ),'small');L.label('شاشة كبريتيد الخارصين: تومض عند كل اصطدام',V(CX,CY+.45,CZ-1.2),'small');
/* ---------- particles, tracks + flashes ---------- */
const NV=160;const pm=new THREE.MeshBasicMaterial({color:0xffa060});const ip=new THREE.InstancedMesh(new THREE.SphereGeometry(.03,10,8),pm,NV);ip.count=0;ip.frustumCulled=false;CH.add(ip);
const trkG=new THREE.BufferGeometry(),trkP=new Float32Array(NV*6),trkC=new Float32Array(NV*6);trkG.setAttribute('position',new THREE.BufferAttribute(trkP,3));trkG.setAttribute('color',new THREE.BufferAttribute(trkC,3));
const trk=new THREE.LineSegments(trkG,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));trk.frustumCulled=false;CH.add(trk);trkG.setDrawRange(0,0);
const flashes=[];const fm=new THREE.SpriteMaterial({map:P3.glowTex(),color:$lc(0x7dffb0),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
for(let i=0;i<90;i++){const s=new THREE.Sprite(fm.clone());s.visible=false;s.scale.setScalar(.2);s.renderOrder=11;CH.add(s);flashes.push({s,t:-9});}
let fi=0;function flash(p,col){const f=flashes[fi++%flashes.length];f.s.position.copy(p);f.s.material.color.copy($lc(col));f.s.visible=true;f.t=performance.now();}
const beam=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.7,8),new THREE.MeshBasicMaterial({color:0xff7a4d,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));beam.rotation.z=Math.PI/2;beam.position.set(-.38,CY,0);CH.add(beam);
const dum=new THREE.Object3D();let trkFade=0;
P3.loop(L,(dt,t,now)=>{flashes.forEach(f=>{if(!f.s.visible)return;const a=(now-f.t)/900;if(a>1){f.s.visible=false;return;}f.s.material.opacity=1-a;f.s.scale.setScalar(.16+.12*(1-a));});
  if(trkFade>0){trkFade-=dt;trk.material.opacity=Math.min(.9,trkFade);if(trkFade<=0)trkG.setDrawRange(0,0);}
  if(S.zoom&&!molBox.hidden)drawZoom(dt);});
function dirOf(th){const az=(Math.random()-.5)*.6;return V(Math.cos(th),Math.sin(th)*Math.sin(az)*.25,-Math.sin(th)*Math.cos(az)).normalize();}
const COL=th=>th>Math.PI/2?0xff6a6a:th>10*D?0xffd27a:0x7dffb0;
async function fire(real){if(S.busy)return;if(!S.pred){toast('سجّل توقّعك أولًا وفق نموذج طومسون.');return;}S.busy=true;sync();
  const th=[...Array(N)].map(()=>angle(real)),cnt={a:0,b:0,c:0};
  const vis=th.map((t,i)=>({t,i,s:Math.random()*.85,d:dirOf(t),y0:(Math.random()-.5)*.03,z0:(Math.random()-.5)*.03})).filter((o,i)=>o.t>.17||i%6===0).slice(0,NV);
  const shown=new Set();beam.material.opacity=.45;trkFade=0;trk.material.opacity=.9;P3.noise(5.8,.05,1200,.4);
  const el={a:sec.$('.ruA'),b:sec.$('.ruB'),c:sec.$('.ruC')};const c3=new THREE.Color();
  await L.tw(6000,k=>{let n=0,tn=0;vis.forEach((o,j)=>{const u=(k-o.s)/.09;if(u<0)return;let p;
      if(u<1)p=V(-.74+.74*u,CY+o.y0,o.z0);else{const v=(u-1)*.5;const end=o.d.clone().multiplyScalar(R*Math.min(1,v)).add(V(0,CY+o.y0,o.z0));
        if(o.t>10*D){trkP.set([0,CY,0,end.x,end.y,end.z],tn*6);c3.copy($lc(COL(o.t)));trkC.set([c3.r,c3.g,c3.b,c3.r,c3.g,c3.b],tn*6);tn++;}
        if(v>=1){if(!shown.has(j)){shown.add(j);flash(o.d.clone().multiplyScalar(R).add(V(0,CY,0)),COL(o.t));}return;}p=end;}
      dum.position.copy(p);dum.updateMatrix();ip.setMatrixAt(n++,dum.matrix);});ip.count=n;ip.instanceMatrix.needsUpdate=true;
    trkG.setDrawRange(0,tn*2);trkG.attributes.position.needsUpdate=true;trkG.attributes.color.needsUpdate=true;
    const m=Math.round(N*k);let a=0,b=0,c=0;for(let i=0;i<m;i++){const d=th[i]/D;if(d<10)a++;else if(d<=90)b++;else c++;}el.a.textContent=a;el.b.textContent=b;el.c.textContent=c;
    if(Math.random()<.45){const t=Math.random()*.15;flash(V(Math.cos(t)*R,CY+(Math.random()-.5)*.12,-Math.sin(t)*R),0x7dffb0);}});
  ip.count=0;beam.material.opacity=0;trkFade=6;th.forEach(t=>{const d=t/D;if(d<10)cnt.a++;else if(d<=90)cnt.b++;else cnt.c++;});
  el.a.textContent=cnt.a;el.b.textContent=cnt.b;el.c.textContent=cnt.c;
  S.runs.push({real,...cnt});S.last={real,...cnt};S.busy=false;P3.click();
  toast(real?`نفذت ${(cnt.a/N*100).toFixed(1)}% من الجسيمات، وانحرف ${cnt.b}، وارتدّ ${cnt.c} فقط من ${N}. الخطوط الملوّنة مسارات المنحرفة والمرتدة.`:'وفق نموذج طومسون: نفذت الجسيمات كلها تقريبًا دون انحراف.');
  if(real&&!S.zoom){S.zoom=true;molBox.hidden=false;}sync();render();renderNB();}
/* ---------- zoomed atomic view (2D canvas) ---------- */
const molBox=sec.$('.p3-mol'),cv=molBox.querySelector('canvas'),cx=cv.getContext('2d');const W=cv.width,H=cv.height;let zp=[],zacc=0;
const nuc=[];for(let r=0;r<3;r++)for(let c=0;c<4;c++)nuc.push({x:150+c*110+(r%2)*55,y:90+r*105});
function drawZoom(dt){cx.fillStyle='#0b2230';cx.fillRect(0,0,W,H);
  nuc.forEach(n=>{cx.strokeStyle='rgba(127,214,255,.18)';cx.lineWidth=1;cx.beginPath();cx.arc(n.x,n.y,46,0,7);cx.stroke();cx.fillStyle='#ffcf4a';cx.beginPath();cx.arc(n.x,n.y,4,0,7);cx.fill();
    for(let i=0;i<3;i++){const a=performance.now()/600+i*2.1+n.x;cx.fillStyle='#7fd6ff';cx.beginPath();cx.arc(n.x+Math.cos(a)*46,n.y+Math.sin(a)*46,2.5,0,7);cx.fill();}});
  zacc+=dt*(S.busy?14:5);while(zacc>=1){zacc--;zp.push({x:0,y:30+Math.random()*(H-90),vx:220,vy:0});}
  zp.forEach(p=>{nuc.forEach(n=>{const dx=p.x-n.x,dy=p.y-n.y,d2=dx*dx+dy*dy;if(d2<1600){const f=9e5/(d2*Math.sqrt(d2)+1);p.vx+=dx*f*dt;p.vy+=dy*f*dt;}});
    const sp=Math.hypot(p.vx,p.vy)||1;p.vx=p.vx/sp*220;p.vy=p.vy/sp*220;p.x+=p.vx*dt;p.y+=p.vy*dt;cx.fillStyle='#ff7a4d';cx.beginPath();cx.arc(p.x,p.y,4,0,7);cx.fill();});
  zp=zp.filter(p=>p.x>-10&&p.x<W+10&&p.y>-10&&p.y<H-50);
  cx.fillStyle='rgba(0,0,0,.4)';cx.fillRect(0,H-46,W,46);cx.fillStyle='#fff';cx.font='700 22px "IBM Plex Sans Arabic",sans-serif';cx.direction='rtl';cx.textAlign='center';
  cx.fillText('معظم الذرة فراغ… والنواة الموجبة تصدّ ما يقترب منها',W/2,H-16);}
/* ---------- UI ---------- */
function stepIdx(){if(!S.pred)return 0;if(S.runs.some(r=>r.real))return 3;if(!S.runs.length)return 1;return 2;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='توقّع النتيجة';html=`<p class="p3-txt">قبل الإطلاق: ماذا يتوقع نموذج طومسون (الكعكة بالزبيب) لجسيمات ألفا الموجبة عند إطلاقها على صفيحة ذهب رقيقة؟</p>`;}
  else if(k===1){title='جرّب نموذج طومسون';html=`<p class="p3-txt">${S.pred==='pass'?'توقّعك يوافق نموذج طومسون.':'نموذج طومسون يتوقع أن تنفذ الجسيمات كلها تقريبًا.'} اضغط «وفق نموذج طومسون» وراقب الشاشة والعدّادات.</p>`;}
  else if(k===2){title='الإطلاق الفعلي على صفيحة الذهب';html=`<p class="p3-txt">أطلق الجسيمات على صفيحة الذهب الحقيقية، وراقب ومضات الشاشة: هل يرتد شيء منها؟</p>`;}
  else{const l=S.runs.filter(r=>r.real).pop();title='استنتج';html=`<p class="p3-txt">نفذت <b>${(l.a/N*100).toFixed(1)}%</b> من الجسيمات، وانحرف ${l.b}، وارتدّ ${l.c} فقط من ${N}.</p><p class="p3-ok">معظم الذرة فراغ، وفي مركزها نواة صغيرة كثيفة موجبة الشحنة.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){let h=`<table class="p3-t"><thead><tr><th>الإطلاق</th><th>نفذت</th><th>انحرفت</th><th>ارتدّت</th></tr></thead><tbody>`+
  (S.runs.length?S.runs.map(r=>`<tr><td>${r.real?'صفيحة الذهب':'نموذج طومسون'}</td><td class="n">${r.a}</td><td class="n">${r.b}</td><td class="n">${r.c}</td></tr>`).join(''):`<tr><td colspan="4" class="muted">ستظهر هنا نتائج كل إطلاق (${N} جسيم).</td></tr>`)+'</tbody></table>';
  sec.$('.p3-nb').innerHTML=h;}
function sync(){const b=S.busy;sec.$$('button[data-p]').forEach(x=>{x.setAttribute('aria-pressed',x.dataset.p===S.pred);x.disabled=b;});sec.$$('[data-m]').forEach(x=>x.disabled=b||!S.pred);
  sec.$('[data-a="zoom"]').setAttribute('aria-pressed',S.zoom);sec.$('[data-a="reset"]').disabled=b;}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const d=x.dataset;
  if(d.p){S.pred=d.p;P3.click();toast(d.p==='pass'?'صحيح: هذا ما يتوقعه نموذج طومسون. لنجرّب!':'نموذج طومسون يتوقع أن تنفذ الجسيمات كلها تقريبًا؛ لنجرّب ونرَ.');sync();render();}
  else if(d.m)fire(d.m==='real');
  else if(d.a==='zoom'){S.zoom=!S.zoom;molBox.hidden=!S.zoom;sync();}
  else if(d.a==='reset'){if(S.busy)return;S.pred=null;S.runs=[];S.last=null;['.ruA','.ruB','.ruC'].forEach(q=>sec.$(q).textContent='0');sync();render();renderNB();}});
L.onTap(src,()=>fire(true));
sync();render();renderNB();
};

/* =====================================================================
   ٧) نموذج عمر النصف — 3D (ثالث متوسط · النواة)
   ===================================================================== */
const HALF={};EXP_MODS.half=HALF;
HALF.init=function(){gm();
const N=100,MAXT=15;
const MODES={coin:{n:'العملات',d:'تتحلل العملة إذا ظهرت «ص» (احتمال ½)',p:.5,c:'#e0a526'},cube:{n:'المكعبات',d:'يتحلل المكعب إذا ظهر الرقم 6 (احتمال ⅙)',p:1/6,c:'#2f6fbf'}};
const Q=[{q:'عدد الرميات التي يقل فيها عدد العملات غير المتحللة إلى النصف تقريبًا:',o:{one:'رمية واحدة',four:'أربع رميات',ten:'عشر رميات'},a:'one'},
  {q:'عمر النصف في نموذج المكعبات مقارنة بنموذج العملات:',o:{long:'أطول',short:'أقصر',same:'مساوٍ'},a:'long'},
  {q:'بعد مرور ثلاثة أعمار نصف، يبقى من النوى غير المتحللة نحو:',o:{e:'الثُّمن (12.5%)',h:'النصف (50%)',z:'لا شيء'},a:'e'},
  {q:'هل يمكن معرفة أي عملة ستتحلل في الرمية القادمة؟',o:{no:'لا، لكن يمكن توقّع النسبة التقريبية',yes:'نعم، بدقة تامة',never:'لا، ولا يمكن توقّع أي شيء'},a:'no'}];
const S={mode:'coin',data:{coin:[N],cube:[N]},alive:{coin:Array(N).fill(true),cube:Array(N).fill(true)},busy:false,qa:{}};P3.dbg.half=S;
const NAMES=['اختر النموذج','ارمِ وعُدّ','كرّر وارسم المنحنى','استنتج'];
const sec=P3.section('half',{title:'نموذج عمر النصف',grade:'ثالث متوسط',lesson:'النواة',
  hud:`<div class="p3-row"><div class="p3-m"><small>الرميات</small><b class="hfK">0</b></div><div class="p3-m warm"><small>غير المتحللة</small><b class="hfR">100</b></div></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">النموذج</span><button class="p3-b" data-m="coin">🪙 العملات (½)</button><button class="p3-b" data-m="cube">🎲 المكعبات (⅙)</button></div>
    <div class="p3-acts"><button class="p3-b pri" data-a="roll">🎲 ارمِ (هزّ الصندوق)</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>التحلل الإشعاعي وعمر النصف</h3><p>النوى غير المستقرة تتحلل عشوائيًا؛ لا نعرف متى تتحلل نواة بعينها، لكننا نعرف <b>نسبة</b> ما يتحلل خلال زمن معيّن.</p>
      <p><b>عمر النصف:</b> الزمن اللازم لتحلل نصف النوى المشعة في العيّنة. بعد عمر نصف يبقى ½، وبعد عمرين ¼، وبعد ثلاثة ⅛.</p></div>
    <div class="panel"><h3>النموذج</h3><p>كل رمية تمثّل مرور فترة زمنية. العملة تمثّل نواة احتمال تحللها ½ في كل فترة، والمكعب نواة احتمال تحللها ⅙؛ لذلك عمر النصف في المكعبات أطول.</p></div>`,
  quiz:Q.map(q=>({q:q.q,o:Object.values(q.o),a:Object.keys(q.o).indexOf(q.a)})),
  report:()=>({title:'نموذج عمر النصف',grade:'ثالث متوسط',lesson:'النواة',cols:['الرمية','العملات غير المتحللة','المكعبات غير المتحللة'],
    rows:[...Array(Math.max(S.data.coin.length,S.data.cube.length))].map((_,i)=>[String(i),S.data.coin[i]!=null?String(S.data.coin[i]):'',S.data.cube[i]!=null?String(S.data.cube[i]):'']),note:'ارسم منحنى عدد النوى غير المتحللة مع عدد الرميات لكل نموذج، وحدّد عمر النصف.'})
});
const L=new Lab(sec,{target:V(.2,.3,.55),dist:a=>Math.max(4.8,7.8/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* ---------- tray ---------- */
const TX=-.35,TZ=.25,SP=.27;const TR=new THREE.Group();TR.position.set(TX,0,TZ);
const tb=new THREE.Mesh(RBox(3.0,.05,3.0,.02),KIT.wood(0x7a5232));tb.position.y=.025;tb.receiveShadow=true;TR.add(tb);
[[0,1.5,3.04,.06],[0,-1.5,3.04,.06],[1.5,0,.06,3.04],[-1.5,0,.06,3.04]].forEach(([x,z,w,d])=>{const m=new THREE.Mesh(RBox(w,.16,d,.02),KIT.wood(0x8a5a32));m.position.set(x,.08,z);m.castShadow=true;TR.add(m);});
const felt=new THREE.Mesh(new THREE.PlaneGeometry(2.92,2.92),KIT.mat(0x1f5b4c,{roughness:.95}));felt.rotation.x=-Math.PI/2;felt.position.y=.052;TR.add(felt);
L.add(TR);
/* pile box for decayed nuclei */
const PX=2.05,PZ=.25;const pile=new THREE.Group();pile.position.set(PX,0,PZ);
[[0,.5,1.0,.04],[0,-.5,1.0,.04],[.5,0,.04,1.0],[-.5,0,.04,1.0]].forEach(([x,z,w,d])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,.3,d),new THREE.MeshPhysicalMaterial({color:0xf1d9d4,transparent:true,opacity:.35,roughness:.1,depthWrite:false}));m.position.set(x,.15,z);m.renderOrder=3;pile.add(m);});
const pf=new THREE.Mesh(new THREE.BoxGeometry(1,.02,1),KIT.mat(0x5a2a24));pf.position.y=.01;pile.add(pf);L.add(pile);
L.label('النوى المتحللة',V(PX,.55,PZ),'small');L.label('صندوق النوى (100)',V(TX,.35,TZ-1.65),'small');
/* ---------- coins + dice ---------- */
function faceTex(draw){return canvasTex(128,128,c=>draw(c,128));}
const coinSide=KIT.mat(0xb8891e,{metalness:.85,roughness:.35});
const coinTex=t=>faceTex((c,w)=>{const g=c.createRadialGradient(w*.4,w*.35,4,w/2,w/2,w/2);g.addColorStop(0,'#ffe9a0');g.addColorStop(1,'#c9971f');c.fillStyle=g;c.fillRect(0,0,w,w);
  c.strokeStyle='#9a7616';c.lineWidth=7;c.beginPath();c.arc(w/2,w/2,w/2-6,0,7);c.stroke();c.fillStyle='#6b5210';c.font='800 70px "IBM Plex Sans Arabic",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(t,w/2,w/2+4);});
const cK=new THREE.MeshStandardMaterial({map:coinTex('ك'),metalness:.6,roughness:.35}),cS=new THREE.MeshStandardMaterial({map:coinTex('ص'),metalness:.6,roughness:.35});
const cR=KIT.mat(0xd9452e,{roughness:.4,emissive:0x400a00});
const MAT_C=[coinSide,cK,cS],MAT_CR=[cR,cR,cR];
const pipT=(n,red)=>faceTex((c,w)=>{c.fillStyle=red?'#d9452e':'#f8f8f6';c.fillRect(0,0,w,w);c.strokeStyle=red?'#8e2116':'#b9c2c6';c.lineWidth=6;c.strokeRect(3,3,w-6,w-6);
  const P={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]}[n];
  c.fillStyle=red?'#fff':'#26333a';P.forEach(([x,y])=>{c.beginPath();c.arc(w/2+x*32,w/2+y*32,12,0,7);c.fill();});});
const ORD=[3,4,1,6,2,5];const MAT_D=ORD.map(n=>new THREE.MeshStandardMaterial({map:pipT(n),roughness:.45})),MAT_DR=ORD.map(n=>new THREE.MeshStandardMaterial({map:pipT(n,true),roughness:.45}));
const UP={1:[0,0],6:[Math.PI,0],2:[-Math.PI/2,0],5:[Math.PI/2,0],3:[0,Math.PI/2],4:[0,-Math.PI/2]};
const coinGeo=new THREE.CylinderGeometry(.105,.105,.028,28),dieGeo=new THREE.BoxGeometry(.16,.16,.16);
const P={coin:[],cube:[]};
const home=i=>V(TX-1.215+(i%10)*SP,0,TZ-1.215+Math.floor(i/10)*SP);
for(let i=0;i<N;i++){['coin','cube'].forEach(m=>{const g=new THREE.Group();const me=new THREE.Mesh(m==='coin'?coinGeo:dieGeo,m==='coin'?MAT_C:MAT_D);me.castShadow=true;
  me.position.y=m==='coin'?.014:.08;g.add(me);g.position.copy(home(i)).add(V(0,.052,0));g.rotation.y=Math.random()*6.28;g.visible=m==='coin';L.scene.add(g);P[m].push({g,me,face:m==='coin'?0:1});});}
function setFace(m,o,f){o.face=f;if(m==='coin'){o.me.rotation.set(f?Math.PI:0,0,0);}else{const[x,z]=UP[f];o.me.rotation.set(x,0,z);}}
P.cube.forEach(o=>setFace('cube',o,1+Math.floor(Math.random()*5)));
/* ---------- roll ---------- */
const left=m=>S.alive[m].filter(Boolean).length;
async function roll(){const m=S.mode;if(S.busy)return;if(!left(m)||S.data[m].length>MAXT){toast('انتهت الرميات لهذا النموذج. جرّب النموذج الآخر.');return;}
  S.busy=true;sync();const A=P[m].map((o,i)=>({o,i,a:S.alive[m][i],ph:Math.random()*6.28,h:.25+Math.random()*.35,sx:(Math.random()-.5)*12,sz:(Math.random()-.5)*12}));
  A.forEach(x=>{if(!x.a)return;const f=m==='coin'?(Math.random()<.5?1:0):1+Math.floor(Math.random()*6);x.f=f;});
  const t0=TR.position.clone();
  await L.tw(1100,k=>{const s=Math.sin(k*Math.PI*6)*(1-k)*.06;TR.position.x=t0.x+s;
    A.forEach(x=>{if(!x.a)return;const hp=home(x.i);const j=Math.abs(Math.sin(k*Math.PI*2+x.ph))*x.h*(1-k);x.o.g.position.set(hp.x+s,.052+j,hp.z);
      x.o.me.rotation.set(x.sx*k*(1-k)*4,0,x.sz*k*(1-k)*4);});if(Math.random()<.3)P3.tone(300+Math.random()*500,.03,'square',.025);});
  TR.position.copy(t0);const dec=[];
  A.forEach(x=>{if(!x.a)return;setFace(m,x.o,x.f);x.o.g.position.copy(home(x.i)).add(V(0,.052,0));const d=m==='coin'?x.f===1:x.f===6;if(d){dec.push(x);x.o.me.material=m==='coin'?MAT_CR:MAT_DR;}});
  await sleep(1000);
  // move decayed to the pile
  const base=N-left(m);const pos=dec.map((x,j)=>{const n=base+j;return V(PX-.38+(n%8)*.11,.04+Math.floor(n/64)*.06,PZ-.38+(Math.floor(n/8)%8)*.11);});
  const from=dec.map(x=>x.o.g.position.clone());
  await L.tw(800,k=>{const e=ease(k);dec.forEach((x,j)=>{const p=lerpV(from[j],pos[j],e);p.y+=Math.sin(Math.PI*k)*.6;x.o.g.position.copy(p);x.o.g.scale.setScalar(1-.45*e);});});
  dec.forEach(x=>S.alive[m][x.i]=false);S.data[m].push(left(m));P3.click();
  const prev=S.data[m][S.data[m].length-2],n=left(m),k=S.data[m].length-1;
  toast(`تحللت ${prev-n} نواة، وبقيت ${n}.`+(prev>50&&n<=50?` وصل العدد إلى النصف تقريبًا بعد ${k} ${k===1?'رمية':'رميات'}: هذا عمر النصف في هذا النموذج.`:''));
  S.busy=false;hud();sync();render();renderNB();}
function showMode(m){['coin','cube'].forEach(k=>P[k].forEach(o=>o.g.visible=k===m));}
function resetMode(m){S.data[m]=[N];S.alive[m]=Array(N).fill(true);P[m].forEach((o,i)=>{o.g.position.copy(home(i)).add(V(0,.052,0));o.g.scale.setScalar(1);o.me.material=m==='coin'?MAT_C:MAT_D;setFace(m,o,m==='coin'?0:1+Math.floor(Math.random()*5));});}
function hud(){sec.$('.hfK').textContent=S.data[S.mode].length-1;sec.$('.hfR').textContent=left(S.mode);}
/* ---------- UI ---------- */
function ready(){return S.data.coin.length>=4&&S.data.cube.length>=4;}
function stepIdx(){const n=S.data.coin.length+S.data.cube.length-2;if(n===0)return 0;if(n<3)return 1;if(!ready())return 2;return 3;}
function render(){const k=stepIdx(),md=MODES[S.mode];let title,html;
  if(k<3){title=k===0?'اختر النموذج ثم ارمِ':k===1?'ارمِ وعُدّ':'كرّر في النموذجين';html=`<p class="p3-txt"><b>${md.n}:</b> ${md.d}. القطع المتحللة تتلوّن بالأحمر ثم تُنقل إلى صندوق النوى المتحللة.</p><p class="p3-txt" style="margin-top:4px">${k===2?'أكمل ثلاث رميات على الأقل في كل نموذج، ثم قارن المنحنيين.':'كل رمية تمثّل مرور فترة زمنية.'}</p>`;}
  else{title='استنتج من المنحنى';html=Q.map((q,i)=>`<p class="p3-txt" style="margin-top:6px"><b>${i+1}.</b> ${q.q}</p><div class="p3-acts" style="margin-top:4px">${Object.entries(q.o).map(([kk,v])=>`<button class="p3-b hfQ ${S.qa[i]==null?'':kk===q.a?'done':S.qa[i]===kk?'':''}" data-i="${i}" data-k="${kk}" aria-pressed="${S.qa[i]===kk}">${v}</button>`).join('')}${S.qa[i]!=null?`<span class="p3-fb ${S.qa[i]===q.a?'ok':'bad'}">${S.qa[i]===q.a?'✓':'✗'}</span>`:''}</div>`).join('');}
  sec.steps(NAMES,k,title,html);
  sec.$$('.hfQ').forEach(b=>b.onclick=()=>{S.qa[b.dataset.i]=b.dataset.k;if(b.dataset.k===Q[b.dataset.i].a)P3.good();render();});}
function renderNB(){const ch=KIT.chart({w:520,h:250,xl:'عدد الرميات',yl:'غير المتحللة',xmin:0,xmax:Math.max(4,S.data.coin.length-1,S.data.cube.length-1),ymin:0,ymax:N,
    series:[{name:'العملات',c:MODES.coin.c,pts:S.data.coin.map((v,i)=>[i,v])},{name:'المكعبات',c:MODES.cube.c,pts:S.data.cube.map((v,i)=>[i,v])},{name:'النصف (50)',c:'#9aa6ab',pts:[[0,50],[Math.max(4,S.data.coin.length-1,S.data.cube.length-1),50]]}],empty:'ارمِ لتبدأ المنحنى.'});
  const n=Math.max(S.data.coin.length,S.data.cube.length);
  sec.$('.p3-nb').innerHTML=ch+`<table class="p3-t" style="margin-top:6px"><thead><tr><th>الرمية</th><th>العملات</th><th>المكعبات</th></tr></thead><tbody>${[...Array(n)].map((_,i)=>`<tr><td class="n">${i}</td><td class="n">${S.data.coin[i]??'—'}</td><td class="n">${S.data.cube[i]??'—'}</td></tr>`).join('')}</tbody></table>`;}
function sync(){const b=S.busy;sec.$$('[data-m]').forEach(x=>{x.setAttribute('aria-pressed',x.dataset.m===S.mode);x.disabled=b;});sec.$('[data-a="roll"]').disabled=b;sec.$('[data-a="reset"]').disabled=b;}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const d=x.dataset;
  if(d.m){S.mode=d.m;showMode(d.m);hud();P3.click();sync();render();}
  else if(d.a==='roll')roll();
  else if(d.a==='reset'){if(S.busy)return;resetMode('coin');resetMode('cube');S.qa={};hud();sync();render();renderNB();toast('أُعيدت التجربة.');}});
L.onTap(TR,roll);
showMode('coin');hud();sync();render();renderNB();
};

/* =====================================================================
   ٨) الفلزات واللافلزات وأشباه الفلزات — 3D (ثالث متوسط · العناصر الممثلة)
   ===================================================================== */
const ELEM={};EXP_MODS.elem=ELEM;
ELEM.init=function(){gm();
const E=[{k:'Cu',n:'النحاس',lus:'لامع',L:1,cond:'جيد',ci:1,mal:'يُطرق إلى صفيحة',flat:1,cls:'metal',col:0xc7774a,met:.95,rough:.25},
  {k:'Al',n:'الألومنيوم',lus:'لامع',L:1,cond:'جيد',ci:1,mal:'يُطرق إلى صفيحة',flat:1,cls:'metal',col:0xc9ced3,met:.95,rough:.2},
  {k:'Mg',n:'المغنيسيوم',lus:'لامع بعد صنفرته',L:1,cond:'جيد',ci:1,mal:'ينثني ويُطرق',flat:1,cls:'metal',col:0xb9bfc4,met:.9,rough:.3},
  {k:'S',n:'الكبريت',lus:'غير لامع (باهت)',L:0,cond:'لا يوصل',ci:0,mal:'هشّ يتفتت',flat:0,cls:'nonmetal',col:0xf2d43a,met:0,rough:.95},
  {k:'C',n:'الكربون (جرافيت)',lus:'رمادي لامع قليلًا',L:.5,cond:'يوصل',ci:.8,mal:'هشّ يتفتت',flat:0,cls:'nonmetal',col:0x3a3f44,met:.35,rough:.55},
  {k:'Si',n:'السيليكون',lus:'لامع (فلزي المظهر)',L:1,cond:'ضعيف',ci:.18,mal:'هشّ يتكسر',flat:0,cls:'metalloid',col:0x5d6875,met:.8,rough:.25}];
const CLS={metal:'فلز',nonmetal:'لافلز',metalloid:'شبه فلز'};
const S={cur:null,busy:false,res:{},cls:{},fb:{}};E.forEach(e=>S.res[e.k]={});P3.dbg.elem=S;
const NAMES=['اختيار العيّنة','البريق','التوصيل والطرق','التصنيف'];
const sec=P3.section('elem',{title:'الفلزات واللافلزات وأشباه الفلزات',grade:'ثالث متوسط',lesson:'العناصر الممثلة',
  hud:`<div class="p3-m warm" style="min-width:190px"><small>نتيجة آخر اختبار</small><b class="emR" style="font-family:var(--f-body);font-size:1rem">—</b></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">العيّنة</span>${E.map(e=>`<button class="p3-b" data-k="${e.k}">${e.n.split(' ')[0]}</button>`).join('')}</div>
    <div class="p3-acts"><span class="p3-lab">الاختبار</span><button class="p3-b" data-t="lus">🔍 البريق</button><button class="p3-b" data-t="cond">💡 التوصيل الكهربائي</button><button class="p3-b" data-t="mal">🔨 الطرق</button></div>
    <div class="p3-acts emCls" hidden><span class="p3-lab">صنّفها</span>${Object.entries(CLS).map(([k,v])=>`<button class="p3-b" data-c="${k}">${v}</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة التجربة</button></div></div>`,
  learn:`<div class="panel"><h3>الفكرة العلمية</h3><p><b>الفلزات:</b> لامعة، جيدة التوصيل للحرارة والكهرباء، قابلة للطرق والسحب، وتقع في يسار الجدول الدوري ووسطه.</p><p><b>اللافلزات:</b> غير لامعة غالبًا، رديئة التوصيل، هشّة في الحالة الصلبة، وتقع في يمين الجدول الدوري.</p><p><b>أشباه الفلزات:</b> لها بعض خصائص الفلزات وبعض خصائص اللافلزات، وتقع على امتداد الخط المتعرج في الجدول.</p></div>
    <div class="panel"><h3>استخدامات</h3><p>يُستخدم النحاس في الأسلاك الكهربائية لجودة توصيله، والألومنيوم في رقائق التغليف لقابليته للطرق، والسيليكون في الرقائق الإلكترونية لأنه شبه موصل.</p></div>`,
  quiz:[{q:'العنصر الذي يُستخدم في صناعة الرقائق الإلكترونية لأنه شبه موصل:',o:['السيليكون','الكبريت','النحاس'],a:0},{q:'قابلية الفلز للتشكّل صفائح بالطرق تسمى:',o:['قابلية الطرق','قابلية السحب','الهشاشة'],a:0},
        {q:'تقع الفلزات في الجدول الدوري:',o:['في يسار الجدول ووسطه','في أقصى اليمين فقط','في الصف الأخير فقط'],a:0},{q:'لافلز يوصل الكهرباء:',o:['الجرافيت','الكبريت','الأكسجين'],a:0},{q:'العناصر التي لها خصائص بين الفلزات واللافلزات:',o:['أشباه الفلزات','الغازات النبيلة','الهالوجينات'],a:0}],
  report:()=>({title:'الفلزات واللافلزات وأشباه الفلزات',grade:'ثالث متوسط',lesson:'العناصر الممثلة',cols:['العنصر','البريق','التوصيل الكهربائي','عند الطرق'],
    rows:E.map(e=>{const r=S.res[e.k];return [`${e.n} (${e.k})`,r.lus||'',r.cond||'',r.mal||''];}),note:'صنّف كل عنصر: فلز، أو لافلز، أو شبه فلز، واذكر الدليل.'})
});
const L=new Lab(sec,{target:V(0,.55,.45),dist:a=>Math.max(4.6,8/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m),emR=sec.$('.emR');
/* ---------- samples ---------- */
function sample(e){const g=new THREE.Group(),mt=KIT.mat(e.col,{metalness:e.met,roughness:e.rough});
  if(e.k==='Cu'){for(let i=0;i<5;i++){const t=new THREE.Mesh(new THREE.TorusGeometry(.06,.012,8,24),mt);t.position.set(-.12+i*.06,.07,0);t.rotation.y=Math.PI/2;g.add(t);}}
  else if(e.k==='Al'){const p=new THREE.Mesh(jit(new THREE.BoxGeometry(.3,.02,.22,6,1,5),.6),mt);p.position.y=.02;g.add(p);}
  else if(e.k==='Mg'){const p=new THREE.Mesh(new THREE.BoxGeometry(.36,.012,.05),mt);p.position.y=.01;g.add(p);}
  else if(e.k==='C'){const p=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.32,16),mt);p.rotation.z=Math.PI/2;p.position.y=.035;g.add(p);}
  else{const p=new THREE.Mesh(jit(new THREE.IcosahedronGeometry(.11,1),.4,e.k==='S'?3:7),KIT.mat(e.col,{metalness:e.met,roughness:e.rough,flatShading:true}));p.scale.y=.75;p.position.y=.08;g.add(p);}
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;}
function jit(geo,a,seed=1){const p=geo.attributes.position,map=new Map();let s=seed;const r=()=>{s=(s*9301+49297)%233280;return s/233280;};
  for(let i=0;i<p.count;i++){const key=p.getX(i).toFixed(3)+p.getY(i).toFixed(3)+p.getZ(i).toFixed(3);if(!map.has(key))map.set(key,[(r()-.5)*a*.05,(r()-.5)*a*.08,(r()-.5)*a*.05]);const d=map.get(key);
    if(geo.type==='IcosahedronGeometry'){const k=1+(d[1]*6);p.setXYZ(i,p.getX(i)*k,p.getY(i)*k,p.getZ(i)*k);}else p.setXYZ(i,p.getX(i)+d[0],p.getY(i)+d[1],p.getZ(i)+d[2]);}geo.computeVertexNormals();return geo;}
const tray=new THREE.Mesh(RBox(3.9,.05,.6,.02),KIT.wood(0x9b6a3c));tray.position.set(0,.025,1.5);L.add(tray);
const smp={};E.forEach((e,i)=>{const g=sample(e);const h=V(-1.6+i*.64,.05,1.48);g.position.copy(h);g.userData.home=h.clone();L.add(g);smp[e.k]=g;
  const c=P3.card([{t:e.k,mono:1,s:96},{t:e.n,s:44}],.46,.22);c.position.set(h.x,.08,1.82);c.rotation.x=-.9;L.add(c);L.onTap(g,()=>pick(e.k));});
/* ---------- station 1: magnifier + lamp ---------- */
const S1=V(-1.6,0,.15);const lensG=new THREE.Group();lensG.position.set(S1.x,0,S1.z);
{const b=new THREE.Mesh(RBox(.7,.05,.6,.02),KIT.mat(0x2c3a44));b.position.y=.025;const pod=new THREE.Mesh(RBox(.4,.04,.3,.01),KIT.mat(0xe9eef0));pod.position.y=.07;
  const arm=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.7,10),M.steel);arm.position.set(.3,.38,-.2);const ring=new THREE.Mesh(new THREE.TorusGeometry(.2,.022,10,32),KIT.mat(0x1c1c1c));ring.position.set(0,.55,0);ring.rotation.x=-Math.PI/2+.5;
  const ln=new THREE.Mesh(new THREE.CircleGeometry(.2,32),new THREE.MeshPhysicalMaterial({color:0xe8f6fa,transparent:true,opacity:.22,roughness:0,clearcoat:1,side:THREE.DoubleSide,depthWrite:false}));ln.position.copy(ring.position);ln.rotation.copy(ring.rotation);
  const ar2=new THREE.Mesh(new THREE.BoxGeometry(.3,.02,.02),M.steel);ar2.position.set(.15,.66,-.1);lensG.add(b,pod,arm,ring,ln,ar2);}
const spot=new THREE.SpotLight(0xfff4d6,0,3,.45,.6,1.5);spot.position.set(S1.x-.6,1.1,S1.z+.6);spot.target.position.set(S1.x,.08,S1.z);L.scene.add(spot,spot.target);
castAll(lensG);L.add(lensG);L.label('عدسة مكبّرة: البريق',V(S1.x,.95,S1.z),'small');
/* ---------- station 2: conductivity tester ---------- */
const S2=V(0,0,.15);const CT=new THREE.Group();CT.position.copy(S2);
const ctb=new THREE.Mesh(RBox(1.1,.06,.62,.02),KIT.wood(0x9b6a3c));ctb.position.y=.03;CT.add(ctb);
{const bat=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.32,20),KIT.mat(0x1f6fb2,{metalness:.3}));bat.rotation.z=Math.PI/2;bat.position.set(-.3,.14,-.18);const cap=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.08,20),KIT.mat(0xc62828));cap.rotation.z=Math.PI/2;cap.position.set(-.1,.14,-.18);CT.add(bat,cap);}
const sock=new THREE.Mesh(new THREE.CylinderGeometry(.05,.06,.08,16),KIT.mat(0x2a2f35));sock.position.set(.3,.1,-.18);CT.add(sock);
const bulbM=new THREE.MeshPhysicalMaterial({color:0xf4f6f7,transparent:true,opacity:.55,roughness:.05,clearcoat:1,emissive:0x000000});const bulb=new THREE.Mesh(new THREE.SphereGeometry(.09,24,16),bulbM);bulb.position.set(.3,.23,-.18);bulb.scale.y=1.15;CT.add(bulb);
const fil=new THREE.Mesh(new THREE.TorusGeometry(.025,.004,6,16,Math.PI),new THREE.MeshBasicMaterial({color:0x6b5b4b}));fil.position.set(.3,.22,-.18);CT.add(fil);
const bGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:P3.glowTex(),color:$lc(0xffd25a),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));bGlow.scale.setScalar(.8);bGlow.position.copy(bulb.position);bGlow.renderOrder=11;CT.add(bGlow);
const bLight=new THREE.PointLight(0xffd27a,0,3,2);bLight.position.copy(bulb.position);CT.add(bLight);
const clipA=new THREE.Mesh(new THREE.BoxGeometry(.06,.04,.04),KIT.mat(0xc62828)),clipB=clipA.clone();clipB.material=KIT.mat(0x1c1c1c);clipA.position.set(-.2,.09,.12);clipB.position.set(.2,.09,.12);CT.add(clipA,clipB);
[[[-.1,.14,-.18],[-.25,.12,-.05],[-.2,.09,.12]],[[-.46,.14,-.18],[-.5,.1,.0],[.45,.08,.1],[.3,.08,-.18]],[[.3,.08,-.18],[.25,.08,0],[.2,.09,.12]]].forEach(pts=>{const w=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>V(...p))),30,.012,6),KIT.mat(0xb5651d));CT.add(w);});
castAll(CT);L.add(CT);L.label('جهاز اختبار التوصيل',V(S2.x,.62,S2.z),'small');
function setBulb(p){bulbM.emissive.copy($lc(0xffcf6a)).multiplyScalar(p*1.2);bGlow.material.opacity=p*.95;bLight.intensity=p*2;fil.material.color.copy($lc(p>.05?0xff9a1f:0x6b5b4b));}
/* ---------- station 3: anvil + hammer ---------- */
const S3=V(1.6,0,.15);const AN=new THREE.Group();AN.position.copy(S3);
{const top=new THREE.Mesh(RBox(.7,.14,.32,.03),KIT.mat(0x3b4148,{metalness:.6,roughness:.4}));top.position.y=.42;const horn=new THREE.Mesh(new THREE.ConeGeometry(.12,.3,16),top.material);horn.rotation.z=-Math.PI/2;horn.position.set(.48,.42,0);
  const neck=new THREE.Mesh(RBox(.3,.25,.24,.02),KIT.mat(0x2c3137,{metalness:.5}));neck.position.y=.24;const ft=new THREE.Mesh(RBox(.55,.12,.36,.02),neck.material);ft.position.y=.06;AN.add(top,horn,neck,ft);}
const ham=new THREE.Group();{const h=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.9,10),KIT.wood(0x9b6a3c));h.position.set(.45,0,0);h.rotation.z=Math.PI/2;
  const hd=new THREE.Mesh(RBox(.12,.22,.12,.02),KIT.mat(0x7a858f,{metalness:.8,roughness:.3}));hd.position.set(0,0,0);ham.add(h,hd);}
const hamPiv=new THREE.Group();hamPiv.position.set(S3.x+.9,.63,S3.z);ham.position.set(-.9,0,0);hamPiv.add(ham);hamPiv.rotation.z=-.9;
castAll(AN);castAll(hamPiv);L.add(AN);L.add(hamPiv);L.label('سندان ومطرقة',V(S3.x,.95,S3.z),'small');
const shards=[];
/* ---------- actions ---------- */
const POS={lus:V(S1.x,.11,S1.z),cond:V(S2.x,.1,S2.z+.12),mal:V(S3.x,.5,S3.z)};
async function pick(k){if(S.busy||S.cur===k)return;S.busy=true;sync();if(S.cur){const o=smp[S.cur];await L.arc(o,o.userData.home,600,.9);}
  S.cur=k;emR.textContent='—';S.busy=false;P3.click();sync();render();}
async function test(t){if(S.busy)return;if(!S.cur){toast('اختر عيّنة أولًا.');return;}const e=E.find(x=>x.k===S.cur),o=smp[e.k],R=S.res[e.k];
  if(R[t]){toast('أجريت هذا الاختبار لهذه العيّنة من قبل.');return;}if(R.mal&&!e.flat){toast('تفتّتت العيّنة بالطرق؛ أعد التجربة لاختبارها من جديد.');return;}
  S.busy=true;sync();await L.arc(o,POS[t],800,1.0);
  if(t==='lus'){spot.intensity=0;const c0=L.camera.position.clone(),t0=L.controls.target.clone(),c1=V(S1.x,.9,S1.z+1.3),t1=V(S1.x,.15,S1.z);
    await L.tw(600,k=>{const q=ease(k);L.camera.position.copy(lerpV(c0,c1,q));L.controls.target.copy(lerpV(t0,t1,q));});
    await L.tw(1800,k=>{spot.intensity=3*Math.sin(Math.PI*k);spot.position.set(S1.x-.8+1.6*k,1.1,S1.z+.6);o.rotation.y=k*Math.PI;});spot.intensity=0;
    R.lus=e.lus;emR.textContent='البريق: '+e.lus;await L.tw(600,k=>{const q=ease(k);L.camera.position.copy(lerpV(c1,c0,q));L.controls.target.copy(lerpV(t1,t0,q));});}
  else if(t==='cond'){await sleep(300);P3.click();await L.tw(700,k=>setBulb(e.ci*k));R.cond=e.cond;emR.textContent=e.ci>.5?'أضاء المصباح':e.ci>0?'أضاء المصباح خافتًا جدًا':'لم يُضئ المصباح';await sleep(1300);setBulb(0);}
  else{for(let n=0;n<2;n++){await L.tw(260,k=>hamPiv.rotation.z=-.9+.9*k*k);P3.tone(140,.12,'square',.08);
      if(n===0){if(e.flat){await L.tw(150,k=>o.scale.set(1+.5*k,1-.6*k,1+.35*k));}else{o.visible=false;for(let i=0;i<9;i++){const m=new THREE.Mesh(new THREE.TetrahedronGeometry(.03+Math.random()*.03),KIT.mat(e.col,{metalness:e.met,roughness:e.rough,flatShading:true}));
          m.position.copy(POS.mal);L.scene.add(m);shards.push(m);const v=V((Math.random()-.5)*.8,.3+Math.random()*.4,(Math.random()-.5)*.6),p0=m.position.clone();
          L.tween(700,k=>{m.position.set(p0.x+v.x*k,p0.y+v.y*k-1.2*k*k+.05,p0.z+v.z*k);if(m.position.y<.5&&Math.abs(m.position.x-S3.x)<.35&&Math.abs(m.position.z-S3.z)<.16)m.position.y=Math.max(m.position.y,.5);if(m.position.y<.02)m.position.y=.02;m.rotation.set(k*6,k*4,0);});}}}
      await L.tw(260,k=>hamPiv.rotation.z=-.9*k);}
    R.mal=e.mal;emR.textContent=e.flat?'انبسطت العيّنة: قابلة للطرق':'تفتّتت العيّنة: هشّة';}
  if(o.visible)await L.arc(o,V(o.userData.home.x,.05,1.1),700,1.0);
  S.busy=false;sync();render();renderNB();}
function classify(c){const e=E.find(x=>x.k===S.cur);if(!e)return;if(c===e.cls){S.cls[e.k]=c;delete S.fb[e.k];P3.good();toast(`✓ ${e.n}: ${CLS[c]}.`);}
  else{S.fb[e.k]=1;try{L2.bad();}catch(err){}toast(e.k==='C'?'الجرافيت يوصل الكهرباء، لكنه هشّ ويقع مع اللافلزات في الجدول الدوري.':e.k==='Si'?'السيليكون لامع كالفلزات، لكنه هشّ وضعيف التوصيل؛ فله صفات من الفلزات واللافلزات.':'راجع نتائج الاختبارات الثلاثة.');}
  sync();render();renderNB();}
function reset(){if(S.busy)return;shards.forEach(m=>L.scene.remove(m));shards.length=0;E.forEach(e=>{S.res[e.k]={};const o=smp[e.k];o.visible=true;o.scale.setScalar(1);o.rotation.set(0,0,0);o.position.copy(o.userData.home);});
  S.cur=null;S.cls={};S.fb={};emR.textContent='—';setBulb(0);sync();render();renderNB();toast('أُعيدت التجربة إلى بدايتها.');}
/* ---------- UI ---------- */
const all3=k=>['lus','cond','mal'].every(t=>S.res[k][t]);
function stepIdx(){if(!S.cur)return 0;const r=S.res[S.cur];if(!r.lus)return 1;if(!r.cond||!r.mal)return 2;return 3;}
function render(){const k=stepIdx(),e=S.cur&&E.find(x=>x.k===S.cur),done=Object.keys(S.cls).length;let title,html;
  if(!e){title='اختر عيّنة';html=`<p class="p3-txt">ست عيّنات من العناصر. اختبر كل عيّنة في المحطات الثلاث: العدسة المكبّرة، وجهاز التوصيل، والسندان، ثم صنّفها. صنّفت ${done} من ${E.length}.</p>`;}
  else if(S.cls[e.k]){title=`${e.n} (${e.k})`;html=`<p class="p3-ok">✓ ${e.n}: ${CLS[e.cls]}.</p><p class="p3-txt">${done<E.length?'اختر عيّنة أخرى.':'أحسنت! الفلزات لامعة وموصلة وقابلة للطرق، واللافلزات باهتة غالبًا وهشّة، وأشباه الفلزات بينهما.'}</p>`;}
  else if(k<3){title=`${e.n} (${e.k})`;html=`<p class="p3-txt">${k===1?'افحص البريق تحت العدسة أولًا.':'اختبر التوصيل الكهربائي، ثم اطرق العيّنة على السندان.'}</p>`;}
  else{const r=S.res[e.k];title='صنّف '+e.n;html=`<p class="p3-txt"><b>البريق:</b> ${r.lus} · <b>التوصيل:</b> ${r.cond} · <b>الطرق:</b> ${r.mal}</p><p class="p3-txt">اختر التصنيف من لوحة التحكم.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>العنصر</th><th>البريق</th><th>التوصيل</th><th>الطرق</th><th>التصنيف</th></tr></thead><tbody>`+
  E.map(e=>{const r=S.res[e.k];return `<tr><td>${e.n.split(' ')[0]}</td><td>${r.lus||'—'}</td><td>${r.cond||'—'}</td><td>${r.mal||'—'}</td><td>${S.cls[e.k]?`<b style="color:var(--ok)">${CLS[S.cls[e.k]]}</b>`:'—'}</td></tr>`;}).join('')+
  '</tbody></table><p class="p3-txt" style="font-size:.78rem;margin-top:6px">لاحظ أن الجرافيت (صورة من صور الكربون) لافلز لكنه يوصل الكهرباء، وهو استثناء مشهور.</p>';}
function sync(){const b=S.busy;sec.$$('[data-k]').forEach(x=>{x.setAttribute('aria-pressed',x.dataset.k===S.cur);x.disabled=b;x.classList.toggle('done',!!S.cls[x.dataset.k]);});
  sec.$$('[data-t]').forEach(x=>{x.disabled=b||!S.cur;x.classList.toggle('done',!!(S.cur&&S.res[S.cur][x.dataset.t]));});
  sec.$('.emCls').hidden=!(S.cur&&all3(S.cur)&&!S.cls[S.cur]);sec.$$('[data-c]').forEach(x=>x.disabled=b);sec.$('[data-a="reset"]').disabled=b;}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const d=x.dataset;
  if(d.k)pick(d.k);else if(d.t)test(d.t);else if(d.c)classify(d.c);else if(d.a==='reset')reset();});
L.onTap(lensG,()=>test('lus'));L.onTap(CT,()=>test('cond'));L.onTap(AN,()=>test('mal'));
sync();render();renderNB();
};

/* =====================================================================
   ٩) دورة الصخور — 3D (أول متوسط · أنواع الصخور)
   ===================================================================== */
const ROCK={};EXP_MODS.rock=ROCK;
ROCK.init=function(){gm();
const R={ignC:{n:'صخر ناري جوفي (جرانيت)',t:'ناري'},ignF:{n:'صخر ناري سطحي (بازلت)',t:'ناري'},sed:{n:'رسوبيات (فتات صخري)',t:'—'},
  sedR:{n:'صخر رسوبي (حجر رملي)',t:'رسوبي'},metaG:{n:'صخر متحوّل (نَيس)',t:'متحوّل'},metaQ:{n:'صخر متحوّل (كوارتزيت)',t:'متحوّل'},magma:{n:'صهارة (ماجما)',t:'—'}};
const PR={weather:{n:'التجوية والتعرية',from:['ignC','ignF','sedR','metaG','metaQ']},compact:{n:'الترسيب والضغط والتماسك',from:['sed']},
  heat:{n:'الحرارة والضغط',from:['ignC','ignF','sedR']},melt:{n:'الانصهار',from:['ignC','ignF','sedR','metaG','metaQ','sed']},
  slow:{n:'التبريد البطيء في باطن الأرض',from:['magma']},fast:{n:'التبريد السريع على سطح الأرض',from:['magma']}};
const WHY={weather:'التجوية تفتّت الصخور الصلبة فقط.',compact:'الضغط والتماسك يحوّلان الرسوبيات (الفتات) إلى صخر رسوبي؛ فتّت الصخر أولًا بالتجوية.',heat:'الحرارة والضغط دون انصهار تحوّل الصخور النارية والرسوبية إلى متحوّلة.',melt:'',slow:'التبريد يحدث للصهارة فقط؛ صهر الصخر أولًا.',fast:'التبريد يحدث للصهارة فقط؛ صهر الصخر أولًا.'};
const TASKS=[{n:'حوّل الجرانيت إلى صخر رسوبي',ok:s=>s==='sedR'},{n:'كوّن صخرًا متحوّلًا',ok:s=>s==='metaG'||s==='metaQ'},{n:'كوّن صخرًا ناريًا سطحيًا',ok:s=>s==='ignF'}];
const S={st:'ignC',busy:false,path:[],done:{}};P3.dbg.rock=S;
const NAMES=['لاحظ العيّنة','طبّق عملية','تتبّع الدورة','أكمل المهام'];
const sec=P3.section('rock',{title:'دورة الصخور',grade:'أول متوسط',lesson:'أنواع الصخور',
  hud:`<div class="p3-m warm" style="min-width:220px"><small>العيّنة الآن</small><b class="rkN" style="font-family:var(--f-body);font-size:1.02rem">—</b></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">العمليات</h4>
    <div class="p3-acts">${Object.entries(PR).map(([k,v])=>`<button class="p3-b" data-p="${k}">${v.n}</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ ابدأ من الجرانيت</button></div></div>`,
  learn:`<div class="panel"><h3>أنواع الصخور</h3><p><b>النارية:</b> تتكوّن من تبريد الصهارة؛ <b>الجوفية</b> (مثل الجرانيت) تبرد ببطء فتكبر بلوراتها، و<b>السطحية</b> (مثل البازلت) تبرد بسرعة فتصغر بلوراتها.</p>
      <p><b>الرسوبية:</b> تتكوّن من تراكم الرسوبيات ثم ضغطها وتماسكها، وتظهر فيها طبقات.</p><p><b>المتحوّلة:</b> تتكوّن عندما تتعرض الصخور لحرارة وضغط شديدين دون أن تنصهر، فتتغير بلوراتها وقد تظهر فيها أشرطة.</p></div>
    <div class="panel"><h3>دورة الصخور</h3><p>سلسلة العمليات التي تتحول فيها الصخور من نوع إلى آخر عبر الزمن، ولا تسير في اتجاه واحد ثابت؛ فقد يتحول أي صخر إلى صخر من نوع آخر.</p></div>`,
  quiz:[{q:'الصخر الذي يتكوّن من تبريد الصهارة ببطء في باطن الأرض:',o:['البازلت','الجرانيت','الحجر الرملي'],a:1},{q:'العملية التي تحوّل الرسوبيات إلى صخر رسوبي:',o:['الانصهار','الضغط والتماسك','التبريد السريع'],a:1},
        {q:'يتكوّن الصخر المتحوّل بفعل:',o:['الحرارة والضغط دون انصهار','التجوية والتعرية','تبريد اللابة'],a:0},{q:'بلورات الصخور النارية السطحية:',o:['كبيرة','صغيرة','غير موجودة دائمًا'],a:1}],
  report:()=>({title:'دورة الصخور',grade:'أول متوسط',lesson:'أنواع الصخور',cols:['من','العملية','إلى'],rows:S.path.length?S.path.map(p=>[R[p.a].n,PR[p.p].n,R[p.b].n]):[['','','']],note:'ارسم دورة الصخور بالأسهم مستعينًا بالمسار الذي سلكته.'})
});
const L=new Lab(sec,{target:V(0,.6,.45),dist:a=>Math.max(4,6.6/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* ---------- procedural rock textures ---------- */
const T={};const rnd=Math.random;
T.ignC=canvasTex(512,512,c=>{c.fillStyle='#d9c6bd';c.fillRect(0,0,512,512);for(let i=0;i<900;i++){c.fillStyle=['#f4eee9','#b98a7a','#2b2b2e','#e7d9cf','#8f6a5e'][i%5];const s=6+rnd()*20;c.save();c.translate(rnd()*512,rnd()*512);c.rotate(rnd()*3);c.fillRect(-s/2,-s/3,s,s*.7);c.restore();}});
T.ignF=canvasTex(512,512,c=>{c.fillStyle='#3a3c40';c.fillRect(0,0,512,512);for(let i=0;i<4000;i++){c.fillStyle=rnd()<.5?'#2c2e31':'#4a4d52';c.fillRect(rnd()*512,rnd()*512,2,2);}for(let i=0;i<70;i++){c.fillStyle='#1c1d1f';c.beginPath();c.arc(rnd()*512,rnd()*512,2+rnd()*6,0,7);c.fill();}});
T.sedR=canvasTex(512,512,c=>{const cols=['#d8b98a','#c9a46f','#e2c79d','#b88f5c','#d1ad7b'];let y=0;while(y<512){const h=20+rnd()*45;c.fillStyle=cols[Math.floor(rnd()*cols.length)];c.fillRect(0,y,512,h);y+=h;}
  for(let i=0;i<5000;i++){c.fillStyle=`rgba(${rnd()<.5?'90,60,30':'255,240,210'},.35)`;c.fillRect(rnd()*512,rnd()*512,2,2);}});
T.metaG=canvasTex(512,512,c=>{c.fillStyle='#cfc7bd';c.fillRect(0,0,512,512);for(let b=0;b<16;b++){c.strokeStyle=b%2?'#2e2c2b':'#f2ece4';c.lineWidth=8+rnd()*14;c.beginPath();for(let x=0;x<=512;x+=16){const y=b*34+Math.sin(x/60+b)*14;x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}});
T.metaQ=canvasTex(512,512,c=>{c.fillStyle='#e9ddd0';c.fillRect(0,0,512,512);for(let i=0;i<1400;i++){c.fillStyle=['#f6efe7','#d9c3ad','#efe2d4'][i%3];c.beginPath();c.arc(rnd()*512,rnd()*512,4+rnd()*8,0,7);c.fill();}});
T.magma=canvasTex(512,512,c=>{const g=c.createRadialGradient(256,256,30,256,256,360);g.addColorStop(0,'#fff1a8');g.addColorStop(.4,'#ff9a1f');g.addColorStop(1,'#c2330e');c.fillStyle=g;c.fillRect(0,0,512,512);
  c.strokeStyle='rgba(60,10,0,.55)';c.lineWidth=5;for(let i=0;i<26;i++){c.beginPath();let x=rnd()*512,y=rnd()*512;c.moveTo(x,y);for(let j=0;j<5;j++){x+=(rnd()-.5)*90;y+=(rnd()-.5)*90;c.lineTo(x,y);}c.stroke();}});
/* ---------- bench: pedestal + sample ---------- */
const P0=V(0,.32,.35);
const ped=new THREE.Mesh(new THREE.CylinderGeometry(.75,.85,.3,48),KIT.mat(0x3a4148,{metalness:.3,roughness:.5}));ped.position.set(P0.x,.15,P0.z);ped.castShadow=true;L.add(ped);
const mat=new THREE.MeshStandardMaterial({map:T.ignC,roughness:.85,emissive:0x000000});
const block=new THREE.Mesh(RBox(.9,.55,.65,.08),mat);block.position.set(P0.x,P0.y+.275,P0.z);block.castShadow=true;L.add(block);
const blobGeo=jitterS(new THREE.SphereGeometry(.42,40,24),.12);function jitterS(g,a){const p=g.attributes.position,v=new THREE.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const k=1+Math.sin(v.x*9)*Math.cos(v.z*7)*a*.5+Math.sin(v.y*11)*a*.3;v.multiplyScalar(k);p.setXYZ(i,v.x,v.y,v.z);}g.computeVertexNormals();return g;}
const blob=new THREE.Mesh(blobGeo,new THREE.MeshStandardMaterial({map:T.magma,emissiveMap:T.magma,emissive:0xffffff,emissiveIntensity:1.1,roughness:.6}));blob.scale.y=.6;blob.position.set(P0.x,P0.y+.24,P0.z);blob.visible=false;L.add(blob);
const glow=new THREE.PointLight(0xff7a2a,0,4,2);glow.position.set(P0.x,P0.y+.8,P0.z);L.scene.add(glow);
// sediments: instanced grains
const NG=260,grains=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.035,0),KIT.mat(0xc9a46f,{roughness:.95}),NG);grains.count=0;grains.castShadow=true;L.add(grains);
const gpos=[...Array(NG)].map((_,i)=>{const a=rnd()*6.28,r=Math.sqrt(rnd())*.42;const h=(.42-r)*.55*rnd();return V(P0.x+Math.cos(a)*r,P0.y+.03+h,P0.z+Math.sin(a)*r);});
const gcol=[0xd8b98a,0xb88f5c,0x8f6a5e,0xe2c79d,0x6d6e72];const dm=new THREE.Object3D();

function setGrains(n,lift=0){grains.count=n;for(let i=0;i<n;i++){const p=gpos[i];dm.position.set(p.x,p.y+lift*(1+(i%5)*.3),p.z);dm.rotation.set(i,i*2,i);dm.scale.setScalar(.7+(i%4)*.2);dm.updateMatrix();grains.setMatrixAt(i,dm.matrix);}grains.instanceMatrix.needsUpdate=true;if(grains.instanceColor)grains.instanceColor.needsUpdate=true;}
// process machines
const press=new THREE.Group();{const pl=new THREE.Mesh(RBox(1.1,.12,.85,.03),KIT.mat(0x5d6875,{metalness:.7,roughness:.3}));const rod=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1.2,14),M.steel);rod.position.y=.66;press.add(pl,rod);castAll(press);}
press.position.set(P0.x,2.6,P0.z);press.visible=false;L.add(press);
const jaws=[-1,1].map(s=>{const j=new THREE.Mesh(RBox(.14,.75,.85,.03),KIT.mat(0x7a2e1e,{metalness:.5,roughness:.4,emissive:0x000000}));j.position.set(P0.x+s*1.3,P0.y+.38,P0.z);j.visible=false;j.castShadow=true;L.add(j);return j;});
const rainG=new THREE.BufferGeometry(),rainN=160,rainP=new Float32Array(rainN*3);rainG.setAttribute('position',new THREE.BufferAttribute(rainP,3));
const rain=new THREE.Points(rainG,new THREE.PointsMaterial({color:$lc(0x6fb2ff),size:.04,transparent:true,opacity:.85,depthWrite:false}));rain.visible=false;rain.frustumCulled=false;L.scene.add(rain);
const nameEl=sec.$('.rkN');L.label('منصة العيّنة',V(P0.x,.05,P0.z+.9),'small');
/* cycle diagram card on the wall */
const cyc=P3.card([{t:'دورة الصخور',s:60},{t:'ناري ⇄ رسوبي ⇄ متحوّل',s:46}],1.6,.5,{bd:'#e0703f'});cyc.position.set(0,1.75,-1.96);L.add(cyc);
/* ---------- show a state ---------- */
function show(st){block.visible=['ignC','ignF','sedR','metaG','metaQ'].includes(st);blob.visible=st==='magma';
  if(block.visible){mat.map=T[st];mat.needsUpdate=true;block.scale.set(st.startsWith('meta')?.85:1,st.startsWith('meta')?1.12:st==='ignF'?.8:1,1);block.position.y=P0.y+.275*block.scale.y;}
  setGrains(st==='sed'?NG:0);glow.intensity=st==='magma'?2.2:0;nameEl.textContent=R[st].n;}
P3.loop(L,(dt,t)=>{if(blob.visible){blob.rotation.y+=dt*.3;blob.material.emissiveIntensity=1+.15*Math.sin(t*3);glow.intensity=S.st==='magma'?2+.4*Math.sin(t*4):glow.intensity;}
  if(rain.visible){for(let i=0;i<rainN;i++){rainP[i*3+1]-=dt*3;if(rainP[i*3+1]<P0.y){rainP[i*3]=P0.x+(rnd()-.5)*1.4;rainP[i*3+1]=P0.y+1.6+rnd()*.6;rainP[i*3+2]=P0.z+(rnd()-.5)*1;}}rainG.attributes.position.needsUpdate=true;}});
/* ---------- processes ---------- */
async function apply(p){if(S.busy)return;const a=S.st;if(!PR[p].from.includes(a)){toast(WHY[p]||'لا يمكن تطبيق هذه العملية على هذه العيّنة.');try{L2.bad();}catch(e){}return;}
  S.busy=true;sync();let b;
  if(p==='weather'){rain.visible=true;for(let i=0;i<rainN;i++){rainP[i*3]=P0.x+(rnd()-.5)*1.4;rainP[i*3+1]=P0.y+rnd()*2;rainP[i*3+2]=P0.z+(rnd()-.5);}P3.noise(2.2,.12,800,.5);
    await L.tw(1600,k=>{block.scale.multiplyScalar(1-.004);mat.roughness=1;});block.visible=false;setGrains(NG,.6);
    await L.tw(900,k=>setGrains(NG,.6*(1-ease(k))));rain.visible=false;b='sed';}
  else if(p==='compact'){press.visible=true;await L.tw(800,k=>press.position.y=2.6-(2.6-(P0.y+.62))*ease(k));P3.tone(110,.3,'sawtooth',.05);
    await L.tw(900,k=>setGrains(NG,-.02*k));b='sedR';show(b);block.scale.y=.01;await L.tw(700,k=>{block.scale.y=Math.max(.01,k);block.position.y=P0.y+.275*block.scale.y;});
    await L.tw(700,k=>press.position.y=(P0.y+.62)+(2.6-P0.y-.62)*ease(k));press.visible=false;}
  else if(p==='heat'){jaws.forEach(j=>j.visible=true);await L.tw(800,(k)=>jaws.forEach((j,i)=>j.position.x=P0.x+(i?1:-1)*(1.3-.73*ease(k))));
    await L.tw(1400,k=>{jaws.forEach(j=>j.material.emissive.copy($lc(0xff3a0a)).multiplyScalar(.6*k));mat.emissive.copy($lc(0x7a1a00)).multiplyScalar(.5*Math.sin(Math.PI*k));block.scale.x=1-.15*k;});
    b=a==='sedR'?'metaQ':'metaG';show(b);mat.emissive.setHex(0);await L.tw(700,k=>jaws.forEach((j,i)=>{j.position.x=P0.x+(i?1:-1)*(.57+.73*ease(k));j.material.emissive.multiplyScalar(.9);}));jaws.forEach(j=>j.visible=false);}
  else if(p==='melt'){if(a==='sed')setGrains(0);await L.tw(1400,k=>{mat.emissive.copy($lc(0xff6a1a)).multiplyScalar(k);glow.intensity=2*k;block.scale.y=Math.max(.3,1-.6*k);block.position.y=P0.y+.275*block.scale.y;});
    mat.emissive.setHex(0);b='magma';show(b);blob.scale.set(.3,.2,.3);await L.tw(600,k=>blob.scale.set(.3+.7*k,.2+.4*k,.3+.7*k));P3.whoosh();}
  else{const fast=p==='fast';b=fast?'ignF':'ignC';await L.tw(fast?900:2600,k=>{blob.material.emissiveIntensity=1.1*(1-k);glow.intensity=2*(1-k);if(fast){blob.scale.set(1+.4*k,.6-.25*k,1+.4*k);}});
    show(b);block.scale.y*=.01;await L.tw(500,k=>{block.scale.y=(b==='ignF'?.8:1)*Math.max(.01,k);block.position.y=P0.y+.275*block.scale.y;});blob.material.emissiveIntensity=1.1;}
  S.st=b;S.path.push({a,p,b});TASKS.forEach((t,i)=>{if(!S.done[i]&&t.ok(b)&&(i!==0||S.path.some(x=>x.a==='ignC')||true)){S.done[i]=true;P3.good();toast('✓ أنجزت المهمة: '+t.n);}});
  if(!TASKS.some((t,i)=>S.done[i]&&t.ok(b)))toast(`${PR[p].n}: ${R[a].n} ← ${R[b].n}`);
  S.busy=false;sync();render();renderNB();}
function reset(){if(S.busy)return;S.st='ignC';S.path=[];S.done={};mat.emissive.setHex(0);show('ignC');sync();render();renderNB();toast('عيّنة جرانيت جديدة.');}
/* ---------- UI ---------- */
function stepIdx(){if(!S.path.length)return 0;if(S.path.length<3)return 1;if(Object.keys(S.done).length<TASKS.length)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='عيّنة جرانيت';html=`<p class="p3-txt">أمامك صخر ناري جوفي (جرانيت) بلوراته كبيرة. اختر عملية من لوحة العمليات وتتبّع كيف يتحول الصخر.</p>`;}
  else if(k<3){title='تتبّع دورة الصخور';html=`<p class="p3-txt">العيّنة الآن: <b>${R[S.st].n}</b>. جرّب عمليات أخرى، فبعضها لا يصلح لكل صخر.</p>`;}
  else{title='أحسنت!';html=`<p class="p3-ok">أنجزت المهام الثلاث. أي صخر يمكن أن يتحول إلى نوع آخر عبر دورة الصخور.</p>`;}
  html+=`<div style="margin-top:8px">${TASKS.map((t,i)=>`<div class="p3-txt" style="font-size:.84rem">${S.done[i]?'✅':'⬜'} ${t.n}</div>`).join('')}</div>`;
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>#</th><th>من</th><th>العملية</th><th>إلى</th></tr></thead><tbody>`+
  (S.path.length?S.path.map((p,i)=>`<tr><td class="n">${i+1}</td><td>${R[p.a].n}</td><td>${PR[p.p].n}</td><td><b>${R[p.b].n}</b></td></tr>`).join(''):'<tr><td colspan="4" class="muted">سيظهر هنا مسار العيّنة في دورة الصخور.</td></tr>')+'</tbody></table>';}
function sync(){sec.$$('button[data-p]').forEach(x=>{x.disabled=S.busy;x.classList.toggle('done',PR[x.dataset.p].from.includes(S.st));});sec.$('[data-a="reset"]').disabled=S.busy;}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;if(x.dataset.p)apply(x.dataset.p);else if(x.dataset.a==='reset')reset();});
show('ignC');sync();render();renderNB();
};

/* =====================================================================
   ١٠) تيارات الحمل وحركة الصفائح — 3D (أول متوسط · صفائح الأرض المتحركة)
   ===================================================================== */
const PLATE={};EXP_MODS.plate=PLATE;
PLATE.init=function(){gm();
const S={mode:'center',on:false,heat:0,shift:0,obs:{},busy:false};P3.dbg.plate=S;
const MODES={center:{n:'مصدر الحرارة في المنتصف',mv:'تتباعد الصفيحتان',bd:'حدود متباعدة',ex:'تتكوّن حيود وسط المحيط وقشرة جديدة (اتساع قاع المحيط)'},
  ends:{n:'مصدر الحرارة عند الطرفين',mv:'تتقارب الصفيحتان',bd:'حدود متقاربة',ex:'تغوص صفيحة تحت الأخرى أو تتصادمان فتتكوّن الجبال'}};
const NAMES=['اختر موقع التسخين','شغّل السخان','راقب تيارات الحمل','حدّد نوع الحدود'];
const sec=P3.section('plate',{title:'تيارات الحمل وحركة الصفائح',grade:'أول متوسط',lesson:'صفائح الأرض المتحركة',
  hud:`<div class="p3-row"><div class="p3-m warm"><small>المنطقة الساخنة</small><b class="plH">25 °C</b></div><div class="p3-m" style="color:#8ac7ff"><small>المنطقة الباردة</small><b class="plC">25 °C</b></div><div class="p3-m"><small>إزاحة الصفائح</small><b class="plD">0.0 cm</b></div></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">التسخين</span><button class="p3-b" data-m="center">🔥 في المنتصف</button><button class="p3-b" data-m="ends">🔥 عند الطرفين</button></div>
    <div class="p3-acts"><button class="p3-b pri" data-a="on">⏻ شغّل السخان</button><button class="p3-b" data-a="reset">↺ إعادة</button></div></div>`,
  learn:`<div class="panel"><h3>تيارات الحمل في الستار</h3><p>تسخين المادة من أسفل يقلّل كثافتها فترتفع، ثم تبرد عند السطح فتزداد كثافتها وتهبط؛ فتتكوّن دورة تسمى <b>تيار الحمل</b>. يعتقد العلماء أن تيارات الحمل في الستار هي التي تحرّك الصفائح الأرضية فوقها.</p></div>
    <div class="panel"><h3>حدود الصفائح</h3><p><b>المتباعدة:</b> تبتعد الصفيحتان فتصعد الصهارة وتتكوّن قشرة جديدة.</p><p><b>المتقاربة:</b> تقترب الصفيحتان فتغوص إحداهما تحت الأخرى أو تتصادمان وتتكوّن الجبال.</p><p><b>التحويلية:</b> تنزلق الصفيحتان أفقيًا إحداهما بجانب الأخرى.</p></div>`,
  quiz:[{q:'المادة الساخنة في تيار الحمل:',o:['ترتفع لأن كثافتها أقل','تهبط لأن كثافتها أكبر','لا تتحرك'],a:0},{q:'عند ابتعاد صفيحتين تتكوّن حدود:',o:['متقاربة','متباعدة','تحويلية'],a:1},
        {q:'ما الذي يُعتقد أنه يحرّك الصفائح الأرضية؟',o:['تيارات الحمل في الستار','الرياح','المد والجزر'],a:0},{q:'تتكوّن الجبال غالبًا عند الحدود:',o:['المتباعدة','المتقاربة','لا شيء مما سبق'],a:1}],
  report:()=>({title:'تيارات الحمل وحركة الصفائح',grade:'أول متوسط',lesson:'صفائح الأرض المتحركة',cols:['موقع التسخين','حركة الصفيحتين','نوع الحدود'],
    rows:Object.keys(MODES).map(k=>[MODES[k].n,S.obs[k]?MODES[k].mv:'',S.obs[k]?MODES[k].bd:'']),note:'فسّر كيف تحرّك تيارات الحمل الصفائح.'})
});
const L=new Lab(sec,{target:V(0,.85,.4),dist:a=>Math.max(4.4,7.4/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* ---------- tank ---------- */
const W=3.0,HT=1.1,D=.9,Y0=.42,TZ=.3;const tank=new THREE.Group();tank.position.set(0,0,TZ);
const tg=new THREE.MeshPhysicalMaterial({color:0xeef7f9,roughness:.05,transparent:true,opacity:.18,clearcoat:1,side:THREE.DoubleSide,depthWrite:false});tg.userData.keepEnv=1;
[[W,HT,0,0,D/2],[W,HT,0,0,-D/2],[D,HT,Math.PI/2,W/2,0],[D,HT,Math.PI/2,-W/2,0]].forEach(([w,h,r,x,z])=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),tg);p.rotation.y=r;p.position.set(x,Y0+h/2,z);p.renderOrder=3;tank.add(p);});
const flr=new THREE.Mesh(new THREE.BoxGeometry(W,.03,D),KIT.mat(0x2b3036));flr.position.y=Y0;tank.add(flr);
const liqM=G.water(0xd98a3a,.42);const liq=new THREE.Mesh(new THREE.BoxGeometry(W-.03,.9,D-.03),liqM);liq.position.y=Y0+.47;liq.renderOrder=1;tank.add(liq);
// stand legs + heaters
[[-1.35,-.35],[1.35,-.35],[-1.35,.35],[1.35,.35]].forEach(([x,z])=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,Y0,10),M.steel);l.position.set(x,Y0/2,z);tank.add(l);});
function heater(x){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.16,.2,.18,24),KIT.mat(0x2f363c,{metalness:.5}));b.position.y=.09;const c=new THREE.Mesh(new THREE.TorusGeometry(.1,.02,8,24),KIT.mat(0x5a2a10,{emissive:0x000000}));c.rotation.x=Math.PI/2;c.position.y=.2;
  const gl=new THREE.PointLight(0xff5a1a,0,1.5,2);gl.position.y=.3;g.add(b,c,gl);g.position.set(x,0,0);g.userData={coil:c,gl};return g;}
const H={center:[heater(0)],ends:[heater(-1.15),heater(1.15)]};H.center.concat(H.ends).forEach(h=>tank.add(h));
castAll(flr);L.add(tank);
/* ---------- plates on the surface ---------- */
const SY=Y0+.92+.05;
const pm=new THREE.MeshStandardMaterial({map:canvasTex(256,128,c=>{c.fillStyle='#6b7a4a';c.fillRect(0,0,256,128);for(let i=0;i<400;i++){c.fillStyle=['#7f8f58','#5a6a3c','#8a7a52'][i%3];c.fillRect(Math.random()*256,Math.random()*128,6,4);}}),roughness:.9});
const PL=[-1,1].map(s=>{const p=new THREE.Mesh(RBox(1.38,.1,.8,.03),pm);p.position.set(s*.72,SY,TZ);p.castShadow=true;L.add(p);return p;});
const ridge=new THREE.Mesh(new THREE.BoxGeometry(.05,.08,.78),new THREE.MeshStandardMaterial({color:0xff6a1a,emissive:0xff4a00,emissiveIntensity:1}));ridge.position.set(0,SY-.04,TZ);ridge.scale.x=.01;L.add(ridge);
const mts=new THREE.Group();for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.ConeGeometry(.12,.3,6),KIT.mat(0x8a7a62,{flatShading:true}));m.position.set(.05,0,-.3+i*.15);m.scale.y=.01;mts.add(m);}mts.position.set(0,SY+.05,TZ);L.add(mts);
L.label('ستار (مائع ساخن)',V(-1.75,Y0+.45,TZ),'small');L.label('صفيحة',V(-.72,SY+.18,TZ),'small');L.label('صفيحة',V(.72,SY+.18,TZ),'small');
/* ---------- convection tracers ---------- */
const NP=320,ip=new THREE.InstancedMesh(new THREE.SphereGeometry(.022,8,6),new THREE.MeshBasicMaterial({color:0xffffff}),NP);ip.frustumCulled=false;ip.count=NP;L.add(ip);
const tr=[...Array(NP)].map((_,i)=>({cell:i%2?1:-1,s:Math.random(),r:.6+Math.random()*.4}));const dum=new THREE.Object3D(),cc=new THREE.Color();
const cHot=$lc(0xff3a1a),cWarm=$lc(0xffa040),cCold=$lc(0x3a7bff);
// rectangular loop in one cell (x from inner a to outer b), y from bottom to top; returns pos & temperature
function loop(s,cell,r,mode){const inner=mode==='center'?0:1.4*cell,outer=mode==='center'?1.4*cell:0;const cx=(inner+outer)/2,hw=Math.abs(outer-inner)/2*r,yb=Y0+.12,yt=Y0+.12+.72*r+ (1-r)*.08,ym=(yb+yt)/2,hh=(yt-yb)/2;
  const dir=Math.sign(outer-inner)||1;const P=2*(2*hw+2*hh);let d=s*P;let x,y,T;
  if(d<2*hh){x=cx-dir*hw;y=yb+d;T=1;}else if((d-=2*hh)<2*hw){x=cx-dir*hw+dir*d;y=yt;T=.6-.4*(d/(2*hw));}else if((d-=2*hw)<2*hh){x=cx+dir*hw;y=yt-d;T=.1;}else{d-=2*hh;x=cx+dir*hw-dir*d;y=yb;T=.1+.5*(d/(2*hw));}
  return {x,y,T};}
function placeTr(){tr.forEach((p,i)=>{const q=loop(p.s,p.cell,p.r,S.mode);dum.position.set(q.x,q.y,TZ+(((i*37)%100)/100-.5)*.6);dum.updateMatrix();ip.setMatrixAt(i,dum.matrix);
  if(S.heat<.05)cc.copy(cWarm).multiplyScalar(.6);else if(q.T>.6)cc.copy(cWarm).lerp(cHot,(q.T-.6)/.4);else cc.copy(cCold).lerp(cWarm,q.T/.6);ip.setColorAt(i,cc);});ip.instanceMatrix.needsUpdate=true;ip.instanceColor.needsUpdate=true;}
placeTr();
P3.loop(L,(dt,t)=>{const tgt=S.on?1:0;S.heat+=(tgt-S.heat)*Math.min(1,dt*.6);
  H[S.mode].forEach(h=>{h.userData.coil.material.emissive.copy($lc(0xff4a10)).multiplyScalar(S.heat);h.userData.gl.intensity=S.heat*1.5;});
  if(S.heat>.02){tr.forEach(p=>{p.s=(p.s+dt*.07*S.heat/p.r)%1;});
    S.shift=Math.min(.32,S.shift+dt*.04*S.heat);const sh=S.shift,c=S.mode==='center';
    PL[0].position.x=-.72-(c?sh:-sh);PL[1].position.x=.72+(c?sh:-sh*.0)-(c?0:0);
    if(c){ridge.scale.x=Math.max(.01,sh*2*20);ridge.position.y=SY-.06+Math.min(.04,sh*.15);PL[1].position.x=.72+sh;PL[1].rotation.z=0;}
    else{PL[0].position.x=-.72+sh;const sub=Math.max(0,sh-.03);PL[1].position.x=.72-Math.min(sh,.06)+0;PL[1].rotation.z=0;PL[0].rotation.z=-sub*.5;PL[0].position.y=SY-sub*.25;
      mts.children.forEach((m,i)=>{m.scale.y=Math.min(1,sub*4*(.6+.2*(i%3)));});mts.position.x=PL[1].position.x-.69+.05;}
    if(S.shift>.12&&!S.obs[S.mode]){S.obs[S.mode]=true;P3.good();toast(`${MODES[S.mode].mv} ← ${MODES[S.mode].bd}`);render();renderNB();}}
  placeTr();
  sec.$('.plH').textContent=Math.round(25+S.heat*45)+' °C';sec.$('.plC').textContent=Math.round(25+S.heat*12)+' °C';sec.$('.plD').textContent=(S.shift*10).toFixed(1)+' cm';});
function setMode(m){if(S.mode===m)return;S.mode=m;S.on=false;S.heat=0;resetPlates();P3.click();sync();render();}
function resetPlates(){S.shift=0;PL[0].position.set(-.72,SY,TZ);PL[1].position.set(.72,SY,TZ);PL.forEach(p=>p.rotation.set(0,0,0));ridge.scale.x=.01;mts.children.forEach(m=>m.scale.y=.01);
  H.center.concat(H.ends).forEach(h=>{h.userData.coil.material.emissive.setHex(0);h.userData.gl.intensity=0;});}
/* ---------- UI ---------- */
function stepIdx(){if(!S.on&&!S.obs[S.mode]&&S.heat<.05)return Object.keys(S.obs).length?1:0;if(!S.obs[S.mode])return 2;return 3;}
function render(){const k=stepIdx(),m=MODES[S.mode];let title,html;
  if(k<=1){title=m.n;html=`<p class="p3-txt">الخزان فيه سائل كثيف يمثّل الستار، وتطفو فوقه صفيحتان. شغّل السخان وتابع حركة الجسيمات الملوّنة: <b style="color:#d9452e">الأحمر ساخن</b> و<b style="color:#2f6fd0">الأزرق بارد</b>.</p>`;}
  else if(k===2){title='راقب تيارات الحمل';html=`<p class="p3-txt">المادة الساخنة ترتفع فوق السخان، وتتحرك أفقيًا تحت الصفائح، ثم تبرد وتهبط. لاحظ اتجاه حركة الصفيحتين.</p>`;}
  else{title=m.bd;html=`<p class="p3-ok">${m.mv}: ${m.ex}.</p><p class="p3-txt">${Object.keys(S.obs).length<2?'جرّب الآن موقع التسخين الآخر وقارن.':'قارنت النوعين. الحدود التحويلية تنزلق فيها الصفائح أفقيًا جنبًا إلى جنب.'}</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>موقع التسخين</th><th>حركة الصفيحتين</th><th>نوع الحدود</th></tr></thead><tbody>`+
  Object.entries(MODES).map(([k,m])=>`<tr><td>${m.n}</td><td>${S.obs[k]?m.mv:'—'}</td><td>${S.obs[k]?`<b>${m.bd}</b>`:'—'}</td></tr>`).join('')+'</tbody></table>';}
function sync(){sec.$$('[data-m]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.m===S.mode));const o=sec.$('[data-a="on"]');o.setAttribute('aria-pressed',S.on);o.textContent=S.on?'⏻ أطفئ السخان':'⏻ شغّل السخان';}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x)return;const d=x.dataset;
  if(d.m)setMode(d.m);else if(d.a==='on'){S.on=!S.on;P3.click();if(S.on&&S.shift>=.32){resetPlates();}sync();render();}
  else if(d.a==='reset'){S.on=false;S.heat=0;S.obs={};resetPlates();sync();render();renderNB();}});
L.onTap(tank,()=>{S.on=!S.on;sync();render();});
sync();render();renderNB();
};

/* =====================================================================
   ١١) أنبوب الأشعة المهبطية — 3D (ثالث متوسط · نماذج الذرة)
   ===================================================================== */
const CRT={};EXP_MODS.crt=CRT;
CRT.init=function(){gm();
const S={on:false,plates:0,mag:0,obs:{},busy:false};P3.dbg.crt=S;// plates: 0 off, 1 top+, -1 top−; mag: 0 none, 1 N toward viewer, -1 S toward viewer
const NAMES=['شغّل الأنبوب','الألواح المشحونة','المغناطيس','الاستنتاج'];
const sec=P3.section('crt',{title:'أنبوب الأشعة المهبطية',grade:'ثالث متوسط',lesson:'نماذج الذرة',
  hud:`<div class="p3-m warm" style="min-width:200px"><small>اتجاه انحراف الشعاع</small><b class="crD" style="font-family:var(--f-body);font-size:1.02rem">—</b></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">الجهد</span><button class="p3-b pri" data-a="on">⚡ شغّل الجهد العالي</button></div>
    <div class="p3-acts"><span class="p3-lab">الألواح</span><button class="p3-b" data-p="0">بلا شحنة</button><button class="p3-b" data-p="1">العلوي (+) السفلي (−)</button><button class="p3-b" data-p="-1">العلوي (−) السفلي (+)</button></div>
    <div class="p3-acts"><span class="p3-lab">المغناطيس</span><button class="p3-b" data-g="0">بعيد</button><button class="p3-b" data-g="1">القطب الشمالي نحو الأنبوب</button><button class="p3-b" data-g="-1">القطب الجنوبي نحو الأنبوب</button></div></div>`,
  learn:`<div class="panel"><h3>تجربة طومسون</h3><p>عند تطبيق جهد عالٍ بين قطبين في أنبوب مفرّغ من الهواء، تنطلق من المهبط (القطب السالب) أشعة تسير في خطوط مستقيمة وتجعل الشاشة تتوهج.</p>
      <p>انحرفت الأشعة نحو اللوح <b>الموجب</b> وابتعدت عن السالب، وانحرفت بالمغناطيس؛ فاستنتج طومسون أنها جسيمات <b>سالبة الشحنة</b> سُمّيت <b>الإلكترونات</b>، وأنها موجودة في ذرات كل العناصر.</p></div>
    <div class="panel"><h3>نموذج طومسون</h3><p>الذرة كرة موجبة الشحنة تنتشر فيها الإلكترونات السالبة (نموذج الكعكة بالزبيب).</p></div>`,
  quiz:[{q:'انحرفت أشعة المهبط نحو اللوح الموجب، فهي:',o:['موجبة الشحنة','سالبة الشحنة','متعادلة'],a:1},{q:'سُمّيت جسيمات أشعة المهبط:',o:['البروتونات','النيوترونات','الإلكترونات'],a:2},
        {q:'تنطلق أشعة المهبط من:',o:['المصعد (+)','المهبط (−)','الشاشة'],a:1},{q:'العالم الذي اكتشف الإلكترون بهذه التجربة:',o:['طومسون','رذرفورد','دالتون'],a:0}],
  report:()=>({title:'أنبوب الأشعة المهبطية',grade:'ثالث متوسط',lesson:'نماذج الذرة',cols:['الحالة','ملاحظة الشعاع'],rows:Object.entries(S.obs).map(([k,v])=>[k,v]),note:'ما شحنة جسيمات أشعة المهبط؟ وما الدليل؟'})
});
const L=new Lab(sec,{target:V(-.25,.95,.5),dist:a=>Math.max(4,6.6/a),exposure:.9});buildRoom(L);
const toast=m=>L.toast(m),crD=sec.$('.crD');
/* ---------- tube ---------- */
const TY=1.05,TZ=.3,X0=-1.35,XS=1.35;const T=new THREE.Group();T.position.set(0,TY,TZ);
const gl=new THREE.MeshPhysicalMaterial({color:0xeef8fa,roughness:.04,transparent:true,opacity:.16,clearcoat:1,side:THREE.DoubleSide,depthWrite:false});gl.userData.keepEnv=1;gl.envMapIntensity=1.6;
const neck=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,1.6,40,1,true),gl);neck.rotation.z=Math.PI/2;neck.position.x=-.55;neck.renderOrder=3;
const flare=new THREE.Mesh(new THREE.CylinderGeometry(.52,.2,.9,48,1,true),gl);flare.rotation.z=Math.PI/2;flare.position.x=.7;flare.renderOrder=3;
const cap=new THREE.Mesh(new THREE.SphereGeometry(.2,24,12,0,Math.PI*2,0,Math.PI/2),gl);cap.rotation.z=Math.PI/2;cap.position.x=-1.35;cap.renderOrder=3;
const scrM=new THREE.MeshStandardMaterial({color:0x2a3a30,emissive:0x0a1a10,roughness:.6,side:THREE.DoubleSide});const scr=new THREE.Mesh(new THREE.CircleGeometry(.5,48),scrM);scr.rotation.y=-Math.PI/2;scr.position.x=XS-.2+.0;
const cath=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.03,24),KIT.mat(0x9aa3a8,{metalness:.9,roughness:.25}));cath.rotation.z=Math.PI/2;cath.position.x=-1.25;
const anode=new THREE.Mesh(new THREE.TorusGeometry(.08,.015,8,24),KIT.mat(0xc49a3a,{metalness:.9,roughness:.3}));anode.rotation.y=Math.PI/2;anode.position.x=-.85;
const pT=new THREE.Mesh(new THREE.BoxGeometry(.5,.012,.22),KIT.mat(0x9aa3a8,{metalness:.8,roughness:.3})),pB=pT.clone();pT.position.set(0,.13,0);pB.position.set(0,-.13,0);
const sgn=(t)=>{const c=P3.card([{t,mono:1,s:110}],.09,.09,{bg:'#fff',bd:'#0000'});return c;};const lT=sgn('+'),lB=sgn('−');lT.position.set(0,.22,.0);lB.position.set(0,-.22,.0);
[lT,lB].forEach(l=>{l.visible=false;});
T.add(neck,flare,cap,scr,cath,anode,pT,pB,lT,lB);L.add(T);
/* stand */
[[-1.0],[.7]].forEach(([x])=>{const r=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,TY-.2,10),M.steel);r.position.set(x,(TY-.2)/2,TZ);const c=new THREE.Mesh(new THREE.TorusGeometry(x>0?.42:.21,.025,8,24),KIT.mat(0x2d3a40));c.rotation.y=Math.PI/2;c.position.set(x,TY,TZ);
  const b=new THREE.Mesh(RBox(.4,.05,.4,.02),KIT.mat(0x2b3036));b.position.set(x,.025,TZ);L.add(r,c,b);});
/* power supply */
const PS=new THREE.Group();PS.position.set(-1.9,0,1.15);const psb=new THREE.Mesh(RBox(.8,.42,.5,.04),KIT.mat(0x2b3036,{metalness:.3}));psb.position.y=.21;
const psl=KIT.lcd(.5,.16);psl.m.position.set(0,.3,.251);psl.set('0 kV');PS.add(psb,psl.m);castAll(PS);L.add(PS);L.label('مصدر جهد عالٍ',V(-1.9,.62,1.15),'small');
[[0xc62828,[-1.25,TY,TZ]],[0x1c1c1c,[-.85,TY-.2,TZ]]].forEach(([c,e],i)=>{const pts=[V(-1.9+(i?.15:-.15),.3,1.4),V(-1.7,.05,1.2),V(-1.3,.05,.8),V(e[0]-(i?0:.18),.3,TZ+.15),V(e[0]-(i?0:.12),e[1]-.12,TZ)];
  L.add(KIT.wire(pts,i?0xc62828:0x1c1c1c,.02));});
L.label('المهبط (−)',V(-1.25,TY+.35,TZ),'small');L.label('المصعد (+)',V(-.85,TY+.35,TZ),'small');L.label('شاشة مضيئة',V(XS-.2,TY+.65,TZ),'small');
/* magnet (bar) */
const MG=new THREE.Group();{const n=new THREE.Mesh(RBox(.16,.16,.35,.02),KIT.mat(0xc62828)),s=new THREE.Mesh(RBox(.16,.16,.35,.02),KIT.mat(0x1f6fb2));n.position.z=-.175;s.position.z=.175;
  const ln=P3.card([{t:'N',mono:1,s:120}],.12,.12,{bg:'#c62828',ink:'#fff',bd:'#0000'}),ls=P3.card([{t:'S',mono:1,s:120}],.12,.12,{bg:'#1f6fb2',ink:'#fff',bd:'#0000'});ln.position.set(0,.081,-.17);ln.rotation.x=-Math.PI/2;ls.position.set(0,.081,.17);ls.rotation.x=-Math.PI/2;
  MG.add(n,s,ln,ls);castAll(MG);}
const MG_OFF=V(1.5,.08,1.3);MG.position.copy(MG_OFF);L.add(MG);
/* ---------- beam ---------- */
const bmM=new THREE.MeshBasicMaterial({color:$lc(0x7dffb0),transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false});
let beam=new THREE.Mesh(new THREE.BufferGeometry(),bmM);beam.renderOrder=9;T.add(beam);
const spot=new THREE.Sprite(new THREE.SpriteMaterial({map:P3.glowTex(),color:$lc(0x9dffc4),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));spot.scale.setScalar(.32);spot.renderOrder=10;T.add(spot);
let dy=0,dyT=0;
function target(){return S.on?(S.plates*.19+(-S.mag)*.17):0;}// + plates top → up ; N toward tube → down
function buildBeam(){const pts=[];const x1=-.85,x2=XS-.21;for(let i=0;i<=40;i++){const x=x1+(x2-x1)*i/40;const u=Math.max(0,(x+.25)/(x2+.25));pts.push(V(x,dy*u*u*(x>-.25?1:0),0));}
  beam.geometry.dispose();beam.geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),60,.012,6);spot.position.set(x2-.01,dy,0);}
P3.loop(L,(dt,t)=>{const tg=target();if(Math.abs(tg-dyT)>1e-4)dyT=tg;const old=dy;dy+=(dyT-dy)*Math.min(1,dt*6);
  const vis=S.on;beam.visible=vis;spot.material.opacity=vis?.9+.1*Math.sin(t*20):0;scrM.emissive.copy($lc(vis?0x1f6a3a:0x0a1a10));cath.material.emissive=cath.material.emissive||new THREE.Color();
  if(vis&&(Math.abs(old-dy)>1e-4||!beam.geometry.attributes.position))buildBeam();bmM.opacity=.6+.15*Math.sin(t*30);});
/* ---------- actions ---------- */
function desc(){if(!S.on)return '—';const d=target();if(Math.abs(d)<.01)return 'يسير في خط مستقيم';return d>0?'ينحرف إلى أعلى':'ينحرف إلى أسفل';}
function record(){if(!S.on)return;let k;if(S.plates&&!S.mag)k=S.plates>0?'اللوح العلوي موجب':'اللوح العلوي سالب';else if(S.mag&&!S.plates)k=S.mag>0?'القطب الشمالي نحو الأنبوب':'القطب الجنوبي نحو الأنبوب';else if(!S.plates&&!S.mag)k='دون مؤثر';else k=null;
  const d=desc();crD.textContent=d;if(k&&!S.obs[k]){S.obs[k]=d+(S.plates&&!S.mag?(S.plates>0?' (نحو اللوح الموجب)':' (نحو اللوح الموجب السفلي)'):'');renderNB();}}
function setOn(){S.on=!S.on;psl.set(S.on?'15 kV':'0 kV');P3.click();if(S.on)P3.noise(.4,.15,6000,2);sync();setTimeout(()=>{record();render();},400);}
function setPlates(p){S.plates=p;lT.visible=lB.visible=!!p;const tops=p>0?'+':'−';[lT,lB].forEach((l,i)=>{l.material.map=canvasTex(128,128,c=>{c.fillStyle=(i?(p>0?'#1f6fb2':'#c62828'):(p>0?'#c62828':'#1f6fb2'));c.beginPath();c.arc(64,64,60,0,7);c.fill();c.fillStyle='#fff';c.font='800 110px "IBM Plex Mono"';c.textAlign='center';c.textBaseline='middle';c.fillText(i?(p>0?'−':'+'):(p>0?'+':'−'),64,70);});l.material.needsUpdate=true;});
  P3.click();sync();setTimeout(()=>{record();render();},500);}
async function setMag(g){if(S.busy)return;S.busy=true;sync();const to=g?V(.1,TY,TZ+.62):MG_OFF;MG.rotation.y=g<0?Math.PI:0;await L.arc(MG,to,700,g?TY+.3:.6);S.mag=g;S.busy=false;sync();setTimeout(()=>{record();render();},500);}
/* ---------- UI ---------- */
function stepIdx(){if(!S.on&&!Object.keys(S.obs).length)return 0;const ks=Object.keys(S.obs);const hp=ks.some(k=>k.startsWith('اللوح')),hm=ks.some(k=>k.startsWith('القطب'));if(!hp)return 1;if(!hm)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='شغّل الجهد العالي';html=`<p class="p3-txt">الأنبوب مفرّغ من الهواء. شغّل الجهد العالي ولاحظ ما يخرج من المهبط وأين يتوهج الضوء.</p>`;}
  else if(k===1){title='قرّب الأشعة من شحنات كهربائية';html=`<p class="p3-txt">اشحن اللوحين داخل الأنبوب، ثم اعكس الشحنة. نحو أي لوح ينحرف الشعاع؟</p>`;}
  else if(k===2){title='قرّب المغناطيس';html=`<p class="p3-txt">أبعد شحنة الألواح، ثم قرّب القطب الشمالي ثم الجنوبي من الأنبوب ولاحظ الشعاع.</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">ينحرف الشعاع نحو اللوح الموجب ويتأثر بالمغناطيس؛ إذن أشعة المهبط جسيمات سالبة الشحنة: الإلكترونات.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){const e=Object.entries(S.obs);sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>الحالة</th><th>ملاحظة الشعاع</th></tr></thead><tbody>`+
  (e.length?e.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join(''):'<tr><td colspan="2" class="muted">شغّل الأنبوب وجرّب المؤثرات.</td></tr>')+'</tbody></table>';}
function sync(){const o=sec.$('[data-a="on"]');o.setAttribute('aria-pressed',S.on);o.textContent=S.on?'⚡ أوقف الجهد':'⚡ شغّل الجهد العالي';
  sec.$$('button[data-p]').forEach(x=>x.setAttribute('aria-pressed',+x.dataset.p===S.plates));sec.$$('[data-g]').forEach(x=>{x.setAttribute('aria-pressed',+x.dataset.g===S.mag);x.disabled=S.busy;});}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const d=x.dataset;
  if(d.a==='on')setOn();else if(d.p!=null)setPlates(+d.p);else if(d.g!=null)setMag(+d.g);});
L.onTap(PS,setOn);L.onTap(MG,()=>setMag(S.mag?0:1));
buildBeam();sync();render();renderNB();
};

/* =====================================================================
   ١٢) أنواع الإشعاع ونفاذيتها — 3D (ثالث متوسط · النواة)
   ===================================================================== */
const RAD={};EXP_MODS.rad=RAD;
RAD.init=function(){gm();
const SRC={a:{n:'ألفا α',col:0xff5a3a,sz:.035,sp:1.2},b:{n:'بيتا β',col:0x3a8aff,sz:.022,sp:2.4},g:{n:'جاما γ',col:0xffd23a,sz:.016,sp:3.5},x:{n:'مصدر مجهول ؟'},bg:{n:'بلا مصدر (الخلفية)'}};
const ABS={none:{n:'بلا حاجز'},paper:{n:'ورقة'},al:{n:'ألومنيوم 3 mm'},pb:{n:'رصاص 2 cm'}};
const RATE={a:{none:150,paper:0,al:0,pb:0},b:{none:120,paper:110,al:0,pb:0},g:{none:80,paper:79,al:70,pb:16},bg:{none:0,paper:0,al:0,pb:0}};const BG=3;// counts per 10 s
const S={src:'bg',abs:'none',busy:false,tab:{},unk:['a','b','g'][Math.floor(Math.random()*3)],ans:'',ok:null,count:0};P3.dbg.rad=S;
const NAMES=['قِس الخلفية','اختر المصدر','جرّب الحواجز','حدّد المصدر المجهول'];
const sec=P3.section('rad',{title:'أنواع الإشعاع ونفاذيتها',grade:'ثالث متوسط',lesson:'النواة',
  hud:`<div class="p3-row"><div class="p3-m warm"><small>عدد النبضات في 10 s</small><b class="rdC">0</b></div><div class="p3-m"><small>الزمن</small><b class="rdT">0.0 s</b></div></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">المصدر</span>${['bg','a','b','g','x'].map(k=>`<button class="p3-b" data-s="${k}">${SRC[k].n}</button>`).join('')}</div>
    <div class="p3-acts"><span class="p3-lab">الحاجز</span>${Object.entries(ABS).map(([k,v])=>`<button class="p3-b" data-b="${k}">${v.n}</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b pri" data-a="go">▶ ابدأ العدّ 10 ثوانٍ</button></div></div>`,
  learn:`<div class="panel"><h3>أنواع الإشعاع</h3><p><b>ألفا α:</b> جسيمات ثقيلة موجبة (نواة هيليوم)، نفاذيتها ضعيفة؛ توقفها ورقة.</p><p><b>بيتا β:</b> إلكترونات سريعة، نفاذيتها متوسطة؛ تمر من الورق ويوقفها لوح ألومنيوم رقيق.</p><p><b>جاما γ:</b> موجات كهرومغناطيسية عالية الطاقة، نفاذيتها كبيرة؛ يلزم الرصاص السميك أو الخرسانة لتقليلها.</p></div>
    <div class="panel"><h3>الإشعاع الخلفي</h3><p>يسجّل العدّاد دائمًا عددًا قليلًا من النبضات حتى دون مصدر، مصدره الصخور والفضاء؛ لذلك نقيسه أولًا ونقارن به.</p></div>`,
  quiz:[{q:'الإشعاع الذي توقفه ورقة:',o:['ألفا','بيتا','جاما'],a:0},{q:'أكبر أنواع الإشعاع نفاذية:',o:['ألفا','بيتا','جاما'],a:2},
        {q:'يمر من الورق ويوقفه الألومنيوم:',o:['ألفا','بيتا','جاما'],a:1},{q:'لماذا نقيس الإشعاع الخلفي أولًا؟',o:['للمقارنة به','لتسخين العدّاد','لأنه أخطر'],a:0}],
  report:()=>({title:'أنواع الإشعاع ونفاذيتها',grade:'ثالث متوسط',lesson:'النواة',cols:['المصدر','بلا حاجز','ورقة','ألومنيوم','رصاص'],
    rows:['bg','a','b','g','x'].map(s=>[SRC[s].n,...Object.keys(ABS).map(b=>S.tab[s+b]!=null?String(S.tab[s+b]):'')]),note:'العدد في 10 ثوانٍ. حدّد نوع الإشعاع الذي يوقفه كل حاجز.'})
});
const L=new Lab(sec,{target:V(0,.45,.45),dist:a=>Math.max(3.8,6.3/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* ---------- layout: source — absorber — GM tube ---------- */
const Y=.45,Z=.35,SX=-1.2,AX=-.25,GX=.8;
const base=new THREE.Mesh(RBox(3.2,.05,.7,.02),KIT.mat(0x2b3036,{metalness:.3}));base.position.set(-.1,.025,Z);L.add(base);
// lead castle around the source
const lead=KIT.mat(0x6b7480,{metalness:.35,roughness:.55});
[[0,.42,0,.5,.1,.5],[0,.18,-.2,.5,.36,.1],[0,.18,.2,.5,.36,.1],[-.2,.18,0,.1,.36,.3]].forEach(([x,y,z,w,h,d])=>{const b=new THREE.Mesh(RBox(w,h,d,.01),lead);b.position.set(SX+x-.05,y,Z+z);b.castShadow=true;L.add(b);});
const srcRod=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.28,14),KIT.mat(0x9aa3a8,{metalness:.8}));srcRod.rotation.z=Math.PI/2;srcRod.position.set(SX+.05,Y,Z);L.add(srcRod);
const srcCap=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.04,20),KIT.mat(0xffd84a));srcCap.rotation.z=Math.PI/2;srcCap.position.set(SX+.2,Y,Z);L.add(srcCap);
const srcLbl=L.label('',V(SX,.75,Z),'gas');
// absorber holder and absorbers
const hold=new THREE.Mesh(RBox(.3,.12,.3,.02),KIT.mat(0x2d3a40));hold.position.set(AX,.11,Z);L.add(hold);
const A={paper:new THREE.Mesh(new THREE.BoxGeometry(.008,.5,.42),KIT.mat(0xfbfaf4,{roughness:.95})),al:new THREE.Mesh(new THREE.BoxGeometry(.03,.5,.42),KIT.mat(0xc9ced3,{metalness:.9,roughness:.3})),pb:new THREE.Mesh(RBox(.2,.5,.42,.01),lead)};
const ABS_HOME={paper:V(-.7,.27,1.25),al:V(-.25,.27,1.25),pb:V(.25,.27,1.25)};
Object.entries(A).forEach(([k,m])=>{m.position.copy(ABS_HOME[k]);m.castShadow=true;L.add(m);const c=P3.card([{t:ABS[k].n,s:54}],.42,.12);c.position.set(ABS_HOME[k].x,.08,1.6);c.rotation.x=-.9;L.add(c);L.onTap(m,()=>setAbs(k));});
// GM tube + counter
const gmT=new THREE.Group();gmT.position.set(GX,Y,Z);{const t=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.6,24),KIT.mat(0x2d3a40,{metalness:.5}));t.rotation.z=Math.PI/2;t.position.x=.3;
  const w=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.01,24),KIT.mat(0xb87333,{metalness:.6}));w.rotation.z=Math.PI/2;w.position.x=0;gmT.add(t,w);}
const gmS=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,Y,10),M.steel);gmS.position.set(GX+.3,Y/2,Z);L.add(gmT,gmS);
const CT=new THREE.Group();CT.position.set(1.85,0,Z+.1);const cb=new THREE.Mesh(RBox(.7,.4,.45,.04),KIT.mat(0xe8eaec,{roughness:.4}));cb.position.y=.2;const cl=KIT.lcd(.5,.17);cl.m.position.set(0,.26,.226);cl.set('0');
CT.add(cb,cl.m);castAll(CT);L.add(CT);L.add(KIT.wire([V(GX+.6,Y,Z),V(1.4,.3,Z),V(1.6,.15,Z+.1),V(1.6,.2,Z+.3)],0x1c1c1c,.015));
L.label('أنبوب جايجر',V(GX+.3,Y+.25,Z),'small');L.label('العدّاد',V(1.85,.6,Z+.1),'small');L.label('مكان الحاجز',V(AX,.62,Z),'small');
/* ---------- particles ---------- */
const NP=60;const pool=[...Array(NP)].map(()=>{const m=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),new THREE.MeshBasicMaterial({color:0xffffff}));m.visible=false;L.add(m);return {m,on:false};});
const sparks=[...Array(20)].map(()=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:P3.glowTex(),color:0xffffff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));s.visible=false;s.scale.setScalar(.12);L.add(s);return {s,t:0};});
let si=0;function spark(p,c){const s=sparks[si++%sparks.length];s.s.position.copy(p);s.s.material.color.copy($lc(c));s.s.visible=true;s.t=performance.now();}
const cntEl=sec.$('.rdC'),tEl=sec.$('.rdT');
const real=()=>S.src==='x'?S.unk:S.src;
function emit(pass){const p=pool.find(x=>!x.on);if(!p)return;const s=SRC[real()];p.on=true;p.pass=pass;p.x=SX+.25;p.y=Y+(Math.random()-.5)*.06;p.z=Z+(Math.random()-.5)*.06;p.v=s.sp;p.col=s.col;
  p.m.material.color.copy($lc(s.col));p.m.scale.setScalar(s.sz);p.m.visible=true;}
P3.loop(L,(dt,t,now)=>{pool.forEach(p=>{if(!p.on)return;p.x+=p.v*dt;const stopX=S.abs==='none'?99:AX-.02;
    if(!p.pass&&p.x>=stopX){spark(V(stopX,p.y,p.z),p.col);p.on=false;p.m.visible=false;return;}
    if(p.x>=GX){p.on=false;p.m.visible=false;spark(V(GX,p.y,p.z),0x7dffb0);return;}p.m.position.set(p.x,p.y,p.z);});
  sparks.forEach(s=>{if(!s.s.visible)return;const a=(now-s.t)/300;if(a>1)s.s.visible=false;else s.s.material.opacity=1-a;});});
/* ---------- actions ---------- */
function poisson(l){if(l<=0)return 0;let L0=Math.exp(-Math.min(l,600)),k=0,p=1;if(l>60)return Math.max(0,Math.round(l+Math.sqrt(l)*(Math.random()+Math.random()+Math.random()-1.5)*1.4));do{k++;p*=Math.random();}while(p>L0);return k-1;}
async function setAbs(k){if(S.busy||S.abs===k)return;S.busy=true;sync();if(S.abs!=='none')await L.arc(A[S.abs],ABS_HOME[S.abs],600,.8);if(k!=='none')await L.arc(A[k],V(AX,.42,Z),700,.9);S.abs=k;S.busy=false;P3.click();sync();render();}
function setSrc(k){if(S.busy)return;S.src=k;srcLbl.textContent=SRC[k].n;srcCap.material.color.copy($lc(k==='bg'?0x666666:k==='x'?0xffffff:SRC[k].col));P3.click();sync();render();}
async function go(){if(S.busy)return;S.busy=true;sync();const r=real();const mean=(RATE[r]?RATE[r][S.abs]:0)+BG;const n=poisson(mean);
  const passFrac=r==='bg'?0:RATE[r][S.abs]/Math.max(1,RATE[r].none);const emits=r==='bg'?0:Math.min(140,RATE[r].none*.6);
  const times=[...Array(n)].map(()=>Math.random()*10).sort((a,b)=>a-b);let shown=0,ei=0;const etimes=[...Array(Math.round(emits))].map(()=>Math.random()*10).sort((a,b)=>a-b);
  await L.tw(10000/2.5,k=>{const t=k*10;while(shown<times.length&&times[shown]<=t){shown++;P3.noise(.012,.5,3500,3);}
    while(ei<etimes.length&&etimes[ei]<=t){ei++;emit(Math.random()<passFrac);}cntEl.textContent=shown;cl.set(String(shown));tEl.textContent=t.toFixed(1)+' s';});
  cntEl.textContent=n;cl.set(String(n));S.tab[S.src+S.abs]=n;S.count=n;S.busy=false;toast(`${SRC[S.src].n} · ${ABS[S.abs].n}: ${n} نبضة في 10 s`);sync();render();renderNB();}
/* ---------- UI ---------- */
function stepIdx(){const t=S.tab;if(t['bgnone']==null)return 0;const tried=['a','b','g'].filter(s=>t[s+'none']!=null).length;if(tried<2)return 1;const abs=Object.keys(t).filter(k=>/(paper|al|pb)$/.test(k)&&!k.startsWith('x')).length;if(abs<4)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='قِس الإشعاع الخلفي';html=`<p class="p3-txt">دون أي مصدر، شغّل العدّاد 10 ثوانٍ. هذا الإشعاع الخلفي الذي ستقارن به كل القراءات.</p>`;}
  else if(k===1){title='اختر مصدرًا مشعًا';html=`<p class="p3-txt">قِس كل مصدر (ألفا وبيتا وجاما) بلا حاجز أولًا. لاحظ الجسيمات المنطلقة نحو أنبوب جايجر.</p>`;}
  else if(k===2){title='جرّب الحواجز';html=`<p class="p3-txt">ضع الورقة ثم الألومنيوم ثم الرصاص بين المصدر والعدّاد. إذا نزلت القراءة إلى مستوى الخلفية (نحو ${BG}) فالحاجز أوقف الإشعاع.</p>`;}
  else{title='حدّد المصدر المجهول';html=`<p class="p3-txt">اختر «مصدر مجهول ؟» وقِسه مع الحواجز، ثم حدّد نوعه في دفتر المختبر.</p>${S.ok?'<p class="p3-ok">إجابة صحيحة!</p>':''}`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){const cell=(s,b)=>S.tab[s+b]!=null?S.tab[s+b]:'—';
  sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>المصدر</th><th>بلا</th><th>ورقة</th><th>Al</th><th>Pb</th></tr></thead><tbody>`+['bg','a','b','g','x'].map(s=>`<tr><td>${SRC[s].n.split(' (')[0]}</td>${Object.keys(ABS).map(b=>`<td class="n">${cell(s,b)}</td>`).join('')}</tr>`).join('')+
  `</tbody></table><div class="p3-acts" style="margin-top:8px"><span class="p3-lab">المجهول هو</span><select class="rdSel" aria-label="نوع المصدر المجهول"><option value="">اختر</option>${['a','b','g'].map(k=>`<option value="${k}" ${S.ans===k?'selected':''}>${SRC[k].n}</option>`).join('')}</select><button class="p3-b" data-a="chk">تحقق</button><span class="p3-fb ${S.ok==null?'':S.ok?'ok':'bad'}">${S.ok==null?'':S.ok?'✓ صحيح':'✗ قارن قراءاته بالحواجز'}</span></div>`;
  const sel=sec.$('.rdSel');sel.onchange=()=>{S.ans=sel.value;};}
function sync(){const b=S.busy;sec.$$('[data-s]').forEach(x=>{x.setAttribute('aria-pressed',x.dataset.s===S.src);x.disabled=b;});sec.$$('[data-b]').forEach(x=>{x.setAttribute('aria-pressed',x.dataset.b===S.abs);x.disabled=b;});sec.$('[data-a="go"]').disabled=b;}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const d=x.dataset;
  if(d.s)setSrc(d.s);else if(d.b)setAbs(d.b);else if(d.a==='go')go();
  else if(d.a==='chk'){if(!S.ans){toast('اختر نوع المصدر أولًا.');return;}S.ok=S.ans===S.unk;if(S.ok)P3.good();else{try{L2.bad();}catch(err){}}renderNB();render();}});
L.onTap(CT,go);setSrc('bg');sync();render();renderNB();
};

/* =====================================================================
   ١٣) الفلزات القلوية مع الماء — 3D (ثالث متوسط · العناصر الممثلة)
   ===================================================================== */
const ALK={};EXP_MODS.alk=ALK;
ALK.init=function(){gm();
const MET={li:{f:'Li',n:'الليثيوم',v:.25,dur:9,melt:false,flame:false,float:'يطفو',mv:'يتحرك ببطء ويفور بهدوء',fl:'لا يشتعل',rank:1},
  na:{f:'Na',n:'الصوديوم',v:.8,dur:6,melt:true,flame:false,float:'يطفو',mv:'ينصهر إلى كرة لامعة ويندفع بسرعة مع أزيز',fl:'لا يشتعل غالبًا',rank:2},
  k:{f:'K',n:'البوتاسيوم',v:1.4,dur:3.6,melt:true,flame:true,float:'يطفو',mv:'يندفع بسرعة كبيرة ويُسمع فرقعة',fl:'يشتعل بلهب بنفسجي فاتح (ليلكي)',rank:3}};
const S={cur:null,php:false,busy:false,obs:{},order:{},ok:null,piece:false};P3.dbg.alk=S;
const NAMES=['أضف الكاشف','اقطع قطعة','ضعها في الماء','قارن النشاط'];
const sec=P3.section('alk',{title:'الفلزات القلوية مع الماء',grade:'ثالث متوسط',lesson:'العناصر الممثلة',
  hud:`<div class="p3-m warm" style="min-width:210px"><small>الملاحظة</small><b class="akO" style="font-family:var(--f-body);font-size:.98rem">—</b></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><button class="p3-b" data-a="php">💧 أضف كاشف الفينولفثالين</button></div>
    <div class="p3-acts"><span class="p3-lab">الفلز</span>${Object.entries(MET).map(([k,m])=>`<button class="p3-b" data-m="${k}">${m.f} ${m.n}</button>`).join('')}</div>
    <div class="p3-acts"><button class="p3-b" data-a="cut">🔪 اقطع قطعة صغيرة</button><button class="p3-b pri" data-a="drop">⬇ ضعها في الماء</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ ماء جديد</button></div></div>`,
  learn:`<div class="panel"><h3>الفلزات القلوية (المجموعة 1)</h3><p>فلزات لينة تُقطع بالسكين، لامعة عند القطع ثم تفقد بريقها بسرعة لتفاعلها مع الهواء؛ لذلك تُحفظ تحت الزيت.</p>
      <p>تتفاعل مع الماء فتنتج <b>هيدروكسيد الفلز</b> (محلول قاعدي يحوّل الفينولفثالين إلى الوردي) وغاز <b>الهيدروجين</b>.</p><p class="p3-eq">2Na + 2H₂O → 2NaOH + H₂</p></div>
    <div class="panel"><h3>تدرّج النشاط</h3><p>يزداد نشاط الفلزات القلوية كلما اتجهنا إلى أسفل المجموعة: الليثيوم ثم الصوديوم ثم البوتاسيوم؛ لأن إلكترون التكافؤ يبتعد عن النواة فيسهل فقده.</p>
      <p><b>تحذير:</b> هذه التجربة خطرة في الواقع، وتُعرض فقط بحواجز أمان وبكميات صغيرة جدًا.</p></div>`,
  quiz:[{q:'أنشط الفلزات الثلاثة مع الماء:',o:['الليثيوم','الصوديوم','البوتاسيوم'],a:2},{q:'الغاز الناتج من تفاعل الصوديوم مع الماء:',o:['الأكسجين','الهيدروجين','الكلور'],a:1},
        {q:'تحوّل لون الفينولفثالين إلى الوردي يدل على أن المحلول:',o:['حمضي','قاعدي','متعادل'],a:1},{q:'تُحفظ الفلزات القلوية تحت الزيت لأنها:',o:['تتفاعل مع الهواء والماء بسرعة','ثقيلة جدًا','تذوب في الزيت'],a:0}],
  report:()=>({title:'الفلزات القلوية مع الماء',grade:'ثالث متوسط',lesson:'العناصر الممثلة',cols:['الفلز','الطفو','الحركة','اللهب','لون الكاشف'],
    rows:Object.entries(MET).map(([k,m])=>{const o=S.obs[k];return [`${m.n} ${m.f}`,o?m.float:'',o?m.mv:'',o?m.fl:'',o?(o.php?'وردي':'لم يُضف الكاشف'):''];}),note:'رتّب الفلزات حسب نشاطها، وفسّر.'})
});
const L=new Lab(sec,{target:V(-.3,.4,.5),dist:a=>Math.max(4,6.8/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m),akO=sec.$('.akO');
/* ---------- trough ---------- */
const TX=.3,TZ=.25,WY=.42;const tr=new THREE.Group();tr.position.set(TX,0,TZ);
const tpts=[[0,0],[.95,0],[1.0,.04],[1.05,.55],[1.09,.57],[1.04,.57]].map(p=>new THREE.Vector2(p[0],p[1]));
const bowl=new THREE.Mesh(new THREE.LatheGeometry(tpts,64),G.glass);bowl.renderOrder=3;
const wM=G.water(0xcfe9f3,.42);const water=new THREE.Mesh(new THREE.CylinderGeometry(1.02,.96,WY-.02,64),wM);water.position.y=(WY+.02)/2;water.renderOrder=1;
tr.add(bowl,water);L.add(tr);
// safety screen
const scr=new THREE.Group();{const p=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.0),new THREE.MeshPhysicalMaterial({color:0xeef8fa,transparent:true,opacity:.1,roughness:0,clearcoat:1,side:THREE.DoubleSide,depthWrite:false}));p.position.y=.62;p.renderOrder=12;p.material.userData.keepEnv=1;
  const f=new THREE.Mesh(new THREE.BoxGeometry(1.64,.04,.04),KIT.mat(0x2d3a40));f.position.y=1.12;const l1=new THREE.Mesh(new THREE.BoxGeometry(.04,1.12,.04),KIT.mat(0x2d3a40));l1.position.set(-.8,.56,0);const l2=l1.clone();l2.position.x=.8;scr.add(p,f,l1,l2);}

// oil jars
const JAR={};Object.entries(MET).forEach(([k,m],i)=>{const g=new THREE.Group();g.position.set(-1.95+i*.0,0,-.55+i*.48);
  const j=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.34,24,1,true),G.glass);j.position.y=.17;j.renderOrder=3;const oil=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.24,24),G.water(0xe8c96a,.55));oil.position.y=.13;
  const lump=new THREE.Mesh(new THREE.DodecahedronGeometry(.06,0),KIT.mat(0x8f969c,{metalness:.5,roughness:.6}));lump.position.y=.06;const c=P3.card([{t:m.f,mono:1,s:110}],.16,.1);c.position.set(0,.2,.162);
  g.add(j,oil,lump,c);L.add(g);JAR[k]=g;L.onTap(g,()=>pick(k));});
L.label('فلزات محفوظة تحت الزيت',V(-1.95,.6,-.05),'small');
// cutting tile + knife
const tile=new THREE.Mesh(RBox(.6,.03,.45,.01),KIT.mat(0xf2efe6,{roughness:.8}));tile.position.set(-1.1,.015,1.0);L.add(tile);
const knife=new THREE.Group();{const b=new THREE.Mesh(new THREE.BoxGeometry(.32,.06,.008),M.steel);b.position.x=.16;const h=new THREE.Mesh(RBox(.22,.05,.035,.01),KIT.mat(0x1c1c1c));h.position.x=-.11;knife.add(b,h);}
knife.position.set(-1.1,.06,1.25);knife.rotation.y=.3;L.add(knife);
const piece=new THREE.Mesh(new THREE.BoxGeometry(.07,.05,.07),KIT.mat(0xd9dde0,{metalness:.95,roughness:.15}));piece.visible=false;piece.castShadow=true;L.add(piece);
const ball=new THREE.Mesh(new THREE.SphereGeometry(.04,20,14),KIT.mat(0xe8ecef,{metalness:1,roughness:.08}));ball.visible=false;L.add(ball);
const kf=Flame({s:.42});kf.S.air=1;kf.S.salt=0xc48cff;kf.g.visible=true;L.add(kf.g);
const bub=Bubbles(160,{op:.8});L.add(bub.mesh);
// pink trail
const trail=[];const trM=new THREE.MeshBasicMaterial({color:$lc(0xff4fa3),transparent:true,opacity:0,depthWrite:false});
function addTrail(x,z){if(trail.length>90)return;const m=new THREE.Mesh(new THREE.CircleGeometry(1,24),trM.clone());m.rotation.x=-Math.PI/2;m.position.set(x,WY-.005,z);m.scale.setScalar(.03);m.renderOrder=2;m.userData.t=0;L.add(m);trail.push(m);}
/* ---------- sim ---------- */
const R={on:false,t:0,x:0,z:0,dx:1,dz:0,m:null,lastTr:0,size:1};
P3.loop(L,(dt,t,now)=>{kf.tick(now);bub.update(dt,t);
  trail.forEach(m=>{m.userData.t+=dt;const k=Math.min(1,m.userData.t/2.2);m.scale.setScalar(.03+.2*k);m.material.opacity=S.php?.5*Math.min(1,m.userData.t*2):0;});
  if(!R.on)return;const m=MET[R.m];R.t+=dt;const life=1-R.t/m.dur;const o=m.melt&&R.t>.4?ball:piece;
  if(m.melt&&R.t>.4&&piece.visible){piece.visible=false;ball.visible=true;}
  const sp=m.v*(.6+.4*Math.sin(t*7));R.dx+=(Math.random()-.5)*dt*8;R.dz+=(Math.random()-.5)*dt*8;const l=Math.hypot(R.dx,R.dz)||1;R.dx/=l;R.dz/=l;
  R.x+=R.dx*sp*dt;R.z+=R.dz*sp*dt;const rr=Math.hypot(R.x,R.z);if(rr>.82){R.x*=.82/rr;R.z*=.82/rr;R.dx=-R.dx;R.dz=-R.dz;}
  const s=Math.max(.05,life);o.scale.setScalar(s);o.position.set(TX+R.x,WY+.015,TZ+R.z);o.rotation.y+=dt*4;
  for(let i=0;i<Math.ceil(m.v*4);i++)bub.spawn(TX+R.x+(Math.random()-.5)*.08,WY-.05,TZ+R.z+(Math.random()-.5)*.08,.006+Math.random()*.008,WY+.01,.3);
  if(now-R.lastTr>140){R.lastTr=now;addTrail(TX+R.x,TZ+R.z);}
  if(m.flame){kf.S.on=true;kf.S.saltK=1;kf.g.position.set(TX+R.x,WY+.03,TZ+R.z);kf.g.scale.setScalar(.6+.4*s);if(Math.random()<dt*6)P3.noise(.05,.3,2500,2);}
  if(Math.random()<dt*(m.v*6))P3.noise(.08,.08,4000,1);
  if(R.t>=m.dur){R.on=false;o.visible=false;kf.S.on=false;kf.S.saltK=0;if(m.melt){P3.pop();P3.flash(L,V(TX+R.x,WY+.08,TZ+R.z),m.flame?0xd9b0ff:0xfff0c0,.7);}finish();}});
/* ---------- actions ---------- */
function pick(k){if(S.busy||R.on)return;S.cur=k;S.piece=false;piece.visible=false;akO.textContent='—';P3.click();sync();render();}
async function addPhp(){if(S.busy||S.php)return;S.busy=true;sync();const d=new THREE.Mesh(new THREE.SphereGeometry(.03,10,8),G.water(0xffffff,.8));L.scene.add(d);
  for(let i=0;i<3;i++){d.position.set(TX,1.1,TZ);await L.tw(400,k=>d.position.y=1.1-(1.1-WY)*k);}L.scene.remove(d);S.php=true;S.busy=false;toast('أُضيف الفينولفثالين: الماء عديم اللون لأنه متعادل.');sync();render();}
async function cut(){if(S.busy||!S.cur||S.piece||R.on)return;S.busy=true;sync();const j=JAR[S.cur];const lump=j.children[2];
  piece.material.color.copy($lc(0xd9dde0));piece.position.set(j.position.x,.12,j.position.z);piece.scale.setScalar(1);piece.visible=true;await L.arc(piece,V(-1.1,.06,1.0),700,.7);
  const k0=knife.position.clone();await L.move(knife,V(-1.12,.16,1.0),300);await L.move(knife,V(-1.12,.065,1.0),250);P3.tone(900,.05,'triangle',.05);await L.move(knife,k0,300);
  akO.textContent='سطح القطع لامع ثم يفقد بريقه بسرعة';await L.tw(1200,k=>piece.material.color.copy($lc(0xd9dde0)).lerp($lc(0x8a9096),k));S.piece=true;S.busy=false;sync();render();}
async function drop(){if(S.busy||!S.piece||R.on)return;S.busy=true;sync();await L.arc(piece,V(TX,WY+.03,TZ),800,1.2);ball.scale.setScalar(1);ball.visible=false;piece.scale.setScalar(1);
  Object.assign(R,{on:true,t:0,x:0,z:0,dx:1,dz:.3,m:S.cur,lastTr:0});akO.textContent=MET[S.cur].mv;}
function finish(){const m=MET[R.m];S.obs[R.m]={php:S.php};S.piece=false;S.busy=false;akO.textContent=m.mv+(m.flame?' · '+m.fl:'')+(S.php?' · الماء وردي (قاعدي)':'');
  toast(`${m.n}: ${m.mv}.`);sync();render();renderNB();}
function reset(){if(S.busy||R.on)return;trail.forEach(m=>L.scene.remove(m));trail.length=0;S.php=false;bub.clear();akO.textContent='—';toast('ماء جديد دون كاشف.');sync();render();}
/* ---------- UI ---------- */
function stepIdx(){const n=Object.keys(S.obs).length;if(!S.php&&!n)return 0;if(n>=3)return 3;if(!S.piece)return 1;return 2;}
function render(){const k=stepIdx(),m=S.cur&&MET[S.cur];let title,html;
  if(k===0){title='أضف الكاشف';html=`<p class="p3-txt">أضف قطرات الفينولفثالين إلى الماء لتكشف عن المحلول القاعدي الناتج.</p>`;}
  else if(k===1){title=m?'اقطع قطعة من '+m.n:'اختر فلزًا';html=`<p class="p3-txt">${m?'اقطع قطعة صغيرة جدًا بالسكين، ولاحظ سطح القطع.':'اختر فلزًا من اللوحة: الليثيوم أو الصوديوم أو البوتاسيوم.'}</p>`;}
  else if(k===2){title='ضعها في الماء';html=`<p class="p3-txt">ضع القطعة في الماء (في الواقع خلف حاجز أمان)، وراقب: هل تطفو؟ هل تنصهر؟ ما سرعة حركتها؟ وهل يظهر لهب؟</p>`;}
  else{title='قارن النشاط';html=`<p class="p3-txt">رتّب الفلزات من الأقل نشاطًا إلى الأكثر في دفتر المختبر.</p>${S.ok?'<p class="p3-ok">صحيح! يزداد النشاط كلما اتجهنا إلى أسفل المجموعة الأولى.</p>':''}`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){let h=`<table class="p3-t"><thead><tr><th>الفلز</th><th>الحركة</th><th>اللهب</th></tr></thead><tbody>`+Object.entries(MET).map(([k,m])=>`<tr><td>${m.f}</td><td>${S.obs[k]?m.mv:'—'}</td><td>${S.obs[k]?m.fl:'—'}</td></tr>`).join('')+'</tbody></table>';
  if(Object.keys(S.obs).length>=3)h+=`<div class="p3-acts" style="margin-top:8px"><span class="p3-lab">الأقل نشاطًا ← الأكثر</span>${[1,2,3].map(i=>`<select class="akS" data-i="${i}" aria-label="الترتيب ${i}"><option value="">${i}</option>${Object.entries(MET).map(([k,m])=>`<option value="${k}" ${S.order[i]===k?'selected':''}>${m.f}</option>`).join('')}</select>`).join('')}<button class="p3-b" data-a="chk">تحقق</button><span class="p3-fb ${S.ok==null?'':S.ok?'ok':'bad'}">${S.ok==null?'':S.ok?'✓':'✗'}</span></div>`;
  sec.$('.p3-nb').innerHTML=h;sec.$$('.akS').forEach(s=>s.onchange=()=>{S.order[s.dataset.i]=s.value;});}
function sync(){const b=S.busy||R.on;sec.$('[data-a="php"]').disabled=b||S.php;sec.$('[data-a="php"]').classList.toggle('done',S.php);
  sec.$$('[data-m]').forEach(x=>{x.setAttribute('aria-pressed',x.dataset.m===S.cur);x.disabled=b;x.classList.toggle('done',!!S.obs[x.dataset.m]);});
  sec.$('[data-a="cut"]').disabled=b||!S.cur||S.piece;sec.$('[data-a="drop"]').disabled=b||!S.piece;sec.$('[data-a="reset"]').disabled=b;}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const d=x.dataset;
  if(d.m)pick(d.m);else if(d.a==='php')addPhp();else if(d.a==='cut')cut();else if(d.a==='drop')drop();else if(d.a==='reset')reset();
  else if(d.a==='chk'){const o=[S.order[1],S.order[2],S.order[3]];if(o.some(v=>!v)){toast('أكمل الترتيب أولًا.');return;}S.ok=o.join()==='li,na,k';if(S.ok)P3.good();else{try{L2.bad();}catch(err){}}renderNB();render();}});
L.onTap(tile,cut);L.onTap(tr,drop);
sync();render();renderNB();
};

/* =====================================================================
   ١٤) ظروف صدأ الحديد — 3D (ثالث متوسط · العناصر الانتقالية)
   ===================================================================== */
const RUST={};EXP_MODS.rust=RUST;
RUST.init=function(){gm();
const TB=[{k:'A',n:'ماء وهواء',sub:'ماء الصنبور',rate:.13,liq:.45,col:0xcfe7f1,oil:false,dry:false},
  {k:'B',n:'ماء مغلي + زيت',sub:'لا يوجد هواء',rate:0,liq:.45,col:0xcfe7f1,oil:true,dry:false},
  {k:'C',n:'هواء جاف',sub:'كلوريد الكالسيوم',rate:0,liq:0,col:0,oil:false,dry:true},
  {k:'D',n:'ماء مالح وهواء',sub:'محلول ملح الطعام',rate:.22,liq:.45,col:0xdfeef2,oil:false,dry:false},
  {k:'E',n:'مسمار مجلفن',sub:'مطلي بالخارصين، ماء وهواء',rate:0,liq:.45,col:0xcfe7f1,oil:false,dry:false,zinc:true}];
const LV=r=>r<.05?'لا صدأ':r<.35?'صدأ قليل':r<.7?'صدأ متوسط':'صدأ كثير';
const S={ph:0,day:0,busy:false,log:{}};P3.dbg.rust=S;
const NAMES=['ضع المسامير','انتظر الأيام','افحص الأنابيب','استنتج'];
const sec=P3.section('rust',{title:'ظروف صدأ الحديد',grade:'ثالث متوسط',lesson:'العناصر الانتقالية',
  hud:`<div class="p3-m warm"><small>الأيام</small><b class="ruD">0</b></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><button class="p3-b" data-a="put">① ضع المسامير في الأنابيب</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="d1">⏩ مرور يوم</button><button class="p3-b" data-a="d3">⏩ مرور 3 أيام</button><button class="p3-b" data-a="rec">📋 سجّل الملاحظة</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة التجربة</button></div></div>`,
  learn:`<div class="panel"><h3>صدأ الحديد</h3><p>الحديد عنصر انتقالي يتفاعل ببطء مع <b>الأكسجين</b> بوجود <b>الماء</b> فيتكوّن الصدأ (أكسيد الحديد المائي) ذو اللون البني المحمر.</p><p class="p3-eq">4Fe + 3O₂ + xH₂O → 2Fe₂O₃·xH₂O</p></div>
    <div class="panel"><h3>ماذا تعلّمنا الأنابيب؟</h3><p><b>B</b> (لا هواء) و<b>C</b> (لا ماء): لا صدأ؛ إذن يلزم الماء والهواء معًا.</p><p><b>D</b>: الملح يسرّع الصدأ.</p><p><b>E</b>: طلاء الحديد بالخارصين (الجلفنة) يحميه.</p></div>`,
  quiz:[{q:'يحتاج صدأ الحديد إلى:',o:['الماء فقط','الهواء فقط','الماء والهواء معًا'],a:2},{q:'أي الأنابيب صدئ مسماره أكثر؟',o:['الماء المالح','الهواء الجاف','الماء المغلي والزيت'],a:0},
        {q:'لماذا يُغلى الماء ويُغطّى بالزيت في الأنبوب B؟',o:['لطرد الهواء ومنع دخوله','لتسخين المسمار','لتلوين الماء'],a:0},{q:'طلاء الحديد بالخارصين لحمايته يسمى:',o:['الجلفنة','التقطير','الترشيح'],a:0}],
  report:()=>({title:'ظروف صدأ الحديد',grade:'ثالث متوسط',lesson:'العناصر الانتقالية',cols:['الأنبوب','الظروف',...Object.keys(S.log).map(d=>'اليوم '+d)],
    rows:TB.map(t=>[t.k,t.n,...Object.keys(S.log).map(d=>S.log[d][t.k])]),note:'ما الظروف اللازمة لصدأ الحديد؟ وكيف نمنعه؟'})
});
const L=new Lab(sec,{target:V(0,.55,.45),dist:a=>Math.max(3.6,6/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
/* ---------- rack + tubes ---------- */
const rack=new THREE.Group();{[-.17,.17].forEach(z=>{const r=new THREE.Mesh(RBox(3.1,.06,.08,.02),KIT.wood(0x9b6a3c));r.position.set(0,.62,z);rack.add(r);});const t=new THREE.Group();const b=new THREE.Mesh(RBox(3.1,.06,.42,.02),KIT.wood(0x9b6a3c));b.position.y=.03;
  [-1.52,1.52].forEach(x=>{const s=new THREE.Mesh(RBox(.06,.62,.42,.01),KIT.wood(0x8a5a32));s.position.set(x,.33,0);rack.add(s);});rack.add(t,b);castAll(rack);}
rack.position.set(0,0,.3);L.add(rack);
const rustT=canvasTex(256,256,c=>{c.fillStyle='#8a3d1c';c.fillRect(0,0,256,256);for(let i=0;i<900;i++){c.fillStyle=['#b5561f','#6b2a12','#c9772e','#9a4a22'][i%4];c.beginPath();c.arc(Math.random()*256,Math.random()*256,2+Math.random()*6,0,7);c.fill();}});
const T={};
TB.forEach((tb,i)=>{const x=-1.2+i*.6,tt=TestTube(.13,1.0);tt.g.position.set(x,.16,.3);if(tb.liq){tt.seg(0,tb.liq);setCol(tt.lm,tb.col);}L.add(tt.g);
  if(tb.oil){const o=new THREE.Mesh(new THREE.CylinderGeometry(.118,.118,.07,24),G.water(0xe8c96a,.7));o.position.y=tb.liq+.035;tt.g.add(o);}
  if(tb.dry){const cc=new THREE.InstancedMesh(new THREE.SphereGeometry(.022,8,6),KIT.mat(0xf6f6f2,{roughness:.9}),40);for(let j=0;j<40;j++){const d=new THREE.Object3D();const a=j*2.4,r=(j%5)*.022;d.position.set(Math.cos(a)*r,-.06+Math.floor(j/8)*.03,Math.sin(a)*r);d.updateMatrix();cc.setMatrixAt(j,d.matrix);}tt.g.add(cc);
    const cot=new THREE.Mesh(new THREE.CylinderGeometry(.115,.115,.06,16),KIT.mat(0xffffff,{roughness:1}));cot.position.y=.2;tt.g.add(cot);}
  if(tb.dry||tb.oil)tt.stp.visible=true;
  // nail
  const nm=new THREE.MeshStandardMaterial({color:$lc(tb.zinc?0xb9c3c8:0x8e969c),metalness:.85,roughness:tb.zinc?.45:.3});
  const ng=new THREE.Group();const sh=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.62,12),nm);sh.position.y=.31;const tp=new THREE.Mesh(new THREE.ConeGeometry(.018,.06,12),nm);tp.rotation.x=Math.PI;tp.position.y=-.03;
  const hd=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.02,18),nm);hd.position.y=.63;ng.add(sh,tp,hd);ng.rotation.z=.08;
  const fl=new THREE.InstancedMesh(new THREE.SphereGeometry(.012,6,5),new THREE.MeshStandardMaterial({map:rustT,roughness:1}),60);fl.count=0;for(let j=0;j<60;j++){const d=new THREE.Object3D();const a=j*2.39;d.position.set(Math.cos(a)*.02,.02+(j/60)*.55,Math.sin(a)*.02);d.scale.set(1,.6+Math.random()*.8,1);d.updateMatrix();fl.setMatrixAt(j,d.matrix);}ng.add(fl);
  ng.position.set(x+.75,.05,1.15);ng.rotation.z=Math.PI/2;castAll(ng);L.add(ng);
  const card=P3.card([{t:tb.k+' · '+tb.n,s:52},{t:tb.sub,s:38}],.56,.24,tb.rate?{}:{bd:'#2f6fb2'});card.position.set(x,.06,.78);card.rotation.x=-.95;L.add(card);
  T[tb.k]={tb,tt,ng,nm,fl,r:0,x};L.onTap(tt.g,()=>zoom(tb.k));});
/* ---------- actions ---------- */
function setRust(k,r){const o=T[k];o.r=r;o.nm.color.copy($lc(o.tb.zinc?0xb9c3c8:0x8e969c)).lerp($lc(0x8a3d1c),Math.min(1,r*1.1));o.nm.metalness=.85-.7*r;o.nm.roughness=.3+.6*r;o.fl.count=Math.floor(60*Math.min(1,r));
  if(o.tb.liq&&o.tb.rate)setCol(o.tt.lm,new THREE.Color(o.tb.col).lerp(new THREE.Color(0xc9864a),Math.min(.6,r*.6)).getHex());}
async function put(){if(S.busy||S.ph!==0)return;S.busy=true;sync();
  for(const tb of TB){const o=T[tb.k];if(o.tt.stp.visible){await L.tw(250,k=>o.tt.stp.position.y=1.045+.3*k);}
    await L.tw(800,k=>{const e=ease(k);o.ng.rotation.z=Math.PI/2*(1-e);o.ng.position.set(o.x*e+(o.x+.75)*(1-e),.05+(1-e)*0+Math.sin(Math.PI*k)*1.0+e*.12,1.15*(1-e)+.3*e);});
    P3.tone(500,.05,'triangle',.04);if(o.tt.stp.visible)await L.tw(250,k=>o.tt.stp.position.y=1.345-.3*k);}
  S.ph=1;S.busy=false;S.log[0]=Object.fromEntries(TB.map(t=>[t.k,'لا صدأ']));toast('وُضعت المسامير الخمسة. اترك الأنابيب عدة أيام.');sync();render();renderNB();}
async function days(n){if(S.busy||S.ph<1)return;if(S.day>=9){toast('مرّت 9 أيام؛ يكفي هذا للمقارنة.');return;}S.busy=true;sync();const d0=S.day,d1=Math.min(9,S.day+n);
  await L.tw(1200*n,k=>{S.day=d0+(d1-d0)*k;sec.$('.ruD').textContent=Math.floor(S.day);TB.forEach(tb=>setRust(tb.k,Math.min(1,tb.rate*S.day)));});
  S.day=d1;sec.$('.ruD').textContent=d1;S.ph=2;S.busy=false;sync();render();}
function record(){if(S.ph<1)return;const d=Math.round(S.day);S.log[d]=Object.fromEntries(TB.map(t=>[t.k,LV(T[t.k].r)]));P3.click();toast('سُجّلت ملاحظات اليوم '+d+'.');renderNB();render();}
async function zoom(k){if(S.busy)return;const o=T[k];S.busy=true;const c0=L.camera.position.clone(),t0=L.controls.target.clone(),c1=V(o.x,.6,1.55),t1=V(o.x,.4,.3);
  await L.tw(600,q=>{const e=ease(q);L.camera.position.copy(lerpV(c0,c1,e));L.controls.target.copy(lerpV(t0,t1,e));});toast(`الأنبوب ${k}: ${o.tb.n} — ${LV(o.r)}`);await sleep(1600);
  await L.tw(600,q=>{const e=ease(q);L.camera.position.copy(lerpV(c1,c0,e));L.controls.target.copy(lerpV(t1,t0,e));});S.busy=false;}
function reset(){if(S.busy)return;S.ph=0;S.day=0;S.log={};sec.$('.ruD').textContent='0';TB.forEach(tb=>{const o=T[tb.k];setRust(tb.k,0);if(tb.liq)setCol(o.tt.lm,tb.col);o.ng.rotation.z=Math.PI/2;o.ng.position.set(o.x+.75,.05,1.15);});sync();render();renderNB();toast('أُعيدت التجربة.');}
/* ---------- UI ---------- */
function stepIdx(){if(S.ph===0)return 0;if(S.day<3)return 1;if(Object.keys(S.log).length<3)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='جهّز الأنابيب';html=`<p class="p3-txt">خمسة أنابيب بظروف مختلفة: ماء وهواء، ماء مغلي عليه زيت (بلا هواء)، هواء جاف بكلوريد الكالسيوم (بلا ماء)، ماء مالح، ومسمار مجلفن. ضع المسامير.</p>`;}
  else if(k===1){title='انتظر الأيام';html=`<p class="p3-txt">قدّم الزمن يومًا بعد يوم، وسجّل ملاحظاتك. اضغط على أي أنبوب لتقترب منه.</p>`;}
  else if(k===2){title='افحص الأنابيب وسجّل';html=`<p class="p3-txt">في أي الأنابيب ظهر الصدأ؟ وفي أيها لم يظهر؟ سجّل الملاحظة في أكثر من يوم.</p>`;}
  else{title='استنتج';html=`<p class="p3-ok">يصدأ الحديد بوجود الماء والهواء معًا (A وD)، والملح يسرّع الصدأ (D)، ولا يصدأ دون هواء (B) أو دون ماء (C)، والجلفنة تحميه (E).</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){const ds=Object.keys(S.log).map(Number).sort((a,b)=>a-b).slice(-3);
  sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>الأنبوب</th>${ds.map(d=>`<th>اليوم ${d}</th>`).join('')||'<th>الملاحظة</th>'}</tr></thead><tbody>`+
  TB.map(t=>`<tr><td><b>${t.k}</b> ${t.n}</td>${ds.map(d=>`<td>${S.log[d][t.k]}</td>`).join('')||'<td>—</td>'}</tr>`).join('')+'</tbody></table>';}
function sync(){const b=S.busy;const p=sec.$('[data-a="put"]');p.disabled=b||S.ph!==0;p.classList.toggle('done',S.ph>0);['d1','d3','rec'].forEach(a=>sec.$(`[data-a="${a}"]`).disabled=b||S.ph<1);sec.$('[data-a="reset"]').disabled=b;}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const a=x.dataset.a;
  if(a==='put')put();else if(a==='d1')days(1);else if(a==='d3')days(3);else if(a==='rec')record();else if(a==='reset')reset();});
TB.forEach(tb=>setRust(tb.k,0));sync();render();renderNB();
};
/* =====================================================================
   تجارب الصف الثاني المتوسط (الفصل الدراسي الأول) — 3D
   ١٥) تأثير عدد مرات الري في نمو النبات (طبيعة العلم)
   ١٦) استكشاف موقع أثري والتنقيب عنه (طبيعة العلم)
   ١٧) الذائبية والمحاليل المشبعة وفوق المشبعة (المخاليط والمحاليل)
   ١٨) الكاشف الطبيعي والتعادل (المحاليل الحمضية والقاعدية)
   ===================================================================== */
const VIV=(c,op=.93)=>new THREE.MeshStandardMaterial({color:$lc(c),emissive:$lc(c),emissiveIntensity:.18,roughness:.22,transparent:true,opacity:op,depthWrite:false});
const vset=(m,h)=>{m.color.copy($lc(h));if(m.emissive)m.emissive.copy(m.color);};
function vivTube(t){t.g.traverse(x=>{if(x.isMesh&&x.material===G.glassT)x.material=G.glass;if(x.isMesh&&x.material===t.lm){x.material=VIV(0xd6ecf5,.6);t.lm=x.material;}});return t;}
function Beaker(r=.34,h=.62,o={}){const g=new THREE.Group();
  const gl=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,40,1,true),G.glass);gl.position.y=h/2;gl.renderOrder=3;
  const bt=new THREE.Mesh(new THREE.CircleGeometry(r,40),G.glassS);bt.rotation.x=-Math.PI/2;bt.position.y=.004;
  const lip=new THREE.Mesh(new THREE.TorusGeometry(r+.004,.012,8,40),G.glassS);lip.rotation.x=Math.PI/2;lip.position.y=h;
  const lm=VIV(o.col||0x6fb8e0,o.op||.9);const liq=new THREE.Mesh(new THREE.CylinderGeometry(r*.95,r*.95,1,36),lm);liq.renderOrder=1;liq.visible=false;
  g.add(gl,bt,lip,liq);
  for(let i=1;i<=4;i++){const t=new THREE.Mesh(new THREE.BoxGeometry(.06,.006,.004),KIT.mat(0x5d6d73));t.position.set(r*.55,h*i/5,r*.84);g.add(t);}
  const set=lv=>{liq.visible=lv>.003;liq.scale.y=Math.max(.001,lv);liq.position.y=lv/2+.006;};
  return {g,lm,set,r,h,liq};}
function Drops(L,n=26,col=0x8fd0ee,size=.018){const im=new THREE.InstancedMesh(new THREE.SphereGeometry(size,8,6),VIV(col,.95),n);im.count=0;im.frustumCulled=false;L.add(im);
  const d=new THREE.Object3D();let on=false,src=V(0,0,0),dst=0,t0=0;
  P3.loop(L,(dt,s)=>{if(!on){im.count=0;return;}im.count=n;for(let i=0;i<n;i++){const p=((s-t0)*1.6+i/n)%1;d.position.set(src.x+Math.sin(i*7)*.02,src.y-(src.y-dst)*p,src.z+Math.cos(i*5)*.02);d.scale.set(1,1.5,1);d.updateMatrix();im.setMatrixAt(i,d.matrix);}im.instanceMatrix.needsUpdate=true;});
  return {start:(p,y)=>{src=p.clone();dst=y;on=true;t0=performance.now()/1000;},stop:()=>{on=false;}};}

/* ---------- ١٥) الري ونمو النبات ---------- */
const PLNT={};EXP_MODS.plnt8=PLNT;
PLNT.init=function(){gm();
const H={a:[10.5,10.7,9.2,5.1],b:[10.3,11.2,12.0,12.4],c:[10.8,12.6,14.6,15.5]};
const PL=[{k:'a',n:'أ',w:'مرة واحدة عند بدء التجربة'},{k:'b',n:'ب',w:'يوميًّا'},{k:'c',n:'ج',w:'مرة واحدة أسبوعيًّا'}];
const CONS=['نوع النبات','حجم النبات','نوع التربة','كمية التربة','مقدار الإضاءة'];
const S={set:[0,0,0],kept:[],wk:0,rows:[],busy:false,vars:{},ok:false};P3.dbg.plnt8=S;
const NAMES=['حدّد جدول الري','ثبّت العوامل الأخرى','نفّذ التجربة شهرًا','حدّد المتغيرات'];
const VOPT={ind:'عدد مرات الري',dep:'طول النبات وحالة أوراقه',con:'نوع النبات والتربة والإضاءة'};
const sec=P3.section('plnt8',{title:'تأثير عدد مرات الري في نمو النبات',grade:'ثاني متوسط',lesson:'حل المشكلات بطريقة علمية',
  hud:`<div class="p3-row"><div class="p3-m warm"><small>الأسبوع</small><b class="plW">0 / 4</b></div></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">الري</span>${PL.map((p,i)=>`<button class="p3-b" data-w="${i}">💧 ${p.n}: ${p.w}</button>`).join('')}</div>
    <div class="p3-acts"><span class="p3-lab">الثوابت</span>${CONS.map((c,i)=>`<button class="p3-b" data-k="${i}">🔒 ${c}</button>`).join('')}</div>
    <div class="p3-acts"><span class="p3-lab">الزمن</span><button class="p3-b pri" data-a="wk">📅 نفّذ أسبوعًا وقِس الأطوال</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة التجربة</button></div></div>`,
  learn:`<div class="panel"><h3>السؤال</h3><p>هل تنمو النبتة أفضل عند ريّها مرة واحدة كل أسبوع؟</p></div>
    <div class="panel"><h3>التجربة المضبوطة</h3><p><b>المتغير المستقل:</b> العامل الذي نغيّره عمدًا = عدد مرات الري.</p><p><b>المتغير التابع:</b> ما نقيسه = طول النبات ولون أوراقه وعدد الأوراق الساقطة.</p><p><b>الثوابت:</b> عوامل تبقى كما هي: نوع النبات وحجمه، ونوع التربة وكميتها، ومقدار الإضاءة.</p></div>
    <div class="panel"><h3>النتيجة (الجدول 1 في الكتاب)</h3><p>النبات (أ) ذبلت أوراقه وقلّ طوله، و(ب) ذبلت معظم أوراقه، و(ج) نما جيدًا: المناسب لهذا النبات أن يُروى مرة واحدة كل أسبوع.</p></div>`,
  quiz:[{q:'المتغير المستقل في التجربة هو:',o:['طول النبات','عدد مرات الري','نوع التربة'],a:1},{q:'المتغير التابع هو:',o:['طول النبات وحالة أوراقه','مقدار الإضاءة','نوع النبات'],a:0},
    {q:'لماذا نثبّت نوع التربة وكميتها؟',o:['لنختبر متغيرًا واحدًا فقط','لتسريع النمو','لأنها لا تؤثر أبدًا'],a:0},{q:'أي نبات نما أفضل؟',o:['المروي مرة واحدة','المروي يوميًّا','المروي أسبوعيًّا'],a:2}],
  report:()=>({title:'تأثير عدد مرات الري في نمو النبات',grade:'ثاني متوسط',lesson:'حل المشكلات بطريقة علمية',cols:['الأسبوع','طول النبات أ (سم)','طول النبات ب (سم)','طول النبات ج (سم)'],
    rows:[1,2,3,4].map(w=>{const r=S.rows[w-1];return r?[String(w),r[0],r[1],r[2]]:[String(w),'','',''];}),note:'أي النباتات نما أفضل؟ وما المتغير المستقل والتابع والثوابت؟'})
});
const L=new Lab(sec,{target:V(0,.75,.4),dist:a=>Math.max(4.4,7.2/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);const SC=.06;
const terr=KIT.mat(0xb8643a,{roughness:.85}),soilM=KIT.mat(0x4a3424,{roughness:1}),stemM=KIT.mat(0x4f7d2a,{roughness:.7});
const P={};
PL.forEach((pl,i)=>{const x=-1.3+i*1.3,g=new THREE.Group();g.position.set(x,0,.35);
  const pot=new THREE.Mesh(new THREE.CylinderGeometry(.3,.22,.42,32),terr);pot.position.y=.21;const rim=new THREE.Mesh(new THREE.CylinderGeometry(.33,.33,.07,32),terr);rim.position.y=.41;
  const soil=new THREE.Mesh(new THREE.CylinderGeometry(.29,.29,.02,32),soilM.clone());soil.position.y=.43;
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(.016,.022,1,8),stemM);
  const leaves=[];for(let j=0;j<8;j++){const pv=new THREE.Group();const lm=KIT.mat(0x3f9b3a,{roughness:.55,side:THREE.DoubleSide});const lf=new THREE.Mesh(new THREE.SphereGeometry(.1,14,8),lm);lf.scale.set(1,.18,.48);lf.position.x=.1;pv.add(lf);
    pv.rotation.y=j*2.4;pv.userData={f:.25+.72*(j/7),side:j%2?1:-1,lm};leaves.push(pv);g.add(pv);}
  const fall=[];for(let j=0;j<6;j++){const m=new THREE.Mesh(new THREE.SphereGeometry(.07,10,6),KIT.mat(0x9a7b5c,{roughness:.9}));m.scale.set(1,.12,.5);m.position.set(-.45+j*.12*Math.cos(j),.012,.35+(j%3)*.1);m.rotation.y=j;m.visible=false;g.add(m);fall.push(m);}
  g.add(pot,rim,soil,stem);castAll(g);L.add(g);
  // المسطرة
  const rt=canvasTex(64,512,c=>{c.fillStyle='#f6e7b4';c.fillRect(0,0,64,512);c.fillStyle='#3b2f1e';c.font='600 20px "IBM Plex Mono",monospace';for(let k=0;k<=20;k++){const y=512-k*512/20;c.fillRect(0,y-1,k%5?18:34,2);if(k%5===0&&k)c.fillText(String(k),36,y+7);}});
  const ruler=new THREE.Mesh(new THREE.BoxGeometry(.07,20*SC,.015),[KIT.mat(0xe7d39a),KIT.mat(0xe7d39a),KIT.mat(0xe7d39a),KIT.mat(0xe7d39a),new THREE.MeshStandardMaterial({map:rt,roughness:.7}),KIT.mat(0xe7d39a)]);
  ruler.position.set(x+.42,.44+10*SC,.35);castAll(ruler);L.add(ruler);
  const card=P3.card([{t:'النبات ('+pl.n+')',s:60},{t:pl.w,s:40}],.9,.26);card.position.set(x,.06,1.05);card.rotation.x=-.95;L.add(card);
  P[pl.k]={g,stem,leaves,fall,soil,x,h:10,hl:1,wl:0};});
function setPlant(k,h,health,wilt){const o=P[k],Hs=h*SC;o.stem.scale.y=Hs;o.stem.position.y=.44+Hs/2;
  o.leaves.forEach(pv=>{const u=pv.userData;pv.position.y=.44+Hs*u.f;pv.rotation.z=u.side*(.35+wilt*1.05);pv.rotation.x=wilt*.4*u.side;
    u.lm.color.copy($lc(0x3f9b3a)).lerp($lc(0xb59a52),1-health);pv.scale.setScalar(.8+.4*u.f*(health*.5+.5));});}
function hState(k,w){return k==='a'?[1-Math.min(1,w/3.3),Math.min(1,Math.max(0,(w-1.3)/2.2))]:k==='b'?[1-Math.min(.62,w*.16),Math.min(.35,w*.09)]:[1,0];}
// إبريق الري
const can=new THREE.Group();{const b=new THREE.Mesh(new THREE.CylinderGeometry(.16,.18,.3,24),KIT.phys(0x2f8f6b));b.position.y=.15;const sp=new THREE.Mesh(new THREE.CylinderGeometry(.018,.03,.42,10),KIT.phys(0x2f8f6b));sp.rotation.z=-1.0;sp.position.set(.28,.22,0);
  const hd=new THREE.Mesh(new THREE.TorusGeometry(.1,.018,8,20,Math.PI),KIT.phys(0x2f8f6b));hd.position.set(-.1,.3,0);hd.rotation.z=.6;can.add(b,sp,hd);castAll(can);}
const CAN_HOME=V(2.4,0,.6);can.position.copy(CAN_HOME);L.add(can);const drops=Drops(L,22,0x3f9fe0,.022);
async function water(i){const o=P[PL[i].k];await L.arc(can,V(o.x-.55,.95,.35),700,1.4);await L.tw(250,k=>can.rotation.z=-.7*k);drops.start(V(o.x-.18,1.05,.35),.46);
  o.soil.material.color.copy($lc(0x2e2016));await sleep(650);drops.stop();await L.tw(250,k=>can.rotation.z=-.7*(1-k));}
async function setW(i){if(S.busy||S.set[i])return;S.busy=true;sync();await water(i);await L.arc(can,CAN_HOME,600,1.4);S.set[i]=1;S.busy=false;P3.click();
  if(S.set.every(Boolean))toast('حُدّد جدول ري كل نبات: هذا هو المتغير المستقل.');sync();render();}
function keep(i){if(S.busy||!S.set.every(Boolean))return;if(!S.kept.includes(i))S.kept.push(i);P3.click();if(S.kept.length===CONS.length)toast('ثُبّتت العوامل الخمسة: نختبر الآن متغيرًا واحدًا فقط.');sync();render();}
async function week(){if(S.busy||S.kept.length<CONS.length||S.wk>=4)return;S.busy=true;sync();const w0=S.wk,w1=w0+1;
  const who=w0===0?[0,1,2]:[1,2];for(const i of who){await water(i);}await L.arc(can,CAN_HOME,500,1.4);
  await L.tw(1600,k=>{PL.forEach(pl=>{const h0=w0?H[pl.k][w0-1]:10,h1=H[pl.k][w0];const [he,wi]=hState(pl.k,w0+k);setPlant(pl.k,h0+(h1-h0)*k,he,wi);});sec.$('.plW').textContent=(w0+k).toFixed(1)+' / 4';});
  S.wk=w1;sec.$('.plW').textContent=w1+' / 4';PL.forEach(pl=>{const o=P[pl.k];const nf=pl.k==='a'?Math.floor(Math.max(0,w1-1)*1.4):pl.k==='b'?Math.floor(w1*.7):0;o.fall.forEach((m,j)=>m.visible=j<nf);});
  S.rows.push([H.a[w0].toFixed(1),H.b[w0].toFixed(1),H.c[w0].toFixed(1)]);P3.good();toast(`الأسبوع ${w1}: قِيست الأطوال بالمسطرة وسُجّلت في الدفتر.`);S.busy=false;sync();render();renderNB();}
function reset(){if(S.busy)return;Object.assign(S,{set:[0,0,0],kept:[],wk:0,rows:[],vars:{},ok:false});PL.forEach(pl=>{setPlant(pl.k,10,1,0);P[pl.k].fall.forEach(m=>m.visible=false);P[pl.k].soil.material.color.copy($lc(0x4a3424));});sec.$('.plW').textContent='0 / 4';sync();render();renderNB();toast('أُعيدت التجربة.');}
function stepIdx(){if(!S.set.every(Boolean))return 0;if(S.kept.length<CONS.length)return 1;if(S.wk<4)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='حدّد جدول الري';html=`<p class="p3-txt">ثلاثة أصص متماثلة فيها النوع نفسه من النبات. حدّد طريقة ري كل نبات من لوحة التحكم: هذا هو <b>المتغير المستقل</b>.</p>`;}
  else if(k===1){title='ثبّت العوامل الأخرى';html=`<p class="p3-txt">حتى نختبر متغيرًا واحدًا فقط، يجب أن تبقى العوامل الأخرى متساوية: اضغط على كل عامل لتثبيته (${S.kept.length} / ${CONS.length}).</p>`;}
  else if(k===2){title='نفّذ التجربة شهرًا كاملًا';html=`<p class="p3-txt">في كل أسبوع يُروى كل نبات حسب جدوله، ثم يُقاس طوله بالمسطرة (<b>المتغير التابع</b>). لاحظ لون الأوراق والأوراق الساقطة.</p>`;}
  else if(!S.ok){title='حدّد المتغيرات';html=`<table class="p3-t"><tbody>${[['ind','المتغير المستقل'],['dep','المتغير التابع'],['con','الثوابت']].map(([id,lab])=>`<tr><td>${lab}</td><td>${KIT.sel(id,'v',VOPT,S.vars[id]||'',lab)}</td></tr>`).join('')}</tbody></table><div class="p3-acts"><button class="p3-b pri" data-a="chk">تحقق</button></div>`;}
  else{title='الاستنتاج';html=`<p class="p3-ok">النبات (أ) ذبل وقلّ طوله، و(ب) ذبلت معظم أوراقه، و(ج) نما جيدًا وأوراقه نضرة: المناسب لهذا النبات – في هذه الظروف – أن يُروى <b>مرة واحدة كل أسبوع</b>.</p>`;}
  sec.steps(NAMES,k,title,html);
  sec.$$('.p3-card select').forEach(s=>s.onchange=()=>S.vars[s.dataset.id]=s.value);
  const c=sec.$('.p3-card [data-a="chk"]');if(c)c.onclick=()=>{if(S.vars.ind==='ind'&&S.vars.dep==='dep'&&S.vars.con==='con'){S.ok=true;P3.good();render();}else toast('راجع: ما الذي غيّرناه عمدًا؟ وما الذي قسناه؟ وما الذي أبقيناه متساويًا؟');};}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>الأسبوع</th><th>أ (سم)</th><th>ب (سم)</th><th>ج (سم)</th></tr></thead><tbody>${[1,2,3,4].map(w=>{const r=S.rows[w-1];return `<tr><td>${w}</td>${r?r.map(v=>`<td>${v}</td>`).join(''):'<td>—</td><td>—</td><td>—</td>'}</tr>`;}).join('')}</tbody></table>`;}
function sync(){const b=S.busy;sec.$$('[data-w]').forEach(x=>{const i=+x.dataset.w;x.disabled=b||S.set[i];x.classList.toggle('done',!!S.set[i]);});
  sec.$$('[data-k]').forEach(x=>{const i=+x.dataset.k;x.disabled=b||!S.set.every(Boolean)||S.kept.includes(i);x.classList.toggle('done',S.kept.includes(i));});
  const w=sec.$('[data-a="wk"]');w.disabled=b||S.kept.length<CONS.length||S.wk>=4;sec.$('[data-a="reset"]').disabled=b;}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;if(x.dataset.w)setW(+x.dataset.w);else if(x.dataset.k)keep(+x.dataset.k);else if(x.dataset.a==='wk')week();else if(x.dataset.a==='reset')reset();});
PL.forEach(pl=>setPlant(pl.k,10,1,0));sync();render();renderNB();
};

/* ---------- ١٦) التنقيب عن الآثار ---------- */
const DIG={};EXP_MODS.dig8=DIG;
DIG.init=function(){gm();
const COLS=7,ROWS=4,CW=.42,ROWN=['أ','ب','ج','د'];
const ART=[{c:1,r:1,k:'pot',n:'إناء فخاري'},{c:5,r:2,k:'bone',n:'عظام'},{c:6,r:0,k:'axe',n:'أداة حجرية'},{c:3,r:3,k:'ring',n:'حُلي'}];
const S={ph:0,scan:0,stakes:[],dug:{},photo:false,moved:false,busy:false};P3.dbg.dig8=S;
const NAMES=['الكشف بالرادار','رسم الخريطة','التنقيب البطيء','التصوير والتوثيق','النقل إلى المختبر'];
const sec=P3.section('dig8',{title:'استكشاف موقع أثري والتنقيب عنه',grade:'ثاني متوسط',lesson:'أسلوب العلم',
  hud:`<div class="p3-row"><div class="p3-m warm"><small>القطع المكتشفة</small><b class="dgN">0 / 4</b></div></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><button class="p3-b pri" data-a="scan">📡 مرّر الرادار على الصف التالي</button></div>
    <div class="p3-acts"><span class="p3-lab">الخريطة</span><span class="p3-txt" style="font-size:.8rem">اضغط على كل إشارة حمراء في الموقع لتثبيت وتد مرقّم.</span></div>
    <div class="p3-acts"><span class="p3-lab">التنقيب</span><span class="p3-txt" style="font-size:.8rem">اضغط على المربع الموتّد ثلاث مرات (ثلاث طبقات).</span></div>
    <div class="p3-acts"><button class="p3-b" data-a="photo">📷 صوّر القطع في مواقعها</button><button class="p3-b" data-a="move">🧺 رقّمها وانقلها إلى المختبر</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة التجربة</button></div></div>`,
  learn:`<div class="panel"><h3>مراحل استكشاف الموقع الأثري</h3><p><b>١. المسح بالرادار:</b> يكشف ما في باطن الأرض دون حفر.</p><p><b>٢. رسم الخريطة:</b> تُقسَّم المنطقة بشبكة، ويُسجَّل الموقع الدقيق لكل قطعة قبل نقلها.</p><p><b>٣. التنقيب البطيء:</b> بالفرشاة والأدوات الدقيقة حتى لا تتلف القطع.</p><p><b>٤. التصوير:</b> يوثّق موقع القطعة واتجاهها.</p><p><b>٥. العمل المختبري:</b> تنظيف القطع وتحليلها كيميائيًّا لتقدير أعمارها.</p></div>`,
  quiz:[{q:'لماذا يُرسم موقع كل قطعة على خريطة قبل نقلها؟',o:['لحفظ معلومات موقعها بعد التنقيب','لزيادة وزنها','لتلوينها'],a:0},{q:'ما فائدة الرادار؟',o:['الكشف عمّا في باطن الأرض دون حفر','تنظيف القطع','تقدير العمر'],a:0},
    {q:'لماذا يكون التنقيب بطيئًا بالفرشاة؟',o:['حتى لا تتلف القطع','لأنه أسهل','لإخفاء القطع'],a:0},{q:'أين تُقدَّر أعمار القطع؟',o:['في المختبر بالتحاليل الكيميائية','في الموقع بالعين','بالرادار'],a:0}],
  report:()=>({title:'استكشاف موقع أثري والتنقيب عنه',grade:'ثاني متوسط',lesson:'أسلوب العلم',cols:['رقم الوتد','القطعة','الموقع (العمود/الصف)','الحالة'],
    rows:S.stakes.length?S.stakes.map((a,i)=>[String(i+1),S.dug[a.c+'_'+a.r]>=3?a.n:'لم تُكتشف بعد',`العمود ${a.c+1} / الصف ${ROWN[a.r]}`,S.moved?'نُقلت إلى المختبر':S.photo?'صُوّرت في موقعها':S.dug[a.c+'_'+a.r]>=3?'مكشوفة':'تحت التربة']):[['1','','','']],note:'لماذا سجّلنا موقع كل قطعة قبل نقلها؟'})
});
const L=new Lab(sec,{target:V(0,.2,.45),dist:a=>Math.max(3.4,5.6/a),exposure:1});buildRoom(L);
{const hi=()=>{const d=L.distFn(L.camera.aspect||1.5);L.camHome.set(0,.2+d*.78,.45+d*.66);};const _rs=L.resize.bind(L);L.resize=function(){_rs();hi();};let done=0;P3.loop(L,()=>{if(!done&&L.camSet){hi();L.camera.position.copy(L.camHome);done=1;}});}
const toast=m=>L.toast(m);
const BOX=new THREE.Group();BOX.position.set(0,0,.35);L.add(BOX);
const W=COLS*CW,D=ROWS*CW;const wood=KIT.wood(0x8a5a32);
[[0,-D/2-.04,W+.16,.08],[0,D/2+.04,W+.16,.08]].forEach(([x,z,w,d])=>{const m=new THREE.Mesh(RBox(w,.34,d,.02),wood);m.position.set(x,.17,z);BOX.add(m);});
[[-W/2-.04,0],[W/2+.04,0]].forEach(([x,z])=>{const m=new THREE.Mesh(RBox(.08,.34,D,.02),wood);m.position.set(x,.17,z);BOX.add(m);});
const base=new THREE.Mesh(new THREE.BoxGeometry(W,.04,D),KIT.mat(0x3a2818,{roughness:1}));base.position.y=.02;BOX.add(base);
const sandT=noiseTex(256,256,'#b98a52',.22,6000,[1,1]);
const cellX=c=>-W/2+CW*(c+.5),cellZ=r=>-D/2+CW*(r+.5);
const CELL={};for(let c=0;c<COLS;c++)for(let r=0;r<ROWS;r++){const m=new THREE.Mesh(new THREE.BoxGeometry(CW-.004,1,CW-.004),new THREE.MeshStandardMaterial({map:sandT,color:0xc98f55,roughness:1}));
  m.position.set(cellX(c),.04+.13,cellZ(r));m.scale.y=.26;m.receiveShadow=true;BOX.add(m);CELL[c+'_'+r]=m;L.onTap(m,()=>tapCell(c,r));}
const strM=KIT.mat(0xf3efe2,{roughness:.8});for(let c=0;c<=COLS;c++){const s=new THREE.Mesh(new THREE.BoxGeometry(.008,.008,D),strM);s.position.set(-W/2+c*CW,.33,0);BOX.add(s);}
for(let r=0;r<=ROWS;r++){const s=new THREE.Mesh(new THREE.BoxGeometry(W,.008,.008),strM);s.position.set(0,.33,-D/2+r*CW);BOX.add(s);}
for(let c=0;c<COLS;c++){const t=P3.card([{t:String(c+1),s:230,mono:true}],.2,.15);t.position.set(cellX(c),.36,-D/2-.16);t.rotation.x=-.6;BOX.add(t);}
for(let r=0;r<ROWS;r++){const t=P3.card([{t:ROWN[r],s:230}],.18,.15);t.position.set(W/2+.18,.36,cellZ(r));t.rotation.x=-.6;BOX.add(t);}
// القطع الأثرية
function makeArt(k){const g=new THREE.Group();
  if(k==='pot'){const pts=[];for(let i=0;i<=10;i++){const t=i/10;pts.push(new THREE.Vector2(.05+.07*Math.sin(t*Math.PI)+.02*t,t*.16));}const m=new THREE.Mesh(new THREE.LatheGeometry(pts,24),KIT.mat(0xa4532e,{roughness:.85,side:THREE.DoubleSide}));g.add(m);}
  else if(k==='bone'){const m=KIT.mat(0xece2c6,{roughness:.8});const sh=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.26,10),m);sh.rotation.z=Math.PI/2;g.add(sh);[-.13,.13].forEach(x=>[-.02,.02].forEach(z=>{const b=new THREE.Mesh(new THREE.SphereGeometry(.03,10,8),m);b.position.set(x,0,z);g.add(b);}));g.position.y=.03;}
  else if(k==='axe'){const m=new THREE.Mesh(new THREE.ConeGeometry(.07,.2,5),KIT.mat(0x6b6f72,{roughness:.9}));m.rotation.z=Math.PI/2;m.scale.set(1,1,.45);g.add(m);g.position.y=.035;}
  else{const m=new THREE.Mesh(new THREE.TorusGeometry(.05,.013,10,28),KIT.mat(0xd4a838,{metalness:.9,roughness:.25}));m.rotation.x=Math.PI/2;g.add(m);g.position.y=.015;}
  castAll(g);return g;}
const AR=ART.map(a=>{const g=makeArt(a.k);g.scale.multiplyScalar(1.5);const o=new THREE.Group();o.add(g);o.position.set(cellX(a.c),.045,cellZ(a.r));BOX.add(o);return {a,o};});
// الرادار والإشارات والأوتاد
const radar=new THREE.Group();{const b=new THREE.Mesh(RBox(.5,.08,.3,.03),KIT.phys(0xf2c230));const sc=new THREE.Mesh(new THREE.PlaneGeometry(.3,.16),new THREE.MeshBasicMaterial({color:0x0c3b2a}));sc.rotation.x=-Math.PI/2;sc.position.set(0,.042,0);
  const h=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.8,8),M.steel);h.rotation.z=.5;h.position.set(-.3,.35,0);radar.add(b,sc,h);castAll(radar);}
radar.position.set(-W/2-.45,.42,.35);L.add(radar);
const sig={};ART.forEach(a=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.05,16,12),new THREE.MeshBasicMaterial({color:0xff3b30}));m.position.set(cellX(a.c),.42,cellZ(a.r));m.visible=false;BOX.add(m);sig[a.c+'_'+a.r]=m;L.onTap(m,()=>tapCell(a.c,a.r));});
P3.loop(L,(dt,s)=>{Object.values(sig).forEach(m=>{if(m.visible)m.scale.setScalar(1+.25*Math.sin(s*6));});});
function stake(a,num){const g=new THREE.Group();const p=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.42,8),KIT.wood(0xb08050));p.position.y=.21;const fl=P3.card([{t:String(num),s:90,mono:true}],.11,.09,{bd:'#b91c1c'});fl.position.set(.06,.38,0);g.add(p,fl);castAll(g);
  g.position.set(cellX(a.c)-CW/2+.04,.04,cellZ(a.r)-CW/2+.04);BOX.add(g);return g;}
const tray=new THREE.Group();{const t=new THREE.Mesh(RBox(1.0,.06,.55,.02),KIT.mat(0xf2f0ea));t.position.y=.03;tray.add(t);castAll(tray);}tray.position.set(2.45,0,.6);L.add(tray);
const trayCard=P3.card([{t:'إلى المختبر',s:70}],.6,.16);trayCard.position.set(2.45,.07,1.0);trayCard.rotation.x=-.9;L.add(trayCard);
async function scan(){if(S.busy||S.scan>=ROWS)return;S.busy=true;sync();const r=S.scan,z=.35+cellZ(r);
  await L.move(radar,V(-W/2-.2,.42,z),500);await L.move(radar,V(W/2+.2,.42,z),1600);
  ART.filter(a=>a.r===r).forEach(a=>{sig[a.c+'_'+a.r].visible=true;P3.tone(880,.08,'sine',.06);});
  S.scan++;if(S.scan>=ROWS){await L.move(radar,V(-W/2-.45,.42,.35),600);S.ph=1;toast('اكتمل المسح: أربع إشارات حمراء. ثبّت وتدًا مرقّمًا عند كل إشارة.');}S.busy=false;sync();render();}
async function tapCell(c,r){if(S.busy)return;const key=c+'_'+r,a=ART.find(x=>x.c===c&&x.r===r);
  if(S.ph===1){if(!a||!sig[key].visible){toast('ثبّت الأوتاد عند الإشارات الحمراء فقط.');return;}sig[key].visible=false;S.stakes.push(a);stake(a,S.stakes.length);P3.click();toast(`الوتد ${S.stakes.length}: العمود ${c+1} / الصف ${ROWN[r]} — سُجّل في الخريطة.`);
    if(S.stakes.length===ART.length){S.ph=2;toast('رُسمت الخريطة. نقّب الآن ببطء في المربعات الموتّدة.');}sync();render();renderNB();return;}
  if(S.ph===2){if(!a){toast('نقّب في المربعات الموتّدة فقط حتى لا تتلف الموقع.');return;}const d=S.dug[key]||0;if(d>=3)return;S.busy=true;const m=CELL[key],s0=m.scale.y,s1=.26-.08*(d+1);
    P3.noise(.25,.25,1800,.6);await L.tw(450,k=>{m.scale.y=s0+(s1-s0)*k;m.position.y=.04+m.scale.y/2;});S.dug[key]=d+1;
    if(d+1>=3){m.visible=false;toast(`ظهرت القطعة: ${a.n}`);P3.good();}S.busy=false;const n=ART.filter(x=>(S.dug[x.c+'_'+x.r]||0)>=3).length;sec.$('.dgN').textContent=n+' / 4';
    if(n===ART.length){S.ph=3;toast('كُشفت القطع الأربع دون أن تتلف. صوّرها في مواقعها قبل نقلها.');}sync();render();renderNB();}}
async function photo(){if(S.busy||S.ph!==3)return;S.busy=true;sync();const fl=new THREE.PointLight(0xffffff,0,10);fl.position.set(0,2.2,1.4);L.scene.add(fl);
  for(let i=0;i<ART.length;i++){P3.noise(.08,.5,3000,1);await L.tw(220,k=>fl.intensity=6*Math.sin(Math.PI*k));await sleep(150);}L.scene.remove(fl);S.photo=true;S.ph=4;S.busy=false;toast('وُثّق موقع كل قطعة واتجاهها بالصور.');sync();render();renderNB();}
async function move(){if(S.busy||S.ph!==4)return;S.busy=true;sync();for(let i=0;i<AR.length;i++){const {o}=AR[i];const wp=new THREE.Vector3();o.getWorldPosition(wp);BOX.remove(o);o.position.copy(wp);L.scene.add(o);
  await L.arc(o,V(2.1+(i%2)*.4,.07,.45+Math.floor(i/2)*.28),900,1.2);}S.moved=true;S.ph=5;S.busy=false;P3.good();toast('رُقّمت القطع ونُقلت إلى المختبر لتنظيفها وتحليلها كيميائيًّا وتقدير أعمارها.');sync();render();renderNB();}
function reset(){location.hash='dig8';location.reload();}
function stepIdx(){return Math.min(S.ph,4);}
function render(){const k=stepIdx();let title,html;
  if(S.ph===0){title='الكشف بالرادار قبل الحفر';html=`<p class="p3-txt">قُسّم الموقع بشبكة من الخيوط (٧ أعمدة × ٤ صفوف). مرّر جهاز الرادار على الصفوف واحدًا بعد الآخر (${S.scan} / ${ROWS})، وراقب الإشارات.</p>`;}
  else if(S.ph===1){title='ارسم خريطة الموقع';html=`<p class="p3-txt">اضغط على كل إشارة حمراء لتثبيت وتد مرقّم، ويُسجَّل موقعها الدقيق (العمود والصف) في الدفتر قبل أي حفر (${S.stakes.length} / ${ART.length}).</p>`;}
  else if(S.ph===2){title='نقّب ببطء بالفرشاة';html=`<p class="p3-txt">اضغط على كل مربع موتّد ثلاث مرات لإزالة ثلاث طبقات من التربة بهدوء، حتى تنكشف القطعة دون أن تتلف.</p>`;}
  else if(S.ph===3){title='صوّر القطع في مواقعها';html=`<p class="p3-txt">قبل نقل أي قطعة، صوّرها لتوثيق موقعها واتجاهها.</p>`;}
  else if(S.ph===4){title='رقّم القطع وانقلها';html=`<p class="p3-txt">رقّم القطع ثم انقلها بحرص إلى المختبر لتنظيفها وإجراء التحاليل الكيميائية لتقدير أعمارها.</p>`;}
  else{title='الاستنتاج';html=`<p class="p3-ok">كشف <b>الرادار</b> مواقع القطع دون حفر، و<b>الخريطة</b> سجّلت الموقع الدقيق لكل قطعة، و<b>التنقيب البطيء</b> حافظ عليها، و<b>التصوير</b> وثّق موقعها واتجاهها، ثم يقدّر <b>العمل المختبري</b> أعمارها. العمل الميداني والمختبري كلاهما مهم.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>الوتد</th><th>الموقع</th><th>القطعة</th><th>الحالة</th></tr></thead><tbody>${S.stakes.length?S.stakes.map((a,i)=>{const d=S.dug[a.c+'_'+a.r]||0;return `<tr><td>${i+1}</td><td>ع${a.c+1} / ${ROWN[a.r]}</td><td>${d>=3?a.n:'—'}</td><td>${S.moved?'في المختبر':S.photo?'مصوّرة':d>=3?'مكشوفة':d?'طبقة '+d+' / 3':'تحت التربة'}</td></tr>`;}).join(''):'<tr><td colspan="4">—</td></tr>'}</tbody></table>`;}
function sync(){const b=S.busy;sec.$('[data-a="scan"]').disabled=b||S.scan>=ROWS;sec.$('[data-a="scan"]').classList.toggle('done',S.scan>=ROWS);sec.$('[data-a="photo"]').disabled=b||S.ph!==3;sec.$('[data-a="move"]').disabled=b||S.ph!==4;sec.$('[data-a="reset"]').disabled=b;}
S._tap=tapCell;sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const a=x.dataset.a;if(a==='scan')scan();else if(a==='photo')photo();else if(a==='move')move();else if(a==='reset')reset();});
sync();render();renderNB();
};

/* ---------- ١٧) الذائبية والمحاليل المشبعة ---------- */
const SOL8={};EXP_MODS.sol8=SOL8;
SOL8.init=function(){gm();
const CURVE=[[0,179],[20,200],[25,204],[40,238],[60,287],[80,362],[100,487]];
const sol=T=>{for(let i=1;i<CURVE.length;i++)if(T<=CURVE[i][0]){const a=CURVE[i-1],b=CURVE[i];return a[1]+(b[1]-a[1])*(T-a[0])/(b[0]-a[0]);}return 487;};
const S={added:0,temp:25,heat:0,cool:0,sup:0,seed:0,cry:0,busy:false,rows:[]};P3.dbg.sol8=S;
const NAMES=['أضف السكر حتى الإشباع','سخّن المحلول','برّد ببطء','أسقط بلورة'];
const sec=P3.section('sol8',{title:'الذائبية: محلول مشبع وغير مشبع وفوق مشبع',grade:'ثاني متوسط',lesson:'المحاليل والذائبية',
  hud:`<div class="p3-row"><div class="p3-m warm"><small>درجة الحرارة</small><b class="slT">25 °C</b></div><div class="p3-m"><small>السكر المضاف</small><b class="slA">0 g</b></div><div class="p3-m"><small>الذائب</small><b class="slD">0 g</b></div><div class="p3-m warm"><small>الحالة</small><b class="slS">غير مشبع</b></div></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-lab">السكر</span><button class="p3-b pri" data-a="add">🥄 أضف ملعقة (50 g)</button></div>
    <div class="p3-acts"><span class="p3-lab">الحرارة</span><button class="p3-b" data-a="heat">🔥 سخّن إلى 60 °C</button><button class="p3-b" data-a="cool">❄ برّد ببطء</button></div>
    <div class="p3-acts"><span class="p3-lab">البلورة</span><button class="p3-b" data-a="seed">💎 أسقط بلورة سكر</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة التجربة</button></div></div>
    <div class="p3-box"><h4 class="p3-h">منحنى ذائبية السكر</h4><div class="slChart"></div></div>`,
  learn:`<div class="panel"><h3>الذائبية</h3><p>كمية المادة التي يمكن إذابتها في 100 جرام من المذيب عند درجة حرارة معينة. يذوب 204 جرامات من السكر في 100 جرام ماء عند 25°س.</p></div>
    <div class="panel"><h3>أنواع المحاليل</h3><p><b>غير المشبع:</b> يستطيع إذابة المزيد من المذاب.</p><p><b>المشبع:</b> يحتوي على كل ما يمكن إذابته في الظروف المتاحة.</p><p><b>فوق المشبع:</b> عند تبريد محلول مشبع ببطء تبقى كمية مذابة تزيد على حد الإشباع لبعض الوقت، وتتبلور عند إسقاط بلورة صغيرة (التبلور عملية فيزيائية).</p></div>`,
  quiz:[{q:'كم جرامًا من السكر يذوب في 100 جم ماء عند 25°س؟',o:['50','204','487'],a:1},{q:'ماذا يحدث لذائبية السكر عند التسخين؟',o:['تزداد','تقل','لا تتغير'],a:0},
    {q:'محلول فيه 150 جم سكر في 100 جم ماء عند 25°س هو:',o:['مشبع','غير مشبع','فوق مشبع'],a:1},{q:'عملية ترسّب المذاب في صورة بلورات تسمى:',o:['التبلور','الترسيب الكيميائي','التبخر'],a:0}],
  report:()=>({title:'الذائبية والمحاليل المشبعة',grade:'ثاني متوسط',lesson:'المحاليل والذائبية',cols:['المرحلة','درجة الحرارة (°س)','السكر المضاف (جم)','الذائب (جم)','نوع المحلول'],
    rows:S.rows.length?S.rows:[['','','','','']],note:'كيف تؤثر درجة الحرارة في ذائبية السكر؟'})
});
const L=new Lab(sec,{target:V(-.3,.5,.45),dist:a=>Math.max(3.0,4.9/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
const hp=new THREE.Group();{const b=new THREE.Mesh(RBox(.95,.16,.8,.04),KIT.mat(0xe9ecee,{roughness:.4}));b.position.y=.08;const p=new THREE.Mesh(new THREE.CylinderGeometry(.36,.36,.02,32),KIT.mat(0x30363c,{metalness:.5}));p.position.y=.17;
  const k=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.04,16),KIT.mat(0x1f2933));k.rotation.x=Math.PI/2;k.position.set(.3,.08,.41);hp.add(b,p,k);hp.userData.p=p;castAll(hp);}
hp.position.set(0,0,.4);L.add(hp);
const BK=Beaker(.32,.6,{op:.55});BK.g.position.set(0,.18,.4);BK.set(.3);L.add(BK.g);
const card=P3.card([{t:'100 جم ماء',s:64}],.5,.16);card.position.set(0,.06,1.05);card.rotation.x=-.9;L.add(card);
const th=new THREE.Group();{const t=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.9,10),G.glassS);t.position.y=.45;const r=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,1,8),KIT.mat(0xd62d20));th.userData.r=r;const bl=new THREE.Mesh(new THREE.SphereGeometry(.02,12,8),KIT.mat(0xd62d20));bl.position.y=.02;th.add(t,r,bl);}
th.position.set(.15,.2,.35);th.rotation.z=-.12;L.add(th);
const setTh=T=>{const h=.15+.6*T/100;th.userData.r.scale.y=h;th.userData.r.position.y=h/2;};
const pile=new THREE.Mesh(new THREE.ConeGeometry(.2,.1,24),KIT.mat(0xfbfbf7,{roughness:.9}));pile.position.set(0,.24,.4);pile.visible=false;pile.renderOrder=2;L.add(pile);
const CR=new THREE.InstancedMesh(new THREE.BoxGeometry(.03,.03,.03),KIT.phys(0xffffff,{roughness:.15,transparent:true,opacity:.9}),40);CR.count=0;CR.renderOrder=2;CR.position.set(0,.18,.4);L.add(CR);
const spoon=new THREE.Group();{const h=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.5,8),M.steel);h.rotation.z=Math.PI/2;h.position.x=.25;const b=new THREE.Mesh(new THREE.SphereGeometry(.06,16,10,0,Math.PI*2,Math.PI/2,Math.PI/2),M.steel);const s=new THREE.Mesh(new THREE.SphereGeometry(.05,12,8),KIT.mat(0xffffff,{roughness:.9}));s.scale.y=.4;s.position.y=-.01;spoon.add(h,b,s);spoon.userData.s=s;castAll(spoon);}
const SP_HOME=V(-1.1,.3,.7);spoon.position.copy(SP_HOME);L.add(spoon);
const jar=new THREE.Group();{const j=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.36,24),KIT.phys(0xf5f5f0,{transparent:true,opacity:.6}));j.position.y=.18;const s=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.28,24),KIT.mat(0xffffff,{roughness:.95}));s.position.y=.14;const l=new THREE.Mesh(new THREE.CylinderGeometry(.19,.19,.05,24),KIT.mat(0x2f6fb2));l.position.y=.38;jar.add(j,s,l);castAll(jar);}
jar.position.set(-1.25,0,.35);L.add(jar);const jc=P3.card([{t:'سكر',s:70}],.3,.12);jc.position.set(-1.25,.2,.54);L.add(jc);
function state(){const cap=sol(S.temp);const dis=S.seed?S.added-S.cry:(S.sup&&S.cool?S.added:Math.min(S.added,cap));const und=S.added-dis;
  const st=S.added===0?'غير مشبع':(S.sup&&S.cool&&!S.seed&&S.added>cap+1)?'فوق مشبع':(und>.5||Math.abs(dis-cap)<1)?'مشبع':'غير مشبع';return {cap,dis,und,st};}
function hud(){const s=state();sec.$('.slT').textContent=Math.round(S.temp)+' °C';sec.$('.slA').textContent=S.added+' g';sec.$('.slD').textContent=Math.round(s.dis)+' g';sec.$('.slS').textContent=s.st;
  pile.visible=s.und>.5&&!S.seed;if(pile.visible){const k=Math.sqrt(s.und/50);pile.scale.set(k,k,k);pile.position.y=.19+.05*k;}
  vset(BK.lm,mixHex(0x3f9bd8,0xc99a3e,Math.min(1,s.dis/300)));setTh(S.temp);
  sec.$('.slChart').innerHTML=KIT.chart({w:330,h:200,xl:'درجة الحرارة (°س)',yl:'جم/100 جم ماء',xmin:0,xmax:100,ymin:0,ymax:500,series:[{c:'var(--brand)',name:'منحنى الذائبية',pts:CURVE},{c:'#e0473c',name:'محلولك',pts:[[S.temp,Math.round(s.dis)]],dots:true}]});}
function rec(lbl){const s=state();S.rows.push([lbl,String(Math.round(S.temp)),String(S.added),String(Math.round(s.dis)),s.st]);renderNB();}
async function add(){if(S.busy||S.added>=250||S.heat)return;S.busy=true;sync();await L.arc(spoon,V(-1.25,.55,.35),500,.7);spoon.userData.s.visible=true;await L.arc(spoon,V(-.12,.95,.4),700,1.1);
  await L.tw(300,k=>spoon.rotation.x=-1.6*k);spoon.userData.s.visible=false;S.added+=50;await L.tw(700,k=>{});hud();await L.tw(300,k=>spoon.rotation.x=-1.6*(1-k));await L.arc(spoon,SP_HOME,500,1.1);
  const s=state();S.busy=false;toast(s.und>.5?`بقي ${Math.round(s.und)} g لم يذب في القعر: المحلول مشبع.`:`ذاب السكر كله (${S.added} g).`);if(s.und>.5&&!S.rows.length)rec('عند 25°س');sync();render();}
async function heat(){if(S.busy||state().und<.5||S.heat)return;S.busy=true;S.heat=1;sync();hp.userData.p.material.emissive=$lc(0xff4d00);hp.userData.p.material.emissiveIntensity=.6;
  await L.tw(3000,k=>{S.temp=25+35*k;hud();});S.sup=1;hp.userData.p.material.emissiveIntensity=0;rec('بعد التسخين');S.busy=false;toast('عند 60°س زادت الذائبية إلى نحو 287 g فذاب السكر كله: المحلول غير مشبع.');sync();render();}
async function cool(){if(S.busy||!S.sup||S.cool)return;S.busy=true;S.cool=1;sync();await L.tw(3600,k=>{S.temp=60-35*k;hud();});rec('بعد التبريد البطيء');S.busy=false;toast('برد المحلول إلى 25°س ولم يترسب شيء: فيه 250 g والحد 204 g فقط.');sync();render();}
async function seed(){if(S.busy||!S.cool||S.seed)return;S.busy=true;S.seed=1;sync();const d=new THREE.Object3D();
  await L.tw(3000,k=>{S.cry=46*k;const n=Math.floor(40*k);CR.count=n;for(let i=0;i<n;i++){const a=i*2.4,r=.04+(i%6)*.035;d.position.set(Math.cos(a)*r,.03+(i%4)*.025,Math.sin(a)*r);d.rotation.set(i,i*2,i);d.scale.setScalar(.6+.8*k);d.updateMatrix();CR.setMatrixAt(i,d.matrix);}CR.instanceMatrix.needsUpdate=true;hud();});
  rec('بعد إسقاط البلورة');P3.good();S.busy=false;toast('تبلور الزائد (46 g) على البلورة: عاد المحلول مشبعًا.');sync();render();}
function reset(){if(S.busy)return;Object.assign(S,{added:0,temp:25,heat:0,cool:0,sup:0,seed:0,cry:0,rows:[]});CR.count=0;hud();sync();render();renderNB();toast('أُعيدت التجربة.');}
function stepIdx(){if(state().und<.5&&!S.sup)return 0;if(!S.sup)return 1;if(!S.cool)return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='أضف السكر حتى الإشباع';html=`<p class="p3-txt">في الكأس 100 جم ماء عند 25°س. أضف السكر ملعقة بعد ملعقة (الملعقة = 50 جم) حتى يبقى سكر لا يذوب في القعر.</p>`;}
  else if(k===1){title='المحلول مشبع… سخّنه';html=`<p class="p3-txt">بقي سكر في القعر؛ فالمحلول <b>مشبع</b> عند 25°س. سخّن المحلول إلى 60°س ولاحظ.</p>`;}
  else if(k===2){title='برّد ببطء دون تحريك';html=`<p class="p3-txt">ذاب السكر كله؛ المحلول <b>غير مشبع</b> عند 60°س. برّده ببطء إلى 25°س.</p>`;}
  else if(!S.seed){title='المحلول فوق مشبع';html=`<p class="p3-txt">فيه 250 جم مذابة والحد عند 25°س هو 204 جم فقط. أسقط بلورة سكر صغيرة ولاحظ.</p>`;}
  else{title='الاستنتاج';html=`<p class="p3-ok">تزداد ذائبية السكر بارتفاع درجة الحرارة. المحلول <b>المشبع</b> فيه كل ما يمكن إذابته، و<b>فوق المشبع</b> فيه أكثر من حد الإشباع مؤقتًا، ويتبلور الزائد عند إسقاط بلورة (<b>التبلور</b> عملية فيزيائية).</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){sec.$('.p3-nb').innerHTML=`<table class="p3-t"><thead><tr><th>المرحلة</th><th>°س</th><th>المضاف</th><th>الذائب</th><th>المحلول</th></tr></thead><tbody>${S.rows.length?S.rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join('')}</tr>`).join(''):'<tr><td colspan="5">—</td></tr>'}</tbody></table>`;}
function sync(){const b=S.busy,s=state();sec.$('[data-a="add"]').disabled=b||S.added>=250||S.heat;sec.$('[data-a="heat"]').disabled=b||s.und<.5||S.heat;sec.$('[data-a="cool"]').disabled=b||!S.sup||S.cool;sec.$('[data-a="seed"]').disabled=b||!S.cool||S.seed;sec.$('[data-a="reset"]').disabled=b;}
sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const a=x.dataset.a;if(a==='add')add();else if(a==='heat')heat();else if(a==='cool')cool();else if(a==='seed')seed();else if(a==='reset')reset();});
hud();sync();render();renderNB();
};

/* ---------- ١٨) الكاشف الطبيعي (الملفوف البنفسجي) والتعادل ---------- */
const CAB8={};EXP_MODS.cab8=CAB8;
CAB8.init=function(){gm();
const CABC=[[0xe11d2e,'حمض قوي'],[0xbe123c,'حمض متوسط القوة'],[0xb0178f,'حمض ضعيف'],[0x5b5fb0,'متعادل'],[0x0e9f8e,'قاعدة ضعيفة'],[0x16a34a,'قاعدة متوسطة القوة'],[0xead20a,'قاعدة قوية']];
const SOLS=[{n:'حمض الهيدروكلوريك',c:0},{n:'الأمونيا',c:6},{n:'الخل',c:1},{n:'الماء المقطر',c:3},{n:'الصابون',c:5},{n:'شراب غازي',c:2},{n:'صودا الخبز',c:4}];
const ORDER=SOLS.map((s,i)=>i).sort((a,b)=>SOLS[a].c-SOLS[b].c);
const byPH=p=>p<2.5?0:p<4.5?1:p<6.5?2:p<=7.5?3:p<9.5?4:p<11.5?5:6;
const S={drops:SOLS.map(()=>0),picked:[],vb:0,neut:false,busy:false,pts:[[0,1]]};P3.dbg.cab8=S;
const NAMES=['أضف الكاشف','رتّب المحاليل','عادل الحمض بالقاعدة'];
const pH=vb=>{const na=20*.1,nb=vb*.1,v=20+vb;if(Math.abs(na-nb)<1e-9)return 7;return na>nb?-Math.log10((na-nb)/v):14+Math.log10((nb-na)/v);};
const sec=P3.section('cab8',{title:'الكاشف الطبيعي (الملفوف البنفسجي) والتعادل',grade:'ثاني متوسط',lesson:'المحاليل الحمضية والمحاليل القاعدية',
  hud:`<div class="p3-row"><div class="p3-m"><small>NaOH المضاف</small><b class="cbV">0.0 mL</b></div><div class="p3-m warm"><small>pH الكأس</small><b class="cbP">1.0</b></div></div>`,
  side:`<div class="p3-box"><h4 class="p3-h">لوحة التحكم</h4>
    <div class="p3-acts"><span class="p3-txt" style="font-size:.8rem">① اضغط على كل أنبوب لإضافة 10 قطرات من عصير الملفوف.</span></div>
    <div class="p3-acts cbOrd"></div>
    <div class="p3-acts"><span class="p3-lab">السحاحة</span><button class="p3-b" data-v="5">+5 mL</button><button class="p3-b" data-v="1">+1 mL</button><button class="p3-b" data-v="0.5">+0.5 mL</button><button class="p3-b" data-a="rz">↺ أعد الكأس</button></div>
    <div class="p3-acts"><button class="p3-b" data-a="reset">↺ إعادة التجربة</button></div></div>
    <div class="p3-box"><h4 class="p3-h">جدول ألوان الكاشف</h4><div>${CABC.map(c=>`<div style="display:flex;gap:6px;align-items:center;font-size:.8rem;font-weight:700"><span class="p3-sw" style="background:${hex6(c[0])}"></span>${c[1]}</div>`).join('')}</div></div>`,
  learn:`<div class="panel"><h3>الكواشف</h3><p>مركّبات تتغير ألوانها بحسب الرقم الهيدروجيني pH للمحلول. عصير الملفوف البنفسجي كاشف طبيعي: أحمر في الأحماض القوية، بنفسجي مزرق في المتعادل، أخضر ثم أصفر في القواعد.</p></div>
    <div class="panel"><h3>التعادل</h3><p>تفاعل حمض مع قاعدة ينتج ملحًا وماءً: تتحد أيونات الهيدرونيوم مع أيونات الهيدروكسيد بأعداد متساوية فيصبح pH = 7.</p><p class="p3-eq">H₃O⁺ + OH⁻ → 2H₂O</p></div>`,
  quiz:[{q:'لون عصير الملفوف في الحمض القوي:',o:['أحمر','أخضر','أصفر'],a:0},{q:'أي المحاليل التالية الأقرب إلى التعادل؟',o:['الخل','الماء المقطر','الأمونيا'],a:1},
    {q:'نواتج تفاعل التعادل:',o:['ملح وماء','حمض وماء','غاز الهيدروجين'],a:0},{q:'كم مل من NaOH (0.1 مول/لتر) يعادل 20 مل من HCl بالتركيز نفسه؟',o:['10 مل','20 مل','40 مل'],a:1}],
  report:()=>({title:'الكاشف الطبيعي والتعادل',grade:'ثاني متوسط',lesson:'المحاليل الحمضية والمحاليل القاعدية',cols:['المحلول','لون الكاشف','التصنيف'],
    rows:SOLS.map((s,i)=>[s.n,S.drops[i]?CABC[s.c][1].replace(/^/,''):'',S.drops[i]?(s.c<3?'حمضي':s.c>3?'قاعدي':'متعادل'):'']),note:'رتّب المحاليل من الأشد حمضية إلى الأشد قاعدية.'})
});
const L=new Lab(sec,{target:V(-.2,.55,.45),dist:a=>Math.max(4.3,7.1/a),exposure:.95});buildRoom(L);
const toast=m=>L.toast(m);
const rack=new THREE.Group();{const t=new THREE.Mesh(RBox(3.0,.06,.36,.02),KIT.wood(0x9b6a3c));t.position.y=.62;const b=new THREE.Mesh(RBox(3.0,.06,.36,.02),KIT.wood(0x9b6a3c));b.position.y=.03;rack.add(t,b);[-1.47,1.47].forEach(x=>{const s=new THREE.Mesh(RBox(.06,.62,.36,.01),KIT.wood(0x8a5a32));s.position.set(x,.33,0);rack.add(s);});castAll(rack);}
rack.position.set(-.8,0,.25);L.add(rack);
const TT=SOLS.map((s,i)=>{const x=-2.1+i*.43,t=vivTube(TestTube(.12,.95));t.g.position.set(x,.14,.25);t.seg(0,.45);vset(t.lm,s.n==='الصابون'?0xe9ecf7:0xd6ecf5);t.lm.opacity=.6;L.add(t.g);
  const c=P3.card([{t:s.n,s:s.n.length>10?62:80}],.42,.17);c.position.set(x,.05,.62);c.rotation.x=-.95;L.add(c);L.onTap(t.g,()=>tapTube(i));return {t,x};});
const dropper=new THREE.Group();{const g=new THREE.Mesh(new THREE.CylinderGeometry(.02,.012,.3,12),G.glassS);g.position.y=.15;const b=new THREE.Mesh(new THREE.SphereGeometry(.045,14,10),KIT.mat(0x2b2b2b));b.position.y=.33;b.scale.y=1.4;dropper.add(g,b);castAll(dropper);}
const DR_HOME=V(-2.6,.6,.95);dropper.position.copy(DR_HOME);L.add(dropper);
const bottle=Beaker(.12,.3,{col:0x5b2a86,op:.85});bottle.set(.22);bottle.g.position.set(-2.6,0,.95);L.add(bottle.g);const bc=P3.card([{t:'عصير الملفوف',s:50}],.42,.12);bc.position.set(-2.6,.05,1.2);bc.rotation.x=-.9;L.add(bc);
const drops=Drops(L,12,0x6b2fa0,.014);
// التعادل
const NB=Beaker(.3,.55);NB.g.position.set(1.75,0,.45);NB.set(.18);vset(NB.lm,CABC[0][0]);L.add(NB.g);
const nc=P3.card([{t:'20 mL HCl + كاشف',s:44}],.6,.14);nc.position.set(1.75,.05,.95);nc.rotation.x=-.9;L.add(nc);
const ST=KIT.stand(2.2);ST.position.set(2.35,0,.15);L.add(ST);
const bur=new THREE.Group();{const t=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,1.1,16,1,true),G.glass);t.position.y=.55;t.renderOrder=3;const tip=new THREE.Mesh(new THREE.ConeGeometry(.04,.12,16),G.glassS);tip.rotation.x=Math.PI;tip.position.y=-.06;
  const lm=VIV(0xb9dcef,.85);const lq=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,1,14),lm);bur.userData.lq=lq;const v=new THREE.Mesh(new THREE.BoxGeometry(.1,.03,.03),KIT.mat(0x1f6feb));v.position.y=.02;bur.add(t,tip,lq,v);}
bur.position.set(1.75,1.0,.45);L.add(bur);const setBur=()=>{const f=1-S.vb/50;bur.userData.lq.scale.y=f;bur.userData.lq.position.y=.05+f/2;};setBur();
const bl=P3.card([{t:'NaOH 0.1 mol/L',s:48,mono:true}],.5,.12);bl.position.set(1.75,2.25,.45);L.add(bl);
const meter=KIT.lcd(.5,.2);meter.m.position.set(1.05,.45,.75);meter.m.rotation.y=.35;L.add(meter.m);meter.set('pH 1.0');
async function tapTube(i){if(S.busy||S.drops[i])return;S.busy=true;const o=TT[i];await L.arc(dropper,V(-2.6,.5,.95),400,.9);await L.arc(dropper,V(o.x,1.2,.25),700,1.3);drops.start(V(o.x,1.18,.25),.6);
  const c0=new THREE.Color(o.t.lm.color),c1=$lc(CABC[SOLS[i].c][0]);await L.tw(900,k=>{o.t.lm.color.copy(c0).lerp(c1,k);o.t.lm.emissive.copy(o.t.lm.color);o.t.lm.opacity=.6+.36*k;});drops.stop();await L.arc(dropper,DR_HOME,500,1.3);
  S.drops[i]=1;S.busy=false;P3.click();if(S.drops.every(Boolean))toast('أُضيف الكاشف إلى المحاليل السبعة. رتّبها الآن مستعينًا بجدول الألوان.');sync();render();renderNB();}
function pick(i){if(S.busy||!S.drops.every(Boolean)||S.picked.length>=7)return;if(ORDER[S.picked.length]===i){S.picked.push(i);P3.click();if(S.picked.length===7){P3.good();toast('ترتيب صحيح! الماء المقطر الأقرب إلى التعادل، والأمونيا الأقوى قاعدية.');}}else toast('ليس هذا دوره؛ قارن لون الأنبوب بجدول الألوان.');sync();render();}
async function addB(v){if(S.busy||S.picked.length<7||S.neut)return;if(S.vb+v>20.001){toast('ستتجاوز نقطة التعادل! أضف كمية أصغر.');return;}S.busy=true;sync();drops.start(V(1.75,.92,.45),.25);const v0=S.vb,v1=Math.round((S.vb+v)*10)/10;
  const c0=new THREE.Color(NB.lm.color);await L.tw(600+v*120,k=>{S.vb=v0+(v1-v0)*k;setBur();NB.set(.18+.12*S.vb/20);const p=pH(S.vb);sec.$('.cbV').textContent=S.vb.toFixed(1)+' mL';sec.$('.cbP').textContent=p.toFixed(1);meter.set('pH '+p.toFixed(1));NB.lm.color.copy(c0).lerp($lc(CABC[byPH(p)][0]),k);NB.lm.emissive.copy(NB.lm.color);});
  drops.stop();S.vb=v1;S.pts.push([v1,+pH(v1).toFixed(2)]);if(Math.abs(v1-20)<1e-6){S.neut=true;P3.good();toast('pH = 7: تعادل الحمض مع القاعدة فتكوّن ملح وماء.');}S.busy=false;sync();render();renderNB();}
function rz(){if(S.busy)return;S.vb=0;S.neut=false;S.pts=[[0,1]];setBur();NB.set(.18);vset(NB.lm,CABC[0][0]);sec.$('.cbV').textContent='0.0 mL';sec.$('.cbP').textContent='1.0';meter.set('pH 1.0');sync();render();renderNB();}
function reset(){if(S.busy)return;S.drops=SOLS.map(()=>0);S.picked=[];TT.forEach((o,i)=>{vset(o.t.lm,SOLS[i].n==='الصابون'?0xe9ecf7:0xd6ecf5);o.t.lm.opacity=.6;});rz();toast('أُعيدت التجربة.');}
function stepIdx(){if(!S.drops.every(Boolean))return 0;if(S.picked.length<7)return 1;return 2;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='أضف الكاشف الطبيعي';html=`<p class="p3-txt">في الأنابيب سبعة محاليل منزلية. اضغط على كل أنبوب لتضيف إليه 10 قطرات من عصير الملفوف البنفسجي، ولاحظ اللون (${S.drops.filter(Boolean).length} / 7).</p>`;}
  else if(k===1){title='رتّب المحاليل';html=`<p class="p3-txt">اضغط على أسماء المحاليل في لوحة التحكم بالترتيب من <b>الأشد حمضية</b> إلى <b>الأشد قاعدية</b> (${S.picked.length} / 7).</p>`;}
  else if(!S.neut){title='عادل الحمض بالقاعدة';html=`<p class="p3-txt">في الكأس 20 mL من حمض الهيدروكلوريك (0.1 mol/L) مع الكاشف (أحمر). أضف هيدروكسيد الصوديوم بالتركيز نفسه من السحاحة حتى يصبح pH = 7 (بنفسجي مزرق).</p>`;}
  else{title='الاستنتاج';html=`<p class="p3-ok">الترتيب: حمض الهيدروكلوريك ← الخل ← الشراب الغازي ← الماء المقطر ← صودا الخبز ← الصابون ← الأمونيا. وعند إضافة 20 mL من القاعدة تساوت أيونات H₃O⁺ وOH⁻ فأصبح pH = 7: <b>تعادل</b> ينتج ملحًا وماءً.</p>`;}
  sec.steps(NAMES,k,title,html);
  sec.$('.cbOrd').innerHTML=k===1?SOLS.map((s,i)=>`<button class="p3-b ${S.picked.includes(i)?'done':''}" data-p="${i}" ${S.picked.includes(i)?'disabled':''}>${S.picked.includes(i)?(S.picked.indexOf(i)+1)+'. ':''}${s.n}</button>`).join(''):(S.picked.length===7?`<span class="p3-txt" style="font-size:.8rem">✓ ${S.picked.map(i=>SOLS[i].n).join(' ← ')}</span>`:'');}
function renderNB(){let h=`<table class="p3-t"><thead><tr><th>المحلول</th><th>اللون</th><th>التصنيف</th></tr></thead><tbody>${SOLS.map((s,i)=>`<tr><td>${s.n}</td><td>${S.drops[i]?`<span class="p3-sw" style="background:${hex6(CABC[s.c][0])}"></span>`:'—'}</td><td>${S.drops[i]?CABC[s.c][1]:'—'}</td></tr>`).join('')}</tbody></table>`;
  if(S.pts.length>1)h+=KIT.chart({w:330,h:190,xl:'حجم NaOH (mL)',yl:'pH',xmin:0,xmax:20,ymin:0,ymax:14,series:[{c:'var(--brand)',name:'pH',pts:S.pts}]});sec.$('.p3-nb').innerHTML=h;}
function sync(){const b=S.busy,ok=S.picked.length===7;sec.$$('[data-v]').forEach(x=>x.disabled=b||!ok||S.neut);sec.$('[data-a="rz"]').disabled=b||!ok;sec.$('[data-a="reset"]').disabled=b;}
S._tap=tapTube;sec.$('.p3-side').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;if(x.dataset.p)pick(+x.dataset.p);else if(x.dataset.v)addB(+x.dataset.v);else if(x.dataset.a==='rz')rz();else if(x.dataset.a==='reset')reset();});
sync();render();renderNB();
};


/* ---------- shared toolkit for the newer 3D experiment packs ---------- */
window.P3X={P3,G,gm,TestTube,Bubbles,Splint,Flame,setCol,$lc,sleep,hex6,clamp,mixHex,show,LRI,sw};

/* ---------- register in the library ---------- */
const D3=['elec','gasp','flame','minr','weat','ruth','half','elem','rock','plate','crt','rad','alk','rust','plnt8','dig8','sol8','cab8'];
EXPS.forEach(e=>{if(EXP_MODS[e.id])e.ready=true;if(D3.includes(e.id))e.d3=true;});renderLib();
})();
