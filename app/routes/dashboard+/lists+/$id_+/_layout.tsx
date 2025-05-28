import { Outlet, useParams, useLoaderData, NavLink } from 'react-router'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { Tabs, TabsList, TabsTrigger } from '#app/components/ui/tabs'
import { cn } from '#app/lib/utils'
import { Progress } from '#app/components/ui/progress'
import { Card, CardContent } from '#app/components/ui/card'
import { useState } from 'react'

export async function loader({ request, params }: any) {
	const userId = await requireUserId(request)
	const listId = params.id
	if (!listId) throw new Response('List ID is required', { status: 400 })
	const list = await prisma.list.findFirst({
		where: { id: listId, ownerId: userId },
		include: {
			items: true,
			event: true,
			listType: true,
		},
	})
	if (!list) throw new Response('List not found', { status: 404 })
	return { list }
}

export default function RegistryTabsLayout() {
	const { id } = useParams()
	const { list } = useLoaderData() as any
	const [isCompletionExpanded, setIsCompletionExpanded] = useState(true)

	// Example progress and steps (replace with real data as needed)
	const progress = 35
	const nextStep = {
		title: 'Add Items (min. 5)',
		description: 'Helps friends find perfect gifts for your child',
		action: 'Complete This Step',
	}
	const completedSteps = [
		{
			title: 'Set Up Digital Memories',
			description: 'Configure digital memory options for gift givers',
		},
		{
			title: 'Connect Stripe Account',
			description: 'Enable cash contributions for your registry',
		},
		{
			title: 'Publish Registry',
			description: 'Make your registry visible to friends and family',
		},
		{
			title: "Complete Child's Profile",
			description: 'Add interests, achievements, and photos',
		},
		{
			title: 'Basic Information',
			description: "Registry name, child's name, event date and type",
		},
	]

	return (
		<div className="container py-8">
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">{list?.name || 'Registry'}</h1>
						<p className="text-sm text-gray-500">
							{list?.event?.date
								? new Date(list.event.date).toLocaleDateString('en-US', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})
								: 'No date set'}
						</p>
					</div>
					<button className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
						Publish Registry
					</button>
				</div>

				{/* Tab Navigation */}
				<Tabs defaultValue="overview" className="mt-6">
					<TabsList className="grid w-full grid-cols-5 bg-gray-50 p-1">
						<NavLink
							to={`/dashboard/lists/${id}`}
							className={({ isActive }) =>
								cn(
									'flex items-center justify-start gap-2 px-4',
									isActive ? 'bg-white text-teal-600' : 'text-gray-600',
								)
							}
							end
						>
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 10h16M4 14h16M4 18h16"
								/>
							</svg>
							Overview
						</NavLink>
						<NavLink
							to={`/dashboard/lists/${id}/items`}
							className={({ isActive }) =>
								cn(
									'flex items-center justify-start gap-2 px-4',
									isActive ? 'bg-white text-teal-600' : 'text-gray-600',
								)
							}
						>
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
								/>
							</svg>
							Items ({list?.items?.length || 0})
						</NavLink>
						<NavLink
							to={`/dashboard/lists/${id}/profile`}
							className={({ isActive }) =>
								cn(
									'flex items-center justify-start gap-2 px-4',
									isActive ? 'bg-white text-teal-600' : 'text-gray-600',
								)
							}
						>
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							Profile
						</NavLink>
						<NavLink
							to={`/dashboard/lists/${id}/memories`}
							className={({ isActive }) =>
								cn(
									'flex items-center justify-start gap-2 px-4',
									isActive ? 'bg-white text-teal-600' : 'text-gray-600',
								)
							}
						>
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							Memories
						</NavLink>
						<NavLink
							to={`/dashboard/lists/${id}/completion`}
							className={({ isActive }) =>
								cn(
									'flex items-center justify-start gap-2 px-4',
									isActive ? 'bg-white text-teal-600' : 'text-gray-600',
								)
							}
						>
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Completion
						</NavLink>
					</TabsList>
				</Tabs>

				{/* Did you know section */}
				<div className="mt-6 rounded-lg bg-purple-50 p-4">
					<div className="flex items-start gap-3">
						<div className="rounded-full bg-purple-100 p-2">
							<svg
								className="h-4 w-4 text-purple-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<p className="font-medium text-purple-900">Did you know?</p>
							<p className="text-sm text-purple-800">
								Registries with completed profiles receive{' '}
								<span className="font-medium">40% more gifts</span> and
								registries with all 5 categories filled receive{' '}
								<span className="font-medium">3x more digital memories</span>{' '}
								from gift givers.
							</p>
						</div>
					</div>
				</div>

				{/* Registry Completion Section */}
				<div className="mt-6">
					<button
						className="mb-4 flex w-full items-center justify-between"
						onClick={() => setIsCompletionExpanded(!isCompletionExpanded)}
					>
						<div className="flex items-center gap-2">
							<h2 className="text-lg font-semibold">Registry Completion</h2>
							<span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
								{progress}% Complete
							</span>
						</div>
						<svg
							className={`h-5 w-5 transform text-gray-500 transition-transform ${
								isCompletionExpanded ? 'rotate-180' : ''
							}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{isCompletionExpanded && (
						<div>
							<p className="mb-2 text-sm text-gray-600">
								Complete these steps to create a meaningful registry experience
							</p>

							<div className="mb-4">
								<div className="mb-2 flex items-center justify-between text-sm">
									<span>Overall Progress</span>
									<span>{progress}%</span>
								</div>
								<Progress value={progress} />
							</div>

							<Card className="mb-4 border-teal-100 bg-teal-50/30">
								<CardContent className="p-4">
									<div className="flex items-start gap-3">
										<div className="rounded-full bg-teal-100 p-2">
											<svg
												className="h-5 w-5 text-teal-700"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</div>
										<div className="flex-1">
											<h3 className="mb-1 font-medium">
												Next recommended step:
											</h3>
											<p className="text-sm text-gray-600">
												{nextStep.title} - {nextStep.description}
											</p>
											<button className="mt-3 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
												{nextStep.action}
											</button>
										</div>
									</div>
								</CardContent>
							</Card>

							<div className="space-y-3">
								{completedSteps.map((step, index) => (
									<div key={index} className="flex items-start gap-3">
										<div className="rounded-full bg-green-100 p-2">
											<svg
												className="h-4 w-4 text-green-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<div>
											<h4 className="font-medium">{step.title}</h4>
											<p className="text-sm text-gray-500">
												{step.description}
											</p>
										</div>
										<button className="ml-auto text-sm text-teal-600 hover:text-teal-700">
											Edit
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Tab Content */}
				<div className="mt-6">
					<Outlet context={{ list }} />
				</div>
			</div>
		</div>
	)
}
