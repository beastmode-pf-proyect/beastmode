import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const response = await fetch(`https://dev-2sj6t1v3uioay6ho.us.auth0.com/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret:process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) throw new Error("Error obteniendo el token de Auth0");

    const data = await response.json();
    res.status(200).json({ access_token: data.access_token });
  } catch (error) {
    console.error("Error al obtener el token de Auth0:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
