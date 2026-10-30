/* تخزين تقارير نافس في مستودع المنصة (GitHub) — ملف الإنجاز 1448هـ
   يستخدم رمز الوصول نفسه المحفوظ في لوحة التحكم بعرض المدير (على هذا الجهاز فقط). */
(function () {
  'use strict';
  var TK = 'pf1448.control.ghtoken';
  var REPO = 'aak64417-glitch/science-unified-hub';
  var API = 'https://api.github.com/repos/' + REPO + '/contents/';
  var INDEX = 'portfolio-1448/nafs-reports/index.json';

  function token() { try { return localStorage.getItem(TK) || ''; } catch (e) { return ''; } }
  function setToken(v) { try { localStorage.setItem(TK, v); } catch (e) {} }
  function headers() { return { 'Authorization': 'Bearer ' + token(), 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }; }
  function errText(status, d) {
    if (status === 401) return 'رمز الوصول غير صحيح أو منتهي الصلاحية.';
    if (status === 403 || status === 404) return 'رمز الوصول لا يملك صلاحية التعديل على المستودع (Contents: Read and write).';
    if (status === 409) return 'conflict';
    if (status === 422) return 'تعذر الحفظ (قد يكون الملف كبيرًا جدًا).';
    return (d && d.message) || 'تعذر الاتصال بـ GitHub';
  }
  function call(method, path, body) {
    return fetch(API + path + (method === 'GET' ? '?ref=main&t=' + Date.now() : ''), {
      method: method, cache: 'no-store', headers: headers(), body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) { var e = new Error(errText(r.status, d)); e.status = r.status; throw e; }
        return d;
      });
    });
  }
  function b64utf8(str) { return btoa(unescape(encodeURIComponent(str))); }
  function utf8b64(b64) { return decodeURIComponent(escape(atob(String(b64).replace(/\s/g, '')))); }

  /* قراءة الفهرس عبر GitHub مباشرة (أحدث نسخة فورًا) */
  function readIndex() {
    return call('GET', INDEX).then(function (d) {
      var j = {}; try { j = JSON.parse(utf8b64(d.content)); } catch (e) {}
      if (!Array.isArray(j.reports)) j.reports = [];
      return { data: j, sha: d.sha };
    }).catch(function (e) { if (e.status === 404 && token()) return { data: { reports: [] }, sha: '' }; throw e; });
  }
  function writeIndex(mutate, message, tries) {
    return readIndex().then(function (cur) {
      mutate(cur.data);
      var body = { message: message, content: b64utf8(JSON.stringify(cur.data, null, 1) + '\n'), branch: 'main' };
      if (cur.sha) body.sha = cur.sha;
      return call('PUT', INDEX, body).then(function () { return cur.data; });
    }).catch(function (e) {
      if (e.message === 'conflict' && !tries) return writeIndex(mutate, message, 1);
      throw e;
    });
  }
  function putFile(path, base64, message) {
    return call('PUT', 'portfolio-1448/' + path, { message: message, content: base64, branch: 'main' });
  }
  function deleteFile(path, message) {
    return call('GET', 'portfolio-1448/' + path).then(function (d) {
      return call('DELETE', 'portfolio-1448/' + path, { message: message, sha: d.sha, branch: 'main' });
    }).catch(function (e) { if (e.status === 404) return null; throw e; });
  }
  function newId() { var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()) + '-' + Math.random().toString(36).slice(2, 6); }

  /* إضافة تقرير: content = base64 */
  function addReport(meta, ext, base64) {
    var id = newId(), file = 'nafs-reports/' + id + '.' + ext;
    var rec = { id: id, title: meta.title, source: meta.source, kind: meta.kind, file: file, date: new Date().toISOString(), notes: meta.notes || '' };
    if (meta.names === true || meta.names === false) rec.names = meta.names;
    return putFile(file, base64, 'ملف الإنجاز: إضافة تقرير نافس — ' + meta.title).then(function () {
      return writeIndex(function (j) { j.reports.push(rec); }, 'ملف الإنجاز: تحديث فهرس تقارير نافس');
    }).then(function () { return rec; });
  }
  function removeReport(rec) {
    return deleteFile(rec.file, 'ملف الإنجاز: حذف تقرير نافس — ' + rec.title).then(function () {
      return writeIndex(function (j) { j.reports = j.reports.filter(function (r) { return r.id !== rec.id; }); }, 'ملف الإنجاز: تحديث فهرس تقارير نافس');
    });
  }

  /* مجموعة عامة بفهرس مستقل (مثل مقاطع الفيديو) */
  function collection(indexPath, folder, label) {
    function rIndex() {
      return call('GET', indexPath).then(function (d) {
        var j = {}; try { j = JSON.parse(utf8b64(d.content)); } catch (e) {}
        if (!Array.isArray(j.items)) j.items = [];
        return { data: j, sha: d.sha };
      }).catch(function (e) { if (e.status === 404 && token()) return { data: { items: [] }, sha: '' }; throw e; });
    }
    function wIndex(mutate, message, tries) {
      return rIndex().then(function (cur) {
        mutate(cur.data);
        var body = { message: message, content: b64utf8(JSON.stringify(cur.data, null, 1) + '\n'), branch: 'main' };
        if (cur.sha) body.sha = cur.sha;
        return call('PUT', indexPath, body).then(function () { return cur.data; });
      }).catch(function (e) {
        if (e.message === 'conflict' && !tries) return wIndex(mutate, message, 1);
        throw e;
      });
    }
    /* files: [{ext, base64, role}] — role: main | thumb */
    function add(meta, files) {
      var id = newId(), rec = {}; for (var k in meta) rec[k] = meta[k];
      rec.id = id; rec.added = new Date().toISOString();
      var chain = Promise.resolve();
      (files || []).forEach(function (f) {
        var path = folder + '/' + id + (f.role === 'thumb' ? '-thumb' : '') + '.' + f.ext;
        if (f.role === 'thumb') rec.thumb = path; else rec.file = path;
        chain = chain.then(function () { return putFile(path, f.base64, 'ملف الإنجاز: ' + label + ' — ' + meta.title); });
      });
      return chain.then(function () {
        return wIndex(function (j) { j.items.push(rec); }, 'ملف الإنجاز: تحديث فهرس ' + label);
      }).then(function () { return rec; });
    }
    function remove(rec) {
      var chain = Promise.resolve();
      [rec.file, rec.thumb].forEach(function (pth) {
        if (pth && pth.indexOf(folder + '/') === 0) chain = chain.then(function () { return deleteFile(pth, 'ملف الإنجاز: حذف ' + label + ' — ' + rec.title); });
      });
      return chain.then(function () {
        return wIndex(function (j) { j.items = j.items.filter(function (r) { return r.id !== rec.id; }); }, 'ملف الإنجاز: تحديث فهرس ' + label);
      });
    }
    function update(id, changes) {
      return wIndex(function (j) { j.items.forEach(function (r) { if (r.id === id) for (var k in changes) r[k] = changes[k]; }); }, 'ملف الإنجاز: تعديل ' + label);
    }
    return { readIndex: rIndex, add: add, remove: remove, update: update };
  }

  window.PFStore = { token: token, setToken: setToken, readIndex: readIndex, addReport: addReport, removeReport: removeReport, b64utf8: b64utf8, collection: collection,
    shared: collection('portfolio-1448/shared-reports/index.json', 'shared-reports', 'شاهد معروض للمدير') };
})();
