'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { FaDumbbell, FaSignature, FaAlignLeft, FaImage } from 'react-icons/fa';

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
      });

      resetForm();
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al crear la rutina',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 px-10 py-12 bg-gradient-to-br from-[#d41616] via-[#5e1914] to-[#5e1914] rounded-3xl shadow-2xl border border-[#5e1914]/70">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-white tracking-wide flex justify-center items-center gap-2">
          <FaDumbbell className="text-white drop-shadow-lg" />
          Crear Nueva Rutina
        </h2>
        <p className="text-red-100 mt-2 text-sm tracking-wide">Llena los campos para agregar una rutina personalizada.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-8 text-white">
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-white">
                <FaSignature className="text-white" />
                Nombre de la rutina
              </label>
              <Field
                type="text"
                name="name"
                className="mt-2 block w-full rounded-lg border border-[#842b2b] bg-white/90 text-red-950 shadow-sm px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-300 transition"
              />
              <ErrorMessage name="name" component="div" className="text-red-200 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-white">
                <FaAlignLeft className="text-white" />
                Descripción
              </label>
              <Field
                as="textarea"
                name="description"
                rows={4}
                className="mt-2 block w-full rounded-lg border border-[#842b2b] bg-white/90 text-red-950 shadow-sm px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-300 transition"
              />
              <ErrorMessage name="description" component="div" className="text-red-200 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="imageUrl" className="flex items-center gap-2 text-sm font-semibold text-white">
                <FaImage className="text-white" />
                Imagen (URL opcional)
              </label>
              <Field
                type="text"
                name="imageUrl"
                className="mt-2 block w-full rounded-lg border border-[#842b2b] bg-white/90 text-red-950 shadow-sm px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-300 transition"
              />
              <ErrorMessage name="imageUrl" component="div" className="text-red-200 text-sm mt-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-xl bg-[#ffffff] text-[#5e1914] font-extrabold text-lg tracking-wide shadow-lg hover:bg-red-100 hover:scale-[1.02] transition-all duration-200 ease-in-out disabled:opacity-50"
            >
              {isSubmitting ? 'Creando...' : 'Crear Rutina'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CrearRutina;
