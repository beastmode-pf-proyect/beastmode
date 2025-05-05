"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiActivity, FiClock, FiInfo, FiImage } from "react-icons/fi";

interface Exercise {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  isActive: boolean;
  duration?: number;
  difficulty?: string;
}

export default function ExerciseCards() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exercises`);
        if (!response.ok) throw new Error("Error al cargar ejercicios");
        const data = await response.json();
        const sanitizedData = data.map((ex: Exercise) => ({
          ...ex,
          imageUrl: ex.imageUrl || null
        }));
        setExercises(sanitizedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const toggleDescription = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-4 h-96 animate-pulse"
          >
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <FiInfo className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar ejercicios</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
      {exercises.map((exercise, index) => (
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
        >
          {/* Contenedor de imagen ajustado al contenido */}
          <div className="relative w-full aspect-video bg-white flex items-center justify-center">
            {exercise.imageUrl ? (
              <Image
                src={exercise.imageUrl}
                alt={exercise.name}
                width={400}
                height={225}
                className="object-contain w-full h-full"
                style={{
                  maxHeight: "225px",
                  objectFit: "contain"
                }}
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400 p-8">
                <FiImage className="text-4xl mb-2" />
                <span className="text-sm">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Contenido de la tarjeta */}
          <div className="p-6 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-00">{exercise.name}</h3>
              {exercise.difficulty && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {exercise.difficulty}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              {exercise.duration && (
                <div className="flex items-center text-gray-600 text-sm">
                  <FiClock className="mr-1.5" />
                  <span>{exercise.duration} min</span>
                </div>
              )}
              <div className="flex items-center text-gray-600 text-sm">
                <FiActivity className="mr-1.5" />
                <span>{exercise.isActive ? "Activo" : "Inactivo"}</span>
              </div>
            </div>

            <div className="mb-4 flex-grow">
              <button
                onClick={() => toggleDescription(exercise.id)}
                className="text-sm font-medium text-red-950 hover:text-red-800 transition-colors mb-1"
              >
                {expandedId === exercise.id ? 'Ocultar detalles' : 'Mostrar detalles'}
              </button>
              
              {expandedId === exercise.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-gray-600 text-sm whitespace-pre-line overflow-y-auto max-h-40"
                >
                  {exercise.description}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}