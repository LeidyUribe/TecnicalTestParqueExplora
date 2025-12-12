/**
 * Configuración de variables de entorno
 */
export interface Environment {
  ticketsTableName: string;
  apiKey?: string;
}

export function getEnvironment(): Environment {
  return {
    ticketsTableName: process.env.TICKETS_TABLE_NAME || 'tickets',
    apiKey: process.env.API_KEY
  };
}





