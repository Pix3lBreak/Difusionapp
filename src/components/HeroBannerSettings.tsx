import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { HeroBannerConfig, HeroBannerType } from '../types';
import {
  Image as ImageIcon,
  Video,
  Layers,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Eye,
  Sliders,
  Play,
  RotateCw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

interface HeroBannerSettingsProps {
  compact?: boolean;
}

export const HeroBannerSettings: React.FC<HeroBannerSettingsProps> = ({ compact = false }) => {
  const { themeConfig, updateThemeConfig, showToast } = useApp();

  const heroConfig: HeroBannerConfig = themeConfig.heroBannerConfig || {
    enabled: true,
    type: 'slideshow',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1920&q=80',
    slideshowImages: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1920&q=80',
    ],
    slideshowIntervalSeconds: 6,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-neon-room-41584-large.mp4',
    opacity: 0.22,
    overlayTint: 'vignette',
    blur: 1,
    watermarkText: 'DIFUSION VENEZUELA',
  };

  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (updates: Partial<HeroBannerConfig>) => {
    const updated = {
      ...heroConfig,
      ...updates,
    };
    updateThemeConfig({ heroBannerConfig: updated });
  };

  // Preset packs
  const PRESET_SLIDESHOW_RUNWAY = [
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1920&q=80',
  ];

  const PRESET_SLIDESHOW_STUDIO = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1920&q=80',
  ];

  const VIDEO_PRESETS = [
    {
      label: 'Pasarela Neón HD (Recomendado)',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-neon-room-41584-large.mp4',
    },
    {
      label: 'Catwalk & Desfile Fashion',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-top-model-walking-on-a-runway-41578-large.mp4',
    },
    {
      label: 'Sesión Fotográfica Glamour',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-studio-with-soft-lights-41587-large.mp4',
    },
  ];

  // Add image to slideshow
  const handleAddSlideshowImage = (urlToAdd: string) => {
    const trimmed = urlToAdd.trim();
    if (!trimmed) {
      showToast('Por favor introduce un enlace de imagen válido.');
      return;
    }
    const currentList = heroConfig.slideshowImages || [];
    if (currentList.length >= 12) {
      showToast('Límite de 12 imágenes alcanzado para la rotación.');
      return;
    }
    handleUpdate({ slideshowImages: [...currentList, trimmed] });
    setNewImageUrl('');
    showToast('✓ Imagen agregada a la rotación de cabecera.');
  };

  // Remove image from slideshow
  const handleRemoveSlideshowImage = (index: number) => {
    const currentList = heroConfig.slideshowImages || [];
    if (currentList.length <= 1) {
      showToast('Debe haber al menos una imagen en la galería.');
      return;
    }
    const updated = currentList.filter((_, i) => i !== index);
    handleUpdate({ slideshowImages: updated });
    showToast('Imagen eliminada de la rotación.');
  };

  // File upload for slideshow
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('El archivo es demasiado pesado (máximo 8MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        handleAddSlideshowImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  // File upload for single image
  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('El archivo es demasiado pesado (máximo 8MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        handleUpdate({ imageUrl: dataUrl });
        showToast('✓ Imagen de cabecera actualizada.');
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Fondo de Cabecera en Marca de Agua
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Personaliza el video o imagen de fondo detrás del título principal{' '}
                  <strong className="text-zinc-200">"Modelos y Promotoras de Élite en Venezuela"</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Master Toggle */}
          <label className="flex items-center gap-3 cursor-pointer self-end sm:self-center px-3 py-2 rounded-xl bg-black border border-zinc-800 hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={heroConfig.enabled}
              onChange={(e) => handleUpdate({ enabled: e.target.checked })}
              className="w-4 h-4 accent-lime-400 rounded cursor-pointer"
            />
            <span className="text-xs font-semibold text-white">
              {heroConfig.enabled ? '✓ Fondo Activado' : 'Fondo Desactivado'}
            </span>
          </label>
        </div>
      </div>

      {heroConfig.enabled && (
        <>
          {/* Format Selector: Slideshow, Video, Single Image, Gradient */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <label className="block text-xs font-bold text-white uppercase tracking-wider">
              1. Selecciona el Tipo de Fondo:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Slideshow */}
              <button
                type="button"
                onClick={() => handleUpdate({ type: 'slideshow' })}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  heroConfig.type === 'slideshow'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white shadow-lg shadow-[var(--color-primary)]/10'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <RotateCw className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-xs font-bold text-white">Galería que se Alterna</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Rotación de varias fotografías de pasarela que cambian suavemente cada pocos segundos.
                </p>
                {heroConfig.type === 'slideshow' && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                )}
              </button>

              {/* Option 2: Looping Video */}
              <button
                type="button"
                onClick={() => handleUpdate({ type: 'video' })}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  heroConfig.type === 'video'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white shadow-lg shadow-[var(--color-primary)]/10'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-xs font-bold text-white">Video en Bucle (Loop)</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Video continuo en alta definición (MP4/WebM) en segundo plano mudo con marca de agua.
                </p>
                {heroConfig.type === 'video' && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                )}
              </button>

              {/* Option 3: Single Static Image */}
              <button
                type="button"
                onClick={() => handleUpdate({ type: 'image' })}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  heroConfig.type === 'image'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white shadow-lg shadow-[var(--color-primary)]/10'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-xs font-bold text-white">Imagen Fija Única</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Una foto estática de alta calidad con efecto de marca de agua tenue y elegante.
                </p>
                {heroConfig.type === 'image' && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Mode-Specific Settings */}
          {/* SECTION A: SLIDESHOW CONFIG */}
          {heroConfig.type === 'slideshow' && (
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    2. Imágenes de la Rotación ({heroConfig.slideshowImages?.length || 0})
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Estas imágenes se alternarán automáticamente con fundido suave.
                  </p>
                </div>

                {/* Interval Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-medium">Cambiar cada:</span>
                  <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-zinc-800">
                    {[3, 5, 6, 8, 10].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => handleUpdate({ slideshowIntervalSeconds: sec })}
                        className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                          heroConfig.slideshowIntervalSeconds === sec
                            ? 'bg-[var(--color-primary)] text-black'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {heroConfig.slideshowImages?.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="group relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900"
                  >
                    <img
                      src={url}
                      alt={`Fondo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-2">
                      <span className="px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-white font-bold">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlideshowImage(idx)}
                        className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                        title="Eliminar de la rotación"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Image Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Pegar URL de imagen (https://...)"
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddSlideshowImage(newImageUrl)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Añadir URL</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Subir Foto</span>
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 pt-2 text-xs text-zinc-400 flex-wrap">
                <span className="text-zinc-500 font-medium">Presets recomendados:</span>
                <button
                  type="button"
                  onClick={() => handleUpdate({ slideshowImages: PRESET_SLIDESHOW_RUNWAY })}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-[11px]"
                >
                  Pasarela & Moda VIP
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate({ slideshowImages: PRESET_SLIDESHOW_STUDIO })}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-[11px]"
                >
                  Estudio Fotográfico Editorial
                </button>
              </div>
            </div>
          )}

          {/* SECTION B: VIDEO CONFIG */}
          {heroConfig.type === 'video' && (
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  2. Video de Pasarela / Eventos en Bucle (Loop MP4 / WebM)
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Introduce el enlace directo de un video MP4 en bucle mudo. Se reproducirá fluidamente en segundo plano.
                </p>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
                  URL del Video (MP4 / WebM):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={heroConfig.videoUrl || ''}
                    onChange={(e) => handleUpdate({ videoUrl: e.target.value })}
                    placeholder="https://.../video.mp4"
                    className="flex-1 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--color-primary)] font-mono"
                  />
                </div>
              </div>

              {/* Video Presets */}
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
                  Videos de Pasarela Listos para Usar:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {VIDEO_PRESETS.map((vp) => (
                    <button
                      key={vp.url}
                      type="button"
                      onClick={() => handleUpdate({ videoUrl: vp.url })}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                        heroConfig.videoUrl === vp.url
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white font-semibold'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{vp.label}</span>
                      {heroConfig.videoUrl === vp.url && (
                        <Check className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mini Video Preview */}
              {heroConfig.videoUrl && (
                <div className="relative aspect-video max-w-sm rounded-xl overflow-hidden border border-zinc-800 bg-black">
                  <video
                    src={heroConfig.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-bold flex items-center gap-1">
                    <Play className="w-2.5 h-2.5 text-[var(--color-primary)] fill-[var(--color-primary)]" />
                    Vista previa de reproducción
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION C: SINGLE IMAGE CONFIG */}
          {heroConfig.type === 'image' && (
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  2. Imagen Fija de Cabecera
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Introduce la URL o sube una fotografía de alta resolución.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <input
                  type="url"
                  value={heroConfig.imageUrl || ''}
                  onChange={(e) => handleUpdate({ imageUrl: e.target.value })}
                  placeholder="https://.../imagen.jpg"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--color-primary)] font-mono"
                />
                <input
                  type="file"
                  ref={singleFileInputRef}
                  onChange={handleSingleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => singleFileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  <span>Subir Foto</span>
                </button>
              </div>

              {/* Single Image Preview */}
              {heroConfig.imageUrl && (
                <div className="relative aspect-video max-w-sm rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                  <img
                    src={heroConfig.imageUrl}
                    alt="Cabecera actual"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-bold">
                    Imagen activa
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: WATERMARK & OPACITY CONTROLS */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                3. Ajustes de Marca de Agua & Visibilidad
              </h4>
              <p className="text-[11px] text-zinc-400">
                Ajusta la transparencia para que el texto y el buscador de modelos se lean con perfecta nitidez.
              </p>
            </div>

            {/* Opacity Slider & Quick Buttons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-300">
                  Opacidad de la Marca de Agua:
                </label>
                <span className="font-mono text-xs text-[var(--color-primary)] font-bold">
                  {Math.round((heroConfig.opacity || 0.22) * 100)}%
                </span>
              </div>

              <input
                type="range"
                min="0.05"
                max="0.65"
                step="0.01"
                value={heroConfig.opacity || 0.22}
                onChange={(e) => handleUpdate({ opacity: parseFloat(e.target.value) })}
                className="w-full accent-lime-400 cursor-pointer"
              />

              <div className="flex items-center justify-between gap-2 mt-2">
                {[
                  { label: 'Muy Sutil (12%)', val: 0.12 },
                  { label: 'Recomendado (22%)', val: 0.22 },
                  { label: 'Moderado (32%)', val: 0.32 },
                  { label: 'Intenso (48%)', val: 0.48 },
                ].map((op) => (
                  <button
                    key={op.label}
                    type="button"
                    onClick={() => handleUpdate({ opacity: op.val })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                      Math.abs((heroConfig.opacity || 0.22) - op.val) < 0.03
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Blur & Overlay Tint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-800/80">
              {/* Blur Level */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Desenfoque / Blur de Fondo:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: '0px (Nítido)', val: 0 },
                    { label: '1px (Suave)', val: 1 },
                    { label: '2px (Cine)', val: 2 },
                    { label: '4px (Editorial)', val: 4 },
                  ].map((b) => (
                    <button
                      key={b.val}
                      type="button"
                      onClick={() => handleUpdate({ blur: b.val })}
                      className={`p-2 rounded-lg text-center text-[10px] font-bold border transition-colors ${
                        (heroConfig.blur ?? 1) === b.val
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overlay Tint */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Tinte de Contraste:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Viñeta Radial', val: 'vignette' },
                    { label: 'Carbón Dark', val: 'dark' },
                    { label: 'Glow Neón', val: 'neon' },
                  ].map((t) => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => handleUpdate({ overlayTint: t.val as any })}
                      className={`p-2 rounded-lg text-center text-[10px] font-bold border transition-colors ${
                        (heroConfig.overlayTint || 'vignette') === t.val
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Typographic Watermark Text */}
            <div className="pt-3 border-t border-zinc-800/80">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Texto de Marca de Agua Tipográfica en el Fondo (Opcional):
              </label>
              <input
                type="text"
                value={heroConfig.watermarkText || ''}
                onChange={(e) => handleUpdate({ watermarkText: e.target.value })}
                placeholder="DIFUSION VENEZUELA"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 uppercase tracking-widest font-mono"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Se proyecta como una marca tipográfica gigante casi transparente detrás del título.
              </span>
            </div>
          </div>

          {/* SECTION 4: LIVE PREVIEW MOCKUP */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[var(--color-primary)]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Vista Previa en Vivo de la Cabecera
                </h4>
              </div>
              <span className="text-[10px] text-[var(--color-primary)] font-semibold">
                Simulación en tiempo real
              </span>
            </div>

            {/* Mockup Box */}
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-black min-h-[200px] flex flex-col justify-center items-center text-center p-6 select-none">
              {/* Background preview */}
              {heroConfig.type === 'video' && heroConfig.videoUrl && (
                <video
                  key={heroConfig.videoUrl}
                  src={heroConfig.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: heroConfig.opacity,
                    filter: heroConfig.blur ? `blur(${heroConfig.blur}px)` : undefined,
                  }}
                />
              )}

              {heroConfig.type === 'slideshow' && heroConfig.slideshowImages?.[0] && (
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${heroConfig.slideshowImages[0]})`,
                    opacity: heroConfig.opacity,
                    filter: heroConfig.blur ? `blur(${heroConfig.blur}px)` : undefined,
                  }}
                />
              )}

              {heroConfig.type === 'image' && heroConfig.imageUrl && (
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${heroConfig.imageUrl})`,
                    opacity: heroConfig.opacity,
                    filter: heroConfig.blur ? `blur(${heroConfig.blur}px)` : undefined,
                  }}
                />
              )}

              {/* Watermark text */}
              {heroConfig.watermarkText && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-4xl sm:text-6xl font-black text-white/[0.04] uppercase">
                  {heroConfig.watermarkText}
                </div>
              )}

              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black pointer-events-none" />

              {/* Content overlay */}
              <div className="relative z-10 max-w-md">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  Agencia & Contratación Directa · Venezuela
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  Modelos y Promotoras de Élite en Venezuela
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                  Perfiles verificados en Caracas, Maracaibo, Valencia y todo el país.
                </p>
                <div className="mt-3 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[10px] text-zinc-500 inline-block">
                  🔍 Buscar modelo por nombre, ciudad, idiomas...
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
