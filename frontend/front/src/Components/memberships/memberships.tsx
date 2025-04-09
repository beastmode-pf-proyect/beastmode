"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SubscriptionModal from "../Suscripcion/suscripcionStripe";

export type Plan = {
  id: string;
  name: string;
  price: string;
  duration: string;
  isActive: boolean;
  description: string;
};

const MembershipSection = () => {
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${backendUrl}/memberships`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setPlans(data);
        } else {
          console.error("Unexpected data format from API:", data);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, );

  const handleNavigation = (id: string) => {
    const plan = plans.find(p => p.id === id);
    if (plan) {
      setSelectedPlan(plan);
    } else {
      router.push(`/membership/${id}`);
    }
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  return (
    <div className={`w-full px-4 py-12 sm:py-20 lg:px-8 xl:px-20`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-12 text-red-950">
          ELIGE TU PLAN Y ACTIVA TU BEASTMODE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {plans.length > 0 ? (
            plans.map(plan => (
              <div
                key={plan.id}
                className={`border-2 ${
                  plan.name === "Pro"
                    ? "border-red-900 rounded-4xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col relative"
                    : "border-gray-200 rounded-4xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col"
                }`}>
                {plan.name === "Pro" && (
                  <div className="absolute top-0 right-0 bg-red-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-4xl">
                    POPULAR
                  </div>
                )}

                <div className="flex-grow">
                  <p className="text-gray-600 text-xl md:text-2xl font-light mb-2">
                    {plan.name}
                  </p>
                  <p className="text-red-950 text-3xl md:text-4xl font-extrabold mb-6 font-[Inter]">
                    ${plan.price}
                    <span className="text-lg md:text-xl">/{plan.duration}</span>
                  </p>

                  <p className="text-gray-700 text-sm md:text-base mb-4">
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
                    }`}>
                    {plan.name === "Pro"
                      ? "¡Quiero ser PRO!"
                      : "Comenzar Ahora"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>Cargando planes...</div>
          )}
        </div>
      </div>

      {selectedPlan && (
        <SubscriptionModal plan={selectedPlan} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MembershipSection;
