"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";
import WorkoutRoutineList from "@/Components/Rutinas/Rutinas";



const WorkoutRoutineForm = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      Swal.fire("Error", "Debes iniciar sesión", "error");
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase
        .from("users2")
        .select("id")
        .eq("auth0_id", user.sub)
        .single();

      if (userError || !userData) {
        console.error("Error al obtener usuario:", userError);
        throw new Error("No se encontró el usuario en Supabase");
      }

      const { error } = await supabase.from("workout_routine").insert({
        name: formData.name,
        description: formData.description || null,
        imageUrl: formData.imageUrl || null,
        isActive: true,
        created_by: userData.id,
      });

      if (error) {
        console.error("Error al insertar rutina:", error);
        throw error;
      }

      await Swal.fire("¡Éxito!", "La rutina se ha guardado correctamente", "success");
      setFormData({ name: "", description: "", imageUrl: "" });
    } catch (error: unknown) {
      console.error("Error completo:", error);
      if (error instanceof Error) {
        Swal.fire("Error", error.message || "Ocurrió un error inesperado", "error");
      } else {
        Swal.fire("Error", "Ocurrió un error inesperado", "error");
      }
    }
  };

  if (isLoading) return <p className="text-center mt-10">⏳ Cargando...</p>;
  if (!isAuthenticated) return <p className="text-center mt-10 text-red-500">❌ No has iniciado sesión.</p>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800">📋 Crear Nueva Rutina</h2>

        <input
          type="text"
          name="name"
          placeholder="Nombre de la rutina"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <textarea
          name="description"
          placeholder="Descripción de la rutina"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="URL de la imagen (opcional)"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          💾 Guardar Rutina
        </button>
      </form>
      <WorkoutRoutineList />
    </div>
  );
};

export default WorkoutRoutineForm;