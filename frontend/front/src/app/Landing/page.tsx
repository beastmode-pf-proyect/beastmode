"use client"
import Carrusel from "@/Components/Carrusel inicio/carrusel";
import GymCarousel from "@/Components/carrusel-gym/carruselpics";
import Ctestimonios from "@/Components/Ctestimonios/Ctestimonios";
import AboutUs from "@/Components/intro-about_us/aboutus";
import MembershipSection from "@/Components/memberships/memberships";
import Phrase from "@/Components/phrase/phrase";
import { useEffect, useState } from "react";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      {/* Skeleton Carrusel */}
      <div className="h-[600px] bg-gray-200 w-full" />
      
      {/* Skeleton AboutUs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20">
        <div className="h-8 bg-gray-200 w-1/3 mb-4 rounded" />
        <div className="h-4 bg-gray-200 w-full mb-2 rounded" />
        <div className="h-4 bg-gray-200 w-4/5 mb-6 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Skeleton Memberships */}
      <div className="bg-gray-100 py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 w-1/4 mb-8 rounded mx-auto" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl shadow">
                <div className="h-6 bg-gray-200 w-1/4 mb-4 rounded" />
                <div className="h-10 bg-gray-200 w-1/2 mb-4 rounded" />
                <div className="h-4 bg-gray-200 w-full mb-2 rounded" />
                <div className="h-4 bg-gray-200 w-4/5 mb-6 rounded" />
                <div className="h-12 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton GymCarousel */}
      <div className="h-96 bg-gray-200 w-full" />

      {/* Skeleton Phrase */}
      <div className="py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-6 bg-gray-200 w-1/2 mx-auto mb-4 rounded" />
          <div className="h-4 bg-gray-200 w-3/4 mx-auto rounded" />
        </div>
      </div>

      {/* Skeleton Testimonios */}
      <div className="bg-gray-100 py-20 px-4 sm:px-8 lg:px-16">
        <div className="h-8 bg-gray-200 w-1/3 mx-auto mb-8 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 bg-white rounded-xl">
              <div className="h-4 bg-gray-200 w-full mb-3 rounded" />
              <div className="h-4 bg-gray-200 w-4/5 mb-6 rounded" />
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full" />
                <div className="ml-4">
                  <div className="h-4 bg-gray-200 w-24 mb-2 rounded" />
                  <div className="h-3 bg-gray-200 w-16 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div>
      <Carrusel />
      <AboutUs />

      <section className="bg-[length:150px_150px] bg-[radial-gradient(circle_at_15%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_50%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_15%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_70%,transparent_40%,#d1bdbd_41%),linear-gradient(45deg,#d1bdbd_25%,rgba(0,0,0,0.067)_0,rgba(0,0,0,0.067)_50%,#d1bdbd_0,#d1bdbd_75%,#1111_0,#1111_100%,#d1bdbd_0)]  py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="mt-1">
            <MembershipSection />
          </div>
        </div>
      </section>

      <GymCarousel />
      <Phrase />

      <section className=" bg-[length:150px_150px] bg-[radial-gradient(circle_at_15%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_50%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_15%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_70%,transparent_40%,#d1bdbd_41%),linear-gradient(45deg,#d1bdbd_25%,rgba(0,0,0,0.067)_0,rgba(0,0,0,0.067)_50%,#d1bdbd_0,#d1bdbd_75%,#1111_0,#1111_100%,#d1bdbd_0)]  py-20 px-4 sm:px-8 lg:px-16">
        <div className="">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center text-red-950">
            Lo que dicen nuestros miembros
          </h2>
          <Ctestimonios  />
        </div>
      </section>
    </div>
  );
};

export default Landing;