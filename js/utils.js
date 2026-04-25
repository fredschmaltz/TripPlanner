/* ══════════════════════════════════════════
   TRIP PLANNER — Shared Utilities
══════════════════════════════════════════ */

// ─── Card type metadata (color + display label) ───
const TYPE_META = {
  flight:    { color: 'var(--transport-c)', label: 'Flight' },
  transit:   { color: 'var(--transport-c)', label: 'Train' },
  bus:       { color: 'var(--transport-c)', label: 'Bus' },
  ferry:     { color: 'var(--transport-c)', label: 'Ferry' },
  taxi:      { color: 'var(--transport-c)', label: 'Taxi / Car' },
  stay:      { color: 'var(--stay-c)',      label: 'Hotel' },
  checkout:  { color: 'var(--checkout-c)',  label: 'Check-out' },
  temple:    { color: 'var(--temple-c)',    label: 'Temple / Shrine' },
  museum:    { color: 'var(--museum-c)',    label: 'Museum' },
  park:      { color: 'var(--park-c)',      label: 'Park / Garden' },
  market:    { color: 'var(--market-c)',    label: 'Market' },
  viewpoint: { color: 'var(--viewpoint-c)', label: 'Viewpoint' },
  aquarium:  { color: 'var(--aquarium-c)',  label: 'Aquarium' },
  zoo:       { color: 'var(--zoo-c)',       label: 'Zoo' },
  street:    { color: 'var(--street-c)',    label: 'Street / District' },
  nightlife: { color: 'var(--nightlife-c)', label: 'Nightlife / Dining' },
  monument:  { color: 'var(--viewpoint-c)', label: 'Monument' },
  activity:  { color: 'var(--activity-c)',  label: 'Activity' },
};

// ─── All card types grouped for the editor dropdown ───
const CARD_TYPES = [
  { group: 'Transport',      items: [
    { value: 'flight',  label: 'Flight',       icon: 'plane' },
    { value: 'transit', label: 'Train',        icon: 'train' },
    { value: 'bus',     label: 'Bus',          icon: 'bus' },
    { value: 'ferry',   label: 'Ferry',        icon: 'ship' },
    { value: 'taxi',    label: 'Taxi / Car',   icon: 'car' },
  ]},
  { group: 'Accommodation', items: [
    { value: 'stay',     label: 'Hotel',       icon: 'bed' },
    { value: 'checkout', label: 'Check-out',   icon: 'key' },
  ]},
  { group: 'Attraction',    items: [
    { value: 'temple',    label: 'Temple / Shrine',   icon: 'torii' },
    { value: 'museum',    label: 'Museum',             icon: 'columns' },
    { value: 'monument',  label: 'Monument',           icon: 'castle' },
    { value: 'park',      label: 'Park / Garden',      icon: 'tree' },
    { value: 'market',    label: 'Market',             icon: 'shopping-bag' },
    { value: 'viewpoint', label: 'Viewpoint',          icon: 'tower' },
    { value: 'aquarium',  label: 'Aquarium',           icon: 'fish' },
    { value: 'zoo',       label: 'Zoo',                icon: 'paw' },
    { value: 'street',    label: 'Street / District',  icon: 'buildings' },
    { value: 'nightlife', label: 'Nightlife / Dining', icon: 'wine' },
    { value: 'activity',  label: 'Activity',           icon: 'target' },
  ]},
];

// Flat lookup for icon defaults per type
const CARD_TYPE_ICONS = {};
CARD_TYPES.forEach(g => g.items.forEach(t => { CARD_TYPE_ICONS[t.value] = t.icon; }));

// ─── Custom card types (user-defined, stored in editorData.trip.customTypes) ───
function getCardTypesWithCustom() {
  const custom = (typeof editorData !== 'undefined' && editorData && editorData.trip && editorData.trip.customTypes) || [];
  const groups = CARD_TYPES.map(g => ({ ...g, items: [...g.items] }));
  if (custom.length > 0) {
    groups.push({ group: t('typeGroup.custom'), items: custom.map(ct => ({ value: ct.value, label: ct.label, icon: ct.icon })) });
  }
  return groups;
}

