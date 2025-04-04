"use client";
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";

const LoginFormProvider = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [error, setError] = useState("");
  const router = useRouter();

  // Función para guardar usuario en Supabase
  interface Auth0User {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
  }

  const saveUserToSupabase = async (auth0User: Auth0User) => {
    try {
      if (!auth0User.sub || !auth0User.email) {
        throw new Error("Datos de usuario incompletos");
      }

      const { data, error: supabaseError } = await supabase
        .from("users2")
        .upsert(
          {
            auth0_id: auth0User.sub,
            email: auth0User.email,
            name: auth0User.name || null,
            picture: auth0User.picture || null,
            last_login: new Date().toISOString(),
          },
          { onConflict: "auth0_id" }
        )
        .select();

      if (supabaseError) {
        console.error("Error de Supabase:", supabaseError);
        throw supabaseError;
      }

      return data;
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      throw error;
    }
  };

  // Efecto para manejar el usuario autenticado
  useEffect(() => {
    const handleAuth = async () => {
      if (isAuthenticated && user) {
        try {
          if (user.sub) {
            Swal.fire({
                title: "Procesando tu información",
                html: "Estamos preparando tu dashboard...",
                allowOutsideClick: false,
                didOpen: () => {
                Swal.showLoading();
                }
               });
            await saveUserToSupabase({
              sub: user.sub,
              email: user.email || "",
              name: user.name,
              picture: user.picture,
            });
            Swal.fire({
                          icon: "success",
                          title: "¡Bienvenido!",
                          text: "Redirigiendo a tu dashboard...",
                          timer: 1500,
                          showConfirmButton: false,
                          willClose: () => {
                            router.push("/Landing");
                          }
                        });
          } else {
            throw new Error("El usuario no tiene un 'sub' válido.");
          }
          router.push("/Landing"); // Redirige al dashboard después de guardar el usuario
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Error al guardar información del usuario"
          );
        }
      }
    };

    handleAuth();
  }, [isAuthenticated, user, router]);
  // Manejo del login con Auth0
  
    
  if (isLoading) {
    return (
      <h1></h1>
    );
  }
  if (error) {
    return (
      <p></p>
    );
  }
};

export default LoginFormProvider;