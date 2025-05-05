"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  HiHome,
  HiBookOpen,
  HiMenu,
  HiX,
  HiOutlineClipboardList,
  HiOutlineCog,
  // HiChevronDoubleLeft,
  // HiChevronDoubleRight,
} from "react-icons/hi";


function SkeletonLoader() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f8f8] overflow-auto md:overflow-visible">
      <div className="hidden md:block w-64 bg-white p-4 animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-300 rounded-full mb-4" />
          <div className="h-6 bg-gray-300 w-3/4 rounded mb-6" />
        </div>
        <div className="bg-[#ffffff] p-3 rounded-md mb-6 text-center">
          <div className="h-5 bg-gray-300 rounded w-full mb-2" />
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2" />
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto" />
        </div>
        <ul className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <li key={i}>
              <div className="flex items-center space-x-3 p-2 rounded bg-gray-200" />
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <div className="h-10 bg-gray-300 rounded w-full" />
        </div>
      </div>
      <main className="flex-1 p-4 md:p-8 bg-white overflow-auto md:overflow-visible">
        <div className="h-10 w-1/3 bg-gray-300 rounded mb-4 animate-pulse" />
        <div className="h-48 w-full bg-gray-200 rounded animate-pulse" />
      </main>
    </div>
  );
}

// User Interface
interface User {
  id: string;
  name: string;
  picture: string;
  email: string;
  auth0_id: string;
  role: { name: string };
}

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, error, getAccessTokenSilently } = useAuth0();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [desktopMenuCollapsed, setDesktopMenuCollapsed] = useState(false);

  const router = useRouter();

 
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("desktopMenuCollapsed");
      if (stored !== null) {
        setDesktopMenuCollapsed(stored === "true");
      }
    }
  }, []);


  // const toggleDesktopMenu = () => {
  //   setDesktopMenuCollapsed((prev) => {
  //     const newState = !prev;
  //     localStorage.setItem("desktopMenuCollapsed", newState.toString());
  //     return newState;
  //   });
  // };

  // Función para obtener los datos del usuario
  const fetchUserData = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/trainer`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error("Error al obtener usuarios");

      const usersData: User[] = await response.json();
      const matchedUser = usersData.find((u) => u.auth0_id === user?.sub);

      if (matchedUser) {
        if (matchedUser.role.name.toUpperCase() !== "TRAINER") {
          Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: "No tienes permisos para acceder como entrenador.",
            confirmButtonText: "Volver",
          }).then(() => router.push("/"));
          return;
        }
        setCurrentUser(matchedUser);
      } else {
        setApiError("Usuario no encontrado en la base de datos");
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Error desconocido");
    }
  };


  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
      const interval = setInterval(fetchUserData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, getAccessTokenSilently, user?.sub, router]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Debes iniciar sesión para acceder a esta página.",
        confirmButtonText: "Aceptar",
      }).then(() => router.push("/"));
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || (isAuthenticated && !currentUser)) return <SkeletonLoader />;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (apiError) return <div className="p-4 text-red-500">Error: {apiError}</div>;
  if (!isAuthenticated || !currentUser) return null;

  const trainerMenu = [
    { name: "Inicio", icon: <HiHome className="w-5 h-5" />, href: "/DasboardTrainer" },
    { name: "Rutinas", icon: <HiBookOpen className="w-5 h-5" />, href: "/DasboardTrainer/Rutinas" },
    { name: "Asignar Rutina", icon: <HiOutlineClipboardList className="w-5 h-5" />, href: "/DasboardTrainer/Asignar-Rutina" },
    { name: "Ejercicios", icon: <HiOutlineClipboardList className="w-5 h-5" />, href: "/DasboardTrainer/Ejercicios" },
    { name: "Configuración", icon: <HiOutlineCog className="w-5 h-5" />, href: "/DasboardTrainer/Configuracion" },
  ];
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f8f8] overflow-auto md:overflow-visible">
      {/* Navbar móvil */}
      <div className="md:hidden fixed top-4 mt-16 left-0 right-0 bg-white z-30 p-2 flex justify-between items-center">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[#5e1914]">
          {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <div className={`hidden md:flex flex-col ${desktopMenuCollapsed ? "w-20" : "w-64"} bg-white p-4 transition-all duration-300`}>
        <div className="flex flex-col items-center mb-6">
          <div className={`relative ${desktopMenuCollapsed ? "w-16 h-16" : "w-32 h-32"} rounded-full overflow-hidden border-4 border-[#5e1914]`}>
            <Image
              src={currentUser.picture || "/placeholder.png"}
              alt={currentUser.name || "Usuario"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          </div>
          {!desktopMenuCollapsed && (
            <div className="bg-[#ffffff] p-4 rounded-md text-center mt-4">
              <h1 className="text-2xl font-bold text-[#5e1914]">BeastMode Trainer</h1>
              <h2 className="text-lg font-semibold text-[#5e1914]">{currentUser.name}</h2>
              <p className="text-sm text-[#5e1914]">{currentUser.email}</p>
              <p className="text-sm font-bold text-[#5e1914]">Entrenador</p>
            </div>
          )}
        </div>
        <ul className="space-y-2">
          {trainerMenu.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#5e1914] hover:scale-105 text-[#5e1914] hover:text-[#5e1914]">
                {item.icon}
                {!desktopMenuCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
        {/* <button
          onClick={toggleDesktopMenu}
          className="mt-auto p-2 hover:bg-gray-200 rounded flex items-center justify-center"
        >
          {desktopMenuCollapsed ? (
            <>
              <HiChevronDoubleRight className="w-5 h-5" />
            </>
          ) : (
            <>
              <HiChevronDoubleLeft className="w-5 h-5" />
            </>
          )}
        </button> */}
      </div>

      {/* Sidebar móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex mt-20">
          <div className="w-64 bg-white p-4 flex flex-col overflow-y-auto max-h-screen">
            <div className="flex flex-col items-center mb-6">
              <Image
                src={currentUser.picture || "/placeholder.png"}
                alt={currentUser.name}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              <h1 className="text-2xl font-bold text-[#5e1914] mt-4">BeastMode Trainer</h1>
            </div>

            <div className="bg-[#ffffff] p-4 rounded-md text-center mb-6">
              <h2 className="text-lg font-semibold text-[#5e1914]">{currentUser.name}</h2>
              <p className="text-sm text-[#5e1914]">{currentUser.email}</p>
              <p className="text-sm font-bold text-[#5e1914]">Entrenador</p>
            </div>

            <ul className="space-y-2">
              {trainerMenu.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center p-2 space-x-3 rounded-md hover:bg-[#5e1914] hover:text-white transition duration-300"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-transparent" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      <main className="flex-1 p-4 md:p-8 min-h-screen bg-[#f4c5c50f] mt-20 md:mt-0 overflow-auto md:overflow-visible">
        {children}
      </main>
    </div>
  );
}
