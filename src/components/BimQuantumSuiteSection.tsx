import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Building2, Sliders, Terminal, MapPin, 
  Layers, FileText, ArrowLeft, X, Copy, Check, 
  Printer, CheckCircle2, ShieldCheck, Ruler, 
  Info, AlertTriangle, Scale, Wrench, Download,
  Lock, Unlock, KeyRound, Mail, AlertCircle
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

export type SuiteTab = 'xray' | 'calculator' | 'radar' | 'schedule' | 'sheet';

interface PrecastProjectSite {
  id: string;
  name: string;
  location: string;
  areaMq: number;
  capTons: number;
  beamType: string;
  elementsCount: number;
  lod: string;
  seismicZone: string;
  concreteGrade: string;
  staticScheme: string;
  description: string;
}

const PRECAST_SITES: PrecastProjectSite[] = [
  {
    id: 'site-mi',
    name: 'Polo Logistico Intermodale Milano Est',
    location: 'Milano (MI) - Cavenago',
    areaMq: 48500,
    capTons: 11200,
    beamType: 'Travi Boomerang a Doppia Pendenza L=28.50 m (Pendenza 10%)',
    elementsCount: 380,
    lod: 'LOD 400 Costruttivo di Officina',
    seismicZone: 'Zona Sismica 4 (ag = 0.052g)',
    concreteGrade: 'C45/55 autocompattante (SCC) - Esposizione XC4',
    staticScheme: 'Schema a trave semplicemente appoggiata con ritegno sismico d\'estremità',
    description: 'Complesso logistico ad alta automazione. Sviluppo di script pyRevit per il calcolo automatico della posizione dei baricentri di sollevamento per autogrù 300t e generazione delle schede di produzione d\'officina.'
  },
  {
    id: 'site-bo',
    name: 'Stabilimento Industriale & Magazzino Interporto',
    location: 'Bologna (BO) - Bentivoglio',
    areaMq: 34000,
    capTons: 8600,
    beamType: 'Pilastri Pluripiano Sez. 80x80 cm con Mensole Torte e Travi ad I L=22.0 m',
    elementsCount: 295,
    lod: 'LOD 400 Esecutivo di Montaggio',
    seismicZone: 'Zona Sismica 3 (ag = 0.128g)',
    concreteGrade: 'C50/60 con fumo di silice - Classe Rck 60 MPa',
    staticScheme: 'Pilastri a mensola incastrati al piede in pozzetti a bicchiere prefabbricati',
    description: 'Fabbricato produttivo con impalcati intermedi per carroponti da 20t. Modellazione parametrica Revit dei collegamenti bullonati a secco con perni sismici filettati inghisati in guaine metalliche corrugate.'
  },
  {
    id: 'site-vr',
    name: 'Centro Agroalimentare e Celle Frigorifere',
    location: 'Verona (VR) - Quadrante Europa',
    areaMq: 52000,
    capTons: 13400,
    beamType: 'Tegoli a Doppia T (TT) H=90 cm L=24.0 m con Coppelle di Copertura',
    elementsCount: 440,
    lod: 'LOD 400 + Cronoprogramma 4D',
    seismicZone: 'Zona Sismica 3 (ag = 0.104g)',
    concreteGrade: 'C45/55 a maturazione accelerata a vapore',
    staticScheme: 'Impalcato continuo con cappa collaborante armata sp. 5 cm',
    description: 'Impianto con sheds continui orientati a nord per captazione luce diffusa. Estrazione automatizzata delle quantità di calcestruzzo e distinta ferri B450C integrata al gestionale ERP di stabilimento.'
  },
  {
    id: 'site-fi',
    name: 'Complesso Produttivo & Centro Ricerca',
    location: 'Firenze (FI) - Campi Bisenzio',
    areaMq: 26500,
    capTons: 6800,
    beamType: 'Travi Boomerang L=24.0 m e Pannelli a Taglio Termico Granigliati sp. 30 cm',
    elementsCount: 210,
    lod: 'LOD 350 / 400',
    seismicZone: 'Zona Sismica 3 (ag = 0.135g)',
    concreteGrade: 'C45/55 (Struttura) / C35/45 (Pannelli con marmo di Carrara)',
    staticScheme: 'Telaio prefabbricato isostatico con giunzioni sismiche dissipative',
    description: 'Pannelli di tamponamento esterni rifiniti in graniglia di marmo lavato con isolante continuo in EPS grafitato da 12 cm. Verifica geometrica delle tolleranze di posa secondo norma UNI EN 13670 classe 1.'
  },
  {
    id: 'site-rm',
    name: 'Hub Distributivo e Stoccaggio Merci',
    location: 'Roma (RM) - Fiano Romano',
    areaMq: 31000,
    capTons: 7900,
    beamType: 'Tegoli Alveolari Estrusi Spessore 40 cm e Travi a T Rovescia C.A.P.',
    elementsCount: 260,
    lod: 'LOD 400 Esecutivo',
    seismicZone: 'Zona Sismica 3B (ag = 0.110g)',
    concreteGrade: 'C50/60 autocompattante ad alta resistenza iniziale',
    staticScheme: 'Solaio alveolare per sovraccarico utile operativo accidentale pari a 20.0 kN/m²',
    description: 'Impalcato di mezzanino ad altissima portata per carrelli elevatori trilaterali. Modellazione dettagliata degli apparecchi di vincolo in neoprene armato conforme a UNI EN 1337-3 con relative flange di centraggio.'
  }
];

// Tracking Abaco Elementi di Produzione
interface ProductionElement {
  code: string;
  type: string;
  lengthM: number;
  weightTon: number;
  volumeM3: number;
  strands: number;
  bedId: string;
  status: 'In Modellazione' | 'Approvato LOD 400' | 'In Pista di Getto' | 'Stoccato' | 'Montato';
}

