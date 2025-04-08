"use client";

import Link from "next/link";
import Image from "next/image";
import { legExercises } from "./items-Cloudinary";
import { useState } from "react";
import { ExerciseCardItemProps } from "./types";

const ExercisesComp = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar ejercicios basado en el término de búsqueda
  const filteredExercises = legExercises.filter(
    (exercise) =>
      exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.altText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      {/* Search Input */}
      <div className="mx-5 mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar ejercicios..."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-900 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Lista de Ejercicios */}
      <div className="w-full p-5 font-[Inter] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <ExerciseCardItem key={exercise.id} exercise={exercise} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-600 text-lg">
              No se encontraron ejercicios
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition-colors cursor-pointer"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ExerciseCardItem = ({ exercise }: ExerciseCardItemProps) => {
  return (
    <Link
      href={`/`}
      className="border-2 border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96">
        <Image
          src={exercise.imageUrl}
          alt={exercise.altText}
          fill
          className="object-cover"
          unoptimized={true}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="p-4 bg-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {exercise.title}
        </h3>
        <p className="text-sky-800 mt-3 text-xs">{exercise.assignedBy}</p>
      </div>
    </Link>
  );
};

export default ExercisesComp;
