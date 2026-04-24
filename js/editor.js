/* ══════════════════════════════════════════
   TRIP PLANNER — Editor Module
══════════════════════════════════════════ */

let editorData = null;       // Working copy of the full config
let pendingFiles = [];       // Files the user picked that may need copying
let editorSnapshot = '';     // JSON snapshot at open time for dirty detection

// ─── Route helpers ───
const ROUTE_DEFAULT_COLORS = ['#aaaaaa','#f0c070','#e94560','#5ab4d4','#6fcf97','#b48ade','#e8a85a','#d47caf','#7c9fd4','#74c48a','#9090d4','#e87c5a'];

function getRouteCities() {
  const route = editorData ? (editorData.trip.route || []) : [];
  const seen = new Set();
  const cities = [];
  for (const r of route) {
    const key = (r.flag || '') + '::' + (r.city || '');
    if (r.city && !seen.has(key)) {
      seen.add(key);
      cities.push({ flag: r.flag || '', city: r.city, color: r.color || '#aaaaaa' });
    }
  }
  return cities;
}

// Check if any route stop has at least 1 character in city name
function hasRouteStopWithCity() {
  const route = editorData ? (editorData.trip.route || []) : [];
  return route.some(r => r.city && r.city.length > 0);
}

// ─── Color generation & auto-assignment ───

