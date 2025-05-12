import { Form, useLoaderData, useNavigation, redirect } from 'react-router'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'

export async function loader({ params }: { params: any }) {
	const list = await prisma.list.findUnique({
		where: { id: params.id },
		include: {
			event: true,
			listType: true,
		},
	})

	if (!list) {
		throw new Response('List not found', { status: 404 })
	}

	return {
		id: list.id,
		title: list.title,
		description: list.description,
		contributionDate: list.contributionDate.toISOString().split('T')[0],
		listTypeId: list.listTypeId,
		eventName: list.event?.name,
		eventDate: list.event?.date.toISOString().split('T')[0],
		eventStartTime: list.event?.startTime,
		eventEndTime: list.event?.endTime,
		eventLocation: list.event?.location,
		eventDescription: list.event?.description,
	}
}

export async function action({
	request,
	params,
}: {
	request: Request
	params: any
}) {
	const userId = await requireUserId(request)
	const listId = params.id
	if (!listId) throw new Response('List ID is required', { status: 400 })
	const formData = await request.formData()

	const title = (formData.get('title') ?? '') as string
	const description = (formData.get('description') ?? '') as string
	const contributionDate = (formData.get('contributionDate') ?? '') as string
	const listTypeId = (formData.get('listTypeId') ?? '') as string
	const eventName = (formData.get('eventName') ?? '') as string
	const eventDate = (formData.get('eventDate') ?? '') as string
	const eventStartTime = (formData.get('eventStartTime') ?? '') as string
	const eventEndTime = (formData.get('eventEndTime') ?? '') as string
	const eventLocation = (formData.get('eventLocation') ?? '') as string
	const eventDescription = (formData.get('eventDescription') ?? '') as string

	// Find the list and its event
	const list = await prisma.list.findFirst({
		where: { id: listId, ownerId: userId },
		include: { event: true },
	})
	if (!list) throw new Response('List not found', { status: 404 })

	let eventId = list.eventId
	if (eventId) {
		// Update existing event
		await prisma.event.update({
			where: { id: eventId },
			data: {
				name: eventName,
				date: new Date(eventDate),
				startTime: eventStartTime || null,
				endTime: eventEndTime || null,
				location: eventLocation || null,
				description: eventDescription || null,
			},
		})
	} else {
		// Create new event
		const event = await prisma.event.create({
			data: {
				name: eventName,
				date: new Date(eventDate),
				startTime: eventStartTime || null,
				endTime: eventEndTime || null,
				location: eventLocation || null,
				description: eventDescription || null,
			},
		})
		eventId = event.id
	}

	// Update list
	await prisma.list.update({
		where: { id: listId, ownerId: userId },
		data: {
			title,
			description: description || null,
			contributionDate: new Date(contributionDate),
			listTypeId,
			eventId,
		},
	})

	return redirect(`/dashboard/lists/${listId}`)
}

export default function EditRegistryDetails() {
	const data = useLoaderData<typeof loader>()
	const navigation = useNavigation()
	const isSubmitting = navigation.state === 'submitting'

	return (
		<div className="container mx-auto max-w-xl py-8">
			<h1 className="mb-6 text-2xl font-bold">Edit Registry Details</h1>
			<Form method="post" className="space-y-6 rounded-lg bg-white p-6 shadow">
				<div>
					<label className="mb-1 block text-sm font-medium" htmlFor="title">
						Registry Name
					</label>
					<input
						id="title"
						name="title"
						type="text"
						defaultValue={data.title}
						required
						className="w-full rounded border px-3 py-2"
					/>
				</div>

				<div>
					<label
						className="mb-1 block text-sm font-medium"
						htmlFor="description"
					>
						Description
					</label>
					<textarea
						id="description"
						name="description"
						defaultValue={data.description || ''}
						className="w-full rounded border px-3 py-2"
						rows={3}
					/>
				</div>

				<div>
					<label
						className="mb-1 block text-sm font-medium"
						htmlFor="contributionDate"
					>
						Contribution Deadline
					</label>
					<input
						id="contributionDate"
						name="contributionDate"
						type="date"
						defaultValue={data.contributionDate}
						required
						className="w-full rounded border px-3 py-2"
					/>
				</div>

				<div>
					<label
						className="mb-1 block text-sm font-medium"
						htmlFor="listTypeId"
					>
						Registry Type
					</label>
					<select
						id="listTypeId"
						name="listTypeId"
						defaultValue={data.listTypeId}
						required
						className="w-full rounded border px-3 py-2"
					>
						<option value="birthday">Birthday</option>
						<option value="wedding">Wedding</option>
						<option value="baby-shower">Baby Shower</option>
						<option value="other">Other</option>
					</select>
				</div>

				<div className="border-t border-gray-200 pt-6">
					<h3 className="mb-4 text-lg font-medium">Event Details</h3>

					<div>
						<label
							className="mb-1 block text-sm font-medium"
							htmlFor="eventName"
						>
							Event Name
						</label>
						<input
							id="eventName"
							name="eventName"
							type="text"
							defaultValue={data.eventName}
							required
							className="w-full rounded border px-3 py-2"
						/>
					</div>

					<div>
						<label
							className="mb-1 block text-sm font-medium"
							htmlFor="eventDate"
						>
							Event Date
						</label>
						<input
							id="eventDate"
							name="eventDate"
							type="date"
							defaultValue={data.eventDate}
							required
							className="w-full rounded border px-3 py-2"
						/>
					</div>

					<div>
						<label
							className="mb-1 block text-sm font-medium"
							htmlFor="eventStartTime"
						>
							Event Start Time (optional)
						</label>
						<input
							id="eventStartTime"
							name="eventStartTime"
							type="time"
							defaultValue={data.eventStartTime || ''}
							className="w-full rounded border px-3 py-2"
						/>
					</div>

					<div>
						<label
							className="mb-1 block text-sm font-medium"
							htmlFor="eventEndTime"
						>
							Event End Time (optional)
						</label>
						<input
							id="eventEndTime"
							name="eventEndTime"
							type="time"
							defaultValue={data.eventEndTime || ''}
							className="w-full rounded border px-3 py-2"
						/>
					</div>

					<div>
						<label
							className="mb-1 block text-sm font-medium"
							htmlFor="eventLocation"
						>
							Event Location (optional)
						</label>
						<input
							id="eventLocation"
							name="eventLocation"
							type="text"
							defaultValue={data.eventLocation || ''}
							className="w-full rounded border px-3 py-2"
							placeholder="e.g., 123 Main St, City, State"
						/>
					</div>

					<div>
						<label
							className="mb-1 block text-sm font-medium"
							htmlFor="eventDescription"
						>
							Event Description (optional)
						</label>
						<textarea
							id="eventDescription"
							name="eventDescription"
							defaultValue={data.eventDescription || ''}
							className="w-full rounded border px-3 py-2"
							rows={3}
						/>
					</div>
				</div>

				<div className="flex gap-2">
					<button
						type="submit"
						className="rounded bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Saving...' : 'Save Changes'}
					</button>
					<a
						href={`/dashboard/lists/${data.id}`}
						className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
					>
						Cancel
					</a>
				</div>
			</Form>
		</div>
	)
}
