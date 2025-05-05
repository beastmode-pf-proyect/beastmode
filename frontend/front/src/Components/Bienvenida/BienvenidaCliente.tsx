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
    if (hora >= 5 && hora < 12) setSaludo("🌄 Buenos días");
    else if (hora >= 12 && hora < 18) setSaludo("☀️ Buenas tardes");
    else setSaludo("🌙 Buenas noches");
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth0User?.sub) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${auth0User.sub}`);
        if (!res.ok) throw new Error("Error al obtener usuario");
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    if (isAuthenticated && !isLoading) fetchUserData();
  }, [auth0User, isAuthenticated, isLoading]);

  if (!userData) return null;

  return (
    <div className="relative group bg-gradient-to-br from-[#4a100b] via-[#7a1f17] to-[#ad2c21] text-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-4xl mx-auto mt-6 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-[#ff6b6b33] to-[#ffd93d33] rounded-full mix-blend-soft-light animate-blob animation-delay-2000"></div>
        <div className="absolute -top-40 -right-20 w-96 h-96 bg-gradient-to-r from-[#4deee933] to-[#ffd93d33] rounded-full mix-blend-soft-light animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Partículas animadas */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative flex items-center gap-5 z-10">
        <div className="text-5xl sm:text-6xl text-yellow-300 animate-swing">
          <FaDumbbell />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
            {saludo}, <span className="text-stroke">{userData.name}</span>!
          </h1>
          <p className="text-sm sm:text-base text-slate-200 mt-2 font-medium">
            ¡Activemos el <span className="text-yellow-300 font-bold animate-pulse">modo bestia</span> hoy! 🏋️🔥
          </p>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes particle {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }

        @keyframes swing {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
          100% { transform: rotate(0deg); }
        }

        .animate-blob {
          animation: blob 10s infinite;
        }

        .animate-particle {
          animation: particle 5s linear infinite;
        }

        .animate-swing {
          animation: swing 2s ease-in-out infinite;
        }

        .text-stroke {
          -webkit-text-stroke: 1px #ffd93d;
          text-stroke: 1px #ffd93d;
        }
      `}</style>
    </div>
  );
}