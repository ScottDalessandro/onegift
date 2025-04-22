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
		registryItems: [
			{
				id: 1,
				name: 'LEGO Friends Heartlake City School',
				price: 59.99,
				category: 'Want',
				description: 'Emma loves building and creating stories with LEGO sets.',
				imageUrl: '/images/lego-school.jpg',
			},
			{
				id: 2,
				name: 'Art Supplies Set',
				price: 29.99,
				category: 'Need',
				description: 'Emma is getting into drawing and painting.',
				imageUrl: '/images/art-supplies.jpg',
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
			<div className="mb-8">
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

			<div className="mb-8">
				<h2 className="mb-4 text-lg font-semibold">Registry Completion</h2>
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

				{/* Completed Steps */}
				<div className="space-y-3">
					{registryData.completedSteps.map((step, index) => (
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

			{/* Quick Stats */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Items</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{registryData.items}</div>
						<p className="text-sm text-gray-500">Total items added</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Categories</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{registryData.categories.filled}/{registryData.categories.total}
						</div>
						<p className="text-sm text-gray-500">Categories filled</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Days Until Event</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Math.ceil(
								(registryData.date.getTime() - new Date().getTime()) /
									(1000 * 60 * 60 * 24),
							)}
						</div>
						<p className="text-sm text-gray-500">Coming soon!</p>
					</CardContent>
				</Card>
			</div>

			{/* Add the new tabbed section */}
			<div className="mt-8">
				<Tabs defaultValue="overview" className="w-full">
					<TabsList className="w-full bg-gray-100">
						<TabsTrigger value="overview" className="flex-1">
							Overview
						</TabsTrigger>
						<TabsTrigger value="items" className="flex-1">
							Items ({registryData.items})
						</TabsTrigger>
						<TabsTrigger value="profile" className="flex-1">
							Child's Profile
						</TabsTrigger>
						<TabsTrigger value="memories" className="flex-1">
							Digital Memories
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="mt-6">
						<div className="space-y-6">
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
											<dd className="text-lg">
												{registryData.childProfile.name}
											</dd>
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
									</dl>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="items" className="mt-6">
						<div className="mb-4 flex justify-between">
							<h3 className="text-lg font-semibold">Registry Items</h3>
							<button className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
								+ Add Item
							</button>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							{registryData.registryItems.map((item) => (
								<Card key={item.id}>
									<CardContent className="p-4">
										<div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100">
											{/* Placeholder for item image */}
											<div className="h-full w-full bg-gray-200" />
										</div>
										<div className="mb-2">
											<span className="inline-block rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800">
												{item.category}
											</span>
										</div>
										<h4 className="mb-1 font-medium">{item.name}</h4>
										<p className="mb-2 text-sm text-gray-600">
											{item.description}
										</p>
										<div className="flex items-center justify-between">
											<span className="font-bold">${item.price}</span>
											<button className="text-sm text-teal-600 hover:text-teal-700">
												View Product
											</button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						<div className="mt-6">
							<h4 className="mb-4 text-lg font-semibold">Category Balance</h4>
							<div className="grid grid-cols-5 gap-4">
								{['Want', 'Need', 'Experience', 'Wear', 'Learn'].map(
									(category) => (
										<div
											key={category}
											className="rounded-lg bg-gray-50 p-4 text-center"
										>
											<h5 className="mb-2 text-sm font-medium">{category}</h5>
											<p className="text-2xl font-bold text-teal-600">
												{category === 'Want' || category === 'Need' ? '1' : '0'}
											</p>
											{category !== 'Want' && category !== 'Need' && (
												<button className="mt-2 text-sm text-teal-600 hover:text-teal-700">
													Add Item
												</button>
											)}
										</div>
									),
								)}
							</div>
							<p className="mt-2 text-xs text-gray-500">
								Tip: A balanced registry should have at least one item in each
								category.
							</p>
						</div>
					</TabsContent>

					<TabsContent value="profile" className="mt-6">
						<div className="grid gap-6 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>About {registryData.childProfile.name}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="mb-4 text-gray-600">
										{registryData.childProfile.age} years old
									</p>

									<div className="mb-6">
										<h4 className="mb-2 font-medium">Interests</h4>
										<div className="flex gap-2">
											{registryData.childProfile.interests.map((interest) => (
												<span
													key={interest}
													className="rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-800"
												>
													{interest}
												</span>
											))}
										</div>
									</div>

									<div className="mb-6">
										<h4 className="mb-2 font-medium">Recent Achievements</h4>
										{registryData.childProfile.achievements.map(
											(achievement) => (
												<div
													key={achievement}
													className="mb-2 rounded-lg bg-yellow-50 p-2 text-sm text-yellow-800"
												>
													{achievement}
												</div>
											),
										)}
									</div>

									<div>
										<h4 className="mb-2 font-medium">Looking Forward To</h4>
										{registryData.childProfile.lookingForwardTo.map((item) => (
											<div
												key={item}
												className="mb-2 rounded-lg bg-purple-50 p-2 text-sm text-purple-800"
											>
												{item}
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>
										{registryData.childProfile.name}'s Photos
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="mb-4 text-sm text-gray-600">
										{registryData.childProfile.photos.length} photo added
									</p>
									<div className="grid gap-4">
										<div className="aspect-square rounded-lg bg-gray-100">
											{/* Placeholder for photo */}
											<div className="flex h-full w-full items-center justify-center">
												<button className="rounded-full bg-white p-4 shadow-sm">
													<svg
														className="h-6 w-6 text-gray-400"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 6v6m0 0v6m0-6h6m-6 0H6"
														/>
													</svg>
												</button>
											</div>
										</div>
									</div>
									<button className="mt-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
										+ Add Photos
									</button>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="memories" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Digital Memories</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-4 text-gray-600">
									Configure how gift givers can share digital memories and
									messages for {registryData.childProfile.name}.
								</p>
								<div className="space-y-4">
									<div className="rounded-lg border p-4">
										<h4 className="mb-2 font-medium">Photo Sharing</h4>
										<p className="mb-3 text-sm text-gray-600">
											Allow gift givers to upload photos with their gifts
										</p>
										<button className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
											Configure Photo Sharing
										</button>
									</div>
									<div className="rounded-lg border p-4">
										<h4 className="mb-2 font-medium">Video Messages</h4>
										<p className="mb-3 text-sm text-gray-600">
											Enable video message recordings from gift givers
										</p>
										<button className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
											Set Up Video Messages
										</button>
									</div>
									<div className="rounded-lg border p-4">
										<h4 className="mb-2 font-medium">Written Notes</h4>
										<p className="mb-3 text-sm text-gray-600">
											Collect written messages and well-wishes
										</p>
										<button className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
											Manage Written Notes
										</button>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
