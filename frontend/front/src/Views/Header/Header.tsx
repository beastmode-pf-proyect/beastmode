import Navbar from "@/Components/Navbar";
import React, { ReactElement } from "react";

export const Header: React.FC = (): ReactElement => {

    return (
        <div className="mt-1 p-2 mb-20 bg-[#a82717] rounded-xl min-h-16 content-center">
            <Navbar />
        </div>
    )
}

export default Header;