import { Outlet, NavLink, useParams, useLoaderData } from 'react-router'

interface List {
	id: string
	title: string
}

// The loader function will need to be adapted to your data fetching solution
export async function loader({ params }: { params: { listId_: string } }) {
	const { listId_ } = params

	// TODO: Fetch list details from your database
	const list: List = {
		id: listId_,
		title: 'My List',
	}

	return { list }
}

export default function SingleListLayout() {
	const { list } = useLoaderData() as { list: List }
	const { listId_ } = useParams()

	return (
		<div className="flex flex-col">
			{/* List Header */}
			<div className="border-b bg-white px-6 py-4">
				<h1 className="text-2xl font-bold text-gray-900">{list.title}</h1>
			</div>

			{/* Navigation Tabs */}
			<div className="border-b bg-white px-6">
				<nav className="-mb-px flex space-x-8">
					<NavLink
						to={`/dashboard/lists/${listId_}`}
						className={({ isActive }: { isActive: boolean }) =>
							`border-b-2 px-1 py-4 text-sm font-medium ${
								isActive
									? 'border-blue-500 text-blue-600'
									: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
							}`
						}
						end
					>
						Overview
					</NavLink>
					<NavLink
						to={`/dashboard/lists/${listId_}/items`}
						className={({ isActive }: { isActive: boolean }) =>
							`border-b-2 px-1 py-4 text-sm font-medium ${
								isActive
									? 'border-blue-500 text-blue-600'
									: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
							}`
						}
					>
						Items
					</NavLink>
					<NavLink
						to={`/dashboard/lists/${listId_}/settings`}
						className={({ isActive }: { isActive: boolean }) =>
							`border-b-2 px-1 py-4 text-sm font-medium ${
								isActive
									? 'border-blue-500 text-blue-600'
									: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
							}`
						}
					>
						Settings
					</NavLink>
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	)
}
