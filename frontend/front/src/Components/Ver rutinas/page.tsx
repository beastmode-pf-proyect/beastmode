"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image"

interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

const WorkoutRoutineList = () => {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);

  const fetchRoutines = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine`
      );
      if (!response.ok) throw new Error("Error al obtener las rutinas");
      const data = await response.json();
      setRoutines(data);
    } catch (error) {
      console.error("Error al obtener rutinas:", error);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleDeactivate = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine/desactivate/${id}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) throw new Error("Error al desactivar la rutina");
      await fetchRoutines(); 
      alert("Rutina desactivada exitosamente");
    } catch (error) {
      console.error("Error al desactivar la rutina:", error);
      alert("Error al desactivar la rutina");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Rutinas de Ejercicio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map(routine => (
          <div
            key={routine.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Image
              src={routine.imageUrl}
              alt={routine.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{routine.name}</h3>
              <p className="text-gray-600">{routine.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    routine.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {routine.isActive ? "Activa" : "Inactiva"}
                </span>
                {routine.isActive && (
                  <button
                    onClick={() => handleDeactivate(routine.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                    Desactivar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutRoutineList;
