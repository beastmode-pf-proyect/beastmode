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

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => {
        console.error(err);
        toast.error("❌ Error al obtener los usuarios.");
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/workout-routine")
      .then((res) => res.json())
      .then((data) => setRutinas(data))
      .catch((err) => {
        console.error(err);
        toast.error("❌ Error al obtener las rutinas.");
      });
  }, []);

  const handleAsignar = async () => {
    if (!selectedUser || !selectedRoutine) {
      toast("Selecciona un usuario y una rutina.", { icon: "⚠️" });
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/user-workout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser,
          routineId: selectedRoutine,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Rutina asignada correctamente.");
        // Restablecer valores seleccionados
        setSelectedUser("");
        setSelectedRoutine("");
      } else {
        toast.error(`❌ Error: ${data.message || "No se pudo asignar la rutina."}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al asignar la rutina.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md border" style={{ borderColor: "#5e1914" }}>
      <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: "#5e1914" }}>
        Asignar Rutina
      </h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1" style={{ color: "#5e1914" }}>
          Seleccionar Usuario:
        </label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        >
          <option value="">Selecciona un usuario</option>
          {usuarios.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.id}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1" style={{ color: "#5e1914" }}>
          Seleccionar Rutina:
        </label>
        <select
          value={selectedRoutine}
          onChange={(e) => setSelectedRoutine(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        >
          <option value="">Selecciona una rutina</option>
          {rutinas.map((rutina) => (
            <option key={rutina.id} value={rutina.id}>
              {rutina.name || rutina.id}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAsignar}
        className="w-full text-white py-2 rounded-md transition-colors"
        style={{
          backgroundColor: "#5e1914",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#481410")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#5e1914")}
      >
        Asignar Rutina
      </button>
    </div>
  );
}
