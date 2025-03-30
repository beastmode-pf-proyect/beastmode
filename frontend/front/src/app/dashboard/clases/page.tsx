import React from 'react';

function Classes() {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-[#5e1914]">Clases</h2>
      <p className="mt-4 text-[#5e1914]">
        Explora nuestro catálogo de clases y comienza tu aprendizaje.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Example class cards */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-[#ffffff] rounded-lg overflow-hidden shadow-lg">
            <div className="h-48 bg-[#7a7a7a]"></div>
            <div className="p-6">
              <h3 className="text-xl text-[#5e1914] font-semibold mb-2">Clase {item}</h3>
              <p className="text-[#5e1914] mb-4">
                Descripción breve de la clase y sus objetivos principales.
              </p>
              <button className="bg-[#ffffff] hover:bg-[#a0a0a0] text-[#5e1914] px-4 py-2 rounded-md transition duration-300">
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Classes;