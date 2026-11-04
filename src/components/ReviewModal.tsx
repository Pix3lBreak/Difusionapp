import React, { useState } from 'react';
import { ModelProfile } from '../types';
import { useApp } from '../context/AppContext';
import { X, Star, ShieldCheck, Check } from 'lucide-react';

interface ReviewModalProps {
  model: ModelProfile;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ model, onClose }) => {
  const { addReview, currentUser } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [punctuality, setPunctuality] = useState<number>(5);
  const [professionalism, setProfessionalism] = useState<number>(5);
  const [presence, setPresence] = useState<number>(5);
  const [authorName, setAuthorName] = useState<string>(currentUser?.name || '');
  const [authorCompany, setAuthorCompany] = useState<string>('Red Bull Brand Events');
  const [authorRole, setAuthorRole] = useState<string>('Coordinador de Activaciones');
  const [eventTitle, setEventTitle] = useState<string>('Activación VIP & Protocolo');
  const [comment, setComment] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !authorName.trim()) return;

    addReview({
      modelId: model.id,
      authorName,
      authorCompany,
      authorRole,
      rating,
      verifiedBooking: true,
      comment,
      eventTitle,
      punctualityScore: punctuality,
      professionalismScore: professionalism,
      presenceScore: presence,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <img
            src={model.avatar}
            alt={model.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-[var(--color-primary)]"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-white">Dejar Reseña Verificada</h3>
              <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <p className="text-xs text-zinc-400">
              Para <strong>{model.name}</strong> ({model.roleLabel})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Star Picker */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center">
            <span className="block text-xs font-semibold text-zinc-300 mb-2">
              Calificación General de la Experiencia
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'text-[var(--color-primary)] fill-[var(--color-primary)] drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]'
                        : 'text-zinc-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-[var(--color-primary)] font-bold mt-1 block">
              {rating}.0 Estrellas
            </span>
          </div>

          {/* Sub-scores */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 block mb-1">Puntualidad</span>
              <select
                value={punctuality}
                onChange={(e) => setPunctuality(Number(e.target.value))}
                className="w-full bg-black border border-zinc-700 rounded-lg py-1 px-1 text-center font-bold text-white"
              >
                <option value={5}>5.0 Excelente</option>
                <option value={4}>4.0 Muy Buena</option>
                <option value={3}>3.0 Aceptable</option>
              </select>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 block mb-1">Profesionalismo</span>
              <select
                value={professionalism}
                onChange={(e) => setProfessionalism(Number(e.target.value))}
                className="w-full bg-black border border-zinc-700 rounded-lg py-1 px-1 text-center font-bold text-white"
              >
                <option value={5}>5.0 Impecable</option>
                <option value={4}>4.0 Bueno</option>
                <option value={3}>3.0 Normal</option>
              </select>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 block mb-1">Presencia</span>
              <select
                value={presence}
                onChange={(e) => setPresence(Number(e.target.value))}
                className="w-full bg-black border border-zinc-700 rounded-lg py-1 px-1 text-center font-bold text-white"
              >
                <option value={5}>5.0 Destacada</option>
                <option value={4}>4.0 Adecuada</option>
                <option value={3}>3.0 Regular</option>
              </select>
            </div>
          </div>

          {/* Client & Event info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Tu Nombre o Cargo</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ej. Martín Ruiz"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Empresa Contratante</label>
              <input
                type="text"
                required
                value={authorCompany}
                onChange={(e) => setAuthorCompany(e.target.value)}
                placeholder="Ej. Red Bull Latam"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-zinc-400 mb-1">Nombre del Evento</label>
              <input
                type="text"
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Ej. Salón Internacional de Autos 2026"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Comentario & Testimonio Verificado</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe el desempeño de la modelo, trato con el público y puntualidad..."
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold hover:opacity-90 shadow-md"
            >
              Publicar Reseña Verificada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
