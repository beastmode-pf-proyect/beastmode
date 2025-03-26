import TestimonialCard from "./testimonialsCard";

const TestimonialsSection = () => {
  return (
    <section className="py-12 bg-[url(/images/bannergym.png)] bg-cover bg-center">
      <div className="container mx-auto px-4 z-50">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-white">
          Testimonios de nuestros miembros
        </h2>

        <div className="space-y-8">
          <TestimonialCard
            selfieUrl="/images/testimonies/testimonio1.jpg"
            profileUrl="/profiles/perfil1.jpg"
            name="Virginia SanHouse"
            rating={5}
            testimonial="Increíble transformación en solo 3 meses. Los entrenadores son expertos y el ambiente es motivador. ¡Lo recomiendo 100%!"
          />

          <TestimonialCard
            selfieUrl="/images/testimonies/tetimonio6.jpg"
            profileUrl="/profiles/perfil2.jpg"
            name="Carlos Rodríguez"
            rating={4}
            testimonial="El mejor gimnasio al que he asistido. Equipos de primera y rutinas personalizadas. BeastMode Gym cambió mi vida."
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
