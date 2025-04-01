"use client";
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";

function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Debes iniciar sesión para acceder a esta página.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        router.push("/"); // Redirige al usuario a la página principal o de inicio de sesión
      });
    }
  }, [isLoading, isAuthenticated, router]);

  // Muestra un mensaje de carga mientras obtiene los datos
  if (isLoading) {
    return <div className="text-center text-xl text-gray-600">Cargando...</div>;
  }

  // Si el usuario no está autenticado, no renderiza el contenido
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="p-6">
      {/* Contenido principal Dashboard */}
      <div>
        <h2 className="text-3xl font-semibold text-[#5e1914]">Dashboard</h2>
        <p className="mt-4 text-gray-600">
          Bienvenido a tu panel de control. Administra tu información de manera fácil y rápida.
        </p>

        {/* Sección de Información del Usuario */}
        <div className="mt-8 bg-[#f8f8f8] p-6 rounded-lg shadow-lg border border-red-950/95">
          <h3 className="text-xl font-semibold text-red-950/95">Información del Usuario</h3>
          <div className="flex items-center space-x-6 mt-4">
            {/* Avatar del usuario */}
            {user.picture && (
              <div className="relative w-16 h-16">
              <Image
                src={user.picture}
                alt="Avatar"
                className="rounded-full border border-red-950/95"
                layout="fill"
                objectFit="cover"
              />
              </div>
            )}

            {/* Datos del usuario */}
            <div className="text-red-950/95">
              <p><span className="font-semibold">Nombre:</span> {user.name}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">ID de Usuario:</span> {user.sub}</p>
              <p><span className="font-semibold">Proveedor:</span> {user.sub?.split("|")[0]}</p>
              <p><span className="font-semibold">Fecha de Creación:</span> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;