import { authService } from '@/services/auth';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type UserRole = 'PARENT' | 'COACH';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------- INITIAL STATE ---------- */
function getInitialAuthState() {
  const user = authService.getUser();
  const token = authService.getToken();

  return {
    user: user && token ? user : null,
    isAuthenticated: !!(user && token),
  };
}

/* ---------- PROVIDER ---------- */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(
    getInitialAuthState().user
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    getInitialAuthState().isAuthenticated
  );
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- VERIFY ON APP LOAD ---------- */
  useEffect(() => {
    const storedUser = authService.getUser();
    const token = authService.getToken();

    if (storedUser && token) {
      setUser(storedUser);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  /* ---------- LOGIN ---------- */
  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });

    setUser(res.user);
    setIsAuthenticated(true);
  };

  /* ---------- LOGOUT ---------- */
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ---------- HOOK ---------- */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
