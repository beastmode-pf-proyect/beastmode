"use client";

import React from "react";
import { Plan } from "../memberships/memberships";
import Swal from "sweetalert2";

interface SubscriptionModalProps {
  plan: Plan | null;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  plan,
  onClose,
}) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubscribe = async () => {
    const userId = sessionStorage.getItem("id");
    const origin = window.location.origin;

    if (!userId) {
      Swal.fire({
        title: "Error",
        text: "Debes registrarte o iniciar sesión.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    if (!plan?.id) {
      Swal.fire({
        title: "Error",
        text: "Falta el plan seleccionado.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/stripe/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: plan.id,
          origin
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          title: "Error",
          text: errorData.message || "No se pudo iniciar el pago.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      const data = await response.json();

      if (!data.url) {
        Swal.fire({
          title: "Error",
          text: "No se recibió la URL de redirección.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      window.location.href = data.url;
    } catch (error) {
              console.log(error);

      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al procesar la suscripción.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Suscripción</h2>
        {plan && (
          <div className="mb-4">
            <p className="font-semibold">Plan seleccionado:</p>
            <p>{plan.name}</p>
            <p>${plan.price} / al mes</p>
          </div>
        )}
        <p className="mb-4">
          ¿Estás seguro de que deseas suscribirte a este plan?
        </p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleSubscribe}
            className="w-full bg-red-950/95 text-white py-2 rounded-md hover:bg-red-950/90 transition-colors duration-300">
            Suscribirse
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
