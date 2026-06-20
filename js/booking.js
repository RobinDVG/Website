// ── RV Detailing – Buchungssystem ──────────────────────────────────

const SHOP = { lat: 52.4297134, lng: 12.5454711 };
const PAYPAL_CLIENT_ID = 'ATZOtgFppX7_7svpY9X_BHz6fxRY1Xrvh4JMprqxgpvOq0g-o3IyOuDx_vD5J8m2zu8RaxVJP2bzcOYf';
let paypalLoaded = false;
const TERMIN_DAUER = 20; // Besichtigungstermin in Minuten

// ── Besichtigungspauschale (Vorab-Deposit für mobile Besichtigung) ──
function calcDeposit(km) {
  if (km <= 3)  return 5.00;
  if (km <= 5)  return 6.50;
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

function roundUp5(n) { return Math.ceil(n / 5) * 5; }

// ── State ──
let currentStep    = 1;
let serviceType    = null;   // 'shop' | 'mobile'
let distanceKm     = null;
let depositAmount  = null;
let travelMinutes  = null;
let totalDuration  = TERMIN_DAUER;
let customerAddr   = '';
let calInitialized = false;
let selectedPaket  = '';
let selectedFahrzeug = '';
let selectedZustand  = '';
let selectedPreis    = '';

// ── Step-Navigation ──
function goToStep(step) {
  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
  var target = document.querySelector('.booking-step[data-step="' + step + '"]');
  if (target) target.classList.add('active');

  document.querySelectorAll('.bk-dot').forEach(d => {
    var s = parseInt(d.dataset.step);
    d.classList.remove('active', 'done');
    if (s < step) d.classList.add('done');
    if (s === step) d.classList.add('active');
  });

  currentStep = step;

  if (step === 3) {
    var addrDisplay = document.getElementById('booking-address-display');
    var addrText = document.getElementById('booking-address-text');
    if (addrDisplay && addrText) {
      if (serviceType === 'mobile' && customerAddr) {
        addrText.textContent = customerAddr;
        addrDisplay.style.display = 'block';
      } else if (serviceType === 'shop') {
        addrText.textContent = 'Upstallstraße 12, 14772 Brandenburg an der Havel';
        addrDisplay.style.display = 'block';
      }
    }
    if (!calInitialized) {
      initCalEmbed();
      calInitialized = true;
    }
  }

  document.querySelector('.page-hero')?.scrollIntoView({ behavior: 'smooth' });
}

// ── Service-Typ wählen ──
function selectService(type) {
  serviceType = type;
  document.querySelectorAll('.svc-card').forEach(c => c.classList.remove('selected'));
  document.querySelector('.svc-card[data-type="' + type + '"]')?.classList.add('selected');

  var step2Dots = document.querySelectorAll('.bk-dot[data-step="2"], .bk-line-2');
  if (type === 'shop') {
    step2Dots.forEach(d => d.style.display = 'none');
    totalDuration = TERMIN_DAUER;
    setTimeout(function() { goToStep(3); }, 350);
  } else {
    step2Dots.forEach(d => d.style.display = '');
    setTimeout(function() { goToStep(2); }, 350);
  }
}

// ── Google Maps Autocomplete ──
function initGoogleMaps() {
  var input = document.getElementById('address-input');
  if (!input || !window.google || !google.maps || !google.maps.places) return;

  var ac = new google.maps.places.Autocomplete(input, {
    types: ['address'],
    componentRestrictions: { country: 'de' }
  });

  ac.addListener('place_changed', function () {
    var place = ac.getPlace();
    if (!place.geometry) return;
    customerAddr = place.formatted_address || input.value;
    calcDist(place.geometry.location);
  });
}

function calcDistManual() {
  var input = document.getElementById('address-input');
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
    travelMinutes = Math.ceil(km * 1.2);
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
      travelMinutes = Math.ceil(el.duration.value / 60);
      renderPricing(el.distance.value / 1000, el.duration.text);
    } else {
      var km = haversine(SHOP.lat, SHOP.lng, destLatLng.lat(), destLatLng.lng()) * 1.35;
      travelMinutes = Math.ceil(km * 1.2);
      renderPricing(km, null);
    }
  });
}

