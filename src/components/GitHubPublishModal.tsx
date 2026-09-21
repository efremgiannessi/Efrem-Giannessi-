import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Check, Terminal, Globe, Github, Sparkles, FolderArchive } from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

interface GitHubPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPublishModal: React.FC<GitHubPublishModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    audioSystem.playClick(900);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const steps = [
    {
      title: '1. Inizializza il repository locale',
      description: 'Apri il terminale nella cartella del progetto ed esegui i comandi Git per salvare tutti i file:',
      command: `git init\ngit add .\ngit commit -m "Sito interattivo Ufficio Moderno con video ed emoji"`,
    },
    {
      title: '2. Crea un nuovo repository su GitHub',
      description: 'Vai su github.com/new e crea un nuovo repository pubblico (es. "modern-office-tour"). Poi collegalo al progetto locale:',
      command: `git branch -M main\ngit remote add origin https://github.com/TUO-USERNAME/modern-office-tour.git\ngit push -u origin main`,
    },
    {
      title: '3. Pubblicazione su GitHub Pages (Deploy Automatico)',
      description: 'Per rendere il sito accessibile online a tutti gratuitamente su GitHub Pages, compila con build ed esporta:',
      command: `npm run build\nnpx gh-pages -d dist`,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-none border border-white/20 bg-stone-950 p-6 sm:p-7 text-white shadow-2xl backdrop-blur-2xl my-8"
      >
        {/* Architectural corner marks */}
        <div className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 z-20" />
        <div className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400 z-20" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400 z-20" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 z-20" />

        {/* Close Button */}
        <button
          type="button"
          id="close-github-modal"
          onClick={() => {
            audioSystem.playClick(450);
            onClose();
          }}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-none border border-white/10 bg-white/5 text-stone-400 hover:border-amber-400/50 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-white/10">
          <div className="flex h-11 w-11 items-center justify-center rounded-none bg-amber-400/10 border border-amber-400/40 text-amber-400">
            <Github className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-none bg-emerald-500/15 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                GIT DEPLOY
              </span>
              <span className="text-[11px] font-mono text-stone-400">CI/CD STATICO</span>
            </div>
            <h2 id="github-modal-title" className="text-base sm:text-lg font-bold tracking-tight text-white mt-0.5">
              Guida Pubblicazione Repository & GitHub Pages
            </h2>
          </div>
        </div>

        <p className="text-xs text-stone-300 mb-5 leading-relaxed font-light">
          L'applicazione è sviluppata con <strong>React, Vite e Tailwind CSS</strong>. Puoi esportarla come pacchetto statico compilato o caricarne il codice su GitHub per il deploy continuo su <strong>GitHub Pages</strong>.
        </p>

        {/* Steps List */}
        <div className="space-y-3.5 font-mono">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="rounded-none border border-white/10 bg-stone-900/60 p-3.5 transition-colors hover:border-white/20"
            >
              <h3 className="font-bold text-amber-300 text-xs flex items-center gap-2 uppercase tracking-wider">
                <Terminal className="h-3.5 w-3.5 text-amber-400" />
                {step.title}
              </h3>
              <p className="mt-1 text-[11px] text-stone-300 font-sans">{step.description}</p>

              {/* Code block with copy button */}
              <div className="mt-2.5 relative rounded-none bg-stone-950 border border-white/10 p-3 font-mono text-xs text-emerald-300">
                <pre className="overflow-x-auto whitespace-pre-wrap">{step.command}</pre>
                <button
                  type="button"
                  onClick={() => copyToClipboard(step.command, idx)}
                  className="absolute right-2 top-2 flex items-center gap-1 rounded-none border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-mono uppercase text-stone-200 hover:border-amber-400/50 hover:bg-white/20 transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      Copiato!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copia
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tip Box */}
        <div className="mt-4 rounded-none bg-amber-400/10 border border-amber-400/30 p-3 flex items-start gap-2.5 text-xs text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px]">
            <span className="font-mono uppercase font-bold text-amber-300 block mb-0.5">Nota per GitHub Pages:</span>
            <p className="text-stone-300 font-light leading-relaxed">
              Se il repository risiede su un subpath (es. <code className="text-amber-200 font-mono">username.github.io/repo/</code>), impostare <code className="text-amber-200 font-mono">base: './'</code> in <code className="text-amber-200 font-mono">vite.config.ts</code> per risolvere i percorsi relativi.
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2 text-[10px] text-stone-400">
            <Globe className="h-3.5 w-3.5 text-emerald-400" />
            <span>COMPATIBILITÀ GITHUB PAGES • VERCEL • NETLIFY</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-none bg-amber-400 hover:bg-amber-300 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider text-stone-950 transition-colors shadow-sm"
          >
            Chiudi Scheda
          </button>
        </div>
      </motion.div>
    </div>
  );
};
