import Navbar from "@/Components/Navbar";
import React, { ReactElement } from "react";

export const Header: React.FC = (): ReactElement => {

    return (
        <div className="mt-1 p-2 bg-[#640D14]/20 rounded-b-xl">
            <Navbar />
        </div>
    )
}

export default Header;