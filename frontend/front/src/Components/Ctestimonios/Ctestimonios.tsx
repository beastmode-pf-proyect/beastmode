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
            <div className="ml-5 mr-5 mt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 pb-26">
                    {testimoniosAleatorios.length > 0 ? (
                        testimoniosAleatorios.map((elemento, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center text-center">
                                <Image
                                    src={elemento.imagen}
                                    alt={`Imagen de ${elemento.nombre}`}
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 rounded-full object-cover mb-3"
                                />
                                <h3 className="text-lg font-semibold">{elemento.nombre}</h3>
                                <p className="text-gray-600">{elemento.descripcion}</p>
                                <p className="mt-2 text-yellow-500">⭐ {elemento.calificacion}</p>
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
