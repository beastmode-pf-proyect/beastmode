"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";

interface UserRoutine {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  routine: {
    id: string;
    name: string;
    description: string;
  };
  created_at: string;
}

interface GroupedRoutines {
  [userId: string]: UserRoutine[];
}

const UserRoutines = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userRoutines, setUserRoutines] = useState<GroupedRoutines>({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAllUserRoutines = async () => {
    if (!isAuthenticated || !user?.sub) return;

    try {
      const { data: trainerData } = await supabase
        .from("users2")
        .select("id")
        .eq("auth0_id", user.sub)
        .single();

      if (!trainerData) {
        throw new Error("No se encontró el entrenador.");
      }

      const { data, error } = await supabase
        .from("user_workout_routines")
        .select(
          `
          id,
          user:user_id (
            id,
            name,
            email
          ),
          routine:routine_id (
            id,
            name,
            description
          ),
          created_at
        `
        )
        .eq("assigned_by", trainerData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!Array.isArray(data)) {
        throw new Error("Los datos no son un array.");
      }

      // Agrupar rutinas por usuario
      const grouped = (data || []).reduce((acc: GroupedRoutines, routine) => {
        const userId = routine.user.id; // Asegúrate de que esto sea un objeto y no un array
        if (!acc[userId]) {
          acc[userId] = [];
        }
        acc[userId].push({
          id: routine.id,
          user: {
            id: routine.user.id,
            name: routine.user.name,
            email: routine.user.email,
          },
          routine: {
            id: routine.routine.id,
            name: routine.routine.name,
            description: routine.routine.description,
          },
          created_at: routine.created_at,
        });
        return acc;
      }, {});

      setUserRoutines(grouped);
    } catch (error) {
      console.error("Error fetching routines:", error);
      Swal.fire("Error", "Error al cargar las rutinas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUserRoutines();
  }, [isAuthenticated, user, fetchAllUserRoutines]);

  const handleDelete = async (id: string) => {
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
          .from("user_workout_routines")
          .delete()
          .eq("id", id);

        if (error) throw error;

        await fetchAllUserRoutines(); // Refresh data
        await Swal.fire(
          "¡Eliminado!",
          "La rutina ha sido eliminada",
          "success"
        );
      }
    } catch (error) {
      console.error("Error deleting routine:", error);
      Swal.fire("Error", "Error al eliminar la rutina", "error");
    }
  };

  const openModal = (userId: string) => {
    setSelectedUser(userId);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Usuarios con Rutinas
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(userRoutines).map(([userId, routines]) => (
          <div
            key={userId}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => openModal(userId)}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {routines[0]?.user.name || routines[0]?.user.email}
                </h3>
                <p className="text-sm text-gray-500">
                  {routines.length} rutina(s) asignada(s)
                </p>
              </div>
              <div className="text-blue-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Rutinas de{" "}
                  {userRoutines[selectedUser]?.[0]?.user.name ||
                    userRoutines[selectedUser]?.[0]?.user.email}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {userRoutines[selectedUser]?.map(routine => (
                  <div key={routine.id} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800">
                      {routine.routine.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {routine.routine.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Asignada:{" "}
                      {new Date(routine.created_at).toLocaleDateString()}
                    </p>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(routine.id);
                      }}
                      className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition duration-200">
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {Object.keys(userRoutines).length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No hay usuarios con rutinas asignadas
        </div>
      )}
    </div>
  );
};

export default UserRoutines;
