"use client";
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

interface Exercise {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
}

const ListadeRutinasprueba: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([]);
  const [search, setSearch] = useState('');
  const [, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    setLoading(true);
    setSearch('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine`);
      if (!response.ok) throw new Error(`Error al obtener las rutinas`);

      const data = await response.json();
      const filteredData = data.filter((routine: Routine) => routine.name.startsWith('Prueba'));
      setRoutines(filteredData);
      setFilteredRoutines(filteredData);
    } catch (error) {
      console.error('Error al obtener las rutinas:', error);
      toast.error('Error al obtener las rutinas');
    } finally {
      setLoading(false);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exercises`);
      if (!response.ok) throw new Error('Error al obtener los ejercicios');

      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error al obtener los ejercicios:', error);
      toast.error('Error al obtener los ejercicios');
    }
  };

  const openModal = async (routineId: string) => {
    setSelectedRoutineId(routineId);
    setIsModalOpen(true);
    setSelectedExercises(new Set());
    await fetchExercises();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoutineId(null);
  };

  const toggleExerciseSelection = (exerciseId: string) => {
    setSelectedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleAddToRoutine = async () => {
    if (!selectedRoutineId || selectedExercises.size === 0) {
      toast.error('Selecciona al menos un ejercicio');
      return;
    }

    try {
      const requests = Array.from(selectedExercises).map((exerciseId, index) => {
        return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routine-exercises/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            routineId: selectedRoutineId,
            exerciseId,
            sets: 3,
            reps: 12,
            duration: 60,
            rest: 30,
            order: index + 1,
          }),
        });
      });

      await Promise.all(requests);
      toast.success('Ejercicios asignados correctamente');
      closeModal();
    } catch (error) {
      console.error('Error al asignar ejercicios:', error);
      toast.error('Error al asignar ejercicios');
    }
  };

  const handleToggle = async (id: string, currentState: boolean) => {
    try {
      const endpoint = currentState
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine/desactivate/${id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine/activate/${id}`;

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

  return (
    <div className="max-w-6xl mx-auto p-6 mt-12">
      <h2 className="text-3xl font-bold text-red-800 mb-8">Rutinas disponibles</h2>

      {/* Buscar */}
      <div className="relative mb-8 flex items-center">
        <FiSearch className="absolute left-4 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Buscar rutina..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            const query = e.target.value.toLowerCase();
            setFilteredRoutines(routines.filter(r => r.name.toLowerCase().includes(query)));
          }}
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

      {/* Lista */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutines.map((routine) => (
          <div key={routine.id} className="bg-white rounded-3xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl overflow-hidden p-4">
            <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
              {routine.imageUrl ? (
                <Image
                  src={routine.imageUrl}
                  alt={routine.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <FaDumbbell className="text-5xl text-red-500 animate-pulse" />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{routine.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{routine.description}</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => openModal(routine.id)}
                  className="w-full py-2 rounded-lg bg-red-950 hover:bg-red-800 text-white font-medium transition-all duration-200"
                >
                  Ver y Agregar Ejercicios
                </button>
                <button
                  onClick={() => handleToggle(routine.id, routine.isActive)}
                  className={`ml-4 py-2 px-4 rounded-lg ${routine.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white font-medium transition-all duration-200`}
                >
                  {routine.isActive ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#5e191491] bg-opacity-40 z-50 mt-17">
          <div className="relative bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white text-xl w-10 h-10 rounded-full"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">Selecciona ejercicios</h3>
            <div className="grid md:grid-cols-2 gap-4 overflow-y-auto max-h-[60vh]">
              {exercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => toggleExerciseSelection(ex.id)}
                  className={`p-4 shadow-md cursor-pointer transition-all ${selectedExercises.has(ex.id) ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <div className="relative w-full h-40 bg-gray-100 mb-2 rounded-lg overflow-hidden">
                    {ex.imageUrl ? (
                      <Image src={ex.imageUrl} alt={ex.name} fill className="object-cover" />
                    ) : (
                      <FaDumbbell className="text-4xl text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800">{ex.name}</h4>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 w-full">
              <button
                onClick={handleAddToRoutine}
                disabled={selectedExercises.size === 0}
                className={`w-full py-3 ${selectedExercises.size > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-lg font-bold`}
              >
                Guardar en rutina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListadeRutinasprueba;
