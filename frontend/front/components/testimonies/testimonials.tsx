import TestimonialsCarousel from "./testimonialsCard";
import TestimonialCard from "./testimonialsCard";

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-[url(/images/bannergym.png)] bg-cover bg-center px-10">
      <div className="container mx-auto px-4 z-50">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-white">
          Testimonios de nuestros miembros
        </h2>

        <TestimonialsCarousel />
      </div>
    </section>
  );
};

export default TestimonialsSection;
