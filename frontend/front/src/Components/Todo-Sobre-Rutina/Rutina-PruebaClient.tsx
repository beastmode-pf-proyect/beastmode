'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiPlay, FiClock, FiActivity } from 'react-icons/fi'
import Image from 'next/image'

interface Routine {
  id: string
  name: string
  description: string
  imageUrl: string
  isActive: boolean
  duration?: number
  difficulty?: string
}

const RoutineDetailPage = () => {
  const router = useRouter()
  const [trialRoutines, setTrialRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine`)
        const data = await res.json()

        if (Array.isArray(data)) {
          const trial = data.filter(routine => routine.name.toLowerCase().startsWith('prueba'))
          setTrialRoutines(trial)
        } else if (data.routines && Array.isArray(data.routines)) {
          const trial = data.routines.filter((routine: { name: string }) =>
            routine.name.toLowerCase().startsWith('prueba')
          )
          setTrialRoutines(trial)
        } else {
          throw new Error('Formato de datos inesperado')
        }
      } catch (err) {
        console.error('Error al cargar las rutinas', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchRoutines()
  }, [])

  const renderRoutineCard = (routine: Routine, index: number) => (
    <motion.div
      key={routine.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_15px_35px_-10px_rgba(0,0,0,0.2)] border border-white/30 group transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)]"
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
            <div className="flex items-center text-gray-700">
              <FiClock className="mr-2" />
              <span className="text-sm font-medium">{routine.duration} min</span>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => router.push(`/Dasboard-User/Rutina/rutinas/${routine.id}`)}
            className="flex-1 bg-gradient-to-r from-[#5e1914] via-[#5e1914] to-[#5e1914] text-white py-3 px-5 rounded-xl font-semibold shadow-lg hover:brightness-110 transition-all duration-300 transform hover:scale-105"
          >
            <FiPlay className="mr-1" />
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

  if (error || trialRoutines.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <FiActivity className="w-8 h-8 text-red-950" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {error ? 'Error al cargar rutinas' : 'No se encontraron rutinas'}
        </h3>
        <p className="text-gray-600">
          {error ? 'Inténtalo de nuevo más tarde' : 'No hay rutinas de prueba disponibles.'}
        </p>
      </div>
    )
  }

  return (
    <div className="relative px-6 py-16 min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/80 via-gray-200/50 to-gray-100/30 backdrop-blur-2xl z-0" />

      <div className="relative z-10 space-y-12">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight drop-shadow-md">
            ✨ Rutinas Exclusivas de Prueba
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-xl mx-auto">
            Una colección única pensada para potenciar tu entrenamiento desde el primer día.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {trialRoutines.map((routine, index) => renderRoutineCard(routine, index))}
        </div>
      </div>
    </div>
  )
}

export default RoutineDetailPage
