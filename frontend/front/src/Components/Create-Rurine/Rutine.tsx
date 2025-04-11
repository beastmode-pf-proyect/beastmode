"use client";
import React, { useEffect, useState } from "react";
import EditUserModal from "./EditUserModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isTrainer: boolean;
}

const UserTable: React.FC = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${backendUrl}/users`);
        if (!response.ok) {
          throw new Error("Error al cargar los usuarios");
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los usuarios");
        setLoading(false);
        console.error("Error:", err);
      }
    };

    fetchUsers();
  }, [backendUrl]); // Agregado backendUrl como dependencia

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedUser: Partial<User>) => {
    try {
      if (selectedUser) {
        const response = await fetch(`${backendUrl}/users/${selectedUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        });
        if (!response.ok) {
          throw new Error("Error al actualizar el usuario");
        }
        const data = await response.json();
        setUsers(
          users.map(user =>
            user.id === selectedUser.id ? { ...user, ...data } : user
          )
        );
      }
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
    }
  };

  const handleUpdateTrainer = async (userId: string) => {
    try {
      const response = await fetch(`${backendUrl}/users/Admin/${userId}`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Error al actualizar estado de entrenador");
      }
      setUsers(
        users.map(user =>
          user.id === userId ? { ...user, isTrainer: !user.isTrainer } : user
        )
      );
    } catch (err) {
      console.error("Error al actualizar estado de entrenador:", err);
    }
  };

  if (loading)
    return <div className="text-center p-4">Cargando usuarios...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrenador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleUpdateTrainer(user.id)}
                    className={`px-2 py-1 rounded ${
                      user.isTrainer
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                    {user.isTrainer ? "Sí" : "No"}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditUserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default UserTable;
