import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  UserCheck,
  Star,
  Calendar,
  MessageSquare,
  Sparkles,
  Camera,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  DollarSign,
  TrendingUp,
  LogOut,
  MapPin,
  Lock,
  Building,
  User,
  Briefcase,
  Save,
  Phone,
  Instagram,
  Video,
  Info,
  AlertTriangle,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    models,
    events,
    reviews,
    isSuperAdmin,
    isModelUser,
    currentModelProfile,
    setActiveTab,
    logout,
    reviewIdentityVerification,
    submitIdentityVerification,
    updateCurrentUserProfile,
    updateModelSelf,
    availableCities,
    showToast,
  } = useApp();

  // Document upload state for model if not yet verified
  const [docType, setDocType] = useState<'Cédula de Identidad' | 'Pasaporte'>('Cédula de Identidad');
  const [docNumber, setDocNumber] = useState('');
  const [docPhoto, setDocPhoto] = useState('');

  // Client personal profile form state
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');
  const [clientType, setClientType] = useState<'empresa' | 'particular'>(
    currentUser?.clientType || (currentUser?.role === 'empresa' ? 'empresa' : 'particular')
  );
  const [companyName, setCompanyName] = useState(currentUser?.companyName || '');
  const [companyRif, setCompanyRif] = useState(currentUser?.companyRif || '');

  // Model self-edit state
  const [modelAge, setModelAge] = useState<number | ''>(currentModelProfile?.age ?? 22);
  const [modelBio, setModelBio] = useState(currentModelProfile?.bio || '');
  const [modelCity, setModelCity] = useState(currentModelProfile?.location?.city || 'Caracas');
  const [modelHeight, setModelHeight] = useState(currentModelProfile?.physical?.height || '1.75 m');
  const [modelBust, setModelBust] = useState(currentModelProfile?.physical?.bust || '88');
  const [modelWaist, setModelWaist] = useState(currentModelProfile?.physical?.waist || '60');
  const [modelHips, setModelHips] = useState(currentModelProfile?.physical?.hips || '90');
  const [modelEyeColor, setModelEyeColor] = useState(currentModelProfile?.physical?.eyeColor || 'Marrones');
  const [modelHairColor, setModelHairColor] = useState(currentModelProfile?.physical?.hairColor || 'Castaño');
  const [modelInstagram, setModelInstagram] = useState(currentModelProfile?.socialMedia?.instagram?.handle || '');
  const [modelTiktok, setModelTiktok] = useState(currentModelProfile?.socialMedia?.tiktok?.handle || '');
  const [modelPastExpText, setModelPastExpText] = useState(
    currentModelProfile?.pastExperience?.join('\n') || ''
  );

  // Sync state when current user or model profile changes
  useEffect(() => {
    if (currentUser) {
      setClientName(currentUser.name || '');
      setClientPhone(currentUser.phone || '');
      setClientType(currentUser.clientType || (currentUser.role === 'empresa' ? 'empresa' : 'particular'));
      setCompanyName(currentUser.companyName || '');
      setCompanyRif(currentUser.companyRif || '');
    }
    if (currentModelProfile) {
      setModelAge(currentModelProfile.age ?? 22);
      setModelBio(currentModelProfile.bio || '');
      setModelCity(currentModelProfile.location?.city || 'Caracas');
      setModelHeight(currentModelProfile.physical?.height || '1.75 m');
      setModelBust(currentModelProfile.physical?.bust || '88');
      setModelWaist(currentModelProfile.physical?.waist || '60');
      setModelHips(currentModelProfile.physical?.hips || '90');
      setModelEyeColor(currentModelProfile.physical?.eyeColor || 'Marrones');
      setModelHairColor(currentModelProfile.physical?.hairColor || 'Castaño');
      setModelInstagram(currentModelProfile.socialMedia?.instagram?.handle || '');
      setModelTiktok(currentModelProfile.socialMedia?.tiktok?.handle || '');
      setModelPastExpText(currentModelProfile.pastExperience?.join('\n') || '');
    }
  }, [currentUser, currentModelProfile]);

  // Pending verifications for Super Admin
  const pendingModels = models.filter((m) => m.identityVerification?.status === 'pendiente');
  const verifiedModels = models.filter((m) => m.verified && m.identityVerification?.status === 'verificado');

  const handleSaveClientProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateCurrentUserProfile({
      name: clientName,
      phone: clientPhone,
      clientType,
      companyName: clientType === 'empresa' ? companyName : undefined,
      companyRif: clientType === 'empresa' ? companyRif : undefined,
    });
  };

  const handleSaveModelSelf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentModelProfile) return;

    const parsedExp = modelPastExpText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const success = updateModelSelf(currentModelProfile.id, {
      age: typeof modelAge === 'number' ? modelAge : undefined,
      bio: modelBio,
      location: {
        ...currentModelProfile.location,
        city: modelCity,
        state: 'Venezuela',
      },
      physical: {
        ...currentModelProfile.physical,
        height: modelHeight,
        bust: modelBust,
        waist: modelWaist,
        hips: modelHips,
        eyeColor: modelEyeColor,
        hairColor: modelHairColor,
      },
      pastExperience: parsedExp.length > 0 ? parsedExp : currentModelProfile.pastExperience,
      socialMedia: {
        ...currentModelProfile.socialMedia,
        instagram: {
          ...currentModelProfile.socialMedia.instagram,
          handle: modelInstagram,
          url: `https://instagram.com/${modelInstagram.replace('@', '')}`,
        },
        tiktok: {
          ...currentModelProfile.socialMedia.tiktok,
          handle: modelTiktok,
          url: `https://tiktok.com/@${modelTiktok.replace('@', '')}`,
        },
      },
    });

    if (success) {
      showToast('Tu información y experiencia anterior se han actualizado.');
    }
  };

  const handleModelSubmitDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentModelProfile) return;
    if (!docPhoto) {
      showToast('Por favor carga la foto de tu documento.');
      return;
    }
    submitIdentityVerification(currentModelProfile.id, {
      documentType: docType,
      documentNumber: docNumber || 'V-REGISTRO',
      documentPhotoUrl: docPhoto,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setDocPhoto(reader.result as string);
      showToast('Foto del documento cargada.');
    };
    reader.readAsDataURL(file);
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-[var(--color-primary)]">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Inicia Sesión para Acceder a tu Panel</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
          Ingresa con tu correo y contraseña o con tu cuenta Google para gestionar tus contrataciones, verificar tu identidad o administrar la agencia.
        </p>
        <button
          onClick={() => setActiveTab('login')}
          className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-black font-bold text-sm shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all hover:opacity-90"
        >
          Ir a Iniciar Sesión / Registro
        </button>
      </div>
    );
  }

  const isStandby = currentUser.status === 'standby';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* STANDBY ACCOUNT NOTIFICATION BANNER */}
      {isStandby && (
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-200 relative overflow-hidden shadow-2xl animate-pulse">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-black">
                  Cuenta en Standby
                </span>
                <span className="text-xs text-amber-300 font-mono">
                  En espera de aprobación del Super Admin
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Tu cuenta está registrada y a la espera de activación oficial
              </h3>
              <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                Por políticas de seguridad y protección de las modelos en Venezuela, la <strong>Administración General de DIFUSION</strong> debe revisar y activar tu perfil asignándote tu rol oficial (<strong>Cliente / Empresa</strong> o <strong>Promotora</strong>). Mientras tu cuenta esté en standby no podrás enviar mensajes directos a las promotoras ni contratar servicios.
              </p>
            </div>
            <div className="shrink-0 text-right sm:border-l sm:border-amber-500/30 sm:pl-4">
              <div className="text-[11px] text-amber-300/80">Atención Oficial</div>
              <div className="text-xs font-mono font-bold text-white">soporte@difusion.agency</div>
            </div>
          </div>
        </div>
      )}

      {/* HIRING & COMMUNICATION POLICY NOTICE */}
      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300">
          <strong className="text-white">Reglas de Contratación & Comunicación DIFUSION:</strong> Las promotoras y modelos <em>no pueden contratarse entre ellas</em>. La contratación y solicitud de cotizaciones está reservada para perfiles verificados de <strong>Cliente</strong> o <strong>Empresa</strong>. Además, la mensajería directa requiere que tu cuenta esté autenticada y activada por el Super Admin.
        </div>
      </div>

      {/* 1. Header Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[var(--color-primary)]"
              />
              {currentUser.isVerified && (
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[var(--color-primary)] text-black">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{currentUser.name}</h1>
                {isSuperAdmin && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--color-primary)] text-black uppercase tracking-wider">
                    Super Admin DIFUSION
                  </span>
                )}
                {currentUser.role === 'model' && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                    Modelo / Promotora Activa
                  </span>
                )}
                {currentUser.role === 'client' && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 uppercase tracking-wider">
                    Cliente Particular
                  </span>
                )}
                {currentUser.role === 'empresa' && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                    Empresa / Corporativo
                  </span>
                )}
                {isStandby && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                    Standby (Pendiente)
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-mono">{currentUser.email}</p>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-zinc-400 flex-wrap">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> 2FA Activo
                </span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Firebase Auth Conectado
                </span>
                {currentUser.phone && (
                  <span className="flex items-center gap-1 text-zinc-300 font-mono">
                    <Phone className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {currentUser.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-white text-xs font-bold transition-colors"
              >
                Panel de Administración
              </button>
            )}
            <button
              onClick={() => setActiveTab('catalogo')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold transition-all hover:opacity-90 shadow-md"
            >
              Explorar Catálogo
            </button>
            <button
              onClick={logout}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-800 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isSuperAdmin ? (
          <>
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Modelos Registradas</span>
                <UserCheck className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="text-2xl font-black text-white">{models.length}</div>
              <span className="text-[11px] text-zinc-500">En {availableCities.length} ciudades venezolanas</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Verificaciones Cédula</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">{pendingModels.length}</div>
              <span className="text-[11px] text-zinc-500">Cédulas por validar</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Modelos con Sello</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">{verifiedModels.length}</div>
              <span className="text-[11px] text-zinc-500">Identidad 100% validada</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Eventos Activos</span>
                <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="text-2xl font-black text-white">{events.length}</div>
              <span className="text-[11px] text-zinc-500">Castings en Venezuela</span>
            </div>
          </>
        ) : isModelUser && currentModelProfile ? (
          <>
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Estado de Verificación</span>
                <FileCheck className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="text-lg font-bold">
                {currentModelProfile.identityVerification?.status === 'verificado' ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5" /> Verificado
                  </span>
                ) : currentModelProfile.identityVerification?.status === 'pendiente' ? (
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-5 h-5" /> En Revisión
                  </span>
                ) : (
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <AlertCircle className="w-5 h-5" /> Sin Verificar
                  </span>
                )}
              </div>
              <span className="text-[11px] text-zinc-500">Sello de Cédula Oficial</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Edad Registrada</span>
                <User className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="text-2xl font-black text-white">{currentModelProfile.age || 22} años</div>
              <span className="text-[11px] text-zinc-500">Ficha técnica pública</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Tarifa por Hora</span>
                <DollarSign className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="text-2xl font-black text-white">${currentModelProfile.hourlyRate}</div>
              <span className="text-[11px] text-zinc-500">Tarifa regulada agencia</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Calificación Media</span>
                <Star className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{currentModelProfile.rating} ★</div>
              <span className="text-[11px] text-zinc-500">{currentModelProfile.reviewCount} reseñas verificadas</span>
            </div>
          </>
        ) : (
          <>
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Modelos Disponibles</span>
                <UserCheck className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="text-2xl font-black text-white">{models.filter((m) => !m.isPaused).length}</div>
              <span className="text-[11px] text-zinc-500">Listas para contratación</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Eventos Próximos</span>
                <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="text-2xl font-black text-white">{events.length}</div>
              <span className="text-[11px] text-zinc-500">{availableCities.slice(0, 3).join(', ')}</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Calificaciones Reales</span>
                <Star className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{reviews.length}</div>
              <span className="text-[11px] text-zinc-500">Clientes verificados</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Atención VIP</span>
                <MessageSquare className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="text-lg font-bold text-[var(--color-primary)]">24/7 WhatsApp</div>
              <span className="text-[11px] text-zinc-500">Respuesta directa</span>
            </div>
          </>
        )}
      </div>

      {/* 3. CLIENT / EMPRESA USER PROFILE EDITING FORM (Personal Data Only) */}
      {!isModelUser && (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[var(--color-primary)]" />
                Mis Datos de Usuario & Facturación
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Modifica tus datos de contacto personales. Los usuarios normales solo gestionan su propio perfil.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 font-mono">
              Rol: {currentUser.role.toUpperCase()}
            </span>
          </div>

          <form onSubmit={handleSaveClientProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="+58 412 1234567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Tipo de Contratante</label>
                <select
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                >
                  <option value="particular">Persona Natural / Particular</option>
                  <option value="empresa">Empresa / Marca / Agencia</option>
                </select>
              </div>

              {clientType === 'empresa' && (
                <>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium">Nombre de la Empresa</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                      placeholder="Ej. Polar, Empresas C.A."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium">RIF Jurídico</label>
                    <input
                      type="text"
                      value={companyRif}
                      onChange={(e) => setCompanyRif(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                      placeholder="J-12345678-9"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-zinc-800">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs flex items-center gap-2 hover:opacity-90 shadow-md transition-all"
              >
                <Save className="w-4 h-4" /> Guardar Mis Datos
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. MODEL SELF-EDIT SECTION (Edad, Trabajos Anteriores, Medidas, Redes Sociales) */}
      {isModelUser && currentModelProfile && (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[var(--color-primary)]" />
                Edición de mi Perfil de Modelo / Promotora
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Actualiza tu edad, experiencia previa y detalles para el catálogo público. Solo puedes modificar tus propios datos.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 font-bold">
              ID: {currentModelProfile.id}
            </span>
          </div>

          <form onSubmit={handleSaveModelSelf} className="space-y-6">
            {/* Edad & Ciudad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Edad (Años)</label>
                <input
                  type="number"
                  min="18"
                  max="50"
                  value={modelAge}
                  onChange={(e) => setModelAge(e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Ej. 23"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Ciudad (Venezuela)</label>
                <select
                  value={modelCity}
                  onChange={(e) => setModelCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                >
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Estatura</label>
                <input
                  type="text"
                  value={modelHeight}
                  onChange={(e) => setModelHeight(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="1.75 m"
                />
              </div>
            </div>

            {/* Medidas & Colores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Busto (cm)</label>
                <input
                  type="text"
                  value={modelBust}
                  onChange={(e) => setModelBust(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Cintura (cm)</label>
                <input
                  type="text"
                  value={modelWaist}
                  onChange={(e) => setModelWaist(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Caderas (cm)</label>
                <input
                  type="text"
                  value={modelHips}
                  onChange={(e) => setModelHips(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Color de Ojos</label>
                <input
                  type="text"
                  value={modelEyeColor}
                  onChange={(e) => setModelEyeColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                />
              </div>
            </div>

            {/* Bio & Resumen */}
            <div>
              <label className="block text-xs text-zinc-400 mb-1 font-medium">Biografía Profesional</label>
              <textarea
                rows={3}
                value={modelBio}
                onChange={(e) => setModelBio(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="Describe tu trayectoria, estilo de modelaje y aptitudes para eventos."
              />
            </div>

            {/* Trabajos Anteriores / Experiencia Previa */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs text-zinc-400 font-medium">
                  Trabajos Anteriores & Marcas con las que has trabajado (1 por línea)
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">Visible en Ficha Técnica</span>
              </div>
              <textarea
                rows={4}
                value={modelPastExpText}
                onChange={(e) => setModelPastExpText(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="Empresas Polar - Expo Valencia 2024&#10;Motor Fest Caracas - Modelo de Marca&#10;Casting Moda Lechería 2023"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Ingresa cada experiencia o marca en una línea separada para mostrarla como medalla verificada.
              </p>
            </div>

            {/* Redes Sociales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" /> Usuario de Instagram
                </label>
                <input
                  type="text"
                  value={modelInstagram}
                  onChange={(e) => setModelInstagram(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="@usuario_instagram"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Usuario de TikTok
                </label>
                <input
                  type="text"
                  value={modelTiktok}
                  onChange={(e) => setModelTiktok(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="@usuario_tiktok"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Tarifas por hora (${currentModelProfile.hourlyRate}) y día (${currentModelProfile.dailyRate}): reguladas exclusivamente por la Administración General de DIFUSION para garantizar la transparencia del mercado venezolano.
              </span>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-zinc-800">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs flex items-center gap-2 hover:opacity-90 shadow-md transition-all"
              >
                <Save className="w-4 h-4" /> Guardar Cambios en mi Perfil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. SUPER ADMIN SECTION: PENDING IDENTITY VERIFICATIONS */}
      {isSuperAdmin && (
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
                Verificaciones de Identidad Oficial (Cédulas y Pasaportes)
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Valida el documento oficial de las modelos de Venezuela para otorgar el Sello de Verificado en el catálogo.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {pendingModels.length} Pendientes
            </span>
          </div>

          {pendingModels.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
              ✓ No hay solicitudes de verificación pendientes en este momento. Todas las modelos activas están revisadas.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingModels.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-zinc-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{m.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {m.location.city} · {m.ownerEmail}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="font-semibold text-[var(--color-primary)]">
                          {m.identityVerification?.documentType}:
                        </span>
                        <span className="font-mono text-white">
                          {m.identityVerification?.documentNumber || 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Document photo preview */}
                  {m.identityVerification?.documentPhotoUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-black/60 max-h-40 flex items-center justify-center">
                      <img
                        src={m.identityVerification.documentPhotoUrl}
                        alt="Documento Cédula"
                        className="w-full h-36 object-contain"
                      />
                      <span className="absolute bottom-2 right-2 text-[10px] bg-black/80 text-zinc-300 px-2 py-0.5 rounded font-mono">
                        Foto enviada por la modelo
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                    <button
                      onClick={() => reviewIdentityVerification(m.id, true)}
                      className="flex-1 py-2 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-black text-xs font-bold transition-all shadow-md"
                    >
                      ✓ Aprobar y Otorgar Sello
                    </button>
                    <button
                      onClick={() =>
                        reviewIdentityVerification(m.id, false, 'Documento poco nítido o no legible')
                      }
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-red-950 text-zinc-300 hover:text-red-400 text-xs font-semibold transition-colors"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. MODEL SECTION: SUBMIT IDENTITY VERIFICATION IF NOT VERIFIED */}
      {isModelUser && currentModelProfile && currentModelProfile.identityVerification?.status !== 'verificado' && (
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[var(--color-primary)]" />
              Solicitar Sello de Verificado Oficial (Cédula / Pasaporte)
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Las modelos con identidad verificada obtienen el sello verde en el catálogo y reciben hasta un 80% más de solicitudes de marcas para eventos.
            </p>
          </div>

          {currentModelProfile.identityVerification?.status === 'pendiente' ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
              <Clock className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold">Tu documento está en revisión por la administración.</div>
                <div>
                  Documento: {currentModelProfile.identityVerification.documentType} ({currentModelProfile.identityVerification.documentNumber}). El Super Admin validará tus datos a la brevedad.
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleModelSubmitDoc} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Tipo de Documento</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                  >
                    <option value="Cédula de Identidad">Cédula de Identidad (Venezuela)</option>
                    <option value="Pasaporte">Pasaporte Oficial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Número de Documento</label>
                  <input
                    type="text"
                    required
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ej. V-25.123.456"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">
                  Foto de la Cédula / Pasaporte (Cámara o Archivo)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-[var(--color-primary)] hover:file:bg-zinc-750"
                  />
                  {docPhoto && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold shrink-0">
                      ✓ Foto Lista
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs shadow-md hover:opacity-90 transition-all"
              >
                Enviar Documento a Validación
              </button>
            </form>
          )}
        </div>
      )}

      {/* 7. Quick Links & Shortcuts */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4">Acciones Rápidas del Ecosistema DIFUSION</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab('catalogo')}
            className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-left transition-colors group"
          >
            <div className="text-xs font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">
              Catálogo de Modelos
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Filtra por ciudades venezolanas ({availableCities.slice(0, 3).join(', ')}...) y verifica perfiles con mediakit.
            </div>
          </button>

          <button
            onClick={() => setActiveTab('eventos')}
            className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-left transition-colors group"
          >
            <div className="text-xs font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">
              Eventos & Castings
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Convocatorias para marcas y activaciones en vivo.
            </div>
          </button>

          <button
            onClick={() => setActiveTab('streaming')}
            className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-left transition-colors group"
          >
            <div className="text-xs font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">
              Streaming & Backstage
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Transmisiones en vivo de pasarelas y sesiones fotográficas.
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
