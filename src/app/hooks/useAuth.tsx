'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Amplify } from 'aws-amplify';
import { signInWithRedirect, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { authConfig } from '../auth-config';

// Only configure Amplify if auth is not disabled
const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
if (!isAuthDisabled) {
  Amplify.configure(authConfig, { ssr: true });
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(isAuthDisabled ? true : false);
  const [isLoading, setIsLoading] = useState(isAuthDisabled ? false : true);
  const [user, setUser] = useState<any>(isAuthDisabled ? { username: 'test-user' } : null);

  useEffect(() => {
    if (!isAuthDisabled) {
      checkAuth();
    }
  }, []);

  async function checkAuth() {
    if (isAuthDisabled) return;

    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      setUser(currentUser);
      setIsAuthenticated(!!session.tokens);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const login = () => {
    if (isAuthDisabled) return;
    signInWithRedirect({ provider: 'Google' });
  };

  const logout = async () => {
    if (isAuthDisabled) return;
    try {
      await signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
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
