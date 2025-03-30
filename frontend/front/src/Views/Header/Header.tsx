import React, { ReactElement } from "react";

// importamos el componente navbar
import Navbar from "@/Components/Navbar";


export const Header: React.FC = (): ReactElement => {

  return (
    <div className="mb-10">
      <div className="p-2  bg-[#a82717] min-h-16 content-center rounded-t-xl">
        <Navbar />
      </div>
    </div>
  );
};

export default Header;
