// ── RV Detailing – Dynamischer Preisrechner ──────────────────────────────────
//
// Preis = Arbeitszeit × Fahrzeugfaktor × Stundensatz + Material,
// nach unten begrenzt durch den Mindestpreis des jeweiligen Fahrzeugs.
//
// Zum Nachjustieren reicht es, RATE oder einzelne Werte in HOURS zu ändern –
// die Aufschläge ergeben sich daraus von selbst.

const RATE = 50; // Ziel-Stundensatz in € (Kleinunternehmer §19, keine MwSt)

// Arbeitszeit in Stunden für einen Kleinwagen, Paket 1–4
// Spalten: [sehr gepflegt, gepflegt, verschmutzt, stark, sehr stark]
const HOURS = [
  [0.50, 0.90, 1.10, 1.35,  1.65],
  [1.50, 2.36, 2.83, 3.54,  4.25],
  [3.00, 3.86, 4.40, 5.72,  7.04],
  [7.00, 8.00, 9.00, 10.50, 12.40],
];

// Materialkosten in € für einen Kleinwagen, gleiche Spalten wie HOURS
const MATERIAL = [
  [3,  4,  5,  6,  7],
  [8,  10, 12, 14, 16],
  [22, 25, 28, 32, 36],
  [40, 45, 50, 55, 60],
];

// Anteil [innen, außen] je Paket. Bestimmt, wie stark Sitzanzahl
// bzw. Lackfläche auf den Preis durchschlagen: Paket 1 ist reine
// Innenarbeit, bei Paket 4 dominiert die Politur.
const MIX = [
  [1.00, 0.00],
  [0.60, 0.40],
  [0.55, 0.45],
  [0.35, 0.65],
];

// f   = [Innenfaktor, Außenfaktor] relativ zum Kleinwagen
// min = Mindestpreis je Paket 1–4 (bisheriger Website-Preis, damit
//       kein bestehender Einstiegspreis sinkt)
// p5  = Paket 5 ist ein Festpreis ohne Zustandsaufschlag
const VEHICLES = {
  'Kleinwagen':             { f: [1.00, 1.00], min: [39, 99,  179, 399], p5: 249 },
  'Limousine':              { f: [1.15, 1.20], min: [44, 119, 219, 479], p5: 299 },
  'Kombi':                  { f: [1.28, 1.25], min: [44, 119, 219, 479], p5: 299 },
  'Coupé':                  { f: [1.05, 1.18], min: [44, 119, 219, 479], p5: 299 },
  'Cabrio':                 { f: [1.15, 1.30], min: [44, 119, 219, 479], p5: 299 },
  'SUV / Geländewagen':     { f: [1.30, 1.38], min: [51, 129, 229, 509], p5: 309 },
  'Sprinter / Transporter': { f: [1.10, 1.85], min: [47, 119, 219, 479], p5: 249 },
  '7-Sitzer / Minivan':     { f: [1.50, 1.32], min: [51, 134, 239, 519], p5: 349 },
  '9-Sitzer / Großvan':     { f: [1.80, 1.55], min: [59, 154, 249, 549], p5: 399 },
  'Bus / Kleinbus':         null,
  'Truck / LKW':            null,
};

const CONDITIONS = [
  'Sehr gepflegt',
  'Gepflegt',
  'Verschmutzt',
  'Stark verschmutzt',
  'Sehr stark verschmutzt',
];

// Oberste Stufe wird nicht beziffert: kommt praktisch nie vor und die
// Fälle sind untereinander zu verschieden für einen Pauschalpreis.
const ON_REQUEST_INDEX = 4;

// Hinweise und Weiterleitungen
const VEHICLE_NOTES = {
  'Sprinter / Transporter':
    '⚠️ Laderaum-Reinigung auf Anfrage – Preis gilt für Fahrgastraum (2–3 Sitze).',
  '9-Sitzer / Großvan':
    'ℹ️ Preis gilt für vollständige Bestuhlung. Bei Leer-Ausbau bitte anfragen.',
  'Cabrio':
    'ℹ️ Verdeckpflege ist enthalten. Verdeck-Imprägnierung auf Anfrage.',
};

// Fahrzeugfaktor für ein Paket: gewichtetes Mittel aus Innen und Außen
function vehicleFactor(veh, paketIdx) {
  return MIX[paketIdx][0] * veh.f[0] + MIX[paketIdx][1] * veh.f[1];
}

function calcPrice(veh, paketIdx, condIdx) {
  const f = vehicleFactor(veh, paketIdx);
  // Material steigt mit der Fahrzeuggröße, aber gedämpft
  const material = MATERIAL[paketIdx][condIdx] * (1 + (f - 1) * 0.6);
  const modelled = Math.ceil(HOURS[paketIdx][condIdx] * f * RATE + material);
  return Math.max(veh.min[paketIdx], modelled);
}

