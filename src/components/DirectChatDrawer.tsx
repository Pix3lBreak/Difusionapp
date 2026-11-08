import React, { useState } from 'react';
import { ModelProfile } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  Calculator,
  MessageCircle,
  Lock,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface DirectChatDrawerProps {
  model: ModelProfile;
  onClose: () => void;
}

export const DirectChatDrawer: React.FC<DirectChatDrawerProps> = ({
  model,
  onClose,
}) => {
  const {
    chatMessages,
    sendMessage,
    generateWhatsAppUrl,
    currentUser,
    currentModelProfile,
    isSuperAdmin,
    setActiveTab,
    showToast,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [eventName, setEventName] = useState('Activación Salón Automotriz');
  const [eventHours, setEventHours] = useState(8);
  const [eventDate, setEventDate] = useState('2026-06-15');

  const messages = chatMessages[model.id] || [];
  const isModelViewing = currentModelProfile?.id === model.id;
  const isOwnMessage = (m: (typeof messages)[0]) => (isModelViewing ? !m.isFromUser : m.isFromUser);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(model.id, inputMessage);
    setInputMessage('');
  };

  const handleSendQuote = () => {
    const total = eventHours * model.hourlyRate;
    const quoteText = `Solicitud formal de cotización para "${eventName}" el ${eventDate} por ${eventHours} horas. Total estimado: $${total} USD.`;
    sendMessage(model.id, quoteText, true, {
      modelName: model.name,
      eventName,
      eventDate,
      hours: eventHours,
      totalUsd: total,
    });
    setShowQuoteBuilder(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl relative">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={model.avatar}
              alt={model.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--color-primary)]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">{model.name}</h3>
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              </div>
              <p className="text-[11px] text-zinc-400">
                {model.roleLabel} · Coordinación DIFUSION
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/40 text-xs">
          <button
            onClick={() => setShowQuoteBuilder(!showQuoteBuilder)}
            className="flex items-center gap-1.5 text-[var(--color-primary)] font-semibold hover:underline"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Generar Cotización Formal</span>
          </button>

          <a
            href={generateWhatsAppUrl(
              model.whatsappNumber,
              model.name,
              `Coordinación vía Chat DIFUSION`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 font-semibold hover:underline"
          >
            <span>Pasar a WhatsApp</span>
          </a>
        </div>

        {/* Interactive Quote Builder Form */}
        {showQuoteBuilder && (
          <div className="p-4 bg-zinc-900 border-b border-zinc-800 space-y-3">
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Cotizador Rápido para {model.name}</span>
              <span className="text-[var(--color-primary)]">${model.hourlyRate}/hora</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-zinc-400">Nombre de Evento</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400">Fecha del Evento</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-zinc-800 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-zinc-300 font-bold">
                Total: ${(eventHours * model.hourlyRate)} USD
              </span>
              <button
                type="button"
                onClick={handleSendQuote}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-black text-xs font-bold hover:opacity-90"
              >
                Insertar en el Chat
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-black/60">
          {messages.length === 0 ? (
            <div className="text-center py-10 text-xs text-zinc-500">
              Escribe un mensaje para iniciar la coordinación directa.
            </div>
          ) : (
            messages.map((m) => {
              const isMine = isOwnMessage(m);
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-zinc-400 mb-0.5 px-1 font-semibold">
                    {m.senderName}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isMine
                        ? 'bg-[var(--color-primary)] text-black font-medium rounded-br-none shadow-md'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none'
                    }`}
                  >
                    {m.isQuoteRequest && (
                      <div className="mb-1.5 pb-1.5 border-b border-black/20 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        COTIZACIÓN OFICIAL ENVIADA
                      </div>
                    )}
                    <p>{m.text}</p>
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-500">
                    <span>{m.timestamp}</span>
                    {isMine && <CheckCheck className="w-3 h-3 text-[var(--color-primary)]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Suggested Queries */}
        <div className="px-4 py-2 border-t border-zinc-900 bg-zinc-950 flex gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
          <button
            onClick={() => setInputMessage('¿Tienes disponibilidad para la primera semana del próximo mes?')}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 whitespace-nowrap hover:bg-zinc-800"
          >
            Disponibilidad fecha
          </button>
          <button
            onClick={() => setInputMessage('¿Cuentas con vestuario corporativo propio o se coordina con la agencia?')}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 whitespace-nowrap hover:bg-zinc-800"
          >
            Consulta vestuario
          </button>
          <button
            onClick={() => setInputMessage('Necesitamos confirmar 3 promotoras para un stand de 3 días.')}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 whitespace-nowrap hover:bg-zinc-800"
          >
            Staff múltiple
          </button>
        </div>

        {/* Chat Input or RBAC Guard */}
        {!currentUser ? (
          <div className="p-4 bg-zinc-900 border-t border-zinc-800 space-y-2">
            <div className="text-xs text-zinc-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <span>Debes autenticarte como <strong>Cliente</strong> o <strong>Empresa</strong> para enviar mensajes directos a las promotoras.</span>
            </div>
            <button
              onClick={() => {
                onClose();
                setActiveTab('login');
              }}
              className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs shadow-md hover:opacity-90 transition-all"
            >
              Iniciar Sesión / Registro
            </button>
          </div>
        ) : currentUser.status === 'standby' ? (
          <div className="p-4 bg-amber-500/10 border-t border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Cuenta en Standby: </span>
              El Super Admin debe activar tu perfil antes de que puedas enviar mensajes directos a las promotoras.
            </div>
          </div>
        ) : currentUser.role === 'model' && !isSuperAdmin && currentModelProfile?.id !== model.id ? (
          <div className="p-4 bg-zinc-950 border-t border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Restricción entre Modelos: </span>
              Las promotoras no pueden contratarse entre ellas. Solo un perfil de Cliente o Empresa verificado puede enviar mensajes y contratar.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isModelViewing
                  ? `Responder como ${model.name}...`
                  : isSuperAdmin
                  ? `Responder como Administración...`
                  : `Escribe tu mensaje a ${model.name}...`
              }
              className="flex-1 px-3 py-2.5 bg-black rounded-xl text-xs text-white placeholder-zinc-500 border border-zinc-800 focus:outline-none focus:border-[var(--color-primary)]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[var(--color-primary)] text-black hover:opacity-90 font-bold transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
