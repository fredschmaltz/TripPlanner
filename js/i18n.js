/* ══════════════════════════════════════════
   TRIP PLANNER — Internationalization
══════════════════════════════════════════ */

let currentLang = localStorage.getItem('tp-lang') || 'en';

const TRANSLATIONS = {
  // ─── Page / Picker ───
  'page.title':                'Trip Planner',
  'picker.title.trip':         'Trip',
  'picker.title.planner':      'Planner',
  'picker.subtitle':           'Your personal travel timeline \u00B7 No data uploaded to servers',
  'picker.selectFolder':       'Select your trip folder',
  'picker.hint':               'Contains your JSON config + documents',
  'picker.loadSample':         'Load sample trip',
  'picker.or':                 'or',

  // ─── Buttons ───
  'btn.newTrip':               'New Trip',
  'btn.changeTrip':            'Change Trip',
  'btn.edit':                  'Edit',
  'btn.loadDocs':              'Load Documents',
  'btn.documents':             'Documents',
  'btn.selectFolder':          'Select Folder',
  'btn.selectFiles':           'Select Files',
  'btn.save':                  'Save',
  'btn.cancel':                'Cancel',

  // ─── Feature pills ───
  'feat.timeline':             'Timeline view',
  'feat.budget':               'Budget tracking',
  'feat.maps':                 'Map links',
  'feat.docs':                 'Documents & tickets',
  'feat.routes':               'Multi-city routes',
  'feat.accommodation':        'Accommodation',
  'feat.food':                 'Food & tips',
  'feat.tags':                 'Tags & categories',

  // ─── Alerts / Messages ───
  'alert.noJson':              'No JSON config file found in this folder.\nPlease select a folder containing your trip-config.json file.',
  'alert.invalidJson':         'Invalid JSON in',
  'alert.invalidFile':         'Invalid JSON file:',
  'docs.none':                 'No documents referenced',
  'docs.loaded':               'documents loaded',
  'docs.noDocs':               'No Docs',
  'docs.allLoaded':            'Loaded \u2713',
  'docs.load':                 'Load',
  'docs.doc':                  'Doc',
  'docs.docs':                 'Docs',

  // ─── Display — Header ───
  'display.myTrip':            'My Trip',
  'display.paid':              'Paid',

  // ─── Display — Legend ───
  'legend.transport':          'Transport',
  'legend.stay':               'Stay',
  'legend.temple':             'Temple',
  'legend.museum':             'Museum',
  'legend.park':               'Park',
  'legend.market':             'Market',
  'legend.viewpoint':          'Viewpoint',
  'legend.nightlife':          'Nightlife',
  'legend.district':           'District',

  // ─── Display — Card ───
  'card.map':                  'Map',
  'card.call':                 'Call',
  'card.email':                'Email',
  'card.tips':                 'Tips',
  'card.documents':            'Documents',
  'card.collapse':             '\u25B2 Collapse',

  // ─── Display — Timeline ───
  'timeline.night':            'night',
  'timeline.nights':           'nights',
  'timeline.dayTrip':          'day trip',

  // ─── Display — Country Summary ───
  'summary.nights':            'nights',
  'summary.flights':           'flights',
  'summary.trains':            'trains',
  'summary.activities':        'activities',
  'summary.foodTips':          'food tips',
  'summary.paid':              'paid',
  'summary.toPay':             'to pay',

  // ─── Editor — Sections ───
  'ed.tripInfo':               '\uD83D\uDDFA\uFE0F Trip Info',
  'ed.route':                  '\uD83E\uDDED Route',
  'ed.badges':                 '\uD83C\uDFF7\uFE0F Header Badges',
  'ed.days':                   '\uD83D\uDCC5 Days',
  'ed.tripEditor':             'Trip Editor',

  // ─── Editor — Labels ───
  'ed.title':                  'Title',
  'ed.year':                   'Year',
  'ed.subtitle':               'Subtitle',
  'ed.auto':                   'Auto',
  'ed.selectCountry':          '\uD83C\uDFF3\uFE0F Select country',
  'ed.cityName':               'City name',
  'ed.moveUp':                 'Move up',
  'ed.moveDown':               'Move down',
  'ed.remove':                 'Remove',
  'ed.stops':                  'stops',
  'ed.addStop':                '+ Add Stop',
  'ed.city':                   'City',
  'ed.baseCity':               'Base City',
  'ed.selectCity':              '\u2014 Select city \u2014',
  'ed.date':                   'Date',
  'ed.dayTrip':                'Day Trip',
  'ed.destination':            'Destination',
  'ed.cards':                  'cards',
  'ed.unknownCity':            'Unknown',
  'ed.newDay':                 'New Day',
  'ed.newCard':                'New Card',

  // ─── Editor — Badges ───
  'ed.esim':                   'eSIM',
  'ed.insurance':              'Insurance',
  'ed.customs':                'Customs',
  'ed.label':                  'Label',
  'ed.price':                  'Price',
  'ed.status':                 'Status',
  'ed.paidOpt':                'Paid',
  'ed.unpaidOpt':              'Unpaid',
  'ed.noneOpt':                'None',
  'ed.filePath':               'File path',
  'ed.addEsim':                '+ eSIM',
  'ed.addInsurance':           '+ Insurance',
  'ed.addCustoms':             '+ Customs',
  'ed.addCustomBadge':         '+ Custom Badge',
  'ed.addCertificate':         '+ Certificate',
  'ed.addDocument':            '+ Document',
  'ed.addItem':                '+ Item',
  'ed.badgeName':              'Badge name',
  'ed.borderColor':            'Border Color',
  'ed.type':                   'Type',
  'ed.simpleType':             'Simple (single file)',
  'ed.multiType':              'Multi (per-country items)',
  'ed.file':                   'File',

  // ─── Editor — Days ───
  'ed.sortDays':               'Sort days:',
  'ed.dateAsc':                '\u2191 Date',
  'ed.dateDesc':               '\u2193 Date',
  'ed.addDay':                 '+ Add Day',
  'ed.removeDay':              'Remove this entire day?',
  'ed.discardChanges':         'You have unsaved changes. Discard them?',
  'ed.defineRouteFirst':       'Define route first',
  'ed.routeRequired':          'Route must be defined prior to planning days',
  'ed.notInRoute':             'not in route',

  // ─── Editor — Food / Files / Cards ───
  'ed.foodTips':               '\uD83C\uDF5B Food Tips',
  'ed.dishName':               'Dish name',
  'ed.description':            'Description',
  'ed.addFoodTip':             '+ Food Tip',
  'ed.files':                  '\uD83D\uDCCE Files',
  'ed.filename':               'filename.pdf',
  'ed.displayLabel':           'Display label',
  'ed.addFile':                '+ File',
  'ed.cardsSection':           '\uD83D\uDCCB Cards',
  'ed.sortCards':              'Sort cards:',
  'ed.timeAsc':                '\u2191 Time',
  'ed.timeDesc':               '\u2193 Time',
  'ed.typeAsc':                '\u2191 Type',
  'ed.nameAsc':                '\u2191 Name',
  'ed.nameDesc':               '\u2193 Name',
  'ed.addCard':                '+ Add Card',
  'ed.customOpt':              'Custom...',

  // ─── Editor — Card Fields ───
  'ed.icon':                   'Icon',
  'ed.startTime':              'Start Time',
  'ed.endTime':                'End Time',
  'ed.cardTitle':              'Card title',
  'ed.from':                   'From',
  'ed.to':                     'To',
  'ed.carrier':                'Carrier',
  'ed.subtitleDetails':        'Subtitle / Details',
  'ed.cityOverride':           'City Override (optional)',
  'ed.cityOverrideHint':       "Leave empty for day's city",
  'ed.mapsAddress':            'Maps / Address',
  'ed.mapsHint':               'Full address for Google Maps',
  'ed.phone':                  'Phone',
  'ed.email':                  'Email',
  'ed.tags':                   'Tags',
  'ed.addTag':                 '+ Tag',
  'ed.tips':                   'Tips',
  'ed.addTip':                 '+ Tip',

  // ─── Editor — Prompts ───
  'ed.enterEmoji':             'Enter a single emoji:',
  'ed.enterTypeName':          'Enter custom type name (e.g. "Beach Day"):',
  'ed.enterTypeIcon':          'Enter an emoji icon for this type (e.g. \uD83C\uDFD6\uFE0F):',

  // ─── Editor — Toast ───
  'toast.saved':               '\u2713 Trip saved',
  'toast.downloaded':          '\u2713 Config downloaded',

  // ─── Editor — Confirm ───
  'confirm.removeCity1':       'Removing \u201C',
  'confirm.removeCity2':       '\u201D will clear it from these days:',
  'confirm.proceed':           'Proceed?',

  // ─── Subtitle generation ───
  'sub.days':                  'days',
  'sub.cities':                'cities',

  // ─── Card type labels ───
  'type.flight':               'Flight',
  'type.train':                'Train',
  'type.bus':                  'Bus',
  'type.ferry':                'Ferry',
  'type.taxiCar':              'Taxi / Car',
  'type.hotel':                'Hotel',
  'type.checkout':             'Check-out',
  'type.templeshrine':         'Temple / Shrine',
  'type.museum':               'Museum',
  'type.parkgarden':           'Park / Garden',
  'type.market':               'Market',
  'type.viewpoint':            'Viewpoint',
  'type.aquarium':             'Aquarium',
  'type.zoo':                  'Zoo',
  'type.streetdistrict':       'Street / District',
  'type.nightlifedining':      'Nightlife / Dining',
  'type.monument':             'Monument',
  'type.activity':             'Activity',

  // ─── Card type groups ───
  'typeGroup.transport':       'Transport',
  'typeGroup.accommodation':   'Accommodation',
  'typeGroup.attraction':      'Attraction',
  'typeGroup.custom':          'Custom',

  // ─── Stay subtypes ───
  'stay.hotel':                'Hotel',
  'stay.apartment':            'Apartment',
  'stay.hostel':               'Hostel',
  'stay.airbnb':               'Airbnb',
  'stay.camping':              'Camping',
  'stay.resort':               'Resort',
  'stay.guesthouse':           'Guesthouse',

  // ─── File categories ───
  'cat.activity':              'Activity',
  'cat.stay':                  'Stay',
  'cat.transport':             'Transportation',
  'cat.insurance':             'Insurance',
  'cat.customs':               'Customs',
  'cat.other':                 'Other',

  // ─── Tag types ───
  'tag.price':                 'Price',
  'tag.paid':                  'Paid',
  'tag.unpaid':                'Unpaid',
  'tag.waiting':               'Waiting',
  'tag.idRef':                 'ID / Ref',

  // ─── Insurance / Customs defaults ───
  'default.travelInsurance':   'Travel Insurance',
  'default.customs':           'Customs',

  // ─── Theme / Language / Style UI ───
  'ui.theme':                  'Theme',
  'ui.language':               'Language',
  'ui.dark':                   'Dark',
  'ui.light':                  'Light',
  'ui.cardStyle':              'Card Style',
  'ui.classic':                'Classic',
  'ui.bento':                  'Bento',
  'ui.minimal':                'Minimal',

  // ─── Placeholders that contain example content ───
  'ph.subtitle':               'e.g. 28 April \u2013 22 May \u00B7 25 days \u00B7 6 cities',
  'ph.stayDetail':             'Double Room \u00B7 5 nights \u00B7 Check-out 10:00',
  'ph.carrierEx':              'AF 274 \u00B7 Air France',
  'ph.fromEx':                 'Tokyo (HND)',
  'ph.toEx':                   'Osaka (KIX)',
  'ph.nara':                   'Nara, Nikko...',

  // ─── Day / Month names (short) ───
  'day.sun': 'Sun', 'day.mon': 'Mon', 'day.tue': 'Tue', 'day.wed': 'Wed',
  'day.thu': 'Thu', 'day.fri': 'Fri', 'day.sat': 'Sat',
  'month.jan': 'Jan', 'month.feb': 'Feb', 'month.mar': 'Mar', 'month.apr': 'Apr',
  'month.may': 'May', 'month.jun': 'Jun', 'month.jul': 'Jul', 'month.aug': 'Aug',
  'month.sep': 'Sep', 'month.oct': 'Oct', 'month.nov': 'Nov', 'month.dec': 'Dec',
};

