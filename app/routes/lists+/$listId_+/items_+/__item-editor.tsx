import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useState } from 'react'
import { Form, useParams, useFetcher } from 'react-router'
import type { LoaderFunctionArgs } from 'react-router'
import { z } from 'zod'
import {
	getFormProps,
	getInputProps,
	getTextareaProps,
} from '@conform-to/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon.tsx'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { Textarea } from '#app/components/ui/textarea'
import { formatDecimal } from '#app/utils/format.ts'
import { useUrlUnfurl } from '#app/utils/useUnfurlUrl'
import { type Info } from './$itemId+/+types/edit.tsx'
import { type loader } from './$itemId+/_layout.tsx'
import { StatusButton } from '#app/components/ui/status-button'

const separateKey = <T extends { key?: string }>(props: T) => {
	const { key, ...rest } = props
	return { key, ...rest }
}

type ImageInputType = 'url' | 'file'

export const ListItemSchema = z.object({
	id: z.string().optional(),
	listId: z.string(),
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	url: z.string().url('Must be a valid URL').optional(),
	price: z.coerce.number().min(0, 'Price must be positive'),
	category: z.string().optional(),
	images: z
		.array(
			z.object({
				url: z.string().url('Must be a valid URL'),
				objectKey: z.string().optional(),
				altText: z.string().optional(),
			}),
		)
		.optional(),
})

export type ListItemType = z.infer<typeof ListItemSchema>

interface ItemEditorProps {
	item?: ListItemType
	listId: string
	mode?: 'edit' | 'create'
}

export function ItemEditor({ item, listId, mode = 'create' }: ItemEditorProps) {
	const [images, setImages] = useState<
		Array<{ url: string; altText?: string }>
	>(item?.images || [])
	const [imageInputType, setImageInputType] = useState<ImageInputType>('url')
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null,
	)

	const [form, fields] = useForm({
		id: 'item-editor',
		constraint: getZodConstraint(ListItemSchema),
		defaultValue: item || {
			name: '',
			description: '',
			url: '',
			price: 0,
			images: [],
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ListItemSchema })
		},
	})

	const { handleUrlPaste, isUnfurling, previewImage } = useUrlUnfurl({
		form,
		url: fields.url,
		name: fields.name,
		description: fields.description,
		price: fields.price,
		images: fields.images,
	})

	const addImage = (url: string, altText?: string) => {
		const newImages = [...images, { url, altText }]
		setImages(newImages)
		form.update({ name: 'images', value: newImages })
	}

	const removeImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index)
		setImages(newImages)
		form.update({ name: 'images', value: newImages })
	}

	return (
		<div className="mx-auto max-w-3xl p-8">
			<h1 className="mb-8 text-2xl font-bold">
				{item ? 'Edit' : 'Add New'} Item
			</h1>

			<Form
				method="post"
				encType="multipart/form-data"
				className="space-y-6"
				{...getFormProps(form)}
			>
				<div>
					<Label htmlFor="url">Product URL</Label>
					<div className="relative">
						{(() => {
							const { key, ...rest } = separateKey(
								getInputProps(fields.url, {
									type: 'url',
								}),
							)
							return (
								<Input
									{...rest}
									key={key}
									placeholder="https://"
									onPaste={handleUrlPaste}
								/>
							)
						})()}
						{isUnfurling && (
							<div className="absolute right-3 top-1/2 -translate-y-1/2">
								<div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
							</div>
						)}
					</div>
					<div>
						<Label htmlFor="name">Item Name</Label>
						{(() => {
							const { key, ...rest } = separateKey(
								getInputProps(fields.name, { type: 'text' }),
							)
							return <Input key={key} {...rest} />
						})()}
						{fields.name.errors?.length && (
							<span id="name-error" className="text-red-500">
								{fields.name.errors}
							</span>
						)}
					</div>

					<div>
						<Label htmlFor="price">Price</Label>
						{(() => {
							const { key, ...rest } = separateKey(
								getInputProps(fields.price, {
									type: 'number',
									step: '1.00',
									min: '1.00',
								}),
							)
							return <Input {...rest} key={key} />
						})()}
						{fields.price.errors?.length && (
							<span className="text-red-500">{fields.price.errors}</span>
						)}
					</div>

					{previewImage && (
						<div className="mt-4">
							<img
								src={previewImage}
								alt="Preview"
								className="h-32 w-32 rounded-lg object-cover"
							/>
						</div>
					)}
				</div>

				<div>
					<Label htmlFor="description">Description</Label>
					{(() => {
						const { key, ...rest } = separateKey(
							getTextareaProps(fields.description),
						)
						return (
							<Textarea
								{...rest}
								key={key}
								className="w-full rounded border border-gray-300 px-3 py-2"
								rows={3}
							/>
						)
					})()}
					{fields.description.errors?.length && (
						<span className="text-red-500">{fields.description.errors}</span>
					)}
				</div>

				<div>
					<Label htmlFor="image">Item Images</Label>
					<div className="space-y-4">
						<div className="flex flex-wrap gap-4">
							{images.map((image, index) => (
								<div key={index} className="relative h-32 w-32">
									<img
										src={image.url}
										alt={image.altText || 'Item preview'}
										className="h-32 w-32 rounded-lg object-cover"
									/>
									<button
										type="button"
										className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
										onClick={() => removeImage(index)}
									>
										<Icon name="cross-1" className="h-4 w-4" />
									</button>
								</div>
							))}
						</div>
						<div className="mb-2 flex gap-4">
							<Button
								type="button"
								variant={imageInputType === 'url' ? 'default' : 'outline'}
								onClick={() => setImageInputType('url')}
								className="flex-1"
							>
								URL
							</Button>
							<Button
								type="button"
								variant={imageInputType === 'file' ? 'default' : 'outline'}
								onClick={() => setImageInputType('file')}
								className="flex-1"
							>
								Upload File
							</Button>
						</div>
						<div className="flex flex-col gap-2">
							{imageInputType === 'url' ? (
								<div className="space-y-2">
									<Input
										type="url"
										placeholder="https://example.com/image.jpg"
										onChange={(e) => {
											const url = e.target.value
											if (url) {
												addImage(url)
												e.target.value = ''
											}
										}}
									/>
								</div>
							) : (
								<Input
									type="file"
									accept="image/*"
									onChange={(e) => {
										const file = e.target.files?.[0]
										if (file) {
											const reader = new FileReader()
											reader.onloadend = () => {
												const result = reader.result as string
												addImage(result)
											}
											reader.readAsDataURL(file)
										}
									}}
									className="file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
								/>
							)}
						</div>
					</div>
					{fields.images?.errors?.length && (
						<span className="text-red-500">{fields.images.errors}</span>
					)}
				</div>

				<div className="flex gap-4">
					<Button type="submit">{item ? 'Update' : 'Add'} Item</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => window.history.back()}
					>
						Cancel
					</Button>
				</div>
			</Form>
		</div>
	)
}

export function ErrorBoundary() {
	const params = useParams<{ listId: string }>()
	return (
		<div>
			<div className="container mx-auto flex h-full w-full flex-col justify-center pb-32 pt-20">
				<div className="text-center">
					<p className="text-body-lg">Item not found</p>
				</div>
			</div>
		</div>
	)
}
