/* ══════════════════════════════════════════
   TRIP PLANNER -- Display / Rendering
   Supports two display modes: Horizon (grid mosaic) & Journal (notebook pages)
══════════════════════════════════════════ */

// ─── Map-field helpers ───
function mapsLabel(m) {
  if (!m) return '';
  return typeof m === 'string' ? m : (m.label || `${m.lat}, ${m.lng}`);
}
function mapsClick(m) {
  if (!m) return '';
  if (typeof m === 'string') return `openMaps('${m.replace(/'/g, "\\'")}')`;
  return `openMaps(${m.lat},${m.lng})`;
}

// ─── State ───
let expandedCard = null;

/** Format time string -- highlights +1/+2 next-day notation */
function fmtTime(t) {
  if (!t) return '';
  return t.replace(/\+(\d)/, '<sup class="time-next-day">+$1</sup>');
}

/** Parse time range "09:00 - 11:30" → duration in hours. Returns 0 if not a range. */
function parseDurationHours(timeStr) {
  if (!timeStr) return 0;
  const m = timeStr.replace(/\s/g, '').match(/(\d{1,2}):(\d{2})[-\-](\d{1,2}):(\d{2})(?:\+(\d))?/);
  if (!m) return 0;
  let dur = ((+m[3] * 60 + +m[4]) - (+m[1] * 60 + +m[2])) + (+m[5] || 0) * 1440;
  if (dur < 0) dur += 1440;
  return dur / 60;
}

/** Return slot size (1-4) based on activity duration */
function getSlotSize(timeStr) {
  const h = parseDurationHours(timeStr);
  if (h >= 6) return 4;
  if (h >= 4) return 3;
  if (h >= 2) return 2;
  return 1;
}

/**
 * Smart grid layout: packs cards into a 12-column grid based on duration.
 * Each "slot" = 3 CSS columns. Cards are sized 1-4 slots (3-12 CSS cols).
 * Uses 2D occupancy packing, then proportionally stretches to fill rows.
 * @param {number[]} slotSizes - array of slot sizes (1-4) per card
 * @returns {Array<{col:number, w:number, row:number, h:number}>} placements in 12-col grid
 */
function computeSmartGrid(slotSizes) {
  const n = slotSizes.length;
  if (n === 0) return [];

  const COLS = 12;
  const cssSizes = slotSizes.map(s => s * 3);

  // Single card → full width
  if (n === 1) return [{ col: 0, w: COLS, row: 0, h: 1 }];

  // Occupancy grid
  const grid = [];
  const placements = [];

  function ensureRow(r) {
    while (grid.length <= r) grid.push(new Array(COLS).fill(false));
  }
  function isFree(r, c, w, h) {
    for (let dr = 0; dr < h; dr++) {
      ensureRow(r + dr);
      for (let dc = 0; dc < w; dc++) {
        if (c + dc >= COLS || grid[r + dr][c + dc]) return false;
      }
    }
    return true;
  }
  function mark(r, c, w, h) {
    for (let dr = 0; dr < h; dr++) {
      ensureRow(r + dr);
      for (let dc = 0; dc < w; dc++) grid[r + dr][c + dc] = true;
    }
  }
  function firstEmpty() {
    for (let r = 0; ; r++) {
      ensureRow(r);
      for (let c = 0; c < COLS; c++) {
        if (!grid[r][c]) return { r, c };
      }
    }
  }
  function availAt(r, c) {
    ensureRow(r);
    let w = 0;
    while (c + w < COLS && !grid[r][c + w]) w++;
    return w;
  }

  // Phase 1: 2D occupancy packing
  for (let i = 0; i < n; i++) {
    const S = cssSizes[i];
    const pos = firstEmpty();
    let { r, c } = pos;
    let aw = availAt(r, c);

    if (aw >= S) {
      mark(r, c, S, 1);
      placements.push({ col: c, w: S, row: r, h: 1 });
    } else if (aw >= 3) {
      // Reshape: use available width, extend vertically
      const w = aw;
      const h = Math.ceil(S / w);
      if (isFree(r, c, w, h)) {
        mark(r, c, w, h);
        placements.push({ col: c, w, row: r, h });
      } else {
        // Fallback: start new row at full width
        for (let rr = r + 1; ; rr++) {
          if (isFree(rr, 0, Math.min(S, COLS), 1)) {
            const fw = Math.min(S, COLS);
            mark(rr, 0, fw, 1);
            placements.push({ col: 0, w: fw, row: rr, h: 1 });
            break;
          }
        }
      }
    } else {
      // No space, find next row
      for (let rr = r + 1; ; rr++) {
        ensureRow(rr);
        const a = availAt(rr, 0);
        if (a >= S) {
          mark(rr, 0, S, 1);
          placements.push({ col: 0, w: S, row: rr, h: 1 });
          break;
        } else if (a >= 3) {
          const w = a, h = Math.ceil(S / w);
          if (isFree(rr, 0, w, h)) {
            mark(rr, 0, w, h);
            placements.push({ col: 0, w, row: rr, h });
            break;
          }
        }
      }
    }
  }

  // Phase 2: proportional stretch -- fill empty space on each row
  const maxRow = placements.reduce((m, p) => Math.max(m, p.row + p.h - 1), 0);
  for (let r = 0; r <= maxRow; r++) {
    const rowCards = placements.filter(p => p.row === r && p.h === 1).sort((a, b) => a.col - b.col);
    if (rowCards.length === 0) continue;

    // Find cols occupied by tall cards spanning this row
    const occupied = new Set();
    for (const p of placements) {
      if (p.h > 1 && p.row <= r && p.row + p.h > r) {
        for (let c = p.col; c < p.col + p.w; c++) occupied.add(c);
      }
    }

    const availWidth = COLS - occupied.size;
    const totalUsed = rowCards.reduce((s, p) => s + p.w, 0);
    if (totalUsed >= availWidth) continue;

    // Proportionally redistribute among h=1 cards
    const scale = availWidth / totalUsed;
    let col = 0;
    while (occupied.has(col) && col < COLS) col++;

    for (let j = 0; j < rowCards.length; j++) {
      const p = rowCards[j];
      let newW;
      if (j === rowCards.length - 1) {
        let rem = 0;
        for (let c = col; c < COLS; c++) if (!occupied.has(c)) rem++;
        newW = rem;
      } else {
        newW = Math.round(p.w * scale);
        newW = Math.max(newW, 3);
      }
      p.col = col;
      p.w = newW;
      col += newW;
      while (occupied.has(col) && col < COLS) col++;
    }
  }

  return placements;
}

/** Parse "Thu 30 Apr" → { num: "30", text: "Thu · Apr" } */
function parseDateParts(dateStr) {
  if (!dateStr) return { num: '?', text: '' };
  const m = dateStr.match(/^(\w+)\s+(\d+)\s+(\w+)$/);
  if (!m) return { num: dateStr.replace(/\D/g, '') || '?', text: dateStr };
  return { num: m[2], text: `${m[1]} \u00B7 ${m[3]}` };
}

// ══════════════════════════════════════════
//  HEADER
// ══════════════════════════════════════════

function renderHeader() {
  const mode = (typeof currentDisplayMode !== 'undefined') ? currentDisplayMode : 'horizon';
  if (mode === 'journal') return renderJournalHeader();
  return renderHorizonHeader();
}

function renderHorizonHeader() {
  const header = document.getElementById('trip-header');
  const trip = TRIP_CONFIG;
  const stats = getTripStats();

  const mapBtn = (trip.route && trip.route.length > 1)
    ? `<button class="hz-header-map" onclick="toggleTripRouteMap()" title="${t('map.tripRoute')}">${icon('map',16)}</button>`
    : '';

  const subtitleHTML = trip.subtitle
    ? `<p class="hz-subtitle">${trip.subtitle}</p>` : '';

  const statsHTML = `
    <div class="hz-stats">
      <div class="hz-stat"><span class="hz-stat-val">${stats.days}</span><span class="hz-stat-lbl">${t('header.days')}</span></div>
      <div class="hz-stat"><span class="hz-stat-val">${stats.budget > 0 ? '€' + stats.budget.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '--'}</span><span class="hz-stat-lbl">${t('header.budget')}</span></div>
      <div class="hz-stat"><span class="hz-stat-val">${stats.cities}</span><span class="hz-stat-lbl">${t('header.cities')}</span></div>
      <div class="hz-stat"><span class="hz-stat-val">${stats.countries}</span><span class="hz-stat-lbl">${t('header.countries')}</span></div>
    </div>`;

  const routeHTML = buildRouteHTML(trip);
  const badgesHTML = buildBadgesHTML(trip);

  header.className = 'hz-header';
  header.innerHTML = `
    <div class="hz-header-card">
      <div class="hz-header-top">
        <div class="hz-header-left">
          <h1 class="hz-title">${trip.title || t('display.myTrip')} <em>${trip.year || ''}</em> ${mapBtn}</h1>
          ${subtitleHTML}
        </div>
        ${statsHTML}
      </div>
      ${routeHTML}
      ${badgesHTML}
    </div>`;
}

