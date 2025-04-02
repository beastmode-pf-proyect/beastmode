import Ctestimonios from "@/Components/Ctestimonios";


export default function Home() {


  return (

    <>
      <div>
        <div className="flex justify-center items-center m-0.5 p-0.5  h-full w-full">
          <video src="/video/Olympia.mp4" muted autoPlay loop className="w-3/4 rounded-xl"></video>
        </div>

        <Ctestimonios />
      </div>
    </>

  );
}
