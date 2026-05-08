// ── RV Detailing – Wohnmobil Konfigurator ────────────────────────────────────

const MODULES = [
  { id: 'fahrerbereich', icon: '🚗', label: 'Fahrerbereich',
    desc: 'Cockpit, 2 Sitze, Pedale, Plastikbereiche an Türen, Scheiben vorne', price: 59 },
  { id: 'dinette', icon: '🛋️', label: 'Dinette / Sitzgruppe',
    desc: 'Sitzbereich hinten, Polster, Tisch', price: 29 },
  { id: 'kueche', icon: '🍳', label: 'Küche',
    desc: 'Arbeitsplatte, Schränke, Spüle & Geräte von innen', price: 39 },
  { id: 'bad', icon: '🚿', label: 'Bad / WC',
    desc: 'Toilette, Waschbecken, Dusche, Spiegel', price: 49 },
  { id: 'schlaf', icon: '🛏️', label: 'Schlafbereich',
    desc: 'Matratze reinigen, Schränke, Stauraum', price: 49 },
  { id: 'aussen', icon: '✨', label: 'Außenwäsche',
    desc: 'Komplette Karosserie, alle Fenster außen', price: 129 },
];

const EXTRAS = [
  { id: 'dachfenster',  label: 'Dachfenster reinigen (nur innen)',       price: 15 },
  { id: 'holz',         label: 'Holzreinigung & Holzwachs',              price: 39,  note: 'je nach Holzmenge' },
  { id: 'sv-nass',      label: 'Sitze vorne nassaugen',                  price: 58 },
  { id: 'sh-nass',      label: 'Sitze hinten nassaugen',                 price: 89,  note: 'je nach Sitzanzahl' },
  { id: 'sv-imp',       label: 'Sitze vorne imprägnieren',               price: 38 },
  { id: 'sh-imp',       label: 'Sitze hinten imprägnieren',              price: 69,  note: 'je nach Sitzanzahl' },
  { id: 'teppich-nass', label: 'Teppiche nassaugen',                     price: 49,  note: 'je nach Anzahl' },
  { id: 'teppich-imp',  label: 'Teppich-Imprägnierung',                  price: 39,  note: 'je nach Anzahl' },
  { id: 'fenster-in',   label: 'Fensterreinigung innen (alle)',          price: 9 },
  { id: 'tuerleisten',  label: 'Türleisten & Türbereiche komplett',      price: 29 },
  { id: 'stauk',        label: 'Stauklappen / Außenluken',               price: 49,  note: 'je nach Anzahl' },
  { id: 'scheiben-v',   label: 'Scheibenversiegelung vorne',             price: 9,   freeAt: 220 },
  { id: 'ceramic',      label: 'Ceramic Spray Versiegelung außen',       price: 59 },
  { id: 'motor',        label: 'Motorraum schonende Reinigung',          price: 49 },
  { id: 'finish-ohne',  label: 'Finish-Politur außen (exkl. Dach)',      price: 299, group: 'finish' },
  { id: 'finish-mit',   label: 'Finish-Politur außen (inkl. Dach)',      price: 399, group: 'finish' },
  { id: 'teer-ohne',    label: 'Teer-Entfernung mit Knete (ohne Dach)',  price: 79,  group: 'teer' },
  { id: 'teer-mit',     label: 'Teer-Entfernung mit Knete (mit Dach)',   price: 149, group: 'teer' },
];

const selModules = new Set();
const selExtras  = new Set();

// ── Helpers ──────────────────────────────────────────────────────────────────

function moduleTotal() {
  let t = 0;
  selModules.forEach(id => { const m = MODULES.find(x => x.id === id); if (m) t += m.price; });
  return t;
}

// ── Toggle handlers ──────────────────────────────────────────────────────────

function toggleModule(id) {
  selModules.has(id) ? selModules.delete(id) : selModules.add(id);
  syncUI();
}

function toggleExtra(id) {
  const extra = EXTRAS.find(e => e.id === id);
  if (selExtras.has(id)) {
    selExtras.delete(id);
  } else {
    if (extra.group) {
      EXTRAS.filter(e => e.group === extra.group).forEach(e => selExtras.delete(e.id));
    }
    selExtras.add(id);
  }
  syncUI();
}

