import React from 'react';

function Membership() {
  const plans = [
    {
      name: 'Básico',
      price: '29.99',
      features: ['Acceso a clases básicas', 'Soporte por email', 'Recursos descargables'],
    },
    {
      name: 'Premium',
      price: '49.99',
      features: ['Acceso a todas las clases', 'Soporte prioritario', 'Recursos exclusivos', 'Mentorías mensuales'],
    },
    {
      name: 'Pro',
      price: '99.99',
      features: ['Todo lo de Premium', 'Clases en vivo', 'Certificaciones', 'Acceso de por vida'],
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-semibold text-[#5e1914]">Membresía</h2>
      <p className="mt-4 text-[#c76d69a7]">
        Elige el plan que mejor se adapte a tus necesidades.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-[#ffffff] text-[#5e1914] rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl text-[#5e1914] font-bold mb-4">{plan.name}</h3>
            <div className="text-3xl font-bold mb-6">
              ${plan.price}<span className="text-sm text-[#5e1914]">/mes</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full bg-[#5e1914] hover:bg-[#d67979] text-white py-2 rounded-md transition duration-300">
              Seleccionar Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Membership;