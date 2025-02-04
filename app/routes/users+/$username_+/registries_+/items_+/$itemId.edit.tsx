import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { type Route } from './+types/$itemId.edit.ts'
import ItemEditor from './__item-editor'

export async function loader({ params, request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const item = await prisma.registryItem.findFirst({
		where: {
			id: params.itemId,
			registry: { ownerId: userId },
		},
	})
	if (!item) throw new Response('Not found', { status: 404 })
	return Response.json({ item })
}

export default function EditItem({ loaderData }: Route.ComponentProps) {
	const { item } = loaderData
	return (
		<div className="mx-auto max-w-3xl p-8">
			<h1 className="mb-8 text-2xl font-bold">Edit Item</h1>
			<ItemEditor item={item} />
		</div>
	)
}
