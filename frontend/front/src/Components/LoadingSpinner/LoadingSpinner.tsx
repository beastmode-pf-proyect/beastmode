"use client";

const LoadingSpinner = ({ size = "md", color = "primary" }: { size?: "sm" | "md" | "lg"; color?: "primary" | "white" }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4"
  };

  const colorClasses = {
    primary: "border-[#5e1914] border-t-transparent",
    white: "border-white border-t-transparent"
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
      >
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;