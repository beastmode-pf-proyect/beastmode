import React, { ReactElement } from "react";

// importamos componente navbar
import Navbar from "@/Components/Navbar";

// importamos estilos
import estilos from "./Header.module.css";

export const Header: React.FC = (): ReactElement => {

    return (
        <div className={estilos.contenedorPrincipal}>
            <div className="mt-1 p-2 mb-16 bg-[#a82717] rounded-xl min-h-16 content-center">
                <Navbar />
            </div>
        </div>
    )
}

export default Header;