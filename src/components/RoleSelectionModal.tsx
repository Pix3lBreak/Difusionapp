import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Building,
  User,
  ShieldCheck,
  Check,
  X,
  Clock,
  Briefcase,
  Camera,
  Crown,
} from 'lucide-react';

export const RoleSelectionModal: React.FC = () => {
  const {
    currentUser,
    showRoleSelectionModal,
    setShowRoleSelectionModal,
    selectUserRequestedRole,
    showToast,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<'model' | 'empresa' | 'client'>(
    (currentUser?.requestedRole as 'model' | 'empresa' | 'client') || 'client'
  );
  const [companyName, setCompanyName] = useState(currentUser?.companyName || '');
  const [companyRif, setCompanyRif] = useState(currentUser?.companyRif || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  // Modal is strictly for users registering for the first time who haven't chosen a role yet.
  // Once a role is requested, only the Super Admin can change it.
  const isSuperAdmin = currentUser?.role === 'superadmin' || currentUser?.email?.toLowerCase() === 'pixelglez1988@gmail.com';
  const hasAlreadyChosenRole = !!currentUser?.requestedRole;
  const shouldOpen =
    !isSuperAdmin &&
    currentUser &&
    currentUser.status === 'standby' &&
    !hasAlreadyChosenRole &&
    (showRoleSelectionModal || !currentUser.requestedRole);

  if (!shouldOpen || currentUser?.status === 'suspended') return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    selectUserRequestedRole(selectedRole, {
      companyName: selectedRole === 'empresa' ? companyName : undefined,
      companyRif: selectedRole === 'empresa' ? companyRif : undefined,
      phone: phone || undefined,
    });
    setShowRoleSelectionModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Close button if user already has an established role */}
        {currentUser?.requestedRole && (
          <button
            onClick={() => setShowRoleSelectionModal(false)}
            className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Paso Obligatorio de Registro</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Selecciona tu Rol en DIFUSION Venezuela
          </h3>
          <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
            Indica qué tipo de cuenta deseas abrir. Tu solicitud quedará en <strong>Standby</strong> hasta que el Super Admin apruebe tu rol y autorice tu acceso al catálogo.
          </p>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          {/* Role Cards */}
          <div className="space-y-3">
            {/* 1. Promotora / Modelo */}
            <div
              onClick={() => setSelectedRole('model')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedRole === 'model'
                  ? 'bg-purple-950/20 border-purple-500 ring-2 ring-purple-500/30'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'model'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Promotora / Modelo de Protocolo</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold uppercase">
                        Talento
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Para modelos de pasarela, fotografía, promotoras de marca en ferias, salones automotrices y eventos en Venezuela.
                    </p>
                    <div className="text-[11px] text-purple-300/80 mt-1.5 flex items-center gap-1.5">
                      <span>✓ Perfil MediaKit</span>
                      <span>•</span>
                      <span>✓ Subida de fotos (verificada)</span>
                      <span>•</span>
                      <span>✓ Postulación a castings</span>
                    </div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedRole === 'model'
                    ? 'border-purple-500 bg-purple-500 text-black'
                    : 'border-zinc-700'
                }`}>
                  {selectedRole === 'model' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* 2. Empresa / Marca Corporativa */}
            <div
              onClick={() => setSelectedRole('empresa')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedRole === 'empresa'
                  ? 'bg-blue-950/20 border-blue-500 ring-2 ring-blue-500/30'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'empresa'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Empresa / Marca / Agencia</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold uppercase">
                        Corporativo
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Para empresas con RIF que organizan activaciones, stands, exposiciones o requieren staff comercial calificado.
                    </p>
                    <div className="text-[11px] text-blue-300/80 mt-1.5 flex items-center gap-1.5">
                      <span>✓ Publicar convocatorias oficiales</span>
                      <span>•</span>
                      <span>✓ Contratación masiva de staff</span>
                    </div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedRole === 'empresa'
                    ? 'border-blue-500 bg-blue-500 text-black'
                    : 'border-zinc-700'
                }`}>
                  {selectedRole === 'empresa' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* 3. Cliente Particular */}
            <div
              onClick={() => setSelectedRole('client')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedRole === 'client'
                  ? 'bg-emerald-950/20 border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'client'
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Cliente Particular</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                        Contratante
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Para personas naturales interesadas en coordinar promotoras para eventos privados o celebraciones específicas.
                    </p>
                    <div className="text-[11px] text-emerald-300/80 mt-1.5 flex items-center gap-1.5">
                      <span>✓ Cotización y coordinación directa</span>
                      <span>•</span>
                      <span>✓ Asesoría personalizada</span>
                    </div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedRole === 'client'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-black'
                    : 'border-zinc-700'
                }`}>
                  {selectedRole === 'client' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Empresa Fields */}
          {selectedRole === 'empresa' && (
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 animate-fadeIn">
              <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Datos Corporativos de la Empresa (Opcional)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Razón Social / Marca</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ej. Ron Santa Teresa C.A."
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">RIF de la Empresa</label>
                  <input
                    type="text"
                    value={companyRif}
                    onChange={(e) => setCompanyRif(e.target.value)}
                    placeholder="J-12345678-9"
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Phone Field */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1">
              Teléfono de Contacto WhatsApp (Venezuela)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+58 412 123 4567"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Standby Note */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Aviso de Activación:</strong> Al enviar tu solicitud, el Super Admin revisará tus datos. Mientras tu cuenta esté en standby no podrás ver el catálogo ni enviar mensajes.
            </p>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-black font-extrabold text-xs shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Confirmar Solicitud de Rol ({selectedRole === 'model' ? 'Promotora / Modelo' : selectedRole === 'empresa' ? 'Empresa' : 'Cliente Particular'})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
