"use client";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface User {
  auth0_id: string;
  role?: {
    name: string;
  };
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
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

  const filteredUsers = users.filter(user => {
    const roleMatch = roleFilter === 'all' || user.role?.name === roleFilter;
    return roleMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Roles de Usuario</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase rounded-lg">Rol</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#5e1914]/20">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.auth0_id} className="hover:bg-[#5e1914]/5 transition-colors duration-200">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-center text-gray-500">
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

export default AdminPanel;