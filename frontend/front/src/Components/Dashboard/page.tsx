"use client"
import React from 'react';

function Dashboard() {
  // Datos del usuario
  const user = {
    name: "Juan Pérez",
    email: "juanperez@email.com",
    avatar: "https://via.placeholder.com/100",
    membership: "Premium",
    registered: "01 Enero 2024",
    lastLogin: "25 Marzo 2025",
  };

  return (
    <div className="p-6">
      {/* Contenido principal Dashboard */}
      <div>
        <h2 className="text-3xl font-semibold text-[#dc150b]">Dashboard</h2>
        <p className="mt-4 text-gray-600">
          Bienvenido a tu panel de control. Administra tu información de manera fácil y rápida.
        </p>

        {/* Sección de Información del Usuario */}
        <div className="mt-8 bg-[#f8f8f8] p-6 rounded-lg shadow-lg border border-[#dc150b]">
          <h3 className="text-xl font-semibold text-[#2D2D56]">Información del Usuario</h3>
          <div className="flex items-center space-x-6 mt-4">
            
            <div className="text-[#2D2D56]">
              <p><span className="font-semibold">Nombre:</span> {user.name}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Membresía:</span> {user.membership}</p>
              <p><span className="font-semibold">Registro:</span> {user.registered}</p>
              <p><span className="font-semibold">Último acceso:</span> {user.lastLogin}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
