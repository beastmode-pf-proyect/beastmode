"use client";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  auth0_id: string;
  name: string;
  email: string;
  picture?: string;
  role?: {
    name: string;
  };
  is_blocked: boolean;
  created_at: string;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'trainer' | 'client' | 'admin'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(7);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isMobile, setIsMobile] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  // Paleta de colores personalizadas
  const colors = {
    primary: 'bg-[#5e1914]',
    primaryGradient: 'bg-gradient-to-r from-[#5e1914] to-[#7a1e18]',
    secondary: 'bg-gradient-to-r from-slate-800 to-slate-700',
    accent: 'bg-gradient-to-r from-amber-500 to-amber-600',
    card: 'bg-white bg-opacity-90 backdrop-blur-sm',
    text: 'text-slate-800',
    lightText: 'text-slate-100',
    border: 'border-slate-200',
    hover: 'hover:bg-opacity-95',
    shadow: 'shadow-xl shadow-[#5e1914]/10'
  };

  // Animaciones
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Detectamos el tamaño de pantalla al montar y en cambios
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    const savedUsersPerPage = localStorage.getItem('usersPerPage');
    const savedRoleFilter = localStorage.getItem('roleFilter');
    const savedSortOrder = localStorage.getItem('sortOrder');

    if (savedPage) setCurrentPage(Number(savedPage));
    if (savedUsersPerPage) setUsersPerPage(Number(savedUsersPerPage));
    if (savedRoleFilter) setRoleFilter(savedRoleFilter as 'all' | 'trainer' | 'client' | 'admin');
    if (savedSortOrder) setSortOrder(savedSortOrder as 'newest' | 'oldest');
  }, []);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
    localStorage.setItem('usersPerPage', usersPerPage.toString());
    localStorage.setItem('roleFilter', roleFilter);
    localStorage.setItem('sortOrder', sortOrder);
  }, [currentPage, usersPerPage, roleFilter, sortOrder]);

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

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/upRole/${selectedUser.auth0_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el rol');
      }

      toast.success('Rol actualizado exitosamente');
      fetchUsers();
      setShowRoleModal(false);
    } catch (error) {
      toast.error('Error al actualizar el rol');
      console.error('Error:', error);
    }
  };

  const filteredUsers = users
    .filter(user => {
      const nameMatch = user.name?.toLowerCase().includes(searchName.toLowerCase()) ?? false;
      const roleMatch = roleFilter === 'all' || user.role?.name === roleFilter;
      return nameMatch && roleMatch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="min-h-screen bg-[#5e1914]/5 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Premium Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`relative overflow-hidden rounded-2xl mb-6 sm:mb-8 ${colors.shadow}`}
        >
          <div className={`absolute inset-0 ${colors.primaryGradient} opacity-90`}></div>
          <div className="relative z-10 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 sm:mb-6 md:mb-0">
                <motion.h2 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2"
                >
                  ¡Bienvenido, <span className="text-amber-300">Administrador</span>!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-100 text-sm sm:text-base md:text-lg max-w-2xl"
                >
                  Estás gestionando el panel premium de usuarios. Desde aquí podrás administrar todos los accesos y permisos con estilo y elegancia.
                </motion.p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 hidden sm:block"
              >
                <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                  <div className={`absolute inset-0 rounded-full ${colors.primary} opacity-20 animate-pulse`}></div>
                  <div className={`absolute inset-2 rounded-full border-4 border-amber-400 border-opacity-60`}></div>
                  <svg 
                    className="absolute inset-0 text-amber-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    ></path>
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Efectos decorativos */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, 20, 0],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  filter: 'blur(20px)'
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${colors.card} p-3 sm:p-4 rounded-xl ${colors.shadow} transition-all`}
          >
            <label className="block text-xs sm:text-sm font-medium text-slate-500 mb-1">Buscar usuario</label>
            <input
              type="text"
              placeholder="Nombre del usuario"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${colors.border} focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm sm:text-base`}
            />
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${colors.card} p-3 sm:p-4 rounded-xl ${colors.shadow} transition-all`}
          >
            <label className="block text-xs sm:text-sm font-medium text-slate-500 mb-1">Filtrar por rol</label>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as 'all' | 'trainer' | 'client');
                setCurrentPage(1);
              }}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${colors.border} focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm sm:text-base`}
            >
              <option value="all">Todos los roles</option>
              <option value="trainer">Entrenadores</option>
              <option value="client">Clientes</option>
              
            </select>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${colors.card} p-3 sm:p-4 rounded-xl ${colors.shadow} transition-all`}
          >
            <label className="block text-xs sm:text-sm font-medium text-slate-500 mb-1">Ordenar por fecha</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${colors.border} focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm sm:text-base`}
            >
              <option value="newest">Más recientes primero</option>
              <option value="oldest">Más antiguos primero</option>
            </select>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${colors.card} p-3 sm:p-4 rounded-xl ${colors.shadow} transition-all`}
          >
            <label className="block text-xs sm:text-sm font-medium text-slate-500 mb-1">Usuarios por página</label>
            <select
              value={usersPerPage}
              onChange={(e) => {
                setUsersPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${colors.border} focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm sm:text-base`}
            >
              <option value={5}>5 por página</option>
              <option value={7}>7 por página</option>
              <option value={10}>10 por página</option>
              <option value={15}>15 por página</option>
            </select>
          </motion.div>
        </motion.div>

        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-64"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5e1914]"
            ></motion.div>
          </motion.div>
        ) : (
          <>
            {/* Desktop Table - Mostrar solo en pantallas grandes */}
            {!isMobile && (
              <div className="hidden lg:block overflow-hidden rounded-2xl shadow-lg mb-6 sm:mb-8">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className={`${colors.primary}`}>
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">Nombre</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">Correo</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">Rol</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">Estatus</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">Fecha</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      <AnimatePresence>
                        {paginatedUsers.length > 0 ? (
                          paginatedUsers.map((user) => (
                            <motion.tr
                              key={user.auth0_id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              transition={{ duration: 0.3 }}
                              className="hover:bg-slate-50 transition-colors duration-200"
                            >
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden border-2 border-[#5e1914]/20 relative"
                                  >
                                    {user.picture ? (
                                      <Image
                                        src={user.picture}
                                        alt={user.name || 'Usuario'}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.onerror = null;
                                          target.src = `https://ui-avatars.com/api/?name=${user.name?.charAt(0) || 'U'}&background=${encodeURIComponent('#5e1914')}&color=fff`;
                                        }}
                                      />
                                    ) : (
                                      <div className={`h-full w-full flex items-center justify-center ${colors.primary} text-white font-bold`}>
                                        {user.name?.charAt(0) || 'U'}
                                      </div>
                                    )}
                                  </motion.div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-900 truncate max-w-xs">{user.email}</div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <motion.span 
                                  whileHover={{ scale: 1.05 }}
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.role?.name === 'trainer'
                                      ? 'bg-blue-100 text-blue-800'
                                      : user.role?.name === 'client'
                                      ? 'bg-purple-100 text-purple-800'               
                                      : 'bg-slate-100 text-slate-800'
                                  }`}
                                >
                                  {user.role?.name ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1) : 'Sin Rol'}
                                </motion.span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <motion.span 
                                  whileHover={{ scale: 1.05 }}
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.is_blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {user.is_blocked ? 'Inactivo' : 'Activo'}
                                </motion.span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="text-xs sm:text-sm text-slate-500">
                                  {new Date(user.created_at).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap flex gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleToggleStatus(user.auth0_id, user.is_blocked)}
                                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                    user.is_blocked 
                                      ? 'bg-green-600 text-white hover:bg-green-700' 
                                      : 'bg-amber-500 text-white hover:bg-amber-600'
                                  } hover:shadow-md`}
                                >
                                  {user.is_blocked ? 'Activar' : 'Bloquear'}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setNewRole(user.role?.name || '');
                                    setShowRoleModal(true);
                                  }}
                                  className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all hover:shadow-md"
                                >
                                  Cambiar Rol
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <td colSpan={6} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <motion.div
                                  animate={{ 
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                  }}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                >
                                  <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                  </svg>
                                </motion.div>
                                <p className="text-slate-500 text-lg">No se encontraron usuarios</p>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mobile Cards - Mostrar solo en pantallas pequeñas */}
            {isMobile && (
              <div className="lg:hidden">
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8"
                >
                  <AnimatePresence>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <motion.div
                          key={user.auth0_id}
                          variants={item}
                          whileHover={{ y: -5 }}
                          className={`${colors.card} rounded-xl p-4 sm:p-6 ${colors.shadow} transition-all`}
                        >
                          <div className="flex items-start space-x-3 sm:space-x-4">
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-[#5e1914]/20 relative"
                            >
                              {user.picture ? (
                                <Image
                                  src={user.picture}
                                  alt={user.name || 'Usuario'}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = `https://ui-avatars.com/api/?name=${user.name?.charAt(0) || 'U'}&background=${encodeURIComponent('#5e1914')}&color=fff`;
                                  }}
                                />
                              ) : (
                                <div className={`h-full w-full flex items-center justify-center ${colors.primary} text-white font-bold`}>
                                  {user.name?.charAt(0) || 'U'}
                                </div>
                              )}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm sm:text-base font-semibold text-slate-900 truncate">{user.name}</p>
                              <p className="text-xs sm:text-sm text-slate-500 truncate">{user.email}</p>
                              <div className="mt-1 sm:mt-2 flex flex-wrap gap-1 sm:gap-2">
                                <motion.span
                                  whileHover={{ scale: 1.05 }}
                                  className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold rounded-full ${
                                    user.role?.name === 'trainer'
                                      ? 'bg-blue-100 text-blue-800'
                                      : user.role?.name === 'client'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-slate-100 text-slate-800'
                                  }`}
                                >
                                  {user.role?.name ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1) : 'Sin Rol'}
                                </motion.span>
                                <motion.span
                                  whileHover={{ scale: 1.05 }}
                                  className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold rounded-full ${
                                    user.is_blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {user.is_blocked ? 'Inactivo' : 'Activo'}
                                </motion.span>
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                Creado: {new Date(user.created_at).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleToggleStatus(user.auth0_id, user.is_blocked)}
                              className={`flex-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                user.is_blocked 
                                  ? 'bg-green-600 text-white hover:bg-green-700' 
                                  : 'bg-amber-500 text-white hover:bg-amber-600'
                              } hover:shadow-md`}
                            >
                              {user.is_blocked ? 'Activar' : 'Bloquear'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedUser(user);
                                setNewRole(user.role?.name || '');
                                setShowRoleModal(true);
                              }}
                              className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all hover:shadow-md"
                            >
                              Cambiar Rol
                            </motion.button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`${colors.card} rounded-xl p-6 sm:p-8 text-center ${colors.shadow}`}
                      >
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-300 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </motion.div>
                        <p className="text-sm sm:text-base text-slate-500">No se encontraron usuarios</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            )}

            {/* Pagination */}
            {filteredUsers.length > usersPerPage && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-8 gap-4 sm:gap-0"
              >
                <div className="text-xs sm:text-sm text-slate-500">
                  Mostrando <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> a{' '}
                  <span className="font-medium">{Math.min(currentPage * usersPerPage, filteredUsers.length)}</span> de{' '}
                  <span className="font-medium">{filteredUsers.length}</span> usuarios
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
                      currentPage === 1 ? 'bg-slate-200 text-slate-500' : `${colors.primary} text-white`
                    } transition-all hover:shadow-md`}
                  >
                    Anterior
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm"
                  >
                    <span className="font-medium text-slate-700">{currentPage}</span>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm ${
                      currentPage === totalPages ? 'bg-slate-200 text-slate-500' : `${colors.primary} text-white`
                    } transition-all hover:shadow-md`}
                  >
                    Siguiente
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Modal para cambiar rol */}
      <AnimatePresence>
        {showRoleModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#5e191497]  p-4"
            onClick={() => setShowRoleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative w-full max-w-md p-6 rounded-2xl ${colors.card} ${colors.shadow}`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Cambiar rol de {selectedUser.name}</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-500 mb-2">Seleccionar nuevo rol</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${colors.border} focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                >
                  <option value="">Selecciona un rol</option>
                  <option value="trainer">Entrenador</option>
                  <option value="client">Cliente</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition-all"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdateRole}
                  disabled={!newRole}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
                    !newRole ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Confirmar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;