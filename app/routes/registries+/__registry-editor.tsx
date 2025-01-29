import {
	getFormProps,
	getInputProps,
	getSelectProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { parseWithZod, getZodConstraint } from '@conform-to/zod'
import { Form } from 'react-router'
import { z } from 'zod'
import { Button } from '#app/components/ui/button.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Label } from '#app/components/ui/label.tsx'
import { type Info } from './+types/$registryId.edit.ts'

export const RegistrySchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1, 'Title is required'),
	eventType: z.enum(['birthday', 'wedding', 'baby-shower', 'other'], {
		errorMap: () => ({ message: 'Please select an event type' }),
	}),
	eventDate: z
		.string()
		.min(1, 'Event date is required')
		.refine((str) => !isNaN(Date.parse(str)), {
			message: 'Invalid date format',
		})
		.transform((str) => {
			const date = new Date(str)
			// Remove time component for consistency
			return new Date(date.getFullYear(), date.getMonth(), date.getDate())
		}),
	location: z.string().min(1, 'Location is required'),
	description: z.string().optional(),
})

export function RegistryEditor({
	registry,
	actionData,
}: {
	registry?: Info['loaderData']['registry']
	actionData?: Info['actionData']
}) {
	const [form, fields] = useForm({
		id: 'registry-form',
		lastResult: actionData?.result,
		constraint: getZodConstraint(RegistrySchema),
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: RegistrySchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			...registry,
			eventDate: registry?.eventDate
				? new Date(registry.eventDate).toISOString().split('T')[0]
				: undefined,
		},
	})

	return (
		<div className="mx-auto max-w-3xl p-8">
			<h1 className="mb-8 text-2xl font-bold">
				{registry ? 'Edit' : 'Create New'} Registry
			</h1>

			<Form method="post" className="space-y-6" {...getFormProps(form)}>
				<div>
					<Label htmlFor={fields.title.id}>Registry Title</Label>

					<Input
						{...getInputProps(fields.title, {
							type: 'text',
						})}
						placeholder="Please enter a title"
					/>
					{fields.title.errors?.length && (
						<span className="text-red-500">{fields.title.errors}</span>
					)}
				</div>

				<div>
					<Label htmlFor={fields.eventType.id}>Event Type</Label>
					<select
						{...getSelectProps(fields.eventType)}
						className="w-full rounded border border-gray-300 px-3 py-2 text-black"
					>
						<option value="">Select event type...</option>
						<option value="birthday">Birthday</option>
						<option value="wedding">Wedding</option>
						<option value="baby-shower">Baby Shower</option>
						<option value="other">Other</option>
					</select>
					{fields.eventType.errors?.length && (
						<span className="text-red-500">{fields.eventType.errors}</span>
					)}
				</div>

				<div>
					<Label htmlFor={fields.eventDate.id}>Event Date</Label>
					<Input
						{...getInputProps(fields.eventDate, { type: 'date' })}
						// placeholder={new Date().toISOString().split('T')[0]}
					/>
					{fields.eventDate.errors?.length && (
						<span className="text-red-500">{fields.eventDate.errors}</span>
					)}
				</div>

				<div>
					<Label htmlFor={fields.location.id}>Location</Label>
					<Input
						{...getInputProps(fields.location, { type: 'text' })}
						placeholder="Please enter the address"
					/>
					{fields.location.errors?.length && (
						<span className="text-red-500">{fields.location.errors}</span>
					)}
				</div>

				<div>
					<Label htmlFor={fields.description.id}>Description</Label>
					<textarea
						{...getTextareaProps(fields.description)}
						className="font-blue w-full rounded border border-gray-300 px-3 py-2 text-black"
						rows={4}
					/>
					{fields.description.errors?.length && (
						<span className="text-red-500">{fields.description.errors}</span>
					)}
				</div>

				<Button type="submit">{registry ? 'Update' : 'Create'} Registry</Button>
			</Form>
		</div>
	)
}
