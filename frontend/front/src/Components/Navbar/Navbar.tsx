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
            <div className="flex flex-wrap justify-center gap-16 md:gap-12 sm:gap-8 w-full">
                {itemNavbar.map((elemento, index) => (
                    <Link href={elemento.href} key={index}>
                        <button className="cursor-pointer uppercase bg-white px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] transition rounded-b-sm">
                            {elemento.label}
                        </button>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default Navbar;