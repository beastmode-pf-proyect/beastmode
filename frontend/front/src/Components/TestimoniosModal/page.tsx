import React from "react";
import { ITestimonios } from "../interfaces/testimonios";
import Image from "next/image";

interface TestimonialModalProps {
  testimonial: ITestimonios | null;
  onClose: () => void;
  isOpen: boolean;
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({
  testimonial,
  onClose,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-[90%] max-h-[90%] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Testimonio</h2>
        {testimonial && (
          <div className="flex flex-col md:flex-row items-center mb-4">
            <div className="md:w-1/3 mb-4 md:mb-0">
                          {typeof testimonial.imagen === "string" ? (
                              <Image
                                  src={testimonial.imagen}
                                  alt={testimonial.nombre}
                                  width={100}
                                  height={100}
                                  className="max-w-full max-h-[300px] object-contain rounded-lg"
                              />
                          ) : (
                              <Image
                                  src={testimonial.imagen}
                                  alt={testimonial.nombre}
                                  width={100}
                                  height={100}
                  className="max-w-full max-h-[300px] object-contain rounded-lg"
                />
              )}
            </div>
            <div className="md:w-2/3 md:ml-8">
              <h3 className="text-xl font-bold mb-2">{testimonial.nombre}</h3>
              <p className="text-gray-700 mb-4">{testimonial.descripcion}</p>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialModal;
