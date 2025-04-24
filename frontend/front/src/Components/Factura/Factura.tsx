"use client";
import { useEffect, useState } from "react";
import { useSessionUser } from "@/app/SessionUserContext";
import Image from 'next/image';

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
  const [selectedInvoice, setSelectedInvoice] = useState<Subscription | null>(null);
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
        if (!response.ok) {
          throw new Error("No se pudo obtener las facturas.");
        }
        const data: Subscription[] = await response.json();

        const userSubscriptions = data.filter(
          (sub) => sub.user.email === currentUser.email && sub.isPago
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

  if (loading || userLoading) return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-4xl mx-auto my-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );
  
  if (!subscriptions.length) return (
    <div className="max-w-4xl mx-auto my-12 text-center">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No hay facturas</h3>
        <p className="mt-1 text-sm text-gray-500">No se encontraron facturas para mostrar.</p>
      </div>
    </div>
  );

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-tight text-gray-900">Mis Facturas Premium</h1>
          <p className="mt-2 text-sm text-gray-700">
            Historial de todas tus suscripciones premium
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gradient-to-r from-[#5e1914] to-[#8a2b24]">
              <tr>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">Plan</th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">Precio</th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">Duración</th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">Inicio</th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">Fin</th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">Estado</th>
                <th scope="col" className="relative px-4 py-3.5 text-left text-sm font-semibold text-white">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">{sub.membershipPlan.name}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">${sub.membershipPlan.price}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">{sub.membershipPlan.duration}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">{new Date(sub.startDate).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">{new Date(sub.endDate).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sub.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {sub.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(sub)}
                      className="text-[#5e1914] hover:text-[#8a2b24] font-medium hover:underline"
                    >
                      Ver Detalle<span className="sr-only">, {sub.membershipPlan.name}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-2xl font-bold text-[#5e1914]">Detalle de la Factura</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <span className="sr-only">Cerrar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h4 className="text-lg font-medium text-gray-900">Información del Usuario</h4>
                  <div className="mt-2 flex items-center">
                  {selectedInvoice.user.picture && (
                    <div className="h-10 w-10 rounded-full mr-3 overflow-hidden">
                        <Image
                        src={selectedInvoice.user.picture}
                        alt={`Foto de perfil de ${selectedInvoice.user.name}`}
                        width={40}
                        height={40}
                        className="object-cover"
                        quality={80}
                        loading="lazy"
                        />
                    </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedInvoice.user.name}</p>
                      <p className="text-sm text-gray-500">{selectedInvoice.user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Detalles del Plan</h4>
                  <dl className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Plan:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedInvoice.membershipPlan.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Precio:</dt>
                      <dd className="text-sm font-medium text-gray-900">${selectedInvoice.membershipPlan.price}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Duración:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedInvoice.membershipPlan.duration}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Periodo de Suscripción</h4>
                  <dl className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Fecha de inicio:</dt>
                      <dd className="text-sm font-medium text-gray-900">{new Date(selectedInvoice.startDate).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Fecha de fin:</dt>
                      <dd className="text-sm font-medium text-gray-900">{new Date(selectedInvoice.endDate).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Estado:</dt>
                      <dd className="text-sm font-medium">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedInvoice.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {selectedInvoice.isActive ? "Activa" : "Inactiva"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div className="sm:col-span-2">
                  <h4 className="text-lg font-medium text-gray-900">Descripción</h4>
                  <p className="mt-2 text-sm text-gray-700">{selectedInvoice.membershipPlan.description}</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end border-t pt-4">
                <button
                  onClick={handleCloseModal}
                  className="bg-[#5e1914] text-white px-6 py-2 rounded-lg hover:bg-[#8a2b24] transition-colors duration-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturaPremium;