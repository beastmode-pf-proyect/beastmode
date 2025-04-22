'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#5e1914] to-[#8a2a22] bg-clip-text text-transparent mb-2">
          Detalle de Rutina
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Sigue cada ejercicio con precisión para maximizar tus resultados
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-[#5e1914]/10 h-12 w-12"></div>
          </div>
        </div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-[#5e1914] mb-4">
            <FiActivity className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No hay ejercicios asignados</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza agregando ejercicios a esta rutina</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {exercises.map((e, index) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row">
                {e.exercise.imageUrl && (
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <Image
                      src={e.exercise.imageUrl}
                      alt={e.exercise.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 2} 
                    />
                    <div className="absolute top-3 left-3 bg-[#5e1914] text-white text-xs font-bold px-2 py-1 rounded z-10">
                      #{index + 1}
                    </div>
                  </div>
                )}
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{e.exercise.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#5e1914]/10 text-[#5e1914]">
                      Activo
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{e.exercise.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <FiRepeat className="text-[#5e1914] mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Series</p>
                        <p className="font-semibold">{e.sets}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiZap className="text-[#5e1914] mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Repeticiones</p>
                        <p className="font-semibold">{e.reps}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-[#5e1914] mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Duración</p>
                        <p className="font-semibold">{e.duration}s</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiActivity className="text-[#5e1914] mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Descanso</p>
                        <p className="font-semibold">{e.rest}s</p>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-[#5e1914] to-[#8a2a22] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    Iniciar ejercicio
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RoutineDetailPage