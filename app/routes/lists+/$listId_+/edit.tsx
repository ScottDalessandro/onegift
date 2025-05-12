import { invariantResponse } from '@epic-web/invariant'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { ListEditor } from '../__list-editor.tsx'
import { type Route } from './+types/edit.ts'

export { action } from '../__list-editor.server.tsx'

export async function loader({ params }: Route.LoaderArgs) {
	const [list, listTypes] = await Promise.all([
		prisma.list.findFirst({
			select: {
				id: true,
				title: true,
				description: true,
				dueDate: true,
				listTypeId: true,
				event: {
					select: {
						id: true,
						name: true,
						type: true,
						date: true,
						description: true,
					},
				},
			},
			where: {
				id: params.listId,
			},
		}),
		prisma.listType.findMany({
			select: {
				id: true,
				name: true,
			},
		}),
	])

	invariantResponse(list, 'Not found', { status: 404 })
	return { list, listTypes }
}

export default function ListEdit({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	return (
		<ListEditor
			list={loaderData.list}
			actionData={actionData}
			listTypes={loaderData.listTypes}
		/>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ error }) => (
					<p>No list with the id "{error?.data?.listId}" exists</p>
				),
			}}
		/>
	)
}
