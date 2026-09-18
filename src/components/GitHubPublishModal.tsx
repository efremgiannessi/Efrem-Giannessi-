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
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-stone-950 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-2xl my-8"
      >
        {/* Glow effect */}
        <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          id="close-github-modal"
          onClick={() => {
            audioSystem.playClick(450);
            onClose();
          }}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white">
            <Github className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                Guida Pronta
              </span>
              <span className="text-xs text-stone-400">Deploy Statico Gratuito</span>
            </div>
            <h2 id="github-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
              Come Pubblicare su GitHub & GitHub Pages
            </h2>
          </div>
        </div>

        <p className="text-sm text-stone-300 mb-6 leading-relaxed">
          Il tuo sito è sviluppato con <strong>React, Vite e Tailwind CSS</strong>. Puoi esportarlo come pacchetto statico compilato (HTML, CSS e JS) o caricarne il codice sorgente su GitHub per ospitarlo live gratis su <strong>GitHub Pages</strong>.
        </p>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20"
            >
              <h3 className="font-semibold text-amber-300 text-sm flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                {step.title}
              </h3>
              <p className="mt-1 text-xs text-stone-300">{step.description}</p>

              {/* Code block with copy button */}
              <div className="mt-3 relative rounded-xl bg-stone-900/90 border border-white/10 p-3 font-mono text-xs text-emerald-300">
                <pre className="overflow-x-auto whitespace-pre-wrap">{step.command}</pre>
                <button
                  type="button"
                  onClick={() => copyToClipboard(step.command, idx)}
                  className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] font-sans font-medium text-stone-200 hover:bg-white/20 transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      Copiato!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copia
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tip Box */}
        <div className="mt-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 p-3.5 flex items-start gap-3 text-xs text-amber-200">
          <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-300">Consiglio per GitHub Pages con Vite:</p>
            <p className="mt-0.5 text-stone-300">
              Se il tuo sito risiede su un percorso secondario come <code className="text-amber-200">https://username.github.io/modern-office-tour/</code>, aggiungi <code className="text-amber-200">base: './'</code> nel file <code className="text-amber-200">vite.config.ts</code> per risolvere automaticamente tutti i percorsi degli asset.
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Globe className="h-4 w-4 text-emerald-400" />
            <span>Compatibile al 100% con GitHub Pages, Vercel e Netlify</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-400 transition-colors"
          >
            Ho capito, chiudi
          </button>
        </div>
      </motion.div>
    </div>
  );
};
