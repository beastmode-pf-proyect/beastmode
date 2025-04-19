"use client";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import { GiMuscleUp } from "react-icons/gi";

export default function BienvenidaPremium() {
  const { user: auth0User, isAuthenticated, isLoading } = useAuth0();
  const [saludo, setSaludo] = useState("👋 ¡Hola!");
  const [nombre, setNombre] = useState("Entrenador");

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo("☀️ Buenos días");
    else if (hora >= 12 && hora < 18) setSaludo("🌤️ Buenas tardes");
    else setSaludo("🌙 Buenas noches");
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isLoading && auth0User?.name) {
      setNombre(auth0User.name);
    }
  }, [auth0User, isAuthenticated, isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-gradient-to-br from-[#842b2b] to-[#5a1a1a] text-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl mx-auto mt-6 overflow-hidden"
    >
      {/* Efecto de partículas ampliado */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: 0
          }}
          animate={{
            x: [null, (Math.random() - 0.5) * 40],
            y: [null, (Math.random() - 0.5) * 40],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: Math.random() * 3
          }}
          className="absolute rounded-full bg-white/20"
          style={{
            width: `${Math.random() * 8 + 3}px`,
            height: `${Math.random() * 8 + 3}px`,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icono animado más grande */}
        <motion.div
          animate={{
            rotate: [0, 8, -8, 0],
            y: [0, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="text-7xl text-red-400 mb-6"
        >
          <GiMuscleUp />
        </motion.div>

        {/* Texto más grande y con más espacio */}
        <motion.div className="w-full max-w-3xl mx-auto">
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {saludo}, <span className="text-red-300 bg-clip-text bg-gradient-to-r from-red-300 to-red-400">{nombre}</span>!
          </motion.h1>

          <motion.p
            className="text-xl text-slate-200"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ¡Hoy es tu día para brillar y motivar a tus atletas!
          </motion.p>
        </motion.div>
      </div>

      {/* Barra decorativa animada */}
      <motion.div
        className="mt-8 h-1 bg-white/10 rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.8, duration: 1.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-red-400 to-red-600"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            delay: 1,
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
      </motion.div>
    </motion.div>
  );
}