'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface SessionUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}


interface SessionUserContextType {
  user: SessionUser | null;
  loading: boolean;
}

const SessionUserContext = createContext<SessionUserContextType>({
  user: null,
  loading: true,
});


export const SessionUserProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        const userData: SessionUser = {
          id: user.sub || '',
          email: user.email || '',
          name: user.name,
          picture: user.picture,
        };
        setSessionUser(userData);
        sessionStorage.setItem('sessionUser', JSON.stringify(userData)); // opcional
      } else {
        setSessionUser(null);
        sessionStorage.removeItem('sessionUser'); // opcional
      }

      setLoading(false);
    }
  }, [isAuthenticated, isLoading, user]);

  return (
    <SessionUserContext.Provider value={{ user: sessionUser, loading }}>
      {children}
    </SessionUserContext.Provider>
  );
};

// Hook personalizado para consumirlo fácilmente
export const useSessionUser = () => useContext(SessionUserContext);
