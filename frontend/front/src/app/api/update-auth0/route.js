// // app/api/update-auth0/route.js

// export async function POST(req) {
//   const body = await req.json();
//   const { newUrl } = body;

//   if (!newUrl) {
//     return new Response(
//       JSON.stringify({ error: 'Falta el parámetro "newUrl"' }),
//       { status: 400 }
//     );
//   }

//   const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
//   const MGMT_CLIENT_ID = process.env.AUTH0_MGMT_CLIENT_ID;
//   const MGMT_CLIENT_SECRET = process.env.AUTH0_MGMT_CLIENT_SECRET;
//   const APP_CLIENT_ID = process.env.AUTH0_CLIENT_ID; // este es el mismo en tu caso

//   try {
//     const tokenRes = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         grant_type: "client_credentials",
//         client_id: MGMT_CLIENT_ID,
//         client_secret: MGMT_CLIENT_SECRET,
//         audience: `https://${AUTH0_DOMAIN}/api/v2/`,
//       }),
//     });

//     if (!tokenRes.ok) {
//       const error = await tokenRes.json();
//       throw new Error(`Error obteniendo token: ${JSON.stringify(error)}`);
//     }

//     const { access_token } = await tokenRes.json();

//     const clientRes = await fetch(
//       `https://${AUTH0_DOMAIN}/api/v2/clients/${APP_CLIENT_ID}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const clientData = await clientRes.json();
//     const currentCallbacks = new Set(clientData.callbacks || []);
//     currentCallbacks.add(`${newUrl}/callback`);
//     currentCallbacks.add(newUrl);

//     const updateRes = await fetch(
//       `https://${AUTH0_DOMAIN}/api/v2/clients/${APP_CLIENT_ID}`,
//       {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           callbacks: Array.from(currentCallbacks),
//         }),
//       }
//     );

//     if (!updateRes.ok) {
//       const error = await updateRes.json();
//       throw new Error(`Error actualizando callbacks: ${JSON.stringify(error)}`);
//     }

//     const updated = await updateRes.json();

//     return new Response(
//       JSON.stringify({
//         message: "✅ URLs actualizadas en Auth0",
//         callbacks: updated.callbacks,
//       }),
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ error: error.message || "Error inesperado" }),
//       { status: 500 }
//     );
//   }
// }
