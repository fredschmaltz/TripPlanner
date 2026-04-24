/* ══════════════════════════════════════════
   TRIP PLANNER — Display / Rendering
══════════════════════════════════════════ */

// ─── Render Header ───
function renderHeader() {
  const header = document.getElementById('trip-header');
  const trip = TRIP_CONFIG;

  let routeHTML = '';
  if (trip.route && trip.route.length) {
    routeHTML = '<div class="route-pills">' +
      trip.route.map((r, i) => {
        const countryName = FLAG_TO_COUNTRY[r.flag] || '';
        const locationLabel = countryName ? `${r.flag} ${countryName}` : r.flag;
        const pill = `<span class="route-pill" title="${countryName}">${locationLabel} ${r.city ? '· ' + r.city : ''}</span>`;
        return i < trip.route.length - 1 ? pill + '<span class="route-arrow">›</span>' : pill;
      }).join('') + '</div>';
  }

  let badgesHTML = '<div class="header-badges">';
  if (trip.esim) {
    const esim = trip.esim;
    const onclick = esim.file ? `onclick="return openDoc('${esim.file.replace(/'/g, "\\'")}', event)"` : '';
    badgesHTML += `<a class="esim-badge" href="#" ${onclick} style="cursor:pointer;text-decoration:none">
      📶 ${esim.label}
      ${esim.price ? `<span class="tag tag-price">${esim.price}</span>` : ''}
      ${esim.status === 'paid' ? `<span class="tag tag-paid">${t('display.paid')}</span>` : ''}
    </a>`;
  }
  if (trip.insurance) {
    badgesHTML += `<span class="esim-badge insurance-badge" style="gap:6px">🛡️ ${trip.insurance.label}`;
    (trip.insurance.certificates || []).forEach(cert => {
      badgesHTML += `<a href="#" onclick="return openDoc('${cert.file.replace(/'/g, "\\'")}', event)" class="tag tag-country" title="${cert.title}">${cert.flag}</a>`;
    });
    badgesHTML += '</span>';
  }
  if (trip.customs) {
    badgesHTML += `<span class="esim-badge" style="border-color:#8a6020;gap:6px">🛃 ${trip.customs.label}`;
    (trip.customs.documents || []).forEach(doc => {
      badgesHTML += `<a href="#" onclick="return openDoc('${doc.file.replace(/'/g, "\\'")}', event)" class="tag tag-country" title="${doc.title}">${doc.flag}</a>`;
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
          ${badge.icon || '📌'} ${badge.label || ''}
          ${badge.price ? `<span class="tag tag-price">${badge.price}</span>` : ''}
          ${badge.status === 'paid' ? `<span class="tag tag-paid">${t('display.paid')}</span>` : ''}
        </a>`;
      } else {
        badgesHTML += `<span class="esim-badge" style="border-color:${bColor};gap:6px">${badge.icon || '📌'} ${badge.label || ''}`;
        (badge.items || []).forEach(item => {
          badgesHTML += `<a href="#" onclick="return openDoc('${(item.file || '').replace(/'/g, "\\'")}', event)" class="tag tag-country" title="${item.title || ''}">${item.flag || '📎'}</a>`;
        });
        badgesHTML += '</span>';
      }
    });
  }
  badgesHTML += '</div>';

  header.innerHTML = `
    <h1>${trip.title || t('display.myTrip')} <em>${trip.year || ''}</em></h1>
    <p class="subtitle">${trip.subtitle || ''}</p>
    ${routeHTML}
    ${badgesHTML}
  `;
}

// ─── Render Legend ───
function renderLegend() {
  const legend = document.getElementById('trip-legend');

  // Collect all card types used in the trip
  const usedTypes = new Set();
  for (const day of DAYS) {
    for (const card of day.cards || []) {
      if (card.type) usedTypes.add(card.type);
    }
  }

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
    .map(e => `<div class="legend-item"><div class="legend-dot" style="background:${e.color}"></div>${t('legend.' + e.key)}</div>`)
    .join('');
}

// ─── Render Card ───
let expandedCard = null;

