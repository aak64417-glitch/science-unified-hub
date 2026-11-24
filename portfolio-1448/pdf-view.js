/* عارض PDF داخل الصفحة (يعمل على أندرويد والتابلت دون الحاجة لتطبيق خارجي) */
(function(){
  var base=(document.currentScript&&document.currentScript.src)?document.currentScript.src.replace(/[^\/]*$/,''):'';
  var lib=null;
  function load(){
    if(lib)return lib;
    lib=new Promise(function(ok,fail){
      if(window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc=base+'vendor/pdfjs/pdf.worker.min.js';ok(window.pdfjsLib);return}
      var s=document.createElement('script');s.src=base+'vendor/pdfjs/pdf.min.js';
      s.onload=function(){var L=window.pdfjsLib;if(!L){lib=null;fail(new Error('تعذر تحميل قارئ PDF'));return}L.GlobalWorkerOptions.workerSrc=base+'vendor/pdfjs/pdf.worker.min.js';ok(L)};
      s.onerror=function(){lib=null;fail(new Error('تعذر تحميل قارئ PDF — تحقق من الاتصال'))};
      document.head.appendChild(s);
    });
    return lib;
  }
  function msg(box,t){var p=document.createElement('p');p.style.cssText='color:#fff;text-align:center;font:700 16px Tahoma,sans-serif;margin:30px 10px';p.textContent=t;box.appendChild(p);return p}

  /* render(box, Blob|ArrayBuffer|url) → يرسم كل الصفحات داخل box، ويعيد دالة إيقاف */
  function render(box,source){
    var stopped=false,doc=null;
    box.replaceChildren();
    box.style.overflowY='auto';box.style.webkitOverflowScrolling='touch';
    var info=msg(box,'جارٍ فتح ملف PDF…');
    (async function(){
      try{
        var L=await load();
        var data;
        if(source instanceof Blob)data=new Uint8Array(await source.arrayBuffer());
        else if(source instanceof ArrayBuffer)data=new Uint8Array(source);
        else{var r=await fetch(source);if(!r.ok)throw new Error('تعذر تنزيل الملف ('+r.status+')');data=new Uint8Array(await r.arrayBuffer())}
        if(stopped)return;
        doc=await L.getDocument({data:data}).promise;
        if(stopped){doc.destroy();return}
        info.remove();
        var dpr=Math.min(window.devicePixelRatio||1,2);
        for(var n=1;n<=doc.numPages;n++){
          if(stopped)break;
          var pg=await doc.getPage(n);
          var w=Math.max(200,(box.clientWidth||window.innerWidth)-24);
          var v1=pg.getViewport({scale:1}),scale=Math.min(w/v1.width,2.5),v=pg.getViewport({scale:scale*dpr});
          var c=document.createElement('canvas');c.width=Math.round(v.width);c.height=Math.round(v.height);
          c.style.cssText='display:block;margin:0 auto 12px;width:'+Math.round(v.width/dpr)+'px;max-width:100%;height:auto;background:#fff;border-radius:6px;box-shadow:0 2px 10px #0006';
          c.setAttribute('aria-label','صفحة '+n+' من '+doc.numPages);
          box.appendChild(c);
          await pg.render({canvasContext:c.getContext('2d'),viewport:v}).promise;
          pg.cleanup();
        }
      }catch(e){
        if(stopped)return;
        info.textContent='تعذر عرض ملف PDF: '+(e&&e.name==='PasswordException'?'الملف محمي بكلمة مرور':(e&&e.message||e));
      }
    })();
    return function(){stopped=true;try{doc&&doc.destroy()}catch(_){}};
  }
  window.PFPdf={render:render,load:load};
})();
