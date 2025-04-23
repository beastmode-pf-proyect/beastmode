"use client";

import React, { useEffect, useState } from "react";
import MembershipSection from "@/Components/memberships/memberships";
import Ctestimonios from "../Ctestimonios/Ctestimonios";
import { useSessionUser } from "@/app/SessionUserContext";
import { Subscription } from "../Cliente/SuscripActivodeaact";
import UserWorkoutRoutines from "../Cliente/VerRutina";
import DownloadDietSection from "./diets";

const HomePage: React.FC = () => {
  const { user: currentUser, loading: userLoading, user } = useSessionUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  console.log(loading);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        if (!currentUser?.email) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions`
        );
        if (!response.ok) {
          throw new Error("No se pudo obtener las suscripciones");
        }
        const data: Subscription[] = await response.json();

        const userSubscriptions = data.filter(
          (sub) => sub.user.email === currentUser.email && sub.isPago
        );

        setSubscriptions(userSubscriptions);
      } catch (error) {
        console.error("No se pudo", error);
      }
    };
    if (!userLoading) {
      fetchMemberships();
    }
  }, [currentUser?.email, userLoading]);

  console.log(subscriptions);

  const checkSubStatus = () => {
    if (subscriptions[0].isActive === true) {
      return "ACTIVA";
    } else {
      return "DESACTIVA";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Banner de bienvenida - Mejorado */}
      <section className="bg-gradient-to-r from-red-800 to-red-600  shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">
                ¡Bienvenid@ de vuelta,{" "}
                <span className="capitalize text-amber-200">{user?.name}</span>!
              </h1>
              <p className="text-xl text-red-100">
                Tu progreso nos motiva cada día
              </p>
            </div>

            {subscriptions?.length > 0 ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-amber-50 font-medium text-lg">
                  Membresía:{" "}
                  <span className="font-bold text-2xl text-white">
                    {subscriptions[0]?.membershipPlan?.name}
                  </span>
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-green-500/90 text-xs font-bold rounded-full">
                    {checkSubStatus()}
                  </span>
                  <span className="text-sm text-white/80">
                    Desde: {subscriptions[0].startDate}
                  </span>
                  <span className="text-sm text-white/80">
                    Hasta: {subscriptions[0].endDate}
                  </span>
                </div>
              </div>
            ) : (
              <MembershipSection />
            )}
          </div>
        </div>
      </section>

      {/* Sección de entrenamiento - Mejorada */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              <span className="block">Tu Entrenamiento de Hoy</span>
              <span className="block text-red-600 text-xl mt-2">
                Rutinas destacadas de tu plan
              </span>
            </h2>
          </div>

          {/* Tarjeta de rutina 1 */}

          <UserWorkoutRoutines />
        </div>
      </section>

      {/* Comunidad - Mejorada */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Opiniones de la Comunidad
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Descubre las experiencias de otros miembros
            </p>
          </div>
          <Ctestimonios />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-red-700">
        <DownloadDietSection />
      </section>
    </div>
  );
};

export default HomePage;
