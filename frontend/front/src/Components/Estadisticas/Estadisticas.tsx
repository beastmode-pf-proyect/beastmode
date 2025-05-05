"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { UserIcon, DumbbellIcon } from "lucide-react";

type Role = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

const UserRoleStatsWithModal: React.FC = () => {
  const [clientList, setClientList] = useState<User[]>([]);
  const [trainerList, setTrainerList] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<"client" | "trainer" | null>(null);

  useEffect(() => {
    const fetchClients = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/client`).then(res => res.json());
    const fetchTrainers = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/trainer`).then(res => res.json());

    Promise.all([fetchClients, fetchTrainers])
      .then(([clients, trainers]) => {
        setClientList(clients);
        setTrainerList(trainers);
      })
      .catch(err => {
        console.error("Error al obtener usuarios", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const openModal = (role: "client" | "trainer") => {
    setActiveRole(role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveRole(null);
  };

  return (
    <div className="p-6 bg-rose-50 rounded-2xl shadow-md w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-center text-rose-900 mb-6">
        📊 Estadísticas de Usuarios
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Cargando...</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => openModal("client")}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-full hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <UserIcon className="w-5 h-5" />
              <span>Clientes</span>
            </div>
            <span className="text-3xl font-bold text-blue-700">{clientList.length}</span>
          </button>

          <button
            onClick={() => openModal("trainer")}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-full hover:bg-green-50 transition focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <DumbbellIcon className="w-5 h-5" />
              <span>Entrenadores</span>
            </div>
            <span className="text-3xl font-bold text-green-700">{trainerList.length}</span>
          </button>
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
            <Dialog.Title className="text-lg font-bold mb-4 text-center text-rose-800">
              Lista de {activeRole === "client" ? "Clientes" : "Entrenadores"}
            </Dialog.Title>

            <ul className="space-y-3 max-h-80 overflow-y-auto">
              {(activeRole === "client" ? clientList : trainerList).map(user => (
                <li
                  key={user.id}
                  className="border-b pb-1 text-gray-800 font-medium"
                >
                  {user.name} —{" "}
                  <span className="text-sm text-gray-500">{user.email}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={closeModal}
              className="mt-6 w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg transition"
            >
              Cerrar
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserRoleStatsWithModal;
