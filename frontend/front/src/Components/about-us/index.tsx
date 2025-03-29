import Image from "next/image";
import { SiGithub, SiLinkedin } from "react-icons/si";

const AboutUs = () => {
  const collaborators = [
    {
      id: 1,
      image: "/images/mm.png",
      name: "Miguel Ángel Adrian Barroeta",
      github: "https://github.com/MiguelAdrian138", // URL personalizada
      hoverColor: "hover:bg-green-700",
    },
    {
      id: 2,
      image: "/img/rene.png",
      name: "Rene Oswaldo Orozco Hernandez",
      linkedin:
        "https://www.linkedin.com/in/rene-oswaldo-orozco-hernandez-626808288",
      github: "https://github.com/Rene-Orozco",
      hoverColor: "hover:bg-red-950",
    },
    {
      id: 3,
      image: "/images/pm.png",
      name: "Pablo Méndez",
      linkedin:
        "https://www.linkedin.com/in/pablo-emilio-m%C3%A9ndez-00b3641b1/",
      github: "https://github.com/PabloEmilioMendez",
      hoverColor: "hover:bg-amber-500",
    },
    {
      id: 4,
      image: "/img/me.png",
      name: "Matias Escobar",
      github: "https://github.com/MatiasGEscobar",
      hoverColor: "hover:bg-blue-900",
    },
    {
      id: 5,
      image: "/img/jd2.png",
      name: "Juan David Meza Rodríguez",
      linkedin: "https://www.linkedin.com/in/judamerro",
      github: "https://github.com/judamerro",
      hoverColor: "hover:bg-emerald-500",
    },
    {
      id: 6,
      image: "/images/avpa.png",
      name: "Andrea Victoria Palacios Aguilera",
      linkedin: "https:www.linkedin.com/in/andrea-palacios-4a504331a",
      github: "https://github.com/AndreaVPalacios",
      hoverColor: "hover:bg-purple-900",
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-white">
      <h1 className="text-red-950 text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-12 md:mb-20 ">
        🚀 Colaboradores 👨‍💻
      </h1>

      <div className="container mx-auto px-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-1 md:gap-2">
          {collaborators.map((collab) => (
            <div
              key={collab.id}
              className="flex flex-col items-center group relative"
            >
              {/* Contenedor de imagen - Tamaño reducido */}
              <div
                className={`relative w-24 h-36 md:w-32 md:h-48 lg:w-36 lg:h-56 overflow-hidden rounded-lg shadow-xl transition-all duration-500 ${collab.hoverColor} group-hover:scale-95`}
              >
                <Image
                  src={collab.image}
                  alt={`Perfil de ${collab.name}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />

                {/* Overlay con iconos (hover) */}
                <div className="absolute inset-0 flex items-end justify-center pb-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {collab.linkedin && (
                    <a
                      href={collab.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shadow-lg transition-colors"
                      aria-label={`LinkedIn de ${collab.name}`}
                    >
                      <div className="bg-white p-1.5 rounded-full">
                        <SiLinkedin className="w-5 h-5 text-[#0077B5]" />
                      </div>
                    </a>
                  )}

                  {collab.github && (
                    <a
                      href={collab.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shadow-lg transition-colors"
                      aria-label={`GitHub de ${collab.name}`}
                    >
                      <div className="bg-white p-1.5 rounded-full">
                        <SiGithub className="w-5 h-5 text-gray-800" />
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Nombre + iconos pequeños */}
              <div className="mt-4 flex flex-col items-center">
                <p className="text-center font-medium text-sm md:text-base px-2">
                  {collab.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
