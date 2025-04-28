"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FiSearch, FiRefreshCw, FiX } from 'react-icons/fi'; // Importa FiX para el ícono de cierre
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

interface ExerciseDetails {
  id: string;
  sets: number;
  reps: number;
}

interface AssignedExercise {
  id: string;
  exercise: Exercise;
  sets: number;
  reps: number;
}

const ListadeRutinas: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([]);
  const [search, setSearch] = useState('');
  const [, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<Record<string, ExerciseDetails>>({});
  const [alreadyAssigned, setAlreadyAssigned] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [inputSets, setInputSets] = useState<Record<string, number>>({});
  const [inputReps, setInputReps] = useState<Record<string, number>>({});

  const itemsPerPage = 9;

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    setLoading(true);
    setSearch('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine`);
      if (!response.ok) throw new Error('Error al obtener las rutinas');
      const data = await response.json();
      const filtered = data.filter((r: Routine) => !r.name.toLowerCase().startsWith('prueba'));
      setRoutines(filtered);
      setFilteredRoutines(filtered);
      setCurrentPage(1);
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
      const data: Exercise[] = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error al obtener los ejercicios:', error);
      toast.error('Error al obtener los ejercicios');
    }
  };

  const fetchAssignedExercises = async (routineId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routine-exercises/routine-exercises/${routineId}`);
      if (!response.ok) throw new Error('Error al obtener ejercicios asignados');
      const data: AssignedExercise[] = await response.json();
      const assigned: Record<string, ExerciseDetails> = {};
      const assignedIds = new Set<string>();
      data.forEach((item) => {
        assigned[item.exercise.id] = {
          id: item.id,
          sets: item.sets,
          reps: item.reps,
        };
        assignedIds.add(item.exercise.id);
      });
      setAlreadyAssigned(assignedIds);
      return assigned;
    } catch (error) {
      console.error('Error al obtener ejercicios asignados:', error);
      toast.error('Error al obtener ejercicios asignados');
      return {};
    }
  };

  const openModal = async (routineId: string) => {
    setSelectedRoutineId(routineId);
    setIsModalOpen(true);
    await fetchExercises();
    const assigned = await fetchAssignedExercises(routineId);
    setSelectedExercises(assigned);
    setInputSets({});
    setInputReps({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoutineId(null);
    setSelectedExercises({});
    setAlreadyAssigned(new Set());
    setInputSets({});
    setInputReps({});
  };

  const assignExercise = async (exerciseId: string) => {
    if (!selectedRoutineId) return;

    const sets = inputSets[exerciseId];
    const reps = inputReps[exerciseId];

    if (!sets || !reps) {
      toast.error('Debes asignar sets y reps antes de asignar el ejercicio');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routine-exercises/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          routineId: selectedRoutineId,
          exerciseId,
          sets,
          reps,
          rest: 30,
          order: Object.keys(selectedExercises).length + 1,
        }),
      });
      if (!response.ok) throw new Error('Error al asignar ejercicio');
      const result = await response.json();

      setSelectedExercises((prev) => ({
        ...prev,
        [exerciseId]: {
          id: result.id || String(Date.now()),
          sets,
          reps,
        },
      }));
      setAlreadyAssigned((prev) => new Set(prev).add(exerciseId));
      toast.success('Ejercicio asignado correctamente');
    } catch (error) {
      console.error('Error al asignar ejercicio:', error);
      toast.error('Error al asignar ejercicio');
    }
  };

  const removeExercise = async (exerciseId: string) => {
    if (!selectedRoutineId) return;

    const routineExercise = selectedExercises[exerciseId];
    if (!routineExercise) {
      toast.error('No se encontró el ejercicio asignado');
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routine-exercises/${routineExercise.id}`, {
        method: 'DELETE',
      });

      setAlreadyAssigned((prev) => {
        const newSet = new Set(prev);
        newSet.delete(exerciseId);
        return newSet;
      });

      setSelectedExercises((prev) => {
        const newSelected = { ...prev };
        delete newSelected[exerciseId];
        return newSelected;
      });

      toast.success('Ejercicio eliminado de la rutina');
    } catch (error) {
      console.error('Error al eliminar ejercicio:', error);
      toast.error('Error al eliminar ejercicio');
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
      const filtered = updatedRoutines.filter((r) => !r.name.toLowerCase().startsWith('prueba'));
      setRoutines(filtered);
      setFilteredRoutines(
        filtered.filter((routine) =>
          routine.name.toLowerCase().includes(search.toLowerCase())
        )
      );

      toast.success(currentState ? 'Rutina desactivada' : 'Rutina activada');
    } catch (error) {
      console.error(error);
      toast.error('Error al cambiar el estado de la rutina');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoutines = filteredRoutines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRoutines.length / itemsPerPage);

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
            const filtered = routines
              .filter(r => !r.name.toLowerCase().startsWith('prueba'))
              .filter(r => r.name.toLowerCase().includes(query));
            setFilteredRoutines(filtered);
            setCurrentPage(1);
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

      {/* Lista de rutinas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentRoutines.map((routine) => (
          <div key={routine.id} className="bg-white rounded-3xl shadow-xl p-4 hover:scale-105 transition-all">
            <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
              {routine.imageUrl ? (
                <Image src={routine.imageUrl} alt={routine.name} fill className="object-cover" />
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
                  className={`ml-4 py-2 px-4 rounded-lg ${routine.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white font-medium`}
                >
                  {routine.isActive ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de ejercicios */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#5e191489] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto scroll-smooth relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-red-600"
            >
              <FiX /> {/* Ícono de cierre */}
            </button>
            <h3 className="text-2xl font-semibold mb-4">Ejercicios para la rutina</h3>
            <div className="grid gap-6">
              {exercises.map((ex) => {
                const isAssigned = alreadyAssigned.has(ex.id);
                return (
                  <div key={ex.id} className={`p-4 shadow-md rounded-lg ${isAssigned ? 'bg-green-200' : 'bg-white'}`}>
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <h4 className="text-xl font-medium">{ex.name}</h4>
                        {ex.imageUrl && (
                          <div className="relative w-16 h-16 bg-gray-100 flex items-center justify-center rounded-lg mb-2 overflow-hidden">
                            <Image src={ex.imageUrl} alt={ex.name} fill className="object-cover" />
                          </div>
                        )}
                        <p className="text-sm text-gray-600">{ex.description}</p>
                      </div>
                      <div className="flex gap-4">
                        {isAssigned ? (
                          <button
                            onClick={() => removeExercise(ex.id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                          >
                            Eliminar
                          </button>
                        ) : (
                          <>
                            <input
                              type="number"
                              value={inputSets[ex.id] || ''}
                              onChange={(e) => setInputSets((prev) => ({ ...prev, [ex.id]: parseInt(e.target.value) }))}
                              className="border px-4 py-2 rounded-md"
                              placeholder="Sets"
                            />
                            <input
                              type="number"
                              value={inputReps[ex.id] || ''}
                              onChange={(e) => setInputReps((prev) => ({ ...prev, [ex.id]: parseInt(e.target.value) }))}
                              className="border px-4 py-2 rounded-md"
                              placeholder="Reps"
                            />
                            <button
                              onClick={() => assignExercise(ex.id)}
                              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                            >
                              Asignar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Paginación */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-500 rounded-lg py-2 px-4 mx-2"
        >
          Anterior
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-500 rounded-lg py-2 px-4 mx-2"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListadeRutinas;
