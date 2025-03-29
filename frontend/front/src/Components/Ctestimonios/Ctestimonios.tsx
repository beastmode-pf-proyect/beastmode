"use client"

import React, { ReactElement, useState, useEffect } from "react";

// importamos testimonios harcodeados
import testimonios from "./testimonios";

// importamos Image para poder usar las imágenes
import Image from "next/image";

/* Componente que muestra testimonios aleatorios de clientes.
Se actualiza automáticamente cada minuto para mostrar un nuevo conjunto de testimonios. */
export const Ctestimonios: React.FC = (): ReactElement => {
    // Estado para almacenar los testimonios aleatorios
    const [listaTestimonios, setListaTestimonios] = useState<any[]>([]);

    useEffect(() => {
        // Inicializa el estado con testimonios aleatorios
        setListaTestimonios(sacarTestimoniosRandom());

        // Configura un intervalo para actualizar los testimonios cada minuto
        const intervalo = setInterval(() => {
            setListaTestimonios(sacarTestimoniosRandom());
        }, 60000); // 1 minuto

        // Limpieza del intervalo cuando el componente se desmonta
        return () => clearInterval(intervalo);
    }, []);

    /*
    Obtiene un subconjunto aleatorio de testimonios.
    @returns {Array} Un arreglo con seis testimonios seleccionados aleatoriamente.
    */
    function sacarTestimoniosRandom() {
        const copiaTestimonios = [...testimonios]; // Copia del array original para no mutarlo
        copiaTestimonios.sort(() => Math.random() - 0.5); // Mezcla aleatoriamente el array
        return copiaTestimonios.slice(0, 6); // Devuelve los primeros seis elementos
    }

    return (
        <>
            <div className="ml-5 mr-5 mt-14 flex justify-center items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 pt-6 pb-16">
                    {/* Verifica si hay testimonios disponibles */}
                    {listaTestimonios.length > 0 ? (
                        listaTestimonios.map((elemento, index) => (
                            <div key={index} className="bg-gray-100 shadow-md rounded-lg p-3 flex flex-col items-center text-center w-44 transition-all duration-300 transform hover:scale-105 hover:bg-gray-200">
                                {/* Imagen del testimonio */}
                                <Image
                                    src={elemento.imagen}
                                    alt={`Imagen de ${elemento.nombre}`}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-full object-cover mb-2" />
                                {/* Nombre del cliente */}
                                <h3 className="text-sm font-semibold">{elemento.nombre}</h3>
                                {/* Descripción del testimonio */}
                                <p className="text-xs text-gray-600">{elemento.descripcion}</p>
                                {/* Calificación en estrellas */}
                                <p className="mt-1 text-yellow-500 text-sm">⭐ {elemento.calificacion}</p>
                            </div>


                        ))

                    ) : (
                        // Mensaje de carga mientras se obtienen los testimonios
                        <p className="text-center col-span-full">Cargando testimonios...</p>
                    )}
                </div>
            </div>

            {/* Contenedor del botón para asegurarse de que se muestre debajo */}
            <div className="flex justify-center">
                <button className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]">
                    Mostrar Todos
                </button>
            </div>
        </>
    );
};

export default Ctestimonios;
