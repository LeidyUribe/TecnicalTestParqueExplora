import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CreateTicketUseCase } from '../../../application/use-cases/CreateTicketUseCase';
import { DynamoTicketRepository } from '../../persistence/DynamoTicketRepository';
import { ApiResponse } from '../responses/ApiResponse';
import { CreateTicketDTO } from '../../../application/dtos/CreateTicketDTO';

/**
 * Handler Lambda para crear tickets
 * Aplica Single Responsibility: solo maneja HTTP y delega a use cases
 * Aplica Dependency Inversion: inyecta dependencias manualmente
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Validar API Key (si está configurada)
    // En producción, esto se maneja en API Gateway

    // Parsear body
    if (!event.body) {
      return ApiResponse.badRequest('Request body is required');
    }

    // API Gateway puede enviar el body como string base64 en algunos casos
    let bodyString = event.body;
    if (event.isBase64Encoded) {
      bodyString = Buffer.from(event.body, 'base64').toString('utf-8');
    }

    let body: CreateTicketDTO;
    try {
      // Intentar parsear JSON
      body = JSON.parse(bodyString);
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.error('Body received:', bodyString);
      return ApiResponse.badRequest(`Invalid JSON in request body: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Inyectar dependencias (Dependency Inversion)
    const repository = new DynamoTicketRepository();
    const useCase = new CreateTicketUseCase(repository);

    // Ejecutar use case
    const result = await useCase.execute(body);

    // Retornar respuesta
    return ApiResponse.success(result, 201);
  } catch (error: any) {
    console.error('Error creating ticket:', error);

    if (error.name === 'ValidationError') {
      return ApiResponse.badRequest(error.message);
    }

    return ApiResponse.internalError('Failed to create ticket');
  }
};





