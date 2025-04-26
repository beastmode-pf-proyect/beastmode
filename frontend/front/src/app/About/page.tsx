"use client";

import Image from "next/image";
import { SiGithub, SiLinkedin } from "react-icons/si";

const About = () => {
  const collaborators = [
    {
      id: 1,
      image: "/images/mm.png",
      name: "Miguel Ángel Adrian Barroeta",
      github: "https://github.com/MiguelAdrian138",
      hoverColor: "hover:bg-green-700",
      role: "Front-End Developer",
      roleColor: "bg-green-100 text-green-800",
    },
    {
      id: 2,
      image: "/images/rene.png",
      name: "Rene Oswaldo Orozco Hernandez",
      linkedin:
        "https://www.linkedin.com/in/rene-oswaldo-orozco-hernandez-626808288",
      github: "https://github.com/Rene-Orozco",
      hoverColor: "hover:bg-gray-700",
      role: "Front-End Developer",
      roleColor: "bg-gray-100 text-gray-800",
    },
    {
      id: 3,
      image: "/images/pm.png",
      name: "Pablo Méndez",
      linkedin:
        "https://www.linkedin.com/in/pablo-emilio-m%C3%A9ndez-00b3641b1/",
      github: "https://github.com/PabloEmilioMendez",
      hoverColor: "hover:bg-amber-500",
      roleColor: "bg-amber-100 text-amber-800",
      role: "Back-End Developer",
    },
    {
      id: 4,
      image: "/img/me.png",
      name: "Matias Escobar",
      github: "https://github.com/MatiasGEscobar",
      hoverColor: "hover:bg-blue-900",
      roleColor: "bg-blue-100 text-blue-800",
      role: "Back-End Developer",
    },
    {
      id: 5,
      image: "/img/jd2.png",
      name: "Juan David Meza Rodríguez",
      linkedin: "https://www.linkedin.com/in/judamerro",
      github: "https://github.com/judamerro",
      hoverColor: "hover:bg-emerald-500",
      roleColor: "bg-emerald-100 text-emerald-800",
      role: "Front-End Developer",
    },
    {
      id: 6,
      image: "/images/avpa.png",
      name: "Andrea Victoria Palacios Aguilera",
      linkedin: "https:www.linkedin.com/in/andrea-palacios-4a504331a",
      github: "https://github.com/AndreaVPalacios",
      hoverColor: "hover:bg-purple-900",
      roleColor: "bg-purple-100 text-purple-800",
      role: "Front-End Developer",
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-purple-600 mb-4">
            Nuestro Equipo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conoce al talentoso equipo detrás de este proyecto
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {collaborators.map((collab) => (
            <div
              key={collab.id}
              className="flex flex-col items-center group px-2"
            >
              {/* Contenedor de imagen circular */}
              <div className="relative w-40 h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 group">
                {/* Imagen circular con borde */}
                <div
                  className={`absolute inset-0 rounded-full border-4 border-white shadow-xl overflow-hidden transition-all duration-500 ${collab.hoverColor} group-hover:scale-105`}
                >
                  <Image
                    src={collab.image}
                    alt={`Perfil de ${collab.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Badge de rol */}
                <div
                  className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${collab.roleColor} text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap shadow-md`}
                >
                  {collab.role}
                </div>
              </div>

              {/* Nombre + iconos estáticos */}
              <div className="mt-8 text-center">
                <h3 className="font-bold text-lg text-gray-800">
                  {collab.name}
                </h3>
                <div className="flex justify-center gap-3 mt-3">
                  {collab.linkedin && (
                    <a
                      href={collab.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0077B5] hover:text-[#005f8c] transition-colors"
                      aria-label={`LinkedIn de ${collab.name}`}
                    >
                      <SiLinkedin className="w-5 h-5" />
                    </a>
                  )}
                  {collab.github && (
                    <a
                      href={collab.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-gray-900 transition-colors"
                      aria-label={`GitHub de ${collab.name}`}
                    >
                      <SiGithub className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
