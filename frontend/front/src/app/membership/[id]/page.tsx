"use client"
import { useParams } from "next/navigation";
import { memberships } from "../../../Components/helpers/memberships";


const MembershipDetail = () => {
  
  const { id } = useParams();

  const membership = memberships.find((m) => m.id === id); /**Busca el array de la mock */

  if (!membership) { /**si no esta que tire un mensaje */
    return <p>Membresía no encontrada</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">{membership.name}</h1>
      <p className="text-2xl text-red-950 font-extrabold">
        {membership.price} <span className="text-xl">{membership.duration}</span>
      </p>
      <ul className="mt-5 text-lg">
        {membership.benefits.map((benefit, index) => (
          <li key={index} className="pt-2">
            ✅ {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MembershipDetail;