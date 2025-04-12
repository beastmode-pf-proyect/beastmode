"use client";
import {
  HiHome,
  HiBookOpen,
  HiOutlineStar,
  HiOutlineLogout,
  HiCog,
  HiChartBar,
  HiMenu,
  HiX,
  HiUser
} from "react-icons/hi";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface UserData {
  name: string;
  email: string;
  picture: string;
  role_id: number;
  roles: {
    name: string;
  };
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user: auth0User, isAuthenticated, isLoading, logout } = useAuth0();
  const [userData, setUserData] = useState<{ name: string; email: string; avatar: string; role: string } | null>(null);
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
    const { data, error } = await supabase
      .from("users2")
      .select("name, email, picture, role_id, roles(name)")
      .eq("auth0_id", auth0_id)
      .single<UserData>();
  
    if (error) {
      console.error("❌ Error obteniendo datos del usuario:", error.message);
      return;
    }
  
    setUserData({
      name: data?.name ?? "Usuario",
      email: data?.email ?? "Sin correo",
      avatar: data?.picture ?? "https://via.placeholder.com/100",
      role: data?.roles?.name ? data.roles.name.toUpperCase() : "SIN ROL",
    });
  }

  if (isLoading) {
    return <div className="text-center text-xl text-gray-600">Cargando...</div>;
  }

  if (!isAuthenticated || !userData) {
    return null;
  }


//------Menú estándar para usuarios y entrenadores------//
  const standardMenuT = [
    { name: "Inicio", icon: <HiHome className="w-5 h-5" />, href: "/DasboardTrainer" },
    { name: "Usuarios", icon: <HiBookOpen className="w-5 h-5" />, href: "/DasboardTrainer/usertrainer" },
    { name: "Asignar Rutina", icon: <HiOutlineStar className="w-5 h-5" />, href: "/DasboardTrainer/Asignar-Rutina" },
    { name: "Ejercicios", icon: <HiOutlineStar className="w-5 h-5" />, href: "/DasboardTrainer/rutina" },
  ];


  const currentMenu = userData.role === "TRAINER" ? standardMenuT : standardMenuT; ;

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
      {/* Navbar móvil */}
      <div className="md:hidden fixed top-4  mt-16 left-0 right-0 bg-white shadow-md z-30 p-2 flex justify-between items-center">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-[#5e1914]">
          {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden md:block w-64 bg-white shadow-lg p-4">
        {roleIcon}
        <h1 className="text-2xl font-bold text-[#5e1914] mb-6 text-center">BeastMode</h1>
        <div className="flex items-center space-x-3 bg-[#ffffff] p-3 rounded-md mb-6">
                <Image
          src={userData?.avatar || '/default-avatar.png'} // Fallback para avatar no definido
          alt={userData?.name || 'Usuario'}
          width={40}  // Requerido - en pixels
          height={40} // Requerido - en pixels
          className="rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/default-avatar.png'; // Fallback para error de carga
          }}
/>
          <div>
            <h2 className="text-lg font-semibold text-[#5e1914]">{userData.name}</h2>
            <p className="text-sm text-[#5e1914]">{userData.email}</p>
            <p className="text-sm text-[#5e1914] font-bold">
              ROL: {userData.role === "ADMIN" ? "Administrador" : userData.role === "TRAINER" ? "Entrenador" : "Usuario"}
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {currentMenu.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#5e1914]">
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

      {/* Sidebar móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 mt-34 flex md:hidden">
          <div className="w-64 bg-white shadow-lg p-4">
            {roleIcon}
            <h1 className="text-2xl font-bold text-[#5e1914] mb-6 text-center">BeastMode</h1>
            <div className="flex items-center space-x-3 bg-[#ffffff] p-3 rounded-md mb-6">
              <Image src={userData.avatar} alt="Usuario" className="w-10 h-10 rounded-full" />
              <div>
                <h2 className="text-lg font-semibold text-[#5e1914]">{userData.name}</h2>
                <p className="text-sm text-[#5e1914]">{userData.email}</p>
                <p className="text-sm text-[#5e1914] font-bold">
                  ROL: {userData.role === "ADMIN" ? "Administrador" : userData.role === "TRAINER" ? "Entrenador" : "Usuario"}
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
        <div className="mb-6">
          {userData.role === "ADMIN" ? (
            <div className="bg-gradient-to-r from-[#fefefe] to-[#f8f8f8] p-6 rounded-xl shadow-xl">
              <h3 className="text-2xl font-bold text-[#5e1914] mb-4">Panel de Administrador</h3>
              <p className="text-[#5e1914] text-lg">Administra usuarios, clases, membresías y más.</p>
            </div>
          ) : userData.role === "TRAINER" ? (
            <div className="bg-gradient-to-r from-[#fefefe] to-[#f8f8f8] p-6 rounded-xl shadow-xl">
              <h3 className="text-2xl font-bold text-[#5e1914] mb-4">Panel de Entrenador</h3>
              <div className="text-[#5e1914]">
               
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-[#fefefe] to-[#f8f8f8] p-6 rounded-xl shadow-xl">
              <h3 className="text-2xl font-bold text-[#5e1914]">Panel de Usuario</h3>
              <p className="text-[#5e1914] text-lg">Bienvenido a tu espacio personalizado.</p>
            </div>
          )}
        </div>

        {children}
      </main>
    </div>
  );
}
