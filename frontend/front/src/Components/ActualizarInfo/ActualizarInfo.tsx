"use client";

import { useEffect, useState } from "react";
import { useSessionUser } from "@/app/SessionUserContext";
import { toast } from "react-hot-toast";
import Image from "next/image";

export const UpdateProfileForm = () => {
  const { setSessionUser } = useSessionUser();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName1, setLastName1] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserFromDatabase = async () => {
      const userId = sessionStorage.getItem("id");
      if (!userId) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`);
        if (!response.ok) throw new Error("Error al obtener datos del usuario");

        const dbUser = await response.json();

        if (dbUser.name) {
          const names = dbUser.name.trim().split(/\s+/);
          setFirstName(names[0] || "");
          setMiddleName(names[1] || "");
          setLastName1(names[2] || "");
          if (names.length > 4) {
            setLastName2(names.slice(3).join(" "));
          } else {
            setLastName2(names[3] || "");
          }
        }

        
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar los datos del usuario");
      }
    };

    fetchUserFromDatabase();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      const fileType = file.type.split("/")[1];
      if (fileType !== "jpeg" && fileType !== "png") {
        toast.error("Solo se permiten imágenes en formato JPG o PNG.");
        return;
      }

      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!firstName.trim() || !lastName1.trim()) {
      setError("El primer nombre y primer apellido son obligatorios.");
      setIsLoading(false);
      return;
    }

    if (!previewUrl) {
      toast.error("¡Por favor, sube una imagen de perfil!");
      setIsLoading(false);
      return;
    }

    const userId = sessionStorage.getItem("id");
    if (!userId) {
      setError("No se encontró el usuario.");
      setIsLoading(false);
      return;
    }

    const fullName = [
      firstName.trim(),
      middleName.trim(),
      lastName1.trim(),
      lastName2.trim()
    ].filter(Boolean).join(" ");

    const formData = new FormData();
    formData.append("name", fullName);
    if (image) formData.append("file", image);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
        method: "PUT",
        body: formData,
      });

      const updatedUser = await response.json();

      setSessionUser({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        picture: updatedUser.picture,
      });

      sessionStorage.setItem("name", updatedUser.name || "");
      sessionStorage.setItem("picture", updatedUser.picture || "");
      setPreviewUrl(updatedUser.picture);
      
      toast.success("¡Perfil actualizado con éxito!");

    } catch (err) {
      console.error("Error:", err);
      setError("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-red-50 to-red-50 rounded-2xl shadow-2xl shadow-blue-100/50">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Actualizar Perfil
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Mantén tu información personal actualizada
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de perfil
            <div className="relative group mt-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="block w-full h-40 rounded-2xl border-2 border-dashed border-red-300 hover:border-red-500 transition-all duration-300 cursor-pointer overflow-hidden group-hover:shadow-lg relative bg-white"
              >
                {previewUrl ? (
                  <>
                    <Image
      src={previewUrl}
      alt="Vista previa"
      layout="fill"
      objectFit="cover"
      className="transform group-hover:scale-105 transition-transform duration-300"
    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-gray-500 text-sm">Subir imagen</span>
                  </div>
                )}
              </label>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primer nombre *
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition duration-200 px-4 py-2.5"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Segundo nombre
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="mt-1 block w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition duration-200 px-4 py-2.5"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primer apellido *
              <input
                type="text"
                value={lastName1}
                onChange={(e) => setLastName1(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition duration-200 px-4 py-2.5"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Segundo apellido
              <input
                type="text"
                value={lastName2}
                onChange={(e) => setLastName2(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition duration-200 px-4 py-2.5"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-red-950 to-red-950 hover:from-red-800 hover:to-red-800 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : (
            'Actualizar Perfil'
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
