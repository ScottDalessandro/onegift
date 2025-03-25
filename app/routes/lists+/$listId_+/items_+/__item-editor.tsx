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
		<fieldset {...getFieldsetProps(meta)} className="space-y-4">
			<div className="flex flex-col gap-4">
				<div className="w-full">
					<div className="relative aspect-square w-full overflow-hidden rounded-lg bg-accent/5">
						<label
							htmlFor={fields.file.id}
							className={cn('group absolute inset-0', {
								'bg-accent/40 opacity-90 transition-opacity focus-within:opacity-100 hover:opacity-100':
									!previewImage,
								'cursor-pointer focus-within:ring-2 focus-within:ring-accent':
									!existingImage,
							})}
						>
							{previewImage ? (
								<div className="relative h-full">
									{existingImage ? (
										<Img
											src={previewImage}
											alt={altText ?? ''}
											className="h-full w-full object-cover"
											width={512}
											height={512}
										/>
									) : (
										<img
											src={previewImage}
											alt={altText ?? ''}
											className="h-full w-full object-cover"
										/>
									)}
									{!existingImage && (
										<div className="pointer-events-none absolute right-2 top-2 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm dark:bg-background/80">
											new
										</div>
									)}
								</div>
							) : (
								<div className="flex h-full w-full items-center justify-center text-muted-foreground">
									<div className="text-center">
										<Icon name="camera" className="mx-auto h-8 w-8" />
										<p className="mt-2 text-sm">Click to upload image</p>
									</div>
								</div>
							)}
							{existingImage ? (
								<input {...getInputProps(fields.id, { type: 'hidden' })} />
							) : null}
							<input
								aria-label="Image"
								className="absolute inset-0 z-0 cursor-pointer opacity-0"
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
					<div className="min-h-[32px] px-1 pt-1">
						<ErrorList id={fields.file.errorId} errors={fields.file.errors} />
					</div>
				</div>
				<div>
					<Label
						htmlFor={fields.altText.id}
						className="text-sm text-foreground"
					>
						Alt Text
					</Label>
					<Textarea
						onChange={(e) => setAltText(e.currentTarget.value)}
						{...getTextareaProps(fields.altText)}
						className="mt-1.5 resize-none bg-background text-foreground placeholder:text-muted-foreground"
						rows={2}
						placeholder="Describe the image"
					/>
					<div className="min-h-[32px] px-1 pt-1">
						<ErrorList
							id={fields.altText.errorId}
							errors={fields.altText.errors}
						/>
					</div>
				</div>
			</div>
			<div className="min-h-[32px] px-1">
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
		<div className="space-y-8">
			<h1 className="text-2xl font-semibold tracking-tight text-foreground">
				Edit Item
			</h1>
			<FormProvider context={form.context}>
				<Form
					{...getFormProps(form)}
					method="post"
					encType="multipart/form-data"
					className="space-y-8"
				>
					<div className="rounded-lg border border-border bg-card p-6 shadow-sm">
						<div className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="url" className="text-base text-foreground">
									URL
								</Label>
								<Input
									{...getInputProps(fields.url, { type: 'url' })}
									aria-describedby="url-error"
									className="max-w-xl bg-background text-foreground placeholder:text-muted-foreground"
									placeholder="https://example.com/item"
								/>
								{fields.url.errors?.length && (
									<p id="url-error" className="text-sm text-destructive">
										{fields.url.errors}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="name" className="text-base text-foreground">
									Name
								</Label>
								<Input
									{...getInputProps(fields.name, { type: 'text' })}
									className="max-w-xl bg-background text-foreground placeholder:text-muted-foreground"
									placeholder="Item name"
								/>
								{fields.name.errors?.length && (
									<p className="text-sm text-destructive">
										{fields.name.errors}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="price" className="text-base text-foreground">
									Price
								</Label>
								<div className="relative max-w-[200px]">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
										$
									</span>
									<Input
										{...getInputProps(fields.price, {
											type: 'number',
											step: '0.01',
										})}
										className="bg-background pl-7 text-foreground placeholder:text-muted-foreground"
										placeholder="0.00"
									/>
								</div>
								{fields.price.errors?.length && (
									<p className="text-sm text-destructive">
										{fields.price.errors}
									</p>
								)}
							</div>
						</div>
					</div>

					<div className="rounded-lg border border-border bg-card p-6 shadow-sm">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label className="text-lg font-medium text-foreground">
									Images
								</Label>
								<Button
									variant="outline"
									size="sm"
									className="h-8 bg-background hover:bg-accent"
									{...form.insert.getButtonProps({ name: fields.images.name })}
								>
									<Icon name="plus" className="mr-1 h-4 w-4" />
									Add Image
								</Button>
							</div>

							<ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
								{imageList.map((imageMeta, index) => {
									const image = item?.images?.[index]
									return (
										<li
											key={imageMeta.key}
											className="relative rounded-lg border border-border bg-background/50 p-4"
										>
											<button
												className="absolute right-2 top-2 rounded-full bg-destructive/10 p-1 text-destructive hover:bg-destructive/20"
												{...form.remove.getButtonProps({
													name: fields.images.name,
													index,
												})}
											>
												<span aria-hidden>
													<Icon name="cross-1" className="h-4 w-4" />
												</span>
												<span className="sr-only">
													Remove image {index + 1}
												</span>
											</button>
											<ImageChooser
												meta={imageMeta}
												objectKey={image?.objectKey ?? undefined}
											/>
										</li>
									)
								})}
							</ul>
						</div>
					</div>

					<div className="flex justify-end space-x-4">
						<Button
							variant="outline"
							type="reset"
							disabled={isPending}
							className="bg-background hover:bg-accent"
						>
							Reset
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				</Form>
			</FormProvider>
		</div>
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
