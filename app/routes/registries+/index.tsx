// app/routes/registries/index.tsx
import { type LoaderFunctionArgs, Link, useLoaderData } from 'react-router'
import { Button } from '#app/components/ui/button'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { type RegistryListItem } from './+types/index.ts'

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)

	const registries = await prisma.registry.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
	})

	return { registries }
}

export default function RegistriesList() {
	const { registries } = useLoaderData<typeof loader>()

	return (
		<div className="mx-auto max-w-3xl p-8">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-2xl font-bold">My Registries</h1>
				<Button asChild>
					<Link to="new">Create New Registry</Link>
				</Button>
			</div>

			{registries.length === 0 ? (
				<p className="text-center text-gray-500">
					You haven't created any registries yet.
				</p>
			) : (
				<div className="space-y-4">
					{registries.map((registry: RegistryListItem) => (
						<div
							key={registry.id}
							className="rounded-lg border p-4 hover:bg-gray-50"
						>
							<Link to={registry.id}>
								<h2 className="text-xl font-semibold">{registry.title}</h2>
								<p className="text-gray-600">
									{new Date(registry.eventDate).toLocaleDateString()}
								</p>
								<p className="text-gray-600">Status: {registry.status}</p>
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
