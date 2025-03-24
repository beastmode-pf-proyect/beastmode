"use client";

import Button from "@/Components/Button/button";

export default function Home() {
  const handleClick = () => {
    window.alert("Hiciste click!");
  };

  return (
    <>
      <div className="flex flex-col-3 mt-4 gap-4">
        <Button
          text="Explora los planes > "
          variant="first"
          color="purple"
          onClick={handleClick}
        />
        <Button
          text="Aprende mas"
          variant="second"
          color="gray"
          onClick={handleClick}
        />
        <Button
          text="Registrate"
          variant="third"
          color="blue"
          onClick={handleClick}
        />
        <Button
          text="Contactanos"
          variant="fourth"
          color="green"
          onClick={handleClick}
        />
        <Button
          text="Contactanos"
          variant="fifth"
          color="red"
          onClick={handleClick}
        />
        <Button
          text="Contactanos"
          variant="sixth"
          color="yellow"
          onClick={handleClick}
        />
        <Button
          text="Contactanos"
          variant="seventh"
          color="orange"
          onClick={handleClick}
        />
        <Button
          text="Contactanos"
          variant="eighth"
          color="pink"
          onClick={handleClick}
        />
        <Button
          text="Prueba"
          variant="ninth"
          color="emerald"
          onClick={handleClick}
        />
        <Button
          text="Contactanos"
          variant="tenth"
          color="teal"
          onClick={handleClick}
        />
      </div>
    </>
  );
}
