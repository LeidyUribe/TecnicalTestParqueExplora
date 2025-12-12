import { DomainError } from './DomainError';

/**
 * Error de validación
 */
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}





