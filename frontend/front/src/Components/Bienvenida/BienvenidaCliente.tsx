"use client";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaDumbbell } from "react-icons/fa";

interface UserData {
  name: string;
  email: string;
}

export default function Bienvenida() {
  const { user: auth0User, isAuthenticated, isLoading } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [saludo, setSaludo] = useState("👋 ¡Hola!");

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo(" Buenos días");
    else if (hora >= 12 && hora < 18) setSaludo(" Buenas tardes");
    else setSaludo(" Buenas noches");
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth0User?.sub) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${auth0User.sub}`
        );
        if (!res.ok) throw new Error("Error al obtener usuario");

        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchUserData();
    }
  }, [auth0User, isAuthenticated, isLoading]);

  if (!userData) return null;

  return (
    <div className="bg-[#5e1914] text-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-4xl mx-auto mt-6">
      <div className="flex items-center gap-5">
        <div className="text-5xl sm:text-6xl text-white animate-pulse">
          <FaDumbbell />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {saludo}, <span className="text-yellow-300">{userData.name}</span>!
          </h1>
          <p className="text-sm sm:text-base text-slate-200 mt-1">
            ¡Listo para activar el{" "}
            <strong className="text-yellow-300">modo bestia</strong> hoy! 🏋️
          </p>
        </div>
      </div>
    </div>
  );
}
