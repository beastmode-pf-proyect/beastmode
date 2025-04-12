// components/Membresias/MembresiasList.tsx
"use client";
import { useEffect, useState } from "react";
import { FaToggleOn, FaToggleOff, FaIdBadge } from "react-icons/fa";
import toast from "react-hot-toast";

interface Membership {
  id: number;
  name: string;
  price: number;
  active: boolean;
}

export default function MembresiasList() {
  const [memberships, setMemberships] = useState<Membership[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/memberships`)
      .then((res) => res.json())
      .then((data) => setMemberships(data))
      .catch((err) => console.error("Error al cargar membresías:", err));
  }, []);

  const toggleActive = async (id: number, currentState: boolean) => {
    const endpoint = currentState
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/memberships/desactivate/${id}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/memberships/activate/${id}`;

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
      });

      if (!res.ok) throw new Error("Error al actualizar el estado");

      setMemberships((prev) =>
        prev.map((m) => (m.id === id ? { ...m, active: !currentState } : m))
      );

      toast.success(`Membresía ${!currentState ? "activada" : "desactivada"} correctamente`);
    } catch (error) {
      toast.error("Ocurrió un error al actualizar el estado.");
      console.error("Error al cambiar estado:", error);
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl border border-[#5e1914] shadow-lg shadow-[#5e191455]">
      <h2 className="text-3xl font-bold text-[#5e1914] flex items-center gap-3 mb-6 tracking-wide">
        <FaIdBadge className="text-[#5e1914]" />
        Gestión de Membresías
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memberships.map((membership) => (
          <div
            key={membership.id}
            className="bg-[#faf8f7] border border-[#5e191433] rounded-xl p-6 hover:shadow-xl hover:shadow-[#5e191444] transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-[#5e1914]">{membership.name}</h3>
            <p className="text-md text-[#333] mt-1">💰 Precio: ${membership.price}</p>
            <p className="text-md mt-1">
              Estado:{" "}
              <span
                className={`font-semibold ${
                  membership.active ? "text-green-600" : "text-red-400"
                }`}
              >
                {membership.active ? "Activa" : "Inactiva"}
              </span>
            </p>
            <button
              onClick={() => toggleActive(membership.id, membership.active)}
              className="mt-4 text-4xl transition-transform hover:scale-125 text-[#5e1914]"
              title={membership.active ? "Desactivar" : "Activar"}
            >
              {membership.active ? <FaToggleOn /> : <FaToggleOff />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
