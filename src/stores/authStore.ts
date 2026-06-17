import { create } from "zustand";

/* =========================
   User Model
========================= */
export interface User {
  id: string;
  company_id: string;
  full_name: string;
  user_type: string;
  email: string;
  role: string;
  force_password_change: false;
}

/* =========================
   Store State
========================= */
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (token: string, user: User) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

/* =========================
   Store
========================= */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (token, user) =>{
    console.log(token, user)

    set({
      user,
      accessToken: token,
      isAuthenticated: true,
    })},

  setAccessToken: (token) =>
    set((state) => ({
      accessToken: token,
      isAuthenticated: Boolean(token && state.user),
    })),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),
}));
