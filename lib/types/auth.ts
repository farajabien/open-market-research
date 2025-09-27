// Unified auth types for Open Market Research

// Unified auth types
export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  profile_url?: string;
};

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthActions {
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

export interface AuthContextType extends AuthState, AuthActions {}

// Auth step types for the auth flow
export type AuthStep = "login" | "magic-code" | "dashboard";

// Magic code verification
export interface MagicCodeData {
  email: string;
  code: string;
}

// Auth error types
export interface AuthError {
  code: string;
  message: string;
  details?: unknown;
}
