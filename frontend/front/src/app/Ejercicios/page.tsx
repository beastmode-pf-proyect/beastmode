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

const Page = () => {
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
    <div className='mt-50'>
      <Ejercicios/>
    </div>
  )
}

export default page
