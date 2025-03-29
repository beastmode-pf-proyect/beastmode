
"use client"

import { useAuth0 } from '@auth0/auth0-react';
import Login from "@/app/Login/Login";


export default function Home() {
  // const handleClick = () => {
  //   window.alert("Hiciste click!");
  // };
  
const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (

    <>
      <div className="flex flex-col-1 justify-center mt-24">
        <Login />
      </div>
      <div>
      <div>
      {!isAuthenticated ? (
        <button 
          onClick={() => loginWithRedirect()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <span>Hola, {user?.name}</span>
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
      </div>

    </>

  );
}
