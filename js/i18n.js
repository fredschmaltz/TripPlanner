/* ══════════════════════════════════════════
TRIP PLANNER – Internationalization (EN + DE + PT)
══════════════════════════════════════════ */

// ─── English Translations (default) ───
const TRANSLATIONS = {
// ── Picker ──
‘picker.title’:         ‘Trip’,
‘picker.titleEm’:       ‘Planner’,
‘picker.subtitle’:      ‘Your personal travel timeline · No data uploaded to servers’,
‘picker.label’:         ‘Select your trip folder’,
‘picker.hint’:          ‘Contains your JSON config + documents’,
‘picker.sample’:        ‘Load sample trip’,
‘picker.or’:            ‘or’,
‘picker.new’:           ‘New Trip’,
‘picker.featureMulti’:  ‘Multi-city itineraries’,
‘picker.featureDocs’:   ‘Attach travel documents’,
‘picker.featureMap’:    ‘Offline maps’,
‘picker.featureI18n’:   ‘EN / DE / PT’,
‘picker.featureTheme’:  ‘Dark & Light themes’,
‘picker.featureViews’:  ‘Horizon · Journal views’,

// ── Settings Popover ──
‘settings.theme’:       ‘Theme’,
‘settings.lang’:        ‘Language’,
‘settings.displayMode’: ‘View’,
‘settings.actions’:     ‘Actions’,
‘settings.toggles’:     ‘Options’,
‘settings.grayPast’:    ‘Gray past days’,
‘settings.dark’:        ‘Dark’,
‘settings.light’:       ‘Light’,

// ── Display Modes ──
‘displayMode.horizon’:  ‘Horizon’,
‘displayMode.journal’:  ‘Journal’,

// ── Action Items ──
‘action.docs’:          ‘Load Documents’,
‘action.edit’:          ‘Edit Trip’,
‘action.change’:        ‘Change Trip’,

// ── Trip Header ──
‘display.myTrip’:       ‘My Trip’,
‘display.paid’:         ‘Paid’,
‘header.days’:          ‘Days’,
‘header.budget’:        ‘Budget’,
‘header.cities’:        ‘Cities’,
‘header.countries’:     ‘Countries’,

// ── Legend ──
‘legend.transport’:     ‘Transport’,
‘legend.stay’:          ‘Stay’,
‘legend.temple’:        ‘Temples’,
‘legend.museum’:        ‘Museums’,
‘legend.park’:          ‘Parks’,
‘legend.market’:        ‘Markets’,
‘legend.viewpoint’:     ‘Viewpoints’,
‘legend.nightlife’:     ‘Nightlife’,
‘legend.district’:      ‘Districts’,
‘legend.aquarium’:      ‘Aquariums’,
‘legend.zoo’:           ‘Zoos’,
‘legend.activity’:      ‘Activities’,
‘legend.empty’:         ‘No activities yet’,

// ── Card Types ──
‘type.flight’:          ‘Flight’,
‘type.transit’:         ‘Train / Transit’,
‘type.bus’:             ‘Bus’,
‘type.ferry’:           ‘Ferry’,
‘type.taxi’:            ‘Taxi / Ride’,
‘type.stay’:            ‘Stay’,
‘type.checkout’:        ‘Check-out’,
‘type.temple’:          ‘Temple / Shrine’,
‘type.museum’:          ‘Museum’,
‘type.park’:            ‘Park / Garden’,
‘type.market’:          ‘Market / Shopping’,
‘type.viewpoint’:       ‘Viewpoint’,
‘type.monument’:        ‘Monument’,
‘type.nightlife’:       ‘Nightlife’,
‘type.street’:          ‘District / Area’,
‘type.aquarium’:        ‘Aquarium’,
‘type.zoo’:             ‘Zoo’,
‘type.activity’:        ‘Activity’,

// ── Stay Subtypes ──
‘stay.hotel’:           ‘Hotel’,
‘stay.hostel’:          ‘Hostel’,
‘stay.ryokan’:          ‘Ryokan’,
‘stay.airbnb’:          ‘Airbnb’,
‘stay.guesthouse’:      ‘Guesthouse’,
‘stay.resort’:          ‘Resort’,
‘stay.capsule’:         ‘Capsule Hotel’,
‘stay.other’:           ‘Other’,

// ── Card Detail ──
‘card.tips’:            ‘Tips’,
‘card.documents’:       ‘Documents’,
‘card.map’:             ‘Map’,
‘card.call’:            ‘Call’,
‘card.email’:           ‘Email’,
‘card.departure’:       ‘Departure’,
‘card.arrival’:         ‘Arrival’,
‘card.close’:           ‘Close’,

// ── Visited ──
‘visited.markDone’:     ‘Mark visited’,
‘visited.markUndone’:   ‘Mark unvisited’,

// ── Map ──
‘map.tripRoute’:        ‘Trip Route’,

// ── Timeline / Location Groups ──
‘timeline.nights’:      ‘nights’,
‘timeline.night’:       ‘night’,
‘timeline.dayTrip’:     ‘day trip’,
‘timeline.dayTrips’:    ‘day trips’,

// ── Stacked Lanes ──
‘lane.return’:          ‘Return’,
‘lane.dayTrip’:         ‘Day Trip’,

// ── Search & View ──
‘search.placeholder’:   ‘Search timeline\u2026’,
‘search.noResults’:     ‘No results found.’,
‘view.all’:             ‘All’,
‘view.day’:             ‘Day’,
‘view.city’:            ‘City’,
‘view.paged’:           ‘Paged’,
‘view.pageOf’:          ‘of’,

// ── Editor ──
‘editor.title’:         ‘Trip Editor’,
‘editor.save’:          ‘Save’,
‘editor.cancel’:        ‘Cancel’,
‘editor.tripInfo’:      ‘Trip Info’,
‘editor.route’:         ‘Route’,
‘editor.days’:          ‘Days’,
‘editor.tripTitle’:     ‘Trip Title’,
‘editor.tripYear’:      ‘Year’,
‘editor.tripSubtitle’:  ‘Subtitle (optional)’,
‘editor.addStop’:       ‘Add Stop’,
‘editor.addDay’:        ‘Add Day’,
‘editor.addCard’:       ‘Add Card’,
‘editor.removeDay’:     ‘Remove’,
‘editor.removeCard’:    ‘Remove’,
‘editor.dayDate’:       ‘Date’,
‘editor.dayCity’:       ‘City’,
‘editor.dayTrip’:       ‘Day trip’,
‘editor.parentCity’:    ‘Parent city’,
‘editor.cardType’:      ‘Type’,
‘editor.cardTitle’:     ‘Title’,
‘editor.cardSub’:       ‘Subtitle’,
‘editor.cardTime’:      ‘Time’,
‘editor.cardFrom’:      ‘From’,
‘editor.cardTo’:        ‘To’,
‘editor.cardCarrier’:   ‘Carrier’,
‘editor.cardTips’:      ‘Tips’,
‘editor.cardMaps’:      ‘Location’,
‘editor.cardPhone’:     ‘Phone’,
‘editor.cardEmail’:     ‘Email’,
‘editor.tags’:          ‘Tags’,
‘editor.addTag’:        ‘Add Tag’,
‘editor.files’:         ‘Files’,
‘editor.attachFile’:    ‘Attach File’,
‘editor.esim’:          ‘eSIM’,
‘editor.insurance’:     ‘Insurance’,
‘editor.customs’:       ‘Customs’,
‘editor.customBadge’:   ‘Custom Badge’,

// ── File Categories ──
‘file.activity’:        ‘Activity’,
‘file.stay’:            ‘Stay’,
‘file.transport’:       ‘Transport’,
‘file.insurance’:       ‘Insurance’,
‘file.customs’:         ‘Customs’,
‘file.other’:           ‘Other’,

// ── Alerts / Confirm ──
‘alert.noFileApi’:      ‘File System Access API is not supported. Please use Chrome or Edge.’,
‘alert.noJson’:         ‘No JSON config file found in the selected folder.’,
‘alert.parseError’:     ‘Failed to parse JSON config.’,
‘alert.saved’:          ‘Trip saved.’,
‘alert.saveError’:      ‘Error saving trip.’,
‘confirm.discard’:      ‘Discard unsaved changes?’,

// ── Docs Panel ──
‘docs.title’:           ‘Trip Documents’,
‘docs.selectFolder’:    ‘Select Folder’,
‘docs.selectFiles’:     ‘Select Files’,
‘docs.load’:            ‘Select’,
‘docs.docs’:            ‘documents’,
‘docs.doc’:             ‘document’,
‘docs.noDocs’:          ‘No documents’,
‘docs.allLoaded’:       ‘documents loaded’,
‘docs.loaded’:          ‘loaded’,
‘docs.none’:            ‘No documents required for this trip.’,

// ── Day / Month Names ──
‘day.mon’: ‘Mon’, ‘day.tue’: ‘Tue’, ‘day.wed’: ‘Wed’,
‘day.thu’: ‘Thu’, ‘day.fri’: ‘Fri’, ‘day.sat’: ‘Sat’, ‘day.sun’: ‘Sun’,
‘month.jan’: ‘Jan’, ‘month.feb’: ‘Feb’, ‘month.mar’: ‘Mar’,
‘month.apr’: ‘Apr’, ‘month.may’: ‘May’, ‘month.jun’: ‘Jun’,
‘month.jul’: ‘Jul’, ‘month.aug’: ‘Aug’, ‘month.sep’: ‘Sep’,
‘month.oct’: ‘Oct’, ‘month.nov’: ‘Nov’, ‘month.dec’: ‘Dec’,
};

