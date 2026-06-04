(function () {
  function trackCompleteRegistration() {
    if (typeof fbq === 'function') {
      fbq('track', 'CompleteRegistration');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackCompleteRegistration);
  } else {
    trackCompleteRegistration();
  }
})();
