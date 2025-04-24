import { useState } from 'react'
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

export default function RegistryDetails() {
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
							35% Complete
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
				)}
			</div>

			{/* Tabs Navigation */}
			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1">
					<TabsTrigger
						value="overview"
						className="flex items-center justify-start gap-2 px-4"
					>
						<svg
							className="h-4 w-4 text-gray-600"
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
					</TabsTrigger>
					<TabsTrigger
						value="items"
						className="flex items-center justify-start gap-2 px-4"
					>
						<svg
							className="h-4 w-4 text-gray-600"
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
						Items (2)
					</TabsTrigger>
					<TabsTrigger
						value="profile"
						className="flex items-center justify-start gap-2 px-4"
					>
						<svg
							className="h-4 w-4 text-gray-600"
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
					</TabsTrigger>
					<TabsTrigger
						value="memories"
						className="flex items-center justify-start gap-2 px-4"
					>
						<svg
							className="h-4 w-4 text-gray-600"
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
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="mt-6">
					<div className="grid gap-6 md:grid-cols-2">
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
									<div>
										<dt className="text-sm font-medium text-gray-500">
											Created
										</dt>
										<dd className="text-lg">4/30/2023</dd>
									</div>
									<div>
										<dt className="text-sm font-medium text-gray-500">
											Status
										</dt>
										<dd>
											<span className="inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
												Draft
											</span>
										</dd>
									</div>
								</dl>
								<div className="mt-6">
									<button className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
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
												d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
											/>
										</svg>
										Edit Details
									</button>
								</div>
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
											<h3 className="text-sm font-medium text-gray-500">
												Items
											</h3>
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
											<p className="mt-1 text-2xl font-bold text-teal-600">
												100%
											</p>
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
									{registryData.childProfile.achievements.map((achievement) => (
										<div
											key={achievement}
											className="mb-2 rounded-lg bg-yellow-50 p-2 text-sm text-yellow-800"
										>
											{achievement}
										</div>
									))}
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
								<CardTitle>{registryData.childProfile.name}'s Photos</CardTitle>
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
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-xl font-semibold">Digital Memories</h2>
						<button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
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
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Configure Options
						</button>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<div className="rounded-lg border border-gray-200 p-6">
							<h3 className="mb-2 text-lg font-medium">
								Available Memory Types
							</h3>
							<p className="mb-6 text-sm text-gray-600">
								These are the digital memory options available to gift givers
							</p>

							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<div className="rounded-full bg-teal-100 p-2">
										<svg
											className="h-5 w-5 text-teal-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									</div>
									<div>
										<h4 className="font-medium">Photo Booth</h4>
										<p className="text-sm text-gray-600">
											Create fun photo strips with filters
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="rounded-full bg-teal-100 p-2">
										<svg
											className="h-5 w-5 text-teal-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
											/>
										</svg>
									</div>
									<div>
										<h4 className="font-medium">Mixtape</h4>
										<p className="text-sm text-gray-600">
											Share favorite songs and memories
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="rounded-full bg-teal-100 p-2">
										<svg
											className="h-5 w-5 text-teal-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<div>
										<h4 className="font-medium">Video Challenges</h4>
										<p className="text-sm text-gray-600">
											Record fun video challenges
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="rounded-full bg-teal-100 p-2">
										<svg
											className="h-5 w-5 text-teal-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
											/>
										</svg>
									</div>
									<div>
										<h4 className="font-medium">Q&A Prompts</h4>
										<p className="text-sm text-gray-600">
											Answer questions about your relationship
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="rounded-lg border border-gray-200 p-6">
							<h3 className="mb-2 text-lg font-medium">Memory Collection</h3>
							<p className="mb-6 text-sm text-gray-600">
								Digital memories created by gift givers
							</p>

							<div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-8 text-center">
								<svg
									className="mb-4 h-16 w-16 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<h4 className="mb-2 text-lg font-medium">No Memories Yet</h4>
								<p className="text-sm text-gray-600">
									Digital memories will appear here after your registry is
									published and gift givers create them.
								</p>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