// ─── German Translations ───
const TRANSLATIONS_DE = {
// ── Picker ──
‘picker.title’:         ‘Reise’,
‘picker.titleEm’:       ‘Planer’,
‘picker.subtitle’:      ‘Deine persönliche Reise-Timeline · Keine Daten werden hochgeladen’,
‘picker.label’:         ‘Reiseordner auswählen’,
‘picker.hint’:          ‘Enthält deine JSON-Konfiguration + Dokumente’,
‘picker.sample’:        ‘Beispielreise laden’,
‘picker.or’:            ‘oder’,
‘picker.new’:           ‘Neue Reise’,
‘picker.featureMulti’:  ‘Mehrstädtereisen’,
‘picker.featureDocs’:   ‘Reisedokumente anhängen’,
‘picker.featureMap’:    ‘Offline-Karten’,
‘picker.featureI18n’:   ‘EN / DE / PT’,
‘picker.featureTheme’:  ‘Dunkel- & Hellmodus’,
‘picker.featureViews’:  ‘Horizon · Journal Ansichten’,

// ── Settings Popover ──
‘settings.theme’:       ‘Design’,
‘settings.lang’:        ‘Sprache’,
‘settings.displayMode’: ‘Ansicht’,
‘settings.actions’:     ‘Aktionen’,
‘settings.toggles’:     ‘Optionen’,
‘settings.grayPast’:    ‘Vergangene Tage ausgrauen’,
‘settings.dark’:        ‘Dunkel’,
‘settings.light’:       ‘Hell’,

// ── Display Modes ──
‘displayMode.horizon’:  ‘Horizon’,
‘displayMode.journal’:  ‘Journal’,

// ── Action Items ──
‘action.docs’:          ‘Dokumente laden’,
‘action.edit’:          ‘Reise bearbeiten’,
‘action.change’:        ‘Reise wechseln’,

// ── Trip Header ──
‘display.myTrip’:       ‘Meine Reise’,
‘display.paid’:         ‘Bezahlt’,
‘header.days’:          ‘Tage’,
‘header.budget’:        ‘Budget’,
‘header.cities’:        ‘Städte’,
‘header.countries’:     ‘Länder’,

// ── Legend ──
‘legend.transport’:     ‘Transport’,
‘legend.stay’:          ‘Unterkunft’,
‘legend.temple’:        ‘Tempel’,
‘legend.museum’:        ‘Museen’,
‘legend.park’:          ‘Parks’,
‘legend.market’:        ‘Märkte’,
‘legend.viewpoint’:     ‘Aussichtspunkte’,
‘legend.nightlife’:     ‘Nachtleben’,
‘legend.district’:      ‘Stadtviertel’,
‘legend.aquarium’:      ‘Aquarien’,
‘legend.zoo’:           ‘Zoos’,
‘legend.activity’:      ‘Aktivitäten’,
‘legend.empty’:         ‘Noch keine Aktivitäten’,

// ── Card Types ──
‘type.flight’:          ‘Flug’,
‘type.transit’:         ‘Zug / ÖPNV’,
‘type.bus’:             ‘Bus’,
‘type.ferry’:           ‘Fähre’,
‘type.taxi’:            ‘Taxi / Fahrt’,
‘type.stay’:            ‘Unterkunft’,
‘type.checkout’:        ‘Check-out’,
‘type.temple’:          ‘Tempel / Schrein’,
‘type.museum’:          ‘Museum’,
‘type.park’:            ‘Park / Garten’,
‘type.market’:          ‘Markt / Einkaufen’,
‘type.viewpoint’:       ‘Aussichtspunkt’,
‘type.monument’:        ‘Denkmal’,
‘type.nightlife’:       ‘Nachtleben’,
‘type.street’:          ‘Stadtviertel / Gegend’,
‘type.aquarium’:        ‘Aquarium’,
‘type.zoo’:             ‘Zoo’,
‘type.activity’:        ‘Aktivität’,

// ── Stay Subtypes ──
‘stay.hotel’:           ‘Hotel’,
‘stay.hostel’:          ‘Hostel’,
‘stay.ryokan’:          ‘Ryokan’,
‘stay.airbnb’:          ‘Airbnb’,
‘stay.guesthouse’:      ‘Pension’,
‘stay.resort’:          ‘Resort’,
‘stay.capsule’:         ‘Kapselhotel’,
‘stay.other’:           ‘Sonstiges’,

// ── Card Detail ──
‘card.tips’:            ‘Tipps’,
‘card.documents’:       ‘Dokumente’,
‘card.map’:             ‘Karte’,
‘card.call’:            ‘Anrufen’,
‘card.email’:           ‘E-Mail’,
‘card.departure’:       ‘Abfahrt’,
‘card.arrival’:         ‘Ankunft’,
‘card.close’:           ‘Schließen’,

// ── Visited ──
‘visited.markDone’:     ‘Als besucht markieren’,
‘visited.markUndone’:   ‘Als unbesucht markieren’,

// ── Map ──
‘map.tripRoute’:        ‘Reiseroute’,

// ── Timeline / Location Groups ──
‘timeline.nights’:      ‘Nächte’,
‘timeline.night’:       ‘Nacht’,
‘timeline.dayTrip’:     ‘Tagesausflug’,
‘timeline.dayTrips’:    ‘Tagesausflüge’,

// ── Stacked Lanes ──
‘lane.return’:          ‘Rückkehr’,
‘lane.dayTrip’:         ‘Tagesausflug’,

// ── Search & View ──
‘search.placeholder’:   ‘Timeline durchsuchen\u2026’,
‘search.noResults’:     ‘Keine Ergebnisse gefunden.’,
‘view.all’:             ‘Alle’,
‘view.day’:             ‘Tag’,
‘view.city’:            ‘Stadt’,
‘view.paged’:           ‘Seiten’,
‘view.pageOf’:          ‘von’,

// ── Editor ──
‘editor.title’:         ‘Reise-Editor’,
‘editor.save’:          ‘Speichern’,
‘editor.cancel’:        ‘Abbrechen’,
‘editor.tripInfo’:      ‘Reise-Info’,
‘editor.route’:         ‘Route’,
‘editor.days’:          ‘Tage’,
‘editor.tripTitle’:     ‘Reisetitel’,
‘editor.tripYear’:      ‘Jahr’,
‘editor.tripSubtitle’:  ‘Untertitel (optional)’,
‘editor.addStop’:       ‘Stopp hinzufügen’,
‘editor.addDay’:        ‘Tag hinzufügen’,
‘editor.addCard’:       ‘Karte hinzufügen’,
‘editor.removeDay’:     ‘Entfernen’,
‘editor.removeCard’:    ‘Entfernen’,
‘editor.dayDate’:       ‘Datum’,
‘editor.dayCity’:       ‘Stadt’,
‘editor.dayTrip’:       ‘Tagesausflug’,
‘editor.parentCity’:    ‘Ausgangsstadt’,
‘editor.cardType’:      ‘Typ’,
‘editor.cardTitle’:     ‘Titel’,
‘editor.cardSub’:       ‘Untertitel’,
‘editor.cardTime’:      ‘Zeit’,
‘editor.cardFrom’:      ‘Von’,
‘editor.cardTo’:        ‘Nach’,
‘editor.cardCarrier’:   ‘Anbieter’,
‘editor.cardTips’:      ‘Tipps’,
‘editor.cardMaps’:      ‘Standort’,
‘editor.cardPhone’:     ‘Telefon’,
‘editor.cardEmail’:     ‘E-Mail’,
‘editor.tags’:          ‘Tags’,
‘editor.addTag’:        ‘Tag hinzufügen’,
‘editor.files’:         ‘Dateien’,
‘editor.attachFile’:    ‘Datei anhängen’,
‘editor.esim’:          ‘eSIM’,
‘editor.insurance’:     ‘Versicherung’,
‘editor.customs’:       ‘Zoll’,
‘editor.customBadge’:   ‘Eigenes Badge’,

// ── File Categories ──
‘file.activity’:        ‘Aktivität’,
‘file.stay’:            ‘Unterkunft’,
‘file.transport’:       ‘Transport’,
‘file.insurance’:       ‘Versicherung’,
‘file.customs’:         ‘Zoll’,
‘file.other’:           ‘Sonstiges’,

// ── Alerts / Confirm ──
‘alert.noFileApi’:      ‘Die File System Access API wird nicht unterstützt. Bitte Chrome oder Edge verwenden.’,
‘alert.noJson’:         ‘Keine JSON-Konfigurationsdatei im ausgewählten Ordner gefunden.’,
‘alert.parseError’:     ‘JSON-Konfiguration konnte nicht gelesen werden.’,
‘alert.saved’:          ‘Reise gespeichert.’,
‘alert.saveError’:      ‘Fehler beim Speichern.’,
‘confirm.discard’:      ‘Ungespeicherte Änderungen verwerfen?’,

// ── Docs Panel ──
‘docs.title’:           ‘Reisedokumente’,
‘docs.selectFolder’:    ‘Ordner auswählen’,
‘docs.selectFiles’:     ‘Dateien auswählen’,
‘docs.load’:            ‘Auswählen’,
‘docs.docs’:            ‘Dokumente’,
‘docs.doc’:             ‘Dokument’,
‘docs.noDocs’:          ‘Keine Dokumente’,
‘docs.allLoaded’:       ‘Dokumente geladen’,
‘docs.loaded’:          ‘geladen’,
‘docs.none’:            ‘Keine Dokumente für diese Reise benötigt.’,

// ── Day / Month Names ──
‘day.mon’: ‘Mo’, ‘day.tue’: ‘Di’, ‘day.wed’: ‘Mi’,
‘day.thu’: ‘Do’, ‘day.fri’: ‘Fr’, ‘day.sat’: ‘Sa’, ‘day.sun’: ‘So’,
‘month.jan’: ‘Jan’, ‘month.feb’: ‘Feb’, ‘month.mar’: ‘Mär’,
‘month.apr’: ‘Apr’, ‘month.may’: ‘Mai’, ‘month.jun’: ‘Jun’,
‘month.jul’: ‘Jul’, ‘month.aug’: ‘Aug’, ‘month.sep’: ‘Sep’,
‘month.oct’: ‘Okt’, ‘month.nov’: ‘Nov’, ‘month.dec’: ‘Dez’,
};