const TRANSLATIONS_PTBR = {
  // ─── Page / Picker ───
  'page.title':                'Planejador de Viagens',
  'picker.title.trip':         'Planejador',
  'picker.title.planner':      'de Viagens',
  'picker.subtitle':           'Sua linha do tempo pessoal de viagens \u00B7 Nenhum dado enviado a servidores',
  'picker.selectFolder':       'Selecione a pasta da viagem',
  'picker.hint':               'Cont\u00E9m seu JSON de configura\u00E7\u00E3o + documentos',
  'picker.loadSample':         'Carregar viagem de exemplo',
  'picker.or':                 'ou',

  // ─── Buttons ───
  'btn.newTrip':               'Nova Viagem',
  'btn.changeTrip':            'Trocar Viagem',
  'btn.edit':                  'Editar',
  'btn.loadDocs':              'Carregar Documentos',
  'btn.documents':             'Documentos',
  'btn.selectFolder':          'Selecionar Pasta',
  'btn.selectFiles':           'Selecionar Arquivos',
  'btn.save':                  'Salvar',
  'btn.cancel':                'Cancelar',

  // ─── Feature pills ───
  'feat.timeline':             'Linha do tempo',
  'feat.budget':               'Controle de gastos',
  'feat.maps':                 'Links de mapa',
  'feat.docs':                 'Documentos e passagens',
  'feat.routes':               'Rotas multi-cidades',
  'feat.accommodation':        'Hospedagem',
  'feat.food':                 'Comida e dicas',
  'feat.tags':                 'Tags e categorias',

  // ─── Alerts / Messages ───
  'alert.noJson':              'Nenhum arquivo JSON encontrado nesta pasta.\nSelecione uma pasta contendo seu arquivo trip-config.json.',
  'alert.invalidJson':         'JSON inv\u00E1lido em',
  'alert.invalidFile':         'Arquivo JSON inv\u00E1lido:',
  'docs.none':                 'Nenhum documento referenciado',
  'docs.loaded':               'documentos carregados',
  'docs.noDocs':               'Sem Docs',
  'docs.allLoaded':            'Carregados \u2713',
  'docs.load':                 'Carregar',
  'docs.doc':                  'Doc',
  'docs.docs':                 'Docs',

  // ─── Display — Header ───
  'display.myTrip':            'Minha Viagem',
  'display.paid':              'Pago',

  // ─── Display — Legend ───
  'legend.transport':          'Transporte',
  'legend.stay':               'Estadia',
  'legend.temple':             'Templo',
  'legend.museum':             'Museu',
  'legend.park':               'Parque',
  'legend.market':             'Mercado',
  'legend.viewpoint':          'Mirante',
  'legend.nightlife':          'Vida Noturna',
  'legend.district':           'Bairro',

  // ─── Display — Card ───
  'card.map':                  'Mapa',
  'card.call':                 'Ligar',
  'card.email':                'E-mail',
  'card.tips':                 'Dicas',
  'card.documents':            'Documentos',
  'card.collapse':             '\u25B2 Recolher',

  // ─── Display — Timeline ───
  'timeline.night':            'noite',
  'timeline.nights':           'noites',
  'timeline.dayTrip':          'bate-volta',

  // ─── Display — Country Summary ───
  'summary.nights':            'noites',
  'summary.flights':           'voos',
  'summary.trains':            'trens',
  'summary.activities':        'atividades',
  'summary.foodTips':          'dicas gastr.',
  'summary.paid':              'pago',
  'summary.toPay':             'a pagar',

  // ─── Editor — Sections ───
  'ed.tripInfo':               '\uD83D\uDDFA\uFE0F Info da Viagem',
  'ed.route':                  '\uD83E\uDDED Rota',
  'ed.badges':                 '\uD83C\uDFF7\uFE0F Selos do Cabe\u00E7alho',
  'ed.days':                   '\uD83D\uDCC5 Dias',
  'ed.tripEditor':             'Editor de Viagem',

  // ─── Editor — Labels ───
  'ed.title':                  'T\u00EDtulo',
  'ed.year':                   'Ano',
  'ed.subtitle':               'Subt\u00EDtulo',
  'ed.auto':                   'Auto',
  'ed.selectCountry':          '\uD83C\uDFF3\uFE0F Selecionar pa\u00EDs',
  'ed.cityName':               'Nome da cidade',
  'ed.moveUp':                 'Mover para cima',
  'ed.moveDown':               'Mover para baixo',
  'ed.remove':                 'Remover',
  'ed.stops':                  'paradas',
  'ed.addStop':                '+ Adicionar Parada',
  'ed.city':                   'Cidade',
  'ed.baseCity':               'Cidade Base',
  'ed.selectCity':             '\u2014 Selecionar cidade \u2014',
  'ed.date':                   'Data',
  'ed.dayTrip':                'Bate-volta',
  'ed.destination':            'Destino',
  'ed.cards':                  'cart\u00F5es',
  'ed.unknownCity':            'Desconhecida',
  'ed.newDay':                 'Novo Dia',
  'ed.newCard':                'Novo Cart\u00E3o',

  // ─── Editor — Badges ───
  'ed.esim':                   'eSIM',
  'ed.insurance':              'Seguro',
  'ed.customs':                'Alfândega',
  'ed.label':                  'R\u00F3tulo',
  'ed.price':                  'Pre\u00E7o',
  'ed.status':                 'Status',
  'ed.paidOpt':                'Pago',
  'ed.unpaidOpt':              'N\u00E3o pago',
  'ed.noneOpt':                'Nenhum',
  'ed.filePath':               'Caminho do arquivo',
  'ed.addEsim':                '+ eSIM',
  'ed.addInsurance':           '+ Seguro',
  'ed.addCustoms':             '+ Alf\u00E2ndega',
  'ed.addCustomBadge':         '+ Selo Personalizado',
  'ed.addCertificate':         '+ Certificado',
  'ed.addDocument':            '+ Documento',
  'ed.addItem':                '+ Item',
  'ed.badgeName':              'Nome do selo',
  'ed.borderColor':            'Cor da Borda',
  'ed.type':                   'Tipo',
  'ed.simpleType':             'Simples (arquivo \u00FAnico)',
  'ed.multiType':              'M\u00FAltiplo (itens por pa\u00EDs)',
  'ed.file':                   'Arquivo',

  // ─── Editor — Days ───
  'ed.sortDays':               'Ordenar dias:',
  'ed.dateAsc':                '\u2191 Data',
  'ed.dateDesc':               '\u2193 Data',
  'ed.addDay':                 '+ Adicionar Dia',
  'ed.removeDay':              'Remover este dia inteiro?',
  'ed.discardChanges':         'Você tem alterações não salvas. Descartar?',
  'ed.defineRouteFirst':       'Defina a rota primeiro',
  'ed.routeRequired':          'A rota deve ser definida antes de planejar os dias',
  'ed.notInRoute':             'fora da rota',

  // ─── Editor — Food / Files / Cards ───
  'ed.foodTips':               '\uD83C\uDF5B Dicas Gastron\u00F4micas',
  'ed.dishName':               'Nome do prato',
  'ed.description':            'Descri\u00E7\u00E3o',
  'ed.addFoodTip':             '+ Dica Gastron\u00F4mica',
  'ed.files':                  '\uD83D\uDCCE Arquivos',
  'ed.filename':               'arquivo.pdf',
  'ed.displayLabel':           'R\u00F3tulo de exibi\u00E7\u00E3o',
  'ed.addFile':                '+ Arquivo',
  'ed.cardsSection':           '\uD83D\uDCCB Cart\u00F5es',
  'ed.sortCards':              'Ordenar cart\u00F5es:',
  'ed.timeAsc':                '\u2191 Hor\u00E1rio',
  'ed.timeDesc':               '\u2193 Hor\u00E1rio',
  'ed.typeAsc':                '\u2191 Tipo',
  'ed.nameAsc':                '\u2191 Nome',
  'ed.nameDesc':               '\u2193 Nome',
  'ed.addCard':                '+ Adicionar Cart\u00E3o',
  'ed.customOpt':              'Personalizado...',

  // ─── Editor — Card Fields ───
  'ed.icon':                   '\u00CDcone',
  'ed.startTime':              'Hora In\u00EDcio',
  'ed.endTime':                'Hora Fim',
  'ed.cardTitle':              'T\u00EDtulo do cart\u00E3o',
  'ed.from':                   'De',
  'ed.to':                     'Para',
  'ed.carrier':                'Companhia',
  'ed.subtitleDetails':        'Subt\u00EDtulo / Detalhes',
  'ed.cityOverride':           'Cidade (opcional)',
  'ed.cityOverrideHint':       'Deixe vazio para usar a cidade do dia',
  'ed.mapsAddress':            'Mapa / Endere\u00E7o',
  'ed.mapsHint':               'Endere\u00E7o completo para o Google Maps',
  'ed.phone':                  'Telefone',
  'ed.email':                  'E-mail',
  'ed.tags':                   'Tags',
  'ed.addTag':                 '+ Tag',
  'ed.tips':                   'Dicas',
  'ed.addTip':                 '+ Dica',

  // ─── Editor — Prompts ───
  'ed.enterEmoji':             'Digite um \u00FAnico emoji:',
  'ed.enterTypeName':          'Digite o nome do tipo (ex: "Dia de Praia"):',
  'ed.enterTypeIcon':          'Digite um emoji para este tipo (ex: \uD83C\uDFD6\uFE0F):',

  // ─── Editor — Toast ───
  'toast.saved':               '\u2713 Viagem salva',
  'toast.downloaded':          '\u2713 Config baixada',

  // ─── Editor — Confirm ───
  'confirm.removeCity1':       'Remover \u201C',
  'confirm.removeCity2':       '\u201D ir\u00E1 limp\u00E1-la destes dias:',
  'confirm.proceed':           'Prosseguir?',

  // ─── Subtitle generation ───
  'sub.days':                  'dias',
  'sub.cities':                'cidades',

  // ─── Card type labels ───
  'type.flight':               'Voo',
  'type.train':                'Trem',
  'type.bus':                  '\u00D4nibus',
  'type.ferry':                'Balsa',
  'type.taxiCar':              'T\u00E1xi / Carro',
  'type.hotel':                'Hotel',
  'type.checkout':             'Check-out',
  'type.templeshrine':         'Templo / Santu\u00E1rio',
  'type.museum':               'Museu',
  'type.parkgarden':           'Parque / Jardim',
  'type.market':               'Mercado',
  'type.viewpoint':            'Mirante',
  'type.aquarium':             'Aqu\u00E1rio',
  'type.zoo':                  'Zool\u00F3gico',
  'type.streetdistrict':       'Rua / Bairro',
  'type.nightlifedining':      'Vida Noturna / Gastr.',
  'type.monument':             'Monumento',
  'type.activity':             'Atividade',

  // ─── Card type groups ───
  'typeGroup.transport':       'Transporte',
  'typeGroup.accommodation':   'Hospedagem',
  'typeGroup.attraction':      'Atra\u00E7\u00E3o',
  'typeGroup.custom':          'Personalizado',

  // ─── Stay subtypes ───
  'stay.hotel':                'Hotel',
  'stay.apartment':            'Apartamento',
  'stay.hostel':               'Hostel',
  'stay.airbnb':               'Airbnb',
  'stay.camping':              'Camping',
  'stay.resort':               'Resort',
  'stay.guesthouse':           'Pousada',

  // ─── File categories ───
  'cat.activity':              'Atividade',
  'cat.stay':                  'Estadia',
  'cat.transport':             'Transporte',
  'cat.insurance':             'Seguro',
  'cat.customs':               'Alf\u00E2ndega',
  'cat.other':                 'Outro',

  // ─── Tag types ───
  'tag.price':                 'Pre\u00E7o',
  'tag.paid':                  'Pago',
  'tag.unpaid':                'N\u00E3o pago',
  'tag.waiting':               'Aguardando',
  'tag.idRef':                 'ID / Ref',

  // ─── Insurance / Customs defaults ───
  'default.travelInsurance':   'Seguro Viagem',
  'default.customs':           'Alf\u00E2ndega',

  // ─── Theme / Language / Style UI ───
  'ui.theme':                  'Tema',
  'ui.language':               'Idioma',
  'ui.dark':                   'Escuro',
  'ui.light':                  'Claro',
  'ui.cardStyle':              'Estilo',
  'ui.classic':                'Cl\u00E1ssico',
  'ui.bento':                  'Bento',
  'ui.minimal':                'Minimal',

  // ─── Placeholders ───
  'ph.subtitle':               'ex: 28 Abril \u2013 22 Maio \u00B7 25 dias \u00B7 6 cidades',
  'ph.stayDetail':             'Quarto Duplo \u00B7 5 noites \u00B7 Check-out 10:00',
  'ph.carrierEx':              'AF 274 \u00B7 Air France',
  'ph.fromEx':                 'T\u00F3quio (HND)',
  'ph.toEx':                   'Osaka (KIX)',
  'ph.nara':                   'Nara, Nikko...',

  // ─── Day / Month names (short) ───
  'day.sun': 'Dom', 'day.mon': 'Seg', 'day.tue': 'Ter', 'day.wed': 'Qua',
  'day.thu': 'Qui', 'day.fri': 'Sex', 'day.sat': 'S\u00E1b',
  'month.jan': 'Jan', 'month.feb': 'Fev', 'month.mar': 'Mar', 'month.apr': 'Abr',
  'month.may': 'Mai', 'month.jun': 'Jun', 'month.jul': 'Jul', 'month.aug': 'Ago',
  'month.sep': 'Set', 'month.oct': 'Out', 'month.nov': 'Nov', 'month.dec': 'Dez',
};

