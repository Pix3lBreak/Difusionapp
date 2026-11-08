import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventItem, EventApplicant, ModelProfile } from '../types';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Sparkles,
  Send,
  Building,
  Plus,
  Trash2,
  Lock,
  X,
  Check,
  Eye,
  MessageCircle,
  Phone,
  Instagram,
  UserCheck,
  ExternalLink,
  Users,
} from 'lucide-react';

export const EventsSection: React.FC = () => {
  const {
    events,
    models,
    applyToCasting,
    reviewCastingApplicant,
    isSuperAdmin,
    currentUser,
    currentModelProfile,
    setSelectedModel,
    setActiveChatModel,
    addEvent,
    deleteEvent,
    availableCities,
    setActiveTab,
    showToast,
  } = useApp();

  // Casting application modal state (for models)
  const [selectedEventForCasting, setSelectedEventForCasting] = useState<EventItem | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantInstagram, setApplicantInstagram] = useState('');

  // Event applicant review modal (for empresas & super admin)
  const [selectedEventForApplicants, setSelectedEventForApplicants] = useState<EventItem | null>(null);

  // Event Creation Modal State (Restricted to Empresas and Super Admin)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTagline, setEventTagline] = useState('');
  const [eventDate, setEventDate] = useState('2026-06-15');
  const [eventTime, setEventTime] = useState('09:00 AM - 06:00 PM');
  const [eventCity, setEventCity] = useState(availableCities[0] || 'Caracas');
  const [eventSpecificLocation, setEventSpecificLocation] = useState('C.C.C.T., Nivel Terraza');
  const [eventCategory, setEventCategory] = useState('Salón Automotriz & Exhibición');
  const [requiredCount, setRequiredCount] = useState(4);
  const [eventBanner, setEventBanner] = useState(
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
  );
  const [eventDescription, setEventDescription] = useState('');
  const [eventOrganizer, setEventOrganizer] = useState(
    currentUser?.companyName || currentUser?.name || 'Empresa Patrocinante'
  );

  // Permission checks
  const isEmpresa = currentUser?.role === 'empresa' || currentUser?.clientType === 'empresa';
  const canCreateEvent =
    isSuperAdmin || (currentUser?.status === 'active' && isEmpresa);
  const isModel = currentUser?.role === 'model' && currentUser?.status === 'active';
  const isClient = currentUser?.role === 'client';

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForCasting) return;
    if (!applicantName.trim()) {
      showToast('Por favor ingresa tu nombre para la postulación.');
      return;
    }

    applyToCasting(selectedEventForCasting.id, {
      modelId: currentModelProfile?.id,
      modelName: applicantName.trim(),
      modelAvatar: currentModelProfile?.avatar || currentUser?.avatar,
      modelCity: currentModelProfile?.location?.city || eventCity,
      phone: applicantPhone.trim(),
      instagram: applicantInstagram.trim(),
    });

    setSelectedEventForCasting(null);
    setApplicantName('');
    setApplicantPhone('');
    setApplicantInstagram('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateEvent) {
      showToast('Solo empresas autorizadas y la administración pueden publicar eventos.');
      return;
    }
    if (!eventTitle.trim()) {
      showToast('Por favor ingresa un título para el evento.');
      return;
    }

    addEvent({
      title: eventTitle,
      tagline: eventTagline || 'Convocatoria oficial para staff de imagen y protocolo',
      date: eventDate,
      time: eventTime,
      location: `${eventSpecificLocation}, ${eventCity}, Venezuela`,
      category: eventCategory,
      banner: eventBanner,
      requiredProfilesCount: Number(requiredCount) || 2,
      status: 'casting_open',
      description:
        eventDescription ||
        'Convocatoria abierta para promotoras y modelos de protocolo con excelente presencia.',
      organizer: eventOrganizer || currentUser?.companyName || 'Empresa Verificada',
      organizerEmail: currentUser?.email,
      organizerCompany: currentUser?.companyName || currentUser?.name,
    });

    setShowCreateModal(false);
    setEventTitle('');
    setEventTagline('');
    setEventDescription('');
  };

  // Helper to open WhatsApp to coordinate with applicant model
  const handleWhatsAppCoordination = (app: EventApplicant, ev: EventItem) => {
    const cleanPhone = (app.phone || '').replace(/\D/g, '') || '584121234567';
    const text = encodeURIComponent(
      `Hola ${app.modelName}, te contacto de parte de ${ev.organizer} referente a tu postulación en DIFUSION para el evento "${ev.title}". Deseamos coordinar tu contratación y los detalles de protocolo y vestuario.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  // Helper to find matching model in database
  const findMatchingModel = (app: EventApplicant): ModelProfile | undefined => {
    return (
      models.find((m) => m.id === app.modelId) ||
      models.find((m) => m.name.toLowerCase() === app.modelName.toLowerCase())
    );
  };

  // Active event object for applicants modal if open
  const currentViewingEvent = selectedEventForApplicants
    ? events.find((e) => e.id === selectedEventForApplicants.id) || selectedEventForApplicants
    : null;

  return (
    <section className="py-8 sm:py-12 bg-black min-h-[75vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Convocatorias Oficiales & Castings Venezuela
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Próximos Eventos & Activaciones
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Salones automotrices, congresos corporativos y lanzamientos de marca en Venezuela. Convocatorias exclusivas gestionadas por DIFUSION.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {canCreateEvent ? (
              <button
                onClick={() => {
                  setEventOrganizer(
                    currentUser?.companyName ||
                      currentUser?.name ||
                      (isSuperAdmin ? 'DIFUSION Super Admin' : 'Empresa Verificada')
                  );
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Nuevo Evento / Casting</span>
              </button>
            ) : currentUser ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  Publicación exclusiva para <strong>Empresas</strong> y <strong>Super Admin</strong>
                </span>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 transition-colors"
              >
                <Building className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>¿Eres Empresa? Inicia Sesión para Publicar</span>
              </button>
            )}
          </div>
        </div>

        {/* Informative Banner for Clients */}
        {isClient && (
          <div className="mb-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 text-xs text-zinc-300">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <span>
                <strong>Modo Consulta para Clientes:</strong> Puedes revisar la agenda de eventos y el staff de promotoras asignado. La postulación y participación en castings está reservada exclusivamente a modelos y promotoras oficiales.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('catalogo')}
              className="text-[11px] font-bold text-[var(--color-primary)] hover:underline shrink-0"
            >
              Ver Modelos Disponibles →
            </button>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => {
            const assignedModelsList = models.filter((m) =>
              event.assignedModelIds.includes(m.id)
            );

            // Is the current logged in user the organizer of this event or Super Admin?
            const isOrganizer =
              isSuperAdmin ||
              (currentUser &&
                ((event.organizerEmail &&
                  currentUser.email.toLowerCase() === event.organizerEmail.toLowerCase()) ||
                  (currentUser.companyName &&
                    currentUser.companyName.toLowerCase() === event.organizer.toLowerCase()) ||
                  (currentUser.name &&
                    currentUser.name.toLowerCase() === event.organizer.toLowerCase())));

            // Has current model applied to this event?
            const modelApplicant = event.applicants?.find(
              (a) =>
                (currentModelProfile && a.modelId === currentModelProfile.id) ||
                (currentUser && a.modelName.toLowerCase() === currentUser.name.toLowerCase())
            );

            const pendingApplicantsCount = (event.applicants || []).filter(
              (a) => a.status === 'pendiente'
            ).length;

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
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[var(--color-primary)] text-black text-[11px] font-bold">
                        {event.status === 'casting_open' ? 'Casting Abierto' : 'Staff Asignado'}
                      </span>
                      {canCreateEvent && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la convocatoria "${event.title}"?`)) {
                              deleteEvent(event.id);
                            }
                          }}
                          className="p-1 rounded-lg bg-black/70 hover:bg-red-950 text-zinc-400 hover:text-red-300 border border-zinc-800 transition-colors"
                          title="Eliminar evento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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
                  {/* Meta details strip */}
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

                  {/* Action Buttons & Role Guard */}
                  <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
                    <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="truncate max-w-[170px]">{event.organizer}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap ml-auto">
                      {/* EMPRESA & SUPER ADMIN: Review applicants button */}
                      {isOrganizer && (
                        <button
                          onClick={() => setSelectedEventForApplicants(event)}
                          className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-bold border border-zinc-700 transition-all shadow-md active:scale-95 min-h-[40px]"
                        >
                          <Users className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          <span>Postuladas ({event.applicants?.length || 0})</span>
                          {pendingApplicantsCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[var(--color-primary)] text-black animate-pulse">
                              {pendingApplicantsCount} nueva{pendingApplicantsCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </button>
                      )}

                      {/* MODEL USER: Application workflow */}
                      {isModel ? (
                        modelApplicant ? (
                          modelApplicant.status === 'aprobada' ? (
                            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 min-h-[40px]">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>✓ ¡Aprobada por la Empresa! Staff Asignado</span>
                            </div>
                          ) : modelApplicant.status === 'pendiente' ? (
                            <div className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 min-h-[40px]">
                              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                              <span>⏳ Esperando Aprobación de la Empresa</span>
                            </div>
                          ) : (
                            <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs">
                              <span>Postulación finalizada</span>
                            </div>
                          )
                        ) : event.status === 'casting_open' ? (
                          <button
                            onClick={() => {
                              setApplicantName(currentModelProfile?.name || currentUser?.name || '');
                              setApplicantPhone(
                                currentModelProfile?.whatsappNumber || currentUser?.phone || ''
                              );
                              setApplicantInstagram(
                                currentModelProfile?.socialMedia?.instagram?.handle || ''
                              );
                              setSelectedEventForCasting(event);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-black text-xs font-bold transition-all shadow-[0_0_12px_rgba(57,255,20,0.3)] active:scale-95 min-h-[40px]"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Postularse al Casting</span>
                          </button>
                        ) : null
                      ) : isClient ? (
                        /* CLIENT: Informative view only (no postulation) */
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400">
                          <Eye className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span>Vista Informativa para Clientes</span>
                        </div>
                      ) : !currentUser ? (
                        /* Unauthenticated */
                        <button
                          onClick={() => setActiveTab('login')}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-colors"
                        >
                          <Lock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          <span>Inicia sesión como Modelo para postularte</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL: REVISIÓN DE MODELOS POSTULADAS (EMPRESAS & SUPER ADMIN) */}
        {selectedEventForApplicants && currentViewingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-2xl rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative my-auto max-h-[92vh] flex flex-col animate-fade-in">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-zinc-800 mb-4">
                <div>
                  <div className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>Panel de Selección & Contratación de Staff</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {currentViewingEvent.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Revisa los perfiles de las modelos postuladas, evalúa su mediakit, apruébalas para confirmar su staff y coordina por WhatsApp o chat directo.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEventForApplicants(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 mb-4 text-center">
                <div>
                  <div className="text-[11px] text-zinc-400">Total Postuladas</div>
                  <div className="text-base font-extrabold text-white">
                    {currentViewingEvent.applicants?.length || 0}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400">En Espera</div>
                  <div className="text-base font-extrabold text-amber-400">
                    {(currentViewingEvent.applicants || []).filter((a) => a.status === 'pendiente')
                      .length}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400">Staff Confirmado</div>
                  <div className="text-base font-extrabold text-[var(--color-primary)]">
                    {currentViewingEvent.assignedModelIds.length} /{' '}
                    {currentViewingEvent.requiredProfilesCount}
                  </div>
                </div>
              </div>

              {/* List of Applicants */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {(!currentViewingEvent.applicants || currentViewingEvent.applicants.length === 0) ? (
                  <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-500">
                    Aún no hay modelos postuladas a esta convocatoria. Cuando una modelo envíe su postulación, recibirás una notificación instantánea.
                  </div>
                ) : (
                  currentViewingEvent.applicants.map((app) => {
                    const matchedModel = findMatchingModel(app);

                    return (
                      <div
                        key={app.id}
                        className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                      >
                        {/* Model Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={app.modelAvatar}
                            alt={app.modelName}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-zinc-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm truncate">
                                {app.modelName}
                              </span>
                              {app.status === 'aprobada' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                                  ✓ Staff Aprobado
                                </span>
                              ) : app.status === 'pendiente' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                  ⏳ Pendiente
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-zinc-800 text-zinc-400 shrink-0">
                                  Descartada
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 flex-wrap">
                              {app.modelCity && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[var(--color-primary)]" />
                                  <span>{app.modelCity}</span>
                                </span>
                              )}
                              {app.phone && (
                                <span className="flex items-center gap-1 font-mono text-[11px]">
                                  <Phone className="w-3 h-3 text-zinc-500" />
                                  <span>{app.phone}</span>
                                </span>
                              )}
                              {app.instagram && (
                                <span className="flex items-center gap-1 text-[11px] text-pink-400">
                                  <Instagram className="w-3 h-3" />
                                  <span>{app.instagram}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions for Empresa */}
                        <div className="flex items-center gap-2 flex-wrap sm:shrink-0">
                          {/* View Full Profile */}
                          {matchedModel && (
                            <button
                              onClick={() => {
                                setSelectedModel(matchedModel);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1"
                              title="Ver Portafolio y Medidas"
                            >
                              <Eye className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                              <span>Ver Perfil</span>
                            </button>
                          )}

                          {/* Approve / Hire Button */}
                          {app.status !== 'aprobada' ? (
                            <button
                              onClick={() =>
                                reviewCastingApplicant(currentViewingEvent.id, app.id, true)
                              }
                              className="px-3 py-1.5 rounded-xl bg-[var(--color-primary)] text-black text-xs font-bold hover:brightness-110 transition-all shadow-[0_0_10px_rgba(57,255,20,0.3)] flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>✓ Aprobar y Contratar</span>
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                reviewCastingApplicant(currentViewingEvent.id, app.id, false)
                              }
                              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-medium"
                              title="Remover de staff"
                            >
                              Quitar
                            </button>
                          )}

                          {/* WhatsApp Coordination */}
                          <button
                            onClick={() => handleWhatsAppCoordination(app, currentViewingEvent)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                            title="Coordinar por WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Direct In-App Chat */}
                          {matchedModel && (
                            <button
                              onClick={() => {
                                setSelectedEventForApplicants(null);
                                setActiveChatModel(matchedModel);
                              }}
                              className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                              title="Abrir Chat Directo"
                            >
                              <Send className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => setSelectedEventForApplicants(null)}
                  className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-bold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Publicar Nuevo Evento (EMPRESAS & SUPER ADMIN ONLY) */}
        {showCreateModal && canCreateEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-xl rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-[var(--color-primary)]" />
                    Publicar Nueva Convocatoria de Evento
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Publicación autorizada para empresas verificadas y administración de DIFUSION.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleCreateEvent}
                className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs"
              >
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Título del Evento *</label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Ej. Salón Automotriz Caracas 2026"
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Eslogan Corto / Tagline</label>
                  <input
                    type="text"
                    value={eventTagline}
                    onChange={(e) => setEventTagline(e.target.value)}
                    placeholder="Ej. Exhibición de marcas de lujo y lanzamiento de nuevos modelos"
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Categoría</label>
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)]"
                    >
                      <option value="Salón Automotriz & Exhibición">Salón Automotriz & Exhibición</option>
                      <option value="Semana de la Moda & Pasarela">Semana de la Moda & Pasarela</option>
                      <option value="Activación de Marca BTL">Activación de Marca BTL</option>
                      <option value="Congreso Corporativo VIP">Congreso Corporativo VIP</option>
                      <option value="Feria Comercial & Industrial">Feria Comercial & Industrial</option>
                      <option value="Lanzamiento de Producto">Lanzamiento de Producto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Ciudad (Venezuela) *</label>
                    <select
                      value={eventCity}
                      onChange={(e) => setEventCity(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)]"
                    >
                      {availableCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Ubicación Específica</label>
                  <input
                    type="text"
                    value={eventSpecificLocation}
                    onChange={(e) => setEventSpecificLocation(e.target.value)}
                    placeholder="Ej. Centro de Convenciones C.C.C.T. Caracas"
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Fecha</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Horario</label>
                    <input
                      type="text"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      placeholder="Ej. 10:00 AM - 07:00 PM"
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Staff Requerido</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={requiredCount}
                      onChange={(e) => setRequiredCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Empresa Organizadora / Razón Social
                  </label>
                  <input
                    type="text"
                    value={eventOrganizer}
                    onChange={(e) => setEventOrganizer(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">URL de Imagen de Banner</label>
                  <input
                    type="url"
                    value={eventBanner}
                    onChange={(e) => setEventBanner(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Descripción y Requisitos de Selección
                  </label>
                  <textarea
                    rows={3}
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Detalles de vestuario, protocolo, funciones de stand y beneficios del evento..."
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-black font-bold flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Publicar Convocatoria</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: POSTULACIÓN AL CASTING (SOLO MODELOS) */}
        {selectedEventForCasting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Postulación de Modelo</span>
                </span>
                <button
                  onClick={() => setSelectedEventForCasting(null)}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                Postulación al Casting
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                {selectedEventForCasting.title} · Organizado por {selectedEventForCasting.organizer}
              </p>

              <form onSubmit={handleApply} className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Tu nombre y apellido"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">WhatsApp de Contacto (Venezuela) *</label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="+58 412 123 4567"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Usuario de Instagram (@)</label>
                  <input
                    type="text"
                    value={applicantInstagram}
                    onChange={(e) => setApplicantInstagram(e.target.value)}
                    placeholder="@tu_usuario"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-black border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
                  Al postularte, la empresa organizadora ({selectedEventForCasting.organizer}) recibirá una notificación inmediata con tu perfil y mediakit. Si te aprueban, quedarás confirmada en el staff oficial y podrán coordinar contigo por WhatsApp.
                </div>

                <div className="flex items-center gap-2 pt-2">
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
