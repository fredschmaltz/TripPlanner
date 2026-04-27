/* ══════════════════════════════════════════
   TRIP PLANNER — Display / Rendering
══════════════════════════════════════════ */

// ─── Map-field helpers (handle both object {lat,lng,label} and legacy string) ───
function mapsLabel(m) {
  if (!m) return '';
  return typeof m === 'string' ? m : (m.label || `${m.lat}, ${m.lng}`);
}
function mapsClick(m) {
  if (!m) return '';
  if (typeof m === 'string') return `openMaps('${m.replace(/'/g, "\\'")}')`;
  return `openMaps(${m.lat},${m.lng})`;
}

// ─── Render Header ───
function renderHeader() {
  const header = document.getElementById('trip-header');
  const trip = TRIP_CONFIG;

  let routeHTML = '';
  if (trip.route && trip.route.length) {
    routeHTML = '<div class="route-pills">' +
      trip.route.map((r, i) => {
        const countryName = FLAG_TO_COUNTRY[r.flag] || '';
        const flagHtml = countryFlag(r.flag, 14);
        const pill = `<span class="route-pill" title="${countryName}">${flagHtml} ${r.city || ''}</span>`;
        return i < trip.route.length - 1 ? pill + '<span class="route-arrow">›</span>' : pill;
      }).join('') + '</div>';
  }

  let badgesHTML = '<div class="header-badges">';
  if (trip.esim) {
    const esim = trip.esim;
    const onclick = esim.file ? `onclick="return openDoc('${esim.file.replace(/'/g, "\\'")}', event)"` : '';
    badgesHTML += `<a class="esim-badge" href="#" ${onclick} style="cursor:pointer;text-decoration:none">
      ${icon('signal',14)} ${esim.label}
      ${esim.price ? `<span class="tag tag-price">${esim.price}</span>` : ''}
      ${esim.status === 'paid' ? `<span class="tag tag-paid">${t('display.paid')}</span>` : ''}
    </a>`;
  }
  if (trip.insurance) {
    badgesHTML += `<span class="esim-badge insurance-badge" style="gap:6px">${icon('shield',14)} ${trip.insurance.label}`;
    (trip.insurance.certificates || []).forEach(cert => {
      badgesHTML += `<a href="#" onclick="return openDoc('${cert.file.replace(/'/g, "\\'")}', event)" class="tag tag-country" title="${cert.title}">${countryFlag(cert.flag, 14)}</a>`;
    });
    badgesHTML += '</span>';
  }
  if (trip.customs) {
    badgesHTML += `<span class="esim-badge customs-badge" style="gap:6px">${icon('passport',14)} ${trip.customs.label}`;
    (trip.customs.documents || []).forEach(doc => {
      badgesHTML += `<a href="#" onclick="return openDoc('${doc.file.replace(/'/g, "\\'")}', event)" class="tag tag-country" title="${doc.title}">${countryFlag(doc.flag, 14)}</a>`;
    });
    badgesHTML += '</span>';
  }
  // Custom badges
  if (trip.customBadges && trip.customBadges.length) {
    trip.customBadges.forEach(badge => {
      const bColor = badge.borderColor || 'var(--border2)';
      if (badge.type === 'simple') {
        const onclick = badge.file ? `onclick="return openDoc('${badge.file.replace(/'/g, "\\'")}', event)"` : '';
        badgesHTML += `<a class="esim-badge" href="#" ${onclick} style="border-color:${bColor};cursor:pointer;text-decoration:none;gap:6px">
          ${badge.icon ? renderIcon(badge.icon,14) : icon('pin',14)} ${badge.label || ''}
          ${badge.price ? `<span class="tag tag-price">${badge.price}</span>` : ''}
          ${badge.status === 'paid' ? `<span class="tag tag-paid">${t('display.paid')}</span>` : ''}
        </a>`;
      } else {
        badgesHTML += `<span class="esim-badge" style="border-color:${bColor};gap:6px">${badge.icon ? renderIcon(badge.icon,14) : icon('pin',14)} ${badge.label || ''}`;
        (badge.items || []).forEach(item => {
          badgesHTML += `<a href="#" onclick="return openDoc('${(item.file || '').replace(/'/g, "\\'")}', event)" class="tag tag-country" title="${item.title || ''}">${item.flag ? countryFlag(item.flag, 14) : icon('paperclip',12)}</a>`;
        });
        badgesHTML += '</span>';
      }
    });
  }
  badgesHTML += '</div>';

  const mapBtn = (trip.route && trip.route.length > 1)
    ? `<button class="header-map-btn" onclick="toggleTripRouteMap()" title="${t('map.tripRoute')}">${icon('map',16)}</button>`
    : '';

  header.innerHTML = `
    <h1>${trip.title || t('display.myTrip')} <em>${trip.year || ''}</em> ${mapBtn}</h1>
    <p class="subtitle">${trip.subtitle || ''}</p>
    ${routeHTML}
    ${badgesHTML}
  `;
}

// ─── Render Legend ───

// Map each card type to its legend category
const TYPE_TO_LEGEND = {
  flight:    'transport', transit: 'transport', bus: 'transport',
  ferry:     'transport', taxi:    'transport',
  stay:      'stay',      checkout: 'stay',
  temple:    'temple',
  museum:    'museum',
  park:      'park',
  market:    'market',
  viewpoint: 'viewpoint', monument: 'viewpoint',
  nightlife: 'nightlife',
  street:    'district',
  aquarium:  'aquarium',
  zoo:       'zoo',
  activity:  'activity',
};

// Ordered legend entries: key → CSS color variable
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

// Active legend filter — empty means show all
const _selectedLegendCategories = new Set();

function renderLegend() {
  const legend = document.getElementById('trip-legend');

  // Collect all card types used in the trip
  const usedTypes = new Set();
  for (const day of DAYS) {
    for (const card of day.cards || []) {
      if (card.type) usedTypes.add(card.type);
    }
  }

  // Determine which legend categories are present
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
    })
    .join('');
}