// ─── Country Names ───
const COUNTRY_NAMES_DE = {
jp: ‘Japan’, kr: ‘Südkorea’, cn: ‘China’, tw: ‘Taiwan’, hk: ‘Hongkong’,
th: ‘Thailand’, vn: ‘Vietnam’, sg: ‘Singapur’, my: ‘Malaysia’, id: ‘Indonesien’,
ph: ‘Philippinen’, mm: ‘Myanmar’, kh: ‘Kambodscha’, la: ‘Laos’, in: ‘Indien’,
us: ‘USA’, ca: ‘Kanada’, mx: ‘Mexiko’, br: ‘Brasilien’, ar: ‘Argentinien’,
gb: ‘Vereinigtes Königreich’, fr: ‘Frankreich’, de: ‘Deutschland’, it: ‘Italien’,
es: ‘Spanien’, pt: ‘Portugal’, nl: ‘Niederlande’, be: ‘Belgien’, at: ‘Österreich’,
ch: ‘Schweiz’, se: ‘Schweden’, no: ‘Norwegen’, dk: ‘Dänemark’, fi: ‘Finnland’,
pl: ‘Polen’, cz: ‘Tschechien’, gr: ‘Griechenland’, tr: ‘Türkei’, ru: ‘Russland’,
au: ‘Australien’, nz: ‘Neuseeland’, ae: ‘VAE’, eg: ‘Ägypten’, za: ‘Südafrika’,
il: ‘Israel’, ie: ‘Irland’, hr: ‘Kroatien’, hu: ‘Ungarn’, ro: ‘Rumänien’,
};

