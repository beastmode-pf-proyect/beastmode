"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  created_at: string;
}

const NewUsersCarousel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`);
        if (!res.ok) throw new Error("Error al obtener los usuarios");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const sequence = async () => {
        await controls.start({
          x: "-100%",
          transition: { duration: 30, ease: "linear", repeat: Infinity }
        });
      };
      sequence();
    }
  }, [users, controls]);

  const newUsers = [...users]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  // Duplicamos los usuarios para el efecto de carrusel infinito
  const duplicatedUsers = [...newUsers, ...newUsers];

  if (loading) return (
    <div className="flex justify-center items-center h-32">
      <div className="w-8 h-8 border-4 border-[#5e1914] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6 relative group max-w-6xl mx-auto px-4"> {/* Contenedor principal con ancho máximo */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-[#5e1914]">
          <span className="bg-gradient-to-r from-[#7a1e18] to-[#5e1914] bg-clip-text text-transparent">
            Nuevos Miembros
          </span>
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => controls.stop()}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          </button>
          <button 
            onClick={() => controls.start({
              x: "-100%",
              transition: { duration: 30, ease: "linear", repeat: Infinity }
            })}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

        <motion.div
          ref={carouselRef}
          className="flex gap-6 w-max"
          animate={controls}
        >
          {duplicatedUsers.map((user, index) => (
            <motion.div
              key={`${user.id}-${index}`}
              className="min-w-[280px] bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#5e1914]/20">
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name}
                        width={64}
                        height={64}
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://ui-avatars.com/api/?name=${user.name?.charAt(0) || 'U'}&background=${encodeURIComponent('#5e1914')}&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#5e1914] text-white font-bold text-xl">
                        {user.name?.charAt(0) ?? "?"}
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-lg truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{new Date(user.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#5e1914]/5 to-[#7a1e18]/5 p-4 text-center">
                <span className="text-xs font-semibold text-[#5e1914]">NUEVO MIEMBRO</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default NewUsersCarousel;