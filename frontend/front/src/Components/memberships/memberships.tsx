const MembershipSection = () => {
  return (
    <div className="grid grid-cols-2 p-20 gap-16">
      <div className="border-2 rounded-4xl bg-transparent shadow-2xl h-80 pl-2">
        <p className="text-black text-2xl flex justify-start pl-5 pt-5 font-light">
          NOVATO
        </p>
        <p className="text-red-950 text-4xl pl-5 pt-1 font-extrabold font-[Inter]">
          $39<span className="text-xl">/al mes</span>
        </p>
        <ul className="text-black pl-5 text-sm">
          <li className="pt-2">
            ✅ Entrena en casa – Videos profesionales con ejercicios guiados.
          </li>
          <li className="pt-2">
            ✅ 10% OFF en clases grupales (spinning, pilates, zumba, etc).
          </li>
          <li className="pt-2">
            ✅ Plan alimenticio 7 días adaptado a tus metas (bulking o cutting).
          </li>
          <li className="pt-2">
            ✅ 20% OFF en tu membresía por traer a un amigo.
          </li>
        </ul>

        <div className="flex justify-center pt-8">
          <button className="bg-transparent text-red-950 border-2 rounded-3xl border-red-950 px-44 py-1.5 hover:bg-red-950 hover:text-white cursor-pointer">
            Get Started
          </button>
        </div>
      </div>

      <div className="border-2 rounded-4xl bg-transparent shadow-2xl h-96 pl-2">
        <p className="text-black text-2xl flex justify-start pl-5 pt-5 font-light ">
          PRO
        </p>
        <p className="text-red-950 text-4xl pl-5 pt-1 font-extrabold font-[Inter]">
          $89<span className="text-xl">/al mes</span>
        </p>
        <ul className="text-black pl-5 text-sm ">
          <li className="pt-2 font-light">
            ⚡ Entrena en casa – Videos profesionales con ejercicios guiados.
          </li>
          <li className="pt-2 font-light">
            ⚡ 10% OFF en clases grupales (spinning, pilates, zumba, etc).
          </li>
          <li className="pt-2 font-light">
            ⚡ Plan alimenticio 7 días adaptado a tus metas (bulking o cutting).
          </li>
          <li className="pt-2 font-light">
            ⚡ 20% OFF en tu membresía por traer a un amigo.
          </li>
          <li className="pt-2 font-medium">
            ⚡ 25% OFF en suplementos deportivos.
          </li>
          <li className="pt-2 font-medium">
            ⚡ Entrenador personal 24/7 – Soporte constante.
          </li>
          <li className="pt-2 font-medium">⚡ Evaluación médica completa</li>
        </ul>
        <div className="flex justify-center pt-5">
          <button className="bg-transparent text-red-950 border-2 rounded-3xl border-red-950 px-44 py-1.5 hover:bg-red-950 hover:text-white cursor-pointer">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipSection;
