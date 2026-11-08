import React, { useState, useEffect, useRef } from 'react';
import { ModelProfile, InstagramPost } from '../types';
import { useApp } from '../context/AppContext';
import {
  fetchInstagramDataFromApi,
  extractInstagramShortcode,
  buildInstagramEmbedUrl,
} from '../services/instagramService';
import {
  X,
  Star,
  MapPin,
  ShieldCheck,
  Instagram,
  Video,
  Heart,
  MessageCircle,
  ExternalLink,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PauseCircle,
  PlayCircle,
  Edit,
  Briefcase,
  AlertCircle,
  Crown,
  Ruler,
  Globe,
  Award,
  Maximize2,
  ZoomIn,
  Upload,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  RefreshCw,
  Key,
  Check,
  Info,
} from 'lucide-react';

interface ModelDetailModalProps {
  model: ModelProfile;
  onClose: () => void;
  onOpenReview: (model: ModelProfile) => void;
}

export const ModelDetailModal: React.FC<ModelDetailModalProps> = ({
  model,
  onClose,
  onOpenReview,
}) => {
  const {
    reviews,
    currentUser,
    setActiveChatModel,
    generateWhatsAppUrl,
    isSuperAdmin,
    currentModelProfile,
    togglePauseModel,
    updateModelSelf,
    availableCities,
    setActiveTab: setAppActiveTab,
    showToast,
  } = useApp();

  const galleryList = model.gallery && model.gallery.length > 0 ? model.gallery : [model.avatar];
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Photo Upload & Max 10 limits state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState<boolean>(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');

  const isModelOwner = currentModelProfile?.id === model.id;
  const isModelVerified = !!(model.verified || model.identityVerification?.status === 'verificado');
  const isAccountActive = currentUser?.status === 'active';

  // Strict ownership and verification rule:
  // Models can ONLY upload photos and edit their profile if:
  // 1. It is HER OWN profile (currentModelProfile?.id === model.id)
  // 2. She is officially verified by the Super Admin
  // 3. Her account is active (not standby)
  const canEditThisModel = isSuperAdmin || (isModelOwner && isModelVerified && isAccountActive);

  // Standby users cannot inspect model details until approved by Super Admin
  if (currentUser?.status === 'standby') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <div className="w-full max-w-md rounded-3xl bg-zinc-950 border-2 border-amber-500/40 p-6 sm:p-8 text-center shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Acceso a Perfiles Restringido</h3>
          <p className="text-xs text-zinc-300 mb-6 leading-relaxed">
            Tu cuenta se encuentra en revisión oficial. Por políticas de seguridad y protección de las modelos en Venezuela, debes esperar a ser <strong>aprobado por el Super Admin</strong> para visualizar los perfiles y el MediaKit completo.
          </p>
          <button
            onClick={() => {
              onClose();
              setAppActiveTab('dashboard');
            }}
            className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs shadow-md"
          >
            Ir a Mi Panel de Usuario
          </button>
        </div>
      </div>
    );
  }

  // City change handler
  const handleCityChange = (newCity: string) => {
    if (!canEditThisModel) {
      showToast('Acción denegada: Tu perfil debe estar aprobado y verificado para cambiar la ciudad.');
      return;
    }
    updateModelSelf(model.id, {
      location: {
        ...model.location,
        city: newCity,
      },
    });
    showToast(`✓ Ciudad actualizada a ${newCity}.`);
  };

  // Upload Photo File (Max 10)
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEditThisModel) {
      showToast('Acción denegada: Solo modelos verificadas pueden subir fotos a su catálogo.');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    if (galleryList.length >= 10) {
      showToast('Límite alcanzado: máximo 10 fotos por perfil.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('La imagen es muy pesada (máx 8MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const newGallery = [...galleryList, dataUrl];
        updateModelSelf(model.id, { gallery: newGallery });
        showToast(`✓ Nueva foto añadida al book (${newGallery.length}/10).`);
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  // Add Photo by URL (Max 10)
  const handleAddPhotoByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditThisModel) {
      showToast('Acción denegada: Solo modelos verificadas pueden subir fotos a su catálogo.');
      return;
    }
    if (!customPhotoUrl.trim()) return;

    if (galleryList.length >= 10) {
      showToast('Límite alcanzado: máximo 10 fotos por perfil.');
      return;
    }

    const newGallery = [...galleryList, customPhotoUrl.trim()];
    updateModelSelf(model.id, { gallery: newGallery });
    setCustomPhotoUrl('');
    setShowAddPhotoModal(false);
    showToast(`✓ Foto añadida con éxito (${newGallery.length}/10).`);
  };

  // Delete Photo
  const handleDeletePhoto = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEditThisModel) {
      showToast('Acción denegada: No tienes permiso para eliminar fotos de este perfil.');
      return;
    }
    if (galleryList.length <= 1) {
      showToast('El perfil debe conservar al menos 1 foto en su book.');
      return;
    }

    const newGallery = galleryList.filter((_, idx) => idx !== indexToDelete);
    updateModelSelf(model.id, { gallery: newGallery });
    showToast('Foto eliminada del book.');
  };

  // Keyboard navigation for Lightbox popup (Esc, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, galleryList.length]);

  // Quick MediaKit & Instagram API state
  const [isEditingMediaKit, setIsEditingMediaKit] = useState(false);
  const [mediaKitTab, setMediaKitTab] = useState<'api' | 'url' | 'manual'>('api');
  const [igAccessToken, setIgAccessToken] = useState('');
  const [isSyncingInstagram, setIsSyncingInstagram] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);

  // Single post by URL state
  const [singlePostUrl, setSinglePostUrl] = useState('');
  const [singlePostCaption, setSinglePostCaption] = useState('');
  const [singlePostImage, setSinglePostImage] = useState('');

  // Manual inputs
  const [editIgHandle, setEditIgHandle] = useState(model.socialMedia?.instagram?.handle || '@modelo');
  const [editIgUrl, setEditIgUrl] = useState(model.socialMedia?.instagram?.url || 'https://instagram.com');
  const [editIgFollowers, setEditIgFollowers] = useState(model.socialMedia?.instagram?.followers || '120K');
  const [editIgEngagement, setEditIgEngagement] = useState(model.socialMedia?.instagram?.engagement || '5.2%');
  const [editTiktokUrl, setEditTiktokUrl] = useState(model.socialMedia?.tiktok?.url || 'https://tiktok.com');
  const [editTiktokFollowers, setEditTiktokFollowers] = useState(model.socialMedia?.tiktok?.followers || '240K');
  const [editTiktokLikes, setEditTiktokLikes] = useState(model.socialMedia?.tiktok?.likes || '2.8M');

  // Sync with official Meta Instagram Graph API
  const handleSyncInstagramApi = async () => {
    if (!igAccessToken.trim()) {
      showToast('Por favor ingresa un Access Token de Instagram Graph API.');
      return;
    }

    setIsSyncingInstagram(true);
    setSyncStatusMessage('Consultando a Meta / Instagram Graph API...');

    const result = await fetchInstagramDataFromApi(igAccessToken);

    setIsSyncingInstagram(false);

    if (result.success) {
      const updatedInstagram = {
        ...model.socialMedia.instagram,
        handle: result.profile?.username ? `@${result.profile.username}` : (editIgHandle || model.socialMedia.instagram.handle),
        url: result.profile?.username ? `https://instagram.com/${result.profile.username}` : (editIgUrl || model.socialMedia.instagram.url),
        posts: result.posts.length > 0 ? result.posts : model.socialMedia.instagram.posts,
      };

      updateModelSelf(model.id, {
        socialMedia: {
          ...model.socialMedia,
          instagram: updatedInstagram,
        },
      });

      setSyncStatusMessage(
        `✓ ¡Sincronización exitosa con Meta! Se importaron ${result.posts.length} publicaciones reales de @${
          result.profile?.username || 'instagram'
        }.`
      );
      showToast(`✓ Publicaciones reales sincronizadas desde Instagram.`);
    } else {
      setSyncStatusMessage(`Error de Meta: ${result.error || 'Token no válido o expirado.'}`);
      showToast('Error al conectar con Instagram Graph API.');
    }
  };

  // Add single post by URL
  const handleAddSingleInstagramPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singlePostUrl.trim()) {
      showToast('Por favor ingresa la URL de la publicación de Instagram.');
      return;
    }

    const shortcode = extractInstagramShortcode(singlePostUrl);
    const newPost: InstagramPost = {
      id: shortcode || `post_${Date.now()}`,
      url: singlePostUrl.trim(),
      caption: singlePostCaption.trim() || 'Publicación oficial en Instagram',
      image: singlePostImage.trim() || model.avatar,
      likes: '1.4K',
      comments: '62',
      type: singlePostUrl.includes('/reel/') ? 'reel' : 'post',
    };

    const updatedPosts = [newPost, ...(model.socialMedia.instagram.posts || [])];

    updateModelSelf(model.id, {
      socialMedia: {
        ...model.socialMedia,
        instagram: {
          ...model.socialMedia.instagram,
          posts: updatedPosts,
        },
      },
    });

    setSinglePostUrl('');
    setSinglePostCaption('');
    setSinglePostImage('');
    showToast('✓ Publicación de Instagram añadida al perfil.');
  };

  // Quote Calculator state
  const [eventDate, setEventDate] = useState<string>('2026-05-20');
  const [hoursCount, setHoursCount] = useState<number>(8);
  const [eventName, setEventName] = useState<string>('Exhibición & Activación de Marca');

  const calculatedTotal = hoursCount * model.hourlyRate;
  const modelReviews = reviews.filter((r) => r.modelId === model.id);

  const handleSaveMediaKit = (e: React.FormEvent) => {
    e.preventDefault();
    updateModelSelf(model.id, {
      socialMedia: {
        ...model.socialMedia,
        instagram: {
          ...model.socialMedia.instagram,
          handle: editIgHandle,
          url: editIgUrl,
          followers: editIgFollowers,
          engagement: editIgEngagement,
        },
        tiktok: {
          ...model.socialMedia.tiktok,
          url: editTiktokUrl,
          followers: editTiktokFollowers,
          likes: editTiktokLikes,
        },
      },
    });
    setIsEditingMediaKit(false);
    showToast('MediaKit y redes actualizados.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Paused profile banner */}
        {model.isPaused && (
          <div className="p-3 bg-amber-950/80 border-b border-amber-800 text-amber-300 text-xs flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <PauseCircle className="w-4 h-4 text-amber-400" />
              Este perfil está actualmente <strong>PAUSADO</strong> y oculto del catálogo público.
            </span>
            {canEditThisModel && (
              <button
                onClick={() => togglePauseModel(model.id)}
                className="px-2.5 py-1 rounded bg-amber-400 text-black font-bold text-[11px] hover:bg-amber-300 transition-colors"
              >
                Reactivar en Catálogo
              </button>
            )}
          </div>
        )}

        {/* Unverified Model Owner Notice */}
        {isModelOwner && !isModelVerified && (
          <div className="p-3.5 bg-amber-500/15 border-b border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                <strong>Perfil pendiente de verificación:</strong> Para poder subir tus fotos (máx 10) y editar tu book, debes verificar tu documento oficial (Cédula o Pasaporte) y ser aprobada por el Super Admin.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                setAppActiveTab('dashboard');
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors shrink-0 whitespace-nowrap self-start sm:self-center"
            >
              Verificar en Mi Panel →
            </button>
          </div>
        )}

        {/* Hidden File Input for Photo Uploads (Max 10) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoFileUpload}
        />

        {/* Modal Sticky Header with Quick Actions & Model City Selector */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={model.avatar}
              alt={model.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--color-primary)] shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white leading-tight truncate">
                  {model.name}
                </h2>
                {model.isVip && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-black bg-gradient-to-r from-amber-400 to-yellow-300 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                    <Crown className="w-3 h-3 fill-black" />
                    VIP
                  </span>
                )}
                {model.identityVerification?.status === 'verificado' || model.verified ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/15 px-2 py-0.5 rounded-full border border-[var(--color-primary)]/40 shadow-[0_0_8px_rgba(57,255,20,0.3)]">
                    <ShieldCheck className="w-3 h-3" />
                    Verificado
                  </span>
                ) : null}
              </div>

              {/* City Selection & Role subtitle */}
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 flex-wrap">
                <span className="text-zinc-300 font-medium">{model.roleLabel}</span>
                <span className="text-zinc-600">·</span>
                {canEditThisModel ? (
                  <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 hover:border-[var(--color-primary)] rounded-lg px-2 py-0.5 transition-colors">
                    <MapPin className="w-3 h-3 text-[var(--color-primary)] shrink-0" />
                    <label htmlFor="header-city-select" className="text-[10px] text-zinc-400 font-semibold uppercase">
                      Ciudad:
                    </label>
                    <select
                      id="header-city-select"
                      value={model.location.city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                      title="Selecciona la ciudad de residencia para aparecer en búsquedas (ej. Maracaibo)"
                    >
                      {availableCities.map((c) => (
                        <option key={c} value={c} className="bg-zinc-900 text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-[var(--color-primary)] font-semibold">🇻🇪</span>
                  </div>
                ) : (
                  <span className="text-zinc-300 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[var(--color-primary)]" />
                    {model.location.city}, Venezuela 🇻🇪
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {canEditThisModel && (
              <button
                onClick={() => togglePauseModel(model.id)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                  model.isPaused
                    ? 'bg-amber-950 border-amber-800 text-amber-300 hover:bg-amber-900'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                }`}
                title={model.isPaused ? 'Reactivar en catálogo' : 'Pausar perfil (ocultar del catálogo)'}
              >
                {model.isPaused ? <PlayCircle className="w-4 h-4 text-amber-400" /> : <PauseCircle className="w-4 h-4" />}
                <span className="hidden sm:inline">{model.isPaused ? 'Reactivar' : 'Pausar'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable OnePage MediaKit Body (NO TABS) */}
        <div className="p-4 sm:p-7 overflow-y-auto space-y-8 flex-1 scroll-smooth">
          
          {/* 1. SECCIÓN PRINCIPAL: BOOK FOTOGRÁFICO VERTICAL COMPACTO (MÁXIMO 10 FOTOS) */}
          <section className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Book Fotográfico Oficial
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono font-bold text-white">
                    {galleryList.length}/10 fotos
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Fotos verticales de alta resolución. Haz clic en cualquier foto para abrirla en pantalla completa / popup.
                </p>
              </div>

              {/* Upload & Management Actions (Max 10) */}
              <div className="flex items-center gap-2 flex-wrap">
                {canEditThisModel && galleryList.length < 10 && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-md"
                      title="Subir foto vertical desde tu dispositivo (máximo 10)"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Foto ({galleryList.length}/10)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddPhotoModal(true)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold transition-colors"
                      title="Agregar foto pegando un enlace URL"
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
                      <span>URL</span>
                    </button>
                  </>
                )}

                {canEditThisModel && galleryList.length >= 10 && (
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2.5 py-1 rounded-xl">
                    Límite máximo alcanzado (10/10)
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setLightboxIndex(0);
                    setIsLightboxOpen(true);
                  }}
                  className="text-xs text-zinc-300 hover:text-[var(--color-primary)] font-semibold flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span className="hidden sm:inline">Ver en Popup</span>
                </button>
              </div>
            </div>

            {/* Compact Vertical Photos Grid (Max 10, aspect-[3/4] portrait cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
              {galleryList.slice(0, 10).map((img, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setLightboxIndex(i);
                    setIsLightboxOpen(true);
                  }}
                  className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-[var(--color-primary)] group cursor-pointer shadow-lg hover:shadow-[0_0_15px_rgba(57,255,20,0.25)] hover:scale-[1.02] transition-all duration-300"
                  title="Haz clic para ver esta foto vertical en popup"
                >
                  <img
                    src={img}
                    alt={`${model.name} foto ${i + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top-left Index Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-zinc-700/70 text-[10px] font-mono font-bold text-white shadow">
                    #{i + 1}
                  </div>

                  {/* Hover Zoom Prompt */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white transition-opacity">
                    <div className="p-2 rounded-full bg-black/80 border border-[var(--color-primary)] text-[var(--color-primary)] shadow-lg">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow">Ver Popup</span>
                  </div>

                  {/* Delete button (only in edit mode and if more than 1 photo) */}
                  {canEditThisModel && galleryList.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDeletePhoto(i, e)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-700/80 transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
                      title="Eliminar esta foto del book"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Bottom Subtitle on card */}
                  <div className="absolute bottom-1.5 left-2 right-2 pointer-events-none">
                    <span className="text-[10px] font-semibold text-zinc-300 truncate block drop-shadow">
                      {i === 0 ? 'Foto de Perfil' : `Book #${i + 1}`}
                    </span>
                  </div>
                </div>
              ))}

              {/* Upload Slot Card in Grid (if edit mode and under 10 photos) */}
              {canEditThisModel && galleryList.length < 10 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] rounded-xl sm:rounded-2xl border-2 border-dashed border-zinc-800 hover:border-[var(--color-primary)] bg-zinc-900/30 hover:bg-zinc-900/80 flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer group shadow-inner"
                  title="Haz clic para subir otra foto vertical (máximo 10)"
                >
                  <div className="p-3 rounded-full bg-zinc-800/80 group-hover:bg-[var(--color-primary)]/20 text-zinc-400 group-hover:text-[var(--color-primary)] transition-all mb-2">
                    <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">
                    + Subir Foto
                  </span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 mt-0.5">
                    Vertical ({galleryList.length}/10)
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* 2. RESUMEN DE IDENTIDAD & MÉTRICAS CLAVE (Zero-Pill Discipline) */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-0.5">Edad Oficial</span>
              <div className="text-base sm:text-lg font-black text-[var(--color-primary)] tabular-nums">
                {model.age ? `${model.age} años` : '24 años'}
              </div>
              <span className="text-[10px] text-zinc-400">Verificada en C.I.</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-0.5">Estatura</span>
              <div className="text-base sm:text-lg font-black text-white tabular-nums">
                {model.physical.height}
              </div>
              <span className="text-[10px] text-zinc-400">Medida Estándar</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-0.5">Tarifa Jornada (8h)</span>
              <div className="text-base sm:text-lg font-black text-white tabular-nums">
                ${model.dailyRate} USD
              </div>
              <span className="text-[10px] text-zinc-400">${model.hourlyRate} USD/hora</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-0.5">Calificación Verificada</span>
              <div className="text-base sm:text-lg font-black text-white tabular-nums flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-[var(--color-primary)] text-[var(--color-primary)]" />
                <span>{model.rating.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-zinc-400">{modelReviews.length} contrataciones</span>
            </div>
          </section>

          {/* 3. BIOGRAFÍA Y PRESENTACIÓN PROFESIONAL */}
          <section className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Biografía & Perfil Profesional
            </h3>
            <p className="text-sm text-zinc-200 leading-relaxed font-normal">
              {model.bio}
            </p>
          </section>

          {/* 4. FICHA TÉCNICA & MEDIDAS OFICIALES */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Ruler className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Ficha Técnica & Medidas Oficiales
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-medium">Busto - Cintura - Cadera</span>
                <div className="text-sm font-bold text-white tabular-nums mt-0.5">
                  {model.physical.bust || '90'} - {model.physical.waist || '60'} - {model.physical.hips || '90'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-medium">Color de Ojos</span>
                <div className="text-sm font-bold text-white mt-0.5">{model.physical.eyeColor}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-medium">Cabello</span>
                <div className="text-sm font-bold text-white mt-0.5">{model.physical.hairColor}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-medium">Calzado</span>
                <div className="text-sm font-bold text-white mt-0.5">{model.physical.shoeSize || '38'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Ciudad Base en Venezuela */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 uppercase font-medium">Ciudad Base (Venezuela)</span>
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                  </div>
                  <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                    <span>{model.location.city}</span>
                    <span className="text-xs text-zinc-400 font-normal">({model.location.state || 'Venezuela'})</span>
                  </div>
                </div>

                {canEditThisModel ? (
                  <div className="mt-2.5 pt-2 border-t border-zinc-800">
                    <label htmlFor="specs-city-select" className="text-[10px] text-zinc-400 block mb-1">
                      Elegir ciudad (ej. Maracaibo):
                    </label>
                    <select
                      id="specs-city-select"
                      value={model.location.city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-700 text-white text-xs font-semibold focus:border-[var(--color-primary)] focus:outline-none cursor-pointer"
                    >
                      {availableCities.map((city) => (
                        <option key={city} value={city} className="bg-zinc-900 text-white">
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="text-[10px] text-zinc-400 mt-2 block">
                    Sede oficial para contrataciones locales en {model.location.city}.
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-medium block">Idiomas</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {model.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-[11px] font-medium text-zinc-200 border border-zinc-700"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-medium block">Disponibilidad de Viaje</span>
                  <div className="text-xs font-semibold text-white mt-1">
                    {model.location.availableToTravel
                      ? 'Nacional e Internacional (Pasaporte Vigente)'
                      : `Únicamente en ${model.location.city}`}
                  </div>
                </div>
                <Globe className="w-5 h-5 text-[var(--color-primary)] shrink-0 ml-2" />
              </div>
            </div>
          </section>

          {/* 5. TRAYECTORIA & TRABAJOS ANTERIORES */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Trayectoria, Marcas & Eventos Anteriores
            </h3>

            {model.pastExperience && model.pastExperience.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {model.pastExperience.map((job, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/90 flex items-start gap-3 hover:border-[var(--color-primary)]/40 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(57,255,20,0.8)]" />
                    <span className="text-xs text-zinc-200 font-medium leading-relaxed">{job}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400 italic">
                Activaciones en ferias comerciales internacionales, desfiles de moda y congresos corporativos en Caracas y el interior del país.
              </div>
            )}
          </section>

          {/* 6. REDES SOCIALES & MEDIAKIT OFICIAL (INSTAGRAM & TIKTOK) */}
          <section className="space-y-5 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  MediaKit Oficial (Instagram & TikTok)
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Métricas de alcance orgánico verificado e impacto digital en campañas de marca.
                </p>
              </div>

              {canEditThisModel && (
                <button
                  onClick={() => setIsEditingMediaKit(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-black text-xs font-bold hover:opacity-90 active:scale-95 transition-transform shrink-0"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Conectar / Editar Redes</span>
                </button>
              )}
            </div>

            {/* MediaKit High-Level Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                <div className="text-[10px] uppercase text-zinc-400 font-semibold mb-1 flex items-center justify-center gap-1">
                  <Instagram className="w-3 h-3 text-pink-400" /> Instagram
                </div>
                <div className="text-lg font-black text-white">
                  {model.socialMedia?.instagram?.followers || '120K'}
                </div>
                <div className="text-[11px] text-zinc-500">Seguidores Orgánicos</div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                <div className="text-[10px] uppercase text-zinc-400 font-semibold mb-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-[var(--color-primary)]" /> Engagement
                </div>
                <div className="text-lg font-black text-[var(--color-primary)]">
                  {model.socialMedia?.instagram?.engagement || '5.2%'}
                </div>
                <div className="text-[11px] text-zinc-500">Tasa de Interacción</div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                <div className="text-[10px] uppercase text-zinc-400 font-semibold mb-1 flex items-center justify-center gap-1">
                  <Video className="w-3 h-3 text-cyan-400" /> TikTok
                </div>
                <div className="text-lg font-black text-white">
                  {model.socialMedia?.tiktok?.followers || '240K'}
                </div>
                <div className="text-[11px] text-zinc-500">Seguidores</div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                <div className="text-[10px] uppercase text-zinc-400 font-semibold mb-1 flex items-center justify-center gap-1">
                  <Heart className="w-3 h-3 text-red-400" /> Total Likes
                </div>
                <div className="text-lg font-black text-white">
                  {model.socialMedia?.tiktok?.likes || '2.8M'}
                </div>
                <div className="text-[11px] text-zinc-500">Me Gusta Totales</div>
              </div>
            </div>

            {/* Instagram Posts Grid */}
            {model.socialMedia?.instagram?.posts && model.socialMedia.instagram.posts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-bold text-white">
                      Publicaciones Destacadas en Instagram ({model.socialMedia.instagram.handle})
                    </span>
                  </div>
                  <a
                    href={model.socialMedia.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline font-semibold"
                  >
                    <span>Abrir Perfil Real</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {model.socialMedia.instagram.posts.map((post) => (
                    <a
                      key={post.id}
                      href={post.url || model.socialMedia.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden hover:border-[var(--color-primary)] transition-all block cursor-pointer"
                    >
                      <div className="relative aspect-square overflow-hidden bg-zinc-900">
                        <img
                          src={post.image}
                          alt="Instagram post"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 rounded bg-black/80 backdrop-blur-sm text-[11px] text-white">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-zinc-300" />
                            {post.comments}
                          </span>
                        </div>
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs text-zinc-300 line-clamp-2">
                          {post.caption}
                        </p>
                        <span className="text-[10px] text-[var(--color-primary)] mt-1 inline-flex items-center gap-0.5">
                          Ver en Instagram <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* TikTok Videos Grid */}
            {model.socialMedia?.tiktok?.videos && model.socialMedia.tiktok.videos.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">
                      Videos Virales en TikTok ({model.socialMedia.tiktok.handle})
                    </span>
                  </div>
                  <a
                    href={model.socialMedia.tiktok.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline font-semibold"
                  >
                    <span>Ver en TikTok Real</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {model.socialMedia.tiktok.videos.map((vid) => (
                    <a
                      key={vid.id}
                      href={vid.url || model.socialMedia.tiktok.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-400 transition-all block cursor-pointer group"
                    >
                      <div className="relative w-20 h-28 rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-black ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between flex-1 py-1">
                        <h5 className="text-xs font-semibold text-white line-clamp-2">
                          {vid.title}
                        </h5>
                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                          <span className="font-bold text-[var(--color-primary)]">
                            {vid.views} vistas
                          </span>
                          <span>{vid.likes} likes</span>
                        </div>
                        <span className="text-[10px] text-cyan-400 inline-flex items-center gap-1">
                          Reproducir en TikTok <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 7. COTIZADOR RÁPIDO & CONTRATACIÓN DIRECTA (RBAC RESTRICTION) */}
          <section className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Cotizador Rápido & Contratación Oficial
              </h3>
              <span className="text-[11px] text-zinc-400">
                Tarifa: ${model.hourlyRate} USD/h
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Tipo de Evento o Marca</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Fecha Estimada</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Horas de Activación</label>
                <select
                  value={hoursCount}
                  onChange={(e) => setHoursCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value={4}>Media Jornada (4 hrs)</option>
                  <option value={6}>6 Horas</option>
                  <option value={8}>Jornada Completa (8 hrs)</option>
                  <option value={12}>Gala Extensa (12 hrs)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-medium">Inversión Total Estimada:</span>
                <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
                  ${calculatedTotal} USD <span className="text-xs font-normal text-zinc-400">({hoursCount} hrs @ ${model.hourlyRate}/h)</span>
                </div>
              </div>

              {/* RBAC Verification: Only authenticated active clients/empresas can message & book */}
              {!currentUser ? (
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                  <span className="text-xs text-zinc-400 text-center sm:text-right">
                    Inicia sesión como <strong>Cliente</strong> o <strong>Empresa</strong> para contratar.
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      setAppActiveTab('login');
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs hover:opacity-90 shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all shrink-0"
                  >
                    Iniciar Sesión / Registro
                  </button>
                </div>
              ) : currentUser.role === 'model' && !isSuperAdmin ? (
                <div className="p-3 rounded-xl bg-zinc-950 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <div>
                    <span className="font-bold">Restricción entre Modelos:</span> Las promotoras no pueden contratarse entre ellas. Solo un perfil registrado como <strong>Cliente</strong> o <strong>Empresa</strong> puede contratar.
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                  <button
                    onClick={() => {
                      onClose();
                      setActiveChatModel(model);
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors min-h-[44px]"
                  >
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <span>Chat Directo de Contratación</span>
                  </button>

                  <a
                    href={generateWhatsAppUrl(
                      model.whatsappNumber,
                      model.name,
                      `${eventName} el ${eventDate} por ${hoursCount} horas ($${calculatedTotal} USD)`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors shadow-lg min-h-[44px]"
                  >
                    <span>WhatsApp Oficial</span>
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* 8. CALIFICACIONES & RESEÑAS VERIFICADAS */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Calificaciones & Reseñas Verificadas ({modelReviews.length})
              </h3>

              <button
                onClick={() => onOpenReview(model)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-[var(--color-primary)] transition-colors active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Dejar Reseña Verificada</span>
              </button>
            </div>

            {/* Score Breakdown Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex flex-col items-center justify-center text-center sm:border-r border-zinc-800 pr-4">
                <span className="text-4xl font-black text-white tabular-nums">
                  {model.rating.toFixed(2)}
                </span>
                <div className="flex items-center gap-1 my-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(model.rating)
                          ? 'text-[var(--color-primary)] fill-[var(--color-primary)]'
                          : 'text-zinc-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-zinc-400">
                  Basado en {modelReviews.length} contrataciones verificadas
                </span>
              </div>

              <div className="col-span-2 space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-zinc-300 font-medium mb-1">
                    <span>Puntualidad en Eventos</span>
                    <span className="tabular-nums font-bold text-white">
                      {(model.ratingsBreakdown?.punctuality || 5.0).toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)]"
                      style={{ width: `${((model.ratingsBreakdown?.punctuality || 5) / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-zinc-300 font-medium mb-1">
                    <span>Profesionalismo & Protocolo</span>
                    <span className="tabular-nums font-bold text-white">
                      {(model.ratingsBreakdown?.professionalism || 5.0).toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)]"
                      style={{ width: `${((model.ratingsBreakdown?.professionalism || 5) / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-zinc-300 font-medium mb-1">
                    <span>Presencia & Imagen</span>
                    <span className="tabular-nums font-bold text-white">
                      {(model.ratingsBreakdown?.presence || 5.0).toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)]"
                      style={{ width: `${((model.ratingsBreakdown?.presence || 5) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {modelReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rev.authorName}</span>
                      <span className="text-xs text-zinc-500">·</span>
                      <span className="text-xs text-[var(--color-primary)] font-semibold">{rev.authorCompany}</span>
                      {rev.verifiedBooking && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Verificado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-white">
                      <Star className="w-3 h-3 fill-[var(--color-primary)] text-[var(--color-primary)]" />
                      <span>{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-400 italic">
                    Evento: "{rev.eventTitle}" · {rev.date}
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* MEDIAKIT & INSTAGRAM GRAPH API INTEGRATION MODAL */}
        {isEditingMediaKit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-xl rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800 p-5 sm:p-7 shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-pink-400" />
                    <span>Conexión con Instagram API & Redes</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Sincroniza publicaciones reales desde Meta / Instagram Graph API para {model.name}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingMediaKit(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-xl mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMediaKitTab('api')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    mediaKitTab === 'api'
                      ? 'bg-[var(--color-primary)] text-black font-bold shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Meta Graph API</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaKitTab('url')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    mediaKitTab === 'url'
                      ? 'bg-[var(--color-primary)] text-black font-bold shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Importar por URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaKitTab('manual')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    mediaKitTab === 'manual'
                      ? 'bg-[var(--color-primary)] text-black font-bold shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Métricas & TikTok</span>
                </button>
              </div>

              {/* TAB 1: INSTAGRAM GRAPH API OFFICIAL SYNC */}
              {mediaKitTab === 'api' && (
                <div className="space-y-4 overflow-y-auto pr-1 text-xs">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-zinc-900 border border-pink-900/50 space-y-2">
                    <div className="font-bold text-pink-300 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span>¿Cómo funciona la API oficial de Instagram?</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Meta exige que la cuenta de Instagram sea <strong>Profesional (Creador o Empresa)</strong>. Con un Token de Acceso de Instagram Graph API, la app consulta directamente los servidores de Meta y descarga las fotos, reels, pie de foto y estadísticas reales.
                    </p>
                    <div className="text-[10px] text-zinc-400 border-t border-pink-900/40 pt-2 flex items-center justify-between flex-wrap gap-2">
                      <span>Genera tu token en: <strong className="text-white">developers.facebook.com</strong> &gt; Graph API Explorer</span>
                      <a
                        href="https://developers.facebook.com/tools/explorer/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        Abrir Meta Explorer <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-200 block">
                      Instagram User Access Token de Meta
                    </label>
                    <textarea
                      rows={3}
                      value={igAccessToken}
                      onChange={(e) => setIgAccessToken(e.target.value)}
                      placeholder="Pega aquí el Token de Acceso (ej. EAA... o IGA...)"
                      className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white font-mono text-[11px] placeholder-zinc-600 focus:outline-none focus:border-[var(--color-primary)]"
                    />
                    <p className="text-[10px] text-zinc-500">
                      Permisos requeridos en Meta: <code className="text-zinc-400">instagram_basic</code>, <code className="text-zinc-400">pages_show_list</code>.
                    </p>
                  </div>

                  {syncStatusMessage && (
                    <div
                      className={`p-3 rounded-xl text-xs border ${
                        syncStatusMessage.startsWith('✓')
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                          : 'bg-red-950/60 border-red-800 text-red-300'
                      }`}
                    >
                      {syncStatusMessage}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      disabled={isSyncingInstagram || !igAccessToken.trim()}
                      onClick={handleSyncInstagramApi}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all shadow-lg cursor-pointer"
                    >
                      {isSyncingInstagram ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Conectando con Meta en vivo...</span>
                        </>
                      ) : (
                        <>
                          <Instagram className="w-4 h-4" />
                          <span>Sincronizar Publicaciones Reales con Instagram Graph API</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: IMPORT SINGLE POST BY URL / REEL */}
              {mediaKitTab === 'url' && (
                <form onSubmit={handleAddSingleInstagramPost} className="space-y-4 overflow-y-auto pr-1 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs">
                    <p className="font-semibold text-white mb-1">Importar post específico por enlace:</p>
                    <p className="text-[11px] text-zinc-400">
                      Pega cualquier enlace público de Instagram (ej. <code className="text-pink-400">https://www.instagram.com/p/...</code> o <code className="text-pink-400">/reel/...</code>) para destacarlo en el MediaKit.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300">Enlace del Post o Reel de Instagram</label>
                    <input
                      type="url"
                      required
                      value={singlePostUrl}
                      onChange={(e) => setSinglePostUrl(e.target.value)}
                      placeholder="https://www.instagram.com/p/DFxyz..."
                      className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300">URL de la Foto / Miniatura (Opcional)</label>
                    <input
                      type="url"
                      value={singlePostImage}
                      onChange={(e) => setSinglePostImage(e.target.value)}
                      placeholder="https://images.unsplash.com/... (si no se proporciona se usará la foto de perfil)"
                      className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300">Pie de Foto / Descripción (Caption)</label>
                    <input
                      type="text"
                      value={singlePostCaption}
                      onChange={(e) => setSinglePostCaption(e.target.value)}
                      placeholder="Campaña oficial de moda y pasarela #Venezuela"
                      className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={!singlePostUrl.trim()}
                      className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      + Añadir a Publicaciones Destacadas
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: MANUAL METRICS & TIKTOK */}
              {mediaKitTab === 'manual' && (
                <form onSubmit={handleSaveMediaKit} className="space-y-4 text-xs overflow-y-auto pr-1">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="font-bold text-pink-400 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5" /> Instagram
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-zinc-400">Usuario (@handle)</label>
                        <input
                          type="text"
                          value={editIgHandle}
                          onChange={(e) => setEditIgHandle(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400">Enlace Perfil Real</label>
                        <input
                          type="url"
                          value={editIgUrl}
                          onChange={(e) => setEditIgUrl(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400">Seguidores</label>
                        <input
                          type="text"
                          value={editIgFollowers}
                          onChange={(e) => setEditIgFollowers(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400">Engagement</label>
                        <input
                          type="text"
                          value={editIgEngagement}
                          onChange={(e) => setEditIgEngagement(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5" /> TikTok
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <label className="text-[10px] text-zinc-400">Enlace Real a Perfil TikTok</label>
                        <input
                          type="url"
                          value={editTiktokUrl}
                          onChange={(e) => setEditTiktokUrl(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400">Seguidores</label>
                        <input
                          type="text"
                          value={editTiktokFollowers}
                          onChange={(e) => setEditTiktokFollowers(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400">Total Likes</label>
                        <input
                          type="text"
                          value={editTiktokLikes}
                          onChange={(e) => setEditTiktokLikes(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setIsEditingMediaKit(false)}
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-black font-bold"
                    >
                      Guardar Estadísticas
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

        {/* ADD PHOTO MODAL (URL or File, Max 10) */}
        {showAddPhotoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddPhotoModal(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[var(--color-primary)]" />
                  <span>Añadir Foto al Book ({galleryList.length}/10)</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-400">
                Puedes subir una foto vertical desde tu dispositivo o pegar un enlace web directo. Máximo 10 fotos por book.
              </p>

              {/* Option 1: File Upload */}
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-white block">Opción 1: Subir Archivo Local</span>
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowAddPhotoModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Upload className="w-4 h-4" />
                  <span>Seleccionar Imagen de tu Dispositivo</span>
                </button>
              </div>

              {/* Option 2: Image URL */}
              <form onSubmit={handleAddPhotoByUrl} className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2.5">
                <span className="text-xs font-bold text-white block">Opción 2: Pegar Enlace URL</span>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="submit"
                  disabled={!customPhotoUrl.trim()}
                  className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Agregar Foto por URL
                </button>
              </form>
            </div>
          </div>
        )}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div
              className="relative max-w-5xl w-full max-h-[95vh] flex flex-col items-center justify-center my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Header Bar */}
              <div className="w-full flex items-center justify-between px-2 py-2 mb-2 text-white">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold">{model.name}</span>
                  <span className="text-xs text-zinc-400">· {model.roleLabel}</span>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[11px] font-mono text-[var(--color-primary)]">
                    Foto {lightboxIndex + 1} de {galleryList.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors shadow-lg"
                    title="Cerrar vista ampliada (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Expanded Image Container */}
              <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-2xl">
                <img
                  src={galleryList[lightboxIndex]}
                  alt={`${model.name} en tamaño completo`}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto max-w-full object-contain select-none"
                />

                {/* Left/Right Floating Navigation Arrows */}
                {galleryList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/75 hover:bg-black text-white border border-zinc-700/80 backdrop-blur-md shadow-2xl transition-transform active:scale-90"
                      title="Anterior (Flecha izquierda)"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/75 hover:bg-black text-white border border-zinc-700/80 backdrop-blur-md shadow-2xl transition-transform active:scale-90"
                      title="Siguiente (Flecha derecha)"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip inside Lightbox */}
              {galleryList.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full py-1 px-2 no-scrollbar">
                  {galleryList.map((thumb, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        lightboxIndex === idx
                          ? 'border-[var(--color-primary)] scale-105 shadow-[0_0_12px_rgba(57,255,20,0.5)] ring-2 ring-[var(--color-primary)]/40'
                          : 'border-zinc-800 opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={thumb} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-zinc-500 mt-2 font-mono text-center">
                Presiona <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300">Esc</kbd> o haz clic fuera para cerrar · Usa ← y → para navegar
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
