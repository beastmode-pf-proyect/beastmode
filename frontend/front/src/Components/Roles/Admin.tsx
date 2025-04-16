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
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(7);

  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    const savedUsersPerPage = localStorage.getItem('usersPerPage');
    const savedRoleFilter = localStorage.getItem('roleFilter');

    if (savedPage) setCurrentPage(Number(savedPage));
    if (savedUsersPerPage) setUsersPerPage(Number(savedUsersPerPage));
    if (savedRoleFilter) setRoleFilter(savedRoleFilter as 'all' | 'trainer' | 'client' | 'admin');
  }, []);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
    localStorage.setItem('usersPerPage', usersPerPage.toString());
    localStorage.setItem('roleFilter', roleFilter);
  }, [currentPage, usersPerPage, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`);
      if (!response.ok) {
        const errorData = await response.json();
        toast.warning(errorData.message || 'No hay usuarios');
        setUsers([]);
        return;
      }
      const data = await response.json();
      setUsers(data);
      if (data.length === 0) toast.info('No hay usuarios');
    } catch (error) {
      toast.error('Error cargando usuarios');
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${action}/${userId}`, {
        method: 'PUT'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al ${action} usuario`);
      }
      toast.success(`Usuario ${isBlocked ? 'activado' : 'bloqueado'} exitosamente`);
      fetchUsers();
    } catch (error) {
      toast.error(`Error al ${isBlocked ? 'activar' : 'bloquear'} usuario`);
      console.error('Error:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar usuario');
      }
      toast.success('Usuario eliminado exitosamente');
      fetchUsers();
    } catch (error) {
      toast.error('Error al eliminar usuario');
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const nameMatch = user.name?.toLowerCase().includes(searchName.toLowerCase()) ?? false;
    const roleMatch = roleFilter === 'all' || user.role?.name === roleFilter;
    return nameMatch && roleMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10 text-[#5e1914]">Gestión de Usuarios</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-300"
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as 'all' | 'trainer' | 'client' | 'admin');
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-300"
        >
          <option value="all">Todos los roles</option>
          <option value="trainer">Entrenador</option>
          <option value="client">Cliente</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={usersPerPage}
          onChange={(e) => {
            setUsersPerPage(parseInt(e.target.value));
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-300"
        >
          <option value={7}>7 por página</option>
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5e1914]"></div>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-md border border-[#5e1914]/20">
            <table className="min-w-full divide-y divide-[#5e1914]/60 text-sm">
              <thead className="bg-[#5e1914] text-white">
                <tr>
                  <th className="px-6 py-3 text-left uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left uppercase">Correo</th>
                  <th className="px-6 py-3 text-left uppercase">Rol</th>
                  <th className="px-6 py-3 text-left uppercase">Estatus</th>
                  <th className="px-6 py-3 text-left uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.auth0_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role?.name === 'trainer'
                            ? 'bg-blue-100 text-blue-800'
                            : user.role?.name === 'client'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role?.name === 'admin'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role?.name ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1) : 'Sin Rol'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.is_blocked ? 'Inactivo' : 'Activo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleToggleStatus(user.auth0_id, user.is_blocked)}
                          className={`px-3 py-1 rounded-md text-white ${
                            user.is_blocked ? 'bg-green-600' : 'bg-yellow-600'
                          } hover:opacity-90`}
                        >
                          {user.is_blocked ? 'Desbloquear' : 'Bloquear'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.auth0_id)}
                          className="px-3 py-1 rounded-md bg-red-600 text-white hover:opacity-90"
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

          <div className="md:hidden grid grid-cols-1 gap-6">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <div key={user.auth0_id} className="bg-white shadow-lg rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className={`px-2 py-1 text-xs font-semibold rounded-full mt-2 ${user.role?.name === 'trainer' ? 'bg-blue-100 text-blue-800' : user.role?.name === 'client' ? 'bg-purple-100 text-purple-800' : user.role?.name === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.role?.name ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1) : 'Sin Rol'}
                  </p>
                  <p className={`px-2 py-1 text-xs font-semibold rounded-full mt-2 ${user.is_blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.is_blocked ? 'Inactivo' : 'Activo'}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(user.auth0_id, user.is_blocked)}
                      className={`px-3 py-1 rounded-md text-white ${user.is_blocked ? 'bg-green-600' : 'bg-yellow-600'} hover:opacity-90`}
                    >
                      {user.is_blocked ? 'Desbloquear' : 'Bloquear'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.auth0_id)}
                      className="px-3 py-1 rounded-md bg-red-600 text-white hover:opacity-90"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No se encontraron usuarios</div>
            )}
          </div>

          {filteredUsers.length > usersPerPage && (
            <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 bg-[#5e1914] text-white rounded-lg disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm font-semibold text-[#5e1914]">
                Página {currentPage} de {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 bg-[#5e1914] text-white rounded-lg disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
