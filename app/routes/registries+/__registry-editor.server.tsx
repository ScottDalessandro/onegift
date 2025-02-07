import { parseWithZod } from '@conform-to/zod'
import { parseFormData } from '@mjackson/form-data-parser' // will support file uploads in the future
import { type ActionFunctionArgs, data, redirect } from 'react-router'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { RegistrySchema } from './__registry-editor'

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await parseFormData(request)

	const submission = await parseWithZod(formData, {
		schema: RegistrySchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const registry = await prisma.registry.findUnique({
				select: { id: true },
				where: { id: data.id, ownerId: userId },
			})

			if (!registry) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Registry not found',
				})
			}
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const {
		id: registryId,
		title,
		eventType,
		eventDate,
		description,
	} = submission.value

	const updatedRegistry = await prisma.registry.upsert({
		select: { id: true, owner: { select: { username: true } } },
		where: { id: registryId ?? '__new_registry__' },
		create: {
			ownerId: userId,
			title,
			eventType,
			eventDate,
			description,
		},
		update: {
			title,
			eventType,
			eventDate,
			description,
		},
	})

	return redirect(`/registries/${updatedRegistry.id}`)
}
