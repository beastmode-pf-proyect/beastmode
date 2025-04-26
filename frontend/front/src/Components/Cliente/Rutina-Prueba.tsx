"use client";
import { useEffect, useState } from "react";
import Image from 'next/image';

interface Routine {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

const FilteredRoutines = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine`);
        const data: Routine[] = await response.json();

       
        const filtered = data.filter((routine) =>
          routine.name?.toLowerCase().startsWith("prueba")
        );

        setRoutines(filtered);
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    };

    fetchRoutines();
  }, []);

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {routines.map((routine) => (
        <div
          key={routine.id}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
        >
              <Image
              src={routine.imageUrl}
              alt={routine.name}
              width={500}  // Puedes ajustar el tamaño según sea necesario
              height={192} // Ajusta la altura según lo que necesites
              className="w-full h-48 object-cover"
            />
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{routine.name}</h2>
            <p className="text-gray-600 text-sm">{routine.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilteredRoutines;
