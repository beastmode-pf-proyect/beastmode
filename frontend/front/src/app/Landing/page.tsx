
import Carrusel from "@/Components/Carrusel inicio/carrusel";
import GymCarousel from "@/Components/carrusel-gym/carruselpics";
import Ctestimonios from "@/Components/Ctestimonios";
import AboutUs from "@/Components/intro-about_us/aboutus";
import MembershipSection from "@/Components/memberships/memberships";
import Phrase from "@/Components/phrase/phrase";

const Landing = () => {
  return (
    <div>
      <Carrusel />
      <AboutUs />

      <GymCarousel />

      <Phrase />

      <section className="bg-[length:150px_150px] bg-[radial-gradient(circle_at_15%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_50%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_15%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_70%,transparent_40%,#d1bdbd_41%),linear-gradient(45deg,#d1bdbd_25%,rgba(0,0,0,0.067)_0,rgba(0,0,0,0.067)_50%,#d1bdbd_0,#d1bdbd_75%,#1111_0,#1111_100%,#d1bdbd_0)]  py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center text-red-950">
            Nuestros Planes
          </h2>
          <div className="mt-1">
            <MembershipSection />
          </div>
        </div>
      </section>
      <section className=" bg-[length:150px_150px] bg-[radial-gradient(circle_at_15%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_30%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_50%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_15%_70%,transparent_40%,#d1bdbd_41%),radial-gradient(circle_at_85%_70%,transparent_40%,#d1bdbd_41%),linear-gradient(45deg,#d1bdbd_25%,rgba(0,0,0,0.067)_0,rgba(0,0,0,0.067)_50%,#d1bdbd_0,#d1bdbd_75%,#1111_0,#1111_100%,#d1bdbd_0)]  py-20 px-4 sm:px-8 lg:px-16">
        <div className="">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center text-red-950">
            Lo que dicen nuestros miembros
          </h2>
          <Ctestimonios />
        </div>
      </section>
    </div>
  );
};

export default Landing;


