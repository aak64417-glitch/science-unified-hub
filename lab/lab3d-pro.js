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
const P3={dbg:{}};
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

/* ---------- register in the library ---------- */
EXPS.forEach(e=>{if(EXP_MODS[e.id])e.ready=true;});renderLib();
const hid=location.hash.slice(1);if(['elec','gasp','flame'].includes(hid))openExp(hid);
})();
