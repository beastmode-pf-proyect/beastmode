'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import {
  FiRepeat,
  FiPlay,
  FiPause,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { useWindowSize } from '@react-hook/window-size'

interface Exercise {
  id: string
  name: string
  description: string
  imageUrl: string
  isActive: boolean
  category: string
}

interface RoutineExercise {
  id: string
  sets: number
  order: number
  isActive: boolean
  exercise: Exercise
  duration: number
  restDuration: number
  reps: number 
}

const ExerciseDetailPage = () => {
  const { id } = useParams()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [routineData, setRoutineData] = useState<Omit<RoutineExercise, 'exercise'> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [currentSet, setCurrentSet] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [windowWidth, windowHeight] = useWindowSize()

  const [timeLeft, setTimeLeft] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [restTimeLeft, setRestTimeLeft] = useState(0)

  const progressPercentage = routineData ? ((currentSet) / routineData.sets) * 100 : 0

  const fetchExerciseData = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/routine-exercises`)
      const data: RoutineExercise[] = await res.json()
      const match = data.find((item) => item.exercise.id === id)

      if (match) {
        setExercise(match.exercise)
        setRoutineData({
          id: match.id,
          sets: match.sets,
          order: match.order,
          isActive: match.isActive,
          duration: match.duration,
          restDuration: match.restDuration,
          reps: match.reps 
        })
        setError(false)
      } else {
        setError(true)
      }
    } catch (error) {
      console.error('Error fetching exercise data:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) fetchExerciseData()
  }, [id, fetchExerciseData])

  const timerLogic = useCallback(() => {
    if (!routineData) return

    if (currentSet < routineData.sets && !isResting) {
      setCurrentSet((prevSet) => prevSet + 1)
      setTimeLeft(routineData.duration)
    } else if (currentSet < routineData.sets && isResting) {
      setRestTimeLeft(routineData.restDuration)
      setIsResting(true)
    } else {
      setIsActive(false)
      setCompleted(true)
      setTimeout(() => setCompleted(false), 5000)
    }
  }, [routineData, currentSet, isResting])

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  useEffect(() => {
    if (!isResting || restTimeLeft <= 0) return

    const interval = setInterval(() => {
      setRestTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isResting, restTimeLeft])

  useEffect(() => {
    if (timeLeft === 0 && !isResting) {
      setIsActive(false)
      timerLogic()
    }
    if (restTimeLeft === 0 && isResting) {
      setIsResting(false)
      setTimeLeft(routineData?.duration || 30)
    }
  }, [timeLeft, isResting, restTimeLeft, timerLogic, routineData])

  const handleReset = useCallback(() => {
    setIsActive(false)
    setTimeLeft(routineData?.duration || 30)
    setRestTimeLeft(routineData?.restDuration || 10)
    setIsResting(false)
    setCurrentSet(0)
    setCompleted(false)
  }, [routineData])

  const startTimer = () => {
    if (currentSet === 0) {
      setCurrentSet(1)
    }
    setIsActive(true)
    setTimeLeft(routineData?.duration || 30)
  }

  const pauseTimer = () => setIsActive(false)

  const isLastSet = currentSet === routineData?.sets

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !exercise || !routineData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 space-y-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <FiAlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Error al cargar el ejercicio</h2>
        <p className="text-gray-600">Intenta recargar la página o verifica tu conexión</p>
        <button
          onClick={fetchExerciseData}
          className="mt-4 bg-[#5e1914] text-white px-6 py-2 rounded-lg hover:bg-[#4a1410] transition-colors"
        >
          Reintentar
        </button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 relative">
      <AnimatePresence>
        {completed && (
          <Confetti
            width={windowWidth}
            height={windowHeight}
            recycle={false}
            numberOfPieces={400}
            colors={['#5e1914', '#7a1f17', '#9d261d']}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
      >
            <div className="relative h-200 w-full">
  {exercise.imageUrl && (
    <Image
      src={exercise.imageUrl}
      alt={exercise.name}
      layout="fill"
      objectFit="cover"
      className="object-cover"
      priority
      sizes="(max-width: 368px) 100vw, (max-width: 1200px) 50vw, 40vw"
    />
  )}
  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
</div>

        <div className="p-8">
          <h2 className="text-4xl font-bold text-[#5e1914] mb-4">
            {exercise.name}
          </h2>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {exercise.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <StatBox 
              icon={<FiRepeat />} 
              label="Series" 
              value={routineData.sets} 
            />
            <StatBox 
              icon={<FiClock />} 
              label="Duración"
              value="3 minutos - Maximo"
            />
            <StatBox 
              icon={<FiRepeat />} 
              label="Repeticiones"
              value={routineData.reps} 
            />
          </div>

          <div className="space-y-8">
            <ProgressSection
              label={`Set ${currentSet} de ${routineData.sets}`}
              progress={progressPercentage}
              color="bg-[#5e1914]"
            />
            <ProgressSection
              label="Tiempo restante"
              progress={(timeLeft / (routineData?.duration || 30)) * 100}
              color="bg-green-500"
            />
            
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={isActive ? pauseTimer : startTimer}
              className={`flex-1 py-4 px-8 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold shadow-lg transition-all ${isLastSet ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#5e1914] to-[#7a1f17] text-white hover:shadow-[#5e1914]/20'}`}
              disabled={isLastSet}
            >
              {isActive ? (
                <>
                  <FiPause className="text-xl" />
                  Pausar
                </>
              ) : (
                <>
                  <FiPlay className="text-xl" />
                  Comenzar
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="bg-gray-100 text-gray-700 py-4 px-8 rounded-xl flex items-center justify-center gap-2 text-lg font-medium shadow-sm hover:shadow-md transition-shadow"
            >
              Reiniciar
            </motion.button>
          </div>

          {completed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-green-50 rounded-xl border border-green-100 text-center"
            >
              <FiCheckCircle className="inline-block text-green-600 text-3xl mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                ¡Ejercicio completado!
              </h3>
              <p className="text-green-600">Buen trabajo, sigue así</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

const StatBox = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <motion.div className="bg-gray-50 p-4 rounded-xl border border-gray-100" whileHover={{ y: -2 }}>
    <div className="flex items-center gap-3 mb-2 text-[#5e1914]">
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
  </motion.div>
)

const ProgressSection = ({
  label,
  progress,
  color
}: {
  label: string
  progress: number
  color: string
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
    </div>
  </div>
)

export default ExerciseDetailPage
