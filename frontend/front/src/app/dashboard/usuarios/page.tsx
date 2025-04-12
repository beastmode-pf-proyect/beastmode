import  UserManagement from '@/Components/Roles/Admin'
import AdminPanel from '@/Components/Roles/Roles'
import React from 'react'

function page() {
  return (
    <div>
      <UserManagement />
      <AdminPanel/>
    </div>
  )
}

export default page
