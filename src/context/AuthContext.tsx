import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// Mock users for testing
const MOCK_USERS = [
  {
    id: 'admin-001',
    email: 'admin@nexusteam.com',
    password: 'Admin@123456',
    name: 'Platform Admin',
    role: 'admin' as const,
    avatar_url: null,
    bio: 'Platform administrator',
    headline: 'System Administrator',
  },
  {
    id: 'user-001',
    email: 'alex@example.com',
    password: 'User@123456',
    name: 'Alex Rivera',
    role: 'user' as const,
    avatar_url: null,
    bio: 'Full Stack Developer',
    headline: 'Full Stack Developer',
  },
  {
    id: 'user-002',
    email: 'maya@example.com',
    password: 'User@123456',
    name: 'Maya Patel',
    role: 'user' as const,
    avatar_url: null,
    bio: 'UI/UX Designer',
    headline: 'UI/UX Designer',
  },
  {
    id: 'user-003',
    email: 'james@example.com',
    password: 'User@123456',
    name: 'James Chen',
    role: 'user' as const,
    avatar_url: null,
    bio: 'Data Scientist',
    headline: 'Data Scientist',
  },
  {
    id: 'user-004',
    email: 'sofia@example.com',
    password: 'User@123456',
    name: 'Sofia Martinez',
    role: 'user' as const,
    avatar_url: null,
    bio: 'Interior Designer',
    headline: 'Interior Designer',
  },
  {
    id: 'user-005',
    email: 'ryan@example.com',
    password: 'User@123456',
    name: "Ryan O'Brien",
    role: 'user' as const,
    avatar_url: null,
    bio: 'DevOps Engineer',
    headline: 'DevOps Engineer',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const refreshUser = async () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }
  };

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find user in mock data
    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!mockUser) {
      throw new Error('Invalid email or password');
    }

    // Create user object (without password)
    const userData: User = {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
      avatar_url: mockUser.avatar_url || undefined,
      bio: mockUser.bio,
      headline: mockUser.headline,
    };

    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
    
    setUser(userData);
  };

  const register = async (email: string, password: string, name: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user already exists
    const exists = MOCK_USERS.find(u => u.email === email);
    if (exists) {
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser: User = {
      id: 'user-' + Date.now(),
      email,
      name,
      role: 'user',
      avatar_url: undefined,
      bio: '',
      headline: '',
    };

    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
    
    setUser(newUser);
  };

  const logout = async () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    setUser(null);
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
