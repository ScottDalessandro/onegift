import {
	useForm,
	getFormProps,
	getInputProps,
	getTextareaProps,
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

const ItemEditorForm = () => {
	const data = useActionData<typeof action>()
	const { listId } = useParams()
	const [imageCount, setImageCount] = useState(1)

	const [form, fields] = useForm<ListItemFormData>({
		id: 'list-item-form',
		lastResult: data?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ListItemSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			url: '',
			name: '',
			price: '',
			listId,
			images: [{}],
		},
	})

	const addImage = () => {
		if (imageCount < 5) {
			setImageCount((prev) => prev + 1)
		}
	}

	const removeImage = (index: number) => {
		setImageCount((prev) => prev - 1)
	}

	return (
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
					{Array.from({ length: imageCount }).map((_, index) => (
						<div key={index} className="flex items-center gap-4">
							<Input
								type="file"
								name={`images[${index}].file`}
								accept="image/*"
							/>
							<button
								type="button"
								onClick={() => removeImage(index)}
								className="text-red-500"
							>
								Remove
							</button>
						</div>
					))}
					{imageCount < 5 && (
						<Button type="button" onClick={addImage} className="text-blue-500">
							Add Another Image
						</Button>
					)}
					{fields.images.errors?.length && (
						<span className="text-red-500">{fields.images.errors}</span>
					)}
				</div>
			</div>
			<Button type="submit">Submit</Button>
		</Form>
	)
}

export function ItemEditor({
	item,
	actionData,
}: {
	item?: Info['loaderData']['item']
	actionData?: Info['actionData']
}) {
	return <ItemEditorForm />
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
