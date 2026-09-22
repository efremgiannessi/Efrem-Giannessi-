import React, { useState } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Check,
  Link2,
  Image as ImageIcon,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { audioSystem } from '../utils/audioSynthesizer';

export interface RenderPresetData {
  id: string;
  title: string;
  category: string;
  software: string;
  description: string;
  resolution: string;
  pbrImage: string;
  clayImage: string;
  nightImage: string;
  specs: string[];
}

export function extractDriveId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && trimmed.includes('drive.google.com')) return idMatch[1];
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch) return dMatch[1];
  return null;
}

export function formatDriveOrDirectUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  const driveId = extractDriveId(trimmed);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}=w2048`;
  }
  return trimmed;
}

interface RenderingImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: RenderPresetData[];
  onSavePresets: (updated: RenderPresetData[]) => void;
  onResetPresets: () => void;
}

export const RenderingImageManagerModal: React.FC<RenderingImageManagerModalProps> = ({
  isOpen,
  onClose,
  presets,
  onSavePresets,
  onResetPresets,
}) => {
  const [formData, setFormData] = useState<RenderPresetData[]>(presets);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);

  if (!isOpen) return null;

  const handleUrlChange = (
    index: number,
    field: 'pbrImage' | 'nightImage' | 'clayImage',
    value: string
  ) => {
    const updated = [...formData];
    updated[index] = {
      ...updated[index],
      [field]: value.trim(),
    };
    setFormData(updated);
  };

  const handleSave = () => {
    audioSystem.playClick(880);
    onSavePresets(formData);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Vuoi ripristinare le immagini predefinite di fabbrica?')) {
      audioSystem.playClick(440);
      onResetPresets();
      onClose();
    }
  };

  const copyConfigForChat = () => {
    const formatted = formData
      .map(
        (p, i) =>
          `SCENARIO ${i + 1} - ${p.title.toUpperCase()}:
- PBR Fotorealistico: ${p.pbrImage}
- Notturno / Golden Hour: ${p.nightImage}
- Clay / Volumi: ${p.clayImage}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(formatted);
    audioSystem.playChime();
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  const currentPreset = formData[activeTab];

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-stone-950 border border-cyan-400/60 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col max-h-[90vh] overflow-hidden text-white font-mono">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:px-6 border-b border-white/10 bg-stone-900/60">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <Link2 className="w-4 h-4 text-cyan-400" />
              GESTIONE LINK IMMAGINI // SEZIONE RENDERING
            </h3>
          </div>
          <button
            onClick={() => {
              audioSystem.playClick(350);
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Guide */}
        <div className="px-4 md:px-6 py-3 bg-cyan-950/30 border-b border-cyan-400/20 text-xs text-stone-300 font-sans flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p>
            Incolla qui i link diretti delle tue immagini (URL web, Google Drive diretti, Imgur, Cloudinary, ecc.).
            I link verranno applicati <strong className="text-cyan-300">istantaneamente</strong> nella sezione.
          </p>
          <button
            onClick={copyConfigForChat}
            className="shrink-0 px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-[11px] flex items-center gap-1.5 transition-colors"
            title="Copia l'elenco dei link per inviarlo all'assistente"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">COPIATO!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>COPIA MODELLO PER CHAT</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 bg-black/40 overflow-x-auto text-xs">
          {formData.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => {
                audioSystem.playClick(500 + idx * 50);
                setActiveTab(idx);
              }}
              className={`px-4 py-3 text-left whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                activeTab === idx
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 font-bold'
                  : 'border-transparent text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>0{idx + 1}. {preset.title}</span>
            </button>
          ))}
        </div>

        {/* Inputs Content Area */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1 bg-stone-950/80">
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-2">
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest block">
                {currentPreset.category}
              </span>
              <h4 className="text-lg font-bold text-white uppercase">{currentPreset.title}</h4>
            </div>

            {/* 1. PBR Diurno Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-cyan-300 flex items-center justify-between">
                <span>1. IMMAGINE PBR FOTOREALISTICO (DIURNA / STANDARD)</span>
                {currentPreset.pbrImage && (
                  <a
                    href={currentPreset.pbrImage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-white/50 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>Apri link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://... (URL dell'immagine diurna ad alta risoluzione)"
                  value={currentPreset.pbrImage}
                  onChange={(e) => handleUrlChange(activeTab, 'pbrImage', e.target.value)}
                  className="flex-1 bg-black/60 border border-white/20 focus:border-cyan-400 px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>
              {/* Preview Thumbnail */}
              {currentPreset.pbrImage && (
                <div className="w-full h-28 bg-black/80 border border-white/10 rounded overflow-hidden mt-1 relative">
                  <img
                    src={formatDriveOrDirectUrl(currentPreset.pbrImage)}
                    alt="PBR Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute bottom-1 right-2 text-[9px] bg-black/80 px-1.5 py-0.5 text-cyan-400 border border-white/10">
                    Anteprima PBR
                  </span>
                </div>
              )}
            </div>

            {/* 2. Night / Golden Hour URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                <span>2. IMMAGINE NOTTURNO / GOLDEN HOUR</span>
                {currentPreset.nightImage && (
                  <a
                    href={currentPreset.nightImage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-white/50 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>Apri link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://... (URL dell'immagine notturna o tramonto)"
                  value={currentPreset.nightImage}
                  onChange={(e) => handleUrlChange(activeTab, 'nightImage', e.target.value)}
                  className="flex-1 bg-black/60 border border-white/20 focus:border-amber-400 px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>
              {/* Preview Thumbnail */}
              {currentPreset.nightImage && (
                <div className="w-full h-28 bg-black/80 border border-white/10 rounded overflow-hidden mt-1 relative">
                  <img
                    src={formatDriveOrDirectUrl(currentPreset.nightImage)}
                    alt="Night Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute bottom-1 right-2 text-[9px] bg-black/80 px-1.5 py-0.5 text-amber-400 border border-white/10">
                    Anteprima Notturno
                  </span>
                </div>
              )}
            </div>

            {/* 3. Clay Model / Studio Volumi URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-purple-300 flex items-center justify-between">
                <span>3. IMMAGINE CLAY / STUDIO VOLUMI ARCHITETTONICI</span>
                {currentPreset.clayImage && (
                  <a
                    href={currentPreset.clayImage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-white/50 hover:text-purple-300 flex items-center gap-1"
                  >
                    <span>Apri link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://... (URL dell'immagine clay/gesso o wireframe)"
                  value={currentPreset.clayImage}
                  onChange={(e) => handleUrlChange(activeTab, 'clayImage', e.target.value)}
                  className="flex-1 bg-black/60 border border-white/20 focus:border-purple-400 px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>
              {/* Preview Thumbnail */}
              {currentPreset.clayImage && (
                <div className="w-full h-28 bg-black/80 border border-white/10 rounded overflow-hidden mt-1 relative">
                  <img
                    src={formatDriveOrDirectUrl(currentPreset.clayImage)}
                    alt="Clay Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale contrast-125"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute bottom-1 right-2 text-[9px] bg-black/80 px-1.5 py-0.5 text-purple-400 border border-white/10">
                    Anteprima Clay
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:px-6 border-t border-white/10 bg-stone-900/90 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="px-3 py-2 border border-rose-500/40 hover:border-rose-400 text-rose-300 hover:text-rose-200 text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RIPRISTINA PREDEFINITI</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioSystem.playClick(350);
                onClose();
              }}
              className="px-4 py-2 border border-white/20 hover:border-white/40 text-stone-300 hover:text-white text-xs transition-colors"
            >
              ANNULLA
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-bold text-xs uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>APPLICA E SALVA IMMAGINI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
