export default function CancelPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">
          Pago cancelado ❌
        </h1>
        <p className="text-gray-700">
          No se completó la suscripción. Puedes intentarlo de nuevo cuando
          gustes.
        </p>
      </div>
    </div>
  );
}
