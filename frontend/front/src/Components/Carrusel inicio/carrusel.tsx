"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  { id: 1, url: "/images/landingpage1.png", alt: "Imagen 1" },
  { id: 2, url: "/images/landingpage2.jpg", alt: "Imagen 2" },
  { id: 3, url: "/images/landingpage3.jpg", alt: "Imagen 3" },
];

const FullWidthCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-screen h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden -mx-[calc((100vw-100%)/2)]">
      {/* Contenedor principal con ancho completo */}
      <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
           style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative">
            <Image
              src={slide.url}
              alt={slide.alt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            
            {/* Overlay para mejor contraste */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}
      </div>

      {/* Indicadores de paginación centrados */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-white w-6' : 'bg-white/50'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Flechas de navegación */}
      <button 
        onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-all z-10"
        aria-label="Anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={() => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-all z-10"
        aria-label="Siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default FullWidthCarousel;