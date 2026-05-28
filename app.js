/* ============================================================
   PILGRIM OS — app.js
   All interactivity, data, and state management
============================================================ */

'use strict';

/* ---- Shrine Data ---- */
const SHRINES = [
  {
    id: 1,
    name: "Kashi Vishwanath",
    location: "Varanasi, Uttar Pradesh",
    state: "uttar-pradesh",
    categories: ["jyotirlinga", "all"],
    deity: "Shiva",
    crowd: "high",
    rating: 4.9,
    reviews: 82400,
    gradient: "linear-gradient(135deg, #C8511B 0%, #8B2500 100%)",
    icon: "🔱",
    tags: ["Jyotirlinga", "Ancient"],
    nextSlot: "6:00 AM",
    pujaFrom: "₹501",
  },
  {
    id: 2,
    name: "Tirupati Balaji",
    location: "Tirupati, Andhra Pradesh",
    state: "andhra-pradesh",
    categories: ["vaishnavite", "south", "all"],
    deity: "Vishnu",
    crowd: "high",
    rating: 4.8,
    reviews: 124000,
    gradient: "linear-gradient(135deg, #1A5276 0%, #0D2E45 100%)",
    icon: "✨",
    tags: ["Vaishnavite", "World's Richest"],
    nextSlot: "7:30 AM",
    pujaFrom: "₹300",
  },
  {
    id: 3,
    name: "Vaishno Devi",
    location: "Katra, Jammu & Kashmir",
    state: "jammu-kashmir",
    categories: ["shakti-peetha", "himalaya", "all"],
    deity: "Devi",
    crowd: "moderate",
    rating: 4.9,
    reviews: 96200,
    gradient: "linear-gradient(135deg, #6B2D8B 0%, #3B0D5E 100%)",
    icon: "🌸",
    tags: ["Shakti Peetha", "Himalayan"],
    nextSlot: "5:00 AM",
    pujaFrom: "₹251",
  },
  {
    id: 4,
    name: "Kedarnath Temple",
    location: "Rudraprayag, Uttarakhand",
    state: "uttarakhand",
    categories: ["char-dham", "himalaya", "jyotirlinga", "all"],
    deity: "Shiva",
    crowd: "low",
    rating: 4.9,
    reviews: 54300,
    gradient: "linear-gradient(135deg, #2D6A4F 0%, #0D3D25 100%)",
    icon: "⛰️",
    tags: ["Char Dham", "Jyotirlinga"],
    nextSlot: "7:00 AM",
    pujaFrom: "₹1,100",
  },
  {
    id: 5,
    name: "Meenakshi Amman",
    location: "Madurai, Tamil Nadu",
    state: "tamil-nadu",
    categories: ["shakti-peetha", "south", "all"],
    deity: "Devi",
    crowd: "moderate",
    rating: 4.8,
    reviews: 71800,
    gradient: "linear-gradient(135deg, #C8511B 0%, #D4A017 100%)",
    icon: "🌺",
    tags: ["Shakti Peetha", "Dravidian"],
    nextSlot: "6:30 AM",
    pujaFrom: "₹200",
  },
  {
    id: 6,
    name: "Badrinath Dham",
    location: "Chamoli, Uttarakhand",
    state: "uttarakhand",
    categories: ["char-dham", "himalaya", "vaishnavite", "all"],
    deity: "Vishnu",
    crowd: "low",
    rating: 4.9,
    reviews: 48700,
    gradient: "linear-gradient(135deg, #1565C0 0%, #0D3A6E 100%)",
    icon: "🏔️",
    tags: ["Char Dham", "Vaishnavite"],
    nextSlot: "6:00 AM",
    pujaFrom: "₹750",
  },
  {
    id: 7,
    name: "Somnath Temple",
    location: "Prabhas Patan, Gujarat",
    state: "gujarat",
    categories: ["jyotirlinga", "all"],
    deity: "Shiva",
    crowd: "low",
    rating: 4.7,
    reviews: 38900,
    gradient: "linear-gradient(135deg, #8B6914 0%, #5A3F00 100%)",
    icon: "🌊",
    tags: ["Jyotirlinga", "Coastal"],
    nextSlot: "6:00 AM",
    pujaFrom: "₹501",
  },
  {
    id: 8,
    name: "Shirdi Sai Baba",
    location: "Shirdi, Maharashtra",
    state: "maharashtra",
    categories: ["all"],
    deity: "Sai Baba",
    crowd: "moderate",
    rating: 4.8,
    reviews: 89200,
    gradient: "linear-gradient(135deg, #E67E22 0%, #A04000 100%)",
    icon: "🪔",
    tags: ["Universal", "Maharashtra"],
    nextSlot: "5:30 AM",
    pujaFrom: "₹51",
  },
  {
    id: 9,
    name: "Jagannath Puri",
    location: "Puri, Odisha",
    state: "odisha",
    categories: ["char-dham", "vaishnavite", "all"],
    deity: "Vishnu",
    crowd: "moderate",
    rating: 4.8,
    reviews: 62400,
    gradient: "linear-gradient(135deg, #D4A017 0%, #8B6400 100%)",
    icon: "🎡",
    tags: ["Char Dham", "Rath Yatra"],
    nextSlot: "6:00 AM",
    pujaFrom: "₹251",
  },
  {
    id: 10,
    name: "Rameshwaram Temple",
    location: "Rameswaram, Tamil Nadu",
    state: "tamil-nadu",
    categories: ["char-dham", "jyotirlinga", "south", "all"],
    deity: "Shiva",
    crowd: "low",
    rating: 4.8,
    reviews: 44500,
    gradient: "linear-gradient(135deg, #1B6CA8 0%, #0A3D5E 100%)",
    icon: "🌅",
    tags: ["Char Dham", "Jyotirlinga"],
    nextSlot: "5:00 AM",
    pujaFrom: "₹501",
  },
  {
    id: 11,
    name: "Gangotri Dham",
    location: "Uttarkashi, Uttarakhand",
    state: "uttarakhand",
    categories: ["char-dham", "himalaya", "all"],
    deity: "Ganga Devi",
    crowd: "low",
    rating: 4.7,
    reviews: 28100,
    gradient: "linear-gradient(135deg, #1E7E34 0%, #0A4A18 100%)",
    icon: "🏞️",
    tags: ["Char Dham", "River Source"],
    nextSlot: "7:00 AM",
    pujaFrom: "₹351",
  },
  {
    id: 12,
    name: "Dwarkadheesh Temple",
    location: "Dwarka, Gujarat",
    state: "gujarat",
    categories: ["char-dham", "vaishnavite", "all"],
    deity: "Krishna",
    crowd: "low",
    rating: 4.7,
    reviews: 33600,
    gradient: "linear-gradient(135deg, #2980B9 0%, #0E4D7A 100%)",
    icon: "🌊",
    tags: ["Char Dham", "Krishna"],
    nextSlot: "7:30 AM",
    pujaFrom: "₹201",
  },
];

