import type { User } from '@supabase/supabase-js';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { sampleState } from '../data/sampleData';
import { supabase } from '../lib/supabase';
import type { AppState } from '../types';

interface RemoteStateResult {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
  user: User | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

export function useSupabaseAppState(): RemoteStateResult {
  const [state, setState] = useState<AppState>(sampleState);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedUserId = useRef<string | null>(null);

  const loadState = useCallback(async (currentUser: User) => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('app_states')
      .select('data')
      .eq('user_id', currentUser.id)
      .maybeSingle();

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    if (data?.data) {
      setState(data.data as AppState);
    } else {
      const { error: insertError } = await supabase
        .from('app_states')
        .insert({ user_id: currentUser.id, data: sampleState });

      if (insertError) setError(insertError.message);
      setState(sampleState);
    }

    loadedUserId.current = currentUser.id;
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        void loadState(currentUser);
      } else {
        setLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      loadedUserId.current = null;
      if (currentUser) {
        void loadState(currentUser);
      } else {
        setState(sampleState);
        setLoading(false);
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, [loadState]);

  useEffect(() => {
    if (!supabase || !user || loading || loadedUserId.current !== user.id) return;
    const client = supabase;

    const timeout = window.setTimeout(async () => {
      setSaving(true);
      setError(null);

      const { error: saveError } = await client
        .from('app_states')
        .upsert({ user_id: user.id, data: state, updated_at: new Date().toISOString() });

      if (saveError) setError(saveError.message);
      setSaving(false);
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [loading, state, user]);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return;
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { needsEmailConfirmation: false };
    setError(null);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) throw signUpError;

    return { needsEmailConfirmation: !data.session };
  };

  const signOut = async () => {
    if (!supabase) return;
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
  };

  return { state, setState, user, loading, saving, error, signIn, signUp, signOut };
}
