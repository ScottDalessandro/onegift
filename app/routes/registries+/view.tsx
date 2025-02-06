import { type LoaderFunctionArgs } from 'react-router'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/$registryId.ts'

export async function loader({ params }: LoaderFunctionArgs) {
	const registry = await prisma.registry.findUnique({
		where: { id: params.registryId },
		include: {
			items: {
				orderBy: { createdAt: 'desc' },
			},
		},
	})

	if (!registry) {
		throw new Response('Not found', { status: 404 })
	}

	// Group items by category
	const itemsByCategory = registry.items.reduce(
		(acc, item) => {
			const category = item.category || 'Uncategorized'
			if (!acc[category]) {
				acc[category] = []
			}
			acc[category].push(item)
			return acc
		},
		{} as Record<string, typeof registry.items>,
	)

	return { registry, itemsByCategory }
}

export default function RegistryRoute({ loaderData }: Route.ComponentProps) {
	const { registry, itemsByCategory } = loaderData

	return (
		<div className="mx-auto max-w-4xl p-8">
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold">{registry.title}</h1>
				<p className="mt-2 text-gray-600">
					Event Date: {new Date(registry.eventDate).toLocaleDateString()}
				</p>
			</div>

			{registry.description && (
				<div className="mb-8 rounded-lg bg-gray-50 p-6">
					<h2 className="mb-2 text-xl font-semibold">
						A Note from the Recipient
					</h2>
					<p className="text-gray-700">{registry.description}</p>
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
