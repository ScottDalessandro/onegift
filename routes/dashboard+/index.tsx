import { Link } from 'react-router'

export default function DashboardIndex() {
	return (
		<div className="space-y-6">
			<div className="bg-white shadow sm:rounded-lg">
				<div className="px-4 py-5 sm:p-6">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Welcome to your Dashboard
					</h3>
					<div className="mt-2 max-w-xl text-sm text-gray-500">
						<p>Manage your lists and items from here.</p>
					</div>
					<div className="mt-5">
						<Link
							to="/dashboard/lists"
							className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
						>
							Go to Lists
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
