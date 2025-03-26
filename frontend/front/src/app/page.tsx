import Image from "next/image";
import MembershipSection from "../../components/memberships/memberships";
import Line from "../../components/line_decoration";
import AboutUs from "../../components/intro-about_us/aboutus";
import GymCarousel from "../../components/carrusel-gym/carruselpics";
import Phrase from "../../components/phrase/phrase";
import TestimonialsSection from "../../components/testimonies/testimonials";

export default function Home() {
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
}
