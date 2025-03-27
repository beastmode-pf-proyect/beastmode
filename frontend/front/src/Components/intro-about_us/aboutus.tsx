const AboutUs = () => {
  return (
    <div className="relative bg-[url('/images/bg-aboutus4.png')] bg-cover bg-center h-80 ">
      <div className="relative z-10 text-black text-center p-16">
        <div className=" rounded-4xl bg-gray-50 shadow-2xl p-11">
          <h1 className="text-4xl font-bold">¿Quiénes somos y Qué hacemos?</h1>
          <p className="mt-4">
            En BeastMode Gym, nos importas. Por eso, ofrecemos una atención
            personalizada y cercana, tanto si entrenas presencialmente como
            desde casa. Nuestro objetivo es simple: que tu calidad de vida
            mejore dentro y fuera del gym, sin que eso afecte tu bolsillo.
          </p>
          <p className="font-bold">
            ¡Por eso tenemos descuentos pensados para ti!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
