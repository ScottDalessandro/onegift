// app/routes/registries/index.tsx
import { type LoaderFunctionArgs, Link, useLoaderData } from 'react-router'
import { Button } from '#app/components/ui/button'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)

	const lists = await prisma.list.findMany({
		where: { ownerId: userId },
		orderBy: { createdAt: 'desc' },
	})

	return { lists }
}

export default function ListsList() {
	const { lists } = useLoaderData<typeof loader>()
	// console.log('lists', lists)
	return (
		<div className="mx-auto max-w-3xl p-8">
			<div className="mb-8 flex items-center justify-between gap-8">
				<h1 className="text-2xl font-bold">My Gift Lists</h1>
				<Button asChild className="ml-4">
					<Link to="new">Create New Gift List</Link>
				</Button>
			</div>

			{lists.length === 0 ? (
				<p className="text-center text-gray-500">
					You haven't created any lists yet.
				</p>
			) : (
				<div className="space-y-4">
					{lists.map((list) => (
						<div
							key={list.id}
							className="rounded-lg border p-4 hover:bg-gray-50"
						>
							<Link to={list.id}>
								<h2 className="text-xl font-semibold">{list.title}</h2>
								{/* <p className="text-gray-600">{list.eventDate}</p> */}
								<p className="text-gray-600">Status: {list.status}</p>
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
