import {
	useForm,
	getFormProps,
	getInputProps,
	getTextareaProps,
	getFieldsetProps,
	FormProvider,
	type FieldMetadata,
} from '@conform-to/react'

import { parseWithZod } from '@conform-to/zod'

import { useActionData, useParams, Form } from 'react-router'

import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon.tsx'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { Textarea } from '#app/components/ui/textarea.tsx'
import { formatDecimal } from '#app/utils/format.ts'
import { useUrlUnfurl } from '#app/utils/useUnfurlUrl.ts'
import { type Info } from './$itemId+/+types/edit.tsx'
import { type loader } from './$itemId+/_layout.tsx'
import { cn, getItemImgSrc, useIsPending } from '#app/utils/misc.tsx'
import { ErrorList } from '#app/components/forms.tsx'
import { Img } from 'openimg/react'
import { action } from './__item-editor.server.tsx'
import { useState } from 'react'

type ImageInputType = 'url' | 'file'

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

const ImageFieldsetSchema = z.object({
	id: z.string().optional(),
	file: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			return !file || file.size <= MAX_UPLOAD_SIZE
		}, 'File size must be less than 3MB'),
	altText: z.string().optional(),
	url: z.string().optional(),
	objectKey: z.string().optional(),
})

export type ImageFieldset = z.infer<typeof ImageFieldsetSchema>

export const ListItemSchema = z.object({
	id: z.string().optional(),
	name: z
		.string()
		.min(1, 'Name is required')
		.max(100, 'Name must be less than 100 characters'),
	price: z.string().min(1.0, 'Price must be greater than 0'),
	url: z.string().optional(),
	description: z.string().optional(),
	images: z
		.array(ImageFieldsetSchema, {
			message: 'Images must be less than 5',
		})
		.max(5)
		.optional(),
	category: z.string().optional(),
	listId: z.string().optional(),
})

type ListItemFormData = z.infer<typeof ListItemSchema>

function ImageChooser({
	meta,
	objectKey,
}: {
	meta: FieldMetadata<ImageFieldset>
	objectKey: string | undefined
}) {
	const fields = meta.getFieldset()
	const existingImage = Boolean(fields.id.initialValue)
	const [previewImage, setPreviewImage] = useState<string | null>(
		objectKey ? getItemImgSrc(objectKey) : null,
	)
	const [altText, setAltText] = useState(fields.altText.initialValue ?? '')

	return (
		<fieldset {...getFieldsetProps(meta)}>
			<div className="flex gap-3">
				<div className="w-32">
					<div className="relative h-32 w-32">
						<label
							htmlFor={fields.file.id}
							className={cn('group absolute h-32 w-32 rounded-lg', {
								'bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100':
									!previewImage,
								'cursor-pointer focus-within:ring-2': !existingImage,
							})}
						>
							{previewImage ? (
								<div className="relative">
									{existingImage ? (
										<Img
											src={previewImage}
											alt={altText ?? ''}
											className="h-32 w-32 rounded-lg object-cover"
											width={512}
											height={512}
										/>
									) : (
										<img
											src={previewImage}
											alt={altText ?? ''}
											className="h-32 w-32 rounded-lg object-cover"
										/>
									)}
									{existingImage ? null : (
										<div className="pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md">
											new
										</div>
									)}
								</div>
							) : (
								<div className="flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground">
									<Icon name="plus" />
								</div>
							)}
							{existingImage ? (
								<input {...getInputProps(fields.id, { type: 'hidden' })} />
							) : null}
							<input
								aria-label="Image"
								className="absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0"
								onChange={(event) => {
									const file = event.target.files?.[0]

									if (file) {
										const reader = new FileReader()
										reader.onloadend = () => {
											setPreviewImage(reader.result as string)
										}
										reader.readAsDataURL(file)
									} else {
										setPreviewImage(null)
									}
								}}
								accept="image/*"
								{...getInputProps(fields.file, { type: 'file' })}
							/>
						</label>
					</div>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList id={fields.file.errorId} errors={fields.file.errors} />
					</div>
				</div>
				<div className="flex-1">
					<Label htmlFor={fields.altText.id}>Alt Text</Label>
					<Textarea
						onChange={(e) => setAltText(e.currentTarget.value)}
						{...getTextareaProps(fields.altText)}
					/>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList
							id={fields.altText.errorId}
							errors={fields.altText.errors}
						/>
					</div>
				</div>
			</div>
			<div className="min-h-[32px] px-4 pb-3 pt-1">
				<ErrorList id={meta.errorId} errors={meta.errors} />
			</div>
		</fieldset>
	)
}

const ItemEditorForm = ({ item }: { item?: Info['loaderData']['item'] }) => {
	const data = useActionData<typeof action>()
	const { listId } = useParams()
	const isPending = useIsPending()

	const [form, fields] = useForm<ListItemFormData>({
		id: 'list-item-form',
		lastResult: data?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ListItemSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			id: item?.id,
			url: item?.url ?? '',
			name: item?.name ?? '',
			price: item?.price ? formatDecimal(item.price) : '',
			listId,
			images: item?.images?.length
				? item.images.map((image) => ({
						id: image.id,
						altText: image.altText ?? '',
						objectKey: image.objectKey,
					}))
				: [{}],
		},
	})

	const imageList = fields.images.getFieldList()

	return (
		<FormProvider context={form.context}>
			<Form {...getFormProps(form)} method="post" encType="multipart/form-data">
				<div className="relative">
					<Label htmlFor="url">
						URL
						<Input
							{...getInputProps(fields.url, { type: 'url' })}
							aria-describedby="url-error"
						/>
					</Label>
					{fields.url.errors?.length && (
						<span id="url-error" className="text-red-500">
							{fields.url.errors}
						</span>
					)}
					<Label htmlFor="name">
						Name
						<Input {...getInputProps(fields.name, { type: 'text' })} />
					</Label>
					{fields.name.errors?.length && (
						<span className="text-red-500">{fields.name.errors}</span>
					)}
					<Label htmlFor="price">
						Price
						<Input
							{...getInputProps(fields.price, { type: 'number', step: '0.01' })}
						/>
					</Label>
					{fields.price.errors?.length && (
						<span className="text-red-500">{fields.price.errors}</span>
					)}
					<div className="space-y-4">
						<Label>Images</Label>
						<ul className="flex flex-col gap-4">
							{imageList.map((imageMeta, index) => {
								const image = item?.images?.[index]
								return (
									<li
										key={imageMeta.key}
										className="relative border-b-2 border-muted-foreground"
									>
										<button
											className="absolute right-0 top-0 text-foreground-destructive"
											{...form.remove.getButtonProps({
												name: fields.images.name,
												index,
											})}
										>
											<span aria-hidden>
												<Icon name="cross-1" />
											</span>{' '}
											<span className="sr-only">Remove image {index + 1}</span>
										</button>
										<ImageChooser
											meta={imageMeta}
											objectKey={image?.objectKey ?? undefined}
										/>
									</li>
								)
							})}
						</ul>
						<Button
							className="mt-3"
							{...form.insert.getButtonProps({ name: fields.images.name })}
						>
							<span aria-hidden>
								<Icon name="plus">Image</Icon>
							</span>{' '}
							<span className="sr-only">Add image</span>
						</Button>
					</div>
				</div>
				<Button type="submit" disabled={isPending}>
					Submit
				</Button>
			</Form>
		</FormProvider>
	)
}

export function ItemEditor({
	item,
	actionData,
}: {
	item?: Info['loaderData']['item']
	actionData?: Info['actionData']
}) {
	return <ItemEditorForm item={item} />
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
