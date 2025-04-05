"use client";

import React, { ReactElement, useState, useEffect } from "react";
import testimonios from "./testimonios";
import Image from "next/image";
import estilos from "./Ctestimonios.module.css";

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
        return copiaTestimonios.slice(0, 6);
    }

    const testimoniosFiltrados =
        filtroEstrellas !== ""
            ? testimonios.filter((t) => t.calificacionNumero === filtroEstrellas)
            : testimonios;

    return (
        <>
            <h1
                className={`${estilos.tituloH2} text-center text-2xl font-bold text-[#5e1914] my-4`}
            >
                Historias Reales
            </h1>
            {visible ? (
                <div className="relative mx-4 mt-4 flex flex-col items-center">
                    {/* Filtro */}
                    <div className="mb-3 flex items-center">
                        <label className="mr-2 font-semibold text-sm text-[#5e1914]">
                            Filtrar por estrellas
                        </label>
                        <select
                            value={filtroEstrellas}
                            onChange={(e) =>
                                setFiltroEstrellas(
                                    e.target.value ? parseInt(e.target.value, 10) : ""
                                )
                            }
                            className="bg-[#f1f1f1] text-[#5e1914] text-sm px-2 py-1 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#a82717] transition cursor-pointer"
                        >
                            <option value="">Todas</option>
                            <option value="1">1 Estrella</option>
                            <option value="2">2 Estrellas</option>
                            <option value="3">3 Estrellas</option>
                            <option value="4">4 Estrellas</option>
                            <option value="5">5 Estrellas</option>
                        </select>

                        <div className="ml-4">
                            <button
                                onClick={() => setVisible(false)}
                                className="text-xl font-bold transition cursor-pointer w-8 p-1 rounded-4xl hover:scale-110 bg-red-600 text-white"
                            >
                                ✖
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 pb-10">
                        {testimoniosFiltrados.map((elemento, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 shadow-md rounded-lg p-2 flex flex-col items-center text-center w-40 transition-all duration-300 transform hover:scale-105 hover:bg-gray-200"
                            >
                                <Image
                                    src={elemento.imagen}
                                    alt={`Imagen de ${elemento.nombre}`}
                                    width={50}
                                    height={50}
                                    className="w-14 h-14 rounded-full object-cover mb-2"
                                />
                                <h3 className="text-sm font-semibold">{elemento.nombre}</h3>
                                <p className="text-xs text-gray-600">{elemento.descripcion}</p>
                                <p className="mt-1 text-yellow-500 text-sm">⭐ {elemento.calificacion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mx-4 mt-4 flex justify-center items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 pb-10">
                        {listaTestimonios.length > 0 ? (
                            listaTestimonios.map((elemento, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 shadow-md rounded-lg p-2 flex flex-col items-center text-center w-40 transition-all duration-300 transform hover:scale-105 hover:bg-gray-200"
                                >
                                    <Image
                                        src={elemento.imagen}
                                        alt={`Imagen de ${elemento.nombre}`}
                                        width={50}
                                        height={50}
                                        className="w-14 h-14 rounded-full object-cover mb-2"
                                    />
                                    <h3 className="text-sm font-semibold">{elemento.nombre}</h3>
                                    <p className="text-xs text-gray-600">{elemento.descripcion}</p>
                                    <p className="mt-1 text-yellow-500 text-sm">⭐ {elemento.calificacion}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center col-span-full text-sm">Cargando testimonios...</p>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-center mt-4">
                <button
                    className="cursor-pointer uppercase bg-[#f1f1f1] text-[#5e1914] px-4 py-2 rounded-md text-base transition shadow-md hover:bg-[#a82717] hover:text-[#f1f1f1] active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.4rem_0.4rem_#5e1914,-0.4rem_-0.4rem_#777271]"
                    onClick={() => setVisible(!visible)}
                >
                    {visible ? "Mostrar Menos" : "Mostrar Más"}
                </button>
            </div>
        </>
    );
};

export default Ctestimonios;
