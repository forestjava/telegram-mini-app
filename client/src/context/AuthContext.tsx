import { type ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { setAuthData, api } from '../api/client';
import { useQuery } from '@tanstack/react-query';
import type { BookingUser } from '@/types/booking';

interface AuthContextValue {
  isDetecting: boolean; 
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  user?: BookingUser;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isDetecting, setIsDetecting] = useState(true);
  const [user, setUser] = useState<BookingUser | undefined>();

  useEffect(() => {
    if (isDetecting) {
      const emulation = import.meta.env.VITE_TG_EMULATION_INIT_DATA;

      if (emulation) {
        // Режим эмуляции для локальной разработки
        setAuthData({
          type: 'Telegram',
          signature: emulation
        });
      }

      else if (window.Telegram?.WebApp) {
        const tgWebApp = window.Telegram.WebApp;
        setAuthData({
          type: 'Telegram',
          signature: tgWebApp.initData ?? ''
        });
        tgWebApp.ready();
        tgWebApp.expand();
      }

      setIsDetecting(false);
    }
  }, []);

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get<BookingUser>('/api/me'),
    enabled: !isDetecting,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data);
    }
  }, [data, isSuccess]);

  const value: AuthContextValue = {
    isDetecting, 
    isLoading,
    isSuccess,
    isError,
    user
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
