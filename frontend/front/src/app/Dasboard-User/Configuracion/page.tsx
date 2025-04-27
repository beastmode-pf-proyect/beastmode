import React from 'react'

import UpdateProfileForm from '@/Components/ActualizarInfo/ActualizarInfo'
import AuthenticatedUser from '@/Components/obtenerfoto/infoobtener'

function page() {
  return (
    <div>
        <UpdateProfileForm/>
     <AuthenticatedUser/>
     
    </div>
  )
}

export default page
