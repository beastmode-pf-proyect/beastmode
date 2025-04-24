"use client"
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CardMotivacional() {
  const router = useRouter();

 
  const irARutina = () => {
    router.push("/Dasboard-User/Rutina");
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-red-900 to-red-950 text-white rounded-3xl shadow-xl p-8 w-full max-w-2xl mx-auto mt-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        className="flex items-center gap-5 mb-6"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-6xl sm:text-7xl animate-pulse">
          🏋️‍♂️
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            ¡Es hora de ponerte en **modo bestia**!
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 mt-3">
            Cada día es una nueva oportunidad para desafiarte y mejorar. ¡Vamos a hacerlo!
          </p>
        </div>
      </motion.div>
      <motion.button
        className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-650 transition duration-300"
        onClick={irARutina}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Ver mi Rutina
      </motion.button>
    </motion.div>
  );
}
