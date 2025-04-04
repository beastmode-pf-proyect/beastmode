import Ctestimonios from "@/Components/Ctestimonios";


export default function Home() {


  return (

<>
  <div className="flex flex-col lg:flex-row">


    <div className="lg:w-1/2">
      <div className="lg:fixed  lg:w-1/2 flex justify-center mt-40">
        <video
          src="/video/Olympia.mp4"
          muted
          autoPlay
          loop
          className="w-3/4 rounded-xl shadow-xl"
        />
      </div>
    </div>

    <div>
      <Ctestimonios />
    </div>
  </div>
</>




  );
}
