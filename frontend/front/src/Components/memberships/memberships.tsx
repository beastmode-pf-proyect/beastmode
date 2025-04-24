"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SubscriptionModal from "../Suscripcion/suscripcionStripe";
import { useSessionUser } from "@/app/SessionUserContext";

export type Plan = {
  id: string;
  name: string;
  price: string;
  duration: string;
  isActive: boolean;
  description: string;
};

type UserSubscription = {
  id: string;
  isActive: boolean;
  membershipPlan: Plan;
};

type SubscriptionResponse = {
  id: string;
  isActive: boolean;
  isPago: boolean;
  user: {
    email: string;
  };
  membershipPlan: Plan;
};

type UserRole = "ADMIN" | "TRAINER" | "CLIENT" | null;

const MembershipSection = () => {
  const router = useRouter();
  const { user: currentUser } = useSessionUser();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (!currentUser?.id) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/role/${currentUser.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user role");
        }

        const roleText = await response.text();
        const normalizedRole = roleText.toUpperCase();

        if (["ADMIN", "TRAINER", "CLIENT"].includes(normalizedRole)) {
          setUserRole(normalizedRole as UserRole);
        } else {
          setUserRole("CLIENT");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("CLIENT");
      }
    };

    fetchUserRole();
  }, [currentUser?.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Si el usuario es ADMIN o TRAINER, no necesitamos cargar los planes
        if (userRole === "ADMIN" || userRole === "TRAINER") {
          setLoading(false);
          return;
        }

        const plansResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/memberships`);
        const plansData = await plansResponse.json();
        const activePlans = Array.isArray(plansData)
          ? plansData.filter((plan: Plan) => plan.isActive)
          : [];
        setPlans(activePlans);

        if (currentUser?.email) {
          const subsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions`);
          const subsData: SubscriptionResponse[] = await subsResponse.json();

          const activeSub = subsData.find(
            (sub) =>
              sub.user.email === currentUser.email && sub.isActive && sub.isPago
          );

          if (activeSub) {
            setUserSubscription({
              id: activeSub.id,
              isActive: activeSub.isActive,
              membershipPlan: activeSub.membershipPlan,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.email, userRole]);

  const handleNavigation = (id: string) => {
    const plan = plans.find((p) => p.id === id);
    if (plan) {
      if (userSubscription?.membershipPlan.id === id) return;
      setSelectedPlan(plan);
    } else {
      router.push(`/membership/${id}`);
    }
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center text-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-900 mb-4"></div>
          <span className="text-xl text-gray-600">Cargando...</span>
        </div>
      </div>
    );
  }

  // Si el usuario es ADMIN o TRAINER, mostrar mensaje motivador
  if (userRole === "ADMIN" || userRole === "TRAINER") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-red-900">
          ¡Gracias por tu increíble trabajo!
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl">
          {userRole === "ADMIN" ? (
            <span>
              Como administrador, tu trabajo detrás de escena es crucial para que todo funcione a la perfección. 
              Aunque no necesitas una suscripción, tu esfuerzo y visión siguen siendo la fuerza que impulsa nuestra comunidad.
            </span>
          ) : (
            <span>
              Como entrenador, eres la inspiración y guía para nuestros miembros. Tu conocimiento y dedicación son el motor que impulsa el éxito de todos, 
              y no necesitas un plan de suscripción para seguir liderando.
            </span>
          )}
        </p>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-12 sm:py-20 lg:px-8 xl:px-20 flex items-center justify-center">
      <div className="max-w-7xl w-full">
        {/* Título agregado */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center text-red-950">
          Nuestros Planes
        </h2>

        {userSubscription ? (
          <>
            <div className="mb-6 flex flex-col items-center text-center">
              <h3 className="text-2xl font-semibold text-gray-800">Este es tu plan activo</h3>
              <p className="text-gray-600">
                Estás disfrutando del plan <span className="font-bold">{userSubscription.membershipPlan.name}</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {plans
                .filter((plan) => plan.id === userSubscription.membershipPlan.id)
                .map((plan) => (
                  <div
                    key={plan.id}
                    className="border-2 border-gray-400 rounded-4xl bg-gray-100 p-6 flex flex-col relative opacity-80"
                  >
                    <div className="absolute top-0 right-0 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-4xl">
                      ACTUAL
                    </div>
                    <div className="flex-grow">
                      <p className="text-xl md:text-2xl font-light mb-2 text-gray-600">
                        {plan.name}
                      </p>
                      <p className="text-3xl md:text-4xl font-extrabold mb-6 font-[Inter] text-red-950">
                        ${plan.price}
                        <span className="text-lg md:text-xl">/{plan.duration}</span>
                      </p>
                      <p className="text-sm md:text-base mb-4 text-gray-700">
                        {plan.description}
                      </p>
                    </div>
                    <div className="mt-8">
                      <button
                        disabled
                        className="w-full rounded-3xl px-6 py-3 font-medium bg-gray-400 text-white border-2 border-gray-400 cursor-not-allowed"
                      >
                        Plan Actual
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border-2 border-gray-200 rounded-4xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col relative"
              >
                {plan.name === "Pro" && (
                  <div className="absolute top-0 right-0 bg-red-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-4xl">
                    POPULAR
                  </div>
                )}
                <div className="flex-grow">
                  <p className="text-xl md:text-2xl font-light mb-2 text-gray-600">
                    {plan.name}
                  </p>
                  <p className="text-3xl md:text-4xl font-extrabold mb-6 font-[Inter] text-red-950">
                    ${plan.price}
                    <span className="text-lg md:text-xl">/{plan.duration}</span>
                  </p>
                  <p className="text-sm md:text-base mb-4 text-gray-700">
                    {plan.description}
                  </p>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => handleNavigation(plan.id)}
                    className={`w-full rounded-3xl px-6 py-3 font-medium transition-colors duration-300 ${
                      plan.name === "Pro"
                        ? "bg-red-900 text-white border-2 border-red-900 hover:bg-red-800 hover:border-red-800"
                        : "bg-transparent text-red-950 border-2 border-red-950 hover:bg-red-950 hover:text-white"
                    }`}
                  >
                    {plan.name === "Pro" ? "¡Quiero ser PRO!" : "Comenzar Ahora"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPlan && <SubscriptionModal plan={selectedPlan} onClose={handleCloseModal} />}
    </div>
  );
};

export default MembershipSection;
