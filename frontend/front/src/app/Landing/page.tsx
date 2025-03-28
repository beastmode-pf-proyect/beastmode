import GymCarousel from "@/Components/carrusel-gym/carruselpics";
import AboutUs from "@/Components/intro-about_us/aboutus";
import MembershipSection from "@/Components/memberships/memberships";
import Phrase from "@/Components/phrase/phrase";
import TestimonialsSection from "@/Components/testimonies/testimonials";

const LandingPage = () => {
  return (
    <div>
      <header>
        <div
          style={{
            backgroundImage: "url('/images/landingpage.png')",
            backgroundSize: "cover",
            width: "screen",
            position: "relative",
            height: "100vh",
          }}
        ></div>
      </header>

      <AboutUs />

      <GymCarousel />

      <Phrase />

      <MembershipSection />

      <TestimonialsSection />
    </div>
  );
};

export default LandingPage;
