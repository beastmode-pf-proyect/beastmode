"use client";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { itemNavbar } from "./itemNavbar";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/img/logo.png";
import LoginForm from "../loginouth/login";
import { useRouter } from "next/navigation";
import { FaUserCog, FaSignOutAlt } from "react-icons/fa";

export const Navbarp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, ] = useState(false);
  const [userRole, setUserRole] = useState<
    "ADMIN" | "TRAINER" | "CLIENT" | null
  >(null);
  const { isAuthenticated, logout, user } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/role/${user?.sub}`;
        if (!user?.sub) return; 
  
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al obtener el rol - status ${response.status}`);
  
        const roleText = await response.text();
        const normalizedRole = roleText.toUpperCase();
  
        if (["ADMIN", "TRAINER", "CLIENT"].includes(normalizedRole)) {
          setUserRole(normalizedRole as "ADMIN" | "TRAINER" | "CLIENT");
        } else {
          setUserRole("CLIENT");
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        setUserRole("CLIENT"); 
      }
    };
  
    if (isAuthenticated && user?.sub) {
      fetchRole();
    }
  }, [isAuthenticated, user?.sub]); 
  

  const handleDashboardRedirect = () => {
    switch (userRole) {
      case "ADMIN":
        router.push("/dashboard");
        break;
      case "TRAINER":
        router.push("/DasboardTrainer");
        break;
      case "CLIENT":
        router.push("/Dasboard-User");
        break;
    }
  };

  // const filteredNavItems = itemNavbar.filter((item) => {
  //   if (item.label === "Inicio") return isAuthenticated;
  //   return true;
  // });

  return (
    <nav
      className={`fixed top-0 left-0 right-0 bg-[#5e1914] p-4 z-60 transition-all duration-500 ${
        scrolled
          ? "bg-red-950/95 shadow-lg backdrop-blur-sm py-2"
          : "bg-red-950/90 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {isAuthenticated ? (
            <Link href="/Home" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src={logo}
                  alt="Logo"
                  width={50}
                  height={50}
                  className="relative z-10 transform transition-transform duration-300 group-hover:rotate-6"
                />
                <div className="absolute inset-0 bg-red-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              </div>
              <span className="text-2xl font-bold text-gray-100 tracking-tight group-hover:text-white transition-colors duration-300">
                BEAST MODE
              </span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src={logo}
                  alt="Logo"
                  width={50}
                  height={50}
                  className="relative z-10 transform transition-transform duration-300 group-hover:rotate-6"
                />
                <div className="absolute inset-0 bg-red-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              </div>
              <span className="text-2xl font-bold text-gray-100 tracking-tight group-hover:text-white transition-colors duration-300">
                BEAST MODE
              </span>
            </Link>
          )}

          {/* Desktop nav */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {itemNavbar.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="relative px-3 py-2 text-gray-100 hover:text-white transition-colors duration-300 group"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-100 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            <div className="h-6 w-px bg-gray-100/20" />

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <Image
                  src={user?.picture || "/default-avatar.png"}
                  alt="Avatar"
                  width={38}
                  height={38}
                  className="rounded-full border-2  hover:shadow-red-600/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-pulse"
                />

                {/* Botones */}
                <button
                  onClick={handleDashboardRedirect}
                  className="relative flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg transition duration-300 shadow-md shadow-red-900/20
                             hover:bg-red-800 hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.2)] overflow-hidden"
                >
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#5e1914] via-[#a82717] to-[#5e1914] opacity-0 hover:opacity-20 transition-opacity duration-500 blur-sm" />
                  <FaUserCog className="relative z-10" />
                  <span className="relative z-10">Mi Perfil</span>
                </button>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-2 px-4 py-2 border border-red-700 text-white rounded-lg hover:bg-red-700/20 transition duration-300"
                >
                  <FaSignOutAlt /> Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <LoginForm />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-100 hover:bg-red-900/50 focus:outline-none transition-colors duration-300"
          >
            <div className="w-6 h-0.5 bg-current mb-1.5" />
            <div className="w-6 h-0.5 bg-current mb-1.5" />
            <div className="w-6 h-0.5 bg-current" />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transition-all duration-500 ease-in-out ${
            isOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
          style={{
            backgroundColor: "#5e1914",
            transition: "max-height 0.5s ease-in-out, opacity 0.3s ease-in-out",
          }}
        >
          <div className="pt-2 pb-4 space-y-2">
            {itemNavbar.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block px-4 py-2 text-gray-100 hover:bg-red-900/50 rounded-lg transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-2 mt-2 border-t border-red-900/50">
              {isAuthenticated ? (
                <div className="space-y-3 pt-2 px-4">
                  {/* Avatar */}
                  <div className="flex justify-start">
                    <Image
                      src={user?.picture || "/default-avatar.png"}
                      alt="Avatar"
                      width={38}
                      height={38}
                      className="rounded-full border-2  hover:shadow-red-600/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-pulse"
                    />
                  </div>

                  {/* Botones */}
                  <button
                    onClick={() => {
                      handleDashboardRedirect();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition duration-300"
                  >
                    <FaUserCog /> Mi Perfil
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 border border-red-700 text-white rounded-lg hover:bg-red-700/20 transition duration-300"
                  >
                    <FaSignOutAlt /> Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <LoginForm />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-950 via-red-700 to-red-950 bg-[length:200%_200%] animate-[gradient_3s_ease-in-out_infinite]" />
    </nav>
  );
};

export default Navbarp;
