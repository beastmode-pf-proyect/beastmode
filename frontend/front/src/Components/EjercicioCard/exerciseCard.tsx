import Link from "next/link";

const ExerciseCard = () => {
  return (
    <div className="w-60 bg-gray-200 border-2 border-gray-200 m-5 font-[Inter] ">
      <Link
        href={`/`}
        className="  rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      >
        <img
          src="https://res.cloudinary.com/dbsv0u7h3/image/upload/v1743902811/legs_ppgwlv.gif"
          alt="{product.name}"
          className=" w-full h-96 object-cover"
        />
        <div className=" p-4">
          <h3 className=" text-lg font-semibold text-gray-900">
            Elevación de piernas estiradas Colgado
          </h3>
          <p className="text-sky-800 font-bold mt-5 text-xs">
            asignado por tu trainer
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ExerciseCard;
