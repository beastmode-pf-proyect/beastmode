"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";

const LoginFormProvider = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [error, setError] = useState("");
  const router = useRouter();
  const hasHandledLogin = useRef(false); // Solo se ejecuta una vez

  interface Auth0User {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
  }

  const saveUserToSupabase = async (auth0User: Auth0User) => {
    if (!auth0User.sub || !auth0User.email) {
      throw new Error("Datos de usuario incompletos");
    }

    // Verificar si el usuario está bloqueado
    const { data, error: fetchError } = await supabase
      .from("users2")
      .select("is_blocked")
      .eq("auth0_id", auth0User.sub)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (data?.is_blocked) {
      Swal.fire({
        icon: "error",
        title: "Usuario bloqueado",
        text: "Tu cuenta ha sido bloqueada. Por favor, comunícate con el administrador.",
        confirmButtonText: "Entendido",
      });
      // Opcional: cerrar sesión automáticamente
      // Esperamos a que el modal se cierre y luego deslogueamos
      setTimeout(() => {
        logout({ logoutParams: { returnTo: window.location.origin } });
      }, 300);
      
throw new Error("Usuario bloqueado");
    }

    // Guardar o actualizar usuario
    const { error: supabaseError } = await supabase
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
      );

    if (supabaseError) throw supabaseError;
  };

  useEffect(() => {
    const handleAuth = async () => {
      if (isAuthenticated && user && !hasHandledLogin.current) {
        hasHandledLogin.current = true;

        const isFirstLogin = !sessionStorage.getItem("hasWelcomed");

        try {
          if (isFirstLogin) {
            Swal.fire({
              title: "Procesando tu información",
              html: "Estamos preparando tu dashboard...",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
          }

          await saveUserToSupabase({
            sub: user.sub || "",
            email: user.email || "",
            name: user.name,
            picture: user.picture,
          });

          if (isFirstLogin) {
            Swal.fire({
              icon: "success",
              title: "¡Bienvenido!",
              text: "Redirigiendo a tu dashboard...",
              timer: 1500,
              showConfirmButton: false,
              willClose: () => {
                sessionStorage.setItem("hasWelcomed", "true");
              },
            });
          }

        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "Usuario bloqueado"
          ) {
            // No hacer nada, ya mostramos SweetAlert
          } else {
            console.error("Error de login:", error);
            setError(
              error instanceof Error
                ? error.message
                : "Error al guardar información del usuario"
            );
          }
        }
      }
    };

    handleAuth();
  }, [isAuthenticated, user, router]);

  if (isLoading) return null;
  if (error) return null;

  return null;
};

export default LoginFormProvider;
