// Promo Bar
(function() {
  const bar = document.createElement('div');
  bar.className = 'promo-bar';
  const msg = '✦ Mai Aktion &ndash; 10&nbsp;% Rabatt auf alle Pakete! &nbsp;&nbsp;&nbsp; ✦ Jetzt Termin sichern &nbsp;&nbsp;&nbsp;';
  let html = '';
  for (let i = 0; i < 10; i++) html += `<span class="promo-bar-item">${msg}</span>`;
  bar.innerHTML = `<div class="promo-bar-track">${html}</div>`;
  document.body.insertBefore(bar, document.body.firstChild);
  const nav = document.querySelector('.navbar');
  if (nav) nav.style.top = '36px';
})();

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu?.classList.toggle('open');
  document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
});
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Scroll fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsletterForm.querySelector('input');
  if (!input?.value.trim()) return;
  const btn = newsletterForm.querySelector('button');
  if (btn) btn.textContent = '✓ Angemeldet!';
  input.value = '';
  input.placeholder = 'Erfolgreich angemeldet!';
  setTimeout(() => {
    if (btn) btn.textContent = 'Anmelden';
    if (input) input.placeholder = 'deine@email.de';
  }, 4000);
});

// Contact/Termin form
const terminForm = document.querySelector('#termin-form');
terminForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  terminForm.style.display = 'none';
  const success = document.querySelector('.form-success');
  if (success) success.style.display = 'block';
});

// Before/After Slider
document.querySelectorAll('.ba-slider').forEach(slider => {
  const afterWrap = slider.querySelector('.ba-slider-after');
  const handle = slider.querySelector('.ba-slider-handle');
  if (!afterWrap || !handle) return;

  let isDragging = false;

  function setPosition(x) {
    const rect = slider.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    afterWrap.style.clipPath = `inset(0 0 0 ${pct}%)`;
    handle.style.left = pct + '%';
  }

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    setPosition(e.clientX);
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (isDragging) setPosition(e.clientX);
  });
  document.addEventListener('mouseup', () => { isDragging = false; });

  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    setPosition(e.touches[0].clientX);
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (isDragging) setPosition(e.touches[0].clientX);
  }, { passive: true });
  document.addEventListener('touchend', () => { isDragging = false; });

  // Init at 50%
  afterWrap.style.clipPath = 'inset(0 0 0 50%)';
});

// Expandable detail items (accordion)
document.querySelectorAll('.detail-item.expandable').forEach(item => {
  item.addEventListener('click', () => {
    const expand = item.nextElementSibling;
    if (!expand || !expand.classList.contains('detail-expand')) return;
    const wasOpen = item.classList.contains('open');
    // Close all others in same list
    const list = item.closest('.detail-list');
    if (list) {
      list.querySelectorAll('.detail-item.open').forEach(other => {
        other.classList.remove('open');
        other.nextElementSibling?.classList.remove('open');
      });
    }
    // Toggle current
    if (!wasOpen) {
      item.classList.add('open');
      expand.classList.add('open');
      // Scroll into view if needed
      setTimeout(() => {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  });
});

// WhatsApp FAB
(function() {
  const fab = document.createElement('a');
  fab.href = 'https://wa.me/4917655058348';
  fab.target = '_blank';
  fab.rel = 'noopener noreferrer';
  fab.className = 'wa-fab';
  fab.setAttribute('aria-label', 'WhatsApp schreiben');
  fab.innerHTML = `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
  document.body.appendChild(fab);
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
