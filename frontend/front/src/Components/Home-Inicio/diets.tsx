"use client";
import { useState } from "react";

type DietType = "keto" | "volumen";

const DownloadDietSection = () => {
  const [selectedDiet, setSelectedDiet] = useState<DietType>("keto");

  const dietData: Record<
    DietType,
    {
      file: string;
      description: string;
      benefits: string[];
    }
  > = {
    keto: {
      file: "/dietaspdfs/dieta-keto.pdf",
      description:
        "Dieta baja en carbohidratos y alta en grasas saludables que promueve la quema de grasa corporal.",
      benefits: [
        "Pérdida de peso acelerada",
        "Mayor claridad mental",
        "Control de niveles de azúcar",
      ],
    },
    volumen: {
      file: "/dietaspdfs/dieta-volumen.pdf",
      description:
        "Plan nutricional hipercalórico para ganar masa muscular de forma limpia.",
      benefits: [
        "Aumento de masa muscular",
        "Mayor energía para entrenamientos",
        "Recuperación muscular óptima",
      ],
    },
  };

  const handleDownload = () => {
    const { file } = dietData[selectedDiet];
    const link = document.createElement("a");
    link.href = file;
    link.download = `dieta-${selectedDiet}.pdf`;
    link.click();
  };

  return (
    <section className="bg-gradient-to-b from-red-800 to-red-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">Potencia tu entrenamiento</span>
            <span className="block text-amber-200">
              con nutrición especializada
            </span>
          </h2>

          {/* Selector de dietas */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {(Object.keys(dietData) as DietType[]).map((diet) => (
              <button
                key={diet}
                onClick={() => setSelectedDiet(diet)}
                className={`px-5 py-3 rounded-lg transition-all ${
                  selectedDiet === diet
                    ? "bg-white text-red-700 font-bold shadow-lg"
                    : "bg-red-600/90 text-white hover:bg-red-600"
                }`}
                aria-label={`Seleccionar dieta ${diet}`}
              >
                {diet.charAt(0).toUpperCase() + diet.slice(1)}
              </button>
            ))}
          </div>

          {/* Descripción de la dieta seleccionada */}
          <div className="mt-8 max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left border border-white/20">
            <h3 className="text-xl font-bold text-amber-300 mb-2">
              Dieta{" "}
              {selectedDiet.charAt(0).toUpperCase() + selectedDiet.slice(1)}
            </h3>
            <p className="text-white mb-4">
              {dietData[selectedDiet].description}
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {dietData[selectedDiet].benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 text-green-400 mr-2">✓</span>
                  <span className="text-white/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botón de descarga */}
          <div className="mt-10">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-bold rounded-xl text-white bg-transparent hover:bg-white hover:text-red-700 transition-colors shadow-lg hover:shadow-xl animate-pulse hover:animate-none hover:cursor-pointer"
              aria-label={`Descargar dieta ${selectedDiet}`}
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Descargar Plan{" "}
              {selectedDiet.charAt(0).toUpperCase() + selectedDiet.slice(1)}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadDietSection;
