/* =====================================================================
   المختبر الافتراضي الذكي — وضع الوضوح العالي (لكل التجارب ثلاثية الأبعاد)
   - زجاج واضح بحواف داكنة مرسومة بدل الشفافية الباهتة
   - سوائل مصمتة الألوان، وحدود داكنة لكل أداة (أسلوب «مختبر المادة العجيب»)
   - كتابة أكبر وأوضح في القراءات والملصقات
   إعداد أ. علي البقاشي — مدرسة أبي الدرداء المتوسطة
   ===================================================================== */
(function(){
'use strict';
if(typeof THREE==='undefined'||typeof Lab==='undefined')return;
/* ---------- bigger, high-contrast labels and readouts ---------- */
const css=`
.lbl{font-size:.95rem!important;font-weight:800!important;padding:4px 11px!important;border:2px solid #24414b!important;color:#10302c!important;background:#ffffffee!important;box-shadow:0 3px 10px rgb(0 0 0/.18)!important}
.lbl.x-c{background:#1d4ed8!important;color:#fff!important;border-color:#0f2f8a!important}.lbl.x-w{background:#c81e1e!important;color:#fff!important;border-color:#7f1010!important}
.lbl.x-d{background:#10302c!important;color:#fff!important;border-color:#000!important}
.p3-m{min-width:118px!important;padding:6px 12px!important;border:2px solid #2f5a52!important}
.p3-m small{font-size:.8rem!important;color:#d6f1ea!important}
.p3-m b{font-size:1.32rem!important;font-weight:700!important;color:#8affd4!important}
.p3-m.warm b{color:#ffd27a!important}
.x-ov .t{font-size:.85rem}
.p3 .p3-txt,.p3 .p3-ok{font-size:1.02rem!important;font-weight:600}
.p3-b{font-weight:700!important}
@media (max-width:880px){.p3-m b{font-size:1.2rem!important}.lbl{font-size:.88rem!important}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

const DARK=new THREE.Vector3(.11,.23,.27);
const isStd=m=>m&&(m.isMeshStandardMaterial||m.isMeshPhongMaterial);
const hsl={h:0,s:0,l:0};
function kind(m){if(!isStd(m))return null;if(m.blending===THREE.AdditiveBlending)return null;
  if(m.userData.liq)return 'liquid';if(m.userData.glass)return 'glass';
  if(!m.transparent||m.opacity>=.97)return 'solid';m.color.getHSL(hsl);
  if(m.opacity<.62&&hsl.l>.55&&hsl.s<.55&&!m.map)return 'glass';
  return 'liquid';}
function chain(m,code,key){const prev=m.onBeforeCompile;m.onBeforeCompile=function(sh,r){if(prev&&prev!==Function.prototype)prev.call(this,sh,r);
    sh.fragmentShader=sh.fragmentShader.replace('#include <dithering_fragment>',code+'\n#include <dithering_fragment>');};
  const pk=m.customProgramCacheKey?m.customProgramCacheKey.bind(m):()=> '';m.customProgramCacheKey=()=>pk()+key;m.needsUpdate=true;}
const RIM='float clR=pow(1.0-abs(dot(normalize(normal),normalize(vViewPosition))),';
function patch(m){if(!m||m.userData.clar)return;m.userData.clar=1;const k=kind(m);if(!k)return;m.userData.clk=k;
  if(k==='glass'){m.color.lerp(new THREE.Color(0xb9dcec),.35);if('envMapIntensity' in m)m.envMapIntensity=Math.min(m.envMapIntensity,1.0);
    chain(m,RIM+'1.5);gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(.11,.23,.27),clamp(clR*1.05,0.,.92));gl_FragColor.a=clamp(.07+clR*.95,0.,.97);','|clG2');}
  else if(k==='liquid'){m.color.getHSL(hsl);if(hsl.l>.6&&hsl.s<.85)m.color.lerp(new THREE.Color(0x4aa6dc).convertSRGBToLinear(),.85);m.opacity=Math.max(m.opacity,.9);if('clearcoat' in m)m.clearcoat=0;m.roughness=Math.max(m.roughness||0,.4);if(m.emissive){m.emissive.copy(m.color);m.emissiveIntensity=Math.min(Math.max(m.emissiveIntensity||0,.12),.3);}if('envMapIntensity' in m)m.envMapIntensity=Math.min(m.envMapIntensity,.25);
    chain(m,RIM+'2.2);vec3 clB=LinearTosRGB(vec4(diffuseColor.rgb,1.0)).rgb;gl_FragColor.rgb=mix(gl_FragColor.rgb,clB,.72)*(1.0-clR*.3);gl_FragColor.a=max(gl_FragColor.a,.86);','|clL2');}
  else chain(m,RIM+'2.4);gl_FragColor.rgb*=1.0-clR*.55;','|clS');}
/* ---------- crisp dark outlines on hard edges ---------- */
const EDGE=new WeakMap();const lineG=new THREE.LineBasicMaterial({color:0x1d3a44,transparent:true,opacity:.9});const lineCache={};
function lineMatFor(m){m.color.getHSL(hsl);const key=Math.round(hsl.h*12)+'_'+Math.round(hsl.s*4);if(lineCache[key])return lineCache[key];
  const c=new THREE.Color().setHSL(hsl.h,Math.min(1,hsl.s*.9),.13);return lineCache[key]=new THREE.LineBasicMaterial({color:c,transparent:true,opacity:.82});}
const SKIPGEO=new Set(['PlaneGeometry','PlaneBufferGeometry','CircleGeometry','CircleBufferGeometry','RingGeometry','RingBufferGeometry']);
function edges(x){if(!x.isMesh||x.isInstancedMesh||x.isSkinnedMesh||x.userData.noEdge)return;const m=Array.isArray(x.material)?x.material[0]:x.material;const k=m&&m.userData.clk;if(!k||k==='liquid')return;
  const g=x.geometry;if(!g||!g.attributes||!g.attributes.position||SKIPGEO.has(g.type))return;if(x.userData.edgeGeo===g.uuid)return;
  if(x.userData.edgeLine){x.remove(x.userData.edgeLine);x.userData.edgeLine=null;}
  const n=g.attributes.position.count;if(n>9000){x.userData.edgeGeo=g.uuid;return;}if(!g.boundingSphere)g.computeBoundingSphere();if(g.boundingSphere.radius>2.6){x.userData.edgeGeo=g.uuid;return;}
  let eg=EDGE.get(g);if(!eg){eg=new THREE.EdgesGeometry(g,50);EDGE.set(g,eg);}
  if(eg.attributes.position.count===0){x.userData.edgeGeo=g.uuid;return;}
  const ln=new THREE.LineSegments(eg,k==='glass'?lineG:lineMatFor(m));ln.userData.noEdge=1;ln.raycast=()=>{};ln.renderOrder=(x.renderOrder||0)+1;ln.matrixAutoUpdate=true;x.add(ln);x.userData.edgeLine=ln;x.userData.edgeGeo=g.uuid;}
function clarify(root){root.traverse(x=>{if(!x.isMesh||x.userData.noEdge)return;[].concat(x.material).forEach(patch);edges(x);});}
window.LabClarity={clarify};
/* ---------- hook into every 3D lab ---------- */
const P=Lab.prototype,f0=P.frame;
P.frame=function(){if(!this._reg){this._reg=1;(window.__labs=window.__labs||[]).push(this);}this._clr=(this._clr||0)+1;if(this._clr===2||this._clr%45===0)clarify(this.scene);return f0.apply(this,arguments);};
/* bring the camera a little closer so tools look bigger */
const r0=P.resize;P.resize=function(){if(!this._clDist){this._clDist=1;const f=this.distFn;this.distFn=a=>f(a)*.9;}return r0.apply(this,arguments);};
})();
