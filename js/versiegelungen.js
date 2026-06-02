// ── RV Detailing – Ceramic Coating & Versiegelungen ──

const CATEGORIES = [
  {
    id: 'lack', icon: '🎨', title: 'Lackversiegelung', group: 'außen',
    desc: 'Professioneller Keramikschutz für deinen Lack – hart, chemikalienbeständig, langlebig.',
    products: [
      { name: 'Gtechniq Crystal Serum Light', tag: 'Keramik', tagColor: '#4caf50', duration: 'bis zu 5 Jahre', badge: null,
        desc: 'Weltweit bewährtes Profi-Coating. Bildet eine harte keramische Schutzschicht (9H), die chemisch mit dem Lack verbunden ist – tiefer Glanz und zuverlässiger Langzeitschutz.',
        features: ['9H Keramikhärte', 'Chemikalienbeständig pH 2–12', 'Schutz gegen Waschkratzer', 'Tiefer, klarer Glanz', 'Bis zu 5 Jahre Schutz'] },
      { name: "Adam's Advanced Graphene Ceramic", tag: 'Graphen-Keramik', tagColor: '#ffbf00', duration: '9+ Jahre laut Hersteller', badge: '🏆 Empfohlen',
        desc: 'Modernste Graphen-Keramik-Technologie mit extremer Hydrophobie. Wasser läuft bereits ab 10–15° Neigung ab – auch auf Felgen, Scheinwerfern, Chrom und Hochglanz-Kunststoffen einsetzbar.',
        features: ['10H+ Härte', 'Extrem hydrophob', 'Hoher Selbstreinigungseffekt', 'Resistent gegen Vogelkot, Harz & Insekten', 'Lack, Felgen, Chrom, Scheinwerfer & mehr'] }
    ]
  },
  {
    id: 'glas', icon: '🪟', title: 'Glasversiegelung', group: 'außen',
    desc: 'Speziell für Scheiben entwickelt – Regen perlt ab, Sicht bleibt kristallklar.',
    products: [
      { name: 'Gtechniq G5 Water Repellent', tag: 'Kurzzeit', tagColor: '#4caf50', duration: '3–6 Monate', badge: null,
        desc: 'Schnell aufgetragener Glasschutz für alle Scheiben. Regen perlt zuverlässig ab, die Nachtsicht verbessert sich spürbar – ideal als regelmäßige Auffrischung.',
        features: ['Alle Scheiben', 'Regen perlt ab', 'Bessere Nachtsicht', 'Schnelle Anwendung', 'Reduziert Eisbildung'] },
      { name: 'Gtechniq G1 ClearVision Smart Glass', tag: 'Profi-Langzeit', tagColor: '#ffbf00', duration: '1–2+ Jahre', badge: '🏆 Empfohlen',
        desc: 'Speziell für Scheiben entwickeltes Langzeit-Coating. Stärker als jedes Lack-Coating auf Glas – optimiert für Scheibenwischer, kein Rattern, keine Schlieren.',
        features: ['Entwickelt für Glas & Wischer', 'Starke Wasserabweisung bei Tempo', 'Keine Schlieren, kein Rattern', 'UV-Schutz für Gummidichtungen', '1–2+ Jahre Haltbarkeit'] }
    ]
  },
  {
    id: 'felgen', icon: '⚙️', title: 'Felgenversiegelung', group: 'außen',
    desc: 'Bremsenstaub und Dreck haften kaum noch – Felgen bleiben länger sauber.',
    products: [
      { name: 'Felgen Spray Coat', tag: 'Basis', tagColor: '#4caf50', duration: '3 Monate', badge: null,
        desc: 'Sprühversiegelung für Felgen. Bremsenstaub und Straßenschmutz lassen sich deutlich leichter abwaschen.',
        features: ['Schnelle Anwendung', 'Bremsenstaub-Abweisung', 'Für alle Felgentypen', 'Schmutzabweisend', 'Einfach nachzupflegen'] },
      { name: "Adam's Advanced Graphene Ceramic", tag: 'Keramik-Langzeit', tagColor: '#ffbf00', duration: '9+ Jahre laut Hersteller', badge: '🏆 Empfohlen',
        desc: 'Dasselbe Profi-Coating wie auf dem Lack – auch auf Felgen. Hitzeresistent, chemikalienbeständig, Bremsenstaub perlt einfach ab.',
        features: ['Hitze- & chemikalienbeständig', 'Bremsenstaub perlt ab', 'Für alle Felgentypen', 'Einfache Reinigung', 'Langzeitschutz'] }
    ]
  },
  {
    id: 'sitze', icon: '🪑', title: 'Sitzversiegelung', group: 'innen',
    desc: 'Stoff- oder Ledersitze versiegelt – gegen Flecken, Abnutzung und UV.',
    products: [
      { name: 'Gtechniq I1 Smart Fabric AB', tag: 'Für Stoffsitze', tagColor: '#4caf50', duration: '6–12 Monate', badge: null,
        desc: 'Professioneller Textilschutz für Stoffsitze, Teppiche und Kofferraum. Flüssigkeiten perlen ab, Schmutz haftet schlechter – ideal direkt nach einer Nassreinigung. Bei Alcantara: bewusst kein Schutzprodukt, um die originale Haptik zu erhalten.',
        features: ['Flüssigkeiten perlen ab', 'Atmungsaktivität bleibt erhalten', 'UV-Schutz', 'Für Stoff, Velours & Kofferraum', 'Alcantara: schonende Reinigung ohne Versiegelung'] },
      { name: 'Gtechniq L1 Leather Guard', tag: 'Für Ledersitze', tagColor: '#ffbf00', duration: '6–12 Monate', badge: '🏆 Empfohlen',
        desc: 'Speziell für modernes Autoleder entwickelt. Schützt vor Jeansabfärbungen, Verschleiß und UV – ohne fettige Optik. Erhält die matte Originalanmutung des Leders.',
        features: ['Schutz gegen Jeansabfärbungen', 'UV-Schutz (kein Ausbleichen)', 'Erhält matte Originaloptik', 'Antibakteriell', 'Kein fettiges Gefühl'] },
      { name: 'Colourlock Leder Protector', tag: 'Premium / Älteres Leder', tagColor: '#c084fc', duration: '6–12 Monate', badge: null,
        desc: 'Premium-Alternative mit rückfettender Wirkung – ideal für älteres oder beanspruchtes Leder. Erhält die Geschmeidigkeit und beugt Rissen vor.',
        features: ['Rückfettung & Pflege', 'UV-Schutz', 'Erhält Geschmeidigkeit', 'Ideal für älteres Leder', 'Beugt Rissen vor'] }
    ]
  },
  {
    id: 'teppich', icon: '🧽', title: 'Teppich-Imprägnierung', group: 'innen',
    desc: 'Teppiche und Fußmatten versiegelt – Flecken haben keine Chance.',
    products: [
      { name: 'Gtechniq I1 Smart Fabric AB', tag: 'Profi-Imprägnierung', tagColor: '#ffbf00', duration: '6–24 Monate', badge: '🏆 Empfohlen',
        desc: 'Dasselbe Profi-Produkt wie auf den Stoffsitzen – auch für Teppiche, Fußmatten und Kofferraum. Haltbarkeit je nach Beanspruchung: Fahrerteppich ca. 6–12 Monate, Rücksitzbereich und Kofferraum bis zu 24 Monate.',
        features: ['Flüssigkeiten perlen ab', 'Schmutz haftet schlechter', 'Atmungsaktiv', 'UV-Schutz', 'Ideal nach Nassreinigung'] }
    ]
  }
];

