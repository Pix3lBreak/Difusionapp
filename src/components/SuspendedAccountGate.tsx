import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, LogOut, MessageCircle, Clock, AlertTriangle } from 'lucide-react';
import { SUPER_ADMIN_EMAIL } from '../data/initialData';

export const SuspendedAccountGate: React.FC = () => {
  const { currentUser, logout, themeConfig } = useApp();

  if (!currentUser || currentUser.status !== 'suspended') {
    return null;
  }

  const handleContactWhatsApp = () => {
    const phone = themeConfig.agencyPhone.replace(/\D/g, '') || '584121234567';
    const text = encodeURIComponent(
      `Hola DIFUSION Venezuela, me comunico respecto a mi cuenta (${currentUser.email} - ${currentUser.name}) que se encuentra en estado suspendido / standby por revisión. Deseo solicitar la reactivación formal.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-red-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center relative animate-fade-in my-auto">
        
        {/* Warning Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400 mb-5 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 inline-flex items-center gap-1.5 mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Acceso Restringido · Standby por Suspensión</span>
        </span>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          Cuenta Suspendida en Revisión
        </h2>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md mx-auto mb-6">
          Por normativas de seguridad y protección de DIFUSION Venezuela, esta cuenta ha sido suspendida y colocada en <strong className="text-red-400">standby de aceptación</strong>. No tienes acceso al catálogo de modelos, eventos, convocatorias, chat ni funciones de contratación hasta que el <strong className="text-white">Super Admin</strong> revise y apruebe formalmente tu reactivación.
        </p>

        {/* User Snapshot Card */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-left mb-6 space-y-2.5">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-red-500/40"
            />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white text-sm truncate">{currentUser.name}</div>
              <div className="text-xs text-zinc-400 font-mono truncate">{currentUser.email}</div>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wide bg-red-950 text-red-300 border border-red-800 shrink-0">
              Suspendida
            </span>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Estado del Acceso:</span>
            </span>
            <span className="text-amber-400 font-semibold">En proceso de aceptación</span>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Rol Registrado:</span>
            <span className="text-zinc-200 font-semibold uppercase text-[11px]">
              {currentUser.role === 'model' ? 'Promotora / Modelo' : currentUser.role === 'empresa' ? 'Empresa Corporativa' : 'Cliente Particular'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Super Admin a Cargo:</span>
            <span className="font-mono text-zinc-400 text-[11px]">{SUPER_ADMIN_EMAIL}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={logout}
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-zinc-400" />
            <span>Cerrar Sesión</span>
          </button>

          <button
            onClick={handleContactWhatsApp}
            className="flex-1 py-3 px-4 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-black text-xs font-bold transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contactar Super Admin</span>
          </button>
        </div>

      </div>
    </div>
  );
};
