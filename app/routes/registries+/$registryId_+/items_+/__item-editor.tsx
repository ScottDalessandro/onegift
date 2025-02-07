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
import { formatDecimal } from '#app/utils/format.ts'
import { type Info } from '../+types/index.tsx'

export const RegistryItemSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, 'Name is required'),
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
	item?: Info['loaderData']['item']
	actionData?: Info['actionData']
}) {
	const [form, fields] = useForm({
		id: 'registry-item-form',
		lastResult: actionData,
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
					<Label htmlFor="name">Item Name</Label>
					<Input {...getInputProps(fields.name, { type: 'text' })} />
					{fields.name.errors?.length && (
						<span id="name-error" className="text-red-500">
							{fields.name.errors}
						</span>
					)}
				</div>

				<div>
					<Label htmlFor="price">Price</Label>
					<Input
						{...getInputProps(fields.price, {
							type: 'number',
							step: '1.00',
							min: '1.00',
						})}
					/>
					{fields.price.errors?.length && (
						<span className="text-red-500">{fields.price.errors}</span>
					)}
				</div>

				<div>
					<Label htmlFor="url">Product URL</Label>
					<Input
						{...getInputProps(fields.url, {
							type: 'url',
						})}
						placeholder="https://"
					/>
					{fields.url.errors?.length && (
						<span className="text-red-500">{fields.url.errors}</span>
					)}
				</div>

				<div>
					<Label htmlFor="description">Description</Label>
					<textarea
						{...getTextareaProps(fields.description)}
						className="w-full rounded border border-gray-300 px-3 py-2"
						rows={3}
					/>
					{fields.description.errors?.length && (
						<span className="text-red-500">{fields.description.errors}</span>
					)}
				</div>

				<div>
					<Label htmlFor="image">Item Image</Label>
					<Input
						{...getInputProps(fields.imageUrl, {
							type: 'file',
							accept: 'image/*',
						})}
						className="file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
					/>
					{fields.imageUrl.errors?.length && (
						<span className="text-red-500">{fields.imageUrl.errors}</span>
					)}
				</div>

				<div className="flex gap-4">
					<Button type="submit">{item ? 'Update' : 'Add'} Item</Button>
					{/* <Button
						type="button"
						variant="outline"
						onClick={() => window.history.back()}
					>
						Cancel
					</Button> */}
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
