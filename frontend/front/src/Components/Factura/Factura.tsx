"use client";
import { useEffect, useState } from "react";
import { useSessionUser } from "@/app/SessionUserContext";
import Image from "next/image";

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  isActive: boolean;
  description: string;
}

export interface Subscription {
  id: string;
  startDate: string;
  endDate: string;
  isPago: boolean;
  isActive: boolean;
  user: {
    email: string;
    name: string;
    picture: string;
  };
  membershipPlan: MembershipPlan;
}

const FacturaPremium = () => {
  const { user: currentUser, loading: userLoading } = useSessionUser();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Subscription | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (invoice: Subscription) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedInvoice(null);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        if (!currentUser?.email) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions`
        );
        if (!response.ok) throw new Error("No se pudo obtener las facturas.");
        const data: Subscription[] = await response.json();

        const userSubscriptions = data.filter(
          sub => sub.user.email === currentUser.email && sub.isPago
        );

        setSubscriptions(userSubscriptions);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      fetchSubscriptions();
    }
  }, [currentUser?.email, userLoading]);

  if (loading || userLoading)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-4xl mx-auto my-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );

  if (!subscriptions.length)
    return (
      <div className="max-w-4xl mx-auto my-12 text-center px-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No hay facturas
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron facturas para mostrar.
          </p>
        </div>
      </div>
    );

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Mis Facturas Premium
        </h1>
        <p className="text-sm text-gray-700 mt-1">
          Historial de todas tus suscripciones premium
        </p>
      </div>

      <div className="grid gap-4 sm:hidden">
        {subscriptions.map(sub => (
          <div key={sub.id} className="bg-white p-4 rounded-xl shadow border">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {sub.membershipPlan.name}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  sub.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                {sub.isActive ? "Activa" : "Inactiva"}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Precio: ${sub.membershipPlan.price}
            </p>
            <p className="text-sm text-gray-600">
              Duración: {sub.membershipPlan.duration}
            </p>
            <p className="text-sm text-gray-600">
              Inicio: {new Date(sub.startDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Fin: {new Date(sub.endDate).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleOpenModal(sub)}
              className="mt-3 text-[#5e1914] hover:text-[#8a2b24] text-sm font-medium hover:underline">
              Ver Detalle
            </button>
          </div>
        ))}
      </div>

      <div className="hidden sm:block mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gradient-to-r from-[#5e1914] to-[#8a2b24]">
              <tr>
                {[
                  "Plan",
                  "Precio",
                  "Duración",
                  "Inicio",
                  "Fin",
                  "Estado",
                  "",
                ].map((th, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold text-white">
                    {th || <span className="sr-only">Acciones</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {subscriptions.map(sub => (
                <tr
                  key={sub.id}
                  className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {sub.membershipPlan.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    ${sub.membershipPlan.price}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {sub.membershipPlan.duration}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(sub.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(sub.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sub.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {sub.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(sub)}
                      className="text-[#5e1914] hover:text-[#8a2b24] hover:underline">
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30  backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-y-auto max-h-[90vh] p-4 sm:p-6 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Detalle de Factura
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none text-xl">
                ✕
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex-shrink-0">
                <Image
                  src={selectedInvoice.user.picture}
                  alt="Foto de usuario"
                  width={80}
                  height={80}
                  className="rounded-full border border-gray-300"
                />
              </div>

              <div className="text-sm text-gray-700 w-full">
                <p className="mb-1">
                  <strong>Usuario:</strong> {selectedInvoice.user.name}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {selectedInvoice.user.email}
                </p>
                <p className="mb-1">
                  <strong>Plan:</strong> {selectedInvoice.membershipPlan.name}
                </p>
                <p className="mb-1">
                  <strong>Descripción:</strong>{" "}
                  {selectedInvoice.membershipPlan.description}
                </p>
                <p className="mb-1">
                  <strong>Precio:</strong> $
                  {selectedInvoice.membershipPlan.price}
                </p>
                <p className="mb-1">
                  <strong>Duración:</strong>{" "}
                  {selectedInvoice.membershipPlan.duration}
                </p>
                <p className="mb-1">
                  <strong>Inicio:</strong>{" "}
                  {new Date(selectedInvoice.startDate).toLocaleDateString()}
                </p>
                <p className="mb-1">
                  <strong>Fin:</strong>{" "}
                  {new Date(selectedInvoice.endDate).toLocaleDateString()}
                </p>
                <p className="mb-1">
                  <strong>Estado:</strong>{" "}
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedInvoice.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                    {selectedInvoice.isActive ? "Activa" : "Inactiva"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={handleCloseModal}
                className="inline-flex justify-center rounded-md border border-transparent bg-[#5e1914] px-4 py-2 text-sm font-medium text-white hover:bg-[#8a2b24] transition">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturaPremium;
