/**
 * Value Object: Estado de un ticket
 * Aplica principio de encapsulación de valores de dominio
 */
export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

/**
 * Valida si una transición de estado es válida
 * Lógica de negocio encapsulada en el value object
 */
export function isValidStatusTransition(
  currentStatus: TicketStatus,
  newStatus: TicketStatus
): boolean {
  const validTransitions: Record<TicketStatus, TicketStatus[]> = {
    [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS, TicketStatus.CLOSED],
    [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED, TicketStatus.CLOSED],
    [TicketStatus.RESOLVED]: [TicketStatus.CLOSED],
    [TicketStatus.CLOSED]: [] // Estado final, no se puede cambiar
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}





