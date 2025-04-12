import CyberGraficaUsuarios from "@/Components/Estadisticas/EstadisticaAdminUsers";
import React from "react";

function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#ffffff]">
      <div className="w-full max-w-4xl">
        <CyberGraficaUsuarios />
      </div>
    </div>
  );
}

export default Page;
