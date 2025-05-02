import { useParams, useLoaderData } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/node'

interface ListItem {
	id: number
	name: string
	price: number
	priority: string
}

export async function loader({ params }: LoaderFunctionArgs) {
	const { listId_ } = params

	// TODO: Fetch items from your database
	const items: ListItem[] = [
		// Sample items - replace with actual data
		{ id: 1, name: 'Item 1', price: 29.99, priority: 'High' },
		{ id: 2, name: 'Item 2', price: 19.99, priority: 'Medium' },
	]

	return json({ items })
}

export default function ListItems() {
	const { items } = useLoaderData<typeof loader>()

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">List Items</h1>
				<button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
					Add Item
				</button>
			</div>

			<div className="rounded-lg bg-white shadow">
				<table className="min-w-full">
					<thead>
						<tr className="border-b">
							<th className="p-4 text-left">Name</th>
							<th className="p-4 text-left">Price</th>
							<th className="p-4 text-left">Priority</th>
							<th className="p-4 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item: ListItem) => (
							<tr key={item.id} className="border-b">
								<td className="p-4">{item.name}</td>
								<td className="p-4">${item.price}</td>
								<td className="p-4">{item.priority}</td>
								<td className="p-4">
									<button className="mr-2 text-blue-500 hover:text-blue-700">
										Edit
									</button>
									<button className="text-red-500 hover:text-red-700">
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
