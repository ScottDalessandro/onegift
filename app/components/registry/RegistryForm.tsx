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

const eventTypes = ['Birthday', 'Holiday', 'Graduation', 'Other'] as const

export const RegistryFormSchema = z.object({
	registryName: z.string().min(1, 'Registry name is required'),
	childName: z.string().min(1, "Child's name is required"),
	eventDate: z
		.string()
		.min(1, 'Event date is required')
		.refine((str) => !isNaN(Date.parse(str)), {
			message: 'Invalid date format',
		}),
	eventType: z.enum(eventTypes, {
		errorMap: () => ({ message: 'Please select an event type' }),
	}),
})

export function RegistryForm() {
	const [form, fields] = useForm({
		id: 'registry-form',
		constraint: getZodConstraint(RegistryFormSchema),
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: RegistryFormSchema })
		},
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
									htmlFor={fields.registryName.id}
									className="mb-1 block text-sm font-medium text-gray-700"
								>
									Registry Name
								</label>
								<input
									{...getInputProps(fields.registryName, { type: 'text' })}
									placeholder="e.g., Emma's 5th Birthday"
									className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
								/>
								<div className="min-h-[20px] px-4 pt-1">
									{fields.registryName.errors && (
										<ErrorList errors={fields.registryName.errors} />
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor={fields.childName.id}
									className="mb-1 block text-sm font-medium text-gray-700"
								>
									Child's Name
								</label>
								<input
									{...getInputProps(fields.childName, { type: 'text' })}
									placeholder="e.g., Emma"
									className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
								/>
								<div className="min-h-[20px] px-4 pt-1">
									{fields.childName.errors && (
										<ErrorList errors={fields.childName.errors} />
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
									htmlFor={fields.eventType.id}
									className="mb-1 block text-sm font-medium text-gray-700"
								>
									Event Type
								</label>
								<div className="relative">
									<select
										{...getSelectProps(fields.eventType)}
										className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
									>
										<option value="">Select event type</option>
										{eventTypes.map((type) => (
											<option key={type} value={type}>
												{type}
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
										{fields.eventType.errors && (
											<ErrorList errors={fields.eventType.errors} />
										)}
									</div>
								</div>
							</div>
						</div>

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