function toggleLegendFilter(category) {
  if (_selectedLegendCategories.has(category)) {
    _selectedLegendCategories.delete(category);
  } else {
    _selectedLegendCategories.add(category);
  }
  // Update legend item active states
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

  // For each day, check if it has any matching cards
  DAYS.forEach((day, di) => {
    const dayEl = timeline.querySelector(`.day[data-day-index="${di}"]`);
    if (!dayEl) return;

    let anyVisible = false;
    (day.cards || []).forEach((card, ci) => {
      const cardEl = dayEl.querySelector(`.card[data-day="${di}"][data-card="${ci}"]`);
      if (!cardEl) return;
      const cat = TYPE_TO_LEGEND[card.type];
      const show = !filtering || (cat && active.has(cat));
      cardEl.classList.toggle('legend-hidden', !show);
      if (show) anyVisible = true;
    });

    // Hide entire day if no cards match
    dayEl.classList.toggle('legend-hidden', filtering && !anyVisible);
  });

  // Hide location groups that have no visible days
  timeline.querySelectorAll('.location-group').forEach(lg => {
    const hasVisible = lg.querySelector('.day:not(.legend-hidden):not(.view-hidden):not(.search-hidden)');
    lg.classList.toggle('legend-hidden', !hasVisible);
  });

  // Re-evaluate combined visibility (search + legend)
  _applyCombinedVisibility();
}

/**
 * Unified visibility pass: hide days and location groups where NO card
 * passes ALL active filters (search-hidden, legend-hidden).
 * This ensures AND-combination of search + legend filters at the day level.
 */
function _applyCombinedVisibility() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  const searchActive = _currentSearchQuery.length > 0;
  const legendActive = _selectedLegendCategories.size > 0;
  const filtering = searchActive || legendActive;

  // For each day, check if at least one card is visible (not hidden by ANY filter)
  timeline.querySelectorAll('.day').forEach(dayEl => {
    const cards = dayEl.querySelectorAll('.card');
    let anyCardVisible = false;
    cards.forEach(c => {
      if (!c.classList.contains('search-hidden') && !c.classList.contains('legend-hidden')) {
        anyCardVisible = true;
      }
    });
    // Add combined-hidden if no cards pass all filters (only when at least one filter is active)
    if (filtering) {
      dayEl.classList.toggle('combined-hidden', !anyCardVisible);
    } else {
      dayEl.classList.remove('combined-hidden');
    }

    // Hide segment dividers whose following cards are all hidden
    _hideEmptySegmentDividers(dayEl, filtering);
  });

  // Hide location groups with no visible days
  timeline.querySelectorAll('.location-group').forEach(lg => {
    const hasVisible = lg.querySelector('.day:not(.combined-hidden):not(.view-hidden):not(.search-hidden):not(.legend-hidden)');
    lg.classList.toggle('combined-hidden', !hasVisible);
  });
}

/**
 * Hide segment-divider elements (city sub-headers inside a day) when no
 * visible cards follow them before the next divider or end of container.
 */
function _hideEmptySegmentDividers(dayEl, filtering) {
  const cardsContainer = dayEl.querySelector('.cards');
  if (!cardsContainer) return;
  const children = Array.from(cardsContainer.children);
  // Walk dividers: for each, check if at least one following card (before the next divider) is visible
  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    if (!el.classList.contains('segment-divider')) continue;
    let hasVisibleCard = false;
    for (let j = i + 1; j < children.length; j++) {
      if (children[j].classList.contains('segment-divider')) break;
      if (children[j].classList.contains('card')) {
        const hidden = children[j].classList.contains('search-hidden') ||
                       children[j].classList.contains('legend-hidden');
        if (!hidden) { hasVisibleCard = true; break; }
      }
    }
    if (filtering) {
      el.classList.toggle('combined-hidden', !hasVisibleCard);
    } else {
      el.classList.remove('combined-hidden');
    }
  }
}

// ─── Render Card ───
let expandedCard = null;

