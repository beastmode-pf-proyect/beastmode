"use client";
import React, { useState, FormEvent } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";
import Button from "@/Components/Button/button";

interface UserMetadata {
  name: string;
  surname: string;
  dni: string;
  phone: string;
  country: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [dni, setDni] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userMetadata: UserMetadata = {
        name,
        surname,
        dni,
        phone,
        country,
        address,
        email,
        password,
        confirmPassword,
      };

      await loginWithRedirect({
        appState: {
          returnTo: window.location.origin,
          user_metadata: userMetadata,
        },
        authorizationParams: {
          screen_hint: "signup",
        },
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ backgroundColor: "#a82817" }}
      className=" shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      <div className="mb-4 md:flex md:justify-around">
        <div className="mb-4 md:mr-2 md:mb-0">
          <label className="block text-white font-bold mb-2" htmlFor="name">
            Nombre
          </label>
          <input
            className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Ingresa tu nombre"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="md:ml-2">
          <label className="block text-white font-bold mb-2" htmlFor="surname">
            Apellido
          </label>
          <input
            className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="surname"
            type="text"
            placeholder="Ingresa tu apellido"
            value={surname}
            onChange={e => setSurname(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4 md:flex md:justify-around">
        <div className="mb-4 md:mr-2 md:mb-0">
          <label className="block text-white font-bold mb-2" htmlFor="dni">
            DNI
          </label>
          <input
            className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="dni"
            type="text"
            placeholder="Ingresa tu DNI"
            value={dni}
            onChange={e => setDni(e.target.value)}
          />
        </div>
        <div className="md:ml-2">
          <label className="block text-white font-bold mb-2" htmlFor="phone">
            Teléfono
          </label>
          <input
            className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="phone"
            type="tel"
            placeholder="Ingresa tu número de teléfono"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4 md:flex md:justify-around">
        <div className="mb-4 md:mr-2 md:mb-0">
          <label className="block text-white font-bold mb-2" htmlFor="country">
            País
          </label>
          <input
            className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="country"
            type="text"
            placeholder="Ingresa tu país"
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
        </div>
        <div className="md:ml-2">
          <label className="block text-white font-bold mb-2" htmlFor="address">
            Dirección
          </label>
          <input
            className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            placeholder="Ingresa tu dirección"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4 md:flex md:justify-around">
        <div className="mb-4 md:mr-2 md:mb-0">
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
        <div className="md:ml-2">
          <label className="block text-white font-bold mb-2" htmlFor="password">
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
      </div>
      <div className="mb-6 md:flex md:justify-around">
        <div className="mb-4 md:mr-2 md:mb-0">
          <label
            className="block text-white font-bold mb-2"
            htmlFor="confirmPassword">
            Confirmar contraseña
          </label>
          <input
            className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            type="password"
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Button text="Registrarse" variant="first" color="blue" />
      </div>
      <div className="mt-6">
        <p className="text-center text-white">O regístrate con:</p>
        <div className="flex justify-center gap-3 mt-4 space-x-4">
          <button className="bg-white hover:bg-gray-300 rounded-full p-2 inline-flex items-center justify-center text-black">
            <FaFacebook className="h-6 w-6" />
          </button>
          <button className="bg-white hover:bg-gray-300 rounded-full p-2 inline-flex items-center justify-center text-black">
            <FaInstagram className="h-6 w-6" />
          </button>
          <button className="bg-white hover:bg-gray-300 rounded-full p-2 inline-flex items-center justify-center text-black">
            <FaGoogle className="h-6 w-6" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Register;
