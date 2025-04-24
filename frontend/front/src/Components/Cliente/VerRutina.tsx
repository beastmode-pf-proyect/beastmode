'use client'
import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiPlay,  FiClock, FiActivity } from 'react-icons/fi'

interface Routine {
  id: string
  name: string
  description: string
  imageUrl: string
  isActive: boolean
  duration?: number
  difficulty?: string
}

interface User {
  auth0_id: string
}

interface UserWorkout {
  id: string
  user: User
  routine: Routine
  isActive: boolean
}

const UserWorkoutRoutines = () => {
  const { user } = useAuth0()
  const router = useRouter()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchRoutines = async () => {
      try {
        const [userRes, routineRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-workout`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine`)
        ])

        const userWorkouts: UserWorkout[] = await userRes.json()
        const allRoutines: Routine[] = await routineRes.json()

        const userAssigned = userWorkouts
          .filter(w => w.user.auth0_id === user.sub)
          .map(w => ({
            ...w.routine,
            ...allRoutines.find(r => r.id === w.routine.id)
          }))

        if (userAssigned.length > 0) {
          setRoutines(userAssigned)
        } else {
          const pruebas = allRoutines.filter(r => r.name.toLowerCase().startsWith("prueba"))
          setRoutines(pruebas)
        }
      } catch (err) {
        console.error('Error loading routines', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchRoutines()
  }, [user])

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm h-96 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (error || routines.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <FiActivity className="w-8 h-8 text-red-950" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {error ? 'Error al cargar rutinas' : 'No se encontraron rutinas'}
        </h3>
        <p className="text-gray-600">
          {error ? 'Inténtalo de nuevo más tarde' : 'No tienes rutinas asignadas o no hay rutinas disponibles con el nombre Prueba.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {routines.map((routine, index) => (
        <motion.div
          key={routine.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
        >
          <div className="relative h-48 w-full">
            {routine.imageUrl ? (
              routine.imageUrl.endsWith('.mp4') ? (
                <video 
                  className="w-full h-full object-cover" 
                  src={routine.imageUrl} 
                  muted 
                  loop 
                  autoPlay
                />
              ) : (
                <Image
                  src={routine.imageUrl}
                  alt={routine.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                />
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h2 className="text-xl font-bold text-white">{routine.name}</h2>
              {routine.difficulty && (
                <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-white/20 text-white rounded-full backdrop-blur-sm">
                  {routine.difficulty}
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              {routine.duration && (
                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-2" />
                  <span className="text-sm font-medium">{routine.duration} min</span>
                </div>
              )}
              
              <button 
                onClick={() => toggleExpand(routine.id)}
                className="text-sm font-medium text-red-950 hover:text-red-800 transition-colors"
              >
                {expandedId === routine.id ? 'Ver menos' : 'Ver descripción'}
              </button>
            </div>

            {expandedId === routine.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 text-gray-600 text-sm"
              >
                {routine.description || 'Esta rutina no tiene descripción disponible.'}
              </motion.div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => router.push(`/Dasboard-User/Rutina/rutinas/${routine.id}`)}
                className="flex-1 bg-gradient-to-r from-red-900 to-red-800 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                <FiPlay className="mr-2" />
                Comenzar
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default UserWorkoutRoutines
