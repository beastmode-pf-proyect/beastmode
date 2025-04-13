"use client";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export type User = {
  id: string;
  name: string;
  email: string;
};

const WelcomeCard: React.FC = () => {
  const { isAuthenticated, user } = useAuth0();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.sub) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.sub}`
        );
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error al obtener el usuario autenticado:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || loading) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#5e1914] text-white rounded-2xl p-10 md:p-12 shadow-2xl relative overflow-hidden mt-10 animate-fade-in">
      <div className="absolute right-6 top-6 opacity-10 text-white">
        <Sparkles className="w-24 h-24 animate-pulse" />
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        Bienvenido{userData?.name ? `, ${userData.name}` : ""} 👋
      </h1>
      <p className="mt-4 text-gray-200 max-w-2xl">
        Nos alegra tenerte de vuelta. Explora tus funcionalidades y saca el
        máximo provecho a la plataforma.
      </p>
    </div>
  );
};

export default WelcomeCard;
