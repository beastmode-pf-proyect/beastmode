import React from "react";
import Link from "next/link";
import MembershipSection from "@/Components/memberships/memberships";
import Ctestimonios from "@/Components/Ctestimonios";
import ExerciseList from "@/Components/FormEjercicios/exerciseList";

const Home: React.FC = () => {
  // Datos del usuario (simulado)
  const user = {
    name: "Juan Pérez",
    membership: "// Adquiere tu membresía // Novato // Premium //",
    lastWorkout: "Piernas - 2 días atrás",
    nextSession: "Mañana 8:00 AM - Clase de Spinning",
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner de bienvenida personalizado */}
      <section className="bg-gradient-to-r from-red-900 to-red-700 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">
            ¡Bienvenido de vuelta,{" "}
            <span className="capitalize">{user.name}</span>!
          </h1>
          <p className="text-red-100">
            Tu membresía {user.membership} está activa
          </p>
        </div>
      </section>

      {/* Dashboard rápido */}
      <section className="py-12 px-4">
        <p>Esto solo aparecerá para los NOVATO y PRO</p>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta de último entrenamiento */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-600">
            <h3 className="font-bold text-gray-700 mb-2">
              Último Entrenamiento
            </h3>
            <p className="text-2xl font-bold">{user.lastWorkout}</p>
            <Link
              href="/workouts"
              className="text-red-600 hover:text-red-700 mt-4 inline-block font-medium"
            >
              Ver detalles →
            </Link>
          </div>

          {/* Tarjeta de próxima sesión */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
            <h3 className="font-bold text-gray-700 mb-2">Próxima Clase</h3>
            <p className="text-2xl font-bold">{user.nextSession}</p>
            <Link
              href="/schedule"
              className="text-blue-600 hover:text-blue-700 mt-4 inline-block font-medium"
            >
              Ver agenda →
            </Link>
          </div>

          {/* Tarjeta de progreso */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-600">
            <h3 className="font-bold text-gray-700 mb-2">Tu Progreso</h3>
            <div className="h-4 bg-gray-200 rounded-full mb-2">
              <div className="h-full bg-green-500 rounded-full w-3/4"></div>
            </div>
            <p className="text-sm text-gray-600">75% de tu meta mensual</p>
          </div>
        </div>
      </section>

      {/* Sección de entrenamiento rápido */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-red-950 mb-6">
            Tu Entrenamiento de Hoy
          </h2>
          <p>
            &apos;Una rutina random o la rutina más reciente del traineer&apos;
          </p>
        </div>
      </section>

      <section>
        <MembershipSection />
      </section>

      {/* Comunidad */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-red-950 mb-6">
            Opiniones de la Comunidad
          </h2>
          <Ctestimonios />
        </div>
      </section>

      {/* <ExerciseList /> */}
    </div>
  );
};

export default Home;
