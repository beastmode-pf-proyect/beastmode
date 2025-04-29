"use client";

import React, { useEffect, useState } from "react";
import MembershipSection from "@/Components/memberships/memberships";
import Ctestimonios from "../Ctestimonios/Ctestimonios";
import { useSessionUser } from "@/app/SessionUserContext";
import DownloadDietSection from "./diets";
import { Subscription } from "../Cliente/SuscripActivodeaact";
import TrialRoutinesOnly from "../Todo-Sobre-Rutina/Rutina-PruebaClient";

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 animate-pulse">
      {/* Skeleton Banner */}
      <div className="bg-gray-200 h-48 shadow-lg" />

      {/* Skeleton Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {/* Skeleton Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1 space-y-4">
            <div className="h-10 bg-gray-300 rounded w-3/4" />
            <div className="h-6 bg-gray-300 rounded w-1/2" />
          </div>
          <div className="w-full md:w-96 h-32 bg-gray-300 rounded-xl" />
        </div>

        {/* Skeleton Trial Routines */}
        <div className="mt-8 mb-6 mx-4 space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 bg-gray-200 rounded-lg">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-300 rounded w-full mb-4" />
                <div className="h-10 bg-gray-300 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton Diet Section */}
        <div className="bg-gray-200 h-48 rounded-xl" />

        {/* Skeleton Testimonials */}
        <div className="py-20 space-y-8">
          <div className="text-center space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-gray-200 rounded-xl">
                <div className="h-4 bg-gray-300 rounded w-full mb-2" />
                <div className="h-4 bg-gray-300 rounded w-4/5 mb-4" />
                <div className="flex items-center mt-4">
                  <div className="h-12 w-12 bg-gray-300 rounded-full" />
                  <div className="ml-4">
                    <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-300 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { user: currentUser, loading: userLoading, user } = useSessionUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isClientUser, setIsClientUser] = useState<boolean>(false);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        if (!currentUser?.email) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions`
        );
        const data: Subscription[] = await response.json();
        setSubscriptions(
          data.filter((sub) => sub.user.email === currentUser.email && sub.isPago)
        );
      } catch (error) {
        console.error("Error obteniendo suscripciones:", error);
      }
    };

    const checkIfUserIsClient = async () => {
      try {
        if (!currentUser?.email) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/client`
        );
        const clients = await response.json();
        setIsClientUser(
          clients.some(
            (client: { email: string }) => client.email === currentUser.email
          )
        );
      } catch (error) {
        console.error("Error verificando cliente:", error);
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchMemberships(), checkIfUserIsClient()]);
      setIsLoading(false);
    };

    if (!userLoading) loadData();
  }, [currentUser?.email, userLoading]);

  const checkSubStatus = () => {
    return subscriptions[0]?.isActive ? "ACTIVA" : "DESACTIVA";
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  if (isLoading || userLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Banner de bienvenida */}
      <section className="bg-gradient-to-r from-red-900 to-red-700 shadow-lg rounded-b-xl">
  <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          ¡Bienvenid@, <span className="capitalize text-amber-300">{user?.name}</span>!
        </h1>
        <p className="text-sm text-red-100 mt-1">Tu progreso nos inspira cada día.</p>
      </div>

      {subscriptions?.length > 0 ? (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3 flex flex-col gap-1 text-white min-w-[260px]">
          <p className="text-sm font-medium">
            Membresía:{" "}
            <span className="font-semibold text-amber-200">
              {subscriptions[0]?.membershipPlan?.name}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-green-500/90 px-2 py-0.5 rounded-full font-semibold text-white">
              {checkSubStatus()}
            </span>
            <span className="text-white/80">Desde: {formatDate(subscriptions[0].startDate)}</span>
            <span className="text-white/80">Hasta: {formatDate(subscriptions[0].endDate)}</span>
          </div>
        </div>
      ) : (
        <MembershipSection />
      )}
    </div>
  </div>
</section>


      {isClientUser && (
        <div className="mt-8 mb-6 mx-4">
          <TrialRoutinesOnly />
        </div>
      )}

      <section className="bg-red-700">
        <DownloadDietSection />
      </section>

      <section className="bg-[length:150px_150px] bg-[radial-gradient(circle_at_15%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_50%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_15%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_70%,transparent_40%,#d1bdbd_41%),linear-gradient(45deg,#d1bdbd_25%,rgba(0,0,0,0.067)_0,rgba(0,0,0,0.067)_50%,#d1bdbd_0,#d1bdbd_75%,#1111_0,#1111_100%,#d1bdbd_0)]  py-20 px-4 sm:px-8 lg:px-16">
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
    </div>
  );
};

export default HomePage;