import { useLoaderData, Link } from 'react-router'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import type { LoaderFunctionArgs } from 'react-router'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'

interface List {
	id: string
	title: string
	description: string
	itemCount: number
	createdAt: string
}

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)

	const lists = await prisma.list.findMany({
		where: { ownerId: userId },
		orderBy: { createdAt: 'desc' },
		include: {
			items: {
				select: { id: true },
			},
		},
	})

	return {
		lists: lists.map((list) => ({
			id: list.id,
			title: list.title,
			description: list.description || '',
			itemCount: list.items.length,
			createdAt: list.createdAt.toISOString(),
		})),
	}
}

export default function ListsIndex() {
	const { lists } = useLoaderData() as { lists: List[] }

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">My Lists</h1>
				{lists.length > 0 && (
					<Button
						asChild
						className="gap-2 px-5 py-2.5 text-base font-semibold shadow-sm"
						variant="default"
						size="default"
					>
						<Link to="/dashboard/lists/new">
							<Icon name="plus" size="sm" />
							Create New List
						</Link>
					</Button>
				)}
			</div>

			{lists.length === 0 ? (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<Link
						to="/dashboard/lists/new"
						className="relative flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center hover:border-blue-500 hover:bg-blue-50"
					>
						<svg
							className="mb-4 h-12 w-12 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						<h3 className="text-lg font-medium text-gray-900">
							Create Your First List
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							Start by creating a new list for your special occasion
						</p>
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{lists.map((list) => (
						<Link
							key={list.id}
							to={`/dashboard/lists/${list.id}`}
							className="relative flex flex-col rounded-lg border bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
							tabIndex={0}
						>
							<h3 className="text-lg font-medium text-gray-900">
								{list.title}
							</h3>
							<p className="mt-1 text-sm text-gray-500">{list.description}</p>
							<div className="mt-4 flex items-center justify-between text-sm text-gray-500">
								<span>{list.itemCount} items</span>
								<span>
									Created {new Date(list.createdAt).toLocaleDateString()}
								</span>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
