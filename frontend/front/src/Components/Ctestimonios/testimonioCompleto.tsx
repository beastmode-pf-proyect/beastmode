import React from "react";
import Image from "next/image";
import { ITestimonios } from "../interfaces/testimonios";

interface TestimonyProps {
  testimonial: ITestimonios | null;
  isOpen: boolean;
  onClose: () => void;
}

const TestimonioCompleto = ({
  testimonial,
  isOpen,
  onClose,
}: TestimonyProps) => {
  if (!testimonial || !isOpen) return null;

  const renderStars = (score: number) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        fill={index < Math.round(score) ? "#FACC15" : "#E5E7EB"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-5 h-5">
        <path
          stroke="none"
          d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-6.91-.59L12 2 9.91 8.65 3 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 transition-opacity duration-300 ease-in-out opacity-100">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Image
            src={testimonial.imagen || "/descarga.png"}
            alt={testimonial.fullName}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold text-gray-900">
              {testimonial.fullName}
            </h2>
            <p className="text-sm text-gray-500 italic">
              {testimonial.occupation}
            </p>
            <div className="flex justify-center md:justify-start mt-2">
              {renderStars(testimonial.score)}
            </div>
          </div>
        </div>

        <div className="mt-6 text-gray-700 text-justify">
          {testimonial.content}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-800 rounded hover:bg-red-700 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonioCompleto;
