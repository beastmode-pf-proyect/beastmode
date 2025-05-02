"use client";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { itemNavbar } from "./itemNavbar";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/img/logo.png";
import LoginForm from "../loginouth/login";
import { useRouter } from "next/navigation";
import { FaUserCog, FaSignOutAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

type MembershipPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
};

type Subscription = {
  id: string;
  user: {
    id: string;
    email: string;
  };
  membershipPlan: MembershipPlan;
  startDate: string;
  endDate: string;
  isPago: boolean;
  isActive: boolean;
};

export interface User {
  id: string;
  name: string;
  picture: string;
  email: string;
  auth0_id: string;
  role: {
    name: string;
  };
  isBlocked?: boolean;
}

type UserRole = "ADMIN" | "TRAINER" | "CLIENT" | null;

const useUserMembership = () => {
  const { isAuthenticated, error: auth0Error, user, getAccessTokenSilently } = useAuth0();
  const [fetchedUser, setFetchedUser] = useState<User | null>(null);
  const [membership, setMembership] = useState<MembershipPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [membershipError, setMembershipError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  // Polling para actualizar datos del usuario cada 5 segundos
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.sub) return;
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error("Error al obtener usuarios");

        const usersData: User[] = await response.json();
        const auth0Id = user?.sub;
        const matchedUser = usersData.find(u => u.auth0_id === auth0Id);
        if (matchedUser) {
          setFetchedUser(matchedUser);
          setIsBlocked(matchedUser.isBlocked ?? false);
        } else {
          setMembershipError("Usuario no encontrado en la base de datos");
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
      const interval = setInterval(fetchUserData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user?.sub, getAccessTokenSilently]);

  // Polling de la membresía del usuario cada 5 segundos
  useEffect(() => {
    const fetchUserMembership = async () => {
      try {
        if (!fetchedUser?.email) {
          setLoading(false);
          return;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions`);
        if (!response.ok) throw new Error("No se pudo obtener la membresía");
        const data: Subscription[] = await response.json();
        const activeMembership = data.find(
          (sub) =>
            sub.user.email === fetchedUser.email && sub.isPago && sub.isActive
        );
        if (activeMembership) {
          setMembership(activeMembership.membershipPlan);
        } else {
          setMembership(null);
        }
      } catch (error) {
        console.error("Error al obtener la membresía:", error);
        setMembershipError("Error al obtener la membresía");
      } finally {
        setLoading(false);
      }
    };

    if (fetchedUser?.email) {
      fetchUserMembership();
      const interval = setInterval(fetchUserMembership, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchedUser?.email]);

  return { membership, loading, error: membershipError || auth0Error, fetchedUser, isBlocked };
};

export const Navbarp = () => {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth0();
  const {
    membership,
    loading: membershipLoading,
    fetchedUser,
    isBlocked,
  } = useUserMembership();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && !membershipLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, membershipLoading]);

  // Fuente de avatar
  const avatarSrc = fetchedUser?.picture || "/avatar2.avif";

  // Determinar si el usuario es PRO
  const isProUser =
    membership?.name.toLowerCase().includes("premium") ||
    membership?.name.toLowerCase().includes("pro");

  // Efecto de scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch del rol del usuario
  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (!user?.sub) return;
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/role/${user.sub}`;
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 404) {
            setUserRole("CLIENT");
            return;
          }
          throw new Error(`Error al obtener el rol - status ${response.status}`);
        }
        const roleText = await response.text();
        const normalizedRole = roleText.toUpperCase();
        if (["ADMIN", "TRAINER", "CLIENT"].includes(normalizedRole)) {
          setUserRole(normalizedRole as UserRole);
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

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-menu-container") && !target.closest(".mobile-menu-container")) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      default:
        break;
    }
  };

  // Estilos dinámicos para el avatar
  const getAvatarStyle = () => {
    if (membershipLoading || !membership) return "border-gray-400 shadow-md";
    const membershipName = membership.name.toLowerCase();
    if (membershipName.includes("premium")) return "border-yellow-400 shadow-yellow-400/50 animate-pulse";
    if (membershipName.includes("gold")) return "border-amber-600 shadow-amber-600/70";
    if (membershipName.includes("platino") || membershipName.includes("platinum")) return "border-cyan-300 shadow-cyan-300/50";
    if (membershipName.includes("diamante") || membershipName.includes("diamond")) return "border-purple-500 shadow-purple-500/50 animate-[pulse_2s_infinite]";
    return "border-red-500 shadow-red-500/50";
  };

  // Efectos al hover para el avatar
  const getAvatarHoverEffect = () => {
    if (membershipLoading || !membership) return "hover:shadow-gray-400";
    const membershipName = membership.name.toLowerCase();
    if (membershipName.includes("premium")) return "hover:shadow-yellow-400 hover:rotate-12";
    if (membershipName.includes("gold")) return "hover:shadow-amber-600 hover:scale-110";
    if (membershipName.includes("platino") || membershipName.includes("platinum")) return "hover:shadow-cyan-300 hover:brightness-125";
    if (membershipName.includes("diamante") || membershipName.includes("diamond")) return "hover:shadow-purple-500 hover:animate-pulse";
    return "hover:shadow-red-500";
  };

  // Badge de membresía
  const getMembershipBadge = () => {
    if (membershipLoading || !membership) return null;
    const membershipName = membership.name.toLowerCase();
    let badgeClass = "bg-gradient-to-r text-xs font-bold px-2 py-0.5 rounded-full shadow-lg";
    if (membershipName.includes("premium")) badgeClass += " from-yellow-400 to-yellow-600 text-black";
    else if (membershipName.includes("gold")) badgeClass += " from-amber-500 to-amber-700 text-white";
    else if (membershipName.includes("platino") || membershipName.includes("platinum")) badgeClass += " from-cyan-400 to-blue-600 text-white";
    else if (membershipName.includes("diamante") || membershipName.includes("diamond")) badgeClass += " from-purple-500 to-indigo-700 text-white";
    else badgeClass += " from-red-500 to-red-700 text-white";

    return (
      <div className={`absolute -bottom-2 -right-2 ${badgeClass}`}>
        {membership.name}
      </div>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 p-4 z-50 transition-all duration-300 ${
        isProUser
          ? "bg-gradient-to-r from-yellow-600 to-yellow-800 shadow-lg"
          : "bg-[#5e1914]"
      } ${
        scrolled
          ? isProUser
            ? "bg-yellow-700 shadow-lg backdrop-blur-sm py-2"
            : "bg-red-950 shadow-lg backdrop-blur-sm py-2"
          : isProUser
          ? "bg-yellow-700 py-4"
          : "bg-red-950 py-4"
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
                  className={`relative z-10 transform transition-transform duration-300 group-hover:rotate-6 ${
                    isProUser ? "filter brightness-110" : ""
                  }`}
                />
                <div
                  className={`absolute inset-0 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 ${
                    isProUser ? "bg-yellow-500" : "bg-red-600"
                  }`}
                />
              </div>
              <span
                className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
                  isProUser
                    ? "text-gray-900 group-hover:text-black"
                    : "text-gray-100 group-hover:text-white"
                }`}
              >
                BEAST MODE{" "}
                {isProUser && (
                  <span className="text-xs bg-black text-yellow-400 px-2 py-1 rounded-full ml-2">
                    PRO
                  </span>
                )}
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {itemNavbar.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`relative px-3 py-2 transition-colores duration-300 group ${
                  isProUser
                    ? "text-gray-900 hover:text-black"
                    : "text-gray-100 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                    isProUser ? "bg-gray-900" : "bg-gray-100"
                  }`}
                />
              </Link>
            ))}

            <div className={`h-6 w-px ${isProUser ? "bg-gray-900/30" : "bg-gray-100/20"}`} />

            {isAuthenticated ? (
              <div className="flex items-center gap-4 relative profile-menu-container">
                {/* Avatar con dropdown */}
                {!isBlocked ? (
                  <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <div className="relative w-10 h-10">
                      <div
                        className={`w-11 h-11 rounded-full border-4 overflow-hidden ${getAvatarStyle()} ${getAvatarHoverEffect()} transition-all duration-300 ${
                          isProUser ? "ring-2 ring-yellow-400" : ""
                        }`}
                      >
                        <Image
                          src={avatarSrc}
                          alt="Avatar"
                          width={50}
                          height={50}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      {getMembershipBadge()}
                    </div>
                    {isProfileMenuOpen ? (
                      <FaChevronUp
                        className={`transition-transform ${
                          isProUser ? "text-gray-900 group-hover:text-black" : "text-gray-100 group-hover:text-white"
                        }`}
                      />
                    ) : (
                      <FaChevronDown
                        className={`transition-transform ${
                          isProUser ? "text-gray-900 group-hover:text-black" : "text-gray-100 group-hover:text-white"
                        }`}
                      />
                    )}
                  </div>
                ) : (
                  <span className="text-red-500">Usuario bloqueado</span>
                )}

                {/* Menú desplegable */}
                <div
                  className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-xl z-50 border overflow-hidden transition-all duration-300 ease-out ${
                    isProfileMenuOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  } ${isProUser ? "bg-yellow-600 border-yellow-700" : "bg-[#5e1914] border-red-900"}`}
                >
                  <div
                    className={`px-4 py-3 border-b ${isProUser ? "border-yellow-700" : "border-red-900"}`}
                  >
                    <p className={`text-sm font-medium ${isProUser ? "text-gray-900" : "text-white"}`}>
                      {fetchedUser?.name || "Usuario"}
                    </p>
                    <p className={`text-xs ${isProUser ? "text-gray-800" : "text-gray-300"} truncate`}>
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleDashboardRedirect();
                      setIsProfileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 transition duration-200 text-left ${
                      isProUser
                        ? "text-gray-900 hover:bg-yellow-500"
                        : "text-gray-100 hover:bg-red-800"
                    }`}
                  >
                    <FaUserCog className="text-lg flex-shrink-0" />
                    <span>Mi Perfil</span>
                  </button>
                  <button
                    onClick={() => {
                      logout({
                        logoutParams: {
                          returnTo: window.location.origin,
                        },
                      });
                      setIsProfileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 transition duration-200 text-left border-t ${
                      isProUser
                        ? "border-yellow-700 text-gray-900 hover:bg-yellow-500"
                        : "border-red-900 text-gray-100 hover:bg-red-800"
                    }`}
                  >
                    <FaSignOutAlt className="text-lg flex-shrink-0" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <LoginForm />
              </div>
            )}
          </div>

          {/* Botón para menú móvil */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg focus:outline-none transition-colors duration-300 ${
              isProUser ? "text-gray-900 hover:bg-yellow-500" : "text-gray-100 hover:bg-red-900"
            }`}
          >
            <div className={`w-6 h-0.5 mb-1.5 ${isProUser ? "bg-gray-900" : "bg-gray-100"}`} />
            <div className={`w-6 h-0.5 mb-1.5 ${isProUser ? "bg-gray-900" : "bg-gray-100"}`} />
            <div className={`w-6 h-0.5 ${isProUser ? "bg-gray-900" : "bg-gray-100"}`} />
          </button>
        </div>

        {/* Menú móvil */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } ${isProUser ? "bg-yellow-600" : "bg-[#5e1914]"}`}
        >
          <div className="pt-2 pb-4 space-y-2">
            {itemNavbar.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors duration-300 ${
                  isProUser ? "text-gray-900 hover:bg-yellow-500" : "text-gray-100 hover:bg-red-900"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className={`pt-2 mt-2 border-t ${isProUser ? "border-yellow-700" : "border-red-900"}`}>
              {isAuthenticated ? (
                <div className="space-y-3 pt-2 px-4 mobile-menu-container">
                  {/* Avatar móvil */}
                  {!isBlocked ? (
                    <div
                      className="flex items-center gap-3 cursor-pointer pb-3"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                      <div className="relative">
                        <Image
                          src={avatarSrc}
                          alt="Avatar"
                          width={42}
                          height={42}
                          className={`rounded-full border-4 ${getAvatarStyle()} ${getAvatarHoverEffect()} ${
                            isProUser ? "ring-2 ring-yellow-400" : ""
                          }`}
                        />
                        {getMembershipBadge()}
                      </div>
                      <div>
                        <p className={`font-medium ${isProUser ? "text-gray-900" : "text-gray-100"}`}>
                          {fetchedUser?.name || user?.name || "Mi cuenta"}
                        </p>
                        <p className={`text-xs ${isProUser ? "text-gray-800" : "text-gray-300"}`}>
                          {membership?.name || "Sin membresía"}
                        </p>
                      </div>
                      {isProfileMenuOpen ? (
                        <FaChevronUp className={isProUser ? "text-gray-900 ml-auto" : "text-gray-100 ml-auto"} />
                      ) : (
                        <FaChevronDown className={isProUser ? "text-gray-900 ml-auto" : "text-gray-100 ml-auto"} />
                      )}
                    </div>
                  ) : (
                    <span className="text-red-500">Usuario bloqueado</span>
                  )}

                  {/* Menú desplegable móvil */}
                  <div
                    className={`pl-14 space-y-3 transition-all duration-300 ease-out overflow-hidden ${
                      isProfileMenuOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                    }`}
                  >
                    <button
                      onClick={() => {
                        handleDashboardRedirect();
                        setIsOpen(false);
                        setIsProfileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition duration-200 text-left ${
                        isProUser ? "text-gray-900 hover:bg-yellow-500" : "text-gray-100 hover:bg-red-800"
                      }`}
                    >
                      <FaUserCog className="text-lg" />
                      <span>Mi Perfil</span>
                    </button>
                    <button
                      onClick={() => {
                        logout({
                          logoutParams: {
                            returnTo: window.location.origin,
                          },
                        });
                        setIsOpen(false);
                        setIsProfileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition duration-200 text-left ${
                        isProUser ? "text-gray-900 hover:bg-yellow-500" : "text-gray-100 hover:bg-red-800"
                      }`}
                    >
                      <FaSignOutAlt className="text-lg" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
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

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${
          isProUser
            ? "from-yellow-800 via-yellow-500 to-yellow-800"
            : "from-red-950 via-red-700 to-red-950"
        } bg-[length:200%_200%] animate-[gradient_3s_ease-in-out_infinite]`}
      />
    </nav>
  );
};

export default Navbarp;
