/* ══════════════════════════════════════════
   TRIP PLANNER — SVG Icon System
   All default UI elements use SVG icons.
   User-customisable fields (card icon, food icon,
   custom-badge icon) may still hold emoji strings
   if chosen via "Custom…"; renderIcon() falls back
   to plain text for those.
══════════════════════════════════════════ */

// Each value is the inner SVG content (24×24 viewBox, stroke-based).
const ICON_PATHS = {

  /* ── UI Controls ───────────────────── */
  settings:      '<circle cx="12" cy="12" r="3"/><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>',
  search:        '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
  close:         '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'chevron-down':'<path d="m6 9 6 6 6-6"/>',
  'chevron-right':'<path d="m9 18 6-6-6-6"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  check:         '<path d="M20 6 9 17l-5-5"/>',
  plus:          '<path d="M12 5v14"/><path d="M5 12h14"/>',

  /* ── Files & Documents ─────────────── */
  folder:        '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  file:          '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  paperclip:     '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  save:          '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
  clipboard:     '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  edit:          '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',

  /* ── Location & Navigation ─────────── */
  'map-pin':     '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  flag:          '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  phone:         '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail:          '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  map:           '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  globe:         '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  signal:        '<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/>',
  shield:        '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  passport:      '<rect width="16" height="20" x="4" y="2" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 17h10"/>',
  'link-ext':    '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',

  /* ── Content ───────────────────────── */
  utensils:      '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  tag:           '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  calendar:      '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  compass:       '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  sidebar:       '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  wallet:        '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',

  /* ── Card Type Default Icons ───────── */
  plane:         '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  train:         '<path d="M8 3.1V7a4 4 0 0 0 8 0V3.1"/><path d="m9 15-1-1"/><path d="m15 15 1-1"/><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/>',
  bus:           '<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
  ship:          '<path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 1v4"/>',
  car:           '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  bed:           '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  key:           '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
  torii:         '<path d="M4 5h16"/><path d="M6 5v17"/><path d="M18 5v17"/><path d="M2 5c0-1 .5-3 2-3"/><path d="M22 5c0-1-.5-3-2-3"/><path d="M4 10h16"/>',
  columns:       '<rect width="4" height="12" x="4" y="8" rx=".5"/><rect width="4" height="12" x="10" y="8" rx=".5"/><rect width="4" height="12" x="16" y="8" rx=".5"/><path d="M4 6h16"/><path d="M4 22h16"/>',
  castle:        '<path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/><path d="M18 11V4H6v7"/><path d="M15 22v-4a3 3 0 0 0-6 0v4"/><path d="M8 4V2"/><path d="M12 4V2"/><path d="M16 4V2"/>',
  tree:          '<path d="M12 22v-7"/><path d="m17 8-5-6-5 6z"/><path d="m19 14-7-7-7 7z"/>',
  'shopping-bag':'<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  tower:         '<path d="M8 22v-7l-2 2"/><path d="M16 22v-7l2 2"/><path d="M12 2v5"/><path d="M10 7h4"/><path d="M8 10h8"/><path d="M7 22h10"/><path d="M10 7v15"/><path d="M14 7v15"/>',
  fish:          '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6-3.56 0-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5 .23 6.5C5.58 18.03 7 16 7 13.33"/>',
  paw:           '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
  buildings:     '<rect width="7" height="14" x="3" y="8" rx="1"/><rect width="7" height="10" x="14" y="12" rx="1"/><path d="M5 12h3"/><path d="M5 16h3"/><path d="M16 16h3"/>',
  wine:          '<path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/>',
  target:        '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  pin:           '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',

  /* ── Scenes & Places ───────────────── */
  mountain:      '<path d="m8 3 4 8 5-5 5 15H2Z"/>',
  waves:         '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.5 0 2.5 2 5 2 2.6 0 2.6-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  sunrise:       '<path d="M12 2v4"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="M16 18a4 4 0 0 0-8 0"/>',
  moon:          '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  skyline:       '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  lantern:       '<rect x="8" y="6" width="8" height="10" rx="1"/><path d="M10 2h4"/><path d="M12 2v4"/><path d="M8 10h8"/><path d="M10 16l-2 6"/><path d="M14 16l2 6"/>',
  leaf:          '<path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 20 7 20 7s-.7 9.4-9 13"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  palette:       '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  storefront:    '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
  'graduation-cap':'<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  bird:          '<path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/>',
  sailboat:      '<path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z"/><path d="M21 14 10 2 3 14"/><path d="M10 2v16"/>',

  /* ── Food & Drink ──────────────────── */
  bowl:          '<path d="M4 14c0 4.5 3.6 8 8 8s8-3.5 8-8"/><path d="M2 14h20"/>',
  noodles:       '<path d="M4 15c0 4 3.6 7 8 7s8-3 8-7"/><path d="M2 15h20"/><path d="M9 2c0 4 1.5 9 3 9s3-5 3-9"/>',
  sushi:         '<ellipse cx="12" cy="17" rx="8" ry="4"/><path d="M4 17c0-4 3-8 8-8s8 4 8 8"/><path d="M8 15c2-.5 6-.5 8 0"/>',
  dumpling:      '<path d="M3 14c0 4 4 7 9 7s9-3 9-7"/><path d="M3 14c0-5.5 4-10 9-10s9 4.5 9 10"/><path d="M6 14c1-1 2-1 3 0s2 1 3 0 2-1 3 0 2 1 3 0"/>',
  skewer:        '<circle cx="12" cy="5" r="2"/><circle cx="12" cy="11" r="2"/><circle cx="12" cy="17" r="2"/><path d="M12 2v20"/>',
  tea:           '<path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2"/><path d="M10 2v2"/><path d="M14 2v2"/>',
  beer:          '<path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44-.5-3-1s-2-.5-3 0"/><rect x="4" y="8" width="12" height="12" rx="2"/>',
  steak:         '<path d="M14 3C9 3 5 7 5 12s4 9 9 9c2 0 4-1 6-3s2-5 1-8c-1.5-4-4-7-7-7Z"/><path d="M10 8c-1 2-1 5 0 8"/>',
  drumstick:     '<path d="M15.5 2.5a5 5 0 0 0-5 8.5L3.7 17.8a2.12 2.12 0 1 0 3 3l6.8-6.8a5 5 0 0 0 2-11.5Z"/>',
  shrimp:        '<path d="M18 4a6 6 0 0 1 0 8.5L12 18"/><path d="M18 4l2-2"/><path d="M18 4l3 .5"/><path d="M12 18l-4 2-2 2"/><path d="M12 18l-2 4-2 0"/><path d="M8 14c-2-1-3-4-1-7"/>',
  chopsticks:    '<path d="M3 2l7 20"/><path d="M9 2l7 20"/>',
  pepper:        '<path d="M12 3c-2 0-5 3-5 8s3 10 5 10 5-5 5-10-3-8-5-8Z"/><path d="M12 3c0-1.5 1-2 2-1"/>',
  bread:         '<ellipse cx="12" cy="14" rx="8" ry="6"/><path d="M4 14c0-4 3-8 8-8s8 4 8 8"/><path d="M8 11c2 1 6 1 8 0"/>',
  dessert:       '<path d="M8 22h8"/><path d="M12 11v11"/><path d="M20 8H4l2-5h12Z"/><path d="M6 8c0 3 2.7 5 6 5s6-2 6-5"/>',
};

