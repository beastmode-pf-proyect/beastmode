"use client";
import {
  HiHome,
  HiBookOpen,
  HiOutlineLogout,
  HiChartBar,
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

  if (isLoading) return <div className="text-center text-xl text-gray-600">Cargando...</div>;
  if (!isAuthenticated || !userData) return null;

  const trainerMenu = [
    { name: "Inicio", icon: <HiHome className="w-5 h-5" />, href: "/trainer" },
    { name: "Clases", icon: <HiBookOpen className="w-5 h-5" />, href: "/trainer/clases" },
    { name: "Alumnos", icon: <HiUser className="w-5 h-5" />, href: "/trainer/alumnos" },
  ];

  const roleIcon = (
    <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full shadow-md mx-auto bg-[#3B3B66]">
      <HiChartBar className="text-white w-10 h-16" />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f8f8] text-[#333]">
      {/* Navbar móvil */}
      <div className="md:hidden fixed top-4 mt-16 left-0 right-0 bg-white shadow-md z-30 p-2 flex justify-between items-center">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-[#3B3B66]">
          {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-lg p-4">
        {roleIcon}
        <h1 className="text-2xl font-bold text-[#3B3B66] mb-6 text-center">BeastMode Trainer</h1>
        <div className="flex items-center space-x-3 bg-[#ffffff] p-3 rounded-md mb-6">
          <Image src={userData.picture} alt="Usuario" width={40} height={40} className="rounded-full object-cover" />
          <div>
            <h2 className="text-lg font-semibold text-[#3B3B66]">{userData.name}</h2>
            <p className="text-sm text-[#3B3B66]">{userData.email}</p>
            <p className="text-sm text-[#3B3B66] font-bold">ROL: Entrenador</p>
          </div>
        </div>

        <ul className="space-y-2">
          {trainerMenu.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#3B3B66]">
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="w-full flex items-center justify-center gap-2 bg-[#3B3B66] hover:bg-[#2a2a52] text-white p-2 rounded-md transition-all duration-300 transform hover:scale-105"
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 mt-34 flex md:hidden">
          <div className="w-64 bg-white shadow-lg p-4">
            {roleIcon}
            <h1 className="text-2xl font-bold text-[#3B3B66] mb-6 text-center">BeastMode Trainer</h1>
            <div className="flex items-center space-x-3 bg-[#ffffff] p-3 rounded-md mb-6">
              <Image src={userData.picture} alt="Usuario" width={40} height={40} className="rounded-full object-cover" />
              <div>
                <h2 className="text-lg font-semibold text-[#3B3B66]">{userData.name}</h2>
                <p className="text-sm text-[#3B3B66]">{userData.email}</p>
                <p className="text-sm text-[#3B3B66] font-bold">ROL: Entrenador</p>
              </div>
            </div>

            <ul className="space-y-2">
              {trainerMenu.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#3B3B66]"
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
                className="w-full flex items-center justify-center gap-2 bg-[#3B3B66] hover:bg-[#2a2a52] text-white p-2 rounded-md transition-all duration-300 transform hover:scale-105"
              >
                <HiOutlineLogout className="w-5 h-5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#5e191444]" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      <main className="flex-1 p-4 md:p-8 min-h-screen bg-[#ffffff] mt-20 md:mt-0">
        <div className="mb-6">
          <div className="bg-gradient-to-r from-[#fefefe] to-[#f8f8f8] p-6 rounded-xl shadow-xl">
            <h3 className="text-2xl font-bold text-[#3B3B66] mb-4">Panel de Entrenador</h3>
            <div className="text-[#3B3B66]">
           
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
