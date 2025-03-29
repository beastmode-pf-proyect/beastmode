import Navbar from "@/Components/Navbar";
import React, { ReactElement } from "react";

export const Header: React.FC = (): ReactElement => {
  return (
    <div className="p-2  bg-[#a82717] min-h-16 content-center">
      <Navbar />
    </div>
  );
};

export default Header;
