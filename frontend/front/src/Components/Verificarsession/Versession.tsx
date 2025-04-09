'use client';

import { useSessionUser } from '@/app/SessionUserContext';

export default function AuthCheck() {
  const { user, loading } = useSessionUser();

  if (loading) return <p>Verificando sesión...</p>;
  
  return (
    <div className="p-4 text-center">
      {user ? (
        <div>
          <p className="text-green-600">Sesión iniciada como: {user.email}</p>
          <p className="text-sm text-gray-600">ID: {user.id}</p>
        </div>
      ) : (
        <p className="text-red-600">No has iniciado sesión</p>
      )}
    </div>
  );
}