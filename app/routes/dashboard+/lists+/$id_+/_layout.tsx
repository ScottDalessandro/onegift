import { Outlet, useParams, useLoaderData } from 'react-router'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'

export async function loader({ request, params }: any) {
	const userId = await requireUserId(request)
	const listId = params.id
	if (!listId) throw new Response('List ID is required', { status: 400 })
	const list = await prisma.list.findFirst({
		where: { id: listId, ownerId: userId },
		include: {
			items: true,
			event: true,
			listType: true,
		},
	})
	if (!list) throw new Response('List not found', { status: 404 })
	return { list }
}

export default function RegistryLayout() {
	const { id } = useParams()
	const { list } = useLoaderData() as any

	return (
		<div className="p-6">
			<h1 className="mb-4 text-2xl font-bold">{list?.name || 'Registry'}</h1>
			{/* Add navigation or tabs here if needed */}
			<Outlet />
		</div>
	)
}
