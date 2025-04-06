"use client";

import React, { useState } from "react";
import { Plan } from "../memberships/memberships";

interface SubscriptionModalProps {
  plan: Plan | null;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  plan,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("userId");

      if (!userId || !plan?.id) {
        throw new Error("Faltan datos del usuario o del plan.");
      }

      const response = await fetch(`http://localhost:3001/stripe/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: plan.id }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.message || "No se pudo iniciar el pago.");
      }

      window.location.href = data.url;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al procesar el pago.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Suscripción</h2>

        {plan && (
          <div className="mb-4">
            <p className="font-semibold">Plan seleccionado:</p>
            <p>{plan.name}</p>
            <p>${plan.price} / al mes</p>
          </div>
        )}

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-950/95 text-white py-2 rounded-md hover:bg-red-950/90 transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}>
            {loading ? "Procesando..." : "Suscribirse"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionModal;
