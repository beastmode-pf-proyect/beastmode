import { HiHome, HiBookOpen, HiShoppingCart, HiOutlineStar,HiOutlineLogout } from "react-icons/hi";
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Datos del usuario
  const user = {
    name: "Juan Pérez",
    email: "juanperez@email.com",
    avatar: "https://via.placeholder.com/100",
    membership: "Premium",
  };
  
  return (
    <div className="flex min-h-screen bg-[#f8f8f8] text-[#333]">
      {/* Sidebar más compacto y sticky */}
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] w-64 bg-white shadow-lg p-4 flex flex-col overflow-y-auto z-20">
        <div>
          
          <img src="/img/logon.png" alt="Logo" className="w-40 h-auto mb-6" />
          
          <h1 className="text-2xl font-bold text-[#5e1914] mb-6">BeastMode</h1>

          {/* Información del usuario */}
          <div className="flex items-center space-x-3 bg-[#ffffff] p-3 rounded-md mb-6">
            <img src={user.avatar} alt="Usuario" className="w-10 h-10 rounded-full" />
            <div>
              <h2 className="text-lg font-semibold text-[#5e1914]">{user.name}</h2>
              <p className="text-sm text-[#5e1914]">{user.email}</p>
              <p className="text-sm text-[#5e1914]">{user.membership}</p>
            </div>
          </div>

          {/* Menú */}
          <ul className="mt-4 space-y-2">
            <li>
              <Link 
                href="/Dashboard" 
                className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#5e1914]"
              >
                <HiHome className="w-5 h-5" />
                <span>Inicio</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/Dashboard/Clases" 
                className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#5e1914]"
              >
                <HiBookOpen className="w-5 h-5" />
                <span>Clases</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/Dashboard/Membresia" 
                className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#5e1914]"
              >
                <HiOutlineStar className="w-5 h-5" />
                <span>Membresía</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/Dashboard/Compras" 
                className="flex items-center p-2 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#5e1914]"
              >
                <HiShoppingCart className="w-5 h-5" />
                <span>Historial de compras</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Cierre de sesión más arriba */}
          <div className="mt-4">
              <button className="w-full flex items-center justify-center gap-2 bg-[#5e1914] hover:bg-[#a82717] text-white p-2 rounded-md transition-all duration-300 transform hover:scale-105">
                  <HiOutlineLogout className="w-5 h-5" />
                  <span>Cerrar sesión</span>
              </button>
          </div>
        </div>

      {/* Contenido principal más pegado al sidebar */}
      <main className="flex-1  p-8 min-h-screen">{children}</main>
    </div>
  );
}
