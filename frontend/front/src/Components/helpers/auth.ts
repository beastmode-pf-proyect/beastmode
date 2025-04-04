import { supabase } from "@/lib/supabaseClient";
import { getAccessToken } from "@auth0/nextjs-auth0";


// Tipo más estricto para el usuario de Auth0
interface Auth0User {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

// Obtener roles desde Auth0 en una API Route de Next.js
export const getUserRoles = async (): Promise<string[]> => {
  try {
    const { accessToken } = await getAccessToken(); // ✅ Ahora sin argumentos
    const namespace = "https://your-app.com/roles"; // Usa el namespace que configuraste en Auth0
    return accessToken ? (accessToken[namespace] as string[]) || [] : [];
  } catch (error) {
    console.error("Error obteniendo los roles:", error);
    return [];
  }
};

// Guardar usuario y roles en Supabase
export const saveUserToSupabase = async (auth0User: Auth0User, roles: string[]): Promise<Record<string, unknown>> => {
  if (!auth0User?.sub || !auth0User.email) {
    throw new Error("❌ Datos de usuario inválidos");
  }

  const userData = {
    auth0_id: auth0User.sub,
    email: auth0User.email.toLowerCase().trim(),
    name: auth0User.name?.trim() || null,
    picture: auth0User.picture || null,
    last_login: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    roles: roles || [] // Evita null en la BD
  };

  try {
    const { data, error } = await supabase
      .from("users2")
      .upsert(userData, { onConflict: "auth0_id" })
      .select()
      .single();

    if (error) {
      console.error("❌ Error guardando usuario en Supabase:", error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("❌ Error en la operación de Supabase:", error);
    throw error;
  }
};
