import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  Sparkles,
  Send,
  Video,
  ShieldCheck,
  Volume2,
  VolumeX,
  Edit,
  Code,
  Check,
  X,
  Tv,
} from 'lucide-react';

interface StreamComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export const LiveStreamSection: React.FC = () => {
  const {
    models,
    setSelectedModel,
    themeConfig,
    updateStreamConfig,
    isSuperAdmin,
    setActiveTab,
    showToast,
  } = useApp();

  const streamConfig = themeConfig.streamConfig;

  const [viewerCount, setViewerCount] = useState<number>(streamConfig?.viewerCount || 1420);
  const [likesCount, setLikesCount] = useState<number>(8940);
  const [heartFloats, setHeartFloats] = useState<{ id: number; left: number }[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>('');
  const [showEditHtmlModal, setShowEditHtmlModal] = useState<boolean>(false);
  const [customHtmlInput, setCustomHtmlInput] = useState<string>(streamConfig?.embedHtml || '');
  const [streamTitleInput, setStreamTitleInput] = useState<string>(streamConfig?.streamTitle || 'Backstage en Vivo & Transmisión Oficial');
  
  const [comments, setComments] = useState<StreamComment[]>([
    {
      id: 'c1',
      user: 'Carlos M.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      text: '¡Excelente cobertura del backstage del Salón Automotor Caracas! 🔥',
      time: '1m',
    },
    {
      id: 'c2',
      user: 'Elena Productora',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      text: '¿Daniela estará disponible para la activación de la próxima semana?',
      time: 'Justo ahora',
    },
    {
      id: 'c3',
      user: 'Marcos_F1',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
      text: 'Saludos desde Lechería, tremendo stand y staff de DIFUSION!',
      time: 'Justo ahora',
    },
  ]);

  // Sync state if streamConfig changes
  useEffect(() => {
    if (streamConfig?.embedHtml !== undefined) {
      setCustomHtmlInput(streamConfig.embedHtml);
    }
    if (streamConfig?.streamTitle) {
      setStreamTitleInput(streamConfig.streamTitle);
    }
  }, [streamConfig]);

  // Fluctuating viewers
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = () => {
    setLikesCount((prev) => prev + 1);
    const newHeart = { id: Date.now(), left: Math.floor(Math.random() * 40) + 30 };
    setHeartFloats((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setHeartFloats((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentItem: StreamComment = {
      id: `c_${Date.now()}`,
      user: 'Tú',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text: newComment,
      time: 'Ahora',
    };
    setComments((prev) => [...prev, commentItem]);
    setNewComment('');
  };

  const handleSaveHtmlStream = (e: React.FormEvent) => {
    e.preventDefault();
    updateStreamConfig({
      embedHtml: customHtmlInput,
      streamTitle: streamTitleInput,
    });
    setShowEditHtmlModal(false);
    showToast('Reproductor HTML del stream actualizado.');
  };

  const currentStreamModel = models[4] || models[0];

  return (
    <section className="py-8 sm:py-12 bg-black min-h-[75vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)] mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              {streamConfig?.platformName || 'TikTok & Multi-Platform Live'} Broadcast
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {streamConfig?.streamTitle || 'Backstage en Vivo & Transmisión Oficial'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {isSuperAdmin && (
              <button
                onClick={() => setShowEditHtmlModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white transition-all shadow-md active:scale-95"
                title="Editar código HTML de la transmisión (Super Admin)"
              >
                <Edit className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>Editar HTML del Stream</span>
              </button>
            )}

            <span className="px-3 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              EN VIVO AHORA
            </span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <Users className="w-4 h-4 text-zinc-300" />
              <span className="text-white font-bold tabular-nums">{viewerCount.toLocaleString()}</span> espectadores
            </div>
          </div>
        </div>

        {/* Live Stream Stage Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Video Viewport (HTML Embed OR Simulation Graphic) */}
          <div className="lg:col-span-2 relative aspect-[16/9] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl flex items-center justify-center">
            
            {streamConfig?.embedHtml && streamConfig.embedHtml.trim() ? (
              /* Custom Embedded HTML Video Stream (YouTube Live, TikTok iframe, Twitch, HTML5 Video, etc.) */
              <div className="w-full h-full relative bg-black flex items-center justify-center">
                <div
                  className="w-full h-full flex items-center justify-center overflow-hidden [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 [&>video]:w-full [&>video]:h-full [&>video]:object-cover"
                  dangerouslySetInnerHTML={{ __html: streamConfig.embedHtml }}
                />

                {/* Floating Top Controls Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-700/60 pointer-events-auto">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold text-white">
                      {streamConfig.platformName || 'DIFUSION Live'}
                    </span>
                    <span className="text-[10px] text-zinc-400">· {streamConfig.hostName || 'Staff Oficial'}</span>
                  </div>

                  {isSuperAdmin && (
                    <button
                      onClick={() => setShowEditHtmlModal(true)}
                      className="px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-[11px] font-bold text-[var(--color-primary)] border border-zinc-700 pointer-events-auto"
                    >
                      Editar HTML
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* High-Fidelity Official Simulated Broadcast */
              <>
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=80"
                  alt="Live Stream"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

                {/* Top Bar on Video */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700/60">
                    <img
                      src={currentStreamModel.avatar}
                      alt={currentStreamModel.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-[var(--color-primary)]"
                    />
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">
                        {streamConfig?.hostName || currentStreamModel.name}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Host Oficial DIFUSION
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Floating Like Hearts */}
                {heartFloats.map((heart) => (
                  <div
                    key={heart.id}
                    style={{ right: `${heart.left}%` }}
                    className="absolute bottom-16 pointer-events-none animate-bounce text-pink-500"
                  >
                    <Heart className="w-8 h-8 fill-pink-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                  </div>
                ))}

                {/* Bottom Controls on Video */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="max-w-md">
                    <div className="text-xs font-semibold text-[var(--color-primary)]">
                      Campaña en Directo
                    </div>
                    <div className="text-sm font-bold text-white drop-shadow">
                      {streamConfig?.streamTitle || 'Entrevistas VIP y prueba de vestuario para eventos en Caracas'}
                    </div>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-600/90 hover:bg-pink-500 text-white text-xs font-bold shadow-lg transition-transform active:scale-90"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span className="tabular-nums font-mono">{likesCount.toLocaleString()}</span>
                  </button>
                </div>
              </>
            )}

          </div>

          {/* Right Column: Live Chat & Model Quick Hire Widget */}
          <div className="flex flex-col h-[480px] lg:h-auto rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-xl">
            
            {/* Live Chat Header */}
            <div className="p-3.5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-xs font-bold text-white">Chat en Tiempo Real</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Modo Moderado</span>
            </div>

            {/* Chat Messages scroll area */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2 text-xs">
                  <img
                    src={c.avatar}
                    alt={c.user}
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-zinc-200">{c.user}</span>
                      <span className="text-[10px] text-zinc-500">{c.time}</span>
                    </div>
                    <p className="text-zinc-300 font-normal leading-relaxed mt-0.5">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Profile Hire Box */}
            <div className="p-3 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <img
                  src={currentStreamModel.avatar}
                  alt={currentStreamModel.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">
                    {currentStreamModel.name}
                  </div>
                  <div className="text-[11px] text-[var(--color-primary)] font-semibold">
                    ${currentStreamModel.hourlyRate}/h
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedModel(currentStreamModel)}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-black text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Ver MediaKit
              </button>
            </div>

            {/* Send Comment Input */}
            <form onSubmit={handleSendComment} className="p-2.5 bg-black border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enviar mensaje al stream..."
                className="flex-1 px-3 py-2 bg-zinc-900 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

        {/* Quick HTML Stream Editor Modal (Super Admin) */}
        {showEditHtmlModal && isSuperAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-xl rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-[var(--color-primary)]" />
                  <h3 className="text-base font-bold text-white">
                    Editar HTML del Reproductor de Stream
                  </h3>
                </div>
                <button
                  onClick={() => setShowEditHtmlModal(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveHtmlStream} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Título de la Emisión
                  </label>
                  <input
                    type="text"
                    value={streamTitleInput}
                    onChange={(e) => setStreamTitleInput(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      Código HTML / Embed Iframe
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setCustomHtmlInput(
                          `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_bqQ5yA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
                        )
                      }
                      className="text-[11px] text-[var(--color-primary)] hover:underline"
                    >
                      Ejemplo YouTube Live
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={customHtmlInput}
                    onChange={(e) => setCustomHtmlInput(e.target.value)}
                    placeholder='Pega aquí el iframe o etiqueta de video HTML5...'
                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl font-mono text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-primary)]"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Puedes incrustar transmisiones de TikTok Live, YouTube Live, Kick o Twitch.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowEditHtmlModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-black font-bold flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar y Aplicar</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
