import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WallPost, WallReactionType } from '../types';
import {
  Flame,
  Heart,
  ThumbsUp,
  MessageSquare,
  Send,
  Image as ImageIcon,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Trash2,
  MapPin,
  Lock,
  ChevronDown,
  ChevronUp,
  Share2,
  AlertCircle,
} from 'lucide-react';

export const SocialWallSection: React.FC = () => {
  const {
    wallPosts,
    createWallPost,
    toggleWallReaction,
    addWallComment,
    deleteWallPost,
    currentUser,
    setShowAuthModal,
    canUserPostToday,
    userTodayPost,
    isSuperAdmin,
    showToast,
  } = useApp();

  // Composer state
  const [postText, setPostText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterRole, setFilterRole] = useState<'all' | 'model' | 'empresa' | 'trending'>('all');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});
  const [selectedZoomImage, setSelectedZoomImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter posts
  const filteredPosts = wallPosts.filter((post) => {
    if (filterRole === 'model') return post.authorRole === 'model';
    if (filterRole === 'empresa') return post.authorRole === 'empresa';
    if (filterRole === 'trending') {
      const totalReactions =
        (post.reactions?.fire?.length || 0) +
        (post.reactions?.heart?.length || 0) +
        (post.reactions?.like?.length || 0);
      return totalReactions >= 2;
    }
    return true;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen supera el límite de 5MB. Elige una más ligera.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!canUserPostToday) {
      showToast('Ya has publicado tu actualización de hoy.');
      return;
    }

    if (!postText.trim() && !imagePreview) {
      showToast('Escribe un mensaje o sube una fotografía.');
      return;
    }

    setIsSubmitting(true);
    const res = await createWallPost(postText, imagePreview || undefined);
    setIsSubmitting(false);

    if (res.success) {
      setPostText('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    setSubmittingComment((prev) => ({ ...prev, [postId]: true }));
    const res = await addWallComment(postId, text);
    setSubmittingComment((prev) => ({ ...prev, [postId]: false }));

    if (res.success) {
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      setExpandedComments((prev) => ({ ...prev, [postId]: true }));
    }
  };

  const formatPostDate = (isoOrText: string) => {
    if (!isoOrText) return 'Reciente';
    if (isoOrText.startsWith('Hace') || isoOrText === 'Ayer' || isoOrText === 'Hoy') {
      return isoOrText;
    }
    try {
      const date = new Date(isoOrText);
      if (isNaN(date.getTime())) return isoOrText;
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'Hace un momento';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours} h`;
      return date.toLocaleDateString('es-VE', { day: 'numeric', month: 'short' });
    } catch {
      return isoOrText;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-3 h-3" />
            Super Admin
          </span>
        );
      case 'model':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30">
            👠 Modelo Élite
          </span>
        );
      case 'empresa':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            🏢 Empresa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
            Usuario
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 pb-24 md:pb-16">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-black py-10 px-4 sm:px-6">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-semibold text-[var(--color-primary)] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)] animate-pulse" />
            <span>Muro Social en Vivo · Para Ti</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-ping ml-1" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Para Ti · <span className="text-[var(--color-primary)]">Comunidad Élite</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Fotografías, backstages y novedades directas del talento y empresas en Venezuela. 
            Comparte tu día con la comunidad con un máximo de <strong className="text-white">1 publicación diaria</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-5 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 bg-zinc-900/60 px-3 py-1 rounded-full border border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              1 Post diario por usuario
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/60 px-3 py-1 rounded-full border border-zinc-800">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Reacciones en tiempo real (🔥 ❤️ 👍)
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/60 px-3 py-1 rounded-full border border-zinc-800">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              Comentarios y debate
            </span>
          </div>
        </div>
      </section>

      {/* Main Feed Container */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6">

        {/* 1. Daily Post Composer Card */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl relative backdrop-blur-sm">
          {!currentUser ? (
            <div className="text-center py-4 px-2">
              <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-3 text-[var(--color-primary)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                ¿Quieres compartir tu foto del día?
              </h3>
              <p className="text-xs text-zinc-400 mb-4 max-w-md mx-auto">
                Inicia sesión con tu cuenta de Google o correo para publicar tu post diario, reaccionar con fueguitos y comentar.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/20 active:scale-95"
              >
                Iniciar Sesión / Registrarse
              </button>
            </div>
          ) : !canUserPostToday ? (
            /* User already published their 1 post today */
            <div className="py-3 px-2">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-zinc-950/70 border border-emerald-500/30 text-zinc-300">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      ¡Publicación diaria completada!
                    </h4>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-zinc-400" />
                      1 post / día
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-1">
                    Ya compartiste tu actualización de hoy en <strong className="text-white">Para Ti</strong>. Tu post está activo y visible para toda la comunidad.
                  </p>
                  {userTodayPost && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center gap-2.5 text-xs text-zinc-400">
                      {userTodayPost.imageUrl && (
                        <img
                          src={userTodayPost.imageUrl}
                          alt="Tu foto de hoy"
                          className="w-10 h-10 rounded-lg object-cover border border-zinc-700"
                        />
                      )}
                      <p className="line-clamp-1 italic text-zinc-300">
                        &ldquo;{userTodayPost.text || 'Fotografía de hoy'}&rdquo;
                      </p>
                    </div>
                  )}
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Podrás publicar tu próxima foto y texto mañana. Mientras tanto puedes reaccionar y comentar en otros posts.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* User is eligible to post today */
            <form onSubmit={handleSubmitPost} className="space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <img
                    src={
                      currentUser.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
                    }
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[var(--color-primary)]/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{currentUser.name}</span>
                      {getRoleBadge(currentUser.role)}
                    </div>
                    <span className="text-[10px] text-zinc-400">
                      Comparte tu actualización del día (1 post hoy)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Disponible hoy
                </span>
              </div>

              {/* Text Area */}
              <div>
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="¿Qué novedades, backstage o proyecto quieres compartir hoy con DIFUSION Venezuela?..."
                  maxLength={500}
                  rows={3}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[var(--color-primary)] resize-none transition-colors"
                />
                <div className="flex justify-end text-[10px] text-zinc-400 mt-1">
                  <span>{postText.length} / 500 caracteres</span>
                </div>
              </div>

              {/* Image Preview if uploaded */}
              {imagePreview && (
                <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 max-h-72 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Vista previa de subida"
                    className="max-h-72 w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/80 hover:bg-black text-white border border-zinc-700 transition-colors"
                    title="Eliminar foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Actions & Submit */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    id="wall-image-input"
                  />
                  <label
                    htmlFor="wall-image-input"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold cursor-pointer transition-colors active:scale-95"
                  >
                    <ImageIcon className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>{imagePreview ? 'Cambiar foto' : 'Agregar foto'}</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || (!postText.trim() && !imagePreview)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-[var(--color-primary)]/20 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Publicando...' : 'Publicar Post Diario'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 2. Feed Filter Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                filterRole === 'all'
                  ? 'bg-[var(--color-primary)] text-black shadow-sm shadow-[var(--color-primary)]/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Para Ti (Todos)
            </button>
            <button
              onClick={() => setFilterRole('trending')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                filterRole === 'trending'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Tendencias 🔥
            </button>
            <button
              onClick={() => setFilterRole('model')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                filterRole === 'model'
                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              👠 Modelos
            </button>
            <button
              onClick={() => setFilterRole('empresa')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                filterRole === 'empresa'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              🏢 Empresas
            </button>
          </div>

          <span className="text-[11px] text-zinc-400 hidden sm:inline whitespace-nowrap">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'publicación' : 'publicaciones'}
          </span>
        </div>

        {/* 3. Wall Posts Stream */}
        {filteredPosts.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 text-center my-6">
            <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center mx-auto mb-3 text-zinc-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              No hay publicaciones en este filtro
            </h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
              Sé la primera persona en compartir una foto o actualización con la comunidad de DIFUSION Venezuela.
            </p>
            <button
              onClick={() => setFilterRole('all')}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
            >
              Ver todos los posts
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const userId = currentUser?.id || currentUser?.email || '';
              const hasReactedFire = post.reactions?.fire?.includes(userId) || false;
              const hasReactedHeart = post.reactions?.heart?.includes(userId) || false;
              const hasReactedLike = post.reactions?.like?.includes(userId) || false;

              const fireCount = post.reactions?.fire?.length || 0;
              const heartCount = post.reactions?.heart?.length || 0;
              const likeCount = post.reactions?.like?.length || 0;
              const commentsCount = post.comments?.length || 0;

              const isOwner =
                currentUser?.id === post.authorId ||
                currentUser?.email?.toLowerCase() === post.authorEmail?.toLowerCase();
              const canDelete = isSuperAdmin || isOwner;

              const isCommentsOpen = !!expandedComments[post.id];

              return (
                <article
                  key={post.id}
                  className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-lg hover:border-zinc-700/80 transition-all backdrop-blur-sm"
                >
                  {/* Card Header: Author info */}
                  <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-zinc-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-white hover:text-[var(--color-primary)] transition-colors truncate">
                            {post.authorName}
                          </span>
                          {getRoleBadge(post.authorRole)}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                          {post.authorCity && (
                            <span className="flex items-center gap-0.5 text-zinc-400">
                              <MapPin className="w-3 h-3 text-[var(--color-primary)]" />
                              {post.authorCity}
                            </span>
                          )}
                          <span>•</span>
                          <span>{formatPostDate(post.createdAt)}</span>
                          {post.pinned && (
                            <>
                              <span>•</span>
                              <span className="text-[10px] font-semibold text-[var(--color-primary)]">
                                📌 Fijado
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete action for author or Super Admin */}
                    {canDelete && (
                      <button
                        onClick={() => {
                          if (confirm('¿Deseas eliminar esta publicación del muro?')) {
                            deleteWallPost(post.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Eliminar publicación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Card Body: Post text */}
                  {post.text && (
                    <div className="px-4 sm:px-5 pb-3">
                      <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">
                        {post.text}
                      </p>
                    </div>
                  )}

                  {/* Card Body: Post Image (if present) */}
                  {post.imageUrl && (
                    <div className="relative bg-black/80 max-h-[500px] overflow-hidden flex items-center justify-center cursor-pointer group">
                      <img
                        src={post.imageUrl}
                        alt={`Publicación de ${post.authorName}`}
                        onClick={() => setSelectedZoomImage(post.imageUrl || null)}
                        className="w-full max-h-[500px] object-cover sm:object-contain group-hover:scale-[1.01] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        Haz clic para ampliar
                      </div>
                    </div>
                  )}

                  {/* Card Footer: Reactions and comments bar */}
                  <div className="px-4 sm:px-5 py-3 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between gap-2">
                    {/* Reactions cluster */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {/* Fire reaction 🔥 */}
                      <button
                        onClick={() => toggleWallReaction(post.id, 'fire')}
                        aria-label="Reaccionar con fuego"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-90 ${
                          hasReactedFire
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-sm shadow-orange-500/20'
                            : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-400 hover:text-orange-400 border border-zinc-700/60'
                        }`}
                      >
                        <span className={`text-sm ${hasReactedFire ? 'scale-125' : ''} transition-transform`}>
                          🔥
                        </span>
                        <span className="text-[11px] font-mono">{fireCount}</span>
                      </button>

                      {/* Heart reaction ❤️ */}
                      <button
                        onClick={() => toggleWallReaction(post.id, 'heart')}
                        aria-label="Reaccionar con corazón"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-90 ${
                          hasReactedHeart
                            ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50 shadow-sm shadow-pink-500/20'
                            : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-400 hover:text-pink-400 border border-zinc-700/60'
                        }`}
                      >
                        <span className={`text-sm ${hasReactedHeart ? 'scale-125' : ''} transition-transform`}>
                          ❤️
                        </span>
                        <span className="text-[11px] font-mono">{heartCount}</span>
                      </button>

                      {/* Like reaction 👍 */}
                      <button
                        onClick={() => toggleWallReaction(post.id, 'like')}
                        aria-label="Reaccionar con like"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-90 ${
                          hasReactedLike
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                            : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-700/60'
                        }`}
                      >
                        <span className={`text-sm ${hasReactedLike ? 'scale-125' : ''} transition-transform`}>
                          👍
                        </span>
                        <span className="text-[11px] font-mono">{likeCount}</span>
                      </button>
                    </div>

                    {/* Comments toggle button */}
                    <button
                      onClick={() => handleToggleComments(post.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        isCommentsOpen
                          ? 'bg-zinc-800 text-white border border-zinc-700'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{commentsCount}</span>
                      <span className="hidden sm:inline">
                        {commentsCount === 1 ? 'comentario' : 'comentarios'}
                      </span>
                      {isCommentsOpen ? (
                        <ChevronUp className="w-3 h-3 text-zinc-400 ml-0.5" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-zinc-400 ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Expandable Comments Drawer */}
                  {isCommentsOpen && (
                    <div className="border-t border-zinc-800 bg-zinc-950/70 p-4 sm:p-5 space-y-3.5 animate-fadeIn">
                      {/* Comments list */}
                      {commentsCount === 0 ? (
                        <p className="text-xs text-zinc-400 italic text-center py-2">
                          Sé la primera persona en dejar un comentario en esta publicación.
                        </p>
                      ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                          {post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs"
                            >
                              <img
                                src={comment.authorAvatar}
                                alt={comment.authorName}
                                className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-zinc-700"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-white">
                                    {comment.authorName}
                                  </span>
                                  {getRoleBadge(comment.authorRole)}
                                  <span className="text-[10px] text-zinc-400 ml-auto">
                                    {comment.createdAt}
                                  </span>
                                </div>
                                <p className="text-zinc-200 mt-1 leading-relaxed break-words">
                                  {comment.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment Input Box */}
                      <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleCommentSubmit(post.id);
                            }
                          }}
                          placeholder={
                            currentUser
                              ? 'Escribe un comentario respetuoso...'
                              : 'Inicia sesión para comentar...'
                          }
                          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => handleCommentSubmit(post.id)}
                          disabled={
                            submittingComment[post.id] || !commentInputs[post.id]?.trim()
                          }
                          className="px-3.5 py-2 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Comentar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Image Zoom Modal */}
      {selectedZoomImage && (
        <div
          onClick={() => setSelectedZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            onClick={() => setSelectedZoomImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedZoomImage}
            alt="Fotografía ampliada"
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
