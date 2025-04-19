"use client";
import { useEffect, useState } from 'react';
import { useSessionUser } from '@/app/SessionUserContext';
import Image from 'next/image';

interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  isActive: boolean;
  description: string;
}

interface Subscription {
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

const ActiveSubscriptions = () => {
  const { user: currentUser, loading: userLoading } = useSessionUser();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        if (!currentUser?.email) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions`);
        if (!response.ok) {
          throw new Error('No se pudo obtener las suscripciones');
        }
        const data: Subscription[] = await response.json();

        const userSubscriptions = data.filter(
          (sub) => sub.user.email === currentUser.email && sub.isPago
        );

        setSubscriptions(userSubscriptions);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      fetchSubscriptions();
    }
  }, [currentUser?.email, userLoading]);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5e1914]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-[#5e1914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Acceso requerido</h3>
          <p className="mt-1 text-sm text-gray-500">Debes iniciar sesión para ver tus suscripciones.</p>
          <div className="mt-6">
            <button
              onClick={() => window.location.href = '/login'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#5e1914] hover:bg-[#4c1511] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5e1914]"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          <span className="block">Mis Membresías Activas</span>
          <span className="block text-[#5e1914] mt-2">Tu acceso premium</span>
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Gestiona y disfruta de tus beneficios exclusivos
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No tienes membresías activas</h3>
          <p className="mt-1 text-sm text-gray-500">Explora nuestros planes para acceder a beneficios exclusivos.</p>
          <div className="mt-6">
            <a
              href="/memberships"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#5e1914] hover:bg-[#4c1511] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5e1914]"
            >
              Ver planes disponibles
            </a>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub) => {
            const end = new Date(sub.endDate);
            const now = new Date();
            const diffTime = end.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isExpired = diffDays <= 0;

            return (
              <div
                key={sub.id}
                className={`rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  isExpired ? 'bg-gray-100 opacity-70' : 'bg-white'
                }`}
              >
                <div className={`px-6 py-4 ${
                  isExpired ? 'bg-gray-300' : 'bg-gradient-to-r from-[#5e1914] to-red-900'
                }`}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 relative">
                      {sub.user.picture && (
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                          <Image
                            src={sub.user.picture}
                            alt="Foto de perfil del usuario"
                            width={56}
                            height={56}
                            className="object-cover"
                            priority={false}
                          />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-white">{sub.user.name}</h3>
                      <p className="text-purple-100">{sub.user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">{sub.membershipPlan.name}</h4>
                      <p className="mt-1 text-gray-500">{sub.membershipPlan.description}</p>
                    </div>
                    <div className="bg-purple-100 text-[#5e1914] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      ${sub.membershipPlan.price} / {sub.membershipPlan.duration}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fecha inicio</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(sub.startDate).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fecha fin</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {end.toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      {isExpired ? (
                        <span className="text-red-500">❌ Membresía expirada</span>
                      ) : (
                        <span>⏳ {diffDays} día{diffDays > 1 ? 's' : ''} restante{diffDays > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      !isExpired && sub.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {!isExpired && sub.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      sub.isPago ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {sub.isPago ? 'Pagado' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="mt-6">
                    <button
                      disabled={isExpired}
                      className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isExpired
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-[#5e1914] hover:bg-[#4c1511] text-white focus:ring-[#5e1914]'
                      }`}
                    >
                      {isExpired ? 'Expirada' : 'Gestionar membresía'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveSubscriptions;
