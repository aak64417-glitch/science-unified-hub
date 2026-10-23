/**
 * التحكم في عرض ملف الإنجاز للمدير — ملف الإنجاز 1448هـ
 * يُنشر في Google Apps Script كتطبيق ويب:
 *   تنفيذ باسم: أنا (Me) — من يمكنه الوصول: أي شخص (Anyone)
 *
 * الإجراءات:
 *   ?action=status&v=1        ← صفحة المدير: هل العرض متاح؟ (v=1 تسجّل وقت الاطلاع)
 *   ?action=get&pin=...       ← صفحة المعلم: الحالة + سجل الاطلاع
 *   ?action=set&pin=...&open=1|0  ← صفحة المعلم: إتاحة / إيقاف العرض
 * أول رمز سري (pin) يُرسل في get أو set يُحفظ ويصبح هو رمز المعلم.
 */
var P = PropertiesService.getScriptProperties();

function doGet(e) {
  var p = (e && e.parameter) || {};
  var out;
  try { out = handle(p); } catch (err) { out = { ok: false, message: String(err && err.message || err) }; }
  var json = JSON.stringify(out);
  var cb = String(p.callback || '').replace(/[^\w.$]/g, '');
  if (cb) return ContentService.createTextOutput(cb + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function handle(p) {
  var action = String(p.action || 'status');
  if (action === 'status') {
    var open = P.getProperty('open') === '1';
    if (open && p.v === '1') logView();
    return { ok: true, open: open };
  }
  if (action === 'get' || action === 'set') {
    checkPin(p.pin);
    if (action === 'set') {
      P.setProperty('open', String(p.open) === '1' ? '1' : '0');
      P.setProperty('changedAt', new Date().toISOString());
    }
    return { ok: true, open: P.getProperty('open') === '1', changedAt: P.getProperty('changedAt') || '', views: JSON.parse(P.getProperty('views') || '[]') };
  }
  return { ok: false, message: 'إجراء غير معروف' };
}

function checkPin(pin) {
  pin = String(pin || '').trim();
  if (pin.length < 4) throw new Error('الرمز السري يجب أن يكون 4 خانات أو أكثر');
  var saved = P.getProperty('pin');
  if (!saved) { P.setProperty('pin', pin); return; }
  if (saved !== pin) throw new Error('الرمز السري غير صحيح');
}

function logView() {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(5000);
    var v = JSON.parse(P.getProperty('views') || '[]');
    v.push(new Date().toISOString());
    P.setProperty('views', JSON.stringify(v.slice(-50)));
  } catch (e) {} finally { try { lock.releaseLock(); } catch (e) {} }
}
