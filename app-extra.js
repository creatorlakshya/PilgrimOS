/* ============================================================
   DARSHANA — app-extra.js
   Dynamic interactions, state engines, wizards, tickers, and maps
   ============================================================ */

'use strict';

/* ============================================================
   GLOBAL DATA EXTENSIONS
   ============================================================ */
let SHRINENAME = "Kashi Vishwanath Temple, Varanasi";

// Donor Presets
const INITIAL_DONORS = [
  { name: "Ramesh Sharma", amount: 1100, timeAgo: "2 min ago", cause: "Temple Lamp" },
  { name: "Anonymous", amount: 501, timeAgo: "5 min ago", cause: "General Offering" },
  { name: "Priya Venkat", amount: 5100, timeAgo: "8 min ago", cause: "Anna Daan" },
  { name: "Suresh & Family", amount: 11000, timeAgo: "12 min ago", cause: "Restoration" },
  { name: "Aditi Rao", amount: 101, timeAgo: "15 min ago", cause: "General Offering" },
  { name: "Karan Johar", amount: 5100, timeAgo: "20 min ago", cause: "Restoration" },
  { name: "Devi Prasad", amount: 501, timeAgo: "25 min ago", cause: "Temple Lamp" },
  { name: "Amitabh B.", amount: 51000, timeAgo: "30 min ago", cause: "Anna Daan" }
];

/* ============================================================
   TABS MANAGEMENT (shrine.html)
   ============================================================ */
function initProfileTabs() {
  const tabs = document.querySelectorAll('.tab-item');
  const panels = document.querySelectorAll('.tab-panel');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      
      // Update Tab active states
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update Panel active states
      panels.forEach(p => {
        if (p.id === `panel-${target}`) {
          p.classList.add('active');
          observeFadeUp(); // trigger scroll animations on newly exposed panel elements
        } else {
          p.classList.remove('active');
        }
      });

      // Scroll to top of sticky tabs context
      const offsetTop = document.querySelector('.sticky-tabs').offsetTop - 68;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    });
  });

  // Handle URL Hash tabs redirection
  const hash = window.location.hash.substring(1);
  if (hash) {
    const tabBtn = document.querySelector(`.tab-item[data-tab="${hash}"]`);
    if (tabBtn) tabBtn.click();
  }
}

/* ============================================================
   DARSHAN BOOKING STATE ENGINE
   ============================================================ */
let darshanState = {
  step: 1,
  date: '',
  crowdLevel: '',
  tierCode: '',
  tierName: '',
  tierPrice: 0,
  slotTime: '',
  pilgrimCount: 1,
  pilgrims: [{ name: '', idType: 'Aadhar Card', idNum: '' }],
  contactNum: '',
  contactEmail: '',
  specialNeeds: false,
  paymentMethod: 'upi',
  grandTotal: 0
};

// Color coded dates (June 2025)
const CROWD_MAP = {
  8: 'low', 9: 'low', 10: 'mod', 11: 'mod', 12: 'high', 13: 'high', 14: 'mod',
  15: 'low', 16: 'low', 17: 'mod', 18: 'mod', 19: 'high', 20: 'high', 21: 'mod',
  22: 'low', 23: 'low', 24: 'mod', 25: 'mod', 26: 'high', 27: 'high', 28: 'mod'
};

function renderCalendar() {
  const calBody = document.getElementById('darshan-cal');
  if (!calBody) return;

  let calHTML = '';
  // Days headers
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days.forEach(d => {
    calHTML += `<div class="cal-day-header">${d}</div>`;
  });

  // Leading empty dates (June 1st 2025 starts on Sunday)
  // Generating dates 1 to 30
  for (let i = 1; i <= 30; i++) {
    if (i < 8) {
      // unavailable dates mock
      calHTML += `
        <button type="button" class="cal-date-btn unavailable">
          <span>${i}</span>
          <span style="font-size: 8px;">Closed</span>
        </button>
      `;
    } else {
      const crowd = CROWD_MAP[i] || 'low';
      const label = crowd === 'low' ? 'Low' : crowd === 'mod' ? 'Moderate' : 'High';
      const crowdClass = crowd === 'low' ? 'crowd-low' : crowd === 'mod' ? 'crowd-mod' : 'crowd-high';
      calHTML += `
        <button type="button" class="cal-date-btn ${crowdClass}" onclick="selectDate(this, ${i}, '${crowd}')">
          <span>${i}</span>
          <span class="crowd-dot"></span>
        </button>
      `;
    }
  }

  calBody.innerHTML = calHTML;
}

