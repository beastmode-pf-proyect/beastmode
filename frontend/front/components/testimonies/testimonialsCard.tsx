import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";

interface TestimonialCardProps {
  selfieUrl: string;
  profileUrl: string;
  name: string;
  rating: number;
  testimonial: string;
}

const TestimonialCard = ({
  selfieUrl,
  profileUrl,
  name,
  rating,
  testimonial,
}: TestimonialCardProps) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto bg-[#5E1914] rounded-lg shadow-2xl overflow-hidden text-white">
      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row">
        {/* Sección izquierda con imágenes */}
        <div className="relative md:w-1/3 h-80 md:h-auto">
          {/* Selfie de fondo */}
          <div className="absolute inset-0">
            <Image
              src={selfieUrl}
              alt={`Selfie de ${name}`}
              layout="fill"
              objectFit="cover"
              className="opacity-70"
            />
          </div>
        </div>

        {/* Sección derecha con testimonio */}
        <div className="md:w-2/3 p-6 md:p-8">
          {/* Nombre y rating */}
          <div className="mb-4">
            <h3 className="text-xl font-bold">{name}</h3>
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-5 h-5 ${
                    i < rating ? "text-yellow-400" : "text-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Texto del testimonio */}
          <blockquote className="italic">
            <p>{testimonial}</p>
          </blockquote>

          {/* Logo pequeño */}
          <div className="mt-6 flex justify-end">
            <span>
              <img src="/images/beastmode_wolf_white.png" className="h-7 " />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
