import React, { useState } from "react";
import { useAuth0, RedirectLoginOptions } from "@auth0/auth0-react";
import { FaGithub, FaGoogle, FaLinkedin, FaMicrosoft } from "react-icons/fa";
import Button from "../Button/button"

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
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
          Correo electrónico
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="password">
          Contraseña
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
              <Button
              text="Iniciar sesion"
              variant="first"
              color="blue"/>
      </div>
      <div className="mt-6">
        <p className="text-center text-gray-500">O inicia sesión con:</p>
        <div className="flex justify-center mt-4 space-x-4">
          <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 inline-flex items-center justify-center text-gray-500">
            <FaLinkedin className="h-6 w-6" />
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 inline-flex items-center justify-center text-gray-500">
            <FaMicrosoft className="h-6 w-6" />
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 inline-flex items-center justify-center text-gray-500">
            <FaGithub className="h-6 w-6" />
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 inline-flex items-center justify-center text-gray-500">
            <FaGoogle className="h-6 w-6" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
