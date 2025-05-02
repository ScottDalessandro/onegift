import { Form } from 'react-router'

export default function NewList() {
	return (
		<div className="p-6">
			<h1 className="mb-6 text-2xl font-bold text-gray-900">Create New List</h1>

			<div className="mx-auto max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
				<Form method="post" className="space-y-6">
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
							required
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							placeholder="e.g., Birthday Wishlist"
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
							className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							placeholder="What is this list for?"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Privacy
						</label>
						<div className="mt-2 space-y-2">
							<div className="flex items-center">
								<input
									type="radio"
									name="privacy"
									id="private"
									value="private"
									defaultChecked
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
					</div>

					<div className="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Create List
						</button>
					</div>
				</Form>
			</div>
		</div>
	)
}
