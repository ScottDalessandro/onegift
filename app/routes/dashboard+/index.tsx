import { captureException } from '@sentry/node'
import { Link, useLoaderData } from 'react-router'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { Progress } from '#app/components/ui/progress'
import { getDigitalMemoriesCount } from '#app/models/memories.server'
import {
	getActiveRegistriesCount,
	getMostRecentRegistry,
	getMostRecentDraftRegistry,
	calculateRegistryCompletion,
} from '#app/models/registry.server'
import { getRegistryVisitorsCount } from '#app/models/visitors.server'
import { requireUserId } from '#app/utils/auth.server'
import { NotFoundError } from '#app/utils/errors.server'
import { calculatePercentageChange } from '#app/utils/metrics.server'
import { type Route } from './+types/index'

export type DashboardData = {
	activeRegistries: {
		count: number
		change: number
	}
	digitalMemories: {
		count: number
		change: number
	}
	registryVisitors: {
		count: number
		change: number
	}
	recentActivity: {
		title: string
		date: string
		progress: number
		remainingSteps: string[]
	}
	mostRecentRegistry: {
		id: string
	} | null
}

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)

	// Calculate dates for comparison
	const currentDate = new Date()
	const thirtyDaysAgo = new Date(
		currentDate.getTime() - 30 * 24 * 60 * 60 * 1000,
	)

	// Fetch all counts in parallel with individual error handling
	const results = await Promise.allSettled([
		getActiveRegistriesCount(userId),
		getActiveRegistriesCount(userId, thirtyDaysAgo),
		getDigitalMemoriesCount(userId),
		getDigitalMemoriesCount(userId, thirtyDaysAgo),
		getRegistryVisitorsCount(userId),
		getRegistryVisitorsCount(userId, thirtyDaysAgo),
	])

	// Log any errors to Sentry with context
	results.forEach((result, index) => {
		if (result.status === 'rejected') {
			const queryType = [
				'current registries',
				'previous registries',
				'current memories',
				'previous memories',
				'current visitors',
				'previous visitors',
			][index]

			try {
				captureException(result.reason, {
					tags: {
						queryType,
						userId,
						isHistorical: index % 2 === 1, // odd indices are historical queries
					},
					extra: {
						error: result.reason,
						queryIndex: index,
						timestamp: new Date().toISOString(),
					},
				})
			} catch (sentryError) {
				// Fallback to console.error if Sentry fails
				console.error('Failed to log to Sentry:', sentryError)
				console.error('Original error:', {
					queryType,
					error: result.reason,
					queryIndex: index,
					timestamp: new Date().toISOString(),
				})
			}
		}
	})

	// Extract values, filtering out rejected promises
	const fulfilledResults = results
		.filter(
			(result): result is PromiseFulfilledResult<number> =>
				result.status === 'fulfilled',
		)
		.map((result) => result.value)

	// Ensure we have all required values, defaulting to 0 for any missing ones
	const [
		currentRegistriesCount = 0,
		previousRegistriesCount = 0,
		currentMemoriesCount = 0,
		previousMemoriesCount = 0,
		currentVisitorsCount = 0,
		previousVisitorsCount = 0,
	] = fulfilledResults

	// Try to get the most recent registry, but handle the case when there are none
	let mostRecentRegistry = null
	try {
		mostRecentRegistry = await getMostRecentRegistry(userId)
	} catch (error) {
		// If it's a NotFoundError, try to get the most recent draft registry
		if (error instanceof NotFoundError) {
			try {
				mostRecentRegistry = await getMostRecentDraftRegistry(userId)
			} catch (draftError) {
				if (draftError instanceof NotFoundError) {
					mostRecentRegistry = null
				} else {
					throw draftError
				}
			}
		} else {
			// Re-throw other errors
			throw error
		}
	}

	// Calculate completion status
	const { progress, remainingSteps } =
		calculateRegistryCompletion(mostRecentRegistry)

	const dashboardData: DashboardData = {
		activeRegistries: {
			count: currentRegistriesCount,
			change: calculatePercentageChange(
				currentRegistriesCount,
				previousRegistriesCount,
			),
		},
		digitalMemories: {
			count: currentMemoriesCount,
			change: calculatePercentageChange(
				currentMemoriesCount,
				previousMemoriesCount,
			),
		},
		registryVisitors: {
			count: currentVisitorsCount,
			change: calculatePercentageChange(
				currentVisitorsCount,
				previousVisitorsCount,
			),
		},
		recentActivity: mostRecentRegistry
			? {
					title: mostRecentRegistry.title,
					date: mostRecentRegistry.updatedAt.toLocaleDateString(),
					progress,
					remainingSteps,
				}
			: {
					title: 'No active registries',
					date: new Date().toLocaleDateString(),
					progress: 0,
					remainingSteps: ['Create your first registry'],
				},
		mostRecentRegistry: mostRecentRegistry
			? { id: mostRecentRegistry.id }
			: null,
	}

	return { dashboardData }
}

