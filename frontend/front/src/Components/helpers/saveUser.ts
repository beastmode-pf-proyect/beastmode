import { supabase } from "@/lib/supabaseClient";

interface Auth0User {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

export const saveUserToSupabase = async (auth0User: Auth0User) => {
  if (!auth0User?.sub || !auth0User.email) {
    throw new Error("❌ Datos de usuario inválidos.");
  }

  // 📌 Obtener el ID del rol 'user' por defecto
  const { data: roles, error: roleError } = await supabase
  .from("roles")
  .select("id, name");

console.log("📌 Roles encontrados en la BD:", roles);
  if (roleError || !roles) {
    throw new Error("❌ Error obteniendo roles de la base de datos.");
  }

  console.log("📌 Roles encontrados en la BD:", roles);

  // Asignar el rol "user" por defecto si no se encuentra otro
  const roleData = roles.find(role => role.name === "user");

  if (!roleData) {
    throw new Error("❌ No se encontró el rol 'user' en la base de datos.");
  }

  console.log("🛠 Insertando usuario con role_id:", roleData.id);

  // 📌 Verificar si el usuario ya existe
  const { data: existingUser, error: fetchError } = await supabase
    .from("users2")
    .select("id, role_id")
    .eq("auth0_id", auth0User.sub)
    .single();
   

    console.log("🛠 Insertando usuario con:", {
      auth0_id: auth0User.sub,
      email: auth0User.email.toLowerCase().trim(),
      role_id: roleData.id,
    });
    
    

  if (fetchError && fetchError.code !== "PGRST116") {
    throw new Error(`❌ Error buscando usuario: ${fetchError.message}`);
  }

  if (!existingUser) {
    // 📌 Insertar nuevo usuario si no existe
    const { data: newUser, error: insertError } = await supabase
      .from("users2")
      .insert([
        {
          auth0_id: auth0User.sub,
          email: auth0User.email.toLowerCase().trim(),
          name: auth0User.name?.trim() || null,
          picture: auth0User.picture || null,
          last_login: new Date().toISOString(),
          role_id: roleData.id, // Asignar rol por defecto
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw new Error(`❌ Error insertando usuario: ${insertError.message}`);
    }

    console.log("✅ Usuario creado:", newUser);
    return newUser;
  } else {
    // 📌 Si el usuario ya existe, solo actualizar `last_login`
    const { data: updatedUser, error: updateError } = await supabase
      .from("users2")
      .update({
        last_login: new Date().toISOString(),
      })
      .eq("auth0_id", auth0User.sub)
      .select()
      .single();

    if (updateError) {
      throw new Error(`❌ Error actualizando usuario: ${updateError.message}`);
    }

    console.log("✅ Usuario actualizado:", updatedUser);
    return updatedUser;
  }
  
};
