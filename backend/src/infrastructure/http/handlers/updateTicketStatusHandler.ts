import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateTicketStatusUseCase } from '../../../application/use-cases/UpdateTicketStatusUseCase';
import { DynamoTicketRepository } from '../../persistence/DynamoTicketRepository';
import { ApiResponse } from '../responses/ApiResponse';
import { UpdateStatusDTO } from '../../../application/dtos/UpdateStatusDTO';
import { TicketStatus } from '../../../domain/value-objects/TicketStatus';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

/**
 * Handler Lambda para actualizar el estado de un ticket
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Obtener ID del path
    const id = event.pathParameters?.id;
    if (!id) {
      return ApiResponse.badRequest('Ticket ID is required in path');
    }

    // Parsear body
    if (!event.body) {
      return ApiResponse.badRequest('Request body is required');
    }

    // API Gateway puede enviar el body como string base64 en algunos casos
    let bodyString = event.body;
    if (event.isBase64Encoded) {
      bodyString = Buffer.from(event.body, 'base64').toString('utf-8');
    }

    let body: UpdateStatusDTO;
    try {
      // Intentar parsear JSON
      body = JSON.parse(bodyString);
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.error('Body received:', bodyString);
      return ApiResponse.badRequest(`Invalid JSON in request body: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Validar status
    if (!body.status || !Object.values(TicketStatus).includes(body.status)) {
      return ApiResponse.badRequest(
        `Invalid status. Valid values: ${Object.values(TicketStatus).join(', ')}`
      );
    }

    // Inyectar dependencias
    const repository = new DynamoTicketRepository();
    const useCase = new UpdateTicketStatusUseCase(repository);

    // Ejecutar use case
    const result = await useCase.execute(id, body);

    // Retornar respuesta
    return ApiResponse.success(result);
  } catch (error: any) {
    console.error('Error updating ticket status:', error);

    if (error instanceof NotFoundError) {
      return ApiResponse.notFound(error.message);
    }

    if (error.name === 'ValidationError') {
      return ApiResponse.badRequest(error.message);
    }

    return ApiResponse.internalError('Failed to update ticket status');
  }
};