/**
 * Translate a key to the current language.
 * @param {string} key
 * @returns {string}
 */
function t(key) {
  if (currentLang === 'pt-BR') return TRANSLATIONS_PTBR[key] || TRANSLATIONS[key] || key;
  return TRANSLATIONS[key] || key;
}

/**
 * Set language and re-render the active view.
 */
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('tp-lang', lang);
  document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : 'en';
  document.title = t('page.title');

  // Update lang toggle button states
  document.querySelectorAll('.tp-lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  // Update settings labels
  applySettingsLabels();

  // Update type labels dynamically
  refreshTypeLabels();

  // Re-render if trip is loaded
  if (TRIP_CONFIG) {
    applyPickerTranslations();
    applyTripViewTranslations();
    renderHeader();
    renderLegend();
    renderTimeline();
    positionRailLines();
  } else {
    applyPickerTranslations();
  }

  // If editor is open, re-render it
  if (editorData) renderEditorForm();
}

/**
 * Refresh TYPE_META, CARD_TYPES, etc. labels from i18n.
 */
function refreshTypeLabels() {
  const typeMap = {
    flight: 'type.flight', transit: 'type.train', bus: 'type.bus', ferry: 'type.ferry',
    taxi: 'type.taxiCar', stay: 'type.hotel', checkout: 'type.checkout',
    temple: 'type.templeshrine', museum: 'type.museum', park: 'type.parkgarden',
    market: 'type.market', viewpoint: 'type.viewpoint', aquarium: 'type.aquarium',
    zoo: 'type.zoo', street: 'type.streetdistrict', nightlife: 'type.nightlifedining',
    monument: 'type.monument', activity: 'type.activity',
  };
  for (const [key, tKey] of Object.entries(typeMap)) {
    if (TYPE_META[key]) TYPE_META[key].label = t(tKey);
  }

  // Update CARD_TYPES group names and item labels
  const groupKeys = ['typeGroup.transport', 'typeGroup.accommodation', 'typeGroup.attraction', 'typeGroup.custom'];
  for (let gi = 0; gi < CARD_TYPES.length && gi < groupKeys.length; gi++) {
    CARD_TYPES[gi].group = t(groupKeys[gi]);
    for (const item of CARD_TYPES[gi].items) {
      if (typeMap[item.value]) item.label = t(typeMap[item.value]);
    }
  }

  // Update CAT_LABEL
  CAT_LABEL.activity = t('cat.activity');
  CAT_LABEL.stay = t('cat.stay');
  CAT_LABEL.transport = t('cat.transport');
  CAT_LABEL.insurance = t('cat.insurance');
  CAT_LABEL.customs = t('cat.customs');
  CAT_LABEL.other = t('cat.other');

  // Update TAG_TYPES
  const tagMap = { price: 'tag.price', paid: 'tag.paid', unpaid: 'tag.unpaid', waiting: 'tag.waiting', id: 'tag.idRef' };
  for (const tt of TAG_TYPES) {
    if (tagMap[tt.value]) tt.label = t(tagMap[tt.value]);
  }

  // Update STAY_SUBTYPES
  const stayMap = { hotel: 'stay.hotel', apartment: 'stay.apartment', hostel: 'stay.hostel', airbnb: 'stay.airbnb', camping: 'stay.camping', resort: 'stay.resort', guesthouse: 'stay.guesthouse' };
  for (const st of STAY_SUBTYPES) {
    if (stayMap[st.value]) st.label = t(stayMap[st.value]);
  }

  // Update country names
  refreshCountryNames();
}

