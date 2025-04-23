"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";

const LoginFormProvider = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [error, setError] = useState("");
  const hasHandledLogin = useRef(false);

  interface Auth0User {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
  }

  // Función para verificar si el email ya existe
  const checkEmailExists = useCallback(async (email: string) => {
    const { data, error } = await supabase
      .from("users2")
      .select("auth0_id")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }, []);

  const saveUserToSupabase = useCallback(
    async (auth0User: Auth0User) => {
      if (!auth0User.sub || !auth0User.email) {
        throw new Error("Datos de usuario incompletos");
      }

      // Verificar si el email ya existe para otro usuario
      const emailExists = await checkEmailExists(auth0User.email);
      if (emailExists) {
        const { data: existingUser } = await supabase
          .from("users2")
          .select("auth0_id")
          .eq("email", auth0User.email)
          .single();

        // Si el email existe pero no coincide con el auth0_id actual
        if (existingUser?.auth0_id !== auth0User.sub) {
          Swal.fire({
            icon: "error",
            title: "Correo ya registrado",
            text: "Este correo electrónico ya está asociado a otra cuenta.",
            confirmButtonText: "Entendido",
          });
          await logout({ logoutParams: { returnTo: window.location.origin } });
          throw new Error("Correo ya registrado");
        }
      }

      // Resto de la lógica original...
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
        setTimeout(() => {
          logout({ logoutParams: { returnTo: window.location.origin } });
        }, 300);
        throw new Error("Usuario bloqueado");
      }

      const { error: supabaseError } = await supabase.from("users2").upsert(
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
    },
    [checkEmailExists, logout]
  );

  useEffect(() => {
    const handleAuth = async () => {
      if (isAuthenticated && user && !hasHandledLogin.current) {
        hasHandledLogin.current = true;

        try {
          await saveUserToSupabase({
            sub: user.sub || "",
            email: user.email || "",
            name: user.name,
            picture: user.picture,
          });
        } catch (error) {
          if (
            error instanceof Error && 
            (error.message === "Usuario bloqueado" || error.message === "Correo ya registrado")
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
  }, [isAuthenticated, user, saveUserToSupabase]);

  if (isLoading) return null;
  if (error) return null;

  return null;
};

export default LoginFormProvider;