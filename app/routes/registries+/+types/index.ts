import { type Registry as PrismaRegistry, type RegistryItem, Prisma } from '@prisma/client'

export interface RegistryListItem {
  id: string
  title: string
  eventDate: Date
  status: string
}

export interface Registry extends RegistryListItem {
  location: string  
  items: RegistryItem[]  
}

// Add other registry-related types here 