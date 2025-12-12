import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Ticket } from '../../domain/entities/Ticket';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { TicketStatus } from '../../domain/value-objects/TicketStatus';
import { TicketPriority } from '../../domain/value-objects/TicketPriority';
import { getDynamoDBClient } from './DynamoDBClient';
import { getEnvironment } from '../config/environment';

/**
 * Implementación del repositorio usando DynamoDB
 * Aplica Dependency Inversion: implementa la interfaz ITicketRepository
 */
export class DynamoTicketRepository implements ITicketRepository {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    this.client = getDynamoDBClient();
    this.tableName = getEnvironment().ticketsTableName;
  }

  async create(ticket: Ticket): Promise<Ticket> {
    const item = this.toDynamoItem(ticket);

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
        ConditionExpression: 'attribute_not_exists(id)'
      })
    );

    return ticket;
  }

  async findById(id: string): Promise<Ticket | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id }
      })
    );

    if (!result.Item) {
      return null;
    }

    return this.toDomainEntity(result.Item);
  }

  async findByStatus(status: TicketStatus): Promise<Ticket[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'StatusIndex',  // Debe coincidir con el nombre en template.yaml
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': status
        }
      })
    );

    return (result.Items || []).map(item => this.toDomainEntity(item));
  }

  async findAll(): Promise<Ticket[]> {
    const result = await this.client.send(
      new ScanCommand({
        TableName: this.tableName
      })
    );

    return (result.Items || []).map(item => this.toDomainEntity(item));
  }

  async updateStatus(id: string, status: TicketStatus): Promise<Ticket> {
    const updatedAt = new Date().toISOString();

    const result = await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':updatedAt': updatedAt
        },
        ReturnValues: 'ALL_NEW'
      })
    );

    if (!result.Attributes) {
      throw new Error(`Failed to update ticket ${id}`);
    }

    return this.toDomainEntity(result.Attributes);
  }

  private toDynamoItem(ticket: Ticket): Record<string, any> {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      createdBy: ticket.createdBy
    };
  }

  private toDomainEntity(item: Record<string, any>): Ticket {
    return new Ticket(
      item.id,
      item.title,
      item.description,
      item.status as TicketStatus,
      item.priority as TicketPriority,
      new Date(item.createdAt),
      new Date(item.updatedAt),
      item.createdBy
    );
  }
}