// ─── Emoji palettes by category ───
// Legacy palettes kept for backward-compatibility with __custom__ path.
// Default selections now use SVG_PALETTES / FOOD_ICONS (icons.js).
const EMOJI_PALETTES = {
  food: [
    '🍣','🍱','🍜','🍝','🍛','🍲','🍤','🍥','🥟','🍙','🍘','🍚','🥗','🥘','🍖',
    '🍗','🥩','🥓','🌮','🌯','🥪','🍔','🍟','🍕','🥐','🥖','🥨','🧀','🥚','🍳',
    '🥞','🧇','🥯','🍞','🫕','🥫','🍝','🥙','🧆','🥣','🫔','🍡','🍢','🍧','🍨',
    '🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯','🍦','🍿','🥜','🌰',
    '🍵','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🍾','🧃','🥤','☕','🧋','🥛',
    '🍼','🫖','🍽️','🥢','🧊','🫙',
  ],
  activity: [
    '🎯','🏃','🚶','🧗','🏊','🎿','🏄','🚴','🛶','⛷️','🪂','🤿','🏇','⛳','🎣',
    '🎭','🎪','🎨','🎤','🎧','🎬','🎮','🎰','🎳','🎲','♟️','🧩','🎴','🀄',
    '📸','📷','🔭','🧭','🗺️','🏕️','🌅','🌄','🌇','🏞️','🛕','🕍','🕌','⛪','💈',
    '🛁','🛒','🎁','💎','🪩','🧘','💆','💇','🛍️','🎠','🎡','🎢',
  ],
  transport: [
    '✈️','🚄','🚅','🚆','🚇','🚈','🚂','🚃','🚌','🚍','🚎','🚐','🚑','🚒',
    '🚓','🚕','🚖','🚗','🚘','🚙','🛻','🚛','🚜','🏎️','🏍️','🛵','🛺','🚲',
    '🛴','🛹','🛼','🚁','🛩️','🛸','🚀','🛶','⛵','🚤','⛴️','🛳️','🚢','🚠',
    '🚡','🚟','🚃','🚋',
  ],
  stay: [
    '🏨','🏢','🛏️','🏠','⛺','🏖️','🏡','🏰','🏯','🛖','🏗️','🏘️','🏙️','🏛️',
    '🏚️','🪵','⛩️','🕌','💒','🏤','🏥',
  ],
  place: [
    '⛩️','🏛️','🏯','🌳','🛍️','🗼','🐋','🐼','🏘️','🍻','🎯','🌸','🗻','🌊',
    '🏖️','🏝️','🏔️','🌋','🗽','🗿','🏟️','⛲','🌉','🎡','🎢','🎠','⛪','🕍',
    '🕌','💒','🏪','🏬','🏣','🏤','🏥','🏦','🏫','🏰','🪨','🌺','🦋','🐠',
  ],
};

// ─── Stay sub-types (for icon hints) ───
const STAY_SUBTYPES = [
  { value: 'hotel',     label: 'Hotel',     icon: 'bed' },
  { value: 'apartment', label: 'Apartment', icon: 'skyline' },
  { value: 'hostel',    label: 'Hostel',    icon: 'bed' },
  { value: 'airbnb',    label: 'Airbnb',    icon: 'buildings' },
  { value: 'camping',   label: 'Camping',   icon: 'tree' },
  { value: 'resort',    label: 'Resort',    icon: 'waves' },
  { value: 'guesthouse', label: 'Guesthouse', icon: 'buildings' },
];

