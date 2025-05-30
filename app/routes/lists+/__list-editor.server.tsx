import { parseWithZod } from '@conform-to/zod'
import { parseFormData } from '@mjackson/form-data-parser' // will support file uploads in the future
import { type ActionFunctionArgs, data, redirect } from 'react-router'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { ListSchema } from './__list-editor'

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await parseFormData(request)
	const submission = await parseWithZod(formData, {
		schema: ListSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const list = await prisma.list.findUnique({
				select: { id: true },
				where: { id: data.id, ownerId: userId },
			})

			if (!list) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'List not found',
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
		id: listId,
		title,
		listTypeId,
		contributionDate,
		description,
	} = submission.value

	const updatedList = await prisma.list.upsert({
		select: { id: true, owner: { select: { username: true } } },
		where: { id: listId ?? '__new_list__' },
		create: {
			ownerId: userId,
			title,
			listTypeId,
			contributionDate,
			description,
		},
		update: {
			title,
			listTypeId,
			contributionDate,
			description,
		},
	})

	return redirect(`/lists/${updatedList.id}`)
}
