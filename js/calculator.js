// ── RV Detailing – Dynamischer Preisrechner ──────────────────────────────────

const BASE = [39, 89, 159, 299]; // Paket 1–4 Basispreis

// Fahrzeugtyp-Aufschläge [P1, P2, P3, P4]
const VEHICLE_ADD = {
  'Kleinwagen':             [0,   0,   0,   0  ],
  'Limousine':              [5,   15,  30,  50 ],
  'Kombi':                  [5,   15,  30,  50 ],
  'Coupé / Cabrio':         [5,   15,  30,  50 ],
  'SUV / Geländewagen':     [10,  20,  35,  55 ],
  'Sprinter / Transporter': [5,   15,  30,  50 ],
  '7-Sitzer / Minivan':     [0,   10,  10,  10 ],
  '9-Sitzer / Großvan':     [15,  40,  50,  90 ],
  'Wohnmobil (bis 6m)':     null,
  'Wohnmobil (ab 6m)':      null,
  'Wohnwagen':              null,
  'Bus / Kleinbus':         null,
  'Truck / LKW':            null,
};

// Zustandsaufschläge in %
const CONDITION_PCT = {
  'Sehr gepflegt':          0,
  'Gepflegt':               7,
  'Verschmutzt':            15,
  'Stark verschmutzt':      25,
  'Sehr stark verschmutzt': 37.5,
};

// Hinweise und Weiterleitungen
const VEHICLE_NOTES = {
  'Sprinter / Transporter':
    '⚠️ Laderaum-Reinigung auf Anfrage – Preis gilt für Fahrgastraum (2–3 Sitze).',
  '9-Sitzer / Großvan':
    'ℹ️ Preis gilt für vollständige Bestuhlung. Bei Leer-Ausbau bitte anfragen.',
  'Wohnmobil (bis 6m)':
    '🚐 Wohnmobile haben eine eigene Seite mit individuellem Konfigurator – Bereich für Bereich konfigurierbar. <a href="wohnmobil.html" style="color:var(--gold);font-weight:700;text-decoration:underline;">Zum Wohnmobil-Konfigurator →</a>',
  'Wohnmobil (ab 6m)':
    '🏕️ Große Wohnmobile werden individuell kalkuliert. <a href="wohnmobil.html" style="color:var(--gold);font-weight:700;text-decoration:underline;">Zum Wohnmobil-Konfigurator →</a>',
};

function calcPrice(base, vehicleAdd, condPct) {
  return Math.ceil((base + vehicleAdd) * (1 + condPct / 100));
}

function renderPrices(vehicleKey, condKey) {
  const adds  = VEHICLE_ADD[vehicleKey];
  const pct   = CONDITION_PCT[condKey];
  const cards = document.querySelectorAll('.paket-card[data-paket]');

  cards.forEach(card => {
    const idx      = parseInt(card.dataset.paket) - 1;
    const priceEl  = card.querySelector('.paket-price');
    if (!priceEl) return;

    if (adds === null) {
      // Fahrzeugtyp noch nicht konfiguriert
      priceEl.innerHTML = '<span style="font-size:1.1rem;color:var(--text-muted)">Auf Anfrage</span>';
      return;
    }

    const final = calcPrice(BASE[idx], adds[idx], pct);
    const hasCondBonus = pct > 0;
    const hasVehicleBonus = adds[idx] > 0;

    let badge = '';
    if (hasCondBonus || hasVehicleBonus) {
      badge = `<span style="
        font-size:0.65rem;font-family:'Montserrat',sans-serif;font-weight:700;
        letter-spacing:0.1em;text-transform:uppercase;
        background:rgba(255,191,0,0.12);border:1px solid rgba(255,191,0,0.3);
        border-radius:50px;padding:2px 8px;color:var(--gold);
        vertical-align:middle;margin-left:8px;
      ">angepasst</span>`;
    }

    priceEl.innerHTML = `ab ${final} €${badge} <small>*</small>`;
  });

  // Fahrzeug-Hinweis anzeigen
  const noteEl = document.getElementById('vehicle-note');
  if (noteEl) {
    const note = VEHICLE_NOTES[vehicleKey] || '';
    noteEl.innerHTML = note;
    noteEl.style.display = note ? 'block' : 'none';
  }

  // Condition-Label einfärben
  const condLabel = document.getElementById('calc-cond-label');
  if (condLabel && pct > 0) {
    condLabel.textContent = `+${pct}% Aufschlag`;
    condLabel.style.color = pct >= 37.5 ? '#ff6b6b' : pct >= 15 ? 'var(--gold)' : '#4caf50';
  } else if (condLabel) {
    condLabel.textContent = 'kein Aufschlag';
    condLabel.style.color = '#4caf50';
  }
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
