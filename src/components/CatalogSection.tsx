import React, { useState } from 'react';
import { ModelProfile, CategoryType } from '../types';
import { useApp } from '../context/AppContext';
import {
  Star,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Eye,
  Instagram,
  Video,
  ArrowUpDown,
  Sparkles,
  Phone,
  Crown,
} from 'lucide-react';

interface CatalogSectionProps {
  searchQuery: string;
  selectedCity: string;
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'Todas las Categorías' },
  { id: 'promotora', label: 'Promotoras VIP' },
  { id: 'pasarela', label: 'Pasarela & Fashion' },
  { id: 'fotografia', label: 'Fotografía & Publicidad' },
  { id: 'hostess', label: 'Hostess Protocolar' },
  { id: 'streaming', label: 'Streaming & Live' },
];

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  searchQuery,
  selectedCity,
}) => {
  const {
    models,
    setSelectedModel,
    setActiveChatModel,
    generateWhatsAppUrl,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'rate_asc' | 'rate_desc'>('rating');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyVip, setOnlyVip] = useState<boolean>(false);

  // Filter models
  const filteredModels = models.filter((model) => {
    // Exclude paused models from public catalog
    if (model.isPaused || model.status === 'pausada') {
      return false;
    }
    // Only VIP membership filter
    if (onlyVip && !model.isVip) {
      return false;
    }
    // Only verified filter
    if (onlyVerified && model.identityVerification?.status !== 'verificado' && !model.verified) {
      return false;
    }
    // City filter
    if (selectedCity !== 'Todas' && model.location.city !== selectedCity) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'all' && model.category !== selectedCategory) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = model.name.toLowerCase().includes(q);
      const matchCity = model.location.city.toLowerCase().includes(q);
      const matchBio = model.bio.toLowerCase().includes(q);
      const matchLanguages = model.languages.some((l) => l.toLowerCase().includes(q));
      const matchRole = model.roleLabel.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchBio && !matchLanguages && !matchRole) {
        return false;
      }
    }
    return true;
  });

  // Sort models: VIP membership profiles that paid are ALWAYS placed FIRST at the top!
  const sortedModels = [...filteredModels].sort((a, b) => {
    // 1. VIP membership profiles come first
    const aVip = a.isVip ? 1 : 0;
    const bVip = b.isVip ? 1 : 0;
    if (aVip !== bVip) {
      return bVip - aVip;
    }
    // 2. Secondary sort according to user selection
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'rate_asc') {
      return a.hourlyRate - b.hourlyRate;
    }
    if (sortBy === 'rate_desc') {
      return b.hourlyRate - a.hourlyRate;
    }
    return 0;
  });

  const vipCount = models.filter((m) => m.isVip && !m.isPaused).length;

  return (
    <section className="py-6 sm:py-10 bg-black">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Catálogo de Promotoras & Modelos</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 flex-wrap">
              <span className="font-semibold text-white">{sortedModels.length}</span>
              <span>perfiles disponibles en Venezuela</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" /> {vipCount} con Membresía VIP
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[var(--color-primary)]">Vista Compacta</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter by VIP Membership */}
            <button
              onClick={() => setOnlyVip(!onlyVip)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                onlyVip
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
                  : 'bg-zinc-900 text-amber-300/90 border-amber-500/40 hover:border-amber-400 hover:text-amber-300'
              }`}
              title="Filtrar por perfiles con membresía VIP pagada"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Membresía VIP ({vipCount})</span>
            </button>

            {/* Filter by Official ID Verification */}
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                onlyVerified
                  ? 'bg-[var(--color-primary)] text-black border-[var(--color-primary)] shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verificadas ✓</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-[11px] text-zinc-300">
              <ArrowUpDown className="w-3 h-3 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium text-white focus:outline-none cursor-pointer text-[11px]"
              >
                <option value="rating" className="bg-zinc-900">Mayor Calificación</option>
                <option value="rate_asc" className="bg-zinc-900">Menor Tarifa ($/h)</option>
                <option value="rate_desc" className="bg-zinc-900">Mayor Tarifa ($/h)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Compact horizontal scroll) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-medium whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[var(--color-primary)] text-black font-bold shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {sortedModels.length === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl bg-zinc-950 border border-zinc-900">
            <Sparkles className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No se encontraron perfiles</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
              Prueba cambiando la ciudad o limpiando los filtros seleccionados.
            </p>
          </div>
        )}

        {/* Model Cards Grid: Ultra-Compact Multi-Column (VIPs placed first) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
          {sortedModels.map((model) => {
            const isVip = !!model.isVip;

            return (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`group relative flex flex-col rounded-2xl bg-zinc-950 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 shadow-md cursor-pointer ${
                  isVip
                    ? 'border border-amber-400/60 hover:border-amber-300 ring-1 ring-amber-400/40 shadow-[0_0_18px_rgba(251,191,36,0.18)]'
                    : 'border border-zinc-850 hover:border-[var(--color-primary)]/70 hover:shadow-[0_0_15px_rgba(57,255,20,0.15)]'
                }`}
              >
                {/* Compact Image Container with 3:3.9 Aspect Ratio */}
                <div className="relative aspect-[3/3.9] w-full overflow-hidden bg-zinc-900">
                  <img
                    src={model.avatar}
                    alt={model.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                  />

                  {/* Scrim overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                  {/* Top badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none gap-1">
                    {/* VIP Membership Badge or Verified Badge */}
                    {isVip ? (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-[9px] shadow-lg">
                        <Crown className="w-2.5 h-2.5 text-black fill-black" />
                        <span>VIP</span>
                      </div>
                    ) : model.verified || model.identityVerification?.status === 'verificado' ? (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/85 backdrop-blur-md border border-[var(--color-primary)] text-[9px] font-bold text-[var(--color-primary)]">
                        <ShieldCheck className="w-2.5 h-2.5 text-[var(--color-primary)]" />
                        <span>Verificada</span>
                      </div>
                    ) : (
                      <div className="flex items-center px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[9px] font-medium text-zinc-400">
                        <span>DIFUSION</span>
                      </div>
                    )}

                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-white tabular-nums">
                      <Star className="w-2.5 h-2.5 fill-[var(--color-primary)] text-[var(--color-primary)]" />
                      <span>{model.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Bottom Overlay on Image: City + Stage Name */}
                  <div className="absolute bottom-2 left-2 right-2 text-white pointer-events-none">
                    <div className="flex items-center gap-1 text-[10px] text-zinc-300 font-medium">
                      <MapPin className="w-2.5 h-2.5 text-[var(--color-primary)] shrink-0" />
                      <span className="truncate">{model.location.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                        {model.name}
                      </h3>
                      {isVip && (
                        <Crown className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Compact Card Body */}
                <div className="p-2 sm:p-2.5 flex flex-col flex-1 justify-between gap-2">
                  {/* Physical info & Age */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="font-semibold text-zinc-300">
                      {model.age ? `${model.age} años` : '23 años'}
                    </span>
                    <span className="text-zinc-500">·</span>
                    <span>{model.physical.height}</span>
                    <span className="text-zinc-500">·</span>
                    <span className="truncate max-w-[45px] text-right text-zinc-400">
                      {model.location.city}
                    </span>
                  </div>

                  {/* Social Followers & Likes */}
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[10px]">
                    <span className="flex items-center gap-1 text-pink-400 font-semibold truncate">
                      <Instagram className="w-2.5 h-2.5 shrink-0" />
                      <span className="text-zinc-200">{model.socialMedia.instagram.followers}</span>
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400 font-semibold truncate">
                      <Video className="w-2.5 h-2.5 shrink-0" />
                      <span className="text-zinc-200">{model.socialMedia.tiktok.likes}</span>
                    </span>
                  </div>

                  {/* Compact Price Row */}
                  <div className="flex items-center justify-between border-t border-zinc-900 pt-1.5">
                    <div className="leading-tight">
                      <div className="text-xs font-black text-white tabular-nums">
                        ${model.hourlyRate}
                        <span className="text-[9px] font-normal text-zinc-400">/h</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono text-right">
                      ${model.dailyRate} <span className="text-[9px] text-zinc-500">día</span>
                    </div>
                  </div>

                  {/* Compact Action Buttons */}
                  <div
                    className="grid grid-cols-2 gap-1.5 pt-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedModel(model)}
                      className={`w-full flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-bold transition-colors ${
                        isVip
                          ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border-amber-500/40'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-800'
                      }`}
                      title="Ver MediaKit completo"
                    >
                      <Eye className="w-3 h-3 text-[var(--color-primary)]" />
                      <span>MediaKit</span>
                    </button>

                    <a
                      href={generateWhatsAppUrl(model.whatsappNumber, model.name, model.location.city)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-[10px] font-bold text-white transition-colors"
                      title="WhatsApp"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
