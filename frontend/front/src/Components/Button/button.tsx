"use client";
import React from "react";
import {
  firstButtonStyles,
  secondButtonStyles,
  thirdButtonStyles,
  fourthButtonStyles,
  fifthButtonStyles,
  sixthButtonStyles,
  seventhButtonStyles,
  eighthButtonStyles,
  ninthButtonStyles,
  tenthButtonStyles,
} from "@/ui/buttonStyes";

interface ButtonProps {
  text: string;
  variant?:
    | "first"
    | "second"
    | "third"
    | "fourth"
    | "fifth"
    | "sixth"
    | "seventh"
    | "eighth"
    | "ninth"
    | "tenth";
  onClick?: () => void;
  color?:
    | "purple"
    | "gray"
    | "blue"
    | "green"
    | "red"
    | "yellow"
    | "orange"
    | "pink"
    | "emerald"
    | "teal";
}

const Button: React.FC<ButtonProps> = ({
  text,
  variant = "primary",
  onClick,
  color = "purple",
}) => {
  const buttonStyles = `
    px-6 py-3 rounded-xl font-bold text-black transition-colors border-4 hover:text-white
    ${
      variant === "first"
        ? firstButtonStyles[color]
        : variant === "second"
        ? secondButtonStyles[color]
        : variant === "third"
        ? thirdButtonStyles[color]
        : variant === "fourth"
        ? fourthButtonStyles[color]
        : variant === "fifth"
        ? fifthButtonStyles[color]
        : variant === "sixth"
        ? sixthButtonStyles[color]
        : variant === "seventh"
        ? seventhButtonStyles[color]
        : variant === "eighth"
        ? eighthButtonStyles[color]
        : variant === "ninth"
        ? ninthButtonStyles[color]
        : tenthButtonStyles[color]
    }
  `;

  return (
    <button className={buttonStyles} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
