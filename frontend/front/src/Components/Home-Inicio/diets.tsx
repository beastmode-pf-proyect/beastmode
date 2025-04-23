"use client";
import { useState } from "react";

type DietType = "keto" | "volumen"; // 1. Define un tipo literal

const DownloadDietSection = () => {
  // 2. Estado tipado específicamente
  const [selectedDiet, setSelectedDiet] = useState<DietType>("keto");

  // 3. Objeto con tipo explícito
  const dietFiles: Record<DietType, string> = {
    keto: "/dietaspdfs/plan-keto.pdf",
    volumen: "/dietaspdfs/plan-volumen.pdf",
  };

  const handleDownload = () => {
    const fileUrl = dietFiles[selectedDiet];
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `dieta-${selectedDiet}.pdf`;
    link.click();
  };

  return (
    <section className="bg-red-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">
              ¿Quieres complementar tu entrenamiento
            </span>
            <span className="block text-red-200">con dietas saludables?</span>
          </h2>

          {/* Selector de dieta */}
          <div className="mt-6 flex justify-center gap-4">
            {Object.keys(dietFiles).map((diet) => (
              <button
                key={diet}
                onClick={() => setSelectedDiet(diet as DietType)}
                className={`px-4 py-2 rounded-md ${
                  selectedDiet === diet
                    ? "bg-white text-red-700 font-bold"
                    : "bg-red-500 text-white"
                }`}
              >
                {diet.charAt(0).toUpperCase() + diet.slice(1)}
              </button>
            ))}
          </div>

          {/* Botón de descarga */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-red-700 bg-white hover:bg-gray-100 shadow-lg transition-all hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Descargar aquí tu dieta {selectedDiet}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadDietSection;
