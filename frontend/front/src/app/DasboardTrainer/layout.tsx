"use client";
import {
  HiHome,
  HiBookOpen,
  HiOutlineLogout,
  HiMenu,
  HiX,
  HiUser,
} from "react-icons/hi";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Simulación de Skeleton Loader
function SkeletonLoader() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f8f8]">
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

      <main className="flex-1 p-4 md:p-8 min-h-screen bg-white">
        <div className="h-10 w-1/3 bg-gray-300 rounded mb-4 animate-pulse" />
        <div className="h-48 w-full bg-gray-200 rounded animate-pulse" />
      </main>
    </div>
  );
}

interface UserData {
  name: string;
  email: string;
  picture: string;
  role: string;
}

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  const { user: auth0User, isAuthenticated, isLoading, logout } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    if (auth0User && auth0User.sub) {
      fetchUserData(auth0User.sub);
    }
  }, [auth0User]);

  async function fetchUserData(auth0_id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/role/${auth0_id}`);
      if (!res.ok) throw new Error("Error al obtener los datos del usuario");

      const roleText = await res.text();

      const parsedData: UserData = {
        name: auth0User?.name ?? "Usuario",
        email: auth0User?.email ?? "Sin correo",
        picture: auth0User?.picture ?? "https://via.placeholder.com/100",
        role: roleText.toUpperCase(),
      };

      if (parsedData.role !== "TRAINER") {
        Swal.fire({
          icon: "error",
          title: "Acceso denegado",
          text: "No tienes permisos para acceder como entrenador.",
          confirmButtonText: "Volver",
        }).then(() => {
          router.push("/");
        });
        return;
      }

      setUserData(parsedData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ Error:", error.message);
      } else {
        console.error("❌ An unknown error occurred:", error);
      }
    }
  }

  if (isLoading || (isAuthenticated && !userData)) return <SkeletonLoader />;
  if (!isAuthenticated || !userData) return null;

  const trainerMenu = [
    { name: "Inicio", icon: <HiHome className="w-5 h-5" />, href: "/DasboardTrainer" },
    { name: "Rutinas", icon: <HiBookOpen className="w-5 h-5" />, href: "DasboardTrainer/Rutinas" },
    { name: "Alumnos", icon: <HiUser className="w-5 h-5" />, href: "DasboardTrainer/Usuarios" },
    { name: "Alumnos", icon: <HiUser className="w-5 h-5" />, href: "DasboardTrainer/Ejercicios" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f8f8] text-[#333]">
      {/* Navbar móvil */}
      <div className="md:hidden fixed top-4 mt-16 left-0 right-0 bg-white z-30 p-2 flex justify-between items-center">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-[#5e1914]">
          {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden md:block w-64 bg-white p-4">
        <div className="flex flex-col items-center">
          <Image
            src={userData.picture}
            alt="Usuario"
            width={80}
            height={80}
            className="rounded-full object-cover mb-4"
          />
          <h1 className="text-2xl font-bold text-[#5e1914] mb-6 text-center">
            BeastMode Trainer
          </h1>
        </div>

        <div className="bg-[#ffffff] p-3 rounded-md mb-6 text-center">
          <h2 className="text-lg font-semibold text-[#5e1914]">{userData.name}</h2>
          <p className="text-sm text-[#5e1914]">{userData.email}</p>
          <p className="text-sm text-[#5e1914] font-bold">ROL: Entrenador</p>
        </div>

        <ul className="space-y-2">
          {trainerMenu.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#5e1914] hover:scale-105 text-[#5e1914]">
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="w-full flex items-center justify-center gap-2 bg-[#5e1914] hover:bg-[#400e0a] text-white p-2 rounded-md transition-all duration-300 transform hover:scale-105"
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 mt-34 flex md:hidden">
          <div className="w-64 bg-white p-4">
            <div className="flex flex-col items-center">
              <Image
                src={userData.picture}
                alt="Usuario"
                width={80}
                height={80}
                className="rounded-full object-cover mb-4"
              />
              <h1 className="text-2xl font-bold text-[#5e1914] mb-6 text-center">
                BeastMode Trainer
              </h1>
            </div>

            <div className="bg-[#ffffff] p-3 rounded-md mb-6 text-center">
              <h2 className="text-lg font-semibold text-[#5e1914]">{userData.name}</h2>
              <p className="text-sm text-[#5e1914]">{userData.email}</p>
              <p className="text-sm text-[#5e1914] font-bold">ROL: Entrenador</p>
            </div>

            <ul className="space-y-2">
              {trainerMenu.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#5e1914] hover:scale-105 text-[#5e1914]"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="w-full flex items-center justify-center gap-2 bg-[#5e1914] hover:bg-[#400e0a] text-white p-2 rounded-md transition-all duration-300 transform hover:scale-105"
              >
                <HiOutlineLogout className="w-5 h-5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      <main className="flex-1 p-4 md:p-8 min-h-screen bg-[#ffffff] mt-20 md:mt-0">
        {children}
      </main>
    </div>
  );
}
