import { Ticket } from '../entities/Ticket';
import { TicketStatus } from '../value-objects/TicketStatus';

/**
 * Interface del Repositorio (Dependency Inversion Principle)
 * Define el contrato sin depender de implementaciones concretas
 * Aplica Interface Segregation Principle: solo métodos necesarios
 */
export interface ITicketRepository {
  /**
   * Crea un nuevo ticket
   */
  create(ticket: Ticket): Promise<Ticket>;

  /**
   * Busca un ticket por ID
   */
  findById(id: string): Promise<Ticket | null>;

  /**
   * Busca tickets por estado
   */
  findByStatus(status: TicketStatus): Promise<Ticket[]>;

  /**
   * Actualiza el estado de un ticket
   */
  updateStatus(id: string, status: TicketStatus): Promise<Ticket>;

  /**
   * Obtiene todos los tickets (opcional, para listado completo)
   */
  findAll(): Promise<Ticket[]>;
}





