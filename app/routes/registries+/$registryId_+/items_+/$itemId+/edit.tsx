import { useOutletContext } from 'react-router'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { ItemEditor } from '../__item-editor.tsx'
import { type loader } from './_layout.tsx'

export { action } from '../__item-editor.server.tsx'

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
