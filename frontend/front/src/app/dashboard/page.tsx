import WelcomeCard from '@/Components/Bienvenida/Bienvenida'
import Estadisticas from '@/Components/Estadisticas/Estadisticas'
import React from 'react'

function page() {
  return (
    <div>
      <WelcomeCard/>
      <div className='h-10'></div>
      <Estadisticas/>
    </div>
  )
}

export default page
