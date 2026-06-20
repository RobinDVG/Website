// â”€â”€ RV Detailing â€“ Gewinnspiel Sitewide Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
(function () {
  if (sessionStorage.getItem('gws_dismissed')) return;

  var BONUS_END = new Date('2026-06-21T23:59:59');
  var GWS_END   = new Date('2026-07-20T23:59:59');
  var now = new Date();
  if (now > GWS_END) return;

  var bonusActive = now < BONUS_END;

  // â”€â”€ Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  var style = document.createElement('style');
  style.textContent = [
    '#gws-banner{position:fixed;top:0;left:0;right:0;z-index:2001;',
    'background:linear-gradient(90deg,#1a0800 0%,#2d1200 40%,#2d1200 60%,#1a0800 100%);',
    'border-bottom:2px solid #ffbf00;',
    'box-shadow:0 2px 20px rgba(255,191,0,0.3);',
    'font-family:Montserrat,sans-serif;',
    'transform:translateY(-100%);',
    'animation:gwsIn 0.55s 0.25s cubic-bezier(0.22,1,0.36,1) forwards;}',
    '@keyframes gwsIn{to{transform:translateY(0);}}',
    '.gws-inner{max-width:1200px;margin:0 auto;padding:7px 16px;',
    'display:flex;align-items:center;gap:10px;}',
    '.gws-link{display:flex;align-items:center;gap:10px;flex:1;',
    'text-decoration:none;color:inherit;min-width:0;}',
    '.gws-emo{font-size:1.2rem;flex-shrink:0;}',
    '.gws-body{font-size:0.76rem;color:#bbb;min-width:0;line-height:1.3;}',
    '.gws-body strong{color:#ffbf00;}',
    '.gws-tag{display:inline-block;background:linear-gradient(135deg,#b86a00,#d48a00);color:#fff;',
    'font-size:0.6rem;font-weight:800;padding:2px 6px;border-radius:3px;',
    'letter-spacing:0.05em;margin-right:6px;vertical-align:middle;',
    'animation:tagPulse 1.5s ease-in-out infinite;}',
    '@keyframes tagPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.8;transform:scale(.97);}}',
    '.gws-timer{font-size:0.82rem;font-weight:800;color:#ffbf00;',
    'font-variant-numeric:tabular-nums;white-space:nowrap;flex-shrink:0;}',
    '.gws-pill{display:inline-flex;align-items:center;gap:4px;',
    'background:#ffbf00;color:#000;font-size:0.68rem;font-weight:800;',
    'letter-spacing:0.08em;text-transform:uppercase;',
    'padding:5px 14px;border-radius:6px;white-space:nowrap;flex-shrink:0;}',
    '.gws-x{background:none;border:none;color:#555;font-size:1rem;',
    'cursor:pointer;padding:2px 6px;line-height:1;flex-shrink:0;}',
    '.gws-x:hover{color:#fff;}',
    '@media(max-width:600px){',
    '.gws-pill{display:none;}',
    '.gws-timer{font-size:0.74rem;}',
    '.gws-body{font-size:0.7rem;}}'
  ].join('');

  document.head.appendChild(style);

  // â”€â”€ HTML â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  var b = document.createElement('div');
  b.id = 'gws-banner';
  b.innerHTML =
    '<div class="gws-inner">' +
      '<a href="gewinnspiel.html" class="gws-link">' +
        '<span class="gws-emo">ðŸ†</span>' +
        '<span class="gws-body">' +
          (bonusActive ? '<span class="gws-tag">ðŸ”¥ BONUS LÃ„UFT AB</span>' : '') +
          '<strong>GEWINNSPIEL</strong> â€“ Paket 3 GRATIS gewinnen (Wert 349 â‚¬)' +
          (bonusActive ? ' Â· <strong>Doppelte Lose noch heute & morgen!</strong>' : ' Â· Bis 20.07.') +
        '</span>' +
        '<span class="gws-timer" id="gwsT">â€”</span>' +
        '<span class="gws-pill">Teilnehmen â†’</span>' +
      '</a>' +
      '<button class="gws-x" id="gwsX" aria-label="SchlieÃŸen">âœ•</button>' +
    '</div>';

  document.body.prepend(b);

  // â”€â”€ Navbar nach unten schieben â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  function pushNav() {
    var h = b.offsetHeight;
    var nav = document.querySelector('.navbar');
    if (nav) nav.style.top = h + 'px';
  }
  setTimeout(pushNav, 650);
  window.addEventListener('resize', pushNav);

  // â”€â”€ Countdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  var target = bonusActive ? BONUS_END : GWS_END;
  function tick() {
    var diff = target - new Date();
    var el = document.getElementById('gwsT');
    if (!el) return;
    if (diff <= 0) { el.textContent = bonusActive ? 'Bonus vorbei' : 'Beendet'; return; }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    el.textContent = bonusActive
      ? ('â° ' + pad(h) + ':' + pad(m) + ':' + pad(s))
      : (d > 0 ? d + 'T ' : '') + pad(h) + ':' + pad(m) + ':' + pad(s);
  }
  function pad(n) { return String(n).padStart(2, '0'); }
  tick(); setInterval(tick, 1000);

  // â”€â”€ SchlieÃŸen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  document.getElementById('gwsX').addEventListener('click', function () {
    b.style.transition = 'transform 0.3s ease,opacity 0.3s ease';
    b.style.transform = 'translateY(-100%)';
    b.style.opacity = '0';
    setTimeout(function () {
      b.remove();
      var nav = document.querySelector('.navbar');
      if (nav) nav.style.top = '';
    }, 320);
    sessionStorage.setItem('gws_dismissed', '1');
  });
})();

