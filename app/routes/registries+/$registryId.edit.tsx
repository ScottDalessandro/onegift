import { invariantResponse } from '@epic-web/invariant'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/$registryId.edit.ts'
import { RegistryEditor } from './__registry-editor.tsx'

export { action } from './__registry-editor.server.tsx'

export async function loader({ params }: Route.LoaderArgs) {
	const registry = await prisma.registry.findFirst({
		select: {
			id: true,
			title: true,
			eventType: true,
			eventDate: true,
			location: true,
			description: true,
		},
		where: {
			id: params.registryId,
		},
	})
	invariantResponse(registry, 'Not found', { status: 404 })
	return { registry }
}

export default function RegistryEdit({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	return (
		<RegistryEditor registry={loaderData.registry} actionData={actionData} />
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No registry with the id "{params.registryId}" exists</p>
				),
			}}
		/>
	)
}
