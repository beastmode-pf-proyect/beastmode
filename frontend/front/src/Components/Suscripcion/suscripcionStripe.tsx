"use client";

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
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
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Obtener los datos de la tarjeta del usuario
      const cardElement = elements?.getElement(CardElement);
      if (!cardElement || !stripe) {
        throw new Error("Stripe no está inicializado correctamente.");
      }

      // Crear un token o una fuente de pago con Stripe
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Enviar la información de pago y el plan seleccionado al backend
      const planId = plan?.id || "";
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          planId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al procesar la suscripción.");
      }

      // Redirigir al usuario a una página de confirmación o mostrar un mensaje de éxito
      // ...

      setLoading(false);
      onClose();
    } catch (err) {
      setError(
        "Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo."
      );
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#5e19147b]">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className=" text-2xl font-bold mb-4">Suscripción</h2>
        {plan && (
          <div className="mb-4">
            <p className="text-gray-600 font-medium">Plan seleccionado:</p>
            <p className="text-red-950 text-2xl font-extrabold">{plan.name}</p>
            <p className="text-gray-700 font-medium">
              Precio: ${plan.price} /al mes
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="card-element" className="block font-medium mb-2">
              Información de tarjeta
            </label>
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
            />
          </div>
          {error && (
            <div className="bg-red-500 text-white px-4 py-2 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            className={`w-full bg-red-950/95 text-white py-2 rounded-md hover:bg-red-950/90 transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}>
            {loading ? "Procesando..." : "Suscribirse"}
          </button>
          <button
            type="button"
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300"
            onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionModal;
