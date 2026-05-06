// ── Google Reviews Loader ────────────────────────────────────────────────────
// Trage deinen API Key und deine Place ID hier ein, sobald du sie hast.
// Anleitung: https://console.cloud.google.com → Projekt → APIs → Places API
const GOOGLE_API_KEY = '';   // z.B. 'AIzaSyB...'
const GOOGLE_PLACE_ID = '';  // z.B. 'ChIJ...'  (aus Google Maps URL)

// Anzahl der angezeigten Sterne
function starsHTML(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

// Relative Zeit
function timeAgo(unixSeconds) {
  const diff = Math.floor(Date.now() / 1000) - unixSeconds;
  if (diff < 86400)     return 'heute';
  if (diff < 172800)    return 'gestern';
  if (diff < 604800)    return `vor ${Math.floor(diff / 86400)} Tagen`;
  if (diff < 2592000)   return `vor ${Math.floor(diff / 604800)} Wochen`;
  if (diff < 31536000)  return `vor ${Math.floor(diff / 2592000)} Monaten`;
  return `vor ${Math.floor(diff / 31536000)} Jahren`;
}

// Review-Karte bauen
function buildReviewCard(review) {
  const initial = review.author_name ? review.author_name.charAt(0).toUpperCase() : '?';
  const card = document.createElement('div');
  card.className = 'review-card fade-in';
  card.innerHTML = `
    <div class="review-stars">${starsHTML(review.rating)}</div>
    <p class="review-text">"${review.text}"</p>
    <div class="review-author">
      <div class="review-avatar">${initial}</div>
      <div>
        <div class="review-name">${review.author_name}</div>
        <div class="review-date">${timeAgo(review.time)} · Google</div>
      </div>
    </div>`;
  return card;
}

// Bewertungen einblenden
function showReviews(reviews, rating, userRatingsTotal, mapsUrl) {
  const loading  = document.getElementById('reviews-loading');
  const fallback = document.getElementById('reviews-fallback');
  const grid     = document.getElementById('reviews-grid');
  const summary  = document.getElementById('google-rating-summary');
  const link     = document.getElementById('google-maps-link');

  if (loading)  loading.style.display  = 'none';
  if (fallback) fallback.style.display = 'block';
  if (summary)  summary.style.display  = 'flex';

  if (link && mapsUrl) link.href = mapsUrl;

  // Gesamtbewertung
  const valEl   = document.getElementById('google-rating-value');
  const starEl  = document.getElementById('google-rating-stars');
  const countEl = document.getElementById('google-rating-count');
  if (valEl)   valEl.textContent  = rating.toFixed(1);
  if (starEl)  starEl.textContent = starsHTML(rating);
  if (countEl) countEl.textContent = `${userRatingsTotal} Bewertungen auf Google`;

  // Karten
  if (grid) {
    const top5 = reviews
      .filter(r => r.text && r.text.length > 20)
      .slice(0, 5);
    top5.forEach(r => {
      const card = buildReviewCard(r);
      grid.appendChild(card);
      // Intersection Observer neu triggern
      setTimeout(() => card.classList.add('visible'), 100);
    });
  }
}

// Fehler / kein API Key → Ladespinner ausblenden
function hideLoader() {
  const loading  = document.getElementById('reviews-loading');
  const fallback = document.getElementById('reviews-fallback');
  if (loading)  loading.style.display  = 'none';
  if (fallback) {
    fallback.style.display = 'block';
    fallback.innerHTML = `
      <p style="text-align:center;color:var(--text-dim);font-size:0.88rem;padding:20px 0;">
        Bewertungen konnten nicht geladen werden.<br>
        <a href="https://maps.google.com" target="_blank" style="color:var(--gold);">Direkt auf Google ansehen →</a>
      </p>`;
  }
}

// Maps JS API Callback (wird von Google aufgerufen)
window.initGooglePlaces = function () {
  const mapDiv = document.createElement('div');
  const map = new google.maps.Map(mapDiv, { center: { lat: 0, lng: 0 }, zoom: 1 });
  const service = new google.maps.places.PlacesService(map);

  service.getDetails(
    {
      placeId: GOOGLE_PLACE_ID,
      fields: ['reviews', 'rating', 'user_ratings_total', 'url'],
      language: 'de',
    },
    (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews?.length) {
        showReviews(place.reviews, place.rating, place.user_ratings_total, place.url);
      } else {
        hideLoader();
      }
    }
  );
};

// Start: API laden wenn Schlüssel vorhanden
(function init() {
  if (!GOOGLE_API_KEY || !GOOGLE_PLACE_ID) {
    // Noch kein API Key → Spinner ausblenden, Link bleibt
    const loading = document.getElementById('reviews-loading');
    if (loading) loading.style.display = 'none';
    const fallback = document.getElementById('reviews-fallback');
    if (fallback) {
      fallback.style.display = 'block';
      fallback.innerHTML = `
        <p style="text-align:center;color:var(--text-dim);font-size:0.88rem;padding:20px 0;">
          📋 Google API wird noch eingerichtet – Bewertungen folgen bald!
        </p>`;
    }
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&callback=initGooglePlaces&language=de`;
  script.async = true;
  script.defer = true;
  script.onerror = hideLoader;
  document.head.appendChild(script);
})();
