export class ClientError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ClientError'
  }
}

export class ValidationError extends ClientError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends ClientError {
  constructor(
    message: string,
    public readonly resource: string
  ) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class DatabaseError extends ClientError {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof Error && error.name === 'ValidationError'
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof Error && error.name === 'NotFoundError'
}

export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof Error && error.name === 'DatabaseError'
} 