"use client";

import React, { useEffect, useState } from "react";
import { ITestimonios } from "../interfaces/testimonios";
import ModalTestimonios from "./modalTestimonios";
import TestimonioCompletoModal from "./testimonioCompleto";
import { useAuth0 } from "@auth0/auth0-react";

const TESTIMONIOS_POR_PAGINA = 3;

const Ctestimonios = () => {
  const [testimonios, setTestimonios] = useState<ITestimonios[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTestimonio, setSelectedTestimonio] =
    useState<ITestimonios | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/testimonials`
        );
        if (!response.ok) throw new Error("Error al cargar testimonios");
        const data = await response.json();
        setTestimonios(data.reverse());
      } catch (error) {
        console.error("Error cargando testimonios:", error);
      }
    };

    fetchTestimonios();
  }, []);

  const handleSuccess = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/testimonials`
      );
      if (!response.ok) throw new Error("Error al cargar nuevos testimonios");
      const data = await response.json();
      setTestimonios(data.reverse());
      setShowModal(false);
    } catch (error) {
      console.error("Error al actualizar testimonios:", error);
    }
  };

  const openModal = (testimonio: ITestimonios) => {
    setSelectedTestimonio(testimonio);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTestimonio(null);
  };

  const renderStars = (score: number) => {
    const fullStars = Math.round(score);
    return "⭐".repeat(fullStars);
  };

  const handleChangePage = (direction: "next" | "prev") => {
    if (direction === "next") {
      setPaginaActual(prevPage => prevPage + 1);
    } else if (direction === "prev") {
      setPaginaActual(prevPage => prevPage - 1);
    }
  };

  const startIndex = (paginaActual - 1) * TESTIMONIOS_POR_PAGINA;
  const currentTestimonios = testimonios.slice(
    startIndex,
    startIndex + TESTIMONIOS_POR_PAGINA
  );

  return (
    <div className="mx-4 mt-4 flex flex-col items-center">
      {isAuthenticated && (
        <button
          onClick={() => setShowModal(true)}
          className="mb-6 bg-red-950/95 text-white px-4 py-2 rounded hover:bg-gray-600">
          ¡Comentanos tu experiencia!
        </button>
      )}

      {showModal && (
        <ModalTestimonios
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-6">
        {currentTestimonios.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500">
            No hay testimonios disponibles. ¡Sé el primero en dejar uno!
          </div>
        ) : (
          currentTestimonios.map((testimonio, index) => (
            <div
              key={index}
              className="bg-gray-100 shadow-lg rounded-lg p-4 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:bg-gray-200 w-[260px] min-h-[220px] max-h-[220px]">
              <div className="flex flex-col items-center flex-grow w-full">
                <h3 className="text-md font-semibold">{testimonio.fullName}</h3>
                <p className="text-sm text-gray-600 italic">
                  {testimonio.occupation}
                </p>
                <p className="text-sm text-gray-700 my-2 line-clamp-3">
                  {testimonio.content}
                </p>
              </div>

              <div className="mt-2 w-full">
                <p className="text-lg text-yellow-500">
                  {renderStars(testimonio.score)}
                </p>
                {testimonio.content.length > 100 && (
                  <button
                    onClick={() => openModal(testimonio)}
                    className="text-[#a82717] font-medium mt-1">
                    Ver más
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between w-full mt-4">
        <button
          onClick={() => handleChangePage("prev")}
          disabled={paginaActual === 1}
          className="px-4 py-2 bg-red-950/95 text-white rounded disabled:opacity-50">
          Anterior
        </button>
        <button
          onClick={() => handleChangePage("next")}
          disabled={paginaActual * TESTIMONIOS_POR_PAGINA >= testimonios.length}
          className="px-4 py-2 bg-red-950/95 text-white rounded disabled:opacity-50">
          Siguiente
        </button>
      </div>

      <TestimonioCompletoModal
        testimonial={selectedTestimonio}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Ctestimonios;
