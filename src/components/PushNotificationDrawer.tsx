import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bell,
  CheckCheck,
  Send,
  Sparkles,
  Calendar,
  MessageCircle,
  Video,
  ShieldCheck,
} from 'lucide-react';

interface PushNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PushNotificationDrawer: React.FC<PushNotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    sendPushNotification,
    showToast,
  } = useApp();

  if (!isOpen) return null;

  const handleRequestNativePermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast('¡Permiso de notificaciones push concedido!');
        sendPushNotification(
          '🔔 Notificaciones Push Activadas',
          'Recibirás alertas en tiempo real sobre bookings, castings y transmisiones en vivo.',
          'system'
        );
      } else {
        showToast('Notificaciones denegadas o no compatibles.');
      }
    } else {
      showToast('Tu navegador no soporta Web Push API.');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'casting':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'stream':
        return <Video className="w-4 h-4 text-red-400" />;
      default:
        return <Bell className="w-4 h-4 text-[var(--color-primary)]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm h-full bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[var(--color-primary)]" />
            <h3 className="text-sm font-bold text-white">Notificaciones en Tiempo Real</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action strip */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/40 text-xs text-zinc-400">
          <button
            onClick={handleRequestNativePermission}
            className="text-[var(--color-primary)] font-semibold hover:underline"
          >
            Activar Push en el Navegador
          </button>
          <button
            onClick={clearAllNotifications}
            className="text-zinc-400 hover:text-white"
          >
            Marcar todo leído
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-xs text-zinc-500">
              No tienes notificaciones pendientes.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-zinc-900/40 border-zinc-900 opacity-75'
                    : 'bg-zinc-900 border-zinc-800 shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-black border border-zinc-800 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 font-normal leading-relaxed mt-1">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Send test alert CTA for preview testing */}
        <div className="p-3 border-t border-zinc-900 bg-black">
          <button
            onClick={() =>
              sendPushNotification(
                '⚡ Prueba de Push en Vivo',
                'El sistema de notificaciones está funcionando al 100% en tiempo real.',
                'system'
              )
            }
            className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300"
          >
            Enviar Alerta de Prueba
          </button>
        </div>

      </div>
    </div>
  );
};
