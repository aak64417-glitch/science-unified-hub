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
  G.glass=new THREE.MeshPhysicalMaterial({color:0xf2fafb,roughness:.04,metalness:0,transparent:true,opacity:.2,clearcoat:1,clearcoatRoughness:.03,side:THREE.DoubleSide,depthWrite:false});G.glass.userData.keepEnv=1;G.glass.envMapIntensity=1.6;
  G.glassT=new THREE.MeshPhysicalMaterial({color:0xd4e8ec,roughness:.05,transparent:true,opacity:.34,clearcoat:1,side:THREE.DoubleSide,depthWrite:false});G.glassT.userData.keepEnv=1;G.glassT.envMapIntensity=1.6;
  G.glassS=new THREE.MeshPhysicalMaterial({color:0xe3f0f2,roughness:.08,transparent:true,opacity:.55,clearcoat:1});G.glassS.userData.keepEnv=1;G.glassS.envMapIntensity=1.2;
  G.brass=KIT.mat(0xc49a3a,{metalness:.85,roughness:.3});
  G.rubber=KIT.mat(0x7a2e1e,{roughness:.85});
}
G.water=(c=0xbfe2f0,o=.42)=>{const m=new THREE.MeshPhysicalMaterial({color:c,roughness:.06,transparent:true,opacity:o,depthWrite:false,clearcoat:.6});m.userData.keepEnv=1;m.envMapIntensity=.55;return m;};
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
  <div data-p="report" hidden>${reportShell()}</div>`;
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
async function clean(){if(S.busy)return;if(!S.lit){toast('أشعل الموقد أولًا.');return;}S.busy=true;sync();
  await moveLoop(V(KX,.95,KZ),Q_WORK,700);await moveLoop(V(KX,.22,KZ),Q_WORK,350);await sleep(250);await moveLoop(V(KX,.95,KZ),Q_WORK,350);await moveLoop(FE,Q_WORK,750);
  hot.material.opacity=.9;const prev=S.loop;
  if(prev!=='clean'){const p=prev==='new'?SB.na:SB[prev==='x'?S.unk:prev];flame.S.salt=shown(p.col,p.id);flame.S.saltK=.55;await sleep(700);flame.S.saltK=0;}
  await sleep(900);hot.material.opacity=0;S.loop='clean';blob.visible=false;
  await moveLoop(REST,Q_REST,850);S.busy=false;toast('السلك نظيف: لم يعد يلوّن اللهب.');sync();render();}
async function test(id){if(S.busy)return;if(!S.lit){toast('أشعل الموقد أولًا.');return;}S.busy=true;sync();
  const real=id==='x'?SB[S.unk]:SB[id],d=dishes[id];
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
  else{title='اكشف عن الأملاح';html=`<p class="p3-txt">اختر ملحًا من اللوحة أو اضغط على طبقه. ${S.loop==='clean'?'السلك نظيف وجاهز.':'<b>نظّف السلك أولًا</b> وإلا تختلط الألوان.'} سجّلت ${Object.keys(S.rec).length} من ${SALTS.length}.</p>${S.last?`<p class="p3-ok">${S.last}</p>`:''}`;}
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
function result(t){mnR.textContent=t;}
function addMark(parent,col,w,pos,rot){const m=new THREE.Mesh(new THREE.BoxGeometry(w,.004,.012),new THREE.MeshBasicMaterial({color:$lc(col)}));m.position.copy(pos);m.rotation.y=rot||0;parent.add(m);marks.push({m,parent});return m;}
async function pick(k){if(S.busy)return;if(S.cur===k)return;S.busy=true;sync();
  if(S.cur){const o=rocks[S.cur];await L.arc(o,o.userData.home,600,.6);}
  S.cur=k;const r=rocks[k];await L.arc(r,V(PAD.x,.03,PAD.z),700,.7);S.busy=false;P3.click();result('—');sync();render();renderNB();}
async function scrub(o,c,ax='x',amp=.12,n=3,d=900){const p0=o.position[ax];await L.tw(d,k=>{o.position[ax]=p0+Math.sin(k*Math.PI*2*n)*amp;});o.position[ax]=p0;}
async function test(t){if(S.busy)return;if(!S.cur){toast('اختر عيّنة أولًا (A إلى F).');return;}const k=S.cur,s=SAMPLES.find(x=>x.k===k),m=MIN[s.m],r=rocks[k],R=S.R[k];
  if(R[t]!=null){toast('أجريت هذا الاختبار على العيّنة '+k+' من قبل.');return;}
  S.busy=true;sync();const top=r.position.y+r.userData.top;
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
    const y0=r.rotation.y;await L.tw(1600,kk=>r.rotation.y=y0+kk*Math.PI*2);R.lus=m.lus;result('البريق: '+m.lus);
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
const L=new Lab(sec,{target:V(0,1.05,.3),dist:a=>Math.max(4.6,7.6/a),exposure:.85});buildRoom(L);
const toast=m=>L.toast(m);
/* ---------- vacuum chamber ---------- */
const CX=.3,CY=1.05,CZ=.2,R=1.25;const CH=new THREE.Group();CH.position.set(CX,0,CZ);
const base=new THREE.Mesh(new THREE.CylinderGeometry(1.55,1.62,.18,64),KIT.mat(0x232a30,{metalness:.5,roughness:.35}));base.position.y=.09;
const bell=new THREE.Mesh(new THREE.SphereGeometry(1.55,48,24,0,Math.PI*2,0,Math.PI/2),new THREE.MeshPhysicalMaterial({color:0xdfeff4,roughness:.04,transparent:true,opacity:.12,clearcoat:1,side:THREE.DoubleSide,depthWrite:false}));bell.position.y=.18;bell.scale.y=1.05;bell.renderOrder=3;bell.material.userData.keepEnv=1;
// fluorescent ZnS screen (ring, open towards the camera)
const scrM=new THREE.MeshStandardMaterial({color:0x163028,emissive:0x0a2a1a,roughness:.6,side:THREE.DoubleSide});
const scr=new THREE.Mesh(new THREE.CylinderGeometry(R,R,.5,96,1,true,Math.PI*.18,Math.PI*1.64),scrM);scr.position.y=CY;
const foilF=new THREE.Mesh(RBox(.05,.6,.5,.01),KIT.mat(0x3a3f44,{metalness:.6}));foilF.position.set(0,CY,0);
const foil=new THREE.Mesh(new THREE.PlaneGeometry(.34,.38),KIT.mat(0xffcf4a,{metalness:1,roughness:.18,side:THREE.DoubleSide,emissive:0x3a2a00}));foil.rotation.y=Math.PI/2;foil.position.set(.028,CY,0);
const post=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,CY-.18,10),M.steel);post.position.set(0,(CY+.18)/2-.15,0);
// lead source box with slit
const src=new THREE.Group();const lead=new THREE.Mesh(RBox(.42,.36,.36,.03),KIT.mat(0x55606a,{metalness:.4,roughness:.5}));src.add(lead);
const slit=new THREE.Mesh(new THREE.BoxGeometry(.02,.04,.04),new THREE.MeshBasicMaterial({color:0xff7a4d}));slit.position.x=.215;src.add(slit);
const rad=P3.card([{t:'☢ مصدر ألفا',s:54}],.34,.12,{bg:'#ffd84a',bd:'#222',ink:'#222'});rad.position.set(0,.03,.182);src.add(rad);
src.position.set(-1.0,CY,0);const srcPost=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,CY-.36,10),M.steel);srcPost.position.set(-1.0,(CY-.18+.18)/2,0);
CH.add(base,scr,foilF,foil,post,src,srcPost,bell);castAll(base);L.add(CH);
L.label('مصدر جسيمات ألفا',V(CX-1.0,CY+.38,CZ),'small');L.label('صفيحة ذهب رقيقة',V(CX,CY+.42,CZ),'small');L.label('شاشة كبريتيد الخارصين تومض عند الاصطدام',V(CX,CY+.5,CZ-1.25),'small');
/* ---------- particles + flashes ---------- */
const NV=140;const pm=new THREE.MeshBasicMaterial({color:0xff7a4d});const ip=new THREE.InstancedMesh(new THREE.SphereGeometry(.018,8,6),pm,NV);ip.count=0;ip.frustumCulled=false;CH.add(ip);
const flashes=[];const fm=new THREE.SpriteMaterial({map:P3.glowTex(),color:$lc(0x7dffb0),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
for(let i=0;i<70;i++){const s=new THREE.Sprite(fm.clone());s.visible=false;s.scale.setScalar(.12);s.renderOrder=11;CH.add(s);flashes.push({s,t:-9});}
let fi=0;function flash(p,col){const f=flashes[fi++%flashes.length];f.s.position.copy(p);f.s.material.color.copy($lc(col));f.s.visible=true;f.t=performance.now();}
const beam=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.8,8),new THREE.MeshBasicMaterial({color:0xff7a4d,transparent:true,opacity:0,depthWrite:false}));beam.rotation.z=Math.PI/2;beam.position.set(-.4,CY,0);CH.add(beam);
const dum=new THREE.Object3D();let live=[];
P3.loop(L,(dt,t,now)=>{flashes.forEach(f=>{if(!f.s.visible)return;const a=(now-f.t)/700;if(a>1){f.s.visible=false;return;}f.s.material.opacity=1-a;f.s.scale.setScalar(.1+.08*(1-a));});
  if(S.zoom&&!molBox.hidden)drawZoom(dt);});
/* direction of a scattered particle (theta from +x, random azimuth limited so it lands on the ring) */
function dirOf(th){const az=(Math.random()-.5)*.5;return V(Math.cos(th),Math.sin(th)*Math.sin(az)*.3,-Math.sin(th)*Math.cos(az)).normalize();}
async function fire(real){if(S.busy)return;if(!S.pred){toast('سجّل توقّعك أولًا وفق نموذج طومسون.');return;}S.busy=true;sync();
  const th=[...Array(N)].map(()=>angle(real)),cnt={a:0,b:0,c:0};
  const vis=th.map((t,i)=>({t,i,s:Math.random()*.8,d:dirOf(t),y0:(Math.random()-.5)*.03,z0:(Math.random()-.5)*.03})).filter((o,i)=>o.t>.17||i%5===0).slice(0,NV);
  const shown=new Set();beam.material.opacity=.35;P3.noise(4.2,.05,1200,.4);
  const el={a:sec.$('.ruA'),b:sec.$('.ruB'),c:sec.$('.ruC')};
  await L.tw(4500,k=>{let n=0;vis.forEach((o,j)=>{const u=(k-o.s)/.12;if(u<0)return;let p;
      if(u<1)p=V(-.8+.8*u,CY+o.y0,o.z0);else{const v=(u-1)*.55;if(v>=1){if(!shown.has(j)){shown.add(j);const hp=o.d.clone().multiplyScalar(R).add(V(0,CY,0));flash(hp,o.t>Math.PI/2?0xff8a8a:o.t>10*D?0xffd27a:0x7dffb0);}return;}
        p=o.d.clone().multiplyScalar(R*v).add(V(0,CY+o.y0,o.z0));}
      dum.position.copy(p);dum.updateMatrix();ip.setMatrixAt(n++,dum.matrix);});ip.count=n;ip.instanceMatrix.needsUpdate=true;
    const m=Math.round(N*k);let a=0,b=0,c=0;for(let i=0;i<m;i++){const d=th[i]/D;if(d<10)a++;else if(d<=90)b++;else c++;}el.a.textContent=a;el.b.textContent=b;el.c.textContent=c;
    if(Math.random()<.35){const t=Math.random()*.15;flash(V(Math.cos(t)*R,CY+(Math.random()-.5)*.1,-Math.sin(t)*R),0x7dffb0);}});
  ip.count=0;beam.material.opacity=0;th.forEach(t=>{const d=t/D;if(d<10)cnt.a++;else if(d<=90)cnt.b++;else cnt.c++;});
  el.a.textContent=cnt.a;el.b.textContent=cnt.b;el.c.textContent=cnt.c;
  S.runs.push({real,...cnt});S.last={real,...cnt};S.busy=false;P3.click();
  toast(real?`نفذت ${(cnt.a/N*100).toFixed(1)}% من الجسيمات، وارتدّ ${cnt.c} فقط من ${N}.`:'وفق نموذج طومسون: نفذت الجسيمات كلها تقريبًا.');sync();render();renderNB();}
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
function stepIdx(){if(!S.pred)return 0;if(!S.runs.some(r=>!r.real))return 1;if(!S.runs.some(r=>r.real))return 2;return 3;}
function render(){const k=stepIdx();let title,html;
  if(k===0){title='توقّع النتيجة';html=`<p class="p3-txt">قبل الإطلاق: ماذا يتوقع نموذج طومسون (الكعكة بالزبيب) لجسيمات ألفا الموجبة عند إطلاقها على صفيحة ذهب رقيقة؟</p>`;}
  else if(k===1){title='جرّب نموذج طومسون';html=`<p class="p3-txt">${S.pred==='pass'?'توقّعك يوافق نموذج طومسون.':'نموذج طومسون يتوقع أن تنفذ الجسيمات كلها تقريبًا.'} اضغط «وفق نموذج طومسون» وراقب الشاشة والعدّادات.</p>`;}
  else if(k===2){title='الإطلاق الفعلي على صفيحة الذهب';html=`<p class="p3-txt">أطلق الجسيمات على صفيحة الذهب الحقيقية، وراقب ومضات الشاشة: هل يرتد شيء منها؟</p>`;}
  else{const l=S.runs.filter(r=>r.real).pop();title='استنتج';html=`<p class="p3-txt">نفذت <b>${(l.a/N*100).toFixed(1)}%</b> من الجسيمات، وانحرف ${l.b}، وارتدّ ${l.c} فقط من ${N}.</p><p class="p3-ok">معظم الذرة فراغ، وفي مركزها نواة صغيرة كثيفة موجبة الشحنة.</p>`;}
  sec.steps(NAMES,k,title,html);}
function renderNB(){let h=`<table class="p3-t"><thead><tr><th>الإطلاق</th><th>نفذت</th><th>انحرفت</th><th>ارتدّت</th></tr></thead><tbody>`+
  (S.runs.length?S.runs.map(r=>`<tr><td>${r.real?'صفيحة الذهب':'نموذج طومسون'}</td><td class="n">${r.a}</td><td class="n">${r.b}</td><td class="n">${r.c}</td></tr>`).join(''):`<tr><td colspan="4" class="muted">ستظهر هنا نتائج كل إطلاق (${N} جسيم).</td></tr>`)+'</tbody></table>';
  sec.$('.p3-nb').innerHTML=h;}
function sync(){const b=S.busy;sec.$$('[data-p]').forEach(x=>{x.setAttribute('aria-pressed',x.dataset.p===S.pred);x.disabled=b;});sec.$$('[data-m]').forEach(x=>x.disabled=b||!S.pred);
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
/* ---------- register in the library ---------- */
const D3=['elec','gasp','flame','minr','weat','ruth','half','elem'];
EXPS.forEach(e=>{if(EXP_MODS[e.id])e.ready=true;if(D3.includes(e.id))e.d3=true;});renderLib();
})();