function renderJournalHeader() {
  const header = document.getElementById('trip-header');
  const trip = TRIP_CONFIG;
  const stats = getTripStats();

  const mapBtn = (trip.route && trip.route.length > 1)
    ? `<button class="hz-header-map" onclick="toggleTripRouteMap()" title="${t('map.tripRoute')}">${icon('map',16)}</button>`
    : '';

  // Collect unique countries for stamps
  const countries = new Set();
  for (const day of DAYS) {
    if (day.flag) countries.add(day.flag);
  }
  const stampsHTML = [...countries].map(flag => {
    const name = countryName(flag);
    return `<div class="journal-stamp">${countryFlag(flag, 16)} ${name}</div>`;
  }).join('');

  const subtitleHTML = trip.subtitle
    ? `<p class="journal-cover-sub">${trip.subtitle}</p>` : '';

  header.className = 'journal-header';
  header.innerHTML = `
    <div class="journal-cover">
      <div class="journal-cover-lines"></div>
      <div class="journal-cover-margin"></div>
      <div class="journal-cover-content">
        <h1 class="journal-cover-title">${trip.title || t('display.myTrip')} <em>${trip.year || ''}</em> ${mapBtn}</h1>
        ${subtitleHTML}
        <div class="journal-cover-stats">
          <span>${stats.days} ${t('header.days')}</span>
          <span>${stats.cities} ${t('header.cities')}</span>
          <span>${stats.countries} ${t('header.countries')}</span>
        </div>
        <div class="journal-stamps">${stampsHTML}</div>
      </div>
    </div>`;
}

/** Build route pills HTML (shared between modes) */
function buildRouteHTML(trip) {
  if (!trip.route || !trip.route.length) return '';
  return '<div class="route-pills">' +
    trip.route.map((r, i) => {
      const name = countryName(r.flag);
      const flagHtml = countryFlag(r.flag, 14);
      const pill = `<span class="route-pill" title="${name}">${flagHtml} ${r.city || ''}</span>`;
      return i < trip.route.length - 1 ? pill + '<span class="route-arrow">\u203A</span>' : pill;
    }).join('') + '</div>';
}

/** Build header badges HTML (eSIM, insurance, customs, custom) */
function buildBadgesHTML(trip) {
  let html = '<div class="header-badges">';

  if (trip.esim) {
    const esim = trip.esim;
    const onclick = esim.file ? `onclick="return openDoc('${esim.file.replace(/'/g, "\\'")}', event)"` : '';
    html += `<a class="esim-badge" href="#" ${onclick} style="cursor:pointer;text-decoration:none">
      ${icon('signal',14)} ${esim.label}
      ${esim.price ? `<span class="tag tag-price">${esim.price}</span>` : ''}
      ${esim.status === 'paid' ? `<span class="tag tag-paid">${t('display.paid')}</span>` : ''}
    </a>`;
  }
  if (trip.insurance) {
    html += `<span class="esim-badge insurance-badge" style="gap:6px">${icon('shield',14)} ${trip.insurance.label}`;
    (trip.insurance.certificates || []).forEach(cert => {
      html += `<a href="#" onclick="return openDoc('${cert.file.replace(/'/g, "\\'")}', event)" class="tag tag-country" title="${cert.title}">${countryFlag(cert.flag, 14)}</a>`;
    });
    html += '</span>';
  }
  if (trip.customs) {
    html += `<span class="esim-badge customs-badge" style="gap:6px">${icon('passport',14)} ${trip.customs.label}`;
    (trip.customs.documents || []).forEach(doc => {
      html += `<a href="#" onclick="return openDoc('${doc.file.replace(/'/g, "\\'")}', event)" class="tag tag-country" title="${doc.title}">${countryFlag(doc.flag, 14)}</a>`;
    });
    html += '</span>';
  }
  if (trip.customBadges && trip.customBadges.length) {
    trip.customBadges.forEach(badge => {
      const bColor = badge.borderColor || 'var(--border2)';
      if (badge.type === 'simple') {
        const onclick = badge.file ? `onclick="return openDoc('${badge.file.replace(/'/g, "\\'")}', event)"` : '';
        html += `<a class="esim-badge" href="#" ${onclick} style="border-color:${bColor};cursor:pointer;text-decoration:none;gap:6px">
          ${badge.icon ? renderIcon(badge.icon,14) : icon('pin',14)} ${badge.label || ''}
          ${badge.price ? `<span class="tag tag-price">${badge.price}</span>` : ''}
          ${badge.status === 'paid' ? `<span class="tag tag-paid">${t('display.paid')}</span>` : ''}
        </a>`;
      } else {
        html += `<span class="esim-badge" style="border-color:${bColor};gap:6px">${badge.icon ? renderIcon(badge.icon,14) : icon('pin',14)} ${badge.label || ''}`;
        (badge.items || []).forEach(item => {
          html += `<a href="#" onclick="return openDoc('${(item.file || '').replace(/'/g, "\\'")}', event)" class="tag tag-country" title="${item.title || ''}">${item.flag ? countryFlag(item.flag, 14) : icon('paperclip',12)}</a>`;
        });
        html += '</span>';
      }
    });
  }
  html += '</div>';
  return html;
}

// ══════════════════════════════════════════
//  LEGEND
// ══════════════════════════════════════════

const TYPE_TO_LEGEND = {
  flight: 'transport', transit: 'transport', bus: 'transport',
  ferry: 'transport', taxi: 'transport',
  stay: 'stay', checkout: 'stay',
  temple: 'temple', museum: 'museum', park: 'park',
  market: 'market', viewpoint: 'viewpoint', monument: 'viewpoint',
  nightlife: 'nightlife', street: 'district',
  aquarium: 'aquarium', zoo: 'zoo', activity: 'activity',
};

const LEGEND_ENTRIES = [
  { key: 'transport', color: 'var(--transport-c)' },
  { key: 'stay',      color: 'var(--stay-c)' },
  { key: 'temple',    color: 'var(--temple-c)' },
  { key: 'museum',    color: 'var(--museum-c)' },
  { key: 'park',      color: 'var(--park-c)' },
  { key: 'market',    color: 'var(--market-c)' },
  { key: 'viewpoint', color: 'var(--viewpoint-c)' },
  { key: 'nightlife', color: 'var(--nightlife-c)' },
  { key: 'district',  color: 'var(--street-c)' },
  { key: 'aquarium',  color: 'var(--aquarium-c)' },
  { key: 'zoo',       color: 'var(--zoo-c)' },
  { key: 'activity',  color: 'var(--activity-c)' },
];

const _selectedLegendCategories = new Set();

function renderLegend() {
  const legend = document.getElementById('trip-legend');
  const usedTypes = new Set();
  for (const day of DAYS) {
    for (const card of day.cards || []) {
      if (card.type) usedTypes.add(card.type);
    }
  }
  const usedCategories = new Set();
  for (const type of usedTypes) {
    const cat = TYPE_TO_LEGEND[type];
    if (cat) usedCategories.add(cat);
  }
  if (usedCategories.size === 0) {
    legend.innerHTML = `<span class="legend-empty">${t('legend.empty')}</span>`;
    return;
  }
  legend.innerHTML = LEGEND_ENTRIES
    .filter(e => usedCategories.has(e.key))
    .map(e => {
      const active = _selectedLegendCategories.has(e.key) ? ' legend-active' : '';
      return `<div class="legend-item${active}" data-legend="${e.key}" onclick="toggleLegendFilter('${e.key}')"><div class="legend-dot" style="background:${e.color}"></div>${t('legend.' + e.key)}</div>`;
    }).join('');
}

function toggleLegendFilter(category) {
  if (_selectedLegendCategories.has(category)) {
    _selectedLegendCategories.delete(category);
  } else {
    _selectedLegendCategories.add(category);
  }
  document.querySelectorAll('.legend-item').forEach(el => {
    el.classList.toggle('legend-active', _selectedLegendCategories.has(el.dataset.legend));
  });
  applyLegendFilter();
}

