'use client';

import React from 'react';
import { Ticket, TicketStatus } from '@/types/ticket';
import { Table, TableRow, TableCell } from '../ui/Table';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

interface TicketListProps {
  tickets: Ticket[];
  onStatusChange?: (id: string, newStatus: TicketStatus) => void;
  isLoading?: boolean;
}

/**
 * Componente para listar tickets
 * Aplica Single Responsibility: solo muestra la lista
 */
export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  onStatusChange,
  isLoading = false
}) => {
  const getStatusVariant = (status: TicketStatus): 'success' | 'warning' | 'info' | 'danger' | 'default' => {
    switch (status) {
      case TicketStatus.OPEN:
        return 'info';
      case TicketStatus.IN_PROGRESS:
        return 'warning';
      case TicketStatus.RESOLVED:
        return 'success';
      case TicketStatus.CLOSED:
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: TicketStatus): string => {
    const labels: Record<TicketStatus, string> = {
      [TicketStatus.OPEN]: 'Abierto',
      [TicketStatus.IN_PROGRESS]: 'En Progreso',
      [TicketStatus.RESOLVED]: 'Resuelto',
      [TicketStatus.CLOSED]: 'Cerrado'
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string): string => {
    const labels: Record<string, string> = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      URGENT: 'Urgente'
    };
    return labels[priority] || priority;
  };

  const statusOptions = [
    { value: TicketStatus.OPEN, label: 'Abierto' },
    { value: TicketStatus.IN_PROGRESS, label: 'En Progreso' },
    { value: TicketStatus.RESOLVED, label: 'Resuelto' },
    { value: TicketStatus.CLOSED, label: 'Cerrado' }
  ];

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cargando tickets...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay tickets disponibles</p>
      </div>
    );
  }

  return (
    <Table headers={['ID', 'Título', 'Descripción', 'Estado', 'Prioridad', 'Creado', 'Acciones']}>
      {tickets.map((ticket) => (
        <TableRow key={ticket.id}>
          <TableCell>{ticket.id.substring(0, 8)}...</TableCell>
          <TableCell>
            <div className="font-medium">{ticket.title}</div>
          </TableCell>
          <TableCell>
            <div className="max-w-xs truncate">{ticket.description}</div>
          </TableCell>
          <TableCell>
            <Tag variant={getStatusVariant(ticket.status)}>
              {getStatusLabel(ticket.status)}
            </Tag>
          </TableCell>
          <TableCell>{getPriorityLabel(ticket.priority)}</TableCell>
          <TableCell>
            {new Date(ticket.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </TableCell>
          <TableCell className="min-w-[180px]">
            {onStatusChange && ticket.status !== TicketStatus.CLOSED && (
              <Select
                value={ticket.status}
                onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
                options={statusOptions.filter(opt => opt.value !== ticket.status)}
                className="text-sm w-full"
              />
            )}
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
};





