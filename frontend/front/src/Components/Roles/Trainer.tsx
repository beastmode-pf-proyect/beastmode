"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function Trainer() {
  const [assignedUsers, setAssignedUsers] = useState<number | null>(null);

  useEffect(() => {
    fetchAssignedUsers();
  }, []);

  async function fetchAssignedUsers() {
    const { error, count } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("❌ Error al contar los usuarios asignados:", error.message);
      return;
    }

    setAssignedUsers(count ?? 0);
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-2 pt-12 bg-white">
      <div className="bg-[#5e1914] rounded-xl shadow-lg p-4 w-full max-w-sm text-center text-white">
        <h1 className="text-2xl font-bold mb-1">¡Hola, Entrenador!</h1>
        <p className="text-sm mb-4">
          Estás listo para motivar y transformar vidas 💪
        </p>

        <div className="bg-white text-[#5e1914] p-4 rounded-lg shadow-inner">
          <h2 className="text-base font-semibold">Usuarios asignados:</h2>
          <p className="text-3xl font-bold mt-1">
            {assignedUsers !== null ? assignedUsers : "Cargando..."}
          </p>
        </div>

        <button className="mt-4 px-4 py-2 bg-white text-[#5e1914] hover:bg-gray-100 font-medium rounded-lg transition">
          Ver detalles
        </button>
      </div>
    </div>
  );
}

export default Trainer;
