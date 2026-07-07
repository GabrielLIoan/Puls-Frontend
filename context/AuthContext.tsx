import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '../api/auth';
import { setUnauthorizedHandler, tokenStorage } from '../api/client';
import type { AuthUser } from '../types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean; // true while restoring a session on app launch
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app launch: if a token is already stored, verify it's still
  // valid by calling /auth/me rather than trusting it blindly — an
  // expired/revoked token should drop the user back to logged-out
  // state instead of showing a broken authenticated UI.
  useEffect(() => {
    async function restoreSession() {
      const token = await tokenStorage.get();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const me = await authApi.me();
        setUser(me);
      } catch {
        await tokenStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  // Wire the API client's global 401 handler to log the user out — this
  // is what makes an expired token anywhere in the app (not just on
  // launch) cleanly fall back to the login screen instead of a stuck
  // broken state.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      tokenStorage.clear();
      setUser(null);
    });
  }, []);

  async function login(email: string, password: string) {
    const result = await authApi.login(email, password);
    await tokenStorage.set(result.accessToken);
    setUser(result.user);
  }

  async function signup(email: string, password: string, displayName?: string) {
    const result = await authApi.signup(email, password, displayName);
    await tokenStorage.set(result.accessToken);
    setUser(result.user);
  }

  async function logout() {
    await tokenStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      isLoading: true,
      login: async () => {},
      signup: async () => {},
      logout: async () => {},
    };
  }
  return ctx;
}