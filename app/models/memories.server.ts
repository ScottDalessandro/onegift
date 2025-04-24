import { prisma } from '#app/utils/db.server'
import { ValidationError, handlePrismaError } from '#app/utils/errors.server'

export async function getDigitalMemoriesCount(userId: string, beforeDate?: Date) {
  if (!userId) throw new ValidationError('User ID is required')

  try {
    return await prisma.profilePhoto.count({
      where: {
        profile: {
          list: {
            ownerId: userId,
            ...(beforeDate && { updatedAt: { lt: beforeDate } })
          }
        }
      }
    })
  } catch (error) {
    throw handlePrismaError(error)
  }
} 