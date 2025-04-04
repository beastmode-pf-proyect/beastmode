"use client";
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";

const LoginForm = () => {
  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();
  const [error, setError] = useState("");
  const router = useRouter();

  // Función para guardar usuario en Supabase
  interface Auth0User {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
  }

  const saveUserToSupabase = React.useCallback(async (auth0User: Auth0User) => {
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
  }, []);

  // Efecto para manejar el usuario autenticado
  useEffect(() => {
    const handleAuth = async () => {
      if (isAuthenticated && user) {
        try {
          if (user.sub) {
            // Mostrar SweetAlert2 mientras se procesa
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

            // Cerrar SweetAlert2 y redirigir
            Swal.fire({
              icon: "success",
              title: "¡Bienvenido!",
              text: "Redirigiendo a tu dashboard...",
              timer: 1500,
              showConfirmButton: false,
              willClose: () => {
                router.push("/dashboard");
              }
            });
          } else {
            throw new Error("El usuario no tiene un 'sub' válido.");
          }
        } catch (error) {
          Swal.close(); // Cerrar cualquier alerta abierta
          setError(
            error instanceof Error
              ? error.message
              : "Error al guardar información del usuario"
          );
        }
      }
    };

    handleAuth();
  }, [isAuthenticated, user, router, saveUserToSupabase]);

  // Manejo del login con Auth0
  const handleAuth0Login = () => {
    loginWithRedirect({
      authorizationParams: {
        scope: "openid profile email",
      },
      appState: {
        returnTo: "/dashboard",
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        O inicia sesión con
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <div className="mt-6">
        <button
          onClick={handleAuth0Login}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
        >
          <FaGoogle className="mr-2 text-red-500" />
          Continuar con Google
        </button>
      </div>
    </div>
  );
};

export default LoginForm;