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
      const res = await fetch(c.apiUrl, init);
      if (!res.ok) {
        const err = await res.text();
        console.warn('[QMagic] HTTP', res.status, err);
        return { ok: false, status: res.status };
      }
      return { ok: true };
    } catch (err) {
      console.warn('[QMagic] Network error', err);
      return { ok: false, error: err };
    }
  }

  /** @deprecated use submitLead — ждёт ответ перед редиректом */
  function submitLeadBackground(formId, formTitle, fields) {
    return submitLead(formId, formTitle, fields);
  }

  global.QMagic = { submitLead, submitLeadBackground };
})(window);
