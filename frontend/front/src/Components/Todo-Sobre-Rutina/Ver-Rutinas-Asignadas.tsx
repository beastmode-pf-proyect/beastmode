"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaCalendarAlt, FaClock } from "react-icons/fa";
import Image from "next/image";

interface AssignedRoutine {
  id: string;
  user: {
    name: string;
    email: string;
    picture: string;
    last_login: string;
    created_at: string;
    is_blocked: boolean;
  };
  routine: {
    name: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
    isActive: boolean;
  };
  assigned_at?: string;
}

export default function VerRutinasAsignadas() {
  const [asignaciones, setAsignaciones] = useState<AssignedRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  const fetchAsignaciones = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-workout`)
      .then((res) => res.json())
      .then((data) => {
        setAsignaciones(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar las rutinas asignadas:", err);
        toast.error("❌ Error al cargar rutinas asignadas.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAsignaciones();
  }, []);

  const eliminarAsignacion = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la asignación de rutina.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-workout/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("✅ Asignación eliminada.");
        fetchAsignaciones();
      } else {
        const data = await res.json();
        toast.error(`❌ Error: ${data.message || "No se pudo eliminar."}`);
      }
    } catch (err) {
      console.error("Error eliminando asignación:", err);
      toast.error("❌ Error al eliminar.");
    }
  };

  const groupedByUser = asignaciones.reduce(
    (acc: Record<string, AssignedRoutine[]>, asignacion) => {
      const userName = asignacion.user.name || "Desconocido";
      if (!acc[userName]) acc[userName] = [];
      acc[userName].push(asignacion);
      return acc;
    },
    {}
  );

  const openDetail = (userName: string) => {
    setSelectedUser(userName);
    setOpenAccordions({});
  };

  const closeDetail = () => setSelectedUser(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md border" style={{ borderColor: "#5e1914" }}>
      <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: "#5e1914" }}>
        Rutinas Asignadas
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Cargando rutinas asignadas...</p>
      ) : Object.keys(groupedByUser).length === 0 ? (
        <p className="text-center text-gray-500">No hay rutinas asignadas.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-[#5e1914] text-white">
              <th className="p-2 text-left">Usuario</th>
              <th className="p-2 text-left">Cantidad de Rutinas</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByUser).map(([userName, rutinas]) => (
              <tr key={userName} className="border-b">
                <td className="p-2 flex items-center gap-3">
                  {rutinas[0].user.picture ? (
                    <Image
                      src={rutinas[0].user.picture}
                      alt={userName}
                      width={32}
                      height={32}
                      className="rounded-full object-cover border"
                    />
                  ) : (
                    <FaUser className="w-8 h-8 text-gray-500" />
                  )}
                  <span>{userName}</span>
                </td>
                <td className="p-2">{rutinas.length}</td>
                <td className="p-2">
                  <button
                    onClick={() => openDetail(userName)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[#5e19146f] bg-opacity-30 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeDetail}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto max-h-[85vh] overflow-y-auto animate-fade-in-down p-6 z-10 mt-25">
            <button
              onClick={closeDetail}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 transition-colors duration-300 text-2xl"
              aria-label="Cerrar modal"
            >
              &times;
            </button>

            <div className="flex items-start gap-4 mb-6">
              {groupedByUser[selectedUser]?.[0]?.user.picture ? (
                <Image
                  src={groupedByUser[selectedUser]?.[0]?.user.picture}
                  alt={selectedUser}
                  width={80}
                  height={80}
                  className="rounded-full object-cover border"
                />
              ) : (
                <FaUser className="w-20 h-20 text-gray-500 mt-2" />
              )}
              
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-[#5e1914] mb-2">
                  Rutinas Asignadas a {selectedUser}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaEnvelope className="text-[#5e1914]" />
                    <span>
                      <strong>Email:</strong> {groupedByUser[selectedUser]?.[0]?.user.email || "No disponible"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaClock className="text-[#5e1914]" />
                    <span>
                      <strong>Último inicio:</strong> {formatDate(groupedByUser[selectedUser]?.[0]?.user.last_login)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaCalendarAlt className="text-[#5e1914]" />
                    <span>
                      <strong>Cuenta creada:</strong> {formatDate(groupedByUser[selectedUser]?.[0]?.user.created_at)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaUser className="text-[#5e1914]" />
                    <span>
                      <strong>Estado:</strong> 
                      <span className={`ml-1 ${groupedByUser[selectedUser]?.[0]?.user.is_blocked ? 'text-red-600' : 'text-green-600'}`}>
                        {groupedByUser[selectedUser]?.[0]?.user.is_blocked ? "Bloqueado" : "Activo"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold text-[#5e1914] mb-3">Rutinas asignadas:</h3>
              
              {groupedByUser[selectedUser]?.map((asignacion) => {
                const isOpen = openAccordions[asignacion.id] || false;

                return (
                  <div key={asignacion.id} className="mb-4 border rounded-md overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleAccordion(asignacion.id)}
                      className="w-full text-left px-4 py-3 bg-gray-100 font-medium hover:bg-gray-200 transition flex justify-between items-center"
                    >
                      <span>{asignacion.routine.name}</span>
                      <span className="text-sm text-gray-500">
                        
                      </span>
                    </button>

                    <div
                      className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-[300px] py-3 overflow-y-auto" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm text-gray-700 mb-2">{asignacion.routine.description}</p>

                      {asignacion.routine.videoUrl ? (
                        <video controls className="w-full rounded-md mb-2">
                          <source src={asignacion.routine.videoUrl} type="video/mp4" />
                          Tu navegador no soporta el video.
                        </video>
                      ) : asignacion.routine.imageUrl ? (
                        <Image
                          src={asignacion.routine.imageUrl}
                          alt={asignacion.routine.name}
                          width={800}
                          height={600}
                          className="w-full h-auto rounded-md mb-2"
                        />
                      ) : null}

                      <button
                        onClick={() => eliminarAsignacion(asignacion.id)}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                      >
                        Eliminar Asignación
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeDetail}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}