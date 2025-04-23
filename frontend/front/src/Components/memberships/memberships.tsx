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

const MembershipSection = () => {
  const router = useRouter();
  const { user: currentUser } = useSessionUser();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
  }, [currentUser?.email]);

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
    return <div className="w-full px-4 py-12 text-center">Cargando planes...</div>;
  }

  return (
    <div className="w-full px-4 py-12 sm:py-20 lg:px-8 xl:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-12 text-red-950">
          ELIGE TU PLAN Y ACTIVA TU BEASTMODE
        </h2>

        {userSubscription && (
          <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-700">
              Actualmente tienes el plan <span className="font-bold">{userSubscription.membershipPlan.name}</span> activo.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {plans.length > 0 ? (
            plans.map((plan) => {
              const isCurrentPlan = userSubscription?.membershipPlan.id === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`border-2 ${
                    plan.name === "Pro" && !isCurrentPlan
                      ? "border-red-900 rounded-4xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col relative"
                      : isCurrentPlan
                      ? "border-gray-400 rounded-4xl bg-gray-100 p-6 flex flex-col relative opacity-80"
                      : "border-gray-200 rounded-4xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col"
                  }`}
                >
                  {plan.name === "Pro" && !isCurrentPlan && (
                    <div className="absolute top-0 right-0 bg-red-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-4xl">
                      POPULAR
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute top-0 right-0 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-4xl">
                      ACTUAL
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
                        isCurrentPlan
                          ? "bg-gray-400 text-white border-2 border-gray-400 cursor-not-allowed"
                          : plan.name === "Pro"
                          ? "bg-red-900 text-white border-2 border-red-900 hover:bg-red-800 hover:border-red-800"
                          : "bg-transparent text-red-950 border-2 border-red-950 hover:bg-red-950 hover:text-white"
                      }`}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan
                        ? "Plan Actual"
                        : plan.name === "Pro"
                        ? "¡Quiero ser PRO!"
                        : "Comenzar Ahora"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No hay planes disponibles</div>
          )}
        </div>
      </div>

      {selectedPlan && <SubscriptionModal plan={selectedPlan} onClose={handleCloseModal} />}
    </div>
  );
};

export default MembershipSection;
