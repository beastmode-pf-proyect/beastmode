"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaDumbbell, FaMedal, FaFire } from "react-icons/fa";

export default function CardMotivacional() {
  const router = useRouter();

  const cards = [
    {
      title: "Mis Rutinas",
      icon: <FaDumbbell className="text-4xl" />,
      gradient: "from-red-900 to-red-950",
      action: () => router.push("/Dasboard-User/Rutina"),
      buttonText: "Ver Rutinas",
      description: "Personaliza tu entrenamiento y alcanza nuevos récords"
    },
    {
      title: "Membresías",
      icon: <FaMedal className="text-4xl" />,
      gradient: "from-purple-900 to-indigo-950",
      action: () => router.push("/Dasboard-User/Mi-membresia"),
      buttonText: "Ver Beneficios",
      description: "Descubre los privilegios de tu membresía premium"
    },
    {
      title: "Motivación Diaria",
      icon: <FaFire className="text-4xl" />,
      gradient: "from-amber-800 to-orange-950",
      quote: "El dolor que sientes hoy será la fuerza que sentirás mañana",
      author: "Arnold Schwarzenegger"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 mt-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className="relative group h-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-3xl shadow-2xl transition-all duration-500 group-hover:shadow-3xl group-hover:-translate-y-2`}></div>
          
          <div className="relative h-full bg-gradient-to-br from-black/30 to-black/10 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
            <motion.div
              className="flex flex-col h-full"
              whileHover={{ scale: 1.02 }}
            >
              <div className="mb-6">
                <div className="text-yellow-400 mb-4 animate-pulse">
                  {card.icon}
                </div>
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {card.title}
                </h2>
                
                {card.description ? (
                  <>
                    <p className="text-slate-300 text-sm mb-6">{card.description}</p>
                    <motion.button
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold py-3 rounded-lg hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={card.action}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="drop-shadow-md">{card.buttonText}</span>
                    </motion.button>
                  </>
                ) : (
                  <div className="flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      <p className="text-2xl italic font-medium text-yellow-100 leading-tight">
                        {card.quote}
                      </p>
                      <p className="text-right text-orange-300 font-semibold">
                        - {card.author}
                      </p>
                    </div>
                    <div className="mt-6 animate-pulse text-center text-4xl">
                      🔥
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Efecto partículas */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}