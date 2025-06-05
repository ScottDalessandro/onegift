import { useParams, NavLink, useSearchParams } from 'react-router'
import { useState, useMemo, useCallback } from 'react'
import { cn } from '#app/lib/utils'
import { Button } from '#app/components/ui/button'
import { Card } from '#app/components/ui/card'
import { SearchBar } from '#app/components/items-search-bar' // Your new component
import {
	Gift,
	User,
	Camera,
	Calendar,
	LayoutGrid,
	List as ListIcon,
	Pencil,
	Trash2,
} from 'lucide-react'

interface Item {
	id: number
	category: string
	name: string
	price: string
	description: string
}

export default function RegistryItems() {
	const { id } = useParams()
	const [searchParams] = useSearchParams()
	const [view, setView] = useState<'grid' | 'list'>('grid')

	// Get search from URL
	const searchQuery = searchParams.get('search') || ''

	// Placeholder data (in real app, this would come from loader)
	const items = [
		{
			id: 1,
			category: 'Want',
			name: 'LEGO Friends Heartlake City School',
			price: '$59.99',
			description: 'Emma loves building and creating stories with LEGO sets.',
		},
		{
			id: 2,
			category: 'Need',
			name: 'Art Supplies Set',
			price: '$29.99',
			description: 'Emma is getting into drawing and painting.',
		},
		{
			id: 3,
			category: 'Experience',
			name: "Children's Museum Annual Pass",
			price: '$120.00',
			description: 'Emma loves learning through interactive exhibits.',
		},
		{
			id: 4,
			category: 'Wear',
			name: 'Rain Boots',
			price: '$24.99',
			description: 'Emma needs new rain boots for spring puddle jumping!',
		},
		{
			id: 5,
			category: 'Learn',
			name: "Beginner's Piano Lessons (3 months)",
			price: '$150.00',
			description: 'Emma has shown interest in learning to play piano.',
		},
		{
			id: 6,
			category: 'Want',
			name: 'Watercolor Paint Set',
			price: '$45.99',
			description: 'Professional quality watercolors for young artists.',
		},
	]

	// Memoized search function for better performance
	const searchItems = useCallback((items: Item[], query: string) => {
		if (!query.trim()) return items

		const lowercaseQuery = query.toLowerCase()
		return items.filter(
			(item) =>
				item.name.toLowerCase().includes(lowercaseQuery) ||
				item.description.toLowerCase().includes(lowercaseQuery) ||
				item.category.toLowerCase().includes(lowercaseQuery),
		)
	}, [])

	// Memoized filtered items
	const filteredItems = useMemo(
		() => searchItems(items, searchQuery),
		[items, searchQuery, searchItems],
	)

	// Handle search changes
	const handleSearch = useCallback((query: string) => {
		// Search state is managed by SearchBar component via URL params
		// This could trigger server-side search in a real app
		console.log('Search query:', query)
	}, [])

	const categoryCounts = useMemo(() => {
		const counts = { Want: 0, Need: 0, Experience: 0, Wear: 0, Learn: 0 }
		filteredItems.forEach((item) => {
			if (item.category in counts) {
				counts[item.category as keyof typeof counts]++
			}
		})
		return counts
	}, [filteredItems])

	// Tab config
	const tabs = [
		{
			label: `Items (${filteredItems.length})`,
			to: `/dashboard/lists/${id}/items`,
			icon: Gift,
		},
		{ label: 'Profile', to: `/dashboard/lists/${id}/profile`, icon: User },
		{ label: 'Memories', to: `/dashboard/lists/${id}/memories`, icon: Camera },
		{ label: 'Overview', to: `/dashboard/lists/${id}`, icon: Calendar },
	]

	return (
		<div className="container py-8">
			{/* Back Button */}
			<div className="mb-2 flex items-center gap-2">
				<button className="flex items-center text-gray-500 hover:text-gray-700">
					<svg
						className="mr-1 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Back
				</button>
				<span className="ml-2 text-2xl font-extrabold tracking-tight">
					Registry Items
				</span>
			</div>
			<div className="mb-4 ml-12 text-base font-medium text-gray-400">
				Emma's 5th Birthday
			</div>

			{/* Tabs */}
			<div className="mb-6 flex flex-wrap gap-2">
				{tabs.map(({ label, to, icon: Icon }, i) => (
					<NavLink
						key={label}
						to={to}
						end={i === 0 || i === 3}
						className={({ isActive }) =>
							cn(
								'flex items-center gap-2 rounded-md px-5 py-2.5 text-base font-semibold transition-colors',
								isActive
									? 'border-none bg-teal-500 text-white shadow-none'
									: 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50',
								'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
							)
						}
						aria-label={label}
					>
						<Icon className="h-5 w-5" />
						{label}
					</NavLink>
				))}
			</div>

			{/* Manage Items Header & Actions */}
			<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="text-xl font-bold">Manage Items</div>
					<div className="text-sm text-gray-500">
						{searchQuery ? (
							<>
								Showing {filteredItems.length} of {items.length} items for "
								{searchQuery}"
							</>
						) : (
							<>
								{filteredItems.length} of {items.length} items
							</>
						)}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						className="flex items-center gap-2"
						aria-label="Filters"
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
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-7 7V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5.293l-7-7A1 1 0 013 6V4z"
							/>
						</svg>
						Filters
					</Button>
					<div className="inline-flex overflow-hidden rounded-md border border-teal-500 shadow-sm">
						<Button
							variant={view === 'grid' ? 'default' : 'ghost'}
							className={cn(
								'flex items-center gap-2 rounded-none px-3 py-2',
								view === 'grid'
									? 'bg-teal-500 text-white hover:bg-teal-600'
									: 'bg-white text-teal-500 hover:bg-teal-50',
							)}
							aria-label="Grid view"
							onClick={() => setView('grid')}
						>
							<LayoutGrid className="h-5 w-5" />
						</Button>
						<Button
							variant={view === 'list' ? 'default' : 'ghost'}
							className={cn(
								'flex items-center gap-2 rounded-none border-l border-teal-500 px-3 py-2',
								view === 'list'
									? 'bg-teal-500 text-white hover:bg-teal-600'
									: 'bg-white text-teal-500 hover:bg-teal-50',
							)}
							aria-label="List view"
							onClick={() => setView('list')}
						>
							<ListIcon className="h-5 w-5" />
						</Button>
					</div>
					<Button
						className="rounded-md bg-teal-500 px-5 py-2 font-semibold text-white hover:bg-teal-600"
						aria-label="Add Item"
					>
						+ Add Item
					</Button>
				</div>
			</div>

			{/* Enhanced Search Bar */}
			<SearchBar
				onSearch={handleSearch}
				className="mb-4 w-full"
				placeholder="Search items by name, description, or category..."
			/>

			{/* No Results Message */}
			{searchQuery && filteredItems.length === 0 && (
				<div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
					<div className="mb-2 text-lg font-medium text-gray-900">
						No items found
					</div>
					<div className="text-gray-600">
						No items match your search for "{searchQuery}". Try a different
						search term.
					</div>
				</div>
			)}

			{/* Items View - Grid */}
			{view === 'grid' && filteredItems.length > 0 && (
				<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{filteredItems.map((item) => (
						<Card key={item.id} className="flex flex-col">
							<div className="relative flex flex-col">
								{/* Image Placeholder */}
								<div className="flex h-48 w-full items-center justify-center bg-gray-100">
									<svg
										className="h-10 w-10 text-gray-300"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<circle cx="12" cy="12" r="10" strokeWidth="2" />
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M8 12l2 2 4-4"
										/>
									</svg>
								</div>
								{/* Edit/Delete Icons */}
								<div className="absolute right-2 top-2 flex gap-2">
									<button
										className="rounded bg-white p-1 text-gray-400 shadow hover:text-gray-600"
										aria-label="Edit"
									>
										<Pencil className="h-4 w-4" />
									</button>
									<button
										className="rounded bg-white p-1 text-red-400 shadow hover:text-red-600"
										aria-label="Delete"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>
							<div className="flex flex-1 flex-col p-4">
								<div className="mb-2 flex items-center gap-2">
									<span
										className={cn(
											'rounded px-2 py-0.5 text-xs font-semibold',
											item.category === 'Want' && 'bg-teal-50 text-teal-700',
											item.category === 'Need' && 'bg-blue-50 text-blue-700',
											item.category === 'Experience' &&
												'bg-yellow-50 text-yellow-700',
											item.category === 'Wear' && 'bg-green-50 text-green-700',
											item.category === 'Learn' &&
												'bg-purple-50 text-purple-700',
										)}
									>
										{item.category}
									</span>
									<span className="ml-auto text-base font-semibold">
										{item.price}
									</span>
								</div>
								<h3 className="mb-1 text-lg font-bold">{item.name}</h3>
								<p className="mb-2 text-sm text-gray-600">{item.description}</p>
								<a href="#" className="text-sm text-teal-600 hover:underline">
									View Product
								</a>
							</div>
						</Card>
					))}
				</div>
			)}

			{/* Items View - List */}
			{view === 'list' && filteredItems.length > 0 && (
				<div className="mb-6 flex flex-col gap-4">
					{filteredItems.map((item) => (
						<Card
							key={item.id}
							className="flex flex-row items-center gap-4 p-4"
						>
							{/* Image Placeholder */}
							<div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded bg-gray-100">
								<svg
									className="h-7 w-7 text-gray-300"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<circle cx="12" cy="12" r="10" strokeWidth="2" />
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M8 12l2 2 4-4"
									/>
								</svg>
							</div>
							{/* Info */}
							<div className="flex flex-1 flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="text-base font-bold">{item.name}</span>
									<span
										className={cn(
											'rounded px-2 py-0.5 text-xs font-semibold',
											item.category === 'Want' && 'bg-teal-50 text-teal-700',
											item.category === 'Need' && 'bg-blue-50 text-blue-700',
											item.category === 'Experience' &&
												'bg-yellow-50 text-yellow-700',
											item.category === 'Wear' && 'bg-green-50 text-green-700',
											item.category === 'Learn' &&
												'bg-purple-50 text-purple-700',
										)}
									>
										{item.category}
									</span>
								</div>
								<div className="text-sm text-gray-600">{item.description}</div>
								<div className="mt-1 flex items-center gap-4">
									<span className="font-semibold">{item.price}</span>
									<a href="#" className="text-sm text-teal-600 hover:underline">
										View Product
									</a>
								</div>
							</div>
							{/* Actions */}
							<div className="ml-auto flex flex-col gap-2">
								<button
									className="rounded bg-white p-1 text-gray-400 shadow hover:text-gray-600"
									aria-label="Edit"
								>
									<Pencil className="h-4 w-4" />
								</button>
								<button
									className="rounded bg-white p-1 text-red-400 shadow hover:text-red-600"
									aria-label="Delete"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
						</Card>
					))}
				</div>
			)}

			{/* Pagination */}
			{filteredItems.length > 0 && (
				<div className="mb-6 flex flex-col items-center justify-between gap-2 sm:flex-row">
					<span className="text-sm text-gray-600">
						Showing {Math.min(filteredItems.length, 6)} of{' '}
						{filteredItems.length} items
						{searchQuery && ` for "${searchQuery}"`}
					</span>
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm">
							Previous
						</Button>
						<span className="text-sm text-gray-600">Page 1 of 1</span>
						<Button variant="outline" size="sm">
							Next
						</Button>
					</div>
				</div>
			)}

			{/* Category Balance - Updated counts based on search */}
			{filteredItems.length > 0 && (
				<div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-5">
					{Object.entries(categoryCounts).map(([cat, count]) => (
						<div
							key={cat}
							className="flex flex-col items-center rounded bg-gray-50 p-2"
						>
							<span className="text-lg font-bold">{count}</span>
							<span className="text-xs">{cat}</span>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
