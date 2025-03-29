"use client";

import React, { ReactElement, useState } from "react";

// importamos el menu harcodeado
import { itemNavbar } from "./itemNavbar";

// importamos Link para hacer el Router
import Link from "next/link";

// importamos Logo
import Image from "next/image";
import logo from "../../../public/img/logo.png";
import hamburguesa from "../../../public/img/hamburguesa.png";

// importamos estilos css
import estilos from "./Navbar.module.css";

export const Navbar: React.FC = (): ReactElement => {
  // esatdo para el menu hamburguesa
  const [mostrar, setMostrat] = useState(false);

  function visible() {
    setMostrat(!mostrar);
  }

  return (
    <>
      <div className="flex justify-center items-center text-#5e1914">
        {/* logo y nombre */}
        <div
          className={`${estilos.logoPosicion} flex flex-row justify-center items-center`}
        >
          <Image src={logo} alt="Logo" className={`${estilos.logo}`} />
          <span className={estilos.tituloLogo}>Beast Mode</span>
        </div>

        {/* menu hamburguesa */}
        <div className="lg:hidden">
          <button onClick={visible}>
            <Image
              src={hamburguesa}
              alt="ico"
              unoptimized
              className={`${estilos.icoHamburguesa} cursor-pointer `}
            />
          </button>

          {mostrar ? (
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

                <Link href="/Register">
                  <button
                    className="cursor-pointer uppercase bg-[#5e1914] text-[#f1f1f1] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]"
                    onClick={visible}
                  >
                    Registrarse
                  </button>
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {/* navbar */}
        <div className="flex flex-wrap justify-center gap-16 md:gap-12 sm:gap-8 w-full ml-40 ">
          {itemNavbar.map((elemento, index) => (
            <Link href={elemento.href} key={index} className="hidden lg:block">
              <button className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]">
                {elemento.label}
              </button>
            </Link>
          ))}
        </div>

        {/* navbar de login y register */}
        <div className="flex flex-row gap-5">
          <Link href="/Login" className="hidden lg:block">
            <button className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]">
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
    </>
  );
};

export default Navbar;