// ─── Portuguese Translations ───
const TRANSLATIONS_PT = {
// ── Picker ──
‘picker.title’:         ‘Planeador’,
‘picker.titleEm’:       ‘de Viagem’,
‘picker.subtitle’:      ‘O teu cronograma de viagem pessoal · Sem dados enviados para servidores’,
‘picker.label’:         ‘Seleciona a pasta da viagem’,
‘picker.hint’:          ‘Contém a configuração JSON + documentos’,
‘picker.sample’:        ‘Carregar viagem de exemplo’,
‘picker.or’:            ‘ou’,
‘picker.new’:           ‘Nova Viagem’,
‘picker.featureMulti’:  ‘Itinerários multi-cidade’,
‘picker.featureDocs’:   ‘Anexar documentos de viagem’,
‘picker.featureMap’:    ‘Mapas offline’,
‘picker.featureI18n’:   ‘EN / DE / PT’,
‘picker.featureTheme’:  ‘Temas Claro e Escuro’,
‘picker.featureViews’:  ‘Vistas Horizon · Journal’,

// ── Settings Popover ──
‘settings.theme’:       ‘Tema’,
‘settings.lang’:        ‘Idioma’,
‘settings.displayMode’: ‘Vista’,
‘settings.actions’:     ‘Ações’,
‘settings.toggles’:     ‘Opções’,
‘settings.grayPast’:    ‘Atenuar dias passados’,
‘settings.dark’:        ‘Escuro’,
‘settings.light’:       ‘Claro’,

// ── Display Modes ──
‘displayMode.horizon’:  ‘Horizon’,
‘displayMode.journal’:  ‘Journal’,

// ── Action Items ──
‘action.docs’:          ‘Carregar Documentos’,
‘action.edit’:          ‘Editar Viagem’,
‘action.change’:        ‘Mudar de Viagem’,

// ── Trip Header ──
‘display.myTrip’:       ‘A Minha Viagem’,
‘display.paid’:         ‘Pago’,
‘header.days’:          ‘Dias’,
‘header.budget’:        ‘Orçamento’,
‘header.cities’:        ‘Cidades’,
‘header.countries’:     ‘Países’,

// ── Legend ──
‘legend.transport’:     ‘Transporte’,
‘legend.stay’:          ‘Alojamento’,
‘legend.temple’:        ‘Templos’,
‘legend.museum’:        ‘Museus’,
‘legend.park’:          ‘Parques’,
‘legend.market’:        ‘Mercados’,
‘legend.viewpoint’:     ‘Miradouros’,
‘legend.nightlife’:     ‘Vida Noturna’,
‘legend.district’:      ‘Bairros’,
‘legend.aquarium’:      ‘Aquários’,
‘legend.zoo’:           ‘Jardins zoológicos’,
‘legend.activity’:      ‘Atividades’,
‘legend.empty’:         ‘Sem atividades ainda’,

// ── Card Types ──
‘type.flight’:          ‘Voo’,
‘type.transit’:         ‘Comboio / Metro’,
‘type.bus’:             ‘Autocarro’,
‘type.ferry’:           ‘Ferry’,
‘type.taxi’:            ‘Táxi / Viatura’,
‘type.stay’:            ‘Alojamento’,
‘type.checkout’:        ‘Check-out’,
‘type.temple’:          ‘Templo / Santuário’,
‘type.museum’:          ‘Museu’,
‘type.park’:            ‘Parque / Jardim’,
‘type.market’:          ‘Mercado / Compras’,
‘type.viewpoint’:       ‘Miradouro’,
‘type.monument’:        ‘Monumento’,
‘type.nightlife’:       ‘Vida Noturna’,
‘type.street’:          ‘Bairro / Zona’,
‘type.aquarium’:        ‘Aquário’,
‘type.zoo’:             ‘Jardim Zoológico’,
‘type.activity’:        ‘Atividade’,

// ── Stay Subtypes ──
‘stay.hotel’:           ‘Hotel’,
‘stay.hostel’:          ‘Hostel’,
‘stay.ryokan’:          ‘Ryokan’,
‘stay.airbnb’:          ‘Airbnb’,
‘stay.guesthouse’:      ‘Pensão’,
‘stay.resort’:          ‘Resort’,
‘stay.capsule’:         ‘Hotel Cápsula’,
‘stay.other’:           ‘Outro’,

// ── Card Detail ──
‘card.tips’:            ‘Dicas’,
‘card.documents’:       ‘Documentos’,
‘card.map’:             ‘Mapa’,
‘card.call’:            ‘Ligar’,
‘card.email’:           ‘E-mail’,
‘card.departure’:       ‘Partida’,
‘card.arrival’:         ‘Chegada’,
‘card.close’:           ‘Fechar’,

// ── Visited ──
‘visited.markDone’:     ‘Marcar como visitado’,
‘visited.markUndone’:   ‘Marcar como não visitado’,

// ── Map ──
‘map.tripRoute’:        ‘Rota da Viagem’,

// ── Timeline / Location Groups ──
‘timeline.nights’:      ‘noites’,
‘timeline.night’:       ‘noite’,
‘timeline.dayTrip’:     ‘excursão’,
‘timeline.dayTrips’:    ‘excursões’,

// ── Stacked Lanes ──
‘lane.return’:          ‘Regresso’,
‘lane.dayTrip’:         ‘Excursão’,

// ── Search & View ──
‘search.placeholder’:   ‘Pesquisar cronograma\u2026’,
‘search.noResults’:     ‘Sem resultados.’,
‘view.all’:             ‘Todos’,
‘view.day’:             ‘Dia’,
‘view.city’:            ‘Cidade’,
‘view.paged’:           ‘Paginado’,
‘view.pageOf’:          ‘de’,

// ── Editor ──
‘editor.title’:         ‘Editor de Viagem’,
‘editor.save’:          ‘Guardar’,
‘editor.cancel’:        ‘Cancelar’,
‘editor.tripInfo’:      ‘Info da Viagem’,
‘editor.route’:         ‘Rota’,
‘editor.days’:          ‘Dias’,
‘editor.tripTitle’:     ‘Título da Viagem’,
‘editor.tripYear’:      ‘Ano’,
‘editor.tripSubtitle’:  ‘Subtítulo (opcional)’,
‘editor.addStop’:       ‘Adicionar Paragem’,
‘editor.addDay’:        ‘Adicionar Dia’,
‘editor.addCard’:       ‘Adicionar Cartão’,
‘editor.removeDay’:     ‘Remover’,
‘editor.removeCard’:    ‘Remover’,
‘editor.dayDate’:       ‘Data’,
‘editor.dayCity’:       ‘Cidade’,
‘editor.dayTrip’:       ‘Excursão’,
‘editor.parentCity’:    ‘Cidade-base’,
‘editor.cardType’:      ‘Tipo’,
‘editor.cardTitle’:     ‘Título’,
‘editor.cardSub’:       ‘Subtítulo’,
‘editor.cardTime’:      ‘Hora’,
‘editor.cardFrom’:      ‘De’,
‘editor.cardTo’:        ‘Para’,
‘editor.cardCarrier’:   ‘Operador’,
‘editor.cardTips’:      ‘Dicas’,
‘editor.cardMaps’:      ‘Localização’,
‘editor.cardPhone’:     ‘Telefone’,
‘editor.cardEmail’:     ‘E-mail’,
‘editor.tags’:          ‘Etiquetas’,
‘editor.addTag’:        ‘Adicionar Etiqueta’,
‘editor.files’:         ‘Ficheiros’,
‘editor.attachFile’:    ‘Anexar Ficheiro’,
‘editor.esim’:          ‘eSIM’,
‘editor.insurance’:     ‘Seguro’,
‘editor.customs’:       ‘Alfândega’,
‘editor.customBadge’:   ‘Badge Personalizado’,

// ── File Categories ──
‘file.activity’:        ‘Atividade’,
‘file.stay’:            ‘Alojamento’,
‘file.transport’:       ‘Transporte’,
‘file.insurance’:       ‘Seguro’,
‘file.customs’:         ‘Alfândega’,
‘file.other’:           ‘Outro’,

// ── Alerts / Confirm ──
‘alert.noFileApi’:      ‘A File System Access API não é suportada. Por favor usa Chrome ou Edge.’,
‘alert.noJson’:         ‘Nenhum ficheiro JSON encontrado na pasta selecionada.’,
‘alert.parseError’:     ‘Falha ao processar a configuração JSON.’,
‘alert.saved’:          ‘Viagem guardada.’,
‘alert.saveError’:      ‘Erro ao guardar a viagem.’,
‘confirm.discard’:      ‘Descartar alterações não guardadas?’,

// ── Docs Panel ──
‘docs.title’:           ‘Documentos da Viagem’,
‘docs.selectFolder’:    ‘Selecionar Pasta’,
‘docs.selectFiles’:     ‘Selecionar Ficheiros’,
‘docs.load’:            ‘Selecionar’,
‘docs.docs’:            ‘documentos’,
‘docs.doc’:             ‘documento’,
‘docs.noDocs’:          ‘Sem documentos’,
‘docs.allLoaded’:       ‘documentos carregados’,
‘docs.loaded’:          ‘carregado’,
‘docs.none’:            ‘Nenhum documento necessário para esta viagem.’,

// ── Day / Month Names ──
‘day.mon’: ‘Seg’, ‘day.tue’: ‘Ter’, ‘day.wed’: ‘Qua’,
‘day.thu’: ‘Qui’, ‘day.fri’: ‘Sex’, ‘day.sat’: ‘Sáb’, ‘day.sun’: ‘Dom’,
‘month.jan’: ‘Jan’, ‘month.feb’: ‘Fev’, ‘month.mar’: ‘Mar’,
‘month.apr’: ‘Abr’, ‘month.may’: ‘Mai’, ‘month.jun’: ‘Jun’,
‘month.jul’: ‘Jul’, ‘month.aug’: ‘Ago’, ‘month.sep’: ‘Set’,
‘month.oct’: ‘Out’, ‘month.nov’: ‘Nov’, ‘month.dec’: ‘Dez’,
};