function lightenColor(hex, percent = 12) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0xFF) + amt);
  const B = Math.min(255, (num & 0xFF) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function darkenColor(hex, percent = 12) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0xFF) - amt);
  const B = Math.max(0, (num & 0xFF) - amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function generateColorShades(baseColor, count) {
  if (count === 1) return [baseColor];
  const shades = [baseColor];
  let lighter = baseColor;
  let darker = baseColor;
  for (let i = 1; i < count; i++) {
    if (i % 2 === 1) {
      lighter = lightenColor(lighter, 10);
      shades.push(lighter);
    } else {
      darker = darkenColor(darker, 10);
      shades.push(darker);
    }
  }
  return shades;
}

function autoAssignRouteColors(route) {
  // Group route indices by flag
  const flagIndices = {};
  route.forEach((stop, i) => {
    if (stop.flag) {
      if (!flagIndices[stop.flag]) flagIndices[stop.flag] = [];
      flagIndices[stop.flag].push(i);
    }
  });

  const flagToBaseColor = {};

  // For each flag, find first available color from its palette (not used by other flags)
  for (const flag of Object.keys(flagIndices)) {
    const palette = COUNTRY_FLAG_PALETTES[flag] || ROUTE_DEFAULT_COLORS;
    let assignedColor = null;

    // Try each color in the palette
    for (const color of palette) {
      let colorUsedByOtherFlag = false;
      // Check if this color is assigned to a different flag
      for (const [otherFlag, baseColor] of Object.entries(flagToBaseColor)) {
        if (otherFlag !== flag && baseColor === color) {
          colorUsedByOtherFlag = true;
          break;
        }
      }
      if (!colorUsedByOtherFlag) {
        assignedColor = color;
        break;
      }
    }

    // If all palette colors are used by other flags, use next available default color
    if (!assignedColor) {
      const usedByOtherFlags = new Set(Object.values(flagToBaseColor));
      for (const color of ROUTE_DEFAULT_COLORS) {
        if (!usedByOtherFlags.has(color)) {
          assignedColor = color;
          break;
        }
      }
    }

    flagToBaseColor[flag] = assignedColor || ROUTE_DEFAULT_COLORS[0];
  }

  // Assign colors to cities: base color for single city, shades for multiple cities in same flag
  for (const [flag, indices] of Object.entries(flagIndices)) {
    const baseColor = flagToBaseColor[flag];

    if (indices.length === 1) {
      route[indices[0]].color = baseColor;
    } else {
      // Generate shades for multiple cities in same country
      const shades = generateColorShades(baseColor, indices.length);
      indices.forEach((idx, i) => {
        route[idx].color = shades[i];
      });
    }
  }
}

// ─── Subtitle generation ───

function generateSubtitle(trip, days) {
  const route = trip.route || [];
  const daysArr = days || [];

  // Get unique cities from route (flag+city composite key)
  const cities = [];
  const seen = new Set();
  for (const r of route) {
    const key = (r.flag || '') + '::' + (r.city || '');
    if (r.city && !seen.has(key)) {
      seen.add(key);
      cities.push(r.city);
    }
  }

  // Get date range from days
  let firstDate = '';
  let lastDate = '';
  if (daysArr.length > 0) {
    firstDate = daysArr[0].date || '';
    lastDate = daysArr[daysArr.length - 1].date || '';
  }

  // Build subtitle
  let parts = [];
  if (firstDate || lastDate) {
    const dateRange = firstDate === lastDate
      ? firstDate
      : firstDate && lastDate ? `${firstDate} – ${lastDate}` : firstDate || lastDate || '';
    if (dateRange) parts.push(dateRange);
  }
  if (daysArr.length > 0) {
    parts.push(`${daysArr.length} ${t('sub.days')}`);
  }
  if (cities.length > 0) {
    parts.push(`${cities.length} ${t('sub.cities')}`);
  }

  return parts.join(' · ');
}

// ─── Open / Close ───

function openEditor(fromScratch) {
  if (fromScratch) {
    editorData = {
      trip: { title: t('display.myTrip'), year: new Date().getFullYear().toString(), subtitle: '', route: [], customBadges: [] },
      attachmentsBasePath: '',
      days: []
    };
  } else {
    editorData = deepClone({ trip: TRIP_CONFIG, attachmentsBasePath: ATTACHMENTS_BASE, days: DAYS });
    if (!editorData.trip.customBadges) editorData.trip.customBadges = [];
  }
  pendingFiles = [];

  // Auto-assign smart colors to route stops (country-based with shades for multiple cities)
  if (editorData.trip.route && editorData.trip.route.length > 0) {
    autoAssignRouteColors(editorData.trip.route);
  }

  // Populate dateISO from display dates for datepicker
  for (const day of (editorData.days || [])) {
    if (day.date && !day.dateISO) {
      day.dateISO = displayToISO(day.date);
    }
  }

  // Register custom types in TYPE_META/CARD_TYPE_ICONS
  for (const ct of (editorData.trip.customTypes || [])) {
    if (!TYPE_META[ct.value]) TYPE_META[ct.value] = { color: 'var(--activity-c)', label: ct.label };
    if (!CARD_TYPE_ICONS[ct.value]) CARD_TYPE_ICONS[ct.value] = ct.icon;
  }

  const overlay = document.getElementById('editor-overlay');
  overlay.classList.remove('hidden');
  document.body.classList.add('editor-active');

  // On mobile, move settings gear into editor toolbar
  moveSettingsToToolbar();

  renderEditorForm();

  // Capture snapshot for dirty detection
  editorSnapshot = JSON.stringify(editorData);
}

function closeEditor() {
  // Prompt if there are unsaved changes
  if (editorData && JSON.stringify(editorData) !== editorSnapshot) {
    if (!confirm(t('ed.discardChanges'))) return;
  }
  document.getElementById('editor-overlay').classList.add('hidden');
  document.body.classList.remove('editor-active');

  // Restore settings gear to original position
  restoreSettingsFromToolbar();

  editorData = null;
  pendingFiles = [];
  editorSnapshot = '';

  // If no trip is loaded, go back to the picker
  if (!TRIP_CONFIG) {
    document.getElementById('trip-view').classList.add('hidden');
    document.getElementById('picker-view').classList.remove('hidden');
  }
}

// ─── Save ───

async function saveTrip() {
  if (!editorData) return;

  // Build the final config JSON
  const config = deepClone(editorData);

  // Clean up empty optional fields on cards
  for (const day of config.days) {
    for (const card of (day.cards || [])) {
      ['from', 'to', 'carrier', 'sub', 'phone', 'email', 'city'].forEach(k => {
        if (card[k] === '') delete card[k];
      });
      // Clean empty/invalid map-location objects
      ['maps', 'mapsFrom', 'mapsTo'].forEach(k => {
        const v = card[k];
        if (v === '' || v === null || v === undefined) { delete card[k]; return; }
        if (typeof v === 'object' && (!v.lat || !v.lng)) delete card[k];
      });
      // Remove legacy geocode cache fields
      ['lat', 'lng', 'latFrom', 'lngFrom', 'latTo', 'lngTo'].forEach(k => delete card[k]);
      if (card.tips && card.tips.length === 0) delete card.tips;
      if (card.tags && card.tags.length === 0) delete card.tags;
      // Clean up visited=false (only store when true)
      if (card.visited === false) delete card.visited;
    }
    if (day.food && day.food.length === 0) delete day.food;
    if (day.files && day.files.length === 0) delete day.files;
    // Clean optional day fields
    delete day.dateISO; // Internal field, not for storage
    ['parentCity', 'dayTrip', 'segments', 'segmentColors'].forEach(k => {
      if (!day[k] || (Array.isArray(day[k]) && day[k].length === 0)) delete day[k];
    });
    if (day.dayTrip === false) delete day.dayTrip;
  }

  // Remove empty customBadges
  if (config.trip.customBadges && config.trip.customBadges.length === 0) {
    delete config.trip.customBadges;
  }

  // Persist current card style preference
  config.trip.cardStyle = currentCardStyle;

  const jsonStr = JSON.stringify(config, null, 2);

  // Try to save via File System Access API (overwrites trip-config.json)
  let saved = false;
  if (JSON_DIR_HANDLE) {
    try {
      const fileHandle = await JSON_DIR_HANDLE.getFileHandle('trip-config.json', { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(jsonStr);
      await writable.close();
      saved = true;

      // Copy any pending files to the correct subfolders
      for (const pf of pendingFiles) {
        try {
          const parts = pf.targetPath.split('/');
          let dir = JSON_DIR_HANDLE;
          for (let i = 0; i < parts.length - 1; i++) {
            dir = await dir.getDirectoryHandle(parts[i], { create: true });
          }
          const fh = await dir.getFileHandle(parts[parts.length - 1], { create: true });
          const w = await fh.createWritable();
          await w.write(pf.file);
          await w.close();
        } catch (err) {
          console.warn('Could not copy file:', pf.targetPath, err);
        }
      }
    } catch (err) {
      console.warn('File System Access save failed:', err);
    }
  }

  if (!saved) {
    // Fallback: download the JSON
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trip-config.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Apply changes to the live app
  initTrip(config);
  closeEditor();
  showToast(saved ? t('toast.saved') : t('toast.downloaded'));
}

// ─── Main Form Renderer ───

function renderEditorForm() {
  const body = document.getElementById('editor-body');
  body.innerHTML = `<div class="editor-body-inner" id="editor-inner">
    <div id="ed-sec-trip-info"></div>
    <div id="ed-sec-route"></div>
    <div id="ed-sec-badges"></div>
    <div id="ed-sec-days"></div>
  </div>`;
  document.getElementById('ed-sec-trip-info').innerHTML = renderTripInfoSection();
  document.getElementById('ed-sec-route').innerHTML = renderRouteSection();
  document.getElementById('ed-sec-badges').innerHTML = renderBadgesSection();
  document.getElementById('ed-sec-days').innerHTML = renderDaysSection();

  // Open first section by default
  const inner = document.getElementById('editor-inner');
  const first = inner.querySelector('.editor-section');
  if (first) first.classList.add('open');
}

function toggleEditorSection(header) {
  const section = header.closest('.editor-section');
  if (section.classList.contains('editor-section-disabled')) return;
  section.classList.toggle('open');
}

// ─── Trip Info Section ───

function renderTripInfoSection() {
  const tp = editorData.trip;
  const days = tp.days || [];
  const autoSubtitle = tp.autoSubtitle !== false; // Default to true
  const generatedSubtitle = generateSubtitle(tp, days);
  const displaySubtitle = autoSubtitle ? generatedSubtitle : (tp.subtitle || '');
  
  return `
  <div class="editor-section open">
    <div class="editor-section-header" onclick="toggleEditorSection(this)">
      <span class="editor-section-chevron">▶</span>
      <span class="editor-section-title">${t('ed.tripInfo')}</span>
    </div>
    <div class="editor-section-body">
      <div class="editor-row">
        <div class="editor-field" style="flex:2">
          <label class="editor-label">${t('ed.title')}</label>
          <input class="editor-input" value="${escHtml(tp.title || '')}" oninput="editorData.trip.title=this.value">
        </div>
        <div class="editor-field" style="flex:1">
          <label class="editor-label">${t('ed.year')}</label>
          <input class="editor-input" value="${escHtml(tp.year || '')}" oninput="editorData.trip.year=this.value">
        </div>
      </div>
      <div class="editor-field">
        <label class="editor-label">${t('ed.subtitle')}</label>
        <div style="display:flex; gap:8px; align-items:center;">
          <input class="editor-input" value="${escHtml(displaySubtitle)}" 
            oninput="editorData.trip.subtitle=this.value" 
            placeholder="${t('ph.subtitle')}"
            style="${autoSubtitle ? 'color:#999;cursor:default;' : ''}">
          <label style="display:flex; align-items:center; gap:4px; white-space:nowrap;">
            <input type="checkbox" ${autoSubtitle ? 'checked' : ''} 
              onchange="editorData.trip.autoSubtitle=this.checked; if(this.checked) editorData.trip.subtitle=generateSubtitle(editorData.trip, editorData.trip.days || []); refreshSection('trip-info')">
            <span style="font-size:12px;">${t('ed.auto')}</span>
          </label>
        </div>
      </div>
    </div>
  </div>`;
}

// ─── Route Section ───

function renderRouteSection() {
  const route = editorData.trip.route || [];
  const stops = route.map((r, i) => {
    const currentFlagOptions = COUNTRY_FLAGS.map(c => {
      const sel = r.flag === c.flag ? ' selected' : '';
      return `<option value="${c.flag}"${sel}>${c.flag} ${c.name}</option>`;
    }).join('');
    return `
    <div class="editor-inline-row">
      <input type="color" class="editor-color-input editor-route-color" value="${r.color || '#aaaaaa'}" oninput="editorData.trip.route[${i}].color=this.value;edSyncRouteColorToDays(${i})">
      <select class="editor-inline-input editor-flag-select" onchange="editorData.trip.route[${i}].flag=this.value;edSyncRouteFlagToDays(${i});refreshSection('route')">
        <option value="">${t('ed.selectCountry')}</option>
        ${currentFlagOptions}
      </select>
      <input class="editor-inline-input city-input" value="${escHtml(r.city || '')}" oninput="edRenameRouteCity(${i},this.value);refreshSection('days');refreshSection('trip-info')" placeholder="${t('ed.cityName')}">
      <button class="editor-move-btn" onclick="edMoveRoute(${i},-1)" title="${t('ed.moveUp')}">↑</button>
      <button class="editor-move-btn" onclick="edMoveRoute(${i},1)" title="${t('ed.moveDown')}">↓</button>
      <button class="editor-remove-btn" onclick="edRemoveRoute(${i})" title="${t('ed.remove')}">✕</button>
    </div>`;
  }).join('');

  return `
  <div class="editor-section">
    <div class="editor-section-header" onclick="toggleEditorSection(this)">
      <span class="editor-section-chevron">▶</span>
      <span class="editor-section-title">${t('ed.route')}</span>
      <span class="editor-section-badge">${route.length} ${t('ed.stops')}</span>
    </div>
    <div class="editor-section-body" id="ed-route-body">
      ${stops}
      <button class="editor-add-btn" onclick="edAddRoute()">${t('ed.addStop')}</button>
    </div>
  </div>`;
}

function edAddRoute() {
  editorData.trip.route = editorData.trip.route || [];
  editorData.trip.route.push({ flag: '', city: '', color: '#aaaaaa' });
  autoAssignRouteColors(editorData.trip.route);
  refreshSection('route');
}
function edRemoveRoute(i) {
  const removedCity = editorData.trip.route[i].city;
  const otherExists = removedCity && editorData.trip.route.some((r, ri) => ri !== i && r.city === removedCity);

  if (removedCity && !otherExists) {
    const affected = [];
    (editorData.days || []).forEach((d, di) => {
      if (d.city === removedCity || d.parentCity === removedCity)
        affected.push(d.date || `Day ${di + 1}`);
    });
    if (affected.length > 0) {
      const list = affected.map(a => `  \u2022 ${a}`).join('\n');
      if (!confirm(`${t('confirm.removeCity1')}${removedCity}${t('confirm.removeCity2')}\n\n${list}\n\n${t('confirm.proceed')}`)) return;
      for (const d of (editorData.days || [])) {
        if (d.city === removedCity) { d.city = ''; d.flag = ''; d.color = '#aaaaaa'; }
        if (d.parentCity === removedCity) d.parentCity = '';
      }
    }
  }
  editorData.trip.route.splice(i, 1);
  refreshSection('route');
  refreshSection('trip-info');
}

function edSyncRouteColorToDays(routeIdx) {
  const r = editorData.trip.route[routeIdx];
  if (!r || !r.city) return;
  for (const day of (editorData.days || [])) {
    if (day.city === r.city || day.parentCity === r.city) day.color = r.color;
  }
  refreshSection('route');
}
function edSyncRouteFlagToDays(routeIdx) {
  const r = editorData.trip.route[routeIdx];
  if (!r) return;
  // Sync flag to matching days (only if city exists)
  if (r.city) {
    for (const day of (editorData.days || [])) {
      if (day.city === r.city || day.parentCity === r.city) day.flag = r.flag;
    }
  }
  // Always re-assign colors when flag changes
  autoAssignRouteColors(editorData.trip.route);
  // Sync newly assigned colors to days
  if (r.city) {
    for (const day of (editorData.days || [])) {
      if (day.city === r.city || day.parentCity === r.city) day.color = r.color;
    }
  }
}
function edRenameRouteCity(routeIdx, newName) {
  const oldName = editorData.trip.route[routeIdx].city;
  editorData.trip.route[routeIdx].city = newName;
  if (oldName && oldName !== newName) {
    for (const day of (editorData.days || [])) {
      if (day.city === oldName) day.city = newName;
      if (day.parentCity === oldName) day.parentCity = newName;
    }
  }
}
function edMoveRoute(i, dir) {
  const arr = editorData.trip.route;
  const j = i + dir;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  refreshSection('route');
}

// ─── Badges Section ───

function renderBadgesSection() {
  const tp = editorData.trip;
  let html = '';

  // eSIM
  html += renderEsimEditor(tp);
  // Insurance
  html += renderInsuranceEditor(tp);
  // Customs
  html += renderCustomsEditor(tp);
  // Custom badges
  (tp.customBadges || []).forEach((b, i) => {
    html += renderCustomBadgeEditor(b, i);
  });

  return `
  <div class="editor-section">
    <div class="editor-section-header" onclick="toggleEditorSection(this)">
      <span class="editor-section-chevron">▶</span>
      <span class="editor-section-title">${t('ed.badges')}</span>
    </div>
    <div class="editor-section-body" id="ed-badges-body">
      ${html}
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="editor-add-btn" onclick="edAddEsim()" ${tp.esim ? 'disabled style="opacity:0.4"' : ''}>${t('ed.addEsim')}</button>
        <button class="editor-add-btn" onclick="edAddInsurance()" ${tp.insurance ? 'disabled style="opacity:0.4"' : ''}>${t('ed.addInsurance')}</button>
        <button class="editor-add-btn" onclick="edAddCustoms()" ${tp.customs ? 'disabled style="opacity:0.4"' : ''}>${t('ed.addCustoms')}</button>
        <button class="editor-add-btn" onclick="edAddCustomBadge()">${t('ed.addCustomBadge')}</button>
      </div>
    </div>
  </div>`;
}

function renderEsimEditor(tp) {
  if (!tp.esim) return '';
  const e = tp.esim;
  return `<div class="editor-badge-item">
    <div class="editor-badge-header">
      <span class="editor-badge-icon">📶</span>
      <span class="editor-badge-name">${t('ed.esim')}</span>
      <button class="editor-remove-btn" onclick="delete editorData.trip.esim;refreshSection('badges')" title="${t('ed.remove')}">✕</button>
    </div>
    <div class="editor-field"><label class="editor-label">${t('ed.label')}</label><input class="editor-input" value="${escHtml(e.label || '')}" oninput="editorData.trip.esim.label=this.value"></div>
    <div class="editor-row">
      <div class="editor-field"><label class="editor-label">${t('ed.price')}</label><input class="editor-input" value="${escHtml(e.price || '')}" oninput="editorData.trip.esim.price=this.value" placeholder="€26.53"></div>
      <div class="editor-field"><label class="editor-label">${t('ed.status')}</label>
        <select class="editor-select" onchange="editorData.trip.esim.status=this.value">
          <option value="paid" ${e.status === 'paid' ? 'selected' : ''}>${t('ed.paidOpt')}</option>
          <option value="unpaid" ${e.status === 'unpaid' ? 'selected' : ''}>${t('ed.unpaidOpt')}</option>
          <option value="" ${!e.status ? 'selected' : ''}>${t('ed.noneOpt')}</option>
        </select>
      </div>
    </div>
    <div class="editor-field"><label class="editor-label">${t('ed.filePath')}</label><input class="editor-input" value="${escHtml(e.file || '')}" oninput="editorData.trip.esim.file=this.value" placeholder="Other/esim.pdf"></div>
  </div>`;
}

function renderInsuranceEditor(tp) {
  if (!tp.insurance) return '';
  const ins = tp.insurance;
  const certsHTML = (ins.certificates || []).map((c, i) => `
    <div class="editor-badge-sub-item">
      <input class="editor-inline-input flag-input" value="${c.flag || ''}" oninput="editorData.trip.insurance.certificates[${i}].flag=this.value" placeholder="🏳️">
      <input class="editor-inline-input" style="flex:1" value="${escHtml(c.title || '')}" oninput="editorData.trip.insurance.certificates[${i}].title=this.value" placeholder="${t('ed.title')}">
      <input class="editor-inline-input" style="flex:2" value="${escHtml(c.file || '')}" oninput="editorData.trip.insurance.certificates[${i}].file=this.value" placeholder="Insurance/file.pdf">
      <button class="editor-remove-btn" onclick="editorData.trip.insurance.certificates.splice(${i},1);refreshSection('badges')">✕</button>
    </div>`).join('');

  return `<div class="editor-badge-item">
    <div class="editor-badge-header">
      <span class="editor-badge-icon">🛡️</span>
      <span class="editor-badge-name">${t('ed.insurance')}</span>
      <button class="editor-remove-btn" onclick="delete editorData.trip.insurance;refreshSection('badges')">✕</button>
    </div>
    <div class="editor-field"><label class="editor-label">${t('ed.label')}</label><input class="editor-input" value="${escHtml(ins.label || '')}" oninput="editorData.trip.insurance.label=this.value"></div>
    ${certsHTML}
    <button class="editor-add-btn" onclick="editorData.trip.insurance.certificates=editorData.trip.insurance.certificates||[];editorData.trip.insurance.certificates.push({flag:'',file:'',title:''});refreshSection('badges')">${t('ed.addCertificate')}</button>
  </div>`;
}

function renderCustomsEditor(tp) {
  if (!tp.customs) return '';
  const cus = tp.customs;
  const docsHTML = (cus.documents || []).map((d, i) => `
    <div class="editor-badge-sub-item">
      <input class="editor-inline-input flag-input" value="${d.flag || ''}" oninput="editorData.trip.customs.documents[${i}].flag=this.value" placeholder="🏳️">
      <input class="editor-inline-input" style="flex:1" value="${escHtml(d.title || '')}" oninput="editorData.trip.customs.documents[${i}].title=this.value" placeholder="${t('ed.title')}">
      <input class="editor-inline-input" style="flex:2" value="${escHtml(d.file || '')}" oninput="editorData.trip.customs.documents[${i}].file=this.value" placeholder="Customs/file.pdf">
      <button class="editor-remove-btn" onclick="editorData.trip.customs.documents.splice(${i},1);refreshSection('badges')">✕</button>
    </div>`).join('');

  return `<div class="editor-badge-item">
    <div class="editor-badge-header">
      <span class="editor-badge-icon">🛃</span>
      <span class="editor-badge-name">${t('ed.customs')}</span>
      <button class="editor-remove-btn" onclick="delete editorData.trip.customs;refreshSection('badges')">✕</button>
    </div>
    <div class="editor-field"><label class="editor-label">${t('ed.label')}</label><input class="editor-input" value="${escHtml(cus.label || '')}" oninput="editorData.trip.customs.label=this.value"></div>
    ${docsHTML}
    <button class="editor-add-btn" onclick="editorData.trip.customs.documents=editorData.trip.customs.documents||[];editorData.trip.customs.documents.push({flag:'',file:'',title:''});refreshSection('badges')">${t('ed.addDocument')}</button>
  </div>`;
}

function renderCustomBadgeEditor(b, idx) {
  const isSimple = b.type === 'simple';
  let itemsHTML = '';
  if (!isSimple) {
    itemsHTML = (b.items || []).map((item, ii) => `
      <div class="editor-badge-sub-item">
        <input class="editor-inline-input flag-input" value="${item.flag || ''}" oninput="editorData.trip.customBadges[${idx}].items[${ii}].flag=this.value" placeholder="🏳️">
        <input class="editor-inline-input" style="flex:1" value="${escHtml(item.title || '')}" oninput="editorData.trip.customBadges[${idx}].items[${ii}].title=this.value" placeholder="${t('ed.title')}">
        <input class="editor-inline-input" style="flex:2" value="${escHtml(item.file || '')}" oninput="editorData.trip.customBadges[${idx}].items[${ii}].file=this.value" placeholder="folder/file.pdf">
        <button class="editor-remove-btn" onclick="editorData.trip.customBadges[${idx}].items.splice(${ii},1);refreshSection('badges')">✕</button>
      </div>`).join('');
  }

  return `<div class="editor-badge-item">
    <div class="editor-badge-header">
      <input class="editor-inline-input" style="width:40px;text-align:center;font-size:1rem" value="${b.icon || ''}" oninput="editorData.trip.customBadges[${idx}].icon=this.value" placeholder="📌">
      <input class="editor-inline-input" style="flex:1;font-weight:600" value="${escHtml(b.label || '')}" oninput="editorData.trip.customBadges[${idx}].label=this.value" placeholder="${t('ed.badgeName')}">
      <button class="editor-remove-btn" onclick="editorData.trip.customBadges.splice(${idx},1);refreshSection('badges')">✕</button>
    </div>
    <div class="editor-row">
      <div class="editor-field"><label class="editor-label">${t('ed.borderColor')}</label>
        <input type="color" class="editor-color-input" value="${b.borderColor || '#32333f'}" oninput="editorData.trip.customBadges[${idx}].borderColor=this.value">
      </div>
      <div class="editor-field"><label class="editor-label">${t('ed.type')}</label>
        <select class="editor-select" onchange="editorData.trip.customBadges[${idx}].type=this.value;refreshSection('badges')">
          <option value="simple" ${isSimple ? 'selected' : ''}>${t('ed.simpleType')}</option>
          <option value="multi" ${!isSimple ? 'selected' : ''}>${t('ed.multiType')}</option>
        </select>
      </div>
    </div>
    ${isSimple ? `
      <div class="editor-row">
        <div class="editor-field"><label class="editor-label">${t('ed.price')}</label><input class="editor-input" value="${escHtml(b.price || '')}" oninput="editorData.trip.customBadges[${idx}].price=this.value" placeholder="€10.00"></div>
        <div class="editor-field"><label class="editor-label">${t('ed.status')}</label>
          <select class="editor-select" onchange="editorData.trip.customBadges[${idx}].status=this.value">
            <option value="paid" ${b.status === 'paid' ? 'selected' : ''}>${t('ed.paidOpt')}</option>
            <option value="unpaid" ${b.status === 'unpaid' ? 'selected' : ''}>${t('ed.unpaidOpt')}</option>
            <option value="" ${!b.status ? 'selected' : ''}>${t('ed.noneOpt')}</option>
          </select>
        </div>
      </div>
      <div class="editor-field"><label class="editor-label">${t('ed.file')}</label><input class="editor-input" value="${escHtml(b.file || '')}" oninput="editorData.trip.customBadges[${idx}].file=this.value" placeholder="Other/file.pdf"></div>
    ` : `
      ${itemsHTML}
      <button class="editor-add-btn" onclick="editorData.trip.customBadges[${idx}].items=editorData.trip.customBadges[${idx}].items||[];editorData.trip.customBadges[${idx}].items.push({flag:'',file:'',title:''});refreshSection('badges')">${t('ed.addItem')}</button>
    `}
  </div>`;
}

function edAddEsim() {
  editorData.trip.esim = { label: '', price: '', status: 'paid', file: '' };
  refreshSection('badges');
}
function edAddInsurance() {
  editorData.trip.insurance = { label: t('default.travelInsurance'), certificates: [] };
  refreshSection('badges');
}
function edAddCustoms() {
  editorData.trip.customs = { label: t('default.customs'), documents: [] };
  refreshSection('badges');
}
function edAddCustomBadge() {
  editorData.trip.customBadges = editorData.trip.customBadges || [];
  editorData.trip.customBadges.push({ icon: '📌', label: '', borderColor: '#32333f', type: 'multi', items: [] });
  refreshSection('badges');
}

// ─── Days Section ───

function renderDaysSection() {
  const days = editorData.days || [];
  const disabled = !hasRouteStopWithCity();
  const dayItems = days.map((d, i) => renderDayItem(d, i)).join('');
  return `
  <div class="editor-section${disabled ? ' editor-section-disabled' : ''}">
    <div class="editor-section-header" onclick="${disabled ? '' : 'toggleEditorSection(this)'}" ${disabled ? `title="${t('ed.routeRequired')}"` : ''}>
      <span class="editor-section-chevron">▶</span>
      <span class="editor-section-title">${t('ed.days')}</span>
      <span class="editor-section-badge">${days.length} ${t('sub.days')}</span>
      ${disabled ? `<span class="editor-section-hint">${t('ed.defineRouteFirst')}</span>` : ''}
    </div>
    <div class="editor-section-body" id="ed-days-body">
      <div class="editor-sort-bar">
        <span class="editor-sort-label">${t('ed.sortDays')}</span>
        <button class="editor-sort-btn" onclick="edSortDays('date-asc')">${t('ed.dateAsc')}</button>
        <button class="editor-sort-btn" onclick="edSortDays('date-desc')">${t('ed.dateDesc')}</button>
      </div>
      ${dayItems}
      <button class="editor-add-btn" onclick="edAddDay()">${t('ed.addDay')}</button>
    </div>
  </div>`;
}

function renderDayItem(day, idx) {
  let cityPart = `${day.flag || ''} ${day.city || t('ed.unknownCity')}`;
  if (day.dayTrip && day.parentCity) cityPart += ` \u2190 ${day.parentCity}`;
  const label = `${day.date || t('ed.newDay')} \u00B7 ${cityPart}`;
  const cardCount = (day.cards || []).length;
  const foodCount = (day.food || []).length;

  return `
  <div class="editor-day-item" id="ed-day-${idx}">
    <div class="editor-day-header" onclick="toggleEditorDay(this)">
      <span class="editor-day-chevron">▶</span>
      <span class="editor-day-title">${escHtml(label)}</span>
      <span class="editor-section-badge">${cardCount} ${t('ed.cards')}</span>
      <div class="editor-day-actions" onclick="event.stopPropagation()">
        <button class="editor-move-btn" onclick="edMoveDay(${idx},-1)" title="${t('ed.moveUp')}">↑</button>
        <button class="editor-move-btn" onclick="edMoveDay(${idx},1)" title="${t('ed.moveDown')}">↓</button>
        <button class="editor-remove-btn" onclick="edRemoveDay(${idx})" title="${t('ed.remove')}">✕</button>
      </div>
    </div>
    <div class="editor-day-body" id="ed-day-body-${idx}">
      ${renderDayFields(day, idx)}
    </div>
  </div>`;
}

function renderDayFields(day, idx) {
  const isTransport = ['flight', 'transit', 'bus', 'ferry', 'taxi'];

  // Build card type select options (including custom types)
  const allTypes = getCardTypesWithCustom();
  const typeOptions = allTypes.map(g =>
    `<optgroup label="${g.group}">${g.items.map(ti => `<option value="${ti.value}">${ti.icon} ${ti.label}</option>`).join('')}</optgroup>`
  ).join('') + `<option value="__custom__">\u270F\uFE0F ${t('ed.customOpt')}</option>`;

  // Build city select options from route
  const routeCities = getRouteCities();
  const selectedCity = day.dayTrip ? (day.parentCity || '') : (day.city || '');
  const selectedFlag = day.flag || '';
  const selectedKey = selectedFlag + '::' + selectedCity;
  let cityOptions = routeCities.map(rc => {
    const key = rc.flag + '::' + rc.city;
    const sel = selectedKey === key ? ' selected' : '';
    return `<option value="${escHtml(key)}"${sel} data-color="${rc.color}">${rc.flag} ${escHtml(rc.city)}</option>`;
  }).join('');
  // Show orphaned city if not in route
  if (selectedCity && !routeCities.find(c => c.flag === selectedFlag && c.city === selectedCity)) {
    cityOptions = `<option value="${escHtml(selectedKey)}" selected>\u26A0\uFE0F ${escHtml(selectedCity)} (${t('ed.notInRoute')})</option>` + cityOptions;
  }
  const currentColor = day.color || '#aaaaaa';

  // ── Day basic fields ──
  let html = `
    <div class="editor-row">
      <div class="editor-field" style="flex:2">
        <label class="editor-label">${day.dayTrip ? t('ed.baseCity') : t('ed.city')}</label>
        <div class="editor-city-select-wrap">
          <span class="editor-city-dot" style="background:${currentColor}"></span>
          <select class="editor-select editor-city-select" onchange="edSelectDayCity(${idx},this.value)">
            <option value="">${t('ed.selectCity')}</option>
            ${cityOptions}
          </select>
        </div>
      </div>
      <div class="editor-field" style="flex:1">
        <label class="editor-label">${t('ed.date')}</label>
        <input type="date" class="editor-input" value="${day.dateISO || ''}" onchange="edSetDayDate(${idx},this.value)">
      </div>
    </div>
    <div class="editor-row">
      <div class="editor-field">
        <label class="editor-label" style="display:flex;align-items:center;gap:6px">
          <input type="checkbox" ${day.dayTrip ? 'checked' : ''} onchange="edToggleDayTrip(${idx},this.checked)"> ${t('ed.dayTrip')}
        </label>
      </div>
      ${day.dayTrip ? `<div class="editor-field"><label class="editor-label">${t('ed.destination')}</label><input class="editor-input" value="${escHtml(day.city || '')}" oninput="editorData.days[${idx}].city=this.value" placeholder="${t('ph.nara')}"></div>` : ''}
    </div>`;

  // ── Food ──
  html += `<div class="editor-subsection">
    <div class="editor-subsection-header">
      <span class="editor-subsection-title">${t('ed.foodTips')}</span>
      <span class="editor-subsection-count">${(day.food || []).length}</span>
    </div>`;
  (day.food || []).forEach((f, fi) => {
    const foodEmojiOpts = EMOJI_PALETTES.food.map(e => `<option value="${e}" ${f.e === e ? 'selected' : ''}>${e}</option>`).join('');
    html += `<div class="editor-food-row">
      <select class="editor-emoji-select" onchange="edEmojiSelect(this,'editorData.days[${idx}].food[${fi}].e',${idx})">
        <option value="">---</option>
        ${foodEmojiOpts}
        <option value="__custom__" ${f.e && !EMOJI_PALETTES.food.includes(f.e) ? 'selected' : ''}>${f.e && !EMOJI_PALETTES.food.includes(f.e) ? f.e + ' ' : ''}${t('ed.customOpt')}</option>
      </select>
      <div style="flex:1;display:flex;flex-direction:column;gap:4px">
        <input class="editor-inline-input" value="${escHtml(f.dish || '')}" oninput="editorData.days[${idx}].food[${fi}].dish=this.value" placeholder="${t('ed.dishName')}">
        <input class="editor-inline-input" value="${escHtml(f.desc || '')}" oninput="editorData.days[${idx}].food[${fi}].desc=this.value" placeholder="${t('ed.description')}" style="font-size:0.75rem;color:var(--muted)">
      </div>
      <button class="editor-remove-btn" onclick="editorData.days[${idx}].food.splice(${fi},1);refreshDayBody(${idx})">✕</button>
    </div>`;
  });
  html += `<button class="editor-add-btn" onclick="editorData.days[${idx}].food=editorData.days[${idx}].food||[];editorData.days[${idx}].food.push({e:'',dish:'',desc:''});refreshDayBody(${idx})">${t('ed.addFoodTip')}</button>
  </div>`;

  // ── Files ──
  html += `<div class="editor-subsection">
    <div class="editor-subsection-header">
      <span class="editor-subsection-title">${t('ed.files')}</span>
      <span class="editor-subsection-count">${(day.files || []).length}</span>
    </div>`;
  (day.files || []).forEach((f, fi) => {
    const catOpts = Object.keys(CAT_LABEL).map(k => `<option value="${k}" ${f.cat === k ? 'selected' : ''}>${CAT_LABEL[k]}</option>`).join('');
    html += `<div class="editor-file-row">
      <select class="editor-inline-input" style="width:110px" onchange="editorData.days[${idx}].files[${fi}].cat=this.value">${catOpts}</select>
      <input class="editor-inline-input" style="flex:2" value="${escHtml(f.name || '')}" oninput="editorData.days[${idx}].files[${fi}].name=this.value" placeholder="${t('ed.filename')}">
      <input class="editor-inline-input" style="flex:2" value="${escHtml(f.label || '')}" oninput="editorData.days[${idx}].files[${fi}].label=this.value" placeholder="${t('ed.displayLabel')}">
      <button class="editor-add-btn" style="margin:0;padding:4px 8px;font-size:0.7rem" onclick="edPickFile(${idx},${fi})">📁</button>
      <button class="editor-remove-btn" onclick="editorData.days[${idx}].files.splice(${fi},1);refreshDayBody(${idx})">✕</button>
    </div>`;
  });
  html += `<button class="editor-add-btn" onclick="editorData.days[${idx}].files=editorData.days[${idx}].files||[];editorData.days[${idx}].files.push({cat:'other',name:'',label:''});refreshDayBody(${idx})">${t('ed.addFile')}</button>
  </div>`;

  // ── Cards ──
  html += `<div class="editor-subsection">
    <div class="editor-subsection-header">
      <span class="editor-subsection-title">${t('ed.cardsSection')}</span>
      <span class="editor-subsection-count">${(day.cards || []).length}</span>
    </div>`;

  (day.cards || []).forEach((c, ci) => {
    const meta = TYPE_META[c.type] || { color: 'var(--activity-c)', label: c.type };
    const cardLabel = c.title || (c.from && c.to ? `${c.from} → ${c.to}` : t('ed.newCard'));
    const isT = isTransport.includes(c.type);

    html += `<div class="editor-card-item" style="border-left-color:${meta.color}" id="ed-card-${idx}-${ci}">
      <div class="editor-card-header" onclick="toggleEditorCard(this)">
        <span class="editor-card-chevron">▶</span>
        <span class="editor-card-icon">${c.icon || CARD_TYPE_ICONS[c.type] || '📌'}</span>
        <span class="editor-card-title">${escHtml(cardLabel)}</span>
        <span class="editor-card-type-badge">${meta.label}</span>
        <div class="editor-card-actions" onclick="event.stopPropagation()">
          <button class="editor-move-btn" onclick="edMoveCard(${idx},${ci},-1)">↑</button>
          <button class="editor-move-btn" onclick="edMoveCard(${idx},${ci},1)">↓</button>
          <button class="editor-remove-btn" onclick="edRemoveCard(${idx},${ci})">✕</button>
        </div>
      </div>
      <div class="editor-card-body">
        ${renderCardFields(c, idx, ci, typeOptions)}
      </div>
    </div>`;
  });

  html += `<div class="editor-sort-bar">
      <span class="editor-sort-label">${t('ed.sortCards')}</span>
      <button class="editor-sort-btn" onclick="edSortCards(${idx},'time-asc')">${t('ed.timeAsc')}</button>
      <button class="editor-sort-btn" onclick="edSortCards(${idx},'time-desc')">${t('ed.timeDesc')}</button>
      <button class="editor-sort-btn" onclick="edSortCards(${idx},'type')">${t('ed.typeAsc')}</button>
      <button class="editor-sort-btn" onclick="edSortCards(${idx},'name-asc')">${t('ed.nameAsc')}</button>
      <button class="editor-sort-btn" onclick="edSortCards(${idx},'name-desc')">${t('ed.nameDesc')}</button>
    </div>
    <button class="editor-add-btn" onclick="edAddCard(${idx})">${t('ed.addCard')}</button>
  </div>`;

  return html;
}

function renderCardFields(c, dayIdx, cardIdx, typeOptions) {
  const isTransport = ['flight', 'transit', 'bus', 'ferry', 'taxi'].includes(c.type);
  const prefix = `editorData.days[${dayIdx}].cards[${cardIdx}]`;

  // Parse time: "08:00" or "08:00–12:00"
  let timeStart = '', timeEnd = '', hasEnd = false;
  if (c.time) {
    const tp = c.time.split(/[\u2013\u2014-]/);
    timeStart = (tp[0] || '').trim();
    if (tp.length > 1 && tp[1].trim()) { timeEnd = tp[1].trim(); hasEnd = true; }
  }

  // Determine icon category for emoji picker
  const iconCategory = isTransport ? 'transport'
    : ['stay','checkout'].includes(c.type) ? 'stay'
    : 'place';
  const iconPalette = EMOJI_PALETTES[iconCategory] || EMOJI_PALETTES.activity;
  const iconOpts = iconPalette.map(e => `<option value="${e}" ${c.icon === e ? 'selected' : ''}>${e}</option>`).join('');
  const isCustomIcon = c.icon && !iconPalette.includes(c.icon);

  let html = `
    <div class="editor-row">
      <div class="editor-field" style="flex:12">
        <label class="editor-label">${t('ed.type')}</label>
        <select class="editor-select" onchange="edSelectCardType(${dayIdx},${cardIdx},this.value)">${typeOptions.replace('value="' + c.type + '"', 'value="' + c.type + '" selected')}</select>
      </div>
      <div class="editor-field" style="flex:1">
        <label class="editor-label">${t('ed.icon')}</label>
        <select class="editor-emoji-select" onchange="edEmojiSelect(this,'${prefix}.icon',${dayIdx},${cardIdx})">
          <option value="">---</option>
          ${iconOpts}
          <option value="__custom__" ${isCustomIcon ? 'selected' : ''}>${isCustomIcon ? c.icon + ' ' : ''}${t('ed.customOpt')}</option>
        </select>
      </div>
    </div>
    <div class="editor-row">
      <div class="editor-field" style="flex:1">
        <label class="editor-label">${t('ed.startTime')}</label>
        <input type="time" class="editor-input editor-time-start" id="ed-ts-${dayIdx}-${cardIdx}" value="${timeStart}" onchange="edSetCardTime(${dayIdx},${cardIdx})">
      </div>
      <div class="editor-field" style="flex:1">
        <label class="editor-label">${t('ed.endTime')}</label>
        <input type="time" class="editor-input editor-time-end" value="${timeEnd}" ${!timeStart ? 'disabled' : ''} onchange="edSetCardTime(${dayIdx},${cardIdx})" style="${!timeStart ? 'opacity:0.35;' : ''}">
      </div>
    </div>
    <div class="editor-field">
      <label class="editor-label">${t('ed.title')}</label>
      <input class="editor-input" value="${escHtml(c.title || '')}" oninput="${prefix}.title=this.value" placeholder="${t('ed.cardTitle')}">
    </div>`;

  if (isTransport) {
    html += `
    <div class="editor-row">
      <div class="editor-field"><label class="editor-label">${t('ed.from')}</label><input class="editor-input" value="${escHtml(c.from || '')}" oninput="${prefix}.from=this.value" placeholder="${t('ph.fromEx')}"></div>
      <div class="editor-field"><label class="editor-label">${t('ed.to')}</label><input class="editor-input" value="${escHtml(c.to || '')}" oninput="${prefix}.to=this.value" placeholder="${t('ph.toEx')}"></div>
    </div>
    <div class="editor-field"><label class="editor-label">${t('ed.carrier')}</label><input class="editor-input" value="${escHtml(c.carrier || '')}" oninput="${prefix}.carrier=this.value" placeholder="${t('ph.carrierEx')}"></div>`;
  }

  html += `
    <div class="editor-field">
      <label class="editor-label">${t('ed.subtitleDetails')}</label>
      <input class="editor-input" value="${escHtml(c.sub || '')}" oninput="${prefix}.sub=this.value" placeholder="${t('ph.stayDetail')}">
    </div>
    ${editorData.days[dayIdx].dayTrip ? `<div class="editor-field">
      <label class="editor-label">${t('ed.cityOverride')}</label>
      <input class="editor-input" value="${escHtml(c.city || '')}" oninput="${prefix}.city=this.value" placeholder="${t('ed.cityOverrideHint')}">
    </div>` : ''}
    ${isTransport ? `<div class="editor-row">
      ${edLocField(dayIdx, cardIdx, 'mapsFrom', c.mapsFrom, '📍', t('ed.mapsDeparture'), t('ed.mapsDepartureHint'), c.from || '')}
      ${edLocField(dayIdx, cardIdx, 'mapsTo', c.mapsTo, '🏁', t('ed.mapsArrival'), t('ed.mapsArrivalHint'), c.to || '')}
    </div>` : `<div class="editor-row">
      ${edLocField(dayIdx, cardIdx, 'maps', c.maps, '📍', t('ed.mapsAddress'), t('ed.mapsHint'), c.title || '')}
    </div>`}
    <div class="editor-row">
      <div class="editor-field"><label class="editor-label">${t('ed.phone')}</label><input class="editor-input" value="${escHtml(c.phone || '')}" oninput="${prefix}.phone=this.value" placeholder="+81351557111"></div>
      <div class="editor-field"><label class="editor-label">${t('ed.email')}</label><input class="editor-input" value="${escHtml(c.email || '')}" oninput="${prefix}.email=this.value" placeholder="info@hotel.com"></div>
    </div>`;

  // ── Tags ──
  const tags = parseTags(c.tags);
  html += `<div class="editor-subsection" style="margin-top:8px;padding-top:8px">
    <div class="editor-subsection-header"><span class="editor-subsection-title">${t('ed.tags')}</span></div>`;
  tags.forEach((tg, ti) => {
    const tagTypeOpts = TAG_TYPES.map(tt => `<option value="${tt.value}" ${tg.cls === tt.value ? 'selected' : ''}>${tt.label}</option>`).join('');
    html += `<div class="editor-tag-row">
      <input class="editor-inline-input editor-tag-label" value="${escHtml(tg.label)}" oninput="edUpdateTag(${dayIdx},${cardIdx},${ti},'label',this.value)">
      <select class="editor-inline-input editor-tag-type" onchange="edUpdateTag(${dayIdx},${cardIdx},${ti},'cls',this.value)">${tagTypeOpts}</select>
      <button class="editor-remove-btn" onclick="edRemoveTag(${dayIdx},${cardIdx},${ti})">✕</button>
    </div>`;
  });
  html += `<button class="editor-add-btn" onclick="edAddTag(${dayIdx},${cardIdx})">${t('ed.addTag')}</button></div>`;

  // ── Tips ──
  const tips = c.tips || [];
  html += `<div class="editor-subsection" style="margin-top:8px;padding-top:8px">
    <div class="editor-subsection-header"><span class="editor-subsection-title">${t('ed.tips')}</span></div>`;
  tips.forEach((tip, ti) => {
    html += `<div class="editor-tip-row">
      <input class="editor-inline-input editor-tip-input" value="${escHtml(tip)}" oninput="editorData.days[${dayIdx}].cards[${cardIdx}].tips[${ti}]=this.value">
      <button class="editor-remove-btn" onclick="editorData.days[${dayIdx}].cards[${cardIdx}].tips.splice(${ti},1);refreshCardBody(${dayIdx},${cardIdx})">✕</button>
    </div>`;
  });
  html += `<button class="editor-add-btn" onclick="editorData.days[${dayIdx}].cards[${cardIdx}].tips=editorData.days[${dayIdx}].cards[${cardIdx}].tips||[];editorData.days[${dayIdx}].cards[${cardIdx}].tips.push('');refreshCardBody(${dayIdx},${cardIdx})">${t('ed.addTip')}</button></div>`;

  return html;
}

// ─── Day / Card Actions ───

function edSelectDayCity(dayIdx, compositeKey) {
  const day = editorData.days[dayIdx];
  const routeCities = getRouteCities();
  // compositeKey is "flag::city"
  const sepIdx = compositeKey.indexOf('::');
  const flag = sepIdx >= 0 ? compositeKey.substring(0, sepIdx) : '';
  const cityName = sepIdx >= 0 ? compositeKey.substring(sepIdx + 2) : compositeKey;
  const match = routeCities.find(c => c.flag === flag && c.city === cityName);

  if (day.dayTrip) {
    day.parentCity = cityName;
    if (match) { day.flag = match.flag; day.color = match.color; }
    else { day.flag = ''; day.color = '#aaaaaa'; }
  } else {
    day.city = cityName;
    if (match) { day.flag = match.flag; day.color = match.color; }
    else { day.city = ''; day.flag = ''; day.color = '#aaaaaa'; }
  }
  refreshDayBody(dayIdx);
}

function edToggleDayTrip(dayIdx, isTrip) {
  const day = editorData.days[dayIdx];
  if (isTrip) {
    day.dayTrip = true;
    day.parentCity = day.city;  // move route city to parentCity
    day.city = '';              // clear for destination
  } else {
    day.dayTrip = false;
    if (day.parentCity) day.city = day.parentCity;
    day.parentCity = '';
  }
  refreshDayBody(dayIdx);
}

function edAddDay() {
  editorData.days = editorData.days || [];
  const routeCities = getRouteCities();
  const lastDay = editorData.days.length > 0 ? editorData.days[editorData.days.length - 1] : null;
  const defaultCity = lastDay
    ? routeCities.find(c => c.city === lastDay.city && c.flag === lastDay.flag) || routeCities.find(c => c.city === lastDay.city)
    : routeCities[0];
  editorData.days.push({
    date: '',
    flag: defaultCity ? defaultCity.flag : '',
    city: defaultCity ? defaultCity.city : '',
    color: defaultCity ? defaultCity.color : '#aaaaaa',
    food: [], files: [], cards: []
  });
  refreshSection('days');
  refreshSection('trip-info');
}
function edRemoveDay(idx) {
  if (!confirm(t('ed.removeDay'))) return;
  editorData.days.splice(idx, 1);
  refreshSection('days');
  refreshSection('trip-info');
}
function edMoveDay(idx, dir) {
  const arr = editorData.days;
  const j = idx + dir;
  if (j < 0 || j >= arr.length) return;
  [arr[idx], arr[j]] = [arr[j], arr[idx]];
  refreshSection('days');
}

function edAddCard(dayIdx) {
  const day = editorData.days[dayIdx];
  day.cards = day.cards || [];
  day.cards.push({
    time: '', type: 'activity', icon: '🎯', title: '',
    sub: '', tags: [], tips: []
  });
  refreshDayBody(dayIdx);
  // Auto-open the new card
  setTimeout(() => {
    const el = document.getElementById(`ed-card-${dayIdx}-${day.cards.length - 1}`);
    if (el) { el.classList.add('open'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }, 50);
}
function edRemoveCard(dayIdx, cardIdx) {
  editorData.days[dayIdx].cards.splice(cardIdx, 1);
  refreshDayBody(dayIdx);
}
function edMoveCard(dayIdx, cardIdx, dir) {
  const arr = editorData.days[dayIdx].cards;
  const j = cardIdx + dir;
  if (j < 0 || j >= arr.length) return;
  [arr[cardIdx], arr[j]] = [arr[j], arr[cardIdx]];
  refreshDayBody(dayIdx);
}

// ─── Date helpers ───

function isoToDisplay(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return `${getDayNames()[d.getDay()]} ${d.getDate()} ${getMonthNames()[d.getMonth()]}`;
}

function displayToISO(display) {
  if (!display) return '';
  // Try parsing "Tue 28 Apr" style
  const m = display.match(/^\w+\s+(\d+)\s+(\w+)$/);
  if (m) {
    const day = parseInt(m[1]);
    let monIdx = getMonthNames().findIndex(mn => mn.toLowerCase() === m[2].toLowerCase());
    // Fallback to English month names if localized names don't match
    if (monIdx < 0) {
      const enMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      monIdx = enMonths.findIndex(mn => mn.toLowerCase() === m[2].toLowerCase());
    }
    if (monIdx >= 0) {
      const year = (editorData && editorData.trip && editorData.trip.year) ? parseInt(editorData.trip.year) : new Date().getFullYear();
      return `${year}-${String(monIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }
  return '';
}

function edSetDayDate(dayIdx, isoVal) {
  editorData.days[dayIdx].dateISO = isoVal;
  editorData.days[dayIdx].date = isoToDisplay(isoVal);
  refreshSection('trip-info');
}

// ─── Time helpers ───

function edSetCardTime(dayIdx, cardIdx) {
  const cardEl = document.getElementById(`ed-card-${dayIdx}-${cardIdx}`);
  if (!cardEl) return;
  const startEl = cardEl.querySelector('input.editor-time-start');
  const endEl   = cardEl.querySelector('input.editor-time-end');
  const start = startEl ? startEl.value : '';
  const end   = endEl   ? endEl.value   : '';
  // Enable/disable end picker based on start
  if (endEl) {
    endEl.disabled = !start;
    endEl.style.opacity = start ? '' : '0.35';
  }
  editorData.days[dayIdx].cards[cardIdx].time = (start && end) ? `${start}\u2013${end}` : start;
}

function edToggleEndTime(dayIdx, cardIdx, hasEnd) {
  // no-op: end time is now always visible, disabled when start is empty
}

// ─── Emoji selector ───

function edEmojiSelect(sel, path, dayIdx, cardIdx) {
  let emoji = sel.value;
  if (emoji === '__custom__') {
    const custom = prompt(t('ed.enterEmoji'));
    if (custom && custom.trim()) {
      emoji = custom.trim();
    } else {
      return;
    }
  }
  // Use Function constructor to set the value safely on editorData
  try { new Function('editorData', 'v', path + '=v')(editorData, emoji); } catch(e) {}
  if (typeof cardIdx !== 'undefined' && cardIdx !== null) {
    refreshCardBody(dayIdx, cardIdx);
  } else {
    refreshDayBody(dayIdx);
  }
}

// ─── Custom card type ───

function edSelectCardType(dayIdx, cardIdx, value) {
  const card = editorData.days[dayIdx].cards[cardIdx];
  if (value === '__custom__') {
    const label = prompt(t('ed.enterTypeName'));
    if (!label || !label.trim()) return;
    const icon = prompt(t('ed.enterTypeIcon')) || '📌';
    const typeValue = 'custom_' + label.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    // Store in customTypes
    editorData.trip.customTypes = editorData.trip.customTypes || [];
    if (!editorData.trip.customTypes.find(ct => ct.value === typeValue)) {
      editorData.trip.customTypes.push({ value: typeValue, label: label.trim(), icon: icon.trim() });
      // Register in TYPE_META and CARD_TYPE_ICONS
      TYPE_META[typeValue] = { color: 'var(--activity-c)', label: label.trim() };
      CARD_TYPE_ICONS[typeValue] = icon.trim();
    }
    card.type = typeValue;
    card.icon = icon.trim();
  } else {
    card.type = value;
    card.icon = CARD_TYPE_ICONS[value] || card.icon;
  }
  refreshDayBody(dayIdx);
}

// ─── Sort functions ───

function edSortDays(mode) {
  const days = editorData.days || [];
  if (mode === 'date-asc') {
    days.sort((a, b) => (a.dateISO || a.date || '').localeCompare(b.dateISO || b.date || ''));
  } else if (mode === 'date-desc') {
    days.sort((a, b) => (b.dateISO || b.date || '').localeCompare(a.dateISO || a.date || ''));
  }
  refreshSection('days');
}

function edSortCards(dayIdx, mode) {
  const cards = editorData.days[dayIdx].cards || [];
  if (mode === 'time-asc') {
    cards.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  } else if (mode === 'time-desc') {
    cards.sort((a, b) => (b.time || '').localeCompare(a.time || ''));
  } else if (mode === 'type') {
    cards.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
  } else if (mode === 'name-asc') {
    cards.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } else if (mode === 'name-desc') {
    cards.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
  }
  refreshDayBody(dayIdx);
}

// ─── Tag helpers ───

function edUpdateTag(dayIdx, cardIdx, tagIdx, field, value) {
  const card = editorData.days[dayIdx].cards[cardIdx];
  const tags = parseTags(card.tags);
  if (tags[tagIdx]) {
    tags[tagIdx][field] = value;
  }
  card.tags = tags.map(tg => `${tg.label}|${tg.cls}`);
}
function edRemoveTag(dayIdx, cardIdx, tagIdx) {
  const card = editorData.days[dayIdx].cards[cardIdx];
  const tags = parseTags(card.tags);
  tags.splice(tagIdx, 1);
  card.tags = tags.map(tg => `${tg.label}|${tg.cls}`);
  refreshCardBody(dayIdx, cardIdx);
}
function edAddTag(dayIdx, cardIdx) {
  const card = editorData.days[dayIdx].cards[cardIdx];
  const tags = parseTags(card.tags);
  tags.push({ label: '', cls: 'price' });
  card.tags = tags.map(tg => `${tg.label}|${tg.cls}`);
  refreshCardBody(dayIdx, cardIdx);
}

// ─── File picker for day files ───

function edPickFile(dayIdx, fileIdx) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf,.jpg,.jpeg,.png,.webp';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const f = editorData.days[dayIdx].files[fileIdx];
    f.name = file.name;
    if (!f.label) f.label = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    // Store in LOADED_DOCS for preview
    LOADED_DOCS.set(file.name.toLowerCase(), URL.createObjectURL(file));
    // Track for potential copy
    const folder = CAT_FOLDER[f.cat] || 'Other';
    pendingFiles.push({ file, targetPath: `${folder}/${file.name}` });
    refreshDayBody(dayIdx);
  };
  input.click();
}

// ─── Refresh helpers ───

function refreshSection(which) {
  const sectionMap = {
    'trip-info': { id: 'ed-sec-trip-info', render: renderTripInfoSection },
    'route':     { id: 'ed-sec-route',     render: renderRouteSection },
    'badges':    { id: 'ed-sec-badges',    render: renderBadgesSection },
    'days':      { id: 'ed-sec-days',      render: renderDaysSection },
  };

  const targets = which && sectionMap[which] ? [sectionMap[which]] : Object.values(sectionMap);

  for (const target of targets) {
    const container = document.getElementById(target.id);
    if (!container) continue;

    // Save open states within this section
    const wasOpen = container.querySelector('.editor-section.open') !== null;
    const openDays = new Set();
    container.querySelectorAll('.editor-day-item.open').forEach(d => openDays.add(d.id));
    const openCards = new Set();
    container.querySelectorAll('.editor-card-item.open').forEach(c => openCards.add(c.id));

    // Re-render only this section
    container.innerHTML = target.render();

    // Restore open states
    if (wasOpen) {
      const sec = container.querySelector('.editor-section');
      if (sec) sec.classList.add('open');
    }
    container.querySelectorAll('.editor-day-item').forEach(d => {
      if (openDays.has(d.id)) d.classList.add('open');
    });
    container.querySelectorAll('.editor-card-item').forEach(c => {
      if (openCards.has(c.id)) c.classList.add('open');
    });
  }
}

function refreshDayBody(dayIdx) {
  const dayBody = document.getElementById(`ed-day-body-${dayIdx}`);
  if (!dayBody) { refreshSection('days'); return; }

  // Save open card states
  const openCards = new Set();
  dayBody.querySelectorAll('.editor-card-item.open').forEach(c => openCards.add(c.id));

  const day = editorData.days[dayIdx];
  dayBody.innerHTML = renderDayFields(day, dayIdx);

  // Update the day header title
  const dayItem = document.getElementById(`ed-day-${dayIdx}`);
  if (dayItem) {
    const titleEl = dayItem.querySelector('.editor-day-title');
    if (titleEl) {
      let _cp = `${day.flag || ''} ${day.city || t('ed.unknownCity')}`;
      if (day.dayTrip && day.parentCity) _cp += ` \u2190 ${day.parentCity}`;
      titleEl.textContent = `${day.date || t('ed.newDay')} \u00B7 ${_cp}`;
    }
  }

  // Restore open cards
  dayBody.querySelectorAll('.editor-card-item').forEach(c => {
    if (openCards.has(c.id)) c.classList.add('open');
  });
}

function refreshCardBody(dayIdx, cardIdx) {
  const cardEl = document.getElementById(`ed-card-${dayIdx}-${cardIdx}`);
  if (!cardEl) { refreshDayBody(dayIdx); return; }
  const body = cardEl.querySelector('.editor-card-body');
  if (!body) return;
  const card = editorData.days[dayIdx].cards[cardIdx];
  const allTypes = getCardTypesWithCustom();
  const typeOptions = allTypes.map(g =>
    `<optgroup label="${g.group}">${g.items.map(ti => `<option value="${ti.value}">${ti.icon} ${ti.label}</option>`).join('')}</optgroup>`
  ).join('') + `<option value="__custom__">\u270F\uFE0F ${t('ed.customOpt')}</option>`;
  body.innerHTML = renderCardFields(card, dayIdx, cardIdx, typeOptions);
}

// ─── Toggle helpers ───

function toggleEditorDay(header) {
  header.closest('.editor-day-item').classList.toggle('open');
}

function toggleEditorCard(header) {
  header.closest('.editor-card-item').classList.toggle('open');
}

// ─── Location search field helpers ───

function edLocField(dayIdx, cardIdx, field, val, icon, label, hint, suggestQuery) {
  const qId = `loc-q-${field}-${dayIdx}-${cardIdx}`;
  const rId = `loc-r-${field}-${dayIdx}-${cardIdx}`;
  const hasVal = val && typeof val === 'object' && val.lat;
  const locLabel = hasVal ? (val.label || `${val.lat}, ${val.lng}`) : '';
  const defaultSearch = hasVal ? locLabel.split(',')[0] : suggestQuery;

  const currentHTML = hasVal
    ? `<div class="editor-loc-current">
        <span class="editor-loc-name">${escHtml(locLabel.split(',').slice(0, 2).join(','))}</span>
        <span class="editor-loc-coord">${val.lat.toFixed(4)}, ${val.lng.toFixed(4)}</span>
        <button class="editor-loc-clear" onclick="edClearLocation(${dayIdx},${cardIdx},'${field}')" title="${t('ed.locClear')}">✕</button>
      </div>`
    : '';

  return `<div class="editor-field">
    <label class="editor-label">${icon} ${label}</label>
    <div class="editor-loc-wrap" id="loc-${field}-${dayIdx}-${cardIdx}">
      ${currentHTML}
      <div class="editor-loc-input-row">
        <input class="editor-input editor-loc-query" id="${qId}"
          value="${escHtml(defaultSearch)}" placeholder="${hint}"
          onkeydown="if(event.key==='Enter'){event.preventDefault();edSearchLocation(${dayIdx},${cardIdx},'${field}',this.value)}">
        <button class="editor-loc-search-btn" onclick="edSearchLocation(${dayIdx},${cardIdx},'${field}',document.getElementById('${qId}').value)" title="${t('ed.locSearch')}">🔍</button>
      </div>
      <div class="editor-loc-results" id="${rId}"></div>
    </div>
  </div>`;
}

let _locSearchResults = [];

async function edSearchLocation(dayIdx, cardIdx, field, query) {
  const rId = `loc-r-${field}-${dayIdx}-${cardIdx}`;
  const resultsEl = document.getElementById(rId);
  if (!resultsEl || !query.trim()) return;

  // Direct coordinate input (e.g., "35.7148, 139.7967")
  const coordMatch = query.match(/^\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]), lng = parseFloat(coordMatch[2]);
    edSelectLocation(dayIdx, cardIdx, field, lat, lng, `${lat}, ${lng}`);
    resultsEl.innerHTML = '';
    return;
  }

  resultsEl.innerHTML = `<div class="editor-loc-loading">${t('ed.locSearching')}</div>`;

  try {
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=en`, {
      headers: { 'Accept-Language': 'en' }
    });
    const data = await resp.json();

    if (!data.length) {
      resultsEl.innerHTML = `<div class="editor-loc-empty">${t('ed.locNoResults')}</div>`;
      return;
    }

    _locSearchResults = data.map(r => ({
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      label: r.display_name
    }));

    resultsEl.innerHTML = _locSearchResults.map((r, i) =>
      `<div class="editor-loc-result" onclick="edPickResult(${dayIdx},${cardIdx},'${field}',${i})">
        <span class="editor-loc-result-name">${escHtml(r.label.split(',').slice(0, 3).join(','))}</span>
        <span class="editor-loc-result-coord">${r.lat.toFixed(4)}, ${r.lng.toFixed(4)}</span>
      </div>`
    ).join('');
  } catch {
    resultsEl.innerHTML = `<div class="editor-loc-empty">${t('ed.locSearchFailed')}</div>`;
  }
}

function edPickResult(dayIdx, cardIdx, field, idx) {
  const r = _locSearchResults[idx];
  if (!r) return;
  edSelectLocation(dayIdx, cardIdx, field, r.lat, r.lng, r.label);
}

function edSelectLocation(dayIdx, cardIdx, field, lat, lng, label) {
  editorData.days[dayIdx].cards[cardIdx][field] = {
    lat: Math.round(lat * 1e6) / 1e6,
    lng: Math.round(lng * 1e6) / 1e6,
    label: label
  };

  // Update UI in-place
  const wrapId = `loc-${field}-${dayIdx}-${cardIdx}`;
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;

  let cur = wrap.querySelector('.editor-loc-current');
  if (!cur) {
    cur = document.createElement('div');
    cur.className = 'editor-loc-current';
    wrap.insertBefore(cur, wrap.firstChild);
  }
  cur.innerHTML = `
    <span class="editor-loc-name">${escHtml(label.split(',').slice(0, 2).join(','))}</span>
    <span class="editor-loc-coord">${lat.toFixed(4)}, ${lng.toFixed(4)}</span>
    <button class="editor-loc-clear" onclick="edClearLocation(${dayIdx},${cardIdx},'${field}')" title="${t('ed.locClear')}">✕</button>`;

  const results = wrap.querySelector('.editor-loc-results');
  if (results) results.innerHTML = '';
}

function edClearLocation(dayIdx, cardIdx, field) {
  delete editorData.days[dayIdx].cards[cardIdx][field];
  const wrapId = `loc-${field}-${dayIdx}-${cardIdx}`;
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  const cur = wrap.querySelector('.editor-loc-current');
  if (cur) cur.remove();
}
