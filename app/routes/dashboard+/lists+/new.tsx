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

	const { registryName, childName, eventDate, eventTime, eventType } =
		submission.value

	try {
		// Use a transaction to ensure both operations succeed or fail together
		const result = await prisma.$transaction(async (tx) => {
			// Create the new list
			const list = await tx.list.create({
				data: {
					title: registryName,
					eventType,
					eventDate: new Date(eventDate + 'T00:00:00Z'),
					eventTime: eventTime || null,
					ownerId: userId,
					status: 'draft',
					planType: 'free',
				},
			})

			// Create the personal profile
			await tx.personalProfile.create({
				data: {
					name: childName,
					birthdate: new Date(eventDate + 'T00:00:00Z'),
					listId: list.id,
				},
			})

			return list
		})

		// If we get here, both operations succeeded
		return redirect(`/dashboard/lists/${result.id}`)
	} catch (error) {
		// Log the error for debugging
		console.error('Failed to create registry:', error)

		// Return a user-friendly error message
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
