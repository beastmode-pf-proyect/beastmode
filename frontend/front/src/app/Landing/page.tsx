import GymCarousel from "@/Components/carrusel-gym/carruselpics";
import AboutUs from "@/Components/intro-about_us/aboutus";
import MembershipSection from "@/Components/memberships/memberships";
import Phrase from "@/Components/phrase/phrase";
import TestimonialsSection from "@/Components/testimonies/testimonials";

const Landing = () => {
  return (
    <div>
      <div className="relative h-screen w-full">
        {/* Imagen para móviles */}
        <div
          className="absolute inset-0 bg-cover bg-center md:hidden"
          style={{ backgroundImage: "url('/images/landing-phone.png')" }}
        ></div>
        {/* Imagen para tablets */}
        <div
          className="absolute inset-0 bg-cover bg-center hidden md:block lg:hidden"
          style={{ backgroundImage: "url('/images/landing_res.png')" }}
        ></div>

        {/* Imagen para desktop */}
        <div
          className="absolute inset-0 bg-cover bg-center hidden lg:block"
          style={{
            backgroundImage: "url('/images/landingpage1.png')",
          }}
        ></div>
      </div>
      <AboutUs />

      <GymCarousel />

      <Phrase />

      <MembershipSection />

      <TestimonialsSection />
    </div>
  );
};

export default Landing;
