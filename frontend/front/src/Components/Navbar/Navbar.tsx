"use client";

import React, { ReactElement, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { itemNavbar } from "./itemNavbar";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/img/logo.png";
import hamburguesa from "../../../public/img/hamburguesa.png";
import estilos from "./Navbar.module.css";

export const Navbar: React.FC = (): ReactElement => {
    const [mostrar, setMostrar] = useState(false);
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    function toggleMenu() {
        setMostrar(!mostrar);
    }

    return (
        <>
            <div className="flex justify-center items-center text-#5e1914">
                {/* Logo */}
                <div className={`${estilos.logoPosicion} flex flex-row justify-center items-center`}>
                    <Image src={logo} alt="Logo" className={`${estilos.logo}`} />
                    <h1 className={estilos.tituloLogo}>Beast Mode</h1>
                </div>

                {/* Menú hamburguesa */}
                <div className="lg:hidden">
                    <button onClick={toggleMenu}>
                        <Image src={hamburguesa} alt="ico" unoptimized className={`${estilos.icoHamburguesa} cursor-pointer `} />
                    </button>

                    {mostrar && (
                        <div className={`${estilos.menuDesplegable} z-50`}>
                            {itemNavbar.map((elemento, index) => (
                                <Link href={elemento.href} key={index}>
                                    <button className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1]" onClick={toggleMenu}>
                                        {elemento.label}
                                    </button>
                                </Link>
                            ))}

                            <div className="flex flex-col gap-5">
                                {isAuthenticated ? (
                                    <>
                                        <Link href="/dashboard">
                                            <button className="cursor-pointer uppercase bg-[#5e1914] text-[#f1f1f1] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1]" onClick={toggleMenu}>
                                                Dashboard
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => logout()}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => loginWithRedirect()}
                                            className="cursor-pointer uppercase bg-[#5e1914] text-[#f1f1f1] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1]"
                                        >
                                            Iniciar
                                        </button>
                                        <Link href="/Register">
                                            <button className="cursor-pointer uppercase bg-[#5e1914] text-[#f1f1f1] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1]" onClick={toggleMenu}>
                                                Registrarse
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navbar escritorio */}
                <div className="flex flex-wrap justify-center gap-16 md:gap-12 sm:gap-8 w-full ml-40 hidden lg:flex">
                    {itemNavbar.map((elemento, index) => (
                        <Link href={elemento.href} key={index}>
                            <button className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1]">
                                {elemento.label}
                            </button>
                        </Link>
                    ))}
                </div>

                {/* Dashboard y Logout solo si está autenticado */}
                <div className="flex flex-row gap-5 hidden lg:flex">
                    {isAuthenticated ? (
                        <>
                            <Link href="/Dashboard">
                                <button className="cursor-pointer uppercase bg-[#5e1914] text-[#f1f1f1] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1]">
                                    Dashboard
                                </button>
                            </Link>
                            <button
                                onClick={() => logout()}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => loginWithRedirect()}
                                className="cursor-pointer uppercase bg-[#5e1914] text-[#f1f1f1] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1]"
                            >
                                Iniciar
                            </button>
                            <Link href="/Register">
                                <button className="cursor-pointer uppercase bg-[#5e1914] text-[#f1f1f1] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1]">
                                    Registrarse
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