/**
 * Build an inline SVG element from the icon name.
 * @param {string} name  Key in ICON_PATHS
 * @param {number} [size=16]  Width & height in px
 * @param {string} [cls='']   Extra CSS classes
 * @returns {string} SVG HTML string
 */
function icon(name, size, cls) {
  size = size || 16;
  cls  = cls  || '';
  const paths = ICON_PATHS[name];
  if (!paths) return '';
  return '<svg class="tp-icon ' + cls + '" width="' + size + '" height="' + size
    + '" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
    + ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + paths + '</svg>';
}

/**
 * Render an icon for display.  Checks ICON_PATHS first, then
 * EMOJI_TO_SVG mapping, then falls back to plain text (emoji).
 */
function renderIcon(str, size, cls) {
  if (!str) return icon('pin', size, cls);              // fallback
  if (ICON_PATHS[str]) return icon(str, size, cls);     // direct SVG key
  const mapped = EMOJI_TO_SVG[str];
  if (mapped) return icon(mapped, size, cls);            // emoji → SVG
  return str;                                            // custom emoji / text
}

// ── Default card-type → SVG icon key mapping ──
const DEFAULT_TYPE_ICONS = {
  flight:    'plane',
  transit:   'train',
  bus:       'bus',
  ferry:     'ship',
  taxi:      'car',
  stay:      'bed',
  checkout:  'key',
  temple:    'torii',
  museum:    'columns',
  monument:  'castle',
  park:      'tree',
  market:    'shopping-bag',
  viewpoint: 'tower',
  aquarium:  'fish',
  zoo:       'paw',
  street:    'buildings',
  nightlife: 'wine',
  activity:  'target',
};

