import Image from "next/image";

const AboutUs = () => {
  return (
    <div>
      {/* <video
        src="/images/aboutus/fondo2.mp4"
        autoPlay
        muted
        loop
        className="absolute object-cover w-full h-screen z-10"
      /> */}

      <h1 className="text-red-950  flex justify-center mt-16 text-5xl">
        Colaboradores
      </h1>

      <section className="absolute text-black z-50 flex justify-center mt-20">
        <div className="grid grid-cols-6 grid-rows-1 gap-8 items-center text-center text-sm mx-10">
          <div>
            <div className="mt-14 ml-1 absolute w-48 h-80 overflow-hidden z-10 shadow-2xl hover:bg-green-700 hover:transition-colors duration-500">
              <Image
                src={"/images/carnet-avpa.png"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <p className="mt-96">Miguel Angel Adrian Barroeta</p>
          </div>
          <div>
            <div className="mt-14  absolute w-48 h-80 overflow-hidden z-10 shadow-2xl hover:bg-red-950 hover:transition-colors duration-500">
              <Image
                src={"/images/carnet-avpa.png"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <p className="mt-96">Rene Oswaldo Orozco Hernandez</p>
          </div>
          <div>
            <div className="mt-14 mr-2 absolute w-48 h-80 overflow-hidden z-10 shadow-2xl hover:bg-amber-500 hover:transition-colors duration-500">
              <Image
                src={"/images/carnet-avpa.png"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <p className="mt-96">Pablo Mendez</p>
          </div>
          <div>
            <div className="mt-14  absolute w-48 h-80 overflow-hidden z-10 shadow-2xl hover:bg-blue-900 hover:transition-colors duration-500">
              <Image
                src={"/images/me.png"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <p className="mt-96">Matias Escobar</p>
          </div>
          <div>
            <div className="mt-14  absolute w-48 h-80 overflow-hidden z-10 shadow-2xl hover:bg-emerald-500 hover:transition-colors duration-500">
              <Image
                src={"/images/jd.png"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <p className="mt-96">Juan David Meza Rodriguez</p>
          </div>
          <div>
            <div className="mt-14  absolute w-48 h-80 overflow-hidden z-10 shadow-2xl hover:bg-purple-900 hover:transition-colors duration-500">
              <Image
                src={"/images/avpa.png"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <p className="mt-96">Andrea Victoria Palacios Aguilera</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

{
  /* <div className="mt-32 ml-16 absolute w-48 h-80  border-[#5E1914] overflow-hidden z-10 shadow-2xl">
              <Image
                src={"/images/carnet-avpa.jpg"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div> */
}
