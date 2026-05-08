// ── RV Detailing – Wohnmobil Konfigurator ────────────────────────────────────

// ── Datendefinitionen ─────────────────────────────────────────────────────────

const MODULES_KLEIN = [
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

const MODULES_GROSS = [
  { id: 'fahrerbereich', icon: '🚗', label: 'Fahrerbereich',
    desc: 'Cockpit, 2 Sitze, Pedale, Plastikbereiche an Türen, Scheiben vorne', price: 69 },
  { id: 'dinette', icon: '🛋️', label: 'Dinette / Sitzgruppe',
    desc: 'Sitzbereich hinten, Polster, Tisch (oft größer bei langen Mobilen)', price: 49 },
  { id: 'kueche', icon: '🍳', label: 'Küche',
    desc: 'Arbeitsplatte, Schränke, Spüle & Geräte von innen', price: 59 },
  { id: 'bad', icon: '🚿', label: 'Bad / WC',
    desc: 'Toilette, Waschbecken, Dusche, Spiegel', price: 69 },
  { id: 'schlaf', icon: '🛏️', label: 'Schlafbereich',
    desc: 'Matratze reinigen, Schränke, Stauraum (inkl. Hubdach / Queensbett)', price: 69 },
  { id: 'aussen', icon: '✨', label: 'Außenwäsche',
    desc: 'Komplette Karosserie, alle Fenster außen', price: 199 },
];

const EXTRAS_KLEIN = [
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
  { id: 'scheiben-v',   label: 'Scheibenversiegelung vorne',             price: 9 },
  { id: 'ceramic',      label: 'Ceramic Spray Versiegelung außen',       price: 59 },
  { id: 'motor',        label: 'Motorraum schonende Reinigung',          price: 49 },
  { id: 'finish-ohne',  label: 'Finish-Politur außen (exkl. Dach)',      price: 299, group: 'finish' },
  { id: 'finish-mit',   label: 'Finish-Politur außen (inkl. Dach)',      price: 399, group: 'finish' },
  { id: 'teer-ohne',    label: 'Teer-Entfernung mit Knete (ohne Dach)',  price: 79,  group: 'teer' },
  { id: 'teer-mit',     label: 'Teer-Entfernung mit Knete (mit Dach)',   price: 149, group: 'teer' },
];

const EXTRAS_GROSS = [
  { id: 'dachfenster',  label: 'Dachfenster reinigen (nur innen)',       price: 25,  note: 'je nach Anzahl' },
  { id: 'holz',         label: 'Holzreinigung & Holzwachs',              price: 59,  note: 'je nach Holzmenge' },
  { id: 'sv-nass',      label: 'Sitze vorne nassaugen',                  price: 69 },
  { id: 'sh-nass',      label: 'Sitze hinten nassaugen',                 price: 119, note: 'je nach Sitzanzahl' },
  { id: 'sv-imp',       label: 'Sitze vorne imprägnieren',               price: 49 },
  { id: 'sh-imp',       label: 'Sitze hinten imprägnieren',              price: 89,  note: 'je nach Sitzanzahl' },
  { id: 'teppich-nass', label: 'Teppiche nassaugen',                     price: 69,  note: 'je nach Anzahl' },
  { id: 'teppich-imp',  label: 'Teppich-Imprägnierung',                  price: 59,  note: 'je nach Anzahl' },
  { id: 'fenster-in',   label: 'Fensterreinigung innen (alle)',          price: 19 },
  { id: 'tuerleisten',  label: 'Türleisten & Türbereiche komplett',      price: 49 },
  { id: 'stauk',        label: 'Stauklappen / Außenluken',               price: 79,  note: 'je nach Anzahl' },
  { id: 'scheiben-v',   label: 'Scheibenversiegelung vorne',             price: 9 },
  { id: 'ceramic',      label: 'Ceramic Spray Versiegelung außen',       price: 99 },
  { id: 'motor',        label: 'Motorraum schonende Reinigung',          price: 69 },
  { id: 'finish-ohne',  label: 'Finish-Politur außen (exkl. Dach)',      price: 449, group: 'finish' },
  { id: 'finish-mit',   label: 'Finish-Politur außen (inkl. Dach)',      price: 599, group: 'finish' },
  { id: 'teer-ohne',    label: 'Teer-Entfernung mit Knete (ohne Dach)',  price: 119, group: 'teer' },
  { id: 'teer-mit',     label: 'Teer-Entfernung mit Knete (mit Dach)',   price: 199, group: 'teer' },
];

// Gratis-Regeln werden pro Konfigurator mit selModules-Referenz erstellt
function makeFreeRules(selModules, threshScheibe, threshBonus) {
  return [
    {
      id: 'scheiben-v', threshold: threshScheibe, cond: () => true,
      hint: `Gratis ab ${threshScheibe} € Bestellwert`,
    },
    {
      id: 'ceramic', threshold: threshBonus, cond: () => selModules.has('aussen'),
      hint: `Gratis ab ${threshBonus} € – nur mit Außenwäsche`,
    },
    {
      id: 'fenster-in', threshold: threshBonus, cond: () => !selModules.has('aussen'),
      hint: `Gratis ab ${threshBonus} € – wenn keine Außenwäsche`,
    },
  ];
}

// ── Generische Konfigurator-Fabrik ─────────────────────────────────────────────

const konfigs = {};

function makeKonfig(id, modules, extras, threshScheibe, threshBonus) {
  const selModules   = new Set();
  const manualExtras = new Set();
  const autoFree     = new Set();
  const freeRules    = makeFreeRules(selModules, threshScheibe, threshBonus);

  function paidBase() {
    let t = 0;
    selModules.forEach(mid => { const m = modules.find(x => x.id === mid); if (m) t += m.price; });
    manualExtras.forEach(eid => { const e = extras.find(x => x.id === eid); if (e) t += e.price; });
    return t;
  }

  function syncUI() {
    const base = paidBase();

    autoFree.clear();
    freeRules.forEach(r => { if (r.cond() && base >= r.threshold) autoFree.add(r.id); });

    const selExtras = new Set([...manualExtras, ...autoFree]);

    let displayTotal = base;
    autoFree.forEach(eid => {
      if (manualExtras.has(eid)) {
        const e = extras.find(x => x.id === eid);
        if (e) displayTotal -= e.price;
      }
    });

    // Module cards
    document.querySelectorAll(`#wm-modules-${id} .wm-mod-card`).forEach(card => {
      const sel = selModules.has(card.dataset.id);
      card.classList.toggle('selected', sel);
      card.querySelector('.wm-check').textContent = sel ? '✓' : '';
    });

    // Extra rows
    document.querySelectorAll(`#wm-extras-${id} .wm-extra-row`).forEach(row => {
      const eid    = row.dataset.id;
      const extra  = extras.find(e => e.id === eid);
      const isFree = autoFree.has(eid);
      const isSel  = selExtras.has(eid);
      const rule   = freeRules.find(r => r.id === eid);

      row.classList.toggle('checked', isSel);
      row.classList.toggle('wm-auto-free', isFree);
      row.querySelector('.wm-extra-box').textContent = isSel ? '✓' : '';

      const ptag = row.querySelector('.wm-ptag');
      ptag.innerHTML = isFree
        ? '<span class="wm-gratis-tag">Gratis ✓</span>'
        : `ab ${extra.price} €`;

      const hint = row.querySelector('.wm-free-hint');
      if (hint && rule) {
        if (isFree) {
          hint.textContent = '';
        } else if (rule.cond()) {
          const diff = rule.threshold - base;
          hint.textContent = diff > 0 ? `Noch ${diff} € bis gratis` : '';
          hint.style.color = 'var(--gold)';
        } else {
          hint.textContent = rule.hint;
          hint.style.color = 'var(--text-dim)';
        }
      }
    });

    // Preisübersicht
    const linesEl = document.getElementById(`wm-price-lines-${id}`);
    const totalEl = document.getElementById(`wm-total-${id}`);
    if (!linesEl || !totalEl) return;

    const items = [];
    selModules.forEach(mid => {
      const m = modules.find(x => x.id === mid);
      if (m) items.push({ label: m.label, price: m.price, free: false });
    });
    selExtras.forEach(eid => {
      const e = extras.find(x => x.id === eid);
      if (!e) return;
      items.push({ label: e.label, price: e.price, free: autoFree.has(eid) });
    });

    if (items.length === 0) {
      linesEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.82rem;text-align:center;padding:12px 0;">Noch nichts ausgewählt.</p>';
      totalEl.textContent = '0 €';
    } else {
      linesEl.innerHTML = items.map(it => `
        <div class="wm-price-line">
          <span>${it.label}</span>
          <span>${it.free
            ? '<span style="color:#4caf50;font-weight:700;">Gratis</span>'
            : `ab ${it.price} €`
          }</span>
        </div>
      `).join('');
      totalEl.textContent = displayTotal > 0 ? `ab ${displayTotal} €` : '0 €';
    }
  }

  function buildModules() {
    const grid = document.getElementById(`wm-modules-${id}`);
    if (!grid) return;
    grid.innerHTML = modules.map(m => `
      <div class="wm-mod-card" data-id="${m.id}" onclick="konfigs['${id}'].toggleModule('${m.id}')">
        <span class="wm-check"></span>
        <div class="wm-icon">${m.icon}</div>
        <div class="wm-name">${m.label}</div>
        <div class="wm-mdesc">${m.desc}</div>
        <div class="wm-mprice">ab ${m.price} €</div>
      </div>
    `).join('');
  }

  function buildExtras() {
    const list = document.getElementById(`wm-extras-${id}`);
    if (!list) return;
    list.innerHTML = extras.map(e => {
      const rule = freeRules.find(r => r.id === e.id);
      let sub = '';
      if (e.note) sub += e.note;
      if (e.group === 'finish' || e.group === 'teer') sub += (sub ? ' – ' : '') + 'nur eine Option wählbar';
      return `
        <div class="wm-extra-row" data-id="${e.id}" onclick="konfigs['${id}'].toggleExtra('${e.id}')">
          <span class="wm-extra-box"></span>
          <span class="wm-extra-text">
            <span class="wm-extra-name">${e.label}</span>
            ${sub ? `<span class="wm-extra-note">${sub}</span>` : ''}
            ${rule ? `<span class="wm-free-hint" style="font-size:0.72rem;display:block;margin-top:2px;color:var(--text-dim);">${rule.hint}</span>` : ''}
          </span>
          <span class="wm-ptag">ab ${e.price} €</span>
        </div>
      `;
    }).join('');
  }

  return {
    build() { buildModules(); buildExtras(); syncUI(); },
    toggleModule(mid) {
      selModules.has(mid) ? selModules.delete(mid) : selModules.add(mid);
      syncUI();
    },
    toggleExtra(eid) {
      if (autoFree.has(eid)) return;
      const extra = extras.find(e => e.id === eid);
      if (manualExtras.has(eid)) {
        manualExtras.delete(eid);
      } else {
        if (extra.group) extras.filter(e => e.group === extra.group).forEach(e => manualExtras.delete(e.id));
        manualExtras.add(eid);
      }
      syncUI();
    },
  };
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
  konfigs['klein'] = makeKonfig('klein', MODULES_KLEIN, EXTRAS_KLEIN, 220, 500);
  konfigs['gross'] = makeKonfig('gross', MODULES_GROSS, EXTRAS_GROSS, 300, 700);
  konfigs['klein'].build();
  konfigs['gross'].build();
  initToggle();
});
