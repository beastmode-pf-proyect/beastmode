'use client';

import { useAuth0 } from '@auth0/auth0-react';
import Landing from './Landing/page';
import Home from './Home/page'; 

export default function Page() {
  const { isAuthenticated } = useAuth0();



  return (
    <>
      {isAuthenticated ? <Home /> : <Landing />}
    </>
  );
}