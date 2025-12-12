import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetTicketsUseCase } from '../../../application/use-cases/GetTicketsUseCase';
import { DynamoTicketRepository } from '../../persistence/DynamoTicketRepository';
import { ApiResponse } from '../responses/ApiResponse';
import { TicketStatus } from '../../../domain/value-objects/TicketStatus';

/**
 * Handler Lambda para obtener tickets
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Obtener query parameters
    const statusParam = event.queryStringParameters?.status;

    // Validar y parsear status si existe
    let status: TicketStatus | undefined;
    if (statusParam) {
      if (!Object.values(TicketStatus).includes(statusParam as TicketStatus)) {
        return ApiResponse.badRequest(
          `Invalid status. Valid values: ${Object.values(TicketStatus).join(', ')}`
        );
      }
      status = statusParam as TicketStatus;
    }

    // Inyectar dependencias
    const repository = new DynamoTicketRepository();
    const useCase = new GetTicketsUseCase(repository);

    // Ejecutar use case
    const result = await useCase.execute(status);

    // Retornar respuesta
    return ApiResponse.success(result);
  } catch (error: any) {
    console.error('Error getting tickets:', error);
    return ApiResponse.internalError('Failed to get tickets');
  }
};





