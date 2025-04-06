import React from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import Ctestimonios from "@/Components/Ctestimonios";
import Carrusel from "@/Components/Carrusel inicio/carrusel";
import MembershipSection from "@/Components/memberships/memberships";

const Home: React.FC = () => {
  return (
    <div className="bg-white">
      <Carrusel />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4 sm:px-8 lg:px-16 -mt-32 md:-mt-40 lg:-mt-48">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
          Transforma tu cuerpo, transforma tu vida.
        </h1>
      </div>

      <section className="bg-[length:150px_150px] bg-[radial-gradient(circle_at_15%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_50%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_15%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_70%,transparent_40%,#d1bdbd_41%),linear-gradient(45deg,#d1bdbd_25%,rgba(0,0,0,0.067)_0,rgba(0,0,0,0.067)_50%,#d1bdbd_0,#d1bdbd_75%,#1111_0,#1111_100%,#d1bdbd_0)] mt-18 py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center text-red-950">
            Nuestros Planes
          </h2>
          <div className="mt-1">
            <MembershipSection />
          </div>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-64 md:h-auto">
            <Image
              src="/images/goals.jpg"
              alt="About Us"
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-red-950">
              Sobre Nosotros
            </h2>
            <p className="text-gray-700 text-lg sm:text-xl mb-6">
              En BeastMode Gym, nos enfocamos en brindarte una experiencia de
              entrenamiento personalizada y efectiva. Nuestro objetivo es
              ayudarte a alcanzar tus metas físicas y emocionales, sin importar
              tu nivel de experiencia.
            </p>
            <a
              href="/Goals"
              className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors duration-300">
              Conoce más <FaArrowRight className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center text-red-950">
            Lo que dicen nuestros miembros
          </h2>
          <Ctestimonios />
        </div>
      </section>
    </div>
  );
};

export default Home;