/**
 * PT-BR country name map (flag → Portuguese name).
 */
const COUNTRY_NAMES_PTBR = {
  '🇦🇫': 'Afeganist\u00E3o', '🇦🇱': 'Alb\u00E2nia', '🇩🇿': 'Arg\u00E9lia',
  '🇦🇷': 'Argentina', '🇦🇺': 'Austr\u00E1lia', '🇦🇹': '\u00C1ustria',
  '🇧🇪': 'B\u00E9lgica', '🇧🇷': 'Brasil', '🇧🇬': 'Bulg\u00E1ria',
  '🇰🇭': 'Camboja', '🇨🇦': 'Canad\u00E1', '🇨🇱': 'Chile',
  '🇨🇳': 'China', '🇨🇴': 'Col\u00F4mbia', '🇭🇷': 'Cro\u00E1cia',
  '🇨🇺': 'Cuba', '🇨🇿': 'Tch\u00E9quia', '🇩🇰': 'Dinamarca',
  '🇪🇬': 'Egito', '🇪🇪': 'Est\u00F4nia', '🇫🇮': 'Finl\u00E2ndia',
  '🇫🇷': 'Fran\u00E7a', '🇩🇪': 'Alemanha', '🇬🇷': 'Gr\u00E9cia',
  '🇭🇰': 'Hong Kong', '🇭🇺': 'Hungria', '🇮🇸': 'Isl\u00E2ndia',
  '🇮🇳': '\u00CDndia', '🇮🇩': 'Indon\u00E9sia', '🇮🇪': 'Irlanda',
  '🇮🇱': 'Israel', '🇮🇹': 'It\u00E1lia', '🇯🇵': 'Jap\u00E3o',
  '🇯🇴': 'Jord\u00E2nia', '🇰🇪': 'Qu\u00EAnia', '🇰🇷': 'Coreia do Sul',
  '🇱🇻': 'Let\u00F4nia', '🇱🇹': 'Litu\u00E2nia', '🇲🇾': 'Mal\u00E1sia',
  '🇲🇽': 'M\u00E9xico', '🇲🇦': 'Marrocos', '🇲🇲': 'Mianmar',
  '🇳🇱': 'Pa\u00EDses Baixos', '🇳🇿': 'Nova Zel\u00E2ndia', '🇳🇬': 'Nig\u00E9ria',
  '🇳🇴': 'Noruega', '🇵🇰': 'Paquist\u00E3o', '🇵🇪': 'Peru',
  '🇵🇭': 'Filipinas', '🇵🇱': 'Pol\u00F4nia', '🇵🇹': 'Portugal',
  '🇷🇴': 'Rom\u00EAnia', '🇷🇺': 'R\u00FAssia', '🇸🇦': 'Ar\u00E1bia Saudita',
  '🇸🇬': 'Singapura', '🇸🇰': 'Eslov\u00E1quia', '🇸🇮': 'Eslov\u00EAnia',
  '🇿🇦': '\u00C1frica do Sul', '🇪🇸': 'Espanha', '🇱🇰': 'Sri Lanka',
  '🇸🇪': 'Su\u00E9cia', '🇨🇭': 'Su\u00ED\u00E7a', '🇹🇼': 'Taiwan',
  '🇹🇭': 'Tail\u00E2ndia', '🇹🇷': 'Turquia', '🇺🇦': 'Ucr\u00E2nia',
  '🇦🇪': 'Emirados \u00C1rabes', '🇬🇧': 'Reino Unido', '🇺🇸': 'Estados Unidos',
  '🇻🇳': 'Vietn\u00E3',
};