function renderCard(c, dayColor, dayFiles, cityPill, dayIdx, cardIdx) {
  const meta = TYPE_META[c.type] || { color: 'var(--activity-c)', label: c.type };
  const tags = parseTags(c.tags);
  const colorVar = meta.color;
  const cardFiles = (dayFiles || []).filter(f => f.cardType === c.type || f.cardTitle === c.title);

  let collapsedInner = '';
  const isTransport = c.type === 'flight' || c.type === 'transit' || c.type === 'bus' || c.type === 'ferry' || c.type === 'taxi';
  if (isTransport) {
    collapsedInner = `
      <div class="transport-inline">
        <span class="transport-from">${c.from || ''}</span>
        <span class="transport-arr">→</span>
        <span class="transport-to">${c.to || ''}</span>
      </div>
      ${c.carrier ? `<div class="card-sub-inline">${c.carrier}</div>` : ''}`;
  } else {
    collapsedInner = `
      <div class="card-title">${c.title}</div>
      ${c.sub ? `<div class="card-sub-inline">${c.sub}</div>` : ''}`;
  }

  let expMain = '';
  if (isTransport) {
    expMain = `
      <div class="exp-route">
        <div><div class="exp-route-from">${c.from || ''}</div>${c.carrier ? `<div class="exp-route-carrier">${c.carrier}</div>` : ''}</div>
        <div class="exp-route-arr">→</div>
        <div><div class="exp-route-to">${c.to || ''}</div></div>
      </div>`;
  } else if (c.type === 'stay') {
    expMain = `<div class="stay-info">${icon('bed',14)} ${c.sub || ''}</div>`;
  }

  let contactsHTML = '';
  if (isTransport && (c.mapsFrom || c.mapsTo)) {
    if (c.mapsFrom) {
      contactsHTML += `<div class="contact-row" onclick="${mapsClick(c.mapsFrom)}">
        <span class="contact-icon">${icon('map-pin',14)}</span>
        <span class="contact-label">${t('card.departure')}</span>
        <span class="contact-val">${mapsLabel(c.mapsFrom).split(',')[0]}</span>
      </div>`;
    }
    if (c.mapsTo) {
      contactsHTML += `<div class="contact-row" onclick="${mapsClick(c.mapsTo)}">
        <span class="contact-icon">${icon('flag',14)}</span>
        <span class="contact-label">${t('card.arrival')}</span>
        <span class="contact-val">${mapsLabel(c.mapsTo).split(',')[0]}</span>
      </div>`;
    }
  } else if (c.maps) {
    contactsHTML += `<div class="contact-row" onclick="${mapsClick(c.maps)}">
      <span class="contact-icon">${icon('map-pin',14)}</span>
      <span class="contact-label">${t('card.map')}</span>
      <span class="contact-val">${mapsLabel(c.maps).split(',')[0]}</span>
    </div>`;
  }
  if (c.phone) {
    contactsHTML += `<a class="contact-row" href="tel:${c.phone}">
      <span class="contact-icon">${icon('phone',14)}</span>
      <span class="contact-label">${t('card.call')}</span>
      <span class="contact-val">${c.phone}</span>
    </a>`;
  }
  if (c.email) {
    contactsHTML += `<a class="contact-row" href="mailto:${c.email}">
      <span class="contact-icon">${icon('mail',14)}</span>
      <span class="contact-label">${t('card.email')}</span>
      <span class="contact-val">${c.email}</span>
    </a>`;
  }

  const tipsHTML = (c.tips && c.tips.length) ? `
    <div class="exp-tips">
      <div class="exp-tips-label">${t('card.tips')}</div>
      ${c.tips.map(t => `<div class="tip-row"><span class="tip-bullet">›</span><span class="tip-text">${t}</span></div>`).join('')}
    </div>` : '';

  const filesHTML = cardFiles.length ? `
    <div class="exp-files">
      <div class="exp-files-label">${icon('paperclip',12)} ${t('card.documents')}</div>
      <div class="files-grid">${cardFiles.map(renderFileRow).join('')}</div>
    </div>` : '';

  const fileCountBadge = cardFiles.length
    ? `<span class="day-bubble bubble-files" style="cursor:default">${icon('paperclip',11)} ${cardFiles.length}</span>`
    : '';

  const quickBtns = [];
  if (isTransport && (c.mapsFrom || c.mapsTo)) {
    if (c.mapsFrom) quickBtns.push(`<div class="card-quick-btn" onclick="event.stopPropagation();${mapsClick(c.mapsFrom)}">${icon('map-pin',12)}</div>`);
    if (c.mapsTo) quickBtns.push(`<div class="card-quick-btn" onclick="event.stopPropagation();${mapsClick(c.mapsTo)}">${icon('flag',12)}</div>`);
  } else if (c.maps) {
    quickBtns.push(`<div class="card-quick-btn" onclick="event.stopPropagation();${mapsClick(c.maps)}">${icon('map-pin',12)}</div>`);
  }
  if (c.phone) quickBtns.push(`<a class="card-quick-btn" href="tel:${c.phone}" onclick="event.stopPropagation()">${icon('phone',12)}</a>`);
  if (c.email) quickBtns.push(`<a class="card-quick-btn" href="mailto:${c.email}" onclick="event.stopPropagation()">${icon('mail',12)}</a>`);

  const visitedClass = c.visited ? ' card-visited' : '';
  const visitedBubbleTitle = c.visited ? t('visited.markUndone') : t('visited.markDone');
  const visitedBubble = (typeof dayIdx === 'number' && typeof cardIdx === 'number')
    ? `<button class="card-visited-bubble${c.visited ? ' active' : ''}" onclick="event.stopPropagation();toggleCardVisited(${dayIdx},${cardIdx})" title="${visitedBubbleTitle}"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`
    : '';
  const closeXBtn = `<button class="card-close-x" onclick="collapseCard(event)" title="${t('card.close')}">&times;</button>`;

  // Shared expanded HTML (same for all card styles)
  const expandedHTML = `
    <div class="card-expanded">
      <div class="exp-header">
        <div class="exp-icon">${cardIcon(c, 18)}</div>
        <div class="exp-title-group">
          <div class="exp-type">${meta.label}</div>
          <div class="exp-title">${c.title}</div>
          ${(c.sub && c.type !== 'stay') ? `<div class="exp-sub">${c.sub}</div>` : ''}
        </div>
        <div class="exp-time">${c.time || ''}</div>
        ${closeXBtn}
      </div>
      ${expMain}
      ${contactsHTML ? `<div class="exp-contacts">${contactsHTML}</div>` : ''}
      ${filesHTML}
      ${tags.length ? `<div class="exp-tags">${tags.map(renderTag).join('')}</div>` : ''}
      ${tipsHTML}
    </div>`;

  const style = currentCardStyle || 'classic';

  // ── Bento Grid style ──
  if (style === 'bento' || style === 'playful') {
    const wide = (isTransport || c.type === 'stay') ? ' bento-wide' : '';
    const routeHTML = isTransport
      ? `<div class="bento-icon">${cardIcon(c, 28)}</div><div class="bento-route"><span>${c.from || ''}</span><span class="bento-route-arrow"></span><span>${c.to || ''}</span></div>`
      : `<div class="bento-icon">${cardIcon(c, 28)}</div><div class="bento-title">${c.title}</div>`;
    const subHTML = (!isTransport && c.sub) ? `<div class="bento-sub">${c.sub}</div>`
      : (isTransport && c.carrier) ? `<div class="bento-sub">${c.carrier}</div>` : '';
    return `
    <div class="card${wide}${visitedClass}" style="--card-color:${colorVar}" data-type="${c.type}" data-day="${dayIdx}" data-card="${cardIdx}">
      <div class="card-collapsed bento-collapsed">
        <div class="bento-top">
          <span class="bento-badge" style="color:${colorVar}">${style === 'playful' ? '' : `<span class="bento-dot" style="background:${colorVar}"></span>`}${meta.label}</span>
          <span class="bento-time">${c.time || ''}</span>
        </div>
        ${routeHTML}
        ${subHTML}
        <div class="bento-meta">
          ${tags.map(tg => `<span class="bento-chip bento-chip-${tg.cls || 'default'}">${tg.label}</span>`).join('')}
          ${fileCountBadge}
          ${quickBtns.join('')}
          ${visitedBubble}
        </div>
      </div>
      ${expandedHTML}
    </div>`;
  }

  // ── Minimal Line style ──
  if (style === 'minimal') {
    const mTitle = isTransport ? `${c.from || ''} → ${c.to || ''}` : c.title;
    const mSub = isTransport
      ? [c.carrier, meta.label].filter(Boolean).join(' · ')
      : (c.sub || meta.label);
    return `
    <div class="card${visitedClass}" style="--card-color:${colorVar}" data-type="${c.type}" data-day="${dayIdx}" data-card="${cardIdx}">
      <div class="card-collapsed minimal-collapsed">
        <span class="minimal-dot" style="background:${colorVar}"></span>
        <span class="minimal-time">${c.time || ''}</span>
        <div class="minimal-body">
          <div class="minimal-title">${mTitle}</div>
          <div class="minimal-sub">${mSub}</div>
        </div>
        <div class="minimal-pills">
          ${tags.map(renderTag).join('')}
          ${fileCountBadge}
          ${quickBtns.join('')}
          ${visitedBubble}
        </div>
        <span class="minimal-arrow">→</span>
      </div>
      ${expandedHTML}
    </div>`;
  }

  // ── Classic style (default) ──
  return `
  <div class="card${visitedClass}" style="--card-color:${colorVar}" data-type="${c.type}" data-day="${dayIdx}" data-card="${cardIdx}">
    <div class="card-collapsed">
      <div class="card-time-col">${c.time || ''}</div>
      <div class="card-icon">${cardIcon(c, 14)}</div>
      <div class="card-main">
        <div class="card-type-label">${meta.label}</div>
        ${collapsedInner}
      </div>
      <div class="card-badges">
        ${tags.map(renderTag).join('')}
        ${fileCountBadge}
        ${quickBtns.join('')}
        ${visitedBubble}
      </div>
    </div>
    ${expandedHTML}
  </div>`;
}

