import React, { useState } from 'react';
import {
  Mail,
  X,
  Send,
  Calendar,
  Phone,
  FileCheck,
  CheckCircle2,
  Building,
  User,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface DirectAuditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export const DirectAuditBookingModal: React.FC<DirectAuditBookingModalProps> = ({
  isOpen,
  onClose,
  initialMessage = '',
}) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('BIM 5D & Computo');
  const [projectType, setProjectType] = useState<string>('Edilizia Residenziale');
  const [message, setMessage] = useState<string>(initialMessage);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioSystem.playChime();

    // Prepare mailto link with pre-filled content
    const subject = encodeURIComponent(`Richiesta Consulenza / Audit BIM: ${serviceType} - ${name || 'Nuovo Progetto'}`);
    const bodyContent = `Gentile Efrem Giannessi,
richiedo una consulenza / preventivo tecnico per il seguente progetto:

• Nome / Azienda: ${name}
• Email: ${email}
• Telefono: ${phone}
• Servizio Richiesto: ${serviceType}
• Tipologia Opera: ${projectType}

NOTE / SPECIFICHE DI PROGETTO:
${message || 'Nessuna specifica aggiuntiva inserita.'}

Inviato dallo Studio Virtuale Interattivo 360°`;

    window.location.href = `mailto:EfremGiannessi@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-booking-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-xl rounded-3xl border border-white/20 bg-stone-950/95 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl text-stone-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 font-black shadow-lg shadow-amber-500/30">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2 id="audit-booking-title" className="text-base sm:text-lg font-bold text-white tracking-wide">
                Richiesta Audit BIM & Consulenza Dedicata
              </h2>
              <p className="text-xs text-stone-400">
                Invia direttamente la tua richiesta a Efrem Giannessi (risposta entro 24-48 ore)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              audioSystem.playClick(500);
              onClose();
            }}
            className="rounded-xl p-2 text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Chiudi modulo"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Client di Posta Aperto!</h3>
            <p className="text-xs text-stone-300 max-w-sm">
              La tua richiesta è stata precompilata nel tuo programma email. Clicca invia per recapitare il messaggio direttamente a <strong>EfremGiannessi@gmail.com</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 my-3 overflow-y-auto min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-300 uppercase block mb-1">
                  Nome e Cognome / Studio
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                  <input
                    type="text"
                    required
                    placeholder="Arch. Mario Rossi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-300 uppercase block mb-1">
                  Email di Contatto
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                  <input
                    type="email"
                    required
                    placeholder="mario.rossi@studio.it"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-300 uppercase block mb-1">
                  Ambito di Consulenza
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-stone-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="BIM 5D & Computo Metrico">Progettazione BIM 5D & Computo</option>
                  <option value="Sviluppo Plugin Revit & pyRevit">Sviluppo Plugin Revit & pyRevit</option>
                  <option value="Virtual Staging & Rendering">Virtual Staging & Rendering</option>
                  <option value="Conversione 2D DWG in BIM 3D">Conversione da CAD 2D a BIM 3D</option>
                  <option value="Audit BIM & Transizione Digitale">Audit BIM & Consulenza Imprese</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-300 uppercase block mb-1">
                  Tipologia di Immobile / Opera
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-stone-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Edilizia Residenziale">Edilizia Residenziale (Ville / Condomini)</option>
                  <option value="Complesso Commerciale / Uffici">Terziario / Uffici / Negozi</option>
                  <option value="Capannone Industriale / Logistica">Industriale & Logistica</option>
                  <option value="Opera Pubblica / Infrastruttura">Appalto Pubblico / Infrastruttura</option>
                  <option value="Ristrutturazione & Rilievo">Ristrutturazione & Rilievo Storico</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-300 uppercase block mb-1">
                Descrizione Progetto / Domande
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descrivi brevemente superfici previste, tempistiche o necessità particolari..."
                className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-xs text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-stone-400">
                Email diretta: <strong>EfremGiannessi@gmail.com</strong>
              </span>
              <button
                type="submit"
                id="btn-submit-audit-form"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold py-2 px-4 text-xs shadow-lg shadow-amber-500/30 transition-all active:scale-95"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Genera Email & Invia</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
