import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CheckSession() {
  useEffect(() => {
    const check = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      console.log('Sesión activa:', sessionData)
    }

    check()
  }, [])

  return <p>Revisando sesión en consola..</p>
}
