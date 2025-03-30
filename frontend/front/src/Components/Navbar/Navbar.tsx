"use client";

import React, { ReactElement, useState } from "react";
import { itemNavbar } from "./itemNavbar";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/img/logo.png";
import hamburguesa from "../../../public/img/hamburguesa.png";
import estilos from "./Navbar.module.css";

export const Navbar: React.FC = (): ReactElement => {
  const [mostrar, setMostrar] = useState(false);

  function visible() {
    setMostrar(!mostrar);
  }

  return (
    <>
      <div className="flex justify-center items-center text-[#5e1914]">
        {/* Logo y nombre */}
        <div className={`${estilos.logoPosicion} flex flex-row items-end`}>
          <Image src={logo} alt="Logo" className={estilos.logo} width={50} height={50} />
          <span className={estilos.tituloLogo}>Beast Mode</span>
        </div>

        {/* Menú hamburguesa */}
        <div className="lg:hidden">
          <button onClick={visible}>
            <Image
              src={hamburguesa}
              alt="ico"
              width={30}
              height={30}
              className={`${estilos.icoHamburguesa} cursor-pointer`}
            />
          </button>

          {mostrar && (
            <div className={`${estilos.menuDesplegable} z-50`}>
              {itemNavbar.map((elemento, index) => (
                <Link href={elemento.href} key={index}>
                  <button
                    className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]"
                    onClick={visible}
                  >
                    {elemento.label}
                  </button>
                </Link>
              ))}

              <div className="flex flex-col gap-5">
                <Link href="/Login">
                  <button
                    className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]"
                    onClick={visible}
                  >
                    Iniciar
                  </button>
                </Link>

                <Link href="/Register" className="hidden lg:block">
                  <button className="cursor-pointer uppercase bg-[#5e1914] text-[#f1f1f1] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]">
                    Registrarse
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
