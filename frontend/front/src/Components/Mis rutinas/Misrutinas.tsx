'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSessionUser } from '@/app/SessionUserContext';
import Image from 'next/image';

interface Routine {
  routine_id: number;
  workout_routine: {
    name: string;
    description: string;
    imageUrl?: string;
  };
}

interface RoutineData {
  routine_id: number;
  workout_routine: {
    name: string;
    description: string;
    image_url?: string; // Asegúrate de que el nombre de la propiedad coincida con el de la base de datos
  };
}

export default function UserWorkoutRoutines() {
  const { user, loading: userLoading } = useSessionUser();

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutines = async () => {
      if (!user?.email || userLoading) return;

      setLoading(true);

      const { data: userRow, error: userError } = await supabase
        .from('users2')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userError || !userRow) {
        console.error('Usuario no encontrado en Supabase:', userError);
        setLoading(false);
        return;
      }

      const supabaseUserId = userRow.id;

      const { data: routineData, error: routineError } = await supabase
        .from('user_workout_routines') // Eliminado el tipo genérico aquí
        .select('routine_id, workout_routine(*)')
        .eq('user_id', userId);

      if (routineError) {
        console.error('Error buscando rutinas:', routineError);
        setLoading(false);
        return;
      }

      const formattedRoutines = (routineData || []).map((routine: RoutineData) => ({
        routine_id: routine.routine_id,
        workout_routine: {
          name: routine.workout_routine.name,
          description: routine.workout_routine.description,
          imageUrl: routine.workout_routine.image_url, // Cambia a image_url si es necesario
        },
      }));
      setRoutines(formattedRoutines);
      setFilteredRoutines(formattedRoutines);
      setLoading(false);
    };

    fetchRoutines();
  }, [user, userLoading]);

  if (userLoading) {
    return <p className="p-4">Cargando sesión...</p>;
  }

  if (!user) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold mb-2">Acceso requerido</h2>
        <p className="mb-4">Debes iniciar sesión para ver tus rutinas de entrenamiento.</p>
        <button
          onClick={() => loginWithRedirect()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Mis Rutinas</h2>

      <input
        type="text"
        placeholder="Buscar rutina..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 p-3 border border-gray-300 rounded-md w-full max-w-md mx-auto block"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutines.map((item) => (
          <div
            key={item.routine_id}
            className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {item.workout_routine.imageUrl && (
              <Image
                src={item.workout_routine.imageUrl}
                alt={item.workout_routine.name}
                width={400} // Ajusta el tamaño según sea necesario
                height={160} // Ajusta el tamaño según sea necesario
                className="rounded-xl mb-4 w-full h-40 object-cover"
              />
            )}
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{item.workout_routine.name}</h3>
            <p className="text-gray-600 text-sm">{item.workout_routine.description}</p>
          </div>
        ))}
      </div>

      {filteredRoutines.length === 0 && (
        <p className="text-gray-500 mt-6 text-center">No se encontraron rutinas con ese nombre.</p>
      )}
    </div>
  );
}
