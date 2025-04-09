"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";
import Image from "next/image";

interface Routine {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  created_by: string;
  users2: {
    name: string;
    email: string;
  };
}

const WorkoutRoutineList = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchRoutines = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const { data: userData, error: userError } = await supabase
          .from("users2")
          .select("id")
          .eq("auth0_id", user.sub)
          .single();

        if (userError || !userData) {
          console.error("Error fetching user:", userError);
          return;
        }

        const { data, error } = await supabase
          .from("workout_routine")
          .select(
            `
            *,
            users2 (
              name,
              email
            )
          `
          )
          .eq("created_by", userData.id)
          .eq("isActive", true);

        if (error) {
          console.error("Error fetching routines:", error);
          return;
        }

        setRoutines(data || []);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "Error al cargar las rutinas", "error");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRoutines();
    }
  }, [isAuthenticated, user]);

  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setEditForm({
      name: routine.name,
      description: routine.description || "",
      imageUrl: routine.imageUrl || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoutine) return;

    try {
      const { error } = await supabase
        .from("workout_routine")
        .update({
          name: editForm.name,
          description: editForm.description || null,
          imageUrl: editForm.imageUrl || null,
        })
        .eq("id", editingRoutine.id);

      if (error) throw error;

      // Update local state
      setRoutines(
        routines.map(routine =>
          routine.id === editingRoutine.id
            ? {
                ...routine,
                name: editForm.name,
                description: editForm.description,
                imageUrl: editForm.imageUrl,
              }
            : routine
        )
      );

      setIsEditModalOpen(false);
      setEditingRoutine(null);
      await Swal.fire({
        title: "¡Actualizado!",
        text: "La rutina ha sido actualizada correctamente",
        icon: "success",
        timer: 2000,
      });
    } catch (error) {
      console.error("Error updating routine:", error);
      Swal.fire("Error", "Error al actualizar la rutina", "error");
    }
  };

  const handleDelete = async (routineId: string) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const { error } = await supabase
          .from("workout_routine")
          .update({ isActive: false })
          .eq("id", routineId);

        if (error) throw error;

        setRoutines(routines.filter(routine => routine.id !== routineId));
        await Swal.fire(
          "¡Eliminado!",
          "La rutina ha sido eliminada.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error deleting routine:", error);
      Swal.fire("Error", "Error al eliminar la rutina", "error");
    }
  };

  if (isLoading || loading)
    return <p className="text-center mt-10">⏳ Cargando...</p>;
  if (!isAuthenticated)
    return (
      <p className="text-center mt-10 text-red-500">
        ❌ No has iniciado sesión.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🏋️‍♂️ Mis Rutinas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map(routine => (
          <div key={routine.id} className="bg-white p-6 rounded-2xl shadow-xl">
            {routine.imageUrl && (
              <Image
                src={routine.imageUrl}
                alt={routine.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {routine.name}
            </h3>
            <p className="text-gray-600 mb-4">{routine.description}</p>
            <div className="text-sm text-gray-500 mb-4">
              <p>Creado por: {routine.users2?.name || routine.users2?.email}</p>
              <p>Estado: {routine.isActive ? "Activo" : "Inactivo"}</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleEdit(routine)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                ✏️ Editar
              </button>
              <button
                onClick={() => handleDelete(routine.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingRoutine ? "Editar Rutina" : "Crear Nueva Rutina"}
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                value={editForm.name}
                onChange={e =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Nombre de la rutina"
                required
              />
              <textarea
                value={editForm.description}
                onChange={e =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Descripción"
                rows={3}
              />
              <input
                type="text"
                value={editForm.imageUrl}
                onChange={e =>
                  setEditForm({ ...editForm, imageUrl: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="URL de la imagen"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingRoutine(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editingRoutine ? "Guardar Cambios" : "Crear Rutina"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutRoutineList;
