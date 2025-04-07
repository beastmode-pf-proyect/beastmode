"use client";
import React, { useState } from 'react';
import axios from 'axios';

const WorkoutRoutineForm = () => {
  const [routine, setRoutine] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/workout-routine/create', routine);
      alert('Rutina creada exitosamente');
      setRoutine({ name: '', description: '', imageUrl: '' });
    } catch (error) {
      console.error(error);
      alert('Error al crear la rutina');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Crear Nueva Rutina</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre</label>
          <input
            type="text"
            value={routine.name}
            onChange={(e) => setRoutine({...routine, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            value={routine.description}
            onChange={(e) => setRoutine({...routine, description: e.target.value})}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL de la imagen</label>
          <input
            type="url"
            value={routine.imageUrl}
            onChange={(e) => setRoutine({...routine, imageUrl: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Crear Rutina
        </button>
      </form>
    </div>
  );
};

export default WorkoutRoutineForm;