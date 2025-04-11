"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";
import Image from "next/image";

interface User {
  id: number;
  email: string;
  role_id: number | null;
  name: string | null;
  auth0_id: string;
  picture: string | null;
  created_at?: string;
  is_blocked?: boolean;
}

interface Role {
  id: number;
  name: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);

  // Definición de fetchData
  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchRoles()]);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, );

  async function fetchUsers() {
    const { data, error } = await supabase
      .from("users2")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    setUsers(data || []);
  }

  async function fetchRoles() {
    const { data, error } = await supabase
      .from("roles")
      .select("id, name")
      .order("name");

    if (error) throw error;
    setRoles(data || []);
  }

  async function updateUserRole(userId: number, newRoleId: string) {
    if (!newRoleId) {
      return Swal.fire("Rol inválido", "Debes seleccionar un rol", "warning");
    }

    const selectedRole = roles.find(role => role.id === parseInt(newRoleId));
    if (!selectedRole) return;

    setUpdating(userId);
    try {
      const { error } = await supabase
        .from("users2")
        .update({ role_id: parseInt(newRoleId) })
        .eq("id", userId);

      if (error) throw error;

      setUsers(
        users.map(user =>
          user.id === userId ? { ...user, role_id: parseInt(newRoleId) } : user
        )
      );
      Swal.fire(
        "Éxito",
        `Rol actualizado a \"${selectedRole.name}\"`,
        "success"
      );
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire("Error", "No se pudo actualizar el rol", "error");
    } finally {
      setUpdating(null);
    }
  }

  async function deleteUser(userId: number) {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase.from("users2").delete().eq("id", userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      Swal.fire(
        "Eliminado",
        "El usuario fue eliminado exitosamente.",
        "success"
      );
    } catch (error) {
      console.error("Error al eliminar:", error);
      Swal.fire("Error", "No se pudo eliminar el usuario", "error");
    }
  }

  async function toggleBlockUser(userId: number, block: boolean) {
    try {
      const { error } = await supabase
        .from("users2")
        .update({ is_blocked: block })
        .eq("id", userId);

      if (error) throw error;

      setUsers(
        users.map(user =>
          user.id === userId ? { ...user, is_blocked: block } : user
        )
      );
      Swal.fire(
        block ? "Usuario bloqueado" : "Usuario desbloqueado",
        block
          ? "Este usuario ya no podrá iniciar sesión."
          : "Este usuario ahora puede iniciar sesión.",
        "info"
      );
    } catch (error) {
      console.error("Error al bloquear/desbloquear:", error);
      Swal.fire("Error", "No se pudo cambiar el estado del usuario", "error");
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-gray-800">
          Panel de Administración
        </h1>
        <button
          onClick={fetchData} // Llama a fetchData cuando se presiona el botón
          disabled={loading}
          className="px-4 py-2 bg-[#5e1914] text-white rounded hover:bg-[#7a2b24] disabled:opacity-50 text-sm">
          {loading ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {/* Tabla en escritorio */}
      <div className="overflow-x-auto shadow border rounded-xl bg-white w-full hidden md:block">
        <table className="min-w-[800px] w-full divide-y divide-gray-200">
          <thead className="bg-[#5e1914] text-white">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase">
                Usuario
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase">
                Email
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase">
                Rol
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase">
                Cambiar Rol
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-4 text-center text-gray-500 text-sm">
                  {loading
                    ? "Cargando usuarios..."
                    : "No hay usuarios registrados"}
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          user.picture ||
                          "https://www.gravatar.com/avatar/?d=mp"
                        }
                        alt={`Foto de ${user.name || "usuario"}`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {user.name || "Sin Nombre"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(user.created_at || "").toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-2 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role_id === 1
                          ? "bg-green-100 text-green-800"
                          : user.role_id === 2
                          ? "bg-blue-100 text-blue-800"
                          : user.role_id === 3
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {roles.find(r => r.id === user.role_id)?.name ||
                        "Sin rol"}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <select
                      className="text-sm border rounded px-2 py-1"
                      value={user.role_id ?? ""}
                      onChange={e => updateUserRole(user.id, e.target.value)}
                      disabled={updating === user.id}>
                      <option value="">Seleccionar...</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() =>
                          toggleBlockUser(user.id, !user.is_blocked)
                        }
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          user.is_blocked
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}>
                        {user.is_blocked ? "Desbloquear" : "Bloquear"}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-3 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards en móvil */}
      <div className="block md:hidden">
        {users.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-4">
            {loading ? "Cargando usuarios..." : "No hay usuarios registrados"}
          </p>
        ) : (
          <div className="space-y-4">
            {users.map(user => (
              <div
                key={user.id}
                className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={
                      user.picture || "https://www.gravatar.com/avatar/?d=mp"
                    }
                    alt={`Foto de ${user.name || "usuario"}`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {user.name || "Sin nombre"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(user.created_at || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-800 mb-1">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-sm mb-2">
                  <strong>Rol:</strong>{" "}
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.role_id === 1
                        ? "bg-green-100 text-green-800"
                        : user.role_id === 2
                        ? "bg-blue-100 text-blue-800"
                        : user.role_id === 3
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                    {roles.find(r => r.id === user.role_id)?.name || "Sin rol"}
                  </span>
                </p>
                <select
                  className="w-full text-sm border rounded px-2 py-1 mb-2"
                  value={user.role_id ?? ""}
                  onChange={e => updateUserRole(user.id, e.target.value)}
                  disabled={updating === user.id}>
                  <option value="">Cambiar rol...</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleBlockUser(user.id, !user.is_blocked)}
                    className={`flex-1 px-3 py-1 rounded text-xs font-semibold ${
                      user.is_blocked
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}>
                    {user.is_blocked ? "Desbloquear" : "Bloquear"}
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="flex-1 px-3 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
