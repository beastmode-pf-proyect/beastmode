"use client";
import React, { useState, FormEvent } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import { UserData } from "@/Components/interfaces/userData";
import Swal from "sweetalert2";

const Register: React.FC<{ isActive: boolean; onSwitch: () => void }> = ({
  isActive,
  onSwitch,
}) => {
  const { loginWithRedirect } = useAuth0();
  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const navigate = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      console.log(userData)
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
            console.log(userData);


      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || "Ocurrió un error al registrar el usuario."
        );
        return;
      }

      const data = await response.json();
      Swal.fire({
        title: "Registro exitoso !",
        text: "Usuario registrado correctamente.",
        icon: "success",
      });
      navigate.push("/Auth");
      console.log("Registro exitoso:", data);
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      setError(
        "Ocurrió un error al registrar el usuario. Por favor, intenta de nuevo."
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof UserData
  ) => {
    setUserData({ ...userData, [field]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          value={userData.email}
          onChange={e => handleInputChange(e, "email")}
        />
        <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 pr-12"
          placeholder="Contraseña"
          value={userData.password}
          onChange={e => handleInputChange(e, "password")}
        />
        <FaLock className="absolute left-3 top-3 text-gray-400" />
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          onClick={togglePasswordVisibility}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 pr-12"
          placeholder="Confirmar Contraseña"
          value={userData.confirmPassword}
          onChange={e => handleInputChange(e, "confirmPassword")}
        />
        <FaLock className="absolute left-3 top-3 text-gray-400" />
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          onClick={toggleConfirmPasswordVisibility}>
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <button className="w-full bg-red-950/95 text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-300 transform hover:scale-105">
        Registrate.
      </button>
      <button
        type="button"
        onClick={onSwitch}
        className="text-red-950/95 underline">
        ¿Ya tienes una cuenta? Inicia sesión
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
