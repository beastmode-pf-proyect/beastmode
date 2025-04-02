import Navbarp from "@/Components/Navbarp/Navbar";
import React, { ReactElement } from "react";

// importamos el componente navbar



export const Header: React.FC = (): ReactElement => {

  return (
    <header className="sticky top-0 z-50 w-full h-24"> {/* 64px */}
    <Navbarp />
  </header>
    
  );
};

export default Header;
