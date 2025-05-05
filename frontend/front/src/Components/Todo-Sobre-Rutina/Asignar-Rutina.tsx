"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Select, { components, OptionProps, SingleValueProps } from "react-select";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  auth0_id: string;
  picture: string;
}

interface Routine {
  id: string;
  name: string;
}

interface UserOption {
  value: string;
  label: string;
  picture: string;
}

export default function AsignarRutina() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [rutinas, setRutinas] = useState<Routine[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<string>("");
  const [userRoutine, setUserRoutine] = useState<Routine | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRutinas, setLoadingRutinas] = useState(true);
  const [loadingUserRoutine, setLoadingUserRoutine] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/client`);
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        console.error(err);
        toast.error("Error al obtener los usuarios");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsuarios();
  }, []);

  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine`);
        const data = await res.json();
        // Filtrar rutinas que no comiencen con "Prueba"
        const filteredRutinas = data.filter((rutina: Routine) => !rutina.name.startsWith("Prueba"));
        setRutinas(filteredRutinas);
      } catch (err) {
        console.error(err);
        toast.error("Error al obtener las rutinas");
      } finally {
        setLoadingRutinas(false);
      }
    };
    fetchRutinas();
  }, []);

  const fetchUserRoutine = useCallback(async (userId: string) => {
    if (!userId) {
      setUserRoutine(null);
      return;
    }
    setLoadingUserRoutine(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-workout/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserRoutine(data.routine || null);
      } else {
        setUserRoutine(null);
      }
    } catch (err) {
      console.error(err);
      setUserRoutine(null);
    } finally {
      setLoadingUserRoutine(false);
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserRoutine(selectedUser.value);
    } else {
      setUserRoutine(null);
    }
  }, [selectedUser, fetchUserRoutine]);

  const userOptions: UserOption[] = useMemo(
    () =>
      usuarios.map((user) => ({
        value: user.auth0_id,
        label: user.name || user.email || user.auth0_id,
        picture: user.picture,
      })),
    [usuarios]
  );

  const handleAsignar = useCallback(async () => {
    if (!selectedUser || !selectedRoutine) {
      toast("Selecciona un usuario y una rutina", { icon: "⚠️" });
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-workout/create/${selectedUser.value}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ routineId: selectedRoutine }),
        }
      );
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Rutina asignada correctamente");
        await fetchUserRoutine(selectedUser.value);
        setSelectedRoutine("");
      } else {
        toast.error(data.message || "No se pudo asignar la rutina");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al asignar la rutina");
    }
  }, [selectedUser, selectedRoutine, fetchUserRoutine]);

  const handleEliminar = useCallback(async () => {
    if (!selectedUser?.value || !userRoutine?.id) return;

    if (!window.confirm("¿Estás seguro de eliminar la rutina asignada?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-workout/${selectedUser.value}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        toast.success("Rutina eliminada correctamente");
        setUserRoutine(null);
        setSelectedRoutine("");
      } else {
        const data = await res.json();
        toast.error(data.message || "Error al eliminar la rutina");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar la rutina");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedUser, userRoutine]);

  const customUserOption = (props: OptionProps<UserOption, false>) => (
    <components.Option {...props}>
      <div className="flex items-center">
        <Image
          src={props.data.picture}
          alt="Foto de usuario"
          width={30}
          height={30}
          className="rounded-full mr-2"
        />
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );

  const customSingleValue = (props: SingleValueProps<UserOption, false>) => (
    <components.SingleValue {...props}>
      <div className="flex items-center">
        <Image
          src={props.data.picture}
          alt="Foto de usuario"
          width={30}
          height={30}
          className="rounded-full mr-2"
        />
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-[#5e1914]/10 to-[#5e1914]/5 p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#5e1914] text-center">
            Gestionar Rutinas
          </h2>
          <p className="text-gray-600 text-center mt-1">
            Asigna o elimina rutinas de usuarios
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Seleccionar Usuario
            </label>
            {loadingUsers ? (
              <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <Select
                value={selectedUser}
                onChange={(option) => setSelectedUser(option)}
                options={userOptions}
                placeholder="Selecciona un usuario"
                components={{ Option: customUserOption, SingleValue: customSingleValue }}
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {userRoutine ? "Rutina Asignada" : "Seleccionar Rutina"}
            </label>
            
            {loadingRutinas || loadingUserRoutine ? (
              <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse" />
            ) : userRoutine ? (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{userRoutine.name}</p>
                    <p className="text-sm text-gray-500">Rutina actualmente asignada</p>
                  </div>
                  <button
                    onClick={handleEliminar}
                    disabled={isDeleting}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
                  >
                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedRoutine}
                  onChange={(e) => setSelectedRoutine(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-[#5e1914]/50 focus:border-[#5e1914] outline-none transition-all"
                >
                  <option value="">Selecciona una rutina</option>
                  {rutinas.map((rutina) => (
                    <option key={rutina.id} value={rutina.id}>
                      {rutina.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {!userRoutine && (
            <button
              onClick={handleAsignar}
              disabled={!selectedRoutine || isDeleting}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all $$
                !selectedRoutine || isDeleting
                  ? "bg-gray-400 cursor-not-allowed": " bg-[#481410] hover:bg-[#481410] shadow-md hover:shadow-lg"
              }`}
            >
              Asignar Rutina
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
