"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Rutina {
  id: number;
  nombre: string;
  descripcion: string;
  dias: string[];
  ejercicios: {
    nombre: string;
    repeticiones: string;
    series: number;
  }[];
}

export default function RutinaUsuario() {
  const { user: auth0User, isAuthenticated, isLoading } = useAuth0();
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Debes iniciar sesión para ver tu rutina.",
        confirmButtonText: "Aceptar",
      });
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (auth0User?.sub) {
      fetchRutina(auth0User.sub);
    }
  }, [auth0User]);

  const fetchRutina = async (auth0_id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-workout/${auth0_id}`);
      if (!res.ok) throw new Error("No se pudo obtener la rutina");

      const data = await res.json();
      setRutina(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error al obtener la rutina:", err.message);
        setError("No se pudo cargar la rutina del usuario.");
      } else {
        console.error("Error desconocido al obtener la rutina:", err);
        setError("Ocurrió un error desconocido.");
      }
    }
  };

  if (isLoading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!rutina) return <p className="text-center">No hay rutina disponible.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md p-6 rounded-md">
      <h1 className="text-2xl font-bold text-[#5e1914] mb-4">Rutina: {rutina.nombre}</h1>
      <p className="mb-4 text-gray-700">{rutina.descripcion}</p>
      <p className="mb-2 text-gray-800 font-semibold">Días: {rutina.dias.join(", ")}</p>

      <div className="mt-4">
        <h2 className="text-xl font-bold text-[#5e1914] mb-2">Ejercicios</h2>
        {rutina.ejercicios.map((ejercicio, index) => (
          <div key={index} className="border p-3 mb-2 rounded-md">
            <p><strong>Nombre:</strong> {ejercicio.nombre}</p>
            <p><strong>Series:</strong> {ejercicio.series}</p>
            <p><strong>Repeticiones:</strong> {ejercicio.repeticiones}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
