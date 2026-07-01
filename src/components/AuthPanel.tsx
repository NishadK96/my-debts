import { FormEvent, useState } from 'react';
import { LockKeyhole } from 'lucide-react';

interface AuthPanelProps {
  error: string | null;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
}

export function AuthPanel({ error, onSignIn, onSignUp }: AuthPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      if (mode === 'signin') {
        await onSignIn(email, password);
      } else {
        const result = await onSignUp(email, password);
        if (result.needsEmailConfirmation) {
          setMode('signin');
          setSuccessMessage('Account created. Check your email and confirm it before signing in.');
        } else {
          setSuccessMessage('Account created. You are signed in.');
        }
      }
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <form onSubmit={submit} className="panel w-full max-w-md p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            <LockKeyhole size={22} />
          </div>
          <div>
            <p className="label">Live debt dashboard</p>
            <h1 className="text-xl font-bold text-slate-950 dark:text-white">
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Your debt data is saved to Supabase and synced from the hosted database after login.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="label">Email</span>
            <input className="field mt-1" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="block">
            <span className="label">Password</span>
            <input className="field mt-1" type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
        </div>

        {(formError || error) ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            {formError ?? error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-200">
            {successMessage}
          </div>
        ) : null}

        <button type="submit" disabled={busy} className="mt-5 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="mt-4 w-full text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300"
        >
          {mode === 'signin' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
        </button>
      </form>
    </main>
  );
}
