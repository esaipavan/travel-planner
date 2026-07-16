import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';

async function fetchUserRole(userId: string): Promise<UserRole> {
  const { data } = await supabase
    .from('profiles')
    .select('user_role')
    .eq('id', userId)
    .single();

  const raw = (data as { user_role: string } | null)?.user_role;

  if (
    raw === UserRole.ADMIN ||
    raw === UserRole.SUPER_ADMIN ||
    raw === UserRole.USER
  ) {
    return raw;
  }

  return UserRole.USER;
}

export function AuthInitializer() {
  const { setUser, setSession, setRole, setLoading, reset } = useAuthStore();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          setRole(role);
        }
      })
      .catch(() => {
        reset();
      })
      .finally(() => {
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const role = await fetchUserRole(session.user.id);
        setRole(role);
      } else {
        setRole(UserRole.USER);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setRole, setLoading, reset]);

  return null;
}
