"use client";

import React, { ReactNode } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
// import SubscriptionPaymentForm from "./suscripcionStripe";

interface StripeProviderProps {
  children: ReactNode; 
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const apiKey =
    "pk_test_51R9t7eQKouyjKSLT2PqRRBnkeIMP5sHjGorwM5FHfSM1xTlj8BY8v7qq3eKeT28TVtJzcTNiqFCa3nUHzjkjuVxJ00f5tXBiUD";
  const stripePromise = loadStripe(apiKey);

  return (
    <Elements stripe={stripePromise}>
      {children}
     ]
    </Elements>
  );
};

export default StripeProvider;
