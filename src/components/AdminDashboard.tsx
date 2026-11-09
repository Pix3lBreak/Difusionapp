import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ModelProfile, CategoryType } from '../types';
import { VENEZUELAN_CITIES, SUPER_ADMIN_EMAIL } from '../data/initialData';
import {
  Users,
  Palette,
  ShieldAlert,
  Plus,
  Trash2,
  Edit,
  Upload,
  Check,
  Camera,
  Star,
  MapPin,
  Lock,
  PauseCircle,
  PlayCircle,
  Instagram,
  Video,
  DollarSign,
  AlertCircle,
  Sparkles,
  FileCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Briefcase,
  UserCheck,
  UserX,
  Globe,
  Crown,
  Tv,
  Radio,
  Code,
  Image as ImageIcon,
} from 'lucide-react';
import { HeroBannerSettings } from './HeroBannerSettings';
import { UserDashboard } from './UserDashboard';

export const AdminDashboard: React.FC = () => {
  const {
    models,
    addModel,
    updateModel,
    updateModelRates,
    updateModelSelf,
    togglePauseModel,
    toggleVipModel,
    deleteModel,
    themeConfig,
    updateThemeConfig,
    currentUser,
    isSuperAdmin,
    isModelUser,
    currentModelProfile,
    reviewIdentityVerification,
    submitIdentityVerification,
    availableCities,
    addCity,
    removeCity,
    registeredUsers,
    activateUserAccount,
    rejectUserAccount,
    updateCurrentUserProfile,
    updateStreamConfig,
    setActiveTab: setGlobalActiveTab,
    showToast,
  } = useApp();

  // STRICT ACCESS SECURITY: Non-superadmins must never access the global admin dashboard
  if (!isSuperAdmin) {
    return <UserDashboard />;
  }

  const [activeTab, setActiveTab] = useState<'modelos' | 'promotoras' | 'clientes' | 'stream' | 'activaciones' | 'ciudades' | 'verificaciones' | 'estilos' | 'privacidad' | 'cabecera'>('modelos');

  // Stream Configuration state (Super Admin live HTML embed)
  const [streamHtml, setStreamHtml] = useState<string>(themeConfig.streamConfig?.embedHtml || '');
  const [streamTitle, setStreamTitle] = useState<string>(themeConfig.streamConfig?.streamTitle || 'Backstage en Vivo & Transmisión Oficial');
  const [streamPlatform, setStreamPlatform] = useState<string>(themeConfig.streamConfig?.platformName || 'TikTok Live');
  const [streamHost, setStreamHost] = useState<string>(themeConfig.streamConfig?.hostName || 'Daniela Ospina');
  const [streamIsLive, setStreamIsLive] = useState<boolean>(themeConfig.streamConfig?.isLive ?? true);
  const [clientTypeFilter, setClientTypeFilter] = useState<'all' | 'empresa' | 'particular'>('all');

  // Rates editing modal state (Super Admin only)
  const [rateEditModel, setRateEditModel] = useState<ModelProfile | null>(null);
  const [newHourlyRate, setNewHourlyRate] = useState<number>(50);
  const [newDailyRate, setNewDailyRate] = useState<number>(350);

  // Model creation / editing state
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isVip, setIsVip] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [category, setCategory] = useState<CategoryType>('promotora');
  const [roleLabel, setRoleLabel] = useState('Promotora VIP & Eventos');
  const [city, setCity] = useState(availableCities[0] || 'Caracas');
  const [age, setAge] = useState<number>(24);
  const [pastExperienceText, setPastExperienceText] = useState<string>('');
  const [hourlyRate, setHourlyRate] = useState(50);
  const [dailyRate, setDailyRate] = useState(350);
  const [height, setHeight] = useState('1.76 m');
  const [bust, setBust] = useState('90 cm');
  const [waist, setWaist] = useState('60 cm');
  const [hips, setHips] = useState('90 cm');
  const [eyeColor, setEyeColor] = useState('Marrones');
  const [hairColor, setHairColor] = useState('Castaño');
  const [languages, setLanguages] = useState('Español, Inglés');
  const [bio, setBio] = useState('');
  const [whatsapp, setWhatsapp] = useState('+584121234567');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  // City management state
  const [newCityInput, setNewCityInput] = useState<string>('');
  
  // Real MediaKit fields
  const [igHandle, setIgHandle] = useState('@modelo.vzla');
  const [igUrl, setIgUrl] = useState('https://instagram.com');
  const [igFollowers, setIgFollowers] = useState('150K');
  const [igEngagement, setIgEngagement] = useState('5.0%');
  const [igPostCaption, setIgPostCaption] = useState('Evento oficial en Caracas ✨');
  const [igPostUrl, setIgPostUrl] = useState('https://instagram.com');
  
  const [tiktokHandle, setTiktokHandle] = useState('@modelo_vzla');
  const [tiktokUrl, setTiktokUrl] = useState('https://tiktok.com');
  const [tiktokFollowers, setTiktokFollowers] = useState('250K');
  const [tiktokLikes, setTiktokLikes] = useState('3.5M');
  const [tiktokVideoTitle, setTiktokVideoTitle] = useState('Backstage pasarela Venezuela 👠');
  const [tiktokVideoUrl, setTiktokVideoUrl] = useState('https://tiktok.com');

  // Identity Verification Document Fields
  const [docType, setDocType] = useState<'Cédula de Identidad' | 'Pasaporte'>('Cédula de Identidad');
  const [docNumber, setDocNumber] = useState('');
  const [docPhotoUrl, setDocPhotoUrl] = useState('');

  // Device file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleDocDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setDocPhotoUrl(reader.result as string);
      showToast('Foto del documento cargada.');
    };
    reader.readAsDataURL(file);
  };

  // Determine which models are visible in this dashboard
  // Super Admin sees ALL models.
  // A Model user sees ONLY her own model profile!
  const visibleModels = isSuperAdmin
    ? models
    : models.filter((m) => m.id === currentModelProfile?.id || m.ownerEmail === currentUser?.email);

  const modelsOnly = visibleModels.filter((m) => m.category !== 'promotora');
  const promotorasOnly = visibleModels.filter((m) => m.category === 'promotora');
  const clientUsers = registeredUsers.filter(
    (u) =>
      u.role === 'client' ||
      u.role === 'empresa' ||
      u.requestedRole === 'client' ||
      u.requestedRole === 'empresa'
  );

  // Device Avatar Upload
  const handleAvatarDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setAvatarUrl(base64);
      setGalleryUrls((prev) => [base64, ...prev]);
      showToast('Foto cargada desde tu dispositivo.');
    };
    reader.readAsDataURL(file);
  };

  // Device Gallery Photo Upload
  const handleGalleryDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setGalleryUrls((prev) => [base64, ...prev]);
      showToast('Nueva foto añadida a la galería desde tu dispositivo.');
    };
    reader.readAsDataURL(file);
  };

  const handleOpenRateEditor = (model: ModelProfile) => {
    if (!isSuperAdmin) {
      showToast('Solo el Super Admin puede editar tarifas.');
      return;
    }
    setRateEditModel(model);
    setNewHourlyRate(model.hourlyRate);
    setNewDailyRate(model.dailyRate);
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rateEditModel) return;
    updateModelRates(rateEditModel.id, newHourlyRate, newDailyRate);
    setRateEditModel(null);
  };

  const startEditModel = (model: ModelProfile) => {
    // Permission: Super Admin or the model herself
    if (!isSuperAdmin && currentModelProfile?.id !== model.id) {
      showToast('Solo puedes editar tu propia información.');
      return;
    }

    setEditingModelId(model.id);
    setName(model.name);
    setOwnerEmail(model.ownerEmail || '');
    setCategory(model.category);
    setRoleLabel(model.roleLabel);
    setCity(model.location.city);
    setAge(model.age || 24);
    setPastExperienceText(model.pastExperience ? model.pastExperience.join('\n') : '');
    setHourlyRate(model.hourlyRate);
    setDailyRate(model.dailyRate);
    setHeight(model.physical.height);
    setBust(model.physical.bust || '90 cm');
    setWaist(model.physical.waist || '60 cm');
    setHips(model.physical.hips || '90 cm');
    setEyeColor(model.physical.eyeColor);
    setHairColor(model.physical.hairColor);
    setLanguages(model.languages.join(', '));
    setBio(model.bio);
    setWhatsapp(model.whatsappNumber);
    setAvatarUrl(model.avatar);
    setGalleryUrls(model.gallery || []);

    // Social & MediaKit
    setIgHandle(model.socialMedia.instagram.handle);
    setIgUrl(model.socialMedia.instagram.url);
    setIgFollowers(model.socialMedia.instagram.followers);
    setIgEngagement(model.socialMedia.instagram.engagement);
    setIgPostCaption(model.socialMedia.instagram.posts[0]?.caption || '');
    setIgPostUrl(model.socialMedia.instagram.posts[0]?.url || 'https://instagram.com');

    setTiktokHandle(model.socialMedia.tiktok.handle);
    setTiktokUrl(model.socialMedia.tiktok.url);
    setTiktokFollowers(model.socialMedia.tiktok.followers);
    setTiktokLikes(model.socialMedia.tiktok.likes);
    setTiktokVideoTitle(model.socialMedia.tiktok.videos[0]?.title || '');
    setTiktokVideoUrl(model.socialMedia.tiktok.videos[0]?.url || 'https://tiktok.com');

    // Identity Document
    setDocType(model.identityVerification?.documentType || 'Cédula de Identidad');
    setDocNumber(model.identityVerification?.documentNumber || '');
    setDocPhotoUrl(model.identityVerification?.documentPhotoUrl || '');
    // VIP Membership
    setIsVip(!!model.isVip);

    setShowAddModal(true);
  };

  const handleSaveModel = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultAvatar =
      avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

    const categoryNames: Record<CategoryType, string> = {
      promotora: 'Promotora VIP & Eventos',
      pasarela: 'Modelo de Pasarela & Fashion',
      fotografia: 'Modelo Fotográfica & Publicidad',
      hostess: 'Hostess Protocolar VIP',
      streaming: 'Streaming & Creadora',
    };

    const updatedSocial = {
      instagram: {
        handle: igHandle,
        followers: igFollowers,
        engagement: igEngagement,
        url: igUrl.startsWith('http') ? igUrl : `https://${igUrl}`,
        posts: [
          {
            id: `ig_${Date.now()}`,
            image: defaultAvatar,
            caption: igPostCaption || 'Producción oficial @difusion.agency',
            likes: '8.5K',
            comments: '320',
            type: 'post' as const,
            url: igPostUrl.startsWith('http') ? igPostUrl : `https://${igPostUrl}`,
          },
        ],
      },
      tiktok: {
        handle: tiktokHandle,
        followers: tiktokFollowers,
        likes: tiktokLikes,
        url: tiktokUrl.startsWith('http') ? tiktokUrl : `https://${tiktokUrl}`,
        videos: [
          {
            id: `tt_${Date.now()}`,
            thumbnail: defaultAvatar,
            title: tiktokVideoTitle || 'Detrás de cámaras del evento ✨',
            views: '540K',
            likes: '62K',
            url: tiktokVideoUrl.startsWith('http') ? tiktokVideoUrl : `https://${tiktokVideoUrl}`,
          },
        ],
      },
    };

    const parsedPastExperience = pastExperienceText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingModelId) {
      updateModelSelf(editingModelId, {
        name,
        ownerEmail: isSuperAdmin ? ownerEmail : undefined,
        category,
        categoryLabel: categoryNames[category],
        roleLabel,
        isVip: isSuperAdmin ? isVip : undefined,
        age: Number(age) || 24,
        pastExperience: parsedPastExperience,
        location: {
          city,
          state: 'Venezuela',
          country: 'Venezuela',
          availableToTravel: true,
        },
        avatar: defaultAvatar,
        gallery: galleryUrls.length > 0 ? galleryUrls : [defaultAvatar],
        physical: {
          height,
          bust,
          waist,
          hips,
          eyeColor,
          hairColor,
        },
        languages: languages.split(',').map((l) => l.trim()),
        bio,
        whatsappNumber: whatsapp,
        socialMedia: updatedSocial,
      });
    } else {
      if (!isSuperAdmin) {
        showToast('Solo el Super Admin puede crear nuevas modelos.');
        return;
      }

      addModel({
        ownerEmail,
        name,
        stageName: name.split(' ')[0] + ' ' + (name.split(' ')[1]?.[0] || '') + '.',
        category,
        categoryLabel: categoryNames[category],
        roleLabel,
        verified: true,
        featured: false,
        isVip: isVip,
        isPaused: false,
        hourlyRate: Number(hourlyRate),
        dailyRate: Number(dailyRate),
        age: Number(age) || 24,
        pastExperience: parsedPastExperience,
        location: {
          city,
          state: 'Venezuela',
          country: 'Venezuela',
          availableToTravel: true,
        },
        avatar: defaultAvatar,
        gallery: galleryUrls.length > 0 ? galleryUrls : [defaultAvatar],
        physical: {
          height,
          bust,
          waist,
          hips,
          eyeColor,
          hairColor,
        },
        languages: languages.split(',').map((l) => l.trim()),
        bio: bio || 'Promotora y modelo profesional con amplia trayectoria en eventos en Venezuela.',
        socialMedia: updatedSocial,
        ratingsBreakdown: {
          punctuality: 5.0,
          professionalism: 5.0,
          presence: 5.0,
          charisma: 5.0,
        },
        whatsappNumber: whatsapp,
        status: 'activa',
      });
    }

    setShowAddModal(false);
    setEditingModelId(null);
  };

  const resetForm = () => {
    setEditingModelId(null);
    setName('');
    setOwnerEmail('');
    setCategory('promotora');
    setRoleLabel('Promotora VIP & Eventos');
    setCity(availableCities[0] || 'Caracas');
    setAge(24);
    setPastExperienceText('');
    setHourlyRate(50);
    setDailyRate(350);
    setHeight('1.76 m');
    setBust('90 cm');
    setWaist('60 cm');
    setHips('90 cm');
    setEyeColor('Marrones');
    setHairColor('Castaño');
    setLanguages('Español, Inglés');
    setBio('');
    setWhatsapp('+584121234567');
    setAvatarUrl('');
    setGalleryUrls([]);
    setIgHandle('@modelo.vzla');
    setIgUrl('https://instagram.com');
    setIgFollowers('150K');
    setIgEngagement('5.0%');
    setIgPostCaption('Evento oficial en Caracas ✨');
    setIgPostUrl('https://instagram.com');
    setTiktokHandle('@modelo_vzla');
    setTiktokUrl('https://tiktok.com');
    setTiktokFollowers('250K');
    setTiktokLikes('3.5M');
    setTiktokVideoTitle('Backstage en Venezuela 👠');
    setTiktokVideoUrl('https://tiktok.com');
    setDocType('Cédula de Identidad');
    setDocNumber('');
    setDocPhotoUrl('');
    setIsVip(false);
  };

  // Strict RBAC Guard:
  // "todo tipo de modificaciones sera realizada por el super admin los usuarios normales pueden ver sus propios datos y modificar sus propios datos de usuario no del panel administrador ok"
  if (!isSuperAdmin && !isModelUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Panel de Administración Restringido</h2>
        <p className="text-zinc-400 text-xs mb-6 max-w-md mx-auto">
          Todas las modificaciones administrativas (ciudades, tarifas oficiales y activación de cuentas) son realizadas exclusivamente por el Super Admin Oficial. Como usuario, puedes consultar y editar tus datos personales desde tu propio panel.
        </p>
        <button
          onClick={() => setGlobalActiveTab('dashboard')}
          className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs hover:opacity-90 shadow-md transition-all"
        >
          Ir a Mi Panel de Usuario
        </button>
      </div>
    );
  }

  const standbyCount = registeredUsers.filter((u) => u.status === 'standby').length;

  return (
    <div className="py-8 bg-black min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {isSuperAdmin ? 'Panel de Control Super Admin' : 'Panel de Modelo · Mi Perfil'}
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Sesión activa: <strong className="text-[var(--color-primary)]">{currentUser?.email}</strong>
              {isSuperAdmin ? (
                <span className="ml-2 px-2 py-0.5 rounded bg-[var(--color-primary)] text-black font-bold text-[10px]">
                  SUPER ADMIN VENEZUELA
                </span>
              ) : (
                <span className="ml-2 px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold text-[10px]">
                  MODELO AUTORIZADA
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-black text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Modelo Venezuela</span>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('modelos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'modelos'
                ? 'bg-[var(--color-primary)] text-black font-bold'
                : 'bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>
              {isSuperAdmin ? `Gestión de Modelos (${modelsOnly.length})` : 'Mi Información & MediaKit'}
            </span>
          </button>

          {isSuperAdmin && (
            <>
              {/* Promotoras Management Tab */}
              <button
                onClick={() => setActiveTab('promotoras')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'promotoras'
                    ? 'bg-[var(--color-primary)] text-black font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Gestión de Promotoras ({promotorasOnly.length})</span>
              </button>

              {/* Clientes & Empresas Management Tab */}
              <button
                onClick={() => setActiveTab('clientes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'clientes'
                    ? 'bg-[var(--color-primary)] text-black font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Gestión de Clientes & Empresas ({clientUsers.length})</span>
              </button>

              {/* Live Stream HTML Embed Configuration Tab */}
              <button
                onClick={() => setActiveTab('stream')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'stream'
                    ? 'bg-[var(--color-primary)] text-black font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>Panel En Vivo (HTML Embed)</span>
              </button>

              {/* Standby Accounts Activation Tab */}
              <button
                onClick={() => setActiveTab('activaciones')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'activaciones'
                    ? 'bg-[var(--color-primary)] text-black font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Cuentas en Standby</span>
                {standbyCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-bold text-[10px] animate-pulse">
                    {standbyCount}
                  </span>
                )}
              </button>

              {/* City Management Tab */}
              <button
                onClick={() => setActiveTab('ciudades')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'ciudades'
                    ? 'bg-[var(--color-primary)] text-black font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Gestión de Ciudades ({availableCities.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('verificaciones')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'verificaciones'
                    ? 'bg-[var(--color-primary)] text-black font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>Verificación de Cédulas</span>
                {models.filter((m) => m.identityVerification?.status === 'pendiente').length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-bold text-[10px]">
                    {models.filter((m) => m.identityVerification?.status === 'pendiente').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('estilos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'estilos'
                    ? 'bg-[var(--color-primary)] text-black font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Colores & Fuentes Personalizables</span>
              </button>

              <button
                onClick={() => setActiveTab('cabecera')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'cabecera'
                    ? 'bg-[var(--color-primary)] text-black font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Fondo de Cabecera (Marca de Agua)</span>
              </button>

              <button
                onClick={() => setActiveTab('privacidad')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'privacidad'
                    ? 'bg-[var(--color-primary)] text-black font-bold'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Privacidad & Permisos 2FA</span>
              </button>
            </>
          )}
        </div>

        {/* TAB 1: GESTIÓN DE MODELOS (PASARELA, FOTOGRAFÍA, HOSTESS, STREAMING) */}
        {activeTab === 'modelos' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--color-primary)]" />
                  Modelos de Pasarela, Fotografía & Hostess ({modelsOnly.length})
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Gestión de modelos editoriales, desfiles de moda y producción audiovisual en Venezuela.
                </p>
              </div>
              {isSuperAdmin && (
                <button
                  onClick={() => {
                    resetForm();
                    setCategory('pasarela');
                    setRoleLabel('Modelo de Pasarela & Fashion');
                    setShowAddModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Nueva Modelo</span>
                </button>
              )}
            </div>

            {/* Notice for models */}
            {!isSuperAdmin && (
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3 text-xs">
                <AlertCircle className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Privacidad y Protección de Datos</div>
                  <p className="text-zinc-400 mt-0.5">
                    Como modelo registrada, solo puedes editar tu propia información y MediaKit. Las tarifas oficiales son fijadas por la Administración Oficial.
                  </p>
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900/90 text-zinc-400 font-semibold border-b border-zinc-800 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Modelo</th>
                    <th className="p-4">Ciudad (Venezuela)</th>
                    <th className="p-4">Tarifa / Hora</th>
                    <th className="p-4 text-center">Membresía VIP (Top Catálogo)</th>
                    <th className="p-4">Estado en Catálogo</th>
                    <th className="p-4">MediaKit Conectado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {modelsOnly.map((model) => (
                    <tr key={model.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={model.avatar}
                          alt={model.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{model.name}</span>
                            {model.isPaused && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-amber-950 text-amber-400 border border-amber-800 rounded">
                                Pausada
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500">{model.roleLabel}</div>
                          {model.ownerEmail && (
                            <div className="text-[10px] text-zinc-500 font-mono">
                              {model.ownerEmail}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-zinc-300">
                          <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          <span>{model.location.city}, Venezuela</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-white tabular-nums">
                        ${model.hourlyRate} USD
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleOpenRateEditor(model)}
                            className="ml-2 p-1 text-[10px] text-[var(--color-primary)] hover:underline"
                            title="Editar tarifa (Super Admin)"
                          >
                            Editar
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {isSuperAdmin ? (
                          <button
                            onClick={() => toggleVipModel(model.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              model.isVip
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black border border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.35)] active:scale-95'
                                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
                            }`}
                            title="Toca para activar o desactivar la membresía VIP (Coloca de primera en el catálogo)"
                          >
                            <Crown className={`w-3.5 h-3.5 ${model.isVip ? 'text-black fill-black' : 'text-zinc-500'}`} />
                            <span>{model.isVip ? '⭐ VIP Activo' : 'Hacer VIP'}</span>
                          </button>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              model.isVip
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : 'text-zinc-500'
                            }`}
                          >
                            {model.isVip ? '⭐ VIP' : 'Estándar'}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => togglePauseModel(model.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            model.isPaused
                              ? 'bg-amber-950 text-amber-400 border border-amber-800 hover:bg-amber-900'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                          }`}
                        >
                          {model.isPaused ? (
                            <>
                              <PlayCircle className="w-3.5 h-3.5" />
                              <span>Pausada (Oculta)</span>
                            </>
                          ) : (
                            <>
                              <PauseCircle className="w-3.5 h-3.5" />
                              <span>Activa (Visible)</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Instagram className="w-3.5 h-3.5 text-pink-400" />
                            {model.socialMedia?.instagram?.followers || '120K'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Video className="w-3.5 h-3.5 text-cyan-400" />
                            {model.socialMedia?.tiktok?.likes || '2.5M'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => startEditModel(model)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          <span>Editar</span>
                        </button>
                        {isSuperAdmin && (
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar permanentemente a ${model.name}?`)) {
                                deleteModel(model.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: GESTIÓN DE PROMOTORAS (EVENTOS & ACTIVACIONES) */}
        {activeTab === 'promotoras' && isSuperAdmin && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[var(--color-primary)]" />
                  Promotoras VIP & Protocolo para Eventos ({promotorasOnly.length})
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Coordinación de promotoras para congresos, salones comerciales, exposiciones y activaciones de marca.
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setCategory('promotora');
                  setRoleLabel('Promotora VIP & Eventos');
                  setShowAddModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nueva Promotora</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900/90 text-zinc-400 font-semibold border-b border-zinc-800 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Promotora</th>
                    <th className="p-4">Ciudad (Venezuela)</th>
                    <th className="p-4">Tarifa / Hora</th>
                    <th className="p-4 text-center">Membresía VIP (Top Catálogo)</th>
                    <th className="p-4">Estado en Catálogo</th>
                    <th className="p-4">MediaKit Conectado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {promotorasOnly.map((model) => (
                    <tr key={model.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={model.avatar}
                          alt={model.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{model.name}</span>
                            {model.isPaused && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-amber-950 text-amber-400 border border-amber-800 rounded">
                                Pausada
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500">{model.roleLabel}</div>
                          {model.ownerEmail && (
                            <div className="text-[10px] text-zinc-500 font-mono">
                              {model.ownerEmail}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-zinc-300">
                          <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          <span>{model.location.city}, Venezuela</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-white tabular-nums">
                        ${model.hourlyRate} USD
                        <button
                          onClick={() => handleOpenRateEditor(model)}
                          className="ml-2 p-1 text-[10px] text-[var(--color-primary)] hover:underline"
                          title="Editar tarifa (Super Admin)"
                        >
                          Editar
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleVipModel(model.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            model.isVip
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black border border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.35)] active:scale-95'
                              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
                          }`}
                          title="Toca para activar o desactivar la membresía VIP"
                        >
                          <Crown className={`w-3.5 h-3.5 ${model.isVip ? 'text-black fill-black' : 'text-zinc-500'}`} />
                          <span>{model.isVip ? '⭐ VIP Activo' : 'Hacer VIP'}</span>
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => togglePauseModel(model.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            model.isPaused
                              ? 'bg-amber-950 text-amber-400 border border-amber-800 hover:bg-amber-900'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                          }`}
                        >
                          {model.isPaused ? (
                            <>
                              <PlayCircle className="w-3.5 h-3.5" />
                              <span>Pausada (Oculta)</span>
                            </>
                          ) : (
                            <>
                              <PauseCircle className="w-3.5 h-3.5" />
                              <span>Activa (Visible)</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Instagram className="w-3.5 h-3.5 text-pink-400" />
                            {model.socialMedia?.instagram?.followers || '150K'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Video className="w-3.5 h-3.5 text-cyan-400" />
                            {model.socialMedia?.tiktok?.likes || '3.2M'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => startEditModel(model)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar permanentemente a ${model.name}?`)) {
                              deleteModel(model.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GESTIÓN DE CLIENTES & EMPRESAS */}
        {activeTab === 'clientes' && isSuperAdmin && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-[var(--color-primary)]" />
                  Gestión de Clientes & Empresas Registradas ({clientUsers.length})
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Control de cuentas particulares y perfiles corporativos autorizados para contratar y publicar convocatorias.
                </p>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setClientTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    clientTypeFilter === 'all'
                      ? 'bg-[var(--color-primary)] text-black font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  Todos ({clientUsers.length})
                </button>
                <button
                  onClick={() => setClientTypeFilter('empresa')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    clientTypeFilter === 'empresa'
                      ? 'bg-blue-500 text-white font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  Empresas C.A. ({clientUsers.filter((u) => u.role === 'empresa' || u.clientType === 'empresa').length})
                </button>
                <button
                  onClick={() => setClientTypeFilter('particular')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    clientTypeFilter === 'particular'
                      ? 'bg-zinc-700 text-white font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  Particulares ({clientUsers.filter((u) => u.role === 'client' && u.clientType !== 'empresa').length})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900/90 text-zinc-400 font-semibold border-b border-zinc-800 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Cliente / Razón Social</th>
                    <th className="p-4">Tipo de Cuenta</th>
                    <th className="p-4">Contacto</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones Super Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {clientUsers
                    .filter((u) => {
                      if (clientTypeFilter === 'empresa') {
                        return u.role === 'empresa' || u.clientType === 'empresa';
                      }
                      if (clientTypeFilter === 'particular') {
                        return u.role === 'client' && u.clientType !== 'empresa';
                      }
                      return true;
                    })
                    .map((client) => {
                      const isCompany = client.role === 'empresa' || client.clientType === 'empresa';
                      return (
                        <tr key={client.id} className="hover:bg-zinc-900/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={client.avatar}
                              alt={client.name}
                              className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700"
                            />
                            <div>
                              <div className="font-bold text-white text-sm">{client.name}</div>
                              {client.companyName && (
                                <div className="text-xs text-[var(--color-primary)] font-medium">
                                  {client.companyName} {client.companyRif ? `· RIF: ${client.companyRif}` : ''}
                                </div>
                              )}
                              <div className="text-[10px] text-zinc-500 font-mono">{client.email}</div>
                            </div>
                          </td>

                          <td className="p-4">
                            {isCompany ? (
                              <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 font-bold border border-blue-500/30 text-[11px] inline-flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                Empresa (Autorizada p/ Convocatorias)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 font-medium text-[11px]">
                                Cliente Particular
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-zinc-300">
                            <div>{client.phone || 'No registrado'}</div>
                            <div className="text-[10px] text-zinc-500">{client.createdAt || 'Registrado'}</div>
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                client.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : client.status === 'standby'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
                              }`}
                            >
                              {client.status === 'active'
                                ? '✓ Activa'
                                : client.status === 'standby'
                                ? '⏳ Standby'
                                : 'Suspendida'}
                            </span>
                          </td>

                          <td className="p-4 text-right space-x-2">
                            {client.status !== 'active' ? (
                              <button
                                onClick={() => activateUserAccount(client.id, isCompany ? 'empresa' : 'client')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                              >
                                Activar Cuenta
                              </button>
                            ) : (
                              <button
                                onClick={() => rejectUserAccount(client.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 text-xs font-semibold transition-colors"
                              >
                                Suspender
                              </button>
                            )}

                            {/* Toggle between Empresa and Particular */}
                            <button
                              onClick={() => {
                                activateUserAccount(client.id, isCompany ? 'client' : 'empresa');
                                showToast(`Rol de ${client.name} actualizado a ${isCompany ? 'Cliente Particular' : 'Empresa'}.`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                              title="Alternar entre Cliente Particular y Empresa"
                            >
                              {isCompany ? 'Convertir a Particular' : 'Convertir a Empresa'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PANEL EN VIVO (HTML EMBED DE STREAM) */}
        {activeTab === 'stream' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Tv className="w-5 h-5 text-[var(--color-primary)]" />
                    Configuración del Stream en Vivo (HTML Embed)
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Incrusta directamente código HTML o iframe de <strong>TikTok Live</strong>, <strong>YouTube Live</strong>, <strong>Twitch</strong>, <strong>Kick</strong> o etiqueta de video HTML5.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      streamIsLive
                        ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${streamIsLive ? 'bg-red-500 animate-pulse' : 'bg-zinc-500'}`} />
                    {streamIsLive ? 'TRANSMISIÓN EN VIVO' : 'TRANSMISIÓN EN PAUSA'}
                  </span>
                </div>
              </div>

              {/* Form to update Stream Config */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateStreamConfig({
                    embedHtml: streamHtml,
                    streamTitle,
                    platformName: streamPlatform,
                    hostName: streamHost,
                    isLive: streamIsLive,
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Code className="w-4 h-4 text-[var(--color-primary)]" />
                      Código HTML del Stream / Embed iframe
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setStreamHtml(
                          `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_bqQ5yA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
                        )
                      }
                      className="text-[11px] text-[var(--color-primary)] hover:underline"
                    >
                      Cargar plantilla de ejemplo
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={streamHtml}
                    onChange={(e) => setStreamHtml(e.target.value)}
                    placeholder='Pega aquí el código HTML: <iframe src="https://..." ...></iframe> o <video src="..." autoplay controls></video>'
                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl font-mono text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-primary)]"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Si dejas este campo vacío, la plataforma utilizará el simulador oficial de transmisión con staff de DIFUSION.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Título de la Transmisión</label>
                    <input
                      type="text"
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Nombre de Plataforma</label>
                    <input
                      type="text"
                      value={streamPlatform}
                      onChange={(e) => setStreamPlatform(e.target.value)}
                      placeholder="TikTok Live / YouTube Live / Twitch"
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Host / Presentadora</label>
                    <input
                      type="text"
                      value={streamHost}
                      onChange={(e) => setStreamHost(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      checked={streamIsLive}
                      onChange={(e) => setStreamIsLive(e.target.checked)}
                      className="w-4 h-4 accent-[var(--color-primary)] rounded"
                    />
                    <span>Marcar emisión como <strong>EN VIVO</strong> en la página principal</span>
                  </label>
                </div>

                {/* Live Preview Window */}
                <div className="pt-4 border-t border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Vista Previa del Reproductor
                  </h4>
                  <div className="relative aspect-video max-w-2xl rounded-2xl overflow-hidden bg-black border border-zinc-800 flex items-center justify-center">
                    {streamHtml ? (
                      <div
                        className="w-full h-full flex items-center justify-center [&>iframe]:w-full [&>iframe]:h-full [&>video]:w-full [&>video]:h-full"
                        dangerouslySetInnerHTML={{ __html: streamHtml }}
                      />
                    ) : (
                      <div className="text-center p-6 text-zinc-500 text-xs">
                        <Tv className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <div>No hay código HTML configurado.</div>
                        <div className="text-[11px] text-zinc-600 mt-0.5">Se mostrará el reproductor oficial predeterminado de DIFUSION.</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs hover:opacity-90 transition-all shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar y Publicar en DIFUSION Live</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB ACTIVACIONES: GESTIÓN DE CUENTAS EN STANDBY (SUPER ADMIN) */}
        {activeTab === 'activaciones' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[var(--color-primary)]" />
                    Activación de Cuentas en Standby
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Los usuarios registrados por Correo o Google quedan en standby hasta que el Super Admin active su cuenta y confirme su rol (Cliente, Empresa o Promotora/Modelo).
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{registeredUsers.filter((u) => u.status === 'standby').length} pendientes de activación</span>
                </div>
              </div>

              {registeredUsers.filter((u) => u.status === 'standby').length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  No hay cuentas pendientes en standby. Todas las cuentas registradas han sido procesadas.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registeredUsers
                    .filter((u) => u.status === 'standby')
                    .map((user) => (
                      <div
                        key={user.id}
                        className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 space-y-4 shadow-lg"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-xl object-cover ring-1 ring-zinc-700"
                            />
                            <div>
                              <div className="font-bold text-white text-sm">{user.name}</div>
                              <div className="text-xs text-zinc-400 font-mono">{user.email}</div>
                              {user.phone && (
                                <div className="text-[11px] text-zinc-500">{user.phone}</div>
                              )}
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Standby
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800 text-xs space-y-2">
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Rol Elegido por el Usuario:</span>
                            {user.requestedRole === 'model' ? (
                              <span className="font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] flex items-center gap-1">
                                <span>👠</span>
                                <span>Promotora / Modelo</span>
                              </span>
                            ) : user.requestedRole === 'empresa' || user.clientType === 'empresa' ? (
                              <span className="font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] flex items-center gap-1">
                                <span>🏢</span>
                                <span>Empresa / Corporativo</span>
                              </span>
                            ) : (
                              <span className="font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] flex items-center gap-1">
                                <span>👤</span>
                                <span>Cliente Particular</span>
                              </span>
                            )}
                          </div>
                          {user.companyName && (
                            <div className="flex items-center justify-between text-zinc-400">
                              <span>Empresa / RIF:</span>
                              <span className="text-zinc-200 font-semibold">{user.companyName} {user.companyRif ? `(${user.companyRif})` : ''}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Fecha de Solicitud:</span>
                            <span className="text-zinc-400">{user.createdAt || 'Hoy'}</span>
                          </div>
                        </div>

                        {/* Direct Approval Actions (Admin confirms or alters role) */}
                        <div className="pt-2 border-t border-zinc-800 space-y-2">
                          <div className="text-[11px] text-zinc-400 font-medium">
                            Aprobar y conceder acceso al catálogo como:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => activateUserAccount(user.id, 'client')}
                              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md ${
                                user.requestedRole === 'client' || (!user.requestedRole && user.role === 'client')
                                  ? 'bg-[var(--color-primary)] text-black ring-2 ring-[var(--color-primary)]/40 hover:brightness-110'
                                  : 'bg-zinc-850 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                              }`}
                            >
                              ✓ Como Cliente
                            </button>
                            <button
                              onClick={() => activateUserAccount(user.id, 'empresa')}
                              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md ${
                                user.requestedRole === 'empresa'
                                  ? 'bg-blue-500 text-white ring-2 ring-blue-500/40 hover:bg-blue-400'
                                  : 'bg-zinc-850 hover:bg-blue-950 text-zinc-200 border border-zinc-700'
                              }`}
                            >
                              ✓ Como Empresa
                            </button>
                            <button
                              onClick={() => activateUserAccount(user.id, 'model')}
                              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md ${
                                user.requestedRole === 'model'
                                  ? 'bg-purple-600 text-white ring-2 ring-purple-500/40 hover:bg-purple-500'
                                  : 'bg-zinc-850 hover:bg-purple-950 text-zinc-200 border border-zinc-700'
                              }`}
                            >
                              ✓ Como Promotora
                            </button>
                            <button
                              onClick={() => rejectUserAccount(user.id)}
                              className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 text-xs font-semibold transition-colors border border-zinc-800"
                            >
                              Rechazar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* List of Suspended Accounts / Standby por Suspensión */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-red-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    Cuentas Suspendidas / Standby por Suspensión ({registeredUsers.filter(u => u.status === 'suspended').length})
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Usuarios bloqueados que no pueden ingresar al catálogo ni navegar por la web hasta que el Super Admin apruebe su reactivación.
                  </p>
                </div>
              </div>

              {registeredUsers.filter((u) => u.status === 'suspended').length === 0 ? (
                <div className="p-4 text-center rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-500">
                  No hay cuentas suspendidas en el sistema.
                </div>
              ) : (
                <div className="space-y-3">
                  {registeredUsers
                    .filter((u) => u.status === 'suspended')
                    .map((u) => (
                      <div
                        key={u.id}
                        className="p-4 rounded-xl bg-zinc-900 border border-red-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-red-500/40"
                          />
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                              <span>{u.name}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-950 text-red-300 border border-red-800">
                                Suspendida
                              </span>
                            </div>
                            <div className="text-xs text-zinc-400 font-mono">{u.email}</div>
                            {u.phone && <div className="text-[11px] text-zinc-500">{u.phone}</div>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-zinc-400 font-medium mr-1">Reactivar como:</span>
                          <button
                            onClick={() => activateUserAccount(u.id, 'client')}
                            className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-black text-xs font-bold hover:brightness-110 transition-all shadow-sm"
                          >
                            ✓ Cliente
                          </button>
                          <button
                            onClick={() => activateUserAccount(u.id, 'empresa')}
                            className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-400 transition-all shadow-sm"
                          >
                            ✓ Empresa
                          </button>
                          <button
                            onClick={() => activateUserAccount(u.id, 'model')}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-all shadow-sm"
                          >
                            ✓ Promotora
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* List of Already Active Users */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl">
              <h4 className="text-sm font-bold text-white mb-3">Usuarios Activos en DIFUSION ({registeredUsers.filter(u => u.status === 'active').length})</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Usuario</th>
                      <th className="p-3">Rol Oficial</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Activado Por</th>
                      <th className="p-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {registeredUsers
                      .filter((u) => u.status === 'active' && u.role !== 'superadmin' && u.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase())
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-zinc-900/50">
                          <td className="p-3 flex items-center gap-2.5">
                            <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-700" />
                            <div>
                              <div className="font-bold text-white">{u.name}</div>
                              <div className="text-[11px] text-zinc-500 font-mono">{u.email}</div>
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-white uppercase text-[11px]">
                            {u.role === 'superadmin' ? 'Super Admin' : u.role === 'model' ? 'Promotora / Modelo' : u.role === 'empresa' ? 'Empresa' : 'Cliente'}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Activa
                            </span>
                          </td>
                          <td className="p-3 text-zinc-400 font-mono text-[11px]">{u.activatedBy || 'Sistema'}</td>
                          <td className="p-3 text-right">
                            {u.role !== 'superadmin' && (
                              <div className="flex items-center justify-end gap-2">
                                <select
                                  aria-label="Cambiar Rol"
                                  value={u.role}
                                  onChange={(e) => activateUserAccount(u.id, e.target.value as any)}
                                  className="text-[11px] bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-zinc-300 font-semibold focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                                  title="Solo el Super Admin puede cambiar el rol"
                                >
                                  <option value="client">Cliente</option>
                                  <option value="empresa">Empresa</option>
                                  <option value="model">Promotora / Modelo</option>
                                </select>
                                <button
                                  onClick={() => rejectUserAccount(u.id)}
                                  className="text-[11px] px-2.5 py-1 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 font-semibold border border-red-900/50 transition-colors"
                                  title="Suspender cuenta"
                                >
                                  Suspender
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CIUDADES: GESTIÓN DE CIUDADES EN VENEZUELA (SUPER ADMIN) */}
        {activeTab === 'ciudades' && isSuperAdmin && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-5">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[var(--color-primary)]" />
                  Gestión de Ciudades de Venezuela
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Agrega o quita ciudades del catálogo nacional. Las ciudades registradas aquí aparecen automáticamente en los filtros de búsqueda y al crear o editar perfiles de modelos.
                </p>
              </div>

              {/* Add City Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newCityInput.trim()) {
                    addCity(newCityInput);
                    setNewCityInput('');
                  }
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={newCityInput}
                    onChange={(e) => setNewCityInput(e.target.value)}
                    placeholder="Escribe el nombre de la ciudad venezolana (Ej. Mérida, Puerto La Cruz, San Cristóbal)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-black border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold hover:opacity-90 shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Ciudad</span>
                </button>
              </form>

              {/* Quick Suggestion Chips */}
              <div>
                <span className="text-[11px] text-zinc-500 block mb-2 font-medium">Sugerencias rápidas para agregar:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Mérida',
                    'Puerto La Cruz',
                    'Cumaná',
                    'Maturín',
                    'San Cristóbal',
                    'Ciudad Bolívar',
                    'Acarigua',
                    'Punto Fijo',
                    'Los Teques',
                  ].map((cand) => (
                    <button
                      key={cand}
                      type="button"
                      disabled={availableCities.includes(cand)}
                      onClick={() => addCity(cand)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                        availableCities.includes(cand)
                          ? 'bg-zinc-900 text-zinc-600 border border-zinc-850 cursor-not-allowed'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[var(--color-primary)]'
                      }`}
                    >
                      + {cand}
                    </button>
                  ))}
                </div>
              </div>

              {/* List of Active Cities */}
              <div className="pt-4 border-t border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Ciudades Activas en Catálogo ({availableCities.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {availableCities.map((cityName) => {
                    const count = models.filter(
                      (m) => m.location.city.toLowerCase() === cityName.toLowerCase()
                    ).length;
                    return (
                      <div
                        key={cityName}
                        className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-3 group hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-white">{cityName}</div>
                            <div className="text-[10px] text-zinc-500">
                              {count} {count === 1 ? 'modelo registrada' : 'modelos registradas'}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`¿Eliminar la ciudad "${cityName}" del catálogo?`)) {
                              removeCity(cityName);
                            }
                          }}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                          title={`Eliminar ${cityName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PERSONALIZACIÓN VISUAL (SUPER ADMIN) */}
        {activeTab === 'estilos' && isSuperAdmin && (
          <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Personalización Visual de la Plataforma
              </h3>
              <p className="text-xs text-zinc-400">
                Ajusta en tiempo real los colores fosforescentes de la marca y la tipografía de DIFUSION Venezuela.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-3">
                Color de Acento Neón:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Verde Fosforescente', hex: '#39ff14' },
                  { name: 'Cyan Neón', hex: '#00e5ff' },
                  { name: 'Rosa Cyberpunk', hex: '#ff007f' },
                  { name: 'Oro Solar VIP', hex: '#ffd700' },
                ].map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => updateThemeConfig({ primaryColor: color.hex })}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all ${
                      themeConfig.primaryColor === color.hex
                        ? 'border-white bg-zinc-800 text-white shadow-lg'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full ring-2 ring-black"
                      style={{ background: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Tipografía de la Plataforma:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Outfit', 'Plus Jakarta Sans', 'Montserrat', 'Urbanist'].map((font) => (
                  <button
                    key={font}
                    type="button"
                    onClick={() => updateThemeConfig({ fontFamily: font })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      themeConfig.fontFamily === font
                        ? 'border-[var(--color-primary)] bg-zinc-900 text-white'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">WhatsApp Agencia (Venezuela)</label>
                <input
                  type="text"
                  value={themeConfig.agencyPhone}
                  onChange={(e) => updateThemeConfig({ agencyPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Email de Coordinación</label>
                <input
                  type="email"
                  value={themeConfig.agencyEmail}
                  onChange={(e) => updateThemeConfig({ agencyEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <ImageIcon className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Fondo de Cabecera (Video / Imagen en Marca de Agua)</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Configura el video o imágenes que se alternan detrás del título principal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('cabecera')}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-black font-bold text-xs hover:brightness-110 transition-all shrink-0"
              >
                Configurar Fondo →
              </button>
            </div>
          </div>
        )}

        {/* TAB: FONDO DE CABECERA (MARCA DE AGUA, VIDEO / SLIDESHOW) */}
        {activeTab === 'cabecera' && isSuperAdmin && (
          <div className="max-w-4xl mx-auto">
            <HeroBannerSettings />
          </div>
        )}

        {/* TAB 3: PRIVACIDAD Y SEGURIDAD 2FA (SUPER ADMIN) */}
        {activeTab === 'privacidad' && isSuperAdmin && (
          <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Seguridad, Roles & Permisos 2FA
              </h3>
              <p className="text-xs text-zinc-400">
                Garantiza la integridad de los datos de todas las modelos de Venezuela registradas.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Lock className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Autenticación de Dos Factores (2FA)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Solicita código de seguridad de 4 o 6 dígitos en accesos administrativos.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={themeConfig.privacy.twoFactorRequiredForAdmin}
                  onChange={(e) =>
                    updateThemeConfig({
                      privacy: {
                        ...themeConfig.privacy,
                        twoFactorRequiredForAdmin: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-lime-400 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[var(--color-primary)]" />
                  Jerarquía de Permisos
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  • <strong>Super Admin ({currentUser?.email}):</strong> Control de tarifas oficiales, creación/eliminación de perfiles, pausa global y estilos.<br />
                  • <strong>Modelos:</strong> Cada modelo puede modificar únicamente sus medidas, biografía, fotos de galería y redes sociales. No puede alterar tarifas ni perfiles de otras compañeras.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VERIFICACIONES DE IDENTIDAD OFICIAL (SUPER ADMIN) */}
        {activeTab === 'verificaciones' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
                  Validación de Cédulas y Pasaportes Oficiales (Venezuela)
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Valida las fotos y números de documento para asignar el Sello de Verificado oficial en el catálogo público.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
                {models.filter((m) => m.identityVerification?.status === 'pendiente').length} Pendientes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {models.map((model) => {
                const status = model.identityVerification?.status || (model.verified ? 'verificado' : 'sin_verificar');
                return (
                  <div
                    key={model.id}
                    className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-4 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={model.avatar}
                          alt={model.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-zinc-700"
                        />
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                            <span>{model.name}</span>
                            {status === 'verificado' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--color-primary)] text-black">
                                VERIFICADO ✓
                              </span>
                            )}
                            {status === 'pendiente' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-black">
                                EN REVISIÓN ⏳
                              </span>
                            )}
                            {status === 'rechazado' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                                RECHAZADO
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            {model.location.city} · {model.ownerEmail || 'Sin email vinculado'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>Tipo de Documento:</span>
                        <span className="text-white font-medium">
                          {model.identityVerification?.documentType || 'Cédula de Identidad'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>Número de Documento:</span>
                        <span className="text-white font-mono font-bold">
                          {model.identityVerification?.documentNumber || 'Pendiente de registrar'}
                        </span>
                      </div>
                    </div>

                    {/* Photo preview of ID */}
                    {model.identityVerification?.documentPhotoUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-black/60 max-h-44 flex items-center justify-center p-1">
                        <img
                          src={model.identityVerification.documentPhotoUrl}
                          alt="Cédula / Pasaporte"
                          className="w-full h-40 object-contain rounded-lg"
                        />
                        <span className="absolute bottom-2 right-2 text-[10px] bg-black/85 text-zinc-300 px-2 py-0.5 rounded font-mono">
                          Documento cargado desde dispositivo
                        </span>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-zinc-800 text-center text-xs text-zinc-500">
                        La modelo aún no ha cargado foto de su documento.
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                      {status !== 'verificado' ? (
                        <button
                          onClick={() => reviewIdentityVerification(model.id, true)}
                          className="flex-1 py-2 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-black text-xs font-bold transition-all shadow-md"
                        >
                          ✓ Aprobar y Otorgar Sello
                        </button>
                      ) : (
                        <button
                          onClick={() => reviewIdentityVerification(model.id, false, 'Revocado por administración')}
                          className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-medium transition-colors"
                        >
                          Revocar Sello Verificado
                        </button>
                      )}
                      {status === 'pendiente' && (
                        <button
                          onClick={() => reviewIdentityVerification(model.id, false, 'Documento poco nítido o no legible')}
                          className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 text-xs font-semibold transition-colors"
                        >
                          Rechazar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL 1: EDITAR TARIFAS (SUPER ADMIN ONLY) */}
        {rateEditModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[var(--color-primary)]" />
                Modificar Tarifas Oficiales (Super Admin)
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Ajusta las tarifas para <strong>{rateEditModel.name}</strong> en Venezuela.
              </p>

              <form onSubmit={handleSaveRates} className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Tarifa por Hora (USD)</label>
                  <input
                    type="number"
                    required
                    value={newHourlyRate}
                    onChange={(e) => setNewHourlyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Tarifa Jornada Completa 8h (USD)</label>
                  <input
                    type="number"
                    required
                    value={newDailyRate}
                    onChange={(e) => setNewDailyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setRateEditModel(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold hover:opacity-90"
                  >
                    Guardar Tarifas Oficiales
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: CREACIÓN / EDICIÓN COMPLETA DE PERFIL CON SUBIDA DE FOTOS Y MEDIAKIT INTEGRADO */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 relative max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingModelId
                      ? isSuperAdmin
                        ? `Editar Perfil de Modelo: ${name}`
                        : `Editar Mi Información Personal: ${name}`
                      : 'Añadir Nueva Modelo de Venezuela'}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Subida de imágenes desde tu dispositivo y vinculación directa de Instagram y TikTok.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveModel} className="space-y-6">
                
                {/* VIP MEMBERSHIP STATUS (SUPER ADMIN ONLY) */}
                {isSuperAdmin && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <Crown className="w-5 h-5 fill-amber-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                          <span>Membresía VIP Pagada</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black uppercase tracking-wider">
                            Prioridad #1 en Catálogo
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-200/80 mt-0.5 leading-relaxed">
                          Perfiles que han pagado su membresía VIP: destacan de primero en la tabla principal del catálogo público con corona dorada.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={isVip}
                        onChange={(e) => setIsVip(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                    </label>
                  </div>
                )}

                {/* SECTION 1: DATOS BÁSICOS & UBICACIÓN EN VENEZUELA */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-3">
                    1. Datos Personales & Ciudad en Venezuela
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Valeria Rivas"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Ciudad en Venezuela</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                      >
                        {availableCities.map((c) => (
                          <option key={c} value={c} className="bg-zinc-900">
                            {c}, Venezuela
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Edad (Años)</label>
                      <input
                        type="number"
                        min={18}
                        max={60}
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        placeholder="Ej. 24"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>

                    {isSuperAdmin && (
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Correo Google de la Modelo (Para que ella edite su perfil)
                        </label>
                        <input
                          type="email"
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          placeholder="modelo.vzla@gmail.com"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Categoría Principal</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none"
                      >
                        <option value="promotora">Promotora VIP & Eventos</option>
                        <option value="pasarela">Modelo de Pasarela & Fashion</option>
                        <option value="fotografia">Modelo Fotográfica & Publicidad</option>
                        <option value="hostess">Hostess Protocolar VIP</option>
                        <option value="streaming">Streaming & Live Host</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Especialidad / Título</label>
                      <input
                        type="text"
                        value={roleLabel}
                        onChange={(e) => setRoleLabel(e.target.value)}
                        placeholder="Ej. Brand Ambassador Automotriz"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">WhatsApp de Contacto Directo</label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+58 412 123 4567"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* TARIFAS (SUPER ADMIN vs MODEL NOTICE) */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[var(--color-primary)]" />
                      Tarifas en Dólares (USD)
                    </span>
                    {!isSuperAdmin && (
                      <span className="text-[10px] text-amber-400 font-semibold">
                        🔒 Tarifas fijadas por Super Admin
                      </span>
                    )}
                  </div>

                  {isSuperAdmin ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Tarifa por Hora (USD)</label>
                        <input
                          type="number"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-xl text-xs font-bold text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Tarifa Jornada 8h (USD)</label>
                        <input
                          type="number"
                          value={dailyRate}
                          onChange={(e) => setDailyRate(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-xl text-xs font-bold text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-300">
                      Tarifa actual asignada: <strong>${hourlyRate} USD/hora</strong> (${dailyRate} USD/jornada). Para solicitar un cambio de tarifa, contacta a la administración.
                    </div>
                  )}
                </div>

                {/* SECTION 2: SUBIDA DE FOTOS DESDE EL DISPOSITIVO (Directamente en la edición de perfiles) */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    2. Subida de Imágenes desde tu Dispositivo (Cámara o Galería)
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Sube fotos de alta calidad para el avatar y la galería del perfil. Se guardan inmediatamente.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Avatar Upload */}
                    <div className="p-3 rounded-xl bg-black border border-zinc-800 text-center">
                      <span className="text-xs font-semibold text-white block mb-2">Foto de Avatar</span>
                      {avatarUrl ? (
                        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 ring-2 ring-[var(--color-primary)]">
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-2 text-zinc-500">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white inline-flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        <span>Subir desde dispositivo</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={handleAvatarDeviceUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Gallery Photos Upload */}
                    <div className="p-3 rounded-xl bg-black border border-zinc-800 text-center">
                      <span className="text-xs font-semibold text-white block mb-2">
                        Galería ({galleryUrls.length} fotos)
                      </span>
                      <div className="flex justify-center gap-1 mb-2 overflow-x-auto py-1">
                        {galleryUrls.slice(0, 4).map((url, i) => (
                          <img key={i} src={url} alt="Gal" className="w-10 h-10 rounded-lg object-cover ring-1 ring-zinc-700" />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        <span>Añadir foto a galería</span>
                      </button>
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleGalleryDeviceUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: MEDIAKIT & CONEXIÓN CON REDES SOCIALES REALES (INSTAGRAM Y TIKTOK) */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    3. Conexión Real con Redes Sociales (Instagram & TikTok)
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Introduce los enlaces reales de los perfiles y publicaciones destacadas para que los clientes puedan verificarlos en vivo.
                  </p>

                  {/* Instagram real connection */}
                  <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400">
                      <Instagram className="w-4 h-4" />
                      <span>Instagram Real</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-zinc-400">Usuario de Instagram (@)</label>
                        <input
                          type="text"
                          value={igHandle}
                          onChange={(e) => setIgHandle(e.target.value)}
                          placeholder="@tu_usuario"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-400">Enlace Real al Perfil de Instagram</label>
                        <input
                          type="url"
                          value={igUrl}
                          onChange={(e) => setIgUrl(e.target.value)}
                          placeholder="https://instagram.com/tu_usuario"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-400">Seguidores en Instagram</label>
                        <input
                          type="text"
                          value={igFollowers}
                          onChange={(e) => setIgFollowers(e.target.value)}
                          placeholder="Ej. 185K"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-400">Tasa de Engagement (%)</label>
                        <input
                          type="text"
                          value={igEngagement}
                          onChange={(e) => setIgEngagement(e.target.value)}
                          placeholder="Ej. 5.4%"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[10px] text-zinc-400">Enlace a Publicación / Reel Destacado de Instagram</label>
                        <input
                          type="url"
                          value={igPostUrl}
                          onChange={(e) => setIgPostUrl(e.target.value)}
                          placeholder="https://instagram.com/p/..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* TikTok real connection */}
                  <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                      <Video className="w-4 h-4" />
                      <span>TikTok Real</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-zinc-400">Usuario de TikTok (@)</label>
                        <input
                          type="text"
                          value={tiktokHandle}
                          onChange={(e) => setTiktokHandle(e.target.value)}
                          placeholder="@tu_usuario_tiktok"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-400">Enlace Real al Perfil de TikTok</label>
                        <input
                          type="url"
                          value={tiktokUrl}
                          onChange={(e) => setTiktokUrl(e.target.value)}
                          placeholder="https://tiktok.com/@tu_usuario"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-400">Seguidores TikTok</label>
                        <input
                          type="text"
                          value={tiktokFollowers}
                          onChange={(e) => setTiktokFollowers(e.target.value)}
                          placeholder="Ej. 350K"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-400">Total Likes Acumulados</label>
                        <input
                          type="text"
                          value={tiktokLikes}
                          onChange={(e) => setTiktokLikes(e.target.value)}
                          placeholder="Ej. 4.8M"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[10px] text-zinc-400">Enlace a Video Viral de TikTok</label>
                        <input
                          type="url"
                          value={tiktokVideoUrl}
                          onChange={(e) => setTiktokVideoUrl(e.target.value)}
                          placeholder="https://tiktok.com/@tu_usuario/video/..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* SECTION 4: VERIFICACIÓN OFICIAL DE IDENTIDAD (CÉDULA / PASAPORTE) */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4" />
                      4. Verificación de Identidad Oficial (Cédula de Identidad / Pasaporte)
                    </h4>
                    {docPhotoUrl && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Documento Adjunto ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Sube una foto clara de tu documento oficial venezolano. Una vez validado por el Super Admin, recibirás el sello de verificado en el catálogo.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Tipo de Documento</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-xl text-xs text-white"
                      >
                        <option value="Cédula de Identidad">Cédula de Identidad (Venezuela)</option>
                        <option value="Pasaporte">Pasaporte Oficial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Número de Documento</label>
                      <input
                        type="text"
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value)}
                        placeholder="Ej. V-26.789.123"
                        className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Foto de la Cédula / Pasaporte (Cámara o Archivo del Dispositivo)
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => docInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white text-xs font-semibold inline-flex items-center gap-2 border border-zinc-700 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-[var(--color-primary)]" />
                        <span>{docPhotoUrl ? 'Cambiar Foto de Cédula' : 'Cargar Cédula / Pasaporte'}</span>
                      </button>
                      <input
                        ref={docInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleDocDeviceUpload}
                        className="hidden"
                      />
                      {docPhotoUrl && (
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          ✓ Foto lista
                        </span>
                      )}
                    </div>
                  </div>

                  {docPhotoUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-black max-h-36 flex items-center justify-center p-1">
                      <img src={docPhotoUrl} alt="Vista previa documento" className="h-32 object-contain" />
                    </div>
                  )}
                </div>

                {/* SECTION 5: MEDIDAS FÍSICAS & BIOGRAFÍA */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                    5. Ficha Técnica & Trayectoria
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Estatura</label>
                      <input
                        type="text"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="1.77 m"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Busto</label>
                      <input
                        type="text"
                        value={bust}
                        onChange={(e) => setBust(e.target.value)}
                        placeholder="90 cm"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Cintura</label>
                      <input
                        type="text"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        placeholder="60 cm"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Cadera</label>
                      <input
                        type="text"
                        value={hips}
                        onChange={(e) => setHips(e.target.value)}
                        placeholder="91 cm"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Biografía y Trayectoria</label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Trayectoria en ferias comerciales, congresos y campañas..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 flex items-center justify-between">
                      <span>Trabajos Anteriores / Marcas & Eventos (1 por línea)</span>
                      <span className="text-[10px] text-[var(--color-primary)]">Experiencia previa</span>
                    </label>
                    <textarea
                      rows={3}
                      value={pastExperienceText}
                      onChange={(e) => setPastExperienceText(e.target.value)}
                      placeholder="AutoShow Las Mercedes 2024 (Hostess Principal)&#10;Expo Fedecámaras 2023 (Promotora VIP)&#10;Lanzamiento Ron Santa Teresa Gran Reserva"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white resize-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold hover:opacity-90 shadow-md active:scale-95"
                  >
                    {editingModelId ? 'Guardar Cambios' : 'Publicar Perfil en Venezuela'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
