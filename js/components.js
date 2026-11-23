// ── RV Detailing – zentrale Navigation & Footer ───────────────────────────
// Wird in jede Seite über die Platzhalter <div id="site-nav"></div> und
// <div id="site-footer"></div> injiziert. Menü also NUR hier pflegen.
// Muss VOR js/main.js geladen werden (main.js verdrahtet Hamburger/Scroll).
(function () {

  var NAV = `
  <nav class="navbar">
    <div class="container">
      <div class="navbar-inner">
        <a href="index.html" class="logo">
          RV – <span>Detailing</span>
          <small>Professionelle Fahrzeugaufbereitung</small>
        </a>
        <ul class="nav-links">
          <li><a href="index.html">Start</a></li>
          <li class="has-dropdown">
            <a href="dienstleistungen.html">Leistungen <span class="nav-caret">▾</span></a>
            <div class="nav-dropdown">
              <div class="nav-dropdown-col">
                <span class="nav-dropdown-title">Aufbereitung</span>
                <a href="innen.html">Innenaufbereitung</a>
                <a href="aussen.html">Außen &amp; Politur</a>
                <a href="versiegelungen.html">Keramik-Versiegelung</a>
                <a href="motorraum.html">Motorraum</a>
              </div>
              <div class="nav-dropdown-col">
                <span class="nav-dropdown-title">Unterboden &amp; Rost</span>
                <a href="unterboden.html">Unterboden &amp; Rostschutz</a>
                <span class="nav-dropdown-title" style="margin-top:16px;">Werkstatt</span>
                <a href="werkstatt.html">Öl · Reifen · Reparaturen</a>
              </div>
              <div class="nav-dropdown-col">
                <span class="nav-dropdown-title">Weitere</span>
                <a href="wohnmobil.html">Wohnmobil</a>
                <a href="motorrad.html">Motorrad</a>
                <a href="folierung.html">Folienpflege</a>
                <a href="exclusive.html">Exclusive</a>
              </div>
            </div>
          </li>
          <li><a href="buchen.html">Preise &amp; Buchen</a></li>
          <li><a href="shop.html">Shop</a></li>
          <li><a href="story.html">Über uns</a></li>
          <li><a href="index.html#kontakt">Kontakt</a></li>
          <li><a href="buchen.html" class="btn btn-gold">Termin buchen</a></li>
        </ul>
        <div class="hamburger" aria-label="Menü öffnen"><span></span><span></span><span></span></div>
      </div>
    </div>
  </nav>

  <div class="mobile-menu">
    <a href="index.html">Start</a>
    <div class="mm-group">Leistungen</div>
    <a href="innen.html">Innenaufbereitung</a>
    <a href="aussen.html">Außen &amp; Politur</a>
    <a href="versiegelungen.html">Keramik-Versiegelung</a>
    <a href="motorraum.html">Motorraum</a>
    <a href="unterboden.html">Unterboden &amp; Rost</a>
    <a href="werkstatt.html">Werkstatt · Öl/Reifen/Rep.</a>
    <a href="wohnmobil.html">Wohnmobil</a>
    <a href="motorrad.html">Motorrad</a>
    <a href="folierung.html">Folienpflege</a>
    <a href="exclusive.html">Exclusive</a>
    <div class="mm-group">Mehr</div>
    <a href="buchen.html">Preise &amp; Buchen</a>
    <a href="shop.html">Shop</a>
    <a href="story.html">Über uns</a>
    <a href="index.html#kontakt">Kontakt</a>
    <a href="buchen.html" class="btn btn-gold">Termin buchen</a>
  </div>`;

  var FOOTER = `
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo">RV – <span>Detailing</span></a>
          <p>Professionelle Fahrzeugaufbereitung mit Leidenschaft und Liebe zum Detail. Bequem mit Abhol- &amp; Bring-Service.</p>
          <div style="margin-top:12px;">
            <a href="https://www.instagram.com/rvs_detailer/" target="_blank" rel="noopener" style="color:var(--gold);font-size:0.9rem;">Instagram →</a>
          </div>
        </div>
        <div>
          <div class="footer-col-title">Leistungen</div>
          <ul class="footer-links">
            <li><a href="innen.html">Innenaufbereitung</a></li>
            <li><a href="aussen.html">Außen &amp; Politur</a></li>
            <li><a href="versiegelungen.html">Keramik-Versiegelung</a></li>
            <li><a href="unterboden.html">Unterboden &amp; Rost</a></li>
            <li><a href="werkstatt.html">Werkstatt</a></li>
            <li><a href="buchen.html">Pakete &amp; Preise</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-col-title">Unternehmen</div>
          <ul class="footer-links">
            <li><a href="story.html">Über uns</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="index.html#reviews">Bewertungen</a></li>
            <li><a href="index.html#kontakt">Kontakt</a></li>
            <li><a href="buchen.html">Termin buchen</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-col-title">Rechtliches</div>
          <ul class="footer-links">
            <li><a href="impressum.html">Impressum</a></li>
            <li><a href="datenschutz.html">Datenschutz</a></li>
            <li><a href="agb.html">AGB</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 RV – Detailing. Alle Rechte vorbehalten.</p>
        <div style="display:flex;gap:20px;flex-wrap:wrap;">
          <a href="impressum.html">Impressum</a>
          <a href="datenschutz.html">Datenschutz</a>
          <a href="agb.html">AGB</a>
          <a href="https://www.instagram.com/rvs_detailer/" target="_blank" rel="noopener">Instagram</a>
          <a href="javascript:void(0)" onclick="if(window.rvResetCookieConsent)rvResetCookieConsent()">Cookie-Einstellungen</a>
        </div>
      </div>
    </div>
  </footer>`;

  var navMount = document.getElementById('site-nav');
  if (navMount) navMount.innerHTML = NAV;
  var footMount = document.getElementById('site-footer');
  if (footMount) footMount.innerHTML = FOOTER;

  // Unterseiten (ohne das Video-Hero der Startseite) → Navbar dauerhaft solide
  if (!document.querySelector('.hero-video')) {
    var nb = document.querySelector('.navbar');
    if (nb) nb.classList.add('nav-solid');
  }

  // Aktiven Menüpunkt markieren
  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!file) file = 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (href && href === file) a.classList.add('active');
  });

})();
