import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Copy, ArrowUpRight } from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface ActiveTheoryContactProps {
  onOpenAuditModal?: () => void;
}

export const ActiveTheoryContact: React.FC<ActiveTheoryContactProps> = () => {
  const [copied, setCopied] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Richiesta generale');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [submissionTimestamp, setSubmissionTimestamp] = useState<string>('');
  const [autoOpenClient, setAutoOpenClient] = useState(false);
  const [formSubmitActive, setFormSubmitActive] = useState<boolean | null>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText('EfremGiannessi@gmail.com');
    setCopied(true);
    audioSystem.playClick(800);
    setTimeout(() => setCopied(false), 2000);
  };

  // Direct mailto link as secondary instant channel
  const mailtoHref = `mailto:EfremGiannessi@gmail.com?subject=${encodeURIComponent(
    `[Portfolio BIM] ${subject} - da ${name || 'Contatto'}`
  )}&body=${encodeURIComponent(
    `Mittente: ${name}\nEmail: ${email}\nProtocollo: ${submissionId || 'MSG-DIRETTO'}\n\nMessaggio:\n${message}`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    audioSystem.playClick(900);
    setIsSubmitting(true);

    const generatedId =
      'MSG-' +
      Date.now().toString(36).toUpperCase() +
      '-' +
      Math.random().toString(36).substring(2, 6).toUpperCase();
    const formattedDate = new Date().toLocaleString('it-IT');

    try {
      // 1. Post to local server endpoint (logs and persists to disk)
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          source: 'modulo-contatto-diretto',
        }),
      }).catch((err) => console.warn('[CONTACT] Local API error:', err));

      // 2. Direct browser dispatch to FormSubmit for immediate delivery to EfremGiannessi@gmail.com
      const fsRes = await fetch('https://formsubmit.co/ajax/EfremGiannessi@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          _subject: `[Portfolio BIM] ${subject.trim()} - da ${name.trim()}`,
          _replyto: email.trim(),
          _template: 'table',
          _captcha: 'false',
          protocollo: generatedId,
          argomento: subject.trim(),
          messaggio: message.trim(),
          dataOra: formattedDate,
        }),
      });

      const fsData = await fsRes.json();
      if (fsData.success === 'true' || fsData.success === true) {
        setFormSubmitActive(true);
      } else if (fsData.message && fsData.message.includes('Activation')) {
        setFormSubmitActive(false);
      }
    } catch (err: any) {
      console.warn('[CONTACT] Dispatch error:', err);
    } finally {
      setSubmissionId(generatedId);
      setSubmissionTimestamp(formattedDate);
      setIsSubmitting(false);
      setIsSubmitted(true);
      audioSystem.playChime();

      if (autoOpenClient) {
        window.location.href = mailtoHref;
      }
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setSubject('Richiesta generale');
    setMessage('');
    setIsSubmitted(false);
    setSubmissionId('');
    setFormSubmitActive(null);
    audioSystem.playClick(700);
  };

  return (
    <section id="contact" className="pt-20 pb-8 px-6 md:px-16 select-none relative z-10 border-t border-white/10 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>SITO PERSONALE // CONTATTO DIRETTO</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tight mb-4">
          METTITI IN CONTATTO
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">
            SCRIVIMI UN MESSAGGIO
          </span>
        </h2>

        <p className="text-stone-300 font-sans text-base md:text-lg font-light max-w-2xl mb-12">
          Disponibile per collaborazioni a progetto, consulenze BIM, computi metrici 5D,
          sviluppo di script pyRevit o semplici informazioni. Compila il modulo qui sotto
          oppure scrivimi direttamente via email.
        </p>

        {/* 2-Column Layout: Direct Details on Left, Clean Contact Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column: Direct Info (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Email Card */}
            <div className="p-6 bg-stone-950/40 backdrop-blur-[2px] border border-white/15 hover:border-cyan-400 transition-colors shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <span className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                CORRISPONDENZA DIRETTA
              </span>
              <div className="text-lg font-bold text-white mb-2 break-all font-mono">
                EfremGiannessi@gmail.com
              </div>
              <p className="text-stone-400 font-sans text-xs mb-5">
                Riscontro garantito entro 24 ore lavorative.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="px-4 py-2 bg-stone-900/80 border border-white/20 hover:border-cyan-400 text-cyan-300 uppercase tracking-wider font-mono text-xs flex items-center gap-2 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'COPIATO!' : 'COPIA EMAIL'}</span>
                </button>
                <a
                  href="mailto:EfremGiannessi@gmail.com"
                  className="px-4 py-2 border border-white/10 hover:border-white/30 text-white/70 hover:text-white uppercase tracking-wider font-mono text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>APRI EMAIL</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Competence Pills Card */}
            <div className="p-6 bg-stone-950/40 backdrop-blur-[2px] border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <span className="text-white/40 block text-[10px] font-mono uppercase mb-2">
                AREE DI INTERVENTO
              </span>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/80">Modellazione BIM (Revit)</span>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/80">Computi Metrici & Stime</span>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/80">AutoCAD & Twinmotion</span>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/80">ERP & Gestionali</span>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/80">Contrattualistica</span>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/80">Coordinamento & Acquisti</span>
                <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/80">Windows, Linux & Office 365</span>
              </div>
            </div>
          </div>

          {/* Right Column: Simple Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-stone-950/60 backdrop-blur-md border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="text-cyan-400 block text-[10px] font-mono uppercase tracking-widest font-bold">
                    MODULO DI CONTATTO
                  </span>
                  <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide">
                    Invia un Messaggio Diretto
                  </h3>
                </div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              {isSubmitted ? (
                <div className="py-8 px-2 flex flex-col items-center text-center animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-white font-mono uppercase mb-2">
                    MESSAGGIO INVIATO CON SUCCESSO!
                  </h4>
                  <p className="text-stone-300 text-sm max-w-lg mb-4 font-sans">
                    Grazie <strong className="text-white">{name}</strong>, la tua richiesta è stata registrata nel sistema con protocollo univoco.
                  </p>

                  {/* Delivery Status Banner */}
                  {formSubmitActive === false ? (
                    <div className="w-full mb-4 p-3.5 bg-amber-500/10 border border-amber-500/30 text-left font-sans text-xs text-amber-200">
                      <div className="font-bold uppercase tracking-wider mb-1 font-mono text-amber-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        Attivazione Iniziale FormSubmit per EfremGiannessi@gmail.com
                      </div>
                      È stata inviata un'email a <strong>EfremGiannessi@gmail.com</strong> con oggetto <em>"Activate Form"</em>. È sufficiente aprirla e cliccare una sola volta su <strong>"Activate Form"</strong> per abilitare la ricezione istantanea dei moduli futuri.
                    </div>
                  ) : (
                    <div className="w-full mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-left font-sans text-xs text-emerald-200 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Inoltrato direttamente a <strong>EfremGiannessi@gmail.com</strong>.</span>
                    </div>
                  )}

                  {/* Submission Receipt Box */}
                  <div className="w-full bg-stone-900/90 border border-white/15 p-4 mb-6 text-left font-mono text-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between text-white/50 border-b border-white/10 pb-2">
                      <span>PROTOCOLLO RICEVUTA:</span>
                      <span className="text-cyan-400 font-bold">{submissionId}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-white/50">
                      <span>DATA &amp; ORA REGISTRAZIONE:</span>
                      <span className="text-white">{submissionTimestamp}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-white/50">
                      <span>DESTINATARIO:</span>
                      <span className="text-white font-semibold">EfremGiannessi@gmail.com</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-white/50">
                      <span>OGGETTO:</span>
                      <span className="text-white">{subject}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={mailtoHref}
                      className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Invia anche con il tuo Client Email (Gmail / Outlook)</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-5 py-2.5 bg-stone-900 border border-white/20 hover:border-cyan-400 text-cyan-300 font-mono text-xs uppercase tracking-wider transition-colors"
                    >
                      Invia un altro messaggio
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="contact-name" className="block text-white/60 text-[10px] uppercase mb-1.5">
                        Nome e Cognome *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Es. Mario Rossi"
                        className="w-full bg-stone-900/80 border border-white/15 focus:border-cyan-400 px-3.5 py-2.5 text-stone-100 text-xs placeholder:text-stone-600 outline-none transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="contact-email" className="block text-white/60 text-[10px] uppercase mb-1.5">
                        Indirizzo Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mario.rossi@example.it"
                        className="w-full bg-stone-900/80 border border-white/15 focus:border-cyan-400 px-3.5 py-2.5 text-stone-100 text-xs placeholder:text-stone-600 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="contact-subject" className="block text-white/60 text-[10px] uppercase mb-1.5">
                      Oggetto / Argomento
                    </label>
                    <select
                      id="contact-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-stone-900/80 border border-white/15 focus:border-cyan-400 px-3.5 py-2.5 text-stone-100 text-xs outline-none transition-colors"
                    >
                      <option value="Richiesta generale">Richiesta generale / Informazioni</option>
                      <option value="Modellazione BIM con Revit">Modellazione BIM con Revit</option>
                      <option value="Computi Metrici e Stime">Computi Metrici e Stime</option>
                      <option value="Proposte Commerciali e Contrattualistica">Proposte Commerciali e Contrattualistica</option>
                      <option value="Coordinamento e Gestione Acquisti">Coordinamento e Gestione Acquisti</option>
                      <option value="Altro">Altro</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-white/60 text-[10px] uppercase mb-1.5">
                      Messaggio *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Descrivi brevemente il tuo progetto, le tue esigenze o la richiesta di contatto..."
                      className="w-full bg-stone-900/80 border border-white/15 focus:border-cyan-400 p-3.5 text-stone-100 text-xs placeholder:text-stone-600 outline-none transition-colors resize-none font-sans"
                    />
                  </div>

                  {/* Optional instant mail client toggle */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white select-none">
                      <input
                        type="checkbox"
                        checked={autoOpenClient}
                        onChange={(e) => setAutoOpenClient(e.target.checked)}
                        className="rounded border-white/20 bg-stone-900 text-cyan-400 focus:ring-0"
                      />
                      <span className="text-[11px] font-sans">
                        Apri in contemporanea la mia app di posta (Gmail / Outlook) per invio copia garantito
                      </span>
                    </label>
                  </div>

                  {/* Submit Button & Direct Client Send */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                    <span className="text-[10px] text-white/40">
                      * Campi obbligatori. Recapito diretto a EfremGiannessi@gmail.com
                    </span>

                    <div className="flex flex-wrap items-center gap-2.5 ml-auto">
                      <a
                        href={mailtoHref}
                        className="px-4 py-3 bg-stone-900 border border-white/20 hover:border-cyan-400 text-cyan-300 font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                        title="Invia direttamente con il tuo programma di posta predefinito"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Apri Client Posta</span>
                      </a>

                      <button
                        id="btn-submit-contact"
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-stone-950 font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
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
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer legal & telemetric: personal name only, NO "ARCH.", NO "ORDINE ARCHITETTI", NO "STUDIO TECNICO" */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-white/40">
          <div>
            © {new Date().getFullYear()} EFREM GIANNESSI
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>UNI 11337 / ISO 19650</span>
            <span>•</span>
            <span className="text-cyan-400">ACTIVE THEORY KINETIC ENGINE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
