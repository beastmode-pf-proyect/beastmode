const AboutUs = () => {
  return (
    <div className="relative bg-[url('/images/bg-aboutus4.png')] bg-cover bg-center bg-no-repeat min-h-[500px] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      {/* Overlay para mejor legibilidad */}
      <div className="absolute inset-0  z-0"></div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-12 shadow-2xl border border-white/20">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-purple-600">
              ¿Quiénes somos y Qué hacemos?
            </span>
          </h1>

          <div className="space-y-6 text-lg md:text-xl text-gray-800">
            <p className="leading-relaxed">
              En{" "}
              <span className="font-semibold text-red-600">BeastMode Gym</span>,
              nos importas. Por eso, ofrecemos una atención personalizada y
              cercana, tanto si entrenas presencialmente como desde casa.
              Nuestro objetivo es simple:{" "}
              <span className="font-medium">
                que tu calidad de vida mejore dentro y fuera del gym
              </span>
              , sin que eso afecte tu bolsillo.
            </p>

            <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-purple-600">
              ¡Por eso tenemos descuentos pensados especialmente para ti!
            </p>
          </div>

          {/* Botón de CTA */}
          
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