// ─── Country flag list (ISO 3166-1 alpha-2 codes) ───
const COUNTRY_FLAGS = [
  { flag: 'af', name: 'Afghanistan' }, { flag: 'al', name: 'Albania' }, { flag: 'dz', name: 'Algeria' },
  { flag: 'ar', name: 'Argentina' }, { flag: 'au', name: 'Australia' }, { flag: 'at', name: 'Austria' },
  { flag: 'be', name: 'Belgium' }, { flag: 'br', name: 'Brazil' }, { flag: 'bg', name: 'Bulgaria' },
  { flag: 'kh', name: 'Cambodia' }, { flag: 'ca', name: 'Canada' }, { flag: 'cl', name: 'Chile' },
  { flag: 'cn', name: 'China' }, { flag: 'co', name: 'Colombia' }, { flag: 'hr', name: 'Croatia' },
  { flag: 'cu', name: 'Cuba' }, { flag: 'cz', name: 'Czechia' }, { flag: 'dk', name: 'Denmark' },
  { flag: 'eg', name: 'Egypt' }, { flag: 'ee', name: 'Estonia' }, { flag: 'fi', name: 'Finland' },
  { flag: 'fr', name: 'France' }, { flag: 'de', name: 'Germany' }, { flag: 'gr', name: 'Greece' },
  { flag: 'hk', name: 'Hong Kong' }, { flag: 'hu', name: 'Hungary' }, { flag: 'is', name: 'Iceland' },
  { flag: 'in', name: 'India' }, { flag: 'id', name: 'Indonesia' }, { flag: 'ie', name: 'Ireland' },
  { flag: 'il', name: 'Israel' }, { flag: 'it', name: 'Italy' }, { flag: 'jp', name: 'Japan' },
  { flag: 'jo', name: 'Jordan' }, { flag: 'ke', name: 'Kenya' }, { flag: 'kr', name: 'South Korea' },
  { flag: 'lv', name: 'Latvia' }, { flag: 'lt', name: 'Lithuania' }, { flag: 'my', name: 'Malaysia' },
  { flag: 'mx', name: 'Mexico' }, { flag: 'ma', name: 'Morocco' }, { flag: 'mm', name: 'Myanmar' },
  { flag: 'nl', name: 'Netherlands' }, { flag: 'nz', name: 'New Zealand' }, { flag: 'ng', name: 'Nigeria' },
  { flag: 'no', name: 'Norway' }, { flag: 'pk', name: 'Pakistan' }, { flag: 'pe', name: 'Peru' },
  { flag: 'ph', name: 'Philippines' }, { flag: 'pl', name: 'Poland' }, { flag: 'pt', name: 'Portugal' },
  { flag: 'ro', name: 'Romania' }, { flag: 'ru', name: 'Russia' }, { flag: 'sa', name: 'Saudi Arabia' },
  { flag: 'sg', name: 'Singapore' }, { flag: 'sk', name: 'Slovakia' }, { flag: 'si', name: 'Slovenia' },
  { flag: 'za', name: 'South Africa' }, { flag: 'es', name: 'Spain' }, { flag: 'lk', name: 'Sri Lanka' },
  { flag: 'se', name: 'Sweden' }, { flag: 'ch', name: 'Switzerland' }, { flag: 'tw', name: 'Taiwan' },
  { flag: 'th', name: 'Thailand' }, { flag: 'tr', name: 'Turkey' }, { flag: 'ua', name: 'Ukraine' },
  { flag: 'ae', name: 'UAE' }, { flag: 'gb', name: 'United Kingdom' }, { flag: 'us', name: 'United States' },
  { flag: 'vn', name: 'Vietnam' },
];

// Map ISO code to country name (flag field IS the ISO code now)
const FLAG_TO_COUNTRY = {};
COUNTRY_FLAGS.forEach(c => { FLAG_TO_COUNTRY[c.flag] = c.name; });

// FLAG_TO_ISO: identity mapping (flag = ISO code). Kept for API calls.
const FLAG_TO_ISO = {};
COUNTRY_FLAGS.forEach(c => { FLAG_TO_ISO[c.flag] = c.flag; });
// Reverse: ISO code → flag (identity)
const ISO_TO_FLAG = {};
COUNTRY_FLAGS.forEach(c => { ISO_TO_FLAG[c.flag] = c.flag; });