function applyLegendFilter() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  const active = _selectedLegendCategories;
  const filtering = active.size > 0;

  DAYS.forEach((day, di) => {
    const dayEl = timeline.querySelector(`.hz-day[data-day-index="${di}"], .journal-day[data-day-index="${di}"]`);
    if (!dayEl) return;
    let anyVisible = false;
    (day.cards || []).forEach((card, ci) => {
      const cardEl = dayEl.querySelector(`.hz-card[data-card="${ci}"], .journal-entry[data-card="${ci}"]`);
      if (!cardEl) return;
      const cat = TYPE_TO_LEGEND[card.type];
      const show = !filtering || (cat && active.has(cat));
      cardEl.classList.toggle('legend-hidden', !show);
      if (show) anyVisible = true;
    });
    dayEl.classList.toggle('legend-hidden', filtering && !anyVisible);
  });

  _applyCombinedVisibility();
}

function _applyCombinedVisibility() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  const searchActive = _currentSearchQuery.length > 0;
  const legendActive = _selectedLegendCategories.size > 0;
  const filtering = searchActive || legendActive;

  timeline.querySelectorAll('.hz-day, .journal-day').forEach(dayEl => {
    const cards = dayEl.querySelectorAll('.hz-card, .journal-entry');
    let anyCardVisible = false;
    cards.forEach(c => {
      if (!c.classList.contains('search-hidden') && !c.classList.contains('legend-hidden')) {
        anyCardVisible = true;
      }
    });
    if (filtering) {
      dayEl.classList.toggle('combined-hidden', !anyCardVisible);
    } else {
      dayEl.classList.remove('combined-hidden');
    }
  });
}

// ══════════════════════════════════════════
//  CARD RENDERING -- Shared Parts
// ══════════════════════════════════════════

function buildExpandedHTML(c, meta, dayFiles, dayIdx, cardIdx) {
  const tags = parseTags(c.tags);
  const colorVar = meta.color;
  const cardFiles = (dayFiles || []).filter(f => f.cardType === c.type || f.cardTitle === c.title);
  const isTransport = ['flight', 'transit', 'bus', 'ferry', 'taxi'].includes(c.type);

  let expMain = '';
  if (isTransport) {
    expMain = `<div class="exp-route"><div><div class="exp-route-from">${c.from || ''}</div>${c.carrier ? `<div class="exp-route-carrier">${c.carrier}</div>` : ''}</div><div class="exp-route-arr">\u2192</div><div><div class="exp-route-to">${c.to || ''}</div></div></div>`;
  } else if (c.type === 'stay') {
    expMain = `<div class="stay-info">${icon('bed',14)} ${c.sub || ''}</div>`;
  }

  let contactsHTML = '';
  if (isTransport && (c.mapsFrom || c.mapsTo)) {
    if (c.mapsFrom) contactsHTML += `<div class="contact-row" onclick="${mapsClick(c.mapsFrom)}"><span class="contact-icon">${icon('map-pin',14)}</span><span class="contact-label">${t('card.departure')}</span><span class="contact-val">${mapsLabel(c.mapsFrom).split(',')[0]}</span></div>`;
    if (c.mapsTo) contactsHTML += `<div class="contact-row" onclick="${mapsClick(c.mapsTo)}"><span class="contact-icon">${icon('flag',14)}</span><span class="contact-label">${t('card.arrival')}</span><span class="contact-val">${mapsLabel(c.mapsTo).split(',')[0]}</span></div>`;
  } else if (c.maps) {
    contactsHTML += `<div class="contact-row" onclick="${mapsClick(c.maps)}"><span class="contact-icon">${icon('map-pin',14)}</span><span class="contact-label">${t('card.map')}</span><span class="contact-val">${mapsLabel(c.maps).split(',')[0]}</span></div>`;
  }
  if (c.phone) contactsHTML += `<a class="contact-row" href="tel:${c.phone}"><span class="contact-icon">${icon('phone',14)}</span><span class="contact-label">${t('card.call')}</span><span class="contact-val">${c.phone}</span></a>`;
  if (c.email) contactsHTML += `<a class="contact-row" href="mailto:${c.email}"><span class="contact-icon">${icon('mail',14)}</span><span class="contact-label">${t('card.email')}</span><span class="contact-val">${c.email}</span></a>`;

  const tipsHTML = (c.tips && c.tips.length) ? `<div class="exp-tips"><div class="exp-tips-label">${t('card.tips')}</div>${c.tips.map(tip => `<div class="tip-row"><span class="tip-bullet">\u203A</span><span class="tip-text">${tip}</span></div>`).join('')}</div>` : '';

  const filesHTML = cardFiles.length ? `<div class="exp-files"><div class="exp-files-label">${icon('paperclip',12)} ${t('card.documents')}</div><div class="files-grid">${cardFiles.map(renderFileRow).join('')}</div></div>` : '';

  const visitedBubbleTitle = c.visited ? t('visited.markUndone') : t('visited.markDone');
  const visitedBubble = (typeof dayIdx === 'number' && typeof cardIdx === 'number')
    ? `<button class="card-visited-bubble${c.visited ? ' active' : ''}" onclick="event.stopPropagation();toggleCardVisited(${dayIdx},${cardIdx})" title="${visitedBubbleTitle}"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`
    : '';
  const closeXBtn = `<button class="card-close-x" onclick="collapseCard(event)" title="${t('card.close')}">&times;</button>`;

  return `<div class="card-expanded"><div class="exp-header"><div class="exp-icon" style="color:${colorVar}">${cardIcon(c, 18)}</div><div class="exp-title-group"><div class="exp-type" style="color:${colorVar}">${meta.label}</div><div class="exp-title">${c.title || ''}</div>${(c.sub && c.type !== 'stay') ? `<div class="exp-sub">${c.sub}</div>` : ''}</div><div class="exp-time">${fmtTime(c.time)}</div>${visitedBubble}${closeXBtn}</div>${expMain}${contactsHTML ? `<div class="exp-contacts">${contactsHTML}</div>` : ''}${filesHTML}${tags.length ? `<div class="exp-tags">${tags.map(renderTag).join('')}</div>` : ''}${tipsHTML}</div>`;
}

// ══════════════════════════════════════════
//  HORIZON MODE -- Grid Mosaic Cards
// ══════════════════════════════════════════

