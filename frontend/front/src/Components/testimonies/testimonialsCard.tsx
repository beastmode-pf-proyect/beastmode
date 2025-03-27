"use client";

import { useState } from "react";
import Image from "next/image";
import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { Testimonial } from "../interfaces/types";

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      selfieUrl: "/images/testimonies/testimonio1.jpg",

      name: "Virginia González",
      rating: 5,
      testimonial:
        "Increíble transformación en solo 3 meses. Los entrenadores son expertos y el ambiente es motivador. ¡Lo recomiendo 100%!",
    },
    {
      id: 2,
      selfieUrl: "/images/testimonies/tetimonio6.jpg",

      name: "Carlos Rodríguez",
      rating: 4,
      testimonial:
        "El mejor gimnasio al que he asistido. Equipos de primera y rutinas personalizadas. BeastMode Gym cambió mi vida.",
    },
    {
      id: 3,
      selfieUrl: "/images/testimonies/tetimonio3.jpg",

      name: "Ana Martínez",
      rating: 5,
      testimonial:
        "El ambiente es increíble y los resultados se notan rápido. Nunca me había sentido tan bien con mi cuerpo. ¡Gracias BeastMode!",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 2 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 2 : prevIndex - 1
    );
  };

  return (
    <section className="py-12  relative">
      <div className="container mx-auto px-4 ">
        <div className="relative overflow-hidden ">
          {/* Contenedor del carrusel */}
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 50}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex-shrink-0 w-1/2 px-4 ">
                <div className="relative bg-[#5E1914] rounded-lg shadow-2xl overflow-hidden text-white h-full border-2">
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Sección izquierda con imágenes */}
                    <div className="relative md:w-1/3 h-full">
                      {/* Selfie de fondo */}
                      <div className="absolute inset-0">
                        <Image
                          src={testimonial.selfieUrl}
                          alt={`Selfie de ${testimonial.name}`}
                          fill
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </div>

                    {/* Sección derecha con testimonio */}
                    <div className="md:w-2/3 p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold">
                          {testimonial.name}
                        </h3>
                        <div className="flex mt-2">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-5 h-5 ${
                                i < testimonial.rating
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <blockquote className="italic">
                        <p>{testimonial.testimonial}</p>
                      </blockquote>

                      <div className="mt-6 flex justify-end ">
                        <span>
                          <img
                            src="/images/beastmode_wolf_white.png"
                            className="h-7 mt-5"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={prevTestimonial}
            className="p-2 rounded-full bg-[#5E1914] text-white hover:bg-[#7A2323] transition-colors cursor-pointer"
            aria-label="Testimonio anterior"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="p-2 rounded-full bg-[#5E1914] text-white hover:bg-[#7A2323] transition-colors cursor-pointer"
            aria-label="Siguiente testimonio"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;

{
  /* <div className="mt-6 flex justify-end">
            <span>
              <img src="/images/beastmode_wolf_white.png" className="h-7 " />
            </span>
          </div> */
}
