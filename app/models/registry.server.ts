import { prisma } from '#app/utils/db.server'
import type { List } from '@prisma/client'
import { DatabaseError, NotFoundError, ValidationError, handlePrismaError } from '#app/utils/errors.server'

export type RegistryWithDetails = List & {
  ChildProfile?: {
    photos: Array<{ id: string }>
  }
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
        ChildProfile: {
          include: {
            photos: true,
          },
        },
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
  let progress = 20 // Start with 20% for having a registry

  if (!registry.ChildProfile) {
    remainingSteps.push("Complete child's profile")
  } else {
    progress += 20
  }

  if (registry.items.length < 5) {
    remainingSteps.push('Add at least 5 items to your registry')
  } else {
    progress += 20
  }

  if (!registry.ChildProfile?.photos.length) {
    remainingSteps.push('Add digital memories')
  } else {
    progress += 20
  }

  if (registry.planType === 'free') {
    remainingSteps.push('Connect your Stripe account')
  } else {
    progress += 20
  }

  return { progress, remainingSteps }
} 