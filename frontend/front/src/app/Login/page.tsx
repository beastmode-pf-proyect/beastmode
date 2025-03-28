"use client"
import React, { useState } from "react";
import { useAuth0, RedirectLoginOptions } from "@auth0/auth0-react";
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";
import Button from "../../Components/Button/button"

const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithRedirect({
      username: email,
      password,
    } as RedirectLoginOptions);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ backgroundColor: "#a82817" }}
      className=" shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      <div className="mb-4">
        <label className="block text-white font-bold mb-2" htmlFor="email">
          Correo electrónico.
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
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Button  text="Iniciar sesion" variant="first" color="blue" />
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
          <button className="bg-white hover:bg-gray-300 rounded-full p-2 inline-flex items-center justify-center text-gray-500">
            <FaGoogle className="h-6 w-6" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
