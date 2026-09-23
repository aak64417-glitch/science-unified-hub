// Fresh-online service worker: never serve stale application files.
// Version: 2026-09-23-final

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request, { cache: 'no-store' }).catch(() => {
      if (request.mode === 'navigate') {
        return new Response(
          `<!doctype html>
          <html lang="ar" dir="rtl">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>تعذر الاتصال</title>
            <style>
              body{font-family:Tahoma,Arial,sans-serif;background:#07111f;color:#fff;margin:0;display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px}
              .box{max-width:560px;background:#102039;border:1px solid #ffffff22;border-radius:22px;padding:28px;box-shadow:0 18px 50px #0006}
              h1{color:#ffd166;margin-top:0}p{line-height:1.9;color:#dbe7f3}
              button{border:0;border-radius:14px;padding:12px 20px;font-weight:700;cursor:pointer}
            </style>
          </head>
          <body>
            <div class="box">
              <h1>تعذر الاتصال بالإنترنت</h1>
              <p>لم نعرض نسخة قديمة من المنصة. تأكد من الاتصال ثم أعد المحاولة لفتح أحدث نسخة.</p>
              <button onclick="location.reload()">إعادة المحاولة</button>
            </div>
          </body>
          </html>`,
          {
            status: 503,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-store'
            }
          }
        );
      }

      return new Response('', {
        status: 503,
        headers: { 'Cache-Control': 'no-store' }
      });
    })
  );
});
