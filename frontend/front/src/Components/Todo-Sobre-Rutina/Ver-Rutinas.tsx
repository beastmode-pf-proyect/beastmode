'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import { FaDumbbell } from 'react-icons/fa';

interface Routine {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  isActive: boolean;
}

const ListadeRutinas: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    setLoading(true);
    setSearch('');
    try {
      const response = await fetch('http://localhost:3000/workout-routine');
      if (!response.ok) throw new Error('Error al obtener las rutinas');
      const data = await response.json();
      setRoutines(data);
      setFilteredRoutines(data);
    } catch (error) {
      console.error(error);
      toast.error('Error al obtener las rutinas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    const filtered = routines.filter((routine) =>
      routine.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRoutines(filtered);
  };

  const handleToggle = async (id: string, currentState: boolean) => {
    try {
      const endpoint = currentState
        ? `http://localhost:3000/workout-routine/desactivate/${id}`
        : `http://localhost:3000/workout-routine/activate/${id}`;

      const response = await fetch(endpoint, { method: 'PUT' });
      if (!response.ok) throw new Error('Error al cambiar estado');

      const updatedRoutines = routines.map((routine) =>
        routine.id === id ? { ...routine, isActive: !currentState } : routine
      );
      setRoutines(updatedRoutines);
      setFilteredRoutines(
        updatedRoutines.filter((routine) =>
          routine.name.toLowerCase().includes(search.toLowerCase())
        )
      );

      toast.success(currentState ? 'Rutina desactivada' : 'Rutina activada');
    } catch (error) {
      console.error(error);
      toast.error('Error al cambiar el estado de la rutina');
    }
  };

  const renderSkeletons = (count: number = 6) => {
    return Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 animate-pulse"
      >
        <div className="h-48 bg-gray-200" />
        <div className="p-5 space-y-3">
          <div className="h-5 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-10 bg-gray-300 rounded mt-4" />
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-8">Rutinas disponibles</h2>

      <div className="relative mb-8 flex items-center">
        <FiSearch className="absolute left-4 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Buscar rutina..."
          value={search}
          onChange={handleSearch}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
        />
        <button
          onClick={fetchRoutines}
          className="ml-4 flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-200 text-sm"
        >
          <FiRefreshCw className="text-base" />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSkeletons()}
        </div>
      ) : filteredRoutines.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600 text-lg">No hay rutinas registradas aún.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutines.map((routine) => (
            <div
              key={routine.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              {routine.imageUrl ? (
                <div className="relative w-full h-48">
                  <Image
                    src={routine.imageUrl}
                    alt={routine.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  <FaDumbbell className="text-5xl" />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{routine.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{routine.description}</p>
                <button
                  onClick={() => handleToggle(routine.id, routine.isActive)}
                  className={`w-full py-2 rounded-lg font-medium transition-colors duration-200 shadow-md ${
                    routine.isActive
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {routine.isActive ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListadeRutinas;