// ─── Render Day ───
function renderDay(day, dayIndex) {
  const foodCount = (day.food || []).length;
  const fin = dayFinancials(day);
  const actCount = countActivities(day);
  const assignedFiles = assignFilesToCards(day);

  const resolved = resolveSegments(day);
  const sc = resolved ? resolved.segmentColors : null;
  const segs = resolved ? resolved.segments : null;
  const knownCities = Object.keys(CITY_COLORS);

  let cardsHTML = '';
  if (resolved) {
    let currentCity = segs[0];
    let lastRenderedCity = null;
    for (let i = 0; i < (day.cards || []).length; i++) {
      const c = day.cards[i];
      const cardCity = c.city || currentCity;
      if (cardCity !== lastRenderedCity) {
        cardsHTML += `<div class="segment-divider" style="color:${sc[cardCity] || 'var(--dim)'}">${cardCity}</div>`;
        lastRenderedCity = cardCity;
      }
      const pill = sc[cardCity] ? { name: cardCity, color: sc[cardCity] } : null;
      cardsHTML += renderCard(c, day.color, assignedFiles, pill, dayIndex, i);
      if ((c.type === 'transit' || c.type === 'flight') && c.to) {
        for (const city of knownCities) {
          if (c.to.includes(city) && city !== currentCity) { currentCity = city; break; }
        }
      }
      if (c.city) currentCity = c.city;
    }
  } else {
    cardsHTML = (day.cards || []).map((c, ci) => renderCard(c, day.color, assignedFiles, null, dayIndex, ci)).join('');
  }

  let dayTitleHTML;
  if (resolved) {
    const unique = [...new Set(segs)];
    const pills = unique.map(s => `<span class="city-pill" style="color:${sc[s]};border-color:${sc[s]}30;background:${sc[s]}15">${s}</span>`).join('<span style="color:var(--dim);font-size:0.7rem"> · </span>');
    dayTitleHTML = `<div class="day-title" style="gap:5px">${pills}</div>`;
  } else {
    const col = CITY_COLORS[day.city] || day.color;
    dayTitleHTML = `<div class="day-title"><span class="city-pill" style="color:${col};border-color:${col}30;background:${col}15">${day.city}</span></div>`;
  }

  let expBubble = '';
  if (fin.hasPaid || fin.hasUnpaid) {
    if (fin.hasPaid && !fin.hasUnpaid) {
      expBubble = `<span class="day-bubble bubble-all-paid">€${fin.paid.toFixed(2)}</span>`;
    } else if (!fin.hasPaid && fin.hasUnpaid) {
      expBubble = `<span class="day-bubble bubble-unpaid">€${fin.unpaid.toFixed(2)}</span>`;
    } else {
      expBubble = `<span class="day-bubble bubble-partial">€${fin.paid.toFixed(2)} / €${(fin.paid + fin.unpaid).toFixed(2)}</span>`;
    }
  }
  const foodBubble = foodCount > 0 ? `<button class="day-bubble bubble-food day-food-btn" onclick="toggleFood(event, this)">${icon('utensils',11)} ${foodCount}</button>` : '';

  // Map button — only show if any card has a maps field or cached lat/lng
  const mapCards = (day.cards || []).filter(c => c.maps || c.mapsFrom || c.mapsTo);
  const mapLocCount = mapCards.reduce((n, c) => {
    if (c.mapsFrom && c.mapsTo) return n + 2;
    return n + 1;
  }, 0);
  const mapBubble = mapCards.length > 0 ? `<button class="day-bubble day-map-btn" onclick="toggleDayMap(event, this, ${dayIndex})">${icon('map',11)} ${mapLocCount}</button>` : '';

  const summaryHTML = (expBubble || foodBubble || mapBubble) ? `<div class="day-summary">${expBubble}${mapBubble}${foodBubble}</div>` : '';

  const foodPanelHTML = foodCount > 0 ? `
    <div class="food-panel"><div class="food-panel-inner">
      ${day.food.map(f => `<div class="food-tip"><div class="food-emoji">${renderIcon(f.e, 18)}</div><div><div class="food-dish">${f.dish}</div><div class="food-desc">${f.desc}</div></div></div>`).join('')}
    </div></div>` : '';

  const mapPanelHTML = mapCards.length > 0 ? `<div class="day-map-panel" id="day-map-panel-${dayIndex}"><div class="day-map-container" id="day-map-${dayIndex}"></div></div>` : '';

  return `
  <div class="day" style="--day-color:${day.color || '#aaa'}" data-day-index="${dayIndex}">
    <div class="day-header" onclick="toggleDay(event, this)">
      <div class="day-chevron"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
      <div class="day-date">${day.date}</div>
      ${dayTitleHTML}
      ${summaryHTML}
    </div>
    <div class="day-body">
      ${mapPanelHTML}
      ${foodPanelHTML}
      <div class="cards">${cardsHTML}</div>
    </div>
  </div>`;
}

