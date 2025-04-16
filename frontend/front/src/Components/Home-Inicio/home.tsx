"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MembershipSection from "@/Components/memberships/memberships";
import ExerciseList from "@/Components/FormEjercicios/exerciseList";
import { useAuth0 } from "@auth0/auth0-react";
import { UserData, Subscription } from "./interface";
import Ctestimonios from "../Ctestimonios/Ctestimonios";

const HomePage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userData, setUserData] = useState<UserData>({
    id: "",
    name: "",
    email: "",
    subscription: [], // Array vacío por defecto
  });

  // Fetch user + subscriptions en una sola petición (ideal)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.sub) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/subOfClient/${user?.sub}`
        );
        const data = await res.json(); // Asegúrate de que esto sea un objeto que contenga la información del usuario y sus suscripciones
        console.log("Datos de usuario recibidos:", data);
        setUserData(data); // Asegúrate de que `data` tenga la estructura correcta
      } catch (error) {
        console.error("Error al cargar suscripciones:", error);
      }
    };

    if (isAuthenticated) fetchUserData();
  }, [user?.sub, isAuthenticated]);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner de bienvenida personalizado */}
      <section className="bg-gradient-to-r from-red-900 to-red-700 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">
            ¡Bienvenid@ de vuelta,{" "}
            <span className="capitalize">{user?.name}</span>!
          </h1>
          {userData.subscription &&
          Array.isArray(userData.subscription) &&
          userData.subscription.length > 0 ? (
            userData.subscription.map((sub: Subscription) => (
              <div key={sub.id} className="mt-4 p-4 rounded-lg">
                <p className="font-bold text-lg text-amber-50">
                  {sub.membershipPlan.name}
                </p>
                <p className="mt-1">
                  Estado:{" "}
                  {sub.isActive ? (
                    <span className="text-green-300">✅ Activa</span>
                  ) : (
                    <span className="text-red-300">❌ Inactiva</span>
                  )}
                </p>
                {sub.endDate && (
                  <p className="text-sm mt-1">
                    Válida hasta: {new Date(sub.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="mt-4 bg-black/20 p-4 rounded-lg">
              <p>No hay suscripciones activas</p>
              <Link
                href="/memberships"
                className="text-yellow-300 hover:underline mt-2 inline-block"
              >
                Ver planes disponibles →
              </Link>
            </div>
          )}
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

export default HomePage;