// ─── Country Names ───
const COUNTRY_NAMES_PT = {
jp: ‘Japão’, kr: ‘Coreia do Sul’, cn: ‘China’, tw: ‘Taiwan’, hk: ‘Hong Kong’,
th: ‘Tailândia’, vn: ‘Vietname’, sg: ‘Singapura’, my: ‘Malásia’, id: ‘Indonésia’,
ph: ‘Filipinas’, mm: ‘Myanmar’, kh: ‘Camboja’, la: ‘Laos’, in: ‘Índia’,
us: ‘EUA’, ca: ‘Canadá’, mx: ‘México’, br: ‘Brasil’, ar: ‘Argentina’,
gb: ‘Reino Unido’, fr: ‘França’, de: ‘Alemanha’, it: ‘Itália’,
es: ‘Espanha’, pt: ‘Portugal’, nl: ‘Países Baixos’, be: ‘Bélgica’, at: ‘Áustria’,
ch: ‘Suíça’, se: ‘Suécia’, no: ‘Noruega’, dk: ‘Dinamarca’, fi: ‘Finlândia’,
pl: ‘Polónia’, cz: ‘Chéquia’, gr: ‘Grécia’, tr: ‘Turquia’, ru: ‘Rússia’,
au: ‘Austrália’, nz: ‘Nova Zelândia’, ae: ‘EAU’, eg: ‘Egito’, za: ‘África do Sul’,
il: ‘Israel’, ie: ‘Irlanda’, hr: ‘Croácia’, hu: ‘Hungria’, ro: ‘Roménia’,
};

