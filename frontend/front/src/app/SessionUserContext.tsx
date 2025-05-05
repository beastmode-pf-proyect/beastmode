"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface SessionUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

interface SessionUserContextType {
  user: SessionUser | null;
  loading: boolean;
  setSessionUser: (user: SessionUser | null) => void; // ✅ ahora incluimos setSessionUser
}

// Creamos el contexto inicial
const SessionUserContext = createContext<SessionUserContextType>({
  user: null,
  loading: true,
  setSessionUser: () => {}, // ✅ función por defecto vacía
});

export const SessionUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        const userData: SessionUser = {
          id: user.sub || "",
          email: user.email || "",
          name: user.name,
          picture: user.picture,
        };

        setSessionUser(userData);
        sessionStorage.setItem("id", userData.id);
        // Puedes guardar el usuario completo si quieres:
        // sessionStorage.setItem("user", JSON.stringify(userData));
      } else {
        setSessionUser(null);
        sessionStorage.removeItem("id");
        // sessionStorage.removeItem("user");
      }

      setLoading(false);
    }
  }, [isAuthenticated, isLoading, user]);

  return (
    <SessionUserContext.Provider value={{ user: sessionUser, loading, setSessionUser }}>
      {children}
    </SessionUserContext.Provider>
  );
};

export const useSessionUser = () => useContext(SessionUserContext);
