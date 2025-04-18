'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { FaDumbbell, FaSignature, FaAlignLeft, FaImage, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface WorkoutRoutineForm {
  name: string;
  description: string;
  imageUrl?: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('El nombre es requerido'),
  description: Yup.string().required('La descripción es requerida'),
  imageUrl: Yup.string().url('Debe ser una URL válida').nullable(),
});

const CrearRutina: React.FC = () => {
  const initialValues: WorkoutRoutineForm = {
    name: '',
    description: '',
    imageUrl: '',
  };

  const handleSubmit = async (
    values: WorkoutRoutineForm,
    { setSubmitting, resetForm }: FormikHelpers<WorkoutRoutineForm>
  ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          imageUrl: values.imageUrl || null,
        }),
      });

      if (!response.ok) throw new Error('Error al crear la rutina');

      Swal.fire({
        title: '¡Éxito!',
        text: 'Rutina creada exitosamente',
        icon: 'success',
        confirmButtonText: 'Ok',
        background: '#1a1a1a',
        color: '#fff',
      });

      resetForm();
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al crear la rutina',
        icon: 'error',
        confirmButtonText: 'Ok',
        background: '#1a1a1a',
        color: '#fff',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto mt-16 px-10 py-12 bg-gradient-to-br from-[#d41616] via-[#5e1914] to-[#5e1914] rounded-3xl shadow-2xl border border-[#5e1914]/70 relative overflow-hidden"
    >
      {/* Elementos decorativos */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ffffff10] rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#d4161610] rounded-full filter blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-white tracking-wide flex justify-center items-center gap-3"
          >
            <motion.div
              animate={{ rotate: 10, scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FaDumbbell className="text-white drop-shadow-lg" />
            </motion.div>
            Crear Nueva Rutina
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-red-100 mt-2 text-sm tracking-wide"
          >
            Llena los campos para agregar una rutina personalizada.
          </motion.p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) =>
            isSubmitting ? (
              <div className="space-y-8 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-1/3 bg-white/30 rounded-md" />
                    <div className="h-10 w-full bg-white/20 rounded-lg" />
                  </div>
                ))}
                <div className="h-12 w-full bg-white/30 rounded-xl" />
              </div>
            ) : (
              <Form className="space-y-8 text-white">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-white">
                    <FaSignature className="text-white" />
                    Nombre de la rutina
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="mt-2 block w-full rounded-xl border-2 border-[#842b2b]/80 bg-white/95 text-red-950 shadow-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-300 transition-all duration-300 placeholder-gray-400"
                    placeholder="Ej: Rutina de fuerza avanzada"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-200 text-sm mt-1 ml-1" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-white">
                    <FaAlignLeft className="text-white" />
                    Descripción
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    className="mt-2 block w-full rounded-xl border-2 border-[#842b2b]/80 bg-white/95 text-red-950 shadow-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-300 transition-all duration-300 placeholder-gray-400"
                    placeholder="Describe los ejercicios, duración, objetivos..."
                  />
                  <ErrorMessage name="description" component="div" className="text-red-200 text-sm mt-1 ml-1" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="imageUrl" className="flex items-center gap-2 text-sm font-semibold text-white">
                    <FaImage className="text-white" />
                    Imagen (URL opcional)
                  </label>
                  <Field
                    type="text"
                    name="imageUrl"
                    className="mt-2 block w-full rounded-xl border-2 border-[#842b2b]/80 bg-white/95 text-red-950 shadow-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-300 transition-all duration-300 placeholder-gray-400"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <ErrorMessage name="imageUrl" component="div" className="text-red-200 text-sm mt-1 ml-1" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#ffffff] to-[#f5f5f5] text-[#5e1914] font-extrabold text-lg tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out disabled:opacity-50 group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:opacity-30 transition-opacity duration-300"></span>
                    <div className="relative flex items-center justify-center gap-2">
                      <FaPlus className="transition-transform duration-300 group-hover:rotate-90" />
                      Crear Rutina
                    </div>
                  </button>
                </motion.div>
              </Form>
            )
          }
        </Formik>
      </div>
    </motion.div>
  );
};

export default CrearRutina;