(function(){
'use strict';

function pad(n){return String(n).padStart(2,'0')}
function localValue(d){
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function parseLocal(v){
  if(!v) return null;
  const d=new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}
function addOption(select,value,label){
  select.add(new Option(label ?? String(value), String(value)));
}
function byId(id){ return document.getElementById(id); }

function injectStyle(){
  if(byId('journeyDatePickerStyle')) return;
  const style=document.createElement('style');
  style.id='journeyDatePickerStyle';
  style.textContent=`
    .journey-date-picker{display:grid;gap:9px}
    .journey-date-picker .jdp-mode{
      width:100%;padding:13px 14px;border-radius:14px;
      background:#09182a;border:1px solid var(--line);color:white;outline:none
    }
    .journey-date-grid{
      display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
      gap:8px
    }
    .journey-date-grid.jdp-hidden{display:none!important}
    .journey-date-cell{min-width:0}
    .journey-date-cell small{
      display:block;margin:0 0 4px;color:#9fb2c8;
      font-size:.74rem;font-weight:800
    }
    .journey-date-cell select{
      width:100%;min-width:0;padding:11px 8px;border-radius:12px;
      background:#09182a;border:1px solid var(--line);color:white;outline:none
    }
    .journey-date-note{font-size:.76rem;color:#9fb2c8;line-height:1.6}
    @media(max-width:700px){
      .journey-date-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
    }
  `;
  document.head.appendChild(style);
}

function el(kind,name){ return byId(`journey${kind}${name}`); }
function hidden(kind){ return byId(`task${kind}`); }

function fillDays(kind,preferred){
  const y=Number(el(kind,'Year')?.value || new Date().getFullYear());
  const m=Number(el(kind,'Month')?.value || 1);
  const day=el(kind,'Day');
  if(!day) return;

  const old=Number(preferred || day.value || 1);
  const max=new Date(y,m,0).getDate();

  day.innerHTML='';
  for(let d=1; d<=max; d++) addOption(day,d,pad(d));
  day.value=String(Math.min(Math.max(old,1),max));
}

function makePicker(kind,input){
  const isStart=kind==='Start';

  input.type='hidden';
  input.setAttribute('data-journey-original-date','1');

  const root=document.createElement('div');
  root.className='journey-date-picker';
  root.id=`journey${kind}Picker`;
  root.innerHTML=`
    <select class="jdp-mode" id="journey${kind}Mode">
      ${isStart
        ? '<option value="NOW">يفتح فورًا</option>'
        : '<option value="NONE">بدون إغلاق تلقائي</option>'}
      <option value="SCHEDULED">تحديد موعد</option>
    </select>

    <div class="journey-date-grid jdp-hidden" id="journey${kind}Grid">
      <div class="journey-date-cell"><small>اليوم</small><select id="journey${kind}Day"></select></div>
      <div class="journey-date-cell"><small>الشهر</small><select id="journey${kind}Month"></select></div>
      <div class="journey-date-cell"><small>السنة</small><select id="journey${kind}Year"></select></div>
      <div class="journey-date-cell"><small>الساعة</small><select id="journey${kind}Hour"></select></div>
      <div class="journey-date-cell"><small>الدقيقة</small><select id="journey${kind}Minute"></select></div>
      <div class="journey-date-cell">
        <small>الفترة</small>
        <select id="journey${kind}Period">
          <option value="AM">ص</option>
          <option value="PM">م</option>
        </select>
      </div>
    </div>

    <div class="journey-date-note" id="journey${kind}Summary"></div>
  `;
  input.insertAdjacentElement('afterend',root);

  const year=el(kind,'Year');
  const month=el(kind,'Month');
  const hour=el(kind,'Hour');
  const minute=el(kind,'Minute');

  const currentYear=new Date().getFullYear();
  for(let y=currentYear-10; y<=currentYear+10; y++) addOption(year,y,y);
  for(let m=1; m<=12; m++) addOption(month,m,pad(m));
  for(let h=1; h<=12; h++) addOption(hour,h,pad(h));
  for(let i=0; i<60; i++) addOption(minute,i,pad(i));

  root.querySelectorAll('select').forEach(select=>{
    select.addEventListener('change',()=>{
      if(select.id.endsWith('Year') || select.id.endsWith('Month')) fillDays(kind);
      syncToHidden(kind);
    });
  });
}

function setControls(kind,date){
  const d=(date instanceof Date && !Number.isNaN(date.getTime())) ? date : new Date();

  let hour=d.getHours();
  const period=hour>=12 ? 'PM' : 'AM';
  hour=hour%12 || 12;

  el(kind,'Year').value=String(d.getFullYear());
  el(kind,'Month').value=String(d.getMonth()+1);
  fillDays(kind,d.getDate());
  el(kind,'Hour').value=String(hour);
  el(kind,'Minute').value=String(d.getMinutes());
  el(kind,'Period').value=period;
}

function controlsDate(kind){
  const year=Number(el(kind,'Year').value);
  const month=Number(el(kind,'Month').value);
  const day=Number(el(kind,'Day').value);
  let hour=Number(el(kind,'Hour').value);
  const minute=Number(el(kind,'Minute').value);

  if(el(kind,'Period').value==='PM' && hour<12) hour+=12;
  if(el(kind,'Period').value==='AM' && hour===12) hour=0;

  return new Date(year,month-1,day,hour,minute,0,0);
}

function formatSummary(kind,value){
  const box=el(kind,'Summary');
  if(!box) return;

  const mode=el(kind,'Mode').value;

  if(mode==='NOW'){
    box.textContent='سيبدأ التكليف فور حفظه.';
    return;
  }
  if(mode==='NONE'){
    box.textContent='سيبقى التكليف مفتوحًا حتى يتم إيقافه يدويًا.';
    return;
  }

  const d=parseLocal(value);
  box.textContent=d
    ? `الموعد: ${d.toLocaleDateString('ar-SA-u-ca-gregory')} — ${d.toLocaleTimeString('ar-SA',{hour:'2-digit',minute:'2-digit',hour12:true})}`
    : '';
}

function syncToHidden(kind){
  const input=hidden(kind);
  const mode=el(kind,'Mode');
  const grid=el(kind,'Grid');

  if(!input || !mode || !grid) return;

  const scheduled=mode.value==='SCHEDULED';
  grid.classList.toggle('jdp-hidden',!scheduled);

  if(!scheduled){
    input.value=mode.value==='NOW' ? localValue(new Date()) : '';
  }else{
    input.value=localValue(controlsDate(kind));
  }

  formatSummary(kind,input.value);
}

function syncFromHidden(kind){
  const input=hidden(kind);
  const mode=el(kind,'Mode');
  if(!input || !mode) return;

  const current=parseLocal(input.value);

  if(current){
    mode.value='SCHEDULED';
    setControls(kind,current);
  }else{
    mode.value=kind==='Start' ? 'NOW' : 'NONE';

    const base=new Date();
    if(kind==='End') base.setDate(base.getDate()+1);
    setControls(kind,base);
  }

  syncToHidden(kind);
}

function validate(){
  syncToHidden('Start');
  syncToHidden('End');

  const start=parseLocal(hidden('Start')?.value);
  const end=parseLocal(hidden('End')?.value);

  if(start && end && end.getTime()<=start.getTime()){
    alert('موعد نهاية التكليف يجب أن يكون بعد موعد البداية.');
    return false;
  }
  return true;
}

function install(){
  const start=hidden('Start');
  const end=hidden('End');

  if(!start || !end || byId('journeyStartPicker')) return;

  injectStyle();
  makePicker('Start',start);
  makePicker('End',end);
  syncFromHidden('Start');
  syncFromHidden('End');

  const modal=byId('taskModal');
  if(modal){
    new MutationObserver(()=>{
      if(!modal.classList.contains('hidden')){
        setTimeout(()=>{
          syncFromHidden('Start');
          syncFromHidden('End');
        },0);
      }
    }).observe(modal,{attributes:true,attributeFilter:['class']});
  }

  const save=byId('saveTask');
  if(save){
    const original=save.onclick || window.createTask;
    save.onclick=function(ev){
      if(!validate()) return false;
      return typeof original==='function' ? original.call(this,ev) : undefined;
    };
  }
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0));
}else{
  setTimeout(install,0);
}
})();
