import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const timerRef = useRef(null);

  const dismissNotification = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setNotification(null);
  }, []);

  const showNotification = useCallback((message, type = 'success', duration = 2700) => {
    if (!message) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setNotification({
      id: Date.now(),
      message,
      type
    });
    timerRef.current = setTimeout(() => {
      setNotification(null);
      timerRef.current = null;
    }, duration);
  }, []);

  // Listen for legacy custom events (e.g. tee_toast from contexts or external handlers)
  useEffect(() => {
    const handleLegacyToast = (e) => {
      const msg = e.detail?.message;
      const type = e.detail?.type || 'success';
      const duration = e.detail?.duration || 2700;
      if (msg) {
        showNotification(msg, type, duration);
      }
    };
    window.addEventListener('tee_toast', handleLegacyToast);
    return () => {
      window.removeEventListener('tee_toast', handleLegacyToast);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showNotification]);

  const isError = notification?.type === 'error';
  const isWarning = notification?.type === 'warning';

  return (
    <NotificationContext.Provider value={{ showNotification, dismissNotification, notification }}>
      {children}

      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="global-center-toast-wrapper"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 99999,
            pointerEvents: 'none',
            width: 'min(90vw, 440px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            key={notification.id}
            className="global-center-toast-card"
            style={{
              pointerEvents: 'auto',
              width: '100%',
              background: isError
                ? 'linear-gradient(155deg, rgba(68, 12, 28, 0.97), rgba(34, 5, 16, 0.98))'
                : isWarning
                ? 'linear-gradient(155deg, rgba(64, 24, 16, 0.97), rgba(34, 10, 12, 0.98))'
                : 'linear-gradient(155deg, rgba(58, 11, 45, 0.97), rgba(30, 4, 22, 0.98))',
              border: isError
                ? '1.5px solid rgba(248, 113, 113, 0.7)'
                : isWarning
                ? '1.5px solid rgba(250, 204, 21, 0.7)'
                : '1.5px solid var(--gold, #d4af37)',
              borderRadius: '18px',
              padding: '18px 22px',
              boxShadow: isError
                ? '0 22px 60px rgba(0, 0, 0, 0.75), 0 0 28px rgba(239, 68, 68, 0.25)'
                : '0 22px 60px rgba(0, 0, 0, 0.75), 0 0 32px rgba(212, 175, 55, 0.28)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              color: 'var(--cream, #fff5eb)',
              fontFamily: 'var(--font-sans, Manrope, sans-serif)',
              animation: 'globalToastPop 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                background: isError
                  ? 'rgba(239, 68, 68, 0.2)'
                  : isWarning
                  ? 'rgba(250, 204, 21, 0.2)'
                  : 'linear-gradient(135deg, rgba(246, 221, 160, 0.25), rgba(212, 175, 55, 0.2))',
                border: isError
                  ? '1px solid rgba(248, 113, 113, 0.5)'
                  : isWarning
                  ? '1px solid rgba(250, 204, 21, 0.5)'
                  : '1px solid rgba(212, 175, 55, 0.6)',
                color: isError ? '#f87171' : isWarning ? '#facc15' : 'var(--gold2, #f6dda0)'
              }}
            >
              {isError ? (
                <AlertCircle size={22} />
              ) : isWarning ? (
                <Info size={22} />
              ) : (
                <CheckCircle2 size={22} />
              )}
            </div>

            <div style={{ flex: 1, fontSize: '14px', fontWeight: 500, lineHeight: 1.45, color: '#fff5eb' }}>
              {notification.message}
            </div>

            <button
              type="button"
              onClick={dismissNotification}
              aria-label="Close notification"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 240, 208, 0.6)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    return {
      showNotification: (msg, type = 'success', duration = 2700) => {
        window.dispatchEvent(new CustomEvent('tee_toast', { detail: { message: msg, type, duration } }));
      },
      dismissNotification: () => {}
    };
  }
  return ctx;
};
