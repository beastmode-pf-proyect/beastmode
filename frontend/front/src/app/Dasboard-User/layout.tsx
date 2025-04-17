"use client";
import {
  HiHome,
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

interface UserData {
  name: string;
  email: string;
  picture: string;
  role: string;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user: auth0User, isAuthenticated, isLoading, logout } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
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
        picture: auth0User?.picture ?? "",
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ Error:", error.message);
      } else {
        console.error("❌ An unknown error occurred:", error);
      }
    }
  }

  if (isLoading || (!userData && isAuthenticated)) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f8f8] text-[#333] animate-pulse">
        <div className="hidden md:block w-64 bg-white p-4">
          <div className="w-20 h-20 bg-[#ccc] rounded-full mx-auto mb-6"></div>
          <div className="bg-[#eee] h-6 w-3/4 mx-auto mb-4 rounded"></div>
          <div className="bg-[#eee] h-4 w-5/6 mx-auto mb-2 rounded"></div>
          <div className="bg-[#eee] h-4 w-2/3 mx-auto mb-6 rounded"></div>
          <div className="space-y-2">
            <div className="bg-[#eee] h-8 rounded"></div>
            <div className="bg-[#eee] h-8 rounded"></div>
          </div>
        </div>
        <main className="flex-1 p-4 md:p-8 min-h-screen bg-[#ffffff] mt-20 md:mt-0">
          <div className="bg-[#eee] h-12 w-1/2 mb-6 rounded"></div>
          <div className="bg-[#eee] h-64 rounded-xl"></div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated || !userData) return null;

  const clientMenu = [
    { name: "Inicio", icon: <HiHome className="w-5 h-5" />, href: "/Dasboard-User" },
    { name: "Ruttinas", icon: <HiHome className="w-5 h-5" />, href: "/Dasboard-User/Rutina" },
    { name: "Membresia", icon: <HiUser className="w-5 h-5" />, href: "/Dasboard-User/Mi-membresia" },
    { name: "Historial de Pagos", icon: <HiUser className="w-5 h-5" />, href: "/Dasboard-User/Historial-Pagos" },
  ];

  const UserInfo = () => (
    <>
      <div className="flex justify-center mb-4">
        {imageError || !userData.picture ? (
          <div className="w-[70px] h-[70px] flex items-center justify-center rounded-full bg-[#e0e0e0] border-4 border-[#5e1914]">
            <HiUser className="w-10 h-10 text-[#5e1914]" />
          </div>
        ) : (
          <Image
            src={userData.picture}
            alt="Usuario"
            width={70}
            height={70}
            className="rounded-full object-cover border-4"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <h1 className="text-2xl font-bold text-[#5e1914] mb-4 text-center">BeastMode Client</h1>
      <div className="flex items-center space-x-3 bg-[#ffffff] p-3 rounded-md mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#5e1914]">{userData.name}</h2>
          <p className="text-sm text-[#5e1914]">{userData.email}</p>
          <p className="text-sm text-[#5e1914] font-bold">ROL: Cliente</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f8f8] text-[#333]">
      {/* Navbar móvil */}
      <div className="md:hidden fixed top-4 mt-16 left-0 right-0 bg-white z-30 p-2 flex justify-between items-center">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-[#5e1914]">
          {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white p-4">
        <UserInfo />
        <ul className="space-y-2">
          {clientMenu.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#5e1914] hover:scale-105 text-[#5e1914] hover:text-white">
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="w-full flex items-center justify-center gap-2 bg-[#5e1914] hover:bg-[#a82717] text-white p-2 rounded-md transition-all duration-300 transform hover:scale-105"
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
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="w-full flex items-center justify-center gap-2 bg-[#5e1914] hover:bg-[#a82717] text-white p-2 rounded-md transition-all duration-300 transform hover:scale-105"
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
        {children}
      </main>
    </div>
  );
}
