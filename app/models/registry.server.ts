import { prisma } from '#app/utils/db.server'
import type { List } from '@prisma/client'
import { DatabaseError, NotFoundError, ValidationError, handlePrismaError } from '#app/utils/errors.server'

export type RegistryWithDetails = List & {
  items: Array<{ id: string }>
}

export async function getActiveRegistriesCount(userId: string, beforeDate?: Date) {
  if (!userId) throw new ValidationError('User ID is required')
  
  try {
    return await prisma.list.count({
      where: {
        ownerId: userId,
        status: 'active',
        ...(beforeDate && { updatedAt: { lt: beforeDate } })
      }
    })
  } catch (error) {
    throw handlePrismaError(error)
  }
}

export async function getMostRecentRegistry(userId: string) {
  if (!userId) throw new ValidationError('User ID is required')

  try {
    const registry = await prisma.list.findFirst({
      where: {
        ownerId: userId,
        status: 'active',
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        items: true,
      },
    }) as RegistryWithDetails | null

    if (!registry) {
      throw new NotFoundError('No active registry found', 'registry')
    }

    return registry
  } catch (error) {
    if (error instanceof NotFoundError) throw error
    throw handlePrismaError(error)
  }
}

export function calculateRegistryCompletion(registry: RegistryWithDetails | null) {
  if (!registry) {
    return {
      progress: 0,
      remainingSteps: ['Create your first registry'] as string[]
    }
  }

  const remainingSteps: string[] = []
  let progress = 25 // Start with 25% for having a registry

  if (registry.items.length < 5) {
    remainingSteps.push('Add at least 5 items to your registry')
  } else {
    progress += 25
  }

  if (!registry.description) {
    remainingSteps.push('Add a description to your registry')
  } else {
    progress += 25
  }

  if (registry.status === 'draft') {
    remainingSteps.push('Publish your registry')
  } else {
    progress += 25
  }

  return { progress, remainingSteps }
} 