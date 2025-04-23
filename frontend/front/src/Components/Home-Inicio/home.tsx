"use client";

import React, { useEffect, useState } from "react";
import MembershipSection from "@/Components/memberships/memberships";
import Ctestimonios from "../Ctestimonios/Ctestimonios";
import { useSessionUser } from "@/app/SessionUserContext";
import { Subscription } from "../Cliente/SuscripActivodeaact";

const HomePage: React.FC = () => {
  const { user: currentUser, loading: userLoading, user } = useSessionUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  console.log(loading)

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

        setSubscriptions(data);
      } catch (error) {
        console.error("No se pudo", error);
      }
    };
    if (!userLoading) {
      fetchMemberships();
    }
  }, [currentUser?.email, userLoading]);

  console.log(subscriptions);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner de bienvenida personalizado */}
      <section className="bg-gradient-to-r from-red-900 to-red-700 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            ¡Bienvenid@ de vuelta,{" "}
            <span className="capitalize">{user?.name}</span>!
          </h1>
          <section className="mb-8">
            {subscriptions?.length > 0 ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                {/* Cabecera */}
                <p className="text-green-800 font-medium">
                  ¡Ya eres miembro{" "}
                  <span className="font-bold">
                    {subscriptions[0]?.membershipPlan?.name}
                  </span>
                  !
                </p>
              </div>
            ) : (
              <MembershipSection />
            )}
          </section>
        </div>
      </section>

      {/* Sección de entrenamiento rápido */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-red-950 mb-6">
            Tu Entrenamiento de Hoy
          </h2>
          <p>
            &apos;la mismas rutinas que estan en el dashboard (especie de acceso
            directo)&apos;
          </p>
        </div>
      </section>

      {/* Comunidad */}
      <section className="bg-[length:150px_150px] bg-[radial-gradient(circle_at_15%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_50%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_15%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_70%,transparent_40%,#d1bdbd_41%),linear-gradient(45deg,#d1bdbd_25%,rgba(0,0,0,0.067)_0,rgba(0,0,0,0.067)_50%,#d1bdbd_0,#d1bdbd_75%,#1111_0,#1111_100%,#d1bdbd_0)]  py-20 px-4 sm:px-8 lg:px-16">
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
