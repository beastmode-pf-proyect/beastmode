"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  ChartOptions,
} from "chart.js";
import { FaRobot } from "react-icons/fa";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

interface User {
  created_at: string;
}

export default function CyberGraficaUsuarios() {
  const [data, setData] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`)
      .then((res) => res.json())
      .then((users: User[]) => {
        const counts: Record<string, number> = {};

        users.forEach((user) => {
          const date = new Date(user.created_at).toLocaleDateString();
          counts[date] = (counts[date] || 0) + 1;
        });

        setData(counts);
      })
      .catch((err) => console.error("Error al obtener usuarios:", err));
  }, []);

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Usuarios Registrados",
        data: Object.values(data),
        fill: true,
        borderColor: "#5e1914",
        backgroundColor: "rgba(94, 25, 20, 0.15)",
        tension: 0.4,
        pointBackgroundColor: "#5e1914",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#5e1914" },
        grid: { color: "rgba(94, 25, 20, 0.1)" },
      },
      y: {
        ticks: {
          color: "#5e1914",
          callback: function (value: string | number) {
            return Number.isInteger(value) ? value : null;
          },
        },
        grid: { color: "rgba(94, 25, 20, 0.1)" },
      },
    },
  };

  return (
    <div className="">
      <h2 className="text-xl font-semibold tracking-wide">
          Monitoreo de Registros
        </h2>
    <div className="bg-[#ffffff] border border-[#5e1914] rounded-xl p-6 shadow-lg shadow-[#5e1914]/30">
      <div className="flex items-center gap-3 mb-4 text-[#5e1914]">
        <FaRobot size={24} />
        <h2 className="text-xl font-semibold tracking-wide">
          Monitoreo de Registros
        </h2>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-inner shadow-[#5e1914]/10">
        <Line data={chartData} options={options} />
      </div>
    </div>
    </div>
  );
}
