"use client";
import { useState } from "react";
import Image from "next/image";

export default function ExerciseForm() {
  const [exercise, setExercise] = useState({
    name: "",
    description: "",
    category: "",
    imageFile: null as File | null,
    previewUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    "Piernas",
    "Espalda",
    "Hombros",
    "Pecho",
    "Bíceps",
    "Tríceps",
    "Abdomen",
    "Cardio",
    "Glúteos",
    "Antebrazo",
    "Full Body",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setExercise((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setExercise((prev) => ({
        ...prev,
        imageFile: file,
        previewUrl,
      }));
    }
  };

  const handleFileRemove = () => {
    URL.revokeObjectURL(exercise.previewUrl);
    setExercise((prev) => ({
      ...prev,
      imageFile: null,
      previewUrl: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", exercise.name);
      formData.append("description", exercise.description);
      formData.append("category", exercise.category);
      if (exercise.imageFile) {
        formData.append("file", exercise.imageFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/exercises/create`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el ejercicio");
      }

      setSuccess(true);
      setExercise({
        name: "",
        description: "",
        category: "",
        imageFile: null,
        previewUrl: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error desconocido"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-2xl">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold mb-8 text-center text-red-950 uppercase tracking-wider">
          Crear Nuevo Ejercicio
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-200 rounded-lg border border-red-500/30">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 text-green-200 rounded-lg border border-green-500/30">
            ✅ ¡Ejercicio creado exitosamente!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-red-950 font-medium mb-2 text-lg">
              Nombre del Ejercicio
            </label>
            <input
              type="text"
              name="name"
              value={exercise.name}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-white/10 border border-red-900 rounded-xl text-red-950 focus:outline-none focus:ring-2 focus:ring-red-950 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-red-950 font-medium mb-2 text-lg">
              Descripción
            </label>
            <textarea
              name="description"
              value={exercise.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-5 py-3 bg-white/10 border border-red-900 rounded-xl text-red-950 focus:outline-none focus:ring-2 focus:ring-red-950 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-red-950 font-medium mb-2 text-lg">
              Categoría
            </label>
            <select
              name="category"
              value={exercise.category}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-white/10 border border-red-900 rounded-xl text-red-950 focus:outline-none focus:ring-2 focus:ring-red-950 transition-all"
              required>
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-red-950 font-medium mb-2 text-lg">
              Imagen del Ejercicio
            </label>
            <div className="relative group">
              <div className="flex items-center justify-center w-full px-5 py-3 bg-white/10 border border-red-900 rounded-xl text-red-950 focus:outline-none focus:ring-2 focus:ring-red-950 transition-all">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <span className="text-red-950 group-hover:text-red-950 transition-colors">
                  {exercise.imageFile
                    ? exercise.imageFile.name
                    : "Arrastra o haz clic para subir"}
                </span>
              </div>
            </div>

            {exercise.previewUrl && (
              <div className="mt-6 relative group">
                <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/20 bg-black/20">
                  <Image
                    src={exercise.previewUrl}
                    alt="Vista previa"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleFileRemove}
                  className="absolute top-2 right-2 px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors shadow-lg">
                  ✕ Eliminar
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-5 py-3 bg-red-950 border border-red-900 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-950 transition-all ${
              isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-300 hover:bg-white/30 hover:text-red-950 hover:scale-[1.01] active:scale-95"
            }  shadow-lg hover:shadow-xl`}>
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
                Creando...
              </span>
            ) : (
              "🎯 Crear Ejercicio"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
