import { Link, useOutletContext } from 'react-router'
import { Button } from '#app/components/ui/button.tsx'
import { formatDecimal } from '#app/utils/format.ts'
import { type loader } from './_layout.tsx'

export default function ItemDetailsRoute() {
	const { item } = useOutletContext<{
		item: Awaited<ReturnType<typeof loader>>['item']
	}>()
	return (
		<>
			<div className="mb-8">
				<Link
					to={`/lists/${item.list.id}`}
					className="text-blue-600 hover:underline"
				>
					← Back to Items
				</Link>
			</div>

			<div className="rounded-lg border bg-white p-6 shadow-sm">
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-2xl font-bold">{item.name}</h1>
					<Button asChild variant="outline">
						<Link to="edit">Edit Item</Link>
					</Button>
				</div>

				{item.imageUrl && (
					<img
						src={item.imageUrl}
						alt={item.name}
						className="mb-6 h-64 w-full rounded-lg object-cover"
					/>
				)}

				<div className="space-y-4">
					{item.description && (
						<div>
							<h2 className="text-lg font-semibold">Description</h2>
							<p className="text-gray-600">{item.description}</p>
						</div>
					)}

					<div>
						<h2 className="text-lg font-semibold">Price</h2>
						<p className="text-gray-600">${formatDecimal(item.price)}</p>
					</div>

					{item.category && (
						<div>
							<h2 className="text-lg font-semibold">Category</h2>
							<p className="capitalize text-gray-600">{item.category}</p>
						</div>
					)}

					{item.url && (
						<div>
							<h2 className="text-lg font-semibold">Purchase Link</h2>
							<a
								href={item.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:underline"
							>
								View Item on Retailer Site
							</a>
						</div>
					)}

					<div>
						<h2 className="text-lg font-semibold">Added On</h2>
						<p className="text-gray-600">
							{new Date(item.createdAt).toLocaleDateString()}
						</p>
					</div>
				</div>
			</div>
		</>
	)
}
