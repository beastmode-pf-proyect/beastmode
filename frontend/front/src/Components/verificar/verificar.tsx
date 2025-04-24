"use client";
import { useSessionUser } from "@/app/SessionUserContext";
import { useEffect, useState } from "react";

export interface MembershipPlan {
    id: string;
    name: string;
    price: string;
    duration: string;
    isActive: boolean;
    description: string;
  }

export interface Subscription {
  id: string;
  startDate: string;
  endDate: string;
  isPago: boolean;
  isActive: boolean;
  user: {
    email: string;
    name: string;
    picture: string;
  };
  membershipPlan: MembershipPlan;
}

export const UserMembership = () => {
  const { user: currentUser } = useSessionUser();
  const [membershipName, setMembershipName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserMembership = async () => {
      try {
        if (!currentUser?.email) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions`
        );
        
        if (!response.ok) {
          throw new Error("No se pudo obtener la membresía");
        }
        
        const data: Subscription[] = await response.json();
        
        // Buscar la primera suscripción activa y pagada del usuario
        const activeMembership = data.find(
          (sub) => sub.user.email === currentUser.email && sub.isPago && sub.isActive
        );
        
        if (activeMembership) {
          setMembershipName(activeMembership.membershipPlan.name);
        }
      } catch (error) {
        console.error("Error al obtener la membresía:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMembership();
  }, [currentUser?.email]);

  if (loading) {
    return <div>Cargando membresía...</div>;
  }

  if (!membershipName) {
    return <div>No tienes una membresía activa</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold text-lg">Tu membresía actual:</h3>
      <p className="text-indigo-600 font-medium">{membershipName}</p>
    </div>
  );
};