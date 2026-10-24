/* رمز دخول المدير اليومي — ملف الإنجاز 1448هـ (يتغير كل يوم بتوقيت الرياض) */
(function(){
  var SECRET='pf1448-bq-7Kx92mQ-أبوالدرداء';
  function h(s){var a=0xdeadbeef,b=0x41c6ce57,i,c;for(i=0;i<s.length;i++){c=s.charCodeAt(i);a=Math.imul(a^c,2654435761);b=Math.imul(b^c,1597334677)}
    a=Math.imul(a^(a>>>16),2246822507)^Math.imul(b^(b>>>13),3266489909);b=Math.imul(b^(b>>>16),2246822507)^Math.imul(a^(a>>>13),3266489909);
    return (4294967296*(2097151&b)+(a>>>0))}
  function day(off){var d=new Date(Date.now()+3*3600*1000+(off||0)*86400000);return d.toISOString().slice(0,10)}
  function code(d){var n=h(SECRET+'|'+d)%1000000;return ('000000'+n).slice(-6)}
  window.PFCode={day:day,code:code,today:function(){return code(day(0))}};
})();
