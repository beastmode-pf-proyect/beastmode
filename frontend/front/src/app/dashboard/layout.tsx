"use client";
import {
  HiHome,
  HiBookOpen,
  HiOutlineStar,
  HiUsers,
  HiCog,
  HiChartBar,
  HiMenu,
  HiX,
  HiUser,
} from "react-icons/hi";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Image from "next/image";

interface UserData {
  name: string;
  email: string;
  picture: string;
  role: string;
}
interface User {
  id: string;
  name: string;
  picture: string;
  email: string;
  auth0_id: string;
  role: {
    name: string;
  };
}

const SkeletonLoader = () => (
  <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f8f8] animate-pulse">
    {/* Skeleton Sidebar */}
    <div className="hidden md:block w-64 bg-white shadow-lg p-4">
      <div className="w-20 h-20 mb-6 mx-auto bg-gray-200 rounded-full" />
      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6" />
      
      <div className="flex items-center space-x-3 p-3 mb-6">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3 mt-1" />
        </div>
      </div>

      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-md" />
        ))}
      </div>
    </div>

    {/* Skeleton Main Content */}
    <div className="flex-1 p-4 md:p-8 min-h-screen bg-white mt-20 md:mt-0">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
      <div className="grid gap-6">
        <div className="h-80 bg-gray-200 rounded-xl" />
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user: auth0User, isAuthenticated, isLoading, error, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [apiError, setApiError] = useState<string>("");

  async function fetchUserAPI() {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener usuarios");

      const usersData: User[] = await response.json();
      const auth0Id = auth0User?.sub;
      const matchedUser = usersData.find((u) => u.auth0_id === auth0Id);

      if (matchedUser) {
        setCurrentUser(matchedUser);
      } else {
        setApiError("Usuario no encontrado en la base de datos");
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  async function fetchUserData(auth0_id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/role/${auth0_id}`);
      if (!res.ok) throw new Error("Error al obtener los datos del usuario");

      const roleText = await res.text();

      const parsedData: UserData = {
        name: auth0User?.name ?? "Usuario",
        email: auth0User?.email ?? "Sin correo",
        picture: auth0User?.picture ?? "https://via.placeholder.com/100",
        role: roleText.toUpperCase() as UserData["role"],
      };

      setUserData(parsedData);

      // Guardar cookies accesibles por el middleware
      document.cookie = `userRole=${parsedData.role}; path=/`;
      document.cookie = `isAuthenticated=true; path=/`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ Error:", error.message);
      } else {
        console.error("❌ An unknown error occurred:", error);
      }
    } finally {
      setLoadingUserData(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserAPI();
    }
  }, [isAuthenticated, getAccessTokenSilently, auth0User?.sub]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Debes iniciar sesión para acceder a esta página.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        window.location.href = "/";
      });
    } else if (auth0User && auth0User.sub) {
      fetchUserData(auth0User.sub!);
    }
  }, [auth0User, isLoading, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && auth0User && auth0User.sub) {
      const intervalId = setInterval(() => {
        fetchUserAPI();
        fetchUserData(auth0User.sub!);
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, auth0User, getAccessTokenSilently]);

  if (isLoading || loadingUserData) return <SkeletonLoader />;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!isAuthenticated) return <div className="p-4">No estás autenticado</div>;
  if (apiError) return <div className="p-4 text-red-500">Error: {apiError}</div>;
  if (!currentUser) return <SkeletonLoader />;

  if (userData && userData.role !== "ADMIN") {
    Swal.fire({
      icon: "error",
      title: "Acceso restringido",
      text: "Solo los administradores pueden acceder a esta sección.",
      confirmButtonText: "Ir al inicio",
    }).then(() => {
      window.location.href = "/";
    });
    return null;
  }

  if (!userData) {
    return null;
  }

  const adminMenu = [
    { name: "Inicio", icon: <HiHome className="w-5 h-5" />, href: "/dashboard" },
    { name: "Usuarios", icon: <HiUsers className="w-5 h-5" />, href: "/dashboard/usuarios" },
    { name: "Rutinas", icon: <HiBookOpen className="w-5 h-5" />, href: "/dashboard/rutina" },
    { name: "Estadísticas", icon: <HiChartBar className="w-5 h-5" />, href: "/dashboard/Estadisticas" },
    { name: "Membresías", icon: <HiOutlineStar className="w-5 h-5" />, href: "/dashboard/Membresias" },
    { name: "Usuarios-Suscripcion", icon: <HiOutlineStar className="w-5 h-5" />, href: "/dashboard/User-Suscripcion" },
    { name: "Rutina de Prueba", icon: <HiOutlineStar className="w-5 h-5" />, href: "/dashboard/Rutina-de-Prueba" },
    { name: "Configuración", icon: <HiCog className="w-5 h-5" />, href: "/dashboard/configuracion" },
  ];

  const currentMenu = adminMenu;

  const roleIcon = (
    <div
      className="flex items-center justify-center w-20 h-20 mb-6 rounded-full shadow-md mx-auto"
      style={{
        backgroundColor:
          userData.role === "ADMIN"
            ? "#5e1914"
            : userData.role === "TRAINER"
            ? "#3B3B66"
            : "#178a7a",
      }}
    >
      {userData.role === "ADMIN" ? (
        <HiCog className="text-white w-16 h-16" />
      ) : userData.role === "TRAINER" ? (
        <HiChartBar className="text-white w-10 h-16" />
      ) : (
        <HiUser className="text-white w-16 h-16" />
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f8f8] text-[#333]">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-4 mt-16 left-0 right-0 bg-white shadow-md z-30 p-2 flex justify-between items-center">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-[#5e1914]">
          {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-lg p-4">
        {roleIcon}
        <h1 className="text-2xl font-bold text-[#5e1914] mb-6 text-center">BeastMode</h1>
        <div className="flex items-center space-x-3 bg-[#ffffff] p-3 rounded-md mb-6">
          <Image 
            src={currentUser?.picture || "/avatar2.avif"} 
            alt="Usuario" 
            width={40} 
            height={40} 
            className="rounded-full object-cover" 
          />
          <div>
            <h2 className="text-lg font-semibold text-[#5e1914]">{currentUser?.name || "Usuario"}</h2>
            <p className="text-sm text-[#5e1914]">{currentUser?.email}</p>
            <p className="text-sm text-[#5e1914] font-bold">
              {userData.role === "ADMIN"
                ? "Administrador"
                : userData.role === "TRAINER"
                ? "Entrenador"
                : "Usuario"}
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {currentMenu.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href} 
                className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#5e1914]"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 mt-34 flex md:hidden">
          <div className="w-64 bg-white shadow-lg p-4">
            {roleIcon}
            <h1 className="text-2xl font-bold text-[#5e1914] mb-6 text-center">BeastMode</h1>
            <div className="flex items-center space-x-3 bg-[#ffffff] p-3 rounded-md mb-6">
              <Image 
                src={currentUser?.picture || "/avatar2.avif"} 
                alt="Usuario" 
                width={40} 
                height={40} 
                className="rounded-full object-cover" 
              />
              <div>
                <h2 className="text-lg font-semibold text-[#5e1914]">{currentUser?.name || "Usuario"}</h2>
                <p className="text-sm text-[#5e1914]">{currentUser?.email}</p>
                <p className="text-sm text-[#5e1914] font-bold">
                  {userData.role === "ADMIN"
                    ? "Administrador"
                    : userData.role === "TRAINER"
                    ? "Entrenador"
                    : "Usuario"}
                </p>
              </div>
            </div>

            <ul className="space-y-2">
              {currentMenu.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#5e1914]"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 bg-[#5e191444]" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      <main className="flex-1 p-4 md:p-8 min-h-screen bg-[#ffffff] mt-20 md:mt-0">
        {children}
      </main>
    </div>
  );
}