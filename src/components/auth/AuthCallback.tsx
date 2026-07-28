import { useEffect, useState } from 'react';
import { authConfigured, coursePath, supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const [message, setMessage] = useState('Securing your sign-in…');

  useEffect(() => {
    if (!authConfigured || !supabase) {
      setMessage('Account sign-in is not configured yet.');
      return;
    }
    const client = supabase;
    const code = new URLSearchParams(window.location.search).get('code');
    const finish = async () => {
      if (code) {
        const { error } = await client.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage('We could not finish that sign-in. Please request a new code.');
          return;
        }
      }
      const { data } = await client.auth.getSession();
      if (data.session) {
        window.location.replace(coursePath('/profile/'));
      } else {
        setMessage('Your link has expired or was already used. Please request a new code.');
      }
    };
    void finish();
  }, []);

  return <p className="auth-callback-status" role="status" aria-live="polite">{message}</p>;
}
