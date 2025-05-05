// components/Membresias/MembresiasList.tsx
"use client";
import { useEffect, useState } from "react";
import { FaToggleOn, FaToggleOff, FaIdBadge, FaCrown, FaGem, FaStar } from "react-icons/fa";
import { IoDiamond } from "react-icons/io5";
import toast from "react-hot-toast";

interface Membership {
  id: string;
  name: string;
  price: number;
  active: boolean;
  description?: string;
  benefits?: string[];
}
interface MembershipAPIResponse {
  id: string;
  name: string;
  price: string | number;
  isActive: boolean;
  description?: string;
  benefits?: string[];
}

export default function MembresiasList() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/memberships`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      const mapped: Membership[] = data.map((item: MembershipAPIResponse) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        active: item.isActive,
        description: item.description || "Acceso a beneficios exclusivos",
        benefits: item.benefits || [
          "Acceso prioritario",
          "Descuentos exclusivos",
          "Contenido premium"
        ]
      }));

      setMemberships(mapped);
    } catch (err) {
      console.error("Error al cargar membresías:", err);
      toast.error("Error al cargar las membresías");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
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

      toast.success(`Membresía ${!currentState ? "activada" : "desactivada"} correctamente`, {
        style: {
          background: '#f0f0f0',
          color: '#5e1914',
          border: '1px solid #5e1914',
          padding: '16px',
        }
      });
    } catch (error) {
      toast.error("Ocurrió un error al actualizar el estado.", {
        style: {
          background: '#f0f0f0',
          color: '#d32f2f',
          border: '1px solid #d32f2f',
          padding: '16px',
        }
      });
      console.error("Error al cambiar estado:", error);
    }
  };

  const getMembershipIcon = (name: string) => {
    if (name.toLowerCase().includes('oro')) return <FaCrown className="text-yellow-500" />;
    if (name.toLowerCase().includes('platino')) return <IoDiamond className="text-blue-300" />;
    if (name.toLowerCase().includes('diamante')) return <FaGem className="text-purple-400" />;
    if (name.toLowerCase().includes('premium')) return <FaStar className="text-amber-400" />;
    return <FaIdBadge className="text-[#5e1914]" />;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <FaCrown className="text-5xl text-[#5e1914] mb-4 animate-spin" />
          <p className="text-xl font-medium text-[#5e1914]">Cargando membresías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-[#faf8f7] to-[#f0e6e4] rounded-3xl border border-[#5e191422] shadow-xl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-4xl font-bold text-[#5e1914] flex items-center gap-3 tracking-wide">
              <FaIdBadge className="text-[#5e1914]" />
              Gestión de Membresías Premium
            </h2>
            <p className="text-lg text-[#5e1914aa] mt-2">Administra los niveles de membresía de tu plataforma</p>
          </div>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {memberships.map((membership) => (
            <div
              key={membership.id}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                membership.active 
                  ? "border-[#5e191466] shadow-lg shadow-[#5e191422]"
                  : "border-gray-300 shadow-md"
              }`}
            >
              {membership.active && (
                <div className="absolute top-0 right-0 bg-[#5e1914] text-white px-3 py-1 text-sm font-bold rounded-bl-lg">
                  ACTIVA
                </div>
              )}
              
              <div className={`p-1 ${membership.active ? "bg-gradient-to-r from-[#5e191410] to-[#5e191405]" : "bg-gray-100"}`}>
                <div className="p-6 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {getMembershipIcon(membership.name)}
                      <h3 className="text-2xl font-bold text-[#5e1914]">
                        {membership.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => toggleActive(membership.id, membership.active)}
                      className={`text-3xl transition-all hover:scale-110 ${
                        membership.active ? "text-[#5e1914]" : "text-gray-400"
                      }`}
                      title={membership.active ? "Desactivar" : "Activar"}
                    >
                      {membership.active ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>

                  <div className="my-6">
                    <p className="text-4xl font-bold text-[#5e1914] mb-2">
                      ${membership.price.toLocaleString()}
                      <span className="text-lg font-normal text-gray-500">/mes</span>
                    </p>
                    <p className="text-gray-600">{membership.description}</p>
                  </div>

                  <div className="border-t border-[#5e191422] pt-4">
                    <h4 className="font-semibold text-[#5e1914] mb-3">Beneficios:</h4>
                    <ul className="space-y-2">
                      {membership.benefits?.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-[#5e1914] mr-2">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#5e191422]">
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                      membership.active ? "bg-[#5e191410] text-[#5e1914]" : "bg-gray-100 text-gray-500"
                    }`}>
                      {membership.active ? "Disponible para nuevos usuarios" : "No disponible actualmente"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {memberships.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-[#5e191410] rounded-full flex items-center justify-center mb-4">
              <FaIdBadge className="text-4xl text-[#5e191466]" />
            </div>
            <h3 className="text-xl font-medium text-[#5e1914]">No hay membresías registradas</h3>
            <p className="text-gray-500 mt-2">Comienza creando tu primera membresía</p>
            <button className="mt-6 bg-[#5e1914] text-white px-6 py-2 rounded-lg shadow hover:shadow-md transition-all">
              Crear Membresía
            </button>
          </div>
        )}
      </div>
    </div>
  );
}