// ─── Render Timeline ───
function renderTimeline() {
  const timeline = document.getElementById('timeline');

  // Group DAYS into consecutive city stretches (same city appearing later = new group)
  const cityGroups = [];
  let lastCityKey = null;
  for (let di = 0; di < DAYS.length; di++) {
    const day = DAYS[di];
    const key = (day.dayTrip && day.parentCity) ? day.parentCity : day.city;
    if (key !== lastCityKey) {
      const base = DAYS.find(d => d.city === key && !d.dayTrip) || DAYS.find(d => d.city === key);
      cityGroups.push({ flag: base ? base.flag : '', city: key, color: base ? base.color : '#aaa', days: [], dayIndices: [], dayTripCities: new Set() });
      lastCityKey = key;
    }
    cityGroups[cityGroups.length - 1].days.push(day);
    cityGroups[cityGroups.length - 1].dayIndices.push(di);
    if (day.dayTrip) cityGroups[cityGroups.length - 1].dayTripCities.add(day.city);
  }

  const groupsHTML = cityGroups.map(g => {
    const extraCities = [...g.dayTripCities];
    const nameHTML = extraCities.length
      ? `${g.city} <span style="color:var(--dim);font-weight:400">&amp;</span> ${extraCities.join(', ')}`
      : g.city;
    const nights = g.days.filter(d => !d.dayTrip).length;
    const nightWord = nights !== 1 ? t('timeline.nights') : t('timeline.night');
    const metaLabel = nights + ' ' + nightWord + (extraCities.length ? ` \u00B7 ${extraCities.length} ${t('timeline.dayTrip')}` : '');
    const daysHTML = g.days.map((d, li) => renderDay(d, g.dayIndices[li])).join('');
    const flagHtml = g.flag ? `<span class="location-flag">${countryFlag(g.flag, 14)}</span>` : '';
    return `
    <div class="location-group">
      <div class="location-header" onclick="toggleLocation(this)">
        <div class="location-chevron"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
        ${flagHtml}
        <span class="location-name" style="color:${g.color || '#aaa'}">${nameHTML}</span>
        <span class="location-meta">${metaLabel}</span>
      </div>
      <div class="location-body">${daysHTML}</div>
    </div>`;
  }).join('');

  timeline.innerHTML = groupsHTML;

  // Re-attach click handler
  timeline.addEventListener('click', function (e) {
    const card = e.target.closest('.card');
    if (!card) return;
    if (e.target.closest('.card-close-btn')) return;
    if (e.target.closest('.contact-row')) return;
    if (e.target.closest('.card-quick-btn')) return;
    if (card.classList.contains('expanded')) return;
    if (expandedCard && expandedCard !== card) {
      expandedCard.classList.remove('expanded');
    }
    expandCard(card);
  });
}

// ─── Interaction Handlers ───
function toggleLocation(header) {
  const group = header.closest('.location-group');
  const body = group.querySelector('.location-body');
  const isCollapsed = group.classList.contains('collapsed');
  if (isCollapsed) {
    group.classList.remove('collapsed');
    body.style.height = body.scrollHeight + 'px';
    body.addEventListener('transitionend', () => { body.style.height = 'auto'; }, { once: true });
  } else {
    body.style.height = body.scrollHeight + 'px';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      body.style.height = '0';
      group.classList.add('collapsed');
    }));
  }
}

function toggleDay(e, header) {
  if (e.target.closest('.day-food-btn')) return;
  if (e.target.closest('.day-map-btn')) return;
  if (e.target.closest('.day-bubble')) return;
  const day = header.closest('.day');
  const body = day.querySelector('.day-body');
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
  const day = btn.closest('.day');
  const panel = day.querySelector('.food-panel');
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  if (isOpen) {
    panel.classList.remove('open');
    btn.classList.remove('active');
  } else {
    panel.classList.add('open');
    btn.classList.add('active');
  }
}

function expandCard(cardEl) {
  if (expandedCard && expandedCard !== cardEl) {
    expandedCard.classList.remove('expanded');
  }
  cardEl.classList.add('expanded');
  expandedCard = cardEl;
  document.getElementById('card-overlay').classList.add('active');
}

function collapseCard(e) {
  e.stopPropagation();
  if (expandedCard) {
    expandedCard.classList.remove('expanded');
    expandedCard = null;
    document.getElementById('card-overlay').classList.remove('active');
  }
}

