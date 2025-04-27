"use client";

import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";
import { FaSignInAlt } from "react-icons/fa";

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

      const { data: existingUser, error: fetchError } = await supabase
        .from("users2")
        .select("id, picture")
        .eq("auth0_id", auth0User.sub)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      const isNewUser = !existingUser;
      const pictureToSave = auth0User.picture || existingUser?.picture || null;

      const { error: upsertError } = await supabase
        .from("users2")
        .upsert(
          {
            auth0_id: auth0User.sub,
            email: auth0User.email,
            name: auth0User.name || null,
            picture: pictureToSave,
            last_login: new Date().toISOString(),
            ...(isNewUser && { role_id: "a039d031-b804-4b7b-afdf-f57424f2fbd9" }),
          },
          { onConflict: "auth0_id" }
        )
        .select();

      if (upsertError) throw upsertError;
      return { isNewUser };
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const handleAuth = async () => {
      if (isAuthenticated && user && user.sub && !isProcessing) {
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
            const returnTo = window.sessionStorage.getItem("returnTo") || "/dashboard";
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
    <div className="w-full">
      <button
        onClick={handleAuth0Login}
        className="relative w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-white font-semibold bg-[#a82717] shadow-[0_4px_20px_rgba(0,0,0,0.4)] 
          hover:bg-[#5e1914] hover:shadow-[0_0_15px_3px_rgba(168,39,23,0.7)] 
          transition-all duration-300 border border-transparent hover:border-red-700"
      >
        <span className="absolute -inset-px rounded-xl bg-gradient-to-r from-[#5e1914] to-[#a82717] opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm" />
        <FaSignInAlt className="text-xl z-10" />
        <span className="z-10">Inicia Sesión / Regístrate</span>
      </button>
    </div>
  );
};

export default LoginForm;
