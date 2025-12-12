import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { TicketStatus } from '../../domain/value-objects/TicketStatus';
import { UpdateStatusDTO } from '../dtos/UpdateStatusDTO';
import { TicketResponseDTO } from '../dtos/TicketResponseDTO';
import { NotFoundError } from '../../shared/errors/NotFoundError';

/**
 * Use Case: Actualizar Estado de Ticket
 * Aplica Single Responsibility: solo se encarga de actualizar estados
 */
export class UpdateTicketStatusUseCase {
  constructor(private repository: ITicketRepository) {}

  async execute(id: string, dto: UpdateStatusDTO): Promise<TicketResponseDTO> {
    // Buscar ticket existente
    const existingTicket = await this.repository.findById(id);

    if (!existingTicket) {
      throw new NotFoundError(`Ticket with id ${id} not found`);
    }

    // Validar transición de estado (lógica de dominio)
    if (!existingTicket.canTransitionTo(dto.status)) {
      throw new Error(
        `Invalid status transition from ${existingTicket.status} to ${dto.status}`
      );
    }

    // Actualizar estado
    const updatedTicket = await this.repository.updateStatus(id, dto.status);

    // Retornar DTO
    return this.toDTO(updatedTicket);
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

