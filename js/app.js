/* ══════════════════════════════════════════
   TRIP PLANNER — App / State / Init
══════════════════════════════════════════ */

// ─── Global State ───
let TRIP_CONFIG = null;
let DAYS = [];
let ATTACHMENTS_BASE = '';

// Document storage – maps filename to blob URL
const LOADED_DOCS = new Map();
let ALL_REQUIRED_FILES = [];
let JSON_DIR_HANDLE = null;

// ─── File Picker ───
const FOLDER_PICKER_SUPPORTED = 'showDirectoryPicker' in window;

function initApp() {
  const pickerView   = document.getElementById('picker-view');
  const tripView     = document.getElementById('trip-view');
  const pickerBox    = document.getElementById('picker-box');
  const fileInput    = document.getElementById('file-input');
  const fileInputDir = document.getElementById('file-input-dir');
  const loadSampleBtn = document.getElementById('load-sample');
  const newTripBtn   = document.getElementById('new-trip-btn');
  const changeTripBtn = document.getElementById('change-trip-btn');
  const editTripBtn  = document.getElementById('edit-trip-btn');
  const loadDocsBtn  = document.getElementById('load-docs-btn');
  const docsInput    = document.getElementById('docs-input');
  const docsPanel    = document.getElementById('docs-panel');
  const docsList     = document.getElementById('docs-list');
  const selectFolderBtn = document.getElementById('select-folder-btn');
  const selectFilesBtn  = document.getElementById('select-files-btn');

  // ── Set emoji text content (avoids encoding issues with static HTML) ──
  document.getElementById('picker-icon').textContent        = '\u{1F4C1}';
  document.getElementById('editor-toolbar-icon').textContent = '\u270F\uFE0F';

  // Initialize type labels from saved language (must run after utils.js loaded)
  refreshTypeLabels();

  // Apply all translatable text
  applyPickerTranslations();

  // Initialize settings bar toggles from saved prefs
  initSettingsBar();

  // ── Picker click ──
  pickerBox.addEventListener('click', async () => {
    if (FOLDER_PICKER_SUPPORTED) {
      try {
        const dirHandle = await window.showDirectoryPicker();
        await loadTripFromFolder(dirHandle);
        return;
      } catch (e) {
        if (e.name === 'AbortError') return;
        console.log('Folder picker failed, falling back');
      }
    }
    fileInputDir.click();
  });

  pickerBox.addEventListener('dragover', e => { e.preventDefault(); pickerBox.classList.add('dragover'); });
  pickerBox.addEventListener('dragleave', () => pickerBox.classList.remove('dragover'));
  pickerBox.addEventListener('drop', e => {
    e.preventDefault();
    pickerBox.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) loadFileAndTryAutoLoadDocs(file);
  });

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) loadFileAndTryAutoLoadDocs(file);
  });

  fileInputDir.addEventListener('change', e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    loadTripFromFileList(files);
  });

  loadSampleBtn.addEventListener('click', loadSampleTrip);
  newTripBtn.addEventListener('click', () => {
    // Show trip view (empty) and open editor from scratch
    pickerView.classList.add('hidden');
    tripView.classList.remove('hidden');
    document.getElementById('trip-header').innerHTML = '';
    document.getElementById('trip-legend').innerHTML = '';
    document.getElementById('timeline').innerHTML = '';
    loadDocsBtn.style.display = 'none';
    openEditor(true);
  });

  changeTripBtn.addEventListener('click', () => {
    pickerView.classList.remove('hidden');
    tripView.classList.add('hidden');
    fileInput.value = '';
    fileInputDir.value = '';
    closeDocsPanel();
    LOADED_DOCS.forEach(url => URL.revokeObjectURL(url));
    LOADED_DOCS.clear();
    ALL_REQUIRED_FILES = [];
    JSON_DIR_HANDLE = null;
  });

  editTripBtn.addEventListener('click', () => openEditor(false));

  // ── Document loading ──
  loadDocsBtn.addEventListener('click', () => {
    if (docsPanel.classList.contains('hidden')) {
      renderDocsList();
      docsPanel.classList.remove('hidden');
    } else {
      docsPanel.classList.add('hidden');
    }
  });

  const docsDirInput = document.createElement('input');
  docsDirInput.type = 'file';
  docsDirInput.setAttribute('webkitdirectory', '');
  docsDirInput.style.display = 'none';
  document.body.appendChild(docsDirInput);

  selectFolderBtn.addEventListener('click', async () => {
    if (FOLDER_PICKER_SUPPORTED) {
      try {
        const dirHandle = await window.showDirectoryPicker();
        JSON_DIR_HANDLE = dirHandle;
        await loadDocsFromFolder(dirHandle);
        updateDocsButtonState();
        renderDocsList();
      } catch (e) {
        if (e.name !== 'AbortError') console.log('Folder picker error:', e);
      }
    } else {
      docsDirInput.click();
    }
  });

  docsDirInput.addEventListener('change', e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const docEntries = files.map(file => ({
      file,
      relPath: file.webkitRelativePath
        ? file.webkitRelativePath.split('/').slice(1).join('/')
        : file.name
    }));
    loadDocsFromFileList(docEntries);
    updateDocsButtonState();
    renderDocsList();
  });

  selectFilesBtn.addEventListener('click', () => docsInput.click());
  docsInput.addEventListener('change', e => {
    const files = e.target.files;
    if (files.length) {
      loadDocsFromFiles(files);
      updateDocsButtonState();
      renderDocsList();
    }
  });

  // ── Overlay click-to-close ──
  document.getElementById('card-overlay').addEventListener('click', function () {
    if (expandedCard) {
      expandedCard.classList.remove('expanded');
      expandedCard = null;
      this.classList.remove('active');
    }
  });
}

