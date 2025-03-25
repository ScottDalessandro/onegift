import { parseWithZod } from '@conform-to/zod'
import { parseFormData } from '@mjackson/form-data-parser'
import { createId as cuid } from '@paralleldrive/cuid2'
import { type ActionFunctionArgs, data, redirect } from 'react-router'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { uploadListItemImage } from '#app/utils/storage.server.ts'
import {
	type ImageFieldset,
	ListItemSchema,
	MAX_UPLOAD_SIZE,
} from './__item-editor'

function imageHasFile(
	image: ImageFieldset,
): image is ImageFieldset & { file: NonNullable<ImageFieldset['file']> } {
	return Boolean(image.file?.size && image.file?.size > 0)
}

function imageHasId(
	image: ImageFieldset,
): image is ImageFieldset & { id: string } {
	return Boolean(image.id)
}

export async function action({ request, params }: ActionFunctionArgs) {
	await requireUserId(request)
	const { listId } = params

	const formData = await parseFormData(request, {
		maxFileSize: MAX_UPLOAD_SIZE,
	})
	console.log('Unvalidated fields:', formData)

	// Convert the form data to a proper object with File instances
	const processedFormData = new FormData()
	for (const [key, value] of formData.entries()) {
		if (key.startsWith('images[')) {
			// Handle file upload
			const file = value as File
			processedFormData.append(key, file)
		} else {
			processedFormData.append(key, value)
		}
	}

	const submission = await parseWithZod(processedFormData, {
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
		}).transform(async ({ images = [{}], ...data }) => {
			const listItemId = data.id ?? cuid()

			console.log('in transform, is images there?', data)
			return {
				...data,
				id: listItemId,
				imageUpdates: await Promise.all(
					images.filter(imageHasId).map(async (i) => {
						if (imageHasFile(i)) {
							return {
								id: i.id,
								altText: i.altText,
								objectKey: await uploadListItemImage(
									listId as string,
									listItemId,
									i.file,
								),
							}
						} else {
							return {
								id: i.id,
							}
						}
					}),
				),
				newImages: await Promise.all(
					images
						.filter(imageHasFile)
						.filter((i) => !i.id)
						.map(async (image) => {
							console.log('Uploading new image:', {
								listId,
								listItemId,
								fileSize: image.file.size,
								fileType: image.file.type,
							})
							const objectKey = await uploadListItemImage(
								listId as string,
								listItemId,
								image.file,
							)
							console.log('Image uploaded successfully:', { objectKey })
							return {
								altText: image.altText,
								objectKey,
							}
						}),
				),
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
		imageUpdates = [],
		newImages = [],
		category,
	} = submission.value

	const updatedListItem = await prisma.listItem.upsert({
		select: {
			id: true,
			list: { select: { id: true, owner: { select: { username: true } } } },
		},
		where: { id: itemId },
		create: {
			listId: listId as string,
			name,
			price,
			url,
			description,
			images: { create: newImages },
			category,
		},
		update: {
			name,
			price,
			url,
			description,
			images: {
				deleteMany: { id: { notIn: imageUpdates.map((i) => i.id) } },
				updateMany: imageUpdates.map((updates) => ({
					where: { id: updates.id },
					data: {
						...updates,
						objectKey: updates.objectKey ? cuid() : updates.id,
					},
				})),
				create: newImages,
			},
			category,
		},
	})
	console.log('Database update result:', {
		itemId,
		newImages,
		imageUpdates,
		updatedListItem,
	})

	return redirect(
		`/lists/${updatedListItem.list.id}/items/${updatedListItem.id}`,
	)
}
