import { prisma } from '#app/utils/db.server'
import { ValidationError, handlePrismaError } from '#app/utils/errors.server'

export async function getRegistryVisitorsCount(userId: string, beforeDate?: Date) {
  if (!userId) throw new ValidationError('User ID is required')

  try {
    return await prisma.contribution.count({
      where: {
        list: {
          ownerId: userId,
          ...(beforeDate && { updatedAt: { lt: beforeDate } })
        }
      }
    })
  } catch (error) {
    throw handlePrismaError(error)
  }
} 