// ─── Folder/File Loaders ───

async function loadTripFromFolder(dirHandle) {
  JSON_DIR_HANDLE = dirHandle;
  let jsonFile = null, jsonFileName = null;

  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.json')) {
      const name = entry.name.toLowerCase();
      if (!jsonFile || name.includes('trip') || name.includes('config')) {
        jsonFile = await entry.getFile();
        jsonFileName = entry.name;
      }
    }
  }

  if (!jsonFile) {
    alert(t('alert.noJson'));
    return;
  }

  const text = await jsonFile.text();
  let data;
  try { data = JSON.parse(text); } catch (err) { alert(t('alert.invalidJson') + ' ' + jsonFileName + ': ' + err.message); return; }

  initTrip(data);

  if (ALL_REQUIRED_FILES.length > 0) {
    await loadDocsFromFolder(dirHandle);
    updateDocsButtonState();
  }
}

function loadTripFromFileList(files) {
  let jsonFile = null, jsonRelPath = '';
  const docFiles = [];

  for (const file of files) {
    const relPath = file.webkitRelativePath
      ? file.webkitRelativePath.split('/').slice(1).join('/')
      : file.name;
    if (file.name.toLowerCase().endsWith('.json')) {
      const name = file.name.toLowerCase();
      if (!jsonFile || name.includes('trip') || name.includes('config')) {
        if (jsonFile) docFiles.push({ file: jsonFile, relPath: jsonRelPath });
        jsonFile = file;
        jsonRelPath = relPath;
      } else {
        docFiles.push({ file, relPath });
      }
    } else {
      docFiles.push({ file, relPath });
    }
  }

  if (!jsonFile) {
    alert(t('alert.noJson'));
    return;
  }

  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      initTrip(data);
      if (docFiles.length > 0) {
        loadDocsFromFileList(docFiles);
        updateDocsButtonState();
      }
    } catch (err) { alert(t('alert.invalidJson') + ' ' + jsonFile.name + ': ' + err.message); }
  };
  reader.readAsText(jsonFile);
}

async function loadFileAndTryAutoLoadDocs(file) {
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const data = JSON.parse(e.target.result);
      initTrip(data);
      if (JSON_DIR_HANDLE && ALL_REQUIRED_FILES.length > 0) {
        try { await loadDocsFromFolder(JSON_DIR_HANDLE); updateDocsButtonState(); } catch (err) {}
      }
    } catch (err) { alert(t('alert.invalidFile') + ' ' + err.message); }
  };
  reader.readAsText(file);
}

