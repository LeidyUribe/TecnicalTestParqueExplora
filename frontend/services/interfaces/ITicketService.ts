import { Ticket, CreateTicketRequest, TicketFilters, UpdateStatusRequest } from '@/types/ticket';

/**
 * Interface del servicio de tickets
 * Aplica Dependency Inversion Principle
 */
export interface ITicketService {
  createTicket(data: CreateTicketRequest): Promise<Ticket>;
  getTickets(filters?: TicketFilters): Promise<Ticket[]>;
  updateTicketStatus(id: string, data: UpdateStatusRequest): Promise<Ticket>;
}





