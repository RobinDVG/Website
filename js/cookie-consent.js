// ── Cookie Consent Banner (DSGVO / TTDSG) ──
(function () {
  var CONSENT_KEY = 'rv_cookie_consent';
  var COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 Jahr

  // Liest aus localStorage UND document.cookie (Fallback für file://)
  function getConsent() {
    try {
      var ls = localStorage.getItem(CONSENT_KEY);
      if (ls) return JSON.parse(ls);
    } catch (e) {}
    // Fallback: echtes Cookie auslesen
    var match = document.cookie.match('(?:^|;)\\s*' + CONSENT_KEY + '=([^;]+)');
    if (match) {
      try { return JSON.parse(decodeURIComponent(match[1])); } catch (e) {}
    }
    return null;
  }

  // Schreibt in localStorage UND document.cookie
  function setConsent(value) {
    var data = {
      consent: value,
      date: new Date().toISOString(),
      version: 1
    };
    var json = JSON.stringify(data);
    try { localStorage.setItem(CONSENT_KEY, json); } catch (e) {}
    // Echtes Cookie als Backup (kein Tracking, nur UI-State)
    document.cookie = CONSENT_KEY + '=' + encodeURIComponent(json) +
      '; max-age=' + COOKIE_MAX_AGE +
      '; path=/' +
      '; SameSite=Strict';
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
          '<h3>Datenschutz-Einstellungen</h3>' +
          '<p>Diese Website speichert keine Tracking-Daten und sendet nichts an externe Werbedienste. Wir nutzen ausschließlich technisch notwendige Einstellungen im Browser.</p>' +
        '</div>' +

        '<div class="cookie-category">' +
          '<div class="cookie-cat-header">' +
            '<strong>Technisch notwendig</strong>' +
            '<span class="cookie-badge-required">Immer aktiv</span>' +
          '</div>' +
          '<p>Speichert deine Einstellungen (z.B. diese Zustimmung und den Status des Gewinnspiel-Banners) lokal in deinem Browser. Diese Daten verlassen nie dein Gerät.</p>' +
        '</div>' +

        '<div class="cookie-category">' +
          '<div class="cookie-cat-header">' +
            '<strong>Externe Dienste</strong>' +
            '<label class="cookie-toggle"><input type="checkbox" id="cookie-functional" checked /><span class="cookie-slider"></span></label>' +
          '</div>' +
          '<p>WhatsApp-Links, Cal.com (Terminbuchung) und externe Inhalte. Diese werden erst beim Klick aktiv und können in deinem Browser Einstellungen speichern.</p>' +
        '</div>' +

        '<div class="cookie-actions">' +
          '<button id="cookie-accept-all" class="btn btn-gold" style="padding:12px 28px;font-size:0.85rem;">Alles akzeptieren</button>' +
          '<button id="cookie-save" class="btn btn-dark" style="padding:12px 28px;font-size:0.85rem;">Auswahl speichern</button>' +
          '<button id="cookie-reject" style="background:none;border:none;color:var(--text-muted);font-size:0.8rem;cursor:pointer;padding:8px;text-decoration:underline;">Nur notwendige</button>' +
        '</div>' +

        '<p class="cookie-legal">Weitere Informationen: <a href="datenschutz.html" style="color:var(--gold);">Datenschutzerklärung</a>. Einstellungen jederzeit über „Cookie-Einstellungen" im Footer ändern.</p>' +
      '</div>';

    document.body.appendChild(overlay);

    document.getElementById('cookie-accept-all').addEventListener('click', function () {
      setConsent('all');
      hideOverlay();
      window.dispatchEvent(new CustomEvent('rv_consent_given', { detail: { all: true } }));
    });

    document.getElementById('cookie-save').addEventListener('click', function () {
      var functional = document.getElementById('cookie-functional').checked;
      setConsent(functional ? 'all' : 'necessary');
      hideOverlay();
      if (functional) window.dispatchEvent(new CustomEvent('rv_consent_given', { detail: { all: true } }));
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
    try { localStorage.removeItem(CONSENT_KEY); } catch (e) {}
    document.cookie = CONSENT_KEY + '=; max-age=0; path=/';
    location.reload();
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (!getConsent()) showOverlay();
  });
})();
