export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class NotFoundError extends Error {
  constructor(
    message: string,
    public readonly resource: string
  ) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function handlePrismaError(error: unknown): never {
  if (error instanceof Error) {
    // Handle Prisma-specific errors
    if ('code' in error && typeof error.code === 'string') {
      switch (error.code) {
        case 'P2002':
          throw new DatabaseError('Unique constraint violation', error, error.code)
        case 'P2025':
          throw new DatabaseError('Record not found', error, error.code)
        case 'P2003':
          throw new DatabaseError('Foreign key constraint violation', error, error.code)
      }
    }
    throw new DatabaseError(error.message, error)
  }
  throw new DatabaseError('An unknown error occurred', error)
} 