import { useEffect, useRef, useState } from 'react';

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileLoader: Promise<TurnstileApi> | undefined;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileLoader) return turnstileLoader;

  turnstileLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => window.turnstile
      ? resolve(window.turnstile)
      : reject(new Error('Turnstile did not initialise.'));
    script.onerror = () => reject(new Error('Turnstile could not load.'));
    document.head.appendChild(script);
  });
  return turnstileLoader;
}

export default function TurnstileWidget({
  siteKey,
  onVerify,
  onExpired,
  onError,
}: {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpired: () => void;
  onError: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('Checking that you are a real learner…');

  useEffect(() => {
    let active = true;
    let widgetId: string | undefined;

    void loadTurnstile()
      .then((turnstile) => {
        if (!active || !container.current) return;
        widgetId = turnstile.render(container.current, {
          sitekey: siteKey,
          theme: 'auto',
          action: 'request_login_code',
          callback: (token: string) => {
            if (!active) return;
            setMessage('Human check complete.');
            onVerify(token);
          },
          'expired-callback': () => {
            if (!active) return;
            setMessage('Human check expired. Please complete it again.');
            onExpired();
          },
          'error-callback': () => {
            if (!active) return;
            setMessage('We could not complete the human check. Please refresh and try again.');
            onError();
          },
        });
      })
      .catch(() => {
        if (!active) return;
        setMessage('We could not load the human check. Please refresh and try again.');
        onError();
      });

    return () => {
      active = false;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onError, onExpired, onVerify, siteKey]);

  return (
    <div className="turnstile-check" aria-live="polite">
      <div ref={container} />
      <p>{message}</p>
    </div>
  );
}
