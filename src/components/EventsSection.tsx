import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventItem } from '../types';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Sparkles,
  Send,
  Building,
} from 'lucide-react';

export const EventsSection: React.FC = () => {
  const { events, models, applyToCasting, isSuperAdmin, showToast } = useApp();
  const [selectedEventForCasting, setSelectedEventForCasting] = useState<EventItem | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantInstagram, setApplicantInstagram] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !selectedEventForCasting) return;
    applyToCasting(selectedEventForCasting.id, applicantName);
    setSelectedEventForCasting(null);
    setApplicantName('');
    setApplicantPhone('');
    setApplicantInstagram('');
  };

  return (
    <section className="py-8 sm:py-12 bg-black min-h-[70vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Convocatorias Oficiales & Castings
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Próximos Eventos Impulsados
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Activaciones de alta exposición internacional, salones automotrices y congresos VIP con staff exclusivo coordinado por DIFUSION.
            </p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => {
            const assignedModelsList = models.filter((m) =>
              event.assignedModelIds.includes(m.id)
            );

            return (
              <div
                key={event.id}
                className="group flex flex-col rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 overflow-hidden shadow-xl transition-all"
              >
                {/* Banner Header */}
                <div className="relative aspect-[16/8] w-full overflow-hidden bg-zinc-900">
                  <img
                    src={event.banner}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                  {/* Category & Status */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-zinc-700/60 text-[11px] font-semibold text-[var(--color-primary)]">
                      {event.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[var(--color-primary)] text-black text-[11px] font-bold">
                      {event.status === 'casting_open' ? 'Casting Abierto' : 'Staff Asignado'}
                    </span>
                  </div>

                  {/* Title & Location on banner */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs text-zinc-300 font-medium mt-0.5 line-clamp-1">
                      {event.tagline}
                    </p>
                  </div>
                </div>

                {/* Event Body */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  
                  {/* Meta details strip (Zero-pill text format §1.A) */}
                  <div className="grid grid-cols-2 gap-3 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                      <span className="text-zinc-200 font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                      <span className="text-zinc-200">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                      <span className="text-zinc-200 truncate">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                    {event.description}
                  </p>

                  {/* Staff & Casted Models strip */}
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-zinc-400 font-medium">Modelos Confirmadas</span>
                      <span className="text-[var(--color-primary)] font-bold tabular-nums">
                        {assignedModelsList.length} / {event.requiredProfilesCount} staff
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {assignedModelsList.map((m) => (
                          <img
                            key={m.id}
                            src={m.avatar}
                            alt={m.name}
                            title={m.name}
                            className="inline-block h-7 w-7 rounded-full ring-2 ring-zinc-950 object-cover"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-zinc-400">
                        {assignedModelsList.map((m) => m.stageName).join(', ') || 'En selección'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[180px]">{event.organizer}</span>
                    </div>

                    {event.status === 'casting_open' && (
                      <button
                        onClick={() => setSelectedEventForCasting(event)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-black text-xs font-bold transition-all shadow-[0_0_12px_rgba(57,255,20,0.3)] active:scale-95 min-h-[44px]"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Postularse al Casting</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Casting Application Modal */}
        {selectedEventForCasting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative">
              <h3 className="text-base font-bold text-white mb-1">
                Postulación al Casting
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                {selectedEventForCasting.title}
              </p>

              <form onSubmit={handleApply} className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Tu nombre y apellido"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">WhatsApp de Contacto</label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Usuario de Instagram (@)</label>
                  <input
                    type="text"
                    required
                    value={applicantInstagram}
                    onChange={(e) => setApplicantInstagram(e.target.value)}
                    placeholder="@tu_usuario"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedEventForCasting(null)}
                    className="flex-1 py-2 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[var(--color-primary)] text-xs font-bold text-black transition-all hover:opacity-90 shadow-[0_0_12px_rgba(57,255,20,0.3)]"
                  >
                    Enviar Postulación
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