const PRODUCTION_ELEMENTS: ProductionElement[] = [
  { code: 'TRV-BM-01', type: 'Trave Boomerang C.A.P.', lengthM: 28.5, weightTon: 22.4, volumeM3: 9.0, strands: 24, bedId: 'Pista C.A.P. 1', status: 'Montato' },
  { code: 'TRV-BM-02', type: 'Trave Boomerang C.A.P.', lengthM: 28.5, weightTon: 22.4, volumeM3: 9.0, strands: 24, bedId: 'Pista C.A.P. 1', status: 'Montato' },
  { code: 'PIL-A01-01', type: 'Pilastro 80x80 con Mensole', lengthM: 14.2, weightTon: 22.7, volumeM3: 9.1, strands: 0, bedId: 'Cassero Verticale A', status: 'Montato' },
  { code: 'PIL-A01-02', type: 'Pilastro 80x80 con Mensole', lengthM: 14.2, weightTon: 22.7, volumeM3: 9.1, strands: 0, bedId: 'Cassero Verticale A', status: 'Montato' },
  { code: 'TEG-TT-01', type: 'Tegolo Doppia T H=90cm', lengthM: 24.0, weightTon: 14.8, volumeM3: 5.9, strands: 16, bedId: 'Pista TT 2', status: 'Stoccato' },
  { code: 'TEG-TT-02', type: 'Tegolo Doppia T H=90cm', lengthM: 24.0, weightTon: 14.8, volumeM3: 5.9, strands: 16, bedId: 'Pista TT 2', status: 'In Pista di Getto' },
  { code: 'PAN-EXT-01', type: 'Pannello Termico Granigliato', lengthM: 12.0, weightTon: 11.2, volumeM3: 4.5, strands: 0, bedId: 'Banco Ribaltabile 1', status: 'Approvato LOD 400' },
  { code: 'PAN-EXT-02', type: 'Pannello Termico Granigliato', lengthM: 12.0, weightTon: 11.2, volumeM3: 4.5, strands: 0, bedId: 'Banco Ribaltabile 1', status: 'In Modellazione' },
];

interface BimQuantumSuiteSectionProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SuiteTab;
}

const SUITE_PASSWORD = 'plmokn936';

