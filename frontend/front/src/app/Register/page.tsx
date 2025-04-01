"use client";
import React, { useState, FormEvent } from "react";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import { UserData } from "@/Components/interfaces/userData";

const Register: React.FC<{ isActive: boolean; onSwitch: () => void }> = ({
  isActive,
  onSwitch,
}) => {
  const { loginWithRedirect } = useAuth0();
  const [userData, setUserData] = useState<UserData>({
    name: "",
    surname: "",
    dni: "",
    email: "",
    address: "",
    country: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useRouter();

 const handleSubmit = async (e: FormEvent) => {
   e.preventDefault();

   try {
     const response = await fetch("http://localhost:3000/signup", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(userData),
     });

     if (!response.ok) {
       const errorData = await response.json();
       setError(
         errorData.message || "Ocurrió un error al registrar el usuario."
       );
       return;
     }

     const data = await response.json();
     navigate.push("/home");
     console.log("Registro exitoso:", data);
   } catch (err) {
     setError(
       "Ocurrió un error al registrar el usuario. Por favor, intenta de nuevo."
     );
     console.error("Error al registrar usuario:", err);
   }
 };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof UserData
  ) => {
    setUserData({ ...userData, [field]: e.target.value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 ${isActive ? "block" : "hidden"}`}>
      {error && (
        <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            placeholder="Nombre"
            value={userData.name}
            onChange={e => handleInputChange(e, "name")}
          />
          <FaUser className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            placeholder="Apellido"
            value={userData.surname}
            onChange={e => handleInputChange(e, "surname")}
          />
          <FaUser className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            placeholder="DNI"
            value={userData.dni}
            onChange={e => handleInputChange(e, "dni")}
          />
          <FaUser className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            placeholder="Email"
            value={userData.email}
            onChange={e => handleInputChange(e, "email")}
          />
          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            placeholder="Dirección"
            value={userData.address}
            onChange={e => handleInputChange(e, "address")}
          />
          <FaUser className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            placeholder="País"
            value={userData.country}
            onChange={e => handleInputChange(e, "country")}
          />
          <FaUser className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="tel"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            placeholder="Teléfono"
            value={userData.phone}
            onChange={e => handleInputChange(e, "phone")}
          />
          <FaPhone className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="relative">
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            placeholder="Contraseña."
            value={userData.password}
            onChange={e => handleInputChange(e, "password")}
          />
          <FaLock className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="relative">
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            placeholder="Confirmar Contraseña"
            value={userData.confirmPassword}
            onChange={e => handleInputChange(e, "confirmPassword")}
          />
          <FaLock className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      <button className="w-full bg-red-950/95 text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-300 transform hover:scale-105">
        Registrate
      </button>
      <button
        type="button"
        onClick={onSwitch}
        className="text-red-950/95 underline">
        ¿Ya tienes una cuenta? Inicia sesión.
      </button>
      <div className="mt-6">
        <p className="text-center text-gray-600 mb-4">O inicia con:</p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
            onClick={() => loginWithRedirect()}>
            <FaGoogle className="mr-2" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Register;
