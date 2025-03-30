"use client";

import React, { ReactElement, useState, useEffect } from "react";
import testimonios from "./testimonios";
import Image from "next/image";

export const Ctestimonios: React.FC = (): ReactElement => {
    const [listaTestimonios, setListaTestimonios] = useState<any[]>([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setListaTestimonios(sacarTestimoniosRandom());

        const intervalo = setInterval(() => {
            setListaTestimonios(sacarTestimoniosRandom());
        }, 60000);

        return () => clearInterval(intervalo);
    }, []);

    function sacarTestimoniosRandom() {
        const copiaTestimonios = [...testimonios];
        copiaTestimonios.sort(() => Math.random() - 0.5);
        return copiaTestimonios.slice(0, 6);
    }

    function mostrar() {
        setVisible(!visible);
    }

    return (
        <>
            {visible ?
                <div className="ml-5 mr-5 mt-14 flex justify-center items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 pt-6 pb-16">
                        {testimonios.map((elemento, index) => (
                            <div key={index} className="bg-gray-100 shadow-md rounded-lg p-3 flex flex-col items-center text-center w-44 transition-all duration-300 transform hover:scale-105 hover:bg-gray-200">
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
                        ))}
                    </div>
                </div>

                :

                ( // Si visible es true, no renderiza nada
                    <div className="ml-5 mr-5 mt-14 flex justify-center items-center">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 pt-6 pb-16">
                            {listaTestimonios.length > 0 ? (
                                listaTestimonios.map((elemento, index) => (
                                    <div key={index} className="bg-gray-100 shadow-md rounded-lg p-3 flex flex-col items-center text-center w-44 transition-all duration-300 transform hover:scale-105 hover:bg-gray-200">
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
                )}

            <div className="flex justify-center mt-6">
                <button
                    className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-4 py-2 rounded-sm transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]"
                    onClick={mostrar}>
                    {visible ? "Mostrar Menos" : "Mostrar Mas"}
                </button>
            </div>
        </>
    );
};

export default Ctestimonios;
