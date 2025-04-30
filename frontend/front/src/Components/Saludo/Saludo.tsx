"use client";
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Image from "next/image";
import { FaSun, FaMoon, FaCloudSun, FaCalendarAlt, FaClock } from "react-icons/fa";
import "./TrainerGreeting.css";

export default function TrainerGreeting() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("Buenos días");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateGreeting = () => {
    const hour = currentTime.getHours();
    let newGreeting = "Buenos días";
    if (hour >= 12 && hour < 19) newGreeting = "Buenas tardes";
    else if (hour >= 19 || hour < 6) newGreeting = "Buenas noches";
    setGreeting(newGreeting);
  };

  const getGreetingIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return <FaSun className="sun-icon" />;
    if (hour >= 12 && hour < 19) return <FaCloudSun className="cloud-sun-icon" />;
    return <FaMoon className="moon-icon" />;
  };

  if (isLoading) {
    return (
      <div className="greeting-skeleton">
        <div className="skeleton-line"></div>
        <div className="skeleton-line-short"></div>
      </div>
    );
  }

  return (
    <div className="greeting-container">
      <div className="background-effect"></div>
      <div className="border-effect"></div>
      
      <div className="content-wrapper">
        {isAuthenticated && user?.picture && (
          <div className="avatar-container">
            <div className="avatar-glow"></div>
            <div className="avatar-frame">
              <Image
                src={user.picture}
                alt="Perfil del entrenador"
                width={96}
                height={96}
                className="avatar-image"
              />
            </div>
          </div>
        )}

        <div className="main-content">
          <div className="title-container">
            <div className="greeting-icon">{getGreetingIcon()}</div>
            <h1 className="greeting-text">
              <span className="gradient-text">{greeting},</span>
              <span className="trainer-name">
                {isAuthenticated ? user?.name?.split(" ")[0] : "Entrenador"}
              </span>
            </h1>
          </div>

          <div className="time-info">
            <div className="info-card">
              <FaCalendarAlt className="info-icon" />
              <span className="info-text">
                {currentTime.toLocaleDateString("es-ES", {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            <div className="info-card">
              <FaClock className="info-icon" />
              <span className="info-text">
                {currentTime.toLocaleTimeString("es-ES", {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
