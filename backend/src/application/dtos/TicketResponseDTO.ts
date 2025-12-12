/**
 * DTO de respuesta para un ticket
 * Separa la representación de la entidad de dominio
 */
export interface TicketResponseDTO {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}