// ─── Active Language ───
let currentLang = localStorage.getItem(‘tp-lang’) || ‘en’;

/**

- Translate a key using the current language.
  */
  function t(key) {
  if (currentLang === ‘de’) {
  return TRANSLATIONS_DE[key] || TRANSLATIONS[key] || key;
  }
  if (currentLang === ‘pt’) {
  return TRANSLATIONS_PT[key] || TRANSLATIONS[key] || key;
  }
  return TRANSLATIONS[key] || key;
  }

/**

- Get localized country name.
  */
  function countryName(code) {
  if (currentLang === ‘de’ && COUNTRY_NAMES_DE[code]) {
  return COUNTRY_NAMES_DE[code];
  }
  if (currentLang === ‘pt’ && COUNTRY_NAMES_PT[code]) {
  return COUNTRY_NAMES_PT[code];
  }
  return FLAG_TO_COUNTRY[code] || code;
  }

/**

- Get month names array for date parsing.
  */
  function getMonthNames() {
  return [
  t(‘month.jan’), t(‘month.feb’), t(‘month.mar’),
  t(‘month.apr’), t(‘month.may’), t(‘month.jun’),
  t(‘month.jul’), t(‘month.aug’), t(‘month.sep’),
  t(‘month.oct’), t(‘month.nov’), t(‘month.dec’),
  ];
  }

