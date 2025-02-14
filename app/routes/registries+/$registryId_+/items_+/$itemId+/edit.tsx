import { invariantResponse } from '@epic-web/invariant'
import { type LoaderFunctionArgs, useOutletContext } from 'react-router'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { ItemEditor } from '../__item-editor.tsx'

export { action } from '../__item-editor.server.tsx'

export async function loader({ params }: LoaderFunctionArgs) {
	const { itemId } = params
	const item = await prisma.registryItem.findUnique({
		where: { id: itemId },
		include: {
			registry: {
				select: {
					id: true,
					title: true,
					owner: { select: { username: true } },
				},
			},
		},
	})
	invariantResponse(item, 'Not found', { status: 404 })
	return { item }
}

export default function ItemEditRoute() {
	const { item } = useOutletContext<{
		item: Awaited<ReturnType<typeof loader>>['item']
	}>()
	return (
		<div>
			<h1 className="mb-8 text-2xl font-bold">Edit Item</h1>
			<ItemEditor item={item} />
		</div>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No Item with the id "{params.itemId}" exists</p>
				),
			}}
		/>
	)
}