function renderCard(c, dayColor, dayFiles, cityPill) {
  const meta = TYPE_META[c.type] || { color: 'var(--activity-c)', label: c.type };
  const tags = parseTags(c.tags);
  const colorVar = meta.color;
  const cardFiles = (dayFiles || []).filter(f => f.cardType === c.type || f.cardTitle === c.title);

  let collapsedInner = '';
  if (c.type === 'flight' || c.type === 'transit' || c.type === 'bus' || c.type === 'ferry' || c.type === 'taxi') {
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
  if (c.type === 'flight' || c.type === 'transit' || c.type === 'bus' || c.type === 'ferry' || c.type === 'taxi') {
    expMain = `
      <div class="exp-route">
        <div><div class="exp-route-from">${c.from || ''}</div>${c.carrier ? `<div class="exp-route-carrier">${c.carrier}</div>` : ''}</div>
        <div class="exp-route-arr">→</div>
        <div><div class="exp-route-to">${c.to || ''}</div></div>
      </div>`;
  } else if (c.type === 'stay') {
    expMain = `<div class="stay-info">🏨 ${c.sub || ''}</div>`;
  }

  let contactsHTML = '';
  if (c.maps) {
    contactsHTML += `<div class="contact-row" onclick="openMaps('${c.maps.replace(/'/g, "\\'")}')">
      <span class="contact-icon">📍</span>
      <span class="contact-label">${t('card.map')}</span>
      <span class="contact-val">${c.maps.split(',')[0]}</span>
    </div>`;
  }
  if (c.phone) {
    contactsHTML += `<a class="contact-row" href="tel:${c.phone}">
      <span class="contact-icon">📱</span>
      <span class="contact-label">${t('card.call')}</span>
      <span class="contact-val">${c.phone}</span>
    </a>`;
  }
  if (c.email) {
    contactsHTML += `<a class="contact-row" href="mailto:${c.email}">
      <span class="contact-icon">✉️</span>
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
      <div class="exp-files-label">📎 ${t('card.documents')}</div>
      <div class="files-grid">${cardFiles.map(renderFileRow).join('')}</div>
    </div>` : '';

  const fileCountBadge = cardFiles.length
    ? `<span class="day-bubble bubble-files" style="cursor:default">📎 ${cardFiles.length}</span>`
    : '';

  const quickBtns = [];
  if (c.maps) quickBtns.push(`<div class="card-quick-btn" onclick="event.stopPropagation();openMaps('${c.maps.replace(/'/g, "\\'")}')">📍</div>`);
  if (c.phone) quickBtns.push(`<a class="card-quick-btn" href="tel:${c.phone}" onclick="event.stopPropagation()">📱</a>`);
  if (c.email) quickBtns.push(`<a class="card-quick-btn" href="mailto:${c.email}" onclick="event.stopPropagation()">✉️</a>`);

  const isTransport = c.type === 'flight' || c.type === 'transit' || c.type === 'bus' || c.type === 'ferry' || c.type === 'taxi';

  // Shared expanded HTML (same for all card styles)
  const expandedHTML = `
    <div class="card-expanded">
      <div class="exp-header">
        <div class="exp-icon">${c.icon || '📌'}</div>
        <div class="exp-title-group">
          <div class="exp-type">${meta.label}</div>
          <div class="exp-title">${c.title}</div>
          ${(c.sub && c.type !== 'stay') ? `<div class="exp-sub">${c.sub}</div>` : ''}
        </div>
        <div class="exp-time">${c.time || ''}</div>
      </div>
      ${expMain}
      ${contactsHTML ? `<div class="exp-contacts">${contactsHTML}</div>` : ''}
      ${filesHTML}
      ${tags.length ? `<div class="exp-tags">${tags.map(renderTag).join('')}</div>` : ''}
      ${tipsHTML}
      <button class="card-close-btn" onclick="collapseCard(event)">${t('card.collapse')}</button>
    </div>`;

  const style = currentCardStyle || 'classic';

  // ── Bento Grid style ──
  if (style === 'bento') {
    const wide = (isTransport || c.type === 'stay') ? ' bento-wide' : '';
    const routeHTML = isTransport
      ? `<div class="bento-route"><span>${c.from || ''}</span><span class="bento-route-arrow"></span><span>${c.to || ''}</span></div>`
      : `<div class="bento-icon">${c.icon || '📌'}</div><div class="bento-title">${c.title}</div>`;
    const subHTML = (!isTransport && c.sub) ? `<div class="bento-sub">${c.sub}</div>`
      : (isTransport && c.carrier) ? `<div class="bento-sub">${c.carrier}</div>` : '';
    return `
    <div class="card${wide}" style="--card-color:${colorVar}" data-type="${c.type}">
      <div class="card-collapsed bento-collapsed">
        <div class="bento-top">
          <span class="bento-badge" style="color:${colorVar}"><span class="bento-dot" style="background:${colorVar}"></span>${meta.label}</span>
          <span class="bento-time">${c.time || ''}</span>
        </div>
        ${routeHTML}
        ${subHTML}
        <div class="bento-meta">
          ${tags.map(tg => `<span class="bento-chip bento-chip-${tg.cls || 'default'}">${tg.label}</span>`).join('')}
          ${fileCountBadge}
          ${quickBtns.join('')}
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
    <div class="card" style="--card-color:${colorVar}" data-type="${c.type}">
      <div class="card-collapsed minimal-collapsed">
        <span class="minimal-time">${c.time || ''}</span>
        <span class="minimal-dot" style="background:${colorVar}"></span>
        <div class="minimal-body">
          <div class="minimal-title">${mTitle}</div>
          <div class="minimal-sub">${mSub}</div>
        </div>
        <div class="minimal-pills">
          ${tags.map(renderTag).join('')}
          ${fileCountBadge}
        </div>
        ${quickBtns.join('')}
        <span class="minimal-arrow">→</span>
      </div>
      ${expandedHTML}
    </div>`;
  }

  // ── Classic style (default) ──
  return `
  <div class="card" style="--card-color:${colorVar}" data-type="${c.type}">
    <div class="card-collapsed">
      <div class="card-time-col">${c.time || ''}</div>
      <div class="card-icon">${c.icon || '📌'}</div>
      <div class="card-main">
        <div class="card-type-label">${meta.label}</div>
        ${collapsedInner}
      </div>
      <div style="display:flex;gap:4px;align-items:center;flex-shrink:0">
        ${tags.map(renderTag).join('')}
        ${fileCountBadge}
        ${quickBtns.join('')}
      </div>
    </div>
    ${expandedHTML}
  </div>`;
}

// ─── Render Day ───
function renderDay(day) {
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
      cardsHTML += renderCard(c, day.color, assignedFiles, pill);
      if ((c.type === 'transit' || c.type === 'flight') && c.to) {
        for (const city of knownCities) {
          if (c.to.includes(city) && city !== currentCity) { currentCity = city; break; }
        }
      }
      if (c.city) currentCity = c.city;
    }
  } else {
    cardsHTML = (day.cards || []).map(c => renderCard(c, day.color, assignedFiles, null)).join('');
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
  const actBubble = actCount > 0 ? `<span class="day-bubble bubble-activities">📍 ${actCount}</span>` : '';
  const foodBubble = foodCount > 0 ? `<button class="day-bubble bubble-food day-food-btn" onclick="toggleFood(event, this)">🍛 ${foodCount}</button>` : '';
  const summaryHTML = (expBubble || actBubble || foodBubble) ? `<div class="day-summary">${expBubble}${actBubble}${foodBubble}</div>` : '';

  const foodPanelHTML = foodCount > 0 ? `
    <div class="food-panel"><div class="food-panel-inner">
      ${day.food.map(f => `<div class="food-tip"><div class="food-emoji">${f.e}</div><div><div class="food-dish">${f.dish}</div><div class="food-desc">${f.desc}</div></div></div>`).join('')}
    </div></div>` : '';

  return `
  <div class="day" style="--day-color:${day.color || '#aaa'}">
    <div class="day-header" onclick="toggleDay(event, this)">
      <div class="day-chevron"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
      <div class="day-date">${day.date}</div>
      ${dayTitleHTML}
      ${summaryHTML}
    </div>
    <div class="day-body">
      ${foodPanelHTML}
      <div class="cards">${cardsHTML}</div>
    </div>
  </div>`;
}

// ─── Render Timeline ───
function renderTimeline() {
  const timeline = document.getElementById('timeline');

  const cityMap = new Map();
  const cityOrder = [];
  for (const day of DAYS) {
    const key = (day.dayTrip && day.parentCity) ? day.parentCity : day.city;
    if (!cityMap.has(key)) {
      const base = DAYS.find(d => d.city === key && !d.dayTrip) || DAYS.find(d => d.city === key);
      cityMap.set(key, { flag: base ? base.flag : '🏳️', city: key, color: base ? base.color : '#aaa', days: [], dayTripCities: new Set() });
      cityOrder.push(key);
    }
    cityMap.get(key).days.push(day);
    if (day.dayTrip) cityMap.get(key).dayTripCities.add(day.city);
  }

  const countryMap = new Map();
  const countryOrder = [];
  for (const key of cityOrder) {
    const g = cityMap.get(key);
    if (!countryMap.has(g.flag)) {
      countryMap.set(g.flag, { flag: g.flag, name: FLAG_TO_COUNTRY[g.flag] || g.flag, cities: [] });
      countryOrder.push(g.flag);
    }
    countryMap.get(g.flag).cities.push(g);
  }

  const railsHTML = countryOrder.map(cflag => {
    const country = countryMap.get(cflag);
    const citiesHTML = country.cities.map(g => {
      const extraCities = [...g.dayTripCities];
      const nameHTML = extraCities.length
        ? `${g.city} <span style="color:var(--dim);font-weight:400">&amp;</span> ${extraCities.join(', ')}`
        : g.city;
      const nights = g.days.filter(d => !d.dayTrip).length;
      const nightWord = nights !== 1 ? t('timeline.nights') : t('timeline.night');
      const metaLabel = nights + ' ' + nightWord + (extraCities.length ? ` \u00B7 ${extraCities.length} ${t('timeline.dayTrip')}` : '');
      return `
      <div class="location-group">
        <div class="location-header" onclick="toggleLocation(this)">
          <div class="location-chevron"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
          <span class="location-name" style="color:${g.color || '#aaa'}">${nameHTML}</span>
          <span class="location-meta">${metaLabel}</span>
        </div>
        <div class="location-body">${g.days.map(renderDay).join('')}</div>
      </div>`;
    }).join('');

    return `<div class="country-rail" data-country="${country.name}">
      <div class="country-rail-label" onclick="toggleCountrySummary(this)"><span class="country-rail-flag">${country.flag}</span><span class="country-rail-name">${country.name}</span></div>
      <div class="country-rail-line"></div>
      <div class="country-rail-summary country-summary-card" onclick="toggleCountrySummary(this)"></div>
      <div class="country-rail-cities">${citiesHTML}</div>
    </div>`;
  }).join('');

  timeline.innerHTML = '<div class="timeline-with-rail"><div class="timeline-rail-line" id="timeline-rail-line"></div>' + railsHTML + '</div>';

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

// ─── Rail Positioning ───
function positionRailLines() {
  const wrapper = document.querySelector('.timeline-with-rail');
  if (!wrapper) return;
  const sharedLine = document.getElementById('timeline-rail-line');
  const rails = Array.from(document.querySelectorAll('.country-rail'));
  if (!rails.length || !sharedLine) return;

  const wrapperRect = wrapper.getBoundingClientRect();
  const wrapperTop = wrapperRect.top + window.scrollY;
  const wrapperLeft = wrapperRect.left;

  function firstDayY(rail) {
    const d = rail.querySelector('.location-body .day');
    return d ? d.getBoundingClientRect().top + window.scrollY : null;
  }
  function lastDayBottomY(rail) {
    const days = Array.from(rail.querySelectorAll('.location-body .day'));
    const last = days[days.length - 1];
    return last ? last.getBoundingClientRect().bottom + window.scrollY : null;
  }

  const startYs = rails.map(rail => firstDayY(rail) || 0);
  const segments = rails.map((rail, i) => {
    const isCollapsed = (rail.querySelector('.country-rail-cities') || { style: { display: '' } }).style.display === 'none';
    const summary = rail.querySelector('.country-rail-summary');
    const startY = isCollapsed && summary
      ? summary.getBoundingClientRect().top + window.scrollY
      : startYs[i];
    const endY = isCollapsed && summary
      ? summary.getBoundingClientRect().bottom + window.scrollY
      : (i < rails.length - 1 ? startYs[i + 1] : (lastDayBottomY(rail) || 0));
    return { rail, startY, endY, isCollapsed };
  });

  if (!segments.length) return;

  const lineStart = segments[0].startY - wrapperTop;
  const lineEnd = segments[segments.length - 1].endY - wrapperTop;
  sharedLine.style.top = lineStart + 'px';
  sharedLine.style.height = Math.max(0, lineEnd - lineStart) + 'px';

  const vh = window.innerHeight;
  const labelH = 80;
  const stickyTop = 80;

  segments.forEach(({ rail, startY, endY, isCollapsed }) => {
    const label = rail.querySelector('.country-rail-label');
    if (!label) return;
    if (isCollapsed) { label.style.display = 'none'; return; }
    const visTop = Math.max(startY, window.scrollY);
    const visBottom = Math.min(endY, window.scrollY + vh);
    if (visBottom <= visTop) { label.style.display = 'none'; return; }
    label.style.display = 'flex';
    const idealPageY = window.scrollY + stickyTop;
    const clampedPageY = Math.min(Math.max(idealPageY, startY), endY - labelH);
    label.style.position = 'fixed';
    label.style.left = wrapperLeft + 'px';
    label.style.top = (clampedPageY - window.scrollY) + 'px';
    label.style.height = labelH + 'px';
    label.style.width = '26px';
  });
}

// ─── Country Summary ───
function buildCountrySummary(countryName) {
  const flag = Object.keys(FLAG_TO_COUNTRY).find(k => FLAG_TO_COUNTRY[k] === countryName) || '';
  const countryDays = DAYS.filter(d => FLAG_TO_COUNTRY[d.flag] === countryName);

  let flights = 0, trains = 0, activities = 0, foodTips = 0, paid = 0, unpaid = 0, nights = 0;
  const skip = new Set(['checkout', 'stay', 'flight', 'transit']);

  for (const day of countryDays) {
    if (!day.dayTrip) nights++;
    foodTips += (day.food || []).length;
    for (const card of (day.cards || [])) {
      if (card.type === 'flight') flights++;
      if (card.type === 'transit') trains++;
      if (!skip.has(card.type)) activities++;
      const tags = parseTags(card.tags);
      const amt = (() => { const p = tags.find(t => t.cls === 'price'); return p ? parseAmount(p.label) : null; })();
      if (tags.find(t => t.cls === 'paid') && amt) paid += amt;
      if (tags.find(t => t.cls === 'unpaid') && amt) unpaid += amt;
    }
  }

  const stat = (label, val, cls) =>
    `<span class="country-stat"><span class="country-stat-label">${label}</span>&nbsp;<span class="country-stat-value ${cls || ''}">${val}</span></span>`;

  return `<div class="country-summary-name">${flag} ${countryName}</div>
    <div class="country-summary-stats">
      ${stat(t('summary.nights'), nights, '')}
      ${flights ? stat(t('summary.flights'), flights, 'blue') : ''}
      ${trains ? stat(t('summary.trains'), trains, 'blue') : ''}
      ${stat(t('summary.activities'), activities, 'purple')}
      ${foodTips ? stat(t('summary.foodTips'), foodTips, 'orange') : ''}
      ${paid > 0 ? stat(t('summary.paid'), '€' + paid.toFixed(2), 'green') : ''}
      ${unpaid > 0 ? stat(t('summary.toPay'), '€' + unpaid.toFixed(2), 'orange') : ''}
    </div>`;
}

function toggleCountrySummary(el) {
  const label = el.classList.contains('country-rail-label') ? el : el.closest('.country-rail').querySelector('.country-rail-label');
  const rail = label.closest('.country-rail');
  const cities = rail.querySelector('.country-rail-cities');
  const summary = rail.querySelector('.country-rail-summary');
  if (!cities || !summary) return;

  const isCollapsed = cities.style.display === 'none';
  if (isCollapsed) {
    cities.style.display = '';
    summary.classList.remove('visible');
    label.classList.remove('collapsed-mode');
  } else {
    summary.innerHTML = buildCountrySummary(rail.dataset.country);
    summary.classList.add('visible');
    cities.style.display = 'none';
    label.classList.add('collapsed-mode');
  }
  setTimeout(positionRailLines, 50);
}

// ─── Interaction Handlers ───
function toggleLocation(header) {
  const group = header.closest('.location-group');
  const body = group.querySelector('.location-body');
  const isCollapsed = group.classList.contains('collapsed');
  if (isCollapsed) {
    group.classList.remove('collapsed');
    body.style.height = body.scrollHeight + 'px';
    body.addEventListener('transitionend', () => { body.style.height = 'auto'; positionRailLines(); }, { once: true });
  } else {
    body.style.height = body.scrollHeight + 'px';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      body.style.height = '0';
      group.classList.add('collapsed');
    }));
    body.addEventListener('transitionend', positionRailLines, { once: true });
  }
}

function toggleDay(e, header) {
  if (e.target.closest('.day-food-btn')) return;
  if (e.target.closest('.day-bubble')) return;
  const day = header.closest('.day');
  const body = day.querySelector('.day-body');
  const isCollapsed = day.classList.contains('collapsed');
  if (isCollapsed) {
    day.classList.remove('collapsed');
    body.style.height = body.scrollHeight + 'px';
    body.addEventListener('transitionend', () => { body.style.height = 'auto'; positionRailLines(); }, { once: true });
  } else {
    body.style.height = body.scrollHeight + 'px';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      body.style.height = '0';
      day.classList.add('collapsed');
    }));
    body.addEventListener('transitionend', positionRailLines, { once: true });
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
