"use client";
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";

const LoginForm = () => {
  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const saveUserToSupabase = React.useCallback(async (auth0User: {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
  }) => {
    try {
      if (!auth0User.sub || !auth0User.email) {
        throw new Error("Datos de usuario incompletos");
      }

      // Verificar si ya existe el usuario
      const { data: existingUser } = await supabase
        .from("users2")
        .select("id")
        .eq("auth0_id", auth0User.sub)
        .single();

      const isNewUser = !existingUser;

      // Insertar o actualizar usuario
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

      if (supabaseError) throw supabaseError;
      return { data, isNewUser };
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const handleAuth = async () => {
      if (isAuthenticated && user?.sub && !isProcessing) {
        setIsProcessing(true);

        const hasWelcomed = window.sessionStorage.getItem("hasWelcomed");
        const hasInitialized = localStorage.getItem("hasInitialized");

        try {
          if (!hasWelcomed) {
            await Swal.fire({
              title: "Procesando...",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
          }

          const { isNewUser } = await saveUserToSupabase({
            sub: user.sub,
            email: user.email || "",
            name: user.name,
            picture: user.picture,
          });

          if (!hasWelcomed) {
            await Swal.fire({
              icon: "success",
              title: "¡Bienvenido!",
              timer: 1500,
              showConfirmButton: false,
            });
            window.sessionStorage.setItem("hasWelcomed", "true");
          }

          if (isNewUser && !hasInitialized) {
            localStorage.setItem("hasInitialized", "true");
            router.push("/landing");
          } else {
            const returnTo = window.sessionStorage.getItem("returnTo") || window.location.pathname || "/dashboard";
            router.push(returnTo);
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error instanceof Error ? error.message : "Error desconocido",
          });
        } finally {
          setIsProcessing(false);
        }
      }
    };

    handleAuth();
  }, [isAuthenticated, user, router, saveUserToSupabase, isProcessing]);

  const handleAuth0Login = () => {
    // Guardar la ruta actual antes de redirigir a login
    window.sessionStorage.setItem("returnTo", window.location.pathname);

    loginWithRedirect({
      authorizationParams: {
        scope: "openid profile email",
        redirect_uri: typeof window !== "undefined" ? window.location.origin : "",
      },
      appState: {
        returnTo: window.location.pathname,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleAuth0Login}
        className="w-full flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white hover:bg-[#5e1914] transition duration-300 bg-[#a82717]"
      >
        Inicia Sesión - Regístrate
      </button>
    </div>
  );
};

export default LoginForm;
