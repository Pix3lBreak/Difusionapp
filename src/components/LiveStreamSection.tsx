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
} from 'lucide-react';

interface StreamComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export const LiveStreamSection: React.FC = () => {
  const { models, setSelectedModel, setActiveChatModel } = useApp();

  const [viewerCount, setViewerCount] = useState<number>(1420);
  const [likesCount, setLikesCount] = useState<number>(8940);
  const [heartFloats, setHeartFloats] = useState<{ id: number; left: number }[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>('');
  
  const [comments, setComments] = useState<StreamComment[]>([
    {
      id: 'c1',
      user: 'Carlos M.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      text: '¡Excelente cobertura del backstage del Salón Automotor! 🔥',
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
      text: 'Saludos desde CDMX, tremendo stand de DIFUSION!',
      time: 'Justo ahora',
    },
  ]);

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

  const currentStreamModel = models[4] || models[0]; // Daniela Ospina or first model

  return (
    <section className="py-8 sm:py-12 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)] mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              TikTok & Multi-Platform Live Broadcast
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Backstage en Vivo & Transmisión Oficial
            </h2>
          </div>
          <div className="flex items-center gap-3">
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
          
          {/* Main Video Viewport (TikTok / Stage Format) */}
          <div className="lg:col-span-2 relative aspect-[16/9] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl flex items-center justify-center">
            
            {/* Background Stream Simulation Graphic */}
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
                    {currentStreamModel.name}
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
                  Entrevistas VIP y prueba de vestuario para el Latin Tech Summit 2026
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

          </div>

          {/* Right Column: Live Chat & Model Quick Hire Widget */}
          <div className="flex flex-col h-[460px] lg:h-auto rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-xl">
            
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

      </div>
    </section>
  );
};
