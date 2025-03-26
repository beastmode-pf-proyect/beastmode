import Navbar from "@/Components/Navbar";
import React, { ReactElement } from "react";

export const Header: React.FC = (): ReactElement => {

    return (
        <div className="mt-1 bg-red-900 bg-opacity-50">
            <Navbar />
        </div>
    )
}

export default Header;