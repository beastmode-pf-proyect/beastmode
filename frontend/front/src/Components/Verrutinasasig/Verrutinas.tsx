'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface AssignedRoutine {
  id: string
  user_id: string
  routine_id: string
  assigned_by: string
  assigned_by_name: string
  created_at: string
  user_name?: string
  routine_name?: string
}

export default function TablaRutinasAsignadas() {
  const [assigned, setAssigned] = useState<AssignedRoutine[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAssigned = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('user_workout_routines')
      .select('*')

    if (error) {
      console.error('❌ Error al obtener asignaciones:', error)
      setAssigned([])
      setLoading(false)
      return
    }

    const routinesWithNames = await Promise.all(
      (data || []).map(async (item) => {
        const [userData, routineData] = await Promise.all([
          supabase.from('users2').select('name').eq('id', item.user_id).maybeSingle(),
          supabase.from('workout_routine').select('name').eq('id', item.routine_id).maybeSingle(),
        ])

        return {
          ...item,
          user_name: userData.data?.name || item.user_id,
          routine_name: routineData.data?.name || item.routine_id,
        }
      })
    )

    setAssigned(routinesWithNames)
    setLoading(false)
  }

  useEffect(() => {
    fetchAssigned()

    const channel = supabase
      .channel('assigned-routines-listener')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_workout_routines',
        },
        () => {
          console.log('📡 Cambio detectado en rutinas asignadas')
          fetchAssigned()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md border space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Rutinas asignadas</h2>
        <button
          onClick={fetchAssigned}
          disabled={loading}
          className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition"
        >
          🔄 Recargar
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : assigned.length === 0 ? (
        <p className="text-sm text-gray-500">No hay rutinas asignadas.</p>
      ) : (
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Usuario</th>
              <th className="p-2">Rutina</th>
              <th className="p-2">Asignado por</th>
              <th className="p-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {assigned.map((entry) => (
              <tr key={entry.id} className="border-t">
                <td className="p-2">{entry.user_name}</td>
                <td className="p-2">{entry.routine_name}</td>
                <td className="p-2">{entry.assigned_by_name}</td>
                <td className="p-2">
                  {new Date(entry.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
