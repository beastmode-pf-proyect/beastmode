"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import Swal from "sweetalert2";

type User = {
  id: string;
  auth0_id: string;
  email: string;
  name: string;
  picture: string;
  last_login: string;
  created_at: string;
  is_blocked: boolean;
  roleId: string;
};

type Plan = {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
};

type Subscription = {
  id: string;
  startDate: string;
  endDate: string;
  isPago: boolean;
  isActive: boolean;
  user: User;
  membershipPlan: Plan;
};

const ITEMS_PER_PAGE = 6;

const UserSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [currentPageActive, setCurrentPageActive] = useState<number>(1);
  const [currentPageInactive, setCurrentPageInactive] = useState<number>(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions`);
        if (!response.ok) {
          throw new Error("Error fetching subscriptions");
        }

        const data: Subscription[] = await response.json();
        setSubscriptions(data);
      } catch (err) {
        setError("Failed to load subscriptions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleDeactivateSubscription = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción desactivará la suscripción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/${id}`, { 
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al desactivar la suscripción");
      }

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, isActive: false } : sub
        )
      );

      Swal.fire({
        title: "¡Desactivada!",
        text: "La suscripción fue desactivada correctamente.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "No se pudo desactivar la suscripción.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    sub.user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const activeSubscriptions = filteredSubscriptions.filter((s) => s.isActive);
  const inactiveSubscriptions = filteredSubscriptions.filter((s) => !s.isActive);

  const paginated = (subs: Subscription[], page: number) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return subs.slice(start, start + ITEMS_PER_PAGE);
  };

  const totalPagesActive = Math.ceil(activeSubscriptions.length / ITEMS_PER_PAGE);
  const totalPagesInactive = Math.ceil(inactiveSubscriptions.length / ITEMS_PER_PAGE);

  const renderSubscriptionCard = (subscription: Subscription) => (
    <div
      key={subscription.id}
      className="border-2 border-gray-200 rounded-xl bg-white shadow-xl p-6 flex flex-col items-center"
    >
    <Image
        src={subscription.user.picture}
        alt={subscription.user.name}
        width={96}
        height={96}
        className="rounded-full mb-4"
        style={{ width: "96px", height: "96px", objectFit: "cover" }}
        />

      <h3 className="text-xl font-semibold">{subscription.user.name}</h3>
      <p className="text-sm text-gray-600">{subscription.user.email}</p>

      <div className="mt-4 text-center">
        <p className="font-semibold text-gray-800">Plan:</p>
        <p className="text-gray-700">{subscription.membershipPlan.name}</p>
        <p className="text-sm text-gray-500">{subscription.membershipPlan.description}</p>
      </div>

      <p className="mt-4 text-gray-800">
        Desde: {new Date(subscription.startDate).toLocaleDateString()}
      </p>
      <p className="text-gray-800">
        Hasta: {new Date(subscription.endDate).toLocaleDateString()}
      </p>

      <p className={`mt-2 ${subscription.isActive ? "text-green-500" : "text-red-500"}`}>
        {subscription.isActive ? "Activo" : "Inactivo"}
      </p>

      {subscription.isActive && (
        <button
          onClick={() => handleDeactivateSubscription(subscription.id)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Desactivar
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-900 mb-4"></div>
        <span>Cargando usuarios...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">Suscripciones de usuarios</h1>

      <input
        type="text"
        placeholder="Buscar por nombre o correo..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPageActive(1);
          setCurrentPageInactive(1);
        }}
        className="mb-6 px-4 py-2 border border-gray-300 rounded-lg w-full max-w-md"
      />

      {/* Activas */}
      <section className="mb-12">
        <h2 className="text-2xl mb-1">Activas</h2>
        <p className="text-sm text-gray-500 mb-4">Total: {activeSubscriptions.length}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginated(activeSubscriptions, currentPageActive).map(renderSubscriptionCard)}
        </div>

        {totalPagesActive > 1 && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPageActive((prev) => Math.max(prev - 1, 1))}
              disabled={currentPageActive === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-lg font-semibold">
              Página {currentPageActive} de {totalPagesActive}
            </span>
            <button
              onClick={() => setCurrentPageActive((prev) => Math.min(prev + 1, totalPagesActive))}
              disabled={currentPageActive === totalPagesActive}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </section>

      {/* Inactivas */}
      <section>
        <h2 className="text-2xl mb-1">Inactivas</h2>
        <p className="text-sm text-gray-500 mb-4">Total: {inactiveSubscriptions.length}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginated(inactiveSubscriptions, currentPageInactive).map(renderSubscriptionCard)}
        </div>

        {totalPagesInactive > 1 && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPageInactive((prev) => Math.max(prev - 1, 1))}
              disabled={currentPageInactive === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-lg font-semibold">
              Página {currentPageInactive} de {totalPagesInactive}
            </span>
            <button
              onClick={() =>
                setCurrentPageInactive((prev) => Math.min(prev + 1, totalPagesInactive))
              }
              disabled={currentPageInactive === totalPagesInactive}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserSubscriptions;
