"use client";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { itemNavbar } from "../Navbar/itemNavbar";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/img/logo.png";

export const Navbarp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth0();

  useEffect(() => {
    const handleScroll = () => {
      // Asegurar compatibilidad con Firefox
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(scrollTop > 10);
    };

    // Usar passive event listener para mejor rendimiento
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fondo fijo para evitar parpadeos en Firefox */}
      <div className="fixed top-0 left-0 w-full h-16 pointer-events-none z-40" />
      
      {/* Barra de navegación principal */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#1a0000] shadow-lg backdrop-blur-[6px] py-2" 
          : "bg-[#1a0000]/90 py-4"
      }`}
      style={{
        // Asegurar posición fija consistente
        transform: 'translateZ(0)', // Hack para aceleración hardware
        backfaceVisibility: 'hidden' // Prevenir artefactos visuales
      }}>
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
                  className="relative z-10 transition-transform duration-300 group-hover:rotate-6"
                  priority
                />
                <div className="absolute inset-0 bg-red-600 rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-300" 
                     style={{ filter: 'blur(12px)' }}
                />
              </div>
              <span className="text-2xl font-bold text-gray-100 tracking-tight group-hover:text-white transition-colors duration-300">
                BEAST MODE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
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
                <div className="flex items-center space-x-4">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors duration-300 shadow-lg shadow-red-900/20 hover:shadow-red-900/40"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="px-4 py-2 border border-red-700 text-white rounded-lg hover:bg-red-700/20 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/Login"
                    className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors duration-300 shadow-lg shadow-red-900/20 hover:shadow-red-900/40"
                  >
                    Login
                  </Link>
                  <Link
                    href="/Register"
                    className="px-4 py-2 border border-red-700 text-white rounded-lg hover:bg-red-700/20 transition-all duration-300"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-100 hover:bg-red-900/50 focus:outline-none transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96" : "max-h-0"}`}>
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
                  <div className="space-y-2 pt-2">
                    <Link
                      href="/dashboard"
                      className="block w-full px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors duration-300 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block w-full px-4 py-2 border border-red-700 text-white rounded-lg hover:bg-red-700/20 transition-all duration-300 text-center"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link
                      href="/Login"
                      className="block w-full px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors duration-300 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/Register"
                      className="block w-full px-4 py-2 border border-red-700 text-white rounded-lg hover:bg-red-700/20 transition-all duration-300 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar - Versión optimizada */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-red-950 via-red-700 to-red-950 w-[200%]"
            style={{
              animation: 'progress 3s linear infinite',
              transform: 'translateZ(0)' // Aceleración hardware
            }}
          />
        </div>
      </nav>
    </>
  );
};

export default Navbarp;