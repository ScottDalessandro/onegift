import { useLoaderData, type LoaderFunctionArgs } from 'react-router'
import { prisma } from '#app/utils/db.server.ts'

export async function loader({ params }: LoaderFunctionArgs) {
	const list = await prisma.list.findUnique({
		where: { id: params.listId },
		include: {
			items: {
				orderBy: { createdAt: 'desc' },
			},
		},
	})

	if (!list) {
		throw new Response('Not found', { status: 404 })
	}

	// Group items by category
	const itemsByCategory = list.items.reduce(
		(acc, item) => {
			const category = item.category || 'Uncategorized'
			if (!acc[category]) {
				acc[category] = []
			}
			acc[category].push(item)
			return acc
		},
		{} as Record<string, typeof list.items>,
	)

	return { list, itemsByCategory }
}

// Define the type based on the loader's return type
type LoaderData = Awaited<ReturnType<typeof loader>>

export default function ListRoute() {
	// Use the useLoaderData hook with the defined type
	const { list, itemsByCategory } = useLoaderData<LoaderData>()

	return (
		<div className="mx-auto max-w-4xl p-8">
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold">{list.title}</h1>
				<p className="mt-2 text-gray-600">
					Event Date: {new Date(list.eventDate).toLocaleDateString()}
				</p>
			</div>

			{list.description && (
				<div className="mb-8 rounded-lg bg-gray-50 p-6">
					<h2 className="mb-2 text-xl font-semibold">
						A Note from the Recipient
					</h2>
					<p className="text-gray-700">{list.description}</p>
				</div>
			)}

			<div className="space-y-8">
				{Object.entries(itemsByCategory).map(([category, items]) => (
					<div key={category}>
						<h2 className="mb-4 text-2xl font-semibold capitalize">
							{category}
						</h2>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{items.map((item) => (
								<div
									key={item.id}
									className="rounded-lg border p-4 shadow-sm transition hover:shadow-md"
								>
									{item.imageUrl && (
										<img
											src={item.imageUrl}
											alt={item.name}
											className="mb-3 h-48 w-full rounded-md object-cover"
										/>
									)}
									<h3 className="font-semibold">{item.name}</h3>
									{item.description && (
										<p className="mt-1 text-sm text-gray-600">
											{item.description}
										</p>
									)}
									<p className="mt-2 text-lg font-medium">
										${Number(item.price).toFixed(2)}
									</p>
									{item.url && (
										<a
											href={item.url}
											target="_blank"
											rel="noopener noreferrer"
											className="mt-3 block rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600"
										>
											View Item
										</a>
									)}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
