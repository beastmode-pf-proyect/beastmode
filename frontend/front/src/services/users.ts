import { supabase } from '../lib/supabaseClient'
export async function fetchUsersWithUserRole() {
    const { data, error } = await supabase
      .from('users2')
      .select('*')
      .eq('role_id', 3) // Asegúrate que 3 sea el id del rol 'User'
  
    if (error) throw error
    return data
  }
  