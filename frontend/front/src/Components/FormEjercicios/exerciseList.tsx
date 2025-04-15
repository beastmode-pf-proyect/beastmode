// components/ExerciseList.tsx
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
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {exercise.name}
            </h3>
            <div className="relative group">
              <p className="text-gray-600 mb-4 line-clamp-3 transition-all duration-200 group-hover:line-clamp-none group-hover:absolute group-hover:bg-white group-hover:p-4 group-hover:rounded-lg group-hover:shadow-md group-hover:z-10">
                {exercise.description}
              </p>
            </div>
            {exercise.imageUrl && (
              <div className="mb-4">
                <img
                  src={exercise.imageUrl}
                  alt={exercise.name}
                  className="w-full h-auto rounded-md object-cover"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
