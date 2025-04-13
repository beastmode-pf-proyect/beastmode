"use client";

import React, { ReactElement, useEffect, useState } from "react";
import testimonios from "./testimonios";
import Image from "next/image";
import TestimonialModal from "../TestimoniosModal/page";
import { ITestimonios } from "../interfaces/testimonios";

const ITEMS_POR_PAGINA = 3;
const MAX_DESCRIPCION_LENGTH = 50;

const Ctestimonios: React.FC = (): ReactElement => {
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonio, setSelectedTestimonio] =
    useState<ITestimonios | null>(null);

  useEffect(() => {
    const total = Math.ceil(testimonios.length / ITEMS_POR_PAGINA);
    setTotalPaginas(total);
  }, []);

  const testimoniosPaginados = testimonios.slice(
    paginaActual * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA + ITEMS_POR_PAGINA
  );

  const irPaginaSiguiente = () => {
    setPaginaActual(prev => (prev + 1 < totalPaginas ? prev + 1 : prev));
  };

  const irPaginaAnterior = () => {
    setPaginaActual(prev => (prev > 0 ? prev - 1 : 0));
  };

  const truncarDescripcion = (descripcion: string): string => {
    if (descripcion.length <= MAX_DESCRIPCION_LENGTH) {
      return descripcion;
    } else {
      return `${descripcion.slice(0, MAX_DESCRIPCION_LENGTH)}...`;
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

  return (
    <div className="mx-4 mt-4 flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-6">
        {testimoniosPaginados.map((elemento, index) => (
          <div
            key={index}
            className="bg-gray-100 shadow-lg rounded-lg p-4 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 hover:bg-gray-200 h-[240px] w-[240px]">
            <Image
              src={elemento.imagen}
              alt={`Imagen de ${elemento.nombre}`}
              width={70}
              height={70}
              className="w-16 h-16 rounded-full object-cover mb-4"
            />
            <h3 className="text-md font-semibold">{elemento.nombre}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {truncarDescripcion(elemento.descripcion)}
            </p>
            <p className="text-lg mt-1 text-yellow-500">
              ⭐ {elemento.calificacion}
            </p>
            {elemento.descripcion.length > MAX_DESCRIPCION_LENGTH && (
              <button
                onClick={() => openModal(elemento)}
                className="text-[#a82717] font-medium absolute bottom-4 left-4 right-4">
                Ver más
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={irPaginaAnterior}
          disabled={paginaActual === 0}
          className={`px-4 py-2 rounded-lg shadow-md transition ${
            paginaActual === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#a82717] text-white hover:bg-[#861f12]"
          }`}>
          Anterior
        </button>

        <span className="text-sm font-medium text-[#5e1914]">
          Página {paginaActual + 1} de {totalPaginas}
        </span>

        <button
          onClick={irPaginaSiguiente}
          disabled={paginaActual + 1 >= totalPaginas}
          className={`px-4 py-2 rounded-lg shadow-md transition ${
            paginaActual + 1 >= totalPaginas
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#a82717] text-white hover:bg-[#861f12]"
          }`}>
          Siguiente
        </button>
      </div>

      {/* Modal de Testimonio */}
      <TestimonialModal
        testimonial={selectedTestimonio}
        onClose={closeModal}
        isOpen={isModalOpen}
      />
    </div>
  );
};

export default Ctestimonios;
