import { useLoaderData } from 'react-router'

interface List {
	id: string
	title: string
	description: string
	itemCount: number
	createdAt: string
}

export async function loader({ params }: { params: { listId_: string } }) {
	// TODO: Fetch list details from your database
	const list: List = {
		id: params.listId_,
		title: 'My List',
		description: 'A sample list description',
		itemCount: 0,
		createdAt: new Date().toISOString(),
	}

	return { list }
}

export default function SingleList() {
	const { list } = useLoaderData() as { list: List }

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">{list.title}</h1>
				<p className="mt-2 text-gray-600">{list.description}</p>
			</div>

			<div className="rounded-lg border bg-white p-6 shadow-sm">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-medium text-gray-900">Items</h2>
					<button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
						Add Item
					</button>
				</div>

				<div className="mt-4">
					<p className="text-sm text-gray-500">
						No items yet. Add your first item to get started!
					</p>
				</div>
			</div>
		</div>
	)
}
