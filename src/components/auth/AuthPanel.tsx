import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { authConfigured, coursePath, supabase } from '../../lib/supabase';

type Step = 'email' | 'code';

function callbackUrl() {
  return new URL(coursePath('/auth/callback/'), window.location.origin).toString();
}

export default function AuthPanel() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const validEmail = useMemo(() => /^\S+@\S+\.\S+$/.test(email.trim()), [email]);

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!supabase || !validEmail) {
      setError('Enter a valid email address to continue.');
      return;
    }
    setBusy(true);
    const { error: requestError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: callbackUrl(), shouldCreateUser: true },
    });
    setBusy(false);
    if (requestError) {
      setError('We could not send a code right now. Please wait a moment and try again.');
      return;
    }
    setStep('code');
    setMessage('If this address can receive sign-in codes, a six-digit code is on its way.');
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!supabase || !/^\d{6}$/.test(code)) {
      setError('Enter the six-digit code from your email.');
      return;
    }
    setBusy(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code,
      type: 'email',
    });
    setBusy(false);
    if (verifyError) {
      setError('That code could not be verified. Check the latest email or request a new code.');
      return;
    }
    window.location.assign(coursePath('/profile/'));
  }

  if (!authConfigured) {
    return (
      <section className="auth-panel sketch-card" aria-labelledby="sign-in-title">
        <p className="sketch-label">Account connection</p>
        <h1 id="sign-in-title">Sign-in is being configured</h1>
        <p>The course remains free to read. Personal progress will be available once the secure account connection is live.</p>
      </section>
    );
  }

  return (
    <section className="auth-panel sketch-card" aria-labelledby="sign-in-title">
      <p className="sketch-label">Your learning notebook</p>
      <h1 id="sign-in-title">Save your progress</h1>
      <p className="auth-intro">Use your email to receive a one-time sign-in code. No password is created or stored by this course.</p>

      {step === 'email' ? (
        <form onSubmit={sendCode} noValidate>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={busy}
            required
          />
          <button className="auth-submit" type="submit" disabled={busy || !validEmail}>
            {busy ? 'Sending code…' : 'Send one-time code'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} noValidate>
          <label htmlFor="otp">Six-digit code</label>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
            disabled={busy}
            required
          />
          <button className="auth-submit" type="submit" disabled={busy || code.length !== 6}>
            {busy ? 'Checking code…' : 'Sign in securely'}
          </button>
          <button className="auth-text-button" type="button" disabled={busy} onClick={() => { setStep('email'); setCode(''); setMessage(''); setError(''); }}>
            Use a different email or request another code
          </button>
        </form>
      )}

      <p className="auth-status" role="status" aria-live="polite">{message}</p>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <p className="auth-privacy">We use your email only for account access. Your completed lesson items are stored separately under your account ID.</p>
    </section>
  );
}
