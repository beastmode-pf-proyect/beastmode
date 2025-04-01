
import Carrusel from "@/Components/Carrusel inicio/carrusel";
import GymCarousel from "@/Components/carrusel-gym/carruselpics";
import AboutUs from "@/Components/intro-about_us/aboutus";
import MembershipSection from "@/Components/memberships/memberships";
import Phrase from "@/Components/phrase/phrase";
import TestimonialsSection from "@/Components/testimonies/testimonials";

const Landing = () => {
  return (
    <div>
      <Carrusel />
      <AboutUs />

      <GymCarousel />

      <Phrase />

      <MembershipSection />

      <TestimonialsSection />
    </div>
  );
};

export default Landing;


