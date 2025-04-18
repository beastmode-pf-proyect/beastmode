"use client";

import { useEffect } from "react";

export default function DomainUpdater() {
  useEffect(() => {
    const url = window.location.origin;

    const allowed = process.env.NEXT_PUBLIC_ALLOWED_DOMAINS?.split(",") || [];
    const isAllowed = allowed.some(domain => url.includes(domain.trim()));

    if (!isAllowed) return;

    fetch("/api/update-auth0", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newUrl: url }),
    })
      .then(res => res.json())
      .then(data => console.log("✅ Auth0 actualizado:", data))
      .catch(err => console.error("❌ Error al actualizar Auth0:", err));
  }, []);

  return null;
}
