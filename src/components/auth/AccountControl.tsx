import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { authConfigured, coursePath, supabase } from '../../lib/supabase';

export default function AccountControl() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!authConfigured) {
    return (
      <a className="auth-link auth-link-muted" href={coursePath('/login/')} aria-label="Open sign-in page">
        <span aria-hidden="true">◌</span><span className="auth-copy">Sign in</span>
      </a>
    );
  }

  if (!session) {
    return (
      <a className="auth-link" href={coursePath('/login/')}>
        <span aria-hidden="true">◌</span><span className="auth-copy">Sign in</span>
      </a>
    );
  }

  return (
    <a className="auth-link auth-link-signed-in" href={coursePath('/profile/')}>
      <span aria-hidden="true">●</span><span className="auth-copy">My learning</span>
    </a>
  );
}
