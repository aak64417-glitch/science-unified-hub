// إيقاف عامل الخدمة القديم للبوابة الموحدة (2026-11-24)
// النسخة السابقة كانت تعترض كل طلب وتجبر المتصفح على تنزيل كل ملف من جديد (no-store)،
// فتبطئ فتح جميع المنصات. هذه النسخة تلغي تسجيل نفسها ليعود المتصفح إلى التخزين المؤقت العادي.
// لا تمس عامل خدمة المختبر الافتراضي (lab/sw.js) ولا ذاكرته.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try { await self.registration.unregister(); } catch (e) {}
  })());
});
