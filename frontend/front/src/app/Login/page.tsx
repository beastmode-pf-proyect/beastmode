"use client";
import React, { useState } from "react";
import {  FaEnvelope, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import LoginFormP from "@/Components/loginouth/login";

const Login: React.FC<{ isActive: boolean; onSwitch: () => void }> = ({
  isActive,
  onSwitch,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    

    try {
      const response = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Ocurrió un error al iniciar sesión.");
        return;
      }

      const data = await response.json();
      navigate.push("/");
      console.log("Inicio de sesión exitoso:", data);
    } catch (err) {
      setError(
        "Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo."
      );
      console.error("Error al iniciar sesión:", err);
      
    }
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
      <div className="relative">
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
      </div>
      <div className="relative">
        <input
          type="password"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <FaLock className="absolute left-3 top-3 text-gray-400" />
      </div>
      <button className="w-full bg-red-950/95 text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-300 transform hover:scale-105">
       Inicia sesion
      </button>
      <div className="mt-6">
        <p className="text-center text-gray-600 mb-4">O inicia con:</p>
        <LoginFormP/>
      </div>
      <button
        type="button"
        onClick={onSwitch}
        className="text-red-950/95 underline">
        ¿No tienes una cuenta? Regístrate
      </button>
    </form>
  );
};

export default Login;