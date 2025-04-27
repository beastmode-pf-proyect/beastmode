"use client";

import React, { useEffect, useState, Fragment } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { Menu } from "lucide-react"; 

interface Exercise {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  category: string;
}

const Ejercicios = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [search, setSearch] = useState<string>("");

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/exercises`
        );
        const data: Exercise[] = await res.json();
        const active = data.filter(ex => ex.isActive);
        setExercises(active);
        setFilteredExercises(active);

        const uniqueCategories = [
          "Todos",
          ...Array.from(new Set(active.map(ex => ex.category))),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching exercises", error);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    let results = [...exercises];

    if (selectedCategory !== "Todos") {
      results = results.filter(ex => ex.category === selectedCategory);
    }

    if (search.trim()) {
      results = results.filter(ex =>
        ex.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredExercises(results);
  }, [selectedCategory, search, exercises]);

  return (
    <div className="relative min-h-screen flex">
      <aside className="hidden lg:flex flex-col fixed top-[80px] left-0 w-[250px] h-[calc(100vh-80px)] bg-[#5e1914] py-1 z-30 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2 text-white mt-12">Categorías</h2>
        <div className="flex flex-col gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 border-none whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-white text-[#5e1914] font-bold"
                  : "bg-[#5e1914] text-white hover:bg-[#7c2d26]"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </aside>

      {/* Botón hamburguesa para móvil */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-[90px] left-4 z-40 bg-[#5e1914] text-white p-2 rounded-full shadow-lg lg:hidden">
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar móvil como modal */}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={() => setSidebarOpen(false)}>
          <div className="fixed inset-0 bg-[#5e19148f] bg-opacity-30 backdrop-blur-sm" />
          <div className="fixed top-0 left-0 w-64 h-full bg-[#5e1914] p-4 shadow-lg overflow-y-auto">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white text-right w-full mb-4 font-bold">
              Cerrar X
            </button>
            <h2 className="text-xl font-semibold mb-4 text-white">
              Categorías
            </h2>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSidebarOpen(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-200 border-none whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-white text-[#5e1914] font-bold"
                      : "bg-[#5e1914] text-white hover:bg-[#7c2d26]"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Dialog>
      </Transition>

      <main className="flex-1 p-4 pt-6 lg:pl-[270px] max-w-7xl mx-auto">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar ejercicios..."
            className="w-full lg:w-1/2 p-2 border-b-2 border-red-800 focus:outline-none bg-transparent text-black placeholder-gray-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="min-h-[700px]">
          {filteredExercises.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredExercises.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => openModal(ex)}
                  className="cursor-pointer border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-200 p-2 min-h-[300px] flex flex-col">
                  <div className="h-48 w-full relative">
                    <Image
                      src={ex.imageUrl || "/descarga.png"}
                      alt={ex.name}
                      fill
                      className="rounded object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-center text-red-900 mt-3">
                    {ex.name}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No se encontraron ejercicios que coincidan con tu búsqueda.
            </p>
          )}
        </div>
      </main>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-90"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-90">
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-1/2 h-64 md:h-80">
                      <Image
                        src={selectedExercise?.imageUrl || "/descarga.png"}
                        alt={selectedExercise?.name || ""}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <div className="flex flex-col justify-center md:w-1/2">
                      <Dialog.Title className="text-2xl font-bold text-[#5e1914] mb-4">
                        {selectedExercise?.name}
                      </Dialog.Title>
                      <p className="text-gray-700 text-base leading-relaxed">
                        {selectedExercise?.description}
                      </p>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Ejercicios;
