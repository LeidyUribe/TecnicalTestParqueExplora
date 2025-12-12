import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Utilidades para respuestas de API Gateway
 */
export class ApiResponse {
  static success(data: any, statusCode: number = 200): APIGatewayProxyResult {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,x-api-key',
        'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        data
      })
    };
  }

  static error(
    message: string,
    statusCode: number = 400,
    details?: any
  ): APIGatewayProxyResult {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,x-api-key',
        'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS'
      },
      body: JSON.stringify({
        success: false,
        error: {
          message,
          details
        }
      })
    };
  }

  static notFound(message: string): APIGatewayProxyResult {
    return this.error(message, 404);
  }

  static badRequest(message: string, details?: any): APIGatewayProxyResult {
    return this.error(message, 400, details);
  }

  static internalError(message: string = 'Internal server error'): APIGatewayProxyResult {
    return this.error(message, 500);
  }
}