// ─── Doc Loaders ───

async function loadDocsFromFolder(dirHandle, path) {
  path = path || '';
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      const file = await entry.getFile();
      const key = path ? `${path}/${entry.name}` : entry.name;
      LOADED_DOCS.set(entry.name.toLowerCase(), URL.createObjectURL(file));
      LOADED_DOCS.set(key.toLowerCase(), URL.createObjectURL(file));
    } else if (entry.kind === 'directory') {
      await loadDocsFromFolder(entry, path ? `${path}/${entry.name}` : entry.name);
    }
  }
}

function loadDocsFromFiles(files) {
  for (const file of files) {
    const url = URL.createObjectURL(file);
    LOADED_DOCS.set(file.name.toLowerCase(), url);
    if (file.webkitRelativePath) {
      const relPath = file.webkitRelativePath.split('/').slice(1).join('/');
      if (relPath) LOADED_DOCS.set(relPath.toLowerCase(), url);
    }
  }
}

function loadDocsFromFileList(entries) {
  for (const { file, relPath } of entries) {
    const url = URL.createObjectURL(file);
    LOADED_DOCS.set(file.name.toLowerCase(), url);
    if (relPath) LOADED_DOCS.set(relPath.toLowerCase(), url);
  }
}

function renderDocsList() {
  const docsList = document.getElementById('docs-list');
  if (!ALL_REQUIRED_FILES.length) {
    docsList.innerHTML = `<div style="padding:16px;text-align:center;color:var(--muted)">${t('docs.none')}</div>`;
    return;
  }

  const items = ALL_REQUIRED_FILES.map(filepath => {
    const isLoaded = !!getDocUrl(filepath);
    const basename = filepath.split('/').pop();
    const folder = filepath.includes('/') ? filepath.split('/')[0] : '';
    return `
      <div class="doc-item ${isLoaded ? 'loaded' : 'missing'}" onclick="clickDocItem('${filepath.replace(/'/g, "\\'")}', ${isLoaded})">
        <span class="doc-status">${isLoaded ? '✓' : '○'}</span>
        <span class="doc-name" title="${basename}">${basename}</span>
        ${folder ? `<span class="doc-folder">${folder}</span>` : ''}
      </div>`;
  }).join('');

  const loadedCount = ALL_REQUIRED_FILES.filter(f => getDocUrl(f)).length;
  const summary = `<div style="padding:8px 10px;font-size:0.72rem;color:var(--muted);border-bottom:1px solid var(--border)">
    ${loadedCount}/${ALL_REQUIRED_FILES.length} ${t('docs.loaded')}
  </div>`;

  docsList.innerHTML = summary + items;
}

function clickDocItem(filepath, isLoaded) {
  if (isLoaded) {
    openDoc(filepath);
  } else {
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = '.pdf,.jpg,.jpeg,.png,.webp';
    tempInput.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        const basename = filepath.split('/').pop();
        LOADED_DOCS.set(file.name.toLowerCase(), URL.createObjectURL(file));
        LOADED_DOCS.set(basename.toLowerCase(), URL.createObjectURL(file));
        updateDocsButtonState();
        renderDocsList();
      }
    };
    tempInput.click();
  }
}

function updateDocsButtonState() {
  const loadDocsBtn = document.getElementById('load-docs-btn');
  const total = ALL_REQUIRED_FILES.length;
  if (total === 0) {
    loadDocsBtn.textContent = `\uD83D\uDCCE ${t('docs.noDocs')}`;
    loadDocsBtn.style.borderColor = 'var(--border2)';
    loadDocsBtn.style.color = 'var(--muted)';
  } else {
    const matched = ALL_REQUIRED_FILES.filter(f => getDocUrl(f)).length;
    if (matched >= total) {
      loadDocsBtn.textContent = `\uD83D\uDCCE ${total} ${t('docs.allLoaded')}`;
      loadDocsBtn.style.borderColor = '#6fcf97';
      loadDocsBtn.style.color = '#6fcf97';
    } else if (matched === 0) {
      loadDocsBtn.textContent = `\uD83D\uDCCE ${t('docs.load')} ${total} ${total > 1 ? t('docs.docs') : t('docs.doc')}`;
      loadDocsBtn.style.borderColor = '#e8a85a';
      loadDocsBtn.style.color = '#e8a85a';
    } else {
      loadDocsBtn.textContent = `\uD83D\uDCCE ${matched}/${total}`;
      loadDocsBtn.style.borderColor = '#e8a85a';
      loadDocsBtn.style.color = '#e8a85a';
    }
  }
}