/**

- Switch language and re-render everything.
  */
  function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(‘tp-lang’, lang);

// Sync buttons
document.querySelectorAll(’.tp-lang-btn’).forEach(b => {
b.classList.toggle(‘active’, b.dataset.lang === lang);
});

// Refresh dynamic labels derived from translations
refreshTypeLabels();

// Re-apply all UI translations
applySettingsLabels();
applyPickerTranslations();

if (typeof TRIP_CONFIG !== ‘undefined’ && TRIP_CONFIG) {
applyTripViewTranslations();
renderHeader();
renderLegend();
renderTimeline();
applyPastDayClasses();
applyTimelineControlsTranslations();
}
}

/**

- Refresh TYPE_META labels and derived structures from translations.
  */
  function refreshTypeLabels() {
  if (typeof TYPE_META === ‘undefined’) return;
  const typeKeys = {
  flight: ‘type.flight’, transit: ‘type.transit’, bus: ‘type.bus’,
  ferry: ‘type.ferry’, taxi: ‘type.taxi’, stay: ‘type.stay’,
  checkout: ‘type.checkout’, temple: ‘type.temple’, museum: ‘type.museum’,
  park: ‘type.park’, market: ‘type.market’, viewpoint: ‘type.viewpoint’,
  monument: ‘type.monument’, nightlife: ‘type.nightlife’, street: ‘type.street’,
  aquarium: ‘type.aquarium’, zoo: ‘type.zoo’, activity: ‘type.activity’,
  };
  for (const [type, key] of Object.entries(typeKeys)) {
  if (TYPE_META[type]) TYPE_META[type].label = t(key);
  }

// Update CARD_TYPES group labels
if (typeof CARD_TYPES !== ‘undefined’) {
const groupLabels = {
‘Transport’: t(‘legend.transport’),
‘Accommodation’: t(‘legend.stay’),
‘Sightseeing’: t(‘type.viewpoint’),
‘Activity’: t(‘type.activity’),
};
for (const grp of CARD_TYPES) {
if (groupLabels[grp.group]) grp.group = groupLabels[grp.group];
}
}

// Update STAY_SUBTYPES
if (typeof STAY_SUBTYPES !== ‘undefined’) {
const stayKeys = {
hotel: ‘stay.hotel’, hostel: ‘stay.hostel’, ryokan: ‘stay.ryokan’,
airbnb: ‘stay.airbnb’, guesthouse: ‘stay.guesthouse’, resort: ‘stay.resort’,
capsule: ‘stay.capsule’, other: ‘stay.other’,
};
for (const st of STAY_SUBTYPES) {
if (stayKeys[st.value]) st.label = t(stayKeys[st.value]);
}
}

// Update CAT_LABEL
if (typeof CAT_LABEL !== ‘undefined’) {
CAT_LABEL.activity  = t(‘file.activity’);
CAT_LABEL.stay      = t(‘file.stay’);
CAT_LABEL.transport = t(‘file.transport’);
CAT_LABEL.insurance = t(‘file.insurance’);
CAT_LABEL.customs   = t(‘file.customs’);
CAT_LABEL.other     = t(‘file.other’);
}

// Update TAG_TYPES
if (typeof TAG_TYPES !== ‘undefined’) {
TAG_TYPES[0] = { value: ‘price’,   label: ‘Price’ };
TAG_TYPES[1] = { value: ‘paid’,    label: t(‘display.paid’) };
TAG_TYPES[2] = { value: ‘unpaid’,  label: ‘Unpaid’ };
TAG_TYPES[3] = { value: ‘waiting’, label: ‘Waiting’ };
TAG_TYPES[4] = { value: ‘id’,      label: ‘ID / Ref’ };
TAG_TYPES[5] = { value: ‘default’, label: ‘Other’ };
}
}

