import { Outlet } from 'react-router'

export default function DashboardLayout() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Top Navigation */}
			<header className="bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 justify-between">
						<div className="flex">
							<div className="flex flex-shrink-0 items-center">
								<span className="text-xl font-semibold text-gray-900">
									Dashboard
								</span>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main>
				<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
					<Outlet />
				</div>
			</main>
		</div>
	)
}