/* ---- Circuit Data ---- */
const CIRCUITS = [
  {
    name: "Char Dham",
    shrines: 4,
    days: "18–24",
    difficulty: "hard",
    color: "rgba(200,81,27,0.1)",
    iconColor: "#C8511B",
    desc: "The four supreme abodes of the gods",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 8H20L15.5 11.5L17 18L12 14.5L7 18L8.5 11.5L4 8H9.5L12 2Z" fill="#C8511B" opacity="0.8"/></svg>`,
  },
  {
    name: "Panch Kedar",
    shrines: 5,
    days: "10–14",
    difficulty: "hard",
    color: "rgba(45,122,79,0.1)",
    iconColor: "#2D7A4F",
    desc: "Five Himalayan Shiva shrines of Uttarakhand",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M2 20L8 8L12 14L16 6L22 20H2Z" fill="#2D7A4F" opacity="0.8"/></svg>`,
  },
  {
    name: "12 Jyotirlinga",
    shrines: 12,
    days: "21–28",
    difficulty: "moderate",
    color: "rgba(124,58,237,0.1)",
    iconColor: "#7C3AED",
    desc: "The supreme manifestations of Shiva across India",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#7C3AED" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="#7C3AED" opacity="0.6"/></svg>`,
  },
  {
    name: "51 Shakti Peetha",
    shrines: 51,
    days: "60+",
    difficulty: "hard",
    color: "rgba(220,38,38,0.1)",
    iconColor: "#DC2626",
    desc: "Sacred sites where Sati's body parts fell",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3C12 3 6 8 6 13C6 16.3 8.7 19 12 19C15.3 19 18 16.3 18 13C18 8 12 3 12 3Z" fill="#DC2626" opacity="0.7"/></svg>`,
  },
  {
    name: "Sapta Puri",
    shrines: 7,
    days: "12–16",
    difficulty: "moderate",
    color: "rgba(212,160,23,0.1)",
    iconColor: "#D4A017",
    desc: "Seven most sacred cities for liberation",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="18" height="9" rx="2" fill="#D4A017" opacity="0.3" stroke="#D4A017" stroke-width="1.2"/><path d="M12 2L15 8H9L12 2Z" fill="#D4A017"/><path d="M7 12V8h10v4" stroke="#D4A017" stroke-width="1.2" fill="none"/></svg>`,
  },
];

/* ============================================================
   STATE
============================================================ */
let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'featured';

/* ============================================================
   RENDER SHRINE CARD
============================================================ */
function crowdBadge(crowd) {
  const map = {
    low: { label: 'Low Crowd', cls: 'low crowd-low' },
    moderate: { label: 'Moderate', cls: 'mod crowd-mod' },
    high: { label: 'High Crowd', cls: 'high crowd-high' },
  };
  const c = map[crowd];
  return `<div class="card-badge ${c.cls}">
    <span class="crowd-indicator ${crowd}"></span>
    ${c.label}
  </div>`;
}

function starRating(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < full; i++) stars += `<span class="star">★</span>`;
  if (half) stars += `<span class="star half">★</span>`;
  return stars;
}

function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K+';
  return n;
}

function renderShrineCard(shrine) {
  return `
  <div class="shrine-card fade-up" data-id="${shrine.id}" role="article" aria-label="${shrine.name} shrine card" onclick="if(event.target.tagName !== 'BUTTON') { if(${shrine.id} === 1) { window.location.href = 'shrine.html'; } else { alert('${shrine.name} details page coming soon in next version!'); } }">
    <div class="card-gold-shimmer"></div>
    <div class="card-image">
      <div class="card-image-bg" style="background:${shrine.gradient};">
        <!-- Mandala pattern overlay -->
        <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:0.08;" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="white" stroke-width="0.8"/>
          <circle cx="100" cy="100" r="60" stroke="white" stroke-width="0.8"/>
          <circle cx="100" cy="100" r="40" stroke="white" stroke-width="0.8"/>
          <line x1="20" y1="100" x2="180" y2="100" stroke="white" stroke-width="0.8"/>
          <line x1="100" y1="20" x2="100" y2="180" stroke="white" stroke-width="0.8"/>
          <line x1="40" y1="40" x2="160" y2="160" stroke="white" stroke-width="0.6"/>
          <line x1="160" y1="40" x2="40" y2="160" stroke="white" stroke-width="0.6"/>
        </svg>
        <!-- Temple icon -->
        <div style="font-size:56px;position:relative;z-index:1;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.3));">${shrine.icon}</div>
        <!-- Shrine name overlay -->
        <div style="position:absolute;bottom:0;left:0;right:0;padding:12px 16px;background:linear-gradient(transparent,rgba(0,0,0,0.6));">
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${shrine.tags.map(t => `<span style="background:rgba(255,255,255,0.15);border-radius:20px;padding:2px 10px;font-size:11px;color:white;font-weight:500;backdrop-filter:blur(4px);">${t}</span>`).join('')}
          </div>
        </div>
      </div>
      ${crowdBadge(shrine.crowd)}
    </div>
    <div class="card-body">
      <div class="card-location">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1C4.3 1 3 2.3 3 4C3 6.5 6 11 6 11C6 11 9 6.5 9 4C9 2.3 7.7 1 6 1ZM6 5.5C5.2 5.5 4.5 4.8 4.5 4C4.5 3.2 5.2 2.5 6 2.5C6.8 2.5 7.5 3.2 7.5 4C7.5 4.8 6.8 5.5 6 5.5Z" fill="#7A6652"/></svg>
        ${shrine.location}
      </div>
      <h2 class="card-name">${shrine.name}</h2>
      <div class="card-rating">
        <div class="stars">${starRating(shrine.rating)}</div>
        <span class="rating-num">${shrine.rating}</span>
        <span class="rating-count">(${formatNum(shrine.reviews)} reviews)</span>
      </div>
      <div style="display:flex;gap:16px;margin-bottom:16px;">
        <div style="font-size:12px;color:var(--muted);">
          <span style="font-weight:600;color:var(--dark);">Next slot:</span> ${shrine.nextSlot}
        </div>
        <div style="font-size:12px;color:var(--muted);">
          <span style="font-weight:600;color:var(--dark);">Puja from</span> ${shrine.pujaFrom}
        </div>
      </div>
      <div class="card-actions">
        <button class="btn btn-primary btn-sm card-actions" onclick="openBooking(${shrine.id}, 'darshan')" id="book-darshan-${shrine.id}">Book Darshan</button>
        <button class="btn btn-ghost btn-sm" onclick="openBooking(${shrine.id}, 'puja')" id="book-puja-${shrine.id}">Book Puja</button>
        <button class="btn btn-donate btn-sm" onclick="openBooking(${shrine.id}, 'donate')" id="btn-donate-${shrine.id}">Donate</button>
      </div>
    </div>
  </div>`;
}

/* ============================================================
   RENDER CIRCUIT CARD
============================================================ */
function renderCircuitCard(c) {
  const tagMap = { easy: 'tag-easy', moderate: 'tag-moderate', hard: 'tag-hard' };
  const diffLabel = { easy: 'Easy', moderate: 'Moderate', hard: 'Challenging' };
  return `
  <div class="circuit-card" id="circuit-${c.name.toLowerCase().replace(/\s+/g, '-')}" tabindex="0" role="button" aria-label="${c.name} circuit">
    <div class="circuit-icon" style="background:${c.color};">
      ${c.icon}
    </div>
    <h3 class="circuit-name">${c.name}</h3>
    <p style="font-size:13px;color:var(--muted);margin-bottom:12px;line-height:1.5;">${c.desc}</p>
    <div class="circuit-meta">
      <div class="circuit-meta-item">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L8.5 5.5H12L9.5 7.5L10.5 11L7 9L3.5 11L4.5 7.5L2 5.5H5.5L7 2Z" fill="${c.iconColor}" opacity="0.7"/></svg>
        ${c.shrines} shrines
      </div>
      <div class="circuit-meta-item">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="${c.iconColor}" stroke-width="1.2" fill="none" opacity="0.7"/><path d="M7 4v3.5l2.5 1.5" stroke="${c.iconColor}" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/></svg>
        ${c.days} days
      </div>
    </div>
    <span class="circuit-tag ${tagMap[c.difficulty]}">${diffLabel[c.difficulty]}</span>
  </div>`;
}

/* ============================================================
   FILTER & SORT
============================================================ */
function getFilteredShrines() {
  let list = SHRINES.filter(s => {
    const inCategory = s.categories.includes(currentFilter);
    const q = currentSearch.toLowerCase().trim();
    const matchSearch = !q
      || s.name.toLowerCase().includes(q)
      || s.location.toLowerCase().includes(q)
      || s.deity.toLowerCase().includes(q)
      || s.tags.some(t => t.toLowerCase().includes(q));
    return inCategory && matchSearch;
  });

  if (currentSort === 'rating') {
    list = [...list].sort((a, b) => b.rating - a.rating);
  } else if (currentSort === 'crowd-low') {
    const order = { low: 0, moderate: 1, high: 2 };
    list = [...list].sort((a, b) => order[a.crowd] - order[b.crowd]);
  } else if (currentSort === 'crowd-high') {
    const order = { low: 2, moderate: 1, high: 0 };
    list = [...list].sort((a, b) => order[a.crowd] - order[b.crowd]);
  }

  return list;
}

function renderShrines() {
  const container = document.getElementById('shrines-container');
  const noResults = document.getElementById('no-results');
  const resultsNum = document.getElementById('results-num');
  if (!container) return;

  const list = getFilteredShrines();

  if (list.length === 0) {
    container.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    if (resultsNum) resultsNum.textContent = '0';
    return;
  }

  if (noResults) noResults.style.display = 'none';
  if (resultsNum) resultsNum.textContent = list.length;
  container.innerHTML = list.map(renderShrineCard).join('');

  // Re-run intersection observer for new cards
  observeFadeUp();
}

/* ============================================================
   CIRCUITS RENDER
============================================================ */
function renderCircuits() {
  const container = document.getElementById('circuits-scroll');
  if (!container) return;
  container.innerHTML = CIRCUITS.map(renderCircuitCard).join('');
}

/* ============================================================
   BOOKING MODAL
============================================================ */
function openBooking(shrineId, type) {
  // Redirect Kashi Vishwanath (shrineId 1) to direct premium flows
  if (shrineId === 1) {
    if (type === 'darshan') {
      window.location.href = 'booking-darshan.html';
      return;
    } else if (type === 'puja') {
      window.location.href = 'booking-puja.html';
      return;
    } else if (type === 'donate') {
      window.location.href = 'donate.html';
      return;
    }
  }

  const shrine = SHRINES.find(s => s.id === shrineId);
  if (!shrine) return;

  const modal = document.getElementById('booking-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  const typeMap = {
    darshan: {
      title: 'Book Darshan',
      icon: '🛕',
      desc: `Reserve your darshan slot at <strong>${shrine.name}</strong>`,
      fields: [
        { label: 'Date', type: 'date', id: 'modal-date' },
        { label: 'Preferred Time', type: 'select', id: 'modal-time', options: ['6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'] },
        { label: 'Pilgrims', type: 'number', id: 'modal-pilgrims', placeholder: '1', min: 1, max: 10 },
      ],
      cta: 'Confirm Darshan Slot →',
    },
    puja: {
      title: 'Book Puja',
      icon: '🪔',
      desc: `Select a sacred ritual at <strong>${shrine.name}</strong>`,
      fields: [
        { label: 'Puja Type', type: 'select', id: 'modal-puja-type', options: ['Rudrabhishek ₹1,100', 'Sahasranama ₹501', 'Abhishekam ₹2,100', 'Archana ₹201'] },
        { label: 'Date', type: 'date', id: 'modal-puja-date' },
        { label: 'Devotee Name', type: 'text', id: 'modal-name', placeholder: 'As per records' },
        { label: 'Gotram (optional)', type: 'text', id: 'modal-gotram', placeholder: 'E.g. Bharadwaja' },
      ],
      cta: 'Confirm Puja Booking →',
    },
    donate: {
      title: 'Make a Donation',
      icon: '🌸',
      desc: `Contribute to <strong>${shrine.name}</strong>`,
      fields: [
        { label: 'Cause', type: 'select', id: 'modal-cause', options: ['Anna Daan (Free Food)', 'Temple Renovation', 'Pandit Welfare', 'Festival Fund', 'General Offering'] },
        { label: 'Amount (₹)', type: 'number', id: 'modal-amount', placeholder: '501', min: 11 },
        { label: 'Your Name', type: 'text', id: 'modal-donor-name', placeholder: 'For donation receipt' },
      ],
      cta: 'Donate with 🙏 →',
    },
  };

  const t = typeMap[type];

  content.innerHTML = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:40px;margin-bottom:12px;">${t.icon}</div>
      <h3 style="font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:var(--dark);margin-bottom:8px;">${t.title}</h3>
      <p style="font-size:14px;color:var(--muted);">${t.desc}</p>
    </div>
    <form onsubmit="submitBooking(event, '${type}')" style="display:flex;flex-direction:column;gap:16px;">
      ${t.fields.map(f => {
        if (f.type === 'select') {
          return `<div>
            <label style="display:block;font-size:13px;font-weight:600;color:var(--dark);margin-bottom:6px;">${f.label}</label>
            <select id="${f.id}" style="width:100%;height:44px;border-radius:12px;border:1.5px solid var(--border);padding:0 14px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--dark);background:white;outline:none;cursor:pointer;">
              ${f.options.map(o => `<option>${o}</option>`).join('')}
            </select>
          </div>`;
        }
        return `<div>
          <label for="${f.id}" style="display:block;font-size:13px;font-weight:600;color:var(--dark);margin-bottom:6px;">${f.label}</label>
          <input id="${f.id}" type="${f.type}" placeholder="${f.placeholder || ''}" ${f.min ? `min="${f.min}"` : ''} ${f.max ? `max="${f.max}"` : ''} style="width:100%;height:44px;border-radius:12px;border:1.5px solid var(--border);padding:0 14px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--dark);background:white;outline:none;transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--saffron)'" onblur="this.style.borderColor='var(--border)'"/>
        </div>`;
      }).join('')}
      <button type="submit" class="btn btn-primary" style="margin-top:8px;width:100%;height:48px;font-size:15px;" id="modal-submit-btn">${t.cta}</button>
    </form>
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Set today as default date
  const dateInputs = content.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(d => d.value = today);
}

function closeModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

function submitBooking(e, type) {
  e.preventDefault();
  const btn = document.getElementById('modal-submit-btn');
  if (!btn) return;

  btn.textContent = 'Processing...';
  btn.disabled = true;

  setTimeout(() => {
    const content = document.getElementById('modal-content');
    const icons = { darshan: '🎟️', puja: '🪔', donate: '✅' };
    const msgs = {
      darshan: 'Your darshan slot is confirmed! Check your phone for the QR pass.',
      puja: 'Puja booked! A pandit will be assigned within 2 hours.',
      donate: 'Donation received! Your 80G receipt will be emailed shortly.',
    };
    if (content) {
      content.innerHTML = `
        <div style="text-align:center;padding:20px 0;">
          <div style="font-size:56px;margin-bottom:16px;">${icons[type]}</div>
          <h3 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--success);margin-bottom:12px;">Booking Confirmed!</h3>
          <p style="font-size:15px;color:var(--muted);line-height:1.6;margin-bottom:24px;">${msgs[type]}</p>
          <button class="btn btn-primary" onclick="closeModal()" style="width:100%;" id="modal-done-btn">Done 🙏</button>
        </div>
      `;
    }
  }, 1500);
}

/* ============================================================
   STATS COUNTER ANIMATION
============================================================ */
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const isDecimal = target % 1 !== 0;
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ============================================================
   INTERSECTION OBSERVER — FADE UP + COUNTERS
============================================================ */
function observeFadeUp() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

function observeCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

/* ============================================================
   NAVBAR SCROLL EFFECT
============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 4px 24px rgba(200,81,27,0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

/* ============================================================
   SEARCH & FILTER INIT (explore page)
============================================================ */
function initExplore() {
  // Filter pills
  const pills = document.querySelectorAll('.pill[data-filter]');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderShrines();
    });
  });

  // Search
  const searchInput = document.getElementById('shrine-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value;
      renderShrines();
    });
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        currentSearch = '';
        renderShrines();
      }
    });
  }

  // Sort
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      renderShrines();
    });
  }

  // Modal close on backdrop click
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }

  // Keyboard close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  renderShrines();
  renderCircuits();
}

/* ============================================================
   INIT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  observeFadeUp();
  observeCounters();

  // Only run explore logic on explore page
  if (document.getElementById('shrines-container')) {
    initExplore();
  }
});

// Expose modal functions globally
window.openBooking = openBooking;
window.closeModal = closeModal;
window.submitBooking = submitBooking;
