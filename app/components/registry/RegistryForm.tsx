import {
	useForm,
	getFormProps,
	getInputProps,
	getSelectProps,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form } from 'react-router'
import { z } from 'zod'
import { Card } from '#app/components/ui/card'
import { ErrorList } from '#app/components/forms'
import { useState } from 'react'

const listTypes = ['birthday', 'wedding', 'baby-shower', 'other'] as const

export const RegistryFormSchema = z
	.object({
		title: z.string().min(1, 'Registry name is required'),
		description: z.string().optional(),
		contributionDate: z
			.string()
			.min(1, 'Contribution deadline is required')
			.refine((str) => !isNaN(Date.parse(str)), {
				message: 'Invalid date format',
			}),
		listTypeId: z.enum(listTypes, {
			errorMap: () => ({ message: 'Please select a list type' }),
		}),
		eventName: z.string().optional(),
		eventDate: z.string().optional(),
		eventStartTime: z.string().optional(),
		eventEndTime: z.string().optional(),
		eventLocation: z.string().optional(),
		eventDescription: z.string().optional(),
		invitees: z
			.array(
				z.object({
					name: z.string().min(1, 'Name is required'),
					email: z.string().email('Invalid email address'),
				}),
			)
			.optional(),
		addEvent: z.boolean().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.addEvent) {
			if (!data.eventName || data.eventName.trim() === '') {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['eventName'],
					message: 'Event name is required',
				})
			}
			if (!data.eventDate || isNaN(Date.parse(data.eventDate))) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['eventDate'],
					message: 'Event date is required',
				})
			}
		}
	})

