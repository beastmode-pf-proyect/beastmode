"use client";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { itemNavbar } from "./itemNavbar";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/img/logo.png";
import LoginForm from "../loginouth/login";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export const Navbarp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userRole, setUserRole] = useState<"ADMIN" | "TRAINER" | "USER" | null>(
    null
  );
  const { isAuthenticated, logout, user } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      if (user?.sub) {
        const { data, error } = await supabase
          .from("users2")
          .select("roles(name)")
          .eq("auth0_id", user.sub)
          .single();

        if (
          !error &&
          data?.roles &&
          Array.isArray(data.roles) &&
          data.roles.length > 0
        ) {
          setUserRole(data.roles[0].name.toUpperCase()); 
        }
      }
    };

    if (isAuthenticated) {
      fetchRole();
    }
  }, [isAuthenticated, user]);

  const handleDashboardRedirect = () => {
    switch (userRole) {
      case "ADMIN":
        router.push("/dashboard");
        break;
      case "TRAINER":
        router.push("/DasboardTrainer");
        break;
      case "USER":
        router.push("/Dasboard-User");
        break;
      default:
        break;
    }
  };

  const filteredNavItems = itemNavbar.filter((item) => {
    // Mostrar siempre todos los items excepto "Inicio" si no está autenticado
    if (item.label === "Inicio") {
      return isAuthenticated;
    }
    return true;
  });

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-red-950/95 shadow-lg backdrop-blur-sm py-2"
          : "bg-red-950/90 py-4"
      }`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {filteredNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="relative px-3 py-2 text-gray-100 hover:text-white transition-colors duration-300 group">
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-100 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            <div className="h-6 w-px bg-gray-100/20" />

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleDashboardRedirect}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors duration-300 shadow-lg shadow-red-900/20 hover:shadow-red-900/40">
                  Dashboard
                </button>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 border border-red-700 text-white rounded-lg hover:bg-red-700/20 transition-all duration-300">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <LoginForm />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-100 hover:bg-red-900/50 focus:outline-none transition-colors duration-300">
            <div className="w-6 h-0.5 bg-current mb-1.5" />
            <div className="w-6 h-0.5 bg-current mb-1.5" />
            <div className="w-6 h-0.5 bg-current" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ${
            isOpen ? "max-h-96" : "max-h-0 overflow-hidden"
          }`}>

          <div className="pt-2 pb-4 space-y-2">
            {itemNavbar.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block px-4 py-2 text-gray-100 hover:bg-red-900/50 rounded-lg transition-colors duration-300"
                onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}

            <div className="pt-2 mt-2 border-t border-red-900/50">
              {isAuthenticated ? (
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      handleDashboardRedirect();
                      setIsOpen(false);
                    }}
                    className="block w-full px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors duration-300 text-center">
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full px-4 py-2 border border-red-700 text-white rounded-lg hover:bg-red-700/20 transition-all duration-300 text-center">
                    Logout
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
