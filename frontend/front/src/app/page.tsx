"use client";

import { useAuth0 } from "@auth0/auth0-react";
import Landing from "./Landing/page";
import Home from "./Home/page";
import ClientOnly from "./ClientOnly";

export default function Page() {
  const { isAuthenticated, isLoading, user } = useAuth0(); 

  return (
    <ClientOnly isAuthenticated={isAuthenticated} user={user}>
      {isLoading ? null : isAuthenticated ? <Home /> : <Landing />}
    </ClientOnly>
  );
}
