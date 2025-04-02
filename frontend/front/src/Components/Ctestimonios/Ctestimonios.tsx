"use client";

import React, { ReactElement, useState, useEffect } from "react";
import testimonios from "./testimonios";
import Image from "next/image";

export const Ctestimonios: React.FC = (): ReactElement => {
    const [listaTestimonios, setListaTestimonios] = useState<any[]>([]);
    const [visible, setVisible] = useState(false);
    const [filtroEstrellas, setFiltroEstrellas] = useState<number | "">("");

    useEffect(() => {
        setListaTestimonios(sacarTestimoniosRandom());

        const intervalo = setInterval(() => {
            setListaTestimonios(sacarTestimoniosRandom());
        }, 10000);

        return () => clearInterval(intervalo);
    }, []);

    function sacarTestimoniosRandom() {
        const copiaTestimonios = [...testimonios];
        copiaTestimonios.sort(() => Math.random() - 0.5);
        return copiaTestimonios.slice(0, 3);
    }

    const testimoniosFiltrados = filtroEstrellas !== ""
        ? testimonios.filter((t) => t.calificacionNumero === filtroEstrellas)
        : testimonios;

    return (
        <>
            {visible ? (
                <div className="relative ml-5 mr-5 mt-14 flex flex-col items-center">
                    {/* Input para filtrar por cantidad de estrellas */}
                    <div className="mb-4 flex items-center">
                        <label className="mr-2 font-semibold text-[#5e1914]">Filtrar por estrellas</label>
                        <select
                            value={filtroEstrellas}
                            onChange={(e) =>
                                setFiltroEstrellas(e.target.value ? parseInt(e.target.value, 10) : "")
                            }
                            className="bg-[#f1f1f1] text-[#5e1914] p-.5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#a82717] transition cursor-pointer"
                        >
                            <option value="">Todas</option>
                            <option value="1">1 Estrella</option>
                            <option value="2">2 Estrellas</option>
                            <option value="3">3 Estrellas</option>
                            <option value="4">4 Estrellas</option>
                            <option value="5">5 Estrellas</option>
                        </select>

                        {/* Botón de cierre */}
                        <div className="ml-5">
                        <button
                            onClick={() => setVisible(false)}
                            className="text-2xl font-bold transition cursor-pointer w-10 p-1 rounded-4xl hover:scale-110 bg-red-600">
                            ✖
                        </button>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pt-6 pb-16">
                        {testimoniosFiltrados.map((elemento, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 shadow-lg rounded-xl p-5 flex flex-col items-center text-center w-60 transition-all duration-300 transform hover:scale-105 hover:bg-gray-200"
                            >
                                <Image
                                    src={elemento.imagen}
                                    alt={`Imagen de ${elemento.nombre}`}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 rounded-full object-cover mb-3"
                                />
                                <h3 className="text-lg font-semibold">{elemento.nombre}</h3>
                                <p className="text-sm text-gray-600">{elemento.descripcion}</p>
                                <p className="mt-2 text-yellow-500 text-base">⭐ {elemento.calificacion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="ml-5 mr-5 mt-14 flex justify-center items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pt-6 pb-16">
                        {listaTestimonios.length > 0 ? (
                            listaTestimonios.map((elemento, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 shadow-lg rounded-xl p-5 flex flex-col items-center text-center w-60 transition-all duration-300 transform hover:scale-105 hover:bg-gray-200"
                                >
                                    <Image
                                        src={elemento.imagen}
                                        alt={`Imagen de ${elemento.nombre}`}
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 rounded-full object-cover mb-3"
                                    />
                                    <h3 className="text-lg font-semibold">{elemento.nombre}</h3>
                                    <p className="text-sm text-gray-600">{elemento.descripcion}</p>
                                    <p className="mt-2 text-yellow-500 text-base">⭐ {elemento.calificacion}</p>
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
                    className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-5 py-3 rounded-md text-lg transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#5e1914,-0.5rem_-0.5rem_#777271]"
                    onClick={() => setVisible(!visible)}
                >
                    {visible ? "Mostrar Menos" : "Mostrar Más"}
                </button>
            </div>
        </>
    );
};

export default Ctestimonios;