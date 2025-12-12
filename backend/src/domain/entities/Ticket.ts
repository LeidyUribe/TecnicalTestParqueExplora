import { TicketStatus, isValidStatusTransition } from '../value-objects/TicketStatus';
import { TicketPriority } from '../value-objects/TicketPriority';

/**
 * Entidad de Dominio: Ticket
 * Contiene la lógica de negocio y reglas de dominio
 * Aplica principio de Single Responsibility
 */
export class Ticket {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: TicketStatus,
    public readonly priority: TicketPriority,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly createdBy?: string
  ) {
    this.validate();
  }

  /**
   * Valida las reglas de negocio de la entidad
   */
  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('Ticket ID is required');
    }
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Ticket title is required');
    }
    if (this.title.length > 200) {
      throw new Error('Ticket title must be less than 200 characters');
    }
    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Ticket description is required');
    }
    if (this.description.length > 2000) {
      throw new Error('Ticket description must be less than 2000 characters');
    }
  }

  /**
   * Método de dominio: Verifica si puede transicionar a un nuevo estado
   * Encapsula la lógica de negocio
   */
  canTransitionTo(newStatus: TicketStatus): boolean {
    return isValidStatusTransition(this.status, newStatus);
  }

  /**
   * Método de dominio: Crea una nueva instancia con el estado actualizado
   * Inmutable - aplica principio de inmutabilidad
   */
  updateStatus(newStatus: TicketStatus): Ticket {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(
        `Invalid status transition from ${this.status} to ${newStatus}`
      );
    }

    return new Ticket(
      this.id,
      this.title,
      this.description,
      newStatus,
      this.priority,
      this.createdAt,
      new Date(), // updatedAt se actualiza
      this.createdBy
    );
  }

  /**
   * Factory method: Crea un nuevo ticket
   */
  static create(
    id: string,
    title: string,
    description: string,
    priority: TicketPriority,
    createdBy?: string
  ): Ticket {
    const now = new Date();
    return new Ticket(
      id,
      title,
      description,
      TicketStatus.OPEN,
      priority,
      now,
      now,
      createdBy
    );
  }
}