function renderPricing(km, duration) {
  distanceKm = km;
  depositAmount = calcDeposit(km);
  totalDuration = roundUp5(TERMIN_DAUER + (travelMinutes || 0) * 2);

  var el = document.getElementById('distance-result');
  if (!el) return;

  var travelInfo = travelMinutes
    ? '<p style="font-size:0.85rem;color:var(--text-muted);margin-top:12px;">Termindauer inkl. Fahrzeit: <strong style="color:var(--text);">' + totalDuration + ' Min</strong> (' + TERMIN_DAUER + ' Min Besichtigung + ' + travelMinutes + ' Min Fahrt × 2)</p>'
    : '';

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
    travelInfo +

    '<div class="pay-gate">' +
      '<div style="border-top:1px solid var(--border);margin:24px 0;"></div>' +
      '<h4 style="margin-bottom:8px;">Besichtigungspauschale jetzt zahlen</h4>' +
      '<p class="dist-note" style="margin-top:0;margin-bottom:16px;">Um einen Termin buchen zu können, muss die Besichtigungspauschale von <strong style="color:var(--gold);">' + fmtEur(depositAmount) + '</strong> vorab bezahlt werden.</p>' +

      '<div id="paypal-button-container"></div>' +

      '<div id="payment-success" style="display:none;text-align:center;padding:20px;background:rgba(76,175,80,0.1);border:1px solid rgba(76,175,80,0.3);border-radius:12px;margin-top:16px;">' +
        '<div style="font-size:2rem;margin-bottom:8px;">✓</div>' +
        '<p style="color:#4caf50;font-weight:700;margin:0;">Zahlung erfolgreich!</p>' +
        '<p style="color:var(--text-muted);font-size:0.85rem;margin-top:4px;">Besichtigungspauschale von ' + fmtEur(depositAmount) + ' bezahlt.</p>' +
      '</div>' +

      '<button id="btn-to-cal" class="btn btn-dark" style="width:100%;justify-content:center;margin-top:16px;opacity:0.4;pointer-events:none;" onclick="goToStep(3)">Weiter zum Kalender →</button>' +
    '</div>';

  el.style.display = 'block';

  loadPayPalSDK(initPayPalButtons);
}

function unlockCalendarButton() {
  var btn = document.getElementById('btn-to-cal');
  if (btn) {
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
    btn.classList.remove('btn-dark');
    btn.classList.add('btn-gold');
  }
}

function loadPayPalSDK(callback) {
  if (paypalLoaded) { callback(); return; }
  var script = document.createElement('script');
  script.src = 'https://www.paypal.com/sdk/js?client-id=' + PAYPAL_CLIENT_ID + '&currency=EUR&locale=de_DE';
  script.onload = function () { paypalLoaded = true; callback(); };
  document.head.appendChild(script);
}

function initPayPalButtons() {
  var container = document.getElementById('paypal-button-container');
  if (!container || !window.paypal) return;

  paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'pay',
      height: 48
    },
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: { value: depositAmount.toFixed(2), currency_code: 'EUR' },
          description: 'Besichtigungspauschale – RV Detailing'
        }]
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        document.getElementById('paypal-button-container').style.display = 'none';
        document.getElementById('payment-success').style.display = 'block';
        unlockCalendarButton();
      });
    },
    onError: function (err) {
      alert('Zahlung fehlgeschlagen. Bitte versuche es erneut oder kontaktiere uns.');
    }
  }).render('#paypal-button-container');
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
  if (km && km > 0) {
    travelMinutes = Math.ceil(km * 1.2);
    renderPricing(km, null);
  }
}

function fmtEur(n) {
  return n.toFixed(2).replace('.', ',') + ' €';
}

