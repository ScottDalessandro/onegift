import { useLoaderData, Link } from 'react-router'

interface List {
	id: string
	title: string
	description: string
	itemCount: number
	createdAt: string
}

export async function loader() {
	// TODO: Fetch lists from your database
	const lists: List[] = [
		{
			id: 'birthday-123',
			title: 'Birthday Wishlist',
			description: 'Things I would like for my birthday',
			itemCount: 12,
			createdAt: '2024-03-20',
		},
		{
			id: 'holiday-456',
			title: 'Holiday Gifts',
			description: 'Gift ideas for the holidays',
			itemCount: 8,
			createdAt: '2024-03-19',
		},
	]

	return { lists }
}

export default function ListsIndex() {
	const { lists } = useLoaderData() as { lists: List[] }

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">My Lists</h1>
				<Link
					to="/dashboard/lists/new"
					className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					Create New List
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{lists.map((list) => (
					<div
						key={list.id}
						className="relative rounded-lg border bg-white p-6 shadow-sm hover:shadow"
					>
						<div className="flex flex-col">
							<h3 className="text-lg font-medium text-gray-900">
								<Link
									to={`/dashboard/lists/${list.id}`}
									className="hover:underline"
								>
									{list.title}
								</Link>
							</h3>
							<p className="mt-1 text-sm text-gray-500">{list.description}</p>
							<div className="mt-4 flex items-center justify-between text-sm text-gray-500">
								<span>{list.itemCount} items</span>
								<span>
									Created {new Date(list.createdAt).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
