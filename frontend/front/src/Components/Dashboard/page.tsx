"use client";
import { useUser } from "@auth0/nextjs-auth0";
import AdminPanel from "../Roles/Admin";
;

const Dashboard = () => {
  const { user } = useUser();
 

  



  return (
    <div className="p-6">
      <AdminPanel />
      {user?.email}
    </div>
  );
};

// ✅ Exportamos la versión protegida de Dashboard
export default (Dashboard);