/**
 * Update COUNTRY_FLAGS[].name and FLAG_TO_COUNTRY for current language.
 */
function refreshCountryNames() {
  for (const c of COUNTRY_FLAGS) {
    // Store original English name on first call
    if (!c._nameEN) c._nameEN = c.name;
    if (currentLang === 'pt-BR' && COUNTRY_NAMES_PTBR[c.flag]) {
      c.name = COUNTRY_NAMES_PTBR[c.flag];
    } else {
      c.name = c._nameEN;
    }
    FLAG_TO_COUNTRY[c.flag] = c.name;
  }
}

/**
 * Update the settings popover labels.
 */
function applySettingsLabels() {
  const lblTheme = document.getElementById('tp-lbl-theme');
  if (lblTheme) lblTheme.textContent = t('ui.theme');
  const lblLang = document.getElementById('tp-lbl-lang');
  if (lblLang) lblLang.textContent = t('ui.language');
  const lblStyle = document.getElementById('tp-lbl-style');
  if (lblStyle) lblStyle.textContent = t('ui.cardStyle');
  // Update theme button text
  document.querySelectorAll('.tp-theme-btn').forEach(b => {
    b.textContent = b.dataset.theme === 'dark' ? t('ui.dark') : t('ui.light');
  });
  // Update card style button text
  document.querySelectorAll('.tp-style-btn').forEach(b => {
    const key = 'ui.' + b.dataset.style;
    b.textContent = t(key);
  });
}