// ── Cal.com Embed (lazy init) ──
function initCalEmbed() {
  var notes = selectedPaket;
  if (selectedFahrzeug) notes += '\nFahrzeug: ' + selectedFahrzeug;
  if (selectedZustand)  notes += '\nZustand: ' + selectedZustand;
  if (serviceType === 'mobile') {
    notes += '\nMobiler Service – ' + customerAddr;
    notes += '\nEntfernung: ' + (distanceKm ? distanceKm.toFixed(1) : '?') + ' km';
    notes += '\nFahrzeit: ' + (travelMinutes || '?') + ' Min (einfach)';
    notes += '\nTermindauer inkl. Fahrt: ' + totalDuration + ' Min';
    notes += '\nBesichtigungspauschale: ' + (depositAmount ? fmtEur(depositAmount) : '?') + ' (bezahlt)';
  } else {
    notes += '\nVor Ort beim Betrieb';
  }

  var calConfig = { layout: "month_view", notes: notes, duration: totalDuration };
  if (serviceType === 'mobile' && customerAddr) {
    calConfig.location = customerAddr;
  } else {
    calConfig.location = 'Upstallstraße 12, 14772 Brandenburg an der Havel';
  }

  Cal("inline", {
    elementOrSelector: "#cal-booking",
    calLink: "robin-dovgan-boyjk0/rv-detailing",
    config: calConfig
  });
  Cal("ui", {
    theme: "dark",
    styles: { branding: { brandColor: "#FFBF00" } },
    hideEventTypeDetails: false
  });
  Cal("on", {
    action: "bookingSuccessful",
    callback: function () {
      goToStep(4);
      renderSuccess();
    }
  });
}

// ── Bestätigung (Schritt 4) ──
function renderSuccess() {
  var el = document.getElementById('payment-content');
  if (!el) return;

  var msg = serviceType === 'mobile'
    ? 'Dein Besichtigungstermin ist gebucht. Du erhältst eine Bestätigung per E-Mail.'
    : 'Wir haben deine Buchung erhalten und bestätigen sie per E-Mail.';

  el.innerHTML =
    '<div class="pay-box" style="text-align:center;">' +
      '<div style="font-size:3rem;margin-bottom:16px;color:#4caf50;">✓</div>' +
      '<h3 style="margin:0;">Termin gebucht!</h3>' +
      '<p style="color:var(--text-muted);margin-top:12px;">' + msg + '</p>' +
      '<a href="index.html" class="btn btn-outline" style="margin-top:24px;">Zurück zur Startseite</a>' +
    '</div>';
}

// ── Init ──
function initBooking() {
  var params  = new URLSearchParams(window.location.search);
  var paket   = params.get('paket');
  var service = params.get('service'); // direkter Dienst (Ceramic, Politur, ...)
  var valid   = ['1', '2', '3', '4', '5', 'wohnmobil'];

  // Kein Paket und kein Service → zurück zur Paketauswahl
  if (!paket && !service) { window.location.replace('buchen.html'); return; }
  if (paket && valid.indexOf(paket) === -1 && !service) { window.location.replace('buchen.html'); return; }

  selectedFahrzeug = params.get('fahrzeug') || '';
  selectedZustand  = params.get('zustand') || '';
  selectedPreis    = params.get('preis') || '';
  var extras       = params.get('extras') || '';

  var map = {
    '1': 'Paket 01 – Basic Refresh',
    '2': 'Paket 02 – Comfort Care',
    '3': 'Paket 03 – Premium Shine',
    '4': 'Paket 04 – Neuwagen Paket',
    '5': 'Paket 05 – Smoker Detox',
    'wohnmobil': 'Wohnmobil-Aufbereitung (individuell konfiguriert)'
  };

  if (service) {
    selectedPaket = decodeURIComponent(service);
  } else {
    selectedPaket = map[paket] || '';
    if (selectedPreis && paket !== 'wohnmobil') {
      selectedPaket += ' (ab ' + selectedPreis + ' €)';
    }
  }

  // Extras anhängen (vom Upsell-Modal)
  if (extras) {
    var extraList = extras.split(',').map(function(e) { return decodeURIComponent(e.trim()); }).filter(Boolean);
    if (extraList.length) {
      selectedPaket += '\n+ Extras: ' + extraList.join(', ');
    }
  }

  var banner = document.getElementById('paket-banner');
  var bannerText = document.getElementById('paket-banner-text');
  if (banner && bannerText && selectedPaket) {
    var bannerInfo = selectedPaket;
    if (selectedFahrzeug) bannerInfo += '\n' + selectedFahrzeug;
    if (selectedZustand && selectedZustand !== 'Sehr gepflegt') bannerInfo += ' · ' + selectedZustand;
    bannerText.innerHTML = bannerInfo.replace(/\n/g, '<br/>');
    banner.style.display = 'block';
  }

  goToStep(1);

  if (window.google && google.maps) {
    initGoogleMaps();
  }
}

document.addEventListener('DOMContentLoaded', initBooking);

window.initGMaps = function () {
  initGoogleMaps();
};
