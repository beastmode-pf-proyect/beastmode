'use client';

import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface SessionUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export default function AuthSessionProvider() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userData: SessionUser = {
        id: user.sub || '',
        email: user.email || '',
        name: user.name,
        picture: user.picture,
      };

      // Guardamos en localStorage
      localStorage.setItem('sessionUser', JSON.stringify(userData));
      setSessionUser(userData);
    } else {
      localStorage.removeItem('sessionUser');
      setSessionUser(null);
    }
  }, [isAuthenticated, user]);

  if (isLoading) return <p>⏳ Cargando sesión...</p>;

  return (
    <div style={{ padding: 16 }}>
      {sessionUser ? (
        <p>✅ Sesión activa como <strong>{sessionUser.name}</strong></p>
      ) : (
        <p>❌ No has iniciado sesión.</p>
      )}
    </div>
  );
}
