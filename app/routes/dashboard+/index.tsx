import { Link } from 'react-router'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { Progress } from '#app/components/ui/progress'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '#app/components/ui/tabs'

export default function DashboardIndex() {
	// This would come from your data loader in a real app
	const dashboardData = {
		activeRegistries: {
			count: 1,
			change: '+0%',
			period: 'from last month',
		},
		digitalMemories: {
			count: 0,
			change: '+0%',
			period: 'from last month',
		},
		registryVisitors: {
			count: 0,
			change: '+0%',
			period: 'from last month',
		},
		recentActivity: {
			registryName: "Emma's 5th Birthday",
			createdDate: 'April 17, 2025',
			completion: 35,
			remainingSteps: 4,
		},
	}

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
							{dashboardData.activeRegistries.change}{' '}
							{dashboardData.activeRegistries.period}
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
							{dashboardData.digitalMemories.change}{' '}
							{dashboardData.digitalMemories.period}
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
							{dashboardData.registryVisitors.change}{' '}
							{dashboardData.registryVisitors.period}
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
							to={`/dashboard/lists/1`}
							className="mb-2 text-lg font-semibold hover:text-teal-700"
						>
							{dashboardData.recentActivity.registryName}
						</Link>
						<p className="mb-4 text-sm text-gray-500">
							Created on {dashboardData.recentActivity.createdDate}
						</p>

						<div className="space-y-4">
							<div>
								<h3 className="mb-2 font-medium">Registry Completion</h3>
								<div className="mb-2 flex items-center gap-2">
									<Progress
										value={dashboardData.recentActivity.completion}
										className="h-2"
									/>
									<span className="text-sm font-medium">
										{dashboardData.recentActivity.completion}%
									</span>
								</div>
								<p className="text-sm text-gray-600">
									{dashboardData.recentActivity.remainingSteps} steps remaining
								</p>
							</div>

							<Link
								to={`/dashboard/lists/1`}
								className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
							>
								Continue Setup
							</Link>
						</div>
					</CardContent>
				</Card>

				<div className="mt-8 text-center">
					<button
						className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						onClick={() => {
							// Handle creating new registry
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4"
						>
							<path d="M12 5v14M5 12h14" />
						</svg>
						Create New Registry
					</button>
				</div>
			</div>
		</div>
	)
}