function selectDate(btn, dateVal, crowd) {
  // Clear all previous selected
  document.querySelectorAll('.cal-date-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  darshanState.date = `June ${dateVal}, 2025`;
  darshanState.crowdLevel = crowd;

  const descMap = {
    low: 'Low crowd expected (Wait < 30 mins)',
    mod: 'Moderate crowd expected (Wait 45 - 90 mins)',
    high: 'High crowd expected (Aarti Festival peak - expect delay)'
  };

  const calText = document.getElementById('selected-date-text');
  if (calText) {
    calText.innerHTML = `<strong>Saturday, June ${dateVal}, 2025</strong> · ${descMap[crowd]}`;
    calText.style.color = crowd === 'low' ? 'var(--success)' : crowd === 'mod' ? 'var(--gold)' : 'var(--saffron)';
  }

  updateInvoice();
}

function selectTier(card, tier, price, name) {
  document.querySelectorAll('.tier-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');

  darshanState.tierCode = tier;
  darshanState.tierPrice = price;
  darshanState.tierName = name;

  updateInvoice();
}

function selectSlot(btn, time) {
  document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  darshanState.slotTime = time;
  updateInvoice();
}

function setPilgrimsCount(val) {
  let count = darshanState.pilgrimCount + val;
  if (count < 1 || count > 10) return;

  darshanState.pilgrimCount = count;
  const numText = document.getElementById('pilgrim-count-num');
  if (numText) numText.textContent = count;

  // Sync state array lengths
  if (val > 0) {
    darshanState.pilgrims.push({ name: '', idType: 'Aadhar Card', idNum: '' });
  } else {
    darshanState.pilgrims.pop();
  }

  renderPilgrimForms();
  updateInvoice();
}

function renderPilgrimForms() {
  const container = document.getElementById('pilgrim-fields-container');
  if (!container) return;

  let formsHTML = '';
  for (let i = 0; i < darshanState.pilgrimCount; i++) {
    const p = darshanState.pilgrims[i] || { name: '', idType: 'Aadhar Card', idNum: '' };
    formsHTML += `
      <div class="pilgrim-card">
        <h4 style="font-family:'Playfair Display',serif; font-size:16px; margin-bottom:12px; color:var(--dark);">Pilgrim #${i + 1}</h4>
        <div class="form-row">
          <div>
            <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Full Name</label>
            <input type="text" class="form-input" placeholder="Enter Full Name" value="${p.name}" oninput="updatePilgrimDetail(${i}, 'name', this.value)" required />
          </div>
          <div>
            <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">ID Document Type</label>
            <select class="form-input" onchange="updatePilgrimDetail(${i}, 'idType', this.value)">
              <option ${p.idType === 'Aadhar Card' ? 'selected' : ''}>Aadhar Card</option>
              <option ${p.idType === 'Passport' ? 'selected' : ''}>Passport</option>
              <option ${p.idType === 'Voter ID' ? 'selected' : ''}>Voter ID</option>
              <option ${p.idType === 'PAN Card' ? 'selected' : ''}>PAN Card</option>
            </select>
          </div>
          <div>
            <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">ID Number</label>
            <input type="text" class="form-input" placeholder="Doc Number" value="${p.idNum}" oninput="updatePilgrimDetail(${i}, 'idNum', this.value)" required />
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = formsHTML;
}

function updatePilgrimDetail(index, field, value) {
  if (darshanState.pilgrims[index]) {
    darshanState.pilgrims[index][field] = value;
  }
}

function updateSpecialNeeds(checked) {
  darshanState.specialNeeds = checked;
}

function selectPayment(btn, method) {
  document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  darshanState.paymentMethod = method;

  const qrBox = document.getElementById('upi-qr-mockup');
  if (qrBox) {
    qrBox.style.display = method === 'upi' ? 'block' : 'none';
  }
}

function updateInvoice() {
  const invoicePanel = document.getElementById('checkout-invoice');
  if (!invoicePanel) return;

  const price = darshanState.tierPrice || 0;
  const count = darshanState.pilgrimCount || 1;
  const subtotal = price * count;
  const convFee = subtotal > 0 ? 45 : 0;
  const grand = subtotal + convFee;
  darshanState.grandTotal = grand;

  invoicePanel.innerHTML = `
    <div class="summary-header">
      <h3 style="font-family:'Playfair Display',serif; font-size:18px; font-weight:700;">Yatra Invoice</h3>
      <p style="font-size:12px; color:var(--muted);">${SHRINENAME}</p>
    </div>
    
    <div class="summary-row">
      <span>Date</span>
      <span style="font-weight:600; color:var(--dark);">${darshanState.date || 'Not selected'}</span>
    </div>
    <div class="summary-row">
      <span>Tier Choice</span>
      <span style="font-weight:600; color:var(--dark);">${darshanState.tierName || 'Not selected'}</span>
    </div>
    <div class="summary-row">
      <span>Time Slot</span>
      <span style="font-weight:600; color:var(--dark);">${darshanState.slotTime || 'Not selected'}</span>
    </div>
    <div class="summary-row">
      <span>Pilgrims</span>
      <span style="font-weight:600; color:var(--dark);">${count} × ₹${price}</span>
    </div>
    
    <div class="summary-row" style="margin-top:16px;">
      <span>Ticket Subtotal</span>
      <span style="font-weight:600; color:var(--dark);">₹${subtotal}</span>
    </div>
    <div class="summary-row">
      <span>Convenience Fee</span>
      <span style="font-weight:600; color:var(--dark);">₹${convFee}</span>
    </div>
    
    <div class="summary-row total">
      <span>Grand Total</span>
      <span>₹${grand}</span>
    </div>
  `;
}

// Wizard Transitions
function nextWizardStep() {
  // Validate constraints on steps
  if (darshanState.step === 1 && !darshanState.date) {
    alert("Please select a date from the calendar to proceed.");
    return;
  }
  if (darshanState.step === 2 && !darshanState.tierCode) {
    alert("Please select a Seva Pricing Tier to proceed.");
    return;
  }
  if (darshanState.step === 3 && !darshanState.slotTime) {
    alert("Please select an hourly slot to proceed.");
    return;
  }
  if (darshanState.step === 4) {
    // validate pilgrim details
    const inputs = document.getElementById('pilgrim-fields-container').querySelectorAll('input[required]');
    let valid = true;
    inputs.forEach(i => {
      if (!i.value.trim()) valid = false;
    });
    const cNum = document.getElementById('contact-number');
    const cMail = document.getElementById('contact-email');
    if (cNum) darshanState.contactNum = cNum.value;
    if (cMail) darshanState.contactEmail = cMail.value;
    
    if (!valid || !darshanState.contactNum || !darshanState.contactEmail) {
      alert("Please complete all required pilgrim and contact details.");
      return;
    }
  }

  darshanState.step += 1;
  renderWizardStep();
}

function prevWizardStep() {
  if (darshanState.step > 1) {
    darshanState.step -= 1;
    renderWizardStep();
  }
}

function renderWizardStep() {
  const steps = document.querySelectorAll('.wizard-step-panel');
  steps.forEach((s, i) => {
    s.style.display = (i + 1) === darshanState.step ? 'block' : 'none';
  });

  // Sync dots
  const dots = document.querySelectorAll('.step-dot-item');
  const line = document.getElementById('wizard-progress-bar');
  if (line) {
    line.style.width = `${((darshanState.step - 1) / 4) * 100}%`;
  }

  dots.forEach((d, i) => {
    d.classList.remove('active', 'completed');
    const stepNum = i + 1;
    if (stepNum === darshanState.step) {
      d.classList.add('active');
    } else if (stepNum < darshanState.step) {
      d.classList.add('completed');
      d.innerHTML = '✓';
    } else {
      d.innerHTML = stepNum;
    }
  });

  // Scroll wizard container to top
  const el = document.querySelector('.steps-progress');
  if (el) {
    window.scrollTo({
      top: el.offsetTop - 80,
      behavior: 'smooth'
    });
  }
}

function processDarshanPayment(e) {
  e.preventDefault();
  const btn = document.getElementById('darshan-pay-btn');
  if (btn) {
    btn.textContent = "Securing transaction...";
    btn.disabled = true;
  }

  setTimeout(() => {
    // Complete Booking -> Success Screen
    darshanState.step = 6;
    
    // Hide standard wizard layouts
    const layout = document.getElementById('darshan-wizard-layout');
    const progress = document.getElementById('darshan-wizard-progress');
    const successScreen = document.getElementById('darshan-success-screen');
    
    if (layout) layout.style.display = 'none';
    if (progress) progress.style.display = 'none';
    if (successScreen) {
      const bookingId = "POS-" + Math.floor(100000 + Math.random() * 900000);
      successScreen.innerHTML = `
        <div class="success-card">
          <div class="success-checkmark">🙏</div>
          <h2 style="font-family:'Playfair Display',serif; font-size:32px; font-weight:700; color:var(--dark); margin-bottom:12px;">Booking Confirmed!</h2>
          <p style="font-size:16px; color:var(--muted); max-width:400px; margin:0 auto 24px;">Your sacred journey has been secured. Your digital entry pass is prepared below.</p>
          
          <div class="success-qr-wrap">
            <svg width="140" height="140" viewBox="0 0 100 100">
              <!-- Custom high fidelity scannable looking QR vector -->
              <rect x="0" y="0" width="28" height="28" fill="none" stroke="var(--dark)" stroke-width="6"/>
              <rect x="6" y="6" width="16" height="16" fill="var(--dark)"/>
              <rect x="72" y="0" width="28" height="28" fill="none" stroke="var(--dark)" stroke-width="6"/>
              <rect x="78" y="6" width="16" height="16" fill="var(--dark)"/>
              <rect x="0" y="72" width="28" height="28" fill="none" stroke="var(--dark)" stroke-width="6"/>
              <rect x="6" y="78" width="16" height="16" fill="var(--dark)"/>
              
              <rect x="36" y="8" width="8" height="16" fill="var(--dark)"/>
              <rect x="52" y="16" width="12" height="8" fill="var(--dark)"/>
              <rect x="36" y="36" width="24" height="24" fill="var(--dark)"/>
              <rect x="8" y="36" width="16" height="8" fill="var(--dark)"/>
              <rect x="16" y="52" width="8" height="12" fill="var(--dark)"/>
              <rect x="76" y="36" width="8" height="24" fill="var(--dark)"/>
              <rect x="36" y="76" width="20" height="8" fill="var(--dark)"/>
              <rect x="68" y="72" width="16" height="12" fill="var(--dark)"/>
              <rect x="88" y="88" width="12" height="12" fill="var(--dark)"/>
            </svg>
          </div>
          
          <div style="background:var(--parchment); border:1.5px solid var(--border); border-radius:12px; padding:24px; text-align:left; margin-bottom:32px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px 24px; font-size:14px;">
              <div>
                <span style="display:block; font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase;">Booking ID</span>
                <strong style="color:var(--dark); font-size:15px;">${bookingId}</strong>
              </div>
              <div>
                <span style="display:block; font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase;">Temple</span>
                <strong style="color:var(--dark); font-size:15px;">Kashi Vishwanath</strong>
              </div>
              <div>
                <span style="display:block; font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase;">Date & Time</span>
                <strong style="color:var(--dark); font-size:15px;">${darshanState.date} · ${darshanState.slotTime}</strong>
              </div>
              <div>
                <span style="display:block; font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase;">Seva Tier</span>
                <strong style="color:var(--dark); font-size:15px;">${darshanState.tierName}</strong>
              </div>
              <div style="grid-column:span 2; border-top:1px solid var(--border); padding-top:12px;">
                <span style="display:block; font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase;">Pilgrims Listed</span>
                <strong style="color:var(--dark); font-size:14px; font-weight:600;">
                  ${darshanState.pilgrims.map(p => p.name || 'Devotee').join(', ')}
                </strong>
              </div>
            </div>
          </div>
          
          <div style="display:flex; gap:12px; justify-content:center;">
            <button class="btn btn-primary" onclick="window.print()" style="padding:10px 24px; font-size:14px;">Download Pass 🎟️</button>
            <button class="btn btn-ghost" onclick="alert('Added to your Calendar!')" style="padding:10px 24px; font-size:14px;">Add to Calendar</button>
            <a href="booking-puja.html" class="btn btn-ghost" style="padding:10px 24px; font-size:14px; background:rgba(200,81,27,0.05);">Book Puja &rarr;</a>
          </div>
        </div>
      `;
      successScreen.style.display = 'block';

      // Confetti triggers
      triggerConfetti();
    }
  }, 1600);
}

/* ============================================================
   CONFETTI GENERATOR
   ============================================================ */
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  const colors = ['#C8511B', '#D4A017', '#F0C040', '#E8693A', '#A03D12'];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, idx) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.tiltAngle);
      p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });

    // Remove particles out of bounds
    particles = particles.filter(p => p.y < canvas.height);

    if (particles.length > 0) {
      requestAnimationFrame(draw);
    }
  }

  draw();
}

/* ============================================================
   AARTI STATE ENGINE
   ============================================================ */
let aartiState = {
  tab: 'person', // person | sponsor
  date: '',
  sessionName: 'mangala', // mangala | sandhya | shayana
  sessionTitle: 'Mangala Aarti',
  pricePerSeat: 501,
  selectedSeats: [], // arrays of ids
  sponsorshipAmount: 1100,
  sponsorshipOccasion: 'General Devotion',
  sponsorName: '',
  onBehalfOf: '',
  shrineAnnouncement: true,
  contactNum: '',
  contactEmail: '',
  grandTotal: 0
};

function selectAartiDate(dateVal) {
  aartiState.date = `June ${dateVal}, 2025`;
  const el = document.getElementById('selected-aarti-date-text');
  if (el) el.innerHTML = `Date selected: <strong>${aartiState.date}</strong>`;
  updateAartiInvoice();
}

function selectAartiSession(timeName, title) {
  aartiState.sessionName = timeName;
  aartiState.sessionTitle = title;
  
  // Clear any previously selected seats
  aartiState.selectedSeats = [];
  document.querySelectorAll('.seat-dot').forEach(s => s.classList.remove('selected'));

  const el = document.getElementById('selected-session-name');
  if (el) el.textContent = title;

  updateAartiInvoice();
}

function initAartiTabs() {
  const tabs = document.querySelectorAll('.aarti-flow-tab');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const choice = tab.dataset.flow;
      aartiState.tab = choice;

      document.getElementById('aarti-person-panel').style.display = choice === 'person' ? 'block' : 'none';
      document.getElementById('aarti-sponsor-panel').style.display = choice === 'sponsor' ? 'block' : 'none';
      
      updateAartiInvoice();
    });
  });
}

function renderAartiSeatMap() {
  const mapGrid = document.getElementById('seat-map-grid');
  if (!mapGrid) return;

  let mapHTML = '';
  // Front, middle, and back rows
  const categories = [
    { row: 'Front', count: 8, name: 'VIP Row', price: 501, cls: 'vip' },
    { row: 'Middle A', count: 10, name: 'Premium Row', price: 251, cls: 'standard' },
    { row: 'Middle B', count: 10, name: 'Standard Row', price: 251, cls: 'standard' },
    { row: 'Back', count: 12, name: 'General Row', price: 101, cls: 'general' }
  ];

  categories.forEach(cat => {
    mapHTML += `<div class="seat-row" style="margin-bottom: 8px;">`;
    for (let s = 1; s <= cat.count; s++) {
      const seatId = `${cat.row.substring(0,2)}-${s}`;
      const isBooked = Math.random() < 0.25; // randomly mark some as booked
      const stateClass = isBooked ? 'booked' : cat.cls;
      mapHTML += `
        <button type="button" class="seat-dot ${stateClass}" 
                data-id="${seatId}" 
                data-price="${cat.price}" 
                data-desc="${cat.name} Seat ${s}"
                ${isBooked ? 'disabled' : ''}
                onclick="toggleSeatSelection(this)">
        </button>
      `;
    }
    mapHTML += `</div>`;
  });

  mapGrid.innerHTML = mapHTML;
}

function toggleSeatSelection(btn) {
  const id = btn.dataset.id;
  const price = parseInt(btn.dataset.price);
  const desc = btn.dataset.desc;

  const idx = aartiState.selectedSeats.findIndex(s => s.id === id);
  if (idx > -1) {
    aartiState.selectedSeats.splice(idx, 1);
    btn.classList.remove('selected');
  } else {
    if (aartiState.selectedSeats.length >= 6) {
      alert("You can select up to 6 seats per transaction.");
      return;
    }
    aartiState.selectedSeats.push({ id, price, desc });
    btn.classList.add('selected');
  }

  updateAartiInvoice();
}

function selectAartiSponsorPreset(btn, amount) {
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  aartiState.sponsorshipAmount = amount;
  const custom = document.getElementById('sponsor-custom-amt');
  if (custom) custom.value = '';

  updateAartiInvoice();
}

function updateAartiSponsorCustom(val) {
  if (val) {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('selected'));
    aartiState.sponsorshipAmount = parseInt(val) || 0;
    updateAartiInvoice();
  }
}

function updateAartiInvoice() {
  const panel = document.getElementById('aarti-invoice-panel');
  if (!panel) return;

  const isPerson = aartiState.tab === 'person';
  let itemsHTML = '';
  let subtotal = 0;

  if (isPerson) {
    const seats = aartiState.selectedSeats;
    if (seats.length === 0) {
      itemsHTML = `<div style="text-align:center;color:var(--muted);font-size:14px;padding:20px 0;">No seats selected</div>`;
    } else {
      seats.forEach(s => {
        subtotal += s.price;
        itemsHTML += `
          <div class="summary-row">
            <span>${s.desc}</span>
            <span style="font-weight:600; color:var(--dark);">₹${s.price}</span>
          </div>
        `;
      });
    }
  } else {
    subtotal = aartiState.sponsorshipAmount || 0;
    itemsHTML = `
      <div class="summary-row">
        <span>Sponsorship Pledge</span>
        <span style="font-weight:600; color:var(--dark);">₹${subtotal}</span>
      </div>
      <div style="font-size:12px; color:var(--muted); margin-top:8px; line-height:1.4;">
         anunciado on behalf of: <strong>${aartiState.onBehalfOf || 'General Occasion'}</strong>
      </div>
    `;
  }

  const fee = subtotal > 0 ? 30 : 0;
  const grand = subtotal + fee;
  aartiState.grandTotal = grand;

  panel.innerHTML = `
    <div class="summary-header">
      <h3 style="font-family:'Playfair Display',serif; font-size:18px; font-weight:700;">Aarti Booking Summary</h3>
      <p style="font-size:12px; color:var(--muted);">${aartiState.sessionTitle} · ${aartiState.date || 'Today'}</p>
    </div>
    
    ${itemsHTML}
    
    <div class="summary-row" style="margin-top:16px; border-top:1px solid var(--border); padding-top:12px;">
      <span>Subtotal</span>
      <span style="font-weight:600; color:var(--dark);">₹${subtotal}</span>
    </div>
    <div class="summary-row">
      <span>Convenience Fee</span>
      <span style="font-weight:600; color:var(--dark);">₹${fee}</span>
    </div>
    
    <div class="summary-row total">
      <span>Grand Total</span>
      <span>₹${grand}</span>
    </div>
  `;
}

function processAartiBooking(e) {
  e.preventDefault();

  if (aartiState.tab === 'person' && aartiState.selectedSeats.length === 0) {
    alert("Please select at least one seat from the row layout.");
    return;
  }

  const isPerson = aartiState.tab === 'person';
  const container = document.getElementById('aarti-flow-container');
  if (!container) return;

  const btn = document.getElementById('aarti-booking-submit-btn');
  if (btn) {
    btn.textContent = "Securing transaction...";
    btn.disabled = true;
  }

  setTimeout(() => {
    const bookingId = "ART-" + Math.floor(100000 + Math.random() * 900000);
    triggerConfetti();

    if (isPerson) {
      container.innerHTML = `
        <div class="success-card">
          <div class="success-checkmark">🛕</div>
          <h2 style="font-family:'Playfair Display',serif; font-size:30px; font-weight:700; color:var(--dark); margin-bottom:12px;">Aarti Reservation Confirmed!</h2>
          <p style="font-size:15px; color:var(--muted); max-width:420px; margin:0 auto 24px;">Your digital passes are ready. Present this QR code at the specialized aarti check-in gate.</p>
          
          <div class="success-qr-wrap">
            <svg width="140" height="140" viewBox="0 0 100 100">
              <rect x="0" y="0" width="28" height="28" fill="none" stroke="var(--dark)" stroke-width="6"/>
              <rect x="6" y="6" width="16" height="16" fill="var(--dark)"/>
              <rect x="72" y="0" width="28" height="28" fill="none" stroke="var(--dark)" stroke-width="6"/>
              <rect x="78" y="6" width="16" height="16" fill="var(--dark)"/>
              <rect x="0" y="72" width="28" height="28" fill="none" stroke="var(--dark)" stroke-width="6"/>
              <rect x="6" y="78" width="16" height="16" fill="var(--dark)"/>
              <rect x="40" y="40" width="20" height="20" fill="var(--dark)"/>
              <rect x="10" y="40" width="20" height="8" fill="var(--dark)"/>
              <rect x="70" y="40" width="20" height="8" fill="var(--dark)"/>
            </svg>
          </div>
          
          <div style="background:var(--parchment); border:1.5px solid var(--border); border-radius:12px; padding:24px; text-align:left; margin-bottom:32px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px 24px; font-size:14px;">
              <div>
                <span style="display:block; font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase;">Pass ID</span>
                <strong style="color:var(--dark);">${bookingId}</strong>
              </div>
              <div>
                <span style="display:block; font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase;">Ritual Session</span>
                <strong style="color:var(--dark);">${aartiState.sessionTitle}</strong>
              </div>
              <div>
                <span style="display:block; font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase;">Date</span>
                <strong style="color:var(--dark);">${aartiState.date || 'June 14, 2025'}</strong>
              </div>
              <div>
                <span style="display:block; font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase;">Seats Reserved</span>
                <strong style="color:var(--dark);">${aartiState.selectedSeats.map(s => s.id).join(', ')}</strong>
              </div>
            </div>
          </div>
          
          <div style="display:flex; gap:12px; justify-content:center;">
            <button class="btn btn-primary" onclick="window.print()">Download QR Pass</button>
            <a href="shrine.html" class="btn btn-ghost">Back to Shrines</a>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="success-card">
          <div class="success-checkmark">🪔</div>
          <h2 style="font-family:'Playfair Display',serif; font-size:30px; font-weight:700; color:var(--success); margin-bottom:12px;">Sponsorship Confirmed!</h2>
          <p style="font-size:16px; color:var(--muted); max-width:440px; margin:0 auto 24px;">Your generous offering is received. Your name will be read aloud during the live announcements at the Kashi Vishwanath temple altar.</p>
          
          <div style="background:var(--parchment); border:1.5px solid var(--border); border-radius:12px; padding:24px; text-align:left; margin-bottom:32px; font-size:14px; line-height:1.7;">
            <div>
              <span style="font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase; display:block;">Sankalp Recitation:</span>
              <p style="font-family:'Tiro Devanagari Sanskrit', serif; font-size:18px; color:var(--saffron); margin:8px 0;">"Aarti sponsored by ${aartiState.sponsorName || 'Devotee'} on behalf of ${aartiState.onBehalfOf || 'Family'} for ${aartiState.sponsorshipOccasion}."</p>
            </div>
            <div style="border-top: 1px solid var(--border); margin-top:12px; padding-top:12px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div>
                <span style="display:block; font-size:10px; color:var(--muted); font-weight:700; text-transform:uppercase;">Announced Date</span>
                <strong style="color:var(--dark);">${aartiState.date || 'June 14, 2025'}</strong>
              </div>
              <div>
                <span style="display:block; font-size:10px; color:var(--muted); font-weight:700; text-transform:uppercase;">Aarti Session</span>
                <strong style="color:var(--dark);">${aartiState.sessionTitle}</strong>
              </div>
            </div>
          </div>
          
          <div style="display:flex; gap:12px; justify-content:center;">
            <button class="btn btn-primary" onclick="alert('Digital Announcement receipt printed!')">Print Receipt</button>
            <a href="shrine.html" class="btn btn-ghost">Back to Shrines</a>
          </div>
        </div>
      `;
    }
  }, 1600);
}

/* ============================================================
   PUJA BOOKING ENGINE
   ============================================================ */
let pujaState = {
  id: 0,
  name: '',
  price: 0,
  date: '',
  slot: '',
  sankalpName: '',
  gotra: '',
  purpose: '',
  city: '',
  nakshatra: '',
  mode: 'remote' // remote | person
};

function selectPuja(id, name, price) {
  pujaState.id = id;
  pujaState.name = name;
  pujaState.price = price;

  const catalog = document.getElementById('puja-catalog-view');
  const details = document.getElementById('puja-booking-view');
  
  if (catalog && details) {
    catalog.style.display = 'none';
    details.style.display = 'block';

    const header = document.getElementById('selected-puja-name-header');
    if (header) header.textContent = `Configure Puja: ${name} (₹${price})`;
  }
}

function processPujaBooking(e) {
  e.preventDefault();
  
  // collect fields
  pujaState.sankalpName = document.getElementById('puja-fullname').value;
  pujaState.gotra = document.getElementById('puja-gotra').value;
  pujaState.purpose = document.getElementById('puja-purpose').value;
  pujaState.city = document.getElementById('puja-city').value;
  pujaState.nakshatra = document.getElementById('puja-nakshatra').value;
  pujaState.date = document.getElementById('puja-date').value;
  pujaState.slot = document.getElementById('puja-time-slot').value;

  const container = document.getElementById('puja-flow-container');
  const btn = document.getElementById('puja-submit-btn');
  if (btn) {
    btn.textContent = "Processing Sankalp Offering...";
    btn.disabled = true;
  }

  setTimeout(() => {
    triggerConfetti();
    const panditName = "Shri Ravishankar Shastri";
    const certDate = new Date(pujaState.date || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    if (container) {
      container.innerHTML = `
        <div class="success-card">
          <div class="success-checkmark">🌸</div>
          <h2 style="font-family:'Playfair Display',serif; font-size:30px; font-weight:700; color:var(--success); margin-bottom:12px;">Puja Registered Successfully!</h2>
          <p style="font-size:15px; color:var(--muted); max-width:440px; margin:0 auto 24px;">Your digital Sankalp puja has been registered. Pandit **${panditName}** has been assigned.</p>
          
          <div class="certificate-wrap">
            <p class="sanskrit" style="color:var(--saffron); font-size:15px; margin-bottom:4px;">॥ श्री काशीविश्वनाथ विजयते ॥</p>
            <h3 class="certificate-title">Digital Sankalp Patra</h3>
            <div style="font-family:'Playfair Display', serif; font-size: 15px; line-height: 1.8; color: var(--dark); margin: 20px 0;">
              This certifies that the sacred <strong>${pujaState.name}</strong> was conducted at the altars of <strong>Kashi Vishwanath Mandir</strong> on behalf of:
              <p style="font-size: 20px; font-weight: 700; color: var(--saffron); margin: 8px 0;">${pujaState.sankalpName}</p>
              Gotra: <strong>${pujaState.gotra || 'Kashyap'}</strong> &nbsp;·&nbsp; Nakshatra: <strong>${pujaState.nakshatra || 'Pushya'}</strong>
              <br/>Purpose: <strong>${pujaState.purpose || 'Lok Kalyan (Global Wellness)'}</strong>
            </div>
            <div style="border-top:1px dashed var(--gold); padding-top:12px; margin-top:16px; display:flex; justify-content:space-between; font-size:12px; color:var(--muted);">
              <span>Date: ${certDate}</span>
              <span>Auspicious Time: ${pujaState.slot}</span>
            </div>
          </div>
          
          <div style="display:flex; gap:12px; justify-content:center;">
            <button class="btn btn-primary" onclick="window.print()">Print Blessing Certificate</button>
            <a href="shrine.html" class="btn btn-ghost">Back to Shrines</a>
          </div>
        </div>
      `;
    }
  }, 1600);
}

/* ============================================================
   DONATION DYNAMIC TELEMETRY & DONOR WALL
============================================================ */
let totalDonations = 12407832;

function initDonationsPage() {
  const ticker = document.getElementById('live-donations-ticker-val');
  if (!ticker) return;

  // Set initial total
  ticker.textContent = `₹${totalDonations.toLocaleString('en-IN')}`;

  // simulated setInterval ticking
  setInterval(() => {
    const additions = [11, 21, 51, 101, 501, 1100, 2100];
    const randAmt = additions[Math.floor(Math.random() * additions.length)];
    totalDonations += randAmt;
    
    // Animate numbers gently
    ticker.textContent = `₹${totalDonations.toLocaleString('en-IN')}`;

    // Randomly insert a mock donation from an anonymous family
    if (Math.random() < 0.4) {
      const names = ["Aman V.", "Kavita G.", "Anonymous", "Siddharth S.", "Rao Family", "Meera Nair"];
      const causes = ["Temple restoration", "Anna Daan", "Temple Lamp", "General Offering", "Pilgrim welfare fund"];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCause = causes[Math.floor(Math.random() * causes.length)];
      insertDonorWallItem(randomName, randAmt, randomCause);
    }
  }, 4500);

  // Setup donor Wall
  const list = document.getElementById('donor-list-wall');
  if (list) {
    list.innerHTML = INITIAL_DONORS.map(d => `
      <div class="donor-item">
        <div>
          <strong style="color:var(--dark);">${d.name}</strong>
          <span style="font-size:12px;color:var(--muted);display:block;">${d.cause}</span>
        </div>
        <div style="text-align:right;">
          <span style="font-family:'Playfair Display',serif;font-weight:700;color:var(--saffron);">₹${d.amount.toLocaleString('en-IN')}</span>
          <span style="font-size:11px;color:var(--muted);display:block;">${d.timeAgo}</span>
        </div>
      </div>
    `).join('');
  }
}

function selectDonationPreset(btn, amount) {
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  const custom = document.getElementById('donation-custom-amt');
  if (custom) custom.value = '';

  const inputVal = document.getElementById('selected-donation-amt-hidden');
  if (inputVal) inputVal.value = amount;

  // tax receipts indicator
  const taxReceiptAlert = document.getElementById('tax-receipt-alert');
  if (taxReceiptAlert) {
    taxReceiptAlert.style.display = amount >= 1100 ? 'block' : 'none';
  }
}

function updateDonationCustom(val) {
  if (val) {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('selected'));
    
    const inputVal = document.getElementById('selected-donation-amt-hidden');
    if (inputVal) inputVal.value = val;

    const taxReceiptAlert = document.getElementById('tax-receipt-alert');
    if (taxReceiptAlert) {
      taxReceiptAlert.style.display = parseInt(val) >= 1100 ? 'block' : 'none';
    }
  }
}

function processDonation(e) {
  e.preventDefault();
  const btn = document.getElementById('donation-submit-btn');
  if (btn) {
    btn.textContent = "Processing Offering...";
    btn.disabled = true;
  }

  const amt = parseInt(document.getElementById('selected-donation-amt-hidden').value) || 501;
  const name = document.getElementById('donor-name').value || 'Anonymous';
  const cause = document.getElementById('donor-cause').value;
  const showOnWall = document.getElementById('donor-show-wall').checked;

  setTimeout(() => {
    triggerConfetti();

    // Success overlay
    const flowBox = document.getElementById('donation-flow-container');
    if (flowBox) {
      flowBox.innerHTML = `
        <div class="success-card" style="padding: 60px 40px;">
          <div class="success-checkmark">✅</div>
          <h2 style="font-family:'Playfair Display',serif; font-size:32px; font-weight:700; color:var(--success); margin-bottom:12px;">Donation Successful!</h2>
          <p style="font-size:16px; color:var(--muted); max-width:400px; margin:0 auto 24px;">Thank you for your generous contribution of **₹${amt.toLocaleString('en-IN')}** to Kashi Vishwanath. May blessings guide your path.</p>
          
          <div style="background:var(--parchment); border:1.5px solid var(--border); border-radius:12px; padding:20px; text-align:left; margin-bottom:32px; font-size:14px;">
            <div style="display:flex; justify-content:between; margin-bottom:8px;">
              <span>Recipent</span>
              <strong style="margin-left:auto;">Kashi Vishwanath Mandir Trust</strong>
            </div>
            <div style="display:flex; justify-content:between; margin-bottom:8px;">
              <span>Donor Name</span>
              <strong style="margin-left:auto;">${name}</strong>
            </div>
            <div style="display:flex; justify-content:between;">
              <span>Amount Recieved</span>
              <strong style="margin-left:auto; color:var(--saffron);">₹${amt.toLocaleString('en-IN')}</strong>
            </div>
          </div>
          
          <div style="display:flex; gap:12px; justify-content:center;">
            <button class="btn btn-primary" onclick="alert('Digital tax receipt sent to your email!')">Print 80G Receipt</button>
            <a href="shrine.html" class="btn btn-ghost">Explore Shrines</a>
          </div>
        </div>
      `;
    }

    // append to wall
    if (showOnWall) {
      insertDonorWallItem(name, amt, cause, true);
    }
  }, 1500);
}

function insertDonorWallItem(name, amt, cause, isUser = false) {
  const wall = document.getElementById('donor-list-wall');
  if (!wall) return;

  const item = document.createElement('div');
  item.className = 'donor-item highlight-flash';
  item.innerHTML = `
    <div>
      <strong style="color:var(--dark);">${name}</strong>
      <span style="font-size:12px;color:var(--muted);display:block;">${cause}</span>
    </div>
    <div style="text-align:right;">
      <span style="font-family:'Playfair Display',serif;font-weight:700;color:var(--saffron);">₹${amt.toLocaleString('en-IN')}</span>
      <span style="font-size:11px;color:var(--muted);display:block;">Just now</span>
    </div>
  `;

  // Prepend to list
  wall.insertBefore(item, wall.firstChild);

  // Fade out highlight flash after 5 seconds
  setTimeout(() => {
    item.classList.remove('highlight-flash');
  }, 5000);

  // Limit list to 25 items
  if (wall.children.length > 25) {
    wall.removeChild(wall.lastChild);
  }
}

/* ============================================================
   DYNAMIC SHRINAGE LOADER & ROUTING SYSTEM
   ============================================================ */

function getFestivalsForDeity(deity) {
  if (deity === 'Shiva') {
    return [
      { date: "12 June 2026", title: "Pradosh Vrat", desc: "Special sunset prayers and Bilva leaf offerings to Lord Shiva." },
      { date: "28 June 2026", title: "Maha Shivratri Seva", desc: "Midnight Abhishekams and sacred chants of Om Namah Shivaya." },
      { date: "15 July 2026", title: "Sawan Somvar", desc: "Highly auspicious Mondays of Shiva. Expect beautiful temple decorations." }
    ];
  } else if (deity === 'Vishnu' || deity === 'Krishna') {
    return [
      { date: "18 June 2026", title: "Nirjala Ekadashi", desc: "Special fasting rituals and sacred Vishnu Sahasranama chanting." },
      { date: "10 July 2026", title: "Rath Yatra Celebration", desc: "Grand chariot procession, floral decorations, and community feasts." },
      { date: "24 August 2026", title: "Krishna Janmashtami", desc: "Midnight celebration of the divine birth with butter and sweet offerings." }
    ];
  } else if (deity === 'Devi') {
    return [
      { date: "18 June 2026", title: "Shakti Vrat", desc: "Sacred chants of Lalitha Sahasranama and kumkum archana." },
      { date: "03 October 2026", title: "Sharad Navratri Begin", desc: "Nine nights of glorious decorations and divine feminine worship." },
      { date: "12 October 2026", title: "Vijayadashami", desc: "Grand victory celebrations and special deity blessings." }
    ];
  } else {
    return [
      { date: "18 June 2026", title: "Auspicious Ekadashi", desc: "Special bhajan programs and sacred prayers at the altar." },
      { date: "15 July 2026", title: "Guru Purnima", desc: "Honoring the lineage of spiritual masters with holy offerings." },
      { date: "27 August 2026", title: "Ganesh Chaturthi", desc: "Celebration of obstacles removal with sweet Modaks." }
    ];
  }
}

function getReviewsForDeity(shrineName, deity) {
  if (deity === 'Shiva') {
    return [
      { name: "Srinivas A.", date: "2 days ago", stars: "★★★★★", text: `The express darshan slot booking saved our family hours! We walked in at 9:00 AM with our QR code and completed worship at ${shrineName} within 40 minutes. Extremely dignified and well organized.` },
      { name: "Pooja K.", date: "1 week ago", stars: "★★★★★", text: `Sponsoring the Mangala Aarti was a life-altering experience. Knowing our names were read aloud at the altar of ${shrineName} while we streamed remotely was deeply spiritual. Wonderful initiative.` }
    ];
  } else if (deity === 'Vishnu' || deity === 'Krishna') {
    return [
      { name: "Ramanathan S.", date: "1 day ago", stars: "★★★★★", text: `A truly divine experience at ${shrineName}. The VIP ticket was worth every rupee—immediate access and a wonderful view of the deity. The sacred Laddu prasad was absolutely delicious.` },
      { name: "Anjali G.", date: "5 days ago", stars: "★★★★★", text: `Booking through PilgrimOS was seamless! The pandit escort was extremely polite and guided us through all the major altars. Highly recommended for families with elders.` }
    ];
  } else {
    return [
      { name: "Meera N.", date: "3 days ago", stars: "★★★★★", text: `The energy at ${shrineName} is unmatched. The locker facilities included with the ticket made it very safe for our valuables. The digital entry pass scanned in seconds.` },
      { name: "Devendra B.", date: "2 weeks ago", stars: "★★★★★", text: `So peaceful and spiritually uplifting. The queue management system is world-class, ensuring a dignified darshan without any pushing or crowding. Simply beautiful!` }
    ];
  }
}

function updatePageForActiveShrine(activeShrine) {
  // Update SHRINENAME global dynamically
  SHRINENAME = `${activeShrine.name} Temple, ${activeShrine.location.split(',')[0]}`;

  // Update browser titles if they contain hardcoded Kashi Vishwanath
  if (document.title.includes('Kashi Vishwanath')) {
    document.title = document.title.replace('Kashi Vishwanath', activeShrine.name);
  }

  // Update breadcrumbs link to shrine
  const shrineLinks = document.querySelectorAll('.breadcrumbs a[href="shrine.html"]');
  shrineLinks.forEach(link => {
    link.textContent = activeShrine.name;
    link.href = `shrine.html?id=${activeShrine.id}`;
  });

  // Dynamic text substitution across the page for generic headers, paragraphs, lists, etc.
  const replaceTextOnElements = (selector) => {
    document.querySelectorAll(selector).forEach(el => {
      if (el.textContent.includes('Kashi Vishwanath')) {
        if (el.children.length === 0) {
          el.textContent = el.textContent.replace(/Kashi Vishwanath/g, activeShrine.name);
        } else {
          Array.from(el.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes('Kashi Vishwanath')) {
              node.nodeValue = node.nodeValue.replace(/Kashi Vishwanath/g, activeShrine.name);
            }
          });
        }
      }
    });
  };

  replaceTextOnElements('h1, h2, h3, h4, p, strong, td, th, span');
}

function initializeShrineProfilePage(activeShrine) {
  // 1. Hero banner section update
  const heroSection = document.querySelector('section.cta-banner');
  if (heroSection) {
    heroSection.style.background = `linear-gradient(135deg, rgba(26, 15, 0, 0.7) 0%, rgba(26, 15, 0, 0.88) 100%), url(${activeShrine.image})`;
    heroSection.style.backgroundSize = 'cover';
    heroSection.style.backgroundPosition = 'center';
  }

  // 2. Breadcrumbs active node
  const breadcrumbActive = document.querySelector('.breadcrumbs span:last-child');
  if (breadcrumbActive) {
    breadcrumbActive.textContent = activeShrine.name;
  }

  // 3. Main Title
  const mainTitle = document.querySelector('section.cta-banner h1');
  if (mainTitle) {
    mainTitle.textContent = activeShrine.name.toLowerCase().includes('temple') || activeShrine.name.toLowerCase().includes('dham') ? activeShrine.name : activeShrine.name + ' Temple';
  }

  // 4. Subtitle
  const subtitle = document.querySelector('section.cta-banner p');
  if (subtitle) {
    subtitle.innerHTML = `${activeShrine.location} &nbsp;·&nbsp; <span style="color: var(--gold); font-weight: 600;">${activeShrine.tags.join(' &middot; ')}</span> &nbsp;·&nbsp; Open 4:00 AM – 11:00 PM`;
  }

  // 5. Crowd Badge
  const crowdBadge = document.querySelector('section.cta-banner .card-badge');
  if (crowdBadge) {
    const crowdMap = {
      low: { label: 'Low crowd right now (Fast Entry)', cls: 'crowd-low', indicator: 'low' },
      moderate: { label: 'Moderate crowd right now', cls: 'crowd-mod', indicator: 'mod' },
      high: { label: 'High crowd right now (Expect delays)', cls: 'crowd-high', indicator: 'high' }
    };
    const info = crowdMap[activeShrine.crowd] || crowdMap.low;
    crowdBadge.className = `card-badge ${info.cls}`;
    crowdBadge.innerHTML = `<span class="crowd-indicator ${info.indicator}"></span> ${info.label}`;
  }

  // 6. Editorial Description Paragraphs
  const descParagraphs = document.querySelectorAll('#panel-overview .overview-grid > div > p');
  if (descParagraphs.length >= 2) {
    descParagraphs[0].textContent = activeShrine.description1;
    descParagraphs[1].textContent = activeShrine.description2;
  }

  // 7. Sacred Gallery Cards (using local image!)
  const galleryBgs = document.querySelectorAll('.gallery-img-bg');
  galleryBgs.forEach(bg => {
    bg.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.45)), url(${activeShrine.image})`;
    bg.style.backgroundSize = 'cover';
    bg.style.backgroundPosition = 'center';
    const span = bg.querySelector('span');
    if (span) span.style.display = 'none';
  });

  // 8. View Live Map backlink
  const mapLink = document.querySelector('section.cta-banner a[href="crowd.html"]');
  if (mapLink) {
    mapLink.setAttribute('href', `crowd.html?id=${activeShrine.id}`);
  }

  // 9. Sticky Tab links
  const tabs = document.querySelectorAll('.tab-item');
  tabs.forEach(tab => {
    const target = tab.dataset.tab;
    if (target === 'darshan') {
      tab.setAttribute('onclick', `window.location.href='booking-darshan.html?id=${activeShrine.id}'`);
    } else if (target === 'aarti') {
      tab.setAttribute('onclick', `window.location.href='booking-aarti.html?id=${activeShrine.id}'`);
    } else if (target === 'puja') {
      tab.setAttribute('onclick', `window.location.href='booking-puja.html?id=${activeShrine.id}'`);
    } else if (target === 'donate') {
      tab.setAttribute('onclick', `window.location.href='donate.html?id=${activeShrine.id}'`);
    }
  });

  // 10. Sidebar direct booking links
  const sidebarLinks = document.querySelectorAll('aside .btn');
  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href.startsWith('booking-') || href === 'donate.html')) {
      link.setAttribute('href', `${href}?id=${activeShrine.id}`);
    }
  });

  // 11. Upcoming Auspicious Festivals strip
  const strip = document.querySelector('.festival-strip');
  if (strip) {
    const fests = getFestivalsForDeity(activeShrine.deity);
    strip.innerHTML = fests.map(f => `
      <div class="festival-card">
        <div class="festival-date">${f.date}</div>
        <h4 style="font-family:'Playfair Display',serif; font-size: 18px; margin-bottom: 4px;">${f.title}</h4>
        <p style="font-size: 13px; color: var(--muted);">${f.desc}</p>
      </div>
    `).join('');
  }

  // 12. Deity specific reviews tab
  const reviewsContainer = document.querySelector('#panel-reviews > div');
  if (reviewsContainer) {
    const revs = getReviewsForDeity(activeShrine.name, activeShrine.deity);
    reviewsContainer.innerHTML = `
      <div style="display: flex; gap: 32px; align-items: center; border-bottom: 1.5px solid var(--border); padding-bottom: 32px; margin-bottom: 32px;">
        <h2 style="font-family:'Playfair Display',serif; font-size: 64px; font-weight: 700; color: var(--saffron);">${activeShrine.rating}</h2>
        <div>
          <div style="font-size: 18px; font-weight: 700; color: var(--dark);">Excellent Pilgrimage Experience</div>
          <p style="color: var(--muted); font-size: 14px; margin-top: 4px;">Based on ${formatNum(activeShrine.reviews)} verified ratings across PilgrimOS.</p>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${revs.map(r => `
          <div style="border-bottom: 1px solid var(--border); padding-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="color: var(--dark);">${r.name}</strong>
              <span style="font-size: 12px; color: var(--muted);">${r.date}</span>
            </div>
            <div style="color: var(--gold); margin-bottom: 8px;">${r.stars}</div>
            <p style="font-size: 14px; color: var(--muted); line-height: 1.6;">"${r.text}"</p>
          </div>
        `).join('')}
      </div>
    `;
  }
}