function renderHorizonCard(c, dayColor, dayFiles, dayIdx, cardIdx) {
  const meta = TYPE_META[c.type] || { color: 'var(--activity-c)', label: c.type };
  const tags = parseTags(c.tags);
  const colorVar = meta.color;
  const isTransport = ['flight', 'transit', 'bus', 'ferry', 'taxi'].includes(c.type);
  const visitedClass = c.visited ? ' card-visited' : '';

  const visitedBubbleTitle = c.visited ? t('visited.markUndone') : t('visited.markDone');
  const visitedBubble = `<button class="card-visited-bubble${c.visited ? ' active' : ''}" onclick="event.stopPropagation();toggleCardVisited(${dayIdx},${cardIdx})" title="${visitedBubbleTitle}"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;

  // Title + sub (never truncated)
  let titleHTML, subHTML = '';
  if (isTransport) {
    titleHTML = `${c.from || ''} <span class="hz-card-arrow">\u2192</span> ${c.to || ''}`;
    subHTML = c.carrier || '';
  } else {
    titleHTML = c.title || '';
    subHTML = c.sub || '';
  }

  // Tips
  const showTips = c.tips && c.tips.length;
  const tipsHTML = showTips
    ? `<div class="hz-card-tips">${c.tips.slice(0, 3).map(tip => `<div class="hz-card-tip">${tip}</div>`).join('')}</div>` : '';

  // Tags
  const tagsHTML = tags.length
    ? `<div class="hz-card-tags">${tags.map(tg => `<span class="tag tag-${tg.cls || 'default'}">${tg.label}</span>`).join('')}</div>` : '';

  const expandedHTML = buildExpandedHTML(c, meta, dayFiles, dayIdx, cardIdx);

  // Transport gets a special compact connector-style look
  if (isTransport) {
    return `
    <div class="hz-card hz-card-transport${visitedClass}" style="--card-c:${colorVar}" data-type="${c.type}" data-day="${dayIdx}" data-card="${cardIdx}">
      <div class="hz-card-row1">
        <div class="hz-card-icon" style="color:${colorVar};background:${colorVar}15">${cardIcon(c, 16)}</div>
        <span class="hz-card-type" style="color:${colorVar}">${meta.label}</span>
        <span class="hz-card-time">${fmtTime(c.time)}</span>
        ${visitedBubble}
      </div>
      <div class="hz-card-route">
        <span class="hz-card-route-city">${c.from || ''}</span>
        <span class="hz-card-route-arrow" style="color:${colorVar}">\u2192</span>
        <span class="hz-card-route-city">${c.to || ''}</span>
      </div>
      ${subHTML ? `<div class="hz-card-sub">${subHTML}</div>` : ''}
      ${tagsHTML}
      ${expandedHTML}
    </div>`;
  }

  return `
  <div class="hz-card${visitedClass}" style="--card-c:${colorVar}" data-type="${c.type}" data-day="${dayIdx}" data-card="${cardIdx}">
    <div class="hz-card-row1">
      <div class="hz-card-icon" style="color:${colorVar};background:${colorVar}15">${cardIcon(c, 16)}</div>
      <span class="hz-card-type" style="color:${colorVar}">${meta.label}</span>
      <span class="hz-card-time">${fmtTime(c.time)}</span>
      ${visitedBubble}
    </div>
    <div class="hz-card-title">${titleHTML}</div>
    ${subHTML ? `<div class="hz-card-sub">${subHTML}</div>` : ''}
    ${tipsHTML}
    ${tagsHTML}
    ${expandedHTML}
  </div>`;
}

// ══════════════════════════════════════════
//  JOURNAL MODE -- Notebook Entries
// ══════════════════════════════════════════

function renderJournalEntry(c, dayColor, dayFiles, dayIdx, cardIdx) {
  const meta = TYPE_META[c.type] || { color: 'var(--activity-c)', label: c.type };
  const colorVar = meta.color;
  const isTransport = ['flight', 'transit', 'bus', 'ferry', 'taxi'].includes(c.type);
  const visitedClass = c.visited ? ' card-visited' : '';

  const visitedBubbleTitle = c.visited ? t('visited.markUndone') : t('visited.markDone');
  const visitedBubble = `<button class="card-visited-bubble${c.visited ? ' active' : ''}" onclick="event.stopPropagation();toggleCardVisited(${dayIdx},${cardIdx})" title="${visitedBubbleTitle}"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;

  let titleText = isTransport ? `${c.from || ''} \u2192 ${c.to || ''}` : (c.title || '');
  let subText = isTransport ? (c.carrier || '') : (c.sub || '');

  const expandedHTML = buildExpandedHTML(c, meta, dayFiles, dayIdx, cardIdx);

  return `
  <div class="journal-entry${visitedClass}" style="--card-c:${colorVar}" data-type="${c.type}" data-day="${dayIdx}" data-card="${cardIdx}">
    <div class="journal-entry-collapsed">
      <span class="journal-entry-time">${fmtTime(c.time)}</span>
      <span class="journal-entry-dot" style="background:${colorVar}"></span>
      <div class="journal-entry-body">
        <div class="journal-entry-title">${titleText}</div>
        ${subText ? `<div class="journal-entry-sub">${subText}</div>` : ''}
      </div>
      ${visitedBubble}
    </div>
    ${expandedHTML}
  </div>`;
}

// ══════════════════════════════════════════
//  DAY RENDERING
// ══════════════════════════════════════════

function renderDay(day, dayIndex) {
  const mode = (typeof currentDisplayMode !== 'undefined') ? currentDisplayMode : 'horizon';
  if (mode === 'journal') return renderJournalDay(day, dayIndex);
  return renderHorizonDay(day, dayIndex);
}

function renderHorizonDay(day, dayIndex) {
  const foodCount = (day.food || []).length;
  const fin = dayFinancials(day);
  const actCount = countActivities(day);
  const assignedFiles = assignFilesToCards(day);
  const useLanes = needsStackedLanes(day);

  // Parse date "Thu 30 Apr" → { num: "30", text: "Thu · Apr" }
  const dateParts = parseDateParts(day.date);

  // Meta pills
  const metaPills = [];
  if (fin.hasPaid || fin.hasUnpaid) {
    const total = fin.paid + fin.unpaid;
    metaPills.push(`<span class="hz-meta-pill">\u20AC${total.toFixed(2)}</span>`);
  }
  const mapCards = (day.cards || []).filter(c => c.maps || c.mapsFrom || c.mapsTo);
  if (mapCards.length > 0) {
    metaPills.push(`<button class="hz-meta-pill day-map-btn" onclick="toggleDayMap(event, this, ${dayIndex})">${icon('map',11)} ${mapCards.length}</button>`);
  }
  if (foodCount > 0) {
    metaPills.push(`<button class="hz-meta-pill day-food-btn" onclick="toggleFood(event, this)">${icon('utensils',11)} ${foodCount} food</button>`);
  }
  if (actCount > 0) {
    metaPills.push(`<span class="hz-meta-pill">${actCount} ${actCount === 1 ? 'activity' : 'activities'}</span>`);
  }

  // City display (colored text, concept style)
  let cityHTML;
  const resolved = resolveSegments(day);
  if (resolved) {
    const unique = [...new Set(resolved.segments)];
    const isDayTrip = !!day.dayTrip;
    const separator = isDayTrip ? ' \u21CB ' : ' \u2192 ';
    cityHTML = unique.map(s => `<span style="color:${resolved.segmentColors[s]}">${s}</span>`).join(`<span style="color:var(--dim);font-size:.7rem;margin:0 6px">${separator.trim()}</span>`);
    if (isDayTrip) {
      metaPills.unshift(`<span class="hz-meta-pill" style="color:var(--park-c);border-color:rgba(116,196,138,0.25);background:rgba(116,196,138,0.06)">\u21CB ${t('lane.dayTrip')}</span>`);
    }
  } else {
    const col = CITY_COLORS[day.city] || day.color;
    const flagHtml = day.flag ? `${countryFlag(day.flag, 14)} ` : '';
    cityHTML = `${flagHtml}<span style="color:${col}">${day.city}</span>`;
  }

  // Cards -- smart grid: compute optimal placement based on duration
  let cardsInnerHTML;
  const cards = day.cards || [];
  const isTransportType = tp => ['flight','transit','bus','ferry','taxi'].includes(tp);
  if (useLanes) {
    cardsInnerHTML = renderStackedLanes(day, dayIndex, assignedFiles);
  } else {
    // Build items array with card HTML and slot sizes
    const items = [];
    for (let ci = 0; ci < cards.length; ci++) {
      const c = cards[ci];
      const isTr = isTransportType(c.type);
      // If first card is transport → add origin city placeholder before it
      if (ci === 0 && isTr && c.from) {
        const fromCity = c.from.replace(/\s*\(.*\)/, '');
        const col = CITY_COLORS[fromCity] || day.color || '#aaa';
        const fFlag = day.flag ? countryFlag(day.flag, 18) : '';
        items.push({ html: `<div class="hz-card hz-card-city-placeholder" style="--card-c:${col}"><span class="hz-city-ph-flag">${fFlag}</span><span class="hz-city-ph-name" style="color:${col}">${fromCity}</span></div>`, slots: 1 });
      }
      items.push({ html: renderHorizonCard(c, day.color, assignedFiles, dayIndex, ci), slots: getSlotSize(c.time) });
      // If last card is transport → add destination city placeholder after it
      if (ci === cards.length - 1 && isTr && c.to) {
        const toCity = c.to.replace(/\s*\(.*\)/, '');
        const destDay = DAYS.find(d => d.city === toCity);
        const tFlag = destDay ? countryFlag(destDay.flag, 18) : '';
        const col = CITY_COLORS[toCity] || day.color || '#aaa';
        items.push({ html: `<div class="hz-card hz-card-city-placeholder" style="--card-c:${col}"><span class="hz-city-ph-flag">${tFlag}</span><span class="hz-city-ph-name" style="color:${col}">${toCity}</span></div>`, slots: 1 });
      }
    }
    const placements = computeSmartGrid(items.map(it => it.slots));
    const gridItems = items.map((it, i) => {
      const p = placements[i];
      return `<div style="grid-column:${p.col + 1}/span ${p.w};grid-row:${p.row + 1}/span ${p.h}">${it.html}</div>`;
    }).join('');
    cardsInnerHTML = `<div class="hz-grid">${gridItems}</div>`;
  }

  // Food panel
  const foodPanelHTML = foodCount > 0 ? `<div class="food-panel"><div class="food-panel-inner">${day.food.map(f => `<div class="food-tip"><div class="food-emoji">${renderIcon(f.e, 18)}</div><div><div class="food-dish">${f.dish}</div><div class="food-desc">${f.desc}</div></div></div>`).join('')}</div></div>` : '';

  // Map panel
  const mapPanelHTML = mapCards.length > 0 ? `<div class="day-map-panel" id="day-map-panel-${dayIndex}"><div class="day-map-container" id="day-map-${dayIndex}"></div></div>` : '';

  return `
  <div class="hz-day" style="--day-color:${day.color || '#aaa'}" data-day-index="${dayIndex}">
    <div class="hz-day-header" onclick="toggleDay(event, this)">
      <span class="hz-date-big">${dateParts.num}</span>
      <div><div class="hz-date-text">${dateParts.text}</div></div>
      <span class="hz-city">${cityHTML}</span>
      <div class="hz-meta">${metaPills.join('')}</div>
    </div>
    <div class="hz-day-body">
      ${mapPanelHTML}
      ${foodPanelHTML}
      ${cardsInnerHTML}
    </div>
  </div>`;
}

