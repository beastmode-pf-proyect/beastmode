import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { auth0_id } = req.body;

  if (!auth0_id) {
    return res.status(400).json({ error: "El ID del usuario de Auth0 es requerido" });
  }

  try {
    // Obtener token
    const response = await fetch(`https://dev-2sj6t1v3uioay6ho.us.auth0.com/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) throw new Error("Error obteniendo el token de Auth0");

    const { access_token } = await response.json();

    // Llamar a la API de Auth0 para eliminar el usuario
    const deleteResponse = await fetch(
      `https://dev-2sj6t1v3uioay6ho.us.auth0.com/api/v2/users/${auth0_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      console.error("Error al eliminar usuario en Auth0:", errorData);
      return res.status(500).json({ error: "No se pudo eliminar el usuario en Auth0" });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente de Auth0" });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
