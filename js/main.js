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
