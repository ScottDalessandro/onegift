// app/routes/registries/new.tsx
import {
	getFormProps,
	getInputProps,
	getSelectProps,
	getTextareaProps,
	type SubmissionResult,
	useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import {
	type ActionFunctionArgs,
	redirect,
	Form,
	useActionData,
} from 'react-router'

import { z } from 'zod'
import { Button } from '#app/components/ui/button'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'

type ActionData = SubmissionResult | undefined

const RegistrySchema = z.object({
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
	guestCount: z.number().min(1, 'Must have at least 1 guest'),
	description: z.string().optional(),
})

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: RegistrySchema,
	})
	// could use invariantResponse here...

	invariantResponse(
		submission.status === 'success',
		'Invalid form submission',
		{
			status: 400,
		},
	)

	try {
		const userId = await requireUserId(request)
		const registry = await prisma.registry.create({
			data: {
				...submission.value,
				userId,
			},
		})
		return redirect(`/registries/${registry.id}`)
	} catch (error) {
		console.error('Failed to create registry:', error)
		return submission.reply({
			formErrors: ['Failed to create registry. Please try again.'],
		})
	}
}

export default function NewRegistry() {
	const lastResult = useActionData<typeof action>() as ActionData

	const [form, fields] = useForm({
		id: 'registry-form',
		lastResult,
		constraint: getZodConstraint(RegistrySchema),
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: RegistrySchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<div className="mx-auto max-w-3xl p-8">
			<h1 className="mb-8 text-2xl font-bold">Create New Registry</h1>

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
						placeholder={new Date().toISOString().split('T')[0]}
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

				<Button type="submit">Create Registry</Button>
			</Form>
		</div>
	)
}
