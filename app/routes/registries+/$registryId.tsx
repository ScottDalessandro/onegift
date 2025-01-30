// app/routes/registries.$registryId.tsx
import { useEffect, useState } from 'react'
import {
	type LoaderFunctionArgs,
	useLoaderData,
	Link,
	Outlet,
} from 'react-router'

import { Button } from '#app/components/ui/button'
import { Input } from '#app/components/ui/input'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const registry = await prisma.registry.findFirst({
		where: {
			id: params.registryId,
			userId,
		},
		include: {
			items: true,
		},
	})

	if (!registry) {
		throw new Response('Not found', { status: 404 })
	}

	return { registry }
}

export default function RegistryDetail() {
	const { registry } = useLoaderData<typeof loader>()
	const [origin, setOrigin] = useState('')

	useEffect(() => {
		setOrigin(window.location.origin)
	}, [])

	return (
		<div className="mx-auto max-w-6xl p-8">
			<div className="mb-8">
				<Link to="/registries" className="text-blue-600 hover:underline">
					← Back to Registries
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-8 text-black md:grid-cols-3">
				{/* Sidebar */}
				<div className="rounded-lg bg-gray-50 p-6">
					<h1 className="mb-4 text-2xl font-bold">{registry.title}</h1>

					<div className="space-y-4">
						<div>
							<h3 className="font-semibold">Event Details</h3>
							<p>Date: {new Date(registry.eventDate).toLocaleDateString()}</p>
						</div>

						<div>
							<h3 className="font-semibold">Registry Status</h3>
							<p className="capitalize">{registry.status}</p>
							{registry.status === 'draft' && (
								<Button asChild className="mt-2">
									<Link to="activate">Activate Registry</Link>
								</Button>
							)}
						</div>

						<div>
							<h3 className="font-semibold">Registry Stats</h3>
							<p>Total Items: {registry.items ? registry.items.length : 0}</p>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="text-black md:col-span-2">
					<Outlet context={{ registry }} />
				</div>
			</div>

			<div className="mt-4">
				<h3 className="font-semibold">Share Registry</h3>
				<div className="mt-2 flex items-center gap-2">
					<Input
						readOnly
						value={origin ? `${origin}/r/${registry.id}` : ''}
						onClick={(e) => e.currentTarget.select()}
					/>
					<Button
						onClick={async () => {
							await navigator.clipboard.writeText(`${origin}/r/${registry.id}`)
						}}
					>
						Copy
					</Button>
				</div>
			</div>
		</div>
	)
}
