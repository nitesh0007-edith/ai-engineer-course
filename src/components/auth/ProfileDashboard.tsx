import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { authConfigured, coursePath, supabase } from '../../lib/supabase';

type ProgressState = 'loading' | 'ready' | 'unavailable';

export default function ProfileDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [completed, setCompleted] = useState(0);
  const [status, setStatus] = useState<ProgressState>('loading');

  useEffect(() => {
    if (!supabase) {
      setStatus('unavailable');
      return;
    }
    const client = supabase;
    let active = true;
    const load = async () => {
      const { data: userData } = await client.auth.getUser();
      if (!active) return;
      if (!userData.user) {
        setStatus('ready');
        return;
      }
      setUser(userData.user);
      const { count, error } = await client
        .from('lesson_progress')
        .select('lesson_id', { count: 'exact', head: true })
        .eq('user_id', userData.user.id)
        .not('completed_at', 'is', null);
      if (!active) return;
      if (!error) setCompleted(count ?? 0);
      setStatus(error ? 'unavailable' : 'ready');
    };
    void load();
    return () => { active = false; };
  }, []);

  async function signOut() {
    await supabase?.auth.signOut();
    window.location.assign(coursePath('/'));
  }

  if (!authConfigured || status === 'unavailable') {
    return (
      <section className="profile-card sketch-card"><h1>Learning profile unavailable</h1><p>We could not load secure progress right now. Your local lesson checklist remains available in this browser.</p></section>
    );
  }

  if (status === 'loading') {
    return <section className="profile-card sketch-card"><p role="status">Loading your learning notebook…</p></section>;
  }

  if (!user) {
    return (
      <section className="profile-card sketch-card">
        <p className="sketch-label">Your learning notebook</p><h1>Keep your progress with you</h1>
        <p>Sign in with an email one-time code to save completed lesson items to your private profile.</p>
        <a className="auth-submit profile-cta" href={coursePath('/login/')}>Sign in</a>
      </section>
    );
  }

  return (
    <section className="profile-card sketch-card" aria-labelledby="profile-title">
      <p className="sketch-label">Your learning notebook</p>
      <h1 id="profile-title">Welcome back</h1>
      <p className="profile-email">Signed in as <strong>{user.email}</strong></p>
      <div className="profile-progress">
        <span className="profile-number">{completed}</span>
        <span>lessons completed<br />out of the 90-course roadmap</span>
      </div>
      <p>As you complete a lesson checklist, this profile saves the progress under your account. The course content remains free and public.</p>
      <div className="profile-actions">
        <a href={coursePath('/chapters/how-to-use-this-course/')}>Continue learning</a>
        <button type="button" onClick={signOut}>Sign out</button>
      </div>
    </section>
  );
}
