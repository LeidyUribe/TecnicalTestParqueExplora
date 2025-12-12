import { ITicketService } from '../interfaces/ITicketService';
import { Ticket, CreateTicketRequest, TicketFilters, UpdateStatusRequest } from '@/types/ticket';
import { ApiClient } from './apiClient';

/**
 * Implementación del servicio de tickets
 * Aplica Dependency Inversion: implementa la interfaz
 * Aplica Single Responsibility: solo maneja operaciones de tickets
 */
export class TicketService implements ITicketService {
  constructor(private apiClient: ApiClient) {}

  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    return this.apiClient.post<Ticket>('/tickets', data);
  }

  async getTickets(filters?: TicketFilters): Promise<Ticket[]> {
    const queryParams = filters?.status ? `?status=${filters.status}` : '';
    return this.apiClient.get<Ticket[]>(`/tickets${queryParams}`);
  }

  async updateTicketStatus(id: string, data: UpdateStatusRequest): Promise<Ticket> {
    return this.apiClient.patch<Ticket>(`/tickets/${id}/status`, data);
  }
}

/**
 * Factory function para crear el servicio
 * Aplica Dependency Injection
 */
export function createTicketService(apiUrl: string, apiKey: string): ITicketService {
  const apiClient = new ApiClient(apiUrl, apiKey);
  return new TicketService(apiClient);
}





