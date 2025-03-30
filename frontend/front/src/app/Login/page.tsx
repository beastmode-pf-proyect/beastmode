"use client";
import React, { useState } from "react";
import { useAuth0, RedirectLoginOptions } from "@auth0/auth0-react";
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";
import Button from "../../Components/Button/button";
import { emailRegex, passwordRegex } from "@/utils/validaciones";

const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailRegex.test(email.trim())) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (!passwordRegex.test(password.trim())) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial."
      );
      return;
    }

    try {
      await loginWithRedirect({
        username: email,
        password,
      } as RedirectLoginOptions);
    } catch (err) {
      setError(
        "Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo."
      );
      console.error("Error al iniciar sesión:", err);
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="w-full max-w-md">
        <div className="bg-[#a82817] rounded-t-lg px-8 py-6 mb-4">
          <h1 className="text-3xl font-bold text-white">
            ¡Inicia sesión y activa tu BeastMode!
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ backgroundColor: "#a82817" }}
          className="shadow-md rounded-b-lg rounded-tr-lg px-8 pt-6 pb-8 mb-4">
          {error && (
            <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-white font-bold mb-2" htmlFor="email">
              Correo electrónico
            </label>
            <input
              className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-white font-bold mb-2"
              htmlFor="password">
              Contraseña
            </label>
            <input
              className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña."
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Button text="Iniciar sesion" variant="first" color="blue" />
          </div>
          <div className="mt-6">
            <p className="text-center text-white">O inicia sesión con:</p>
            <div className="flex justify-center gap-3 mt-4 space-x-4">
              <button className="bg-white hover:bg-gray-300 rounded-full p-2 inline-flex items-center justify-center text-gray-500">
                <FaFacebook className="h-6 w-6" />
              </button>
              <button className="bg-white hover:bg-gray-300 rounded-full p-2 inline-flex items-center justify-center text-gray-500">
                <FaInstagram className="h-6 w-6" />
              </button>
              <button
                className="bg-white hover:bg-gray-300 rounded-full p-2 inline-flex items-center justify-center text-gray-500"
                onClick={() => loginWithRedirect()}> 
                <FaGoogle className="h-6 w-6" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
