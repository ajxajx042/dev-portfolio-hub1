import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/ApiService';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  avatar_url?: string;
  bio?: string;
  headline?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = apiService.getToken();
    if (token) {
      refreshUser().catch(() => {
        // Token is invalid, clear it
        apiService.setToken(null);
        setUser(null);
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiService.login(email, password);
    apiService.setToken(response.token);
    setUser(response.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await apiService.register(email, password, name);
    apiService.setToken(response.token);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      // Ignore errors during logout
    } finally {
      apiService.setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
