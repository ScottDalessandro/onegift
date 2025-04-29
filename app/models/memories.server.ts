import { prisma } from '#app/utils/db.server'
import { ValidationError, handlePrismaError } from '#app/utils/errors.server'

export async function getDigitalMemoriesCount(userId: string, beforeDate?: Date) {
  if (!userId) throw new ValidationError('User ID is required')

  try {
    return await prisma.profilePhoto.count({
      where: {
        profile: {
          listId: {
            in: await prisma.list.findMany({
              where: {
                ownerId: userId,
                ...(beforeDate && { updatedAt: { lt: beforeDate } })
              },
              select: { id: true }
            }).then(lists => lists.map(list => list.id))
          }
        }
      }
    })
  } catch (error) {
    throw handlePrismaError(error)
  }
} 