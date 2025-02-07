import { type Registry, type RegistryItem } from '@prisma/client'
import { useOutletContext, Link } from 'react-router'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Button } from '#app/components/ui/button'
import { formatDecimal } from '#app/utils/format.ts'
type ContextType = {
	registry: Registry & { items: RegistryItem[] }
}

export default function RegistryIndex() {
	const { registry } = useOutletContext<ContextType>()
	return (
		<div>
			<div className="mb-6 flex justify-between">
				<h2 className="text-xl font-bold">Registry Items</h2>
				<Button asChild>
					<Link to="items/new">Add Item</Link>
				</Button>
			</div>

			{registry.items.length === 0 ? (
				<p className="text-center text-gray-500">
					No items added to this registry yet.
				</p>
			) : (
				<div className="grid gap-4 sm:grid-cols-2">
					{registry.items.map((item) => (
						<Link to={`items/${item.id}`} key={item.id}>
							<div className="rounded-lg border p-4">
								<h3 className="font-semibold">{item.name}</h3>
								<p className="text-gray-600">${formatDecimal(item.price)}</p>
								{item.description && (
									<p className="mt-2 text-sm text-gray-500">
										{item.description}
									</p>
								)}
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No registry with the id "{params.registryId}" exists</p>
				),
			}}
		/>
	)
}
