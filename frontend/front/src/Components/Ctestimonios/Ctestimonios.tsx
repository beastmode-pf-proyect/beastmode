"use client";

import React, { ReactElement, useState, useEffect } from "react";
import testimonios from "./testimonios";
import Image from "next/image";

/* 
    📌 Componente Ctestimonios
    - Muestra tarjetas con testimonios de clientes de forma aleatoria.
    - Se puede alternar entre una vista reducida (6 testimonios aleatorios) 
      y una vista extendida (todos los testimonios).
    - Los testimonios en la vista reducida se actualizan automáticamente cada minuto.
*/

export const Ctestimonios: React.FC = (): ReactElement => {
    // Estado para almacenar los testimonios aleatorios
    const [listaTestimonios, setListaTestimonios] = useState<any[]>([]);
    
    // Estado para controlar la visibilidad de todos los testimonios
    const [visible, setVisible] = useState(false);

    /*
        🔄 useEffect:
        - Se ejecuta una vez al montar el componente.
        - Inicializa el estado con 6 testimonios aleatorios.
        - Configura un intervalo para actualizar los testimonios cada 60 segundos.
        - Limpia el intervalo al desmontar el componente.
    */
    useEffect(() => {
        setListaTestimonios(sacarTestimoniosRandom());

        const intervalo = setInterval(() => {
            setListaTestimonios(sacarTestimoniosRandom());
        }, 60000); // 60 segundos

        return () => clearInterval(intervalo);
    }, []);

    /*
        🎲 Función para obtener testimonios aleatorios:
        - Copia el array original para evitar modificarlo directamente.
        - Mezcla aleatoriamente los elementos.
        - Retorna los primeros 6 testimonios de la lista mezclada.
    */
    function sacarTestimoniosRandom() {
        const copiaTestimonios = [...testimonios];
        copiaTestimonios.sort(() => Math.random() - 0.5);
        return copiaTestimonios.slice(0, 6);
    }

    /*
        👁 Función para alternar la visibilidad:
        - Si `visible` es `true`, se muestran todos los testimonios.
        - Si `visible` es `false`, se muestran solo 6 testimonios aleatorios.
    */
    function mostrar() {
        setVisible(!visible);
    }

    return (
        <>
            {/* Sección de testimonios */}
            {visible ? (
                // Vista con TODOS los testimonios
                <div className="ml-5 mr-5 mt-14 flex justify-center items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pt-6 pb-16">
                        {testimonios.map((elemento, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 shadow-lg rounded-xl p-5 flex flex-col items-center text-center w-60 transition-all duration-300 transform hover:scale-105 hover:bg-gray-200"
                            >
                                {/* Imagen del cliente */}
                                <Image
                                    src={elemento.imagen}
                                    alt={`Imagen de ${elemento.nombre}`}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 rounded-full object-cover mb-3"
                                />
                                {/* Nombre del cliente */}
                                <h3 className="text-lg font-semibold">{elemento.nombre}</h3>
                                {/* Descripción del testimonio */}
                                <p className="text-sm text-gray-600">{elemento.descripcion}</p>
                                {/* Calificación en estrellas */}
                                <p className="mt-2 text-yellow-500 text-base">⭐ {elemento.calificacion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Vista con 6 testimonios aleatorios
                <div className="ml-5 mr-5 mt-14 flex justify-center items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pt-6 pb-16">
                        {listaTestimonios.length > 0 ? (
                            listaTestimonios.map((elemento, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 shadow-lg rounded-xl p-5 flex flex-col items-center text-center w-60 transition-all duration-300 transform hover:scale-105 hover:bg-gray-200"
                                >
                                    {/* Imagen del cliente */}
                                    <Image
                                        src={elemento.imagen}
                                        alt={`Imagen de ${elemento.nombre}`}
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 rounded-full object-cover mb-3"
                                    />
                                    {/* Nombre del cliente */}
                                    <h3 className="text-lg font-semibold">{elemento.nombre}</h3>
                                    {/* Descripción del testimonio */}
                                    <p className="text-sm text-gray-600">{elemento.descripcion}</p>
                                    {/* Calificación en estrellas */}
                                    <p className="mt-2 text-yellow-500 text-base">⭐ {elemento.calificacion}</p>
                                </div>
                            ))
                        ) : (
                            // Mensaje de carga mientras se obtienen los testimonios
                            <p className="text-center col-span-full">Cargando testimonios...</p>
                        )}
                    </div>
                </div>
            )}

            {/* Botón para alternar entre "Mostrar Más" y "Mostrar Menos" */}
            <div className="flex justify-center mt-6">
                <button
                    className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-5 py-3 rounded-md text-lg transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]"
                    onClick={mostrar}
                >
                    {visible ? "Mostrar Menos" : "Mostrar Más"}
                </button>
            </div>
        </>
    );
};

export default Ctestimonios;
