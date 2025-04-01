"use client";
import React, { useState } from "react";
import Login from "../Login/page";
import Register from "../Register/page";

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-2xl">
        <div className="bg-red-950/95 shadow-lg backdrop-blur-sm py-4 text-white text-center">
          <h1 className="text-3xl font-bold">¡Bienvenido!</h1>
          <p className="mt-2">Únete a nuestra increíble comunidad</p>
        </div>

        <div className="flex">
          <div className="flex-1 p-8">
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setActiveTab("signup")}
                className={`px-4 py-2 rounded-l-md focus:outline-none transition-colors duration-300 ${
                  activeTab === "signup"
                    ? "bg-red-950/95 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}>
                Registrate
              </button>
              <button
                onClick={() => setActiveTab("login")}
                className={`px-4 py-2 rounded-r-md focus:outline-none transition-colors duration-300 ${
                  activeTab === "login"
                    ? "bg-red-950/95 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}>
               Inicia sesion
              </button>
            </div>
            <Register
              isActive={activeTab === "signup"}
              onSwitch={() => setActiveTab("login")}
            />
            <Login
              isActive={activeTab === "login"}
              onSwitch={() => setActiveTab("signup")}
            />
          </div>
          <div
            className="hidden md:flex items-center justify-center w-1/2 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://cdn.pixabay.com/animation/2024/07/07/06/32/06-32-28-251_512.gif")',
            }}></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