/**
 * Get the display icon for a card.  User-set emoji → emoji,
 * otherwise the default SVG for the card type.
 * @param {object} card  The card object  { icon, type, ... }
 * @param {number} [size]
 * @returns {string} HTML
 */
function cardIcon(card, size) {
  size = size || 16;
  // If the card has an icon value, try to render it as SVG first
  if (card.icon) {
    if (ICON_PATHS[card.icon]) return icon(card.icon, size);
    // Not a known SVG key — treat as user emoji
    return card.icon;
  }
  // No explicit icon — use default SVG for the type
  const key = DEFAULT_TYPE_ICONS[card.type] || 'pin';
  return icon(key, size);
}

// ─── Country flag image helper (uses flagcdn.com) ──────
/**
 * Render a country flag as an <img> tag.
 * @param {string} iso  ISO 3166-1 alpha-2 code (e.g. 'jp', 'de')
 * @param {number} [size=16]  Height in px (width auto)
 * @returns {string} HTML <img> tag, or empty string if no code
 */
function countryFlag(iso, size) {
  if (!iso) return '';
  size = size || 16;
  const code = iso.toLowerCase();
  return '<img class="tp-flag" src="https://flagcdn.com/w40/' + code + '.png"'
    + ' alt="' + code.toUpperCase() + '"'
    + ' width="' + Math.round(size * 1.5) + '" height="' + size + '"'
    + ' style="display:inline-block;vertical-align:middle;object-fit:contain;border-radius:2px"'
    + ' loading="lazy">';
}

