export interface GuidedStationNarration {
  stationId: string;
  narratorTitle: string;
  audioSpeechText: string;
  highlightPoints: string[];
  durationSeconds: number;
}

export const GUIDED_TOUR_NARRATIONS: Record<string, GuidedStationNarration> = {
  'bim-hub': {
    stationId: 'bim-hub',
    narratorTitle: 'Benvenuti allo Studio Tecnico Efrem Giannessi',
    audioSpeechText:
      'Benvenuti nel nostro centro di progettazione BIM 5D. Qui integriamo geometria tridimensionale, cronoprogramma dei lavori e gestione economica dei costi. Ogni elemento costruttivo genera computi metrici e quadri economici in tempo reale senza errori di discrepanza.',
    highlightPoints: [
      'Modellazione Parametrica LOD 100-500',
      'Integrazione 4D (Tempi) e 5D (Costi)',
      'Clash Detection e Coordinamento OpenBIM',
    ],
    durationSeconds: 14,
  },
  'revit-design-hub': {
    stationId: 'revit-design-hub',
    narratorTitle: 'Authoring Avanzato con Autodesk Revit',
    audioSpeechText:
      'Ci troviamo nella postazione dedicata alla modellazione specialistica con Autodesk Revit. Creiamo famiglie parametriche complesse e standardizziamo i template di commessa per garantire esecutivi di altissima precisione.',
    highlightPoints: [
      'Famiglie parametriche su misura RFA',
      'Tavole esecutive e abachi dinamici',
      'Standardizzazione template di studio',
    ],
    durationSeconds: 14,
  },
  'cad-to-bim-hub': {
    stationId: 'cad-to-bim-hub',
    narratorTitle: 'Digitalizzazione: Da Disegno 2D a Modello 3D',
    audioSpeechText:
      'Questa è l’isola di conversione tecnologica: trasformiamo vecchie planimetrie cartacee e file DWG bidimensionali in gemelli digitali BIM parametrici completi di stratigrafie termiche e computi.',
    highlightPoints: [
      'Vettorializzazione e georeferenziazione',
      'Ricostruzione parametrica muri e solai',
      'Generazione automatica del computo iniziale',
    ],
    durationSeconds: 14,
  },
  'computo-hub': {
    stationId: 'computo-hub',
    narratorTitle: 'Desk Computi Estimativi & Contabilità Lavori',
    audioSpeechText:
      'Qui avviene la gestione economica di cantiere: colleghiamo i modelli BIM ai prezzari regionali ufficiali, calcolando i quadri economici e redigendo i capitolati speciali d’appalto con massima accuratezza.',
    highlightPoints: [
      'Associazione prezzari regionali',
      'Analisi nuovi prezzi unitari e WBS',
      'Stima economica dinamica e S-Curve',
    ],
    durationSeconds: 14,
  },
  'revit-plugins-hub': {
    stationId: 'revit-plugins-hub',
    narratorTitle: 'Laboratorio Sviluppo Plugin C# e pyRevit',
    audioSpeechText:
      'Nel laboratorio di programmazione sviluppiamo script e componenti aggiuntivi personalizzati in Python, C# e Dynamo per automatizzare processi ripetitivi e accelerare la produzione delle commesse.',
    highlightPoints: [
      'Sviluppo Add-in personalizzati in C#',
      'Scripting pyRevit & automazioni Dynamo',
      'Estrazione ed esportazione dati su misura',
    ],
    durationSeconds: 14,
  },
  'rendering-hub': {
    stationId: 'rendering-hub',
    narratorTitle: 'Visual Studio & Virtual Tour Immersivi',
    audioSpeechText:
      'Nel reparto visual realizziamo render fotorealistici ad alta risoluzione e tour panoramici interattivi a trecentosessanta gradi, ideali per la presentazione emozionale ai committenti.',
    highlightPoints: [
      'Render fotorealistici ad alta risoluzione',
      'Tour panoramici immersivi a 360 gradi',
      'Animazioni video di cantiere e luce solare',
    ],
    durationSeconds: 14,
  },
  'approfondimenti-hub': {
    stationId: 'approfondimenti-hub',
    narratorTitle: 'Area Ricerca & Sviluppo Normativo',
    audioSpeechText:
      'L’area R&D approfondisce l’evoluzione delle norme tecniche, le detrazioni fiscali, l’efficienza energetica e gli standard internazionali OpenBIM di interoperabilità.',
    highlightPoints: [
      'Allineamento alla norma UNI 11337',
      'Studio delle tecnologie a basso impatto',
      'Aggiornamento continuo dei protocolli studio',
    ],
    durationSeconds: 14,
  },
  'contacts-hub': {
    stationId: 'contacts-hub',
    narratorTitle: 'Reception & Sala Riunioni Committenti',
    audioSpeechText:
      'Siamo giunti alla conclusione del tour. Siamo a vostra disposizione per analizzare i vostri progetti, elaborare computi metrici e strutturare flussi BIM su misura per la vostra commessa.',
    highlightPoints: [
      'Consulenza preliminare personalizzata',
      'Preventivi chiari e tempi concordati',
      'Contatto diretto: EfremGiannessi@gmail.com',
    ],
    durationSeconds: 14,
  },
};
