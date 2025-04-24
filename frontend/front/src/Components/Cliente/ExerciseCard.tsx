"use client";
import Image from "next/image";

type ExerciseCardProps = {
  name: string;
  image?: string;
  category?: string;
  difficulty?: string;
};

const ExerciseCard = ({ name, image, category, difficulty }: ExerciseCardProps) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105 backdrop-blur-sm">
      {image && (
        <Image 
          src={image}
          alt={name}
          width={400}
          height={250}
          className="w-full h-52 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
        {category && (
          <p className="text-sm text-gray-300 mb-1">
            Categoría: <span className="font-medium text-white">{category}</span>
          </p>
        )}
        {difficulty && (
          <p className="text-sm text-gray-300">
            Dificultad: <span className="font-medium text-white">{difficulty}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;
