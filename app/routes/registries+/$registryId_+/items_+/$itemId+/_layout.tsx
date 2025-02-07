import { type LoaderFunctionArgs, Outlet } from 'react-router'

import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/index.tsx'

type LoaderData = {
	item: Awaited<ReturnType<typeof loader>>['item']
}

export async function loader({ request, params }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const item = await prisma.registryItem.findFirst({
		where: {
			id: params.itemId,
			registry: {
				id: params.registryId,
				ownerId: userId,
			},
		},
		include: {
			registry: {
				select: {
					id: true,
					title: true,
					owner: {
						select: {
							username: true,
						},
					},
				},
			},
		},
	})

	if (!item) {
		throw new Response('Not found', { status: 404 })
	}
	return { item }
}

export default function ItemRoute({ loaderData }: { loaderData: LoaderData }) {
	const { item } = loaderData
	return (
		<div className="mx-auto max-w-3xl p-8">
			<Outlet context={{ item }} />
		</div>
	)
}