// ── Hero Animation ──────────────────────────────────────────────────────────
class CoatHeroAnimation {
  constructor() {
    this.heroCopy   = document.getElementById('heroCopy');
    this.scrollHint = document.getElementById('scrollHint');
    this.initParticles();
    this.run();
  }

  run() {
    const t = (ms, fn) => setTimeout(fn, ms);
    t(600,  () => { if (this.heroCopy)   this.heroCopy.classList.add('revealed'); });
    t(2200, () => { if (this.scrollHint) this.scrollHint.classList.add('visible'); });
  }

  initParticles() {
    const canvas = document.getElementById('coat-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(Math.random() * 0.55 + 0.15),
      a: Math.random() * 0.35 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -8) { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,191,0,${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }
}

// ── Category UI ─────────────────────────────────────────────────────────────
class CoatCategories {
  constructor() {
    this.activeId = null;
    this.render();
    document.getElementById('panelClose')?.addEventListener('click', () => this.close());
  }

  render() {
    const gridOut = document.getElementById('catGrid');
    const gridIn  = document.getElementById('catGridInnen');
    if (!gridOut || !gridIn) return;
    CATEGORIES.forEach(cat => {
      (cat.group === 'außen' ? gridOut : gridIn).appendChild(this.buildCard(cat));
    });
    // hook into existing fade-in observer from main.js
    if (typeof observer !== 'undefined') {
      document.querySelectorAll('.coat-card').forEach(el => observer.observe(el));
    }
  }

  buildCard(cat) {
    const card = document.createElement('div');
    card.className = 'coat-card fade-in';
    card.dataset.id = cat.id;
    card.innerHTML = `
      <span class="coat-card-icon">${cat.icon}</span>
      <div class="coat-card-title">${cat.title}</div>
      <div class="coat-card-desc">${cat.desc}</div>
      <div class="coat-card-cta">Produkte ansehen <span>→</span></div>`;
    card.addEventListener('click', () => this.open(cat.id));
    return card;
  }

  open(id) {
    if (this.activeId === id) { this.close(); return; }
    this.activeId = id;
    const cat = CATEGORIES.find(c => c.id === id);
    document.querySelectorAll('.coat-card').forEach(c =>
      c.classList.toggle('active', c.dataset.id === id)
    );
    const panel = document.getElementById('detailPanel');
    const inner = document.getElementById('panelInner');
    panel.classList.remove('open');

    inner.innerHTML = `
      <div class="panel-header">
        <div class="panel-cat-icon">${cat.icon}</div>
        <div>
          <div class="panel-cat-label">Produktwahl</div>
          <h3 class="panel-cat-title">${cat.title}</h3>
        </div>
      </div>
      <p class="panel-intro">${cat.desc}</p>
      <div class="product-compare">
        ${cat.products.map((p, i) => `
          <div class="product-card${i === 1 ? ' product-premium' : ''}">
            ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
            <div class="product-tag" style="background:${p.tagColor}22;border-color:${p.tagColor}55;color:${p.tagColor};">${p.tag}</div>
            <div class="product-name">${p.name}</div>
            <div class="product-duration">⏱ Haltbarkeit: <strong>${p.duration}</strong></div>
            <p class="product-desc">${p.desc}</p>
            <ul class="product-features">
              ${p.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>`).join('')}
      </div>
      <div class="panel-note">
        💬 Nicht sicher, welches Produkt das Richtige ist? Wir beraten dich kostenlos beim Termin.
        <a href="termin.html" class="btn btn-gold" style="margin-top:16px;display:inline-flex;">Termin vereinbaren →</a>
      </div>`;

    inner.querySelectorAll('.product-card').forEach(pc => {
      pc.addEventListener('click', () => {
        inner.querySelectorAll('.product-card').forEach(x => x.classList.remove('selected'));
        pc.classList.add('selected');
      });
    });

    void panel.offsetWidth;
    panel.classList.add('open');
    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  }

  close() {
    this.activeId = null;
    document.getElementById('detailPanel')?.classList.remove('open');
    document.querySelectorAll('.coat-card').forEach(c => c.classList.remove('active'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CoatHeroAnimation();
  new CoatCategories();
});
