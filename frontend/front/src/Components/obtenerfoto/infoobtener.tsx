"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  picture: string;
  email: string;
  auth0_id: string; 
  role: {
    name: string;
  };
}

export default function AuthenticatedUser() {
  const { isAuthenticated, isLoading, error, user, getAccessTokenSilently } = useAuth0();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [apiError, setApiError] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener usuarios");
        
        const usersData: User[] = await response.json();

        
        const auth0Id = user?.sub;
        const matchedUser = usersData.find((u) => u.auth0_id === auth0Id);

        if (matchedUser) {
          setCurrentUser(matchedUser);
        } else {
          setApiError("Usuario no encontrado en la base de datos");
        }
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Error desconocido");
      }
    };

    if (isAuthenticated) fetchUserData();
  }, [isAuthenticated, getAccessTokenSilently, user?.sub]);

  if (isLoading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!isAuthenticated) return <div className="p-4">No estás autenticado</div>;
  if (apiError) return <div className="p-4 text-red-500">Error: {apiError}</div>;

  if (!currentUser) return <div className="p-4">Cargando usuario...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center p-4 bg-white rounded-xl shadow-md space-x-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
    <Image
      src={currentUser?.picture || "/avatar2.avif"}
      alt={currentUser?.name || "Usuario"}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover"
      onError={(e) => {
        e.currentTarget.src = "/placeholder.png";
      }}
    />
  </div>
        
        <div>
          <h2 className="text-lg font-semibold">{currentUser.name}</h2>
          <p className="text-sm text-gray-500">{currentUser.email}</p>
          {currentUser.role?.name === "admin" && (
            <span className="text-sm text-blue-500 font-semibold">Administrador</span>
          )}
        </div>
      </div>
    </div>
  );
}
