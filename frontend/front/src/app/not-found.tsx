import React from 'react';
import { Dumbbell, ArrowLeft, Flame } from 'lucide-react';
import Link from 'next/link';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5e1914] to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white shadow-2xl border border-white/20">
        <div className="flex flex-col items-center text-center space-y-6">
         
          <div className="relative">
            <Dumbbell className="w-24 h-24 animate-bounce" />
            <Flame className="w-8 h-8 absolute -top-2 -right-2 text-orange-500 animate-pulse" />
          </div>

          <h1 className="text-8xl font-bold tracking-tighter">
            4<span className="text-[#5e1914]">0</span>4
          </h1>

          
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Entrenamiento no encontrado!</h2>
            <p className="text-gray-300 max-w-md">
            Parece que esta rutina de ejercicios se perdió en el vestuario.
            No te preocupes, ¡nuestros entrenadores tienen muchos más entrenamientos para ti!
            </p>
          </div>

          <Link 
            href="/"
            className="group flex items-center gap-2 bg-[#5e1914] hover:bg-[#4a1410] px-6 py-3 rounded-full transition-all duration-300 mt-4"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
            Volver al entrenamiento
          </Link>
          
          <div className="absolute top-10 left-10 opacity-20">
            <Dumbbell className="w-16 h-16 rotate-45" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-20">
            <Dumbbell className="w-16 h-16 -rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;