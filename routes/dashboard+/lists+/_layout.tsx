import { Outlet, NavLink, useParams } from 'react-router'

export default function ListsLayout() {
	const { listId_ } = useParams()

	return (
		<div className="flex min-h-screen">
			{/* Sidebar */}
			<div className="w-64 border-r bg-gray-50">
				<div className="p-4">
					<h2 className="text-lg font-semibold text-gray-700">
						Lists Management
					</h2>
				</div>
				<nav className="space-y-1 p-4">
					<NavLink
						to="/dashboard/lists"
						className={({ isActive }: { isActive: boolean }) =>
							`block rounded-md px-3 py-2 text-sm font-medium ${
								isActive
									? 'bg-blue-50 text-blue-700'
									: 'text-gray-700 hover:bg-gray-100'
							}`
						}
						end
					>
						All Lists
					</NavLink>
					<NavLink
						to="/dashboard/lists/new"
						className={({ isActive }: { isActive: boolean }) =>
							`block rounded-md px-3 py-2 text-sm font-medium ${
								isActive
									? 'bg-blue-50 text-blue-700'
									: 'text-gray-700 hover:bg-gray-100'
							}`
						}
					>
						Create New List
					</NavLink>
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1 overflow-auto">
				<Outlet />
			</div>
		</div>
	)
}
