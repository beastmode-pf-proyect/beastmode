"use client";

import React, { ReactNode } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

interface StripeProviderProps {
  children: ReactNode; 
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

  return (
    <Elements stripe={stripePromise}>
      {children}
     
    </Elements>
  );
};

export default StripeProvider;
