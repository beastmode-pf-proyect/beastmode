"use client";

import React, { useState } from "react";
import { Plan } from "../memberships/memberships";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("userId");

      if (!userId || !plan?.id || !stripe || !elements) {
        throw new Error("Faltan datos del usuario, del plan o de Stripe.");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("No se pudo obtener el elemento de tarjeta.");
      }

      const { paymentMethod, error: stripeError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name,
            email,
            phone,
          },
        });

      if (stripeError) {
        throw new Error(stripeError.message || "No se pudo procesar el pago.");
      }

      if (!paymentMethod) {
        throw new Error("No se pudo obtener el método de pago.");
      }

      const response = await fetch(`http://localhost:3001/stripe/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: plan.id,
          paymentMethodId: paymentMethod.id,
        }),
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
    setLoading(false);
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

        <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block font-medium mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="card-element" className="block font-medium mb-1">
            Información de la tarjeta
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
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>

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
