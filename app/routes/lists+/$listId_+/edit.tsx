import { invariantResponse } from '@epic-web/invariant'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { ListEditor } from '../__list-editor.tsx'
import { type Route } from './+types/edit.ts'

export { action } from '../__list-editor.server.tsx'

export async function loader({ params }: Route.LoaderArgs) {
	const list = await prisma.list.findFirst({
		select: {
			id: true,
			title: true,
			eventType: true,
			eventDate: true,
			description: true,
		},
		where: {
			id: params.listId,
		},
	})
	invariantResponse(list, 'Not found', { status: 404 })
	return { list }
}

export default function ListEdit({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	return <ListEditor list={loaderData.list} actionData={actionData} />
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No list with the id "{params.listId}" exists</p>
				),
			}}
		/>
	)
}
