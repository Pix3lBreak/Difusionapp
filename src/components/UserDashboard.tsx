import React, { useState, useEffect, useRef } from 'react';
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
  Eye,
  MessageCircle,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Globe,
  Percent,
  Check,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    models,
    events,
    reviews,
    chatMessages,
    setActiveChatModel,
    isSuperAdmin,
    isModelUser,
    currentModelProfile,
    setSelectedModel,
    setActiveTab,
    logout,
    reviewIdentityVerification,
    submitIdentityVerification,
    updateCurrentUserProfile,
    updateModelSelf,
    availableCities,
    showToast,
    setShowRoleSelectionModal,
  } = useApp();

  // Document upload state for model if not yet verified
  const [docType, setDocType] = useState<'Cédula de Identidad' | 'Pasaporte'>('Cédula de Identidad');
  const [docNumber, setDocNumber] = useState('');
  const [docPhoto, setDocPhoto] = useState('');

  // Refs for file uploads
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const companyLogoInputRef = useRef<HTMLInputElement>(null);

  // Client personal profile form state
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');
  const [clientType, setClientType] = useState<'empresa' | 'particular'>(
    currentUser?.clientType || (currentUser?.role === 'empresa' ? 'empresa' : 'particular')
  );
  const [companyName, setCompanyName] = useState(currentUser?.companyName || '');
  const [companyRif, setCompanyRif] = useState(currentUser?.companyRif || '');

  // Empresa MediaKit Corporate Form State
  const [companyIndustry, setCompanyIndustry] = useState<string>(currentUser?.companyIndustry || 'Eventos & Producción Corporativa');
  const [companyBio, setCompanyBio] = useState<string>(currentUser?.companyBio || '');
  const [companyCity, setCompanyCity] = useState<string>(currentUser?.companyCity || 'Caracas');
  const [companyAddress, setCompanyAddress] = useState<string>(currentUser?.companyAddress || '');
  const [companyWebsite, setCompanyWebsite] = useState<string>(currentUser?.companyWebsite || '');
  const [companyInstagram, setCompanyInstagram] = useState<string>(currentUser?.companyInstagram || '');
  const [companyLogo, setCompanyLogo] = useState<string>(currentUser?.companyLogo || currentUser?.avatar || '');
  const [contactPerson, setContactPerson] = useState<string>(currentUser?.contactPerson || currentUser?.name || '');
  const [companyEventTypesText, setCompanyEventTypesText] = useState<string>(
    currentUser?.companyEventTypes ? currentUser.companyEventTypes.join(', ') : 'Lanzamientos de Marca, Ferias Comerciales, Congresos'
  );

  // Model self-edit state (Full MediaKit, Rates, Photos, Social Stats & Ficha Técnica)
  const [modelAge, setModelAge] = useState<number | ''>(currentModelProfile?.age ?? 22);
  const [modelStageName, setModelStageName] = useState<string>(currentModelProfile?.stageName || '');
  const [modelBio, setModelBio] = useState(currentModelProfile?.bio || '');
  const [modelCity, setModelCity] = useState(currentModelProfile?.location?.city || 'Caracas');
  const [modelAvailableToTravel, setModelAvailableToTravel] = useState<boolean>(currentModelProfile?.location?.availableToTravel ?? true);
  const [modelHeight, setModelHeight] = useState(currentModelProfile?.physical?.height || '1.75 m');
  const [modelBust, setModelBust] = useState(currentModelProfile?.physical?.bust || '88');
  const [modelWaist, setModelWaist] = useState(currentModelProfile?.physical?.waist || '60');
  const [modelHips, setModelHips] = useState(currentModelProfile?.physical?.hips || '90');
  const [modelEyeColor, setModelEyeColor] = useState(currentModelProfile?.physical?.eyeColor || 'Marrones');
  const [modelHairColor, setModelHairColor] = useState(currentModelProfile?.physical?.hairColor || 'Castaño');
  const [modelShoeSize, setModelShoeSize] = useState(currentModelProfile?.physical?.shoeSize || '38');
  const [modelLanguages, setModelLanguages] = useState(currentModelProfile?.languages?.join(', ') || 'Español (Nativo)');
  const [modelHourlyRate, setModelHourlyRate] = useState<number>(currentModelProfile?.hourlyRate ?? 50);
  const [modelDailyRate, setModelDailyRate] = useState<number>(currentModelProfile?.dailyRate ?? 350);
  const [modelAvatar, setModelAvatar] = useState<string>(currentModelProfile?.avatar || '');
  const [modelGallery, setModelGallery] = useState<string[]>(currentModelProfile?.gallery || []);
  const [modelInstagram, setModelInstagram] = useState(currentModelProfile?.socialMedia?.instagram?.handle || '');
  const [modelIgFollowers, setModelIgFollowers] = useState(currentModelProfile?.socialMedia?.instagram?.followers || '25K');
  const [modelIgEngagement, setModelIgEngagement] = useState(currentModelProfile?.socialMedia?.instagram?.engagement || '4.5%');
  const [modelTiktok, setModelTiktok] = useState(currentModelProfile?.socialMedia?.tiktok?.handle || '');
  const [modelTiktokFollowers, setModelTiktokFollowers] = useState(currentModelProfile?.socialMedia?.tiktok?.followers || '35K');
  const [modelTiktokLikes, setModelTiktokLikes] = useState(currentModelProfile?.socialMedia?.tiktok?.likes || '450K');
  const [modelWhatsapp, setModelWhatsapp] = useState(currentModelProfile?.whatsappNumber || '');
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
      setCompanyIndustry(currentUser.companyIndustry || 'Eventos & Producción Corporativa');
      setCompanyBio(currentUser.companyBio || '');
      setCompanyCity(currentUser.companyCity || 'Caracas');
      setCompanyAddress(currentUser.companyAddress || '');
      setCompanyWebsite(currentUser.companyWebsite || '');
      setCompanyInstagram(currentUser.companyInstagram || '');
      setCompanyLogo(currentUser.companyLogo || currentUser.avatar || '');
      setContactPerson(currentUser.contactPerson || currentUser.name || '');
      if (currentUser.companyEventTypes) {
        setCompanyEventTypesText(currentUser.companyEventTypes.join(', '));
      }
    }
    if (currentModelProfile) {
      setModelAge(currentModelProfile.age ?? 22);
      setModelStageName(currentModelProfile.stageName || '');
      setModelBio(currentModelProfile.bio || '');
      setModelCity(currentModelProfile.location?.city || 'Caracas');
      setModelAvailableToTravel(currentModelProfile.location?.availableToTravel ?? true);
      setModelHeight(currentModelProfile.physical?.height || '1.75 m');
      setModelBust(currentModelProfile.physical?.bust || '88');
      setModelWaist(currentModelProfile.physical?.waist || '60');
      setModelHips(currentModelProfile.physical?.hips || '90');
      setModelEyeColor(currentModelProfile.physical?.eyeColor || 'Marrones');
      setModelHairColor(currentModelProfile.physical?.hairColor || 'Castaño');
      setModelShoeSize(currentModelProfile.physical?.shoeSize || '38');
      setModelLanguages(currentModelProfile.languages?.join(', ') || 'Español (Nativo)');
      setModelHourlyRate(currentModelProfile.hourlyRate ?? 50);
      setModelDailyRate(currentModelProfile.dailyRate ?? 350);
      setModelAvatar(currentModelProfile.avatar || '');
      setModelGallery(currentModelProfile.gallery || []);
      setModelInstagram(currentModelProfile.socialMedia?.instagram?.handle || '');
      setModelIgFollowers(currentModelProfile.socialMedia?.instagram?.followers || '25K');
      setModelIgEngagement(currentModelProfile.socialMedia?.instagram?.engagement || '4.5%');
      setModelTiktok(currentModelProfile.socialMedia?.tiktok?.handle || '');
      setModelTiktokFollowers(currentModelProfile.socialMedia?.tiktok?.followers || '35K');
      setModelTiktokLikes(currentModelProfile.socialMedia?.tiktok?.likes || '450K');
      setModelWhatsapp(currentModelProfile.whatsappNumber || '');
      setModelPastExpText(currentModelProfile.pastExperience?.join('\n') || '');
    }
  }, [currentUser, currentModelProfile]);

  // Model image upload handlers
  const handleModelAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Selecciona un archivo de imagen válido');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setModelAvatar(event.target?.result as string);
      showToast('Nueva foto de perfil cargada. Haz clic en Guardar Cambios para publicarla.');
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Selecciona un archivo de imagen válido');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      setModelGallery((prev) => [...prev, res]);
      showToast('Foto añadida a tu book. Haz clic en Guardar Cambios para publicarla.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setModelGallery((prev) => prev.filter((_, i) => i !== index));
    showToast('Foto eliminada de tu book.');
  };

  // Empresa logo upload handler
  const handleCompanyLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Selecciona un archivo de imagen válido');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setCompanyLogo(event.target?.result as string);
      showToast('Logo corporativo cargado. Haz clic en Guardar Datos para actualizar.');
    };
    reader.readAsDataURL(file);
  };

  // Pending verifications for Super Admin
  const pendingModels = models.filter((m) => m.identityVerification?.status === 'pendiente');
  const verifiedModels = models.filter((m) => m.verified && m.identityVerification?.status === 'verificado');

  const handleSaveClientProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const parsedEventTypes = companyEventTypesText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    updateCurrentUserProfile({
      name: clientName,
      phone: clientPhone,
      clientType,
      avatar: companyLogo || currentUser.avatar,
      companyName: clientType === 'empresa' ? companyName : undefined,
      companyRif: clientType === 'empresa' ? companyRif : undefined,
      companyIndustry: clientType === 'empresa' ? companyIndustry : undefined,
      companyBio: clientType === 'empresa' ? companyBio : undefined,
      companyCity: clientType === 'empresa' ? companyCity : undefined,
      companyAddress: clientType === 'empresa' ? companyAddress : undefined,
      companyWebsite: clientType === 'empresa' ? companyWebsite : undefined,
      companyInstagram: clientType === 'empresa' ? companyInstagram : undefined,
      companyLogo: clientType === 'empresa' ? companyLogo : undefined,
      companyEventTypes: clientType === 'empresa' ? parsedEventTypes : undefined,
      contactPerson: clientType === 'empresa' ? contactPerson : undefined,
    });
  };

  const handleSaveModelSelf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentModelProfile) return;

    const isModelVerified = !!(currentModelProfile.verified || currentModelProfile.identityVerification?.status === 'verificado');
    const isAccountActive = currentUser?.status === 'active';
    if (!isModelVerified || !isAccountActive) {
      showToast('Acción denegada: Tu perfil debe estar aprobado y verificado con documento oficial para guardar cambios.');
      return;
    }

    const parsedExp = modelPastExpText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const parsedLanguages = modelLanguages
      .split(',')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const success = updateModelSelf(currentModelProfile.id, {
      age: typeof modelAge === 'number' ? modelAge : undefined,
      stageName: modelStageName.trim() || currentModelProfile.stageName,
      hourlyRate: Number(modelHourlyRate) || currentModelProfile.hourlyRate,
      dailyRate: Number(modelDailyRate) || currentModelProfile.dailyRate,
      avatar: modelAvatar || currentModelProfile.avatar,
      gallery: modelGallery.length > 0 ? modelGallery : currentModelProfile.gallery,
      whatsappNumber: modelWhatsapp.trim() || currentModelProfile.whatsappNumber,
      bio: modelBio,
      languages: parsedLanguages.length > 0 ? parsedLanguages : currentModelProfile.languages,
      location: {
        ...currentModelProfile.location,
        city: modelCity,
        availableToTravel: modelAvailableToTravel,
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
        shoeSize: modelShoeSize,
      },
      pastExperience: parsedExp.length > 0 ? parsedExp : currentModelProfile.pastExperience,
      socialMedia: {
        ...currentModelProfile.socialMedia,
        instagram: {
          ...currentModelProfile.socialMedia.instagram,
          handle: modelInstagram,
          followers: modelIgFollowers,
          engagement: modelIgEngagement,
          url: `https://instagram.com/${modelInstagram.replace('@', '')}`,
        },
        tiktok: {
          ...currentModelProfile.socialMedia.tiktok,
          handle: modelTiktok,
          followers: modelTiktokFollowers,
          likes: modelTiktokLikes,
          url: `https://tiktok.com/@${modelTiktok.replace('@', '')}`,
        },
      },
    });

    if (success) {
      showToast('✓ Tu perfil y MediaKit completo se han guardado con éxito.');
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
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-900 border border-amber-500/50 text-white">
                  Rol Solicitado:{' '}
                  <strong className="text-[var(--color-primary)] uppercase">
                    {currentUser.requestedRole === 'model'
                      ? 'Promotora / Modelo'
                      : currentUser.requestedRole === 'empresa'
                      ? 'Empresa / Marca'
                      : 'Cliente Particular'}
                  </strong>
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Tu cuenta está registrada y a la espera de activación oficial
              </h3>
              <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                Por políticas de seguridad y protección de las modelos en Venezuela, la <strong>Administración General de DIFUSION</strong> debe revisar y activar tu perfil asignándote tu rol oficial (<strong>Cliente Particular</strong>, <strong>Empresa Corporativa</strong> o <strong>Promotora / Modelo</strong>). Mientras tu cuenta esté en standby no podrás ver el catálogo, enviar mensajes ni contratar servicios.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[11px] px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  🔒 Rol solicitado registrado: Solo el Super Admin puede modificar o aprobar tu rol definitivo.
                </span>
              </div>
            </div>
            <div className="shrink-0 text-right sm:border-l sm:border-amber-500/30 sm:pl-4">
              <div className="text-[11px] text-amber-300/80">Atención Oficial</div>
              <div className="text-xs font-semibold text-white">Administración DIFUSION</div>
              <div className="text-[10px] text-zinc-400 font-mono">contacto@difusion.agency</div>
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
              onClick={() => setActiveTab('parati')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>🔥 Muro Para Ti</span>
            </button>
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

      {/* 3. CLIENT / EMPRESA USER PROFILE & MEDIAKIT EDITING */}
      {!isModelUser && (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-[var(--color-primary)]" />
                {clientType === 'empresa' ? 'MediaKit & Perfil Corporativo de la Empresa' : 'Mis Datos de Usuario & Facturación'}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {clientType === 'empresa'
                  ? 'Gestiona la información pública, logotipo y requerimientos de tu empresa para la contratación de talento en Venezuela.'
                  : 'Modifica tus datos de contacto personales. Solo tú puedes gestionar y visualizar tu propio perfil.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono">
                Rol: {currentUser.role.toUpperCase()}
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Solo tu perfil
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveClientProfile} className="space-y-6">
            {/* Tipo de Contratante Switcher */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Tipo de Cuenta / Contratante</label>
                <select
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                >
                  <option value="particular">Persona Natural / Cliente Particular</option>
                  <option value="empresa">Empresa / Marca Corporativa / Agencia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1 font-medium">Persona de Contacto / Representante</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            {/* IF EMPRESA: FULL CORPORATE MEDIAKIT FIELDS */}
            {clientType === 'empresa' && (
              <div className="space-y-6 pt-2">
                {/* Logo & Basic Corporate Identity */}
                <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 space-y-4">
                  <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-4 h-4" />
                    Identidad Corporativa & Logo
                  </h3>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="relative shrink-0">
                      <img
                        src={companyLogo || currentUser.avatar || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=80'}
                        alt="Logo Empresa"
                        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[var(--color-primary)]/50 bg-zinc-900"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={companyLogoInputRef}
                          onChange={handleCompanyLogoUpload}
                          accept="image/*"
                          className="hidden"
                          id="company-logo-input"
                        />
                        <label
                          htmlFor="company-logo-input"
                          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white border border-zinc-700 cursor-pointer flex items-center gap-1.5 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          <span>Subir Logo desde Dispositivo</span>
                        </label>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        O pega la URL directa de la imagen de tu logo corporativo:
                      </p>
                      <input
                        type="url"
                        value={companyLogo}
                        onChange={(e) => setCompanyLogo(e.target.value)}
                        placeholder="https://ejemplo.com/logo-empresa.png"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:border-[var(--color-primary)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium">Razón Social / Nombre Comercial</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                        placeholder="Ej. Empresas Polar C.A."
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium">RIF Jurídico (Venezuela)</label>
                      <input
                        type="text"
                        value={companyRif}
                        onChange={(e) => setCompanyRif(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                        placeholder="J-12345678-9"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium">Sector / Industria</label>
                      <select
                        value={companyIndustry}
                        onChange={(e) => setCompanyIndustry(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                      >
                        <option value="Eventos & Producción Corporativa">Eventos & Producción Corporativa</option>
                        <option value="Automotriz & Motores">Automotriz & Motores</option>
                        <option value="Moda, Calzado & Confección">Moda, Calzado & Confección</option>
                        <option value="Alimentos, Licores & Bebidas">Alimentos, Licores & Bebidas</option>
                        <option value="Tecnología & Telecomunicaciones">Tecnología & Telecomunicaciones</option>
                        <option value="Banca, Finanzas & Seguros">Banca, Finanzas & Seguros</option>
                        <option value="Salud, Cosmética & Estética">Salud, Cosmética & Estética</option>
                        <option value="Agencia de Publicidad & Medios">Agencia de Publicidad & Medios</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact & Location Details */}
                <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 space-y-4">
                  <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    Contacto Oficial & Ubicación
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium">Ciudad Principal</label>
                      <select
                        value={companyCity}
                        onChange={(e) => setCompanyCity(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                      >
                        {availableCities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium">Teléfono / WhatsApp Corporativo</label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                        placeholder="+58 212 999 8877"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium">Cargo del Contacto</label>
                      <input
                        type="text"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                        placeholder="Ej. Gerente de Mercadeo y Eventos"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium">Dirección Fiscal / Sede Corporativa</label>
                    <input
                      type="text"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                      placeholder="Ej. Torre Credicard, Piso 12, Chacaíto, Caracas"
                    />
                  </div>
                </div>

                {/* MediaKit Bio & Channels */}
                <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 space-y-4">
                  <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    MediaKit Corporativo & Canales Digitales
                  </h3>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium">Descripción de la Empresa / MediaKit OnePage</label>
                    <textarea
                      rows={3}
                      value={companyBio}
                      onChange={(e) => setCompanyBio(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none leading-relaxed"
                      placeholder="Describe tu empresa, trayectoria en Venezuela, tipo de eventos que organizan y qué perfil de promotoras/modelos buscan..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-400" /> Sitio Web Corporativo
                      </label>
                      <input
                        type="url"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                        placeholder="https://miempresa.com.ve"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium flex items-center gap-1.5">
                        <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram de la Empresa
                      </label>
                      <input
                        type="text"
                        value={companyInstagram}
                        onChange={(e) => setCompanyInstagram(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                        placeholder="@empresa_oficial"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium">
                      Tipos de Eventos que organiza tu Empresa (separados por coma)
                    </label>
                    <input
                      type="text"
                      value={companyEventTypesText}
                      onChange={(e) => setCompanyEventTypesText(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                      placeholder="Lanzamientos de Producto, Exposiciones Comerciales, Pasarelas, Protocolo VIP"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* IF PARTICULAR CLIENT */}
            {clientType === 'particular' && (
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Teléfono / WhatsApp de Contacto</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                    placeholder="+58 412 1234567"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <span className="text-xs text-zinc-500">
                🔒 Solo editable por tu cuenta ({currentUser.email})
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs flex items-center gap-2 hover:opacity-90 shadow-md transition-all active:scale-95"
              >
                <Save className="w-4 h-4" /> Guardar Perfil & MediaKit Empresa
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. MODEL SELF-EDIT SECTION (Tarifas, Book Fotográfico, Redes Sociales, Medidas & Ficha Técnica) */}
      {isModelUser && currentModelProfile && (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[var(--color-primary)]" />
                  Edición de mi Perfil & MediaKit de Modelo / Promotora
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Solo tu perfil
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Actualiza tus tarifas por hora y día, fotos del book, redes sociales y medidas físicas. Cada modelo gestiona únicamente su propio MediaKit.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedModel(currentModelProfile)}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs text-white border border-zinc-700 hover:border-[var(--color-primary)] flex items-center gap-1.5 transition-colors shadow active:scale-95"
              >
                <Eye className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Ver cómo queda mi MediaKit OnePage</span>
              </button>
              <span className="text-xs px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 font-bold font-mono">
                ID: {currentModelProfile.id}
              </span>
            </div>
          </div>

          {(!currentModelProfile.verified && currentModelProfile.identityVerification?.status !== 'verificado') && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white text-sm">Edición Bloqueada hasta Verificación Oficial</span>
                <p className="mt-1 leading-relaxed text-zinc-300">
                  Por políticas de seguridad de DIFUSION Venezuela, debes verificar tu Cédula o Pasaporte en la sección inferior para que la administración active la edición de tu MediaKit.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSaveModelSelf} className="space-y-6">

            {/* SECCIÓN 1: TARIFAS DE MEDIAKIT & WHATSAPP */}
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  Tarifas Oficiales de mi MediaKit & Contacto
                </h3>
                <span className="text-[11px] text-zinc-400">Visibles para empresas y clientes</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Tarifa por Hora (USD $)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-bold">$</span>
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      value={modelHourlyRate}
                      onChange={(e) => setModelHourlyRate(parseInt(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono font-bold focus:border-[var(--color-primary)] focus:outline-none"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Tarifa por Día / Jornada (USD $)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-bold">$</span>
                    <input
                      type="number"
                      min="50"
                      max="5000"
                      value={modelDailyRate}
                      onChange={(e) => setModelDailyRate(parseInt(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono font-bold focus:border-[var(--color-primary)] focus:outline-none"
                      placeholder="350"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">WhatsApp para Contrataciones</label>
                  <input
                    type="tel"
                    value={modelWhatsapp}
                    onChange={(e) => setModelWhatsapp(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none font-mono"
                    placeholder="+58 412 1234567"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: BOOK FOTOGRÁFICO & AVATAR */}
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-pink-400" />
                  Book Fotográfico & Fotos de mi MediaKit
                </h3>
                <span className="text-[11px] text-zinc-400">{modelGallery.length} fotos en book</span>
              </div>

              {/* Avatar Uploader */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-zinc-800">
                <img
                  src={modelAvatar || currentModelProfile.avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[var(--color-primary)]"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={avatarInputRef}
                      onChange={handleModelAvatarUpload}
                      accept="image/*"
                      className="hidden"
                      id="model-avatar-file-input"
                    />
                    <label
                      htmlFor="model-avatar-file-input"
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white border border-zinc-700 cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      <span>Cambiar Foto de Portada / Avatar</span>
                    </label>
                  </div>
                  <input
                    type="url"
                    value={modelAvatar}
                    onChange={(e) => setModelAvatar(e.target.value)}
                    placeholder="O pega la URL de tu foto de portada..."
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Gallery photos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-zinc-300">
                    Galería de Fotos para tu Book Oficial
                  </label>
                  <div>
                    <input
                      type="file"
                      ref={galleryInputRef}
                      onChange={handleAddGalleryPhoto}
                      accept="image/*"
                      className="hidden"
                      id="model-gallery-file-input"
                    />
                    <label
                      htmlFor="model-gallery-file-input"
                      className="px-3 py-1.5 rounded-xl bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 text-[var(--color-primary)] text-xs font-bold cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Subir Foto al Book</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {modelGallery.map((photoUrl, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[3/4]">
                      <img
                        src={photoUrl}
                        alt={`Book foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryPhoto(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        title="Eliminar foto del book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: REDES SOCIALES & ESTADÍSTICAS MEDIAKIT */}
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 space-y-4">
              <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Estadísticas de Redes Sociales (MediaKit Real-Time)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Instagram stats */}
                <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400">
                    <Instagram className="w-4 h-4" /> Instagram MediaKit
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Usuario (@)</label>
                    <input
                      type="text"
                      value={modelInstagram}
                      onChange={(e) => setModelInstagram(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      placeholder="@usuario"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Seguidores</label>
                      <input
                        type="text"
                        value={modelIgFollowers}
                        onChange={(e) => setModelIgFollowers(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                        placeholder="45K"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Engagement (%)</label>
                      <input
                        type="text"
                        value={modelIgEngagement}
                        onChange={(e) => setModelIgEngagement(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                        placeholder="5.2%"
                      />
                    </div>
                  </div>
                </div>

                {/* TikTok stats */}
                <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                    <Video className="w-4 h-4" /> TikTok MediaKit
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Usuario (@)</label>
                    <input
                      type="text"
                      value={modelTiktok}
                      onChange={(e) => setModelTiktok(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      placeholder="@usuario"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Seguidores</label>
                      <input
                        type="text"
                        value={modelTiktokFollowers}
                        onChange={(e) => setModelTiktokFollowers(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                        placeholder="80K"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Likes Totales</label>
                      <input
                        type="text"
                        value={modelTiktokLikes}
                        onChange={(e) => setModelTiktokLikes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                        placeholder="1.2M"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: DATOS PERSONALES & FICHA TÉCNICA */}
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/90 space-y-4">
              <h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Medidas & Ficha Técnica Física
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Nombre Artístico</label>
                  <input
                    type="text"
                    value={modelStageName}
                    onChange={(e) => setModelStageName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:border-[var(--color-primary)] focus:outline-none"
                    placeholder="Valeria R."
                  />
                </div>

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

              {/* Medidas 90-60-90 & Calzado */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Busto (cm)</label>
                  <input
                    type="text"
                    value={modelBust}
                    onChange={(e) => setModelBust(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Cintura (cm)</label>
                  <input
                    type="text"
                    value={modelWaist}
                    onChange={(e) => setModelWaist(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Caderas (cm)</label>
                  <input
                    type="text"
                    value={modelHips}
                    onChange={(e) => setModelHips(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Calzado</label>
                  <input
                    type="text"
                    value={modelShoeSize}
                    onChange={(e) => setModelShoeSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    placeholder="38"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Ojos & Cabello</label>
                  <input
                    type="text"
                    value={`${modelEyeColor} / ${modelHairColor}`}
                    onChange={(e) => {
                      const parts = e.target.value.split('/');
                      if (parts[0]) setModelEyeColor(parts[0].trim());
                      if (parts[1]) setModelHairColor(parts[1].trim());
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    placeholder="Marrones / Castaño"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Idiomas (separados por coma)</label>
                  <input
                    type="text"
                    value={modelLanguages}
                    onChange={(e) => setModelLanguages(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    placeholder="Español (Nativo), Inglés (Intermedio)"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      checked={modelAvailableToTravel}
                      onChange={(e) => setModelAvailableToTravel(e.target.checked)}
                      className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-[var(--color-primary)] focus:ring-0"
                    />
                    <span>Disponible para viajar dentro y fuera de Venezuela</span>
                  </label>
                </div>
              </div>

              {/* Bio */}
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
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <span className="text-xs text-zinc-500">
                🔒 Solo editable por tu cuenta ({currentModelProfile.ownerEmail || currentUser.email})
              </span>
              <button
                type="submit"
                disabled={!currentModelProfile.verified && currentModelProfile.identityVerification?.status !== 'verificado'}
                className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs flex items-center gap-2 hover:opacity-90 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                <Save className="w-4 h-4" /> Guardar Todos los Cambios de mi MediaKit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. BANDEJA DE MENSAJES & CHATS DIRECTOS */}
      {!isStandby && (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[var(--color-primary)]" />
                Bandeja de Mensajes de Chat
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Conversaciones directas y consultas de cotización. Contesta a tu tiempo y recibe notificaciones en tu perfil.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono">
              Tiempo Real
            </span>
          </div>

          {isModelUser && currentModelProfile ? (
            /* Model's Inbox */
            (() => {
              const modelMsgs = chatMessages[currentModelProfile.id] || [];
              if (modelMsgs.length === 0) {
                return (
                  <div className="p-6 rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800 text-center text-xs text-zinc-400">
                    <MessageCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="font-semibold text-zinc-300">Aún no tienes mensajes nuevos de clientes.</p>
                    <p className="text-zinc-500 mt-0.5">
                      Cuando un cliente o empresa te escriba para una cotización o contratación, recibirás una notificación en tu perfil y podrás responder aquí a tu tiempo.
                    </p>
                  </div>
                );
              }

              const lastMsg = modelMsgs[modelMsgs.length - 1];

              return (
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[var(--color-primary)] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shrink-0 font-bold">
                      {lastMsg.senderName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{lastMsg.senderName}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{lastMsg.timestamp}</span>
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-[var(--color-primary)] font-mono">
                          {modelMsgs.length} mensajes
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                        {lastMsg.text}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveChatModel(currentModelProfile)}
                    className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-md shrink-0 transition-transform active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Abrir Chat y Responder</span>
                  </button>
                </div>
              );
            })()
          ) : (
            /* Client / Superadmin Inbox */
            (() => {
              const activeConvEntries = Object.entries(chatMessages).filter(
                ([_, msgs]) => msgs && msgs.length > 0
              );

              if (activeConvEntries.length === 0) {
                return (
                  <div className="p-6 rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800 text-center text-xs text-zinc-400">
                    <MessageCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="font-semibold text-zinc-300">No hay chats activos iniciados.</p>
                    <p className="text-zinc-500 mt-0.5">
                      Puedes iniciar una conversación directa desde el catálogo seleccionando a cualquier promotora o modelo.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {activeConvEntries.map(([mId, msgs]) => {
                    const target = models.find((m) => m.id === mId);
                    if (!target) return null;
                    const lastMsg = msgs[msgs.length - 1];

                    return (
                      <div
                        key={mId}
                        className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[var(--color-primary)]/60 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={target.avatar}
                            alt={target.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-700 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-white">{target.name}</span>
                              <span className="text-xs text-zinc-400">· {target.location.city}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">{lastMsg.timestamp}</span>
                            </div>
                            <p className="text-xs text-zinc-300 mt-0.5 line-clamp-1">
                              <span className="text-zinc-400 font-medium">{lastMsg.senderName}: </span>
                              {lastMsg.text}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveChatModel(target)}
                          className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-[var(--color-primary)] text-xs font-bold flex items-center justify-center gap-2 transition-colors shrink-0"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          <span>Continuar Conversación</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* 6. SUPER ADMIN SECTION: PENDING IDENTITY VERIFICATIONS */}
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