function renderJournalDay(day, dayIndex) {
  const foodCount = (day.food || []).length;
  const assignedFiles = assignFilesToCards(day);
  const col = CITY_COLORS[day.city] || day.color;
  const dateParts = parseDateParts(day.date);
  const flagHtml = day.flag ? countryFlag(day.flag, 14) : '';

  const foodBubble = foodCount > 0 ? `<button class="hz-meta-pill day-food-btn" onclick="toggleFood(event, this)">${icon('utensils',11)} ${foodCount}</button>` : '';
  const foodPanelHTML = foodCount > 0 ? `<div class="food-panel"><div class="food-panel-inner">${day.food.map(f => `<div class="food-tip"><div class="food-emoji">${renderIcon(f.e, 18)}</div><div><div class="food-dish">${f.dish}</div><div class="food-desc">${f.desc}</div></div></div>`).join('')}</div></div>` : '';

  const mapCards = (day.cards || []).filter(c => c.maps || c.mapsFrom || c.mapsTo);
  const mapPanelHTML = mapCards.length > 0 ? `<div class="day-map-panel" id="day-map-panel-${dayIndex}"><div class="day-map-container" id="day-map-${dayIndex}"></div></div>` : '';
  const mapBubble = mapCards.length > 0 ? `<button class="hz-meta-pill day-map-btn" onclick="toggleDayMap(event, this, ${dayIndex})">${icon('map',11)} ${mapCards.length}</button>` : '';

  const entriesHTML = (day.cards || []).map((c, ci) => renderJournalEntry(c, day.color, assignedFiles, dayIndex, ci)).join('');

  // Stamp only for day trips (show origin city)
  const isDayTrip = !!day.dayTrip;
  const stampHTML = isDayTrip
    ? `<span class="journal-day-trip-badge" style="border-color:${col};color:${col}">${t('lane.dayTrip')} \u2014 ${day.city}</span>`
    : '';

  return `
  <div class="journal-day" style="--day-color:${col}" data-day-index="${dayIndex}">
    <div class="journal-page" onclick="toggleDay(event, this)">
      <div class="journal-page-header">
        <div class="journal-date-block">
          <div class="journal-date-num">${dateParts.num}</div>
          <div class="journal-date-month">${dateParts.text}</div>
        </div>
        <div class="journal-city-info">
          <div class="journal-city-name" style="color:${col}">${flagHtml} ${day.city} ${stampHTML}</div>
        </div>
        <div class="hz-meta">${mapBubble}${foodBubble}</div>
      </div>
      <div class="journal-day-body">
        ${mapPanelHTML}
        ${foodPanelHTML}
        <div class="journal-entries">
          ${entriesHTML}
        </div>
      </div>
    </div>
  </div>`;
}

// ══════════════════════════════════════════
//  STACKED LANES (Multi-city & Day Trips)
// ══════════════════════════════════════════

function renderStackedLanes(day, dayIndex, assignedFiles) {
  const resolved = resolveSegments(day);
  const isDayTrip = !!day.dayTrip;
  const knownCities = Object.keys(CITY_COLORS);
  const isTransportType = tp => ['transit', 'flight', 'bus', 'ferry', 'taxi'].includes(tp);

  if (!resolved) {
    const fallbackCards = day.cards || [];
    const fallbackSlots = fallbackCards.map(c => getSlotSize(c.time));
    const fallbackPlacements = computeSmartGrid(fallbackSlots);
    const fallbackItems = fallbackCards.map((c, ci) => {
      const p = fallbackPlacements[ci];
      return `<div style="grid-column:${p.col + 1}/span ${p.w};grid-row:${p.row + 1}/span ${p.h}">${renderHorizonCard(c, day.color, assignedFiles, dayIndex, ci)}</div>`;
    }).join('');
    return `<div class="hz-grid">${fallbackItems}</div>`;
  }

  const sc = resolved.segmentColors;
  const segs = resolved.segments;

  // Separate cards into lanes and transport connectors
  const lanes = [];
  const connectors = [];
  let currentCity = segs[0];
  let currentLane = { city: currentCity, color: sc[currentCity] || day.color, cards: [] };

  for (let i = 0; i < (day.cards || []).length; i++) {
    const c = day.cards[i];
    const isTransport = isTransportType(c.type);

    // Transport that bridges cities → make a connector
    if (isTransport && c.to) {
      let destCity = null;
      for (const city of knownCities) {
        if (c.to.includes(city) && city !== currentCity) { destCity = city; break; }
      }
      if (destCity) {
        lanes.push(currentLane);
        connectors.push({ afterLane: lanes.length - 1, card: c, index: i, fromCity: currentCity, toCity: destCity, fromColor: sc[currentCity] || day.color, toColor: sc[destCity] || day.color });
        currentCity = destCity;
        currentLane = { city: destCity, color: sc[destCity] || day.color, cards: [] };
        continue;
      }
    }

    const cardCity = c.city || currentCity;
    if (cardCity !== currentCity) {
      if (currentLane.cards.length > 0) lanes.push(currentLane);
      currentCity = cardCity;
      currentLane = { city: cardCity, color: sc[cardCity] || day.color, cards: [] };
    }
    currentLane.cards.push({ card: c, index: i });
    if (c.city) currentCity = c.city;
  }
  // Always push last lane (may be empty destination city after transport)
  lanes.push(currentLane);

  let html = '<div class="hz-lanes">';

  lanes.forEach((lane, li) => {
    const flagCode = (day.flag && lane.city === day.city) ? day.flag : (DAYS.find(d => d.city === lane.city)?.flag || day.flag);
    const flagHtml = flagCode ? countryFlag(flagCode, 14) : '';
    const isEmpty = lane.cards.length === 0;

    html += `
    <div class="hz-lane${isEmpty ? ' hz-lane-empty' : ''}" style="background:${lane.color}08">
      <div class="hz-lane-header">
        ${flagHtml}
        <span style="color:${lane.color}">${lane.city}</span>
      </div>
      ${lane.cards.length > 0 ? (() => {
        const laneSlots = lane.cards.map(({ card }) => getSlotSize(card.time));
        const lanePlacements = computeSmartGrid(laneSlots);
        const laneItems = lane.cards.map(({ card, index }, j) => {
          const p = lanePlacements[j];
          return `<div style="grid-column:${p.col + 1}/span ${p.w};grid-row:${p.row + 1}/span ${p.h}">${renderHorizonCard(card, day.color, assignedFiles, dayIndex, index)}</div>`;
        }).join('');
        return `<div class="hz-lane-grid">${laneItems}</div>`;
      })() : ''}
    </div>`;

    // Insert transport connector after this lane if any
    const conn = connectors.filter(cn => cn.afterLane === li);
    conn.forEach(cn => {
      const tags = parseTags(cn.card.tags);
      const tagsHTML = tags.map(tg => `<span class="tag tag-${tg.cls || 'default'}">${tg.label}</span>`).join('');
      const isReturn = isDayTrip && cn.toCity === (day.parentCity || lanes[0]?.city);
      const connMeta = TYPE_META[cn.card.type] || { color: 'var(--transport-c)', label: cn.card.type };
      const connExpandedHTML = buildExpandedHTML(cn.card, connMeta, assignedFiles, dayIndex, cn.index);
      html += `
      <div class="hz-connector${isReturn ? ' hz-connector-return' : ''}" data-type="${cn.card.type}" data-day="${dayIndex}" data-card="${cn.index}" style="--card-c:var(--transport-c)">
        <div class="hz-connector-line-v" style="background:var(--transport-c)"></div>
        <div class="hz-connector-pill" style="color:var(--transport-c);border:1px ${isReturn ? 'dashed' : 'solid'} rgba(90,180,212,0.2);background:rgba(90,180,212,0.06)">
          ${cardIcon(cn.card, 16)}
          <span style="color:${cn.fromColor}">${cn.fromCity}</span>
          <span style="color:var(--dim)">\u2192</span>
          <span style="color:${cn.toColor}">${cn.toCity}</span>
          <span class="hz-connector-time">${fmtTime(cn.card.time)}</span>
          ${tagsHTML}
          ${isReturn ? `<span class="hz-connector-return-label">${t('lane.return').toUpperCase()}</span>` : ''}
        </div>
        ${connExpandedHTML}
      </div>`;
    });
  });

  // Day trip return connector (if no explicit return transport)
  if (isDayTrip && !connectors.some(cn => cn.toCity === (day.parentCity || lanes[0]?.city))) {
    html += `<div class="hz-connector hz-connector-return">
      <div class="hz-connector-line-v" style="background:var(--transport-c)"></div>
      <div class="hz-connector-pill" style="color:var(--transport-c);border:1px dashed rgba(90,180,212,0.2);background:rgba(90,180,212,0.04)">
        <span class="hz-connector-return-label">${t('lane.return').toUpperCase()}</span>
      </div>
    </div>`;
  }

  html += '</div>';
  return html;
}

