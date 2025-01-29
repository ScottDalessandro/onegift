import { parseWithZod } from '@conform-to/zod'
import { parseFormData } from '@mjackson/form-data-parser'
import { type ActionFunctionArgs, data, redirect } from 'react-router'
import { requireUserId } from '#app/utils/auth.server'
import { prisma } from '#app/utils/db.server'
import { RegistrySchema } from './__registry-editor'

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await parseFormData(request) // note: this is not the same as request.formData(), it's a different parser that's more robust
	// and can handle file uploads and other multipart/form-data content types, this will be used for the file uploads in the future...

	const submission = parseWithZod(formData, {
		schema: RegistrySchema,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	// try {

	const registry = await prisma.registry.create({
		data: {
			...submission.value,
			userId,
		},
	})
	return redirect(`/registries/${registry.id}`)
	// } catch (error) {
	// 	console.error('Failed to create registry:', error)
	// 	return submission.reply({
	// 		formErrors: ['Failed to create registry. Please try again.'],
	// 	})
	// }
}
