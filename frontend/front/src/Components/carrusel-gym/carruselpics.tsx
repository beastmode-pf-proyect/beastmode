"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/legacy/image";

const GymCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const selfies = [
    "/images/gympics/gym1.jpg",
    "/images/gympics/gym2.jpeg",
    "/images/gympics/gym3.jpg",
    "/images/gympics/gym4.jpg",
    "/images/gympics/gym5.jpg",
    "/images/gympics/gym6.jpg",
    "/images/gympics/gym7.jpg",
    "/images/gympics/gym8.jpg",
    "/images/gympics/gym9.jpg",
    "/images/gympics/gym10.jpg",
  ];

  // Duplicamos las imágenes para un efecto de carrusel infinito
  const items = [...selfies, ...selfies];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const newIndex = prev + 1;
        if (newIndex >= selfies.length) {
          // Reiniciamos suavemente al llegar al final
          return 0;
        }
        return newIndex;
      });
    }, 2000); // Velocidad de desplazamiento (2 segundos)

    return () => clearInterval(interval);
  }, [isPaused, selfies.length]);

  return (
    <div className="relative w-full overflow-hidden  py-8">
      <div
        ref={carouselRef}
        className="flex transition-transform duration-1000 ease-linear"
        style={{
          transform: `translateX(-${currentIndex * (100 / selfies.length)}%)`,
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {items.map((img, index) => (
          <div
            key={`${img}-${index}`}
            className="flex-shrink-0 px-2"
            style={{ width: `${100 / selfies.length}%` }}
          >
            <div className="relative h-64 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105">
              <Image
                src={img}
                alt={`Selfie ${(index % selfies.length) + 1}`}
                layout="fill"
                style={{
                  objectFit: "cover",
                  position: "absolute",
                  inset: "inset: calc(var(--spacing) * 0)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Indicador de pausa */}
    </div>
  );
};

export default GymCarousel;
