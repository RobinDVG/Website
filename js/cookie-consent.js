// ── Cookie Consent Banner ──
(function () {
  var CONSENT_KEY = 'rv_cookie_consent';

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; }
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ consent: value, date: new Date().toISOString() }));
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.style.display = 'none';
  }

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML =
      '<div class="cookie-inner">' +
        '<p>Wir verwenden Cookies und externe Dienste (Google Maps, Cal.com, PayPal) zur Bereitstellung unserer Buchungsfunktionen. ' +
        '<a href="datenschutz.html" style="color:var(--gold);text-decoration:underline;">Mehr erfahren</a></p>' +
        '<div class="cookie-buttons">' +
          '<button id="cookie-accept" class="btn btn-gold" style="padding:10px 24px;font-size:0.82rem;">Alle akzeptieren</button>' +
          '<button id="cookie-necessary" class="btn btn-dark" style="padding:10px 24px;font-size:0.82rem;">Nur notwendige</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      setConsent('all');
      hideBanner();
    });
    document.getElementById('cookie-necessary').addEventListener('click', function () {
      setConsent('necessary');
      hideBanner();
    });
  }

  window.rvCookieConsent = function () {
    var c = getConsent();
    return c && c.consent === 'all';
  };

  window.rvResetCookieConsent = function () {
    localStorage.removeItem(CONSENT_KEY);
    location.reload();
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (!getConsent()) showBanner();
  });
})();