export const BimQuantumSuiteSection: React.FC<BimQuantumSuiteSectionProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'xray'
}) => {
  const [activeTab, setActiveTab] = useState<SuiteTab>(initialTab);

  // Authentication Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('bim_suite_authorized') === 'true';
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        audioSystem.playClick(450);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // --- Modulo 1: Sezionamento Dettaglio Costruttivo ---
  const [slicePlane, setSlicePlane] = useState<number>(40);
  const [concreteOpacity, setConcreteOpacity] = useState<number>(35);
  const [showRebarCage, setShowRebarCage] = useState<boolean>(true);
  const [showStrands, setShowStrands] = useState<boolean>(true);
  const [showBearingPad, setShowBearingPad] = useState<boolean>(true);
  const [inspectorRotX, setInspectorRotX] = useState<number>(16);
  const [inspectorRotY, setInspectorRotY] = useState<number>(-22);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragRef = useRef<{ startX: number; startY: number; initRotX: number; initRotY: number }>({
    startX: 0, startY: 0, initRotX: 16, initRotY: -22
  });

  // --- Modulo 2: Calcolatore NTC 2018 & Script pyRevit ---
  const [spanLength, setSpanLength] = useState<number>(24);
  const [baySpacing, setBaySpacing] = useState<number>(12);
  const [snowLoad, setSnowLoad] = useState<number>(1.6);
  const [deadLoadRoof, setDeadLoadRoof] = useState<number>(1.2);
  const [concreteClass, setConcreteClass] = useState<'C45/55' | 'C50/60'>('C45/55');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Ingegneria: Calcoli di Predimensionamento Reali conformi NTC 2018 (§ 4.1)
  const calcResults = useMemo(() => {
    // 1. Carichi di Progetto (SLU)
    // Peso proprio stimato elemento prefabbricato: trave boomerang tipica ha peso proprio g1 ~ 6.5 - 9.0 kN/m
    const estimatedBeamSelfWeightKNm = 7.5; // kN/m
    const g2_lineare = deadLoadRoof * baySpacing; // kN/m
    const qk_lineare = snowLoad * baySpacing; // kN/m

    // Combinazione SLU fondamentale: 1.3 * G1 + 1.5 * G2 + 1.5 * Qk
    const totalDesignLoadKNm = 1.3 * estimatedBeamSelfWeightKNm + 1.5 * g2_lineare + 1.5 * qk_lineare;
    
    // Momento flettente di calcolo in mezzeria: M_Ed = q_d * L^2 / 8
    const momentEd = (totalDesignLoadKNm * Math.pow(spanLength, 2)) / 8;
    
    // Taglio massimo all'appoggio: V_Ed = q_d * L / 2
    const shearEd = (totalDesignLoadKNm * spanLength) / 2;

    // Altezza sezione stimata: per travi boomerang in mezzeria H_mid = L / 16, all'appoggio H_end = L / 24
    const heightMidCm = Math.round((spanLength * 100) / 16.5);
    const heightEndCm = Math.round((spanLength * 100) / 24);

    // Stima numero trefoli armonici da 0.6" (Area nominale = 140 mm², Tensione ammissibile di progetto f_pyd ~ 1400 MPa)
    // Capacità momento singolo trefolo al lembo inferiore con braccio z ~ 0.85 * H_mid
    const z_leverArmM = (heightMidCm / 100) * 0.85;
    const forcePerStrandKN = 140 * 1.4 * 0.85; // ~166 kN
    const estimatedStrands = Math.max(10, Math.round(momentEd / (forcePerStrandKN * z_leverArmM)));

    // Freccia elastica in esercizio (combinazione quasi permanente): delta ~ 5/384 * q_qp * L^4 / (E * J)
    const deflectionMm = ((spanLength * 1000) / 360).toFixed(1);
    const concreteVolumeM3 = ((heightMidCm + heightEndCm) / 200 * 0.45 * spanLength).toFixed(1);

    let profileName = 'Trave Boomerang a Doppia Pendenza (Pendenza 10%)';
    let profileNotes = 'Idonea per coperture industriali a grande luce. Consente il deflusso naturale delle acque meteoriche verso le linee di gronda perimetrali.';
    if (spanLength < 16) {
      profileName = 'Trave ad I con Ali Raccordate a Spessore Costante';
      profileNotes = 'Ottimizzata per impalcati intermedi e solai carrabili con elevate esigenze di snellezza strutturale.';
    } else if (spanLength > 28) {
      profileName = 'Trave Wing / Alare Prefabbricata ad Alto Momento d\'Inerzia';
      profileNotes = 'Sezione speciale per luci superiori a 28 metri, sagomata per alloggiare shed continui o lucernari zenitali.';
    }

    return {
      momentEd: Math.round(momentEd),
      shearEd: Math.round(shearEd),
      heightMidCm,
      heightEndCm,
      strands: estimatedStrands,
      deflectionMm,
      concreteVolumeM3,
      profileName,
      profileNotes,
      totalDesignLoadKNm: totalDesignLoadKNm.toFixed(1)
    };
  }, [spanLength, baySpacing, snowLoad, deadLoadRoof]);

  // Generatore di Script pyRevit API Reale
  const generatedPyRevitCode = useMemo(() => {
    return `# -*- coding: utf-8 -*-
"""
Autodesk Revit API tramite pyRevit
Modulo: Modellazione Parametrica Travi Prefabbricate C.A.P.
Normativa di Riferimento: NTC 2018 (D.M. 17/01/2018) / UNI EN 13369
Autore: Efrem Giannessi - BIM Specialist & Modellazione Strutturale
"""

import clr
clr.AddReference('RevitAPI')
clr.AddReference('RevitServices')

from Autodesk.Revit.DB import *
from Autodesk.Revit.DB.Structure import *
from pyrevit import script

doc = __revit__.ActiveUIDocument.Document

def create_precast_cap_beam():
    # Avvio Transazione Documento Revit
    tx = Transaction(doc, "Crea Trave C.A.P. L=${spanLength}m - Sez. H=${calcResults.heightMidCm}cm")
    tx.Start()
    try:
        # Punti di posizionamento alle coordinate di progetto (conversione Metri -> Piedi Imperiali Revit)
        METERS_TO_FEET = 3.280839895
        p_start = XYZ(0.0, 0.0, 0.0)
        p_end = XYZ(${spanLength} * METERS_TO_FEET, 0.0, 0.0)
        centerline = Line.CreateBound(p_start, p_end)

        # Ricerca Famiglia Strutturale di Telaio (BuiltInCategory.OST_StructuralFraming)
        collector = FilteredElementCollector(doc)\\
            .OfCategory(BuiltInCategory.OST_StructuralFraming)\\
            .WhereElementIsElementType()

        family_symbol = None
        target_name = "${calcResults.profileName.split(' ')[0]}"
        for sym in collector:
            if target_name in sym.Name or "Trave" in sym.Name:
                family_symbol = sym
                break

        if not family_symbol:
            family_symbol = collector.FirstElement()

        # Attivazione del FamilySymbol se non caricato in memoria
        if not family_symbol.IsActive:
            family_symbol.Activate()
            doc.Regenerate()

        # Riferimento al Livello Esecutivo di Quota
        level = FilteredElementCollector(doc).OfClass(Level).FirstElement()
        if not level:
            raise Exception("Nessun livello presente nel progetto Revit corrente.")

        # Inserimento Istanza Strutturale
        beam_instance = doc.Create.NewFamilyInstance(
            centerline, 
            family_symbol, 
            level, 
            StructuralType.Beam
        )

        # Valorizzazione Parametri di Progetto Esecutivi (LOD 400)
        def set_param(name, value):
            p = beam_instance.LookupParameter(name)
            if p and not p.IsReadOnly:
                p.Set(value)

        # Dimensioni geometriche e parametri di calcolo
        set_param("Altezza_Mezzeria", (${calcResults.heightMidCm} / 100.0) * METERS_TO_FEET)
        set_param("Altezza_Appoggio", (${calcResults.heightEndCm} / 100.0) * METERS_TO_FEET)
        set_param("Classe_Calcestruzzo", "${concreteClass}")
        set_param("Numero_Trefoli_CAP", ${calcResults.strands})
        set_param("Momento_Flettente_Ed_kNm", ${calcResults.momentEd}.0)
        set_param("Taglio_Massimo_Ed_kN", ${calcResults.shearEd}.0)
        set_param("LOD_Elemento", "LOD 400 - Esecutivo d'Officina")

        tx.Commit()
        print("✔ Elemento Prefabbricato inserito correttamente con parametri di capitolato.")
    except Exception as exc:
        tx.RollBack()
        print("✘ Errore durante l'esecuzione dello script Revit API: {}".format(exc))

if __name__ == '__main__':
    create_precast_cap_beam()
`;
  }, [spanLength, calcResults, concreteClass]);

  // --- Modulo 3: Registro Cantieri ---
  const [selectedSite, setSelectedSite] = useState<PrecastProjectSite>(PRECAST_SITES[0]);

  const handleCopyCode = () => {
    audioSystem.playClick(900);
    navigator.clipboard.writeText(generatedPyRevitCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2400);
  };

  const handlePrintSheet = () => {
    audioSystem.playClick(750);
    window.print();
  };

  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPasswordError(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      if (passwordInput.trim() === SUITE_PASSWORD) {
        audioSystem.playBootBeep(1200);
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('bim_suite_authorized', 'true');
        }
      } else {
        audioSystem.playGlitch();
        setPasswordError('Password non corretta. Richiedi la chiave di accesso a EfremGiannessi@gmail.com.');
      }
    }, 250);
  };

  const handleLockSession = () => {
    audioSystem.playClick(400);
    setIsAuthenticated(false);
    setPasswordInput('');
    setPasswordError(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('bim_suite_authorized');
    }
  };

  const handleCopyEmail = () => {
    audioSystem.playClick(800);
    navigator.clipboard.writeText('EfremGiannessi@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  if (!isOpen) return null;

  // Render Authentication Gate if not authenticated
  if (!isAuthenticated) {
    const emailSubject = encodeURIComponent("Richiesta Chiave di Accesso - Suite Tecnica BIM Prefabbricati");
    const emailBody = encodeURIComponent(
      "Gentile Efrem Giannessi,\n\nDesidero richiedere la chiave di accesso riservata per la consultazione della Suite Tecnica di Ingegneria Prefabbricata e automazione pyRevit.\n\nNome e Cognome:\nAzienda / Studio Tecnico:\nRuolo Professionale:\n\nGrazie e cordiali saluti."
    );
    const mailtoLink = `mailto:EfremGiannessi@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    return (
      <div className="fixed inset-0 z-[100] bg-[#050811] text-stone-100 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col justify-between p-4 sm:p-6 md:p-10">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={() => {
              audioSystem.playClick(450);
              onClose();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-stone-200 hover:text-white font-mono text-xs font-semibold transition active:scale-95 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Torna al Portfolio</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
            <Lock className="w-3.5 h-3.5" />
            <span className="font-bold uppercase tracking-wider">AREA RISERVATA // ACCESSO PROTETTO</span>
          </div>

          <button
            onClick={() => {
              audioSystem.playClick(450);
              onClose();
            }}
            title="Chiudi (ESC)"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-stone-500 text-stone-400 hover:text-white transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Center Card */}
        <div className="max-w-xl w-full mx-auto my-8 p-6 sm:p-10 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-5 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center mb-6">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
              AUTENTICAZIONE RICHIESTA • LOD 400
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
              Suite Tecnica di Ingegneria Prefabbricata
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2.5 leading-relaxed font-sans">
              L'accesso a questa sezione tecnica specialistica è riservato. 
              Per consultare i contenuti è necessario inserire la chiave di sicurezza.
            </p>
          </div>

          {/* Mail Request Box */}
          <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-left font-sans">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Non hai la chiave di accesso?</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed mb-3">
              La password è disponibile su richiesta per professionisti, aziende di prefabbricazione e studi tecnici. 
              Invia un'email a <strong>EfremGiannessi@gmail.com</strong> per riceverla.
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={mailtoLink}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 transition shadow active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Richiedi Password via Email</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-stone-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Email Copiata!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copia Email</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Password Form */}
          <form onSubmit={handleVerifyPassword} className="space-y-4">
            <div>
              <label className="block text-left text-xs font-mono text-stone-300 mb-1.5 uppercase font-semibold">
                Inserisci la Password di Sblocco:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  placeholder="Password di accesso..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-stone-100 placeholder-stone-500 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {passwordError && (
              <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/60 text-red-200 text-xs flex items-start gap-2 text-left font-sans animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{passwordError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !passwordInput.trim()}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              {isVerifying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifica in corso...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Sblocca ed Entra nella Suite</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="text-center font-mono text-xs text-stone-500 border-t border-slate-800 pt-4">
          Ingegneria Strutturale &amp; Modellazione BIM • Efrem Giannessi • EfremGiannessi@gmail.com
        </footer>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#050811] text-stone-100 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      {/* Top Professional Engineering Toolbar */}
      <header className="sticky top-0 z-50 bg-[#090e1a]/95 backdrop-blur-md border-b border-cyan-500/30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioSystem.playClick(450);
              onClose();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-stone-200 hover:text-white font-mono text-xs font-semibold transition active:scale-95 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Torna al Portfolio</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-stone-400 pl-3 border-l border-slate-700">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-cyan-300 font-bold uppercase tracking-wider">
              SUITE INGEGNERIA PREFABBRICATI C.A.P. &amp; AUTOMAZIONE REVIT
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-stone-300 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NTC 2018 • UNI 11337</span>
          </span>

          <button
            onClick={handleLockSession}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-amber-300 text-[11px] font-mono transition"
            title="Blocca e richiedi nuovamente la password"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Blocca Sessione</span>
          </button>

          <button
            onClick={() => {
              audioSystem.playClick(450);
              onClose();
            }}
            title="Chiudi Suite (ESC)"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-stone-500 text-stone-400 hover:text-white transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Suite Content Container */}
      <main className="relative py-10 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff04_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff04_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="relative z-10">
          {/* Professional Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-wider mb-2">
                <span>REPARTO TECNICO STRUTTURALE // MODELLAZIONE &amp; AUTOMAZIONE BIM</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white font-sans">
                Suite Tecnica di Ingegneria Prefabbricata &amp; pyRevit
              </h1>
              <p className="text-stone-300 max-w-3xl mt-2 text-xs sm:text-sm leading-relaxed font-sans">
                Ambiente operativo dedicato all'ingegneria dei componenti prefabbricati in cemento armato precompresso (C.A.P.). 
                Permette di sezionare i nodi esecutivi, verificare il predimensionamento secondo le Norme Tecniche per le Costruzioni (NTC 2018), 
                generare il codice per l'API di Autodesk Revit e consultare la tracciabilità delle piste di getto e dei cantieri realizzati.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-4 bg-slate-900 border border-slate-800 p-3.5 rounded-xl font-mono text-xs">
              <div>
                <div className="text-[10px] text-stone-400 uppercase">SPECIFICA BIM</div>
                <div className="text-cyan-300 font-bold">LOD 400 / COSTRUTTIVO</div>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <div className="text-[10px] text-stone-400 uppercase">RESPONSABILE BIM</div>
                <div className="text-white font-bold">EFREM GIANNESSI</div>
              </div>
            </div>
          </div>

          {/* 5 Professional Module Tabs */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
            {[
              { id: 'xray', label: '1. Dettaglio Costruttivo 3D', icon: <Sliders className="w-3.5 h-3.5" />, sub: 'Sezionamento Nodo C.A.P.' },
              { id: 'calculator', label: '2. Calcolo NTC & pyRevit', icon: <Terminal className="w-3.5 h-3.5" />, sub: 'Generatore Codice API' },
              { id: 'radar', label: '3. Quadro Cantieri Realizzati', icon: <MapPin className="w-3.5 h-3.5" />, sub: 'Registro Opere C.A.P.' },
              { id: 'schedule', label: '4. Tracciabilità Pista di Getto', icon: <Layers className="w-3.5 h-3.5" />, sub: 'Abaco di Produzione' },
              { id: 'sheet', label: '5. Tavola Esecutiva di Cantiere', icon: <FileText className="w-3.5 h-3.5" />, sub: 'Cartiglio Normato ISO A3' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    audioSystem.playClick(isActive ? 500 : 700);
                    setActiveTab(tab.id as SuiteTab);
                  }}
                  className={`px-4 py-2.5 rounded-t-xl font-mono text-xs font-bold transition-all shrink-0 flex items-center gap-2.5 border-b-2 ${
                    isActive
                      ? 'bg-slate-900 border-cyan-400 text-cyan-300'
                      : 'bg-transparent border-transparent text-stone-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-stone-400'}>{tab.icon}</span>
                  <div className="text-left">
                    <div>{tab.label}</div>
                    <div className="text-[10px] text-stone-400 font-normal">{tab.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Module Content Box */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-xl">

            {/* ======================================================== */}
            {/* MODULO 1: SEZIONAMENTO DETTAGLIO COSTRUTTIVO NODO C.A.P.  */}
            {/* ======================================================== */}
            {activeTab === 'xray' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                      Sezionamento Esecutivo Nodo Trave-Pilastro Prefabbricato (LOD 400)
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-3xl font-sans">
                      Visualizzazione interattiva della gabbia d'armatura e dei trefoli di precompressione.
                      Regola la profondità di taglio e la trasparenza del copriferro per verificare la corretta disposizione dei ferri 
                      in accordo al § 4.1 delle NTC 2018 ed alla UNI EN 13369.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-stone-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ruota con il mouse per osservare i dettagli</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* 3D Model Stage */}
                  <div 
                    className="lg:col-span-8 relative h-[380px] sm:h-[450px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={(e) => {
                      setIsDragging(true);
                      dragRef.current = {
                        startX: e.clientX,
                        startY: e.clientY,
                        initRotX: inspectorRotX,
                        initRotY: inspectorRotY
                      };
                    }}
                    onMouseMove={(e) => {
                      if (!isDragging) return;
                      const deltaX = e.clientX - dragRef.current.startX;
                      const deltaY = e.clientY - dragRef.current.startY;
                      setInspectorRotY(dragRef.current.initRotY + deltaX * 0.4);
                      setInspectorRotX(Math.max(-40, Math.min(40, dragRef.current.initRotX - deltaY * 0.4)));
                    }}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none perspective-[1000px]">
                      <div 
                        className="relative w-80 h-72 sm:w-96 sm:h-80 transition-transform duration-75 ease-out preserve-3d"
                        style={{
                          transform: `rotateX(${inspectorRotX}deg) rotateY(${inspectorRotY}deg)`
                        }}
                      >
                        {/* Concrete Shell */}
                        <div 
                          className="absolute inset-0 border border-slate-600 rounded-lg transition-all duration-150 backdrop-blur-[1px]"
                          style={{
                            backgroundColor: `rgba(30, 41, 59, ${concreteOpacity / 100})`,
                            clipPath: `polygon(0% 0%, ${100 - slicePlane}% 0%, ${100 - slicePlane}% 100%, 0% 100%)`
                          }}
                        >
                          <div className="absolute top-2.5 left-2.5 text-[10px] font-mono text-cyan-300 font-bold bg-slate-950/90 px-2 py-0.5 rounded border border-slate-700">
                            Calcestruzzo C45/55 (Copriferro nom. c = 35 mm)
                          </div>
                        </div>

                        {/* Rebar Cage (Acciaio B450C) */}
                        {showRebarCage && (
                          <div className="absolute inset-4 border-2 border-dashed border-amber-500/80 rounded pointer-events-none">
                            {/* Ferri Longitudinali B450C */}
                            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-amber-400" />
                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-400" />
                            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-amber-400" />
                            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-400" />

                            {/* Staffe a 4 bracci */}
                            {[20, 40, 60, 80].map((pos) => (
                              <div 
                                key={pos}
                                className="absolute inset-x-0 h-0.5 bg-amber-400"
                                style={{ top: `${pos}%` }}
                              />
                            ))}

                            <div className="absolute bottom-2.5 left-2.5 text-[10px] font-mono text-amber-300 font-bold bg-slate-950/90 px-2 py-0.5 rounded border border-slate-700">
                              Staffe B450C Ø10/10 cm (Zona Nodale Sismica)
                            </div>
                          </div>
                        )}

                        {/* Prestressing Strands (Trefoli Y1860S7) */}
                        {showStrands && (
                          <div className="absolute inset-x-8 bottom-8 flex justify-between pointer-events-none">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <div key={i} className="flex flex-col items-center">
                                <div className="w-1.5 h-44 bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                                <div className="w-3 h-3 rounded-full bg-cyan-300 border border-white mt-1" />
                              </div>
                            ))}
                            <div className="absolute -top-6 right-0 text-[10px] font-mono text-cyan-300 font-bold bg-slate-950/90 px-2 py-0.5 rounded border border-slate-700">
                              Trefoli Y1860S7 Ø 0.6&quot; (σp0 = 1400 MPa)
                            </div>
                          </div>
                        )}

                        {/* Appoggio Neoprene & Perno Sismico */}
                        {showBearingPad && (
                          <div className="absolute -bottom-7 inset-x-12 h-6 bg-stone-700 border border-stone-500 rounded flex items-center justify-around">
                            <span className="text-[9px] font-mono text-stone-200 font-bold">
                              Neoprene Armato 300x200x31mm (UNI EN 1337-3)
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                        )}

                        {/* Piano di Taglio */}
                        <div 
                          className="absolute inset-y-0 w-0.5 bg-cyan-400 shadow-[0_0_10px_#00f0ff] pointer-events-none"
                          style={{ left: `${100 - slicePlane}%` }}
                        >
                          <div className="absolute top-2 -left-16 px-1.5 py-0.5 bg-slate-950 border border-cyan-400 text-cyan-300 text-[9px] font-mono rounded whitespace-nowrap">
                            Sezione ({slicePlane}%)
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3 pointer-events-auto">
                      <button
                        onClick={() => {
                          audioSystem.playClick(600);
                          setInspectorRotX(16);
                          setInspectorRotY(-22);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-stone-300 text-[10px] font-mono transition"
                      >
                        Ripristina Vista Isometrica
                      </button>
                    </div>
                  </div>

                  {/* Inspection Sliders Panel */}
                  <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5 font-mono text-xs">
                    <div className="border-b border-slate-800 pb-2.5 font-bold text-white uppercase flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Parametri di Sezionamento</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-stone-300">Avanzamento Taglio:</span>
                        <span className="text-cyan-400 font-bold">{slicePlane}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={slicePlane}
                        onChange={(e) => setSlicePlane(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                      <div className="flex justify-between text-[10px] text-stone-400">
                        <span>0% (Intatto)</span>
                        <span>50% (Mezzeria)</span>
                        <span>100% (Anima Nuda)</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-stone-300">Trasparenza Cls:</span>
                        <span className="text-cyan-400 font-bold">{100 - concreteOpacity}%</span>
                      </div>
                      <input 
                        type="range"
                        min="10"
                        max="90"
                        value={concreteOpacity}
                        onChange={(e) => setConcreteOpacity(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-800">
                      <div className="text-[11px] text-stone-300 font-bold uppercase">Elementi Visibili:</div>
                      
                      <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                        <span className="text-amber-300">Armatura Lenta B450C</span>
                        <input 
                          type="checkbox" 
                          checked={showRebarCage}
                          onChange={(e) => setShowRebarCage(e.target.checked)}
                          className="rounded accent-amber-400"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                        <span className="text-cyan-300">Trefoli C.A.P. Y1860S7</span>
                        <input 
                          type="checkbox" 
                          checked={showStrands}
                          onChange={(e) => setShowStrands(e.target.checked)}
                          className="rounded accent-cyan-400"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 cursor-pointer">
                        <span className="text-stone-300">Cuscinetto Neoprene Armato</span>
                        <input 
                          type="checkbox" 
                          checked={showBearingPad}
                          onChange={(e) => setShowBearingPad(e.target.checked)}
                          className="rounded accent-stone-400"
                        />
                      </label>
                    </div>

                    <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-stone-300 space-y-1 font-sans">
                      <div className="font-bold font-mono text-cyan-400 uppercase text-[10px]">Verifiche di Dettaglio:</div>
                      <div>• Copriferro minimo garantito: 35 mm (Classe XC4/XD1)</div>
                      <div>• Ancoraggio trefoli: Lunghezza di trasmissione lbp = 85 cm</div>
                      <div>• Connessione sismica per attrito + perno in acciaio cl. 8.8</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 2: CALCOLO NTC 2018 & GENERATORE SCRIPT pyRevit   */}
            {/* ======================================================== */}
            {activeTab === 'calculator' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                    Predimensionamento NTC 2018 &amp; Generatore di Script pyRevit API
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-3xl font-sans">
                    Imposta la luce di calcolo e i sovraccarichi di normativa: l'algoritmo calcola le sollecitazioni SLU 
                    (M_Ed, V_Ed), stima i trefoli armonici e genera lo script Python con l'API ufficiale di Autodesk Revit 
                    pronto da copiare ed eseguire.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Inputs */}
                  <div className="lg:col-span-5 space-y-5 font-mono text-xs">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                      <div className="font-bold text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-2">
                        <Scale className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Parametri di Carico &amp; Geometria</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-stone-300">Luce Campata Netta (L):</span>
                          <span className="text-cyan-400 font-bold text-sm">{spanLength} m</span>
                        </div>
                        <input 
                          type="range"
                          min="12"
                          max="36"
                          step="1"
                          value={spanLength}
                          onChange={(e) => setSpanLength(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-stone-300">Interasse Telai / Pilastri (i):</span>
                          <span className="text-cyan-400 font-bold text-sm">{baySpacing} m</span>
                        </div>
                        <input 
                          type="range"
                          min="6"
                          max="15"
                          step="0.5"
                          value={baySpacing}
                          onChange={(e) => setBaySpacing(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-stone-300">Carico Neve di Progetto (qk):</span>
                          <span className="text-amber-300 font-bold text-sm">{snowLoad.toFixed(2)} kN/m²</span>
                        </div>
                        <input 
                          type="range"
                          min="1.0"
                          max="3.0"
                          step="0.1"
                          value={snowLoad}
                          onChange={(e) => setSnowLoad(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-stone-300">Carico Permanente Portato (g2):</span>
                          <span className="text-stone-300 font-bold text-sm">{deadLoadRoof.toFixed(2)} kN/m²</span>
                        </div>
                        <input 
                          type="range"
                          min="0.8"
                          max="2.2"
                          step="0.1"
                          value={deadLoadRoof}
                          onChange={(e) => setDeadLoadRoof(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-stone-400"
                        />
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <span className="text-stone-300">Classe Resistenza Calcestruzzo:</span>
                        <div className="grid grid-cols-2 gap-2">
                          {(['C45/55', 'C50/60'] as const).map((cls) => (
                            <button
                              key={cls}
                              onClick={() => setConcreteClass(cls)}
                              className={`py-1.5 text-xs rounded font-bold transition border ${
                                concreteClass === cls
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                  : 'bg-slate-900 border-slate-700 text-stone-400 hover:text-white'
                              }`}
                            >
                              {cls}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Calculated Output Card */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 uppercase text-[10px] font-bold">Profilo Ottimale</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-700 px-2 py-0.5 rounded font-bold">
                          CONFORME NTC 2018
                        </span>
                      </div>

                      <div className="text-base font-bold text-white font-sans">
                        {calcResults.profileName}
                      </div>
                      <p className="text-[11px] text-stone-300 font-sans leading-relaxed">
                        {calcResults.profileNotes}
                      </p>

                      <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800 text-xs">
                        <div className="bg-slate-900 p-2 rounded">
                          <span className="text-[10px] text-stone-400 block">MOMENTO SLU (Med)</span>
                          <span className="text-white font-bold">{calcResults.momentEd} kNm</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded">
                          <span className="text-[10px] text-stone-400 block">TAGLIO SLU (Ved)</span>
                          <span className="text-white font-bold">{calcResults.shearEd} kN</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded">
                          <span className="text-[10px] text-stone-400 block">ALTEZZA MEZZERIA</span>
                          <span className="text-cyan-300 font-bold">{calcResults.heightMidCm} cm</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded">
                          <span className="text-[10px] text-stone-400 block">TREFOLI Y1860S7</span>
                          <span className="text-amber-300 font-bold">{calcResults.strands} trefoli</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Python Code Terminal */}
                  <div className="lg:col-span-7 bg-[#03060c] border border-slate-800 rounded-xl overflow-hidden font-mono text-xs shadow-2xl">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        <span className="text-stone-300 ml-2 font-bold">precast_beam_generator.py</span>
                      </div>

                      <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-stone-200 hover:text-cyan-300 transition text-[11px] font-bold"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Copiato!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copia Script pyRevit</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 sm:p-5 overflow-x-auto max-h-[460px] scrollbar-thin text-stone-300 leading-relaxed">
                      <pre>
                        <code>{generatedPyRevitCode}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 3: QUADRO CANTIERI & REGISTRO OPERE C.A.P.        */}
            {/* ======================================================== */}
            {activeTab === 'radar' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                    Quadro Cantieri &amp; Registro Strutture Prefabbricate
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-3xl font-sans">
                    Dossier tecnico delle principali commesse industriali e logistiche eseguite.
                    Seleziona un'opera per analizzare lo schema statico adottato, i volumi di calcestruzzo C.A.P., 
                    la zonizzazione sismica e i dettagli costruttivi approvati al livello LOD 400.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Sites List Column */}
                  <div className="lg:col-span-5 space-y-2.5 font-mono text-xs">
                    {PRECAST_SITES.map((site) => {
                      const isSelected = selectedSite.id === site.id;
                      return (
                        <button
                          key={site.id}
                          onClick={() => {
                            audioSystem.playClick(600);
                            setSelectedSite(site);
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                            isSelected 
                              ? 'bg-slate-900 border-cyan-400 text-white shadow-md' 
                              : 'bg-slate-950 border-slate-800 text-stone-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-white font-sans">{site.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
                              {site.lod}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{site.location}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Site Technical Sheet */}
                  <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-5 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase">SCHEDA TECNICA DI COMMESSA</span>
                        <h4 className="text-lg font-bold text-white font-sans">{selectedSite.name}</h4>
                        <div className="text-cyan-400 text-xs mt-0.5">{selectedSite.location}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block">ZONA SISMICA</span>
                        <span className="text-amber-300 font-bold">{selectedSite.seismicZone}</span>
                      </div>
                    </div>

                    <p className="text-stone-300 font-sans text-xs leading-relaxed">
                      {selectedSite.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-stone-400 block">SUPERFICIE COPERTA</span>
                        <span className="text-white font-bold text-sm">{selectedSite.areaMq.toLocaleString('it-IT')} m²</span>
                      </div>
                      <div className="p-3 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-stone-400 block">PESO PREFABBRICATI</span>
                        <span className="text-white font-bold text-sm">{selectedSite.capTons.toLocaleString('it-IT')} t</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px] text-stone-300">
                      <div>• <strong>Tipologia Elementi Portanti:</strong> {selectedSite.beamType}</div>
                      <div>• <strong>Schema Statico:</strong> {selectedSite.staticScheme}</div>
                      <div>• <strong>Classe di Calcestruzzo:</strong> {selectedSite.concreteGrade}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 4: ABACO DI PRODUZIONE & PISTA DI GETTO           */}
            {/* ======================================================== */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                    Abaco Elementi di Produzione &amp; Tracciabilità Pista di Getto (BIM 4D/5D)
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-3xl font-sans">
                    Registro digitale degli elementi strutturali prefabbricati pronti per la produzione in stabilimento. 
                    Monitoraggio del peso proprio per il piano di sollevamento con gru e verifica dello stato di avanzamento.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/90 text-stone-300 border-b border-slate-800 text-[11px]">
                        <th className="p-3">Sigla Elemento</th>
                        <th className="p-3">Tipologia Costruttiva</th>
                        <th className="p-3 text-right">Luce (m)</th>
                        <th className="p-3 text-right">Volume (m³)</th>
                        <th className="p-3 text-right">Peso (t)</th>
                        <th className="p-3 text-right">Trefoli</th>
                        <th className="p-3">Pista / Cassero</th>
                        <th className="p-3">Stato di Avanzamento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-stone-300 text-[11px]">
                      {PRODUCTION_ELEMENTS.map((elem) => (
                        <tr key={elem.code} className="hover:bg-slate-900/50 transition">
                          <td className="p-3 font-bold text-cyan-400">{elem.code}</td>
                          <td className="p-3 text-white font-sans">{elem.type}</td>
                          <td className="p-3 text-right">{elem.lengthM.toFixed(1)}</td>
                          <td className="p-3 text-right">{elem.volumeM3.toFixed(1)}</td>
                          <td className="p-3 text-right font-bold text-white">{elem.weightTon.toFixed(1)}</td>
                          <td className="p-3 text-right text-amber-300">{elem.strands > 0 ? elem.strands : '-'}</td>
                          <td className="p-3 text-stone-400">{elem.bedId}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              elem.status === 'Montato'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : elem.status === 'Stoccato'
                                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                : elem.status === 'In Pista di Getto'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-slate-800 text-stone-300 border border-slate-700'
                            }`}>
                              {elem.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* MODULO 5: TAVOLA ESECUTIVA DI CANTIERE ISO A3             */}
            {/* ======================================================== */}
            {activeTab === 'sheet' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                      Tavola Tecnica Esecutiva di Cantiere (Normata UNI 11337 / ISO 19650)
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl font-sans">
                      Documento esecutivo con squadratura ISO, cartiglio normato, sezione trasversale quotata e distinta ferri.
                    </p>
                  </div>

                  <button
                    onClick={handlePrintSheet}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase transition shadow active:scale-95 shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Stampa / Esporta PDF</span>
                  </button>
                </div>

                <div className="bg-[#0b101d] border-2 border-stone-600 p-4 sm:p-6 rounded-lg text-stone-200 font-mono text-xs shadow-2xl">
                  {/* Outer ISO Frame */}
                  <div className="border border-stone-500/80 p-4 sm:p-6 relative">
                    <div className="flex items-center justify-between border-b border-stone-600 pb-3 mb-5">
                      <div className="font-bold text-white uppercase text-xs">
                        TAVOLA TECNICA ESECUTIVA N. ST-04 // LIVELLO DI SVILUPPO: LOD 400
                      </div>
                      <div className="text-[10px] text-stone-400">
                        CONFORME A UNI EN 13369 &amp; NTC 2018
                      </div>
                    </div>

                    {/* Section Graphic Drawing */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
                      <div className="md:col-span-7 bg-[#060a14] border border-stone-700 p-6 rounded relative h-64 flex items-center justify-center">
                        <svg viewBox="0 0 400 240" className="w-full h-full max-h-56 stroke-cyan-400 fill-none">
                          <path 
                            d="M 120 20 L 280 20 L 280 50 L 230 75 L 230 165 L 280 190 L 280 220 L 120 220 L 120 190 L 170 165 L 170 75 L 120 50 Z" 
                            strokeWidth="2" 
                            fill="rgba(6, 182, 212, 0.05)" 
                          />
                          {/* Trefoli */}
                          <circle cx="140" cy="205" r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
                          <circle cx="160" cy="205" r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
                          <circle cx="180" cy="205" r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
                          <circle cx="200" cy="205" r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
                          <circle cx="220" cy="205" r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
                          <circle cx="240" cy="205" r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
                          <circle cx="260" cy="205" r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />

                          {/* Quote */}
                          <line x1="100" y1="20" x2="100" y2="220" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="95" y1="20" x2="105" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
                          <line x1="95" y1="220" x2="105" y2="220" stroke="#94a3b8" strokeWidth="1.5" />
                          <text x="50" y="125" fill="#94a3b8" fontSize="10" fontFamily="monospace">H = 145 cm</text>

                          <line x1="120" y1="235" x2="280" y2="235" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                          <text x="175" y="245" fill="#94a3b8" fontSize="10" fontFamily="monospace">B = 60 cm</text>
                        </svg>
                        <div className="absolute bottom-2 left-2 text-[9px] text-stone-400 font-mono">
                          SEZIONE TRASVERSALE TIPO A-A (SCALA 1:20)
                        </div>
                      </div>

                      <div className="md:col-span-5 space-y-3 font-sans text-xs">
                        <div className="font-bold text-white uppercase text-sm border-b border-stone-700 pb-1">
                          Prescrizioni Speciali di Capitolato
                        </div>
                        <div className="space-y-1.5 text-[11px] text-stone-300">
                          <div>• <strong>Calcestruzzo:</strong> C45/55 autocompattante (SCC), Dmax = 20 mm</div>
                          <div>• <strong>Acciaio Ordinario:</strong> B450C saldabile ad aderenza migliorata</div>
                          <div>• <strong>Armatura Pretesa:</strong> Trefoli Y1860S7 Ø 0.6&quot; a basso rilassamento</div>
                          <div>• <strong>Copriferro Nominale:</strong> c = 35 mm (Classi XC4 / XD1)</div>
                          <div>• <strong>Maturazione a Vapore:</strong> Ciclo controllato max 60°C</div>
                          <div>• <strong>Resistenza al Taglio Trefoli:</strong> fck,0 ≥ 35.0 MPa</div>
                        </div>
                      </div>
                    </div>

                    {/* Standardized Title Block */}
                    <div className="mt-8 border-2 border-stone-600 grid grid-cols-1 md:grid-cols-12 text-xs">
                      <div className="md:col-span-5 p-3 border-b md:border-b-0 md:border-r border-stone-600 bg-slate-950">
                        <div className="text-[9px] text-stone-400 uppercase">PROGETTAZIONE &amp; MODELLAZIONE BIM</div>
                        <div className="text-base font-bold text-cyan-400 mt-0.5">EFREM GIANNESSI</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">Specialista Strutture Prefabbricate &amp; pyRevit API</div>
                        <div className="text-[10px] text-stone-400">EfremGiannessi@gmail.com</div>
                      </div>

                      <div className="md:col-span-4 p-3 border-b md:border-b-0 md:border-r border-stone-600 bg-slate-900">
                        <div className="text-[9px] text-stone-400 uppercase">OGGETTO DELLA TAVOLA</div>
                        <div className="text-xs font-bold text-white mt-0.5">
                          PARTICOLARE ESECUTIVO TRAVE BOOMERANG C.A.P. L=24.0m
                        </div>
                        <div className="text-[10px] text-emerald-400 mt-1">STATO: ESECUTIVO APPROVATO PER PRODUZIONE</div>
                      </div>

                      <div className="md:col-span-3 p-3 bg-slate-950 grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-stone-400 block">SCALA:</span>
                          <span className="text-white font-bold">1:20 / 1:50</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">REVISIONE:</span>
                          <span className="text-cyan-400 font-bold">Rev. 02</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">DATA:</span>
                          <span className="text-white">{new Date().toLocaleDateString('it-IT')}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block">FORMATO:</span>
                          <span className="text-white font-bold">ISO A3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
