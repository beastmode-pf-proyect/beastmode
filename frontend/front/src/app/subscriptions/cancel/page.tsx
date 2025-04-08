"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const CancelPage = () => {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      icon: "error",
      title: "Pago cancelado",
      text: "No se pudo completar la transacción. Intenta nuevamente.",
    }).then(() => {
      router.push("/"); 
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Redirigiendo al inicio...</p>
    </div>
  );
};

export default CancelPage;
