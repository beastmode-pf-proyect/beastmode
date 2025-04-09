"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";

interface User {
  id: string;
  name: string;
  email: string;
  role_id: string;
  auth0_id: string;
}

interface Routine {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  created_by: string;
}

const AssignRoutine = () => {
  const { user, isAuthenticated } = useAuth0();
  const [users, setUsers] = useState<User[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRoutine, setSelectedRoutine] = useState("");
  const [loading, setLoading] = useState(true);
  const [trainerId, setTrainerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user?.sub) {
        setLoading(false);
        return;
      }

      try {
        const { data: trainerData, error: trainerError } = await supabase
          .from("users2")
          .select("id")
          .eq("auth0_id", user.sub)
          .single();

        if (trainerError) {
          console.error("Trainer fetch error:", trainerError);
          throw new Error(trainerError.message);
        }

        setTrainerId(trainerData.id);

        const { data: roleData, error: roleError } = await supabase
          .from("roles")
          .select("id")
          .eq("name", "user")
          .single();

        if (roleError) {
          console.error("Role fetch error:", roleError);
          throw new Error(roleError.message);
        }

        const [usersResponse, routinesResponse] = await Promise.all([
          supabase
            .from("users2")
            .select("id, name, email, role_id, auth0_id")
            .eq("role_id", roleData.id)
            .eq("is_blocked", false),
          supabase
            .from("workout_routine")
            .select("id, name, description, imageUrl, isActive, created_by")
            .eq("created_by", trainerData.id)
            .eq("isActive", true),
        ]);

        if (usersResponse.error) throw new Error(usersResponse.error.message);
        if (routinesResponse.error)
          throw new Error(routinesResponse.error.message);

        setUsers(usersResponse.data || []);
        setRoutines(routinesResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          title: "Error",
          text: "Error al cargar los datos. Por favor, intente nuevamente.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedRoutine || !trainerId) {
      Swal.fire(
        "Error",
        "Por favor selecciona un usuario y una rutina",
        "error"
      );
      return;
    }

    try {
      // Check if user already has this routine
      const { data: existingRoutine, error: checkError } = await supabase
        .from("user_workout_routines")
        .select("id")
        .eq("user_id", selectedUser)
        .eq("routine_id", selectedRoutine)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw new Error(checkError.message);
      }

      if (existingRoutine) {
        await Swal.fire({
          title: "Rutina Duplicada",
          text: "El usuario ya tiene asignada esta rutina",
          icon: "warning",
        });
        return;
      }

      const { error } = await supabase.from("user_workout_routines").insert({
        user_id: selectedUser,
        routine_id: selectedRoutine,
        assigned_by: trainerId,
        assigned_by_role: "trainer",
      });

      if (error) throw new Error(error.message);

      await Swal.fire({
        title: "¡Éxito!",
        text: "Rutina asignada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setSelectedUser("");
      setSelectedRoutine("");
    } catch (error) {
      console.error("Error assigning routine:", error);
      Swal.fire("Error", "Error al asignar la rutina", "error");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-10 text-red-500">
        Por favor inicia sesión para continuar
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Asignar Rutina</h2>

      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Usuario</label>
          <select
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required>
            <option value="">Seleccionar usuario</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Rutina</label>
          <select
            value={selectedRoutine}
            onChange={e => setSelectedRoutine(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required>
            <option value="">Seleccionar rutina</option>
            {routines.map(routine => (
              <option key={routine.id} value={routine.id}>
                {routine.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
          Asignar Rutina
        </button>
      </form>
    </div>
  );
};

export default AssignRoutine;
