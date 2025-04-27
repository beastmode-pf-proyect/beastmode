"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaCalendarAlt, FaClock, FaChevronDown } from "react-icons/fa";
import Image from "next/image";
import { useAuth0 } from "@auth0/auth0-react";

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
interface User {
  id: string;
  name: string;
  picture: string;
  email: string;
  auth0_id: string; 
  role: {
    name: string;
  };
}

export default function VerRutinasAsignadas() {
  const [asignaciones, setAsignaciones] = useState<AssignedRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
  const { isAuthenticated, isLoading, error, user, getAccessTokenSilently } = useAuth0();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [apiError, setApiError] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener usuarios");
        
        const usersData: User[] = await response.json();

        const auth0Id = user?.sub;
        const matchedUser = usersData.find((u) => u.auth0_id === auth0Id);

        if (matchedUser) {
          setCurrentUser(matchedUser);
        } else {
          setApiError("Usuario no encontrado en la base de datos");
        }
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Error desconocido");
      }
    };

    if (isAuthenticated) fetchUserData();
  }, [isAuthenticated, getAccessTokenSilently, user?.sub]);

  let content = null;
  if (isLoading) {
    content = <div className="p-4">Cargando...</div>;
  } else if (error) {
    content = <div className="p-4 text-red-500">Error: {error.message}</div>;
  } else if (!isAuthenticated) {
    content = <div className="p-4">No estás autenticado</div>;
  } else if (apiError) {
    content = <div className="p-4 text-red-500">Error: {apiError}</div>;
  }

  const fetchAsignaciones = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-workout`)
      .then((res) => res.json())
      .then((data) => {
        setAsignaciones(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar las rutinas asignadas:", err);
        toast.error("Error al cargar rutinas asignadas");
        setLoading(false);
      });
  };

  if (!currentUser && !content) {
    content = <div className="p-4">Cargando usuario...</div>;
  }
    if (currentUser) {
      fetchAsignaciones();
    }
    

  const eliminarAsignacion = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la asignación de rutina.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#5e1914",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-workout/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Asignación eliminada correctamente");
        fetchAsignaciones();
      } else {
        const data = await res.json();
        toast.error(data.message || "No se pudo eliminar la asignación");
      }
    } catch (err) {
      console.error("Error eliminando asignación:", err);
      toast.error("Error al eliminar la asignación");
    }
  };

  const groupedByUser = asignaciones.reduce(
    (acc: Record<string, AssignedRoutine[]>, asignacion) => {
      const userName = asignacion.user?.name || "Desconocido";
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
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#5e1914]/10 to-[#5e1914]/5">
          <h2 className="text-2xl font-bold text-[#5e1914]">
            Rutinas Asignadas
          </h2>
          <p className="text-gray-600 mt-1">Administra las rutinas asignadas a los usuarios</p>
        </div>

        {loading ? (
          <div className="space-y-4 p-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="w-40 h-4 bg-gray-200 rounded" />
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded" />
                <div className="w-24 h-9 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : Object.keys(groupedByUser).length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-gray-500 py-10">No hay rutinas asignadas</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#5e1914] text-white">
                <tr>
                  <th className="p-4 text-left rounded-tl-lg">Usuario</th>
                  <th className="p-4 text-left">Rutinas</th>
                  <th className="p-4 text-left rounded-tr-lg">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(groupedByUser).map(([userName, rutinas]) => (
                  <tr key={userName} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {rutinas[0].user.picture ? (
                          <Image
                            src={rutinas[0].user.picture}
                            alt={userName}
                            width={40}
                            height={40}
                            className="rounded-full object-cover border-2 border-white shadow"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <FaUser />
                          </div>
                        )}
                        <span className="font-medium">{userName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#5e1914]/10 text-[#5e1914]">
                        {rutinas.length}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => openDetail(userName)}
                        className="px-4 py-2 bg-[#5e1914] text-white rounded-lg hover:bg-[#5e1914]/90 transition flex items-center gap-2"
                      >
                        <span>Ver detalle</span>
                        <FaChevronDown size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                      {isOpen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
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
