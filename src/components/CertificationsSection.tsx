import React from 'react';
import {
  ShieldCheck,
  Lock,
  Scale,
  HeartHandshake,
  HardHat,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

export const CertificationsSection: React.FC = () => {
  const certifications = [
    {
      code: 'CERT // 01',
      title: 'Codice Etico',
      category: 'GOVERNANCE & INTEGRITÀ',
      icon: <Scale className="w-5 h-5 text-cyan-400" />,
      description:
        'Adesione e formazione sui principi di condotta etica aziendale, correttezza nei rapporti commerciali e trasparenza gestionale.',
    },
    {
      code: 'CERT // 02',
      title: 'Cyber Security',
      category: 'SICUREZZA INFORMATICA & DATI',
      icon: <Lock className="w-5 h-5 text-purple-400" />,
      description:
        'Procedure di protezione dei sistemi informativi, gestione sicura delle credenziali, tutela del know-how e conformità agli standard di riservatezza.',
    },
    {
      code: 'CERT // 03',
      title: 'D.Lgs 231/2001',
      category: 'COMPLIANCE NORMATIVA',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      description:
        'Modelli di organizzazione, gestione e controllo per la prevenzione dei reati societari e la responsabilità amministrativa degli enti.',
    },
    {
      code: 'CERT // 04',
      title: 'Diritti Umani',
      category: 'RESPONSABILITÀ SOCIALE',
      icon: <HeartHandshake className="w-5 h-5 text-rose-400" />,
      description:
        'Promozione di ambienti di lavoro inclusivi, tutela della dignità del lavoro e rispetto dei diritti umani lungo tutta la filiera operativa.',
    },
    {
      code: 'CERT // 05',
      title: 'Sicurezza sul Lavoro',
      category: 'SALUTE & PREVENZIONE (D.LGS 81/08)',
      icon: <HardHat className="w-5 h-5 text-amber-400" />,
      description:
        'Formazione per la tutela della salute nei luoghi di lavoro e nei cantieri, identificazione dei rischi e conformità alle direttive di sicurezza vigenti.',
    },
  ];

  return (
    <section id="certificazioni" className="py-24 px-6 md:px-16 select-none relative z-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>COMPLIANCE & ATTESTAZIONI // FORMAZIONE CONTINUA</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
              FORMAZIONE E CERTIFICAZIONI
            </h2>
          </div>

          <div className="font-mono text-xs text-white/50 text-left md:text-right max-w-md">
            Certificati su tematiche di rilevanza aziendale: codice etico, cyber security,
            D.Lgs 231/2001, diritti umani e sicurezza sul lavoro.
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="p-6 md:p-8 bg-stone-950/60 border border-cyan-400/40 backdrop-blur-md mb-10 shadow-[0_0_30px_rgba(0,240,255,0.1)] flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border border-cyan-400 bg-cyan-950/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                CONFORMITÀ & STANDARD AZIENDALI
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white font-mono uppercase">
                Certificati su Tematiche di Rilevanza Aziendale
              </h3>
            </div>
          </div>
          <div className="font-mono text-xs text-stone-300 max-w-md">
            Aggiornamento continuo su protocolli etici, sicurezza digitale e normative
            di legge a supporto della governance d'impresa.
          </div>
        </div>

        {/* 5 Certification Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((item) => (
            <div
              key={item.code}
              onMouseEnter={() => audioSystem.playTechHover()}
              className="p-6 bg-stone-950/40 backdrop-blur-[2px] border border-white/10 hover:border-cyan-400 transition-all flex flex-col justify-between group shadow-[0_6px_25px_rgba(0,0,0,0.5)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-cyan-400 font-bold tracking-wider">
                    {item.code}
                  </span>
                  <div className="p-2 border border-white/10 bg-white/5 group-hover:border-cyan-400/50 transition-colors">
                    {item.icon}
                  </div>
                </div>

                <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1.5">
                  {item.category}
                </div>

                <h3 className="font-mono text-base md:text-lg font-bold text-white mb-3 tracking-wide">
                  {item.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-white/10 flex items-center gap-2 font-mono text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider">Certificato Attivo</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