export default function DashboardIndex() {
	const { dashboardData } = useLoaderData<typeof loader>()

	return (
		<div className="container py-8">
			<h1 className="mb-8 text-2xl font-bold">Dashboard</h1>

			{/* Overview Cards */}
			<div className="mb-12 grid gap-6 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Active Registries
						</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4 text-teal-600"
						>
							<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{dashboardData.activeRegistries.count}
						</div>
						<p className="text-xs text-muted-foreground">
							{dashboardData.activeRegistries.change}% from last month
						</p>
						<Link
							to="/registries"
							className="mt-4 text-sm text-teal-600 hover:text-teal-700"
						>
							View all registries
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Digital Memories
						</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4 text-orange-600"
						>
							<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{dashboardData.digitalMemories.count}
						</div>
						<p className="text-xs text-muted-foreground">
							{dashboardData.digitalMemories.change}% from last month
						</p>
						<Link
							to="/memories"
							className="mt-4 text-sm text-orange-600 hover:text-orange-700"
						>
							View all memories
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Registry Visitors
						</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4 text-purple-600"
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{dashboardData.registryVisitors.count}
						</div>
						<p className="text-xs text-muted-foreground">
							{dashboardData.registryVisitors.change}% from last month
						</p>
						<Link
							to="/analytics"
							className="mt-4 text-sm text-purple-600 hover:text-purple-700"
						>
							View analytics
						</Link>
					</CardContent>
				</Card>
			</div>

			{/* Recent Activity */}
			<div>
				<h2 className="mb-6 text-lg font-semibold">Recent Activity</h2>

				<Card className="max-w-2xl">
					<CardContent className="pt-6">
						<Link
							to={
								dashboardData.mostRecentRegistry
									? `/dashboard/lists/${dashboardData.mostRecentRegistry.id}`
									: '/dashboard/lists/new'
							}
							className="mb-2 text-lg font-semibold hover:text-teal-700"
						>
							{dashboardData.recentActivity.title}
						</Link>
						<p className="mb-4 text-sm text-gray-500">
							Last updated on {dashboardData.recentActivity.date}
						</p>

						<div className="space-y-4">
							<div>
								<h3 className="mb-2 font-medium">Registry Completion</h3>
								<div className="mb-2 flex items-center gap-2">
									<Progress
										value={dashboardData.recentActivity.progress}
										className="h-2"
									/>
									<span className="text-sm font-medium">
										{dashboardData.recentActivity.progress}%
									</span>
								</div>
								<p className="text-sm text-gray-600">
									{dashboardData.recentActivity.remainingSteps.join(', ')}
								</p>
							</div>

							<Link
								to={
									dashboardData.mostRecentRegistry
										? `/dashboard/lists/${dashboardData.mostRecentRegistry.id}`
										: '/dashboard/lists/new'
								}
								className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
							>
								{dashboardData.mostRecentRegistry
									? 'Continue Setup'
									: 'Create New Registry'}
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