function closeDocsPanel() {
  document.getElementById('docs-panel').classList.add('hidden');
}

// ─── Sample Trip ───

function loadSampleTrip() {
  const sampleData = {
    trip: {
      title: "East Asia",
      year: "2026",
      subtitle: "28 April – 22 May · 25 days · 6 cities",
      route: [
        { flag: "🇩🇪", city: "Berlin" },
        { flag: "🇨🇳", city: "Joshland" },
      ]
    },
    attachmentsBasePath: "",
    days: [
      {
        date: "Wed 29 Apr", flag: "🇯🇵", city: "Joshland", color: "#e94560",
        food: [],
        files: [],
        cards: [
          {
            time: "Check-in 15:00", type: "stay", icon: "🏨",
            title: "Hotel Stay Well",
            sub: "Double Room – Non Smoking · 5 nights",
            tags: ["€349.40|price", "Paid|paid"],
            maps: "Stay Well, Ballard, Joshland",
            phone: "+81351557111",
            tips: ["Great location: nightlife at doorstep."]
          }
        ]
      },
      {
        date: "Thu 30 Apr", flag: "🇯🇵", city: "Tokyo", color: "#e94560",
        food: [
          { e: "🍡", dish: "Taiyaki & Street Sweets", desc: "Nakamise Street — grab taiyaki (fish-shaped waffles)." },
          { e: "🍣", dish: "Sushi", desc: "Tsukiji Outer Market is a short detour — fresh nigiri." }
        ],
        cards: [
          {
            time: "08:00–09:30", type: "temple", icon: "⛩️",
            title: "Senso-ji", sub: "Temple visit",
            maps: "Senso-ji Temple, Asakusa, Tokyo",
            tips: ["Arrive before 9am to beat crowds.", "Pull an omikuji fortune slip — ¥100."]
          },
          {
            time: "10:00–12:30", type: "viewpoint", icon: "🗼",
            title: "Tokyo Skytree", tags: ["€9.66|price"],
            maps: "Tokyo Skytree, Sumida, Tokyo",
            tips: ["Book Tembo Deck online to skip queues."]
          },
          {
            time: "18:00–21:00", type: "nightlife", icon: "🍻",
            title: "Dinner · Ueno",
            maps: "Ueno, Taito, Tokyo",
            tips: ["Try the izakaya alleys east of the station."]
          }
        ]
      }
    ]
  };
  initTrip(sampleData);
}

// ─── Init Trip ───

function initTrip(data) {
  // Reset expansion state from previous render
  if (expandedCard) { expandedCard.classList.remove('expanded'); expandedCard = null; }
  document.getElementById('card-overlay').classList.remove('active');

  TRIP_CONFIG = data.trip || {};
  DAYS = data.days || [];
  ATTACHMENTS_BASE = data.attachmentsBasePath || '';

  populateCityColors(DAYS);
  ALL_REQUIRED_FILES = collectAllFiles(data);

  document.getElementById('picker-view').classList.add('hidden');
  document.getElementById('trip-view').classList.remove('hidden');

  const loadDocsBtn = document.getElementById('load-docs-btn');
  loadDocsBtn.style.display = ALL_REQUIRED_FILES.length > 0 ? 'flex' : 'none';
  updateDocsButtonState();

  renderHeader();
  renderLegend();
  renderTimeline();

  document.querySelectorAll('.day-body, .location-body').forEach(b => {
    b.style.height = 'auto';
  });

  positionRailLines();
  window.removeEventListener('scroll', positionRailLines);
  window.removeEventListener('resize', positionRailLines);
  window.addEventListener('scroll', positionRailLines, { passive: true });
  window.addEventListener('resize', positionRailLines);
}

