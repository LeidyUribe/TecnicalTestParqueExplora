import { Ticket } from '../../domain/entities/Ticket';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { TicketPriority, DEFAULT_PRIORITY } from '../../domain/value-objects/TicketPriority';
import { CreateTicketDTO } from '../dtos/CreateTicketDTO';
import { TicketResponseDTO } from '../dtos/TicketResponseDTO';
import { generateUUID } from '../../shared/utils/uuid';

/**
 * Use Case: Crear Ticket
 * Aplica Single Responsibility Principle: solo se encarga de crear tickets
 * Aplica Dependency Inversion: depende de la interfaz, no de la implementación
 */
export class CreateTicketUseCase {
  constructor(private repository: ITicketRepository) {}

  async execute(dto: CreateTicketDTO): Promise<TicketResponseDTO> {
    // Validar DTO
    this.validateDTO(dto);

    // Crear entidad de dominio
    const ticket = Ticket.create(
      generateUUID(),
      dto.title,
      dto.description,
      dto.priority || DEFAULT_PRIORITY,
      dto.createdBy
    );

    // Persistir
    const savedTicket = await this.repository.create(ticket);

    // Retornar DTO
    return this.toDTO(savedTicket);
  }

  private validateDTO(dto: CreateTicketDTO): void {
    if (!dto.title || dto.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (!dto.description || dto.description.trim().length === 0) {
      throw new Error('Description is required');
    }
  }

  private toDTO(ticket: Ticket): TicketResponseDTO {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      createdBy: ticket.createdBy
    };
  }
}





