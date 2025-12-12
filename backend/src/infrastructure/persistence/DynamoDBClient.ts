import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

/**
 * Cliente de DynamoDB singleton
 * Aplica principio de reutilización
 */
let dynamoClient: DynamoDBDocumentClient | null = null;

export function getDynamoDBClient(): DynamoDBDocumentClient {
  if (!dynamoClient) {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1'
    });
    dynamoClient = DynamoDBDocumentClient.from(client);
  }
  return dynamoClient;
}





