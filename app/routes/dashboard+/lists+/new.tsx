import { redirect } from 'react-router'
import { RegistryForm } from '#app/components/registry/RegistryForm'
import { requireUserId } from '#app/utils/auth.server'
import { type Route } from './+types/new'
import { RegistryFormSchema } from '#app/components/registry/RegistryForm'
import { parseWithZod } from '@conform-to/zod'
import { prisma } from '#app/utils/db.server'

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const submission = await parseWithZod(formData, {
		schema: RegistryFormSchema,
	})

	if (submission.status !== 'success') {
		return submission
	}

	const {
		title,
		description,
		contributionDate,
		listTypeId,
		eventName,
		eventDate,
		eventStartTime,
		eventEndTime,
		eventLocation,
		eventDescription,
		addEvent,
	} = submission.value

	try {
		const result = await prisma.$transaction(async (tx) => {
			let eventId = null
			if (addEvent) {
				const eventData: any = {
					name: eventName || '',
					startTime: eventStartTime || null,
					endTime: eventEndTime || null,
					location: eventLocation || null,
					description: eventDescription || null,
				}
				if (eventDate) {
					eventData.date = new Date(eventDate)
				}
				const event = await tx.event.create({
					data: eventData,
				})
				eventId = event.id
			}
			const list = await tx.list.create({
				data: {
					title,
					description: description || null,
					contributionDate: new Date(contributionDate),
					listTypeId,
					eventId,
					ownerId: userId,
				},
			})
			return list
		})
		return redirect(`/dashboard/lists/${result.id}`)
	} catch (error) {
		console.error('Failed to create registry:', error)
		return Response.json(
			{
				error: 'Failed to create registry. Please try again.',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}

export default function NewRegistry() {
	return <RegistryForm />
}
