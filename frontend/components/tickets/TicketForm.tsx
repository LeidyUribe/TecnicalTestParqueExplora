'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { TicketPriority } from '@/types/ticket';

interface TicketFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    priority: TicketPriority;
    createdBy?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Componente de formulario para crear tickets
 * Aplica Single Responsibility: solo maneja el formulario
 */
export const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [createdBy, setCreatedBy] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        createdBy: createdBy.trim() || undefined
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority(TicketPriority.MEDIUM);
      setCreatedBy('');
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const priorityOptions = [
    { value: TicketPriority.LOW, label: 'Baja' },
    { value: TicketPriority.MEDIUM, label: 'Media' },
    { value: TicketPriority.HIGH, label: 'Alta' },
    { value: TicketPriority.URGENT, label: 'Urgente' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        placeholder="Ingrese el título del ticket"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ingrese la descripción del ticket"
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <Select
        label="Prioridad"
        value={priority}
        onChange={(e) => setPriority(e.target.value as TicketPriority)}
        options={priorityOptions}
      />

      <Input
        label="Creado por (opcional)"
        value={createdBy}
        onChange={(e) => setCreatedBy(e.target.value)}
        placeholder="Nombre del usuario"
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Crear Ticket
      </Button>
    </form>
  );
};





