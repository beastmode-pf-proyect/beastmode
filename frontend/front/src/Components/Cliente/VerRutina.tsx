'use client'
import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiPlay, FiClock, FiActivity } from 'react-icons/fi'

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

interface Subscription {
  status: string
  isActive: boolean
  user: {
    auth0_id: string
  }
}

const UserWorkoutRoutines = () => {
  const { user } = useAuth0()
  const router = useRouter()
  const [assignedRoutines, setAssignedRoutines] = useState<Routine[]>([])
  const [trialRoutines, setTrialRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchRoutines = async () => {
      try {
        const [userRes, routineRes, subsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-workout`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions`)
        ])

        const userWorkouts: UserWorkout[] = await userRes.json()
        const allRoutines: Routine[] = await routineRes.json()
        const subscriptions: Subscription[] = await subsRes.json()

        const activeSub = subscriptions.find(
          sub => sub.user.auth0_id === user.sub && sub.isActive
        )
        setHasActiveSubscription(!!activeSub)

        const assigned = userWorkouts
          .filter(w => w.user.auth0_id === user.sub)
          .map(w => ({
            ...w.routine,
            ...allRoutines.find(r => r.id === w.routine.id)
          }))

        const trial = allRoutines.filter(r => r.name.toLowerCase().startsWith("prueba"))

        setAssignedRoutines(assigned)
        setTrialRoutines(trial)
      } catch (err) {
        console.error('Error loading routines or subscriptions', err)
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

  const renderRoutineCard = (routine: Routine, index: number) => (
    <motion.div
      key={routine.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
    >
      <div className="relative h-64 w-full overflow-hidden">
        {routine.imageUrl ? (
          routine.imageUrl.endsWith('.mp4') ? (
            <video 
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105" 
              src={routine.imageUrl} 
              muted 
              loop 
              autoPlay
            />
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={routine.imageUrl}
                alt={routine.name}
                fill
                className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 3}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            </div>
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <h2 className="text-2xl font-bold text-white drop-shadow-md">{routine.name}</h2>
          {routine.difficulty && (
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/30">
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
  )

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

  if (error || (assignedRoutines.length === 0 && trialRoutines.length === 0)) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <FiActivity className="w-8 h-8 text-red-950" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {error ? 'Error al cargar rutinas' : 'No se encontraron rutinas'}
        </h3>
        <p className="text-gray-600">
          {error ? 'Inténtalo de nuevo más tarde' : 'No tienes rutinas asignadas ni de prueba disponibles.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {assignedRoutines.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tus rutinas de tu Plan</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {assignedRoutines.map((routine, index) => renderRoutineCard(routine, index))}
          </div>
        </div>
      )}

      {trialRoutines.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rutinas de prueba</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trialRoutines.map((routine, index) => renderRoutineCard(routine, index))}

            {!hasActiveSubscription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: trialRoutines.length * 0.1 }}
                // onClick={() => router.push('/Membresias')}
                className="cursor-pointer flex flex-col justify-center items-center p-6 h-full bg-gradient-to-br from-red-100 to-white border-2 border-dashed border-red-300 rounded-2xl hover:bg-red-200 transition-colors"
              >
                <span className="text-lg font-semibold text-red-800 text-center">
                  ¿Te gustaron estas rutinas?
                </span>
                <span className="text-sm text-red-700 mt-1 text-center">
                  Descubre más rutinas premium que tenemos preparadas par ti
                </span>
                {/* <div className="mt-4 px-4 py-2 bg-red-800 text-white rounded-lg font-medium hover:bg-red-900 transition">
                  Ver Membresías
                </div> */}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserWorkoutRoutines