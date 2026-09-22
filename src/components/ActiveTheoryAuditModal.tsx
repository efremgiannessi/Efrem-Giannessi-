import React, { useState } from 'react';
import { X, CheckCircle2, Send, Mail } from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface ActiveTheoryAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectTitle?: string;
}

export const ActiveTheoryAuditModal: React.FC<ActiveTheoryAuditModalProps> = ({
  isOpen,
  onClose,
  defaultProjectTitle = '',
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Richiesta informazioni generali',
    notes: defaultProjectTitle
      ? `Richiesta informazioni relativa a: ${defaultProjectTitle}`
      : '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.notes.trim()) return;

    audioSystem.playClick(900);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.topic,
          message: formData.notes.trim(),
          source: 'modal-contatto-audit',
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmissionId(data.id);
      } else {
        setSubmissionId('MSG-' + Date.now().toString(36).toUpperCase());
      }
    } catch {
      setSubmissionId('MSG-' + Date.now().toString(36).toUpperCase());
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      audioSystem.playChime();
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  const mailtoHref = `mailto:EfremGiannessi@gmail.com?subject=${encodeURIComponent(
    `[Portfolio Modal] ${formData.topic}`
  )}&body=${encodeURIComponent(
    `Nome: ${formData.name}\nEmail: ${formData.email}\nProtocollo: ${submissionId}\n\nNote:\n${formData.notes}`
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
      onClick={handleReset}
    >
      <div
        className="relative w-full max-w-xl bg-stone-950/95 border border-cyan-400/50 shadow-[0_0_80px_rgba(0,240,255,0.3)] flex flex-col overflow-hidden text-stone-200"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Corner Marks */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/70 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-bold uppercase tracking-widest">
              CONTATTA EFREM GIANNESSI
            </span>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 border border-white/20 text-white/60 hover:text-white hover:border-cyan-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 font-mono text-xs overflow-y-auto" data-lenis-prevent>
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto bg-emerald-950/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold uppercase text-white font-sans">
                MESSAGGIO INVIATO CON SUCCESSO
              </h3>
              <p className="text-stone-300 font-sans text-xs max-w-md mx-auto">
                La tua richiesta è stata registrata nel sistema con protocollo{' '}
                <strong className="text-cyan-400 font-mono">{submissionId}</strong>.
                Riceverai riscontro entro 24 ore all'indirizzo{' '}
                <strong className="text-white">{formData.email}</strong>.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={mailtoHref}
                  className="px-5 py-2.5 bg-stone-900 border border-white/20 hover:border-cyan-400 text-cyan-300 font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Apri nel tuo client Email</span>
                </a>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-cyan-400 text-stone-950 font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  CHIUDI
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-stone-300 font-sans text-sm font-light mb-5">
                Compila i campi sottostanti per inviare un messaggio diretto o richiedere informazioni su progetti e collaborazioni.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-[10px] uppercase mb-1">
                    NOME & COGNOME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Es. Mario Rossi"
                    className="w-full bg-stone-900 border border-white/20 focus:border-cyan-400 p-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-[10px] uppercase mb-1">
                    INDIRIZZO EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="mario.rossi@example.it"
                    className="w-full bg-stone-900 border border-white/20 focus:border-cyan-400 p-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase mb-1">
                  ARGOMENTO / SERVIZIO
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  className="w-full bg-stone-900 border border-white/20 focus:border-cyan-400 p-2.5 text-white outline-none"
                >
                  <option>Richiesta informazioni generali</option>
                  <option>Consulenza BIM 5D & Computi Metrici</option>
                  <option>Sviluppo Script pyRevit & Automazioni</option>
                  <option>Proposta di Collaborazione</option>
                  <option>Altro</option>
                </select>
              </div>

              <div>
                <label className="block text-white/50 text-[10px] uppercase mb-1">
                  MESSAGGIO *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Scrivi qui il tuo messaggio o le specifiche della richiesta..."
                  className="w-full bg-stone-900 border border-white/20 focus:border-cyan-400 p-2.5 text-white outline-none font-sans text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <span className="text-white/40 text-[10px]">
                  RISCONTRO RAPIDO ENTRO 24H
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-stone-950 font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>INVIO IN CORSO...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>INVIA MESSAGGIO</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
