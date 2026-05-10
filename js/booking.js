// ── RV Detailing – Buchungssystem ──────────────────────────────────

const SHOP = { lat: 52.4297134, lng: 12.5454711 };
const PAYPAL_ME = 'https://paypal.me/RobinDovgan';

// ── Besichtigungspauschale (Vorab-Deposit für mobile Besichtigung) ──
function calcDeposit(km) {
  if (km <= 3)  return 5.00;
  if (km <= 5)  return 7.50;
  if (km <= 10) return 10.00;
  return +(10 + Math.ceil(km - 10) * 1.00).toFixed(2);
}

// ── Haversine-Entfernung (Luftlinie, Fallback) ──
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── State ──
let currentStep   = 1;
let serviceType    = null;   // 'shop' | 'mobile'
let distanceKm     = null;
let depositAmount  = null;
let customerAddr   = '';
let calInitialized = false;
let selectedPaket  = '';

// ── Step-Navigation ──
function goToStep(step) {
  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector('.booking-step[data-step="' + step + '"]');
  if (target) target.classList.add('active');

  document.querySelectorAll('.bk-dot').forEach(d => {
    const s = parseInt(d.dataset.step);
    d.classList.remove('active', 'done');
    if (s < step) d.classList.add('done');
    if (s === step) d.classList.add('active');
  });

  currentStep = step;

  if (step === 3 && !calInitialized) {
    initCalEmbed();
    calInitialized = true;
  }

  document.querySelector('.page-hero')?.scrollIntoView({ behavior: 'smooth' });
}

// ── Service-Typ wählen ──
function selectService(type) {
  serviceType = type;
  document.querySelectorAll('.svc-card').forEach(c => c.classList.remove('selected'));
  document.querySelector('.svc-card[data-type="' + type + '"]')?.classList.add('selected');

  // Schritt 2 nur bei Mobil
  const step2Dots = document.querySelectorAll('.bk-dot[data-step="2"], .bk-line-2');
  if (type === 'shop') {
    step2Dots.forEach(d => d.style.display = 'none');
    setTimeout(() => goToStep(3), 350);
  } else {
    step2Dots.forEach(d => d.style.display = '');
    setTimeout(() => goToStep(2), 350);
  }
}

// ── Google Maps Autocomplete ──
function initGoogleMaps() {
  const input = document.getElementById('address-input');
  if (!input || !window.google || !google.maps || !google.maps.places) return;

  const ac = new google.maps.places.Autocomplete(input, {
    types: ['address'],
    componentRestrictions: { country: 'de' }
  });

  ac.addListener('place_changed', function () {
    const place = ac.getPlace();
    if (!place.geometry) return;
    customerAddr = place.formatted_address || input.value;
    calcDist(place.geometry.location);
  });
}

function calcDistManual() {
  const input = document.getElementById('address-input');
  if (!input || !input.value.trim()) return;
  customerAddr = input.value.trim();

  if (window.google && google.maps) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: customerAddr }, function (res, status) {
      if (status === 'OK' && res[0]) {
        calcDist(res[0].geometry.location);
      } else {
        showManualKm();
      }
    });
  } else {
    showManualKm();
  }
}

function calcDist(destLatLng) {
  if (!window.google || !google.maps) {
    var km = haversine(SHOP.lat, SHOP.lng, destLatLng.lat(), destLatLng.lng()) * 1.35;
    renderPricing(km, null);
    return;
  }
  var svc = new google.maps.DistanceMatrixService();
  svc.getDistanceMatrix({
    origins: [new google.maps.LatLng(SHOP.lat, SHOP.lng)],
    destinations: [destLatLng],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.METRIC
  }, function (resp, status) {
    if (status === 'OK' && resp.rows[0].elements[0].status === 'OK') {
      var el = resp.rows[0].elements[0];
      renderPricing(el.distance.value / 1000, el.duration.text);
    } else {
      var km = haversine(SHOP.lat, SHOP.lng, destLatLng.lat(), destLatLng.lng()) * 1.35;
      renderPricing(km, null);
    }
  });
}

function renderPricing(km, duration) {
  distanceKm = km;
  depositAmount = calcDeposit(km);

  var el = document.getElementById('distance-result');
  if (!el) return;

  el.innerHTML =
    '<div class="dist-info-grid">' +
      '<div class="dist-card">' +
        '<span class="dist-card-label">Entfernung</span>' +
        '<span class="dist-card-val">' + km.toFixed(1) + ' km</span>' +
      '</div>' +
      (duration
        ? '<div class="dist-card"><span class="dist-card-label">Fahrzeit</span><span class="dist-card-val">' + duration + '</span></div>'
        : '') +
      '<div class="dist-card gold">' +
        '<span class="dist-card-label">Besichtigungspauschale</span>' +
        '<span class="dist-card-val">' + fmtEur(depositAmount) + '</span>' +
      '</div>' +
      '<div class="dist-card">' +
        '<span class="dist-card-label">Anfahrtspauschale (Service-Tag)</span>' +
        '<span class="dist-card-val">ab 7,99 €</span>' +
      '</div>' +
    '</div>' +
    '<p class="dist-note">Die Besichtigungspauschale wird bei der Online-Buchung fällig und per PayPal oder Überweisung bezahlt. Die Anfahrtspauschale fällt erst am Service-Tag an.</p>' +
    '<button class="btn btn-gold" style="width:100%;justify-content:center;margin-top:20px;" onclick="goToStep(3)">Weiter zum Kalender →</button>';

  el.style.display = 'block';
}

