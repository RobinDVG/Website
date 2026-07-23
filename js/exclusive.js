// ── RV Detailing – Exclusive Konfigurator ────────────────────────────────────
//
// Preislogik: Basis, Politur und Keramik skalieren mit der Fahrzeuggröße
// (Faktor unten). Alle Zusatzoptionen sind Festpreise pro Rad, Sitz oder
// Bauteil. Kein Zustandsaufschlag – das Paket wird immer vor Ort besichtigt.

const EXC_VEHICLES = [
  { label: 'Kleinwagen',              factor: 1.00 },
  { label: 'Coupé',                   factor: 1.10 },
  { label: 'Limousine',               factor: 1.18 },
  { label: 'Cabrio',                  factor: 1.22 },
  { label: 'Kombi',                   factor: 1.24 },
  { label: 'SUV / Geländewagen',      factor: 1.35 },
  { label: '7-Sitzer / Minivan',      factor: 1.40 },
  { label: 'Sprinter / Transporter',  factor: 1.45 },
  { label: '9-Sitzer / Großvan',      factor: 1.64 },
];

const EXC_BASE = {
  price: 299, // Kleinwagen, skaliert mit Fahrzeug
  includes: [
    'Komplette Innen- & Außenaufbereitung auf Paket-3-Niveau',
    'Plastik & Reifengummi außen aufgefrischt',
    'Scheiben außen mit Water Spot Remover',
    'Dampfreinigung hinter Gummis, Türgriffen & Kanten',
    'Chromleisten aufpoliert (abwählbar, ohne Preisänderung)',
    'Felgen außen und – so weit ohne Abmontage erreichbar – innen gereinigt',
  ],
};