// ══════════════════════════════════════════
//  TIMELINE
// ══════════════════════════════════════════

function renderTimeline() {
  const timeline = document.getElementById('timeline');

  let html = '';
  for (let di = 0; di < DAYS.length; di++) {
    html += renderDay(DAYS[di], di);
  }

  timeline.innerHTML = html;

  // Card click handler
    timeline.addEventListener('click', function (e) {
    // If clicking any interactive element inside an expanded card, do nothing -- let it work
    if (e.target.closest('.card-expanded')) return;

    const card = e.target.closest('.hz-card, .journal-entry, .hz-connector');
    if (!card) return;
    if (card.classList.contains('hz-card-city-placeholder')) return;
    if (e.target.closest('.card-close-x')) return;
    if (card.classList.contains('expanded')) return;
    if (expandedCard && expandedCard !== card) {
      expandedCard.classList.remove('expanded');
      const oldWrap = expandedCard.parentElement;
      if (oldWrap && oldWrap._origGridCol) {
        oldWrap.style.gridColumn = oldWrap._origGridCol;
        oldWrap.style.gridRow = oldWrap._origGridRow;
      }
    }
    expandCard(card);
  });
}

// ══════════════════════════════════════════
//  INTERACTION HANDLERS
// ══════════════════════════════════════════

function toggleLocation(header) {
  // No-op: city groups removed, kept for backwards compat
}

function toggleDay(e, header) {
  if (e.target.closest('.day-food-btn')) return;
  if (e.target.closest('.day-map-btn')) return;
  if (e.target.closest('.hz-meta-pill[onclick]')) return;
  if (e.target.closest('.journal-entry')) return;
  if (e.target.closest('.hz-card')) return;
  if (e.target.closest('.card-expanded')) return;
  const day = header.closest('.hz-day, .journal-day');
  const body = day.querySelector('.hz-day-body, .journal-day-body');
  const isCollapsed = day.classList.contains('collapsed');
  if (isCollapsed) {
    day.classList.remove('collapsed');
    body.style.height = body.scrollHeight + 'px';
    body.addEventListener('transitionend', () => { body.style.height = 'auto'; }, { once: true });
  } else {
    body.style.height = body.scrollHeight + 'px';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      body.style.height = '0';
      day.classList.add('collapsed');
    }));
  }
}

function toggleFood(e, btn) {
  e.stopPropagation();
  const day = btn.closest('.hz-day, .journal-day');
  const panel = day.querySelector('.food-panel');
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  if (isOpen) { panel.classList.remove('open'); btn.classList.remove('active'); }
  else { panel.classList.add('open'); btn.classList.add('active'); }
}

function expandCard(cardEl) {
  if (expandedCard && expandedCard !== cardEl) {
    expandedCard.classList.remove('expanded');
    // Restore wrapper grid placement
    const oldWrap = expandedCard.parentElement;
    if (oldWrap && oldWrap._origGridCol) {
      oldWrap.style.gridColumn = oldWrap._origGridCol;
      oldWrap.style.gridRow = oldWrap._origGridRow;
    }
  }
  cardEl.classList.add('expanded');
  expandedCard = cardEl;
  // Expand wrapper to full width if inside smart grid
  const wrap = cardEl.parentElement;
  if (wrap && wrap.parentElement && (wrap.parentElement.classList.contains('hz-grid') || wrap.parentElement.classList.contains('hz-lane-grid'))) {
    wrap._origGridCol = wrap.style.gridColumn;
    wrap._origGridRow = wrap.style.gridRow;
    wrap.style.gridColumn = '1 / -1';
    wrap.style.gridRow = 'auto';
  }
  document.getElementById('card-overlay').classList.add('active');
}

function collapseCard(e) {
  e.stopPropagation();
  if (expandedCard) {
    expandedCard.classList.remove('expanded');
    const wrap = expandedCard.parentElement;
    if (wrap && wrap._origGridCol) {
      wrap.style.gridColumn = wrap._origGridCol;
      wrap.style.gridRow = wrap._origGridRow;
    }
    expandedCard = null;
    document.getElementById('card-overlay').classList.remove('active');
  }
}

// ─── Card Visited Toggle ───
function toggleCardVisited(dayIdx, cardIdx) {
  const card = DAYS[dayIdx].cards[cardIdx];
  card.visited = !card.visited;
  const sel = `.hz-card[data-day="${dayIdx}"][data-card="${cardIdx}"], .journal-entry[data-day="${dayIdx}"][data-card="${cardIdx}"]`;
  const cardEl = document.querySelector(sel);
  if (cardEl) {
    cardEl.classList.toggle('card-visited', card.visited);
    const bubble = cardEl.querySelector('.card-visited-bubble');
    if (bubble) {
      bubble.classList.toggle('active', card.visited);
      bubble.title = card.visited ? t('visited.markUndone') : t('visited.markDone');
    }
    applyPastDayClasses();
  }
  autoSaveToJSON(data => {
    if (data.days && data.days[dayIdx] && data.days[dayIdx].cards && data.days[dayIdx].cards[cardIdx]) {
      data.days[dayIdx].cards[cardIdx].visited = card.visited;
    }
  });
}

// ─── Past Day Graying ───
let grayPastEnabled = localStorage.getItem('tp-gray-past') !== 'false';

function toggleGrayPast(enabled) {
  grayPastEnabled = enabled;
  localStorage.setItem('tp-gray-past', enabled ? 'true' : 'false');
  applyPastDayClasses();
}

function applyPastDayClasses() {
  document.querySelectorAll('.hz-day, .journal-day').forEach(dayEl => {
    dayEl.classList.remove('day-past', 'day-past-unvisited', 'day-past-all-unvisited');
  });
  document.querySelectorAll('.hz-card, .journal-entry').forEach(el => {
    el.classList.remove('card-past-unvisited');
  });
  if (!grayPastEnabled) return;

  DAYS.forEach((day, di) => {
    if (!isDayInPast(day.date)) return;
    const dayEl = document.querySelector(`.hz-day[data-day-index="${di}"], .journal-day[data-day-index="${di}"]`);
    if (!dayEl) return;

    dayEl.classList.add('day-past');
    const cards = day.cards || [];
    const meaningfulCards = cards.filter(c => !['checkout'].includes(c.type));
    const unvisitedCards = meaningfulCards.filter(c => !c.visited);

    if (unvisitedCards.length > 0 && unvisitedCards.length === meaningfulCards.length && meaningfulCards.length > 0) {
      dayEl.classList.add('day-past-all-unvisited');
    } else if (unvisitedCards.length > 0) {
      dayEl.classList.add('day-past-unvisited');
    }

    // Mark individual unvisited cards
    const cardEls = dayEl.querySelectorAll(`.hz-card[data-day="${di}"], .journal-entry[data-day="${di}"]`);
    cardEls.forEach(cardEl => {
      const ci = parseInt(cardEl.dataset.card);
      const c = cards[ci];
      if (c && !c.visited && !['checkout'].includes(c.type)) {
        cardEl.classList.add('card-past-unvisited');
      }
    });
  });
}

// ══════════════════════════════════════════
//  DAY ROUTE MAP (Leaflet)
// ══════════════════════════════════════════

const _dayMaps = {};

async function toggleDayMap(e, btn, dayIndex) {
  e.stopPropagation();
  const panel = document.getElementById(`day-map-panel-${dayIndex}`);
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  if (isOpen) { panel.classList.remove('open'); btn.classList.remove('active'); return; }
  panel.classList.add('open');
  btn.classList.add('active');
  await initDayMap(dayIndex);
}

function getCoords(m) {
  if (!m) return null;
  if (typeof m === 'object' && m.lat && m.lng) return { lat: m.lat, lng: m.lng };
  return null;
}