function showManualKm() {
  var el = document.getElementById('distance-result');
  if (!el) return;
  el.innerHTML =
    '<p style="color:var(--text-muted);margin-bottom:12px;">Adresse konnte nicht automatisch gefunden werden. Bitte gib die ungefähre Entfernung an:</p>' +
    '<div class="calc-group" style="margin-bottom:16px;">' +
      '<input class="form-input" type="number" id="manual-km" min="1" max="200" placeholder="z. B. 15 km" />' +
    '</div>' +
    '<button class="btn btn-gold" style="width:100%;justify-content:center;" onclick="applyManualKm()">Preis berechnen</button>';
  el.style.display = 'block';
}

function applyManualKm() {
  var km = parseFloat(document.getElementById('manual-km')?.value);
  if (km && km > 0) renderPricing(km, null);
}

function fmtEur(n) {
  return n.toFixed(2).replace('.', ',') + ' €';
}

// ── Cal.com Embed (lazy init) ──
function initCalEmbed() {
  var notes = selectedPaket;
  if (serviceType === 'mobile') {
    notes += '\nMobiler Service – ' + customerAddr;
    notes += '\nEntfernung: ' + (distanceKm ? distanceKm.toFixed(1) : '?') + ' km';
    notes += '\nBesichtigungspauschale: ' + (depositAmount ? fmtEur(depositAmount) : '?');
  } else {
    notes += '\nVor Ort beim Betrieb';
  }

  Cal("inline", {
    elementOrSelector: "#cal-booking",
    calLink: "robin-dovgan-boyjk0/rv-detailing",
    config: { layout: "month_view", notes: notes }
  });
  Cal("ui", {
    theme: "dark",
    styles: { branding: { brandColor: "#FFBF00" } },
    hideEventTypeDetails: false
  });
  Cal("on", {
    action: "bookingSuccessful",
    callback: function () {
      if (serviceType === 'mobile' && depositAmount) {
        goToStep(4);
        renderPayment();
      } else {
        goToStep(4);
        renderSuccess();
      }
    }
  });
}

// ── Zahlung (Schritt 4) ──
function renderPayment() {
  var el = document.getElementById('payment-content');
  if (!el) return;

  el.innerHTML =
    '<div class="pay-box">' +
      '<div style="text-align:center;margin-bottom:24px;">' +
        '<div style="font-size:2.5rem;margin-bottom:8px;">📋</div>' +
        '<h3 style="margin:0;">Termin vorgemerkt!</h3>' +
        '<p style="color:var(--text-muted);margin-top:8px;">Bitte zahle die Besichtigungspauschale, um deine Buchung abzuschließen.</p>' +
      '</div>' +
      '<div class="pay-summary">' +
        '<div class="dist-card gold" style="margin-bottom:16px;">' +
          '<span class="dist-card-label">Zu zahlen</span>' +
          '<span class="dist-card-val" style="font-size:1.4rem;">' + fmtEur(depositAmount) + '</span>' +
        '</div>' +
      '</div>' +
      '<a href="' + PAYPAL_ME + '/' + depositAmount.toFixed(2) + '" target="_blank" rel="noopener" class="btn btn-gold" style="width:100%;justify-content:center;padding:16px;font-size:1rem;">' +
        'Jetzt mit PayPal zahlen →' +
      '</a>' +
      '<div class="pay-divider"><span>oder</span></div>' +
      '<div class="pay-bank">' +
        '<p style="font-weight:600;margin-bottom:8px;">Banküberweisung:</p>' +
        '<p>Robin Dovgan<br/>IBAN: wird nach Buchung per E-Mail mitgeteilt<br/>Verwendungszweck: Besichtigung + dein Name</p>' +
      '</div>' +
      '<p class="dist-note" style="margin-top:20px;">Nach Zahlungseingang wird dein Termin endgültig bestätigt. Bei Fragen: <a href="tel:+4917655058348" style="color:var(--gold);">0176 55058348</a></p>' +
    '</div>';
}

function renderSuccess() {
  var el = document.getElementById('payment-content');
  if (!el) return;

  el.innerHTML =
    '<div class="pay-box" style="text-align:center;">' +
      '<div style="font-size:3rem;margin-bottom:16px;color:#4caf50;">✓</div>' +
      '<h3 style="margin:0;">Termin gebucht!</h3>' +
      '<p style="color:var(--text-muted);margin-top:12px;">Wir haben deine Buchung erhalten und bestätigen sie per E-Mail.</p>' +
      '<a href="index.html" class="btn btn-outline" style="margin-top:24px;">Zurück zur Startseite</a>' +
    '</div>';
}

// ── Init ──
function initBooking() {
  var paket = new URLSearchParams(window.location.search).get('paket');
  var valid = ['1', '2', '3', '4', 'wohnmobil'];
  if (!paket || valid.indexOf(paket) === -1) {
    window.location.replace('buchen.html');
    return;
  }

  var map = {
    '1': 'Paket 01 – Basic Refresh (ab 39 €)',
    '2': 'Paket 02 – Comfort Care (ab 89 €)',
    '3': 'Paket 03 – Premium Shine (ab 159 €)',
    '4': 'Paket 04 – Neuwagen Paket (ab 299 €)',
    'wohnmobil': 'Wohnmobil-Aufbereitung (individuell konfiguriert)'
  };

  selectedPaket = map[paket] || '';
  var banner = document.getElementById('paket-banner');
  var bannerText = document.getElementById('paket-banner-text');
  if (banner && bannerText && selectedPaket) {
    bannerText.textContent = selectedPaket;
    banner.style.display = 'block';
  }

  goToStep(1);

  if (window.google && google.maps) {
    initGoogleMaps();
  }
}

document.addEventListener('DOMContentLoaded', initBooking);

// Google Maps callback
window.initGMaps = function () {
  initGoogleMaps();
};
