'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

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
      const response = await fetch('http://localhost:3000/workout-routine/create', {
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
    <div className="max-w-2xl mx-auto mt-14 px-10 py-12 bg-red-950/95 backdrop-blur-md rounded-3xl shadow-xl border border-red-800">
      <h2 className="text-4xl font-extrabold text-white text-center mb-10 tracking-tight drop-shadow-xl">
        🏋️‍♂️ Crear Nueva Rutina
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-7 text-white">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-white">
                Nombre de la rutina
              </label>
              <Field
                type="text"
                name="name"
                className="mt-1 block w-full rounded-xl border border-red-700 bg-white/90 text-red-900 shadow-sm px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-300"
              />
              <ErrorMessage name="name" component="div" className="text-red-200 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-white">
                Descripción
              </label>
              <Field
                as="textarea"
                name="description"
                rows={4}
                className="mt-1 block w-full rounded-xl border border-red-700 bg-white/90 text-red-900 shadow-sm px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-300"
              />
              <ErrorMessage name="description" component="div" className="text-red-200 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-semibold text-white">
                Imagen (URL opcional)
              </label>
              <Field
                type="text"
                name="imageUrl"
                className="mt-1 block w-full rounded-xl border border-red-700 bg-white/90 text-red-900 shadow-sm px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-300"
              />
              <ErrorMessage name="imageUrl" component="div" className="text-red-200 text-sm mt-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-xl bg-white text-red-950 font-bold text-lg tracking-wide hover:bg-red-100 transition-all duration-200 ease-in-out disabled:opacity-50"
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
