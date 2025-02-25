// app/routes/lists.$listId.tsx
import { useEffect, useState } from 'react'
import { type LoaderFunctionArgs, Link, Outlet } from 'react-router'

import { Button } from '#app/components/ui/button'
import { Input } from '#app/components/ui/input'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { type Route } from './+types/index.tsx'

type LoaderData = {
	list: Awaited<ReturnType<typeof loader>>['list']
}

export async function loader({ request, params }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const list = await prisma.list.findFirst({
		where: {
			id: params.listId,
			ownerId: userId,
		},
		include: {
			items: true,
		},
	})

	if (!list) {
		throw new Response('Not found', { status: 404 })
	}

	return { list }
}

export default function ListLayout({ loaderData }: { loaderData: LoaderData }) {
	const { list } = loaderData
	const [origin, setOrigin] = useState('')

	useEffect(() => {
		setOrigin(window.location.origin)
	}, [])

	return (
		<div className="mx-auto max-w-6xl p-8">
			<div className="mb-8">
				<Link to="/lists" className="text-blue-600 hover:underline">
					← Back to Lists
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-8 text-black md:grid-cols-3">
				{/* Sidebar */}
				<div className="rounded-lg bg-gray-50 p-6">
					<h1 className="mb-4 text-2xl font-bold">{list.title}</h1>

					<div className="space-y-4">
						<div>
							<h3 className="font-semibold">Event Details</h3>
							<p>Date: {new Date(list.eventDate).toLocaleDateString()}</p>
						</div>

						<div>
							<h3 className="font-semibold">List Status</h3>
							<p className="capitalize">{list.status}</p>
							{list.status === 'draft' && (
								<Button asChild className="mt-2 px-3 py-1">
									<Link to="activate">Activate List</Link>
								</Button>
							)}
						</div>

						<div>
							<h3 className="font-semibold">List Stats</h3>
							<p>Total Items: {list.items ? list.items.length : 0}</p>
						</div>

						<div>
							<h3 className="font-semibold">Edit List</h3>
							<Button asChild className="mt-2 px-3 py-1">
								<Link to={`/lists/${list.id}/edit`}>Edit List</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="text-black md:col-span-2">
					<Outlet context={{ list }} />
				</div>
			</div>

			<div className="mt-4">
				<h3 className="font-semibold">Share </h3>
				<div className="mt-2 flex items-center gap-2">
					<Input
						readOnly
						value={origin ? `${origin}/r/${list.id}` : ''}
						onClick={(e) => e.currentTarget.select()}
					/>
					<Button
						onClick={async () => {
							await navigator.clipboard.writeText(`${origin}/r/${list.id}`)
						}}
					>
						Copy
					</Button>
				</div>
			</div>
		</div>
	)
}
