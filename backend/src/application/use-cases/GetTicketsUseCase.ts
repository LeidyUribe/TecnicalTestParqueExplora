import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { TicketStatus } from '../../domain/value-objects/TicketStatus';
import { TicketResponseDTO } from '../dtos/TicketResponseDTO';

/**
 * Use Case: Obtener Tickets
 * Aplica Single Responsibility: solo se encarga de obtener tickets
 */
export class GetTicketsUseCase {
  constructor(private repository: ITicketRepository) {}

  async execute(status?: TicketStatus): Promise<TicketResponseDTO[]> {
    let tickets;

    if (status) {
      tickets = await this.repository.findByStatus(status);
    } else {
      tickets = await this.repository.findAll();
    }

    return tickets.map(this.toDTO);
  }

  private toDTO(ticket: any): TicketResponseDTO {
    const createdAt = ticket.createdAt instanceof Date 
      ? ticket.createdAt.toISOString() 
      : ticket.createdAt;
    const updatedAt = ticket.updatedAt instanceof Date 
      ? ticket.updatedAt.toISOString() 
      : ticket.updatedAt;

    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      createdAt,
      updatedAt,
      createdBy: ticket.createdBy
    };
  }
}