// ── Sync UI ───────────────────────────────────────────────────────────────────

function syncUI() {
  const modSub = moduleTotal();
  let total = modSub;

  // Module cards
  document.querySelectorAll('.wm-mod-card').forEach(card => {
    const sel = selModules.has(card.dataset.id);
    card.classList.toggle('selected', sel);
    card.querySelector('.wm-check').textContent = sel ? '✓' : '';
  });

  // Extra rows
  document.querySelectorAll('.wm-extra-row').forEach(row => {
    const id    = row.dataset.id;
    const extra = EXTRAS.find(e => e.id === id);
    const sel   = selExtras.has(id);
    const isFree = !!(extra.freeAt && sel && modSub >= extra.freeAt);
    row.classList.toggle('checked', sel);
    row.querySelector('.wm-extra-box').textContent = sel ? '✓' : '';
    const ptag = row.querySelector('.wm-ptag');
    if (isFree) {
      ptag.innerHTML = '<span style="color:#4caf50;font-weight:700;">Gratis ✓</span>';
    } else {
      ptag.textContent = `ab ${extra.price} €`;
    }
    if (sel && !isFree) total += extra.price;
  });

  // Price sidebar
  const linesEl = document.getElementById('wm-price-lines');
  const totalEl = document.getElementById('wm-total');
  const items = [];

  selModules.forEach(id => {
    const m = MODULES.find(x => x.id === id);
    if (m) items.push({ label: m.label, price: m.price, free: false });
  });
  selExtras.forEach(id => {
    const e = EXTRAS.find(x => x.id === id);
    if (!e) return;
    const free = !!(e.freeAt && modSub >= e.freeAt);
    items.push({ label: e.label, price: e.price, free });
  });

  if (!linesEl || !totalEl) return;

  if (items.length === 0) {
    linesEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.82rem;text-align:center;padding:12px 0;">Noch nichts ausgewählt.</p>';
    totalEl.textContent = '0 €';
  } else {
    linesEl.innerHTML = items.map(it => `
      <div class="wm-price-line">
        <span>${it.label}</span>
        <span>${it.free ? '<span style="color:#4caf50">Gratis</span>' : `ab ${it.price} €`}</span>
      </div>
    `).join('');
    totalEl.textContent = `ab ${total} €`;
  }
}

// ── Build DOM ─────────────────────────────────────────────────────────────────

function buildModules() {
  const grid = document.getElementById('wm-modules');
  if (!grid) return;
  grid.innerHTML = MODULES.map(m => `
    <div class="wm-mod-card" data-id="${m.id}" onclick="toggleModule('${m.id}')">
      <span class="wm-check"></span>
      <div class="wm-icon">${m.icon}</div>
      <div class="wm-name">${m.label}</div>
      <div class="wm-mdesc">${m.desc}</div>
      <div class="wm-mprice">ab ${m.price} €</div>
    </div>
  `).join('');
}

function buildExtras() {
  const list = document.getElementById('wm-extras');
  if (!list) return;
  list.innerHTML = EXTRAS.map(e => {
    let sub = '';
    if (e.note)  sub += ` – ${e.note}`;
    if (e.freeAt) sub += ` – Gratis ab ${e.freeAt} € Bestellwert`;
    if (e.group === 'finish' || e.group === 'teer') sub += ' – nur eine Option wählbar';
    return `
      <div class="wm-extra-row" data-id="${e.id}" onclick="toggleExtra('${e.id}')">
        <span class="wm-extra-box"></span>
        <span class="wm-extra-text">
          <span class="wm-extra-name">${e.label}</span>
          ${sub ? `<span class="wm-extra-note">${sub}</span>` : ''}
        </span>
        <span class="wm-ptag">ab ${e.price} €</span>
      </div>
    `;
  }).join('');
}

// ── Size toggle ───────────────────────────────────────────────────────────────

function initToggle() {
  document.querySelectorAll('.wm-toggle-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.wm-toggle-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const t = this.dataset.target;
      document.getElementById('konfig-klein').style.display = t === 'klein' ? 'block' : 'none';
      document.getElementById('konfig-gross').style.display = t === 'gross' ? 'block' : 'none';
    });
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  buildModules();
  buildExtras();
  syncUI();
  initToggle();
});
