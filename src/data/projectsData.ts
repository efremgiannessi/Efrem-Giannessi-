export interface ArchitecturalProject {
  id: string;
  title: string;
  subtitle: string;
  category: 'residenziale' | 'terziario' | 'industriale' | 'recupero' | 'staging';
  categoryLabel: string;
  year: string;
  location: string;
  areaM2: number;
  lod: string;
  estimatedValueEur: string;
  summary: string;
  description: string;
  highlights: string[];
  coverImage: string;
  galleryImages: string[];
  specs: {
    structure: string;
    envelope: string;
    energyClass: string;
    software: string;
    standard: string;
  };
  bimData: {
    elementsCount: number;
    clashDetected: number;
    clashResolved: number;
    qtoAccuracy: string;
    wbsLevels: number;
  };
  hasVirtualStaging?: boolean;
  hasCadCompare?: boolean;
}

export const ARCHITECTURAL_PROJECTS: ArchitecturalProject[] = [
  {
    id: 'residenza-orizzonte',
    title: 'Residenza Orizzonte',
    subtitle: 'Villa Ipogea e Bioclimatica a Patio',
    category: 'residenziale',
    categoryLabel: 'Residenziale di Pregio',
    year: '2025',
    location: 'Pietrasanta (LU), Versilia',
    areaM2: 520,
    lod: 'LOD 400',
    estimatedValueEur: '€ 1.850.000',
    summary: 'Architettura residenziale contemporanea integrata nel declivio collinare, concepita integralmente in ambiente BIM con pareti massive in calcestruzzo a vista e schermature frangisole dinamiche.',
    description: 'Il progetto nasce dall’esigenza di fondere il volume abitativo con l’orografia naturale. Sviluppato interamente in Revit con famiglie parametriche su misura, il modello ha permesso di estrarre il computo metrico estimativo al 100% prima dell’apertura cantiere, azzerando le varianti di spesa per le opere in c.a. e per i serramenti speciali a filo muro.',
    highlights: [
      'Modellazione parametrica LOD 400 per stratigrafie murarie e nodi termici',
      'Quantity Takeoff (QTO) con computo 5D automatico e prezzario regionale Toscana',
      'Controllo bioclimatico con simulazione d’irraggiamento e comfort estivo',
      'Zero varianti e scostamento di spesa cantiere contenuto sotto lo 0.4%',
    ],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85',
    ],
    specs: {
      structure: 'Calcestruzzo Armato C28/35 faccia a vista con casseri in doghe',
      envelope: 'Isolamento a cappotto in lana di roccia 16cm + facciata ventilata in zinco-titanio',
      energyClass: 'Edificio a Energia Quasi Zero (NZEB) - Classe A4',
      software: 'Autodesk Revit 2025, pyRevit Studio Suite, Twinmotion, STR Vision CPM',
      standard: 'Conformità OpenBIM IFC4, UNI 11337, ISO 19650',
    },
    bimData: {
      elementsCount: 4820,
      clashDetected: 142,
      clashResolved: 142,
      qtoAccuracy: '99.8%',
      wbsLevels: 5,
    },
    hasCadCompare: true,
  },
  {
    id: 'hq-direzionale-navile',
    title: 'Headquarter Navile',
    subtitle: 'Complesso Uffici Terziari e Laboratori',
    category: 'terziario',
    categoryLabel: 'Direzionale & Terziario',
    year: '2024',
    location: 'Bologna',
    areaM2: 4300,
    lod: 'LOD 400',
    estimatedValueEur: '€ 8.200.000',
    summary: 'Nuovo polo direzionale a 4 livelli fuori terra con facciata continua a cellule e involucro trasparente performante, coordinato con modello federato interdisciplinare (ARC, STR, MEP).',
    description: 'Gestione del coordinamento BIM secondo protocollo ISO 19650 con CDE cloud dedicato. La Clash Detection preventiva ha identificato oltre 320 interferenze critiche tra canalizzazioni aerauliche primarie e travi reticolari in acciaio prima della produzione in officina, generando un risparmio stimato di oltre € 75.000 in manodopera edili e ritardi.',
    highlights: [
      'Modello BIM Federato OpenBIM (Architettura, Strutture Metalliche, Impianti MEP)',
      'Clash Detection automatizzata con esportazione report BCF verso i costruttori',
      'Sincronizzazione 4D del cronoprogramma per montaggio elementi prefabbricati',
      'Computo metrico estimativo WBS collegato a prezzario nazionale DEI',
    ],
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=85',
    ],
    specs: {
      structure: 'Telaio spaziale in travi e pilastri in acciaio S355 con solai collaboranti in lamiera grecata',
      envelope: 'Facciata a cellule vetrate a triplo strato selettivo basso-emissivo Ug 0.6',
      energyClass: 'Certificazione LEED Gold Compliant - Classe A3',
      software: 'Revit 2024, Navisworks Manage, pyRevit QTO Exporter, Solibri Model Checker',
      standard: 'ISO 19650-1/2, UNI 11337-4/5, Standard IFC2x3 e IFC4',
    },
    bimData: {
      elementsCount: 22600,
      clashDetected: 328,
      clashResolved: 328,
      qtoAccuracy: '99.5%',
      wbsLevels: 6,
    },
    hasCadCompare: true,
  },
  {
    id: 'ex-filanda-manifattura',
    title: 'Ex Filanda Manifattura',
    subtitle: 'Riconversione e Recupero Archeologia Industriale',
    category: 'recupero',
    categoryLabel: 'Recupero & Rigenerazione',
    year: '2024',
    location: 'Firenze Nord',
    areaM2: 2800,
    lod: 'LOD 350',
    estimatedValueEur: '€ 3.650.000',
    summary: 'Riconversione di un opificio industriale di inizio Novecento in polo polifunzionale per startup, coworking e galleria d’arte contemporanea, con rilievo laser scanner e Scan-to-BIM.',
    description: 'Processo completo di digitalizzazione da rilievo con nuvola di punti 3D ad alta densità (Laser Scanner Faro) alla restituzione in modello parametrico as-built. Gli script custom pyRevit hanno permesso di riconoscere e categorizzare automaticamente oltre 180 capriate storiche in ferro chiodato e murature a sacco irregolari.',
    highlights: [
      'Workflow Scan-to-BIM con accuratezza millimetrica dello stato di fatto',
      'Catalogazione digitale dei componenti storici da preservare e consolidare',
      'Computo degli interventi di miglioramento sismico e isolamento termico interno',
      'Integrazione di passerelle sospese in carpenteria metallica leggera',
    ],
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=85',
    ],
    specs: {
      structure: 'Muratura storica in laterizio e pietra con cerchiature in acciaio e micropali',
      envelope: 'Controparete termica interna in calcio-silicato traspirante e infissi a profilo minimale',
      energyClass: 'Riqualificazione da G a Classe B con impianto geotermico e VRF',
      software: 'Autodesk Revit, CloudCompare, Dynamo Visual Logic, Primus Computo',
      standard: 'Linee Guida Ministero Beni Culturali per il restauro & OpenBIM',
    },
    bimData: {
      elementsCount: 11400,
      clashDetected: 94,
      clashResolved: 94,
      qtoAccuracy: '98.9%',
      wbsLevels: 4,
    },
    hasCadCompare: true,
  },
  {
    id: 'logistica-interporto',
    title: 'Hub Logistico Cold-Chain',
    subtitle: 'Piattaforma a Temperatura Controllata',
    category: 'industriale',
    categoryLabel: 'Industriale & Logistica',
    year: '2025',
    location: 'Parma Interporto',
    areaM2: 14500,
    lod: 'LOD 400',
    estimatedValueEur: '€ 14.800.000',
    summary: 'Grande complesso logistico industriale con celle frigorifere a -25°C, campate strutturali da 30 metri in C.A.P. e baie di carico automatizzate con monitoraggio 4D/5D.',
    description: 'La commessa ha richiesto lo sviluppo di un apposito Add-in C# per Autodesk Revit, creato su misura dallo studio per estrarre le superfici di pannelli sandwich isolanti e quantificare in tempo reale i ponti termici lungo le 42 baie di carico. Riduzione dei tempi di redazione del computo metrico da 3 settimane a sole 4 ore.',
    highlights: [
      'Sviluppo di plugin proprietario Revit per estrazione massiva computi sandwich',
      'Modellazione strutturale ad alto dettaglio con armature singole nei nodi critici',
      'Pianificazione 4D di cantiere con sequenze di getto e montaggio prefabbricati',
      'Quadri economici comparativi con tolleranza di cantiere inferiore allo 0.2%',
    ],
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1600&q=85',
    ],
    specs: {
      structure: 'Pilastri e tegoli binervati in calcestruzzo armato precompresso (C.A.P.)',
      envelope: 'Pannelli sandwich in poliuretano espanso (PUR) spessore 20cm a giunto labirinto',
      energyClass: 'Edificio logistico a compensazione fotovoltaica totale (1.2 MWp)',
      software: 'Revit 2025, Add-in Custom C# .NET 8, pyRevit, STR Vision CPM',
      standard: 'UNI 11337-4, ISO 19650, Certificazione IFS Logistics',
    },
    bimData: {
      elementsCount: 38400,
      clashDetected: 410,
      clashResolved: 410,
      qtoAccuracy: '99.9%',
      wbsLevels: 7,
    },
    hasCadCompare: false,
  },
  {
    id: 'penthouse-san-martino',
    title: 'Attico San Martino',
    subtitle: 'Ristrutturazione & Virtual Staging Fotorealistico',
    category: 'staging',
    categoryLabel: 'Virtual Staging 3D',
    year: '2025',
    location: 'Lucca Centro Storico',
    areaM2: 240,
    lod: 'LOD 350 / PBR Render',
    estimatedValueEur: '€ 920.000',
    summary: 'Riqualificazione totale di un attico con travi a vista: dall’immobile a rustico non arredato alla simulazione fotorealistica 3D di finiture, palette cromatiche e arredi su misura.',
    description: 'Grazie al Virtual Staging immersivo a 360° e ai render fotorealistici con materiali PBR fisicamente corretti, il committente ha venduto l’immobile su carta prima del completamento delle opere murarie, consentendo agli acquirenti di personalizzare pavimenti in rovere naturale e dettagli in ottone satinato.',
    highlights: [
      'Confronto interattivo Prima / Dopo per la valorizzazione immobiliare',
      'Modellazione 3D arredi su misura con calcolo preciso delle quote esecutive',
      'Accelerazione vendite su carta del 65% per il developer immobiliare',
      'Computo metrico preventivo arredi e finiture d’interni chiavi in mano',
    ],
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
    ],
    specs: {
      structure: 'Recupero solai lignei originali con travi e travicelli trattati a cera',
      envelope: 'Tramezzature a secco ad alto isolamento acustico Knauf Diamant 60 dB',
      energyClass: 'Classe A2 con riscaldamento radiante a pavimento a basso spessore',
      software: 'Revit 2025, 3ds Max, V-Ray GPU Path Tracing, Photoshop',
      standard: 'Norme UNI EN 12354 acustica edilizia & capitolati finiture PBR',
    },
    bimData: {
      elementsCount: 2950,
      clashDetected: 24,
      clashResolved: 24,
      qtoAccuracy: '99.2%',
      wbsLevels: 3,
    },
    hasVirtualStaging: true,
  },
];

export function getProjectById(id: string): ArchitecturalProject | undefined {
  return ARCHITECTURAL_PROJECTS.find((p) => p.id === id);
}
