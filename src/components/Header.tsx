import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ShieldCheck, UserCheck, Settings, LogIn, LogOut, Flame, Building } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onOpenSettings }) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    setShowAuthModal,
    logout,
    notifications,
    isSuperAdmin,
    themeConfig,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element / brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('catalogo')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <img
              src="/assets/aistudio/27211961-66ce-4ae9-a14c-6fb0dca4deaa-removebg-preview_d4a77f15.png"
              alt="DIFUSION Logo"
              className="h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(57,255,20,0.4)]"
            />
            <div className="hidden sm:block">
              <span className="font-extrabold tracking-wider text-lg sm:text-xl text-white transition-colors">
                DIFUSI<span className="text-[var(--color-primary)]">ON</span>
              </span>
              <span className="hidden md:inline-block ml-2 text-[10px] tracking-widest text-zinc-400 uppercase font-medium">
                Venezuela · Modelos & Promotoras
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button
            onClick={() => setActiveTab('catalogo')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'catalogo'
                ? 'text-[var(--color-primary)] font-semibold border-b-2 border-[var(--color-primary)]'
                : 'hover:text-white'
            }`}
          >
            Catálogo
          </button>
          <button
            onClick={() => setActiveTab('parati')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'parati'
                ? 'text-[var(--color-primary)] font-semibold border-b-2 border-[var(--color-primary)]'
                : 'hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            Para Ti (Muro)
          </button>
          <button
            onClick={() => setActiveTab('eventos')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'eventos'
                ? 'text-[var(--color-primary)] font-semibold border-b-2 border-[var(--color-primary)]'
                : 'hover:text-white'
            }`}
          >
            Eventos Venezuela
          </button>
          <button
            onClick={() => setActiveTab('streaming')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'streaming'
                ? 'text-[var(--color-primary)] font-semibold border-b-2 border-[var(--color-primary)]'
                : 'hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            En Vivo Backstage
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'text-[var(--color-primary)] font-semibold border-b-2 border-[var(--color-primary)]'
                  : 'hover:text-white text-zinc-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
              Panel Super Admin
            </button>
          )}
          {!isSuperAdmin && currentUser?.role === 'model' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'text-[var(--color-primary)] font-semibold border-b-2 border-[var(--color-primary)]'
                  : 'hover:text-white text-[var(--color-primary)] font-semibold'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[var(--color-primary)]" />
              Mi MediaKit & Perfil
            </button>
          )}
          {!isSuperAdmin && currentUser?.role === 'empresa' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'text-blue-400 font-semibold border-b-2 border-blue-400'
                  : 'hover:text-white text-blue-400 font-semibold'
              }`}
            >
              <Building className="w-4 h-4 text-blue-400" />
              MediaKit Empresa
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notificaciones"
            className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-black ring-2 ring-black">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Theme & Brand Settings trigger */}
          <button
            onClick={onOpenSettings}
            aria-label="Ajustes de Diseño"
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Dashboard / Login CTA */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-medium ${
                  activeTab === 'dashboard'
                    ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-white'
                    : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                }`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-[var(--color-primary)]"
                />
                <span className="hidden sm:inline font-medium max-w-[120px] truncate">
                  {currentUser.name}
                </span>
                {isSuperAdmin ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-primary)] text-black">
                    SUPER ADMIN
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-[var(--color-primary)]">
                    MI PANEL
                  </span>
                )}
              </button>
              <button
                onClick={logout}
                title="Cerrar Sesión"
                className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-black bg-[var(--color-primary)] hover:opacity-90 rounded-xl transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] whitespace-nowrap shrink-0 active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Ingresar / Registro</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
