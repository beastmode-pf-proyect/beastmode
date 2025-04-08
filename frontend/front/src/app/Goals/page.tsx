import Image from "next/image";

const GoalsPage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-screen md:h-[500px]">
        <div className="absolute inset-0 bg-[url('/images/goalsimg.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-red-600">Beast</span>Mode Gym
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-3xl">
            Más que un gimnasio, un movimiento que transforma vidas
          </p>
        </div>
      </div>

      {/* Misión Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <Image
                src="/images/gym000.png"
                alt="Misión BeastMode Gym"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <span className="text-3xl">🔥</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    MISIÓN
                  </h2>
                </div>
                <p className="text-xs md:text-xl text-gray-700 leading-relaxed">
                  En BeastMode Gym, nuestra misión es transformar vidas a través
                  del entrenamiento personalizado, la comunidad y la
                  accesibilidad. No solo queremos ayudarte a alcanzar tus metas
                  físicas, sino también empoderarte para que adoptes un estilo
                  de vida más saludable y activo, tanto dentro como fuera del
                  gimnasio. Con planes adaptados a tus necesidades, tecnología
                  innovadora y un equipo de profesionales comprometidos,
                  rompemos las barreras del fitness tradicional para que
                  cualquier persona, sin importar su nivel o personalidad,
                  encuentre aquí su lugar.{" "}
                  <span className="font-semibold text-red-600">
                    Aquí no solo entrenas: evolucionas.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visión Section */}
      <section className="py-16 md:py-24 bg-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            <div className="lg:w-1/2">
              <Image
                src="/images/goals2.png"
                alt="Visión BeastMode Gym"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <span className="text-3xl">🚀</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    VISIÓN
                  </h2>
                </div>
                <p className="text-sm md:text-xl text-gray-700 leading-relaxed">
                  Ser el gimnasio líder en transformación integral, reconocido
                  por crear una comunidad unida, motivada y con resultados
                  reales. Queremos que BeastMode Gym sea sinónimo de superación,
                  inclusión y bienestar, donde cada miembro se sienta parte de
                  algo más grande.{" "}
                  <span className="font-semibold text-purple-600">
                    Nos proyectamos como un espacio innovador
                  </span>{" "}
                  que combina lo mejor del entrenamiento presencial y digital,
                  con programas accesibles y un enfoque humano. Nuestra meta es
                  inspirar a una generación más fuerte, sana y segura de sí
                  misma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Nuestros <span className="text-red-600">Valores</span> Fundamentales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💪",
                title: "Pasión",
                description:
                  "Amamos lo que hacemos y eso se refleja en cada entrenamiento.",
              },
              {
                icon: "🤝",
                title: "Comunidad",
                description:
                  "Creemos en el poder de entrenar juntos y apoyarnos mutuamente.",
              },
              {
                icon: "✨",
                title: "Excelencia",
                description:
                  "Buscamos la mejor versión en todo lo que hacemos.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GoalsPage;