async function initDayMap(dayIndex) {
  const containerId = `day-map-${dayIndex}`;
  const container = document.getElementById(containerId);
  if (!container) return;

  const day = DAYS[dayIndex];
  const cards = (day.cards || []).filter(c => c.maps || c.mapsFrom || c.mapsTo);
  if (cards.length === 0) return;

  const isTransportType = tp => ['flight', 'transit', 'bus', 'ferry', 'taxi'].includes(tp);

  function distM(a, b) {
    const R = 6371000, toRad = v => v * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }

  const MERGE_DIST = 200;
  let ptIndex = 0;
  const allPoints = [];
  const routeSegments = [[]];
  const trajectories = [];

  for (const c of cards) {
    const meta = TYPE_META[c.type] || { label: c.type, color: '#888' };
    const color = day.color || '#aaa';

    if (isTransportType(c.type) && (c.mapsFrom || c.mapsTo)) {
      const from = getCoords(c.mapsFrom);
      const to = getCoords(c.mapsTo);
      if (from) { ptIndex++; allPoints.push({ lat: from.lat, lng: from.lng, color, idx: ptIndex, labels: [{ idx: ptIndex, icon: icon('map-pin', 14), title: mapsLabel(c.mapsFrom), type: `${meta.label} - ${t('card.departure')}` }] }); }
      if (to) { ptIndex++; allPoints.push({ lat: to.lat, lng: to.lng, color, idx: ptIndex, labels: [{ idx: ptIndex, icon: icon('flag', 14), title: mapsLabel(c.mapsTo), type: `${meta.label} - ${t('card.arrival')}` }] }); }
      if (from && to) trajectories.push({ from, to, color });
      if (from) routeSegments[routeSegments.length - 1].push(L.latLng(from.lat, from.lng));
      if (routeSegments[routeSegments.length - 1].length > 0) routeSegments.push([]);
      if (to) routeSegments[routeSegments.length - 1].push(L.latLng(to.lat, to.lng));
    } else {
      const pt = getCoords(c.maps);
      if (pt) {
        ptIndex++;
        allPoints.push({ lat: pt.lat, lng: pt.lng, color, idx: ptIndex, labels: [{ idx: ptIndex, icon: cardIcon(c, 14), title: c.title || mapsLabel(c.maps), type: meta.label }] });
        routeSegments[routeSegments.length - 1].push(L.latLng(pt.lat, pt.lng));
      }
    }
  }

  if (allPoints.length === 0) return;

  // Merge nearby points
  const merged = [];
  for (const p of allPoints) {
    const existing = merged.find(m => distM(m, p) < MERGE_DIST);
    if (existing) {
      for (const lbl of p.labels) {
        if (!existing.labels.some(l => l.title === lbl.title && l.type === lbl.type)) existing.labels.push(lbl);
      }
    } else {
      merged.push({ lat: p.lat, lng: p.lng, color: p.color, labels: p.labels.map(l => ({ ...l })) });
    }
  }

  if (_dayMaps[dayIndex]) { _dayMaps[dayIndex].remove(); delete _dayMaps[dayIndex]; }

  const map = L.map(containerId, { zoomControl: true, attributionControl: false });
  _dayMaps[dayIndex] = map;
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

  const bounds = L.latLngBounds();
  merged.forEach(m => {
    const latlng = L.latLng(m.lat, m.lng);
    bounds.extend(latlng);
    const indices = m.labels.map(l => l.idx);
    const isMulti = indices.length > 1;
    const pinText = indices.join(', ');
    const markerIcon = L.divIcon({
      className: 'day-map-marker',
      html: `<div class="map-pin${isMulti ? ' map-pin-multi' : ''}" style="background:${m.color}">${pinText}</div>`,
      iconSize: isMulti ? [36, 28] : [28, 28],
      iconAnchor: isMulti ? [18, 14] : [14, 14],
    });
    const popupHTML = m.labels.map(l =>
      `<span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:${m.color};color:#fff;font-size:0.65rem;font-weight:700;font-family:Consolas,monospace;margin-right:5px;flex-shrink:0">${l.idx}</span><b>${l.icon} ${l.title}</b><br><span style="font-size:0.8em;color:#666;margin-left:23px">${l.type}</span>`
    ).join('<hr style="margin:4px 0;border:0;border-top:1px solid #ddd">');
    L.marker(latlng, { icon: markerIcon }).addTo(map).bindPopup(popupHTML);
  });

  routeSegments.forEach(seg => {
    if (seg.length > 1) L.polyline(seg, { color: day.color || '#4a9eff', weight: 3, opacity: 0.7, dashArray: '8 6' }).addTo(map);
  });
  trajectories.forEach(tr => {
    L.polyline([L.latLng(tr.from.lat, tr.from.lng), L.latLng(tr.to.lat, tr.to.lng)], { color: tr.color || '#4a9eff', weight: 3, opacity: 0.7, dashArray: '10 8' }).addTo(map);
  });

  map.fitBounds(bounds.pad(0.15));
  setTimeout(() => map.invalidateSize(), 100);
}

// ── Trip Route Map (Header) ──
let _tripRouteMap = null;

async function toggleTripRouteMap() {
  const overlay = document.getElementById('trip-route-overlay');
  if (!overlay) return;
  const isOpen = !overlay.classList.contains('hidden');
  if (isOpen) { overlay.classList.add('hidden'); return; }
  overlay.classList.remove('hidden');
  const titleEl = document.getElementById('trip-route-title');
  if (titleEl) titleEl.textContent = t('map.tripRoute');
  await initTripRouteMap();
}

