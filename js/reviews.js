// ── Google Reviews Karussell ─────────────────────────────────────────────────
const GOOGLE_API_KEY  = 'AIzaSyDL1rEJ84KtBjSod7Ms48pJsrkHEWslHrs';
const GOOGLE_PLACE_ID = 'ChIJY6G2Ww_BqEcRIKP7vQ1MiSg';

// Sterne rendern
function starsHTML(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

// Relative Zeit auf Deutsch
function timeAgo(unixSeconds) {
  const diff = Math.floor(Date.now() / 1000) - unixSeconds;
  if (diff < 86400)    return 'heute';
  if (diff < 172800)   return 'gestern';
  if (diff < 604800)   return `vor ${Math.floor(diff / 86400)} Tagen`;
  if (diff < 2592000)  return `vor ${Math.floor(diff / 604800)} Wochen`;
  if (diff < 31536000) return `vor ${Math.floor(diff / 2592000)} Monaten`;
  return `vor ${Math.floor(diff / 31536000)} Jahren`;
}

// Einzelne Review-Karte bauen
function buildCard(review) {
  const initial = (review.author_name || '?').charAt(0).toUpperCase();
  const el = document.createElement('div');
  el.className = 'review-card';
  el.innerHTML = `
    <div class="review-stars">${starsHTML(review.rating)}</div>
    <p class="review-text">"${review.text}"</p>
    <div class="review-author">
      <div class="review-avatar">${initial}</div>
      <div>
        <div class="review-name">${review.author_name}</div>
        <div class="review-date">${timeAgo(review.time)} · Google</div>
      </div>
    </div>`;
  return el;
}

// Karussell animieren (links → rechts, langsam)
function startCarousel(track) {
  const SPEED = 0.65; // px pro Frame
  let offset = 0;
  let paused = false;
  let raf;

  // Gesamtbreite einer Kartenmenge (ohne Klone)
  const halfWidth = () => track.scrollWidth / 2;

  // Starte in der Mitte (Klon-Set), damit Loop sofort funktioniert
  offset = -halfWidth();
  track.style.transform = `translateX(${offset}px)`;

  function tick() {
    if (!paused) {
      offset += SPEED; // nach rechts
      if (offset >= 0) {
        offset = -halfWidth(); // nahtlos zurückspringen
      }
      track.style.transform = `translateX(${offset}px)`;
    }
    raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);

  // Hover auf dem Track: Karussell pausieren
  track.addEventListener('mouseenter', () => { paused = true; });
  track.addEventListener('mouseleave', () => { paused = false; });
}

// Bewertungen einblenden & Karussell starten
function showReviews(reviews, rating, userRatingsTotal, mapsUrl) {
  const loading  = document.getElementById('reviews-loading');
  const fallback = document.getElementById('reviews-fallback');
  const track    = document.getElementById('reviews-carousel-track');
  const summary  = document.getElementById('google-rating-summary');
  const link     = document.getElementById('google-maps-link');

  if (loading)  loading.style.display = 'none';
  if (fallback) fallback.style.display = 'block';
  if (summary)  summary.style.display  = 'flex';
  if (link && mapsUrl) link.href = mapsUrl;

  // Gesamtbewertung anzeigen
  const valEl   = document.getElementById('google-rating-value');
  const starEl  = document.getElementById('google-rating-stars');
  const countEl = document.getElementById('google-rating-count');
  if (valEl)   valEl.textContent   = rating.toFixed(1);
  if (starEl)  starEl.textContent  = starsHTML(rating);
  if (countEl) countEl.textContent = `${userRatingsTotal} Bewertungen auf Google`;

  if (!track) return;

  // Nur Reviews mit sinnvollem Text
  const filtered = reviews.filter(r => r.text && r.text.trim().length > 15);

  // Karten einfügen
  filtered.forEach(r => track.appendChild(buildCard(r)));

  // Klone für nahtlosen Loop
  filtered.forEach(r => {
    const clone = buildCard(r);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // Kleiner Delay damit DOM gerendert ist, dann starten
  requestAnimationFrame(() => requestAnimationFrame(() => startCarousel(track)));
}

// Fallback wenn API nicht verfügbar
function hideLoader(msg) {
  const loading  = document.getElementById('reviews-loading');
  const fallback = document.getElementById('reviews-fallback');
  if (loading)  loading.style.display = 'none';
  if (fallback) {
    fallback.style.display = 'block';
    fallback.innerHTML = `
      <p style="text-align:center;color:var(--text-dim);font-size:0.88rem;padding:20px 0;">
        ${msg || 'Bewertungen konnten nicht geladen werden.'}<br>
        <a href="https://maps.google.com" target="_blank" style="color:var(--gold)">Direkt auf Google ansehen →</a>
      </p>`;
  }
}

// Google Maps JS API Callback
window.initGooglePlaces = function () {
  const mapDiv = document.createElement('div');
  const map    = new google.maps.Map(mapDiv, { center: { lat: 0, lng: 0 }, zoom: 1 });
  const svc    = new google.maps.places.PlacesService(map);

  svc.getDetails(
    { placeId: GOOGLE_PLACE_ID, fields: ['reviews', 'rating', 'user_ratings_total', 'url'], language: 'de' },
    (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews?.length) {
        showReviews(place.reviews, place.rating, place.user_ratings_total, place.url);
      } else {
        hideLoader();
      }
    }
  );
};

// Init
(function () {
  if (!GOOGLE_API_KEY || !GOOGLE_PLACE_ID) {
    hideLoader('📋 Google API wird noch eingerichtet – Bewertungen folgen bald!');
    return;
  }
  const s = document.createElement('script');
  s.src     = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&callback=initGooglePlaces&language=de`;
  s.async   = true;
  s.defer   = true;
  s.onerror = () => hideLoader();
  document.head.appendChild(s);
})();