// Map country ISO code to color palette (primary, secondary, tertiary)
const COUNTRY_FLAG_PALETTES = {
  'af': ['#ce1126', '#008000', '#000000'],
  'al': ['#002395', '#e60000', '#ffffff'],
  'dz': ['#007a5e', '#ffffff', '#ff0000'],
  'ar': ['#75aadb', '#ffffff', '#ffcc00'],
  'au': ['#00008b', '#ffcd00', '#008000'],
  'at': ['#ed2939', '#ffffff', '#000000'],
  'be': ['#000000', '#ffcd00', '#ff0000'],
  'br': ['#009c3b', '#ffcd00', '#2b8cc4'],
  'bg': ['#ffffff', '#00966e', '#d62612'],
  'kh': ['#0052cc', '#ff0000', '#ffcd00'],
  'ca': ['#ff0000', '#ffffff', '#ff6b6b'],
  'cl': ['#0039a6', '#ffffff', '#ff0000'],
  'cn': ['#de2910', '#ffcd00', '#000000'],
  'co': ['#ffcd00', '#0066cc', '#ff0000'],
  'hr': ['#171796', '#ffffff', '#f00000'],
  'cu': ['#002a8f', '#ffffff', '#ff0000'],
  'cz': ['#ffffff', '#ff0000', '#11006e'],
  'dk': ['#c8102e', '#ffffff', '#000000'],
  'eg': ['#ce1126', '#ffffff', '#000000'],
  'ee': ['#4891d9', '#000000', '#ffffff'],
  'fi': ['#003580', '#ffffff', '#ffcd00'],
  'fr': ['#002395', '#ffffff', '#ff0000'],
  'de': ['#000000', '#ff0000', '#ffcd00'],
  'gr': ['#0d47a1', '#ffffff', '#1976d2'],
  'hk': ['#de2910', '#ffffff', '#000000'],
  'hu': ['#004b87', '#ffffff', '#00aa00'],
  'is': ['#0052cc', '#ffffff', '#ff0000'],
  'in': ['#ff9933', '#ffffff', '#138808'],
  'id': ['#ff0000', '#ffffff', '#000000'],
  'ie': ['#009543', '#ffffff', '#ff9e1b'],
  'il': ['#0038b8', '#ffffff', '#00aaff'],
  'it': ['#009246', '#ffffff', '#ff0000'],
  'jp': ['#bc002d', '#ffffff', '#ffcd00'],
  'jo': ['#000000', '#ffffff', '#ff0000'],
  'ke': ['#000000', '#ffffff', '#ff0000'],
  'kr': ['#003478', '#ffffff', '#c60c30'],
  'lv': ['#9d2235', '#ffffff', '#ffcd00'],
  'lt': ['#ffcc00', '#ffffff', '#c41e3a'],
  'ma': ['#ce1126', '#ffffff', '#006c35'],
  'my': ['#007a5e', '#ffffff', '#ffcd00'],
  'mx': ['#006341', '#ffffff', '#ff0000'],
  'mm': ['#ffcc00', '#ffffff', '#00aaff'],
  'nl': ['#21468b', '#ffffff', '#ff0000'],
  'nz': ['#012169', '#000000', '#ffcd00'],
  'ng': ['#008751', '#ffffff', '#ff0000'],
  'no': ['#186b48', '#ffffff', '#ff0000'],
  'pa': ['#00aaff', '#ff0000', '#ffffff'],
  'pk': ['#012169', '#ffffff', '#00aa00'],
  'pe': ['#ff0000', '#ffffff', '#ffcd00'],
  'ph': ['#0066ff', '#ffffff', '#ffcc00'],
  'pl': ['#ffffff', '#ff0000', '#000000'],
  'pt': ['#006600', '#ff0000', '#ffcd00'],
  'ro': ['#002395', '#ffcd00', '#ff0000'],
  'ru': ['#ffffff', '#0039a6', '#ff0000'],
  'sa': ['#006c35', '#ffffff', '#000000'],
  'sg': ['#ffffff', '#ff0000', '#000000'],
  'sk': ['#ffffff', '#0052cc', '#ff0000'],
  'si': ['#ffffff', '#0052cc', '#ff0000'],
  'za': ['#000000', '#ff0000', '#007a5e'],
  'es': ['#ffc400', '#ff0000', '#ffffff'],
  'lk': ['#0052cc', '#ff9933', '#006b3f'],
  'se': ['#0052cc', '#ffcd00', '#000000'],
  'ch': ['#ff0000', '#ffffff', '#000000'],
  'tw': ['#0052cc', '#ff0000', '#ffcd00'],
  'th': ['#2d2d7f', '#ff0000', '#ffffff'],
  'tr': ['#ff0000', '#ffffff', '#ffcd00'],
  'ua': ['#0052cc', '#ffcd00', '#ff0000'],
  'ae': ['#000000', '#ff0000', '#ffffff'],
  'gb': ['#012169', '#ffffff', '#c8102e'],
  'us': ['#0a3161', '#ffffff', '#ff0000'],
  'vn': ['#ce1126', '#ffcd00', '#000000'],
};

