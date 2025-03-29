import Image from "next/image";

const AboutUs = () => {
  const collaborators = [
    {
      id: 1,
      image: "/images/mm.png",
      name: "Miguel Ángel Adrian Barroeta",
      hoverColor: "hover:bg-green-700",
    },
    {
      id: 2,
      image: "/img/rene.png",
      name: "Rene Oswaldo Orozco Hernandez",
      hoverColor: "hover:bg-red-950",
    },
    {
      id: 3,
      image: "/images/pm.png",
      name: "Pablo Méndez",
      hoverColor: "hover:bg-amber-500",
    },
    {
      id: 4,
      image: "/img/me.png",
      name: "Matias Escobar",
      hoverColor: "hover:bg-blue-900",
    },
    {
      id: 5,
      image: "/img/jd2.png",
      name: "Juan David Meza Rodríguez",
      hoverColor: "hover:bg-emerald-500",
    },
    {
      id: 6,
      image: "/images/avpa.png",
      name: "Andrea Victoria Palacios Aguilera",
      hoverColor: "hover:bg-purple-900",
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-white">
      {/* Título */}
      <h1 className="text-red-950 text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-12 md:mb-20 px-4">
        🚀 Colaboradores 👨‍💻
      </h1>

      {/* Grid de colaboradores */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 md:gap-12">
          {collaborators.map((collab) => (
            <div
              key={collab.id}
              className="flex flex-col items-center group relative"
            >
              {/* Contenedor de imagen con efecto hover */}
              <div
                className={`relative w-32 h-48 md:w-40 md:h-60 lg:w-48 lg:h-80 overflow-hidden rounded-lg shadow-xl transition-all duration-500 ${collab.hoverColor} group-hover:scale-95`}
              >
                <Image
                  src={collab.image}
                  alt={`Perfil de ${collab.name}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
              </div>

              {/* Nombre */}
              <p className="mt-4 md:mt-6 text-center font-medium text-sm md:text-base lg:text-lg px-2">
                {collab.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
