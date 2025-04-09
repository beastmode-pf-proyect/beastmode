"use client";
import Image from 'next/image';
import React, { useState } from 'react';

function Classes() {
  // Estado 
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mockeando datos de clases con imágenes
  const [classes] = useState([
    { id: 1, name: 'Pierna', description: 'Para tener piernas masisas', image: 'https://i.blogs.es/0e61a5/650_1000_gettyimages_509348187/450_1000.webp' },
    { id: 2, name: 'Pecho', description: 'El pecho plateado', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSglKAdF-BkKA5nXvgBivZSyIpsjj8hwEgmmg&s' },
    { id: 3, name: 'Cuello', description: 'Cuello de 35', image: 'https://hips.hearstapps.com/hmg-prod/images/culturista-cuello-grande-65267df0841d0.jpg?crop=0.7502222222222221xw:1xh;center,top&resize=1200:*' },
    { id: 4, name: 'Zumba Dance', description: 'Baile y ejercicio cardiovascular', image: 'https://statics-cuidateplus.marca.com/cms/images/zumba.jpg' },
    { id: 5, name: 'Boxeo Fitness', description: 'Para cuando te roben', image: 'https://www.radioacktiva.com/wp-content/uploads/2017/02/supongamos-meme-436x291.jpg' },
  ]);

  // filtro de clases
  // Filtrar clases según el término el nombre
  const filteredClasses = classes.filter(clase =>
    clase.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-[#5e1914]">Clases</h2>
      <p className="mt-4 text-[#5e1914]">
        Explora nuestro catálogo de clases y comienza tu aprendizaje.
      </p>
      
      {/* Barra de búsqueda */}
      <div className="mt-6 mb-8">
        <input
          type="text"
          placeholder="Buscar por nombre de clase..."
          className="w-full md:w-1/2 p-3 border border-[#5e1914] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e1914]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Mostrar mensaje si no hay resultados */}
      {filteredClasses.length === 0 && (
        <p className="text-[#5e1914] text-center mt-8">No se encontraron clases con ese nombre</p>
      )}
      
      {/* Grid de clases */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((clase) => (
          <div key={clase.id} className="bg-[#ffffff] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 bg-[#7a7a7a] flex items-center justify-center">
              <Image src={clase.image} alt={`Imagen de ${clase.name}`} className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl text-[#5e1914] font-semibold mb-2">{clase.name}</h3>
              <p className="text-[#5e1914] mb-4">
                {clase.description}
              </p>
              <button className="bg-[#5e1914] hover:bg-[#7a2a22] text-white px-4 py-2 rounded-md transition duration-300">
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
