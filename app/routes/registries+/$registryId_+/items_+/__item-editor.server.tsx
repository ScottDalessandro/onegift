import { parseWithZod } from '@conform-to/zod'
import { parseFormData } from '@mjackson/form-data-parser'
import { type ActionFunctionArgs, data, redirect } from 'react-router'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { RegistryItemSchema } from './__item-editor'

export async function action({ request, params }: ActionFunctionArgs) {
	await requireUserId(request)
	const { registryId } = params
	const formData = await parseFormData(request)

	const submission = await parseWithZod(formData, {
		schema: RegistryItemSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const registryItem = await prisma.registryItem.findUnique({
				select: { id: true },
				where: { id: data.id, registryId: data.registryId },
			})

			if (!registryItem) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Item not found',
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
		id: itemId,
		name,
		price,
		url,
		description,
		imageUrl,
		category,
	} = submission.value

	const updatedRegistryItem = await prisma.registryItem.upsert({
		where: { id: itemId ?? '__new_item__' },
		select: {
			id: true,
			registry: { select: { id: true, owner: { select: { username: true } } } },
		},
		create: {
			registryId: registryId ?? '__new_item__',
			name,
			price,
			url,
			description,
			imageUrl,
			category,
		},
		update: {
			name,
			price,
			url,
			description,
			imageUrl,
			category,
		},
	})
	return redirect(
		`/registries/${updatedRegistryItem.registry.id}/items/${updatedRegistryItem.id}`,
	)
}
