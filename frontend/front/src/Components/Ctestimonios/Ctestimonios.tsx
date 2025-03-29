"use client"

import React, { ReactElement, useState, useEffect } from "react";
import testimonios from "./testimonios";
import Image from "next/image";

export const Ctestimonios: React.FC = (): ReactElement => {
    const [testimoniosAleatorios, setTestimoniosAleatorios] = useState<any[]>([]);

    useEffect(() => {
        setTestimoniosAleatorios(obtenerAleatorios());

        const intervalo = setInterval(() => {
            setTestimoniosAleatorios(obtenerAleatorios());
        }, 60000); // 1 minuto

        return () => clearInterval(intervalo);
    }, []);

    function obtenerAleatorios() {
        const copia = [...testimonios];
        copia.sort(() => Math.random() - 0.5);
        return copia.slice(0, 6);
    }

    return (
        <>
            <div className="ml-5 mr-5 mt-14 flex justify-center items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 pt-6 pb-16">
                    {testimoniosAleatorios.length > 0 ? (
                        testimoniosAleatorios.map((elemento, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 shadow-md rounded-lg p-3 flex flex-col items-center text-center w-44 
                                    transition-all duration-300 transform hover:scale-105 hover:bg-gray-200"
                            >
                                <Image
                                    src={elemento.imagen}
                                    alt={`Imagen de ${elemento.nombre}`}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-full object-cover mb-2"
                                />
                                <h3 className="text-sm font-semibold">{elemento.nombre}</h3>
                                <p className="text-xs text-gray-600">{elemento.descripcion}</p>
                                <p className="mt-1 text-yellow-500 text-sm">⭐ {elemento.calificacion}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center col-span-full">Cargando testimonios...</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Ctestimonios;
