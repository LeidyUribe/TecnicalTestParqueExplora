import { TicketPriority } from '../../domain/value-objects/TicketPriority';

/**
 * DTO para crear un ticket
 * Aplica principio de separación de capas
 */
export interface CreateTicketDTO {
  title: string;
  description: string;
  priority?: TicketPriority;
  createdBy?: string;
}





