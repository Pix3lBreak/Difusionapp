import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Calendar,
  Video,
  ShieldCheck,
  User,
} from 'lucide-react';

export const MobileTabBar: React.FC = () => {
  const { activeTab, setActiveTab, isSuperAdmin, setShowAuthModal, currentUser } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 pb-safe">
      <div className="grid grid-cols-4 items-center h-16">
        
        {/* Catálogo Tab */}
        <button
          onClick={() => setActiveTab('catalogo')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'catalogo'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Catálogo</span>
        </button>

        {/* Eventos Tab */}
        <button
          onClick={() => setActiveTab('eventos')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'eventos'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Eventos</span>
        </button>

        {/* Streaming Tab */}
        <button
          onClick={() => setActiveTab('streaming')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'streaming'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Video className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <span className="text-[10px] tracking-tight mt-1">En Vivo</span>
        </button>

        {/* Super Admin or Model Profile or Login Tab */}
        {isSuperAdmin ? (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
              activeTab === 'admin'
                ? 'text-[var(--color-primary)] font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-[10px] tracking-tight mt-1">Admin</span>
          </button>
        ) : currentUser?.role === 'model' ? (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
              activeTab === 'admin'
                ? 'text-[var(--color-primary)] font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-[10px] tracking-tight mt-1">Mi Perfil</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab(currentUser ? 'dashboard' : 'login')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
              activeTab === 'login' || activeTab === 'dashboard'
                ? 'text-[var(--color-primary)] font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">
              {currentUser ? 'Mi Panel' : 'Ingresar'}
            </span>
          </button>
        )}

      </div>
    </div>
  );
};
