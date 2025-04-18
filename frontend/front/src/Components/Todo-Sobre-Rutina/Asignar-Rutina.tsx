"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string;
}

interface Routine {
  id: string;
  name: string;
}

export default function AsignarRutina() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [rutinas, setRutinas] = useState<Routine[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRoutine, setSelectedRoutine] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRutinas, setLoadingRutinas] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`)
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => {
        console.error(err);
        toast.error("Error al obtener los usuarios");
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine`)
      .then((res) => res.json())
      .then((data) => setRutinas(data))
      .catch((err) => {
        console.error(err);
        toast.error("Error al obtener las rutinas");
      })
      .finally(() => setLoadingRutinas(false));
  }, []);

  const handleAsignar = async () => {
    if (!selectedUser || !selectedRoutine) {
      toast("Selecciona un usuario y una rutina", { icon: "⚠️" });
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-workout/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          routineId: selectedRoutine,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Rutina asignada correctamente");
        setSelectedUser("");
        setSelectedRoutine("");
      } else {
        toast.error(data.message || "No se pudo asignar la rutina");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al asignar la rutina");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-[#5e1914]/10 to-[#5e1914]/5 p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#5e1914] text-center">
            Asignar Rutina
          </h2>
          <p className="text-gray-600 text-center mt-1">Selecciona usuario y rutina para asignar</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Seleccionar Usuario
            </label>
            {loadingUsers ? (
              <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <div className="relative">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-[#5e1914]/50 focus:border-[#5e1914] outline-none transition-all"
                >
                  <option value="">Selecciona un usuario</option>
                  {usuarios.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.id}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Seleccionar Rutina
            </label>
            {loadingRutinas ? (
              <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <div className="relative">
                <select
                  value={selectedRoutine}
                  onChange={(e) => setSelectedRoutine(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-[#5e1914]/50 focus:border-[#5e1914] outline-none transition-all"
                >
                  <option value="">Selecciona una rutina</option>
                  {rutinas.map((rutina) => (
                    <option key={rutina.id} value={rutina.id}>
                      {rutina.name || rutina.id}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAsignar}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
              loadingUsers || loadingRutinas
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#5e1914] hover:bg-[#481410] shadow-md hover:shadow-lg"
            }`}
            disabled={loadingUsers || loadingRutinas}
          >
            {loadingUsers || loadingRutinas ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando...
              </span>
            ) : (
              "Asignar Rutina"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}