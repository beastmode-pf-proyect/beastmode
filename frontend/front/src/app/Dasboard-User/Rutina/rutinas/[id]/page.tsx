'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiClock, FiRepeat, FiActivity, FiZap } from 'react-icons/fi'
import Image from 'next/image'

interface ExerciseData {
  id: string
  sets: number
  reps: number
  duration: number
  rest: number
  order: number
  isActive: boolean
  exercise: {
    id: string
    name: string
    description: string
    imageUrl: string
    isActive: boolean
  }
}

const RoutineDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [exercises, setExercises] = useState<ExerciseData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routine-exercises/routine-exercises/${id}`)
        const data: ExerciseData[] = await res.json()
        setExercises(data)
      } catch (error) {
        console.error('Error al cargar ejercicios', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchExercises()
  }, [id])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5e1914] to-[#8a2a22] bg-clip-text text-transparent">
          Detalle de Rutina
        </h1>
        <p className="text-gray-500 mt-2 text-sm">Sigue cada ejercicio paso a paso</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2].map((_, index) => (
            <div key={index} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto h-16 w-16 text-[#5e1914] mb-3">
            <FiActivity className="w-full h-full" />
          </div>
          <h3 className="text-base font-medium text-gray-900">No hay ejercicios asignados</h3>
          <p className="mt-1 text-sm text-gray-500">Agrega ejercicios para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {exercises.map((e, index) => (
            
            <motion.div
              key={e.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
            >
              <div className="flex flex-col md:flex-row h-70">
                {e.exercise.imageUrl && (
                  <div className="w-full md:w-[50%] relative aspect-video md:aspect-auto md:h-auto overflow-hidden">
                    <Image
                      src={e.exercise.imageUrl}
                      alt={e.exercise.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index < 2}
                    />
                    <div className="absolute top-1 left-1 bg-[#5e1914]/90 text-white text-xs px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-transparent" />
                  </div>
                )}

                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-semibold text-gray-900 truncate">{e.exercise.name}</h3>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${e.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {e.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{e.exercise.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center text-xs">
                      <FiRepeat className="text-[#5e1914] mr-1" />
                      <span className="font-medium">{e.sets} series</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <FiZap className="text-[#5e1914] mr-1" />
                      <span className="font-medium">{e.reps} reps</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <FiClock className="text-[#5e1914] mr-1" />
                      <span className="font-medium">{e.duration}s</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <FiActivity className="text-[#5e1914] mr-1" />
                      <span className="font-medium">{e.rest}s</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push(`/Dasboard-User/Rutina/ejercicio/${e.exercise.id}`)}
                className="w-full border-t border-gray-100 text-sm font-medium text-[#5e1914] hover:bg-gray-50 py-2 px-4 transition-colors"
              >
                Comenzar ejercicio →
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RoutineDetailPage
