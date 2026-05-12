// ── Cookie Consent Banner (DSGVO / TTDSG) ──
(function () {
  var CONSENT_KEY = 'rv_cookie_consent';

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; }
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      consent: value,
      date: new Date().toISOString(),
      version: 1
    }));
  }

  function hideOverlay() {
    var overlay = document.getElementById('cookie-overlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showOverlay() {
    document.body.style.overflow = 'hidden';

    var overlay = document.createElement('div');
    overlay.id = 'cookie-overlay';
    overlay.innerHTML =
      '<div class="cookie-modal">' +
        '<div class="cookie-modal-header">' +
          '<h3>Cookie-Einstellungen</h3>' +
          '<p>Wir respektieren deine Privatsphäre. Bitte wähle, welche Cookies du zulassen möchtest.</p>' +
        '</div>' +

        '<div class="cookie-category">' +
          '<div class="cookie-cat-header">' +
            '<strong>Technisch notwendig</strong>' +
            '<span class="cookie-badge-required">Immer aktiv</span>' +
          '</div>' +
          '<p>Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden. Sie speichern z.B. deine Cookie-Einstellungen.</p>' +
        '</div>' +

        '<div class="cookie-category">' +
          '<div class="cookie-cat-header">' +
            '<strong>Externe Dienste (Funktional)</strong>' +
            '<label class="cookie-toggle"><input type="checkbox" id="cookie-functional" checked /><span class="cookie-slider"></span></label>' +
          '</div>' +
          '<p>Google Maps (Adresseingabe & Entfernung), Cal.com (Terminbuchung) und PayPal (Zahlung). Diese Dienste sind für den Buchungsprozess erforderlich und können Cookies setzen.</p>' +
        '</div>' +

        '<div class="cookie-actions">' +
          '<button id="cookie-accept-all" class="btn btn-gold" style="padding:12px 28px;font-size:0.85rem;">Alle akzeptieren</button>' +
          '<button id="cookie-save" class="btn btn-dark" style="padding:12px 28px;font-size:0.85rem;">Auswahl speichern</button>' +
          '<button id="cookie-reject" style="background:none;border:none;color:var(--text-muted);font-size:0.8rem;cursor:pointer;padding:8px;text-decoration:underline;">Nur notwendige</button>' +
        '</div>' +

        '<p class="cookie-legal">Mit deiner Auswahl stimmst du der Verarbeitung gemäß unserer <a href="datenschutz.html" style="color:var(--gold);">Datenschutzerklärung</a> zu. Du kannst deine Einstellungen jederzeit über „Cookie-Einstellungen" im Footer ändern.</p>' +
      '</div>';

    document.body.appendChild(overlay);

    document.getElementById('cookie-accept-all').addEventListener('click', function () {
      setConsent('all');
      hideOverlay();
    });

    document.getElementById('cookie-save').addEventListener('click', function () {
      var functional = document.getElementById('cookie-functional').checked;
      setConsent(functional ? 'all' : 'necessary');
      hideOverlay();
    });

    document.getElementById('cookie-reject').addEventListener('click', function () {
      setConsent('necessary');
      hideOverlay();
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
    if (!getConsent()) showOverlay();
  });
})();