/**

- Apply translations to the settings popover labels.
  */
  function applySettingsLabels() {
  const map = {
  ‘tp-lbl-theme’:     ‘settings.theme’,
  ‘tp-lbl-lang’:      ‘settings.lang’,
  ‘tp-lbl-display’:   ‘settings.displayMode’,
  ‘tp-lbl-actions’:   ‘settings.actions’,
  ‘tp-lbl-toggles’:   ‘settings.toggles’,
  ‘tp-lbl-gray-past’: ‘settings.grayPast’,
  };
  for (const [id, key] of Object.entries(map)) {
  const el = document.getElementById(id);
  if (el) el.textContent = t(key);
  }

// Theme buttons
document.querySelectorAll(’.tp-theme-btn’).forEach(b => {
if (b.dataset.theme === ‘dark’) b.textContent = t(‘settings.dark’);
if (b.dataset.theme === ‘light’) b.textContent = t(‘settings.light’);
});

// Settings gear tooltip
const gear = document.getElementById(‘tp-settings-btn’);
if (gear) gear.title = t(‘settings.theme’);
}

/**

- Apply translations to the picker view.
  */
  function applyPickerTranslations() {
  const titleEl = document.querySelector(’.picker-title’);
  if (titleEl) titleEl.innerHTML = `${t('picker.title')} <em>${t('picker.titleEm')}</em>`;

const subEl = document.querySelector(’.picker-subtitle’);
if (subEl) subEl.textContent = t(‘picker.subtitle’);

const lblEl = document.getElementById(‘picker-label’);
if (lblEl) lblEl.textContent = t(‘picker.label’);

const hintEl = document.getElementById(‘picker-hint’);
if (hintEl) hintEl.textContent = t(‘picker.hint’);

const sampleEl = document.getElementById(‘load-sample’);
if (sampleEl) sampleEl.textContent = t(‘picker.sample’);

const newBtn = document.getElementById(‘new-trip-btn’);
if (newBtn) newBtn.innerHTML = `${icon('plus', 14)} ${t('picker.new')}`;

// Feature pills
const features = document.getElementById(‘picker-features’);
if (features) {
const pills = [
{ icon: ‘map’,      key: ‘picker.featureMulti’ },
{ icon: ‘paperclip’, key: ‘picker.featureDocs’ },
{ icon: ‘map-pin’,  key: ‘picker.featureMap’ },
{ icon: ‘globe’,    key: ‘picker.featureI18n’ },
{ icon: ‘eye’,      key: ‘picker.featureTheme’ },
{ icon: ‘grid-2x2’, key: ‘picker.featureViews’ },
];
features.innerHTML = pills.map(p =>
`<div class="feature-pill">${icon(p.icon, 14)} ${t(p.key)}</div>`
).join(’’);
}
}

/**

- Apply translations to the trip view (action buttons, docs panel, etc).
  */
  function applyTripViewTranslations() {
  // Action popover buttons
  const popDocs   = document.getElementById(‘tp-pop-docs’);
  const popEdit   = document.getElementById(‘tp-pop-edit’);
  const popChange = document.getElementById(‘tp-pop-change’);
  if (popDocs)   popDocs.innerHTML   = `${icon('paperclip', 14)} ${t('action.docs')}`;
  if (popEdit)   popEdit.innerHTML   = `${icon('pen', 14)} ${t('action.edit')}`;
  if (popChange) popChange.innerHTML = `${icon('refresh', 14)} ${t('action.change')}`;

// Docs panel
const docsTitle = document.getElementById(‘docs-panel-title’);
if (docsTitle) docsTitle.textContent = t(‘docs.title’);
const selFolder = document.getElementById(‘select-folder-btn’);
const selFiles  = document.getElementById(‘select-files-btn’);
if (selFolder) selFolder.textContent = t(‘docs.selectFolder’);
if (selFiles)  selFiles.textContent  = t(‘docs.selectFiles’);

// Editor labels
const edTitle = document.querySelector(’.editor-toolbar-title’);
if (edTitle) edTitle.textContent = t(‘editor.title’);
const saveBtn = document.getElementById(‘editor-save-btn’);
if (saveBtn) saveBtn.textContent = t(‘editor.save’);

// No results
const noRes = document.getElementById(‘timeline-no-results’);
if (noRes) noRes.textContent = t(‘search.noResults’);
}

/**

- Apply translations to timeline controls (search, view mode buttons).
  */
  function applyTimelineControlsTranslations() {
  const searchInput = document.getElementById(‘timeline-search-input’);
  if (searchInput) searchInput.placeholder = t(‘search.placeholder’);

document.querySelectorAll(’.view-mode-btn’).forEach(b => {
const modeKey = {
all:    ‘view.all’,
byDay:  ‘view.day’,
byCity: ‘view.city’,
paged:  ‘view.paged’,
}[b.dataset.mode];
if (modeKey) b.textContent = t(modeKey);
});

const searchIcon = document.getElementById(‘search-icon-el’);
if (searchIcon) searchIcon.innerHTML = icon(‘search’, 14);

const noRes = document.getElementById(‘timeline-no-results’);
if (noRes) noRes.textContent = t(‘search.noResults’);
}

/**

- Initialize language preferences on page load.
  */
  function initPreferences() {
  // Apply saved language
  if (currentLang !== ‘en’) {
  refreshTypeLabels();
  }
  applySettingsLabels();
  applyPickerTranslations();
  }