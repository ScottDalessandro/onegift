import { type Theme } from './theme.server'

export interface RequestInfo {
    hints?: {
        theme: Theme
        timeZone: string
    }
    origin: string
    path: string
    userPrefs: {
        theme: Theme | null
    }
} 