// ─── Known city → color map (auto-populated from data) ───
const CITY_COLORS = {};

function populateCityColors(days) {
  Object.keys(CITY_COLORS).forEach(k => delete CITY_COLORS[k]);
  for (const day of days || []) {
    if (day.city && day.color) CITY_COLORS[day.city] = day.color;
    if (day.segmentColors) Object.assign(CITY_COLORS, day.segmentColors);
  }
}

// ─── File categories ───
const CAT_LABEL  = { activity:'Activity', stay:'Stay', transport:'Transportation', insurance:'Insurance', customs:'Customs', other:'Other' };
const CAT_FOLDER = { activity:'Activity', stay:'Stay', transport:'Transportation', insurance:'Insurance', customs:'Customs', other:'Other' };

// ─── Tag types ───
const TAG_TYPES = [
  { value: 'price',   label: 'Price' },
  { value: 'paid',    label: 'Paid' },
  { value: 'unpaid',  label: 'Unpaid' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'id',      label: 'ID / Ref' },
];

// ─── Utility functions ───

function getDayNames() {
  return [t('day.sun'), t('day.mon'), t('day.tue'), t('day.wed'), t('day.thu'), t('day.fri'), t('day.sat')];
}
function getMonthNames() {
  return [t('month.jan'), t('month.feb'), t('month.mar'), t('month.apr'), t('month.may'), t('month.jun'),
          t('month.jul'), t('month.aug'), t('month.sep'), t('month.oct'), t('month.nov'), t('month.dec')];
}

function parseTags(tagStr) {
  if (!tagStr) return [];
  const items = Array.isArray(tagStr) ? tagStr : tagStr.split(',');
  return items.map(t => {
    const [label, cls] = t.trim().split('|');
    return { label: label.trim(), cls: (cls || '').trim() };
  });
}

function renderTag(t) {
  return `<span class="tag tag-${t.cls || 'price'}">${t.label}</span>`;
}

function openMaps(latOrQuery, lng) {
  let target;
  if (typeof latOrQuery === 'number' && typeof lng === 'number') {
    target = `${latOrQuery},${lng}`;
  } else if (typeof latOrQuery === 'object' && latOrQuery && latOrQuery.lat) {
    target = `${latOrQuery.lat},${latOrQuery.lng}`;
  } else {
    target = String(latOrQuery);
  }
  const enc = encodeURIComponent(target);
  const isApple = /iPad|iPhone|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
  window.open(isApple
    ? 'maps://maps.apple.com/?daddr=' + enc
    : 'https://www.google.com/maps/dir/?api=1&destination=' + enc, '_blank');
}

function parseAmount(label) {
  const m = label.match(/€\s*([\d,]+\.?\d*)/);
  if (m) return parseFloat(m[1].replace(',', ''));
  return null;
}

function dayFinancials(day) {
  let paid = 0, unpaid = 0, hasPaid = false, hasUnpaid = false;
  for (const c of day.cards || []) {
    const tags = parseTags(c.tags);
    const paidTag   = tags.find(t => t.cls === 'paid');
    const unpaidTag = tags.find(t => t.cls === 'unpaid');
    const priceTag  = tags.find(t => t.cls === 'price');
    const amt = priceTag ? parseAmount(priceTag.label) : null;
    if (paidTag && amt !== null)   { paid   += amt; hasPaid   = true; }
    if (unpaidTag && amt !== null) { unpaid += amt; hasUnpaid = true; }
  }
  return { paid, unpaid, hasPaid, hasUnpaid };
}

