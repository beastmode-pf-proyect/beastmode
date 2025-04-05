"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { HiUserGroup, HiUserCircle, HiUser } from "react-icons/hi";

interface RoleStats {
  ADMIN: number;
  TRAINER: number;
  USER: number;
}

interface UserWithRole {
    role_id: number;
    roles?: {
      name?: string;
    } | [] | null| undefined;
  }

const Estadisticas = () => {
  const [stats, setStats] = useState<RoleStats>({
    ADMIN: 0,
    TRAINER: 0,
    USER: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleCounts = async () => {
      try {
        const { data, error } = await supabase
          .from("users2")
          .select("role_id, roles!inner(name)");

        if (error) throw error;

        const counts: RoleStats = {
          ADMIN: 0,
          TRAINER: 0,
          USER: 0,
        };

        (data as UserWithRole[]).forEach((user) => {
          const roleName = user.roles?.name?.toUpperCase();
          if (roleName && Object.keys(counts).includes(roleName)) {
            counts[roleName as keyof RoleStats]++;
          }
        });

        setStats(counts);
      } catch (err) {
        console.error("Error al obtener estadísticas de roles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleCounts();
  }, []);

  if (loading) return <p className="text-center text-lg">Cargando estadísticas...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-[#5e1914] text-white p-6 rounded-xl shadow-md flex flex-col items-center">
        <HiUserGroup size={48} />
        <h2 className="text-xl font-bold mt-2">Administradores</h2>
        <p className="text-3xl font-bold">{stats.ADMIN}</p>
      </div>

      <div className="bg-[#3B3B66] text-white p-6 rounded-xl shadow-md flex flex-col items-center">
        <HiUserCircle size={48} />
        <h2 className="text-xl font-bold mt-2">Entrenadores</h2>
        <p className="text-3xl font-bold">{stats.TRAINER}</p>
      </div>

      <div className="bg-[#178a7a] text-white p-6 rounded-xl shadow-md flex flex-col items-center">
        <HiUser size={48} />
        <h2 className="text-xl font-bold mt-2">Usuarios</h2>
        <p className="text-3xl font-bold">{stats.USER}</p>
      </div>
    </div>
  );
};

export default Estadisticas;
