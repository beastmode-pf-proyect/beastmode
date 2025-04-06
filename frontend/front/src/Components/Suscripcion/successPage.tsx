export default function SuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          ¡Pago exitoso! 🎉
        </h1>
        <p className="text-gray-700">
          Tu suscripción ha sido activada correctamente.
        </p>
      </div>
    </div>
  );
}
