import { type List, type ListItem } from '@prisma/client'
import { useOutletContext, Link } from 'react-router'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Button } from '#app/components/ui/button'
import { formatDecimal } from '#app/utils/format.ts'
type ContextType = {
	list: List & { items: ListItem[] }
}

export default function ListIndex() {
	const { list } = useOutletContext<ContextType>()
	return (
		<div>
			<div className="mb-6 flex justify-between">
				<h2 className="text-xl font-bold">List Items</h2>
				<Button asChild>
					<Link to="items/new">Add Item</Link>
				</Button>
			</div>

			{list.items.length === 0 ? (
				<p className="text-center text-gray-500">
					No items added to this list yet.
				</p>
			) : (
				<div className="grid gap-4 sm:grid-cols-2">
					{list.items.map((item) => (
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
					<p>No list with the id "{params.listId}" exists</p>
				),
			}}
		/>
	)
}
