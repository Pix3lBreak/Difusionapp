import React, { useState } from 'react';
import { ModelProfile } from '../types';
import { useApp } from '../context/AppContext';
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
  Send,
  Plus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PauseCircle,
  PlayCircle,
  Edit,
  Briefcase,
  Lock,
  AlertCircle,
  Crown,
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
    setActiveTab: setAppActiveTab,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'perfil' | 'galeria' | 'mediakit' | 'resenas'>('perfil');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  
  // Quick MediaKit Editor modal state
  const [isEditingMediaKit, setIsEditingMediaKit] = useState(false);
  const [editIgUrl, setEditIgUrl] = useState(model.socialMedia.instagram.url);
  const [editIgFollowers, setEditIgFollowers] = useState(model.socialMedia.instagram.followers);
  const [editIgEngagement, setEditIgEngagement] = useState(model.socialMedia.instagram.engagement);
  const [editTiktokUrl, setEditTiktokUrl] = useState(model.socialMedia.tiktok.url);
  const [editTiktokFollowers, setEditTiktokFollowers] = useState(model.socialMedia.tiktok.followers);
  const [editTiktokLikes, setEditTiktokLikes] = useState(model.socialMedia.tiktok.likes);

  const canEditThisModel = isSuperAdmin || currentModelProfile?.id === model.id;

  // Quote Calculator state
  const [eventDate, setEventDate] = useState<string>('2026-05-20');
  const [hoursCount, setHoursCount] = useState<number>(8);
  const [eventName, setEventName] = useState<string>('Exhibición & Lanzamiento');

  const calculatedTotal = hoursCount * model.hourlyRate;
  const modelReviews = reviews.filter((r) => r.modelId === model.id);

  const handleSaveMediaKit = (e: React.FormEvent) => {
    e.preventDefault();
    updateModelSelf(model.id, {
      socialMedia: {
        ...model.socialMedia,
        instagram: {
          ...model.socialMedia.instagram,
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Paused profile banner */}
        {model.isPaused && (
          <div className="p-3 bg-amber-950 border-b border-amber-800 text-amber-300 text-xs flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <PauseCircle className="w-4 h-4 text-amber-400" />
              Este perfil está actualmente <strong>PAUSADO</strong> y oculto del catálogo público.
            </span>
            {canEditThisModel && (
              <button
                onClick={() => togglePauseModel(model.id)}
                className="px-2.5 py-1 rounded bg-amber-400 text-black font-bold text-[11px] hover:bg-amber-300"
              >
                Reactivar en Catálogo
              </button>
            )}
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/60 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <img
              src={model.avatar}
              alt={model.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--color-primary)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {model.name}
                </h2>
                {model.isVip && (
                  <span className="flex items-center gap-1 text-[11px] font-black text-black bg-gradient-to-r from-amber-400 to-yellow-300 px-2 py-0.5 rounded-lg shadow-[0_0_12px_rgba(251,191,36,0.4)]">
                    <Crown className="w-3.5 h-3.5 fill-black" />
                    Membresía VIP
                  </span>
                )}
                {model.identityVerification?.status === 'verificado' || model.verified ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/15 px-2.5 py-0.5 rounded-lg border border-[var(--color-primary)]/40 shadow-[0_0_10px_rgba(57,255,20,0.3)]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    Sello Verificado ✓
                  </span>
                ) : model.identityVerification?.status === 'pendiente' ? (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                    Doc. en Revisión
                  </span>
                ) : null}
                {model.isPaused && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Pausada
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                {model.roleLabel} · {model.location.city}, Venezuela 🇻🇪
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canEditThisModel && (
              <button
                onClick={() => togglePauseModel(model.id)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                  model.isPaused
                    ? 'bg-amber-950 border-amber-800 text-amber-300 hover:bg-amber-900'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                }`}
                title={model.isPaused ? 'Reactivar en catálogo' : 'Pausar perfil (ocultar de catálogo)'}
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

        {/* Navigation Tabs inside modal */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-zinc-800/80 bg-black overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'perfil'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Perfil & Medidas
          </button>
          <button
            onClick={() => setActiveTab('galeria')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'galeria'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Galería ({model.gallery.length} fotos)
          </button>
          <button
            onClick={() => setActiveTab('mediakit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'mediakit'
                ? 'bg-[var(--color-primary)] text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            MediaKit (Instagram & TikTok)
          </button>
          <button
            onClick={() => setActiveTab('resenas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'resenas'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Star className="w-3 h-3 text-[var(--color-primary)] fill-[var(--color-primary)]" />
            Reseñas ({modelReviews.length})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: PERFIL */}
          {activeTab === 'perfil' && (
            <div className="space-y-6">
              {/* Bio summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Biografía & Trayectoria
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                  {model.bio}
                </p>
              </div>

              {/* Physical specifications */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Ficha Técnica & Medidas
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-medium">Edad</span>
                    <div className="text-sm font-bold text-[var(--color-primary)] tabular-nums">
                      {model.age ? `${model.age} años` : '24 años'}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-medium">Estatura</span>
                    <div className="text-sm font-bold text-white tabular-nums">{model.physical.height}</div>
                  </div>
                  {model.physical.bust && (
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase font-medium">Medidas (B-C-C)</span>
                      <div className="text-sm font-bold text-white tabular-nums">
                        {model.physical.bust} - {model.physical.waist} - {model.physical.hips}
                      </div>
                    </div>
                  )}
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-medium">Color de Ojos</span>
                    <div className="text-sm font-bold text-white">{model.physical.eyeColor}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-medium">Cabello</span>
                    <div className="text-sm font-bold text-white">{model.physical.hairColor}</div>
                  </div>
                </div>
              </div>

              {/* Trabajos Anteriores / Experiencia Previa */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  Trabajos Anteriores & Experiencia Previa
                </h4>
                {model.pastExperience && model.pastExperience.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {model.pastExperience.map((job, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex items-start gap-2.5 hover:border-[var(--color-primary)]/40 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(57,255,20,0.6)]"></div>
                        <span className="text-xs text-zinc-200 font-medium leading-relaxed">{job}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400 italic">
                    Experiencia en activaciones de marcas de consumo masivo, ferias comerciales y desfiles en Venezuela.
                  </div>
                )}
              </div>

              {/* Languages */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Idiomas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {model.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-200"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability & Travel */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Disponibilidad para Viajes</div>
                  <div className="text-xs text-zinc-400">
                    {model.location.availableToTravel
                      ? 'Nacional e Internacional con pasaporte al día'
                      : 'Únicamente en ciudad base'}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold border border-[var(--color-primary)]/20">
                  {model.isPaused || model.status === 'pausada'
                    ? 'Pausada'
                    : model.status === 'en_evento'
                    ? 'En Evento'
                    : 'Disponible'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: GALERÍA */}
          {activeTab === 'galeria' && (
            <div className="space-y-4">
              {/* Featured photo display */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <img
                  src={model.gallery[activePhotoIndex] || model.avatar}
                  alt={`${model.name} foto ${activePhotoIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Left/Right buttons */}
                {model.gallery.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) =>
                          prev === 0 ? model.gallery.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) =>
                          prev === model.gallery.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-xs font-mono text-zinc-300">
                  {activePhotoIndex + 1} / {model.gallery.length}
                </div>
              </div>

              {/* Thumbnails row */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {model.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIndex(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activePhotoIndex === i
                        ? 'border-[var(--color-primary)] scale-95 shadow-[0_0_10px_rgba(57,255,20,0.5)]'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MEDIAKIT (INSTAGRAM & TIKTOK API FEEDS) */}
          {activeTab === 'mediakit' && (
            <div className="space-y-6">
              {canEditThisModel && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-xs text-zinc-300">
                    <span className="font-bold text-white">Gestión de MediaKit:</span> Puedes vincular tus enlaces reales de Instagram y TikTok.
                  </div>
                  <button
                    onClick={() => setIsEditingMediaKit(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-black text-xs font-bold hover:opacity-90 active:scale-95 transition-transform"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Conectar / Editar Redes</span>
                  </button>
                </div>
              )}

              {/* MediaKit High-Level Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
                  <div className="text-[10px] uppercase text-zinc-400 font-semibold mb-1 flex items-center justify-center gap-1">
                    <Instagram className="w-3 h-3 text-pink-400" /> Instagram
                  </div>
                  <div className="text-lg font-extrabold text-white">
                    {model.socialMedia.instagram.followers}
                  </div>
                  <div className="text-[11px] text-zinc-500">Seguidores Orgánicos</div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
                  <div className="text-[10px] uppercase text-zinc-400 font-semibold mb-1 flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-[var(--color-primary)]" /> Engagement
                  </div>
                  <div className="text-lg font-extrabold text-[var(--color-primary)]">
                    {model.socialMedia.instagram.engagement}
                  </div>
                  <div className="text-[11px] text-zinc-500">Tasa de Interacción</div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
                  <div className="text-[10px] uppercase text-zinc-400 font-semibold mb-1 flex items-center justify-center gap-1">
                    <Video className="w-3 h-3 text-cyan-400" /> TikTok
                  </div>
                  <div className="text-lg font-extrabold text-white">
                    {model.socialMedia.tiktok.followers}
                  </div>
                  <div className="text-[11px] text-zinc-500">Seguidores</div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
                  <div className="text-[10px] uppercase text-zinc-400 font-semibold mb-1 flex items-center justify-center gap-1">
                    <Heart className="w-3 h-3 text-red-400" /> Total Likes
                  </div>
                  <div className="text-lg font-extrabold text-white">
                    {model.socialMedia.tiktok.likes}
                  </div>
                  <div className="text-[11px] text-zinc-500">Me Gusta Acumulados</div>
                </div>
              </div>

              {/* Instagram Feed Highlights */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <h4 className="text-sm font-bold text-white">
                      Publicaciones Destacadas en Instagram ({model.socialMedia.instagram.handle})
                    </h4>
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
                      className="group rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-[var(--color-primary)] transition-all block cursor-pointer"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={post.image}
                          alt="Instagram post"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 rounded bg-black/75 backdrop-blur-sm text-[11px] text-white">
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

              {/* TikTok Feed Highlights */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">
                      Videos Virales en TikTok ({model.socialMedia.tiktok.handle})
                    </h4>
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
                      className="flex gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-400 transition-all block cursor-pointer group"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-20 h-28 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                          <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
                              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-black ml-0.5"></div>
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
                            Reproducir video real <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* MEDIAKIT EDIT MODAL */}
              {isEditingMediaKit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative">
                    <h3 className="text-base font-bold text-white mb-1">
                      Conectar y Editar Redes Sociales Reales
                    </h3>
                    <p className="text-xs text-zinc-400 mb-4">
                      Actualiza las estadísticas y enlaces oficiales de Instagram y TikTok para {model.name}.
                    </p>

                    <form onSubmit={handleSaveMediaKit} className="space-y-4 text-xs">
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                        <div className="font-bold text-pink-400 flex items-center gap-1.5">
                          <Instagram className="w-3.5 h-3.5" /> Instagram
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="col-span-2">
                            <label className="text-[10px] text-zinc-400">Enlace Real a Perfil Instagram</label>
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

                      <div className="flex justify-end gap-2 pt-2">
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
                          Guardar Redes Sociales
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RESEÑAS Y CALIFICACIONES VERIFICADAS */}
          {activeTab === 'resenas' && (
            <div className="space-y-6">
              
              {/* Overall Score & Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex flex-col items-center justify-center text-center sm:border-r border-zinc-800 pr-4">
                  <span className="text-4xl font-extrabold text-white tabular-nums">
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
                      <span className="tabular-nums font-bold text-white">{model.ratingsBreakdown.punctuality.toFixed(1)} / 5.0</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)]"
                        style={{ width: `${(model.ratingsBreakdown.punctuality / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-300 font-medium mb-1">
                      <span>Profesionalismo & Protocolo</span>
                      <span className="tabular-nums font-bold text-white">{model.ratingsBreakdown.professionalism.toFixed(1)} / 5.0</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)]"
                        style={{ width: `${(model.ratingsBreakdown.professionalism / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-300 font-medium mb-1">
                      <span>Presencia & Imagen</span>
                      <span className="tabular-nums font-bold text-white">{model.ratingsBreakdown.presence.toFixed(1)} / 5.0</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)]"
                        style={{ width: `${(model.ratingsBreakdown.presence / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Add review CTA */}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">
                  Reseñas de Clientes Verificados ({modelReviews.length})
                </h4>
                <button
                  onClick={() => onOpenReview(model)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-[var(--color-primary)] transition-colors active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Dejar Reseña Verificada</span>
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {modelReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-2"
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

            </div>
          )}

          {/* Quick Cotizador & Direct Action Bottom Sheet Card */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-3">
              Cotizador Rápido & Contratación
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Tipo de Evento</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Fecha Estimada</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Horas de Activación</label>
                <select
                  value={hoursCount}
                  onChange={(e) => setHoursCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none"
                >
                  <option value={4}>Media Jornada (4 hrs)</option>
                  <option value={6}>6 Horas</option>
                  <option value={8}>Jornada Completa (8 hrs)</option>
                  <option value={12}>Gala Extensa (12 hrs)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-medium">Inversión Estimada:</span>
                  <div className="text-xl font-extrabold text-white tabular-nums">
                    ${calculatedTotal} USD <span className="text-xs font-normal text-zinc-400">({hoursCount} hrs @ ${model.hourlyRate}/h)</span>
                  </div>
                </div>

                {currentUser && (currentUser.role === 'client' || currentUser.role === 'empresa') && (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    ✓ Autorizado para Contratar ({currentUser.role === 'empresa' ? 'Perfil Empresa' : 'Cliente'})
                  </span>
                )}
              </div>

              {/* RBAC Checks: Only authenticated Active Clients or Empresas can message & hire */}
              {!currentUser ? (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-zinc-300 text-center sm:text-left">
                    <span className="text-white font-bold block sm:inline">Autenticación requerida: </span>
                    Para enviar mensajes directos y contratar a {model.name}, debes iniciar sesión con una cuenta de Cliente o Empresa.
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      setAppActiveTab('login');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs shrink-0 hover:opacity-90 shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all"
                  >
                    Iniciar Sesión / Registro
                  </button>
                </div>
              ) : currentUser.status === 'standby' ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
                  <Clock className="w-5 h-5 shrink-0 text-amber-400" />
                  <div>
                    <div className="font-bold">Cuenta en Standby (En Espera de Aprobación)</div>
                    <div className="text-[11px] text-amber-400/90 mt-0.5">
                      Tu registro de Cliente/Empresa está en cola de revisión por el Super Admin (pixelglez1988@gmail.com). No puedes enviar mensajes directos a las promotoras hasta que tu cuenta sea activada.
                    </div>
                  </div>
                </div>
              ) : currentUser.role === 'model' && !isSuperAdmin ? (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
                  <div>
                    <div className="font-bold">Restricción entre Modelos</div>
                    <div className="text-[11px] text-zinc-300 mt-0.5">
                      Las promotoras no pueden contratarse entre ellas. Solo un perfil registrado como <strong>Cliente</strong> o <strong>Empresa</strong> puede solicitar cotizaciones y formalizar contrataciones en DIFUSION.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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

          </div>

        </div>

      </div>
    </div>
  );
};
