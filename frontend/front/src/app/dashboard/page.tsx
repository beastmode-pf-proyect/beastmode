import WelcomeCard from '@/Components/Bienvenida/Bienvenida'
import NewUsersCarousel from '@/Components/Carrusel-Nuevo-Client/Carrusel'

import Estadisticas from '@/Components/Estadisticas/Estadisticas'
import React from 'react'

function page() {
  return (
    <div>
      
      <WelcomeCard/>
      <div className='h-10'></div>
      <Estadisticas/>
     

      <div className="p-6">
      <NewUsersCarousel />
    </div>
  
    </div>
  )
}

export default page
