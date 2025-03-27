import React, { ReactElement } from "react";

// importamos el menu harcodeado
import { itemNavbar } from "./itemNavbar";
import { itemLogin } from "./itemLogin";

// importamos Link para hacer el Router
import Link from "next/link";

// importamos Logo
import Image from "next/image";
import logo from "../../../public/img/beastmode_wolf_white (2).png";



export const Navbar: React.FC = (): ReactElement => {

    return (
        <>
            <div className="flex justify-center items-center">
                <div className="flex flex-row justify-center items-center">
                    <Image src={logo} alt="Logo" className="h-20 w-20" />
                    <h1>Beast Mode</h1>
                </div>

                <div className="flex flex-wrap justify-center gap-16 md:gap-12 sm:gap-8 w-full">
                    {itemNavbar.map((elemento, index) => (
                        <Link href={elemento.href} key={index}>
                            <button className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]">
                                {elemento.label}
                            </button>
                        </Link>
                    ))}
                </div>


                <div className="flex flex-row gap-5">
                    <Link href="/Login">
                        <button className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]">
                            Iniciar
                        </button>
                    </Link>

                    <Link href="/Register">
                        <button className="cursor-pointer uppercase bg-[#5e1914] text-[#f1f1f1] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]">
                            Registrarse
                        </button>
                    </Link>



                </div>
            </div>
        </>
    )
}

export default Navbar;