// Jede Gruppe: select 'one' (max. eine) oder 'multi' (mehrere).
// required: true  → immer genau eine, nicht abwählbar (skaliert mit Fahrzeug).
// scales:   true  → Preis wird mit dem Fahrzeugfaktor multipliziert.
const EXC_GROUPS = [
  { id: 'politur', icon: '✨', title: 'Politur', required: true, scales: true, select: 'one',
    note: 'Pflicht – eine Auswahl · Vorbereitung inklusive',
    options: [
      { id: 'finish', label: 'Finish-Politur',      price: 300, desc: 'Ein Durchgang – Glanz zurück, Waschkratzer & leichte Swirls raus' },
      { id: '2step',  label: 'Zweistufige Politur',  price: 550, desc: 'Grober Schnitt + Finish – auch tiefere Mikrokratzer, in der Sonne deutlich besser. Sehr tiefe Defekte bleiben' },
    ] },
  { id: 'keramik', icon: '🛡️', title: 'Keramikversiegelung', required: true, scales: true, select: 'one',
    note: 'Pflicht · Gtechniq · bis zu 5 Jahre / 100.000 km bei regelmäßiger Handwäsche',
    options: [
      { id: '1s', label: 'Einschichtig', price: 330, desc: 'Voller Schutz, bis zu 5 Jahre' },
      { id: '2s', label: 'Zweischichtig', price: 420, desc: 'Gleiche Haltbarkeit, aber spürbar stärkerer Abperleffekt, mehr Glanz & Glätte', rec: true },
    ] },
  { id: 'felgenclean', icon: '🔧', title: 'Felgen – Reinigung mit Abmontage', select: 'one',
    note: 'Außen + erreichbare Innenseite sind schon in der Basis. Bei der Felgenversiegelung „innen + außen" unten ist die Abmontage bereits enthalten – dann hier nicht nötig.',
    options: [
      { id: 'ab', label: 'Räder ab – Innenseite & Radkasten komplett', price: 140, desc: '35 € / Rad · für ein perfektes Ergebnis, Drehmoment nach Vorgabe' },
    ] },
  { id: 'felgenseal', icon: '⚙️', title: 'Felgenversiegelung', select: 'one',
    note: 'Gtechniq C5 Wheel Armour · bis zu 2 Jahre',
    options: [
      { id: 'aussen',   label: 'Nur Außenseite',   price: 120, desc: '30 € / Rad · ohne Abmontage' },
      { id: 'komplett', label: 'Innen + außen',    price: 220, desc: '55 € / Rad · inkl. Abmontage' },
    ] },
  { id: 'scheiben', icon: '🪟', title: 'Scheibenversiegelung', select: 'one',
    options: [
      { id: 'b-front',    label: 'Basis · Frontscheibe',            price: 19,  desc: '3–4 Monate Haltbarkeit' },
      { id: 'b-frontsd',  label: 'Basis · Front + Schiebedach',     price: 29 },
      { id: 'b-alle',     label: 'Basis · alle Scheiben',           price: 49 },
      { id: 'g-front',    label: 'Gtechniq G1 · Frontscheibe',      price: 149, desc: '1–2 Jahre · inkl. Scheibenpolitur' },
      { id: 'g-frontsd',  label: 'G1 · Front + Schiebedach',        price: 189, desc: 'inkl. Politur' },
      { id: 'g-alle',     label: 'G1 · alle Scheiben',              price: 279, desc: 'inkl. Politur' },
    ] },
  { id: 'innen', icon: '🧽', title: 'Innenraum – Zusatzoptionen', select: 'multi',
    note: 'Stoffsitze werden bereits in der Basis nass abgesaugt',
    options: [
      { id: 'teppich',    label: 'Teppiche Dampfreinigung',  price: 69, desc: 'das Einzige, was nicht schon enthalten ist' },
      { id: 'dachhimmel', label: 'Dachhimmel',               price: 35, desc: 'feuchte, schonende Reinigung; kein perfektes Ergebnis, da nicht absaugbar' },
      { id: 'ozon',       label: 'Ozonbehandlung',           price: 50, desc: 'Geruchsneutralisierung' },
    ] },
  { id: 'sitze', icon: '🪑', title: 'Sitzversiegelung', select: 'one',
    note: '1 Jahr · Stoff oder Leder · 60 € je Sitz (vorne + hinten)',
    options: [
      { id: 'vorne', label: 'Nur Vordersitze (2)', price: 120 },
      { id: 'alle',  label: 'Alle Sitze (4)',       price: 240 },
    ] },
  { id: 'unterboden', icon: '🚙', title: 'Unterboden', select: 'one',
    note: 'Kunststoff-Unterbodenplatten werden zum Reinigen abgenommen',
    options: [
      { id: 'clean',   label: 'Nur reinigen',                                        price: 130, desc: 'Hochdruck, entfetten' },
      { id: 'schutz',  label: 'Reinigen + Standardschutz',                           price: 280 },
      { id: 'premium', label: 'Reinigen + Premium-Versiegelung bis in die Radkästen', price: null, desc: 'Dinitrol · ab 590 € · auf Anfrage' },
    ] },
  { id: 'scheinwerfer', icon: '💡', title: 'Scheinwerfer', select: 'one',
    options: [
      { id: 'ja', label: 'Aufbereitung, beide Seiten', price: 138, desc: 'optional, frei abwählbar' },
    ] },
  { id: 'motor', icon: '🔩', title: 'Motorraum', select: 'one',
    note: 'gleicher Preis – die Wahl ist fachlich, nicht finanziell',
    options: [
      { id: 'hand',     label: 'Schonend von Hand',                             price: 79 },
      { id: 'kaercher', label: 'Mit Hochdruck – gründlicher, aber risikoreicher', price: 79 },
    ] },
];

// ── State ──────────────────────────────────────────────────────────────────
let excVehicleIdx = 0;
const excSel = {}; // groupId -> Set(optionIds)

function excFactor() { return EXC_VEHICLES[excVehicleIdx].factor; }
function excScaled(p) { return Math.round(p * excFactor()); }
function excPrice(group, opt) {
  if (opt.price == null) return null;
  return group.scales ? excScaled(opt.price) : opt.price;
}
function excFmt(p) { return p == null ? 'auf Anfrage' : 'ab ' + p + ' €'; }

// ── Berechnung ──────────────────────────────────────────────────────────────
function excCalc() {
  let total = excScaled(EXC_BASE.price);
  let anfrage = false;
  const lines = [{ label: 'Basis-Aufbereitung', price: excScaled(EXC_BASE.price) }];

  EXC_GROUPS.forEach(g => {
    const set = excSel[g.id];
    if (!set) return;
    set.forEach(oid => {
      const opt = g.options.find(o => o.id === oid);
      if (!opt) return;
      const p = excPrice(g, opt);
      if (p == null) { anfrage = true; lines.push({ label: g.title + ': ' + opt.label, price: null }); return; }
      total += p;
      lines.push({ label: g.title + ': ' + opt.label, price: p });
    });
  });

  return { total, anfrage, lines };
}