/* ============================================================
   ROUTING PRESETS ON STARTUP
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Parse Shrine ID from URL search parameters
  const urlParams = new URLSearchParams(window.location.search);
  const shrineId = parseInt(urlParams.get('id')) || 1; // Default to 1 (Kashi Vishwanath)
  const activeShrine = SHRINES.find(s => s.id === shrineId);

  if (activeShrine) {
    // 1. Dynamic replacement of text elements & titles
    updatePageForActiveShrine(activeShrine);

    // 2. Specific shrine profile page setup
    if (window.location.pathname.includes('shrine.html')) {
      initializeShrineProfilePage(activeShrine);
    }
  }

  initProfileTabs();
  
  // Darshan setup
  if (document.getElementById('darshan-cal')) {
    renderCalendar();
    renderPilgrimForms();
    updateInvoice();
  }

  // Aarti setup
  if (document.getElementById('seat-map-grid')) {
    initAartiTabs();
    renderAartiSeatMap();
    updateAartiInvoice();
  }

  // Donation setup
  if (document.getElementById('live-donations-ticker-val')) {
    initDonationsPage();
  }
});

// Bind globals for inline attributes
window.nextWizardStep = nextWizardStep;
window.prevWizardStep = prevWizardStep;
window.selectDate = selectDate;
window.selectTier = selectTier;
window.selectSlot = selectSlot;
window.setPilgrimsCount = setPilgrimsCount;
window.updateSpecialNeeds = updateSpecialNeeds;
window.selectPayment = selectPayment;
window.processDarshanPayment = processDarshanPayment;

window.selectAartiDate = selectAartiDate;
window.selectAartiSession = selectAartiSession;
window.toggleSeatSelection = toggleSeatSelection;
window.selectAartiSponsorPreset = selectAartiSponsorPreset;
window.updateAartiSponsorCustom = updateAartiSponsorCustom;
window.processAartiBooking = processAartiBooking;

window.selectPuja = selectPuja;
window.processPujaBooking = processPujaBooking;

window.selectDonationPreset = selectDonationPreset;
window.updateDonationCustom = updateDonationCustom;
window.processDonation = processDonation;
