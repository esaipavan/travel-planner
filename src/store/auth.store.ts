import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { UserRole } from '@/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setRole: (role: UserRole) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  role: UserRole.USER,
  isAdmin: false,
  isSuperAdmin: false,
  isLoading: true,

  setUser: (user) => set({ user }),

  setSession: (session) => set({ session }),

  setRole: (role) =>
    set({
      role,
      isAdmin: role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN,
      isSuperAdmin: role === UserRole.SUPER_ADMIN,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () =>
    set({
      user: null,
      session: null,
      role: UserRole.USER,
      isAdmin: false,
      isSuperAdmin: false,
      isLoading: false,
    }),
}));