function countActivities(day) {
  const skip = new Set(['checkout', 'stay', 'flight', 'transit']);
  return (day.cards || []).filter(c => !skip.has(c.type)).length;
}

function renderFileRow(f) {
  const cat = f.cat || 'other';
  const relPath = (CAT_FOLDER[cat] || 'Other') + '/' + f.name;
  const ext = f.name.split('.').pop().toUpperCase();
  const displayName = f.label || f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  return `<a class="file-row" href="#" onclick="return openDoc('${relPath.replace(/'/g, "\\'")}', event)">
    <span class="file-cat file-cat-${cat}">${CAT_LABEL[cat] || cat}</span>
    <span class="file-name">${displayName}</span>
    <span class="file-ext">.${ext}</span>
    <span class="file-open-btn">↗</span>
  </a>`;
}

function assignFilesToCards(day) {
  const CAT_TO_TYPE = { transport: ['flight', 'transit', 'bus', 'ferry', 'taxi'], stay: ['stay'] };
  const catIdx = {};
  return (day.files || []).map(f => {
    if (f.cardType || f.cardTitle) return f;
    const types = CAT_TO_TYPE[f.cat];
    if (types) {
      const matchingCards = (day.cards || []).filter(c => types.includes(c.type));
      const i = catIdx[f.cat] = (catIdx[f.cat] || 0);
      catIdx[f.cat] = i + 1;
      const targetCard = matchingCards[i] || matchingCards[0];
      if (targetCard) return { ...f, cardTitle: targetCard.title };
    }
    if (f.label) {
      const words = f.label.toLowerCase().split(/[\s\-\.·]+/).filter(w => w.length > 3);
      let best = null, bestScore = 0;
      for (const card of (day.cards || [])) {
        const title = card.title.toLowerCase();
        const score = words.filter(w => title.includes(w)).length;
        if (score > bestScore) { bestScore = score; best = card; }
      }
      if (best && bestScore > 0) return { ...f, cardTitle: best.title };
    }
    const first = (day.cards || []).find(c => c.type !== 'checkout');
    return { ...f, cardTitle: first ? first.title : '__none__' };
  });
}

function resolveSegments(day) {
  if (day.segments && day.segmentColors) return { segments: day.segments, segmentColors: day.segmentColors };
  const hasExplicitCity = (day.cards || []).some(c => c.city && c.city !== day.city);
  const knownCities = Object.keys(CITY_COLORS);
  const transitCities = [];
  for (const c of (day.cards || [])) {
    if (c.type === 'transit' || c.type === 'flight') {
      for (const city of knownCities) {
        if (c.to && c.to.includes(city) && city !== day.city) transitCities.push(city);
      }
    }
  }
  if (!hasExplicitCity && transitCities.length === 0) return null;
  const segments = [day.city];
  const segmentColors = { [day.city]: CITY_COLORS[day.city] || day.color };
  let current = day.city;
  for (const c of (day.cards || [])) {
    if (c.city && c.city !== current) {
      if (!segments.includes(c.city) || segments[segments.length - 1] !== c.city) {
        segments.push(c.city);
      }
      segmentColors[c.city] = CITY_COLORS[c.city] || day.color;
      current = c.city;
    }
    if ((c.type === 'transit' || c.type === 'flight') && c.to) {
      for (const city of knownCities) {
        if (c.to.includes(city) && city !== current) {
          if (segments[segments.length - 1] !== city) segments.push(city);
          segmentColors[city] = CITY_COLORS[city] || day.color;
          current = city;
          break;
        }
      }
    }
  }
  return segments.length > 1 ? { segments, segmentColors } : null;
}

