/* Safe public evidence viewer — only images inside approved week-group sheets. */
(()=>{'use strict';if(window.__evidenceZoomReady)return;window.__evidenceZoomReady=true;
const css=document.createElement('style');css.textContent=`
.sheet>img,.card>img,main article>img{cursor:zoom-in}
#safeZoom{position:fixed;inset:0;z-index:99999;background:rgba(2,10,24,.97);display:none;flex-direction:column;color:#fff;direction:rtl}
#safeZoom.open{display:flex}#safeZoom .tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:10px 14px;background:#102744}
#safeZoom button{font:700 16px Tahoma,Arial,sans-serif;background:#245c92;color:#fff;border:1px solid #689cca;border-radius:8px;padding:9px 14px;cursor:pointer}
#safeZoom .viewport{flex:1;overflow:auto;display:flex;align-items:flex-start;justify-content:center;touch-action:pan-x pan-y}
#safeZoom img{max-width:none;width:auto;height:auto;display:block;object-fit:contain;margin:auto}
#safeZoom .name{margin-inline-end:auto;font:700 15px Tahoma,Arial,sans-serif}
@media(max-width:600px){#safeZoom button{padding:8px;font-size:14px}}
`;document.head.append(css);
const panel=document.createElement('div');panel.id='safeZoom';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.innerHTML='<div class="tools"><span class="name"></span><button data-action="out">−</button><button data-action="reset">100٪</button><button data-action="in">＋</button><button data-action="close">إغلاق ✕</button></div><div class="viewport"><img alt="الشاهد المعتمد بحجمه الكامل"></div>';
document.body.append(panel);const pic=panel.querySelector('img'),area=panel.querySelector('.viewport'),name=panel.querySelector('.name');let scale=1;
function render(){const w=pic.naturalWidth||900;pic.style.width=Math.round(w*scale)+'px';}
function open(img){pic.src=img.currentSrc||img.src;name.textContent=img.closest('article,.card')?.querySelector('h2')?.textContent||'شاهد معتمد';scale=1;panel.classList.add('open');document.body.style.overflow='hidden';if(pic.complete)render();pic.onload=render;}
function close(){panel.classList.remove('open');document.body.style.overflow='';pic.removeAttribute('src');}
document.addEventListener('click',ev=>{const im=ev.target.closest('.sheet>img,.card>img,main article>img');if(im){open(im);return;}if(!panel.contains(ev.target))return;const action=ev.target.closest('button')?.dataset.action;if(action==='close')close();if(action==='in'){scale=Math.min(4,scale*1.25);render()}if(action==='out'){scale=Math.max(.3,scale/1.25);render()}if(action==='reset'){scale=1;render();}});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&panel.classList.contains('open'))close()});
})();