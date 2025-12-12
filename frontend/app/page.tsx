'use client';

import React, { useState, useEffect } from 'react';
import { TicketForm } from '@/components/tickets/TicketForm';
import { TicketList } from '@/components/tickets/TicketList';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Ticket, TicketStatus, TicketPriority, CreateTicketRequest, UpdateStatusRequest } from '@/types/ticket';
import { createTicketService } from '@/services/api/ticketService';
import { config } from '@/lib/config';

/**
 * Página principal - Dashboard de tickets
 * Combina Server y Client Components según necesidad
 */
export default function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ticketService = createTicketService(config.apiUrl, config.apiKey);

  // Cargar tickets al montar el componente
  useEffect(() => {
    loadTickets();
  }, []);

  // Filtrar tickets cuando cambia el filtro
  useEffect(() => {
    if (selectedStatus === 'ALL') {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter(t => t.status === selectedStatus));
    }
  }, [selectedStatus, tickets]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ticketService.getTickets();
      setTickets(data);
      setFilteredTickets(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tickets');
      console.error('Error loading tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (data: CreateTicketRequest) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const newTicket = await ticketService.createTicket(data);
      setTickets(prev => [newTicket, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Error al crear ticket');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: TicketStatus) => {
    try {
      setError(null);
      const updatedTicket = await ticketService.updateTicketStatus(id, { status: newStatus });
      setTickets(prev =>
        prev.map(ticket => (ticket.id === id ? updatedTicket : ticket))
      );
    } catch (err: any) {
      setError(err.message || 'Error al actualizar estado');
      console.error('Error updating status:', err);
    }
  };

  const statusFilterOptions = [
    { value: 'ALL', label: 'Todos' },
    { value: TicketStatus.OPEN, label: 'Abiertos' },
    { value: TicketStatus.IN_PROGRESS, label: 'En Progreso' },
    { value: TicketStatus.RESOLVED, label: 'Resueltos' },
    { value: TicketStatus.CLOSED, label: 'Cerrados' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Portal de Seguimiento de Incidencias
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-8 items-center">
          {/* Formulario de creación centrado */}
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Crear Nuevo Ticket</h2>
              <TicketForm onSubmit={handleCreateTicket} isLoading={isSubmitting} />
            </div>
          </div>

          {/* Lista de tickets */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <h2 className="text-xl font-semibold">Tickets</h2>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as TicketStatus | 'ALL')}
                    options={statusFilterOptions}
                    className="w-56"
                  />
                  <Button onClick={loadTickets} variant="secondary" className="w-full sm:w-auto">
                    Actualizar
                  </Button>
                </div>
              </div>
              <TicketList
                tickets={filteredTickets}
                onStatusChange={handleStatusChange}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            Portal de Seguimiento de Incidencias © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}





