"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MembershipSection from "@/Components/memberships/memberships";
import Ctestimonios from "@/Components/Ctestimonios";
import ExerciseList from "@/Components/FormEjercicios/exerciseList";
import { useAuth0 } from "@auth0/auth0-react";
import { UserData } from "./interface";

const Home: React.FC = () => {
  const { user: auth0User, isAuthenticated, isLoading } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Fetch user + subscriptions en una sola petición (ideal)
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !auth0User?.sub) return;

      try {
        // 1. Obtener usuario
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${auth0User.sub}`
        );
        if (!userRes.ok) throw new Error(`Error usuario: ${userRes.status}`);
        const user = await userRes.json();

        // 2. Obtener suscripción (singular)
        let subscription = null;
        try {
          const subscriptionRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/${auth0User.sub}`
          );

          if (subscriptionRes.ok) {
            subscription = await subscriptionRes.json();
          }
        } catch (subError) {
          console.warn("No se pudo cargar la suscripción:", subError);
        }

        // 3. Actualizar estado (usa array si el backend puede devolver múltiples)
        setUserData({
          ...user,
          subscription: subscription ? [subscription] : [], // Convertimos a array
        });
      } catch (error) {
        console.error("Error crítico:", error);
      }
    };

    fetchData();
  }, [isAuthenticated, auth0User?.sub]);

  if (isLoading || !userData) return <div>Cargando...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner de bienvenida personalizado */}
      <section className="bg-gradient-to-r from-red-900 to-red-700 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">
            ¡Bienvenid@ de vuelta,{" "}
            <span className="capitalize">{userData.name}</span>!
          </h1>
          {userData.subscription ? (
            userData.subscription.map((sub) => (
              <div key={sub.id}>
                <p className="text-black">{sub.membershipPlan.name}</p>
              </div>
            ))
          ) : (
            <p>Activa tu membresía BEASTMODE</p>
          )}
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
            <p className="text-2xl font-bold"></p>
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
            <p className="text-2xl font-bold"></p>
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
