/**
 * QMagic — отправка заявок с сайта в Telegram (мультитенант).
 * window.QMAGIC = { apiUrl, site, secret }
 */
(function (global) {
  function cfg() {
    return global.QMAGIC || null;
  }

  async function submitLead(formId, formTitle, fields) {
    const c = cfg();
    if (!c || !c.apiUrl || !c.site || !c.secret) {
      console.warn('[QMagic] Not configured');
      return { ok: false, skipped: true };
    }

    const payload = {
      site: c.site,
      form: formId,
      form_title: formTitle || formId,
      fields: fields || {},
      meta: {
        url: global.location.href,
        page: document.title || '',
      },
    };

    const urls = [c.apiUrl];
    if (c.apiUrl.indexOf('/api/lead.php') === -1) {
      urls.push('/api/lead.php');
    }

    let lastResult = { ok: false };
    for (let i = 0; i < urls.length; i++) {
      const init = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Qmagic-Secret': c.secret,
        },
        body: JSON.stringify(payload),
        keepalive: true,
      };
      if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
        init.signal = AbortSignal.timeout(12000);
      }

      try {
        const res = await fetch(urls[i], init);
        if (res.ok) {
          return { ok: true };
        }
        const err = await res.text();
        console.warn('[QMagic] HTTP', res.status, urls[i], err);
        lastResult = { ok: false, status: res.status };
      } catch (err) {
        console.warn('[QMagic] Network error', urls[i], err);
        lastResult = { ok: false, error: err };
      }
    }
    return lastResult;
  }

  /** @deprecated use submitLead — ждёт ответ перед редиректом */
  function submitLeadBackground(formId, formTitle, fields) {
    return submitLead(formId, formTitle, fields);
  }

  global.QMagic = { submitLead, submitLeadBackground };
})(window);
