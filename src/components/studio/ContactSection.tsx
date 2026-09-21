import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  FileUp,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { audioSystem } from '../../utils/audioSynthesizer';

interface ContactSectionProps {
  initialMessage?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialMessage = '',
}) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [projectType, setProjectType] = useState<string>('BIM 5D & Computo');
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (initialMessage) {
      setMessage((prev) => (prev ? `${prev}\n\n${initialMessage}` : initialMessage));
    }
  }, [initialMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioSystem.playClick(700);

    // Build mailto link for direct client communication
    const subject = encodeURIComponent(`Richiesta Consulenza / Preventivo BIM - ${name || 'Nuovo Progetto'}`);
    const body = encodeURIComponent(
      `Nome / Impresa: ${name}\nEmail: ${email}\nTelefono: ${phone}\nTipologia: ${projectType}\n\nMessaggio:\n${message}`
    );
    window.location.href = `mailto:EfremGiannessi@gmail.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section id="contatti" className="py-20 bg-black/90 relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400 mb-2">
            <Mail className="h-4 w-4" />
            <span>ACTIVE THEORY // COMMESSA & AUDIT TELEMETRY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
            Iniziamo il Tuo Progetto
          </h2>
          <p className="text-sm sm:text-base text-stone-300 font-light mt-2 leading-relaxed">
            Hai una commessa da modellare in BIM, un computo metrico da validare o desideri sviluppare un plugin per Revit? Scrivi direttamente a Efrem Giannessi per concordare un incontro tecnico preliminare o inviare i tuoi file DWG/IFC.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 border border-white/15 bg-stone-900/40 p-6 sm:p-8 space-y-6 font-mono text-xs relative">
            <div className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 z-20" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 z-20" />

            <div>
              <span className="text-[10px] text-amber-400 uppercase tracking-widest block mb-1">CANALE EMAIL DIRETTO</span>
              <a
                href="mailto:EfremGiannessi@gmail.com"
                className="text-base sm:text-lg font-bold text-white hover:text-amber-400 transition-colors block break-all font-sans"
              >
                EfremGiannessi@gmail.com
              </a>
              <span className="text-[11px] text-stone-400 block mt-1 font-sans">
                Riscontro tecnico personalizzato entro 24-48 ore lavorative.
              </span>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block uppercase">Operatività Territoriale</span>
                  <span className="text-stone-400 font-sans text-xs">
                    Disponibilità per sopralluoghi in cantiere in tutta Italia e gestione remota su piattaforma CDE sicura.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block uppercase">Disponibilità Incontri</span>
                  <span className="text-stone-400 font-sans text-xs">
                    Riunioni tecniche in presenza o telematiche via Microsoft Teams / Google Meet.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileUp className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block uppercase">Invio File di Progetto</span>
                  <span className="text-stone-400 font-sans text-xs">
                    Accettiamo file .rvt, .dwg, .ifc, .bcf, nuvole di punti (.rcp, .e57) e PDF tramite WeTransfer o cartella cloud condivisa.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-400/10 border border-amber-400/30">
              <span className="text-amber-300 font-bold block mb-1 text-xs">
                Garanzia di Riservatezza (NDA)
              </span>
              <p className="text-[11px] text-stone-300 font-sans leading-relaxed">
                Tutti i file CAD, modelli tridimensionali e computi economici trasmessi sono trattati con il massimo vincolo di riservatezza professionale.
              </p>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-7 border border-white/15 bg-stone-950 p-6 sm:p-8 relative">
            <div className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400 z-20" />

            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Invia Richiesta o Chiedi una Quotazione
            </h3>

            {submitted ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Client di posta aperto con successo!</span>
                </div>
                <p className="font-sans text-stone-300">
                  La richiesta è pronta nel tuo programma di posta predefinito indirizzata a <strong>EfremGiannessi@gmail.com</strong>. Clicca invia per finalizzare la trasmissione.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 uppercase tracking-wider mb-1 font-semibold">
                      Nome / Studio / Impresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="es. Arch. Marco Rossi / EdilPro Srl"
                      className="w-full px-3 py-2.5 bg-stone-900 border border-white/15 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 uppercase tracking-wider mb-1 font-semibold">
                      Email di Contatto *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="es. marco.rossi@studio.it"
                      className="w-full px-3 py-2.5 bg-stone-900 border border-white/15 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 uppercase tracking-wider mb-1 font-semibold">
                      Telefono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="es. +39 340 000 0000"
                      className="w-full px-3 py-2.5 bg-stone-900 border border-white/15 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 uppercase tracking-wider mb-1 font-semibold">
                      Ambito di Interesse
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-900 border border-white/15 text-white focus:outline-none focus:border-amber-400 font-sans cursor-pointer"
                    >
                      <option value="BIM 5D & Computo Metrico">Progettazione BIM 5D & Computi</option>
                      <option value="Modellazione Revit & Famiglie RFA">Modellazione Revit & Famiglie RFA</option>
                      <option value="Sviluppo Plugin pyRevit / C#">Sviluppo Plugin pyRevit / C# / API</option>
                      <option value="Clash Detection & Coordinamento IFC">Clash Detection & Coordinamento IFC</option>
                      <option value="Virtual Staging & Rendering 3D">Virtual Staging & Rendering 3D</option>
                      <option value="Scan-to-BIM Rilievo Nuvola Punti">Scan-to-BIM & Rilievo da 2D a 3D</option>
                      <option value="Altro">Altra Consulenza Specialistica</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 uppercase tracking-wider mb-1 font-semibold">
                    Dettagli del Progetto & Note
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Descrivi brevemente l'opera, le superfici stimate, la tempistica o inserisci il link a Wetransfer per farci visionare le tavole preliminari..."
                    className="w-full px-3 py-2.5 bg-stone-900 border border-white/15 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-sans text-xs leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold uppercase tracking-wider transition-all shadow-xl font-mono text-xs"
                >
                  <Send className="h-4 w-4" />
                  <span>Invia Richiesta a Efrem Giannessi</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] text-stone-500">
          <div>
            <span className="text-stone-300 font-bold uppercase">EFREM GIANNESSI</span> • Studio Architettura, Ingegneria BIM 5D & Automazione Software
          </div>
          <div className="flex items-center gap-4">
            <span>Email: EfremGiannessi@gmail.com</span>
            <span>•</span>
            <span>Standard ISO 19650 / UNI 11337</span>
            <span>•</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