export function RegistryForm() {
	const [showEvent, setShowEvent] = useState(false)
	const [form, fields] = useForm({
		id: 'registry-form',
		constraint: getZodConstraint(RegistryFormSchema),
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: RegistryFormSchema })
		},
		defaultValue: { addEvent: false },
	})

	return (
		<div className="mx-auto max-w-2xl py-8">
			<h1 className="mb-2 text-2xl font-bold">Create Your Registry</h1>
			<p className="mb-8 text-gray-600">
				Let's start with the basics. You can always come back and edit these
				details later.
			</p>

			<Card className="p-6">
				<div className="space-y-6">
					<div>
						<h2 className="mb-2 text-xl font-semibold">Registry Basics</h2>
						<p className="mb-6 text-gray-600">
							Tell us about your registry and who it's for.
						</p>
					</div>

					<Form method="post" className="space-y-6" {...getFormProps(form)}>
						<div className="space-y-4">
							<div>
								<label
									htmlFor={fields.title.id}
									className="mb-1 block text-sm font-medium text-gray-700"
								>
									Registry Name
								</label>
								<input
									{...getInputProps(fields.title, { type: 'text' })}
									placeholder="e.g., Emma's 5th Birthday"
									className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
								/>
								<div className="min-h-[20px] px-4 pt-1">
									{fields.title.errors && (
										<ErrorList errors={fields.title.errors} />
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor={fields.description.id}
									className="mb-1 block text-sm font-medium text-gray-700"
								>
									Description (Optional)
								</label>
								<textarea
									{...getInputProps(fields.description, { type: 'text' })}
									placeholder="Tell us about your registry..."
									className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
									rows={3}
								/>
								<div className="min-h-[20px] px-4 pt-1">
									{fields.description.errors && (
										<ErrorList errors={fields.description.errors} />
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor={fields.listTypeId.id}
									className="mb-1 block text-sm font-medium text-gray-700"
								>
									Registry Type
								</label>
								<div className="relative">
									<select
										{...getSelectProps(fields.listTypeId)}
										className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
									>
										<option value="">Select registry type</option>
										{listTypes.map((type) => (
											<option key={type} value={type}>
												{type
													.split('-')
													.map(
														(word) =>
															word.charAt(0).toUpperCase() + word.slice(1),
													)
													.join(' ')}
											</option>
										))}
									</select>
									<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
										<svg
											className="h-4 w-4 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</div>
									<div className="min-h-[20px] px-4 pt-1">
										{fields.listTypeId.errors && (
											<ErrorList errors={fields.listTypeId.errors} />
										)}
									</div>
								</div>
							</div>

							<div>
								<label
									htmlFor={fields.contributionDate.id}
									className="mb-1 block text-sm font-medium text-gray-700"
								>
									Contribution Deadline
								</label>
								<input
									{...getInputProps(fields.contributionDate, { type: 'date' })}
									className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
								/>
								<div className="min-h-[20px] px-4 pt-1">
									{fields.contributionDate.errors && (
										<ErrorList errors={fields.contributionDate.errors} />
									)}
								</div>
							</div>

							<div className="flex items-center gap-2">
								<input
									id="addEvent"
									name="addEvent"
									type="checkbox"
									checked={showEvent}
									onChange={(e) => setShowEvent(e.target.checked)}
									className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
								/>
								<label
									htmlFor="addEvent"
									className="text-sm font-medium text-gray-700"
								>
									Add an event to this registry?
								</label>
							</div>
						</div>

						{showEvent && (
							<div className="border-t border-gray-200 pt-6">
								<h3 className="mb-4 text-lg font-medium">Event Details</h3>

								<div>
									<label
										htmlFor={fields.eventName.id}
										className="mb-1 block text-sm font-medium text-gray-700"
									>
										Event Name
									</label>
									<input
										{...getInputProps(fields.eventName, { type: 'text' })}
										placeholder="e.g., Birthday Party"
										className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
									/>
									<div className="min-h-[20px] px-4 pt-1">
										{fields.eventName.errors && (
											<ErrorList errors={fields.eventName.errors} />
										)}
									</div>
								</div>

								<div>
									<label
										htmlFor={fields.eventDate.id}
										className="mb-1 block text-sm font-medium text-gray-700"
									>
										Event Date
									</label>
									<input
										{...getInputProps(fields.eventDate, { type: 'date' })}
										className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
									/>
									<div className="min-h-[20px] px-4 pt-1">
										{fields.eventDate.errors && (
											<ErrorList errors={fields.eventDate.errors} />
										)}
									</div>
								</div>

								<div>
									<label
										htmlFor={fields.eventStartTime.id}
										className="mb-1 block text-sm font-medium text-gray-700"
									>
										Event Start Time (Optional)
									</label>
									<input
										{...getInputProps(fields.eventStartTime, {
											type: 'time',
										})}
										className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
									/>
									<div className="min-h-[20px] px-4 pt-1">
										{fields.eventStartTime.errors && (
											<ErrorList errors={fields.eventStartTime.errors} />
										)}
									</div>
								</div>

								<div>
									<label
										htmlFor={fields.eventEndTime.id}
										className="mb-1 block text-sm font-medium text-gray-700"
									>
										Event End Time (Optional)
									</label>
									<input
										{...getInputProps(fields.eventEndTime, {
											type: 'time',
										})}
										className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
									/>
									<div className="min-h-[20px] px-4 pt-1">
										{fields.eventEndTime.errors && (
											<ErrorList errors={fields.eventEndTime.errors} />
										)}
									</div>
								</div>

								<div>
									<label
										htmlFor={fields.eventLocation.id}
										className="mb-1 block text-sm font-medium text-gray-700"
									>
										Event Location (Optional)
									</label>
									<input
										{...getInputProps(fields.eventLocation, {
											type: 'text',
										})}
										placeholder="e.g., 123 Main St, City, State"
										className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
									/>
									<div className="min-h-[20px] px-4 pt-1">
										{fields.eventLocation.errors && (
											<ErrorList errors={fields.eventLocation.errors} />
										)}
									</div>
								</div>

								<div>
									<label
										htmlFor={fields.eventDescription.id}
										className="mb-1 block text-sm font-medium text-gray-700"
									>
										Event Description (Optional)
									</label>
									<textarea
										{...getInputProps(fields.eventDescription, {
											type: 'text',
										})}
										placeholder="Tell us about your event..."
										className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
										rows={3}
									/>
									<div className="min-h-[20px] px-4 pt-1">
										{fields.eventDescription.errors && (
											<ErrorList errors={fields.eventDescription.errors} />
										)}
									</div>
								</div>
							</div>
						)}

						<div className="pt-4">
							<button
								type="submit"
								className="flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
							>
								Continue
							</button>
						</div>
					</Form>
				</div>
			</Card>
		</div>
	)
}
