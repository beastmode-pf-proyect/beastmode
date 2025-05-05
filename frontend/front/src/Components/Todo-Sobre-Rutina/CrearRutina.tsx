'use client';
import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface RoutineData {
  name: string;
  description: string;
  isActive: boolean;
}

const RoutineForm = () => {
  const [routineData, setRoutineData] = useState<RoutineData>({
    name: '',
    description: '',
    isActive: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setRoutineData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setRoutineData({
      name: '',
      description: '',
      isActive: false
    });
    removeImage();
    setSubmitAttempted(false);
  };

  const validateForm = () => {
    const errors = {
      name: routineData.name.trim() === '',
      description: routineData.description.trim() === '',
      file: file === null
    };
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) {
      setMessage('❌ Por favor completa todos los campos requeridos');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('name', routineData.name);
      formData.append('description', routineData.description);
      formData.append('isActive', String(routineData.isActive));
      if (file) formData.append('file', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workout-routine/create`, {
        method: 'POST',
        body: formData
      });

      const responseText = await response.text();

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || 'Error del servidor');
        } catch {
          throw new Error(responseText || `Error HTTP: ${response.status}`);
        }
      }

      setMessage(`✅ ${responseText}`);
      resetForm();

    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showError = (fieldEmpty: boolean) => {
    return submitAttempted && fieldEmpty;
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl border border-gray-200">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear Nueva Rutina</h2>
        <p className="text-gray-600">Diseña la rutina perfecta para tus clientes</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
            Nombre de la Rutina <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={routineData.name}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 shadow-sm ${
              showError(routineData.name.trim() === '') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#5e1914]'
            }`}
            placeholder="Ej: Rutina de Definición"
          />
          {showError(routineData.name.trim() === '') && (
            <p className="mt-1 text-sm text-red-500">El nombre es requerido</p>
          )}
        </motion.div>

        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
            Descripción Detallada <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={routineData.description}
            onChange={handleChange}
            required
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 shadow-sm ${
              showError(routineData.description.trim() === '') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#5e1914]'
            }`}
            placeholder="Describe los objetivos, ejercicios, series y repeticiones..."
          />
          {showError(routineData.description.trim() === '') && (
            <p className="mt-1 text-sm text-red-500">La descripción es requerida</p>
          )}
        </motion.div>

        

        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-4">
          <div>
            <label htmlFor="file" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              Imagen de la Rutina <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-4">
              <label className={`flex flex-col items-center justify-center w-full px-4 py-6 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 ${
                showError(file === null) ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke={showError(file === null) ? '#ef4444' : '#5e1914'}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={`mt-2 text-sm font-medium ${showError(file === null) ? 'text-red-500' : 'text-[#5e1914]'}`}>
                  {file ? file.name : 'Seleccionar imagen (requerido)'}
                </span>
                <input type="file" id="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" required />
              </label>
              {file && (
                <button type="button" onClick={removeImage} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300">
                  Eliminar
                </button>
              )}
            </div>
            {showError(file === null) && (
              <p className="mt-1 text-sm text-red-500">La imagen es obligatoria</p>
            )}
          </div>

          <AnimatePresence>
            {imagePreview && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h3>
                <div className="relative w-full h-64 rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Vista previa de la rutina"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-xl text-white font-bold shadow-lg transition-all duration-300 ${
              isLoading
                ? 'bg-[#5e1914]/60 cursor-not-allowed'
                : 'bg-[#5e1914] hover:bg-[#4c1410] hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando rutina...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Crear Rutina
              </span>
            )}
          </button>
        </motion.div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-xl text-center ${
                message.startsWith('✅') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {message.startsWith('✅') ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default RoutineForm;
