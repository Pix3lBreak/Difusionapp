import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    currentUser,
    setActiveTab,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    signInWithFirebaseGoogle,
    loginWithGoogle,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'client' | 'model'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, show redirection option
  if (currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sesión Activa</h2>
        <p className="text-zinc-400 text-xs mb-6 font-mono">
          Has iniciado sesión como <span className="text-white font-semibold">{currentUser.email}</span> ({currentUser.role}).
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all hover:opacity-90"
          >
            Ir a Mi Panel de Usuario
          </button>
          <button
            onClick={() => setActiveTab('catalogo')}
            className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-xs hover:bg-zinc-800 transition-colors"
          >
            Explorar Catálogo de Modelos
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    if (mode === 'signup') {
      if (!name) {
        setErrorMessage('Por favor ingresa tu nombre completo.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      setIsLoading(true);
      const res = await signUpWithEmailPassword(email, password, name, role);
      setIsLoading(false);
      if (res.success) {
        setActiveTab('dashboard');
      } else {
        setErrorMessage(res.error || 'Error al registrar usuario.');
      }
    } else {
      setIsLoading(true);
      const res = await signInWithEmailPassword(email, password);
      setIsLoading(false);
      if (res.success) {
        setActiveTab('dashboard');
      } else {
        setErrorMessage(res.error || 'Error al iniciar sesión.');
      }
    }
  };

  const handleGooglePopup = async () => {
    setIsLoading(true);
    const ok = await signInWithFirebaseGoogle();
    setIsLoading(false);
    if (ok) {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <img
              src="/assets/aistudio/27211961-66ce-4ae9-a14c-6fb0dca4deaa-removebg-preview_d4a77f15.png"
              alt="DIFUSION"
              className="h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(57,255,20,0.4)]"
            />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            DIFUSI<span className="text-[var(--color-primary)]">ON</span> ACCESO
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Plataforma oficial de modelos y promotoras de Venezuela
          </p>
        </div>

        {/* Tab Switcher: Iniciar Sesión vs Registrarse */}
        <div className="flex p-1 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-[var(--color-primary)] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-[var(--color-primary)] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Primary Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Valeria Rivas"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
                  Tipo de Cuenta
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      role === 'client'
                        ? 'bg-zinc-850 border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Cliente / Empresa
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('model')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      role === 'model'
                        ? 'bg-zinc-850 border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Modelo / Promotora
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu_correo@ejemplo.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-primary)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all hover:opacity-90 active:scale-98 disabled:opacity-50"
          >
            {isLoading
              ? 'Procesando...'
              : mode === 'signin'
              ? 'Iniciar Sesión con Correo'
              : 'Crear Cuenta en DIFUSION'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center text-xs text-zinc-600">
          <span className="w-full border-t border-zinc-800"></span>
          <span className="px-3 bg-zinc-950 shrink-0 font-medium">o con proveedor externo</span>
          <span className="w-full border-t border-zinc-800"></span>
        </div>

        {/* Firebase Google Auth Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGooglePopup}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 p-3 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs shadow-md transition-all active:scale-98"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continuar con Google (OAuth 2.0)</span>
          </button>
        </div>

        {/* Notice walking user through enabling Email/Password in Firebase Console */}
        <div className="mt-6 pt-4 border-t border-zinc-900 text-[11px] text-zinc-500 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>Configuración en Consola de Firebase:</span>
          </div>
          <p className="leading-relaxed">
            Para habilitar el proveedor nativo de correo en tu proyecto de Firebase, ingresa a:
            <span className="text-zinc-300 font-mono block mt-0.5 text-[10px]">
              Firebase Console &gt; Authentication &gt; Sign-in method &gt; Email/Password &gt; Habilitar
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
