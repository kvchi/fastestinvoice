import { useCallback, useEffect, useMemo, useState } from 'react';
import ToastContext from './toast-context.js';

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(''), 3200);
    return () => window.clearTimeout(timer);
  }, [message]);

  const showToast = useCallback((nextMessage) => setMessage(nextMessage), []);
  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-atomic={true}
        aria-live={'polite'}
        className={`fixed bottom-6 right-6 z-60 max-w-sm rounded-xl bg-ink px-5 py-4 text-sm text-white shadow-2xl transition-all ${
          message ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
        role={'status'}
      >
        {message}
      </div>
    </ToastContext.Provider>
  );
}
