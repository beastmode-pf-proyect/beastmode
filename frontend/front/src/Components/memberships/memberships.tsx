// components/memberships/MembershipSection.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SubscriptionModal from "../Suscripcion/suscripcionStripe";

export type Plan = {
  id: string;
  name: string;
  price: number;
  features: string[];
};

const MembershipSection = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

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

  const plans: Plan[] = [
    {
      id: "novato",
      name: "NOVATO",
      price: 39,
      features: [
        "Entrena en casa – Videos profesionales con ejercicios guiados",
        "10% OFF en clases grupales (spinning, pilates, zumba, etc)",
        "Plan alimenticio 7 días adaptado a tus metas",
        "20% OFF en tu membresía por traer a un amigo",
      ],
    },
    {
      id: "pro",
      name: "PRO",
      price: 89,
      features: [
        "Todo en Novato, más:",
        "25% OFF en suplementos deportivos",
        "Entrenador personal 24/7 – Soporte constante",
        "Evaluación médica completa",
        "Acceso prioritario a todas las clases",
      ],
    },
  ];

  return (
    <div
      className={`w-full px-4 py-12 sm:py-20 lg:px-8 xl:px-20 `}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl  font-medium text-center mb-12 text-red-950">
          ELIGE TU PLAN Y ACTIVA TU BEASTMODE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`border-2 ${
                plan.id === "pro"
                  ? "border-red-900 rounded-4xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col relative"
                  : "border-gray-200 rounded-4xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col"
              }`}>
              {plan.id === "pro" && (
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
                  <span className="text-lg md:text-xl">/al mes</span>
                </p>

                <ul className="space-y-3 text-gray-700 text-sm md:text-base">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span
                        className={`${
                          plan.id === "pro" ? "text-red-500" : "text-green-500"
                        } mr-2`}>
                        {plan.id === "pro" ? "⚡" : "✅"}
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleNavigation(plan.id)}
                  className={`w-full rounded-3xl px-6 py-3 font-medium transition-colors duration-300 ${
                    plan.id === "pro"
                      ? "bg-red-900 text-white border-2 border-red-900 hover:bg-red-800 hover:border-red-800"
                      : "bg-transparent text-red-950 border-2 border-red-950 hover:bg-red-950 hover:text-white"
                  }`}>
                  {plan.id === "pro" ? "¡Quiero ser PRO!" : "Comenzar Ahora"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <SubscriptionModal plan={selectedPlan} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MembershipSection;
