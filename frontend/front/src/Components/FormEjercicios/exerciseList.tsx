// components/ExerciseList.tsx
// components/ExerciseList.tsx
"use client";

import { useState, useEffect } from "react";
import { Exercise } from "./types";

export default function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exercises`);
        if (!response.ok) {
          throw new Error("Error al cargar los ejercicios");
        }
        const data = await response.json();
        setExercises(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Cargando ejercicios...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {exercise.name}
            </h3>
            <p className="text-gray-600 mb-4">{exercise.description}</p>
            <div className="relative aspect-video bg-gray-200 rounded-md overflow-hidden">
              {exercise.imageLink ? (
                <img
                  src={exercise.imageLink}
                  alt={exercise.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="flex items-center justify-center h-full text-gray-500">
                          <span>No se pudo cargar el GIF</span>
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <span>Sin imagen</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
