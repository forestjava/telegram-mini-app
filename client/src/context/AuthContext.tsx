import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { AuthData } from '../api/client';
import { setAuthData, getAuthData } from '../api/client';

interface AuthContextValue {
  rawAuthData?: AuthData;
  isReady: boolean;
  client?: Record<string, unknown>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // if (window.Telegram?.WebApp) {
    //   const tgWebApp = window.Telegram.WebApp;
    //   setAuthData({
    //     type: 'Telegram',
    //     signature: tgWebApp.initData ?? ''
    //   });
    //   tgWebApp.ready();
    //   tgWebApp.expand();
    // }

    setIsReady(true);
  }, []);

  const value: AuthContextValue = {
    rawAuthData: getAuthData(),
    isReady,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be declared within an AuthProvider');
  }
  return context;
}