// ─── Card Visited Toggle ───
function toggleCardVisited(dayIdx, cardIdx) {
  const card = DAYS[dayIdx].cards[cardIdx];
  card.visited = !card.visited;
  // Update the card DOM element without full re-render
  const cardEl = document.querySelector(`.card[data-day="${dayIdx}"][data-card="${cardIdx}"]`);
  if (cardEl) {
    cardEl.classList.toggle('card-visited', card.visited);
    // Update the floating visited bubble
    const bubble = cardEl.querySelector('.card-visited-bubble');
    if (bubble) {
      bubble.classList.toggle('active', card.visited);
      bubble.title = card.visited ? t('visited.markUndone') : t('visited.markDone');
    }
    // Update past-day highlights
    applyPastDayClasses();
  }
  // Auto-save to JSON
  autoSaveToJSON(data => {
    if (data.days && data.days[dayIdx] && data.days[dayIdx].cards && data.days[dayIdx].cards[cardIdx]) {
      data.days[dayIdx].cards[cardIdx].visited = card.visited;
    }
  });
}

// ─── Past Day Graying ───
let grayPastEnabled = localStorage.getItem('tp-gray-past') !== 'false'; // default true

function toggleGrayPast(enabled) {
  grayPastEnabled = enabled;
  localStorage.setItem('tp-gray-past', enabled ? 'true' : 'false');
  applyPastDayClasses();
}

function applyPastDayClasses() {
  document.querySelectorAll('.day').forEach(dayEl => {
    dayEl.classList.remove('day-past', 'day-past-unvisited', 'day-past-all-unvisited');
  });
  document.querySelectorAll('.card').forEach(el => {
    el.classList.remove('card-past-unvisited');
  });
  if (!grayPastEnabled) return;

  DAYS.forEach((day, di) => {
    if (!isDayInPast(day.date)) return;
    const dayEls = document.querySelectorAll(`.card[data-day="${di}"]`);
    const dayEl = dayEls.length > 0 ? dayEls[0].closest('.day') : null;
    if (!dayEl) return;

    dayEl.classList.add('day-past');

    // Check unvisited cards in past days
    const cards = day.cards || [];
    const meaningfulCards = cards.filter(c => !['checkout'].includes(c.type));
    const unvisitedCards = meaningfulCards.filter(c => !c.visited);

    if (unvisitedCards.length > 0 && unvisitedCards.length === meaningfulCards.length && meaningfulCards.length > 0) {
      dayEl.classList.add('day-past-all-unvisited');
    } else if (unvisitedCards.length > 0) {
      dayEl.classList.add('day-past-unvisited');
    }

    // Mark individual unvisited cards
    dayEls.forEach(cardEl => {
      const ci = parseInt(cardEl.dataset.card);
      const c = cards[ci];
      if (c && !c.visited && !['checkout'].includes(c.type)) {
        cardEl.classList.add('card-past-unvisited');
      }
    });
  });
}

// ─── Day Route Map (Leaflet) ───
const _dayMaps = {}; // dayIndex → Leaflet map instance

async function toggleDayMap(e, btn, dayIndex) {
  e.stopPropagation();
  const panel = document.getElementById(`day-map-panel-${dayIndex}`);
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  if (isOpen) {
    panel.classList.remove('open');
    btn.classList.remove('active');
    return;
  }
  panel.classList.add('open');
  btn.classList.add('active');

  // Initialize or refresh the map
  await initDayMap(dayIndex);
}

// Helper: extract {lat,lng} from a map field (object with lat/lng)
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

  const isTransportType = tp => ['flight','transit','bus','ferry','taxi'].includes(tp);

  // Haversine approximate distance in meters
  function distM(a, b) {
    const R = 6371000, toRad = v => v * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }

  const MERGE_DIST = 200; // merge pins within 200 m
  let ptIndex = 0;             // sequential number for each map point
  const allPoints = [];        // raw points (for merging into pins)
  const routeSegments = [[]];  // walking-route segments (break at transports)
  const trajectories = [];     // transport arcs

  for (const c of cards) {
    const meta = TYPE_META[c.type] || { label: c.type, color: '#888' };
    const color = day.color || '#aaa';

    if (isTransportType(c.type) && (c.mapsFrom || c.mapsTo)) {
      const from = getCoords(c.mapsFrom);
      const to   = getCoords(c.mapsTo);
      if (from) { ptIndex++; allPoints.push({ lat: from.lat, lng: from.lng, color, idx: ptIndex, labels: [{ idx: ptIndex, icon: icon('map-pin',14), title: mapsLabel(c.mapsFrom), type: `${meta.label} – ${t('card.departure')}` }] }); }
      if (to)   { ptIndex++; allPoints.push({ lat: to.lat,   lng: to.lng,   color, idx: ptIndex, labels: [{ idx: ptIndex, icon: icon('flag',14), title: mapsLabel(c.mapsTo),   type: `${meta.label} – ${t('card.arrival')}` }] }); }
      if (from && to) trajectories.push({ from, to, color });
      // Close current walking segment with departure, then start new segment with arrival
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

  // Merge nearby points into clusters
  const merged = [];
  for (const p of allPoints) {
    const existing = merged.find(m => distM(m, p) < MERGE_DIST);
    if (existing) {
      // Add labels that don't already exist in this cluster
      for (const lbl of p.labels) {
        if (!existing.labels.some(l => l.title === lbl.title && l.type === lbl.type)) {
          existing.labels.push(lbl);
        }
      }
    } else {
      merged.push({ lat: p.lat, lng: p.lng, color: p.color, labels: p.labels.map(l => ({...l})) });
    }
  }

  // Destroy existing map
  if (_dayMaps[dayIndex]) { _dayMaps[dayIndex].remove(); delete _dayMaps[dayIndex]; }

  const map = L.map(containerId, { zoomControl: true, attributionControl: false });
  _dayMaps[dayIndex] = map;
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

  const bounds = L.latLngBounds();

  merged.forEach((m) => {
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
      `<span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:${m.color};color:#fff;font-size:0.65rem;font-weight:700;font-family:Consolas,monospace;margin-right:5px;flex-shrink:0;vertical-align:middle">${l.idx}</span>` +
      `<b>${l.icon} ${l.title}</b><br><span style="font-size:0.8em;color:#666;margin-left:23px">${l.type}</span>`
    ).join('<hr style="margin:4px 0;border:0;border-top:1px solid #ddd">');

    L.marker(latlng, { icon: markerIcon }).addTo(map).bindPopup(popupHTML);
  });

  // Draw walking route segments (one per city block, broken by transports)
  routeSegments.forEach(seg => {
    if (seg.length > 1) {
      L.polyline(seg, { color: day.color || '#4a9eff', weight: 3, opacity: 0.7, dashArray: '8 6' }).addTo(map);
    }
  });

  // Draw transport trajectory arcs
  trajectories.forEach(tr => {
    L.polyline(
      [L.latLng(tr.from.lat, tr.from.lng), L.latLng(tr.to.lat, tr.to.lng)],
      { color: tr.color || '#4a9eff', weight: 3, opacity: 0.7, dashArray: '10 8' }
    ).addTo(map);
  });

  map.fitBounds(bounds.pad(0.15));
  setTimeout(() => map.invalidateSize(), 100);
}

