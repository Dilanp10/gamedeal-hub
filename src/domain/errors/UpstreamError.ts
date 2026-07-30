import { DomainError } from './DomainError';

export class UpstreamError extends DomainError {
  constructor(
    message: string,
    public readonly source: 'rawg' | 'cheapshark' | 'all',
  ) {
    super(message, 'UPSTREAM_ERROR');
    this.name = 'UpstreamError';
  }
}
