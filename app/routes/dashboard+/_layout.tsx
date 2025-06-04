import { Link, Outlet } from 'react-router'
import { Icon } from '#app/components/ui/icon'
import { cn } from '#app/utils/misc'
import { useState } from 'react'

const sidebarItems = [
	{
		icon: 'gift' as const,
		label: 'Dashboard',
		to: '/dashboard',
	},
	{
		icon: 'file-text' as const,
		label: 'My Registries',
		to: '/dashboard/lists',
	},
	{
		icon: 'camera' as const,
		label: 'Digital Memories',
		to: '/dashboard/memories',
	},
	{
		icon: 'avatar' as const,
		label: 'Family & Friends',
		to: '/dashboard/family',
	},
	{
		icon: 'link-2' as const,
		label: 'Payments',
		to: '/dashboard/payments',
	},
	{
		icon: 'pencil-2' as const,
		label: 'Settings',
		to: '/dashboard/settings',
	},
]

export default function DashboardLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	return (
		<div className="flex min-h-screen">
			{/* Mobile Sidebar Overlay */}
			<div
				className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
				onClick={() => setSidebarOpen(false)}
			/>

			{/* Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-gray-50 transition-transform duration-200 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:block`}
			>
				<div className="flex h-full flex-col">
					{/* Logo */}
					<div className="flex items-center justify-between border-b p-4">
						<Link to="/" className="flex items-center gap-2 text-xl font-bold">
							<Icon name="gift" className="h-6 w-6 text-teal-500" />
							<span>
								Wish <span className="text-teal-500">&</span> Well
							</span>
						</Link>
						{/* Close button on mobile */}
						<button
							className="ml-2 rounded p-2 hover:bg-gray-200 md:hidden"
							onClick={() => setSidebarOpen(false)}
							aria-label="Close sidebar"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 space-y-1 p-4">
						{sidebarItems.map((item) => (
							<Link
								key={item.to}
								to={item.to}
								className={cn(
									'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 transition-colors',
									'hover:bg-gray-100',
								)}
							>
								<Icon name={item.icon} className="h-5 w-5 text-gray-500" />
								{item.label}
							</Link>
						))}
					</nav>
				</div>
			</aside>

			{/* Main Content */}
			<div className="flex min-h-screen flex-1 flex-col">
				{/* Top bar for mobile */}
				<div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm md:hidden">
					<button
						className="rounded p-2 hover:bg-gray-100"
						onClick={() => setSidebarOpen(true)}
						aria-label="Open sidebar"
					>
						<svg
							className="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
					<span className="text-lg font-bold">Wish & Well</span>
					<div />
				</div>
				<main className="flex-1 overflow-auto">
					<Outlet />
				</main>
			</div>
		</div>
	)
}
