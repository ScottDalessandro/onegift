import { parseWithZod } from '@conform-to/zod'
import { parseFormData } from '@mjackson/form-data-parser'
import { type ActionFunctionArgs, data, redirect } from 'react-router'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { ListItemSchema } from './__item-editor'

export async function action({ request, params }: ActionFunctionArgs) {
	await requireUserId(request)
	const { listId } = params
	const formData = await parseFormData(request)

	const submission = await parseWithZod(formData, {
		schema: ListItemSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const listItem = await prisma.listItem.findUnique({
				select: { id: true },
				where: { id: data.id, listId: data.listId },
			})

			if (!listItem) {
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
		images,
		category,
	} = submission.value

	const updatedListItem = await prisma.listItem.upsert({
		where: { id: itemId ?? '__new_item__' },
		select: {
			id: true,
			list: { select: { id: true, owner: { select: { username: true } } } },
		},
		create: {
			listId: listId ?? '__new_item__',
			name,
			price,
			url,
			description,
			category,
			images: {
				create:
					images?.map((image) => ({
						url: image.url,
						objectKey: image.objectKey,
						altText: image.altText,
					})) ?? [],
			},
		},
		update: {
			name,
			price,
			url,
			description,
			category,
			images: {
				deleteMany: {},
				create:
					images?.map((image) => ({
						url: image.url,
						objectKey: image.objectKey,
						altText: image.altText,
					})) ?? [],
			},
		},
	})
	return redirect(
		`/lists/${updatedListItem.list.id}/items/${updatedListItem.id}`,
	)
}
