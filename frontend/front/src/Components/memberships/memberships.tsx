"use client"
import { useRouter } from "next/navigation";
const MembershipSection = () => {
  const router = useRouter();

  const handleNavigation = (id: string) => {
    router.push(`/membership/${id}`);
  };
  
  return (
    <div className="w-full px-4 py-12 sm:py-20 lg:px-8 xl:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-red-950">
          ELIGE TU PLAN BEASTMODE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Membresía NOVATO */}
          <div className="border-2 border-gray-200 rounded-4xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col">
            <div className="flex-grow">
              <p className="text-gray-600 text-xl md:text-2xl font-light mb-2">
                NOVATO
              </p>
              <p className="text-red-950 text-3xl md:text-4xl font-extrabold mb-6 font-[Inter]">
                $39<span className="text-lg md:text-xl">/al mes</span>
              </p>

              <ul className="space-y-3 text-gray-700 text-sm md:text-base">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span>
                    Entrena en casa – Videos profesionales con ejercicios
                    guiados
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span>
                    10% OFF en clases grupales (spinning, pilates, zumba, etc)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span>Plan alimenticio 7 días adaptado a tus metas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span>20% OFF en tu membresía por traer a un amigo</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              
              <button onClick={() => handleNavigation("novato")}
              className="w-full bg-transparent text-red-950 border-2 border-red-950 rounded-3xl px-6 py-3 hover:bg-red-950 hover:text-white transition-colors duration-300 font-medium">
                Comenzar Ahora
              </button>
            </div>
          </div>

          {/* Membresía PRO */}
          <div className="border-2 border-red-900 rounded-4xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col transform md:scale-105 relative">
            <div className="absolute top-0 right-0 bg-red-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-4xl">
              POPULAR
            </div>

            <div className="flex-grow">
              <p className="text-gray-600 text-xl md:text-2xl font-light mb-2">
                PRO
              </p>
              <p className="text-red-950 text-3xl md:text-4xl font-extrabold mb-6 font-[Inter]">
                $89<span className="text-lg md:text-xl">/al mes</span>
              </p>

              <ul className="space-y-3 text-gray-700 text-sm md:text-base">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">⚡</span>
                  <span>Todo en Novato, más:</span>
                </li>
                <li className="flex items-start ml-6">
                  <span className="text-red-500 mr-2">•</span>
                  <span>25% OFF en suplementos deportivos</span>
                </li>
                <li className="flex items-start ml-6">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Entrenador personal 24/7 – Soporte constante</span>
                </li>
                <li className="flex items-start ml-6">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Evaluación médica completa</span>
                </li>
                <li className="flex items-start ml-6">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Acceso prioritario a todas las clases</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <button onClick={() => handleNavigation("pro")} className="w-full bg-red-900 text-white border-2 border-red-900 rounded-3xl px-6 py-3 hover:bg-red-800 hover:border-red-800 transition-colors duration-300 font-medium">
                ¡Quiero ser PRO!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipSection;
