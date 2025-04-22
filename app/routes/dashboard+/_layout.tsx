import { Link, Outlet } from 'react-router'
import { Icon } from '#app/components/ui/icon'
import { cn } from '#app/utils/misc'

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
	return (
		<div className="flex min-h-screen">
			{/* Sidebar */}
			<aside className="w-64 border-r bg-gray-50">
				<div className="flex h-full flex-col">
					{/* Logo */}
					{/* <div className="border-b p-4">
						<Link to="/" className="flex items-center gap-2 text-xl font-bold">
							<Icon name="gift" className="h-6 w-6 text-teal-500" />
							<span>
								Wish <span className="text-teal-500">&</span> Well
							</span>
						</Link>
					</div> */}

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
			<main className="flex-1 overflow-auto">
				<Outlet />
			</main>
		</div>
	)
}
