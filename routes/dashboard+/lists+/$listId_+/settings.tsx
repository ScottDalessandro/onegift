import { useLoaderData, Form } from 'react-router'

interface List {
	id: string
	title: string
	description: string
	privacy: 'private' | 'shared'
	shareUrl?: string
}

export async function loader({ params }: { params: { listId_: string } }) {
	// TODO: Fetch list details from your database
	const list: List = {
		id: params.listId_,
		title: 'My List',
		description: 'A sample list description',
		privacy: 'private',
		shareUrl: 'https://example.com/lists/shared/abc123',
	}

	return { list }
}

export default function ListSettings() {
	const { list } = useLoaderData() as { list: List }

	return (
		<div className="p-6">
			<div className="mx-auto max-w-2xl space-y-8">
				<section className="rounded-lg border bg-white p-6 shadow-sm">
					<h2 className="text-lg font-medium text-gray-900">List Details</h2>
					<p className="mt-1 text-sm text-gray-500">
						Update your list's basic information.
					</p>

					<Form method="post" className="mt-6 space-y-6">
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700"
							>
								List Title
							</label>
							<input
								type="text"
								name="title"
								id="title"
								defaultValue={list.title}
								required
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label
								htmlFor="description"
								className="block text-sm font-medium text-gray-700"
							>
								Description
							</label>
							<textarea
								name="description"
								id="description"
								rows={3}
								defaultValue={list.description}
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
						</div>

						<div className="flex justify-end">
							<button
								type="submit"
								className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							>
								Save Changes
							</button>
						</div>
					</Form>
				</section>

				<section className="rounded-lg border bg-white p-6 shadow-sm">
					<h2 className="text-lg font-medium text-gray-900">
						Sharing Settings
					</h2>
					<p className="mt-1 text-sm text-gray-500">
						Control who can view your list.
					</p>

					<Form method="post" className="mt-6 space-y-6">
						<div className="space-y-2">
							<div className="flex items-center">
								<input
									type="radio"
									name="privacy"
									id="private"
									value="private"
									defaultChecked={list.privacy === 'private'}
									className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<label
									htmlFor="private"
									className="ml-3 block text-sm text-gray-700"
								>
									Private - Only you can see this list
								</label>
							</div>
							<div className="flex items-center">
								<input
									type="radio"
									name="privacy"
									id="shared"
									value="shared"
									defaultChecked={list.privacy === 'shared'}
									className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<label
									htmlFor="shared"
									className="ml-3 block text-sm text-gray-700"
								>
									Shared - People with the link can view this list
								</label>
							</div>
						</div>

						{list.privacy === 'shared' && (
							<div className="rounded-md bg-gray-50 p-4">
								<div className="flex items-center">
									<input
										type="text"
										readOnly
										value={list.shareUrl}
										className="block w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
									<button
										type="button"
										className="ml-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
										onClick={async () => {
											try {
												await navigator.clipboard.writeText(list.shareUrl || '')
											} catch (error) {
												console.error('Failed to copy to clipboard:', error)
											}
										}}
									>
										Copy Link
									</button>
								</div>
							</div>
						)}

						<div className="flex justify-end">
							<button
								type="submit"
								className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							>
								Update Privacy
							</button>
						</div>
					</Form>
				</section>

				<section className="rounded-lg border border-red-200 bg-white p-6">
					<h2 className="text-lg font-medium text-red-700">Danger Zone</h2>
					<p className="mt-1 text-sm text-gray-500">
						Permanently delete this list and all its items.
					</p>

					<div className="mt-6">
						<button
							type="button"
							className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
						>
							Delete List
						</button>
					</div>
				</section>
			</div>
		</div>
	)
}
