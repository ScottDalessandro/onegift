import {
	useForm,
	getFormProps,
	getInputProps,
	getTextareaProps,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'

import { Form } from 'react-router'

import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Button } from '#app/components/ui/button'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { Textarea } from '#app/components/ui/textarea.tsx'
import { formatDecimal } from '#app/utils/format.ts'
import { useUrlUnfurl } from '#app/utils/useUnfurlUrl.ts'
import { type Info } from './$itemId+/+types/edit.tsx'
import { type loader } from './$itemId+/_layout.tsx'
import { useState } from 'react'
import { Icon } from '#app/components/ui/icon.tsx'

const separateKey = <T extends { key?: string }>(props: T) => {
	const { key, ...rest } = props
	return { key, ...rest }
}

type ImageInputType = 'url' | 'file'

export const RegistryItemSchema = z.object({
	id: z.string().optional(),
	name: z
		.string()
		.min(1, 'Name is required')
		.max(100, 'Name must be less than 100 characters'),
	price: z.number().min(1.0, 'Price must be greater than 0'),
	url: z.string().optional(),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
	category: z.string().optional(),
	registryId: z.string().optional(),
})

export function ItemEditor({
	item,
	actionData,
}: {
	item?: Awaited<ReturnType<typeof loader>>['item']
	actionData?: Info['actionData']
}) {
	const [previewImage, setPreviewImage] = useState<string | null>(
		item?.imageUrl || null,
	)
	const [imageInputType, setImageInputType] = useState<ImageInputType>('url')

	const [form, fields] = useForm({
		id: 'registry-item-form',
		lastResult: actionData?.result,
		constraint: getZodConstraint(RegistryItemSchema),
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: RegistryItemSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			...item,
			price: item?.price ? formatDecimal(item.price) : '',
		},
	})

	const { handleUrlPaste, isUnfurling, error } = useUrlUnfurl({
		form,
		url: fields.url,
		name: fields.name,
		description: fields.description,
		price: fields.price,
		imageUrl: fields.imageUrl,
	})

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

					{error && <span className="text-red-500">{error}</span>}
					{fields.url.errors?.length && (
						<span className="text-red-500">{fields.url.errors}</span>
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
					<Label htmlFor="image">Item Image</Label>
					<div className="space-y-4">
						{previewImage && (
							<div className="relative h-32 w-32">
								<img
									src={previewImage}
									alt="Item preview"
									className="h-32 w-32 rounded-lg object-cover"
								/>
								<button
									type="button"
									className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
									onClick={() => {
										setPreviewImage(null)
										form.update({ name: 'imageUrl', value: '' })
									}}
								>
									<Icon name="cross-1" className="h-4 w-4" />
								</button>
							</div>
						)}
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
								<Input
									{...getInputProps(fields.imageUrl, { type: 'url' })}
									placeholder="https://example.com/image.jpg"
									onChange={(e) => {
										const url = e.target.value
										setPreviewImage(url)
										form.update({ name: 'imageUrl', value: url })
									}}
								/>
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
												setPreviewImage(result)
												form.update({ name: 'imageUrl', value: result })
											}
											reader.readAsDataURL(file)
										}
									}}
									className="file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
								/>
							)}
						</div>
					</div>
					{fields.imageUrl.errors?.length && (
						<span className="text-red-500">{fields.imageUrl.errors}</span>
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
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No registry with the id "{params.registryId}" exists</p>
				),
			}}
		/>
	)
}
