"use client";
import React, { useEffect, useState } from "react";
import {
  HiHome,
  HiOutlineLogout,
  HiMenu,
  HiX,
  HiUser,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { MdFitnessCenter } from "react-icons/md";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [apiError, setApiError] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener lista de usuarios y encontrar el que coincide con el usuario actual
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener usuarios");
        const usersData: User[] = await response.json();
        const matchedUser = usersData.find((u) => u.auth0_id === user?.sub);
        if (matchedUser) {
          setCurrentUser(matchedUser);
        } else {
          setApiError("Usuario no encontrado en la base de datos");
        }
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Error desconocido");
      }

      try {
        // Obtener el rol del usuario
        if (user && user.sub) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/role/${user.sub}`
          );
          if (!res.ok)
            throw new Error("Error al obtener los datos del usuario");
          const roleText = await res.text();
          const parsedData: UserData = {
            name: user.name ?? "Usuario",
            email: user.email ?? "Sin correo",
            picture: user.picture ?? "",
            role: roleText.toUpperCase(),
          };

          if (parsedData.role !== "CLIENT") {
            Swal.fire({
              icon: "error",
              title: "Acceso denegado",
              text: "No tienes permisos para acceder como cliente.",
              confirmButtonText: "Volver",
            }).then(() => {
              router.push("/");
            });
            return;
          }
          setUserData(parsedData);
        }
      } catch (error: unknown) {
        console.error("❌ Error:", error);
      }
    };

    if (isAuthenticated && user) {
      fetchData();
    }
  }, [isAuthenticated, user, getAccessTokenSilently, router]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Debes iniciar sesión para acceder a esta página.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        router.push("/");
      });
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!isAuthenticated) return <div className="p-4">No estás autenticado</div>;
  if (apiError) return <div className="p-4 text-red-500">Error: {apiError}</div>;
  if (!currentUser || !userData)
    return <div className="p-4">Cargando usuario...</div>;

  const clientMenu = [
    {
      name: "Inicio",
      icon: <HiHome className="w-5 h-5" />,
      href: "/Dasboard-User",
    },
    {
      name: "Rutinas",
      icon: <MdFitnessCenter className="w-5 h-5" />,
      href: "/Dasboard-User/Rutina",
    },
    {
      name: "Membresía",
      icon: <HiUser className="w-5 h-5" />,
      href: "/Dasboard-User/Mi-membresia",
    },
    {
      name: "Historial de Pagos",
      icon: <HiOutlineDocumentText className="w-5 h-5" />,
      href: "/Dasboard-User/Historial-Pagos",
    },
    {
      name: "Configuracion",
      icon: <HiOutlineDocumentText className="w-5 h-5" />,
      href: "/Dasboard-User/Configuracion",
    },
  ];

  const UserInfo = () => (
    <>
      <div className="flex justify-center mb-4">
        <div className="w-[80px] h-[80px] rounded-full bg-[#e0e0e0] overflow-hidden flex items-center justify-center">
          {imageError || !currentUser?.picture ? (
            <HiUser className="w-10 h-10 text-[#5e1914]" />
          ) : (
            <Image
              src={currentUser.picture || "/avatar2.avif"}
              alt="Usuario"
              width={80}
              height={80}
              className="object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>
      <h1 className="text-2xl font-bold text-[#5e1914] mb-4 text-center">
        BeastMode Client
      </h1>
      <div className="flex items-center space-x-3 bg-[#ffffff] p-3 rounded-md mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#5e1914]">
            {currentUser?.name || "Usuario"}
          </h2>
          <p className="text-sm text-[#5e1914]">{userData.email}</p>
          <p className="text-sm text-[#5e1914] font-bold">Cliente</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f8f8] text-[#333]">
      {/* Navbar móvil */}
      <div className="md:hidden fixed top-4 mt-16 left-0 right-0 bg-white z-30 p-2 flex justify-between items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-[#5e1914]"
        >
          {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden md:block w-64 bg-white p-4">
        <UserInfo />
        <ul className="space-y-2">
          {clientMenu.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#5e1914] hover:scale-105 text-[#5e1914] hover:text-[#5e1914]"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar para móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 mt-34 flex md:hidden">
          <div className="w-64 bg-white p-4 overflow-y-auto max-h-screen">
            <UserInfo />
            <ul className="space-y-2">
              {clientMenu.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#5e1914] hover:scale-105 text-[#5e1914] hover:text-white"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <button
                onClick={() =>
                  logout({
                    logoutParams: { returnTo: window.location.origin },
                  })
                }
                className="w-full flex items-center justify-center gap-2 bg-[#5e1914] hover:bg-[#a82717] text-white p-2 rounded-md transition-all duration-300 transform hover:scale-105"
              >
                <HiOutlineLogout className="w-5 h-5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
          <div
            className="flex-1 bg-[#5e191444]"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      <main className="flex-1 p-4 md:p-8 min-h-screen bg-[#ffffff] mt-20 md:mt-0">
        {children}
   
      </main>
    </div>
  );
}
