import { useState } from 'react'
import { useParams } from 'react-router'
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
