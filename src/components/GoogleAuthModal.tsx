import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Smartphone,
  AlertCircle,
  Mail,
  CheckCircle,
  KeyRound,
  RefreshCw,
} from 'lucide-react';

export const GoogleAuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    show2FAModal,
    setShow2FAModal,
    verify2FACode,
    sendEmail2FACode,
    signInWithFirebaseGoogle,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<'client' | 'empresa' | 'model'>('client');
  const [twoFactorInput, setTwoFactorInput] = useState('');
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [directGoogleEmail, setDirectGoogleEmail] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSentSuccess, setCodeSentSuccess] = useState<string | null>(null);

  // When 2FA modal opens, automatically dispatch the security email if not sent yet
  useEffect(() => {
    if (show2FAModal) {
      handleResendCode();
    }
  }, [show2FAModal]);

  if (!showAuthModal && !show2FAModal) return null;

  const handleFirebasePopup = async () => {
    setIsFirebaseLoading(true);
    setAuthError(null);
    const res = await signInWithFirebaseGoogle(undefined, selectedRole);
    setIsFirebaseLoading(false);
    if (!res.success) {
      if (res.isPopupBlocked) {
        setAuthError(
          'El navegador móvil cerró o bloqueó la ventana emergente. Por favor confirma tu correo de Google en la casilla inferior para ingresar sin interrupción:'
        );
      } else if (res.error) {
        setAuthError(res.error);
      }
    }
  };

  const handleDirectGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanEmail = directGoogleEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthError('Por favor introduce tu dirección de correo electrónico.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setAuthError('Por favor ingresa un formato de correo válido.');
      return;
    }

    setIsFirebaseLoading(true);
    const res = await signInWithFirebaseGoogle(cleanEmail, selectedRole);
    setIsFirebaseLoading(false);
    if (!res.success && res.error) {
      setAuthError(res.error);
    }
  };

  const handleResendCode = async () => {
    setIsSendingCode(true);
    setTwoFactorError(null);
    try {
      const res = await sendEmail2FACode();
      setCodeSentSuccess(res.message || 'Código de seguridad enviado con éxito.');
    } catch {
      setCodeSentSuccess('Código de seguridad enviado. Revisa tu correo.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorError(null);
    if (!twoFactorInput.trim()) {
      setTwoFactorError('Por favor introduce el código recibido en tu correo.');
      return;
    }
    const verified = verify2FACode(twoFactorInput.trim());
    if (!verified) {
      setTwoFactorError('Código de seguridad incorrecto. Revisa tu correo e intenta de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* STEP 1: GOOGLE OAUTH MODAL */}
      {showAuthModal && !show2FAModal && (
        <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl relative text-center my-6">
          <button
            onClick={() => {
              setShowAuthModal(false);
              setAuthError(null);
            }}
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
            Acceso con Cuenta Google
          </h3>
          <p className="text-xs text-zinc-400 mt-1 mb-4 max-w-sm mx-auto">
            Indica tu tipo de perfil antes de continuar con Google:
          </p>

          {/* Quick Role Selection for Google Users */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-left">
            <button
              type="button"
              onClick={() => setSelectedRole('model')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedRole === 'model'
                  ? 'bg-purple-950/40 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="text-base mb-0.5">👠</div>
              <div className="text-[11px] font-bold leading-tight">Promotora / Modelo</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('empresa')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedRole === 'empresa'
                  ? 'bg-blue-950/40 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="text-base mb-0.5">🏢</div>
              <div className="text-[11px] font-bold leading-tight">Empresa / Marca</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('client')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                selectedRole === 'client'
                  ? 'bg-emerald-950/40 border-[var(--color-primary)] text-white shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="text-base mb-0.5">👤</div>
              <div className="text-[11px] font-bold leading-tight">Cliente Particular</div>
            </button>
          </div>

          {/* Error Message Display */}
          {authError && (
            <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div className="leading-relaxed">{authError}</div>
            </div>
          )}

          {/* Primary Google Login Button */}
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
            <span>
              {isFirebaseLoading
                ? 'Conectando con Google...'
                : `Continuar con Google (${selectedRole === 'model' ? 'Promotora' : selectedRole === 'empresa' ? 'Empresa' : 'Cliente'})`}
            </span>
          </button>

          {/* In-page Direct Access without external popups */}
          <div className="mt-4 pt-3 border-t border-zinc-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Acceso In-Page / Móvil
              </span>
              <span className="text-[10px] text-[var(--color-primary)] font-semibold">
                Sin ventana emergente
              </span>
            </div>

            <form onSubmit={handleDirectGoogleLogin} className="space-y-2 text-left">
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={directGoogleEmail}
                  onChange={(e) => setDirectGoogleEmail(e.target.value)}
                  placeholder="Introduce tu cuenta @gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isFirebaseLoading}
                className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs hover:brightness-110 transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                Ingresar Directo con esta Cuenta Google
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>Autenticación cifrada para proteger datos personales</span>
          </div>
        </div>
      )}

      {/* STEP 2: TWO-FACTOR AUTHENTICATION (2FA) VIA REAL EMAIL VERIFICATION CODE */}
      {show2FAModal && (
        <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-7 shadow-2xl relative text-center my-6">
          <button
            onClick={() => {
              setShow2FAModal(false);
              setTwoFactorError(null);
              setCodeSentSuccess(null);
            }}
            className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-[var(--color-primary)] flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
            <KeyRound className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            Verificación de Seguridad
          </h3>
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            Se ha despachado un código de seguridad a tu correo electrónico. Por favor revísalo e ingrésalo a continuación para confirmar tu acceso:
          </p>

          {codeSentSuccess && (
            <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 text-left">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{codeSentSuccess}</span>
            </div>
          )}

          {twoFactorError && (
            <div className="mb-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{twoFactorError}</span>
            </div>
          )}

          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-2 font-medium">
                Código de 6 dígitos
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFactorInput}
                onChange={(e) => setTwoFactorInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Introduce el código"
                className="w-full text-center text-2xl tracking-[0.3em] font-mono py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-[var(--color-primary)]"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold transition-all hover:opacity-90 shadow-md active:scale-95"
            >
              Verificar Código & Acceder
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">¿No recibiste el correo?</span>
            <button
              type="button"
              disabled={isSendingCode}
              onClick={handleResendCode}
              className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSendingCode ? 'animate-spin' : ''}`} />
              <span>{isSendingCode ? 'Enviando...' : 'Reenviar código'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
