import { HiHome, HiBookOpen, HiShoppingCart, HiOutlineStar } from "react-icons/hi";
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
    <div className="flex min-h-screen bg-[#f8f8f8] text-white">
      {/* Sidebar */}
      <div className="fixed w-80 h-full bg-[#ffffff] p-8 shadow-lg flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#dc150ba7] mb-6">
            Logo
          </h1>

          {/* Información del usuario */}
          <div className="flex items-center space-x-4 bg-[#ffffff] p-4 rounded-md mb-6">
            <img src={user.avatar} alt="Usuario" className="w-12 h-12 rounded-full" />
            <div>
              <h2 className="text-lg font-semibold text-[#dc150ba7]">{user.name}</h2>
              <p className="text-sm text-[#dc150ba7]">{user.email}</p>
              
              <p  className="text-sm text-[#dc150ba7]" >{user.membership}</p>
            </div>
          </div>

          {/* Menú */}
          <ul className="mt-4 space-y-3">
            <li>
              <Link 
                href="/Dashboard" 
                className="flex items-center p-3 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#dc150ba7]"
              >
                <HiHome className="w-6 h-6" />
                <span>Inicio</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/Dashboard/Clases" 
                className="flex items-center p-3 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#dc150ba7]"
              >
                <HiBookOpen className="w-6 h-6" />
                <span>Clases</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/Dashboard/Membresia" 
                className="flex items-center p-3 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#dc150ba7]"
              >
                <HiOutlineStar className="w-6 h-6" />
                <span>Membresía</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/Dashboard/Compras" 
                className="flex items-center p-3 space-x-3 rounded-md transition-all duration-300 hover:bg-[#3B3B66] hover:scale-105 text-[#dc150ba7]"
              >
                <HiShoppingCart className="w-6 h-6" />
                <span>Historial de compras</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Cierre de sesión */}
        <button className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-all duration-300 hover:scale-105">
          Cerrar sesión
        </button>
      </div>

      {/* Contenido principal */}
      <main className="md:ml-80 p-10 w-full">{children}</main>
    </div>
  );
}
