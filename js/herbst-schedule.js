// ── Herbst-Aktion: Zeitsteuerung ──────────────────────────────
// Gesperrt bis 20.09.2026 23:59  ·  aktiv 21.09.–04.10.2026 (genau 2 Wochen)
// ·  danach automatisch ausgeblendet.
// Läuft komplett clientseitig, weil die Seite statisch ist (GitHub Pages).
//
// Betroffene Elemente (per id):
//   herbst-band        – Startseiten-Banner (das <a> selbst, NICHT die ganze
//                        Section, damit der Winter-Teaser daneben erhalten bleibt)
//   pakete-herbst-card – Herbst-Karte in der Paket-Vorschau (Startseite)
//   herbst-aktion      – Herbst-Karte auf der Buchungsseite
(function () {
  var START = new Date('2026-09-21T00:00:00');
  var END   = new Date('2026-10-04T23:59:59');
  var IDS   = ['herbst-band', 'pakete-herbst-card', 'herbst-aktion'];

  function run() {
    var now = new Date();

    // Nach dem 04.10.: Angebot komplett weg
    if (now > END) {
      IDS.forEach(function (id) {
        var e = document.getElementById(id);
        if (e) e.style.display = 'none';
      });
      return;
    }

    // Ab dem 21.09.: aktiv – Standard-Markup unverändert lassen
    if (now >= START) return;

    // Vor dem 21.09.: gesperrt darstellen (nicht buchbar)
    IDS.forEach(function (id) {
      var root = document.getElementById(id);
      if (!root) return;

      // Klick/Navigation auf einem verlinkten Banner unterbinden
      if (root.tagName === 'A') root.style.pointerEvents = 'none';

      var badge = root.querySelector('[data-herbst-badge]');
      if (badge) badge.textContent = '🔒 Startet 21.09.';

      var label = root.querySelector('[data-herbst-band-label]');
      if (label) label.textContent = 'Herbst-Aktion · startet 21.09.';

      var cta = root.querySelector('[data-herbst-cta]');
      if (cta) {
        cta.style.pointerEvents = 'none';   // blockt Buchung + Upsell-Popup
        cta.style.opacity = '0.55';
        cta.style.cursor = 'not-allowed';
        cta.textContent = '🔒 Ab 21.09. verfügbar';
      }

      var deadlines = root.querySelectorAll('[data-herbst-deadline]');
      Array.prototype.forEach.call(deadlines, function (d) {
        d.innerHTML = '🔒 Startet <strong>21.09.</strong> – dann genau 2 Wochen (bis 04.10.)';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