// ─── Trip Route Map (Header) ───
let _tripRouteMap = null;

async function toggleTripRouteMap() {
  const overlay = document.getElementById('trip-route-overlay');
  if (!overlay) return;
  const isOpen = !overlay.classList.contains('hidden');
  if (isOpen) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');
  // Update title
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

  // Destroy existing
  if (_tripRouteMap) { _tripRouteMap.remove(); _tripRouteMap = null; }

  // Build a set of day trip cities → parent city from DAYS data
  const dayTripParent = new Map();
  for (const day of DAYS) {
    if (day.dayTrip && day.parentCity) {
      dayTripParent.set(day.city, day.parentCity);
    }
  }

  // Build a city → coords lookup from route entries (first occurrence)
  const cityCoords = {};
  for (const r of route) {
    const key = r.city;
    if (!cityCoords[key] && r.lat && r.lng) {
      cityCoords[key] = { lat: r.lat, lng: r.lng, flag: r.flag };
    }
  }

  // Use route-level lat/lng (stored per stop), allow duplicates for return flights
  const stops = [];
  for (const r of route) {
    let lat = r.lat, lng = r.lng;
    // Fallback: scan DAYS for a card with coords in this city
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

      // If this is a day trip city, add a return stop to parent city
      if (dayTripParent.has(r.city)) {
        const parent = dayTripParent.get(r.city);
        const pc = cityCoords[parent];
        if (pc) {
          stops.push({ lat: pc.lat, lng: pc.lng, city: parent, flag: pc.flag, country: FLAG_TO_COUNTRY[pc.flag] || '', isReturn: true });
        }
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
  stops.forEach((s) => {
    const latlng = L.latLng(s.lat, s.lng);
    bounds.extend(latlng);
    coords.push(latlng);

    // Don't add a numbered marker for return stops (day trip returns)
    if (!s.isReturn) {
      markerNum++;
      const markerIcon = L.divIcon({
        className: 'day-map-marker',
        html: `<div class="map-pin" style="background:#4a9eff">${markerNum}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker(latlng, { icon: markerIcon })
        .addTo(map)
        .bindPopup(`<b>${countryFlag(s.flag, 14)} ${s.city}</b><br><span style="font-size:0.85em;color:#666">${s.country}</span>`);
    }
  });

  if (coords.length > 1) {
    L.polyline(coords, { color: '#4a9eff', weight: 3, opacity: 0.75, dashArray: '10 8' }).addTo(map);
  }

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

  // Remove previous highlights
  timeline.querySelectorAll('.search-hl').forEach(el => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
    parent.normalize();
  });

  const noResults = document.getElementById('timeline-no-results');
  if (!query) {
    // Show everything
    timeline.querySelectorAll('.day').forEach(d => d.classList.remove('search-hidden'));
    timeline.querySelectorAll('.card').forEach(c => c.classList.remove('search-hidden'));
    timeline.querySelectorAll('.location-group').forEach(el => el.classList.remove('search-hidden'));
    if (noResults) noResults.classList.add('hidden');
    return;
  }

  const lowerQ = query.toLowerCase();
  let anyMatch = false;

  // Iterate through each day
  DAYS.forEach((day, di) => {
    const dayEl = timeline.querySelector(`.day[data-day-index="${di}"]`);
    if (!dayEl) return;

    // Check day-level text: date, city
    const dayText = [day.date, day.city, day.parentCity || ''].join(' ').toLowerCase();
    const dayMatch = dayText.includes(lowerQ);

    let anyCardMatch = false;
    (day.cards || []).forEach((card, ci) => {
      const cardEl = dayEl.querySelector(`.card[data-day="${di}"][data-card="${ci}"]`);
      if (!cardEl) return;

      const cardText = [
        card.title, card.sub, card.from, card.to, card.carrier,
        card.time, card.city || '',
        ...(card.tips || []),
        ...(Array.isArray(card.tags) ? card.tags : (card.tags || '').split(','))
      ].filter(Boolean).join(' ').toLowerCase();

      const match = cardText.includes(lowerQ) || dayMatch;
      cardEl.classList.toggle('search-hidden', !match);
      if (match) anyCardMatch = true;
    });

    const visible = dayMatch || anyCardMatch;
    dayEl.classList.toggle('search-hidden', !visible);
    if (visible) anyMatch = true;

    // Highlight matching text in visible cards
    if (visible && query.length >= 2) {
      highlightTextInElement(dayEl, query);
    }
  });

  // Hide empty location groups
  timeline.querySelectorAll('.location-group').forEach(lg => {
    const hasVisible = lg.querySelector('.day:not(.search-hidden)');
    lg.classList.toggle('search-hidden', !hasVisible);
  });

  // Re-evaluate combined visibility (search + legend)
  _applyCombinedVisibility();

  if (noResults) {
    // Check if ANY card is truly visible (passes all filters)
    const anyTrulyVisible = !!timeline.querySelector('.card:not(.search-hidden):not(.legend-hidden)');
    noResults.classList.toggle('hidden', anyTrulyVisible);
  }
}

/** Walk text nodes inside an element and wrap matching substrings with <mark> */
function highlightTextInElement(container, query) {
  const lowerQ = query.toLowerCase();
  const textNodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      // Skip script/style, hidden elements, and already-highlighted
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (p.tagName === 'SCRIPT' || p.tagName === 'STYLE') return NodeFilter.FILTER_REJECT;
      if (p.classList.contains('search-hl')) return NodeFilter.FILTER_REJECT;
      if (p.closest('.search-hidden')) return NodeFilter.FILTER_REJECT;
      if (p.closest('.card-expanded')) return NodeFilter.FILTER_REJECT; // Only highlight collapsed
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

let currentViewMode = 'all'; // 'all' | 'byDay' | 'byCity' | 'paged'
let currentPage = 0;
const PAGE_SIZE = 5; // days per page in 'paged' mode

function setViewMode(mode) {
  currentViewMode = mode;
  currentPage = 0;

  // Smart jump for byDay: land on today's date, or closest future date
  if (mode === 'byDay' && DAYS.length > 0) {
    currentPage = _findBestDayPage();
  }

  document.querySelectorAll('.view-mode-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.mode === mode)
  );
  applyViewMode();
}

/**
 * Parse a display date like "Tue 28 Apr" into a Date object using the trip year.
 * Returns null if parsing fails.
 */
function _parseDayDate(displayDate) {
  if (!displayDate) return null;
  const m = displayDate.match(/^\w+\s+(\d+)\s+(\w+)$/);
  if (!m) return null;
  const dayNum = parseInt(m[1]);
  const monthNames = getMonthNames();
  let monIdx = monthNames.findIndex(mn => mn.toLowerCase() === m[2].toLowerCase());
  if (monIdx < 0) {
    const en = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    monIdx = en.findIndex(mn => mn.toLowerCase() === m[2].toLowerCase());
  }
  if (monIdx < 0) return null;
  const year = (TRIP_CONFIG && TRIP_CONFIG.year) ? parseInt(TRIP_CONFIG.year) : new Date().getFullYear();
  return new Date(year, monIdx, dayNum);
}

/**
 * Find the best page index for byDay mode.
 * - If today matches a day entry, return that index.
 * - If all entries are in the past, return 0 (page one).
 * - Otherwise return the index of the earliest future entry.
 */
function _findBestDayPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let exactIdx = -1;
  let earliestFutureIdx = -1;
  let earliestFutureDate = null;

  for (let i = 0; i < DAYS.length; i++) {
    const d = _parseDayDate(DAYS[i].date);
    if (!d) continue;
    d.setHours(0, 0, 0, 0);

    if (d.getTime() === today.getTime()) {
      exactIdx = i;
      break;
    }
    if (d > today && (earliestFutureDate === null || d < earliestFutureDate)) {
      earliestFutureDate = d;
      earliestFutureIdx = i;
    }
  }

  if (exactIdx >= 0) return exactIdx;
  if (earliestFutureIdx >= 0) return earliestFutureIdx;
  return 0; // all in the past
}

function viewPrev() {
  if (currentPage > 0) { currentPage--; applyViewMode(); }
}

function viewNext() {
  const maxPage = getMaxPage();
  if (currentPage < maxPage) { currentPage++; applyViewMode(); }
}

function getMaxPage() {
  if (currentViewMode === 'byDay') return Math.max(0, DAYS.length - 1);
  if (currentViewMode === 'byCity') {
    const groups = document.querySelectorAll('.location-group');
    return Math.max(0, groups.length - 1);
  }
  if (currentViewMode === 'paged') return Math.max(0, Math.ceil(DAYS.length / PAGE_SIZE) - 1);
  return 0;
}

function applyViewMode() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  const nav = document.getElementById('view-page-nav');
  const pageLabel = document.getElementById('view-page-label');
  const allDays = Array.from(timeline.querySelectorAll('.day'));
  const allGroups = Array.from(timeline.querySelectorAll('.location-group'));

  // Reset visibility (respect search filter)
  allDays.forEach(d => d.classList.remove('view-hidden'));
  allGroups.forEach(g => g.classList.remove('view-hidden'));

  if (currentViewMode === 'all') {
    if (nav) nav.classList.add('hidden');
    return;
  }

  if (nav) nav.classList.remove('hidden');

  if (currentViewMode === 'byDay') {
    allDays.forEach((d, i) => {
      d.classList.toggle('view-hidden', i !== currentPage);
    });
    allGroups.forEach(g => {
      const hasVisible = g.querySelector('.day:not(.view-hidden):not(.search-hidden):not(.combined-hidden)');
      g.classList.toggle('view-hidden', !hasVisible);
    });
    if (pageLabel) pageLabel.textContent = `${currentPage + 1} ${t('view.pageOf')} ${DAYS.length}`;
  }

  if (currentViewMode === 'byCity') {
    allGroups.forEach((g, i) => {
      g.classList.toggle('view-hidden', i !== currentPage);
    });
    if (pageLabel) pageLabel.textContent = `${currentPage + 1} ${t('view.pageOf')} ${allGroups.length}`;
  }

  if (currentViewMode === 'paged') {
    const start = currentPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    allDays.forEach((d, i) => {
      d.classList.toggle('view-hidden', i < start || i >= end);
    });
    allGroups.forEach(g => {
      const hasVisible = g.querySelector('.day:not(.view-hidden):not(.search-hidden):not(.combined-hidden)');
      g.classList.toggle('view-hidden', !hasVisible);
    });
    const totalPages = Math.ceil(DAYS.length / PAGE_SIZE);
    if (pageLabel) pageLabel.textContent = `${currentPage + 1} ${t('view.pageOf')} ${totalPages}`;
  }
}
