import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Lock,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export const GoogleAuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    show2FAModal,
    setShow2FAModal,
    verify2FACode,
    signInWithFirebaseGoogle,
  } = useApp();

  const [twoFactorInput, setTwoFactorInput] = useState('');
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);

  if (!showAuthModal && !show2FAModal) return null;

  const handleFirebasePopup = async () => {
    setIsFirebaseLoading(true);
    await signInWithFirebaseGoogle();
    setIsFirebaseLoading(false);
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    verify2FACode(twoFactorInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      {/* STEP 1: GOOGLE OAUTH MODAL */}
      {showAuthModal && !show2FAModal && (
        <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl relative text-center">
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
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
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            Iniciar Sesión con Google
          </h3>
          <p className="text-xs text-zinc-400 mt-2 mb-6 max-w-sm mx-auto">
            Acceso seguro oficial con Google OAuth 2.0 y certificados SSL para la plataforma DIFUSION.
          </p>

          <button
            onClick={handleFirebasePopup}
            disabled={isFirebaseLoading}
            className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs shadow-lg transition-all active:scale-98 disabled:opacity-60"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            <span>{isFirebaseLoading ? 'Conectando con Google...' : 'Continuar con Google Oficial'}</span>
          </button>

          <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>Autenticación cifrada para proteger datos personales</span>
          </div>
        </div>
      )}

      {/* STEP 2: TWO-FACTOR AUTHENTICATION (2FA) CODE VERIFICATION */}
      {show2FAModal && (
        <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative text-center">
          <button
            onClick={() => setShow2FAModal(false)}
            className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-[var(--color-primary)] flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
            <Smartphone className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            Verificación en Dos Pasos (2FA)
          </h3>
          <p className="text-xs text-zinc-400 mb-6">
            Introduce el código temporal generado por tu aplicación Authenticator o SMS de seguridad.
          </p>

          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-2 font-medium">
                Código de verificación (4 o 6 dígitos)
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFactorInput}
                onChange={(e) => setTwoFactorInput(e.target.value)}
                placeholder="1988"
                className="w-full text-center text-2xl tracking-[0.4em] font-mono py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-[var(--color-primary)]"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold transition-all hover:opacity-90 shadow-md active:scale-95"
            >
              Verificar & Ingresar
            </button>
          </form>

          <div className="mt-4 text-[11px] text-zinc-500">
            Seguridad y protección de cuentas en DIFUSION.
          </div>
        </div>
      )}
    </div>
  );
};
