"use client";

import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { ITestimonios } from "../interfaces/testimonios";

interface ModalTestimoniosProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ModalTestimonios: React.FC<ModalTestimoniosProps> = ({
  onClose,
  onSuccess,
}) => {
  const { user, isAuthenticated } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    occupation: "",
    content: "",
    score: 0,
  });

  const [hoveredStars, setHoveredStars] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (value: number) => {
    setFormData(prev => ({ ...prev, score: value }));
  };

  const getStarColor = (index: number) => {
    if (formData.score > index) return "text-yellow-500";
    else if (hoveredStars !== null && hoveredStars > index)
      return "text-yellow-400";
    return "text-gray-300";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload: ITestimonios = {
        fullName: user?.name || "Usuario Anónimo",
  age: user?.age && user.age > 0 ? user.age : 30,
  occupation: formData.occupation,
  content: formData.content,
  score: formData.score,
    };

    console.log(payload); 

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/testimonials`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Error al enviar testimonio");

      toast.success("Testimonio enviado con éxito");
      onClose();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar testimonio");
    } finally {
      setIsLoading(false);
    }
  };


  if (!isAuthenticated) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Nuevo Testimonio</h2>
        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="mb-2 bg-gray-100 p-2 rounded">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Nombre:
            </label>
            <p className="text-gray-600">{user?.name}</p>
          </div>

          {/* Ocupación */}
          <div className="mb-2">
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Ocupación"
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          {/* Contenido */}
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Escribe tu testimonio"
            className="w-full p-2 border rounded mb-2 bg-gray-100"
          />

          {/* Calificación */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Calificación:
            </label>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`cursor-pointer text-2xl mr-1 ${getStarColor(
                    index
                  )}`}
                  onClick={() => handleStarClick(index + 1)}
                  onMouseEnter={() => setHoveredStars(index + 1)}
                  onMouseLeave={() => setHoveredStars(null)}
                />
              ))}
              {formData.score > 0 && (
                <span className="text-gray-600 ml-2">({formData.score}/5)</span>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-950/95 text-white py-2 rounded-md hover:bg-red-950/90 transition-colors duration-300 disabled:opacity-50">
              {isLoading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTestimonios;
