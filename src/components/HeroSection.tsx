import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Sparkles, ShieldCheck, Star, Users } from 'lucide-react';

import { VENEZUELAN_CITIES } from '../data/initialData';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
}) => {
  const { models, availableCities } = useApp();
  const allCities = ['Todas', ...(availableCities || [])];

  return (
    <section className="relative overflow-hidden border-b border-zinc-800/60 bg-gradient-to-b from-black via-zinc-950 to-black pt-8 pb-12 sm:pt-12 sm:pb-16">
      {/* Subtle background ambient mesh glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] blur-[120px] rounded-full opacity-20"
        style={{ background: 'var(--color-primary)' }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Title & Kicker */}
        <div className="max-w-3xl text-center mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-ping" />
            Agencia & Contratación Directa · Venezuela 🇻🇪
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-balance leading-tight">
            Modelos y Promotoras de Élite en Venezuela
          </h1>
          
          <p className="mt-4 text-base sm:text-lg text-zinc-400 text-balance font-normal leading-relaxed">
            Perfiles verificados en Caracas, Maracaibo, Valencia, Lechería y todo el país. MediaKit interactivo con Instagram & TikTok real y cotización instantánea.
          </p>
        </div>

        {/* Search & Location Filter Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl backdrop-blur-md">
            
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar modelo por nombre, ciudad, idiomas..."
                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 px-2 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0">
              <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-zinc-300 font-medium py-2 pr-4 focus:outline-none cursor-pointer"
              >
                {allCities.map((c) => (
                  <option key={c} value={c} className="bg-zinc-900 text-white">
                    {c === 'Todas' ? 'Toda Venezuela' : c}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Quick Venezuelan city buttons */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-3 text-xs text-zinc-400">
            <span className="text-zinc-500 mr-1">Ciudades:</span>
            {availableCities.slice(0, 8).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city === selectedCity ? 'Todas' : city)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCity === city
                    ? 'bg-[var(--color-primary)] text-black font-semibold'
                    : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Claim-to-Proof Adjacency strip (§1.H) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 border-t border-zinc-800/60">
          <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/40">
            <span className="text-2xl font-bold text-white tabular-nums">
              {models.length * 40}+
            </span>
            <span className="text-xs text-zinc-400 mt-0.5">Modelos Disponibles</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/40">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-white tabular-nums">4.95</span>
              <Star className="w-4 h-4 fill-[var(--color-primary)] text-[var(--color-primary)]" />
            </div>
            <span className="text-xs text-zinc-400 mt-0.5">Calificación Verificada</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/40">
            <span className="text-2xl font-bold text-white tabular-nums">100%</span>
            <span className="text-xs text-zinc-400 mt-0.5">MediaKit en Tiempo Real</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/40">
            <span className="text-2xl font-bold text-white tabular-nums">&lt; 15 min</span>
            <span className="text-xs text-zinc-400 mt-0.5">Tiempo de Respuesta</span>
          </div>
        </div>

      </div>
    </section>
  );
};