function getDocUrl(filename) {
  const lower = filename.toLowerCase();
  if (LOADED_DOCS.has(lower)) return LOADED_DOCS.get(lower);
  const basename = lower.split('/').pop();
  if (LOADED_DOCS.has(basename)) return LOADED_DOCS.get(basename);
  return null;
}

function openDoc(filename, event) {
  if (event) event.stopPropagation();
  const url = getDocUrl(filename);
  if (url) {
    window.open(url, '_blank');
  } else {
    if (typeof renderDocsList === 'function') renderDocsList();
    const panel = document.getElementById('docs-panel');
    if (panel) panel.classList.remove('hidden');
  }
  return false;
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function showToast(msg) {
  const existing = document.querySelector('.editor-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'editor-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// ─── Date parsing utility ───
// Parses "Wed 29 Apr" + TRIP_CONFIG.year → Date object
function parseDayDate(dateStr) {
  if (!dateStr) return null;
  const m = dateStr.match(/^\w+\s+(\d+)\s+(\w+)$/);
  if (!m) return null;
  const day = parseInt(m[1]);
  const monthNames = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  // Try English month names first (dates are stored in English)
  let monIdx = monthNames.findIndex(mn => mn === m[2].toLowerCase());
  if (monIdx < 0) {
    // Try localized month names
    const localized = typeof getMonthNames === 'function' ? getMonthNames() : [];
    monIdx = localized.findIndex(mn => mn.toLowerCase() === m[2].toLowerCase());
  }
  if (monIdx < 0) return null;
  const year = (typeof TRIP_CONFIG !== 'undefined' && TRIP_CONFIG && TRIP_CONFIG.year)
    ? parseInt(TRIP_CONFIG.year) : new Date().getFullYear();
  return new Date(year, monIdx, day);
}

function isDayInPast(dateStr) {
  const d = parseDayDate(dateStr);
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

// ─── Geocoding service (Nominatim) with rate limiting ───
const _geocodeCache = {};
const _geocodeQueue = [];
let _geocodeBusy = false;

async function geocodeAddress(query) {
  if (!query) return null;
  const key = query.trim().toLowerCase();
  if (_geocodeCache[key]) return _geocodeCache[key];
  return new Promise((resolve) => {
    _geocodeQueue.push({ key, query: query.trim(), resolve });
    _processGeocodeQueue();
  });
}

async function _processGeocodeQueue() {
  if (_geocodeBusy || _geocodeQueue.length === 0) return;
  _geocodeBusy = true;
  const { key, query, resolve } = _geocodeQueue.shift();
  if (_geocodeCache[key]) { resolve(_geocodeCache[key]); _geocodeBusy = false; _processGeocodeQueue(); return; }
  try {
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
      headers: { 'Accept-Language': 'en' }
    });
    const data = await resp.json();
    if (data && data.length > 0) {
      const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      _geocodeCache[key] = result;
      resolve(result);
    } else {
      _geocodeCache[key] = null;
      resolve(null);
    }
  } catch (e) {
    console.warn('Geocode failed for', query, e);
    resolve(null);
  }
  // Rate limit: 1 request per second (Nominatim policy)
  setTimeout(() => { _geocodeBusy = false; _processGeocodeQueue(); }, 1100);
}

// ─── Auto-save helper: write a field back to JSON ───
async function autoSaveToJSON(mutator) {
  if (typeof JSON_DIR_HANDLE === 'undefined' || !JSON_DIR_HANDLE) return;
  try {
    let jsonFile = null;
    for await (const entry of JSON_DIR_HANDLE.values()) {
      if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.json')) {
        const name = entry.name.toLowerCase();
        if (!jsonFile || name.includes('trip') || name.includes('config')) jsonFile = entry;
      }
    }
    if (!jsonFile) return;
    const file = await jsonFile.getFile();
    const data = JSON.parse(await file.text());
    mutator(data);
    const fh = await JSON_DIR_HANDLE.getFileHandle(jsonFile.name, { create: false });
    const writable = await fh.createWritable();
    await writable.write(JSON.stringify(data, null, 2));
    await writable.close();
  } catch (e) { /* silent */ }
}