// ── Rendering ────────────────────────────────────────────────────────────────
function excRenderVehicle() {
  const sel = document.getElementById('exc-vehicle');
  if (!sel || sel.dataset.built) return;
  sel.innerHTML = EXC_VEHICLES.map((v, i) => `<option value="${i}">${v.label}</option>`).join('');
  sel.dataset.built = '1';
  sel.addEventListener('change', () => { excVehicleIdx = parseInt(sel.value, 10) || 0; excSync(); });
}

function excRenderBase() {
  const el = document.getElementById('exc-base');
  if (!el) return;
  el.innerHTML = `
    <div class="exc-base-head">
      <div>
        <div class="exc-base-label">Immer enthalten</div>
        <h3 class="exc-base-title">Basis-Aufbereitung</h3>
      </div>
      <div class="exc-base-price">ab ${excScaled(EXC_BASE.price)} €</div>
    </div>
    <ul class="exc-base-list">
      ${EXC_BASE.includes.map(t => `<li>${t}</li>`).join('')}
    </ul>`;
}

function excRenderGroups() {
  const host = document.getElementById('exc-groups');
  if (!host) return;
  host.innerHTML = EXC_GROUPS.map(g => {
    const set = excSel[g.id] || new Set();
    const tag = g.required
      ? '<span class="exc-tag req">Pflicht</span>'
      : '<span class="exc-tag opt">Optional</span>';
    const cards = g.options.map(o => {
      const isSel = set.has(o.id);
      const p = excPrice(g, o);
      const rec = o.rec ? '<span class="exc-rec">empfohlen</span>' : '';
      return `
        <div class="wm-mod-card exc-card${isSel ? ' selected' : ''}" onclick="EXC.toggle('${g.id}','${o.id}')">
          <span class="wm-check">${isSel ? '✓' : ''}</span>
          <div class="wm-name">${o.label} ${rec}</div>
          ${o.desc ? `<div class="wm-mdesc">${o.desc}</div>` : ''}
          <div class="wm-mprice">${excFmt(p)}</div>
        </div>`;
    }).join('');
    return `
      <div class="exc-group">
        <div class="wm-section-head">
          <h3>${g.icon} ${g.title} ${tag}</h3>
          ${g.note ? `<p>${g.note}</p>` : ''}
        </div>
        <div class="wm-mod-grid exc-grid">${cards}</div>
      </div>`;
  }).join('');
}

function excSync() {
  excRenderBase();
  excRenderGroups();

  const { total, anfrage, lines } = excCalc();
  const linesEl = document.getElementById('exc-price-lines');
  const totalEl = document.getElementById('exc-total');
  if (linesEl) {
    linesEl.innerHTML = lines.map(it => `
      <div class="wm-price-line">
        <span>${it.label}</span>
        <span>${it.price == null ? '<span style="color:var(--gold);font-weight:700;">auf Anfrage</span>' : 'ab ' + it.price + ' €'}</span>
      </div>`).join('');
  }
  if (totalEl) {
    totalEl.textContent = 'ab ' + total + ' €' + (anfrage ? ' + Anfrage' : '');
  }
}

// ── Öffentliche API (für onclick) ────────────────────────────────────────────
const EXC = {
  toggle(gid, oid) {
    const g = EXC_GROUPS.find(x => x.id === gid);
    if (!g) return;
    const set = excSel[gid] || (excSel[gid] = new Set());
    if (g.select === 'multi') {
      set.has(oid) ? set.delete(oid) : set.add(oid);
    } else {
      if (set.has(oid)) {
        if (!g.required) set.delete(oid); // Pflicht-Gruppen bleiben gesetzt
      } else {
        set.clear();
        set.add(oid);
      }
    }
    excSync();
  },
};

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Pflicht-Gruppen mit günstigster Option vorbelegen → gezeigtes Minimum
  EXC_GROUPS.forEach(g => { if (g.required) excSel[g.id] = new Set([g.options[0].id]); });
  excRenderVehicle();
  excSync();
});
