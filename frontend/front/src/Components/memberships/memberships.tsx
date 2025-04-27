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

  // Asignar rol por defecto o desde backend si hay sesión
  useEffect(() => {
    if (!currentUser) {
      setUserRole("CLIENT"); // Visitante sin sesión
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/role/${currentUser.id}`);
        if (!response.ok) throw new Error("Error obteniendo rol de usuario");

        const roleText = await response.text();
        const normalized = roleText.toUpperCase().trim();
        const validRoles: UserRole[] = ["ADMIN", "TRAINER", "CLIENT"];
        setUserRole(validRoles.includes(normalized as UserRole) ? (normalized as UserRole) : "CLIENT");
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("CLIENT");
      }
    };

    fetchUserRole();
  }, [currentUser]);

  // Cargar planes y suscripción del usuario (si hay)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userRole === "ADMIN" || userRole === "TRAINER") {
          setLoading(false);
          setPlans([]);
          return;
        }

        const plansResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/memberships`);
        const plansData = await plansResponse.json();
        setPlans(Array.isArray(plansData) ? plansData.filter((plan: Plan) => plan.isActive) : []);

        if (currentUser?.email) {
          const subsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions`);
          const subsData: SubscriptionResponse[] = await subsResponse.json();

          const activeSub = subsData.find(
            sub => sub.user.email === currentUser.email && sub.isActive && sub.isPago
          );

          if (activeSub) {
            setUserSubscription({
              id: activeSub.id,
              isActive: activeSub.isActive,
              membershipPlan: activeSub.membershipPlan
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
    const plan = plans.find(p => p.id === id);
    if (plan) {
      setSelectedPlan(plan);
    } else {
      router.push(`/membership/${id}`);
    }
  };

  const handleCloseModal = () => setSelectedPlan(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-max">
  <div className="flex flex-col items-center space-y-4">
    {/* Animación de mancuerna */}
    <div className="relative flex items-center">
      {/* Pesas laterales */}
      <div className="absolute -left-8 animate-[bounce_1.2s_infinite]">
        <div className="w-8 h-12 bg-white rounded-full shadow-lg transform skew-x-12" />
      </div>
      
      {/* Barra central */}
      <div className="w-16 h-4 bg-white rounded-lg animate-spin duration-1000" />
      
      {/* Pesas laterales */}
      <div className="absolute -right-8 animate-[bounce_1.2s_infinite] delay-150">
        <div className="w-8 h-12 bg-white rounded-full shadow-lg transform -skew-x-12" />
      </div>
    </div>

    {/* Texto animado */}
    <div className="text-center space-y-2">
      <p className="text-lg font-bold text-white animate-pulse">
        Preparando tu entrenamiento...
      </p>
      <p className="text-sm text-gray-200 italic">
        La fuerza crece con cada repetición
      </p>
    </div>
  </div>
</div>
    );
  }

  if (userRole === "ADMIN" || userRole === "TRAINER") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center text-white px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 ">¡Gracias por tu increíble trabajo!</h2>
        <p className="text-xl text-white mb-8 max-w-2xl">
          {userRole === "ADMIN"
            ? "Como administrador, tu trabajo detrás de escena es crucial para que todo funcione a la perfección."
            : "Como entrenador, eres la inspiración y guía para nuestros miembros. Tu conocimiento y dedicación son el motor del éxito."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-12 sm:py-20 lg:px-8 xl:px-20 flex items-center justify-center">
      <div className="max-w-7xl w-full">
        {!userSubscription && (
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center text-red-950">
            Nuestros Planes
          </h2>
        )}

          {userSubscription ? (
            <>
              <div className="mb-6 flex flex-col items-center text-center">
                <h3 className="text-2xl font-semibold text-gray-800">Plan activo actual</h3>
                <p className="text-gray-600">
                  Estás disfrutando del plan <span className="font-bold">{userSubscription.membershipPlan.name}</span>
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
                {plans
                  .filter(plan => plan.id === userSubscription.membershipPlan.id)
                  .map(plan => (
                    <div
                      key={plan.id}
                      className="w-full md:w-[500px] border-2 border-gray-400 rounded-4xl bg-gray-100 p-6 flex flex-col relative opacity-80"
                    >
                      <div className="absolute top-0 right-0 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-4xl">
                        ACTUAL
                      </div>
                      <div className="flex-grow">
                        <p className="text-xl md:text-2xl font-light mb-2 text-gray-600">{plan.name}</p>
                        <p className="text-3xl md:text-4xl font-extrabold mb-6 font-[Inter] text-red-950">
                          ${plan.price}<span className="text-lg md:text-xl">/{plan.duration}</span>
                        </p>
                        <p className="text-sm md:text-base mb-4 text-gray-700">{plan.description}</p>
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
            <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
              {plans.map(plan => (
                <div
                  key={plan.id}
                  className="w-full md:w-[500px] border-2 border-gray-200 rounded-4xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col relative"
                >
                  {plan.name === "Pro" && (
                    <div className="absolute top-0 right-0 bg-red-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-4xl">
                      POPULAR
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="text-xl md:text-2xl font-light mb-2 text-gray-600">{plan.name}</p>
                    <p className="text-3xl md:text-4xl font-extrabold mb-6 font-[Inter] text-red-950">
                      ${plan.price}<span className="text-lg md:text-xl">/{plan.duration}</span>
                    </p>
                    <p className="text-sm md:text-base mb-4 text-gray-700">{plan.description}</p>
                  </div>
                  <div className="mt-8">
                    <button
                      onClick={() => handleNavigation(plan.id)}
                      className={`w-full rounded-3xl px-6 py-3 font-medium transition-colors duration-300 ${
                        plan.name === "Pro"
                          ? "bg-red-900 text-white border-2 border-red-900 hover:bg-red-800"
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

        {selectedPlan && <SubscriptionModal plan={selectedPlan} onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export default MembershipSection;
