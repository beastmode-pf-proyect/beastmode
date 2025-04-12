"use client";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface User {
  auth0_id: string;
  name: string;
  email: string;
  role?: {
    name: string;
  };
  is_blocked: boolean;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'trainer' | 'client' | 'admin'>('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.warning(errorData.message || 'No hay usuarios');
        setUsers([]);
        return;
      }

      const data = await response.json();
      setUsers(data);
      
      if (data.length === 0) {
        toast.info('No hay usuarios');
      }
    } catch (error) {
      toast.error('Error loading users');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string, isBlocked: boolean) => {
    try {
      const action = isBlocked ? 'activate' : 'desactivate';
      const response = await fetch(`http://localhost:3000/users/${action}/${userId}`, {
        method: 'PUT'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} user`);
      }

      toast.success(`User ${isBlocked ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error(`Failed to ${isBlocked ? 'activate' : 'deactivate'} user`);
      console.error('Error:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      toast.success('Usuario eliminado exitosamente');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar usuario');
    }
  };

  const filteredUsers = users.filter(user => {
    const nameMatch = user.name?.toLowerCase().includes(searchName.toLowerCase()) ?? false;
    const roleMatch = roleFilter === 'all' || user.role?.name === roleFilter;
    return nameMatch && roleMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Usuarios</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar usuario por nombre"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="block w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'all' | 'trainer' | 'client' | 'admin')}
          className="block w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300"
        >
          <option value="all">Todos los roles</option>
          <option value="trainer">Entrenador</option>
          <option value="client">Cliente</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5e1914]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-[#5e1914] overflow-hidden">
            <thead className="bg-[#5e1914]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase first:rounded-tl-lg">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Estatus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase last:rounded-tr-lg">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#5e1914]/20">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.auth0_id} className="hover:bg-[#5e1914]/5 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role?.name === 'trainer' 
                          ? 'bg-blue-100 text-blue-800'
                          : user.role?.name === 'client'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role?.name === 'admin'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role?.name 
                          ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1) 
                          : 'Sin Rol'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.is_blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.is_blocked ? 'Inactivo' : 'Activo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleToggleStatus(user.auth0_id, user.is_blocked)}
                        className={`${
                          user.is_blocked ? 'bg-green-500' : 'bg-yellow-500'
                        } text-white px-3 py-1 rounded-md mr-2 hover:opacity-90 transition-opacity`}
                      >
                        {user.is_blocked ? 'Desbloquear' : 'Bloquear'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.auth0_id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:opacity-90 transition-opacity"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;