function collectAllFiles(data) {
  const files = new Set();
  const trip = data.trip || {};

  if (trip.esim?.file) files.add(trip.esim.file);
  (trip.insurance?.certificates || []).forEach(c => c.file && files.add(c.file));
  (trip.customs?.documents || []).forEach(d => d.file && files.add(d.file));
  (trip.customBadges || []).forEach(b => {
    if (b.file) files.add(b.file);
    (b.items || []).forEach(item => item.file && files.add(item.file));
  });

  for (const day of data.days || []) {
    for (const f of day.files || []) {
      if (f.name) {
        const cat = f.cat || 'other';
        const folder = CAT_FOLDER[cat] || 'Other';
        files.add(`${folder}/${f.name}`);
      }
    }
  }

  return [...files];
}

// ─── Start ───
document.addEventListener('DOMContentLoaded', initApp);

// ─── Settings popover ───
function initSettingsBar() {
  // Sync theme buttons with saved preference
  document.querySelectorAll('.tp-theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === currentTheme);
  });
  // Sync lang buttons with saved preference
  document.querySelectorAll('.tp-lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === currentLang);
  });
  // Translate labels
  applySettingsLabels();
}

function toggleSettingsPopover() {
  const pop = document.getElementById('tp-settings-popover');
  if (!pop) return;
  pop.classList.toggle('hidden');
}

// Close popover when clicking outside
document.addEventListener('click', function(e) {
  const wrap = document.getElementById('tp-settings-wrap');
  const pop = document.getElementById('tp-settings-popover');
  if (wrap && pop && !wrap.contains(e.target)) {
    pop.classList.add('hidden');
  }
});

// ─── Expose globals for inline HTML handlers ───
window.openDoc = openDoc;
window.openMaps = openMaps;
window.closeDocsPanel = closeDocsPanel;
window.clickDocItem = clickDocItem;
window.toggleDay = toggleDay;
window.toggleFood = toggleFood;
window.toggleLocation = toggleLocation;
window.toggleCountrySummary = toggleCountrySummary;
window.collapseCard = collapseCard;
window.openEditor = openEditor;
window.closeEditor = closeEditor;
window.saveTrip = saveTrip;
window.toggleEditorSection = toggleEditorSection;
window.toggleEditorDay = toggleEditorDay;
window.toggleEditorCard = toggleEditorCard;
window.edAddRoute = edAddRoute;
window.edRemoveRoute = edRemoveRoute;
window.edMoveRoute = edMoveRoute;
window.edSyncRouteColorToDays = edSyncRouteColorToDays;
window.edSyncRouteFlagToDays = edSyncRouteFlagToDays;
window.edRenameRouteCity = edRenameRouteCity;
window.edSelectDayCity = edSelectDayCity;
window.edToggleDayTrip = edToggleDayTrip;
window.edAddDay = edAddDay;
window.edRemoveDay = edRemoveDay;
window.edMoveDay = edMoveDay;
window.edAddCard = edAddCard;
window.edRemoveCard = edRemoveCard;
window.edMoveCard = edMoveCard;
window.edUpdateTag = edUpdateTag;
window.edRemoveTag = edRemoveTag;
window.edAddTag = edAddTag;
window.edPickFile = edPickFile;
window.edAddEsim = edAddEsim;
window.edAddInsurance = edAddInsurance;
window.edAddCustoms = edAddCustoms;
window.edAddCustomBadge = edAddCustomBadge;
window.refreshSection = refreshSection;
window.refreshDayBody = refreshDayBody;
window.refreshCardBody = refreshCardBody;
window.renderDocsList = renderDocsList;
window.setTheme = setTheme;
window.setLanguage = setLanguage;
window.initSettingsBar = initSettingsBar;
window.toggleSettingsPopover = toggleSettingsPopover;
window.applySettingsLabels = applySettingsLabels;
