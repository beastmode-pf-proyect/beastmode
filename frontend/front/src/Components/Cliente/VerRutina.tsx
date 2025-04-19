'use client'

import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Image from 'next/image'

interface Exercise {
  id: string
  name: string
  description: string
}

interface Routine {
  id: string
  name: string
  description: string
  imageUrl: string
  isActive: boolean
  exercises?: Exercise[]
}

interface User {
  auth0_id: string
}

interface UserWorkout {
  id: string
  user: User
  routine: Partial<Routine>
  isActive: boolean
}

const UserWorkoutRoutines = () => {
  const { user } = useAuth0()
  const [data, setData] = useState<UserWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [userRes, routineRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-workout`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine`)
        ])

        const userWorkouts: UserWorkout[] = await userRes.json()
        const allRoutines: Routine[] = await routineRes.json()

        const filtered = userWorkouts
          .filter(w => w.user.auth0_id === user.sub)
          .map(w => ({
            ...w,
            routine: {
              ...w.routine,
              ...allRoutines.find(r => r.id === w.routine.id)
            }
          }))

        setData(filtered)
      } catch (err) {
        console.error('Error loading routines', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-40 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">Hubo un error al cargar tus rutinas. Inténtalo más tarde.</p>
  }

  if (data.length === 0) {
    return <p className="text-gray-500 text-center">No tienes rutinas asignadas.</p>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((workout) => (
        <div key={workout.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center">{workout.routine.name}</h2>

          {workout.routine.imageUrl ? (
            workout.routine.imageUrl.endsWith('.mp4') ? (
              <video className="w-full rounded-lg" controls src={workout.routine.imageUrl} />
            ) : (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={workout.routine.imageUrl}
                  alt={workout.routine.name || 'Rutina'}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              </div>
            )
          ) : (
            <div className="w-full h-40 bg-gray-200 rounded-lg" />
          )}

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Ejercicios</h3>
            {workout.routine.exercises && workout.routine.exercises.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {workout.routine.exercises.map((exercise) => (
                  <li key={exercise.id}>
                    <span className="font-medium">{exercise.name}</span>: {exercise.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No hay ejercicios asignados.</p>
            )}
          </div>

          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            onClick={() => alert(`Ver ejercicios de ${workout.routine.name}`)}
          >
            Ver ejercicios
          </button>
        </div>
      ))}
    </div>
  )
}

export default UserWorkoutRoutines
