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

    try {
      const res = await fetch(c.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Qmagic-Secret': c.secret,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000),
      });
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

  /** Не блокирует UI — отправка в фоне */
  function submitLeadBackground(formId, formTitle, fields) {
    submitLead(formId, formTitle, fields).catch(function () {});
  }

  global.QMagic = { submitLead, submitLeadBackground };
})(window);