// ─── Emoji → SVG key mapping ──────────────────────────
// Maps legacy emoji values (from config/data) to SVG icon keys.
// Used by renderIcon() to transparently upgrade old data.
const EMOJI_TO_SVG = {
  // Card type defaults
  '✈️': 'plane', '\u2708': 'plane',
  '🚄': 'train', '🚅': 'train', '🚆': 'train', '🚇': 'train', '🚈': 'train', '🚂': 'train', '🚃': 'train', '🚉': 'train',
  '🚌': 'bus', '🚍': 'bus', '🚎': 'bus',
  '⛴️': 'ship', '\u26F4': 'ship', '🚢': 'ship', '🛳️': 'ship',
  '🚕': 'car', '🚗': 'car', '🚖': 'car', '🚘': 'car', '🚙': 'car',
  '🏨': 'bed', '🛏️': 'bed',
  '🔑': 'key',
  '⛩️': 'torii', '\u26E9': 'torii',
  '🏛️': 'columns',
  '🏯': 'castle', '🏰': 'castle',
  '🌳': 'tree', '🌲': 'tree',
  '🛍️': 'shopping-bag',
  '🗼': 'tower',
  '🐋': 'fish', '🐙': 'fish', '🐡': 'fish', '🐠': 'fish',
  '🐼': 'paw', '🦡': 'paw',
  '🏘️': 'buildings',
  '🍻': 'beer', '🍺': 'beer',
  '🎯': 'target',
  '🍽️': 'utensils',
  // Scene / place icons
  '🏔️': 'mountain', '⛰️': 'mountain',
  '🌊': 'waves',
  '🌆': 'sunrise', '🌇': 'sunrise',
  '🌃': 'moon',
  '🏙️': 'skyline', '🏗️': 'skyline',
  '🏮': 'lantern',
  '🌿': 'leaf',
  '🎨': 'palette',
  '🏪': 'storefront',
  '🎓': 'graduation-cap',
  '🦅': 'bird', '🦆': 'bird',
  '🥂': 'wine', '🥃': 'wine', '🍷': 'wine', '🍸': 'wine', '🍹': 'wine',
  '🚦': 'buildings',
  '🛶': 'sailboat',
  '🍵': 'tea', '🍶': 'tea', '☕': 'tea', '🧋': 'tea',
  '🍗': 'drumstick',
  '🍲': 'bowl', '🥣': 'bowl',
  '🥟': 'dumpling',
  '🐟': 'fish',
  '🌳': 'tree',
  // Food icons
  '🍣': 'sushi',
  '🍜': 'noodles',
  '🍤': 'shrimp', '🦐': 'shrimp', '🦞': 'shrimp',
  '🥩': 'steak', '🍖': 'steak',
  '🍢': 'skewer', '🍡': 'skewer',
  '🥢': 'chopsticks',
  '🌶️': 'pepper',
  '🥞': 'bread', '🥐': 'bread', '🥖': 'bread',
  '🩸': 'bowl',
  '🐑': 'steak', '🫏': 'steak',
  '🍾': 'wine',
  // Stay subtypes
  '🏢': 'skyline',
  '🏠': 'buildings', '🏡': 'buildings',
  '⛺': 'tree',
  '🏖️': 'waves',
};

// ─── Food icon palette (SVG-based) ──────────────────────
// Each entry: { key: ICON_PATHS key, label: display name }
const FOOD_ICONS = [
  { key: 'sushi',      label: 'Sushi / Raw' },
  { key: 'noodles',    label: 'Noodles / Ramen' },
  { key: 'bowl',       label: 'Bowl / Soup / Stew' },
  { key: 'dumpling',   label: 'Dumplings' },
  { key: 'skewer',     label: 'Skewer / Street Food' },
  { key: 'shrimp',     label: 'Seafood' },
  { key: 'fish',       label: 'Fish' },
  { key: 'steak',      label: 'Meat / Steak' },
  { key: 'drumstick',  label: 'Poultry' },
  { key: 'bread',      label: 'Bread / Pastry' },
  { key: 'dessert',    label: 'Dessert / Sweets' },
  { key: 'utensils',   label: 'Dining' },
  { key: 'tea',        label: 'Tea / Coffee' },
  { key: 'beer',       label: 'Beer' },
  { key: 'wine',       label: 'Wine / Cocktail' },
  { key: 'leaf',       label: 'Vegetarian / Herbs' },
  { key: 'pepper',     label: 'Spicy' },
  { key: 'chopsticks', label: 'Chopsticks / Asian' },
  { key: 'storefront', label: 'Market / Street Vendor' },
  { key: 'lantern',    label: 'Night Market' },
];

// ─── Card-icon palettes (SVG-based, per category) ──────
const SVG_PALETTES = {
  transport: ['plane','train','bus','ship','car','sailboat'],
  stay:      ['bed','key','buildings','skyline'],
  place:     ['torii','columns','castle','tree','shopping-bag','tower','fish','paw','buildings',
              'wine','beer','target','mountain','waves','sunrise','moon','skyline','lantern',
              'leaf','palette','storefront','graduation-cap','bird','drumstick','bowl',
              'sushi','noodles','dumpling','utensils','tea'],
};
