"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const CookieBlockerAlert = () => {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const checkCookiesAndStorage = () => {
      // Intentamos escribir en sessionStorage y localStorage
      try {
        // Verificación para localStorage
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");

        // Verificación para sessionStorage
        sessionStorage.setItem("test", "test");
        sessionStorage.removeItem("test");

        // Si no hay error, no está bloqueado
        setIsBlocked(false);
      } catch (error) {
        console.error("Error detectado: ", error);
        // Si hay un error, se asume que las cookies o almacenamiento están bloqueados
        setIsBlocked(true);
        showAlert();
      }
    };

    checkCookiesAndStorage();
  }, []);

  const showAlert = () => {
    Swal.fire({
      icon: "warning",
      title: "Bloqueo de cookies y almacenamiento detectado",
      text: "Parece que tu navegador está bloqueando cookies o almacenamiento. Para que la aplicación funcione correctamente, debes permitir el uso de cookies y almacenamiento.",
      confirmButtonText: "Entendido",
      footer: `<a href="https://support.brave.com/hc/en-us/articles/360018449931-How-to-adjust-the-Shields-settings-in-Brave" target="_blank">Aprende cómo ajustar la configuración de escudos</a>`,
    });
  };

  if (isBlocked) {
    return null; // Si está bloqueado, solo mostramos la alerta
  }

  return null; // Si no está bloqueado, no se muestra nada
};

export default CookieBlockerAlert;
