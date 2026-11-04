import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Smartphone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { themeConfig, setActiveTab, setShowAuthModal } = useApp();

  return (
    <footer className="border-t border-zinc-900 bg-black text-zinc-400 text-xs py-12 pb-24 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand Wordmark & Agency Identity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/assets/aistudio/27211961-66ce-4ae9-a14c-6fb0dca4deaa-removebg-preview_d4a77f15.png"
                alt="DIFUSION"
                className="h-9 w-auto object-contain"
              />
              <span className="font-extrabold text-white text-base tracking-wider">
                DIFUSI<span className="text-[var(--color-primary)]">ON</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
              Agencia de modelos, promotoras de eventos y marketing en Venezuela. Cobertura en Caracas, Maracaibo, Valencia, Lechería, Barquisimeto y Margarita.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-3">
              Plataforma Venezuela
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => setActiveTab('catalogo')}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  Catálogo de Modelos Venezuela
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('eventos')}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  Castings & Eventos Nacionales
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('streaming')}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  Backstage en Vivo
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  Acceso Google / Super Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ubicaciones Operativas */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-3">
              Ciudades de Cobertura
            </h4>
            <div className="space-y-1.5 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Caracas · Las Mercedes / Chacao</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Maracaibo · 5 de Julio / Bella Vista</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Valencia · El Viñedo / WTC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Lechería · Marina Américo Vespucio</span>
              </div>
            </div>
          </div>

          {/* Col 4: Seguridad & Contacto */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-3">
              Contacto Inmediato
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-zinc-300">
                <Smartphone className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>{themeConfig.agencyPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Mail className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>{themeConfig.agencyEmail}</span>
              </div>
              <div className="pt-2 flex items-center gap-1.5 text-[10px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Garantía de Contratación Segura y Transparencia Verificada</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600">
          <div>
            © {new Date().getFullYear()} DIFUSION Modelos & Promotoras. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> Cifrado 2FA
            </span>
            <span>·</span>
            <span>Super Admin: pixelglez1988@gmail.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
