import { useState } from 'react'
import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
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
import { formatDateUTC } from '#app/utils/date'

type ListItem = {
	id: string
	name: string
	price: number
	category: string | null
	description: string | null
	url: string | null
	images: Array<{ id: string; url: string; altText: string | null }>
}

type List = {
	id: string
	title: string
	description: string | null
	contributionDate: Date
	listTypeId: string
	eventId: string | null
	items: ListItem[]
	event: {
		id: string
		name: string
		date: Date
		startTime: string | null
		endTime: string | null
		location: string | null
		description: string | null
	} | null
	createdAt: Date
}

export async function loader({ request, params }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const listId = params.id

	if (!listId) {
		throw new Response('List ID is required', { status: 400 })
	}

	const list = (await prisma.list.findFirst({
		where: {
			id: listId,
			ownerId: userId,
		},
		include: {
			items: {
				include: {
					images: true,
				},
			},
			event: true,
			listType: true,
		},
	})) as List | null

	if (!list) {
		throw new Response('List not found', { status: 404 })
	}

	// Calculate progress and other metrics
	const totalItems = list.items.length
	const categories = {
		filled: new Set(list.items.map((item) => item.category).filter(Boolean))
			.size,
		total: 5, // Assuming 5 categories: Want, Need, Experience, Wear, Learn
	}

	// Calculate overall progress (example calculation)
	const progress = Math.round((totalItems / 10) * 100) // Assuming 10 items is 100%

	return {
		list,
		progress,
		categories,
	}
}

export default function RegistryDetails() {
	const { list, progress, categories } = useLoaderData<typeof loader>()
	const [isCompletionExpanded, setIsCompletionExpanded] = useState(true)

	const registryData = {
		title: list.title,
		date: list.event?.date || list.contributionDate,
		progress,
		items: list.items.length,
		categories,
		nextStep: {
			title: 'Add Items (min. 5)',
			description: 'Helps friends find perfect gifts for your registry',
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
				title: 'Complete Event Details',
				description: 'Add event information and location',
			},
			{
				title: 'Basic Information',
				description: 'Registry name, type, and contribution deadline',
			},
		],
		registryItems: list.items,
		event: list.event,
		createdAt: list.createdAt,
	}

	return (
		<div className="container py-8">
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">{registryData.title}</h1>
						<p className="text-sm text-gray-500">
							{registryData.date
								? formatDateUTC(new Date(registryData.date))
								: 'No date set'}
						</p>
					</div>
					<button className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
						Publish Registry
					</button>
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
								<span className="font-medium">40% more gifts</span> and
								registries with all 5 categories filled receive{' '}
								<span className="font-medium">3x more digital memories</span>{' '}
								from gift givers.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Registry Completion Section */}
			<div className="mb-8">
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

						{/* Next Step Card */}
						<Card className="mb-4 border-teal-100 bg-teal-50/30">
							<CardHeader>
								<CardTitle className="text-base">
									{registryData.nextStep.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-4 text-sm text-gray-600">
									{registryData.nextStep.description}
								</p>
								<button className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
									{registryData.nextStep.action}
								</button>
							</CardContent>
						</Card>

						{/* Completed Steps */}
						<div className="space-y-4">
							{registryData.completedSteps.map((step, index) => (
								<Card key={index} className="border-gray-100">
									<CardHeader>
										<CardTitle className="text-base">{step.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-gray-600">{step.description}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Registry Items Section */}
			<div className="mb-8">
				<h2 className="mb-4 text-lg font-semibold">Registry Items</h2>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{registryData.registryItems.map((item) => (
						<Card key={item.id}>
							<CardHeader>
								<CardTitle className="text-base">{item.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-600">
									{item.description || 'No description provided'}
								</p>
								<p className="mt-2 text-sm font-medium">
									${item.price.toFixed(2)}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Event Details Section */}
			{registryData.event && (
				<div className="mb-8">
					<h2 className="mb-4 text-lg font-semibold">Event Details</h2>
					<Card>
						<CardHeader>
							<CardTitle className="text-base">
								{registryData.event.name}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<p className="text-sm text-gray-600">
									Date: {formatDateUTC(new Date(registryData.event.date))}
								</p>
								{registryData.event.startTime && (
									<p className="text-sm text-gray-600">
										Time: {registryData.event.startTime}
										{registryData.event.endTime
											? ` - ${registryData.event.endTime}`
											: ''}
									</p>
								)}
								{registryData.event.location && (
									<p className="text-sm text-gray-600">
										Location: {registryData.event.location}
									</p>
								)}
								{registryData.event.description && (
									<p className="text-sm text-gray-600">
										{registryData.event.description}
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	)
}