function renderPrices(vehicleKey, condKey) {
  const veh     = VEHICLES[vehicleKey];
  const condIdx = Math.max(0, CONDITIONS.indexOf(condKey));
  const cards   = document.querySelectorAll('.paket-card[data-paket]');

  cards.forEach(card => {
    const idx     = parseInt(card.dataset.paket) - 1;
    const priceEl = card.querySelector('.paket-price');
    const linkEl  = card.querySelector('a[href^="termin.html"]');
    if (!priceEl) return;

    const baseHref = 'termin.html?paket=' + card.dataset.paket;

    // Fahrzeuge ohne Kalkulation (Bus, LKW)
    if (!veh) {
      priceEl.innerHTML = '<span style="font-size:1.1rem;color:var(--text-muted)">Auf Anfrage</span>';
      if (linkEl) linkEl.href = baseHref;
      return;
    }

    // Paket 5 (Smoker Detox): Festpreis, Verschmutzung ist Voraussetzung
    if (idx === 4) {
      priceEl.innerHTML = `ab ${veh.p5} € <small>*</small>`;
      if (linkEl) {
        linkEl.href = baseHref
          + '&fahrzeug=' + encodeURIComponent(vehicleKey)
          + '&preis=' + veh.p5;
      }
      return;
    }

    // Extremfälle werden individuell besichtigt statt beziffert
    if (condIdx === ON_REQUEST_INDEX) {
      priceEl.innerHTML = '<span style="font-size:1.1rem;color:var(--text-muted)">Preis auf Anfrage</span>';
      if (linkEl) {
        linkEl.href = baseHref
          + '&fahrzeug=' + encodeURIComponent(vehicleKey)
          + '&zustand=' + encodeURIComponent(condKey);
      }
      return;
    }

    const final = calcPrice(veh, idx, condIdx);
    const adjusted = final > veh.min[idx] || vehicleFactor(veh, idx) > 1;

    const badge = adjusted ? `<span style="
        font-size:0.65rem;font-family:'Montserrat',sans-serif;font-weight:700;
        letter-spacing:0.1em;text-transform:uppercase;
        background:rgba(255,191,0,0.12);border:1px solid rgba(255,191,0,0.3);
        border-radius:50px;padding:2px 8px;color:var(--gold);
        vertical-align:middle;margin-left:8px;
      ">angepasst</span>` : '';

    priceEl.innerHTML = `ab ${final} €${badge} <small>*</small>`;

    if (linkEl) {
      linkEl.href = baseHref
        + '&fahrzeug=' + encodeURIComponent(vehicleKey)
        + '&zustand=' + encodeURIComponent(condKey)
        + '&preis=' + final;
    }
  });

  // Fahrzeug-Hinweis anzeigen
  const noteEl = document.getElementById('vehicle-note');
  if (noteEl) {
    const note = VEHICLE_NOTES[vehicleKey] || '';
    noteEl.innerHTML = note;
    noteEl.style.display = note ? 'block' : 'none';
  }

  // Zustandslabel: der Aufschlag fällt je Paket unterschiedlich aus,
  // deshalb die Spanne statt eines einzelnen Prozentwerts
  const condLabel = document.getElementById('calc-cond-label');
  if (!condLabel) return;

  if (condIdx === ON_REQUEST_INDEX) {
    condLabel.textContent = 'individuell';
    condLabel.style.color = '#ff6b6b';
    return;
  }
  if (!veh || condIdx === 0) {
    condLabel.textContent = 'kein Aufschlag';
    condLabel.style.color = '#4caf50';
    return;
  }

  const steps = [0, 1, 2, 3].map(i => {
    const from = calcPrice(veh, i, 0);
    return Math.round((calcPrice(veh, i, condIdx) / from - 1) * 100);
  }).filter(p => p > 0);

  if (!steps.length) {
    condLabel.textContent = 'kein Aufschlag';
    condLabel.style.color = '#4caf50';
    return;
  }

  const lo = Math.min(...steps);
  const hi = Math.max(...steps);
  condLabel.textContent = lo === hi ? `+${lo}% Aufschlag` : `je nach Paket +${lo}–${hi}%`;
  condLabel.style.color = hi >= 60 ? '#ff6b6b' : hi >= 30 ? 'var(--gold)' : '#4caf50';
}

function initCalculator() {
  const vehicleSel = document.getElementById('calc-vehicle');
  const condSel    = document.getElementById('calc-condition');
  if (!vehicleSel || !condSel) return;

  function update() {
    renderPrices(vehicleSel.value, condSel.value);
  }

  vehicleSel.addEventListener('change', update);
  condSel.addEventListener('change', update);
  update(); // Initialrender
}

document.addEventListener('DOMContentLoaded', initCalculator);
