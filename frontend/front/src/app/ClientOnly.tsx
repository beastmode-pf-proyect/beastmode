"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { toast } from "react-toastify";
import { User } from "@auth0/auth0-react"; // Importa el tipo User de Auth0



export default function ClientOnly({
  children,
  isAuthenticated,
  user,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
  user?: User; 
}) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.sub}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, 
              },
            }
          );

          if (!response.ok) {
            throw new Error("Error al verificar el estado del usuario");
          }

          const userData = await response.json();
          setIsBlocked(userData.is_blocked); 

          if (userData.is_blocked) {
            toast.error(
              "Tu cuenta ha sido bloqueada. No tienes acceso a esta sección."
            );
            router.push("/"); 
          }
        } catch (error) {
          toast.error("Error al verificar el estado del usuario");
          console.error("Error:", error);
        }
      }
    };

    checkUserStatus();
    setHasMounted(true); 
  }, [isAuthenticated, user, router]); 

  if (!hasMounted || (isAuthenticated && isBlocked)) {
    return null; 
  }

  return <>{children}</>;
}
