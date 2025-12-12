import { DomainError } from './DomainError';

/**
 * Error cuando no se encuentra un recurso
 */
export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}





