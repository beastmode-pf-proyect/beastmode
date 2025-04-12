// components/ExerciseForm.tsx
"use client";

import { useState } from "react";
import { Exercise } from "./types";

export default function ExerciseForm() {
  const [exercise, setExercise] = useState<Exercise>({
    name: "",
    description: "",
    imageLink: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExercise((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:3000/exercises/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exercise),
      });

      if (!response.ok) {
        throw new Error("Error al crear el ejercicio");
      }

      setSuccess(true);
      setExercise({
        name: "",
        description: "",
        imageLink: "",
      });

      // Puedes recargar los ejercicios aquí si es necesario
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error desconocido"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Crear Nuevo Ejercicio
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          ¡Ejercicio creado exitosamente!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-2"
          >
            Nombre del Ejercicio
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={exercise.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Descripción del Ejercicio
          </label>
          <textarea
            id="description"
            name="description"
            value={exercise.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="imageLink"
            className="block text-gray-700 font-medium mb-2"
          >
            Link de la imagen
          </label>
          <input
            type="url"
            id="imageLink"
            name="imageLink"
            value={exercise.imageLink}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://ejemplo.com/ejercicio.jpg.png.gif"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting
              ? "bg-red-400"
              : "bg-red-900 hover:bg-red-950 hover:cursor-pointer"
          } transition duration-200`}
        >
          {isSubmitting ? "Enviando..." : "Crear Ejercicio"}
        </button>
      </form>
    </div>
  );
}
