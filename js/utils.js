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
    { value: 'flight',  label: 'Flight',       icon: '✈️' },
    { value: 'transit', label: 'Train',        icon: '🚄' },
    { value: 'bus',     label: 'Bus',          icon: '🚌' },
    { value: 'ferry',   label: 'Ferry',        icon: '⛴️' },
    { value: 'taxi',    label: 'Taxi / Car',   icon: '🚕' },
  ]},
  { group: 'Accommodation', items: [
    { value: 'stay',     label: 'Hotel',       icon: '🏨' },
    { value: 'checkout', label: 'Check-out',   icon: '🔑' },
  ]},
  { group: 'Attraction',    items: [
    { value: 'temple',    label: 'Temple / Shrine',   icon: '⛩️' },
    { value: 'museum',    label: 'Museum',             icon: '🏛️' },
    { value: 'monument',  label: 'Monument',           icon: '🏯' },
    { value: 'park',      label: 'Park / Garden',      icon: '🌳' },
    { value: 'market',    label: 'Market',             icon: '🛍️' },
    { value: 'viewpoint', label: 'Viewpoint',          icon: '🗼' },
    { value: 'aquarium',  label: 'Aquarium',           icon: '🐋' },
    { value: 'zoo',       label: 'Zoo',                icon: '🐼' },
    { value: 'street',    label: 'Street / District',  icon: '🏘️' },
    { value: 'nightlife', label: 'Nightlife / Dining', icon: '🍻' },
    { value: 'activity',  label: 'Activity',           icon: '🎯' },
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
  { value: 'hotel',     label: 'Hotel',     icon: '🏨' },
  { value: 'apartment', label: 'Apartment', icon: '🏢' },
  { value: 'hostel',    label: 'Hostel',    icon: '🛏️' },
  { value: 'airbnb',    label: 'Airbnb',    icon: '🏠' },
  { value: 'camping',   label: 'Camping',   icon: '⛺' },
  { value: 'resort',    label: 'Resort',    icon: '🏖️' },
  { value: 'guesthouse', label: 'Guesthouse', icon: '🏡' },
];

// ─── Country flag list ───
const COUNTRY_FLAGS = [
  { flag: '🇦🇫', name: 'Afghanistan' }, { flag: '🇦🇱', name: 'Albania' }, { flag: '🇩🇿', name: 'Algeria' },
  { flag: '🇦🇷', name: 'Argentina' }, { flag: '🇦🇺', name: 'Australia' }, { flag: '🇦🇹', name: 'Austria' },
  { flag: '🇧🇪', name: 'Belgium' }, { flag: '🇧🇷', name: 'Brazil' }, { flag: '🇧🇬', name: 'Bulgaria' },
  { flag: '🇰🇭', name: 'Cambodia' }, { flag: '🇨🇦', name: 'Canada' }, { flag: '🇨🇱', name: 'Chile' },
  { flag: '🇨🇳', name: 'China' }, { flag: '🇨🇴', name: 'Colombia' }, { flag: '🇭🇷', name: 'Croatia' },
  { flag: '🇨🇺', name: 'Cuba' }, { flag: '🇨🇿', name: 'Czechia' }, { flag: '🇩🇰', name: 'Denmark' },
  { flag: '🇪🇬', name: 'Egypt' }, { flag: '🇪🇪', name: 'Estonia' }, { flag: '🇫🇮', name: 'Finland' },
  { flag: '🇫🇷', name: 'France' }, { flag: '🇩🇪', name: 'Germany' }, { flag: '🇬🇷', name: 'Greece' },
  { flag: '🇭🇰', name: 'Hong Kong' }, { flag: '🇭🇺', name: 'Hungary' }, { flag: '🇮🇸', name: 'Iceland' },
  { flag: '🇮🇳', name: 'India' }, { flag: '🇮🇩', name: 'Indonesia' }, { flag: '🇮🇪', name: 'Ireland' },
  { flag: '🇮🇱', name: 'Israel' }, { flag: '🇮🇹', name: 'Italy' }, { flag: '🇯🇵', name: 'Japan' },
  { flag: '🇯🇴', name: 'Jordan' }, { flag: '🇰🇪', name: 'Kenya' }, { flag: '🇰🇷', name: 'South Korea' },
  { flag: '🇱🇻', name: 'Latvia' }, { flag: '🇱🇹', name: 'Lithuania' }, { flag: '🇲🇾', name: 'Malaysia' },
  { flag: '🇲🇽', name: 'Mexico' }, { flag: '🇲🇦', name: 'Morocco' }, { flag: '🇲🇲', name: 'Myanmar' },
  { flag: '🇳🇱', name: 'Netherlands' }, { flag: '🇳🇿', name: 'New Zealand' }, { flag: '🇳🇬', name: 'Nigeria' },
  { flag: '🇳🇴', name: 'Norway' }, { flag: '🇵🇰', name: 'Pakistan' }, { flag: '🇵🇪', name: 'Peru' },
  { flag: '🇵🇭', name: 'Philippines' }, { flag: '🇵🇱', name: 'Poland' }, { flag: '🇵🇹', name: 'Portugal' },
  { flag: '🇷🇴', name: 'Romania' }, { flag: '🇷🇺', name: 'Russia' }, { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇸🇬', name: 'Singapore' }, { flag: '🇸🇰', name: 'Slovakia' }, { flag: '🇸🇮', name: 'Slovenia' },
  { flag: '🇿🇦', name: 'South Africa' }, { flag: '🇪🇸', name: 'Spain' }, { flag: '🇱🇰', name: 'Sri Lanka' },
  { flag: '🇸🇪', name: 'Sweden' }, { flag: '🇨🇭', name: 'Switzerland' }, { flag: '🇹🇼', name: 'Taiwan' },
  { flag: '🇹🇭', name: 'Thailand' }, { flag: '🇹🇷', name: 'Turkey' }, { flag: '🇺🇦', name: 'Ukraine' },
  { flag: '🇦🇪', name: 'UAE' }, { flag: '🇬🇧', name: 'United Kingdom' }, { flag: '🇺🇸', name: 'United States' },
  { flag: '🇻🇳', name: 'Vietnam' },
];

// Map flag emoji to country name
const FLAG_TO_COUNTRY = {};
COUNTRY_FLAGS.forEach(c => { FLAG_TO_COUNTRY[c.flag] = c.name; });

// Map flag emoji to ISO 3166-1 alpha-2 country code (for Nominatim countrycodes param)
const FLAG_TO_ISO = {
  '🇦🇫':'af','🇦🇱':'al','🇩🇿':'dz','🇦🇷':'ar','🇦🇺':'au','🇦🇹':'at',
  '🇧🇪':'be','🇧🇷':'br','🇧🇬':'bg','🇰🇭':'kh','🇨🇦':'ca','🇨🇱':'cl',
  '🇨🇳':'cn','🇨🇴':'co','🇭🇷':'hr','🇨🇺':'cu','🇨🇿':'cz','🇩🇰':'dk',
  '🇪🇬':'eg','🇪🇪':'ee','🇫🇮':'fi','🇫🇷':'fr','🇩🇪':'de','🇬🇷':'gr',
  '🇭🇰':'hk','🇭🇺':'hu','🇮🇸':'is','🇮🇳':'in','🇮🇩':'id','🇮🇪':'ie',
  '🇮🇱':'il','🇮🇹':'it','🇯🇵':'jp','🇯🇴':'jo','🇰🇪':'ke','🇰🇷':'kr',
  '🇱🇻':'lv','🇱🇹':'lt','🇲🇾':'my','🇲🇽':'mx','🇲🇦':'ma','🇲🇲':'mm',
  '🇳🇱':'nl','🇳🇿':'nz','🇳🇬':'ng','🇳🇴':'no','🇵🇰':'pk','🇵🇪':'pe',
  '🇵🇭':'ph','🇵🇱':'pl','🇵🇹':'pt','🇷🇴':'ro','🇷🇺':'ru','🇸🇦':'sa',
  '🇸🇬':'sg','🇸🇰':'sk','🇸🇮':'si','🇿🇦':'za','🇪🇸':'es','🇱🇰':'lk',
  '🇸🇪':'se','🇨🇭':'ch','🇹🇼':'tw','🇹🇭':'th','🇹🇷':'tr','🇺🇦':'ua',
  '🇦🇪':'ae','🇬🇧':'gb','🇺🇸':'us','🇻🇳':'vn',
};
// Reverse: ISO code → flag
const ISO_TO_FLAG = {};
for (const [flag, iso] of Object.entries(FLAG_TO_ISO)) ISO_TO_FLAG[iso] = flag;

// Map country flag to color palette (primary, secondary, tertiary)
// Ensures no color collisions between different countries
const COUNTRY_FLAG_PALETTES = {
  '🇦🇫': ['#ce1126', '#008000', '#000000'], // Red, Green, Black
  '🇦🇱': ['#002395', '#e60000', '#ffffff'], // Blue, Red, White
  '🇩🇿': ['#007a5e', '#ffffff', '#ff0000'], // Green, White, Red
  '🇦🇷': ['#75aadb', '#ffffff', '#ffcc00'], // Light Blue, White, Gold
  '🇦🇺': ['#00008b', '#ffcd00', '#008000'], // Dark Blue, Gold, Green
  '🇦🇹': ['#ed2939', '#ffffff', '#000000'], // Red, White, Black
  '🇧🇪': ['#000000', '#ffcd00', '#ff0000'], // Black, Gold, Red
  '🇧🇷': ['#009c3b', '#ffcd00', '#2b8cc4'], // Green, Gold, Blue
  '🇧🇬': ['#ffffff', '#00966e', '#d62612'], // White, Green, Red
  '🇰🇭': ['#0052cc', '#ff0000', '#ffcd00'], // Blue, Red, Gold
  '🇨🇦': ['#ff0000', '#ffffff', '#ff6b6b'], // Red, White, Light Red
  '🇨🇱': ['#0039a6', '#ffffff', '#ff0000'], // Blue, White, Red
  '🇨🇳': ['#de2910', '#ffcd00', '#000000'], // Red, Gold, Black
  '🇨🇴': ['#ffcd00', '#0066cc', '#ff0000'], // Gold, Blue, Red
  '🇭🇷': ['#171796', '#ffffff', '#f00000'], // Blue, White, Red
  '🇨🇺': ['#002a8f', '#ffffff', '#ff0000'], // Blue, White, Red
  '🇨🇿': ['#ffffff', '#ff0000', '#11006e'], // White, Red, Blue
  '🇩🇰': ['#c8102e', '#ffffff', '#000000'], // Red, White, Black
  '🇪🇬': ['#ce1126', '#ffffff', '#000000'], // Red, White, Black
  '🇪🇪': ['#4891d9', '#000000', '#ffffff'], // Light Blue, Black, White
  '🇫🇮': ['#003580', '#ffffff', '#ffcd00'], // Blue, White, Gold
  '🇫🇷': ['#002395', '#ffffff', '#ff0000'], // Blue, White, Red
  '🇩🇪': ['#000000', '#ff0000', '#ffcd00'], // Black, Red, Gold
  '🇬🇷': ['#0d47a1', '#ffffff', '#1976d2'], // Dark Blue, White, Light Blue
  '🇭🇰': ['#de2910', '#ffffff', '#000000'], // Red, White, Black
  '🇭🇺': ['#004b87', '#ffffff', '#00aa00'], // Blue, White, Green
  '🇮🇸': ['#0052cc', '#ffffff', '#ff0000'], // Blue, White, Red
  '🇮🇳': ['#ff9933', '#ffffff', '#138808'], // Orange, White, Green
  '🇮🇩': ['#ff0000', '#ffffff', '#000000'], // Red, White, Black
  '🇮🇪': ['#009543', '#ffffff', '#ff9e1b'], // Green, White, Orange
  '🇮🇱': ['#0038b8', '#ffffff', '#00aaff'], // Blue, White, Light Blue
  '🇮🇹': ['#009246', '#ffffff', '#ff0000'], // Green, White, Red
  '🇯🇵': ['#bc002d', '#ffffff', '#ffcd00'], // Red, White, Gold
  '🇯🇴': ['#000000', '#ffffff', '#ff0000'], // Black, White, Red
  '🇰🇪': ['#000000', '#ffffff', '#ff0000'], // Black, White, Red
  '🇰🇷': ['#003478', '#ffffff', '#c60c30'], // Dark Blue, White, Red
  '🇱🇻': ['#9d2235', '#ffffff', '#ffcd00'], // Red, White, Gold
  '🇱🇹': ['#ffcc00', '#ffffff', '#c41e3a'], // Gold, White, Red
  '🇲🇦': ['#ce1126', '#ffffff', '#006c35'], // Red, White, Green
  '🇲🇾': ['#007a5e', '#ffffff', '#ffcd00'], // Green, White, Gold
  '🇲🇽': ['#006341', '#ffffff', '#ff0000'], // Green, White, Red
  '🇲🇲': ['#ffcc00', '#ffffff', '#00aaff'], // Gold, White, Light Blue
  '🇳🇱': ['#21468b', '#ffffff', '#ff0000'], // Blue, White, Red
  '🇳🇿': ['#012169', '#000000', '#ffcd00'], // Dark Blue, Black, Gold
  '🇳🇬': ['#008751', '#ffffff', '#ff0000'], // Green, White, Red
  '🇳🇴': ['#186b48', '#ffffff', '#ff0000'], // Green, White, Red
  '🇵🇦': ['#00aaff', '#ff0000', '#ffffff'], // Light Blue, Red, White
  '🇵🇰': ['#012169', '#ffffff', '#00aa00'], // Dark Blue, White, Green
  '🇵🇪': ['#ff0000', '#ffffff', '#ffcd00'], // Red, White, Gold
  '🇵🇭': ['#0066ff', '#ffffff', '#ffcc00'], // Blue, White, Gold
  '🇵🇱': ['#ffffff', '#ff0000', '#000000'], // White, Red, Black
  '🇵🇹': ['#006600', '#ff0000', '#ffcd00'], // Green, Red, Gold
  '🇷🇴': ['#002395', '#ffcd00', '#ff0000'], // Blue, Gold, Red
  '🇷🇺': ['#ffffff', '#0039a6', '#ff0000'], // White, Blue, Red
  '🇸🇦': ['#006c35', '#ffffff', '#000000'], // Green, White, Black
  '🇸🇬': ['#ffffff', '#ff0000', '#000000'], // White, Red, Black
  '🇸🇰': ['#ffffff', '#0052cc', '#ff0000'], // White, Blue, Red
  '🇸🇮': ['#ffffff', '#0052cc', '#ff0000'], // White, Blue, Red
  '🇿🇦': ['#000000', '#ff0000', '#007a5e'], // Black, Red, Green
  '🇪🇸': ['#ffc400', '#ff0000', '#ffffff'], // Gold, Red, White
  '🇱🇰': ['#0052cc', '#ff9933', '#006b3f'], // Blue, Orange, Green
  '🇸🇪': ['#0052cc', '#ffcd00', '#000000'], // Blue, Gold, Black
  '🇨🇭': ['#ff0000', '#ffffff', '#000000'], // Red, White, Black
  '🇹🇼': ['#0052cc', '#ff0000', '#ffcd00'], // Blue, Red, Gold
  '🇹🇭': ['#2d2d7f', '#ff0000', '#ffffff'], // Purple-Blue, Red, White
  '🇹🇷': ['#ff0000', '#ffffff', '#ffcd00'], // Red, White, Gold
  '🇺🇦': ['#0052cc', '#ffcd00', '#ff0000'], // Blue, Gold, Red
  '🇦🇪': ['#000000', '#ff0000', '#ffffff'], // Black, Red, White
  '🇬🇧': ['#012169', '#ffffff', '#c8102e'], // Dark Blue, White, Red
  '🇺🇸': ['#0a3161', '#ffffff', '#ff0000'], // Dark Blue, White, Red
  '🇻🇳': ['#ce1126', '#ffcd00', '#000000'], // Red, Gold, Black
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
