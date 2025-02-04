import { type Registry, type RegistryItem } from '@prisma/client'
import { useOutletContext, Link } from 'react-router'
import { Button } from '#app/components/ui/button'

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
						<div key={item.id} className="rounded-lg border p-4">
							<h3 className="font-semibold">{item.name}</h3>
							<p className="text-gray-600">${item.price.toString()}</p>
							{item.description && (
								<p className="mt-2 text-sm text-gray-500">{item.description}</p>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
