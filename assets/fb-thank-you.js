(function () {
  function trackCompleteRegistration() {
    if (typeof fbq === 'function') {
      fbq('track', 'CompleteRegistration');
    }
  }

  function bootstrapPixel(pixelId, done) {
    if (typeof fbq === 'function') {
      done();
      return;
    }
    var f = window;
    var b = document;
    var e = 'script';
    var v = 'https://connect.facebook.net/en_US/fbevents.js';
    var n;
    if (f.fbq) {
      done();
      return;
    }
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    var t = b.createElement(e);
    t.async = true;
    t.src = v;
    var s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
    fbq('init', pixelId);
    fbq('track', 'PageView');
    done();
  }

  var pixelId = (window.VOLKI_FB_PIXEL_ID || '').trim();
  if (pixelId) {
    bootstrapPixel(pixelId, trackCompleteRegistration);
  } else {
    trackCompleteRegistration();
  }
})();