async function initTripRouteMap() {
  const containerId = 'trip-route-map';
  const container = document.getElementById(containerId);
  if (!container) return;

  const route = TRIP_CONFIG.route;
  if (!route || route.length === 0) return;

  if (_tripRouteMap) { _tripRouteMap.remove(); _tripRouteMap = null; }

  const dayTripParent = new Map();
  for (const day of DAYS) {
    if (day.dayTrip && day.parentCity) dayTripParent.set(day.city, day.parentCity);
  }

  const cityCoords = {};
  for (const r of route) {
    if (!cityCoords[r.city] && r.lat && r.lng) cityCoords[r.city] = { lat: r.lat, lng: r.lng, flag: r.flag };
  }

  const stops = [];
  for (const r of route) {
    let lat = r.lat, lng = r.lng;
    if (!lat || !lng) {
      for (const day of DAYS) {
        if (day.city !== r.city) continue;
        for (const c of (day.cards || [])) {
          const pt = getCoords(c.maps) || getCoords(c.mapsFrom) || getCoords(c.mapsTo);
          if (pt) { lat = pt.lat; lng = pt.lng; break; }
        }
        if (lat && lng) break;
      }
    }
    if (lat && lng) {
      stops.push({ lat, lng, city: r.city, flag: r.flag, country: FLAG_TO_COUNTRY[r.flag] || '' });
      if (dayTripParent.has(r.city)) {
        const parent = dayTripParent.get(r.city);
        const pc = cityCoords[parent];
        if (pc) stops.push({ lat: pc.lat, lng: pc.lng, city: parent, flag: pc.flag, country: FLAG_TO_COUNTRY[pc.flag] || '', isReturn: true });
      }
    }
  }

  if (stops.length === 0) return;

  const map = L.map(containerId, { zoomControl: true, attributionControl: false });
  _tripRouteMap = map;
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

  const bounds = L.latLngBounds();
  const coords = [];
  let markerNum = 0;

  stops.forEach(s => {
    const latlng = L.latLng(s.lat, s.lng);
    bounds.extend(latlng);
    coords.push(latlng);
    if (!s.isReturn) {
      markerNum++;
      const markerIcon = L.divIcon({
        className: 'day-map-marker',
        html: `<div class="map-pin" style="background:#4a9eff">${markerNum}</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14],
      });
      L.marker(latlng, { icon: markerIcon }).addTo(map)
        .bindPopup(`<b>${countryFlag(s.flag, 14)} ${s.city}</b><br><span style="font-size:0.85em;color:#666">${s.country}</span>`);
    }
  });

  if (coords.length > 1) L.polyline(coords, { color: '#4a9eff', weight: 3, opacity: 0.75, dashArray: '10 8' }).addTo(map);
  map.fitBounds(bounds.pad(0.15));
  setTimeout(() => map.invalidateSize(), 200);
}

// ══════════════════════════════════════════
//  TIMELINE SEARCH & FILTER
// ══════════════════════════════════════════

let _searchDebounce = null;
let _currentSearchQuery = '';

function initTimelineSearch() {
  const input = document.getElementById('timeline-search-input');
  if (!input) return;
  input.addEventListener('input', () => {
    clearTimeout(_searchDebounce);
    _searchDebounce = setTimeout(() => applyTimelineSearch(input.value.trim()), 180);
  });
}

function clearTimelineSearch() {
  const input = document.getElementById('timeline-search-input');
  if (input) input.value = '';
  _currentSearchQuery = '';
  applyTimelineSearch('');
}

function applyTimelineSearch(query) {
  _currentSearchQuery = query;
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  // Remove highlights
  timeline.querySelectorAll('.search-hl').forEach(el => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
    parent.normalize();
  });

  const noResults = document.getElementById('timeline-no-results');
  if (!query) {
    timeline.querySelectorAll('.hz-day, .journal-day').forEach(d => d.classList.remove('search-hidden'));
    timeline.querySelectorAll('.hz-card, .journal-entry').forEach(c => c.classList.remove('search-hidden'));
    if (noResults) noResults.classList.add('hidden');
    return;
  }

  const lowerQ = query.toLowerCase();
  let anyMatch = false;

  DAYS.forEach((day, di) => {
    const dayEl = timeline.querySelector(`.hz-day[data-day-index="${di}"], .journal-day[data-day-index="${di}"]`);
    if (!dayEl) return;
    const dayText = [day.date, day.city, day.parentCity || ''].join(' ').toLowerCase();
    const dayMatch = dayText.includes(lowerQ);
    let anyCardMatch = false;

    (day.cards || []).forEach((card, ci) => {
      const cardEl = dayEl.querySelector(`.hz-card[data-day="${di}"][data-card="${ci}"], .journal-entry[data-day="${di}"][data-card="${ci}"]`);
      if (!cardEl) return;
      const cardText = [card.title, card.sub, card.from, card.to, card.carrier, card.time, card.city || '', ...(card.tips || []), ...(Array.isArray(card.tags) ? card.tags : (card.tags || '').split(','))].filter(Boolean).join(' ').toLowerCase();
      const match = cardText.includes(lowerQ) || dayMatch;
      cardEl.classList.toggle('search-hidden', !match);
      if (match) anyCardMatch = true;
    });

    const visible = dayMatch || anyCardMatch;
    dayEl.classList.toggle('search-hidden', !visible);
    if (visible) anyMatch = true;
    if (visible && query.length >= 2) highlightTextInElement(dayEl, query);
  });

  _applyCombinedVisibility();
  if (noResults) {
    const anyTrulyVisible = !!timeline.querySelector('.hz-card:not(.search-hidden):not(.legend-hidden), .journal-entry:not(.search-hidden):not(.legend-hidden)');
    noResults.classList.toggle('hidden', anyTrulyVisible);
  }
}

function highlightTextInElement(container, query) {
  const lowerQ = query.toLowerCase();
  const textNodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (p.tagName === 'SCRIPT' || p.tagName === 'STYLE') return NodeFilter.FILTER_REJECT;
      if (p.classList.contains('search-hl')) return NodeFilter.FILTER_REJECT;
      if (p.closest('.search-hidden')) return NodeFilter.FILTER_REJECT;
      if (p.closest('.card-expanded')) return NodeFilter.FILTER_REJECT;
      if (node.textContent.toLowerCase().includes(lowerQ)) return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_REJECT;
    }
  });
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  for (const node of textNodes) {
    const text = node.textContent;
    const idx = text.toLowerCase().indexOf(lowerQ);
    if (idx === -1) continue;
    const before = document.createTextNode(text.substring(0, idx));
    const mark = document.createElement('mark');
    mark.className = 'search-hl';
    mark.textContent = text.substring(idx, idx + query.length);
    const after = document.createTextNode(text.substring(idx + query.length));
    const parent = node.parentNode;
    parent.insertBefore(before, node);
    parent.insertBefore(mark, node);
    parent.insertBefore(after, node);
    parent.removeChild(node);
  }
}

// ══════════════════════════════════════════
//  VIEW MODE (Pagination)
// ══════════════════════════════════════════

let currentViewMode = 'all';
let currentPage = 0;
const PAGE_SIZE = 5;

function setViewMode(mode) {
  currentViewMode = mode;
  currentPage = 0;
  if (mode === 'byDay' && DAYS.length > 0) currentPage = _findBestDayPage();
  document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  applyViewMode();
}

function _parseDayDate(displayDate) {
  if (!displayDate) return null;
  const m = displayDate.match(/^\w+\s+(\d+)\s+(\w+)$/);
  if (!m) return null;
  const dayNum = parseInt(m[1]);
  const monthNames = getMonthNames();
  let monIdx = monthNames.findIndex(mn => mn.toLowerCase() === m[2].toLowerCase());
  if (monIdx < 0) {
    const en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monIdx = en.findIndex(mn => mn.toLowerCase() === m[2].toLowerCase());
  }
  if (monIdx < 0) return null;
  const year = (TRIP_CONFIG && TRIP_CONFIG.year) ? parseInt(TRIP_CONFIG.year) : new Date().getFullYear();
  return new Date(year, monIdx, dayNum);
}

function _findBestDayPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let exactIdx = -1, earliestFutureIdx = -1, earliestFutureDate = null;
  for (let i = 0; i < DAYS.length; i++) {
    const d = _parseDayDate(DAYS[i].date);
    if (!d) continue;
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) { exactIdx = i; break; }
    if (d > today && (earliestFutureDate === null || d < earliestFutureDate)) { earliestFutureDate = d; earliestFutureIdx = i; }
  }
  if (exactIdx >= 0) return exactIdx;
  if (earliestFutureIdx >= 0) return earliestFutureIdx;
  return 0;
}

function viewPrev() { if (currentPage > 0) { currentPage--; applyViewMode(); } }
function viewNext() { const maxP = getMaxPage(); if (currentPage < maxP) { currentPage++; applyViewMode(); } }

function getMaxPage() {
  if (currentViewMode === 'byDay') return Math.max(0, DAYS.length - 1);
  if (currentViewMode === 'byCity') return Math.max(0, document.querySelectorAll('.city-divider').length - 1);
  if (currentViewMode === 'paged') return Math.max(0, Math.ceil(DAYS.length / PAGE_SIZE) - 1);
  return 0;
}

function applyViewMode() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  const nav = document.getElementById('view-page-nav');
  const pageLabel = document.getElementById('view-page-label');
  const allDays = Array.from(timeline.querySelectorAll('.hz-day, .journal-day'));
  const allDividers = Array.from(timeline.querySelectorAll('.city-divider'));

  allDays.forEach(d => d.classList.remove('view-hidden'));
  allDividers.forEach(d => d.classList.remove('view-hidden'));

  if (currentViewMode === 'all') { if (nav) nav.classList.add('hidden'); return; }
  if (nav) nav.classList.remove('hidden');

  if (currentViewMode === 'byDay') {
    allDays.forEach((d, i) => d.classList.toggle('view-hidden', i !== currentPage));
    allDividers.forEach(d => {
      const next = d.nextElementSibling;
      d.classList.toggle('view-hidden', !next || next.classList.contains('view-hidden'));
    });
    if (pageLabel) pageLabel.textContent = `${currentPage + 1} ${t('view.pageOf')} ${DAYS.length}`;
  }
  if (currentViewMode === 'byCity') {
    /* Group days by city-divider sections */
    const sections = [];
    let current = [];
    allDividers.forEach(d => d.classList.remove('view-hidden'));
    timeline.childNodes.forEach(node => {
      if (node.classList && node.classList.contains('city-divider')) {
        if (current.length) sections.push(current);
        current = [node];
      } else if (node.classList && (node.classList.contains('hz-day') || node.classList.contains('journal-day'))) {
        current.push(node);
      }
    });
    if (current.length) sections.push(current);
    sections.forEach((sec, i) => {
      const hidden = i !== currentPage;
      sec.forEach(el => el.classList.toggle('view-hidden', hidden));
    });
    if (pageLabel) pageLabel.textContent = `${currentPage + 1} ${t('view.pageOf')} ${sections.length}`;
  }
  if (currentViewMode === 'paged') {
    const start = currentPage * PAGE_SIZE, end = start + PAGE_SIZE;
    allDays.forEach((d, i) => d.classList.toggle('view-hidden', i < start || i >= end));
    allDividers.forEach(d => {
      const next = d.nextElementSibling;
      d.classList.toggle('view-hidden', !next || next.classList.contains('view-hidden'));
    });
    const totalPages = Math.ceil(DAYS.length / PAGE_SIZE);
    if (pageLabel) pageLabel.textContent = `${currentPage + 1} ${t('view.pageOf')} ${totalPages}`;
  }
}
