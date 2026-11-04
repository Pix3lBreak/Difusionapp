import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Palette, Type, Moon, Sun, Shield, Smartphone } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { themeConfig, updateThemeConfig } = useApp();

  if (!isOpen) return null;

  const COLOR_OPTIONS = [
    { name: 'Verde Fosforescente', hex: '#39ff14' },
    { name: 'Cyan Eléctrico', hex: '#00e5ff' },
    { name: 'Rosa Cyberpunk', hex: '#ff007f' },
    { name: 'Oro Solar VIP', hex: '#ffd700' },
    { name: 'Lima Brillante', hex: '#84cc16' },
  ];

  const FONT_OPTIONS = ['Outfit', 'Plus Jakarta Sans', 'Montserrat', 'Urbanist'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-base font-bold text-white">
            Personalización de Marca & Interfaz
          </h3>
        </div>

        <div className="space-y-5">
          {/* Accent Color */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Color Neón Principal
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => updateThemeConfig({ primaryColor: c.hex })}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                    themeConfig.primaryColor === c.hex
                      ? 'border-white bg-zinc-900 text-white shadow-md'
                      : 'border-zinc-800 bg-black text-zinc-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full ring-2 ring-zinc-800 shrink-0"
                    style={{ background: c.hex }}
                  />
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-900">
              <span className="text-xs text-zinc-400">Selector HEX libre:</span>
              <input
                type="color"
                value={themeConfig.primaryColor}
                onChange={(e) => updateThemeConfig({ primaryColor: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="font-mono text-xs text-zinc-300 font-bold">{themeConfig.primaryColor}</span>
            </div>
          </div>

          {/* Typography */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Tipografía Principal
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => updateThemeConfig({ fontFamily: font })}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    themeConfig.fontFamily === font
                      ? 'border-[var(--color-primary)] bg-zinc-900 text-white shadow-sm'
                      : 'border-zinc-800 bg-black text-zinc-400'
                  }`}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          {/* Dark / Light Mode */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              {themeConfig.isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span>Modo Oscuro (Por defecto)</span>
            </div>
            <input
              type="checkbox"
              checked={themeConfig.isDarkMode}
              onChange={(e) => updateThemeConfig({ isDarkMode: e.target.checked })}
              className="w-4 h-4 accent-lime-400 rounded cursor-pointer"
            />
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold transition-all hover:opacity-90 active:scale-95 shadow-md"
          >
            Aplicar y Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
