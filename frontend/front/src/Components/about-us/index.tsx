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

      <h1 className="text-red-950  flex justify-center mt-16 text-5xl font-bold">
        🚀 Colaboradores 👨‍💻
      </h1>

      <section className=" text-black z-50 flex justify-center mt-20">
        <div className="grid grid-cols-6 grid-rows-1 gap-8 items-center text-center text-sm mx-10">
          <div>
            <div className=" ml-1 absolute w-48 h-80 overflow-hidden z-10 shadow-2xl hover:bg-green-700 hover:transition-colors hover:scale-95 duration-500">
              <Image
                src={"/images/mm.png"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <p className="mt-80 font-medium">Miguel Ángel Adrian Barroeta</p>
          </div>
          <div>
            <div className="  absolute w-48 h-80 overflow-hidden z-10 shadow-2xl hover:bg-red-950 hover:transition-colors hover:scale-95 duration-500">
              <Image
                src={"/img/rene.png"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <p className="mt-80 font-medium">Rene Oswaldo Orozco Hernandez</p>
          </div>
          <div>
            <div className=" mr-2 absolute w-48 h-80 overflow-hidden z-10 shadow-2xl hover:bg-amber-500 hover:transition-colors hover:scale-95 duration-500">
              <Image
                src={"/images/pm.png"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <p className="mt-80 font-medium">Pablo Méndez</p>
          </div>
          <div>
            <div className="  absolute w-48 h-80 overflow-hidden z-10 shadow-2xl hover:bg-blue-900 hover:transition-colors hover:scale-95 duration-500">
              <Image
                src={"/img/me.png"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <p className="mt-80 font-medium">Matias Escobar</p>
          </div>
          <div>
            <div className="  absolute w-48 h-80 overflow-hidden z-10 shadow-2xl hover:bg-emerald-500 hover:transition-colors hover:scale-95 duration-500 ">
              <Image
                src={"/img/jd2.png"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <p className="mt-80 font-medium">Juan David Meza Rodríguez</p>
          </div>
          <div>
            <div className="  absolute w-48 h-80 overflow-hidden z-10 shadow-2xl hover:bg-purple-900 hover:transition-colors hover:scale-95 duration-500">
              <Image
                src={"/images/avpa.png"}
                alt={`Perfil`}
                fill
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <p className="mt-80 font-medium">
              Andrea Victoria Palacios Aguilera
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
