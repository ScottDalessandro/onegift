import { useState } from 'react'
import { useParams, NavLink } from 'react-router'
import { cn } from '#app/lib/utils'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { Progress } from '#app/components/ui/progress'

export default function RegistryDetails() {
	const { id } = useParams()
	const [isCompletionExpanded, setIsCompletionExpanded] = useState(true)

	// // Example progress and steps (replace with real data as needed)
	// const progress = 35
	// const nextStep = {
	// 	title: 'Add Items (min. 5)',
	// 	description: 'Helps friends find perfect gifts for your child',
	// 	action: 'Complete This Step',
	// }
	// const completedSteps = [
	// 	{
	// 		title: 'Set Up Digital Memories',
	// 		description: 'Configure digital memory options for gift givers',
	// 	},
	// 	{
	// 		title: 'Connect Stripe Account',
	// 		description: 'Enable cash contributions for your registry',
	// 	},
	// 	{
	// 		title: 'Publish Registry',
	// 		description: 'Make your registry visible to friends and family',
	// 	},
	// 	{
	// 		title: "Complete Child's Profile",
	// 		description: 'Add interests, achievements, and photos',
	// 	},
	// 	{
	// 		title: 'Basic Information',
	// 		description: "Registry name, child's name, event date and type",
	// 	},
	// ]

	// This would come from your data loader in a real app
	const registryData = {
		title: "Emma's 5th Birthday",
		date: new Date('2023-06-14'),
		progress: 35,
		items: 2,
		categories: {
			filled: 2,
			total: 5,
		},
		nextStep: {
			title: 'Add Items (min. 5)',
			description: 'Helps friends find perfect gifts for your child',
			action: 'Complete This Step',
		},
		completedSteps: [
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
		],
		childProfile: {
			name: 'Emma',
			age: 5,
			interests: ['Art', 'Music'],
			achievements: ['Learned to ride a bike'],
			lookingForwardTo: ['Starting kindergarten'],
			photos: [{ id: 1, url: '/images/emma-profile.jpg' }],
		},
	}

	return (
		<div className="container py-8">
			{/* Navigation Bar (no Overview button) */}
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">{registryData.title}</h1>
						<p className="text-sm text-gray-500">
							{registryData.date.toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</p>
					</div>
					<button className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
						Publish Registry
					</button>
				</div>
				<div className="mt-6 grid w-full grid-cols-4 bg-gray-50 p-1">
					<NavLink
						to={`/dashboard/lists/${id}/items`}
						className={({ isActive }) =>
							cn(
								'flex items-center justify-start gap-2 px-4',
								isActive ? 'bg-white text-teal-600' : 'text-gray-600',
							)
						}
					>
						Items
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
						Completion
					</NavLink>
				</div>
			</div>
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
							<span className="font-medium">40% more gifts</span> and registries
							with all 5 categories filled receive{' '}
							<span className="font-medium">3x more digital memories</span> from
							gift givers.
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
							{registryData.progress}% Complete
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
								<span>{registryData.progress}%</span>
							</div>
							<Progress value={registryData.progress} />
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
										<h3 className="mb-1 font-medium">Next recommended step:</h3>
										<p className="text-sm text-gray-600">
											{registryData.nextStep.title} -{' '}
											{registryData.nextStep.description}
										</p>
										<button className="mt-3 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
											{registryData.nextStep.action}
										</button>
									</div>
								</div>
							</CardContent>
						</Card>

						<div className="space-y-3">
							{registryData.completedSteps.map((step: any, index: number) => (
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
										<p className="text-sm text-gray-500">{step.description}</p>
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
			{/* Overview Details */}
			<div className="mt-8 grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Registry Details</CardTitle>
					</CardHeader>
					<CardContent>
						<dl className="space-y-4">
							<div>
								<dt className="text-sm font-medium text-gray-500">
									Registry Name
								</dt>
								<dd className="text-lg">{registryData.title}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">
									Child's Name
								</dt>
								<dd className="text-lg">{registryData.childProfile.name}</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">
									Event Date
								</dt>
								<dd className="text-lg">
									{registryData.date.toLocaleDateString()}
								</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">
									Event Type
								</dt>
								<dd className="text-lg">Birthday</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Created</dt>
								<dd className="text-lg">4/30/2023</dd>
							</div>
							<div>
								<dt className="text-sm font-medium text-gray-500">Status</dt>
								<dd>
									<span className="inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
										Draft
									</span>
								</dd>
							</div>
						</dl>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Quick Stats</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
								<div>
									<h3 className="text-sm font-medium text-gray-500">Items</h3>
									<p className="mt-1 text-2xl font-bold text-teal-600">
										{registryData.items}
									</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Categories
									</h3>
									<p className="mt-1 text-2xl font-bold text-teal-600">
										{registryData.categories.filled}/
										{registryData.categories.total}
									</p>
									<p className="text-xs text-orange-600">
										Fill all 5 categories
									</p>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Profile Completion
									</h3>
									<p className="mt-1 text-2xl font-bold text-teal-600">100%</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Days Until Event
									</h3>
									<p className="mt-1 text-2xl font-bold text-orange-600">
										-679
									</p>
									<p className="text-xs text-orange-600">Coming soon!</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