/**
 * Update picker view text content with current translations.
 */
function applyPickerTranslations() {
  const el = (id) => document.getElementById(id);
  // Picker
  const title = document.querySelector('.picker-title');
  if (title) title.innerHTML = `${t('picker.title.trip')} <em>${t('picker.title.planner')}</em>`;
  const sub = document.querySelector('.picker-subtitle');
  if (sub) sub.textContent = t('picker.subtitle');
  const label = el('picker-label');
  if (label) label.textContent = t('picker.selectFolder');
  const hint = el('picker-hint');
  if (hint) hint.textContent = t('picker.hint');
  const sample = el('load-sample');
  if (sample) sample.textContent = t('picker.loadSample');
  const orSpan = document.querySelector('.picker-or');
  if (orSpan) orSpan.textContent = t('picker.or');

  // Buttons
  const newBtn = el('new-trip-btn');
  if (newBtn) newBtn.textContent = '\u270F\uFE0F ' + t('btn.newTrip');
  const changeBtn = el('change-trip-btn');
  if (changeBtn) changeBtn.textContent = '\uD83D\uDCCB ' + t('btn.changeTrip');
  const editBtn = el('edit-trip-btn');
  if (editBtn) editBtn.textContent = '\u270F\uFE0F ' + t('btn.edit');
  const docsBtn = el('load-docs-btn');
  if (docsBtn && (!TRIP_CONFIG || ALL_REQUIRED_FILES.length === 0)) {
    docsBtn.textContent = '\uD83D\uDCCE ' + t('btn.loadDocs');
  }
  const panelTitle = el('docs-panel-title');
  if (panelTitle) panelTitle.textContent = '\uD83D\uDCCE ' + t('btn.documents');
  const folderBtn = el('select-folder-btn');
  if (folderBtn) folderBtn.textContent = '\uD83D\uDCC1 ' + t('btn.selectFolder');
  const filesBtn = el('select-files-btn');
  if (filesBtn) filesBtn.textContent = '\uD83D\uDCC4 ' + t('btn.selectFiles');
  const saveBtn = el('editor-save-btn');
  if (saveBtn) saveBtn.textContent = '\uD83D\uDCBE ' + t('btn.save');

  // Editor toolbar
  const toolbarTitle = document.querySelector('.editor-toolbar-title');
  if (toolbarTitle) toolbarTitle.textContent = t('ed.tripEditor');
  const cancelBtn = document.querySelector('.editor-btn-cancel');
  if (cancelBtn) cancelBtn.textContent = t('btn.cancel');

  // Feature pills
  const featuresCt = el('picker-features');
  if (featuresCt) {
    const features = [
      ['\uD83C\uDF0F', t('feat.timeline')],
      ['\uD83D\uDCB0', t('feat.budget')],
      ['\uD83D\uDCCD', t('feat.maps')],
      ['\uD83D\uDCC4', t('feat.docs')],
      ['\u2708\uFE0F', t('feat.routes')],
      ['\uD83C\uDFE8', t('feat.accommodation')],
      ['\uD83C\uDF72', t('feat.food')],
      ['\uD83C\uDFF7\uFE0F', t('feat.tags')]
    ];
    featuresCt.innerHTML = features.map(([icon, text]) =>
      `<span class="picker-feature">${icon} ${text}</span>`
    ).join('');
  }
}

/**
 * Translate trip-view buttons.
 */
function applyTripViewTranslations() {
  const changeBtn = document.getElementById('change-trip-btn');
  if (changeBtn) changeBtn.textContent = '\uD83D\uDCCB ' + t('btn.changeTrip');
  const editBtn = document.getElementById('edit-trip-btn');
  if (editBtn) editBtn.textContent = '\u270F\uFE0F ' + t('btn.edit');
  // updateDocsButtonState will handle docs button text
  if (TRIP_CONFIG) updateDocsButtonState();
}

// ─── Theme ───

let currentTheme = localStorage.getItem('tp-theme') || 'dark';

function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('tp-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  // Update toggle button states
  const btns = document.querySelectorAll('.tp-theme-btn');
  btns.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
}

function initPreferences() {
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.documentElement.lang = currentLang === 'pt-BR' ? 'pt-BR' : 'en';
  document.title = t('page.title');
  // refreshTypeLabels is called from initApp() after all scripts are loaded
}

// Initialize preferences immediately (before DOMContentLoaded)
initPreferences();
