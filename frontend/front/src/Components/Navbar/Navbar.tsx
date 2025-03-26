import React, { ReactElement } from "react";

// importamos el menu harcodeado
import { itemNavbar } from "./itemNavbar";

// importamos Link para hacer el Router
import Link from "next/link";



export const Navbar: React.FC = (): ReactElement => {

    return (
        <>
            <div className="flex flex-row flex-wrap justify-center gap-2 w-full">
                {itemNavbar.map((elemento, index) => (
                    <Link href={elemento.href} key={index}>
                        /* From Uiverse.io by JesusRafaelNavaCruz */
                        <button className="cursor-pointer uppercase bg-white px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] transition">
                            {elemento.label}
                        </button>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default Navbar;