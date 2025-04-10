"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const session_id: string | null = searchParams.get("session_id");
  const transaction_id: string | null = searchParams.get("transaction_id");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!session_id || !transaction_id) return;

      try {
        const response = await fetch(`${backendUrl}/stripe/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: session_id,
            transactionId: transaction_id,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire("Éxito", data.message, "success").then(() => {
            router.push("/");
          });
        } else {
          Swal.fire(
            "Error",
            data.message || "No se pudo verificar el pago",
            "error"
          );
        }
      } catch (error) {
        console.error("Error verificando el pago:", error);
        Swal.fire("Error", "Ocurrió un error al verificar el pago", "error");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [session_id, transaction_id, router, backendUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {verifying ? (
        <p className="text-lg font-semibold">Verificando tu pago.....</p>
      ) : (
        <p className="text-lg font-semibold">Redirigiendo.....</p>
      )}
    </div>
  );
};

export default SuccessPage;
